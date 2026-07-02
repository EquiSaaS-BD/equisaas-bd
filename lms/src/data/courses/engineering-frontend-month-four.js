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

const suspenseResources = [
  { labelEn: "React Suspense Docs", labelBn: "React Suspense ডকস", url: "https://react.dev/reference/react/Suspense" },
  { labelEn: "Next.js Loading UI", labelBn: "Next.js loading UI ডকস", url: "https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming" },
  { labelEn: "Streaming SSR Guide", labelBn: "Streaming SSR গাইড", url: "https://react.dev/reference/react-dom/server/renderToPipeableStream" },
];

const splittingResources = [
  { labelEn: "Vite Code Splitting", labelBn: "Vite code splitting গাইড", url: "https://vite.dev/guide/build.html" },
  { labelEn: "Web.dev Image Optimization", labelBn: "Web.dev image optimization", url: "https://web.dev/learn/performance/image-performance" },
  { labelEn: "Lazy Loading Guide", labelBn: "Lazy loading গাইড", url: "https://web.dev/articles/browser-level-image-lazy-loading" },
];

const vitalsResources = [
  { labelEn: "Core Web Vitals", labelBn: "Core Web Vitals", url: "https://web.dev/vitals/" },
  { labelEn: "Web Vitals Library", labelBn: "Web Vitals library", url: "https://github.com/GoogleChrome/web-vitals" },
  { labelEn: "Bundle Optimization Guide", labelBn: "Bundle optimization গাইড", url: "https://web.dev/articles/reduce-javascript-payloads-with-code-splitting" },
];

export const FRONTEND_MONTH_FOUR = {};

Object.assign(FRONTEND_MONTH_FOUR, {
  "fe-4-1": academicLesson({
    titleEn: "Suspense & Streaming Strategies",
    titleBn: "Suspense ও স্ট্রিমিং কৌশল",
    introEn: [
      "Performance is not only about raw speed. It is also about what the user feels while the system is still working.",
      "A slow page becomes much more tolerable when the user sees meaningful progress instead of a blank screen. That is where Suspense and streaming strategies matter.",
      "This lecture teaches how to break loading into smaller user-friendly moments so the product feels alive, predictable, and calm.",
    ],
    introBn: [
      "Performance শুধু raw speed না। system এখনো কাজ করছে, সেই সময় user কী অনুভব করছে, সেটাও performance-এর অংশ।",
      "ধীর page-ও অনেক বেশি tolerable লাগে যখন user blank screen না দেখে meaningful progress দেখে। সেখানেই Suspense আর streaming strategy গুরুত্বপূর্ণ।",
      "এই lecture শেখাবে loading-কে কীভাবে ছোট ছোট user-friendly moment-এ ভাঙা যায়, যাতে product alive, predictable, আর calm লাগে।",
    ],
    learnEn: [
      "What Suspense does in real UI loading flows",
      "How streaming changes perceived performance",
      "How to design loading states that match the real shape of the page",
      "How to avoid full-page blockers when only one section is slow",
    ],
    learnBn: [
      "real UI loading flow-তে Suspense কী কাজ করে",
      "streaming perceived performance কীভাবে বদলায়",
      "page-এর আসল shape অনুযায়ী loading state কীভাবে design করতে হয়",
      "একটি section slow হলে full-page blocker এড়ানোর উপায়",
    ],
    whatEn: [
      "Suspense lets us define fallback UI while a slower child part is still preparing. Instead of freezing the whole screen, we can keep the stable parts visible and show placeholders only where needed.",
      "Streaming means the server can send useful pieces earlier instead of waiting for the whole page to be ready. That makes the product feel faster because the user sees progress sooner.",
      "Together, Suspense and streaming shift performance work from all-or-nothing loading toward progressive reveal.",
    ],
    whatBn: [
      "Suspense আমাদের fallback UI define করতে দেয় যখন slower child part এখনো ready হচ্ছে। পুরো screen freeze না করে stable অংশ visible রাখা যায়, আর শুধু দরকারি জায়গায় placeholder দেখানো যায়।",
      "Streaming মানে server পুরো page ready হওয়ার অপেক্ষা না করে useful অংশ আগে পাঠাতে পারে। ফলে user দ্রুত progress দেখতে পায় আর product fast লাগে।",
      "Suspense আর streaming একসাথে performance-কে all-or-nothing loading থেকে progressive reveal-এ নিয়ে আসে।",
    ],
    whyEn: [
      "Blank screens create anxiety. Users do not know whether the app is broken, slow, or simply waiting. Good loading states build trust even before data arrives.",
      "EquiSaaS has lesson content, dashboards, task feeds, and reports with mixed data costs. We should not punish the whole screen because one data source is slow.",
    ],
    whyBn: [
      "Blank screen anxiety তৈরি করে। user বুঝতে পারে না app broken, slow, নাকি শুধু wait করছে। ভালো loading state data আসার আগেই trust তৈরি করে।",
      "EquiSaaS-এ lesson content, dashboard, task feed, আর report আছে যেগুলোর data cost একরকম না। একটি data source slow বলে পুরো screen-কে punish করা উচিত না।",
    ],
    thinkEn: [
      "Think of a restaurant. Good service does not make you wait at the door until every dish is ready. It brings water, menus, and early items first so the experience feels active.",
    ],
    thinkBn: [
      "একটি restaurant ভাবুন। ভালো service আপনাকে door-এ দাঁড় করিয়ে রাখে না যতক্ষণ না সব dish ready হয়। আগে water, menu, আর early item দেয়, যাতে experience active লাগে।",
    ],
    stepsEn: [
      "Identify which parts of the page can appear immediately and which parts depend on slower data.",
      "Wrap slower sections in Suspense boundaries with clear fallback UI.",
      "Make fallbacks match the final shape so the page does not jump awkwardly.",
      "Prefer section-level loading over full-screen loading when possible.",
      "Review whether the user can start understanding the page before every dataset finishes.",
    ],
    stepsBn: [
      "page-এর কোন অংশ সাথে সাথে দেখা যাবে আর কোন অংশ slower data-এর ওপর depend করে তা identify করুন।",
      "Slower section-কে clear fallback UI-সহ Suspense boundary-তে রাখুন।",
      "Fallback-কে final shape-এর মতো রাখুন, যাতে page awkwardly jump না করে।",
      "সম্ভব হলে full-screen loading-এর বদলে section-level loading ব্যবহার করুন।",
      "Review করুন সব dataset শেষ হওয়ার আগেই user page বুঝতে শুরু করতে পারছে কি না।",
    ],
    conceptsEn: [
      "**Suspense boundary** isolates slower UI sections.",
      "**Fallback** is the temporary visible state during waiting.",
      "**Streaming** sends useful output earlier instead of all at once.",
      "**Perceived performance** is what the user experiences, not only the total time.",
      "**Progressive reveal** keeps the interface useful sooner.",
    ],
    conceptsBn: [
      "**Suspense boundary** slower UI section আলাদা করে।",
      "**Fallback** wait করার সময় temporary visible state।",
      "**Streaming** সব একসাথে না দিয়ে useful output আগে পাঠায়।",
      "**Perceived performance** হলো user কী অনুভব করছে, শুধু total time না।",
      "**Progressive reveal** interface-কে দ্রুত useful করে তোলে।",
    ],
    whenEn: [
      "When one page mixes cheap and expensive data sources",
      "When sections can render independently",
      "When blank screens hurt trust",
      "When dashboards or reports should reveal progress gradually",
    ],
    whenBn: [
      "যখন এক page-এ cheap আর expensive data source মিশে থাকে",
      "যখন section-গুলো independently render হতে পারে",
      "যখন blank screen trust কমায়",
      "যখন dashboard বা report gradualভাবে reveal হওয়া উচিত",
    ],
    exampleEn: [
      "A learner dashboard might show the header and quick actions immediately, while progress charts and task analytics load inside separate Suspense boundaries. The learner can already navigate before every chart is ready.",
    ],
    exampleBn: [
      "Learner dashboard-এ header আর quick action সাথে সাথে দেখা যেতে পারে, আর progress chart আর task analytics আলাদা Suspense boundary-তে load হতে পারে। সব chart ready হওয়ার আগেই learner navigate করতে পারে।",
    ],
    mistakesEn: [
      "Using one giant fallback for the whole screen",
      "Showing placeholders that do not match the final layout",
      "Wrapping everything in Suspense without clear loading intent",
      "Treating loading UI as decoration instead of communication",
    ],
    mistakesBn: [
      "পুরো screen-এর জন্য এক giant fallback ব্যবহার করা",
      "final layout-এর সাথে না মেলা placeholder দেখানো",
      "clear loading intent ছাড়া সবকিছু Suspense-এ wrap করা",
      "loading UI-কে communication না ভেবে decoration মনে করা",
    ],
    applyEn: [
      "Audit one current screen and mark which sections can render early",
      "Design one skeleton that mirrors the real content shape",
      "Separate static shell from slower widgets",
      "Ask whether the user can still understand the page while some parts are loading",
    ],
    applyBn: [
      "একটি current screen audit করে mark করুন কোন section আগে render হতে পারে",
      "real content shape mirror করে এমন একটি skeleton design করুন",
      "static shell আর slower widget আলাদা করুন",
      "কিছু অংশ load হলেও user page বুঝতে পারছে কি না তা জিজ্ঞেস করুন",
    ],
    assignmentEn: [
      "Redesign one dashboard or lesson page with two Suspense boundaries and two distinct fallbacks",
      "Show which part renders first and which part streams in later",
      "Submit code or a layout diagram plus a note explaining your boundary decisions",
      "Evaluation focus: user clarity, progressive reveal, fallback quality, and reasoning",
    ],
    assignmentBn: [
      "দুটি Suspense boundary আর দুটি আলাদা fallback দিয়ে একটি dashboard বা lesson page redesign করুন",
      "কোন অংশ আগে render হবে আর কোন অংশ পরে stream হবে তা দেখান",
      "Code বা layout diagram submit করুন, সাথে boundary decision explain করুন",
      "Evaluation focus: user clarity, progressive reveal, fallback quality, আর reasoning",
    ],
    quickCheckEn: [
      "Can you explain why perceived performance matters even if total load time stays the same?",
      "Can you identify one place where section-level fallback is better than full-screen loading?",
      "Can you describe what makes a good skeleton?",
      "Can you explain why streaming improves trust?",
    ],
    quickCheckBn: [
      "total load time একই থাকলেও perceived performance কেন জরুরি তা explain করতে পারবেন?",
      "কোথায় section-level fallback full-screen loading-এর চেয়ে ভালো তা identify করতে পারবেন?",
      "ভালো skeleton কেমন হওয়া উচিত তা describe করতে পারবেন?",
      "streaming trust কেন improve করে তা explain করতে পারবেন?",
    ],
    summaryEn: [
      "Suspense turns waiting into a controlled UX state",
      "Streaming lets useful content arrive earlier",
      "Section-level loading is usually calmer than whole-page blocking",
      "Performance work includes how the app feels while it is still loading",
    ],
    summaryBn: [
      "Suspense waiting-কে controlled UX state-এ রূপ দেয়",
      "Streaming useful content-কে আগে পৌঁছাতে দেয়",
      "Section-level loading সাধারণত whole-page blocking-এর চেয়ে calmer",
      "Performance work-এর অংশ হলো app load হওয়ার সময় কেমন লাগে",
    ],
    sandpack: makeSandpack(`import React, { useState } from "react";

function SlowPanel() {
  return (
    <div style={{ padding: 16, borderRadius: 16, background: "#ffffff" }}>
      <h3>Analytics Panel</h3>
      <p>This area represents slower data that can load after the shell is visible.</p>
    </div>
  );
}

export default function App() {
  const [showPanel, setShowPanel] = useState(false);

  return (
    <div style={{ fontFamily: "sans-serif", padding: 20, background: "#eff6ff" }}>
      <h2>Suspense Mental Model</h2>
      <div style={{ padding: 16, borderRadius: 16, background: "#ffffff", marginBottom: 16 }}>
        <h3>Dashboard Shell</h3>
        <p>This part appears first so the page never feels blank.</p>
        <button onClick={() => setShowPanel((prev) => !prev)} style={{ padding: "10px 14px", borderRadius: 10 }}>
          {showPanel ? "Hide analytics area" : "Reveal analytics area"}
        </button>
      </div>
      {showPanel ? (
        <SlowPanel />
      ) : (
        <div style={{ padding: 16, borderRadius: 16, background: "#dbeafe", color: "#1d4ed8" }}>
          Fallback: analytics skeleton while the slower section is still preparing.
        </div>
      )}
    </div>
  );
}`),
    resources: suspenseResources,
  }),
  "fe-4-2": academicLesson({
    titleEn: "Code Splitting & Image Optimization",
    titleBn: "কোড স্প্লিটিং ও ইমেজ অপটিমাইজেশন",
    introEn: [
      "A fast frontend is usually not one huge bundle that arrives all at once. It is a sequence of smart deliveries.",
      "Code splitting and image optimization both solve the same user problem: do not force the browser to download heavy things before they are needed.",
      "This lecture teaches how to keep public routes lightweight, lazy-load heavy features, and treat images as performance assets rather than decoration only.",
    ],
    introBn: [
      "দ্রুত frontend সাধারণত একসাথে এসে পড়া এক বিশাল bundle না। এটি smart delivery-এর sequence।",
      "Code splitting আর image optimization একই user problem solve করে: browser-কে heavy জিনিস তার দরকার হওয়ার আগে download করতে বাধ্য করবেন না।",
      "এই lecture শেখাবে public route-কে lightweight রাখা, heavy feature lazy-load করা, আর image-কে শুধু decoration না ভেবে performance asset হিসেবে দেখা।",
    ],
    learnEn: [
      "Why route-based and feature-based code splitting matter",
      "How lazy loading reduces initial cost",
      "How image size, format, and dimensions affect performance",
      "How to protect public routes from admin-only or editor-heavy code",
    ],
    learnBn: [
      "route-based আর feature-based code splitting কেন জরুরি",
      "lazy loading initial cost কীভাবে কমায়",
      "image size, format, আর dimension performance-কে কীভাবে প্রভাবিত করে",
      "public route-কে admin-only বা editor-heavy code থেকে কীভাবে বাঁচাতে হয়",
    ],
    whatEn: [
      "Code splitting breaks JavaScript into smaller chunks so the browser downloads only what is needed now. Lazy loading delays heavy code until the user reaches the feature that actually needs it.",
      "Image optimization reduces transfer size and layout instability by choosing the right size, format, compression level, and reserved dimensions.",
      "Together, these techniques reduce first-load cost and make navigation feel lighter on low-bandwidth networks.",
    ],
    whatBn: [
      "Code splitting JavaScript-কে ছোট chunk-এ ভাঙে, যাতে browser এখন যা দরকার শুধু সেটাই download করে। Lazy loading heavy code-কে delay করে যতক্ষণ না user সেই feature-এ যায়।",
      "Image optimization সঠিক size, format, compression, আর reserved dimension ব্যবহার করে transfer size আর layout instability কমায়।",
      "এই technique-গুলো একসাথে first-load cost কমায় আর low-bandwidth network-এ navigation-কে lighter করে।",
    ],
    whyEn: [
      "If a public route downloads admin charts, sandpack editors, and large media before the user even opens them, performance is being wasted.",
      "EquiSaaS serves both public visitors and authenticated members. The public experience must stay lightweight while heavier learning tools load only when genuinely needed.",
    ],
    whyBn: [
      "Public route যদি admin chart, sandpack editor, আর large media user না খুললেও download করে, তাহলে performance নষ্ট হচ্ছে।",
      "EquiSaaS public visitor আর authenticated member - দুই ধরনের user serve করে। public experience lightweight থাকতে হবে, আর heavier learning tool শুধু দরকার হলে load হবে।",
    ],
    thinkEn: [
      "Think of delivery trucks. Good logistics do not send every warehouse item to the customer’s door on day one. They send the essentials first, then deliver special items only when requested.",
    ],
    thinkBn: [
      "Delivery truck ভাবুন। ভালো logistics day one-এ warehouse-এর সব item customer-এর door-এ পাঠায় না। আগে essentials পাঠায়, special item পরে request এলে দেয়।",
    ],
    stepsEn: [
      "Identify what the user needs on first paint versus what can wait.",
      "Split routes and heavy features into lazy-loaded chunks.",
      "Keep editors, analytics, and advanced admin tools off public bundles.",
      "Serve images close to their rendered size instead of oversized assets.",
      "Reserve width and height so layout does not jump when images load.",
      "Review chunk boundaries after adding a new heavy dependency.",
    ],
    stepsBn: [
      "first paint-এ user কী দরকার আর কী wait করতে পারে তা identify করুন।",
      "route আর heavy feature-কে lazy-loaded chunk-এ split করুন।",
      "editor, analytics, আর advanced admin tool-কে public bundle থেকে দূরে রাখুন।",
      "Rendered size-এর কাছাকাছি image serve করুন, oversized asset না।",
      "Image load হওয়ার সময় layout jump ঠেকাতে width আর height reserve করুন।",
      "নতুন heavy dependency যোগ করার পর chunk boundary review করুন।",
    ],
    conceptsEn: [
      "**Initial bundle** is what blocks the first useful load.",
      "**Lazy chunk** loads later when needed.",
      "**Route-based splitting** follows navigation boundaries.",
      "**Feature-based splitting** isolates expensive tools within a route.",
      "**Image sizing** affects bytes, layout stability, and speed.",
    ],
    conceptsBn: [
      "**Initial bundle** first useful load-কে block করে এমন code।",
      "**Lazy chunk** দরকার হলে পরে load হয়।",
      "**Route-based splitting** navigation boundary follow করে।",
      "**Feature-based splitting** route-এর ভেতর expensive tool আলাদা করে।",
      "**Image sizing** byte, layout stability, আর speed-কে প্রভাবিত করে।",
    ],
    whenEn: [
      "When some routes are much heavier than others",
      "When the app contains editors, analytics, or complex labs",
      "When public visitors should not pay for private admin code",
      "When large images slow down mobile performance",
    ],
    whenBn: [
      "যখন কিছু route অন্যগুলোর চেয়ে অনেক heavy",
      "যখন app-এ editor, analytics, বা complex lab আছে",
      "যখন public visitor-কে private admin code-এর cost দিতে উচিত না",
      "যখন large image mobile performance ধীর করে",
    ],
    exampleEn: [
      "A course list route can stay small while the practice lab, analytics dashboard, and certificate generator each load in separate chunks only after the user opens them.",
    ],
    exampleBn: [
      "Course list route ছোট থাকতে পারে, আর practice lab, analytics dashboard, আর certificate generator user খুললে তবেই আলাদা chunk-এ load হতে পারে।",
    ],
    mistakesEn: [
      "Lazy-loading nothing and shipping one giant bundle",
      "Splitting too late, after the damage is already visible",
      "Serving hero images far larger than the screen needs",
      "Forgetting that code splitting must still preserve understandable boundaries",
    ],
    mistakesBn: [
      "কিছুই lazy-load না করে এক giant bundle ship করা",
      "damage visible হওয়ার পর splitting করা",
      "screen-এর দরকারের চেয়ে অনেক বড় hero image serve করা",
      "code splitting করলেও boundary understandable থাকা দরকার - এটা ভুলে যাওয়া",
    ],
    applyEn: [
      "Map your routes into light, medium, and heavy categories",
      "Write down which heavy features can move behind lazy boundaries",
      "Inspect one image-heavy page and list oversize assets",
      "Explain every new dependency in terms of first-load cost",
    ],
    applyBn: [
      "route-গুলোকে light, medium, আর heavy category-তে map করুন",
      "কোন heavy feature lazy boundary-র পেছনে যেতে পারে তা লিখুন",
      "একটি image-heavy page inspect করে oversize asset list করুন",
      "প্রতিটি নতুন dependency-কে first-load cost-এর ভাষায় explain করুন",
    ],
    assignmentEn: [
      "Create a performance plan for one public page and one authenticated dashboard page",
      "Mark which parts stay in the initial bundle and which parts become lazy",
      "Optimize one image area by documenting size, format, and reserved dimensions",
      "Submit code, diagram, or screenshot plus a note explaining the splitting strategy",
      "Evaluation focus: initial-load thinking, chunk clarity, image discipline, and reasoning",
    ],
    assignmentBn: [
      "একটি public page আর একটি authenticated dashboard page-এর performance plan বানান",
      "কোন অংশ initial bundle-এ থাকবে আর কোন অংশ lazy হবে তা mark করুন",
      "একটি image area size, format, আর reserved dimension লিখে optimize করুন",
      "Code, diagram, বা screenshot submit করুন, সাথে splitting strategy explain করুন",
      "Evaluation focus: initial-load thinking, chunk clarity, image discipline, আর reasoning",
    ],
    quickCheckEn: [
      "Can you explain why not every feature should be in the first bundle?",
      "Can you identify one heavy feature that should be lazy-loaded?",
      "Can you describe why image dimensions matter for UX?",
      "Can you say why public and admin routes should not carry the same cost?",
    ],
    quickCheckBn: [
      "সব feature first bundle-এ থাকা উচিত না কেন তা explain করতে পারবেন?",
      "একটি heavy feature identify করতে পারবেন যেটা lazy-load হওয়া উচিত?",
      "image dimension UX-এর জন্য কেন গুরুত্বপূর্ণ তা describe করতে পারবেন?",
      "public আর admin route একই cost বহন করা উচিত না কেন তা বলতে পারবেন?",
    ],
    summaryEn: [
      "Code splitting reduces first-load cost by delaying what is not needed yet",
      "Image optimization cuts transfer cost and prevents layout shift",
      "Public routes should stay light while heavy features load on demand",
      "Performance depends on delivery strategy, not only on code correctness",
    ],
    summaryBn: [
      "Code splitting অপ্রয়োজনীয় জিনিস delay করে first-load cost কমায়",
      "Image optimization transfer cost কমায় আর layout shift ঠেকায়",
      "Public route light থাকবে, heavy feature on-demand load হবে",
      "Performance শুধু code correctness না; delivery strategy-র ওপরও নির্ভর করে",
    ],
    sandpack: makeSandpack(`import React, { useState } from "react";

export default function App() {
  const [showHeavyPanel, setShowHeavyPanel] = useState(false);

  return (
    <div style={{ fontFamily: "sans-serif", padding: 20 }}>
      <h2>Code Splitting Mental Model</h2>
      <div style={{ padding: 16, background: "#f8fafc", borderRadius: 16, marginBottom: 16 }}>
        <p><strong>Initial bundle:</strong> header, summary, and main action</p>
        <button onClick={() => setShowHeavyPanel((prev) => !prev)} style={{ padding: "10px 14px", borderRadius: 10 }}>
          {showHeavyPanel ? "Hide heavy feature" : "Lazy-load heavy feature"}
        </button>
      </div>
      {showHeavyPanel && (
        <div style={{ padding: 16, background: "#dbeafe", borderRadius: 16 }}>
          Heavy analytics/editor area loaded only after the user requested it.
        </div>
      )}
    </div>
  );
}`),
    resources: splittingResources,
  }),
  "fe-4-3": academicLesson({
    titleEn: "Web Vitals Budget & Bundle Tuning",
    titleBn: "Web Vitals বাজেট ও বান্ডেল টিউনিং",
    introEn: [
      "A professional frontend engineer does not say only 'the page feels fast'. They also know how to measure, budget, and defend that speed over time.",
      "Web Vitals give us a language for user experience: loading, interactivity, and visual stability. A budget gives the team a performance limit before the experience quietly degrades.",
      "This lecture teaches how to connect bundle size, loading behavior, and metrics into one performance discipline.",
    ],
    introBn: [
      "Professional frontend engineer শুধু বলে না 'page fast লাগে'। সে জানে এই speed কীভাবে measure, budget, আর over time defend করতে হয়।",
      "Web Vitals আমাদের user experience-এর language দেয়: loading, interactivity, আর visual stability। Budget team-কে limit দেয়, যাতে experience চুপচাপ degrade না হয়।",
      "এই lecture শেখাবে bundle size, loading behavior, আর metric-কে এক performance discipline-এ কীভাবে জোড়া লাগে।",
    ],
    learnEn: [
      "What Core Web Vitals measure and why they matter",
      "How a performance budget protects UX over time",
      "How bundle growth affects interactivity and load performance",
      "How to review performance regressions before they reach users",
    ],
    learnBn: [
      "Core Web Vitals কী measure করে আর কেন জরুরি",
      "performance budget UX-কে over time কীভাবে protect করে",
      "bundle growth interactivity আর load performance-কে কীভাবে প্রভাবিত করে",
      "user-এর কাছে পৌঁছানোর আগে performance regression review করার উপায়",
    ],
    whatEn: [
      "Core Web Vitals are user-focused metrics that help teams talk about real experience instead of vague feelings. LCP focuses on major content loading, INP on responsiveness, and CLS on layout stability.",
      "A performance budget is a practical limit, such as maximum bundle size or target metric range, that keeps the team disciplined while shipping features.",
      "Bundle tuning is the act of inspecting what JavaScript and assets cost, then reducing waste through splitting, dependency control, and lighter delivery choices.",
    ],
    whatBn: [
      "Core Web Vitals হলো user-focused metric, যা vague feeling-এর বদলে real experience নিয়ে কথা বলতে সাহায্য করে। LCP বড় content load, INP responsiveness, আর CLS layout stability-কে focus করে।",
      "Performance budget হলো practical limit, যেমন maximum bundle size বা target metric range, যা feature ship করতে করতে team-কে disciplined রাখে।",
      "Bundle tuning মানে JavaScript আর asset-এর cost inspect করা, তারপর splitting, dependency control, আর lighter delivery choice দিয়ে waste কমানো।",
    ],
    whyEn: [
      "If performance is not measured, it slowly gets worse without anyone noticing. Each small dependency, chart, image, and feature adds cost until mobile users pay the price.",
      "EquiSaaS must stay usable on low-bandwidth connections. A budget helps the team make tradeoffs consciously instead of discovering problems only after deployment.",
    ],
    whyBn: [
      "Performance measure না করলে এটি ধীরে ধীরে খারাপ হয় কিন্তু কেউ টের পায় না। প্রতিটি ছোট dependency, chart, image, আর feature cost যোগ করে, আর mobile user শেষ পর্যন্ত সেই price দেয়।",
      "EquiSaaS low-bandwidth connection-এও usable থাকতে হবে। Budget team-কে conscious tradeoff করতে সাহায্য করে, deployment-এর পরে শুধু problem discover করতে নয়।",
    ],
    thinkEn: [
      "Think of a bridge weight limit. The bridge may not collapse the moment one extra truck enters, but if no limit exists, overload will eventually become dangerous. Performance budgets work the same way.",
    ],
    thinkBn: [
      "Bridge-এর weight limit ভাবুন। একটি extra truck এলেই bridge ভেঙে পড়ে না, কিন্তু limit না থাকলে overload একসময় dangerous হবে। Performance budget-ও একইভাবে কাজ করে।",
    ],
    stepsEn: [
      "Choose the metrics and bundle thresholds the product should protect.",
      "Measure the current state before making assumptions.",
      "Watch which routes, dependencies, and assets contribute most to cost.",
      "Tune the heaviest parts first instead of chasing tiny wins everywhere.",
      "Compare performance after each major feature or dependency change.",
      "Treat regressions as reviewable product risks, not only technical details.",
    ],
    stepsBn: [
      "product কোন metric আর bundle threshold protect করবে তা choose করুন।",
      "ধারণা করার আগে current state measure করুন।",
      "কোন route, dependency, আর asset সবচেয়ে বেশি cost যোগ করছে তা দেখুন।",
      "tiny win everywhere chase না করে আগে heaviest অংশ tune করুন।",
      "প্রতিটি বড় feature বা dependency change-এর পরে performance compare করুন।",
      "Regression-কে শুধু technical detail না, reviewable product risk হিসেবে দেখুন।",
    ],
    conceptsEn: [
      "**LCP** measures major content loading speed.",
      "**INP** reflects how responsive the page feels to interaction.",
      "**CLS** measures unexpected layout shift.",
      "**Performance budget** defines acceptable cost limits.",
      "**Bundle tuning** reduces JavaScript and asset waste.",
    ],
    conceptsBn: [
      "**LCP** বড় content loading speed measure করে।",
      "**INP** interaction-এ page কত responsive লাগে তা দেখায়।",
      "**CLS** unexpected layout shift measure করে।",
      "**Performance budget** acceptable cost limit define করে।",
      "**Bundle tuning** JavaScript আর asset waste কমায়।",
    ],
    whenEn: [
      "When a route feels slower after new features are added",
      "When the bundle keeps growing release after release",
      "When mobile users struggle more than desktop users",
      "When the team needs a shared performance target",
    ],
    whenBn: [
      "নতুন feature যোগ হওয়ার পর route ধীর লাগলে",
      "release-এর পর release bundle বাড়তেই থাকলে",
      "mobile user desktop user-এর চেয়ে বেশি struggle করলে",
      "team-এর shared performance target দরকার হলে",
    ],
    exampleEn: [
      "A public landing page might deserve a stricter budget than an internal admin report. Both should be optimized, but the public route has lower tolerance for heavy code because every visitor pays its cost immediately.",
    ],
    exampleBn: [
      "Public landing page internal admin report-এর চেয়ে stricter budget deserve করতে পারে। দুটোই optimize হবে, কিন্তু public route heavy code-এর ক্ষেত্রে কম tolerance রাখবে, কারণ প্রতিটি visitor সাথে সাথে তার cost দেয়।",
    ],
    mistakesEn: [
      "Talking about performance without measuring it",
      "Treating every route as if it deserves the same budget",
      "Adding dependencies without asking what they cost",
      "Optimizing tiny details while ignoring the heaviest bundle problems",
    ],
    mistakesBn: [
      "measure না করে performance নিয়ে কথা বলা",
      "প্রতিটি route-এর একই budget আছে ধরে নেওয়া",
      "dependency যোগ করে তার cost না জিজ্ঞেস করা",
      "heaviest bundle problem ignore করে tiny detail optimize করা",
    ],
    applyEn: [
      "Define one target budget for a public route and one for a logged-in route",
      "Inspect the heaviest chunk before choosing an optimization path",
      "Write a short review note whenever a new feature increases delivery cost",
      "Use metrics as decision tools, not as abstract dashboard numbers",
    ],
    applyBn: [
      "একটি public route আর একটি logged-in route-এর জন্য target budget define করুন",
      "optimization path choose করার আগে heaviest chunk inspect করুন",
      "নতুন feature delivery cost বাড়ালে short review note লিখুন",
      "metric-কে abstract dashboard number না ভেবে decision tool হিসেবে ব্যবহার করুন",
    ],
    assignmentEn: [
      "Create a mini performance budget for one public page and one learning route",
      "List a target bundle size, one vital to watch, and one likely regression risk",
      "Review one heavy route and propose two tuning actions",
      "Submit a short audit note plus screenshot or chart if available",
      "Evaluation focus: measurable thinking, prioritization, and practical action plan",
    ],
    assignmentBn: [
      "একটি public page আর একটি learning route-এর জন্য mini performance budget বানান",
      "target bundle size, watch করার জন্য একটি vital, আর একটি likely regression risk লিখুন",
      "একটি heavy route review করে দুইটি tuning action propose করুন",
      "short audit note submit করুন, screenshot বা chart থাকলে যোগ করুন",
      "Evaluation focus: measurable thinking, prioritization, আর practical action plan",
    ],
    quickCheckEn: [
      "Can you explain what LCP, INP, and CLS each describe?",
      "Can you explain why a budget is useful even before the app is very large?",
      "Can you identify one heavy route that deserves tighter control?",
      "Can you describe how bundle growth affects user experience?",
    ],
    quickCheckBn: [
      "LCP, INP, আর CLS প্রত্যেকটি কী describe করে তা explain করতে পারবেন?",
      "app খুব বড় হওয়ার আগেই budget useful কেন তা explain করতে পারবেন?",
      "একটি heavy route identify করতে পারবেন যেটার tighter control দরকার?",
      "bundle growth user experience-কে কীভাবে affect করে তা describe করতে পারবেন?",
    ],
    summaryEn: [
      "Web Vitals turn performance into measurable user experience language",
      "Budgets protect UX from slow silent degradation",
      "Bundle tuning focuses the team on the biggest delivery costs",
      "Performance discipline must be reviewed continuously, not only after things get slow",
    ],
    summaryBn: [
      "Web Vitals performance-কে measurable user-experience language-এ রূপ দেয়",
      "Budget slow silent degradation থেকে UX-কে protect করে",
      "Bundle tuning team-কে সবচেয়ে বড় delivery cost-এর দিকে focus করায়",
      "Performance discipline slow হয়ে যাওয়ার পরে না, আগেই continuously review করা দরকার",
    ],
    sandpack: makeSandpack(`import React, { useMemo, useState } from "react";

const routes = {
  landing: { bundleKb: 120, budgetKb: 150, focus: "LCP" },
  dashboard: { bundleKb: 260, budgetKb: 300, focus: "INP" },
  admin: { bundleKb: 420, budgetKb: 450, focus: "INP" },
};

export default function App() {
  const [route, setRoute] = useState("landing");
  const report = useMemo(() => routes[route], [route]);
  const withinBudget = report.bundleKb <= report.budgetKb;

  return (
    <div style={{ fontFamily: "sans-serif", padding: 20, maxWidth: 620 }}>
      <h2>Performance Budget Review</h2>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {Object.keys(routes).map((key) => (
          <button key={key} onClick={() => setRoute(key)} style={{ padding: "10px 14px", borderRadius: 10 }}>
            {key}
          </button>
        ))}
      </div>
      <div style={{ padding: 16, borderRadius: 16, background: withinBudget ? "#dcfce7" : "#fee2e2" }}>
        <p><strong>Selected route:</strong> {route}</p>
        <p><strong>Bundle size:</strong> {report.bundleKb}kb</p>
        <p><strong>Budget:</strong> {report.budgetKb}kb</p>
        <p><strong>Primary metric:</strong> {report.focus}</p>
        <p><strong>Status:</strong> {withinBudget ? "Within budget" : "Needs tuning"}</p>
      </div>
    </div>
  );
}`),
    resources: vitalsResources,
  }),
});
