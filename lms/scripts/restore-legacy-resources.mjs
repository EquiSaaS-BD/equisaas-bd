import path from "node:path";
import { fileURLToPath } from "node:url";
import { DEPARTMENT_OPTIONS, getDepartmentTitle, getParentDepartmentId, sanitizeAssignedResourceText } from "../lib/catalog.js";
import { DEFAULT_PROOF_CHECKLIST, DEFAULT_SUBMISSION_TYPES, V1_RESOURCE_CATALOG } from "../lib/resource-catalog.js";
import { listDocuments, patchDocument } from "./shared/firebase-cli-rest.mjs";

const __filename = fileURLToPath(import.meta.url);
const systemUserId = "system_activation";

const normalizeUrl = (value) =>
  String(value || "")
    .trim()
    .replace(/\/+$/, "")
    .toLowerCase();

const isArchived = (item) => item?.status === "archived" || item?.status === "closed" || item?.isActive === false;

const scoreLesson = (lesson) => {
  const title = String(lesson.title || "");
  let score = 0;

  if (!/resource\s*\d|foundations resource|course\s*\d/i.test(title)) {
    score += 10;
  }
  if (!/muktopaath .* resource/i.test(title)) {
    score += 4;
  }
  if (lesson.providerName) {
    score += 2;
  }
  if (lesson.summary && String(lesson.summary).length > 20) {
    score += 2;
  }
  score -= Math.max(0, title.length - 90) / 100;

  return score;
};

const buildLegacyTaskInstructions = (lesson) => {
  const checklist = DEFAULT_PROOF_CHECKLIST.map((item) => `- ${item}`).join("\n");
  const visibleLessonTitle = sanitizeAssignedResourceText(lesson.title);

  return [
    `Complete the legacy resource: ${visibleLessonTitle}.`,
    lesson.providerName ? `Provider: ${lesson.providerName}` : "",
    lesson.externalUrl ? `Open the resource: ${lesson.externalUrl}` : "",
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

const primaryCatalogUrls = new Set(
  V1_RESOURCE_CATALOG.flatMap((course) => course.lessons.map((lesson) => normalizeUrl(lesson.externalUrl))),
);

export const restoreLegacyResources = async () => {
  const [allLessons, allTasks] = await Promise.all([listDocuments("lessons"), listDocuments("tasks")]);
  const restoredCourses = [];
  let restoredLessons = 0;
  let restoredTasks = 0;

  for (const department of DEPARTMENT_OPTIONS) {
    const archivedLessons = allLessons.filter(
      (lesson) =>
        lesson.departmentId === department.id &&
        isArchived(lesson) &&
        lesson.catalogSource !== "legacy_preserved" &&
        !primaryCatalogUrls.has(normalizeUrl(lesson.externalUrl)),
    );

    const uniqueLessonMap = new Map();
    for (const lesson of archivedLessons) {
      const key = normalizeUrl(lesson.externalUrl) || lesson.id;
      const existing = uniqueLessonMap.get(key);
      if (!existing || scoreLesson(lesson) > scoreLesson(existing)) {
        uniqueLessonMap.set(key, lesson);
      }
    }

    const selectedLessons = [...uniqueLessonMap.values()].sort((left, right) =>
      String(left.title || left.id).localeCompare(String(right.title || right.id)),
    );

    if (!selectedLessons.length) {
      await patchDocument(`departments/${department.id}`, {
        courseCount: 1,
        updatedAt: new Date().toISOString(),
      });
      continue;
    }

    const courseId = `${department.id}_legacy_resources`;
    const parentDepartmentId = getParentDepartmentId(department.id);

    await patchDocument(`courses/${courseId}`, {
      title: `${getDepartmentTitle(department.id)} Legacy Resource Library`,
      description: "Previously available EquiSaaS resources preserved alongside the new verified learning track.",
      departmentId: department.id,
      parentDepartmentId,
      difficulty: "Supplemental",
      estimatedHours: selectedLessons.reduce((sum, lesson) => sum + Number(lesson.estimatedHours || 0), 0),
      lessonCount: selectedLessons.length,
      lessonIds: selectedLessons.map((lesson) => lesson.id),
      order: 2,
      status: "published",
      catalogSource: "legacy_preserved",
      isActive: true,
      createdBy: systemUserId,
      updatedAt: new Date().toISOString(),
    });

    restoredCourses.push({ courseId, departmentId: department.id, lessonCount: selectedLessons.length });

    for (const [index, lesson] of selectedLessons.entries()) {
      const existingTask =
        allTasks.find((task) => task.lessonId === lesson.id) ||
        {
          id: `${department.id}_${lesson.id}_proof`,
        };

      await patchDocument(`lessons/${lesson.id}`, {
        title: sanitizeAssignedResourceText(lesson.title || ""),
        courseId,
        departmentId: department.id,
        parentDepartmentId,
        taskId: existingTask.id,
        order: index + 1,
        status: "published",
        isActive: true,
        catalogSource: "legacy_preserved",
        legacyVisible: true,
        updatedAt: new Date().toISOString(),
      });
      restoredLessons += 1;

      await patchDocument(`tasks/${existingTask.id}`, {
        departmentId: department.id,
        parentDepartmentId,
        courseId,
        lessonId: lesson.id,
        title: existingTask.title || "Submit proof of completion",
        resourceTitle: sanitizeAssignedResourceText(lesson.title || existingTask.resourceTitle || ""),
        resourceUrl: lesson.externalUrl || existingTask.resourceUrl || "",
        preferredResourceUrl: lesson.preferredUrl || existingTask.preferredResourceUrl || "",
        originalResourceUrl: lesson.originalExternalUrl || lesson.externalUrl || existingTask.originalResourceUrl || "",
        accessNote: lesson.accessNote || existingTask.accessNote || "",
        providerName: lesson.providerName || existingTask.providerName || "",
        resourceLanguageCode: lesson.languageCode || existingTask.resourceLanguageCode || "en",
        resourceLanguageLabel: lesson.languageLabel || existingTask.resourceLanguageLabel || "English",
        subtitles: lesson.subtitles || existingTask.subtitles || "",
        credentialType: lesson.credentialType || existingTask.credentialType || "verifiable_artifact",
        credentialCost: lesson.credentialCost || existingTask.credentialCost || "free",
        credibilityNote: lesson.credibilityNote || existingTask.credibilityNote || "",
        instructions: buildLegacyTaskInstructions(lesson),
        allowedSubmissionTypes: existingTask.allowedSubmissionTypes || DEFAULT_SUBMISSION_TYPES,
        submissionType: existingTask.submissionType || "link",
        maxPoints: Number(existingTask.maxPoints || 50),
        reviewMode: existingTask.reviewMode || "manual",
        submissionCount: Number(existingTask.submissionCount || 0),
        proofChecklist: existingTask.proofChecklist || DEFAULT_PROOF_CHECKLIST,
        status: "open",
        catalogSource: "legacy_preserved",
        legacyVisible: true,
        isActive: true,
        createdBy: existingTask.createdBy || systemUserId,
        updatedAt: new Date().toISOString(),
      });
      restoredTasks += 1;
    }

    await patchDocument(`departments/${department.id}`, {
      courseCount: 2,
      updatedAt: new Date().toISOString(),
    });
  }

  return {
    restoredCourses,
    restoredLessons,
    restoredTasks,
  };
};

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === __filename;

if (isDirectRun) {
  restoreLegacyResources()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
