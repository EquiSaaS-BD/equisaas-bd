import React, { Suspense, lazy, useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";

import AmbientBackdrop from "@/components/landing/AmbientBackdrop";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero/Hero";
import Header from "@/components/landing/Header/Header";
import LandingUpdateAvailableBanner from "@/components/landing/LandingUpdateAvailableBanner";
import MobileBottomNav from "@/components/landing/MobileBottomNav";
import Chatbot from "@/components/chatbot/Chatbot";
import CommandPalette from "@/components/landing/CommandPalette";
import { AnimatedBlock } from "@/components/ui/animated-block";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipProvider } from "@/components/ui/tooltip";

const FounderMessage = lazy(() => import("@/components/landing/FounderMessage"));
const LandingExperienceConsole = lazy(() => import("@/components/landing/LandingExperienceConsole"));
const ProofOfWork = lazy(() => import("@/components/landing/ProofOfWork"));
const OurMasterplan = lazy(() => import("@/components/landing/OurMasterplan"));
const DirectoryLinksBlock = lazy(() => import("@/components/landing/DirectoryLinksBlock"));
const QuickStartPlaybook = lazy(() => import("@/components/landing/QuickStartPlaybook"));
const SMESolutions = lazy(() => import("@/components/landing/SMESolutions"));
const FAQ = lazy(() => import("@/components/landing/FAQ"));
const EcosystemPartners = lazy(() => import("@/components/landing/EcosystemPartners"));
const AchievementsAndPartnerships = lazy(() => import("@/components/landing/AchievementsAndPartnerships"));
const SMECalculator = lazy(() => import("@/components/landing/SMECalculator"));



function DeferredSectionsFallback() {
  return (
    <div className="container mx-auto px-6 py-16" aria-busy="true" aria-label="Loading sections">
      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <Skeleton key={item} className="h-48 rounded-3xl border border-border/50" />
        ))}
      </div>
    </div>
  );
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

import { usePredictivePrefetch } from "@/hooks/usePredictivePrefetch";

export default function AppView() {
  const [lang, setLang] = useLang();
  const [theme, setTheme] = useTheme();
  const skipLabel = lang === "bn" ? "মূল কনটেন্টে যান" : "Skip to main content";

  usePredictivePrefetch();

  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider delayDuration={400}>
        <div className="min-h-screen bg-background text-foreground tracking-tight">
          <a href="#main-content" className="skip-link">
            {skipLabel}
          </a>

          <AmbientBackdrop />
          <Header lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />

          <main id="main-content" tabIndex={-1}>
            <AnimatedBlock direction="down" distance={32} delay={0.05}>
              <Hero lang={lang} />
            </AnimatedBlock>

            <Suspense fallback={<DeferredSectionsFallback />}>
              <AnimatedBlock direction="up" distance={24} delay={0.1}>
                <LandingExperienceConsole lang={lang} />
              </AnimatedBlock>
              <AnimatedBlock direction="left" distance={24} delay={0.18}>
                <FounderMessage lang={lang} />
              </AnimatedBlock>
              <QuickStartPlaybook lang={lang} />
              <DirectoryLinksBlock lang={lang} />
              <AnimatedBlock direction="up">
                <ProofOfWork lang={lang} />
              </AnimatedBlock>
              <AnimatedBlock direction="up">
                <OurMasterplan lang={lang} />
              </AnimatedBlock>

              <AnimatedBlock direction="up">
                <SMESolutions lang={lang} />
              </AnimatedBlock>
              <AnimatedBlock direction="up">
                <SMECalculator lang={lang} />
              </AnimatedBlock>
              <AnimatedBlock direction="up">
                <AchievementsAndPartnerships lang={lang} />
              </AnimatedBlock>
              <AnimatedBlock direction="up">
                <FAQ lang={lang} />
              </AnimatedBlock>
              <AnimatedBlock direction="up" distance={32} delay={0.1}>
                <EcosystemPartners lang={lang} />
              </AnimatedBlock>
            </Suspense>
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
