"use client";

import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export type ConversionStatus = "idle" | "uploading" | "processing" | "done" | "error";

interface ConversionProgressProps {
  status: ConversionStatus;
  errorMessage?: string;
}

const STATUS_CONFIG: Record<
  ConversionStatus,
  { label: string; progress: number; color: string }
> = {
  idle: { label: "", progress: 0, color: "" },
  uploading: { label: "Uploading file...", progress: 30, color: "text-primary" },
  processing: { label: "Converting your file...", progress: 70, color: "text-primary" },
  done: { label: "Conversion complete!", progress: 100, color: "text-green-600" },
  error: { label: "Something went wrong", progress: 0, color: "text-destructive" },
};

export function ConversionProgress({ status, errorMessage }: ConversionProgressProps) {
  if (status === "idle") return null;

  const config = STATUS_CONFIG[status];

  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-3">
        {status === "uploading" || status === "processing" ? (
          <Loader2 className={`size-5 animate-spin ${config.color}`} />
        ) : status === "done" ? (
          <CheckCircle2 className={`size-5 ${config.color}`} />
        ) : (
          <AlertCircle className={`size-5 ${config.color}`} />
        )}
        <span className={`text-sm font-medium ${config.color}`}>
          {errorMessage || config.label}
        </span>
      </div>
      {(status === "uploading" || status === "processing") && (
        <Progress value={config.progress} className="h-2" />
      )}
      {status === "done" && <Progress value={100} className="h-2" />}
    </div>
  );
}
