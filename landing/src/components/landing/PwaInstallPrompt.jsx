import React, { useState, useEffect } from "react";
import { Download, RefreshCw, X } from "lucide-react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

/**
 * PwaInstallPrompt - PWA install & update notification
 * Rewritten to remove MUI dependency (was importing full @mui/material).
 * Now uses shadcn/ui + Framer Motion for consistency with the design system.
 */
export default function PwaInstallPrompt({ lang }) {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // Service Worker registration success

    },
    onRegisterError(error) {
      console.error("SW Registration Error", error);
    },
  });

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
        setShowInstall(false);
      }
    }
  };

  const isBn = lang === "bn";

  const isVisible = (showInstall || needRefresh) && !dismissed;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-[76px] sm:bottom-6 left-1/2 -translate-x-1/2 z-[110] w-[calc(100vw-2rem)] max-w-sm"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-background/95 px-4 py-3 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.3)] backdrop-blur-xl">
            <div className="flex items-center gap-3 text-sm font-semibold text-foreground">
              {needRefresh ? (
                <RefreshCw className="h-4 w-4 shrink-0 text-primary" />
              ) : (
                <Download className="h-4 w-4 shrink-0 text-primary" />
              )}
              <span>
                {needRefresh
                  ? isBn ? "নতুন আপডেট উপলব্ধ" : "New update available"
                  : isBn ? "আমাদের অ্যাপটি ইনস্টল করুন" : "Install our App"}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                className="h-8 rounded-xl text-xs"
                onClick={needRefresh ? () => updateServiceWorker(true) : handleInstallClick}
              >
                {needRefresh
                  ? isBn ? "আপডেট করুন" : "Refresh"
                  : isBn ? "ইনস্টল" : "Install"}
              </Button>
              <button
                className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors"
                onClick={() => { setDismissed(true); setNeedRefresh(false); }}
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
