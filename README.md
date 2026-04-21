# ConvertHQ — Free Online File Converter & Compressor

> Convert images, video, and audio directly in your browser. No uploads. No server. No cost.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-converthq.com-blue?style=flat-square)](https://converthq.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square)](https://nextjs.org)
[![Made by Harsh](https://img.shields.io/badge/Made%20by-Harsh%20Moradiya-orange?style=flat-square)](https://github.com/HarshMoradiya111)

---

<!-- Replace with actual screenshot -->
![ConvertHQ Screenshot](public/og-image.png)

---

## What is ConvertHQ?

**ConvertHQ** is an open-source, browser-based file conversion and compression SaaS. Convert JPG to WebP, compress PNG with zero quality loss, or transcode video — all processed locally in your browser using WebAssembly. Your files never leave your device.

Built with Next.js 15, Supabase, Stripe, and FFmpeg WASM.

**[→ Try it live at converthq.com](https://converthq.com)**

---

## Features

- **Multi-format conversion** — JPG, PNG, WebP, MP4, MP3, GIF and more
- **Intelligent compression** — reduce file sizes up to 80% with zero visible quality loss
- **100% browser-based** — FFmpeg WASM processes files locally, no server upload
- **Batch processing** — convert multiple files simultaneously
- **ZIP downloads** — download all converted files in one archive *(Pro)*
- **Stripe subscriptions** — free tier + Pro plan with webhook handling
- **Google OAuth + email auth** — via Supabase Auth
- **PostHog analytics** — event tracking and funnel analysis built in
- **Transactional emails** — welcome + billing emails via Resend
- **Dark mode** — system-aware, fully supported
- **Mobile responsive** — works on any device

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Components | [shadcn/ui](https://ui.shadcn.com/) |
| Database & Auth | [Supabase](https://supabase.com/) (PostgreSQL + RLS) |
| Payments | [Stripe](https://stripe.com/) (Subscriptions + Webhooks) |
| File Processing | [FFmpeg.wasm](https://ffmpegwasm.netlify.app/) |
| Analytics | [PostHog](https://posthog.com/) |
| Email | [Resend](https://resend.com/) |
| Deployment | [Vercel](https://vercel.com/) |

---

## Getting Started

### Prerequisites

| Requirement | Version / Notes |
|-------------|-----------------|
| Node.js | 18+ |
| Package manager | npm / pnpm / bun |
| Supabase project | [Create free →](https://supabase.com) |
| Stripe account | [Create free →](https://stripe.com) |
| Resend account | [Create free →](https://resend.com) |
| PostHog project | [Create free →](https://posthog.com) |

---

### Step 1 — Clone & install

```bash
git clone https://github.com/HarshMoradiya111/converthq.git
cd converthq
npm install
```

---

### Step 2 — Supabase setup

1. Go to [supabase.com](https://supabase.com) → New project
2. Navigate to **SQL Editor** and run the schema below:

```sql
-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  stripe_customer_id text,
  plan text default 'free' check (plan in ('free', 'pro')),
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Policy: users can only read/update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

3. Copy your keys from **Settings → API**:
   - `NEXT_PUBLIC_SUPABASE_URL` → Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → anon / public key
   - `SUPABASE_SERVICE_ROLE_KEY` → service_role key *(keep secret)*

4. Enable **Google OAuth** (optional):
   - Go to **Authentication → Providers → Google**
   - Add your Google OAuth Client ID + Secret
   - Set redirect URL to `https://your-domain.com/auth/callback`

---

### Step 3 — Stripe setup

1. Go to [stripe.com](https://stripe.com) → Dashboard
2. Create a **Product** → add a recurring price (e.g. $9/month Pro)
3. Copy the **Price ID** (`price_xxx`) → this is `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`
4. Copy **Publishable key** and **Secret key** from Developers → API keys
5. Set up webhook:
   - Go to **Developers → Webhooks → Add endpoint**
   - Endpoint URL: `https://your-domain.com/api/webhooks/stripe`
   - Select events:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
   - Copy **Signing secret** → this is `STRIPE_WEBHOOK_SECRET`

> **Local webhook testing:** Install [Stripe CLI](https://stripe.com/docs/stripe-cli) and run:
> ```bash
> stripe listen --forward-to localhost:3000/api/webhooks/stripe
> ```
> This gives you a local `STRIPE_WEBHOOK_SECRET` for development.

---

### Step 4 — Environment variables

Create `.env.local` in the project root:

```env
# ─── App ──────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ─── Supabase ─────────────────────────────────────
# From: supabase.com → your project → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key        # Never expose client-side

# ─── Stripe ───────────────────────────────────────
# From: stripe.com → Developers → API keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...                          # Never expose client-side
# From: stripe.com → Developers → Webhooks → your endpoint
STRIPE_WEBHOOK_SECRET=whsec_...
# From: stripe.com → your product's price ID
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_...

# ─── Analytics ────────────────────────────────────
# From: posthog.com → your project → Settings
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# ─── Email ────────────────────────────────────────
# From: resend.com → API Keys
RESEND_API_KEY=re_...
```

---

### Step 5 — Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment (Vercel)

1. Push repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import repo
3. Add all variables from `.env.local` to **Project Settings → Environment Variables**
4. Set `NEXT_PUBLIC_APP_URL` to your production domain
5. Deploy

> **FFmpeg WASM requires `SharedArrayBuffer`** — the custom headers in `next.config.ts` are mandatory. Do not remove them or video/audio conversion will break.

```ts
// next.config.ts — these headers are required for FFmpeg WASM
headers: [
  {
    source: "/(.*)",
    headers: [
      { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
      { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
    ],
  },
]
```

---

## Project Structure

```
converthq/
├── app/
│   ├── (auth)/           # Login, signup, callback pages
│   ├── (dashboard)/      # Protected app pages
│   ├── api/
│   │   └── webhooks/
│   │       └── stripe/   # Stripe webhook handler
│   └── page.tsx          # Landing page
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── converter/        # File conversion components
│   └── shared/           # Header, footer, etc.
├── lib/
│   ├── supabase/         # Supabase client + server helpers
│   ├── stripe/           # Stripe helpers
│   └── ffmpeg/           # FFmpeg WASM wrapper
├── public/
└── .env.local            # Your secrets (never commit this)
```

---

## Roadmap

- [x] Image conversion (JPG, PNG, WebP, GIF)
- [x] Image compression
- [x] Video transcoding (FFmpeg WASM)
- [x] Audio conversion
- [x] Stripe subscriptions
- [x] Google OAuth
- [x] Bulk ZIP download (Pro)
- [x] Transactional emails (Welcome & Billing)
- [x] Password reset flow
- [x] Delete account (GDPR)
- [ ] PDF tools (compress, merge, split)
- [ ] API access for developers
- [ ] Hindi / regional language UI
- [ ] Chrome extension

---

## Contributing

Contributions are welcome.

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'add: your feature'`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

Please open an issue first for major changes.

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

## Support

- Email: support@converthq.com
- Discord: [Join community](#)
- Issues: [GitHub Issues](https://github.com/HarshMoradiya111/converthq/issues)

---

Built with ❤️ by [Harsh Moradiya](https://github.com/HarshMoradiya111)