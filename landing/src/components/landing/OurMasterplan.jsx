import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PieChart, Network, ArrowRight } from "lucide-react";

import Section from "@/components/landing/Section";
import { fadeUp } from "@/components/landing/motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { normalizeLocalizedTree } from "@/lib/localized-copy";

const COPY = normalizeLocalizedTree({
  en: {
    badge: "Nationwide Masterplan",
    title: "Conquering Tech Inequality",
    desc: "A completely transparent revolution where your learning turns into direct product contributions, and those contributions guarantee your lifelong ownership.",
    splitTitle: "The 70/30 Profit Sharing Revolution",
    splitDesc: "We believe in fair returns. If you build and launch a product through EquiSaaS BD, you keep 70% of the product profits, while the company takes 30%. For internal flagship projects, contributors earn direct Sweat Equity (corporate ownership). Unpaid internships are gone.",
    roadmapTitle: "Execution Roadmap",
    roadmapDesc: "Our relentless path from learning to launching B2B software.",

    roadmapSteps: [
      { title: "Phase 1: Army of Builders", desc: "Train members across all 64 districts in 9 specialized departments for free." },
      { title: "Phase 2: Localized SaaS Dominance", desc: "Build internet-resilient tools like EquiPulse AI exclusively for Bangladesh SMEs." },
      { title: "Phase 3: Limited Company & Equity", desc: "Incorporate into a Limited Company. Learning departments remain free forever, while contributors gain lifelong corporate shares." }
    ]
  },
  bn: {
    badge: "দেশব্যাপী মাস্টারপ্ল্যান",
    title: "টেক-বৈষম্য দূর করার সংগ্রাম",
    desc: "একটি সম্পূর্ণ স্বচ্ছ মডেল যেখানে আপনার শেখা সরাসরি প্রোডাক্ট কন্ট্রিবিউশনে পরিণত হয়, আর সেই কন্ট্রিবিউশন নিশ্চিত করে আপনার আজীবন মালিকানা।",
    splitTitle: "৭০/৩০ বৈপ্লবিক লভ্যাংশ বণ্টন",
    splitDesc: "আমরা সত্যিকারের অংশীদারিত্বে বিশ্বাস করি। আমাদের প্ল্যাটফর্ম ব্যবহার করে আপনি আপনার প্রোডাক্ট লঞ্চ করলে লভ্যাংশের ৭০% সরাসরি আপনি পাবেন, আর কো-অপারেটিভ পাবে ৩০%। এটি বাংলাদেশে তো বটেই, বিশ্বেও বিরল। ইন্টারনাল প্রজেক্টের ক্ষেত্রে আপনার প্রতিটা কন্ট্রিবিউশন মেধাভিত্তিক মালিকানা (Sweat Equity) হিসেবে জমা হবে।",
    roadmapTitle: "এক্সেকিউশন রোডম্যাপ",
    roadmapDesc: "শেখা থেকে শুরু করে B2B সফটওয়্যার লঞ্চ করার অদম্য পথ।",

    roadmapSteps: [
      { title: "ফেজ ১: বিল্ডার আর্মি", desc: "৬৪ জেলার তরুণদের ৯টি স্পেশালাইজড ডিপার্টমেন্টে সম্পূর্ণ ফ্রিতে ট্রেইন করা।" },
      { title: "ফেজ ২: লোকাল স্যাস ডমিন্যান্স", desc: "বাংলাদেশি মার্চেন্টদের জন্য EquiPulse AI-এর মতো অফলাইন-ফার্স্ট বিজনেস সফটওয়্যার তৈরি।" },
      { title: "ফেজ ৩: লিমিটেড কোম্পানি ও স্থায়ী ফ্রি লার্নিং", desc: "লিমিটেড কোম্পানিতে রূপান্তরিত হওয়ার পর সকল ডিপার্টমেন্ট আজীবন ফ্রি থাকবে। যোগ্য মেম্বাররা কোম্পানির ডিরেক্ট অংশীদার হবেন।" }
    ]
  }
});

export default function OurMasterplan({ lang }) {
  const t = COPY[lang];
  const sectionRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"]
  });

  const p70 = useTransform(scrollYProgress, [0.2, 0.6], [0, 307.88]);
  const p30 = useTransform(scrollYProgress, [0.6, 1.0], [0, 131.95]);

  return (
    <Section id="masterplan" className="relative overflow-hidden bg-background py-12 md:py-16 lg:py-24">
      <div className="pointer-events-none absolute inset-0" ref={sectionRef}>
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container relative mx-auto space-y-12 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl space-y-5 text-center">
          <motion.div variants={fadeUp} custom={0}>
            <Badge variant="soft" className="rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-xs font-semibold">
              {t.badge}
            </Badge>
          </motion.div>
          <motion.h2 variants={fadeUp} custom={1} className="text-3xl font-black tracking-tight md:text-3xl sm:text-4xl lg:text-5xl text-gradient-brand">
            {t.title}
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="mx-auto max-w-3xl text-lg leading-8 text-muted-foreground">
            {t.desc}
          </motion.p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: strategic delivery visual */}
          <motion.div variants={fadeUp} custom={3}>
            <Card className="h-full overflow-hidden rounded-[2rem] border border-border/50 bg-card/85 shadow-xl backdrop-blur-xl">
              <CardHeader className="space-y-4 p-6 lg:p-8 pb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <PieChart className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl font-black tracking-tight">{t.splitTitle}</CardTitle>
                <CardDescription className="text-base leading-7 text-muted-foreground">
                  {t.splitDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 lg:p-8 pt-0">
                <div className="flex flex-col items-center gap-6">
                  <div className="relative flex items-center justify-center p-4">
                    <svg
                      viewBox="0 0 200 200"
                      className="w-56 h-56 overflow-visible"
                      aria-label="Profit split: 70% Creator, 30% Company"
                    >
                      <defs>
                        <filter id="glow-teal" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="5" result="blur" />
                          <feFlood floodColor="#0d9488" floodOpacity="0.4" result="glowColor" />
                          <feComposite in="glowColor" in2="blur" operator="in" result="glow" />
                          <feMerge>
                            <feMergeNode in="glow" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                        <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="5" result="blur" />
                          <feFlood floodColor="#10b981" floodOpacity="0.4" result="glowColor" />
                          <feComposite in="glowColor" in2="blur" operator="in" result="glow" />
                          <feMerge>
                            <feMergeNode in="glow" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>
                      
                      {/* Track */}
                      <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeOpacity="0.05" strokeWidth="26" />
                      
                      {/* 70% Creator ; teal */}
                      <motion.circle
                        cx="100" cy="100" r="70" fill="none"
                        stroke="#0d9488"
                        strokeWidth="26"
                        strokeDashoffset="0"
                        strokeLinecap="round"
                        transform="rotate(-90 100 100)"
                        filter="url(#glow-teal)"
                        style={{ strokeDasharray: useTransform(p70, v => `${v} 439.82`) }}
                        whileHover={{ strokeWidth: 32, transition: { type: "spring", stiffness: 300 } }}
                        className="cursor-pointer transition-all duration-300"
                      />
                      
                      {/* 30% Company ; emerald */}
                      <motion.circle
                        cx="100" cy="100" r="70" fill="none"
                        stroke="#10b981"
                        strokeWidth="26"
                        strokeDashoffset="-307.88"
                        strokeLinecap="round"
                        transform="rotate(-90 100 100)"
                        filter="url(#glow-emerald)"
                        style={{ strokeDasharray: useTransform(p30, v => `${v} 439.82`) }}
                        whileHover={{ strokeWidth: 32, transition: { type: "spring", stiffness: 300 } }}
                        className="cursor-pointer transition-all duration-300"
                      />
                      
                      {/* Center label */}
                      <text x="100" y="96" textAnchor="middle" fill="currentColor" style={{ fontSize: "20px", fontWeight: 900, fontFamily: "inherit" }}>70/30</text>
                      <text x="100" y="113" textAnchor="middle" fill="currentColor" style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em", opacity: 0.5 }}>SPLIT</text>
                    </svg>
                  </div>
                  {/* Legend */}
                  <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 w-full">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#0d9488] shrink-0" />
                      <span className="text-sm font-bold">{lang === "bn" ? "৭০% প্রোডাক্ট ক্রিয়েটর" : "70% Product Creator"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#10b981] shrink-0" />
                      <span className="text-sm font-bold">{lang === "bn" ? "৩০% কো-অপারেটিভ" : "30% Company"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right: Roadmap Steps */}
          <motion.div variants={fadeUp} custom={4}>
            <Card className="h-full overflow-hidden rounded-[2rem] border border-border/50 bg-card/85 shadow-xl backdrop-blur-xl">
              <CardHeader className="space-y-4 p-6 lg:p-8 pb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Network className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl font-black tracking-tight">{t.roadmapTitle}</CardTitle>
                <CardDescription className="text-base leading-7 text-muted-foreground">
                  {t.roadmapDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6 lg:p-8 pt-0">
                {t.roadmapSteps.map((step, idx) => (
                  <div key={idx} className="flex gap-4 rounded-2xl border border-border/50 bg-background/80 p-5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-black text-primary text-xs">
                      0{idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold">{step.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
