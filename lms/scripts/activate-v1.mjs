import { migrateUsersToV1 } from "./migrate-v1-users.mjs";
import { restoreLegacyResources } from "./restore-legacy-resources.mjs";
import { seedV1Content } from "./seed-v1-content.mjs";
import { assignSuperAdminByEmail } from "./set-admin-claim.mjs";
import { syncDepartmentCounts } from "./sync-department-counts.mjs";

const superAdminEmail = "kholifaahmadalamin@gmail.com";

const main = async () => {
  const seed = await seedV1Content();
  const legacy = await restoreLegacyResources();
  const migration = await migrateUsersToV1();
  const departmentCounts = await syncDepartmentCounts();
  const superAdminUid = await assignSuperAdminByEmail(superAdminEmail);

  console.log(
    JSON.stringify(
      {
        status: "ok",
        superAdminEmail,
        superAdminUid,
        departmentCounts,
        migration,
        legacy,
        seed,
      },
      null,
      2,
    ),
  );
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
