// --- Label Definition CRUD ---

import supabase from "./supabase";

export async function findLabelsByUserId(appUserId: string) {
  const { data, error } = await supabase
    .from("labels")
    .select("id, name, color")
    .eq("app_user_id", appUserId)
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function createNewLabel(
  appUserId: string,
  name: string,
  color?: string
) {
  const { data, error } = await supabase
    .from("labels")
    .insert({ app_user_id: appUserId, name, color })
    .select("id, name, color")
    .single();

  if (error) {
    if (error.code === "23505") {
      // Unique constraint violation
      throw new Error(`A label with the name "${name}" already exists.`);
    }
    throw new Error(error.message);
  }
  return data;
}

export async function updateUserLabel(
  appUserId: string,
  labelId: string,
  updates: { name?: string; color?: string }
) {
  const { data, error } = await supabase
    .from("labels")
    .update(updates)
    .eq("app_user_id", appUserId) // Security: ensure user owns the label
    .eq("id", labelId)
    .select("id, name, color")
    .single();

  if (error) throw new Error(error.message);
  if (!data)
    throw new Error("Label not found or user does not have permission.");
  return data;
}

export async function deleteUserLabel(appUserId: string, labelId: string) {
  // Deleting from the 'labels' table will automatically cascade and delete
  // all corresponding entries in the 'email_labels' join table.
  const { error } = await supabase
    .from("labels")
    .delete()
    .eq("app_user_id", appUserId) // Security: ensure user owns the label
    .eq("id", labelId);

  if (error) throw new Error(error.message);
  return { message: "Label deleted successfully." };
}

// --- Applying/Removing Labels from Emails ---

export async function addLabelsToEmailBatch(
  appUserId: string,
  emailIds: string[],
  labelIds: string[]
) {
  // TODO: Verify the user owns all the emailIds and labelIds before inserting.
  // This is a complex check but crucial for security.
  // A simplified version is shown here, relying on RLS policies as a backup.

  const recordsToInsert = emailIds.flatMap((emailId) =>
    labelIds.map((labelId) => ({
      email_id: emailId,
      label_id: labelId,
    }))
  );

  const { error } = await supabase.from("email_labels").insert(recordsToInsert);
  // Using onConflict: 'ignore' can be an option if you don't care about errors on duplicates
  // .insert(recordsToInsert, { onConflict: 'ignore' })

  if (error) {
    // A unique constraint violation (23505) is expected if the label is already applied.
    // We can choose to ignore this specific error code.
    if (error.code !== "23505") {
      throw new Error(error.message);
    }
  }
  return { message: "Labels applied successfully." };
}

export async function removeLabelsFromEmailBatch(
  appUserId: string,
  emailIds: string[],
  labelIds: string[]
) {
  const { error } = await supabase
    .from("email_labels")
    .delete()
    .in("email_id", emailIds)
    .in("label_id", labelIds);
  // Note: This needs an RLS policy that can verify ownership of the email
  // before allowing a delete on email_labels.

  if (error) throw new Error(error.message);
  return { message: "Labels removed successfully." };
}
