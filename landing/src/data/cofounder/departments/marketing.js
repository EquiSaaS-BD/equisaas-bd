import { Megaphone } from "lucide-react";

export const marketingDepartment = {
  id: "marketing",
  icon: Megaphone,
  color: "purple",
  titleBn: "মার্কেটিং ও কাস্টমার সাকসেস",
  titleEn: "Marketing & Customer Success",
  descBn: "সেলস, ডিজিটাল মার্কেটিং, লাইফসাইকেল ও কাস্টমার সাকসেস।",
  descEn: "Sales, digital marketing, lifecycle, and customer success.",
  roles: [
    {
      id: "marketing-growth",
      titleBn: "গ্রোথ ও লাইফসাইকেল মার্কেটার",
      titleEn: "Growth & Lifecycle Marketer",
      roadmap: [
        {
          phaseBn: "মাস ১: ICP ও মেসেজিং",
          phaseEn: "Month 1: ICP & Messaging",
          itemsBn: ["ফানেল ম্যাপিং", "মেসেজিং গাইডলাইন", "UTM ও ট্র্যাকিং প্ল্যান"],
          itemsEn: ["Funnel mapping", "Messaging guidelines", "UTM and tracking plan"],
        },
        {
          phaseBn: "মাস ২: SEO ও কন্টেন্ট",
          phaseEn: "Month 2: SEO & Content",
          itemsBn: ["SEO বেসিকস", "কন্টেন্ট ক্যালেন্ডার", "ল্যান্ডিং পেজ কনভার্সন"],
          itemsEn: ["SEO fundamentals", "Content calendar", "Landing page conversion"],
        },
        {
          phaseBn: "মাস ৩: পেইড অ্যাকুইজিশন",
          phaseEn: "Month 3: Paid Acquisition",
          itemsBn: ["ক্রিয়েটিভ টেস্টিং", "লিড জেনারেশন", "কস্ট-টু-রেভিনিউ মডেল"],
          itemsEn: ["Creative testing", "Lead generation", "Cost-to-revenue modeling"],
        },
        {
          phaseBn: "মাস ৪: অ্যানালিটিক্স",
          phaseEn: "Month 4: Analytics",
          itemsBn: ["GA4 সেটআপ", "কোহর্ট অ্যানালিসিস", "ড্যাশবোর্ডিং"],
          itemsEn: ["GA4 setup", "Cohort analysis", "Dashboarding"],
        },
        {
          phaseBn: "মাস ৫: অটোমেশন",
          phaseEn: "Month 5: Automation",
          itemsBn: ["CRM অটোমেশন", "লিড স্কোরিং", "ইমেইল ড্রিপ"],
          itemsEn: ["CRM automation", "Lead scoring", "Email drips"],
        },
        {
          phaseBn: "মাস ৬: কমিউনিটি গ্রোথ",
          phaseEn: "Month 6: Community Growth",
          itemsBn: ["রেফারেল লুপ", "পার্টনার চ্যানেল", "রিটেনশন প্লে"],
          itemsEn: ["Referral loops", "Partner channels", "Retention plays"],
        },
      ],
      resources: [
        { name: "HubSpot Academy (Free)", url: "https://academy.hubspot.com/", type: "platform" },
        { name: "Google Search Central (SEO)", url: "https://developers.google.com/search/docs", type: "docs" },
        { name: "Google Skillshop (GA4)", url: "https://skillshop.withgoogle.com/", type: "platform" },
        { name: "Meta Blueprint Training", url: "https://trainingworkshops.facebookblueprint.com/", type: "platform" },
        { name: "Google Analytics (Developer)", url: "https://developers.google.com/analytics", type: "docs" },
      ],
    },
    {
      id: "marketing-success",
      titleBn: "কাস্টমার সাকসেস ও সাপোর্ট অপস",
      titleEn: "Customer Success & Support Ops",
      roadmap: [
        {
          phaseBn: "মাস ১: অনবোর্ডিং",
          phaseEn: "Month 1: Onboarding",
          itemsBn: ["টাইম-টু-ভ্যালু মেট্রিকস", "অনবোর্ডিং প্লেবুক", "গ্রাহক সেগমেন্টেশন"],
          itemsEn: ["Time-to-value metrics", "Onboarding playbooks", "Customer segmentation"],
        },
        {
          phaseBn: "মাস ২: সাপোর্ট অপারেশন",
          phaseEn: "Month 2: Support Operations",
          itemsBn: ["সাপোর্ট ট্যাক্সোনমি", "নলেজ বেস স্ট্রাকচার", "SLA ডিজাইন"],
          itemsEn: ["Support taxonomy", "Knowledge base structure", "SLA design"],
        },
        {
          phaseBn: "মাস ৩: ভয়েস অফ কাস্টমার",
          phaseEn: "Month 3: Voice of Customer",
          itemsBn: ["ফিডব্যাক ট্যাগিং", "প্রোডাক্ট লুপ", "ইনসাইট রিপোর্টিং"],
          itemsEn: ["Feedback tagging", "Product feedback loops", "Insight reporting"],
        },
        {
          phaseBn: "মাস ৪: রিটেনশন",
          phaseEn: "Month 4: Retention",
          itemsBn: ["চর্ণ কমানো স্ট্র্যাটেজি", "রিনিউয়াল প্লেবুক", "এসকেলেশন ফ্লো"],
          itemsEn: ["Churn reduction strategies", "Renewal playbooks", "Escalation flows"],
        },
        {
          phaseBn: "মাস ৫: কমিউনিটি সাকসেস",
          phaseEn: "Month 5: Community Success",
          itemsBn: ["মেন্টরশিপ প্রোগ্রাম", "ইভেন্ট ও ফোরাম", "পিয়ার-টু-পিয়ার সাপোর্ট"],
          itemsEn: ["Mentorship programs", "Events and forums", "Peer-to-peer support"],
        },
        {
          phaseBn: "মাস ৬: কেপিআই ও রিপোর্টিং",
          phaseEn: "Month 6: KPI & Reporting",
          itemsBn: ["NPS/CSAT ট্র্যাকিং", "কোহর্ট রিটেনশন", "QBR রিপোর্টিং"],
          itemsEn: ["NPS/CSAT tracking", "Cohort retention", "QBR reporting"],
        },
      ],
      resources: [
        { name: "HubSpot Academy (Free)", url: "https://academy.hubspot.com/", type: "platform" },
        { name: "Zendesk CX Library", url: "https://www.zendesk.com/blog/", type: "platform" },
        { name: "Intercom Academy (Free)", url: "https://academy.intercom.com/", type: "platform" },
      ],
    },
  ],
};

