import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

let ffmpeg: FFmpeg | null = null;

export async function loadFFmpeg() {
  if (ffmpeg) return ffmpeg;

  ffmpeg = new FFmpeg();
  
  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
  });

  return ffmpeg;
}

export async function convertVideo(
  file: File,
  outputFormat: string,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const ffmpeg = await loadFFmpeg();
  
  const inputName = file.name;
  const outputName = `output.${outputFormat}`;

  await ffmpeg.writeFile(inputName, await fetchFile(file));

  if (onProgress) {
    ffmpeg.on("progress", ({ progress }) => {
      onProgress(progress * 100);
    });
  }

  // Basic conversion command
  await ffmpeg.exec(["-i", inputName, outputName]);

  const data = await ffmpeg.readFile(outputName);
  const uint8Array = new Uint8Array(data as any);
  return new Blob([uint8Array], { type: `video/${outputFormat}` });
}
