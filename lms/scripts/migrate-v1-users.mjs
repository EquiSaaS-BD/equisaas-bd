import path from "node:path";
import { fileURLToPath } from "node:url";
import { DEPARTMENT_OPTIONS, getParentDepartmentId } from "../lib/catalog.js";
import { listDocuments, patchDocument } from "./shared/firebase-cli-rest.mjs";

const __filename = fileURLToPath(import.meta.url);

const LEGACY_ROLE_MAP = {
  "super-admin": "super_admin",
  super_admin: "super_admin",
  admin: "director",
  director: "director",
  "core-management": "director",
  "department-manager": "department_head",
  department_head: "department_head",
  "squad-lead": "mentor",
  mentor: "mentor",
  member: "member",
};

const LEGACY_DEPARTMENT_MAP = {
  frontend: "frontend",
  backend: "backend",
  devops: "devopsqa",
  "devops-qa": "devopsqa",
  devopsqa: "devopsqa",
  ux: "uiux",
  uiux: "uiux",
  graphic: "design",
  "graphic-social": "design",
  design: "design",
  ba: "baagile",
  "business-analyst": "baagile",
  baagile: "baagile",
  pm: "pm",
  "product-management": "pm",
  marketing: "marketing",
  growth: "marketing",
  "digital-marketing": "marketing",
  success: "crmcs",
  crmcs: "crmcs",
  "crm-customer-success": "crmcs",
};

const CANONICAL_DEPARTMENT_IDS = new Set(DEPARTMENT_OPTIONS.map((item) => item.id));

const normalizeRole = (value, roles = []) => {
  const candidates = [value, ...(Array.isArray(roles) ? roles : [])].filter(Boolean);
  for (const candidate of candidates) {
    if (LEGACY_ROLE_MAP[candidate]) {
      return LEGACY_ROLE_MAP[candidate];
    }
  }
  return "member";
};

const normalizeDepartmentId = (data) => {
  if (CANONICAL_DEPARTMENT_IDS.has(data.departmentId)) {
    return data.departmentId;
  }
  if (data.subdepartmentId && LEGACY_DEPARTMENT_MAP[data.subdepartmentId]) {
    return LEGACY_DEPARTMENT_MAP[data.subdepartmentId];
  }
  if (data.departmentId && LEGACY_DEPARTMENT_MAP[data.departmentId]) {
    return LEGACY_DEPARTMENT_MAP[data.departmentId];
  }
  return "";
};

const normalizeStatus = (value) => {
  return ["active", "probation", "paused"].includes(value) ? value : "active";
};

export const migrateUsersToV1 = async () => {
  const users = await listDocuments("users");
  const memberCountByDepartment = Object.fromEntries(DEPARTMENT_OPTIONS.map((item) => [item.id, 0]));

  for (const user of users) {
    const departmentId = normalizeDepartmentId(user);
    const parentDepartmentId = departmentId ? getParentDepartmentId(departmentId) : "";
    const role = normalizeRole(user.role, user.roles);
    const totalPoints = Number(user.totalPoints || user.coopPoints || 0);

    if (departmentId) {
      memberCountByDepartment[departmentId] += 1;
    }

    await patchDocument(`users/${user.id}`, {
      uid: user.uid || user.id,
      email: user.email || "",
      fullName: user.fullName || user.displayName || user.email || "EquiSaaS Member",
      displayName: user.displayName || user.fullName || user.email || "EquiSaaS Member",
      photoURL: user.photoURL || user.avatarUrl || "",
      role,
      status: normalizeStatus(user.status),
      departmentId,
      parentDepartmentId,
      totalPoints,
      completedTaskCount: Number(user.completedTaskCount || 0),
      currentStage: user.currentStage || "week1_foundations",
      joinedAt: user.joinedAt || user.memberSince || user.createdAt || new Date().toISOString(),
      joinDate: user.joinDate || user.joinedAt || user.memberSince || user.createdAt || new Date().toISOString(),
      isActive: user.isActive === false ? false : true,
      legacyDepartmentId: user.departmentId || "",
      legacySubdepartmentId: user.subdepartmentId || "",
      updatedAt: new Date().toISOString(),
    });
  }

  for (const department of DEPARTMENT_OPTIONS) {
    await patchDocument(`departments/${department.id}`, {
      memberCount: memberCountByDepartment[department.id] || 0,
      updatedAt: new Date().toISOString(),
    });
  }

  return {
    migratedUsers: users.length,
    memberCountByDepartment,
  };
};

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === __filename;

if (isDirectRun) {
  migrateUsersToV1()
    .then((result) => {
      console.log(`Migrated ${result.migratedUsers} user documents to LMS V1.`);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
