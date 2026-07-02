import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PATHS } from "../src/data/structure.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.join(__dirname, "..", "roadmaps-template.json");

const urls = {
  mdnHtml: "https://developer.mozilla.org/en-US/docs/Learn/HTML",
  mdnCss: "https://developer.mozilla.org/en-US/docs/Learn/CSS/Styling_boxes",
  mdnJs: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
  reactLearn: "https://react.dev/learn",
  nextAppRouter: "https://nextjs.org/learn/dashboard-app",
  reduxToolkit: "https://redux-toolkit.js.org/usage/usage-guide",
  expressRouting: "https://expressjs.com/en/starter/basic-routing.html",
  jwtIntro: "https://jwt.io/introduction/",
  laravelAuth: "https://laravel.com/docs/11.x/authorization",
  awsTenantIsolation: "https://docs.aws.amazon.com/whitepapers/latest/saas-architecture-fundamentals/tenant-isolation.html",
  laravelQueues: "https://laravel.com/docs/11.x/queues",
  owaspLogging: "https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html",
  githubActions: "https://docs.github.com/en/actions/",
  testPyramid: "https://martinfowler.com/articles/practical-test-pyramid.html",
  sreMonitoring: "https://sre.google/sre-book/monitoring-distributed-systems/",
  dhsUserResearch: "https://www.dhs.gov/cx/learning-trainings/cx-learning/basics-of-user-research",
  yaleJourney: "https://usability.yale.edu/understanding-your-user/user-journey-maps",
  digitalGovIA: "https://digital.gov/topics/information-architecture",
  figmaAutoLayout: "https://help.figma.com/hc/en-us/articles/360040451373-Guide-to-auto-layout",
  figmaBeginner: "https://help.figma.com/hc/en-us/articles/30848209492887-Course-overview-Figma-Design-for-beginners-2025",
  materialColor: "https://m1.material.io/style/color.html",
  canvaDesignBasics: "https://www.youtube.com/watch?v=YSE3X70BFn4",
  atlassianRoadmap: "https://www.atlassian.com/agile/product-management/product-roadmaps",
  atlassianOKR: "https://www.atlassian.com/team-playbook/plays/okr",
  atlassianUserStories: "https://www.youtube.com/watch?v=MQzS30PtsiM",
  commsJourney: "https://www.communications.gov.uk/guidance/external-affairs/customer-journey-mapping/",
  hubspotDigitalMarketing: "https://academy.hubspot.com/courses/digital-marketing",
  hubspotAds: "https://academy.hubspot.com/courses/digital-advertising",
  hubspotInbound: "https://academy.hubspot.com/courses/inbound",
  gaLearn: "https://developers.google.com/analytics/learn",
  seoStarter: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide",
  hubspotServiceHub: "https://academy.hubspot.com/courses/service-hub-software",
  hubspotFreeTools: "https://academy.hubspot.com/courses/hubspot-free-tools",
  hubspotSupport: "https://academy.hubspot.com/courses/customer-support",
  scrumGuideDownload: "https://scrumguides.org/download.html"
};

const bn = {
  learnWithSumit: "https://learnwithsumit.com/",
  studyWithAnis: "https://www.studywithanis.com/",
  stackLearner: "https://www.stacklearner.com/",
  habluProgrammer: "https://hablu-programmer.com/",
  figmaBangla: "https://www.youtube.com/watch?v=X0tTPfruEQM",
  tutorialBanglaDesign: "https://tutorialbangla.com/courses/graphic-design/",
  tutorialBanglaMarketing: "https://tutorialbangla.com/courses/digital-marketing/",
  digitalMarketingBangla: "https://www.youtube.com/watch?v=-e_EZTsmFks",
  seoBangla: "https://www.youtube.com/watch?v=or_-uu3kgc4",
  hrLimon: "https://hrlimon.com/bangla-tutorial",
  scrumGuideBn: "https://scrumguides.org/download.html",
  customerServiceFree: "https://xubisoft.com/training/professional-customer-service-course/",
  customerCareTips: "https://teachers.gov.bd/blog/details/758902",
  customerServiceGuide: "https://www.sattacademy.com/online-customer-service/"
};

const lessonLinks = {
  "fe-1-1": { resourceUrl: urls.mdnHtml, videoUrl: bn.studyWithAnis },
  "fe-1-2": { resourceUrl: urls.mdnCss, videoUrl: bn.learnWithSumit },
  "fe-1-3": { resourceUrl: urls.mdnJs, videoUrl: bn.learnWithSumit },
  "fe-2-1": { resourceUrl: urls.reactLearn, videoUrl: bn.learnWithSumit },
  "fe-2-2": { resourceUrl: urls.nextAppRouter, videoUrl: bn.stackLearner },
  "fe-2-3": { resourceUrl: urls.reduxToolkit, videoUrl: bn.habluProgrammer },

  "be-1-1": { resourceUrl: urls.expressRouting, videoUrl: bn.stackLearner },
  "be-1-2": { resourceUrl: urls.jwtIntro, videoUrl: bn.habluProgrammer },
  "be-1-3": { resourceUrl: urls.laravelAuth, videoUrl: bn.learnWithSumit },
  "be-2-1": { resourceUrl: urls.awsTenantIsolation, videoUrl: bn.stackLearner },
  "be-2-2": { resourceUrl: urls.laravelQueues, videoUrl: bn.learnWithSumit },
  "be-2-3": { resourceUrl: urls.owaspLogging, videoUrl: bn.habluProgrammer },

  "do-1-1": { resourceUrl: urls.githubActions, videoUrl: bn.stackLearner },
  "do-1-2": { resourceUrl: urls.githubActions, videoUrl: bn.stackLearner },
  "do-1-3": { resourceUrl: urls.testPyramid, videoUrl: bn.stackLearner },
  "do-2-1": { resourceUrl: urls.testPyramid, videoUrl: bn.stackLearner },
  "do-2-2": { resourceUrl: urls.owaspLogging, videoUrl: bn.stackLearner },
  "do-2-3": { resourceUrl: urls.sreMonitoring, videoUrl: bn.stackLearner },

  "ux-1-1": { resourceUrl: urls.dhsUserResearch, videoUrl: bn.figmaBangla },
  "ux-1-2": { resourceUrl: urls.yaleJourney, videoUrl: bn.figmaBangla },
  "ux-1-3": { resourceUrl: urls.digitalGovIA, videoUrl: bn.figmaBangla },
  "ux-2-1": { resourceUrl: urls.figmaAutoLayout, videoUrl: bn.figmaBangla },
  "ux-2-2": { resourceUrl: urls.figmaBeginner, videoUrl: bn.figmaBangla },
  "ux-2-3": { resourceUrl: urls.figmaBeginner, videoUrl: bn.figmaBangla },

  "bd-1-1": { resourceUrl: urls.canvaDesignBasics, videoUrl: bn.tutorialBanglaDesign },
  "bd-1-2": { resourceUrl: urls.materialColor, videoUrl: bn.tutorialBanglaDesign },
  "bd-1-3": { resourceUrl: urls.figmaAutoLayout, videoUrl: bn.tutorialBanglaDesign },
  "bd-2-1": { resourceUrl: urls.hubspotDigitalMarketing, videoUrl: bn.tutorialBanglaMarketing },
  "bd-2-2": { resourceUrl: urls.canvaDesignBasics, videoUrl: bn.tutorialBanglaDesign },
  "bd-2-3": { resourceUrl: urls.canvaDesignBasics, videoUrl: bn.tutorialBanglaDesign },

  "ba-1-1": { resourceUrl: urls.dhsUserResearch, videoUrl: bn.scrumGuideBn },
  "ba-1-2": { resourceUrl: urls.atlassianUserStories, videoUrl: bn.scrumGuideBn },
  "ba-1-3": { resourceUrl: urls.atlassianRoadmap, videoUrl: bn.scrumGuideBn },
  "ba-2-1": { resourceUrl: urls.commsJourney, videoUrl: bn.scrumGuideBn },
  "ba-2-2": { resourceUrl: urls.atlassianOKR, videoUrl: bn.scrumGuideBn },
  "ba-2-3": { resourceUrl: urls.gaLearn, videoUrl: bn.scrumGuideBn },

  "pm-1-1": { resourceUrl: urls.atlassianRoadmap, videoUrl: bn.scrumGuideBn },
  "pm-1-2": { resourceUrl: urls.atlassianOKR, videoUrl: bn.scrumGuideBn },
  "pm-1-3": { resourceUrl: urls.atlassianRoadmap, videoUrl: bn.scrumGuideBn },
  "pm-2-1": { resourceUrl: urls.scrumGuideDownload, videoUrl: bn.scrumGuideBn },
  "pm-2-2": { resourceUrl: urls.hubspotDigitalMarketing, videoUrl: bn.scrumGuideBn },
  "pm-2-3": { resourceUrl: urls.testPyramid, videoUrl: bn.scrumGuideBn },

  "mk-1-1": { resourceUrl: urls.seoStarter, videoUrl: bn.seoBangla },
  "mk-1-2": { resourceUrl: urls.hubspotDigitalMarketing, videoUrl: bn.digitalMarketingBangla },
  "mk-1-3": { resourceUrl: urls.hubspotInbound, videoUrl: bn.digitalMarketingBangla },
  "mk-2-1": { resourceUrl: urls.hubspotAds, videoUrl: bn.digitalMarketingBangla },
  "mk-2-2": { resourceUrl: urls.hubspotAds, videoUrl: bn.digitalMarketingBangla },
  "mk-2-3": { resourceUrl: urls.gaLearn, videoUrl: bn.tutorialBanglaMarketing },

  "cs-1-1": { resourceUrl: urls.hubspotServiceHub, videoUrl: bn.customerServiceFree },
  "cs-1-2": { resourceUrl: urls.hubspotFreeTools, videoUrl: bn.customerServiceGuide },
  "cs-1-3": { resourceUrl: urls.hubspotSupport, videoUrl: bn.customerCareTips },
  "cs-2-1": { resourceUrl: urls.hubspotSupport, videoUrl: bn.customerServiceGuide },
  "cs-2-2": { resourceUrl: urls.hubspotServiceHub, videoUrl: bn.customerCareTips },
  "cs-2-3": { resourceUrl: urls.hubspotInbound, videoUrl: bn.customerServiceFree }
};

const padMonth = (value) => String(value).padStart(2, "0");
const monthKey = (date) => `${date.getFullYear()}-${padMonth(date.getMonth() + 1)}`;

const makeItem = (seed, titleEn, titleBn, typeEn, typeBn) => ({
  id: seed,
  titleEn,
  titleBn,
  typeEn,
  typeBn
});

const buildMonthlyActivities = (pathItem, startDate) => {
  const modules = pathItem.modules || [];
  const moduleA = modules[0] || { titleEn: "Module 1", titleBn: "মডিউল ১" };
  const moduleB = modules[1] || { titleEn: "Module 2", titleBn: "মডিউল ২" };
  const activities = [];

  for (let i = 0; i < 6; i += 1) {
    const date = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
    const key = monthKey(date);
    let titleEn = "";
    let titleBn = "";
    let items = [];

    if (i === 0) {
      titleEn = `${moduleA.titleEn} Sprint 1`;
      titleBn = `${moduleA.titleBn} স্প্রিন্ট ১`;
      items = [
        makeItem(`${key}-learn`, `Finish ${moduleA.titleEn} lessons 1-2`, `${moduleA.titleBn} লেসন ১-২ শেষ করুন`, "Learning", "লার্নিং"),
        makeItem(`${key}-task`, `Assignment: ${moduleA.titleEn} mini task`, `অ্যাসাইনমেন্ট: ${moduleA.titleBn} মিনি টাস্ক`, "Assignment", "অ্যাসাইনমেন্ট"),
        makeItem(`${key}-review`, "Weekly reflection log", "সাপ্তাহিক রিফ্লেকশন লগ", "Review", "রিভিউ")
      ];
    } else if (i === 1) {
      titleEn = `${moduleA.titleEn} Sprint 2`;
      titleBn = `${moduleA.titleBn} স্প্রিন্ট ২`;
      items = [
        makeItem(`${key}-learn`, `Finish ${moduleA.titleEn} lesson 3`, `${moduleA.titleBn} লেসন ৩ শেষ করুন`, "Learning", "লার্নিং"),
        makeItem(`${key}-build`, `Mini project: apply ${moduleA.titleEn}`, `মিনি প্রোজেক্ট: ${moduleA.titleBn} প্রয়োগ`, "Assignment", "অ্যাসাইনমেন্ট"),
        makeItem(`${key}-review`, "Peer review + feedback", "পিয়ার রিভিউ + ফিডব্যাক", "Review", "রিভিউ")
      ];
    } else if (i === 2) {
      titleEn = `${moduleB.titleEn} Sprint 1`;
      titleBn = `${moduleB.titleBn} স্প্রিন্ট ১`;
      items = [
        makeItem(`${key}-learn`, `Finish ${moduleB.titleEn} lessons 1-2`, `${moduleB.titleBn} লেসন ১-২ শেষ করুন`, "Learning", "লার্নিং"),
        makeItem(`${key}-task`, `Assignment: ${moduleB.titleEn} workflow`, `অ্যাসাইনমেন্ট: ${moduleB.titleBn} ওয়ার্কফ্লো`, "Assignment", "অ্যাসাইনমেন্ট"),
        makeItem(`${key}-review`, "Weekly reflection log", "সাপ্তাহিক রিফ্লেকশন লগ", "Review", "রিভিউ")
      ];
    } else if (i === 3) {
      titleEn = `${moduleB.titleEn} Sprint 2`;
      titleBn = `${moduleB.titleBn} স্প্রিন্ট ২`;
      items = [
        makeItem(`${key}-learn`, `Finish ${moduleB.titleEn} lesson 3`, `${moduleB.titleBn} লেসন ৩ শেষ করুন`, "Learning", "লার্নিং"),
        makeItem(`${key}-build`, `Mini project: apply ${moduleB.titleEn}`, `মিনি প্রোজেক্ট: ${moduleB.titleBn} প্রয়োগ`, "Assignment", "অ্যাসাইনমেন্ট"),
        makeItem(`${key}-review`, "Peer review + feedback", "পিয়ার রিভিউ + ফিডব্যাক", "Review", "রিভিউ")
      ];
    } else if (i === 4) {
      titleEn = "Capstone Sprint";
      titleBn = "ক্যাপস্টোন স্প্রিন্ট";
      items = [
        makeItem(`${key}-scope`, `Capstone scope for ${pathItem.titleEn}`, `${pathItem.titleBn}‑এর জন্য ক্যাপস্টোন স্কোপ`, "Assignment", "অ্যাসাইনমেন্ট"),
        makeItem(`${key}-build`, "Build + document your deliverable", "ডেলিভারেবল তৈরি + ডকুমেন্টেশন", "Delivery", "ডেলিভারি"),
        makeItem(`${key}-review`, "Mentor review checkpoint", "মেন্টর রিভিউ চেকপয়েন্ট", "Review", "রিভিউ")
      ];
    } else {
      titleEn = "Co-op Contribution";
      titleBn = "কো-অপ কন্ট্রিবিউশন";
      items = [
        makeItem(`${key}-contrib`, "Contribute to a live EquiSaaS feature", "লাইভ EquiSaaS ফিচারে কন্ট্রিবিউট করুন", "Contribution", "কন্ট্রিবিউশন"),
        makeItem(`${key}-demo`, "Demo + share learnings", "ডেমো + লার্নিং শেয়ার", "Delivery", "ডেলিভারি"),
        makeItem(`${key}-retro`, "Retro + next steps", "রেট্রো + নেক্সট স্টেপ", "Review", "রিভিউ")
      ];
    }

    activities.push({
      id: `${pathItem.subdeptId}-${key}`,
      month: key,
      titleEn,
      titleBn,
      items
    });
  }

  return activities;
};

const run = async () => {
  const paths = PATHS;

  const missing = [];
  const updatedPaths = paths.map((pathItem) => ({
    ...pathItem,
    modules: (pathItem.modules || []).map((module) => ({
      ...module,
      lessons: (module.lessons || []).map((lesson) => {
        const links = lessonLinks[lesson.id];
        if (!links) missing.push(lesson.id);
        return {
          ...lesson,
          ...(links || {})
        };
      })
    }))
  }));

  if (missing.length) {
    console.warn(`Missing lesson mappings: ${missing.join(", ")}`);
  }

  const startDate = new Date();
  startDate.setDate(1);

  const roadmapsBySubdept = {};
  for (const pathItem of updatedPaths) {
    const subdeptId = pathItem.subdeptId || "";
    if (!subdeptId) continue;
    if (!roadmapsBySubdept[subdeptId]) {
      roadmapsBySubdept[subdeptId] = {
        subdeptId,
        deptId: pathItem.deptId || "",
        paths: [],
        monthlyActivities: buildMonthlyActivities(pathItem, startDate)
      };
    }
    roadmapsBySubdept[subdeptId].paths.push(pathItem);
  }

  const payload = { roadmaps: Object.values(roadmapsBySubdept) };
  await writeFile(outputPath, JSON.stringify(payload, null, 2), "utf8");
  console.log(`Wrote ${payload.roadmaps.length} roadmaps to ${outputPath}`);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});