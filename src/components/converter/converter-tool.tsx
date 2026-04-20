"use client";

import { useState, useCallback } from "react";
import { FileDropzone } from "@/components/converter/file-dropzone";
import { FormatSelector } from "@/components/converter/format-selector";
import { ConversionProgress, type ConversionStatus } from "@/components/converter/conversion-progress";
import { DownloadCard } from "@/components/converter/download-card";
import { CompressionSlider } from "@/components/converter/compression-slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Zap, RefreshCw } from "lucide-react";
import { getExtension } from "@/lib/shared-utils";

interface ConversionResult {
  downloadUrl: string;
  format: string;
  originalSizeFormatted: string;
  convertedSizeFormatted: string;
  savings?: string;
}

export function ConverterTool() {
  const [activeTab, setActiveTab] = useState("convert");
  const [file, setFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState("");
  const [quality, setQuality] = useState(80);
  const [status, setStatus] = useState<ConversionStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [result, setResult] = useState<ConversionResult | null>(null);

  const inputExt = file ? getExtension(file.name) : "";

  const resetAll = useCallback(() => {
    setFile(null);
    setOutputFormat("");
    setQuality(80);
    setStatus("idle");
    setErrorMessage(undefined);
    setResult(null);
  }, []);

  const handleConvert = async () => {
    if (!file || !outputFormat) return;

    setStatus("uploading");
    setErrorMessage(undefined);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("format", outputFormat);
      formData.append("quality", quality.toString());

      setStatus("processing");

      const res = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Conversion failed");
      }

      setResult({
        downloadUrl: data.downloadUrl,
        format: data.format,
        originalSizeFormatted: data.originalSizeFormatted,
        convertedSizeFormatted: data.convertedSizeFormatted,
      });
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const handleCompress = async () => {
    if (!file) return;

    setStatus("uploading");
    setErrorMessage(undefined);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("quality", quality.toString());

      setStatus("processing");

      const res = await fetch("/api/compress", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Compression failed");
      }

      setResult({
        downloadUrl: data.downloadUrl,
        format: data.format,
        originalSizeFormatted: data.originalSizeFormatted,
        convertedSizeFormatted: data.compressedSizeFormatted,
        savings: data.savings,
      });
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-border/50">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
          <Zap className="size-6 text-primary" />
          File Converter
        </CardTitle>
        <CardDescription>
          Convert and compress images instantly. More formats coming soon.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); resetAll(); }}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="convert">Convert</TabsTrigger>
            <TabsTrigger value="compress">Compress</TabsTrigger>
          </TabsList>

          <TabsContent value="convert" className="space-y-6 pt-4">
            <FileDropzone
              onFileSelect={(f) => { setFile(f); setOutputFormat(""); setStatus("idle"); setResult(null); }}
              currentFile={file}
              onClear={resetAll}
            />

            {file && !result && (
              <>
                <FormatSelector
                  inputExtension={inputExt}
                  value={outputFormat}
                  onChange={setOutputFormat}
                />

                {outputFormat && (
                  <CompressionSlider value={quality} onChange={setQuality} />
                )}

                <ConversionProgress status={status} errorMessage={errorMessage} />

                {outputFormat && status !== "uploading" && status !== "processing" && (
                  <Button
                    onClick={handleConvert}
                    size="lg"
                    className="w-full font-semibold h-12"
                    disabled={!outputFormat}
                  >
                    Convert to {outputFormat.toUpperCase()}
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="compress" className="space-y-6 pt-4">
            <FileDropzone
              onFileSelect={(f) => { setFile(f); setStatus("idle"); setResult(null); }}
              currentFile={file}
              onClear={resetAll}
            />

            {file && !result && (
              <>
                <CompressionSlider value={quality} onChange={setQuality} />

                <ConversionProgress status={status} errorMessage={errorMessage} />

                {status !== "uploading" && status !== "processing" && (
                  <Button
                    onClick={handleCompress}
                    size="lg"
                    className="w-full font-semibold h-12"
                  >
                    Compress at {quality}% Quality
                    <RefreshCw className="ml-2 size-4" />
                  </Button>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>

        {result && (
          <>
            <Separator />
            <DownloadCard
              downloadUrl={result.downloadUrl}
              format={result.format}
              originalSize={result.originalSizeFormatted}
              convertedSize={result.convertedSizeFormatted}
              savings={result.savings}
              onConvertAnother={resetAll}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
