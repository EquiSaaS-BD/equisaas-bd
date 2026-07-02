import fs from 'fs/promises';
import path from 'path';

const descriptions = {
  'landing/404.html': 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Please return to the EquiSaaS BD home page to continue.',
  'landing/bd-erp-pos/index.html': 'BD ERP and POS system for shops, restaurants, pharmacies and SMEs across Bangladesh. Highly scalable offline-ready, bilingual Windows and web-based POS software.',
  'landing/bd-erp-pos/manual/index.html': 'A complete Bangla and English BD ERP POS manual covering setup, roles, POS checkout, stock, baki, accounting, secure backup, updates, and demo-data migration.',
  'landing/founder/index.html': 'Meet Kholipha Ahmmad Al-Amin: National Champion at the Zero Olympiad Season 2 (SDG 15 Achiever), UN Roundtable participant, and founder of Bangladesh’s first open tech cooperative at EquiSaaS BD.',
  'landing/index.html': 'EquiSaaS BD is Bangladesh’s first open tech cooperative. We back a 64-district builder network with a sweat equity model to build real B2B SaaS solutions.',
  'landing/license-terms/index.html': 'Read the complete software license agreement, data ownership policies, and general usage terms for EquiSaaS BD ERP and POS systems before your installation.',
  'landing/open-tech-cooperative-bangladesh/index.html': 'Join Bangladesh’s first sweat equity cooperative. Build real products across 64 districts, earn 70% profit share. No degrees required. Just show proof of work.',
  'landing/orientation-2026/index.html': 'EquiSaaS BD Orientation 2026. Start your journey into Bangladesh’s largest open tech cooperative across 64 districts. Open enrollment is live. Join us today!',
  'landing/partners/index.html': 'Discover EquiSaaS BD’s strategic partner network driving Bangladesh’s tech revolution forward. Join as a strategic B2B partner, investor, or reseller today.',
  'landing/privacy-policy/index.html': 'Review the comprehensive data privacy, encryption, and security policy for EquiSaaS BD ERP and POS software users. Your business data protection is our priority.',
  'landing/projects/index.html': 'Explore real, production-ready SaaS products built by EquiSaaS BD’s 64-district tech cooperative. ERP, POS, and LMS platforms built entirely with proof of work.',
  'landing/services/index.html': 'Explore 800 professional IT services in Bangladesh. From Video Editing and Data Entry to Full Stack App Development and Complete SaaS. Negotiable global pricing.',
  'landing/sme-software-bangladesh/index.html': 'Affordable business automation software for SMEs across all 64 districts of Bangladesh. Scalable inventory, accounting, point of sale, and CRM SaaS solutions.',
  'landing/software-training-bangladesh/index.html': 'Access free software training in Bangladesh. Learn React, Node.js, Python and full-stack development via our LMS platform. Skills that reach all 64 districts.'
};

async function fixHtmlDescriptions() {
  for (const [file, desc] of Object.entries(descriptions)) {
    console.log(`Checking ${file}. Length: ${desc.length}`);
    if (desc.length < 150 || desc.length > 160) {
      console.warn(`WARNING: ${file} length is ${desc.length}`);
    }
    const fullPath = path.resolve(file);
    let content = await fs.readFile(fullPath, 'utf8');
    content = content.replace(/<meta name="description"[^>]+content="[^"]*"[^>]*>/, (match) => {
      return match.replace(/content="[^"]*"/, `content="${desc}"`);
    });
    await fs.writeFile(fullPath, content, 'utf8');
  }
}

async function fixOgImages() {
  const ogPath = path.resolve('landing/generate-og-images.mjs');
  let content = await fs.readFile(ogPath, 'utf8');
  content = content.replace('Video Editing - negotiable pricing', 'Video Editing, negotiable pricing');
  content = content.replace('platforms - every project', 'platforms, every project');
  await fs.writeFile(ogPath, content, 'utf8');
  console.log('Fixed OG images script.');
}

async function main() {
  await fixHtmlDescriptions();
  await fixOgImages();
}

main().catch(console.error);
