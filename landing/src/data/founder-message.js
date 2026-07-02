import { normalizeLocalizedTree } from "@/lib/localized-copy";

const RAW_FOUNDER_PROFILE = {
  name: "Kholipha Ahmmad Al-Amin",
  banglaName: "খলিফা আহম্মেদ আল-আমিন",
  role: "Founder & CEO, EquiSaaS BD",
  roleBn: "ফাউন্ডার এবং সিইও, ইকুই স্যাস বিডি",
  location: "Dhaka, Bangladesh",
  imagePath: "/founder.jpg",
  imageAlt: "Kholipha Ahmmad Al-Amin, Founder and CEO of EquiSaaS BD",
  imageAltBn: "ইকুই স্যাস বিডির ফাউন্ডার এবং সিইও খলিফা আহম্মেদ আল-আমিন",
};

const EXACT_ENGLISH_STATEMENT =
  "\"Welcome to EquiSaaS BD. When I dreamed of this platform, I did not want to build just another conventional software company. I wanted to start an open movement. For too long, unpaid internships and the devaluation of talent have become normal in the tech industry. Thousands of talented young people are stuck between theoretical knowledge and practical skills. At EquiSaaS BD, we are changing this reality one contribution at a time. Our journey began with a human purpose. Our first goal is to build a strong tech network across all 64 districts of Bangladesh. We are creating a community-based ecosystem where young people from any part of the country can learn modern skills across 9 different departments, at the daily commitment that fits their life, completely free of cost. Once our community has built real production skill, we go on to ship production-ready B2B SaaS for local and global markets. We operate through a 'Sweat Equity' model. Here, your hard work turns directly into ownership. We do not only teach; we build projects together, and we share in the success together. EquiSaaS BD is an open tech cooperative. Every line of code, every design, and every strategy we create is building the foundation of a future where talent is valued properly. Let us begin a new chapter in Bangladesh's technology sector. Together We Build, Together We Own.\"";

const EXACT_BANGLA_STATEMENT =
  "\"ইকুই স্যাস বিডি (EquiSaaS BD)-তে আপনাকে স্বাগতম। এই প্ল্যাটফর্মটি যখন আমি স্বপ্ন দেখি, তখন আমি শুধু আরেকটি গতানুগতিক সফটওয়্যার কোম্পানি তৈরি করতে চাইনি। আমি চেয়েছিলাম একটি বিপ্লব ঘটাতে। দীর্ঘদিন ধরে টেক ইন্ডাস্ট্রিতে আনপেইড ইন্টার্নশিপ এবং মেধার অবমূল্যায়ন একটি স্বাভাবিক বিষয় হয়ে দাঁড়িয়েছে। হাজার হাজার মেধাবী তরুণ তাত্ত্বিক জ্ঞান এবং প্র্যাকটিক্যাল স্কিলের মাঝে আটকে আছে। ইকুই স্যাস বিডি-তে আমরা এই দৃশ্যপটটি চিরতরে বদলে দিচ্ছি। আমাদের যাত্রা শুরু হয়েছে একটি মানবিক উদ্দেশ্যকে সামনে রেখে। আমাদের প্রথম লক্ষ্য হলো বাংলাদেশের ৬৪টি জেলায় একটি শক্তিশালী টেক নেটওয়ার্ক গড়ে তোলা। আমরা এমন একটি কমিউনিটি-ভিত্তিক ইকোসিস্টেম তৈরি করছি, যেখানে দেশের যেকোনো প্রান্তের তরুণরা তাদের দৈনিক সময়ের সাথে মানানসই গতিতে ৯টি ভিন্ন ভিন্ন ডিপার্টমেন্টের আধুনিক স্কিল সম্পূর্ণ বিনা মূল্যে শিখতে পারবে। আমাদের কমিউনিটি যখন আসল প্রোডাকশন দক্ষতা গড়ে তোলে, তখন আমরা লোকাল এবং গ্লোবাল মার্কেটের জন্য প্রোডাকশন-রেডি B2B SaaS তৈরি করি। আমরা কাজ করছি 'Sweat Equity' বা মেধাভিত্তিক মালিকানা মডেলে। এখানে আপনার পরিশ্রম সরাসরি আপনার মালিকানায় রূপান্তরিত হয়। আমরা শুধু শেখাই না, আমরা সবাই মিলে প্রজেক্ট দাঁড়াই করাই এবং সফলতার ভাগীদারও হই একসাথে। ইকুই স্যাস বিডি একটি উন্মুক্ত টেক কো-অপারেটিভ। আমাদের লেখা প্রতিটি কোড, প্রতিটি ডিজাইন এবং প্রতিটি স্ট্র্যাটেজি এমন একটি ভবিষ্যতের ভিত্তি গড়ছে, যেখানে মেধার সঠিক মূল্যায়ন হয়। আসুন, বাংলাদেশের টেকনোলজি সেক্টরে নতুন এক অধ্যায়ের সূচনা করি। একসাথে গড়ি সব, একসাথে মালিকানা।\"";

const RAW_FOUNDER_MESSAGE = {
  en: {
    badge: "Founder's Message",
    title: "A Vision for the Future: Building Together, Owning Together",
    message: EXACT_ENGLISH_STATEMENT,
    signoff: "- Kholipha Ahmmad Al-Amin, Founder & CEO, EquiSaaS BD",
    intro:
      "A founder-led commitment to fair skill-building, real production work, and shared ownership for builders across Bangladesh.",
    panelEyebrow: "Why We Started",
    panelTitle: "Why EquiSaaS BD exists",
    panelCopy:
      "EquiSaaS BD started with a simple belief: talented people in Bangladesh should be able to learn, build, and grow without being pushed into exploitative unpaid work.",
    facts: [
      "Build a strong community network across all 64 districts of Bangladesh",
      "Provide practical hands-on learning across 9 specialized technical departments",
      "Replace unpaid internships with a transparent, contribution-based Sweat Equity model",
      "Support local merchants and SMEs with internet-resilient B2B software",
    ],
    labels: {
      portraitBadge: "Founder & CEO",
      location: "Based in Dhaka, serving builders across Bangladesh",
      readMore: "Read the full founder's page",
      email: "Email CEO Office",
      tabsEn: "English",
      tabsBn: "বাংলা",
      messageLabel: "A message from our founder",
      portraitLead:
        "From community training to production-ready SaaS, this mission is about building fair opportunity first.",
      commitments: "What guides this mission",
      commitmentsLead:
        "Every department, learning path, and product roadmap is meant to create real skill, real work, and real ownership.",
      quickLinks: "Explore next",
      orientation: "Watch Orientation 2026",
      join: "Join the builder network",
    },
  },
  bn: {
    badge: "ফাউন্ডারের বার্তা",
    title: "আগামীর রূপরেখা: একসাথে গড়ি, একসাথে মালিক হই",
    message: EXACT_BANGLA_STATEMENT,
    signoff: "- খলিফা আহম্মেদ আল-আমিন, ফাউন্ডার এবং সিইও, ইকুই স্যাস বিডি",
    intro:
      "বাংলাদেশের তরুণদের ন্যায্য শেখার সুযোগ, বাস্তব কাজ, আর মালিকানার পথে এগিয়ে নেওয়ার একটি প্রতিষ্ঠাতা-নেতৃত্বাধীন অঙ্গীকার।",
    panelEyebrow: "কেন শুরু",
    panelTitle: "কেন EquiSaaS BD তৈরি করা হয়েছে",
    panelCopy:
      "EquiSaaS BD শুরু হয়েছে এই বিশ্বাস থেকে যে বাংলাদেশের মেধাবী তরুণদের শেখা, কাজ করা, এবং এগিয়ে যাওয়ার জন্য শোষণমূলক unpaid work-এর ভেতর দিয়ে যেতে হবে না।",
    facts: [
      "বাংলাদেশের ৬৪ জেলাজুড়ে মেধা ও দক্ষতার নেটওয়ার্ক গড়ে তোলা",
      "৯টি প্রফেশনাল ডিপার্টমেন্টে বাস্তব ও প্র্যাকটিক্যাল লার্নিং নিশ্চিত করা",
      "আনপেইড ইন্টার্নশিপ বন্ধ করে প্রতিটা পরিশ্রমের ঘণ্টাকে সোয়েট ইকুইটিতে রূপ দেওয়া",
      "সবাই মিলে বাংলাদেশি ক্ষুদ্র ও মাঝারি ব্যবসার জন্য সহজ ও অফলাইন-ফার্স্ট স্যাস তৈরি করা",
    ],
    labels: {
      portraitBadge: "ফাউন্ডার এবং সিইও",
      location: "ঢাকা থেকে শুরু, লক্ষ্য সারা বাংলাদেশের builders",
      readMore: "ফাউন্ডারের পুরো পেজ পড়ুন",
      email: "CEO Office-এ ইমেইল করুন",
      tabsEn: "English",
      tabsBn: "বাংলা",
      messageLabel: "ফাউন্ডারের পক্ষ থেকে একটি বার্তা",
      portraitLead:
        "কমিউনিটি training থেকে production-ready SaaS পর্যন্ত এই যাত্রার কেন্দ্রে আছে ন্যায্য সুযোগ, বাস্তব স্কিল, আর সম্মিলিত মালিকানা।",
      commitments: "এই মিশনকে চালিত করে যা",
      commitmentsLead:
        "প্রতিটি department, learning path, আর product roadmap এমনভাবে গড়া হচ্ছে যাতে মানুষ বাস্তব দক্ষতা, কাজ, আর মালিকানা পায়।",
      quickLinks: "এরপর দেখুন",
      orientation: "Orientation 2026 দেখুন",
      join: "Builder network-এ যোগ দিন",
    },
  },
};

const RAW_FOUNDER_PAGE_META = {
  title: "Kholipha Ahmmad Al-Amin | Founder of EquiSaaS BD",
  description:
    "Read the founder's message from Kholipha Ahmmad Al-Amin, Founder & CEO of EquiSaaS BD, Bangladesh's first open tech cooperative and community-driven SaaS ecosystem.",
  ogDescription:
    "A founder-led vision for Bangladesh's first open tech cooperative, sweat equity model, and community-driven SaaS mission.",
};

export const FOUNDER_PROFILE = normalizeLocalizedTree(RAW_FOUNDER_PROFILE);
export const FOUNDER_MESSAGE = normalizeLocalizedTree(RAW_FOUNDER_MESSAGE);
export const FOUNDER_PAGE_META = normalizeLocalizedTree(RAW_FOUNDER_PAGE_META);
