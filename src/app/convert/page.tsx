import type { Metadata } from "next";
import { ConverterTool } from "@/components/converter/converter-tool";
import { Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Convert Files | ConvertHQ",
  description: "Convert and compress images, videos, and documents instantly. Free, fast, and secure file conversion.",
};

export default function ConvertPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Main */}

      {/* Main */}
      <main className="flex-1 py-12 px-4">
        <div className="container max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Convert Your Files
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Drop a file, pick a format, and download. No signup required. Your files are never stored.
            </p>
          </div>

          <ConverterTool />

          {/* Supported formats info */}
          <div className="text-center space-y-2 pt-8">
            <p className="text-sm font-medium text-muted-foreground">Currently supported</p>
            <div className="flex flex-wrap justify-center gap-2">
              {["JPG", "PNG", "WebP", "AVIF", "TIFF", "GIF", "BMP"].map((fmt) => (
                <span
                  key={fmt}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground"
                >
                  {fmt}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground pt-2">
              Video, audio, and document conversion coming soon.
            </p>
          </div>
        </div>
      </main>

    </div>
  );
}
