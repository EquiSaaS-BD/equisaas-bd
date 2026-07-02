const makeSandpack = (code) => ({
  template: "react",
  files: {
    "/App.js": { code },
  },
});

const academicLesson = ({
  titleEn,
  titleBn,
  introEn,
  introBn,
  learnEn,
  learnBn,
  whatEn,
  whatBn,
  whyEn,
  whyBn,
  thinkEn,
  thinkBn,
  stepsEn,
  stepsBn,
  conceptsEn,
  conceptsBn,
  whenEn,
  whenBn,
  exampleEn,
  exampleBn,
  mistakesEn,
  mistakesBn,
  applyEn,
  applyBn,
  assignmentEn,
  assignmentBn,
  quickCheckEn,
  quickCheckBn,
  summaryEn,
  summaryBn,
  sandpack,
  resources,
}) => ({
  titleEn,
  titleBn,
  contentEn: [
    `## ${titleEn}`,
    "",
    ...introEn,
    "",
    "### What You Will Learn",
    ...learnEn.map((item) => `- ${item}`),
    "",
    "### What It Is",
    ...whatEn,
    "",
    "### Why It Matters",
    ...whyEn,
    "",
    "### Think Of It Like This",
    ...thinkEn,
    "",
    "### How It Works Step by Step",
    ...stepsEn.map((item, index) => `${index + 1}. ${item}`),
    "",
    "### Key Concepts",
    ...conceptsEn.map((item) => `- ${item}`),
    "",
    "### When To Use It",
    ...whenEn.map((item) => `- ${item}`),
    "",
    "### Real Example",
    ...exampleEn,
    "",
    "### Common Mistakes",
    ...mistakesEn.map((item) => `- ${item}`),
    "",
    "### How To Apply It",
    ...applyEn.map((item) => `- ${item}`),
    "",
    "### Assignment Challenge",
    ...assignmentEn.map((item) => `- ${item}`),
    "",
    "### Quick Self-Check",
    ...quickCheckEn.map((item) => `- ${item}`),
    "",
    "### Summary",
    ...summaryEn.map((item) => `- ${item}`),
  ].join("\n"),
  contentBn: [
    `## ${titleBn}`,
    "",
    ...introBn,
    "",
    "### এই লেসনে আপনি শিখবেন",
    ...learnBn.map((item) => `- ${item}`),
    "",
    "### এটি আসলে কী",
    ...whatBn,
    "",
    "### কেন গুরুত্বপূর্ণ",
    ...whyBn,
    "",
    "### সহজভাবে ভাবুন",
    ...thinkBn,
    "",
    "### ধাপে ধাপে কীভাবে কাজ করে",
    ...stepsBn.map((item, index) => `${index + 1}. ${item}`),
    "",
    "### মূল ধারণা",
    ...conceptsBn.map((item) => `- ${item}`),
    "",
    "### কখন ব্যবহার করবেন",
    ...whenBn.map((item) => `- ${item}`),
    "",
    "### বাস্তব উদাহরণ",
    ...exampleBn,
    "",
    "### সাধারণ ভুল",
    ...mistakesBn.map((item) => `- ${item}`),
    "",
    "### কীভাবে নিজের কাজে ব্যবহার করবেন",
    ...applyBn.map((item) => `- ${item}`),
    "",
    "### অ্যাসাইনমেন্ট",
    ...assignmentBn.map((item) => `- ${item}`),
    "",
    "### নিজেকে যাচাই করুন",
    ...quickCheckBn.map((item) => `- ${item}`),
    "",
    "### সারসংক্ষেপ",
    ...summaryBn.map((item) => `- ${item}`),
  ].join("\n"),
  sandpack,
  resources,
});

const reactResources = [
  { labelEn: "React Official Learn", labelBn: "React অফিশিয়াল Learn", url: "https://react.dev/learn" },
  { labelEn: "TypeScript Handbook", labelBn: "TypeScript হ্যান্ডবুক", url: "https://www.typescriptlang.org/docs/handbook/intro.html" },
  { labelEn: "Thinking in React", labelBn: "Thinking in React", url: "https://react.dev/learn/thinking-in-react" },
];

const nextResources = [
  { labelEn: "Next.js App Router Docs", labelBn: "Next.js App Router ডকস", url: "https://nextjs.org/docs/app" },
  { labelEn: "Server and Client Components", labelBn: "Server ও Client Component", url: "https://nextjs.org/docs/app/getting-started/server-and-client-components" },
  { labelEn: "Next.js Layouts and Pages", labelBn: "Next.js layout ও page", url: "https://nextjs.org/learn/dashboard-app/creating-layouts-and-pages" },
];

const gitResources = [
  { labelEn: "GitHub Pull Request Docs", labelBn: "GitHub Pull Request ডকস", url: "https://docs.github.com/en/pull-requests" },
  { labelEn: "Atlassian Git Tutorials", labelBn: "Atlassian Git টিউটোরিয়াল", url: "https://www.atlassian.com/git/tutorials" },
  { labelEn: "Conventional Commits", labelBn: "Conventional Commits", url: "https://www.conventionalcommits.org/en/v1.0.0/" },
];

export const FRONTEND_MONTH_ONE = {};

Object.assign(FRONTEND_MONTH_ONE, {
  "fe-1-1": academicLesson({
    titleEn: "React & TypeScript Foundation",
    titleBn: "React ও TypeScript ফাউন্ডেশন",
    introEn: [
      "This is the real starting point of frontend engineering in EquiSaaS. Before a learner can build dashboards, task cards, or public profiles, they need a clean mental model of how React thinks about user interfaces.",
      "The biggest beginner mistake is treating React as a bundle of syntax. Real React work is about breaking one screen into small responsibilities. One part shows profile data, one part shows progress, one part reacts to clicks, and one part decides whether something should be visible at all.",
      "TypeScript matters because community products are built by many hands. If a component expects `title`, `score`, and `status`, we should not leave that contract vague. TypeScript makes the shape visible early so bugs and confusion are reduced.",
      "By the end of this lecture, a beginner should be able to explain components, props, state, events, lists, conditional rendering, and basic type contracts in plain language.",
    ],
    introBn: [
      "EquiSaaS-এর frontend engineering-এর আসল শুরু এই lecture। learner dashboard, task card, বা public profile বানানোর আগে learner-কে বুঝতে হবে React UI-কে কীভাবে ভাবে।",
      "নতুনদের সবচেয়ে বড় ভুল হলো React-কে শুধু syntax-এর bundle মনে করা। আসল React কাজ হলো একটি screen-কে ছোট ছোট responsibility-তে ভাগ করা। একটি অংশ profile data দেখায়, আরেকটি progress, আরেকটি click handle করে, আরেকটি decide করে কিছু visible হবে কি না।",
      "TypeScript দরকার কারণ community product অনেক মানুষ মিলে বানায়। যদি একটি component-এর কাছে `title`, `score`, আর `status` যাওয়ার কথা থাকে, সেই contract vague রাখা যাবে না। TypeScript আগেভাগেই shape visible করে confusion আর bug কমায়।",
      "এই lecture শেষে beginner নিজের ভাষায় component, props, state, event, list, conditional rendering, আর basic type contract বুঝিয়ে বলতে পারবে।",
    ],
    learnEn: [
      "Why React is a component system, not only a library name",
      "How JSX, props, state, events, lists, and conditional rendering work together",
      "How to decide what belongs to parent data and what belongs to local state",
      "Why TypeScript improves trust, onboarding, and refactoring",
    ],
    learnBn: [
      "React কেন শুধু library name না, বরং component system",
      "JSX, props, state, event, list, আর conditional rendering কীভাবে একসাথে কাজ করে",
      "কোন data parent-এ থাকবে আর কোনটা local state হবে তা কীভাবে decide করতে হয়",
      "TypeScript কেন trust, onboarding, আর refactor improve করে",
    ],
    whatEn: [
      "React is a declarative UI model. Instead of manually changing the browser step by step, we describe what the screen should look like for a given set of data. When the data changes, React updates the visible result.",
      "A component is the smallest reusable unit in that model. A badge, card, task row, filter panel, or profile header can each become one component with one clear job.",
      "Props are the contract from parent to child. State is the changing memory inside a component. Events start change. Lists and conditionals turn raw data into repeated or optional UI.",
      "TypeScript sits on top of that flow and makes the contract explicit. It does not replace React. It makes React safer to understand and safer to change.",
    ],
    whatBn: [
      "React হলো declarative UI model। browser-কে step-by-step change বলার বদলে আমরা বলি, নির্দিষ্ট data থাকলে screen কেমন হবে। data বদলালে React visible result update করে।",
      "এই model-এর সবচেয়ে ছোট reusable unit হলো component। badge, card, task row, filter panel, বা profile header - সবই একেকটি clear job-ওয়ালা component হতে পারে।",
      "Props parent থেকে child-এ contract পাঠায়। State component-এর changing memory। Event change শুরু করে। List আর conditional raw data-কে repeated বা optional UI-তে রূপ দেয়।",
      "TypeScript এই flow-এর ওপর contract explicit করে। এটি React-এর বিকল্প না; React-কে safer to understand আর safer to change করে।",
    ],
    whyEn: [
      "Community products become messy very quickly when UI logic is written as one giant block. Small reusable pieces help teams review faster, test faster, and ship with less fear.",
      "EquiSaaS needs lesson cards, progress summaries, task widgets, member headers, and public contribution views. The same screen patterns repeat. React helps us build those patterns once and reuse them cleanly.",
      "TypeScript matters even more in a learning community because new contributors must read old work confidently.",
    ],
    whyBn: [
      "UI logic যদি এক বিশাল block-এ লেখা হয়, community product খুব দ্রুত messy হয়ে যায়। ছোট reusable অংশ team-কে দ্রুত review, দ্রুত test, আর কম ভয় নিয়ে ship করতে সাহায্য করে।",
      "EquiSaaS-এ lesson card, progress summary, task widget, member header, আর public contribution view লাগে। একই screen pattern বারবার আসে। React এগুলো cleanভাবে reuse করতে সাহায্য করে।",
      "Learning community-তে TypeScript আরও দরকারি, কারণ নতুন contributor-কে পুরনো code confidentভাবে পড়তে হয়।",
    ],
    thinkEn: [
      "Think of React like a notice board made of labeled boxes. One box shows announcements, one shows progress, one shows tasks. We build each box separately, then assemble the full board.",
      "TypeScript is the label on each box. It says what may go inside and warns when the wrong thing is dropped there.",
    ],
    thinkBn: [
      "React-কে labeled box দিয়ে বানানো notice board ভাবুন। একটি box announcement দেখায়, একটি progress, একটি task। আমরা প্রতিটি box আলাদা বানাই, তারপর full board assemble করি।",
      "TypeScript হলো প্রতিটি box-এর label। এটি বলে দেয় ভেতরে কী যাবে, আর ভুল কিছু ঢুকলে warning দেয়।",
    ],
    stepsEn: [
      "Look at a screen and name its visible parts, such as profile header, progress card, and task list.",
      "Turn each part into a component candidate with one clear responsibility.",
      "Ask which values come from outside. Those become props.",
      "Ask which values change because of user interaction. Those become local state.",
      "Use events like `onClick` and `onChange` to update state.",
      "Use arrays for repeated UI and conditionals for optional UI.",
      "Write type definitions so teammates know the expected shape of the component contract.",
    ],
    stepsBn: [
      "একটি screen দেখে visible অংশগুলোর নাম লিখুন, যেমন profile header, progress card, আর task list।",
      "প্রতিটি অংশকে একটি clear responsibility-ওয়ালা component candidate বানান।",
      "যে value বাইরে থেকে আসে, সেগুলো props হবে।",
      "যে value user interaction-এর কারণে বদলায়, সেগুলো local state হবে।",
      "State update করতে `onClick` আর `onChange` ব্যবহার করুন।",
      "Repeated UI-এর জন্য array আর optional UI-এর জন্য conditional ব্যবহার করুন।",
      "Type definition লিখুন, যাতে teammate expected shape বুঝতে পারে।",
    ],
    conceptsEn: [
      "**JSX** lets us describe UI in a readable syntax.",
      "**Components** divide a screen into reusable responsibilities.",
      "**Props** move trusted data from parent to child.",
      "**State** stores values that change over time.",
      "**Events** connect user action to UI change.",
      "**Conditional rendering** hides or shows UI based on data.",
      "**List rendering** maps arrays into repeated UI blocks.",
      "**Type contracts** make component APIs explicit.",
    ],
    conceptsBn: [
      "**JSX** readable syntax-এ UI describe করতে দেয়।",
      "**Component** screen-কে reusable responsibility-তে ভাগ করে।",
      "**Props** parent থেকে child-এ trusted data পাঠায়।",
      "**State** সময়ের সাথে বদলানো value ধরে।",
      "**Event** user action-কে UI change-এর সাথে যুক্ত করে।",
      "**Conditional rendering** data অনুযায়ী UI hide বা show করে।",
      "**List rendering** array-কে repeated UI block-এ map করে।",
      "**Type contract** component API-কে explicit করে।",
    ],
    whenEn: [
      "When a screen has repeated UI blocks",
      "When interaction changes what the user sees",
      "When teams need clear parent-child boundaries",
      "When a feature will likely be reused across dashboard and profile surfaces",
    ],
    whenBn: [
      "যখন screen-এ repeated UI block থাকে",
      "যখন interaction visible UI বদলায়",
      "যখন team-এর parent-child boundary পরিষ্কার দরকার",
      "যখন feature dashboard আর profile-এ reuse হবে",
    ],
    exampleEn: [
      "Imagine an EquiSaaS learner profile screen with a profile header, trust badge, and pending task list. Instead of mixing everything into one file, we can create small pieces with a visible prop contract.",
      "",
      "```tsx",
      "type TaskCardProps = {",
      "  title: string;",
      "  status: \"todo\" | \"doing\" | \"done\";",
      "};",
      "",
      "function TaskCard({ title, status }: TaskCardProps) {",
      "  return <li>{title} - {status}</li>;",
      "}",
      "```",
      "",
      "The code is small, but the idea is powerful: one component, one job, visible contract.",
    ],
    exampleBn: [
      "ধরুন EquiSaaS learner profile screen-এ profile header, trust badge, আর pending task list আছে। সবকিছু এক file-এ না মিশিয়ে আমরা ছোট ছোট visible prop contract-ওয়ালা component বানাতে পারি।",
      "",
      "```tsx",
      "type TaskCardProps = {",
      "  title: string;",
      "  status: \"todo\" | \"doing\" | \"done\";",
      "};",
      "",
      "function TaskCard({ title, status }: TaskCardProps) {",
      "  return <li>{title} - {status}</li>;",
      "}",
      "```",
      "",
      "Code ছোট, কিন্তু idea শক্তিশালী: one component, one job, visible contract।",
    ],
    mistakesEn: [
      "Putting every UI rule into one large component",
      "Using state for values that should just be props",
      "Creating random local state without checking the source of truth",
      "Rendering lists without stable keys",
      "Ignoring TypeScript warnings instead of understanding them",
    ],
    mistakesBn: [
      "সব UI rule এক বড় component-এ ঢুকিয়ে দেওয়া",
      "যে value props হওয়া উচিত, সেটাকে state বানানো",
      "source of truth না দেখে random local state তৈরি করা",
      "stable key ছাড়া list render করা",
      "TypeScript warning না বুঝে ignore করা",
    ],
    applyEn: [
      "Open one existing LMS screen and list five visible components before writing code",
      "Write prop contracts in plain language first",
      "Use state only for local interaction, not for every piece of data",
      "Before submitting, explain where each important value comes from and where it changes",
    ],
    applyBn: [
      "একটি existing LMS screen খুলে code লেখার আগে পাঁচটি visible component list করুন",
      "আগে plain language-এ prop contract লিখুন",
      "প্রতিটি data-এর জন্য state নয়; শুধু local interaction-এর জন্য state ব্যবহার করুন",
      "Submit-এর আগে লিখুন গুরুত্বপূর্ণ value কোথা থেকে আসে আর কোথায় বদলায়",
    ],
    assignmentEn: [
      "Build a `StudentProfileCard` with subparts: profile header, trust badge, progress line, and task preview",
      "Accept `name`, `pathTitle`, `trustScore`, `completedLessons`, and `tasks` as props",
      "Add one local interaction with state, such as toggling task visibility or increasing practice count",
      "Submit code link or screenshot, plus a short note explaining props, state, and your TypeScript contract idea",
      "Evaluation focus: component breakdown, clear data flow, meaningful interaction, and readable explanation",
    ],
    assignmentBn: [
      "`StudentProfileCard` বানান যেখানে profile header, trust badge, progress line, আর task preview থাকবে",
      "Props হিসেবে `name`, `pathTitle`, `trustScore`, `completedLessons`, আর `tasks` নিন",
      "State দিয়ে একটি local interaction যোগ করুন, যেমন task visibility toggle বা practice count increase",
      "Code link বা screenshot submit করুন, সাথে ছোট note দিন: props, state, আর TypeScript contract idea",
      "Evaluation focus: component breakdown, clear data flow, meaningful interaction, আর readable explanation",
    ],
    quickCheckEn: [
      "Can you explain the difference between props and state without jargon?",
      "Can you say when a list should be rendered from data instead of repeated manually?",
      "Can you name one TypeScript benefit beyond 'it shows errors'?",
      "Can you identify the source of truth of one value in your component plan?",
    ],
    quickCheckBn: [
      "Jargon ছাড়া props আর state-এর পার্থক্য explain করতে পারবেন?",
      "কখন list manually repeat না করে data থেকে render করা উচিত তা বলতে পারবেন?",
      "TypeScript-এর একটি লাভ 'error দেখায়' ছাড়াও বলতে পারবেন?",
      "আপনার plan-এ একটি value-এর source of truth identify করতে পারবেন?",
    ],
    summaryEn: [
      "React helps us think in reusable UI responsibilities instead of giant page scripts",
      "Props pass input and state manages local change",
      "Events, lists, and conditionals turn data into interactive screens",
      "TypeScript makes component contracts clear enough for teams to learn and ship safely",
    ],
    summaryBn: [
      "React আমাদের giant page script-এর বদলে reusable UI responsibility-তে ভাবতে শেখায়",
      "Props input পাঠায় আর state local change manage করে",
      "Event, list, আর conditional data-কে interactive screen-এ রূপ দেয়",
      "TypeScript component contract এত পরিষ্কার করে যে team safely শিখতেও পারে, ship-ও করতে পারে",
    ],
    sandpack: makeSandpack(`import React, { useState } from "react";

function TaskPreview({ tasks, showTasks }) {
  if (!showTasks) {
    return <p style={{ color: "#475569" }}>Task preview hidden for focus mode.</p>;
  }

  return (
    <ul style={{ paddingLeft: 18, margin: "12px 0 0" }}>
      {tasks.map((task) => (
        <li key={task.id} style={{ marginBottom: 8 }}>
          <strong>{task.title}</strong> - {task.status}
        </li>
      ))}
    </ul>
  );
}

function StudentProfileCard({ name, pathTitle, trustScore, completedLessons, tasks }) {
  const [practiceCount, setPracticeCount] = useState(completedLessons);
  const [showTasks, setShowTasks] = useState(true);

  return (
    <section style={{ fontFamily: "sans-serif", maxWidth: 520, padding: 20, borderRadius: 18, border: "1px solid #cbd5e1", background: "linear-gradient(135deg, #eff6ff, #ffffff)" }}>
      <p style={{ margin: 0, color: "#2563eb", fontWeight: 700 }}>Learner Profile</p>
      <h2 style={{ marginBottom: 8 }}>{name}</h2>
      <p style={{ marginTop: 0, color: "#334155" }}>{pathTitle}</p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
        <span style={{ background: "#dbeafe", padding: "8px 12px", borderRadius: 999 }}>Trust Score: {trustScore}</span>
        <span style={{ background: "#dcfce7", padding: "8px 12px", borderRadius: 999 }}>Completed Lessons: {practiceCount}</span>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
        <button onClick={() => setPracticeCount((prev) => prev + 1)} style={{ padding: "10px 16px", borderRadius: 10 }}>Add practice rep</button>
        <button onClick={() => setShowTasks((prev) => !prev)} style={{ padding: "10px 16px", borderRadius: 10 }}>
          {showTasks ? "Hide task preview" : "Show task preview"}
        </button>
      </div>
      <TaskPreview tasks={tasks} showTasks={showTasks} />
    </section>
  );
}

export default function App() {
  const tasks = [
    { id: "task-1", title: "Build profile header", status: "doing" },
    { id: "task-2", title: "Write assignment note", status: "todo" },
    { id: "task-3", title: "Submit screenshot", status: "done" },
  ];

  return (
    <StudentProfileCard
      name="Sumaiya Akter"
      pathTitle="Frontend Engineer Masterclass"
      trustScore={82}
      completedLessons={4}
      tasks={tasks}
    />
  );
}`),
    resources: reactResources,
  }),
  "fe-1-2": academicLesson({
    titleEn: "Next.js App Router & Routing",
    titleBn: "Next.js App Router ও রাউটিং",
    introEn: [
      "Once a learner understands components, the next question is: how do all those screens fit together inside a real product? That is where routing becomes architecture, not just navigation.",
      "A SaaS product is not one page. It contains a landing page, dashboard, task detail view, public profile, admin panels, loading states, and error states. If route structure is unclear, the whole product feels harder to scale.",
      "A strong frontend engineer should be able to decide: what is the route, what is the shared layout, what is dynamic, what needs loading feedback, and what belongs on the server versus the client.",
      "This lecture teaches App Router as a system map for a real LMS and cooperative product, not as a file-naming trick.",
    ],
    introBn: [
      "Learner যখন component বুঝে ফেলে, তখন পরের প্রশ্ন হয়: এত screen একটি real product-এর ভিতরে কীভাবে fit হবে? সেখানেই routing শুধু navigation না থেকে architecture হয়ে যায়।",
      "SaaS product এক page না। এতে landing page, dashboard, task detail view, public profile, admin panel, loading state, আর error state থাকে। route structure unclear হলে পুরো product scale করা কঠিন লাগে।",
      "একজন strong frontend engineer decide করতে পারে: route কোনটা, shared layout কোথায়, কোন অংশ dynamic, কোথায় loading feedback লাগবে, আর কোনটা server/client boundary-তে যাবে।",
      "এই lecture App Router-কে file naming trick হিসেবে না দেখে real LMS আর cooperative product-এর system map হিসেবে শেখায়।",
    ],
    learnEn: [
      "How App Router turns filesystem structure into product structure",
      "What `page`, `layout`, `loading`, `error`, and dynamic segments actually do",
      "How to separate shared shell, route content, and interaction-heavy parts",
      "How routing decisions affect bundle size, reuse, and team ownership",
    ],
    learnBn: [
      "App Router কীভাবে filesystem structure-কে product structure-এ রূপ দেয়",
      "`page`, `layout`, `loading`, `error`, আর dynamic segment কী কাজ করে",
      "shared shell, route content, আর interaction-heavy অংশ কীভাবে আলাদা করতে হয়",
      "routing decision কীভাবে bundle size, reuse, আর team ownership-কে প্রভাবিত করে",
    ],
    whatEn: [
      "In the App Router, folders and files describe the route tree. Architecture becomes visible in the codebase itself. A new teammate can understand the product surface by looking at the `app/` directory.",
      "`page.tsx` is the main UI entry of a route segment. `layout.tsx` wraps related pages with shared UI. `loading.tsx` gives the user feedback while data arrives. `error.tsx` gives the route a graceful failure path.",
      "Dynamic segments like `[taskId]` map one screen pattern to many records. Server and client components are different tools for different responsibilities, not rivals.",
    ],
    whatBn: [
      "App Router-এ folder আর file route tree describe করে। Architecture codebase-এর ভিতরেই visible হয়। নতুন teammate `app/` directory দেখেই product surface বুঝতে পারে।",
      "`page.tsx` route segment-এর main UI entry। `layout.tsx` related page-গুলোকে shared UI shell দেয়। `loading.tsx` data আসার সময় feedback দেয়। `error.tsx` route-কে graceful failure path দেয়।",
      "`[taskId]`-এর মতো dynamic segment এক screen pattern-কে অনেক record-এর সাথে map করে। Server আর client component আলাদা responsibility-এর tool, rival না।",
    ],
    whyEn: [
      "A route tree is also an ownership tree. If a dashboard layout is shared, child routes should not duplicate that shell. If a detail page is dynamic, the structure should reveal that clearly.",
      "EquiSaaS needs lightweight public pages, cohesive logged-in routes, and isolated admin routes. Strong App Router thinking supports chunk-splitting, reuse, and clean mental models.",
      "If routing stays accidental, review, debugging, navigation, onboarding, and bundle optimization all become harder.",
    ],
    whyBn: [
      "Route tree আসলে ownership tree-ও। dashboard layout shared হলে child route-গুলোকে সেই shell duplicate করা উচিত না। detail page dynamic হলে structure-তেই সেটা visible থাকা উচিত।",
      "EquiSaaS-এ lightweight public page, cohesive logged-in route, আর isolated admin route দরকার। strong App Router thinking chunk-splitting, reuse, আর clean mental model support করে।",
      "Routing accidental হলে review, debugging, navigation, onboarding, আর bundle optimization কঠিন হয়ে যায়।",
    ],
    thinkEn: [
      "Think of the product like a campus. It has a public gate, a learner zone, an admin zone, and many rooms inside each zone. A layout is the hallway shared by several rooms. A dynamic route is a room template whose room number changes.",
      "If the building map is clear, everyone reaches the right room quickly. If the map is confusing, even a beautiful room becomes frustrating to use.",
    ],
    thinkBn: [
      "Product-কে একটি campus ভাবুন। এতে public gate, learner zone, admin zone, আর প্রতিটি zone-এর ভিতরে অনেক room আছে। Layout হলো একাধিক room-এর shared hallway। Dynamic route হলো এমন room template যার room number বদলায়।",
      "Building map পরিষ্কার হলে সবাই দ্রুত ঠিক room-এ পৌঁছায়। Map confusing হলে সুন্দর room-ও ব্যবহার করতে বিরক্ত লাগে।",
    ],
    stepsEn: [
      "List the major product surfaces first: landing, dashboard, public profile, task detail, admin report.",
      "Create folders that reflect those surfaces honestly.",
      "Add a shared layout wherever child routes use the same sidebar, topbar, or wrapper.",
      "Use dynamic segments for detail pages like members, lessons, tasks, or public profiles.",
      "Add loading and error files where the user would otherwise see a blank or confusing wait.",
      "Keep route shells lean and move heavy interaction into client components.",
      "Review the route tree as if a new teammate had to understand the product from the filesystem alone.",
    ],
    stepsBn: [
      "প্রথমে major product surface list করুন: landing, dashboard, public profile, task detail, admin report।",
      "এই surface-গুলো honestভাবে reflect করে এমন folder বানান।",
      "যেখানে child route একই sidebar, topbar, বা wrapper use করবে, সেখানে shared layout দিন।",
      "member, lesson, task, বা public profile detail page-এর জন্য dynamic segment ব্যবহার করুন।",
      "যেখানে user blank বা confusing wait দেখবে, সেখানে loading আর error file দিন।",
      "route shell lean রাখুন আর heavy interaction client component-এ নিন।",
      "Filesystem দেখে নতুন teammate product বুঝতে পারবে কি না, সেটা মাথায় রেখে route tree review করুন।",
    ],
    conceptsEn: [
      "**Route segment** is one level of URL and folder hierarchy.",
      "**Page file** defines the primary UI entry for that segment.",
      "**Layout file** creates persistent shared chrome.",
      "**Dynamic segment** maps one UI pattern to many records.",
      "**Loading file** gives user feedback while data resolves.",
      "**Error file** prevents route-level failure from feeling catastrophic.",
      "**Server/client boundary** helps place data and interaction in the right place.",
    ],
    conceptsBn: [
      "**Route segment** হলো URL আর folder hierarchy-এর এক স্তর।",
      "**Page file** সেই segment-এর primary UI entry define করে।",
      "**Layout file** persistent shared chrome তৈরি করে।",
      "**Dynamic segment** এক UI pattern-কে অনেক record-এর সাথে map করে।",
      "**Loading file** data resolve হওয়ার সময় feedback দেয়।",
      "**Error file** route-level failure-কে catastrophic লাগা থেকে বাঁচায়।",
      "**Server/client boundary** data আর interaction-কে সঠিক জায়গায় বসাতে সাহায্য করে।",
    ],
    whenEn: [
      "When building dashboard-style products with nested sections",
      "When public and logged-in experiences have different shells",
      "When detail pages depend on IDs or slugs",
      "When performance and route-level ownership both matter",
    ],
    whenBn: [
      "যখন nested section-ওয়ালা dashboard-style product বানাচ্ছেন",
      "যখন public আর logged-in experience-এর shell আলাদা",
      "যখন detail page ID বা slug-এর ওপর নির্ভরশীল",
      "যখন performance আর route-level ownership দুটোই গুরুত্বপূর্ণ",
    ],
    exampleEn: [
      "Imagine this EquiSaaS route plan:",
      "",
      "```tsx",
      "app/",
      "  layout.tsx",
      "  page.tsx",
      "  dashboard/",
      "    layout.tsx",
      "    page.tsx",
      "    tasks/",
      "      page.tsx",
      "      [taskId]/",
      "        page.tsx",
      "        loading.tsx",
      "  u/",
      "    [userId]/",
      "      page.tsx",
      "```",
      "",
      "A reviewer can immediately see that `/dashboard` shares one shell, task detail is dynamic, and public profiles stay separated from the private dashboard area.",
    ],
    exampleBn: [
      "এই EquiSaaS route plan কল্পনা করুন:",
      "",
      "```tsx",
      "app/",
      "  layout.tsx",
      "  page.tsx",
      "  dashboard/",
      "    layout.tsx",
      "    page.tsx",
      "    tasks/",
      "      page.tsx",
      "      [taskId]/",
      "        page.tsx",
      "        loading.tsx",
      "  u/",
      "    [userId]/",
      "      page.tsx",
      "```",
      "",
      "Reviewer সাথে সাথে বুঝতে পারে `/dashboard` একটি shared shell use করছে, task detail dynamic, আর public profile private dashboard area থেকে আলাদা।",
    ],
    mistakesEn: [
      "Forcing one layout to do the job of every route",
      "Hardcoding detail pages instead of using dynamic segments",
      "Putting every route component on the client by default",
      "Forgetting loading and error behavior",
      "Creating a folder structure that hides ownership instead of clarifying it",
    ],
    mistakesBn: [
      "সব route-এর কাজ এক layout দিয়ে চালাতে চাওয়া",
      "dynamic segment-এর বদলে detail page hardcode করা",
      "সব route component client-এ চালানো",
      "loading আর error behavior ভুলে যাওয়া",
      "ownership clear করার বদলে folder structure-কে confusing বানানো",
    ],
    applyEn: [
      "Pick one existing LMS flow and redraw it as route segments",
      "Mark which parts are shared layout, which parts are dynamic, and which parts are interaction-heavy",
      "If a route feels overloaded, split the shell from the interactive children",
      "During review, ask whether the filesystem explains the product honestly",
    ],
    applyBn: [
      "একটি existing LMS flow route segment হিসেবে redraw করুন",
      "কোন অংশ shared layout, কোন অংশ dynamic, আর কোন অংশ interaction-heavy তা mark করুন",
      "কোন route overloaded লাগলে shell আর interactive child আলাদা করুন",
      "Review-এর সময় দেখুন filesystem product-কে honestভাবে explain করছে কি না",
    ],
    assignmentEn: [
      "Design the route plan for `/dashboard/tasks/[taskId]` and `/u/[userId]`",
      "List the files you would create and explain the role of each one",
      "State which parts are server-first and which parts need client interaction",
      "Submit a route tree, a short reasoning note, and one loading/error decision",
      "Evaluation focus: route clarity, reuse, boundary decisions, and learner-friendly explanation",
    ],
    assignmentBn: [
      "`/dashboard/tasks/[taskId]` আর `/u/[userId]`-এর route plan design করুন",
      "কোন file বানাবেন আর প্রতিটি file-এর role কী, তা লিখুন",
      "কোন অংশ server-first আর কোন অংশ client interaction চাইবে, তা লিখুন",
      "Route tree, ছোট reasoning note, আর একটি loading/error decision submit করুন",
      "Evaluation focus: route clarity, reuse, boundary decision, আর learner-friendly explanation",
    ],
    quickCheckEn: [
      "Can you explain why `layout` and `page` are not the same thing?",
      "Can you explain the value of a dynamic segment in one product example?",
      "Can you name one reason not every route should become a client component?",
      "Can you identify where loading feedback would matter in a task detail page?",
    ],
    quickCheckBn: [
      "`layout` আর `page` এক জিনিস না কেন তা explain করতে পারবেন?",
      "একটি product example-এ dynamic segment-এর value explain করতে পারবেন?",
      "সব route client component না হওয়ার অন্তত একটি কারণ বলতে পারবেন?",
      "task detail page-এ কোথায় loading feedback জরুরি হবে তা identify করতে পারবেন?",
    ],
    summaryEn: [
      "App Router turns route structure into visible product architecture",
      "Layouts, dynamic segments, loading, and error files reduce chaos and improve reuse",
      "Server/client boundaries keep routes intentional and performant",
      "A clear route tree makes onboarding, review, and scaling much easier",
    ],
    summaryBn: [
      "App Router route structure-কে visible product architecture-এ রূপ দেয়",
      "layout, dynamic segment, loading, আর error file chaos কমায় আর reuse বাড়ায়",
      "server/client boundary route-কে intentional আর performant রাখে",
      "clear route tree onboarding, review, আর scaling সহজ করে",
    ],
    sandpack: makeSandpack(`import React, { useMemo, useState } from "react";

const routeMap = {
  dashboard: { shell: "Dashboard layout with sidebar and topbar", screen: "Dashboard home", mode: "Server summary + client widgets" },
  tasks: { shell: "Dashboard layout with task list section", screen: "Task list page", mode: "Server list + client filters" },
  taskDetail: { shell: "Dashboard layout with dynamic detail route", screen: "Task detail for [taskId]", mode: "Server detail + client submission form" },
  publicProfile: { shell: "Public layout without dashboard chrome", screen: "Public member profile for [userId]", mode: "Server-first public content" },
};

function RouteBadge({ label, value }) {
  return (
    <div style={{ padding: 12, borderRadius: 12, background: "#f8fafc", border: "1px solid #cbd5e1" }}>
      <strong>{label}</strong>
      <p style={{ marginBottom: 0 }}>{value}</p>
    </div>
  );
}

export default function App() {
  const [activeRoute, setActiveRoute] = useState("taskDetail");
  const config = useMemo(() => routeMap[activeRoute], [activeRoute]);

  return (
    <div style={{ fontFamily: "sans-serif", padding: 20, maxWidth: 620 }}>
      <h2>Next.js Route Architecture Planner</h2>
      <p>Switch between product surfaces and notice how shell, screen, and responsibility change.</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {Object.keys(routeMap).map((key) => (
          <button key={key} onClick={() => setActiveRoute(key)} style={{ padding: "10px 14px", borderRadius: 10 }}>
            {key}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gap: 12 }}>
        <RouteBadge label="Shared shell" value={config.shell} />
        <RouteBadge label="Active screen" value={config.screen} />
        <RouteBadge label="Boundary idea" value={config.mode} />
      </div>
    </div>
  );
}`),
    resources: nextResources,
  }),
  "fe-1-3": academicLesson({
    titleEn: "Git/GitHub & Code Conventions",
    titleBn: "Git/GitHub ও কোড কনভেনশন",
    introEn: [
      "Modern frontend work is never only about writing code. It is also about leaving a trail that another human can review, trust, and improve. That is why Git and GitHub are part of engineering foundation, not optional tools for later.",
      "A beginner often thinks a feature is done when the screen works. A professional knows the work is not done until the history is readable, the change is scoped, the reviewer has context, and the next contributor can understand what happened.",
      "Code conventions belong to the same conversation. Branch names, commit messages, folder naming, file naming, and component naming all tell the team whether the codebase is calm or chaotic.",
      "This lecture teaches Git, GitHub, and conventions as contribution habits for a cooperative product where learners gradually become real contributors.",
    ],
    introBn: [
      "Modern frontend work শুধু code লেখা না। এমন trail রেখে যাওয়া, যা অন্য মানুষ review, trust, আর improve করতে পারে - এটাও engineering-এর অংশ। তাই Git আর GitHub পরে শেখার optional tool না; foundation-এর অংশ।",
      "নতুন learner সাধারণত ভাবে screen কাজ করলেই feature done। Professional বুঝে যে history readable, change scoped, reviewer-এর context clear, আর পরের contributor কী হয়েছে বুঝতে পারছে - এর আগে কাজ done না।",
      "Code convention-ও একই conversation-এর অংশ। branch name, commit message, folder naming, file naming, আর component naming - সব signal দেয় codebase calm নাকি chaotic।",
      "এই lecture Git, GitHub, আর convention-কে cooperative product-এর contribution habit হিসেবে শেখায়, যেখানে learner-রা ধীরে ধীরে real contributor হবে।",
    ],
    learnEn: [
      "How branches, commits, diffs, and pull requests work together",
      "Why reviewers need context, screenshots, and small scoped changes",
      "How code conventions reduce noise and speed up onboarding",
      "How to write review-ready engineering notes for a community codebase",
    ],
    learnBn: [
      "branch, commit, diff, আর pull request কীভাবে একসাথে কাজ করে",
      "reviewer-এর কেন context, screenshot, আর small scoped change দরকার",
      "code convention কীভাবে noise কমায় আর onboarding দ্রুত করে",
      "community codebase-এর জন্য review-ready engineering note কীভাবে লিখতে হয়",
    ],
    whatEn: [
      "Git is the history engine. Every commit is a meaningful snapshot. Every branch creates a safe place to work without disturbing the stable line.",
      "GitHub is the collaboration layer. Pull requests expose the diff, the discussion, the review status, and the merge decision in one visible workflow.",
      "Code conventions are shared rules that reduce ambiguity. They tell contributors how to name a branch, how to title a commit, where a file belongs, and what review-ready work looks like.",
    ],
    whatBn: [
      "Git হলো history engine। প্রতিটি commit একটি meaningful snapshot। প্রতিটি branch stable line disturb না করে safeভাবে কাজ করার জায়গা দেয়।",
      "GitHub হলো collaboration layer। Pull request diff, discussion, review status, আর merge decision-কে এক visible workflow-এ আনে।",
      "Code convention হলো shared rule যা ambiguity কমায়। branch কীভাবে নাম হবে, commit কীভাবে title হবে, file কোথায় থাকবে, আর review-ready work কাকে বলে - এগুলো convention বলে দেয়।",
    ],
    whyEn: [
      "In a cooperative platform, contributor trust matters as much as code execution. Clear history shows discipline. Good review notes show maturity. Conventions show respect for the next teammate.",
      "EquiSaaS must support new members who are learning while contributing. That means commit history should teach, not confuse, and a pull request should explain, not merely request approval.",
      "When these habits are strong, the team spends less energy guessing and more energy building.",
    ],
    whyBn: [
      "Cooperative platform-এ contributor trust code execution-এর মতোই গুরুত্বপূর্ণ। clear history discipline দেখায়। ভালো review note maturity দেখায়। convention পরের teammate-এর প্রতি respect দেখায়।",
      "EquiSaaS-এ নতুন member-রা শিখতে শিখতেই contribute করবে। তাই commit history-এর কাজ confuse করা না, teach করা। pull request-এর কাজ শুধু approval চাওয়া না, explain করা।",
      "এই habit strong হলে team guessing-এ কম সময় দেয়, build করতে বেশি সময় দেয়।",
    ],
    thinkEn: [
      "Think of Git as the diary of the project. Each commit is one clear diary entry. If the diary says only 'updated stuff', the future becomes painful.",
      "Think of GitHub pull requests as a guided conversation. The reviewer should never have to guess what changed, why it changed, or where to start reading.",
    ],
    thinkBn: [
      "Git-কে project-এর diary ভাবুন। প্রতিটি commit diary-র একটি clear entry। diary-তে যদি শুধু 'updated stuff' লেখা থাকে, future painful হয়ে যায়।",
      "GitHub pull request-কে guided conversation ভাবুন। reviewer-কে guess করতে হওয়া উচিত না কী বদলেছে, কেন বদলেছে, বা কোথা থেকে review শুরু করবে।",
    ],
    stepsEn: [
      "Before writing code, name the branch based on the problem or feature.",
      "Keep the change small enough that one reviewer can understand it without fatigue.",
      "Stage only intentional files so the diff stays honest.",
      "Write a commit message that includes action and purpose.",
      "Open a pull request with summary, impact, proof, and review focus.",
      "Respond to feedback as part of the work, not as an afterthought.",
      "Merge only when the history tells a clean story.",
    ],
    stepsBn: [
      "Code লেখার আগে problem বা feature অনুযায়ী branch-এর নাম দিন।",
      "Change এত ছোট রাখুন যেন reviewer ক্লান্ত না হয়ে scope বুঝতে পারে।",
      "শুধু intentional file stage করুন, যাতে diff honest থাকে।",
      "Action আর purpose-সহ commit message লিখুন।",
      "Summary, impact, proof, আর review focus-সহ pull request খুলুন।",
      "Feedback address করাকে main work-এর অংশ ভাবুন, পরে মনে পড়া কাজ নয়।",
      "History clean story বললে তবেই merge করুন।",
    ],
    conceptsEn: [
      "**Branch** isolates work safely.",
      "**Commit** records one meaningful story unit.",
      "**Diff** shows the exact change surface.",
      "**Pull request** creates a review and discussion space.",
      "**Convention** keeps naming and structure predictable.",
      "**Review note** helps the next person understand the intention quickly.",
    ],
    conceptsBn: [
      "**Branch** safeভাবে work isolate করে।",
      "**Commit** একটি meaningful story unit record করে।",
      "**Diff** exact change surface দেখায়।",
      "**Pull request** review আর discussion space তৈরি করে।",
      "**Convention** naming আর structure predictable রাখে।",
      "**Review note** পরের মানুষকে intention দ্রুত বুঝতে সাহায্য করে।",
    ],
    whenEn: [
      "Whenever you build a feature or fix a bug",
      "Whenever another person will review or extend your work",
      "Whenever the product needs a stable main branch",
      "Whenever you want your learning journey to become visible contribution history",
    ],
    whenBn: [
      "যখনই feature বানান বা bug fix করেন",
      "যখনই অন্য কেউ আপনার work review বা extend করবে",
      "যখন product-এর stable main branch দরকার",
      "যখন আপনার learning journey-কে visible contribution history-এ রূপ দিতে চান",
    ],
    exampleEn: [
      "Suppose you add a due-date badge to learner task cards. A strong contribution trail might look like this:",
      "",
      "```bash",
      "git checkout -b feat/task-card-due-date",
      "git add src/components/ui/TaskCard.jsx src/views/MemberTaskCenter.jsx",
      "git commit -m \"feat: show due-date badge on learner task cards\"",
      "```",
      "",
      "Then the pull request description explains what changed, why it matters, what the reviewer should check first, and which screenshot proves the UI result.",
    ],
    exampleBn: [
      "ধরুন learner task card-এ due-date badge যোগ করছেন। একটি strong contribution trail এমন হতে পারে:",
      "",
      "```bash",
      "git checkout -b feat/task-card-due-date",
      "git add src/components/ui/TaskCard.jsx src/views/MemberTaskCenter.jsx",
      "git commit -m \"feat: show due-date badge on learner task cards\"",
      "```",
      "",
      "তারপর pull request description-এ লিখবেন কী বদলেছে, কেন জরুরি, reviewer আগে কী check করবে, আর কোন screenshot UI result প্রমাণ করছে।",
    ],
    mistakesEn: [
      "Making one commit that mixes unrelated fixes",
      "Using vague commit messages like 'update' or 'final'",
      "Opening a pull request without any context or screenshot",
      "Ignoring file naming and folder conventions",
      "Treating review comments like interruption instead of improvement guidance",
    ],
    mistakesBn: [
      "এক commit-এ unrelated অনেক fix ঢুকিয়ে দেওয়া",
      "'update' বা 'final'-এর মতো vague commit message ব্যবহার করা",
      "context বা screenshot ছাড়া pull request খোলা",
      "file naming আর folder convention ignore করা",
      "review comment-কে interruption ভাবা, improvement guidance না ভাবা",
    ],
    applyEn: [
      "Before every task, write the branch name first and check whether it matches the scope",
      "Keep PR descriptions short but complete: what changed, why, proof, and review focus",
      "Use naming that another beginner can still understand after two weeks",
      "During self-review, ask whether your diff teaches the next contributor what happened",
    ],
    applyBn: [
      "প্রতিটি task-এর আগে branch name লিখুন এবং দেখুন scope-এর সাথে মিলছে কি না",
      "PR description ছোট কিন্তু complete রাখুন: কী বদলেছে, কেন, proof, আর review focus",
      "Naming এমন রাখুন যাতে আরেক beginner দুই সপ্তাহ পরেও বুঝতে পারে",
      "self-review-এ দেখুন আপনার diff পরের contributor-কে কী হয়েছে তা শেখাতে পারছে কি না",
    ],
    assignmentEn: [
      "Imagine you are adding a trust badge to the public profile screen",
      "Write the branch name, commit message, PR title, and PR summary you would use",
      "List the files you would stage and explain why they belong together",
      "Add one screenshot note and one review-focus note for the reviewer",
      "Evaluation focus: scope control, clarity, convention quality, and reviewer readiness",
    ],
    assignmentBn: [
      "ভাবুন আপনি public profile screen-এ trust badge যোগ করছেন",
      "কোন branch name, commit message, PR title, আর PR summary ব্যবহার করবেন তা লিখুন",
      "কোন file stage করবেন আর কেন একসাথে রাখা হয়েছে তা explain করুন",
      "Reviewer-এর জন্য একটি screenshot note আর একটি review-focus note যোগ করুন",
      "Evaluation focus: scope control, clarity, convention quality, আর reviewer readiness",
    ],
    quickCheckEn: [
      "Can you explain the difference between a branch, a commit, and a pull request?",
      "Can you say why a reviewer needs context beyond the code diff?",
      "Can you spot one naming convention that protects future contributors?",
      "Can you describe what makes a change review-ready?",
    ],
    quickCheckBn: [
      "branch, commit, আর pull request-এর পার্থক্য explain করতে পারবেন?",
      "code diff ছাড়াও reviewer-এর কেন context দরকার তা বলতে পারবেন?",
      "ভবিষ্যৎ contributor-কে protect করে এমন একটি naming convention identify করতে পারবেন?",
      "কোন change-কে review-ready বলা যায় তা describe করতে পারবেন?",
    ],
    summaryEn: [
      "Git records clean change history and GitHub turns it into visible collaboration",
      "Code conventions reduce guesswork and make onboarding easier",
      "A strong pull request explains intention, impact, and proof",
      "Good engineering habits let a learning community become a production community",
    ],
    summaryBn: [
      "Git clean change history ধরে আর GitHub সেটাকে visible collaboration-এ রূপ দেয়",
      "Code convention guesswork কমায় আর onboarding সহজ করে",
      "Strong pull request intention, impact, আর proof explain করে",
      "ভালো engineering habit learning community-কে production community-তে রূপ দিতে সাহায্য করে",
    ],
    sandpack: makeSandpack(`import React, { useMemo, useState } from "react";

const validPrefixes = ["feat:", "fix:", "docs:", "chore:"];

function ReviewStatus({ label, ok }) {
  return (
    <li style={{ color: ok ? "#15803d" : "#b91c1c", marginBottom: 8 }}>
      <strong>{label}</strong>: {ok ? "ready" : "missing"}
    </li>
  );
}

export default function App() {
  const [branch, setBranch] = useState("feat/public-profile-trust-badge");
  const [commit, setCommit] = useState("feat: add trust badge to public profile card");
  const [summary, setSummary] = useState("Adds a badge to the public profile header and updates the learner-facing card.");

  const checks = useMemo(() => {
    const validCommitPrefix = validPrefixes.some((prefix) => commit.startsWith(prefix));
    return {
      branchScope: branch.includes("/") && branch.length > 10,
      commitPrefix: validCommitPrefix,
      summaryLength: summary.trim().length > 35,
    };
  }, [branch, commit, summary]);

  return (
    <div style={{ fontFamily: "sans-serif", padding: 20, maxWidth: 620 }}>
      <h2>Review-Ready Contribution Planner</h2>
      <p>Fill the fields and check whether your contribution story is clear enough for a reviewer.</p>
      <div style={{ display: "grid", gap: 12 }}>
        <input value={branch} onChange={(e) => setBranch(e.target.value)} placeholder="Branch name" style={{ padding: 12, borderRadius: 10 }} />
        <input value={commit} onChange={(e) => setCommit(e.target.value)} placeholder="Commit message" style={{ padding: 12, borderRadius: 10 }} />
        <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={4} style={{ padding: 12, borderRadius: 10 }} />
      </div>
      <ul style={{ marginTop: 18, paddingLeft: 20 }}>
        <ReviewStatus label="Branch shows scope" ok={checks.branchScope} />
        <ReviewStatus label="Commit follows convention" ok={checks.commitPrefix} />
        <ReviewStatus label="PR summary gives context" ok={checks.summaryLength} />
      </ul>
    </div>
  );
}`),
    resources: gitResources,
  }),
});
