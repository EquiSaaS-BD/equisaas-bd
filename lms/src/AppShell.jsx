import React, { useEffect, useMemo, useState, Suspense, lazy } from "react";
import { LmsContext } from "./lms-context";
import { BookOpen, Layers, PlayCircle, CheckCircle2, Users, ShieldCheck, Sparkles, Megaphone, Search, Filter, ArrowRight, LogIn, LogOut, Plus, X, ChevronUp, ChevronDown, LayoutDashboard, Compass, MessageSquare, ExternalLink, Download, Link2 } from "lucide-react";
import { EquiSaaSLogo } from "@/components/core/EquiSaaSLogo";
import { DEPARTMENTS, PATHS } from "./data/structure.mjs";
import { BANGLADESH_DISTRICTS } from "./data/bangladesh-districts.js";
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, increment, onSnapshot, query, where, orderBy, limit, serverTimestamp, arrayUnion, arrayRemove } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import CustomCursor from "@/components/ui/CustomCursor";
import { cn } from "@/lib/utils";
import { initAnalytics, usePageView, trackEvent } from "./lib/useAnalytics";
import NotificationBell from "./components/ui/NotificationBell";
import { app, auth, db, isConfigured } from "./lib/firebaseClient";
import { getMemberRank, getPublicProfileDocRef, getPublicProfilePath } from "./lib/publicProfile";
import { isManagementRole } from "./lib/governance";
import useAnnouncementState from "./hooks/useAnnouncementState";
import useCoopData from "./hooks/useCoopData";
import useDashboardData from "./hooks/useDashboardData";
import useProfileSync from "./hooks/useProfileSync";
import { triggerCsvDownload, triggerDownload } from "../lib/download-helper";

import OnboardingTour from "./components/ui/OnboardingTour";
const CoursesView = lazy(() => import("./views/CoursesView.jsx"));
const CoopHubView = lazy(() => import("./views/CoopHubView.jsx"));
const AdminView = lazy(() => import("./views/AdminView.jsx"));
const ResourcesView = lazy(() => import("./views/ResourcesView.jsx"));
const RoadmapView = lazy(() => import("./views/RoadmapView.jsx"));
const SquadWorkspaceView = lazy(() => import("./views/SquadWorkspaceView.jsx"));
const DashboardOverviewView = lazy(() => import("./views/DashboardOverviewView.jsx"));
const QuickStartView = lazy(() => import("./views/QuickStartView.jsx"));
const APPLICATION_LINK = "https://equisaas-bd.com/#apply";
const MEMBER_AUDIT_ACTIONS = new Set(["assignment.attestation", "learning.path-open", "session.login"]);
const dhakaDayKey = (value = new Date()) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value);

const CONTENT = {
  bn: {
    nav: {
      dashboard: "ওভারভিউ",
      courses: "কোর্স ও লেকচার",
      manual: "শুরু গাইড",
      resources: "রিসোর্স লাইব্রেরি",
      roadmap: "স্টাডি রোডম্যাপ",
      community: "কমিউনিটি ফিড",
      coop: "কো-অপ হাব",
      admin: "অ্যাডমিন"
    },
    hero: {
      title: "EquiSaaS BD LMS",
      subtitle: "ফ্রি, কো-অপারেটিভ লার্নিং প্ল্যাটফর্ম",
      desc: "শিখুন, তৈরি করুন, এবং সমান মালিকানা নিয়ে প্রোডাক্টে কন্ট্রিবিউট করুন।"
    },
    stats: {
      active: "এক্টিভ পাথ",
      progress: "প্রোগ্রেস",
      community: "কমিউনিটি"
    },
    actions: {
      signIn: "সাইন ইন",
      signOut: "সাইন আউট",
      join: "জয়েন করুন",
      viewCourse: "লেকচার খুলুন",
      markComplete: "কমপ্লিট হিসেবে চিহ্নিত",
      addCourse: "নতুন কোর্স",
      addLesson: "নতুন লেসন",
      moveUp: "উপরে নিন",
      moveDown: "নিচে নিন",
      save: "সংরক্ষণ",
      close: "বন্ধ",
      submit: "সাবমিট",
      approve: "অনুমোদন",
      assign: "অ্যাসাইন",
      voteYes: "সমর্থন",
      voteNo: "বিরোধ",
      enroll: "এনরোল",
      requestJoin: "জয়েন রিকোয়েস্ট",
      upvote: "আপভোট",
      issue: "ইস্যু",
      startLearning: "শুরু করুন",
      preview: "প্রিভিউ",
      chooseTrack: "ট্র্যাক নির্বাচন",
      saveTrack: "ট্র্যাক সংরক্ষণ",
      exportEquityLedger: "ইকুইটি লেজার ডাউনলোড (JSON)",
      copyTrackInviteLink: "ট্র্যাক আমন্ত্রণ লিংক",
      selectDistrict: "জেলা (ঐচ্ছিক)",
      districtHint: "৬৪ জেলা : সোশ্যাল প্রুফ ও আমন্ত্রণ লিংকে ব্যবহৃত হয়",
      addPath: "নতুন পাথ",
      addModule: "নতুন মডিউল",
      addMonthly: "মাসিক কার্যক্রম যোগ",
      addItem: "আইটেম যোগ",
      submitAssignment: "অ্যাসাইনমেন্ট সাবমিট",
      resubmit: "রিসাবমিট",
      review: "রিভিউ",
      exportCsv: "CSV এক্সপোর্ট",
      viewSubmission: "সাবমিশন দেখুন",
      remove: "মুছুন"
    },
    labels: {
      courseTitleBn: "কোর্স টাইটেল (বাংলা)",
      courseTitleEn: "কোর্স টাইটেল (ইংরেজি)",
      courseDescBn: "কোর্স বর্ণনা (বাংলা)",
      courseDescEn: "কোর্স বর্ণনা (ইংরেজি)",
      level: "লেভেল",
      language: "ল্যাঙ্গুয়েজ",
      badge: "ব্যাজ/ট্যাগ",
      lessons: "লেসনের সংখ্যা",
      published: "পাবলিশ",
      courseSelect: "কোর্স নির্বাচন",
      lessonTitleBn: "লেসন টাইটেল (বাংলা)",
      lessonTitleEn: "লেসন টাইটেল (ইংরেজি)",
      order: "অর্ডার",
      lessonOrder: "লেসন অর্ডার",
      lessonCount: "মোট লেসন",
      noLessons: "এই কোর্সে এখনো লেসন নেই।",
      selectCourseManage: "অর্ডার ম্যানেজ করতে একটি কোর্স নির্বাচন করুন।",
      submitContribution: "কন্ট্রিবিউশন জমা দিন",
      title: "শিরোনাম",
      type: "টাইপ",
      points: "পয়েন্ট",
      hours: "ঘন্টা",
      status: "স্ট্যাটাস",
      month: "মাস",
      revenue: "রেভিনিউ",
      costs: "খরচ",
      members: "মেম্বার সংখ্যা",
      avgMembers: "গড় মেম্বার",
      entries: "এন্ট্রি",
      netLabel: "নেট",
      avgShare: "প্রতি মেম্বার গড় শেয়ার",
      totalSignals: "মোট সিগনাল",
      avgScore: "গড় স্কোর",
      totalScore: "মোট স্কোর",
      submissionLink: "সাবমিশন লিংক",
      submissionNotes: "সাবমিশন নোট",
      reviewNote: "রিভিউ নোট",
      assignmentSubmissions: "অ্যাসাইনমেন্ট সাবমিশন",
      auditTrail: "অডিট ট্রেইল",
      statusPending: "পেন্ডিং",
      statusApproved: "অনুমোদিত",
      statusRejected: "রিওয়ার্ক",
      rolePlaybook: "রোল প্লেবুক",
      roleSelect: "রোল নির্বাচন",
      steps: "স্টেপস",
      weeklyRhythm: "সাপ্তাহিক ছন্দ",
      deliverables: "ডেলিভারেবল",
      tools: "টুলস",
      summary: "সারাংশ",
      deadline: "ডেডলাইন",
      link: "লিংক",
      sourceLang: "সোর্স ভাষা",
      targetLang: "টার্গেট ভাষা",
      mentor: "মেন্টর",
      mentee: "মেন্টি",
      checklist: "চেকলিস্ট",
      badgeLabel: "ব্যাজ",
      levelLabel: "লেভেল",
      eta: "ETA",
      signal: "সিগনাল",
      empty: "এখনো কিছু নেই।",
      coopSignIn: "কো-অপ ডেটা দেখতে সাইন ইন করুন।",
      departments: "ডিপার্টমেন্ট",
      subdepartments: "সাব-ডিপার্টমেন্ট",
      paths: "লার্নিং পাথ",
      modules: "মডিউল",
      path: "পাথ",
      overview: "ওভারভিউ",
      contentTab: "কনটেন্ট",
      aboutTab: "পরিচিতি",
      duration: "সময়",
      lessonsLabel: "লেসন",
      searchModule: "মডিউল/লেসন খুঁজুন",
      filterLevel: "লেভেল ফিল্টার",
      activePaths: "এক্টিভ পাথ",
      prerequisites: "প্রয়োজনীয়তা",
      outcomes: "লার্নিং আউটকাম",
      noModules: "এই পাথে এখনো কোনো মডিউল নেই।",
      trustLedger: "ট্রাস্ট লেজার",
      communityUpdates: "কমিউনিটি আপডেট",
      resourcesTitle: "রিসোর্স",
      communityTitle: "কমিউনিটি",
      chooseTrackTitle: "আপনার ট্র্যাক নির্বাচন করুন",
      chooseTrackDesc: "লগইন করার পরে আপনার ডিপার্টমেন্ট এবং সাব-ডিপার্টমেন্ট নির্বাচন করুন।",
      selectDept: "ডিপার্টমেন্ট নির্বাচন",
      selectSubdept: "সাব-ডিপার্টমেন্ট নির্বাচন",
      selectPath: "পাথ নির্বাচন",
      monthlyActivities: "মাসিক কার্যক্রম",
      pathTitleBn: "পাথ টাইটেল (বাংলা)",
      pathTitleEn: "পাথ টাইটেল (ইংরেজি)",
      pathDescBn: "পাথ বর্ণনা (বাংলা)",
      pathDescEn: "পাথ বর্ণনা (ইংরেজি)",
      moduleTitleBn: "মডিউল টাইটেল (বাংলা)",
      moduleTitleEn: "মডিউল টাইটেল (ইংরেজি)",
      moduleSummaryBn: "মডিউল সারাংশ (বাংলা)",
      moduleSummaryEn: "মডিউল সারাংশ (ইংরেজি)",
      itemTitleBn: "আইটেম টাইটেল (বাংলা)",
      itemTitleEn: "আইটেম টাইটেল (ইংরেজি)",
      videoUrl: "ভিডিও URL",
      resourceUrl: "রিসোর্স লিংক",
      programTitleBn: "কার্যক্রম শিরোনাম (বাংলা)",
      programTitleEn: "কার্যক্রম শিরোনাম (ইংরেজি)",
      yourTrack: "আপনার ট্র্যাক",
      openLink: "লিংক খুলুন",
      roadmapBuilder: "রোডম্যাপ বিল্ডার",
      roadmapOverview: "রোডম্যাপ ওভারভিউ"
    },
    coop: {
      title: "কো-অপ হাব",
      subtitle: "ট্রান্সপারেন্সি, গভর্ন্যান্স, এবং কমিউনিটি অপারেশন",
      tabs: {
        ledger: "কন্ট্রিবিউশন লেজার",
        payouts: "প্রফিট শেয়ার",
        governance: "গভর্ন্যান্স",
        pathways: "স্কিল পাথওয়ে",
        squads: "প্রোডাক্ট স্কোয়াড",
        translations: "ট্রান্সলেশন কিউ",
        mentorship: "মেন্টরশিপ",
        quality: "কোয়ালিটি গেট",
        assignments: "অ্যাসাইনমেন্ট রিভিউ",
        credentials: "মাইক্রো-ক্রেডেনশিয়াল",
        roadmap: "রোডম্যাপ",
        trust: "ট্রাস্ট সিগনাল",
        audit: "অডিট ট্রেইল"
      }
    },
    banners: {
      demo: "ডেমো মোড চলছে ;  Firebase কনফিগার করলে লাইভ ডেটা আসবে।"
    }
  },
  en: {
    nav: {
      dashboard: "Overview",
      courses: "Courses & Lectures",
      manual: "Quick Start",
      resources: "Resource Library",
      roadmap: "Study Roadmap",
      community: "Community Feed",
      coop: "Co-op Hub",
      admin: "Admin"
    },
    hero: {
      title: "EquiSaaS BD LMS",
      subtitle: "Free, cooperative learning platform",
      desc: "Learn, build, and contribute to real SaaS products with equal ownership."
    },
    stats: {
      active: "Active Paths",
      progress: "Progress",
      community: "Community"
    },
    actions: {
      signIn: "Sign in",
      signOut: "Sign out",
      join: "Join Now",
      viewCourse: "Open Lectures",
      markComplete: "Mark Complete",
      addCourse: "New Course",
      addLesson: "New Lesson",
      moveUp: "Move up",
      moveDown: "Move down",
      save: "Save",
      close: "Close",
      submit: "Submit",
      approve: "Approve",
      assign: "Assign",
      voteYes: "Vote Yes",
      voteNo: "Vote No",
      enroll: "Enroll",
      requestJoin: "Request Join",
      upvote: "Upvote",
      issue: "Issue",
      startLearning: "Start learning",
      preview: "Preview",
      chooseTrack: "Choose track",
      saveTrack: "Save track",
      exportEquityLedger: "Download equity ledger (JSON)",
      copyTrackInviteLink: "Copy track invite link",
      selectDistrict: "District (optional)",
      districtHint: "All 64 districts : used on public profile & invite links",
      addPath: "Add path",
      addModule: "Add module",
      addMonthly: "Add monthly activity",
      addItem: "Add item",
      submitAssignment: "Submit assignment",
      resubmit: "Resubmit",
      review: "Review",
      exportCsv: "Export CSV",
      viewSubmission: "View submission",
      remove: "Remove"
    },
    labels: {
      courseTitleBn: "Course title (Bangla)",
      courseTitleEn: "Course title (English)",
      courseDescBn: "Course description (Bangla)",
      courseDescEn: "Course description (English)",
      level: "Level",
      language: "Language",
      badge: "Badge/Tag",
      lessons: "Lesson count",
      published: "Published",
      courseSelect: "Select course",
      lessonTitleBn: "Lesson title (Bangla)",
      lessonTitleEn: "Lesson title (English)",
      order: "Order",
      lessonOrder: "Lesson order",
      lessonCount: "Total lessons",
      noLessons: "No lessons yet for this course.",
      selectCourseManage: "Select a course to manage order.",
      submitContribution: "Submit Contribution",
      title: "Title",
      type: "Type",
      points: "Points",
      hours: "Hours",
      status: "Status",
      month: "Month",
      revenue: "Revenue",
      costs: "Costs",
      members: "Members",
      avgMembers: "Avg members",
      entries: "Entries",
      netLabel: "Net",
      avgShare: "Avg share/member",
      totalSignals: "Total signals",
      avgScore: "Average score",
      totalScore: "Total score",
      submissionLink: "Submission link",
      submissionNotes: "Submission notes",
      reviewNote: "Review note",
      assignmentSubmissions: "Assignment submissions",
      auditTrail: "Audit trail",
      statusPending: "Pending",
      statusApproved: "Approved",
      statusRejected: "Needs rework",
      rolePlaybook: "Role playbook",
      roleSelect: "Select a role",
      steps: "Steps",
      weeklyRhythm: "Weekly rhythm",
      deliverables: "Deliverables",
      tools: "Tools",
      summary: "Summary",
      deadline: "Deadline",
      link: "Link",
      sourceLang: "Source language",
      targetLang: "Target language",
      mentor: "Mentor",
      mentee: "Mentee",
      checklist: "Checklist",
      badgeLabel: "Badge",
      levelLabel: "Level",
      eta: "ETA",
      signal: "Signal",
      empty: "No data yet.",
      coopSignIn: "Sign in to access co-op data.",
      departments: "Departments",
      subdepartments: "Sub-departments",
      paths: "Learning paths",
      modules: "Modules",
      path: "Path",
      overview: "Overview",
      contentTab: "Content",
      aboutTab: "About",
      duration: "Duration",
      lessonsLabel: "Lessons",
      searchModule: "Search modules or lessons",
      filterLevel: "Filter level",
      activePaths: "Active paths",
      prerequisites: "Prerequisites",
      outcomes: "Learning outcomes",
      noModules: "No modules yet for this path.",
      trustLedger: "Trust Ledger",
      communityUpdates: "Community Updates",
      resourcesTitle: "Resources",
      communityTitle: "Community",
      chooseTrackTitle: "Choose your track",
      chooseTrackDesc: "After login, choose your department and sub-department.",
      selectDept: "Select department",
      selectSubdept: "Select sub-department",
      selectPath: "Select path",
      monthlyActivities: "Monthly activities",
      pathTitleBn: "Path title (Bangla)",
      pathTitleEn: "Path title (English)",
      pathDescBn: "Path description (Bangla)",
      pathDescEn: "Path description (English)",
      moduleTitleBn: "Module title (Bangla)",
      moduleTitleEn: "Module title (English)",
      moduleSummaryBn: "Module summary (Bangla)",
      moduleSummaryEn: "Module summary (English)",
      itemTitleBn: "Item title (Bangla)",
      itemTitleEn: "Item title (English)",
      videoUrl: "Video URL",
      resourceUrl: "Resource link",
      programTitleBn: "Program title (Bangla)",
      programTitleEn: "Program title (English)",
      yourTrack: "Your track",
      openLink: "Open link",
      roadmapBuilder: "Roadmap Builder",
      roadmapOverview: "Roadmap Overview"
    },
    coop: {
      title: "Co-op Hub",
      subtitle: "Transparency, governance, and community operations",
      tabs: {
        ledger: "Contribution Ledger",
        payouts: "Profit Share",
        governance: "Governance",
        pathways: "Skill Pathways",
        squads: "Product Squads",
        translations: "Translation Queue",
        mentorship: "Mentorship",
        quality: "Quality Gates",
        assignments: "Assignment Review",
        credentials: "Micro-credentials",
        roadmap: "Roadmap",
        trust: "Trust Signals",
        audit: "Audit Trail"
      }
    },
    banners: {
      demo: "Demo mode is active ;  add Firebase config for live data."
    }
  }
};
// Initialize Analytics (safe ;  silently no-ops if not supported)
if (app) initAnalytics(app);
const mockCourses = [{
  id: "course-react",
  title: "React + Next.js Masterclass",
  titleBn: "React + Next.js মাস্টারক্লাস",
  titleEn: "React + Next.js Masterclass",
  level: "Intermediate",
  lang: "EN+BN",
  desc: "App Router, state architecture, performance, and production patterns.",
  descBn: "App Router, স্টেট আর্কিটেকচার, পারফরম্যান্স ও প্রোডাকশন প্যাটার্ন।",
  descEn: "App Router, state architecture, performance, and production patterns.",
  lessons: 12,
  badge: "Frontend",
  badgeBn: "ফ্রন্টএন্ড",
  badgeEn: "Frontend"
}, {
  id: "course-laravel",
  title: "Laravel + Node Backend",
  titleBn: "Laravel + Node ব্যাকএন্ড",
  titleEn: "Laravel + Node Backend",
  level: "Intermediate",
  lang: "EN+BN",
  desc: "APIs, data modeling, security, queues, and SaaS multi-tenancy.",
  descBn: "API, ডাটা মডেলিং, সিকিউরিটি, কিউ এবং SaaS মাল্টি-টেন্যান্সি।",
  descEn: "APIs, data modeling, security, queues, and SaaS multi-tenancy.",
  lessons: 10,
  badge: "Backend",
  badgeBn: "ব্যাকএন্ড",
  badgeEn: "Backend"
}, {
  id: "course-product",
  title: "Product & Business Analysis",
  titleBn: "প্রোডাক্ট ও বিজনেস অ্যানালাইসিস",
  titleEn: "Product & Business Analysis",
  level: "Beginner",
  lang: "EN+BN",
  desc: "Roadmaps, OKRs, discovery, and delivery rituals.",
  descBn: "রোডম্যাপ, OKR, ডিসকভারি ও ডেলিভারি রিচুয়াল।",
  descEn: "Roadmaps, OKRs, discovery, and delivery rituals.",
  lessons: 8,
  badge: "Product",
  badgeBn: "প্রোডাক্ট",
  badgeEn: "Product"
}];
const DEFAULT_PATH = PATHS[0];
const LEVEL_OPTIONS = [{
  id: "Beginner",
  labelBn: "শুরু",
  labelEn: "Beginner"
}, {
  id: "Intermediate",
  labelBn: "মধ্যম",
  labelEn: "Intermediate"
}, {
  id: "Advanced",
  labelBn: "অ্যাডভান্সড",
  labelEn: "Advanced"
}];
const mockLedger = [{
  name: "UI Sprint",
  points: 12,
  status: "Approved"
}, {
  name: "Backend Review",
  points: 9,
  status: "Pending"
}, {
  name: "Marketing Assets",
  points: 7,
  status: "Approved"
}];
const mockAnnouncements = [{
  title: "Sprint 02 Started",
  desc: "Focus: POS MVP onboarding flow."
}, {
  title: "Revenue Share Update",
  desc: "February payout report published."
}];
const RESOURCES = [{
  title: "React Docs",
  url: "https://react.dev/",
  tag: "EN"
}, {
  title: "Laravel Docs",
  url: "https://laravel.com/docs",
  tag: "EN"
}, {
  title: "Learn With Sumit",
  url: "https://learnwithsumit.com/",
  tag: "BN"
}, {
  title: "Hablu Programmer",
  url: "https://hablu-programmer.com/",
  tag: "BN"
}, {
  title: "Figma Learn",
  url: "https://help.figma.com/",
  tag: "EN"
}];
const navItems = [{
  id: "dashboard",
  icon: LayoutDashboard,
  labelKey: "dashboard",
  descBn: "অগ্রগতি, টিম পালস, আর দ্রুত অ্যাকশন",
  descEn: "Progress, team pulse, and quick actions"
}, {
  id: "courses",
  icon: BookOpen,
  labelKey: "courses",
  descBn: "ট্র্যাক, মডিউল, আর সব লেকচার",
  descEn: "Tracks, modules, and every lecture"
}, {
  id: "manual",
  icon: Compass,
  labelKey: "manual",
  descBn: "Foundation, flow, আর কোথা থেকে শুরু করবেন",
  descEn: "Foundation, flow, and where to start"
}, {
  id: "roadmap",
  icon: PlayCircle,
  labelKey: "roadmap",
  descBn: "মাসভিত্তিক শেখা ও ডেলিভারি পরিকল্পনা",
  descEn: "Month-by-month learning and delivery plan"
}, {
  id: "resources",
  icon: Layers,
  labelKey: "resources",
  descBn: "ফ্রি গাইড, টুলস, আর রেফারেন্স",
  descEn: "Free guides, tools, and references"
}, {
  id: "community",
  icon: Users,
  labelKey: "community",
  descBn: "স্কোয়াড আপডেট, handoff, আর চ্যানেল",
  descEn: "Squad updates, handoffs, and channels"
}, {
  id: "coop",
  icon: Sparkles,
  labelKey: "coop",
  descBn: "টাস্ক, সাবমিশন, কন্ট্রিবিউশন, আর গভর্ন্যান্স",
  descEn: "Tasks, submissions, contribution, and governance"
}, {
  id: "admin",
  icon: ShieldCheck,
  labelKey: "admin",
  descBn: "ম্যানেজমেন্ট, কনফিগ, আর অপারেশন",
  descEn: "Management, configuration, and operations"
}];
const coopTabs = [{
  id: "ledger",
  key: "ledger"
}, {
  id: "payouts",
  key: "payouts"
}, {
  id: "governance",
  key: "governance"
}, {
  id: "pathways",
  key: "pathways"
}, {
  id: "squads",
  key: "squads"
}, {
  id: "translations",
  key: "translations"
}, {
  id: "mentorship",
  key: "mentorship"
}, {
  id: "quality",
  key: "quality"
}, {
  id: "assignments",
  key: "assignments"
}, {
  id: "credentials",
  key: "credentials"
}, {
  id: "roadmap",
  key: "roadmap"
}, {
  id: "trust",
  key: "trust"
}, {
  id: "audit",
  key: "audit"
}];
const ROLE_PLAYBOOKS = [{
  id: "member",
  titleBn: "কমিউনিটি মেম্বার",
  titleEn: "Community Member",
  summaryBn: "শিখুন, অ্যাসাইনমেন্ট করুন, স্কোয়াডে কন্ট্রিবিউট করুন।",
  summaryEn: "Learn, submit assignments, and contribute to squads.",
  stepsBn: ["ট্র্যাক নির্বাচন করুন", "মাসিক অ্যাসাইনমেন্ট সাবমিট করুন", "স্কোয়াড টাস্কে অংশ নিন"],
  stepsEn: ["Pick your track", "Submit monthly assignments", "Join squad tasks"],
  rhythmBn: ["সপ্তাহে ২টি লেসন", "১টি মিনি টাস্ক", "ফিডব্যাক রিভিউ"],
  rhythmEn: ["2 lessons weekly", "1 mini task", "Review feedback"],
  deliverablesBn: ["কমপ্লিটেড অ্যাসাইনমেন্ট", "কন্ট্রিবিউশন লগ"],
  deliverablesEn: ["Completed assignments", "Contribution log"],
  tools: ["LMS", "GitHub", "Support"]
}, {
  id: "squad-lead",
  titleBn: "স্কোয়াড লিড",
  titleEn: "Squad Lead",
  summaryBn: "রোডম্যাপ ভেঙে স্প্রিন্ট চালান এবং রিলিজ নিশ্চিত করুন।",
  summaryEn: "Break down roadmaps, run sprints, and ensure releases.",
  stepsBn: ["স্প্রিন্ট প্ল্যান করুন", "টাস্ক অ্যাসাইন করুন", "ডেমো ও রিলিজ দিন"],
  stepsEn: ["Plan sprints", "Assign tasks", "Demo and release"],
  rhythmBn: ["সপ্তাহিক প্ল্যানিং", "মিড‑উইক সিঙ্ক", "ডেমো শেয়ার"],
  rhythmEn: ["Weekly planning", "Mid-week sync", "Share demos"],
  deliverablesBn: ["স্প্রিন্ট বোর্ড", "রিলিজ নোট"],
  deliverablesEn: ["Sprint board", "Release notes"],
  tools: ["GitHub Projects", "Notion", "Figma"]
}, {
  id: "mentor",
  titleBn: "মেন্টর",
  titleEn: "Mentor",
  summaryBn: "লার্নারদের গাইড করুন এবং উন্নয়ন ট্র্যাক করুন।",
  summaryEn: "Guide learners and track growth milestones.",
  stepsBn: ["সাপ্তাহিক সেশন নিন", "ফিডব্যাক দিন", "প্রগতি নোট আপডেট করুন"],
  stepsEn: ["Run weekly sessions", "Give feedback", "Update progress notes"],
  rhythmBn: ["অফিস আওয়ার", "১:১ চেক‑ইন", "উন্নয়ন টাস্ক"],
  rhythmEn: ["Office hours", "1:1 check-ins", "Growth tasks"],
  deliverablesBn: ["মেন্টর নোট", "স্কিল গ্যাপ প্ল্যান"],
  deliverablesEn: ["Mentor notes", "Skill gap plan"],
  tools: ["LMS", "Meet", "Docs"]
}, {
  id: "reviewer",
  titleBn: "রিভিউয়ার/QA",
  titleEn: "Reviewer / QA",
  summaryBn: "কোয়ালিটি গেট পাস করাতে রিভিউ করুন।",
  summaryEn: "Review work to pass quality gates.",
  stepsBn: ["চেকলিস্ট রান করুন", "টেস্ট যাচাই করুন", "রিভিউ সাইন‑অফ"],
  stepsEn: ["Run checklists", "Verify tests", "Sign off review"],
  rhythmBn: ["দৈনিক রিভিউ উইন্ডো", "বাগ ট্যাগিং", "রিপোর্ট"],
  rhythmEn: ["Daily review window", "Bug tagging", "Reports"],
  deliverablesBn: ["রিভিউ রিপোর্ট", "QA সাইন‑অফ"],
  deliverablesEn: ["Review report", "QA sign-off"],
  tools: ["Checklist", "GitHub", "Test cases"]
}, {
  id: "translator",
  titleBn: "কনটেন্ট ট্রান্সলেটর",
  titleEn: "Content Translator",
  summaryBn: "বাংলা‑ইংরেজি কনটেন্ট কভারেজ বাড়ান।",
  summaryEn: "Increase Bangla/English content coverage.",
  stepsBn: ["কিউ থেকে আইটেম নিন", "অনুবাদ করুন", "পিয়ার রিভিউ নিন"],
  stepsEn: ["Pick from queue", "Translate", "Get peer review"],
  rhythmBn: ["সাপ্তাহিক ব্যাচ", "রিভিউ ফিডব্যাক", "কভারেজ আপডেট"],
  rhythmEn: ["Weekly batch", "Review feedback", "Coverage updates"],
  deliverablesBn: ["অনুবাদিত লেসন", "কভারেজ রিপোর্ট"],
  deliverablesEn: ["Translated lessons", "Coverage report"],
  tools: ["LMS", "Glossary", "Docs"]
}, {
  id: "growth",
  titleBn: "গ্রোথ + সাকসেস",
  titleEn: "Growth + Success",
  summaryBn: "অ্যাকুইজিশন, অনবোর্ডিং ও রিটেনশন ফোকাস।",
  summaryEn: "Focus on acquisition, onboarding, and retention.",
  stepsBn: ["ক্যাম্পেইন চালান", "CRM ফলো‑আপ", "রিপোর্ট শেয়ার"],
  stepsEn: ["Run campaigns", "CRM follow-ups", "Share reports"],
  rhythmBn: ["সাপ্তাহিক রিপোর্ট", "মাসিক KPI রিভিউ", "ইউজার ফিডব্যাক"],
  rhythmEn: ["Weekly reporting", "Monthly KPI review", "User feedback"],
  deliverablesBn: ["লিড রিপোর্ট", "সাকসেস প্লেবুক"],
  deliverablesEn: ["Lead report", "Success playbook"],
  tools: ["HubSpot", "Analytics", "Social"]
}, {
  id: "admin",
  titleBn: "অ্যাডমিন/স্টুয়ার্ড",
  titleEn: "Admin / Steward",
  summaryBn: "গভর্ন্যান্স, পেআউট ও অডিট ট্রেইল নিশ্চিত করুন।",
  summaryEn: "Ensure governance, payouts, and audit trails.",
  stepsBn: ["গভর্ন্যান্স রিভিউ", "পেআউট পাবলিশ", "অডিট লজ বজায় রাখুন"],
  stepsEn: ["Review governance", "Publish payouts", "Maintain audit logs"],
  rhythmBn: ["মাসিক ফাইন্যান্স রিভিউ", "কমিউনিটি আপডেট", "কমপ্লায়েন্স চেক"],
  rhythmEn: ["Monthly finance review", "Community update", "Compliance check"],
  deliverablesBn: ["পেআউট শীট", "অডিট লগ"],
  deliverablesEn: ["Payout sheet", "Audit log"],
  tools: ["Firebase", "Netlify", "Docs"]
}];
const App = () => {
  const [lang, setLang] = useState("bn");
  const [user, setUser] = useState(null);
  const [claimsAdmin, setClaimsAdmin] = useState(false);
  const [view, setView] = useState("dashboard");
  const [courses, setCourses] = useState(mockCourses);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [trackDeptId, setTrackDeptId] = useState(DEPARTMENTS[0]?.id || "");
  const [trackSubdeptId, setTrackSubdeptId] = useState(DEPARTMENTS[0]?.subdepartments?.[0]?.id || "");
  const [trackPathId, setTrackPathId] = useState(DEFAULT_PATH?.id || "");
  const [trackDistrictId, setTrackDistrictId] = useState("");
  const [roadmapsBySubdept, setRoadmapsBySubdept] = useState({});
  const [selectedDeptId, setSelectedDeptId] = useState(DEPARTMENTS[0]?.id || "");
  const [selectedSubdeptId, setSelectedSubdeptId] = useState(DEPARTMENTS[0]?.subdepartments?.[0]?.id || "");
  const [selectedPathId, setSelectedPathId] = useState(DEFAULT_PATH?.id || "");
  const [expandedModules, setExpandedModules] = useState(DEFAULT_PATH?.modules?.[0] ? [DEFAULT_PATH.modules[0].id] : []);
  const [pathTab, setPathTab] = useState("content");
  const [courseLaunchRequest, setCourseLaunchRequest] = useState(null);
  const [lessonsByCourse, setLessonsByCourse] = useState({});
  const [progress, setProgress] = useState({});
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [toast, setToast] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const deptAlias = { software: "engineering", business: "product" };
    const params = new URLSearchParams(window.location.search);
    const urlDept = params.get("dept") || params.get("department") || "";
    const urlSubdept = params.get("subdept") || params.get("sub") || "";
    const urlPath = params.get("path") || params.get("track") || "";
    const urlDistrict = params.get("district") || "";

    let preferredDeptId = urlDept ? deptAlias[urlDept] || urlDept : "";
    let preferredPathId = urlPath;
    let preferredSubdeptId = urlSubdept;

    if (!preferredDeptId) {
      const rawPreferredDeptId = window.sessionStorage.getItem("preferredDeptId") || window.sessionStorage.getItem("preferredDept") || "";
      preferredDeptId = deptAlias[rawPreferredDeptId] || rawPreferredDeptId;
    }
    if (!preferredPathId) preferredPathId = window.sessionStorage.getItem("preferredPathId") || "";

    const preferredPath = PATHS.find((path) => path.id === preferredPathId) || null;
    const preferredDept =
      DEPARTMENTS.find((dept) => dept.id === preferredDeptId) || DEPARTMENTS.find((dept) => dept.id === preferredPath?.deptId) || null;
    const resolvedSubdeptId = preferredSubdeptId || preferredPath?.subdeptId || preferredDept?.subdepartments?.[0]?.id || "";
    const nextPath = preferredPath || PATHS.find((path) => path.subdeptId === resolvedSubdeptId) || null;

    if (urlDistrict) {
      setTrackDistrictId(urlDistrict);
    }

    if (!preferredDept && !nextPath && !urlDistrict) return;

    if (preferredDept?.id) setSelectedDeptId(preferredDept.id);
    if (resolvedSubdeptId) setSelectedSubdeptId(resolvedSubdeptId);
    if (nextPath?.id) {
      setSelectedPathId(nextPath.id);
      setTrackDeptId(nextPath.deptId || preferredDept?.id || "");
      setTrackSubdeptId(nextPath.subdeptId || resolvedSubdeptId);
      setTrackPathId(nextPath.id);
      setExpandedModules(nextPath.modules?.[0] ? [nextPath.modules[0].id] : []);
      setView("courses");
    }

    window.sessionStorage.removeItem("preferredDeptId");
    window.sessionStorage.removeItem("preferredDept");
    window.sessionStorage.removeItem("preferredPathId");

    if (urlDept || urlSubdept || urlPath || urlDistrict || params.get("department") || params.get("track")) {
      const url = new URL(window.location.href);
      ["dept", "department", "subdept", "sub", "path", "track", "district"].forEach((k) => url.searchParams.delete(k));
      const q = url.searchParams.toString();
      window.history.replaceState({}, "", `${url.pathname}${q ? `?${q}` : ""}`);
    }
  }, []);
  const [adminMode, setAdminMode] = useState(false);
  const [adminTab, setAdminTab] = useState("course");
  const [adminCourseId, setAdminCourseId] = useState("");
  const [adminDeptId, setAdminDeptId] = useState(DEPARTMENTS[0]?.id || "");
  const [adminSubdeptId, setAdminSubdeptId] = useState(DEPARTMENTS[0]?.subdepartments?.[0]?.id || "");
  const [adminPathId, setAdminPathId] = useState("");
  const [adminModuleId, setAdminModuleId] = useState("");
  const [coopTab, setCoopTab] = useState("ledger");
  const [submissionModal, setSubmissionModal] = useState(false);
  const [submissionItem, setSubmissionItem] = useState(null);
  const [submissionLink, setSubmissionLink] = useState("");
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [reviewNotes, setReviewNotes] = useState({});
  const [attestationDrafts, setAttestationDrafts] = useState({});
  const [assignmentFilter, setAssignmentFilter] = useState("all");
  const [manualRoleId, setManualRoleId] = useState("member");
  const [accessRole, setAccessRole] = useState("member");
  const text = CONTENT[lang];
  // Analytics: track page view on every navigation
  usePageView(view);
  useEffect(() => {
    document.documentElement.lang = lang === "bn" ? "bn" : "en";
  }, [lang]);
  const isAdmin = claimsAdmin || adminMode || ["super-admin", "admin"].includes(accessRole);
  const {
    assignmentSubmissions,
    auditEntries,
    contributions,
    credentials,
    mentorRequests,
    pathways,
    payouts,
    proposalVotes,
    proposals,
    qualityGates,
    reviewQueueItems,
    roadmapItems,
    roadmapVotes,
    setAssignmentSubmissions,
    setAuditEntries,
    setContributions,
    setCredentials,
    setMentorRequests,
    setPathways,
    setPayouts,
    setProposalVotes,
    setProposals,
    setQualityGates,
    setReviewQueueItems,
    setRoadmapItems,
    setRoadmapVotes,
    setSquads,
    setTranslations,
    setTrustSignals,
    squads,
    translations,
    trustSignals,
  } = useCoopData({ db, user, isAdmin, view, coopTab });
  const {
    earnedBadgeIds,
    profile,
    publicProfileStats,
    setProfile,
    setPublicProfileStats,
    userRole,
  } = useProfileSync({
    db,
    isAdmin,
    roadmapsBySubdept,
    selectedDeptId,
    selectedPathId,
    selectedSubdeptId,
    setSelectedDeptId,
    setSelectedPathId,
    setSelectedSubdeptId,
    setShowTrackModal,
    setTrackDeptId,
    setTrackPathId,
    setTrackSubdeptId,
    showTrackModal,
    translations,
    mentorRequests,
    contributions,
    user,
  });
  const { latestAnnouncement } = useDashboardData({
    db,
    user,
    view,
    fallbackAnnouncement: mockAnnouncements[0],
  });
  const { hasUnreadAnnouncements, markAnnouncementsSeen } = useAnnouncementState({ user, latestAnnouncement });
  const roleBasedAdmin =
    claimsAdmin ||
    adminMode ||
    ["super-admin", "admin"].includes(accessRole) ||
    ["super-admin", "admin"].includes(profile?.role || userRole || "") ||
    (Array.isArray(profile?.roles) && profile.roles.some(role => ["super-admin", "admin"].includes(role)));
  const hasManagementAccess = roleBasedAdmin || isManagementRole(profile || { role: userRole || accessRole }, claimsAdmin);
  const visibleNavItems = navItems.filter(item => item.id !== "admin" || hasManagementAccess);
  const trackMemberAuditAction = async (action, meta, storageKey) => {
    if (typeof window === "undefined" || !user?.uid || !storageKey) return;
    if (window.localStorage.getItem(storageKey)) return;
    window.localStorage.setItem(storageKey, "1");
    try {
      await logAudit(action, meta, { allowMember: true });
    } catch (error) {
      window.localStorage.removeItem(storageKey);
    }
  };
  useEffect(() => {
    if (!user?.uid) return;
    const dayKey = dhakaDayKey();
    const storageKey = `eq_member_login:${user.uid}:${dayKey}`;
    trackMemberAuditAction("session.login", {
      districtId: profile?.districtId || "",
      pathId: profile?.pathId || selectedPathId || "",
    }, storageKey);
  }, [profile?.districtId, profile?.pathId, selectedPathId, user?.uid]);
  useEffect(() => {
    if (!user?.uid || !selectedPathId) return;
    const pathMeta = PATHS.find(item => item.id === selectedPathId);
    const dayKey = dhakaDayKey();
    const storageKey = `eq_member_path_open:${user.uid}:${selectedPathId}:${dayKey}`;
    trackMemberAuditAction("learning.path-open", {
      pathId: selectedPathId,
      deptId: pathMeta?.deptId || selectedDeptId || "",
      subdeptId: pathMeta?.subdeptId || selectedSubdeptId || "",
      districtId: profile?.districtId || "",
    }, storageKey);
  }, [profile?.districtId, selectedDeptId, selectedPathId, selectedSubdeptId, user?.uid]);
  const payoutSummary = useMemo(() => {
    const totals = payouts.reduce((acc, item) => {
      acc.revenue += Number(item.revenue || 0);
      acc.costs += Number(item.costs || 0);
      acc.net += Number(item.net || 0);
      acc.members += Number(item.members || 0);
      acc.share += Number(item.share || 0);
      acc.count += 1;
      return acc;
    }, {
      revenue: 0,
      costs: 0,
      net: 0,
      members: 0,
      share: 0,
      count: 0
    });
    const avgShare = totals.count ? Math.round(totals.share / totals.count) : 0;
    const avgMembers = totals.count ? Math.round(totals.members / totals.count) : 0;
    return {
      ...totals,
      avgShare,
      avgMembers
    };
  }, [payouts]);
  const trustSummary = useMemo(() => {
    const total = trustSignals.length;
    const totalScore = trustSignals.reduce((sum, item) => sum + Number(item.score || 0), 0);
    const maxScore = trustSignals.reduce((max, item) => Math.max(max, Number(item.score || 0)), 0);
    const avgScore = total ? Math.round(totalScore / total) : 0;
    return {
      total,
      totalScore,
      maxScore,
      avgScore
    };
  }, [trustSignals]);
  const submissionMap = useMemo(() => {
    const map = {};
    assignmentSubmissions.forEach(item => {
      if (!item?.itemId) return;
      if (!map[item.itemId]) {
        map[item.itemId] = item;
      } else {
        const existing = map[item.itemId];
        const existingTime = existing?.createdAt?.seconds || 0;
        const nextTime = item?.createdAt?.seconds || 0;
        if (nextTime >= existingTime) map[item.itemId] = item;
      }
    });
    return map;
  }, [assignmentSubmissions]);
  const filteredSubmissions = useMemo(() => {
    if (assignmentFilter === "all") return assignmentSubmissions;
    return assignmentSubmissions.filter(item => item.status === assignmentFilter);
  }, [assignmentSubmissions, assignmentFilter]);
  const legacyReviewQueueItems = useMemo(() => reviewQueueItems.filter(item => item?.sourceType !== "task"), [reviewQueueItems]);
  const reviewQueueMap = useMemo(() => Object.fromEntries(legacyReviewQueueItems.map(item => [item?.submissionId || item?.id, item])), [legacyReviewQueueItems]);
  const peerReviewQueue = useMemo(() => {
    if (!user?.uid) return [];
    return legacyReviewQueueItems.filter(item => item?.uid !== user.uid && item?.status !== "approved" && item?.status !== "rejected" && !(item?.attestorIds || []).includes(user.uid)).sort((a, b) => {
      const priority = { "pending-peer": 0, "peer-reviewing": 1, "peer-rework": 2, "ready-for-admin": 3, approved: 4, rejected: 5 };
      const aPriority = priority[a?.peerStatus || "pending-peer"] ?? 99;
      const bPriority = priority[b?.peerStatus || "pending-peer"] ?? 99;
      if (aPriority !== bPriority) return aPriority - bPriority;
      return getTimestampValue(b?.updatedAt) - getTimestampValue(a?.updatedAt);
    });
  }, [legacyReviewQueueItems, user?.uid]);

  function getTimestampValue(value) {
    if (!value) return 0;
    if (typeof value === "string") {
      const parsed = Date.parse(value);
      return Number.isNaN(parsed) ? 0 : parsed;
    }
    if (typeof value === "number") return value;
    if (typeof value?.toMillis === "function") return value.toMillis();
    if (typeof value?.seconds === "number") return value.seconds * 1000;
    return 0;
  }

  function summarizeAttestationEntries(entries = [], cycle = 0) {
    const filtered = entries.filter(entry => Number(entry?.cycle || 0) === Number(cycle || 0));
    const readyCount = filtered.filter(entry => entry?.verdict === "ready").length;
    const needsWorkCount = filtered.filter(entry => entry?.verdict === "needs-work").length;
    const recent = [...filtered].sort((a, b) => getTimestampValue(b?.updatedAt || b?.createdAt) - getTimestampValue(a?.updatedAt || a?.createdAt)).slice(0, 4).map(entry => ({
      uid: entry?.uid || "",
      userName: entry?.userName || "Member",
      verdict: entry?.verdict || "ready",
      note: entry?.note || "",
      districtId: entry?.districtId || "",
      cycle: Number(entry?.cycle || 0),
      updatedAt: entry?.updatedAt || entry?.createdAt || null
    }));
    return {
      total: filtered.length,
      readyCount,
      needsWorkCount,
      lastAttestationAt: recent[0]?.updatedAt || null,
      recent,
      attestorIds: filtered.map(entry => entry?.uid).filter(Boolean)
    };
  }

  function getReviewQueueState(submissionStatus, summary) {
    if (submissionStatus === "approved") return "approved";
    if (submissionStatus === "rejected") return "rejected";
    if ((summary?.needsWorkCount || 0) >= 2 && (summary?.needsWorkCount || 0) > (summary?.readyCount || 0)) return "peer-rework";
    if ((summary?.readyCount || 0) >= 2 && (summary?.readyCount || 0) >= (summary?.needsWorkCount || 0)) return "ready-for-admin";
    if ((summary?.total || 0) > 0) return "peer-reviewing";
    return "pending-peer";
  }

  function buildReviewQueuePayload(submissionId, submission, summary) {
    return {
      id: submissionId,
      submissionId,
      uid: submission?.uid || "",
      userName: submission?.userName || "Member",
      districtId: submission?.districtId || "",
      deptId: submission?.deptId || "",
      subdeptId: submission?.subdeptId || "",
      pathId: submission?.pathId || "",
      pathTitleBn: submission?.pathTitleBn || "",
      pathTitleEn: submission?.pathTitleEn || "",
      month: submission?.month || "",
      activityId: submission?.activityId || "",
      itemId: submission?.itemId || "",
      itemTitleBn: submission?.itemTitleBn || "",
      itemTitleEn: submission?.itemTitleEn || "",
      link: submission?.link || "",
      notes: submission?.notes || "",
      status: submission?.status || "pending",
      reviewCycle: Number(submission?.reviewCycle || 0),
      reviewNote: submission?.reviewNote || "",
      reviewedBy: submission?.reviewedBy || "",
      reviewedAt: submission?.reviewedAt || null,
      createdAt: submission?.createdAt || null,
      updatedAt: submission?.updatedAt || new Date().toISOString(),
      peerStatus: getReviewQueueState(submission?.status || "pending", summary),
      attestationSummary: {
        total: summary?.total || 0,
        readyCount: summary?.readyCount || 0,
        needsWorkCount: summary?.needsWorkCount || 0,
        lastAttestationAt: summary?.lastAttestationAt || null
      },
      attestationPreview: summary?.recent || [],
      attestorIds: summary?.attestorIds || []
    };
  }

  function upsertReviewQueueItem(payload) {
    if (!payload?.submissionId && !payload?.id) return;
    setReviewQueueItems(prev => {
      const list = [payload, ...prev.filter(item => (item?.submissionId || item?.id) !== (payload.submissionId || payload.id))].sort((a, b) => getTimestampValue(b?.updatedAt) - getTimestampValue(a?.updatedAt));
      return list;
    });
  }

  async function syncReviewQueueDoc(submissionId, submissionData, attestationEntries = null) {
    if (!submissionId || !submissionData) return null;
    let entries = Array.isArray(attestationEntries) ? attestationEntries : [];
    if (!Array.isArray(attestationEntries) && db) {
      const snap = await getDocs(collection(db, "assignmentSubmissions", submissionId, "attestations"));
      entries = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    }
    const summary = summarizeAttestationEntries(entries, Number(submissionData?.reviewCycle || 0));
    const payload = buildReviewQueuePayload(submissionId, submissionData, summary);
    if (!db) {
      upsertReviewQueueItem({ ...payload, localAttestations: entries });
      return payload;
    }
    await setDoc(doc(db, "reviewQueue", submissionId), {
      ...payload,
      updatedAt: serverTimestamp()
    }, { merge: true });
    upsertReviewQueueItem({ ...payload, updatedAt: new Date().toISOString() });
    return payload;
  }
  const activeRole = useMemo(() => ROLE_PLAYBOOKS.find(role => role.id === manualRoleId) || ROLE_PLAYBOOKS[0], [manualRoleId]);

  useEffect(() => {
    if (!userRole) return;
    if (ROLE_PLAYBOOKS.some(role => role.id === userRole)) {
      setManualRoleId(userRole);
    }
  }, [userRole]);
  useEffect(() => {
    if (view === "admin" && !isAdmin) {
      setView("dashboard");
    }
  }, [isAdmin, view]);
  useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u || null);
      if (!u) {
        setClaimsAdmin(false);
        setAccessRole("member");
        setProgress({});
        return;
      }
      u.getIdTokenResult(true).then(token => {
        setClaimsAdmin(!!token.claims.admin);
      });
    });
    return () => unsub();
  }, []);
  useEffect(() => {
    if (!db || !user?.uid) {
      setAccessRole("member");
      return undefined;
    }
    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (snap) => {
      setAccessRole(snap.data()?.role || "member");
    });
    return () => unsubscribe();
  }, [db, user?.uid]);
  useEffect(() => {
    const shouldSyncCourses = Boolean(db) && (view === "dashboard" || view === "courses" || view === "admin");
    if (!shouldSyncCourses) return;
    const cacheKey = "eq_courses_cache";
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        setCourses(JSON.parse(cached));
      } catch (e) {
        console.error(e);
      }
    }
    const baseRef = collection(db, "courses");
    const q = isAdmin ? baseRef : query(baseRef, where("published", "==", true));
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      const nextCourses = items.length ? items : mockCourses;
      setCourses(nextCourses);
      localStorage.setItem(cacheKey, JSON.stringify(nextCourses));
    });
    return () => unsub();
  }, [db, isAdmin, view]);
  useEffect(() => {
    const shouldSyncRoadmaps = Boolean(db) && (
      showTrackModal ||
      view === "dashboard" ||
      view === "courses" ||
      view === "roadmap" ||
      view === "community" ||
      view === "admin"
    );
    if (!shouldSyncRoadmaps) return;
    const cacheKey = "eq_roadmaps_cache";
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        setRoadmapsBySubdept(JSON.parse(cached));
      } catch (e) {
        console.error(e);
      }
    }
    const ref = collection(db, "lmsRoadmaps");
    const unsub = onSnapshot(query(ref, limit(20)), (snap) => {
      const next = {};
      snap.forEach((docSnap) => {
        next[docSnap.id] = { id: docSnap.id, ...docSnap.data() };
      });
      setRoadmapsBySubdept(next);
      localStorage.setItem(cacheKey, JSON.stringify(next));
    });
    return () => unsub();
  }, [db, showTrackModal, view]);
  useEffect(() => {
    if (!db || !user) {
      setProgress({});
      return;
    }
    if (!(view === "dashboard" || view === "courses")) return;
    const progressRef = collection(db, "users", user.uid, "progress");
    const unsub = onSnapshot(progressRef, (snap) => {
      const next = {};
      snap.forEach((docSnap) => {
        next[docSnap.id] = docSnap.data().completedLessonIds || [];
      });
      setProgress(next);
    });
    return () => unsub();
  }, [db, user, view]);
  useEffect(() => {
    if (!db || !selectedCourse || !(view === "dashboard" || view === "courses")) return;
    const lessonsRef = collection(db, "courses", selectedCourse.id, "lessons");
    const q = query(lessonsRef, orderBy("order", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setLessonsByCourse((prev) => ({
        ...prev,
        [selectedCourse.id]: items,
      }));
    });
    return () => unsub();
  }, [db, selectedCourse, view]);
  useEffect(() => {
    if (!db || !isAdmin || !adminCourseId || view !== "admin") return;
    const lessonsRef = collection(db, "courses", adminCourseId, "lessons");
    const q = query(lessonsRef, orderBy("order", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setLessonsByCourse((prev) => ({
        ...prev,
        [adminCourseId]: items,
      }));
    });
    return () => unsub();
  }, [adminCourseId, db, isAdmin, view]);
  useEffect(() => {
    if (!adminCourseId && courses.length) {
      setAdminCourseId(courses[0].id);
    }
  }, [adminCourseId, courses]);
  useEffect(() => {
    const dept = DEPARTMENTS.find(item => item.id === adminDeptId) || DEPARTMENTS[0];
    const sub = dept?.subdepartments?.[0];
    if (sub?.id && sub.id !== adminSubdeptId) {
      setAdminSubdeptId(sub.id);
    }
  }, [adminDeptId]);
  useEffect(() => {
    if (!adminSubdeptId) return;
    const roadmap = getRoadmapForSubdept(adminSubdeptId);
    const paths = roadmap.paths || [];
    const nextPath = paths.find(item => item.id === adminPathId) || paths[0];
    if (nextPath && nextPath.id !== adminPathId) {
      setAdminPathId(nextPath.id);
    }
    const modules = nextPath?.modules || [];
    const nextModule = modules.find(item => item.id === adminModuleId) || modules[0];
    if (nextModule && nextModule.id !== adminModuleId) {
      setAdminModuleId(nextModule.id);
    }
  }, [adminSubdeptId, roadmapsBySubdept]);
  useEffect(() => {
    if (!adminSubdeptId || !adminPathId) return;
    const roadmap = getRoadmapForSubdept(adminSubdeptId);
    const path = (roadmap.paths || []).find(item => item.id === adminPathId);
    const modules = path?.modules || [];
    const nextModule = modules.find(item => item.id === adminModuleId) || modules[0];
    if (nextModule && nextModule.id !== adminModuleId) {
      setAdminModuleId(nextModule.id);
    }
  }, [adminPathId, adminSubdeptId, roadmapsBySubdept]);
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const haystack = [course.title, course.titleBn, course.titleEn, course.desc, course.descBn, course.descEn, course.badge, course.badgeBn, course.badgeEn].filter(Boolean).join(" ").toLowerCase();
      const matchSearch = haystack.includes(search.toLowerCase());
      const matchFilter = filter === "all" || course.level === filter;
      return matchSearch && matchFilter;
    });
  }, [courses, search, filter]);
  const getCourseTitle = course => lang === "bn" ? course.titleBn || course.title : course.titleEn || course.title;
  const getCourseDesc = course => lang === "bn" ? course.descBn || course.desc : course.descEn || course.desc;
  const getCourseBadge = course => lang === "bn" ? course.badgeBn || course.badge : course.badgeEn || course.badge;
  const getLessonTitle = lesson => lang === "bn" ? lesson.titleBn || lesson.title : lesson.titleEn || lesson.title;
  const getLocalized = (item, key) => {
    if (!item) return "";
    const bnKey = `${key}Bn`;
    const enKey = `${key}En`;
    return lang === "bn" ? item[bnKey] || item[enKey] || item[key] || "" : item[enKey] || item[bnKey] || item[key] || "";
  };
  const getPathTitle = path => getLocalized(path, "title");
  const getPathDesc = path => getLocalized(path, "desc");
  const getModuleTitle = module => getLocalized(module, "title");
  const getModuleSummary = module => getLocalized(module, "summary");
  const getPrereq = path => getLocalized(path, "prereq");
  const getOutcomes = path => lang === "bn" ? path?.outcomesBn || [] : path?.outcomesEn || [];
  const getLessonType = lesson => getLocalized(lesson, "type");
  const getLevelLabel = level => {
    const entry = LEVEL_OPTIONS.find(item => item.id === level);
    if (!entry) return level || "";
    return lang === "bn" ? entry.labelBn : entry.labelEn;
  };
  const formatMonth = value => {
    if (!value) return "";
    const [year, month] = String(value).split("-");
    if (!year || !month) return value;
    const date = new Date(Number(year), Number(month) - 1, 1);
    return date.toLocaleString(lang === "bn" ? "bn-BD" : "en-US", {
      month: "long",
      year: "numeric"
    });
  };
  const formatDateTime = value => {
    if (!value) return "";
    const date = value?.seconds ? new Date(value.seconds * 1000) : new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleString(lang === "bn" ? "bn-BD" : "en-US");
  };
  const getSubmissionStatus = status => {
    if (!status) return text.labels.statusPending;
    if (status === "approved") return text.labels.statusApproved;
    if (status === "rejected") return text.labels.statusRejected;
    return text.labels.statusPending;
  };
  const isAssignmentItem = item => {
    const typeEn = String(item?.typeEn || "").toLowerCase();
    const typeBn = String(item?.typeBn || "");
    return typeEn.includes("assignment") || typeBn.includes("অ্যাসাইনমেন্ট");
  };
  const formatNumber = value => new Intl.NumberFormat(lang === "bn" ? "bn-BD" : "en-US").format(Number(value || 0));
  const renderLessonLinks = (lesson, options = {}) => {
    const links = [];
    if (lesson?.videoUrl) links.push({
      url: lesson.videoUrl,
      tag: "BN"
    });
    if (lesson?.resourceUrl) links.push({
      url: lesson.resourceUrl,
      tag: "EN"
    });
    if (!links.length) return null;
    return <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">            {links.map(link => <a key={link.url} href={link.url} target="_blank" rel="noreferrer" onClick={options.stopPropagation ? e => e.stopPropagation() : undefined} className="inline-flex items-center gap-2 text-brand-blue">                <span className="rounded-full border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide">                  {link.tag}                </span>                {text.labels.openLink}              </a>)}          </div>;
  };
  const slugify = (value, fallback) => {
    const slug = String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    return slug || fallback;
  };
  const clone = value => JSON.parse(JSON.stringify(value || {}));
  const findDeptBySubdept = subdeptId => DEPARTMENTS.find(dept => (dept.subdepartments || []).some(sub => sub.id === subdeptId));
  const getMergedPathsForSubdept = (subdeptId, overridePaths = []) => {
    const basePaths = PATHS.filter(path => path.subdeptId === subdeptId);
    if (basePaths.length) return clone(basePaths);
    return clone(overridePaths || []);
  };
  const getRoadmapForSubdept = subdeptId => {
    if (!subdeptId) return {
      paths: [],
      monthlyActivities: []
    };
    const override = roadmapsBySubdept[subdeptId];
    const mergedPaths = getMergedPathsForSubdept(subdeptId, override?.paths || []);
    if (override?.paths?.length || override?.monthlyActivities?.length) return {
      ...clone(override),
      subdeptId,
      deptId: override?.deptId || findDeptBySubdept(subdeptId)?.id || "",
      paths: mergedPaths
    };
    return {
      subdeptId,
      deptId: findDeptBySubdept(subdeptId)?.id || "",
      paths: mergedPaths,
      monthlyActivities: []
    };
  };
  const persistRoadmap = async (subdeptId, roadmap, message) => {
    if (!subdeptId) return;
    const deptId = roadmap.deptId || findDeptBySubdept(subdeptId)?.id || "";
    const payload = {
      subdeptId,
      deptId,
      paths: roadmap.paths || [],
      monthlyActivities: roadmap.monthlyActivities || [],
      updatedAt: db ? serverTimestamp() : new Date().toISOString()
    };
    if (!db) {
      setRoadmapsBySubdept(prev => ({
        ...prev,
        [subdeptId]: payload
      }));
      if (message) showToast(message);
      return;
    }
    await setDoc(doc(db, "lmsRoadmaps", subdeptId), payload, {
      merge: true
    });
    if (message) showToast(message);
  };
  const selectedDept = useMemo(() => DEPARTMENTS.find(dept => dept.id === selectedDeptId) || DEPARTMENTS[0], [selectedDeptId]);
  const selectedSubdept = useMemo(() => selectedDept?.subdepartments?.find(sub => sub.id === selectedSubdeptId) || selectedDept?.subdepartments?.[0], [selectedDept, selectedSubdeptId]);
  const visibleDepartments = DEPARTMENTS;
  const visibleSubdepartments = selectedDept?.subdepartments || [];
  useEffect(() => {
    if (!visibleDepartments.length) return;
    if (!visibleDepartments.some(dept => dept.id === selectedDeptId)) {
      const dept = visibleDepartments[0];
      const sub = dept?.subdepartments?.[0];
      const path = getRoadmapForSubdept(sub?.id).paths?.[0];
      setSelectedDeptId(dept?.id || "");
      setSelectedSubdeptId(sub?.id || "");
      setSelectedPathId(path?.id || "");
      setExpandedModules(path?.modules?.[0] ? [path.modules[0].id] : []);
    }
  }, [visibleDepartments, selectedDeptId, roadmapsBySubdept]);
  useEffect(() => {
    if (!visibleSubdepartments.length) return;
    if (!visibleSubdepartments.some(sub => sub.id === selectedSubdeptId)) {
      const sub = visibleSubdepartments[0];
      const path = getRoadmapForSubdept(sub?.id).paths?.[0];
      setSelectedSubdeptId(sub?.id || "");
      setSelectedPathId(path?.id || "");
      setExpandedModules(path?.modules?.[0] ? [path.modules[0].id] : []);
    }
  }, [visibleSubdepartments, selectedSubdeptId, roadmapsBySubdept]);
  const availablePaths = useMemo(() => {
    if (!selectedSubdept) return [];
    return getRoadmapForSubdept(selectedSubdept.id).paths || [];
  }, [selectedSubdept, roadmapsBySubdept]);
  const filteredPaths = useMemo(() => {
    if (filter === "all") return availablePaths;
    const matches = availablePaths.filter(path => path.level === filter);
    return matches.length ? matches : availablePaths;
  }, [availablePaths, filter]);
  const selectedPath = useMemo(() => availablePaths.find(path => path.id === selectedPathId) || availablePaths[0] || PATHS[0], [selectedPathId, availablePaths]);
  const trackDept = useMemo(() => DEPARTMENTS.find(dept => dept.id === trackDeptId) || DEPARTMENTS[0], [trackDeptId]);
  const trackSubdepartments = trackDept?.subdepartments || [];
  const trackSubdept = trackSubdepartments.find(sub => sub.id === trackSubdeptId) || trackSubdepartments[0];
  const trackRoadmap = useMemo(() => getRoadmapForSubdept(trackSubdeptId), [trackSubdeptId, roadmapsBySubdept]);
  const trackPaths = trackRoadmap.paths || [];
  const adminRoadmap = useMemo(() => getRoadmapForSubdept(adminSubdeptId), [adminSubdeptId, roadmapsBySubdept]);
  const adminPaths = adminRoadmap.paths || [];
  const adminActivePath = adminPaths.find(path => path.id === adminPathId) || adminPaths[0];
  const adminModules = adminActivePath?.modules || [];
  const adminActiveModule = adminModules.find(item => item.id === adminModuleId) || adminModules[0];
  const monthlyActivities = useMemo(() => {
    if (!selectedSubdept) return [];
    return roadmapsBySubdept[selectedSubdept.id]?.monthlyActivities || [];
  }, [selectedSubdept, roadmapsBySubdept]);
  const filteredModules = useMemo(() => {
    if (!selectedPath) return [];
    const query = search.trim().toLowerCase();
    if (!query) return selectedPath.modules || [];
    return (selectedPath.modules || []).filter(module => {
      const moduleText = [module.title, module.titleBn, module.titleEn, module.summary, module.summaryBn, module.summaryEn].filter(Boolean).join(" ").toLowerCase();
      const lessonMatch = (module.lessons || []).some(lesson => {
        const lessonText = [lesson.title, lesson.titleBn, lesson.titleEn, lesson.type, lesson.typeBn, lesson.typeEn].filter(Boolean).join(" ").toLowerCase();
        return lessonText.includes(query);
      });
      return moduleText.includes(query) || lessonMatch;
    });
  }, [selectedPath, search, lang]);
  useEffect(() => {
    if (!selectedPath) return;
    if (!filteredPaths.find(path => path.id === selectedPath.id)) {
      const next = filteredPaths[0] || availablePaths[0] || PATHS[0];
      if (next && next.id !== selectedPathId) {
        setSelectedPathId(next.id);
        setExpandedModules(next.modules?.[0] ? [next.modules[0].id] : []);
      }
    }
  }, [filteredPaths, availablePaths, selectedPath, selectedPathId]);
  const totalLessons = useMemo(() => {
    return courses.reduce((sum, course) => {
      const fallback = Number(course.lessons || 0);
      const lessonList = lessonsByCourse[course.id];
      return sum + (lessonList ? lessonList.length : fallback);
    }, 0);
  }, [courses, lessonsByCourse]);
  const completedLessons = useMemo(() => {
    return Object.values(progress).reduce((sum, ids) => sum + (ids?.length || 0), 0);
  }, [progress]);
  const progressPercent = totalLessons ? Math.min(100, Math.round(completedLessons / totalLessons * 100)) : 0;
  const currentPathModuleCount = selectedPath?.modules?.length || 0;
  const currentPathLessonCount = useMemo(() => (selectedPath?.modules || []).reduce((sum, module) => sum + (module.lessons?.length || 0), 0), [selectedPath]);
  const currentPathCompletedCount = useMemo(() => (selectedPath?.id ? (progress[selectedPath.id] || []).length : 0), [progress, selectedPath?.id]);
  const currentPathRemainingCount = Math.max(currentPathLessonCount - currentPathCompletedCount, 0);
  const nextLessonTarget = useMemo(() => {
    if (!selectedPath?.id) return null;
    const completed = progress[selectedPath.id] || [];
    for (const moduleItem of selectedPath.modules || []) {
      for (const lesson of moduleItem.lessons || []) {
        if (!completed.includes(lesson.id)) return { moduleItem, lesson };
      }
    }
    const firstModule = selectedPath.modules?.[0];
    const firstLesson = firstModule?.lessons?.[0];
    return firstLesson ? { moduleItem: firstModule, lesson: firstLesson } : null;
  }, [progress, selectedPath]);
  const dashboardPathCards = useMemo(() => {
    const pool = filteredPaths.length ? filteredPaths : availablePaths.length ? availablePaths : PATHS;
    const seen = new Set();
    const next = [];
    if (selectedPath?.id) {
      seen.add(selectedPath.id);
      next.push(selectedPath);
    }
    for (const item of pool) {
      if (!item?.id || seen.has(item.id)) continue;
      seen.add(item.id);
      next.push(item);
      if (next.length >= 3) break;
    }
    return next;
  }, [availablePaths, filteredPaths, selectedPath]);
  const showToast = msg => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };
  const openCommunityFeed = () => {
    markAnnouncementsSeen();
    setView("community");
    setSelectedCourse(null);
  };
  const openQuickStart = () => {
    setView("manual");
    setSelectedCourse(null);
  };
  const openStudyRoadmap = () => {
    setView("roadmap");
    setSelectedCourse(null);
  };
  const openResourcesLibrary = () => {
    setView("resources");
    setSelectedCourse(null);
  };
  const openCoopTaskCenter = () => {
    setView("coop");
    setCoopTab("governance");
    setSelectedCourse(null);
  };
  const handleDashboardPathOpen = (pathId, mode) => {
    const targetPath = availablePaths.find(item => item.id === pathId) || PATHS.find(item => item.id === pathId);
    openLearningWorkspace(pathId, mode);
    if (targetPath?.id) {
      trackEvent("select_learning_path", {
        path_id: targetPath.id,
        path_title: getPathTitle(targetPath)
      });
    }
  };
  const copyPublicProfileLink = async () => {
    if (!publicProfileUrl) return;
    try {
      await navigator.clipboard.writeText(publicProfileUrl);
      showToast(lang === "bn" ? "পাবলিক প্রোফাইল লিংক কপি হয়েছে।" : "Public profile link copied.");
    } catch (error) {
      console.error(error);
      showToast(lang === "bn" ? "লিংক কপি করা যায়নি।" : "Could not copy the profile link.");
    }
  };
  const getAuthErrorMessage = err => {
    const code = String(err?.code || "");
    if (code === "auth/invalid-email") return lang === "bn" ? "ইমেইল ঠিক নয়।" : "Invalid email address.";
    if (code === "auth/user-not-found") return lang === "bn" ? "ইউজার পাওয়া যায়নি।" : "User not found.";
    if (code === "auth/wrong-password") return lang === "bn" ? "পাসওয়ার্ড ভুল।" : "Incorrect password.";
    if (code === "auth/invalid-credential") return lang === "bn" ? "ইমেইল/পাসওয়ার্ড মিলছে না।" : "Invalid credentials.";
    if (code === "auth/email-already-in-use") return lang === "bn" ? "এই ইমেইলে আগেই অ্যাকাউন্ট আছে।" : "Email already in use.";
    if (code === "auth/weak-password") return lang === "bn" ? "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" : "Password should be at least 6 characters.";
    if (code === "auth/operation-not-allowed") {
      return lang === "bn"
        ? "Firebase Auth-এ Email/Password বা Google সাইন-ইন চালু নেই।"
        : "Email/Password or Google provider is disabled in Firebase Auth.";
    }
    if (code === "auth/unauthorized-domain") {
      return lang === "bn"
        ? "এই ডোমেইনটি Firebase Auth-এ অনুমোদিত নয়।"
        : "This domain is not authorized in Firebase Auth.";
    }
    if (code === "auth/popup-closed-by-user") {
      return lang === "bn" ? "সাইন-ইন পপআপ বন্ধ করা হয়েছে।" : "Popup was closed.";
    }
    if (code === "auth/too-many-requests") {
      return lang === "bn" ? "অনেকবার চেষ্টা হয়েছে, পরে আবার দিন।" : "Too many attempts. Try again later.";
    }
    return lang === "bn" ? "সাইন ইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।" : "Sign in failed. Please try again.";
  };
  const handleGoogle = async () => {
    if (!auth) return showToast("Firebase config missing.");
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      setShowAuth(false);
    } catch (err) {
      showToast(getAuthErrorMessage(err));
    }
  };
  const handleEmail = async () => {
    if (!auth) return showToast("Firebase config missing.");
    try {
      if (authMode === "signin") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setShowAuth(false);
    } catch (err) {
      showToast(getAuthErrorMessage(err));
    }
  };
  const handleLogout = async () => {
    if (auth) await signOut(auth);
    setUser(null);
  };
  const handleDeptSelect = deptId => {
    const dept = DEPARTMENTS.find(item => item.id === deptId) || DEPARTMENTS[0];
    const sub = dept?.subdepartments?.[0];
    const roadmap = getRoadmapForSubdept(sub?.id);
    const path = roadmap.paths?.[0];
    setSelectedDeptId(dept?.id || "");
    setSelectedSubdeptId(sub?.id || "");
    setSelectedPathId(path?.id || "");
    setExpandedModules(path?.modules?.[0] ? [path.modules[0].id] : []);
    setPathTab("content");
  };
  const handleSubdeptSelect = subdeptId => {
    const dept = findDeptBySubdept(subdeptId) || DEPARTMENTS.find(item => item.id === selectedDeptId) || DEPARTMENTS[0];
    const roadmap = getRoadmapForSubdept(subdeptId);
    const path = roadmap.paths?.[0];
    setSelectedDeptId(dept?.id || "");
    setSelectedSubdeptId(subdeptId);
    setSelectedPathId(path?.id || "");
    setExpandedModules(path?.modules?.[0] ? [path.modules[0].id] : []);
    setPathTab("content");
  };
  const handlePathSelect = pathId => {
    const path = availablePaths.find(item => item.id === pathId) || PATHS.find(item => item.id === pathId);
    if (path?.deptId) setSelectedDeptId(path.deptId);
    if (path?.subdeptId) setSelectedSubdeptId(path.subdeptId);
    setSelectedPathId(pathId);
    setExpandedModules(path?.modules?.[0] ? [path.modules[0].id] : []);
    setPathTab("content");
  };
  const openLearningWorkspace = (pathId, mode = "open-first-lesson") => {
    const fallbackPath =
      availablePaths.find(item => item.id === pathId) ||
      PATHS.find(item => item.id === pathId) ||
      availablePaths.find(item => item.id === profile?.pathId) ||
      PATHS.find(item => item.id === profile?.pathId) ||
      selectedPath ||
      PATHS[0];

    if (!fallbackPath?.id) return;

    if (fallbackPath.deptId) setSelectedDeptId(fallbackPath.deptId);
    if (fallbackPath.subdeptId) setSelectedSubdeptId(fallbackPath.subdeptId);
    setSelectedPathId(fallbackPath.id);
    setExpandedModules(fallbackPath.modules?.[0] ? [fallbackPath.modules[0].id] : []);
    setPathTab("content");
    setView("courses");
    setCourseLaunchRequest({
      pathId: fallbackPath.id,
      mode,
      token: `${fallbackPath.id}:${mode}:${Date.now()}`
    });

    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  };
  const toggleModule = moduleId => {
    setExpandedModules(prev => prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]);
  };
  const toggleLesson = async (courseId, lessonId) => {
    setProgress(prev => {
      const current = prev[courseId] || [];
      const next = current.includes(lessonId) ? current.filter(id => id !== lessonId) : [...current, lessonId];
      return {
        ...prev,
        [courseId]: next
      };
    });
    if (!db || !user) return showToast("Demo mode: progress saved locally.");
    const ref = doc(db, "users", user.uid, "progress", courseId);
    const snap = await getDoc(ref);
    if (snap.exists() && snap.data().completedLessonIds?.includes(lessonId)) {
      await setDoc(ref, {
        completedLessonIds: arrayRemove(lessonId)
      }, {
        merge: true
      });
    } else {
      await setDoc(ref, {
        completedLessonIds: arrayUnion(lessonId)
      }, {
        merge: true
      });
    }
  };
  const addCourse = async event => {
    event.preventDefault();
    const form = new FormData(event.target);
    const payload = Object.fromEntries(form.entries());
    const normalized = {
      title: payload.titleEn || payload.titleBn || payload.title || "",
      titleBn: payload.titleBn || "",
      titleEn: payload.titleEn || "",
      desc: payload.descEn || payload.descBn || payload.desc || "",
      descBn: payload.descBn || "",
      descEn: payload.descEn || "",
      level: payload.level || "Beginner",
      lang: payload.lang || "EN",
      badge: payload.badge || "",
      lessons: Number(payload.lessons || 0),
      published: payload.published === "on" || payload.published === true,
      createdAt: serverTimestamp()
    };
    if (!db) {
      const localCourse = {
        id: `local-${Date.now()}`,
        ...normalized,
        published: true
      };
      setCourses(prev => [localCourse, ...prev]);
      event.target.reset();
      return showToast("Demo mode: course saved locally.");
    }
    await addDoc(collection(db, "courses"), normalized);
    event.target.reset();
    showToast("Course added successfully.");
  };
  const addLesson = async event => {
    event.preventDefault();
    const form = new FormData(event.target);
    const payload = Object.fromEntries(form.entries());
    const targetCourseId = payload.courseId || adminCourseId;
    if (!targetCourseId) return showToast("Select a course first.");
    const lessonData = {
      title: payload.titleEn || payload.titleBn || payload.title || "",
      titleBn: payload.titleBn || "",
      titleEn: payload.titleEn || "",
      order: Number(payload.order || 0),
      createdAt: serverTimestamp()
    };
    if (!db) {
      setLessonsByCourse(prev => {
        const existing = prev[targetCourseId] || mockLessons[targetCourseId] || [];
        const next = [...existing, {
          id: `local-${Date.now()}`,
          ...lessonData
        }];
        return {
          ...prev,
          [targetCourseId]: next
        };
      });
      setAdminCourseId(targetCourseId);
      event.target.reset();
      return showToast("Demo mode: lesson saved locally.");
    }
    await addDoc(collection(db, "courses", targetCourseId, "lessons"), lessonData);
    setAdminCourseId(targetCourseId);
    event.target.reset();
    showToast("Lesson added successfully.");
  };
  useEffect(() => {
    if (!showTrackModal) return;
    setTrackDistrictId((d) => d || profile?.districtId || "");
  }, [showTrackModal, profile?.districtId]);

  const saveTrackSelection = async (deptId, subdeptId, pathIdOverride) => {
    if (!user) return;
    const roadmap = getRoadmapForSubdept(subdeptId);
    const firstPath = roadmap.paths?.[0];
    const payload = {
      uid: user.uid,
      displayName: profile?.displayName || user.displayName || user.email || "EquiSaaS Member",
      email: profile?.email || user.email || "",
      avatarUrl: profile?.avatarUrl || user.photoURL || "",
      departmentId: deptId,
      subdepartmentId: subdeptId,
      pathId: pathIdOverride || firstPath?.id || "",
      districtId: trackDistrictId || "",
      lastActiveAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const targetPath = roadmap.paths?.find(path => path.id === payload.pathId) || firstPath;
    setSelectedDeptId(deptId);
    setSelectedSubdeptId(subdeptId);
    if (payload.pathId) {
      setSelectedPathId(payload.pathId);
      setExpandedModules(targetPath?.modules?.[0] ? [targetPath.modules[0].id] : []);
    }
    if (!db) {
      setProfile(prev => ({
        ...(prev || {}),
        ...payload
      }));
      setShowTrackModal(false);
      showToast("Demo mode: track saved locally.");
      return;
    }
    await setDoc(doc(db, "users", user.uid), payload, {
      merge: true
    });
    setShowTrackModal(false);
    showToast("Track saved.");
  };
  const addPathToRoadmap = async event => {
    event.preventDefault();
    if (!adminSubdeptId) return showToast("Select a sub-department first.");
    const form = new FormData(event.target);
    const payload = Object.fromEntries(form.entries());
    const roadmap = getRoadmapForSubdept(adminSubdeptId);
    const next = clone(roadmap);
    const pathId = slugify(payload.titleEn || payload.titleBn, `path-${Date.now()}`);
    const newPath = {
      id: pathId,
      titleBn: payload.titleBn || "",
      titleEn: payload.titleEn || "",
      descBn: payload.descBn || "",
      descEn: payload.descEn || "",
      level: payload.level || "Beginner",
      lang: payload.lang || "EN+BN",
      duration: payload.duration || "",
      prereqBn: payload.prereqBn || "",
      prereqEn: payload.prereqEn || "",
      outcomesBn: splitList(payload.outcomesBn),
      outcomesEn: splitList(payload.outcomesEn),
      modules: []
    };
    next.paths = [...(next.paths || []), newPath];
    await persistRoadmap(adminSubdeptId, next, "Path saved.");
    setAdminPathId(pathId);
    setAdminModuleId("");
    event.target.reset();
  };
  const addModuleToRoadmap = async event => {
    event.preventDefault();
    if (!adminSubdeptId || !adminPathId) return showToast("Select a path first.");
    const form = new FormData(event.target);
    const payload = Object.fromEntries(form.entries());
    const roadmap = getRoadmapForSubdept(adminSubdeptId);
    const next = clone(roadmap);
    const pathIndex = (next.paths || []).findIndex(path => path.id === adminPathId);
    if (pathIndex < 0) return showToast("Path not found.");
    const moduleId = slugify(payload.titleEn || payload.titleBn, `module-${Date.now()}`);
    const newModule = {
      id: moduleId,
      titleBn: payload.titleBn || "",
      titleEn: payload.titleEn || "",
      summaryBn: payload.summaryBn || "",
      summaryEn: payload.summaryEn || "",
      duration: payload.duration || "",
      lessons: []
    };
    next.paths[pathIndex].modules = [...(next.paths[pathIndex].modules || []), newModule];
    await persistRoadmap(adminSubdeptId, next, "Module saved.");
    setAdminModuleId(moduleId);
    event.target.reset();
  };
  const addLessonToModule = async event => {
    event.preventDefault();
    if (!adminSubdeptId || !adminPathId || !adminModuleId) return showToast("Select a module first.");
    const form = new FormData(event.target);
    const payload = Object.fromEntries(form.entries());
    const roadmap = getRoadmapForSubdept(adminSubdeptId);
    const next = clone(roadmap);
    const path = (next.paths || []).find(item => item.id === adminPathId);
    if (!path) return showToast("Path not found.");
    const moduleItem = (path.modules || []).find(item => item.id === adminModuleId);
    if (!moduleItem) return showToast("Module not found.");
    const typeEn = payload.type || "Video";
    const typeBn = typeEn === "Video" ? "ভিডিও" : "রিসোর্স";
    const lessonId = slugify(payload.titleEn || payload.titleBn, `lesson-${Date.now()}`);
    const lesson = {
      id: lessonId,
      titleBn: payload.titleBn || "",
      titleEn: payload.titleEn || "",
      typeBn,
      typeEn,
      duration: payload.duration || "",
      videoUrl: payload.videoUrl || "",
      resourceUrl: payload.resourceUrl || ""
    };
    moduleItem.lessons = [...(moduleItem.lessons || []), lesson];
    await persistRoadmap(adminSubdeptId, next, "Lesson saved.");
    event.target.reset();
  };
  const removeModuleFromRoadmap = async (pathId, moduleId) => {
    if (!adminSubdeptId) return;
    const roadmap = getRoadmapForSubdept(adminSubdeptId);
    const next = clone(roadmap);
    const path = (next.paths || []).find(item => item.id === pathId);
    if (!path) return;
    path.modules = (path.modules || []).filter(item => item.id !== moduleId);
    await persistRoadmap(adminSubdeptId, next, "Module removed.");
  };
  const removeLessonFromModule = async (pathId, moduleId, lessonId) => {
    if (!adminSubdeptId) return;
    const roadmap = getRoadmapForSubdept(adminSubdeptId);
    const next = clone(roadmap);
    const path = (next.paths || []).find(item => item.id === pathId);
    const moduleItem = path?.modules?.find(item => item.id === moduleId);
    if (!moduleItem) return;
    moduleItem.lessons = (moduleItem.lessons || []).filter(item => item.id !== lessonId);
    await persistRoadmap(adminSubdeptId, next, "Lesson removed.");
  };
  const addMonthlyItem = async event => {
    event.preventDefault();
    if (!adminSubdeptId) return showToast("Select a sub-department first.");
    const form = new FormData(event.target);
    const payload = Object.fromEntries(form.entries());
    if (!payload.month) return showToast("Select a month.");
    const roadmap = getRoadmapForSubdept(adminSubdeptId);
    const next = clone(roadmap);
    const list = next.monthlyActivities || [];
    const existingIndex = list.findIndex(item => item.month === payload.month);
    const existing = existingIndex >= 0 ? list[existingIndex] : null;
    const activityId = existing?.id || slugify(payload.month, `month-${Date.now()}`);
    const itemId = slugify(payload.itemTitleEn || payload.itemTitleBn, `item-${Date.now()}`);
    const typeEn = payload.type || "Video";
    const typeBn = typeEn === "Video" ? "ভিডিও" : "রিসোর্স";
    const newItem = {
      id: itemId,
      titleBn: payload.itemTitleBn || "",
      titleEn: payload.itemTitleEn || "",
      typeBn,
      typeEn,
      url: payload.url || ""
    };
    const updated = {
      id: activityId,
      month: payload.month,
      titleBn: payload.programTitleBn || existing?.titleBn || "",
      titleEn: payload.programTitleEn || existing?.titleEn || "",
      items: [...(existing?.items || []), newItem]
    };
    if (existingIndex >= 0) {
      list[existingIndex] = updated;
    } else {
      list.push(updated);
    }
    next.monthlyActivities = list;
    await persistRoadmap(adminSubdeptId, next, "Monthly item saved.");
    event.target.reset();
  };
  const removeMonthlyItem = async (activityId, itemId) => {
    if (!adminSubdeptId) return;
    const roadmap = getRoadmapForSubdept(adminSubdeptId);
    const next = clone(roadmap);
    next.monthlyActivities = (next.monthlyActivities || []).map(activity => {
      if (activity.id !== activityId) return activity;
      return {
        ...activity,
        items: (activity.items || []).filter(item => item.id !== itemId)
      };
    });
    await persistRoadmap(adminSubdeptId, next, "Monthly item removed.");
  };
  const adminLessons = adminCourseId ? (lessonsByCourse[adminCourseId] || []).slice().sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0)) : [];
  const toggleCoursePublish = async (courseId, nextValue) => {
    if (!db) {
      setCourses(prev => prev.map(course => course.id === courseId ? {
        ...course,
        published: nextValue
      } : course));
      return showToast("Demo mode: publish state updated locally.");
    }
    await updateDoc(doc(db, "courses", courseId), {
      published: nextValue
    });
    showToast("Publish state updated.");
  };
  const moveLesson = async (courseId, index, direction) => {
    const list = lessonsByCourse[courseId] || [];
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= list.length) return;
    const current = list[index];
    const target = list[nextIndex];
    const currentOrder = Number(current.order ?? index);
    const targetOrder = Number(target.order ?? nextIndex);
    if (!db) {
      const updated = [...list];
      updated[index] = {
        ...target,
        order: currentOrder
      };
      updated[nextIndex] = {
        ...current,
        order: targetOrder
      };
      updated.sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));
      setLessonsByCourse(prev => ({
        ...prev,
        [courseId]: updated
      }));
      return showToast("Demo mode: lesson order updated.");
    }
    await Promise.all([updateDoc(doc(db, "courses", courseId, "lessons", current.id), {
      order: targetOrder
    }), updateDoc(doc(db, "courses", courseId, "lessons", target.id), {
      order: currentOrder
    })]);
  };
  const logAudit = async (action, meta = {}, options = {}) => {
    const allowMember = Boolean(options.allowMember);
    if (!isAdmin && !(allowMember && MEMBER_AUDIT_ACTIONS.has(action))) return;
    const entry = {
      action,
      meta,
      actorUid: user?.uid || "",
      actorName: user?.displayName || user?.email || "",
      createdAt: db ? serverTimestamp() : new Date().toISOString()
    };
    if (!db) {
      setAuditEntries(prev => [{
        id: "local-" + Date.now(),
        ...entry
      }, ...prev]);
      return;
    }
    try {
      await addDoc(collection(db, "coopAudit"), entry);
    } catch (error) {
      console.error("Audit log write failed:", error);
      throw error;
    }
  };
  const downloadCSV = (filename, rows) => {
    triggerCsvDownload(filename, rows);
  };
  const addContribution = async event => {
    event.preventDefault();
    if (!user) return showToast("Sign in first.");
    const form = new FormData(event.target);
    const payload = Object.fromEntries(form.entries());
    const entry = {
      title: payload.title || "",
      type: payload.type || "General",
      points: Number(payload.points || 0),
      hours: Number(payload.hours || 0),
      link: payload.link || "",
      status: isAdmin ? payload.status || "approved" : "pending",
      uid: user.uid,
      createdBy: user.email || "",
      createdAt: serverTimestamp()
    };
    if (!db) {
      setContributions(prev => [{
        id: "local-" + Date.now(),
        ...entry
      }, ...prev]);
      if (entry.status === "approved") {
        setPublicProfileStats(prev => ({ ...prev, coopPoints: prev.coopPoints + Number(entry.points || 0) }));
      }
      event.target.reset();
      return showToast("Demo mode: contribution saved locally.");
    }
    await addDoc(collection(db, "contributions"), entry);
    if (entry.status === "approved") {
      await setDoc(getPublicProfileDocRef(db, user.uid), {
        userId: user.uid,
        coopPoints: increment(Number(entry.points || 0)),
        updatedAt: serverTimestamp()
      }, {
        merge: true
      });
      setPublicProfileStats(prev => ({ ...prev, coopPoints: prev.coopPoints + Number(entry.points || 0) }));
    }
    event.target.reset();
    showToast("Contribution submitted.");
  };
  const approveContribution = async id => {
    const contribution = contributions.find(item => item.id === id);
    if (!db) return showToast("Demo mode: approval saved locally.");
    if (contribution?.status === "approved") return showToast("Contribution already approved.");
    await updateDoc(doc(db, "contributions", id), {
      status: "approved",
      approvedBy: user?.uid || "",
      approvedAt: serverTimestamp()
    });
    if (contribution?.uid) {
      await setDoc(getPublicProfileDocRef(db, contribution.uid), {
        userId: contribution.uid,
        coopPoints: increment(Number(contribution.points || 0)),
        updatedAt: serverTimestamp()
      }, {
        merge: true
      });
      if (contribution.uid === user?.uid) {
        setPublicProfileStats(prev => ({ ...prev, coopPoints: prev.coopPoints + Number(contribution.points || 0) }));
      }
    }
    showToast("Contribution approved.");
  };
  const addPayout = async event => {
    event.preventDefault();
    if (!isAdmin) return showToast("Admin only.");
    const form = new FormData(event.target);
    const payload = Object.fromEntries(form.entries());
    const revenue = Number(payload.revenue || 0);
    const costs = Number(payload.costs || 0);
    const members = Number(payload.members || 0);
    const net = revenue - costs;
    const share = members ? Math.round(net / members) : 0;
    const entry = {
      month: payload.month || "",
      revenue,
      costs,
      members,
      net,
      share,
      createdAt: serverTimestamp(),
      createdBy: user?.uid || ""
    };
    if (!db) {
      setPayouts(prev => [{
        id: "local-" + Date.now(),
        ...entry
      }, ...prev]);
      event.target.reset();
      return showToast("Demo mode: payout saved locally.");
    }
    await addDoc(collection(db, "payouts"), entry);
    await logAudit("payout.added", {
      month: entry.month,
      net: entry.net,
      members: entry.members
    });
    event.target.reset();
    showToast("Payout added.");
  };
  const exportPayoutsCSV = () => {
    if (!payouts.length) return showToast("No payout data yet.");
    const rows = [["month", "revenue", "costs", "net", "share", "members"], ...payouts.map(item => [item.month || "", item.revenue || 0, item.costs || 0, item.net || 0, item.share || 0, item.members || 0])];
    downloadCSV("equisaas-payouts.csv", rows);
    logAudit("payout.export", {
      count: payouts.length
    });
    showToast("CSV exported.");
  };
  const addProposal = async event => {
    event.preventDefault();
    if (!user) return showToast("Sign in first.");
    const form = new FormData(event.target);
    const payload = Object.fromEntries(form.entries());
    const entry = {
      title: payload.title || "",
      summary: payload.summary || "",
      type: payload.type || "general",
      deadline: payload.deadline || "",
      createdBy: user.uid,
      createdAt: serverTimestamp()
    };
    if (!db) {
      setProposals(prev => [{
        id: "local-" + Date.now(),
        ...entry
      }, ...prev]);
      event.target.reset();
      return showToast("Demo mode: proposal saved locally.");
    }
    await addDoc(collection(db, "proposals"), entry);
    event.target.reset();
    showToast("Proposal submitted.");
  };
  const voteProposal = async (proposalId, value) => {
    if (!db || !user) return showToast("Sign in first.");
    const voteRef = doc(db, "proposals", proposalId, "votes", user.uid);
    const snap = await getDoc(voteRef);
    const previousValue = snap.exists() ? snap.data().value : "";
    if (previousValue === value) {
      return showToast("Vote already recorded.");
    }
    await setDoc(voteRef, {
      value,
      uid: user.uid,
      createdAt: serverTimestamp()
    }, {
      merge: true
    });
    setProposalVotes(prev => {
      const current = prev[proposalId] || { yes: 0, no: 0 };
      return {
        ...prev,
        [proposalId]: {
          yes: Math.max(0, current.yes - (previousValue === "yes" ? 1 : 0) + (value === "yes" ? 1 : 0)),
          no: Math.max(0, current.no - (previousValue === "no" ? 1 : 0) + (value === "no" ? 1 : 0))
        }
      };
    });
    showToast("Vote saved.");
  };
  const addPathway = async event => {
    event.preventDefault();
    if (!isAdmin) return showToast("Admin only.");
    const form = new FormData(event.target);
    const payload = Object.fromEntries(form.entries());
    const entry = {
      title: payload.title || "",
      summary: payload.summary || "",
      level: payload.level || "",
      link: payload.link || "",
      createdAt: serverTimestamp()
    };
    if (!db) {
      setPathways(prev => [{
        id: "local-" + Date.now(),
        ...entry
      }, ...prev]);
      event.target.reset();
      return showToast("Demo mode: pathway saved locally.");
    }
    await addDoc(collection(db, "pathways"), entry);
    event.target.reset();
    showToast("Pathway added.");
  };
  const enrollPathway = async pathwayId => {
    if (!db || !user) return showToast("Sign in first.");
    const ref = doc(db, "pathways", pathwayId, "enrollments", user.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) return showToast("Already enrolled.");
    await setDoc(ref, {
      uid: user.uid,
      createdAt: serverTimestamp()
    });
    showToast("Enrolled successfully.");
  };
  const addSquad = async event => {
    event.preventDefault();
    if (!isAdmin) return showToast("Admin only.");
    const form = new FormData(event.target);
    const payload = Object.fromEntries(form.entries());
    const entry = {
      title: payload.title || "",
      summary: payload.summary || "",
      createdAt: serverTimestamp()
    };
    if (!db) {
      setSquads(prev => [{
        id: "local-" + Date.now(),
        ...entry
      }, ...prev]);
      event.target.reset();
      return showToast("Demo mode: squad saved locally.");
    }
    await addDoc(collection(db, "squads"), entry);
    event.target.reset();
    showToast("Squad added.");
  };
  const requestSquadJoin = async squadId => {
    if (!db || !user) return showToast("Sign in first.");
    const ref = doc(db, "squads", squadId, "requests", user.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) return showToast("Request already sent.");
    await setDoc(ref, {
      uid: user.uid,
      createdAt: serverTimestamp()
    });
    showToast("Join request sent.");
  };
  const addTranslation = async event => {
    event.preventDefault();
    if (!user) return showToast("Sign in first.");
    const form = new FormData(event.target);
    const payload = Object.fromEntries(form.entries());
    const entry = {
      title: payload.title || "",
      sourceLang: payload.sourceLang || "BN",
      targetLang: payload.targetLang || "EN",
      link: payload.link || "",
      status: "open",
      createdBy: user.uid,
      createdAt: serverTimestamp()
    };
    if (!db) {
      setTranslations(prev => [{
        id: "local-" + Date.now(),
        ...entry
      }, ...prev]);
      event.target.reset();
      return showToast("Demo mode: translation saved locally.");
    }
    await addDoc(collection(db, "translations"), entry);
    event.target.reset();
    showToast("Translation task submitted.");
  };
  const updateTranslationStatus = async (id, status) => {
    if (!db) return showToast("Demo mode: translation updated locally.");
    await updateDoc(doc(db, "translations", id), {
      status
    });
    showToast("Translation status updated.");
  };
  const addMentorRequest = async event => {
    event.preventDefault();
    if (!user) return showToast("Sign in first.");
    const form = new FormData(event.target);
    const payload = Object.fromEntries(form.entries());
    const entry = {
      menteeUid: user.uid,
      focus: payload.focus || "",
      notes: payload.notes || "",
      status: "open",
      createdAt: serverTimestamp()
    };
    if (!db) {
      setMentorRequests(prev => [{
        id: "local-" + Date.now(),
        ...entry
      }, ...prev]);
      event.target.reset();
      return showToast("Demo mode: request saved locally.");
    }
    await addDoc(collection(db, "mentorRequests"), entry);
    event.target.reset();
    showToast("Mentor request submitted.");
  };
  const assignMentor = async requestId => {
    if (!db || !isAdmin) return showToast("Admin only.");
    const mentorUid = window.prompt("Mentor UID");
    if (!mentorUid) return;
    await updateDoc(doc(db, "mentorRequests", requestId), {
      mentorUid,
      status: "assigned"
    });
    showToast("Mentor assigned.");
  };
  const addQualityGate = async event => {
    event.preventDefault();
    if (!isAdmin) return showToast("Admin only.");
    const form = new FormData(event.target);
    const payload = Object.fromEntries(form.entries());
    const checklist = String(payload.checklist || "").split(",").map(item => item.trim()).filter(Boolean).map(label => ({
      label,
      done: false
    }));
    const entry = {
      title: payload.title || "",
      checklist,
      createdAt: serverTimestamp()
    };
    if (!db) {
      setQualityGates(prev => [{
        id: "local-" + Date.now(),
        ...entry
      }, ...prev]);
      event.target.reset();
      return showToast("Demo mode: gate saved locally.");
    }
    await addDoc(collection(db, "qualityGates"), entry);
    event.target.reset();
    showToast("Quality gate added.");
  };
  const toggleGateItem = async (gateId, index) => {
    if (!db || !isAdmin) return;
    const gate = qualityGates.find(item => item.id === gateId);
    if (!gate) return;
    const nextChecklist = (gate.checklist || []).map((item, idx) => idx === index ? {
      ...item,
      done: !item.done
    } : item);
    await updateDoc(doc(db, "qualityGates", gateId), {
      checklist: nextChecklist
    });
  };
  const addCredential = async event => {
    event.preventDefault();
    if (!isAdmin) return showToast("Admin only.");
    const form = new FormData(event.target);
    const payload = Object.fromEntries(form.entries());
    const entry = {
      uid: payload.uid || "",
      title: payload.title || "",
      badge: payload.badge || "",
      level: payload.level || "",
      link: payload.link || "",
      issuedAt: serverTimestamp()
    };
    if (!db) {
      setCredentials(prev => [{
        id: "local-" + Date.now(),
        ...entry
      }, ...prev]);
      if (entry.uid === user?.uid) {
        setPublicProfileStats(prev => ({ ...prev, certificateCount: prev.certificateCount + 1, latestCredential: entry }));
      }
      event.target.reset();
      return showToast("Demo mode: credential saved locally.");
    }
    await addDoc(collection(db, "credentials"), entry);
    if (entry.uid) {
      await setDoc(getPublicProfileDocRef(db, entry.uid), {
        userId: entry.uid,
        certificateCount: increment(1),
        featuredCredentialTitle: entry.title,
        featuredCredentialLevel: entry.level,
        featuredCredentialIssuedAt: entry.issuedAt,
        updatedAt: serverTimestamp()
      }, {
        merge: true
      });
      if (entry.uid === user?.uid) {
        setPublicProfileStats(prev => ({ ...prev, certificateCount: prev.certificateCount + 1, latestCredential: entry }));
      }
    }
    event.target.reset();
    showToast("Credential issued.");
  };
  const addRoadmapItem = async event => {
    event.preventDefault();
    if (!isAdmin) return showToast("Admin only.");
    const form = new FormData(event.target);
    const payload = Object.fromEntries(form.entries());
    const entry = {
      title: payload.title || "",
      summary: payload.summary || "",
      status: payload.status || "planned",
      eta: payload.eta || "",
      createdAt: serverTimestamp()
    };
    if (!db) {
      setRoadmapItems(prev => [{
        id: "local-" + Date.now(),
        ...entry
      }, ...prev]);
      event.target.reset();
      return showToast("Demo mode: roadmap item saved locally.");
    }
    await addDoc(collection(db, "roadmap"), entry);
    event.target.reset();
    showToast("Roadmap item added.");
  };
  const voteRoadmap = async itemId => {
    if (!db || !user) return showToast("Sign in first.");
    const voteRef = doc(db, "roadmap", itemId, "votes", user.uid);
    const snap = await getDoc(voteRef);
    if (snap.exists()) return showToast("Already voted.");
    await setDoc(voteRef, {
      uid: user.uid,
      createdAt: serverTimestamp()
    });
    setRoadmapVotes(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
    showToast("Upvote saved.");
  };
  const addTrustSignal = async event => {
    event.preventDefault();
    if (!isAdmin) return showToast("Admin only.");
    const form = new FormData(event.target);
    const payload = Object.fromEntries(form.entries());
    const entry = {
      uid: payload.uid || "",
      signal: payload.signal || "",
      score: Number(payload.score || 0),
      createdAt: serverTimestamp(),
      createdBy: user?.uid || ""
    };
    if (!db) {
      setTrustSignals(prev => [{
        id: "local-" + Date.now(),
        ...entry
      }, ...prev]);
      if (entry.uid === user?.uid) {
        setPublicProfileStats(prev => ({ ...prev, trustScore: prev.trustScore + Number(entry.score || 0) }));
      }
      event.target.reset();
      return showToast("Demo mode: trust signal saved locally.");
    }
    await addDoc(collection(db, "trustSignals"), entry);
    if (entry.uid) {
      await setDoc(getPublicProfileDocRef(db, entry.uid), {
        userId: entry.uid,
        trustScore: increment(Number(entry.score || 0)),
        updatedAt: serverTimestamp()
      }, {
        merge: true
      });
      if (entry.uid === user?.uid) {
        setPublicProfileStats(prev => ({ ...prev, trustScore: prev.trustScore + Number(entry.score || 0) }));
      }
    }
    await logAudit("trust.added", {
      uid: entry.uid,
      score: entry.score
    });
    event.target.reset();
    showToast("Trust signal added.");
  };
  const exportTrustCSV = () => {
    if (!trustSignals.length) return showToast("No trust data yet.");
    const rows = [["uid", "signal", "score"], ...trustSignals.map(item => [item.uid || "", item.signal || "", item.score || 0])];
    downloadCSV("equisaas-trust-signals.csv", rows);
    logAudit("trust.export", {
      count: trustSignals.length
    });
    showToast("CSV exported.");
  };
  const openSubmissionModal = (activity, item) => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    const existing = submissionMap[item.id];
    setSubmissionItem({
      activity,
      item,
      existing
    });
    setSubmissionLink(existing?.link || "");
    setSubmissionNotes(existing?.notes || "");
    setSubmissionModal(true);
  };
  const submitAssignment = async event => {
    event.preventDefault();
    if (!user || !submissionItem?.item) return showToast("Sign in first.");
    const nextReviewCycle = submissionItem.existing?.id ? Number(submissionItem.existing?.reviewCycle || 0) + 1 : 0;
    const entry = {
      uid: user.uid,
      userName: user.displayName || user.email || "Member",
      districtId: profile?.districtId || "",
      deptId: selectedDept?.id || "",
      subdeptId: selectedSubdept?.id || "",
      pathId: selectedPath?.id || "",
      pathTitleBn: selectedPath?.titleBn || "",
      pathTitleEn: selectedPath?.titleEn || "",
      month: submissionItem.activity?.month || "",
      activityId: submissionItem.activity?.id || "",
      itemId: submissionItem.item?.id || "",
      itemTitleBn: submissionItem.item?.titleBn || "",
      itemTitleEn: submissionItem.item?.titleEn || "",
      link: submissionLink || "",
      notes: submissionNotes || "",
      status: "pending",
      reviewCycle: nextReviewCycle,
      reviewNote: "",
      reviewedBy: "",
      reviewedAt: null,
      createdAt: submissionItem.existing?.createdAt || (db ? serverTimestamp() : new Date().toISOString()),
      updatedAt: db ? serverTimestamp() : new Date().toISOString()
    };
    if (!db) {
      if (submissionItem.existing?.id) {
        const updatedSubmission = {
          ...submissionItem.existing,
          ...entry,
          updatedAt: new Date().toISOString()
        };
        setAssignmentSubmissions(prev => prev.map(item => item.id === submissionItem.existing.id ? updatedSubmission : item));
        await syncReviewQueueDoc(submissionItem.existing.id, updatedSubmission, []);
      } else {
        const localId = "local-" + Date.now();
        const createdSubmission = {
          id: localId,
          ...entry,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setAssignmentSubmissions(prev => [createdSubmission, ...prev]);
        await syncReviewQueueDoc(localId, createdSubmission, []);
      }
      setSubmissionModal(false);
      setSubmissionItem(null);
      showToast("Demo mode: submission saved locally.");
      return;
    }
    if (submissionItem.existing?.id) {
      await updateDoc(doc(db, "assignmentSubmissions", submissionItem.existing.id), {
        link: entry.link,
        notes: entry.notes,
        districtId: entry.districtId,
        status: "pending",
        reviewCycle: nextReviewCycle,
        reviewNote: "",
        reviewedBy: "",
        reviewedAt: null,
        updatedAt: serverTimestamp()
      });
      await syncReviewQueueDoc(submissionItem.existing.id, {
        ...submissionItem.existing,
        ...entry,
        id: submissionItem.existing.id,
        createdAt: submissionItem.existing.createdAt,
        updatedAt: new Date().toISOString()
      }, []);
    } else {
      const createdRef = await addDoc(collection(db, "assignmentSubmissions"), {
        ...entry,
        createdAt: serverTimestamp()
      });
      await syncReviewQueueDoc(createdRef.id, {
        id: createdRef.id,
        ...entry,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, []);
    }
    setSubmissionModal(false);
    setSubmissionItem(null);
    showToast("Assignment submitted.");
  };
  const submitPeerAttestation = async (submissionId, verdict) => {
    if (!user) return showToast(lang === "bn" ? "আগে সাইন ইন করুন।" : "Sign in first.");
    if (isAdmin) return showToast(lang === "bn" ? "পিয়ার অ্যাটেস্টেশন সদস্যদের জন্য।" : "Peer attestations are for members.");
    const submissionData = reviewQueueMap[submissionId] || assignmentSubmissions.find(item => item.id === submissionId);
    if (!submissionData) return showToast(lang === "bn" ? "সাবমিশন পাওয়া যায়নি।" : "Submission not found.");
    if (submissionData.uid === user.uid) return showToast(lang === "bn" ? "নিজের সাবমিশনে অ্যাটেস্ট করা যাবে না।" : "You cannot attest your own submission.");
    if (["approved", "rejected"].includes(submissionData.status)) return showToast(lang === "bn" ? "এই সাবমিশনের রিভিউ সম্পন্ন হয়েছে।" : "This submission has already been reviewed.");
    const note = (attestationDrafts[submissionId] || "").trim();
    const cycle = Number(submissionData.reviewCycle || 0);
    const now = new Date().toISOString();
    const nextAttestation = {
      uid: user.uid,
      userName: profile?.displayName || user.displayName || user.email || "Member",
      districtId: profile?.districtId || "",
      verdict,
      note,
      cycle,
      createdAt: now,
      updatedAt: now
    };
    if (!db) {
      const localEntries = [
        ...((reviewQueueMap[submissionId]?.localAttestations || []).filter(entry => entry?.uid !== user.uid || Number(entry?.cycle || 0) !== cycle)),
        nextAttestation
      ];
      await syncReviewQueueDoc(submissionId, {
        ...submissionData,
        updatedAt: now
      }, localEntries);
      setAttestationDrafts(prev => ({ ...prev, [submissionId]: "" }));
      await logAudit("assignment.attestation", { submissionId, verdict, cycle });
      showToast(lang === "bn" ? "ডেমো মোডে অ্যাটেস্টেশন সেভ হয়েছে।" : "Demo mode: attestation saved locally.");
      return;
    }
    await setDoc(doc(db, "assignmentSubmissions", submissionId, "attestations", user.uid), {
      uid: user.uid,
      userName: profile?.displayName || user.displayName || user.email || "Member",
      districtId: profile?.districtId || "",
      verdict,
      note,
      cycle,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });
    const attestationSnap = await getDocs(collection(db, "assignmentSubmissions", submissionId, "attestations"));
    const attestationEntries = attestationSnap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    await syncReviewQueueDoc(submissionId, {
      ...submissionData,
      updatedAt: new Date().toISOString()
    }, attestationEntries);
    setAttestationDrafts(prev => ({ ...prev, [submissionId]: "" }));
    await logAudit("assignment.attestation", { submissionId, verdict, cycle });
    showToast(lang === "bn" ? "পিয়ার অ্যাটেস্টেশন জমা হয়েছে।" : "Peer attestation submitted.");
  };
  const reviewSubmission = async (id, status) => {
    if (!isAdmin) return showToast("Admin only.");
    const note = reviewNotes[id] || "";
    const currentSubmission = assignmentSubmissions.find(item => item.id === id) || reviewQueueMap[id];
    if (!db) {
      const updatedSubmission = {
        ...currentSubmission,
        status,
        reviewNote: note,
        reviewedBy: user?.uid || "",
        reviewedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setAssignmentSubmissions(prev => prev.map(item => item.id === id ? updatedSubmission : item));
      await syncReviewQueueDoc(id, updatedSubmission, reviewQueueMap[id]?.localAttestations || []);
      logAudit("assignment.review", { id, status });
      return showToast("Demo mode: review saved locally.");
    }
    await updateDoc(doc(db, "assignmentSubmissions", id), {
      status,
      reviewNote: note,
      reviewedBy: user?.uid || "",
      reviewedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    await syncReviewQueueDoc(id, {
      ...currentSubmission,
      status,
      reviewNote: note,
      reviewedBy: user?.uid || "",
      reviewedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    logAudit("assignment.review", { id, status });
    showToast("Review updated.");
  };
  const lessonsForCourse = selectedCourse ? lessonsByCourse[selectedCourse.id] : undefined;
  const currentLessons = selectedCourse ? lessonsForCourse !== undefined ? lessonsForCourse : mockLessons[selectedCourse.id] || [] : [];
  const memberCredentials = useMemo(() => credentials.filter(item => item.uid === user?.uid), [credentials, user]);
  const visibleCredentials = isAdmin ? credentials : memberCredentials;
  const memberRank = useMemo(() => getMemberRank(publicProfileStats.coopPoints, publicProfileStats.trustScore, lang), [lang, publicProfileStats]);
  const publicProfilePath = useMemo(() => (user ? getPublicProfilePath(user.uid) : ""), [user]);
  const publicProfileUrl = useMemo(() => (user ? getPublicProfilePath(user.uid, true) : ""), [user]);

  const downloadEquityLedger = () => {
    if (!user) return;
    const myContributions = (contributions || []).filter((c) => (c.uid || c.createdBy) === user.uid);
    const payload = {
      schema: "equisaas-bd.equity-ledger",
      version: 1,
      exportedAt: new Date().toISOString(),
      member: {
        uid: user.uid,
        email: user.email || null,
        displayName: user.displayName || profile?.displayName || null,
      },
      track: {
        departmentId: profile?.departmentId || null,
        subdepartmentId: profile?.subdepartmentId || null,
        pathId: profile?.pathId || null,
        districtId: profile?.districtId || null,
      },
      stats: {
        coopPoints: publicProfileStats.coopPoints,
        trustScore: publicProfileStats.trustScore,
        certificateCount: publicProfileStats.certificateCount,
        rankLabel: getMemberRank(publicProfileStats.coopPoints, publicProfileStats.trustScore, lang),
      },
      badges: earnedBadgeIds || [],
      progress: progress || {},
      contributionsSnapshot: myContributions.slice(0, 50),
      note: "Portable summary for your records. Not a legal or financial instrument.",
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const dateStr = new Date().toISOString().split("T")[0];
    const userPart = user.displayName ? user.displayName.toLowerCase().replace(/[^a-z0-9]+/g, "-") : user.uid.slice(0, 8);
    const filename = `equisaas-equity-ledger-${userPart}-${dateStr}.json`;
    triggerDownload(blob, filename);
    showToast(lang === "bn" ? "ইকুইটি লেজার ডাউনলোড শুরু হয়েছে।" : "Equity ledger download started.");
  };

  const copyTrackInviteLink = async () => {
    if (typeof window === "undefined" || !selectedPath?.id) {
      showToast(lang === "bn" ? "আগে একটি লার্নিং পাথ নির্বাচন করুন।" : "Select a learning path first.");
      return;
    }
    const base = `${window.location.origin}${import.meta.env.BASE_URL || "/lms/"}`.replace(/\/?$/, "/");
    const url = new URL(base, window.location.origin);
    url.searchParams.set("path", selectedPath.id);
    if (profile?.districtId) url.searchParams.set("district", profile.districtId);
    try {
      await navigator.clipboard.writeText(url.toString());
      showToast(lang === "bn" ? "ট্র্যাক আমন্ত্রণ লিংক কপি হয়েছে।" : "Track invite link copied.");
    } catch (e) {
      console.error(e);
      showToast(lang === "bn" ? "কপি করা যায়নি।" : "Could not copy.");
    }
  };

  const ctx = {
    DEPARTMENTS,
    LEVEL_OPTIONS,
    addContribution,
    downloadEquityLedger,
    addCourse,
    addCredential,
    addLesson,
    addLessonToModule,
    addMentorRequest,
    addModuleToRoadmap,
    addMonthlyItem,
    addPathToRoadmap,
    addPathway,
    addPayout,
    addProposal,
    addQualityGate,
    addRoadmapItem,
    addSquad,
    addTranslation,
    addTrustSignal,
    adminCourseId,
    adminDeptId,
    adminLessons,
    adminMode,
    adminModuleId,
    adminModules,
    adminPathId,
    adminPaths,
    adminRoadmap,
    adminSubdeptId,
    adminTab,
    approveContribution,
    assignMentor,
    assignmentFilter,
    attestationDrafts,
    auditEntries,
    contributions,
    coopTab,
    coopTabs,
    clearCourseLaunchRequest: () => setCourseLaunchRequest(null),
    copyTrackInviteLink,
    courseLaunchRequest,
    courses,
    enrollPathway,
    expandedModules,
    exportPayoutsCSV,
    exportTrustCSV,
    filter,
    filteredModules,
    filteredPaths,
    filteredSubmissions,
    formatDateTime,
    formatMonth,
    formatNumber,
    getCourseTitle,
    getLessonTitle,
    getLessonType,
    getLevelLabel,
    getLocalized,
    getModuleSummary,
    getModuleTitle,
    getOutcomes,
    getPathDesc,
    getPathTitle,
    getPrereq,
    hasManagementAccess,
    getSubmissionStatus,
    handleDeptSelect,
    handlePathSelect,
    handleSubdeptSelect,
    isAdmin: roleBasedAdmin,
    isAssignmentItem,
    isConfigured,
    lang,
    mentorRequests,
    monthlyActivities,
    moveLesson,
    openLearningWorkspace,
    openSubmissionModal,
    pathTab,
    pathways,
    peerReviewQueue,
    payoutSummary,
    payouts,
    profile,
    progress,
    proposalVotes,
    proposals,
    publicProfileStats,
    qualityGates,
    removeLessonFromModule,
    removeModuleFromRoadmap,
    removeMonthlyItem,
    renderLessonLinks,
    requestSquadJoin,
    reviewNotes,
    reviewQueueItems: legacyReviewQueueItems,
    reviewQueueMap,
    reviewSubmission,
    roadmapItems,
    roadmapVotes,
    search,
    selectedDept,
    selectedPath,
    selectedSubdept,
    setAdminCourseId,
    setAdminDeptId,
    setAdminMode,
    setAdminModuleId,
    setAdminPathId,
    setAdminSubdeptId,
    setAdminTab,
    setAssignmentFilter,
    setAttestationDrafts,
    setCoopTab,
    setFilter,
    setPathTab,
    setReviewNotes,
    setSearch,
    setShowAuth,
    setShowTrackModal,
    submitPeerAttestation,
    setView,
    squads,
    submissionMap,
    text,
    toggleCoursePublish,
    toggleGateItem,
    toggleLesson,
    toggleModule,
    translations,
    trustSignals,
    trustSummary,
    updateTranslationStatus,
    view,
    user,
    userRole,
    claimsAdmin,
    visibleCredentials,
    visibleDepartments,
    visibleSubdepartments,
    voteProposal,
    voteRoadmap
  };
  const assetBase = import.meta.env.BASE_URL || "/";
  return <LmsContext.Provider value={ctx}>
      <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
        <CustomCursor />
        {user && !localStorage.getItem("eq_onboarding_completed") && (
          <OnboardingTour onComplete={() => localStorage.setItem("eq_onboarding_completed", "true")} />
        )}

        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="/" aria-label="EquiSaaS BD" className="flex items-center gap-3 group">
                <EquiSaaSLogo lang={lang} />
              </a>
            </div>

            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setLang(lang === "bn" ? "en" : "bn")} 
                className="rounded-full px-3 text-xs font-medium"
              >
                {lang === "bn" ? "English" : "বাংলা"}
              </Button>
              
              {isAdmin && (
                <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20 uppercase tracking-widest hidden sm:flex">
                  Admin
                </Badge>
              )}

              {user && (
                <NotificationBell
                  hasUnread={hasUnreadAnnouncements}
                  onClick={openCommunityFeed}
                  label={lang === "bn" ? "নতুন ঘোষণা" : "New announcements"}
                />
              )}

              {user ? (
                <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 rounded-xl">
                  <LogOut className="w-4 h-4" /> 
                  <span className="hidden sm:inline">{text.actions.signOut}</span>
                </Button>
              ) : (
                <Button size="sm" onClick={() => setShowAuth(true)} className="gap-2 rounded-xl shadow-lg shadow-primary/20">
                  <LogIn className="w-4 h-4" /> 
                  <span>{text.actions.signIn}</span>
                </Button>
              )}
            </div>
          </div>
        </header>

        <div className="container py-8 pb-32 lg:pb-8">
          {isConfigured === false && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 text-sm text-primary font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {text.banners.demo}
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px,1fr]">
            <aside className="hidden shrink-0 self-start lg:sticky lg:top-24 lg:flex lg:w-[280px] lg:flex-col lg:gap-3">
              <div className="rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-sm">
                <div className="text-[10px] font-black uppercase tracking-[0.24em] text-primary/70">
                  {lang === "bn" ? "ওয়ার্কস্পেস" : "Workspace"}
                </div>
                <h2 className="mt-2 text-lg font-black tracking-tight text-slate-900">
                  {lang === "bn" ? "একসাথে শিখুন, পরিকল্পনা করুন, কন্ট্রিবিউট করুন" : "Learn, plan, and contribute in one place"}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {lang === "bn"
                    ? "প্রতিটি ট্যাব একই লার্নিং ফ্লোয়ের অংশ, তাই কোথায় কী পাবেন তা দ্রুত বোঝা যায়।"
                    : "Each tab belongs to the same learning flow, so the workspace is easier to scan and navigate."}
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200/80 bg-white/75 p-2 shadow-sm">
                {visibleNavItems.map(item => {
                  const Icon = item.icon;
                  const active = view === item.id;
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      onClick={() => {
                        setView(item.id);
                        setSelectedCourse(null);
                      }}
                      className={cn(
                        "h-auto w-full justify-start rounded-2xl px-3 py-3 text-left transition-all",
                        active
                          ? "bg-primary text-white shadow-lg shadow-primary/15 hover:bg-primary/90"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      )}
                    >
                      <div className="flex min-w-0 flex-1 items-start gap-3">
                        <span className={cn(
                          "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
                          active ? "border-white/20 bg-white/10" : "border-slate-200 bg-slate-50"
                        )}>
                          <Icon className={cn("h-4 w-4", active ? "text-white" : "text-slate-500")} />
                        </span>
                        <div className="min-w-0">
                          <div className="text-sm font-black tracking-tight">{text.nav[item.labelKey]}</div>
                          <div className={cn("mt-1 text-xs leading-relaxed", active ? "text-white/80" : "text-slate-500")}>
                            {lang === "bn" ? item.descBn : item.descEn}
                          </div>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </aside>

            <main className="space-y-8 min-w-0">
              <section className="relative overflow-hidden rounded-3xl border bg-card p-6 md:p-10 shadow-sm">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.2em]">
                      {text.hero.subtitle}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none">
                      {text.hero.title}
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
                      {text.hero.desc}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4 shrink-0">
                    <Button size="lg" variant="coop" asChild className="shadow-lg shadow-brand-green/20 gap-2 h-12 px-6">
                      <a href={APPLICATION_LINK} target="_blank" rel="noreferrer">
                        <Sparkles className="w-4 h-4" /> {text.actions.join}
                      </a>
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => openLearningWorkspace(profile?.pathId || selectedPath?.id, "open-first-lesson")} className="h-12 px-6">
                      {text.actions.viewCourse}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
                  <Card className="bg-muted/50 border-none shadow-none">
                    <CardHeader className="p-4 pb-0">
                      <CardDescription className="text-[10px] uppercase tracking-widest font-bold">
                        {text.stats.active}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-1">
                      <div className="text-3xl font-black">{PATHS.length}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50 border-none shadow-none">
                    <CardHeader className="p-4 pb-0">
                      <CardDescription className="text-[10px] uppercase tracking-widest font-bold">
                        {text.stats.progress}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-1">
                      <div className="text-3xl font-black">{progressPercent}%</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50 border-none shadow-none">
                    <CardHeader className="p-4 pb-0">
                      <CardDescription className="text-[10px] uppercase tracking-widest font-bold">
                        {text.stats.community}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-1">
                      <div className="text-3xl font-black">620+</div>
                    </CardContent>
                  </Card>
                </div>
              </section>

                {view === "dashboard" && (
                  <Suspense fallback={<div className="card rounded-3xl p-6 text-sm text-slate-600">Loading dashboard...</div>}>
                    <DashboardOverviewView
                      db={db}
                      lang={lang}
                      text={text}
                      user={user}
                      selectedPath={selectedPath}
                      selectedSubdept={selectedSubdept}
                      getPathTitle={getPathTitle}
                      getPathDesc={getPathDesc}
                      getLevelLabel={getLevelLabel}
                      getLocalized={getLocalized}
                      currentPathModuleCount={currentPathModuleCount}
                      currentPathLessonCount={currentPathLessonCount}
                      currentPathCompletedCount={currentPathCompletedCount}
                      currentPathRemainingCount={currentPathRemainingCount}
                      nextLessonTarget={nextLessonTarget}
                      getLessonTitle={getLessonTitle}
                      getModuleTitle={getModuleTitle}
                      dashboardPathCards={dashboardPathCards}
                      onOpenQuickStart={openQuickStart}
                      onOpenCurrentPath={() => openLearningWorkspace(profile?.pathId || selectedPath?.id, "open-first-lesson")}
                      onOpenRoadmap={openStudyRoadmap}
                      onOpenCoopTaskCenter={openCoopTaskCenter}
                      onOpenCommunity={openCommunityFeed}
                      onOpenPath={handleDashboardPathOpen}
                      publicProfilePath={publicProfilePath}
                      copyPublicProfileLink={copyPublicProfileLink}
                      downloadEquityLedger={downloadEquityLedger}
                      copyTrackInviteLink={copyTrackInviteLink}
                      publicProfileStats={publicProfileStats}
                      memberRank={memberRank}
                      formatNumber={formatNumber}
                      earnedBadgeIds={earnedBadgeIds}
                      latestAnnouncement={latestAnnouncement}
                      hasUnreadAnnouncements={hasUnreadAnnouncements}
                      formatDateTime={formatDateTime}
                      onOpenAnnouncement={openCommunityFeed}
                      onNotify={showToast}
                    />
                  </Suspense>
                )}
                {view === "courses" && <Suspense fallback={<div className="card rounded-3xl p-6 text-sm text-slate-600">Loading...</div>}><CoursesView /></Suspense>}
                {view === "manual" && (
                  <Suspense fallback={<div className="card rounded-3xl p-6 text-sm text-slate-600">Loading quick start...</div>}>
                    <QuickStartView
                      lang={lang}
                      text={text}
                      applicationLink={APPLICATION_LINK}
                      onOpenRoadmap={openStudyRoadmap}
                      onOpenResources={openResourcesLibrary}
                      onOpenCourses={() => setView("courses")}
                      rolePlaybooks={ROLE_PLAYBOOKS}
                      activeRole={activeRole}
                      manualRoleId={manualRoleId}
                      setManualRoleId={setManualRoleId}
                    />
                  </Suspense>
                )}
                {view === "resources" && <Suspense fallback={<div className="card rounded-3xl p-6 text-sm text-slate-600">Loading...</div>}><ResourcesView /></Suspense>}
                {view === "roadmap" && <Suspense fallback={<div className="card rounded-3xl p-6 text-sm text-slate-600">Loading...</div>}><RoadmapView /></Suspense>}
                {view === "community" && <Suspense fallback={<div className="card rounded-3xl p-6 text-sm text-slate-600">Loading...</div>}><SquadWorkspaceView /></Suspense>}
                {view === "coop" && <Suspense fallback={<div className="card rounded-3xl p-6 text-sm text-slate-600">Loading...</div>}><CoopHubView /></Suspense>}                {view === "admin" && <Suspense fallback={<div className="card rounded-3xl p-6 text-sm text-slate-600">Loading...</div>}><AdminView /></Suspense>}              </main>            </div>          </div>          <nav className="fixed inset-x-4 bottom-4 z-50 lg:hidden">
            <div className="flex gap-2 overflow-x-auto rounded-3xl border border-slate-200/80 bg-background/95 p-2 shadow-2xl backdrop-blur-xl supports-[backdrop-filter]:bg-background/85">
              {visibleNavItems.map(item => {
                const Icon = item.icon;
                const active = view === item.id;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setView(item.id);
                      setSelectedCourse(null);
                    }}
                    className={cn(
                      "h-11 shrink-0 whitespace-nowrap rounded-2xl px-3 font-semibold transition-all",
                      active
                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                        : "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    <Icon className={cn("mr-2 h-4 w-4", active ? "text-white" : "text-slate-500")} />
                    <span className="text-xs font-black tracking-tight">{text.nav[item.labelKey]}</span>
                  </Button>
                );
              })}
            </div>
          </nav>

          <Dialog open={showTrackModal} onOpenChange={setShowTrackModal}>
            <DialogContent className="sm:max-w-2xl rounded-3xl border-none shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black">{text.labels.chooseTrackTitle}</DialogTitle>
                <DialogDescription className="text-sm font-medium">
                  {text.labels.chooseTrackDesc}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">{text.labels.selectDept}</label>
                  <select 
                    value={trackDeptId} 
                    onChange={e => {
                      const nextDeptId = e.target.value;
                      const dept = DEPARTMENTS.find(item => item.id === nextDeptId) || DEPARTMENTS[0];
                      const sub = dept?.subdepartments?.[0];
                      const roadmap = getRoadmapForSubdept(sub?.id);
                      const nextPath = roadmap.paths?.[0];
                      setTrackDeptId(nextDeptId);
                      setTrackSubdeptId(sub?.id || "");
                      setTrackPathId(nextPath?.id || "");
                    }} 
                    className="w-full bg-muted/50 border rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  >
                    {DEPARTMENTS.map(dept => <option key={dept.id} value={dept.id}>{getLocalized(dept, "title")}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">{text.labels.selectSubdept}</label>
                  <select 
                    value={trackSubdeptId} 
                    onChange={e => {
                      const nextSubId = e.target.value;
                      const roadmap = getRoadmapForSubdept(nextSubId);
                      const nextPath = roadmap.paths?.[0];
                      setTrackSubdeptId(nextSubId);
                      setTrackPathId(nextPath?.id || "");
                    }} 
                    className="w-full bg-muted/50 border rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  >
                    {(trackSubdepartments || []).map(sub => <option key={sub.id} value={sub.id}>{getLocalized(sub, "title")}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">{text.labels.selectPath}</label>
                  <select 
                    value={trackPathId} 
                    onChange={e => setTrackPathId(e.target.value)} 
                    className="w-full bg-muted/50 border rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  >
                    {(trackPaths || []).map(path => <option key={path.id} value={path.id}>{getPathTitle(path)}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2 border-t pt-4">
                <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">{text.actions.selectDistrict}</label>
                <p className="text-[10px] text-muted-foreground leading-relaxed">{text.actions.districtHint}</p>
                <select
                  value={trackDistrictId}
                  onChange={(e) => setTrackDistrictId(e.target.value)}
                  className="w-full bg-muted/50 border rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                >
                  <option value="">{lang === "bn" ? ": জেলা নির্বাচন (ঐচ্ছিক) :" : ": District (optional) :"}</option>
                  {BANGLADESH_DISTRICTS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {lang === "bn" ? d.nameBn : d.nameEn}
                    </option>
                  ))}
                </select>
              </div>
              <DialogFooter className="flex-col sm:flex-row items-center justify-between gap-4 border-t pt-6">
                <div className="text-sm font-bold text-muted-foreground break-all">
                  {text.labels.yourTrack}: <span className="text-primary">{getLocalized(trackDept, "title")} · {getLocalized(trackSubdept, "title")}</span>
                </div>
                <Button onClick={() => saveTrackSelection(trackDeptId, trackSubdeptId, trackPathId)} className="rounded-xl px-8 font-black shadow-lg shadow-primary/20">
                  {text.actions.saveTrack}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={submissionModal && !!submissionItem} onOpenChange={(open) => !open && (setSubmissionModal(false) || setSubmissionItem(null))}>
            <DialogContent className="sm:max-w-lg rounded-3xl border-none shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black">{text.actions.submitAssignment}</DialogTitle>
                <DialogDescription className="text-sm font-medium mt-1">
                  {lang === "bn" ? submissionItem?.item?.titleBn || submissionItem?.item?.titleEn : submissionItem?.item?.titleEn || submissionItem?.item?.titleBn}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={submitAssignment} className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground italic">Link</label>
                  <input 
                    value={submissionLink} 
                    onChange={e => setSubmissionLink(e.target.value)} 
                    placeholder={text.labels.submissionLink} 
                    className="w-full bg-muted/50 border rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground italic">Notes</label>
                  <textarea 
                    value={submissionNotes} 
                    onChange={e => setSubmissionNotes(e.target.value)} 
                    placeholder={text.labels.submissionNotes} 
                    className="w-full bg-muted/50 border rounded-xl px-4 py-3 text-sm font-medium min-h-[120px] focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                  />
                </div>
                <Button type="submit" variant="coop" className="w-full h-12 rounded-xl font-black text-lg shadow-lg shadow-brand-green/20">
                  {text.actions.submit}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={showAuth} onOpenChange={setShowAuth}>
            <DialogContent className="sm:max-w-md rounded-3xl border-none shadow-2xl p-0 overflow-hidden text-center">
              {/* Visually hidden title for screen readers */}
              <DialogHeader className="sr-only">
                <DialogTitle>{authMode === "signin" ? "Sign In to EquiSaaS BD" : "Create EquiSaaS BD Account"}</DialogTitle>
                <DialogDescription>Enter your email and password, or sign in with Google.</DialogDescription>
              </DialogHeader>
              <div className="bg-primary px-6 py-10 text-primary-foreground relative">
                <div className="absolute top-0 right-0 p-12 -translate-y-1/2 translate-x-1/2 bg-white/10 rounded-full blur-2xl" />

                <h3 className="text-3xl font-black tracking-tighter uppercase">{authMode === "signin" ? text.actions.signIn : "Create Account"}</h3>
                <p className="text-sm opacity-80 font-bold mt-2 uppercase tracking-widest">EquiSaaS BD Platform</p>
              </div>
              <div className="p-8 space-y-4">
                <div className="space-y-3">
                  <input 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="Email" 
                    className="w-full bg-muted/50 border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                  />
                  <input 
                    value={password} 
                    type="password" 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="Password" 
                    className="w-full bg-muted/50 border rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                  />
                </div>
                <Button onClick={handleEmail} className="w-full h-12 rounded-xl font-black text-lg shadow-lg shadow-primary/20">
                  {authMode === "signin" ? text.actions.signIn : "Create Account"}
                </Button>
                <div className="flex items-center gap-4 py-2">
                  <div className="h-px bg-muted flex-1" />
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">OR</span>
                  <div className="h-px bg-muted flex-1" />
                </div>
                <Button variant="outline" onClick={handleGoogle} className="w-full h-12 rounded-xl font-black border-2 gap-3">
                  <span aria-hidden="true" className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[11px] font-black text-slate-700">G</span>
                  Sign in with Google
                </Button>
                <button onClick={() => setAuthMode(authMode === "signin" ? "signup" : "signin")} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline mt-2">
                  {authMode === "signin" ? "No account? Create one" : "Have an account? Sign in"}
                </button>
              </div>
            </DialogContent>
          </Dialog>

          {toast && (
            <div className="fixed top-8 left-1/2 -translate-x-1/2 animate-in fade-in slide-in-from-top-4 duration-500 z-[100]">
              <Badge className="px-6 py-2 rounded-full text-sm font-black shadow-2xl bg-primary text-primary-foreground border-none">
                {toast}
              </Badge>
            </div>
          )}
        </div></LmsContext.Provider>;
};
export default App;
















































