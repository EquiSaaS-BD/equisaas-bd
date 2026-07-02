import { Briefcase } from "lucide-react";

export const businessDepartment = {
  id: "product",
  icon: Briefcase,
  color: "amber",
  titleBn: "প্রোডাক্ট ও বিজনেস অ্যানালাইসিস",
  titleEn: "Product & Business Analysis",
  descBn: "মার্কেট রিসার্চ, রিকোয়ারমেন্টস, প্রোডাক্ট স্ট্র্যাটেজি ও ডেলিভারি।",
  descEn: "Market research, requirements, product strategy, and delivery.",
  roles: [
    {
      id: "product-pm",
      titleBn: "প্রোডাক্ট ম্যানেজার",
      titleEn: "Product Manager",
      roadmap: [
        {
          phaseBn: "মাস ১: ভিশন ও ডিসকভারি",
          phaseEn: "Month 1: Vision & Discovery",
          itemsBn: ["মার্কেট গ্যাপ বিশ্লেষণ", "সমস্যা ফ্রেমিং", "ভ্যালু প্রপ ডিফাইন"],
          itemsEn: ["Market gap analysis", "Problem framing", "Value prop definition"],
        },
        {
          phaseBn: "মাস ২: রোডম্যাপ ও OKR",
          phaseEn: "Month 2: Roadmap & OKR",
          itemsBn: ["প্রায়োরিটাইজেশন ফ্রেমওয়ার্ক", "OKR সেটআপ", "ডিপেন্ডেন্সি ম্যাপিং"],
          itemsEn: ["Prioritization frameworks", "OKR setup", "Dependency mapping"],
        },
        {
          phaseBn: "মাস ৩: এক্সপেরিমেন্ট ও মেট্রিকস",
          phaseEn: "Month 3: Experiments & Metrics",
          itemsBn: ["হাইপোথিসিস ব্যাকলগ", "ফানেল মেট্রিকস", "ইনস্ট্রুমেন্টেশন প্ল্যান"],
          itemsEn: ["Hypothesis backlog", "Funnel metrics", "Instrumentation plan"],
        },
        {
          phaseBn: "মাস ৪: প্রাইসিং ও প্যাকেজিং",
          phaseEn: "Month 4: Pricing & Packaging",
          itemsBn: ["SaaS প্যাকেজিং", "রিটেনশন লুপ", "মনিটাইজেশন স্ট্র্যাটেজি"],
          itemsEn: ["SaaS packaging", "Retention loops", "Monetization strategy"],
        },
        {
          phaseBn: "মাস ৫: লঞ্চ এক্সিকিউশন",
          phaseEn: "Month 5: Launch Execution",
          itemsBn: ["লঞ্চ চেকলিস্ট", "স্টেকহোল্ডার এলাইনমেন্ট", "রিস্ক রেজিস্টার"],
          itemsEn: ["Launch checklist", "Stakeholder alignment", "Risk registers"],
        },
        {
          phaseBn: "মাস ৬: গভর্ন্যান্স",
          phaseEn: "Month 6: Governance",
          itemsBn: ["প্রোডাক্ট কাউন্সিল", "ট্রান্সপারেন্সি রিচুয়াল", "প্রফিট-শেয়ার ন্যারেটিভ"],
          itemsEn: ["Product councils", "Transparency rituals", "Profit-share narrative"],
        },
      ],
      resources: [
        { name: "Agile Manifesto (Free)", url: "https://agilemanifesto.org/", type: "docs" },
        { name: "Scrum Guide (Free)", url: "https://www.scrum.org/resources/scrum-guide", type: "docs" },
        { name: "Atlassian Agile Coach", url: "https://www.atlassian.com/agile", type: "platform" },
        {
          name: "IIBA BA Standard (Free PDF)",
          url: "https://www.iiba.org/globalassets/business-analysis-resources/the-business-analysis-standard/files/the-business-analysis-standard.pdf",
          type: "platform",
        },
        { name: "Startup School (Free)", url: "https://www.startupschool.org/", type: "platform" },
        { name: "Google Skillshop (Metrics)", url: "https://skillshop.withgoogle.com/", type: "platform" },
      ],
    },
    {
      id: "product-ba",
      titleBn: "বিজনেস অ্যানালিস্ট / এজাইল অ্যানালিস্ট",
      titleEn: "Business Analyst / Agile Analyst",
      roadmap: [
        {
          phaseBn: "মাস ১: এলিসিটেশন",
          phaseEn: "Month 1: Elicitation",
          itemsBn: ["স্টেকহোল্ডার ম্যাপিং", "প্রসেস ডায়াগ্রাম", "রিকোয়ারমেন্ট এলিসিটেশন"],
          itemsEn: ["Stakeholder mapping", "Process diagrams", "Requirements elicitation"],
        },
        {
          phaseBn: "মাস ২: রিকোয়ারমেন্ট মডেলিং",
          phaseEn: "Month 2: Requirements Modeling",
          itemsBn: ["ইউজার স্টোরি ও অ্যাকসেপ্টেন্স", "ডেটা ডিকশনারি", "ডেফিনিশন অফ ডান"],
          itemsEn: ["User stories and acceptance", "Data dictionaries", "Definition of done"],
        },
        {
          phaseBn: "মাস ৩: ট্রেসেবিলিটি",
          phaseEn: "Month 3: Traceability",
          itemsBn: ["ট্রেসেবিলিটি ম্যাট্রিক্স", "চেঞ্জ ইমপ্যাক্ট", "রিস্ক বিশ্লেষণ"],
          itemsEn: ["Traceability matrix", "Change impact analysis", "Risk analysis"],
        },
        {
          phaseBn: "মাস ৪: এজাইল ডেলিভারি",
          phaseEn: "Month 4: Agile Delivery",
          itemsBn: ["ব্যাকলগ রিফাইনমেন্ট", "স্টোরি স্লাইসিং", "এস্টিমেশন কনসিস্টেন্সি"],
          itemsEn: ["Backlog refinement", "Story slicing", "Estimation consistency"],
        },
        {
          phaseBn: "মাস ৫: QA ও UAT",
          phaseEn: "Month 5: QA & UAT",
          itemsBn: ["UAT প্ল্যানিং", "টেস্ট সিনারিও", "ডিফেক্ট ট্রায়েজ"],
          itemsEn: ["UAT planning", "Test scenarios", "Defect triage"],
        },
        {
          phaseBn: "মাস ৬: কন্টিনিউয়াস ইমপ্রুভমেন্ট",
          phaseEn: "Month 6: Continuous Improvement",
          itemsBn: ["ড্যাশবোর্ড ও রিপোর্টিং", "রেট্রো ইনসাইট", "প্রসেস অপটিমাইজেশন"],
          itemsEn: ["Dashboards and reporting", "Retro insights", "Process optimization"],
        },
      ],
      resources: [
        {
          name: "IIBA BA Standard (Free PDF)",
          url: "https://www.iiba.org/globalassets/business-analysis-resources/the-business-analysis-standard/files/the-business-analysis-standard.pdf",
          type: "platform",
        },
        { name: "Scrum Guide (Free)", url: "https://www.scrum.org/resources/scrum-guide", type: "docs" },
        { name: "Atlassian Agile Coach", url: "https://www.atlassian.com/agile", type: "platform" },
        { name: "Agile Manifesto (Free)", url: "https://agilemanifesto.org/", type: "docs" },
      ],
    },
  ],
};

