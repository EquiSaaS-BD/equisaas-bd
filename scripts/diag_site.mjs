import fs from "node:fs";
const t = fs.readFileSync("D:/projects/kholipha-ahmmad-al-amin.equisaas-bd.com/src/data/siteContentDefaults.js", "utf8");
const idx = t.indexOf("zero-olympiad-2026");
const card = t.slice(idx - 4, idx + 580);
console.log("--- FILE CARD (JSON-escaped) ---");
console.log(JSON.stringify(card));
console.log("--- length ---", card.length);

// Reproduce the script's old string by reading the .mjs file and slicing it.
const mjs = fs.readFileSync("D:/projects/EquiSaaS BD/scripts/apply_champion_to_portfolio.mjs", "utf8");
const m = mjs.match(/const siteOld = `([\s\S]*?)`;/);
if (!m) { console.log("siteOld not found in script"); process.exit(1); }
const scriptOld = m[1];
console.log("--- SCRIPT OLD (JSON-escaped) ---");
console.log(JSON.stringify(scriptOld));
console.log("--- length ---", scriptOld.length);

const fn = (s) => s.replace(/\r\n/g, "\n");
const a = fn(card), b = fn(scriptOld);
console.log("Equal after normalize?", a === b);
if (a !== b) {
  const min = Math.min(a.length, b.length);
  for (let i = 0; i < min; i++) {
    if (a[i] !== b[i]) {
      console.log(`First diff at offset ${i}:`);
      console.log("  file:", JSON.stringify(a.slice(Math.max(0, i-20), i+30)));
      console.log("  script:", JSON.stringify(b.slice(Math.max(0, i-20), i+30)));
      break;
    }
  }
  if (a.length !== b.length) console.log(`Length diff: file=${a.length} script=${b.length}`);
}
