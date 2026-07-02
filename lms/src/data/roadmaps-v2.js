export const ROADMAPS_V2 = {
  engineering: {
    frontend: [
      {
        month: 1,
        topicsBn: ["HTML5 ও সেমান্টিক ট্যাগ", "CSS3 ফ্লেক্সবক্স ও গ্রিড", "বেসিক জাভাস্ক্রিপ্ট (ES6)"],
        topicsEn: ["HTML5 & Semantic Tags", "CSS3 Flexbox & Grid", "Basic JavaScript (ES6)"],
        assignmentsBn: ["পার্সোনাল পোর্টফোলিও লেআউট তৈরি", "DOM ম্যানিপুলেশন দিয়ে টু-ডু লিস্ট"],
        assignmentsEn: ["Create personal portfolio layout", "To-do list with DOM manipulation"],
        deliverables: "Static Portfolio Site + Interactive To-Do Module"
      },
      {
        month: 2,
        topicsBn: ["React.js ফান্ডামেন্টালস", "কম্পোনেন্ট লাইফসাইকেল ও হুকস", "Tailwind CSS ইন্টিগ্রেশন"],
        topicsEn: ["React.js Fundamentals", "Component Lifecycle & Hooks", "Tailwind CSS Integration"],
        assignmentsBn: ["লগইন ও ড্যাশবোর্ড UI", "ফেক API থেকে ডাটা ফেচিং"],
        assignmentsEn: ["Login & Dashboard UI", "Data fetching from Fake API"],
        deliverables: "React SPA Dashboard Template"
      },
      {
        month: 3,
        topicsBn: ["Next.js App Router (বেসিক)", "SSR ও SSG", "ফর্মস ও ভ্যালিডেশন (React Hook Form)"],
        topicsEn: ["Next.js App Router (Basics)", "SSR & SSG", "Forms & Validation (React Hook Form)"],
        assignmentsBn: ["EquiSaaS ড্যাশবোর্ডের ফর্ম রিফ্যাক্টর", "নেক্সট জেএস-এ ডাটা ফেচিং আর্কিটেকচার"],
        assignmentsEn: ["Refactor EquiSaaS Dashboard Forms", "Data Fetching Architecture in Next.js"],
        deliverables: "Next.js Integrated Forms with Validation"
      },
      {
        month: 4,
        topicsBn: ["অ্যাডভান্সড স্টেট ম্যানেজমেন্ট (Zustand/Redux)", "পারফরম্যান্স অপ্টিমাইজেশন", "অ্যাসেসিবিলিটি (a11y)"],
        topicsEn: ["Advanced State Management (Zustand/Redux)", "Performance Optimization", "Accessibility (a11y)"],
        assignmentsBn: ["শপিং কার্ট স্টেট ম্যানেজমেন্ট", "Lighthouse স্কোর > ৯০% করা"],
        assignmentsEn: ["Shopping Cart State Management", "Achieve > 90% Lighthouse Score"],
        deliverables: "Optimized React App with Global State"
      },
      {
        month: 5,
        topicsBn: ["ফাউন্ডেশনাল টেস্টিং (Jest ও RTL)", "CI/CD উইথ গিটহাব অ্যাকশনস", "স্টোরিবুক (Storybook)"],
        topicsEn: ["Foundational Testing (Jest & RTL)", "CI/CD with GitHub Actions", "Storybook Integration"],
        assignmentsBn: ["কোর UI কম্পোনেন্টের জন্য টেস্ট লেখা", "অটোমেটেড বিল্ড পাইপলাইন"],
        assignmentsEn: ["Write tests for core UI components", "Automated build pipeline"],
        deliverables: "Tested Components + CI Integration"
      },
      {
        month: 6,
        topicsBn: ["সিস্টেম ডিজাইন", "প্রজেক্ট ডেলিভারি: ইকুই স্যাস LMS মাইগ্রেশন", "ওপেন সোর্স কন্ট্রিবিউশন"],
        topicsEn: ["System Design", "Project Delivery: EquiSaaS LMS Migration", "Open Source Contribution"],
        assignmentsBn: ["LMS ড্যাশবোর্ড প্রোডাকশন রেডি করা", "কিউএ ও রিলিজ ক্যান্ডিডেট তৈরি"],
        assignmentsEn: ["Make LMS Dashboard Production Ready", "Create QA and Release Candidates"],
        deliverables: "Production Grade Code Contribution"
      }
    ],
    backend: [
      {
        month: 1,
        topicsBn: ["ডাটা মডেলিং ও SQL", "Node.js বেসিকস ও Express/Fastify", "RESTful কনভেনশন"],
        topicsEn: ["Data Modeling & SQL", "Node.js Basics & Express/Fastify", "RESTful Conventions"],
        assignmentsBn: ["ইউজার স্কিমা ডিজাইন", "ক্রাড (CRUD) API তৈরি"],
        assignmentsEn: ["User Schema Design", "Create CRUD APIs"],
        deliverables: "API Documentation + Working Endpoints"
      },
      {
        month: 2,
        topicsBn: ["অথেন্টিকেশন (JWT)", "অথরাইজেশন ও রোল-পারমিশন (RBAC)", "PostgreSQL ইন্টিগ্রেশন"],
        topicsEn: ["Authentication (JWT)", "Authorization & RBAC", "PostgreSQL Integration"],
        assignmentsBn: ["লগইন ও রেজিস্ট্রেশন এন্ডপয়েন্ট", "রোল ভিত্তিক কন্টেন্ট অ্যাক্সেস"],
        assignmentsEn: ["Login & Registration Endpoints", "Role-based content access"],
        deliverables: "Secure Auth Service"
      },
      {
        month: 3,
        topicsBn: ["Laravel 10+ ইন্ট্রো", "Eloquent ORM", "মডেল রিলেশনশিপস"],
        topicsEn: ["Laravel 10+ Intro", "Eloquent ORM", "Model Relationships"],
        assignmentsBn: ["কোর্স-লেসন রিলেশনশিপ API", "ডাটাবেস মাইগ্রেশন ও সিডার"],
        assignmentsEn: ["Course-Lesson Relationship API", "DB Migrations & Seeders"],
        deliverables: "Laravel Backend MVP"
      },
      {
        month: 4,
        topicsBn: ["মাল্টি-টেন্যান্সি (SaaS)", "অ্যাডভান্সড কোয়েরি", "ক্যাশিং (Redis)"],
        topicsEn: ["Multi-tenancy (SaaS)", "Advanced Queries", "Caching (Redis)"],
        assignmentsBn: ["টেন্যান্ট-বেসড API আইসোলেশন", "API পারফরম্যান্স ইম্প্রুভমেন্ট"],
        assignmentsEn: ["Tenant-based API isolation", "API Performance Improvements"],
        deliverables: "Performant SaaS Backend Engine"
      },
      {
        month: 5,
        topicsBn: ["ব্যাকগ্রাউন্ড জব ও কিউ", "ইমেইল নোটিফিকেশন", "পেমেন্ট গেটওয়ে ইন্টিগ্রেশন (Stripe/SSLCommerz)"],
        topicsEn: ["Background Jobs & Queues", "Email Notifications", "Payment Gateway Integration"],
        assignmentsBn: ["পাসওয়ার্ড রিসেট জব", "টেস্ট পেমেন্ট ফ্লো"],
        assignmentsEn: ["Password Reset Job", "Test Payment Flow"],
        deliverables: "Worker Queue Processing"
      },
      {
        month: 6,
        topicsBn: ["সিস্টেম ডিজাইন", "CI/CD ডিসপ্লয়মেন্ট (AWS/DigitalOcean)", "EquiSaaS কোর কন্ট্রিবিউশন"],
        topicsEn: ["System Design", "CI/CD Deployment (AWS/DigitalOcean)", "EquiSaaS Core Contribution"],
        assignmentsBn: ["Docker ব্যবহার করে ডিপ্লয়মেন্ট", "LMS API প্রোডাকশনে লাইভ করা"],
        assignmentsEn: ["Docker based deployment", "Push LMS API to Production"],
        deliverables: "Fully Shipped Backend Architecture"
      }
    ],
    devops: [
      {
        month: 1,
        topicsBn: ["CI বেসিকস", "Git/GitHub ফ্লো", "এনভায়রনমেন্ট কনফিগ স্ট্যান্ডার্ড"],
        topicsEn: ["CI Basics", "Git/GitHub Flow", "Environment Configuration Standards"],
        assignmentsBn: ["সিম্পল CI পাইপলাইন সেটআপ", "ব্রাঞ্চিং পলিসি ডকুমেন্ট করা"],
        assignmentsEn: ["Set up a simple CI pipeline", "Document branching policy"],
        deliverables: "CI Starter Pipeline + Team Workflow Guide"
      },
      {
        month: 2,
        topicsBn: ["Docker ও Compose", "লোকাল-প্যারিটি ডেভ এনভি", "বিল্ড আর্টিফ্যাক্ট স্ট্র্যাটেজি"],
        topicsEn: ["Docker and Compose", "Local Parity Dev Environment", "Build Artifact Strategy"],
        assignmentsBn: ["LMS সার্ভিস কন্টেইনারাইজ করা", "লোকাল ও স্টেজিং সমান কনফিগ করা"],
        assignmentsEn: ["Containerize LMS services", "Align local and staging configs"],
        deliverables: "Dockerized Development Stack"
      },
      {
        month: 3,
        topicsBn: ["Kubernetes বেসিকস", "রিলিজ স্ট্র্যাটেজি (blue/green, canary)", "ডেপ্লয় চেকলিস্ট"],
        topicsEn: ["Kubernetes Fundamentals", "Release Strategies (Blue/Green, Canary)", "Deployment Checklist"],
        assignmentsBn: ["স্টেজিং-এ ক্যানারি রিলিজ সিমুলেট করা", "রিলিজ রোলব্যাক চেকলিস্ট তৈরি"],
        assignmentsEn: ["Simulate canary release in staging", "Create release rollback checklist"],
        deliverables: "Release Playbook v1"
      },
      {
        month: 4,
        topicsBn: ["লগ, মেট্রিকস, ট্রেসিং", "SLO ও এরর বাজেট", "এলার্টিং হাইজিন"],
        topicsEn: ["Logs, Metrics, Tracing", "SLOs and Error Budgets", "Alerting Hygiene"],
        assignmentsBn: ["অবজারভেবিলিটি ড্যাশবোর্ড তৈরি", "৩টি ব্যবহারযোগ্য এলার্ট রুল সেটআপ"],
        assignmentsEn: ["Create observability dashboard", "Set up 3 actionable alert rules"],
        deliverables: "Monitoring & Alert Dashboard"
      },
      {
        month: 5,
        topicsBn: ["সিক্রেটস ম্যানেজমেন্ট", "ব্যাকআপ ও রিকভারি ড্রিল", "ডিপেন্ডেন্সি স্ক্যানিং"],
        topicsEn: ["Secrets Management", "Backup and Recovery Drill", "Dependency Scanning"],
        assignmentsBn: ["সাপ্তাহিক ব্যাকআপ টেস্ট", "ডিপেন্ডেন্সি সিকিউরিটি রিপোর্ট তৈরি"],
        assignmentsEn: ["Run weekly backup test", "Generate dependency security report"],
        deliverables: "Security & Recovery Runbook"
      },
      {
        month: 6,
        topicsBn: ["কস্ট অপটিমাইজেশন", "Well-Architected রিভিউ", "ইনসিডেন্ট গেম ডে"],
        topicsEn: ["Cost Optimization", "Well-Architected Review", "Incident Game Day"],
        assignmentsBn: ["মাসিক কস্ট রিপোর্ট ও অপটিমাইজেশন প্ল্যান", "ইনসিডেন্ট রেসপন্স ড্রিল"],
        assignmentsEn: ["Monthly cost report with optimization plan", "Run incident response drill"],
        deliverables: "Production Reliability Review Pack"
      }
    ]
  },
  design: {
    ux: [
      {
        month: 1,
        topicsBn: ["ইউজার রিসার্চ ও ডিসকভারি", "পারসোনা ডিজাইন", "ইনফরমেশন আর্কিটেকচার"],
        topicsEn: ["User Research & Discovery", "Persona Design", "Information Architecture"],
        assignmentsBn: ["LMS ইউজারদের ইন্টারভিউ", "নেভিগেশন ফ্লো তৈরি"],
        assignmentsEn: ["Interview LMS Users", "Create Navigation Flow"],
        deliverables: "User Journey Maps"
      },
      {
        month: 2,
        topicsBn: ["ওয়্যারফ্রেমিং", "Figma ফান্ডামেন্টালস", "UX ল’স ও হিউরিস্টিকস"],
        topicsEn: ["Wireframing", "Figma Fundamentals", "UX Laws and Heuristics"],
        assignmentsBn: ["ড্যাশবোর্ডের লো-ফিডেলিটি ওয়্যারফ্রেম", "হিউরিস্টিক ইভাল্যুশন"],
        assignmentsEn: ["Dashboard Low-fidelity Wireframes", "Heuristic Evaluation"],
        deliverables: "Interactive Wireframes"
      },
      {
        month: 3,
        topicsBn: ["হাই-ফিডেলিটি UI ডিজাইন", "কালার ও টাইপোগ্রাফি সিস্টেম", "রেসপনসিভ লেআউট"],
        topicsEn: ["High-Fidelity UI Design", "Color & Typography Systems", "Responsive Layouts"],
        assignmentsBn: ["মোবাইল ও ওয়েব ড্যাশবোর্ড ডিজাইন", "কালার প্যালেট ও টাইপ স্কেল"],
        assignmentsEn: ["Mobile & Web Dashboard Design", "Color palette and type scale"],
        deliverables: "Hi-Fi SaaS Dashboard Screens"
      },
      {
        month: 4,
        topicsBn: ["ডিজাইন সিস্টেম ও কম্পোনেন্ট লাইব্রেরি", "অটো লেআউট ২.০", "অ্যাক্সেসিবিলিটি (AA)"],
        topicsEn: ["Design Systems & Component Library", "Auto Layout 2.0", "Accessibility (AA)"],
        assignmentsBn: ["EquiSaaS বাটন ও ইনপুট লাইব্রেরি", "ডার্ক/লাইট থিম ভ্যারিয়েন্ট"],
        assignmentsEn: ["EquiSaaS Button & Input Library", "Dark/Light Theme Variants"],
        deliverables: "Published Team UI Library"
      },
      {
        month: 5,
        topicsBn: ["অ্যাডভান্সড মাইক্রো-ইন্টারঅ্যাকশন", "প্রোটোটাইপিং ও অ্যানিমেশন", "ইউজাবিলিটি টেস্টিং"],
        topicsEn: ["Advanced Micro-Interactions", "Prototyping & Animations", "Usability Testing"],
        assignmentsBn: ["অ্যানিমেটেড লগইন ফ্লো", "ইউজার টেস্ট রিপোর্ট"],
        assignmentsEn: ["Animated Login Flow", "User Test Report"],
        deliverables: "Clickable Micro-interaction Prototype"
      },
      {
        month: 6,
        topicsBn: ["ডিজাইন হ্যান্ডঅফ", "EquiSaaS প্রোডাক্ট রিলিজ", "পোর্টফোলিও কেস স্টাডি"],
        topicsEn: ["Design Handoff", "EquiSaaS Product Release", "Portfolio Case Study"],
        assignmentsBn: ["ডেভ টিমের সাথে হ্যান্ডঅফ রিভিউ", "সম্পূর্ণ কেস স্টাডি প্রকাশনা"],
        assignmentsEn: ["Handoff review with Dev Team", "Publish complete Case Study"],
        deliverables: "Figma Handoff Assets + Case Study"
      }
    ],
    graphic: [
      {
        month: 1,
        topicsBn: ["ব্র্যান্ড বেসিকস", "কালার, টাইপোগ্রাফি ও গ্রিড", "লোগো ও ব্র্যান্ড গাইড"],
        topicsEn: ["Brand Basics", "Color, Typography and Grids", "Logo and Brand Guide"],
        assignmentsBn: ["ব্র্যান্ড কিট সেটআপ", "বেসিক ব্র্যান্ড শিট তৈরি"],
        assignmentsEn: ["Set up brand kit", "Create basic brand sheet"],
        deliverables: "Brand Starter Kit"
      },
      {
        month: 2,
        topicsBn: ["সোশ্যাল টেমপ্লেট সিস্টেম", "মাল্টি-ফরম্যাট এক্সপোর্ট", "CTA হায়ারার্কি"],
        topicsEn: ["Social Template System", "Multi-format Export", "CTA Hierarchy"],
        assignmentsBn: ["৩টি সোশ্যাল টেমপ্লেট তৈরি", "পোস্ট, স্টোরি, রিল সাইজ এক্সপোর্ট"],
        assignmentsEn: ["Create 3 social templates", "Export post, story, reel sizes"],
        deliverables: "Social Template Pack"
      },
      {
        month: 3,
        topicsBn: ["মোশন ও শর্ট ভিডিও", "স্টোরিবোর্ডিং", "ভিডিও অ্যাসেট পাইপলাইন"],
        topicsEn: ["Motion and Short Video", "Storyboarding", "Video Asset Pipeline"],
        assignmentsBn: ["১৫-সেকেন্ড মোশন পোস্ট", "ক্যাম্পেইন স্টোরিবোর্ড"],
        assignmentsEn: ["Create a 15-second motion post", "Prepare campaign storyboard"],
        deliverables: "Motion Content Bundle"
      },
      {
        month: 4,
        topicsBn: ["ক্রিয়েটিভ A/B টেস্টিং", "হুক ও CTA টেস্টিং", "পারফরম্যান্স রিভিউ"],
        topicsEn: ["Creative A/B Testing", "Hook and CTA Testing", "Performance Review"],
        assignmentsBn: ["একই পোস্টের ২টি ক্রিয়েটিভ তৈরি", "CTR তুলনা রিপোর্ট"],
        assignmentsEn: ["Create 2 variations of same post", "Prepare CTR comparison report"],
        deliverables: "Creative Experiment Report"
      },
      {
        month: 5,
        topicsBn: ["বাংলা/ইংরেজি লোকালাইজেশন", "ইনক্লুসিভ ভিজ্যুয়াল", "কমিউনিটি অ্যাসেট লাইব্রেরি"],
        topicsEn: ["Bangla/English Localization", "Inclusive Visuals", "Community Asset Library"],
        assignmentsBn: ["বাংলা-ইংরেজি সোশ্যাল ভ্যারিয়েন্ট", "অ্যাসেট ফোল্ডার স্ট্যান্ডার্ডাইজেশন"],
        assignmentsEn: ["Create bilingual social variants", "Standardize asset folders"],
        deliverables: "Localized Creative Library"
      },
      {
        month: 6,
        topicsBn: ["প্রোডাকশন পাইপলাইন", "ভার্সনিং ও নামকরণ", "ক্রস-টিম হ্যান্ডঅফ"],
        topicsEn: ["Production Pipeline", "Versioning and Naming", "Cross-team Handoff"],
        assignmentsBn: ["নামকরণ কনভেনশন ডকুমেন্ট", "মাসিক হ্যান্ডঅফ প্যাক"],
        assignmentsEn: ["Document naming conventions", "Deliver monthly handoff pack"],
        deliverables: "Design Ops Handoff Pack"
      }
    ]
  },
  product: {
    ba: [
      {
        month: 1,
        topicsBn: ["বিজনেস অ্যানালাইসিস ফান্ডামেন্টালস", "স্টেকহোল্ডার ম্যানেজমেন্ট", "এজাইল (Agile) মাইন্ডসেট"],
        topicsEn: ["BA Fundamentals", "Stakeholder Management", "Agile Mindset"],
        assignmentsBn: ["প্রজেক্ট চার্টার তৈরি", "স্টেকহোল্ডার ম্যাপ"],
        assignmentsEn: ["Create Project Charter", "Stakeholder Map"],
        deliverables: "Project Initialization Document"
      },
      {
        month: 2,
        topicsBn: ["রিকোয়ারমেন্ট গ্যাদারিং", "ইউজার স্টোরি ও অ্যাকসেপ্টেন্স ক্রাইটেরিয়া", "স্প্রিন্ট প্ল্যানিং"],
        topicsEn: ["Requirement Gathering", "User Stories & Acceptance Criteria", "Sprint Planning"],
        assignmentsBn: ["LMS ড্যাশবোর্ডের জন্য ২০টি ইউজার স্টোরি লেখা", "Jira/Trello সেটআপ"],
        assignmentsEn: ["Write 20 user stories for LMS Dashboard", "Jira/Trello Setup"],
        deliverables: "Prioritized Product Backlog"
      },
      {
        month: 3,
        topicsBn: ["প্রোজেক্ট রোডম্যাপ ও OKR", "MVP স্কোপিং", "ডেটা ড্রিভেন ডিসিশন"],
        topicsEn: ["Project Roadmap & OKRs", "MVP Scoping", "Data-Driven Decisions"],
        assignmentsBn: ["আগামী ৬ মাসের প্রোডাক্ট রোডম্যাপ", "কোয়ার্টার ১-এর OKR"],
        assignmentsEn: ["Product Roadmap for next 6 months", "Q1 OKRs"],
        deliverables: "Team OKR Board"
      },
      {
        month: 4,
        topicsBn: ["প্রসেস ম্যাপিং", "SWOT অ্যানালাইসিস", "রিলিজ প্ল্যানিং"],
        topicsEn: ["Process Mapping", "SWOT Analysis", "Release Planning"],
        assignmentsBn: ["লগইন ও এনরোলমেন্ট ফ্লো ম্যাপিং", "LMS কম্পিটিটর SWOT"],
        assignmentsEn: ["Login & Enrollment Flow Mapping", "LMS Competitor SWOT"],
        deliverables: "BPMN Diagram & Release Notes"
      },
      {
        month: 5,
        topicsBn: ["KPI ট্র্যাকিং", "ইউজার অ্যানালিটিক্স (Mixpanel/Google Analytics)", "এবি (A/B) টেস্টিং"],
        topicsEn: ["KPI Tracking", "User Analytics", "A/B Testing"],
        assignmentsBn: ["কনভার্শন ফানেল ডিজাইন", "অ্যাক্টিভ ইউজার ট্র্যাকিং"],
        assignmentsEn: ["Conversion Funnel Design", "Active User Tracking"],
        deliverables: "KPI Dashboard Schema"
      },
      {
        month: 6,
        topicsBn: ["প্রোডাক্ট স্ট্র্যাটেজি পিচ", "EquiSaaS লাইভ রিলিজ", "পোস্ট-লঞ্চ রিভিউ"],
        topicsEn: ["Product Strategy Pitch", "EquiSaaS Live Release", "Post-Launch Review"],
        assignmentsBn: ["টিমের কাছে রিলিজ ডেমো", "রেট্রোস্পেক্টিভ মিটিং"],
        assignmentsEn: ["Release Demo to Team", "Retrospective Meeting"],
        deliverables: "V1 Delivery Sign-off"
      }
    ],
    pm: [
      {
        month: 1,
        topicsBn: ["ভিশন ও ডিসকভারি", "মার্কেট গ্যাপ বিশ্লেষণ", "ভ্যালু প্রপ ডিফাইন"],
        topicsEn: ["Vision & Discovery", "Market Gap Analysis", "Value Proposition Definition"],
        assignmentsBn: ["এক পাতার প্রোডাক্ট ভিশন", "টপ ৫ সমস্যা তালিকা"],
        assignmentsEn: ["Write one-page product vision", "List top 5 user problems"],
        deliverables: "Product Vision Brief"
      },
      {
        month: 2,
        topicsBn: ["রোডম্যাপ ও OKR", "প্রায়োরিটাইজেশন ফ্রেমওয়ার্ক", "ডিপেন্ডেন্সি ম্যাপিং"],
        topicsEn: ["Roadmap & OKR", "Prioritization Frameworks", "Dependency Mapping"],
        assignmentsBn: ["Q1 রোডম্যাপ তৈরি", "ফিচার প্রায়োরিটি স্কোরবোর্ড"],
        assignmentsEn: ["Create Q1 roadmap", "Build feature prioritization scorecard"],
        deliverables: "Roadmap + OKR Board"
      },
      {
        month: 3,
        topicsBn: ["এক্সপেরিমেন্ট ডিজাইন", "ফানেল মেট্রিকস", "ইনস্ট্রুমেন্টেশন প্ল্যান"],
        topicsEn: ["Experiment Design", "Funnel Metrics", "Instrumentation Plan"],
        assignmentsBn: ["৩টি হাইপোথিসিস টেস্ট প্ল্যান", "সাপ্তাহিক মেট্রিক্স ড্যাশবোর্ড"],
        assignmentsEn: ["Create 3 hypothesis test plans", "Build weekly metrics dashboard"],
        deliverables: "Experiment Tracker"
      },
      {
        month: 4,
        topicsBn: ["প্রাইসিং ও প্যাকেজিং", "রিটেনশন লুপ", "মনিটাইজেশন স্ট্র্যাটেজি"],
        topicsEn: ["Pricing & Packaging", "Retention Loops", "Monetization Strategy"],
        assignmentsBn: ["৩-টিয়ার প্যাকেজ ড্রাফট", "রিটেনশন প্লে ডকুমেন্ট"],
        assignmentsEn: ["Draft 3-tier pricing package", "Document retention play"],
        deliverables: "Go-to-Market Pack"
      },
      {
        month: 5,
        topicsBn: ["লঞ্চ এক্সিকিউশন", "স্টেকহোল্ডার এলাইনমেন্ট", "রিস্ক রেজিস্টার"],
        topicsEn: ["Launch Execution", "Stakeholder Alignment", "Risk Register"],
        assignmentsBn: ["লঞ্চ চেকলিস্ট সম্পন্ন", "রিস্ক মিটিগেশন টেবিল"],
        assignmentsEn: ["Complete launch checklist", "Prepare risk mitigation table"],
        deliverables: "Release Command Center Sheet"
      },
      {
        month: 6,
        topicsBn: ["প্রোডাক্ট গভর্ন্যান্স", "ট্রান্সপারেন্সি রিচুয়াল", "প্রফিট-শেয়ার ন্যারেটিভ"],
        topicsEn: ["Product Governance", "Transparency Rituals", "Profit-share Narrative"],
        assignmentsBn: ["মাসিক প্রোডাক্ট কাউন্সিল নোট", "পোস্ট-লঞ্চ শিক্ষা সারাংশ"],
        assignmentsEn: ["Publish monthly product council notes", "Publish post-launch learnings"],
        deliverables: "Governance and Learning Report"
      }
    ]
  },
  marketing: {
    growth: [
      {
        month: 1,
        topicsBn: ["ডিজিটাল মার্কেটিং বেসিকস", "SEO ফান্ডামেন্টালস", "অডিয়েন্স রিসার্চ"],
        topicsEn: ["Digital Marketing Basics", "SEO Fundamentals", "Audience Research"],
        assignmentsBn: ["EquiSaaS-এর জন্য কিওয়ার্ড রিসার্চ (২০টি)", "ব্র্যান্ড ভয়েস গাইডলাইন"],
        assignmentsEn: ["Keyword Research for EquiSaaS", "Brand Voice Guideline"],
        deliverables: "SEO & Keyword Spreadsheet"
      },
      {
        month: 2,
        topicsBn: ["কন্টেন্ট মার্কেটিং স্ট্র্যাটেজি", "সোশ্যাল মিডিয়া ক্যালেন্ডার", "কপিরাইটিং"],
        topicsEn: ["Content Marketing Strategy", "Social Media Calendar", "Copywriting"],
        assignmentsBn: ["এক মাসের কন্টেন্ট ক্যালেন্ডার ডিজাইন", "ফেসবুক/লিঙ্কডইন পোস্ট লেখা"],
        assignmentsEn: ["1-Month Content Calendar", "Draft Facebook/LinkedIn Posts"],
        deliverables: "Social Asset Management Board"
      },
      {
        month: 3,
        topicsBn: ["অন-পেইজ ও অফ-পেইজ SEO", "ল্যান্ডিং পেজ অপ্টিমাইজেশন", "লিড জেনারেশন"],
        topicsEn: ["On-Page & Off-Page SEO", "Landing Page Optimization", "Lead Generation"],
        assignmentsBn: ["১০০ ইউজার সাইন-আপ ড্রাইভ করা", "ল্যান্ডিং পেজ অডিট কনভার্সন রেট"],
        assignmentsEn: ["Drive 100 User Signups", "Landing Page Audit (CR)"],
        deliverables: "SEO Audit Report"
      },
      {
        month: 4,
        topicsBn: ["পেইড সোশ্যাল (Meta/LinkedIn Ads)", "ক্যাম্পেইন সেটআপ", "ডাটা ড্রিভেন মার্কেটিং"],
        topicsEn: ["Paid Social (Meta/LinkedIn Ads)", "Campaign Setup", "Data-Driven Marketing"],
        assignmentsBn: ["$10 বাজেট ক্যাম্পেইন (মক)", "অডিয়েন্স পিক্সেল সেটআপ"],
        assignmentsEn: ["$10 Budget Campaign (Mock)", "Audience Pixel Setup"],
        deliverables: "Ad Campaign Dashboard"
      },
      {
        month: 5,
        topicsBn: ["CRM অটোমেশন", "ইমেইল মার্কেটিং (Mailchimp/Sendgrid)", "কাস্টমার সাকসেস ফ্লো"],
        topicsEn: ["CRM Automation", "Email Marketing", "Customer Success Flow"],
        assignmentsBn: ["ওয়েলকাম ইমেইল সিরিজ", "গ্রাহকদের জন্য সাপোর্ট প্লেবুক"],
        assignmentsEn: ["Welcome Email Series", "Support Playbook for End Users"],
        deliverables: "Email Sequence Automation"
      },
      {
        month: 6,
        topicsBn: ["গ্রোথ হ্যাকিং", "ক্যাম্পেইন অ্যানালিটিক্স", "EquiSaaS লঞ্চ প্রমোশন"],
        topicsEn: ["Growth Hacking", "Campaign Analytics", "EquiSaaS Launch Promotion"],
        assignmentsBn: ["লঞ্চ ডে মার্কেটিং প্ল্যান", "ROI ও কস্ট অ্যানালাইসিস"],
        assignmentsEn: ["Launch Day Marketing Plan", "ROI & Cost Analysis"],
        deliverables: "Launch Marketing Suite"
      }
    ],
    success: [
      {
        month: 1,
        topicsBn: ["অনবোর্ডিং বেসিকস", "টাইম-টু-ভ্যালু মেট্রিকস", "কাস্টমার সেগমেন্টেশন"],
        topicsEn: ["Onboarding Basics", "Time-to-Value Metrics", "Customer Segmentation"],
        assignmentsBn: ["নতুন ইউজারের অনবোর্ডিং ফ্লো তৈরি", "৩টি ইউজার সেগমেন্ট ডিফাইন"],
        assignmentsEn: ["Create onboarding flow for new users", "Define 3 user segments"],
        deliverables: "Onboarding Playbook v1"
      },
      {
        month: 2,
        topicsBn: ["সাপোর্ট অপারেশন", "নলেজ বেস স্ট্রাকচার", "SLA ডিজাইন"],
        topicsEn: ["Support Operations", "Knowledge Base Structure", "SLA Design"],
        assignmentsBn: ["FAQ নলেজ বেস তৈরি", "রেসপন্স টাইম SLA টেবিল তৈরি"],
        assignmentsEn: ["Create FAQ knowledge base", "Define response time SLA table"],
        deliverables: "Support Operations Handbook"
      },
      {
        month: 3,
        topicsBn: ["ভয়েস অফ কাস্টমার", "ফিডব্যাক ট্যাগিং", "ইনসাইট রিপোর্টিং"],
        topicsEn: ["Voice of Customer", "Feedback Tagging", "Insight Reporting"],
        assignmentsBn: ["১০টি ফিডব্যাক ট্যাগ ক্যাটাগরি তৈরি", "মাসিক ইনসাইট রিপোর্ট প্রকাশ"],
        assignmentsEn: ["Create 10 feedback tag categories", "Publish monthly insight report"],
        deliverables: "Customer Insight Board"
      },
      {
        month: 4,
        topicsBn: ["রিটেনশন স্ট্র্যাটেজি", "রিনিউয়াল প্লেবুক", "এসকেলেশন ফ্লো"],
        topicsEn: ["Retention Strategy", "Renewal Playbook", "Escalation Flow"],
        assignmentsBn: ["চর্ণ রিস্ক তালিকা তৈরি", "এসকেলেশন ফ্লো চার্ট বানানো"],
        assignmentsEn: ["Build churn-risk list", "Create escalation flow chart"],
        deliverables: "Retention Operations Pack"
      },
      {
        month: 5,
        topicsBn: ["কমিউনিটি সাকসেস", "মেন্টরশিপ প্রোগ্রাম", "পিয়ার-টু-পিয়ার সাপোর্ট"],
        topicsEn: ["Community Success", "Mentorship Program", "Peer-to-Peer Support"],
        assignmentsBn: ["কমিউনিটি হেল্প সেশন চালু করা", "মেন্টর-মেন্টি ম্যাচিং শীট তৈরি"],
        assignmentsEn: ["Launch community help sessions", "Create mentor-mentee matching sheet"],
        deliverables: "Community Success Calendar"
      },
      {
        month: 6,
        topicsBn: ["KPI রিপোর্টিং", "NPS/CSAT ট্র্যাকিং", "QBR রিভিউ"],
        topicsEn: ["KPI Reporting", "NPS/CSAT Tracking", "QBR Review"],
        assignmentsBn: ["QBR স্লাইড ডেক প্রস্তুত", "কাস্টমার স্যাটিসফ্যাকশন রিপোর্ট"],
        assignmentsEn: ["Prepare QBR slide deck", "Publish customer satisfaction report"],
        deliverables: "Customer Success KPI Suite"
      }
    ]
  }
};
