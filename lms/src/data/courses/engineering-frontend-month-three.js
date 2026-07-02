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

const tokenResources = [
  { labelEn: "Tailwind CSS Docs", labelBn: "Tailwind CSS ডকস", url: "https://tailwindcss.com/docs" },
  { labelEn: "Tailwind Theme Variables", labelBn: "Tailwind theme variable গাইড", url: "https://tailwindcss.com/docs/theme" },
  { labelEn: "Design Tokens Guide", labelBn: "Design token গাইড", url: "https://www.design-tokens.dev/" },
];

const layoutResources = [
  { labelEn: "Tailwind Breakpoints", labelBn: "Tailwind breakpoint ডকস", url: "https://tailwindcss.com/docs/responsive-design" },
  { labelEn: "MDN CSS Grid", labelBn: "MDN CSS Grid", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout" },
  { labelEn: "Responsive Layout Patterns", labelBn: "Responsive layout pattern", url: "https://web.dev/patterns/layout" },
];

const componentResources = [
  { labelEn: "shadcn/ui Docs", labelBn: "shadcn/ui ডকস", url: "https://ui.shadcn.com" },
  { labelEn: "Radix Primitives", labelBn: "Radix primitive ডকস", url: "https://www.radix-ui.com/primitives" },
  { labelEn: "Component-Driven Development", labelBn: "Component-driven development", url: "https://storybook.js.org/blog/component-driven-development/" },
];

export const FRONTEND_MONTH_THREE = {};

Object.assign(FRONTEND_MONTH_THREE, {
  "fe-3-1": academicLesson({
    titleEn: "Tailwind Tokens & Design System Base",
    titleBn: "Tailwind টোকেন ও ডিজাইন সিস্টেম বেস",
    introEn: [
      "A strong UI system is not made of random utility classes. It is made of repeatable decisions about spacing, color, radius, typography, and state.",
      "Tailwind becomes powerful when a team stops treating it like an endless bag of classes and starts using it as an encoded design language. That is where tokens matter.",
      "This lecture teaches how design tokens and Tailwind work together so a product stays visually consistent while still shipping fast.",
    ],
    introBn: [
      "শক্তিশালী UI system random utility class দিয়ে তৈরি হয় না। এটি spacing, color, radius, typography, আর state নিয়ে repeatable decision-এর ওপর দাঁড়িয়ে থাকে।",
      "Tailwind তখনই শক্তিশালী হয় যখন team এটাকে endless class bag না ভেবে encoded design language হিসেবে ব্যবহার করে। সেখানেই token-এর গুরুত্ব আসে।",
      "এই lecture শেখাবে design token আর Tailwind একসাথে কীভাবে কাজ করে, যাতে product visually consistent থাকে আর দ্রুত ship-ও করা যায়।",
    ],
    learnEn: [
      "What a design token is and why it matters",
      "How Tailwind theme values become product-wide visual rules",
      "How to avoid one-off styling that breaks consistency",
      "How to build a reusable foundation for cards, buttons, badges, and surfaces",
    ],
    learnBn: [
      "design token কী আর কেন জরুরি",
      "Tailwind theme value কীভাবে product-wide visual rule হয়",
      "one-off styling এড়িয়ে consistency ধরে রাখার উপায়",
      "card, button, badge, আর surface-এর জন্য reusable foundation বানানো",
    ],
    whatEn: [
      "A design token is a named decision, such as primary color, base spacing unit, border radius, or text size. Instead of styling each component from scratch, we reuse those named decisions everywhere.",
      "Tailwind gives utility classes, but the deeper system comes from theme configuration, semantic naming, and disciplined reuse. That is how a product stops looking accidental.",
      "The design-system base is the layer where raw styles become shared language for engineering and design.",
    ],
    whatBn: [
      "Design token হলো named decision, যেমন primary color, base spacing unit, border radius, বা text size। প্রতিটি component নতুন করে style না করে আমরা এই named decision বারবার ব্যবহার করি।",
      "Tailwind utility class দেয়, কিন্তু deeper system আসে theme configuration, semantic naming, আর disciplined reuse থেকে। তখন product accidental দেখায় না।",
      "Design-system base হলো সেই layer যেখানে raw style engineering আর design-এর shared language-এ রূপ নেয়।",
    ],
    whyEn: [
      "Without tokens, teams create near-duplicate styles that slowly drift apart. The result is a product that feels inconsistent even when every screen is technically 'done'.",
      "EquiSaaS needs a premium but accessible bilingual UI. Tokens help us keep cards, forms, buttons, dashboards, and public pages visually related instead of stitched together.",
    ],
    whyBn: [
      "Token ছাড়া team প্রায় একই ধরনের style বারবার বানায়, যা ধীরে ধীরে drift করে। ফলে প্রতিটি screen technically done হলেও product inconsistent লাগে।",
      "EquiSaaS-এর premium কিন্তু accessible bilingual UI দরকার। Token card, form, button, dashboard, আর public page-কে stitched-together না লাগিয়ে visually related রাখে।",
    ],
    thinkEn: [
      "Think of tokens like a building code. The code does not design the whole city for you, but it keeps every building aligned enough that the city still feels coherent.",
    ],
    thinkBn: [
      "Token-কে building code ভাবুন। এটি পুরো শহর design করে না, কিন্তু প্রতিটি building-কে এতটাই aligned রাখে যে পুরো শহর coherent লাগে।",
    ],
    stepsEn: [
      "Name your core visual decisions first: colors, spacing, radius, shadows, and typography.",
      "Map those decisions into Tailwind theme values or CSS variables.",
      "Use semantic intent like `primary`, `muted`, `surface`, or `danger` instead of random color picking.",
      "Build primitive UI pieces on top of those tokens.",
      "Review whether a new component is reusing the system or inventing a new one-off style.",
    ],
    stepsBn: [
      "প্রথমে core visual decision-এর নাম দিন: color, spacing, radius, shadow, আর typography।",
      "এই decision-গুলোকে Tailwind theme value বা CSS variable-এ map করুন।",
      "`primary`, `muted`, `surface`, বা `danger`-এর মতো semantic intent ব্যবহার করুন, random color picking না।",
      "এই token-এর ওপর primitive UI piece বানান।",
      "Review করুন নতুন component system reuse করছে, নাকি নতুন one-off style invent করছে।",
    ],
    conceptsEn: [
      "**Token** is a reusable visual decision.",
      "**Theme scale** keeps spacing and type consistent.",
      "**Semantic color** communicates intent, not only appearance.",
      "**Primitive component** is a low-level reusable building block.",
      "**Consistency** reduces design noise and makes change easier.",
    ],
    conceptsBn: [
      "**Token** হলো reusable visual decision।",
      "**Theme scale** spacing আর typography consistent রাখে।",
      "**Semantic color** শুধু look না, intent communicate করে।",
      "**Primitive component** low-level reusable building block।",
      "**Consistency** design noise কমায় আর change সহজ করে।",
    ],
    whenEn: [
      "When multiple screens reuse the same button, card, form, or status patterns",
      "When design and engineering need one visual language",
      "When brand polish must survive fast iteration",
      "When accessibility and consistency both matter",
    ],
    whenBn: [
      "যখন বহু screen একই button, card, form, বা status pattern reuse করে",
      "যখন design আর engineering-এর এক visual language দরকার",
      "যখন দ্রুত iteration-এর মাঝেও brand polish ধরে রাখতে হবে",
      "যখন accessibility আর consistency দুটোই গুরুত্বপূর্ণ",
    ],
    exampleEn: [
      "Instead of giving one card `rounded-xl p-5 bg-white shadow` and another `rounded-2xl p-6 bg-slate-50 shadow-md`, define one surface language first. Then every variation inherits from the same system and feels related.",
    ],
    exampleBn: [
      "একটি card-এ `rounded-xl p-5 bg-white shadow` আর আরেকটিতে `rounded-2xl p-6 bg-slate-50 shadow-md` দেওয়ার বদলে আগে একটি surface language define করুন। তখন variation-গুলো একই system থেকে আসবে আর related লাগবে।",
    ],
    mistakesEn: [
      "Picking styles per component without a shared scale",
      "Using raw color values everywhere instead of semantic meaning",
      "Creating too many tokens without clear purpose",
      "Treating Tailwind utilities as design decisions by themselves",
    ],
    mistakesBn: [
      "shared scale ছাড়া component ধরে style pick করা",
      "semantic meaning-এর বদলে everywhere raw color value ব্যবহার করা",
      "clear purpose ছাড়া অতিরিক্ত token বানানো",
      "Tailwind utility-কেই final design decision মনে করা",
    ],
    applyEn: [
      "Audit one existing screen and count how many style decisions repeat",
      "Rename repeated style choices into token language",
      "Build one card and one badge using the same spacing and color system",
      "Explain your token decisions in simple language a designer and engineer both understand",
    ],
    applyBn: [
      "একটি existing screen audit করে দেখুন কত style decision repeat হচ্ছে",
      "Repeated style choice-গুলোকে token language-এ rename করুন",
      "একই spacing আর color system ব্যবহার করে একটি card আর একটি badge বানান",
      "এমনভাবে token decision explain করুন যাতে designer আর engineer দুজনেই বুঝতে পারে",
    ],
    assignmentEn: [
      "Create a mini token sheet for EquiSaaS: primary, surface, muted text, success, warning, spacing unit, and radius",
      "Build one learner progress card and one status badge using those tokens",
      "Submit code or screenshot plus a short note explaining why these tokens improve consistency",
      "Evaluation focus: semantic naming, reuse, clarity, and design-system thinking",
    ],
    assignmentBn: [
      "EquiSaaS-এর জন্য mini token sheet বানান: primary, surface, muted text, success, warning, spacing unit, আর radius",
      "এই token ব্যবহার করে একটি learner progress card আর একটি status badge বানান",
      "Code বা screenshot submit করুন, সাথে লিখুন token consistency কীভাবে improve করে",
      "Evaluation focus: semantic naming, reuse, clarity, আর design-system thinking",
    ],
    quickCheckEn: [
      "Can you explain why a token is more useful than a random utility choice?",
      "Can you name one token that controls product consistency across many screens?",
      "Can you tell the difference between raw style and semantic style?",
      "Can you explain why Tailwind alone is not the whole design system?",
    ],
    quickCheckBn: [
      "random utility choice-এর চেয়ে token কেন বেশি useful তা explain করতে পারবেন?",
      "একটি token-এর নাম বলতে পারবেন যেটা বহু screen-এর consistency control করে?",
      "raw style আর semantic style-এর পার্থক্য বলতে পারবেন?",
      "Tailwind একাই পুরো design system না কেন তা explain করতে পারবেন?",
    ],
    summaryEn: [
      "Tokens turn repeated visual choices into a shared system",
      "Tailwind becomes stronger when paired with semantic design rules",
      "Consistency is built from disciplined reuse, not from copying classes",
      "A clean token base makes UI polish easier to scale",
    ],
    summaryBn: [
      "Token repeated visual choice-কে shared system-এ রূপ দেয়",
      "semantic design rule-এর সাথে Tailwind আরও শক্তিশালী হয়",
      "Consistency copying class থেকে না, disciplined reuse থেকে আসে",
      "clean token base UI polish scale করা সহজ করে",
    ],
    sandpack: makeSandpack(`export default function App() {
  const tokens = {
    primary: "#2563eb",
    surface: "#ffffff",
    mutedText: "#475569",
    success: "#16a34a",
    spacing: 16,
    radius: 18,
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: 24, background: "#eff6ff" }}>
      <div style={{ maxWidth: 480, background: tokens.surface, borderRadius: tokens.radius, padding: tokens.spacing * 1.25, boxShadow: "0 10px 24px rgba(37,99,235,0.08)" }}>
        <p style={{ margin: 0, color: tokens.primary, fontWeight: 800 }}>Learner Progress</p>
        <h2 style={{ marginTop: 10 }}>Frontend Engineer Track</h2>
        <p style={{ color: tokens.mutedText }}>Consistency starts when color, spacing, and radius become shared product decisions.</p>
        <span style={{ display: "inline-block", marginTop: 8, padding: "8px 12px", borderRadius: 999, background: "#dcfce7", color: tokens.success, fontWeight: 700 }}>
          Active
        </span>
      </div>
    </div>
  );
}`),
    resources: tokenResources,
  }),
  "fe-3-2": academicLesson({
    titleEn: "Responsive Grid & Layout Composition",
    titleBn: "রেসপনসিভ গ্রিড ও লেআউট কম্পোজিশন",
    introEn: [
      "A SaaS product is not judged only by how it looks on one laptop. It is judged by whether the layout still makes sense on mobile, tablet, wide desktop, and real content pressure.",
      "Responsive design is not just shrinking things until they fit. It is deciding what should stack, what should stay side by side, what should remain visible, and how reading flow changes across screen sizes.",
      "This lecture teaches layout composition as product communication. Good layout helps the user understand what matters first.",
    ],
    introBn: [
      "SaaS product শুধু এক laptop-এ সুন্দর লাগলেই যথেষ্ট না। mobile, tablet, wide desktop, আর real content pressure-এ layout sense করে কি না, সেটাই আসল পরীক্ষা।",
      "Responsive design শুধু জিনিস ছোট করা না। কী stack হবে, কী পাশাপাশি থাকবে, কী visible থাকবে, আর screen size বদলালে reading flow কীভাবে বদলাবে - সেটাই আসল।",
      "এই lecture layout composition-কে product communication হিসেবে শেখায়। ভালো layout user-কে প্রথমে কী গুরুত্বপূর্ণ তা বুঝতে সাহায্য করে।",
    ],
    learnEn: [
      "How to think mobile-first without making desktop weak",
      "How grid, flex, spacing, and content hierarchy work together",
      "How to design dashboard sections that survive narrow screens",
      "How to make layouts readable before making them decorative",
    ],
    learnBn: [
      "desktop নষ্ট না করে mobile-first কীভাবে ভাবতে হয়",
      "grid, flex, spacing, আর content hierarchy কীভাবে একসাথে কাজ করে",
      "নarrow screen-এও টিকে থাকে এমন dashboard section কীভাবে design করতে হয়",
      "decorative করার আগে layout-কে readable করার উপায়",
    ],
    whatEn: [
      "Layout composition is the way content blocks are arranged so the user can scan, compare, and act. A layout is successful when it reduces confusion, not when it only looks complex.",
      "Responsive grids help us reorganize those blocks as available width changes. Flex and grid are not enemies; they solve different layers of the same layout problem.",
      "A strong layout respects content hierarchy. The most important action, summary, or status should not fight for attention with everything else.",
    ],
    whatBn: [
      "Layout composition হলো content block এমনভাবে arrange করা যাতে user scan, compare, আর action নিতে পারে। layout তখনই সফল যখন এটি confusion কমায়, শুধু complex দেখালেই না।",
      "Responsive grid width বদলালে block-গুলোকে নতুনভাবে organize করতে সাহায্য করে। Flex আর grid enemy না; তারা একই layout problem-এর আলাদা layer solve করে।",
      "ভালো layout content hierarchy respect করে। সবচেয়ে গুরুত্বপূর্ণ action, summary, বা status যেন অন্য সবকিছুর সাথে attention fight না করে।",
    ],
    whyEn: [
      "Poor layouts hide important information, create awkward scrolling, and make the product feel more difficult than it really is.",
      "EquiSaaS has dashboards, lesson views, reporting cards, task centers, and public profiles. Those surfaces must stay understandable on low-bandwidth mobile devices as well as larger screens.",
    ],
    whyBn: [
      "খারাপ layout গুরুত্বপূর্ণ তথ্য লুকায়, awkward scrolling তৈরি করে, আর product-কে বাস্তবের চেয়ে বেশি কঠিন মনে করায়।",
      "EquiSaaS-এ dashboard, lesson view, reporting card, task center, আর public profile আছে। low-bandwidth mobile device-এও এগুলো understandable থাকতে হবে।",
    ],
    thinkEn: [
      "Think of layout like arranging desks in a classroom. If every desk is placed randomly, movement and focus both suffer. A good arrangement supports both reading flow and action flow.",
    ],
    thinkBn: [
      "Layout-কে classroom-এর desk arrangement ভাবুন। সব desk random হলে movement আর focus দুটোই নষ্ট হয়। ভালো arrangement reading flow আর action flow দুটোই support করে।",
    ],
    stepsEn: [
      "Start with content priority, not screen decoration.",
      "Design the narrowest layout first so you know what must stack.",
      "Use grid for larger structure and flex for local alignment and spacing.",
      "Decide what becomes one column, two columns, or sidebar-plus-content at different breakpoints.",
      "Test the layout with realistic text length and real card counts.",
      "Review whether the user can still find the main action quickly on mobile.",
    ],
    stepsBn: [
      "screen decoration না, content priority দিয়ে শুরু করুন।",
      "সবচেয়ে narrow layout আগে design করুন, যাতে বুঝতে পারেন কী stack হবে।",
      "বড় structure-এর জন্য grid আর local alignment/spacings-এর জন্য flex ব্যবহার করুন।",
      "কোন breakpoint-এ one column, two column, বা sidebar-plus-content হবে তা decide করুন।",
      "বাস্তব text length আর card count দিয়ে layout test করুন।",
      "Review করুন mobile-এও user main action দ্রুত খুঁজে পায় কি না।",
    ],
    conceptsEn: [
      "**Mobile-first** starts from the tightest constraint.",
      "**Grid** handles macro layout structure.",
      "**Flex** handles alignment within a smaller row or block.",
      "**Hierarchy** tells the user what matters first.",
      "**Breakpoint choice** should follow content needs, not guesswork.",
    ],
    conceptsBn: [
      "**Mobile-first** সবচেয়ে tight constraint থেকে শুরু করে।",
      "**Grid** macro layout structure handle করে।",
      "**Flex** ছোট row বা block-এর ভেতরের alignment handle করে।",
      "**Hierarchy** user-কে বলে প্রথমে কী গুরুত্বপূর্ণ।",
      "**Breakpoint choice** guesswork না, content need follow করা উচিত।",
    ],
    whenEn: [
      "When building dashboards, analytics cards, profile pages, and tabbed workspaces",
      "When users will access the product from both phone and desktop",
      "When content density changes across roles or features",
      "When layout clarity affects task completion",
    ],
    whenBn: [
      "যখন dashboard, analytics card, profile page, আর tabbed workspace বানান",
      "যখন phone আর desktop দুটো থেকেই product use হবে",
      "যখন role বা feature অনুযায়ী content density বদলায়",
      "যখন layout clarity task completion-কে প্রভাবিত করে",
    ],
    exampleEn: [
      "A learner dashboard might use one column on mobile, then shift to a two-column summary-and-activity layout on tablet, then a three-area dashboard on desktop. The content is the same, but the reading path changes with the screen.",
    ],
    exampleBn: [
      "Learner dashboard mobile-এ one column, tablet-এ summary-plus-activity two-column, আর desktop-এ three-area dashboard হতে পারে। content একই, কিন্তু screen অনুযায়ী reading path বদলায়।",
    ],
    mistakesEn: [
      "Designing desktop first and squeezing it into mobile later",
      "Using many columns before content is readable",
      "Ignoring real content length and only testing with short placeholder text",
      "Mixing primary and secondary actions so they compete visually",
    ],
    mistakesBn: [
      "desktop আগে design করে পরে mobile-এ জোর করে ছোট করা",
      "content readable হওয়ার আগেই অনেক column ব্যবহার করা",
      "short placeholder text দিয়ে test করে real content length ignore করা",
      "primary আর secondary action-কে এমনভাবে mix করা যে visual competition হয়",
    ],
    applyEn: [
      "Redraw one existing screen in mobile-first order",
      "Mark the primary action, primary summary, and secondary information",
      "Choose breakpoints only after content pressure appears",
      "Test with long Bangla and English text, not just short labels",
    ],
    applyBn: [
      "একটি existing screen mobile-first order-এ redraw করুন",
      "primary action, primary summary, আর secondary information mark করুন",
      "content pressure দেখা দেওয়ার পরেই breakpoint choose করুন",
      "short label না, long Bangla আর English text দিয়ে test করুন",
    ],
    assignmentEn: [
      "Design a responsive learner dashboard section with overview cards, recent tasks, and a quick action area",
      "Show how it changes from mobile to tablet to desktop",
      "Submit code or screenshot plus a note explaining content priority and breakpoint reasoning",
      "Evaluation focus: readability, layout logic, responsiveness, and hierarchy",
    ],
    assignmentBn: [
      "overview card, recent task, আর quick action area-সহ responsive learner dashboard section design করুন",
      "mobile, tablet, আর desktop-এ এটি কীভাবে বদলাবে তা দেখান",
      "Code বা screenshot submit করুন, সাথে content priority আর breakpoint reasoning লিখুন",
      "Evaluation focus: readability, layout logic, responsiveness, আর hierarchy",
    ],
    quickCheckEn: [
      "Can you explain why mobile-first is a thinking method, not only a CSS order?",
      "Can you say when grid is more useful than flex?",
      "Can you identify the primary action on your screen layout?",
      "Can you explain how content length changes layout decisions?",
    ],
    quickCheckBn: [
      "mobile-first শুধু CSS order না, thinking method কেন তা explain করতে পারবেন?",
      "কখন grid flex-এর চেয়ে বেশি useful তা বলতে পারবেন?",
      "আপনার screen layout-এ primary action identify করতে পারবেন?",
      "content length layout decision কীভাবে বদলায় তা explain করতে পারবেন?",
    ],
    summaryEn: [
      "Responsive layout begins with content priority, not visual decoration",
      "Grid and flex solve different layers of the layout problem",
      "Mobile-first helps the team respect real constraints",
      "Readable layout makes the product feel simpler and more professional",
    ],
    summaryBn: [
      "Responsive layout content priority দিয়ে শুরু হয়, visual decoration দিয়ে না",
      "grid আর flex layout problem-এর আলাদা layer solve করে",
      "mobile-first team-কে real constraint respect করতে শেখায়",
      "readable layout product-কে সহজ আর professional মনে করায়",
    ],
    sandpack: makeSandpack(`export default function App() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: 20, background: "#f8fafc" }}>
      <h2>Responsive Layout Composition</h2>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <section style={{ background: "white", padding: 16, borderRadius: 16 }}>Overview Cards</section>
        <section style={{ background: "white", padding: 16, borderRadius: 16 }}>Recent Tasks</section>
        <section style={{ background: "white", padding: 16, borderRadius: 16 }}>Quick Actions</section>
      </div>
      <p style={{ color: "#475569", marginTop: 16 }}>
        Resize the preview to notice how the cards stack and spread without losing hierarchy.
      </p>
    </div>
  );
}`),
    resources: layoutResources,
  }),
  "fe-3-3": academicLesson({
    titleEn: "Component Library Structure",
    titleBn: "কম্পোনেন্ট লাইব্রেরি স্ট্রাকচার",
    introEn: [
      "A product becomes easier to scale when UI pieces are organized like a library, not like a pile of one-off files.",
      "Component library structure is about ownership, reuse, naming, and boundaries. The goal is not to create a huge design-system package on day one. The goal is to make repeated UI calm, discoverable, and safe to extend.",
      "This lecture teaches how primitive components, composed patterns, and feature-specific UI can live together without turning the codebase into a maze.",
    ],
    introBn: [
      "Product scale করা সহজ হয় যখন UI piece-গুলো library-এর মতো organize করা থাকে, one-off file-এর pile-এর মতো না।",
      "Component library structure মানে ownership, reuse, naming, আর boundary। Day one-তেই বিশাল design-system package বানানো goal না। Goal হলো repeated UI-কে calm, discoverable, আর safe-to-extend করা।",
      "এই lecture শেখাবে primitive component, composed pattern, আর feature-specific UI কীভাবে একসাথে থাকতে পারে maze না বানিয়ে।",
    ],
    learnEn: [
      "How to separate primitive UI, shared patterns, and feature-specific components",
      "How shadcn-style composition differs from copy-paste component chaos",
      "How file naming and folder structure reduce review friction",
      "How to decide when a component belongs in the shared library versus a feature folder",
    ],
    learnBn: [
      "primitive UI, shared pattern, আর feature-specific component কীভাবে আলাদা করতে হয়",
      "shadcn-style composition copy-paste chaos থেকে কীভাবে আলাদা",
      "file naming আর folder structure কীভাবে review friction কমায়",
      "কখন component shared library-তে যাবে আর কখন feature folder-এ থাকবে",
    ],
    whatEn: [
      "A component library is a collection of reusable building blocks with clear roles. Some are primitives like Button, Input, Card, Dialog, and Tabs. Others are composed product patterns like TaskCard or ProgressSummary.",
      "A strong structure keeps primitives generic, patterns shared when truly reusable, and feature-specific pieces close to the feature that owns them.",
      "shadcn-style architecture works well because it starts from composable primitives instead of giant magic components. That makes customization easier and code reading calmer.",
    ],
    whatBn: [
      "Component library হলো clear role-ওয়ালা reusable building block-এর collection। কিছু primitive, যেমন Button, Input, Card, Dialog, আর Tabs। কিছু composed product pattern, যেমন TaskCard বা ProgressSummary।",
      "ভালো structure primitive-কে generic রাখে, truly reusable pattern-কে shared রাখে, আর feature-specific piece-কে feature-এর কাছেই রাখে।",
      "shadcn-style architecture ভালো কাজ করে কারণ এটি giant magic component দিয়ে না শুরু করে composable primitive দিয়ে শুরু করে। এতে customization সহজ হয় আর code পড়া calm লাগে।",
    ],
    whyEn: [
      "Without clear structure, teams duplicate components, invent slightly different APIs, and create folders that no one trusts. Review slows down because people cannot tell what is shared and what is custom.",
      "EquiSaaS needs consistent cards, badges, dialogs, forms, and reporting widgets across learning, governance, and public surfaces. A strong library structure lets us reuse patterns without locking the product into rigid templates.",
    ],
    whyBn: [
      "clear structure না থাকলে team duplicate component বানায়, slightly different API invent করে, আর এমন folder তৈরি হয় যেটা কেউ trust করে না। Review ধীর হয়ে যায় কারণ shared আর custom boundary বোঝা যায় না।",
      "EquiSaaS-এ learning, governance, আর public surface-জুড়ে consistent card, badge, dialog, form, আর reporting widget দরকার। Strong library structure reuse বাড়ায় কিন্তু product-কে rigid template-এ আটকে ফেলে না।",
    ],
    thinkEn: [
      "Think of the library like a workshop. The workshop stores reliable tools in one place, but each project still builds its own custom result. Shared tools should stay clean; project-specific pieces should stay near the project.",
    ],
    thinkBn: [
      "Library-কে workshop ভাবুন। workshop reliable tool এক জায়গায় রাখে, কিন্তু প্রতিটি project নিজের custom result বানায়। shared tool clean থাকবে; project-specific piece project-এর কাছেই থাকবে।",
    ],
    stepsEn: [
      "List which UI pieces are primitives, which are shared patterns, and which are feature-specific.",
      "Keep low-level primitives in the shared UI layer.",
      "Create composed patterns only after the same structure repeats across multiple features.",
      "Name files and props by intent, not by temporary visual appearance.",
      "Avoid promoting a component to the library too early.",
      "Review whether a component is truly reusable or only reused once by accident.",
    ],
    stepsBn: [
      "কোন UI piece primitive, কোনটি shared pattern, আর কোনটি feature-specific - তা list করুন।",
      "low-level primitive-কে shared UI layer-এ রাখুন।",
      "একই structure বহু feature-এ repeat হওয়ার পরই composed pattern shared করুন।",
      "file আর prop intent দিয়ে নাম দিন, temporary look দিয়ে না।",
      "অতিরিক্ত তাড়াতাড়ি component-কে library-তে promote করবেন না।",
      "Review করুন component সত্যিই reusable কি না, নাকি accidently এক-দুই জায়গায় use হয়েছে।",
    ],
    conceptsEn: [
      "**Primitive component** is generic and reusable across features.",
      "**Composed pattern** combines primitives into a repeated product block.",
      "**Feature component** belongs close to the feature that owns it.",
      "**API consistency** matters as much as visual consistency.",
      "**Ownership boundary** protects the codebase from library sprawl.",
    ],
    conceptsBn: [
      "**Primitive component** generic এবং বহু feature-এ reusable।",
      "**Composed pattern** primitive জুড়ে repeated product block বানায়।",
      "**Feature component** সেই feature-এর কাছেই থাকে যে এটি own করে।",
      "**API consistency** visual consistency-এর মতোই গুরুত্বপূর্ণ।",
      "**Ownership boundary** codebase-কে library sprawl থেকে বাঁচায়।",
    ],
    whenEn: [
      "When multiple features reuse the same interaction pattern",
      "When the team needs discoverable UI building blocks",
      "When review quality depends on naming and boundary clarity",
      "When the product is growing beyond one-off screen code",
    ],
    whenBn: [
      "যখন বহু feature একই interaction pattern reuse করে",
      "যখন team-এর discoverable UI building block দরকার",
      "যখন review quality naming আর boundary clarity-এর ওপর নির্ভর করে",
      "যখন product one-off screen code-এর বাইরে grow করছে",
    ],
    exampleEn: [
      "A `Button` belongs in shared UI. A `ProgressSummaryCard` may belong in shared patterns if many surfaces use it. A `ManagerScopeCoverageTable` should likely stay near the governance feature because its logic and vocabulary are highly specific.",
    ],
    exampleBn: [
      "`Button` shared UI-তে যাবে। `ProgressSummaryCard` বহু surface-এ use হলে shared pattern-এ যেতে পারে। `ManagerScopeCoverageTable` সম্ভবত governance feature-এর কাছেই থাকবে, কারণ তার logic আর vocabulary খুব specific।",
    ],
    mistakesEn: [
      "Putting every component in the shared library immediately",
      "Creating generic names for highly feature-specific components",
      "Copy-pasting primitives instead of composing them",
      "Letting shared components develop inconsistent prop APIs",
    ],
    mistakesBn: [
      "প্রতিটি component-কে সাথে সাথে shared library-তে পাঠানো",
      "খুব feature-specific component-কে generic নাম দেওয়া",
      "primitive compose না করে copy-paste করা",
      "shared component-এর prop API-কে inconsistent হতে দেওয়া",
    ],
    applyEn: [
      "Audit one feature and mark which components should stay local versus shared",
      "Write one folder map for primitives, patterns, and feature components",
      "Rename one vague component to a more intention-revealing name",
      "Before extracting, ask whether at least two real features share the same need",
    ],
    applyBn: [
      "একটি feature audit করে mark করুন কোন component local থাকবে আর কোনটি shared হতে পারে",
      "primitive, pattern, আর feature component-এর জন্য folder map লিখুন",
      "একটি vague component-এর নাম intention-revealing নামে বদলান",
      "extract করার আগে জিজ্ঞেস করুন কমপক্ষে দুইটি real feature কি একই need share করছে?",
    ],
    assignmentEn: [
      "Design a folder map for shared UI primitives, shared patterns, and one feature-specific task area",
      "Build one primitive-style button, one shared card pattern, and one feature-specific learner task item",
      "Submit code or screenshot plus a short note explaining why each component belongs where it does",
      "Evaluation focus: boundary clarity, naming, reuse logic, and maintainability",
    ],
    assignmentBn: [
      "shared UI primitive, shared pattern, আর একটি feature-specific task area-এর folder map design করুন",
      "একটি primitive-style button, একটি shared card pattern, আর একটি feature-specific learner task item বানান",
      "Code বা screenshot submit করুন, সাথে লিখুন কেন প্রতিটি component তার ওই জায়গায় থাকা উচিত",
      "Evaluation focus: boundary clarity, naming, reuse logic, আর maintainability",
    ],
    quickCheckEn: [
      "Can you explain the difference between a primitive and a feature-specific component?",
      "Can you say why not every component should enter the shared library?",
      "Can you identify one sign of component-library sprawl?",
      "Can you describe how naming affects review speed?",
    ],
    quickCheckBn: [
      "primitive আর feature-specific component-এর পার্থক্য explain করতে পারবেন?",
      "প্রতিটি component shared library-তে যাওয়া উচিত না কেন তা বলতে পারবেন?",
      "component-library sprawl-এর একটি sign identify করতে পারবেন?",
      "naming review speed-কে কীভাবে প্রভাবিত করে তা describe করতে পারবেন?",
    ],
    summaryEn: [
      "A component library is about boundaries and reuse, not only shared files",
      "Primitive, pattern, and feature-specific layers should stay intentional",
      "shadcn-style composition encourages flexible but calm UI architecture",
      "Clear naming and ownership reduce maintenance cost over time",
    ],
    summaryBn: [
      "Component library শুধু shared file না; boundary আর reuse-এর কথাও বলে",
      "primitive, pattern, আর feature-specific layer intentional থাকতে হবে",
      "shadcn-style composition flexible কিন্তু calm UI architecture তৈরি করতে সাহায্য করে",
      "clear naming আর ownership সময়ের সাথে maintenance cost কমায়",
    ],
    sandpack: makeSandpack(`function Button({ children }) {
  return (
    <button style={{ padding: "10px 14px", borderRadius: 12, background: "#2563eb", color: "white", border: "none" }}>
      {children}
    </button>
  );
}

function Card({ title, children }) {
  return (
    <section style={{ background: "white", borderRadius: 16, padding: 16, boxShadow: "0 8px 20px rgba(15,23,42,0.08)" }}>
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function LearnerTaskItem({ title, status }) {
  return (
    <Card title={title}>
      <p>Status: {status}</p>
      <Button>Open task</Button>
    </Card>
  );
}

export default function App() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: 24, background: "#eff6ff" }}>
      <p style={{ color: "#2563eb", fontWeight: 800 }}>Primitive + Pattern + Feature Component</p>
      <LearnerTaskItem title="Submit lesson reflection" status="In Review" />
    </div>
  );
}`),
    resources: componentResources,
  }),
});
