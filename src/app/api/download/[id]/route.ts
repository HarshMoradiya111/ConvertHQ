/**
 * GET /api/download/[id]
 * Serves a converted/compressed file for download, then schedules cleanup.
 */

import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { findTempFile } from "@/lib/file-utils";
import { FORMAT_MAP } from "@/lib/format-map";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || id.length < 10) {
      return NextResponse.json({ error: "Invalid download ID" }, { status: 400 });
    }

    const filePath = await findTempFile(id);

    if (!filePath) {
      return NextResponse.json(
        { error: "File not found or expired. Files are deleted after 1 hour." },
        { status: 404 }
      );
    }

    const buffer = await fs.readFile(filePath);
    const ext = path.extname(filePath).slice(1).toLowerCase();
    const formatInfo = FORMAT_MAP[ext];
    const mimeType = formatInfo?.mimeType || "application/octet-stream";
    const label = formatInfo?.label || ext.toUpperCase();

    // Schedule deletion after download (5 minutes grace period for re-downloads)
    setTimeout(async () => {
      try {
        await fs.unlink(filePath);
      } catch {
        // Already deleted
      }
    }, 5 * 60 * 1000);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="converthq-output.${ext}"`,
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "no-store",
      },
    });
  } catch (error: unknown) {
    console.error("Download error:", error);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
