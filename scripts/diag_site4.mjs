import fs from "node:fs";
const t = fs.readFileSync("D:/projects/kholipha-ahmmad-al-amin.equisaas-bd.com/src/data/siteContentDefaults.js", "utf8");
const idx = t.indexOf("zero-olympiad-2026");
// The card opens with "    {\n      id: 'zero-olympiad-2026'".
// Find the "{" that opens this object by walking back from "id:".
// "id:" is preceded by "      " (6 spaces) and a newline.
const idOffset = t.indexOf("id:", idx - 20);
// Walk back to the opening "{"
let openIdx = idOffset;
while (openIdx > 0 && t[openIdx] !== "{") openIdx--;
const cardStart = openIdx - 4;  // include the 4 leading spaces
const endIdx = t.indexOf("},\n", cardStart);
const card = t.slice(cardStart, endIdx + 2);
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
      console.log("  file  :", JSON.stringify(a.slice(Math.max(0, i-20), i+40)));
      console.log("  script:", JSON.stringify(b.slice(Math.max(0, i-20), i+40)));
      break;
    }
  }
  if (a.length !== b.length) console.log(`Length diff: file=${a.length} script=${b.length}`);
}
