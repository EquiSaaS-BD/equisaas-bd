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
    title: "আপনার অবদান কিভাবে শেয়ার্ড প্রফিটে রূপ নেয়",
    desc: "রিয়েলিস্টিক ইনপুট দিয়ে দেখুন, রাজস্ব/খরচ/সদস্য সংখ্যা বদলালে সদস্যপ্রতি আয় কিভাবে পরিবর্তিত হয়।",
    scenarioLabel: "দ্রুত সিনারিও",
    scenarioConservative: "Conservative",
    scenarioBalanced: "Balanced",
    scenarioAggressive: "Aggressive",
    revenue: "মাসিক রেভিনিউ (BDT)",
    cost: "অপারেশন কস্ট %",
    members: "অ্যাক্টিভ সদস্য সংখ্যা",
    demand: "প্রি-সেল ডিমান্ড কনফিডেন্স",
    gross: "মাসিক গ্রস রেভিনিউ",
    net: "মাসিক নেট প্রফিট",
    memberShare: "সদস্যপ্রতি মাসিক শেয়ার",
    yearlyShare: "সদস্যপ্রতি বার্ষিক সম্ভাব্য শেয়ার",
    revenueSplit: "রেভিনিউ স্প্লিট",
    cta: "ডিপার্টমেন্ট বেছে শুরু করুন",
    helper: "এই সিমুলেটরটি শিক্ষামূলক; আসল সংখ্যা টিমের বাস্তব পারফরম্যান্স ও সেলসের উপর নির্ভর করবে।",
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
    <Card className="border-0 bg-background/60 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-2xl overflow-hidden h-full">
      <CardHeader className="space-y-3">
        <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center", tone)}>
          <Icon className="h-5 w-5" />
        </div>
        <CardDescription className="text-muted-foreground">{title}</CardDescription>
        <CardTitle className="text-2xl font-black tracking-tight">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default function MissionSimulator({ lang }) {
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

  function applyScenario(key) {
    const data = SCENARIOS[key];
    setRevenue(data.revenue);
    setCostPercent(data.costPercent);
    setMembers(data.members);
    setDemand(data.demand);
  }

  return (
    <Section id="mission-simulator" className="py-12 md:py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-8 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-coop/10 blur-3xl" />
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

        <motion.div variants={fadeUp} custom={3} className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-5 border-0 bg-background/60 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-2xl">
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

          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            <motion.div layout>
              <StatCard
                icon={TrendingUp}
                title={t.gross}
                value={`৳ ${formatBDT(simulation.grossRevenue)}`}
                tone="bg-primary/10 text-primary"
              />
            </motion.div>
            <motion.div layout>
              <StatCard
                icon={Wallet}
                title={t.net}
                value={`৳ ${formatBDT(simulation.netProfit)}`}
                tone="bg-coop/10 text-coop"
              />
            </motion.div>
            <motion.div layout>
              <StatCard
                icon={Users}
                title={t.memberShare}
                value={`৳ ${formatBDT(simulation.memberShare)}`}
                tone="bg-amber-500/10 text-amber-500"
              />
            </motion.div>
            <motion.div layout>
              <StatCard
                icon={Coins}
                title={t.yearlyShare}
                value={`৳ ${formatBDT(simulation.yearlyShare)}`}
                tone="bg-blue-500/10 text-blue-500"
              />
            </motion.div>

            <Card className="sm:col-span-2 border-0 bg-background/60 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-2xl">
              <CardHeader className="space-y-3">
                <CardTitle className="text-lg font-black">{t.revenueSplit}</CardTitle>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-rose-500 to-amber-500"
                    animate={{ width: `${costWidth}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                    animate={{ width: `${profitWidth}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </div>
                <CardDescription className="text-muted-foreground">{t.helper}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="bg-gradient-to-br from-primary via-[#1e40af] to-coop border border-white/20 shadow-lg border-0">
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
