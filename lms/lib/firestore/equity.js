import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

const mapDocs = (snap) => snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const safeNumber = (value) => {
  const nextValue = Number(value || 0);
  return Number.isFinite(nextValue) ? nextValue : 0;
};

export const DEFAULT_OWNERSHIP_MILESTONES = [
  {
    id: "observer",
    unitsRequired: 0,
    title: "Community Observer",
    titleBn: "কমিউনিটি অবজারভার",
    description: "Account created and ready to start proof-based contribution.",
    descriptionBn: "অ্যাকাউন্ট তৈরি হয়েছে এবং প্রুফভিত্তিক contribution শুরু করার জন্য প্রস্তুত।",
  },
  {
    id: "verified-co-builder",
    unitsRequired: 100,
    title: "Verified Co-builder",
    titleBn: "ভেরিফাইড কো-বিল্ডার",
    description: "First approved work records are visible in the contribution ledger.",
    descriptionBn: "প্রথম approved work record contribution ledger-এ দেখা যাচ্ছে।",
  },
  {
    id: "product-contributor",
    unitsRequired: 300,
    title: "Product Contributor",
    titleBn: "প্রোডাক্ট কন্ট্রিবিউটর",
    description: "Consistent learning proof is turning into product-ready contribution.",
    descriptionBn: "নিয়মিত learning proof এখন product-ready contribution-এ রূপ নিচ্ছে।",
  },
  {
    id: "core-co-builder",
    unitsRequired: 750,
    title: "Core Co-builder",
    titleBn: "কোর কো-বিল্ডার",
    description: "Trusted contributor with enough verified record to influence roadmap work.",
    descriptionBn: "রোডম্যাপ কাজকে প্রভাবিত করার মতো verified record থাকা trusted contributor।",
  },
  {
    id: "governance-eligible",
    unitsRequired: 1000,
    title: "Governance Eligible",
    titleBn: "গভর্ন্যান্স-এলিজিবল",
    description: "Eligible to participate in cooperative roadmap voting when proposals are open.",
    descriptionBn: "প্রস্তাব খোলা থাকলে cooperative roadmap voting-এ অংশ নেওয়ার যোগ্য।",
  },
  {
    id: "ownership-track",
    unitsRequired: 1500,
    title: "Ownership Track",
    titleBn: "মালিকানা ট্র্যাক",
    description: "Long-term ownership alignment candidate, pending legal and governance finalization.",
    descriptionBn: "legal এবং governance finalization-এর পর long-term ownership alignment candidate।",
  },
];

export function calculateOwnershipJourney({ profile = {}, ledgerEntries = [], milestones = DEFAULT_OWNERSHIP_MILESTONES } = {}) {
  const sweatEquityUnits = safeNumber(profile.sweatEquityUnits ?? profile.totalPoints);
  const approvedRecords = ledgerEntries.filter((entry) => entry.direction !== "debit").length;
  const sortedMilestones = [...milestones].sort((left, right) => safeNumber(left.unitsRequired) - safeNumber(right.unitsRequired));
  const currentMilestone = [...sortedMilestones].reverse().find((item) => sweatEquityUnits >= safeNumber(item.unitsRequired)) || sortedMilestones[0];
  const nextMilestone = sortedMilestones.find((item) => sweatEquityUnits < safeNumber(item.unitsRequired)) || null;
  const previousRequired = safeNumber(currentMilestone?.unitsRequired);
  const nextRequired = safeNumber(nextMilestone?.unitsRequired);
  const milestoneProgress = nextMilestone
    ? clamp(((sweatEquityUnits - previousRequired) / Math.max(1, nextRequired - previousRequired)) * 100, 0, 100)
    : 100;

  return {
    sweatEquityUnits,
    approvedRecords,
    estimatedSharePercent: Number(clamp(sweatEquityUnits / 250, 0, 5).toFixed(2)),
    currentMilestone,
    nextMilestone,
    milestoneProgress,
    governanceEligible: sweatEquityUnits >= 1000,
    milestones: sortedMilestones.map((item) => ({
      ...item,
      completed: sweatEquityUnits >= safeNumber(item.unitsRequired),
      current: item.id === currentMilestone?.id,
    })),
    recentRecords: ledgerEntries.slice(0, 6),
  };
}

export async function fetchOwnershipMilestones() {
  try {
    const snap = await getDocs(query(collection(db, "ownershipMilestones"), orderBy("unitsRequired", "asc"), limit(12)));
    const items = mapDocs(snap);
    return items.length ? items : DEFAULT_OWNERSHIP_MILESTONES;
  } catch {
    return DEFAULT_OWNERSHIP_MILESTONES;
  }
}

export async function fetchCoBuilderEquitySnapshot({ profile = {}, ledgerEntries = [] } = {}) {
  const milestones = await fetchOwnershipMilestones();
  return calculateOwnershipJourney({ profile, ledgerEntries, milestones });
}
