import fs from "node:fs";
import path from "node:path";

const TITLE_MIN = 25;
const TITLE_MAX = 65;
const DESCRIPTION_MIN = 110;
const DESCRIPTION_MAX = 165;

const root = process.cwd();

const checks = [
  {
    label: "Landing home",
    file: "landing/index.html",
    type: "html",
  },
  {
    label: "Founder page",
    file: "landing/founder/index.html",
    type: "html",
  },
  {
    label: "Software training page",
    file: "landing/software-training-bangladesh/index.html",
    type: "html",
  },
  {
    label: "SME software page",
    file: "landing/sme-software-bangladesh/index.html",
    type: "html",
  },
  {
    label: "Open tech page",
    file: "landing/open-tech-cooperative-bangladesh/index.html",
    type: "html",
  },
  {
    label: "Orientation page",
    file: "landing/orientation-2026/index.html",
    type: "html",
  },
  {
    label: "LMS layout default",
    file: "lms/app/layout.js",
    type: "js",
    titlePattern: /default:\s*"([^"]+)"/,
    descriptionPattern: /description:\s*"([^"]+)"/,
  },
  {
    label: "LMS home",
    file: "lms/app/page.js",
    type: "js",
    titlePattern: /title:\s*"([^"]+)"/,
    descriptionPattern: /description:\s*"([^"]+)"/,
  },
];

const issues = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function extractHtml(text) {
  return {
    title: (text.match(/<title\b[^>]*>([^<]+)<\/title>/i) || [null, ""])[1],
    description:
      (text.match(/<meta\b[^>]*name="description"[^>]*content="([^"]*)"/i) || [null, ""])[1] ||
      (text.match(/<meta\b[^>]*content="([^"]*)"[^>]*name="description"/i) || [null, ""])[1],
  };
}

function extractJs(text, titlePattern, descriptionPattern) {
  return {
    title: (text.match(titlePattern) || [null, ""])[1],
    description: (text.match(descriptionPattern) || [null, ""])[1],
  };
}

function validate(label, metric, value, min, max) {
  const length = value.length;
  if (!value) {
    issues.push({ label, metric, length, problem: "missing" });
    return;
  }
  if (length < min || length > max) {
    issues.push({
      label,
      metric,
      length,
      problem: length < min ? "too_short" : "too_long",
      value,
    });
  }
}

for (const check of checks) {
  const text = read(check.file);
  const extracted =
    check.type === "html"
      ? extractHtml(text)
      : extractJs(text, check.titlePattern, check.descriptionPattern);

  validate(check.label, "title", extracted.title, TITLE_MIN, TITLE_MAX);
  validate(check.label, "description", extracted.description, DESCRIPTION_MIN, DESCRIPTION_MAX);
}

if (issues.length) {
  console.log(JSON.stringify({ ok: false, thresholds: { TITLE_MIN, TITLE_MAX, DESCRIPTION_MIN, DESCRIPTION_MAX }, issues }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      thresholds: { TITLE_MIN, TITLE_MAX, DESCRIPTION_MIN, DESCRIPTION_MAX },
      checked: checks.map((item) => item.label),
    },
    null,
    2,
  ),
);
