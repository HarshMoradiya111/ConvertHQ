import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | ConvertHQ",
  description: "Terms and conditions for using ConvertHQ.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p className="text-lg text-muted-foreground mb-8">
          Last Updated: April 20, 2026
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using ConvertHQ, you agree to be bound by these Terms of Service. If you do not agree, please do not use our service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
          <p>
            ConvertHQ provides online file conversion and compression tools. We reserve the right to modify or discontinue the service at any time without notice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Conduct</h2>
          <p>
            You are responsible for all files you upload to the service. You may not upload any content that is illegal, harmful, or infringes on any third-party rights.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Subscriptions and Payments</h2>
          <p>
            Pro features require a paid subscription. All payments are processed through Stripe. Subscriptions automatically renew unless cancelled.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
          <p>
            ConvertHQ is provided "as is" without any warranties. We are not liable for any loss of data or damages resulting from the use of our service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Governing Law</h2>
          <p>
            These terms are governed by the laws of the jurisdiction in which ConvertHQ operates.
          </p>
        </section>
      </div>
    </div>
  );
}
