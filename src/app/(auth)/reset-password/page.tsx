"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    setIsLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setIsDone(true);
      toast.success("Password updated successfully!");
      setTimeout(() => router.push("/login"), 3000);
    }
  };

  if (isDone) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 text-center">
          <div className="flex justify-center mb-6">
            <div className="size-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
              <ShieldCheck className="size-8" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Password updated</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Your password has been changed successfully. Redirecting you to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Set new password</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Please enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">
              New Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              minLength={8}
              className="w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="confirmPassword">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
              minLength={8}
              className="w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-11 text-base font-semibold"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
}
