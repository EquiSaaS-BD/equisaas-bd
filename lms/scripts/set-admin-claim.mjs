import path from "node:path";
import { fileURLToPath } from "node:url";
import { getParentDepartmentId } from "../lib/catalog.js";
import { getDocument, lookupAuthUserByEmail, patchDocument, updateAuthUser } from "./shared/firebase-cli-rest.mjs";

const __filename = fileURLToPath(import.meta.url);

const getArg = (flag) => {
  const idx = process.argv.indexOf(flag);
  if (idx === -1 || idx + 1 >= process.argv.length) return null;
  return process.argv[idx + 1];
};

const toKnownRoles = (value) =>
  [...new Set(
    (Array.isArray(value) ? value : [value])
      .map((roleId) => String(roleId || "").trim())
      .filter((roleId) => ["super_admin", "director", "department_head", "mentor", "member"].includes(roleId)),
  )];

export const assignSuperAdminByEmail = async (email) => {
  const authUser = await lookupAuthUserByEmail(email);
  if (!authUser?.localId) {
    throw new Error(`No Firebase Auth user found for ${email}.`);
  }

  const existingUser = await getDocument(`users/${authUser.localId}`);
  const mergedRoles = [...new Set(["super_admin", ...toKnownRoles(existingUser?.roles), ...toKnownRoles(existingUser?.role)])];
  await patchDocument(`users/${authUser.localId}`, {
    uid: authUser.localId,
    email,
    fullName: existingUser?.fullName || authUser.displayName || email,
    displayName: existingUser?.displayName || authUser.displayName || email,
    photoURL: existingUser?.photoURL || authUser.photoUrl || "",
    role: "super_admin",
    roles: mergedRoles,
    status: existingUser?.status || "active",
    departmentId: existingUser?.departmentId || "",
    parentDepartmentId: existingUser?.parentDepartmentId || getParentDepartmentId(existingUser?.departmentId || ""),
    totalPoints: Number(existingUser?.totalPoints || existingUser?.coopPoints || 0),
    completedTaskCount: Number(existingUser?.completedTaskCount || 0),
    currentStage: existingUser?.currentStage || "week1_foundations",
    isActive: existingUser?.isActive === false ? false : true,
    joinedAt: existingUser?.joinedAt || existingUser?.memberSince || existingUser?.createdAt || new Date().toISOString(),
    joinDate: existingUser?.joinDate || existingUser?.joinedAt || existingUser?.memberSince || existingUser?.createdAt || new Date().toISOString(),
    coreTeam: true,
    updatedAt: new Date().toISOString(),
  });

  await updateAuthUser({
    localId: authUser.localId,
    customAttributes: {
      admin: true,
      role: "super_admin",
      systemOverride: true,
    },
    displayName: authUser.displayName || existingUser?.displayName || email,
  });

  return authUser.localId;
};

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === __filename;

if (isDirectRun) {
  const emailArg = getArg("--email");
  if (!emailArg) {
    console.error("Usage: node lms/scripts/set-admin-claim.mjs --email <EMAIL>");
    process.exit(1);
  }

  assignSuperAdminByEmail(emailArg)
    .then((uid) => {
      console.log(`Super admin assigned to ${emailArg} (${uid}).`);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
