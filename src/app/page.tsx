import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Zap, Shield, Rocket, ArrowRight } from "lucide-react";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";
import { AdBanner } from "@/components/ads/ad-banner";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-16 md:py-24 lg:py-32 xl:py-40 overflow-hidden relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-6">
                <Badge variant="secondary" className="px-4 py-1.5 rounded-full border-primary/20 text-primary bg-primary/10 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  Now in Private Beta
                </Badge>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight max-w-[1000px] mx-auto leading-[1.05] animate-in fade-in slide-in-from-bottom-4 duration-700">
                  Convert Anything to <br className="hidden sm:block" />
                  <span className="text-primary italic">Everything</span>. Faster.
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground text-lg sm:text-xl lg:text-2xl font-medium mt-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                  The ultimate hub for high-fidelity file conversions. Images, videos, documents — all in one place, completely free.
                </p>
              </div>

              {/* Primary CTA */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 w-full sm:w-auto">
                <a
                  href="/convert"
                  className="inline-flex items-center justify-center h-14 px-10 text-lg font-bold rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all w-full sm:w-auto"
                >
                  Start Converting <ArrowRight className="ml-2 size-5" />
                </a>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center h-14 px-10 text-lg font-medium rounded-xl border border-border bg-background hover:bg-muted transition-all w-full sm:w-auto"
                >
                  Learn More
                </a>
              </div>

              {/* Format pills */}
              <div className="flex flex-wrap justify-center gap-2 pt-8">
                {["JPG", "PNG", "WebP", "AVIF", "MP4", "PDF", "DOCX"].map((fmt) => (
                  <span key={fmt} className="px-3.5 py-1.5 text-xs font-bold rounded-full bg-muted/80 text-muted-foreground border border-border/50 hover:bg-primary/5 hover:border-primary/20 transition-colors cursor-default">
                    {fmt}
                  </span>
                ))}
                <span className="px-3.5 py-1.5 text-xs font-bold rounded-full bg-primary/10 text-primary border border-primary/20">
                  + more
                </span>
              </div>

              {/* Social Proof */}
              <div className="pt-16 md:pt-24 w-full">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/50 mb-10">Trusted by teams at</p>
                <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                  <div className="font-black text-2xl md:text-3xl tracking-tighter">TECHCO</div>
                  <div className="font-black text-2xl md:text-3xl tracking-tighter">FLOW</div>
                  <div className="font-black text-2xl md:text-3xl tracking-tighter">PIXELS</div>
                  <div className="font-black text-2xl md:text-3xl tracking-tighter">NEXUS</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 md:py-32 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16 md:mb-24">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">Why ConvertHQ?</h2>
              <p className="text-muted-foreground mt-4 text-lg md:text-xl max-w-2xl mx-auto">
                Built for speed, security, and simplicity. No signup required.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-background border-border/50 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 duration-500 group">
                <CardContent className="pt-10 flex flex-col items-center text-center space-y-5">
                  <div className="p-4 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                    <Rocket className="size-10" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold">Ultra-Fast Processing</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Server-side conversion powered by Sharp and FFmpeg. Convert large files in seconds, not minutes.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background border-border/50 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 duration-500 group">
                <CardContent className="pt-10 flex flex-col items-center text-center space-y-5">
                  <div className="p-4 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                    <Shield className="size-10" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold">Secure by Default</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Files are auto-deleted after 1 hour. No data stored on our servers. Your privacy comes first.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background border-border/50 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 duration-500 group sm:col-span-2 lg:col-span-1">
                <CardContent className="pt-10 flex flex-col items-center text-center space-y-5">
                  <div className="p-4 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                    <CheckCircle2 className="size-10" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold">Zero Data Loss</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Maintain perfect fidelity. No broken layers, missing fonts, or artifacting in your output.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        <div className="container px-4 md:px-6 my-16">
          <AdBanner userTier="free" />
        </div>

        {/* Waitlist / CTA Section */}
        <section className="w-full py-24 md:py-32 bg-primary text-primary-foreground overflow-hidden relative">
          <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-full h-full scale-150 animate-pulse">
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </svg>
          </div>
          <div className="container px-4 md:px-6 relative text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8">
              Get early access to Pro features
            </h2>
            <p className="mx-auto max-w-2xl text-primary-foreground/80 text-lg md:text-xl mb-12 leading-relaxed">
              Join the waitlist for unlimited conversions, larger file sizes, and API access.
            </p>
            <div className="max-w-md mx-auto w-full">
              <WaitlistForm />
            </div>
          </div>
        </section>
      </main>


    </div>
  );
}
