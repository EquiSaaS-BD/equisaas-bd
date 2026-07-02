export const DEPARTMENTS = [
  {
    id: "engineering",
    titleBn: "সফটওয়্যার ইঞ্জিনিয়ারিং",
    titleEn: "Software Engineering",
    descBn: "ফ্রন্টএন্ড, ব্যাকএন্ড এবং DevOps স্কিল একসাথে শিখুন।",
    descEn: "Learn frontend, backend, and DevOps skills end to end.",
    subdepartments: [
      {
        id: "frontend",
        titleBn: "ফ্রন্টএন্ড (React/Next.js)",
        titleEn: "Frontend (React/Next.js)",
        descBn: "ইন্টারফেস, স্টেট ম্যানেজমেন্ট, পারফরম্যান্স।",
        descEn: "Interfaces, state management, performance.",
        techStackDescEn: "Master the standard frontend tools to build premium, scalable enterprise applications.",
        techStackDescBn: "প্রিমিয়াম এবং স্কেলেবল এন্টারপ্রাইজ অ্যাপ্লিকেশন তৈরির জন্য স্ট্যান্ডার্ড ফ্রন্টএন্ড টুলসগুলো আয়ত্ত করুন।",
        skills: ["React.js", "Next.js", "JavaScript (ES6+)", "TypeScript", "HTML5", "CSS3", "Tailwind CSS", "Material UI", "State Management (Redux Toolkit, Zustand, Context API)", "Webpack", "Vite", "Server Side Rendering (SSR)", "Static Site Generation (SSG)", "Responsive Web Design", "Progressive Web Apps (PWA)", "REST API Integration", "GraphQL Apollo", "WebSockets", "Component Driven Development", "Storybook", "Frontend Testing (Jest, Cypress)", "Figma to Code Translation", "Web Performance Optimization", "Accessibility (a11y) Standards", "Cross Browser Compatibility", "Version Control (Git)"]
      },
      {
        id: "backend",
        titleBn: "ব্যাকএন্ড (Laravel/Node.js)",
        titleEn: "Backend (Laravel/Node.js)",
        descBn: "API, সিকিউরিটি, ডাটা মডেলিং।",
        descEn: "APIs, security, data modeling.",
        techStackDescEn: "Learn to build high-performance, secure, and multi-tenant SaaS backend systems.",
        techStackDescBn: "হাই-পারফরম্যান্স, সিকিউর এবং মাল্টি-টেন্যান্ট SaaS ব্যাকএন্ড সিস্টেম তৈরি করা শিখুন।",
        skills: ["Node.js", "Express.js", "NestJS", "Python", "Django", "Go", "RESTful API Architecture", "GraphQL", "Microservices", "Serverless Architecture", "Relational Databases (PostgreSQL, MySQL)", "NoSQL Databases (MongoDB, Redis)", "Object Relational Mapping (Prisma, TypeORM)", "Authentication & Authorization (JWT, OAuth2, SSO)", "Role Based Access Control (RBAC)", "API Gateway Management", "Rate Limiting", "Message Queues (RabbitMQ, Kafka)", "Webhooks", "Data Encryption & Security", "System Design", "Scalability Planning", "Backend Testing (Mocha, Chai)"]
      },
      {
        id: "devops",
        titleBn: "DevOps & QA",
        titleEn: "DevOps & QA",
        descBn: "CI/CD, টেস্টিং এবং অবজারভেবিলিটি।",
        descEn: "CI/CD, testing, and observability.",
        techStackDescEn: "Master automation, cloud scaling, and reliability for enterprise software infrastructure.",
        techStackDescBn: "এন্টারপ্রাইজ সফটওয়্যার ইনফ্রাস্ট্রাকচারের জন্য অটোমেশন, ক্লাউড স্কেলিং এবং রিলায়েবিলিটি আয়ত্ত করুন।",
        skills: ["Continuous Integration (CI)", "Continuous Deployment (CD)", "GitHub Actions", "GitLab CI", "Docker Containerization", "Kubernetes Orchestration", "Cloud Infrastructure (AWS, Google Cloud, Azure)", "Terraform", "Infrastructure as Code (IaC)", "Linux Server Administration", "Nginx", "Bash Scripting", "Monitoring & Logging (Prometheus, Grafana, ELK Stack)", "Incident Response", "Automated Testing (Selenium, Appium)", "API Testing (Postman, Swagger)", "Load Testing (JMeter)", "Penetration Testing", "Zero Downtime Deployment", "Defect Tracking"]
      }
    ]
  },
  {
    id: "design",
    titleBn: "UI/UX ও ডিজাইন",
    titleEn: "UI/UX & Design",
    descBn: "রিসার্চ থেকে হাই-ফাই UI পর্যন্ত সম্পূর্ণ ডিজাইন ফ্লো।",
    descEn: "From research to high-fidelity UI delivery.",
    subdepartments: [
      {
        id: "ux",
        titleBn: "UI/UX (Figma)",
        titleEn: "UI/UX (Figma)",
        descBn: "ইউজার রিসার্চ, ফ্লো, প্রোটোটাইপ।",
        descEn: "User research, flows, prototypes.",
        techStackDescEn: "Deep dive into user behavior and design systems to create world-class product experiences.",
        techStackDescBn: "ওয়ার্ল্ড-ক্লাস প্রোডাক্ট এক্সপেরিয়েন্স তৈরির জন্য ইউজার রিসার্চ এবং ডিজাইন সিস্টেম নিয়ে কাজ করুন।",
        skills: ["User Research", "Competitor Analysis", "Information Architecture (IA)", "User Journey Mapping", "Wireframing", "Low Fidelity Prototyping", "High Fidelity Prototyping", "Figma", "Adobe XD", "Interaction Design", "Microinteractions", "Usability Testing", "A/B Testing for UI", "Design Systems Creation", "Typography", "Color Theory", "Layout Grid Systems", "Mobile First Design", "Accessibility Design", "Empathy Mapping", "User Personas", "Heuristic Evaluation"]
      },
      {
        id: "graphic",
        titleBn: "গ্রাফিক ও সোশ্যাল ডিজাইন",
        titleEn: "Graphic & Social Design",
        descBn: "ব্র্যান্ড ভিজ্যুয়াল, সোশ্যাল কন্টেন্ট।",
        descEn: "Brand visuals and social content.",
        techStackDescEn: "Forge strong brand identities and marketing creative systems for the global market.",
        techStackDescBn: "গ্লোবাল মার্কেটের জন্য শক্তিশালী ব্র্যান্ড আইডেন্টিটি এবং মার্কেটিং ক্রিয়েটিভ সিস্টেম তৈরি করুন।",
        skills: ["Brand Identity System", "Logo Creation", "Typography Selection", "Color Palette Development", "Vector Illustration", "Adobe Illustrator", "Adobe Photoshop", "Image Retouching", "Social Media Creatives", "Banner Design", "Print Design", "Presentation Deck Design (Pitch Decks)", "Infographics", "Visual Storytelling", "Motion Graphics Basics", "Adobe After Effects", "Iconography", "Composition Rules", "Brand Guidelines Creation", "Digital Asset Management"]
      }
    ]
  },
  {
    id: "product",
    titleBn: "প্রোডাক্ট ও বিজনেস অ্যানালাইসিস",
    titleEn: "Product & Business Analysis",
    descBn: "ডিসকভারি, রোডম্যাপ, KPI।",
    descEn: "Discovery, roadmaps, KPIs.",
    subdepartments: [
      {
        id: "ba",
        titleBn: "বিজনেস অ্যানালাইসিস",
        titleEn: "Business Analysis",
        descBn: "রিকোয়ারমেন্ট, প্রসেস, স্টেকহোল্ডার।",
        descEn: "Requirements, process, stakeholder mgmt.",
        techStackDescEn: "Bridge business goals and technical specs with professional requirement engineering.",
        techStackDescBn: "প্রফেশনাল রিকোয়ারমেন্ট ইঞ্জিনিয়ারিংয়ের মাধ্যমে বিজনেস গোল এবং টেকনিক্যাল স্পেসিফিকেশনের মধ্যে সমন্বয় করুন।",
        skills: ["Requirements Gathering", "Business Requirement Document (BRD)", "Software Requirement Specification (SRS)", "Gap Analysis", "SWOT Analysis", "Process Flow Modeling", "UML Diagrams", "Data Modeling", "Stakeholder Interviews", "Cost Benefit Analysis", "Feasibility Studies", "Agile Story Writing", "Acceptance Criteria Definition", "Market Trend Analysis", "Competitor Benchmarking", "Risk Assessment", "Use Case Development", "Wireframe Annotation", "User Acceptance Testing (UAT) Coordination"]
      },
      {
        id: "pm",
        titleBn: "প্রোডাক্ট ম্যানেজমেন্ট",
        titleEn: "Product Management",
        descBn: "স্ট্র্যাটেজি, প্রায়োরিটি, ডেলিভারি।",
        descEn: "Strategy, prioritization, delivery.",
        techStackDescEn: "Master the full product lifecycle from strategy and roadmapping to growth.",
        techStackDescBn: "স্ট্র্যাটেজি এবং রোডম্যাপ থেকে শুরু করে গ্রোথ পর্যন্ত পূর্ণ প্রোডাক্ট লাইফসাইকেল আয়ত্ত করুন।",
        skills: ["Product Vision Strategy", "Product Roadmapping", "Agile Frameworks (Scrum, Kanban)", "Sprint Planning", "Backlog Grooming", "User Story Mapping", "Epic Creation", "Jobs To Be Done (JTBD) Framework", "Market Research", "Minimum Viable Product (MVP) Definition", "Prioritization Techniques (MoSCoW, RICE)", "Stakeholder Management", "Go To Market (GTM) Strategy", "Product Analytics (Mixpanel, Amplitude)", "KPI Tracking", "OKR Setting", "Feature Lifecycle Management", "Cross Functional Team Leadership", "Customer Feedback Loops"]
      }
    ]
  },
  {
    id: "marketing",
    titleBn: "মার্কেটিং ও কাস্টমার সাকসেস",
    titleEn: "Marketing & Customer Success",
    descBn: "গ্রোথ, CRM, সাপোর্ট অপারেশন।",
    descEn: "Growth, CRM, and support ops.",
    subdepartments: [
      {
        id: "growth",
        titleBn: "ডিজিটাল মার্কেটিং",
        titleEn: "Digital Marketing",
        descBn: "SEO, কন্টেন্ট, পেইড ক্যাম্পেইন।",
        descEn: "SEO, content, paid campaigns.",
        techStackDescEn: "Scale SaaS products using data-driven SEO, ads, and conversion optimization.",
        techStackDescBn: "ডেটা-ড্রিভেন এসইও, অ্যাড এবং কনভার্সন অপটিমাইজেশনের মাধ্যমে SaaS প্রোডাক্ট স্কেল করুন।",
        skills: ["Facebook Ads", "Google Ads", "YouTube Campaign", "Search Engine Optimization (SEO)", "Search Engine Marketing (SEM)", "Social Media Marketing", "Content Marketing", "Email Marketing", "Marketing Automation", "Lead Generation", "Retargeting", "Remarketing", "Funnel Building", "Landing Page Optimization", "Copywriting", "Brand Communication", "Audience Segmentation", "Pixel & Conversion Tracking", "GA4", "Google Tag Manager", "CRM Integration", "Sales Journey Mapping", "A/B Testing", "Analytics Dashboarding", "ROAS Optimization", "CAC Control", "LTV Growth", "Overall Digital Growth Architecture"]
      },
      {
        id: "success",
        titleBn: "CRM ও কাস্টমার সাকসেস",
        titleEn: "CRM & Customer Success",
        descBn: "অনবোর্ডিং, সাপোর্ট প্লেবুক।",
        descEn: "Onboarding and support playbooks.",
        techStackDescEn: "Master user onboarding, retention strategies, and empathy-led growth.",
        techStackDescBn: "ইউজার অনবোর্ডিং, রিটেনশন স্ট্র্যাটেজি এবং সহানুভূতি-চালিত গ্রোথ আয়ত্ত করুন।",
        skills: ["Customer Onboarding", "Churn Prevention", "Net Promoter Score (NPS) Tracking", "Customer Satisfaction (CSAT)", "Customer Lifetime Value (CLV) Optimization", "Helpdesk Management", "Ticketing Systems (Zendesk, Intercom)", "Account Management", "Product Adoption Tracking", "Customer Retention Strategies", "Feedback Collection", "Knowledge Base Creation", "User Training Sessions", "Escalation Management", "Cross Selling & Upselling", "Customer Empathy", "Subscription Management", "Dispute Resolution", "SLA Monitoring"]
      }
    ]
  }
];

export const PATHS = [
  {
    id: "se-frontend", deptId: "engineering", subdeptId: "frontend",
    titleBn: "ফ্রন্ট-এন্ড ইঞ্জিনিয়ার মাস্টারক্লাস (React/Next.js)", titleEn: "Frontend Engineer Masterclass (React/Next.js)",
    descBn: "৬ মাসে React, Next.js, TypeScript, পারফরম্যান্স ও প্রোডাকশন রেডি স্কিল।",
    descEn: "6-month program: React, Next.js, TypeScript, performance & production-grade skills.",
    level: "Beginner", lang: "EN+BN", duration: "6 months",
    prereqBn: "বেসিক HTML, CSS, JavaScript জানলে ভালো।", prereqEn: "Basic HTML, CSS, JavaScript recommended.",
    outcomesBn: ["প্রোডাকশন-রেডি React অ্যাপ", "Web Vitals অপটিমাইজড", "টেস্টিং ও CI পাইপলাইন"],
    outcomesEn: ["Production-ready React apps", "Web Vitals optimized", "Testing & CI pipeline"],
    modules: [
      {
        id: "fe-m1", titleBn: "মাস ১: ফাউন্ডেশন ও ফ্রেমওয়ার্ক", titleEn: "Month 1: Foundation & Framework",
        summaryBn: "React, TypeScript, Next.js App Router ও Git।", summaryEn: "React, TypeScript, Next.js App Router & Git.", duration: "4w",
        lessons: [
          { id: "fe-1-1", titleBn: "React ও TypeScript ফাউন্ডেশন", titleEn: "React & TypeScript Foundation", duration: "3h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "fe-1-2", titleBn: "Next.js App Router ও রাউটিং", titleEn: "Next.js App Router & Routing", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "fe-1-3", titleBn: "Git/GitHub ও কোড কনভেনশন", titleEn: "Git/GitHub & Code Conventions", duration: "1h", typeBn: "ভিডিও", typeEn: "Video" }
        ]
      },
      {
        id: "fe-m2", titleBn: "মাস ২: স্টেট আর্কিটেকচার", titleEn: "Month 2: State Architecture",
        summaryBn: "Redux Toolkit, Zustand, TanStack Query ও ফর্ম।", summaryEn: "Redux Toolkit, Zustand, TanStack Query & forms.", duration: "4w",
        lessons: [
          { id: "fe-2-1", titleBn: "Redux Toolkit/Zustand ক্লায়েন্ট স্টেট", titleEn: "Redux Toolkit/Zustand Client State", duration: "3h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "fe-2-2", titleBn: "TanStack Query সার্ভার স্টেট ও ক্যাশিং", titleEn: "TanStack Query Server State & Caching", duration: "2.5h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "fe-2-3", titleBn: "ফর্ম/ভ্যালিডেশন ও ত্রুটি হ্যান্ডলিং", titleEn: "Form Validation & Error Handling", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" }
        ]
      },
      {
        id: "fe-m3", titleBn: "মাস ৩: UI সিস্টেম", titleEn: "Month 3: UI System",
        summaryBn: "Tailwind টোকেন, রেসপনসিভ গ্রিড, কম্পোনেন্ট লাইব্রেরি।", summaryEn: "Tailwind tokens, responsive grid, component library.", duration: "4w",
        lessons: [
          { id: "fe-3-1", titleBn: "Tailwind টোকেন ও ডিজাইন সিস্টেম বেস", titleEn: "Tailwind Tokens & Design System Base", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "fe-3-2", titleBn: "রেসপনসিভ গ্রিড ও লেআউট কম্পোজিশন", titleEn: "Responsive Grid & Layout Composition", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "fe-3-3", titleBn: "কম্পোনেন্ট লাইব্রেরি স্ট্রাকচার", titleEn: "Component Library Structure", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" }
        ]
      },
      {
        id: "fe-m4", titleBn: "মাস ৪: পারফরম্যান্স", titleEn: "Month 4: Performance",
        summaryBn: "Suspense, কোড স্প্লিটিং, Web Vitals বাজেট।", summaryEn: "Suspense, code splitting, Web Vitals budget.", duration: "4w",
        lessons: [
          { id: "fe-4-1", titleBn: "Suspense/স্ট্রিমিং কৌশল", titleEn: "Suspense & Streaming Strategies", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "fe-4-2", titleBn: "কোড স্প্লিটিং ও ইমেজ অপটিমাইজেশন", titleEn: "Code Splitting & Image Optimization", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "fe-4-3", titleBn: "Web Vitals বাজেট ও বান্ডেল টিউনিং", titleEn: "Web Vitals Budget & Bundle Tuning", duration: "2h", typeBn: "ভিডিও", typeEn: "Video" }
        ]
      },
      {
        id: "fe-m5", titleBn: "মাস ৫: কোয়ালিটি ও টেস্টিং", titleEn: "Month 5: Quality & Testing",
        summaryBn: "Jest, Playwright, GitHub Actions CI।", summaryEn: "Jest, Playwright, GitHub Actions CI.", duration: "4w",
        lessons: [
          { id: "fe-5-1", titleBn: "Jest দিয়ে ইউনিট টেস্ট", titleEn: "Unit Testing with Jest", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "fe-5-2", titleBn: "Playwright দিয়ে E2E টেস্ট", titleEn: "E2E Testing with Playwright", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "fe-5-3", titleBn: "GitHub Actions CI পাইপলাইন", titleEn: "GitHub Actions CI Pipeline", duration: "1.5h", typeBn: "ভিডিও", typeEn: "Video" }
        ]
      },
      {
        id: "fe-m6", titleBn: "মাস ৬: প্রোডাকশন রেডি", titleEn: "Month 6: Production Ready",
        summaryBn: "i18n, অ্যাক্সেসিবিলিটি, মনিটরিং।", summaryEn: "i18n, accessibility, monitoring.", duration: "4w",
        lessons: [
          { id: "fe-6-1", titleBn: "বাংলা/ইংরেজি i18n", titleEn: "Bilingual i18n (BN/EN)", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "fe-6-2", titleBn: "অ্যাক্সেসিবিলিটি অডিট", titleEn: "Accessibility Audit", duration: "1.5h", typeBn: "ভিডিও", typeEn: "Video" },
          { id: "fe-6-3", titleBn: "ইভেন্ট ট্র্যাকিং ও মনিটরিং", titleEn: "Event Tracking & Monitoring", duration: "1.5h", typeBn: "ভিডিও", typeEn: "Video" }
        ]
      }
    ]
  },
  {
    id: "se-backend", deptId: "engineering", subdeptId: "backend",
    titleBn: "ব্যাক-এন্ড ইঞ্জিনিয়ার মাস্টারক্লাস (Laravel/Node.js)", titleEn: "Backend Engineer Masterclass (Laravel/Node.js)",
    descBn: "৬ মাসে সিকিউর API, ডাটা মডেলিং, সিকিউরিটি ও মাল্টি-টেন্যান্ট SaaS।",
    descEn: "6-month: secure APIs, data modeling, security & multi-tenant SaaS.",
    level: "Intermediate", lang: "EN+BN", duration: "6 months",
    prereqBn: "বেসিক API ও ডাটাবেস ধারণা।", prereqEn: "Basic API and database knowledge.",
    outcomesBn: ["প্রোডাকশন REST API", "মাল্টি-টেন্যান্ট SaaS", "SRE বেসিকস"],
    outcomesEn: ["Production REST APIs", "Multi-tenant SaaS", "SRE basics"],
    modules: [
      { id: "be-m1", titleBn: "মাস ১: API ও কোর কনসেপ্ট", titleEn: "Month 1: API & Core Concepts",
        summaryBn: "Laravel/Node কোর, REST API, সার্ভিস লেয়ার।", summaryEn: "Laravel/Node core, REST API, service layer.", duration: "4w",
        lessons: [
          { id: "be-1-1", titleBn: "Laravel/Node কোর কনসেপ্ট", titleEn: "Laravel/Node Core Concepts", duration: "3h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "be-1-2", titleBn: "REST API ডিজাইন", titleEn: "REST API Design", duration: "2.5h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "be-1-3", titleBn: "সার্ভিস লেয়ার ও মিডলওয়্যার", titleEn: "Service Layer & Middleware", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" }
        ]
      },
      { id: "be-m2", titleBn: "মাস ২: ডাটা মডেলিং", titleEn: "Month 2: Data Modeling",
        summaryBn: "PostgreSQL, মাইগ্রেশন, Eloquent/Prisma।", summaryEn: "PostgreSQL, migrations, Eloquent/Prisma.", duration: "4w",
        lessons: [
          { id: "be-2-1", titleBn: "PostgreSQL ডাটা মডেলিং", titleEn: "PostgreSQL Data Modeling", duration: "3h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "be-2-2", titleBn: "মাইগ্রেশন, ইনডেক্স, কুয়েরি টিউনিং", titleEn: "Migrations, Indexes & Query Tuning", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "be-2-3", titleBn: "Eloquent/Prisma ORM প্যাটার্ন", titleEn: "Eloquent/Prisma ORM Patterns", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" }
        ]
      },
      { id: "be-m3", titleBn: "মাস ৩: সিকিউরিটি", titleEn: "Month 3: Security",
        summaryBn: "Auth, RBAC/ABAC, অডিট লগ।", summaryEn: "Auth, RBAC/ABAC, audit logs.", duration: "4w",
        lessons: [
          { id: "be-3-1", titleBn: "Auth: সেশন বনাম JWT", titleEn: "Auth: Session vs JWT", duration: "2.5h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "be-3-2", titleBn: "RBAC/ABAC ও টেন্যান্ট আইসোলেশন", titleEn: "RBAC/ABAC & Tenant Isolation", duration: "2.5h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "be-3-3", titleBn: "অডিট লগিং ও রেট লিমিট", titleEn: "Audit Logging & Rate Limiting", duration: "2h", typeBn: "ভিডিও", typeEn: "Video" }
        ]
      },
      { id: "be-m4", titleBn: "মাস ৪: রিলায়েবিলিটি", titleEn: "Month 4: Reliability",
        summaryBn: "Queue, ক্যাশিং, ফেইলিওর রিকভারি।", summaryEn: "Queue, caching, failure recovery.", duration: "4w",
        lessons: [
          { id: "be-4-1", titleBn: "Queue/Job ও ব্যাকগ্রাউন্ড ওয়ার্কার", titleEn: "Queue/Job & Background Workers", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "be-4-2", titleBn: "ক্যাশিং ও আইডেম্পোটেন্সি", titleEn: "Caching & Idempotency", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "be-4-3", titleBn: "ফেইলিওর রিকভারি কৌশল", titleEn: "Failure Recovery Strategies", duration: "2h", typeBn: "ভিডিও", typeEn: "Video" }
        ]
      },
      { id: "be-m5", titleBn: "মাস ৫: টেস্টিং ও ডেপ্লয়মেন্ট", titleEn: "Month 5: Testing & Deployment",
        summaryBn: "Laravel টেস্ট, ইন্টেগ্রেশন, Docker CI।", summaryEn: "Laravel tests, integration, Docker CI.", duration: "4w",
        lessons: [
          { id: "be-5-1", titleBn: "Laravel টেস্টিং স্ট্যাক", titleEn: "Laravel Testing Stack", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "be-5-2", titleBn: "ইন্টেগ্রেশন/কন্ট্র্যাক্ট টেস্ট", titleEn: "Integration & Contract Tests", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "be-5-3", titleBn: "ডকারাইজড ডেভ এনভি ও CI", titleEn: "Dockerized Dev Env & CI", duration: "1.5h", typeBn: "ভিডিও", typeEn: "Video" }
        ]
      },
      { id: "be-m6", titleBn: "মাস ৬: সিস্টেম ডিজাইন", titleEn: "Month 6: System Design",
        summaryBn: "মাল্টি-টেন্যান্ট SaaS, Well-Architected, 12-Factor।", summaryEn: "Multi-tenant SaaS, Well-Architected, 12-Factor.", duration: "4w",
        lessons: [
          { id: "be-6-1", titleBn: "মাল্টি-টেন্যান্ট SaaS আর্কিটেকচার", titleEn: "Multi-Tenant SaaS Architecture", duration: "3h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "be-6-2", titleBn: "Well-Architected রিভিউ", titleEn: "Well-Architected Review", duration: "2h", typeBn: "ভিডিও", typeEn: "Video" },
          { id: "be-6-3", titleBn: "SRE বেসিকস ও 12-Factor", titleEn: "SRE Basics & 12-Factor", duration: "2h", typeBn: "ভিডিও", typeEn: "Video" }
        ]
      }
    ]
  },
  {
    id: "se-devops", deptId: "engineering", subdeptId: "devops",
    titleBn: "প্ল্যাটফর্ম/ডেভঅপস ইঞ্জিনিয়ার মাস্টারক্লাস", titleEn: "Platform/DevOps Engineer Masterclass",
    descBn: "৬ মাসে CI/CD, Docker, Kubernetes, অবজারভেবিলিটি ও কস্ট অপ্টিমাইজেশন।",
    descEn: "6-month: CI/CD, Docker, Kubernetes, observability & cost optimization.",
    level: "Intermediate", lang: "EN+BN", duration: "6 months",
    prereqBn: "Git ও বেসিক Linux ধারণা।", prereqEn: "Git and basic Linux knowledge.",
    outcomesBn: ["প্রোডাকশন CI/CD", "Kubernetes ক্লাস্টার", "ইনসিডেন্ট রেসপন্স"],
    outcomesEn: ["Production CI/CD", "Kubernetes cluster", "Incident response"],
    modules: [
      { id: "do-m1", titleBn: "মাস ১: CI বেসিকস", titleEn: "Month 1: CI Basics",
        summaryBn: "Git ফ্লো, CI পাইপলাইন, এনভায়রনমেন্ট।", summaryEn: "Git flow, CI pipeline, environments.", duration: "4w",
        lessons: [
          { id: "do-1-1", titleBn: "Git/GitHub ফ্লো", titleEn: "Git/GitHub Flow", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "do-1-2", titleBn: "CI পাইপলাইন ধারণা", titleEn: "CI Pipeline Concepts", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "do-1-3", titleBn: "এনভায়রনমেন্ট কনফিগ স্ট্যান্ডার্ড", titleEn: "Environment Config Standards", duration: "1.5h", typeBn: "ভিডিও", typeEn: "Video" }
        ]
      },
      { id: "do-m2", titleBn: "মাস ২: কন্টেইনারাইজেশন", titleEn: "Month 2: Containerization",
        summaryBn: "Docker, Compose, লোকাল-প্যারিটি।", summaryEn: "Docker, Compose, local-parity.", duration: "4w",
        lessons: [
          { id: "do-2-1", titleBn: "Docker ও Compose", titleEn: "Docker & Compose", duration: "3h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "do-2-2", titleBn: "লোকাল-প্যারিটি ডেভ এনভি", titleEn: "Local-Parity Dev Env", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "do-2-3", titleBn: "বিল্ড আর্টিফ্যাক্ট স্ট্র্যাটেজি", titleEn: "Build Artifact Strategy", duration: "1.5h", typeBn: "ভিডিও", typeEn: "Video" }
        ]
      },
      { id: "do-m3", titleBn: "মাস ৩: অর্কেস্ট্রেশন", titleEn: "Month 3: Orchestration",
        summaryBn: "Kubernetes বেসিকস, রিলিজ স্ট্র্যাটেজি।", summaryEn: "Kubernetes basics, release strategies.", duration: "4w",
        lessons: [
          { id: "do-3-1", titleBn: "Kubernetes বেসিকস", titleEn: "Kubernetes Basics", duration: "3h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "do-3-2", titleBn: "রিলিজ স্ট্র্যাটেজি (blue/green, canary)", titleEn: "Release Strategies (blue/green, canary)", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "do-3-3", titleBn: "ডেপ্লয় চেকলিস্ট", titleEn: "Deploy Checklist", duration: "1.5h", typeBn: "ভিডিও", typeEn: "Video" }
        ]
      },
      { id: "do-m4", titleBn: "মাস ৪: অবজারভেবিলিটি", titleEn: "Month 4: Observability",
        summaryBn: "লগ, মেট্রিকস, ট্রেসিং, SLO।", summaryEn: "Logs, metrics, tracing, SLOs.", duration: "4w",
        lessons: [
          { id: "do-4-1", titleBn: "লগ, মেট্রিকস, ট্রেসিং", titleEn: "Logs, Metrics & Tracing", duration: "2.5h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "do-4-2", titleBn: "SLO ও এরর বাজেট", titleEn: "SLOs & Error Budgets", duration: "2h", typeBn: "ভিডিও", typeEn: "Video" },
          { id: "do-4-3", titleBn: "এলার্টিং হাইজিন", titleEn: "Alerting Hygiene", duration: "1.5h", typeBn: "ভিডিও", typeEn: "Video" }
        ]
      },
      { id: "do-m5", titleBn: "মাস ৫: সিকিউরিটি ও কমপ্লায়েন্স", titleEn: "Month 5: Security & Compliance",
        summaryBn: "সিক্রেটস, ব্যাকআপ, ডিপেন্ডেন্সি স্ক্যানিং।", summaryEn: "Secrets, backup, dependency scanning.", duration: "4w",
        lessons: [
          { id: "do-5-1", titleBn: "সিক্রেটস ম্যানেজমেন্ট", titleEn: "Secrets Management", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "do-5-2", titleBn: "ব্যাকআপ ও রিকভারি ড্রিল", titleEn: "Backup & Recovery Drill", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "do-5-3", titleBn: "ডিপেন্ডেন্সি স্ক্যানিং", titleEn: "Dependency Scanning", duration: "1.5h", typeBn: "ভিডিও", typeEn: "Video" }
        ]
      },
      { id: "do-m6", titleBn: "মাস ৬: কস্ট ও রিলায়েবিলিটি", titleEn: "Month 6: Cost & Reliability",
        summaryBn: "কস্ট অপটিমাইজেশন, Well-Architected, Game Day।", summaryEn: "Cost optimization, Well-Architected, Game Day.", duration: "4w",
        lessons: [
          { id: "do-6-1", titleBn: "কস্ট অপটিমাইজেশন", titleEn: "Cost Optimization", duration: "2h", typeBn: "ভিডিও", typeEn: "Video" },
          { id: "do-6-2", titleBn: "Well-Architected রিভিউ", titleEn: "Well-Architected Review", duration: "2h", typeBn: "ভিডিও", typeEn: "Video" },
          { id: "do-6-3", titleBn: "ইনসিডেন্ট গেম ডে", titleEn: "Incident Game Day", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" }
        ]
      }
    ]
  },
  {
    id: "design-ux",
    deptId: "design",
    subdeptId: "ux",
    titleBn: "UI/UX ডিজাইনার পাথ",
    titleEn: "UI/UX Designer Path",
    descBn: "রিসার্চ থেকে প্রোটোটাইপ, UI সিস্টেম তৈরি করুন।",
    descEn: "Go from research to prototypes and UI systems.",
    level: "Beginner",
    lang: "EN+BN",
    duration: "24h",
    prereqBn: "ডিজাইন ইন্টারেস্ট ও বেসিক Figma জানা ভালো।",
    prereqEn: "Basic Figma knowledge recommended.",
    outcomesBn: ["ইউজার ফ্লো ও ওয়্যারফ্রেম", "ডিজাইন সিস্টেম", "ইন্টারঅ্যাকটিভ প্রোটোটাইপ"],
    outcomesEn: ["User flows and wireframes", "Design systems", "Interactive prototypes"],
    modules: [
      {
        id: "ux-foundations",
        titleBn: "UX ফাউন্ডেশন",
        titleEn: "UX foundations",
        summaryBn: "রিসার্চ, পারসোনা, ফ্লো।",
        summaryEn: "Research, personas, flows.",
        duration: "8h",
        lessons: [
          { id: "ux-1-1", titleBn: "ইউজার রিসার্চ", titleEn: "User research", duration: "35m", typeBn: "ভিডিও", typeEn: "Video" },
          { id: "ux-1-2", titleBn: "পারসোনা ও জার্নি", titleEn: "Personas and journey", duration: "30m", typeBn: "ভিডিও", typeEn: "Video" },
          { id: "ux-1-3", titleBn: "ইনফো আর্কিটেকচার", titleEn: "Information architecture", duration: "30m", typeBn: "ভিডিও", typeEn: "Video" }
        ]
      },
      {
        id: "ux-figma",
        titleBn: "Figma প্রোডাক্ট ডিজাইন",
        titleEn: "Figma product design",
        summaryBn: "কমপোনেন্ট, অটো লেআউট, প্রোটোটাইপ।",
        summaryEn: "Components, auto layout, prototypes.",
        duration: "10h",
        lessons: [
          { id: "ux-2-1", titleBn: "অটো লেআউট", titleEn: "Auto layout", duration: "25m", typeBn: "ভিডিও", typeEn: "Video" },
          { id: "ux-2-2", titleBn: "ডিজাইন সিস্টেম", titleEn: "Design system", duration: "35m", typeBn: "ভিডিও", typeEn: "Video" },
          { id: "ux-2-3", titleBn: "ইন্টারঅ্যাকটিভ প্রোটোটাইপ", titleEn: "Interactive prototype", duration: "40m", typeBn: "ভিডিও", typeEn: "Video" }
        ]
      }
    ]
  },
  {
    id: "design-brand", deptId: "design", subdeptId: "graphic",
    titleBn: "গ্রাফিক ডিজাইনার মাস্টারক্লাস (সোশ্যাল মিডিয়া ও ব্র্যান্ডিং)", titleEn: "Graphic Designer Masterclass (Social Media & Branding)",
    descBn: "৬ মাসে ব্র্যান্ড আইডেন্টিটি, মোশন গ্রাফিক্স ও প্রোডাকশন পাইপলাইন।",
    descEn: "6-month: brand identity, motion graphics & production pipeline.",
    level: "Beginner", lang: "EN+BN", duration: "6 months",
    prereqBn: "বেসিক ডিজাইন ইন্টারেস্ট, Adobe/Figma ধারণা।", prereqEn: "Basic design interest and Adobe/Figma knowledge.",
    outcomesBn: ["প্রফেশনাল ব্র্যান্ড গাইড", "মোশন ভিডিও আসেট", "ক্রস-টিম ডিজাইন হ্যান্ডঅফ"],
    outcomesEn: ["Professional brand guide", "Motion video assets", "Cross-team design handoff"],
    modules: [
      { id: "gd-m1", titleBn: "মাস ১: ব্র্যান্ড বেসিকস", titleEn: "Month 1: Brand Basics",
        summaryBn: "কালার, টাইপোগ্রাফি, গ্রিড, লোগো ও ব্র্যান্ড কিট।", summaryEn: "Color, typography, grid, logo & brand kit.", duration: "4w",
        lessons: [
          { id: "gd-1-1", titleBn: "কালার, টাইপোগ্রাফি, গ্রিড", titleEn: "Color, Typography & Grid", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "gd-1-2", titleBn: "লোগো ও ব্র্যান্ড গাইড", titleEn: "Logo & Brand Guide", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "gd-1-3", titleBn: "ব্র্যান্ড কিট সেটআপ", titleEn: "Brand Kit Setup", duration: "1.5h", typeBn: "ভিডিও", typeEn: "Video" }
        ]
      },
      { id: "gd-m2", titleBn: "মাস ২: টেমপ্লেট সিস্টেম", titleEn: "Month 2: Template System",
        summaryBn: "সোশ্যাল টেমপ্লেট, মাল্টি-ফরম্যাট, CTA হায়ারার্কি।", summaryEn: "Social templates, multi-format, CTA hierarchy.", duration: "4w",
        lessons: [
          { id: "gd-2-1", titleBn: "সোশ্যাল টেমপ্লেট কিট", titleEn: "Social Template Kit", duration: "2.5h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "gd-2-2", titleBn: "মাল্টি-ফরম্যাট এক্সপোর্ট", titleEn: "Multi-Format Export", duration: "1.5h", typeBn: "ভিডিও", typeEn: "Video" },
          { id: "gd-2-3", titleBn: "CTA হায়ারার্কি", titleEn: "CTA Hierarchy", duration: "1.5h", typeBn: "ভিডিও", typeEn: "Video" }
        ]
      },
      { id: "gd-m3", titleBn: "মাস ৩: মোশন ও শর্ট ভিডিও", titleEn: "Month 3: Motion & Short Video",
        summaryBn: "মাইক্রো অ্যানিমেশন, স্টোরিবোর্ড, ভিডিও পাইপলাইন।", summaryEn: "Micro-animation, storyboard, video pipeline.", duration: "4w",
        lessons: [
          { id: "gd-3-1", titleBn: "মাইক্রো অ্যানিমেশন", titleEn: "Micro-Animations", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "gd-3-2", titleBn: "স্টোরিবোর্ডিং", titleEn: "Storyboarding", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "gd-3-3", titleBn: "ভিডিও অ্যাসেট পাইপলাইন", titleEn: "Video Asset Pipeline", duration: "2h", typeBn: "ভিডিও", typeEn: "Video" }
        ]
      },
      { id: "gd-m4", titleBn: "মাস ৪: ক্রিয়েটিভ টেস্টিং", titleEn: "Month 4: Creative Testing",
        summaryBn: "A/B ভ্যারিয়েশন, হুক/CTA টেস্ট, পারফরম্যান্স রিভিউ।", summaryEn: "A/B variation, hook/CTA testing, performance review.", duration: "4w",
        lessons: [
          { id: "gd-4-1", titleBn: "A/B ভ্যারিয়েশন", titleEn: "A/B Variation Design", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "gd-4-2", titleBn: "হুক/CTA টেস্টিং", titleEn: "Hook & CTA Testing", duration: "1.5h", typeBn: "ভিডিও", typeEn: "Video" },
          { id: "gd-4-3", titleBn: "পারফরম্যান্স রিভিউ", titleEn: "Performance Review", duration: "1.5h", typeBn: "ভিডিও", typeEn: "Video" }
        ]
      },
      { id: "gd-m5", titleBn: "মাস ৫: লোকালাইজেশন", titleEn: "Month 5: Localization",
        summaryBn: "বাংলা/ইংরেজি ভ্যারিয়েশন, ইনক্লুসিভ ভিজ্যুয়াল।", summaryEn: "BN/EN variations, inclusive visuals.", duration: "4w",
        lessons: [
          { id: "gd-5-1", titleBn: "বাংলা/ইংরেজি ভ্যারিয়েশন", titleEn: "Bilingual Visual Variations", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "gd-5-2", titleBn: "ইনক্লুসিভ ভিজ্যুয়াল", titleEn: "Inclusive Visuals", duration: "1.5h", typeBn: "ভিডিও", typeEn: "Video" },
          { id: "gd-5-3", titleBn: "কমিউনিটি অ্যাসেট লাইব্রেরি", titleEn: "Community Asset Library", duration: "1.5h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" }
        ]
      },
      { id: "gd-m6", titleBn: "মাস ৬: প্রোডাকশন পাইপলাইন", titleEn: "Month 6: Production Pipeline",
        summaryBn: "ভার্সনিং, এক্সপোর্ট স্ট্যান্ডার্ড, ক্রস-টিম হ্যান্ডঅফ।", summaryEn: "Versioning, export standards, cross-team handoff.", duration: "4w",
        lessons: [
          { id: "gd-6-1", titleBn: "ভার্সনিং ও নামকরণ", titleEn: "Versioning & Naming", duration: "1.5h", typeBn: "ভিডিও", typeEn: "Video" },
          { id: "gd-6-2", titleBn: "এক্সপোর্ট স্ট্যান্ডার্ড", titleEn: "Export Standards", duration: "1.5h", typeBn: "ভিডিও", typeEn: "Video" },
          { id: "gd-6-3", titleBn: "ক্রস-টিম হ্যান্ডঅফ", titleEn: "Cross-Team Handoff", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" }
        ]
      }
    ]
  },
  {
    id: "product-ba", deptId: "product", subdeptId: "ba",
    titleBn: "বিজনেস অ্যানালিস্ট / এজাইল অ্যানালিস্ট মাস্টারক্লাস", titleEn: "Business Analyst / Agile Analyst Masterclass",
    descBn: "৬ মাসে এলিসিটেশন, মডেলিং, এজাইল ডেলিভারি ও প্রসেস অপটিমাইজেশন।",
    descEn: "6-month: elicitation, modeling, agile delivery & process optimization.",
    level: "Beginner", lang: "EN+BN", duration: "6 months",
    prereqBn: "বেসিক ডকুমেন্টেশন ও কমিউনিকেশন স্কিল।", prereqEn: "Basic documentation and communication skills.",
    outcomesBn: ["ট্রেসেবিলিটি ম্যাট্রিক্স", "এজাইল ব্যাকলগ", "UAT রিপোর্ট"],
    outcomesEn: ["Traceability matrix", "Agile backlog", "UAT report"],
    modules: [
      { id: "ba-m1", titleBn: "মাস ১: এলিসিটেশন", titleEn: "Month 1: Elicitation",
        summaryBn: "স্টেকহোল্ডার ম্যাপিং, প্রসেস ডায়াগ্রাম, রিকোয়ারমেন্ট।", summaryEn: "Stakeholder mapping, process diagrams, requirements.", duration: "4w",
        lessons: [
          { id: "ba-1-1", titleBn: "স্টেকহোল্ডার ম্যাপিং", titleEn: "Stakeholder Mapping", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "ba-1-2", titleBn: "প্রসেস ডায়াগ্রাম", titleEn: "Process Diagrams", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "ba-1-3", titleBn: "রিকোয়ারমেন্ট এলিসিটেশন", titleEn: "Requirement Elicitation", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" }
        ]
      },
      { id: "ba-m2", titleBn: "মাস ২: রিকোয়ারমেন্ট মডেলিং", titleEn: "Month 2: Requirement Modeling",
        summaryBn: "ইউজার স্টোরি, ডেটা ডিকশনারি, DoD।", summaryEn: "User stories, data dictionary, DoD.", duration: "4w",
        lessons: [
          { id: "ba-2-1", titleBn: "ইউজার স্টোরি ও অ্যাকসেপ্টেন্স", titleEn: "User Stories & Acceptance Criteria", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "ba-2-2", titleBn: "ডেটা ডিকশনারি", titleEn: "Data Dictionary", duration: "1.5h", typeBn: "ভিডিও", typeEn: "Video" },
          { id: "ba-2-3", titleBn: "ডেফিনিশন অফ ডান", titleEn: "Definition of Done", duration: "1.5h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" }
        ]
      },
      { id: "ba-m3", titleBn: "মাস ৩: ট্রেসেবিলিটি", titleEn: "Month 3: Traceability",
        summaryBn: "ট্রেসেবিলিটি ম্যাট্রিক্স, চেঞ্জ ইমপ্যাক্ট, রিস্ক।", summaryEn: "Traceability matrix, change impact, risk.", duration: "4w",
        lessons: [
          { id: "ba-3-1", titleBn: "ট্রেসেবিলিটি ম্যাট্রিক্স", titleEn: "Traceability Matrix", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "ba-3-2", titleBn: "চেঞ্জ ইমপ্যাক্ট", titleEn: "Change Impact Analysis", duration: "1.5h", typeBn: "ভিডিও", typeEn: "Video" },
          { id: "ba-3-3", titleBn: "রিস্ক বিশ্লেষণ", titleEn: "Risk Analysis", duration: "1.5h", typeBn: "ভিডিও", typeEn: "Video" }
        ]
      },
      { id: "ba-m4", titleBn: "মাস ৪: এজাইল ডেলিভারি", titleEn: "Month 4: Agile Delivery",
        summaryBn: "ব্যাকলগ রিফাইনমেন্ট, স্টোরি স্লাইসিং, এস্টিমেশন।", summaryEn: "Backlog refinement, story slicing, estimation.", duration: "4w",
        lessons: [
          { id: "ba-4-1", titleBn: "ব্যাকলগ রিফাইনমেন্ট", titleEn: "Backlog Refinement", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "ba-4-2", titleBn: "স্টোরি স্লাইসিং", titleEn: "Story Slicing", duration: "1.5h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "ba-4-3", titleBn: "এস্টিমেশন কনসিস্টেন্সি", titleEn: "Estimation Consistency", duration: "1.5h", typeBn: "ভিডিও", typeEn: "Video" }
        ]
      },
      { id: "ba-m5", titleBn: "মাস ৫: QA ও UAT", titleEn: "Month 5: Quality & Testing",
        summaryBn: "UAT প্ল্যানিং, টেস্ট সিনারিও, ডিফেক্ট ট্রায়েজ।", summaryEn: "UAT planning, test scenarios, defect triage.", duration: "4w",
        lessons: [
          { id: "ba-5-1", titleBn: "UAT প্ল্যানিং", titleEn: "UAT Planning", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "ba-5-2", titleBn: "টেস্ট সিনারিও", titleEn: "Test Scenarios", duration: "1.5h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "ba-5-3", titleBn: "ডিফেক্ট ট্রায়েজ", titleEn: "Defect Triage", duration: "1.5h", typeBn: "ভিডিও", typeEn: "Video" }
        ]
      },
      { id: "ba-m6", titleBn: "মাস ৬: কন্টিনিউয়াস ইমপ্রুভমেন্ট", titleEn: "Month 6: Continuous Improvement",
        summaryBn: "ড্যাশবোর্ড, রেট্রো ইনসাইট, প্রসেস অপটিমাইজেশন।", summaryEn: "Dashboards, retro insights, process optimization.", duration: "4w",
        lessons: [
          { id: "ba-6-1", titleBn: "ড্যাশবোর্ড ও রিপোর্টিং", titleEn: "Dashboard & Reporting", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "ba-6-2", titleBn: "রেট্রো ইনসাইট", titleEn: "Retro Insights", duration: "1.5h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "ba-6-3", titleBn: "প্রসেস অপটিমাইজেশন", titleEn: "Process Optimization", duration: "1.5h", typeBn: "ভিডিও", typeEn: "Video" }
        ]
      }
    ]
  },
  {
    id: "product-pm", deptId: "product", subdeptId: "pm",
    titleBn: "প্রোডাক্ট ম্যানেজার মাস্টারক্লাস", titleEn: "Product Manager Masterclass",
    descBn: "৬ মাসে ভিশন, রোডম্যাপ, মেট্রিকস, লঞ্চ ও গভর্ন্যান্স।",
    descEn: "6-month: vision, roadmap, metrics, launch & governance.",
    level: "Intermediate", lang: "EN+BN", duration: "6 months",
    prereqBn: "বেসিক প্রোডাক্ট ও টিম কাজের ধারণা।", prereqEn: "Basic product and team workflow knowledge.",
    outcomesBn: ["প্রোডাক্ট রোডম্যাপ", "লঞ্চ এক্সিকিউশন", "গভর্ন্যান্স রিচুয়াল"],
    outcomesEn: ["Product roadmap", "Launch execution", "Governance rituals"],
    modules: [
      { id: "pm-m1", titleBn: "মাস ১: ভিশন ও ডিসকভারি", titleEn: "Month 1: Vision & Discovery",
        summaryBn: "মার্কেট গ্যাপ, সমস্যা ফ্রেমিং, ভ্যালু প্রপ।", summaryEn: "Market gap, problem framing, value prop.", duration: "4w",
        lessons: [
          { id: "pm-1-1", titleBn: "মার্কেট গ্যাপ বিশ্লেষণ", titleEn: "Market Gap Analysis", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "pm-1-2", titleBn: "সমস্যা ফ্রেমিং", titleEn: "Problem Framing", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "pm-1-3", titleBn: "ভ্যালু প্রপ ডিফাইন", titleEn: "Value Proposition Define", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" }
        ]
      },
      { id: "pm-m2", titleBn: "মাস ২: রোডম্যাপ ও OKR", titleEn: "Month 2: Roadmap & OKR",
        summaryBn: "প্রায়োরিটাইজেশন, OKR, ডিপেন্ডেন্সি।", summaryEn: "Prioritization, OKRs, dependencies.", duration: "4w",
        lessons: [
          { id: "pm-2-1", titleBn: "প্রায়োরিটাইজেশন ফ্রেমওয়ার্ক", titleEn: "Prioritization Framework", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "pm-2-2", titleBn: "OKR সেটআপ", titleEn: "OKR Setup", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "pm-2-3", titleBn: "ডিপেন্ডেন্সি ম্যাপিং", titleEn: "Dependency Mapping", duration: "1.5h", typeBn: "ভিডিও", typeEn: "Video" }
        ]
      },
      { id: "pm-m3", titleBn: "মাস ৩: এক্সপেরিমেন্ট ও মেট্রিকস", titleEn: "Month 3: Experiments & Metrics",
        summaryBn: "হাইপোথিসিস ব্যাকলগ, ফানেল মেট্রিকস, ইনস্ট্রুমেন্টেশন।", summaryEn: "Hypothesis backlog, funnel metrics, instrumentation.", duration: "4w",
        lessons: [
          { id: "pm-3-1", titleBn: "হাইপোথিসিস ব্যাকলগ", titleEn: "Hypothesis Backlog", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "pm-3-2", titleBn: "ফানেল মেট্রিকস", titleEn: "Funnel Metrics", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "pm-3-3", titleBn: "ইনস্ট্রুমেন্টেশন প্ল্যান", titleEn: "Instrumentation Plan", duration: "1.5h", typeBn: "ভিডিও", typeEn: "Video" }
        ]
      },
      { id: "pm-m4", titleBn: "মাস ৪: প্রাইসিং ও প্যাকেজিং", titleEn: "Month 4: Pricing & Packaging",
        summaryBn: "SaaS প্যাকেজিং, রিটেনশন লুপ, মনিটাইজেশন।", summaryEn: "SaaS packaging, retention loops, monetization.", duration: "4w",
        lessons: [
          { id: "pm-4-1", titleBn: "SaaS প্যাকেজিং", titleEn: "SaaS Packaging", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "pm-4-2", titleBn: "রিটেনশন লুপ", titleEn: "Retention Loops", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "pm-4-3", titleBn: "মনিটাইজেশন স্ট্র্যাটেজি", titleEn: "Monetization Strategy", duration: "2h", typeBn: "ভিডিও", typeEn: "Video" }
        ]
      },
      { id: "pm-m5", titleBn: "মাস ৫: লঞ্চ এক্সিকিউশন", titleEn: "Month 5: Launch Execution",
        summaryBn: "লঞ্চ চেকলিস্ট, স্টেকহোল্ডার এলাইনমেন্ট, রিস্ক রেজিস্টার।", summaryEn: "Launch checklist, stakeholder alignment, risk register.", duration: "4w",
        lessons: [
          { id: "pm-5-1", titleBn: "লঞ্চ চেকলিস্ট", titleEn: "Launch Checklist", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "pm-5-2", titleBn: "স্টেকহোল্ডার এলাইনমেন্ট", titleEn: "Stakeholder Alignment", duration: "1.5h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "pm-5-3", titleBn: "রিস্ক রেজিস্টার", titleEn: "Risk Register", duration: "1.5h", typeBn: "ভিডিও", typeEn: "Video" }
        ]
      },
      { id: "pm-m6", titleBn: "মাস ৬: গভর্ন্যান্স", titleEn: "Month 6: Governance",
        summaryBn: "প্রোডাক্ট কাউন্সিল, ট্রান্সপারেন্সি, প্রফিট-শেয়ার।", summaryEn: "Product council, transparency rituals, profit-share narrative.", duration: "4w",
        lessons: [
          { id: "pm-6-1", titleBn: "প্রোডাক্ট কাউন্সিল", titleEn: "Product Council", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "pm-6-2", titleBn: "ট্রান্সপারেন্সি রিচুয়াল", titleEn: "Transparency Rituals", duration: "1.5h", typeBn: "ভিডিও", typeEn: "Video" },
          { id: "pm-6-3", titleBn: "প্রফিট-শেয়ার ন্যারেটিভ", titleEn: "Profit-Share Narrative", duration: "1.5h", typeBn: "ভিডিও", typeEn: "Video" }
        ]
      }
    ]
  },
  {
    id: "marketing-growth", deptId: "marketing", subdeptId: "growth",
    titleBn: "গ্রোথ ও লাইফসাইকেল মার্কেটার মাস্টারক্লাস", titleEn: "Growth & Lifecycle Marketer Masterclass",
    descBn: "৬ মাসে ICP, SEO, পেইড অ্যাকুইজিশন, অ্যানালিটিক্স ও কমিউনিটি গ্রোথ।",
    descEn: "6-month: ICP, SEO, paid acquisition, analytics & community growth.",
    level: "Beginner", lang: "EN+BN", duration: "6 months",
    prereqBn: "বেসিক ডিজিটাল মার্কেটিং ধারণা।", prereqEn: "Basic digital marketing knowledge.",
    outcomesBn: ["SEO ও কন্টেন্ট প্ল্যান", "GA4 ড্যাশবোর্ড", "কমিউনিটি গ্রোথ লুপ"],
    outcomesEn: ["SEO & content plan", "GA4 dashboard", "Community growth loop"],
    modules: [
      { id: "mk-m1", titleBn: "মাস ১: ICP ও মেসেজিং", titleEn: "Month 1: ICP & Messaging",
        summaryBn: "ফানেল ম্যাপিং, মেসেজিং গাইডলাইন, UTM ট্র্যাকিং।", summaryEn: "Funnel mapping, messaging guidelines, UTM tracking.", duration: "4w",
        lessons: [
          { id: "mk-1-1", titleBn: "ফানেল ম্যাপিং", titleEn: "Funnel Mapping", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "mk-1-2", titleBn: "মেসেজিং গাইডলাইন", titleEn: "Messaging Guidelines", duration: "1.5h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "mk-1-3", titleBn: "UTM ও ট্র্যাকিং প্ল্যান", titleEn: "UTM & Tracking Plan", duration: "1.5h", typeBn: "ভিডিও", typeEn: "Video" }
        ]
      },
      { id: "mk-m2", titleBn: "মাস ২: SEO ও কন্টেন্ট", titleEn: "Month 2: SEO & Content",
        summaryBn: "SEO বেসিকস, কন্টেন্ট ক্যালেন্ডার, ল্যান্ডিং পেজ কনভার্সন।", summaryEn: "SEO basics, content calendar, landing page conversion.", duration: "4w",
        lessons: [
          { id: "mk-2-1", titleBn: "SEO বেসিকস", titleEn: "SEO Basics", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "mk-2-2", titleBn: "কন্টেন্ট ক্যালেন্ডার", titleEn: "Content Calendar", duration: "1.5h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "mk-2-3", titleBn: "ল্যান্ডিং পেজ কনভার্সন", titleEn: "Landing Page Conversion", duration: "1.5h", typeBn: "ভিডিও", typeEn: "Video" }
        ]
      },
      { id: "mk-m3", titleBn: "মাস ৩: পেইড অ্যাকুইজিশন", titleEn: "Month 3: Paid Acquisition",
        summaryBn: "ক্রিয়েটিভ টেস্টিং, লিড জেনারেশন, কস্ট-টু-রেভিনিউ।", summaryEn: "Creative testing, lead gen, cost-to-revenue model.", duration: "4w",
        lessons: [
          { id: "mk-3-1", titleBn: "ক্রিয়েটিভ টেস্টিং", titleEn: "Creative Testing", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "mk-3-2", titleBn: "লিড জেনারেশন", titleEn: "Lead Generation", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "mk-3-3", titleBn: "কস্ট-টু-রেভিনিউ মডেল", titleEn: "Cost-to-Revenue Model", duration: "1.5h", typeBn: "ভিডিও", typeEn: "Video" }
        ]
      },
      { id: "mk-m4", titleBn: "মাস ৪: অ্যানালিটিক্স", titleEn: "Month 4: Analytics",
        summaryBn: "GA4 সেটআপ, কোহর্ট অ্যানালিসিস, ড্যাশবোর্ড।", summaryEn: "GA4 setup, cohort analysis, dashboarding.", duration: "4w",
        lessons: [
          { id: "mk-4-1", titleBn: "GA4 সেটআপ", titleEn: "GA4 Setup", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "mk-4-2", titleBn: "কোহর্ট অ্যানালিসিস", titleEn: "Cohort Analysis", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "mk-4-3", titleBn: "ড্যাশবোর্ডিং", titleEn: "Dashboarding", duration: "1.5h", typeBn: "ভিডিও", typeEn: "Video" }
        ]
      },
      { id: "mk-m5", titleBn: "মাস ৫: অটোমেশন", titleEn: "Month 5: Automation",
        summaryBn: "CRM অটোমেশন, লিড স্কোরিং, ইমেইল ড্রিপ।", summaryEn: "CRM automation, lead scoring, email drip.", duration: "4w",
        lessons: [
          { id: "mk-5-1", titleBn: "CRM অটোমেশন", titleEn: "CRM Automation", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "mk-5-2", titleBn: "লিড স্কোরিং", titleEn: "Lead Scoring", duration: "1.5h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "mk-5-3", titleBn: "ইমেইল ড্রিপ", titleEn: "Email Drip", duration: "1.5h", typeBn: "ভিডিও", typeEn: "Video" }
        ]
      },
      { id: "mk-m6", titleBn: "মাস ৬: কমিউনিটি গ্রোথ", titleEn: "Month 6: Community Growth",
        summaryBn: "রেফারেল লুপ, পার্টনার চ্যানেল, রিটেনশন প্লে।", summaryEn: "Referral loops, partner channels, retention plays.", duration: "4w",
        lessons: [
          { id: "mk-6-1", titleBn: "রেফারেল লুপ", titleEn: "Referral Loops", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "mk-6-2", titleBn: "পার্টনার চ্যানেল", titleEn: "Partner Channels", duration: "1.5h", typeBn: "ভিডিও", typeEn: "Video" },
          { id: "mk-6-3", titleBn: "রিটেনশন প্লে", titleEn: "Retention Plays", duration: "1.5h", typeBn: "ভিডিও", typeEn: "Video" }
        ]
      }
    ]
  },
  {
    id: "marketing-success", deptId: "marketing", subdeptId: "success",
    titleBn: "কাস্টমার সাকসেস ও সাপোর্ট অপস মাস্টারক্লাস", titleEn: "Customer Success & Support Ops Masterclass",
    descBn: "৬ মাসে অনবোর্ডিং, সাপোর্ট অপস, রিটেনশন ও NPS/CSAT রিপোর্টিং।",
    descEn: "6-month: onboarding, support ops, retention & NPS/CSAT reporting.",
    level: "Beginner", lang: "EN+BN", duration: "6 months",
    prereqBn: "কাস্টমার কমিউনিকেশন স্কিল।", prereqEn: "Customer communication skills.",
    outcomesBn: ["অনবোর্ডিং প্লেবুক", "চর্ণ রিডাকশন", "NPS/CSAT ড্যাশবোর্ড"],
    outcomesEn: ["Onboarding playbook", "Churn reduction", "NPS/CSAT dashboard"],
    modules: [
      { id: "cs-m1", titleBn: "মাস ১: অনবোর্ডিং", titleEn: "Month 1: Onboarding",
        summaryBn: "টাইম-টু-ভ্যালু, অনবোর্ডিং প্লেবুক, সেগমেন্টেশন।", summaryEn: "Time-to-value, onboarding playbook, segmentation.", duration: "4w",
        lessons: [
          { id: "cs-1-1", titleBn: "টাইম-টু-ভ্যালু মেট্রিকস", titleEn: "Time-to-Value Metrics", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "cs-1-2", titleBn: "অনবোর্ডিং প্লেবুক", titleEn: "Onboarding Playbook", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "cs-1-3", titleBn: "গ্রাহক সেগমেন্টেশন", titleEn: "Customer Segmentation", duration: "1.5h", typeBn: "ভিডিও", typeEn: "Video" }
        ]
      },
      { id: "cs-m2", titleBn: "মাস ২: সাপোর্ট অপারেশন", titleEn: "Month 2: Support Operations",
        summaryBn: "সাপোর্ট ট্যাক্সোনমি, নলেজ বেস, SLA ডিজাইন।", summaryEn: "Support taxonomy, knowledge base, SLA design.", duration: "4w",
        lessons: [
          { id: "cs-2-1", titleBn: "সাপোর্ট ট্যাক্সোনমি", titleEn: "Support Taxonomy", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "cs-2-2", titleBn: "নলেজ বেস স্ট্রাকচার", titleEn: "Knowledge Base Structure", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "cs-2-3", titleBn: "SLA ডিজাইন", titleEn: "SLA Design", duration: "1.5h", typeBn: "ভিডিও", typeEn: "Video" }
        ]
      },
      { id: "cs-m3", titleBn: "মাস ৩: ভয়েস অফ কাস্টমার", titleEn: "Month 3: Voice of Customer",
        summaryBn: "ফিডব্যাক ট্যাগিং, প্রোডাক্ট লুপ, ইনসাইট রিপোর্ট।", summaryEn: "Feedback tagging, product loop, insight reporting.", duration: "4w",
        lessons: [
          { id: "cs-3-1", titleBn: "ফিডব্যাক ট্যাগিং", titleEn: "Feedback Tagging", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "cs-3-2", titleBn: "প্রোডাক্ট লুপ", titleEn: "Product Feedback Loop", duration: "1.5h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
          { id: "cs-3-3", titleBn: "ইনসাইট রিপোর্টিং", titleEn: "Insight Reporting", duration: "1.5h", typeBn: "ভিডিও", typeEn: "Video" }
        ]
      },
      { id: "cs-4-1", titleBn: "চর্ণ কমানো স্ট্র্যাটেজি", titleEn: "Churn Reduction Strategy", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
      { id: "cs-4-2", titleBn: "রিনিউয়াল প্লেবুক", titleEn: "Renewal Playbook", duration: "2h", typeBn: "লাইভ ল্যাব", typeEn: "Live Lab" },
      { id: "cs-4-3", titleBn: "এসকেলেশন ফ্লো", titleEn: "Escalation Flow", duration: "1.5h", typeBn: "ভিডিও", typeEn: "Video" }
    ]
  }
];
