"use client"

import * as React from "react"
import { Languages } from "lucide-react"
import { useTranslation } from "@/lib/i18n/language-context"
import { locales, localeNames, Locale } from "@/lib/i18n/config"
import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

export function LanguageSelector() {
  const { locale, setLocale } = useTranslation()

  return (
    <div className="flex items-center gap-2">
      <Select value={locale} onValueChange={(v) => setLocale(v as Locale)}>
        <SelectTrigger className="h-9 w-[110px] bg-transparent border-none hover:bg-muted transition-colors focus:ring-0">
          <Languages className="size-4 mr-2 text-muted-foreground" />
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent align="end">
          {locales.map((loc) => (
            <SelectItem key={loc} value={loc} className="text-xs">
              {localeNames[loc]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
