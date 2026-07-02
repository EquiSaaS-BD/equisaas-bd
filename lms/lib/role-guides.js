import { normalizeLocalizedTree } from "@/lib/localized-copy";

const RAW_ROLE_GUIDES = {
  member: {
    title: { en: "Member", bn: "মেম্বার" },
    summary: {
      en: "Study one department path, complete lessons, submit visible proof, and track only approved progress.",
      bn: "একটি ডিপার্টমেন্টের শেখার পথ অনুসরণ করুন, লেসন শেষ করুন, দৃশ্যমান প্রুফ জমা দিন, এবং শুধু অনুমোদিত অগ্রগতি ট্র্যাক করুন।",
    },
    today: {
      en: "Open your next lesson, finish the resource properly, and submit proof from the linked task.",
      bn: "পরের লেসন খুলুন, রিসোর্সটি ঠিকভাবে শেষ করুন, তারপর লিঙ্কড টাস্ক থেকে প্রুফ জমা দিন।",
    },
    authority: {
      en: "Can learn, submit proof, track personal progress, and view approved records.",
      bn: "শিখতে, প্রুফ জমা দিতে, নিজের অগ্রগতি দেখতে, এবং অনুমোদিত রেকর্ড দেখতে পারবেন।",
    },
    responsibilities: [
      {
        en: "Stay inside one department at a time so your learning path remains clear.",
        bn: "এক সময়ে একটিই ডিপার্টমেন্টে কাজ করুন, যাতে আপনার শেখার পথ পরিষ্কার থাকে।",
      },
      {
        en: "Use lesson resources exactly as published before submitting a task.",
        bn: "টাস্ক জমা দেওয়ার আগে প্রকাশিত লেসন রিসোর্স ঠিকভাবেই অনুসরণ করুন।",
      },
      {
        en: "Submit proof that clearly matches your name, account, or public work.",
        bn: "এমন প্রুফ জমা দিন যা স্পষ্টভাবে আপনার নাম, অ্যাকাউন্ট, বা পাবলিক কাজের সাথে মেলে।",
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
        bn: "অদৃশ্য, প্রাইভেট, বা অপ্রাসঙ্গিক প্রুফ লিংক জমা দেবেন না।",
      },
      {
        en: "Do not switch departments casually without a real reason.",
        bn: "কারণ ছাড়া ডিপার্টমেন্ট বদলাবেন না।",
      },
      {
        en: "Do not expect points before review is finalized.",
        bn: "রিভিউ ফাইনাল হওয়ার আগে পয়েন্ট পাওয়ার আশা করবেন না।",
      },
    ],
    steps: [
      {
        en: "Choose your department if this is your first working session.",
        bn: "এটি যদি আপনার প্রথম কাজের সেশন হয়, তাহলে ডিপার্টমেন্ট নির্বাচন করুন।",
      },
      {
        en: "Finish the next lesson resource from your course path.",
        bn: "আপনার কোর্স পথের পরের লেসন রিসোর্স শেষ করুন।",
      },
      {
        en: "Open the linked task and submit proof for review.",
        bn: "লিঙ্কড টাস্ক খুলে রিভিউর জন্য প্রুফ জমা দিন।",
      },
    ],
  },
  mentor: {
    title: { en: "Mentor", bn: "মেন্টর" },
    summary: {
      en: "Review scoped submissions, give precise feedback, and recommend the next action without finalizing points.",
      bn: "নিজের স্কোপের সাবমিশন রিভিউ করুন, নির্ভুল ফিডব্যাক দিন, এবং পয়েন্ট ফাইনাল না করে পরের করণীয় সুপারিশ করুন।",
    },
    today: {
      en: "Work from the review queue, inspect the proof carefully, and leave clear comments with a recommendation.",
      bn: "রিভিউ কিউ থেকে কাজ করুন, প্রুফ মনোযোগ দিয়ে দেখুন, এবং সুস্পষ্ট মন্তব্যসহ সুপারিশ দিন।",
    },
    authority: {
      en: "Can review and recommend, but cannot finalize points or approve themselves.",
      bn: "রিভিউ ও সুপারিশ করতে পারবেন, তবে পয়েন্ট ফাইনাল করতে বা নিজেকে অনুমোদন দিতে পারবেন না।",
    },
    responsibilities: [
      {
        en: "Verify that the proof actually shows completion and belongs to the right learner.",
        bn: "প্রুফটি সত্যিই কাজ শেষ হয়েছে কিনা এবং সঠিক লার্নারের কিনা তা যাচাই করুন।",
      },
      {
        en: "Give actionable comments so the learner knows what to fix next.",
        bn: "এমন ফিডব্যাক দিন যাতে লার্নার বুঝতে পারে পরের ঠিক করণীয় কী।",
      },
      {
        en: "Recommend approval, revision, or rejection with a reason.",
        bn: "কারণসহ অনুমোদন, সংশোধন, বা বাতিলের সুপারিশ দিন।",
      },
    ],
    primaryTools: [
      { en: "Review Queue", bn: "রিভিউ কিউ" },
      { en: "Task and Submission records", bn: "টাস্ক ও সাবমিশন রেকর্ড" },
      { en: "Dashboard next-action cards", bn: "ড্যাশবোর্ডের নেক্সট-অ্যাকশন কার্ড" },
    ],
    avoid: [
      {
        en: "Do not approve weak proof just to clear the queue.",
        bn: "শুধু কিউ কমানোর জন্য দুর্বল প্রুফ অনুমোদন করবেন না।",
      },
      {
        en: "Do not skip comments when asking for revision or rejection.",
        bn: "রিভিশন বা রিজেকশনের সময় মন্তব্য না দিয়ে এগোবেন না।",
      },
      {
        en: "Do not award points or create special exceptions from the mentor role.",
        bn: "মেন্টর রোল থেকে পয়েন্ট দেবেন না বা বিশেষ ছাড় দেবেন না।",
      },
    ],
    steps: [
      {
        en: "Open the review queue and filter pending work first.",
        bn: "আগে রিভিউ কিউ খুলে pending কাজগুলো দেখুন।",
      },
      {
        en: "Check the proof link, visible completion, and learner identity.",
        bn: "প্রুফ লিংক, দৃশ্যমান completion, এবং লার্নারের পরিচয় মিলিয়ে দেখুন।",
      },
      {
        en: "Save a recommendation so an approver can finish the decision quickly.",
        bn: "এমন সুপারিশ সেভ করুন যাতে approver দ্রুত সিদ্ধান্ত শেষ করতে পারে।",
      },
    ],
  },
  department_head: {
    title: { en: "Department Head", bn: "ডিপার্টমেন্ট হেড" },
    summary: {
      en: "Run one department end to end: curriculum, reviews, announcements, attendance, and access discipline.",
      bn: "একটি ডিপার্টমেন্ট শুরু থেকে শেষ পর্যন্ত চালান: curriculum, review, announcement, attendance, এবং access discipline।",
    },
    today: {
      en: "Keep your department operational from one place: management, review, announcements, and attendance.",
      bn: "এক জায়গা থেকে আপনার ডিপার্টমেন্ট operational রাখুন: management, review, announcement, এবং attendance।",
    },
    authority: {
      en: "Can manage one department, finalize scoped review decisions, and record verified attendance.",
      bn: "একটি ডিপার্টমেন্ট ম্যানেজ করতে, নিজের স্কোপের রিভিউ সিদ্ধান্ত ফাইনাল করতে, এবং verified attendance record করতে পারবেন।",
    },
    responsibilities: [
      {
        en: "Keep courses, lessons, and task requirements clear and current.",
        bn: "কোর্স, লেসন, এবং টাস্ক requirements পরিষ্কার ও হালনাগাদ রাখুন।",
      },
      {
        en: "Use review decisions carefully because approved work affects official points.",
        bn: "রিভিউ সিদ্ধান্ত সতর্কভাবে নিন, কারণ approved work অফিসিয়াল পয়েন্টে প্রভাব ফেলে।",
      },
      {
        en: "Maintain local discipline through announcements, member access, and attendance records.",
        bn: "announcement, member access, এবং attendance record দিয়ে local discipline বজায় রাখুন।",
      },
    ],
    primaryTools: [
      { en: "Management Console", bn: "ম্যানেজমেন্ট কনসোল" },
      { en: "Review Queue", bn: "রিভিউ কিউ" },
      { en: "Department page and announcements", bn: "ডিপার্টমেন্ট পেজ ও ঘোষণা" },
    ],
    avoid: [
      {
        en: "Do not approve work without visible proof.",
        bn: "দৃশ্যমান প্রুফ ছাড়া কাজ approve করবেন না।",
      },
      {
        en: "Do not record attendance for events that did not happen.",
        bn: "যে event হয়নি তার attendance record করবেন না।",
      },
      {
        en: "Do not assign roles outside your allowed department scope.",
        bn: "নিজের অনুমোদিত ডিপার্টমেন্ট স্কোপের বাইরে role assign করবেন না।",
      },
    ],
    steps: [
      {
        en: "Create or update learning content from Management.",
        bn: "Management থেকে learning content তৈরি বা update করুন।",
      },
      {
        en: "Work through the review queue and finalize proof-backed decisions.",
        bn: "রিভিউ কিউ থেকে proof-backed সিদ্ধান্তগুলো শেষ করুন।",
      },
      {
        en: "Publish official updates and record verified attendance when needed.",
        bn: "প্রয়োজন হলে official update প্রকাশ করুন এবং verified attendance record করুন।",
      },
    ],
  },
  director: {
    title: { en: "Director", bn: "ডিরেক্টর" },
    summary: {
      en: "Operate across departments, monitor bottlenecks, support heads, and keep cross-team execution aligned.",
      bn: "সব ডিপার্টমেন্ট জুড়ে কাজ করুন, bottleneck ধরুন, head-দের support দিন, এবং cross-team execution aligned রাখুন।",
    },
    today: {
      en: "Use the dashboard, review queue, and management scope to keep departments moving clearly.",
      bn: "dashboard, review queue, এবং management scope ব্যবহার করে ডিপার্টমেন্টগুলোর কাজ পরিষ্কারভাবে এগিয়ে নিন।",
    },
    authority: {
      en: "Can browse all departments, review across teams, manage operational access, and publish global updates.",
      bn: "সব ডিপার্টমেন্ট browse করতে, cross-team review করতে, operational access manage করতে, এবং global update publish করতে পারবেন।",
    },
    responsibilities: [
      {
        en: "Identify blocked departments early and help them recover momentum.",
        bn: "যে ডিপার্টমেন্ট আটকে যাচ্ছে তা দ্রুত চিহ্নিত করুন এবং গতি ফেরাতে সাহায্য করুন।",
      },
      {
        en: "Use cross-department visibility to rebalance roles, tasks, and announcements when needed.",
        bn: "প্রয়োজন হলে cross-department visibility ব্যবহার করে role, task, এবং announcement rebalance করুন।",
      },
      {
        en: "Protect consistency so departments follow one operating standard.",
        bn: "সব ডিপার্টমেন্ট যেন এক operating standard অনুসরণ করে তা নিশ্চিত করুন।",
      },
    ],
    primaryTools: [
      { en: "Global Dashboard", bn: "গ্লোবাল ড্যাশবোর্ড" },
      { en: "Review Queue across departments", bn: "সব ডিপার্টমেন্টের রিভিউ কিউ" },
      { en: "Management access and announcements", bn: "ম্যানেজমেন্ট access ও announcement" },
    ],
    avoid: [
      {
        en: "Do not create conflicting directions for one department.",
        bn: "একই ডিপার্টমেন্টে সাংঘর্ষিক নির্দেশনা দেবেন না।",
      },
      {
        en: "Do not bypass documented review and access rules.",
        bn: "documented review এবং access rule bypass করবেন না।",
      },
      {
        en: "Do not treat unofficial discussion as an official announcement.",
        bn: "অনানুষ্ঠানিক আলোচনাকে official announcement হিসেবে ব্যবহার করবেন না।",
      },
    ],
    steps: [
      {
        en: "Inspect departments from the dashboard and spot real blockers.",
        bn: "dashboard থেকে department inspect করুন এবং বাস্তব bottleneck ধরুন।",
      },
      {
        en: "Use the review queue to clear high-impact pending work.",
        bn: "উচ্চ-প্রভাব pending কাজ clear করতে review queue ব্যবহার করুন।",
      },
      {
        en: "Use Management to support heads and keep access balanced.",
        bn: "head-দের support দিতে এবং access balanced রাখতে Management ব্যবহার করুন।",
      },
    ],
  },
  super_admin: {
    title: { en: "Super Admin", bn: "সুপার অ্যাডমিন" },
    summary: {
      en: "Protect full platform integrity: roles, departments, approvals, certificates, and trusted records.",
      bn: "পুরো platform integrity রক্ষা করুন: role, department, approval, certificate, এবং trusted record।",
    },
    today: {
      en: "Operate as the final authority for access, reviews, certificates, and system discipline across the LMS.",
      bn: "LMS জুড়ে access, review, certificate, এবং system discipline-এর final authority হিসেবে কাজ করুন।",
    },
    authority: {
      en: "Can manage everything in the LMS, including final governance, role control, and certificate issuance.",
      bn: "LMS-এর সবকিছু manage করতে পারবেন, যার মধ্যে final governance, role control, এবং certificate issuance রয়েছে।",
    },
    responsibilities: [
      {
        en: "Keep the role model clean so each department has the right operators.",
        bn: "role model পরিষ্কার রাখুন, যাতে প্রতিটি ডিপার্টমেন্টে সঠিক operator থাকে।",
      },
      {
        en: "Protect the integrity of ledger-backed points, attendance, and review decisions.",
        bn: "ledger-backed point, attendance, এবং review decision-এর integrity রক্ষা করুন।",
      },
      {
        en: "Issue, revoke, and verify certificates only when the underlying completion record is trustworthy.",
        bn: "completion record বিশ্বাসযোগ্য হলে তবেই certificate issue, revoke, বা verify করুন।",
      },
    ],
    primaryTools: [
      { en: "Global Dashboard and Management", bn: "গ্লোবাল ড্যাশবোর্ড ও ম্যানেজমেন্ট" },
      { en: "Review Queue and Points records", bn: "রিভিউ কিউ ও পয়েন্ট রেকর্ড" },
      { en: "Certificate management", bn: "সার্টিফিকেট ম্যানেজমেন্ট" },
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
        bn: "unofficial action দিয়ে ledger-backed record-এর জায়গা পূরণ করতে দেবেন না।",
      },
    ],
    steps: [
      {
        en: "Use Dashboard, Review, and Management as the main operating center.",
        bn: "Dashboard, Review, এবং Management-কে মূল operating center হিসেবে ব্যবহার করুন।",
      },
      {
        en: "Check high-risk approvals, access changes, and certificate actions carefully.",
        bn: "high-risk approval, access change, এবং certificate action সতর্কভাবে যাচাই করুন।",
      },
      {
        en: "Keep the LMS trustworthy through consistent, documented decisions.",
        bn: "consistent এবং documented decision দিয়ে LMS-কে বিশ্বাসযোগ্য রাখুন।",
      },
    ],
  },
};

export const ROLE_GUIDES = normalizeLocalizedTree(RAW_ROLE_GUIDES);

export function getRoleGuide(role) {
  return ROLE_GUIDES[role] || ROLE_GUIDES.member;
}
