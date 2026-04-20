# ConvertHQ 🚀

**ConvertHQ** is a high-performance, premium SaaS platform for seamless file conversion and compression. Built with Next.js 15+, Supabase, and Stripe, it offers a frictionless experience for processing images, video, and audio directly in the browser.

![ConvertHQ OG Image](public/og-image.png)

## ✨ Features

- 🔄 **Multi-File Conversion:** Convert multiple files simultaneously across various formats.
- 📉 **Intelligent Compression:** Reduce file sizes for WebP, PNG, and JPEG with zero quality loss.
- 🎥 **Video & Audio Support:** Client-side processing using FFmpeg WASM (No server-side costs!).
- 📦 **Batch Downloads:** Download all converted files in a single, organized `.zip` archive (Pro Feature).
- 💳 **Stripe Integration:** Fully functional subscription system with Webhooks.
- 🔐 **Supabase Auth:** Secure authentication with Google OAuth and Email/Password.
- 📊 **PostHog Analytics:** Built-in event tracking and user behavior analysis.
- 📧 **Transactional Emails:** Beautiful welcome emails via Resend.
- 📱 **Premium UI/UX:** Modern, responsive design with dark mode support and smooth animations.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Components:** [Shadcn UI](https://ui.shadcn.com/)
- **Database & Auth:** [Supabase](https://supabase.com/)
- **Payments:** [Stripe](https://stripe.com/)
- **Analytics:** [PostHog](https://posthog.com/)
- **Email:** [Resend](https://resend.com/)
- **Processing:** [FFmpeg.wasm](https://ffmpegwasm.netlify.app/)
- **State Management:** React Hooks & Server Actions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- NPM / PNPM / Bun
- Supabase Project
- Stripe Account
- Resend API Key
- PostHog Project

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/converthq.git
   cd converthq
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add the following:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_...

   # Analytics & Email
   NEXT_PUBLIC_POSTHOG_KEY=phc_...
   NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
   RESEND_API_KEY=re_...
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

## 🌍 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel.
2. Add all environment variables from `.env.local` to the Vercel Project Settings.
3. Set `NEXT_PUBLIC_APP_URL` to your production domain (e.g., `https://your-site.vercel.app`).
4. **Important:** Ensure `SharedArrayBuffer` is enabled by keeping the custom headers in `next.config.ts` (required for FFmpeg WASM).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support, email support@converthq.com or join our Discord community.

---
Built with ❤️ by [Harsh Moradiya](https://github.com/HarshMoradiya111)
