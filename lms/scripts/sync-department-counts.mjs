import path from "node:path";
import { fileURLToPath } from "node:url";
import { DEPARTMENT_OPTIONS } from "../lib/catalog.js";
import { listDocuments, patchDocument } from "./shared/firebase-cli-rest.mjs";

const __filename = fileURLToPath(import.meta.url);

export const syncDepartmentCounts = async () => {
  const users = await listDocuments("users");
  const counts = Object.fromEntries(DEPARTMENT_OPTIONS.map((item) => [item.id, 0]));

  for (const user of users) {
    if (user?.isActive === false) continue;
    const departmentId = String(user?.departmentId || "");
    if (!Object.prototype.hasOwnProperty.call(counts, departmentId)) continue;
    counts[departmentId] += 1;
  }

  for (const department of DEPARTMENT_OPTIONS) {
    await patchDocument(`departments/${department.id}`, {
      memberCount: counts[department.id] || 0,
      updatedAt: new Date().toISOString(),
    });
  }

  return counts;
};

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === __filename;

if (isDirectRun) {
  syncDepartmentCounts()
    .then((counts) => {
      console.log(JSON.stringify({ status: "ok", counts }, null, 2));
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
