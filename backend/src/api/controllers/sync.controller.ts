// src/api/controllers/sync.controller.ts
import { Request, Response, NextFunction } from "express";
import { asyncWrapper } from "../../middleware/asyncWrapper";
import { getLinkedAccountsForUser } from "../../database/gmail_accounts.db";
import { startWatchForAccount } from "../../services/sync.service";
// In a real app, you would import a function to add a job to your queue (e.g., BullMQ)
// import { addGmailSyncJob } from '../../jobs/emailSync.queue';

export const handleGmailNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Log the raw request for debugging (optional but recommended initially)
    console.log("Received a POST request on /gmail-webhook");
    console.log("Headers:", JSON.stringify(req.headers, null, 2));
    console.log("Body:", JSON.stringify(req.body, null, 2));

    // 2. Acknowledge the message IMMEDIATELY.
    res.status(204).send();

    // 3. Process the payload.
    const pubSubMessage = req.body.message;
    if (!pubSubMessage || !pubSubMessage.data) {
      console.warn("Webhook received but no message data found.");
      return; // Exit gracefully
    }

    // 4. Decode the data from Base64.
    const decodedData = JSON.parse(
      Buffer.from(pubSubMessage.data, "base64").toString("utf8")
    );

    const userEmailAddress: string = decodedData.emailAddress;
    const newHistoryId: string = decodedData.historyId;

    console.log(
      `Notification received for user: ${userEmailAddress}, New History ID: ${newHistoryId}`
    );

    // // 5. Trigger your background sync logic.
    // // This is the most important step for scalability.
    // // DO NOT run the full sync here. Add a job to a queue.
    // // The job will then fetch the user's last_sync_history_id from the DB
    // // and call gmail.users.history.list() to get the actual changes.
    // // await addGmailSyncJob({ emailAddress: userEmailAddress, newHistoryId: newHistoryId });
    // console.log(`TODO: Add a background job to sync changes for ${userEmailAddress} starting from their last known history ID up to ${newHistoryId}.`);
  } catch (error) {
    console.error("Error in /gmail-webhook:", error);
    // We've already sent a 204 response, so we can only log the error server-side.
  }
};

export const handleWatchStart = asyncWrapper(
  async (req: Request, res: Response) => {
    const appUserId = req.session.userId!;
    const emailAccounts = await getLinkedAccountsForUser(appUserId);

    const startPromises = emailAccounts.map((account) =>
      startWatchForAccount(appUserId, account.id)
    );
    await Promise.allSettled(startPromises);

    res
      .status(200)
      .json({ message: "Started watching for emails successfully" });
  }
);
