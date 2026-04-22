import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("tier")
    .eq("id", user.id)
    .single();

  const tier = profile?.tier || "free";
  const isPro = tier === "pro";

  // Calculate today's usage if free tier
  let usageCount = 0;
  if (!isPro) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from("usage_logs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", today.toISOString());

    usageCount = count || 0;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-8 lg:p-12">
      <div className="max-w-5xl mx-auto space-y-10">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
              Welcome back, <span className="font-semibold text-slate-900 dark:text-slate-200">{user.email}</span>
            </p>
          </div>
          <Link 
            href="/dashboard/settings" 
            className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto h-12 text-base font-semibold rounded-xl")}
          >
            Settings
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Plan Card */}
          <Card className="bg-white dark:bg-slate-900 rounded-3xl p-8 border-none shadow-xl shadow-slate-200/50 dark:shadow-none transition-transform hover:scale-[1.01] duration-300 overflow-hidden relative">
            {!isPro && (
              <div className="absolute top-0 right-0 p-4">
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">Free Tier</Badge>
              </div>
            )}
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Current Plan</h2>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest",
                    isPro 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  )}>
                    {tier}
                  </span>
                </div>
              </div>
              <div className={cn(
                "size-14 rounded-2xl flex items-center justify-center transition-colors",
                isPro ? "bg-primary/10 text-primary" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
              )}>
                {isPro ? <CheckCircle2 className="size-7" /> : <AlertCircle className="size-7" />}
              </div>
            </div>
            
            <div className="mt-8 space-y-4">
              {isPro ? (
                <Button variant="secondary" className="w-full h-12 text-base font-bold rounded-xl">
                  Manage Subscription
                </Button>
              ) : (
                <Link 
                  href="/pricing" 
                  className={cn(buttonVariants({ variant: "default" }), "w-full h-12 text-base font-bold rounded-xl shadow-lg shadow-primary/20")}
                >
                  Upgrade to Pro <ArrowRight className="ml-2 size-5" />
                </Link>
              )}
            </div>
          </Card>

          {/* Usage Card */}
          <Card className="bg-white dark:bg-slate-900 rounded-3xl p-8 border-none shadow-xl shadow-slate-200/50 dark:shadow-none transition-transform hover:scale-[1.01] duration-300">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8">Daily Usage</h2>
            
            {isPro ? (
              <div className="flex flex-col items-center justify-center h-28 text-center bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Unlimited</span>
                <p className="text-sm font-medium text-slate-500 mt-2 uppercase tracking-widest">Conversions remaining</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-end justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{usageCount}</span>
                    <span className="text-lg font-bold text-slate-400">/ 5</span>
                  </div>
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Conversions today</span>
                </div>
                
                {/* Progress bar */}
                <div className="space-y-3">
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-4 overflow-hidden p-1">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-1000 ease-out",
                        usageCount >= 5 ? 'bg-destructive shadow-[0_0_12px_rgba(239,68,68,0.4)]' : 'bg-primary shadow-[0_0_12px_rgba(59,130,246,0.4)]'
                      )} 
                      style={{ width: `${Math.min((usageCount / 5) * 100, 100)}%` }}
                    ></div>
                  </div>
                  
                  {usageCount >= 5 ? (
                    <div className="flex items-center gap-2 text-destructive font-bold text-sm bg-destructive/10 p-3 rounded-xl animate-pulse">
                      <AlertCircle className="size-4" />
                      Daily limit reached. Upgrade for more.
                    </div>
                  ) : (
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {5 - usageCount} conversions left for today
                    </p>
                  )}
                </div>
              </div>
            )}
            
            <div className="mt-8">
              <Link 
                href="/convert" 
                className={cn(buttonVariants({ variant: "secondary" }), "w-full h-12 text-base font-bold rounded-xl")}
              >
                Go to Converter
              </Link>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
