import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { closeAdminApp, db, FieldValue } from "./shared/admin-app.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const raw = await readFile(path.join(__dirname, "..", "roadmaps-template.json"), "utf8");
const template = JSON.parse(raw);
const roadmap = template.roadmaps[0];
console.log('writing test roadmap doc');
await db.collection('roadmapsTest').doc('debug').set({ ...roadmap, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
console.log('done');
await closeAdminApp();
