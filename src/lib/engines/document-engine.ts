import { promises as fs } from "fs";
import { spawn } from "child_process";
import path from "path";

import { getIdFromPath, getTempFilePath } from "@/lib/file-utils";
import type { ConversionResult } from "@/lib/conversion-engine";

interface DocumentConvertOptions {
  inputPath: string;
  inputExtension: string;
  outputFormat: string;
}

export async function convertDocument(
  options: DocumentConvertOptions
): Promise<ConversionResult> {
  const inputExtension = options.inputExtension.toLowerCase().replace(".", "");
  const outputFormat = options.outputFormat.toLowerCase().replace(".", "");

  const supportedPairs: Record<string, string[]> = {
    pdf: ["docx"],
    docx: ["pdf"],
    pptx: ["pdf"],
    xlsx: ["pdf"],
    html: ["pdf"],
  };

  if (!supportedPairs[inputExtension]?.includes(outputFormat)) {
    throw new Error("Only PDF to DOCX and DOCX to PDF conversion are currently supported for documents.");
  }

  const outputPath = await getTempFilePath(outputFormat);
  const scriptName =
    inputExtension === "pdf"
      ? "pdf_to_docx.py"
      : inputExtension === "docx"
        ? "docx_to_pdf.py"
        : inputExtension === "pptx"
          ? "pptx_to_pdf.py"
          : inputExtension === "xlsx"
            ? "xlsx_to_pdf.py"
            : "html_to_pdf.py";
  const scriptPath = path.join(process.cwd(), "src", "lib", "scripts", scriptName);

  await new Promise<void>((resolve, reject) => {
    const child = spawn("python", [scriptPath, options.inputPath, outputPath], {
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(stderr || stdout || `Python converter exited with code ${code}`));
      }

      resolve();
    });
  });

  const originalStat = await fs.stat(options.inputPath);
  const convertedStat = await fs.stat(outputPath);

  return {
    outputPath,
    outputId: getIdFromPath(outputPath),
    originalSize: originalStat.size,
    convertedSize: convertedStat.size,
    format: "docx",
  };
}
