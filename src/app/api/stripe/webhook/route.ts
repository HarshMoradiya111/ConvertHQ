import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/admin";
import Stripe from "stripe";
import { resend } from "@/lib/email/resend";
import BillingEmail from "@/lib/email/templates/billing-email";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error("Webhook signature verification failed:", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const supabaseAdmin = createAdminClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Retrieve the Supabase User ID from the metadata we passed during checkout
    const supabaseUserId = session.metadata?.supabase_user_id;

    if (supabaseUserId) {
      console.log(`Upgrading user ${supabaseUserId} to pro tier...`);
      
      const { data: profile, error: profileError } = await supabaseAdmin
        .from("profiles")
        .update({ tier: "pro" })
        .eq("id", supabaseUserId)
        .select()
        .single();

      if (profileError) {
        console.error("Failed to update user tier in Supabase:", profileError);
        return new NextResponse("Database update failed", { status: 500 });
      }
      
      console.log(`Successfully upgraded user ${supabaseUserId} to pro tier.`);

      // Send Billing Confirmation Email
      if (profile?.email) {
        try {
          await resend.emails.send({
            from: "ConvertHQ Billing <billing@converthq.com>",
            to: profile.email,
            subject: "Your ConvertHQ Pro Upgrade is Confirmed! 🚀",
            react: BillingEmail({ 
              userFirstname: profile.full_name?.split(' ')[0] || 'there',
              amount: session.amount_total ? `$${(session.amount_total / 100).toFixed(2)}` : "$9.00"
            }),
          });
        } catch (emailError) {
          console.error("Failed to send billing email:", emailError);
        }
      }
    }
  }

  // Handle subscription cancellations to downgrade users back to 'free'
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    
    // We would need to look up the user by stripe_customer_id if we saved it,
    // or by email if the customer email matches the Supabase auth email.
    // For this MVP, we are keeping it simple. In a production app, you MUST
    // save the Stripe Customer ID to the profiles table during checkout.
    
    // To implement properly:
    /*
    const customerId = subscription.customer as string;
    await supabaseAdmin
      .from("profiles")
      .update({ tier: "free" })
      .eq("stripe_customer_id", customerId);
    */
  }

  return new NextResponse("Webhook processed", { status: 200 });
}
