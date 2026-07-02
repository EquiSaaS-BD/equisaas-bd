import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "framer-motion";

import "./index.css";
import "@/styles/globals.scss";
import AmbientBackdrop from "@/components/landing/AmbientBackdrop";
import Header from "@/components/landing/Header/Header";
import Footer from "@/components/landing/Footer";
import MobileBottomNav from "@/components/landing/MobileBottomNav";
import DepartmentsExplorer from "@/components/landing/DepartmentsExplorer";
import LandingUpdateAvailableBanner from "@/components/landing/LandingUpdateAvailableBanner";
import ClarityTracker from "@/components/ClarityTracker";
import CommandPalette from "@/components/landing/CommandPalette";
import Chatbot from "@/components/chatbot/Chatbot";
import { TooltipProvider } from "@/components/ui/tooltip";

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

function DepartmentsAppView() {
  const [lang, setLang] = useLang();
  const [theme, setTheme] = useTheme();

  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider delayDuration={400}>
        <div className="min-h-screen bg-background text-foreground tracking-tight flex flex-col">
        <AmbientBackdrop />
        <Header lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />

        <main className="relative pt-24 overflow-hidden flex-1">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-primary/10 blur-[120px] rounded-[100%] pointer-events-none z-0" />
          <DepartmentsExplorer lang={lang} standalone={true} />
        </main>

        <Footer lang={lang} />
        <LandingUpdateAvailableBanner lang={lang} />
        <MobileBottomNav lang={lang} />
        <Chatbot lang={lang} theme={theme} />
        <CommandPalette lang={lang} theme={theme} setTheme={setTheme} />
      </div>
      </TooltipProvider>
    </MotionConfig>
  );
}

const seoFallback = document.getElementById("seo-fallback");
if (seoFallback) {
  seoFallback.remove();
}

createRoot(document.getElementById("root")).render(
  <>
    <ClarityTracker />
    <DepartmentsAppView />
  </>
);
