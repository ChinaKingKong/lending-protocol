import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { en } from "../locales/en";
import { zh } from "../locales/zh";
import type { LocaleKey } from "../locales/en";

export type Lang = "en" | "zh";

const messages: Record<Lang, Record<string, string>> = { en, zh };

type LanguageContextValue = {
  lang: Lang;
  setLang: (next: Lang) => void;
  t: (key: LocaleKey, params?: Record<string, string | number>) => string;
  isAnimating: boolean;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function interpolate(text: string, params?: Record<string, string | number>): string {
  if (!params) return text;
  return Object.entries(params).reduce(
    (acc, [k, v]) => acc.replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), String(v)),
    text
  );
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [isAnimating, setIsAnimating] = useState(false);

  const setLang = useCallback((next: Lang) => {
    if (next === lang) return;
    setIsAnimating(true);
    setTimeout(() => {
      setLangState(next);
      setIsAnimating(false);
    }, 280);
  }, [lang]);

  const t = useCallback(
    (key: LocaleKey, params?: Record<string, string | number>): string => {
      const raw = messages[lang][key] ?? (en as Record<string, string>)[key] ?? key;
      return interpolate(raw, params);
    },
    [lang]
  );

  const value = useMemo(
    () => ({ lang, setLang, t, isAnimating }),
    [lang, setLang, t, isAnimating]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
