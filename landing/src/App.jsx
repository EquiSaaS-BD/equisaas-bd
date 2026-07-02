import React, { Suspense, lazy, useEffect, useState, Component } from "react";
import { motion, MotionConfig } from "framer-motion";

// Import new SCSS design system
import "@/styles/globals.scss";

// Import new components
import Header from "@/components/landing/Header/Header";
import Hero from "@/components/landing/Hero/Hero";
import FinalCTA from "@/components/landing/FinalCTA/FinalCTA";
import OrganizationSchema from "@/components/landing/OrganizationSchema";

// Keep existing components for now
import Footer from "@/components/landing/Footer";
import AmbientBackdrop from "@/components/landing/AmbientBackdrop";
import GlobalParticleEngine from "@/components/landing/GlobalParticleEngine";
import UpdateAvailableBanner from "@/components/landing/UpdateAvailableBanner";
import MobileBottomNav from "@/components/landing/MobileBottomNav";
import Chatbot from "@/components/chatbot/Chatbot";
import PwaInstallPrompt from "@/components/landing/PwaInstallPrompt";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipProvider } from "@/components/ui/tooltip";
import { normalizeLocalizedText } from "@/lib/localized-copy";

// Lazy load all sections - HowItWorks removed (file does not exist)
const IntentPaths = lazy(() => import("@/components/landing/IntentPaths"));
const FounderMessage = lazy(() => import("@/components/landing/FounderMessage"));
const MissionEconomicsSimulator = lazy(() => import("@/components/landing/MissionEconomicsSimulator"));
const DepartmentsExplorer = lazy(() => import("@/components/landing/DepartmentsExplorer"));
const DepartmentLearningAtlas = lazy(() => import("@/components/landing/DepartmentLearningAtlas"));
const Leadership = lazy(() => import("@/components/landing/Leadership"));
const QuickStartPlaybook = lazy(() => import("@/components/landing/QuickStartPlaybook"));
const OurMasterplan = lazy(() => import("@/components/landing/OurMasterplan"));
const ProofOfWork = lazy(() => import("@/components/landing/ProofOfWork"));
const DepartmentQuiz = lazy(() => import("@/components/landing/DepartmentQuiz"));
const SMESolutions = lazy(() => import("@/components/landing/SMESolutions"));
const FAQ = lazy(() => import("@/components/landing/FAQ"));
const EcosystemPartners = lazy(() => import("@/components/landing/EcosystemPartners"));
const AchievementsAndPartnerships = lazy(() => import("@/components/landing/AchievementsAndPartnerships"));

// ErrorBoundary: catches any chunk-level errors in lazy-loaded sections
class SectionErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error("[SectionErrorBoundary]", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto px-6 py-8 text-center text-muted-foreground text-sm">
          Section failed to load. Please refresh.
        </div>
      );
    }
    return this.props.children;
  }
}


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

// ── AnimatedBlock: scroll-reveal wrapper using Framer Motion ──
function AnimatedBlock({ children, direction = "up", distance = 28, delay = 0 }) {
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? distance : direction === "down" ? -distance : 0,
      x: direction === "left" ? distance : direction === "right" ? -distance : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 1,
        delay,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={variants}
    >
      {children}
    </motion.div>
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

export default function App() {
  const [lang, setLang] = useLang();
  const [theme, setTheme] = useTheme();

  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider delayDuration={400}>
        <div className="relative flex min-h-[100svh] flex-col bg-background text-foreground tracking-tight overflow-x-hidden selection:bg-primary/20 selection:text-primary">
          <OrganizationSchema />
          <GlobalParticleEngine />
          <a href="#main-content" className="skip-link">
            {lang === "bn" ? normalizeLocalizedText("মূল কনটেন্টে যান") : "Skip to main content"}
          </a>
          <AmbientBackdrop />
          <Header lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />
          <main id="main-content" tabIndex={-1}>
            <AnimatedBlock direction="down" distance={40} delay={0.1}>
              <Hero lang={lang} />
            </AnimatedBlock>
            <SectionErrorBoundary>
              <Suspense fallback={<DeferredSectionsFallback />}>
                <AnimatedBlock direction="up" distance={30} delay={0.1}>
                  <IntentPaths lang={lang} />
                </AnimatedBlock>
                <AnimatedBlock direction="up" distance={30}>
                  <SMESolutions lang={lang} />
                </AnimatedBlock>
                <AnimatedBlock direction="up" distance={30}>
                  <QuickStartPlaybook lang={lang} />
                </AnimatedBlock>
                <AnimatedBlock direction="up" distance={30}>
                  <DepartmentsExplorer lang={lang} />
                </AnimatedBlock>
                <AnimatedBlock direction="up" distance={30}>
                  <DepartmentQuiz lang={lang} />
                </AnimatedBlock>
                <AnimatedBlock direction="up" distance={30}>
                  <DepartmentLearningAtlas lang={lang} />
                </AnimatedBlock>
                <AnimatedBlock direction="left" distance={30}>
                  <FounderMessage lang={lang} />
                </AnimatedBlock>
                <AnimatedBlock direction="up">
                  <EcosystemPartners lang={lang} />
                </AnimatedBlock>
                <AnimatedBlock direction="up">
                  <ProofOfWork lang={lang} />
                </AnimatedBlock>
                <AnimatedBlock direction="up">
                  <AchievementsAndPartnerships lang={lang} />
                </AnimatedBlock>
                <AnimatedBlock direction="up">
                  <OurMasterplan lang={lang} />
                </AnimatedBlock>
                <AnimatedBlock direction="up">
                  <Leadership lang={lang} />
                </AnimatedBlock>
                <AnimatedBlock direction="up">
                  <MissionEconomicsSimulator lang={lang} />
                </AnimatedBlock>
                <AnimatedBlock direction="up">
                  <FAQ lang={lang} />
                </AnimatedBlock>
              </Suspense>
            </SectionErrorBoundary>
            <FinalCTA lang={lang} />

          </main>
          <Footer lang={lang} />
          <UpdateAvailableBanner lang={lang} />
          <MobileBottomNav lang={lang} />
          <Chatbot lang={lang} />
          <PwaInstallPrompt lang={lang} />
        </div>
      </TooltipProvider>
    </MotionConfig>
  );
}
