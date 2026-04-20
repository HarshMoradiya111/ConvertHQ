/**
 * POST /api/compress
 * Accepts a file upload + quality setting, compresses it, returns download info.
 */

import { NextResponse } from "next/server";
import { processCompression } from "@/lib/conversion-engine";
import { saveUploadedFile, getExtension, formatBytes } from "@/lib/file-utils";
import { FILE_LIMITS, getCategoryFromExtension, isCategoryEnabled } from "@/lib/format-map";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const quality = parseInt(formData.get("quality") as string) || 60;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (quality < 1 || quality > 100) {
      return NextResponse.json({ error: "Quality must be between 1 and 100" }, { status: 400 });
    }

    // Validate file size
    if (file.size > FILE_LIMITS.FREE_MAX_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${formatBytes(FILE_LIMITS.FREE_MAX_SIZE)}` },
        { status: 413 }
      );
    }

    const inputExt = getExtension(file.name);
    const category = getCategoryFromExtension(inputExt);

    if (!category || !isCategoryEnabled(category)) {
      return NextResponse.json(
        { error: `Compression for ${inputExt.toUpperCase()} files is not yet supported` },
        { status: 400 }
      );
    }

    // Save uploaded file to temp
    const buffer = Buffer.from(await file.arrayBuffer());
    const { filePath: inputPath } = await saveUploadedFile(buffer, inputExt);

    // Process compression
    const result = await processCompression(inputPath, inputExt, quality);

    const savings = Math.round((1 - result.convertedSize / result.originalSize) * 100);

    return NextResponse.json({
      success: true,
      downloadId: result.outputId,
      format: result.format,
      quality,
      originalSize: result.originalSize,
      compressedSize: result.convertedSize,
      originalSizeFormatted: formatBytes(result.originalSize),
      compressedSizeFormatted: formatBytes(result.convertedSize),
      savings: `${savings}%`,
      downloadUrl: `/api/download/${result.outputId}`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Compression failed";
    console.error("Compression error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
