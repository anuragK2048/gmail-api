// src/jobs/emailSync.worker.ts
import { Worker, Job, WorkerOptions } from "bullmq";
import { REDIS_URL } from "../config"; // Your Redis connection URL
// Import your email parsing and saving logic from email.service.ts
import { parseGmailMessage, upsertEmailsToDb } from "../services/email.service";
import { getAuthenticatedGmailClients } from "../services/gmailApiService.provider";
import supabase from "../database/supabase";

const workerOptions: WorkerOptions = {
  connection: REDIS_URL
    ? {
        host: new URL(REDIS_URL).hostname,
        port: Number(new URL(REDIS_URL).port),
        password: new URL(REDIS_URL).password,
      }
    : {
        host: "localhost",
        port: 6379,
      },
  concurrency: 5,
  limiter: {
    max: 10,
    duration: 1000,
  },
};

// const redisConnection = {
//   connection: REDIS_URL ? new URL(REDIS_URL) : undefined,
// };

// The main job processing function
const processSyncJob = async (job: Job) => {
  const { appUserId, gmailAccountId, startHistoryId, newHistoryId } = job.data;
  console.log(
    `Worker processing job ${job.id}: Syncing account ${gmailAccountId} from historyId ${startHistoryId}`
  );

  try {
    const { gmail } = await getAuthenticatedGmailClients(
      appUserId,
      gmailAccountId
    );

    // 1. Use history.list to get all changes between the old and new history IDs
    const historyResponse = await gmail.users.history.list({
      userId: "me",
      startHistoryId: startHistoryId,
    });

    const historyRecords = historyResponse.data.history;
    if (!historyRecords || historyRecords.length === 0) {
      console.log(
        `No new history found for job ${job.id}. Updating historyId.`
      );
      // Even if there are no messages, we update the history ID to the latest point
      await supabase
        .from("gmail_accounts")
        .update({ last_sync_history_id: newHistoryId })
        .eq("id", gmailAccountId);
      return;
    }

    // 2. Extract unique message IDs that were added
    const addedMessageIds = new Set<string>();
    historyRecords.forEach((record: any) => {
      record.messagesAdded?.forEach((msg: any) => {
        if (msg.message?.id) {
          addedMessageIds.add(msg.message.id);
        }
      });
      // You can also process messagesDeleted, labelsAdded, etc. here
    });

    if (addedMessageIds.size === 0) {
      console.log(
        `History records found for job ${job.id}, but no new messages. Updating historyId.`
      );
      await supabase
        .from("gmail_accounts")
        .update({ last_sync_history_id: newHistoryId })
        .eq("id", gmailAccountId);
      return;
    }

    console.log(
      `Job ${job.id}: Found ${addedMessageIds.size} new message(s) to fetch.`
    );

    // 3. Fetch, parse, and save these new messages
    // We can reuse the concurrency logic from the initial sync
    const newEmails = [];
    for (const messageId of addedMessageIds) {
      const detailResponse = await gmail.users.messages.get({
        userId: "me",
        id: messageId,
        format: "full",
      });
      const parsed = parseGmailMessage(
        detailResponse.data as any,
        appUserId,
        gmailAccountId
      );
      if (parsed) newEmails.push(parsed);
    }

    // You'd also call your AI labeling function here on `newEmails`
    // await assignLabelsToEmails(appUserId, labels, newEmails);

    // 4. Update the DB
    if (newEmails.length > 0) {
      // The select() in upsertEmailsToDb returns data needed for AI processing
      const upsertedEmailsForAI = await upsertEmailsToDb(newEmails);

      // 5. Now you can trigger AI labeling on the successfully saved emails
      // await assignLabelsToEmails(appUserId, userLabels, upsertedEmailsForAI);
    }

    // 5. CRITICAL: Update the last_sync_history_id to the new ID for the next sync
    await supabase
      .from("gmail_accounts")
      .update({ last_sync_history_id: newHistoryId })
      .eq("id", gmailAccountId);

    console.log(`Worker for job ${job.id} finished successfully.`);
  } catch (error) {
    console.error(`Worker for job ${job.id} failed:`, error);
    // Let BullMQ handle retries based on its configuration
    throw error;
  }
};

// Create and start the worker
console.log("Starting Gmail Sync Worker...");
new Worker("gmail-sync", processSyncJob, workerOptions);
