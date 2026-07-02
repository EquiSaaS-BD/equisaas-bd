// Smoke-test: import each updated data module to confirm it parses and exports something.
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs";

const PORTFOLIO = "D:/projects/kholipha-ahmmad-al-amin.equisaas-bd.com";
const files = [
  "src/data/activitiesData.js",
  "src/data/certificationsData.js",
  "src/data/siteContentDefaults.js",
  "src/data/chatbotData.js",
];

let allOk = true;
for (const rel of files) {
  const abs = path.join(PORTFOLIO, rel);
  try {
    // Use dynamic import - Node will parse the module and execute top-level export statements.
    const mod = await import(pathToFileURL(abs).href);
    const keys = Object.keys(mod).slice(0, 8);
    console.log(`[OK]   ${rel.padEnd(36)} exports: ${keys.join(", ")}`);
  } catch (e) {
    allOk = false;
    console.error(`[FAIL] ${rel}: ${e.message}`);
  }
}
process.exit(allOk ? 0 : 1);
