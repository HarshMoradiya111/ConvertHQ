import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the user's email and ID
    const userId = user.id;
    const userEmail = user.email;

    // Check if user already has a Stripe customer ID in their profile
    // (We'd need to add stripe_customer_id to the profiles table, but for now we'll just pass the Supabase ID in metadata)

    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID;
    if (!priceId) {
      console.error("Missing NEXT_PUBLIC_STRIPE_PRO_PRICE_ID");
      return new NextResponse("Stripe is not configured", { status: 500 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      customer_email: userEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${appUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${appUrl}/pricing?canceled=true`,
      metadata: {
        supabase_user_id: userId,
      },
    });

    if (!session.url) {
      throw new Error("Failed to create Stripe Checkout session");
    }

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return new NextResponse(error.message || "Internal Server Error", { status: 500 });
  }
}
