"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDeleteAccount = async () => {
    if (!confirm("Are you absolutely sure? This action cannot be undone and all your data will be permanently deleted.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch("/api/user/delete", {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Account deleted successfully.");
        router.push("/");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete account.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4 sm:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Manage your account and preferences.
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="size-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Permanently delete your account and all associated data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-white dark:bg-slate-900 border border-destructive/10">
              <AlertTriangle className="size-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-slate-900 dark:text-white">Before you delete your account:</p>
                <ul className="list-disc list-inside mt-2 text-slate-500 dark:text-slate-400 space-y-1">
                  <li>Your subscription will be immediately cancelled.</li>
                  <li>All your conversion history and profile data will be removed.</li>
                  <li>This action is permanent and cannot be reversed.</li>
                </ul>
              </div>
            </div>
            
            <Button 
              variant="destructive" 
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="font-semibold"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete My Account"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
