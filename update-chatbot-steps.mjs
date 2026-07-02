import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'landing', 'src', 'data', 'chatbot-knowledge.js');
let content = fs.readFileSync(dbPath, 'utf8');

const stepsEn = [
  {
    id: "process_step1",
    keywords: ["step 1", "step one", "first step", "registration", "google form", "apply form", "start apply"],
    responses: [
      "Step 1: Registration! To begin your journey, you need to fill out our official registration form: https://forms.gle/tk1ps3Uonr2zqPku7. This helps us understand your skills and interests."
    ]
  },
  {
    id: "process_step2",
    keywords: ["step 2", "step two", "second step", "facebook group", "community", "orientation", "what after form", "what next"],
    responses: [
      "Step 2: Join the Community! After submitting the registration form, you must join our Facebook Community Group: https://www.facebook.com/groups/1253385930100939/. This is where all announcements and orientations take place."
    ]
  },
  {
    id: "process_step3",
    keywords: ["step 3", "step three", "third step", "interview", "viva", "github test", "skill test", "assignment", "evaluation"],
    responses: [
      "Step 3: Skill Evaluation & Interview! Once you are in the community, the respective Department Head will evaluate your skills. For tech roles, this might involve a GitHub test or assignment. Then, an interview will be scheduled to see if you are a good fit."
    ]
  },
  {
    id: "process_step4",
    keywords: ["step 4", "step four", "fourth step", "squad", "trial", "probation", "main team", "select", "after interview"],
    responses: [
      "Step 4: Trial & Main Squad! If you pass the interview, you'll be placed on a 1-month trial period where you'll work on real tasks. Successfully completing the trial makes you an official member with equity/profit-sharing benefits!"
    ]
  },
  {
    id: "process_full",
    keywords: ["full process", "all steps", "how to apply completely", "application process", "total process", "full process", "application steps"],
    responses: [
      "Here is our complete joining process:\n1. Fill out the form (https://forms.gle/tk1ps3Uonr2zqPku7)\n2. Join our FB Group\n3. Pass the Skill Test & Interview\n4. Complete the 1-month Trial\nLet me know if you are stuck on any specific step!"
    ]
  }
];

const stepsBn = [
  {
    id: "process_step1",
    keywords: ["step 1", "প্রথম ধাপ", "step one", "first step", "রেজিস্ট্রেশন", "registration", "google form", "ফর্ম", "apply form"],
    responses: [
      "প্রথম ধাপ: রেজিস্ট্রেশন! আপনার যাত্রা শুরু করতে আমাদের অফিসিয়াল ফর্মটি পূরণ করতে হবে: https://forms.gle/tk1ps3Uonr2zqPku7 এর মাধ্যমে আমরা আপনার স্কিল এবং আগ্রহ সম্পর্কে জানতে পারব।"
    ]
  },
  {
    id: "process_step2",
    keywords: ["step 2", "দ্বিতীয় ধাপ", "step two", "second step", "ফেসবুক", "facebook group", "কমিউনিটি", "অরিয়েন্টেশন", "ফর্মের পর কি"],
    responses: [
      "দ্বিতীয় ধাপ: কমিউনিটিতে যুক্ত হওয়া! ফর্ম পূরণের পর আপনাকে আমাদের ফেসবুক কমিউনিটি গ্রুপে জয়েন করতে হবে: https://www.facebook.com/groups/1253385930100939/। এখানেই সব আপডেট এবং ওরিয়েন্টেশন হয়।"
    ]
  },
  {
    id: "process_step3",
    keywords: ["step 3", "তৃতীয় ধাপ", "step three", "third step", "ইন্টারভিউ", "interview", "viva", "ভাইভা", "গিটহাব", "github test", "অ্যাসাইনমেন্ট", "assignment"],
    responses: [
      "তৃতীয় ধাপ: স্কিল টেস্ট এবং ইন্টারভিউ! কমিউনিটিতে জয়েন করার পর, ডিপার্টমেন্ট হেড আপনার স্কিল যাচাই করবেন। টেকনিক্যাল রোলের জন্য গিটহাব টেস্ট বা অ্যাসাইনমেন্ট থাকতে পারে। এরপর একটি ইন্টারভিউ হবে।"
    ]
  },
  {
    id: "process_step4",
    keywords: ["step 4", "চতুর্থ ধাপ", "step four", "fourth step", "স্কোয়াড", "squad", "ট্রায়াল", "trial", "সিলেক্ট", "মেইন টিম"],
    responses: [
      "চতুর্থ ধাপ: ট্রায়াল এবং মেইন স্কোয়াড! ইন্টারভিউতে টিকলে আপনাকে ১ মাসের ট্রায়ালে রাখা হবে, যেখানে আপনি রিয়েল প্রজেক্টে কাজ করবেন। ট্রায়াল সফলভাবে শেষ করলেই আপনি প্রফিট-শেয়ারিং সুবিধাসহ আমাদের অফিশিয়াল মেম্বার হবেন!"
    ]
  },
  {
    id: "process_full",
    keywords: ["পুরো প্রসেস", "সব ধাপ", "full process", "all steps", "কিভাবে অ্যাপ্লাই করব", "application process", "total process", "এপ্লাই প্রসেস", "অ্যাপ্লিকেশন প্রসেস"],
    responses: [
      "আমাদের জয়েনিং প্রসেসটি নিচে দেওয়া হলো:\n১. ফর্ম পূরণ করা (https://forms.gle/tk1ps3Uonr2zqPku7)\n২. ফেসবুক গ্রুপে যুক্ত হওয়া\n৩. স্কিল টেস্ট ও ইন্টারভিউ দেওয়া\n৪. ১ মাসের ট্রায়াল পিরিয়ড শেষ করা\nকোনো নির্দিষ্ট ধাপে আটকে গেলে আমাকে জিজ্ঞেস করতে পারেন!"
    ]
  }
];

if (!content.includes('process_step1')) {
  // Safe injection
  const enMatch = content.match(/en: \[\s*\{[\s\S]*?(?=\s*],\s*bn: \[)/);
  if (enMatch) {
    const enInjectionPos = enMatch.index + enMatch[0].length;
    const enStr = ',\n' + stepsEn.map(l => '    ' + JSON.stringify(l, null, 2).replace(/\n/g, '\n    ')).join(',\n');
    content = content.slice(0, enInjectionPos) + enStr + content.slice(enInjectionPos);
  }

  const bnMatch = content.match(/bn: \[\s*\{[\s\S]*?(?=\s*\]\s*\};)/);
  if (bnMatch) {
    const bnInjectionPos = bnMatch.index + bnMatch[0].length;
    const bnStr = ',\n' + stepsBn.map(l => '    ' + JSON.stringify(l, null, 2).replace(/\n/g, '\n    ')).join(',\n');
    content = content.slice(0, bnInjectionPos) + bnStr + content.slice(bnInjectionPos);
  }

  fs.writeFileSync(dbPath, content, 'utf8');
  console.log("Successfully appended application steps.");
} else {
  console.log("Application steps already appended");
}
