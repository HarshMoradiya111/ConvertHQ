"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import Link from "next/link";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-10 duration-500">
      <Card className="p-6 border-primary/20 shadow-2xl bg-slate-900 text-white">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg">Cookies & Privacy</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              className="size-6 text-slate-400 hover:text-white"
              onClick={() => setIsVisible(false)}
            >
              <X className="size-4" />
            </Button>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            We use cookies to enhance your experience, analyze site traffic, and for subscription management. 
            By continuing to use ConvertHQ, you agree to our 
            <Link href="/privacy" className="text-primary hover:underline mx-1">Privacy Policy</Link> 
            and 
            <Link href="/terms" className="text-primary hover:underline ml-1">Terms of Service</Link>.
          </p>
          <div className="flex gap-3">
            <Button 
              className="flex-1 font-bold" 
              onClick={handleAccept}
            >
              Accept All
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 bg-transparent border-slate-700 hover:bg-slate-800"
              onClick={() => setIsVisible(false)}
            >
              Dismiss
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
