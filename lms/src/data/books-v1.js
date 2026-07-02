import { ROADMAPS_V2 } from "./roadmaps-v2";
import { RESOURCE_ITEMS_V2, TRACK_META } from "./resources-v2";

function uniqueByUrl(items) {
  const seen = new Set();
  return items.filter(item => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
}

const TRACK_TERMS = {
  frontend: {
    bn: [
      { term: "Component", meaning: "UI-এর ছোট ছোট অংশ" },
      { term: "State", meaning: "স্ক্রিনে যে ডাটা বদলায়" },
      { term: "Routing", meaning: "পেজ থেকে পেজে যাওয়ার পথ" }
    ],
    en: [
      { term: "Component", meaning: "Small reusable UI block" },
      { term: "State", meaning: "Data that changes on screen" },
      { term: "Routing", meaning: "Navigation path between pages" }
    ]
  },
  backend: {
    bn: [
      { term: "API", meaning: "এক সিস্টেম থেকে আরেকটিতে ডাটা পাঠানোর রাস্তা" },
      { term: "Database", meaning: "ডাটা রাখার ঘর" },
      { term: "Auth", meaning: "কে ঢুকতে পারবে তার নিরাপত্তা" }
    ],
    en: [
      { term: "API", meaning: "Path to send data between systems" },
      { term: "Database", meaning: "Home where data is stored" },
      { term: "Auth", meaning: "Security layer for access" }
    ]
  },
  devops: {
    bn: [
      { term: "Pipeline", meaning: "কোড থেকে লাইভ পর্যন্ত ধাপগুলো" },
      { term: "Container", meaning: "অ্যাপ চালানোর প্যাকেট" },
      { term: "Monitoring", meaning: "সিস্টেম ঠিক চলছে কি না দেখা" }
    ],
    en: [
      { term: "Pipeline", meaning: "Steps from code to live release" },
      { term: "Container", meaning: "Package to run an app consistently" },
      { term: "Monitoring", meaning: "Watch system health continuously" }
    ]
  },
  ux: {
    bn: [
      { term: "Persona", meaning: "আপনার টার্গেট ইউজারের প্রতিচ্ছবি" },
      { term: "Wireframe", meaning: "ডিজাইনের কাঁচা খসড়া" },
      { term: "Prototype", meaning: "ক্লিক করা যায় এমন ডিজাইন ডেমো" }
    ],
    en: [
      { term: "Persona", meaning: "Profile of a target user" },
      { term: "Wireframe", meaning: "Rough layout sketch" },
      { term: "Prototype", meaning: "Clickable design demo" }
    ]
  },
  graphic: {
    bn: [
      { term: "Brand Kit", meaning: "রঙ, ফন্ট, লোগোর গাইড" },
      { term: "Template", meaning: "বারবার ব্যবহারযোগ্য ডিজাইন" },
      { term: "CTA", meaning: "যেখানে ইউজারকে কাজ করতে বলা হয়" }
    ],
    en: [
      { term: "Brand Kit", meaning: "Guide for logo, color, and fonts" },
      { term: "Template", meaning: "Reusable design layout" },
      { term: "CTA", meaning: "Action prompt for users" }
    ]
  },
  ba: {
    bn: [
      { term: "Requirement", meaning: "প্রোডাক্টে কী লাগবে তার তালিকা" },
      { term: "User Story", meaning: "ইউজারের কাজকে ছোট গল্পে লেখা" },
      { term: "KPI", meaning: "ফলাফল মাপার সংখ্যা" }
    ],
    en: [
      { term: "Requirement", meaning: "List of what the product must support" },
      { term: "User Story", meaning: "Short user-focused feature statement" },
      { term: "KPI", meaning: "Number used to measure outcome" }
    ]
  },
  pm: {
    bn: [
      { term: "Roadmap", meaning: "আগামী কাজের ধারাবাহিক পরিকল্পনা" },
      { term: "OKR", meaning: "লক্ষ্য এবং তার মাপার রেজাল্ট" },
      { term: "Launch", meaning: "প্রোডাক্টকে ইউজারের জন্য খুলে দেওয়া" }
    ],
    en: [
      { term: "Roadmap", meaning: "Planned sequence of upcoming work" },
      { term: "OKR", meaning: "Goal with measurable outcomes" },
      { term: "Launch", meaning: "Make product available to users" }
    ]
  },
  growth: {
    bn: [
      { term: "SEO", meaning: "সার্চে সহজে খুঁজে পাওয়ার কৌশল" },
      { term: "Funnel", meaning: "ভিজিটর থেকে কাস্টমার হওয়ার ধাপ" },
      { term: "Conversion", meaning: "চাইলে কাজটি ইউজার করলো কি না" }
    ],
    en: [
      { term: "SEO", meaning: "Methods to rank better in search" },
      { term: "Funnel", meaning: "Steps from visitor to customer" },
      { term: "Conversion", meaning: "Whether users complete target action" }
    ]
  },
  success: {
    bn: [
      { term: "Onboarding", meaning: "নতুন ইউজারকে শুরু করানোর গাইড" },
      { term: "SLA", meaning: "কত দ্রুত সাপোর্ট দেওয়া হবে তার প্রতিশ্রুতি" },
      { term: "Retention", meaning: "ইউজার কতদিন ধরে রাখা যায়" }
    ],
    en: [
      { term: "Onboarding", meaning: "Guided first journey for new users" },
      { term: "SLA", meaning: "Promised support response window" },
      { term: "Retention", meaning: "How long users stay active" }
    ]
  }
};

const TRACK_CONTEXT = {
  frontend: {
    bn: "LMS ড্যাশবোর্ড স্ক্রিন",
    en: "LMS dashboard screen"
  },
  backend: {
    bn: "লগইন বা কোর্স API",
    en: "login or course API"
  },
  devops: {
    bn: "ডিপ্লয় পাইপলাইন",
    en: "deployment pipeline"
  },
  ux: {
    bn: "অনবোর্ডিং ফ্লো",
    en: "onboarding flow"
  },
  graphic: {
    bn: "সোশ্যাল ক্যাম্পেইন",
    en: "social campaign"
  },
  ba: {
    bn: "রিকোয়ারমেন্ট ডকুমেন্ট",
    en: "requirements document"
  },
  pm: {
    bn: "রোডম্যাপ প্ল্যান",
    en: "roadmap plan"
  },
  growth: {
    bn: "ল্যান্ডিং পেজ",
    en: "landing page"
  },
  success: {
    bn: "অনবোর্ডিং প্লেবুক",
    en: "onboarding playbook"
  }
};

function buildTopicNotes(topicEn, topicBn, trackKey) {
  const context = TRACK_CONTEXT[trackKey] || { bn: "প্রজেক্ট", en: "project" };

  return {
    titleBn: topicBn,
    titleEn: topicEn,
    overviewBn: `এই অংশে ${topicBn} এর মূল ধারণা সহজভাবে বোঝানো হবে, যাতে আপনি দ্রুত হাতে-কলমে কাজ করতে পারেন।`,
    overviewEn: `This section explains ${topicEn} in a simple way so you can apply it quickly.`,
    whyBn: `${context.bn} বানাতে ${topicBn} খুব কাজে লাগে ;  এতে কাজ দ্রুত ও পরিষ্কার হয়।`,
    whyEn: `${topicEn} helps build a ${context.en} faster and with more clarity.`,
    stepsBn: [
      `${topicBn} এর বেসিক ধারণা বুঝুন`,
      `${context.bn} এর ছোট অংশে প্রয়োগ করুন`,
      `নিজে রিভিউ করে ভুল ধরুন`
    ],
    stepsEn: [
      `Understand the basics of ${topicEn}`,
      `Apply it to a small part of the ${context.en}`,
      `Self-review and fix mistakes`
    ],
    exampleBn: `উদাহরণ: ${context.bn} তৈরি করার সময় ${topicBn} ব্যবহার করে একটি ছোট অংশ ঠিক করুন।`,
    exampleEn: `Example: while building a ${context.en}, use ${topicEn} to improve one small part.`
  };
}

function buildWeeks(month, topicsEn, assignmentsEn) {
  const base = month === 1 ? [5, 6, 6, 5] : [6, 7, 7, 6];
  return [
    { week: 1, focusEn: topicsEn[0], focusBn: "প্রথম মূল টপিক", studyHours: base[0], practiceHours: 2 },
    { week: 2, focusEn: topicsEn[1], focusBn: "দ্বিতীয় মূল টপিক", studyHours: base[1], practiceHours: 3 },
    { week: 3, focusEn: topicsEn[2], focusBn: "তৃতীয় মূল টপিক", studyHours: base[2], practiceHours: 3 },
    { week: 4, focusEn: assignmentsEn[0] || "Mini project", focusBn: "অ্যাসাইনমেন্ট ও রিভিউ", studyHours: base[3], practiceHours: 4 }
  ];
}

function buildFlow(month) {
  if (month === 1) {
    return {
      bn: ["ভিত্তি বুঝুন", "ছোট টাস্ক করুন", "ফিডব্যাক নিন", "শেয়ার করুন"],
      en: ["Understand basics", "Build small task", "Get feedback", "Share outcome"]
    };
  }

  return {
    bn: ["অ্যাডভান্স টপিক", "প্র্যাকটিস টাস্ক", "রিভিশন", "মিনি ডেলিভারি"],
    en: ["Advanced topic", "Practice task", "Revision", "Mini delivery"]
  };
}

function buildResourceMix(resources) {
  const typeCounts = {};
  resources.forEach(item => {
    typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
  });
  return Object.entries(typeCounts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);
}

function buildChapter(deptKey, trackKey, monthData) {
  const trackMeta = TRACK_META[deptKey]?.tracks?.[trackKey] || { bn: trackKey, en: trackKey };
  const terms = TRACK_TERMS[trackKey] || TRACK_TERMS.frontend;
  const topicNotes = monthData.topicsEn.map((topicEn, idx) => buildTopicNotes(topicEn, monthData.topicsBn[idx] || topicEn, trackKey));

  const chapterResources = uniqueByUrl(
    RESOURCE_ITEMS_V2.filter(item => item.dept === deptKey && item.track === trackKey && item.month === monthData.month)
  ).slice(0, 12);

  const weeks = buildWeeks(monthData.month, monthData.topicsEn, monthData.assignmentsEn);

  return {
    chapterId: `${deptKey}-${trackKey}-m${monthData.month}`,
    deptKey,
    trackKey,
    month: monthData.month,
    trackTitleBn: trackMeta.bn,
    trackTitleEn: trackMeta.en,
    titleBn: `${trackMeta.bn} ;  মাস ${monthData.month} স্টাডি বুক`,
    titleEn: `${trackMeta.en} ;  Month ${monthData.month} Study Book`,
    introBn: `এই অধ্যায়ে ${monthData.topicsBn.join(" • ")} সহজভাবে শেখানো হয়েছে। প্রতিটি অংশ পড়ার পর ছোট কাজ দিয়ে প্র্যাকটিস করলে মাস শেষে ${monthData.deliverables} ডেলিভার করা সহজ হবে।`,
    introEn: `This chapter explains ${monthData.topicsEn.join(" • ")} in a simple and practical way. By practicing each section with small tasks, you will be ready to deliver ${monthData.deliverables} by month end.`,
    howToReadBn: [
      "প্রতিদিন ৪৫-৬০ মিনিট পড়ে সঙ্গে সঙ্গে ছোট নোট লিখুন।",
      "প্রতি সপ্তাহ শেষে ১টি ছোট আউটপুট তৈরি করুন।",
      "শেষ সপ্তাহে অ্যাসাইনমেন্ট জমা দেওয়ার আগে নিজেই চেকলিস্ট রান করুন।"
    ],
    howToReadEn: [
      "Study 45-60 minutes daily and keep a short note.",
      "Create one mini output at the end of each week.",
      "Run a self-checklist before final assignment submission."
    ],
    keyTopicsBn: monthData.topicsBn,
    keyTopicsEn: monthData.topicsEn,
    assignmentsBn: monthData.assignmentsBn,
    assignmentsEn: monthData.assignmentsEn,
    deliverables: monthData.deliverables,
    topicNotes,
    weeks,
    flow: buildFlow(monthData.month),
    termsBn: terms.bn,
    termsEn: terms.en,
    resources: chapterResources,
    resourceMix: buildResourceMix(chapterResources)
  };
}

function buildBooks() {
  const result = {};

  Object.entries(ROADMAPS_V2).forEach(([deptKey, tracks]) => {
    result[deptKey] = {};

    Object.entries(tracks).forEach(([trackKey, months]) => {
      const chapters = months
        .map(monthData => buildChapter(deptKey, trackKey, monthData));

      result[deptKey][trackKey] = chapters;
    });
  });

  return result;
}

export const BOOK_CONTENT_V1 = buildBooks();

export const BOOK_SUMMARY_V1 = {
  totalTracks: Object.values(BOOK_CONTENT_V1).reduce((sum, tracks) => sum + Object.keys(tracks).length, 0),
  totalChapters: Object.values(BOOK_CONTENT_V1)
    .flatMap(tracks => Object.values(tracks))
    .reduce((sum, chapters) => sum + chapters.length, 0)
};



