import { mergeGeneratedPath } from "../generated-course-utils.js";
import { DEVOPS_MONTH_ONE } from "./engineering-devops-month-one.js";

// ==========================================
// ENGINEERING - DEVOPS & PLATFORM MASTERCLASS
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

const LEGACY_DEVOPS_COURSES = {
  "do-m1": {
    "do-1-1": {
      titleBn: "Git/GitHub ফ্লো",
      titleEn: "Git/GitHub Flow",
      contentBn: `## Git/GitHub ফ্লো

একটি engineering team দ্রুত move করতে চাইলে version control discipline optional না, foundational। Git/GitHub flow-এর কাজ হলো stable branch-কে নিরাপদ রাখা, change-গুলোকে isolate করা, আর review-এর মাধ্যমে quality improve করা। যখন প্রতিটি feature, bug fix, বা config change আলাদা branch-এ করা হয়, তখন merge conflict সামলানো, regression isolate করা, আর rollback plan বানানো অনেক সহজ হয়ে যায়।

DevOps context-এ Git flow শুধু code collaboration নয়, operational safety-ও। CI trigger, deployment automation, release tagging, hotfix strategy, আর audit trail সবকিছুই branch ও pull request workflow-এর ওপর দাঁড়িয়ে থাকে। তাই branch naming, small commits, meaningful pull request description, আর required review culture production readiness-এর অংশ।

### মূল ধারণা
- **\`main\`** বা protected branch সবসময় releasable state-এ রাখা হয়।
- **Feature branch** risky change-কে isolated workspace দেয়।
- **Pull request** discussion, review, CI result, আর merge discipline এক জায়গায় আনে।
- **Small commits** history scan করা ও rollback সহজ করে।
- **Branch protection** accidental direct push বা unreviewed merge ঠেকায়।

### উদাহরণ
\`\`\`bash
# EN: Start new work from the latest stable branch.
# BN: সর্বশেষ stable branch থেকে নতুন কাজ শুরু করুন।
git checkout main
git pull origin main
git checkout -b feat/ci-health-check

# EN: Commit in small, understandable snapshots.
# BN: ছোট ছোট বোঝা যায় এমন snapshot আকারে commit করুন।
git add .github/workflows/ci.yml
git commit -m "feat: add ci workflow health checks"

# EN: Push the branch and open a pull request for review.
# BN: branch push করে review-এর জন্য pull request খুলুন।
git push origin feat/ci-health-check
\`\`\``,
      contentEn: `## Git/GitHub Flow

High-performing teams do not treat version control as an afterthought. Git/GitHub flow provides the operational structure that keeps the stable branch trustworthy while allowing engineers to work in parallel. By isolating each feature, bug fix, and infrastructure change on its own branch, teams reduce risk, simplify review, and make rollbacks much less painful.

In DevOps, this matters beyond collaboration. CI runs are attached to pull requests, deployment policies often depend on branch state, and release confidence depends on having a clean audit trail. That is why branch naming, small commits, descriptive pull requests, and protected merge rules are not process theater; they are production safeguards.

### Key Concepts
- **A protected \`main\` branch** stays releasable and trustworthy.
- **Feature branches** isolate work and reduce accidental breakage.
- **Pull requests** combine review, CI status, and architectural discussion.
- **Small commits** make change history easier to debug and revert.
- **Branch protection rules** prevent unsafe direct pushes and premature merges.

### Example
\`\`\`bash
# EN: Start new work from the latest stable branch.
# BN: সর্বশেষ stable branch থেকে নতুন কাজ শুরু করুন।
git checkout main
git pull origin main
git checkout -b feat/ci-health-check

# EN: Commit in small, understandable snapshots.
# BN: ছোট ছোট বোঝা যায় এমন snapshot আকারে commit করুন।
git add .github/workflows/ci.yml
git commit -m "feat: add ci workflow health checks"

# EN: Push the branch and open a pull request for review.
# BN: branch push করে review-এর জন্য pull request খুলুন।
git push origin feat/ci-health-check
\`\`\``,
      sandpack: {
        template: "react",
        files: {
          "/App.js": {
            code: `// EN: Simulate safe GitHub flow decisions.\n// BN: নিরাপদ GitHub flow decision simulate করা হচ্ছে।\nimport React, { useState } from "react";\n\nconst actions = [\n  { id: \"branch\", label: \"Create feature branch\", safe: true },\n  { id: \"commit\", label: \"Commit to feature branch\", safe: true },\n  { id: \"pr\", label: \"Open pull request\", safe: true },\n  { id: \"push-main\", label: \"Push directly to main\", safe: false },\n];\n\nexport default function App() {\n  const [history, setHistory] = useState([]);\n\n  const runAction = (action) => {\n    setHistory((current) => [...current, action]);\n  };\n\n  return (\n    <div style={{ fontFamily: \"sans-serif\", padding: 20, maxWidth: 560 }}>\n      <h2>GitHub Flow Simulator</h2>\n      <div style={{ display: \"flex\", gap: 8, flexWrap: \"wrap\" }}>\n        {actions.map((action) => (\n          <button key={action.id} onClick={() => runAction(action)} style={{ padding: \"10px 14px\" }}>\n            {action.label}\n          </button>\n        ))}\n      </div>\n      <div style={{ marginTop: 18, display: \"grid\", gap: 10 }}>\n        {history.map((item, index) => (\n          <div\n            key={index}\n            style={{\n              borderRadius: 12,\n              padding: 12,\n              background: item.safe ? \"#dcfce7\" : \"#fee2e2\",\n              border: item.safe ? \"1px solid #86efac\" : \"1px solid #fca5a5\",\n            }}\n          >\n            <strong>{item.label}</strong>\n            <div>{item.safe ? \"Safe workflow step recorded.\" : \"Blocked: protected branches should never receive direct pushes.\"}</div>\n          </div>\n        ))}\n      </div>\n    </div>\n  );\n}` ,
          },
        },
      },
      resources: [
        { labelEn: "Official Docs", labelBn: "অফিসিয়াল ডকস", url: "https://docs.github.com/get-started/using-github/github-flow" },
        { labelEn: "Git Basics Guide", labelBn: "গিট বেসিকস গাইড", url: "https://www.freecodecamp.org/news/learn-the-basics-of-git-in-under-10-minutes-da548267cc91/" },
        { labelEn: "Top YouTube Tutorial", labelBn: "ইউটিউব টিউটোরিয়াল", url: "https://www.youtube.com/watch?v=RGOj5yH7evk" },
      ],
    },
    "do-1-2": {
      titleBn: "CI পাইপলাইন ধারণা",
      titleEn: "CI Pipeline Concepts",
      contentBn: `## CI পাইপলাইন ধারণা

Continuous Integration-এর মূল উদ্দেশ্য হলো change merge হওয়ার আগেই দ্রুত feedback দেওয়া। যদি lint, test, type-check, build, আর security scan automated না থাকে, তাহলে breakage অনেক সময় production-এর কাছাকাছি গিয়ে ধরা পড়ে। CI pipeline team-কে একটি repeatable trust system দেয়, যেখানে প্রতিটি commit একই মানদণ্ডে যাচাই হয়।

একটি ভালো pipeline fast, deterministic, এবং readable হয়। Fast মানে developer workflow slow না করা; deterministic মানে same input-এ same result পাওয়া; readable মানে কোন stage-এ failure হয়েছে তা সঙ্গে সঙ্গে বোঝা। DevOps engineer-এর কাজ শুধু pipeline চালু করা নয়, বরং এমন feedback loop তৈরি করা যাতে engineers নিজেরাই সমস্যা দ্রুত fix করতে পারে।

### মূল ধারণা
- **Trigger** সাধারণত push, pull request, বা manual dispatch থেকে আসে।
- **Stages** যেমন lint, test, build, scan আলাদা concern verify করে।
- **Fail fast** strategy developer-কে দ্রুত signal দেয়।
- **Artifacts** build output বা report share করতে সাহায্য করে।
- **Parallel jobs** feedback time কমাতে গুরুত্বপূর্ণ।

### উদাহরণ
\`\`\`yaml
# EN: A simple CI workflow with three core stages.
# BN: তিনটি core stage-সহ একটি সাধারণ CI workflow।
name: ci

on:
  pull_request:
  push:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build:lms
\`\`\``,
      contentEn: `## CI Pipeline Concepts

Continuous Integration exists to shorten the feedback loop between writing code and learning whether that code is safe to merge. Without automation, teams discover problems too late, often during staging or production deployment. A CI pipeline establishes a repeatable quality gate so every commit is checked against the same expectations: linting, tests, type safety, builds, and sometimes security scanning.

The best pipelines are fast, deterministic, and readable. Fast means developers do not avoid running them. Deterministic means the same input yields the same result. Readable means a failure tells you exactly what broke and where. A strong DevOps setup is not just about adding more checks; it is about building a feedback system that engineers trust and can act on quickly.

### Key Concepts
- **Triggers** start workflows from pushes, pull requests, or manual runs.
- **Stages** separate concerns such as linting, testing, building, and scanning.
- **Fail-fast design** reduces wasted time after an early failure.
- **Artifacts** preserve build outputs, logs, and reports for inspection.
- **Parallel jobs** shorten feedback time when checks are independent.

### Example
\`\`\`yaml
# EN: A simple CI workflow with three core stages.
# BN: তিনটি core stage-সহ একটি সাধারণ CI workflow।
name: ci

on:
  pull_request:
  push:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build:lms
\`\`\``,
      sandpack: {
        template: "react",
        files: {
          "/App.js": {
            code: `// EN: Toggle pipeline stages and see whether the workflow passes.\n// BN: pipeline stage toggle করে workflow pass/fail দেখা হচ্ছে।\nimport React, { useState } from "react";\n\nconst defaultStages = [\n  { id: \"lint\", label: \"Lint\", ok: true },\n  { id: \"test\", label: \"Tests\", ok: true },\n  { id: \"build\", label: \"Build\", ok: true },\n  { id: \"scan\", label: \"Security Scan\", ok: true },\n];\n\nexport default function App() {\n  const [stages, setStages] = useState(defaultStages);\n\n  const toggleStage = (id) => {\n    setStages((current) => current.map((stage) => (stage.id === id ? { ...stage, ok: !stage.ok } : stage)));\n  };\n\n  const allGreen = stages.every((stage) => stage.ok);\n\n  return (\n    <div style={{ fontFamily: \"sans-serif\", padding: 20, maxWidth: 560 }}>\n      <h2>CI Pipeline Health</h2>\n      <p>Turn stages on or off to simulate broken pipeline checks.</p>\n      <div style={{ display: \"grid\", gap: 10 }}>\n        {stages.map((stage) => (\n          <label key={stage.id} style={{ border: \"1px solid #cbd5e1\", borderRadius: 12, padding: 12 }}>\n            <input type=\"checkbox\" checked={stage.ok} onChange={() => toggleStage(stage.id)} style={{ marginRight: 10 }} />\n            {stage.label}\n          </label>\n        ))}\n      </div>\n      <div style={{ marginTop: 18, padding: 16, borderRadius: 12, background: allGreen ? \"#dcfce7\" : \"#fee2e2\" }}>\n        <strong>{allGreen ? \"Pipeline passing\" : \"Pipeline failing\"}</strong>\n        <div>{allGreen ? \"Safe to merge after review.\" : \"One or more quality gates failed. Fix before merge.\"}</div>\n      </div>\n    </div>\n  );\n}` ,
          },
        },
      },
      resources: [
        { labelEn: "Official Docs", labelBn: "অফিসিয়াল ডকস", url: "https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions" },
        { labelEn: "Workflow Syntax Guide", labelBn: "ওয়ার্কফ্লো সিনট্যাক্স গাইড", url: "https://docs.github.com/actions/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions" },
        { labelEn: "Top YouTube Tutorial", labelBn: "ইউটিউব টিউটোরিয়াল", url: "https://www.youtube.com/watch?v=BQrohJ3PT7I" },
      ],
    },
    "do-1-3": {
      titleBn: "এনভায়রনমেন্ট কনফিগ স্ট্যান্ডার্ড",
      titleEn: "Environment Config Standards",
      contentBn: `## এনভায়রনমেন্ট কনফিগ স্ট্যান্ডার্ড

Configuration আর code এক জিনিস নয়। API base URL, secret key, database credential, feature flag, আর deployment-specific setting কখনো source code-এর ভেতরে hardcode করা উচিত নয়। এগুলো environment-এর সাথে বদলায়, তাই environment variable, secret manager, বা deployment config layer-এ রাখা সঠিক practice। এতে codebase share করা, open-source করা, বা environment switch করা অনেক safer হয়।

ভালো config standard-এর লক্ষ্য হলো predictability। কোন variable required, কোনটা optional, default কোথায় safe, আর local development-এর জন্য \`.env.example\` কীভাবে maintain হবে; এগুলো লিখিতভাবে পরিষ্কার থাকা দরকার। DevOps এবং app teams যদি config contract পরিষ্কার না রাখে, তাহলে “works on my machine” problem, leaked secret, আর broken deployment খুব দ্রুত দেখা দেয়।

### মূল ধারণা
- **Secrets** কখনো repo-তে commit করা যাবে না।
- **Environment variables** deploy-specific config বহন করে।
- **\`.env.example\`** onboarding-এ required variables বোঝাতে সাহায্য করে।
- **Validation at startup** missing config আগে থেকেই ধরতে সাহায্য করে।
- **Dev/prod parity** local আর production behavior gap কমায়।

### উদাহরণ
\`\`\`js
// EN: Validate required configuration before starting the app.
// BN: app চালুর আগে required configuration যাচাই করুন।
const requiredEnv = ["API_BASE_URL", "SESSION_SECRET"];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(\`Missing environment variable: \${key}\`);
  }
}

export const config = {
  apiBaseUrl: process.env.API_BASE_URL,
  sessionSecret: process.env.SESSION_SECRET,
};
\`\`\``,
      contentEn: `## Environment Config Standards

Configuration is not the same thing as code. API endpoints, secrets, database credentials, feature flags, and deploy-specific settings change across environments, so they should not be hardcoded into the codebase. Environment variables and secret-management layers exist to keep configuration separate, secure, and portable across local, staging, and production systems.

Good configuration standards are about predictability, not just secrecy. Teams should know which variables are required, which are optional, what safe defaults exist, and how local developers are expected to bootstrap their setup. That is why files like \`.env.example\`, startup validation, and documented config contracts matter so much. Without them, onboarding slows down, deployments fail unexpectedly, and secrets leak more easily.

### Key Concepts
- **Secrets must never be committed** to the repository.
- **Environment variables** carry deploy-specific behavior safely outside the codebase.
- **\`.env.example\`** documents required settings for local setup.
- **Startup validation** catches missing configuration before runtime failures.
- **Dev/prod parity** reduces environment-specific surprises.

### Example
\`\`\`js
// EN: Validate required configuration before starting the app.
// BN: app চালুর আগে required configuration যাচাই করুন।
const requiredEnv = ["API_BASE_URL", "SESSION_SECRET"];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(\`Missing environment variable: \${key}\`);
  }
}

export const config = {
  apiBaseUrl: process.env.API_BASE_URL,
  sessionSecret: process.env.SESSION_SECRET,
};
\`\`\``,
      sandpack: {
        template: "react",
        files: {
          "/App.js": {
            code: `// EN: Teach required-vs-optional config in a simple dashboard.\n// BN: required বনাম optional config একটি সহজ dashboard-এ দেখানো হচ্ছে।\nimport React, { useState } from "react";\n\nconst defaults = {\n  API_BASE_URL: \"https://api.example.com\",\n  SESSION_SECRET: \"\",\n  FEATURE_FLAG_BETA: \"false\",\n};\n\nexport default function App() {\n  const [env, setEnv] = useState(defaults);\n  const missing = [\"API_BASE_URL\", \"SESSION_SECRET\"].filter((key) => !env[key]);\n\n  const updateValue = (key, value) => {\n    setEnv((current) => ({ ...current, [key]: value }));\n  };\n\n  return (\n    <div style={{ fontFamily: \"sans-serif\", padding: 20, maxWidth: 620 }}>\n      <h2>Config Contract Checker</h2>\n      {Object.keys(env).map((key) => (\n        <label key={key} style={{ display: \"block\", marginBottom: 12 }}>\n          <div style={{ fontWeight: 700 }}>{key}</div>\n          <input\n            value={env[key]}\n            onChange={(event) => updateValue(key, event.target.value)}\n            style={{ width: \"100%\", padding: 10, borderRadius: 10, border: \"1px solid #cbd5e1\" }}\n          />\n        </label>\n      ))}\n      <div style={{ borderRadius: 12, padding: 16, background: missing.length ? \"#fee2e2\" : \"#dcfce7\" }}>\n        <strong>{missing.length ? \"Missing required config\" : \"Config ready\"}</strong>\n        <div>{missing.length ? missing.join(\", \") : \"All required environment variables are present.\"}</div>\n      </div>\n    </div>\n  );\n}` ,
          },
        },
      },
      resources: [
        { labelEn: "Official Docs", labelBn: "অফিসিয়াল ডকস", url: "https://nodejs.org/api/environment_variables.html" },
        { labelEn: "12-Factor Config Guide", labelBn: "১২-ফ্যাক্টর কনফিগ গাইড", url: "https://12factor.net/config?source=post_page-----bc8802cacdfd----------------------" },
        { labelEn: "Node Environment Tutorial", labelBn: "নোড এনভায়রনমেন্ট টিউটোরিয়াল", url: "https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs" },
      ],
    },
  },
  "do-m2": {
    "do-2-1": legacyLesson(
      "Docker & Containerization",
      "ডকার এবং কন্টেইনারাইজেশন",
      `# Containers: The Universal Shipping Boxes 📦
Before Docker, deploying code was like shipping individual items loose in a cargo ship. Sometimes things broke, sometimes the ship didn't have the right shelves. "It works on my machine!" was a common excuse.

**Docker** solves this by putting your code, its dependencies, and the operating system into a standardized **Shipping Box (Container)**. No matter if that box is on your laptop, an AWS server, or Google Cloud, it runs *exactly* the same way.`,
      `# কন্টেইনার: ইউনিভার্সাল শিপিং বক্স 📦
ডকারের আগে কোড ডেপ্লয় করা অনেকটা কার্গো জাহাজে খোলা মালামাল পাঠানোর মতো ছিল। মাঝেমাঝেই জিনিসপত্র ভেঙে যেত, আবার কখনো জাহাজে নির্দিষ্ট তাক থাকতো না। "আমার পিসিতে তো কাজ করে!" - এটি ছিল ডেভেলপারদের চেনা অজুহাত।

**Docker** এই সমস্যার সমাধান করে পুরো কোড, এর প্রয়োজনীয় ফাইল (dependencies), এবং অপারেটিং সিস্টেমকে একটি প্রমাণ সাইজের **শিপিং বক্স (কন্টেইনার)** এর ভেতরে ভরে। এই বক্সটা আপনার ল্যাপটপে চলুক, কি AWS সার্ভারে, কি Google Cloud-এ; সব জায়গায় এটি একদম একইভাবে চলবে।`,
      generateSandpack(`import React, { useState } from "react";
export default function App() {
  const [runsOn, setRunsOn] = useState("MacBook");

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h2>"It works on my machine!" Simulator</h2>
      <select onChange={e => setRunsOn(e.target.value)} style={{ padding: 10, marginBottom: 10 }}>
        <option>MacBook</option>
        <option>Windows PC</option>
        <option>AWS Ubuntu Server</option>
      </select>
      
      <div style={{ padding: 20, background: "#1e293b", color: "#61dafb", borderRadius: 8 }}>
        docker run -p 8080:80 my-app
        <p style={{ color: "white", marginTop: 20 }}>
          🚀 App is running perfectly on {runsOn} exactly as it was built!
        </p>
      </div>
    </div>
  );
}`)
    ),
    "do-2-2": legacyLesson("Local-Parity Dev Env", "লোকাল-প্যারিটি ডেভ এনভি", "Running PROD locally", "লোকালে প্রোডাকশন রান করা", generateSandpack(`export default function() { return <div>Setup</div>; }`)),
    "do-2-3": legacyLesson("Build Artifact Strategy", "বিল্ড আর্টিফ্যাক্ট স্ট্র্যাটেজি", "Optimizing image size", "ডকার ইমেজ সাইজ অপটিমাইজেশন", generateSandpack(`export default function() { return <div>Setup</div>; }`), [
      { labelEn: "Docker 101", labelBn: "ডকার বেসিকস", url: "https://www.docker.com/101-tutorial/" }
    ])
  },
  "do-m3": {
    "do-3-1": legacyLesson("Kubernetes Basics", "কুবারনেটিস বেসিকস", "Orchestrating containers", "কন্টেইনার অর্কেস্ট্রেশন", generateSandpack(`export default function() { return <div>Setup</div>; }`)),
    "do-3-2": legacyLesson("Release Strategies", "রিলিজ স্ট্র্যাটেজি", "Blue/Green and Canary", "ব্লু/গ্রিন ও ক্যানারি রিলিজ", generateSandpack(`export default function() { return <div>Setup</div>; }`)),
    "do-3-3": legacyLesson("Deploy Checklist", "ডেপ্লয় চেকলিস্ট", "Pre-flight checks", "প্রি-ফ্লাইট চেকস", generateSandpack(`export default function() { return <div>Setup</div>; }`), [
      { labelEn: "Kubernetes UI", labelBn: "কুবারনেটিস ড্যাশবোর্ড", url: "https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/" }
    ])
  },
  "do-m4": {
    "do-4-1": legacyLesson("Logs, Metrics & Tracing", "লগ, মেট্রিকস, ট্রেসিং", "The Three Pillars", "অবজারভেবিলিটির তিন স্তম্ভ", generateSandpack(`export default function() { return <div>Setup</div>; }`)),
    "do-4-2": legacyLesson("SLOs & Error Budgets", "SLO ও এরর বাজেট", "Setting targets", "টার্গেট নির্ধারণ", generateSandpack(`export default function() { return <div>Setup</div>; }`)),
    "do-4-3": legacyLesson("Alerting Hygiene", "অ্যালার্টিং হাইজিন", "Preventing alert fatigue", "অ্যালার্ট ফ্যাটিগ রোধ", generateSandpack(`export default function() { return <div>Setup</div>; }`), [
      { labelEn: "Grafana Dashboards", labelBn: "গ্রাফানা ড্যাশবোর্ডস", url: "https://grafana.com/" }
    ])
  },
  "do-m5": {
    "do-5-1": legacyLesson("Secrets Management", "সিক্রেটস ম্যানেজমেন্ট", "AWS KMS / HashiCorp Vault", "ভল্ট ম্যানেজমেন্ট", generateSandpack(`export default function() { return <div>Setup</div>; }`)),
    "do-5-2": legacyLesson("Backup & Recovery", "ব্যাকআপ ও রিকভারি", "Testing restores", "রিস্টোর টেস্টিং", generateSandpack(`export default function() { return <div>Setup</div>; }`)),
    "do-5-3": legacyLesson("Dependency Scanning", "ডিপেন্ডেন্সি স্ক্যানিং", "Dependabot & Snyk", "স্নাইক এবং ডিপেন্ডাবট", generateSandpack(`export default function() { return <div>Setup</div>; }`), [
      { labelEn: "Snyk Security", labelBn: "স্নাইক সিকিউরিটি", url: "https://snyk.io/" }
    ])
  },
  "do-m6": {
    "do-6-1": legacyLesson("Cost Optimization", "কস্ট অপটিমাইজেশন", "Spot instances and AutoScaling", "অটোস্কেলিং ও স্পট ইনস্ট্যান্স", generateSandpack(`export default function() { return <div>Setup</div>; }`)),
    "do-6-2": legacyLesson("Well-Architected Review", "Well-Architected রিভিউ", "Reviewing infra", "ইনফ্রাস্ট্রাকচার রিভিউ", generateSandpack(`export default function() { return <div>Setup</div>; }`)),
    "do-6-3": legacyLesson("Incident Game Day", "ইনসিডেন্ট গেম ডে", "Chaos Engineering", "ক্যাওস ইঞ্জিনিয়ারিং", generateSandpack(`export default function() { return <div>Setup</div>; }`), [
      { labelEn: "Chaos Monkey", labelBn: "ক্যাওস মাংকি", url: "https://netflix.github.io/chaosmonkey/" }
    ])
  }
};

LEGACY_DEVOPS_COURSES["do-m1"] = DEVOPS_MONTH_ONE;

export const DEVOPS_COURSES = mergeGeneratedPath("se-devops", LEGACY_DEVOPS_COURSES);

