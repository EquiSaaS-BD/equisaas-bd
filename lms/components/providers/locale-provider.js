"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const LocaleContext = createContext(null);

const PRIMARY_STORAGE_KEY = "equisaas-lms-locale";
const GLOBAL_STORAGE_KEY = "lang";
const DEFAULT_LOCALE = "bn";
const MOJIBAKE_PATTERN = /(ÃƒÆ’Ã†â€™.|ÃƒÆ’Ã¢â‚¬Å¡.|ÃƒÆ’Ã‚Â Ãƒâ€šÃ‚Â¦|ÃƒÆ’Ã‚Â Ãƒâ€šÃ‚Â§|ÃƒÆ’Ã‚Â Ãƒâ€šÃ‚Â¥|ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬|ÃƒÂ¯Ã‚Â¿Ã‚Â½|ÃƒÂ Ã‚Â¦|ÃƒÂ Ã‚Â§|ÃƒÂ Ã‚Â¥|ÃƒÂ¢Ã¢â€šÂ¬)/;
const REPLACEMENT_CHAR_PATTERN = /\uFFFD/;
const CONTROL_CHAR_PATTERN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/;

function looksCorruptedLocalizedText(text) {
  return typeof text === "string" && (
    MOJIBAKE_PATTERN.test(text) ||
    REPLACEMENT_CHAR_PATTERN.test(text) ||
    CONTROL_CHAR_PATTERN.test(text)
  );
}

function normalizeLocalizedText(text) {
  if (typeof text !== "string") return text;

  let nextValue = text;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    if (!looksCorruptedLocalizedText(nextValue)) {
      return nextValue;
    }

    try {
      const bytes = Uint8Array.from([...nextValue].map((char) => char.charCodeAt(0) & 0xff));
      const decoded = new TextDecoder("utf-8").decode(bytes);
      if (!decoded || decoded === nextValue) {
        return nextValue;
      }
      nextValue = decoded;
    } catch {
      return nextValue;
    }
  }

  return nextValue;
}

function formatCopy(locale, english, bangla) {
  const normalizedBangla = normalizeLocalizedText(bangla);
  if (locale !== "bn") return english;
  if (!normalizedBangla || looksCorruptedLocalizedText(normalizedBangla)) {
    return english;
  }
  return normalizedBangla;
}

function persistLocale(nextLocale) {
  const safeLocale = nextLocale === "en" ? "en" : "bn";
  window.localStorage.setItem(PRIMARY_STORAGE_KEY, safeLocale);
  window.localStorage.setItem(GLOBAL_STORAGE_KEY, safeLocale);
  return safeLocale;
}

function resolveInitialLocale() {
  if (typeof window === "undefined") return DEFAULT_LOCALE;

  const primaryStored = window.localStorage.getItem(PRIMARY_STORAGE_KEY);
  if (primaryStored === "en" || primaryStored === "bn") return primaryStored;

  const globalStored = window.localStorage.getItem(GLOBAL_STORAGE_KEY);
  if (globalStored === "en" || globalStored === "bn") return globalStored;

  if (primaryStored === "both" || globalStored === "both") {
    return persistLocale(DEFAULT_LOCALE);
  }

  return DEFAULT_LOCALE;
}

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState(resolveInitialLocale);

  useEffect(() => {
    const nextLocale = resolveInitialLocale();
    setLocale(nextLocale);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "bn" ? "bn" : "en";
    document.documentElement.dataset.locale = locale;
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale: (nextLocale) => {
        const safeLocale = persistLocale(nextLocale);
        setLocale(safeLocale);
      },
      copy: (english, bangla) => formatCopy(locale, english, bangla),
    }),
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}
