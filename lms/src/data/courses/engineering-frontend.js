import { mergeGeneratedPath } from "../generated-course-utils.js";
import { FRONTEND_MONTH_ONE } from "./engineering-frontend-month-one.js";
import { FRONTEND_MONTH_TWO } from "./engineering-frontend-month-two.js";
import { FRONTEND_MONTH_THREE } from "./engineering-frontend-month-three.js";
import { FRONTEND_MONTH_FOUR } from "./engineering-frontend-month-four.js";
import { FRONTEND_MONTH_FIVE } from "./engineering-frontend-month-five.js";
import { FRONTEND_MONTH_SIX } from "./engineering-frontend-month-six.js";

// ==========================================
// ENGINEERING - FRONTEND MASTERCLASS
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

const LEGACY_FRONTEND_COURSES = {
  "fe-m1": {
    "fe-1-1": {
      titleBn: "React ও TypeScript ফাউন্ডেশন",
      titleEn: "React & TypeScript Foundation",
      contentBn: `## React ও TypeScript ফাউন্ডেশন

React শেখা মানে শুধু একটি library শেখা নয়; বরং browser-এ interactive screen কীভাবে ছোট ছোট দায়িত্বে ভাগ করে বানাতে হয়, তা শেখা। আপনি যখন একটি LMS dashboard, lesson card, progress bar, filter panel, অথবা member profile screen তৈরি করেন, তখন পুরো page একসাথে না ভেবে ছোট reusable block-এ ভাঙতে হয়। React সেই কাজটাই সহজ করে।

TypeScript React-এর ওপর একটি safety layer যোগ করে। React আপনাকে component-based structure দেয়, আর TypeScript বলে দেয় কোন component কী data নেবে, কী ধরনের value আশা করবে, আর কোথায় ভুল হওয়ার ঝুঁকি আছে। ফলে বড় team-এ কাজ করা সহজ হয়, কারণ code শুধু চললেই হবে না, অন্যরা যেন দ্রুত বুঝতেও পারে।

এই lesson-টি এমনভাবে লেখা হয়েছে যাতে একদম beginner learner-ও React-এর core idea ধরতে পারে। আপনি এখানে JSX, component, props, state, event, list rendering, আর TypeScript contract-এর practical mental model পাবেন।

### এই লেসনে আপনি শিখবেন
- React কেন modern UI তৈরির জন্য এত জনপ্রিয়।
- JSX, component, props, state, আর event handling কীভাবে একসাথে কাজ করে।
- TypeScript কীভাবে component contract পরিষ্কার করে।
- learner dashboard-এর মতো real product screen-এ React thinking কীভাবে ব্যবহার করতে হয়।

### এটি আসলে কী
React হলো UI বানানোর একটি declarative পদ্ধতি। আপনি browser-কে step-by-step DOM change বলার বদলে বলেন, “এই data থাকলে UI এমন দেখাবে।” React তখন প্রয়োজন অনুযায়ী update করে। এতে code বেশি readable হয়।

Component হলো React-এর সবচেয়ে গুরুত্বপূর্ণ ধারণা। একটি button, card, modal, navbar, lesson row, filter bar, এমনকি পুরো dashboard section-ও component হতে পারে। প্রতিটি component-এর একটি ছোট দায়িত্ব থাকলে project বড় হলেও structure ভেঙে পড়ে না।

TypeScript এখানে guardrail-এর মতো কাজ করে। যদি একটি component-এর কাছে \`title\` text যাওয়ার কথা থাকে, কিন্তু ভুল করে number বা object পাঠানো হয়, TypeScript আগে থেকেই বলে দেয়। ফলে bug production-এ যাওয়ার আগেই ধরা পড়ে।

### কেন গুরুত্বপূর্ণ
যে product-এ প্রতিদিন নতুন feature, state change, form input, API response, আর conditional screen থাকে, সেখানে React-এর মতো structured system ছাড়া code খুব দ্রুত জট পাকিয়ে যায়। শুরুতে small project manageable মনে হলেও পরে একই logic অনেক জায়গায় copy-paste হতে থাকে।

বাংলাদেশের community-based SaaS ecosystem গড়তে গেলে আমাদের learner dashboard, task center, member profile, admin reporting, public profile, contribution list - সবকিছু scalable হতে হবে। React-এর foundation পরিষ্কার না হলে পরে refactor, testing, আর collaboration খুব কষ্টকর হয়ে যাবে।

### সহজভাবে ভাবুন
React-কে LEGO block দিয়ে ঘর বানানোর মতো ভাবতে পারেন। পুরো ঘর একবারে বানানোর বদলে দরজা, জানালা, ছাদ, টেবিল - সবকিছু আলাদা block হিসেবে বানান। পরে সেগুলো একসাথে জুড়ে বড় system বানান।

TypeScript হলো প্রতিটি LEGO box-এর label। কোন box-এ কী আছে, কোনটা কোথায় লাগবে, আর ভুল block কোথায় ঢুকছে - সেই warning TypeScript আগে থেকেই দেয়।

### ধাপে ধাপে কীভাবে কাজ করে
১. আগে screen-টি দেখুন এবং ভাবুন এটি কোন কোন ছোট অংশে ভাগ করা যায়।  
২. প্রতিটি অংশের জন্য একটি component ঠিক করুন, যেমন \`LessonCard\`, \`ProgressBadge\`, \`TaskList\`।  
৩. Parent component কোন data child-কে দেবে, তা props দিয়ে define করুন।  
৪. User click, input, toggle, filter-এর মতো interaction হলে কোন data locally বদলাবে, তা state-এ রাখুন।  
৫. List দেখালে প্রতিটি item-এর identity পরিষ্কার রাখতে key ব্যবহার করুন।  
৬. TypeScript দিয়ে component contract, state shape, আর event type যতটা সম্ভব পরিষ্কার করুন।  

### মূল ধারণা
- **JSX** হলো JavaScript-এর ভিতরে UI লেখার syntax।  
- **Component** হলো UI-এর reusable building block।  
- **Props** parent থেকে child-এ data পাঠায়।  
- **State** component-এর local changing memory।  
- **Event handling** click, input, submit-এর মতো user action handle করে।  
- **Conditional rendering** data অনুযায়ী UI বদলায়।  
- **List rendering** array data থেকে repeated UI তৈরি করে।  
- **TypeScript types** ভুল data shape আগেভাগে ধরতে সাহায্য করে।  

### কখন ব্যবহার করবেন
- যখন screen-এ অনেক repeated UI block থাকে।  
- যখন user interaction-এর কারণে UI state বদলায়।  
- যখন reusable component library গড়তে চান।  
- যখন team collaboration-এর জন্য predictable prop contract দরকার।  

### বাস্তব উদাহরণ
EquiSaaS-এর learner dashboard কল্পনা করুন। সেখানে একটি page-এ member name, progress card, enrolled path, pending task, আর latest announcement আছে। পুরো page একসাথে লিখলে file দ্রুত noisy হয়ে যাবে।

এর বদলে আমরা এভাবে ভাবি:

\`\`\`tsx
type ProgressCardProps = {
  learnerName: string;
  completedLessons: number;
};

function ProgressCard({ learnerName, completedLessons }: ProgressCardProps) {
  return (
    <section>
      <h2>{learnerName}</h2>
      <p>Completed lessons: {completedLessons}</p>
    </section>
  );
}
\`\`\`

এখানে \`ProgressCard\`-এর দায়িত্ব ছোট, props পরিষ্কার, আর অন্য screen-এও reuse করা সহজ।

### সাধারণ ভুল
- সব logic এক component-এ ঢুকিয়ে দেওয়া।  
- props আর state-এর কাজ গুলিয়ে ফেলা।  
- list render করার সময় stable key না দেওয়া।  
- TypeScript warning ignore করা।  
- UI কী data থেকে আসছে তা না বুঝে random state তৈরি করা।  

### কীভাবে নিজের কাজে ব্যবহার করবেন
- আজই একটি small screen বেছে নিন, যেমন learner progress card।  
- Screen-টিকে ৩ থেকে ৫টি component-এ ভাগ করুন।  
- প্রতিটি component-এর props plain Bangla বা English sentence-এ লিখে নিন।  
- তারপর decide করুন কোন data parent-এ থাকবে আর কোনটা local state হবে।  

### অ্যাসাইনমেন্ট
- একটি \`StudentProfileCard\` component ডিজাইন করুন।  
- Props হিসেবে \`name\`, \`pathTitle\`, \`completedLessons\`, আর \`trustScore\` নিন।  
- Card-এ একটি button দিন, যেটিতে click করলে completed lesson count এক বাড়বে।  
- Submit করার সময় লিখুন: props কেন এভাবে নিলেন, state কোথায় ব্যবহার করলেন, আর TypeScript থাকলে কোন type definition দিতেন।  

### নিজেকে যাচাই করুন
- আপনি কি এক বাক্যে বলতে পারেন React কেন দরকার?  
- props আর state-এর পার্থক্য কি নিজের ভাষায় বুঝিয়ে বলতে পারবেন?  
- list render করলে key কেন দরকার?  
- TypeScript warning early ধরলে team-এর কী লাভ হয়?  

### সারসংক্ষেপ
- React UI-কে ছোট reusable component-এ ভাগ করতে শেখায়।  
- Props data পাঠায়, state local change ধরে রাখে।  
- TypeScript contract পরিষ্কার করে bug কমায়।  
- Strong frontend foundation মানে future feature বানানো সহজ হওয়া।`,
      contentEn: `## React & TypeScript Foundation

Learning React is not only about learning a library. It is about learning how to break an interactive screen into smaller responsibilities. When we build an LMS dashboard, a lesson card, a progress bar, or a member profile, we do not want one giant page-level script. We want a system of small reusable parts, and React is excellent at that job.

TypeScript adds a safety layer on top of React. React gives us the component model, while TypeScript makes the contract of each component more explicit. It tells us what data a component expects, what kind of value is allowed, and where we are likely to make a mistake. That matters a lot when multiple people are touching the same codebase.

This lesson is written as a true foundation lecture. If a learner is new to React, they should leave this lesson understanding JSX, components, props, state, events, list rendering, and why TypeScript makes the whole system easier to trust.

### What You Will Learn
- Why React is popular for modern interactive interfaces.
- How JSX, components, props, state, and events work together.
- How TypeScript clarifies component contracts.
- How to apply React thinking to a real product surface like a learner dashboard.

### What It Is
React is a declarative way to build UI. Instead of manually telling the browser every DOM step, you describe what the screen should look like for a given piece of data. React then updates the interface when that data changes.

The most important unit in React is the component. A button, a card, a modal, a navbar, a lesson row, or even a full dashboard section can all be components. If each component owns one focused responsibility, the project stays understandable as it grows.

TypeScript acts like a guardrail. If a component expects a text title but receives an object or an unsafe event value, TypeScript warns us early. That means fewer runtime bugs, safer refactors, and better collaboration.

### Why It Matters
Any product with repeated UI, user interaction, form state, and API-driven screens becomes difficult to manage if everything is written in one big file. At first the app may feel small, but over time repeated logic, unclear data flow, and accidental side effects start to slow the team down.

For EquiSaaS, we need scalable learner dashboards, task centers, public profiles, admin reports, and contribution views. Without a strong React foundation, future features become harder to review, test, and extend.

### Think Of It Like This
Think of React like building with LEGO blocks. You do not build the whole city in one move. You build one useful block at a time: a card, a badge, a sidebar, a task row. Then you combine those blocks into larger screens.

TypeScript is like the label on each LEGO box. It tells you what belongs inside, which part fits where, and when the wrong piece is being used.

### How It Works Step by Step
1. Look at a screen and break it into smaller visible parts.  
2. Turn each part into a component, such as \`LessonCard\`, \`ProgressBadge\`, or \`TaskList\`.  
3. Decide what data the parent passes down through props.  
4. Decide what interactive values must live in local state.  
5. Use events to update state when a user clicks, types, or submits.  
6. Use TypeScript to make the shape of props, state, and events explicit.  

### Key Concepts
- **JSX** is the syntax for writing UI inside JavaScript or TypeScript.  
- **Components** are reusable UI units.  
- **Props** move data from parent to child.  
- **State** stores interaction-driven values that can change.  
- **Event handling** responds to user actions like clicks and input.  
- **Conditional rendering** changes UI based on data.  
- **List rendering** creates repeated UI from arrays.  
- **TypeScript types** catch invalid data shapes early.  

### When To Use It
- When a screen has repeated UI blocks.  
- When the interface changes in response to user interaction.  
- When you want reusable components instead of duplicated markup.  
- When the team needs predictable contracts between parts of the UI.  

### Real Example
Imagine the EquiSaaS learner dashboard. One page shows the member name, progress card, enrolled path, pending tasks, and announcements. If we write everything in one file, the page becomes noisy very quickly.

Instead, we can think like this:

\`\`\`tsx
type ProgressCardProps = {
  learnerName: string;
  completedLessons: number;
};

function ProgressCard({ learnerName, completedLessons }: ProgressCardProps) {
  return (
    <section>
      <h2>{learnerName}</h2>
      <p>Completed lessons: {completedLessons}</p>
    </section>
  );
}
\`\`\`

That component has one clear job, a small public API, and an easy path to reuse.

### Common Mistakes
- Putting too much logic into one component.  
- Mixing up the role of props and state.  
- Rendering lists without stable keys.  
- Ignoring TypeScript warnings instead of understanding them.  
- Creating random local state without tracing where the data should live.  

### How To Apply It
- Pick one small screen today, such as a learner progress card.  
- Break it into 3 to 5 components.  
- Write the props of each component in plain language first.  
- Then decide which values belong to parent data and which ones belong to local state.  

### Assignment Challenge
- Design a \`StudentProfileCard\` component.  
- Accept \`name\`, \`pathTitle\`, \`completedLessons\`, and \`trustScore\` as props.  
- Add a button that increases the completed lesson count by one.  
- When you submit, explain why you chose those props, where state is used, and what TypeScript type you would define.  

### Quick Self-Check
- Can you explain in one sentence why React is useful?  
- Can you describe the difference between props and state in your own words?  
- Can you explain why list keys matter?  
- Can you say how TypeScript helps a team move more safely?  

### Summary
- React teaches us to build UI from reusable components.  
- Props pass data and state stores local change.  
- TypeScript makes contracts clearer and reduces bugs.  
- A strong frontend foundation makes later product work much easier.`,
      sandpack: {
        template: "react",
        files: {
          "/App.js": {
            code: `// EN: A reusable React component with a clear prop contract idea.\n// BN: পরিষ্কার prop contract ধারণা দেখানোর জন্য reusable React component.\nimport React, { useState } from "react";\n\nfunction ProgressCard({ label, initialCount }) {\n  const [count, setCount] = useState(initialCount);\n\n  return (\n    <div style={{ fontFamily: "sans-serif", padding: 20, maxWidth: 420 }}>\n      <h2>{label}</h2>\n      <p>Completed exercises: {count}</p>\n      <button\n        onClick={() => setCount((prev) => prev + 1)}\n        style={{ padding: "10px 16px", borderRadius: 10, border: "none", background: "#2563eb", color: "#fff" }}\n      >\n        Add practice rep\n      </button>\n    </div>\n  );\n}\n\nexport default function App() {\n  return <ProgressCard label=\"React + TypeScript Foundation\" initialCount={1} />;\n}` ,
          },
        },
      },
      resources: [
        { labelEn: "Official Docs", labelBn: "অফিসিয়াল ডকস", url: "https://react.dev/learn/typescript" },
        { labelEn: "FreeCodeCamp Guide", labelBn: "ফ্রিকোডক্যাম্প গাইড", url: "https://forum.freecodecamp.org/t/how-to-build-a-github-repo-explorer-with-react-and-typescript/620223" },
        { labelEn: "Top YouTube Tutorial", labelBn: "ইউটিউব টিউটোরিয়াল", url: "https://www.youtube.com/watch?v=gp5H0Vw39yw" },
      ],
    },
    "fe-1-2": {
      titleBn: "Next.js App Router ও রাউটিং",
      titleEn: "Next.js App Router & Routing",
      contentBn: `## Next.js App Router ও রাউটিং

React শিখে ফেললেই production app ready হয়ে যায় না। বড় application-এ সবচেয়ে বড় challenge হলো route structure, layout reuse, loading experience, আর data boundary ঠিকভাবে গড়া। Next.js App Router এই জায়গায় খুব শক্তিশালী, কারণ এটি routing-কে শুধু URL mapping হিসেবে দেখে না; বরং পুরো screen architecture-এর অংশ হিসেবে দেখে।

App Router-এ folder structure-ই route structure-এর source of truth। তাই file tree দেখেই বোঝা যায় product-এর কোন surface কোথায় আছে। এর ফলে নতুন developer, reviewer, এবং designer সবাই codebase-এর architecture দ্রুত ধরতে পারে।

এই lesson-এ আমরা App Router-কে এমনভাবে শিখব যাতে learner শুধু \`page.tsx\` মুখস্থ না করে, বরং route segment, layout, loading, error, dynamic param, server/client boundary - সবকিছুকে একসাথে চিন্তা করতে শেখে।

### এই লেসনে আপনি শিখবেন
- App Router file-system based routing কীভাবে কাজ করে।
- \`page.tsx\`, \`layout.tsx\`, \`loading.tsx\`, \`error.tsx\`-এর কাজ কী।
- dynamic route, nested route, আর shared layout কেন দরকার।
- Next.js routing decisions performance আর maintainability-কে কীভাবে প্রভাবিত করে।

### এটি আসলে কী
Next.js App Router হলো এমন একটি routing architecture যেখানে folder আর file structure-ই route tree তৈরি করে। উদাহরণ হিসেবে \`app/dashboard/page.tsx\` মানে dashboard route, আর \`app/dashboard/members/[userId]/page.tsx\` মানে dynamic nested route।

কিন্তু App Router-এর আসল শক্তি route path-এ নয়; বরং route segment-এর চারপাশে থাকা UI behavior-এ। একটি segment-এর shared layout থাকতে পারে, loading state থাকতে পারে, error fallback থাকতে পারে, আর data fetching strategy-ও আলাদা হতে পারে।

### কেন গুরুত্বপূর্ণ
একটি LMS বা SaaS product-এ public pages, logged-in dashboard, admin screens, public profile, এবং dynamic detail page - সবকিছুর structure একরকম হয় না। যদি routing architecture intentional না হয়, তাহলে project-এ repeated wrapper, messy navigation logic, আর inconsistent loading experience তৈরি হয়।

EquiSaaS-এর মতো platform-এ member profile, task detail, lesson page, admin report - সব route-এর behavior আলাদা। App Router সঠিকভাবে বুঝলে আমরা scalable navigation, smaller bundles, আর clearer ownership পাই।

### সহজভাবে ভাবুন
একটি স্কুল ভবন কল্পনা করুন। main gate, office floor, classroom floor, library, আর student profile room - সবই একই building-এর অংশ, কিন্তু সবার entry rule এক না। App Router ঠিক এই building map-এর মতো। folder structure হলো floor plan, আর layout হলো shared corridor বা common hallway।

### ধাপে ধাপে কীভাবে কাজ করে
১. প্রথমে product-এর main surfaces list করুন: public, dashboard, admin, profile, settings।  
২. প্রতিটি surface-এর জন্য route folder ভাবুন।  
৩. যেসব screen shared shell ব্যবহার করবে, সেখানে \`layout.tsx\` রাখুন।  
৪. dynamic URL থাকলে \`[param]\` segment ব্যবহার করুন।  
৫. loading experience গুরুত্বপূর্ণ হলে \`loading.tsx\` দিন।  
৬. failure graceful করতে \`error.tsx\` ও proper boundary ভাবুন।  

### মূল ধারণা
- **\`app/\` directory** route tree-এর source of truth।  
- **\`page.tsx\`** route segment-এর main UI entry।  
- **\`layout.tsx\`** shared shell reuse করে।  
- **Dynamic segment** যেমন \`[userId]\` URL param ধরে।  
- **Nested route** parent-child navigation relationship দেখায়।  
- **Server component** data-heavy rendering-এর জন্য ভালো।  
- **Client component** interaction-heavy অংশের জন্য দরকার।  

### কখন ব্যবহার করবেন
- যখন SEO-friendly, structured app route দরকার।  
- যখন public আর private route-এর behavior আলাদা।  
- যখন shared layout reuse করতে চান।  
- যখন nested dashboard/app architecture build করছেন।  

### বাস্তব উদাহরণ
ধরুন EquiSaaS-এ এই routeগুলো আছে:

\`\`\`tsx
app/
  layout.tsx
  page.tsx
  dashboard/
    layout.tsx
    page.tsx
    tasks/
      page.tsx
    members/
      [userId]/
        page.tsx
\`\`\`

এখানে root layout পুরো app-এর base shell দেয়। \`dashboard/layout.tsx\` dashboard sidebar আর header দেয়। \`members/[userId]/page.tsx\` individual member detail route handle করে। এই structure দেখেই reviewer architecture বুঝে ফেলতে পারে।

### সাধারণ ভুল
- সব route-এ একই layout force করা।  
- dynamic route লাগলেও hardcoded path দিয়ে কাজ চালানো।  
- server/client component boundary না ভেবে সবকিছু client করা।  
- loading আর error state না ভেবে blank screen রাখা।  
- route structure আর feature ownership mismatch করা।  

### কীভাবে নিজের কাজে ব্যবহার করবেন
- EquiSaaS-এর একটি small feature নিন, যেমন public member profile।  
- লিখে ফেলুন: root route কী, nested route কী, dynamic param আছে কি না।  
- decide করুন কোন layout shared হবে।  
- তারপর server component আর client interaction কোথায় হবে, তা separate করুন।  

### অ্যাসাইনমেন্ট
- একটি \`/dashboard/tasks/[taskId]\` route plan তৈরি করুন।  
- লিখুন কোন fileগুলো লাগবে: \`page.tsx\`, \`layout.tsx\`, \`loading.tsx\`, \`error.tsx\` দরকার কি না।  
- explain করুন কোন অংশ server component হবে আর কোন অংশ client component হবে।  
- Submit-এর সময় route tree + reasoning দুটোই দিন।  

### নিজেকে যাচাই করুন
- \`page.tsx\` আর \`layout.tsx\`-এর পার্থক্য কি?  
- dynamic segment কেন দরকার?  
- সব route client component করলে কী সমস্যা হতে পারে?  
- loading state route UX-এ কীভাবে সাহায্য করে?  

### সারসংক্ষেপ
- App Router route structure-কে file system-এর সাথে যুক্ত করে।  
- layout, loading, error, আর dynamic segment মিলে route architecture complete হয়।  
- Strong routing মানে cleaner navigation, better performance, আর easier scaling।`,
      contentEn: `## Next.js App Router & Routing

Knowing React does not automatically make an application production-ready. Large products succeed or fail on route structure, layout reuse, loading experience, and data boundaries. The Next.js App Router is powerful because it treats routing as part of screen architecture, not just as URL matching.

In the App Router, the folder structure becomes the source of truth for the route tree. That means a developer, reviewer, or designer can understand major product surfaces by looking directly at the filesystem. This creates a strong mental model for scaling a codebase.

This lesson teaches the App Router as a real product architecture tool. We are not only memorizing \`page.tsx\`; we are learning how route segments, layouts, loading states, error boundaries, dynamic params, and server/client boundaries fit together.

### What You Will Learn
- How file-system routing works in the App Router.
- The job of \`page.tsx\`, \`layout.tsx\`, \`loading.tsx\`, and \`error.tsx\`.
- Why nested routes, shared layouts, and dynamic params matter.
- How routing choices affect performance and maintainability.

### What It Is
The Next.js App Router is a routing architecture where folders and files define the route tree. For example, \`app/dashboard/page.tsx\` becomes the dashboard route, while \`app/dashboard/members/[userId]/page.tsx\` becomes a nested dynamic route.

But the real strength of the App Router is not the path syntax alone. Each route segment can define shared layout, loading behavior, error recovery, and data boundaries. That makes the routing system much closer to the actual needs of a production SaaS product.

### Why It Matters
An LMS or SaaS platform usually contains public pages, logged-in dashboards, admin screens, public profiles, and dynamic detail pages. Those surfaces do not all behave the same way. Without intentional route architecture, teams end up with repeated wrappers, confusing navigation code, and inconsistent loading experiences.

For EquiSaaS, we need clear structure across member profiles, task details, lesson pages, public routes, and admin reporting. Strong App Router thinking helps us create scalable navigation, smaller bundles, and clearer ownership.

### Think Of It Like This
Think of the app like a school building. The main gate, office floor, classroom floor, library, and student profile room are all part of one building, but each area has a different purpose. The App Router is the building map, and layouts are the shared hallways connecting related rooms.

### How It Works Step by Step
1. List the main product surfaces: public, dashboard, admin, profile, settings.  
2. Create route folders for those surfaces.  
3. Add \`layout.tsx\` where multiple routes share the same shell.  
4. Use \`[param]\` when a route depends on a dynamic value.  
5. Add \`loading.tsx\` when the user needs feedback during data loading.  
6. Add \`error.tsx\` when the route should fail gracefully.  

### Key Concepts
- **The \`app/\` directory** is the source of truth for routes.  
- **\`page.tsx\`** is the main UI entry for a route segment.  
- **\`layout.tsx\`** reuses shared chrome across child routes.  
- **Dynamic segments** like \`[userId]\` capture route parameters.  
- **Nested routes** express product structure clearly.  
- **Server components** are strong for data-heavy rendering.  
- **Client components** are needed for rich interaction.  

### When To Use It
- When you want SEO-friendly and structured application routes.  
- When public and private screens behave differently.  
- When you need layout reuse across related routes.  
- When you are building nested dashboard-style interfaces.  

### Real Example
Imagine these routes in EquiSaaS:

\`\`\`tsx
app/
  layout.tsx
  page.tsx
  dashboard/
    layout.tsx
    page.tsx
    tasks/
      page.tsx
    members/
      [userId]/
        page.tsx
\`\`\`

The root layout provides the base shell. \`dashboard/layout.tsx\` provides the dashboard sidebar and header. \`members/[userId]/page.tsx\` handles an individual member route. A reviewer can understand the architecture directly from this structure.

### Common Mistakes
- Forcing the same layout onto every route.  
- Hardcoding paths when a dynamic segment is the better fit.  
- Making everything a client component without thinking about boundaries.  
- Forgetting loading and error states.  
- Designing route structure that does not match feature ownership.  

### How To Apply It
- Pick one EquiSaaS feature, such as a public member profile.  
- Write down the root route, nested route, and any dynamic parameter.  
- Decide which layout should be shared.  
- Then separate server-rendered parts from client-interactive parts.  

### Assignment Challenge
- Create a route plan for \`/dashboard/tasks/[taskId]\`.  
- List which files you need: \`page.tsx\`, \`layout.tsx\`, \`loading.tsx\`, and whether \`error.tsx\` is needed.  
- Explain which parts should be server components and which parts should be client components.  
- Submit both the route tree and your reasoning.  

### Quick Self-Check
- Can you explain the difference between \`page.tsx\` and \`layout.tsx\`?  
- Why do dynamic segments matter?  
- What risk comes from making every route a client component?  
- How does a loading state improve route experience?  

### Summary
- The App Router connects route architecture to the filesystem.  
- Layouts, loading, errors, and dynamic segments complete the routing story.  
- Strong routing design leads to cleaner navigation, better performance, and easier scaling.`,
      sandpack: {
        template: "react",
        files: {
          "/App.js": {
            code: `// EN: Simulate nested routing with a shared layout feel.\n// BN: shared layout-এর অনুভূতি দিয়ে nested routing simulate করা হচ্ছে।\nimport React, { useState } from "react";\n\nconst routes = {\n  dashboard: \"Dashboard Home\",\n  members: \"Members Index\",\n  profile: \"Dynamic Member Profile\",\n};\n\nexport default function App() {\n  const [route, setRoute] = useState(\"dashboard\");\n\n  return (\n    <div style={{ fontFamily: \"sans-serif\", padding: 20, maxWidth: 520 }}>\n      <h2>Next.js App Router Mental Model</h2>\n      <div style={{ display: \"flex\", gap: 8, marginBottom: 16 }}>\n        <button onClick={() => setRoute(\"dashboard\")}>/dashboard</button>\n        <button onClick={() => setRoute(\"members\")}>/dashboard/members</button>\n        <button onClick={() => setRoute(\"profile\")}>/dashboard/members/42</button>\n      </div>\n      <div style={{ border: \"1px solid #cbd5e1\", borderRadius: 12, padding: 16 }}>\n        <p><strong>Shared layout:</strong> Dashboard Shell</p>\n        <p><strong>Active segment:</strong> {routes[route]}</p>\n        <p>URL-driven UI stays predictable when folders and layouts are intentional.</p>\n      </div>\n    </div>\n  );\n}` ,
          },
        },
      },
      resources: [
        { labelEn: "Official Docs", labelBn: "অফিসিয়াল ডকস", url: "https://nextjs.org/docs/app" },
        { labelEn: "FreeCodeCamp Guide", labelBn: "ফ্রিকোডক্যাম্প গাইড", url: "https://www.classcentral.com/course/freecodecamp-next-js-for-beginners-full-course-104945" },
        { labelEn: "Top YouTube Tutorial", labelBn: "ইউটিউব টিউটোরিয়াল", url: "https://www.youtube.com/watch?v=1WmNXEVia8I" },
      ],
    },
    "fe-1-3": {
      titleBn: "Git/GitHub ও কোড কনভেনশন",
      titleEn: "Git/GitHub & Code Conventions",
      contentBn: `## Git/GitHub ও কোড কনভেনশন

Git শেখা মানে শুধু command মুখস্থ করা নয়; বরং পরিবর্তনকে নিরাপদ, reviewable, আর explainable করা শেখা। আপনি যখন codebase-এ change করেন, তখন শুধু “কাজ হলো” যথেষ্ট না। পরে যদি bug আসে, teammate যদি review করে, বা কয়েক সপ্তাহ পর আপনাকেই history দেখে বুঝতে হয় কী হয়েছিল, তখন Git খুব জরুরি হয়ে ওঠে।

GitHub সেই history-কে collaboration system-এ রূপ দেয়। Branch, pull request, review comment, commit history - সবকিছু মিলে engineering discussion visible হয়। বিশেষ করে community-driven product build করতে গেলে shared discipline ছাড়া codebase দ্রুত messy হয়ে যায়।

কোড কনভেনশনও এই flow-এর অংশ। File naming, folder structure, commit message, component naming, আর review checklist consistent না হলে team একই language-এ কথা বলতে পারে না। এই lesson-এ আমরা Git, GitHub, আর convention-কে engineering habit হিসেবে বুঝব।

### এই লেসনে আপনি শিখবেন
- Git commit, branch, diff, আর history কী কাজে লাগে।
- GitHub pull request workflow কেন গুরুত্বপূর্ণ।
- code convention team speed-এ কীভাবে প্রভাব ফেলে।
- small team থেকে বড় community codebase-এ discipline কীভাবে build করতে হয়।

### এটি আসলে কী
Git হলো version control system। মানে project-এর change history track করার ব্যবস্থা। আপনি কোন file কখন বদলালেন, কেন বদলালেন, আর কী diff হলো - Git এসব সংরক্ষণ করে।

GitHub হলো collaboration layer। Git local machine-এ history রাখে, আর GitHub সেই history-কে team workflow-এ নিয়ে আসে। Pull request-এর মাধ্যমে code review, discussion, approval, আর merge discipline তৈরি হয়।

Code convention হলো team-এর shared rulebook। যেমন file naming কী হবে, commit message কেমন হবে, কোন component কোন folder-এ থাকবে, review-এর আগে কী কী check হবে।

### কেন গুরুত্বপূর্ণ
Engineering team-এ সবচেয়ে বড় সময় নষ্ট হয় তখন, যখন change-এর উদ্দেশ্য বোঝা যায় না, branch strategy নেই, commit history noisy, আর naming inconsistent। তখন bug fix, onboarding, review - সবকিছু ধীর হয়ে যায়।

EquiSaaS-এর মতো cooperative platform-এ অনেক learner পরে contributor হবে। তাই code শুধু senior engineer-এর জন্য readable হলেই হবে না; নতুন contributor-ও যেন history দেখে context ধরতে পারে। Git discipline এখানে trust build করে।

### সহজভাবে ভাবুন
Git-কে project-এর diary ভাবুন। প্রতিটি meaningful commit diary-র একটি পরিষ্কার entry। GitHub হলো সেই diary নিয়ে team meeting করার জায়গা। আর code convention হলো সবাই কোন handwriting আর কোন format-এ diary লিখবে সেই rule।

### ধাপে ধাপে কীভাবে কাজ করে
১. Stable branch থেকে নতুন কাজের জন্য feature branch খুলুন।  
২. Small meaningful change করুন।  
৩. কোন file ইচ্ছাকৃতভাবে বদলেছেন, শুধু সেটাই stage করুন।  
৪. Clear commit message দিন যাতে উদ্দেশ্য বোঝা যায়।  
৫. GitHub-এ pull request খুলে reviewer-কে context দিন।  
৬. Review feedback address করে merge করুন।  

### মূল ধারণা
- **Commit** হলো একটি meaningful snapshot।  
- **Branch** risky change-কে safe space দেয়।  
- **Diff** কী বদলেছে তা visible করে।  
- **Pull Request** discussion আর review surface তৈরি করে।  
- **Conventional Commit** history scan করা সহজ করে।  
- **Shared convention** onboarding ও maintenance সহজ করে।  

### কখন ব্যবহার করবেন
- যখন feature add বা bug fix করছেন।  
- যখন team review process maintain করতে চান।  
- যখন production branch safe রাখতে চান।  
- যখন future contributor-এর জন্য readable history রাখতে চান।  

### বাস্তব উদাহরণ
ধরুন আপনি public profile page-এ trust score badge যোগ করছেন। যদি সরাসরি main branch-এ change করেন, reviewer context বুঝতে পারবে না, আর risky change isolate-ও হবে না।

\`\`\`bash
git checkout -b feat/public-profile-trust-score
git add src/views/PublicProfileView.jsx src/components/ui/Badge.jsx
git commit -m "feat: show trust score badge on public profiles"
\`\`\`

এখন pull request খুললে reviewer সহজেই বুঝবে change-এর scope কী, কোন file ছোঁয়া হয়েছে, আর history-তে এই কাজ পরে খুঁজেও পাওয়া যাবে।

### সাধারণ ভুল
- অনেক unrelated change এক commit-এ দেওয়া।  
- commit message-এ vague text লেখা, যেমন “update” বা “fix stuff”।  
- branch ছাড়াই main-এ কাজ করা।  
- formatter, naming, file structure rule ignore করা।  
- review comment resolve না করেই merge করা।  

### কীভাবে নিজের কাজে ব্যবহার করবেন
- আজ থেকে প্রতিটি কাজের আগে branch name লিখে শুরু করুন।  
- commit message-এ action + purpose রাখুন।  
- pull request description-এ “কি বদলালাম, কেন বদলালাম, কী review লাগবে” লিখুন।  
- নিজের file naming আর folder naming project convention-এর সাথে মিলিয়ে নিন।  

### অ্যাসাইনমেন্ট
- একটি imaginary feature ধরুন: learner task card-এ due date badge যোগ করা।  
- এর জন্য branch name, commit message, আর PR title লিখুন।  
- কোন fileগুলো stage করবেন তা list করুন।  
- Submit-এর সময় explain করুন কেন এগুলোকে এক commit-এ রাখলেন।  

### নিজেকে যাচাই করুন
- commit আর branch-এর কাজ কি আলাদা করে বুঝিয়ে বলতে পারবেন?  
- pull request কেন শুধু merge button না, discussion space-ও?  
- vague commit message future team-এর কী ক্ষতি করে?  
- code convention team speed-এ কীভাবে সাহায্য করে?  

### সারসংক্ষেপ
- Git change history-কে safe আর traceable করে।  
- GitHub collaboration visible করে।  
- Good convention team noise কমায়।  
- Clean engineering habit future contributor-দের জন্য পথ সহজ করে।`,
      contentEn: `## Git/GitHub & Code Conventions

Learning Git is not only about memorizing commands. It is about making change safe, reviewable, and explainable. When you modify a codebase, it is not enough that the feature works. Later a bug may appear, a reviewer may inspect the change, or even you may need to understand the history after several weeks. That is where Git becomes essential.

GitHub turns that history into a collaboration system. Branches, pull requests, review comments, and commit history make engineering discussion visible. In a community-driven product, shared discipline is not optional. Without it, the codebase becomes noisy very quickly.

Code conventions are part of the same system. File naming, folder structure, commit style, component naming, and review expectations help the team speak the same language. This lesson teaches Git, GitHub, and conventions as engineering habits, not just tools.

### What You Will Learn
- What commits, branches, diffs, and history are for.
- Why the GitHub pull request workflow matters.
- How code conventions improve team speed.
- How to build discipline for a growing contributor community.

### What It Is
Git is a version control system. It tracks the history of change in a project. It helps you see what changed, when it changed, and why it changed.

GitHub is the collaboration layer on top. Git stores history locally, while GitHub gives the team a place to review, discuss, approve, and merge changes through pull requests.

Code convention is the shared rulebook of the team. It covers how files are named, how folders are organized, how commits are written, and what good review-ready code looks like.

### Why It Matters
Teams lose a huge amount of time when change history is unclear, branches are unmanaged, commit messages are vague, and naming is inconsistent. Debugging slows down, onboarding becomes harder, and reviews become frustrating.

For EquiSaaS, many learners will later become contributors. That means the codebase must be readable not only for experienced developers, but also for new members who need to understand context from history. Good Git discipline builds trust.

### Think Of It Like This
Think of Git as the diary of the project. Every meaningful commit is one clear diary entry. GitHub is where the team discusses those diary entries together. Code convention is the shared handwriting and format rule for writing the diary.

### How It Works Step by Step
1. Create a feature branch before starting new work.  
2. Make a small meaningful change.  
3. Stage only the files you intentionally changed.  
4. Write a commit message that explains the purpose clearly.  
5. Open a pull request and give the reviewer context.  
6. Address feedback before merging.  

### Key Concepts
- **A commit** is a meaningful snapshot.  
- **A branch** isolates risky work from the stable line.  
- **A diff** shows exactly what changed.  
- **A pull request** creates a review and discussion surface.  
- **A Conventional Commit** makes history easier to scan.  
- **Shared conventions** improve onboarding and maintenance.  

### When To Use It
- When building a feature or fixing a bug.  
- When protecting a stable production branch.  
- When working with reviewers.  
- When preserving readable history for future contributors.  

### Real Example
Imagine you are adding a trust score badge to the public profile page. If you work directly on the main branch, the change is harder to isolate and review.

\`\`\`bash
git checkout -b feat/public-profile-trust-score
git add src/views/PublicProfileView.jsx src/components/ui/Badge.jsx
git commit -m "feat: show trust score badge on public profiles"
\`\`\`

Now the reviewer can easily understand the scope, the touched files, and the purpose of the change.

### Common Mistakes
- Putting unrelated work in one commit.  
- Writing vague commit messages like “update” or “fix stuff”.  
- Working directly on main instead of a feature branch.  
- Ignoring formatter, naming, and file-structure rules.  
- Merging before review comments are properly handled.  

### How To Apply It
- Start every task by naming the branch before writing code.  
- Use commit messages that include both action and purpose.  
- In the pull request description, explain what changed, why it changed, and what review is needed.  
- Compare your filenames and folder choices against project convention.  

### Assignment Challenge
- Imagine a feature where you add a due-date badge to a learner task card.  
- Write the branch name, commit message, and PR title you would use.  
- List which files you would stage.  
- When you submit, explain why those changes belong in one commit.  

### Quick Self-Check
- Can you explain the difference between a branch and a commit?  
- Why is a pull request more than just a merge button?  
- What harm comes from vague commit messages?  
- How do conventions make a team faster?  

### Summary
- Git makes change history safe and traceable.  
- GitHub makes collaboration visible.  
- Good conventions reduce noise across the team.  
- Clean engineering habits make future contributions much easier.`,
      sandpack: {
        template: "react",
        files: {
          "/App.js": {
            code: `// EN: Validate a simple conventional commit message.\n// BN: একটি সাধারণ conventional commit message যাচাই করা হচ্ছে।\nimport React, { useMemo, useState } from "react";\n\nconst prefixes = [\"feat:\", \"fix:\", \"docs:\", \"chore:\"];\n\nexport default function App() {\n  const [message, setMessage] = useState(\"feat: add route-aware lesson cards\");\n  const matchedPrefix = useMemo(() => prefixes.find((prefix) => message.startsWith(prefix)), [message]);\n\n  return (\n    <div style={{ fontFamily: \"sans-serif\", padding: 20, maxWidth: 520 }}>\n      <h2>Commit Convention Checker</h2>\n      <input\n        value={message}\n        onChange={(event) => setMessage(event.target.value)}\n        style={{ width: \"100%\", padding: 12, borderRadius: 10, border: \"1px solid #cbd5e1\" }}\n      />\n      <p style={{ marginTop: 16, fontWeight: 700, color: matchedPrefix ? \"#15803d\" : \"#b91c1c\" }}>\n        {matchedPrefix ? \"Valid conventional commit\" : \"Start with feat:, fix:, docs:, or chore:\"}\n      </p>\n    </div>\n  );\n}` ,
          },
        },
      },
      resources: [
        { labelEn: "Official Docs", labelBn: "অফিসিয়াল ডকস", url: "https://docs.github.com/en/get-started/learning-to-code/getting-started-with-git" },
        { labelEn: "FreeCodeCamp Guide", labelBn: "ফ্রিকোডক্যাম্প গাইড", url: "https://www.freecodecamp.org/news/learn-the-basics-of-git-in-under-10-minutes-da548267cc91/" },
        { labelEn: "Top YouTube Tutorial", labelBn: "ইউটিউব টিউটোরিয়াল", url: "https://www.youtube.com/watch?v=RGOj5yH7evk" },
      ],
    },
  },
  "fe-m2": {
    "fe-2-1": legacyLesson(
      "Zustand & Client State Mastery",
      "Zustand ও ক্লায়েন্ট স্টেট মাস্টারি",
      `# Client State Architecture
When your app grows, passing data between components manually (prop drilling) becomes a nightmare. Imagine a massive hotel where every room needs to know the wifi password, but the manager has to manually walk to every single room to tell them.

**Zustand** (or Redux) creates a giant P.A. System (Global Store). Any room (component) can simply listen to the P.A. system to get the wifi password immediately!

### Why Zustand over Redux?
Zustand is minimal, fast, and does not require complex boilerplate code. It hooks directly into React with no friction.`,
      `# ক্লায়েন্ট স্টেট আর্কিটেকচার
আপনার অ্যাপটি যখন বড় হতে থাকে, তখন একটি কম্পোনেন্ট থেকে অন্যটিতে ম্যানুয়ালভাবে ডেটা পাঠানো (Prop drilling) একটি দুঃস্বপ্ন হয়ে দাঁড়ায়। বিশাল একটি হোটেলের কথা ভাবুন যেখানে প্রত্যেকটি রুমে ওয়াইফাই পাসওয়ার্ড পৌঁছাতে ম্যানেজারকে প্রতিটি রুম হেঁটে যেতে হয়।

**Zustand** (অথবা Redux) একটি বিশাল মাইক বা P.A. System (গ্লোবাল স্টোর) তৈরি করে। যেকোনো রুম (কম্পোনেন্ট) শুধুমাত্র সেই মাইক থেকে শুনলেই পাসওয়ার্ড পেয়ে যায়! 

### Redux এর বদলে Zustand কেন?
Zustand খুবই ছোট, দ্রুত কাজ করে এবং এতে কঠিন বয়লারপ্লেট কোড লিখতে হয় না। এটি রিয়েক্টের সাথে খুব সহজেই মিশে যায়।`,
      generateSandpack(`import React, { useState } from "react";

// Imagine this is our Zustand Global Store
function createStore(initial) {
  let value = initial;
  const listeners = new Set();
  return {
    getState: () => value,
    setState: (newVal) => { value = newVal; listeners.forEach(l => l(value)); },
    subscribe: (listener) => { listeners.add(listener); return () => listeners.delete(listener); }
  };
}
const globalStore = createStore(0);

export default function App() {
  const [val, setVal] = useState(globalStore.getState());
  globalStore.subscribe(setVal);

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h2>Global P.A. System (Zustand Concept)</h2>
      <button onClick={() => globalStore.setState(val + 1)}>Announce to all rooms: +1</button>
      <div style={{ marginTop: 20, display: "flex", gap: 20 }}>
        <div style={{ padding: 20, border: "2px solid red" }}>Room A hears: {val}</div>
        <div style={{ padding: 20, border: "2px solid blue" }}>Room B hears: {val}</div>
      </div>
    </div>
  );
}`)
    ),
    "fe-2-2": legacyLesson(
      "TanStack Query (React Query)",
      "TanStack Query (রিয়্যাক্ট কুয়েরি)",
      `# Server State vs Client State
The biggest mistake beginners make is putting API server data into their Client Store (like Zustand). 
Server data is volatile (it can change at any time by another user in the world). 

**TanStack Query** acts as a smart cache. It fetches the data, stores it temporarily, and gives it to your app. If the user navigates away and comes back, it instantly shows the cached data while secretly fetching in the background to see if there are fresh updates!

### Zero-to-Hero Check:
- **isLoading:** True if it's the very first time fetching.
- **isFetching:** True if it's silently updating in the background while showing stale cached data.`,
      `# সার্ভার স্টেট বনাম ক্লায়েন্ট স্টেট 
নতুনদের সবচেয়ে বড় ভুল হলো অ্যাপিআই সার্ভারের ডেটাকে ক্লায়েন্ট স্টোরে (যেমন Zustand) রেখে দেওয়া।
সার্ভার ডেটা অত্যন্ত পরিবর্তনশীল (দুনিয়ার অন্য কোনো প্রান্তে থাকা ইউজার তা পরিবর্তন করে ফেলতে পারে)।

**TanStack Query** একটি স্মার্ট ক্যাশ (cache) হিসাবে কাজ করে। এটি ডেটা ফেস করে, সাময়িকভাবে জমা রাখে এবং আপনার অ্যাপকে দেয়। যদি ইউজার অন্য কোনো পেজে গিয়ে আবার ফিরে আসে, এটি তাৎক্ষণিকভাবে ক্যাশে থাকা পুরানো ডেটা দেখায় এবং ব্যাকগ্রাউন্ডে চুপিসারে চেক করে নতুন কোনো আপডেট এসেছে কিনা!

### জিরো-টু-হিরো চেক:
- **isLoading:** যখন জীবনে প্রথমবারের মতো ডেটা ফেস করা হচ্ছে।
- **isFetching:** যখন পুরানো ডেটা দেখানো হচ্ছে কিন্তু ব্যাকগ্রাউন্ডে নতুন ডেটা খোঁজা হচ্ছে।`,
      generateSandpack(`import React, { useState, useEffect } from "react";
export default function App() {
  const [cachedTime, setCachedTime] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = () => {
    setIsFetching(true);
    setTimeout(() => {
      setCachedTime(new Date().toLocaleTimeString());
      setIsFetching(false);
    }, 1500); // 1.5 seconds network delay
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h2>TanStack Query Simulation</h2>
      <button onClick={fetchData} disabled={isFetching}>
        {isFetching ? "Refetching in background..." : "Trigger Refetch"}
      </button>
      <div style={{ marginTop: 20, padding: 20, background: "#f0fdf4", borderRadius: 8 }}>
        <h3>Stale Cached Data:</h3>
        <p>{cachedTime ? cachedTime : "No data yet (isLoading)"}</p>
        {isFetching && <p style={{ color: "gray", fontSize: 12 }}>Silent wheel spinning...</p>}
      </div>
    </div>
  );
}`)
    ),
    "fe-2-3": legacyLesson(
      "React Hook Form & Zod Validation",
      "হুক ফর্ম এবং Zod ভ্যালিডেশন",
      `# Flawless Forms with Zero Tears
Writing forms from scratch in React is tedious. You have to handle \`onChange\`, validation, error messages, and submission states.

We combine two superpowers:
1. **React Hook Form:** To magically track all inputs efficiently without re-rendering the entire page on every keystroke.
2. **Zod:** A schema guard. You define exactly what the form data should look like (e.g., "Email must have an @ symbol"), and Zod blocks the submission if it fails!

This pairing prevents broken data from ever reaching your beautiful backend API.`,
      `# ঝামেলাহীন নিখুঁত ফর্ম তৈরি
রিয়্যাক্টে একেবারে শূন্য থেকে ফর্ম তৈরি করা খুবই বিরক্তিকর কাজ। আপনাকে \`onChange\`, ভ্যালিডেশন, এরর মেসেজ এবং সাবমিট স্টেট ম্যানেজ করতে হয়।

আমরা দুটো সুপারপাওয়ার একসাথে ব্যবহার করি:
1. **React Hook Form:** এটি জাদুর মতো প্রতিটি ইনপুট ট্র্যাক করে, এবং কিবোর্ডের প্রতিটি ক্লিকে পুরো পেজ পুনরায় রেন্ডার হওয়া প্রতিরোধ করে। 
2. **Zod:** এটি একটি স্কিমা গার্ড (পাহারাদার)। আপনি ঠিক করে দেন ফর্মের ডেটা কেমন হবে (যেমন, "ইমেলে অবশ্যই @ থাকতে হবে"), শর্ত না মানলে Zod তা ব্লক করে দেয়!

ব্যাকএন্ডে কোনো ভুল ডেটা যেন প্রবেশ না করে, এর জন্য এটিই হলো সেরা উপায়।`,
      generateSandpack(`import React, { useState } from "react";
export default function App() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Simulated Zod schema validation
  const errors = [];
  if (!email.includes("@")) errors.push("Missing '@' symbol");
  if (email.length < 5) errors.push("Too short!");

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h2>Magic Validation (Zod Simulation)</h2>
      <input 
        value={email}
        onChange={e => { setEmail(e.target.value); setSubmitted(false); }}
        placeholder="Enter email"
        style={{ padding: 10, borderRadius: 5, border: "1px solid gray" }}
      />
      <button onClick={() => setSubmitted(true)} style={{ marginLeft: 10, padding: 10 }}>Submit</button>

      {submitted && errors.length > 0 && (
        <ul style={{ color: "red" }}>
          {errors.map((err, i) => <li key={i}>{err}</li>)}
        </ul>
      )}
      {submitted && errors.length === 0 && <p style={{ color: "green" }}>Perfect submission!</p>}
    </div>
  );
}`),
      [
        { labelEn: "Zustand Github", labelBn: "জুস্ট্যান্ড গিটহাব ডকস", url: "https://github.com/pmndrs/zustand" },
        { labelEn: "TanStack Query", labelBn: "ট্যানস্ট্যাক কোয়েরি", url: "https://tanstack.com/query/latest" },
        { labelEn: "React Hook Form", labelBn: "রিঅ্যাক্ট হুক ফর্ম", url: "https://react-hook-form.com/" },
        { labelEn: "Web Dev Simplified (YouTube)", labelBn: "ওয়েব ডেভ সিম্পলিফাইড", url: "https://www.youtube.com/c/WebDevSimplified" }
      ]
    )
  },
  "fe-m3": {
    "fe-3-1": legacyLesson("Tailwind & Tokens", "Tailwind ও টোকেন", "Focus on Utility Classes", "ইউটিলিটি ক্লাস ফোকাস", generateSandpack(`export default function() { return <div>Setup</div>; }`)),
    "fe-3-2": legacyLesson("CSS Grid & Layout", "সিএসএস গ্রিড ও লেআউট", "Flexbox vs Grid", "ফ্লেক্সবক্স বনাম গ্রিড", generateSandpack(`export default function() { return <div>Setup</div>; }`)),
    "fe-3-3": legacyLesson("Shadcn UI & Radix", "Shadcn UI এবং রাডিক্স", "Accessible components", "এক্সেসিবল কম্পোনেন্ট", generateSandpack(`export default function() { return <div>Setup</div>; }`), [
      { labelEn: "Shadcn docs", labelBn: "Shadcn ডকস", url: "https://ui.shadcn.com" }
    ])
  },
  "fe-m4": {
    "fe-4-1": legacyLesson("Suspense & Streaming", "সাসপেন্স ও স্ট্রিমিং", "Progressive SSR", "প্রোগ্রেসিভ SSR", generateSandpack(`export default function() { return <div>Setup</div>; }`)),
    "fe-4-2": legacyLesson("Image & Font Opt", "ইমেজ ও ফন্ট অপটিমাইজেশন", "Next/Image usage", "নেক্সট ইমেজ ব্যবহার", generateSandpack(`export default function() { return <div>Setup</div>; }`)),
    "fe-4-3": legacyLesson("Web Vitals & CLS", "ওয়েব ভাইটালস ও সিএলএস", "Core Web Vitals", "কোর ওয়েব ভাইটালস", generateSandpack(`export default function() { return <div>Setup</div>; }`), [
      { labelEn: "Web Vitals", labelBn: "ওয়েব ভাইটালস", url: "https://web.dev/vitals/" }
    ])
  },
  "fe-m5": {
    "fe-5-1": legacyLesson("Jest Unit Testing", "জেস্ট ইউনিট টেস্টিং", "Mocking and Asserting", "মকিং এবং অ্যাসার্টিং", generateSandpack(`export default function() { return <div>Setup</div>; }`)),
    "fe-5-2": legacyLesson("Playwright E2E", "প্লেরাইট E2E", "Browser automation", "ব্রাউজার অটোমেশন", generateSandpack(`export default function() { return <div>Setup</div>; }`)),
    "fe-5-3": legacyLesson("CI/CD Pipeline", "CI/CD পাইপলাইন", "GitHub Actions YAML", "গিটহাব একশন YAML", generateSandpack(`export default function() { return <div>Setup</div>; }`), [
      { labelEn: "Playwright Docs", labelBn: "প্লেরাইট ডকস", url: "https://playwright.dev" }
    ])
  },
  "fe-m6": {
    "fe-6-1": legacyLesson("i18n Localization", "i18n লোকালাইজেশন", "Translating tokens", "টোকেন অনুবাদ", generateSandpack(`export default function() { return <div>Setup</div>; }`)),
    "fe-6-2": legacyLesson("Accessibility (a11y)", "এক্সেসিবিলিটি (a11y)", "Aria tags and screen readers", "Aria ট্যাগ ও স্ক্রিন রিডার", generateSandpack(`export default function() { return <div>Setup</div>; }`)),
    "fe-6-3": legacyLesson("Sentry & Error Tracking", "Sentry ও এরর ট্র্যাকিং", "Catching exceptions in Prod", "প্রোডাকশনে এরর ধরা", generateSandpack(`export default function() { return <div>Setup</div>; }`), [
      { labelEn: "Sentry", labelBn: "সেন্ট্রি ডকস", url: "https://sentry.io" }
    ])
  }
};

LEGACY_FRONTEND_COURSES["fe-m1"] = FRONTEND_MONTH_ONE;
LEGACY_FRONTEND_COURSES["fe-m2"] = FRONTEND_MONTH_TWO;
LEGACY_FRONTEND_COURSES["fe-m3"] = FRONTEND_MONTH_THREE;
LEGACY_FRONTEND_COURSES["fe-m4"] = FRONTEND_MONTH_FOUR;
LEGACY_FRONTEND_COURSES["fe-m5"] = FRONTEND_MONTH_FIVE;
LEGACY_FRONTEND_COURSES["fe-m6"] = FRONTEND_MONTH_SIX;

export const FRONTEND_COURSES = mergeGeneratedPath("se-frontend", LEGACY_FRONTEND_COURSES);
