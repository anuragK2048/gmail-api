import { askGemini } from "./LLM/askGoogle";
import { askLLM } from "./openAiApi";

export const assignLabels_LLM = async (
  emailInfo = {},
  labelOptions: { name: any; criteria: any }[]
) => {
  const prompt = `You are a professional email classifier and email categorizer. Classify the provided email in appropriate tags
    
    Provide email information is in json format
    Provide labelOptions are array of objects

    Classify on the basis of information given in these objects

    email: ${JSON.stringify(emailInfo)}

    labelOptions: ${JSON.stringify(labelOptions)} 

    if label doesnt have any criteria then infer it by its name

    Return the response in JSON format which should contain the boolean(according to applicability of label) in an array in same order as labelOptions
    e.g. [ true, false, true ]

    
    Return JSON object with empty array if non applicable

    Dont return anything else other than prescribed response
    `;

  const response = await askGemini(prompt);
  const parsed = extractJsonFromLLM(response);
  console.log(response);
  console.log(parsed);
  return parsed;
};

function extractJsonFromLLM(response: any) {
  const match = response.match(/```json\s*([\s\S]*?)\s*```/);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1]);
    } catch (err) {
      console.error("Invalid JSON:", err);
    }
  }
  return null;
}
