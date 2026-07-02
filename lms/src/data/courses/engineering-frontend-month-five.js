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

const jestResources = [
  { labelEn: "Jest Docs", labelBn: "Jest ডকস", url: "https://jestjs.io/docs/getting-started" },
  { labelEn: "Testing Library Docs", labelBn: "Testing Library ডকস", url: "https://testing-library.com/docs/" },
  { labelEn: "React Testing Guide", labelBn: "React testing গাইড", url: "https://react.dev/learn/testing" },
];

const playwrightResources = [
  { labelEn: "Playwright Docs", labelBn: "Playwright ডকস", url: "https://playwright.dev/" },
  { labelEn: "Playwright Locators", labelBn: "Playwright locator গাইড", url: "https://playwright.dev/docs/locators" },
  { labelEn: "End-to-End Testing Guide", labelBn: "E2E testing গাইড", url: "https://playwright.dev/docs/writing-tests" },
];

const ciResources = [
  { labelEn: "GitHub Actions Docs", labelBn: "GitHub Actions ডকস", url: "https://docs.github.com/en/actions" },
  { labelEn: "Workflow Syntax", labelBn: "Workflow syntax", url: "https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions" },
  { labelEn: "CI Concepts", labelBn: "CI concept guide", url: "https://docs.github.com/en/actions/automating-builds-and-tests/about-continuous-integration" },
];

export const FRONTEND_MONTH_FIVE = {};

Object.assign(FRONTEND_MONTH_FIVE, {
  "fe-5-1": academicLesson({
    titleEn: "Unit Testing with Jest",
    titleBn: "Jest দিয়ে ইউনিট টেস্ট",
    introEn: [
      "Frontend quality does not begin at the full app level. It begins with small behaviors we can trust.",
      "Unit testing asks a simple question: if one function or one component behavior is supposed to work a certain way, can we prove it quickly and repeatedly?",
      "This lecture teaches Jest-based unit testing as a way to protect logic, reduce regression fear, and make refactoring safer for a growing community codebase.",
    ],
    introBn: [
      "Frontend quality পুরো app level থেকে শুরু হয় না। এটি ছোট ছোট trustworthy behavior থেকে শুরু হয়।",
      "Unit testing একটি সহজ প্রশ্ন করে: একটি function বা component behavior যদি নির্দিষ্টভাবে কাজ করার কথা হয়, আমরা কি সেটা দ্রুত আর repeatably প্রমাণ করতে পারি?",
      "এই lecture Jest-based unit testing-কে logic protect করা, regression fear কমানো, আর growing community codebase-এ refactor safer করার উপায় হিসেবে শেখায়।",
    ],
    learnEn: [
      "What unit testing actually protects",
      "How to choose test-worthy logic instead of testing everything blindly",
      "How assertions, mocks, and test cases work together",
      "How unit tests reduce fear during refactors",
    ],
    learnBn: [
      "unit testing আসলে কী protect করে",
      "সবকিছু blindly test না করে test-worthy logic কীভাবে choose করতে হয়",
      "assertion, mock, আর test case কীভাবে একসাথে কাজ করে",
      "unit test refactor-এর ভয় কীভাবে কমায়",
    ],
    whatEn: [
      "A unit test checks one small behavior in isolation. That may be a function, a utility, or one focused component rule.",
      "The goal is not to prove the entire product works. The goal is to prove one small rule still behaves correctly when code changes.",
      "Jest gives us the test runner and assertion system. The real skill is choosing stable, meaningful behaviors to verify.",
    ],
    whatBn: [
      "Unit test isolatedভাবে একটি ছোট behavior check করে। সেটি function, utility, বা একটি focused component rule হতে পারে।",
      "Goal পুরো product কাজ করছে তা prove করা না। Goal হলো code change হলেও একটি ছোট rule এখনো ঠিক আছে কি না তা prove করা।",
      "Jest test runner আর assertion system দেয়। আসল skill হলো stable আর meaningful behavior choose করা।",
    ],
    whyEn: [
      "Without unit tests, teams are afraid to touch existing logic. Even a small change feels risky because no fast safety check exists.",
      "EquiSaaS contains progress math, status mapping, badge logic, and UI helpers that should remain correct across many updates. Unit tests help us protect those rules cheaply.",
    ],
    whyBn: [
      "unit test না থাকলে team existing logic touch করতে ভয় পায়। ছোট change-ও risky লাগে, কারণ fast safety check থাকে না।",
      "EquiSaaS-এ progress math, status mapping, badge logic, আর UI helper আছে যেগুলো অনেক update জুড়ে correct থাকা উচিত। Unit test কম খরচে এই rule protect করে।",
    ],
    thinkEn: [
      "Think of unit tests like checking one machine part on a workbench. You are not testing the whole factory. You are making sure one critical part still does its job before it goes back into the system.",
    ],
    thinkBn: [
      "Unit test-কে workbench-এ এক machine part check করার মতো ভাবুন। পুরো factory test করছেন না। আপনি শুধু দেখছেন একটি critical part system-এ ফেরার আগে এখনো ঠিক কাজ করছে কি না।",
    ],
    stepsEn: [
      "Identify a small behavior that must always stay correct.",
      "Write a test case that describes the expected input and output clearly.",
      "Run the code through Jest and assert the result.",
      "Add more cases for edge behavior when needed.",
      "Use mocks only when isolation truly requires it.",
      "Keep tests readable so they teach the next contributor what the rule is.",
    ],
    stepsBn: [
      "একটি ছোট behavior identify করুন যেটা সবসময় correct থাকতে হবে।",
      "expected input আর output clearভাবে describe করে test case লিখুন।",
      "Jest দিয়ে code run করে result assert করুন।",
      "দরকার হলে edge behavior-এর জন্য আরও case যোগ করুন।",
      "Isolation সত্যিই দরকার হলে তবেই mock ব্যবহার করুন।",
      "Test readable রাখুন, যাতে পরের contributor rule-টা শিখতে পারে।",
    ],
    conceptsEn: [
      "**Test case** describes one expected behavior.",
      "**Assertion** checks whether the result matches expectation.",
      "**Mock** replaces an external dependency for isolation.",
      "**Regression protection** means catching old behavior breakage early.",
      "**Readable tests** are documentation as well as safety checks.",
    ],
    conceptsBn: [
      "**Test case** একটি expected behavior describe করে।",
      "**Assertion** result expectation-এর সাথে মিলে কি না check করে।",
      "**Mock** isolation-এর জন্য external dependency replace করে।",
      "**Regression protection** মানে old behavior breakage early ধরা।",
      "**Readable test** documentation-ও, safety check-ও।",
    ],
    whenEn: [
      "When a utility or mapping function controls important behavior",
      "When logic is small but business-critical",
      "When refactoring would feel risky without proof",
      "When repeated manual checking wastes time",
    ],
    whenBn: [
      "যখন utility বা mapping function গুরুত্বপূর্ণ behavior control করে",
      "যখন logic ছোট কিন্তু business-critical",
      "যখন proof ছাড়া refactor risky লাগে",
      "যখন repeated manual checking সময় নষ্ট করে",
    ],
    exampleEn: [
      "A task-status helper that maps raw backend states into learner-friendly labels is a great unit-test target. If the mapping breaks, the UI becomes confusing even if the page still renders.",
    ],
    exampleBn: [
      "Raw backend state-কে learner-friendly label-এ map করা task-status helper unit-test-এর জন্য দারুণ target। Mapping break হলে page render করলেও UI confusing হয়ে যায়।",
    ],
    mistakesEn: [
      "Testing implementation details instead of stable behavior",
      "Writing brittle tests that break on harmless refactors",
      "Using too many mocks for simple logic",
      "Treating test files like noise instead of readable product rules",
    ],
    mistakesBn: [
      "stable behavior-এর বদলে implementation detail test করা",
      "harmless refactor-এও break করে এমন brittle test লেখা",
      "simple logic-এ অতিরিক্ত mock ব্যবহার করা",
      "test file-কে readable product rule না ভেবে noise মনে করা",
    ],
    applyEn: [
      "Pick one helper or status function from a real feature",
      "Write the expected inputs and outputs before writing the test",
      "Add at least one edge case",
      "Review whether another beginner could understand the rule by reading the test",
    ],
    applyBn: [
      "একটি real feature থেকে helper বা status function নিন",
      "test লেখার আগে expected input আর output লিখুন",
      "কমপক্ষে একটি edge case যোগ করুন",
      "আরেক beginner test পড়ে rule বুঝতে পারছে কি না review করুন",
    ],
    assignmentEn: [
      "Write unit tests for a helper that converts task progress into a badge label and color",
      "Cover normal, edge, and invalid cases",
      "Submit code or screenshot plus a note explaining why this logic deserves unit tests",
      "Evaluation focus: behavior clarity, useful assertions, edge-case thinking, and readability",
    ],
    assignmentBn: [
      "task progress-কে badge label আর color-এ convert করে এমন helper-এর জন্য unit test লিখুন",
      "normal, edge, আর invalid case cover করুন",
      "Code বা screenshot submit করুন, সাথে লিখুন কেন এই logic unit test deserve করে",
      "Evaluation focus: behavior clarity, useful assertion, edge-case thinking, আর readability",
    ],
    quickCheckEn: [
      "Can you explain what makes a behavior a good unit-test target?",
      "Can you say why testing implementation details is risky?",
      "Can you describe the difference between one normal case and one edge case?",
      "Can you explain how unit tests help refactoring?",
    ],
    quickCheckBn: [
      "কোন behavior unit-test target হওয়ার যোগ্য তা explain করতে পারবেন?",
      "implementation detail test করা risky কেন তা বলতে পারবেন?",
      "normal case আর edge case-এর পার্থক্য describe করতে পারবেন?",
      "unit test refactoring-এ কীভাবে সাহায্য করে তা explain করতে পারবেন?",
    ],
    summaryEn: [
      "Unit tests protect small but critical rules",
      "Jest helps automate fast feedback for logic behavior",
      "Readable tests reduce regression fear and teach future contributors",
      "Good unit testing is selective, meaningful, and stable",
    ],
    summaryBn: [
      "Unit test ছোট কিন্তু critical rule protect করে",
      "Jest logic behavior-এর জন্য fast feedback automate করতে সাহায্য করে",
      "Readable test regression fear কমায় আর future contributor-কে শেখায়",
      "ভালো unit testing selective, meaningful, আর stable হয়",
    ],
    sandpack: makeSandpack(`function getTaskBadge(progress) {
  if (progress >= 100) return { label: "Completed", color: "green" };
  if (progress >= 50) return { label: "In Progress", color: "blue" };
  if (progress >= 0) return { label: "Just Started", color: "gray" };
  return { label: "Invalid", color: "red" };
}

const testCases = [
  { input: 100, expected: "Completed" },
  { input: 60, expected: "In Progress" },
  { input: 10, expected: "Just Started" },
  { input: -1, expected: "Invalid" },
];

export default function App() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: 20 }}>
      <h2>Unit Test Mental Model</h2>
      <ul>
        {testCases.map((test) => {
          const result = getTaskBadge(test.input);
          const passed = result.label === test.expected;
          return (
            <li key={String(test.input)} style={{ color: passed ? "#15803d" : "#b91c1c", marginBottom: 8 }}>
              input {test.input} => {result.label} {passed ? "PASS" : "FAIL"}
            </li>
          );
        })}
      </ul>
    </div>
  );
}`),
    resources: jestResources,
  }),
  "fe-5-2": academicLesson({
    titleEn: "E2E Testing with Playwright",
    titleBn: "Playwright দিয়ে E2E টেস্ট",
    introEn: [
      "Unit tests protect small rules, but users experience the full journey. End-to-end testing helps us verify that journey.",
      "A learner does not care whether one helper function passed. They care whether they can sign in, open a lesson, submit a task, and see the right result. That is the world of E2E testing.",
      "This lecture teaches Playwright as a way to simulate realistic user behavior across the actual interface.",
    ],
    introBn: [
      "Unit test ছোট rule protect করে, কিন্তু user পুরো journey experience করে। End-to-end testing সেই journey verify করতে সাহায্য করে।",
      "learner-এর কাছে helper function pass করল কি না গুরুত্বপূর্ণ না। তার কাছে গুরুত্বপূর্ণ হলো sign in, lesson open, task submit, আর right result দেখা। এটাই E2E testing-এর জগৎ।",
      "এই lecture Playwright-কে realistic user behavior actual interface জুড়ে simulate করার tool হিসেবে শেখায়।",
    ],
    learnEn: [
      "What E2E tests prove that unit tests cannot",
      "How to write journey-based tests around real user actions",
      "How selectors, assertions, and stable flows work in Playwright",
      "How to choose a few high-value flows instead of trying to test everything",
    ],
    learnBn: [
      "E2E test কী prove করে যা unit test পারে না",
      "real user action ঘিরে journey-based test কীভাবে লিখতে হয়",
      "Playwright-এ selector, assertion, আর stable flow কীভাবে কাজ করে",
      "সবকিছু test না করে high-value flow কীভাবে choose করতে হয়",
    ],
    whatEn: [
      "An E2E test opens the product like a user would, interacts with visible elements, and checks whether the journey succeeds.",
      "Playwright is strong because it controls a real browser. That means we are testing the interface, not only the internal code shape.",
      "The goal is not to automate every click in the app. The goal is to protect the few journeys that would seriously harm trust if they broke.",
    ],
    whatBn: [
      "E2E test product-কে user-এর মতো open করে, visible element-এর সাথে interact করে, আর journey succeed করছে কি না check করে।",
      "Playwright শক্তিশালী কারণ এটি real browser control করে। মানে আমরা শুধু internal code shape না, actual interface test করছি।",
      "Goal app-এর প্রতিটি click automate করা না। Goal হলো সেই কয়েকটি journey protect করা যেগুলো break হলে trust মারাত্মকভাবে ক্ষতিগ্রস্ত হবে।",
    ],
    whyEn: [
      "Many regressions happen between components, routes, data loading, and forms. Unit tests may all pass while the real user journey still breaks.",
      "EquiSaaS needs trust in sign-in, lesson opening, task submission, and governance actions. Those are high-value flows worth E2E protection.",
    ],
    whyBn: [
      "অনেক regression component, route, data loading, আর form-এর মাঝের integration point-এ ঘটে। সব unit test pass করলেও real user journey break হতে পারে।",
      "EquiSaaS-এ sign-in, lesson open, task submission, আর governance action trusted হওয়া দরকার। এগুলো E2E protection-এর যোগ্য high-value flow।",
    ],
    thinkEn: [
      "Think of E2E testing like sending a real customer through the front door. You are not checking one internal screw. You are checking whether the whole experience still works from start to finish.",
    ],
    thinkBn: [
      "E2E testing-কে front door দিয়ে real customer পাঠানোর মতো ভাবুন। আপনি internal screw দেখছেন না; শুরু থেকে শেষ পর্যন্ত পুরো experience কাজ করছে কি না দেখছেন।",
    ],
    stepsEn: [
      "Choose one high-value user journey.",
      "Write the visible steps the user takes from start to finish.",
      "Use stable selectors and readable assertions.",
      "Keep test data controlled so the journey stays reproducible.",
      "Prefer a few critical flows over many weak flows.",
      "Review flaky behavior immediately because unstable tests lose trust fast.",
    ],
    stepsBn: [
      "একটি high-value user journey choose করুন।",
      "শুরু থেকে শেষ পর্যন্ত user কী visible step নেয় তা লিখুন।",
      "stable selector আর readable assertion ব্যবহার করুন।",
      "Journey reproducible রাখতে test data controlled রাখুন।",
      "অনেক দুর্বল flow-এর বদলে কয়েকটি critical flow protect করুন।",
      "flaky behavior দ্রুত ঠিক করুন, কারণ unstable test দ্রুত trust হারায়।",
    ],
    conceptsEn: [
      "**Journey test** covers a realistic path through the app.",
      "**Selector stability** matters for reliable automation.",
      "**Assertion** checks the visible expected outcome.",
      "**Flaky test** is a test that fails inconsistently and damages trust.",
      "**Critical flow** is a user journey the product cannot afford to break.",
    ],
    conceptsBn: [
      "**Journey test** app-এর realistic path cover করে।",
      "**Selector stability** reliable automation-এর জন্য জরুরি।",
      "**Assertion** visible expected outcome check করে।",
      "**Flaky test** inconsistent fail করে আর trust নষ্ট করে।",
      "**Critical flow** হলো এমন user journey যেটা product break করতে পারে না।",
    ],
    whenEn: [
      "When a user journey crosses many layers of the app",
      "When trust depends on forms, routing, and state working together",
      "When manual testing is repeated too often",
      "When a broken journey would be costly to users or the team",
    ],
    whenBn: [
      "যখন user journey app-এর বহু layer পেরোয়",
      "যখন trust form, routing, আর state একসাথে কাজ করার ওপর depend করে",
      "যখন manual testing বারবার করতে হয়",
      "যখন broken journey user বা team-এর জন্য costly হবে",
    ],
    exampleEn: [
      "A Playwright flow might log in as a learner, open the task center, choose a task, fill the submission form, and verify that the review status becomes visible.",
    ],
    exampleBn: [
      "একটি Playwright flow learner হিসেবে log in করতে পারে, task center open করতে পারে, task choose করতে পারে, submission form fill করতে পারে, আর review status visible হয়েছে কি না verify করতে পারে।",
    ],
    mistakesEn: [
      "Trying to cover every possible path with E2E tests",
      "Using fragile selectors tied to temporary markup details",
      "Keeping flaky tests instead of fixing them",
      "Testing low-value flows while critical flows remain unprotected",
    ],
    mistakesBn: [
      "প্রতিটি possible path E2E test দিয়ে cover করতে চাওয়া",
      "temporary markup detail-এ tied fragile selector ব্যবহার করা",
      "flaky test fix না করে রেখে দেওয়া",
      "critical flow unprotected রেখে low-value flow test করা",
    ],
    applyEn: [
      "List the top three trust-critical journeys in the product",
      "Start with the smallest one that still crosses multiple layers",
      "Write steps in user language before writing automation code",
      "Review whether the test still reads like a user story",
    ],
    applyBn: [
      "product-এর top তিনটি trust-critical journey list করুন",
      "multiple layer cross করে এমন সবচেয়ে ছোট flow দিয়ে শুরু করুন",
      "automation code-এর আগে user language-এ step লিখুন",
      "Review করুন test এখনো user story-এর মতো পড়া যায় কি না",
    ],
    assignmentEn: [
      "Design one Playwright test for the learner task-submission journey",
      "Include login, navigation, form fill, submit, and success or review-status check",
      "Submit test code, pseudocode, or a step diagram plus one note about selector strategy",
      "Evaluation focus: flow choice, user realism, selector quality, and stability thinking",
    ],
    assignmentBn: [
      "learner task-submission journey-এর জন্য একটি Playwright test design করুন",
      "login, navigation, form fill, submit, আর success বা review-status check include করুন",
      "test code, pseudocode, বা step diagram submit করুন, সাথে selector strategy নিয়ে note দিন",
      "Evaluation focus: flow choice, user realism, selector quality, আর stability thinking",
    ],
    quickCheckEn: [
      "Can you explain what E2E tests protect that unit tests do not?",
      "Can you identify one critical flow worth automating?",
      "Can you explain why flaky tests are dangerous?",
      "Can you describe what makes a selector stable?",
    ],
    quickCheckBn: [
      "E2E test কী protect করে যা unit test করে না তা explain করতে পারবেন?",
      "একটি automate করার মতো critical flow identify করতে পারবেন?",
      "flaky test dangerous কেন তা explain করতে পারবেন?",
      "stable selector কেমন হওয়া উচিত তা describe করতে পারবেন?",
    ],
    summaryEn: [
      "E2E tests protect real user journeys across the full app",
      "Playwright verifies visible behavior in a real browser",
      "A few stable critical flows are better than many shallow tests",
      "Quality means protecting what the user actually experiences",
    ],
    summaryBn: [
      "E2E test পুরো app জুড়ে real user journey protect করে",
      "Playwright real browser-এ visible behavior verify করে",
      "অনেক shallow test-এর চেয়ে কিছু stable critical flow ভালো",
      "Quality মানে user আসলে যা experience করে সেটাকে protect করা",
    ],
    sandpack: makeSandpack(`const journey = [
  "Open login page",
  "Enter email and password",
  "Navigate to Task Center",
  "Choose one task",
  "Fill submission form",
  "Click submit",
  "Verify review status appears",
];

export default function App() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: 20 }}>
      <h2>E2E Journey Map</h2>
      <ol>
        {journey.map((step) => (
          <li key={step} style={{ marginBottom: 8 }}>{step}</li>
        ))}
      </ol>
      <p style={{ color: "#475569" }}>This is the mental model of one Playwright flow: protect a real learner journey, not every possible click.</p>
    </div>
  );
}`),
    resources: playwrightResources,
  }),
  "fe-5-3": academicLesson({
    titleEn: "GitHub Actions CI Pipeline",
    titleBn: "GitHub Actions CI পাইপলাইন",
    introEn: [
      "A codebase becomes trustworthy when quality checks run the same way for everyone, not only on one developer’s laptop.",
      "Continuous Integration means the project automatically tests, builds, and validates changes before they are merged. This turns quality from a personal habit into a team rule.",
      "This lecture teaches GitHub Actions as the automation layer that keeps frontend work reviewable, repeatable, and harder to accidentally break.",
    ],
    introBn: [
      "Codebase trustworthy হয় তখনই, যখন quality check সবার জন্য একইভাবে run করে, শুধু একজন developer-এর laptop-এ না।",
      "Continuous Integration মানে project merge হওয়ার আগে change-কে automatically test, build, আর validate করা। এতে quality personal habit থেকে team rule-এ রূপ নেয়।",
      "এই lecture GitHub Actions-কে সেই automation layer হিসেবে শেখায়, যা frontend work-কে reviewable, repeatable, আর accidentally break করা কঠিন করে।",
    ],
    learnEn: [
      "What CI protects at the team level",
      "How a workflow turns build and test steps into merge gates",
      "How to think about pipeline stages for frontend work",
      "Why automation reduces human forgetfulness and review risk",
    ],
    learnBn: [
      "team level-এ CI কী protect করে",
      "workflow কীভাবে build আর test step-কে merge gate-এ রূপ দেয়",
      "frontend work-এর জন্য pipeline stage কীভাবে ভাবতে হয়",
      "automation human forgetfulness আর review risk কীভাবে কমায়",
    ],
    whatEn: [
      "A CI pipeline is an automated sequence that runs checks when code changes are pushed or proposed for merge.",
      "For a frontend project, those checks often include install, lint, test, build, and sometimes deployment previews.",
      "GitHub Actions provides workflow files that describe when those checks run and what they execute.",
    ],
    whatBn: [
      "CI pipeline হলো automated sequence, যা code change push বা merge proposal-এর সময় check run করে।",
      "Frontend project-এর ক্ষেত্রে এই check-এ install, lint, test, build, আর কখনো deployment preview থাকতে পারে।",
      "GitHub Actions workflow file দিয়ে বলে দেয় কখন check run হবে আর কী execute হবে।",
    ],
    whyEn: [
      "Without CI, quality depends on memory. Someone forgets to run tests, misses a build failure, or merges a change that breaks the app for everyone else.",
      "EquiSaaS is a collaborative learning product. As more contributors join, automated guardrails become more important than personal intention alone.",
    ],
    whyBn: [
      "CI ছাড়া quality memory-এর ওপর নির্ভর করে। কেউ test run করতে ভুলে যায়, build failure miss করে, বা এমন change merge করে যা app সবার জন্য break করে।",
      "EquiSaaS collaborative learning product। যত contributor বাড়বে, personal intention-এর চেয়ে automated guardrail বেশি গুরুত্বপূর্ণ হবে।",
    ],
    thinkEn: [
      "Think of CI like the security gate at an airport. Everyone goes through the same checks before entering the next zone. That consistency is what creates trust.",
    ],
    thinkBn: [
      "CI-কে airport security gate ভাবুন। পরের zone-এ যাওয়ার আগে সবাই একই check-এর ভেতর দিয়ে যায়। এই consistency-ই trust তৈরি করে।",
    ],
    stepsEn: [
      "List the checks the project should never skip.",
      "Arrange them into a simple pipeline: install, validate, test, build.",
      "Trigger the workflow on pull requests and important branch updates.",
      "Keep logs readable so failures teach the contributor what went wrong.",
      "Add stricter gates only when the team can actually maintain them.",
      "Treat a failed pipeline as a merge blocker until the issue is understood.",
    ],
    stepsBn: [
      "project কোন check কখনো skip করা যাবে না তা list করুন।",
      "এগুলোকে simple pipeline-এ সাজান: install, validate, test, build।",
      "pull request আর গুরুত্বপূর্ণ branch update-এ workflow trigger করুন।",
      "log readable রাখুন, যাতে failure contributor-কে কী ভুল হয়েছে শেখাতে পারে।",
      "team maintain করতে পারবে এমন stricter gate-ই যোগ করুন।",
      "pipeline fail হলে issue বুঝে ঠিক না করা পর্যন্ত merge blocker হিসেবে ধরুন।",
    ],
    conceptsEn: [
      "**Workflow** defines the automation steps.",
      "**Job** is one grouped set of tasks inside the workflow.",
      "**Step** is one command or action inside a job.",
      "**Merge gate** blocks unsafe code from being merged.",
      "**Repeatability** means the same checks run for every contributor.",
    ],
    conceptsBn: [
      "**Workflow** automation step define করে।",
      "**Job** workflow-এর ভেতরে grouped task set।",
      "**Step** job-এর ভেতরে একটি command বা action।",
      "**Merge gate** unsafe code merge হওয়া ঠেকায়।",
      "**Repeatability** মানে প্রতিটি contributor-এর জন্য একই check run হবে।",
    ],
    whenEn: [
      "When multiple people contribute to the same branch or repo",
      "When tests and builds should gate merges",
      "When review quality depends on reliable automation",
      "When manual checking is too easy to forget",
    ],
    whenBn: [
      "যখন অনেক মানুষ একই branch বা repo-তে contribute করে",
      "যখন test আর build merge gate হওয়া উচিত",
      "যখন review quality reliable automation-এর ওপর নির্ভর করে",
      "যখন manual checking ভুলে যাওয়া খুব সহজ",
    ],
    exampleEn: [
      "A frontend CI workflow may install dependencies, run unit tests, run a build, and fail the pull request if any step breaks. This gives reviewers confidence that the branch is at least technically viable.",
    ],
    exampleBn: [
      "Frontend CI workflow dependency install করতে পারে, unit test চালাতে পারে, build run করতে পারে, আর কোনো step break হলে pull request fail করতে পারে। এতে reviewer বুঝতে পারে branch অন্তত technically viable।",
    ],
    mistakesEn: [
      "Creating a pipeline no one maintains",
      "Adding too many checks too early",
      "Ignoring pipeline failures as if they were optional",
      "Writing unreadable workflows that contributors cannot learn from",
    ],
    mistakesBn: [
      "এমন pipeline বানানো যেটা কেউ maintain করে না",
      "খুব তাড়াতাড়ি অতিরিক্ত check যোগ করা",
      "pipeline failure-কে optional মনে করে ignore করা",
      "এমন workflow লেখা যেটা contributor পড়ে শিখতে পারে না",
    ],
    applyEn: [
      "List your must-pass checks before writing YAML",
      "Start with one simple workflow that the team can trust",
      "Write failure messages that point to the likely problem",
      "Review whether the pipeline protects real risk or only creates noise",
    ],
    applyBn: [
      "YAML লেখার আগে must-pass check list করুন",
      "team trust করতে পারে এমন একটি simple workflow দিয়ে শুরু করুন",
      "failure message এমন লিখুন যাতে likely problem বুঝা যায়",
      "pipeline আসল risk protect করছে নাকি শুধু noise তৈরি করছে তা review করুন",
    ],
    assignmentEn: [
      "Design a GitHub Actions workflow for a frontend pull request",
      "Include install, test, and build stages",
      "Explain when the workflow runs and why each stage matters",
      "Submit YAML, pseudocode, or a pipeline diagram plus a short note on merge protection",
      "Evaluation focus: clarity, sequence logic, team usefulness, and guardrail thinking",
    ],
    assignmentBn: [
      "frontend pull request-এর জন্য GitHub Actions workflow design করুন",
      "install, test, আর build stage include করুন",
      "workflow কখন run করবে আর প্রতিটি stage কেন জরুরি তা explain করুন",
      "YAML, pseudocode, বা pipeline diagram submit করুন, সাথে merge protection note দিন",
      "Evaluation focus: clarity, sequence logic, team usefulness, আর guardrail thinking",
    ],
    quickCheckEn: [
      "Can you explain why CI is more than just automation for automation’s sake?",
      "Can you describe what a merge gate protects?",
      "Can you name one failure that CI should catch before review approval?",
      "Can you explain why repeatability matters in a community codebase?",
    ],
    quickCheckBn: [
      "CI শুধু automation-এর জন্য automation না কেন তা explain করতে পারবেন?",
      "merge gate কী protect করে তা describe করতে পারবেন?",
      "review approval-এর আগে CI কোন একটি failure catch করা উচিত তা বলতে পারবেন?",
      "community codebase-এ repeatability কেন জরুরি তা explain করতে পারবেন?",
    ],
    summaryEn: [
      "CI turns quality checks into shared team rules",
      "GitHub Actions makes install, test, and build steps repeatable",
      "A good pipeline blocks unsafe merges without becoming noisy",
      "Automation strengthens trust when many contributors are learning and shipping together",
    ],
    summaryBn: [
      "CI quality check-কে shared team rule-এ রূপ দেয়",
      "GitHub Actions install, test, আর build step-কে repeatable করে",
      "ভালো pipeline unsafe merge block করে কিন্তু noisy হয় না",
      "অনেক contributor একসাথে শিখে আর ship করলে automation trust বাড়ায়",
    ],
    sandpack: makeSandpack(`const workflowSteps = [
  "Install dependencies",
  "Run unit tests",
  "Build the frontend",
  "Report success or failure back to the pull request",
];

const workflowYaml = [
  "name: frontend-ci",
  "on: [pull_request]",
  "jobs:",
  "  verify:",
  "    runs-on: ubuntu-latest",
  "    steps:",
  "      - checkout",
  "      - install",
  "      - test",
  "      - build",
].join("\\n");

export default function App() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: 20 }}>
      <h2>CI Pipeline Shape</h2>
      <ol>
        {workflowSteps.map((step) => (
          <li key={step} style={{ marginBottom: 8 }}>{step}</li>
        ))}
      </ol>
      <pre style={{ background: "#0f172a", color: "#e2e8f0", padding: 16, borderRadius: 16 }}>{workflowYaml}</pre>
    </div>
  );
}`),
    resources: ciResources,
  }),
});
