import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PostHogProvider } from "@/components/providers/posthog-provider";
import { JsonLd } from "@/components/seo/json-ld";
import { CookieConsent } from "@/components/layout/cookie-consent";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LanguageProvider } from "@/lib/i18n/language-context";

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
  const isProduction = process.env.NODE_ENV === "production";

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {isProduction && (
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6253576928151627"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <JsonLd />
        <PostHogProvider>
          <LanguageProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem={false}
              enableColorScheme={false}
              disableTransitionOnChange
            >
              <Header />
              <main className="flex-1 flex flex-col">
                {children}
              </main>
              <Footer />
              <CookieConsent />
              <Toaster position="top-center" />
            </ThemeProvider>
          </LanguageProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
