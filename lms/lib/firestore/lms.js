import {
  Timestamp,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import {
  DEPARTMENT_OPTIONS,
  canAwardPoints,
  getDepartmentMeta,
  getParentDepartmentId,
  getPrimaryRole,
  getRoleList,
} from "@/lib/catalog";
import { buildCertificateVerificationUrl } from "@/lib/urls";

export const buildSubmissionId = (taskId, uid) =>
  `${String(taskId || "").replace(/[^a-zA-Z0-9_-]/g, "_")}_${String(uid || "").replace(/[^a-zA-Z0-9_-]/g, "_")}`;

const mapDocs = (snap) => snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
const resolveComparableLabel = (item, fields = ["displayName", "title", "name", "resourceTitle", "taskTitle", "email", "id"]) => {
  for (const field of fields) {
    const nextValue = cleanText(item?.[field]);
    if (nextValue) return nextValue;
  }
  return "";
};
const sortDepartments = (items) =>
  [...items].sort((left, right) => {
    const leftOrder = Number(left.order || 999);
    const rightOrder = Number(right.order || 999);
    if (leftOrder !== rightOrder) return leftOrder - rightOrder;
    return String(left.name || left.title || left.id || "").localeCompare(
      String(right.name || right.title || right.id || ""),
    );
  });

const getActorId = (actor) => actor?.uid || actor?.user?.uid || "";
const getActorRole = (actor) => getPrimaryRole(actor);
const allAnnouncementScopeKeys = ["global", ...DEPARTMENT_OPTIONS.map((item) => `department:${item.id}`)];
const finalizedSubmissionStatuses = new Set(["approved", "rejected"]);
const BANGLADESH_UTC_OFFSET_MS = 6 * 60 * 60 * 1000;
const WEEK_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
const CERTIFICATE_STATUS_OPTIONS = new Set(["draft", "active", "revoked"]);
const CERTIFICATE_KIND_OPTIONS = new Set(["general", "workshop"]);
const DEFAULT_CERTIFICATE_SIGNER_NAME = "Sandipta Karmakar Barno";
const DEFAULT_CERTIFICATE_SIGNER_TITLE = "Director of HR & Operations";
const SCOPED_ROLE_OPTIONS = ["department_head", "mentor", "member"];
const CERTIFICATE_DEPARTMENT_CODES = {
  frontend: "FE",
  backend: "BE",
  devopsqa: "DQ",
  uiux: "UX",
  design: "GD",
  baagile: "BA",
  pm: "PM",
  marketing: "MK",
  crmcs: "CS",
};

const cleanText = (value) => String(value || "").trim();
const requireText = (value, message) => {
  const nextValue = cleanText(value);
  if (!nextValue) {
    throw new Error(message);
  }
  return nextValue;
};
const assertSuperAdminActor = (actor, message = "Only the highest access role can do this action.") => {
  const actorId = getActorId(actor);
  const actorRole = getActorRole(actor);
  if (!actorId || actorRole !== "super_admin") {
    throw new Error(message);
  }
  return actorId;
};

const ensureValidUrl = (value, message) => {
  const nextValue = cleanText(value);
  if (!nextValue) return "";

  try {
    const parsed = new URL(nextValue);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error("invalid protocol");
    }
    return parsed.href;
  } catch {
    throw new Error(message || "Enter a valid website link (e.g., https://example.com).");
  }
};

const normalizeDate = (value) => {
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? new Date() : value;
  }
  const nextDate = value ? new Date(value) : new Date();
  return Number.isNaN(nextDate.getTime()) ? new Date() : nextDate;
};

const getBangladeshWeekWindow = (value) => {
  const safeDate = normalizeDate(value);
  const bangladeshDate = new Date(safeDate.getTime() + BANGLADESH_UTC_OFFSET_MS);
  const bangladeshDayIndex = bangladeshDate.getUTCDay();
  const mondayOffset = bangladeshDayIndex === 0 ? 6 : bangladeshDayIndex - 1;
  const weekStartBangladesh = new Date(Date.UTC(
    bangladeshDate.getUTCFullYear(),
    bangladeshDate.getUTCMonth(),
    bangladeshDate.getUTCDate() - mondayOffset,
    0, 0, 0, 0,
  ));
  const weekEndBangladesh = new Date(weekStartBangladesh.getTime() + WEEK_DURATION_MS);
  return {
    weekKey: [
      weekStartBangladesh.getUTCFullYear(),
      String(weekStartBangladesh.getUTCMonth() + 1).padStart(2, "0"),
      String(weekStartBangladesh.getUTCDate()).padStart(2, "0"),
    ].join(""),
    weekStartsAt: new Date(weekStartBangladesh.getTime() - BANGLADESH_UTC_OFFSET_MS),
    weekEndsAt: new Date(weekEndBangladesh.getTime() - BANGLADESH_UTC_OFFSET_MS),
  };
};

const getBangladeshMonthWindow = (value) => {
  const safeDate = normalizeDate(value);
  const bangladeshDate = new Date(safeDate.getTime() + BANGLADESH_UTC_OFFSET_MS);
  const monthStartBangladesh = new Date(Date.UTC(
    bangladeshDate.getUTCFullYear(),
    bangladeshDate.getUTCMonth(),
    1, 0, 0, 0, 0,
  ));
  const monthEndBangladesh = new Date(Date.UTC(
    bangladeshDate.getUTCFullYear(),
    bangladeshDate.getUTCMonth() + 1,
    1, 0, 0, 0, 0,
  ));
  return {
    monthKey: [
      monthStartBangladesh.getUTCFullYear(),
      String(monthStartBangladesh.getUTCMonth() + 1).padStart(2, "0"),
    ].join(""),
    monthStartsAt: new Date(monthStartBangladesh.getTime() - BANGLADESH_UTC_OFFSET_MS),
    monthEndsAt: new Date(monthEndBangladesh.getTime() - BANGLADESH_UTC_OFFSET_MS),
  };
};

const applyLeaderboardDelta = (writer, departmentId, pointsDelta, dateValue) => {
  if (!departmentId || !pointsDelta) return;
  const { weekKey } = getBangladeshWeekWindow(dateValue);
  const { monthKey } = getBangladeshMonthWindow(dateValue);
  
  writer.set(doc(db, `departmentOverallLeaderboards/alltime/departments/${departmentId}`), {
    totalPoints: increment(pointsDelta),
    updatedAt: serverTimestamp(),
  }, { merge: true });
  writer.set(doc(db, `departmentMonthlyLeaderboards/${monthKey}/departments/${departmentId}`), {
    totalPoints: increment(pointsDelta),
    updatedAt: serverTimestamp(),
  }, { merge: true });
  writer.set(doc(db, `departmentLeaderboards/${weekKey}/departments/${departmentId}`), {
    totalPoints: increment(pointsDelta),
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

const sanitizePoints = (value) => {
  const nextValue = Number(value || 0);
  if (!Number.isFinite(nextValue)) return 0;
  return Math.max(0, Math.round(nextValue));
};

const buildManagedRoleList = (roleIds) => {
  const normalizedRoles = getRoleList(roleIds);
  return normalizedRoles.length ? normalizedRoles : ["member"];
};

const rolesRequireDepartment = (roleIds) =>
  buildManagedRoleList(roleIds).some((roleId) => SCOPED_ROLE_OPTIONS.includes(roleId));

const sanitizeTaskOrigin = (value) => {
  const nextValue = cleanText(value) || "self_initiated";
  return ["mentor_discord", "mentor_community", "mentor_direct", "self_initiated", "other"].includes(nextValue)
    ? nextValue
    : "self_initiated";
};

const buildCustomTaskKey = (title) => {
  const slug = cleanText(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 48);
  return `custom_${slug || "task"}_${Date.now().toString(36)}`;
};

const isIndexConstraintError = (error) => {
  const code = String(error?.code || "").toLowerCase();
  const message = String(error?.message || "").toLowerCase();

  return (
    code.includes("failed-precondition") ||
    code.includes("failed_precondition") ||
    message.includes("requires an index") ||
    message.includes("create it here")
  );
};

const limitItems = (items, count) => {
  const safeCount = Number(count);
  if (!Number.isFinite(safeCount) || safeCount < 0) {
    return [...items];
  }
  return items.slice(0, safeCount);
};

const sortByOrder = (items, fields = ["title", "name", "id"]) =>
  [...items].sort((left, right) => {
    const orderDelta = Number(left?.order || 999) - Number(right?.order || 999);
    if (orderDelta !== 0) return orderDelta;
    return resolveComparableLabel(left, fields).localeCompare(resolveComparableLabel(right, fields));
  });

const sortByDisplayName = (items) =>
  [...items].sort((left, right) =>
    resolveComparableLabel(left, ["displayName", "fullName", "email", "id"]).localeCompare(
      resolveComparableLabel(right, ["displayName", "fullName", "email", "id"]),
    ),
  );

const sortByDateField = (items, field, direction = "desc", labelFields = ["title", "resourceTitle", "displayName", "id"]) => {
  const missingTime = direction === "asc" ? Number.MAX_SAFE_INTEGER : 0;

  return [...items].sort((left, right) => {
    const leftTime = left?.[field] ? toValidDate(left[field]).getTime() : missingTime;
    const rightTime = right?.[field] ? toValidDate(right[field]).getTime() : missingTime;
    const timeDelta = direction === "asc" ? leftTime - rightTime : rightTime - leftTime;
    if (timeDelta !== 0) return timeDelta;
    return resolveComparableLabel(left, labelFields).localeCompare(resolveComparableLabel(right, labelFields));
  });
};

const sortByDateKeyField = (items, field, direction = "desc", labelFields = ["title", "recipientName", "id"]) =>
  [...items].sort((left, right) => {
    const leftKey = cleanText(left?.[field]);
    const rightKey = cleanText(right?.[field]);
    const keyDelta = direction === "asc" ? leftKey.localeCompare(rightKey) : rightKey.localeCompare(leftKey);
    if (keyDelta !== 0) return keyDelta;
    return resolveComparableLabel(left, labelFields).localeCompare(resolveComparableLabel(right, labelFields));
  });

async function getDocsWithIndexFallback(primaryRefFactory, { fallbackRefFactory = null, transform = (items) => items } = {}) {
  try {
    const primarySnap = await getDocs(primaryRefFactory());
    return transform(mapDocs(primarySnap));
  } catch (error) {
    if (!fallbackRefFactory || !isIndexConstraintError(error)) {
      throw error;
    }

    const fallbackSnap = await getDocs(fallbackRefFactory());
    return transform(mapDocs(fallbackSnap));
  }
}

const toValidDate = (value) => {
  if (value?.toDate) {
    const nextDate = value.toDate();
    return Number.isNaN(nextDate.getTime()) ? new Date() : nextDate;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? new Date() : value;
  }

  const nextDate = value ? new Date(value) : new Date();
  return Number.isNaN(nextDate.getTime()) ? new Date() : nextDate;
};

const buildBangladeshWeekWindow = (value = new Date()) => {
  const safeDate = toValidDate(value);
  const bangladeshDate = new Date(safeDate.getTime() + BANGLADESH_UTC_OFFSET_MS);
  const bangladeshDayIndex = bangladeshDate.getUTCDay();
  const mondayOffset = bangladeshDayIndex === 0 ? 6 : bangladeshDayIndex - 1;
  const weekStartBangladesh = new Date(Date.UTC(
    bangladeshDate.getUTCFullYear(),
    bangladeshDate.getUTCMonth(),
    bangladeshDate.getUTCDate() - mondayOffset,
    0,
    0,
    0,
    0,
  ));
  const weekEndBangladesh = new Date(weekStartBangladesh.getTime() + WEEK_DURATION_MS);
  const weekStartUtc = new Date(weekStartBangladesh.getTime() - BANGLADESH_UTC_OFFSET_MS);
  const weekEndUtc = new Date(weekEndBangladesh.getTime() - BANGLADESH_UTC_OFFSET_MS);

  return {
    weekKey: [
      weekStartBangladesh.getUTCFullYear(),
      String(weekStartBangladesh.getUTCMonth() + 1).padStart(2, "0"),
      String(weekStartBangladesh.getUTCDate()).padStart(2, "0"),
    ].join(""),
    weekStartUtc,
    weekEndUtc,
  };
};

const buildBangladeshMonthWindow = (value = new Date()) => {
  const safeDate = toValidDate(value);
  const bangladeshDate = new Date(safeDate.getTime() + BANGLADESH_UTC_OFFSET_MS);
  const monthStartBangladesh = new Date(Date.UTC(
    bangladeshDate.getUTCFullYear(),
    bangladeshDate.getUTCMonth(),
    1,
    0,
    0,
    0,
    0,
  ));
  const monthEndBangladesh = new Date(Date.UTC(
    bangladeshDate.getUTCFullYear(),
    bangladeshDate.getUTCMonth() + 1,
    1,
    0,
    0,
    0,
    0,
  ));

  return {
    monthKey: [
      monthStartBangladesh.getUTCFullYear(),
      String(monthStartBangladesh.getUTCMonth() + 1).padStart(2, "0"),
    ].join(""),
    monthStartUtc: new Date(monthStartBangladesh.getTime() - BANGLADESH_UTC_OFFSET_MS),
    monthEndUtc: new Date(monthEndBangladesh.getTime() - BANGLADESH_UTC_OFFSET_MS),
  };
};

const isDateKey = (value) => /^\d{4}-\d{2}-\d{2}$/.test(cleanText(value));

const requireDateKey = (value, message) => {
  const nextValue = cleanText(value);
  if (!isDateKey(nextValue)) {
    throw new Error(message);
  }
  return nextValue;
};

const toBangladeshDateKey = (value = new Date()) => {
  const safeDate = toValidDate(value);
  const bangladeshDate = new Date(safeDate.getTime() + BANGLADESH_UTC_OFFSET_MS);
  return [
    bangladeshDate.getUTCFullYear(),
    String(bangladeshDate.getUTCMonth() + 1).padStart(2, "0"),
    String(bangladeshDate.getUTCDate()).padStart(2, "0"),
  ].join("-");
};

const dateKeyToTimestamp = (value) => {
  const safeValue = requireDateKey(value, "Choose a valid date.");
  const [year, month, day] = safeValue.split("-").map(Number);
  return Timestamp.fromDate(new Date(Date.UTC(year, month - 1, day, 6, 0, 0)));
};

const sanitizeCertificateStatus = (value) => {
  const nextValue = cleanText(value) || "draft";
  return CERTIFICATE_STATUS_OPTIONS.has(nextValue) ? nextValue : "draft";
};

const sanitizeCertificateKind = (value) => {
  const nextValue = cleanText(value) || "general";
  return CERTIFICATE_KIND_OPTIONS.has(nextValue) ? nextValue : "general";
};

const buildCertificateNumber = ({ departmentId, issueDateKey, certificateId }) => {
  const departmentCode = CERTIFICATE_DEPARTMENT_CODES[departmentId] || "GEN";
  const compactDate = String(issueDateKey || "").replace(/-/g, "");
  const compactId = String(certificateId || "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 6)
    .toUpperCase()
    .padEnd(6, "X");

  return `EQBD-${departmentCode}-${compactDate}-${compactId}`;
};

export const getUserRef = (uid) => doc(db, "users", uid);
export const getDepartmentRef = (departmentId) => doc(db, "departments", departmentId);
export const getCourseRef = (courseId) => doc(db, "courses", courseId);
export const getLessonRef = (lessonId) => doc(db, "lessons", lessonId);
export const getTaskRef = (taskId) => doc(db, "tasks", taskId);
export const getAnnouncementRef = (announcementId) => doc(db, "announcements", announcementId);
export const getSubmissionRef = (submissionId) => doc(db, "submissions", submissionId);
export const getProgressRef = (uid, courseId) => doc(db, "users", uid, "progress", courseId);
export const getDepartmentWeeklyLeaderboardRef = (weekKey, departmentId) =>
  doc(db, "departmentLeaderboards", weekKey, "departments", departmentId);
export const getDepartmentMonthlyLeaderboardRef = (monthKey, departmentId) =>
  doc(db, "departmentMonthlyLeaderboards", monthKey, "departments", departmentId);
export const getDepartmentOverallLeaderboardRef = (departmentId) =>
  doc(db, "departmentOverallLeaderboards", "alltime", "departments", departmentId);
export const getCertificateRef = (certificateId) => doc(db, "certificates", certificateId);
export const getCertificateTemplateRef = (templateId) => doc(db, "certificateTemplates", templateId);
export const getAdminAuditLogRef = (logId = "") =>
  logId ? doc(db, "adminAuditLogs", logId) : doc(collection(db, "adminAuditLogs"));
export const getRestoreBinRef = (entryId = "") =>
  entryId ? doc(db, "restoreBin", entryId) : doc(collection(db, "restoreBin"));

const safeMap = (value) => (value && typeof value === "object" && !Array.isArray(value) ? value : {});
const countRestoreChildren = (children = {}) =>
  Object.values(safeMap(children)).reduce((total, value) => total + (Array.isArray(value) ? value.length : 0), 0);

const inferEntityLabel = ({ fallback = "", snapshot = {}, entityId = "", entityType = "" }) =>
  cleanText(
    fallback ||
      snapshot.templateName ||
      snapshot.title ||
      snapshot.certificateTitle ||
      snapshot.subjectTitle ||
      snapshot.recipientName ||
      snapshot.displayName ||
      snapshot.fullName ||
      snapshot.email ||
      entityId ||
      entityType,
  );

const buildRestoreBinPayload = ({
  actorId,
  actorRole,
  action,
  entityType,
  entityId,
  departmentId = "",
  label = "",
  summary = "",
  snapshot = {},
  children = {},
  counts = {},
}) => ({
  action: cleanText(action),
  entityType: cleanText(entityType),
  entityId: cleanText(entityId),
  departmentId: cleanText(departmentId || snapshot.departmentId),
  label: inferEntityLabel({ fallback: label, snapshot, entityId, entityType }),
  summary: cleanText(summary),
  snapshot: safeMap(snapshot),
  children: safeMap(children),
  counts: safeMap(counts),
  actorId: cleanText(actorId),
  actorRole: cleanText(actorRole) || "super_admin",
  status: "available",
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
  restoredAt: null,
  restoredBy: null,
});

const buildAdminAuditLogPayload = ({
  actorId,
  actorRole,
  action,
  entityType,
  entityId,
  departmentId = "",
  label = "",
  summary = "",
  restoreEntryId = "",
  counts = {},
}) => ({
  actorId: cleanText(actorId),
  actorRole: cleanText(actorRole) || "super_admin",
  action: cleanText(action),
  entityType: cleanText(entityType),
  entityId: cleanText(entityId),
  departmentId: cleanText(departmentId),
  label: cleanText(label),
  summary: cleanText(summary),
  restoreEntryId: cleanText(restoreEntryId),
  counts: safeMap(counts),
  childCount: Object.values(safeMap(counts)).reduce(
    (total, value) => total + (Number.isFinite(Number(value)) ? Number(value) : 0),
    0,
  ),
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});

async function writeAdminAuditLog({
  actor,
  action,
  entityType,
  entityId,
  departmentId = "",
  label = "",
  summary = "",
  restoreEntryId = "",
  counts = {},
}) {
  const actorId = assertSuperAdminActor(actor, "Only a super admin can write governance logs.");
  const auditRef = getAdminAuditLogRef();
  await setDoc(
    auditRef,
    buildAdminAuditLogPayload({
      actorId,
      actorRole: getActorRole(actor),
      action,
      entityType,
      entityId,
      departmentId,
      label,
      summary,
      restoreEntryId,
      counts,
    }),
  );
  return auditRef.id;
}

const buildBaseUserProfile = (authUser, overrides = {}) => {
  const merged = {
    uid: authUser?.uid || "",
    fullName: authUser?.displayName || authUser?.email || "EquiSaaS Member",
    displayName: authUser?.displayName || authUser?.email || "EquiSaaS Member",
    email: authUser?.email || "",
    phone: "",
    departmentId: "",
    parentDepartmentId: "",
    role: "member",
    roles: ["member"],
    status: "active",
    joinedAt: serverTimestamp(),
    joinDate: serverTimestamp(),
    photoURL: authUser?.photoURL || "",
    totalPoints: 0,
    completedTaskCount: 0,
    currentStage: "week-1",
    isActive: true,
    updatedAt: serverTimestamp(),
    ...overrides,
  };

  const roles = buildManagedRoleList({ role: merged.role, roles: merged.roles });
  const primaryRole = getPrimaryRole(roles);

  return {
    ...merged,
    role: primaryRole,
    roles,
  };
};

const safeGetUserSnapshot = async (userRef) => {
  try {
    return await getDoc(userRef);
  } catch (error) {
    if (String(error?.code || "").includes("permission-denied")) {
      return null;
    }
    throw error;
  }
};

const safeGetSubmissionSnapshot = async (submissionRef) => {
  try {
    return await getDoc(submissionRef);
  } catch (error) {
    if (String(error?.code || "").includes("permission-denied")) {
      return null;
    }
    throw error;
  }
};

export async function ensureUserProfile(authUser) {
  if (!authUser?.uid) return null;
  const userRef = getUserRef(authUser.uid);

  return await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(userRef);

    if (!snap?.exists()) {
      const newProfile = buildBaseUserProfile(authUser);
      transaction.set(userRef, newProfile);
      return newProfile;
    }

    const existing = snap.data() || {};
    const nextDisplayName = existing.displayName || authUser.displayName || authUser.email || "EquiSaaS Member";
    const nextFullName = existing.fullName || authUser.displayName || authUser.email || "EquiSaaS Member";
    const nextPhotoURL = existing.photoURL || authUser.photoURL || "";

    const hasChanged =
      existing.displayName !== nextDisplayName ||
      existing.fullName !== nextFullName ||
      existing.photoURL !== nextPhotoURL;

    if (hasChanged) {
      const patch = {
        displayName: nextDisplayName,
        fullName: nextFullName,
        photoURL: nextPhotoURL,
        updatedAt: serverTimestamp(),
      };
      transaction.set(userRef, patch, { merge: true });
      return { ...existing, ...patch };
    }

    return existing;
  });
}

export async function saveDepartmentSelection(userOrUid, departmentId) {
  const authUser = typeof userOrUid === "string" ? { uid: userOrUid } : userOrUid;
  const uid = authUser?.uid || "";
  const nextDepartment = getDepartmentMeta(departmentId);
  if (!uid || !nextDepartment) {
    throw new Error("Select a valid department.");
  }

  const userRef = getUserRef(uid);
  const existingSnap = await safeGetUserSnapshot(userRef);
  const currentDepartmentId = existingSnap?.exists() ? cleanText(existingSnap.data()?.departmentId) : "";
  // Optimization: If the department hasn't changed, skip the member-count batch to save costs
  if (currentDepartmentId === departmentId) {
    if (!existingSnap?.exists()) {
      // First time initialization with no dept change (unlikely but safe)
      await setDoc(
        userRef,
        {
          ...buildBaseUserProfile(authUser),
          departmentId,
          parentDepartmentId: nextDepartment.parentDepartmentId,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
    }
    return;
  }

  const batch = writeBatch(db);
  batch.set(
    userRef,
    existingSnap?.exists()
      ? {
          departmentId,
          parentDepartmentId: nextDepartment.parentDepartmentId,
          updatedAt: serverTimestamp(),
        }
      : {
          ...buildBaseUserProfile(authUser),
          departmentId,
          parentDepartmentId: nextDepartment.parentDepartmentId,
          updatedAt: serverTimestamp(),
        },
    { merge: true },
  );

  if (currentDepartmentId && currentDepartmentId !== departmentId) {
    batch.set(
      getDepartmentRef(currentDepartmentId),
      {
        memberCount: increment(-1),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  }

  if (currentDepartmentId !== departmentId) {
    batch.set(
      getDepartmentRef(departmentId),
      {
        memberCount: increment(1),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  }

  await batch.commit();
}

export async function saveLessonProgress({ uid, courseId, lessonId, completed }) {
  if (!uid || !courseId || !lessonId) {
    throw new Error("A valid lesson is required before progress can be updated.");
  }

  const progressRef = getProgressRef(uid, courseId);
  const existingSnap = await getDoc(progressRef);
  const existingIds = existingSnap.exists() ? existingSnap.data().completedLessonIds || [] : [];
  const nextIds = completed
    ? [...new Set([...existingIds, lessonId])]
    : existingIds.filter((id) => id !== lessonId);
  // Optimization: Only write if the list of completed lessons has actually changed
  const isSame = existingIds.length === nextIds.length && existingIds.every((id) => nextIds.includes(id));

  if (!isSame) {
    await setDoc(
      progressRef,
      {
        courseId,
        completedLessonIds: nextIds,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  }
}

export async function fetchAnnouncements(scopeKeyList, count = 10) {
  const safeScopeKeyList = (scopeKeyList || []).map(cleanText).filter(Boolean).slice(0, 10);
  if (!safeScopeKeyList.length) return [];

  return getDocsWithIndexFallback(
    () =>
      query(
        collection(db, "announcements"),
        where("scopeKey", "in", safeScopeKeyList),
        where("isPublished", "==", true),
        orderBy("createdAt", "desc"),
        limit(count),
      ),
    {
      fallbackRefFactory: () => query(collection(db, "announcements"), where("isPublished", "==", true)),
      transform: (items) =>
        limitItems(
          sortByDateField(
            items.filter((item) => safeScopeKeyList.includes(cleanText(item.scopeKey))),
            "createdAt",
            "desc",
            ["title", "scopeKey", "id"],
          ),
          count,
        ),
    },
  );
}

export const fetchDepartmentAnnouncements = (departmentId) =>
  fetchAnnouncements(["global", `department:${departmentId}`], 20);

export const fetchAllAnnouncements = (count = 12) => fetchAnnouncements(allAnnouncementScopeKeys, count);

export async function fetchDepartments() {
  const snap = await getDocs(collection(db, "departments"));
  return sortDepartments(mapDocs(snap).filter((item) => item.isActive !== false));
}

export async function fetchDepartmentCourses(departmentId) {
  if (!departmentId) return [];

  return getDocsWithIndexFallback(
    () =>
      query(
        collection(db, "courses"),
        where("departmentId", "==", departmentId),
        where("status", "==", "published"),
        orderBy("order", "asc"),
      ),
    {
      fallbackRefFactory: () => query(collection(db, "courses"), where("departmentId", "==", departmentId)),
      transform: (items) => sortByOrder(items.filter((item) => item.status === "published")),
    },
  );
}

export async function fetchDepartmentLessons(departmentId) {
  if (!departmentId) return [];

  const snap = await getDocs(query(collection(db, "lessons"), where("departmentId", "==", departmentId)));
  return mapDocs(snap).sort((left, right) => {
    const orderDelta = Number(left.order || 999) - Number(right.order || 999);
    if (orderDelta !== 0) return orderDelta;
    return String(left.title || left.id || "").localeCompare(String(right.title || right.id || ""));
  });
}

export async function fetchDepartmentTasks(departmentId) {
  if (!departmentId) return [];

  const snap = await getDocs(query(collection(db, "tasks"), where("departmentId", "==", departmentId)));
  return mapDocs(snap).sort((left, right) =>
    String(left.title || left.resourceTitle || left.id || "").localeCompare(
      String(right.title || right.resourceTitle || right.id || ""),
    ),
  );
}

export async function fetchCourseLessons(courseId, departmentId) {
  if (!courseId || !departmentId) return [];
  const courseSnap = await getDoc(getCourseRef(courseId));
  const lessonIds = courseSnap.exists() && Array.isArray(courseSnap.data()?.lessonIds)
    ? courseSnap.data().lessonIds.filter(Boolean)
    : [];

  if (lessonIds.length) {
    const lessonSnapshots = await Promise.all(lessonIds.map((lessonId) => getDoc(getLessonRef(lessonId))));
    return lessonSnapshots
      .filter((snap) => snap.exists())
      .map((snap) => ({ id: snap.id, ...snap.data() }))
      .filter((item) => item.status === "published" && item.departmentId === departmentId)
      .sort((left, right) => Number(left.order || 999) - Number(right.order || 999));
  }

  return getDocsWithIndexFallback(
    () =>
      query(
        collection(db, "lessons"),
        where("departmentId", "==", departmentId),
        where("courseId", "==", courseId),
        where("status", "==", "published"),
        orderBy("order", "asc"),
      ),
    {
      fallbackRefFactory: () => query(collection(db, "lessons"), where("courseId", "==", courseId)),
      transform: (items) =>
        sortByOrder(
          items.filter((item) => item.status === "published" && item.departmentId === departmentId),
          ["title", "providerName", "id"],
        ),
    },
  );
}

export async function fetchOpenTasks(departmentId, count = 10) {
  if (!departmentId) return [];

  return getDocsWithIndexFallback(
    () =>
      query(
        collection(db, "tasks"),
        where("departmentId", "==", departmentId),
        where("status", "==", "open"),
        orderBy("deadlineAt", "asc"),
        limit(count),
      ),
    {
      fallbackRefFactory: () => query(collection(db, "tasks"), where("departmentId", "==", departmentId)),
      transform: (items) =>
        limitItems(
          sortByDateField(
            items.filter((item) => item.status === "open"),
            "deadlineAt",
            "asc",
            ["title", "resourceTitle", "id"],
          ),
          count,
        ),
    },
  );
}

export async function fetchUserSubmissions(uid) {
  if (!uid) return [];

  return getDocsWithIndexFallback(
    () => query(collection(db, "submissions"), where("userId", "==", uid), orderBy("submittedAt", "desc")),
    {
      fallbackRefFactory: () => query(collection(db, "submissions"), where("userId", "==", uid)),
      transform: (items) => sortByDateField(items, "submittedAt", "desc", ["taskTitle", "resourceTitle", "id"]),
    },
  );
}

export async function fetchDepartmentSubmissions(departmentId) {
  if (!departmentId) return [];

  return getDocsWithIndexFallback(
    () =>
      query(
        collection(db, "submissions"),
        where("departmentId", "==", departmentId),
        orderBy("submittedAt", "desc"),
        limit(50),
      ),
    {
      fallbackRefFactory: () => query(collection(db, "submissions"), where("departmentId", "==", departmentId)),
      transform: (items) => limitItems(sortByDateField(items, "submittedAt", "desc", ["taskTitle", "resourceTitle", "id"]), 50),
    },
  );
}

export async function fetchRecentSubmissions(count = 50) {
  return getDocsWithIndexFallback(
    () => query(collection(db, "submissions"), orderBy("submittedAt", "desc"), limit(count)),
    {
      fallbackRefFactory: () => collection(db, "submissions"),
      transform: (items) => limitItems(sortByDateField(items, "submittedAt", "desc", ["taskTitle", "resourceTitle", "id"]), count),
    },
  );
}

export async function fetchUserLedger(uid, count = 20) {
  if (!uid) return [];

  return getDocsWithIndexFallback(
    () => query(collection(db, "pointsLedger"), where("userId", "==", uid), orderBy("createdAt", "desc"), limit(count)),
    {
      fallbackRefFactory: () => query(collection(db, "pointsLedger"), where("userId", "==", uid)),
      transform: (items) => limitItems(sortByDateField(items, "createdAt", "desc", ["note", "sourceType", "id"]), count),
    },
  );
}

export async function fetchUserCertificates(email) {
  if (!email) return [];

  return getDocsWithIndexFallback(
    () =>
      query(
        collection(db, "certificates"),
        where("recipientEmail", "==", email),
        where("status", "==", "active"),
        orderBy("issueDateKey", "desc"),
      ),
    {
      fallbackRefFactory: () => query(collection(db, "certificates"), where("recipientEmail", "==", email)),
      transform: (items) => sortByDateKeyField(items.filter((item) => item.status === "active"), "issueDateKey", "desc"),
    },
  );
}

const sortLeaderboardEntries = (items, pointsField) =>
  [...items]
    .sort((left, right) => {
      const pointsDelta = Number(right[pointsField] || right.score || 0) - Number(left[pointsField] || left.score || 0);
      if (pointsDelta !== 0) return pointsDelta;

      const timeDelta = toValidDate(right.lastAwardedAt).getTime() - toValidDate(left.lastAwardedAt).getTime();
      if (timeDelta !== 0) return timeDelta;

      return String(left.displayName || left.userId || "").localeCompare(String(right.displayName || right.userId || ""));
    })
    .map((entry, index) => ({
      ...entry,
      score: Number(entry[pointsField] || entry.score || 0),
      rank: index + 1,
    }));

async function fetchDepartmentLeaderboardSnapshot({
  departmentId,
  limitCount = 10,
  leaderboardRef,
  periodKey,
  pointsField,
  emptyResult,
}) {
  const nextDepartmentId = cleanText(departmentId);

  if (!nextDepartmentId) {
    return emptyResult;
  }

  const participantsRef = collection(leaderboardRef, "participants");
  const [leaderboardSnap, participantsSnap] = await Promise.all([
    getDoc(leaderboardRef),
    getDocs(query(participantsRef, orderBy(pointsField, "desc"), limit(limitCount))),
  ]);

  const leaderboardData = leaderboardSnap.exists() ? leaderboardSnap.data() || {} : {};
  const entries = sortLeaderboardEntries(mapDocs(participantsSnap), pointsField);

  return {
    ...emptyResult,
    departmentId: nextDepartmentId,
    periodKey,
    participantCount: Number(leaderboardData.participantCount || entries.length || 0),
    updatedAt: leaderboardData.updatedAt || null,
    entries,
    ...leaderboardData,
  };
}

export async function fetchDepartmentWeeklyLeaderboard({ departmentId, limitCount = 10, value = new Date() } = {}) {
  const nextDepartmentId = cleanText(departmentId);
  const weekWindow = buildBangladeshWeekWindow(value);

  return fetchDepartmentLeaderboardSnapshot({
    departmentId: nextDepartmentId,
    limitCount,
    leaderboardRef: getDepartmentWeeklyLeaderboardRef(weekWindow.weekKey, nextDepartmentId),
    periodKey: weekWindow.weekKey,
    pointsField: "weeklyPoints",
    emptyResult: {
      departmentId: "",
      periodType: "weekly",
      weekKey: weekWindow.weekKey,
      weekStartsAt: Timestamp.fromDate(weekWindow.weekStartUtc),
      weekEndsAt: Timestamp.fromDate(weekWindow.weekEndUtc),
      participantCount: 0,
      entries: [],
    },
  });
}

export async function fetchDepartmentMonthlyLeaderboard({ departmentId, limitCount = 10, value = new Date() } = {}) {
  const nextDepartmentId = cleanText(departmentId);
  const monthWindow = buildBangladeshMonthWindow(value);

  return fetchDepartmentLeaderboardSnapshot({
    departmentId: nextDepartmentId,
    limitCount,
    leaderboardRef: getDepartmentMonthlyLeaderboardRef(monthWindow.monthKey, nextDepartmentId),
    periodKey: monthWindow.monthKey,
    pointsField: "monthlyPoints",
    emptyResult: {
      departmentId: "",
      periodType: "monthly",
      monthKey: monthWindow.monthKey,
      monthStartsAt: Timestamp.fromDate(monthWindow.monthStartUtc),
      monthEndsAt: Timestamp.fromDate(monthWindow.monthEndUtc),
      participantCount: 0,
      entries: [],
    },
  });
}

export async function fetchDepartmentOverallLeaderboard({ departmentId, limitCount = 10 } = {}) {
  const nextDepartmentId = cleanText(departmentId);

  return fetchDepartmentLeaderboardSnapshot({
    departmentId: nextDepartmentId,
    limitCount,
    leaderboardRef: getDepartmentOverallLeaderboardRef(nextDepartmentId),
    periodKey: "alltime",
    pointsField: "overallPoints",
    emptyResult: {
      departmentId: "",
      periodType: "overall",
      boardKey: "alltime",
      participantCount: 0,
      entries: [],
    },
  });
}

export async function fetchDepartmentCertificates(departmentId, limitCount = 30) {
  const nextDepartmentId = cleanText(departmentId);
  if (!nextDepartmentId) return [];

  const items = await getDocsWithIndexFallback(
    () =>
      query(
        collection(db, "certificates"),
        where("departmentId", "==", nextDepartmentId),
        orderBy("issuedAt", "desc"),
        limit(limitCount),
      ),
    {
      fallbackRefFactory: () => query(collection(db, "certificates"), where("departmentId", "==", nextDepartmentId)),
      transform: (entries) => limitItems(sortByDateField(entries, "issuedAt", "desc", ["recipientName", "certificateTitle", "id"]), limitCount),
    },
  );

  return items.map((item) => ({
    ...item,
    verificationUrl: buildCertificateVerificationUrl(item.id),
  }));
}

export async function fetchCertificateTemplates() {
  const snap = await getDocs(query(collection(db, "certificateTemplates"), orderBy("updatedAt", "desc")));
  return mapDocs(snap);
}

export async function fetchAdminAuditLogs(limitCount = 40) {
  const snap = await getDocs(
    query(collection(db, "adminAuditLogs"), orderBy("createdAt", "desc"), limit(limitCount)),
  );
  return mapDocs(snap);
}

export async function fetchRestoreBinEntries(limitCount = 40) {
  const snap = await getDocs(
    query(collection(db, "restoreBin"), orderBy("createdAt", "desc"), limit(limitCount)),
  );
  return mapDocs(snap);
}

export async function saveCertificateTemplate({ actor, payload, templateId = "" }) {
  assertSuperAdminActor(actor, "Only the highest access role can manage templates.");
  const ref = templateId ? getCertificateTemplateRef(templateId) : doc(collection(db, "certificateTemplates"));
  const templatePayload = {
    templateName: requireText(payload.templateName, "Template name is required."),
    certificateTitle: cleanText(payload.certificateTitle) || "Certificate of Completion",
    subjectTitle: cleanText(payload.subjectTitle),
    achievementSummary: cleanText(payload.achievementSummary),
    signerName: cleanText(payload.signerName) || DEFAULT_CERTIFICATE_SIGNER_NAME,
    signerTitle: cleanText(payload.signerTitle) || DEFAULT_CERTIFICATE_SIGNER_TITLE,
    themeStyle: cleanText(payload.themeStyle) || "classic",
    labelOverrides: {
      department: cleanText(payload.labelOverrides?.department),
      issueDate: cleanText(payload.labelOverrides?.issueDate),
    },
    customColors: {
      textMain: cleanText(payload.customColors?.textMain),
      bgTheme: cleanText(payload.customColors?.bgTheme),
      textPrimary: cleanText(payload.customColors?.textPrimary),
      borderOuter: cleanText(payload.customColors?.borderOuter),
      cardBg: cleanText(payload.customColors?.cardBg),
    },
    updatedAt: serverTimestamp(),
  };

  if (!templateId) {
    templatePayload.createdAt = serverTimestamp();
  }

  await setDoc(
    ref,
    templatePayload,
    { merge: true }
  );
  return ref.id;
}

export async function deleteCertificateTemplate({ actor, templateId }) {
  const actorId = assertSuperAdminActor(actor, "Only the highest access role can manage templates.");
  const nextTemplateId = requireText(templateId, "Select a template first.");
  const templateRef = getCertificateTemplateRef(nextTemplateId);
  const templateSnap = await getDoc(templateRef);
  if (!templateSnap.exists()) {
    throw new Error("Selected template could not be found.");
  }

  const templateData = templateSnap.data() || {};
  const restoreRef = getRestoreBinRef();
  const batch = writeBatch(db);
  const restorePayload = buildRestoreBinPayload({
    actorId,
    actorRole: getActorRole(actor),
    action: "delete_certificate_template",
    entityType: "certificate_template",
    entityId: nextTemplateId,
    label: inferEntityLabel({ snapshot: templateData, entityId: nextTemplateId, entityType: "certificate_template" }),
    summary: "Archived the certificate template before deletion.",
    snapshot: templateData,
  });
  batch.set(restoreRef, restorePayload);
  batch.set(
    getAdminAuditLogRef(),
    buildAdminAuditLogPayload({
      actorId,
      actorRole: getActorRole(actor),
      action: "delete_certificate_template",
      entityType: "certificate_template",
      entityId: nextTemplateId,
      label: restorePayload.label,
      summary: "Deleted one certificate template.",
      restoreEntryId: restoreRef.id,
    }),
  );
  batch.delete(templateRef);
  await batch.commit();
}

export async function fetchCertificateById(certificateId) {
  const nextCertificateId = cleanText(certificateId);
  if (!nextCertificateId) return null;

  try {
    const snap = await getDoc(getCertificateRef(nextCertificateId));
    if (!snap.exists()) return null;
    return {
      id: snap.id,
      ...snap.data(),
      verificationUrl: buildCertificateVerificationUrl(snap.id),
    };
  } catch (error) {
    if (String(error?.code || "").includes("permission-denied")) {
      return null;
    }
    throw error;
  }
}

export async function saveCertificate({ actor, payload, certificateId = "" }) {
  const actorId = getActorId(actor);
  const actorRole = getActorRole(actor);
  if (!actorId || actorRole !== "super_admin") {
    throw new Error("Only the highest access role can issue or edit certificates.");
  }

  const departmentId = requireText(payload.departmentId, "Select a department first.");
  const departmentMeta = getDepartmentMeta(departmentId);
  if (!departmentMeta) {
    throw new Error("Select a valid department first.");
  }

  const certificateRef = certificateId
    ? getCertificateRef(certificateId)
    : doc(collection(db, "certificates"));
  const existingSnap = certificateId ? await getDoc(certificateRef) : null;
  const existingData = existingSnap?.exists() ? existingSnap.data() || {} : {};
  const certificateDocId = certificateRef.id;
  const issueDateKey = requireDateKey(
    payload.issueDateKey || toBangladeshDateKey(),
    "Choose a valid issue date.",
  );
  const completionDateKey = requireDateKey(
    payload.completionDateKey || issueDateKey,
    "Choose a valid completion date.",
  );
  const courseId = cleanText(payload.courseId);
  const courseTitle = cleanText(payload.courseTitle);
  const status = sanitizeCertificateStatus(payload.status);
  const certificateKind = sanitizeCertificateKind(payload.certificateKind);
  const workshopTitle = cleanText(payload.workshopTitle);
  const workshopDateKey = cleanText(payload.workshopDateKey);
  const workshopId = cleanText(payload.workshopId);
  const certificateNumber = existingData.certificateNumber || buildCertificateNumber({
    departmentId,
    issueDateKey,
    certificateId: certificateDocId,
  });
  const verificationUrl = buildCertificateVerificationUrl(certificateDocId);
  const verificationCode = existingData.verificationCode || certificateNumber.split("-").slice(1).join("-");

  await setDoc(
    certificateRef,
    {
      certificateNumber,
      certificateKind,
      verificationCode,
      verificationUrl,
      status,
      certificateTitle: requireText(payload.certificateTitle, "Certificate title is required."),
      subjectTitle: requireText(payload.subjectTitle, "Subject or course title is required."),
      achievementSummary: cleanText(payload.achievementSummary).slice(0, 600),
      recipientName: requireText(payload.recipientName, "Recipient name is required."),
      departmentId,
      departmentTitle: departmentMeta.title,
      parentDepartmentId: departmentMeta.parentDepartmentId,
      courseId,
      courseTitle,
      workshopId,
      workshopTitle,
      workshopDateKey,
      completionDateKey,
      issueDateKey,
      issuedAt: dateKeyToTimestamp(issueDateKey),
      signerName: cleanText(payload.signerName) || DEFAULT_CERTIFICATE_SIGNER_NAME,
      signerTitle: cleanText(payload.signerTitle) || DEFAULT_CERTIFICATE_SIGNER_TITLE,
      issuerOrganization: "EquiSaaS BD",
      templateId: cleanText(payload.templateId),
      themeStyle: cleanText(payload.themeStyle) || "classic",
      labelOverrides: payload.labelOverrides || {},
      customColors: payload.customColors || {},
      revokedAt: status === "revoked" ? serverTimestamp() : null,
      createdAt: existingSnap?.exists() ? (existingData.createdAt || serverTimestamp()) : serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  return certificateDocId;
}

export async function updateCertificateStatus({ actor, certificateId, status }) {
  const actorId = getActorId(actor);
  const actorRole = getActorRole(actor);
  const nextCertificateId = cleanText(certificateId);
  if (!actorId || actorRole !== "super_admin") {
    throw new Error("Only the highest access role can change certificate status.");
  }
  if (!nextCertificateId) {
    throw new Error("Certificate not found.");
  }

  const certificateRef = getCertificateRef(nextCertificateId);
  const snap = await getDoc(certificateRef);
  if (!snap.exists()) {
    throw new Error("Certificate not found.");
  }

  const nextStatus = sanitizeCertificateStatus(status);
  await setDoc(
    certificateRef,
    {
      status: nextStatus,
      revokedAt: nextStatus === "revoked" ? serverTimestamp() : null,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function fetchDepartmentUsers(departmentId) {
  if (!departmentId) return [];

  const snap = await getDocs(query(collection(db, "users"), where("departmentId", "==", departmentId)));
  return sortByDisplayName(mapDocs(snap));
}

export async function fetchManageableUsers({ departmentId, actorRole }) {
  if (!departmentId) return [];

  if (actorRole === "super_admin") {
    const snap = await getDocs(collection(db, "users"));
    return sortByDisplayName(mapDocs(snap));
  }

  const scopeQueries = [
    getDocs(query(collection(db, "users"), where("departmentId", "==", departmentId))),
  ];

  if (actorRole === "director") {
    scopeQueries.push(
      getDocs(query(collection(db, "users"), where("departmentId", "==", ""))),
    );
  }

  const snapshots = await Promise.all(scopeQueries);
  const merged = new Map();

  snapshots.forEach((snap) => {
    mapDocs(snap).forEach((item) => {
      merged.set(item.id, item);
    });
  });

  return sortByDisplayName([...merged.values()]);
}

export async function fetchDepartmentDetail(departmentId) {
  const snap = await getDoc(getDepartmentRef(departmentId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function fetchCourse(courseId) {
  const snap = await getDoc(getCourseRef(courseId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function fetchLesson(lessonId) {
  const snap = await getDoc(getLessonRef(lessonId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function fetchTask(taskId) {
  const snap = await getDoc(getTaskRef(taskId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function fetchSubmission(submissionId) {
  const snap = await safeGetSubmissionSnapshot(getSubmissionRef(submissionId));
  return snap?.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function submitTaskSubmission({
  task,
  user,
  submittedText,
  submissionUrl,
  submissionType,
  displayName,
}) {
  if (!task?.id || !user?.uid) {
    throw new Error("Task and user are required.");
  }
  if (task.status && task.status !== "open") {
    throw new Error("This task is not accepting submissions right now.");
  }

  const submissionId = buildSubmissionId(task.id, user.uid);
  const submissionRef = getSubmissionRef(submissionId);
  const existing = await safeGetSubmissionSnapshot(submissionRef);
  const safeSubmissionUrl = ensureValidUrl(submissionUrl, "Enter a valid proof link.");
  const safeSubmittedText = cleanText(submittedText);
  const safeSubmissionType = cleanText(submissionType) || "link";
  const allowedSubmissionTypes = Array.isArray(task.allowedSubmissionTypes) && task.allowedSubmissionTypes.length
    ? task.allowedSubmissionTypes
    : ["certificate", "screenshot", "public_profile", "github", "link"];

  if (!safeSubmissionUrl) {
    throw new Error("A proof link is required before you can submit.");
  }
  if (!allowedSubmissionTypes.includes(safeSubmissionType)) {
    throw new Error("Choose one of the allowed proof types for this task.");
  }
  if (finalizedSubmissionStatuses.has(existing?.data()?.status || "")) {
    throw new Error("This submission is already finalized and can no longer be edited.");
  }

  if (existing?.exists()) {
    const currentData = existing.data() || {};
    
    // Optimization: Skip re-write if submission links and text are identical
    const isSameText = currentData.submittedText === safeSubmittedText;
    const isSameLinks = JSON.stringify(currentData.submissionLinks || []) === JSON.stringify([{ type: safeSubmissionType, url: safeSubmissionUrl }]);
    
    if (isSameText && isSameLinks && currentData.status === "pending") {
      return submissionId;
    }

    await setDoc(
      submissionRef,
      {
        taskSource: "assigned",
        taskReferenceUrl: task.resourceUrl || "",
        taskOrigin: "mentor_direct",
        submittedText: safeSubmittedText,
        submissionLinks: [{ type: safeSubmissionType, url: safeSubmissionUrl }],
        status: "pending",
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
    return submissionId;
  }

  await setDoc(
    submissionRef,
    {
      taskId: task.id,
      taskTitle: task.title || "",
      resourceTitle: task.resourceTitle || "",
      userId: user.uid,
      userDisplayName: displayName || user.email || "Member",
      departmentId: task.departmentId,
      courseId: task.courseId || "",
      lessonId: task.lessonId || "",
      taskSource: "assigned",
      taskReferenceUrl: task.resourceUrl || "",
      taskOrigin: "mentor_direct",
      submittedText: safeSubmittedText,
      submissionLinks: [{ type: safeSubmissionType, url: safeSubmissionUrl }],
      status: "pending",
      recommendation: "",
      reviewComment: "",
      reviewedBy: "",
      reviewedAt: null,
      recommendedBy: "",
      recommendedAt: null,
      recommendedPoints: 0,
      awardedPoints: 0,
      submittedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
  return submissionId;
}

export async function submitFlexibleTaskSubmission({
  submissionId,
  departmentId,
  user,
  taskTitle,
  taskReferenceUrl,
  taskOrigin,
  submittedText,
  submissionUrl,
  submissionType,
  displayName,
}) {
  if (!departmentId || !user?.uid) {
    throw new Error("Department and user are required.");
  }

  const safeTaskTitle = requireText(taskTitle, "Write a task title first.");
  const safeSubmissionUrl = ensureValidUrl(submissionUrl, "Enter a valid proof link.");
  const safeReferenceUrl = ensureValidUrl(taskReferenceUrl, "Enter a valid task reference link.");
  const safeSubmittedText = cleanText(submittedText);
  const safeSubmissionType = cleanText(submissionType) || "link";
  const safeTaskOrigin = sanitizeTaskOrigin(taskOrigin);
  const submissionRef = submissionId ? getSubmissionRef(submissionId) : doc(collection(db, "submissions"));
  const existing = submissionId ? await safeGetSubmissionSnapshot(submissionRef) : null;

  if (!safeSubmissionUrl) {
    throw new Error("A proof link is required before you can submit.");
  }
  if (finalizedSubmissionStatuses.has(existing?.data()?.status || "")) {
    throw new Error("This submission is already finalized and can no longer be edited.");
  }

  const payload = {
    taskTitle: safeTaskTitle,
    resourceTitle: safeTaskTitle,
    taskReferenceUrl: safeReferenceUrl,
    taskOrigin: safeTaskOrigin,
    submittedText: safeSubmittedText,
    submissionLinks: [{ type: safeSubmissionType, url: safeSubmissionUrl }],
    status: "pending",
    updatedAt: serverTimestamp(),
  };

  if (existing?.exists()) {
    await setDoc(submissionRef, payload, { merge: true });
    return submissionRef.id;
  }

  await setDoc(
    submissionRef,
    {
      taskId: buildCustomTaskKey(safeTaskTitle),
      taskTitle: safeTaskTitle,
      resourceTitle: safeTaskTitle,
      userId: user.uid,
      userDisplayName: displayName || user.email || "Member",
      departmentId,
      courseId: "",
      lessonId: "",
      taskSource: "custom",
      taskReferenceUrl: safeReferenceUrl,
      taskOrigin: safeTaskOrigin,
      submittedText: safeSubmittedText,
      submissionLinks: [{ type: safeSubmissionType, url: safeSubmissionUrl }],
      status: "pending",
      recommendation: "",
      reviewComment: "",
      reviewedBy: "",
      reviewedAt: null,
      recommendedBy: "",
      recommendedAt: null,
      recommendedPoints: 0,
      awardedPoints: 0,
      submittedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  return submissionRef.id;
}

export async function createCourse({ actor, payload }) {
  const actorId = getActorId(actor);
  const title = requireText(payload.title, "Course title is required.");
  const departmentId = requireText(payload.departmentId, "Select a department first.");
  const courseRef = doc(collection(db, "courses"));
  const batch = writeBatch(db);
  batch.set(courseRef, {
    title,
    description: cleanText(payload.description),
    departmentId,
    parentDepartmentId: getParentDepartmentId(departmentId),
    difficulty: payload.difficulty || "Beginner",
    estimatedHours: Number(payload.estimatedHours || 0),
    order: Number(payload.order || 1),
    lessonCount: 0,
    lessonIds: [],
    status: payload.status || "published",
    createdBy: actorId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  batch.set(
    getDepartmentRef(departmentId),
    { courseCount: increment(1), updatedAt: serverTimestamp() },
    { merge: true },
  );
  await batch.commit();
  return courseRef.id;
}

export async function createLesson({ actor, payload }) {
  const actorId = getActorId(actor);
  const title = requireText(payload.title, "Lesson title is required.");
  const courseId = requireText(payload.courseId, "Select a course first.");
  const departmentId = requireText(payload.departmentId, "Select a department first.");
  const lessonRef = doc(collection(db, "lessons"));
  const batch = writeBatch(db);
  batch.set(lessonRef, {
    title,
    summary: requireText(payload.summary, "Lesson summary is required."),
    courseId,
    departmentId,
    parentDepartmentId: getParentDepartmentId(departmentId),
    contentType: payload.contentType || "external_resource",
    videoUrl: payload.videoUrl || "",
    externalUrl: ensureValidUrl(payload.externalUrl, "Enter a valid lesson resource URL."),
    providerName: requireText(payload.providerName, "Provider name is required."),
    estimatedHours: Number(payload.estimatedHours || 0),
    credentialType: payload.credentialType || "verifiable_artifact",
    readingContent: cleanText(payload.readingContent) || requireText(payload.summary, "Lesson summary is required."),
    taskId: "",
    order: Number(payload.order || 1),
    status: payload.status || "published",
    createdBy: actorId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  batch.set(
    getCourseRef(courseId),
    { lessonCount: increment(1), lessonIds: arrayUnion(lessonRef.id), updatedAt: serverTimestamp() },
    { merge: true },
  );
  await batch.commit();
  return lessonRef.id;
}

export async function createTask({ actor, payload }) {
  const actorId = getActorId(actor);
  const title = requireText(payload.title, "Task title is required.");
  const departmentId = requireText(payload.departmentId, "Select a department first.");
  const taskRef = doc(collection(db, "tasks"));
  await setDoc(taskRef, {
    title,
    resourceTitle: cleanText(payload.resourceTitle),
    resourceUrl: ensureValidUrl(payload.resourceUrl, "Enter a valid task resource URL."),
    instructions: requireText(payload.instructions, "Task instructions are required."),
    departmentId,
    parentDepartmentId: getParentDepartmentId(departmentId),
    courseId: payload.courseId || "",
    lessonId: payload.lessonId || "",
    submissionType: payload.submissionType || "link",
    allowedSubmissionTypes: payload.allowedSubmissionTypes || ["certificate", "screenshot", "public_profile", "github", "link"],
    maxPoints: Number(payload.maxPoints || 0),
    deadlineAt: payload.deadlineAt ? Timestamp.fromDate(new Date(payload.deadlineAt)) : null,
    createdBy: actorId,
    reviewMode: "manual",
    status: payload.status || "open",
    submissionCount: 0,
    proofChecklist: payload.proofChecklist || [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return taskRef.id;
}

export async function createAnnouncement({ actor, payload }) {
  const actorId = getActorId(actor);
  const announcementRef = doc(collection(db, "announcements"));
  const departmentId = payload.scope === "department" ? payload.departmentId : "";
  await setDoc(announcementRef, {
    scope: payload.scope,
    departmentId,
    scopeKey: payload.scope === "department" ? `department:${departmentId}` : "global",
    title: requireText(payload.title, "Announcement title is required."),
    body: requireText(payload.body, "Announcement body is required."),
    priority: payload.priority || "normal",
    createdBy: actorId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    isPublished: true,
  });
  return announcementRef.id;
}

export async function updateUserAccess({ targetUserId, actor, values }) {
  const actorId = getActorId(actor);
  const actorRole = getActorRole(actor);
  if (!targetUserId) {
    throw new Error("Select a user first.");
  }
  const nextRoles = buildManagedRoleList(values.roles || values.role);
  const nextRole = getPrimaryRole(nextRoles);
  const nextDepartmentId = values.departmentId || "";
  const nextParentDepartmentId = getParentDepartmentId(nextDepartmentId);
  const nextStatus = cleanText(values.status) || "active";
  
  const allowedRolesByActor = {
    super_admin: ["super_admin", "director", "department_head", "mentor", "member"],
    director: ["department_head", "mentor", "member"],
    department_head: ["mentor", "member"],
  };

  if (!allowedRolesByActor[actorRole]) {
    throw new Error("You do not have permission to manage roles.");
  }

  if (nextRoles.some((roleId) => !allowedRolesByActor[actorRole].includes(roleId))) {
    throw new Error("One or more selected roles are outside your current account level.");
  }
  if (nextDepartmentId && !getDepartmentMeta(nextDepartmentId)) {
    throw new Error("Choose a valid department before saving access.");
  }
  if (rolesRequireDepartment(nextRoles) && !nextDepartmentId) {
    throw new Error("At least one selected role must be attached to a department.");
  }

  await runTransaction(db, async (transaction) => {
    const targetRef = getUserRef(targetUserId);
    const snap = await transaction.get(targetRef);
    if (!snap.exists()) {
      throw new Error("Selected user could not be found.");
    }
    const currentDepartmentId = snap.exists() ? snap.data().departmentId || "" : "";
    const currentRole = snap.data().role || "member";

    if (targetUserId === actorId) {
      throw new Error("You cannot change your own role or scope from here.");
    }
    if (actorRole !== "super_admin" && currentRole === "super_admin") {
      throw new Error("Only a super admin can update another super admin.");
    }
    if (actorRole === "director" && currentRole === "director") {
      throw new Error("Directors cannot update another director from this console.");
    }
    if (actorRole === "department_head" && ["department_head", "director", "super_admin"].includes(currentRole)) {
      throw new Error("Department heads cannot change leadership access from this console.");
    }
    if (actorRole === "department_head" && nextDepartmentId !== currentDepartmentId) {
      throw new Error("Department heads can only manage access inside their own department.");
    }

    if (currentDepartmentId && currentDepartmentId !== nextDepartmentId) {
      transaction.set(getDepartmentRef(currentDepartmentId), { memberCount: increment(-1) }, { merge: true });
    }
    if (nextDepartmentId && currentDepartmentId !== nextDepartmentId) {
      transaction.set(getDepartmentRef(nextDepartmentId), { memberCount: increment(1) }, { merge: true });
    }

    transaction.set(
      targetRef,
        {
          role: nextRole,
          roles: nextRoles,
          status: nextStatus,
          departmentId: nextDepartmentId,
          parentDepartmentId: nextParentDepartmentId,
        updatedAt: serverTimestamp(),
        updatedBy: actorId,
      },
      { merge: true },
    );
  });

  if (actorRole === "super_admin") {
    const targetSnap = await getDoc(getUserRef(targetUserId));
    const targetData = targetSnap.exists() ? targetSnap.data() || {} : {};
    await writeAdminAuditLog({
      actor,
      action: "update_user_access",
      entityType: "user",
      entityId: targetUserId,
      departmentId: cleanText(targetData.departmentId || nextDepartmentId),
      label: inferEntityLabel({ snapshot: targetData, entityId: targetUserId, entityType: "user" }),
      summary: `Access set to [${nextRoles.join(", ")}] (${nextStatus}) in ${nextDepartmentId || "no department"}.`,
    });
  }
}

export async function adjustUserPoints({
  actor,
  targetUserId,
  nextTotalPoints,
  reason = "",
}) {
  const actorId = assertSuperAdminActor(actor, "Only the highest access role can change total points directly.");
  const safeTargetUserId = requireText(targetUserId, "Select a member first.");
  const safeNextTotalPoints = sanitizePoints(nextTotalPoints);
  const safeReason = cleanText(reason);
  const targetRef = getUserRef(safeTargetUserId);
  const targetSnap = await getDoc(targetRef);

  if (!targetSnap.exists()) {
    throw new Error("Selected user could not be found.");
  }

  const targetData = targetSnap.data() || {};
  const currentTotalPoints = sanitizePoints(targetData.totalPoints || 0);
  const delta = safeNextTotalPoints - currentTotalPoints;

  if (delta === 0) {
    return {
      changed: false,
      totalPoints: currentTotalPoints,
      delta: 0,
      direction: "credit",
      ledgerEntryId: "",
    };
  }

  const entryRef = doc(collection(db, "pointsLedger"));
  const direction = delta > 0 ? "credit" : "debit";
  const absoluteDelta = Math.abs(delta);
  const departmentId = cleanText(targetData.departmentId);
  const batch = writeBatch(db);

  batch.set(entryRef, {
    userId: safeTargetUserId,
    userDisplayName: targetData.displayName || targetData.fullName || targetData.email || "EquiSaaS member",
    departmentId,
    parentDepartmentId: getParentDepartmentId(departmentId),
    sourceType: "admin_adjustment",
    sourceId: safeTargetUserId,
    points: absoluteDelta,
    direction,
    approvedBy: actorId,
    note: safeReason || `Super admin adjusted total points from ${currentTotalPoints} to ${safeNextTotalPoints}.`,
    createdAt: serverTimestamp(),
  });
  batch.set(
    targetRef,
    {
      totalPoints: increment(delta),
      lastLedgerId: entryRef.id,
      updatedAt: serverTimestamp(),
      updatedBy: actorId,
    },
    { merge: true },
  );

  applyLeaderboardDelta(batch, departmentId, delta, new Date());

  await batch.commit();

  await writeAdminAuditLog({
    actor,
    action: "adjust_user_points",
    entityType: "user",
    entityId: safeTargetUserId,
    departmentId,
    label: inferEntityLabel({ snapshot: targetData, entityId: safeTargetUserId, entityType: "user" }),
    summary: safeReason || `Adjusted total points to ${safeNextTotalPoints} (${direction} ${absoluteDelta}).`,
    before: {
      totalPoints: currentTotalPoints,
    },
    after: {
      totalPoints: safeNextTotalPoints,
      delta,
      ledgerEntryId: entryRef.id,
    },
  });

  return {
    changed: true,
    totalPoints: safeNextTotalPoints,
    delta,
    direction,
    ledgerEntryId: entryRef.id,
  };
}

export async function removeManagedUser({ targetUserId, actor }) {
  const actorId = assertSuperAdminActor(actor, "Only a super admin can remove a member from the active roster.");
  const nextTargetUserId = requireText(targetUserId, "Select a user first.");
  const restoreRef = getRestoreBinRef();
  const auditRef = getAdminAuditLogRef();

  await runTransaction(db, async (transaction) => {
    const targetRef = getUserRef(nextTargetUserId);
    const snap = await transaction.get(targetRef);
    if (!snap.exists()) {
      throw new Error("Selected user could not be found.");
    }

    const currentData = snap.data() || {};
    if (nextTargetUserId === actorId) {
      throw new Error("You cannot remove your own account from the active roster.");
    }

    const currentDepartmentId = cleanText(currentData.departmentId);
    if (currentDepartmentId) {
      transaction.set(
        getDepartmentRef(currentDepartmentId),
        { memberCount: increment(-1), updatedAt: serverTimestamp() },
        { merge: true },
      );
    }

    const restoreCounts = {};
    const restorePayload = buildRestoreBinPayload({
      actorId,
      actorRole: getActorRole(actor),
      action: "remove_member",
      entityType: "user_access",
      entityId: nextTargetUserId,
      departmentId: currentDepartmentId,
      label: inferEntityLabel({ snapshot: currentData, entityId: nextTargetUserId, entityType: "user" }),
      summary: "Archived the active roster assignment so it can be restored later.",
      snapshot: currentData,
      counts: restoreCounts,
    });
    transaction.set(restoreRef, restorePayload);
    transaction.set(
      auditRef,
      buildAdminAuditLogPayload({
        actorId,
        actorRole: getActorRole(actor),
        action: "remove_member",
        entityType: "user_access",
        entityId: nextTargetUserId,
        departmentId: currentDepartmentId,
        label: restorePayload.label,
        summary: "Removed the member from the active roster and cleared their department assignment.",
        restoreEntryId: restoreRef.id,
        counts: restoreCounts,
      }),
    );

    transaction.set(
      targetRef,
      {
        role: "member",
        roles: ["member"],
        status: "paused",
        departmentId: "",
        parentDepartmentId: "",
        isActive: false,
        removedAt: serverTimestamp(),
        removedBy: actorId,
        updatedAt: serverTimestamp(),
        updatedBy: actorId,
      },
      { merge: true },
    );
  });
}

export async function deleteCourseWithChildren({ courseId, actor }) {
  const actorId = assertSuperAdminActor(actor, "Only a super admin can remove a course from the LMS.");
  const nextCourseId = requireText(courseId, "Select a course first.");
  const courseRef = getCourseRef(nextCourseId);
  const courseSnap = await getDoc(courseRef);
  if (!courseSnap.exists()) {
    throw new Error("Selected course could not be found.");
  }

  const courseData = courseSnap.data() || {};
  const lessonsSnap = await getDocs(query(collection(db, "lessons"), where("courseId", "==", nextCourseId)));
  const lessonIds = lessonsSnap.docs.map((docSnap) => docSnap.id);
  const lessonRecords = lessonsSnap.docs.map((docSnap) => ({ id: docSnap.id, data: docSnap.data() || {} }));
  const courseTasksSnap = await getDocs(query(collection(db, "tasks"), where("courseId", "==", nextCourseId)));
  const lessonTaskSnaps = await Promise.all(
    lessonIds.map((lessonId) => getDocs(query(collection(db, "tasks"), where("lessonId", "==", lessonId)))),
  );

  const taskRefs = new Map();
  const taskRecords = [];
  courseTasksSnap.docs.forEach((docSnap) => {
    taskRefs.set(docSnap.id, docSnap.ref);
    taskRecords.push({ id: docSnap.id, data: docSnap.data() || {} });
  });
  lessonTaskSnaps.forEach((snap) => {
    snap.docs.forEach((docSnap) => {
      taskRefs.set(docSnap.id, docSnap.ref);
      taskRecords.push({ id: docSnap.id, data: docSnap.data() || {} });
    });
  });

  const batch = writeBatch(db);
  const restoreRef = getRestoreBinRef();
  const restoreCounts = { lessons: lessonRecords.length, tasks: taskRecords.length };
  const restorePayload = buildRestoreBinPayload({
    actorId,
    actorRole: getActorRole(actor),
    action: "delete_course_bundle",
    entityType: "course_bundle",
    entityId: nextCourseId,
    departmentId: cleanText(courseData.departmentId),
    label: inferEntityLabel({ snapshot: courseData, entityId: nextCourseId, entityType: "course" }),
    summary: "Archived the course together with its linked lessons and tasks before deletion.",
    snapshot: courseData,
    children: { lessons: lessonRecords, tasks: taskRecords },
    counts: restoreCounts,
  });
  batch.set(restoreRef, restorePayload);
  batch.set(
    getAdminAuditLogRef(),
    buildAdminAuditLogPayload({
      actorId,
      actorRole: getActorRole(actor),
      action: "delete_course_bundle",
      entityType: "course_bundle",
      entityId: nextCourseId,
      departmentId: cleanText(courseData.departmentId),
      label: restorePayload.label,
      summary: "Deleted a course together with all linked lessons and tasks.",
      restoreEntryId: restoreRef.id,
      counts: restoreCounts,
    }),
  );
  lessonsSnap.docs.forEach((docSnap) => batch.delete(docSnap.ref));
  taskRefs.forEach((taskRef) => batch.delete(taskRef));
  batch.delete(courseRef);
  batch.set(
    getDepartmentRef(courseData.departmentId),
    { courseCount: increment(-1), updatedAt: serverTimestamp() },
    { merge: true },
  );
  await batch.commit();

  return {
    deletedLessons: lessonsSnap.size,
    deletedTasks: taskRefs.size,
  };
}

export async function deleteLessonWithChildren({ lessonId, actor }) {
  const actorId = assertSuperAdminActor(actor, "Only a super admin can remove a lesson from the LMS.");
  const nextLessonId = requireText(lessonId, "Select a lesson first.");
  const lessonRef = getLessonRef(nextLessonId);
  const lessonSnap = await getDoc(lessonRef);
  if (!lessonSnap.exists()) {
    throw new Error("Selected lesson could not be found.");
  }

  const lessonData = lessonSnap.data() || {};
  const taskSnap = await getDocs(query(collection(db, "tasks"), where("lessonId", "==", nextLessonId)));
  const batch = writeBatch(db);
  const taskRecords = taskSnap.docs.map((docSnap) => ({ id: docSnap.id, data: docSnap.data() || {} }));
  const restoreRef = getRestoreBinRef();
  const restoreCounts = { tasks: taskRecords.length };
  const restorePayload = buildRestoreBinPayload({
    actorId,
    actorRole: getActorRole(actor),
    action: "delete_lesson_bundle",
    entityType: "lesson_bundle",
    entityId: nextLessonId,
    departmentId: cleanText(lessonData.departmentId),
    label: inferEntityLabel({ snapshot: lessonData, entityId: nextLessonId, entityType: "lesson" }),
    summary: "Archived the lesson together with its linked tasks before deletion.",
    snapshot: lessonData,
    children: { tasks: taskRecords },
    counts: restoreCounts,
  });
  batch.set(restoreRef, restorePayload);
  batch.set(
    getAdminAuditLogRef(),
    buildAdminAuditLogPayload({
      actorId,
      actorRole: getActorRole(actor),
      action: "delete_lesson_bundle",
      entityType: "lesson_bundle",
      entityId: nextLessonId,
      departmentId: cleanText(lessonData.departmentId),
      label: restorePayload.label,
      summary: "Deleted a lesson together with all linked tasks.",
      restoreEntryId: restoreRef.id,
      counts: restoreCounts,
    }),
  );

  if (lessonData.courseId) {
    const courseRef = getCourseRef(lessonData.courseId);
    const courseSnap = await getDoc(courseRef);
    if (courseSnap.exists()) {
      const courseData = courseSnap.data() || {};
      const nextLessonIds = Array.isArray(courseData.lessonIds)
        ? courseData.lessonIds.filter((id) => id !== nextLessonId)
        : [];
      batch.set(
        courseRef,
        {
          lessonIds: nextLessonIds,
          lessonCount: nextLessonIds.length,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
    }
  }

  taskSnap.docs.forEach((docSnap) => batch.delete(docSnap.ref));
  batch.delete(lessonRef);
  await batch.commit();

  return {
    deletedTasks: taskSnap.size,
  };
}

export async function deleteTaskRecord({ taskId, actor }) {
  const actorId = assertSuperAdminActor(actor, "Only a super admin can remove a task from the LMS.");
  const nextTaskId = requireText(taskId, "Select a task first.");
  const taskRef = getTaskRef(nextTaskId);
  const taskSnap = await getDoc(taskRef);
  if (!taskSnap.exists()) {
    throw new Error("Selected task could not be found.");
  }
  const taskData = taskSnap.data() || {};
  const restoreRef = getRestoreBinRef();
  const batch = writeBatch(db);
  const restorePayload = buildRestoreBinPayload({
    actorId,
    actorRole: getActorRole(actor),
    action: "delete_task",
    entityType: "task",
    entityId: nextTaskId,
    departmentId: cleanText(taskData.departmentId),
    label: inferEntityLabel({ snapshot: taskData, entityId: nextTaskId, entityType: "task" }),
    summary: "Archived the task before deletion.",
    snapshot: taskData,
  });
  batch.set(restoreRef, restorePayload);
  batch.set(
    getAdminAuditLogRef(),
    buildAdminAuditLogPayload({
      actorId,
      actorRole: getActorRole(actor),
      action: "delete_task",
      entityType: "task",
      entityId: nextTaskId,
      departmentId: cleanText(taskData.departmentId),
      label: restorePayload.label,
      summary: "Deleted one LMS task.",
      restoreEntryId: restoreRef.id,
    }),
  );
  batch.delete(taskRef);
  await batch.commit();
}

export async function deleteAnnouncementRecord({ announcementId, actor }) {
  const actorId = assertSuperAdminActor(actor, "Only a super admin can remove an announcement from the LMS.");
  const nextAnnouncementId = requireText(announcementId, "Select an announcement first.");
  const announcementRef = getAnnouncementRef(nextAnnouncementId);
  const announcementSnap = await getDoc(announcementRef);
  if (!announcementSnap.exists()) {
    throw new Error("Selected announcement could not be found.");
  }
  const announcementData = announcementSnap.data() || {};
  const restoreRef = getRestoreBinRef();
  const batch = writeBatch(db);
  const restorePayload = buildRestoreBinPayload({
    actorId,
    actorRole: getActorRole(actor),
    action: "delete_announcement",
    entityType: "announcement",
    entityId: nextAnnouncementId,
    departmentId: cleanText(announcementData.departmentId),
    label: inferEntityLabel({ snapshot: announcementData, entityId: nextAnnouncementId, entityType: "announcement" }),
    summary: "Archived the announcement before deletion.",
    snapshot: announcementData,
  });
  batch.set(restoreRef, restorePayload);
  batch.set(
    getAdminAuditLogRef(),
    buildAdminAuditLogPayload({
      actorId,
      actorRole: getActorRole(actor),
      action: "delete_announcement",
      entityType: "announcement",
      entityId: nextAnnouncementId,
      departmentId: cleanText(announcementData.departmentId),
      label: restorePayload.label,
      summary: "Deleted one official announcement.",
      restoreEntryId: restoreRef.id,
    }),
  );
  batch.delete(announcementRef);
  await batch.commit();
}

export async function deleteCertificateRecord({ certificateId, actor }) {
  const actorId = assertSuperAdminActor(actor, "Only a super admin can remove a certificate record from the LMS.");
  const nextCertificateId = requireText(certificateId, "Select a certificate first.");
  const certificateRef = getCertificateRef(nextCertificateId);
  const certificateSnap = await getDoc(certificateRef);
  if (!certificateSnap.exists()) {
    throw new Error("Selected certificate could not be found.");
  }
  const certificateData = certificateSnap.data() || {};
  const restoreRef = getRestoreBinRef();
  const batch = writeBatch(db);
  const restorePayload = buildRestoreBinPayload({
    actorId,
    actorRole: getActorRole(actor),
    action: "delete_certificate",
    entityType: "certificate",
    entityId: nextCertificateId,
    departmentId: cleanText(certificateData.departmentId),
    label: inferEntityLabel({ snapshot: certificateData, entityId: nextCertificateId, entityType: "certificate" }),
    summary: "Archived the certificate record before deletion.",
    snapshot: certificateData,
  });
  batch.set(restoreRef, restorePayload);
  batch.set(
    getAdminAuditLogRef(),
    buildAdminAuditLogPayload({
      actorId,
      actorRole: getActorRole(actor),
      action: "delete_certificate",
      entityType: "certificate",
      entityId: nextCertificateId,
      departmentId: cleanText(certificateData.departmentId),
      label: restorePayload.label,
      summary: "Deleted one certificate record.",
      restoreEntryId: restoreRef.id,
    }),
  );
  batch.delete(certificateRef);
  await batch.commit();
}

export async function restoreFromRestoreBin({ entryId, actor }) {
  const actorId = assertSuperAdminActor(actor, "Only a super admin can restore archived records.");
  const nextEntryId = requireText(entryId, "Select an archived record first.");
  const restoreRef = getRestoreBinRef(nextEntryId);
  const restoreSnap = await getDoc(restoreRef);
  if (!restoreSnap.exists()) {
    throw new Error("The archived record could not be found.");
  }

  const entry = restoreSnap.data() || {};
  if (entry.status === "restored") {
    throw new Error("This archived record has already been restored.");
  }

  const entityType = cleanText(entry.entityType);
  const entityId = cleanText(entry.entityId);
  const snapshot = safeMap(entry.snapshot);
  const children = safeMap(entry.children);
  const counts = safeMap(entry.counts);
  const departmentId = cleanText(entry.departmentId || snapshot.departmentId);
  const label = inferEntityLabel({ fallback: entry.label, snapshot, entityId, entityType });

  if (!entityType || !entityId) {
    throw new Error("The archived record is missing restore metadata.");
  }

  const finalizeRestoreInBatch = (batch) => {
    batch.set(
      restoreRef,
      {
        status: "restored",
        restoredAt: serverTimestamp(),
        restoredBy: actorId,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
    batch.set(
      getAdminAuditLogRef(),
      buildAdminAuditLogPayload({
        actorId,
        actorRole: getActorRole(actor),
        action: "restore",
        entityType,
        entityId,
        departmentId,
        label,
        summary: "Restored an archived record back into the live LMS workspace.",
        restoreEntryId: nextEntryId,
        counts,
      }),
    );
  };

  if (entityType === "user_access") {
    await runTransaction(db, async (transaction) => {
      const userRef = getUserRef(entityId);
      const currentUserSnap = await transaction.get(userRef);
      const currentUserData = currentUserSnap.exists() ? currentUserSnap.data() || {} : {};
      const currentDepartmentId = cleanText(currentUserData.departmentId);
      const targetDepartmentId = cleanText(snapshot.departmentId);

      if (currentDepartmentId && currentDepartmentId !== targetDepartmentId) {
        transaction.set(
          getDepartmentRef(currentDepartmentId),
          { memberCount: increment(-1), updatedAt: serverTimestamp() },
          { merge: true },
        );
      }

      if (targetDepartmentId && currentDepartmentId !== targetDepartmentId) {
        transaction.set(
          getDepartmentRef(targetDepartmentId),
          { memberCount: increment(1), updatedAt: serverTimestamp() },
          { merge: true },
        );
      }

      transaction.set(
        userRef,
        {
          ...snapshot,
          isActive: snapshot.isActive ?? true,
          removedAt: null,
          removedBy: null,
          updatedAt: serverTimestamp(),
          updatedBy: actorId,
          restoredAt: serverTimestamp(),
          restoredBy: actorId,
        },
        { merge: false },
      );
      transaction.set(
        restoreRef,
        {
          status: "restored",
          restoredAt: serverTimestamp(),
          restoredBy: actorId,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
      transaction.set(
        getAdminAuditLogRef(),
        buildAdminAuditLogPayload({
          actorId,
          actorRole: getActorRole(actor),
          action: "restore",
          entityType,
          entityId,
          departmentId: targetDepartmentId,
          label,
          summary: "Restored a member back into the active roster and previous department scope.",
          restoreEntryId: nextEntryId,
          counts,
        }),
      );
    });
    return { entityType, entityId };
  }

  const batch = writeBatch(db);

  if (entityType === "course_bundle") {
    const courseRef = getCourseRef(entityId);
    const courseSnap = await getDoc(courseRef);
    batch.set(
      courseRef,
      { ...snapshot, updatedAt: serverTimestamp(), restoredAt: serverTimestamp(), restoredBy: actorId },
      { merge: false },
    );
    (Array.isArray(children.lessons) ? children.lessons : []).forEach((item) => {
      batch.set(
        getLessonRef(item.id),
        { ...safeMap(item.data), updatedAt: serverTimestamp(), restoredAt: serverTimestamp(), restoredBy: actorId },
        { merge: false },
      );
    });
    (Array.isArray(children.tasks) ? children.tasks : []).forEach((item) => {
      batch.set(
        getTaskRef(item.id),
        { ...safeMap(item.data), updatedAt: serverTimestamp(), restoredAt: serverTimestamp(), restoredBy: actorId },
        { merge: false },
      );
    });
    if (departmentId && !courseSnap.exists()) {
      batch.set(
        getDepartmentRef(departmentId),
        { courseCount: increment(1), updatedAt: serverTimestamp() },
        { merge: true },
      );
    }
  } else if (entityType === "lesson_bundle") {
    batch.set(
      getLessonRef(entityId),
      { ...snapshot, updatedAt: serverTimestamp(), restoredAt: serverTimestamp(), restoredBy: actorId },
      { merge: false },
    );
    (Array.isArray(children.tasks) ? children.tasks : []).forEach((item) => {
      batch.set(
        getTaskRef(item.id),
        { ...safeMap(item.data), updatedAt: serverTimestamp(), restoredAt: serverTimestamp(), restoredBy: actorId },
        { merge: false },
      );
    });
    if (snapshot.courseId) {
      const courseRef = getCourseRef(snapshot.courseId);
      const courseSnap = await getDoc(courseRef);
      if (courseSnap.exists()) {
        const courseData = courseSnap.data() || {};
        const nextLessonIds = Array.from(new Set([...(Array.isArray(courseData.lessonIds) ? courseData.lessonIds : []), entityId]));
        batch.set(
          courseRef,
          { lessonIds: nextLessonIds, lessonCount: nextLessonIds.length, updatedAt: serverTimestamp() },
          { merge: true },
        );
      }
    }
  } else if (entityType === "task") {
    batch.set(
      getTaskRef(entityId),
      { ...snapshot, updatedAt: serverTimestamp(), restoredAt: serverTimestamp(), restoredBy: actorId },
      { merge: false },
    );
  } else if (entityType === "announcement") {
    batch.set(
      getAnnouncementRef(entityId),
      { ...snapshot, updatedAt: serverTimestamp(), restoredAt: serverTimestamp(), restoredBy: actorId },
      { merge: false },
    );
  } else if (entityType === "certificate") {
    batch.set(
      getCertificateRef(entityId),
      { ...snapshot, updatedAt: serverTimestamp(), restoredAt: serverTimestamp(), restoredBy: actorId },
      { merge: false },
    );
  } else if (entityType === "certificate_template") {
    batch.set(
      getCertificateTemplateRef(entityId),
      { ...snapshot, updatedAt: serverTimestamp(), restoredAt: serverTimestamp(), restoredBy: actorId },
      { merge: false },
    );
  } else {
    throw new Error("This archived record type cannot be restored yet.");
  }

  finalizeRestoreInBatch(batch);
  await batch.commit();
  return { entityType, entityId };
}

export async function recordAttendanceAndCredit({
  actor,
  targetUserId,
  departmentId,
  eventType,
  eventTitle,
  points,
}) {
  const actorId = getActorId(actor);
  const actorRole = getActorRole(actor);
  if (!canAwardPoints(actorRole)) {
    throw new Error("Only approved roles can record attendance credits.");
  }
  if (!targetUserId) {
    throw new Error("Select a member first.");
  }
  if (actorId === targetUserId) {
    throw new Error("You cannot award points to yourself.");
  }

  const attendanceRef = doc(collection(db, "attendance"));
  const ledgerRef = doc(db, "pointsLedger", `attendance_${attendanceRef.id}`);
  const batch = writeBatch(db);
  const safePoints = Number(points || 0);

  batch.set(attendanceRef, {
    userId: targetUserId,
    departmentId,
    parentDepartmentId: getParentDepartmentId(departmentId),
    eventType,
    eventTitle,
    status: "present",
    pointsAwarded: safePoints,
    recordedBy: actorId,
    recordedAt: serverTimestamp(),
  });

  if (safePoints > 0) {
    batch.set(ledgerRef, {
      userId: targetUserId,
      departmentId,
      parentDepartmentId: getParentDepartmentId(departmentId),
      sourceType: "attendance",
      sourceId: attendanceRef.id,
      points: safePoints,
      direction: "credit",
      approvedBy: actorId,
      note: `${eventType}: ${eventTitle}`,
      createdAt: serverTimestamp(),
    });
    batch.set(getUserRef(targetUserId), { totalPoints: increment(safePoints), lastLedgerId: `attendance_${attendanceRef.id}`, updatedAt: serverTimestamp() }, { merge: true });
    
    applyLeaderboardDelta(batch, departmentId, safePoints, new Date());
  }

  await batch.commit();
  return attendanceRef.id;
}

export async function submitMentorRecommendation({
  actor,
  submissionId,
  recommendation,
  comment,
  recommendedPoints,
}) {
  const actorId = getActorId(actor);
  if (!actorId) {
    throw new Error("Reviewer identity is missing.");
  }
  const submissionSnap = await safeGetSubmissionSnapshot(getSubmissionRef(submissionId));
  if (!submissionSnap?.exists()) {
    throw new Error("Submission not found.");
  }
  if (finalizedSubmissionStatuses.has(submissionSnap.data()?.status || "")) {
    throw new Error("This submission is already finalized and can no longer be changed.");
  }
  const safeRecommendation = cleanText(recommendation) || "approve";
  await updateDoc(getSubmissionRef(submissionId), {
    recommendation: safeRecommendation,
    reviewComment: comment || "",
    recommendedBy: actorId,
    recommendedAt: serverTimestamp(),
    recommendedPoints: sanitizePoints(recommendedPoints),
    updatedAt: serverTimestamp(),
  });
}

export async function finalizeSubmissionReview({
  actor,
  submissionId,
  status,
  reviewComment,
  awardedPoints,
}) {
  const actorId = getActorId(actor);
  const actorRole = getActorRole(actor);
  if (!canAwardPoints(actorRole)) {
    throw new Error("Only points approvers can finalize reviews.");
  }
  if (!["approved", "revision_requested", "rejected"].includes(status)) {
    throw new Error("Choose a valid review decision.");
  }

  let userIdForNotification = null;

  await runTransaction(db, async (transaction) => {
    const submissionRef = getSubmissionRef(submissionId);
    const submissionSnap = await transaction.get(submissionRef);
    if (!submissionSnap.exists()) {
      throw new Error("Submission not found.");
    }

    const submission = submissionSnap.data();
    userIdForNotification = submission.userId;
    if (submission.userId === actorId) {
      throw new Error("You cannot approve or reject your own submission.");
    }
    if (finalizedSubmissionStatuses.has(submission.status || "")) {
      throw new Error("This submission is already finalized and can no longer be changed.");
    }
    const safePoints = sanitizePoints(awardedPoints);
    const ledgerRef = doc(db, "pointsLedger", `submission_${submissionId}`);
    const previousPoints = submission.status === "approved" ? Number(submission.awardedPoints || 0) : 0;
    const delta = status === "approved" ? safePoints - previousPoints : -previousPoints;
    const previousApproved = submission.status === "approved";
    const nextApproved = status === "approved";
    const completedTaskDelta = previousApproved === nextApproved ? 0 : nextApproved ? 1 : -1;
    const shouldUpdateUserSummary = delta !== 0 || completedTaskDelta !== 0;

    transaction.set(
      submissionRef,
      {
        status,
        reviewComment: reviewComment || "",
        awardedPoints: status === "approved" ? safePoints : 0,
        reviewedBy: actorId,
        reviewedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    if (status === "approved") {
      transaction.set(
        ledgerRef,
        {
          userId: submission.userId,
          departmentId: submission.departmentId,
          parentDepartmentId: getParentDepartmentId(submission.departmentId),
          sourceType: "task_submission",
          sourceId: submissionId,
          points: safePoints,
          direction: "credit",
          approvedBy: actorId,
          note: reviewComment || "Task approved",
          createdAt: serverTimestamp(),
        },
        { merge: true },
      );
    } else {
      transaction.delete(ledgerRef);
    }

    if (shouldUpdateUserSummary) {
      transaction.set(
        getUserRef(submission.userId),
        {
          totalPoints: increment(delta),
          completedTaskCount: increment(completedTaskDelta),
          lastLedgerId: `submission_${submissionId}`,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
    }

    if (delta !== 0) {
      applyLeaderboardDelta(transaction, submission.departmentId, delta, new Date());
    }
  });

  // Background Push Notification Trigger (Non-blocking)
  if (userIdForNotification) {
    try {
      const userSnap = await getDoc(getUserRef(userIdForNotification));
      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.fcmTokens && userData.fcmTokens.length > 0) {
          fetch("https://equisaas-fcm-notifier.equisaas-bd.workers.dev", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${process.env.NEXT_PUBLIC_FCM_SECRET_KEY || "temp-secret"}`
            },
            body: JSON.stringify({
              tokens: userData.fcmTokens,
              title: "Task Update",
              body: `Your submission has been ${status}.`,
              data: { submissionId, status }
            })
          }).catch(() => {}); // Fire and forget
        }
      }
    } catch (e) {
      // Ignore push notification errors
    }
  }
}

export async function submitGlcApplication({ fullName, email, glcTitle }) {
  const ref = doc(collection(db, "glcApplications"));
  await setDoc(ref, {
    id: ref.id,
    fullName,
    email,
    glcTitle: glcTitle || "Professional Communication & Spoken English Certification",
    status: "pending",
    certificateId: null,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function fetchGlcApplications() {
  const q = query(collection(db, "glcApplications"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    ...d.data(),
    createdAt: d.data().createdAt?.toDate()?.toISOString() || new Date().toISOString(),
  }));
}

export async function updateGlcApplicationStatus(applicationId, updateData) {
  const ref = doc(db, "glcApplications", applicationId);
  await updateDoc(ref, {
    ...updateData,
    updatedAt: serverTimestamp(),
  });
}

/* ── Future Dimensions: Governance ── */

export async function fetchProposals(isActive = true) {
  const q = query(
    collection(db, "proposals"),
    where("status", "==", isActive ? "active" : "closed"),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  return mapDocs(snap);
}

export async function submitVote({ actor, proposalId, choice }) {
  const uid = getActorId(actor);
  if (!uid) throw new Error("Auth required");
  
  const voteId = `${proposalId}_${uid}`;
  const voteRef = doc(db, "votes", voteId);
  
  // Weights are handled by security rules but we send it for clarity
  await setDoc(voteRef, {
    userId: uid,
    proposalId,
    choice,
    weight: actor?.totalPoints || 0,
    createdAt: serverTimestamp(),
  });
}

/* ── Future Dimensions: Community ── */

export async function fetchFeeds(count = 20) {
  const q = query(
    collection(db, "feeds"),
    orderBy("createdAt", "desc"),
    limit(count),
  );
  const snap = await getDocs(q);
  return mapDocs(snap);
}

export async function createFeedEvent({ actor, type, message, departmentId }) {
  const uid = getActorId(actor);
  if (!uid) return; // Silent fail for non-essential feed events
  
  await setDoc(doc(collection(db, "feeds")), {
    userId: uid,
    userDisplayName: actor?.displayName || "Anonymous Builder",
    type,
    message,
    departmentId: departmentId || "",
    createdAt: serverTimestamp(),
  });
}

/* ── Future Dimensions: Public Profiles ── */

export async function fetchPublicProfile(uid) {
  const snap = await getDoc(doc(db, "publicProfiles", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updatePublicProfile(uid, profileData) {
  const ref = doc(db, "publicProfiles", uid);
  await setDoc(ref, {
    ...profileData,
    uid,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

