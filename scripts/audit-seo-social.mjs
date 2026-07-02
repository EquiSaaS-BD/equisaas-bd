import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const htmlFiles = [
  "landing/index.html",
  "landing/founder/index.html",
  "landing/software-training-bangladesh/index.html",
  "landing/sme-software-bangladesh/index.html",
  "landing/open-tech-cooperative-bangladesh/index.html",
  "landing/orientation-2026/index.html",
];

const checks = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function match(text, regex) {
  return (text.match(regex) || [null, ""])[1];
}

function extractMeta(text, attrName, attrValue) {
  const escaped = attrValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return (
    match(
      text,
      new RegExp(
        `<meta\\b[^>]*${attrName}="${escaped}"[^>]*content="([^"]+)"[^>]*>`,
        "i",
      ),
    ) ||
    match(
      text,
      new RegExp(
        `<meta\\b[^>]*content="([^"]+)"[^>]*${attrName}="${escaped}"[^>]*>`,
        "i",
      ),
    )
  );
}

for (const file of htmlFiles) {
  const html = read(file);

  const result = {
    file,
    canonical:
      match(html, /<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/i) ||
      match(html, /<link\b[^>]*href="([^"]+)"[^>]*rel="canonical"/i),
    robots: extractMeta(html, "name", "robots"),
    ogTitle: extractMeta(html, "property", "og:title"),
    ogDescription: extractMeta(html, "property", "og:description"),
    ogImage: extractMeta(html, "property", "og:image"),
    twitterCard: extractMeta(html, "name", "twitter:card"),
    twitterTitle: extractMeta(html, "name", "twitter:title"),
    twitterDescription: extractMeta(html, "name", "twitter:description"),
    twitterImage: extractMeta(html, "name", "twitter:image"),
  };

  checks.push(result);
}

const issues = [];

for (const result of checks) {
  for (const [key, value] of Object.entries(result)) {
    if (key === "file") continue;
    if (!value) {
      issues.push({ file: result.file, field: key, problem: "missing" });
    }
  }
}

if (issues.length) {
  console.log(JSON.stringify({ ok: false, issues, checks }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, checks }, null, 2));
