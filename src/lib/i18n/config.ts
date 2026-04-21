export type Locale = "en" | "hi" | "es" | "fr";

export const locales: Locale[] = ["en", "hi", "es", "fr"];

export const localeNames: Record<Locale, string> = {
  en: "English",
  hi: "हिन्दी",
  es: "Español",
  fr: "Français",
};

export const defaultLocale: Locale = "en";
