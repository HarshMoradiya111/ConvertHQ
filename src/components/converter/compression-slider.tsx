"use client";

import { Slider } from "@/components/ui/slider";

interface CompressionSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function CompressionSlider({ value, onChange }: CompressionSliderProps) {
  const getQualityLabel = (q: number) => {
    if (q >= 80) return "High Quality";
    if (q >= 50) return "Balanced";
    if (q >= 20) return "Compressed";
    return "Maximum Compression";
  };

  const getQualityColor = (q: number) => {
    if (q >= 80) return "text-green-600";
    if (q >= 50) return "text-yellow-600";
    if (q >= 20) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">Quality</label>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold ${getQualityColor(value)}`}>
            {value}%
          </span>
          <span className="text-xs text-muted-foreground">
            — {getQualityLabel(value)}
          </span>
        </div>
      </div>
      <Slider
        value={[value]}
        onValueChange={(val) => onChange(Array.isArray(val) ? val[0] : val)}
        min={1}
        max={100}
        step={1}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Smallest file</span>
        <span>Best quality</span>
      </div>
    </div>
  );
}
