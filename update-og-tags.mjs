import fs from 'fs';
import path from 'path';

const VERSION = '20260614';

const PAGE_OG_MAP = [
  {
    file: 'landing/projects/index.html',
    ogImage: `https://equisaas-bd.com/og-projects.png?v=${VERSION}`,
    ogTitle: 'Our Projects | EquiSaaS BD',
    ogDesc: 'Real SaaS products built by Bangladesh\'s 64-district tech cooperative. Explore the EquiSaaS BD project portfolio.',
  },
  {
    file: 'landing/partners/index.html',
    ogImage: `https://equisaas-bd.com/og-partners.png?v=${VERSION}`,
    ogTitle: 'Our Partners & Ecosystem | EquiSaaS BD',
    ogDesc: 'Strategic alliances driving Bangladesh\'s tech revolution. Discover EquiSaaS BD\'s growing partner network.',
  },
  {
    file: 'landing/founder/index.html',
    ogImage: `https://equisaas-bd.com/og-founder.png?v=${VERSION}`,
    ogTitle: 'Kholipha Ahmmad Al-Amin | Founder & CEO, EquiSaaS BD',
    ogDesc: 'National Champion at the Zero Olympiad Season 2 (SDG 15 Achiever), UN Strategic Roundtable participant, and visionary founder of Bangladesh\'s first open tech cooperative.',
  },
  {
    file: 'landing/bd-erp-pos/index.html',
    ogImage: `https://equisaas-bd.com/og-erp-pos.png?v=${VERSION}`,
    ogTitle: 'BD ERP & POS System | Best Business Software in Bangladesh',
    ogDesc: 'Bangladesh\'s most powerful ERP and POS software. Offline-ready, bilingual, works for super shops, restaurants and SMEs.',
  },
  {
    file: 'landing/sme-software-bangladesh/index.html',
    ogImage: `https://equisaas-bd.com/og-sme-software.png?v=${VERSION}`,
    ogTitle: 'SME Software Solutions Bangladesh | EquiSaaS BD',
    ogDesc: 'Affordable business automation software for small & medium enterprises in Bangladesh. Grow faster. Work smarter.',
  },
  {
    file: 'landing/software-training-bangladesh/index.html',
    ogImage: `https://equisaas-bd.com/og-software-training.png?v=${VERSION}`,
    ogTitle: 'Software Training Bangladesh | Learn React, Node.js & More',
    ogDesc: 'Bangladesh\'s most practical software training. Learn React, Node.js, Python and full-stack development with our free LMS.',
  },
  {
    file: 'landing/open-tech-cooperative-bangladesh/index.html',
    ogImage: `https://equisaas-bd.com/og-open-tech-coop.png?v=${VERSION}`,
    ogTitle: 'Open Tech Cooperative Bangladesh | EquiSaaS BD',
    ogDesc: 'No degrees. Just proof of work. Join Bangladesh\'s first sweat equity platform and build the future with 64 districts.',
  },
  {
    file: 'landing/orientation-2026/index.html',
    ogImage: `https://equisaas-bd.com/og-orientation-2026.png?v=${VERSION}`,
    ogTitle: 'EquiSaaS BD Orientation 2026 | Your Journey Begins Here',
    ogDesc: 'Join the EquiSaaS BD Orientation 2026. Discover how to earn sweat equity and build Bangladesh\'s tech future from your district.',
  },
  {
    file: 'landing/services/index.html',
    ogImage: `https://equisaas-bd.com/og-services.png?v=${VERSION}`,
    ogTitle: 'World-Class Tech Services | EquiSaaS BD Agency',
    ogDesc: 'Top software engineering, UI/UX, SEO, video editing & digital marketing services in Bangladesh. Contact via WhatsApp.',
  },
];

const updateOrInsert = (html, tagName, attrName, attrValue, newContent) => {
  const regex = new RegExp(`<meta\\s+(?:${attrName}="${attrValue}"[^>]*|[^>]*${attrName}="${attrValue}")[^>]*>`, 'i');
  if (regex.test(html)) {
    return html.replace(regex, newContent);
  }
  // Insert before </head>
  return html.replace('</head>', `  ${newContent}\n</head>`);
};

for (const page of PAGE_OG_MAP) {
  const fullPath = path.resolve(process.cwd(), page.file);
  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️  File not found: ${fullPath}`);
    continue;
  }

  let html = fs.readFileSync(fullPath, 'utf8');

  // Update og:image
  html = updateOrInsert(html, 'meta', 'property', 'og:image',
    `<meta property="og:image" content="${page.ogImage}" />`);
  html = updateOrInsert(html, 'meta', 'property', 'og:image:width',
    `<meta property="og:image:width" content="1200" />`);
  html = updateOrInsert(html, 'meta', 'property', 'og:image:height',
    `<meta property="og:image:height" content="630" />`);

  // Update og:title
  html = updateOrInsert(html, 'meta', 'property', 'og:title',
    `<meta property="og:title" content="${page.ogTitle}" />`);

  // Update og:description
  html = updateOrInsert(html, 'meta', 'property', 'og:description',
    `<meta property="og:description" content="${page.ogDesc}" />`);

  // Update twitter:image
  html = updateOrInsert(html, 'meta', 'name', 'twitter:image',
    `<meta name="twitter:image" content="${page.ogImage}" />`);

  // Update twitter:title
  html = updateOrInsert(html, 'meta', 'name', 'twitter:title',
    `<meta name="twitter:title" content="${page.ogTitle}" />`);

  // Update twitter:description
  html = updateOrInsert(html, 'meta', 'name', 'twitter:description',
    `<meta name="twitter:description" content="${page.ogDesc}" />`);

  fs.writeFileSync(fullPath, html, 'utf8');
  console.log(`✅ Updated OG tags in ${page.file}`);
}

// Update homepage og:image too
const homePath = path.resolve(process.cwd(), 'landing/index.html');
let homeHtml = fs.readFileSync(homePath, 'utf8');
homeHtml = homeHtml.replace(/og-image\.png\?v=\d+/g, `og-image.png?v=${VERSION}`);
homeHtml = homeHtml.replace(/og-image\.svg\?v=\d+/g, `og-image.svg?v=${VERSION}`);
fs.writeFileSync(homePath, homeHtml, 'utf8');
console.log(`✅ Updated homepage OG image version`);

console.log('\n🎉 All OG image tags updated successfully!');
