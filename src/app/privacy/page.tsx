import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | ConvertHQ",
  description: "How we handle your data at ConvertHQ.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p className="text-lg text-muted-foreground mb-8">
          Last Updated: April 20, 2026
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us when you create an account, such as your name and email address. We also collect files you upload for conversion; however, these files are processed and then automatically deleted within 1 hour.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p>
            We use your information to provide, maintain, and improve our services, including processing your file conversions and managing your subscription.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Data Retention</h2>
          <p>
            Uploaded files are stored temporarily on our secure servers and are permanently deleted within 1 hour of the conversion process being completed. Your account information is kept as long as your account is active.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Third-Party Services</h2>
          <p>
            We use Stripe for payment processing. Your payment information is collected and processed directly by Stripe and is governed by their privacy policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at support@converthq.com.
          </p>
        </section>
      </div>
    </div>
  );
}
