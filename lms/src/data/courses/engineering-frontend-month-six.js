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

const i18nResources = [
  { labelEn: "react-i18next Docs", labelBn: "react-i18next ডকস", url: "https://react.i18next.com/" },
  { labelEn: "MDN lang Attribute", labelBn: "MDN lang attribute", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang" },
  { labelEn: "Localizely i18n Guide", labelBn: "Localizely i18n গাইড", url: "https://localizely.com/blog/react-localization/" },
];

const a11yResources = [
  { labelEn: "WAI Accessibility Intro", labelBn: "WAI accessibility intro", url: "https://www.w3.org/WAI/fundamentals/accessibility-intro/" },
  { labelEn: "MDN Accessibility", labelBn: "MDN accessibility guide", url: "https://developer.mozilla.org/en-US/docs/Learn/Accessibility" },
  { labelEn: "WebAIM Checklist", labelBn: "WebAIM checklist", url: "https://webaim.org/standards/wcag/checklist" },
];

const monitoringResources = [
  { labelEn: "Sentry for React", labelBn: "React-এর জন্য Sentry", url: "https://docs.sentry.io/platforms/javascript/guides/react/" },
  { labelEn: "GA4 Event Guide", labelBn: "GA4 event guide", url: "https://support.google.com/analytics/answer/9322688" },
  { labelEn: "PostHog Product Analytics", labelBn: "PostHog analytics guide", url: "https://posthog.com/docs/product-analytics" },
];

export const FRONTEND_MONTH_SIX = {};

Object.assign(FRONTEND_MONTH_SIX, {
  "fe-6-1": academicLesson({
    titleEn: "Bilingual i18n (BN/EN)",
    titleBn: "বাংলা/ইংরেজি i18n",
    introEn: [
      "A production-ready frontend is not only fast and beautiful. It also speaks the learner's language clearly.",
      "For EquiSaaS, bilingual delivery is core product access. If the interface is understandable only in English, a large part of the community is excluded from confidence, contribution, and ownership.",
      "This lecture teaches i18n as a system: translation keys, locale switching, fallback behavior, and content structure that stays maintainable as the product grows.",
    ],
    introBn: [
      "Production-ready frontend শুধু fast আর সুন্দর হলেই হয় না। এটিকে learner-এর ভাষায়ও পরিষ্কারভাবে কথা বলতে হয়।",
      "EquiSaaS-এর জন্য bilingual delivery core product access। Interface যদি শুধু English-এ বোধগম্য হয়, তাহলে community-র বড় অংশ confidence, contribution, আর ownership থেকে বাদ পড়ে যায়।",
      "এই lecture i18n-কে system হিসেবে শেখায়: translation key, locale switch, fallback behavior, আর product বড় হলে maintainable content structure কীভাবে রাখা যায়।",
    ],
    learnEn: [
      "Why i18n is a product architecture concern, not only a copy task",
      "How translation keys, dictionaries, and fallback logic work together",
      "How to structure BN and EN content without hard-coded duplication everywhere",
      "How to test whether a bilingual UI stays consistent across screens",
    ],
    learnBn: [
      "i18n কেন শুধু copy task না, product architecture concern",
      "translation key, dictionary, আর fallback logic কীভাবে একসাথে কাজ করে",
      "hard-coded duplication ছাড়া BN আর EN content কীভাবে structure করতে হয়",
      "bilingual UI screen জুড়ে consistent আছে কি না কীভাবে test করতে হয়",
    ],
    whatEn: [
      "Internationalization prepares the UI so different languages can be shown from the same interface structure.",
      "Localization is the actual language content for each locale, such as Bangla and English labels, hints, and messages.",
      "In a healthy system, components render translation keys rather than hard-coded sentences spread across many files.",
    ],
    whatBn: [
      "Internationalization UI-কে এমনভাবে prepare করে যাতে একই interface structure থেকে ভিন্ন ভাষা দেখানো যায়।",
      "Localization হলো প্রতিটি locale-এর actual language content, যেমন Bangla আর English label, hint, আর message।",
      "একটি healthy system-এ component অনেক file-এ hard-coded sentence ছড়িয়ে না দিয়ে translation key render করে।",
    ],
    whyEn: [
      "When bilingual content is unmanaged, the Bangla screen falls behind the English screen, errors become inconsistent, and learners lose trust.",
      "A clear i18n system lets design, product, and engineering work together. Content changes become reviewable, and every new screen can ship in both languages with less chaos.",
    ],
    whyBn: [
      "Bilingual content unmanaged হলে Bangla screen English screen-এর পেছনে পড়ে যায়, error message inconsistent হয়, আর learner trust হারায়।",
      "একটি clear i18n system design, product, আর engineering-কে একসাথে কাজ করতে দেয়। Content change reviewable হয়, আর নতুন screen কম chaos-এ দুই ভাষাতেই ship করা যায়।",
    ],
    thinkEn: [
      "Think of i18n like a library catalog. The shelf location is the translation key. The actual book on that shelf depends on which language section you open.",
    ],
    thinkBn: [
      "i18n-কে library catalog-এর মতো ভাবুন। Shelf location হলো translation key। আপনি কোন language section খুলছেন তার ওপর shelf-এর বই বদলায়।",
    ],
    stepsEn: [
      "Define stable translation keys based on meaning, not on the current wording.",
      "Create locale dictionaries for BN and EN with the same key set.",
      "Build a small translation helper or library setup to resolve the active locale.",
      "Add sensible fallback behavior when one key is missing.",
      "Keep dynamic values separate from the sentence template so numbers, names, and statuses remain predictable.",
      "Audit important screens to confirm both locales stay complete and readable.",
    ],
    stepsBn: [
      "বর্তমান wording নয়, meaning-এর ভিত্তিতে stable translation key define করুন।",
      "BN আর EN-এর জন্য same key set-সহ locale dictionary তৈরি করুন।",
      "active locale resolve করার জন্য ছোট translation helper বা library setup করুন।",
      "একটি key missing হলে sensible fallback behavior দিন।",
      "sentence template থেকে dynamic value আলাদা রাখুন, যাতে number, name, আর status predictable থাকে।",
      "important screen audit করে দেখুন দুই locale-ই complete আর readable আছে কি না।",
    ],
    conceptsEn: [
      "**Translation key** gives one stable identifier for a message.",
      "**Locale dictionary** stores the actual wording per language.",
      "**Fallback** prevents broken UI when one translation is missing.",
      "**Interpolation** inserts dynamic values into a translated sentence.",
      "**Content parity** means BN and EN both cover the same product meaning.",
    ],
    conceptsBn: [
      "**Translation key** একটি message-এর জন্য stable identifier দেয়।",
      "**Locale dictionary** প্রতিটি language-এর actual wording store করে।",
      "**Fallback** একটি translation missing হলেও UI ভাঙতে দেয় না।",
      "**Interpolation** translated sentence-এর ভেতরে dynamic value বসায়।",
      "**Content parity** মানে BN আর EN দুটোতেই same product meaning cover হয়।",
    ],
    whenEn: [
      "When your product serves users in more than one language",
      "When you want to launch new screens in BN and EN together",
      "When content changes should be reviewable without touching component logic",
      "When accessibility and clarity depend on precise wording",
    ],
    whenBn: [
      "যখন product একাধিক ভাষার user serve করে",
      "যখন নতুন screen BN আর EN-এ একসাথে launch করতে চান",
      "যখন component logic না ছুঁয়েও content change reviewable করতে চান",
      "যখন accessibility আর clarity precise wording-এর ওপর নির্ভর করে",
    ],
    exampleEn: [
      "A learner task center needs labels such as due date, revision requested, submit proof, and manager feedback in both Bangla and English. With translation keys, the screen remains structured and the content team can review meaning systematically.",
    ],
    exampleBn: [
      "Learner task center-এ due date, revision requested, submit proof, আর manager feedback-এর মতো label দুই ভাষাতেই লাগবে। Translation key ব্যবহার করলে screen structured থাকে আর content team meaning systematicভাবে review করতে পারে।",
    ],
    mistakesEn: [
      "Using the visible sentence itself as the key",
      "Keeping Bangla strings in some components and dictionaries in others",
      "Ignoring fallback behavior until production errors happen",
      "Translating word by word without checking product meaning",
    ],
    mistakesBn: [
      "visible sentence-কেই key হিসেবে ব্যবহার করা",
      "কিছু component-এ Bangla string রাখা আর কিছু জায়গায় dictionary ব্যবহার করা",
      "production error হওয়ার আগে fallback behavior না ভাবা",
      "product meaning না দেখে word-by-word translation করা",
    ],
    applyEn: [
      "Start with shared product vocabulary such as status labels, task actions, and navigation labels.",
      "Use one dictionary per locale and keep key names consistent.",
      "Review bilingual screens with both a product owner and a Bangla-first learner.",
      "Document missing-copy rules so future contributors know what to do before shipping.",
    ],
    applyBn: [
      "status label, task action, আর navigation label-এর মতো shared product vocabulary দিয়ে শুরু করুন।",
      "প্রতিটি locale-এর জন্য একটি dictionary রাখুন এবং key name consistent রাখুন।",
      "product owner আর Bangla-first learner দুজনকে নিয়ে bilingual screen review করুন।",
      "future contributor যেন shipping-এর আগে কী করবে তা জানে, সেই missing-copy rule document করুন।",
    ],
    assignmentEn: [
      "Design a BN/EN translation map for one learner-facing screen such as dashboard, task center, or lesson player.",
      "Implement at least 12 translation keys with a locale switcher.",
      "Write a short review note describing fallback behavior and any copy differences you had to resolve.",
      "Submit code link, screenshots of both locales, and a content parity checklist.",
    ],
    assignmentBn: [
      "dashboard, task center, বা lesson player-এর মতো একটি learner-facing screen-এর জন্য BN/EN translation map তৈরি করুন।",
      "কমপক্ষে ১২টি translation key আর একটি locale switcher implement করুন।",
      "fallback behavior আর resolved copy difference নিয়ে ছোট review note লিখুন।",
      "code link, দুই locale-এর screenshot, আর content parity checklist submit করুন।",
    ],
    quickCheckEn: [
      "Can your translation keys survive copy changes without renaming everything?",
      "If one Bangla key is missing, what should the UI show?",
      "Did you separate dynamic values from the translated sentence template?",
    ],
    quickCheckBn: [
      "copy change হলেও কি translation key rename না করে টিকে থাকবে?",
      "একটি Bangla key missing হলে UI কী দেখাবে?",
      "translated sentence template থেকে কি dynamic value আলাদা রেখেছেন?",
    ],
    summaryEn: [
      "i18n is product infrastructure for a bilingual community platform.",
      "Stable keys, clean dictionaries, and fallback logic keep BN and EN aligned.",
      "A maintainable localization system reduces launch friction and increases learner trust.",
    ],
    summaryBn: [
      "i18n একটি bilingual community platform-এর product infrastructure।",
      "stable key, clean dictionary, আর fallback logic BN আর EN-কে aligned রাখে।",
      "maintainable localization system launch friction কমায় আর learner trust বাড়ায়।",
    ],
    sandpack: makeSandpack(`import React, { useMemo, useState } from 'react';

const dictionaries = {
  en: {
    title: 'Learner Task Center',
    subtitle: 'Track tasks, reviews, and next steps in one place.',
    due: 'Due in 2 days',
    action: 'Submit progress',
    status: 'Revision requested',
  },
  bn: {
    title: 'লার্নার টাস্ক সেন্টার',
    subtitle: 'এক জায়গায় টাস্ক, রিভিউ, আর পরের ধাপ দেখুন।',
    due: 'আর ২ দিনে ডেডলাইন',
    action: 'অগ্রগতি জমা দিন',
    status: 'সংশোধন চাওয়া হয়েছে',
  },
};

function useT(locale) {
  return useMemo(() => {
    const fallback = dictionaries.en;
    const current = dictionaries[locale] || fallback;
    return (key) => current[key] || fallback[key] || key;
  }, [locale]);
}

export default function App() {
  const [locale, setLocale] = useState('bn');
  const t = useT(locale);

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 20, maxWidth: 460 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button onClick={() => setLocale('bn')}>BN</button>
        <button onClick={() => setLocale('en')}>EN</button>
      </div>

      <div style={{ border: '1px solid #d1d5db', borderRadius: 16, padding: 16 }}>
        <h2>{t('title')}</h2>
        <p>{t('subtitle')}</p>
        <p><strong>{t('status')}</strong></p>
        <p>{t('due')}</p>
        <button>{t('action')}</button>
      </div>
    </div>
  );
}`),
    resources: i18nResources,
  }),
  "fe-6-2": academicLesson({
    titleEn: "Accessibility Audit",
    titleBn: "অ্যাক্সেসিবিলিটি অডিট",
    introEn: [
      "Accessibility is not a bonus feature for a small group. It is part of basic product dignity.",
      "If a learner cannot understand the page with a screen reader, cannot reach controls with a keyboard, or cannot distinguish status because of weak contrast, the product is effectively blocked for them.",
      "This lecture teaches accessibility as an audit habit: checking semantics, focus, labels, feedback, and keyboard flow before calling a screen production-ready.",
    ],
    introBn: [
      "Accessibility ছোট একটি group-এর জন্য bonus feature না। এটি basic product dignity-এর অংশ।",
      "Screen reader দিয়ে page বোঝা না গেলে, keyboard দিয়ে control-এ যাওয়া না গেলে, বা weak contrast-এর কারণে status বোঝা না গেলে, product তাদের জন্য effectively blocked হয়ে যায়।",
      "এই lecture accessibility-কে audit habit হিসেবে শেখায়: একটি screen-কে production-ready বলার আগে semantics, focus, label, feedback, আর keyboard flow check করা।",
    ],
    learnEn: [
      "How to audit a screen beyond visual appearance",
      "Which accessibility checks matter most for forms, buttons, dialogs, and status feedback",
      "How semantic HTML reduces complexity compared with ARIA-first patches",
      "How to prioritize a11y fixes in a fast-moving product team",
    ],
    learnBn: [
      "visual appearance-এর বাইরে গিয়ে screen কীভাবে audit করতে হয়",
      "form, button, dialog, আর status feedback-এর জন্য কোন accessibility check সবচেয়ে গুরুত্বপূর্ণ",
      "semantic HTML কীভাবে ARIA-first patch-এর চেয়ে complexity কমায়",
      "fast-moving product team-এ a11y fix কীভাবে prioritize করতে হয়",
    ],
    whatEn: [
      "An accessibility audit checks whether real users with different abilities can operate and understand the interface.",
      "The audit includes structure, heading order, form labels, keyboard access, focus management, contrast, and error messaging.",
      "Good accessibility is often less about adding more code and more about using correct HTML and clear interaction patterns from the start.",
    ],
    whatBn: [
      "Accessibility audit check করে বিভিন্ন ability-র real user interface operate আর understand করতে পারছে কি না।",
      "এই audit-এর মধ্যে structure, heading order, form label, keyboard access, focus management, contrast, আর error messaging থাকে।",
      "ভালো accessibility অনেক সময় বেশি code যোগ করা না, বরং শুরু থেকেই correct HTML আর clear interaction pattern ব্যবহার করা।",
    ],
    whyEn: [
      "Accessibility problems usually hide in plain sight. A mouse user may finish the task while a keyboard-only learner gets stuck on the first modal or form field.",
      "For a community-driven LMS, accessibility also improves clarity for everyone. Clear labels, predictable focus, and understandable feedback help beginners as much as assistive-technology users.",
    ],
    whyBn: [
      "Accessibility problem অনেক সময় চোখের সামনে লুকানো থাকে। Mouse user task finish করলেও keyboard-only learner প্রথম modal বা form field-এই আটকে যেতে পারে।",
      "Community-driven LMS-এর জন্য accessibility সবার clarity-ই বাড়ায়। Clear label, predictable focus, আর understandable feedback beginner-দেরও assistive-technology user-এর মতোই সাহায্য করে।",
    ],
    thinkEn: [
      "Think of an accessibility audit like a building safety inspection. A building may look attractive from outside, but if the doors, signs, and emergency routes do not work for real people, it is not truly usable.",
    ],
    thinkBn: [
      "Accessibility audit-কে building safety inspection-এর মতো ভাবুন। বাইরে থেকে building সুন্দর দেখালেও দরজা, sign, আর exit route real মানুষের জন্য কাজ না করলে সেটি আসলে usable না।",
    ],
    stepsEn: [
      "Start with semantic HTML: proper headings, buttons, labels, and landmarks.",
      "Test keyboard-only navigation from top to bottom.",
      "Check visible focus styles and confirm the active element is always clear.",
      "Verify forms have labels, instructions, and understandable error messages.",
      "Confirm status changes are announced or visible in a meaningful way.",
      "Review contrast, readable language, and motion sensitivity where relevant.",
    ],
    stepsBn: [
      "semantic HTML দিয়ে শুরু করুন: proper heading, button, label, আর landmark।",
      "উপর থেকে নিচ পর্যন্ত keyboard-only navigation test করুন।",
      "visible focus style check করুন এবং active element সবসময় clear আছে কি না নিশ্চিত করুন।",
      "form-এ label, instruction, আর understandable error message আছে কি না দেখুন।",
      "status change meaningfulভাবে visible বা announced হচ্ছে কি না নিশ্চিত করুন।",
      "প্রয়োজনে contrast, readable language, আর motion sensitivity review করুন।",
    ],
    conceptsEn: [
      "**Semantic HTML** gives assistive tools better meaning with less work.",
      "**Focus order** controls where keyboard users move next.",
      "**Accessible name** is the label a screen reader announces for a control.",
      "**ARIA** helps when HTML alone is not enough, but it does not replace semantics.",
      "**Audit checklist** turns accessibility into a repeatable release habit.",
    ],
    conceptsBn: [
      "**Semantic HTML** কম effort-এ assistive tool-কে ভালো meaning দেয়।",
      "**Focus order** keyboard user next কোথায় যাবে তা control করে।",
      "**Accessible name** হলো control-এর জন্য screen reader যে label announce করে।",
      "**ARIA** HTML যথেষ্ট না হলে সাহায্য করে, কিন্তু semantics replace করে না।",
      "**Audit checklist** accessibility-কে repeatable release habit বানায়।",
    ],
    whenEn: [
      "Before shipping any learner-facing screen",
      "When adding forms, dialogs, dropdowns, or tables",
      "When redesigning navigation or status-heavy workflows",
      "When QA reports users getting stuck even though the page looks fine",
    ],
    whenBn: [
      "যে কোনো learner-facing screen ship করার আগে",
      "যখন form, dialog, dropdown, বা table যোগ করছেন",
      "যখন navigation বা status-heavy workflow redesign করছেন",
      "যখন page দেখতে ঠিক হলেও QA report দেয় user আটকে যাচ্ছে",
    ],
    exampleEn: [
      "A revision request form may look simple, but if the label is missing, the submit button is not keyboard reachable, and the error message is only red text with no explanation, many learners will fail the task. An accessibility audit catches that before it becomes product debt.",
    ],
    exampleBn: [
      "একটি revision request form দেখতে simple হতে পারে, কিন্তু label missing থাকলে, submit button keyboard দিয়ে reachable না হলে, আর error message শুধু লাল text হলে অনেক learner task fail করবে। Accessibility audit product debt হওয়ার আগেই সেটা ধরে।",
    ],
    mistakesEn: [
      "Using div elements as buttons without keyboard support",
      "Adding ARIA labels while ignoring missing native semantics",
      "Showing errors only with color",
      "Testing only with a mouse and a large screen",
    ],
    mistakesBn: [
      "keyboard support ছাড়া div-কে button হিসেবে ব্যবহার করা",
      "native semantics missing রেখেও শুধু ARIA label যোগ করা",
      "শুধু color দিয়ে error দেখানো",
      "শুধু mouse আর বড় screen দিয়ে test করা",
    ],
    applyEn: [
      "Create a short accessibility checklist for every feature handoff.",
      "Test one important flow using only Tab, Shift+Tab, Enter, and Escape.",
      "Use real labels and helper text instead of placeholder-only forms.",
      "Treat accessibility issues as product defects, not visual polish requests.",
    ],
    applyBn: [
      "প্রতিটি feature handoff-এর জন্য ছোট accessibility checklist বানান।",
      "শুধু Tab, Shift+Tab, Enter, আর Escape দিয়ে একটি important flow test করুন।",
      "placeholder-only form না করে real label আর helper text ব্যবহার করুন।",
      "accessibility issue-কে visual polish request না ভেবে product defect হিসেবে ধরুন।",
    ],
    assignmentEn: [
      "Audit one existing LMS screen and list at least 10 accessibility findings.",
      "Fix at least 5 of those findings in your implementation or prototype.",
      "Record keyboard flow before and after the fixes.",
      "Submit screenshots, a short checklist, and a note on which issues remain.",
    ],
    assignmentBn: [
      "existing LMS-এর একটি screen audit করে কমপক্ষে ১০টি accessibility finding লিখুন।",
      "implementation বা prototype-এ অন্তত ৫টি finding fix করুন।",
      "fix-এর আগে আর পরে keyboard flow record করুন।",
      "screenshot, ছোট checklist, আর কোন issue বাকি আছে তার note submit করুন।",
    ],
    quickCheckEn: [
      "Can a keyboard-only user reach every action in order?",
      "Does every input have a real label, not only placeholder text?",
      "Will status and errors still make sense without color alone?",
    ],
    quickCheckBn: [
      "keyboard-only user কি order মেনে সব action-এ পৌঁছাতে পারে?",
      "প্রতিটি input-এর কি real label আছে, শুধু placeholder না?",
      "শুধু color ছাড়া status আর error কি এখনো বোঝা যায়?",
    ],
    summaryEn: [
      "Accessibility is part of release quality, not a late add-on.",
      "Semantic structure, keyboard flow, and clear feedback catch the most common failures.",
      "A repeatable audit habit helps every learner, especially beginners and assistive-tech users.",
    ],
    summaryBn: [
      "Accessibility release quality-এর অংশ, late add-on না।",
      "semantic structure, keyboard flow, আর clear feedback সবচেয়ে common failure ধরতে সাহায্য করে।",
      "repeatable audit habit beginner আর assistive-tech user-সহ সব learner-কে সাহায্য করে।",
    ],
    sandpack: makeSandpack(`import React, { useState } from 'react';

export default function App() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    if (!email.includes('@')) {
      setMessage('Please enter a valid email address.');
      return;
    }
    setMessage('Review request submitted successfully.');
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 20, maxWidth: 460 }}>
      <h1>Accessibility Audit Demo</h1>
      <p>Try this form with keyboard only and inspect the labels, focus, and feedback.</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor='email'>Email for reviewer updates</label>
        <input
          id='email'
          type='email'
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          style={{ display: 'block', width: '100%', marginTop: 8, marginBottom: 12, padding: 8 }}
        />

        <button type='submit'>Submit review request</button>
      </form>

      <p aria-live='polite' style={{ marginTop: 16 }}>
        {message}
      </p>
    </div>
  );
}`),
    resources: a11yResources,
  }),
  "fe-6-3": academicLesson({
    titleEn: "Event Tracking & Monitoring",
    titleBn: "ইভেন্ট ট্র্যাকিং ও মনিটরিং",
    introEn: [
      "When a production app fails silently, teams guess instead of learning.",
      "Event tracking tells us what users are doing. Monitoring tells us where the system is breaking. Together they turn product delivery into a measurable discipline instead of intuition-only debugging.",
      "This lecture teaches how to instrument a frontend so launches, adoption, failures, and confusing flows become visible to the team without adding chaos or meaningless noise.",
    ],
    introBn: [
      "Production app silently fail করলে team শেখার বদলে guess করে।",
      "Event tracking বলে user কী করছে। Monitoring বলে system কোথায় ভাঙছে। একসাথে তারা product delivery-কে intuition-only debugging না বানিয়ে measurable discipline-এ বদলে দেয়।",
      "এই lecture frontend-কে এমনভাবে instrument করা শেখায় যাতে launch, adoption, failure, আর confusing flow team-এর কাছে visible হয়, কিন্তু meaningless noise না বাড়ে।",
    ],
    learnEn: [
      "The difference between product events and technical monitoring signals",
      "How to choose events that explain learner behavior clearly",
      "How error tracking tools like Sentry support production debugging",
      "How to avoid noisy dashboards that nobody trusts",
    ],
    learnBn: [
      "product event আর technical monitoring signal-এর পার্থক্য",
      "learner behavior পরিষ্কার বোঝাতে কোন event choose করতে হয়",
      "Sentry-এর মতো error tracking tool production debugging-এ কীভাবে সাহায্য করে",
      "কীভাবে noisy dashboard এড়িয়ে useful measurement রাখা যায়",
    ],
    whatEn: [
      "Event tracking records meaningful actions such as path selected, lesson opened, task submitted, or review requested.",
      "Monitoring records system health signals such as crashes, exceptions, slow screens, and broken network requests.",
      "A good production frontend uses both. Product events explain user behavior. Monitoring explains technical pain.",
    ],
    whatBn: [
      "Event tracking meaningful action record করে, যেমন path selected, lesson opened, task submitted, বা review requested।",
      "Monitoring system health signal record করে, যেমন crash, exception, slow screen, আর broken network request।",
      "একটি ভালো production frontend দুটোই ব্যবহার করে। Product event user behavior বোঝায়। Monitoring technical pain বোঝায়।",
    ],
    whyEn: [
      "Without event tracking, a team cannot tell whether a flow is unused, confusing, or simply hidden. Without monitoring, the team knows users are unhappy but cannot see the technical reason quickly.",
      "For EquiSaaS, this matters because we need to know which lessons are opened, where members drop off, whether submissions fail, and when the UI throws production errors for real users across districts and devices.",
    ],
    whyBn: [
      "event tracking ছাড়া team বুঝতে পারে না flow unused, confusing, না simply hidden। Monitoring ছাড়া team জানে user unhappy, কিন্তু technical reason দ্রুত দেখতে পারে না।",
      "EquiSaaS-এর জন্য এটি গুরুত্বপূর্ণ, কারণ কোন lesson খোলা হচ্ছে, কোথায় member drop off করছে, submission fail হচ্ছে কি না, আর কোন device-এ production error হচ্ছে তা জানা দরকার।",
    ],
    thinkEn: [
      "Think of event tracking as the attendance register and monitoring as the health report. One tells you who showed up and what they tried to do. The other tells you where the system got sick.",
    ],
    thinkBn: [
      "Event tracking-কে attendance register আর monitoring-কে health report-এর মতো ভাবুন। একটি বলে কে এসেছে আর কী করতে চেয়েছে। আরেকটি বলে system কোথায় অসুস্থ হয়েছে।",
    ],
    stepsEn: [
      "Start with the most important product questions you want answered.",
      "Define a small set of named events with consistent properties.",
      "Instrument the UI at the exact user actions that matter.",
      "Add error monitoring to capture exceptions and context.",
      "Review dashboards or logs to remove noisy or duplicate events.",
      "Use findings to improve product flow, not only to create reports.",
    ],
    stepsBn: [
      "প্রথমে কোন product question-এর উত্তর দরকার তা ঠিক করুন।",
      "consistent property-সহ ছোট একটি named event set define করুন।",
      "যে exact user action matter করে সেখানে UI instrument করুন।",
      "exception আর context capture করতে error monitoring যোগ করুন।",
      "noisy বা duplicate event বাদ দিতে dashboard বা log review করুন।",
      "finding-গুলো শুধু report বানাতে নয়, product flow improve করতে ব্যবহার করুন।",
    ],
    conceptsEn: [
      "**Event schema** defines event name and properties clearly.",
      "**Instrumentation** means adding the actual tracking code to the UI.",
      "**Error context** includes route, user action, and app state around a failure.",
      "**Signal-to-noise ratio** decides whether analytics remains trustworthy.",
      "**Observability** is the habit of making user flow and system health visible.",
    ],
    conceptsBn: [
      "**Event schema** event name আর property clearভাবে define করে।",
      "**Instrumentation** মানে UI-তে actual tracking code যোগ করা।",
      "**Error context** failure-এর সময় route, user action, আর app state বোঝায়।",
      "**Signal-to-noise ratio** analytics trustworthy থাকবে কি না তা ঠিক করে।",
      "**Observability** হলো user flow আর system health visible রাখার habit।",
    ],
    whenEn: [
      "When launching a new funnel or workflow",
      "When debugging production-only frontend issues",
      "When you need evidence for product or UX decisions",
      "When a user-facing error needs fast triage and ownership",
    ],
    whenBn: [
      "যখন নতুন funnel বা workflow launch করছেন",
      "যখন production-only frontend issue debug করছেন",
      "যখন product বা UX decision-এর জন্য evidence দরকার",
      "যখন user-facing error দ্রুত triage আর ownership চায়",
    ],
    exampleEn: [
      "Suppose learners open the assignment page but few submit. Event data may show many users click into the form, but monitoring reveals a client-side validation error on one mobile layout. Without both signals, the team might wrongly blame motivation instead of the broken flow.",
    ],
    exampleBn: [
      "ধরুন learner assignment page খুলছে কিন্তু কম submit করছে। Event data দেখাতে পারে অনেক user form-এ ঢুকছে, কিন্তু monitoring বলছে এক mobile layout-এ client-side validation error হচ্ছে। দুটো signal না থাকলে team motivation-কে blame করত, broken flow-কে না।",
    ],
    mistakesEn: [
      "Tracking every click without a real product question",
      "Using inconsistent event names across screens",
      "Logging errors without route or action context",
      "Looking at dashboards without turning insight into backlog action",
    ],
    mistakesBn: [
      "real product question ছাড়া every click track করা",
      "screen জুড়ে inconsistent event name ব্যবহার করা",
      "route বা action context ছাড়া error log করা",
      "dashboard দেখে insight-কে backlog action-এ না নেওয়া",
    ],
    applyEn: [
      "Define 5 to 8 core events for your feature before implementation starts.",
      "Track only actions tied to outcomes, blockers, or key decisions.",
      "Send route, role, and feature context with important production errors.",
      "Review event dashboards with product, engineering, and support together.",
    ],
    applyBn: [
      "implementation শুরু হওয়ার আগে feature-এর জন্য ৫ থেকে ৮টি core event define করুন।",
      "শুধু outcome, blocker, বা key decision-এর সাথে সম্পর্কিত action track করুন।",
      "গুরুত্বপূর্ণ production error-এর সাথে route, role, আর feature context পাঠান।",
      "product, engineering, আর support একসাথে event dashboard review করুন।",
    ],
    assignmentEn: [
      "Choose one learner journey such as opening a lesson, submitting a task, or reviewing feedback.",
      "Design an event map with at least 6 events and the properties each event should send.",
      "Implement a simple tracking layer and one error-capture path in your demo UI.",
      "Submit the event schema, screenshots, and a note explaining which product decision this data supports.",
    ],
    assignmentBn: [
      "lesson খোলা, task submit করা, বা feedback review করার মতো একটি learner journey choose করুন।",
      "কমপক্ষে ৬টি event আর প্রতিটি event কোন property পাঠাবে তা নিয়ে event map তৈরি করুন।",
      "demo UI-তে simple tracking layer আর একটি error-capture path implement করুন।",
      "event schema, screenshot, আর এই data কোন product decision support করে তার note submit করুন।",
    ],
    quickCheckEn: [
      "Can you explain why each event exists?",
      "If an error is captured, will the team know where and why it happened?",
      "Are your dashboards focused on decisions rather than vanity counts?",
    ],
    quickCheckBn: [
      "প্রতিটি event কেন আছে তা কি explain করতে পারবেন?",
      "একটি error capture হলে team কি জানবে কোথায় আর কেন ঘটেছে?",
      "আপনার dashboard কি vanity count না দেখিয়ে decision-focused?",
    ],
    summaryEn: [
      "Event tracking explains user behavior and monitoring explains technical health.",
      "Good observability starts with clear product questions, not random logging.",
      "A production-ready frontend is measurable, debuggable, and easier to improve after launch.",
    ],
    summaryBn: [
      "Event tracking user behavior বোঝায় আর monitoring technical health বোঝায়।",
      "ভালো observability random logging দিয়ে না, clear product question দিয়ে শুরু হয়।",
      "production-ready frontend measurable, debuggable, আর launch-এর পরে improve করা সহজ হয়।",
    ],
    sandpack: makeSandpack(`import React, { useState } from 'react';

function trackEvent(name, properties) {
  return { name, properties, createdAt: new Date().toLocaleTimeString() };
}

export default function App() {
  const [events, setEvents] = useState([]);
  const [errorNote, setErrorNote] = useState('');

  function record(name, properties) {
    setEvents((current) => [trackEvent(name, properties), ...current]);
  }

  function openLesson() {
    record('lesson_opened', { locale: 'bn', pathId: 'se-frontend' });
  }

  function submitTask() {
    try {
      record('task_submit_clicked', { source: 'task-center' });
      throw new Error('Mock network timeout');
    } catch (error) {
      setErrorNote(error.message);
      record('frontend_error_captured', { route: '/tasks', message: error.message });
    }
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 20, maxWidth: 520 }}>
      <h2>Event Tracking Demo</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button onClick={openLesson}>Track lesson open</button>
        <button onClick={submitTask}>Track submit + error</button>
      </div>

      {errorNote ? <p style={{ color: '#b91c1c' }}>Latest error: {errorNote}</p> : null}

      <ul>
        {events.map((event, index) => (
          <li key={index}>
            <strong>{event.name}</strong> at {event.createdAt}
          </li>
        ))}
      </ul>
    </div>
  );
}`),
    resources: monitoringResources,
  }),
});
