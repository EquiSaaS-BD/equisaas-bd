import fs from "node:fs";
const t = fs.readFileSync("D:/projects/kholipha-ahmmad-al-amin.equisaas-bd.com/src/data/siteContentDefaults.js", "utf8");
const idx = t.indexOf("zero-olympiad-2026");
// Find the "    {" that opens this object. It precedes "id: 'zero-olympiad-2026'".
// Use a regex: search backwards for "    {" then add 5 to land on the line content.
const back = t.slice(0, idx);
const openIdx = back.lastIndexOf("    {");
const cardStart = openIdx;  // include the 4 spaces and the "{"
const endIdx = t.indexOf("},\n", cardStart);
const card = t.slice(cardStart, endIdx + 2);
console.log("--- FILE CARD (JSON-escaped) ---");
console.log(JSON.stringify(card));
console.log("--- length ---", card.length);
console.log("Has CRLF?", card.includes("\r\n"));
console.log("Starts with '    {'?", card.startsWith("    {"));

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
      console.log("  file  :", JSON.stringify(a.slice(Math.max(0, i-15), i+30)));
      console.log("  script:", JSON.stringify(b.slice(Math.max(0, i-15), i+30)));
      break;
    }
  }
  if (a.length !== b.length) console.log(`Length diff: file=${a.length} script=${b.length}`);
}
