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
import { ArrowRight, Zap, RefreshCw, Download, FileArchive, Plus, X, Video, Music, Loader2 } from "lucide-react";
import { getExtension } from "@/lib/shared-utils";
import JSZip from "jszip";
import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";
import { getCategoryFromExtension } from "@/lib/format-map";
import { convertVideo } from "@/lib/video-utils";

interface ConversionResult {
  downloadUrl: string;
  format: string;
  originalSizeFormatted: string;
  convertedSizeFormatted: string;
  savings?: string;
}

export function ConverterTool() {
  const [activeTab, setActiveTab] = useState("convert");
  const [files, setFiles] = useState<File[]>([]);
  const [outputFormat, setOutputFormat] = useState("");
  const [quality, setQuality] = useState(80);
  const [status, setStatus] = useState<ConversionStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [results, setResults] = useState<ConversionResult[]>([]);
  const [userTier, setUserTier] = useState<string>("free");
  const [isZipping, setIsZipping] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("tier")
          .eq("id", session.user.id)
          .single();
        if (profile) setUserTier(profile.tier);
      }
    };
    fetchUser();
  }, []);

  const inputExt = files.length > 0 ? getExtension(files[0].name) : "";

  const resetAll = useCallback(() => {
    setFiles([]);
    setOutputFormat("");
    setQuality(80);
    setStatus("idle");
    setErrorMessage(undefined);
    setResults([]);
  }, []);

  const handleConvert = async () => {
    if (files.length === 0 || !outputFormat) return;

    setStatus("uploading");
    setErrorMessage(undefined);
    setResults([]);

    try {
      const newResults: ConversionResult[] = [];
      
      for (const file of files) {
        const category = getCategoryFromExtension(getExtension(file.name));
        
        if ((category === "video" || category === "audio") && userTier !== "pro") {
          throw new Error("Video & Audio conversion is a Pro feature. Please upgrade to continue.");
        }

        if (category === "video" || category === "audio") {
          setStatus("processing");
          const blob = await convertVideo(file, outputFormat, (p) => {
            // We could show progress here if we wanted
          });
          
          const url = URL.createObjectURL(blob);
          newResults.push({
            downloadUrl: url,
            format: outputFormat,
            originalSizeFormatted: (file.size / (1024 * 1024)).toFixed(2) + " MB",
            convertedSizeFormatted: (blob.size / (1024 * 1024)).toFixed(2) + " MB",
          });
        } else {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("format", outputFormat);
          formData.append("quality", quality.toString());

          const res = await fetch("/api/convert", {
            method: "POST",
            body: formData,
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.error || `Conversion failed for ${file.name}`);
          }

          newResults.push({
            downloadUrl: data.downloadUrl,
            format: data.format,
            originalSizeFormatted: data.originalSizeFormatted,
            convertedSizeFormatted: data.convertedSizeFormatted,
          });
        }
      }

      setResults(newResults);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const handleDownloadAll = async () => {
    if (results.length === 0) return;
    
    setIsZipping(true);
    try {
      const zip = new JSZip();
      
      for (let i = 0; i < results.length; i++) {
        const res = await fetch(results[i].downloadUrl);
        const blob = await res.blob();
        const fileName = `converted-${i + 1}.${results[i].format}`;
        zip.file(fileName, blob);
      }
      
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = "converthq-batch.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Zip failed:", error);
    } finally {
      setIsZipping(false);
    }
  };

  const handleCompress = async () => {
    if (files.length === 0) return;

    setStatus("uploading");
    setErrorMessage(undefined);
    setResults([]);

    try {
      const newResults: ConversionResult[] = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("quality", quality.toString());

        const res = await fetch("/api/compress", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || `Compression failed for ${file.name}`);
        }

        newResults.push({
          downloadUrl: data.downloadUrl,
          format: data.format,
          originalSizeFormatted: data.originalSizeFormatted,
          convertedSizeFormatted: data.compressedSizeFormatted,
          savings: data.savings,
        });
      }

      setResults(newResults);
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
              onFileSelect={(f) => { 
                setFiles(prev => [...prev, f]); 
                setOutputFormat(""); 
                setStatus("idle"); 
                setResults([]); 
              }}
              currentFile={files[0] || null} // Placeholder for UI, we will enhance this
              onClear={resetAll}
            />

            {files.length > 0 && results.length === 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-500">Selected Files ({files.length})</h4>
                  <Button variant="ghost" size="sm" onClick={() => setFiles([])} className="text-xs">
                    Clear All
                  </Button>
                </div>
                <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-sm">
                      <span className="truncate flex-1 mr-4">{f.name}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="size-6 text-slate-400"
                        onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-dashed"
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.multiple = true;
                      input.onchange = (e) => {
                        const newFiles = Array.from((e.target as HTMLInputElement).files || []);
                        setFiles(prev => [...prev, ...newFiles]);
                      };
                      input.click();
                    }}
                  >
                    <Plus className="mr-2 size-4" /> Add More
                  </Button>
                </div>
              </div>
            )}

            {files.length > 0 && results.length === 0 && (
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
              onFileSelect={(f) => { setFiles(prev => [...prev, f]); setStatus("idle"); setResults([]); }}
              currentFile={files[0] || null}
              onClear={resetAll}
            />

            {files.length > 0 && results.length === 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-500">Selected Files ({files.length})</h4>
                  <Button variant="ghost" size="sm" onClick={() => setFiles([])} className="text-xs">
                    Clear All
                  </Button>
                </div>
                <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-sm">
                      <span className="truncate flex-1 mr-4">{f.name}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="size-6 text-slate-400"
                        onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {files.length > 0 && results.length === 0 && (
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

        {results.length > 0 && (
          <div className="space-y-6">
            <Separator />
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white">Conversion Results ({results.length})</h3>
              <Button 
                variant={userTier === "pro" ? "default" : "secondary"}
                size="sm"
                className="font-bold"
                onClick={userTier === "pro" ? handleDownloadAll : () => window.location.href = "/pricing"}
                disabled={isZipping}
              >
                {isZipping ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <FileArchive className="mr-2 size-4" />
                )}
                Download All (.zip)
                {userTier !== "pro" && <Zap className="ml-2 size-3 text-amber-500 fill-amber-500" />}
              </Button>
            </div>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {results.map((res, i) => (
                <DownloadCard
                  key={i}
                  downloadUrl={res.downloadUrl}
                  format={res.format}
                  originalSize={res.originalSizeFormatted}
                  convertedSize={res.convertedSizeFormatted}
                  savings={res.savings}
                  onConvertAnother={i === results.length - 1 ? resetAll : undefined}
                />
              ))}
            </div>
            
            <Button variant="ghost" onClick={resetAll} className="w-full">
              Convert More Files
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
