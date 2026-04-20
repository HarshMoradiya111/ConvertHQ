import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_51...your_key_here";

export const stripe = new Stripe(stripeSecretKey, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2026-03-25.dahlia",
  appInfo: {
    name: "ConvertHQ",
    url: "https://converthq.com",
  },
});
