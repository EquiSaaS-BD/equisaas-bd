import React from "react";
import { createRoot } from "react-dom/client";
import Footer from "@/components/landing/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";

// Ensures the footer reacts to language toggle on static pages
function StaticFooterWrapper() {
  const [lang, setLang] = React.useState(() => {
    return document.documentElement.lang === "en" ? "en" : "bn";
  });

  React.useEffect(() => {
    // Listen for language changes from static-page-shell.js
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "lang") {
          setLang(document.documentElement.lang === "en" ? "en" : "bn");
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return (
    <TooltipProvider delayDuration={400}>
      <Footer lang={lang} />
    </TooltipProvider>
  );
}

const mountPoint = document.getElementById("footer-root");
if (mountPoint) {
  createRoot(mountPoint).render(<StaticFooterWrapper />);
}
