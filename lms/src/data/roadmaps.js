export const ROADMAPS = {
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
        topicsBn: ["মাল্টি-টেন্যান্সি (SAAS)", "অ্যাডভান্সড কোয়েরি", "ক্যাশিং (Redis)"],
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
        assignmentsBn: ["Docker ব্যবহার করে ডিপ্লয়মেন্ট", "LMS API ப்ரൊডাকশনে লাইভ করা"],
        assignmentsEn: ["Docker based deployment", "Push LMS API to Production"],
        deliverables: "Fully Shipped Backend Architecture"
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
        topicsBn: ["ওয়্যারফ্রেমিং", "লোজার ইন্ট্রোডাকশন (Figma)", "ল অ্যান্ড থিওরি অব UX"],
        topicsEn: ["Wireframing", "Figma Fundamentals", "Law & Theory of UX"],
        assignmentsBn: ["ড্যাশবোর্ডের লো-ফিডেলিটি ওয়্যারফ্রেম", "হিউরিস্টিক ইভাল্যুশন"],
        assignmentsEn: ["Dashboard Low-fidelity Wireframes", "Heuristic Evaluation"],
        deliverables: "Interactive Wireframes"
      },
      {
        month: 3,
        topicsBn: ["হাই-ফিডেলিটি UI ডিজাইন", "কালার ও টাইপোগ্রাফি সিস্টেম", "রেসপনসিভ লেআউট"],
        topicsEn: ["High-Fidelity UI Design", "Color & Typography Systems", "Responsive Layouts"],
        assignmentsBn: ["মোবাইল ও ওয়েব ড্যাশবোর্ড ডিজাইন", "সাস কিলার কালার প্যালেট"],
        assignmentsEn: ["Mobile & Web Dashboard Design", "SaaS Color Palette"],
        deliverables: "Hi-Fi SaaS Dashboard Screens"
      },
      {
        month: 4,
        topicsBn: ["ডিজাইন সিস্টেম ও কম্পোনেন্ট লাইব্রেরি", "অটো লেআউট ২.০", "অ্যাসেসিবিলিটি (AA)"],
        topicsEn: ["Design Systems & Component Library", "Auto Layout 2.0", "Accessibility (AA)"],
        assignmentsBn: ["EquiSaaS বাটন ও ইনপুট লাইব্রেরি", "অন্ধকার/লাইট থিম ভ্যারিয়েন্ট"],
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
        deliverables: "Zeplin/Figma Handoff Assets + Case Study"
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
        topicsBn: ["রিকোয়ারমেন্ট গ্যাদারিং", "ইউজার স্টোরিজ ও এক্সেপ্টেন্স ক্রাইটেরিয়া", "স্প্রিন্ট প্ল্যানিং"],
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
        topicsBn: ["প্রোডাক্ট স্ট্র্যাটেজি পিজ (Pitch)", "EquiSaaS লাইভ রিলিজ", "পোস্ট-লঞ্চ রিভিউ"],
        topicsEn: ["Product Strategy Pitch", "EquiSaaS Live Release", "Post-Launch Review"],
        assignmentsBn: ["টিমের কাছে রিলিজ ডেমো", "রেট্রোস্পেক্টিভ (Retrospective) মিটিং"],
        assignmentsEn: ["Release Demo to Team", "Retrospective Meeting"],
        deliverables: "V1 Delivery Sign-off"
      }
    ]
  },
  marketing: {
    growth: [
      {
        month: 1,
        topicsBn: ["ডিজিটাল মার্কেটিং কোরস", "SEO ফান্ডামেন্টালস", "অডিয়েন্স রিসার্চ"],
        topicsEn: ["Digital Marketing Cores", "SEO Fundamentals", "Audience Research"],
        assignmentsBn: ["EquiSaaS-এর জন্য কিওয়ার্ড রিসার্চ (২০টি)", "ব্র্যান্ড ভয়েস গাইডলাইন"],
        assignmentsEn: ["Keyword Research for EquiSaaS", "Brand Voice Guideline"],
        deliverables: "SEO & Keyword Spreadsheet"
      },
      {
        month: 2,
        topicsBn: ["কন্টেন্ট মার্কেটিং স্ট্র্যাটেজি", "সোশ্যাল মিডিয়া ক্যালেন্ডার", "কপিরাইটিং (Copywriting)"],
        topicsEn: ["Content Marketing Strategy", "Social Media Calendar", "Copywriting"],
        assignmentsBn: ["এক মাসের কন্টেন্ট ক্যালেন্ডার ডিজাইন", "ফেসবুক/লিঙ্কডইন পোস্ট লেখা"],
        assignmentsEn: ["1-Month Content Calendar", "Draft Facebook/LinkedIn Posts"],
        deliverables: "Social Asset Management Board"
      },
      {
        month: 3,
        topicsBn: ["অন-পেইজ ও অফ-পেইজ SEO", "ল্যান্ডিং পেজ অপ্টিমাইজেশন", "লিড জেনারেশন (Lead Gen)"],
        topicsEn: ["On-Page & Off-Page SEO", "Landing Page Optimization", "Lead Generation"],
        assignmentsBn: ["১০০ ইউজার সাইন-আপ ড্রাইভ করা", "ল্যান্ডিং পেজ অডিট কনভার্সন রেট"],
        assignmentsEn: ["Drive 100 User Signups", "Landing Page Audit (CR)"],
        deliverables: "SEO Audit Report"
      },
      {
        month: 4,
        topicsBn: ["পেইড সোশ্যাল (Facebook/LinkedIn Ads)", "ক্যাম্পেইন সেটআপ", "ডাটা ড্রিভেন মার্কেটিং"],
        topicsEn: ["Paid Social (Meta/LinkedIn Ads)", "Campaign Setup", "Data-Driven Marketing"],
        assignmentsBn: ["$১০ বাজেট ক্যাম্পেইন (মক)", "অডিয়েন্স পিক্সেল সেটআপ"],
        assignmentsEn: ["$10 Budget Campaign (Mock)", "Audience Pixel Setup"],
        deliverables: "Ad Campaign Dashboard"
      },
      {
        month: 5,
        topicsBn: ["CRM অটোমেশন", "ইমেইল মার্কেটিং (Mailchimp/Sendgrid)", "কাস্টমার সাকসেস (CS) ফ্লো"],
        topicsEn: ["CRM Automation", "Email Marketing", "Customer Success (CS) Flow"],
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
    ]
  }
};
