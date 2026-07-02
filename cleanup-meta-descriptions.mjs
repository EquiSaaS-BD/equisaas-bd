import fs from "fs";
import path from "path";

const ROOT = path.resolve(process.cwd());

const targets = [
  {
    file: "landing/orientation-2026/index.html",
    desc: "EquiSaaS BD Orientation 2026. Start your journey into Bangladesh's largest tech cooperative. 64 districts. Open enrollment. Join now.",
    shortEn: "Watch the EquiSaaS BD grand launch and orientation to learn the roadmap, mission, and sweat equity model of Bangladesh's first open tech cooperative."
  },
  {
    file: "landing/sme-software-bangladesh/index.html",
    desc: "Affordable business automation software for SMEs across all 64 districts of Bangladesh. Inventory, accounting, POS and CRM solutions."
  },
  {
    file: "landing/software-training-bangladesh/index.html",
    desc: "Free software training in Bangladesh. Learn React, Node.js, Python and full-stack development via our LMS platform. 64-district reach."
  },
  {
    file: "landing/open-tech-cooperative-bangladesh/index.html",
    desc: "Join Bangladesh's first sweat equity cooperative. Build real products, earn 70% profit share, no degrees required. Just proof of work."
  },
  {
    file: "landing/bd-erp-pos/index.html",
    desc: "BD ERP and POS system for shops, restaurants, pharmacies and SMEs across Bangladesh. Offline-ready, bilingual Windows and web-based software.",
    shortEn: "Explore BD ERP POS: a Windows-ready Bangladesh business POS with setup download, offline activation, public update feed, and bilingual guidance."
  }
];

for (const target of targets) {
  const filePath = path.join(ROOT, target.file);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ File not found: ${target.file}`);
    continue;
  }

  let content = fs.readFileSync(filePath, "utf8");

  // 1. Remove all meta description tags in the head first
  // We match meta description tags, whether single line or multi-line
  content = content.replace(/<meta\s+name="description"[\s\S]*?\/>/gi, "");

  // Now, let's insert a single clean meta description tag right after <title ...>
  const titleRegex = /(<title\b[^>]*>[\s\S]*?<\/title>)/i;
  const newMetaTag = `\n    <meta name="description" data-i18n-key="metaDescription" data-i18n-attr="content" content="${target.desc}" />`;

  if (titleRegex.test(content)) {
    content = content.replace(titleRegex, `$1${newMetaTag}`);
    console.log(`✅ Injected clean meta description into ${target.file}`);
  } else {
    console.log(`❌ Title tag not found in ${target.file}`);
  }

  // 2. Shorten the dynamic description translation inside window.__STATIC_PAGE_I18N if specified
  if (target.shortEn) {
    const i18nRegex = /metaDescription\s*:\s*\{([\s\S]*?)\}/i;
    const match = content.match(i18nRegex);
    if (match) {
      let block = match[1];
      // Replace the English translation en: "..." with the shortened one
      block = block.replace(/en\s*:\s*"[^"]*"/, `en: "${target.shortEn}"`);
      content = content.replace(i18nRegex, `metaDescription: {${block}}`);
      console.log(`✅ Shortened English dynamic description inside __STATIC_PAGE_I18N for ${target.file}`);
    }
  }

  // Double check em-dash removal in this file
  if (content.includes("\u2014")) {
    content = content.replace(/\u2014/g, "-");
    console.log(`✅ Stripped em-dash from ${target.file}`);
  }

  fs.writeFileSync(filePath, content, "utf8");
}

console.log("🎉 Meta description cleaning complete!");
