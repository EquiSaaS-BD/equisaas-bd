import React from "react";
import { motion } from "framer-motion";
import { Award, Trophy, Users, Handshake, Target, Star, ExternalLink, Calendar, MapPin } from "lucide-react";
import Section from "./Section";
import { fadeUp, kineticReveal } from "./motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { normalizeLocalizedTree } from "@/lib/localized-copy";

const COPY = normalizeLocalizedTree({
  en: {
    badge: "Milestones & Alliances",
    title: "National Recognition & Strategic Partnerships",
    desc: "EquiSaaS BD is not just an idea. We are actively proving our technical depth on national innovation stages and scaling our operations through global corporate collaborations.",
    achievementsTitle: "National Engineering Achievements",
    achievementsDesc: "Our team's competitive validations across high-tier national platforms.",
    collabsTitle: "Strategic Corporate Alliances",
    collabsDesc: "Partnering with industry leaders and global advisors to scale our vision.",
    
    buildfest: {
      title: "The Infinity AI BuildFest 2026 Finals",
      subtitle: "National Finalist (E-Commerce Track)",
      desc: "Out of 3,360 individual participants and 612 teams across Bangladesh, our flagship project EquiPulse AI qualified as an official national finalist. The team will present live at BRAC University, Dhaka.",
      date: "Friday, June 12, 2026 (7:00 AM to 8:00 PM)",
      location: "BRAC University, Dhaka (Organized by Cloudcamp Bangladesh)",
      lineupLabel: "Official Finalist Lineup:",
      lineup: [
        "Sandipta Karmakar (Team Leader)",
        "Kholipha Ahmmad Al-Amin (Backend/Project Coordinator)",
        "Abu Hurayra (Frontend Developer)",
        "Mehedi Hasan (Presentation & Communication Lead)",
        "Sanzida Rahman Kajal (UI/UX Designer)",
        "MD Badsha Mia (Corporate Representative)"
      ]
    },
    vcp: {
      title: "Vibe Coding to Production (VCP) National Finals",
      subtitle: "Top 100 Finalist Nationwide",
      desc: "Our Director of HR & Operations, Sandipta Karmakar (Barno), mastered Phase 1 by formulating a creative 5-prompt strategy that successfully cleared strict automated LLM evaluations, securing a spot in the national finals."
    },
    usaii: {
      title: "USAII Global AI Hackathon 2026",
      subtitle: "Global Finalist",
      desc: "Our flagship project EquiPulse AI qualified as a Global Finalist. The full team: Abu Hurayra, Jannatul Nayeem, Kholipha Ahmmad Al-Amin, Sandipta Karmakar, and Sanzida Rahman."
    },
    quantum: {
      title: "Global Quantum Mechanics Challenge 2026",
      subtitle: "Qualification Round Winner",
      desc: "Our Managing Director & CEO, Kholipha Ahmmad Al-Amin, successfully completed the Qualification Round and is qualified for the Semi-Final Round 2026, reflecting profound scientific problem-solving skills."
    },
    zero: {
      title: "Zero Olympiad Grand Finals (Season 2)",
      subtitle: "National Champion (SDG Achiever) - SDG 15",
      desc: "Out of a national pool of 9,332 Round 1 contestants narrowed to 3,407 in Round 2, our Managing Director & CEO Kholipha Ahmmad Al-Amin emerged as the official SDG ACHIEVER (CHAMPION) at the Grand Finale on June 13, 2026, representing Atish Dipankar University of Science & Technology. The rigorous evaluation, supported by learning partners like TESOL Bangladesh, assessed content relevance, creativity, communication, technical quality, and overall environmental impact."
    },
    nhspc: {
      title: "National High School Programming Contest (NHSPC 2026)",
      subtitle: "Junior Quiz Contest Winner",
      desc: "Our core team member Hamim Zaman won the Junior Quiz Contest at the regional NHSPC held at Pabna University of Science and Technology, organized by the Bangladesh Computer Council under the ICT Division."
    },
    impactra: {
      title: "IMPACTRA Campus Ambassadorship",
      subtitle: "Government Science College Representative",
      desc: "Sandipta Karmakar was selected as the Campus Ambassador for IMPACTRA (Skills For Success), representing Government Science College, Dhaka, to bridge academic and professional growth."
    },

    roundtable: {
      title: "Global AI Policy Strategic Roundtable",
      subtitle: "Collaboration with UN & G20 Advisor MD Khorshed Alam",
      desc: "Hosted a strategic roundtable session with MD Khorshed Alam (UN Data, AI, and Policy Specialist and Multilateral AI Policy Advisor for the UN, G20, and Saudi Arabia) focusing on Responsible AI architectures and B2B SaaS Policy Frameworks."
    },
    glc: {
      title: "Global Communication & Language Partnership",
      subtitle: "Ghasful Learning Center (GLC)",
      desc: "Partnered with GLC to deploy a 1-Month Spoken English Mastery Batch tailored for our cooperative's engineers and managers, led by BRAC University English alumnus Mehedi Hasan."
    },
    computerSchool: {
      title: "Strategic Tech & Education Summit",
      subtitle: "Summit with Computer School Leadership",
      desc: "Deep-dive meeting with Computer School Founder & CEO Mahmud Hasan Masum and Head of Design Ashraf Bin Azhar on startup localization and human-centric UI/UX design standards using successful models like bKash and Fabrilife."
    }
  },
  bn: {
    badge: "আমাদের অর্জন ও পার্টনারশিপ",
    title: "জাতীয় স্বীকৃতি ও কৌশলগত পার্টনারশিপ",
    desc: "EquiSaaS BD শুধু একটি স্বপ্ন নয়। আমরা জাতীয় পর্যায়ের প্রতিযোগিতায় আমাদের টেকনিক্যাল দক্ষতা প্রমাণ করছি এবং বৈশ্বিক পার্টনারশিপের মাধ্যমে আমাদের কাজের পরিধি বৃদ্ধি করছি।",
    achievementsTitle: "জাতীয় প্রকৌশল অর্জনসমূহ",
    achievementsDesc: "বিভিন্ন জাতীয় প্ল্যাটফর্মে আমাদের টিম ও মেম্বারদের অর্জনসমূহ।",
    collabsTitle: "কৌশলগত কর্পোরেট কোলাবোরেশন",
    collabsDesc: "আমাদের ভিশনকে সফল করতে বিভিন্ন গ্লোবাল উপদেষ্টা ও প্রতিষ্ঠানের সাথে যৌথ উদ্যোগ।",

    buildfest: {
      title: "The Infinity AI BuildFest 2026 Finals",
      subtitle: "ন্যাশনাল ফাইনালিস্ট (ই-কমার্স ট্র্যাক)",
      desc: "সারা দেশের ৩,৩৬০ জন প্রতিযোগী এবং ৬১২টি টিমের মধ্যে আমাদের ফ্ল্যাগশিপ প্রজেক্ট EquiPulse AI জাতীয় ফাইনালিস্ট হিসেবে নির্বাচিত হয়েছে। আমাদের টিম ব্র্যাক ইউনিভার্সিটিতে চূড়ান্ত পর্বে লড়াই করবে।",
      date: "শুক্রবার, ১২ জুন, ২০২৬ (সকাল ৭:০০ টা থেকে রাত ৮:০০ টা)",
      location: "ব্র্যাক ইউনিভার্সিটি, ঢাকা (আয়োজক: ক্লাউডক্যাম্প বাংলাদেশ)",
      lineupLabel: "চূড়ান্ত পর্বে অংশ নেওয়া টিম মেম্বাররা:",
      lineup: [
        "সন্দীপ্ত কর্মকার (টিম লিডার)",
        "খলিফা আহম্মেদ আল-আমিন (ব্যাকএন্ড ও প্রজেক্ট কোঅর্ডিনেটর)",
        "আবু হুরায়রা (ফ্রন্টএন্ড ডেভলপার)",
        "মেহেদী হাসান (প্রেজেন্টেশন ও কমিউনিকেশন লিড)",
        "সানজিদা রহমান কাজল (ইউআই/ইউএক্স ডিজাইনার)",
        "মো: বাদশা মিয়া (কর্পোরেট প্রতিনিধি)"
      ]
    },
    vcp: {
      title: "Vibe Coding to Production (VCP) National Finals",
      subtitle: "সারাদেশে শীর্ষ ১০০ ফাইনালিস্ট",
      desc: "আমাদের ডিরেক্টর অফ এইচআর অ্যান্ড অপারেশনস সন্দীপ্ত কর্মকার (বর্ণ) একটি ক্রিয়েটিভ ৫-প্রম্পট স্ট্র্যাটেজি তৈরি করে কঠিন LLM ইভালুয়েশন পার করে চূড়ান্ত পর্বে নিজের জায়গা নিশ্চিত করেছেন।"
    },
    usaii: {
      title: "USAII গ্লোবাল এআই হ্যাকাথন ২০২৬",
      subtitle: "গ্লোবাল ফাইনালিস্ট",
      desc: "আমাদের ফ্ল্যাগশিপ প্রজেক্ট EquiPulse AI গ্লোবাল ফাইনালিস্ট হিসেবে নির্বাচিত হয়েছে। টিম মেম্বাররা হলেন: আবু হুরায়রা, জান্নাতুল নাঈম, খলিফা আহম্মেদ আল-আমিন, সন্দীপ্ত কর্মকার এবং সানজিদা রহমান।"
    },
    quantum: {
      title: "গ্লোবাল কোয়ান্টাম মেকানিক্স চ্যালেঞ্জ ২০২৬",
      subtitle: "কোয়ালিফিকেশন রাউন্ড বিজয়ী",
      desc: "আমাদের ম্যানেজিং ডিরেক্টর ও সিইও, খলিফা আহম্মেদ আল-আমিন, সাফল্যের সাথে কোয়ালিফিকেশন রাউন্ড সম্পন্ন করেছেন এবং সেমিফাইনাল রাউন্ড ২০২৬-এর জন্য নির্বাচিত হয়েছেন।"
    },
    zero: {
      title: "জিরো অলিম্পিয়াড গ্র্যান্ড ফাইনাল (সিজন ২)",
      subtitle: "জাতীয় চ্যাম্পিয়ন (SDG অ্যাচিভার) - SDG ১৫",
      desc: "রাউন্ড ১-এ ৯,৩৩২ জন প্রতিযোগী থেকে রাউন্ড ২-তে ৩,৪০৭ জনে সংকুচিত হওয়া জাতীয় পুলের মধ্যে আমাদের ম্যানেজিং ডিরেক্টর ও সিইও খলিফা আহম্মেদ আল-আমিন ১৩ জুন, ২০২৬-এ অনুষ্ঠিত গ্র্যান্ড ফাইনালে Atish Dipankar University of Science & Technology-এর প্রতিনিধি হিসেবে SDG ACHIEVER (CHAMPION) হিসেবে জাতীয় চ্যাম্পিয়নশিপ অর্জন করেছেন। TESOL Bangladesh-সহ লার্নিং পার্টনারদের সহায়তায় কনটেন্ট রিলেভেন্স, ক্রিয়েটিভিটি, কমিউনিকেশন, টেকনিক্যাল কোয়ালিটি এবং পরিবেশগত প্রভাব মূল্যায়ন করা হয়।"
    },
    nhspc: {
      title: "National High School Programming Contest (NHSPC 2026)",
      subtitle: "জুনিয়র কুইজ কনটেস্ট বিজয়ী",
      desc: "আমাদের কোর টিম মেম্বার হামিম জামান পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়ে আয়োজিত আঞ্চলিক NHSPC-তে জুনিয়র কুইজ ক্যাটাগরিতে বিজয়ী হয়েছেন। এটি আইসিটি ডিভিশনের অধীন বাংলাদেশ কম্পিউটার কাউন্সিল কর্তৃক আয়োজিত হয়েছিল।"
    },
    impactra: {
      title: "IMPACTRA Campus Ambassadorship",
      subtitle: "গভর্নমেন্ট সায়েন্স কলেজ প্রতিনিধি",
      desc: "সন্দীপ্ত কর্মকার গভর্নমেন্ট সায়েন্স কলেজ, ঢাকার ক্যাম্পাস অ্যাম্বাসেডর হিসেবে নির্বাচিত হয়েছেন যা মেধা ও পেশাদার দক্ষতার মেলবন্ধন ঘটাতে সাহায্য করবে।"
    },

    roundtable: {
      title: "গ্লোবাল এআই পলিসি স্ট্র্যাটেজিক রাউন্ডটেবিল",
      subtitle: "জাতিসংঘ ও জি২০ এডভাইজর মো: খোরশেদ আলম-এর সাথে বৈঠক",
      desc: "জাতিসংঘ, জি২০ এবং সৌদি আরব সরকারের মাল্টিল্যাটারাল এআই পলিসি এডভাইজর মো: খোরশেদ আলম-এর সাথে আমাদের এক্সিকিউটিভ বোর্ড রেসপন্সিবল এআই আর্কিটেকচার এবং লোকাল ডেটা স্ট্র্যাটেজি নিয়ে একটি গুরুত্বপূর্ণ রাউন্ডটেবিল সম্পন্ন করেছে।"
    },
    glc: {
      title: "গ্লোবাল কমিউনিকেশন ও ল্যাঙ্গুয়েজ পার্টনারশিপ",
      subtitle: "ঘাসফুল লার্নিং সেন্টার (GLC)",
      desc: "কো-অপারেটিভের ইঞ্জিনিয়ার ও ম্যানেজারদের ইংরেজি দক্ষতা বাড়াতে GLC-এর সাথে যৌথ উদ্যোগে স্পোকেন ইংলিশ মাস্টারক্লাস ব্যাচ চালু করা হয়েছে, যা পরিচালনা করছেন ব্র্যাক ইউনিভার্সিটির ইংরেজি বিভাগের প্রাক্তন ছাত্র মেহেদী হাসান।"
    },
    computerSchool: {
      title: "কৌশলগত টেক ও এডুকেশন সামিট",
      subtitle: "কম্পিউটার স্কুলের নেতৃবৃন্দের সাথে সামিট",
      desc: "কম্পিউটার স্কুলের ফাউন্ডার ও সিইও মাহমুদ হাসান মাসুম এবং হেড অফ ডিজাইন আশরাফ বিন আজহারের সাথে স্টার্টআপ লোকালাইজেশন এবং বিকাশ বা ফেব্রিলারিফের মতো হিউম্যান-সেন্ট্রিক ডিজাইন স্ট্যান্ডার্ড নিয়ে আলোচনা সভা অনুষ্ঠিত হয়েছে।"
    }
  }
});

export default function AchievementsAndPartnerships({ lang }) {
  const t = COPY[lang];

  return (
    <Section id="achievements" className="py-12 md:py-16 lg:py-24 bg-background relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-30">
        <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 space-y-16">
        {/* Section Header */}
        <div className="max-w-4xl space-y-5">
          <motion.div variants={fadeUp} custom={0}>
            <Badge variant="soft" className="rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-primary">
              {t.badge}
            </Badge>
          </motion.div>
          <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
            {t.title}
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-lg leading-8 text-muted-foreground">
            {t.desc}
          </motion.p>
        </div>

        {/* Section Content Grid */}
        <div className="grid gap-12 lg:grid-cols-2">
          
          {/* Left Side: National Achievements */}
          <div className="space-y-8">
            <div className="space-y-2 border-l-4 border-emerald-500 pl-4">
              <h3 className="text-2xl font-black text-foreground flex items-center gap-2">
                <Trophy className="text-emerald-500 w-6 h-6 shrink-0" />
                {t.achievementsTitle}
              </h3>
              <p className="text-sm text-muted-foreground">{t.achievementsDesc}</p>
            </div>

            {/* BuildFest Featured Card */}
            <motion.div variants={fadeUp} custom={3}>
              <Card className="border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors rounded-[2rem] border overflow-hidden relative">
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-bl-2xl">
                  Featured
                </div>
                <CardHeader className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                      <Star className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <CardTitle className="text-xl sm:text-2xl font-black">{t.buildfest.title}</CardTitle>
                      <CardDescription className="text-emerald-600 dark:text-emerald-400 font-bold text-sm mt-0.5">{t.buildfest.subtitle}</CardDescription>
                    </div>
                  </div>
                  <p className="text-sm leading-7 text-muted-foreground mt-4">{t.buildfest.desc}</p>
                </CardHeader>
                <CardContent className="p-6 sm:p-8 pt-0 space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2 text-xs bg-background/50 p-4 rounded-xl border border-emerald-500/10">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{t.buildfest.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{t.buildfest.location}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-foreground">{t.buildfest.lineupLabel}</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {t.buildfest.lineup.map((person, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground bg-background/30 px-3 py-2 rounded-lg">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span className="truncate">{person}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Other Achievements Stack */}
            <div className="space-y-4">
              {[
                { data: t.usaii, delay: 4 },
                { data: t.quantum, delay: 5 },
                { data: t.vcp, delay: 6 },
                { data: t.zero, delay: 7 },
                { data: t.nhspc, delay: 8 },
                { data: t.impactra, delay: 9 }
              ].map((item, idx) => (
                <motion.div key={idx} variants={kineticReveal("up")} custom={item.delay}>
                  <Card className="border-border/60 bg-card/50 hover:bg-card transition-all duration-300 rounded-2xl shadow-sm border p-5 sm:p-6 flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                      <Award className="w-5 h-5" />
                    </div>
                    <div className="space-y-2 min-w-0">
                      <h4 className="font-bold text-foreground leading-snug">{item.data.title}</h4>
                      <p className="text-xs text-primary font-bold">{item.data.subtitle}</p>
                      <p className="text-sm leading-6 text-muted-foreground">{item.data.desc}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Side: Corporate Partnerships & Collaborations */}
          <div className="space-y-8">
            <div className="space-y-2 border-l-4 border-primary/80 pl-4">
              <h3 className="text-2xl font-black text-foreground flex items-center gap-2">
                <Handshake className="text-primary w-6 h-6 shrink-0" />
                {t.collabsTitle}
              </h3>
              <p className="text-sm text-muted-foreground">{t.collabsDesc}</p>
            </div>

            {/* Collaborations Stack */}
            <div className="space-y-6">
              {[
                { data: t.roundtable, icon: Users, delay: 8 },
                { data: t.glc, icon: Handshake, delay: 9 },
                { data: t.computerSchool, icon: Target, delay: 10 }
              ].map((collab, i) => {
                const Icon = collab.icon;
                return (
                  <motion.div key={i} variants={fadeUp} custom={collab.delay}>
                    <Card className="border-border/60 bg-card/60 hover:bg-card transition-all duration-300 rounded-[2rem] shadow-sm border p-6 sm:p-8 space-y-4 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors pointer-events-none" />
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="min-w-0">
                          <CardTitle className="text-lg sm:text-xl font-black leading-snug">{collab.data.title}</CardTitle>
                          <CardDescription className="text-primary font-bold text-xs mt-0.5">{collab.data.subtitle}</CardDescription>
                        </div>
                      </div>
                      <p className="text-sm leading-7 text-muted-foreground">{collab.data.desc}</p>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </Section>
  );
}
