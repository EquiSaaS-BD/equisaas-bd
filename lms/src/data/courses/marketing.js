import { mergeGeneratedPath } from "../generated-course-utils.js";
import { MARKETING_GROWTH_MONTH_ONE } from "./marketing-growth-month-one.js";
import { MARKETING_SUCCESS_MONTH_ONE } from "./marketing-success-month-one.js";

// ==========================================
// MARKETING - GROWTH & SUCCESS MASTERCLASS
// ==========================================

const legacyLesson = (titleEn, titleBn, contentEn, contentBn, resources = []) => ({
  titleEn,
  titleBn,
  contentEn,
  contentBn,
  sandpack: null,
  resources,
});

const LEGACY_MARKETING_COURSES = {
  // --- GROWTH MARKETING PATH (6 modules) ---
  "gm-m1": {
    "gm-1-1": legacyLesson(
      "Growth vs Traditional Marketing",
      "গ্রোথ বনাম ট্র্যাডিশনাল মার্কেটিং",
      `# The Growth Hacker's Mindset 📈
Traditional Marketing is like buying a massive billboard. You spend a lot of money and *hope* people see it.
Growth Marketing is like handing out free samples at the supermarket, tracking exactly who took one, and asking them to bring a friend for another free sample!

A Growth Marketer focuses on the entire **AARRR Funnel**:
- **Acquisition:** How do users find us?
- **Activation:** Do they have a great first experience?
- **Retention:** Do they come back?
- **Referral:** Do they tell others?
- **Revenue:** How do we make money?

### 🛠️ Do It Yourself (DIY)
- [ ] Pick your favorite SaaS tool.
- [ ] Identify their "Acquisition" strategy (Ads? SEO? Word of mouth?).
- [ ] Write down how they get you to refer a friend.`,
      `# গ্রোথ হ্যাকারের মাইন্ডসেট 📈
ট্র্যাডিশনাল মার্কেটিং হলো রাস্তার মোড়ে বিশাল বিলবোর্ড কেনার মতো। আপনি অনেক টাকা খরচ করে *আশা* করছেন মানুষ সেটা দেখবে।
অন্যদিকে, গ্রোথ মার্কেটিং হলো সুপারমার্কেটে ফ্রি স্যাম্পল বিলি করার মতো! আপনি হিসেব রাখছেন কে স্যাম্পল নিলো এবং তাদের বলছেন আরেকজন বন্ধুকে নিয়ে আসলে আরেকটা স্যাম্পল ফ্রি পাবেন!

একজন গ্রোথ মার্কেটার পুরো **AARRR ফানেল** নিয়ে কাজ করেন:
- **Acquisition (অধিগ্রহণ):** ইউজাররা আমাদের কীভাবে খুঁজে পায়?
- **Activation (অ্যাক্টিভেশন):** প্রথম ব্যবহারে কি তারা খুশি?
- **Retention (রিটেনশন):** তারা কি আবার ফিরে আসে?
- **Referral (রেফারেল):** তারা কি অন্যদের বলে?
- **Revenue (রেভিনিউ):** আমরা কীভাবে টাকা আয় করি?

### 🛠️ আপনার করণীয় (DIY)
- [ ] আপনার প্রিয় একটি সফটওয়্যার (SaaS) টুল বেছে নিন।
- [ ] তাদের "অধিগ্রহণ" বা কাস্টমার আনার কৌশল কী (অ্যাড? এসইও?) তা বোঝার চেষ্টা করুন।
- [ ] বন্ধুকে ইনভাইট বা রেফার করার জন্য তারা কী কৌশল ব্যবহার করে তা লিখুন।`
    ),
    "gm-1-2": legacyLesson("Customer Persona Mapping", "কাস্টমার পারসোনা ম্যাপিং", "Who is the buyer?", "ক্রেতা কে?", []),
    "gm-1-3": legacyLesson("Funnel Mechanics", "ফানেল মেকানিক্স", "The psychology of flow", "ফ্লো সাইকোলজি", [
        { labelEn: "HubSpot Academy", labelBn: "হাবস্পট একাডেমি", url: "https://academy.hubspot.com/" }
    ])
  },
  "gm-m2": {
    "gm-2-1": legacyLesson("SEO & Content Strategy", "SEO ও কন্টেন্ট স্ট্র্যাটেজি", "Organic traffic", "অর্গানিক ট্র্যাফিক", []),
    "gm-2-2": legacyLesson("Performance Marketing", "পারফরম্যান্স মার্কেটিং", "PPC and CAC", "PPC ও CAC", []),
    "gm-2-3": legacyLesson("Social Media Growth", "সোশ্যাল মিডিয়া গ্রোথ", "Viral loops", "ভাইরাল লুপস", [])
  },
  "gm-m3": {
    "gm-3-1": legacyLesson("Email Marketing Automation", "ইমেইল মার্কেটিং অটোমেশন", "Drip campaigns", "ড্রিপ ক্যাম্পেইন", []),
    "gm-3-2": legacyLesson("Conversion Rate Opt (CRO)", "কনভার্শন রেট অপটিমাইজেশন", "A/B Testing", "A/B টেস্টিং", []),
    "gm-3-3": legacyLesson("Landing Page Copywriting", "ল্যান্ডিং পেজ কপিরাইটিং", "Writing words that sell", "বিক্রয়যোগ্য লেখা", [])
  },
  "gm-m4": {
    "gm-4-1": legacyLesson("Data Driven Decisions", "ডেটা ড্রিভেন সিদ্ধান্ত", "GA4 and Mixpanel", "GA4 ও মিক্সপ্যানেল", []),
    "gm-4-2": legacyLesson("LTV vs CAC Analysis", "LTV বনাম CAC", "Unit economics", "ইউনিট ইকোনমিক্স", []),
    "gm-4-3": legacyLesson("Affiliate & Partner Programs", "অ্যাফিলিয়েট ও পার্টনার প্রোগ্রাম", "B2B partnerships", "B2B অংশীদারিত্ব", [])
  },
  "gm-m5": {
    "gm-5-1": legacyLesson("PLG: Product-Led Growth", "প্রোডাক্ট-লেড গ্রোথ (PLG)", "Product as the marketing", "মার্কেটিং হিসেবে প্রোডাক্ট", []),
    "gm-5-2": legacyLesson("Referral Mechanics", "রেফারেল মেকানিক্স", "Incentivizing users", "ইউজার ইনসেনটিভস", []),
    "gm-5-3": legacyLesson("Growth Loops", "গ্রোথ লুপস", "Sustainable scaling", "সাসটেইনেবল স্কেলিং", [])
  },
  "gm-m6": {
    "gm-6-1": legacyLesson("Marketing Stack Overview", "মার্কেটিং স্ট্যাক", "Hubspot, ActiveCampaign etc", "হাবস্পট, অ্যাকটিভক্যাম্পেইন", []),
    "gm-6-2": legacyLesson("Budget Allocation", "বাজেট অ্যালোকেশন", "Where to spend money?", "কোথায় টাকা খরচ করবেন?", []),
    "gm-6-3": legacyLesson("Campaign Post-Mortem", "ক্যাম্পেইন পোস্ট-মর্টেম", "Analyzing what went wrong", "ভুল বিশ্লেষণ করা", [])
  },

  // --- CUSTOMER SUCCESS PATH (6 modules) ---
  "cs-m1": {
    "cs-1-1": legacyLesson(
      "Support vs Success",
      "সাপোর্ট বনাম সাকসেস",
      `# Proactive vs Reactive 🛡️
Customer Support is **reactive**. A customer has a problem (e.g., forgotten password), they call you, and you fix it.
Customer Success is **proactive**. You look at a customer's usage data, notice they aren't using the app's best feature, and you call *them* to offer training!

CS ensures the customer achieves their desired outcome using your product. If the customer succeeds, they subscribe again next year!

### 🛠️ Do It Yourself (DIY)
- [ ] Think of a time you had a bad customer service experience.
- [ ] How could a 'Customer Success' mindset have prevented the issue entirely?`,
      `# প্রো-অ্যাকটিভ বনাম রি-অ্যাকটিভ 🛡️
কাস্টমার সাপোর্ট হলো **রি-অ্যাকটিভ**। গ্রাহকের সমস্যা হলে (যেমন পাসওয়ার্ড ভুলে গেলে) সে আপনাকে কল দেয়, এবং আপনি তা সমাধান করেন।
কাস্টমার সাকসেস হলো **প্রো-অ্যাকটিভ**। আপনি কাস্টমারের ডেটা চেক করেন, খেয়াল করেন যে সে অ্যাপের সবচেয়ে ভালো ফিচারটি ব্যবহার করছে না, এবং আপনি *নিজেই* তাকে ফোন করে ট্রেইনিং সেধে দেন!

CS নিশ্চিত করে যেন গ্রাহক আপনার প্রোডাক্ট ব্যবহার করে সফল হয়। গ্রাহক সফল হলে সে পরের বছরও সাবস্ক্রিপশন কিনবে!

### 🛠️ আপনার করণীয় (DIY)
- [ ] এমন একটি সময়ের কথা ভাবুন যখন আপনি বাজে কাস্টমার সার্ভিস পেয়েছিলেন।
- [ ] 'কাস্টমার সাকসেস' মাইন্ডসেট থাকলে কীভাবে সেই সমস্যা একদম শুরুতেই রোধ করা যেত?`
    ),
    "cs-1-2": legacyLesson("The Customer Journey", "কাস্টমার জার্নি", "Onboarding to Renewal", "অনবোর্ডিং থেকে রিনিউয়াল", []),
    "cs-1-3": legacyLesson("Empathy & Communication", "এমপ্যাথি ও কমিউনিকেশন", "Soft skills for CS", "CS-এর জন্য সফট স্কিলস", [
        { labelEn: "Gainsight CS Resources", labelBn: "গেইনসাইট CS রিসোর্স", url: "https://www.gainsight.com/resources/" }
    ])
  },
  "cs-m2": {
    "cs-2-1": legacyLesson("Onboarding Mastery", "অনবোর্ডিং মাস্টারি", "First time to value", "ফাস্ট টাইম টু ভ্যালু", []),
    "cs-2-2": legacyLesson("Health Scoring", "হেল স্কোরিং", "Predicting churn risk", "চার্ন ঝুঁকি অনুমান", []),
    "cs-2-3": legacyLesson("Quarterly Business Reviews", "কোয়ার্টারলি বিজনেস রিভিউ", "QBR execution", "QBR এক্সিকিউশন", [])
  },
  "cs-m3": {
    "cs-3-1": legacyLesson("Churn Reduction Tactics", "চার্ন রিডাকশন কৌশল", "Saving at-risk accounts", "ঝুঁকিপূর্ণ অ্যাকাউন্ট রক্ষা", []),
    "cs-3-2": legacyLesson("Handling Escalations", "এসকেলেশন হ্যান্ডলিং", "Angry customers", "রাগান্বিত গ্রাহক সামলানো", []),
    "cs-3-3": legacyLesson("Product Feedback Loop", "প্রোডাক্ট ফিডব্যাক লুপ", "Relaying feedback to Product", "প্রোডাক্ট টিমের কাছে ফিডব্যাক দেওয়া", [])
  },
  "cs-m4": {
    "cs-4-1": legacyLesson("Upselling & Cross-selling", "আপসেল ও ক্রস-সেল", "Growing account revenue", "অ্যাকাউন্ট রেভিনিউ বাড়ানো", []),
    "cs-4-2": legacyLesson("Advocacy & Referral", "অ্যাডভোকেসি ও রেফারেল", "Creating champions", "চ্যাম্পিয়ন কাস্টমার তৈরি", []),
    "cs-4-3": legacyLesson("Customer Education", "কাস্টমার এডুকেশন", "Help centers & webinars", "হেল্প সেন্টার ও ওয়েবিনার", [])
  },
  "cs-m5": {
    "cs-5-1": legacyLesson("Ticketing Systems", "টিকেটিং সিস্টেমস", "Zendesk & Intercom", "জেনডেস্ক ও ইন্টারকম", []),
    "cs-5-2": legacyLesson("CS Automation", "CS অটোমেশন", "Automated email sequences", "অটোমেটেড ইমেইল", []),
    "cs-5-3": legacyLesson("Playbook Creation", "প্লেবুক তৈরি করা", "Standard operating procedures", "SOP লেখা", [])
  },
  "cs-m6": {
    "cs-6-1": legacyLesson("Net Promoter Score (NPS)", "নেট প্রোমোটার স্কোর (NPS)", "Measuring loyalty", "লয়্যালটি মাপা", []),
    "cs-6-2": legacyLesson("CSAT and CES", "CSAT ও CES", "Satisfaction metrics", "স্যাটিসফ্যাকশন মেট্রিকস", []),
    "cs-6-3": legacyLesson("Managing a CS Team", "CS টিম ম্যানেজ করা", "Leadership in success", "সাকসেস টিমে লিডারশিপ", [])
  }
};

LEGACY_MARKETING_COURSES["mk-m1"] = MARKETING_GROWTH_MONTH_ONE;
LEGACY_MARKETING_COURSES["cs-m1"] = MARKETING_SUCCESS_MONTH_ONE;

export const MARKETING_COURSES = mergeGeneratedPath("marketing-success", mergeGeneratedPath("marketing-growth", LEGACY_MARKETING_COURSES));

