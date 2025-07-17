import { EMAILS_PER_PAGE } from "../constants"; // Default emails per page
import supabase from "../database/supabase";
import { getAuthenticatedGmailClients } from "./gmailApiService.provider";

// We are not importing googleapis types due to heap memory issues.

// Minimal interfaces to define the shape of Google's objects for type safety
interface GmailHeader {
  name?: string | null;
  value?: string | null;
}

interface GmailMessagePart {
  mimeType?: string | null;
  filename?: string | null;
  body?: {
    data?: string | null;
  };
}

interface GmailMessagePayload {
  headers?: GmailHeader[] | null;
  parts?: GmailMessagePart[] | null;
  body?: {
    data?: string | null;
  };
  mimeType?: string | null;
}

interface GmailMessage {
  id?: string | null;
  threadId?: string | null;
  label_ids?: (string | null)[] | null;
  snippet?: string | null;
  internalDate?: string | null;
  payload?: GmailMessagePayload | null;
}

// Your ParsedEmailData interface remains the same
interface ParsedEmailData {
  gmail_account_id: string;
  app_user_id: string;
  gmail_message_id: string;
  gmail_thread_id: string;
  subject?: string;
  from_address?: string;
  from_name?: string;
  to_addresses?: string[];
  sent_date?: Date;
  received_date?: Date;
  snippet?: string;
  body_plain_text?: string;
  body_html?: string;
  is_unread?: boolean;
  is_starred?: boolean;
  is_important?: boolean;
  gmail_category_label_id?: string;
  has_attachments?: boolean;
  label_ids?: (string | null)[];
}

// Assuming gmail_v1.Gmail type is not available due to heap issues, we use 'any'
type GmailClient = any; // Replace with gmail_v1.Gmail if you can import the type
type MessageHeader = { id?: string | null; threadId?: string | null };

/**
 * Fetches a list of message IDs from Gmail, automatically handling pagination.
 * @param gmail - The authenticated Gmail API client.
 * @param maxEmails - The total maximum number of message IDs to fetch.
 * @param query - An optional Gmail search query string (e.g., 'in:inbox').
 * @returns A promise that resolves to an array of message header objects.
 */
export async function fetchAllMessageIds(
  gmail: GmailClient,
  maxEmails: number,
  query: string = ""
): Promise<MessageHeader[]> {
  let nextPageToken: string | undefined | null = undefined;
  const allMessageHeaders: MessageHeader[] = [];

  console.log(`Fetching up to ${maxEmails} message IDs...`);

  try {
    do {
      // Determine how many results to fetch in this specific API call
      const remaining = maxEmails - allMessageHeaders.length;
      const limit = Math.min(remaining, 500); // Gmail API maxResults is 500

      const response: any = await gmail.users.messages.list({
        userId: "me",
        maxResults: limit,
        pageToken: nextPageToken,
        q: query,
        // You can also add fields for efficiency if needed, though list is lightweight
        // fields: 'messages(id,threadId),nextPageToken',
      });

      const messages = response.data.messages;
      if (messages && messages.length > 0) {
        allMessageHeaders.push(...messages);
        console.log(
          `Fetched ${allMessageHeaders.length} / ${maxEmails} message IDs so far...`
        );
      }

      nextPageToken = response.data.nextPageToken;

      // Stop if we have enough emails or if there are no more pages
    } while (nextPageToken && allMessageHeaders.length < maxEmails);

    console.log(
      `Finished fetching. Total message IDs found: ${allMessageHeaders.length}`
    );
    return allMessageHeaders;
  } catch (error) {
    console.error("Error fetching message IDs from Gmail:", error);
    // Depending on your error handling strategy, you might want to re-throw
    // or return the headers fetched so far.
    throw new Error("Failed to fetch message ID list from Gmail.");
  }
}

// A generic helper function for running promises with limited concurrency
async function processInLimitedBatches<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  const executing = new Set<Promise<void>>();
  for (const item of items) {
    const promise = fn(item).then((result) => {
      results.push(result);
      executing.delete(promise);
    });
    executing.add(promise);
    if (executing.size >= limit) {
      await Promise.race(executing); // Wait for the fastest promise in the pool to finish
    }
  }
  await Promise.all(executing); // Wait for all remaining promises to finish
  return results;
}

// ... syncEmailsForAccount function ...
export async function syncEmailsForAccount(
  appUserId: string,
  gmailAccountId: string,
  maxEmails: number = 100
) {
  console.log(
    `Starting sync for user ${appUserId}, account ${gmailAccountId}...`
  );
  // ... (get gmail client and messageHeaders as before) ...
  const { gmail } = await getAuthenticatedGmailClients(
    appUserId,
    gmailAccountId
  );

  // 1. Get list of message IDs (e.g., 1000 of them)
  const messageHeaders = await fetchAllMessageIds(gmail, maxEmails); // A helper to get all IDs

  // 2. Process them with a concurrency limit
  const CONCURRENCY_LIMIT = 15; // A safe number, well below Google's limit of ~25-30
  console.log(
    `Fetching details for ${messageHeaders.length} emails with a concurrency of ${CONCURRENCY_LIMIT}...`
  );

  const parsedEmails = await processInLimitedBatches(
    messageHeaders,
    CONCURRENCY_LIMIT,
    async (header) => {
      if (!header.id) return null;
      try {
        const detailResponse = await gmail.users.messages.get({
          userId: "me",
          id: header.id,
          format: "full",
        });
        return parseGmailMessage(
          detailResponse.data as any,
          appUserId,
          gmailAccountId
        );
      } catch (error) {
        console.error(`Failed to fetch message ID ${header.id}:`, error);
        return null;
      }
    }
  );

  const validEmails = parsedEmails.filter((e) => e !== null);
  console.log(`Successfully parsed ${validEmails.length} emails.`);

  // 3. Upsert the results into Supabase in batches
  // Supabase (and most DBs) have a limit on how many rows you can upsert at once.
  // A batch size of 100-500 is usually safe.
  const BATCH_SIZE_DB = 250;
  for (let i = 0; i < validEmails.length; i += BATCH_SIZE_DB) {
    const batch = validEmails.slice(i, i + BATCH_SIZE_DB);
    // const emailsForDb = batch.map(({ labelIds, ...rest }) => rest); // Remove temporary fields

    const { error } = await supabase.from("emails").upsert(batch, {
      onConflict: "gmail_account_id, gmail_message_id",
      ignoreDuplicates: false,
    });
    if (error) {
      console.error("Supabase batch upsert error:", error);
      // Decide how to handle partial failure
    } else {
      console.log(`Upserted batch of ${batch.length} emails to DB.`);
    }
  }
}

/**
 * Helper function to parse a raw Gmail API message object into our desired format.
 * @param message - The message object, typed with our minimal interface.
 * @returns A structured ParsedEmailData object or null.
 */
function parseGmailMessage(
  message: GmailMessage,
  appUserId: string,
  gmailAccountId: string
): ParsedEmailData | null {
  if (!message.id || !message.threadId) return null;

  const getHeader = (name: string): string | undefined =>
    // --- FIX for TS7006 ---
    message.payload?.headers?.find((h: GmailHeader) => h.name === name)
      ?.value || undefined;

  const fromHeader = getHeader("From") || "";
  const fromMatch = fromHeader.match(/(.*)<(.*)>/);
  const from_name = fromMatch
    ? fromMatch[1].trim().replace(/"/g, "")
    : fromHeader;
  const from_address = fromMatch ? fromMatch[2].trim() : fromHeader;

  let body_plain_text = "";
  let body_html = "";
  if (message.payload?.parts) {
    // --- FIX for TS7006 ---
    const plainPart = message.payload.parts.find(
      (p: GmailMessagePart) => p.mimeType === "text/plain"
    );
    const htmlPart = message.payload.parts.find(
      (p: GmailMessagePart) => p.mimeType === "text/html"
    );
    if (plainPart?.body?.data)
      body_plain_text = Buffer.from(plainPart.body.data, "base64url").toString(
        "utf8"
      );
    if (htmlPart?.body?.data)
      body_html = Buffer.from(htmlPart.body.data, "base64url").toString("utf8");
  } else if (message.payload?.body?.data) {
    if (message.payload.mimeType === "text/plain") {
      body_plain_text = Buffer.from(
        message.payload.body.data,
        "base64url"
      ).toString("utf8");
    } else if (message.payload.mimeType === "text/html") {
      body_html = Buffer.from(message.payload.body.data, "base64url").toString(
        "utf8"
      );
    }
  }

  const label_ids = message.label_ids || [];

  return {
    gmail_account_id: gmailAccountId,
    app_user_id: appUserId,
    gmail_message_id: message.id,
    gmail_thread_id: message.threadId,
    subject: getHeader("Subject"),
    from_address,
    from_name,
    // --- FIX for TS7006 ---
    to_addresses: getHeader("To")
      ?.split(",")
      .map((s: string) => s.trim()),
    sent_date: new Date(getHeader("Date") || Date.now()),
    received_date: new Date(parseInt(message.internalDate || "0", 10)),
    snippet: message.snippet || undefined,
    body_plain_text,
    body_html,
    is_unread: label_ids.includes("UNREAD"),
    is_starred: label_ids.includes("STARRED"),
    is_important: label_ids.includes("IMPORTANT"),
    // --- FIX for TS7006 ---
    gmail_category_label_id:
      label_ids.find(
        (l: string | null) => typeof l === "string" && l.startsWith("CATEGORY_")
      ) || undefined,
    // --- FIX for TS7006 ---
    has_attachments: !!message.payload?.parts?.some(
      (p: GmailMessagePart) => p.filename && p.filename.length > 0
    ),
    label_ids,
  };
}

// Define an interface for the query options for better type safety
export interface GetEmailsOptions {
  appUserId: string;
  limit?: number;
  page?: number;
  category?: string; // e.g., 'CATEGORY_SOCIAL', 'CATEGORY_PROMOTIONS'
  isStarred?: boolean;
  isUnread?: boolean;
  accountId?: string; // Filter by a specific linked Gmail account
}

/**
 * Fetches a paginated list of emails from the database based on filter criteria.
 * @param options - The filtering and pagination options.
 * @returns A promise that resolves to an array of emails.
 */
export async function fetchEmailsFromDb(options: GetEmailsOptions) {
  const {
    appUserId,
    limit = EMAILS_PER_PAGE,
    page = 1,
    category,
    isStarred,
    isUnread,
    accountId,
  } = options;

  // Start building the query
  let query = supabase
    .from("emails")
    .select(
      `
      id,
      gmail_account_id,
      subject,
      from_name,
      snippet,
      received_date,
      is_unread,
      is_starred,
      has_attachments
    `
    ) // Select only the fields needed for the list view
    .eq("app_user_id", appUserId) // **SECURITY: Always filter by the authenticated user!**
    .eq("gmail_account_id", accountId)
    .order("received_date", { ascending: false }); // Default sort by most recent

  // Apply optional filters
  if (category) {
    query = query.eq("gmail_category_label_id", category);
  }
  if (isStarred !== undefined) {
    query = query.eq("is_starred", isStarred);
  }
  if (isUnread !== undefined) {
    query = query.eq("is_unread", isUnread);
  }

  // Apply pagination
  const offset = (page - 1) * limit;
  query = query.range(offset, offset + limit - 1);

  // Execute the query
  const { data, error } = await query;

  if (error) {
    console.error("Error fetching emails from DB:", error);
    throw new Error("Failed to fetch emails.");
  }

  return data || [];
}

/**
 * Fetches the full details of a single email from the database.
 * @param appUserId - The user's ID in your application.
 * @param emailId - The internal UUID of the email in your database.
 * @returns A promise that resolves to the full email object or null if not found.
 */
export async function fetchSingleEmailFromDb(
  appUserId: string,
  emailId: string
) {
  const { data, error } = await supabase
    .from("emails")
    .select("*") // Select all details for the single view
    .eq("app_user_id", appUserId) // **SECURITY: Ensure this user owns this email!**
    .eq("id", emailId)
    .single(); // Expect only one result

  if (error) {
    // 'PGRST116' is the code for "0 rows found", which is not a server error.
    if (error.code === "PGRST116") {
      return null;
    }
    console.error(`Error fetching single email (id: ${emailId}):`, error);
    throw new Error("Failed to fetch email details.");
  }
  console.log(data);

  // TODO: You might also want to join and fetch ai_data here
  // e.g., const { data: aiData } = await supabase.from('ai_data').select('*').eq('email_id', emailId).single();
  // and then combine them before returning.

  return data;
}
