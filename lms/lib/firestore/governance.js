import { collection, doc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

const LOCAL_VOTE_KEY = "equisaas-governance-votes-v1";
const mapDocs = (snap) => snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
const cleanText = (value) => String(value || "").trim();
const sanitizeId = (value) => cleanText(value).replace(/[^a-zA-Z0-9_-]/g, "_");

export const MOCK_GOVERNANCE_PROPOSALS = [
  {
    id: "q2-sme-pilot-focus",
    status: "open",
    type: "product-roadmap",
    title: "Choose the first Bangladesh-first SME pilot focus",
    titleBn: "প্রথম Bangladesh-first SME pilot focus বেছে নিন",
    summary: "Help decide which B2B SaaS workflow should receive the strongest discovery and prototype attention first.",
    summaryBn: "কোন B2B SaaS workflow আগে discovery এবং prototype focus পাবে তা নির্ধারণে মত দিন।",
    requiredSweatEquityUnits: 300,
    closesAtText: "Open for the current planning cycle",
    options: [
      { id: "hr-payroll", label: "HR & Payroll", labelBn: "HR ও Payroll", votes: 18 },
      { id: "pos", label: "Retail POS", labelBn: "Retail POS", votes: 12 },
      { id: "pharmacy-inventory", label: "Pharmacy Inventory", labelBn: "Pharmacy Inventory", votes: 14 },
    ],
  },
  {
    id: "production-credential-standard",
    status: "open",
    type: "credential-policy",
    title: "Define the first Production Contribution Badge standard",
    titleBn: "প্রথম Production Contribution Badge standard ঠিক করুন",
    summary: "Vote on the minimum proof needed before a co-builder can receive a production contribution credential.",
    summaryBn: "Production contribution credential পাওয়ার আগে ন্যূনতম কোন proof দরকার তা নিয়ে ভোট দিন।",
    requiredSweatEquityUnits: 500,
    closesAtText: "Policy draft vote",
    options: [
      { id: "merged-pr", label: "Merged PR to live product", labelBn: "Live product-এ merged PR", votes: 21 },
      { id: "approved-prd", label: "Approved PRD or product spec", labelBn: "Approved PRD বা product spec", votes: 9 },
      { id: "qa-release-proof", label: "QA release proof and issue closure", labelBn: "QA release proof ও issue closure", votes: 11 },
    ],
  },
  {
    id: "learning-proof-priority",
    status: "open",
    type: "lms-workflow",
    title: "Improve the next proof workflow experience",
    titleBn: "পরবর্তী proof workflow experience উন্নত করুন",
    summary: "Pick the improvement that should be implemented first to make weekly contribution tracking smoother.",
    summaryBn: "Weekly contribution tracking সহজ করতে কোন improvement আগে করা উচিত তা বেছে নিন।",
    requiredSweatEquityUnits: 100,
    closesAtText: "Open feedback window",
    options: [
      { id: "proof-template", label: "Better proof submission template", labelBn: "ভালো proof submission template", votes: 16 },
      { id: "mentor-feedback", label: "Mentor feedback checklist", labelBn: "Mentor feedback checklist", votes: 19 },
      { id: "ownership-timeline", label: "Ownership milestone timeline", labelBn: "Ownership milestone timeline", votes: 13 },
    ],
  },
];

function readLocalVotes() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(LOCAL_VOTE_KEY) || "{}") || {};
  } catch {
    return {};
  }
}

function writeLocalVote(vote) {
  if (typeof window === "undefined") return vote;
  const votes = readLocalVotes();
  votes[vote.id] = vote;
  window.localStorage.setItem(LOCAL_VOTE_KEY, JSON.stringify(votes));
  return vote;
}

export function getLocalGovernanceVote(proposalId, userId) {
  const voteId = `${sanitizeId(proposalId)}_${sanitizeId(userId)}`;
  return readLocalVotes()[voteId] || null;
}

export async function fetchActiveGovernanceProposals({ limitCount = 12 } = {}) {
  try {
    const snap = await getDocs(
      query(
        collection(db, "governanceProposals"),
        where("status", "==", "open"),
        orderBy("createdAt", "desc"),
        limit(limitCount),
      ),
    );
    const items = mapDocs(snap);
    return items.length ? items : MOCK_GOVERNANCE_PROPOSALS;
  } catch {
    return MOCK_GOVERNANCE_PROPOSALS;
  }
}

export async function submitGovernanceVote({ proposalId, selectedOptionId, userId, profile = {}, comment = "" }) {
  const safeProposalId = cleanText(proposalId);
  const safeOptionId = cleanText(selectedOptionId);
  const safeUserId = cleanText(userId);

  if (!safeProposalId || !safeOptionId || !safeUserId) {
    throw new Error("Proposal, selected option, and co-builder identity are required before voting.");
  }

  const voteId = `${sanitizeId(safeProposalId)}_${sanitizeId(safeUserId)}`;
  const payload = {
    id: voteId,
    proposalId: safeProposalId,
    selectedOptionId: safeOptionId,
    userId: safeUserId,
    voterName: cleanText(profile.displayName || profile.fullName || profile.email),
    voterEmail: cleanText(profile.email),
    voterRole: cleanText(profile.role),
    voterDepartmentId: cleanText(profile.departmentId),
    comment: cleanText(comment),
    updatedAt: new Date().toISOString(),
  };

  try {
    await setDoc(
      doc(db, "governanceVotes", voteId),
      {
        ...payload,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      },
      { merge: true },
    );
    return { ok: true, mode: "firestore", vote: payload };
  } catch {
    writeLocalVote(payload);
    return { ok: true, mode: "local", vote: payload };
  }
}
