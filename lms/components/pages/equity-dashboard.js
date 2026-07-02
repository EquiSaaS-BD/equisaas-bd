"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, Calculator, Gem, Handshake, ShieldCheck, Sparkles, Trophy, Vote } from "lucide-react";
import { WorkspaceBreadcrumbs } from "@/components/layout/workspace-breadcrumbs";
import { WorkspacePageHeader } from "@/components/layout/workspace-page-header";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime } from "@/lib/date";
import { fetchCoBuilderEquitySnapshot } from "@/lib/firestore/equity";
import { fetchUserLedger } from "@/lib/firestore/lms";
import { cn } from "@/lib/utils";

function localizeMilestone(copy, milestone) {
  return {
    title: copy(milestone?.title || "", milestone?.titleBn || milestone?.title || ""),
    description: copy(milestone?.description || "", milestone?.descriptionBn || milestone?.description || ""),
  };
}

function MetricCard({ title, value, description, icon: Icon, tone = "primary" }) {
  const toneClass = {
    primary: "bg-primary/10 text-primary",
    blue: "bg-secondary/10 text-secondary",
    gold: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    success: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  }[tone] || "bg-primary/10 text-primary";

  return (
    <Card className="hover-lift rounded-[1.75rem]">
      <CardContent className="flex items-start gap-4 p-5">
        <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl", toneClass)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-black tracking-tight tabular-nums">{value}</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function MilestoneCard({ milestone }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.6rem] border p-5 transition-all duration-300",
        milestone.completed
          ? "border-primary/25 bg-primary/8 shadow-sm shadow-primary/10"
          : "border-border/60 bg-background/70",
      )}
    >
      {milestone.current ? <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary" /> : null}
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
            milestone.completed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
          )}
        >
          {milestone.completed ? <BadgeCheck className="h-5 w-5" /> : <Gem className="h-5 w-5" />}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold tracking-tight">{milestone.title}</h3>
            {milestone.current ? <Badge variant="subtle">{milestone.currentLabel}</Badge> : null}
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{milestone.description}</p>
          <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            {milestone.unitsRequired} SEU
          </p>
        </div>
      </div>
    </div>
  );
}

export function EquityDashboard() {
  const { user, profile } = useAuth();
  const { copy } = useLocale();
  const [snapshot, setSnapshot] = useState(null);
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!user?.uid) {
        if (active) setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const nextLedgerEntries = await fetchUserLedger(user.uid, 20);
        const nextSnapshot = await fetchCoBuilderEquitySnapshot({
          profile,
          ledgerEntries: nextLedgerEntries,
        });

        if (!active) return;
        setLedgerEntries(nextLedgerEntries);
        setSnapshot(nextSnapshot);
      } catch {
        if (!active) return;
        const nextSnapshot = await fetchCoBuilderEquitySnapshot({ profile, ledgerEntries: [] });
        setLedgerEntries([]);
        setSnapshot(nextSnapshot);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [profile, user?.uid]);

  const localizedCurrentMilestone = useMemo(
    () => localizeMilestone(copy, snapshot?.currentMilestone),
    [copy, snapshot?.currentMilestone],
  );
  const localizedNextMilestone = useMemo(
    () => localizeMilestone(copy, snapshot?.nextMilestone),
    [copy, snapshot?.nextMilestone],
  );

  const milestones = useMemo(
    () =>
      (snapshot?.milestones || []).map((milestone) => ({
        ...milestone,
        ...localizeMilestone(copy, milestone),
        currentLabel: copy("Current", "বর্তমান"),
      })),
    [copy, snapshot?.milestones],
  );

  const [projectionUnits, setProjectionUnits] = useState(0);

  const projectedShare = useMemo(() => {
    const currentUnits = snapshot?.sweatEquityUnits || 0;
    const totalPoolEstimate = (snapshot?.totalContributorUnits || 1) + projectionUnits;
    const share = ((currentUnits + projectionUnits) / (totalPoolEstimate || 1)) * 70;
    return Number(share.toFixed(3));
  }, [projectionUnits, snapshot?.sweatEquityUnits, snapshot?.totalContributorUnits]);

  const trail = [
    { href: "/dashboard", en: "Dashboard", bn: "ড্যাশবোর্ড" },
    { href: null, en: "My Share", bn: "আমার শেয়ার" },
  ];

  if (loading) {
    return (
      <div className="workspace-stack">
        <WorkspaceBreadcrumbs items={trail} />
        <Skeleton className="h-72 rounded-[2rem]" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Skeleton className="h-36 rounded-[1.75rem]" />
          <Skeleton className="h-36 rounded-[1.75rem]" />
          <Skeleton className="h-36 rounded-[1.75rem]" />
          <Skeleton className="h-36 rounded-[1.75rem]" />
        </div>
      </div>
    );
  }

  return (
    <div className="workspace-stack">
      <WorkspaceBreadcrumbs items={trail} />
      <WorkspacePageHeader
        badge={copy("Sweat Equity Dashboard", "Sweat Equity ড্যাশবোর্ড")}
        title={copy("My Share: your ownership journey", "আমার শেয়ার: আপনার মালিকানা যাত্রা")}
        description={copy(
          "Approved proof-backed work becomes Sweat Equity Units. This dashboard translates your contribution record into clear ownership milestones for the cooperative journey.",
          "Approved proof-backed কাজ Sweat Equity Unit-এ রূপ নেয়। এই dashboard আপনার contribution record-কে cooperative journey-এর পরিষ্কার ownership milestone-এ দেখায়।",
        )}
        stats={[
          {
            label: copy("Sweat Equity Units", "Sweat Equity Unit"),
            value: snapshot?.sweatEquityUnits || 0,
            note: copy("Based on approved ledger-backed contribution.", "Approved ledger-backed contribution-এর উপর ভিত্তি করে।"),
          },
          {
            label: copy("Estimated share signal", "Estimated share signal"),
            value: `${snapshot?.estimatedSharePercent || 0}%`,
            note: copy("Planning indicator, not a legal certificate yet.", "Planning indicator, এখনো legal certificate নয়।"),
          },
          {
            label: copy("Current milestone", "বর্তমান milestone"),
            value: localizedCurrentMilestone.title || copy("Observer", "Observer"),
            note: localizedNextMilestone.title
              ? copy(`Next: ${localizedNextMilestone.title}`, `পরবর্তী: ${localizedNextMilestone.title}`)
              : copy("All current milestones completed.", "বর্তমান সব milestone সম্পন্ন।"),
          },
        ]}
        actions={(
          <div className="workspace-pane space-y-3 p-4">
            <p className="text-sm leading-6 text-muted-foreground">
              {copy(
                "Ownership alignment becomes final only through cooperative governance, legal structure, and documented product contribution.",
                "Ownership alignment final হবে শুধু cooperative governance, legal structure, এবং documented product contribution-এর মাধ্যমে।",
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm">
                <Link href="/task">
                  {copy("Submit proof", "প্রুফ জমা দিন")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/governance">
                  {copy("Open governance", "গভর্ন্যান্স খুলুন")}
                </Link>
              </Button>
            </div>
          </div>
        )}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_auto] xl:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="hover-lift overflow-hidden rounded-[2.5rem] border-primary/15 bg-gradient-to-br from-background via-primary/[0.02] to-primary/[0.08] shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Gem className="h-5 w-5" />
              </div>
              <CardTitle className="mt-4 text-xl font-black tracking-tight">{copy("My Share Signal", "আমার শেয়ার সিগন্যাল")}</CardTitle>
              <CardDescription className="text-sm font-medium">
                {copy("Mock equity signal based on your SEU.", "আপনার SEU-র উপর ভিত্তি করে mock equity signal।")}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6 pb-8 pt-2">
              <div className="relative flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="h-48 w-48 drop-shadow-2xl">
                  <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="24" />
                  <circle cx="100" cy="100" r="70" fill="none" stroke="#0d9488" strokeWidth="24" strokeDasharray="307.88 439.82" strokeDashoffset="0" transform="rotate(-90 100 100)" />
                  <circle cx="100" cy="100" r="70" fill="none" stroke="#10b981" strokeWidth="24" strokeDasharray="87.96 439.82" strokeDashoffset="-307.88" transform="rotate(-90 100 100)" />
                  <circle cx="100" cy="100" r="70" fill="none" stroke="#f59e0b" strokeWidth="24" strokeDasharray="43.98 439.82" strokeDashoffset="-395.84" transform="rotate(-90 100 100)" />
                  <text x="100" y="96" textAnchor="middle" fill="currentColor" style={{ fontSize: "18px", fontWeight: 900 }}>{projectionUnits > 0 ? projectedShare : snapshot?.estimatedSharePercent || 0}%</text>
                  <text x="100" y="114" textAnchor="middle" fill="currentColor" style={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.12em", opacity: 0.6 }}>{projectionUnits > 0 ? copy("PROJECTED", "প্রক্ষিপ্ত") : copy("OWNERSHIP", "মালিকানা")}</text>
                </svg>
              </div>
              <div className="flex w-full flex-col gap-2 text-[10px] font-black uppercase tracking-widest">
                <div className="flex items-center justify-between rounded-2xl border border-primary/10 bg-background/60 px-4 py-3 shadow-sm backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#0d9488] shadow-[0_0_8px_rgba(13,148,136,0.4)]" />
                    <span className="text-muted-foreground">70% Contributors</span>
                  </div>
                  <span className="text-primary">{projectionUnits > 0 ? projectedShare : snapshot?.estimatedSharePercent || 0}% Yours</span>
                </div>
                
                {/* Psychological UX: Loss Aversion & Endowment Effect */}
                <div className="mt-2 flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2.5 text-[11px] leading-5 font-semibold text-amber-700 dark:text-amber-400">
                  <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
                  <p className="normal-case tracking-normal">
                    {copy(
                      "These projected shares are conceptually yours. Maintain an active contribution status and comply with governance to prevent forfeiture.",
                      "এই প্রক্ষিপ্ত শেয়ারগুলো আপনার অর্জন। forfeiture (বাজেয়াপ্ত) এড়াতে সক্রিয় থাকুন এবং গভর্ন্যান্স মেনে চলুন।"
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            <MetricCard
              title={copy("Sweat Equity Units", "Sweat Equity Unit")}
              value={snapshot?.sweatEquityUnits || 0}
              description={copy("Approved points as units.", "Approved points Unit হিসেবে।")}
              icon={Trophy}
              tone="primary"
            />
            <Card className="glass-elite overflow-hidden rounded-[2rem] border-primary/20 shadow-xl">
              <CardHeader className="pb-3 pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Calculator className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-sm font-bold uppercase tracking-wider">{copy("Ownership Projection", "মালিকানা প্রক্ষেপণ")}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pb-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
                    <span className="text-muted-foreground">{copy("Add future SEU", "ভবিষ্যত SEU যোগ করুন")}</span>
                    <span className="text-primary">+{projectionUnits}</span>
                  </div>
                  <Slider
                    defaultValue={[0]}
                    max={2500}
                    step={10}
                    value={[projectionUnits]}
                    onValueChange={([val]) => setProjectionUnits(val)}
                    className="py-1"
                  />
                </div>
                <div className="rounded-xl bg-primary/5 p-3 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary/80">
                    {copy("Projected Total ownership", "মোট প্রক্ষিপ্ত মালিকানা")}
                  </p>
                  <p className="mt-1 text-2xl font-black text-primary">{projectedShare}%</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="rounded-[2.5rem] border-primary/5 shadow-inner">
          <CardHeader className="pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="subtle" className="rounded-full px-3 py-1">{copy("Milestone tracker", "Milestone tracker")}</Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1 font-black">{`${Math.round(snapshot?.milestoneProgress || 0)}%`}</Badge>
            </div>
            <CardTitle className="mt-3 text-xl font-black">{copy("From proof to ownership", "Proof থেকে মালিকানা")}</CardTitle>
            <CardDescription className="text-sm font-medium">
              {localizedNextMilestone.title
                ? copy(
                    `Next goal: ${localizedNextMilestone.title}.`,
                    `পরবর্তী লক্ষ্য: ${localizedNextMilestone.title}।`,
                  )
                : copy("All milestones completed.", "সব milestone সম্পন্ন।")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="h-3 overflow-hidden rounded-full bg-muted/50 p-0.5 shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-primary shadow-[0_0_12px_rgba(var(--primary),0.3)] transition-all duration-700 ease-out"
                style={{ width: `${snapshot?.milestoneProgress || 0}%` }}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {milestones.slice(0, 4).map((milestone) => <MilestoneCard key={milestone.id} milestone={milestone} />)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <Card className="rounded-[2rem]">
          <CardHeader>
            <CardTitle>{copy("Recent contribution record", "সাম্প্রতিক contribution record")}</CardTitle>
            <CardDescription>
              {copy(
                "These records feed your Sweat Equity Units. Keep every contribution proof-based and reviewable.",
                "এই recordগুলো আপনার Sweat Equity Unit-এ যোগ হয়। প্রতিটি contribution proof-based এবং reviewable রাখুন।",
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {ledgerEntries.length ? ledgerEntries.slice(0, 6).map((entry) => (
              <div key={entry.id} className="workspace-pane flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">{entry.note || copy("Approved contribution", "Approved contribution")}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">{formatDateTime(entry.createdAt)}</p>
                </div>
                <Badge variant={entry.direction === "debit" ? "danger" : "success"}>
                  {entry.direction === "debit" ? "-" : "+"}
                  {entry.points || 0} SEU
                </Badge>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">
                {copy("No approved contribution records yet. Start with a proof task.", "এখনও approved contribution record নেই। একটি proof task দিয়ে শুরু করুন।")}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-[2rem]">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Handshake className="h-6 w-6" />
            </div>
            <CardTitle>{copy("Cooperative note", "Cooperative note")}</CardTitle>
            <CardDescription className="text-base leading-7">
              {copy(
                "This screen intentionally shifts the mental model from gamified points to transparent co-builder ownership progress.",
                "এই screen ইচ্ছাকৃতভাবে gamified points থেকে transparent co-builder ownership progress mental model-এ নিয়ে যায়।",
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="workspace-pane p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-5 w-5 text-amber-500" />
                <p className="text-sm leading-6 text-muted-foreground">
                  {copy(
                    "Final equity percentages should be approved through legal agreements and the cooperative governance process.",
                    "Final equity percentage legal agreement এবং cooperative governance process-এর মাধ্যমে approve হওয়া উচিত।",
                  )}
                </p>
              </div>
            </div>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/points">
                {copy("Open raw ledger", "Raw ledger খুলুন")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
