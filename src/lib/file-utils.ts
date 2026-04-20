/**
 * ConvertHQ — File Utilities
 * Temp directory management, cleanup, MIME detection, validation.
 */

import { promises as fs } from "fs";
import path from "path";
import os from "os";
import { v4 as uuidv4 } from "uuid";

const TEMP_DIR = path.join(os.tmpdir(), "converthq");

/**
 * Ensure the temp directory exists
 */
export async function ensureTempDir(): Promise<string> {
  await fs.mkdir(TEMP_DIR, { recursive: true });
  return TEMP_DIR;
}

/**
 * Generate a unique temp file path
 */
export async function getTempFilePath(extension: string): Promise<string> {
  await ensureTempDir();
  const id = uuidv4();
  const filename = `${id}.${extension.replace(".", "")}`;
  return path.join(TEMP_DIR, filename);
}

/**
 * Get the ID from a temp file path
 */
export function getIdFromPath(filePath: string): string {
  const basename = path.basename(filePath);
  return basename.split(".")[0];
}

/**
 * Build a temp file path from an ID and extension
 */
export function buildTempPath(id: string, extension: string): string {
  return path.join(TEMP_DIR, `${id}.${extension.replace(".", "")}`);
}

/**
 * Save an uploaded file buffer to a temp path
 */
export async function saveUploadedFile(
  buffer: Buffer,
  extension: string
): Promise<{ filePath: string; id: string }> {
  const filePath = await getTempFilePath(extension);
  await fs.writeFile(filePath, buffer);
  const id = getIdFromPath(filePath);
  return { filePath, id };
}

/**
 * Read a temp file by ID (searches for any extension match)
 */
export async function findTempFile(id: string): Promise<string | null> {
  await ensureTempDir();
  const files = await fs.readdir(TEMP_DIR);
  const match = files.find((f) => f.startsWith(id));
  return match ? path.join(TEMP_DIR, match) : null;
}

/**
 * Delete a temp file
 */
export async function deleteTempFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath);
  } catch {
    // File may already be deleted
  }
}

/**
 * Clean up files older than maxAgeMs (default: 1 hour)
 */
export async function cleanupTempFiles(maxAgeMs = 60 * 60 * 1000): Promise<number> {
  await ensureTempDir();
  const files = await fs.readdir(TEMP_DIR);
  const now = Date.now();
  let deleted = 0;

  for (const file of files) {
    const filePath = path.join(TEMP_DIR, file);
    try {
      const stat = await fs.stat(filePath);
      if (now - stat.mtimeMs > maxAgeMs) {
        await fs.unlink(filePath);
        deleted++;
      }
    } catch {
      // Skip files that can't be read
    }
  }

  return deleted;
}

// Re-export browser-safe utilities so server-side code can import from one place
export { getExtension, validateFileSize, formatBytes } from "@/lib/shared-utils";
