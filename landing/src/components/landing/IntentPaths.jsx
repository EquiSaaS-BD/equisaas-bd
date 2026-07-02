import React from "react";
import { ArrowRight, BriefcaseBusiness, GraduationCap, Users2 } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";

import Section from "@/components/landing/Section";
import { fadeUp } from "@/components/landing/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { normalizeLocalizedTree } from "@/lib/localized-copy";

const COPY = {
  en: {
    badge: "Who EquiSaaS BD Serves",
    title: "One platform for learning tech skills, building community-led SaaS, and preparing SME software for Bangladesh.",
    intro: "EquiSaaS BD connects software training in Bangladesh with real operational work. Students learn, contributors build, and SME teams prepare for practical HR payroll, POS, and pharmacy inventory software.",
    cards: [
      {
        icon: GraduationCap,
        title: "For Bangladesh students and freshers",
        body: "Start with practical frontend, backend, DevOps, UI UX, product, business analysis, marketing, or CRM learning paths. The LMS connects lessons, proof submission, mentor review, and contribution records in one place.",
        href: "/software-training-bangladesh",
        cta: "Explore software training in Bangladesh",
        color: "from-sky-500/15 to-blue-500/8",
        borderColor: "hover:border-sky-500/40",
        iconBg: "bg-sky-500/10",
        iconColor: "text-sky-600 dark:text-sky-300",
        stat: "9 Departments",
        statDesc: "Choose your track",
      },
      {
        icon: Users2,
        title: "For contributors joining a community-driven SaaS ecosystem",
        body: "Join Bangladesh's first open tech cooperative with one department at a time, role-based review, and sweat equity aligned to real contribution. This is designed to replace unpaid internship culture with accountable production work.",
        href: "/lms/login",
        cta: "Enter the EquiSaaS BD LMS",
        color: "from-emerald-500/15 to-teal-500/8",
        borderColor: "hover:border-emerald-500/40",
        iconBg: "bg-emerald-500/10",
        iconColor: "text-emerald-600 dark:text-emerald-300",
        stat: "64 Districts",
        statDesc: "Builder network",
      },
      {
        icon: BriefcaseBusiness,
        title: "For Bangladesh SME owners",
        body: "Follow the roadmap for Bangladesh-focused SaaS tools including HR payroll software, POS software, and pharmacy inventory software. Our product direction is built around local operations, affordability, and clear onboarding.",
        href: "/sme-software-bangladesh",
        cta: "See SME software plans",
        color: "from-amber-500/15 to-orange-500/8",
        borderColor: "hover:border-amber-500/40",
        iconBg: "bg-amber-500/10",
        iconColor: "text-amber-600 dark:text-amber-300",
        stat: "3 SME Products",
        statDesc: "Bangladesh-first",
      },
    ],
  },
  bn: {
    badge: "EquiSaaS BD কাদের জন্য",
    title: "একটি প্ল্যাটফর্মে টেক স্কিল শেখা, কমিউনিটি-চালিত SaaS তৈরি, এবং বাংলাদেশি SME সফটওয়্যার প্রস্তুতি।",
    intro: "EquiSaaS BD বাংলাদেশে সফটওয়্যার ট্রেনিংকে বাস্তব অপারেশনাল কাজের সঙ্গে যুক্ত করে। শিক্ষার্থীরা শেখে, contributors বাস্তব কাজ করে।",
    cards: [
      {
        icon: GraduationCap,
        title: "বাংলাদেশের ছাত্রছাত্রী ও freshers-দের জন্য",
        body: "Frontend, backend, DevOps, UI UX, product, business analysis, marketing, বা CRM learning path দিয়ে শুরু করুন। LMS-এর ভেতরে lesson, proof submission, mentor review একসাথে যুক্ত।",
        href: "/software-training-bangladesh",
        cta: "বাংলাদেশে software training দেখুন",
        color: "from-sky-500/15 to-blue-500/8",
        borderColor: "hover:border-sky-500/40",
        iconBg: "bg-sky-500/10",
        iconColor: "text-sky-600 dark:text-sky-300",
        stat: "৯টি ডিপার্টমেন্ট",
        statDesc: "আপনার track বেছে নিন",
      },
      {
        icon: Users2,
        title: "কমিউনিটি-চালিত SaaS ecosystem-এ contributor হতে চাইলে",
        body: "এক সময় এক department, role-based review, আর real contribution-ভিত্তিক sweat equity সহ বাংলাদেশের প্রথম open tech cooperative-এ যোগ দিন।",
        href: "/lms/login",
        cta: "EquiSaaS BD LMS-এ প্রবেশ করুন",
        color: "from-emerald-500/15 to-teal-500/8",
        borderColor: "hover:border-emerald-500/40",
        iconBg: "bg-emerald-500/10",
        iconColor: "text-emerald-600 dark:text-emerald-300",
        stat: "৬৪ জেলা",
        statDesc: "Builder network",
      },
      {
        icon: BriefcaseBusiness,
        title: "বাংলাদেশের SME owner-দের জন্য",
        body: "বাংলাদেশি ব্যবসার জন্য HR payroll software, POS software, এবং pharmacy inventory software roadmap দেখুন।",
        href: "/sme-software-bangladesh",
        cta: "SME software roadmap দেখুন",
        color: "from-amber-500/15 to-orange-500/8",
        borderColor: "hover:border-amber-500/40",
        iconBg: "bg-amber-500/10",
        iconColor: "text-amber-600 dark:text-amber-300",
        stat: "৩টি SME পণ্য",
        statDesc: "বাংলাদেশ-ফার্স্ট",
      },
    ],
  },
};

function SpotlightCard({ card, index }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  const Icon = card.icon;

  return (
    <motion.div
      variants={fadeUp}
      custom={index + 2}
      className="group h-full relative"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        className="h-full w-full rounded-[2rem]"
      >
        {/* Spotlight Effect */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-500 group-hover:opacity-100 z-10"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                400px circle at ${mouseX}px ${mouseY}px,
                rgba(var(--color-primary-rgb), 0.08),
                transparent 80%
              )
            `,
          }}
        />

        <Card className={`relative overflow-hidden h-full rounded-[2rem] border border-border/40 bg-background/60 backdrop-blur-2xl shadow-lg transition-all duration-500 group-hover:shadow-2xl group-hover:border-primary/30 group-hover:bg-card/90`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 transition-opacity duration-500 group-hover:opacity-100 mix-blend-overlay`} />

          <CardHeader className="relative z-20 space-y-5">
            <div className="flex items-start justify-between">
              <motion.div
                className={`flex h-16 w-16 items-center justify-center rounded-[1.25rem] ${card.iconBg} ${card.iconColor} shadow-inner transition-colors duration-500 group-hover:bg-background`}
                whileHover={{ rotate: 10, scale: 1.15 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Icon className="h-7 w-7" />
              </motion.div>
              <div className="text-right mt-1">
                <p className={`text-sm font-black ${card.iconColor} drop-shadow-sm`}>{card.stat}</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">{card.statDesc}</p>
              </div>
            </div>
            <CardTitle className="text-2xl font-black leading-tight tracking-tight">{card.title}</CardTitle>
            <CardDescription className="text-[15px] leading-7 text-muted-foreground font-medium">{card.body}</CardDescription>
          </CardHeader>
          <CardContent className="relative z-20 mt-auto">
            <Button
              variant="outline"
              asChild
              className={`w-full justify-between h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm transition-all duration-300 group-hover:border-primary/40 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-md`}
            >
              <a href={card.href} className="font-bold tracking-wide">
                {card.cta}
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

const LOCALIZED_COPY = normalizeLocalizedTree(COPY);

export default function IntentPaths({ lang }) {
  const t = LOCALIZED_COPY[lang];

  return (
    <Section id="audiences" className="py-32 relative overflow-hidden bg-background">
      {/* Background Meshes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 h-[600px] w-[600px] rounded-full bg-secondary/5 blur-[120px]" />
        <div className="absolute top-1/2 left-0 h-[400px] w-[400px] rounded-full bg-accent/30 blur-[80px]" />
      </div>

      <div className="container relative z-10 mx-auto px-6 space-y-16">
        <div className="max-w-4xl space-y-6 text-center mx-auto">
          <motion.div variants={fadeUp} custom={0}>
            <Badge variant="soft" className="rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs uppercase tracking-widest font-black shadow-sm">
              {t.badge}
            </Badge>
          </motion.div>
          <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
            {t.title}
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-lg md:text-xl leading-relaxed text-muted-foreground font-medium">
            {t.intro}
          </motion.p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {t.cards.map((card, idx) => (
            <SpotlightCard key={idx} card={card} index={idx} />
          ))}
        </div>
      </div>
    </Section>
  );
}
