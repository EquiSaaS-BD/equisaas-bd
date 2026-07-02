import { mergeGeneratedPath } from "../generated-course-utils.js";
import { DESIGN_UX_MONTH_ONE } from "./design-ux-month-one.js";
import { DESIGN_BRAND_MONTH_ONE } from "./design-brand-month-one.js";

// ==========================================
// DESIGN - UX & BRAND MASTERCLASS
// ==========================================

const legacyLesson = (titleEn, titleBn, contentEn, contentBn, resources = []) => ({
  titleEn,
  titleBn,
  contentEn,
  contentBn,
  sandpack: null,
  resources,
});

const LEGACY_DESIGN_COURSES = {
  // --- UI/UX PATH (2 modules) ---
  "ux-foundations": {
    "ux-1-1": {
      titleBn: "ইউজার রিসার্চ",
      titleEn: "User Research",
      contentBn: `## ইউজার রিসার্চ

ভালো UX design অনুমান থেকে নয়, evidence থেকে শুরু হয়। User research-এর কাজ হলো মানুষ কী বলছে, কী করছে, কোথায় আটকে যাচ্ছে, আর কী outcome চায় তা বোঝা। Analytics আপনাকে drop-off দেখাতে পারে, কিন্তু কেন drop-off হচ্ছে তা সাধারণত interview, observation, usability session, survey, বা diary study ছাড়া বোঝা যায় না।

শক্তিশালী research মানে শুধু quote collect করা নয়; বরং pattern detect করা। কোন pain point repeated, কোন workaround মানুষ বারবার ব্যবহার করছে, আর কোন language user নিজে ব্যবহার করছে তা capture করতে হয়। এই insight-ই পরে persona, journey map, problem statement, আর design priority-তে রূপ নেয়।

### মূল ধারণা
- **Research goal** আগে ঠিক না করলে interview এলোমেলো হয়ে যায়।
- **Generative research** problem space বুঝতে সাহায্য করে।
- **Evaluative research** proposed solution কাজ করছে কিনা যাচাই করে।
- **Notes থেকে pattern synthesis** insight-কে action-এ রূপ দেয়।
- **Evidence over opinion** cross-functional team alignment বাড়ায়।

### উদাহরণ
\`\`\`md
// EN: A simple interview script keeps the conversation focused.
// BN: একটি সাধারণ interview script কথোপকথনকে focused রাখে।
Goal: Understand why learners drop off after week one.

Questions:
1. What were you trying to achieve when you opened the LMS?
2. Where did you feel confused or slow?
3. What made you stop and leave?
4. What would make the next session easier?
\`\`\``,
      contentEn: `## User Research

Great UX design does not start from assumptions; it starts from evidence. User research helps teams understand what people are trying to do, where they struggle, what language they use, and what outcomes actually matter to them. Analytics can show where users drop off, but research explains why the drop-off happens and what context surrounds it.

Strong research is not just collecting quotes. It is about identifying patterns across interviews, observations, surveys, and usability sessions. The real value comes during synthesis, when scattered observations become insights, and insights become design decisions. That is how research shapes personas, journey maps, problem statements, and roadmap priorities instead of becoming a folder of forgotten notes.

### Key Concepts
- **Clear research goals** prevent interviews from drifting into noise.
- **Generative research** helps teams understand problems before designing solutions.
- **Evaluative research** tests whether a proposed solution actually works.
- **Synthesis** turns notes into patterns, themes, and decisions.
- **Evidence-based design** creates stronger alignment across design, product, and engineering.

### Example
\`\`\`md
// EN: A simple interview script keeps the conversation focused.
// BN: একটি সাধারণ interview script কথোপকথনকে focused রাখে।
Goal: Understand why learners drop off after week one.

Questions:
1. What were you trying to achieve when you opened the LMS?
2. Where did you feel confused or slow?
3. What made you stop and leave?
4. What would make the next session easier?
\`\`\``,
      sandpack: {
        template: "react",
        files: {
          "/App.js": {
            code: `// EN: Turn interview notes into a simple empathy map.\n// BN: interview note-কে একটি সহজ empathy map-এ সাজানো হচ্ছে।\nimport React, { useState } from "react";\n\nconst buckets = {\n  Says: \"I cannot tell which lecture to open first.\",\n  Thinks: \"Maybe this platform is only for advanced learners.\",\n  Does: \"Skips around and leaves after two clicks.\",\n  Feels: \"Curious but slightly overwhelmed.\",\n};\n\nexport default function App() {\n  const [active, setActive] = useState(\"Says\");\n\n  return (\n    <div style={{ fontFamily: \"sans-serif\", padding: 20, maxWidth: 560 }}>\n      <h2>Research Synthesis Board</h2>\n      <div style={{ display: \"flex\", gap: 8, flexWrap: \"wrap\" }}>\n        {Object.keys(buckets).map((key) => (\n          <button key={key} onClick={() => setActive(key)} style={{ padding: \"10px 14px\" }}>\n            {key}\n          </button>\n        ))}\n      </div>\n      <div style={{ marginTop: 18, borderRadius: 14, padding: 18, background: \"#f8fafc\", border: \"1px solid #cbd5e1\" }}>\n        <strong>{active}</strong>\n        <p style={{ marginBottom: 0 }}>{buckets[active]}</p>\n      </div>\n    </div>\n  );\n}` ,
          },
        },
      },
      resources: [
        { labelEn: "Official Guide", labelBn: "অফিসিয়াল গাইড", url: "https://www.aha.io/roadmapping/guide/what-is-user-research" },
        { labelEn: "IxDF Reference", labelBn: "IxDF রেফারেন্স", url: "https://www.interaction-design.org/literature/topics/user-research" },
        { labelEn: "Interview Planning Guide", labelBn: "ইন্টারভিউ প্ল্যানিং গাইড", url: "https://www.aha.io/roadmapping/guide/how-to-choose-the-right-customers-for-product-discovery-interviews" },
      ],
    },
    "ux-1-2": {
      titleBn: "পারসোনা ও জার্নি",
      titleEn: "Personas and Journey",
      contentBn: `## পারসোনা ও জার্নি

Research করার পর next step হলো raw data-কে decision-friendly format-এ রূপ দেওয়া। Persona হলো research-backed summary of a user type, যেখানে goal, motivation, behavior, pain point, আর context ধরা থাকে। এটি demographic poster না; বরং team-এর জন্য empathy tool। ভালো persona engineering, design, marketing, আর product-কে একই user problem-এর দিকে align করে।

Journey map দেখায় user কীভাবে step-by-step experience-এর মধ্য দিয়ে যায়। awareness থেকে onboarding, task completion, support, বা renewal পর্যন্ত প্রতিটি ধাপে emotion, question, friction, আর opportunity লিখলে invisible gap visible হয়ে যায়। Journey map-এর শক্তি এখানেই: এটি screen-by-screen UI থেকে বড় picture-এ নিয়ে যায়।

### মূল ধারণা
- **Persona** research ছাড়া বানালে তা stereotype হয়ে যায়।
- **Goals ও pain points** persona-এর সবচেয়ে কার্যকর অংশ।
- **Journey stages** user experience-এর timeline বোঝায়।
- **Emotions** friction prioritization-এ সাহায্য করে।
- **Opportunity notes** journey map-কে action-oriented করে।

### উদাহরণ
\`\`\`md
// EN: A lean persona should be short, specific, and actionable.
// BN: lean persona সংক্ষিপ্ত, নির্দিষ্ট, এবং actionable হওয়া উচিত।
Persona: Rafi, first-time LMS learner
- Goal: Finish one lesson after work without feeling lost
- Friction: Too many choices on the first screen
- Motivation: Wants a clear path to a better career

Journey stage: Open dashboard
- Question: "Where should I start?"
- Emotion: Uncertain
- Opportunity: Show one primary recommended action
\`\`\``,
      contentEn: `## Personas and Journey

After research, teams need a way to turn raw observations into decision-ready artifacts. A persona is a research-backed summary of a user type that captures goals, motivations, behaviors, and constraints. It is not a decorative demographic poster. A useful persona helps teams make better decisions by keeping attention on a concrete user need instead of vague assumptions about "the user."

Journey maps add the time dimension. They show how someone moves through an experience step by step, from discovery to onboarding to task completion, support, or renewal. By mapping emotions, questions, and friction at each stage, teams can identify where the experience breaks down and where product or design intervention would have the highest payoff.

### Key Concepts
- **Personas must be research-backed** or they become stereotypes.
- **Goals, motivations, and pain points** are more useful than demographic trivia.
- **Journey stages** reveal the sequence of user experience over time.
- **Emotion mapping** helps teams prioritize moments of friction.
- **Opportunity framing** turns a journey map into an action tool, not just a diagram.

### Example
\`\`\`md
// EN: A lean persona should be short, specific, and actionable.
// BN: lean persona সংক্ষিপ্ত, নির্দিষ্ট, এবং actionable হওয়া উচিত।
Persona: Rafi, first-time LMS learner
- Goal: Finish one lesson after work without feeling lost
- Friction: Too many choices on the first screen
- Motivation: Wants a clear path to a better career

Journey stage: Open dashboard
- Question: "Where should I start?"
- Emotion: Uncertain
- Opportunity: Show one primary recommended action
\`\`\``,
      sandpack: {
        template: "react",
        files: {
          "/App.js": {
            code: `// EN: Explore a basic learner persona and journey stages.\n// BN: একটি learner persona ও journey stage explore করা হচ্ছে।\nimport React, { useState } from "react";\n\nconst stages = [\n  { name: \"Discover\", emotion: \"Hopeful\", question: \"Is this for me?\" },\n  { name: \"Onboard\", emotion: \"Curious\", question: \"How do I begin?\" },\n  { name: \"Study\", emotion: \"Focused\", question: \"Am I making progress?\" },\n  { name: \"Return\", emotion: \"Confident\", question: \"What should I learn next?\" },\n];\n\nexport default function App() {\n  const [index, setIndex] = useState(0);\n  const stage = stages[index];\n\n  return (\n    <div style={{ fontFamily: \"sans-serif\", padding: 20, maxWidth: 560 }}>\n      <h2>Persona Journey Explorer</h2>\n      <p><strong>Persona:</strong> Rafi, first-time LMS learner</p>\n      <button onClick={() => setIndex((index + 1) % stages.length)} style={{ padding: \"10px 14px\" }}>\n        Next stage\n      </button>\n      <div style={{ marginTop: 18, borderRadius: 14, padding: 18, background: \"#eef2ff\" }}>\n        <div><strong>Stage:</strong> {stage.name}</div>\n        <div><strong>Emotion:</strong> {stage.emotion}</div>\n        <div><strong>Question:</strong> {stage.question}</div>\n      </div>\n    </div>\n  );\n}` ,
          },
        },
      },
      resources: [
        { labelEn: "Journey Mapping Guide", labelBn: "জার্নি ম্যাপিং গাইড", url: "https://www.figma.com/resource-library/what-is-a-customer-journey-map/" },
        { labelEn: "Persona Reference", labelBn: "পারসোনা রেফারেন্স", url: "https://www.interaction-design.org/literature/topics/personas" },
        { labelEn: "Product Discovery Guide", labelBn: "প্রোডাক্ট ডিসকভারি গাইড", url: "https://www.aha.io/roadmapping/guide/what-is-product-discovery" },
      ],
    },
    "ux-1-3": {
      titleBn: "ইনফো আর্কিটেকচার",
      titleEn: "Information Architecture",
      contentBn: `## ইনফো আর্কিটেকচার

Information architecture বা IA-এর কাজ হলো content ও functionality-কে এমনভাবে organize করা যাতে user দ্রুত বুঝতে পারে কোথায় কী আছে। Menu, category, label, sitemap, breadcrumb, search, আর grouping strategy সবই IA-এর অংশ। সুন্দর visual design খারাপ IA বাঁচাতে পারে না; কারণ user যদি দরকারি জিনিস খুঁজেই না পায়, তাহলে experience ভেঙে যায়।

ভালো IA সবসময় user goal, content inventory, আর business context-এর balance খোঁজে। কোন item top navigation-এ যাবে, কোনটা nested হবে, কোন label user-এর কাছে natural শোনাবে, আর কোন flow short রাখা দরকার; এসব decision research ও content structure মিলিয়ে নিতে হয়। IA ঠিক থাকলে navigation lighter লাগে, onboarding smoother হয়, আর support burden কমে।

### মূল ধারণা
- **Hierarchy** সবচেয়ে গুরুত্বপূর্ণ content আগে আনে।
- **Labels** user language-এ হলে findability বাড়ে।
- **Grouping** related item-গুলোকে mentally predictable করে।
- **Sitemap** system-level structure দেখতে সাহায্য করে।
- **Card sorting** IA validate করার জনপ্রিয় technique।

### উদাহরণ
\`\`\`md
// EN: Start with a clear top-level structure before designing screens.
// BN: screen design-এর আগে clear top-level structure নির্ধারণ করুন।
LMS
- Dashboard
- Courses
  - Department
  - Module
  - Lesson
- Resources
- Community
- Profile
\`\`\``,
      contentEn: `## Information Architecture

Information architecture is the discipline of organizing content and functionality so users can understand where things live and how to move through them. Menus, labels, categories, navigation systems, search structures, and sitemaps are all part of IA. Even a beautiful interface will feel broken if the underlying structure makes content difficult to find or interpret.

Strong IA balances user goals, content realities, and business constraints. Teams need to decide what belongs in top-level navigation, what should be nested, how labels should reflect user language, and where workflows must stay short. When IA is intentional, navigation feels lighter, onboarding becomes easier, and support burden drops because people can orient themselves without guesswork.

### Key Concepts
- **Hierarchy** decides what users encounter first and what stays nested.
- **Clear labels** improve findability and reduce confusion.
- **Grouping** helps users predict where related content belongs.
- **Sitemaps** expose the structure of the system before visual design details.
- **Card sorting** is a common way to validate whether your structure matches user expectations.

### Example
\`\`\`md
// EN: Start with a clear top-level structure before designing screens.
// BN: screen design-এর আগে clear top-level structure নির্ধারণ করুন।
LMS
- Dashboard
- Courses
  - Department
  - Module
  - Lesson
- Resources
- Community
- Profile
\`\`\``,
      sandpack: {
        template: "react",
        files: {
          "/App.js": {
            code: `// EN: Compare good and bad information grouping.\n// BN: ভালো ও খারাপ information grouping তুলনা করা হচ্ছে।\nimport React, { useState } from "react";\n\nconst examples = {\n  messy: [\"Lecture 1\", \"Profile\", \"Lesson Files\", \"Community\", \"Marketing\", \"Settings\"],\n  structured: [\"Dashboard\", \"Courses\", \"Resources\", \"Community\", \"Profile\", \"Settings\"],\n};\n\nexport default function App() {\n  const [mode, setMode] = useState(\"structured\");\n\n  return (\n    <div style={{ fontFamily: \"sans-serif\", padding: 20, maxWidth: 520 }}>\n      <h2>Information Architecture View</h2>\n      <div style={{ display: \"flex\", gap: 8 }}>\n        <button onClick={() => setMode(\"structured\")}>Structured</button>\n        <button onClick={() => setMode(\"messy\")}>Messy</button>\n      </div>\n      <ul style={{ marginTop: 18 }}>\n        {examples[mode].map((item) => (\n          <li key={item} style={{ marginBottom: 8 }}>{item}</li>\n        ))}\n      </ul>\n      <p style={{ color: \"#475569\" }}>\n        Good IA makes navigation predictable instead of forcing users to guess.\n      </p>\n    </div>\n  );\n}` ,
          },
        },
      },
      resources: [
        { labelEn: "Official Guide", labelBn: "অফিসিয়াল গাইড", url: "https://www.figma.com/resource-library/website-structure/" },
        { labelEn: "IxDF Reference", labelBn: "IxDF রেফারেন্স", url: "https://www.interaction-design.org/literature/topics/information-architecture" },
        { labelEn: "IA Article", labelBn: "IA আর্টিকেল", url: "https://www.interaction-design.org/literature/article/what-is-information-architecture" },
      ],
    },
  },
  "ux-figma": {
    "ux-2-1": legacyLesson("Auto Layout", "অটো লেআউট", "Responsive sizing", "রেসপনসিভ ডিজাইনিং", []),
    "ux-2-2": legacyLesson("Design System", "ডিজাইন সিস্টেম", "Components and variants", "কম্পোনেন্ট এবং ভ্যারিয়েন্টস", []),
    "ux-2-3": legacyLesson("Interactive Prototype", "ইন্টারঅ্যাকটিভ প্রোটোটাইপ", "Prototyping flows", "ফ্লো প্রোটোটাইপিং", [
        { labelEn: "Figma Learn", labelBn: "ফিঘমা লার্ন", url: "https://help.figma.com/hc/en-us" }
    ])
  },

  // --- GRAPHIC & BRAND PATH (6 modules) ---
  "gd-m1": {
    "gd-1-1": legacyLesson(
      "Color, Typography & Grid",
      "কালার, টাইপোগ্রাফি, গ্রিড",
      `# The Holy Trinity of Visuals 🎨
Design isn't just "making it pop." It's visual communication through three fundamental variables:
1. **Color:** Evokes emotion. (Blue = Trust, Red = Urgency).
2. **Typography:** Defines the Voice. (Serif = Classic, Sans-Serif = Modern).
3. **Grid:** Provides Structure and rhythm.

### 🛠️ Do It Yourself Task
- [ ] Open Figma / Illustrator.
- [ ] Pick 1 Primary Color and 2 Neutrals (Dark Slate, Light Gray).
- [ ] Create a "Type Scale" (H1: 48px, H2: 32px, Body: 16px).
- [ ] Apply a 12-column grid layout to your frame.`,
      `# ভিজ্যুয়াল আর্টের তিনটি স্তম্ভ 🎨
ডিজাইন মানেই শুধু সুন্দর করে সাজানো নয়। এটি মূলত তিনটি নির্দিষ্ট উপাদানের মাধ্যমে ভিজ্যুয়াল কমিউনিকেশন তৈরি করা:
১. **কালার (রঙ):** যা আবেগ তৈরি করে (যেমন নীল মানে বিশ্বস্ততা, লাল মানে জরুরি)।
২. **টাইপোগ্রাফি:** যা ব্র্যান্ডের গলার স্বর ঠিক করে (সেরিফ মানে ক্লাসিক, স্যান্স-সেরিফ মানে মর্ডান)।
৩. **গ্রিড (Grid):** যা লেখাকে একটি কাঠামোগত ছন্দ দেয়।

### 🛠️ আপনার করণীয় (DIY)
- [ ] Figma বা Illustrator ওপেন করুন।
- [ ] ১টি প্রাইমারি কালার এবং ২টি নিউট্রাল কালার (ডার্ক, লাইট গ্রে) সিলেক্ট করুন।
- [ ] একটি "Type Scale" তৈরি করুন (যেমন H1: 48px, Body: 16px)।
- [ ] আপনার ফ্রেমে ১২-কলামের গ্রিড বসান।`
    ),
    "gd-1-2": legacyLesson("Logo & Brand Guide", "লোগো ও ব্র্যান্ড গাইড", "Identity creation", "আইডেন্টিটি ডিজাইন", []),
    "gd-1-3": legacyLesson("Brand Kit Setup", "ব্র্যান্ড কিট সেটআপ", "Asset management", "অ্যাসেট ম্যানেজমেন্ট", [
        { labelEn: "Google Fonts", labelBn: "গুগল ফন্টস", url: "https://fonts.google.com/" }
    ])
  },
  "gd-m2": {
    "gd-2-1": legacyLesson("Social Template Kit", "সোশ্যাল টেমপ্লেট কিট", "Designing for Instagram & FB", "ইনস্টাগ্রাম ও ফেসবুকের জন্য ডিজাইন", []),
    "gd-2-2": legacyLesson("Multi-Format Export", "মাল্টি-ফরম্যাট এক্সপোর্ট", "Export settings in Figma", "এক্সপোর্ট সেটিংস", []),
    "gd-2-3": legacyLesson("CTA Hierarchy", "CTA হায়ারার্কি", "Guiding the eye to click", "ব্যবহারকারীর নজর ক্লিকে নেওয়া", [
        { labelEn: "Canva Design School", labelBn: "ক্যানভা ডিজাইন স্কুল", url: "https://www.canva.com/designschool/" }
    ])
  },
  "gd-m3": {
    "gd-3-1": legacyLesson("Micro-Animations", "মাইক্রো অ্যানিমেশন", "Adding life to design", "ডিজাইনে প্রাণ সঞ্চার করা", []),
    "gd-3-2": legacyLesson("Storyboarding", "স্টোরিবোর্ডিং", "Planning the narrative", "ন্যারেটিভ প্ল্যানিং", []),
    "gd-3-3": legacyLesson("Video Asset Pipeline", "ভিডিও অ্যাসেট পাইপলাইন", "AfterEffects to Lottie", "আফটার ইফেক্টস থেকে লটি", [
        { labelEn: "LottieFiles", labelBn: "লটিফাইলস", url: "https://lottiefiles.com/" }
    ])
  },
  "gd-m4": {
    "gd-4-1": legacyLesson("A/B Variation Design", "A/B ভ্যারিয়েশন", "Creating variants", "ভ্যারিয়েন্ট তৈরি করা", []),
    "gd-4-2": legacyLesson("Hook & CTA Testing", "হুক/CTA টেস্টিং", "Split testing visuals", "স্প্লিট টেস্টিং ভিজ্যুয়াল", []),
    "gd-4-3": legacyLesson("Performance Review", "পারফরম্যান্স রিভিউ", "Reading the analytics", "অ্যানালিটিক্স পড়া", [
        { labelEn: "Meta Blueprint", labelBn: "মেটা ব্লুপ্রিন্ট", url: "https://www.facebook.com/business/learn" }
    ])
  },
  "gd-m5": {
    "gd-5-1": legacyLesson("Bilingual Visual Variations", "বাংলা/ইংরেজি ভ্যারিয়েশন", "Typography scaling across languages", "ল্যাংগুয়েজ টাইপোগ্রাফি", []),
    "gd-5-2": legacyLesson("Inclusive Visuals", "ইনক্লুসিভ ভিজ্যুয়াল", "Designing for everyone", "সবার জন্য ডিজাইন", []),
    "gd-5-3": legacyLesson("Community Asset Library", "কমিউনিটি অ্যাসেট লাইব্রেরি", "Shared components", "শেয়ারড কম্পোনেন্টস", [])
  },
  "gd-m6": {
    "gd-6-1": legacyLesson("Versioning & Naming", "ভার্সনিং ও নামকরণ", "File naming conventions", "ফাইল নেমিং কনভেনশন", []),
    "gd-6-2": legacyLesson("Export Standards", "এক্সপোর্ট স্ট্যান্ডার্ড", "Webp, SVG, PNG optimizations", "ফরম্যাট অপটিমাইজেশন", []),
    "gd-6-3": legacyLesson("Cross-Team Handoff", "ক্রস-টিম হ্যান্ডঅফ", "Delivering to developers", "ডেভেলপারদের কাছে হস্তান্তর", [{ labelEn: "Figma Dev Mode", labelBn: "ফিঘমা ডেভ মোড", url: "https://www.figma.com/dev-mode/" }])
  }
};

LEGACY_DESIGN_COURSES["ux-foundations"] = DESIGN_UX_MONTH_ONE;
LEGACY_DESIGN_COURSES["gd-m1"] = DESIGN_BRAND_MONTH_ONE;

export const DESIGN_COURSES = mergeGeneratedPath("design-brand", mergeGeneratedPath("design-ux", LEGACY_DESIGN_COURSES));

