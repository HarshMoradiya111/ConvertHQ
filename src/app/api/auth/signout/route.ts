import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  
  // Check if a user's logged in
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    await supabase.auth.signOut();
  }

  // Determine where to redirect after logout
  // Redirect to the home page
  const requestUrl = new URL(request.url);
  return NextResponse.redirect(new URL("/", requestUrl.origin), {
    status: 302,
  });
}
