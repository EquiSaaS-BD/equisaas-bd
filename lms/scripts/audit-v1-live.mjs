import { DEPARTMENT_OPTIONS } from "../lib/catalog.js";
import { V1_RESOURCE_CATALOG, getCatalogLessonTaskId } from "../lib/resource-catalog.js";
import { getDocument, listDocuments, runQuery } from "./shared/firebase-cli-rest.mjs";

const countWhere = (items, predicate) => items.filter(predicate).length;

const fetchDepartmentSummary = async (departmentId) => {
  const [courses, openTasks] = await Promise.all([
    runQuery({
      from: [{ collectionId: "courses" }],
      where: {
        compositeFilter: {
          op: "AND",
          filters: [
            {
              fieldFilter: {
                field: { fieldPath: "departmentId" },
                op: "EQUAL",
                value: { stringValue: departmentId },
              },
            },
            {
              fieldFilter: {
                field: { fieldPath: "status" },
                op: "EQUAL",
                value: { stringValue: "published" },
              },
            },
          ],
        },
      },
      limit: 20,
    }),
    runQuery({
      from: [{ collectionId: "tasks" }],
      where: {
        compositeFilter: {
          op: "AND",
          filters: [
            {
              fieldFilter: {
                field: { fieldPath: "departmentId" },
                op: "EQUAL",
                value: { stringValue: departmentId },
              },
            },
            {
              fieldFilter: {
                field: { fieldPath: "status" },
                op: "EQUAL",
                value: { stringValue: "open" },
              },
            },
          ],
        },
      },
      limit: 100,
    }),
  ]);

  return {
    departmentId,
    publishedCourses: courses.length,
    openTasks: openTasks.length,
  };
};

const main = async () => {
  const [departments, courses, lessons, tasks, appSettings] = await Promise.all([
    listDocuments("departments"),
    listDocuments("courses"),
    listDocuments("lessons"),
    listDocuments("tasks"),
    getDocument("configs/app_settings"),
  ]);

  const departmentSummaries = await Promise.all(
    DEPARTMENT_OPTIONS.map((department) => fetchDepartmentSummary(department.id)),
  );
  const expectedCourseIds = new Set(V1_RESOURCE_CATALOG.map((course) => course.courseId));
  const expectedLessonIds = new Set(
    V1_RESOURCE_CATALOG.flatMap((course) => course.lessons.map((lesson) => lesson.id)),
  );
  const expectedTaskIds = new Set(
    V1_RESOURCE_CATALOG.flatMap((course) =>
      course.lessons.map((lesson) => getCatalogLessonTaskId(course.departmentId, lesson.id)),
    ),
  );
  const publishedCourses = courses.filter((item) => item.status === "published");
  const publishedLessons = lessons.filter((item) => item.status === "published");
  const openTasks = tasks.filter((item) => item.status === "open");
  const primaryPublishedCourseIds = new Set(
    publishedCourses.filter((item) => item.catalogSource !== "legacy_preserved").map((item) => item.id),
  );
  const primaryPublishedLessonIds = new Set(
    publishedLessons.filter((item) => item.catalogSource !== "legacy_preserved").map((item) => item.id),
  );
  const primaryOpenTaskIds = new Set(
    openTasks.filter((item) => item.catalogSource !== "legacy_preserved").map((item) => item.id),
  );
  const legacyPublishedCourses = publishedCourses.filter((item) => item.catalogSource === "legacy_preserved");
  const legacyPublishedLessons = publishedLessons.filter((item) => item.catalogSource === "legacy_preserved");
  const legacyOpenTasks = openTasks.filter((item) => item.catalogSource === "legacy_preserved");

  const issues = [];

  if (departments.length < DEPARTMENT_OPTIONS.length) {
    issues.push(`Expected ${DEPARTMENT_OPTIONS.length} departments but found ${departments.length}.`);
  }
  if (primaryPublishedCourseIds.size !== expectedCourseIds.size) {
    issues.push(`Expected ${expectedCourseIds.size} primary published courses but found ${primaryPublishedCourseIds.size}.`);
  }
  if (primaryPublishedLessonIds.size !== expectedLessonIds.size) {
    issues.push(`Expected ${expectedLessonIds.size} primary published lessons but found ${primaryPublishedLessonIds.size}.`);
  }
  if (primaryOpenTaskIds.size !== expectedTaskIds.size) {
    issues.push(`Expected ${expectedTaskIds.size} primary open tasks but found ${primaryOpenTaskIds.size}.`);
  }

  for (const summary of departmentSummaries) {
    const expectedTaskCount =
      V1_RESOURCE_CATALOG.find((course) => course.departmentId === summary.departmentId)?.lessons.length || 0;
    if (summary.publishedCourses < 1) {
      issues.push(`${summary.departmentId} should have at least 1 published course but has ${summary.publishedCourses}.`);
    }
    if (summary.openTasks < expectedTaskCount) {
      issues.push(`${summary.departmentId} should have at least ${expectedTaskCount} open tasks but has ${summary.openTasks}.`);
    }
  }

  for (const courseId of expectedCourseIds) {
    if (!primaryPublishedCourseIds.has(courseId)) {
      issues.push(`Missing published course ${courseId}.`);
    }
  }
  for (const lessonId of expectedLessonIds) {
    if (!primaryPublishedLessonIds.has(lessonId)) {
      issues.push(`Missing published lesson ${lessonId}.`);
    }
  }
  for (const taskId of expectedTaskIds) {
    if (!primaryOpenTaskIds.has(taskId)) {
      issues.push(`Missing open task ${taskId}.`);
    }
  }
  for (const courseId of primaryPublishedCourseIds) {
    if (!expectedCourseIds.has(courseId)) {
      issues.push(`Unexpected published course ${courseId}.`);
    }
  }
  for (const lessonId of primaryPublishedLessonIds) {
    if (!expectedLessonIds.has(lessonId)) {
      issues.push(`Unexpected published lesson ${lessonId}.`);
    }
  }
  for (const taskId of primaryOpenTaskIds) {
    if (!expectedTaskIds.has(taskId)) {
      issues.push(`Unexpected open task ${taskId}.`);
    }
  }

  if (appSettings?.oneDepartmentPerUser !== true) {
    issues.push("configs/app_settings.oneDepartmentPerUser is not true.");
  }

  const taskPointsOffSpec = tasks.filter((task) => Number(task.maxPoints || 0) !== 50).map((task) => task.id);

  const report = {
    totals: {
      departments: departments.length,
      activeDepartments: countWhere(departments, (item) => item.isActive !== false),
      courses: courses.length,
      publishedCourses: publishedCourses.length,
      primaryPublishedCourses: primaryPublishedCourseIds.size,
      legacyPublishedCourses: legacyPublishedCourses.length,
      lessons: lessons.length,
      publishedLessons: publishedLessons.length,
      primaryPublishedLessons: primaryPublishedLessonIds.size,
      legacyPublishedLessons: legacyPublishedLessons.length,
      tasks: tasks.length,
      openTasks: openTasks.length,
      primaryOpenTasks: primaryOpenTaskIds.size,
      legacyOpenTasks: legacyOpenTasks.length,
    },
    config: {
      allowGoogleSignIn: appSettings?.allowGoogleSignIn === true,
      oneDepartmentPerUser: appSettings?.oneDepartmentPerUser === true,
    },
    departments: departmentSummaries,
    taskPointsOffSpec,
    issues,
  };

  console.log(JSON.stringify(report, null, 2));

  if (issues.length || taskPointsOffSpec.length) {
    process.exit(1);
  }
};

main().catch((error) => {
  const message = String(error?.message || error);

  if (message.includes("401 Unauthorized") || message.includes("UNAUTHENTICATED")) {
    console.log(
      JSON.stringify(
        {
          ok: false,
          blockedByAuth: true,
          message: "Live LMS audit could not read Firestore because this environment does not currently have a valid Firebase access token for Firestore REST.",
          nextStep: "Run firebase login again or provide valid CLI credentials before rerunning npm run audit:lms.",
        },
        null,
        2,
      ),
    );
    process.exit(1);
  }

  console.error(error);
  process.exit(1);
});
