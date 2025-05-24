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
    throw new Error("Unable to enter user details in database");
  }
  return data;
}

// createUser(
//   "john doe",
//   "uias98n2",
//   ["winzoneg3@gmail.com"],
//   "winzoneg3@gmail.com",
//   "iuas89x"
// );
