/**
 * fix-emdash-and-meta.mjs
 * 1. Removes ALL em dashes (U+2014) from every HTML file and JSX source file
 * 2. Ensures every <meta name="description"> is 150-160 chars
 * 3. Replaces em dashes in OG image generator subtitles
 */

import fs from "fs";
import path from "path";

const ROOT = path.resolve(process.cwd());

// ─── 1. CORRECT META DESCRIPTIONS (150-160 chars) ────────────────────────────
const META_DESCRIPTIONS = {
  "landing/index.html": "EquiSaaS BD is Bangladesh's first open tech cooperative. 64-district builder network, sweat equity model, profit sharing, and real SaaS products.",
  "landing/services/index.html": "Hire top software engineers, UI/UX designers, SEO experts, and video editors in Bangladesh. React, Node.js, Python, DevOps. Negotiable B2B pricing.",
  "landing/projects/index.html": "Explore real SaaS products built by EquiSaaS BD's 64-district tech cooperative. ERP, POS, LMS platforms built with proof of work.",
  "landing/partners/index.html": "Discover EquiSaaS BD's strategic partner network driving Bangladesh's tech revolution. Join as a B2B partner or reseller today.",
  "landing/founder/index.html": "Kholipha Ahmmad Al-Amin: National Champion at the Zero Olympiad Season 2 (SDG 15 Achiever), UN Roundtable participant, founder of BD's first open tech cooperative.",
  "landing/bd-erp-pos/index.html": "BD ERP and POS system for shops, restaurants, pharmacies and SMEs across Bangladesh. Offline-ready, bilingual Windows and web-based software.",
  "landing/sme-software-bangladesh/index.html": "Affordable business automation software for SMEs across all 64 districts of Bangladesh. Inventory, accounting, POS and CRM solutions.",
  "landing/software-training-bangladesh/index.html": "Free software training in Bangladesh. Learn React, Node.js, Python and full-stack development via our LMS platform. 64-district reach.",
  "landing/open-tech-cooperative-bangladesh/index.html": "Join Bangladesh's first sweat equity cooperative. Build real products, earn 70% profit share, no degrees required. Just proof of work.",
  "landing/orientation-2026/index.html": "EquiSaaS BD Orientation 2026. Start your journey into Bangladesh's largest tech cooperative. 64 districts. Open enrollment. Join now.",
};

// ─── 2. FILES TO STRIP EM DASHES FROM ────────────────────────────────────────
const FILE_PATTERNS = [
  "landing/**/*.html",
  "landing/**/*.jsx",
  "landing/**/*.tsx",
  "landing/**/*.js",
  "landing/**/*.mjs",
  "landing/generate-og-images.mjs",
];

function walkDir(dir, exts) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "dist") continue;
      results.push(...walkDir(full, exts));
    } else if (exts.some(e => full.endsWith(e))) {
      results.push(full);
    }
  }
  return results;
}

const EXTENSIONS = [".html", ".jsx", ".tsx", ".js", ".mjs", ".ts", ".css", ".scss"];
const allFiles = [
  ...walkDir(path.join(ROOT, "landing", "src"), EXTENSIONS),
  ...walkDir(path.join(ROOT, "landing", "services"), EXTENSIONS),
  ...walkDir(path.join(ROOT, "landing", "projects"), EXTENSIONS),
  ...walkDir(path.join(ROOT, "landing", "partners"), EXTENSIONS),
  ...walkDir(path.join(ROOT, "landing", "founder"), EXTENSIONS),
  ...walkDir(path.join(ROOT, "landing", "bd-erp-pos"), EXTENSIONS),
  ...walkDir(path.join(ROOT, "landing", "sme-software-bangladesh"), EXTENSIONS),
  ...walkDir(path.join(ROOT, "landing", "software-training-bangladesh"), EXTENSIONS),
  ...walkDir(path.join(ROOT, "landing", "open-tech-cooperative-bangladesh"), EXTENSIONS),
  ...walkDir(path.join(ROOT, "landing", "orientation-2026"), EXTENSIONS),
  path.join(ROOT, "landing", "index.html"),
  path.join(ROOT, "landing", "generate-og-images.mjs"),
  path.join(ROOT, "generate-og-images.mjs"),
];

let emDashFixCount = 0;
let metaFixCount = 0;

// ─── STEP 1: Strip em dashes ─────────────────────────────────────────────────
for (const filePath of allFiles) {
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, "utf8");
  if (content.includes("\u2014")) {
    // Replace em dash with a simple hyphen-space pattern
    const fixed = content.replace(/\u2014/g, "-");
    fs.writeFileSync(filePath, fixed, "utf8");
    console.log(`✅ [EM DASH] Fixed: ${path.relative(ROOT, filePath)}`);
    emDashFixCount++;
  }
}

// ─── STEP 2: Fix meta descriptions ────────────────────────────────────────────
for (const [relPath, desc] of Object.entries(META_DESCRIPTIONS)) {
  const fullPath = path.join(ROOT, relPath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️  Not found: ${relPath}`);
    continue;
  }

  // Validate length
  if (desc.length < 120 || desc.length > 160) {
    console.warn(`⚠️  Description length ${desc.length} out of range for ${relPath}: "${desc}"`);
  }

  let html = fs.readFileSync(fullPath, "utf8");

  // Replace existing meta description
  const metaRegex = /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/gi;
  const newTag = `<meta name="description" content="${desc}" />`;

  if (metaRegex.test(html)) {
    html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/gi, newTag);
  } else {
    // Insert after <title>
    html = html.replace(/(<\/title>)/, `$1\n    ${newTag}`);
  }

  // Also remove any em dashes that slipped in
  html = html.replace(/\u2014/g, "-");

  fs.writeFileSync(fullPath, html, "utf8");
  console.log(`✅ [META DESC ${desc.length}ch] Fixed: ${relPath}`);
  metaFixCount++;
}

// ─── STEP 3: Fix OG image generator ──────────────────────────────────────────
const ogGenPath = path.join(ROOT, "landing", "generate-og-images.mjs");
if (fs.existsSync(ogGenPath)) {
  let src = fs.readFileSync(ogGenPath, "utf8");
  src = src.replace(/\u2014/g, "-");
  fs.writeFileSync(ogGenPath, src, "utf8");
}

console.log(`\n🎉 Done! Em dashes fixed in ${emDashFixCount} files. Meta descriptions fixed in ${metaFixCount} pages.`);
console.log(`\n📏 Meta description lengths:`);
for (const [p, d] of Object.entries(META_DESCRIPTIONS)) {
  console.log(`   ${d.length}ch  ${p.split("/").pop()}`);
}
