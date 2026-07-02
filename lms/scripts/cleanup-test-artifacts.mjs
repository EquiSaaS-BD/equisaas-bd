import { DEPARTMENT_OPTIONS } from "../lib/catalog.js";
import { deleteAuthUser, deleteDocument, listDocuments, lookupAuthUserByEmail, patchDocument } from "./shared/firebase-cli-rest.mjs";

const isSmokeArtifact = (value) => {
  const text = String(value || "").toLowerCase();
  return text.includes("smoke-final-") || text.includes("temp approver");
};

const userMatches = (user) =>
  isSmokeArtifact(user.email) ||
  isSmokeArtifact(user.displayName) ||
  isSmokeArtifact(user.fullName);

const main = async () => {
  const [users, submissions, pointsLedger, attendance] = await Promise.all([
    listDocuments("users"),
    listDocuments("submissions"),
    listDocuments("pointsLedger"),
    listDocuments("attendance"),
  ]);

  const smokeUsers = users.filter(userMatches);
  const smokeUserIds = new Set(smokeUsers.map((item) => item.id));
  const smokeEmails = new Set(smokeUsers.map((item) => item.email).filter(Boolean));

  const relatedSubmissions = submissions.filter(
    (item) => smokeUserIds.has(item.userId) || isSmokeArtifact(item.userDisplayName),
  );
  const relatedSubmissionIds = new Set(relatedSubmissions.map((item) => item.id));

  const relatedLedger = pointsLedger.filter(
    (item) =>
      smokeUserIds.has(item.userId) ||
      smokeUserIds.has(item.approvedBy) ||
      relatedSubmissionIds.has(item.sourceId) ||
      isSmokeArtifact(item.note),
  );

  const relatedAttendance = attendance.filter(
    (item) =>
      smokeUserIds.has(item.userId) ||
      smokeUserIds.has(item.recordedBy) ||
      isSmokeArtifact(item.eventTitle),
  );

  for (const item of relatedLedger) {
    await deleteDocument(`pointsLedger/${item.id}`);
  }

  for (const item of relatedAttendance) {
    await deleteDocument(`attendance/${item.id}`);
  }

  for (const item of relatedSubmissions) {
    await deleteDocument(`submissions/${item.id}`);
  }

  for (const item of smokeUsers) {
    await deleteDocument(`users/${item.id}`);
  }

  for (const email of smokeEmails) {
    const authUser = await lookupAuthUserByEmail(email);
    if (authUser?.localId) {
      await deleteAuthUser(authUser.localId);
    }
  }

  const remainingUsers = (await listDocuments("users")).filter((item) => item.isActive !== false);
  for (const department of DEPARTMENT_OPTIONS) {
    const memberCount = remainingUsers.filter((item) => item.departmentId === department.id).length;
    await patchDocument(`departments/${department.id}`, {
      memberCount,
      updatedAt: new Date().toISOString(),
    });
  }

  console.log(JSON.stringify({
    deletedUsers: smokeUsers.map((item) => ({ id: item.id, email: item.email })),
    deletedSubmissions: relatedSubmissions.map((item) => item.id),
    deletedLedgerEntries: relatedLedger.map((item) => item.id),
    deletedAttendanceEntries: relatedAttendance.map((item) => item.id),
  }, null, 2));
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
