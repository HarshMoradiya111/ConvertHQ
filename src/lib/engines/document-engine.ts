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

  if (inputExtension !== "pdf" || outputFormat !== "docx") {
    throw new Error("Only PDF to DOCX conversion is currently supported for documents.");
  }

  const outputPath = await getTempFilePath("docx");
  const scriptPath = path.join(process.cwd(), "src", "lib", "scripts", "pdf_to_docx.py");

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
