import { mergeGeneratedPath } from "../generated-course-utils.js";
import { PRODUCT_BA_MONTH_ONE } from "./product-ba-month-one.js";
import { PRODUCT_PM_MONTH_ONE } from "./product-pm-month-one.js";

// ==========================================
// PRODUCT - BA & PM MASTERCLASS
// ==========================================

const legacyLesson = (titleEn, titleBn, contentEn, contentBn, resources = []) => ({
  titleEn,
  titleBn,
  contentEn,
  contentBn,
  sandpack: null,
  resources,
});

const LEGACY_PRODUCT_COURSES = {
  // --- BUSINESS ANALYSIS PATH (6 modules) ---
  "ba-m1": {
    "ba-1-1": {
      titleBn: "রিকোয়ারমেন্ট এলিসিটেশন",
      titleEn: "Requirement Elicitation",
      contentBn: `## রিকোয়ারমেন্ট এলিসিটেশন

Requirement elicitation মানে stakeholder যা বলছে তা শুধু লিখে রাখা নয়; বরং তারা আসলে কী সমস্যা সমাধান করতে চাইছে তা uncover করা। অনেক সময় stakeholder solution language-এ কথা বলে, যেমন "একটা dashboard লাগবে" বা "একটা approval button চাই।" BA-এর কাজ হলো কেন সেটি দরকার, কে ব্যবহার করবে, কোন workflow-এ করবে, আর success কীভাবে মাপা হবে তা বের করা।

ভালো elicitation interviews, workshops, observation, document review, আর process walkthrough-এর সমন্বয়। একটি requirement useful হতে হলে তা specific, testable, এবং business goal-এর সাথে aligned হতে হবে। তাই BA-কে active listening, probing question, assumption validation, আর conflict clarification শিখতে হয়।

### মূল ধারণা
- **Problem first** approach solution bias কমায়।
- **Open-ended প্রশ্ন** stakeholder-এর আসল context বের করে।
- **Functional ও non-functional** requirement আলাদা করে ধরতে হয়।
- **Assumption log** later confusion কমায়।
- **Validation** ছাড়া elicited note requirement হয় না।

### উদাহরণ
\`\`\`md
// EN: Translate a business ask into a clearer requirement statement.
// BN: business ask-কে পরিষ্কার requirement statement-এ রূপ দিন।
Stakeholder says:
"We need a button to speed up approvals."

Clarified requirement:
"Operations managers need to approve pending payout requests in under 2 minutes
so that member payouts are not delayed during peak hours."
\`\`\``,
      contentEn: `## Requirement Elicitation

Requirement elicitation is not just about writing down what stakeholders say. It is about uncovering the problem they are actually trying to solve. Stakeholders often speak in solution language, such as "we need a dashboard" or "add an approval button." A strong business analyst probes deeper to understand who needs it, in what workflow, under which constraints, and how success will be measured.

Effective elicitation combines interviews, workshops, observation, process walkthroughs, and document review. Useful requirements are specific, testable, and tied to business outcomes. That means analysts need more than note-taking skills. They need active listening, structured questioning, assumption management, and the ability to resolve ambiguity before it becomes engineering churn.

### Key Concepts
- **Problem-first discovery** helps avoid solution bias.
- **Open-ended questioning** reveals workflow, motivation, and constraints.
- **Functional and non-functional requirements** should be captured separately.
- **Assumption logs** reduce downstream confusion and rework.
- **Validation** turns raw notes into reliable requirements.

### Example
\`\`\`md
// EN: Translate a business ask into a clearer requirement statement.
// BN: business ask-কে পরিষ্কার requirement statement-এ রূপ দিন।
Stakeholder says:
"We need a button to speed up approvals."

Clarified requirement:
"Operations managers need to approve pending payout requests in under 2 minutes
so that member payouts are not delayed during peak hours."
\`\`\``,
      sandpack: {
        template: "react",
        files: {
          "/App.js": {
            code: `// EN: Convert a vague request into a clearer requirement.\n// BN: অস্পষ্ট request-কে পরিষ্কার requirement-এ রূপ দেওয়া হচ্ছে।\nimport React, { useState } from "react";\n\nconst examples = [\n  {\n    ask: "We need a dashboard.",\n    requirement: "Team leads need a dashboard that shows pending reviews, overdue items, and trust alerts at login.",\n  },\n  {\n    ask: "Add a new report.",\n    requirement: "Finance admins need a downloadable monthly payout report filtered by squad and date range.",\n  },\n];\n\nexport default function App() {\n  const [index, setIndex] = useState(0);\n  const item = examples[index];\n\n  return (\n    <div style={{ fontFamily: "sans-serif", padding: 20, maxWidth: 560 }}>\n      <h2>Requirement Clarifier</h2>\n      <button onClick={() => setIndex((index + 1) % examples.length)} style={{ padding: "10px 14px" }}>\n        Next example\n      </button>\n      <div style={{ marginTop: 18, padding: 16, borderRadius: 12, background: "#fff7ed" }}>\n        <strong>Stakeholder ask</strong>\n        <p>{item.ask}</p>\n        <strong>Clarified requirement</strong>\n        <p style={{ marginBottom: 0 }}>{item.requirement}</p>\n      </div>\n    </div>\n  );\n}` ,
          },
        },
      },
      resources: [
        { labelEn: "BABOK Key Concepts", labelBn: "BABOK মূল ধারণা", url: "https://www.iiba.org/knowledgehub/business-analysis-body-of-knowledge-babok-guide/key-concepts/" },
        { labelEn: "Business Requirements Guide", labelBn: "বিজনেস রিকোয়ারমেন্ট গাইড", url: "https://www.atlassian.com/software/confluence/resources/guides/how-to/business-requirements" },
        { labelEn: "User Story Guide", labelBn: "ইউজার স্টোরি গাইড", url: "https://www.atlassian.com/agile/project-management/user-stories" },
      ],
    },
    "ba-1-2": {
      titleBn: "BRD ও FRD লেখনি",
      titleEn: "BRD & FRD Writing",
      contentBn: `## BRD ও FRD লেখনি

Requirement discovery-এর পর সবচেয়ে গুরুত্বপূর্ণ কাজ হলো documentation-কে useful রাখা। BRD সাধারণত business problem, goal, scope, success metric, stakeholder expectation, আর constraint capture করে। FRD বা product/system requirement section আরও granular level-এ feature behavior, business rule, field requirement, validation, edge case, আর integration detail লিখে।

ভালো document-এর কাজ engineering team-কে overwhelm করা নয়, বরং shared understanding তৈরি করা। একটি strong BRD/FRD concise, structured, এবং living document হয়। এতে অবশ্যই scope, out-of-scope, assumptions, dependencies, risk, acceptance criteria, আর decision log থাকে, যাতে project evolve হলেও সবাই same source of truth-এ থাকতে পারে।

### মূল ধারণা
- **BRD** business problem ও value explain করে।
- **FRD/PRD detail** system behavior ও rule clarify করে।
- **Out-of-scope** section scope creep কমায়।
- **Acceptance criteria** testing ও sign-off সহজ করে।
- **Decision log** future debate-এ context ফিরিয়ে আনে।

### উদাহরণ
\`\`\`md
// EN: A lean requirement document should answer why, what, and done.
// BN: lean requirement document-এ why, what, এবং done স্পষ্ট থাকা উচিত।
Problem:
Mentors cannot quickly review learner submissions.

Goal:
Reduce average review turnaround from 48 hours to 12 hours.

Functional requirement:
Admins can filter submissions by squad, status, and submission date.

Acceptance criteria:
- Filter results update in under 2 seconds
- Only admins and mentors can access the review table
\`\`\``,
      contentEn: `## BRD & FRD Writing

Once requirements are discovered, documentation needs to make them usable. A BRD typically captures the business problem, goals, scope, constraints, success metrics, and stakeholder expectations. An FRD or detailed requirements section goes deeper into behavior, business rules, validation, field definitions, edge cases, and system interactions. Together, they turn conversations into a reference the team can build from.

Good documentation is not about writing more pages. It is about building shared understanding. Strong requirement documents stay concise, structured, and easy to update. They should make it clear what is in scope, what is out of scope, what assumptions exist, what dependencies matter, and how success will be confirmed through acceptance criteria and sign-off.

### Key Concepts
- **BRDs** explain business need, scope, and value.
- **FRDs or detailed specs** clarify system behavior and logic.
- **Out-of-scope sections** reduce ambiguity and scope creep.
- **Acceptance criteria** make testing and approval easier.
- **Decision logs** preserve context when plans evolve over time.

### Example
\`\`\`md
// EN: A lean requirement document should answer why, what, and done.
// BN: lean requirement document-এ why, what, এবং done স্পষ্ট থাকা উচিত।
Problem:
Mentors cannot quickly review learner submissions.

Goal:
Reduce average review turnaround from 48 hours to 12 hours.

Functional requirement:
Admins can filter submissions by squad, status, and submission date.

Acceptance criteria:
- Filter results update in under 2 seconds
- Only admins and mentors can access the review table
\`\`\``,
      sandpack: {
        template: "react",
        files: {
          "/App.js": {
            code: `// EN: Assemble the sections of a lean requirement document.\n// BN: একটি lean requirement document-এর section assemble করা হচ্ছে।\nimport React, { useState } from "react";\n\nconst sections = ["Problem", "Goal", "Scope", "Requirements", "Acceptance Criteria"];\n\nexport default function App() {\n  const [selected, setSelected] = useState("Problem");\n\n  const content = {\n    Problem: "Learners cannot easily tell which module to complete next.",\n    Goal: "Increase weekly lesson completion by 20%.",\n    Scope: "Dashboard recommendation card and path progress banner.",\n    Requirements: "System recommends one next lesson based on active path progress.",\n    "Acceptance Criteria": "If a learner completes a lesson, the recommendation updates on next load.",\n  };\n\n  return (\n    <div style={{ fontFamily: "sans-serif", padding: 20, maxWidth: 560 }}>\n      <h2>BRD / FRD Builder</h2>\n      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>\n        {sections.map((section) => (\n          <button key={section} onClick={() => setSelected(section)} style={{ padding: "10px 14px" }}>\n            {section}\n          </button>\n        ))}\n      </div>\n      <div style={{ marginTop: 18, padding: 16, borderRadius: 12, background: "#eff6ff" }}>\n        <strong>{selected}</strong>\n        <p style={{ marginBottom: 0 }}>{content[selected]}</p>\n      </div>\n    </div>\n  );\n}` ,
          },
        },
      },
      resources: [
        { labelEn: "PRD Guide", labelBn: "PRD গাইড", url: "https://www.atlassian.com/agile/requirements" },
        { labelEn: "Business Requirements Template", labelBn: "বিজনেস রিকোয়ারমেন্ট টেমপ্লেট", url: "https://www.atlassian.com/software/confluence/resources/guides/how-to/business-requirements" },
        { labelEn: "User Stories with Examples", labelBn: "উদাহরণসহ ইউজার স্টোরি", url: "https://www.atlassian.com/agile/project-management/user-stories" },
      ],
    },
    "ba-1-3": {
      titleBn: "স্টেকহোল্ডার ম্যানেজমেন্ট",
      titleEn: "Stakeholder Management",
      contentBn: `## স্টেকহোল্ডার ম্যানেজমেন্ট

Project failure অনেক সময় requirement gap-এর চেয়ে stakeholder alignment gap-এর কারণে হয়। একই feature নিয়ে sponsor, operations, engineering, support, আর finance-এর priority ভিন্ন হতে পারে। BA-এর কাজ হলো কার decision power কত, কার interest কত, কে blocker হতে পারে, আর কাকে কত frequency-তে update দিতে হবে তা আগেই map করা।

Stakeholder management-এর লক্ষ্য সবাইকে খুশি করা নয়; বরং right people-কে right time-এ right context দেওয়া। Influence-interest matrix, RACI chart, meeting cadence, decision note, আর risk escalation path এই discipline-কে operational করে। Strong stakeholder management conflict কমায় এবং project-কে unnecessary surprise থেকে বাঁচায়।

### মূল ধারণা
- **Influence vs interest** map communication plan নির্ধারণে সাহায্য করে।
- **RACI** ownership ambiguity কমায়।
- **Decision log** “কে কী বলেছিল” confusion কমায়।
- **Escalation path** unresolved blocker দ্রুত উঠাতে সাহায্য করে।
- **Expectation management** trust build করার বড় অংশ।

### উদাহরণ
\`\`\`md
// EN: A stakeholder table should define role and communication style.
// BN: stakeholder table-এ role ও communication style নির্ধারণ করুন।
Stakeholder: Finance Lead
- Interest: High
- Influence: High
- Needs: Weekly payout accuracy update
- Risk: Delayed sign-off if reporting fields are unclear
\`\`\``,
      contentEn: `## Stakeholder Management

Many projects fail less because of missing requirements and more because of weak alignment. Sponsors, operations teams, engineers, support agents, and finance leaders may all care about the same feature for very different reasons. A business analyst needs to understand who has decision power, who is impacted, who can block progress, and who needs what level of communication.

Stakeholder management is not about making everyone equally happy. It is about giving the right people the right context at the right time. Influence-interest mapping, RACI charts, meeting cadence, decision logs, and escalation paths all help turn alignment into an operating system instead of a vague soft skill. Done well, this reduces surprises and keeps delivery moving.

### Key Concepts
- **Influence vs interest mapping** helps tailor communication plans.
- **RACI frameworks** reduce ambiguity about ownership and involvement.
- **Decision logs** preserve context across meetings and changing opinions.
- **Escalation paths** help unresolved blockers surface quickly.
- **Expectation management** builds trust and reduces late-stage conflict.

### Example
\`\`\`md
// EN: A stakeholder table should define role and communication style.
// BN: stakeholder table-এ role ও communication style নির্ধারণ করুন।
Stakeholder: Finance Lead
- Interest: High
- Influence: High
- Needs: Weekly payout accuracy update
- Risk: Delayed sign-off if reporting fields are unclear
\`\`\``,
      sandpack: {
        template: "react",
        files: {
          "/App.js": {
            code: `// EN: Explore stakeholder influence and interest levels.\n// BN: stakeholder influence ও interest level explore করা হচ্ছে।\nimport React, { useState } from "react";\n\nconst stakeholders = [\n  { name: "CEO", influence: "High", interest: "Medium" },\n  { name: "Ops Lead", influence: "High", interest: "High" },\n  { name: "Mentor", influence: "Medium", interest: "High" },\n  { name: "Finance", influence: "High", interest: "High" },\n];\n\nexport default function App() {\n  const [selected, setSelected] = useState(stakeholders[0]);\n\n  return (\n    <div style={{ fontFamily: "sans-serif", padding: 20, maxWidth: 560 }}>\n      <h2>Stakeholder Matrix</h2>\n      <div style={{ display: "grid", gap: 10 }}>\n        {stakeholders.map((person) => (\n          <button key={person.name} onClick={() => setSelected(person)} style={{ textAlign: "left", padding: 12 }}>\n            {person.name}\n          </button>\n        ))}\n      </div>\n      <div style={{ marginTop: 18, padding: 16, borderRadius: 12, background: "#f5f3ff" }}>\n        <strong>{selected.name}</strong>\n        <div>Influence: {selected.influence}</div>\n        <div>Interest: {selected.interest}</div>\n        <div style={{ marginTop: 8 }}>\n          {selected.influence === "High" ? "Include in decision updates early." : "Share contextual updates and gather feedback."}\n        </div>\n      </div>\n    </div>\n  );\n}` ,
          },
        },
      },
      resources: [
        { labelEn: "BABOK Guide", labelBn: "BABOK গাইড", url: "https://www.iiba.org/career-resources/a-business-analysis-professionals-foundation-for-success/babok/" },
        { labelEn: "RACI Template", labelBn: "RACI টেমপ্লেট", url: "https://www.atlassian.com/software/confluence/templates/raci-chart" },
        { labelEn: "BA Key Concepts", labelBn: "BA মূল ধারণা", url: "https://www.iiba.org/knowledgehub/business-analysis-body-of-knowledge-babok-guide/key-concepts/" },
      ],
    },
  },
  "ba-m2": {
    "ba-2-1": legacyLesson("UML & Flowcharts", "UML ও ফ্লোচার্ট", "Visualizing logic", "লজিক ভিজ্যুয়ালাইজ করা", []),
    "ba-2-2": legacyLesson("Data Dictionary Basics", "ডেটা ডিকশনারি বেসিকস", "Understanding DB schema", "ডেটাবেস স্কিমা বোঝা", []),
    "ba-2-3": legacyLesson("Gap Analysis", "গ্যাপ অ্যানালাইসিস", "Current vs Expected state", "বর্তমান বনাম প্রত্যাশিত অবস্থা", [])
  },
  "ba-m3": {
    "ba-3-1": legacyLesson("Agile & Scrum Fundamentals", "Agile ও Scrum বেসিকস", "Sprints and ceremonies", "সপ্রিন্ট এবং সেরিমনি", []),
    "ba-3-2": legacyLesson("Writing User Stories", "ইউজার স্টোরি লেখা", "As a user, I want...", "ব্যবহারকারী হিসেবে আমি চাই...", []),
    "ba-3-3": legacyLesson("Acceptance Criteria", "একসেপ্টেন্স ক্রাইটেরিয়া", "Given/When/Then format", "Given/When/Then ফরম্যাট", [])
  },
  "ba-m4": {
    "ba-4-1": legacyLesson("Wireframing for BAs", "BA দের জন্য ওয়্যারফ্রেমিং", "Low fidelity mockups", "লো ফিডেলিটি মকআপ", []),
    "ba-4-2": legacyLesson("Jira Mastery", "জিরা মাস্টারি", "Creating epics and stories", "এপিক ও স্টোরি তৈরি", []),
    "ba-4-3": legacyLesson("Backlog Grooming", "ব্যাকলগ গ্রুমিং", "Prioritizing work", "কাজের অগ্রাধিকার ঠিক করা", [])
  },
  "ba-m5": {
    "ba-5-1": legacyLesson("UAT Planning", "UAT প্ল্যানিং", "User Acceptance Testing", "ইউজার একসেপ্টেন্স টেস্টিং", []),
    "ba-5-2": legacyLesson("Test Case Creation", "টেস্ট কেস তৈরি", "Validation matrix", "ভ্যালিডেশন ম্যাট্রিক্স", []),
    "ba-5-3": legacyLesson("Bug Triage", "বাগ ট্রায়াজ", "Severity vs Priority", "বাগ তীব্রতা বনাম অগ্রাধিকার", [])
  },
  "ba-m6": {
    "ba-6-1": legacyLesson("Release Notes", "রিলিজ নোটস", "Writing for the user", "ইউজারের জন্য রিলিজ নোট", []),
    "ba-6-2": legacyLesson("Feature Adoption Tracking", "অ্যাডপশন ট্র্যাকিং", "Measuring success post-launch", "উন্মোচনের পর সফলতা মাপা", []),
    "ba-6-3": legacyLesson("Final Capstone Project", "ফাইনাল ক্যাপস্টোন প্রজেক্ট", "End-to-end BA simulation", "শুরু থেকে শেষ BA প্রজেক্ট", [])
  },

  // --- PRODUCT MANAGEMENT PATH (6 modules) ---
  "pm-m1": {
    "pm-1-1": {
      titleBn: "প্রোডাক্ট ভিশন ও স্ট্র্যাটেজি",
      titleEn: "Product Vision & Strategy",
      contentBn: `## প্রোডাক্ট ভিশন ও স্ট্র্যাটেজি

Product vision বলে আমরা কোন ভবিষ্যৎ তৈরি করতে চাই; strategy বলে সেখানে পৌঁছাতে কী choices নেব। Vision সাধারণত aspirational ও long-term হয়, আর strategy হয় focused ও constraint-aware। অনেক team feature list-কে strategy ভাবে, কিন্তু real strategy হলো target user, differentiated value, business outcome, আর sequence of bets পরিষ্কার করা।

একজন PM-এর বড় দায়িত্ব হলো noise filter করা। সবাই feature চাইতে পারে, কিন্তু সব feature strategic নয়। Vision ও strategy clear থাকলে roadmap priorities, trade-off decision, stakeholder communication, আর metric selection সব সহজ হয়ে যায়। তাই “What are we building?”-এর চেয়ে “Why this, for whom, and why now?” প্রশ্নটি বেশি গুরুত্বপূর্ণ।

### মূল ধারণা
- **Vision** desired future state define করে।
- **Strategy** limited resources কোথায় বিনিয়োগ হবে তা নির্ধারণ করে।
- **Target user** অস্পষ্ট হলে product decision দুর্বল হয়।
- **Differentiation** market-এ কেন আপনি matter করেন তা বোঝায়।
- **Goals ও initiatives** vision-কে execution-এ নামায়।

### উদাহরণ
\`\`\`md
// EN: A strong product statement links user, problem, and value.
// BN: একটি strong product statement user, problem, আর value-কে যুক্ত করে।
Vision:
"Enable Bangladeshi learners to gain real SaaS experience without financial barriers."

Strategy:
- Focus on guided learning paths
- Reward public proof of progress
- Keep operating costs inside Spark-plan limits
\`\`\``,
      contentEn: `## Product Vision & Strategy

Product vision describes the future you want to create. Product strategy defines the choices you will make to get there. Vision is aspirational and directional; strategy is focused and constrained. Teams often confuse strategy with a feature list, but real strategy clarifies target users, differentiated value, business outcomes, and the sequence of bets required to move the product forward.

One of a product manager's core responsibilities is filtering noise. Stakeholders can ask for many features, but not every request is strategic. When vision and strategy are clear, roadmap trade-offs become easier, stakeholder communication improves, and the team has a better chance of shipping work that compounds instead of scattering effort across disconnected ideas.

### Key Concepts
- **Vision** defines the future state the product aims to create.
- **Strategy** determines where limited time and resources should be invested.
- **Target users** must be clear or prioritization becomes weak.
- **Differentiation** explains why the product matters in the market.
- **Goals and initiatives** translate vision into execution.

### Example
\`\`\`md
// EN: A strong product statement links user, problem, and value.
// BN: একটি strong product statement user, problem, আর value-কে যুক্ত করে।
Vision:
"Enable Bangladeshi learners to gain real SaaS experience without financial barriers."

Strategy:
- Focus on guided learning paths
- Reward public proof of progress
- Keep operating costs inside Spark-plan limits
\`\`\``,
      sandpack: {
        template: "react",
        files: {
          "/App.js": {
            code: `// EN: Combine vision ingredients into a sharper product strategy.\n// BN: vision ingredients মিলিয়ে একটি sharper product strategy তৈরি করা হচ্ছে।\nimport React, { useState } from "react";\n\nconst users = ["First-time learner", "Mentor", "Admin"];\nconst outcomes = ["Finish lessons faster", "Review contributions clearly", "Grow referrals"];\n\nexport default function App() {\n  const [user, setUser] = useState(users[0]);\n  const [outcome, setOutcome] = useState(outcomes[0]);\n\n  return (\n    <div style={{ fontFamily: "sans-serif", padding: 20, maxWidth: 560 }}>\n      <h2>Vision Builder</h2>\n      <div style={{ display: "grid", gap: 12 }}>\n        <label>\n          Target user\n          <select value={user} onChange={(event) => setUser(event.target.value)} style={{ marginLeft: 12 }}>\n            {users.map((item) => <option key={item}>{item}</option>)}\n          </select>\n        </label>\n        <label>\n          Core outcome\n          <select value={outcome} onChange={(event) => setOutcome(event.target.value)} style={{ marginLeft: 12 }}>\n            {outcomes.map((item) => <option key={item}>{item}</option>)}\n          </select>\n        </label>\n      </div>\n      <div style={{ marginTop: 18, padding: 16, borderRadius: 12, background: "#ecfeff" }}>\n        <strong>Draft strategy</strong>\n        <p style={{ marginBottom: 0 }}>For {user.toLowerCase()}s, we will prioritize workflows that help them {outcome.toLowerCase()}.</p>\n      </div>\n    </div>\n  );\n}` ,
          },
        },
      },
      resources: [
        { labelEn: "Goals and Initiatives Guide", labelBn: "গোলস ও ইনিশিয়েটিভস গাইড", url: "https://www.aha.io/roadmapping/guide/product-strategy/what-are-product-goals-and-initiatives" },
        { labelEn: "Product Strategy Guide", labelBn: "প্রোডাক্ট স্ট্র্যাটেজি গাইড", url: "https://www.productplan.com/learn/guide-to-product-strategy/" },
        { labelEn: "Strategic Roadmap Guide", labelBn: "স্ট্র্যাটেজিক রোডম্যাপ গাইড", url: "https://www.aha.io/roadmapping/guide/roadmap/strategy-roadmap" },
      ],
    },
    "pm-1-2": {
      titleBn: "মার্কেট রিসার্চ",
      titleEn: "Market Research",
      contentBn: `## মার্কেট রিসার্চ

Market research-এর উদ্দেশ্য শুধু competitor feature list বানানো নয়। এটি জানতে সাহায্য করে market-এর size কত, users কোন problem-এ সবচেয়ে কষ্ট পাচ্ছে, existing alternatives কী, আর মানুষ নতুন solution-এর জন্য behaviour change করবে কিনা। Strong research qualitative insight আর quantitative signal দুটোই ব্যবহার করে।

একজন PM market research করতে গিয়ে customer interview, competitor teardown, positioning analysis, pricing observation, search trend, আর support pain point একসাথে দেখেন। এখানে বড় mistake হলো competitors কপি করা। Research-এর লক্ষ্য imitation নয়; differentiation-এর জায়গা বের করা। আপনি কোথায় better, cheaper, faster, more trusted, বা more focused হতে পারবেন সেটাই গুরুত্বপূর্ণ।

### মূল ধারণা
- **Market need** validate না করলে roadmap guesswork হয়ে যায়।
- **Competitor analysis** feature copy নয়, positioning insight দেয়।
- **Qualitative + quantitative** signal একসাথে দেখা দরকার।
- **Segmentation** সব user এক রকম নয় তা বুঝতে সাহায্য করে।
- **Differentiation hypothesis** research-এর concrete output হওয়া উচিত।

### উদাহরণ
\`\`\`md
// EN: A simple competitor matrix captures value, not just features.
// BN: simple competitor matrix শুধু feature নয়, value capture করে।
Competitor A
- Strength: Fast onboarding
- Weakness: Weak community support

Our opportunity
- Guided onboarding + co-op contribution proof in one product
\`\`\``,
      contentEn: `## Market Research

Market research is not just competitor feature collection. It helps product teams understand market size, user pain, current alternatives, willingness to change behavior, and gaps in positioning. The goal is to reduce strategic guesswork before committing roadmap time to a solution that may not matter.

Strong market research combines qualitative insight with quantitative signal. Customer interviews, competitor teardowns, positioning analysis, pricing observations, support tickets, and search behavior can all contribute. A common mistake is turning research into copycat behavior. The real job is to identify where you can be more focused, more trusted, more affordable, or more effective than the alternatives.

### Key Concepts
- **Market need validation** reduces roadmap speculation.
- **Competitive analysis** should focus on positioning, not feature cloning.
- **Qualitative and quantitative data** together create stronger signal.
- **Segmentation** reveals that not all users have the same needs.
- **Differentiation hypotheses** are a valuable output of research.

### Example
\`\`\`md
// EN: A simple competitor matrix captures value, not just features.
// BN: simple competitor matrix শুধু feature নয়, value capture করে।
Competitor A
- Strength: Fast onboarding
- Weakness: Weak community support

Our opportunity
- Guided onboarding + co-op contribution proof in one product
\`\`\``,
      sandpack: {
        template: "react",
        files: {
          "/App.js": {
            code: `// EN: Compare competitor strengths and look for differentiation.\n// BN: competitor strength তুলনা করে differentiation খোঁজা হচ্ছে।\nimport React, { useState } from "react";\n\nconst competitors = {\n  GenericLMS: { strength: "Large content library", weakness: "Low community accountability" },\n  BootcampX: { strength: "Strong mentorship", weakness: "High price barrier" },\n  EquiSaaS: { strength: "Real co-op contribution path", weakness: "Smaller content footprint" },\n};\n\nexport default function App() {\n  const [name, setName] = useState("EquiSaaS");\n  const profile = competitors[name];\n\n  return (\n    <div style={{ fontFamily: "sans-serif", padding: 20, maxWidth: 560 }}>\n      <h2>Market Research Matrix</h2>\n      <select value={name} onChange={(event) => setName(event.target.value)}>\n        {Object.keys(competitors).map((item) => <option key={item}>{item}</option>)}\n      </select>\n      <div style={{ marginTop: 18, padding: 16, borderRadius: 12, background: "#f0fdf4" }}>\n        <div><strong>Strength:</strong> {profile.strength}</div>\n        <div><strong>Weakness:</strong> {profile.weakness}</div>\n      </div>\n    </div>\n  );\n}` ,
          },
        },
      },
      resources: [
        { labelEn: "Competitive Analysis Guide", labelBn: "কম্পিটিটিভ অ্যানালাইসিস গাইড", url: "https://www.productplan.com/learn/competitive-analysis-how-to/" },
        { labelEn: "Competitor Research Guide", labelBn: "কম্পিটিটর রিসার্চ গাইড", url: "https://www.productplan.com/learn/product-managers-research-competitors/" },
        { labelEn: "Product-Market Fit Guide", labelBn: "প্রোডাক্ট-মার্কেট ফিট গাইড", url: "https://www.aha.io/roadmapping/guide/product-strategy/what-is-product-market-fit" },
      ],
    },
    "pm-1-3": {
      titleBn: "প্রোডাক্ট মেট্রিকস (AARRR)",
      titleEn: "Product Metrics (AARRR)",
      contentBn: `## প্রোডাক্ট মেট্রিকস (AARRR)

Metric ছাড়া product management intuition-heavy হয়ে যায়। AARRR framework product-led growth context-এ পাঁচটি critical stage track করতে সাহায্য করে: Acquisition, Activation, Retention, Referral, Revenue। এর মূল শক্তি হলো vanity metric বাদ দিয়ে user behaviour-এর meaningful signal-এর দিকে focus আনা।

কোন metric track করবেন তা product stage, business model, আর strategic goal-এর ওপর নির্ভর করে। একটি early-stage LMS হয়তো activation আর retention-এ বেশি focus করবে, কারণ sign-up count একা meaningful নয় যদি learner lesson complete না করে। ভালো PM metric-এর definition, source, cadence, owner, আর action threshold আগেই নির্ধারণ করে।

### মূল ধারণা
- **Acquisition** user কোথা থেকে আসছে তা বোঝায়।
- **Activation** first value moment capture করে।
- **Retention** product habit তৈরি হচ্ছে কিনা দেখায়।
- **Referral** delight বা trust-এর signal হতে পারে।
- **Revenue** business sustainability validate করে।

### উদাহরণ
\`\`\`md
// EN: Define one concrete event for each AARRR stage.
// BN: AARRR-এর প্রতিটি stage-এর জন্য একটি concrete event নির্ধারণ করুন।
Acquisition: Visitor lands on /join
Activation: User completes first lesson
Retention: User returns and studies again within 7 days
Referral: User shares public profile link
Revenue: Team converts to paid partner support package
\`\`\``,
      contentEn: `## Product Metrics (AARRR)

Without metrics, product management becomes overly dependent on instinct. The AARRR framework helps teams focus on five critical stages of user behavior: Acquisition, Activation, Retention, Referral, and Revenue. Its real strength is that it moves teams away from vanity metrics and toward signals that reflect whether the product is actually creating value and sustainable growth.

The right metric set depends on product stage, business model, and strategic goal. An early-stage LMS, for example, may care more about activation and retention than raw sign-up volume, because registrations mean little if learners never complete a lesson. Strong PMs define each metric clearly, identify its source, review it on a fixed cadence, and connect it to a decision the team can actually make.

### Key Concepts
- **Acquisition** measures how people discover the product.
- **Activation** identifies the first moment of user value.
- **Retention** shows whether the product is becoming a habit.
- **Referral** signals delight, trust, or network effects.
- **Revenue** validates business sustainability and pricing power.

### Example
\`\`\`md
// EN: Define one concrete event for each AARRR stage.
// BN: AARRR-এর প্রতিটি stage-এর জন্য একটি concrete event নির্ধারণ করুন।
Acquisition: Visitor lands on /join
Activation: User completes first lesson
Retention: User returns and studies again within 7 days
Referral: User shares public profile link
Revenue: Team converts to paid partner support package
\`\`\``,
      sandpack: {
        template: "react",
        files: {
          "/App.js": {
            code: `// EN: Build a simple AARRR dashboard from chosen numbers.\n// BN: নির্বাচিত সংখ্যাগুলো দিয়ে একটি সহজ AARRR dashboard বানানো হচ্ছে।\nimport React, { useState } from "react";\n\nexport default function App() {\n  const [acquisition, setAcquisition] = useState(1000);\n  const [activation, setActivation] = useState(220);\n  const [retention, setRetention] = useState(90);\n\n  const activationRate = acquisition ? Math.round((activation / acquisition) * 100) : 0;\n  const retentionRate = activation ? Math.round((retention / activation) * 100) : 0;\n\n  return (\n    <div style={{ fontFamily: "sans-serif", padding: 20, maxWidth: 560 }}>\n      <h2>AARRR Snapshot</h2>\n      <label style={{ display: "block", marginBottom: 10 }}>Acquisition <input value={acquisition} onChange={(e) => setAcquisition(Number(e.target.value) || 0)} /></label>\n      <label style={{ display: "block", marginBottom: 10 }}>Activation <input value={activation} onChange={(e) => setActivation(Number(e.target.value) || 0)} /></label>\n      <label style={{ display: "block", marginBottom: 10 }}>Retention <input value={retention} onChange={(e) => setRetention(Number(e.target.value) || 0)} /></label>\n      <div style={{ marginTop: 18, padding: 16, borderRadius: 12, background: "#fefce8" }}>\n        <div><strong>Activation rate:</strong> {activationRate}%</div>\n        <div><strong>Retention rate:</strong> {retentionRate}%</div>\n      </div>\n    </div>\n  );\n}` ,
          },
        },
      },
      resources: [
        { labelEn: "Product Metrics Guide", labelBn: "প্রোডাক্ট মেট্রিকস গাইড", url: "https://www.aha.io/roadmapping/guide/what-are-product-metrics" },
        { labelEn: "AARRR Framework", labelBn: "AARRR ফ্রেমওয়ার্ক", url: "https://www.productplan.com/glossary/aarrr-framework/" },
        { labelEn: "Metrics That Matter", labelBn: "গুরুত্বপূর্ণ মেট্রিকস", url: "https://www.productplan.com/learn/product-metrics-matter/" },
      ],
    },
  },
  "pm-m2": {
    "pm-2-1": legacyLesson("Roadmapping & OKRs", "রোডম্যাপিং ও OKR", "Objective and Key Results", "উদেশ্য ও ফলাফল", []),
    "pm-2-2": legacyLesson("Prioritization Frameworks", "প্রায়োরিটাইজেশন ফ্রেমওয়ার্ক", "RICE, MoSCoW, Kano", "RICE, MoSCoW, Kano", []),
    "pm-2-3": legacyLesson("MVP Definition", "MVP নির্ধারণ", "Minimum Viable Product", "মিনিমাম ভায়াবল প্রোডাক্ট", [])
  },
  "pm-m3": {
    "pm-3-1": legacyLesson("Leading Daily Standups", "ডেইলি স্ট্যান্ডআপ পরিচালনা", "Team synchronization", "টিম সিঙ্ক", []),
    "pm-3-2": legacyLesson("Sprint Retrospectives", "স্প্রিন্ট রেট্রোস্পেক্টিভ", "Continuous improvement", "কন্টিনিউয়াস ইম্প্রুভমেন্ট", []),
    "pm-3-3": legacyLesson("Managing Scope Creep", "স্কোপ ক্রিপ ম্যানেজমেন্ট", "Saying 'No' kindly", "না বলা শেখা", [])
  },
  "pm-m4": {
    "pm-4-1": legacyLesson("Product Analytics", "প্রোডাক্ট অ্যানালিটিক্স", "Mixpanel and Amplitude", "মিক্সপ্যানেল ও অ্যাম্পলিটিউড", []),
    "pm-4-2": legacyLesson("Retention Analysis", "রিটেনশন অ্যানালাইসিস", "Cohort tracking", "কোহর্ট ট্র্যাকিং", []),
    "pm-4-3": legacyLesson("Funnel Optimization", "ফানেল অপ্টিমাইজেশন", "Reducing drop-offs", "ড্রপ-অফ কমানো", [])
  },
  "pm-m5": {
    "pm-5-1": legacyLesson("Go-to-Market (GTM)", "গো-টু-মার্কেট (GTM)", "Launch strategies", "লঞ্চ স্ট্র্যাটেজি", []),
    "pm-5-2": legacyLesson("Pricing & Packaging", "প্রাইসিং ও প্যাকেজিং", "Freemium vs Subscription", "ফ্রিমিয়াম বনাম সাবস্ক্রিপশন", []),
    "pm-5-3": legacyLesson("Sales Enablement", "সেলস এনাবলমেন্ট", "Training the sales team", "সেলস টিমকে ট্রেইনিং দেওয়া", [])
  },
  "pm-m6": {
    "pm-6-1": legacyLesson("Stakeholder Communication", "স্টেকহোল্ডার কমিউনিকেশন", "Board meetings and updates", "বোর্ড মিটিং ও আপডেট", []),
    "pm-6-2": legacyLesson("Pivot vs Persevere", "পিভট বনাম লেগে থাকা", "Making the tough call", "কঠিন সিদ্ধান্ত নেওয়া", []),
    "pm-6-3": legacyLesson("PM Technical Interview Prep", "PM টেকনিক্যাল ইন্টারভিউ", "System design for PMs", "PM-দের জন্য সিস্টেম ডিজাইন", [])
  }
};

LEGACY_PRODUCT_COURSES["ba-m1"] = PRODUCT_BA_MONTH_ONE;
LEGACY_PRODUCT_COURSES["pm-m1"] = PRODUCT_PM_MONTH_ONE;

export const PRODUCT_COURSES = mergeGeneratedPath("product-pm", mergeGeneratedPath("product-ba", LEGACY_PRODUCT_COURSES));

