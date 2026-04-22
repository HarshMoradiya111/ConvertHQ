/**
 * ConvertHQ — Conversion Engine
 * Central router that maps input format to the correct processing engine.
 */

import { getCategoryFromExtension, isCategoryEnabled } from "@/lib/format-map";
import { convertImage, compressImage, type ImageResult } from "@/lib/engines/image-engine";
import { convertDocument } from "@/lib/engines/document-engine";

export interface ConversionRequest {
  inputPath: string;
  inputExtension: string;
  outputFormat: string;
  quality?: number;
  width?: number;
  height?: number;
}

export interface ConversionResult {
  outputPath: string;
  outputId: string;
  originalSize: number;
  convertedSize: number;
  format: string;
}

/**
 * Route a conversion request to the appropriate engine
 */
export async function processConversion(request: ConversionRequest): Promise<ConversionResult> {
  const category = getCategoryFromExtension(request.inputExtension);

  if (!category) {
    throw new Error(`Unsupported input format: ${request.inputExtension}`);
  }

  if (!isCategoryEnabled(category)) {
    throw new Error(
      `${category} conversion is not yet available. Coming soon in a future update!`
    );
  }

  switch (category) {
    case "image":
      return await convertImage({
        inputPath: request.inputPath,
        outputFormat: request.outputFormat,
        quality: request.quality,
        width: request.width,
        height: request.height,
      });

    case "video":
      throw new Error("Video conversion coming soon in Phase 1!");

    case "audio":
      throw new Error("Audio conversion coming soon in Phase 1!");

    case "document":
      return await convertDocument({
        inputPath: request.inputPath,
        inputExtension: request.inputExtension,
        outputFormat: request.outputFormat,
      });

    default:
      throw new Error(`Unknown category: ${category}`);
  }
}

/**
 * Route a compression request to the appropriate engine
 */
export async function processCompression(
  inputPath: string,
  inputExtension: string,
  quality: number
): Promise<ConversionResult> {
  const category = getCategoryFromExtension(inputExtension);

  if (!category) {
    throw new Error(`Unsupported format: ${inputExtension}`);
  }

  if (!isCategoryEnabled(category)) {
    throw new Error(
      `${category} compression is not yet available. Coming soon!`
    );
  }

  switch (category) {
    case "image":
      return await compressImage(inputPath, quality);

    default:
      throw new Error(`Compression not supported for ${category} files yet.`);
  }
}
