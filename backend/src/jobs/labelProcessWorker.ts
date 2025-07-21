import {
  bulkAddLabelsToEmails,
  findLabelsByUserId,
} from "../database/labels.db";
import { assignLabelsInBatch_LLM } from "../services/ai.service";

/**
 * A wrapper function to handle the AI labeling process in the background.
 * In a real app, this would enqueue a job. Here, it just calls the function
 * without being awaited by the main sync flow.
 * @param appUserId
 * @param emails
 */
export async function processAILabelsInBackground(
  appUserId: string,
  emails: any[]
) {
  try {
    // 1. Fetch the user's defined labels
    const userLabels = await findLabelsByUserId(appUserId);
    if (!userLabels || userLabels.length === 0) {
      console.log("User has no custom labels to assign.");
      return;
    }

    // 2. Call the LLM to get the assignments Map
    // You might want to batch the 'emails' array here too if it's very large (e.g., > 100)
    // For simplicity, we'll process them all in one go if it fits the LLM batch size.
    const assignmentsMap: Map<string, boolean[]> =
      await assignLabelsInBatch_LLM(emails, userLabels);

    // 3. Process the Map and prepare for DB insert
    const emailLabelAssociations: { email_id: string; label_id: string }[] = [];
    assignmentsMap.forEach((assignments, emailId) => {
      assignments.forEach((shouldApply, index) => {
        if (shouldApply) {
          const labelId = userLabels[index].id;
          emailLabelAssociations.push({
            email_id: emailId,
            label_id: labelId,
          });
        }
      });
    });

    // 4. If any associations were found, save them to the database
    if (emailLabelAssociations.length > 0) {
      console.log(`AI found ${emailLabelAssociations.length} labels to apply.`);
      await bulkAddLabelsToEmails(appUserId, emailLabelAssociations);
      console.log("Successfully applied AI-generated labels.");
    } else {
      console.log("AI processing complete. No new labels were applicable.");
    }
  } catch (error) {
    console.error("Error during background AI label processing:", error);
  }
}
