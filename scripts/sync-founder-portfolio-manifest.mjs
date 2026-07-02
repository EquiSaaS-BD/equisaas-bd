import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const MANIFEST_URL = "https://kholipha-ahmmad-al-amin.equisaas-bd.com/all-links.json";
const SELECTED_PROJECT_TITLES = [
  "EquiSaaS BD",
  "Motionly Media",
  "Shikkha.dev",
  "THETAEnhancer",
  "TaskFlow AI",
];
const SELECTED_LAB_TITLES = ["Kanban Board", "Code Playground", "Lab Report Creator"];

function sortBySelection(items, selectedTitles) {
  const order = new Map(selectedTitles.map((title, index) => [title, index]));
  return [...items].sort((left, right) => (order.get(left.title) ?? 999) - (order.get(right.title) ?? 999));
}

function pickSelected(items, selectedTitles) {
  const selected = items.filter((item) => selectedTitles.includes(item.title));
  if (selected.length) {
    return sortBySelection(selected, selectedTitles);
  }

  return items.slice(0, Math.min(items.length, 3));
}

function serializeManifest(payload) {
  const source = {
    sourceUrl: MANIFEST_URL,
    generatedAt: payload.generatedAt,
    site: payload.site,
    documents: payload.documents,
    personSameAs: payload.personSameAs,
    selectedProjectPages: payload.selectedProjectPages,
    selectedLabPages: payload.selectedLabPages,
  };

  return `export const FOUNDER_PORTFOLIO_MANIFEST = ${JSON.stringify(source, null, 2)};\n\nexport const FOUNDER_PROFILE_HUB = FOUNDER_PORTFOLIO_MANIFEST.site.home;\nexport const FOUNDER_SOCIAL_SAME_AS = FOUNDER_PORTFOLIO_MANIFEST.personSameAs;\nexport const FOUNDER_SELECTED_PROJECTS = FOUNDER_PORTFOLIO_MANIFEST.selectedProjectPages;\nexport const FOUNDER_SELECTED_LABS = FOUNDER_PORTFOLIO_MANIFEST.selectedLabPages;\n`;
}

async function main() {
  const response = await fetch(MANIFEST_URL, {
    headers: {
      Accept: "application/json",
      "User-Agent": "EquiSaaS-BD-SEO-Sync/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch founder portfolio manifest: ${response.status} ${response.statusText}`);
  }

  const manifest = await response.json();
  const personSameAs = (manifest.socialProfiles ?? [])
    .filter((entry) => /^https?:/i.test(entry))
    .filter((entry) => !entry.includes("meta.ai"));
  const selectedProjectPages = pickSelected(manifest.projectPages ?? [], SELECTED_PROJECT_TITLES);
  const selectedLabPages = pickSelected(manifest.labPages ?? [], SELECTED_LAB_TITLES);

  const output = serializeManifest({
    generatedAt: manifest.generatedAt,
    site: manifest.site,
    documents: manifest.documents ?? [],
    personSameAs,
    selectedProjectPages,
    selectedLabPages,
  });

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const outputPath = path.resolve(__dirname, "../landing/src/data/founder-portfolio-manifest.js");
  await writeFile(outputPath, output, "utf8");

  console.log(
    JSON.stringify(
      {
        ok: true,
        sourceUrl: MANIFEST_URL,
        outputPath,
        sameAsCount: personSameAs.length,
        selectedProjectPages: selectedProjectPages.length,
        selectedLabPages: selectedLabPages.length,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
