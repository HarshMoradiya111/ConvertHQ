"use client";

import { useState, useCallback } from "react";
import { FileDropzone } from "@/components/converter/file-dropzone";
import { FormatSelector } from "@/components/converter/format-selector";
import { ConversionProgress, type ConversionStatus } from "@/components/converter/conversion-progress";
import { DownloadCard } from "@/components/converter/download-card";
import { CompressionSlider } from "@/components/converter/compression-slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Zap, RefreshCw, Download, FileArchive, Plus, X, Video, Music, Loader2 } from "lucide-react";
import { getExtension } from "@/lib/shared-utils";
import JSZip from "jszip";
import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";
import { getCategoryFromExtension, isCategoryEnabled } from "@/lib/format-map";
import { convertVideo } from "@/lib/video-utils";
import { AdBanner } from "@/components/ads/ad-banner";
import { mergePDFs, splitPDF, compressPDF } from "@/lib/pdf-utils";
import { resizeImage } from "@/lib/image-utils";
import { logConversion } from "@/lib/conversion-history";

interface ConversionResult {
  downloadUrl: string;
  format: string;
  originalSizeFormatted: string;
  convertedSizeFormatted: string;
  savings?: string;
}

interface ConverterToolProps {
  defaultTab?: string;
}

export function ConverterTool({ defaultTab = "convert" }: ConverterToolProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [files, setFiles] = useState<File[]>([]);
  const [outputFormat, setOutputFormat] = useState("");
  const [quality, setQuality] = useState(80);
  const [status, setStatus] = useState<ConversionStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [results, setResults] = useState<ConversionResult[]>([]);
  const [userTier, setUserTier] = useState<string>("free");
  const [userId, setUserId] = useState<string | null>(null);
  const [resizeWidth, setResizeWidth] = useState<number>(0);
  const [resizeHeight, setResizeHeight] = useState<number>(0);
  const [pdfOp, setPdfOp] = useState<"merge" | "split" | "compress">("merge");
  const [isZipping, setIsZipping] = useState(false);

  const getPresets = (file: File) => {
    const ext = getExtension(file.name);
    const cat = getCategoryFromExtension(ext);
    
    if (cat === "image") {
      return [
        { label: "Convert to JPG", format: "jpg" },
        { label: "Convert to PNG", format: "png" },
        { label: "Convert to PDF", format: "pdf" },
        { label: "Resize", action: () => { setResizeWidth(800); setResizeHeight(600); } },
      ];
    }
    if (ext === "pdf") {
      return [
        { label: "Compress PDF", action: () => setPdfOp("compress") },
        { label: "Split PDF", action: () => setPdfOp("split") },
      ];
    }
    if (cat === "video") {
      return [
        { label: "Convert to GIF", format: "gif" },
        { label: "Convert to MP4", format: "mp4" },
      ];
    }
    return [];
  };

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id);
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
  const inputCategory = inputExt ? getCategoryFromExtension(inputExt) : null;
  const isInputCategoryEnabled = inputCategory ? isCategoryEnabled(inputCategory) : true;

  const resetAll = useCallback(() => {
    setFiles([]);
    setOutputFormat("");
    setQuality(80);
    setStatus("idle");
    setErrorMessage(undefined);
    setResults([]);
    setResizeWidth(0);
    setResizeHeight(0);
    setPdfOp("merge");
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

        if (category && !isCategoryEnabled(category)) {
          throw new Error(`${category} conversion is not yet available. Coming soon in a future update!`);
        }
        
        if ((category === "video" || category === "audio") && userTier !== "pro") {
          throw new Error("Video & Audio conversion is a Pro feature. Please upgrade to continue.");
        }

        if (category === "image" && (resizeWidth > 0 || resizeHeight > 0)) {
          setStatus("processing");
          const targetW = resizeWidth || 800; // default if one is missing
          const targetH = resizeHeight || 800;
          const blob = await resizeImage(file, targetW, targetH, quality / 100);
          
          // If they also wanted to change format, we'd need another step, 
          // but for now, resizing keeps the original format or we can just upload the resized blob.
          const url = URL.createObjectURL(blob);
          newResults.push({
            downloadUrl: url,
            format: getExtension(file.name),
            originalSizeFormatted: (file.size / (1024 * 1024)).toFixed(2) + " MB",
            convertedSizeFormatted: (blob.size / (1024 * 1024)).toFixed(2) + " MB",
          });

          if (userId) {
            logConversion({
              userId,
              fileName: file.name,
              fromFormat: getExtension(file.name),
              toFormat: outputFormat,
            });
          }
        } else if (category === "video" || category === "audio") {
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

          if (userId) {
            logConversion({
              userId,
              fileName: file.name,
              fromFormat: getExtension(file.name),
              toFormat: outputFormat,
            });
          }
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

          if (userId) {
            logConversion({
              userId,
              fileName: file.name,
              fromFormat: getExtension(file.name),
              toFormat: data.format,
            });
          }
        }
      }

      setResults(newResults);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const handleResize = async (width: number, height: number) => {
    if (files.length === 0) return;
    setStatus("processing");
    try {
      const newResults: ConversionResult[] = [];
      for (const file of files) {
        const blob = await resizeImage(file, width, height, quality / 100);
        const url = URL.createObjectURL(blob);
        newResults.push({
          downloadUrl: url,
          format: getExtension(file.name),
          originalSizeFormatted: (file.size / (1024 * 1024)).toFixed(2) + " MB",
          convertedSizeFormatted: (blob.size / (1024 * 1024)).toFixed(2) + " MB",
        });
      }
      setResults(newResults);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Resize failed");
    }
  };

  const handlePDF = async (op: "merge" | "split" | "compress") => {
    if (files.length === 0) return;
    setStatus("processing");
    try {
      const newResults: ConversionResult[] = [];
      if (op === "merge") {
        const blob = await mergePDFs(files);
        newResults.push({
          downloadUrl: URL.createObjectURL(blob),
          format: "pdf",
          originalSizeFormatted: "N/A",
          convertedSizeFormatted: (blob.size / (1024 * 1024)).toFixed(2) + " MB",
        });
      } else if (op === "split") {
        for (const file of files) {
          const blobs = await splitPDF(file);
          blobs.forEach((blob, idx) => {
            newResults.push({
              downloadUrl: URL.createObjectURL(blob),
              format: "pdf",
              originalSizeFormatted: "N/A",
              convertedSizeFormatted: (blob.size / (1024 * 1024)).toFixed(2) + " MB",
            });
          });
        }
      } else if (op === "compress") {
        for (const file of files) {
          const blob = await compressPDF(file);
          newResults.push({
            downloadUrl: URL.createObjectURL(blob),
            format: "pdf",
            originalSizeFormatted: (file.size / (1024 * 1024)).toFixed(2) + " MB",
            convertedSizeFormatted: (blob.size / (1024 * 1024)).toFixed(2) + " MB",
          });
        }
      }
      setResults(newResults);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "PDF operation failed");
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
    <Card className="w-full max-w-2xl mx-auto shadow-2xl border-none bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
      <CardHeader className="text-center pb-4 pt-10 px-6">
        <CardTitle className="text-3xl md:text-4xl font-black flex items-center justify-center gap-3 tracking-tighter">
          <div className="bg-primary size-10 md:size-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Zap className="size-6 md:size-7 fill-current" />
          </div>
          File Converter
        </CardTitle>
        <CardDescription className="text-base md:text-lg text-slate-500 dark:text-slate-400 mt-2">
          Convert and compress images instantly. More formats coming soon.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 p-6 md:p-10">
        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); resetAll(); }}>
          <TabsList className="grid w-full grid-cols-3 h-12 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <TabsTrigger value="convert" className="rounded-lg font-bold text-xs sm:text-sm">Convert</TabsTrigger>
            <TabsTrigger value="compress" className="rounded-lg font-bold text-xs sm:text-sm">Compress</TabsTrigger>
            <TabsTrigger value="pdf" className="rounded-lg font-bold text-xs sm:text-sm">PDF Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="convert" className="space-y-8 pt-6 outline-none">
            <FileDropzone
              onFileSelect={(f) => { 
                setFiles(prev => [...prev, f]); 
                setOutputFormat(""); 
                setStatus("idle"); 
                setResults([]); 
              }}
              currentFile={files[0] || null}
              onClear={resetAll}
              multiple={true}
            />

            {files.length > 0 && results.length === 0 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Selected Files ({files.length})</h4>
                  <Button variant="ghost" size="sm" onClick={() => setFiles([])} className="h-8 text-xs font-bold text-destructive hover:bg-destructive/10 rounded-lg">
                    Clear All
                  </Button>
                </div>
                <div className="max-h-56 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-sm border border-slate-100 dark:border-slate-800/50">
                      <span className="truncate flex-1 mr-4 font-medium">{f.name}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="size-8 text-slate-400 hover:text-destructive hover:bg-destructive/10 rounded-lg"
                        onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full border-dashed border-2 border-slate-200 dark:border-slate-800 rounded-xl h-14 font-bold text-slate-500 hover:border-primary/50 hover:text-primary transition-all"
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
                    <Plus className="mr-2 size-5" /> Add More Files
                  </Button>
                </div>
              </div>
            )}

            {files.length > 0 && results.length === 0 && (
              <div className="space-y-8 pt-2">
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">Quick Actions</label>
                  <div className="flex flex-wrap gap-2">
                    {getPresets(files[0]).map((preset, i) => (
                      <Button 
                        key={i} 
                        variant="outline" 
                        size="sm" 
                        className="text-xs h-10 bg-background border-slate-200 dark:border-slate-800 hover:border-primary hover:bg-primary/5 transition-all active:scale-95 px-5 rounded-full font-bold"
                        onClick={() => {
                          if ('format' in preset) setOutputFormat(preset.format as string);
                          if ('action' in preset) (preset as any).action();
                        }}
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <FormatSelector
                  inputExtension={inputExt}
                  value={outputFormat}
                  onChange={setOutputFormat}
                />

                {!isInputCategoryEnabled && inputCategory && (
                  <p className="text-sm text-muted-foreground">
                    {inputCategory.charAt(0).toUpperCase() + inputCategory.slice(1)} conversion is not available yet.
                  </p>
                )}

                {outputFormat && (
                  <CompressionSlider value={quality} onChange={setQuality} />
                )}

                {files.length > 0 && getCategoryFromExtension(getExtension(files[0].name)) === "image" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Width (px)</label>
                      <Input 
                        type="number" 
                        placeholder="Width" 
                        value={resizeWidth || ""} 
                        onChange={(e) => setResizeWidth(parseInt(e.target.value))} 
                        className="h-12 text-base rounded-xl border-slate-200 dark:border-slate-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Height (px)</label>
                      <Input 
                        type="number" 
                        placeholder="Height" 
                        value={resizeHeight || ""} 
                        onChange={(e) => setResizeHeight(parseInt(e.target.value))} 
                        className="h-12 text-base rounded-xl border-slate-200 dark:border-slate-800"
                      />
                    </div>
                  </div>
                )}

                <ConversionProgress status={status} errorMessage={errorMessage} />

                {outputFormat && isInputCategoryEnabled && status !== "uploading" && status !== "processing" && (
                  <Button
                    onClick={handleConvert}
                    size="lg"
                    className="w-full font-black text-lg h-16 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
                  >
                    Convert to {outputFormat.toUpperCase()}
                    <ArrowRight className="ml-2 size-6" />
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="compress" className="space-y-8 pt-6 outline-none">
            <FileDropzone
              onFileSelect={(f) => { setFiles(prev => [...prev, f]); setStatus("idle"); setResults([]); }}
              currentFile={files[0] || null}
              onClear={resetAll}
            />

            {files.length > 0 && results.length === 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Selected Files ({files.length})</h4>
                  <Button variant="ghost" size="sm" onClick={() => setFiles([])} className="h-8 text-xs font-bold text-destructive rounded-lg">
                    Clear All
                  </Button>
                </div>
                <div className="max-h-56 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-sm border border-slate-100 dark:border-slate-800/50">
                      <span className="truncate flex-1 mr-4 font-medium">{f.name}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="size-8 text-slate-400 rounded-lg"
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
              <div className="space-y-8">
                <CompressionSlider value={quality} onChange={setQuality} />

                <ConversionProgress status={status} errorMessage={errorMessage} />

                {status !== "uploading" && status !== "processing" && (
                  <Button
                    onClick={handleCompress}
                    size="lg"
                    className="w-full font-black text-lg h-16 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
                  >
                    Compress at {quality}% Quality
                    <RefreshCw className="ml-2 size-6" />
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pdf" className="space-y-8 pt-6 outline-none">
            <FileDropzone
              onFileSelect={(f) => { setFiles(prev => [...prev, f]); setStatus("idle"); setResults([]); }}
              accept={{ "application/pdf": [".pdf"] }}
              currentFile={files[0] || null}
              onClear={resetAll}
              multiple={true}
            />

            {files.length > 0 && results.length === 0 && (
              <div className="space-y-8">
                <div className="grid grid-cols-3 gap-3">
                  <Button 
                    variant={pdfOp === "merge" ? "default" : "outline"}
                    onClick={() => setPdfOp("merge")}
                    className="h-12 font-bold rounded-xl text-xs sm:text-sm"
                  >
                    Merge
                  </Button>
                  <Button 
                    variant={pdfOp === "split" ? "default" : "outline"}
                    onClick={() => setPdfOp("split")}
                    className="h-12 font-bold rounded-xl text-xs sm:text-sm"
                  >
                    Split
                  </Button>
                  <Button 
                    variant={pdfOp === "compress" ? "default" : "outline"}
                    onClick={() => setPdfOp("compress")}
                    className="h-12 font-bold rounded-xl text-xs sm:text-sm"
                  >
                    Compress
                  </Button>
                </div>

                <ConversionProgress status={status} errorMessage={errorMessage} />

                {status !== "uploading" && status !== "processing" && (
                  <Button
                    onClick={() => handlePDF(pdfOp)}
                    size="lg"
                    className="w-full font-black text-lg h-16 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
                  >
                    Run {pdfOp.charAt(0).toUpperCase() + pdfOp.slice(1)}
                    <ArrowRight className="ml-2 size-6" />
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {results.length > 0 && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <Separator className="bg-slate-100 dark:bg-slate-800" />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <h3 className="font-black text-xl text-slate-900 dark:text-white tracking-tight">Results ({results.length})</h3>
              <Button 
                variant={userTier === "pro" ? "default" : "secondary"}
                size="lg"
                className="font-bold rounded-xl w-full sm:w-auto h-12 shadow-lg"
                onClick={userTier === "pro" ? handleDownloadAll : () => window.location.href = "/pricing"}
                disabled={isZipping}
              >
                {isZipping ? (
                  <Loader2 className="mr-2 size-5 animate-spin" />
                ) : (
                  <FileArchive className="mr-2 size-5" />
                )}
                Download All (.zip)
                {userTier !== "pro" && <Zap className="ml-2 size-4 text-amber-500 fill-amber-500" />}
              </Button>
            </div>
            
            <div className="grid gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
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
            
            <Button variant="outline" onClick={resetAll} className="w-full h-14 text-lg font-bold rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
              Convert More Files
            </Button>
          </div>
        )}
        <AdBanner userTier={userTier} className="mt-12 rounded-2xl overflow-hidden shadow-sm" />
      </CardContent>
    </Card>

  );
}
