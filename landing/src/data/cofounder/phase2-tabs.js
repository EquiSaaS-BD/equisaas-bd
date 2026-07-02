import {
  Briefcase,
  ChevronRight,
  FileText,
  Layers,
  MonitorSmartphone,
  PenTool,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

export const phase2Tabs = [
  {
    id: "trust",
    labelBn: "স্বচ্ছতা ও আস্থা",
    labelEn: "Co-op Trust",
    items: [
      {
        titleBn: "কন্ট্রিবিউশন লেজার",
        titleEn: "Contribution Ledger",
        descBn: "প্রতিটি অবদান, প্রুফ লিংক ও পিয়ার রিভিউ ট্র্যাকিং।",
        descEn: "Track every contribution, proof links, and peer reviews.",
        icon: ShieldCheck,
      },
      {
        titleBn: "প্রফিট-শেয়ার সিমুলেটর",
        titleEn: "Profit-Share Simulator",
        descBn: "রেভিনিউ, কস্ট এবং সদস্যভিত্তিক শেয়ার ভিজুয়ালাইজেশন।",
        descEn: "Visualize revenue, costs, and member-wise shares.",
        icon: Briefcase,
      },
      {
        titleBn: "ডিসিশন জার্নাল",
        titleEn: "Decision Journal",
        descBn: "ভোটিং, যুক্তি এবং সিদ্ধান্তের ট্র্যাক রেকর্ড।",
        descEn: "Voting, rationale, and decision audit trail.",
        icon: FileText,
      },
      {
        titleBn: "ওপেন রোডম্যাপ",
        titleEn: "Open Roadmap",
        descBn: "এপিক স্ট্যাটাস, বাজেট ও রিসোর্স ট্রান্সপারেন্সি।",
        descEn: "Epic status, budget, and resource transparency.",
        icon: Target,
      },
    ],
  },
  {
    id: "onboarding",
    labelBn: "অনবোর্ডিং UX",
    labelEn: "Onboarding UX",
    items: [
      {
        titleBn: "কমিটমেন্ট গ্র্যাডিয়েন্ট",
        titleEn: "Commitment Gradient",
        descBn: "৭-দিন স্প্রিন্ট → ৩০-দিন কন্ট্রিবিউটর → কো-ফাউন্ডার।",
        descEn: "7-day sprint → 30-day contributor → co-founder.",
        icon: Rocket,
      },
      {
        titleBn: "প্রগ্রেসিভ ডিসক্লোজার",
        titleEn: "Progressive Disclosure",
        descBn: "প্রথমেই কম তথ্য, ধাপে ধাপে সিদ্ধান্তের কনফিডেন্স।",
        descEn: "Reveal complexity in steps to build confidence.",
        icon: ChevronRight,
      },
      {
        titleBn: "সোশ্যাল প্রুফ",
        titleEn: "Social Proof",
        descBn: "সর্বশেষ শিপড ফিচার, রেভিনিউ এবং কমিউনিটি উইন।",
        descEn: "Latest shipped features, revenue, and community wins.",
        icon: Users,
      },
      {
        titleBn: "ট্রাস্ট অ্যাঙ্কর",
        titleEn: "Trust Anchors",
        descBn: "গভর্ন্যান্স নীতি ও প্রফিট-শেয়ার নীতি স্পষ্ট।",
        descEn: "Clear governance and profit-share rules.",
        icon: ShieldCheck,
      },
    ],
  },
  {
    id: "polish",
    labelBn: "UI পলিশ",
    labelEn: "UI Polish",
    items: [
      {
        titleBn: "গ্লাসমরফিজম",
        titleEn: "Glassmorphism",
        descBn: "গ্লাস কার্ড, ব্লার ও সফট শ্যাডো দিয়ে প্রিমিয়াম লুক।",
        descEn: "Glass cards with blur and soft shadows.",
        icon: PenTool,
      },
      {
        titleBn: "নিও-ব্রুটাল",
        titleEn: "Neo-Brutal",
        descBn: "হেভি বর্ডার, অফসেট শ্যাডো ও বোল্ড CTA।",
        descEn: "Heavy borders, offset shadows, bold CTAs.",
        icon: MonitorSmartphone,
      },
      {
        titleBn: "এন্টারপ্রাইজ ক্লিন",
        titleEn: "Enterprise Clean",
        descBn: "মিউটেড প্যালেট, স্ট্রাকচার্ড স্পেসিং, দ্রুত স্ক্যানিং।",
        descEn: "Muted palette, structured spacing, fast scanning.",
        icon: Layers,
      },
      {
        titleBn: "মোশন সিস্টেম",
        titleEn: "Motion System",
        descBn: "স্ট্যাগারড রিভিল, হোভার মাইক্রো-ইন্টারঅ্যাকশন।",
        descEn: "Staggered reveals and hover micro-interactions.",
        icon: Sparkles,
      },
    ],
  },
];

