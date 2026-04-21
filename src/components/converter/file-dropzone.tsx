"use client";

import { useCallback, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { Upload, FileIcon, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      <div className="border-2 border-primary/30 bg-primary/5 rounded-2xl p-6 flex items-center gap-4">
        <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
          <FileIcon className="size-8" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">
            {multiple ? "Ready to process" : currentFile.name}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {multiple ? "Click Convert to start batch" : `${formatBytes(currentFile.size)} • ${currentFile.type || "unknown type"}`}
          </p>
        </div>
        {onClear && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="shrink-0 text-muted-foreground hover:text-destructive"
          >
            <X className="size-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
          transition-all duration-200 ease-out
          ${isDragActive
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border hover:border-primary/50 hover:bg-muted/30"
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className={`p-4 rounded-2xl transition-colors ${isDragActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
            <Upload className="size-8" />
          </div>
          <div>
            <p className="font-semibold text-lg">
              {isDragActive ? "Drop your file here" : "Drag & drop your file"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or <span className="text-primary font-medium">browse</span> to choose a file
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Max file size: {formatBytes(maxSize)}
          </p>
        </div>
      </div>
      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-4 py-2 rounded-lg">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
