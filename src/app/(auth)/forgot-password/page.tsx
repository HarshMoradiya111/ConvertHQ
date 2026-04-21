"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setIsLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setIsSent(true);
      toast.success("Reset link sent to your email!");
    }
  };

  if (isSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 text-center">
          <div className="flex justify-center mb-6">
            <div className="size-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
              <MailCheck className="size-8" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Check your email</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            We've sent a password reset link to your email address.
          </p>
          <div className="pt-6">
            <a
              href="/login"
              className="inline-flex items-center text-sm font-semibold text-primary hover:underline"
            >
              <ArrowLeft className="mr-2 size-4" />
              Back to Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Reset password</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              className="w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-11 text-base font-semibold"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Reset Link
          </Button>
        </form>

        <div className="text-center pt-4 border-t border-slate-100 dark:border-slate-800">
          <a
            href="/login"
            className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="mr-2 size-4" />
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}
