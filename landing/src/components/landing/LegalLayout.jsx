import React, { useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import Header from "./Header/Header";
import Footer from "./Footer";
import AmbientBackdrop from "./AmbientBackdrop";
import { TooltipProvider } from "@/components/ui/tooltip";

function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("theme") || "light";
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  return [theme, setTheme];
}

function useLang() {
  const [lang, setLang] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("lang");
      if (stored === "bn" || stored === "en") return stored;
    }
    return "bn";
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dataset.locale = lang;
    localStorage.setItem("lang", lang);
  }, [lang]);

  return [lang, setLang];
}

export default function LegalLayout({ children }) {
  const [lang, setLang] = useLang();
  const [theme, setTheme] = useTheme();

  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider delayDuration={400}>
        <div className="min-h-screen bg-background text-foreground tracking-tight selection:bg-primary/20">
          <AmbientBackdrop />
          <Header lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />

          <main className="relative pt-32 pb-24">
            <div className="container mx-auto px-6 max-w-4xl">
              {typeof children === 'function' ? children({ lang, theme }) : children}
            </div>
          </main>

          <Footer lang={lang} />
        </div>
      </TooltipProvider>
    </MotionConfig>
  );
}
