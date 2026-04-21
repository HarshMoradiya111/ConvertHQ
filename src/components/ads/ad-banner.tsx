"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AdBannerProps {
  userTier?: string;
  className?: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  slot?: string;
}

export function AdBanner({ 
  userTier = "free", 
  className,
  format = "auto",
  slot = "5609953898" // Actual AdSense Slot ID
}: AdBannerProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Only attempt to load ads if user is on free tier
    if (userTier === "free") {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setIsLoaded(true);
      } catch (err) {
        console.error("AdSense error:", err);
      }
    }
  }, [userTier]);

  // Hide ads for Pro users
  if (userTier === "pro") {
    return null;
  }

  return (
    <div className={cn("w-full overflow-hidden my-8 min-h-[120px]", className)}>
      <div className="text-[10px] text-slate-400 uppercase tracking-widest text-center mb-2 font-medium">
        Sponsored
      </div>
      <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl min-h-[100px] flex items-center justify-center overflow-hidden aspect-[728/90] md:aspect-auto">
        {/* Actual AdSense Tag */}
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-6253576928151627"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
        
        {/* Placeholder for development visibility */}
        {!isLoaded && (
          <div className="text-slate-300 dark:text-slate-700 font-bold text-lg animate-pulse">
            Ad Banner Placeholder
          </div>
        )}
      </div>
    </div>
  );
}
