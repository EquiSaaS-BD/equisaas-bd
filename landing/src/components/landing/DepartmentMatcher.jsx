import React, { useMemo, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { departments } from "@/data/cofounder";
import Section from "@/components/landing/Section";
import { fadeUp } from "@/components/landing/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { buildLmsTrackUrl } from "@/lib/lms-links";

const TEXT = {
  bn: {
    badge: "ইন্টারঅ্যাকটিভ ডিপার্টমেন্ট ম্যাচার",
    title: "আপনার জন্য সঠিক কো-ফাউন্ডার ট্র্যাক খুঁজে নিন",
    desc: "আগ্রহ সিলেক্ট করুন, আমরা আপনার জন্য সবচেয়ে প্রাসঙ্গিক ডিপার্টমেন্ট সাজেস্ট করব।",
    hint: "৩টি পর্যন্ত আগ্রহ বেছে নিন",
    result: "আপনার জন্য প্রস্তাবিত ডিপার্টমেন্ট",
    explore: "প্রস্তাবিত রোডম্যাপ খুলুন",
    clear: "রিসেট",
  },
  en: {
    badge: "Interactive Department Matcher",
    title: "Find your ideal co-founder track",
    desc: "Select your interests and get a department recommendation tailored to your strengths.",
    hint: "Choose up to 3 interests",
    result: "Recommended department for you",
    explore: "Open Recommended Roadmap",
    clear: "Reset",
  },
};

const INTERESTS = [
  {
    id: "frontend",
    labelBn: "UI বানাতে ভালো লাগে",
    labelEn: "I love building UI",
    scores: { engineering: 3, design: 2 },
  },
  {
    id: "systems",
    labelBn: "ব্যাকএন্ড/সিস্টেম ভাবতে পছন্দ",
    labelEn: "I enjoy backend/system design",
    scores: { engineering: 3, product: 1 },
  },
  {
    id: "brand",
    labelBn: "ভিজ্যুয়াল ব্র্যান্ড/ক্রিয়েটিভিটি",
    labelEn: "I enjoy visual branding",
    scores: { design: 3, marketing: 2 },
  },
  {
    id: "research",
    labelBn: "রিসার্চ ও প্রোডাক্ট ডিসিশন",
    labelEn: "I like product research and decisions",
    scores: { product: 3, marketing: 1 },
  },
  {
    id: "growth",
    labelBn: "গ্রোথ/SEO/কনটেন্ট",
    labelEn: "I enjoy growth/SEO/content",
    scores: { marketing: 3, product: 1 },
  },
  {
    id: "support",
    labelBn: "ইউজার সাকসেস ও কমিউনিটি",
    labelEn: "I care about user success/community",
    scores: { marketing: 2, product: 2 },
  },
];

export default function DepartmentMatcher({ lang }) {
  const t = TEXT[lang];
  const [selected, setSelected] = useState([]);
  const { recommended, scoreMap } = useMemo(() => selectRecommendedDepartment(selected), [selected]);

  function toggleInterest(id) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }

  function openRecommendation() {
    if (typeof window === "undefined" || !recommended) return;
    const recommendedPathId = recommended.roles?.[0]?.id || "";
    window.sessionStorage.setItem("preferredDeptId", recommended.id);
    window.sessionStorage.setItem("preferredDept", recommended.id);
    if (recommendedPathId) window.sessionStorage.setItem("preferredPathId", recommendedPathId);
    window.location.assign(buildLmsTrackUrl(recommendedPathId));
  }

  return (
    <Section id="dept-matcher" className="py-12 md:py-16 lg:py-24 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-6 space-y-10 relative">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <motion.div variants={fadeUp} custom={0}>
            <Badge variant="soft" className="text-xs font-semibold py-1 px-4 rounded-full border border-primary/20 bg-primary/5">
              ✦ {t.badge}
            </Badge>
          </motion.div>
          <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            {t.title}
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-muted-foreground text-lg leading-relaxed">
            {t.desc}
          </motion.p>
        </div>

        <Card className="max-w-6xl mx-auto border-0 bg-background/60 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-2xl">
          <CardHeader className="space-y-2">
            <CardTitle className="text-xl font-black">{t.hint}</CardTitle>
            <CardDescription className="text-muted-foreground">{lang === "bn" ? `সিলেক্টেড: ${selected.length}/3` : `Selected: ${selected.length}/3`}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-3">
              {INTERESTS.map((interest) => {
                const active = selected.includes(interest.id);
                return (
                  <button
                    key={interest.id}
                    type="button"
                    onClick={() => toggleInterest(interest.id)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm font-bold border transition-all",
                      active ? "bg-gradient-to-br from-primary via-[#1e40af] to-coop border border-white/20 shadow-lg text-white border-0 shadow-lg shadow-primary/20" : "bg-background/50 border-border/60 hover:bg-muted/30"
                    )}
                  >
                    {lang === "bn" ? interest.labelBn : interest.labelEn}
                  </button>
                );
              })}
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <Card className="border-0 bg-background/50">
                <CardHeader>
                  <CardDescription className="uppercase text-xs font-black tracking-widest text-muted-foreground">{t.result}</CardDescription>
                  <CardTitle className="text-2xl font-black flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    {lang === "bn" ? recommended.titleBn : recommended.titleEn}
                  </CardTitle>
                  {selected.length > 0 && (
                    <div className="mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md inline-block">
                      {lang === "bn" ? "আপনার স্কিল প্রোফাইলের সাথে ৯৮% ম্যাচ হয়েছে!" : "98% Match with your unique skill profile!"}
                    </div>
                  )}
                  <CardDescription className="mt-2">{lang === "bn" ? recommended.descBn : recommended.descEn}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Button onClick={openRecommendation} className="bg-gradient-to-br from-primary via-[#1e40af] to-coop border border-white/20 shadow-lg border-0">
                    {t.explore} <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" onClick={() => setSelected([])}>
                    {t.clear}
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 bg-background/50">
                <CardHeader>
                  <CardTitle className="text-lg font-black">{lang === "bn" ? "ম্যাচ স্কোরবোর্ড" : "Match Scoreboard"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {departments.map((dept) => {
                    const maxScore = Math.max(...Object.values(scoreMap), 1);
                    const width = Math.round((scoreMap[dept.id] / maxScore) * 100);
                    return (
                      <div key={dept.id} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-bold">{lang === "bn" ? dept.titleBn : dept.titleEn}</span>
                          <span className="font-semibold text-muted-foreground">{scoreMap[dept.id]}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-primary to-coop"
                            animate={{ width: `${width}%` }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}





