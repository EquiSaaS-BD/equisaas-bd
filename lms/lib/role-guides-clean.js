const ROLE_GUIDES = {
  member: {
    title: { en: "Member", bn: "মেম্বার" },
    summary: {
      en: "Study one department path, complete lessons, submit visible proof, and track only approved progress.",
      bn: "একটি ডিপার্টমেন্টের শেখার পথ অনুসরণ করুন, lesson শেষ করুন, দৃশ্যমান proof জমা দিন, এবং শুধু অনুমোদিত অগ্রগতি track করুন।",
    },
    today: {
      en: "Open your next lesson, finish the resource properly, and submit proof from the linked task.",
      bn: "পরের lesson খুলুন, resourceটি ঠিকভাবে শেষ করুন, তারপর linked task থেকে proof জমা দিন।",
    },
    authority: {
      en: "Can learn, submit proof, track personal progress, and view approved records.",
      bn: "শিখতে, proof জমা দিতে, নিজের অগ্রগতি দেখতে, এবং অনুমোদিত record দেখতে পারবেন।",
    },
    responsibilities: [
      {
        en: "Stay inside one department at a time so your learning path remains clear.",
        bn: "এক সময়ে একটি department-এর ভেতরেই কাজ করুন, যাতে আপনার শেখার পথ পরিষ্কার থাকে।",
      },
      {
        en: "Use lesson resources exactly as published before submitting a task.",
        bn: "Task জমা দেওয়ার আগে প্রকাশিত lesson resource ঠিকভাবেই অনুসরণ করুন।",
      },
      {
        en: "Submit proof that clearly matches your name, account, or public work.",
        bn: "এমন proof জমা দিন যা স্পষ্টভাবে আপনার নাম, account, বা public work-এর সাথে মেলে।",
      },
    ],
    primaryTools: [
      { en: "Dashboard, Courses, Lessons", bn: "ড্যাশবোর্ড, কোর্স, লেসন" },
      { en: "Tasks and Submissions", bn: "টাস্ক ও সাবমিশন" },
      { en: "Points and Certificates", bn: "পয়েন্ট ও সার্টিফিকেট" },
    ],
    avoid: [
      {
        en: "Do not submit invisible, private, or unrelated proof links.",
        bn: "অদৃশ্য, private, বা অপ্রাসঙ্গিক proof link জমা দেবেন না।",
      },
      {
        en: "Do not switch departments casually without a real reason.",
        bn: "কারণ ছাড়া department বদলাবেন না।",
      },
      {
        en: "Do not expect points before review is finalized.",
        bn: "Review final হওয়ার আগে point পাওয়ার আশা করবেন না।",
      },
    ],
    steps: [
      {
        en: "Choose your department if this is your first working session.",
        bn: "এটি যদি আপনার প্রথম working session হয়, তাহলে department নির্বাচন করুন।",
      },
      {
        en: "Finish the next lesson resource from your course path.",
        bn: "আপনার course path-এর পরের lesson resource শেষ করুন।",
      },
      {
        en: "Open the linked task and submit proof for review.",
        bn: "Linked task খুলে review-এর জন্য proof জমা দিন।",
      },
    ],
  },
  mentor: {
    title: { en: "Mentor", bn: "মেন্টর" },
    summary: {
      en: "Review scoped submissions, give precise feedback, and recommend the next action without finalizing points.",
      bn: "নিজের scope-এর submission review করুন, নির্ভুল feedback দিন, এবং point final না করে পরের করণীয় সুপারিশ করুন।",
    },
    today: {
      en: "Work from the review queue, inspect the proof carefully, and leave clear comments with a recommendation.",
      bn: "Review queue থেকে কাজ করুন, proof মনোযোগ দিয়ে দেখুন, এবং সুস্পষ্ট মন্তব্যসহ recommendation দিন।",
    },
    authority: {
      en: "Can review and recommend, but cannot finalize points or approve themselves.",
      bn: "Review ও recommendation দিতে পারবেন, তবে point finalize করতে বা নিজে approval দিতে পারবেন না।",
    },
    responsibilities: [
      {
        en: "Verify that the proof actually shows completion and belongs to the right learner.",
        bn: "Proofটি সত্যিই completion দেখায় কি না এবং সঠিক learner-এর কি না তা যাচাই করুন।",
      },
      {
        en: "Give actionable comments so the learner knows what to fix next.",
        bn: "এমন feedback দিন যাতে learner বুঝতে পারে পরের ঠিক করণীয় কী।",
      },
      {
        en: "Recommend approval, revision, or rejection with a reason.",
        bn: "কারণসহ approval, revision, বা rejection-এর recommendation দিন।",
      },
    ],
    primaryTools: [
      { en: "Review Queue", bn: "রিভিউ কিউ" },
      { en: "Task and Submission records", bn: "টাস্ক ও সাবমিশন রেকর্ড" },
      { en: "Dashboard next-action cards", bn: "ড্যাশবোর্ডের next-action card" },
    ],
    avoid: [
      {
        en: "Do not approve weak proof just to clear the queue.",
        bn: "শুধু queue কমানোর জন্য দুর্বল proof approve করবেন না।",
      },
      {
        en: "Do not skip comments when asking for revision or rejection.",
        bn: "Revision বা rejection-এর সময় comment না দিয়ে এগোবেন না।",
      },
      {
        en: "Do not award points or create special exceptions from the mentor role.",
        bn: "Mentor role থেকে point দেবেন না বা বিশেষ ছাড় দেবেন না।",
      },
    ],
    steps: [
      {
        en: "Open the review queue and filter pending work first.",
        bn: "আগে review queue খুলে pending work দেখুন।",
      },
      {
        en: "Check the proof link, visible completion, and learner identity.",
        bn: "Proof link, visible completion, এবং learner identity মিলিয়ে দেখুন।",
      },
      {
        en: "Save a recommendation so an approver can finish the decision quickly.",
        bn: "এমন recommendation save করুন যাতে approver দ্রুত সিদ্ধান্ত শেষ করতে পারে।",
      },
    ],
  },
  department_head: {
    title: { en: "Department Steward", bn: "ডিপার্টমেন্ট স্টিউয়ার্ড" },
    summary: {
      en: "Run one department end to end: curriculum, reviews, announcements, attendance, and access discipline.",
      bn: "একটি department শুরু থেকে শেষ পর্যন্ত চালান: curriculum, review, announcement, attendance, এবং access discipline।",
    },
    today: {
      en: "Keep your department operational from one place: stewardship, review, announcements, and attendance.",
      bn: "এক জায়গা থেকে আপনার department operational রাখুন: stewardship, review, announcement, এবং attendance।",
    },
    authority: {
      en: "Can steward one department, finalize scoped review decisions, and record verified attendance.",
      bn: "একটি department steward করতে, নিজের scope-এর review decision finalize করতে, এবং verified attendance record করতে পারবেন।",
    },
    responsibilities: [
      {
        en: "Keep courses, lessons, and task requirements clear and current.",
        bn: "Course, lesson, এবং task requirement পরিষ্কার ও হালনাগাদ রাখুন।",
      },
      {
        en: "Use review decisions carefully because approved work affects official points.",
        bn: "Review decision সতর্কভাবে নিন, কারণ approved work official point-এ প্রভাব ফেলে।",
      },
      {
        en: "Maintain local discipline through announcements, member access, and attendance records.",
        bn: "Announcement, member access, এবং attendance record দিয়ে local discipline বজায় রাখুন।",
      },
    ],
    primaryTools: [
      { en: "Core Governance Panel", bn: "কোর গভর্ন্যান্স প্যানেল" },
      { en: "Review Queue", bn: "রিভিউ কিউ" },
      { en: "Department page and announcements", bn: "ডিপার্টমেন্ট page ও ঘোষণা" },
    ],
    avoid: [
      {
        en: "Do not approve work without visible proof.",
        bn: "দৃশ্যমান proof ছাড়া কাজ approve করবেন না।",
      },
      {
        en: "Do not record attendance for events that did not happen.",
        bn: "যে event হয়নি তার attendance record করবেন না।",
      },
      {
        en: "Do not assign roles outside your allowed department scope.",
        bn: "নিজের অনুমোদিত department scope-এর বাইরে role assign করবেন না।",
      },
    ],
    steps: [
      {
        en: "Create or update learning content from Core Governance.",
        bn: "Core Governance থেকে learning content তৈরি বা update করুন।",
      },
      {
        en: "Work through the review queue and finalize proof-backed decisions.",
        bn: "Review queue থেকে proof-backed decisionগুলো finalize করুন।",
      },
      {
        en: "Publish official updates and record verified attendance when needed.",
        bn: "প্রয়োজনে official update প্রকাশ করুন এবং verified attendance record করুন।",
      },
    ],
  },
  director: {
    title: { en: "Governance Steward", bn: "গভর্ন্যান্স স্টিউয়ার্ড" },
    summary: {
      en: "Operate across departments, monitor bottlenecks, support heads, and keep cross-team execution aligned.",
      bn: "সব department জুড়ে কাজ করুন, bottleneck ধরুন, head-দের support দিন, এবং cross-team execution aligned রাখুন।",
    },
    today: {
      en: "Use the dashboard, review queue, and governance scope to keep departments moving clearly.",
      bn: "Dashboard, review queue, এবং governance scope ব্যবহার করে departmentগুলোর কাজ পরিষ্কারভাবে এগিয়ে নিন।",
    },
    authority: {
      en: "Can browse all departments, review across teams, steward operational access, and publish global updates.",
      bn: "সব department browse করতে, cross-team review করতে, operational access steward করতে, এবং global update publish করতে পারবেন।",
    },
    responsibilities: [
      {
        en: "Identify blocked departments early and help them recover momentum.",
        bn: "যে department আটকে যাচ্ছে তা দ্রুত চিহ্নিত করুন এবং গতি ফেরাতে সাহায্য করুন।",
      },
      {
        en: "Use cross-department visibility to rebalance roles, tasks, and announcements when needed.",
        bn: "প্রয়োজনে cross-department visibility ব্যবহার করে role, task, এবং announcement rebalance করুন।",
      },
      {
        en: "Protect consistency so departments follow one operating standard.",
        bn: "সব department যেন এক operating standard অনুসরণ করে তা নিশ্চিত করুন।",
      },
    ],
    primaryTools: [
      { en: "Global Dashboard", bn: "গ্লোবাল ড্যাশবোর্ড" },
      { en: "Review Queue across departments", bn: "সব department-এর রিভিউ কিউ" },
      { en: "Governance access and announcements", bn: "গভর্ন্যান্স access ও announcement" },
    ],
    avoid: [
      {
        en: "Do not create conflicting directions for one department.",
        bn: "একই department-এ সাংঘর্ষিক নির্দেশনা দেবেন না।",
      },
      {
        en: "Do not bypass documented review and access rules.",
        bn: "Documented review এবং access rule bypass করবেন না।",
      },
      {
        en: "Do not treat unofficial discussion as an official announcement.",
        bn: "অনানুষ্ঠানিক আলোচনাকে official announcement হিসেবে ব্যবহার করবেন না।",
      },
    ],
    steps: [
      {
        en: "Inspect departments from the dashboard and spot real blockers.",
        bn: "Dashboard থেকে department inspect করুন এবং বাস্তব bottleneck ধরুন।",
      },
      {
        en: "Use the review queue to clear high-impact pending work.",
        bn: "উচ্চ-প্রভাব pending work clear করতে review queue ব্যবহার করুন।",
      },
      {
        en: "Use Core Governance to support department stewards and keep access balanced.",
        bn: "Department steward-দের support দিতে এবং access balanced রাখতে Core Governance ব্যবহার করুন।",
      },
    ],
  },
  super_admin: {
    title: { en: "Ecosystem Custodian", bn: "ইকোসিস্টেম কাস্টডিয়ান" },
    summary: {
      en: "Protect full platform integrity: roles, departments, approvals, certificates, and trusted records.",
      bn: "পুরো platform integrity রক্ষা করুন: role, department, approval, certificate, এবং trusted record।",
    },
    today: {
      en: "Operate as the final authority for access, reviews, certificates, and system discipline across the LMS.",
      bn: "LMS জুড়ে access, review, certificate, এবং system discipline-এর final authority হিসেবে কাজ করুন।",
    },
    authority: {
      en: "Can steward the full LMS, including final governance, role integrity, and certificate issuance.",
      bn: "LMS-এর পূর্ণ stewardship করতে পারবেন, যার মধ্যে final governance, role integrity, এবং certificate issuance রয়েছে।",
    },
    responsibilities: [
      {
        en: "Keep the role model clean so each department has the right operators.",
        bn: "Role model পরিষ্কার রাখুন, যাতে প্রতিটি department-এ সঠিক operator থাকে।",
      },
      {
        en: "Protect the integrity of ledger-backed points, attendance, and review decisions.",
        bn: "Ledger-backed point, attendance, এবং review decision-এর integrity রক্ষা করুন।",
      },
      {
        en: "Issue, revoke, and verify certificates only when the underlying completion record is trustworthy.",
        bn: "Completion record বিশ্বাসযোগ্য হলে তবেই certificate issue, revoke, বা verify করুন।",
      },
    ],
    primaryTools: [
      { en: "Global Dashboard and Core Governance", bn: "গ্লোবাল ড্যাশবোর্ড ও কোর গভর্ন্যান্স" },
      { en: "Review Queue and Points records", bn: "রিভিউ কিউ ও পয়েন্ট রেকর্ড" },
      { en: "Certificate stewardship", bn: "সার্টিফিকেট স্টিউয়ার্ডশিপ" },
    ],
    avoid: [
      {
        en: "Do not issue certificates from incomplete or weak completion records.",
        bn: "অসম্পূর্ণ বা দুর্বল completion record থেকে certificate issue করবেন না।",
      },
      {
        en: "Do not change access casually because role changes affect the whole workflow.",
        bn: "কারণ ছাড়া access পরিবর্তন করবেন না, কারণ role change পুরো workflow-এ প্রভাব ফেলে।",
      },
      {
        en: "Do not let unofficial actions replace ledger-backed records.",
        bn: "Unofficial action দিয়ে ledger-backed record-এর জায়গা পূরণ করতে দেবেন না।",
      },
    ],
    steps: [
      {
        en: "Use Dashboard, Review, and Core Governance as the main operating center.",
        bn: "Dashboard, Review, এবং Core Governance-কে মূল operating center হিসেবে ব্যবহার করুন।",
      },
      {
        en: "Check high-risk approvals, access changes, and certificate actions carefully.",
        bn: "High-risk approval, access change, এবং certificate action সতর্কভাবে যাচাই করুন।",
      },
      {
        en: "Keep the LMS trustworthy through consistent, documented decisions.",
        bn: "Consistent এবং documented decision দিয়ে LMS-কে বিশ্বাসযোগ্য রাখুন।",
      },
    ],
  },
};

export { ROLE_GUIDES };

export function getRoleGuide(role) {
  return ROLE_GUIDES[role] || ROLE_GUIDES.member;
}
