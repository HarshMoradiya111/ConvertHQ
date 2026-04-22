"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, RotateCcw, ArrowDown, Sparkles } from "lucide-react";

interface DownloadCardProps {
  downloadUrl: string;
  format: string;
  originalSize: string;
  convertedSize: string;
  savings?: string;
  onConvertAnother?: () => void;
}

export function DownloadCard({
  downloadUrl,
  format,
  originalSize,
  convertedSize,
  savings,
  onConvertAnother,
}: DownloadCardProps) {
  return (
    <Card className="border-none bg-slate-50 dark:bg-slate-800/50 rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 group hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 hover:shadow-xl">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="size-20 rounded-3xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <Sparkles className="size-10 fill-current" />
          </div>

          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none mb-2">
              Ready to Save
            </h3>
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">
              Successfully converted to <Badge variant="secondary" className="ml-1 font-black bg-primary/10 text-primary border-none">{format.toUpperCase()}</Badge>
            </p>
          </div>

          <div className="flex items-center justify-center gap-8 w-full max-w-xs mx-auto">
            <div className="flex-1 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Original</p>
              <p className="font-bold text-slate-500 line-through text-sm">{originalSize}</p>
            </div>
            <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center rotate-[-90deg]">
              <ArrowDown className="size-5 text-slate-400" />
            </div>
            <div className="flex-1 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Result</p>
              <p className="font-black text-primary text-lg">{convertedSize}</p>
            </div>
          </div>
          
          {savings && (
            <div className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest">
              {savings} SMALLER
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 w-full pt-4">
            <a
              href={downloadUrl}
              download
              className="flex-1 inline-flex items-center justify-center h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-black text-lg shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Download className="mr-2 size-6" />
              Download
            </a>
            {onConvertAnother && (
              <Button
                variant="outline"
                size="lg"
                onClick={onConvertAnother}
                className="flex-1 h-14 rounded-2xl border-2 font-bold hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                <RotateCcw className="mr-2 size-5" />
                Another One
              </Button>
            )}
          </div>

          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] pt-2">
            Auto-deleted in 1 hour
          </p>
        </div>
      </CardContent>
    </Card>

  );
}
