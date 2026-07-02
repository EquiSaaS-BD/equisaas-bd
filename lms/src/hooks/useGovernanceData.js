import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { DEPARTMENTS, PATHS } from "@/data/structure.mjs";
import { formatDistrictLabel } from "@/data/bangladesh-districts.js";
import { db as firebaseDb, isConfigured } from "@/lib/firebaseClient";
import {
  buildDefaultUserDoc,
  buildScopeSummaryFromScopes,
  canApproveScopedTasks,
  canCreateScopedTasks,
  canManageScopes,
  canReviewScopedTasks,
  entityInScope,
  getPrimaryRole,
  getRoleLabel,
  getRolePermissions,
  isGlobalAdmin,
  isManagementRole,
  normalizeRoles,
  normalizeScopeSummary,
  taskIsAssignedToUser,
} from "@/lib/governance";

const CACHE_PREFIX = "eq_governance";
const CACHE_TTL_MS = 1000 * 60 * 5;

const STATUS_SORT = {
  draft: 0,
  open: 1,
  "in-progress": 2,
  submitted: 3,
  "needs-revision": 4,
  approved: 5,
  closed: 6,
};

const TASK_REVIEW_STATES = new Set(["ready-for-manager", "ready-for-admin", "pending-peer", "peer-reviewing", "peer-rework"]);

const readCache = (key, fallback) => {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (!parsed?.savedAt || Date.now() - parsed.savedAt > CACHE_TTL_MS) return fallback;
    return parsed.value ?? fallback;
  } catch {
    return fallback;
  }
};

const writeCache = (key, value) => {
  try {
    sessionStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), value }));
  } catch {}
};

const toMillis = (value) => {
  if (!value) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value?.seconds === "number") return value.seconds * 1000;
  return 0;
};

const byLatestActivityDesc = (left, right) =>
  toMillis(right?.latestActivityAt || right?.updatedAt || right?.submittedAt) -
  toMillis(left?.latestActivityAt || left?.updatedAt || left?.submittedAt);

const byTaskFreshness = (left, right) =>
  toMillis(right?.updatedAt || right?.publishedAt || right?.createdAt) -
  toMillis(left?.updatedAt || left?.publishedAt || left?.createdAt);

const byCreatedAtDesc = (left, right) => toMillis(right?.createdAt) - toMillis(left?.createdAt);

const mapDocs = (snap) => snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));

const mergeById = (...lists) => {
  const map = new Map();
  lists.flat().forEach((item) => {
    if (!item?.id) return;
    const existing = map.get(item.id);
    if (!existing || byLatestActivityDesc(item, existing) < 0) {
      map.set(item.id, item);
    }
  });
  return [...map.values()];
};

const getCollectionCacheKey = (type, userId = "anon") => `${CACHE_PREFIX}:${type}:${userId}`;

const hasRole = (userData = {}, roles = [], claimsAdmin = false) =>
  normalizeRoles(userData, claimsAdmin).some((role) => roles.includes(role));

const getPathLessonCount = (pathId = "") => {
  const pathMeta = PATHS.find((item) => item.id === pathId);
  return (pathMeta?.modules || []).reduce((sum, moduleItem) => sum + (moduleItem.lessons || []).length, 0);
};

const getPathModuleCount = (pathId = "") => {
  const pathMeta = PATHS.find((item) => item.id === pathId);
  return (pathMeta?.modules || []).length || 0;
};

const getModuleCompletionCount = (pathId = "", completedLessonIds = []) => {
  const pathMeta = PATHS.find((item) => item.id === pathId);
  const completed = new Set(completedLessonIds);
  return (pathMeta?.modules || []).filter((moduleItem) => (moduleItem.lessons || []).every((lesson) => completed.has(lesson.id))).length;
};

const SUBDEPARTMENT_META = DEPARTMENTS.flatMap((department) =>
  (department.subdepartments || []).map((subdepartment) => ({
    ...subdepartment,
    departmentId: department.id,
    departmentTitleEn: department.titleEn,
    departmentTitleBn: department.titleBn,
  })),
);

const getSubdepartmentMeta = (subdepartmentId = "") =>
  SUBDEPARTMENT_META.find((item) => item.id === subdepartmentId) || null;

const getScopedPathIds = (currentUser = {}, claimsAdmin = false) => {
  if (isGlobalAdmin(currentUser, claimsAdmin)) return PATHS.map((item) => item.id);
  const scopeSummary = normalizeScopeSummary(currentUser?.scopeSummary);
  const departmentIds = new Set([currentUser?.departmentId, ...scopeSummary.departmentIds].filter(Boolean));
  const subdepartmentIds = new Set([currentUser?.subdepartmentId, ...scopeSummary.subdepartmentIds].filter(Boolean));
  const pathIds = new Set([currentUser?.pathId, ...scopeSummary.pathIds].filter(Boolean));

  PATHS.forEach((pathItem) => {
    if (departmentIds.has(pathItem.deptId) || subdepartmentIds.has(pathItem.subdeptId)) {
      pathIds.add(pathItem.id);
    }
  });

  return [...pathIds];
};

const getScopedDepartmentIds = (currentUser = {}, claimsAdmin = false) => {
  if (isGlobalAdmin(currentUser, claimsAdmin)) return DEPARTMENTS.map((item) => item.id);
  const scopeSummary = normalizeScopeSummary(currentUser?.scopeSummary);
  const departmentIds = new Set([currentUser?.departmentId, ...scopeSummary.departmentIds].filter(Boolean));

  getScopedPathIds(currentUser, claimsAdmin).forEach((pathId) => {
    const pathMeta = PATHS.find((item) => item.id === pathId);
    if (pathMeta?.deptId) {
      departmentIds.add(pathMeta.deptId);
    }
  });

  return [...departmentIds];
};

const buildSnapshotId = (...parts) => parts.filter(Boolean).join("__");

const isMemberActiveSince = (timestampValue, thresholdMs) => {
  const millis = toMillis(timestampValue);
  return millis > 0 && millis >= thresholdMs;
};

const getTaskSummaryFromSubmissions = (submissions = [], reviewQueue = []) => ({
  submitted: submissions.filter((item) => item?.status === "submitted").length,
  approved: submissions.filter((item) => item?.status === "approved").length,
  needsRevision: submissions.filter((item) => item?.status === "needs-revision").length,
  pendingReview: reviewQueue.filter((item) => item?.state && item.state !== "approved").length,
});

const fetchAllUsers = async (db) => {
  const snap = await getDocs(query(collection(db, "users"), limit(250)));
  return mapDocs(snap);
};

const fetchManagementScopes = async (db, currentUser, claimsAdmin = false) => {
  if (!currentUser?.uid) return [];
  if (canManageScopes(currentUser, claimsAdmin)) {
    const snap = await getDocs(query(collection(db, "managementScopes"), limit(200)));
    return mapDocs(snap);
  }
  const snap = await getDocs(query(collection(db, "managementScopes"), where("managerUid", "==", currentUser.uid), limit(80)));
  return mapDocs(snap);
};

const fetchTasksForUser = async (db, currentUser, claimsAdmin = false) => {
  if (!currentUser?.uid) return [];
  const scopeSummary = normalizeScopeSummary(currentUser?.scopeSummary);
  const fetches = [];

  if (isGlobalAdmin(currentUser, claimsAdmin)) {
    fetches.push(getDocs(query(collection(db, "departmentTasks"), limit(180))).then(mapDocs));
  } else {
    if (currentUser?.uid) {
      fetches.push(getDocs(query(collection(db, "departmentTasks"), where("assigneeIds", "array-contains", currentUser.uid), limit(80))).then(mapDocs));
      fetches.push(getDocs(query(collection(db, "departmentTasks"), where("managerUid", "==", currentUser.uid), limit(80))).then(mapDocs));
    }
    if (currentUser?.departmentId) fetches.push(getDocs(query(collection(db, "departmentTasks"), where("departmentId", "==", currentUser.departmentId), limit(80))).then(mapDocs));
    if (currentUser?.subdepartmentId) fetches.push(getDocs(query(collection(db, "departmentTasks"), where("subdepartmentId", "==", currentUser.subdepartmentId), limit(80))).then(mapDocs));
    if (currentUser?.pathId) fetches.push(getDocs(query(collection(db, "departmentTasks"), where("pathId", "==", currentUser.pathId), limit(80))).then(mapDocs));
    if (currentUser?.squadId) fetches.push(getDocs(query(collection(db, "departmentTasks"), where("squadId", "==", currentUser.squadId), limit(80))).then(mapDocs));

    scopeSummary.departmentIds.forEach((departmentId) => {
      if (departmentId && departmentId !== currentUser?.departmentId) {
        fetches.push(getDocs(query(collection(db, "departmentTasks"), where("departmentId", "==", departmentId), limit(80))).then(mapDocs));
      }
    });
    scopeSummary.subdepartmentIds.forEach((subdepartmentId) => {
      if (subdepartmentId && subdepartmentId !== currentUser?.subdepartmentId) {
        fetches.push(getDocs(query(collection(db, "departmentTasks"), where("subdepartmentId", "==", subdepartmentId), limit(80))).then(mapDocs));
      }
    });
    scopeSummary.pathIds.forEach((pathId) => {
      if (pathId && pathId !== currentUser?.pathId) {
        fetches.push(getDocs(query(collection(db, "departmentTasks"), where("pathId", "==", pathId), limit(80))).then(mapDocs));
      }
    });
    scopeSummary.squadIds.forEach((squadId) => {
      if (squadId && squadId !== currentUser?.squadId) {
        fetches.push(getDocs(query(collection(db, "departmentTasks"), where("squadId", "==", squadId), limit(80))).then(mapDocs));
      }
    });
  }

  const results = await Promise.all(fetches);
  return mergeById(...results)
    .filter((task) =>
      isManagementRole(currentUser, claimsAdmin)
        ? entityInScope(scopeSummary, task) || String(task?.managerUid || "") === currentUser.uid
        : taskIsAssignedToUser(task, currentUser, claimsAdmin),
    )
    .sort(byTaskFreshness);
};

const fetchTaskSubmissionsForUser = async (db, currentUser, claimsAdmin = false) => {
  if (!currentUser?.uid) return [];
  const scopeSummary = normalizeScopeSummary(currentUser?.scopeSummary);
  const fetches = [];

  if (isGlobalAdmin(currentUser, claimsAdmin)) {
    fetches.push(getDocs(query(collection(db, "taskSubmissions"), limit(200))).then(mapDocs));
  } else {
    fetches.push(getDocs(query(collection(db, "taskSubmissions"), where("uid", "==", currentUser.uid), limit(120))).then(mapDocs));
    if (canReviewScopedTasks(currentUser, claimsAdmin)) {
      if (currentUser?.departmentId) fetches.push(getDocs(query(collection(db, "taskSubmissions"), where("departmentId", "==", currentUser.departmentId), limit(120))).then(mapDocs));
      if (currentUser?.subdepartmentId) fetches.push(getDocs(query(collection(db, "taskSubmissions"), where("subdepartmentId", "==", currentUser.subdepartmentId), limit(120))).then(mapDocs));
      if (currentUser?.pathId) fetches.push(getDocs(query(collection(db, "taskSubmissions"), where("pathId", "==", currentUser.pathId), limit(120))).then(mapDocs));
      if (currentUser?.squadId) fetches.push(getDocs(query(collection(db, "taskSubmissions"), where("squadId", "==", currentUser.squadId), limit(120))).then(mapDocs));
      scopeSummary.departmentIds.forEach((departmentId) => {
        if (departmentId && departmentId !== currentUser?.departmentId) {
          fetches.push(getDocs(query(collection(db, "taskSubmissions"), where("departmentId", "==", departmentId), limit(120))).then(mapDocs));
        }
      });
      scopeSummary.subdepartmentIds.forEach((subdepartmentId) => {
        if (subdepartmentId && subdepartmentId !== currentUser?.subdepartmentId) {
          fetches.push(getDocs(query(collection(db, "taskSubmissions"), where("subdepartmentId", "==", subdepartmentId), limit(120))).then(mapDocs));
        }
      });
      scopeSummary.pathIds.forEach((pathId) => {
        if (pathId && pathId !== currentUser?.pathId) {
          fetches.push(getDocs(query(collection(db, "taskSubmissions"), where("pathId", "==", pathId), limit(120))).then(mapDocs));
        }
      });
      scopeSummary.squadIds.forEach((squadId) => {
        if (squadId && squadId !== currentUser?.squadId) {
          fetches.push(getDocs(query(collection(db, "taskSubmissions"), where("squadId", "==", squadId), limit(120))).then(mapDocs));
        }
      });
    }
  }

  const results = await Promise.all(fetches);
  return mergeById(...results)
    .filter((submission) => String(submission?.uid || "") === currentUser.uid || entityInScope(scopeSummary, submission) || isGlobalAdmin(currentUser, claimsAdmin))
    .sort(byLatestActivityDesc);
};

const fetchTaskReviewQueue = async (db, currentUser, claimsAdmin = false) => {
  if (!currentUser?.uid) return [];
  const scopeSummary = normalizeScopeSummary(currentUser?.scopeSummary);
  const fetches = [];

  if (isGlobalAdmin(currentUser, claimsAdmin)) {
    fetches.push(getDocs(query(collection(db, "reviewQueue"), limit(160))).then(mapDocs));
  } else {
    fetches.push(getDocs(query(collection(db, "reviewQueue"), where("uid", "==", currentUser.uid), limit(100))).then(mapDocs));
    if (canReviewScopedTasks(currentUser, claimsAdmin)) {
      if (currentUser?.departmentId) fetches.push(getDocs(query(collection(db, "reviewQueue"), where("departmentId", "==", currentUser.departmentId), limit(120))).then(mapDocs));
      if (currentUser?.subdepartmentId) fetches.push(getDocs(query(collection(db, "reviewQueue"), where("subdepartmentId", "==", currentUser.subdepartmentId), limit(120))).then(mapDocs));
      if (currentUser?.pathId) fetches.push(getDocs(query(collection(db, "reviewQueue"), where("pathId", "==", currentUser.pathId), limit(120))).then(mapDocs));
      if (currentUser?.squadId) fetches.push(getDocs(query(collection(db, "reviewQueue"), where("squadId", "==", currentUser.squadId), limit(120))).then(mapDocs));
      scopeSummary.departmentIds.forEach((departmentId) => {
        if (departmentId && departmentId !== currentUser?.departmentId) {
          fetches.push(getDocs(query(collection(db, "reviewQueue"), where("departmentId", "==", departmentId), limit(120))).then(mapDocs));
        }
      });
      scopeSummary.subdepartmentIds.forEach((subdepartmentId) => {
        if (subdepartmentId && subdepartmentId !== currentUser?.subdepartmentId) {
          fetches.push(getDocs(query(collection(db, "reviewQueue"), where("subdepartmentId", "==", subdepartmentId), limit(120))).then(mapDocs));
        }
      });
      scopeSummary.pathIds.forEach((pathId) => {
        if (pathId && pathId !== currentUser?.pathId) {
          fetches.push(getDocs(query(collection(db, "reviewQueue"), where("pathId", "==", pathId), limit(120))).then(mapDocs));
        }
      });
      scopeSummary.squadIds.forEach((squadId) => {
        if (squadId && squadId !== currentUser?.squadId) {
          fetches.push(getDocs(query(collection(db, "reviewQueue"), where("squadId", "==", squadId), limit(120))).then(mapDocs));
        }
      });
    }
  }

  const results = await Promise.all(fetches);
  return mergeById(...results)
    .filter((item) => item?.sourceType === "task")
    .filter((item) => String(item?.uid || "") === currentUser.uid || entityInScope(scopeSummary, item) || isGlobalAdmin(currentUser, claimsAdmin))
    .sort((left, right) => {
      const leftPriority = TASK_REVIEW_STATES.has(left?.state) ? 0 : 1;
      const rightPriority = TASK_REVIEW_STATES.has(right?.state) ? 0 : 1;
      if (leftPriority !== rightPriority) return leftPriority - rightPriority;
      return byLatestActivityDesc(left, right);
    });
};

const fetchReportingSnapshots = async (db, currentUser, claimsAdmin = false) => {
  const scopeSummary = normalizeScopeSummary(currentUser?.scopeSummary);
  const platform =
    canManageScopes(currentUser, claimsAdmin) || hasRole(currentUser, ["core-management"], claimsAdmin)
      ? (await getDoc(doc(db, "reportingSnapshots", "platform", "current"))).data() || null
      : null;

  const departmentIds = getScopedDepartmentIds(currentUser, claimsAdmin);
  const pathIds = getScopedPathIds(currentUser, claimsAdmin);

  const departmentDocs = await Promise.all(
    departmentIds.map(async (departmentId) => {
      const snap = await getDoc(doc(db, "reportingSnapshots", "departments", departmentId));
      return snap.exists() ? { id: departmentId, ...snap.data() } : null;
    }),
  );

  const pathDocs = await Promise.all(
    pathIds.map(async (pathId) => {
      const snap = await getDoc(doc(db, "reportingSnapshots", "paths", pathId));
      return snap.exists() ? { id: pathId, ...snap.data() } : null;
    }),
  );

  const subdepartmentDocs = await Promise.all(
    pathIds.map(async (pathId) => {
      const snap = await getDoc(doc(db, "reportingSnapshots", "subdepartments", pathId));
      return snap.exists() ? { id: pathId, ...snap.data() } : null;
    }),
  );

  const districtDocs = pathIds.length
    ? mergeById(
        ...(await Promise.all(
          pathIds.map((pathId) =>
            getDocs(query(collection(db, "reportingSnapshots", "districts"), where("pathId", "==", pathId), limit(80))).then(mapDocs),
          ),
        )),
      )
    : [];

  let memberDocs = [];
  if (isGlobalAdmin(currentUser, claimsAdmin)) {
    memberDocs = mapDocs(await getDocs(query(collection(db, "reportingSnapshots", "members"), limit(160))));
  } else if (currentUser?.uid) {
    const ownSnap = await getDoc(doc(db, "reportingSnapshots", "members", currentUser.uid));
    if (ownSnap.exists()) memberDocs.push({ id: currentUser.uid, ...ownSnap.data() });
    if (isManagementRole(currentUser, claimsAdmin)) {
      const fetches = [];
      departmentIds.forEach((departmentId) => {
        if (departmentId) fetches.push(getDocs(query(collection(db, "reportingSnapshots", "members"), where("departmentId", "==", departmentId), limit(120))).then(mapDocs));
      });
      Array.from(new Set([currentUser?.subdepartmentId, ...scopeSummary.subdepartmentIds].filter(Boolean))).forEach((subdepartmentId) => {
        fetches.push(getDocs(query(collection(db, "reportingSnapshots", "members"), where("subdepartmentId", "==", subdepartmentId), limit(120))).then(mapDocs));
      });
      pathIds.forEach((pathId) => {
        if (pathId) fetches.push(getDocs(query(collection(db, "reportingSnapshots", "members"), where("pathId", "==", pathId), limit(120))).then(mapDocs));
      });
      memberDocs = mergeById(memberDocs, ...(await Promise.all(fetches)));
    }
  }

  return {
    platform,
    departments: departmentDocs.filter(Boolean),
    subdepartments: subdepartmentDocs.filter(Boolean),
    paths: pathDocs.filter(Boolean),
    districts: districtDocs,
    members: memberDocs.sort((left, right) => Number(right?.completionRate || 0) - Number(left?.completionRate || 0)),
  };
};

export default function useGovernanceData({ user, profile, claimsAdmin = false, lang = "en", active = false } = {}) {
  const db = isConfigured ? firebaseDb : null;
  const currentUser = useMemo(() => buildDefaultUserDoc({ authUser: user, current: profile, claimsAdmin }), [claimsAdmin, profile, user]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [managementScopes, setManagementScopes] = useState(() => readCache(getCollectionCacheKey("managementScopes", user?.uid), []));
  const [users, setUsers] = useState(() => readCache(getCollectionCacheKey("users", user?.uid), []));
  const [departmentTasks, setDepartmentTasks] = useState(() => readCache(getCollectionCacheKey("departmentTasks", user?.uid), []));
  const [taskSubmissions, setTaskSubmissions] = useState(() => readCache(getCollectionCacheKey("taskSubmissions", user?.uid), []));
  const [taskReviewQueue, setTaskReviewQueue] = useState(() => readCache(getCollectionCacheKey("taskReviewQueue", user?.uid), []));
  const [reportingSnapshots, setReportingSnapshots] = useState(() =>
    readCache(getCollectionCacheKey("reportingSnapshots", user?.uid), {
      platform: null,
      departments: [],
      subdepartments: [],
      paths: [],
      districts: [],
      members: [],
    }),
  );
  const canManage = canManageScopes(currentUser, claimsAdmin);
  const canCreateTasks = canCreateScopedTasks(currentUser, claimsAdmin);
  const canReviewTasks = canReviewScopedTasks(currentUser, claimsAdmin);
  const canApproveTasks = canApproveScopedTasks(currentUser, claimsAdmin);

  const scopedTasks = useMemo(
    () =>
      departmentTasks
        .filter((task) =>
          isManagementRole(currentUser, claimsAdmin)
            ? entityInScope(currentUser.scopeSummary, task) || String(task?.managerUid || "") === currentUser.uid
            : taskIsAssignedToUser(task, currentUser, claimsAdmin),
        )
        .sort((left, right) => {
          const leftStatus = STATUS_SORT[left?.status] ?? 99;
          const rightStatus = STATUS_SORT[right?.status] ?? 99;
          if (leftStatus !== rightStatus) return leftStatus - rightStatus;
          return byTaskFreshness(left, right);
        }),
    [claimsAdmin, currentUser, departmentTasks],
  );

  const taskSubmissionMap = useMemo(
    () => Object.fromEntries(taskSubmissions.map((item) => [item?.submissionId || item?.id, item])),
    [taskSubmissions],
  );

  const myTaskSubmissions = useMemo(
    () => taskSubmissions.filter((item) => String(item?.uid || "") === String(currentUser?.uid || "")).sort(byLatestActivityDesc),
    [currentUser?.uid, taskSubmissions],
  );

  const reviewableTaskQueue = useMemo(
    () =>
      taskReviewQueue.filter(
        (item) =>
          canReviewTasks &&
          (entityInScope(currentUser.scopeSummary, item) || String(item?.uid || "") === currentUser.uid || isGlobalAdmin(currentUser, claimsAdmin)),
      ),
    [canReviewTasks, claimsAdmin, currentUser, taskReviewQueue],
  );

  const loadGovernanceData = async ({ force = false } = {}) => {
    if (!db || !active || !currentUser?.uid) return;
    setLoading(true);
    setNotice("");
    try {
      const [scopeDocs, userDocs, taskDocs, submissionDocs, queueDocs, snapshotDocs] = await Promise.all([
        fetchManagementScopes(db, currentUser, claimsAdmin),
        canManage ? fetchAllUsers(db) : Promise.resolve([]),
        fetchTasksForUser(db, currentUser, claimsAdmin),
        fetchTaskSubmissionsForUser(db, currentUser, claimsAdmin),
        fetchTaskReviewQueue(db, currentUser, claimsAdmin),
        fetchReportingSnapshots(db, currentUser, claimsAdmin),
      ]);

      setManagementScopes(scopeDocs);
      setUsers(userDocs);
      setDepartmentTasks(taskDocs);
      setTaskSubmissions(submissionDocs);
      setTaskReviewQueue(queueDocs);
      setReportingSnapshots(snapshotDocs);

      writeCache(getCollectionCacheKey("managementScopes", currentUser.uid), scopeDocs);
      writeCache(getCollectionCacheKey("users", currentUser.uid), userDocs);
      writeCache(getCollectionCacheKey("departmentTasks", currentUser.uid), taskDocs);
      writeCache(getCollectionCacheKey("taskSubmissions", currentUser.uid), submissionDocs);
      writeCache(getCollectionCacheKey("taskReviewQueue", currentUser.uid), queueDocs);
      writeCache(getCollectionCacheKey("reportingSnapshots", currentUser.uid), snapshotDocs);

      if (force) {
        setNotice(lang === "bn" ? "সর্বশেষ গভর্ন্যান্স ডেটা লোড হয়েছে।" : "Governance data refreshed.");
      }
    } catch (error) {
      console.error("Governance data load failed:", error);
      setNotice(lang === "bn" ? "গভর্ন্যান্স ডেটা লোড করা যায়নি।" : "Could not load governance data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!active || !currentUser?.uid) return;
    loadGovernanceData();
  }, [active, currentUser?.uid]);

  const appendAuditEntry = async ({
    action,
    targetType,
    targetId,
    scopeType = null,
    departmentId = null,
    subdepartmentId = null,
    pathId = null,
    meta = {},
  }) => {
    if (!db || !currentUser?.uid || !action) return;
    const auditRef = doc(collection(db, "coopAudit"));
    await setDoc(auditRef, {
      auditId: auditRef.id,
      action,
      actorUid: currentUser.uid,
      actorName: currentUser.displayName || currentUser.email || "EquiSaaS Member",
      actorRole: getPrimaryRole(currentUser, claimsAdmin),
      targetType: targetType || "record",
      targetId: targetId || "",
      scopeType,
      departmentId,
      subdepartmentId,
      pathId,
      meta,
      createdAt: serverTimestamp(),
    });
  };

  const setUserRole = async ({ uid, role }) => {
    if (!db || !canManage || !uid || !role) return false;
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    const currentData = buildDefaultUserDoc({ current: snap.data() || {} });
    const nextRoles = normalizeRoles({ ...currentData, roles: [...(currentData.roles || []), role], role }, claimsAdmin);
    const nextRole = nextRoles[0] || role;
    const scopeSummary = normalizeScopeSummary(currentData.scopeSummary);
    if (role === "admin" || role === "super-admin") scopeSummary.global = true;
    await setDoc(
      userRef,
      {
        role: nextRole,
        roles: nextRoles,
        coreTeam: nextRole !== "member",
        status: currentData.status || "active",
        scopeSummary,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
    await appendAuditEntry({
      action: "admin.role-changed",
      targetType: "user",
      targetId: uid,
      scopeType: role === "admin" || role === "super-admin" ? "global" : null,
      meta: { role },
    });
    await loadGovernanceData({ force: true });
    return true;
  };

  const assignManagementScope = async (payload = {}) => {
    if (!db || !canManage) return false;
    const managerUid = String(payload?.managerUid || "").trim();
    if (!managerUid) return false;

    const managerRef = doc(db, "users", managerUid);
    const managerSnap = await getDoc(managerRef);
    const managerData = buildDefaultUserDoc({ current: managerSnap.data() || {} });
    const managerName = payload?.managerName || managerData.displayName || "EquiSaaS Member";
    const role = payload?.role || "department-manager";
    const permissions = (payload?.permissions || getRolePermissions({ role }, claimsAdmin)).filter(Boolean);
    const entry = {
      scopeId: "",
      managerUid,
      managerName,
      role,
      scopeType: payload?.scopeType || "department",
      departmentId: payload?.departmentId || null,
      subdepartmentId: payload?.subdepartmentId || null,
      pathIds: Array.isArray(payload?.pathIds) ? payload.pathIds.filter(Boolean) : [],
      squadIds: Array.isArray(payload?.squadIds) ? payload.squadIds.filter(Boolean) : [],
      permissions,
      status: "active",
      createdByUid: currentUser.uid,
      createdByName: currentUser.displayName || currentUser.email || "EquiSaaS Member",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const scopeRef = await addDoc(collection(db, "managementScopes"), entry);
    await updateDoc(scopeRef, { scopeId: scopeRef.id });

    const nextActiveScopes = managementScopes.filter((item) => item?.managerUid === managerUid && item?.status !== "revoked").concat([{ ...entry, scopeId: scopeRef.id }]);
    const nextScopeSummary = buildScopeSummaryFromScopes(nextActiveScopes);
    const nextRoles = normalizeRoles({ ...managerData, roles: [...(managerData.roles || []), role], role }, claimsAdmin);
    await setDoc(
      managerRef,
      {
        role: nextRoles[0] || role,
        roles: nextRoles,
        managementScopeIds: [...new Set([...(managerData.managementScopeIds || []), scopeRef.id])],
        scopeSummary: nextScopeSummary,
        coreTeam: true,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    await appendAuditEntry({
      action: "manager.assigned",
      targetType: "managementScope",
      targetId: scopeRef.id,
      scopeType: entry.scopeType,
      departmentId: entry.departmentId,
      subdepartmentId: entry.subdepartmentId,
      pathId: entry.pathIds[0] || null,
      meta: { managerUid, role, permissions, squadIds: entry.squadIds },
    });

    await loadGovernanceData({ force: true });
    return scopeRef.id;
  };

  const revokeManagementScope = async (scope) => {
    if (!db || !canManage || !scope?.scopeId) return false;
    const scopeRef = doc(db, "managementScopes", scope.scopeId);
    await updateDoc(scopeRef, { status: "revoked", updatedAt: serverTimestamp() });

    const managerRef = doc(db, "users", scope.managerUid);
    const managerSnap = await getDoc(managerRef);
    const managerData = buildDefaultUserDoc({ current: managerSnap.data() || {} });
    const nextScopes = managementScopes
      .filter((item) => item?.managerUid === scope.managerUid && item?.scopeId !== scope.scopeId && item?.status !== "revoked")
      .map((item) => ({ ...item }));
    const nextScopeSummary = buildScopeSummaryFromScopes(nextScopes);
    const nextRoles = normalizeRoles(managerData, claimsAdmin).filter((role) => {
      if (role === "member" || role === "admin" || role === "super-admin") return true;
      if (role !== scope.role) return true;
      return nextScopes.some((item) => item?.role === role);
    });

    await setDoc(
      managerRef,
      {
        role: nextRoles[0] || "member",
        roles: nextRoles.length ? nextRoles : ["member"],
        managementScopeIds: (managerData.managementScopeIds || []).filter((item) => item !== scope.scopeId),
        scopeSummary: nextScopeSummary,
        coreTeam: nextRoles.some((role) => role !== "member"),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    await appendAuditEntry({
      action: "manager.revoked",
      targetType: "managementScope",
      targetId: scope.scopeId,
      scopeType: scope.scopeType || null,
      departmentId: scope.departmentId || null,
      subdepartmentId: scope.subdepartmentId || null,
      pathId: scope.pathIds?.[0] || null,
      meta: { managerUid: scope.managerUid, role: scope.role },
    });

    await loadGovernanceData({ force: true });
    return true;
  };

  const createDepartmentTask = async (payload = {}) => {
    if (!db || !canCreateTasks || !currentUser?.uid) return false;
    const role = getPrimaryRole(currentUser, claimsAdmin);
    const taskPayload = {
      taskId: "",
      titleEn: payload?.titleEn || "",
      titleBn: payload?.titleBn || "",
      descriptionEn: payload?.descriptionEn || "",
      descriptionBn: payload?.descriptionBn || "",
      departmentId: payload?.departmentId || null,
      subdepartmentId: payload?.subdepartmentId || null,
      pathId: payload?.pathId || null,
      squadId: payload?.squadId || null,
      assigneeScope: payload?.assigneeScope || "path",
      assigneeIds: Array.isArray(payload?.assigneeIds) ? payload.assigneeIds.filter(Boolean) : [],
      assigneeCount: Array.isArray(payload?.assigneeIds) ? payload.assigneeIds.filter(Boolean).length : Number(payload?.assigneeCount || 0),
      priority: payload?.priority || "medium",
      status: payload?.status || "draft",
      expectedSubmissionType: payload?.expectedSubmissionType || "mixed",
      instructionsChecklist: Array.isArray(payload?.instructionsChecklist) ? payload.instructionsChecklist.filter(Boolean) : [],
      tags: Array.isArray(payload?.tags) ? payload.tags.filter(Boolean) : [],
      dueAt: payload?.dueAt || null,
      publishedAt: payload?.status === "open" ? serverTimestamp() : null,
      createdByUid: currentUser.uid,
      createdByName: currentUser.displayName || currentUser.email || "EquiSaaS Member",
      createdByRole: role,
      managerUid: currentUser.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    if (!entityInScope(currentUser.scopeSummary, taskPayload) && !isGlobalAdmin(currentUser, claimsAdmin)) {
      setNotice(lang === "bn" ? "এই স্কোপে টাস্ক তৈরি করা যাবে না।" : "You cannot create a task outside your assigned scope.");
      return false;
    }
    const taskRef = await addDoc(collection(db, "departmentTasks"), taskPayload);
    await updateDoc(taskRef, { taskId: taskRef.id });
    await appendAuditEntry({
      action: "task.created",
      targetType: "departmentTask",
      targetId: taskRef.id,
      scopeType: payload?.assigneeScope || "path",
      departmentId: payload?.departmentId || null,
      subdepartmentId: payload?.subdepartmentId || null,
      pathId: payload?.pathId || null,
      meta: { priority: taskPayload.priority, assigneeCount: taskPayload.assigneeCount },
    });
    await loadGovernanceData({ force: true });
    return taskRef.id;
  };

  const updateDepartmentTask = async (taskId, payload = {}) => {
    if (!db || !canCreateTasks || !taskId) return false;
    const taskRef = doc(db, "departmentTasks", taskId);
    const taskSnap = await getDoc(taskRef);
    if (!taskSnap.exists()) return false;
    const taskData = taskSnap.data() || {};
    if (!entityInScope(currentUser.scopeSummary, taskData) && !isGlobalAdmin(currentUser, claimsAdmin) && String(taskData.managerUid || "") !== currentUser.uid) {
      setNotice(lang === "bn" ? "এই টাস্ক আপডেট করার অনুমতি নেই।" : "You do not have permission to update this task.");
      return false;
    }
    await updateDoc(taskRef, {
      ...payload,
      assigneeIds: Array.isArray(payload?.assigneeIds) ? payload.assigneeIds.filter(Boolean) : taskData.assigneeIds || [],
      instructionsChecklist: Array.isArray(payload?.instructionsChecklist)
        ? payload.instructionsChecklist.filter(Boolean)
        : taskData.instructionsChecklist || [],
      tags: Array.isArray(payload?.tags) ? payload.tags.filter(Boolean) : taskData.tags || [],
      assigneeCount: Array.isArray(payload?.assigneeIds) ? payload.assigneeIds.filter(Boolean).length : taskData.assigneeCount || 0,
      publishedAt:
        payload?.status === "open" && !taskData.publishedAt
          ? serverTimestamp()
          : taskData.publishedAt || null,
      updatedAt: serverTimestamp(),
    });
    await appendAuditEntry({
      action: "task.updated",
      targetType: "departmentTask",
      targetId: taskId,
      scopeType: taskData.assigneeScope || null,
      departmentId: taskData.departmentId || null,
      subdepartmentId: taskData.subdepartmentId || null,
      pathId: taskData.pathId || null,
      meta: { status: payload?.status || taskData.status || "open" },
    });
    await loadGovernanceData({ force: true });
    return true;
  };

  const fetchTaskActivity = async (submissionId) => {
    if (!db || !submissionId) return [];
    const snap = await getDocs(query(collection(db, "taskSubmissions", submissionId, "activity"), limit(40)));
    return mapDocs(snap).sort(byCreatedAtDesc);
  };

  const submitTaskSubmission = async ({ task, submissionText = "", submissionLink = "", submissionNotes = "", attachments = [] } = {}) => {
    if (!db || !currentUser?.uid || !task?.taskId) return false;
    const submissionId = `${task.taskId}_${currentUser.uid}`;
    const submissionRef = doc(db, "taskSubmissions", submissionId);
    const existingSnap = await getDoc(submissionRef);
    const existingData = existingSnap.data() || null;
    const revisionCount = Number(existingData?.revisionCount || 0) + (existingData ? 1 : 0);
    const basePayload = {
      submissionId,
      taskId: task.taskId,
      uid: currentUser.uid,
      memberName: currentUser.displayName || currentUser.email || "EquiSaaS Member",
      departmentId: task.departmentId || currentUser.departmentId || "",
      subdepartmentId: task.subdepartmentId || currentUser.subdepartmentId || "",
      pathId: task.pathId || currentUser.pathId || "",
      squadId: task.squadId || currentUser.squadId || null,
      districtId: currentUser.districtId || "",
      submissionText,
      submissionLink,
      submissionNotes,
      attachments,
      status: "submitted",
      revisionCount,
      submittedAt: serverTimestamp(),
      reviewedAt: existingData?.reviewedAt || null,
      reviewedByUid: existingData?.reviewedByUid || null,
      reviewedByName: existingData?.reviewedByName || null,
      reviewFeedbackEn: existingData?.reviewFeedbackEn || "",
      reviewFeedbackBn: existingData?.reviewFeedbackBn || "",
      latestActivityAt: serverTimestamp(),
      createdAt: existingData?.createdAt || serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(submissionRef, basePayload, { merge: true });

    const activityId = `${Date.now()}`;
    const activityType = existingData ? "resubmitted" : "submitted";
    await setDoc(doc(db, "taskSubmissions", submissionId, "activity", activityId), {
      activityId,
      type: activityType,
      actorUid: currentUser.uid,
      actorName: currentUser.displayName || currentUser.email || "EquiSaaS Member",
      actorRole: getPrimaryRole(currentUser, claimsAdmin),
      messageEn: activityType === "resubmitted" ? "Submission updated after feedback." : "Task submission received.",
      messageBn: activityType === "resubmitted" ? "ফিডব্যাক অনুযায়ী সাবমিশন আপডেট করা হয়েছে।" : "টাস্ক সাবমিশন জমা হয়েছে।",
      createdAt: serverTimestamp(),
    });

    await setDoc(
      doc(db, "reviewQueue", submissionId),
      {
        queueId: submissionId,
        sourceType: "task",
        sourceSubmissionId: submissionId,
        taskId: task.taskId,
        assignmentId: null,
        uid: currentUser.uid,
        memberName: currentUser.displayName || currentUser.email || "EquiSaaS Member",
        departmentId: task.departmentId || currentUser.departmentId || "",
        subdepartmentId: task.subdepartmentId || currentUser.subdepartmentId || "",
        pathId: task.pathId || currentUser.pathId || "",
        squadId: task.squadId || currentUser.squadId || null,
        districtId: currentUser.districtId || "",
        state: "ready-for-manager",
        peerAttestationCount: 0,
        requiredPeerAttestations: 0,
        latestReviewerUid: existingData?.reviewedByUid || null,
        latestReviewerName: existingData?.reviewedByName || null,
        latestFeedbackSnippet: "",
        reviewCycle: revisionCount,
        createdAt: existingData?.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    await updateDoc(doc(db, "departmentTasks", task.taskId), {
      status: task.assigneeCount <= 1 ? "submitted" : task.status === "draft" ? "open" : task.status,
      updatedAt: serverTimestamp(),
    });

    await appendAuditEntry({
      action: "task.submitted",
      targetType: "taskSubmission",
      targetId: submissionId,
      scopeType: task.assigneeScope || null,
      departmentId: task.departmentId || null,
      subdepartmentId: task.subdepartmentId || null,
      pathId: task.pathId || null,
      meta: { taskId: task.taskId, revisionCount },
    });
    await loadGovernanceData({ force: true });
    return submissionId;
  };

  const reviewTaskSubmission = async ({ submissionId, status, reviewFeedbackEn = "", reviewFeedbackBn = "" } = {}) => {
    if (!db || !submissionId || !status || !canReviewTasks) return false;
    const submissionRef = doc(db, "taskSubmissions", submissionId);
    const submissionSnap = await getDoc(submissionRef);
    if (!submissionSnap.exists()) return false;
    const submissionData = submissionSnap.data() || {};
    if (!entityInScope(currentUser.scopeSummary, submissionData) && !isGlobalAdmin(currentUser, claimsAdmin)) {
      setNotice(lang === "bn" ? "এই সাবমিশন রিভিউ করার অনুমতি নেই।" : "You do not have permission to review this submission.");
      return false;
    }

    const queueRef = doc(db, "reviewQueue", submissionId);
    const taskRef = doc(db, "departmentTasks", submissionData.taskId);
    const activityId = `${Date.now()}`;

    await updateDoc(submissionRef, {
      status,
      reviewFeedbackEn,
      reviewFeedbackBn,
      reviewedAt: serverTimestamp(),
      reviewedByUid: currentUser.uid,
      reviewedByName: currentUser.displayName || currentUser.email || "EquiSaaS Member",
      latestActivityAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await setDoc(doc(db, "taskSubmissions", submissionId, "activity", activityId), {
      activityId,
      type: status === "approved" ? "approved" : "revision-requested",
      actorUid: currentUser.uid,
      actorName: currentUser.displayName || currentUser.email || "EquiSaaS Member",
      actorRole: getPrimaryRole(currentUser, claimsAdmin),
      messageEn: reviewFeedbackEn || (status === "approved" ? "Submission approved." : "Revision requested."),
      messageBn: reviewFeedbackBn || (status === "approved" ? "সাবমিশন অনুমোদিত হয়েছে।" : "রিভিশন অনুরোধ করা হয়েছে।"),
      createdAt: serverTimestamp(),
    });

    await setDoc(
      queueRef,
      {
        latestReviewerUid: currentUser.uid,
        latestReviewerName: currentUser.displayName || currentUser.email || "EquiSaaS Member",
        latestFeedbackSnippet: reviewFeedbackEn || reviewFeedbackBn || "",
        state: status === "approved" ? "approved" : "peer-rework",
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    await updateDoc(taskRef, {
      status: status === "approved" ? "approved" : "needs-revision",
      updatedAt: serverTimestamp(),
    });

    await appendAuditEntry({
      action: status === "approved" ? "task.approved" : "task.revision-requested",
      targetType: "taskSubmission",
      targetId: submissionId,
      departmentId: submissionData.departmentId || null,
      subdepartmentId: submissionData.subdepartmentId || null,
      pathId: submissionData.pathId || null,
      meta: { taskId: submissionData.taskId, status },
    });
    await loadGovernanceData({ force: true });
    return true;
  };

  const refreshReportingSnapshots = async () => {
    if (!db || !canManage) return false;
    setLoading(true);
    setNotice("");
    try {
      const [userDocs, taskDocs, taskSubmissionDocs, progressDocs] = await Promise.all([
        fetchAllUsers(db),
        mapDocs(await getDocs(query(collection(db, "departmentTasks"), limit(240)))),
        mapDocs(await getDocs(query(collection(db, "taskSubmissions"), limit(240)))),
        getDocs(collectionGroup(db, "progress")),
      ]);

      const now = Date.now();
      const members = userDocs.map((item) => buildDefaultUserDoc({ current: item }));
      const progressByUser = new Map();

      progressDocs.forEach((docSnap) => {
        const uid = docSnap.ref.parent.parent?.id;
        if (!uid) return;
        const entry = progressByUser.get(uid) || [];
        entry.push({
          courseId: docSnap.id,
          completedLessonIds: Array.isArray(docSnap.data()?.completedLessonIds) ? docSnap.data().completedLessonIds : [],
        });
        progressByUser.set(uid, entry);
      });

      const memberSnapshots = members.map((member) => {
        const progressEntries = progressByUser.get(member.uid) || [];
        const completedLessonSet = new Set();
        let completedModules = 0;

        progressEntries.forEach((entry) => {
          entry.completedLessonIds.forEach((lessonId) => completedLessonSet.add(`${entry.courseId}:${lessonId}`));
          completedModules += getModuleCompletionCount(entry.courseId, entry.completedLessonIds);
        });

        const completedLessons = completedLessonSet.size;
        const totalPathLessons = getPathLessonCount(member.pathId);
        const totalPathModules = getPathModuleCount(member.pathId);
        const completionRate = totalPathLessons ? Math.round((completedLessons / totalPathLessons) * 100) : 0;
        const memberSubmissions = taskSubmissionDocs.filter((item) => item?.uid === member.uid);

        return {
          uid: member.uid,
          displayName: member.displayName,
          departmentId: member.departmentId || "",
          subdepartmentId: member.subdepartmentId || "",
          pathId: member.pathId || "",
          districtId: member.districtId || "",
          completedLessons,
          completedModules: Math.min(completedModules, totalPathModules || completedModules),
          completionRate,
          assignedTaskCount: taskDocs.filter((task) => taskIsAssignedToUser(task, member)).length,
          submittedTaskCount: memberSubmissions.filter((item) => item?.status === "submitted").length,
          approvedTaskCount: memberSubmissions.filter((item) => item?.status === "approved").length,
          needsRevisionTaskCount: memberSubmissions.filter((item) => item?.status === "needs-revision").length,
          latestActivityAt: member.lastActiveAt || member.updatedAt || member.createdAt || null,
          updatedAt: serverTimestamp(),
        };
      });

      const queueDocs = taskReviewQueue.length
        ? taskReviewQueue
        : mapDocs(await getDocs(query(collection(db, "reviewQueue"), where("sourceType", "==", "task"), limit(240))));

      const pathSnapshots = PATHS.map((pathItem) => {
        const membersInPath = memberSnapshots.filter((item) => item.pathId === pathItem.id);
        const submissionsInPath = taskSubmissionDocs.filter((item) => item.pathId === pathItem.id);
        const tasksInPath = taskDocs.filter((item) => item.pathId === pathItem.id);
        const queueInPath = queueDocs.filter((item) => item.pathId === pathItem.id);
        const memberCount = membersInPath.length;

        return {
          pathId: pathItem.id,
          departmentId: pathItem.deptId,
          memberCount,
          activeMemberCount: membersInPath.filter((item) => isMemberActiveSince(item.latestActivityAt, now - 1000 * 60 * 60 * 24 * 30)).length,
          lessonCompletionRate: memberCount
            ? Math.round(membersInPath.reduce((sum, item) => sum + Number(item.completionRate || 0), 0) / memberCount)
            : 0,
          moduleCompletionRate: memberCount
            ? Math.round(
                membersInPath.reduce((sum, item) => {
                  const totalModules = getPathModuleCount(pathItem.id);
                  return sum + (totalModules ? (Number(item.completedModules || 0) / totalModules) * 100 : 0);
                }, 0) / memberCount,
              )
            : 0,
          assignedTaskCount: tasksInPath.length,
          submittedTaskCount: submissionsInPath.filter((item) => item?.status === "submitted").length,
          approvedTaskCount: submissionsInPath.filter((item) => item?.status === "approved").length,
          blockedTaskCount: queueInPath.filter((item) => item?.state && item.state !== "approved").length,
          updatedAt: serverTimestamp(),
        };
      });

      const departmentSnapshots = DEPARTMENTS.map((department) => {
        const membersInDepartment = memberSnapshots.filter((item) => item.departmentId === department.id);
        const submissionsInDepartment = taskSubmissionDocs.filter((item) => item.departmentId === department.id);
        const tasksInDepartment = taskDocs.filter((item) => item.departmentId === department.id);
        const queueInDepartment = queueDocs.filter((item) => item.departmentId === department.id);
        const memberCount = membersInDepartment.length;

        return {
          departmentId: department.id,
          departmentTitleEn: department.titleEn,
          departmentTitleBn: department.titleBn,
          memberCount,
          activeMemberCount: membersInDepartment.filter((item) => isMemberActiveSince(item.latestActivityAt, now - 1000 * 60 * 60 * 24 * 30)).length,
          pathCount: PATHS.filter((pathItem) => pathItem.deptId === department.id).length,
          taskOpenCount: tasksInDepartment.filter((item) => ["draft", "open", "in-progress"].includes(item?.status)).length,
          taskSubmittedCount: submissionsInDepartment.filter((item) => item?.status === "submitted").length,
          taskApprovedCount: submissionsInDepartment.filter((item) => item?.status === "approved").length,
          submissionPendingCount: queueInDepartment.filter((item) => item?.state && item.state !== "approved").length,
          avgLessonCompletionRate: memberCount
            ? Math.round(membersInDepartment.reduce((sum, item) => sum + Number(item.completionRate || 0), 0) / memberCount)
            : 0,
          avgModuleCompletionRate: memberCount
            ? Math.round(
                membersInDepartment.reduce((sum, item) => {
                  const totalModules = getPathModuleCount(item.pathId);
                  return sum + (totalModules ? (Number(item.completedModules || 0) / totalModules) * 100 : 0);
                }, 0) / memberCount,
              )
            : 0,
          updatedAt: serverTimestamp(),
        };
      });

      const subdepartmentSnapshots = PATHS.map((pathItem) => {
        const subdepartmentMeta = getSubdepartmentMeta(pathItem.subdeptId);
        const membersInSubdepartment = memberSnapshots.filter((item) => item.pathId === pathItem.id || item.subdepartmentId === pathItem.subdeptId);
        const submissionsInSubdepartment = taskSubmissionDocs.filter((item) => item.pathId === pathItem.id || item.subdepartmentId === pathItem.subdeptId);
        const tasksInSubdepartment = taskDocs.filter((item) => item.pathId === pathItem.id || item.subdepartmentId === pathItem.subdeptId);
        const queueInSubdepartment = queueDocs.filter((item) => item.pathId === pathItem.id || item.subdepartmentId === pathItem.subdeptId);
        const memberCount = membersInSubdepartment.length;

        return {
          snapshotId: pathItem.id,
          pathId: pathItem.id,
          departmentId: pathItem.deptId,
          subdepartmentId: pathItem.subdeptId,
          departmentTitleEn: subdepartmentMeta?.departmentTitleEn || "",
          departmentTitleBn: subdepartmentMeta?.departmentTitleBn || "",
          subdepartmentTitleEn: subdepartmentMeta?.titleEn || pathItem.subdeptId,
          subdepartmentTitleBn: subdepartmentMeta?.titleBn || pathItem.subdeptId,
          memberCount,
          activeMemberCount: membersInSubdepartment.filter((item) => isMemberActiveSince(item.latestActivityAt, now - 1000 * 60 * 60 * 24 * 30)).length,
          taskOpenCount: tasksInSubdepartment.filter((item) => ["draft", "open", "in-progress"].includes(item?.status)).length,
          taskSubmittedCount: submissionsInSubdepartment.filter((item) => item?.status === "submitted").length,
          taskApprovedCount: submissionsInSubdepartment.filter((item) => item?.status === "approved").length,
          submissionPendingCount: queueInSubdepartment.filter((item) => item?.state && item.state !== "approved").length,
          avgLessonCompletionRate: memberCount
            ? Math.round(membersInSubdepartment.reduce((sum, item) => sum + Number(item.completionRate || 0), 0) / memberCount)
            : 0,
          avgModuleCompletionRate: memberCount
            ? Math.round(
                membersInSubdepartment.reduce((sum, item) => {
                  const totalModules = getPathModuleCount(pathItem.id);
                  return sum + (totalModules ? (Number(item.completedModules || 0) / totalModules) * 100 : 0);
                }, 0) / memberCount,
              )
            : 0,
          updatedAt: serverTimestamp(),
        };
      });

      const districtSnapshotMap = new Map();
      memberSnapshots.forEach((member) => {
        const districtId = String(member?.districtId || "");
        const pathId = String(member?.pathId || "");
        if (!districtId || !pathId) return;

        const pathMeta = PATHS.find((item) => item.id === pathId) || null;
        const snapshotId = buildSnapshotId(pathId, districtId);
        if (!districtSnapshotMap.has(snapshotId)) {
          districtSnapshotMap.set(snapshotId, {
            snapshotId,
            districtId,
            districtTitleEn: formatDistrictLabel(districtId, "en") || districtId,
            districtTitleBn: formatDistrictLabel(districtId, "bn") || districtId,
            departmentId: pathMeta?.deptId || member?.departmentId || "",
            subdepartmentId: pathMeta?.subdeptId || member?.subdepartmentId || "",
            pathId,
            memberCount: 0,
            activeMemberCount: 0,
            approvedTaskCount: 0,
            needsRevisionTaskCount: 0,
            totalCompletionRate: 0,
          });
        }

        const bucket = districtSnapshotMap.get(snapshotId);
        bucket.memberCount += 1;
        if (isMemberActiveSince(member?.latestActivityAt, now - 1000 * 60 * 60 * 24 * 30)) {
          bucket.activeMemberCount += 1;
        }
        bucket.approvedTaskCount += Number(member?.approvedTaskCount || 0);
        bucket.needsRevisionTaskCount += Number(member?.needsRevisionTaskCount || 0);
        bucket.totalCompletionRate += Number(member?.completionRate || 0);
      });

      const districtSnapshots = Array.from(districtSnapshotMap.values()).map((item) => ({
        ...item,
        avgCompletionRate: item.memberCount ? Math.round(item.totalCompletionRate / item.memberCount) : 0,
        updatedAt: serverTimestamp(),
      }));

      const platformCurrent = {
        totalMembers: members.length,
        activeMembers7d: members.filter((item) => isMemberActiveSince(item.lastActiveAt, now - 1000 * 60 * 60 * 24 * 7)).length,
        activeMembers30d: members.filter((item) => isMemberActiveSince(item.lastActiveAt, now - 1000 * 60 * 60 * 24 * 30)).length,
        activeLearners30d: memberSnapshots.filter((item) => isMemberActiveSince(item.latestActivityAt, now - 1000 * 60 * 60 * 24 * 30)).length,
        totalDepartments: DEPARTMENTS.length,
        totalPaths: PATHS.length,
        totalTasksOpen: taskDocs.filter((item) => ["draft", "open", "in-progress"].includes(item?.status)).length,
        totalTasksSubmitted: taskSubmissionDocs.filter((item) => item?.status === "submitted").length,
        totalTasksApproved: taskSubmissionDocs.filter((item) => item?.status === "approved").length,
        totalSubmissionsPendingReview: queueDocs.filter((item) => item?.state && item.state !== "approved").length,
        totalLessonsCompleted: memberSnapshots.reduce((sum, item) => sum + Number(item.completedLessons || 0), 0),
        totalModulesCompleted: memberSnapshots.reduce((sum, item) => sum + Number(item.completedModules || 0), 0),
        updatedAt: serverTimestamp(),
      };

      const writeOperations = [
        [doc(db, "reportingSnapshots", "platform", "current"), platformCurrent],
        ...departmentSnapshots.map((item) => [doc(db, "reportingSnapshots", "departments", item.departmentId), item]),
        ...subdepartmentSnapshots.map((item) => [doc(db, "reportingSnapshots", "subdepartments", item.pathId), item]),
        ...pathSnapshots.map((item) => [doc(db, "reportingSnapshots", "paths", item.pathId), item]),
        ...districtSnapshots.map((item) => [doc(db, "reportingSnapshots", "districts", item.snapshotId), item]),
        ...memberSnapshots.map((item) => [doc(db, "reportingSnapshots", "members", item.uid), item]),
      ];

      for (let index = 0; index < writeOperations.length; index += 400) {
        const batch = writeBatch(db);
        writeOperations.slice(index, index + 400).forEach(([ref, payload]) => {
          batch.set(ref, payload, { merge: true });
        });
        await batch.commit();
      }

      await appendAuditEntry({
        action: "reporting.snapshots-refreshed",
        targetType: "reportingSnapshots",
        targetId: "platform/current",
        scopeType: "global",
        meta: { memberCount: members.length, taskCount: taskDocs.length, submissionCount: taskSubmissionDocs.length },
      });

      await loadGovernanceData({ force: true });
      setNotice(lang === "bn" ? "রিপোর্টিং স্ন্যাপশট রিফ্রেশ হয়েছে।" : "Reporting snapshots refreshed.");
      return true;
    } catch (error) {
      console.error("Reporting snapshot refresh failed:", error);
      setNotice(lang === "bn" ? "রিপোর্টিং স্ন্যাপশট তৈরি করা যায়নি।" : "Could not regenerate reporting snapshots.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    assignManagementScope,
    canApproveTasks,
    canCreateTasks,
    canManage,
    canReviewTasks,
    createDepartmentTask,
    currentUser,
    departmentTasks: scopedTasks,
    fetchTaskActivity,
    loadGovernanceData,
    loading,
    managementScopes,
    myTaskSubmissions,
    notice,
    refreshReportingSnapshots,
    reportingSnapshots,
    reviewTaskSubmission,
    reviewableTaskQueue,
    revokeManagementScope,
    roleLabel: getRoleLabel(getPrimaryRole(currentUser, claimsAdmin), lang),
    setUserRole,
    submitTaskSubmission,
    taskSubmissionMap,
    taskSubmissions,
    taskSummary: getTaskSummaryFromSubmissions(taskSubmissions, taskReviewQueue),
    updateDepartmentTask,
    users,
  };
}
