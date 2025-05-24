import { GmailAccount, NewGmailAccountPayload } from "../types/gmail.types";
import supabase from "./supabase";

export const createEmailAccount = async (
  newGmailDetails: NewGmailAccountPayload
): Promise<GmailAccount> => {
  const { data, error } = await supabase
    .from("gmail_accounts")
    .insert([newGmailDetails])
    .select();
  if (error) {
    console.error("Error creating email account:", error);
    // Handle error appropriately, maybe throw it or return a structured error response
    throw error;
  }
  console.log(data);
  const [dataObj] = data;
  return dataObj;
};
