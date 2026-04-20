import Link from "next/link";
import { Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 sticky top-0">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between max-w-6xl">
        <Link href="/" className="flex items-center space-x-2">
          <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Zap className="size-5 text-primary" />
          </div>
          <span className="font-bold text-lg tracking-tight">ConvertHQ</span>
        </Link>
        
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/convert" className="text-muted-foreground hover:text-foreground transition-colors">
            Converter
          </Link>
          <Link href="/compress" className="text-muted-foreground hover:text-foreground transition-colors">
            Compressor
          </Link>
          <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                Dashboard
              </Link>
              <form action="/api/auth/signout" method="POST">
                <button type="submit" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Sign out
                </button>
              </form>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
