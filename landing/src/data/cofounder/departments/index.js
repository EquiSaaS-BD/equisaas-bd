import { businessDepartment } from "./business";
import { designDepartment } from "./design";
import { marketingDepartment } from "./marketing";
import { softwareDepartment } from "./software";
import { normalizeLocalizedTree } from "@/lib/localized-copy";

const ROLE_DEPARTMENT_MAP = {
  "se-frontend": {
    id: "frontend",
    parentDepartmentId: "engineering",
    parentTitleEn: "Software Engineering",
    parentTitleBn: "সফটওয়্যার ইঞ্জিনিয়ারিং",
    titleEn: "Frontend Engineering",
    titleBn: "ফ্রন্টএন্ড ইঞ্জিনিয়ারিং",
    summaryEn: "React, Next.js, UI systems, accessibility, and production-ready frontend delivery.",
    summaryBn: "React, Next.js, UI system, accessibility, এবং production-ready frontend delivery শেখার ট্র্যাক।",
    color: "blue",
  },
  "se-backend": {
    id: "backend",
    parentDepartmentId: "engineering",
    parentTitleEn: "Software Engineering",
    parentTitleBn: "সফটওয়্যার ইঞ্জিনিয়ারিং",
    titleEn: "Backend Engineering",
    titleBn: "ব্যাকএন্ড ইঞ্জিনিয়ারিং",
    summaryEn: "APIs, databases, security, and reliable backend systems for SaaS operations.",
    summaryBn: "API, database, security, এবং reliable backend system build করার ট্র্যাক।",
    color: "blue",
  },
  "se-devops": {
    id: "devopsqa",
    parentDepartmentId: "engineering",
    parentTitleEn: "Software Engineering",
    parentTitleBn: "সফটওয়্যার ইঞ্জিনিয়ারিং",
    titleEn: "DevOps & QA",
    titleBn: "ডেভঅপস ও কিউএ",
    summaryEn: "Deployment, CI/CD, observability, reliability, and quality assurance workflows.",
    summaryBn: "Deployment, CI/CD, observability, reliability, এবং QA workflow শেখার ট্র্যাক।",
    color: "blue",
  },
  "design-ux": {
    id: "uiux",
    parentDepartmentId: "design",
    parentTitleEn: "UI/UX & Design",
    parentTitleBn: "ইউআই/ইউএক্স ও ডিজাইন",
    titleEn: "UI/UX Design",
    titleBn: "ইউআই/ইউএক্স ডিজাইন",
    summaryEn: "User research, Figma systems, prototypes, interaction design, and interface quality.",
    summaryBn: "User research, Figma system, prototype, interaction design, এবং interface quality-এর ট্র্যাক।",
    color: "emerald",
  },
  "design-brand": {
    id: "design",
    parentDepartmentId: "design",
    parentTitleEn: "UI/UX & Design",
    parentTitleBn: "ইউআই/ইউএক্স ও ডিজাইন",
    titleEn: "Graphic Design",
    titleBn: "গ্রাফিক ডিজাইন",
    summaryEn: "Brand assets, campaign creatives, social visuals, and design production systems.",
    summaryBn: "Brand asset, campaign creative, social visual, এবং design production workflow-এর ট্র্যাক।",
    color: "emerald",
  },
  "product-ba": {
    id: "baagile",
    parentDepartmentId: "product",
    parentTitleEn: "Product & Business Analysis",
    parentTitleBn: "প্রোডাক্ট ও বিজনেস অ্যানালাইসিস",
    titleEn: "Business Analysis & Agile",
    titleBn: "বিজনেস অ্যানালাইসিস ও এজাইল",
    summaryEn: "Requirements, user stories, process analysis, agile delivery, and traceable execution.",
    summaryBn: "Requirement, user story, process analysis, agile delivery, এবং traceable execution-এর ট্র্যাক।",
    color: "amber",
  },
  "product-pm": {
    id: "pm",
    parentDepartmentId: "product",
    parentTitleEn: "Product & Business Analysis",
    parentTitleBn: "প্রোডাক্ট ও বিজনেস অ্যানালাইসিস",
    titleEn: "Product Management",
    titleBn: "প্রোডাক্ট ম্যানেজমেন্ট",
    summaryEn: "Roadmaps, discovery, prioritization, metrics, and launch planning for SaaS products.",
    summaryBn: "Roadmap, discovery, prioritization, metrics, এবং SaaS launch planning-এর ট্র্যাক।",
    color: "amber",
  },
  "marketing-growth": {
    id: "marketing",
    parentDepartmentId: "marketing",
    parentTitleEn: "Marketing & Customer Success",
    parentTitleBn: "মার্কেটিং ও কাস্টমার সাকসেস",
    titleEn: "Digital Marketing",
    titleBn: "ডিজিটাল মার্কেটিং",
    summaryEn: "Growth, SEO, funnel messaging, lifecycle campaigns, analytics, and content systems.",
    summaryBn: "Growth, SEO, funnel messaging, lifecycle campaign, analytics, এবং content system-এর ট্র্যাক।",
    color: "purple",
  },
  "marketing-success": {
    id: "crmcs",
    parentDepartmentId: "marketing",
    parentTitleEn: "Marketing & Customer Success",
    parentTitleBn: "মার্কেটিং ও কাস্টমার সাকসেস",
    titleEn: "CRM & Customer Success",
    titleBn: "সিআরএম ও কাস্টমার সাকসেস",
    summaryEn: "Customer onboarding, support operations, retention, CRM workflows, and community health.",
    summaryBn: "Customer onboarding, support operation, retention, CRM workflow, এবং community health-এর ট্র্যাক।",
    color: "purple",
  },
};

const groupedDepartments = [softwareDepartment, designDepartment, businessDepartment, marketingDepartment];

export const departments = normalizeLocalizedTree(
  groupedDepartments.flatMap((group) =>
    group.roles.map((role) => {
      const mapped = ROLE_DEPARTMENT_MAP[role.id];

      return {
        ...role,
        ...mapped,
        titleEn: mapped.titleEn,
        titleBn: mapped.titleBn,
        descEn: mapped.summaryEn,
        descBn: mapped.summaryBn,
        icon: group.icon,
        roleId: role.id,
        lmsDepartmentId: mapped.id,
      };
    }),
  ),
);
