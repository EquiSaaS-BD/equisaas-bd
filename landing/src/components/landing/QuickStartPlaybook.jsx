import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BriefcaseBusiness, GraduationCap, Users2 } from "lucide-react";

import { APPLICATION_LINK, LINKS } from "@/data/cofounder";
import Section from "@/components/landing/Section";
import { normalizeLocalizedTree } from "@/lib/localized-copy";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const COPY = normalizeLocalizedTree({
  en: {
    badge: "Start Here",
    title: "Choose the clearest starting path for your goal",
    desc: "If you are exploring EquiSaaS BD for the first time, this playbook helps you avoid guesswork. Pick the path that matches your situation.",
    tabs: [
      {
        value: "learner",
        label: "I want to learn",
        icon: GraduationCap,
        title: "Start as a learner inside one department path",
        body: "Best for students, freshers, and self-learners who want a structured LMS flow, practical proof tasks, and clear department-based upskilling.",
        steps: [
          "Use the department fit guide and choose one department only.",
          "Enter the LMS, complete lessons, and submit visible proof from task pages.",
          "Track review, points, and your department leaderboard as your work gets approved.",
        ],
        primary: { href: "#departments", label: "Find my department" },
        secondary: { href: "/lms/login", label: "Open the LMS" },
        color: "from-sky-500 to-blue-600",
        bgLight: "from-sky-500/8 to-blue-500/4",
      },
      {
        value: "contributor",
        label: "I want to contribute",
        icon: Users2,
        title: "Join the builder workflow and contribute to real work",
        body: "Best for people who already want to build with the community, work with one department team, and grow through proof-based contribution.",
        steps: [
          "Complete the guided application form and keep WhatsApp or email active for follow-up.",
          "Choose your department, follow the learning path, and enter real proof-based work.",
          "Move through review, official records, leaderboard visibility, and future certificate eligibility.",
        ],
        primary: { href: APPLICATION_LINK, label: "Apply to join", external: true },
        secondary: { href: LINKS.whatsappLink, label: "Contact support", external: true },
        color: "from-emerald-500 to-teal-600",
        bgLight: "from-emerald-500/8 to-teal-500/4",
      },
      {
        value: "sme",
        label: "I need software",
        icon: BriefcaseBusiness,
        title: "Explore the SME software roadmap and founder direction",
        body: "Best for business owners, partners, and supporters who want to understand the Bangladesh-first product roadmap, founder vision, and future software plans.",
        steps: [
          "Review the SME software roadmap for HR, POS, and pharmacy operations.",
          "Read the founder message to understand the long-term mission and build model.",
          "Use the orientation and contact channels if you want to follow the launch journey closely.",
        ],
        primary: { href: "/sme-software-bangladesh", label: "Explore SME software" },
        secondary: { href: LINKS.founderPage, label: "Read founder's message" },
        color: "from-amber-500 to-orange-600",
        bgLight: "from-amber-500/8 to-orange-500/4",
      },
    ],
  },
  bn: {
    badge: "এখান থেকে শুরু করুন",
    title: "আপনার লক্ষ্য অনুযায়ী সবচেয়ে পরিষ্কার starting path বেছে নিন",
    desc: "এই playbook আপনাকে guesswork কমাবে। আপনার situation-এর সাথে মিল আছে এমন path বেছে নিন।",
    tabs: [
      {
        value: "learner",
        label: "আমি শিখতে চাই",
        icon: GraduationCap,
        title: "একটি department path-এর learner হিসেবে শুরু করুন",
        body: "Student, fresher, বা self-learner যারা clear LMS flow, practical proof task, আর department-based upskilling চান তাদের জন্য।",
        steps: [
          "Department fit guide ব্যবহার করে একটি department বেছে নিন।",
          "LMS-এ ঢুকে lesson complete করুন এবং task page থেকে visible proof submit করুন।",
          "Review, points, আর department leaderboard-এর মাধ্যমে progress track করুন।",
        ],
        primary: { href: "#departments", label: "আমার department খুঁজে নিন" },
        secondary: { href: "/lms/login", label: "LMS খুলুন" },
        color: "from-sky-500 to-blue-600",
        bgLight: "from-sky-500/8 to-blue-500/4",
      },
      {
        value: "contributor",
        label: "আমি contribute করতে চাই",
        icon: Users2,
        title: "Builder workflow-এ যোগ দিন এবং real work-এ contribute করুন",
        body: "Community-এর সাথে build করতে, একটি department team-এর সাথে কাজ করতে, আর proof-based contribution দিয়ে grow করতে চাইলে।",
        steps: [
          "Guided application form complete করুন এবং follow-up-এর জন্য WhatsApp বা email active রাখুন।",
          "নিজের department বেছে নিয়ে learning path follow করুন।",
          "Review, official record, leaderboard, আর future certificate eligibility-এর দিকে এগান।",
        ],
        primary: { href: APPLICATION_LINK, label: "যোগ দিতে আবেদন করুন", external: true },
        secondary: { href: LINKS.whatsappLink, label: "সাপোর্টে যোগাযোগ করুন", external: true },
        color: "from-emerald-500 to-teal-600",
        bgLight: "from-emerald-500/8 to-teal-500/4",
      },
      {
        value: "sme",
        label: "আমি software খুঁজছি",
        icon: BriefcaseBusiness,
        title: "SME software roadmap আর founder direction বুঝে নিন",
        body: "Business owner, partner, বা supporter যারা Bangladesh-first product roadmap, founder vision, আর future software plans বুঝতে চান।",
        steps: [
          "HR, POS, আর pharmacy workflow-এর SME software roadmap দেখুন।",
          "Founder message পড়ে long-term mission আর build model বুঝুন।",
          "Orientation এবং contact channel ব্যবহার করে launch journey follow করুন।",
        ],
        primary: { href: "/sme-software-bangladesh", label: "SME software দেখুন" },
        secondary: { href: LINKS.founderPage, label: "ফাউন্ডারের বার্তা পড়ুন" },
        color: "from-amber-500 to-orange-600",
        bgLight: "from-amber-500/8 to-orange-500/4",
      },
    ],
  },
});

export default function QuickStartPlaybook({ lang }) {
  const t = COPY[lang];
  const [activeTab, setActiveTab] = useState(0);
  const [direction, setDirection] = useState(1);

  const activeTabData = t.tabs[activeTab];

  const handleTabChange = (index) => {
    setDirection(index > activeTab ? 1 : -1);
    setActiveTab(index);
  };

  const contentVariants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
  };

  return (
    <Section id="start-here" className="relative overflow-hidden bg-background py-12 md:py-16 lg:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute bottom-8 left-12 h-64 w-64 rounded-full bg-coop/8 blur-3xl" />
      </div>

      <div className="container relative mx-auto space-y-10 px-4 sm:px-6">
        {/* Header */}
        <div className="mx-auto max-w-4xl space-y-5 text-center">
          <Badge variant="soft" className="rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-xs font-semibold">
            {t.badge}
          </Badge>
          <h2 className="text-3xl font-black tracking-tight md:text-3xl sm:text-4xl lg:text-5xl">{t.title}</h2>
          <p className="mx-auto max-w-3xl text-lg leading-8 text-muted-foreground">{t.desc}</p>
        </div>

        {/* Custom Tab Triggers */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {t.tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === index;
            return (
              <motion.button
                key={tab.value}
                type="button"
                onClick={() => handleTabChange(index)}
                whileHover={{ scale: isActive ? 1 : 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "relative overflow-hidden rounded-[1.5rem] border p-5 text-left transition-all duration-300",
                  isActive
                    ? "border-primary/40 bg-card shadow-xl"
                    : "border-border/50 bg-card/60 hover:border-primary/25 hover:bg-card"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="tab-bg"
                    className={cn("absolute inset-0 rounded-[1.5rem] bg-gradient-to-br opacity-10", tab.bgLight)}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className="relative flex items-center gap-3">
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-300",
                    isActive ? `bg-gradient-to-br ${tab.color} text-white shadow-md` : "bg-muted text-muted-foreground"
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className={cn("text-sm font-bold transition-colors", isActive ? "text-foreground" : "text-muted-foreground")}>
                      {tab.label}
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/60">
                      0{index + 1}
                    </p>
                  </div>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className={cn("absolute bottom-0 left-0 h-1 w-full rounded-b-[1.5rem] bg-gradient-to-r", tab.color)}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* ── Zeigarnik Effect Progress Bar ── shows incompletion urge to finish */}
        <div className="mx-auto max-w-3xl space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
            <span className="text-primary">
              {lang === "bn"
                ? `পথ ${activeTab + 1} / ${t.tabs.length}`
                : `Path ${activeTab + 1} of ${t.tabs.length}`}
            </span>
            <span className="text-muted-foreground/70">
              {activeTab < t.tabs.length - 1
                ? (lang === "bn"
                    ? `আরো ${t.tabs.length - activeTab - 1}টি path বাকি - শেষ করুন`
                    : `${t.tabs.length - activeTab - 1} more path${t.tabs.length - activeTab - 1 !== 1 ? 's' : ''} to explore`)
                : (lang === "bn" ? "✓ সব path দেখা হয়েছে" : "✓ All paths explored")}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
            <motion.div
              className={cn("h-full rounded-full bg-gradient-to-r", activeTabData.color)}
              initial={{ width: 0 }}
              animate={{ width: `${((activeTab + 1) / t.tabs.length) * 100}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeTab}
              custom={direction}
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <Card className="overflow-hidden rounded-[2rem] border border-border/50 bg-card/85 shadow-xl backdrop-blur-xl">
                <div className={cn("h-1.5 w-full bg-gradient-to-r", activeTabData.color)} />
                <CardHeader className="space-y-4 p-6 lg:p-8">
                  <div className={cn(
                    "inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.22em]",
                    `bg-gradient-to-r ${activeTabData.bgLight} border border-border/50 text-foreground`
                  )}>
                    {React.createElement(activeTabData.icon, { className: "h-4 w-4" })}
                    0{activeTab + 1}
                  </div>
                  <div className="space-y-3">
                    <CardTitle className="text-2xl font-black tracking-tight md:text-3xl">{activeTabData.title}</CardTitle>
                    <CardDescription className="text-base leading-7 text-muted-foreground">{activeTabData.body}</CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="grid gap-6 p-6 pt-0 lg:grid-cols-[1.05fr_0.95fr] lg:p-8 lg:pt-0">
                  {/* Steps */}
                  <div className="space-y-4">
                    {activeTabData.steps.map((step, stepIndex) => (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: stepIndex * 0.1, duration: 0.35 }}
                        className="flex gap-4 rounded-[1.4rem] border border-border/50 bg-background/80 px-4 py-4"
                      >
                        <div className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-black text-white",
                          activeTabData.color
                        )}>
                          {stepIndex + 1}
                        </div>
                        <p className="pt-1 text-sm leading-7 text-muted-foreground">{step}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Quick actions */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15, duration: 0.35 }}
                    className="space-y-4 rounded-[1.6rem] border border-border/50 bg-background/80 p-5"
                  >
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Quick actions</p>
                    <Separator className="bg-border/60" />
                    <div className="grid gap-3">
                      <Button className="min-h-12 justify-between rounded-2xl" asChild>
                        <a href={activeTabData.primary.href} target={activeTabData.primary.external ? "_blank" : undefined} rel={activeTabData.primary.external ? "noreferrer" : undefined}>
                          {activeTabData.primary.label}
                          <ArrowRight className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button variant="outline" className="min-h-12 justify-between rounded-2xl border-primary/20" asChild>
                        <a href={activeTabData.secondary.href} target={activeTabData.secondary.external ? "_blank" : undefined} rel={activeTabData.secondary.external ? "noreferrer" : undefined}>
                          {activeTabData.secondary.label}
                          <ArrowRight className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}
