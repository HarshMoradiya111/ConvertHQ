/**
 * POST /api/convert
 * Accepts a file upload + target format, converts it, returns download info.
 */

import { NextResponse } from "next/server";
import { processConversion } from "@/lib/conversion-engine";
import { saveUploadedFile, getExtension, formatBytes } from "@/lib/file-utils";
import { isConversionSupported, FILE_LIMITS } from "@/lib/format-map";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const targetFormat = formData.get("format") as string | null;
    const quality = parseInt(formData.get("quality") as string) || 80;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!targetFormat) {
      return NextResponse.json({ error: "No target format specified" }, { status: 400 });
    }

    // Validate file size
    if (file.size > FILE_LIMITS.FREE_MAX_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${formatBytes(FILE_LIMITS.FREE_MAX_SIZE)}` },
        { status: 413 }
      );
    }

    const inputExt = getExtension(file.name);

    // Validate conversion is supported
    if (!isConversionSupported(inputExt, targetFormat)) {
      return NextResponse.json(
        { error: `Conversion from ${inputExt.toUpperCase()} to ${targetFormat.toUpperCase()} is not supported` },
        { status: 400 }
      );
    }

    // Save uploaded file to temp
    const buffer = Buffer.from(await file.arrayBuffer());
    const { filePath: inputPath } = await saveUploadedFile(buffer, inputExt);

    // Process conversion
    const result = await processConversion({
      inputPath,
      inputExtension: inputExt,
      outputFormat: targetFormat,
      quality,
    });

    return NextResponse.json({
      success: true,
      downloadId: result.outputId,
      format: result.format,
      originalSize: result.originalSize,
      convertedSize: result.convertedSize,
      originalSizeFormatted: formatBytes(result.originalSize),
      convertedSizeFormatted: formatBytes(result.convertedSize),
      downloadUrl: `/api/download/${result.outputId}`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Conversion failed";
    console.error("Conversion error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
