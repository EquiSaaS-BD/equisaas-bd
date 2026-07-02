import { closeAdminApp, db, FieldValue } from "./shared/admin-app.mjs";

const run = async () => {
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const contributions = [
    { title: "LMS UI polish sprint", type: "Design", points: 12, hours: 6, status: "approved" },
    { title: "Auth flow QA", type: "PR", points: 8, hours: 4, status: "approved" },
    { title: "Bangla glossary update", type: "Content", points: 6, hours: 3, status: "pending" }
  ];

  const payouts = [
    { month: monthKey, revenue: 120000, costs: 30000, members: 24 }
  ];

  const proposals = [
    { title: "Adopt unified QA checklist", summary: "Standardize QA gate before publish across LMS + POS.", type: "process", deadline: "2026-04-01" },
    { title: "Community mentor stipend", summary: "Allocate small stipend from profit share for monthly mentor hours.", type: "finance", deadline: "2026-04-10" }
  ];

  const pathways = [
    { title: "Frontend Squad Track", summary: "React + Next.js with production patterns.", level: "Intermediate", link: "https://react.dev/" },
    { title: "Product Ops Track", summary: "Agile, roadmap, and experimentation basics.", level: "Beginner", link: "https://www.atlassian.com/agile" }
  ];

  const squads = [
    { title: "POS Core Squad", summary: "Checkout, inventory, and analytics milestones." },
    { title: "HR Suite Squad", summary: "Attendance, payroll, and employee lifecycle." }
  ];

  const translations = [
    { title: "React State Architecture", sourceLang: "EN", targetLang: "BN", status: "open", link: "https://react.dev/" },
    { title: "Agile Sprint Rituals", sourceLang: "EN", targetLang: "BN", status: "in-review", link: "https://www.atlassian.com/agile" }
  ];

  const mentorRequests = [
    { focus: "System design guidance", notes: "Need help with multi-tenant SaaS patterns.", status: "open" },
    { focus: "UX research feedback", notes: "Review onboarding flow user tests.", status: "open" }
  ];

  const qualityGates = [
    { title: "Course publish QA", checklist: ["Content reviewed", "Screens validated", "Translations verified"].map((label) => ({ label, done: false })) }
  ];

  const credentials = [
    { uid: "demo-uid-1", title: "Verified Contributor", badge: "Sprint 01", level: "Gold", link: "https://github.com/" }
  ];

  const roadmap = [
    { title: "Unified dashboard", summary: "Single portal for LMS, POS, HR.", status: "planned", eta: "Q2" },
    { title: "Mentor matching v1", summary: "Algorithmic matching for mentors/mentees.", status: "in-progress", eta: "Q2" }
  ];

  const trustSignals = [
    { uid: "demo-uid-1", signal: "Consistent weekly contributions", score: 9 },
    { uid: "demo-uid-2", signal: "High quality peer reviews", score: 8 }
  ];

  const batch = db.batch();

  contributions.forEach((item) => {
    const ref = db.collection("contributions").doc();
    batch.set(ref, { ...item, createdAt: FieldValue.serverTimestamp() });
  });

  payouts.forEach((item) => {
    const net = item.revenue - item.costs;
    const share = item.members ? Math.round(net / item.members) : 0;
    const ref = db.collection("payouts").doc();
    batch.set(ref, { ...item, net, share, createdAt: FieldValue.serverTimestamp() });
  });

  proposals.forEach((item) => {
    const ref = db.collection("proposals").doc();
    batch.set(ref, { ...item, createdAt: FieldValue.serverTimestamp() });
  });

  pathways.forEach((item) => {
    const ref = db.collection("pathways").doc();
    batch.set(ref, { ...item, createdAt: FieldValue.serverTimestamp() });
  });

  squads.forEach((item) => {
    const ref = db.collection("squads").doc();
    batch.set(ref, { ...item, createdAt: FieldValue.serverTimestamp() });
  });

  translations.forEach((item) => {
    const ref = db.collection("translations").doc();
    batch.set(ref, { ...item, createdAt: FieldValue.serverTimestamp() });
  });

  mentorRequests.forEach((item) => {
    const ref = db.collection("mentorRequests").doc();
    batch.set(ref, { ...item, createdAt: FieldValue.serverTimestamp() });
  });

  qualityGates.forEach((item) => {
    const ref = db.collection("qualityGates").doc();
    batch.set(ref, { ...item, createdAt: FieldValue.serverTimestamp() });
  });

  credentials.forEach((item) => {
    const ref = db.collection("credentials").doc();
    batch.set(ref, { ...item, issuedAt: FieldValue.serverTimestamp() });
  });

  roadmap.forEach((item) => {
    const ref = db.collection("roadmap").doc();
    batch.set(ref, { ...item, createdAt: FieldValue.serverTimestamp() });
  });

  trustSignals.forEach((item) => {
    const ref = db.collection("trustSignals").doc();
    batch.set(ref, { ...item, createdAt: FieldValue.serverTimestamp() });
  });

  await batch.commit();
  console.log("Seed data inserted for co-op hub collections.");
  await closeAdminApp();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
