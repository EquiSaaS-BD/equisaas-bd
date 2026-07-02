import { DEPARTMENT_OPTIONS, sanitizeAssignedResourceText } from "./catalog.js";
import { RESOURCE_DATABASE_ROWS } from "./resource-database.js";

export const GLOBAL_ANNOUNCEMENT = {
  id: "week1_global_launch",
  scope: "global",
  scopeKey: "global",
  title: "Week 1 is live",
  body: "Week 1 শুরু হয়েছে। সবাই কাজ শুরু করো।",
  priority: "normal",
  isPublished: true,
};

export const DEFAULT_PROOF_CHECKLIST = [
  "Link works",
  "Matches user name",
  "Completion visible",
];

export const DEFAULT_SUBMISSION_TYPES = [
  "certificate",
  "screenshot",
  "public_profile",
  "github",
  "link",
];

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

const LANGUAGE_LABELS = {
  bn: "বাংলা",
  hi: "Guided track",
  en: "English",
};

const DEPARTMENT_DESCRIPTIONS = {
  frontend: "Bangla and English frontend learning resources with proof-based tasks and reviewer-ready validation notes.",
  backend: "Backend development resources covering Bangla and English foundations, APIs, databases, and portfolio proof.",
  devopsqa: "DevOps and QA resources for cloud, automation, testing, and security with proof-driven submission tasks.",
  uiux: "UI/UX learning resources across Bangla and English with certification paths, tool practice, and portfolio proof.",
  design: "Graphic design resources with Bangla and English options covering Canva, Photoshop, flyers, and proof models.",
  baagile: "Business analysis and agile resources with structured Bangla and English learning and proof-based tasks.",
  pm: "Product management resources spanning Bangla and English learning tracks with execution-focused proof tasks.",
  marketing: "Digital marketing resources with Bangla and English certification options and campaign-oriented proof tasks.",
  crmcs: "CRM and customer success resources with Bangla and English learning, communication, and badge pathways.",
};

const COURSE_TITLE_OVERRIDES = {
  frontend: "Frontend Verified Learning Track",
  backend: "Backend Verified Learning Track",
  devopsqa: "DevOps & QA Verified Learning Track",
  uiux: "UI/UX Verified Learning Track",
  design: "Graphic Design Verified Learning Track",
  baagile: "Business Analysis & Agile Verified Learning Track",
  pm: "Product Management Verified Learning Track",
  marketing: "Digital Marketing Verified Learning Track",
  crmcs: "CRM & Customer Success Verified Learning Track",
};

const courseIdForDepartment = (departmentId) => `${departmentId}_week1_foundations`;

const normalizeCredentialType = (credentialType) => {
  switch (String(credentialType || "").trim()) {
    case "free_certificate":
      return "certificate_free";
    case "free_badge":
      return "badge_free";
    case "paid_certificate":
      return "paid_optional";
    case "verifiable_artifact":
    default:
      return "verifiable_artifact";
  }
};

const normalizeCredentialCost = (credentialCost) => {
  const value = String(credentialCost || "").trim();
  return value || "free";
};

const normalizeHours = (value) => {
  const nextValue = Number.parseFloat(String(value || "").trim());
  return Number.isFinite(nextValue) ? nextValue : 0;
};

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const simpleHash = (value) => {
  let hash = 0;
  for (const character of String(value || "")) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }
  return hash.toString(36);
};

const deriveLessonKey = (departmentId, languageCode, title, url) => {
  const titleSlug = slugify(title).slice(0, 28);
  const urlHash = simpleHash(`${departmentId}|${languageCode}|${title}|${url}`).slice(0, 6);
  return `${departmentId}_${languageCode}_${titleSlug || "resource"}_${urlHash}`;
};

const buildPreferredUrl = (url) => {
  const value = String(url || "").trim();
  if (!value) return "";

  if (/open\.edu\/openlearn\//i.test(value) && value.includes("/content-section-")) {
    return value.replace(/\/content-section-.+$/i, "");
  }

  return value;
};

const buildAccessNote = (row, preferredUrl) => {
  const notes = [];
  const originalUrl = String(row.url || "").trim();
  const providerName = String(row.provider || "").trim();

  if (preferredUrl && preferredUrl !== originalUrl) {
    notes.push("If the deep section link stalls, open the verified fallback page and continue from the course contents.");
  }

  if (/OpenLearn|open\.edu/i.test(providerName) || /open\.edu\/openlearn/i.test(originalUrl)) {
    notes.push("OpenLearn may pause on a browser check before loading. Refresh once or open the original course page in a fresh tab if needed.");
  }

  if (/Canva/i.test(providerName) || /canva\.com/i.test(originalUrl)) {
    notes.push("Canva may ask for sign-in before showing accreditation or certified-course pages.");
  }

  if (/HubSpot|Skillshop|AWS|Trailhead|Coursera|Credly/i.test(providerName) || /hubspot|skillshop|aws|trailhead|coursera|credly/i.test(originalUrl)) {
    notes.push("This provider may ask you to sign in before it shows badges, certificates, or progress history.");
  }

  if (/Muktopaath|training\.gov\.bd/i.test(providerName) || /muktopaath|training\.gov\.bd/i.test(originalUrl)) {
    notes.push("If the provider opens slowly, wait for the page to finish loading and use the share or certificate view as your proof.");
  }

  if (!notes.length) {
    notes.push("Open the resource in a fresh tab. If the provider blocks direct opening, copy the link and paste it into the browser manually.");
  }

  return notes.join(" ");
};

const summarizeRow = (row, languageLabel, estimatedHours, credentialType) => {
  const summaryParts = [
    row.provider,
    languageLabel,
    estimatedHours ? `${estimatedHours}h` : "",
    credentialType === "paid_optional" ? "Optional premium path" : "",
  ].filter(Boolean);

  return `${summaryParts.join(" • ")}${row.credibilityNote ? ` • ${row.credibilityNote}` : ""}`;
};

const departmentLessons = Object.fromEntries(DEPARTMENT_OPTIONS.map((department) => [department.id, []]));

for (const row of RESOURCE_DATABASE_ROWS) {
  const departmentId = DEPARTMENT_CODE_MAP[row.deptId];
  if (!departmentId || !departmentLessons[departmentId]) {
    continue;
  }

  const languageCode = String(row.language || "").trim() || "en";
  const languageLabel = sanitizeAssignedResourceText(
    LANGUAGE_LABELS[languageCode] || languageCode.toUpperCase(),
  );
  const externalUrl = String(row.url || "").trim();
  const preferredUrl = buildPreferredUrl(externalUrl);
  const credentialType = normalizeCredentialType(row.credentialType);
  const credentialCost = normalizeCredentialCost(row.credentialCost);
  const estimatedHours = normalizeHours(row.estHours);
  const title = String(row.title || "").trim();
  const lessonId = deriveLessonKey(departmentId, languageCode, title, externalUrl);

  departmentLessons[departmentId].push({
    id: lessonId,
    title,
    summary: sanitizeAssignedResourceText(
      summarizeRow(row, languageLabel, estimatedHours, credentialType),
    ),
    externalUrl,
    originalExternalUrl: externalUrl,
    preferredUrl,
    accessNote: buildAccessNote(row, preferredUrl),
    providerName: String(row.provider || "").trim() || "External resource",
    estimatedHours,
    credentialType,
    credentialCost,
    credentialCostLabel: credentialCost,
    subtitles: String(row.subtitles || "").trim(),
    languageCode,
    languageLabel,
    credibilityNote: sanitizeAssignedResourceText(String(row.credibilityNote || "").trim()),
  });
}

export const V1_RESOURCE_CATALOG = DEPARTMENT_OPTIONS.map((department) => {
  const lessons = departmentLessons[department.id];
  const estimatedHours = lessons.reduce((sum, lesson) => sum + Number(lesson.estimatedHours || 0), 0);

  return {
    departmentId: department.id,
    courseId: courseIdForDepartment(department.id),
    title: COURSE_TITLE_OVERRIDES[department.id] || `${department.title} Learning Track`,
    description: sanitizeAssignedResourceText(
      DEPARTMENT_DESCRIPTIONS[department.id] || `${department.title} learning resources with proof-based submission tasks.`,
    ),
    difficulty: "Foundational",
    estimatedHours,
    lessons,
  };
});

export const CATALOG_LESSON_LOOKUP = Object.fromEntries(
  V1_RESOURCE_CATALOG.flatMap((course) =>
    course.lessons.map((lesson) => [
      lesson.id,
      {
        ...lesson,
        courseId: course.courseId,
        departmentId: course.departmentId,
      },
    ]),
  ),
);

export const getCatalogLessonTaskId = (departmentId, lessonId) => `${departmentId}_${lessonId}_proof`;
