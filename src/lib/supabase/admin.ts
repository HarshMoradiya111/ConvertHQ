import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Note: This client uses the SERVICE ROLE KEY, which bypasses Row Level Security (RLS).
// NEVER use this on the client-side or pass it to the browser.
// Only use it in secure backend routes (like webhooks) where you need admin privileges.
export function createAdminClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing Supabase URL or Service Role Key");
  }

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
