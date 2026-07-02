import { LINKS } from "@/data/cofounder";

const APPLICATION_FORM_URL = LINKS.registrationForm;

const FORM_FIELDS = {
  source: "883279036",
  priorSkills: "1651626583",
  preferredDepartment: "1958470794",
  dailyTime: "1675416552",
  specificTraining: "820095206",
};

function mapDepartmentToFormGroup(departmentId) {
  switch (departmentId) {
    case "frontend":
    case "backend":
    case "devopsqa":
      return "Engineering & Development";
    case "marketing":
      return "Sales & Marketing";
    case "crmcs":
      return "Customer Support & Implementation";
    case "uiux":
    case "design":
    case "baagile":
    case "pm":
      return "Product & UI/UX Design";
    default:
      return "";
  }
}

function mapDepartmentToTrainingInterest(departmentId) {
  switch (departmentId) {
    case "frontend":
    case "backend":
    case "devopsqa":
      return "Advanced Programming/Coding";
    case "marketing":
      return "Advanced Digital Marketing/SEO";
    case "baagile":
    case "pm":
      return "Product Management Methodologies";
    default:
      return "";
  }
}

function mapExperienceToPriorSkill(level, departmentId) {
  if (level === "beginner") {
    return "No skills - want to learn from scratch";
  }

  switch (departmentId) {
    case "frontend":
    case "backend":
    case "devopsqa":
      return "Web Development";
    case "uiux":
    case "design":
      return "Graphic Design";
    case "marketing":
      return "Digital Marketing";
    case "crmcs":
      return "Customer Support";
    default:
      return "";
  }
}

function buildSourceSummary({
  departmentTitle,
  levelLabel,
  timeLabel,
  roleLabel,
  firstTaskLabel,
  stillUnsure,
  backups = [],
}) {
  const segments = [
    "Landing fit guide recommendation",
    `Department: ${departmentTitle}`,
    levelLabel ? `Level: ${levelLabel}` : null,
    timeLabel ? `Availability: ${timeLabel}` : null,
    roleLabel ? `Role interest: ${roleLabel}` : null,
    firstTaskLabel ? `Preferred work: ${firstTaskLabel}` : null,
    stillUnsure ? "Status: still unsure, exploring options" : "Status: ready to apply",
    backups.length ? `Backup departments: ${backups.join(", ")}` : null,
  ];

  return segments.filter(Boolean).join(" | ");
}

export function buildApplicationLink({
  departmentId = "",
  departmentTitle = "",
  level = "",
  levelLabel = "",
  timeAvailability = "",
  timeLabel = "",
  roleLabel = "",
  firstTaskLabel = "",
  stillUnsure = false,
  backups = [],
} = {}) {
  const params = new URLSearchParams({ usp: "pp_url" });

  const preferredDepartment = mapDepartmentToFormGroup(departmentId);
  const priorSkill = mapExperienceToPriorSkill(level, departmentId);
  const trainingInterest = mapDepartmentToTrainingInterest(departmentId);
  const sourceSummary = buildSourceSummary({
    departmentTitle,
    levelLabel,
    timeLabel,
    roleLabel,
    firstTaskLabel,
    stillUnsure,
    backups,
  });

  if (sourceSummary) {
    params.set(`entry.${FORM_FIELDS.source}`, sourceSummary);
  }

  if (preferredDepartment) {
    params.set(`entry.${FORM_FIELDS.preferredDepartment}`, preferredDepartment);
  }

  if (timeAvailability) {
    params.set(`entry.${FORM_FIELDS.dailyTime}`, timeAvailability);
  }

  if (priorSkill) {
    params.set(`entry.${FORM_FIELDS.priorSkills}`, priorSkill);
  }

  if (trainingInterest) {
    params.set(`entry.${FORM_FIELDS.specificTraining}`, trainingInterest);
  }

  return `${APPLICATION_FORM_URL}?${params.toString()}`;
}

export { APPLICATION_FORM_URL };
