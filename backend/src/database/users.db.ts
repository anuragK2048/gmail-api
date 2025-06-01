import { BadRequestError } from "../errors/specificErrors";
import { NewUserAccountPayload, User } from "../types/user.types";

import supabase from "./supabase";

export async function createUser(
  newUserDetails: NewUserAccountPayload
): Promise<User> {
  const { data, error } = await supabase
    .from("users")
    .insert([newUserDetails])
    .select();
  console.log(data);
  if (error) {
    console.log(error);
    throw new BadRequestError("Invalid user data provided.", "DB_ENTRY_ERROR");
  }
  const [dataObj] = data;
  return dataObj;
}

export const findGmailAccountByGoogleId = async (google_id: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("google_id", google_id)
    .single(); // Optional: use .single() if you expect only 1 result
  // if (error) {
  //   console.error(error);
  //   throw new BadRequestError(
  //     "Unable to check duplicate accounts",
  //     "DB_CHECK_ERROR"
  //   );
  // }
  return data ? true : false;
};
