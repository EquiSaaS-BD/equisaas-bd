import { RESOURCE_DATABASE_ROWS } from "../lib/resource-database.js";
import { sanitizeAssignedResourceText } from "../lib/catalog.js";
import { V1_RESOURCE_CATALOG } from "../lib/resource-catalog.js";

const DEPARTMENT_CODE_MAP = {
  fe: "frontend",
  be: "backend",
  devops: "devopsqa",
  ux: "uiux",
  design: "design",
  ba: "baagile",
  pm: "pm",
  marketing: "marketing",
  crm: "crmcs",
};

const expectedRows = RESOURCE_DATABASE_ROWS.map((row) => ({
  departmentId: DEPARTMENT_CODE_MAP[row.deptId],
  languageCode: row.language,
  title: row.title,
  externalUrl: row.url,
}));

const actualRows = V1_RESOURCE_CATALOG.flatMap((course) =>
  course.lessons.map((lesson) => ({
    departmentId: course.departmentId,
    languageCode: lesson.languageCode,
    title: lesson.title,
    externalUrl: lesson.externalUrl,
  })),
);

const byDepartment = (items) =>
  items.reduce((accumulator, item) => {
    accumulator[item.departmentId] = accumulator[item.departmentId] || [];
    accumulator[item.departmentId].push(item);
    return accumulator;
  }, {});

const toKey = (item) => `${item.departmentId}||${item.languageCode}||${item.title}||${item.externalUrl}`;

const expectedByDepartment = byDepartment(expectedRows);
const actualByDepartment = byDepartment(actualRows);
const issues = [];
const forbiddenUiTerms = /\bHindi\b|\bIndia\b/i;

for (const [departmentId, rows] of Object.entries(expectedByDepartment)) {
  const actual = actualByDepartment[departmentId] || [];

  if (rows.length !== actual.length) {
    issues.push(`${departmentId} should have ${rows.length} resources but has ${actual.length}.`);
  }

  const actualKeySet = new Set(actual.map(toKey));
  for (const row of rows) {
    if (!actualKeySet.has(toKey(row))) {
      issues.push(`${departmentId} is missing catalog row "${row.title}" (${row.languageCode}) -> ${row.externalUrl}`);
    }
  }
}

for (const row of actualRows) {
  if (!expectedRows.some((item) => toKey(item) === toKey(row))) {
    issues.push(`${row.departmentId} has unexpected catalog row "${row.title}" (${row.languageCode}) -> ${row.externalUrl}`);
  }
}

for (const course of V1_RESOURCE_CATALOG) {
  const visibleCourseDescription = sanitizeAssignedResourceText(course.description);
  if (forbiddenUiTerms.test(visibleCourseDescription)) {
    issues.push(`${course.departmentId} course description still exposes disallowed locale text.`);
  }

  for (const lesson of course.lessons) {
    const visibleFields = [
      sanitizeAssignedResourceText(lesson.title),
      sanitizeAssignedResourceText(lesson.summary),
      sanitizeAssignedResourceText(lesson.languageLabel),
      sanitizeAssignedResourceText(lesson.credibilityNote),
    ].filter(Boolean);

    if (visibleFields.some((value) => forbiddenUiTerms.test(value))) {
      issues.push(`${course.departmentId}/${lesson.id} still exposes disallowed locale text in visible lesson copy.`);
    }
  }
}

const report = {
  totals: {
    expectedRows: expectedRows.length,
    actualRows: actualRows.length,
    departments: Object.keys(expectedByDepartment).length,
  },
  departmentCounts: Object.fromEntries(
    Object.keys(expectedByDepartment).map((departmentId) => [
      departmentId,
      {
        expected: expectedByDepartment[departmentId].length,
        actual: (actualByDepartment[departmentId] || []).length,
      },
    ]),
  ),
  issues,
};

console.log(JSON.stringify(report, null, 2));

if (issues.length) {
  process.exit(1);
}
