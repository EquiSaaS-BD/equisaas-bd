import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  increment,
  query,
  runTransaction,
  setLogLevel,
  serverTimestamp,
  setDoc,
  terminate,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { deleteApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { deleteDocument, listDocuments, patchDocument } from "./shared/firebase-cli-rest.mjs";

const REQUIRED_FIREBASE_KEYS = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
];

const firebaseConfig = (() => {
  const values = {};
  const missing = [];
  for (const key of REQUIRED_FIREBASE_KEYS) {
    const value = process.env[key];
    if (typeof value === "string" && value.trim() !== "") {
      values[key.replace(/^NEXT_PUBLIC_FIREBASE_/u, "").toLowerCase()] = value.trim();
    } else {
      missing.push(key);
    }
  }
  if (missing.length > 0) {
    throw new Error(
      "Missing required Firebase environment variables: " +
        missing.join(", ") +
        ". Copy .env.example to .env at the repo root and fill in the NEXT_PUBLIC_FIREBASE_* values.",
    );
  }
  return values;
})();

const departmentId = "frontend";
const parentDepartmentId = "engineering";
const alternateDepartmentId = "backend";
const alternateParentDepartmentId = "engineering";
const smokePrefix = `smoke-final-${Date.now()}`;
const password = "Smoke!23456";
const checks = [];
const cleanup = [];
const contexts = [];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const buildSubmissionId = (taskId, uid) => `${taskId}_${uid}`.replace(/[^a-zA-Z0-9_-]/g, "_");

setLogLevel("silent");

const buildBaseProfile = ({ user, email, displayName }) => ({
  uid: user.uid,
  fullName: displayName,
  displayName,
  email,
  phone: "",
  departmentId: "",
  parentDepartmentId: "",
  role: "member",
  roles: ["member"],
  status: "active",
  joinedAt: serverTimestamp(),
  joinDate: serverTimestamp(),
  photoURL: "",
  totalPoints: 0,
  completedTaskCount: 0,
  currentStage: "week-1",
  isActive: true,
  updatedAt: serverTimestamp(),
});

const recordCheck = (name, status, details = {}) => {
  checks.push({ name, status, ...details });
};

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

const expectDenied = async (name, action) => {
  try {
    await action();
    throw new Error(`${name} should have been denied but succeeded.`);
  } catch (error) {
    const message = String(error?.message || error);
    const denied =
      message.includes("Missing or insufficient permissions") ||
      message.includes("permission-denied") ||
      message.includes("Permission denied");
    if (!denied) {
      throw error;
    }
    recordCheck(name, "expected_denial");
  }
};

const createContext = async (roleName) => {
  const app = initializeApp(firebaseConfig, `${smokePrefix}-${roleName}`);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const email = `${smokePrefix}-${roleName}@example.com`;
  const displayName = `Smoke ${roleName}`;
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await credential.user.getIdToken();
  const ctx = {
    roleName,
    email,
    password,
    displayName,
    app,
    auth,
    db,
    user: credential.user,
  };
  contexts.push(ctx);
  cleanup.push(async () => {
    try {
      await deleteApp(ctx.app);
    } catch {
      // Best-effort cleanup.
    }
  });
  cleanup.push(async () => {
    try {
      if (ctx.auth.currentUser) {
        await deleteUser(ctx.auth.currentUser);
      }
    } catch {
      // Best-effort cleanup.
    }
  });
  cleanup.push(async () => {
    try {
      await terminate(ctx.db);
    } catch {
      // Best-effort cleanup.
    }
  });
  return ctx;
};

const createOwnProfile = async (ctx) => {
  await sleep(500);
  await setDoc(doc(ctx.db, "users", ctx.user.uid), buildBaseProfile(ctx), { merge: true });
  cleanup.push(() => deleteDocument(`users/${ctx.user.uid}`));
  recordCheck(`${ctx.roleName}: self profile create`, "ok");
};

const setDepartmentAsMember = async (ctx) => {
  const batch = writeBatch(ctx.db);
  batch.set(
    doc(ctx.db, "users", ctx.user.uid),
    {
      departmentId,
      parentDepartmentId,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
  batch.set(
    doc(ctx.db, "departments", departmentId),
    {
      memberCount: increment(1),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
  await batch.commit();
  recordCheck(`${ctx.roleName}: department assignment`, "ok");
};

const switchDepartmentAsMember = async (ctx, nextDepartmentId, nextParentDepartmentId) => {
  const userRef = doc(ctx.db, "users", ctx.user.uid);
  const currentSnap = await getDoc(userRef);
  assert(currentSnap.exists(), "User profile missing during department switch.");
  const currentDepartmentId = currentSnap.data()?.departmentId || "";
  const batch = writeBatch(ctx.db);

  batch.set(
    userRef,
    {
      departmentId: nextDepartmentId,
      parentDepartmentId: nextParentDepartmentId,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  if (currentDepartmentId && currentDepartmentId !== nextDepartmentId) {
    batch.set(
      doc(ctx.db, "departments", currentDepartmentId),
      {
        memberCount: increment(-1),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  }

  if (currentDepartmentId !== nextDepartmentId) {
    batch.set(
      doc(ctx.db, "departments", nextDepartmentId),
      {
        memberCount: increment(1),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  }

  await batch.commit();
  recordCheck(`${ctx.roleName}: department switch to ${nextDepartmentId}`, "ok");
};

const patchUserRole = async (ctx, role) => {
  await patchDocument(`users/${ctx.user.uid}`, {
    role,
    roles: [role],
    status: "active",
    departmentId,
    parentDepartmentId,
    updatedAt: new Date().toISOString(),
  });
  recordCheck(`${ctx.roleName}: role patched to ${role}`, "ok");
};

const syncDepartmentMemberCount = async () => {
  if (!contexts.length) return;
  const allUsers = await listDocuments("users");
  const liveCount = allUsers
    .filter((item) => item.isActive !== false && !String(item.email || "").startsWith(smokePrefix))
    .filter((item) => item.departmentId === departmentId)
    .length;
  await patchDocument(`departments/${departmentId}`, {
    memberCount: liveCount,
    updatedAt: new Date().toISOString(),
  });
};

const getOpenTask = async (ctx) => {
  const snap = await getDocs(query(
    collection(ctx.db, "tasks"),
    where("departmentId", "==", departmentId),
    where("status", "==", "open"),
  ));
  const first = snap.docs[0];
  assert(first, "No open task found for smoke test.");
  return { id: first.id, ...first.data() };
};

const submitAssignedTaskAsMember = async (ctx, task) => {
  const submissionId = buildSubmissionId(task.id, ctx.user.uid);
  await setDoc(
    doc(ctx.db, "submissions", submissionId),
    {
      taskId: task.id,
      taskTitle: task.title || "Submit proof of completion",
      resourceTitle: task.resourceTitle || "",
      userId: ctx.user.uid,
      userDisplayName: ctx.displayName,
      departmentId: task.departmentId,
      courseId: task.courseId || "",
      lessonId: task.lessonId || "",
      taskSource: "assigned",
      taskReferenceUrl: task.preferredResourceUrl || task.resourceUrl || "",
      taskOrigin: "mentor_direct",
      submittedText: "Smoke test proof submission.",
      submissionLinks: [{ type: "link", url: "https://example.com/smoke-proof" }],
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
  cleanup.push(() => deleteDocument(`submissions/${submissionId}`));
  recordCheck("member: assigned task submission", "ok", { submissionId, taskId: task.id });
  return submissionId;
};

const submitDirectTaskAsMember = async (ctx) => {
  const submissionRef = doc(collection(ctx.db, "submissions"));
  await setDoc(
    submissionRef,
    {
      taskId: `custom_${smokePrefix}`,
      taskTitle: "Direct task smoke",
      resourceTitle: "Direct task smoke",
      userId: ctx.user.uid,
      userDisplayName: ctx.displayName,
      departmentId,
      courseId: "",
      lessonId: "",
      taskSource: "custom",
      taskReferenceUrl: "https://example.com/direct-brief",
      taskOrigin: "mentor_community",
      submittedText: "Direct smoke test proof submission.",
      submissionLinks: [{ type: "link", url: "https://example.com/direct-proof" }],
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
  cleanup.push(() => deleteDocument(`submissions/${submissionRef.id}`));
  recordCheck("member: direct task submission", "ok", { submissionId: submissionRef.id });
  return submissionRef.id;
};

const saveMentorRecommendation = async (ctx, submissionId) => {
  await updateDoc(doc(ctx.db, "submissions", submissionId), {
    recommendation: "approve",
    reviewComment: "Mentor smoke-test recommendation.",
    recommendedBy: ctx.user.uid,
    recommendedAt: serverTimestamp(),
    recommendedPoints: 50,
    updatedAt: serverTimestamp(),
  });
  recordCheck("mentor: recommendation saved", "ok");
};

const finalizeAsDepartmentHead = async (
  ctx,
  submissionId,
  awardedPoints,
  options = {},
) => {
  const {
    checkName = "department_head: approval and points credit",
    reviewComment = "Department head smoke-test approval.",
  } = options;
  await runTransaction(ctx.db, async (transaction) => {
    const submissionRef = doc(ctx.db, "submissions", submissionId);
    const ledgerRef = doc(ctx.db, "pointsLedger", `submission_${submissionId}`);
    const submissionSnap = await transaction.get(submissionRef);
    assert(submissionSnap.exists(), "Submission missing during approval.");
    const submission = submissionSnap.data();
    const previousPoints = submission.status === "approved" ? Number(submission.awardedPoints || 0) : 0;
    const safePoints = Number(awardedPoints || 0);
    const delta = safePoints - previousPoints;
    const completedTaskDelta = submission.status === "approved" ? 0 : 1;

    transaction.set(
      submissionRef,
      {
        status: "approved",
        reviewComment,
        awardedPoints: safePoints,
        reviewedBy: ctx.user.uid,
        reviewedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    transaction.set(
      ledgerRef,
      {
        userId: submission.userId,
        departmentId: submission.departmentId,
        parentDepartmentId,
        sourceType: "task_submission",
        sourceId: submissionId,
        points: safePoints,
        direction: "credit",
        approvedBy: ctx.user.uid,
        note: reviewComment,
        createdAt: serverTimestamp(),
      },
      { merge: true },
    );

    transaction.set(
      doc(ctx.db, "users", submission.userId),
      {
        totalPoints: increment(delta),
        completedTaskCount: increment(completedTaskDelta),
        lastLedgerId: `submission_${submissionId}`,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  });

  cleanup.push(() => deleteDocument(`pointsLedger/submission_${submissionId}`));
  recordCheck(checkName, "ok");
};

const recordAttendanceAsHead = async (ctx, targetUserId) => {
  const attendanceRef = doc(collection(ctx.db, "attendance"));
  const ledgerRef = doc(ctx.db, "pointsLedger", `attendance_${attendanceRef.id}`);
  const batch = writeBatch(ctx.db);
  batch.set(attendanceRef, {
    userId: targetUserId,
    departmentId,
    parentDepartmentId,
    eventType: "workshop",
    eventTitle: "Smoke test workshop",
    status: "present",
    pointsAwarded: 5,
    recordedBy: ctx.user.uid,
    recordedAt: serverTimestamp(),
  });
  batch.set(ledgerRef, {
    userId: targetUserId,
    departmentId,
    parentDepartmentId,
    sourceType: "attendance",
    sourceId: attendanceRef.id,
    points: 5,
    direction: "credit",
    approvedBy: ctx.user.uid,
    note: "Smoke test workshop",
    createdAt: serverTimestamp(),
  });
  batch.set(doc(ctx.db, "users", targetUserId), {
    totalPoints: increment(5),
    lastLedgerId: `attendance_${attendanceRef.id}`,
    updatedAt: serverTimestamp(),
  }, { merge: true });
  await batch.commit();
  cleanup.push(() => deleteDocument(`attendance/${attendanceRef.id}`));
  cleanup.push(() => deleteDocument(`pointsLedger/attendance_${attendanceRef.id}`));
  recordCheck("department_head: attendance credit", "ok");
};

const verifyMemberSummary = async (ctx, submissionId) => {
  const [userSnap, submissionSnap, ledgerSnap] = await Promise.all([
    getDoc(doc(ctx.db, "users", ctx.user.uid)),
    getDoc(doc(ctx.db, "submissions", submissionId)),
    getDoc(doc(ctx.db, "pointsLedger", `submission_${submissionId}`)),
  ]);
  assert(userSnap.exists(), "Member profile missing after approval.");
  assert(submissionSnap.exists(), "Submission missing after approval.");
  assert(ledgerSnap.exists(), "Points ledger missing after approval.");
  const userData = userSnap.data();
  assert(Number(userData.totalPoints || 0) === 55, `Expected totalPoints to be 55, received ${userData.totalPoints}.`);
  assert(Number(userData.completedTaskCount || 0) === 1, `Expected completedTaskCount to be 1, received ${userData.completedTaskCount}.`);
  recordCheck("member: summary and ledger verification", "ok", {
    totalPoints: userData.totalPoints,
    completedTaskCount: userData.completedTaskCount,
  });
};

const verifyZeroPointApprovalState = async (ctx, submissionId) => {
  const [userSnap, submissionSnap, ledgerSnap] = await Promise.all([
    getDoc(doc(ctx.db, "users", ctx.user.uid)),
    getDoc(doc(ctx.db, "submissions", submissionId)),
    getDoc(doc(ctx.db, "pointsLedger", `submission_${submissionId}`)),
  ]);
  assert(userSnap.exists(), "Member profile missing after zero-point approval.");
  assert(submissionSnap.exists(), "Zero-point submission missing after approval.");
  assert(ledgerSnap.exists(), "Zero-point ledger missing after approval.");

  const userData = userSnap.data();
  const submissionData = submissionSnap.data();
  const ledgerData = ledgerSnap.data();

  assert(submissionData.status === "approved", `Expected zero-point submission to be approved, received ${submissionData.status}.`);
  assert(Number(submissionData.awardedPoints || 0) === 0, `Expected awardedPoints to remain 0, received ${submissionData.awardedPoints}.`);
  assert(Number(ledgerData.points || 0) === 0, `Expected zero-point ledger entry, received ${ledgerData.points}.`);
  assert(Number(userData.totalPoints || 0) === 55, `Expected totalPoints to remain 55, received ${userData.totalPoints}.`);
  assert(Number(userData.completedTaskCount || 0) === 2, `Expected completedTaskCount to be 2, received ${userData.completedTaskCount}.`);

  recordCheck("member: zero-point approval summary verification", "ok", {
    totalPoints: userData.totalPoints,
    completedTaskCount: userData.completedTaskCount,
    ledgerPoints: ledgerData.points,
  });
};

const directorCanManageUser = async (ctx, targetUserId) => {
  await updateDoc(doc(ctx.db, "users", targetUserId), {
    role: "mentor",
    roles: ["mentor"],
    status: "probation",
    departmentId,
    parentDepartmentId,
    updatedAt: serverTimestamp(),
  });
  recordCheck("director: user access update", "ok");
};

const superAdminCanWriteConfig = async (ctx) => {
  const configId = `${smokePrefix}_config`;
  await setDoc(doc(ctx.db, "configs", configId), {
    smokeTest: true,
    updatedAt: serverTimestamp(),
  }, { merge: true });
  cleanup.push(() => deleteDocument(`configs/${configId}`));
  recordCheck("super_admin: config write", "ok");
};

try {
  const member = await createContext("member");
  const mentor = await createContext("mentor");
  const head = await createContext("department_head");
  const director = await createContext("director");
  const superAdmin = await createContext("super_admin");

  await Promise.all([
    createOwnProfile(member),
    createOwnProfile(mentor),
    createOwnProfile(head),
    createOwnProfile(director),
    createOwnProfile(superAdmin),
  ]);

  for (const ctx of [member, mentor, head, director, superAdmin]) {
    await sleep(2000); // Wait for rules/indexes to catch up with newly created user doc
    await setDepartmentAsMember(ctx);
  }

  await switchDepartmentAsMember(member, alternateDepartmentId, alternateParentDepartmentId);
  await switchDepartmentAsMember(member, departmentId, parentDepartmentId);

  await Promise.all([
    patchUserRole(mentor, "mentor"),
    patchUserRole(head, "department_head"),
    patchUserRole(director, "director"),
    patchUserRole(superAdmin, "super_admin"),
  ]);

  await sleep(1000);

  const task = await getOpenTask(member);
  const submissionId = await submitAssignedTaskAsMember(member, task);
  const directSubmissionId = await submitDirectTaskAsMember(member);

  await expectDenied("member: cannot write points ledger", async () => {
    await setDoc(doc(member.db, "pointsLedger", `${smokePrefix}_member_denied`), {
      userId: member.user.uid,
      departmentId,
      parentDepartmentId,
      sourceType: "manual",
      sourceId: smokePrefix,
      points: 50,
      direction: "credit",
      approvedBy: member.user.uid,
      note: "Should be denied",
      createdAt: serverTimestamp(),
    });
  });

  await saveMentorRecommendation(mentor, submissionId);

  await expectDenied("mentor: cannot approve submission", async () => {
    await updateDoc(doc(mentor.db, "submissions", submissionId), {
      status: "approved",
      reviewComment: "Mentor should not approve.",
      reviewedBy: mentor.user.uid,
      reviewedAt: serverTimestamp(),
      awardedPoints: 50,
      updatedAt: serverTimestamp(),
    });
  });

  await expectDenied("director: cannot self-escalate to super_admin", async () => {
    await updateDoc(doc(director.db, "users", director.user.uid), {
      role: "super_admin",
      roles: ["super_admin"],
      updatedAt: serverTimestamp(),
    });
  });

  await expectDenied("director: cannot promote another user to super_admin", async () => {
    await updateDoc(doc(director.db, "users", mentor.user.uid), {
      role: "super_admin",
      roles: ["super_admin"],
      departmentId,
      parentDepartmentId,
      updatedAt: serverTimestamp(),
    });
  });

  await expectDenied("department_head: cannot promote a user to department_head", async () => {
    await updateDoc(doc(head.db, "users", mentor.user.uid), {
      role: "department_head",
      roles: ["department_head"],
      departmentId,
      parentDepartmentId,
      updatedAt: serverTimestamp(),
    });
  });

  await expectDenied("member: cannot prefill review fields on create", async () => {
    await setDoc(doc(member.db, "submissions", `${smokePrefix}_invalid_create`), {
      taskId: task.id,
      taskTitle: task.title || "Submit proof of completion",
      resourceTitle: task.resourceTitle || "",
      userId: member.user.uid,
      userDisplayName: member.displayName,
      departmentId,
      courseId: task.courseId || "",
      lessonId: task.lessonId || "",
      taskSource: "assigned",
      taskReferenceUrl: task.preferredResourceUrl || task.resourceUrl || "",
      taskOrigin: "mentor_direct",
      submittedText: "invalid create",
      submissionLinks: [{ type: "link", url: "https://example.com/invalid-proof" }],
      status: "pending",
      recommendation: "approve",
      reviewComment: "should be denied",
      reviewedBy: member.user.uid,
      reviewedAt: serverTimestamp(),
      recommendedBy: member.user.uid,
      recommendedAt: serverTimestamp(),
      recommendedPoints: 50,
      awardedPoints: 0,
      submittedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });

  await finalizeAsDepartmentHead(head, submissionId, 50);
  await expectDenied("department_head: cannot re-finalize approved submission", async () => {
    await updateDoc(doc(head.db, "submissions", submissionId), {
      status: "rejected",
      reviewComment: "Should be denied after final approval.",
      reviewedBy: head.user.uid,
      reviewedAt: serverTimestamp(),
      awardedPoints: 0,
      updatedAt: serverTimestamp(),
    });
  });
  await recordAttendanceAsHead(head, member.user.uid);
  await verifyMemberSummary(member, submissionId);
  await finalizeAsDepartmentHead(head, directSubmissionId, 0, {
    checkName: "department_head: zero-point approval keeps ledger integrity",
    reviewComment: "Department head zero-point smoke-test approval.",
  });
  await verifyZeroPointApprovalState(member, directSubmissionId);
  await directorCanManageUser(director, mentor.user.uid);
  await superAdminCanWriteConfig(superAdmin);

  await syncDepartmentMemberCount();

  console.log(JSON.stringify({
    ok: true,
    checks,
    summary: {
      usersCreated: contexts.length,
      submissionId,
      departmentId,
    },
  }, null, 2));
} catch (error) {
  console.error(JSON.stringify({
    ok: false,
    checks,
    error: String(error?.message || error),
  }, null, 2));
  process.exitCode = 1;
} finally {
  for (const cleanupStep of cleanup.reverse()) {
    try {
      await cleanupStep();
    } catch {
      // Best-effort cleanup.
    }
  }
  try {
    await syncDepartmentMemberCount();
  } catch {
    // Ignore cleanup sync failures.
  }
}
