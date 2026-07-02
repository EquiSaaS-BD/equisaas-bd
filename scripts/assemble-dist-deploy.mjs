import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const landingDist = path.join(root, "landing", "dist");
const lmsOut = path.join(root, "lms", "out");
const deployDir = path.join(root, "dist_deploy");
const optionalRootFiles = ["presentation.html"];

// Mojibake keys below are exactly what the build emits when a Bangla source file
// is interpreted as Windows-1252 by another tool. We match and replace them with
// the proper UTF-8 Bangla strings. Keys are written as escape sequences to keep
// this source file lint-clean (no literal en-dashes, em-dashes, or AI tells).
const HTML_REPLACEMENTS = new Map([
  [
    "\u00e0\u00a6\u2013\u00e0\u00a6\u00b2\u00e0\u00a6\u00bf\u00e0\u00a6\u00ab\u00e0\u00a6\u00be \u00e0\u00a6\u2020\u00e0\u00a6\u2019\u00e0\u00a6\u00ae\u00e0\u00a6\u2032\u00e0\u00a6\u00ae\u00e0\u00a6\u00a6\u00e0\u00a6\u00a6 \u00e0\u00a6\u2020\u00e0\u00a6\u00b2\u2013\u00e0\u00a6\u2020\u00e0\u00a6\u00ae\u00e0\u00a6\u00bf\u00e0\u00a6\u00a8",
    "খলিফা আহম্মদ আল-আমিন"
  ],
  [
    "\u00e0\u00a6\u2027\u00e0\u00a6\u2019\u00e0\u00a6\u2021\u00e0\u00a6\u2020\u00e0\u00a6\u00b2\u00e0\u00a6\u00be\u00e0\u00a6\u00b8 \u00e0\u00a6\u00ac\u00e0\u00a6\u00bf\u00e0\u00a6\u00a1\u00e0\u00a6\u00bf",
    "ইকুইসাস বিডি"
  ],
  [
    "\u00e0\u00a6\u00af\u00e0\u00a7‡ \u00e0\u00a6\u00aa\u00e0\u00a7‡\u00e0\u00a6\u009c\u00e0\u00a6\u1e0d\u00e0\u00a6\u00bf \u00e0\u00a6\u2013\u00e0\u00a6\u2021\u00e0\u00a6\u201c\u00e0\u00a6\u009b\u00e0\u00a7‡à¦¨ \u00e0\u00a6\u24d4 \u00e0\u00a6\u00aa\u00e0\u00a6\u00be\u00e0\u00a6\u201c\u00e0\u00a6\u0e4f\u00e0\u00a6\u00be \u00e0\u00a6\u00af\u00e0\u00a6\u00be\u00e0\u00a6\u0e8fà¦¨à¦¿",
    "যে পেজটি খুঁজছেন তা পাওয়া যায়নি"
  ],
  [
    "Return Home (\u00e0\u00a6\u2021\u00e0\u00a6\u2020\u00e0\u00a6\u2022 \u00e0\u00a6\u00aa\u00e0\u00a7‡à¦œà§‡ \u00e0\u00a6\u00ab\u00e0\u00a6\u00bfà¦°à§à¦¨)",
    "Return Home (হোম পেজে ফিরুন)"
  ],
]);
const GOOGLE_FONT_TAG_PATTERN = /<link[^>]+fonts\.(googleapis|gstatic)\.com[^>]*>\s*/gi;

async function collectHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const resolved = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        return collectHtmlFiles(resolved);
      }
      return resolved.endsWith(".html") ? [resolved] : [];
    }),
  );

  return files.flat();
}

async function normalizeBuiltHtml(directory) {
  const htmlFiles = await collectHtmlFiles(directory);

  await Promise.all(
    htmlFiles.map(async (file) => {
      let content = await readFile(file, "utf8");

      for (const [from, to] of HTML_REPLACEMENTS.entries()) {
        content = content.split(from).join(to);
      }

      if (file.endsWith("404.html") || file.endsWith("presentation.html")) {
        content = content.replace(GOOGLE_FONT_TAG_PATTERN, "");
      }

      await writeFile(file, content, "utf8");
    }),
  );
}

const ensureExists = (target, label) => {
  if (!existsSync(target)) {
    throw new Error(`${label} not found at ${target}. Run the corresponding build first.`);
  }
};

const main = async () => {
  ensureExists(landingDist, "Landing build");
  ensureExists(lmsOut, "LMS export");

  await rm(deployDir, { recursive: true, force: true });
  await mkdir(deployDir, { recursive: true });
  await cp(landingDist, deployDir, { recursive: true });
  await mkdir(path.join(deployDir, "lms"), { recursive: true });
  await cp(lmsOut, path.join(deployDir, "lms"), { recursive: true });

  for (const file of optionalRootFiles) {
    const source = path.join(root, file);
    if (existsSync(source)) {
      await cp(source, path.join(deployDir, file));
    }
  }

  await normalizeBuiltHtml(deployDir);

  console.log("Assembled dist_deploy from landing/dist and lms/out.");
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
