/**
 * ConvertHQ — Shared Utilities (Browser-safe)
 * These functions can be imported from both client and server components.
 */


/**
 * Get extension from filename
 */
export function getExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
}

/**
 * Validate file size
 */
export function validateFileSize(sizeBytes: number, maxBytes: number): boolean {
  return sizeBytes <= maxBytes;
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
