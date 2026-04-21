import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Zap, Shield, Rocket, ArrowRight } from "lucide-react";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";
import { AdBanner } from "@/components/ads/ad-banner";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Navigation */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="bg-primary size-8 rounded-lg flex items-center justify-center text-white">
            <Zap className="size-5 fill-current" />
          </div>
          <span>ConvertHQ</span>
        </div>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <a className="text-sm font-medium text-primary hover:text-primary/80 transition-colors" href="/convert">
            Convert Now
          </a>
          <a className="text-sm font-medium hover:text-primary transition-colors" href="#features">
            Features
          </a>
          <a className="text-sm font-medium hover:text-primary transition-colors" href="#pricing">
            Pricing
          </a>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 lg:py-32 xl:py-48 overflow-hidden relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4">
                <Badge variant="secondary" className="px-3 py-1 rounded-full border-primary/20 text-primary bg-primary/10 mb-4">
                  Now in Private Beta
                </Badge>
                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl max-w-3xl mx-auto leading-[1.1]">
                  Convert Anything to <span className="text-primary italic">Everything</span>. Faster.
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl lg:text-2xl font-medium mt-6">
                  The ultimate hub for high-fidelity file conversions. Images, videos, documents — all in one place, completely free.
                </p>
              </div>

              {/* Primary CTA */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a
                  href="/convert"
                  className="inline-flex items-center justify-center h-14 px-10 text-lg font-bold rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Start Converting <ArrowRight className="ml-2 size-5" />
                </a>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center h-14 px-10 text-lg font-medium rounded-lg border border-border bg-background hover:bg-muted transition-all"
                >
                  Learn More
                </a>
              </div>

              {/* Format pills */}
              <div className="flex flex-wrap justify-center gap-2 pt-4">
                {["JPG", "PNG", "WebP", "AVIF", "MP4", "PDF", "DOCX"].map((fmt) => (
                  <span key={fmt} className="px-3 py-1.5 text-xs font-semibold rounded-full bg-muted/80 text-muted-foreground border border-border/50">
                    {fmt}
                  </span>
                ))}
                <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20">
                  + more
                </span>
              </div>

              {/* Social Proof */}
              <div className="pt-12 w-full">
                <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground/60 mb-8">Trusted by teams at</p>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all">
                  <div className="font-bold text-2xl tracking-tighter">TECHCO</div>
                  <div className="font-bold text-2xl tracking-tighter">FLOW</div>
                  <div className="font-bold text-2xl tracking-tighter">PIXELS</div>
                  <div className="font-bold text-2xl tracking-tighter">NEXUS</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Why ConvertHQ?</h2>
              <p className="text-muted-foreground mt-3 text-lg max-w-xl mx-auto">
                Built for speed, security, and simplicity. No signup required.
              </p>
            </div>
            <div className="grid gap-8 lg:grid-cols-3">
              <Card className="bg-background border-border/50 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
                <CardContent className="pt-8 flex flex-col items-center text-center space-y-4">
                  <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                    <Rocket className="size-8" />
                  </div>
                  <h3 className="text-xl font-bold">Ultra-Fast Processing</h3>
                  <p className="text-muted-foreground">
                    Server-side conversion powered by Sharp and FFmpeg. Convert large files in seconds, not minutes.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background border-border/50 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
                <CardContent className="pt-8 flex flex-col items-center text-center space-y-4">
                  <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                    <Shield className="size-8" />
                  </div>
                  <h3 className="text-xl font-bold">Secure by Default</h3>
                  <p className="text-muted-foreground">
                    Files are auto-deleted after 1 hour. No data stored on our servers. Your privacy comes first.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background border-border/50 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
                <CardContent className="pt-8 flex flex-col items-center text-center space-y-4">
                  <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                    <CheckCircle2 className="size-8" />
                  </div>
                  <h3 className="text-xl font-bold">Zero Data Loss</h3>
                  <p className="text-muted-foreground">
                    Maintain perfect fidelity. No broken layers, missing fonts, or artifacting in your output.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        <div className="container px-4 md:px-6">
          <AdBanner userTier="free" />
        </div>

        {/* Waitlist / CTA Section */}
        <section className="w-full py-24 bg-primary text-primary-foreground overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>
          <div className="container px-4 md:px-6 relative text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
              Get early access to Pro features
            </h2>
            <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl mb-10">
              Join the waitlist for unlimited conversions, larger file sizes, and API access.
            </p>
            <div className="max-w-md mx-auto">
              <WaitlistForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-8 w-full shrink-0 items-center px-4 md:px-6 border-t border-border/40 text-muted-foreground">
        <p className="text-sm">© 2026 ConvertHQ Inc. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a className="text-xs hover:text-primary transition-colors" href="#">Terms of Service</a>
          <a className="text-xs hover:text-primary transition-colors" href="#">Privacy</a>
        </nav>
      </footer>
    </div>
  );
}
