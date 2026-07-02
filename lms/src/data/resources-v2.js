import { ROADMAPS_V2 } from "./roadmaps-v2";

export const TRACK_META = {
  engineering: {
    en: "Software Engineering",
    bn: "সফটওয়্যার ইঞ্জিনিয়ারিং",
    tracks: {
      frontend: { en: "Frontend (React/Next.js)", bn: "ফ্রন্টএন্ড (React/Next.js)" },
      backend: { en: "Backend (Laravel/Node.js)", bn: "ব্যাকএন্ড (Laravel/Node.js)" },
      devops: { en: "DevOps & QA", bn: "DevOps ও QA" }
    }
  },
  design: {
    en: "UI/UX & Design",
    bn: "UI/UX ও ডিজাইন",
    tracks: {
      ux: { en: "UI/UX (Figma)", bn: "UI/UX (Figma)" },
      graphic: { en: "Graphic & Social Design", bn: "গ্রাফিক ও সোশ্যাল ডিজাইন" }
    }
  },
  product: {
    en: "Product & Business Analysis",
    bn: "প্রোডাক্ট ও বিজনেস অ্যানালাইসিস",
    tracks: {
      ba: { en: "Business Analysis", bn: "বিজনেস অ্যানালাইসিস" },
      pm: { en: "Product Management", bn: "প্রোডাক্ট ম্যানেজমেন্ট" }
    }
  },
  marketing: {
    en: "Marketing & Customer Success",
    bn: "মার্কেটিং ও কাস্টমার সাকসেস",
    tracks: {
      growth: { en: "Growth Marketing", bn: "গ্রোথ মার্কেটিং" },
      success: { en: "Customer Success", bn: "কাস্টমার সাকসেস" }
    }
  }
};

const RESOURCE_LIBRARY = {
  generalLearning: [
    {
      title: "Learn with Sumit",
      url: "https://learnwithsumit.com/",
      author: "Learn with Sumit",
      type: "Platform",
      lang: "bn",
      description: "Beginner-friendly Bangla learning platform for web and software skills.",
      free: true
    },
    {
      title: "freeCodeCamp Learning Paths",
      url: "https://www.freecodecamp.org/learn",
      author: "freeCodeCamp",
      type: "Course",
      lang: "en",
      description: "Structured free tracks for coding, web development, and data skills.",
      free: true
    },
    {
      title: "Google for Developers Learning",
      url: "https://developers.google.com/learn",
      author: "Google",
      type: "Docs",
      lang: "en",
      description: "Official guided learning content across web, cloud, and analytics.",
      free: true
    }
  ],
  webFoundation: [
    {
      title: "MDN: Structuring Content with HTML",
      url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content",
      author: "MDN",
      type: "Docs",
      lang: "en",
      description: "Semantic HTML and practical page structure from official web docs.",
      free: true
    },
    {
      title: "MDN: CSS Styling Basics",
      url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics",
      author: "MDN",
      type: "Docs",
      lang: "en",
      description: "Core CSS rules, box model, and layout fundamentals.",
      free: true
    },
    {
      title: "JavaScript Tutorial (Bangla)",
      url: "https://www.youtube.com/playlist?list=PLHiZ4m8vCp9OkrORAAaaKklq9r520rY3n",
      author: "Stack Learner",
      type: "YouTube",
      lang: "bn",
      description: "JavaScript concepts explained in simple Bangla with examples.",
      free: true
    }
  ],
  reactNext: [
    {
      title: "React Documentation",
      url: "https://react.dev/learn",
      author: "React Team",
      type: "Docs",
      lang: "en",
      description: "Official React learning path with hooks and component patterns.",
      free: true
    },
    {
      title: "Next.js Documentation",
      url: "https://nextjs.org/docs",
      author: "Vercel",
      type: "Docs",
      lang: "en",
      description: "Official Next.js docs including App Router, data fetching, and deployment.",
      free: true
    },
    {
      title: "React JS Tutorial in Bangla",
      url: "https://www.youtube.com/playlist?list=PLgH5QX0i9K3pjm4KLAFzQ0ylI4YjJ0_fN",
      author: "Learn with Sumit",
      type: "YouTube",
      lang: "bn",
      description: "Hands-on React series in Bangla for beginners.",
      free: true
    }
  ],
  stateAndData: [
    {
      title: "Redux Toolkit Documentation",
      url: "https://redux-toolkit.js.org/introduction/getting-started",
      author: "Redux Team",
      type: "Docs",
      lang: "en",
      description: "Official guide to scalable state management using Redux Toolkit.",
      free: true
    },
    {
      title: "Zustand Documentation",
      url: "https://zustand.docs.pmnd.rs/getting-started/introduction",
      author: "pmndrs",
      type: "Docs",
      lang: "en",
      description: "Lightweight state management patterns with practical examples.",
      free: true
    },
    {
      title: "TanStack Query Documentation",
      url: "https://tanstack.com/query/latest/docs/framework/react/overview",
      author: "TanStack",
      type: "Docs",
      lang: "en",
      description: "Server state, caching, and async data patterns for React apps.",
      free: true
    }
  ],
  stylingAndUI: [
    {
      title: "Tailwind CSS Documentation",
      url: "https://tailwindcss.com/docs",
      author: "Tailwind Labs",
      type: "Docs",
      lang: "en",
      description: "Utility-first styling, theming, and responsive UI building.",
      free: true
    },
    {
      title: "web.dev: Responsive Design",
      url: "https://web.dev/learn/design/",
      author: "web.dev",
      type: "Docs",
      lang: "en",
      description: "Practical responsive design lessons for modern devices.",
      free: true
    },
    {
      title: "Tailwind CSS Bangla Tutorial",
      url: "https://www.youtube.com/results?search_query=tailwind+css+bangla+tutorial",
      author: "YouTube",
      type: "YouTube",
      lang: "bn",
      description: "Bangla walkthroughs for Tailwind UI building.",
      free: true
    }
  ],
  performanceAndA11y: [
    {
      title: "web.dev Core Web Vitals",
      url: "https://web.dev/vitals/",
      author: "web.dev",
      type: "Docs",
      lang: "en",
      description: "Performance metrics and practical speed optimization guidance.",
      free: true
    },
    {
      title: "Lighthouse Overview",
      url: "https://developer.chrome.com/docs/lighthouse/overview/",
      author: "Chrome Developers",
      type: "Docs",
      lang: "en",
      description: "Measure performance, accessibility, and best practices.",
      free: true
    },
    {
      title: "WCAG 2.2 Guidelines",
      url: "https://www.w3.org/TR/WCAG22/",
      author: "W3C",
      type: "Docs",
      lang: "en",
      description: "Accessibility rules to make products usable for everyone.",
      free: true
    }
  ],
  testingAndCi: [
    {
      title: "Jest Documentation",
      url: "https://jestjs.io/docs/getting-started",
      author: "Jest",
      type: "Docs",
      lang: "en",
      description: "Unit testing setup, assertions, and mocking basics.",
      free: true
    },
    {
      title: "React Testing Library",
      url: "https://testing-library.com/docs/react-testing-library/intro/",
      author: "Testing Library",
      type: "Docs",
      lang: "en",
      description: "Write user-focused frontend tests for reliable UI.",
      free: true
    },
    {
      title: "GitHub Actions Documentation",
      url: "https://docs.github.com/en/actions",
      author: "GitHub",
      type: "Docs",
      lang: "en",
      description: "Automate build, test, and deploy workflows.",
      free: true
    }
  ],
  storybookAndHandoff: [
    {
      title: "Storybook Documentation",
      url: "https://storybook.js.org/docs",
      author: "Storybook",
      type: "Docs",
      lang: "en",
      description: "Build and document reusable UI components.",
      free: true
    },
    {
      title: "Figma Developer Handoff",
      url: "https://help.figma.com/hc/en-us/articles/360040028114",
      author: "Figma",
      type: "Docs",
      lang: "en",
      description: "Best practices for design-to-development handoff.",
      free: true
    },
    {
      title: "Open Source Guide",
      url: "https://opensource.guide/how-to-contribute/",
      author: "GitHub",
      type: "Docs",
      lang: "en",
      description: "Practical guide to start open-source contributions.",
      free: true
    }
  ],
  backendApi: [
    {
      title: "Node.js Documentation",
      url: "https://nodejs.org/en/docs",
      author: "Node.js",
      type: "Docs",
      lang: "en",
      description: "Official Node.js runtime docs and APIs.",
      free: true
    },
    {
      title: "Express Guide",
      url: "https://expressjs.com/en/guide/routing.html",
      author: "Express",
      type: "Docs",
      lang: "en",
      description: "Routing and backend API structure with Express.",
      free: true
    },
    {
      title: "Node.js Tutorial in Bangla",
      url: "https://www.youtube.com/playlist?list=PLgH5QX0i9K3qjmCBJ7L9W8-T9-N_yUuub",
      author: "Learn with Sumit",
      type: "YouTube",
      lang: "bn",
      description: "Bangla backend basics using Node.js.",
      free: true
    }
  ],
  dataAndDb: [
    {
      title: "PostgreSQL Documentation",
      url: "https://www.postgresql.org/docs/current/",
      author: "PostgreSQL",
      type: "Docs",
      lang: "en",
      description: "Data modeling, indexing, and query optimization from official docs.",
      free: true
    },
    {
      title: "Prisma Documentation",
      url: "https://www.prisma.io/docs",
      author: "Prisma",
      type: "Docs",
      lang: "en",
      description: "Modern ORM workflows for schema and query development.",
      free: true
    },
    {
      title: "SQL Tutorial",
      url: "https://www.w3schools.com/sql/",
      author: "W3Schools",
      type: "Docs",
      lang: "en",
      description: "Quick SQL fundamentals for beginners.",
      free: true
    }
  ],
  authAndSecurity: [
    {
      title: "OWASP Authentication Cheat Sheet",
      url: "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html",
      author: "OWASP",
      type: "Docs",
      lang: "en",
      description: "Trusted security guidelines for authentication and access control.",
      free: true
    },
    {
      title: "JSON Web Token Introduction",
      url: "https://auth0.com/docs/secure/tokens/json-web-tokens",
      author: "Auth0",
      type: "Docs",
      lang: "en",
      description: "Simple explanation of JWT-based auth flows.",
      free: true
    },
    {
      title: "Laravel Authentication",
      url: "https://laravel.com/docs/12.x/authentication",
      author: "Laravel",
      type: "Docs",
      lang: "en",
      description: "Authentication patterns in Laravel apps.",
      free: true
    }
  ],
  laravelAndPhp: [
    {
      title: "Laravel Documentation",
      url: "https://laravel.com/docs",
      author: "Laravel",
      type: "Docs",
      lang: "en",
      description: "Official Laravel guide for routing, ORM, and backend architecture.",
      free: true
    },
    {
      title: "Eloquent Relationships",
      url: "https://laravel.com/docs/12.x/eloquent-relationships",
      author: "Laravel",
      type: "Docs",
      lang: "en",
      description: "Relationship modeling patterns for scalable backend data.",
      free: true
    },
    {
      title: "Laravel Bangla Tutorial",
      url: "https://www.youtube.com/playlist?list=PLNdtf8iO0wM0iXh-2I_gK0fD6v3N-4m87",
      author: "Rabbil Hasan",
      type: "YouTube",
      lang: "bn",
      description: "Bangla Laravel series with practical project examples.",
      free: true
    }
  ],
  backendScale: [
    {
      title: "Redis Documentation",
      url: "https://redis.io/docs/latest/",
      author: "Redis",
      type: "Docs",
      lang: "en",
      description: "Caching and fast data access patterns for web backends.",
      free: true
    },
    {
      title: "Laravel Queues",
      url: "https://laravel.com/docs/12.x/queues",
      author: "Laravel",
      type: "Docs",
      lang: "en",
      description: "Background jobs and queue workers for heavy tasks.",
      free: true
    },
    {
      title: "Laravel Notifications",
      url: "https://laravel.com/docs/12.x/notifications",
      author: "Laravel",
      type: "Docs",
      lang: "en",
      description: "Send email/SMS/in-app notifications from backend systems.",
      free: true
    }
  ],
  paymentsAndDeploy: [
    {
      title: "Stripe Documentation",
      url: "https://docs.stripe.com",
      author: "Stripe",
      type: "Docs",
      lang: "en",
      description: "Official API docs for payment integration.",
      free: true
    },
    {
      title: "SSLCommerz Developer API",
      url: "https://developer.sslcommerz.com/",
      author: "SSLCommerz",
      type: "Docs",
      lang: "en",
      description: "Bangladesh-focused payment gateway integration reference.",
      free: true
    },
    {
      title: "Docker Get Started",
      url: "https://docs.docker.com/get-started/",
      author: "Docker",
      type: "Docs",
      lang: "en",
      description: "Container-based deployment setup for apps and services.",
      free: true
    }
  ],
  devopsOps: [
    {
      title: "GitHub Actions",
      url: "https://docs.github.com/en/actions",
      author: "GitHub",
      type: "Docs",
      lang: "en",
      description: "Build CI/CD pipelines and automated workflows.",
      free: true
    },
    {
      title: "Kubernetes Documentation",
      url: "https://kubernetes.io/docs/home/",
      author: "Kubernetes",
      type: "Docs",
      lang: "en",
      description: "Container orchestration, rollout strategy, and reliability basics.",
      free: true
    },
    {
      title: "AWS Well-Architected Framework",
      url: "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html",
      author: "AWS",
      type: "Docs",
      lang: "en",
      description: "Reliability, security, and cost best practices for production systems.",
      free: true
    }
  ],
  observability: [
    {
      title: "OpenTelemetry Documentation",
      url: "https://opentelemetry.io/docs/",
      author: "OpenTelemetry",
      type: "Docs",
      lang: "en",
      description: "Tracing, metrics, and logs instrumentation standards.",
      free: true
    },
    {
      title: "Prometheus Overview",
      url: "https://prometheus.io/docs/introduction/overview/",
      author: "Prometheus",
      type: "Docs",
      lang: "en",
      description: "Metrics monitoring and alerting for services and infrastructure.",
      free: true
    },
    {
      title: "Grafana Documentation",
      url: "https://grafana.com/docs/grafana/latest/",
      author: "Grafana",
      type: "Docs",
      lang: "en",
      description: "Build dashboards and visualize operational signals.",
      free: true
    }
  ],
  uxResearch: [
    {
      title: "NN/g Research Methods",
      url: "https://www.nngroup.com/articles/which-ux-research-methods/",
      author: "Nielsen Norman Group",
      type: "Article",
      lang: "en",
      description: "Practical UX research methods and when to use each.",
      free: true
    },
    {
      title: "Laws of UX",
      url: "https://lawsofux.com/",
      author: "Jon Yablonski",
      type: "Docs",
      lang: "en",
      description: "Simple UX principles to improve clarity and usability.",
      free: true
    },
    {
      title: "UI/UX Design Bangla Tutorial",
      url: "https://www.youtube.com/playlist?list=PLgH5QX0i9K3oJc9s78Mv3m1mXvU4R86_W",
      author: "Learn with Sumit",
      type: "YouTube",
      lang: "bn",
      description: "Bangla UX concepts and practical design workflows.",
      free: true
    }
  ],
  figmaAndPrototype: [
    {
      title: "Figma Learn",
      url: "https://help.figma.com/hc/en-us/categories/360002051613-Design",
      author: "Figma",
      type: "Docs",
      lang: "en",
      description: "Official Figma design lessons for components and layouts.",
      free: true
    },
    {
      title: "Figma Prototyping",
      url: "https://help.figma.com/hc/en-us/articles/360040314193",
      author: "Figma",
      type: "Docs",
      lang: "en",
      description: "Build interactive prototypes and user flows in Figma.",
      free: true
    },
    {
      title: "Figma Bangla Tutorial",
      url: "https://www.youtube.com/watch?v=B9JkG-W-5aU",
      author: "Ali Hossain",
      type: "YouTube",
      lang: "bn",
      description: "Bangla intro for Figma basics and practical project setup.",
      free: true
    }
  ],
  visualDesign: [
    {
      title: "Material Design Foundations",
      url: "https://m3.material.io/foundations",
      author: "Google",
      type: "Docs",
      lang: "en",
      description: "Color, typography, spacing, and layout principles.",
      free: true
    },
    {
      title: "WebAIM Contrast Checker",
      url: "https://webaim.org/resources/contrastchecker/",
      author: "WebAIM",
      type: "Tool",
      lang: "en",
      description: "Check color contrast for readable and accessible UI.",
      free: true
    },
    {
      title: "Adobe Color",
      url: "https://color.adobe.com/",
      author: "Adobe",
      type: "Tool",
      lang: "en",
      description: "Build harmonious color palettes for brand and UI.",
      free: true
    }
  ],
  designSystems: [
    {
      title: "WAI-ARIA Authoring Practices",
      url: "https://www.w3.org/WAI/ARIA/apg/",
      author: "W3C",
      type: "Docs",
      lang: "en",
      description: "Accessible component patterns for design systems.",
      free: true
    },
    {
      title: "Figma Auto Layout",
      url: "https://help.figma.com/hc/en-us/articles/360040451373",
      author: "Figma",
      type: "Docs",
      lang: "en",
      description: "Build scalable components with modern auto-layout.",
      free: true
    },
    {
      title: "WCAG 2.2",
      url: "https://www.w3.org/TR/WCAG22/",
      author: "W3C",
      type: "Docs",
      lang: "en",
      description: "Accessibility standards for inclusive product design.",
      free: true
    }
  ],
  graphicAndBrand: [
    {
      title: "Canva Design School",
      url: "https://www.canva.com/designschool/",
      author: "Canva",
      type: "Course",
      lang: "en",
      description: "Practical visual design and social creative lessons.",
      free: true
    },
    {
      title: "Figma Community",
      url: "https://www.figma.com/community",
      author: "Figma",
      type: "Platform",
      lang: "en",
      description: "Free templates and community assets for design work.",
      free: true
    },
    {
      title: "Graphic Design Masterclass Bangla",
      url: "https://www.youtube.com/playlist?list=PLLy_yEcwEE_j5Fp3U_bT6O6_j_-XkK-hQ",
      author: "Ghoori Learning",
      type: "YouTube",
      lang: "bn",
      description: "Bangla visual design basics and social content creation.",
      free: true
    }
  ],
  motionAndCreativeTesting: [
    {
      title: "LottieFiles Learning",
      url: "https://lottiefiles.com/learn",
      author: "LottieFiles",
      type: "Docs",
      lang: "en",
      description: "Animation workflow for lightweight UI motion.",
      free: true
    },
    {
      title: "Google UX: Usability Testing",
      url: "https://www.coursera.org/learn/conduct-ux-research",
      author: "Google",
      type: "Course",
      lang: "en",
      description: "Usability testing and iteration process.",
      free: true
    },
    {
      title: "Unsplash Free Assets",
      url: "https://unsplash.com/",
      author: "Unsplash",
      type: "Platform",
      lang: "en",
      description: "High-quality free images for campaign and visual design.",
      free: true
    }
  ],
  baAndAgile: [
    {
      title: "Agile Manifesto",
      url: "https://agilemanifesto.org/",
      author: "Agile Alliance",
      type: "Docs",
      lang: "en",
      description: "Agile values and principles in simple language.",
      free: true
    },
    {
      title: "Scrum Guide",
      url: "https://scrumguides.org/",
      author: "Scrum Guides",
      type: "Docs",
      lang: "en",
      description: "Official Scrum framework for planning and delivery.",
      free: true
    },
    {
      title: "Atlassian Agile Coach",
      url: "https://www.atlassian.com/agile",
      author: "Atlassian",
      type: "Docs",
      lang: "en",
      description: "Practical agile guides for teams and projects.",
      free: true
    }
  ],
  requirementsAndProcess: [
    {
      title: "IIBA Business Analysis Standard",
      url: "https://www.iiba.org/globalassets/business-analysis-resources/the-business-analysis-standard/files/the-business-analysis-standard.pdf",
      author: "IIBA",
      type: "PDF",
      lang: "en",
      description: "Core BA structure for requirements and stakeholder work.",
      free: true
    },
    {
      title: "Jira: Sprint Planning Guide",
      url: "https://support.atlassian.com/jira-software-cloud/docs/what-is-a-sprint/",
      author: "Atlassian",
      type: "Docs",
      lang: "en",
      description: "Simple sprint planning workflow and team cadence.",
      free: true
    },
    {
      title: "Camunda BPMN Overview",
      url: "https://camunda.com/bpmn/reference/",
      author: "Camunda",
      type: "Docs",
      lang: "en",
      description: "Process mapping concepts using BPMN diagrams.",
      free: true
    }
  ],
  productMetrics: [
    {
      title: "Google Analytics Developers",
      url: "https://developers.google.com/analytics",
      author: "Google",
      type: "Docs",
      lang: "en",
      description: "Track product events and understand user behavior.",
      free: true
    },
    {
      title: "Mixpanel Documentation",
      url: "https://docs.mixpanel.com/docs/what-is-mixpanel",
      author: "Mixpanel",
      type: "Docs",
      lang: "en",
      description: "Product analytics, retention, and funnel measurement.",
      free: true
    },
    {
      title: "Google Skillshop",
      url: "https://skillshop.withgoogle.com/",
      author: "Google",
      type: "Course",
      lang: "en",
      description: "Free courses for analytics and marketing tools.",
      free: true
    }
  ],
  productStrategy: [
    {
      title: "Startup School",
      url: "https://www.startupschool.org/",
      author: "Y Combinator",
      type: "Course",
      lang: "en",
      description: "Product strategy, execution, and growth foundations.",
      free: true
    },
    {
      title: "ProductPlan Glossary",
      url: "https://www.productplan.com/glossary/product-roadmap/",
      author: "ProductPlan",
      type: "Article",
      lang: "en",
      description: "Roadmap and prioritization terms explained clearly.",
      free: true
    },
    {
      title: "Mind the Product Articles",
      url: "https://www.mindtheproduct.com/",
      author: "Mind the Product",
      type: "Article",
      lang: "en",
      description: "Real-world product lessons from practitioners.",
      free: true
    }
  ],
  seoAndContent: [
    {
      title: "Google Search Central Docs",
      url: "https://developers.google.com/search/docs",
      author: "Google",
      type: "Docs",
      lang: "en",
      description: "Official SEO best practices and indexing guidance.",
      free: true
    },
    {
      title: "Ahrefs SEO Guide",
      url: "https://ahrefs.com/seo",
      author: "Ahrefs",
      type: "Article",
      lang: "en",
      description: "Practical SEO frameworks from beginner to advanced.",
      free: true
    },
    {
      title: "HubSpot Blog: Content Marketing",
      url: "https://blog.hubspot.com/marketing/content-marketing",
      author: "HubSpot",
      type: "Article",
      lang: "en",
      description: "Content strategy, planning, and copywriting examples.",
      free: true
    }
  ],
  paidAdsAndCampaigns: [
    {
      title: "Meta Blueprint",
      url: "https://www.facebookblueprint.com/student/catalog",
      author: "Meta",
      type: "Course",
      lang: "en",
      description: "Official ad training for Meta campaign setup and optimization.",
      free: true
    },
    {
      title: "Google Ads Help",
      url: "https://support.google.com/google-ads",
      author: "Google",
      type: "Docs",
      lang: "en",
      description: "Campaign setup, targeting, and budget management basics.",
      free: true
    },
    {
      title: "LinkedIn Marketing Labs",
      url: "https://www.linkedin.com/business/marketing/blog/linkedin-marketing-labs",
      author: "LinkedIn",
      type: "Course",
      lang: "en",
      description: "B2B campaign and creative strategy for LinkedIn.",
      free: true
    }
  ],
  crmAndEmail: [
    {
      title: "HubSpot Academy",
      url: "https://academy.hubspot.com/",
      author: "HubSpot",
      type: "Course",
      lang: "en",
      description: "CRM, marketing automation, and lifecycle communication.",
      free: true
    },
    {
      title: "Mailchimp Resources",
      url: "https://mailchimp.com/resources/",
      author: "Mailchimp",
      type: "Article",
      lang: "en",
      description: "Email sequence, audience segmentation, and campaign tips.",
      free: true
    },
    {
      title: "SendGrid Documentation",
      url: "https://docs.sendgrid.com/",
      author: "Twilio",
      type: "Docs",
      lang: "en",
      description: "Transactional and marketing email delivery setup.",
      free: true
    }
  ],
  customerSuccess: [
    {
      title: "Zendesk CX Library",
      url: "https://www.zendesk.com/blog/",
      author: "Zendesk",
      type: "Article",
      lang: "en",
      description: "Customer support playbooks, onboarding, and retention ideas.",
      free: true
    },
    {
      title: "Intercom Academy",
      url: "https://academy.intercom.com/",
      author: "Intercom",
      type: "Course",
      lang: "en",
      description: "Customer communication and support operations training.",
      free: true
    },
    {
      title: "HubSpot Customer Service",
      url: "https://academy.hubspot.com/courses/customer-service",
      author: "HubSpot",
      type: "Course",
      lang: "en",
      description: "Onboarding, help center, and customer success fundamentals.",
      free: true
    }
  ]
};

const TOPIC_RULES = [
  { key: "webFoundation", pattern: /(html|css|javascript|es6|semantic|flex|grid|dom|responsive|লেআউট|জাভাস্ক্রিপ্ট)/i },
  { key: "reactNext", pattern: /(react|next\.js|hooks|app router|ssr|ssg|frontend|কম্পোনেন্ট)/i },
  { key: "stateAndData", pattern: /(zustand|redux|state|query|caching|data fetching|server state|স্টেট)/i },
  { key: "stylingAndUI", pattern: /(tailwind|ui design|typography|color system|responsive)/i },
  { key: "performanceAndA11y", pattern: /(performance|lighthouse|a11y|accessibility|wcag|অ্যাক্সেসিবিলিটি)/i },
  { key: "testingAndCi", pattern: /(jest|testing|rtl|ci\/cd|github actions|automation|test)/i },
  { key: "storybookAndHandoff", pattern: /(storybook|handoff|open source|case study|contribution|release candidate)/i },
  { key: "backendApi", pattern: /(node|express|fastify|rest|api|crud|backend|এন্ডপয়েন্ট)/i },
  { key: "dataAndDb", pattern: /(sql|postgresql|data modeling|database|query|migration|seed)/i },
  { key: "authAndSecurity", pattern: /(jwt|auth|authorization|rbac|permission|security|tenant isolation)/i },
  { key: "laravelAndPhp", pattern: /(laravel|eloquent|model relationship|orm)/i },
  { key: "backendScale", pattern: /(redis|queue|job|notification|mail|cache|worker)/i },
  { key: "paymentsAndDeploy", pattern: /(payment|stripe|sslcommerz|docker|deployment|production)/i },
  { key: "devopsOps", pattern: /(kubernetes|release|well-architected|cost|incident|pipeline|environment|compose)/i },
  { key: "observability", pattern: /(logs|metrics|tracing|slo|alert|monitoring|observability|backup|dependency scanning)/i },
  { key: "uxResearch", pattern: /(research|persona|information architecture|wireframe|ux|heuristic|usability)/i },
  { key: "figmaAndPrototype", pattern: /(figma|prototype|animation|micro-interaction|auto layout)/i },
  { key: "visualDesign", pattern: /(high-fidelity|typography|color|layout|theme|visual)/i },
  { key: "designSystems", pattern: /(design system|component library|accessibility|handoff)/i },
  { key: "graphicAndBrand", pattern: /(brand|logo|social|template|creative|asset|localization|visual)/i },
  { key: "motionAndCreativeTesting", pattern: /(motion|storyboard|a\/b|cta|campaign visual|video)/i },
  { key: "baAndAgile", pattern: /(ba fundamentals|stakeholder|agile|scrum|sprint)/i },
  { key: "requirementsAndProcess", pattern: /(requirement|user stories|acceptance|process|swot|bpmn|release planning)/i },
  { key: "productMetrics", pattern: /(kpi|analytics|mixpanel|ga4|instrumentation|funnel|a\/b testing)/i },
  { key: "productStrategy", pattern: /(vision|roadmap|okr|mvp|pricing|retention|risk|governance|profit-share|launch)/i },
  { key: "seoAndContent", pattern: /(seo|keyword|content|copywriting|landing page|lead generation|audience)/i },
  { key: "paidAdsAndCampaigns", pattern: /(paid|ads|campaign|meta|linkedin|pixel|roi|promotion)/i },
  { key: "crmAndEmail", pattern: /(crm|email|automation|welcome email|sequence)/i },
  { key: "customerSuccess", pattern: /(customer success|support|onboarding|sla|feedback|renewal|nps|csat|qbr|community)/i }
];

function uniqueByUrl(items) {
  const map = new Map();
  items.forEach(item => {
    if (!map.has(item.url)) map.set(item.url, item);
  });
  return Array.from(map.values());
}

function matchResourceKeys(topicEn = "", topicBn = "") {
  const text = `${topicEn} ${topicBn}`.toLowerCase();
  const matched = TOPIC_RULES.filter(rule => rule.pattern.test(text)).map(rule => rule.key);
  if (!matched.length) return ["generalLearning"];
  return Array.from(new Set([...matched, "generalLearning"]));
}

function buildTopicResources() {
  const items = [];
  const topicRegistry = [];

  Object.entries(ROADMAPS_V2).forEach(([deptKey, tracks]) => {
    Object.entries(tracks).forEach(([trackKey, months]) => {
      months.forEach(monthData => {
        monthData.topicsEn.forEach((topicEn, idx) => {
          const topicBn = monthData.topicsBn[idx] || topicEn;
          const resourceKeys = matchResourceKeys(topicEn, topicBn);
          const selected = uniqueByUrl(resourceKeys.flatMap(key => RESOURCE_LIBRARY[key] || [])).slice(0, 7);
          const topicId = `${deptKey}-${trackKey}-m${monthData.month}-t${idx + 1}`;

          topicRegistry.push({
            topicId,
            deptKey,
            trackKey,
            month: monthData.month,
            topicEn,
            topicBn,
            resourceCount: selected.length
          });

          selected.forEach((resource, order) => {
            items.push({
              ...resource,
              dept: deptKey,
              track: trackKey,
              month: monthData.month,
              topicEn,
              topicBn,
              topicId,
              order
            });
          });
        });
      });
    });
  });

  return {
    items,
    topics: topicRegistry
  };
}

const built = buildTopicResources();

export const RESOURCE_ITEMS_V2 = built.items;
export const TOPIC_REGISTRY_V2 = built.topics;
export const RESOURCE_SUMMARY_V2 = {
  totalTopics: TOPIC_REGISTRY_V2.length,
  coveredTopics: TOPIC_REGISTRY_V2.filter(item => item.resourceCount > 0).length,
  totalResources: RESOURCE_ITEMS_V2.length,
  departments: Object.keys(TRACK_META).length
};
