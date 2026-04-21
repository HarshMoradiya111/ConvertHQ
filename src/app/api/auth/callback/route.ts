import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { resend } from "@/lib/email/resend";
import WelcomeEmail from "@/lib/email/templates/welcome-email";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in search params, use it as the redirection URL
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && session?.user) {
      const user = session.user;
      
      // Check if user has received welcome email before (optional, but good for MVP)
      // For this MVP, we'll try to send it if it's a likely new signup
      const isNewUser = new Date(user.created_at).getTime() > Date.now() - 60000; // Created in last 60s
      
      if (isNewUser && user.email) {
        try {
          await resend.emails.send({
            from: "ConvertHQ <welcome@converthq.com>",
            to: user.email,
            subject: "Welcome to ConvertHQ! 🚀",
            react: WelcomeEmail({ userFirstname: user.user_metadata?.full_name?.split(' ')[0] || 'there' }),
          });
        } catch (emailError) {
          console.error("Failed to send welcome email:", emailError);
          // Don't block auth flow for email errors
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
