import { doc } from "firebase/firestore";

export const PUBLIC_PROFILE_DOC_ID = "profile";
export const PUBLIC_PROFILE_BASE_PATH = "/u";
export const PUBLIC_PROFILE_IDENTITY_FIELDS = [
  "avatarUrl",
  "badges",
  "departmentId",
  "districtId",
  "displayName",
  "pathId",
  "pathTitleBn",
  "pathTitleEn",
  "squadTitleBn",
  "squadTitleEn",
  "subdepartmentId",
  "updatedAt",
  "userId",
];
export const PUBLIC_PROFILE_ADMIN_FIELDS = [
  ...PUBLIC_PROFILE_IDENTITY_FIELDS,
  "certificateCount",
  "coopPoints",
  "featuredCredentialIssuedAt",
  "featuredCredentialLevel",
  "featuredCredentialTitle",
  "trustScore",
];
export const PUBLIC_PROFILE_ALLOWED_FIELDS = PUBLIC_PROFILE_ADMIN_FIELDS;
export const EMPTY_PUBLIC_PROFILE_STATS = {
  badges: [],
  certificateCount: 0,
  coopPoints: 0,
  latestCredential: null,
  trustScore: 0,
};

const RANK_LADDER = [
  { min: 2500, labelEn: "Equity Vanguard", labelBn: "ইকুইটি ভ্যানগার্ড" },
  { min: 1200, labelEn: "Co-op Steward", labelBn: "কো-অপ স্টুয়ার্ড" },
  { min: 500, labelEn: "Build Captain", labelBn: "বিল্ড ক্যাপ্টেন" },
  { min: 150, labelEn: "Equity Builder", labelBn: "ইকুইটি বিল্ডার" },
  { min: 0, labelEn: "Founding Member", labelBn: "ফাউন্ডিং মেম্বার" },
];

export function getPublicProfileDocRef(db, userId) {
  return doc(db, "users", userId, "public", PUBLIC_PROFILE_DOC_ID);
}

export function getPublicProfileRoute(pathname = "") {
  const normalized = String(pathname || "/").replace(/\/+$/, "") || "/";
  const match = normalized.match(/^\/(?:lms\/)?u\/([^/]+)$/i);
  if (!match) return null;
  return { userId: decodeURIComponent(match[1]) };
}

export function getPublicProfilePath(userId, absolute = false) {
  const path = `${PUBLIC_PROFILE_BASE_PATH}/${encodeURIComponent(userId)}`;
  if (!absolute || typeof window === "undefined") return path;
  return `${window.location.origin}${path}`;
}

export function getMemberRank(coopPoints = 0, trustScore = 0, lang = "en") {
  const signal = Number(coopPoints || 0) + Number(trustScore || 0) * 10;
  const band = RANK_LADDER.find((entry) => signal >= entry.min) || RANK_LADDER.at(-1);
  return lang === "bn" ? band.labelBn : band.labelEn;
}

export function buildPublicProfileIdentity({
  user,
  profile,
  selectedPath,
  earnedBadgeIds = [],
}) {
  if (!user) return null;

  const squadTitleBn =
    profile?.squadTitleBn ||
    profile?.squadTitle ||
    (selectedPath?.titleBn ? `${selectedPath.titleBn} স্কোয়াড` : "");
  const squadTitleEn =
    profile?.squadTitleEn ||
    profile?.squadTitle ||
    (selectedPath?.titleEn ? `${selectedPath.titleEn} Squad` : "");

  return {
    userId: user.uid,
    displayName: profile?.displayName || user.displayName || user.email || "EquiSaaS Member",
    avatarUrl: profile?.avatarUrl || user.photoURL || "",
    departmentId: profile?.departmentId || "",
    subdepartmentId: profile?.subdepartmentId || "",
    pathId: profile?.pathId || selectedPath?.id || "",
    pathTitleBn: selectedPath?.titleBn || "",
    pathTitleEn: selectedPath?.titleEn || "",
    squadTitleBn,
    squadTitleEn,
    districtId: profile?.districtId || "",
    badges: Array.isArray(earnedBadgeIds) ? earnedBadgeIds : [],
  };
}

export function getPublicProfileStats(data) {
  if (!data) return EMPTY_PUBLIC_PROFILE_STATS;

  return {
    badges: Array.isArray(data.badges) ? data.badges : [],
    certificateCount: Number(data.certificateCount || 0),
    coopPoints: Number(data.coopPoints || 0),
    latestCredential: data.featuredCredentialTitle
      ? {
          id: `featured-${data.userId || "credential"}`,
          issuedAt: data.featuredCredentialIssuedAt || null,
          level: data.featuredCredentialLevel || "",
          title: data.featuredCredentialTitle,
        }
      : null,
    trustScore: Number(data.trustScore || 0),
  };
}
