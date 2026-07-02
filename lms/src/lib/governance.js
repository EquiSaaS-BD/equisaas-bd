import { PATHS } from "@/data/structure.mjs";

export const ROLE_IDS = [
  "super-admin",
  "admin",
  "core-management",
  "department-manager",
  "squad-lead",
  "member",
];

export const MANAGEMENT_ROLE_IDS = [
  "super-admin",
  "admin",
  "core-management",
  "department-manager",
  "squad-lead",
];

export const SCOPE_TYPES = ["global", "department", "subdepartment", "path", "squad"];

export const MANAGEMENT_PERMISSIONS = [
  "view-progress",
  "view-member-report",
  "view-department-report",
  "create-task",
  "edit-task",
  "review-task",
  "approve-task",
  "request-revision",
  "view-audit",
  "export-report",
];

export const DEFAULT_SCOPE_SUMMARY = Object.freeze({
  global: false,
  departmentIds: [],
  subdepartmentIds: [],
  pathIds: [],
  squadIds: [],
});

export const DEFAULT_ROLE_PERMISSIONS = {
  "super-admin": [...MANAGEMENT_PERMISSIONS],
  admin: [...MANAGEMENT_PERMISSIONS],
  "core-management": [
    "view-progress",
    "view-member-report",
    "view-department-report",
    "create-task",
    "edit-task",
    "review-task",
    "approve-task",
    "request-revision",
    "view-audit",
    "export-report",
  ],
  "department-manager": [
    "view-progress",
    "view-member-report",
    "view-department-report",
    "create-task",
    "edit-task",
    "review-task",
    "approve-task",
    "request-revision",
    "export-report",
  ],
  "squad-lead": [
    "view-progress",
    "view-member-report",
    "create-task",
    "review-task",
    "request-revision",
  ],
  member: [],
};

const ROLE_PRIORITY = {
  "super-admin": 600,
  admin: 500,
  "core-management": 400,
  "department-manager": 300,
  "squad-lead": 200,
  member: 100,
};

const toUniqueStrings = (value) =>
  Array.from(
    new Set(
      (Array.isArray(value) ? value : [value])
        .map((item) => String(item || "").trim())
        .filter(Boolean),
    ),
  );

export const normalizeScopeSummary = (value = {}) => ({
  global: Boolean(value?.global),
  departmentIds: toUniqueStrings(value?.departmentIds),
  subdepartmentIds: toUniqueStrings(value?.subdepartmentIds),
  pathIds: toUniqueStrings(value?.pathIds),
  squadIds: toUniqueStrings(value?.squadIds),
});

const sortRoles = (roles) =>
  [...toUniqueStrings(roles)].sort((left, right) => (ROLE_PRIORITY[right] || 0) - (ROLE_PRIORITY[left] || 0));

export const normalizeRoles = (userData = {}, claimsAdmin = false) => {
  const roles = sortRoles([
    ...(Array.isArray(userData?.roles) ? userData.roles : []),
    userData?.role,
    userData?.admin ? "admin" : "",
    claimsAdmin ? "admin" : "",
  ]);

  return roles.length ? roles : ["member"];
};

export const getPrimaryRole = (userData = {}, claimsAdmin = false) => normalizeRoles(userData, claimsAdmin)[0] || "member";

export const hasAnyRole = (userData = {}, roles = [], claimsAdmin = false) => {
  const expected = new Set(toUniqueStrings(roles));
  return normalizeRoles(userData, claimsAdmin).some((role) => expected.has(role));
};

export const isGlobalAdmin = (userData = {}, claimsAdmin = false) =>
  hasAnyRole(userData, ["super-admin", "admin"], claimsAdmin);

export const isManagementRole = (userData = {}, claimsAdmin = false) =>
  hasAnyRole(userData, MANAGEMENT_ROLE_IDS, claimsAdmin);

export const canManageScopes = (userData = {}, claimsAdmin = false) =>
  hasAnyRole(userData, ["super-admin", "admin"], claimsAdmin);

export const canCreateScopedTasks = (userData = {}, claimsAdmin = false) =>
  isGlobalAdmin(userData, claimsAdmin) || hasAnyRole(userData, ["core-management", "department-manager", "squad-lead"], claimsAdmin);

export const canReviewScopedTasks = (userData = {}, claimsAdmin = false) =>
  isGlobalAdmin(userData, claimsAdmin) || hasAnyRole(userData, ["core-management", "department-manager", "squad-lead"], claimsAdmin);

export const canApproveScopedTasks = (userData = {}, claimsAdmin = false) =>
  isGlobalAdmin(userData, claimsAdmin) || hasAnyRole(userData, ["core-management", "department-manager"], claimsAdmin);

export const getRolePermissions = (userData = {}, claimsAdmin = false) => {
  const permissions = new Set();
  normalizeRoles(userData, claimsAdmin).forEach((role) => {
    (DEFAULT_ROLE_PERMISSIONS[role] || []).forEach((permission) => permissions.add(permission));
  });
  return [...permissions];
};

export const getPathMeta = (pathId = "") => PATHS.find((item) => item.id === pathId) || null;

export const getPathTitles = (pathId = "") => {
  const pathMeta = getPathMeta(pathId);
  return {
    pathTitleBn: pathMeta?.titleBn || "",
    pathTitleEn: pathMeta?.titleEn || "",
  };
};

export const buildDefaultUserDoc = ({ authUser = null, current = {}, claimsAdmin = false } = {}) => {
  const roles = normalizeRoles(current, claimsAdmin);
  const role = roles[0] || "member";
  const pathId = current?.pathId || "";
  const scopeSummary = normalizeScopeSummary(current?.scopeSummary);

  if (role === "super-admin" || role === "admin") {
    scopeSummary.global = true;
  }

  return {
    uid: current?.uid || authUser?.uid || "",
    displayName: current?.displayName || authUser?.displayName || authUser?.email || "EquiSaaS Member",
    email: current?.email || authUser?.email || "",
    avatarUrl: current?.avatarUrl || authUser?.photoURL || "",
    role,
    roles,
    status: current?.status || "active",
    districtId: current?.districtId || "",
    departmentId: current?.departmentId || "",
    subdepartmentId: current?.subdepartmentId || "",
    pathId,
    squadId: current?.squadId ?? null,
    coopPoints: Number(current?.coopPoints || 0),
    trustScore: Number(current?.trustScore || 0),
    badges: toUniqueStrings(current?.badges),
    coreTeam: Boolean(current?.coreTeam || roles.some((item) => item !== "member")),
    managementScopeIds: toUniqueStrings(current?.managementScopeIds),
    scopeSummary,
    memberSince: current?.memberSince || null,
    lastActiveAt: current?.lastActiveAt || null,
    createdAt: current?.createdAt || null,
    updatedAt: current?.updatedAt || null,
    ...getPathTitles(pathId),
  };
};

export const buildPublicProfilePayload = ({
  user,
  profile,
  selectedPath,
  earnedBadgeIds = [],
  publicStats = {},
} = {}) => {
  if (!user) return null;

  const pathId = profile?.pathId || selectedPath?.id || "";
  const pathTitles = selectedPath
    ? { pathTitleBn: selectedPath.titleBn || "", pathTitleEn: selectedPath.titleEn || "" }
    : getPathTitles(pathId);

  return {
    userId: user.uid,
    displayName: profile?.displayName || user.displayName || user.email || "EquiSaaS Member",
    avatarUrl: profile?.avatarUrl || user.photoURL || "",
    departmentId: profile?.departmentId || "",
    subdepartmentId: profile?.subdepartmentId || "",
    pathId,
    ...pathTitles,
    squadTitleEn:
      profile?.squadTitleEn ||
      profile?.squadTitle ||
      (pathTitles.pathTitleEn ? `${pathTitles.pathTitleEn} Squad` : ""),
    squadTitleBn:
      profile?.squadTitleBn ||
      profile?.squadTitle ||
      (pathTitles.pathTitleBn ? `${pathTitles.pathTitleBn} স্কোয়াড` : ""),
    districtId: profile?.districtId || "",
    badges: toUniqueStrings(earnedBadgeIds),
    certificateCount: Number(publicStats?.certificateCount || 0),
    coopPoints: Number(publicStats?.coopPoints || 0),
    trustScore: Number(publicStats?.trustScore || 0),
    featuredCredentialTitle: publicStats?.latestCredential?.title || null,
    featuredCredentialLevel: publicStats?.latestCredential?.level || null,
    featuredCredentialIssuedAt: publicStats?.latestCredential?.issuedAt || null,
  };
};

export const buildScopeSummaryFromScopes = (scopes = []) => {
  const next = {
    global: false,
    departmentIds: [],
    subdepartmentIds: [],
    pathIds: [],
    squadIds: [],
  };

  scopes
    .filter((scope) => scope?.status !== "revoked")
    .forEach((scope) => {
      if (scope?.scopeType === "global") next.global = true;
      next.departmentIds.push(scope?.departmentId || "");
      next.subdepartmentIds.push(scope?.subdepartmentId || "");
      next.pathIds.push(...toUniqueStrings(scope?.pathIds));
      next.squadIds.push(...toUniqueStrings(scope?.squadIds));
    });

  return normalizeScopeSummary(next);
};

export const entityInScope = (scopeSummary = DEFAULT_SCOPE_SUMMARY, entity = {}) => {
  const normalized = normalizeScopeSummary(scopeSummary);
  if (normalized.global) return true;

  const departmentId = String(entity?.departmentId || "");
  const subdepartmentId = String(entity?.subdepartmentId || "");
  const pathId = String(entity?.pathId || "");
  const squadId = String(entity?.squadId || "");

  return (
    normalized.departmentIds.includes(departmentId) ||
    normalized.subdepartmentIds.includes(subdepartmentId) ||
    normalized.pathIds.includes(pathId) ||
    normalized.squadIds.includes(squadId)
  );
};

export const taskIsAssignedToUser = (task = {}, userData = {}, claimsAdmin = false) => {
  if (isGlobalAdmin(userData, claimsAdmin)) return true;
  if (!task?.taskId) return false;
  const uid = String(userData?.uid || "");
  const explicitAssigneeIds = toUniqueStrings(task?.assigneeIds);
  if (uid && explicitAssigneeIds.includes(uid)) return true;

  const entity = {
    departmentId: userData?.departmentId || "",
    subdepartmentId: userData?.subdepartmentId || "",
    pathId: userData?.pathId || "",
    squadId: userData?.squadId || "",
  };

  switch (task?.assigneeScope) {
    case "department":
      return Boolean(entity.departmentId) && entity.departmentId === String(task?.departmentId || "");
    case "subdepartment":
      return Boolean(entity.subdepartmentId) && entity.subdepartmentId === String(task?.subdepartmentId || "");
    case "path":
      return Boolean(entity.pathId) && entity.pathId === String(task?.pathId || "");
    case "squad":
      return Boolean(entity.squadId) && entity.squadId === String(task?.squadId || "");
    case "member-list":
      return uid ? explicitAssigneeIds.includes(uid) : false;
    default:
      return entityInScope(normalizeScopeSummary(userData?.scopeSummary), task);
  }
};

export const getScopeCoverageLabel = (scope = {}, lang = "en") => {
  const pathIds = toUniqueStrings(scope?.pathIds);
  const squadIds = toUniqueStrings(scope?.squadIds);
  if (scope?.scopeType === "global") return lang === "bn" ? "পুরো প্ল্যাটফর্ম" : "Entire platform";
  if (scope?.scopeType === "department") return scope?.departmentId || (lang === "bn" ? "ডিপার্টমেন্ট" : "Department");
  if (scope?.scopeType === "subdepartment") return scope?.subdepartmentId || (lang === "bn" ? "সাবডিপার্টমেন্ট" : "Subdepartment");
  if (scope?.scopeType === "path") return pathIds.join(", ") || (lang === "bn" ? "পাথ" : "Path");
  if (scope?.scopeType === "squad") return squadIds.join(", ") || (lang === "bn" ? "স্কোয়াড" : "Squad");
  return lang === "bn" ? "নির্ধারিত নয়" : "Unassigned";
};

export const getRoleLabel = (role = "member", lang = "en") => {
  const map = {
    "super-admin": { en: "Super Admin", bn: "সুপার অ্যাডমিন" },
    admin: { en: "Admin", bn: "অ্যাডমিন" },
    "core-management": { en: "Core Management", bn: "কোর ম্যানেজমেন্ট" },
    "department-manager": { en: "Department Manager", bn: "ডিপার্টমেন্ট ম্যানেজার" },
    "squad-lead": { en: "Squad Lead", bn: "স্কোয়াড লিড" },
    member: { en: "Member", bn: "সদস্য" },
  };
  const entry = map[role] || map.member;
  return lang === "bn" ? entry.bn : entry.en;
};
