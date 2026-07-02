import React from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App.jsx";
import "./index.css";

if (typeof window !== "undefined") {
  registerSW({ immediate: true });
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
