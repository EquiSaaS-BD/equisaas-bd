import fs from "node:fs";
const p = "D:/projects/kholipha-ahmmad-al-amin.equisaas-bd.com/README.md";
const t = fs.readFileSync(p, "utf8");
const old = "*   **Zero Olympiad Grand Finals Top 51 Finalist & SDG 15 Achiever** \u2013 Ranked in the top 51 out of 9,332 competitors and named SDG 15 (Life on Land) Achiever representing ADUST.";
const neu = "*   **Zero Olympiad Grand Finals (Season 2) \u2013 National Champion (SDG Achiever) - SDG 15**: Emerged as the official SDG ACHIEVER (CHAMPION) at the Grand Finale on June 13, 2026, out of a national pool of 9,332 Round 1 contestants narrowed to 3,407 in Round 2, representing Atish Dipankar University of Science & Technology (ADUST). The rigorous evaluation, supported by learning partners including TESOL Bangladesh, assessed content relevance, creativity, communication, technical quality, and overall environmental impact.";
if (!t.includes(old)) {
  console.error("[SKIP] old string not found");
  process.exit(1);
}
if (t.split(old).length - 1 !== 1) {
  console.error("[SKIP] old string matches multiple times");
  process.exit(1);
}
fs.writeFileSync(p, t.replace(old, neu), "utf8");
console.log("[OK] README.md updated");
