import React from "react";
import { createRoot } from "react-dom/client";

import FounderPage from "@/pages/FounderPage";

const seoFallback = document.getElementById("seo-fallback");
if (seoFallback) {
  seoFallback.remove();
}

createRoot(document.getElementById("root")).render(<FounderPage />);
