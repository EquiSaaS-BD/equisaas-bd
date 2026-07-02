"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);
const PRIMARY_STORAGE_KEY = "equisaas-lms-theme";
const GLOBAL_STORAGE_KEY = "theme";

function persistTheme(theme) {
  const safeTheme = theme === "dark" ? "dark" : "light";
  window.localStorage.setItem(PRIMARY_STORAGE_KEY, safeTheme);
  window.localStorage.setItem(GLOBAL_STORAGE_KEY, safeTheme);
  return safeTheme;
}

function resolveTheme() {
  if (typeof window === "undefined") return "light";

  const primaryStored = window.localStorage.getItem(PRIMARY_STORAGE_KEY);
  if (primaryStored === "light" || primaryStored === "dark") return primaryStored;

  const globalStored = window.localStorage.getItem(GLOBAL_STORAGE_KEY);
  if (globalStored === "light" || globalStored === "dark") return globalStored;

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.dataset.theme = theme;
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(resolveTheme);

  useEffect(() => {
    const nextTheme = resolveTheme();
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }, []);

  useEffect(() => {
    applyTheme(theme);
    persistTheme(theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme: (nextTheme) => setTheme(nextTheme === "dark" ? "dark" : "light"),
      toggleTheme: () => setTheme((current) => (current === "dark" ? "light" : "dark")),
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
