import { closeAdminApp, db, FieldValue } from "./shared/admin-app.mjs";

console.log("writing test roadmap...");
await db.collection("lmsRoadmaps").doc("debug-test").set({ ok: true, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
console.log("done");
await closeAdminApp();
