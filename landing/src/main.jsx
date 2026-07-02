import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppView from "./AppView.jsx";
import ClarityTracker from "./components/ClarityTracker.jsx";
import { initReveal } from "@/lib/reveal";

// Initialize reveal animations after mount
setTimeout(initReveal, 100);

const seoFallback = document.getElementById("seo-fallback");
if (seoFallback) {
  seoFallback.remove();
}

createRoot(document.getElementById("root")).render(
  <>
    <ClarityTracker />
    <AppView />
  </>
);
