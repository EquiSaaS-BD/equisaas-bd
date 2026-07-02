import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const versionId = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
const payload = {
  version: `eqbd-${versionId}`,
  builtAt: new Date().toISOString(),
};

const targets = [
  path.join(root, "landing", "public", "version.json"),
  path.join(root, "lms", "public", "version.json"),
];

for (const target of targets) {
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

console.log(`Wrote build version ${payload.version}`);
