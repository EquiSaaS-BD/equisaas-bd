import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import BdErpPosManual from "./pages/BdErpPosManual.jsx";

function ManualShell() {
  const [lang, setLang] = React.useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("lang") === "en" ? "en" : "bn";
    }
    return "bn";
  });

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

  return <BdErpPosManual lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />;
}

createRoot(document.getElementById("root")).render(<ManualShell />);
