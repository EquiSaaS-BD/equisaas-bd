import React from "react";
import { createRoot } from "react-dom/client";
import PublicProfileView from "./views/PublicProfileView.jsx";
import { getPublicProfileRoute } from "@/lib/publicProfile";
import "./index.css";

const resolveUserId = () => {
  if (typeof window === "undefined") return "";
  const routeMatch = getPublicProfileRoute(window.location.pathname);
  if (routeMatch?.userId) return routeMatch.userId;
  return new URLSearchParams(window.location.search).get("userId") || "";
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<PublicProfileView userId={resolveUserId()} />);
