import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Welcome back, {user.email}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* Plan Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Current Plan</h2>
                <div className="mt-1 flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider ${
                    isPro 
                      ? "bg-primary/20 text-primary" 
                      : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                  }`}>
                    {tier}
                  </span>
                </div>
              </div>
              {isPro ? (
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="size-5 text-primary" />
                </div>
              ) : (
                <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <AlertCircle className="size-5 text-slate-500" />
                </div>
              )}
            </div>
            
            <div className="mt-6">
              {isPro ? (
                <Button variant="outline" className="w-full">
                  Manage Subscription
                </Button>
              ) : (
                <Link 
                  href="/pricing" 
                  className={cn(buttonVariants({ variant: "default" }), "w-full h-10")}
                >
                  Upgrade to Pro <ArrowRight className="ml-2 size-4" />
                </Link>
              )}
            </div>
          </div>

          {/* Usage Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Daily Usage</h2>
            
            {isPro ? (
              <div className="flex flex-col items-center justify-center h-24 text-center">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">Unlimited</span>
                <p className="text-sm text-slate-500 mt-1">Conversions remaining today</p>
              </div>
            ) : (
              <div>
                <div className="flex items-end justify-between mb-2">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">{usageCount}</span>
                  <span className="text-sm text-slate-500 mb-1">/ 5 conversions</span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 mb-4 overflow-hidden">
                  <div 
                    className={`h-2.5 rounded-full ${usageCount >= 5 ? 'bg-destructive' : 'bg-primary'}`} 
                    style={{ width: `${Math.min((usageCount / 5) * 100, 100)}%` }}
                  ></div>
                </div>
                
                {usageCount >= 5 && (
                  <p className="text-sm text-destructive font-medium">
                    You've reached your daily limit.
                  </p>
                )}
              </div>
            )}
            
            <div className="mt-6">
              <Link 
                href="/convert" 
                className={cn(buttonVariants({ variant: "secondary" }), "w-full h-10")}
              >
                Go to Converter
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
