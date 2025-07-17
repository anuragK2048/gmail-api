// src/services/email.service.ts
import { EMAILS_PER_PAGE } from "../constants"; // Default emails per page
import supabase from "../database/supabase";

// src/services/email.service.ts
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

// ... syncEmailsForAccount function ...
export async function syncEmailsForAccount(
  appUserId: string,
  gmailAccountId: string,
  maxEmails: number = 10
) {
  console.log(
    `Starting sync for user ${appUserId}, account ${gmailAccountId}...`
  );
  // 'gmail' will be of type 'any' because of your workaround
  const { gmail }: { gmail: any } = await getAuthenticatedGmailClients(
    appUserId,
    gmailAccountId
  );

  // 1. Get a list of message IDs
  const listResponse = await gmail.users.messages.list({
    userId: "me",
    maxResults: maxEmails,
  });

  // Type the message headers array
  const messageHeaders: { id?: string | null; threadId?: string | null }[] =
    listResponse.data.messages;
  if (!messageHeaders || messageHeaders.length === 0) {
    console.log("No new messages found to sync.");
    return;
  }

  // 2. Prepare to fetch full details for each message
  // --- FIX for TS7006 ---
  const emailPromises = messageHeaders.map(
    async (message: { id?: string | null }) => {
      if (!message.id) return null;

      try {
        const detailResponse = await gmail.users.messages.get({
          userId: "me",
          id: message.id,
          format: "full",
        });
        // Cast the response data to your defined minimal interface
        const gmailMessage = detailResponse.data as GmailMessage;
        return parseGmailMessage(gmailMessage, appUserId, gmailAccountId);
      } catch (error) {
        console.error(
          `Failed to fetch or parse message ID ${message.id}:`,
          error
        );
        return null;
      }
    }
  );

  // 3. Fetch and parse all emails in parallel
  const parsedEmails = (await Promise.all(emailPromises)).filter(
    (email): email is ParsedEmailData => email !== null
  );

  if (parsedEmails.length === 0) {
    console.log("No emails were successfully parsed.");
    return;
  }

  // 4. Insert/update the data into Supabase
  // `upsert` is perfect here: it inserts a new record, or updates an existing one
  // if a record with the same unique constraint (gmail_account_id, gmail_message_id) already exists.
  const { data, error } = await supabase
    .from("emails")
    .upsert(parsedEmails, {
      onConflict: "gmail_account_id, gmail_message_id", // Your unique constraint
      ignoreDuplicates: false, // Set to false to ensure updates happen
    })
    .select("id"); // Optionally select some data back

  if (error) {
    console.error("Supabase upsert error:", error);
    throw new Error("Failed to save emails to the database.");
  }

  console.log(
    `Sync complete. Successfully upserted ${data?.length || 0} emails.`
  );
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
