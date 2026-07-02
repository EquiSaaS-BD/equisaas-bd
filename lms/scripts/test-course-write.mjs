import { closeAdminApp, db, FieldValue } from "./shared/admin-app.mjs";

console.log("writing test course...");
await db.collection("courses").doc("debug-course").set({ ok: true, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
console.log("done");
await closeAdminApp();
