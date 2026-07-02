import React from "react";
import { createRoot } from "react-dom/client";
import { SmeLiveDemo } from "./components/landing/SmeLiveDemo";
import "./index.css";

const rootElement = document.getElementById("sme-demo-root");
if (rootElement) {
  const lang = document.documentElement.lang || "bn";
  createRoot(rootElement).render(<SmeLiveDemo lang={lang} />);
}
