// backend: get-email.js

import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

// Replace with your credentials and configuration
const CLIENT_ID = process.env.VITE_GCLIENT_ID;
const CLIENT_SECRET = process.env.VITE_GCLIENT_SECRET;
const REFRESH_TOKEN = process.env.VITE_GREFRESH_TOKEN;
const REDIRECT_URI = "http://localhost:3000/oauth2callback"; // Or whatever you set in the Google Cloud Console
// console.log(
//     `client: ${CLIENT_ID}\nsercret: ${CLIENT_SECRET}\nrefresh: ${REFRESH_TOKEN}`
// );


async function getRecentEmails() {
    let emailsArray = [];
    try {
        const oAuth2Client = new OAuth2Client(
            CLIENT_ID,
            CLIENT_SECRET,
            REDIRECT_URI
        );
        oAuth2Client.setCredentials({
            refresh_token: REFRESH_TOKEN,
        });

        const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

        const res = await gmail.users.messages.list({
            userId: "me",
            maxResults: 5, // Get the last 30 emails
        });

        const messages = res.data.messages;

        if (messages && messages.length > 0) {
            for (const message of messages) {
                let emailObj = {};
                const messageDetails = await gmail.users.messages.get({
                    userId: "me",
                    id: message.id,
                    format: "full", // Get the full message details
                });

                const headers = messageDetails.data.payload.headers;
                const subject =
                    headers.find((header) => header.name === "Subject")
                        ?.value || "No Subject";
                const from =
                    headers.find((header) => header.name === "From")?.value ||
                    "Unknown Sender";
                const date =
                    headers.find((header) => header.name === "Date")?.value ||
                    "Unknown Date";

                console.log("---------------------------");
                console.log("Subject:", subject);
                console.log("From:", from);
                console.log("Date:", date);
                emailObj.subject = subject;
                emailObj.from = from;
                emailObj.date = date;

                // Get labels for this message
                emailObj.labels = messageDetails.data.labelIds || [];
                console.log("Labels:", emailObj.labels);

                // Get the message body - prioritize HTML content first
                let body = "";

                // First try to find HTML content
                if (messageDetails.data.payload.parts) {
                    // Try to find HTML part first
                    for (const part of messageDetails.data.payload.parts) {
                        if (part.mimeType === "text/html" && part.body.data) {
                            body = Buffer.from(
                                part.body.data
                                    .replace(/-/g, "+")
                                    .replace(/_/g, "/"),
                                "base64"
                            ).toString("utf8");
                            break;
                        } else if (part.parts) {
                            // Handle nested multipart messages
                            for (const nestedPart of part.parts) {
                                if (
                                    nestedPart.mimeType === "text/html" &&
                                    nestedPart.body.data
                                ) {
                                    body = Buffer.from(
                                        nestedPart.body.data
                                            .replace(/-/g, "+")
                                            .replace(/_/g, "/"),
                                        "base64"
                                    ).toString("utf8");
                                    break;
                                }
                            }
                            if (body) break;
                        }
                    }

                    // If no HTML found, get plain text and convert to simple HTML
                    if (!body) {
                        for (const part of messageDetails.data.payload.parts) {
                            if (
                                part.mimeType === "text/plain" &&
                                part.body.data
                            ) {
                                const plainText = Buffer.from(
                                    part.body.data
                                        .replace(/-/g, "+")
                                        .replace(/_/g, "/"),
                                    "base64"
                                ).toString("utf8");
                                // Convert plain text to simple HTML
                                body = `<div style="white-space: pre-wrap;">${plainText}</div>`;
                                break;
                            } else if (part.parts) {
                                // Handle nested multipart messages
                                for (const nestedPart of part.parts) {
                                    if (
                                        nestedPart.mimeType === "text/plain" &&
                                        nestedPart.body.data
                                    ) {
                                        const plainText = Buffer.from(
                                            nestedPart.body.data
                                                .replace(/-/g, "+")
                                                .replace(/_/g, "/"),
                                            "base64"
                                        ).toString("utf8");
                                        // Convert plain text to simple HTML
                                        body = `<div style="white-space: pre-wrap;">${plainText}</div>`;
                                        break;
                                    }
                                }
                                if (body) break;
                            }
                        }
                    }
                } else if (
                    messageDetails.data.payload.body &&
                    messageDetails.data.payload.body.data
                ) {
                    // Handle non-multipart messages
                    const decodedBody = Buffer.from(
                        messageDetails.data.payload.body.data
                            .replace(/-/g, "+")
                            .replace(/_/g, "/"),
                        "base64"
                    ).toString("utf8");

                    if (messageDetails.data.payload.mimeType === "text/html") {
                        body = decodedBody;
                    } else {
                        // Convert plain text to simple HTML
                        body = `<div style="white-space: pre-wrap;">${decodedBody}</div>`;
                    }
                }

                if (body) {
                    console.log("Body (HTML):", body);
                    emailObj.body = body;
                } else {
                    console.log("Body: No body found");
                    emailObj.body = "<div>No content available</div>";
                }

                // Add this email to our array instead of returning immediately
                emailsArray.push(emailObj);
            }

            // Return the array of emails after processing all messages
            return emailsArray;
        } else {
            console.log("No messages found.");
            return [];
        }
    } catch (error) {
        console.error("Error:", error);
        return { error: error.message };
    }
}

export default getRecentEmails;
