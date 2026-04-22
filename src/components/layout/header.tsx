import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSelector } from "./language-selector";
import { GlobalSearch } from "./global-search";
import { Menu, Zap } from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "/convert", label: "Converter" },
  { href: "/compress", label: "Compressor" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
];

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 sticky top-0">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 shrink-0">
          <div className="bg-primary size-8 rounded-lg flex items-center justify-center text-white">
            <Zap className="size-5 fill-current" />
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:inline-block">ConvertHQ</span>
        </Link>
        
        <div className="hidden lg:flex flex-1 max-w-sm mx-8">
          <GlobalSearch />
        </div>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-2 ml-auto">
          <div className="hidden sm:flex items-center gap-2">
            <LanguageSelector />
            <ThemeToggle />
          </div>

          <div className="hidden md:flex items-center gap-4 ml-4">
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

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger
                className="group/button inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
                aria-label="Toggle menu"
              >
                <Menu className="size-6" />
                <span className="sr-only">Toggle menu</span>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader className="text-left">
                  <SheetTitle className="flex items-center gap-2">
                    <Zap className="size-5 text-primary" />
                    ConvertHQ
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-4">
                  <div className="mb-4">
                    <GlobalSearch />
                  </div>
                  <nav className="flex flex-col gap-4">
                    {NAV_LINKS.map((link) => (
                      <Link 
                        key={link.href} 
                        href={link.href} 
                        className="text-lg font-semibold hover:text-primary transition-colors py-2"
                      >
                        {link.label}
                      </Link>
                    ))}
                    <div className="border-t border-border pt-4 mt-2">
                      {user ? (
                        <div className="flex flex-col gap-4">
                          <Link href="/dashboard" className="text-lg font-semibold hover:text-primary transition-colors py-2">
                            Dashboard
                          </Link>
                          <form action="/api/auth/signout" method="POST">
                            <button type="submit" className="text-lg font-semibold text-muted-foreground hover:text-foreground transition-colors py-2 w-full text-left">
                              Sign out
                            </button>
                          </form>
                        </div>
                      ) : (
                        <Link 
                          href="/login" 
                          className="text-lg font-semibold text-primary hover:text-primary/80 transition-colors py-2"
                        >
                          Sign In
                        </Link>
                      )}
                    </div>
                  </nav>
                  <div className="mt-auto pt-8 flex items-center gap-4">
                    <LanguageSelector />
                    <span className="text-sm text-muted-foreground">Change Language</span>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
