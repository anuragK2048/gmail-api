import { htmlToText } from "html-to-text";
import { OpenAI } from "openai";

export default async function analyzeEmailWithLLM(emailData, predefinedLabels) {
  // 1. Pre-process: Convert HTML body to clean plain text using html-to-text
  let plainTextBody = "";
  if (emailData.htmlBody) {
    plainTextBody = htmlToText(emailData.htmlBody, {
      wordwrap: 120, // Enable some word wrapping for better readability if needed, can also be false
      selectors: [
        // Option 1: Completely skip links (removes link text and href)
        { selector: "a", format: "skip" },

        // Option 2: Keep link text but remove the href (comment out Option 1 if using this)
        // { selector: 'a', format: 'inline' }, // This keeps the text content of the <a> tag

        { selector: "img", format: "skip" }, // Skip images
        {
          selector: "ul > li",
          format: "listItem",
          options: { itemPrefix: "- " },
        },
        {
          selector: "ol > li",
          format: "orderedListItem",
          options: { itemPrefix: ". " },
        },
        {
          selector: "p",
          options: {
            leadingLineBreaks: 1,
            trailingLineBreaks: 1,
            trimEmptyLines: true,
          },
        },
        {
          selector: "div",
          options: {
            leadingLineBreaks: 1,
            trailingLineBreaks: 1,
            trimEmptyLines: true,
          },
        },
        {
          selector: "br",
          options: { leadingLineBreaks: 0, trailingLineBreaks: 1 },
        },
        // Ignore script and style tags explicitly
        { selector: "script", format: "skip" },
        { selector: "style", format: "skip" },
      ],
      // Post-processing to clean up multiple newlines and leading/trailing whitespace
      // This is a bit more involved directly in html-to-text options
      // Often, a simple .replace(/\n\s*\n+/g, '\n\n').trim() after conversion is effective.
    }).trim();

    // Additional cleanup for multiple blank lines that might remain
    plainTextBody = plainTextBody.replace(/\n\s*\n\s*\n+/g, "\n\n");
  } else if (emailData.textBody) {
    plainTextBody = emailData.textBody.trim();
    // If textBody might also contain URLs you want to remove, apply a regex here:
    // plainTextBody = plainTextBody.replace(/https?:\/\/\S+/gi, '[link removed]');
  }

  // 2. Create a "Small Body" - Target a sensible length, try to get newest content
  let smallBody = plainTextBody;
  const TARGET_BODY_CHARS = 3000; // Target character length for the body sent to LLM. Adjust this.
  // This is a balance between context and token cost.
  const MIN_NEWEST_PART_CHARS = 300; // Minimum length for an extracted "newest part" to be considered valid

  // Attempt to find the "newest" part of the email if it's a reply chain
  const replySeparators = [
    /\nOn .*wrote:\n/i,
    /\n-----Original Message-----/i,
    /\nFrom: .*\nSent: .*\nTo: .*\nSubject: .*/i,
    /\n_{20,}\n/i, // Shorter underscore lines
    /\n\n>{1,2}/,
    /^\s*>?\s*On\s.*?wrote:\s*$/m, // More specific "On ... wrote:" at start of a line
    /^\s*>?\s*From:\s*.*$/m, // "From: ..." at start of a line (often part of forwarded headers)
    /^\s*>?\s*Sent:\s*.*$/m,
    /^\s*>?\s*To:\s*.*$/m,
    /^\s*>?\s*Subject:\s*.*$/m,
  ];

  let newestPartCandidate = plainTextBody;
  let bestSeparatorIndex = plainTextBody.length;

  for (const separator of replySeparators) {
    const match = plainTextBody.match(separator);
    if (
      match &&
      match.index !== undefined &&
      match.index < bestSeparatorIndex
    ) {
      // Check if the content before the separator is substantial
      if (match.index > MIN_NEWEST_PART_CHARS) {
        bestSeparatorIndex = match.index;
      }
    }
  }

  if (bestSeparatorIndex < plainTextBody.length) {
    newestPartCandidate = plainTextBody.substring(0, bestSeparatorIndex).trim();
    // Only use this candidate if it's of a reasonable length and not excessively tiny
    if (newestPartCandidate.length > MIN_NEWEST_PART_CHARS) {
      smallBody = newestPartCandidate;
    }
  }

  // If, after trying to find the newest part, the smallBody is still too long,
  // or if no newest part was found and the original is too long, truncate.
  if (smallBody.length > TARGET_BODY_CHARS) {
    // Truncate from the beginning to keep the most recent part if it's a long single message
    // Or truncate from the end if you prefer the start of the message.
    // For emails, usually the end of the extracted 'newest part' is more recent.
    smallBody = smallBody.substring(0, TARGET_BODY_CHARS) + "... (truncated)";
  } else if (smallBody.length === 0 && plainTextBody.length > 0) {
    // Fallback if separator logic resulted in an empty string but original had content
    smallBody = plainTextBody.substring(
      0,
      Math.min(plainTextBody.length, TARGET_BODY_CHARS)
    );
    if (plainTextBody.length > TARGET_BODY_CHARS) {
      smallBody += "... (truncated)";
    }
  }

  // Construct the prompt string (same structure as before, just uses the new `smallBody`)
  const prompt = `
You are an AI assistant tasked with analyzing an email.
Please process the following email details and provide the output in the specified JSON format.

Pre-defined classification labels: [${predefinedLabels
    .map((l) => `"${l}"`)
    .join(", ")}]

Email Content:
=== BEGIN EMAIL ===
Subject: ${emailData.subject || "(No Subject)"}
From: ${emailData.from.name || "Unknown Sender"} <${
    emailData.from.email || "unknown@example.com"
  }>
To: ${emailData.to.join(", ") || "Undisclosed Recipients"}
${
  emailData.cc && emailData.cc.length > 0
    ? `Cc: ${emailData.cc.join(", ")}`
    : ""
}
Date: ${emailData.date || "Unknown Date"}
${
  emailData.attachments && emailData.attachments.length > 0
    ? `Attachments: ${emailData.attachments.map((a) => a.filename).join(", ")}`
    : ""
}

Body (focused content):
${smallBody}
=== END EMAIL ===

Requested Analysis:
Based on the email content and your pre-defined labels, provide the following:
1. classification: The most relevant label(s) from the pre-defined list. Provide an array of strings (up to 3 labels) or a single string if only one is relevant. If none fit well, output "N/A".
2. summary: A concise summary of the email based on the provided body (e.g., 1-2 sentences or up to 3 brief bullet points as an array of strings).
3. action_items: An array of strings, where each string is a clear action item identified in the email body. If no action items, provide an empty array.
4. suggested_response_draft: Draft a polite and professional response if appropriate, based on the provided body. If no response is needed, output "No response needed."

Output strictly in the following JSON Format, with no extra text before or after the JSON block:
{
  "classification": ["string" | "N/A"],
  "summary": "string" | ["string"],
  "action_items": ["string"],
  "suggested_response_draft": "string"
}
`;

  // --- Make the API Call (same as before) ---
  try {
    console.log(
      "--- PROMPT SENT TO LLM (adjusted small body, links removed) ---"
    );
    console.log(prompt); // For debugging

    const openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    // async function askLLM(prompt) {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });
    const LLMResponse = response.choices[0].message.content;
    // }

    let analysisText = LLMResponse;

    try {
      const jsonMatch = analysisText.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        analysisText = jsonMatch[1];
      }
      const parsedAnalysis = JSON.parse(analysisText);
      console.log(parsedAnalysis);
      return parsedAnalysis;
    } catch (parseError) {
      console.error(
        "Failed to parse LLM JSON response:",
        parseError,
        "\nRaw response:",
        analysisText
      );
      return {
        error: "Failed to parse LLM response",
        raw_response: analysisText,
      };
    }
  } catch (error) {
    console.error("Error calling LLM API:", error);
    throw error;
  }
}

// --- MOCKING API RESPONSE FOR EXAMPLE ---
// await new Promise((resolve) => setTimeout(resolve, 500));
// const LLMResponse = {
//   classification: ["CATEGORY_PROMOTIONS"],
//   summary: `The email from ${emailData.from.name} is a promotion for their Namaste React course, highlighting benefits and a summer discount coupon. It emphasizes project-based learning and comprehensive curriculum.`,
//   action_items: [
//     "Consider enrolling in Namaste React if looking to learn React.",
//     "Use coupon 'SUMMER25' for a discount if enrolling.",
//   ],
//   suggested_response_draft: "No response needed.",
// };
