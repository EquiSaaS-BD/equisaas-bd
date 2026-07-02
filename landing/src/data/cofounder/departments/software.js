import { MonitorSmartphone } from "lucide-react";

export const softwareDepartment = {
  id: "engineering",
  icon: MonitorSmartphone,
  color: "blue",
  titleBn: "সফটওয়্যার ইঞ্জিনিয়ারিং",
  titleEn: "Software Engineering",
  descBn: "প্রোডাক্টের মূল আর্কিটেকচার, ফ্রন্টএন্ড, ব্যাকএন্ড এবং ডেপ্লয়মেন্ট।",
  descEn: "Core architecture, frontend, backend, and deployment of products.",
  roles: [
    {
      id: "se-frontend",
      titleBn: "ফ্রন্ট-এন্ড ইঞ্জিনিয়ার (React/Next.js)",
      titleEn: "Frontend Engineer (React/Next.js)",
      roadmap: [
        {
          phaseBn: "মাস ১: ফাউন্ডেশন ও ফ্রেমওয়ার্ক",
          phaseEn: "Month 1: Foundations & Frameworks",
          itemsBn: ["React ও TypeScript ফাউন্ডেশন", "Next.js App Router ও রাউটিং", "Git/GitHub ও কোড কনভেনশন"],
          itemsEn: ["React + TypeScript foundations", "Next.js App Router and routing", "Git/GitHub and code conventions"],
        },
        {
          phaseBn: "মাস ২: স্টেট আর্কিটেকচার",
          phaseEn: "Month 2: State Architecture",
          itemsBn: ["Redux Toolkit/Zustand দিয়ে ক্লায়েন্ট স্টেট", "TanStack Query দিয়ে সার্ভার স্টেট ও ক্যাশিং", "ফর্ম/ভ্যালিডেশন ও ত্রুটি হ্যান্ডলিং"],
          itemsEn: ["Client state with Redux Toolkit/Zustand", "Server state and caching with TanStack Query", "Forms, validation, and error handling"],
        },
        {
          phaseBn: "মাস ৩: UI সিস্টেম",
          phaseEn: "Month 3: UI System",
          itemsBn: ["Tailwind টোকেন ও ডিজাইন সিস্টেম বেস", "রেসপনসিভ গ্রিড ও লেআউট কম্পোজিশন", "কম্পোনেন্ট লাইব্রেরি স্ট্রাকচার"],
          itemsEn: ["Tailwind tokens and design system base", "Responsive grids and layout composition", "Component library structure"],
        },
        {
          phaseBn: "মাস ৪: পারফরম্যান্স",
          phaseEn: "Month 4: Performance",
          itemsBn: ["Suspense/স্ট্রিমিং কৌশল", "কোড স্প্লিটিং ও ইমেজ অপটিমাইজেশন", "Web Vitals বাজেট ও বাণ্ডেল টিউনিং"],
          itemsEn: ["Suspense/streaming strategy", "Code splitting and image optimization", "Web Vitals budgets and bundle tuning"],
        },
        {
          phaseBn: "মাস ৫: কোয়ালিটি ও টেস্টিং",
          phaseEn: "Month 5: Quality & Testing",
          itemsBn: ["Jest দিয়ে ইউনিট টেস্ট", "Playwright দিয়ে E2E টেস্ট", "GitHub Actions CI পাইপলাইন"],
          itemsEn: ["Unit tests with Jest", "E2E tests with Playwright", "GitHub Actions CI pipelines"],
        },
        {
          phaseBn: "মাস ৬: প্রোডাকশন রেডি",
          phaseEn: "Month 6: Production Ready",
          itemsBn: ["বাংলা/ইংরেজি i18n", "অ্যাক্সেসিবিলিটি অডিট", "ইভেন্ট ট্র্যাকিং ও মনিটরিং"],
          itemsEn: ["Bangla/English i18n", "Accessibility audit", "Event tracking and monitoring"],
        },
      ],
      resources: [
        { name: "React Documentation (English)", url: "https://react.dev/", type: "docs" },
        { name: "Next.js Documentation (English)", url: "https://nextjs.org/docs", type: "docs" },
        { name: "Tailwind CSS Documentation (English)", url: "https://tailwindcss.com/docs/installation", type: "docs" },
        { name: "Redux Toolkit Documentation (English)", url: "https://redux.js.org/redux-toolkit/overview", type: "docs" },
        { name: "Learn With Sumit (Bangla)", url: "https://learnwithsumit.com/", type: "platform" },
        { name: "Hablu Programmer (Bangla)", url: "https://hablu-programmer.com/", type: "platform" },
      ],
    },
    {
      id: "se-backend",
      titleBn: "ব্যাক-এন্ড ইঞ্জিনিয়ার (Laravel/Node.js)",
      titleEn: "Backend Engineer (Laravel/Node.js)",
      roadmap: [
        {
          phaseBn: "মাস ১: API ও কোর কনসেপ্ট",
          phaseEn: "Month 1: API & Core Concepts",
          itemsBn: ["Laravel/Node কোর কনসেপ্ট", "REST API ডিজাইন", "সার্ভিস লেয়ার ও মিডলওয়্যার"],
          itemsEn: ["Laravel/Node core concepts", "REST API design", "Service layer and middleware"],
        },
        {
          phaseBn: "মাস ২: ডাটা মডেলিং",
          phaseEn: "Month 2: Data Modeling",
          itemsBn: ["PostgreSQL ডাটা মডেলিং", "মাইগ্রেশন, ইনডেক্স, কুয়েরি টিউনিং", "Eloquent/Prisma ORM প্যাটার্ন"],
          itemsEn: ["PostgreSQL data modeling", "Migrations, indexing, query tuning", "Eloquent/Prisma ORM patterns"],
        },
        {
          phaseBn: "মাস ৩: সিকিউরিটি",
          phaseEn: "Month 3: Security",
          itemsBn: ["Auth: সেশন বনাম JWT", "RBAC/ABAC ও টেন্যান্ট আইসোলেশন", "অডিট লগিং ও রেট লিমিট"],
          itemsEn: ["Auth: sessions vs JWT", "RBAC/ABAC and tenant isolation", "Audit logging and rate limiting"],
        },
        {
          phaseBn: "মাস ৪: রিলায়েবিলিটি",
          phaseEn: "Month 4: Reliability",
          itemsBn: ["Queue/Job ও ব্যাকগ্রাউন্ড ওয়ার্কার", "ক্যাশিং ও আইডেম্পোটেন্সি", "ফেইলিওর রিকভারি কৌশল"],
          itemsEn: ["Queues/jobs and background workers", "Caching and idempotency", "Failure recovery strategies"],
        },
        {
          phaseBn: "মাস ৫: টেস্টিং ও ডেপ্লয়মেন্ট",
          phaseEn: "Month 5: Testing & Deployment",
          itemsBn: ["Laravel টেস্টিং স্ট্যাক", "ইন্টেগ্রেশন/কন্ট্র্যাক্ট টেস্ট", "ডকারাইজড ডেভ এনভি ও CI"],
          itemsEn: ["Laravel testing stack", "Integration/contract tests", "Dockerized dev env and CI"],
        },
        {
          phaseBn: "মাস ৬: সিস্টেম ডিজাইন",
          phaseEn: "Month 6: System Design",
          itemsBn: ["মাল্টি‑টেন্যান্ট SaaS আর্কিটেকচার", "Well‑Architected রিভিউ", "SRE বেসিকস ও 12‑Factor"],
          itemsEn: ["Multi‑tenant SaaS architecture", "Well‑Architected review", "SRE basics and 12‑Factor"],
        },
      ],
      resources: [
        { name: "Laravel Documentation (English)", url: "https://laravel.com/docs", type: "docs" },
        { name: "Laravel Testing (English)", url: "https://laravel.com/docs/testing", type: "docs" },
        { name: "Node.js Documentation (English)", url: "https://nodejs.org/api/documentation.html", type: "docs" },
        { name: "PostgreSQL Documentation (English)", url: "https://www.postgresql.org/docs/", type: "docs" },
        { name: "Prisma Documentation (English)", url: "https://www.prisma.io/docs", type: "docs" },
        { name: "System Design Primer (Free)", url: "https://github.com/donnemartin/system-design-primer", type: "platform" },
      ],
    },
    {
      id: "se-devops",
      titleBn: "প্ল্যাটফর্ম/ডেভঅপস ইঞ্জিনিয়ার",
      titleEn: "Platform/DevOps Engineer",
      roadmap: [
        {
          phaseBn: "মাস ১: CI বেসিকস",
          phaseEn: "Month 1: CI Basics",
          itemsBn: ["Git/GitHub ফ্লো", "CI পাইপলাইন ধারণা", "এনভায়রনমেন্ট কনফিগ স্ট্যান্ডার্ড"],
          itemsEn: ["Git/GitHub flow", "CI pipeline fundamentals", "Environment configuration standards"],
        },
        {
          phaseBn: "মাস ২: কন্টেইনারাইজেশন",
          phaseEn: "Month 2: Containerization",
          itemsBn: ["Docker ও Compose", "লোকাল-প্যারিটি ডেভ এনভি", "বিল্ড আর্টিফ্যাক্ট স্ট্র্যাটেজি"],
          itemsEn: ["Docker and Compose", "Local parity dev environments", "Build artifact strategy"],
        },
        {
          phaseBn: "মাস ৩: অর্কেস্ট্রেশন",
          phaseEn: "Month 3: Orchestration",
          itemsBn: ["Kubernetes বেসিকস", "রিলিজ স্ট্র্যাটেজি (blue/green, canary)", "ডেপ্লয় চেকলিস্ট"],
          itemsEn: ["Kubernetes fundamentals", "Release strategies (blue/green, canary)", "Deployment checklists"],
        },
        {
          phaseBn: "মাস ৪: অবজারভেবিলিটি",
          phaseEn: "Month 4: Observability",
          itemsBn: ["লগ, মেট্রিকস, ট্রেসিং", "SLO ও এরর বাজেট", "এলার্টিং হাইজিন"],
          itemsEn: ["Logs, metrics, tracing", "SLOs and error budgets", "Alerting hygiene"],
        },
        {
          phaseBn: "মাস ৫: সিকিউরিটি ও কমপ্লায়েন্স",
          phaseEn: "Month 5: Security & Compliance",
          itemsBn: ["সিক্রেটস ম্যানেজমেন্ট", "ব্যাকআপ ও রিকভারি ড্রিল", "ডিপেন্ডেন্সি স্ক্যানিং"],
          itemsEn: ["Secrets management", "Backup and recovery drills", "Dependency scanning"],
        },
        {
          phaseBn: "মাস ৬: কস্ট ও রিলায়েবিলিটি",
          phaseEn: "Month 6: Cost & Reliability",
          itemsBn: ["কস্ট অপটিমাইজেশন", "Well‑Architected রিভিউ", "ইনসিডেন্ট গেম ডে"],
          itemsEn: ["Cost optimization", "Well‑Architected reviews", "Incident game days"],
        },
      ],
      resources: [
        { name: "GitHub Actions (English)", url: "https://docs.github.com/actions", type: "docs" },
        { name: "Docker Documentation (English)", url: "https://docs.docker.com/", type: "docs" },
        { name: "Kubernetes Documentation (English/Bangla)", url: "https://kubernetes.io/docs/", type: "docs" },
        { name: "AWS Well-Architected (English)", url: "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html", type: "docs" },
        { name: "Google SRE Books (Free)", url: "https://sre.google/books/", type: "platform" },
        { name: "The Twelve-Factor App (Free)", url: "https://www.12factor.net/", type: "platform" },
      ],
    },
  ],
};

