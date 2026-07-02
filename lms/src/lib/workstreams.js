const LEGACY_ASSIGNMENT_STATUS_MAP = Object.freeze({
  pending: "submitted",
  approved: "approved",
  rejected: "needs-revision",
});

export const toMillis = (value) => {
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

export const byLatestActivityDesc = (left, right) =>
  toMillis(right?.latestActivityAt || right?.updatedAt || right?.reviewedAt || right?.submittedAt || right?.createdAt) -
  toMillis(left?.latestActivityAt || left?.updatedAt || left?.reviewedAt || left?.submittedAt || left?.createdAt);

const mapLegacySubmissionStatus = (status = "") => LEGACY_ASSIGNMENT_STATUS_MAP[String(status || "").trim()] || "submitted";

const getLegacyReviewState = (queueItem = {}, submission = {}) => {
  const explicitState = String(queueItem?.peerStatus || queueItem?.state || "").trim();
  if (explicitState) return explicitState;
  const submissionStatus = String(submission?.status || "").trim();
  if (submissionStatus === "approved") return "approved";
  if (submissionStatus === "rejected") return "peer-rework";
  return "pending-peer";
};

export const buildTaskLookup = (tasks = []) =>
  Object.fromEntries(
    tasks
      .map((task) => [task?.taskId || task?.id, task])
      .filter(([taskId]) => Boolean(taskId)),
  );

export const normalizeLegacyAssignmentSubmission = (submission = {}, queueItem = {}) => {
  const submissionId = submission?.id || queueItem?.submissionId || queueItem?.id || "";
  if (!submissionId) return null;

  return {
    id: `assignment:${submissionId}`,
    sourceType: "assignment",
    sourceSubmissionId: submissionId,
    taskId: null,
    uid: submission?.uid || queueItem?.uid || "",
    memberName: submission?.userName || queueItem?.userName || "EquiSaaS Member",
    departmentId: submission?.deptId || queueItem?.deptId || "",
    subdepartmentId: submission?.subdeptId || queueItem?.subdeptId || "",
    pathId: submission?.pathId || queueItem?.pathId || "",
    squadId: null,
    districtId: submission?.districtId || queueItem?.districtId || "",
    titleEn: submission?.itemTitleEn || queueItem?.itemTitleEn || "",
    titleBn: submission?.itemTitleBn || queueItem?.itemTitleBn || "",
    submissionText: "",
    submissionLink: submission?.link || queueItem?.link || "",
    submissionNotes: submission?.notes || queueItem?.notes || "",
    status: mapLegacySubmissionStatus(submission?.status || queueItem?.status),
    reviewState: getLegacyReviewState(queueItem, submission),
    reviewFeedbackEn: submission?.reviewNote || queueItem?.reviewNote || "",
    reviewFeedbackBn: submission?.reviewNote || queueItem?.reviewNote || "",
    peerAttestationCount: Number(queueItem?.attestationSummary?.total || 0),
    latestReviewerUid: submission?.reviewedBy || queueItem?.reviewedBy || null,
    latestReviewerName: submission?.reviewedBy || queueItem?.reviewedBy || null,
    attestationPreview: Array.isArray(queueItem?.attestationPreview) ? queueItem.attestationPreview : [],
    createdAt: submission?.createdAt || queueItem?.createdAt || null,
    submittedAt: submission?.createdAt || queueItem?.createdAt || null,
    reviewedAt: submission?.reviewedAt || queueItem?.reviewedAt || null,
    latestActivityAt:
      submission?.updatedAt ||
      queueItem?.updatedAt ||
      submission?.reviewedAt ||
      submission?.createdAt ||
      queueItem?.createdAt ||
      null,
    meta: {
      month: submission?.month || queueItem?.month || "",
      activityId: submission?.activityId || queueItem?.activityId || "",
      itemId: submission?.itemId || queueItem?.itemId || "",
      legacyStatus: submission?.status || queueItem?.status || "pending",
    },
  };
};

export const normalizeTaskSubmission = (submission = {}, queueItem = {}, taskLookup = {}) => {
  const submissionId = submission?.submissionId || submission?.id || queueItem?.sourceSubmissionId || queueItem?.queueId || "";
  if (!submissionId) return null;

  const taskId = submission?.taskId || queueItem?.taskId || null;
  const task = taskId ? taskLookup?.[taskId] || {} : {};

  return {
    id: `task:${submissionId}`,
    sourceType: "task",
    sourceSubmissionId: submissionId,
    taskId,
    uid: submission?.uid || queueItem?.uid || "",
    memberName: submission?.memberName || queueItem?.memberName || "EquiSaaS Member",
    departmentId: submission?.departmentId || queueItem?.departmentId || task?.departmentId || "",
    subdepartmentId: submission?.subdepartmentId || queueItem?.subdepartmentId || task?.subdepartmentId || "",
    pathId: submission?.pathId || queueItem?.pathId || task?.pathId || "",
    squadId: submission?.squadId || queueItem?.squadId || task?.squadId || null,
    districtId: submission?.districtId || queueItem?.districtId || "",
    titleEn: task?.titleEn || "",
    titleBn: task?.titleBn || "",
    submissionText: submission?.submissionText || "",
    submissionLink: submission?.submissionLink || "",
    submissionNotes: submission?.submissionNotes || "",
    status: submission?.status || (queueItem?.state === "approved" ? "approved" : "submitted"),
    reviewState:
      queueItem?.state ||
      (submission?.status === "approved" ? "approved" : submission?.status === "needs-revision" ? "peer-rework" : "ready-for-manager"),
    reviewFeedbackEn: submission?.reviewFeedbackEn || queueItem?.latestFeedbackSnippet || "",
    reviewFeedbackBn: submission?.reviewFeedbackBn || "",
    peerAttestationCount: Number(queueItem?.peerAttestationCount || 0),
    latestReviewerUid: submission?.reviewedByUid || queueItem?.latestReviewerUid || null,
    latestReviewerName: submission?.reviewedByName || queueItem?.latestReviewerName || null,
    attestationPreview: [],
    createdAt: submission?.createdAt || queueItem?.createdAt || null,
    submittedAt: submission?.submittedAt || submission?.createdAt || queueItem?.createdAt || null,
    reviewedAt: submission?.reviewedAt || null,
    latestActivityAt:
      submission?.latestActivityAt ||
      submission?.updatedAt ||
      queueItem?.updatedAt ||
      submission?.reviewedAt ||
      submission?.submittedAt ||
      submission?.createdAt ||
      null,
    meta: {
      revisionCount: Number(submission?.revisionCount || queueItem?.reviewCycle || 0),
      taskStatus: task?.status || "",
      expectedSubmissionType: task?.expectedSubmissionType || "",
    },
  };
};

export const normalizeLegacyReviewQueueItem = (item = {}) => {
  const submissionId = item?.submissionId || item?.id || "";
  if (!submissionId) return null;

  return {
    id: `assignment:${submissionId}`,
    queueId: submissionId,
    sourceType: "assignment",
    sourceSubmissionId: submissionId,
    taskId: null,
    uid: item?.uid || "",
    memberName: item?.userName || "EquiSaaS Member",
    departmentId: item?.deptId || "",
    subdepartmentId: item?.subdeptId || "",
    pathId: item?.pathId || "",
    squadId: null,
    districtId: item?.districtId || "",
    titleEn: item?.itemTitleEn || "",
    titleBn: item?.itemTitleBn || "",
    reviewState: getLegacyReviewState(item, item),
    status: mapLegacySubmissionStatus(item?.status),
    latestFeedbackSnippet: item?.reviewNote || "",
    peerAttestationCount: Number(item?.attestationSummary?.total || 0),
    latestReviewerUid: item?.reviewedBy || null,
    latestReviewerName: item?.reviewedBy || null,
    attestationPreview: Array.isArray(item?.attestationPreview) ? item.attestationPreview : [],
    createdAt: item?.createdAt || null,
    updatedAt: item?.updatedAt || item?.reviewedAt || item?.createdAt || null,
  };
};

export const normalizeTaskReviewQueueItem = (item = {}, taskLookup = {}) => {
  const submissionId = item?.sourceSubmissionId || item?.queueId || item?.id || "";
  if (!submissionId) return null;

  const task = item?.taskId ? taskLookup?.[item.taskId] || {} : {};

  return {
    id: `task:${submissionId}`,
    queueId: submissionId,
    sourceType: "task",
    sourceSubmissionId: submissionId,
    taskId: item?.taskId || null,
    uid: item?.uid || "",
    memberName: item?.memberName || "EquiSaaS Member",
    departmentId: item?.departmentId || task?.departmentId || "",
    subdepartmentId: item?.subdepartmentId || task?.subdepartmentId || "",
    pathId: item?.pathId || task?.pathId || "",
    squadId: item?.squadId || task?.squadId || null,
    districtId: item?.districtId || "",
    titleEn: task?.titleEn || "",
    titleBn: task?.titleBn || "",
    reviewState: item?.state || "ready-for-manager",
    status: item?.state === "approved" ? "approved" : "submitted",
    latestFeedbackSnippet: item?.latestFeedbackSnippet || "",
    peerAttestationCount: Number(item?.peerAttestationCount || 0),
    latestReviewerUid: item?.latestReviewerUid || null,
    latestReviewerName: item?.latestReviewerName || null,
    attestationPreview: [],
    createdAt: item?.createdAt || null,
    updatedAt: item?.updatedAt || item?.createdAt || null,
  };
};

export const buildUnifiedWorkstreamData = ({
  assignmentSubmissions = [],
  legacyReviewQueueItems = [],
  taskSubmissions = [],
  taskReviewQueue = [],
  taskLookup = {},
} = {}) => {
  const legacyQueueMap = Object.fromEntries(
    legacyReviewQueueItems
      .map((item) => [item?.submissionId || item?.id, item])
      .filter(([id]) => Boolean(id)),
  );
  const taskQueueMap = Object.fromEntries(
    taskReviewQueue
      .map((item) => [item?.sourceSubmissionId || item?.queueId || item?.id, item])
      .filter(([id]) => Boolean(id)),
  );

  const submissions = [
    ...assignmentSubmissions
      .map((item) => normalizeLegacyAssignmentSubmission(item, legacyQueueMap[item?.id]))
      .filter(Boolean),
    ...taskSubmissions
      .map((item) => normalizeTaskSubmission(item, taskQueueMap[item?.submissionId || item?.id], taskLookup))
      .filter(Boolean),
  ].sort(byLatestActivityDesc);

  const reviewQueue = [
    ...legacyReviewQueueItems.map((item) => normalizeLegacyReviewQueueItem(item)).filter(Boolean),
    ...taskReviewQueue.map((item) => normalizeTaskReviewQueueItem(item, taskLookup)).filter(Boolean),
  ].sort((left, right) => {
    const leftPending = left?.reviewState === "approved" ? 1 : 0;
    const rightPending = right?.reviewState === "approved" ? 1 : 0;
    if (leftPending !== rightPending) return leftPending - rightPending;
    return byLatestActivityDesc(left, right);
  });

  return {
    submissions,
    reviewQueue,
    summary: {
      totalSubmissions: submissions.length,
      approvedSubmissions: submissions.filter((item) => item?.status === "approved").length,
      needsRevisionSubmissions: submissions.filter((item) => item?.status === "needs-revision").length,
      pendingReview: reviewQueue.filter((item) => item?.reviewState && item.reviewState !== "approved").length,
      readyForManager: reviewQueue.filter((item) => ["ready-for-manager", "ready-for-admin"].includes(item?.reviewState)).length,
    },
  };
};
