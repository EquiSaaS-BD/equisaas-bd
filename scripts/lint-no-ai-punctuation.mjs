#!/usr/bin/env node
/**
 * lint-no-ai-punctuation.mjs
 *
 * Fails CI on:
 *   1. Em dash (U+2014) and en dash (U+2013) in source-facing copy.
 *   2. Banned English words and phrases that read as AI-generated filler.
 *   3. Banned Bangla words and phrases that read as AI-generated filler.
 *
 * Scope:
 *   - .js, .jsx, .ts, .tsx, .html, .md, .mjs
 *   - skips: node_modules, .next, dist, dist_deploy, .git, functions/lib,
 *            coverage, build, .cache, .firebase
 *
 * Output:
 *   - file:line:col: matched-string  (one per violation)
 *   - exits 0 on clean, 1 on any violation
 *
 * Use:
 *   node scripts/lint-no-ai-punctuation.mjs
 *   npm run lint:copy
 */

import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative, resolve } from "node:path";

const ROOT = resolve(process.cwd());

const ALLOWED_EXTS = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".html",
  ".md",
  ".mjs",
  ".cjs"
]);

const SKIP_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  "dist",
  "dist_deploy",
  "build",
  "coverage",
  ".cache",
  ".firebase",
  ".vercel",
  "functions/lib",
  // Next.js static export and dev server output. These are minified bundles
  // that contain third-party code we do not author (e.g. the SVG `seamless`
  // attribute name in a polyfill). Lint only applies to code we ship as src.
  "out",
  ".next",
  // Browser-profile dumps captured by the agent. These are raw Edge / Chrome
  // extension payloads full of mojibake, not human-authored source. We do not
  // lint them; the policy applies to code and copy we ship.
  "artifacts",
  "edge-profile",
  "edge-profile-public",
  "edge-profile-public-2",
  "edge-profile-public-3",
  "edge-profile-public-4",
  "edge-profile-lms",
  "edge-profile-lms-2",
  "firefox-profile",
  "chrome-profile",
  ".playwright-mcp"
]);

// Punctuation that does not belong in human-facing copy we ship to users.
const PUNCT_RULES = [
  { name: "em dash", pattern: /\u2014/g },
  { name: "en dash", pattern: /\u2013/g }
];

// English AI-tell phrases and words. Whole-word matched to avoid false
// positives in identifiers, URLs, etc.
const EN_RULES = [
  { name: "banned: 'delve'", pattern: /\b(delve|delves|delved|delving)\b/gi },
  { name: "banned: 'leverage'", pattern: /\b(leverage|leverages|leveraged|leveraging)\b/gi },
  { name: "banned: 'robust'", pattern: /\b(robust)\b/gi },
  { name: "banned: 'seamless'", pattern: /\b(seamless|seamlessly)\b/gi },
  { name: "banned: 'elevate'", pattern: /\b(elevate|elevates|elevated|elevating|elevation)\b/gi },
  { name: "banned: 'moreover'", pattern: /\b(moreover)\b/gi },
  { name: "banned: 'furthermore'", pattern: /\b(furthermore)\b/gi },
  { name: "banned: 'in conclusion'", pattern: /\b(in conclusion)\b/gi },
  { name: "banned: 'in today's world'", pattern: /\b(in today'?s world)\b/gi },
  { name: "banned: 'game-changer'", pattern: /\b(game[- ]?changer|game[- ]?changing)\b/gi },
  { name: "banned: 'it's worth noting'", pattern: /\b(it'?s worth noting)\b/gi },
  { name: "banned: 'unlock'", pattern: /\b(unlock|unlocks|unlocking|unlocked)\b/gi },
  { name: "banned: 'empower'", pattern: /\b(empower|empowers|empowered|empowering)\b/gi },
  { name: "banned: 'cutting-edge'", pattern: /\b(cutting[- ]edge)\b/gi },
  { name: "banned: 'state-of-the-art'", pattern: /\b(state[- ]of[- ]the[- ]art)\b/gi },
  { name: "banned: 'revolutionize'", pattern: /\b(revolutioniz(e|ed|es|ing))\b/gi },
  { name: "banned: 'in the realm of'", pattern: /\b(in the realm of)\b/gi }
];

// Bangla AI-tell phrases. Matched literally, no word-boundary tricks.
const BN_RULES = [
  { name: "banned: 'আজকের যুগে'", pattern: /আজকের যুগে/g },
  { name: "banned: 'ডিজিটাল বাংলাদেশ'", pattern: /ডিজিটাল বাংলাদেশ/g },
  { name: "banned: 'স্বপ্নের প্ল্যাটফর্ম'", pattern: /স্বপ্নের প্ল্যাটফর্ম/g },
  { name: "banned: 'গেম চেঞ্জার'", pattern: /গেম চেঞ্জার/g },
  { name: "banned: 'যুগান্তকারী'", pattern: /যুগান্তকারী/g },
  { name: "banned: 'অত্যাধুনিক'", pattern: /অত্যাধুনিক/g },
  { name: "banned: 'সর্বাধুনিক'", pattern: /সর্বাধুনিক/g },
  { name: "banned: 'এক কথায়'", pattern: /এক কথায়/g },
  { name: "banned: 'এক নজরে'", pattern: /এক নজরে/g }
];

const ALL_RULES = [...PUNCT_RULES, ...EN_RULES, ...BN_RULES];

// Files where the banned words appear as code identifiers, env names, or
// third-party content. We do not lint these.
const SKIP_FILES = new Set([
  // Lockfiles and dependency manifests can mention any package name.
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  // The lint script itself lists every banned word as a string literal in
  // its rule table. We do not want to flag our own rule definitions.
  "lint-no-ai-punctuation.mjs"
]);

async function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = await walk(full);
      out.push(...nested);
    } else if (entry.isFile()) {
      const ext = entry.name.slice(entry.name.lastIndexOf("."));
      if (!ALLOWED_EXTS.has(ext)) continue;
      if (SKIP_FILES.has(entry.name)) continue;
      out.push(full);
    }
  }
  return out;
}

function lineColFromIndex(source, index) {
  let line = 1;
  let col = 1;
  for (let i = 0; i < index; i += 1) {
    if (source.charCodeAt(i) === 10) {
      line += 1;
      col = 1;
    } else {
      col += 1;
    }
  }
  return { line, col };
}

function snippet(source, index, length = 40) {
  const start = Math.max(0, index - 10);
  const end = Math.min(source.length, index + length);
  return source.slice(start, end).replace(/\s+/g, " ").trim();
}

async function scanFile(filePath) {
  const source = await readFile(filePath, "utf8");
  const hits = [];
  for (const rule of ALL_RULES) {
    rule.pattern.lastIndex = 0;
    let match;
    while ((match = rule.pattern.exec(source)) !== null) {
      const { line, col } = lineColFromIndex(source, match.index);
      hits.push({
        rule: rule.name,
        match: match[0],
        line,
        col,
        context: snippet(source, match.index)
      });
    }
  }
  return hits;
}

async function main() {
  const files = await walk(ROOT);
  let totalViolations = 0;
  const offendersByFile = new Map();

  for (const file of files) {
    const hits = await scanFile(file);
    if (hits.length === 0) continue;
    offendersByFile.set(file, hits);
    totalViolations += hits.length;
  }

  if (totalViolations === 0) {
    console.log(
      `lint:copy OK. Scanned ${files.length} files, 0 AI-tell violations.`
    );
    process.exit(0);
  }

  console.error(
    `lint:copy FAIL. ${totalViolations} AI-tell violation(s) in ${offendersByFile.size} file(s).`
  );
  for (const [file, hits] of offendersByFile) {
    const rel = relative(ROOT, file);
    for (const hit of hits) {
      console.error(
        `  ${rel}:${hit.line}:${hit.col}  ${hit.rule}  -> "${hit.match}"  | …${hit.context}…`
      );
    }
  }
  console.error(
    "\nFix: replace em/en dash with comma, colon, or period. Replace banned words with concrete language. See scripts/lint-no-ai-punctuation.mjs for the full banned list."
  );
  process.exit(1);
}

main().catch((err) => {
  console.error("lint:copy crashed:", err);
  process.exit(2);
});
