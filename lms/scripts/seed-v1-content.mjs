import path from "node:path";
import { fileURLToPath } from "node:url";
import { DEPARTMENT_OPTIONS, getParentDepartmentId, sanitizeAssignedResourceText } from "../lib/catalog.js";
import {
  DEFAULT_PROOF_CHECKLIST,
  DEFAULT_SUBMISSION_TYPES,
  GLOBAL_ANNOUNCEMENT,
  V1_RESOURCE_CATALOG,
  getCatalogLessonTaskId,
} from "../lib/resource-catalog.js";
import { listDocuments, patchDocument } from "./shared/firebase-cli-rest.mjs";

const __filename = fileURLToPath(import.meta.url);
const systemUserId = "system_activation";
const lmsVersion = "v1_verified_resources";

const nowIso = () => new Date().toISOString();

const buildTaskInstructions = ({ lessonTitle, externalUrl, providerName, languageLabel, credibilityNote }) => {
  const checklist = DEFAULT_PROOF_CHECKLIST.map((item) => `- ${item}`).join("\n");
  const safeLessonTitle = sanitizeAssignedResourceText(lessonTitle);
  const safeLanguageLabel = sanitizeAssignedResourceText(languageLabel);
  const safeCredibilityNote = sanitizeAssignedResourceText(credibilityNote);

  return [
    `Complete the external lesson: ${safeLessonTitle}.`,
    providerName ? `Provider: ${providerName}` : "",
    safeLanguageLabel ? `Resource language: ${safeLanguageLabel}` : "",
    `Open the official resource: ${externalUrl}`,
    safeCredibilityNote ? `Credibility note: ${safeCredibilityNote}` : "",
    "",
    "Submit one valid proof item:",
    "- Certificate link",
    "- Screenshot link",
    "- Public profile",
    "- GitHub repo",
    "",
    "Review checklist:",
    checklist,
  ]
    .filter(Boolean)
    .join("\n");
};

const archiveLegacyCollection = async (collectionId, activeIds, archivedStatus) => {
  const documents = await listDocuments(collectionId);
  let archivedCount = 0;

  for (const document of documents) {
    if (document.catalogSource === "legacy_preserved") {
      continue;
    }

    if (activeIds.has(document.id)) {
      continue;
    }

    await patchDocument(`${collectionId}/${document.id}`, {
      status: archivedStatus,
      isActive: false,
      updatedAt: nowIso(),
    });
    archivedCount += 1;
  }

  return archivedCount;
};

export const seedV1Content = async () => {
  const activeDepartmentIds = new Set(DEPARTMENT_OPTIONS.map((department) => department.id));
  const activeCourseIds = new Set(V1_RESOURCE_CATALOG.map((course) => course.courseId));
  const activeLessonIds = new Set();
  const activeTaskIds = new Set();

  for (const course of V1_RESOURCE_CATALOG) {
    for (const lesson of course.lessons) {
      activeLessonIds.add(lesson.id);
      activeTaskIds.add(getCatalogLessonTaskId(course.departmentId, lesson.id));
    }
  }

  let departmentsSeeded = 0;
  let coursesSeeded = 0;
  let lessonsSeeded = 0;
  let tasksSeeded = 0;

  const archivedCourses = await archiveLegacyCollection("courses", activeCourseIds, "archived");
  const archivedLessons = await archiveLegacyCollection("lessons", activeLessonIds, "archived");
  const archivedTasks = await archiveLegacyCollection("tasks", activeTaskIds, "closed");

  const existingDepartments = await listDocuments("departments");
  for (const department of existingDepartments) {
    if (activeDepartmentIds.has(department.id)) {
      continue;
    }

    await patchDocument(`departments/${department.id}`, {
      isActive: false,
      updatedAt: nowIso(),
    });
  }

  for (const [index, department] of DEPARTMENT_OPTIONS.entries()) {
    const description =
      sanitizeAssignedResourceText(V1_RESOURCE_CATALOG.find((item) => item.departmentId === department.id)?.description) ||
      `${department.title} verified learning resources and proof-based tasks.`;

    await patchDocument(`departments/${department.id}`, {
      name: department.title,
      slug: department.id,
      description,
      headUserId: "",
      mentorIds: [],
      parentDepartmentId: department.parentDepartmentId,
      isActive: true,
      courseCount: 1,
      order: index + 1,
      updatedAt: nowIso(),
    });

    departmentsSeeded += 1;
  }

  for (const course of V1_RESOURCE_CATALOG) {
    const createdAt = nowIso();
    const updatedAt = nowIso();
    const parentDepartmentId = getParentDepartmentId(course.departmentId);

    await patchDocument(`courses/${course.courseId}`, {
      title: course.title,
      description: course.description,
      departmentId: course.departmentId,
      parentDepartmentId,
      difficulty: course.difficulty || "Foundational",
      estimatedHours: Number(course.estimatedHours || 0),
      lessonCount: course.lessons.length,
      lessonIds: course.lessons.map((lesson) => lesson.id),
      order: 1,
      status: "published",
      createdBy: systemUserId,
      createdAt,
      updatedAt,
      lmsVersion,
    });
    coursesSeeded += 1;

    for (const [lessonIndex, lesson] of course.lessons.entries()) {
      const taskId = getCatalogLessonTaskId(course.departmentId, lesson.id);
      const taskCreatedAt = nowIso();
      const taskUpdatedAt = nowIso();
      const deadlineAt = new Date(Date.now() + (lessonIndex + 1) * 24 * 60 * 60 * 1000).toISOString();

      await patchDocument(`lessons/${lesson.id}`, {
        courseId: course.courseId,
        departmentId: course.departmentId,
        parentDepartmentId,
        title: sanitizeAssignedResourceText(lesson.title),
        summary: sanitizeAssignedResourceText(lesson.summary),
        contentType: "external_resource",
        videoUrl: "",
        externalUrl: lesson.externalUrl,
        originalExternalUrl: lesson.originalExternalUrl || lesson.externalUrl,
        preferredUrl: lesson.preferredUrl || "",
        accessNote: lesson.accessNote || "",
        providerName: lesson.providerName,
        estimatedHours: Number(lesson.estimatedHours || 0),
        credentialType: lesson.credentialType,
        credentialCost: lesson.credentialCost || "free",
        credentialCostLabel: lesson.credentialCostLabel || lesson.credentialCost || "free",
        languageCode: lesson.languageCode || "en",
        languageLabel: sanitizeAssignedResourceText(lesson.languageLabel || "English"),
        subtitles: lesson.subtitles || "",
        credibilityNote: sanitizeAssignedResourceText(lesson.credibilityNote || ""),
        readingContent: sanitizeAssignedResourceText(lesson.summary),
        taskId,
        order: lessonIndex + 1,
        status: "published",
        createdBy: systemUserId,
        createdAt: taskCreatedAt,
        updatedAt: taskUpdatedAt,
        lmsVersion,
      });
      lessonsSeeded += 1;

      await patchDocument(`tasks/${taskId}`, {
        departmentId: course.departmentId,
        parentDepartmentId,
        courseId: course.courseId,
        lessonId: lesson.id,
        title: "Submit proof of completion",
        resourceTitle: sanitizeAssignedResourceText(lesson.title),
        resourceUrl: lesson.externalUrl,
        preferredResourceUrl: lesson.preferredUrl || "",
        originalResourceUrl: lesson.originalExternalUrl || lesson.externalUrl,
        accessNote: lesson.accessNote || "",
        providerName: lesson.providerName || "",
        resourceLanguageCode: lesson.languageCode || "en",
        resourceLanguageLabel: sanitizeAssignedResourceText(lesson.languageLabel || "English"),
        subtitles: lesson.subtitles || "",
        credentialType: lesson.credentialType,
        credentialCost: lesson.credentialCost || "free",
        credibilityNote: sanitizeAssignedResourceText(lesson.credibilityNote || ""),
        instructions: buildTaskInstructions({
          lessonTitle: lesson.title,
          externalUrl: lesson.preferredUrl || lesson.externalUrl,
          providerName: lesson.providerName,
          languageLabel: lesson.languageLabel,
          credibilityNote: lesson.credibilityNote,
        }),
        submissionType: "link",
        allowedSubmissionTypes: DEFAULT_SUBMISSION_TYPES,
        maxPoints: 50,
        deadlineAt,
        createdBy: systemUserId,
        status: "open",
        reviewMode: "manual",
        submissionCount: 0,
        proofChecklist: DEFAULT_PROOF_CHECKLIST,
        createdAt: taskCreatedAt,
        updatedAt: taskUpdatedAt,
        lmsVersion,
      });
      tasksSeeded += 1;
    }
  }

  await patchDocument(`announcements/${GLOBAL_ANNOUNCEMENT.id}`, {
    ...GLOBAL_ANNOUNCEMENT,
    createdBy: systemUserId,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  });

  await patchDocument("configs/points_rules", {
    attendancePointsDefault: 5,
    taskApprovalRequiresManualReview: true,
    mentorCanRecommend: true,
    approverRoles: ["super_admin", "director", "department_head"],
    lessonProofPointsDefault: 50,
    duplicateRewardsBlocked: true,
    proofChecklist: DEFAULT_PROOF_CHECKLIST,
    updatedAt: nowIso(),
  });

  await patchDocument("configs/app_settings", {
    allowGoogleSignIn: true,
    canonicalDepartments: DEPARTMENT_OPTIONS.map((item) => item.id),
    oneDepartmentPerUser: true,
    lmsVersion,
    updatedAt: nowIso(),
  });

  return {
    departmentsSeeded,
    coursesSeeded,
    lessonsSeeded,
    tasksSeeded,
    archivedCourses,
    archivedLessons,
    archivedTasks,
  };
};

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === __filename;

if (isDirectRun) {
  seedV1Content()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
