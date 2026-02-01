import { supabase } from "./supabaseClient";

export async function listAccounts(limit = 20) {
  const { data, error } = await supabase
    .from("accounts")
    .select("id, name, balance, currency, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
