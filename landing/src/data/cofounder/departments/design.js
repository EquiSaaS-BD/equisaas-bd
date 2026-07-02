import { PenTool } from "lucide-react";

export const designDepartment = {
  id: "design",
  icon: PenTool,
  color: "emerald",
  titleBn: "ইউআই/ইউএক্স ও ডিজাইন",
  titleEn: "UI/UX & Design",
  descBn: "ইউজার এক্সপেরিয়েন্স, ইন্টারফেস এবং ব্র্যান্ড আইডেন্টিটি ডিজাইন।",
  descEn: "User experience, interface design, and brand identity.",
  roles: [
    {
      id: "design-ux",
      titleBn: "UI/UX ডিজাইনার (Figma)",
      titleEn: "UI/UX Designer (Figma)",
      roadmap: [
        {
          phaseBn: "মাস ১: রিসার্চ ও ফ্লো",
          phaseEn: "Month 1: Research & Flows",
          itemsBn: ["পারসোনা ও JTBD", "ইনফরমেশন আর্কিটেকচার", "ইউজার ফ্লো ম্যাপিং"],
          itemsEn: ["Personas and JTBD", "Information architecture", "User flow mapping"],
        },
        {
          phaseBn: "মাস ২: Figma মাস্টারি",
          phaseEn: "Month 2: Figma Mastery",
          itemsBn: ["অটো-লেআউট ও কম্পোনেন্ট", "ভ্যারিয়েন্ট ও রেসপনসিভ গ্রিড", "ডিজাইন টোকেন বেসিক"],
          itemsEn: ["Auto layout and components", "Variants and responsive grids", "Design token basics"],
        },
        {
          phaseBn: "মাস ৩: প্রোটোটাইপ ও মাইক্রো-ইন্টারঅ্যাকশন",
          phaseEn: "Month 3: Prototyping & Micro-Interactions",
          itemsBn: ["ইন্টারঅ্যাক্টিভ প্রোটোটাইপ", "Smart Animate", "মোশন স্পেক ও টাইমিং"],
          itemsEn: ["Interactive prototypes", "Smart Animate", "Motion spec and timing"],
        },
        {
          phaseBn: "মাস ৪: ডিজাইন সিস্টেম",
          phaseEn: "Month 4: Design System",
          itemsBn: ["কম্পোনেন্ট লাইব্রেরি", "অ্যাক্সেসিবিলিটি চেকলিস্ট", "টাইপ স্কেল ও টোকেন"],
          itemsEn: ["Component library", "Accessibility checklist", "Type scale and tokens"],
        },
        {
          phaseBn: "মাস ৫: ইউজার টেস্টিং",
          phaseEn: "Month 5: User Testing",
          itemsBn: ["ইউজেবিলিটি টেস্ট", "হিটম্যাপ/ফিডব্যাক লুপ", "ডেটা-ড্রিভেন ইটারেশন"],
          itemsEn: ["Usability tests", "Heatmaps/feedback loops", "Data-driven iteration"],
        },
        {
          phaseBn: "মাস ৬: হ্যান্ডঅফ ও QA",
          phaseEn: "Month 6: Handoff & QA",
          itemsBn: ["ডেভ হ্যান্ডঅফ রুলস", "রেডলাইন ও স্পেক", "ইউআই QA চেকলিস্ট"],
          itemsEn: ["Developer handoff rules", "Redlines and specs", "UI QA checklist"],
        },
      ],
      resources: [
        { name: "Figma Design Course (Free)", url: "https://help.figma.com/hc/en-us/articles/30848209492887", type: "docs" },
        { name: "Figma Auto Layout", url: "https://help.figma.com/hc/en-us/articles/360040451373", type: "docs" },
        { name: "Figma Prototyping", url: "https://help.figma.com/hc/en-us/articles/360040314193", type: "docs" },
        { name: "Figma Smart Animate", url: "https://help.figma.com/hc/en-us/articles/360039818874", type: "docs" },
        { name: "WCAG 2.2 (Accessibility)", url: "https://www.w3.org/TR/WCAG22/", type: "docs" },
        { name: "WAI-ARIA APG", url: "https://www.w3.org/WAI/ARIA/apg/", type: "docs" },
      ],
    },
    {
      id: "design-brand",
      titleBn: "গ্রাফিক ডিজাইনার (সোশ্যাল মিডিয়া ও ব্র্যান্ডিং)",
      titleEn: "Graphic Designer (Social Media & Branding)",
      roadmap: [
        {
          phaseBn: "মাস ১: ব্র্যান্ড বেসিকস",
          phaseEn: "Month 1: Brand Basics",
          itemsBn: ["কালার, টাইপোগ্রাফি, গ্রিড", "লোগো ও ব্র্যান্ড গাইড", "ব্র্যান্ড কিট সেটআপ"],
          itemsEn: ["Color, typography, grids", "Logos and brand guides", "Brand kit setup"],
        },
        {
          phaseBn: "মাস ২: টেমপ্লেট সিস্টেম",
          phaseEn: "Month 2: Template System",
          itemsBn: ["সোশ্যাল টেমপ্লেট কিট", "মাল্টি-ফরম্যাট এক্সপোর্ট", "CTA হায়ারার্কি"],
          itemsEn: ["Social template kits", "Multi-format exports", "CTA hierarchy"],
        },
        {
          phaseBn: "মাস ৩: মোশন ও শর্ট ভিডিও",
          phaseEn: "Month 3: Motion & Short Video",
          itemsBn: ["মাইক্রো অ্যানিমেশন", "স্টোরিবোর্ডিং", "ভিডিও অ্যাসেট পাইপলাইন"],
          itemsEn: ["Micro animations", "Storyboarding", "Video asset pipeline"],
        },
        {
          phaseBn: "মাস ৪: ক্রিয়েটিভ টেস্টিং",
          phaseEn: "Month 4: Creative Testing",
          itemsBn: ["A/B ভ্যারিয়েশন", "হুক/CTA টেস্টিং", "পারফরম্যান্স রিভিউ"],
          itemsEn: ["A/B variations", "Hook/CTA testing", "Performance review"],
        },
        {
          phaseBn: "মাস ৫: লোকালাইজেশন",
          phaseEn: "Month 5: Localization",
          itemsBn: ["বাংলা/ইংরেজি ভ্যারিয়েশন", "ইনক্লুসিভ ভিজ্যুয়াল", "কমিউনিটি অ্যাসেট লাইব্রেরি"],
          itemsEn: ["Bangla/English variations", "Inclusive visuals", "Community asset library"],
        },
        {
          phaseBn: "মাস ৬: প্রোডাকশন পাইপলাইন",
          phaseEn: "Month 6: Production Pipeline",
          itemsBn: ["ভার্সনিং ও নামকরণ", "এক্সপোর্ট স্ট্যান্ডার্ড", "ক্রস-টিম হ্যান্ডঅফ"],
          itemsEn: ["Versioning and naming", "Export standards", "Cross-team handoff"],
        },
      ],
      resources: [
        { name: "Canva Design School (Free)", url: "https://www.canva.com/designschool/", type: "platform" },
        { name: "Figma Community (Free Assets)", url: "https://www.figma.com/community", type: "platform" },
        { name: "Adobe Color (Palette)", url: "https://color.adobe.com/", type: "tool" },
        { name: "LottieFiles (Motion)", url: "https://lottiefiles.com/", type: "platform" },
        { name: "Unsplash (Free Photos)", url: "https://unsplash.com/", type: "platform" },
      ],
    },
  ],
};

