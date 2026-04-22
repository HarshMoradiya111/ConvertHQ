/**
 * POST /api/pdf-security
 * Handles PDF unlock and protect operations.
 */

import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { spawn } from "child_process";
import { saveUploadedFile, formatBytes, getExtension } from "@/lib/file-utils";
import { FILE_LIMITS } from "@/lib/format-map";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const action = String(formData.get("action") || "");
    const password = String(formData.get("password") || "");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!password.trim()) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    if (file.size > FILE_LIMITS.FREE_MAX_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${formatBytes(FILE_LIMITS.FREE_MAX_SIZE)}` },
        { status: 413 }
      );
    }

    if (!['protect', 'unlock'].includes(action)) {
      return NextResponse.json({ error: "Invalid security action" }, { status: 400 });
    }

    const inputExt = getExtension(file.name) || "pdf";
    const buffer = Buffer.from(await file.arrayBuffer());
    const { filePath: inputPath } = await saveUploadedFile(buffer, inputExt);
    const outputPath = path.join(path.dirname(inputPath), `${path.basename(inputPath, path.extname(inputPath))}-secured.pdf`);
    const scriptPath = path.join(process.cwd(), "src", "lib", "scripts", "pdf_security.py");

    const result = await new Promise<void>((resolve, reject) => {
      const child = spawn("python", [scriptPath, action, inputPath, outputPath, password], {
        stdio: ["ignore", "pipe", "pipe"],
        windowsHide: true,
      });

      let stdout = "";
      let stderr = "";

      child.stdout.on("data", (chunk) => {
        stdout += chunk.toString();
      });

      child.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
      });

      child.on("error", reject);
      child.on("close", (code) => {
        if (code !== 0) {
          return reject(new Error(stderr || stdout || `Python converter exited with code ${code}`));
        }
        resolve();
      });
    });

    void result;
    const outputStat = await fs.stat(outputPath);
    const originalStat = await fs.stat(inputPath);

    return NextResponse.json({
      success: true,
      format: "pdf",
      downloadId: path.basename(outputPath).split(".")[0],
      originalSize: originalStat.size,
      convertedSize: outputStat.size,
      originalSizeFormatted: formatBytes(originalStat.size),
      convertedSizeFormatted: formatBytes(outputStat.size),
      downloadUrl: `/api/download/${path.basename(outputPath).split(".")[0]}`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "PDF security failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}