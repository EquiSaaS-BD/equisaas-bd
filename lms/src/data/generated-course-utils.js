import { PATHS } from "./structure.mjs";
import { LESSON_TOPIC_HINTS } from "./lesson-topic-hints.js";

const PATH_CONTEXT = {
  "se-frontend": { scenarioEn: "a React-based learner dashboard and lecture experience", scenarioBn: "একটি React-ভিত্তিক learner dashboard ও lecture experience", outcomeEn: "ship fast without breaking the learner experience", outcomeBn: "learner experience নষ্ট না করে দ্রুত ship করা" },
  "se-backend": { scenarioEn: "an API layer that powers progress, permissions, and reporting", scenarioBn: "progress, permission, আর reporting চালায় এমন একটি API layer", outcomeEn: "keep data, security, and performance stable under load", outcomeBn: "load বাড়লেও data, security, আর performance স্থিতিশীল রাখা" },
  "se-devops": { scenarioEn: "the CI/CD, observability, and reliability stack behind the LMS", scenarioBn: "LMS-এর পেছনের CI/CD, observability, আর reliability stack", outcomeEn: "reduce risky releases and shorten recovery time", outcomeBn: "risky release কমানো এবং recovery time ছোট করা" },
  "design-ux": { scenarioEn: "a guided onboarding and lesson-discovery flow", scenarioBn: "একটি guided onboarding ও lesson-discovery flow", outcomeEn: "turn research into clearer, easier user journeys", outcomeBn: "research-কে আরও পরিষ্কার ও সহজ user journey-তে রূপ দেওয়া" },
  "design-brand": { scenarioEn: "a bilingual brand and social content system", scenarioBn: "একটি bilingual brand ও social content system", outcomeEn: "keep visual quality consistent across formats and campaigns", outcomeBn: "ভিন্ন format আর campaign-জুড়ে visual quality consistent রাখা" },
  "product-ba": { scenarioEn: "cross-functional requirements and process documentation for an LMS feature", scenarioBn: "একটি LMS feature-এর জন্য cross-functional requirement ও process documentation", outcomeEn: "reduce ambiguity before delivery starts", outcomeBn: "delivery শুরু হওয়ার আগেই ambiguity কমানো" },
  "product-pm": { scenarioEn: "a roadmap that improves learner activation and retention", scenarioBn: "learner activation আর retention উন্নত করে এমন একটি roadmap", outcomeEn: "make better product bets with limited team capacity", outcomeBn: "সীমিত team capacity দিয়ে ভালো product bet নেওয়া" },
  "marketing-growth": { scenarioEn: "acquisition and lifecycle campaigns for learner enrollment", scenarioBn: "learner enrollment-এর জন্য acquisition ও lifecycle campaign", outcomeEn: "turn traffic into measurable, repeatable growth", outcomeBn: "traffic-কে measurable ও repeatable growth-এ রূপ দেওয়া" },
  "marketing-success": { scenarioEn: "onboarding, support, and retention operations for active learners", scenarioBn: "active learner-দের জন্য onboarding, support, আর retention operation", outcomeEn: "increase time-to-value and reduce churn risk", outcomeBn: "time-to-value বাড়ানো এবং churn risk কমানো" },
};

const CODING_PATH_IDS = new Set(["se-frontend", "se-backend", "se-devops"]);

const RESOURCE_SETS = {
  react: [
    { labelEn: "React Official Docs", labelBn: "React অফিশিয়াল ডকস", url: "https://react.dev/learn" },
    { labelEn: "TypeScript Handbook", labelBn: "TypeScript হ্যান্ডবুক", url: "https://www.typescriptlang.org/docs/" },
    { labelEn: "Next.js App Router Docs", labelBn: "Next.js App Router ডকস", url: "https://nextjs.org/docs/app" },
  ],
  frontend: [
    { labelEn: "Tailwind CSS Docs", labelBn: "Tailwind CSS ডকস", url: "https://tailwindcss.com/docs" },
    { labelEn: "TanStack Query Docs", labelBn: "TanStack Query ডকস", url: "https://tanstack.com/query/latest/docs/framework/react/overview" },
    { labelEn: "Storybook Docs", labelBn: "Storybook ডকস", url: "https://storybook.js.org/docs" },
  ],
  frontendQuality: [
    { labelEn: "Jest Docs", labelBn: "Jest ডকস", url: "https://jestjs.io/docs/getting-started" },
    { labelEn: "Playwright Docs", labelBn: "Playwright ডকস", url: "https://playwright.dev/docs/intro" },
    { labelEn: "WCAG 2.2", labelBn: "WCAG 2.2", url: "https://www.w3.org/TR/WCAG22/" },
  ],
  backend: [
    { labelEn: "Laravel Docs", labelBn: "Laravel ডকস", url: "https://laravel.com/docs" },
    { labelEn: "Node.js Docs", labelBn: "Node.js ডকস", url: "https://nodejs.org/api/documentation.html" },
    { labelEn: "REST API Design Guide", labelBn: "REST API Design গাইড", url: "https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design" },
  ],
  backendData: [
    { labelEn: "PostgreSQL Docs", labelBn: "PostgreSQL ডকস", url: "https://www.postgresql.org/docs/" },
    { labelEn: "Prisma ORM Docs", labelBn: "Prisma ORM ডকস", url: "https://www.prisma.io/docs" },
    { labelEn: "Laravel Eloquent Docs", labelBn: "Laravel Eloquent ডকস", url: "https://laravel.com/docs/eloquent" },
  ],
  backendOps: [
    { labelEn: "OWASP API Security Top 10", labelBn: "OWASP API Security Top 10", url: "https://owasp.org/API-Security/" },
    { labelEn: "Docker Docs", labelBn: "Docker ডকস", url: "https://docs.docker.com/" },
    { labelEn: "Google SRE Book", labelBn: "Google SRE বই", url: "https://sre.google/books/" },
  ],
  devops: [
    { labelEn: "GitHub Actions Docs", labelBn: "GitHub Actions ডকস", url: "https://docs.github.com/en/actions" },
    { labelEn: "Docker Docs", labelBn: "Docker ডকস", url: "https://docs.docker.com/" },
    { labelEn: "Kubernetes Basics", labelBn: "Kubernetes Basics", url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/" },
  ],
  devopsOps: [
    { labelEn: "OpenTelemetry Docs", labelBn: "OpenTelemetry ডকস", url: "https://opentelemetry.io/docs/" },
    { labelEn: "AWS Well-Architected", labelBn: "AWS Well-Architected", url: "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html" },
    { labelEn: "The Twelve-Factor App", labelBn: "The Twelve-Factor App", url: "https://12factor.net/" },
  ],
  ux: [
    { labelEn: "NN/g UX Research Methods", labelBn: "NN/g UX Research Methods", url: "https://www.nngroup.com/articles/which-ux-research-methods/" },
    { labelEn: "Interaction Design Foundation", labelBn: "Interaction Design Foundation", url: "https://www.interaction-design.org/" },
    { labelEn: "Figma Resource Library", labelBn: "Figma Resource Library", url: "https://www.figma.com/resource-library/" },
  ],
  design: [
    { labelEn: "Figma Learn", labelBn: "Figma Learn", url: "https://help.figma.com/hc/en-us/categories/360002051613" },
    { labelEn: "Canva Design School", labelBn: "Canva Design School", url: "https://www.canva.com/designschool/" },
    { labelEn: "Figma Community", labelBn: "Figma Community", url: "https://www.figma.com/community" },
  ],
  business: [
    { labelEn: "BABOK Key Concepts", labelBn: "BABOK মূল ধারণা", url: "https://www.iiba.org/knowledgehub/business-analysis-body-of-knowledge-babok-guide/key-concepts/" },
    { labelEn: "IIBA Business Analysis Standard", labelBn: "IIBA Business Analysis Standard", url: "https://www.iiba.org/globalassets/business-analysis-resources/the-business-analysis-standard/files/the-business-analysis-standard.pdf" },
    { labelEn: "Atlassian Requirements Guide", labelBn: "Atlassian Requirements Guide", url: "https://www.atlassian.com/software/confluence/resources/guides/how-to/business-requirements" },
  ],
  product: [
    { labelEn: "Aha! Product Strategy Guide", labelBn: "Aha! Product Strategy Guide", url: "https://www.aha.io/roadmapping/guide/product-strategy" },
    { labelEn: "ProductPlan Glossary", labelBn: "ProductPlan Glossary", url: "https://www.productplan.com/glossary/" },
    { labelEn: "Mind the Product", labelBn: "Mind the Product", url: "https://www.mindtheproduct.com/" },
  ],
  analytics: [
    { labelEn: "Google Analytics Docs", labelBn: "Google Analytics ডকস", url: "https://developers.google.com/analytics" },
    { labelEn: "Mixpanel Guides", labelBn: "Mixpanel Guides", url: "https://mixpanel.com/blog/" },
    { labelEn: "Amplitude Guides", labelBn: "Amplitude Guides", url: "https://amplitude.com/blog" },
  ],
  growth: [
    { labelEn: "HubSpot Academy", labelBn: "HubSpot Academy", url: "https://academy.hubspot.com/" },
    { labelEn: "Google Search Central", labelBn: "Google Search Central", url: "https://developers.google.com/search/docs" },
    { labelEn: "Meta Blueprint", labelBn: "Meta Blueprint", url: "https://www.facebook.com/business/learn" },
  ],
  success: [
    { labelEn: "HubSpot Customer Service Course", labelBn: "HubSpot Customer Service Course", url: "https://academy.hubspot.com/courses/customer-service" },
    { labelEn: "Zendesk CX Blog", labelBn: "Zendesk CX Blog", url: "https://www.zendesk.com/blog/" },
    { labelEn: "Intercom Academy", labelBn: "Intercom Academy", url: "https://academy.intercom.com/" },
  ],
  general: [
    { labelEn: "Google for Developers Learning", labelBn: "Google for Developers Learning", url: "https://developers.google.com/learn" },
    { labelEn: "freeCodeCamp Learn", labelBn: "freeCodeCamp Learn", url: "https://www.freecodecamp.org/learn" },
    { labelEn: "Learn with Sumit", labelBn: "Learn with Sumit", url: "https://learnwithsumit.com/" },
  ],
};

const CATEGORY_META = {
  implementation: {
    artifactEn: "implementation note", artifactBn: "implementation note", audienceEn: "engineers and reviewers", audienceBn: "engineer ও reviewer",
    conceptEn: (title) => [`Inputs, interfaces, and constraints that shape ${title}`, `How ${title} changes state, data flow, or delivery behavior`, "Review checkpoints that prevent fragile implementations"],
    conceptBn: (title) => [`${title} গঠনের জন্য প্রয়োজনীয় input, interface, আর constraint`, `${title} state, data flow, বা delivery behavior কীভাবে বদলায়`, "fragile implementation ঠেকানোর review checkpoint"],
    pitfallEn: "Teams usually struggle when they skip ownership boundaries, hide assumptions inside code, or avoid documenting the operational rule behind the implementation.",
    pitfallBn: "Team সাধারণত তখনই সমস্যায় পড়ে যখন ownership boundary এড়িয়ে যায়, assumption code-এর ভেতরে লুকায়, অথবা implementation-এর পেছনের operational rule document করে না।",
  },
  architecture: {
    artifactEn: "architecture review note", artifactBn: "architecture review note", audienceEn: "technical leads and platform reviewers", audienceBn: "technical lead ও platform reviewer",
    conceptEn: (title) => [`${title} across layers, dependencies, and failure boundaries`, "Trade-offs between simplicity, scalability, and maintainability", "How to review the design before it becomes expensive to change"],
    conceptBn: (title) => [`layer, dependency, আর failure boundary জুড়ে ${title}`, "simplicity, scalability, আর maintainability-এর trade-off", "পরিবর্তন ব্যয়বহুল হওয়ার আগেই design review করার পদ্ধতি"],
    pitfallEn: "Weak architecture work appears when teams optimize one layer in isolation and never check the whole system under growth, failure, or review.",
    pitfallBn: "দুর্বল architecture কাজ তখনই দেখা যায় যখন team একেকটি layer আলাদা করে optimize করে কিন্তু growth, failure, বা review-এর সময় পুরো system কীভাবে আচরণ করে তা দেখে না।",
  },
  workflow: {
    artifactEn: "workflow note", artifactBn: "workflow note", audienceEn: "operators and collaborators", audienceBn: "operator ও collaborator",
    conceptEn: (title) => [`Entry and exit conditions for ${title}`, "Owners, handoffs, and communication cadence", "Signals that show whether the workflow is healthy or stuck"],
    conceptBn: (title) => [`${title}-এর entry আর exit condition`, "owner, handoff, আর communication cadence", "workflow healthy নাকি stuck তা বোঝার signal"],
    pitfallEn: "Workflow topics break down when everyone assumes the next person knows what to do, yet no one makes timing, ownership, or review rules explicit.",
    pitfallBn: "workflow বিষয়গুলো তখনই ভেঙে পড়ে যখন সবাই ধরে নেয় পরের জন কী করবে তা জানে, কিন্তু timing, ownership, বা review rule কেউ স্পষ্ট করে না।",
  },
  design: {
    artifactEn: "design system note", artifactBn: "design system note", audienceEn: "design and product stakeholders", audienceBn: "design ও product stakeholder",
    conceptEn: (title) => [`The visual or interaction rules inside ${title}`, "Consistency across screens, breakpoints, and reusable assets", "Handoff details that reduce drift between intent and execution"],
    conceptBn: (title) => [`${title}-এর visual বা interaction rule`, "screen, breakpoint, আর reusable asset-জুড়ে consistency", "intent আর execution-এর drift কমানোর handoff detail"],
    pitfallEn: "Design quality usually drops when a team treats the artifact as decoration instead of a reusable system with constraints and review criteria.",
    pitfallBn: "team যখন artifact-কে reusable system না ভেবে শুধু সাজসজ্জা ধরে নেয়, তখনই design quality পড়ে যায়; কারণ constraint আর review criteria উপেক্ষিত হয়।",
  },
  measurement: {
    artifactEn: "metric model", artifactBn: "metric model", audienceEn: "decision makers and reviewers", audienceBn: "decision maker ও reviewer",
    conceptEn: (title) => [`The metrics, baselines, and targets behind ${title}`, "How to segment the signal so it supports a decision", "Thresholds that should trigger action, not just observation"],
    conceptBn: (title) => [`${title}-এর পেছনের metric, baseline, আর target`, "decision support করার জন্য signal কীভাবে segment করবেন", "কোন threshold action trigger করবে, শুধু observation নয়"],
    pitfallEn: "Metrics become vanity when teams collect numbers without defining the decision, owner, and change threshold first.",
    pitfallBn: "team যখন decision, owner, আর change threshold না ঠিক করেই শুধু সংখ্যা জড়ো করে, তখন metric vanity হয়ে যায়।",
  },
  mapping: {
    artifactEn: "mapping artifact", artifactBn: "mapping artifact", audienceEn: "stakeholders and delivery leads", audienceBn: "stakeholder ও delivery lead",
    conceptEn: (title) => [`The criteria used to group, score, or rank ${title}`, "How to make the map usable in discussion and sign-off", "What to do when the map reveals conflict or risk"],
    conceptBn: (title) => [`${title} group, score, বা rank করার criteria`, "আলোচনা আর sign-off-এ map-কে usable করার উপায়", "map conflict বা risk দেখালে কী করবেন"],
    pitfallEn: "Mapping work loses value when it stays as a static document instead of feeding communication, sequencing, or escalation decisions.",
    pitfallBn: "mapping কাজ তখনই value হারায় যখন সেটি communication, sequencing, বা escalation decision-এ না গিয়ে static document হিসেবেই পড়ে থাকে।",
  },
  research: {
    artifactEn: "discovery brief", artifactBn: "discovery brief", audienceEn: "designers, PMs, and stakeholders", audienceBn: "designer, PM, আর stakeholder",
    conceptEn: (title) => [`The evidence questions that sit behind ${title}`, "How to separate assumption, observation, and interpretation", "Ways to turn findings into design or product action"],
    conceptBn: (title) => [`${title}-এর পেছনের evidence question`, "assumption, observation, আর interpretation আলাদা করার উপায়", "finding-কে design বা product action-এ রূপ দেওয়ার পদ্ধতি"],
    pitfallEn: "Research work fails when teams collect opinions but never convert them into patterns, decisions, and a shared understanding of what changed.",
    pitfallBn: "team যখন শুধু মতামত সংগ্রহ করে কিন্তু তা pattern, decision, আর shared understanding-এ রূপ দেয় না, তখন research কাজ ব্যর্থ হয়।",
  },
  strategy: {
    artifactEn: "decision canvas", artifactBn: "decision canvas", audienceEn: "leaders and cross-functional stakeholders", audienceBn: "leader ও cross-functional stakeholder",
    conceptEn: (title) => [`How ${title} connects goals, trade-offs, and sequencing`, "Which assumptions need validation before the plan is trusted", "How to explain the decision to stakeholders with different incentives"],
    conceptBn: (title) => [`${title} goal, trade-off, আর sequencing-এর সাথে কীভাবে যুক্ত`, "plan trust করার আগে কোন assumption validate করতে হবে", "ভিন্ন incentive থাকা stakeholder-কে decision ব্যাখ্যা করার পদ্ধতি"],
    pitfallEn: "Strategy artifacts stop being useful when they look polished but never force the team to choose what will be done now, later, or not at all.",
    pitfallBn: "strategy artifact তখনই অকেজো হয় যখন দেখতে polished লাগে কিন্তু team-কে এখন, পরে, বা একদমই না করার choice নিতে বাধ্য করে না।",
  },
  operations: {
    artifactEn: "operating playbook", artifactBn: "operating playbook", audienceEn: "operators and managers", audienceBn: "operator ও manager",
    conceptEn: (title) => [`The routine, handoff, or checklist behind ${title}`, "How to keep the work repeatable as volume grows", "Signals that show when the operating model needs to change"],
    conceptBn: (title) => [`${title}-এর পেছনের routine, handoff, বা checklist`, "volume বাড়লেও কাজ repeatable রাখার উপায়", "কখন operating model বদলানো দরকার তা বোঝার signal"],
    pitfallEn: "Operational topics get brittle when teams depend on memory, heroics, or undocumented exceptions instead of a repeatable system.",
    pitfallBn: "team যখন repeatable system-এর বদলে memory, heroics, বা undocumented exception-এর ওপর নির্ভর করে, তখন operational কাজ brittle হয়ে যায়।",
  },
  quality: {
    artifactEn: "quality gate", artifactBn: "quality gate", audienceEn: "reviewers and delivery owners", audienceBn: "reviewer ও delivery owner",
    conceptEn: (title) => [`The review criteria and pass/fail signals for ${title}`, "Evidence needed to prove the work is complete", "How to shorten the rework loop after defects or gaps appear"],
    conceptBn: (title) => [`${title}-এর review criteria আর pass/fail signal`, "কাজ complete প্রমাণ করতে কী evidence লাগবে", "defect বা gap দেখা দিলে rework loop কীভাবে ছোট করবেন"],
    pitfallEn: "Quality work breaks when teams say 'looks fine' without a repeatable standard, observable evidence, and a clear rule for what happens next.",
    pitfallBn: "team যখন repeatable standard, observable evidence, বা next step-এর clear rule ছাড়া শুধু 'ভালো দেখাচ্ছে' বলে, তখন quality work ভেঙে পড়ে।",
  },
  growth: {
    artifactEn: "campaign plan", artifactBn: "campaign plan", audienceEn: "growth and lifecycle operators", audienceBn: "growth ও lifecycle operator",
    conceptEn: (title) => [`The audience, message, and conversion mechanics inside ${title}`, "How to connect channel work with downstream retention or revenue", "Ways to learn quickly without overspending on weak signals"],
    conceptBn: (title) => [`${title}-এর audience, message, আর conversion mechanic`, "channel work-কে downstream retention বা revenue-এর সাথে যুক্ত করার উপায়", "দুর্বল signal-এ অতিরিক্ত খরচ না করে দ্রুত শেখার পদ্ধতি"],
    pitfallEn: "Growth work wastes budget when teams launch channels or automations before they define message fit, feedback loops, and success thresholds.",
    pitfallBn: "team যখন message fit, feedback loop, আর success threshold না ঠিক করেই channel বা automation launch করে, তখন growth work budget অপচয় করে।",
  },
};

const TOPIC_RULES = [
  { pattern: /(react|typescript|next\.js|app router|routing)/i, category: "implementation", resourceSet: "react", labKind: "architecture", focusEn: "translate requirements into reusable UI and predictable navigation contracts", focusBn: "requirement-কে reusable UI এবং predictable navigation contract-এ রূপ দেওয়া", signalEn: "keep component behavior clear as the screen grows", signalBn: "screen বড় হলেও component behavior পরিষ্কার রাখা" },
  { pattern: /(redux|zustand|state|query|caching|form|validation|tailwind|token|responsive|grid|component library)/i, category: "design", resourceSet: "frontend", labKind: "tokens", focusEn: "turn frontend decisions into reusable state, layout, and UI patterns", focusBn: "frontend decision-কে reusable state, layout, আর UI pattern-এ রূপ দেওয়া", signalEn: "reduce duplicated UI logic and visual drift", signalBn: "duplicated UI logic আর visual drift কমানো" },
  { pattern: /(suspense|streaming|code splitting|image optimization|web vitals|bundle|jest|playwright|ci|i18n|accessibility|a11y|tracking|monitoring)/i, category: "quality", resourceSet: "frontendQuality", labKind: "checklist", focusEn: "turn frontend quality and production readiness into visible review gates", focusBn: "frontend quality আর production readiness-কে visible review gate-এ রূপ দেওয়া", signalEn: "catch regressions before they reach learners", signalBn: "learner-এর কাছে যাওয়ার আগেই regression ধরা" },
  { pattern: /(laravel|node|rest api|api design|service layer|middleware)/i, category: "implementation", resourceSet: "backend", labKind: "architecture", focusEn: "shape endpoints, services, and request flow around real product use cases", focusBn: "real product use case ঘিরে endpoint, service, আর request flow গঠন করা", signalEn: "keep the API readable, secure, and easy to evolve", signalBn: "API readable, secure, আর evolve করা সহজ রাখা" },
  { pattern: /(postgresql|data modeling|migration|index|query tuning|eloquent|prisma|orm)/i, category: "architecture", resourceSet: "backendData", labKind: "board", focusEn: "translate business rules into tables, relationships, and efficient queries", focusBn: "business rule-কে table, relationship, আর efficient query-তে রূপ দেওয়া", signalEn: "keep the data model scalable and maintainable", signalBn: "data model scalable আর maintainable রাখা" },
  { pattern: /(auth|jwt|rbac|abac|tenant isolation|audit|rate limit|queue|job|worker|cache|idempotency|failure recovery)/i, category: "operations", resourceSet: "backendOps", labKind: "flow", focusEn: "protect data, permissions, and asynchronous work under production pressure", focusBn: "production pressure-এ data, permission, আর asynchronous work সুরক্ষিত রাখা", signalEn: "avoid silent failure and unclear recovery paths", signalBn: "silent failure আর unclear recovery path এড়ানো" },
  { pattern: /(docker|integration|contract test|testing stack|multi-tenant|well-architected|sre|12-factor)/i, category: "strategy", resourceSet: "backendOps", labKind: "planner", focusEn: "review backend delivery and architecture choices before they become expensive", focusBn: "ব্যয়বহুল হওয়ার আগেই backend delivery আর architecture choice review করা", signalEn: "balance scalability, reliability, and team speed", signalBn: "scalability, reliability, আর team speed-এর ভারসাম্য রাখা" },
  { pattern: /(pipeline|environment|git\/github flow|docker|compose|kubernetes|release|deploy checklist)/i, category: "workflow", resourceSet: "devops", labKind: "flow", focusEn: "standardize how code and infrastructure move from commit to release", focusBn: "commit থেকে release পর্যন্ত code আর infrastructure যাওয়ার পথ standardize করা", signalEn: "remove hidden manual steps from release preparation", signalBn: "release preparation থেকে hidden manual step সরানো" },
  { pattern: /(logs|metrics|tracing|slo|error budget|alerting|secret|backup|dependency scanning|cost optimization|incident)/i, category: "measurement", resourceSet: "devopsOps", labKind: "calculator", focusEn: "connect observability, resilience, and cost signals to operational action", focusBn: "observability, resilience, আর cost signal-কে operational action-এর সাথে যুক্ত করা", signalEn: "detect risk early and shorten recovery time", signalBn: "risk দ্রুত ধরা এবং recovery time ছোট করা" },
  { pattern: /(research|persona|information architecture|user flow)/i, category: "research", resourceSet: "ux", labKind: "board", focusEn: "turn user evidence into clearer structure, flow, and design choices", focusBn: "user evidence-কে আরও পরিষ্কার structure, flow, আর design choice-এ রূপ দেওয়া", signalEn: "replace opinion-led design with observed patterns", signalBn: "opinion-led design-এর বদলে observed pattern ব্যবহার করা" },
  { pattern: /(auto layout|component|variant|responsive grid|design token)/i, category: "design", resourceSet: "design", labKind: "tokens", focusEn: "convert Figma work into scalable interface patterns", focusBn: "Figma কাজকে scalable interface pattern-এ রূপ দেওয়া", signalEn: "keep visual consistency while speeding up iteration", signalBn: "iteration দ্রুত করেও visual consistency বজায় রাখা" },
  { pattern: /(color|typography|logo|brand guide|brand kit|template|cta|animation|storyboard|video|bilingual|inclusive|asset library|versioning|naming|export|handoff)/i, category: "design", resourceSet: "design", labKind: "tokens", focusEn: "package visual work so it can be reused, tested, and handed off safely", focusBn: "visual work-কে এমনভাবে package করা যাতে reuse, test, আর handoff করা নিরাপদ হয়", signalEn: "reduce quality loss between creative intent and final execution", signalBn: "creative intent আর final execution-এর মধ্যে quality loss কমানো" },
  { pattern: /(stakeholder|process|traceability|elicitation|user stor|acceptance|definition of done|uat|defect|backlog|story slicing|estimation|retro|reporting|optimization|data dictionary)/i, category: "mapping", resourceSet: "business", labKind: "matrix", focusEn: "turn analysis work into reviewable artifacts that reduce ambiguity before delivery", focusBn: "analysis কাজকে reviewable artifact-এ রূপ দেওয়া যাতে delivery-এর আগে ambiguity কমে", signalEn: "keep business intent visible across the delivery flow", signalBn: "delivery flow জুড়ে business intent visible রাখা" },
  { pattern: /(market gap|problem framing|value proposition|prioritization|okr|dependency|hypothesis|roadmap|launch|product council|transparency|profit-share|packaging|pricing|retention|monetization|risk register|funnel metric|instrumentation)/i, category: "strategy", resourceSet: "product", labKind: "planner", focusEn: "sequence product decisions around impact, evidence, and governance constraints", focusBn: "impact, evidence, আর governance constraint দেখে product decision sequence করা", signalEn: "turn broad product thinking into visible, reviewable choices", signalBn: "broad product thinking-কে visible আর reviewable choice-এ রূপ দেওয়া" },
  { pattern: /(funnel mapping|messaging|utm|seo|content calendar|landing page|creative testing|lead generation|ga4|cohort|dashboarding|crm|lead scoring|email drip|referral|partner channel|retention play|cost-to-revenue)/i, category: "growth", resourceSet: "growth", labKind: "planner", focusEn: "align channel, message, and follow-up around measurable growth signals", focusBn: "measurable growth signal ঘিরে channel, message, আর follow-up align করা", signalEn: "move effort toward repeatable acquisition and retention outcomes", signalBn: "effort-কে repeatable acquisition আর retention outcome-এর দিকে সরানো" },
  { pattern: /(time-to-value|onboarding|segmentation|taxonomy|knowledge base|sla|feedback|insight|churn|renewal|escalation|mentorship|forum|peer-to-peer|nps|csat|qbr)/i, category: "operations", resourceSet: "success", labKind: "board", focusEn: "turn customer support and success work into repeatable operating systems", focusBn: "customer support আর success work-কে repeatable operating system-এ রূপ দেওয়া", signalEn: "improve time-to-value and reduce churn risk with clearer handoffs", signalBn: "আরও পরিষ্কার handoff দিয়ে time-to-value বাড়ানো আর churn risk কমানো" },
];

const GROUP_BY_PATH = { "se-frontend": "implementation", "se-backend": "implementation", "se-devops": "workflow", "design-ux": "research", "design-brand": "design", "product-ba": "mapping", "product-pm": "strategy", "marketing-growth": "growth", "marketing-success": "operations" };
const LAB_META_BY_KIND = {
  checklist: {
    labTitleEn: "Interactive Review Checklist",
    labTitleBn: "ইন্টারঅ্যাকটিভ রিভিউ চেকলিস্ট",
    labIntroEn: (lesson) => `Walk through a focused checklist for ${lesson.titleEn} and see which review criteria are already covered versus which ones still need attention.`,
    labIntroBn: (lesson) => `${lesson.titleBn} নিয়ে একটি focused checklist ধরে এগিয়ে দেখুন কোন review criterion আগে থেকেই covered আছে আর কোনগুলো এখনো কাজ বাকি।`,
  },
  flow: {
    labTitleEn: "Workflow Stepper",
    labTitleBn: "ওয়ার্কফ্লো স্টেপার",
    labIntroEn: () => "Move through the workflow step by step so you can understand ownership, handoff timing, and where the process usually gets stuck.",
    labIntroBn: () => "ধাপে ধাপে workflow এগিয়ে owner, handoff timing, আর কোথায় process সাধারণত আটকে যায় তা পরিষ্কারভাবে বুঝুন।",
  },
  matrix: {
    labTitleEn: "Decision Matrix Explorer",
    labTitleBn: "ডিসিশন ম্যাট্রিক্স এক্সপ্লোরার",
    labIntroEn: (lesson) => `Compare stakeholders, signals, or priorities inside a simple matrix so ${lesson.titleEn} becomes easier to discuss and review.`,
    labIntroBn: (lesson) => `একটি সহজ matrix-এর ভিতরে stakeholder, signal, বা priority compare করে ${lesson.titleBn} আরও সহজে discuss ও review করুন।`,
  },
  planner: {
    labTitleEn: "Planning Scenario Simulator",
    labTitleBn: "প্ল্যানিং সিনারিও সিমুলেটর",
    labIntroEn: () => "Try different decision directions and see how planning choices change impact, speed, and risk trade-offs.",
    labIntroBn: () => "ভিন্ন decision direction চেষ্টা করে দেখুন planning choice কীভাবে impact, speed, আর risk trade-off বদলে দেয়।",
  },
  calculator: {
    labTitleEn: "Metric Calculator",
    labTitleBn: "মেট্রিক ক্যালকুলেটর",
    labIntroEn: () => "Adjust baseline, current performance, and target values to see how quickly the signal moves and when action is needed.",
    labIntroBn: () => "baseline, current performance, আর target value বদলে দেখে নিন signal কত দ্রুত move করছে এবং কখন action নেওয়া দরকার।",
  },
  board: {
    labTitleEn: "Scenario Board",
    labTitleBn: "সিনারিও বোর্ড",
    labIntroEn: () => "Switch between signals, decisions, and follow-up steps to understand how the full operating conversation fits together.",
    labIntroBn: () => "signal, decision, আর follow-up step-এর মধ্যে switch করে পুরো operating conversation কীভাবে একসাথে কাজ করে তা বুঝুন।",
  },
  tokens: {
    labTitleEn: "Interactive Design Studio",
    labTitleBn: "ইন্টারঅ্যাকটিভ ডিজাইন স্টুডিও",
    labIntroEn: () => "Experiment with tokens and layout controls visually so you can feel the design effect without needing a coding background first.",
    labIntroBn: () => "token আর layout control visualভাবে adjust করুন, যাতে coding background ছাড়াই design effect হাতে-কলমে বুঝতে পারেন।",
  },
  architecture: {
    labTitleEn: "Architecture Explorer",
    labTitleBn: "আর্কিটেকচার এক্সপ্লোরার",
    labIntroEn: () => "Explore the boundaries, failure points, and review prompts behind the design so the system logic becomes easier to reason about.",
    labIntroBn: () => "design-এর boundary, failure point, আর review prompt explore করে system logic-টা সহজে reason করতে শিখুন।",
  },
};

function hasUsableSandpack(lab) {
  if (!lab?.template || !lab?.files || !Object.keys(lab.files).length) return false;
  const serialized = JSON.stringify(lab);
  return !serialized.includes(">Setup<") && !serialized.includes("Setup</div>") && !serialized.includes("return <div>Setup</div>");
}

function hasMeaningfulLessonCopy(content) {
  const text = String(content || "")
    .replace(/[`#>*_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length < 260) return false;

  const lowered = text.toLowerCase();
  return ![
    "focus on utility classes",
    "flexbox vs grid",
    "accessible components",
    "progressive ssr",
    "next/image usage",
    "core web vitals",
    "mocking and asserting",
    "browser automation",
    "github actions yaml",
    "translating tokens",
    "aria tags and screen readers",
    "catching exceptions in prod",
  ].some((pattern) => lowered.includes(pattern));
}

function mergeResources(legacyResources = [], generatedResources = []) {
  const seen = new Set();
  return [...legacyResources, ...generatedResources].filter((item) => {
    const key = `${item?.url || ""}::${item?.labelEn || ""}::${item?.labelBn || ""}`;
    if (!item?.url || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function parseLessonMarkdown(content = "") {
  const lines = String(content || "").split(/\r?\n/);
  let title = "";
  const introLines = [];
  const sections = [];
  let activeSection = null;

  const pushActiveSection = () => {
    if (!activeSection) return;
    const body = activeSection.bodyLines.join("\n").trim();
    if (body) {
      sections.push({
        heading: activeSection.heading,
        body,
      });
    }
    activeSection = null;
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!title && /^#{1,2}\s+/.test(trimmed)) {
      title = trimmed.replace(/^#{1,2}\s+/, "").trim();
      return;
    }

    if (/^###\s+/.test(trimmed)) {
      pushActiveSection();
      activeSection = {
        heading: trimmed.replace(/^###\s+/, "").trim(),
        bodyLines: [],
      };
      return;
    }

    if (activeSection) {
      activeSection.bodyLines.push(line);
    } else {
      introLines.push(line);
    }
  });

  pushActiveSection();

  return {
    title,
    intro: introLines.join("\n").trim(),
    sections,
  };
}

function normalizeSectionKey(heading = "") {
  const normalized = String(heading || "")
    .replace(/^#+\s+/, "")
    .replace(/[：:]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  const aliases = {
    "example": "real example",
    "উদাহরণ": "বাস্তব উদাহরণ",
    "real example": "real example",
    "বাস্তব উদাহরণ": "বাস্তব উদাহরণ",
    "key concept": "key concepts",
    "key concepts": "key concepts",
    "মূল ধারণা": "মূল ধারণা",
  };

  return aliases[normalized] || normalized;
}

function hasRichTeachingStructure(content = "") {
  const lowered = String(content || "").toLowerCase();
  return (
    lowered.includes("### what you will learn") ||
    lowered.includes("### why it matters") ||
    lowered.includes("### how to apply it") ||
    lowered.includes("### এই লেসনে আপনি শিখবেন") ||
    lowered.includes("### কেন গুরুত্বপূর্ণ") ||
    lowered.includes("### কীভাবে নিজের কাজে ব্যবহার করবেন")
  );
}

function hasMeaningfulSectionBody(body = "") {
  const text = String(body || "")
    .replace(/[`#>*_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return text.length >= 80;
}

function enrichLegacyLessonCopy(legacyContent, generatedContent, fallbackTitle = "") {
  if (!hasMeaningfulLessonCopy(legacyContent)) return generatedContent;
  if (hasRichTeachingStructure(legacyContent)) return legacyContent;

  const legacyParsed = parseLessonMarkdown(legacyContent);
  const generatedParsed = parseLessonMarkdown(generatedContent);
  const title = legacyParsed.title || generatedParsed.title || fallbackTitle;
  const intro = legacyParsed.intro || generatedParsed.intro;
  const legacySections = new Map(
    legacyParsed.sections.map((section) => [normalizeSectionKey(section.heading), section.body]),
  );

  const mergedSections = generatedParsed.sections.map((section) => {
    const legacyBody = legacySections.get(normalizeSectionKey(section.heading));
    return {
      heading: section.heading,
      body: hasMeaningfulSectionBody(legacyBody) ? legacyBody : section.body,
    };
  });

  const contentLines = [`## ${title}`, ""];
  if (intro) {
    contentLines.push(intro, "");
  }

  mergedSections.forEach((section, index) => {
    contentLines.push(`### ${section.heading}`, section.body.trim());
    if (index < mergedSections.length - 1) {
      contentLines.push("");
    }
  });

  return contentLines.join("\n");
}

function mergeLesson(pathId, legacyLesson, generatedLesson) {
  if (!legacyLesson) return generatedLesson;

  const allowLegacySandpack = CODING_PATH_IDS.has(pathId);
  const generatedSandpack = hasUsableSandpack(generatedLesson?.sandpack) ? generatedLesson.sandpack : null;
  const legacySandpack = allowLegacySandpack && hasUsableSandpack(legacyLesson?.sandpack) ? legacyLesson.sandpack : null;
  const resolvedSandpack = generatedSandpack || legacySandpack || null;
  const resolvedPractice = resolvedSandpack ? null : generatedLesson?.practice || legacyLesson?.practice || null;
  const resolvedContentEn = enrichLegacyLessonCopy(
    legacyLesson?.contentEn,
    generatedLesson?.contentEn,
    legacyLesson?.titleEn || generatedLesson?.titleEn,
  );
  const resolvedContentBn = enrichLegacyLessonCopy(
    legacyLesson?.contentBn,
    generatedLesson?.contentBn,
    legacyLesson?.titleBn || generatedLesson?.titleBn,
  );

  return {
    ...generatedLesson,
    ...legacyLesson,
    contentEn: resolvedContentEn,
    contentBn: resolvedContentBn,
    resources: mergeResources(legacyLesson?.resources, generatedLesson?.resources),
    sandpack: resolvedSandpack,
    practice: resolvedPractice,
  };
}

function mergeCourseMaps(pathId, legacyCourseMap, generatedCourseMap) {
  const merged = {};
  for (const [moduleId, lessons] of Object.entries(generatedCourseMap)) {
    merged[moduleId] = {};
    for (const [lessonId, lesson] of Object.entries(lessons)) {
      merged[moduleId][lessonId] = mergeEnhancedLesson(pathId, legacyCourseMap?.[moduleId]?.[lessonId], lesson);
    }
  }
  for (const [moduleId, lessons] of Object.entries(legacyCourseMap || {})) {
    if (!merged[moduleId]) merged[moduleId] = { ...lessons };
    else for (const [lessonId, lesson] of Object.entries(lessons)) if (!merged[moduleId][lessonId]) merged[moduleId][lessonId] = lesson;
  }
  return merged;
}

function getPathById(pathId) { return PATHS.find((item) => item.id === pathId) || null; }
function getTopicRule(lesson) { return TOPIC_RULES.find((rule) => rule.pattern.test(`${lesson.titleEn || ""} ${lesson.titleBn || ""}`)) || null; }
function getContext(pathId) { return PATH_CONTEXT[pathId] || PATH_CONTEXT["se-frontend"]; }
function getDefaultCategory(pathId) { return CATEGORY_META[GROUP_BY_PATH[pathId] || "implementation"] || CATEGORY_META.implementation; }
function getPracticeMeta(rule, lesson) {
  const labKind = rule.labKind || "checklist";
  const meta = LAB_META_BY_KIND[labKind] || LAB_META_BY_KIND.checklist;
  return {
    kind: labKind,
    experienceType: "interactive",
    titleEn: meta.labTitleEn,
    titleBn: meta.labTitleBn,
    introEn: meta.labIntroEn(lesson),
    introBn: meta.labIntroBn(lesson),
  };
}
function createChecklistPractice(rule, lesson, meta) {
  return {
    ...meta,
    promptEn: `Tick off the review checkpoints that would make ${lesson.titleEn} ready for a confident handoff.`,
    promptBn: `${lesson.titleBn} handoff-ready করতে কোন review checkpoint দরকার তা একে একে চিহ্ন দিন।`,
    summaryEn: `A complete checklist means the ${rule.artifactEn} is concrete enough for ${rule.audienceEn} to review without guessing.`,
    summaryBn: `Checklist সম্পূর্ণ হলে ${rule.artifactBn} এতটাই স্পষ্ট হবে যে ${rule.audienceBn} অনুমান না করেই review করতে পারবে।`,
    items: [
      {
        id: "goal",
        labelEn: `Define the goal behind ${lesson.titleEn}`,
        labelBn: `${lesson.titleBn}-এর আসল goal স্পষ্ট করুন`,
        detailEn: "State which decision, workflow, or outcome this lesson is trying to improve.",
        detailBn: "এই topic কোন decision, workflow, বা outcome উন্নত করতে চায় তা লিখে ফেলুন।",
      },
      {
        id: "artifact",
        labelEn: `Capture the core ${rule.artifactEn}`,
        labelBn: `মূল ${rule.artifactBn} ধরে ফেলুন`,
        detailEn: "Summarize the minimum information the team must see before moving forward.",
        detailBn: "পরবর্তী ধাপে যাওয়ার আগে team-এর কোন minimum তথ্য দেখা জরুরি তা লিখুন।",
      },
      {
        id: "owners",
        labelEn: "Review with a decision owner and an execution owner",
        labelBn: "একজন decision owner আর একজন execution owner-এর সাথে review করুন",
        detailEn: "Use both strategic and operational feedback before calling the work complete.",
        detailBn: "কাজ complete বলার আগে strategic আর operational দুই ধরনের feedback নিন।",
      },
      {
        id: "handoff",
        labelEn: "Update the handoff note after feedback",
        labelBn: "feedback-এর পর handoff note আপডেট করুন",
        detailEn: "Make the next person’s first read easier than the first draft was.",
        detailBn: "পরের জন যেন প্রথম draft-এর চেয়ে সহজে বুঝতে পারে, সেইভাবে final note ঠিক করুন।",
      },
    ],
  };
}

function createFlowPractice(rule, lesson, meta) {
  return {
    ...meta,
    promptEn: `Walk through the operational flow and decide which step needs the most clarity before ${lesson.titleEn} moves into execution.`,
    promptBn: `Operational flow ধরে দেখুন ${lesson.titleBn} execute করার আগে কোন ধাপটিতে সবচেয়ে বেশি clarity দরকার।`,
    summaryEn: `When each step has an owner, a signal, and a fallback, ${rule.signalEn}.`,
    summaryBn: `প্রতিটি ধাপে owner, signal, আর fallback থাকলে ${rule.signalBn}।`,
    sections: [
      {
        id: "signal",
        labelEn: "Capture signal",
        labelBn: "সিগনাল ধরুন",
        detailEn: `List the production, delivery, or learner signal that makes ${lesson.titleEn} urgent.`,
        detailBn: `${lesson.titleBn} জরুরি কেন, সেই production, delivery, বা learner signal লিখুন।`,
        promptEn: "Which signal should trigger action first?",
        promptBn: "কোন signal action trigger করবে?",
        reviewEn: "Would another teammate know why this step starts now?",
        reviewBn: "অন্য teammate কি বুঝতে পারবে কেন এখনই এই ধাপ শুরু হচ্ছে?",
        items: [
          { id: "signal-1", labelEn: "Primary trigger", labelBn: "প্রাইমারি ট্রিগার", detailEn: "Define what changed from the baseline.", detailBn: "baseline থেকে কী বদলেছে তা লিখুন।" },
          { id: "signal-2", labelEn: "Affected surface", labelBn: "প্রভাবিত surface", detailEn: "Name which system or learner flow is affected first.", detailBn: "কোন system বা learner flow আগে প্রভাবিত হবে তা নির্ধারণ করুন।" },
        ],
      },
      {
        id: "decision",
        labelEn: "Clarify decision",
        labelBn: "ডিসিশন পরিষ্কার করুন",
        detailEn: "Translate the signal into a decision the team can review quickly.",
        detailBn: "signal-টিকে এমন decision-এ রূপ দিন যা team দ্রুত review করতে পারে।",
        promptEn: "What exactly are we choosing here?",
        promptBn: "এখানে আমরা ঠিক কোন সিদ্ধান্তটি নিচ্ছি?",
        reviewEn: "Is the scope small enough to review without confusion?",
        reviewBn: "scope কি এতটাই ছোট যে confusion ছাড়া review করা যাবে?",
        items: [
          { id: "decision-1", labelEn: "Decision statement", labelBn: "ডিসিশন স্টেটমেন্ট", detailEn: "Write the next move in one sentence.", detailBn: "পরের move এক বাক্যে লিখুন।" },
          { id: "decision-2", labelEn: "Trade-off", labelBn: "ট্রেড-অফ", detailEn: "State what gets delayed, protected, or escalated.", detailBn: "কী delay হবে, কী protect হবে, বা কী escalate হবে তা লিখুন।" },
        ],
      },
      {
        id: "handoff",
        labelEn: "Review handoff",
        labelBn: "হ্যান্ডঅফ রিভিউ করুন",
        detailEn: "Confirm the next owner has enough context to act without a rescue meeting.",
        detailBn: "পরের owner rescue meeting ছাড়াই কাজ শুরু করতে পারবে কি না তা যাচাই করুন।",
        promptEn: "Who acts next, and what do they need?",
        promptBn: "পরের কাজটি কে করবে, আর তার কী দরকার?",
        reviewEn: "Can the next owner act from the note alone?",
        reviewBn: "পরের owner কি শুধু note দেখে কাজ শুরু করতে পারবে?",
        items: [
          { id: "handoff-1", labelEn: "Next owner", labelBn: "পরের owner", detailEn: "Name the exact team or person taking the next step.", detailBn: "পরের ধাপ নেবে এমন team বা person নির্ধারণ করুন।" },
          { id: "handoff-2", labelEn: "Required context", labelBn: "প্রয়োজনীয় context", detailEn: "List the information they need before work starts.", detailBn: "কাজ শুরু হওয়ার আগে তাদের কী তথ্য দরকার তা লিখুন।" },
        ],
      },
      {
        id: "monitor",
        labelEn: "Monitor result",
        labelBn: "ফলাফল মনিটর করুন",
        detailEn: "Decide which signal will confirm that the change actually helped.",
        detailBn: "কোন signal প্রমাণ করবে যে change সত্যিই কাজে দিয়েছে তা ঠিক করুন।",
        promptEn: "How will we know the move worked?",
        promptBn: "কীভাবে বুঝবেন যে move কাজ করেছে?",
        reviewEn: "Would the team know when to iterate, stop, or escalate?",
        reviewBn: "team কি বুঝতে পারবে কখন iterate, stop, বা escalate করতে হবে?",
        items: [
          { id: "monitor-1", labelEn: "Success signal", labelBn: "সাকসেস সিগনাল", detailEn: "Pick the metric or observation to revisit.", detailBn: "যে metric বা observation পুনরায় দেখা হবে তা নির্ধারণ করুন।" },
          { id: "monitor-2", labelEn: "Fallback path", labelBn: "ফলব্যাক পথ", detailEn: "Describe what happens if the signal does not improve.", detailBn: "signal improve না করলে কী হবে তা লিখুন।" },
        ],
      },
    ],
  };
}

function createMatrixPractice(rule, lesson, meta) {
  return {
    ...meta,
    promptEn: `Compare the people and signals around ${lesson.titleEn} so the team knows who needs attention first.`,
    promptBn: `${lesson.titleBn} ঘিরে থাকা মানুষ আর signal compare করে দেখুন আগে কাকে focus করতে হবে।`,
    summaryEn: `A useful map keeps the ${rule.artifactEn} visible inside stakeholder conversation, not trapped in a file.`,
    summaryBn: `একটি ভালো map ${rule.artifactBn}-কে শুধু file-এর ভিতরে নয়, stakeholder conversation-এর মধ্যেও alive রাখে।`,
    entries: [
      {
        id: "decision-owner",
        labelEn: "Decision owner",
        labelBn: "ডিসিশন ওনার",
        detailEn: `High influence, high context, and the fastest person to unblock ${lesson.titleEn}.`,
        detailBn: `উচ্চ influence, বেশি context, আর ${lesson.titleBn} unblock করার সবচেয়ে দ্রুত person।`,
        scoreEn: "High influence",
        scoreBn: "উচ্চ প্রভাব",
        actionEn: "Review first and confirm sign-off criteria.",
        actionBn: "আগে review করুন এবং sign-off criteria confirm করুন।",
      },
      {
        id: "delivery-partner",
        labelEn: "Delivery partner",
        labelBn: "ডেলিভারি পার্টনার",
        detailEn: "Needs enough clarity to build, test, or operationalize the next step confidently.",
        detailBn: "পরের ধাপ build, test, বা operationalize করতে যথেষ্ট clarity দরকার।",
        scoreEn: "Execution critical",
        scoreBn: "execution-এ গুরুত্বপূর্ণ",
        actionEn: "Align the handoff and remove ambiguity.",
        actionBn: "handoff align করুন এবং ambiguity সরান।",
      },
      {
        id: "affected-member",
        labelEn: "Affected member",
        labelBn: "প্রভাবিত মেম্বার",
        detailEn: "Represents the learner, teammate, or user who feels the change first.",
        detailBn: "যে learner, teammate, বা user change-এর প্রভাব প্রথমে অনুভব করবে।",
        scoreEn: "High interest",
        scoreBn: "উচ্চ আগ্রহ",
        actionEn: "Validate the change before broad rollout.",
        actionBn: "বড় rollout-এর আগে change validate করুন।",
      },
    ],
  };
}

function createPlannerPractice(rule, lesson, meta) {
  return {
    ...meta,
    promptEn: `Try different planning directions for ${lesson.titleEn} and compare their trade-offs before you commit the team.`,
    promptBn: `${lesson.titleBn} নিয়ে ভিন্ন planning direction compare করে দেখুন, team commit করার আগে trade-off বুঝে নিন।`,
    summaryEn: "Good planning does not only pick what feels exciting; it makes impact, speed, and control visible to everyone.",
    summaryBn: "ভালো planning শুধু exciting কাজ বেছে নেয় না; impact, speed, আর control-ও সবার সামনে স্পষ্ট করে।",
    options: [
      {
        id: "impact-first",
        labelEn: "Impact first",
        labelBn: "ইমপ্যাক্ট আগে",
        detailEn: `Best when ${rule.signalEn} matters more than short-term convenience.`,
        detailBn: `${rule.signalBn} short-term convenience-এর চেয়ে বেশি গুরুত্বপূর্ণ হলে এই option ভালো।`,
        impact: 92,
        speed: 48,
        risk: 63,
      },
      {
        id: "risk-first",
        labelEn: "Risk first",
        labelBn: "রিস্ক আগে",
        detailEn: "Use this when the biggest unknowns could derail trust, reliability, or alignment.",
        detailBn: "trust, reliability, বা alignment নষ্ট করে দিতে পারে এমন unknown বেশি থাকলে এটি বেছে নিন।",
        impact: 66,
        speed: 54,
        risk: 90,
      },
      {
        id: "speed-first",
        labelEn: "Speed first",
        labelBn: "স্পিড আগে",
        detailEn: "Choose this when the team needs a fast reviewable version before expanding scope.",
        detailBn: "scope বড় করার আগে team-এর দ্রুত reviewable version দরকার হলে এই option নিন।",
        impact: 58,
        speed: 94,
        risk: 52,
      },
    ],
  };
}

function createCalculatorPractice(rule, lesson, meta) {
  return {
    ...meta,
    promptEn: `Adjust the baseline, current signal, and target until you can explain when ${lesson.titleEn} should trigger action.`,
    promptBn: `baseline, current signal, আর target adjust করে দেখুন ${lesson.titleBn} কখন action trigger করবে।`,
    summaryEn: "Metrics are valuable only when they point to a next decision, not just a dashboard number.",
    summaryBn: "metric তখনই useful হয় যখন তা শুধু dashboard number না হয়ে next decision-এর দিকে ইশারা করে।",
    metrics: {
      baseline: 100,
      current: 135,
      target: 160,
      unitEn: "signal pts",
      unitBn: "সিগনাল পয়েন্ট",
    },
  };
}

function createBoardPractice(rule, lesson, meta) {
  return {
    ...meta,
    promptEn: `Move across the board to see how ${lesson.titleEn} connects signal, decision, and follow-up work.`,
    promptBn: `board-এর ধাপ ধরে দেখুন ${lesson.titleBn} কীভাবে signal, decision, আর follow-up-কে একসাথে যুক্ত করে।`,
    summaryEn: "The strongest operating systems keep the full conversation visible from signal to follow-up.",
    summaryBn: "সবচেয়ে শক্ত operating system signal থেকে follow-up পর্যন্ত পুরো conversation visible রাখে।",
    sections: [
      {
        id: "signal",
        labelEn: "Signal",
        labelBn: "সিগনাল",
        detailEn: "Start with what changed, who noticed it, and why it matters now.",
        detailBn: "কী বদলেছে, কে লক্ষ্য করেছে, আর এখনই কেন গুরুত্বপূর্ণ তা দিয়ে শুরু করুন।",
        promptEn: "What changed from the current baseline?",
        promptBn: "current baseline থেকে কী বদলেছে?",
        reviewEn: "Would the team align on the urgency after reading this?",
        reviewBn: "এটি পড়ে team কি urgency নিয়ে একমত হবে?",
        items: [
          { id: "signal-a", labelEn: "Observed change", labelBn: "দেখা পরিবর্তন", detailEn: "Capture the first observable shift.", detailBn: "প্রথম observable shift লিখুন।" },
          { id: "signal-b", labelEn: "First affected audience", labelBn: "প্রথম প্রভাবিত audience", detailEn: "Name who feels it before everyone else.", detailBn: "সবার আগে কে এটি অনুভব করবে তা নির্ধারণ করুন।" },
        ],
      },
      {
        id: "decision",
        labelEn: "Decision",
        labelBn: "ডিসিশন",
        detailEn: "Turn the signal into a choice with a visible owner and a bounded scope.",
        detailBn: "signal-কে এমন decision-এ রূপ দিন যার owner দৃশ্যমান আর scope সীমিত।",
        promptEn: "What exactly is the team agreeing to do next?",
        promptBn: "team ঠিক কী করতে সম্মত হচ্ছে?",
        reviewEn: "Is the next move reviewable and specific enough?",
        reviewBn: "পরের move কি reviewable এবং যথেষ্ট specific?",
        items: [
          { id: "decision-a", labelEn: "Next move", labelBn: "পরের move", detailEn: "Describe the smallest confident action.", detailBn: "সবচেয়ে ছোট confident action বর্ণনা করুন।" },
          { id: "decision-b", labelEn: "Owner", labelBn: "ওনার", detailEn: "Assign the person or squad accountable for it.", detailBn: "এটির জন্য accountable person বা squad ঠিক করুন।" },
        ],
      },
      {
        id: "follow-up",
        labelEn: "Follow-up",
        labelBn: "ফলো-আপ",
        detailEn: "Define how the team checks whether the decision helped or needs adjustment.",
        detailBn: "decision কাজ দিয়েছে নাকি adjustment দরকার তা team কীভাবে যাচাই করবে তা নির্ধারণ করুন।",
        promptEn: "What will we inspect after the change lands?",
        promptBn: "change দেওয়ার পর আমরা কী inspect করব?",
        reviewEn: "Would the team know when to continue, revise, or stop?",
        reviewBn: "team কি বুঝতে পারবে কখন continue, revise, বা stop করতে হবে?",
        items: [
          { id: "follow-up-a", labelEn: "Metric or observation", labelBn: "মেট্রিক বা observation", detailEn: "Pick the signal to revisit next.", detailBn: "পরেরবার কোন signal দেখবেন তা বেছে নিন।" },
          { id: "follow-up-b", labelEn: "Escalation path", labelBn: "এস্কেলেশন পথ", detailEn: "State what happens if progress stalls.", detailBn: "progress থেমে গেলে কী হবে তা লিখুন।" },
        ],
      },
    ],
  };
}

function createTokensPractice(rule, lesson, meta) {
  return {
    ...meta,
    promptEn: `Compare different visual system directions so ${lesson.titleEn} feels intentional even before a designer opens Figma.`,
    promptBn: `ভিন্ন visual direction compare করে দেখুন, যেন ${lesson.titleBn} designer Figma খোলার আগেই intentional লাগে।`,
    summaryEn: "A reusable visual system protects consistency without flattening creative choices.",
    summaryBn: "একটি reusable visual system consistency ধরে রাখে, কিন্তু creative choice-কে flat করে দেয় না।",
    sections: [
      {
        id: "compact",
        labelEn: "Compact",
        labelBn: "কমপ্যাক্ট",
        detailEn: "Best for dense dashboards, admin surfaces, and high-information reviews.",
        detailBn: "dense dashboard, admin surface, আর high-information review-এর জন্য উপযুক্ত।",
        promptEn: "When does tighter spacing increase clarity?",
        promptBn: "কখন tighter spacing clarity বাড়ায়?",
        reviewEn: "Would the layout still feel readable on mobile?",
        reviewBn: "mobile-এও কি layout readable থাকবে?",
      },
      {
        id: "balanced",
        labelEn: "Balanced",
        labelBn: "ব্যালান্সড",
        detailEn: "A middle path for education products where clarity and warmth both matter.",
        detailBn: "যেখানে clarity আর warmth দুটোই দরকার, এমন education product-এর জন্য balanced option।",
        promptEn: "Which screens need both clarity and approachability?",
        promptBn: "কোন screen-এ clarity আর approachability দুটোই দরকার?",
        reviewEn: "Does the system feel teachable and trustworthy?",
        reviewBn: "system-টি কি teachable আর trustworthy লাগছে?",
      },
      {
        id: "bold",
        labelEn: "Bold",
        labelBn: "বোল্ড",
        detailEn: "Useful when the interface must communicate momentum, confidence, or launch energy.",
        detailBn: "যখন interface-এ momentum, confidence, বা launch energy দেখাতে হয় তখন কার্যকর।",
        promptEn: "Where should emphasis be felt immediately?",
        promptBn: "কোথায় emphasis সঙ্গে সঙ্গে অনুভব হওয়া দরকার?",
        reviewEn: "Is the visual energy helping the message, or distracting from it?",
        reviewBn: "visual energy message-কে সাহায্য করছে, নাকি distract করছে?",
      },
    ],
  };
}

function createArchitecturePractice(rule, lesson, meta) {
  return {
    ...meta,
    promptEn: `Explore the design boundaries around ${lesson.titleEn} so the system is easier to reason about before implementation expands.`,
    promptBn: `${lesson.titleBn} ঘিরে design boundary explore করুন, যাতে implementation বড় হওয়ার আগেই system logic reason করা সহজ হয়।`,
    summaryEn: "Strong architecture work keeps contracts, failure paths, and review signals visible at the same time.",
    summaryBn: "শক্ত architecture কাজ contract, failure path, আর review signal-কে একই সাথে visible রাখে।",
    sections: [
      {
        id: "boundary",
        labelEn: "Boundary",
        labelBn: "বাউন্ডারি",
        detailEn: `Define what ${lesson.titleEn} owns, and just as importantly, what it does not own.`,
        detailBn: `${lesson.titleBn} কী own করে, এবং কী own করে না, তা স্পষ্ট করুন।`,
        promptEn: "Which interfaces must stay stable as the system grows?",
        promptBn: "system বড় হলেও কোন interface stable থাকতে হবে?",
        reviewEn: "Would another team know where this responsibility starts and ends?",
        reviewBn: "অন্য team কি বুঝতে পারবে responsibility কোথা থেকে শুরু আর কোথায় শেষ?",
        items: [
          { id: "boundary-a", labelEn: "Owned surface", labelBn: "own করা surface", detailEn: "State the area this design directly controls.", detailBn: "design যে area সরাসরি control করে তা লিখুন।" },
          { id: "boundary-b", labelEn: "Dependency edge", labelBn: "dependency edge", detailEn: "Name the outside systems it relies on.", detailBn: "যেসব বাইরের system-এর ওপর এটি নির্ভর করে সেগুলো লিখুন।" },
        ],
      },
      {
        id: "failure",
        labelEn: "Failure points",
        labelBn: "ফেইলিওর পয়েন্ট",
        detailEn: "Map what happens when timing, data, or coordination breaks under pressure.",
        detailBn: "timing, data, বা coordination চাপে ভেঙে গেলে কী হবে তা map করুন।",
        promptEn: "Where does the design become fragile first?",
        promptBn: "design প্রথম কোথায় fragile হয়ে পড়ে?",
        reviewEn: "Could the team recover without improvising a brand-new process?",
        reviewBn: "team কি নতুন process বানানো ছাড়াই recover করতে পারবে?",
        items: [
          { id: "failure-a", labelEn: "Likely fault", labelBn: "সম্ভাব্য fault", detailEn: "Identify the most probable weak point.", detailBn: "সবচেয়ে সম্ভাব্য দুর্বল জায়গা চিহ্নিত করুন।" },
          { id: "failure-b", labelEn: "Fallback move", labelBn: "fallback move", detailEn: "Describe the first safe fallback.", detailBn: "প্রথম safe fallback কী হবে তা লিখুন।" },
        ],
      },
      {
        id: "review",
        labelEn: "Review signal",
        labelBn: "রিভিউ সিগনাল",
        detailEn: "Make success observable so a reviewer knows where to look first.",
        detailBn: "success observable করে দিন, যাতে reviewer জানে আগে কোথায় তাকাতে হবে।",
        promptEn: "Which signal proves the design is healthy?",
        promptBn: "কোন signal design healthy থাকা প্রমাণ করবে?",
        reviewEn: "Would the reviewer know what 'good' looks like before approval?",
        reviewBn: "approval-এর আগে reviewer কি বুঝতে পারবে ‘ভালো’ outcome কেমন?",
        items: [
          { id: "review-a", labelEn: "Primary evidence", labelBn: "প্রাইমারি evidence", detailEn: "State the strongest proof of success.", detailBn: "success-এর সবচেয়ে শক্ত প্রমাণ নির্ধারণ করুন।" },
          { id: "review-b", labelEn: "Escalation rule", labelBn: "এস্কেলেশন রুল", detailEn: "Explain when the design needs a deeper review.", detailBn: "কখন design-এ deeper review দরকার হবে তা লিখুন।" },
        ],
      },
    ],
  };
}

function buildPractice(rule, lesson) {
  const meta = getPracticeMeta(rule, lesson);
  if (meta.kind === "matrix") return createMatrixPractice(rule, lesson, meta);
  if (meta.kind === "flow") return createFlowPractice(rule, lesson, meta);
  if (meta.kind === "planner") return createPlannerPractice(rule, lesson, meta);
  if (meta.kind === "calculator") return createCalculatorPractice(rule, lesson, meta);
  if (meta.kind === "board") return createBoardPractice(rule, lesson, meta);
  if (meta.kind === "tokens") return createTokensPractice(rule, lesson, meta);
  if (meta.kind === "architecture") return createArchitecturePractice(rule, lesson, meta);
  return createChecklistPractice(rule, lesson, meta);
}

function buildRule(pathId, lesson) {
  const matched = getTopicRule(lesson);
  if (matched) return { ...getDefaultCategory(pathId), ...matched, categoryId: matched.category || GROUP_BY_PATH[pathId] || "implementation" };
  return { ...getDefaultCategory(pathId), categoryId: GROUP_BY_PATH[pathId] || "implementation" };
}

function buildIntroParagraphs(path, moduleItem, lesson, rule, context, lang = "en") {
  if (lang === "bn") {
    return [
      `${lesson.titleBn} হলো ${path.titleBn}-এর ${moduleItem.titleBn} মডিউলের একটি গুরুত্বপূর্ণ অংশ। এই lecture-টি এমনভাবে লেখা হয়েছে যাতে একদম শুরু থেকে বিষয়টি ধরে ধরে শেখা যায়, শুধু term মুখস্থ না করে আসল কাজটাও বোঝা যায়।`,
      `বাস্তব SaaS workflow-এ ${lesson.titleBn} ব্যবহার করা হয় ${rule.focusBn}। EquiSaaS-এর মতো platform-এ এটি সাধারণত ${context.scenarioBn} নিয়ে কাজ করার সময় দরকার হয়, যাতে team ${context.outcomeBn} পারে।`,
      `তাই এই lesson-টিকে glossary entry হিসেবে নয়, teacher-এর guided class হিসেবে পড়ুন। আগে problem বুঝুন, তারপর concept, তারপর step, তারপর নিজের কাজে কীভাবে ব্যবহার করবেন তা ধরুন।`,
    ];
  }

  return [
    `${lesson.titleEn} is a core part of ${moduleItem.titleEn} in the ${path.titleEn}. This lecture is written to teach the topic from the ground up so learners understand the job of the concept, not just the vocabulary around it.`,
    `In real SaaS work, teams use ${lesson.titleEn} to ${rule.focusEn}. Inside EquiSaaS, that usually shows up while working on ${context.scenarioEn}, where the goal is to ${context.outcomeEn}.`,
    `So read this lesson like a guided class, not a glossary entry. First understand the problem, then the idea, then the steps, and finally how to use it in real work.`,
  ];
}

function buildWhatItIsCopy(lesson, lang = "en") {
  if (lang === "bn") {
    return [
      `${lesson.titleBn} সহজভাবে বললে এমন একটি ধারণা, rule, বা working method যা কাজকে পরিষ্কার করে। এটি বলে দেয় কোন input লাগবে, কী outcome চাই, আর কোন ভুল করলে কাজ fragile হয়ে যাবে।`,
      `${lesson.titleBn} ভালোভাবে বুঝতে হলে তিনটি জিনিস ধরতে হবে: এটি কোন সমস্যা সমাধান করে, এটি ব্যবহার করলে কাজের flow কীভাবে বদলায়, আর reviewer বা teammate কীভাবে বুঝবে যে কাজটি ঠিক হয়েছে।`,
    ];
  }

  return [
    `${lesson.titleEn} is a concept, rule, or working method that makes work clearer. It helps a team see what goes in, what should come out, and which mistakes would make the result fragile.`,
    `To truly understand ${lesson.titleEn}, focus on three things: the problem it solves, how it changes the workflow, and how a reviewer or teammate can tell the work is correct.`,
  ];
}

function buildWhyItMattersCopy(lesson, context, lang = "en") {
  if (lang === "bn") {
    return [
      `${lesson.titleBn} গুরুত্বপূর্ণ কারণ team যদি একই mental picture না ধরে, তাহলে একই কাজ নিয়ে ভিন্ন expectation তৈরি হয়। তখন review ধীর হয়, rework বাড়ে, আর learner বা user experience ক্ষতিগ্রস্ত হতে পারে।`,
      `বিশেষ করে ${context.scenarioBn}-এর মতো কাজে clarity খুব দরকার। কারণ এখানে ছোট misunderstanding-ও পরে বড় delivery delay, broken handoff, বা low-quality output তৈরি করতে পারে।`,
    ];
  }

  return [
    `${lesson.titleEn} matters because teams move slower when they do not share the same mental picture of the work. Review becomes noisy, rework grows, and the learner or user experience can suffer.`,
    `That is especially true in work like ${context.scenarioEn}. A small misunderstanding early on can later create delivery delay, broken handoffs, or low-quality output.`,
  ];
}

function buildSimpleAnalogy(rule, lesson, lang = "en") {
  const categoryId = rule.categoryId || "implementation";
  const analogies = {
    implementation: {
      en: `${lesson.titleEn} is a bit like cooking from a good recipe. You need to know the ingredients, the order of steps, and the signs that show the dish is going right.`,
      bn: `${lesson.titleBn} অনেকটা ভালো রান্নার recipe-র মতো। কী কী উপকরণ লাগবে, কোন step আগে হবে, আর কী দেখলে বুঝবেন কাজ ঠিক হচ্ছে, সবকিছু পরিষ্কার থাকতে হয়।`,
    },
    architecture: {
      en: `${lesson.titleEn} is like drawing the plan of a house before laying bricks. If the rooms, doors, and weak points are not thought through first, fixing them later becomes expensive.`,
      bn: `${lesson.titleBn} অনেকটা বাড়ি বানানোর আগে নকশা আঁকার মতো। কোন ঘর কোথায় হবে, কোন জায়গা দুর্বল হতে পারে, তা আগে না ভাবলে পরে ঠিক করতে অনেক খরচ আর সময় লাগে।`,
    },
    workflow: {
      en: `${lesson.titleEn} is like a relay race. Each person needs to know when to start, what to carry, and where to pass the baton so the whole team keeps moving.`,
      bn: `${lesson.titleBn} অনেকটা relay race-এর মতো। কে কখন শুরু করবে, কী নিয়ে এগোবে, আর কোথায় handoff দেবে তা পরিষ্কার না হলে পুরো team আটকে যায়।`,
    },
    design: {
      en: `${lesson.titleEn} is like using one shared art box for a class project. When everyone follows the same colors, spacing, and shape rules, the final work feels like one family.`,
      bn: `${lesson.titleBn} অনেকটা class project-এ সবার জন্য একটাই art box ব্যবহার করার মতো। সবাই একই color, spacing, আর shape rule মানলে final কাজটা এক পরিবারের অংশের মতো লাগে।`,
    },
    measurement: {
      en: `${lesson.titleEn} is like checking a thermometer or report card. The number matters only when it helps you decide whether things are healthy or need action.`,
      bn: `${lesson.titleBn} অনেকটা thermometer বা report card দেখার মতো। সংখ্যা তখনই useful হয়, যখন তা দেখে বোঝা যায় সব ঠিক আছে নাকি action নিতে হবে।`,
    },
    mapping: {
      en: `${lesson.titleEn} is like drawing a map before a trip. The map helps everyone see the route, the risky turns, and the checkpoints before the journey starts.`,
      bn: `${lesson.titleBn} অনেকটা ভ্রমণের আগে map আঁকার মতো। এতে যাত্রা শুরুর আগেই route, risky turn, আর checkpoint সবাই দেখতে পায়।`,
    },
    research: {
      en: `${lesson.titleEn} is like asking careful questions before making a gift for someone. You first learn what they need, what they like, and what would actually help them.`,
      bn: `${lesson.titleBn} অনেকটা কাউকে gift বানানোর আগে তার পছন্দ-অপছন্দ জেনে নেওয়ার মতো। আগে জানতে হয় তার আসলে কী দরকার, কী পছন্দ, আর কী দিলে সত্যিই উপকার হবে।`,
    },
    strategy: {
      en: `${lesson.titleEn} is like choosing which road to take when time and fuel are limited. You cannot do everything, so you pick the path with the best trade-off.`,
      bn: `${lesson.titleBn} অনেকটা সময় আর জ্বালানি কম থাকলে কোন রাস্তা ধরবেন তা বেছে নেওয়ার মতো। সব কিছু একসাথে করা যায় না, তাই সবচেয়ে ভালো trade-off-টা বেছে নিতে হয়।`,
    },
    operations: {
      en: `${lesson.titleEn} is like a dependable school morning routine. When the same good steps happen in the right order every day, the day starts smoothly instead of chaotically.`,
      bn: `${lesson.titleBn} অনেকটা dependable স্কুলের সকালের routine-এর মতো। প্রতিদিন একই ভালো step ঠিক order-এ হলে কাজ smooth চলে, অগোছালো হয় না।`,
    },
    quality: {
      en: `${lesson.titleEn} is like a teacher checking homework with a clear marking guide. It is not enough to say 'looks fine'; you need visible criteria for what good means.`,
      bn: `${lesson.titleBn} অনেকটা teacher clear marking guide দিয়ে homework দেখার মতো। শুধু 'ভালো লাগছে' বললে হয় না; ভালো মানে কী, তার visible criteria দরকার।`,
    },
    growth: {
      en: `${lesson.titleEn} is like inviting the right people to a club and then checking who stays because the club is actually helpful. Good growth is not noise; it is useful attention that keeps coming back.`,
      bn: `${lesson.titleBn} অনেকটা সঠিক মানুষকে club-এ ডাকানো আর তারপর দেখা তারা useful value পেয়ে আবার ফিরে আসে কি না। ভালো growth মানে শুধু হৈচৈ নয়; useful attention যা বারবার ফিরে আসে।`,
    },
  };

  return analogies[categoryId]?.[lang] || analogies.implementation[lang];
}

function buildWhenToUse(lesson, context, lang = "en") {
  if (lang === "bn") {
    return [
      `- যখন নতুন feature, workflow, campaign, বা system change শুরু করছেন এবং শুরু থেকেই clarity দরকার।`,
      `- যখন একই জায়গায় বারবার confusion, bug, rework, বা handoff সমস্যা দেখা যাচ্ছে।`,
      `- যখন ${context.scenarioBn}-এর মতো কাজকে repeatable আর reviewable করতে চান।`,
      `- যখন team বড় হচ্ছে এবং মুখে মুখে বোঝানোর বদলে একটি shared explanation দরকার।`,
    ];
  }

  return [
    `- Use it when a new feature, workflow, campaign, or system change needs clarity from the beginning.`,
    `- Use it when the team keeps seeing confusion, bugs, rework, or handoff problems in the same place.`,
    `- Use it when work like ${context.scenarioEn} needs to become repeatable and reviewable.`,
    `- Use it when the team is growing and verbal explanations are no longer enough.`,
  ];
}

function buildQuickCheck(lesson, context, lang = "en") {
  if (lang === "bn") {
    return [
      `- আপনি কি এক বাক্যে বলতে পারেন ${lesson.titleBn} কোন সমস্যাটি সমাধান করে?`,
      `- আপনি কি EquiSaaS-এর ${context.scenarioBn} বা অন্য কোনো real কাজ থেকে একটি example দিতে পারেন?`,
      `- আপনি কি notes না দেখে first step-টি বলতে পারেন?`,
      `- আপনি কি অন্তত একটি সাধারণ ভুল বলতে পারেন যা এড়ানো দরকার?`,
    ];
  }

  return [
    `- Can you explain in one sentence which problem ${lesson.titleEn} solves?`,
    `- Can you give one real example from EquiSaaS work such as ${context.scenarioEn}?`,
    `- Can you name the first step without looking at your notes?`,
    `- Can you mention at least one common mistake to avoid?`,
  ];
}

function buildExample(rule, lesson, context) {
  return {
    en: [
      `Scenario: The EquiSaaS team is improving ${context.scenarioEn}. Use ${lesson.titleEn} to make the work easier to understand and safer to deliver.`,
      "",
      `- First say the goal in one clear sentence: what should improve, and for whom?`,
      `- Then list the main parts, rules, or steps that make ${lesson.titleEn} work well.`,
      `- Build or explain the smallest useful version before trying to make it advanced.`,
      `- Review it with ${rule.audienceEn} and check whether the next person can follow it without guessing.`,
    ].join("\n"),
    bn: [
      `উদাহরণ: EquiSaaS team এখন ${context.scenarioBn} আরও ভালো করছে। ${lesson.titleBn} ব্যবহার করে কাজটাকে এমনভাবে সাজান যাতে সবাই সহজে বুঝতে পারে এবং নিরাপদে execute করতে পারে।`,
      "",
      "- শুরুতেই এক বাক্যে বলুন: আসল লক্ষ্য কী, আর কাদের জন্য এটি দরকার?",
      `- তারপর ${lesson.titleBn} ভালোভাবে কাজ করতে যে অংশ, rule, বা step লাগে সেগুলো লিখুন।`,
      "- আগে ছোট ও usable version বানান, পরে advanced করার কথা ভাবুন।",
      `- শেষে ${rule.audienceBn}-এর কাউকে দিয়ে দেখে নিন, তিনি guessing ছাড়া follow করতে পারেন কি না।`,
    ].join("\n"),
  };
}

function buildLearningGoals(lesson, rule, lang = "en") {
  if (lang === "bn") {
    return [
      `- সহজ ভাষায় ${lesson.titleBn} কী, তা নিজের ভাষায় বলতে পারবেন।`,
      `- বুঝতে পারবেন কেন ${lesson.titleBn} বাস্তব কাজে confusion কমায়, decision পরিষ্কার করে, আর team-কে দ্রুত এগোতে সাহায্য করে।`,
      `- একটি ছোট example, workflow, বা screen-এ ${lesson.titleBn} কীভাবে ব্যবহার করবেন তা দেখাতে পারবেন।`,
    ];
  }

  return [
    `- Explain ${lesson.titleEn} in simple words without hiding behind jargon.`,
    `- Describe why ${lesson.titleEn} helps a team ${rule.focusEn}.`,
    `- Show how to use ${lesson.titleEn} inside a small example, workflow, or screen.`,
  ];
}

function buildHowItWorksSteps(lesson, rule, lang = "en") {
  if (lang === "bn") {
    return [
      `১. আগে বুঝুন ${lesson.titleBn} কোন সমস্যা সমাধান করে। শুধুই tool বা jargon দিয়ে শুরু করবেন না।`,
      `২. কাজটিকে ছোট অংশে ভাগ করুন। কোন input লাগবে, কোন output বের হবে, আর কোন rule মানতে হবে তা লিখুন।`,
      `৩. সবচেয়ে ছোট working version বানান বা explain করুন। এতে learner বা teammate দ্রুত মূল ধারণা ধরতে পারে।`,
      `৪. বাস্তব উদাহরণ দিয়ে দেখান এই topic ব্যবহার করলে কী বদলায়। শুধু definition দিলে মনে থাকে না।`,
      `৫. review করে দেখুন কোথায় confusion হতে পারে, তারপর ভাষা, উদাহরণ, আর step আরও পরিষ্কার করুন।`,
    ];
  }

  return [
    `1. Start by naming the problem ${lesson.titleEn} is supposed to solve. Do not begin with tool names alone.`,
    `2. Break the topic into a few visible parts: inputs, decisions, outputs, and rules.`,
    `3. Build or explain the smallest working version first so the learner can see the core idea clearly.`,
    `4. Attach the idea to a real product example so the concept feels practical, not abstract.`,
    `5. Review the explanation for confusion, then simplify the wording, steps, and example until the next person can follow it easily.`,
  ];
}

function buildCommonMistakes(lesson, lang = "en") {
  if (lang === "bn") {
    return [
      `- ${lesson.titleBn} শেখাতে গিয়ে শুধু definition বলা, কিন্তু বাস্তব example না দেওয়া।`,
      "- একসাথে খুব বেশি নতুন term দেওয়া, ফলে learner মূল ধারণা হারিয়ে ফেলে।",
      "- what, why, how আলাদা না করে সবকিছু মিশিয়ে বলা।",
      "- review বা practice step না রাখা, ফলে learner বুঝেছে কি না বোঝা যায় না।",
    ];
  }

  return [
    `- Explaining ${lesson.titleEn} only as a definition without a realistic example.`,
    "- Introducing too many new terms at once and burying the core idea.",
    "- Mixing what, why, and how into one block instead of teaching them clearly in order.",
    "- Skipping review or practice, so nobody can tell whether the learner actually understood it.",
  ];
}

function buildApplyGuidance(lesson, rule, lang = "en") {
  if (lang === "bn") {
    return [
      `- নিজের ভাষায় ${lesson.titleBn} এক মিনিটে বোঝানোর চেষ্টা করুন। যদি আটকে যান, lesson আবার ছোট করে পড়ুন।`,
      `- EquiSaaS-এর একটি real screen, workflow, campaign, বা report বেছে নিয়ে বলুন এখানে ${lesson.titleBn} কীভাবে কাজে লাগবে।`,
      "- কী করতে হবে, কেন করতে হবে, আর কীভাবে করতে হবে এই তিনটি heading দিয়ে ছোট note লিখুন।",
      `- শেষে ${rule.audienceBn}-এর কাউকে note দেখিয়ে জিজ্ঞেস করুন: এটা follow করা কি সহজ?`,
    ];
  }

  return [
    `- Try to explain ${lesson.titleEn} in your own words in under one minute. If that feels hard, the concept is not clear yet.`,
    `- Pick one real EquiSaaS screen, workflow, campaign, or report and describe where ${lesson.titleEn} fits.`,
    "- Write a short note with three headings: what to do, why it matters, and how to do it.",
    `- Show that note to ${rule.audienceEn} and ask whether it is easy to follow without extra explanation.`,
  ];
}

function buildAssignmentChallenge(lesson, rule, context, lang = "en") {
  if (lang === "bn") {
    return [
      `- ${context.scenarioBn} ধরে ${lesson.titleBn} ব্যবহার করে একটি ছোট ${rule.artifactBn} বা demo outline বানান।`,
      "- Deliverable-এ তিনটি জিনিস রাখুন: আপনি কী বানালেন, কেন এভাবে বানালেন, আর কোন rule বা assumption মেনেছেন।",
      "- Scope ছোট রাখুন, যাতে ৩০ থেকে ৬০ মিনিটের মধ্যে first version শেষ করা যায়।",
      "- Submit করার আগে নিজে চেক করুন: একজন teammate কি এটি দেখে guessing ছাড়া বুঝতে পারবে?",
    ];
  }

  return [
    `- Create a small ${rule.artifactEn} or demo outline using ${lesson.titleEn} around ${context.scenarioEn}.`,
    "- Include three things in the deliverable: what you built, why you designed it that way, and which rules or assumptions you followed.",
    "- Keep the scope small enough to finish a first version within 30 to 60 minutes.",
    "- Before submitting, check whether a teammate could understand it without guessing.",
  ];
}

function buildSummaryPoints(lesson, rule, lang = "en") {
  if (lang === "bn") {
    return [
      `- ${lesson.titleBn} মানে হলো ${rule.focusBn}।`,
      "- ভালো explanation সবসময় clear, step-by-step, আর example-ভিত্তিক হয়।",
      "- ছোট করে শুরু করুন, practice করুন, feedback নিন, তারপর refine করুন।",
    ];
  }

  return [
    `- ${lesson.titleEn} is about ${rule.focusEn}.`,
    "- A strong explanation is always clear, step-by-step, and grounded in an example.",
    "- Start small, practise it, get feedback, and then refine it.",
  ];
}

function buildLesson(path, moduleItem, lesson) {
  const context = getContext(path.id);
  const rule = buildRule(path.id, lesson);
  const example = buildExample(rule, lesson, context);
  const contentEn = [
    `## ${lesson.titleEn}`,
    "",
    ...buildIntroParagraphs(path, moduleItem, lesson, rule, context, "en"),
    "",
    "### What You Will Learn",
    ...buildLearningGoals(lesson, rule, "en"),
    "",
    "### What It Is",
    ...buildWhatItIsCopy(lesson, "en"),
    "",
    "### Why It Matters",
    ...buildWhyItMattersCopy(lesson, context, "en"),
    "",
    "### Think Of It Like This",
    buildSimpleAnalogy(rule, lesson, "en"),
    "",
    "### How It Works Step by Step",
    ...buildHowItWorksSteps(lesson, rule, "en"),
    "",
    "### Key Concepts",
    ...rule.conceptEn(lesson.titleEn).map((item) => `- ${item}`),
    "",
    "### When To Use It",
    ...buildWhenToUse(lesson, context, "en"),
    "",
    "### Real Example",
    example.en,
    "",
    "### Common Mistakes",
    ...buildCommonMistakes(lesson, "en"),
    "",
    "### How To Apply It",
    ...buildApplyGuidance(lesson, rule, "en"),
    "",
    "### Assignment Challenge",
    ...buildAssignmentChallenge(lesson, rule, context, "en"),
    "",
    "### Quick Self-Check",
    ...buildQuickCheck(lesson, context, "en"),
    "",
    "### Summary",
    ...buildSummaryPoints(lesson, rule, "en"),
  ].join("\n");

  const contentBn = [
    `## ${lesson.titleBn}`,
    "",
    ...buildIntroParagraphs(path, moduleItem, lesson, rule, context, "bn"),
    "",
    "### এই লেসনে আপনি শিখবেন",
    ...buildLearningGoals(lesson, rule, "bn"),
    "",
    "### এটি আসলে কী",
    ...buildWhatItIsCopy(lesson, "bn"),
    "",
    "### কেন গুরুত্বপূর্ণ",
    ...buildWhyItMattersCopy(lesson, context, "bn"),
    "",
    "### সহজভাবে ভাবুন",
    buildSimpleAnalogy(rule, lesson, "bn"),
    "",
    "### ধাপে ধাপে কীভাবে কাজ করে",
    ...buildHowItWorksSteps(lesson, rule, "bn"),
    "",
    "### মূল ধারণা",
    ...rule.conceptBn(lesson.titleBn).map((item) => `- ${item}`),
    "",
    "### কখন ব্যবহার করবেন",
    ...buildWhenToUse(lesson, context, "bn"),
    "",
    "### বাস্তব উদাহরণ",
    example.bn,
    "",
    "### সাধারণ ভুল",
    ...buildCommonMistakes(lesson, "bn"),
    "",
    "### কীভাবে নিজের কাজে ব্যবহার করবেন",
    ...buildApplyGuidance(lesson, rule, "bn"),
    "",
    "### অ্যাসাইনমেন্ট",
    ...buildAssignmentChallenge(lesson, rule, context, "bn"),
    "",
    "### নিজেকে যাচাই করুন",
    ...buildQuickCheck(lesson, context, "bn"),
    "",
    "### সারসংক্ষেপ",
    ...buildSummaryPoints(lesson, rule, "bn"),
  ].join("\n");

  return {
    titleEn: lesson.titleEn,
    titleBn: lesson.titleBn,
    contentEn,
    contentBn,
    practice: buildPractice(rule, lesson),
    sandpack: null,
    resources: RESOURCE_SETS[rule.resourceSet] || RESOURCE_SETS.general,
  };
}
export function buildGeneratedPath(pathId) {
  const path = getPathById(pathId);
  if (!path) return {};
  return (path.modules || []).reduce((acc, moduleItem) => {
    acc[moduleItem.id] = (moduleItem.lessons || []).reduce((lessonAcc, lesson) => {
      lessonAcc[lesson.id] = buildEnhancedLesson(path, moduleItem, lesson);
      return lessonAcc;
    }, {});
    return acc;
  }, {});
}

export function mergeGeneratedPath(pathId, legacyCourseMap) {
  return mergeCourseMaps(pathId, legacyCourseMap, buildGeneratedPath(pathId));
}




function getLessonHint(lessonId) {
  return LESSON_TOPIC_HINTS[lessonId] || null;
}

function getHintKeywords(topicHint, lang = "en") {
  if (!topicHint) return [];
  return lang === "bn" ? topicHint.kb || [] : topicHint.ke || [];
}

function normalizeTitleText(title = "") {
  return String(title || "")
    .toLowerCase()
    .replace(/[()/:,&.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenizeTitle(title = "") {
  const stopWords = new Set(["and", "the", "of", "for", "with", "vs", "to", "a", "an", "ও", "এবং", "এর", "দিয়ে", "ওর", "এ"]);
  return normalizeTitleText(title)
    .split(" ")
    .map((item) => item.trim())
    .filter((item) => item && !stopWords.has(item));
}

function areTitlesCompatible(legacyTitle, canonicalTitle) {
  if (!legacyTitle || !canonicalTitle) return true;
  const legacyTokens = tokenizeTitle(legacyTitle);
  const canonicalTokens = tokenizeTitle(canonicalTitle);
  if (!legacyTokens.length || !canonicalTokens.length) return true;
  const canonicalSet = new Set(canonicalTokens);
  const overlap = legacyTokens.filter((item) => canonicalSet.has(item)).length;
  const ratio = overlap / Math.max(legacyTokens.length, canonicalTokens.length);
  return ratio >= 0.55;
}

function buildEnhancedIntroParagraphs(path, moduleItem, lesson, rule, context, lang = "en") {
  if (lang === "bn") {
    return [
      `${lesson.titleBn} হলো ${path.titleBn}-এর ${moduleItem.titleBn} মডিউলের একটি গুরুত্বপূর্ণ lesson। এই মডিউলে মূল ফোকাস ${moduleItem.summaryBn || moduleItem.titleBn}, তাই lesson-টি শুধু term শেখায় না, কাজেও কীভাবে ব্যবহার করতে হয় তা শেখায়।`,
      `বাস্তব SaaS workflow-এ ${lesson.titleBn} ব্যবহার করা হয় ${rule.focusBn}। EquiSaaS-এর মতো platform-এ এটি সাধারণত ${context.scenarioBn} নিয়ে কাজ করার সময় দরকার হয়, যাতে team ${context.outcomeBn} পারে।`,
      `তাই এই lesson-টিকে theory note হিসেবে নয়, teacher-guided class হিসেবে পড়ুন। আগে problem বুঝুন, তারপর key idea, তারপর step, example, আর assignment-এ যান।`,
    ];
  }

  return [
    `${lesson.titleEn} is an important lesson inside ${moduleItem.titleEn} of the ${path.titleEn}. The wider module focuses on ${moduleItem.summaryEn || moduleItem.titleEn}, so this lecture is meant to show not only the terms, but also how the idea is used in real work.`,
    `In SaaS delivery, teams use ${lesson.titleEn} to ${rule.focusEn}. Inside EquiSaaS, that usually appears while working on ${context.scenarioEn}, where the goal is to ${context.outcomeEn}.`,
    `So read this lesson like a teacher-guided class, not a glossary entry. First understand the problem, then the idea, then the steps, and finally the example and assignment.`,
  ];
}

function buildEnhancedLearningGoals(lesson, rule, topicHint, lang = "en") {
  const keywords = getHintKeywords(topicHint, lang).slice(0, 3);
  if (lang === "bn") {
    return [
      `- সহজ ভাষায় ${lesson.titleBn} কী, তা নিজের ভাষায় বলতে পারবেন।`,
      `- বুঝতে পারবেন কেন ${lesson.titleBn} ${rule.focusBn}।`,
      keywords.length ? `- ${keywords.join(", ")} এর মতো মূল বিষয়গুলো বাস্তব উদাহরণে চিনতে পারবেন।` : `- একটি বাস্তব উদাহরণে ${lesson.titleBn} কীভাবে কাজ করে তা দেখাতে পারবেন।`,
    ];
  }

  return [
    `- Explain ${lesson.titleEn} in simple words without hiding behind jargon.`,
    `- Describe why ${lesson.titleEn} helps a team ${rule.focusEn}.`,
    keywords.length ? `- Recognize the practical role of ${keywords.join(", ")} inside a real workflow.` : `- Show how ${lesson.titleEn} works inside a realistic workflow.`,
  ];
}

function buildEnhancedWhatItIsCopy(lesson, topicHint, lang = "en") {
  const keywords = getHintKeywords(topicHint, lang).slice(0, 4);
  if (topicHint) {
    if (lang === "bn") {
      return [
        topicHint.cb,
        keywords.length ? `${lesson.titleBn} ভালোভাবে ধরতে চাইলে ${keywords.join(", ")} এর মতো বিষয়গুলো একসাথে কীভাবে কাজ করে তা বুঝতে হবে।` : `${lesson.titleBn} ভালোভাবে ধরতে চাইলে input, rule, আর outcome-এর সম্পর্ক বুঝতে হবে।`,
      ];
    }
    return [
      topicHint.ce,
      keywords.length ? `To really understand ${lesson.titleEn}, notice how ideas like ${keywords.join(", ")} work together in one workflow.` : `To really understand ${lesson.titleEn}, notice how inputs, rules, and outcomes connect inside one workflow.`,
    ];
  }

  return lang === "bn"
    ? [
        `${lesson.titleBn} সহজভাবে বললে এমন একটি ধারণা, rule, বা working method যা কাজকে পরিষ্কার করে। এটি বলে দেয় কোন input লাগবে, কী outcome চাই, আর কোন ভুল করলে কাজ fragile হয়ে যাবে।`,
        `${lesson.titleBn} ভালোভাবে বুঝতে হলে এটি কোন সমস্যা সমাধান করে, কাজের flow কীভাবে বদলায়, আর reviewer কীভাবে বুঝবে কাজটি ঠিক হয়েছে - এই তিনটি জিনিস ধরতে হবে।`,
      ]
    : [
        `${lesson.titleEn} is a concept, rule, or working method that makes work clearer. It helps a team see what goes in, what should come out, and which mistakes would make the result fragile.`,
        `To truly understand ${lesson.titleEn}, focus on the problem it solves, how it changes the workflow, and how a reviewer can tell the work is correct.`,
      ];
}

function buildEnhancedWhyItMattersCopy(lesson, context, topicHint, lang = "en") {
  if (topicHint) {
    if (lang === "bn") {
      return [
        topicHint.wb,
        `বিশেষ করে ${context.scenarioBn}-এর মতো কাজে clarity খুব দরকার, কারণ ছোট misunderstanding-ও পরে বড় delay, broken handoff, বা low-quality output তৈরি করতে পারে।`,
      ];
    }
    return [
      topicHint.we,
      `That is especially true in work like ${context.scenarioEn}. A small misunderstanding early on can later create delivery delay, broken handoffs, or low-quality output.`,
    ];
  }

  return lang === "bn"
    ? [
        `${lesson.titleBn} গুরুত্বপূর্ণ কারণ team যদি একই mental picture না ধরে, তাহলে একই কাজ নিয়ে ভিন্ন expectation তৈরি হয়।`,
        `বিশেষ করে ${context.scenarioBn}-এর মতো কাজে clarity খুব দরকার।`,
      ]
    : [
        `${lesson.titleEn} matters because teams move slower when they do not share the same mental picture of the work.`,
        `That is especially true in work like ${context.scenarioEn}.`,
      ];
}

function buildEnhancedHowItWorksSteps(lesson, rule, topicHint, lang = "en") {
  const keywords = getHintKeywords(topicHint, lang).slice(0, 4);
  if (lang === "bn") {
    if (topicHint && topicHint.sb?.length) return topicHint.sb;
    return [
      `১. আগে ${lesson.titleBn}-এর আসল problem বা goal এক বাক্যে লিখুন।`,
      keywords.length ? `২. তারপর ${keywords.join(", ")} এর মতো মূল অংশগুলো আলাদা করে চিহ্নিত করুন।` : `২. তারপর input, rule, owner, আর outcome-এর মতো অংশগুলো আলাদা করুন।`,
      `৩. কাজের flow বা decision path আঁকুন, যাতে next step পরিষ্কার হয়।`,
      `৪. edge case, risk, বা review signal কোথায় আছে তা যাচাই করুন।`,
      `৫. শেষে এমন note বা artifact বানান যা অন্য teammate guessing ছাড়া follow করতে পারে।`,
    ];
  }

  if (topicHint && topicHint.se?.length) return topicHint.se;
  return [
    `1. Start by writing the main problem or goal behind ${lesson.titleEn} in one sentence.`,
    keywords.length ? `2. Identify the core pieces involved, such as ${keywords.join(", ")}.` : `2. Separate the key inputs, rules, owners, and outcomes involved in the topic.`,
    `3. Draw or explain the workflow so the next step becomes visible.`,
    `4. Check the edge case, risk, or review signal that could break the flow.`,
    `5. Finish with a note or artifact another teammate can follow without guessing.`,
  ];
}

function buildEnhancedQuickCheck(lesson, context, topicHint, lang = "en") {
  const keywords = getHintKeywords(topicHint, lang).slice(0, 2);
  if (lang === "bn") {
    return [
      `- আপনি কি এক বাক্যে বলতে পারেন ${lesson.titleBn} কোন সমস্যাটি সমাধান করে?`,
      keywords.length ? `- আপনি কি ${keywords.join(" এবং ")} কীভাবে কাজে লাগে তা explain করতে পারেন?` : `- আপনি কি এর main step গুলো notes ছাড়া বলতে পারেন?`,
      `- আপনি কি ${context.scenarioBn} থেকে একটি বাস্তব example দিতে পারেন?`,
      `- আপনি কি অন্তত একটি সাধারণ ভুল বলতে পারেন যা এড়ানো দরকার?`,
    ];
  }

  return [
    `- Can you explain in one sentence which problem ${lesson.titleEn} solves?`,
    keywords.length ? `- Can you explain how ${keywords.join(" and ")} matter inside the workflow?` : `- Can you name the main steps without looking at your notes?`,
    `- Can you give one real example from work like ${context.scenarioEn}?`,
    `- Can you mention at least one common mistake to avoid?`,
  ];
}

function buildEnhancedExample(rule, lesson, context, topicHint) {
  return {
    en: [
      topicHint?.ee || `Scenario: The EquiSaaS team is improving ${context.scenarioEn}. Use ${lesson.titleEn} to make the work easier to understand and safer to deliver.`,
      "",
      `- Start with the goal: what should improve, and for whom?`,
      `- Identify the main parts, rules, or signals that make ${lesson.titleEn} work well.`,
      `- Show the smallest useful version before trying to make it advanced.`,
      `- Review it with ${rule.audienceEn} and check whether the next person can follow it without guessing.`,
    ].join("\n"),
    bn: [
      topicHint?.eb || `উদাহরণ: EquiSaaS team এখন ${context.scenarioBn} আরও ভালো করছে। ${lesson.titleBn} ব্যবহার করে কাজটাকে এমনভাবে সাজান যাতে সবাই সহজে বুঝতে পারে এবং নিরাপদে execute করতে পারে।`,
      "",
      "- শুরুতেই এক বাক্যে বলুন: আসল লক্ষ্য কী, আর কাদের জন্য এটি দরকার?",
      `- ${lesson.titleBn} ভালোভাবে কাজ করতে যে অংশ, rule, বা signal লাগে সেগুলো লিখুন।`,
      "- আগে ছোট ও usable version বানান, পরে advanced করার কথা ভাবুন।",
      `- শেষে ${rule.audienceBn}-এর কাউকে দিয়ে দেখে নিন, তিনি guessing ছাড়া follow করতে পারেন কি না।`,
    ].join("\n"),
  };
}

function buildEnhancedAssignmentChallenge(lesson, rule, context, topicHint, lang = "en") {
  if (lang === "bn") {
    return [
      topicHint?.ab || `- ${context.scenarioBn} ধরে ${lesson.titleBn} ব্যবহার করে একটি ছোট ${rule.artifactBn} বা demo outline বানান।`,
      "- Deliverable-এ রাখুন: কী বানালেন, কেন এভাবে বানালেন, আর কোন rule বা assumption মেনেছেন।",
      "- Scope ছোট রাখুন, যাতে ৩০ থেকে ৬০ মিনিটের মধ্যে first version শেষ করা যায়।",
      "- Submit করার আগে নিজে চেক করুন: একজন teammate কি এটি দেখে guessing ছাড়া বুঝতে পারবে?",
    ];
  }

  return [
    topicHint?.ae || `- Create a small ${rule.artifactEn} or demo outline using ${lesson.titleEn} around ${context.scenarioEn}.`,
    "- Include what you built, why you structured it that way, and which rules or assumptions you followed.",
    "- Keep the scope small enough to finish a first version within 30 to 60 minutes.",
    "- Before submitting, check whether a teammate could understand it without guessing.",
  ];
}

function buildEnhancedSummaryPoints(lesson, rule, topicHint, lang = "en") {
  const keywords = getHintKeywords(topicHint, lang).slice(0, 3);
  if (lang === "bn") {
    return [
      keywords.length ? `- ${lesson.titleBn} বুঝতে হলে ${keywords.join(", ")} এর সম্পর্ক পরিষ্কারভাবে ধরতে হবে।` : `- ${lesson.titleBn} মানে হলো ${rule.focusBn}।`,
      "- ভালো explanation সবসময় clear, step-by-step, আর example-ভিত্তিক হয়।",
      "- ছোট করে শুরু করুন, practice করুন, feedback নিন, তারপর refine করুন।",
    ];
  }

  return [
    keywords.length ? `- ${lesson.titleEn} becomes clearer when you can explain the role of ${keywords.join(", ")}.` : `- ${lesson.titleEn} is about ${rule.focusEn}.`,
    "- A strong explanation is always clear, step-by-step, and grounded in an example.",
    "- Start small, practise it, get feedback, and then refine it.",
  ];
}

function enrichLegacyLessonCopyEnhanced(legacyContent, generatedContent, preferredTitle = "") {
  if (!hasMeaningfulLessonCopy(legacyContent)) return generatedContent;
  if (hasRichTeachingStructure(legacyContent)) {
    const parsed = parseLessonMarkdown(legacyContent);
    const lines = [`## ${preferredTitle || parsed.title}`, ""];
    if (parsed.intro) lines.push(parsed.intro, "");
    parsed.sections.forEach((section, index) => {
      lines.push(`### ${section.heading}`, section.body.trim());
      if (index < parsed.sections.length - 1) lines.push("");
    });
    return lines.join("\n");
  }

  const legacyParsed = parseLessonMarkdown(legacyContent);
  const generatedParsed = parseLessonMarkdown(generatedContent);
  const title = preferredTitle || generatedParsed.title || legacyParsed.title;
  const intro = legacyParsed.intro || generatedParsed.intro;
  const legacySections = new Map(legacyParsed.sections.map((section) => [normalizeSectionKey(section.heading), section.body]));
  const mergedSections = generatedParsed.sections.map((section) => {
    const legacyBody = legacySections.get(normalizeSectionKey(section.heading));
    return {
      heading: section.heading,
      body: hasMeaningfulSectionBody(legacyBody) ? legacyBody : section.body,
    };
  });

  const contentLines = [`## ${title}`, ""];
  if (intro) contentLines.push(intro, "");
  mergedSections.forEach((section, index) => {
    contentLines.push(`### ${section.heading}`, section.body.trim());
    if (index < mergedSections.length - 1) contentLines.push("");
  });
  return contentLines.join("\n");
}

function mergeEnhancedLesson(pathId, legacyLesson, generatedLesson) {
  if (!legacyLesson) return generatedLesson;

  const titlesCompatible = areTitlesCompatible(legacyLesson?.titleEn, generatedLesson?.titleEn) || areTitlesCompatible(legacyLesson?.titleBn, generatedLesson?.titleBn);
  const allowLegacySandpack = CODING_PATH_IDS.has(pathId) && titlesCompatible;
  const generatedSandpack = hasUsableSandpack(generatedLesson?.sandpack) ? generatedLesson.sandpack : null;
  const legacySandpack = allowLegacySandpack && hasUsableSandpack(legacyLesson?.sandpack) ? legacyLesson.sandpack : null;
  const resolvedSandpack = generatedSandpack || legacySandpack || null;
  const resolvedPractice = resolvedSandpack ? null : generatedLesson?.practice || (titlesCompatible ? legacyLesson?.practice : null) || null;
  const resolvedContentEn = titlesCompatible ? enrichLegacyLessonCopyEnhanced(legacyLesson?.contentEn, generatedLesson?.contentEn, generatedLesson?.titleEn) : generatedLesson?.contentEn;
  const resolvedContentBn = titlesCompatible ? enrichLegacyLessonCopyEnhanced(legacyLesson?.contentBn, generatedLesson?.contentBn, generatedLesson?.titleBn) : generatedLesson?.contentBn;

  return {
    ...generatedLesson,
    ...(titlesCompatible ? legacyLesson : {}),
    titleEn: generatedLesson?.titleEn,
    titleBn: generatedLesson?.titleBn,
    contentEn: resolvedContentEn,
    contentBn: resolvedContentBn,
    resources: mergeResources(titlesCompatible ? legacyLesson?.resources : [], generatedLesson?.resources),
    sandpack: resolvedSandpack,
    practice: resolvedPractice,
  };
}


function getPathHintRule(pathId, fallbackRule) {
  if (pathId === "product-ba") {
    return {
      ...CATEGORY_META.mapping,
      categoryId: "mapping",
      resourceSet: "business",
      labKind: "matrix",
      focusEn: "turn analysis work into reviewable artifacts that reduce ambiguity before delivery",
      focusBn: "analysis কাজকে reviewable artifact-এ রূপ দেওয়া যাতে delivery-এর আগে ambiguity কমে",
      signalEn: "keep business intent visible across the delivery flow",
      signalBn: "delivery flow জুড়ে business intent visible রাখা",
    };
  }
  if (pathId === "product-pm") {
    return {
      ...CATEGORY_META.strategy,
      categoryId: "strategy",
      resourceSet: "product",
      labKind: "planner",
      focusEn: "sequence product decisions around impact, evidence, and governance constraints",
      focusBn: "impact, evidence, আর governance constraint দেখে product decision sequence করা",
      signalEn: "turn broad product thinking into visible, reviewable choices",
      signalBn: "broad product thinking-কে visible আর reviewable choice-এ রূপ দেওয়া",
    };
  }
  if (pathId === "marketing-growth") {
    return {
      ...CATEGORY_META.growth,
      categoryId: "growth",
      resourceSet: "growth",
      labKind: "planner",
      focusEn: "align channel, message, and follow-up around measurable growth signals",
      focusBn: "measurable growth signal ঘিরে channel, message, আর follow-up align করা",
      signalEn: "move effort toward repeatable acquisition and retention outcomes",
      signalBn: "effort-কে repeatable acquisition আর retention outcome-এর দিকে সরানো",
    };
  }
  if (pathId === "marketing-success") {
    return {
      ...CATEGORY_META.operations,
      categoryId: "operations",
      resourceSet: "success",
      labKind: "board",
      focusEn: "turn customer support and success work into repeatable operating systems",
      focusBn: "customer support আর success work-কে repeatable operating system-এ রূপ দেওয়া",
      signalEn: "improve time-to-value and reduce churn risk with clearer handoffs",
      signalBn: "আরও পরিষ্কার handoff দিয়ে time-to-value বাড়ানো আর churn risk কমানো",
    };
  }
  return fallbackRule;
}

function buildEnhancedLesson(path, moduleItem, lesson) {
  const context = getContext(path.id);
  const topicHint = getLessonHint(lesson.id);
  const baseRule = buildRule(path.id, lesson);
  const rule = topicHint ? getPathHintRule(path.id, baseRule) : baseRule;
  const example = buildEnhancedExample(rule, lesson, context, topicHint);
  const keyConceptsEn = topicHint?.ke?.length ? topicHint.ke : rule.conceptEn(lesson.titleEn);
  const keyConceptsBn = topicHint?.kb?.length ? topicHint.kb : rule.conceptBn(lesson.titleBn);
  const contentEn = [
    `## ${lesson.titleEn}`,
    "",
    ...buildEnhancedIntroParagraphs(path, moduleItem, lesson, rule, context, "en"),
    "",
    "### What You Will Learn",
    ...buildEnhancedLearningGoals(lesson, rule, topicHint, "en"),
    "",
    "### What It Is",
    ...buildEnhancedWhatItIsCopy(lesson, topicHint, "en"),
    "",
    "### Why It Matters",
    ...buildEnhancedWhyItMattersCopy(lesson, context, topicHint, "en"),
    "",
    "### Think Of It Like This",
    buildSimpleAnalogy(rule, lesson, "en"),
    "",
    "### How It Works Step by Step",
    ...buildEnhancedHowItWorksSteps(lesson, rule, topicHint, "en"),
    "",
    "### Key Concepts",
    ...keyConceptsEn.map((item) => `- ${item}`),
    "",
    "### When To Use It",
    ...buildWhenToUse(lesson, context, "en"),
    "",
    "### Real Example",
    example.en,
    "",
    "### Common Mistakes",
    ...buildCommonMistakes(lesson, "en"),
    "",
    "### How To Apply It",
    ...buildApplyGuidance(lesson, rule, "en"),
    "",
    "### Assignment Challenge",
    ...buildEnhancedAssignmentChallenge(lesson, rule, context, topicHint, "en"),
    "",
    "### Quick Self-Check",
    ...buildEnhancedQuickCheck(lesson, context, topicHint, "en"),
    "",
    "### Summary",
    ...buildEnhancedSummaryPoints(lesson, rule, topicHint, "en"),
  ].join("\n");

  const contentBn = [
    `## ${lesson.titleBn}`,
    "",
    ...buildEnhancedIntroParagraphs(path, moduleItem, lesson, rule, context, "bn"),
    "",
    "### এই লেসনে আপনি শিখবেন",
    ...buildEnhancedLearningGoals(lesson, rule, topicHint, "bn"),
    "",
    "### এটি আসলে কী",
    ...buildEnhancedWhatItIsCopy(lesson, topicHint, "bn"),
    "",
    "### কেন গুরুত্বপূর্ণ",
    ...buildEnhancedWhyItMattersCopy(lesson, context, topicHint, "bn"),
    "",
    "### সহজভাবে ভাবুন",
    buildSimpleAnalogy(rule, lesson, "bn"),
    "",
    "### ধাপে ধাপে কীভাবে কাজ করে",
    ...buildEnhancedHowItWorksSteps(lesson, rule, topicHint, "bn"),
    "",
    "### মূল ধারণা",
    ...keyConceptsBn.map((item) => `- ${item}`),
    "",
    "### কখন ব্যবহার করবেন",
    ...buildWhenToUse(lesson, context, "bn"),
    "",
    "### বাস্তব উদাহরণ",
    example.bn,
    "",
    "### সাধারণ ভুল",
    ...buildCommonMistakes(lesson, "bn"),
    "",
    "### কীভাবে নিজের কাজে ব্যবহার করবেন",
    ...buildApplyGuidance(lesson, rule, "bn"),
    "",
    "### অ্যাসাইনমেন্ট",
    ...buildEnhancedAssignmentChallenge(lesson, rule, context, topicHint, "bn"),
    "",
    "### নিজেকে যাচাই করুন",
    ...buildEnhancedQuickCheck(lesson, context, topicHint, "bn"),
    "",
    "### সারসংক্ষেপ",
    ...buildEnhancedSummaryPoints(lesson, rule, topicHint, "bn"),
  ].join("\n");

  return {
    titleEn: lesson.titleEn,
    titleBn: lesson.titleBn,
    contentEn,
    contentBn,
    practice: buildPractice(rule, lesson),
    sandpack: null,
    resources: RESOURCE_SETS[rule.resourceSet] || RESOURCE_SETS.general,
  };
}
