import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { VitePWA } from "vite-plugin-pwa";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  envDir: "../",
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        maximumFileSizeToCacheInBytes: 10000000,
        navigateFallbackDenylist: [
          /^\/lms/,
          /^\/erp-pos/,
          /^\/downloads/
        ],
      },
      manifest: {
        name: 'EquiSaaS BD',
        short_name: 'EquiSaaS',
        description: 'Bangladesh’s first open tech cooperative',
        theme_color: '#0d9488',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'favicon.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'favicon.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  base: "/",
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "main-assets",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        projects: path.resolve(__dirname, "projects", "index.html"),
        partners: path.resolve(__dirname, "partners", "index.html"),
        founder: path.resolve(__dirname, "founder", "index.html"),
        bdErpPos: path.resolve(__dirname, "bd-erp-pos", "index.html"),
        manual: path.resolve(__dirname, "bd-erp-pos", "manual", "index.html"),
        training: path.resolve(__dirname, "software-training-bangladesh", "index.html"),
        sme: path.resolve(__dirname, "sme-software-bangladesh", "index.html"),
        orientation: path.resolve(__dirname, "orientation-2026", "index.html"),
        openTechCoop: path.resolve(__dirname, "open-tech-cooperative-bangladesh", "index.html"),
        privacyPolicy: path.resolve(__dirname, "privacy-policy", "index.html"),
        licenseTerms: path.resolve(__dirname, "license-terms", "index.html"),
        services: path.resolve(__dirname, "services", "index.html"),
        departments: path.resolve(__dirname, "departments", "index.html"),
        proofOfWork: path.resolve(__dirname, "proof-of-work", "index.html"),
        roadmap: path.resolve(__dirname, "roadmap", "index.html"),
        leadership: path.resolve(__dirname, "leadership", "index.html"),
        resources: path.resolve(__dirname, "resources", "index.html"),
        notfound: path.resolve(__dirname, "404.html"),
      },
      output: {
        chunkFileNames: "main-assets/[name]-[hash].js",
        entryFileNames: "main-assets/[name]-[hash].js",
        assetFileNames: "main-assets/[name]-[hash][extname]",
      },
    },
  },
});
