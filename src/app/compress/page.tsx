import { ConverterTool } from "@/components/converter/converter-tool";

export default function CompressPage() {
  return (
    <div className="flex-1 container mx-auto px-4 py-12 md:py-20 flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl space-y-8 text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Image <span className="text-primary italic">Compressor</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Reduce file size without losing quality. Optimized for WebP, PNG, and JPEG.
        </p>
      </div>

      <ConverterTool defaultTab="compress" />
    </div>
  );
}
