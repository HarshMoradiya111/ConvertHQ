"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getOutputFormats, type FormatInfo } from "@/lib/format-map";

interface FormatSelectorProps {
  inputExtension: string;
  value: string;
  onChange: (format: string) => void;
}

export function FormatSelector({ inputExtension, value, onChange }: FormatSelectorProps) {
  const formats = getOutputFormats(inputExtension);

  if (formats.length === 0) {
    return (
      <div className="text-sm text-muted-foreground bg-muted/50 px-4 py-3 rounded-lg">
        No conversion options available for this file type.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Convert to</label>
      <Select value={value} onValueChange={(val) => val && onChange(val)}>
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
        </SelectContent>
      </Select>
    </div>
  );
}
