export interface Tool {
  id: string;
  name: string;
  description: string;
  category: "image" | "pdf" | "video" | "audio" | "document";
  href: string;
  keywords: string[];
}

export const TOOLS: Tool[] = [
  {
    id: "pdf-merge",
    name: "Merge PDF",
    description: "Combine multiple PDF files into one.",
    category: "pdf",
    href: "/convert?tab=pdf",
    keywords: ["pdf", "merge", "combine", "join"],
  },
  {
    id: "pdf-split",
    name: "Split PDF",
    description: "Separate pages from a PDF file.",
    category: "pdf",
    href: "/convert?tab=pdf",
    keywords: ["pdf", "split", "extract", "pages"],
  },
  {
    id: "pdf-compress",
    name: "Compress PDF",
    description: "Reduce PDF file size without losing quality.",
    category: "pdf",
    href: "/convert?tab=pdf",
    keywords: ["pdf", "compress", "shrink", "size"],
  },
  {
    id: "image-resize",
    name: "Bulk Image Resizer",
    description: "Resize multiple images at once.",
    category: "image",
    href: "/convert",
    keywords: ["image", "resize", "width", "height", "bulk"],
  },
  {
    id: "video-gif",
    name: "Video to GIF",
    description: "Convert video clips to high-quality GIFs.",
    category: "video",
    href: "/convert",
    keywords: ["video", "gif", "convert", "social"],
  },
  {
    id: "image-convert",
    name: "Image Converter",
    description: "Convert between JPG, PNG, WEBP, and more.",
    category: "image",
    href: "/convert",
    keywords: ["image", "convert", "jpg", "png", "webp"],
  },
];
