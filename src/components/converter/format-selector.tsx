"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { getOutputFormats, type FormatInfo } from "@/lib/format-map";

interface FormatSelectorProps {
  inputExtension: string;
  value: string;
  onChange: (format: string) => void;
}

export function FormatSelector({ inputExtension, value, onChange }: FormatSelectorProps) {
  const formats = getOutputFormats(inputExtension);
  const hasFormats = formats.length > 0;
  const isCustom = value && !formats.find(f => f.extension === value);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Convert to</label>
        <Select
          disabled={!hasFormats}
          value={isCustom ? "custom" : value}
          onValueChange={(val: string | null) => {
          if (val === "custom") {
            onChange("");
          } else if (val) {
            onChange(val);
          }
        }}>
          <SelectTrigger className="w-full h-12 text-base">
            <SelectValue placeholder="Select output format" />
          </SelectTrigger>
          <SelectContent>
            {formats.map((format: FormatInfo) => (
              <SelectItem key={format.extension} value={format.extension}>
                <span className="font-semibold">{format.label}</span>
                <span className="ml-2 text-muted-foreground text-xs">.{format.extension}</span>
              </SelectItem>
            ))}
            <SelectItem value="custom">
              <span className="font-semibold">Custom Format</span>
              <span className="ml-2 text-muted-foreground text-xs">Type manually</span>
            </SelectItem>
          </SelectContent>
        </Select>
        {!hasFormats && inputExtension && (
          <p className="text-sm text-muted-foreground">
            Conversion for .{inputExtension} files is not available yet.
          </p>
        )}
      </div>

      {hasFormats && (isCustom || value === "") && (
        <div className="space-y-2 animate-in slide-in-from-top-1 duration-200">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Target Extension</label>
          <Input 
            placeholder="e.g., txt, docx, webp"
            value={value === "custom" ? "" : value}
            onChange={(e) => onChange(e.target.value.toLowerCase().replace(".", ""))}
            className="h-10"
          />
        </div>
      )}
    </div>
  );
}
