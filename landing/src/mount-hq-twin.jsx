import React from "react";
import { createRoot } from "react-dom/client";
import { HqDigitalTwin } from "./components/landing/HqDigitalTwin";
import "./index.css";

const rootElement = document.getElementById("hq-twin-root");
if (rootElement) {
  const lang = document.documentElement.lang || "bn";
  createRoot(rootElement).render(<HqDigitalTwin lang={lang} />);
}
