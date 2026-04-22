/**
 * ConvertHQ — Image Engine
 * Uses Sharp for high-performance image conversion and compression.
 */

import sharp from "sharp";
import path from "path";
import { promises as fs } from "fs";
import { PDFDocument } from "pdf-lib";
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

async function convertImageToPdf(inputPath: string): Promise<ImageResult> {
  const metadata = await sharp(inputPath).metadata();
  const width = metadata.width ?? 1000;
  const height = metadata.height ?? 1000;
  const format = (metadata.format || "").toLowerCase();
  const inputBuffer = await sharp(inputPath).toBuffer();

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([width, height]);

  let embeddedImage;
  if (format === "jpeg" || format === "jpg") {
    embeddedImage = await pdfDoc.embedJpg(inputBuffer);
  } else {
    const pngBuffer = await sharp(inputPath).png().toBuffer();
    embeddedImage = await pdfDoc.embedPng(pngBuffer);
  }

  page.drawImage(embeddedImage, {
    x: 0,
    y: 0,
    width,
    height,
  });

  const outputPath = await getTempFilePath("pdf");
  const pdfBytes = await pdfDoc.save();
  await fs.writeFile(outputPath, pdfBytes);

  const originalStat = await fs.stat(inputPath);
  return {
    outputPath,
    outputId: path.basename(outputPath).split(".")[0],
    originalSize: originalStat.size,
    convertedSize: pdfBytes.length,
    format: "pdf",
    width,
    height,
  };
}

/**
 * Convert an image from one format to another
 */
export async function convertImage(options: ImageConvertOptions): Promise<ImageResult> {
  const { inputPath, outputFormat, quality = 80, width, height } = options;

  const normalizedFormat = outputFormat.toLowerCase().replace(".", "");
  if (normalizedFormat === "pdf") {
    return await convertImageToPdf(inputPath);
  }

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
