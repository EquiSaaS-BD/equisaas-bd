import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'landing', 'src', 'data', 'chatbot-knowledge.js');
let content = fs.readFileSync(dbPath, 'utf8');

const leadersEn = [
  {
    id: "ceo",
    keywords: ["ceo", "md", "managing director", "chairman", "founder", "kholipha", "ahmmad", "al amin", "al-amin"],
    responses: [
      "Kholipha Ahmmad Al-Amin is our visionary Founder, Managing Director, Chairman, and CEO! He leads the strategic direction of EquiSaaS BD, driving the mission of 'Together We Build, Together We Own'. You can reach him at ceo@equisaas-bd.com."
    ]
  },
  {
    id: "director_nayeem",
    keywords: ["director nayeem", "jannatul nayeem", "nayeem", "tech director", "product director"],
    responses: [
      "Jannatul Nayeem is our Director of Tech & Product, and a core member of the Board of Directors. He ensures our products meet world-class technical standards."
    ]
  },
  {
    id: "director_barno",
    keywords: ["director barno", "sandipta karmakar", "barno", "hr director", "operations director"],
    responses: [
      "Sandipta Karmakar Barno serves as the Director of HR & Operations on the Board of Directors. He oversees the smooth functioning of our cooperative and community onboarding."
    ]
  },
  {
    id: "director_hurayra",
    keywords: ["director hurayra", "abu hurayra", "hurayra", "finance director"],
    responses: [
      "Abu Hurayra is our Director of Finance and a Board Member. He manages the financial sustainability and profit-sharing models of EquiSaaS BD."
    ]
  },
  {
    id: "director_rifat",
    keywords: ["director rifat", "md rifat khan", "rifat khan", "community director"],
    responses: [
      "Md Rifat Khan is our Director of Community on the Board of Directors. He is the heart of our community engagement and builder ecosystem."
    ]
  },
  {
    id: "coo",
    keywords: ["coo", "chief operating officer", "sin-amin", "sin amin", "md. sin-amin", "sinamin"],
    responses: [
      "Md. Sin-Amin is our Chief Operating Officer (COO). He oversees day-to-day operations, ensuring all departments run smoothly and efficiently."
    ]
  },
  {
    id: "cto",
    keywords: ["cto", "chief technology officer", "ifat", "rafin", "ifat ahmed rafin", "ahmed rafin"],
    responses: [
      "Ifat Ahmed Rafin is our Chief Technology Officer (CTO). He leads the engineering squads, architecture, and overall technical vision of our SaaS products."
    ]
  },
  {
    id: "cpo",
    keywords: ["cpo", "chief product officer", "mehedi hasan", "mehedi"],
    responses: [
      "Mehedi Hasan is our Chief Product Officer (CPO). He bridges the gap between user needs and technical implementation, driving product strategy."
    ]
  },
  {
    id: "cfo",
    keywords: ["cfo", "chief financial officer", "nazmul", "shuvo", "nazmul hossain shuvo"],
    responses: [
      "Nazmul Hossain Shuvo is our Chief Financial Officer (CFO). He handles financial planning, accounting, and our cooperative equity distributions."
    ]
  },
  {
    id: "cmo",
    keywords: ["cmo", "chief marketing officer", "sanzida", "kajal", "sanzida rahman kajal"],
    responses: [
      "Sanzida Rahman Kajal is our Chief Marketing Officer (CMO). She develops marketing strategies to position our B2B products in the global and local market."
    ]
  },
  {
    id: "cgo",
    keywords: ["cgo", "chief growth officer", "abu bakar", "siddique", "bakar siddique"],
    responses: [
      "Abu Bakar Siddique is our Chief Growth Officer (CGO). He focuses on scaling our user base, acquiring clients, and expanding our ecosystem footprint."
    ]
  },
  {
    id: "cco",
    keywords: ["cco", "chief creative officer", "fatema", "akter", "fatema akter"],
    responses: [
      "Fatema Akter is our Chief Creative Officer (CCO). She oversees all creative direction, branding, and ensures a cohesive visual identity for EquiSaaS."
    ]
  },
  {
    id: "head_polok",
    keywords: ["polok", "m j polok", "frontend head", "head of frontend"],
    responses: [
      "M J Polok is the Head of Frontend Engineering. He leads the squad responsible for building our beautiful, responsive, and solid user interfaces."
    ]
  },
  {
    id: "head_ohidur",
    keywords: ["ohidur", "md. ohidur rahman", "ohidur rahman", "backend head", "head of backend"],
    responses: [
      "Md. Ohidur Rahman is the Head of Backend Engineering. He architects our scalable server-side systems, databases, and APIs."
    ]
  },
  {
    id: "head_parvez",
    keywords: ["parvez", "md. parvez mahmud", "parvez mahmud", "devops head", "qa head", "head of devops"],
    responses: [
      "Md. Parvez Mahmud is the Head of DevOps & QA. He ensures our deployments are smooth, infrastructure is secure, and software is bug-free."
    ]
  },
  {
    id: "head_masuma",
    keywords: ["masuma", "jannatul fardaus masuma", "ui head", "ux head", "figma head", "head of ui/ux"],
    responses: [
      "Jannatul Fardaus Masuma is the Head of UI/UX (Figma). She crafts the intuitive user experiences and premium designs of our products."
    ]
  },
  {
    id: "head_abid",
    keywords: ["abid", "tanbirul haq abid", "graphic head", "head of graphic design"],
    responses: [
      "Tanbirul Haq Abid is the Head of Graphic Design. He creates stunning visual assets, marketing materials, and branding elements."
    ]
  },
  {
    id: "head_sadiqul",
    keywords: ["sadiqul", "a. k. m. sadiqul islam", "product management head", "head of product management"],
    responses: [
      "A. K. M. SADIQUL ISLAM is the Head of Product Management. He coordinates feature releases, user feedback, and product roadmaps."
    ]
  },
  {
    id: "head_mushfiqur",
    keywords: ["mushfiqur", "md. mushfiqur rahman", "mushfiqur rahman", "business analysis head"],
    responses: [
      "Md. Mushfiqur Rahman is the Head of Business Analysis. He translates business needs into actionable data and product requirements."
    ]
  },
  {
    id: "head_sajid",
    keywords: ["sajid", "omar faruq sajid", "marketing head", "digital marketing head"],
    responses: [
      "Omar Faruq Sajid is the Head of Digital Marketing. He drives our online presence, SEO, and digital campaigns."
    ]
  },
  {
    id: "head_shihab",
    keywords: ["shihab", "md mehedi hasan shihab", "mehedi hasan shihab", "crm head", "customer success head"],
    responses: [
      "MD Mehedi Hasan Shihab is the Head of CRM & Customer Success. He ensures our clients and members get the best support and satisfaction."
    ]
  },
  {
    id: "head_jawad",
    keywords: ["jawad", "jawad hossain", "pr head", "communications head"],
    responses: [
      "Jawad Hossain is the Head of Communications & PR. He manages public relations, internal communications, and our cooperative's voice."
    ]
  },
  {
    id: "head_khadiza",
    keywords: ["khadiza", "khadiza tul khushbu", "khushbu", "business development manager", "bd manager", "bd head", "business development head"],
    responses: [
      "Khadiza Tul Khushbu is the Business Development Manager and Department Lead. She spearheads SME integration, growth strategy, and corporate partnerships across Bangladesh."
    ]
  }
];

const leadersBn = [
  {
    id: "ceo",
    keywords: ["ceo", "md", "managing director", "chairman", "founder", "kholipha", "ahmmad", "al amin", "al-amin", "সিইও", "ফাউন্ডার", "খলিফা", "আল-আমিন"],
    responses: [
      "খলিফা আহম্মেদ আল-আমিন হলেন আমাদের স্বপ্নদ্রষ্টা ফাউন্ডার, ম্যানেজিং ডিরেক্টর, চেয়ারম্যান এবং সিইও! তিনি 'একসাথে গড়ি, একসাথে মালিকানা' ভিশন নিয়ে ইকুই স্যাস বিডি-র নেতৃত্ব দিচ্ছেন। তার সাথে ceo@equisaas-bd.com এ যোগাযোগ করতে পারেন।"
    ]
  },
  {
    id: "director_nayeem",
    keywords: ["director nayeem", "jannatul nayeem", "nayeem", "tech director", "নাঈম", "জান্নাতুল নাঈম"],
    responses: [
      "জান্নাতুল নাঈম আমাদের ডিরেক্টর (টেক এবং প্রোডাক্ট) এবং বোর্ড অফ ডিরেক্টরস-এর একজন কোর মেম্বার। আমাদের প্রোডাক্টগুলো যেন প্রযুক্তিগতভাবে বিশ্বমানের হয়, তা তিনি নিশ্চিত করেন।"
    ]
  },
  {
    id: "director_barno",
    keywords: ["director barno", "sandipta karmakar", "barno", "hr director", "বর্ন", "সন্দীপ্ত"],
    responses: [
      "সন্দীপ্ত কর্মকার বর্ন বোর্ড অফ ডিরেক্টরস-এর ডিরেক্টর (এইচআর এবং অপারেশনস) হিসেবে দায়িত্ব পালন করছেন। তিনি আমাদের কমিউনিটি এবং অপারেশনাল কাজগুলো পরিচালনা করেন।"
    ]
  },
  {
    id: "director_hurayra",
    keywords: ["director hurayra", "abu hurayra", "hurayra", "finance director", "হুরায়রা"],
    responses: [
      "আবু হুরায়রা আমাদের ফিন্যান্স ডিরেক্টর এবং বোর্ড মেম্বার। তিনি ইকুই স্যাস বিডি-র আর্থিক দিক এবং প্রফিট-শেয়ারিং মডেল পরিচালনা করেন।"
    ]
  },
  {
    id: "director_rifat",
    keywords: ["director rifat", "md rifat khan", "rifat khan", "community director", "রিফাত"],
    responses: [
      "মোঃ রিফাত খান বোর্ড অফ ডিরেক্টরস-এ আমাদের কমিউনিটি ডিরেক্টর হিসেবে আছেন। তিনি আমাদের মেম্বার ও কমিউনিটির সাথে যোগাযোগ রক্ষার প্রধান দায়িত্ব পালন করেন।"
    ]
  },
  {
    id: "coo",
    keywords: ["coo", "chief operating officer", "sin-amin", "sin amin", "md. sin-amin", "সিন-আমিন", "সিন আমিন"],
    responses: [
      "মোঃ সিন-আমিন হলেন আমাদের চিফ অপারেটিং অফিসার (COO)। তিনি প্রতিদিনের অপারেশনস এবং সকল ডিপার্টমেন্টের কাজের তত্ত্বাবধান করেন।"
    ]
  },
  {
    id: "cto",
    keywords: ["cto", "chief technology officer", "ifat", "rafin", "ifat ahmed rafin", "রাফিন", "ইফাত"],
    responses: [
      "ইফাত আহমেদ রাফিন আমাদের চিফ টেকনোলজি অফিসার (CTO)। তিনি ইঞ্জিনিয়ারিং টিম, আর্কিটেকচার এবং আমাদের টেকনোলজিক্যাল ভিশনের নেতৃত্ব দিচ্ছেন।"
    ]
  },
  {
    id: "cpo",
    keywords: ["cpo", "chief product officer", "mehedi hasan", "mehedi", "মেহেদী হাসান"],
    responses: [
      "মেহেদী হাসান হলেন আমাদের চিফ প্রোডাক্ট অফিসার (CPO)। তিনি ইউজারদের চাহিদা বুঝে প্রোডাক্ট স্ট্র্যাটেজি তৈরি এবং ইমপ্লিমেন্ট করার দায়িত্ব পালন করেন।"
    ]
  },
  {
    id: "cfo",
    keywords: ["cfo", "chief financial officer", "nazmul", "shuvo", "শুভ", "নাজমুল"],
    responses: [
      "নাজমুল হোসেন শুভ আমাদের চিফ ফিন্যান্সিয়াল অফিসার (CFO)। তিনি আমাদের ফিন্যান্সিয়াল প্ল্যানিং, অ্যাকাউন্টিং এবং ইকুইটি ডিস্ট্রিবিউশনের কাজ করেন।"
    ]
  },
  {
    id: "cmo",
    keywords: ["cmo", "chief marketing officer", "sanzida", "kajal", "কাজল", "সানজিদা"],
    responses: [
      "সানজিদা রহমান কাজল হলেন আমাদের চিফ মার্কেটিং অফিসার (CMO)। তিনি আমাদের B2B প্রোডাক্টগুলোর লোকাল এবং গ্লোবাল মার্কেটিং স্ট্র্যাটেজি তৈরি করেন।"
    ]
  },
  {
    id: "cgo",
    keywords: ["cgo", "chief growth officer", "abu bakar", "siddique", "বকর", "সিদ্দিক"],
    responses: [
      "আবু বকর সিদ্দিক আমাদের চিফ গ্রোথ অফিসার (CGO)। ক্লায়েন্ট বৃদ্ধি, ইউজার অ্যাকুইজিশন এবং ইকোসিস্টেম সম্প্রসারণ তার প্রধান লক্ষ্য।"
    ]
  },
  {
    id: "cco",
    keywords: ["cco", "chief creative officer", "fatema", "akter", "ফাতেমা", "আক্তার"],
    responses: [
      "ফাতেমা আক্তার হলেন আমাদের চিফ ক্রিয়েটিভ অফিসার (CCO)। তিনি ইকুই স্যাস-এর সমস্ত ভিজ্যুয়াল আইডেন্টিটি এবং ক্রিয়েটিভ ডিরেকশন নিয়ন্ত্রণ করেন।"
    ]
  },
  {
    id: "head_polok",
    keywords: ["polok", "m j polok", "frontend head", "পলক"],
    responses: [
      "এম জে পলক আমাদের ফ্রন্টএন্ড ইঞ্জিনিয়ারিংয়ের হেড। তিনি এবং তার স্কোয়াড আমাদের অত্যন্ত চমৎকার এবং রেসপন্সিভ ইউজার ইন্টারফেসগুলো তৈরি করে।"
    ]
  },
  {
    id: "head_ohidur",
    keywords: ["ohidur", "md. ohidur rahman", "backend head", "ওহিদুর"],
    responses: [
      "মোঃ ওহিদুর রহমান ব্যাকএন্ড ইঞ্জিনিয়ারিংয়ের হেড। তিনি আমাদের স্কেলেবল সার্ভার, ডাটাবেস এবং API গুলো আর্কিটেক্ট করেন।"
    ]
  },
  {
    id: "head_parvez",
    keywords: ["parvez", "md. parvez mahmud", "devops head", "পারভেজ"],
    responses: [
      "মোঃ পারভেজ মাহমুদ ডেভঅপস এবং কিউএ (QA) এর হেড। তিনি নিশ্চিত করেন যেন আমাদের ইনফ্রাস্ট্রাকচার সিকিউর থাকে এবং সফটওয়্যারটি বাগ-ফ্রি হয়।"
    ]
  },
  {
    id: "head_masuma",
    keywords: ["masuma", "jannatul fardaus masuma", "ui head", "মাসুমা"],
    responses: [
      "জান্নাতুল ফেরদৌস মাসুমা UI/UX (Figma)-এর হেড। তিনি আমাদের প্রোডাক্টগুলোর ইউজার এক্সপেরিয়েন্স এবং প্রিমিয়াম ডিজাইন তৈরি করেন।"
    ]
  },
  {
    id: "head_abid",
    keywords: ["abid", "tanbirul haq abid", "graphic head", "আবিদ", "তানবিরুল"],
    responses: [
      "তানবিরুল হক আবিদ আমাদের গ্রাফিক ডিজাইনের হেড। তিনি অসাধারণ সব ভিজ্যুয়াল অ্যাসেট এবং মার্কেটিং ম্যাটেরিয়াল তৈরি করেন।"
    ]
  },
  {
    id: "head_sadiqul",
    keywords: ["sadiqul", "a. k. m. sadiqul islam", "product management head", "সাদিকুল"],
    responses: [
      "এ. কে. এম. সাদিকুল ইসলাম প্রোডাক্ট ম্যানেজমেন্টের হেড। ফিচার রিলিজ, ইউজার ফিডব্যাক এবং প্রোডাক্ট রোডম্যাপ পরিচালনা করা তার দায়িত্ব।"
    ]
  },
  {
    id: "head_mushfiqur",
    keywords: ["mushfiqur", "md. mushfiqur rahman", "business analysis head", "মুশফিকুর"],
    responses: [
      "মোঃ মুশফিকুর রহমান বিজনেস অ্যানালাইসিসের হেড। তিনি বিজনেসের রিকোয়ারমেন্টগুলো বুঝে সেগুলোকে ডাটা এবং প্রোডাক্ট ফিচারে রূপান্তরিত করেন।"
    ]
  },
  {
    id: "head_sajid",
    keywords: ["sajid", "omar faruq sajid", "marketing head", "সাজিদ", "ওমর ফারুক"],
    responses: [
      "ওমর ফারুক সাজিদ আমাদের ডিজিটাল মার্কেটিংয়ের হেড। এসইও (SEO), অনলাইন প্রেজেন্স এবং ডিজিটাল ক্যাম্পেইন পরিচালনা করা তার দায়িত্ব।"
    ]
  },
  {
    id: "head_shihab",
    keywords: ["shihab", "md mehedi hasan shihab", "crm head", "শিহাব", "মেহেদী হাসান শিহাব"],
    responses: [
      "মোঃ মেহেদী হাসান শিহাব সিআরএম (CRM) এবং কাস্টমার সাকসেসের হেড। ক্লায়েন্ট এবং মেম্বাররা যেন সেরা সাপোর্ট পান, তা তিনি নিশ্চিত করেন।"
    ]
  },
  {
    id: "head_jawad",
    keywords: ["jawad", "jawad hossain", "pr head", "জাওয়াদ", "জাওয়াদ হোসেন"],
    responses: [
      "জাওয়াদ হোসেন কমিউনিকেশন এবং পিআর (PR) এর হেড। তিনি আমাদের কো-অপারেটিভের পাবলিক রিলেশন এবং ইন্টার্নাল কমিউনিকেশন পরিচালনা করেন।"
    ]
  },
  {
    id: "head_khadiza",
    keywords: ["khadiza", "khadiza tul khushbu", "khushbu", "business development manager", "bd manager", "bd head", "business development head", "খাদিজা", "খুশবু", "খাদিজা তুল খুশবু"],
    responses: [
      "খাদিজা তুল খুশবু হলেন বিজনেস ডেভেলপমেন্ট ম্যানেজার এবং ডিপার্টমেন্ট লিড। তিনি সারা বাংলাদেশে SME ইন্টিগ্রেশন, গ্রোথ স্ট্র্যাটেজি এবং কর্পোরেট পার্টনারশিপের নেতৃত্ব দিচ্ছেন।"
    ]
  }
];

if (!content.includes('head_jawad')) {
  // Safe injection
  const enMatch = content.match(/en: \[\s*\{[\s\S]*?(?=\s*],\s*bn: \[)/);
  if (enMatch) {
    const enInjectionPos = enMatch.index + enMatch[0].length;
    const enStr = ',\n' + leadersEn.map(l => '    ' + JSON.stringify(l, null, 2).replace(/\n/g, '\n    ')).join(',\n');
    content = content.slice(0, enInjectionPos) + enStr + content.slice(enInjectionPos);
  }

  const bnMatch = content.match(/bn: \[\s*\{[\s\S]*?(?=\s*\]\s*\};)/);
  if (bnMatch) {
    const bnInjectionPos = bnMatch.index + bnMatch[0].length;
    const bnStr = ',\n' + leadersBn.map(l => '    ' + JSON.stringify(l, null, 2).replace(/\n/g, '\n    ')).join(',\n');
    content = content.slice(0, bnInjectionPos) + bnStr + content.slice(bnInjectionPos);
  }

  fs.writeFileSync(dbPath, content, 'utf8');
  console.log("Successfully appended 22 leaders via Regex");
} else {
  console.log("Already appended");
}
