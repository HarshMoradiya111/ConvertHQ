import { PDFDocument, degrees, StandardFonts, rgb } from "pdf-lib";

type PdfJsModule = typeof import("pdfjs-dist/legacy/build/pdf.mjs");

async function loadPdfJs(): Promise<PdfJsModule> {
  return import("pdfjs-dist/legacy/build/pdf.mjs");
}

function parsePageRanges(rangeText: string, pageCount: number): number[] {
  const normalized = rangeText.trim();

  if (!normalized) {
    throw new Error("Enter at least one page number or range, like 1-3,5.");
  }

  const pageIndexes = new Set<number>();

  for (const token of normalized.split(",")) {
    const part = token.trim();

    if (!part) continue;

    const rangeMatch = part.match(/^(\d+)\s*-\s*(\d+)$/);
    if (rangeMatch) {
      const start = Number(rangeMatch[1]);
      const end = Number(rangeMatch[2]);

      if (start < 1 || end < 1 || start > end) {
        throw new Error(`Invalid page range: ${part}`);
      }

      for (let page = start; page <= end; page++) {
        if (page > pageCount) {
          throw new Error(`Page ${page} is out of range. This PDF only has ${pageCount} pages.`);
        }
        pageIndexes.add(page - 1);
      }

      continue;
    }

    if (!/^\d+$/.test(part)) {
      throw new Error(`Invalid page token: ${part}`);
    }

    const page = Number(part);
    if (page < 1 || page > pageCount) {
      throw new Error(`Page ${page} is out of range. This PDF only has ${pageCount} pages.`);
    }

    pageIndexes.add(page - 1);
  }

  if (pageIndexes.size === 0) {
    throw new Error("Enter at least one valid page number or range.");
  }

  return [...pageIndexes].sort((a, b) => a - b);
}

/**
 * Merges multiple PDF files into a single PDF.
 */
export async function mergePDFs(files: File[]): Promise<Blob> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const pdfBytes = await mergedPdf.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}

/**
 * Splits a PDF into multiple PDFs (one per page).
 */
export async function splitPDF(file: File): Promise<Blob[]> {
  const arrayBuffer = await file.arrayBuffer();
  const mainPdf = await PDFDocument.load(arrayBuffer);
  const pageCount = mainPdf.getPageCount();
  const resultBlobs: Blob[] = [];

  for (let i = 0; i < pageCount; i++) {
    const subPdf = await PDFDocument.create();
    const [copiedPage] = await subPdf.copyPages(mainPdf, [i]);
    subPdf.addPage(copiedPage);
    const pdfBytes = await subPdf.save();
    resultBlobs.push(new Blob([pdfBytes], { type: "application/pdf" }));
  }

  return resultBlobs;
}

/**
 * Remove the selected pages from a PDF.
 */
export async function removePDFPages(file: File, rangeText: string): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const output = await PDFDocument.load(arrayBuffer);
  const removeIndexes = parsePageRanges(rangeText, output.getPageCount());

  for (let i = removeIndexes.length - 1; i >= 0; i--) {
    output.removePage(removeIndexes[i]);
  }

  if (output.getPageCount() === 0) {
    throw new Error("Removing those pages would leave the PDF empty.");
  }

  const pdfBytes = await output.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}

/**
 * Extract only the selected pages into a new PDF.
 */
export async function extractPDFPages(file: File, rangeText: string): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const pageCount = pdf.getPageCount();
  const extractIndexes = parsePageRanges(rangeText, pageCount);
  const extractedPdf = await PDFDocument.create();

  const copiedPages = await extractedPdf.copyPages(pdf, extractIndexes);
  copiedPages.forEach((page) => extractedPdf.addPage(page));

  const pdfBytes = await extractedPdf.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}

/**
 * Rotate every page in a PDF by the provided degree amount.
 */
export async function rotatePDF(file: File, rotation = 90): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);

  for (const page of pdf.getPages()) {
    page.setRotation(degrees(rotation));
  }

  const pdfBytes = await pdf.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}

/**
 * Add page numbers to every page in a PDF.
 */
export async function addPageNumbersPDF(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const pageCount = pdf.getPageCount();

  pdf.getPages().forEach((page, index) => {
    const label = `Page ${index + 1} of ${pageCount}`;
    const textSize = 10;
    const textWidth = font.widthOfTextAtSize(label, textSize);
    const x = (page.getWidth() - textWidth) / 2;
    const y = 18;

    page.drawText(label, {
      x,
      y,
      size: textSize,
      font,
      color: rgb(0.35, 0.35, 0.35),
    });
  });

  const pdfBytes = await pdf.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}

/**
 * Add a translucent diagonal watermark to every page.
 */
export async function watermarkPDF(file: File, watermarkText = "ConvertHQ"): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);

  pdf.getPages().forEach((page) => {
    const textSize = Math.max(24, Math.min(page.getWidth(), page.getHeight()) / 6);
    const textWidth = font.widthOfTextAtSize(watermarkText, textSize);
    const x = (page.getWidth() - textWidth) / 2;
    const y = page.getHeight() / 2;

    page.drawText(watermarkText, {
      x,
      y,
      size: textSize,
      font,
      color: rgb(0.5, 0.5, 0.5),
      opacity: 0.18,
      rotate: degrees(45),
    });
  });

  const pdfBytes = await pdf.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}

/**
 * Crop all pages by a uniform padding amount on each side.
 */
export async function cropPDF(file: File, padding = 20): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);

  pdf.getPages().forEach((page) => {
    const width = page.getWidth();
    const height = page.getHeight();
    const safePadding = Math.max(0, Math.min(padding, Math.floor(Math.min(width, height) / 2) - 1));

    page.setCropBox(
      safePadding,
      safePadding,
      width - safePadding * 2,
      height - safePadding * 2
    );
  });

  const pdfBytes = await pdf.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}

/**
 * Basic PDF compression by flattening and re-saving.
 * Note: Professional compression requires image downscaling which is more complex.
 */
export async function compressPDF(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  
  // This is a basic compression by re-encoding
  const pdfBytes = await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });
  
  return new Blob([pdfBytes], { type: "application/pdf" });
}

/**
 * Repair a PDF by loading and re-saving it.
 */
export async function repairPDF(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);

  const pdfBytes = await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });

  return new Blob([pdfBytes], { type: "application/pdf" });
}

/**
 * Convert each PDF page to a JPG image.
 */
export async function pdfToJpg(file: File, quality = 0.92): Promise<Blob[]> {
  const pdfjs = await loadPdfJs();
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(arrayBuffer),
    disableWorker: true,
  });

  const pdf = await loadingTask.promise;
  const blobs: Blob[] = [];

  try {
    for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex++) {
      const page = await pdf.getPage(pageIndex);
      const viewport = page.getViewport({ scale: 2 });

      const canvas = document.createElement("canvas");
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);

      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("Could not create canvas context for PDF rendering.");
      }

      await page.render({ canvasContext: context, viewport }).promise;

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (output) => {
            if (!output) {
              reject(new Error(`Failed to render page ${pageIndex} to JPG.`));
              return;
            }
            resolve(output);
          },
          "image/jpeg",
          quality
        );
      });

      blobs.push(blob);
      page.cleanup();
    }
  } finally {
    await pdf.destroy();
  }

  return blobs;
}
