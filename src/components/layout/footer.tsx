import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12">
          <div className="col-span-1 sm:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
              <div className="bg-primary size-8 rounded-lg flex items-center justify-center text-white">
                <Zap className="size-5 fill-current" />
              </div>
              ConvertHQ
            </Link>
            <p className="text-muted-foreground max-w-xs text-base md:text-sm">
              The high-performance file conversion hub. Process images, video, and audio with zero friction.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Product</h4>
            <ul className="space-y-3 text-base md:text-sm text-muted-foreground">
              <li><Link href="/convert" className="hover:text-primary transition-colors">Converter</Link></li>
              <li><Link href="/compress" className="hover:text-primary transition-colors">Compressor</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Legal</h4>
            <ul className="space-y-3 text-base md:text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ConvertHQ Inc. All rights reserved.</p>
          <div className="flex gap-8 md:gap-6">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/sitemap" className="hover:text-primary transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
