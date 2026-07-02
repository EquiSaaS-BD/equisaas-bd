import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import ServicesAppView from "./ServicesAppView.jsx";
import ClarityTracker from "./components/ClarityTracker.jsx";

const seoFallback = document.getElementById("seo-fallback");
if (seoFallback) {
  seoFallback.remove();
}

createRoot(document.getElementById("root")).render(
  <>
    <ClarityTracker />
    <ServicesAppView />
  </>
);
