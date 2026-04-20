import type { Metadata } from "next";
import { ConverterTool } from "@/components/converter/converter-tool";
import { Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Convert Files | ConvertHQ",
  description: "Convert and compress images, videos, and documents instantly. Free, fast, and secure file conversion.",
};

export default function ConvertPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <a href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="bg-primary size-8 rounded-lg flex items-center justify-center text-white">
            <Zap className="size-5 fill-current" />
          </div>
          <span>ConvertHQ</span>
        </a>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <a className="text-sm font-medium text-primary" href="/convert">
            Convert
          </a>
          <a className="text-sm font-medium hover:text-primary transition-colors" href="/#features">
            Features
          </a>
          <a className="text-sm font-medium hover:text-primary transition-colors" href="/#pricing">
            Pricing
          </a>
        </nav>
      </header>

      {/* Main */}
      <main className="flex-1 py-12 px-4">
        <div className="container max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Convert Your Files
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Drop a file, pick a format, and download. No signup required. Your files are never stored.
            </p>
          </div>

          <ConverterTool />

          {/* Supported formats info */}
          <div className="text-center space-y-2 pt-8">
            <p className="text-sm font-medium text-muted-foreground">Currently supported</p>
            <div className="flex flex-wrap justify-center gap-2">
              {["JPG", "PNG", "WebP", "AVIF", "TIFF", "GIF", "BMP"].map((fmt) => (
                <span
                  key={fmt}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground"
                >
                  {fmt}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground pt-2">
              Video, audio, and document conversion coming soon.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-8 w-full shrink-0 items-center px-4 md:px-6 border-t border-border/40 text-muted-foreground">
        <p className="text-sm">© 2026 ConvertHQ Inc. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a className="text-xs hover:text-primary transition-colors" href="#">Terms</a>
          <a className="text-xs hover:text-primary transition-colors" href="#">Privacy</a>
        </nav>
      </footer>
    </div>
  );
}
