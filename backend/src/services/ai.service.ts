// import { preprocessEmailForLLM } from './utils/preprocess';
// import { yourLLMProviderClient } from './llmProvider'; // The client for OpenAI, Anthropic, etc.

import { preprocessEmailForLLM } from "../utils/extractEmailContent";
import { askGemini } from "./LLM/askGoogle";

interface LabelOption {
  name: string;
  criteria?: string; // This was 'prompt' in your code, 'criteria' is clearer
}

interface PreprocessedEmail {
  id: string;
  content: string;
}

interface LLMAssignmentResponse {
  classifications: {
    emailId: string;
    assignments: boolean[];
  }[];
}

/**
 * Classifies a batch of emails using an LLM.
 * @param emails - The array of full email objects from your DB.
 *-  @param labels - The array of user-defined label objects from your DB.
 * @returns A map of emailId to its boolean assignment array.
 */
export async function assignLabelsInBatch_LLM(
  emails: any[],
  labels: any[]
): Promise<Map<string, boolean[]>> {
  // 1. Preprocess inputs
  const labelOptions: LabelOption[] = labels.map((label) => ({
    name: label.name,
    criteria: label.prompt,
  }));
  const preprocessedEmails: PreprocessedEmail[] = emails.map(
    preprocessEmailForLLM
  );

  // 2. Construct the prompt
  const promptTemplate = `You are an expert AI assistant tasked with classifying a batch of emails based on a given set of user-defined labels. Your goal is to provide a consistent and accurate JSON response.

Here are the user's labels. Each label has a name and may have a specific instruction/criteria. If criteria are provided, prioritize them. If not, infer the category from the label's name.

<LABELS>
{{LABELS_JSON}}
</LABELS>

Here is a batch of emails that need to be classified.

<EMAILS>
{{EMAILS_JSON}}
</EMAILS>

For each email, perform the following steps:
1.  Read the email's content carefully.
2.  For each label, evaluate if the email matches the label's name and criteria.
3.  Think step-by-step about your reasoning for each label assignment for that email.
4.  Construct a boolean array representing the assignments, in the exact same order as the provided labels.

After analyzing all emails, provide your final answer ONLY as a single, valid JSON object. The JSON object should have a single key <classifications>. The value should be an array of objects, where each object contains the <emailId> and its corresponding boolean <assignments> array.

Example of the final output format:
<OUTPUT_FORMAT>
{
  "classifications": [
    {
      "emailId": "email_id_1",
      "assignments": [true, false, true]
    },
    {
      "emailId": "email_id_2",
      "assignments": [false, false, true]
    }
  ]
}
</OUTPUT_FORMAT>

  Do not include your reasoning or any other text outside of the final JSON object. Begin your analysis now.`;
  const finalPrompt = promptTemplate
    .replace("{{LABELS_JSON}}", JSON.stringify(labelOptions, null, 2))
    .replace("{{EMAILS_JSON}}", JSON.stringify(preprocessedEmails, null, 2));

  // 3. Call the LLM API
  const llmResponseString: any = await askGemini(finalPrompt);

  // 4. Parse and validate the response
  try {
    // The LLM might sometimes include markdown backticks around the JSON
    const cleanJsonString = llmResponseString
      .replace(/```json/g, "")
      .replace(/```/g, "");
    const parsedResponse: LLMAssignmentResponse = JSON.parse(cleanJsonString);

    // Convert the array of objects into a Map for easy lookup
    const resultMap = new Map<string, boolean[]>();
    for (const item of parsedResponse.classifications) {
      // Basic validation
      if (
        item.emailId &&
        Array.isArray(item.assignments) &&
        item.assignments.length === labels.length
      ) {
        resultMap.set(item.emailId, item.assignments);
      }
    }
    return resultMap;
  } catch (error) {
    console.error("Failed to parse LLM JSON response:", error);
    console.error("Raw LLM Response:", llmResponseString);
    // Return an empty map or throw an error so the calling function can handle it
    return new Map();
  }
}
