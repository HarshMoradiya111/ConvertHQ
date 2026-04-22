"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

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
  const isDevelopment = process.env.NODE_ENV !== "production";
  const adRef = useRef<HTMLElement | null>(null);
  const adInitializedRef = useRef(false);

  useEffect(() => {
    if (isDevelopment || userTier !== "free") return;
    const adElement = adRef.current;
    if (!adElement || adInitializedRef.current) return;
    if (adElement.dataset.adsbygoogleStatus === "done") return;

    const frameId = window.requestAnimationFrame(() => {
      if (!adElement.isConnected || adElement.offsetWidth === 0) return;

      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        adInitializedRef.current = true;
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.debug("AdSense push skipped:", err);
        }
      }
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [userTier]);

  // Hide ads for Pro users
  if (userTier === "pro" || isDevelopment) {
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
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-6253576928151627"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
