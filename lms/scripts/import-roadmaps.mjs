import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { closeAdminApp, db, FieldValue } from "./shared/admin-app.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatePath = path.join(__dirname, "..", "roadmaps-template.json");

const run = async () => {
  console.log("Loading roadmap template...");
  const raw = await readFile(templatePath, "utf8");
  const template = JSON.parse(raw);
  const roadmaps = Array.isArray(template.roadmaps) ? template.roadmaps : [];
  console.log(`Found ${roadmaps.length} roadmaps.`);

  let total = 0;
  const batch = db.batch();

  console.log("Writing roadmaps to Firestore...");
  for (const roadmap of roadmaps) {
    if (!roadmap?.subdeptId) continue;
    const payload = {
      subdeptId: roadmap.subdeptId,
      deptId: roadmap.deptId || "",
      paths: roadmap.paths || [],
      monthlyActivities: roadmap.monthlyActivities || [],
      updatedAt: FieldValue.serverTimestamp()
    };
    const ref = db.collection("lmsRoadmaps").doc(roadmap.subdeptId);
    batch.set(ref, payload, { merge: true });
    total += 1;
  }

  await batch.commit();

  console.log(`Imported ${total} roadmaps.`);
  await closeAdminApp();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
