// Apply the National Champion upgrade (Zero Olympiad Season 2, SDG 15)
// to the founder portfolio project at D:\projects\kholipha-ahmmad-al-amin.equisaas-bd.com.
//
// Source of truth: D:\projects\EquiSaaS BD\landing\src\components\landing\AchievementsAndPartnerships.jsx
//
// Note: source files in the portfolio use mixed line endings (CRLF in some, LF in others).
// We normalize \r\n -> \n for matching and emit with the file's original line ending.

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const PORTFOLIO = path.resolve("D:/projects/kholipha-ahmmad-al-amin.equisaas-bd.com");

// ---------- File 1: activitiesData.js id=7 ----------
const ACTIVITIES = path.join(PORTFOLIO, "src", "data", "activitiesData.js");

const activitiesOldA = `  {
    id: 7,
    title: "Top 51 Finalist & SDG 15 Achiever",
    organization: "Zero Olympiad Grand Finals",
    period: "2026",
    type: "leadership",
    icon: "users",
    description: "Competed and qualified in the national grand finals ranking in the top 51 out of 9332 competitors, and named an SDG 15 (Life on Land) Achiever representing ADUST.",
    achievements: ["Top 51 Finalist", "SDG 15 Achiever", "9332+ Contestants"]
  }`;

const activitiesOldB = `  {
    id: 7,
    title: "National Champion (SDG Achiever) - SDG 15 | Zero Olympiad Grand Finals (Season 2)",
    organization: "Zero Olympiad Grand Finals - Representing Atish Dipankar University of Science & Technology (ADUST)",
    period: "June 13, 2026",
    type: "leadership",
    icon: "trophy",
    description: "Emerged as the official SDG ACHIEVER (CHAMPION) at the Grand Finale on June 13, 2026, out of a national pool of 9,332 Round 1 contestants narrowed to 3,407 in Round 2, representing Atish Dipankar University of Science & Technology (ADUST). The rigorous evaluation, supported by learning partners including TESOL Bangladesh, assessed content relevance, creativity, communication, technical quality, and overall environmental impact.",
    achievements: ["National Champion (SDG Achiever)", "Out of 9,332 Round 1 \u2192 3,407 Round 2 Pool", "Representing ADUST", "Evaluated by TESOL Bangladesh"]
  }`;

const activitiesNew = activitiesOldB;

// ---------- File 2: certificationsData.js line 23 ----------
const CERTS = path.join(PORTFOLIO, "src", "data", "certificationsData.js");

// Accept either pre- or post-upgrade form so re-runs are idempotent.
const certsOldA = `            { title: "Zero Olympiad Top 51 Finalist & SDG 15 Achiever", org: "Zero Olympiad", date: "2026-03-10", type: "Academic", file: "Zero_Olympiad_Finalist.pdf", tags: ["SDG 15", "Olympiad", "Finalist"] },`;
const certsOldB = `            { title: "Zero Olympiad National Champion (SDG Achiever) - SDG 15 (Season 2)", org: "Zero Olympiad Grand Finals", date: "2026-06-13", type: "Academic", file: "Zero_Olympiad_Finalist.pdf", tags: ["National Champion", "SDG 15", "Season 2", "9,332 \u2192 3,407 Pool", "TESOL Bangladesh"] },`;
const certsNew = certsOldB;

// ---------- File 3: siteContentDefaults.js zero-olympiad-2026 card ----------
const SITE = path.join(PORTFOLIO, "src", "data", "siteContentDefaults.js");

const siteOld = `  {
    id: 'zero-olympiad-2026',
    title: 'Zero Olympiad Grand Finals',
    subtitle: 'Top 51 Finalist & SDG 15 Achiever',
    description:
      'Emerged in the Top 51 Finalists nationwide out of 9,332 contestants, named SDG 15 (Life on Land) Achiever representing ADUST.',
    meta: 'Zero Olympiad | Mar 2026',
    icon: 'trophy',
    href: '/files/Certificates/Zero_Olympiad_Finalist.pdf',
  },`;

const siteNew = `  {
    id: 'zero-olympiad-2026',
    title: 'Zero Olympiad Grand Finals (Season 2)',
    subtitle: 'National Champion (SDG Achiever) - SDG 15',
    description:
      'Emerged as the official SDG ACHIEVER (CHAMPION) at the Grand Finale on June 13, 2026, out of a national pool of 9,332 Round 1 contestants narrowed to 3,407 in Round 2, representing Atish Dipankar University of Science & Technology (ADUST). The rigorous evaluation, supported by learning partners including TESOL Bangladesh, assessed content relevance, creativity, communication, technical quality, and overall environmental impact.',
    meta: 'Zero Olympiad | June 13, 2026',
    icon: 'trophy',
    href: '/files/Certificates/Zero_Olympiad_Finalist.pdf',
  },`;

// ---------- File 4: chatbotData.js Key Achievements response ----------
const CHATBOT = path.join(PORTFOLIO, "src", "data", "chatbotData.js");

const chatbotOldA = `    keywords: ["achievement", "award", "buildfest", "olympiad", "zero", "sdg"],
    response: "\uD83C\uDFC6 **Key Achievements:**\\n\\n\u2022 **Infinity AI BuildFest 2026 National Finalist** (E-Commerce Track) at BRAC University out of 3,360 contestants and 612 teams with EquiPulse AI.\\n\u2022 **Zero Olympiad Top 51 Finalist & SDG 15 Achiever** out of 9,332 contestants nationwide, representing ADUST."`;
const chatbotOldB = `    keywords: ["achievement", "award", "buildfest", "olympiad", "zero", "sdg"],
    response: "\uD83C\uDFC6 **Key Achievements:**\\n\\n\u2022 **Zero Olympiad Grand Finals (Season 2) - National Champion (SDG Achiever) - SDG 15**: Emerged as the official SDG ACHIEVER (CHAMPION) at the Grand Finale on June 13, 2026, out of a national pool of 9,332 Round 1 contestants narrowed to 3,407 in Round 2, representing Atish Dipankar University of Science & Technology (ADUST). Evaluation, supported by learning partners like TESOL Bangladesh, assessed content relevance, creativity, communication, technical quality, and environmental impact.\\n\\n\u2022 **Infinity AI BuildFest 2026 National Finalist** (E-Commerce Track) at BRAC University out of 3,360 contestants and 612 teams with EquiPulse AI."`;
const chatbotNew = chatbotOldB;

const targets = [
  [ACTIVITIES, [activitiesOldA, activitiesOldB], activitiesNew, "activitiesData.js id=7"],
  [CERTS, [certsOldA, certsOldB], certsNew, "certificationsData.js Zero Olympiad entry"],
  [SITE, [siteOld, siteNew], siteNew, "siteContentDefaults.js zero-olympiad-2026 card"],
  [CHATBOT, [chatbotOldA, chatbotOldB], chatbotNew, "chatbotData.js Key Achievements response"],
];

function detectLineEnding(text) {
  return text.includes("\r\n") ? "\r\n" : "\n";
}

function normalize(s) {
  return s.replace(/\r\n/g, "\n");
}

let ok = 0;
for (const [p, oldRaws, neuRaw, label] of targets) {
  if (!fs.existsSync(p)) {
    console.error(`[MISS] ${label}: file not found at ${p}`);
    continue;
  }
  const text = fs.readFileSync(p, "utf8");
  const eol = detectLineEnding(text);
  const textN = normalize(text);
  const neuN = normalize(neuRaw);

  // Pick the first old string that exists in the file.
  let match = null;
  for (const cand of oldRaws) {
    const candN = normalize(cand);
    if (textN.includes(candN)) {
      const occ = textN.split(candN).length - 1;
      if (occ !== 1) {
        console.error(`[SKIP] ${label}: candidate matched ${occ} times in ${path.basename(p)} (need exactly 1)`);
        match = null;
        break;
      }
      match = candN;
      break;
    }
  }
  if (!match) {
    // If neither candidate matches, the file is already in the new state (idempotent) - verify by checking new.
    if (textN.includes(neuN)) {
      console.log(`[OK]   ${label}: ${path.basename(p)} already in target state (EOL: ${eol === "\r\n" ? "CRLF" : "LF"})`);
      ok++;
      continue;
    }
    console.error(`[SKIP] ${label}: no candidate old string found in ${path.basename(p)}`);
    continue;
  }
  const replaced = textN.replace(match, neuN).replace(/\n/g, eol);
  fs.writeFileSync(p, replaced, "utf8");
  console.log(`[OK]   ${label}: ${path.basename(p)} updated (EOL: ${eol === "\r\n" ? "CRLF" : "LF"})`);
  ok++;
}

console.log();
console.log(`Summary: ${ok}/${targets.length} files in target state`);
process.exit(ok === targets.length ? 0 : 1);
