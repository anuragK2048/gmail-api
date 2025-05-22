import supabase from "../supabase";

async function createUser(
  full_name: string,
  remember_me_token: string,
  gmail_accounts: string[],
  primary_email: string,
  google_id: string
) {
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        full_name: full_name,
        remember_me_token: remember_me_token,
        gmail_accounts: gmail_accounts,
        primary_email: primary_email,
        google_id: google_id,
      },
    ])
    .select();
  console.log(data);
  if (error) console.log(error);
}

createUser(
  "john doe",
  "uias98n2",
  ["winzoneg3@gmail.com"],
  "winzoneg3@gmail.com",
  "iuas89x"
);
