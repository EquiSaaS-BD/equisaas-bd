import { cp, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const brandDir = path.join(root, "Brand Assets");

const targets = [
  path.join(root, "landing", "public"),
  path.join(root, "landing", "src", "assets"),
  path.join(root, "lms", "public"),
  path.join(root, "lms", "src", "assets"),
];

const assetMap = [
  ["EquiSaaS BD Logo.SVG", "logo.svg"],
  ["EquiSaaS BD Logo Bangla.SVG", "logo-bn.svg"],
  ["EquiSaaS BD Logo.png", "logo.png"],
  ["EquiSaaS BD Logo Bangla.png", "logo-bn.png"],
  ["EquiSaaS BD Favicon.svg", "favicon.svg"],
  ["EquiSaaS BD Favicon.png", "favicon.png"],
  ["EquiSaaS BD OG Image.svg", "og-image.svg"],
  ["EquiSaaS BD OG Image.png", "og-image.png"],
  ["EquiSaaS BD OG Image Bangla.svg", "og-image-bn.svg"],
  ["EquiSaaS BD OG Image Bangla.png", "og-image-bn.png"],
  ["founder.jpg", "founder.jpg"],
  ["hr_signature.png", "hr-signature.png"],
  ["hr_seal.png", "hr-seal.png"],
  ["official seal.png", "official-seal.png"],
  ["EquiSaaS BD Anthem.mp3", "equisaas-anthem.mp3"],
  ["B2B SaaS স্টার্টআপ ও ওপেন টেক কোঅপারেটিভের জন্য সমাধান.pdf", "b2b-saas-solution.pdf"],
  ["glc logo.png", "glc-logo.png"],
  ["Managing Director & Chairman_seal.png", "md-chairman-seal.png"],
  ["Managing Director & Chairman_signature.png", "md-chairman-signature.png"],
  ["motionly.media logo.png", "motionly.media-logo.png"],
  ["graduation-gate.equisaas-bd.com logo.png", "graduation-gate-logo.png"],
  ["BK Digital Agency.jpeg", "bk-digital-agency.jpeg"],
  ["Rialto Shopping.jpg", "rialto-shopping.jpg"],
  ["Samner Bangladesh.jpg", "samner-bangladesh.jpg"],
  ["aritconsultancy.com logo.png", "arit-consultancy-logo.png"],
];

async function copyAsset(sourceName, targetName, destinationDir) {
  const sourcePath = path.join(brandDir, sourceName);
  if (!existsSync(sourcePath)) {
    throw new Error(`Brand asset not found: ${sourcePath}`);
  }

  await mkdir(destinationDir, { recursive: true });
  await cp(sourcePath, path.join(destinationDir, targetName));
}

async function main() {
  if (!existsSync(brandDir)) {
    throw new Error(`Brand Assets directory not found at ${brandDir}`);
  }

  for (const destinationDir of targets) {
    for (const [sourceName, targetName] of assetMap) {
      await copyAsset(sourceName, targetName, destinationDir);
    }
  }

  console.log("Synced Brand Assets into landing and LMS asset directories.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
