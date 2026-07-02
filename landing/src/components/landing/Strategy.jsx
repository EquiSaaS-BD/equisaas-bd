import React from "react";
import { ArrowRight, BadgeCheck, Target, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

import { APPLICATION_LINK, CONTENT } from "@/data/cofounder";
import Section from "@/components/landing/Section";
import { fadeUp } from "@/components/landing/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { normalizeLocalizedTree } from "@/lib/localized-copy";

const STRATEGY_COPY = normalizeLocalizedTree({
  en: {
    badge: "Why This Model Is Practical",
    intro:
      "The landing page now explains not just the mission, but the operating logic behind how EquiSaaS BD can train, organize, and move contributors into real product work over the next two months.",
    supportLabel: "What makes this more usable now",
    supportTitle: "One connected journey from landing page to contribution workflow",
    supportBody:
      "Department choice, LMS entry, proof-based review, and growth direction now feel like one system. That makes onboarding clearer, reduces confusion, and helps the team move faster together.",
    bullets: [
      "Landing, LMS, and application flow now point to the same 9 departments.",
      "Learners are guided toward one clear next action instead of parallel clutter.",
      "Community trust is reinforced through proof, review, and official records.",
    ],
    primaryCta: "Explore departments",
    secondaryCta: "Apply now",
  },
  bn: {
    badge: "কেন এই মডেলটা বাস্তবসম্মত",
    intro:
      "এখন landing page শুধু mission না, বরং EquiSaaS BD কীভাবে আগামী দুই মাসে training, organization, আর real product work-এ মানুষকে move করাবে, সেটার operating logic-ও পরিষ্কারভাবে বোঝায়।",
    supportLabel: "এখন কেন এটা আরও usable",
    supportTitle: "Landing page থেকে contribution workflow পর্যন্ত একটাই connected journey",
    supportBody:
      "Department choice, LMS entry, proof-based review, আর growth direction এখন আলাদা আলাদা layer মনে হয় না। এতে onboarding clear হয়, confusion কমে, আর পুরো team দ্রুত এগোতে পারে।",
    bullets: [
      "Landing, LMS, আর application flow এখন একই ৯ department-এর সাথে aligned।",
      "Learner-রা parallel clutter না দেখে একটাই clear next action পায়।",
      "Proof, review, আর official record-এর মাধ্যমে community trust আরও strong হয়।",
    ],
    primaryCta: "ডিপার্টমেন্টগুলো দেখুন",
    secondaryCta: "এখনই আবেদন করুন",
  },
});

export default function Strategy({ lang }) {
  const t = CONTENT[lang].strategy;
  const local = STRATEGY_COPY[lang];

  return (
    <Section id="strategy" className="relative overflow-hidden bg-muted/30 py-12 md:py-16 lg:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-72 w-72 rounded-full bg-coop/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto space-y-12 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl space-y-5 text-center">
          <motion.div variants={fadeUp} custom={0}>
            <Badge variant="soft" className="rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-xs font-semibold">
              {local.badge}
            </Badge>
          </motion.div>
          <motion.h2 variants={fadeUp} custom={1} className="text-3xl font-black tracking-tight md:text-3xl sm:text-4xl lg:text-5xl">
            {t.title}
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="mx-auto max-w-3xl text-lg leading-8 text-muted-foreground">
            {local.intro}
          </motion.p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <motion.div variants={fadeUp} custom={2.2}>
            <Card className="overflow-hidden rounded-[2rem] border border-border/50 bg-card/85 shadow-xl backdrop-blur-xl">
              <CardHeader className="space-y-5 p-6 lg:p-8">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-primary">
                  <TrendingUp className="h-4 w-4" />
                  {local.supportLabel}
                </div>
                <div className="space-y-3">
                  <CardTitle className="text-2xl font-black tracking-tight md:text-3xl">{local.supportTitle}</CardTitle>
                  <CardDescription className="text-base leading-7 text-muted-foreground">{local.supportBody}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 p-6 pt-0 lg:p-8 lg:pt-0">
                {local.bullets.map((bullet, index) => (
                  <div key={bullet} className="rounded-[1.4rem] border border-border/50 bg-background/80 px-4 py-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <BadgeCheck className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">0{index + 1}</p>
                        <p className="text-sm leading-6 text-muted-foreground">{bullet}</p>
                      </div>
                    </div>
                  </div>
                ))}

                <Separator className="bg-border/60" />

                <div className="grid gap-3 sm:grid-cols-2">
                  <Button className="rounded-2xl" asChild>
                    <a href="#departments">
                      {local.primaryCta}
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" className="rounded-2xl border-primary/20" asChild>
                    <a href="#apply">
                      {local.secondaryCta}
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
            {t.cards.map((card, index) => (
              <motion.div key={card.title} variants={fadeUp} custom={index + 2.5} className="group h-full">
                <Card className="flex h-full flex-col rounded-[1.75rem] border border-border/50 bg-card/85 shadow-lg transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
                  <CardHeader className="space-y-4 p-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
                      <Target className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl font-black leading-snug">{card.title}</CardTitle>
                    <CardDescription className="text-sm leading-7 text-muted-foreground">{card.desc}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
