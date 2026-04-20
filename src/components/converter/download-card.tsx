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
    <Card className="border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600">
            <Sparkles className="size-8" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-green-800 dark:text-green-300">
              Your file is ready!
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Converted to <Badge variant="secondary" className="ml-1">{format.toUpperCase()}</Badge>
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="text-center">
              <p className="text-muted-foreground">Original</p>
              <p className="font-semibold">{originalSize}</p>
            </div>
            <ArrowDown className="size-4 text-muted-foreground rotate-[-90deg]" />
            <div className="text-center">
              <p className="text-muted-foreground">Converted</p>
              <p className="font-semibold text-green-600">{convertedSize}</p>
            </div>
            {savings && (
              <Badge className="bg-green-600 text-white">
                {savings} smaller
              </Badge>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
            <a
              href={downloadUrl}
              download
              className="flex-1 inline-flex items-center justify-center h-11 px-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all"
            >
              <Download className="mr-2 size-4" />
              Download File
            </a>
            {onConvertAnother && (
              <Button
                variant="outline"
                size="lg"
                onClick={onConvertAnother}
                className="flex-1"
              >
                <RotateCcw className="mr-2 size-4" />
                Convert Another
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            File will be available for 1 hour, then auto-deleted.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
