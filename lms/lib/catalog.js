export const ROLE_OPTIONS = [
  "super_admin",
  "director",
  "department_head",
  "mentor",
  "member",
];

export const PARENT_DEPARTMENTS = [
  { id: "engineering", title: "Engineering" },
  { id: "design", title: "Design" },
  { id: "product", title: "Product" },
  { id: "marketing", title: "Marketing" },
];

export const DEPARTMENT_OPTIONS = [
  { id: "frontend", title: "Frontend Engineering", parentDepartmentId: "engineering" },
  { id: "backend", title: "Backend Engineering", parentDepartmentId: "engineering" },
  { id: "devopsqa", title: "DevOps & QA", parentDepartmentId: "engineering" },
  { id: "uiux", title: "UI/UX Design", parentDepartmentId: "design" },
  { id: "design", title: "Graphic Design", parentDepartmentId: "design" },
  { id: "baagile", title: "Business Analysis & Agile", parentDepartmentId: "product" },
  { id: "pm", title: "Product Management", parentDepartmentId: "product" },
  { id: "marketing", title: "Digital Marketing", parentDepartmentId: "marketing" },
  { id: "crmcs", title: "CRM & Customer Success", parentDepartmentId: "marketing" },
];

export const DEPARTMENT_SEO = {
  frontend: {
    titleEn: "Frontend Engineering Curriculum | EquiSaaS BD",
    titleBn: "ফ্রন্টএন্ড ইঞ্জিনিয়ারিং কারিকুলাম | EquiSaaS BD",
    descEn: "Learn React, Next.js, and frontend architecture. Submit proof-based tasks and build real SaaS products with EquiSaaS BD.",
    descBn: "React, Next.js এবং ফ্রন্টএন্ড আর্কিটেকচার শিখুন। EquiSaaS BD এর সাথে বাস্তব SaaS প্রোডাক্ট তৈরি করুন।",
    keywords: ["Frontend Training Bangladesh", "React JS BD", "Next.js Learning", "ফ্রন্টএন্ড ইঞ্জিনিয়ারিং", "EquiSaaS Frontend"]
  },
  backend: {
    titleEn: "Backend Engineering Curriculum | EquiSaaS BD",
    titleBn: "ব্যাকএন্ড ইঞ্জিনিয়ারিং কারিকুলাম | EquiSaaS BD",
    descEn: "Master Node.js, Firebase, and scalable architecture. Join the backend department to build core SME software.",
    descBn: "Node.js, Firebase এবং ব্যাকএন্ড আর্কিটেকচার শিখুন। SME সফটওয়্যার তৈরিতে অংশ নিন।",
    keywords: ["Backend Training Bangladesh", "Node JS BD", "Firebase Course", "ব্যাকএন্ড ইঞ্জিনিয়ারিং", "EquiSaaS Backend"]
  },
  devopsqa: {
    titleEn: "DevOps & QA Curriculum | EquiSaaS BD",
    titleBn: "DevOps ও QA কারিকুলাম | EquiSaaS BD",
    descEn: "Learn CI/CD, testing, and deployment. Ensure quality for Bangladesh-first SaaS solutions.",
    descBn: "CI/CD, টেস্টিং এবং ডিপ্লয়মেন্ট শিখুন। সফটওয়্যার কোয়ালিটি নিশ্চিত করুন।",
    keywords: ["DevOps Training BD", "QA Testing Bangladesh", "সফটওয়্যার টেস্টিং", "EquiSaaS DevOps"]
  },
  uiux: {
    titleEn: "UI/UX Design Curriculum | EquiSaaS BD",
    titleBn: "UI/UX ডিজাইন কারিকুলাম | EquiSaaS BD",
    descEn: "Learn user experience and interface design using Figma. Design real-world SaaS products.",
    descBn: "Figma দিয়ে UI/UX ডিজাইন শিখুন। বাস্তব SaaS প্রোডাক্টের ডিজাইন করুন।",
    keywords: ["UI UX Design Bangladesh", "Figma Training BD", "UI ডিজাইন", "EquiSaaS Design"]
  },
  design: {
    titleEn: "Graphic Design Curriculum | EquiSaaS BD",
    titleBn: "গ্রাফিক ডিজাইন কারিকুলাম | EquiSaaS BD",
    descEn: "Master branding, marketing materials, and visual identity for modern tech cooperatives.",
    descBn: "ব্র্যান্ডিং এবং গ্রাফিক ডিজাইন শিখুন।",
    keywords: ["Graphic Design Bangladesh", "গ্রাফিক ডিজাইন", "EquiSaaS Graphic Design"]
  },
  baagile: {
    titleEn: "Business Analysis & Agile Curriculum | EquiSaaS BD",
    titleBn: "বিজনেস অ্যানালাইসিস ও অ্যাজাইল কারিকুলাম | EquiSaaS BD",
    descEn: "Learn agile methodologies, requirement gathering, and business analysis for SME software.",
    descBn: "অ্যাজাইল মেথডোলজি এবং বিজনেস অ্যানালাইসিস শিখুন।",
    keywords: ["Business Analysis BD", "Agile Training Bangladesh", "বিজনেস অ্যানালাইসিস", "EquiSaaS BA"]
  },
  pm: {
    titleEn: "Product Management Curriculum | EquiSaaS BD",
    titleBn: "প্রোডাক্ট ম্যানেজমেন্ট কারিকুলাম | EquiSaaS BD",
    descEn: "Lead product development, write PRDs, and manage software lifecycles in Bangladesh.",
    descBn: "প্রোডাক্ট ম্যানেজমেন্ট এবং PRD লেখা শিখুন।",
    keywords: ["Product Management BD", "প্রোডাক্ট ম্যানেজমেন্ট", "EquiSaaS PM"]
  },
  marketing: {
    titleEn: "Digital Marketing Curriculum | EquiSaaS BD",
    titleBn: "ডিজিটাল মার্কেটিং কারিকুলাম | EquiSaaS BD",
    descEn: "Learn SEO, content marketing, and growth strategies for software products.",
    descBn: "SEO এবং ডিজিটাল মার্কেটিং শিখুন।",
    keywords: ["Digital Marketing Bangladesh", "SEO Training BD", "ডিজিটাল মার্কেটিং", "EquiSaaS Marketing"]
  },
  crmcs: {
    titleEn: "CRM & Customer Success Curriculum | EquiSaaS BD",
    titleBn: "CRM ও কাস্টমার সাকসেস কারিকুলাম | EquiSaaS BD",
    descEn: "Master customer relations and support systems for SaaS applications.",
    descBn: "SaaS অ্যাপ্লিকেশনের জন্য কাস্টমার সাকসেস শিখুন।",
    keywords: ["CRM Training BD", "Customer Success Bangladesh", "কাস্টমার সাকসেস", "EquiSaaS CRM"]
  }
};

export const DEPARTMENT_IDEAL_CERTIFICATE_SUMMARIES = {
  frontend: "Successfully mastered modern frontend architecture, state management, and responsive interface development. Demonstrated exceptional proficiency in building accessible, high performance web applications using React and Next.js within a collaborative product environment.",
  backend: "Successfully completed comprehensive training in scalable server side architecture, database design, and API development. Demonstrated strong technical competence in building secure, high performance Node.js and Firebase backend systems for enterprise applications.",
  devopsqa: "Successfully demonstrated expertise in continuous integration, automated testing, and deployment pipelines. Proven ability to ensure rigorous software quality standards and maintain reliable cloud infrastructure for production grade applications.",
  uiux: "Successfully mastered user centered design principles, interactive prototyping, and visual hierarchy. Demonstrated exceptional ability to conduct user research and craft intuitive, highly engaging digital interfaces using industry standard design systems.",
  design: "Successfully demonstrated advanced proficiency in visual communication, brand identity creation, and digital asset design. Proven ability to translate complex concepts into compelling visual narratives that align with modern branding standards.",
  baagile: "Successfully mastered requirements engineering, agile methodologies, and business process modeling. Demonstrated exceptional capability in bridging the gap between business objectives and technical execution to drive successful software delivery.",
  pm: "Successfully demonstrated comprehensive expertise in product lifecycle management, strategic roadmapping, and cross functional team leadership. Proven ability to translate user needs into actionable product requirements and deliver high impact software solutions.",
  marketing: "Successfully mastered multi channel digital marketing strategies, SEO optimization, and data driven growth tactics. Demonstrated exceptional ability in executing targeted campaigns and driving sustainable user acquisition for technology products.",
  crmcs: "Successfully demonstrated expertise in customer relationship management, onboarding optimization, and user retention strategies. Proven ability to foster strong client relationships and ensure long term product success through proactive customer support.",
};

export const STATUS_OPTIONS = ["active", "probation", "paused"];
export const GLOBAL_SCOPE_ROLES = new Set(["super_admin", "director"]);
export const MANAGEMENT_ROLES = new Set(["super_admin", "director", "department_head"]);
export const REVIEW_ROLES = new Set(["super_admin", "director", "department_head", "mentor"]);
export const POINTS_ROLES = new Set(["super_admin", "director", "department_head"]);
export const ROLE_PRIORITY = ["super_admin", "director", "department_head", "mentor", "member"];
export const SUBMISSION_TYPE_OPTIONS = [
  "certificate",
  "screenshot",
  "public_profile",
  "github",
  "link",
  "text",
];

export const CREDENTIAL_TYPE_LABELS = {
  certificate_free: "Free certificate",
  badge_free: "Free badge",
  verifiable_artifact: "Verifiable artifact",
  paid_optional: "Paid optional",
};

export const SUBMISSION_TYPE_LABELS = {
  certificate: "Certificate link",
  screenshot: "Screenshot link",
  public_profile: "Public profile",
  github: "GitHub repo",
  link: "General link",
  text: "Written note",
};

const POLICY_TEXT_REPLACEMENTS = [
  [/\bBangla,\s*Hindi,\s*(?:and|&)\s*English\b/gi, "Bangla and English"],
  [/\bBangla,\s*Hindi\b/gi, "Bangla"],
  [/\bHindi,\s*(?:and|&)\s*English\b/gi, "English"],
  [/\s*\((?:Hindi|Hindi supported)\)\s*/gi, " "],
  [/\s+in\s+Hindi\b/gi, ""],
  [/\bHindi-first instruction\b/gi, "provider language guidance"],
  [/\bHindi-first CS training\b/gi, "customer service training"],
  [/\bHindi-first\b/gi, "guided"],
  [/\bHindi supported\b/gi, "supported"],
  [/\bHindi facilitation notes\b/gi, "local facilitation notes"],
  [/\bHindi UI availability\b/gi, "provider UI availability"],
  [/\bFree Hindi\b/gi, "Free"],
  [/\bHindi\b/gi, ""],
  [/\bIndia\b/gi, ""],
];

const collapseWhitespace = (value) => String(value || "").replace(/\s+/g, " ").trim();
const ROLE_PRIORITY_MAP = new Map(ROLE_PRIORITY.map((roleId, index) => [roleId, index]));
const isKnownRole = (value) => ROLE_OPTIONS.includes(String(value || "").trim());

function extractRawRoles(source) {
  if (Array.isArray(source)) {
    return source;
  }

  if (typeof source === "string") {
    return [source];
  }

  if (!source || typeof source !== "object") {
    return [];
  }

  return [
    ...(Array.isArray(source.roles) ? source.roles : []),
    ...(Array.isArray(source.profile?.roles) ? source.profile.roles : []),
    source.role,
    source.profile?.role,
  ].filter(Boolean);
}

export const getRoleList = (source) => {
  const normalized = [...new Set(
    extractRawRoles(source)
      .map((roleId) => String(roleId || "").trim())
      .filter((roleId) => isKnownRole(roleId)),
  )];

  const safeRoles = normalized.length ? normalized : ["member"];
  return safeRoles.sort(
    (left, right) => (ROLE_PRIORITY_MAP.get(left) ?? ROLE_PRIORITY.length) - (ROLE_PRIORITY_MAP.get(right) ?? ROLE_PRIORITY.length),
  );
};

export const getPrimaryRole = (source) => getRoleList(source)[0] || "member";
export const hasRole = (source, roleId) => getRoleList(source).includes(roleId);
const hasAnyRole = (source, allowedRoles) => getRoleList(source).some((roleId) => allowedRoles.has(roleId));

export const getDepartmentMeta = (departmentId) =>
  DEPARTMENT_OPTIONS.find((item) => item.id === departmentId) || null;

export const getDepartmentTitle = (departmentId) =>
  getDepartmentMeta(departmentId)?.title || departmentId || "Unassigned";

export const getParentTitle = (parentDepartmentId) =>
  PARENT_DEPARTMENTS.find((item) => item.id === parentDepartmentId)?.title ||
  parentDepartmentId ||
  "Unassigned";

export const getParentDepartmentId = (departmentId) =>
  getDepartmentMeta(departmentId)?.parentDepartmentId || "";

export const getCredentialTypeLabel = (credentialType) =>
  CREDENTIAL_TYPE_LABELS[credentialType] || credentialType || "Not specified";

export const getSubmissionTypeLabel = (submissionType) =>
  SUBMISSION_TYPE_LABELS[submissionType] || submissionType || "Link";

export const sanitizeAssignedResourceText = (value) => {
  let nextValue = collapseWhitespace(value);
  if (!nextValue) return "";

  for (const [pattern, replacement] of POLICY_TEXT_REPLACEMENTS) {
    nextValue = nextValue.replace(pattern, replacement);
  }

  return nextValue
    .replace(/\(\s*\)/g, "")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/([([])\s+/g, "$1")
    .replace(/\s+([)\]])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
};

export const getCoursePreviewDescription = (course) => {
  const description = String(course?.description || "").trim();
  const title = String(course?.title || "").trim();
  const safeDescription = sanitizeAssignedResourceText(description);

  if (course?.catalogSource === "legacy_preserved") {
    return "Earlier approved resources preserved for reference and optional follow-up learning.";
  }

  if (/week\s*1\s*foundations/i.test(title)) {
    return "Verified foundation resources with proof-based tasks for this department.";
  }

  return safeDescription || "Structured learning resources and proof-based tasks for this department.";
};

export const canBrowseAllDepartments = (roleSource) => hasAnyRole(roleSource, GLOBAL_SCOPE_ROLES);
export const canManage = (roleSource) => hasAnyRole(roleSource, MANAGEMENT_ROLES);
export const canReview = (roleSource) => hasAnyRole(roleSource, REVIEW_ROLES);
export const canAwardPoints = (roleSource) => hasAnyRole(roleSource, POINTS_ROLES);

export const resolveScopedDepartmentId = ({ role, profileDepartmentId, preferredDepartmentId = "" }) => {
  if (canBrowseAllDepartments(role)) {
    return preferredDepartmentId || profileDepartmentId || DEPARTMENT_OPTIONS[0]?.id || "";
  }
  return profileDepartmentId || "";
};

export const roleLabel = (roleSource) => {
  switch (getPrimaryRole(roleSource)) {
    case "super_admin":
      return "Ecosystem Custodian";
    case "director":
      return "Governance Steward";
    case "department_head":
      return "Department Steward";
    case "mentor":
      return "Mentor";
    default:
      return "Co-builder";
  }
};

export const roleLabels = (roleSource) => getRoleList(roleSource).map((roleId) => roleLabel(roleId));
