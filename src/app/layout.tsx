import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PostHogProvider } from "@/components/providers/posthog-provider";
import { JsonLd } from "@/components/seo/json-ld";
import { CookieConsent } from "@/components/layout/cookie-consent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ConvertHQ | High-Fidelity File Conversions",
  description: "The ultimate hub for high-fidelity file conversions. Scale your workflow without the friction of manual processing.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ConvertHQ | High-Fidelity File Conversions",
    description: "The ultimate hub for high-fidelity file conversions.",
    url: "/",
    siteName: "ConvertHQ",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ConvertHQ | High-Fidelity File Conversions",
    description: "The ultimate hub for high-fidelity file conversions.",
    images: ["/og-image.png"],
  },
};

import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <body className="min-h-full flex flex-col">
        <JsonLd />
        <PostHogProvider>
          <Header />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
          <CookieConsent />
          <Toaster position="top-center" />
        </PostHogProvider>
      </body>
    </html>
  );
}
