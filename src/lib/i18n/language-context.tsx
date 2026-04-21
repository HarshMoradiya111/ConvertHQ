"use client"

import * as React from "react"
import { Locale, defaultLocale } from "./config"
import en from "./dictionaries/en.json"
import hi from "./dictionaries/hi.json"
import es from "./dictionaries/es.json"
import fr from "./dictionaries/fr.json"

const dictionaries = { en, hi, es, fr }

type Dictionary = typeof en
type TranslationKeys = keyof Dictionary

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>(defaultLocale)

  // Initialize from cookie on mount
  React.useEffect(() => {
    const savedLocale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("NEXT_LOCALE="))
      ?.split("=")[1] as Locale

    if (savedLocale && ["en", "hi", "es", "fr"].includes(savedLocale)) {
      setLocaleState(savedLocale)
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`
  }

  const t = (path: string) => {
    const keys = path.split(".")
    let current: any = dictionaries[locale]
    
    for (const key of keys) {
      if (current[key] === undefined) return path
      current = current[key]
    }
    
    return current
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useTranslation() {
  const context = React.useContext(LanguageContext)
  if (!context) throw new Error("useTranslation must be used within LanguageProvider")
  return context
}
