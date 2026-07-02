import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, MousePointerClick, Info } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

// Expose a global function to start a tour from Chatbot or anywhere else
export const startGuidedTour = (steps) => {
  sessionStorage.setItem("equisaas_active_tour", JSON.stringify(steps));
  sessionStorage.setItem("equisaas_tour_index", "0");
  window.dispatchEvent(new Event("equisaas-tour-update"));
};

export function GuidedTourManager({ lang = "bn", theme = "light" }) {
  const [activeTour, setActiveTour] = useState(null);
  const [tourIndex, setTourIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const [highlightVisible, setHighlightVisible] = useState(true);

  const checkTourState = () => {
    const savedTour = sessionStorage.getItem("equisaas_active_tour");
    const savedIndex = sessionStorage.getItem("equisaas_tour_index");
    
    if (savedTour) {
      try {
        const parsed = JSON.parse(savedTour);
        if (parsed && parsed.length > 0) {
          setActiveTour(parsed);
          setTourIndex(parseInt(savedIndex || "0", 10));
          setHighlightVisible(true);
        } else {
          endTour();
        }
      } catch (e) {
        endTour();
      }
    } else {
      setActiveTour(null);
    }
  };

  useEffect(() => {
    checkTourState();
    window.addEventListener("equisaas-tour-update", checkTourState);
    return () => window.removeEventListener("equisaas-tour-update", checkTourState);
  }, []);

  const endTour = () => {
    sessionStorage.removeItem("equisaas_active_tour");
    sessionStorage.removeItem("equisaas_tour_index");
    setActiveTour(null);
    setTargetRect(null);
  };

  const nextStep = () => {
    if (!activeTour) return;
    if (tourIndex + 1 < activeTour.length) {
      const nextIdx = tourIndex + 1;
      sessionStorage.setItem("equisaas_tour_index", nextIdx.toString());
      setTourIndex(nextIdx);
      setHighlightVisible(true);
      setTargetRect(null); // Reset before calculating next
      
      const step = activeTour[nextIdx];
      // If next step is on a different page, navigate there
      if (window.location.pathname !== step.path) {
        window.location.href = step.path;
      }
    } else {
      endTour();
    }
  };

  // When tour state changes, execute step
  useEffect(() => {
    if (!activeTour) return;

    const step = activeTour[tourIndex];
    if (!step) {
      endTour();
      return;
    }

    // Check if we need to navigate
    if (window.location.pathname !== step.path) {
      // Don't navigate immediately if we just started tracking - give React a cycle
      const navTimeout = setTimeout(() => {
        window.location.href = step.path;
      }, 100);
      return () => clearTimeout(navTimeout);
    }

    // We are on the right page, let's find the element
    let attempts = 0;
    const findElement = () => {
      const el = document.querySelector(step.selector);
      if (el) {
        // Scroll into view smoothly with offset
        const y = el.getBoundingClientRect().top + window.scrollY - 150;
        window.scrollTo({ top: y, behavior: 'smooth' });

        // Calculate rect for highlight overlay after scrolling finishes
        setTimeout(() => {
          const rect = el.getBoundingClientRect();
          setTargetRect({
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height,
          });
        }, 600); // wait for scroll to likely finish
      } else if (attempts < 10) {
        attempts++;
        setTimeout(findElement, 300); // retry for lazy loaded elements
      } else {
        // Element not found, just show popup anyway
        console.warn(`Tour Target not found: ${step.selector}`);
      }
    };

    const initialTimeout = setTimeout(findElement, 500);
    
    // Recalculate on window resize
    const handleResize = () => {
      if (highlightVisible) {
        const el = document.querySelector(step.selector);
        if (el) {
          const rect = el.getBoundingClientRect();
          setTargetRect({
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height,
          });
        }
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(initialTimeout);
      window.removeEventListener("resize", handleResize);
    };
  }, [activeTour, tourIndex, highlightVisible]);

  if (!activeTour) return null;

  const currentStep = activeTour[tourIndex];
  const isLastStep = tourIndex === activeTour.length - 1;
  const isDark = theme === "dark";

  return (
    <>
      {/* 1. The Highlight Overlay */}
      <AnimatePresence>
        {targetRect && highlightVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute z-[9998] pointer-events-auto cursor-pointer"
            style={{
              top: targetRect.top - 12,
              left: targetRect.left - 12,
              width: targetRect.width + 24,
              height: targetRect.height + 24,
            }}
            onClick={() => setHighlightVisible(false)} // User clicks highlight to dismiss it
          >
            {/* Pulsing glow ring */}
            <div className="absolute inset-0 rounded-[1.5rem] border-4 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.6)] animate-pulse" />
            <div className="absolute inset-0 rounded-[1.5rem] bg-amber-500/10 backdrop-blur-[1px]" />
            
            {/* Floating indicator */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute -top-10 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg whitespace-nowrap"
            >
              <MousePointerClick className="w-4 h-4" />
              {lang === "bn" ? "এখানে দেখুন (ক্লিক করে সরান)" : "Look Here (Click to dismiss)"}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. The Bottom-Left Navigation Panel */}
      <div className="fixed bottom-6 left-6 z-[9999]">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, x: -50, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -50, y: 20 }}
            className={cn(
              "w-80 rounded-[1.5rem] border shadow-2xl p-5 glass-premium flex flex-col gap-4",
              isDark ? "bg-zinc-900/90 border-amber-500/30" : "bg-white/90 border-amber-500/30"
            )}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 text-amber-500 font-bold">
                <Info className="w-5 h-5" />
                <span className="text-xs tracking-wider uppercase">
                  {lang === "bn" ? `গাইড: ধাপ ${tourIndex + 1}/${activeTour.length}` : `Tour: Step ${tourIndex + 1}/${activeTour.length}`}
                </span>
              </div>
              <button 
                onClick={endTour}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close tour"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black leading-tight text-foreground">
                {currentStep.title}
              </h3>
              {currentStep.desc && (
                <p className="text-sm text-muted-foreground">
                  {currentStep.desc}
                </p>
              )}
            </div>

            <div className="flex justify-between items-center mt-2 pt-4 border-t border-border/50">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={endTour}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                {lang === "bn" ? "স্কিপ করুন" : "Skip Tour"}
              </Button>
              
              {!isLastStep ? (
                <Button 
                  size="sm" 
                  onClick={nextStep}
                  className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-lg shadow-amber-500/20 text-xs font-bold px-4"
                >
                  {lang === "bn" ? "পরবর্তী ধাপে যান" : "Next Step"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  size="sm" 
                  onClick={endTour}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/20 text-xs font-bold px-4"
                >
                  {lang === "bn" ? "গাইড শেষ করুন" : "Finish Tour"}
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
