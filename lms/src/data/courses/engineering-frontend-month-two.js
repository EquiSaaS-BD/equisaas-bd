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

const clientStateResources = [
  { labelEn: "Redux Toolkit Docs", labelBn: "Redux Toolkit ডকস", url: "https://redux-toolkit.js.org/introduction/getting-started" },
  { labelEn: "Zustand Docs", labelBn: "Zustand ডকস", url: "https://zustand.docs.pmnd.rs/getting-started/introduction" },
  { labelEn: "React State Guide", labelBn: "React state গাইড", url: "https://react.dev/learn/managing-state" },
];

const serverStateResources = [
  { labelEn: "TanStack Query Docs", labelBn: "TanStack Query ডকস", url: "https://tanstack.com/query/latest" },
  { labelEn: "React Fetching Guide", labelBn: "React fetching গাইড", url: "https://react.dev/reference/react/useEffect#fetching-data-with-effects" },
  { labelEn: "Query Keys Guide", labelBn: "Query key গাইড", url: "https://tanstack.com/query/latest/docs/framework/react/guides/query-keys" },
];

const formResources = [
  { labelEn: "React Hook Form Docs", labelBn: "React Hook Form ডকস", url: "https://react-hook-form.com/" },
  { labelEn: "Zod Docs", labelBn: "Zod ডকস", url: "https://zod.dev/" },
  { labelEn: "Web Form Accessibility", labelBn: "Form accessibility গাইড", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/How_to_structure_a_web_form" },
];

export const FRONTEND_MONTH_TWO = {};

Object.assign(FRONTEND_MONTH_TWO, {
  "fe-2-1": academicLesson({
    titleEn: "Redux Toolkit/Zustand Client State",
    titleBn: "Redux Toolkit/Zustand ক্লায়েন্ট স্টেট",
    introEn: [
      "Once screens become interactive, we must decide where changing values should live. That decision is the heart of state architecture.",
      "Beginners often put every value into local component state, then later discover prop drilling, duplication, and hard-to-follow updates. A stronger engineer asks which state is local, which state is shared, and which state should not live in a client store at all.",
      "This lecture teaches client state as a decision skill. Redux Toolkit and Zustand are tools, but the bigger lesson is learning how to model UI-driven data without turning the app into a maze.",
    ],
    introBn: [
      "Screen interactive হলে আমাদের decide করতে হয় changing value কোথায় থাকবে। এই decision-ই state architecture-এর মূল কথা।",
      "নতুনরা প্রায়ই সব value local component state-এ রেখে দেয়, তারপর prop drilling, duplication, আর hard-to-follow update-এর সমস্যায় পড়ে। Strong engineer আগে জিজ্ঞেস করে: কোন state local, কোন state shared, আর কোন state client store-এই থাকার কথা না।",
      "এই lecture client state-কে decision skill হিসেবে শেখায়। Redux Toolkit আর Zustand tool, কিন্তু বড় lesson হলো UI-driven data-কে cleanভাবে model করা।",
    ],
    learnEn: [
      "The difference between local state, lifted state, and shared client state",
      "When Zustand is enough and when Redux Toolkit is worth the structure",
      "How to avoid prop drilling without creating unnecessary global state",
      "How to model UI state for filters, drawers, selection, and workflow steps",
    ],
    learnBn: [
      "local state, lifted state, আর shared client state-এর পার্থক্য",
      "কখন Zustand যথেষ্ট আর কখন Redux Toolkit-এর structure দরকার",
      "অযথা global state না বানিয়ে prop drilling এড়ানোর উপায়",
      "filter, drawer, selection, আর workflow step-এর UI state model করা",
    ],
    whatEn: [
      "Client state is data that belongs to the browser session and changes because of interaction. Examples include open/closed panels, selected filters, step progress in a form, draft text, and optimistic UI selections.",
      "Local state lives close to the component that owns it. Lifted state moves upward when multiple sibling components need the same value. Shared client state tools like Zustand or Redux Toolkit become useful when distant parts of the app need coordinated access.",
      "Redux Toolkit gives stronger structure for larger teams and more predictable update flows. Zustand gives lighter setup and faster readability for smaller shared-state needs.",
    ],
    whatBn: [
      "Client state হলো browser session-এ থাকা সেই data যা interaction-এর কারণে বদলায়। যেমন open/closed panel, selected filter, form step progress, draft text, বা optimistic UI selection।",
      "Local state সেই component-এর কাছেই থাকে যে এটি own করে। যখন একাধিক sibling component একই value চায়, state-কে উপরে তোলা হয়। Zustand বা Redux Toolkit-এর মতো shared client state tool তখন দরকার হয় যখন app-এর দূরের অংশগুলোকে coordinated access দিতে হয়।",
      "Redux Toolkit বড় team আর predictable update flow-এর জন্য বেশি structured। Zustand ছোট shared-state need-এর জন্য lighter আর সহজ।",
    ],
    whyEn: [
      "Bad client-state decisions create invisible bugs. Two components disagree about the current filter, a modal closes unexpectedly, or the wrong step is shown because state ownership was unclear.",
      "EquiSaaS has learner filters, progress widgets, submission drawers, task tabs, and admin view toggles. Those are classic client-state problems. A clear model reduces confusion before code even begins.",
    ],
    whyBn: [
      "খারাপ client-state decision invisible bug তৈরি করে। দুই component current filter নিয়ে disagree করে, modal হঠাৎ বন্ধ হয়ে যায়, বা wrong step show হয় কারণ state ownership পরিষ্কার ছিল না।",
      "EquiSaaS-এ learner filter, progress widget, submission drawer, task tab, আর admin view toggle আছে। এগুলো classic client-state problem। Clear model code শুরু হওয়ার আগেই confusion কমায়।",
    ],
    thinkEn: [
      "Think of client state like notes on a team desk. A sticky note on one laptop is local state. A whiteboard everyone in the room uses is shared state. The skill is choosing the smallest surface that still keeps everyone aligned.",
    ],
    thinkBn: [
      "Client state-কে team desk-এর note ভাবুন। এক laptop-এর sticky note হলো local state। পুরো room যেটা দেখে সেই whiteboard হলো shared state। skill হলো যত ছোট surface-এ সম্ভব state রাখা, কিন্তু alignment না হারানো।",
    ],
    stepsEn: [
      "List the changing values in the feature before choosing any library.",
      "Mark each value as local, lifted, or shared.",
      "Keep state as close as possible to the component that owns the interaction.",
      "Use Zustand for light shared UI state and Redux Toolkit when updates, slices, and team discipline need stronger structure.",
      "Store only the minimal shared shape. Derive everything else from it.",
      "Review whether any state is actually server data pretending to be client state.",
    ],
    stepsBn: [
      "কোন library নেবেন তার আগে feature-এর changing value list করুন।",
      "প্রতিটি value-কে local, lifted, বা shared mark করুন।",
      "যে component interaction own করে, state-কে যতটা সম্ভব তার কাছেই রাখুন।",
      "Light shared UI state-এর জন্য Zustand আর stronger structure দরকার হলে Redux Toolkit ব্যবহার করুন।",
      "শুধু minimal shared shape store করুন। বাকি জিনিস derive করুন।",
      "দেখুন কোনো state আসলে server data কি না, যেটাকে ভুল করে client state বানানো হয়েছে।",
    ],
    conceptsEn: [
      "**Local state** stays near one component.",
      "**Lifted state** serves multiple nearby components.",
      "**Shared client store** helps distant components coordinate.",
      "**Prop drilling** is repeated manual passing through many layers.",
      "**Derived state** should often be calculated, not stored.",
      "**Store discipline** matters more than the brand name of the library.",
    ],
    conceptsBn: [
      "**Local state** একটি component-এর কাছাকাছি থাকে।",
      "**Lifted state** একাধিক কাছাকাছি component-কে serve করে।",
      "**Shared client store** দূরের component-কে coordinate করতে সাহায্য করে।",
      "**Prop drilling** হলো বহু layer দিয়ে একই data manually pass করা।",
      "**Derived state** অনেক সময় store না করে calculate করা উচিত।",
      "**Store discipline** library brand-এর চেয়ে বেশি গুরুত্বপূর্ণ।",
    ],
    whenEn: [
      "When multiple components need the same UI value",
      "When drawers, tabs, filters, and selection state must stay synchronized",
      "When lifting state becomes noisy across many layers",
      "When the team needs predictable update ownership",
    ],
    whenBn: [
      "যখন একাধিক component একই UI value চায়",
      "যখন drawer, tab, filter, আর selection state synchronized থাকতে হবে",
      "যখন state lift করতে করতে layer অনেক বেড়ে যায়",
      "যখন team-এর predictable update ownership দরকার",
    ],
    exampleEn: [
      "An EquiSaaS task board may need a shared `selectedStatusFilter`, `activeTaskId`, and `isSubmissionSheetOpen`. Those values influence multiple parts of the same screen. A small shared store can keep those pieces coordinated without making every child pass props through many layers.",
    ],
    exampleBn: [
      "EquiSaaS task board-এ shared `selectedStatusFilter`, `activeTaskId`, আর `isSubmissionSheetOpen` লাগতে পারে। এই value-গুলো একই screen-এর একাধিক অংশকে প্রভাবিত করে। ছোট shared store prop drilling ছাড়াই এগুলো coordinated রাখতে পারে।",
    ],
    mistakesEn: [
      "Putting server data into a client store without reason",
      "Creating global state for values used by only one component",
      "Storing derived values that could be calculated",
      "Choosing a library before understanding the problem shape",
    ],
    mistakesBn: [
      "কারণ ছাড়া server data client store-এ রাখা",
      "যে value এক component use করে, তার জন্য global state বানানো",
      "যে value calculate করা যেত, সেটাকে store করা",
      "problem shape বোঝার আগে library choose করা",
    ],
    applyEn: [
      "Pick one dashboard surface and list every changing value on it",
      "Write `local`, `lifted`, or `shared` beside each value",
      "Explain why each value lives there before writing the store",
      "Review whether the store contains only minimal shared truth",
    ],
    applyBn: [
      "একটি dashboard surface নিয়ে তার সব changing value list করুন",
      "প্রতিটি value-এর পাশে `local`, `lifted`, বা `shared` লিখুন",
      "Store লেখার আগে explain করুন value-টি সেখানে কেন থাকবে",
      "Review করুন store-এ শুধু minimal shared truth আছে কি না",
    ],
    assignmentEn: [
      "Design the client-state plan for a learner task board with filters, active tab, selected task, and submission drawer",
      "Decide which values are local, lifted, shared, or not client state at all",
      "Build a simple shared-store demo with one filter and one selected task interaction",
      "Submit code or screenshot plus a note explaining your state-ownership decisions",
      "Evaluation focus: state placement, clarity, minimalism, and reasoning",
    ],
    assignmentBn: [
      "filter, active tab, selected task, আর submission drawer-সহ learner task board-এর client-state plan design করুন",
      "কোন value local, lifted, shared, বা client state না - তা decide করুন",
      "একটি filter আর একটি selected task interaction-সহ simple shared-store demo বানান",
      "Code বা screenshot submit করুন, সাথে state-ownership decision explain করুন",
      "Evaluation focus: state placement, clarity, minimalism, আর reasoning",
    ],
    quickCheckEn: [
      "Can you explain why not all changing data should become global state?",
      "Can you tell the difference between local UI state and server data?",
      "Can you name one case where derived state should not be stored?",
      "Can you justify why a filter value might belong in shared state?",
    ],
    quickCheckBn: [
      "সব changing data global state হওয়া উচিত না কেন তা explain করতে পারবেন?",
      "local UI state আর server data-এর পার্থক্য বলতে পারবেন?",
      "একটি উদাহরণ দিতে পারবেন যেখানে derived state store করা উচিত না?",
      "filter value কেন shared state হতে পারে তা justify করতে পারবেন?",
    ],
    summaryEn: [
      "Client state is about ownership, not only libraries",
      "Keep state as local as possible and as shared as necessary",
      "Zustand and Redux Toolkit solve different scales of the same problem",
      "Good state architecture reduces confusion before bugs appear",
    ],
    summaryBn: [
      "Client state-এর মূল কথা library না, ownership",
      "State-কে যতটা সম্ভব local আর যতটা দরকার ততটাই shared রাখুন",
      "Zustand আর Redux Toolkit একই problem-এর দুই scale solve করে",
      "ভালো state architecture bug আসার আগেই confusion কমায়",
    ],
    sandpack: makeSandpack(`import React, { useMemo, useState } from "react";

function FilterButton({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{ padding: "10px 14px", borderRadius: 10, background: active ? "#dbeafe" : "#f8fafc" }}>
      {label}
    </button>
  );
}

export default function App() {
  const tasks = [
    { id: "1", title: "Write lesson summary", status: "todo" },
    { id: "2", title: "Submit practice lab", status: "doing" },
    { id: "3", title: "Review teammate work", status: "done" },
  ];
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedTaskId, setSelectedTaskId] = useState("1");
  const visibleTasks = useMemo(
    () => (activeFilter === "all" ? tasks : tasks.filter((task) => task.status === activeFilter)),
    [activeFilter],
  );

  return (
    <div style={{ fontFamily: "sans-serif", padding: 20, maxWidth: 620 }}>
      <h2>Client State Planner</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {["all", "todo", "doing", "done"].map((filter) => (
          <FilterButton key={filter} label={filter} active={activeFilter === filter} onClick={() => setActiveFilter(filter)} />
        ))}
      </div>
      <ul style={{ paddingLeft: 18 }}>
        {visibleTasks.map((task) => (
          <li key={task.id} onClick={() => setSelectedTaskId(task.id)} style={{ cursor: "pointer", marginBottom: 8 }}>
            {task.title} - {task.status} {task.id === selectedTaskId ? "(selected)" : ""}
          </li>
        ))}
      </ul>
      <p><strong>Shared UI values:</strong> activeFilter, selectedTaskId</p>
    </div>
  );
}`),
    resources: clientStateResources,
  }),
  "fe-2-2": academicLesson({
    titleEn: "TanStack Query Server State & Caching",
    titleBn: "TanStack Query সার্ভার স্টেট ও ক্যাশিং",
    introEn: [
      "Client state is not the same as server state. That difference saves teams from many painful bugs.",
      "Server state comes from an external source like an API or Firestore. It can change without the current component knowing. Because of that, server data needs fetching, caching, background refresh, and error handling that local state tools do not provide well on their own.",
      "This lecture teaches why TanStack Query is not just a fetch helper. It is a server-state management system that keeps UI responsive while data stays trustworthy.",
    ],
    introBn: [
      "Client state আর server state এক জিনিস না। এই পার্থক্যই team-কে অনেক painful bug থেকে বাঁচায়।",
      "Server state API বা Firestore-এর মতো external source থেকে আসে। current component না জানলেও data বদলে যেতে পারে। তাই server data-এর জন্য fetching, caching, background refresh, আর error handling দরকার, যা local state tool একা ভালোভাবে দেয় না।",
      "এই lecture শেখাবে TanStack Query শুধু fetch helper না; এটি server-state management system।",
    ],
    learnEn: [
      "Why server state should not usually live in a client store",
      "How query keys, caching, refetching, and stale data work",
      "How loading, error, empty, and background-fetch states improve UX",
      "How to model read-efficient data access for SaaS dashboards",
    ],
    learnBn: [
      "server state সাধারণত client store-এ রাখা উচিত না কেন",
      "query key, caching, refetching, আর stale data কীভাবে কাজ করে",
      "loading, error, empty, আর background-fetch state UX কীভাবে improve করে",
      "SaaS dashboard-এর জন্য read-efficient data access কীভাবে model করতে হয়",
    ],
    whatEn: [
      "Server state is data fetched from outside the component tree. Because another user or process may change it, the UI must treat it as something that can become stale.",
      "TanStack Query keeps track of the fetch lifecycle. It caches results, identifies them with query keys, reuses data between screens, and quietly refreshes when needed.",
      "This means the user can see cached data quickly while the app checks whether newer data exists in the background.",
    ],
    whatBn: [
      "Server state হলো component tree-এর বাইরে থেকে fetched data। অন্য user বা process এটি বদলে দিতে পারে, তাই UI-কে এটাকে stale হতে পারে এমন data হিসেবে treat করতে হয়।",
      "TanStack Query fetch lifecycle track করে। query key দিয়ে result identify করে, cache করে, screen-এ reuse করে, আর দরকার হলে quietly refresh করে।",
      "ফলে user দ্রুত cached data দেখতে পারে, আর app background-এ check করতে পারে নতুন data আছে কি না।",
    ],
    whyEn: [
      "If server data is shoved into local client state, teams lose refetch logic, caching strategy, and background freshness. The UI becomes both slower and less trustworthy.",
      "EquiSaaS dashboards, reporting cards, task lists, and member views all read remote data. We need those screens to feel fast without lying to the user about freshness.",
    ],
    whyBn: [
      "Server data-কে local client state-এ গুঁজে দিলে refetch logic, caching strategy, আর background freshness হারিয়ে যায়। UI ধীরও হয়, আবার কম trustworthy-ও হয়।",
      "EquiSaaS dashboard, reporting card, task list, আর member view - সবই remote data পড়ে। তাই screen fast লাগতে হবে, কিন্তু user-কে freshness নিয়ে ভুল signal দেওয়া যাবে না।",
    ],
    thinkEn: [
      "Think of server state like water from a municipal supply. You store some in a tank for quick use, but you still need to know when the main source changes. TanStack Query is the system that manages that tank, refill timing, and quality checks.",
    ],
    thinkBn: [
      "Server state-কে municipality-র পানির মতো ভাবুন। দ্রুত ব্যবহারের জন্য কিছু tank-এ রাখেন, কিন্তু main source বদলাচ্ছে কি না তাও জানতে হয়। TanStack Query সেই tank, refill timing, আর quality check manage করে।",
    ],
    stepsEn: [
      "Identify the remote data and give it a stable query key.",
      "Fetch the data through a query function instead of scattered effect logic.",
      "Render loading, error, empty, and success states deliberately.",
      "Reuse cached data where appropriate so navigation feels fast.",
      "Allow background refetch so the UI can become fresh without jarring reloads.",
      "Invalidate or refetch the right query after a mutation.",
    ],
    stepsBn: [
      "Remote data identify করুন আর stable query key দিন।",
      "Scattered effect logic-এর বদলে query function দিয়ে data fetch করুন।",
      "loading, error, empty, আর success state intentionalভাবে render করুন।",
      "যেখানে দরকার cached data reuse করুন, যাতে navigation fast লাগে।",
      "Background refetch allow করুন, যাতে UI jarring reload ছাড়াই fresh হতে পারে।",
      "mutation-এর পর সঠিক query invalidate বা refetch করুন।",
    ],
    conceptsEn: [
      "**Query key** identifies one cacheable data request.",
      "**Cache** stores recent data for fast reuse.",
      "**Stale data** may still be shown while freshness is being checked.",
      "**Background refetch** updates silently without blocking the screen.",
      "**Invalidation** marks cached data as needing a refresh.",
    ],
    conceptsBn: [
      "**Query key** একটি cacheable data request identify করে।",
      "**Cache** recent data fast reuse-এর জন্য রাখে।",
      "**Stale data** freshness check চলাকালেও দেখানো হতে পারে।",
      "**Background refetch** screen block না করে quietly update করে।",
      "**Invalidation** cached data-কে refresh দরকার বলে mark করে।",
    ],
    whenEn: [
      "When data comes from Firestore or an API",
      "When screens are revisited and should feel fast",
      "When freshness matters but full-page loading every time feels slow",
      "When a mutation should refresh related lists or summaries",
    ],
    whenBn: [
      "যখন data Firestore বা API থেকে আসে",
      "যখন screen-এ বারবার ফেরা হয় আর fast feel দরকার",
      "যখন freshness জরুরি কিন্তু প্রতিবার full-page loading ধীর লাগে",
      "যখন mutation-এর পর related list বা summary refresh করতে হয়",
    ],
    exampleEn: [
      "A learner task list can show cached tasks instantly, then refetch in the background after the user returns from a lesson page. The screen feels quick, but the data can still become fresh.",
    ],
    exampleBn: [
      "Learner task list cached task সাথে সাথে দেখাতে পারে, তারপর user lesson page থেকে ফিরে এলে background-এ refetch করতে পারে। screen quick লাগে, আবার data fresh-ও হতে পারে।",
    ],
    mistakesEn: [
      "Treating server data like permanent local truth",
      "Using weak or inconsistent query keys",
      "Showing only loading and success while ignoring error and empty states",
      "Forgetting to refresh related queries after a mutation",
    ],
    mistakesBn: [
      "Server data-কে permanent local truth মনে করা",
      "weak বা inconsistent query key ব্যবহার করা",
      "error আর empty state বাদ দিয়ে শুধু loading আর success দেখানো",
      "mutation-এর পর related query refresh করতে ভুলে যাওয়া",
    ],
    applyEn: [
      "Map each remote dataset to one query key before coding",
      "Write down what the user should see in loading, error, empty, and success cases",
      "Decide which queries should refresh after a submission or approval event",
      "Use cached data as a performance helper, not as an excuse to ignore freshness",
    ],
    applyBn: [
      "Code লেখার আগে প্রতিটি remote dataset-এর জন্য একটি query key map করুন",
      "loading, error, empty, আর success case-এ user কী দেখবে লিখে নিন",
      "submission বা approval event-এর পর কোন query refresh হবে তা decide করুন",
      "cached data-কে performance helper হিসেবে ব্যবহার করুন, freshness ignore করার অজুহাত হিসেবে না",
    ],
    assignmentEn: [
      "Design the server-state plan for a learner task list and progress summary",
      "Create query keys, define fetch boundaries, and describe loading/error/empty behavior",
      "Build a small demo that shows cached data and a background refresh signal",
      "Submit code or screenshot plus one note explaining why this data should not live in a client store",
      "Evaluation focus: query clarity, UX states, freshness thinking, and reasoning",
    ],
    assignmentBn: [
      "learner task list আর progress summary-এর server-state plan design করুন",
      "query key, fetch boundary, আর loading/error/empty behavior define করুন",
      "cached data আর background refresh signal দেখায় এমন ছোট demo বানান",
      "Code বা screenshot submit করুন, সাথে লিখুন কেন এই data client store-এ থাকা উচিত না",
      "Evaluation focus: query clarity, UX state, freshness thinking, আর reasoning",
    ],
    quickCheckEn: [
      "Can you explain the difference between client state and server state?",
      "Can you say what a query key is for?",
      "Can you describe why background refetch improves UX?",
      "Can you point out one mutation that should invalidate related data?",
    ],
    quickCheckBn: [
      "client state আর server state-এর পার্থক্য explain করতে পারবেন?",
      "query key কী কাজে লাগে তা বলতে পারবেন?",
      "background refetch UX কেন improve করে তা describe করতে পারবেন?",
      "একটি mutation identify করতে পারবেন যেটা related data invalidate করবে?",
    ],
    summaryEn: [
      "Server state needs a fetch lifecycle, not just a place to sit",
      "TanStack Query adds caching, reuse, refetch, and freshness control",
      "Strong UX includes loading, error, empty, and background-refresh states",
      "Fast screens should still tell the truth about data freshness",
    ],
    summaryBn: [
      "Server state-এর শুধু storage না, fetch lifecycle দরকার",
      "TanStack Query caching, reuse, refetch, আর freshness control দেয়",
      "ভালো UX-এ loading, error, empty, আর background-refresh state থাকে",
      "Fast screen হলেও data freshness নিয়ে সত্য কথা বলতে হবে",
    ],
    sandpack: makeSandpack(`import React, { useEffect, useState } from "react";

export default function App() {
  const [cachedTime, setCachedTime] = useState("No cached data yet");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = (mode = "initial") => {
    if (mode === "initial") setIsLoading(true);
    if (mode === "background") setIsFetching(true);
    setTimeout(() => {
      setCachedTime(new Date().toLocaleTimeString());
      setIsLoading(false);
      setIsFetching(false);
    }, 1400);
  };

  useEffect(() => {
    fetchData("initial");
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", padding: 20, maxWidth: 560 }}>
      <h2>Server State Cache Demo</h2>
      <button onClick={() => fetchData("background")} disabled={isFetching} style={{ padding: "10px 14px", borderRadius: 10 }}>
        {isFetching ? "Refreshing..." : "Background Refetch"}
      </button>
      <div style={{ marginTop: 16, padding: 16, background: "#f8fafc", borderRadius: 12 }}>
        <p><strong>Cached value:</strong> {isLoading ? "Loading first response..." : cachedTime}</p>
        {isFetching && <p style={{ color: "#475569" }}>Showing cached data while checking for a newer result...</p>}
      </div>
    </div>
  );
}`),
    resources: serverStateResources,
  }),
  "fe-2-3": academicLesson({
    titleEn: "Form Validation & Error Handling",
    titleBn: "ফর্ম ভ্যালিডেশন ও ত্রুটি হ্যান্ডলিং",
    introEn: [
      "Forms are where product trust becomes visible. A learner enters text, uploads a link, submits a task, or edits profile data. If the form is confusing, silent, or careless, the whole product feels unreliable.",
      "Strong form handling means more than collecting inputs. It means guiding the user, validating data early, preventing broken payloads, showing useful errors, and keeping submission state understandable.",
      "This lecture teaches form architecture as user protection. React Hook Form and schema validation tools help, but the deeper lesson is building forms that feel calm and safe under real product conditions.",
    ],
    introBn: [
      "Form হলো সেই জায়গা যেখানে product trust visible হয়। learner text লিখে, link submit করে, task জমা দেয়, বা profile data edit করে। Form confusing, silent, বা careless হলে পুরো product unreliable লাগে।",
      "ভালো form handling শুধু input collect করা না। এটি user-কে guide করে, data early validate করে, broken payload আটকায়, useful error দেখায়, আর submission state understandable রাখে।",
      "এই lecture form architecture-কে user protection হিসেবে শেখায়। React Hook Form আর schema validation tool সাহায্য করে, কিন্তু বড় lesson হলো calm আর safe form বানানো।",
    ],
    learnEn: [
      "How to model form fields, validation rules, and submission states",
      "Why client-side validation and server-side validation are partners, not enemies",
      "How to show inline errors, global errors, and success feedback clearly",
      "How to design task-submission forms that reduce user confusion",
    ],
    learnBn: [
      "form field, validation rule, আর submission state কীভাবে model করতে হয়",
      "client-side validation আর server-side validation একে অপরের partner কেন",
      "inline error, global error, আর success feedback কীভাবে clearভাবে দেখাতে হয়",
      "task-submission form কীভাবে design করলে user confusion কমে",
    ],
    whatEn: [
      "A form is a temporary workflow, not just a group of inputs. The user is moving from incomplete data toward valid submission.",
      "Validation checks whether the data shape is acceptable before it travels deeper into the system. Some rules can be checked in the browser, while others must still be checked on the server.",
      "Error handling is the communication layer. It tells the user what went wrong, where it went wrong, and what to do next.",
    ],
    whatBn: [
      "Form শুধু input-এর group না; এটি একটি temporary workflow। user incomplete data থেকে valid submission-এর দিকে এগোয়।",
      "Validation দেখে data shape acceptable কি না, তারপরে সেটি system-এর deeper layer-এ যায়। কিছু rule browser-এ check করা যায়, আবার কিছু rule server-এ check করতেই হবে।",
      "Error handling হলো communication layer। এটি user-কে বলে কী ভুল হয়েছে, কোথায় ভুল হয়েছে, আর এখন কী করতে হবে।",
    ],
    whyEn: [
      "Weak forms create silent failure. Users click submit and see nothing, type invalid values without help, or lose work because submission state was unclear.",
      "EquiSaaS depends on forms for assignment submission, task notes, profile editing, and governance actions. Good form behavior improves trust, completion rates, and review quality.",
    ],
    whyBn: [
      "দুর্বল form silent failure তৈরি করে। user submit চাপলেও কিছু বুঝতে পারে না, invalid value লিখে help পায় না, বা submission state unclear থাকার কারণে work হারায়।",
      "EquiSaaS assignment submission, task note, profile edit, আর governance action-এর জন্য form-এর ওপর নির্ভর করে। ভালো form behavior trust, completion rate, আর review quality বাড়ায়।",
    ],
    thinkEn: [
      "Think of a form like a guided checkpoint. A good checkpoint does not only stop the wrong person. It also explains the rule, shows the right path, and lets the correct person continue smoothly.",
    ],
    thinkBn: [
      "Form-কে guided checkpoint ভাবুন। ভালো checkpoint শুধু ভুল মানুষকে থামায় না; rule explain করে, সঠিক পথ দেখায়, আর সঠিক মানুষকে smoothly যেতে দেয়।",
    ],
    stepsEn: [
      "List the fields and define what makes each one valid.",
      "Separate field-level errors from submission-level errors.",
      "Show inline guidance close to the field where correction is needed.",
      "Use clear submit states such as idle, validating, submitting, success, and failed.",
      "Preserve user input during validation failures whenever possible.",
      "Still validate on the server even if the browser checks the form first.",
    ],
    stepsBn: [
      "Field list করুন আর কোনটি valid হবে তা define করুন।",
      "field-level error আর submission-level error আলাদা করুন।",
      "যে field-এ correction দরকার, তার কাছেই inline guidance দেখান।",
      "idle, validating, submitting, success, আর failed-এর মতো clear submit state ব্যবহার করুন।",
      "যতটা সম্ভব validation failure-এ user input preserve করুন।",
      "browser form check করলেও server-এ validation রাখুন।",
    ],
    conceptsEn: [
      "**Field validation** checks one input at a time.",
      "**Schema validation** checks the full data shape.",
      "**Inline error** appears near the exact field.",
      "**Submission error** explains a failure of the whole request.",
      "**Submit state** tells the user what is happening now.",
      "**Graceful recovery** helps the user fix and continue instead of starting over.",
    ],
    conceptsBn: [
      "**Field validation** একেকটি input আলাদা check করে।",
      "**Schema validation** পুরো data shape check করে।",
      "**Inline error** নির্দিষ্ট field-এর পাশে দেখা যায়।",
      "**Submission error** পুরো request fail হলে explain করে।",
      "**Submit state** user-কে এখন কী হচ্ছে তা জানায়।",
      "**Graceful recovery** user-কে আবার শুরু না করে fix করে এগোতে সাহায্য করে।",
    ],
    whenEn: [
      "When users submit assignments, links, notes, or profile data",
      "When a form has multiple required fields or format rules",
      "When failed submission should not erase the user’s effort",
      "When the product needs trustworthy input before hitting the backend",
    ],
    whenBn: [
      "যখন user assignment, link, note, বা profile data submit করে",
      "যখন form-এ multiple required field বা format rule থাকে",
      "যখন failed submission user-এর effort মুছে ফেলা উচিত না",
      "যখন backend-এ যাওয়ার আগে trustworthy input দরকার",
    ],
    exampleEn: [
      "A task-submission form may require a task link, a summary note, and optional attachments. The link might need URL validation, the note may need a minimum length, and the submit button should show progress while the request is running.",
    ],
    exampleBn: [
      "একটি task-submission form-এ task link, summary note, আর optional attachment লাগতে পারে। link-এর URL validation দরকার, note-এর minimum length লাগতে পারে, আর request চলার সময় submit button progress দেখানো উচিত।",
    ],
    mistakesEn: [
      "Showing errors only after a failed submit without clear field guidance",
      "Replacing helpful messages with vague text like 'something went wrong'",
      "Resetting the whole form after one invalid attempt",
      "Assuming browser validation means the backend no longer needs validation",
    ],
    mistakesBn: [
      "clear field guidance ছাড়া শুধু failed submit-এর পর error দেখানো",
      "'something went wrong'-এর মতো vague text দেখানো",
      "একবার invalid হলে পুরো form reset করে দেওয়া",
      "browser validation আছে বলে backend validation বাদ দেওয়া",
    ],
    applyEn: [
      "Start by writing the exact rules of the form before coding the UI",
      "Design one message for each likely user mistake",
      "Keep input values visible after a failed submission",
      "Write both field-level and form-level error scenarios in your review note",
    ],
    applyBn: [
      "UI coding-এর আগে form-এর exact rule লিখুন",
      "সম্ভাব্য user mistake-এর জন্য আলাদা message design করুন",
      "failed submission-এর পরও input value visible রাখুন",
      "review note-এ field-level আর form-level error scenario দুটোই লিখুন",
    ],
    assignmentEn: [
      "Build a task-submission form with link, note, and priority fields",
      "Validate the link format and minimum note length before submit",
      "Show inline errors, a submit-in-progress state, and a success message",
      "Submit code or screenshot plus a short note describing client validation, server validation, and error copy choices",
      "Evaluation focus: clarity, safety, recovery behavior, and communication quality",
    ],
    assignmentBn: [
      "link, note, আর priority field-সহ task-submission form বানান",
      "submit-এর আগে link format আর note-এর minimum length validate করুন",
      "inline error, submit-in-progress state, আর success message দেখান",
      "Code বা screenshot submit করুন, সাথে লিখুন client validation, server validation, আর error copy কেন এমন",
      "Evaluation focus: clarity, safety, recovery behavior, আর communication quality",
    ],
    quickCheckEn: [
      "Can you explain why form validation is part of UX, not only correctness?",
      "Can you distinguish field-level error from submission-level error?",
      "Can you explain why backend validation is still necessary?",
      "Can you describe one recovery pattern that protects user effort?",
    ],
    quickCheckBn: [
      "form validation UX-এর অংশ কেন, শুধু correctness না - তা explain করতে পারবেন?",
      "field-level error আর submission-level error আলাদা করতে পারবেন?",
      "backend validation এখনো কেন দরকার তা explain করতে পারবেন?",
      "user effort protect করে এমন একটি recovery pattern describe করতে পারবেন?",
    ],
    summaryEn: [
      "Forms are guided workflows, not just input collections",
      "Validation protects both the system and the user",
      "Good error handling explains what failed and how to recover",
      "Trustworthy submission flows improve product quality and learner confidence",
    ],
    summaryBn: [
      "Form হলো guided workflow, শুধু input collection না",
      "Validation system আর user দুজনকেই protect করে",
      "ভালো error handling বলে কী fail করেছে আর কীভাবে recover করতে হবে",
      "Trustworthy submission flow product quality আর learner confidence বাড়ায়",
    ],
    sandpack: makeSandpack(`import React, { useMemo, useState } from "react";

export default function App() {
  const [link, setLink] = useState("");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errors = useMemo(() => {
    const next = {};
    if (link && !link.startsWith("https://")) next.link = "Start the link with https://";
    if (note && note.length < 20) next.note = "Write at least 20 characters.";
    return next;
  }, [link, note]);

  const handleSubmit = () => {
    setSubmitted(true);
    if (!link.startsWith("https://") || note.length < 20) return;
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 1200);
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: 20, maxWidth: 560 }}>
      <h2>Task Submission Form</h2>
      <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://example.com/submission" style={{ width: "100%", padding: 12, borderRadius: 10, marginBottom: 8 }} />
      {submitted && errors.link && <p style={{ color: "#b91c1c" }}>{errors.link}</p>}
      <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} placeholder="Write what you built..." style={{ width: "100%", padding: 12, borderRadius: 10 }} />
      {submitted && errors.note && <p style={{ color: "#b91c1c" }}>{errors.note}</p>}
      <button onClick={handleSubmit} disabled={isSubmitting} style={{ marginTop: 12, padding: "10px 14px", borderRadius: 10 }}>
        {isSubmitting ? "Submitting..." : "Submit Task"}
      </button>
      {submitted && !isSubmitting && !errors.link && !errors.note && <p style={{ color: "#15803d" }}>Submission looks valid and ready.</p>}
    </div>
  );
}`),
    resources: formResources,
  }),
});
