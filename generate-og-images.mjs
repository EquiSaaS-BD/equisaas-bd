/**
 * generate-og-images.mjs
 * Generates pixel-perfect, brand-consistent OG images for all public pages
 * using Puppeteer to render HTML/SVG → PNG at exactly 1200×630px.
 * Safe-zone: critical content stays within center 600×600 so square crops work too.
 */

// Puppeteer is installed under landing/node_modules; resolve it from there so
// this root script can run without a duplicate install at the repo root.
import { createRequire } from "module";
import fs from "fs";
import path from "path";

const landingRequire = createRequire(
  path.resolve(process.cwd(), "landing", "package.json")
);
const puppeteer = landingRequire("puppeteer");

const OUT_DIR = path.resolve(process.cwd(), "landing/public");

// Brand colours extracted directly from logo.svg
const BRAND = {
  blue: "#579AF4",
  green: "#27C990",
  dark: "#0A0F1E",
  darkCard: "#111827",
  border: "rgba(87,154,244,0.18)",
};

// Icon SVG paths (inline, no external deps)
const ICONS = {
  software: `<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="${BRAND.blue}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  services: `<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="${BRAND.green}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  projects: `<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="${BRAND.blue}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  partners: `<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="${BRAND.green}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  founder: `<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="${BRAND.blue}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  erp: `<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="${BRAND.green}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
  sme: `<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="${BRAND.blue}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  training: `<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="${BRAND.green}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  coop: `<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="${BRAND.blue}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  orientation: `<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="${BRAND.green}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
};

// The EquiSaaS BD icon mark (from favicon.svg, scaled down)
const LOGO_MARK = `<svg width="44" height="44" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M300 250C300 194.772 255.228 150 200 150C144.772 150 100 194.772 100 250" stroke="${BRAND.blue}" stroke-width="41.6667" stroke-linecap="round"/>
  <path d="M300 350C355.228 350 400 305.228 400 250C400 194.772 355.228 150 300 150C244.772 150 200 194.772 200 250C200 305.228 244.772 350 300 350Z" stroke="${BRAND.green}" stroke-width="41.6667"/>
  <path d="M300 250C300 305.228 255.228 350 200 350C144.772 350 100 305.228 100 250" stroke="${BRAND.blue}" stroke-width="41.6667" stroke-linecap="round"/>
  <rect x="171" y="218" width="158" height="28" rx="14" fill="url(#lg1)"/>
  <rect x="171" y="255" width="158" height="28" rx="14" fill="url(#lg2)"/>
  <defs>
    <linearGradient id="lg1" x1="329" y1="232" x2="171" y2="232" gradientUnits="userSpaceOnUse">
      <stop offset="0.2" stop-color="${BRAND.blue}"/>
      <stop offset="0.8" stop-color="${BRAND.green}"/>
    </linearGradient>
    <linearGradient id="lg2" x1="329" y1="269" x2="171" y2="269" gradientUnits="userSpaceOnUse">
      <stop offset="0.2" stop-color="${BRAND.blue}"/>
      <stop offset="0.8" stop-color="${BRAND.green}"/>
    </linearGradient>
  </defs>
</svg>`;

/**
 * Generate branded HTML for an OG image
 */
function buildHTML({ icon, eyebrow, title, subtitle, tags = [], accentColor = BRAND.blue }) {
  const tagHTML = tags.map(t => `
    <span style="
      display:inline-block;
      padding:5px 14px;
      border-radius:100px;
      border:1px solid ${accentColor}44;
      background:${accentColor}18;
      color:${accentColor};
      font-size:13px;
      font-weight:600;
      letter-spacing:0.04em;
      font-family:'Inter',sans-serif;
    ">${t}</span>
  `).join("");

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html, body { width:1200px; height:630px; overflow:hidden; }
  body {
    background: ${BRAND.dark};
    font-family: 'Inter', system-ui, sans-serif;
    color: white;
    position: relative;
  }
  /* Radial glow top-right */
  .glow-tr {
    position:absolute;
    top:-200px; right:-200px;
    width:700px; height:700px;
    background: radial-gradient(circle, ${accentColor}28 0%, transparent 65%);
    pointer-events:none;
  }
  /* Radial glow bottom-left */
  .glow-bl {
    position:absolute;
    bottom:-200px; left:-150px;
    width:600px; height:600px;
    background: radial-gradient(circle, ${BRAND.green}1a 0%, transparent 65%);
    pointer-events:none;
  }
  /* Subtle grid pattern */
  .grid-overlay {
    position:absolute;
    inset:0;
    background-image:
      linear-gradient(${BRAND.blue}08 1px, transparent 1px),
      linear-gradient(90deg, ${BRAND.blue}08 1px, transparent 1px);
    background-size:48px 48px;
    pointer-events:none;
  }
  /* Top border accent */
  .top-border {
    position:absolute;
    top:0; left:0; right:0;
    height:3px;
    background: linear-gradient(90deg, ${BRAND.blue}, ${BRAND.green}, ${BRAND.blue});
  }
  /* Bottom border accent */
  .bottom-border {
    position:absolute;
    bottom:0; left:0; right:0;
    height:2px;
    background: linear-gradient(90deg, transparent, ${accentColor}60, transparent);
  }
  /* Main layout */
  .container {
    position:relative;
    z-index:1;
    width:100%;
    height:100%;
    display:flex;
    flex-direction:column;
    padding:52px 72px 44px;
  }
  /* Header: logo + brand name */
  .header {
    display:flex;
    align-items:center;
    gap:12px;
    margin-bottom:auto;
  }
  .brand-name {
    font-size:15px;
    font-weight:700;
    letter-spacing:0.08em;
    text-transform:uppercase;
    color: rgba(255,255,255,0.55);
  }
  /* Center content (in safe zone) */
  .content {
    display:flex;
    flex-direction:column;
    gap:18px;
    margin-bottom:auto;
  }
  .eyebrow {
    display:flex;
    align-items:center;
    gap:10px;
  }
  .eyebrow-line {
    width:32px; height:2px;
    background: linear-gradient(90deg, ${BRAND.blue}, ${BRAND.green});
    border-radius:2px;
    flex-shrink:0;
  }
  .eyebrow-text {
    font-size:13px;
    font-weight:700;
    letter-spacing:0.1em;
    text-transform:uppercase;
    color: ${accentColor};
  }
  .title {
    font-size:56px;
    font-weight:900;
    line-height:1.08;
    letter-spacing:-0.02em;
    color: #ffffff;
    max-width:820px;
  }
  .subtitle {
    font-size:20px;
    font-weight:500;
    line-height:1.5;
    color: rgba(255,255,255,0.58);
    max-width:740px;
  }
  .tags {
    display:flex;
    gap:10px;
    flex-wrap:wrap;
    margin-top:4px;
  }
  /* Footer */
  .footer {
    display:flex;
    align-items:center;
    justify-content:space-between;
  }
  .footer-url {
    font-size:13px;
    font-weight:600;
    color: rgba(255,255,255,0.3);
    letter-spacing:0.04em;
  }
  .footer-badge {
    display:flex;
    align-items:center;
    gap:8px;
    padding:7px 16px;
    background:${accentColor}18;
    border:1px solid ${accentColor}30;
    border-radius:100px;
  }
  .footer-badge-dot {
    width:7px; height:7px;
    border-radius:50%;
    background: ${accentColor};
    box-shadow: 0 0 8px ${accentColor};
  }
  .footer-badge-text {
    font-size:12px;
    font-weight:700;
    letter-spacing:0.06em;
    color: ${accentColor};
    text-transform:uppercase;
  }
</style>
</head>
<body>
  <div class="glow-tr"></div>
  <div class="glow-bl"></div>
  <div class="grid-overlay"></div>
  <div class="top-border"></div>
  <div class="bottom-border"></div>

  <div class="container">
    <!-- Header -->
    <div class="header">
      ${LOGO_MARK}
      <span class="brand-name">EquiSaaS BD</span>
    </div>

    <!-- Main Content -->
    <div class="content">
      <div class="eyebrow">
        <div class="eyebrow-line"></div>
        <span class="eyebrow-text">${eyebrow}</span>
      </div>
      <div class="title">${title}</div>
      <div class="subtitle">${subtitle}</div>
      ${tags.length ? `<div class="tags">${tagHTML}</div>` : ""}
    </div>

    <!-- Footer -->
    <div class="footer">
      <span class="footer-url">equisaas-bd.com</span>
      <div class="footer-badge">
        <div class="footer-badge-dot"></div>
        <span class="footer-badge-text">Bangladesh's Tech Revolution</span>
      </div>
    </div>
  </div>
</body>
</html>`;
}

const PAGES = [
  {
    out: "og-image.png",
    eyebrow: "Bangladesh's First Open Tech Cooperative",
    title: "Master Your Craft.\nProve Your Worth.",
    subtitle: "64 জেলার বিল্ডার নেটওয়ার্ক। No degrees. No exploitation. Just Proof of Work.",
    tags: ["Sweat Equity", "64 Districts", "Open Cooperative"],
    accentColor: BRAND.blue,
  },
  {
    out: "og-services.png",
    eyebrow: "Agency Services",
    title: "World-Class\nTech Services",
    subtitle: "Software Engineering, UI/UX, DevOps, Digital Marketing, Video Editing - negotiable pricing.",
    tags: ["React & Node.js", "SEO Experts", "WhatsApp Contact"],
    accentColor: BRAND.green,
  },
  {
    out: "og-projects.png",
    eyebrow: "Our Portfolio",
    title: "Real SaaS Products\nBuilt in Bangladesh",
    subtitle: "From ERP systems to AI-powered platforms - every project built with proof of work.",
    tags: ["SaaS Products", "Open Source", "Production Ready"],
    accentColor: BRAND.blue,
  },
  {
    out: "og-partners.png",
    eyebrow: "Strategic Alliances",
    title: "Our Partners &\nEcosystem",
    subtitle: "Building Bangladesh's tech future through strategic B2B partnerships and collaborative growth.",
    tags: ["B2B Partners", "Reseller Program", "Ecosystem"],
    accentColor: BRAND.green,
  },
  {
    out: "og-founder.png",
    eyebrow: "Founder & CEO",
    title: "Kholipha Ahmmad\nAl-Amin",
    subtitle: "National Champion (SDG Achiever) at the Zero Olympiad Season 2. UN Strategic Roundtable Participant. Founder of Bangladesh's First Open Tech Cooperative.",
    tags: ["National Champion", "SDG 15 Champion", "UN Roundtable", "Tech Leader"],
    accentColor: BRAND.blue,
  },
  {
    out: "og-erp-pos.png",
    eyebrow: "Product · BD ERP & POS",
    title: "Bangladesh's Most\nPowerful POS System",
    subtitle: "Offline-ready, bilingual ERP & POS for super shops, restaurants, pharmacies and SMEs across BD.",
    tags: ["Offline Ready", "Windows + Web", "Bilingual UI"],
    accentColor: BRAND.green,
  },
  {
    out: "og-sme-software.png",
    eyebrow: "SME Software Solutions",
    title: "Grow Your Business\nWith Smart Software",
    subtitle: "Affordable business automation for small & medium enterprises across all 64 districts of Bangladesh.",
    tags: ["Inventory", "Accounting", "Point of Sale"],
    accentColor: BRAND.blue,
  },
  {
    out: "og-software-training.png",
    eyebrow: "Free Software Training · Bangladesh",
    title: "Learn. Build.\nGet Hired.",
    subtitle: "Industry-ready React, Node.js, Python & Full-Stack training via our free LMS platform.",
    tags: ["Free LMS", "React & Node.js", "64-District Reach"],
    accentColor: BRAND.green,
  },
  {
    out: "og-open-tech-coop.png",
    eyebrow: "Open Tech Cooperative",
    title: "No Degrees.\nJust Proof of Work.",
    subtitle: "Bangladesh's first sweat equity platform. Build real products, earn 70% profit share, own your future.",
    tags: ["Sweat Equity 70%", "Anti-Exploitation", "Open Cooperative"],
    accentColor: BRAND.blue,
  },
  {
    out: "og-orientation-2026.png",
    eyebrow: "EquiSaaS BD · Orientation 2026",
    title: "Your Journey\nBegins Now.",
    subtitle: "Join the most ambitious tech movement in Bangladesh's history. Your district. Your future.",
    tags: ["Orientation 2026", "All 64 Districts", "Enrollment Open"],
    accentColor: BRAND.green,
  },
];

console.log("🚀 Launching Puppeteer...");
const browser = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--font-render-hinting=none"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 }); // 2x for retina quality

for (const config of PAGES) {
  const html = buildHTML(config);
  await page.setContent(html, { waitUntil: "domcontentloaded" });
  // Wait for fonts
  await new Promise(r => setTimeout(r, 800));
  const outPath = path.join(OUT_DIR, config.out);
  await page.screenshot({ path: outPath, type: "png", clip: { x: 0, y: 0, width: 1200, height: 630 } });
  console.log(`✅  Generated ${config.out}`);
}

await browser.close();
console.log("\n🎉 All 10 OG images generated successfully!");
