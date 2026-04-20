/**
 * ConvertHQ — Image Engine
 * Uses Sharp for high-performance image conversion and compression.
 */

import sharp from "sharp";
import path from "path";
import { getTempFilePath } from "@/lib/file-utils";

export interface ImageConvertOptions {
  inputPath: string;
  outputFormat: string;
  quality?: number; // 1-100, default 80
  width?: number;
  height?: number;
}

export interface ImageResult {
  outputPath: string;
  outputId: string;
  originalSize: number;
  convertedSize: number;
  format: string;
  width: number;
  height: number;
}

const FORMAT_HANDLERS: Record<string, (instance: sharp.Sharp, quality: number) => sharp.Sharp> = {
  jpg: (img, q) => img.jpeg({ quality: q, mozjpeg: true }),
  jpeg: (img, q) => img.jpeg({ quality: q, mozjpeg: true }),
  png: (img, q) => img.png({ quality: q, compressionLevel: 9 }),
  webp: (img, q) => img.webp({ quality: q }),
  avif: (img, q) => img.avif({ quality: q }),
  tiff: (img, q) => img.tiff({ quality: q }),
};

/**
 * Convert an image from one format to another
 */
export async function convertImage(options: ImageConvertOptions): Promise<ImageResult> {
  const { inputPath, outputFormat, quality = 80, width, height } = options;

  const normalizedFormat = outputFormat.toLowerCase().replace(".", "");
  const handler = FORMAT_HANDLERS[normalizedFormat];

  if (!handler) {
    throw new Error(`Unsupported output format: ${outputFormat}`);
  }

  const outputPath = await getTempFilePath(normalizedFormat);

  let pipeline = sharp(inputPath);

  // Resize if dimensions specified
  if (width || height) {
    pipeline = pipeline.resize(width, height, {
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  // Apply format conversion with quality
  pipeline = handler(pipeline, quality);

  // Write output
  const info = await pipeline.toFile(outputPath);

  // Get original file size
  const { promises: fs } = require("fs");
  const originalStat = await fs.stat(inputPath);

  const outputId = path.basename(outputPath).split(".")[0];

  return {
    outputPath,
    outputId,
    originalSize: originalStat.size,
    convertedSize: info.size,
    format: normalizedFormat,
    width: info.width,
    height: info.height,
  };
}

/**
 * Compress an image without changing format
 */
export async function compressImage(
  inputPath: string,
  quality: number = 60
): Promise<ImageResult> {
  const ext = path.extname(inputPath).slice(1).toLowerCase();
  const format = ext === "jpeg" ? "jpg" : ext;

  return convertImage({
    inputPath,
    outputFormat: format || "jpg",
    quality,
  });
}

/**
 * Get image metadata without processing
 */
export async function getImageMetadata(inputPath: string) {
  const metadata = await sharp(inputPath).metadata();
  return {
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
    size: metadata.size,
    hasAlpha: metadata.hasAlpha,
  };
}
