/**
 * badgeEngine.js
 * Pure utility ;  computes and awards digital badges based on user state.
 * All badge data is client-side; badge IDs are stored in users/{uid}.badges[] in Firestore.
 */

export const BADGE_CATALOG = [
  {
    id: "first_login",
    emoji: "🚀",
    titleEn: "First Login",
    titleBn: "প্রথম লগইন",
    descEn: "Joined the EquiSaaS BD co-operative.",
    descBn: "EquiSaaS BD কো-অপারেটিভে যোগ দিয়েছেন।",
    color: "from-blue-500 to-indigo-500",
  },
  {
    id: "track_selected",
    emoji: "🗺️",
    titleEn: "Pathfinder",
    titleBn: "পাথফাইন্ডার",
    descEn: "Chose your learning track.",
    descBn: "আপনার লার্নিং ট্র্যাক নির্বাচন করেছেন।",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "first_contribution",
    emoji: "⚡",
    titleEn: "Sweat Equity",
    titleBn: "সোয়েট ইকুইটি",
    descEn: "Logged your first contribution to the co-op.",
    descBn: "কো-অপে প্রথম কন্ট্রিবিউশন লগ করেছেন।",
    color: "from-amber-400 to-orange-500",
  },
  {
    id: "module_1_complete",
    emoji: "📘",
    titleEn: "Module 1 Complete",
    titleBn: "মডিউল ১ সম্পন্ন",
    descEn: "Finished your first learning module.",
    descBn: "প্রথম লার্নিং মডিউল শেষ করেছেন।",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "bug_hunter",
    emoji: "🐛",
    titleEn: "Bug Hunter",
    titleBn: "বাগ হান্টার",
    descEn: "Submitted a Quality Gate review.",
    descBn: "একটি কোয়ালিটি গেট রিভিউ জমা দিয়েছেন।",
    color: "from-rose-500 to-red-500",
  },
  {
    id: "squad_member",
    emoji: "🛡️",
    titleEn: "Squad Member",
    titleBn: "স্কোয়াড মেম্বার",
    descEn: "Joined a cooperative squad.",
    descBn: "একটি কো-অপারেটিভ স্কোয়াডে যোগ দিয়েছেন।",
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: "mentor_seeker",
    emoji: "🎓",
    titleEn: "Mentor Seeker",
    titleBn: "মেন্টর সিকার",
    descEn: "Requested your first mentorship session.",
    descBn: "প্রথম মেন্টরশিপ সেশন অনুরোধ করেছেন।",
    color: "from-violet-500 to-purple-500",
  },
  {
    id: "translator",
    emoji: "🌐",
    titleEn: "Bilingual Bridge",
    titleBn: "বাইলিঙ্গুয়াল ব্রিজ",
    descEn: "Submitted a translation contribution.",
    descBn: "একটি ট্রান্সলেশন কন্ট্রিবিউশন জমা দিয়েছেন।",
    color: "from-green-500 to-emerald-500",
  },
];

/**
 * Determine which badges a user should have earned based on their live state.
 * Returns an array of badge IDs that the user qualifies for.
 *
 * @param {{
 *   user: object|null,
 *   profile: object|null,
 *   contributions: object[],
 *   mentorRequests: object[],
 *   translations: object[],
 *   qualityGates: object[],
 * }} state
 * @returns {string[]} ;  list of badge IDs the user qualifies for
 */
export function computeEarnedBadges(state) {
  const {
    user,
    profile,
    contributions = [],
    mentorRequests = [],
    translations = [],
  } = state;

  if (!user) return [];

  const earned = [];

  // 🚀 First Login ;  just being signed in
  earned.push("first_login");

  // 🗺️ Track selected
  if (profile?.departmentId && profile?.subdepartmentId) {
    earned.push("track_selected");
  }

  // ⚡ First contribution
  if (contributions.length > 0) {
    earned.push("first_contribution");
  }

  // 🎓 Mentor Seeker
  if (mentorRequests.length > 0) {
    earned.push("mentor_seeker");
  }

  // 🌐 Translator
  if (translations.length > 0) {
    earned.push("translator");
  }

  return earned;
}

/**
 * Merge computed badges with any manually stored badge IDs.
 * @param {string[]} computed
 * @param {string[]} stored
 * @returns {string[]}
 */
export function mergeEarnedBadges(computed, stored = []) {
  return [...new Set([...computed, ...(stored || [])])];
}

/**
 * Given a list of badge IDs, return the full badge objects.
 * @param {string[]} ids
 * @returns {object[]}
 */
export function getBadgeObjects(ids = []) {
  return ids
    .map((id) => BADGE_CATALOG.find((b) => b.id === id))
    .filter(Boolean);
}
