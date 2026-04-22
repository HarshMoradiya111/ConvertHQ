/**
 * ConvertHQ — Format Map
 * Type-safe mapping of supported file conversions.
 */

export type FileCategory = "image" | "video" | "audio" | "document";

export interface FormatInfo {
  extension: string;
  mimeType: string;
  category: FileCategory;
  label: string;
}

export const FORMAT_MAP: Record<string, FormatInfo> = {
  // Images
  jpg: { extension: "jpg", mimeType: "image/jpeg", category: "image", label: "JPEG" },
  jpeg: { extension: "jpg", mimeType: "image/jpeg", category: "image", label: "JPEG" },
  png: { extension: "png", mimeType: "image/png", category: "image", label: "PNG" },
  webp: { extension: "webp", mimeType: "image/webp", category: "image", label: "WebP" },
  avif: { extension: "avif", mimeType: "image/avif", category: "image", label: "AVIF" },
  tiff: { extension: "tiff", mimeType: "image/tiff", category: "image", label: "TIFF" },
  gif: { extension: "gif", mimeType: "image/gif", category: "image", label: "GIF" },
  bmp: { extension: "bmp", mimeType: "image/bmp", category: "image", label: "BMP" },
  svg: { extension: "svg", mimeType: "image/svg+xml", category: "image", label: "SVG" },

  // Video
  mp4: { extension: "mp4", mimeType: "video/mp4", category: "video", label: "MP4" },
  mov: { extension: "mov", mimeType: "video/quicktime", category: "video", label: "MOV" },
  avi: { extension: "avi", mimeType: "video/x-msvideo", category: "video", label: "AVI" },
  mkv: { extension: "mkv", mimeType: "video/x-matroska", category: "video", label: "MKV" },
  webm: { extension: "webm", mimeType: "video/webm", category: "video", label: "WebM" },
  flv: { extension: "flv", mimeType: "video/x-flv", category: "video", label: "FLV" },

  // Audio
  mp3: { extension: "mp3", mimeType: "audio/mpeg", category: "audio", label: "MP3" },
  wav: { extension: "wav", mimeType: "audio/wav", category: "audio", label: "WAV" },
  aac: { extension: "aac", mimeType: "audio/aac", category: "audio", label: "AAC" },
  ogg: { extension: "ogg", mimeType: "audio/ogg", category: "audio", label: "OGG" },
  flac: { extension: "flac", mimeType: "audio/flac", category: "audio", label: "FLAC" },
  m4a: { extension: "m4a", mimeType: "audio/mp4", category: "audio", label: "M4A" },

  // Documents
  pdf: { extension: "pdf", mimeType: "application/pdf", category: "document", label: "PDF" },
  docx: { extension: "docx", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", category: "document", label: "DOCX" },
  xlsx: { extension: "xlsx", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", category: "document", label: "XLSX" },
  pptx: { extension: "pptx", mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation", category: "document", label: "PPTX" },
  txt: { extension: "txt", mimeType: "text/plain", category: "document", label: "TXT" },
  csv: { extension: "csv", mimeType: "text/csv", category: "document", label: "CSV" },
};

/**
 * Defines which output formats are available for each input category.
 * Phase 0.5 = image only. Video/Audio/Document added in Phase 1.
 */
export const CONVERSION_TARGETS: Record<FileCategory, string[]> = {
  image: ["jpg", "png", "webp", "avif", "tiff"],
  video: ["mp4", "webm", "avi", "mov", "gif"],
  audio: ["mp3", "wav", "aac", "ogg", "flac"],
  document: ["pdf", "docx", "txt", "csv"],
};

const DOCUMENT_CONVERSION_TARGETS: Record<string, string[]> = {
  pdf: ["docx"],
};

/**
 * Max file sizes in bytes
 */
export const FILE_LIMITS = {
  FREE_MAX_SIZE: 50 * 1024 * 1024,   // 50MB
  PRO_MAX_SIZE: 200 * 1024 * 1024,   // 200MB
  FREE_DAILY_LIMIT: 5,
  PRO_DAILY_LIMIT: Infinity,
};

/**
 * Get category from file extension
 */
export function getCategoryFromExtension(ext: string): FileCategory | null {
  const normalized = ext.toLowerCase().replace(".", "");
  const format = FORMAT_MAP[normalized];
  return format?.category ?? null;
}

/**
 * Get available output formats for a given input extension
 */
export function getOutputFormats(inputExtension: string): FormatInfo[] {
  const category = getCategoryFromExtension(inputExtension);
  if (!category) return [];
  if (!isCategoryEnabled(category)) return [];

  const normalizedInput = inputExtension.toLowerCase().replace(".", "");

  if (category === "document") {
    return (DOCUMENT_CONVERSION_TARGETS[normalizedInput] || [])
      .map((ext) => FORMAT_MAP[ext])
      .filter(Boolean);
  }

  return CONVERSION_TARGETS[category]
    .filter((ext) => ext !== normalizedInput)
    .map((ext) => FORMAT_MAP[ext])
    .filter(Boolean);
}

/**
 * Check if a conversion is supported
 */
export function isConversionSupported(inputExt: string, outputExt: string): boolean {
  const inputCategory = getCategoryFromExtension(inputExt);
  const outputCategory = getCategoryFromExtension(outputExt);

  if (!inputCategory || !outputCategory) return false;
  if (inputCategory !== outputCategory) return false;

  const normalizedInput = inputExt.toLowerCase().replace(".", "");
  const normalizedOutput = outputExt.toLowerCase().replace(".", "");

  if (inputCategory === "document") {
    return (DOCUMENT_CONVERSION_TARGETS[normalizedInput] || []).includes(normalizedOutput);
  }

  return CONVERSION_TARGETS[inputCategory].includes(normalizedOutput);
}

/**
 * Formats currently enabled for MVP (Phase 0.5 = image only)
 */
export const ENABLED_CATEGORIES: FileCategory[] = ["image", "video", "audio", "document"];

export function isCategoryEnabled(category: FileCategory): boolean {
  return ENABLED_CATEGORIES.includes(category);
}
