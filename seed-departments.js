import fs from "fs";
import path from "path";

const data = [
  {
    subdeptId: "frontend",
    deptId: "engineering",
    titleBn: "ফ্রন্টএন্ড ডেভেলপার (SaaS)",
    titleEn: "Frontend Developer (SaaS)",
    descBn: "SaaS প্রোডাক্টের জন্য স্কেলেবল, হাই-পারফরম্যান্স এবং ইউজার-ফ্রেন্ডলি ড্যাশবোর্ড তৈরি করা।",
    descEn: "Build scalable, high-performance, and user-friendly dashboards for SaaS applications.",
    level: "All Levels",
    duration: "50h+",
    prereqBn: "লজিক্যাল প্রবলেম সলভিং এবং ওয়েব টেকনোলজি (HTML, CSS, JS) সম্পর্কে ক্লিয়ার ধারণা।",
    prereqEn: "Clear understanding of logical problem solving and web technologies (HTML, CSS, JS).",
    outcomesBn: [
      "কমপ্লেক্স B2B ড্যাশবোর্ড তৈরি",
      "গ্লোবাল স্টেট ও ক্যাশিং মেইনটেইন",
      "পাবলিক API ও সিকিউর সেশন হ্যান্ডলিং",
      "রিয়েল-টাইম ডেটা রেন্ডারিং"
    ],
    outcomesEn: [
      "Building complex B2B dashboards",
      "Managing global state and caching",
      "Handling public APIs and secure sessions",
      "Real-time data rendering"
    ],
    modules: [
      {
        titleEn: "Web Foundations & Semantic UI",
        titleBn: "ওয়েব ফাউন্ডেশন এবং সেমান্টিক UI",
        summaryEn: "Mastering HTML5, modern CSS grids, accessibility (a11y), and raw JavaScript manipulation.",
        summaryBn: "HTML5, আধুনিক CSS গ্রিড, অ্যাক্সেসিবিলিটি (a11y) এবং র-জাভাস্ক্রিপ্ট মাস্টারিং।",
        lessons: [
          { titleEn: "Semantic HTML & DOM Architecture", titleBn: "সেমান্টিক HTML ও DOM আর্কিটেকচার" },
          { titleEn: "Advanced CSS Layouts (Grid/Flexbox)", titleBn: "অ্যাডভান্সড CSS লেআউট" },
          { titleEn: "Responsive & Adaptive Patterns", titleBn: "রেসপনসিভ ও অ্যাডাপ্টিভ প্যাটার্ন" },
          { titleEn: "JavaScript ES6+ Deep Dive", titleBn: "জাভাস্ক্রিপ্ট ES6+ ডিপ-ডাইভ" },
          { titleEn: "Promises, Async/Await & Fetch API", titleBn: "অ্যাসিঙ্ক্রোনাস জাভাস্ক্রিপ্ট" }
        ]
      },
      {
        titleEn: "React.js Core & Component Design",
        titleBn: "React.js কোর এবং কম্পোনেন্ট ডিজাইন",
        summaryEn: "Building solid, reusable components and managing basic component-level state.",
        summaryBn: "রোবাস্ট, রিইউজেবল কম্পোনেন্ট তৈরি করা এবং স্টেট মেইনটেইন করা।",
        lessons: [
          { titleEn: "Component Lifecycle & Hooks", titleBn: "কম্পোনেন্ট লাইফসাইকেল ও হুকস" },
          { titleEn: "Props drilling vs Context API", titleBn: "প্রপস ড্রিলিং এবং কনটেক্সট API" },
          { titleEn: "Form Handling (React Hook Form)", titleBn: "ফর্ম হ্যান্ডলিং" },
          { titleEn: "Component Composition Models", titleBn: "কম্পোনেন্ট কম্পোজিশন মডেল" }
        ]
      },
      {
        titleEn: "Next.js & App Router Ecosystem",
        titleBn: "Next.js এবং App Router ইকোসিস্টেম",
        summaryEn: "Server-side rendering, routing mechanisms, and full-stack capabilities with Next.js.",
        summaryBn: "সার্ভার-সাইড রেন্ডারিং, রাউটিং মেকানিজম এবং Next.js এর ফুল-স্ট্যাক সক্ষমতা।",
        lessons: [
          { titleEn: "App Router Directory Structure", titleBn: "App Router ডিরেক্টরি স্ট্রাকচার" },
          { titleEn: "Server vs Client Components", titleBn: "সার্ভার বনাম ক্লায়েন্ট কম্পোনেন্ট" },
          { titleEn: "Next.js Image & Font Optimization", titleBn: "ইমেজ এবং ফন্ট অপ্টিমাইজেশন" },
          { titleEn: "API Routes & Middleware Security", titleBn: "API রাউটিং ও মিডলওয়্যার" }
        ]
      },
      {
        titleEn: "State Management & Data Synchronization",
        titleBn: "স্টেট ম্যানেজমেন্ট এবং ডেটা সিঙ্ক",
        summaryEn: "Handling heavy client-side data, caching, and mutations securely.",
        summaryBn: "হেভি ক্লায়েন্ট-সাইড ডেটা, ক্যাশিং এবং মিউটেশন সুরক্ষিতভাবে ম্যানেজ করা।",
        lessons: [
          { titleEn: "Redux Toolkit & Zustand basics", titleBn: "Redux Toolkit এবং Zustand" },
          { titleEn: "Data Fetching & Caching with React Query", titleBn: "React Query এর মাধ্যমে ডেটা ফেচিং" },
          { titleEn: "Optimistic UI Updates", titleBn: "অপটিমিস্টিক UI আপডেট" },
          { titleEn: "Local Storage & Session Persistence", titleBn: "লোকাল স্টোরেজ এবং সেশন ম্যানেজমেন্ট" }
        ]
      },
      {
        titleEn: "SaaS Dashboard Specializations",
        titleBn: "SaaS ড্যাশবোর্ড স্পেশালাইজেশন",
        summaryEn: "Designing specific interfaces meant for B2B dashboards.",
        summaryBn: "বিশেষ করে B2B ড্যাশবোর্ডের জন্য ইন্টারফেস ডিজাইন করা।",
        lessons: [
          { titleEn: "Data Tables with Pagination & Filtering", titleBn: "প্যাজিনেশন ও ফিল্টারিং সহ ডেটা টেবিল" },
          { titleEn: "Charting & Analytics UI (Recharts)", titleBn: "চার্টিং এবং অ্যানালিটিক্স UI" },
          { titleEn: "Advanced Multi-step Forms & Wizards", titleBn: "অ্যাডভান্সড ফর্ম ও উইজার্ড" },
          { titleEn: "Role-based Access Control (RBAC) in UI", titleBn: "UI-তে রোল-বেজড অ্যাক্সেস" }
        ]
      },
      {
        titleEn: "Performance & Security Integrations",
        titleBn: "পারফরম্যান্স এবং সিকিউরিটি",
        summaryEn: "Securing routes, optimizing bundles, and maintaining Core Web Vitals.",
        summaryBn: "রাউট সুরক্ষিত করা, বান্ডল অপটিমাইজ করা এবং Core Web Vitals ঠিক রাখা।",
        lessons: [
          { titleEn: "JWT Token Handling & Interceptors", titleBn: "JWT টোকেন এবং ইন্টারসেপ্টর" },
          { titleEn: "Core Web Vitals Optimization", titleBn: "Core Web Vitals অপটিমাইজেশন" },
          { titleEn: "Code Splitting & Lazy Loading", titleBn: "কোড স্প্লিটিং এবং লেজি লোডিং" },
          { titleEn: "XSS & CSRF Prevention Basics", titleBn: "XSS এবং CSRF প্রতিরোধ" }
        ]
      }
    ]
  },
  {
    subdeptId: "backend",
    deptId: "engineering",
    titleBn: "ব্যাকএন্ড ইঞ্জিনিয়ার (SaaS)",
    titleEn: "Backend Engineer (SaaS)",
    descBn: "স্কেলেবল API, সিকিউর ডেটাবেস ডিজাইন এবং মাল্টি-টেন্যান্ট B2B আর্কিটেকচার তৈরি।",
    descEn: "Build scalable APIs, secure database models, and multi-tenant B2B architectures.",
    level: "All Levels",
    duration: "50h+",
    prereqBn: "প্রোগ্রামিং লজিক, বেসিক SQL এবং নেটওয়ার্কিং নিয়ে প্রাথমিক ধারণা।",
    prereqEn: "Basic understanding of programming logic, SQL, and networking.",
    outcomesBn: [
      "RESTful এবং GraphQL API ডিজাইন",
      "SaaS প্রোডাক্টের জন্য মাল্টি-টেন্যান্সি ইমপ্লিমেন্টেশন",
      "অ্যাডভান্সড ডেটাবেস অপটিমাইজেশন ও ইনডেক্সিং",
      "ব্যাকগ্রাউন্ড প্রসেসিং এবং ক্যাশিং"
    ],
    outcomesEn: [
      "Designing RESTful and GraphQL APIs",
      "Implementing multi-tenancy for SaaS",
      "Advanced database optimization and indexing",
      "Background processing and caching"
    ],
    modules: [
      {
        titleEn: "Programming Core & System Design Basics",
        titleBn: "প্রোগ্রামিং কোর এবং সিস্টেম ডিজাইন",
        summaryEn: "Solidifying core programming concepts in Node.js or Laravel, async flows, and MVC/Service patterns.",
        summaryBn: "Node.js বা Laravel-এ কোর কনসেপ্ট, অ্যাসিনক্রোনাস ফ্লো এবং মডিউলার আর্কিটেকচার।",
        lessons: [
          { titleEn: "Event Loop & Async Processing", titleBn: "ইভেন্ট লুপ এবং অ্যাসিঙ্ক্রোনাস প্রসেস" },
          { titleEn: "MVC Architecture & Service Layers", titleBn: "MVC আর্কিটেকচার এবং সার্ভিস লেয়ার" },
          { titleEn: "Object-Oriented & Functional Paradigms", titleBn: "অবজেক্ট-ওরিয়েন্টেড ডিজাইন" },
          { titleEn: "Error Handling & Logging", titleBn: "এরর হ্যান্ডলিং ও লগিং" }
        ]
      },
      {
        titleEn: "API Design & Security",
        titleBn: "API ডিজাইন এবং সিকিউরিটি",
        summaryEn: "Building unbreakable APIs using tight validation and authentication flows.",
        summaryBn: "রোবাস্ট ভ্যালিডেশন এবং অথেন্টিকেশন ব্যবহার করে ডেভেলপমেন্ট।",
        lessons: [
          { titleEn: "RESTful API Standards", titleBn: "RESTful API স্ট্যান্ডার্ডস" },
          { titleEn: "Request/Response Validation", titleBn: "রিকোয়েস্ট/রেসপন্স ভ্যালিডেশন" },
          { titleEn: "OAuth2 & JWT Implementation", titleBn: "OAuth2 এবং JWT ইমপ্লিমেন্টেশন" },
          { titleEn: "Rate Limiting & Throttling", titleBn: "রেট লিমিটিং এবং থ্রটলিং" }
        ]
      },
      {
        titleEn: "Database Architecture & Optimization",
        titleBn: "ডেটাবেস আর্কিটেকচার এবং অপটিমাইজেশন",
        summaryEn: "Modeling complex data relationships and improving query execution.",
        summaryBn: "ডেটা রিলেশনশিপ মডেলিং এবং কোয়েরি এক্সিকিউশন উন্নত করা।",
        lessons: [
          { titleEn: "Relational Modeling (PostgreSQL/MySQL)", titleBn: "রিলেশনাল ডেটাবেস মডেলিং" },
          { titleEn: "Indexing Strategies & EXPLAIN Plan", titleBn: "ইনডেক্সিং এবং কোয়েরি অপটিমাইজেশন" },
          { titleEn: "Transactions & ACID Properties", titleBn: "ট্রানজেকশন এবং ACID প্রপার্টিজ" },
          { titleEn: "NoSQL Integration for Document Stores", titleBn: "NoSQL ইন্টিগ্রেশন" }
        ]
      },
      {
        titleEn: "SaaS Multi-Tenancy Patterns",
        titleBn: "SaaS মাল্টি-টেন্যান্সি প্যাটার্ন",
        summaryEn: "Structuring applications physically and logically to support multiple B2B clients.",
        summaryBn: "লজিক্যালি মাল্টিপল B2B ক্লায়েন্ট সাপোর্ট করার জন্য অ্যাপ্লিকেশন স্ট্রাকচার।",
        lessons: [
          { titleEn: "Tenant Identification & Routing", titleBn: "টেন্যান্ট আইডেন্টিফিকেশন" },
          { titleEn: "Database per Tenant vs Shared Schema", titleBn: "ডেটাবেস আর্কিটেকচার চয়েজ" },
          { titleEn: "Cross-tenant Data Security", titleBn: "ক্রস-টেন্যান্ট ডেটা সিকিউরিটি" },
          { titleEn: "Managing Granular Roles & Permissions", titleBn: "ডেটাবেস লেভেল রোল-পারমিশন" }
        ]
      },
      {
        titleEn: "Scaling: Caching & Background Queues",
        titleBn: "স্কেলিং: ক্যাশিং এবং ব্যাকগ্রাউন্ড কিউ",
        summaryEn: "Offloading heavy tasks and caching high-traffic views for ultimate SaaS speed.",
        summaryBn: "ভারী কাজগুলো ব্যাকগ্রাউন্ডে নেওয়া এবং হাই-ট্রাফিক ডাটা ক্যাশ করা।",
        lessons: [
          { titleEn: "Redis In-Memory Caching", titleBn: "Redis ক্যাশিং" },
          { titleEn: "Message Brokers (RabbitMQ/Kafka)", titleBn: "মেসেজ ব্রোকার" },
          { titleEn: "Cron Jobs & Scheduled Tasks", titleBn: "ক্রন জবস এবং টাস্ক শিডিউলিং" },
          { titleEn: "Webhooks Architecture & Deliverability", titleBn: "ওয়েবহুক আর্কিটেকচার" }
        ]
      }
    ]
  },
  {
    subdeptId: "devops",
    deptId: "engineering",
    titleBn: "DevOps & QA (SaaS)",
    titleEn: "DevOps & QA (SaaS)",
    descBn: "কোড টেস্টিং, সার্ভার অটোমেশন, এবং নিরবচ্ছিন্ন ক্লাউড ডেপ্লয়মেন্ট নিশ্চিত করা।",
    descEn: "Ensure code testing, server automation, and continuous cloud deployment.",
    level: "Intermediate",
    duration: "40h+",
    prereqBn: "লিনাক্স কমান্ড লাইন, গিট এবং অ্যাপ্লিকেশন বান্ডেলিং নিয়ে প্রাথমিক জ্ঞান।",
    prereqEn: "Basic knowledge of Linux command line, Git, and build tools.",
    outcomesBn: [
      "ফুল CI/CD পাইপলাইন সেটআপ",
      "ডকারাইজড আর্কিটেকচার তৈরি",
      "অটোমেটেড E2E টেস্টিং",
      "সার্ভার মনিটরিং ও অ্যালার্টিং"
    ],
    outcomesEn: [
      "Full CI/CD pipeline setup",
      "Dockerized architecture generation",
      "Automated E2E testing",
      "Server monitoring and alerting"
    ],
    modules: [
      {
        titleEn: "Version Control & Branching Strategy",
        titleBn: "ভার্সন কন্ট্রোল এবং ব্রাঞ্চিং",
        summaryEn: "Managing team code effectively and setting rules.",
        summaryBn: "টিমের কোড মেইনটেইন এবং রুলস সেটআপ।",
        lessons: [
          { titleEn: "Git flow & Trunk-based Delivery", titleBn: "গিট-ফ্লো এবং ট্রাঙ্ক-বেসড ডেলিভারি" },
          { titleEn: "Code Reviews & Merge Policies", titleBn: "কোড রিভিউ মেকানিজম" }
        ]
      },
      {
        titleEn: "CI/CD & Cloud Pipelines",
        titleBn: "CI/CD এবং ক্লাউড পাইপলাইন",
        summaryEn: "Automating zero-downtime deployment pipelines.",
        summaryBn: "জিরো-ডাউনটাইম ডেপ্লয়মেন্ট অটোমেশন।",
        lessons: [
          { titleEn: "GitHub Actions / GitLab CI Basics", titleBn: "অ্যাকশনস এবং CI/CD স্ক্রিপ্টিং" },
          { titleEn: "Automated Build & Test Stages", titleBn: "অটোমেটেড বিল্ড ও টেস্টিং স্টেজ" },
          { titleEn: "Blue-Green Deployment Concepts", titleBn: "ব্লু-গ্রিন ডেপ্লয়মেন্ট" }
        ]
      },
      {
        titleEn: "Containerization & Infrastructure",
        titleBn: "কন্টেইনারাইজেশন এবং ইনফ্রাস্ট্রাকচার",
        summaryEn: "Managing identical application environments at scale.",
        summaryBn: "স্কেলে আইডেন্টিক্যাল অ্যাপ এনভায়রনমেন্ট তৈরি।",
        lessons: [
          { titleEn: "Docker Basics & Docker Compose", titleBn: "ডকার বেসিক এবং ডকার কম্পোজ" },
          { titleEn: "Writing efficient Dockerfiles", titleBn: "এফিসিয়েন্ট ডকারফাইল তৈরি" },
          { titleEn: "VPS, SSH & Nginx Reverse Proxy Setup", titleBn: "VPS এবং Nginx রিভার্স প্রক্সি" }
        ]
      },
      {
        titleEn: "Quality Assurance (QA) Automation",
        titleBn: "অটোমেটেড QA টেস্টিং",
        summaryEn: "Ensuring SaaS reliability using automated UI and API tests.",
        summaryBn: "অটোমেটেড UI ও API টেস্ট দিয়ে সফটওয়্যারের মান নিশ্চিত করা।",
        lessons: [
          { titleEn: "End-to-End Testing (Cypress/Playwright)", titleBn: "Cypress/Playwright টেস্টিং" },
          { titleEn: "API Integration Testing Frameworks", titleBn: "API ইন্টিগ্রেশন টেস্টিং" },
          { titleEn: "Load Testing (K6/JMeter)", titleBn: "লোড টেস্টিং বেসিক" }
        ]
      },
      {
        titleEn: "Observability & Live Monitoring",
        titleBn: "অবজারভেবিলিটি এবং মনিটরিং",
        summaryEn: "Logging exactly what breaks, before the customer finds out.",
        summaryBn: "কাস্টমার রিপোর্ট দেওয়ার আগেই সমস্যা খুঁজে বের করা।",
        lessons: [
          { titleEn: "Centralized Logging (ELK/Datadog basics)", titleBn: "সেন্ট্রালাইজড লগিং" },
          { titleEn: "Server Resource Monitoring", titleBn: "সার্ভার রিসোর্স মনিটরিং" },
          { titleEn: "Alerting and Incident Response", titleBn: "অ্যালার্ট সিগন্যাল ও রেসপন্স" }
        ]
      }
    ]
  },
  {
    subdeptId: "ux",
    deptId: "design",
    titleBn: "UI/UX ডিজাইনার (SaaS)",
    titleEn: "UI/UX Designer (SaaS)",
    descBn: "উচ্চ-মানের B2B প্রোডাক্ট ইন্টারফেস, রিসার্চ এবং ইউজার ফ্লো ডিজাইন করা।",
    descEn: "Design high-quality B2B product interfaces, research logic, and user flows.",
    level: "All Levels",
    duration: "40h+",
    prereqBn: "প্রোডাক্ট ডিজাইন সেন্স, ভিজ্যুয়াল এস্থেটিক্স এবং Figma এর পরিচ্ছন্ন কাজ করার অভিজ্ঞতা।",
    prereqEn: "Product design sense, visual aesthetics, and clean Figma skills.",
    outcomesBn: [
      "স্কেলেবল ডিজাইন সিস্টেম তৈরি",
      "SaaS প্রোডাক্টের ইনঅ্যাডভান্সড ওয়্যারফ্রেমিং",
      "ডেটা ভিজ্যুয়ালাইজেশন ও ড্যাশবোর্ড UX",
      "ইন্টারঅ্যাকটিভ প্রোটোটাইপ"
    ],
    outcomesEn: [
      "Creating scalable design systems",
      "Advanced wireframing for SaaS products",
      "Data visualization & Dashboard UX",
      "Interactive high-fidelity prototypes"
    ],
    modules: [
      {
        titleEn: "UX Research & B2B Personas",
        titleBn: "UX রিসার্চ এবং B2B পারসোনা",
        summaryEn: "Understanding complex SaaS users, their exact pain points, and workflow hierarchies.",
        summaryBn: "SaaS ইউজারদের সমস্যা এবং ওয়ার্কফ্লো হাইরারকি বিশ্লেষণ করা।",
        lessons: [
          { titleEn: "Defining B2B User Personas", titleBn: "B2B ইউজার পারসোনা তৈরি" },
          { titleEn: "Journey Mapping & Empathy Maps", titleBn: "জার্নি ম্যাপিং" },
          { titleEn: "SaaS Feature Prioritization Matrices", titleBn: "ফিচার প্রায়োরিটি ম্যাট্রিক্স" }
        ]
      },
      {
        titleEn: "Information Architecture (IA)",
        titleBn: "ইনফরমেশন আর্কিটেকচার",
        summaryEn: "Structuring complex nested features clearly on a dashboard.",
        summaryBn: "ড্যাশবোর্ডের হাজারো তথ্য এবং ফিচার গুছিয়ে সাজানো।",
        lessons: [
          { titleEn: "Card Sorting & User Flows", titleBn: "কার্ড সর্টিং ও ইউজার ফ্লো" },
          { titleEn: "SaaS Navigation Structures (Sidebar vs Top)", titleBn: "নেভিগেশন স্ট্রাকচার ডিজাইন" },
          { titleEn: "Wireframing Complex Operations", titleBn: "উচ্চস্তরের ওয়্যারফ্রেমিং" }
        ]
      },
      {
        titleEn: "Figma Mastery & Design Systems",
        titleBn: "Figma মাস্টারি এবং ডিজাইন সিস্টেম",
        summaryEn: "Crafting bulletproof atomic components with dependable auto-layout properties.",
        summaryBn: "শক্তিশালী অটো-লেআউট এবং অ্যাটমিক কম্পোনেন্ট ভিত্তিক সিস্টেম তৈরি।",
        lessons: [
          { titleEn: "Advanced Auto Layout Strategies", titleBn: "অ্যাডভান্সড অটো লেআউট" },
          { titleEn: "Variants, Properties & Variables", titleBn: "ভেরিয়েন্ট এবং টুলস" },
          { titleEn: "Building an Atomic Design System", titleBn: "অ্যাটমিক ডিজাইন সিস্টেম" },
          { titleEn: "Dark Mode & Theming Architecture", titleBn: "ডার্ক মোড এবং থিমিং" }
        ]
      },
      {
        titleEn: "SaaS Dashboard & Data UX",
        titleBn: "ড্যাশবোর্ড এবং ডেটা UX",
        summaryEn: "Simplifying dense analytics, large tables, and complicated forms.",
        summaryBn: "জটিল ডেটা, টেবিল এবং ফর্মগুলোকে ব্যবহারবান্ধব করা।",
        lessons: [
          { titleEn: "Data Table UX (Filters, Bulk Actions)", titleBn: "ডেটা টেবিল UX ডিজাইন" },
          { titleEn: "Graphs & Visualization Hierarchies", titleBn: "গ্রাফস এবং ভিজ্যুয়ালাইজেশন" },
          { titleEn: "Empty States & Error Recoveries", titleBn: "এমপ্টি স্টেট ও এরর রিকভারি" }
        ]
      },
      {
        titleEn: "Prototyping & Developer Handoff",
        titleBn: "প্রোটোটাইপ এবং ডেভেলপার হ্যান্ডঅফ",
        summaryEn: "Communicating interactions visually and technically to engineering teams.",
        summaryBn: "ইঞ্জিনিয়ারিং টিমের কাছে ডিজাইন সঠিকভাবে হস্তান্তর করা।",
        lessons: [
          { titleEn: "Interactive Figma Prototyping", titleBn: "ইন্টারঅ্যাকটিভ প্রোটোটাইপিং" },
          { titleEn: "Micro-interactions & State Changes", titleBn: "অ্যানিমেশন ও স্টেট পরিবর্তন" },
          { titleEn: "Design Spec Documentation", titleBn: "ডিজাইন স্পেক তৈরি" }
        ]
      }
    ]
  },
  {
    subdeptId: "graphic",
    deptId: "design",
    titleBn: "ব্র্যান্ড ও কন্টেন্ট ডিজাইনার",
    titleEn: "Brand & Content Designer",
    descBn: "SaaS প্রোডাক্টের ভিজ্যুয়াল আইডেন্টিটি, মার্কেটিং ম্যাটেরিয়াল এবং সোশ্যাল ক্যাম্পেইন তৈরি করা।",
    descEn: "Forge SaaS visual identities, marketing materials, and high-conversion social campaigns.",
    level: "Beginner/Intermediate",
    duration: "30h+",
    prereqBn: "ইলাস্ট্রেটর, ফটোশপ-এ ভালো কাজ জানা এবং ক্রিয়েটিভ থিংকিং।",
    prereqEn: "Proficiency in Illustrator/Photoshop and creative thinking.",
    outcomesBn: [
      "B2B ব্র্যান্ড আইডেন্টিটি গাইড তৈরি",
      "সোশ্যাল মিডিয়া টেমপ্লেট সিস্টেম",
      "পেইড অ্যাডের জন্য ক্রিয়েটিভস",
      "প্রেজেন্টেশন এবং ল্যান্ডিং পেজ অ্যাসেট"
    ],
    outcomesEn: [
      "B2B Brand Identity construction",
      "Scalable social media templates",
      "High-conversion performance ad creatives",
      "Presentation and landing page assets"
    ],
    modules: [
      {
        titleEn: "B2B Brand System Logic",
        titleBn: "B2B ব্র্যান্ড সিস্টেম",
        summaryEn: "Creating strict visual identities that communicate software trust.",
        summaryBn: "ভোক্তাদের আস্থা অর্জনের লক্ষে শক্তিশালী ভিজ্যুয়াল আইডেন্টিটি তৈরি।",
        lessons: [
          { titleEn: "Software Logo & Iconography Theory", titleBn: "লোগো এবং আইকনোগ্রাফি থিওরি" },
          { titleEn: "Typography for readability & trust", titleBn: "টাইপোগ্রাফি সিলেকশন" },
          { titleEn: "Brand Color Psychology in SaaS", titleBn: "SaaS কালার সাইকোলজি" }
        ]
      },
      {
        titleEn: "Content & Assets Generation",
        titleBn: "কন্টেন্ট এবং ব্র্যান্ড অ্যাসেট",
        summaryEn: "Scalable asset generation for consistent marketing pipelines.",
        summaryBn: "মার্কেটিং পাইপলাইনের জন্য স্কেলেবল অ্যাসেট বানানো।",
        lessons: [
          { titleEn: "Social Media Grid & Template Systems", titleBn: "সোশ্যাল মিডিয়া টেমপ্লেট" },
          { titleEn: "Pitch Decks & Proposal Design Themes", titleBn: "প্রেজেন্টেশন ডিজাইন" },
          { titleEn: "Blog Covers & Newsletter Graphics", titleBn: "ব্লগ ও নিউজলেটার গ্রাফিক্স" }
        ]
      },
      {
        titleEn: "Performance Ad Creatives",
        titleBn: "মার্কেটিং ক্রিয়েটিভস",
        summaryEn: "Designing graphical ads strictly focused on CTR and conversion.",
        summaryBn: "ক্লিক ও কনভার্শন রেট বাড়াতে গ্রাফিক্যাল অ্যাড ডিজাইন।",
        lessons: [
          { titleEn: "LinkedIn & Meta Ad Constraints", titleBn: "অ্যাড প্ল্যাটফর্মের রুলস" },
          { titleEn: "A/B Testing Creatives Methodology", titleBn: "A/B টেস্টিং মেথডোলজি" },
          { titleEn: "Visual Hooks & Typography in Ads", titleBn: "অ্যাডে ভিজ্যুয়াল হুক" }
        ]
      }
    ]
  },
  {
    subdeptId: "ba",
    deptId: "product",
    titleBn: "বিজনেস অ্যানালিস্ট (SaaS)",
    titleEn: "Business Analyst (SaaS)",
    descBn: "সফটওয়্যারের রিকোয়ারমেন্ট, প্রসেস ফ্লো অ্যানালাইসিস এবং স্টেকহোল্ডার কমিউনিকেশন মেইনটেইন করা।",
    descEn: "Bridge the gap between business needs and software outcomes through documentation.",
    level: "All Levels",
    duration: "30h+",
    prereqBn: "অ্যানালিটিকাল থিংকিং এবং শক্তিশালী ডকুমেন্টিং দক্ষতা।",
    prereqEn: "Analytical logic and clear documentation skills.",
    outcomesBn: [
      "সলিড BRD ও FRD ডকুমেন্ট ডেলিভারি",
      "জটিল বিজনেস লজিকের প্রসেস ম্যাপিং",
      "ডেভেলপারদের জন্য ইউজার স্টোরি তৈরি",
      "প্রোডাক্ট ও ক্লায়েন্টের গ্যাপ কমানো"
    ],
    outcomesEn: [
      "Solid BRD & FRD delivery",
      "Complex business logic process mapping",
      "Actionable developer user stories",
      "Closing product/client expectation gaps"
    ],
    modules: [
      {
        titleEn: "Requirement Engineering Frameworks",
        titleBn: "রিকোয়ারমেন্ট ইঞ্জিনিয়ারিং",
        summaryEn: "Extracting exact software needs from vague human requests.",
        summaryBn: "অস্পষ্ট ধারণা থেকে সফটওয়্যার লজিক উদ্ধার করা।",
        lessons: [
          { titleEn: "Stakeholder Interviews & Documentation", titleBn: "স্টেকহোল্ডার ইন্টারভিউ" },
          { titleEn: "Writing Business Requirement Docs (BRD)", titleBn: "BRD ডকুমেন্টিং" },
          { titleEn: "Functional vs Non-Functional Specs", titleBn: "ফাংশনাল স্পেসিফিকেশন" }
        ]
      },
      {
        titleEn: "Process Workflow Mapping",
        titleBn: "প্রসেস ডায়াগ্রাম ম্যাপিং",
        summaryEn: "Translating business processes into diagram logic for engineering.",
        summaryBn: "বিজনেস অপারেশনকে ইঞ্জিনিয়ারিং ডায়াগ্রামে রূপান্তর।",
        lessons: [
          { titleEn: "UML Basics & Use Case Diagrams", titleBn: "UML এবং ইউজ কেস ডায়াগ্রাম" },
          { titleEn: "BPMN Process Flows (Lucid/Draw.io)", titleBn: "প্রসেস ফ্লো ডায়াগ্রাম" },
          { titleEn: "Data Flow Diagramming", titleBn: "ডাটা ফ্লো ভিজ্যুয়ালাইজেশন" }
        ]
      },
      {
        titleEn: "Execution Delivery & Agile",
        titleBn: "এক্সিকিউশন এবং এজাইল",
        summaryEn: "Feeding clear instructions into the software development sprints.",
        summaryBn: "সফটওয়্যার টিমের মধ্যে সঠিক কাজের ইনস্ট্রাকশন পাস করা।",
        lessons: [
          { titleEn: "Writing Epic & User Stories (INVEST)", titleBn: "ইউজার স্টোরি লেখা" },
          { titleEn: "Acceptance Criteria Structuring", titleBn: "অ্যাক্সেপ্টেন্স ক্রাইটেরিয়া গঠন" },
          { titleEn: "Backlog Refinement Sessions", titleBn: "ব্যাকলগ রিফাইনমেন্ট" }
        ]
      }
    ]
  },
  {
    subdeptId: "pm",
    deptId: "product",
    titleBn: "প্রোডাক্ট ম্যানেজার (SaaS)",
    titleEn: "Product Manager (SaaS)",
    descBn: "প্রোডাক্টের রোডম্যাপ, স্প্রিন্ট প্ল্যানিং এবং ইউজার গ্রোথের পূর্ণ নিয়ন্ত্রণ।",
    descEn: "Take ultimate ownership of product roadmaps, sprint execution, and user KPIs.",
    level: "Advanced",
    duration: "40h+",
    prereqBn: "সফটওয়্যার ইন্ডাস্ট্রি, লিডারশিপ এবং প্রজেক্ট ম্যানেজমেন্টের বেসিক জ্ঞান।",
    prereqEn: "Deep understanding of the software industry, leadership, and project execution.",
    outcomesBn: [
      "প্রোডাক্ট ভিশন এবং OKR সেটআপ",
      "রিলিজ ট্র্যাকিং ও এজাইল ম্যানেজমেন্ট",
      "প্রোডাক্ট মেট্রিক্স (PLG) অ্যানালাইসিস",
      "ডেভেলপমেন্ট ও মার্কেটিং এলাইনমেন্ট"
    ],
    outcomesEn: [
      "Product vision & OKR planning",
      "Release tracking & Agile management",
      "Product metrics (PLG) analysis",
      "Cross-functional team alignment"
    ],
    modules: [
      {
        titleEn: "Product Vision & SaaS Strategy",
        titleBn: "প্রোডাক্ট ভিশন এবং স্ট্র্যাটেজি",
        summaryEn: "Building the high-level roadmap aligned with company funding/goals.",
        summaryBn: "কোম্পানির লক্ষ্যের সাথে মিলিয়ে হাই-লেভেল রোডম্যাপ তৈরি।",
        lessons: [
          { titleEn: "Product-Market Fit Analysis", titleBn: "প্রোডাক্ট-মার্কেট ফিট অ্যানালাইসিস" },
          { titleEn: "Setting OKRs & KPIs", titleBn: "OKR এবং KPI সেটআপ" },
          { titleEn: "Roadmap Structuring (Now/Next/Later)", titleBn: "রোডম্যাপ ফ্রেমওয়ার্ক" },
          { titleEn: "Competitor Market Positioning", titleBn: "কম্পিটিটর পজিশনিং" }
        ]
      },
      {
        titleEn: "Prioritization Mechanisms",
        titleBn: "প্রায়োরিটি মেকানিজম",
        summaryEn: "Deciding exactly what to build next to maximize impact.",
        summaryBn: "কী বানালে সবচেয়ে বেশি ফলাফল আসবে, তা ঠিক করা।",
        lessons: [
          { titleEn: "RICE Formulation Strategy", titleBn: "RICE ফ্রেমওয়ার্ক মেথড" },
          { titleEn: "MoSCoW Prioritization", titleBn: "MoSCoW প্রায়োরিটাইজেশন" },
          { titleEn: "Managing the Master Backlog", titleBn: "মাস্টার ব্যাকলগ মেইনটেনেন্স" }
        ]
      },
      {
        titleEn: "Agile Rituals & Delivery Management",
        titleBn: "এজাইল এবং প্রজেক্ট ডেলিভারি",
        summaryEn: "Guiding the dev team from ticket creation to production release.",
        summaryBn: "টিকেট তৈরি থেকে শুরু করে প্রডাকশন রিলিজ পর্যন্ত সম্পূর্ণ নিয়ন্ত্রণ।",
        lessons: [
          { titleEn: "Sprint Planning & Standups", titleBn: "স্প্রিন্ট প্ল্যানিং ও স্ট্যান্ডআপ" },
          { titleEn: "Managing Velocity & Scope Creep", titleBn: "স্কোপ ক্রিপ ম্যানেজমেন্ট" },
          { titleEn: "Release Notes & Version Checklists", titleBn: "রিলিজ নোটস ও চেকলিস্ট" }
        ]
      },
      {
        titleEn: "Growth & Product-Led Mechanics",
        titleBn: "প্রোডাক্ট-লেড গ্রোথ (PLG)",
        summaryEn: "Using the software itself to acquire and retain new B2B users.",
        summaryBn: "সফটওয়্যারের ফিচারের মাধ্যমে নতুন ইউজার অ্যাকুইজিশন এবং রিটেনশন।",
        lessons: [
          { titleEn: "PLG vs SLG Concepts", titleBn: "PLG বনাম SLG" },
          { titleEn: "Frictionless Onboarding Funnels", titleBn: "অনবোর্ডিং ফানেল অপটিমাইজেশন" },
          { titleEn: "User Heatmaps & Behavior Analytics", titleBn: "ইউজার বিহেভিয়ার অ্যানালিটিক্স" }
        ]
      }
    ]
  },
  {
    subdeptId: "growth",
    deptId: "marketing",
    titleBn: "গ্রোথ মার্কেটিং (SaaS)",
    titleEn: "Growth Marketing (SaaS)",
    descBn: "বিটুবি লিড জেনারেশন, এসইও এবং ডেটা-ড্রিভেন পারফরম্যান্স ক্যাম্পেইন মেইনটেইন করা।",
    descEn: "B2B lead generation, technical SEO, and massive data-driven ad operations.",
    level: "Intermediate",
    duration: "40h+",
    prereqBn: "মার্কেটিং কনসেপ্টস, অ্যানালিটিক্স এবং ডিজিটাল ফানেলের জ্ঞান।",
    prereqEn: "Concepts of marketing, analytics data logic, and digital funnels.",
    outcomesBn: [
      "অ্যাডভান্সড B2B SEO এবং কন্টেন্ট ক্লাস্টার ফ্লো",
      "পাবলিক অ্যাড ক্যাম্পেইন এবং লিড ক্যাপচার",
      "কনভার্শন রেট অপটিমাইজেশন (CRO)",
      "পারফরম্যান্স ডেটা অ্যানালাইসিস"
    ],
    outcomesEn: [
      "Advanced B2B SEO & Content cluster flow",
      "Public ad campaigns and B2B lead capture",
      "Conversion Rate Optimization (CRO)",
      "Performance data attribution"
    ],
    modules: [
      {
        titleEn: "Inbound: B2B SEO & Content",
        titleBn: "ইনবাউন্ড: B2B SEO ও কন্টেন্ট",
        summaryEn: "Creating organic moats that bring SaaS buyers reliably every month.",
        summaryBn: "অর্গানিক্যালি মান্থলি ট্রাফিক এবং পেইং ক্রেতা আনা।",
        lessons: [
          { titleEn: "High-Intent Keyword Research", titleBn: "হাই-ইনটেন্ট কিওয়ার্ড রিসার্চ" },
          { titleEn: "Topic Clusters & Pillar Pages", titleBn: "কন্টেন্ট Клаস্টার স্ট্র্যাটেজি" },
          { titleEn: "On-page & Technical SEO checks", titleBn: "টেকনিক্যাল SEO চেকলিস্ট" },
          { titleEn: "Link Building for SaaS Authority", titleBn: "SaaS লিড জেনারেশন ব্যাকলিংক" }
        ]
      },
      {
        titleEn: "Performance Acquisition (Paid)",
        titleBn: "পারফরম্যান্স অ্যাড ক্যাম্পেইন",
        summaryEn: "Executing high-budget spending on LinkedIn, Meta, and Google for leads.",
        summaryBn: "লিড সংগ্রহের জন্য পেইড অ্যাড ক্যাম্পেইন রান করা।",
        lessons: [
          { titleEn: "Google Search & Intent Targeting", titleBn: "সার্চ ইন্টেন্ট টার্গেটিং" },
          { titleEn: "LinkedIn B2B Audience Matcing", titleBn: "B2B অডিয়েন্স টার্গেটিং" },
          { titleEn: "Retargeting & Pixel Setup", titleBn: "রিটার্গেটিং ও ট্র্যাকিং পিক্সেল" }
        ]
      },
      {
        titleEn: "Funnel Conversion & CRO",
        titleBn: "ফানেল এবং কনভার্শন রেট",
        summaryEn: "Designing landing pages that psychologically force a software trial.",
        summaryBn: "ল্যান্ডিং পেজ অপটিমাইজ করে ট্রায়াল সাইনআপ বাড়ানো।",
        lessons: [
          { titleEn: "Landing Page Copywriting Formulas", titleBn: "কপিরাইটিং ফর্মুলা" },
          { titleEn: "A/B Split Testing Workflows", titleBn: "A/B স্প্লিট টেস্টিং" },
          { titleEn: "Email Nurture Sequences", titleBn: "ইমেইল নার্চার সিকোয়েন্স" }
        ]
      },
      {
        titleEn: "Data Analytics & Reporting",
        titleBn: "অ্যানালিটিক্স এবং রিপোর্টিং",
        summaryEn: "Tracking exact CPAs and LTV to prove marketing investment works.",
        summaryBn: "মার্কেটিং ইনভেস্টমেন্টের সঠিক ফলাফল ডেটার মাধ্যমে প্রমাণ করা।",
        lessons: [
          { titleEn: "GA4 Configuration & Events", titleBn: "Google Analytics 4 ইভেন্ট ট্র্যাকিং" },
          { titleEn: "CAC vs LTV SaaS Economics", titleBn: "SaaS ইকোনমিক্স ক্যালকুলেশন" },
          { titleEn: "Marketing Dashboards (Looker Studio)", titleBn: "অ্যানালিটিক্স ড্যাশবোর্ড" }
        ]
      }
    ]
  },
  {
    subdeptId: "success",
    deptId: "marketing",
    titleBn: "কাস্টমার সাকসেস (SaaS)",
    titleEn: "Customer Success (SaaS)",
    descBn: "গ্রাহককে সফলভাবে অনবোর্ড করা, তাদের সমস্যা সমাধান এবং চ্যার্ন (Churn) রোধ করা।",
    descEn: "Onboard clients, resolve critical tickets, and prevent monthly revenue churn.",
    level: "Beginner/Intermediate",
    duration: "30h+",
    prereqBn: "প্রচণ্ড ধৈর্য, শক্তিশালী যোগাযোগ দক্ষতা এবং সফ্টওয়্যারের কার্যকারিতা বোঝার ক্ষমতা।",
    prereqEn: "High empathy, strict communication skills, and software operational insight.",
    outcomesBn: [
      "সফল সফটওয়্যার অনবোর্ডিং প্রসেস",
      "টিকেটিং ও SLA মেইনটেনেন্স",
      "রিটেনশন স্ট্র্যাটেজি এবং QBR রান করা",
      "CRM ডেটা ক্লিনিং ও অর্গানাইজ করা"
    ],
    outcomesEn: [
      "Successful software onboarding process",
      "Ticketing & SLA protocol maintenance",
      "Retention strategies & QBRs tracking",
      "CRM pipeline organization"
    ],
    modules: [
      {
        titleEn: "SaaS Onboarding Fundamentals",
        titleBn: "SaaS অনবোর্ডিং ফান্ডামেন্টাল",
        summaryEn: "Guiding new customers to their 'Aha!' moment instantly after checkout.",
        summaryBn: "কেনার পর কাস্টমারকে দ্রুত সফটওয়্যারের আসল ভ্যালু বুঝিয়ে দেওয়া।",
        lessons: [
          { titleEn: "The 'Aha' Moment Identification", titleBn: "অ্যাহা মুভমেন্ট আইডেন্টিফিকেশন" },
          { titleEn: "Onboarding Checklists & Flows", titleBn: "অনবোর্ডিং চেকলিস্ট ডিকোড" },
          { titleEn: "Implementing Product Tours", titleBn: "প্রোডাক্ট ট্যুর ইমপ্লিমেন্টেশন" }
        ]
      },
      {
        titleEn: "CRM & Support Operations",
        titleBn: "CRM এবং সাপোর্ট অপারেশন",
        summaryEn: "Handling mass requests efficiently using SLA policies and ticketing structures.",
        summaryBn: "টিকেটিং স্ট্রাকচার এবং পলিসি দিয়ে শত শত রিকোয়েস্ট ম্যানেজ করা।",
        lessons: [
          { titleEn: "Ticketing Triage & Priority Rules", titleBn: "টিকেট প্রায়োরিটি রুলস" },
          { titleEn: "SLA (Service Level Agreement) Tracking", titleBn: "SLA ট্র্যাকিং ও কমপ্লায়েন্স" },
          { titleEn: "CRM Deal Stages & Tagging Hygiene", titleBn: "CRM ট্যাগিং এবং ডেটা হাইজিন" }
        ]
      },
      {
        titleEn: "Retention & Churn Analytics",
        titleBn: "রিটেনশন এবং চার্ন মেকানিক্স",
        summaryEn: "Identifying accounts that are about to cancel and saving them proactively.",
        summaryBn: "সাবস্ক্রিপশন ক্যান্সেল করার আগেই কাস্টমারকে ফাইন্ড আউট করে ধরে রাখা।",
        lessons: [
          { titleEn: "Churn Calculation Metrics", titleBn: "চার্ন রেট ক্যালকুলেশন" },
          { titleEn: "Health Scoring Models", titleBn: "কাস্টমার হেলথ স্কোরিং" },
          { titleEn: "Quarterly Business Reviews (QBRs)", titleBn: "QBR मीटिंग স্ট্রাকচার" }
        ]
      }
    ]
  }
];

fs.writeFileSync(path.join(process.cwd(), "landing/src/data/departments.json"), JSON.stringify(data, null, 2));

console.log("Successfully seeded deep SaaS roadmaps directly to departments.json!");
