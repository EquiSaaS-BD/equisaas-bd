import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@/styles/globals.scss";
import ResourcesPage from "./components/pages/ResourcesPage.jsx";
import { TooltipProvider } from "@/components/ui/tooltip";
import { initReveal } from "@/lib/reveal";

function ResourcesShell() {
  const [lang, setLang] = React.useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("lang") === "en" ? "en" : "bn";
    }
    return "bn";
  });

  React.useEffect(() => {
    initReveal();
  }, []);

  const [theme, setTheme] = React.useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  React.useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dataset.locale = lang;
    localStorage.setItem("lang", lang);
  }, [lang]);

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <TooltipProvider delayDuration={400}>
      <ResourcesPage lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />
    </TooltipProvider>
  );
}

createRoot(document.getElementById("root")).render(<ResourcesShell />);

