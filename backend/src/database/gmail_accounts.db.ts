import { BadRequestError } from "../errors/specificErrors";
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
    console.log(error);
    throw new BadRequestError("Invalid user data provided.", "DB_ENTRY_ERROR");
  }
  console.log(data);
  const [dataObj] = data;
  return dataObj;
};

export const duplicateAccountCheck = async (google_id: string) => {
  const { data, error } = await supabase
    .from("gmail_accounts")
    .select("*")
    .eq("google_user_id_for_account", google_id)
    .single(); // Optional: use .single() if you expect only 1 result
  // if (error) {
  //   console.error(error);
  //   throw new BadRequestError(
  //     "Unable to check duplicate accounts",
  //     "DB_CHECK_ERROR"
  //   );
  // }
  if (data) {
    return data; // object
  } else return false;
};
