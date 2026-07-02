import { mergeGeneratedPath } from "../generated-course-utils.js";
import { BACKEND_MONTH_ONE } from "./engineering-backend-month-one.js";

// ==========================================
// ENGINEERING - BACKEND MASTERCLASS
// ==========================================

const legacyLesson = (titleEn, titleBn, contentEn, contentBn, customSandpack = null, resources = []) => ({
  titleEn,
  titleBn,
  contentEn,
  contentBn,
  sandpack: customSandpack,
  resources,
});

const generateSandpack = (reactCode) => ({
  template: "react",
  files: {
    "/App.js": { code: reactCode },
  },
});

const LEGACY_BACKEND_COURSES = {
  "be-m1": {
    "be-1-1": {
      titleBn: "Laravel/Node কোর কনসেপ্ট",
      titleEn: "Laravel/Node Core Concepts",
      contentBn: `## Laravel/Node কোর কনসেপ্ট

Backend development-এর সবচেয়ে গুরুত্বপূর্ণ mental model হলো request lifecycle বোঝা। Frontend থেকে একটি request আসার পর সেটি সরাসরি database-এ যায় না; বরং router, middleware, controller, service, আর data layer-এর মতো কয়েকটি দায়িত্বভিত্তিক ধাপের মধ্য দিয়ে অগ্রসর হয়। Laravel এবং Express-এর syntax আলাদা হলেও architecture-এর মূল উদ্দেশ্য একই: প্রতিটি layer-এর দায়িত্ব স্পষ্ট রাখা।

যখন architecture পরিষ্কার থাকে, তখন debugging অনেক সহজ হয়ে যায়। Authentication middleware-এ error হলে আপনি জানেন validation layer পরীক্ষা করতে হবে; business rule ভাঙলে service layer দেখতে হবে; আর wrong response shape এলে controller বা serializer দেখতে হবে। এই separation production system-এ speed ও reliability দুটোই বাড়ায়।

একজন শক্তিশালী backend engineer framework মুখস্থ করে না, flow বোঝে। Request কোথায় ঢুকছে, কোথায় filter হচ্ছে, কোথায় business rule apply হচ্ছে, আর কোথায় data persist হচ্ছে তা map করতে পারলে আপনি Laravel, Node, Nest, Fastify বা অন্য যেকোনো backend stack-এ দ্রুত মানিয়ে নিতে পারবেন।

### মূল ধারণা
- **Router** incoming path ও method দেখে সঠিক handler বেছে নেয়।
- **Middleware** auth, validation, logging, rate limit-এর মতো cross-cutting concern সামলায়।
- **Controller** HTTP request/response-এর boundary layer হিসেবে কাজ করে।
- **Service layer** business logic-কে framework-specific code থেকে আলাদা রাখে।
- **Repository বা data access layer** database query ও persistence detail isolate করে।

### উদাহরণ
\`\`\`js
// EN: The router receives the HTTP request and forwards it to the controller.
// BN: router HTTP request নিয়ে controller-এর কাছে পাঠাচ্ছে।
app.get("/members/:id", async (req, res) => {
  const payload = await memberController.show(req.params.id);
  res.json(payload);
});

// EN: The controller keeps HTTP concerns thin and delegates the real work.
// BN: controller HTTP concern-কে পাতলা রেখে মূল কাজ service-এ পাঠায়।
const memberController = {
  async show(memberId) {
    return memberService.getPublicProfile(memberId);
  },
};

// EN: The service owns business rules and talks to the repository.
// BN: service business rule সামলায় এবং repository-এর সাথে কাজ করে।
const memberService = {
  async getPublicProfile(memberId) {
    return memberRepository.findPublicById(memberId);
  },
};
\`\`\``,
      contentEn: `## Laravel/Node Core Concepts

The first serious backend skill is understanding the request lifecycle. A browser request does not jump straight into the database; it moves through a sequence of responsibilities such as routing, middleware, controllers, services, and persistence. Laravel and Express expose those steps with different APIs, but the architectural goal is the same: each layer should do one job clearly.

That clarity becomes extremely valuable when systems grow. If authentication is failing, you inspect middleware. If a business rule is wrong, you inspect the service. If a response shape is inconsistent, you inspect the controller or serializer. Layered architecture reduces guessing, which means faster debugging, safer refactors, and more reliable production behavior.

Strong backend engineers learn flows, not just framework syntax. Once you can trace where a request enters, where it is validated, where business logic runs, and where data is stored, you can move comfortably between Laravel, Express, NestJS, or other server frameworks without losing your footing.

### Key Concepts
- **Routing** matches an incoming HTTP method and URL to the correct handler.
- **Middleware** handles cross-cutting concerns such as auth, validation, logging, and throttling.
- **Controllers** sit at the HTTP boundary and shape request/response behavior.
- **Services** contain business rules that should remain independent from framework plumbing.
- **Repositories or data-access layers** isolate queries and persistence details from the rest of the app.

### Example
\`\`\`js
// EN: The router receives the HTTP request and forwards it to the controller.
// BN: router HTTP request নিয়ে controller-এর কাছে পাঠাচ্ছে।
app.get("/members/:id", async (req, res) => {
  const payload = await memberController.show(req.params.id);
  res.json(payload);
});

// EN: The controller keeps HTTP concerns thin and delegates the real work.
// BN: controller HTTP concern-কে পাতলা রেখে মূল কাজ service-এ পাঠায়।
const memberController = {
  async show(memberId) {
    return memberService.getPublicProfile(memberId);
  },
};

// EN: The service owns business rules and talks to the repository.
// BN: service business rule সামলায় এবং repository-এর সাথে কাজ করে।
const memberService = {
  async getPublicProfile(memberId) {
    return memberRepository.findPublicById(memberId);
  },
};
\`\`\``,
      sandpack: {
        template: "react",
        files: {
          "/App.js": {
            code: `// EN: Visualize how a backend request flows through layered architecture.\n// BN: layered architecture-এর মধ্য দিয়ে backend request কীভাবে যায় তা দেখানো হচ্ছে।\nimport React, { useState } from "react";\n\nconst steps = [\n  {\n    name: \"Request enters the app\",\n    detail: \"Frontend sends GET /members/42\",\n    tone: \"#dbeafe\",\n  },\n  {\n    name: \"Middleware validates access\",\n    detail: \"Auth + validation run before business logic\",\n    tone: \"#ffedd5\",\n  },\n  {\n    name: \"Controller shapes the HTTP response\",\n    detail: \"Controller calls a service instead of querying the DB directly\",\n    tone: \"#dcfce7\",\n  },\n  {\n    name: \"Service applies business rules\",\n    detail: \"Public profile rules and transformations live here\",\n    tone: \"#ede9fe\",\n  },\n  {\n    name: \"Repository fetches from storage\",\n    detail: \"Only the data layer talks to persistence details\",\n    tone: \"#fee2e2\",\n  },\n];\n\nexport default function App() {\n  const [activeIndex, setActiveIndex] = useState(0);\n  const active = steps[activeIndex];\n\n  return (\n    <div style={{ fontFamily: \"sans-serif\", padding: 20, maxWidth: 560 }}>\n      <h2>Request Lifecycle Map</h2>\n      <p>Click through each layer to build the backend mental model.</p>\n      <div style={{ display: \"grid\", gap: 10, marginTop: 16 }}>\n        {steps.map((step, index) => (\n          <button\n            key={step.name}\n            onClick={() => setActiveIndex(index)}\n            style={{\n              textAlign: \"left\",\n              border: index === activeIndex ? \"2px solid #2563eb\" : \"1px solid #cbd5e1\",\n              borderRadius: 14,\n              padding: 14,\n              background: step.tone,\n              cursor: \"pointer\",\n            }}\n          >\n            <strong>{index + 1}. {step.name}</strong>\n            <div style={{ marginTop: 6, color: \"#334155\" }}>{step.detail}</div>\n          </button>\n        ))}\n      </div>\n      <div style={{ marginTop: 18, padding: 16, borderRadius: 14, background: \"#0f172a\", color: \"#f8fafc\" }}>\n        <strong>Current focus:</strong>\n        <p style={{ marginBottom: 0 }}>{active.detail}</p>\n      </div>\n    </div>\n  );\n}` ,
          },
        },
      },
      resources: [
        { labelEn: "Official Docs", labelBn: "অফিসিয়াল ডকস", url: "https://laravel.com/docs/12.x/lifecycle" },
        { labelEn: "FreeCodeCamp Guide", labelBn: "ফ্রিকোডক্যাম্প গাইড", url: "https://www.freecodecamp.org/learn/back-end-development-and-apis/basic-node-and-express/meet-the-node-console" },
        { labelEn: "Top YouTube Tutorial", labelBn: "ইউটিউব টিউটোরিয়াল", url: "https://www.youtube.com/watch?v=Oe421EPjeBE" },
      ],
    },
    "be-1-2": {
      titleBn: "REST API ডিজাইন",
      titleEn: "REST API Design",
      contentBn: `## REST API ডিজাইন

REST API design-এর মূল লক্ষ্য হলো backend interface-কে predictable ও consistent রাখা। যখন আপনার frontend, mobile app, admin panel, বা external integration একই API ব্যবহার করবে, তখন naming, HTTP method, status code, আর response shape পরিষ্কার না থাকলে দ্রুত confusion তৈরি হয়। একটি ভালো API এমন হওয়া উচিত যা documentation না দেখেও অনেকটা আন্দাজ করা যায়।

Resource-first thinking এখানে খুব গুরুত্বপূর্ণ। \`/users\`, \`/orders\`, \`/courses\`-এর মতো noun-based endpoint API-কে domain model-এর সাথে align রাখে। এরপর method অনুযায়ী intent বোঝানো হয়: \`GET\` fetch করে, \`POST\` create করে, \`PATCH\` update করে, \`DELETE\` remove করে। এই discipline client developer-এর cognitive load কমায়।

Production API-তে শুধু CRUD হলেই হয় না। Input validation, pagination, filtering, error contract, idempotency, আর versioning strategy আগেভাগে ভাবতে হয়। ভালো API design হলো product thinking-এর অংশ, কারণ এটি সরাসরি developer experience, integration speed, আর long-term maintainability-কে প্রভাবিত করে।

### মূল ধারণা
- **Resource-oriented URL** noun ব্যবহার করে domain entity বোঝায়।
- **HTTP methods** action-এর intent প্রকাশ করে।
- **Status codes** client-কে outcome দ্রুত বুঝতে সাহায্য করে।
- **Consistent response shape** frontend handling সহজ করে।
- **Pagination ও filtering** বড় dataset-এর API-কে production-ready করে।

### উদাহরণ
\`\`\`js
// EN: Use nouns for resources and methods for intent.
// BN: resource-এর জন্য noun এবং intent-এর জন্য method ব্যবহার করুন।
app.get("/api/courses", courseController.index);
app.post("/api/courses", courseController.store);
app.patch("/api/courses/:courseId", courseController.update);

// EN: Return a predictable JSON shape for the client.
// BN: client-এর জন্য predictable JSON shape রিটার্ন করুন।
res.status(200).json({
  data: courses,
  meta: { page: 1, total: 24 },
});
\`\`\``,
      contentEn: `## REST API Design

REST API design is about making your backend interface predictable, consistent, and easy to integrate with. The moment multiple clients depend on the same API, such as a web app, admin panel, and future mobile app, naming discipline becomes essential. Clean URL structure, clear HTTP methods, stable response shapes, and meaningful status codes reduce friction for everyone building on top of the service.

The best starting point is resource-first thinking. Endpoints like \`/users\`, \`/orders\`, and \`/courses\` map directly to business entities, while the HTTP method communicates intent: \`GET\` reads, \`POST\` creates, \`PATCH\` updates, and \`DELETE\` removes. That convention helps API consumers predict behavior instead of memorizing custom verbs for every endpoint.

Production-grade API design goes beyond CRUD. You need validation rules, pagination, filtering, error contracts, and a clear approach to idempotency and versioning. In other words, API design is product design for developers, and the quality of that interface has a direct impact on integration speed, frontend stability, and long-term maintainability.

### Key Concepts
- **Resource-oriented URLs** map cleanly to domain entities.
- **HTTP methods** communicate action intent without inventing custom verbs.
- **Status codes** provide immediate semantic feedback to the client.
- **Consistent payload shape** makes frontend parsing and error handling simpler.
- **Pagination, filtering, and versioning** keep APIs usable as the dataset and product grow.

### Example
\`\`\`js
// EN: Use nouns for resources and methods for intent.
// BN: resource-এর জন্য noun এবং intent-এর জন্য method ব্যবহার করুন।
app.get("/api/courses", courseController.index);
app.post("/api/courses", courseController.store);
app.patch("/api/courses/:courseId", courseController.update);

// EN: Return a predictable JSON shape for the client.
// BN: client-এর জন্য predictable JSON shape রিটার্ন করুন।
res.status(200).json({
  data: courses,
  meta: { page: 1, total: 24 },
});
\`\`\``,
      sandpack: {
        template: "react",
        files: {
          "/App.js": {
            code: `// EN: Build a consistent REST request preview.\n// BN: consistent REST request preview তৈরি করা হচ্ছে।\nimport React, { useMemo, useState } from "react";\n\nconst methods = [\"GET\", \"POST\", \"PATCH\", \"DELETE\"];\n\nexport default function App() {\n  const [method, setMethod] = useState(\"GET\");\n  const [resource, setResource] = useState(\"courses\");\n  const [id, setId] = useState(\"42\");\n\n  const preview = useMemo(() => {\n    const base = \"/api/\" + resource;\n    return method === \"GET\" || method === \"POST\" ? base : base + \"/\" + id;\n  }, [method, resource, id]);\n\n  return (\n    <div style={{ fontFamily: \"sans-serif\", padding: 20, maxWidth: 540 }}>\n      <h2>REST Endpoint Composer</h2>\n      <div style={{ display: \"grid\", gap: 12 }}>\n        <label>\n          Method\n          <select value={method} onChange={(event) => setMethod(event.target.value)} style={{ marginLeft: 12 }}>\n            {methods.map((item) => (\n              <option key={item}>{item}</option>\n            ))}\n          </select>\n        </label>\n        <label>\n          Resource\n          <input value={resource} onChange={(event) => setResource(event.target.value)} style={{ marginLeft: 12 }} />\n        </label>\n        <label>\n          Resource ID\n          <input value={id} onChange={(event) => setId(event.target.value)} style={{ marginLeft: 12 }} />\n        </label>\n      </div>\n      <div style={{ marginTop: 18, borderRadius: 14, padding: 16, background: \"#111827\", color: \"#f9fafb\" }}>\n        <div><strong>Preview:</strong> {method} {preview}</div>\n        <div style={{ marginTop: 8, color: \"#cbd5e1\" }}>\n          Good REST APIs keep paths resource-focused and response shapes consistent.\n        </div>\n      </div>\n    </div>\n  );\n}` ,
          },
        },
      },
      resources: [
        { labelEn: "Official Docs", labelBn: "অফিসিয়াল ডকস", url: "https://expressjs.com/en/guide/routing.html" },
        { labelEn: "FreeCodeCamp Guide", labelBn: "ফ্রিকোডক্যাম্প গাইড", url: "https://www.freecodecamp.org/learn/back-end-development-and-apis/basic-node-and-express/get-data-from-post-requests" },
        { labelEn: "Top YouTube Tutorial", labelBn: "ইউটিউব টিউটোরিয়াল", url: "https://www.youtube.com/watch?v=l8WPWK9mS5M" },
      ],
    },
    "be-1-3": {
      titleBn: "সার্ভিস লেয়ার ও মিডলওয়্যার",
      titleEn: "Service Layer & Middleware",
      contentBn: `## সার্ভিস লেয়ার ও মিডলওয়্যার

Controller-এর ভেতরে validation, authorization, business rule, database query, আর response mapping সব একসাথে লিখলে code দ্রুত জটিল হয়ে যায়। Service layer এই সমস্যার সমাধান করে, কারণ এটি business logic-কে আলাদা module-এ সরিয়ে নেয়। ফলে controller slim থাকে, test লেখা সহজ হয়, আর একই business rule একাধিক route বা job-এ reuse করা যায়।

Middleware আরেকটি গুরুত্বপূর্ণ abstraction। এটি request pipeline-এর এমন জায়গায় থাকে যেখানে repeated concern-গুলোকে reusable করা যায়। উদাহরণ হিসেবে authentication, request logging, locale detection, feature flag check, payload validation, rate limiting, এমনকি tenant resolution-ও middleware-এ রাখা যায়। এর ফলে core business logic clean থাকে।

Production-ready backend-এ service layer ও middleware একসাথে কাজ করে। Middleware request-কে safe ও consistent করে, তারপর service layer domain rule apply করে। এই separation ছাড়া system বড় হওয়ার সাথে সাথে every controller becomes a kitchen sink; separation থাকলে codebase disciplined থাকে এবং onboarding অনেক সহজ হয়।

### মূল ধারণা
- **Middleware** repeated HTTP pipeline concern আলাদা করে।
- **Service layer** business rule-এর home base হিসেবে কাজ করে।
- **Thin controller** maintainability ও testability বাড়ায়।
- **Reusable validation/auth flow** duplicate logic কমায়।
- **Layer separation** feature growth-এর সাথে codebase-কে stable রাখে।

### উদাহরণ
\`\`\`js
// EN: Middleware checks authentication before the controller runs.
// BN: controller চলার আগে middleware authentication যাচাই করছে।
app.get("/api/contributions", requireAuth, async (req, res) => {
  const data = await contributionController.index(req.user.id);
  res.json({ data });
});

// EN: The service owns the business calculation.
// BN: business calculation service layer-এ রাখা হয়েছে।
const contributionService = {
  async listVisibleForUser(userId) {
    return contributionRepository.findApprovedByUser(userId);
  },
};
\`\`\``,
      contentEn: `## Service Layer & Middleware

Once controllers start handling validation, authorization, business rules, persistence, and response shaping all at once, the backend becomes hard to reason about. A service layer fixes that by moving business logic into dedicated modules. The controller stays thin, tests become easier to write, and the same rule can be reused from HTTP routes, background jobs, or CLI tasks without duplication.

Middleware solves a different but equally important problem: repeated pipeline concerns. Authentication, request logging, tenant resolution, input validation, feature-flag checks, and rate limiting all happen before or around the core business action. Middleware lets you apply those concerns consistently without rewriting them inside every controller.

In a well-structured backend, middleware makes the request safe and standardized, then services execute the domain logic. That separation keeps controllers readable, reduces regression risk, and makes growth much less painful as the codebase accumulates features, integrations, and team members.

### Key Concepts
- **Middleware** handles reusable request-pipeline concerns before business logic executes.
- **Service layers** centralize business rules outside controllers.
- **Thin controllers** improve readability, testing, and change safety.
- **Reusable auth and validation** reduce duplication across routes.
- **Layered separation** helps large codebases scale without collapsing into controller-heavy chaos.

### Example
\`\`\`js
// EN: Middleware checks authentication before the controller runs.
// BN: controller চলার আগে middleware authentication যাচাই করছে।
app.get("/api/contributions", requireAuth, async (req, res) => {
  const data = await contributionController.index(req.user.id);
  res.json({ data });
});

// EN: The service owns the business calculation.
// BN: business calculation service layer-এ রাখা হয়েছে।
const contributionService = {
  async listVisibleForUser(userId) {
    return contributionRepository.findApprovedByUser(userId);
  },
};
\`\`\``,
      sandpack: {
        template: "react",
        files: {
          "/App.js": {
            code: `// EN: Simulate middleware and service execution order.\n// BN: middleware এবং service execution order simulate করা হচ্ছে।\nimport React, { useMemo, useState } from "react";\n\nconst middlewareOptions = [\n  { id: \"auth\", label: \"Auth check\" },\n  { id: \"log\", label: \"Request logger\" },\n  { id: \"validate\", label: \"Payload validation\" },\n];\n\nexport default function App() {\n  const [enabled, setEnabled] = useState([\"auth\", \"validate\"]);\n\n  const execution = useMemo(() => {\n    const chosen = middlewareOptions.filter((item) => enabled.includes(item.id)).map((item) => item.label);\n    return [...chosen, \"Controller\", \"Service\", \"Repository\"];\n  }, [enabled]);\n\n  const toggle = (id) => {\n    setEnabled((current) =>\n      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]\n    );\n  };\n\n  return (\n    <div style={{ fontFamily: \"sans-serif\", padding: 20, maxWidth: 560 }}>\n      <h2>Middleware + Service Flow</h2>\n      <div style={{ display: \"flex\", gap: 10, flexWrap: \"wrap\" }}>\n        {middlewareOptions.map((item) => (\n          <label key={item.id} style={{ border: \"1px solid #cbd5e1\", borderRadius: 999, padding: \"8px 12px\" }}>\n            <input\n              type=\"checkbox\"\n              checked={enabled.includes(item.id)}\n              onChange={() => toggle(item.id)}\n              style={{ marginRight: 8 }}\n            />\n            {item.label}\n          </label>\n        ))}\n      </div>\n      <ol style={{ marginTop: 18, paddingLeft: 20 }}>\n        {execution.map((step) => (\n          <li key={step} style={{ marginBottom: 8 }}>{step}</li>\n        ))}\n      </ol>\n      <p style={{ color: \"#475569\" }}>\n        Reusable middleware keeps controllers clean, while services keep business rules reusable.\n      </p>\n    </div>\n  );\n}` ,
          },
        },
      },
      resources: [
        { labelEn: "Official Docs", labelBn: "অফিসিয়াল ডকস", url: "https://expressjs.com/en/guide/using-middleware.html" },
        { labelEn: "FreeCodeCamp Guide", labelBn: "ফ্রিকোডক্যাম্প গাইড", url: "https://www.freecodecamp.org/learn/back-end-development-and-apis/basic-node-and-express/implement-a-root-level-request-logger-middleware" },
        { labelEn: "Top YouTube Tutorial", labelBn: "ইউটিউব টিউটোরিয়াল", url: "https://www.youtube.com/watch?v=Oe421EPjeBE" },
      ],
    },
  },
  "be-m2": {
    "be-2-1": legacyLesson("PostgreSQL Data Modeling", "PostgreSQL ডাটা মডেলিং", "Relational Design", "রিলেশনাল ডিজাইন", generateSandpack(`export default function() { return <div>Setup</div>; }`)),
    "be-2-2": legacyLesson("Migrations, Indexes & Tuning", "মাইগ্রেশন ও ইনডেক্স", "Indexes speed up read", "ইনডেক্স রিড স্পিড বাড়ায়", generateSandpack(`export default function() { return <div>Setup</div>; }`)),
    "be-2-3": legacyLesson("Eloquent/Prisma ORM Patterns", "Prisma ORM প্যাটার্ন", "Object Relational Mapping", "অবজেক্ট রিলেশনাল ম্যাপিং", generateSandpack(`export default function() { return <div>Setup</div>; }`), [
      { labelEn: "Prisma Docs", labelBn: "প্রিজমা ডকস", url: "https://www.prisma.io/docs" }
    ])
  },
  "be-m3": {
    "be-3-1": legacyLesson("Auth: Session vs JWT", "Auth: সেশন বনাম JWT", "Differences in Auth", "অথেনটিকেশনে পার্থক্য", generateSandpack(`export default function() { return <div>Setup</div>; }`)),
    "be-3-2": legacyLesson("RBAC/ABAC & Tenant Isolation", "RBAC/ABAC ও টেন্যান্ট আইসোলেশন", "Role based access", "রোল ভিত্তিক অ্যাক্সেস", generateSandpack(`export default function() { return <div>Setup</div>; }`)),
    "be-3-3": legacyLesson("Audit Logging & Rate Limiting", "অডিট লগিং ও রেট লিমিট", "Log actions & throttle", "অ্যাকশন লগ ও রেট লিমিট", generateSandpack(`export default function() { return <div>Setup</div>; }`), [
      { labelEn: "JWT Introduction", labelBn: "JWT ইন্ট্রোডাকশন", url: "https://jwt.io/introduction" }
    ])
  },
  "be-m4": {
    "be-4-1": legacyLesson("Queue/Job & Workers", "Queue/Job ও র্কয়ার", "Async Jobs", "অ্যাসিনক্রোনাস কাজ", generateSandpack(`export default function() { return <div>Setup</div>; }`)),
    "be-4-2": legacyLesson("Caching & Idempotency", "ক্যাশিং ও আইডেম্পোটেন্সি", "Redis cache", "রেডিস ক্যাশ", generateSandpack(`export default function() { return <div>Setup</div>; }`)),
    "be-4-3": legacyLesson("Failure Recovery", "ফেইলিওর রিকভারি", "Circuitbreakers and retries", "সার্কিট ব্রেকার ও রিট্রাই", generateSandpack(`export default function() { return <div>Setup</div>; }`), [
      { labelEn: "Redis Docs", labelBn: "রেডিস গাইড", url: "https://redis.io/docs" }
    ])
  },
  "be-m5": {
    "be-5-1": legacyLesson("Laravel Testing Stack", "লারাভল টেস্টিং", "Pest/PHPUnit", "পেস্ট/পিএইচপিইউনিট", generateSandpack(`export default function() { return <div>Setup</div>; }`)),
    "be-5-2": legacyLesson("Integration & Contract Tests", "ইন্টেগ্রেশন টেস্ট", "Testing DB integration", "ডিবি ইন্টেগ্রেশন টেস্ট", generateSandpack(`export default function() { return <div>Setup</div>; }`)),
    "be-5-3": legacyLesson("Dockerized Dev Env & CI", "ডকারাইজড ডেভ ও CI", "Docker containers", "ডকার কন্টেইনার", generateSandpack(`export default function() { return <div>Setup</div>; }`), [
      { labelEn: "Docker Get Started", labelBn: "ডকার শুরু করুন", url: "https://docs.docker.com/get-started/" }
    ])
  },
  "be-m6": {
    "be-6-1": legacyLesson("Multi-Tenant SaaS Arch", "মাল্টি-টেন্যান্ট SaaS", "SaaS database isolated", "সাস ডেটাবেস বিচ্ছিন্নকরণ", generateSandpack(`export default function() { return <div>Setup</div>; }`)),
    "be-6-2": legacyLesson("Well-Architected Review", "AWS Well-Architected", "Cloud pillars", "ক্লাউড পিলার", generateSandpack(`export default function() { return <div>Setup</div>; }`)),
    "be-6-3": legacyLesson("SRE Basics & 12-Factor", "SRE ও 12-Factor", "Reliability engineering", "রিলায়েবিলিটি ইঞ্জিনিয়ারিং", generateSandpack(`export default function() { return <div>Setup</div>; }`), [
      { labelEn: "12-Factor App", labelBn: "১২-ফ্যাক্টর অ্যাপ", url: "https://12factor.net/" }
    ])
  }
};

LEGACY_BACKEND_COURSES["be-m1"] = BACKEND_MONTH_ONE;

export const BACKEND_COURSES = mergeGeneratedPath("se-backend", LEGACY_BACKEND_COURSES);


