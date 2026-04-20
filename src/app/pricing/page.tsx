"use client";

import { useState } from "react";
import { Check, Zap, Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          toast.error("Please sign in to upgrade");
          window.location.href = "/login";
          return;
        }
        throw new Error("Failed to create checkout session");
      }
      
      const { url } = await res.json();
      window.location.href = url;
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Scale your file conversion workflow without limits. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="rounded-3xl p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">Free</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Perfect for occasional conversions.</p>
            <div className="mb-8">
              <span className="text-5xl font-bold text-slate-900 dark:text-white">$0</span>
              <span className="text-slate-500 dark:text-slate-400">/forever</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {['5 conversions per day', 'Max file size: 50MB', 'Standard image formats', 'Basic compression control'].map((feature) => (
                <li key={feature} className="flex items-center text-slate-700 dark:text-slate-300">
                  <div className="mr-3 p-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                    <Check className="size-4" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
            
            <a 
              href="/convert" 
              className={cn(buttonVariants({ variant: "outline" }), "w-full h-12 text-base font-semibold")}
            >
              Start Free
            </a>
          </div>

          {/* Pro Tier */}
          <div className="rounded-3xl p-8 bg-slate-900 dark:bg-slate-800 border-2 border-primary shadow-xl shadow-primary/20 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="inline-flex items-center rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                <Zap className="mr-1 size-3" /> Most Popular
              </span>
            </div>
            
            <h3 className="text-2xl font-semibold text-white mb-2">Pro</h3>
            <p className="text-slate-400 mb-6">For professionals and heavy workflows.</p>
            <div className="mb-8">
              <span className="text-5xl font-bold text-white">$4</span>
              <span className="text-slate-400">/month</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {[
                'Unlimited daily conversions', 
                'Max file size: 2GB', 
                'Video & Audio formats (Coming Soon)', 
                'Priority processing speed',
                'Batch conversion support'
              ].map((feature) => (
                <li key={feature} className="flex items-center text-slate-200">
                  <div className="mr-3 p-1 rounded-full bg-primary/20 text-primary">
                    <Check className="size-4" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
            
            <Button 
              className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleUpgrade}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Upgrade to Pro
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
