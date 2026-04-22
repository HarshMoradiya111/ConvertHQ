"use client";

import { useCallback, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { Upload, FileIcon, X, AlertCircle, Plus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { formatBytes } from "@/lib/shared-utils";
import { FILE_LIMITS } from "@/lib/format-map";

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  currentFile?: File | null;
  onClear?: () => void;
  multiple?: boolean;
}

export function FileDropzone({
  onFileSelect,
  accept,
  maxSize = FILE_LIMITS.FREE_MAX_SIZE,
  currentFile,
  onClear,
  multiple = false,
}: FileDropzoneProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setError(null);

      if (rejectedFiles.length > 0) {
        const firstError = rejectedFiles[0].errors[0];
        setError(firstError.message || "File not accepted");
        return;
      }

      acceptedFiles.forEach((file) => {
        if (file.size > maxSize) {
          setError(`File is too large. Max size: ${formatBytes(maxSize)}`);
          return;
        }
        onFileSelect(file);
      });
    },
    [onFileSelect, maxSize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: multiple ? 100 : 1,
    multiple,
  });

  if (currentFile) {
    return (
      <div className="border-2 border-primary/20 bg-primary/5 rounded-3xl p-5 md:p-6 flex items-center gap-4 transition-all duration-500 animate-in fade-in zoom-in-95">
        <div className="p-4 rounded-2xl bg-primary/10 text-primary shrink-0 shadow-sm">
          <FileIcon className="size-8 md:size-10" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-base md:text-lg truncate text-slate-900 dark:text-white">
            {multiple ? "Ready to process" : currentFile.name}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            {multiple ? "Click Convert to start batch" : `${formatBytes(currentFile.size)} • ${currentFile.type || "unknown type"}`}
          </p>
        </div>
        {onClear && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            className="shrink-0 size-10 text-slate-400 hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
          >
            <X className="size-5" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "relative group cursor-pointer rounded-3xl border-2 border-dashed transition-all duration-500",
          "flex flex-col items-center justify-center text-center",
          "p-8 md:p-16 lg:p-20",
          isDragActive 
            ? "border-primary bg-primary/5 scale-[0.99] shadow-inner" 
            : "border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:shadow-xl"
        )}
      >
        <input {...getInputProps()} />
        
        <div className="relative">
          <div className={cn(
            "size-16 md:size-24 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-white shadow-sm",
            isDragActive && "bg-primary text-white scale-110"
          )}>
            <Upload className={cn("size-8 md:size-12", isDragActive && "animate-pulse")} />
          </div>
          {!isDragActive && (
            <div className="absolute -bottom-2 -right-2 size-8 md:size-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg animate-bounce">
              <Plus className="size-5 md:size-6" />
            </div>
          )}
        </div>

        <div className="mt-8 space-y-3">
          <h3 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {isDragActive ? "Drop files now" : "Drag & drop files"}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base max-w-xs mx-auto leading-relaxed">
            or <span className="text-primary font-bold hover:underline">browse files</span> from your device
          </p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pt-2">
            Max: {formatBytes(maxSize)}
          </p>
        </div>

        {isDragActive && (
          <div className="absolute inset-4 rounded-[2rem] border-2 border-primary/20 pointer-events-none animate-pulse" />
        )}
      </div>
      
      {error && (
        <div className="flex items-center gap-3 text-sm font-bold text-destructive bg-destructive/10 px-5 py-3 rounded-2xl animate-in shake duration-300">
          <AlertCircle className="size-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

