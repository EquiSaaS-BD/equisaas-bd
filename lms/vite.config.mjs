import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getManualChunk = (id) => {
  const normalizedId = id.split(path.sep).join("/");

  if (!normalizedId.includes("node_modules")) return undefined;
  if (normalizedId.includes("/react/") || normalizedId.includes("react-dom") || normalizedId.includes("scheduler")) return "vendor-react";
  if (normalizedId.includes("firebase/app")) return "vendor-firebase-core";
  if (normalizedId.includes("firebase/auth")) return "vendor-firebase-auth";
  if (normalizedId.includes("firebase/firestore")) return "vendor-firebase-firestore";
  if (normalizedId.includes("firebase/")) return "vendor-firebase-shared";
  if (normalizedId.includes("/@codemirror/") || normalizedId.includes("/codemirror/") || normalizedId.includes("/@lezer/") || normalizedId.includes("/lezer/")) return "lesson-sandpack-editor";
  if (normalizedId.includes("/@codesandbox/")) return "lesson-sandpack";
  if (normalizedId.includes("react-textarea-autosize") || normalizedId.includes("ansi-to-html") || normalizedId.includes("uuid/")) return "lesson-sandpack-support";
  if (normalizedId.includes("react-markdown") || normalizedId.includes("remark-gfm") || normalizedId.includes("rehype-raw")) return "lesson-markdown";
  if (normalizedId.includes("@radix-ui/")) return "vendor-radix";
  if (normalizedId.includes("framer-motion")) return "vendor-motion";
  if (normalizedId.includes("lucide-react")) return "vendor-icons";
  return undefined;
};

export default defineConfig({
  root: __dirname,
  base: "/lms/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: false,
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      manifest: {
        name: "EquiSaaS BD LMS",
        short_name: "EquiSaaS",
        description: "Open Tech Cooperative Learning Platform",
        theme_color: "#3b82f6",
        icons: [{ src: "/favicon.png", sizes: "192x192", type: "image/png" }],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "../dist_deploy/lms"),
    emptyOutDir: true,
    chunkSizeWarningLimit: 550,
    rollupOptions: {
      input: {
        lms: path.resolve(__dirname, "index.html"),
        publicProfile: path.resolve(__dirname, "public-profile.html"),
      },
      output: {
        manualChunks: getManualChunk,
      },
    },
  },
});
