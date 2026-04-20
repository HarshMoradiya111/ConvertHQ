import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/admin";
import Stripe from "stripe";

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
      
      const { error } = await supabaseAdmin
        .from("profiles")
        .update({ tier: "pro" })
        .eq("id", supabaseUserId);

      if (error) {
        console.error("Failed to update user tier in Supabase:", error);
        return new NextResponse("Database update failed", { status: 500 });
      }
      
      console.log(`Successfully upgraded user ${supabaseUserId} to pro tier.`);
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
