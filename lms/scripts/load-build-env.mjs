#!/usr/bin/env node
/**
 * Stage NEXT_PUBLIC_* env values for `next build` from the single repo root
 * `.env` file. Next.js auto-loads .env, .env.development, .env.production,
 * and their .local siblings from the project root. We stage the values we
 * need into `lms/.env.production.local` because:
 *   - that filename wins over the committed `.env.production` at build time;
 *   - the `.local` suffix keeps it git-ignored automatically;
 *   - the static-export build does not inherit parent `process.env` mutations
 *     across the `next build` worker boundary, so writing the keys to disk is
 *     the only reliable channel.
 *
 * This script is the bridge between "one .env at the repo root" and the
 * "Next.js wants its own per-project .env.local" reality. The actual values
 * live in `/.env` (git-ignored). See `/.env.example` for the template.
 */
import { readFileSync, writeFileSync, existsSync, unlinkSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const lmsRoot = resolve(here, "..");
const repoRoot = resolve(lmsRoot, "..");
const rootEnvFile = resolve(repoRoot, ".env");
const staleBuildEnvFile = resolve(lmsRoot, ".env.build");
const stagedFile = resolve(lmsRoot, ".env.production.local");

if (!existsSync(rootEnvFile)) {
  console.error(
    "[lms build-env] Repo root .env not found. Create it from .env.example before running next build.",
  );
  process.exit(1);
}

if (existsSync(staleBuildEnvFile)) {
  unlinkSync(staleBuildEnvFile);
  console.log("[lms build-env] removed legacy lms/.env.build (superseded by repo root .env).");
}

const raw = readFileSync(rootEnvFile, "utf8");
const lines = raw.split(/\r?\n/);
const staged = [];
let loaded = 0;
let skipped = 0;
let kept = 0;
let droppedNonPublic = 0;

const ALLOWED_PREFIXES = ["NEXT_PUBLIC_", "VAPID_", "CLARITY_"];

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) {
    skipped += 1;
    continue;
  }
  const eq = trimmed.indexOf("=");
  if (eq === -1) {
    skipped += 1;
    continue;
  }
  const key = trimmed.slice(0, eq).trim();
  let value = trimmed.slice(eq + 1).trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }
  if (!key) {
    skipped += 1;
    continue;
  }

  const isPublic = ALLOWED_PREFIXES.some((prefix) => key.startsWith(prefix));
  if (!isPublic) {
    droppedNonPublic += 1;
    continue;
  }

  if (key in process.env && process.env[key]) {
    kept += 1;
    continue;
  }

  staged.push(`${key}=${value}`);
  loaded += 1;
}

writeFileSync(stagedFile, staged.join("\n") + (staged.length > 0 ? "\n" : ""), "utf8");

const activeKeys = staged
  .map((l) => l.split("=")[0])
  .filter((k) => k.startsWith("NEXT_PUBLIC_") || k.startsWith("VAPID_") || k.startsWith("CLARITY_"))
  .sort();
console.log(
  `[lms build-env] read ${loaded + skipped + droppedNonPublic} line(s) from ${rootEnvFile}.`,
);
console.log(
  `[lms build-env] staged ${loaded}, kept ${kept} from process.env, dropped ${droppedNonPublic} non-public, skipped ${skipped} comments/blank.`,
);
console.log(`[lms build-env] staged -> lms/.env.production.local for next build.`);
if (activeKeys.length > 0) {
  console.log(`[lms build-env] active build keys: ${activeKeys.join(", ")}`);
}

