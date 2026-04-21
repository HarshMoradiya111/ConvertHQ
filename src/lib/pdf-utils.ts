import { PDFDocument } from "pdf-lib";

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
  return new Blob([pdfBytes as any], { type: "application/pdf" });
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
    resultBlobs.push(new Blob([pdfBytes as any], { type: "application/pdf" }));
  }

  return resultBlobs;
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
  
  return new Blob([pdfBytes as any], { type: "application/pdf" });
}
