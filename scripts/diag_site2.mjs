import fs from "node:fs";
const t = fs.readFileSync("D:/projects/kholipha-ahmmad-al-amin.equisaas-bd.com/src/data/siteContentDefaults.js", "utf8");
const idx = t.indexOf("zero-olympiad-2026");
// Extract the card with leading 4 spaces, from "    {\n      id: 'zero-olympiad-2026'," up through the closing "},"
const start = idx - 4;  // include the 4 spaces before "id:"
const endIdx = t.indexOf("},\n", start);
const card = t.slice(start, endIdx + 2);
console.log("--- FILE CARD (JSON-escaped) ---");
console.log(JSON.stringify(card));
console.log("--- length ---", card.length);
console.log("Has CRLF?", card.includes("\r\n"));

const mjs = fs.readFileSync("D:/projects/EquiSaaS BD/scripts/apply_champion_to_portfolio.mjs", "utf8");
const m = mjs.match(/const siteOld = `([\s\S]*?)`;/);
const scriptOld = m[1];
console.log("--- SCRIPT OLD (JSON-escaped) ---");
console.log(JSON.stringify(scriptOld));
console.log("--- length ---", scriptOld.length);
console.log("Has CRLF?", scriptOld.includes("\r\n"));

const fn = (s) => s.replace(/\r\n/g, "\n");
const a = fn(card), b = fn(scriptOld);
console.log("Equal after normalize?", a === b);
if (a !== b) {
  const min = Math.min(a.length, b.length);
  for (let i = 0; i < min; i++) {
    if (a[i] !== b[i]) {
      console.log(`First diff at offset ${i}:`);
      console.log("  file :", JSON.stringify(a.slice(Math.max(0, i-15), i+30)));
      console.log("  script:", JSON.stringify(b.slice(Math.max(0, i-15), i+30)));
      break;
    }
  }
  if (a.length !== b.length) console.log(`Length diff: file=${a.length} script=${b.length}`);
}
