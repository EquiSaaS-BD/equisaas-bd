import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Coins, Sparkles, TrendingUp, Users, Wallet } from "lucide-react";

import Section from "@/components/landing/Section";
import { fadeUp } from "@/components/landing/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { normalizeLocalizedTree } from "@/lib/localized-copy";
import { cn } from "@/lib/utils";

const TEXT = normalizeLocalizedTree({
  bn: {
    badge: "কো-অপ মিশন সিমুলেটর",
    title: "আপনার অবদান কীভাবে shared profit-এ রূপ নিতে পারে",
    desc:
      "Realistic input বদলে দেখুন revenue, cost, আর active member count পরিবর্তন হলে member-per-share সম্ভাবনা কীভাবে বদলায়।",
    scenarioLabel: "দ্রুত scenario",
    scenarioConservative: "Conservative",
    scenarioBalanced: "Balanced",
    scenarioAggressive: "Aggressive",
    revenue: "মাসিক revenue (BDT)",
    cost: "Operational cost %",
    members: "Active member count",
    demand: "Pre-sales demand confidence",
    gross: "Monthly gross revenue",
    net: "Monthly net profit",
    memberShare: "Per member monthly share",
    yearlyShare: "Per member yearly potential",
    revenueSplit: "Revenue split",
    cta: "ডিপার্টমেন্ট বেছে শুরু করুন",
    helper:
      "এই simulator শিক্ষামূলক। বাস্তব outcome নির্ভর করবে sales execution, delivery quality, আর team performance-এর উপর।",
  },
  en: {
    badge: "Co-op Mission Simulator",
    title: "See how contribution becomes shared profit",
    desc: "Adjust realistic inputs to understand how revenue, cost, and member count change per-member earning potential.",
    scenarioLabel: "Quick scenarios",
    scenarioConservative: "Conservative",
    scenarioBalanced: "Balanced",
    scenarioAggressive: "Aggressive",
    revenue: "Monthly Revenue (BDT)",
    cost: "Operational Cost %",
    members: "Active Member Count",
    demand: "Pre-sales Demand Confidence",
    gross: "Monthly Gross Revenue",
    net: "Monthly Net Profit",
    memberShare: "Per Member Monthly Share",
    yearlyShare: "Per Member Yearly Potential",
    revenueSplit: "Revenue Split",
    cta: "Pick a Department Path",
    helper: "This simulator is educational; actual outcomes depend on real sales execution and team delivery.",
  },
});

const SCENARIOS = {
  conservative: { revenue: 240000, costPercent: 58, members: 16, demand: 45 },
  balanced: { revenue: 420000, costPercent: 45, members: 14, demand: 65 },
  aggressive: { revenue: 760000, costPercent: 38, members: 12, demand: 82 },
};

function formatBDT(value) {
  return new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 }).format(Math.round(value));
}

function StatCard({ icon: Icon, title, value, tone }) {
  return (
    <Card className="h-full overflow-hidden border border-white/10 bg-background/60 shadow-2xl backdrop-blur-xl dark:border-white/5">
      <CardHeader className="space-y-3">
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", tone)}>
          <Icon className="h-5 w-5" />
        </div>
        <CardDescription className="text-muted-foreground">{title}</CardDescription>
        <CardTitle className="text-2xl font-black tracking-tight">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default function MissionEconomicsSimulator({ lang }) {
  const t = TEXT[lang];
  const [revenue, setRevenue] = useState(SCENARIOS.balanced.revenue);
  const [costPercent, setCostPercent] = useState(SCENARIOS.balanced.costPercent);
  const [members, setMembers] = useState(SCENARIOS.balanced.members);
  const [demand, setDemand] = useState(SCENARIOS.balanced.demand);

  const simulation = useMemo(() => {
    const grossRevenue = revenue * (0.85 + demand / 1000);
    const costAmount = grossRevenue * (costPercent / 100);
    const netProfit = Math.max(grossRevenue - costAmount, 0);
    const memberShare = members > 0 ? netProfit / members : 0;
    const yearlyShare = memberShare * 12;
    return {
      grossRevenue,
      costAmount,
      netProfit,
      memberShare,
      yearlyShare,
    };
  }, [revenue, costPercent, members, demand]);

  const costWidth = Math.min(100, Math.max(0, (simulation.costAmount / Math.max(simulation.grossRevenue, 1)) * 100));
  const profitWidth = 100 - costWidth;

  const applyScenario = (key) => {
    const data = SCENARIOS[key];
    setRevenue(data.revenue);
    setCostPercent(data.costPercent);
    setMembers(data.members);
    setDemand(data.demand);
  };

  return (
    <Section id="mission-simulator" className="relative overflow-hidden py-12 md:py-16 lg:py-24">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-8 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-coop/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto space-y-10 px-4 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <motion.div variants={fadeUp} custom={0}>
            <Badge variant="soft" className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              {t.badge}
            </Badge>
          </motion.div>
          <motion.h2 variants={fadeUp} custom={1} className="text-3xl font-black tracking-tight md:text-3xl sm:text-4xl lg:text-5xl">
            {t.title}
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-lg leading-relaxed text-muted-foreground">
            {t.desc}
          </motion.p>
        </div>

        <motion.div variants={fadeUp} custom={3} className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-12">
          <Card className="border border-white/10 bg-background/60 shadow-2xl backdrop-blur-xl dark:border-white/5 lg:col-span-5">
            <CardHeader className="space-y-4">
              <CardTitle className="text-xl font-black">{t.scenarioLabel}</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="rounded-xl" onClick={() => applyScenario("conservative")}>
                  {t.scenarioConservative}
                </Button>
                <Button variant="outline" className="rounded-xl" onClick={() => applyScenario("balanced")}>
                  {t.scenarioBalanced}
                </Button>
                <Button variant="outline" className="rounded-xl" onClick={() => applyScenario("aggressive")}>
                  {t.scenarioAggressive}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <label className="block space-y-2">
                <div className="flex justify-between text-sm font-semibold">
                  <span>{t.revenue}</span>
                  <span>{formatBDT(revenue)}</span>
                </div>
                <input
                  type="range"
                  min="100000"
                  max="1200000"
                  step="10000"
                  value={revenue}
                  onChange={(event) => setRevenue(Number(event.target.value))}
                  className="slider-brand w-full"
                />
              </label>

              <label className="block space-y-2">
                <div className="flex justify-between text-sm font-semibold">
                  <span>{t.cost}</span>
                  <span>{costPercent}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="75"
                  step="1"
                  value={costPercent}
                  onChange={(event) => setCostPercent(Number(event.target.value))}
                  className="slider-brand w-full"
                />
              </label>

              <label className="block space-y-2">
                <div className="flex justify-between text-sm font-semibold">
                  <span>{t.members}</span>
                  <span>{members}</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="40"
                  step="1"
                  value={members}
                  onChange={(event) => setMembers(Number(event.target.value))}
                  className="slider-brand w-full"
                />
              </label>

              <label className="block space-y-2">
                <div className="flex justify-between text-sm font-semibold">
                  <span>{t.demand}</span>
                  <span>{demand}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="95"
                  step="1"
                  value={demand}
                  onChange={(event) => setDemand(Number(event.target.value))}
                  className="slider-brand w-full"
                />
              </label>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            <motion.div layout>
              <StatCard
                icon={TrendingUp}
                title={t.gross}
                value={`BDT ${formatBDT(simulation.grossRevenue)}`}
                tone="bg-primary/10 text-primary"
              />
            </motion.div>
            <motion.div layout>
              <StatCard
                icon={Wallet}
                title={t.net}
                value={`BDT ${formatBDT(simulation.netProfit)}`}
                tone="bg-coop/10 text-coop"
              />
            </motion.div>
            <motion.div layout>
              <StatCard
                icon={Users}
                title={t.memberShare}
                value={`BDT ${formatBDT(simulation.memberShare)}`}
                tone="bg-amber-500/10 text-amber-500"
              />
            </motion.div>
            <motion.div layout>
              <StatCard
                icon={Coins}
                title={t.yearlyShare}
                value={`BDT ${formatBDT(simulation.yearlyShare)}`}
                tone="bg-blue-500/10 text-blue-500"
              />
            </motion.div>

            <Card className="border border-white/10 bg-background/60 shadow-2xl backdrop-blur-xl dark:border-white/5 sm:col-span-2">
              <CardHeader className="space-y-3">
                <CardTitle className="text-lg font-black">{t.revenueSplit}</CardTitle>
                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full bg-gradient-to-r from-rose-500 to-amber-500"
                    animate={{ width: `${costWidth}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                    animate={{ width: `${profitWidth}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </div>
                <CardDescription className="text-muted-foreground">{t.helper}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="border-0 bg-gradient-to-br from-primary via-[#1e40af] to-coop shadow-lg">
                  <a href="#departments">{t.cta}</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
