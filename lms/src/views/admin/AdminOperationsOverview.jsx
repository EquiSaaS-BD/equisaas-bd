import React, { useMemo } from "react";
import { Activity, BarChart3, BookOpenCheck, GitPullRequest, ShieldCheck, Sparkles } from "lucide-react";
import { PATHS } from "@/data/structure.mjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useGovernanceData from "@/hooks/useGovernanceData";
import { useLms } from "@/lms-context";
import { buildTaskLookup, buildUnifiedWorkstreamData, toMillis } from "@/lib/workstreams";

const MEMBER_AUDIT_ACTIONS = new Set(["assignment.attestation", "learning.path-open", "session.login"]);

const formatDayKey = (date) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

const buildLastSevenDays = () => {
  const days = [];
  const now = new Date();
  for (let offset = 6; offset >= 0; offset -= 1) {
    const current = new Date(now);
    current.setDate(now.getDate() - offset);
    days.push({
      key: formatDayKey(current),
      label: current.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    });
  }
  return days;
};

const createBucketMap = (days) => Object.fromEntries(days.map((day) => [day.key, new Set()]));
const getActorId = (...values) => values.find((value) => typeof value === "string" ? value.trim() : Boolean(value)) || "";

const addActorToBucket = (buckets, timestampValue, actorId) => {
  const key = formatDayKey(new Date(toMillis(timestampValue) || Date.now()));
  if (!buckets[key] || !actorId) return;
  buckets[key].add(String(actorId));
};

const AdminOperationsOverview = ({ assignmentSubmissions = [], auditEntries = [], contributions = [], lang, reviewQueueItems = [], roadmapItems = [], trustSignals = [] }) => {
  const { isAdmin: claimsAdmin, profile, user } = useLms();
  const governance = useGovernanceData({ user, profile, claimsAdmin, lang, active: true });
  const lastSevenDays = useMemo(() => buildLastSevenDays(), []);
  const taskLookup = useMemo(() => buildTaskLookup(governance.departmentTasks), [governance.departmentTasks]);
  const unifiedWorkstreams = useMemo(
    () =>
      buildUnifiedWorkstreamData({
        assignmentSubmissions,
        legacyReviewQueueItems: reviewQueueItems,
        taskSubmissions: governance.taskSubmissions,
        taskReviewQueue: governance.reviewableTaskQueue,
        taskLookup,
      }),
    [assignmentSubmissions, governance.reviewableTaskQueue, governance.taskSubmissions, reviewQueueItems, taskLookup],
  );

  const dailyMemberPulse = useMemo(() => {
    const loginBuckets = createBucketMap(lastSevenDays);
    const derivedBuckets = createBucketMap(lastSevenDays);

    auditEntries
      .filter((entry) => entry?.action === "session.login")
      .forEach((entry) => {
        addActorToBucket(loginBuckets, entry.createdAt, getActorId(entry.actorUid, entry?.meta?.uid, entry.id));
      });

    contributions.forEach((entry) => {
      addActorToBucket(derivedBuckets, entry?.createdAt, getActorId(entry?.uid, entry?.createdBy, entry?.id));
    });

    unifiedWorkstreams.submissions.forEach((entry) => {
      addActorToBucket(derivedBuckets, entry?.submittedAt || entry?.createdAt, getActorId(entry?.uid, entry?.memberName, entry?.id));
      addActorToBucket(derivedBuckets, entry?.reviewedAt, getActorId(entry?.latestReviewerUid, entry?.latestReviewerName));
    });

    unifiedWorkstreams.reviewQueue.forEach((entry) => {
      (entry?.attestationPreview || []).forEach((attestation) => {
        addActorToBucket(derivedBuckets, attestation?.createdAt, getActorId(attestation?.uid, attestation?.userName, attestation?.id));
      });
      addActorToBucket(derivedBuckets, entry?.updatedAt, getActorId(entry?.latestReviewerUid, entry?.latestReviewerName));
    });

    return lastSevenDays.map((day) => {
      const combined = new Set([...(loginBuckets[day.key] || []), ...(derivedBuckets[day.key] || [])]);
      return {
        key: day.key,
        label: day.label,
        count: combined.size,
        loginCount: loginBuckets[day.key]?.size || 0,
        derivedCount: derivedBuckets[day.key]?.size || 0,
      };
    });
  }, [auditEntries, contributions, lastSevenDays, unifiedWorkstreams.reviewQueue, unifiedWorkstreams.submissions]);

  const pathActivity = useMemo(() => {
    const pathMap = new Map(
      PATHS.map((pathItem) => [
        pathItem.id,
        {
          pathId: pathItem.id,
          titleEn: pathItem.titleEn,
          titleBn: pathItem.titleBn,
          pathOpenSignals: 0,
          reviewQueue: 0,
          submissions: 0,
          submitterIds: new Set(),
        },
      ]),
    );

    auditEntries
      .filter((entry) => entry?.action === "learning.path-open")
      .forEach((entry) => {
        const pathId = entry?.meta?.pathId;
        if (!pathMap.has(pathId)) return;
        pathMap.get(pathId).pathOpenSignals += 1;
      });

    unifiedWorkstreams.submissions.forEach((entry) => {
      const pathId = entry?.pathId;
      if (!pathMap.has(pathId)) return;
      const bucket = pathMap.get(pathId);
      bucket.submissions += 1;
      const actorId = getActorId(entry?.uid, entry?.memberName, entry?.createdBy, entry?.id);
      if (actorId) bucket.submitterIds.add(actorId);
    });

    unifiedWorkstreams.reviewQueue.forEach((entry) => {
      const pathId = entry?.pathId;
      if (!pathMap.has(pathId)) return;
      pathMap.get(pathId).reviewQueue += 1;
    });

    return Array.from(pathMap.values())
      .map((entry) => ({
        ...entry,
        uniqueSubmitters: entry.submitterIds.size,
        momentum: entry.pathOpenSignals * 2 + entry.submissions * 2 + entry.reviewQueue,
      }))
      .filter((entry) => entry.momentum > 0)
      .sort((a, b) => b.momentum - a.momentum)
      .slice(0, 8);
  }, [auditEntries, unifiedWorkstreams.reviewQueue, unifiedWorkstreams.submissions]);

  const adminActionEntries = useMemo(
    () => auditEntries.filter((entry) => entry?.action && !MEMBER_AUDIT_ACTIONS.has(entry.action)),
    [auditEntries],
  );

  const todayPulseCount = dailyMemberPulse.at(-1)?.count || 0;
  const pendingWorkReviews = unifiedWorkstreams.summary.pendingReview;
  const readyForManagement = unifiedWorkstreams.summary.readyForManager;
  const activePathCount = pathActivity.length;
  const trustTotal = trustSignals.reduce((sum, item) => sum + Number(item.score || 0), 0);
  const contributionVelocity = contributions.filter((item) => toMillis(item?.createdAt) >= Date.now() - 1000 * 60 * 60 * 24 * 7).length;
  const maxPulseCount = Math.max(1, ...dailyMemberPulse.map((item) => item.count));
  const maxMomentum = Math.max(1, ...pathActivity.map((item) => item.momentum));

  const statCards = [
    {
      id: "pulse",
      label: lang === "bn" ? "আজকের মেম্বার পালস" : "Member pulse today",
      value: todayPulseCount,
      icon: Activity,
      accent: "text-sky-600",
      surface: "bg-sky-500/10",
      hint: lang === "bn" ? "লগইন + অ্যাক্টিভিটি ব্যাকফিল" : "login + activity backfill",
    },
    {
      id: "paths",
      label: lang === "bn" ? "সক্রিয় পাথ" : "Active paths",
      value: activePathCount,
      icon: BookOpenCheck,
      accent: "text-emerald-600",
      surface: "bg-emerald-500/10",
      hint: lang === "bn" ? "ওপেন + সাবমিশন + রিভিউ" : "opens + submissions + review",
    },
    {
      id: "peer",
      label: lang === "bn" ? "ওয়ার্ক রিভিউ কিউ" : "Work review queue",
      value: pendingWorkReviews,
      icon: GitPullRequest,
      accent: "text-amber-600",
      surface: "bg-amber-500/10",
      hint: lang === "bn" ? "লেগ্যাসি + টাস্ক সাবমিশন" : "legacy + task submissions",
    },
    {
      id: "admin",
      label: lang === "bn" ? "ম্যানেজমেন্ট রেডি" : "Ready for management",
      value: readyForManagement,
      icon: ShieldCheck,
      accent: "text-violet-600",
      surface: "bg-violet-500/10",
      hint: lang === "bn" ? "ম্যানেজার / অ্যাডমিন অ্যাকশন" : "manager / admin action",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.id} className="border-none bg-background/50 shadow-premium backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.24em] text-muted-foreground">{card.label}</div>
                  <div className="mt-3 text-3xl font-black tracking-tight">{card.value}</div>
                  <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{card.hint}</div>
                </div>
                <div className={`rounded-2xl p-3 ${card.surface}`}>
                  <card.icon className={`h-5 w-5 ${card.accent}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr,1fr]">
        <Card className="border-none bg-background/50 shadow-premium backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-black">
              <BarChart3 className="h-5 w-5 text-primary" />
              {lang === "bn" ? "ডেইলি মেম্বার পালস" : "Daily Member Pulse"}
            </CardTitle>
            <CardDescription>
              {lang === "bn"
                ? "login telemetry-এর সাথে contribution, লেগ্যাসি assignment, আর department task activity মিশিয়ে গত ৭ দিনের real member movement দেখানো হচ্ছে।"
                : "Shows the last 7 days of real member movement by combining login telemetry with contributions, legacy assignments, and department-task activity."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-3">
              {dailyMemberPulse.map((item) => {
                const percent = Math.round((item.count / maxPulseCount) * 100);
                return (
                  <div key={item.key} className="flex flex-col items-center gap-3 rounded-2xl border border-muted/20 bg-card/40 px-3 py-4">
                    <div className="text-lg font-black">{item.count}</div>
                    <div className="flex h-28 w-full items-end rounded-xl bg-muted/40 p-2">
                      <div className="w-full rounded-lg bg-primary shadow-lg shadow-primary/20" style={{ height: `${Math.max(10, percent)}%` }} />
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{item.label}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {lang === "bn" ? `লগইন ${item.loginCount} · অ্যাক্টিভিটি ${item.derivedCount}` : `logins ${item.loginCount} · derived ${item.derivedCount}`}
                    </div>
                  </div>
                );
              })}
            </div>
            {!dailyMemberPulse.some((item) => item.count > 0) && (
              <div className="mt-4 rounded-2xl border border-dashed border-muted/40 bg-muted/20 px-4 py-4 text-sm text-muted-foreground">
                {lang === "bn"
                  ? "গত ৭ দিনে এখনো কোনো member activity পাওয়া যায়নি। login, contribution, submission, বা peer review এলে chart এখানে দেখাবে।"
                  : "No member activity was found in the last 7 days yet. New logins, contributions, submissions, or peer reviews will appear here automatically."}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none bg-background/50 shadow-premium backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-black">
              <Sparkles className="h-5 w-5 text-primary" />
              {lang === "bn" ? "অপারেশন সিগনাল" : "Operations Signals"}
            </CardTitle>
            <CardDescription>
              {lang === "bn" ? "কো-অপ throughput, trust, আর governance load-এর quick read।" : "A quick read on co-op throughput, trust, and governance load."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm font-bold">
                <span>{lang === "bn" ? "গত ৭ দিনের contribution velocity" : "7-day contribution velocity"}</span>
                <span>{contributionVelocity}</span>
              </div>
              <Progress value={Math.min(100, contributionVelocity * 10)} />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm font-bold">
                <span>{lang === "bn" ? "ট্রাস্ট স্কোর লেজার" : "Trust score ledger"}</span>
                <span>{trustTotal}</span>
              </div>
              <Progress value={Math.min(100, Math.round(trustTotal / 10))} />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm font-bold">
                <span>{lang === "bn" ? "অ্যাডমিন অ্যাকশন স্ট্রিম" : "Admin action stream"}</span>
                <span>{adminActionEntries.length}</span>
              </div>
              <Progress value={Math.min(100, adminActionEntries.length * 6)} />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm font-bold">
                <span>{lang === "bn" ? "রোডম্যাপ ইনিশিয়েটিভ" : "Roadmap initiatives"}</span>
                <span>{roadmapItems.length}</span>
              </div>
              <Progress value={Math.min(100, roadmapItems.length * 8)} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none bg-background/50 shadow-premium backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-black">
            <BookOpenCheck className="h-5 w-5 text-primary" />
            {lang === "bn" ? "অ্যাকটিভ পাথ মোমেন্টাম" : "Active Path Momentum"}
          </CardTitle>
            <CardDescription>
              {lang === "bn"
                ? "path open signal, লেগ্যাসি assignment submission, আর task review pressure মিলিয়ে কোন track-এ সবচেয়ে বেশি গতি আছে তা দেখুন।"
                : "See which tracks are moving fastest by combining path opens, legacy assignment submissions, and task review pressure."}
            </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {pathActivity.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{lang === "bn" ? "পাথ" : "Path"}</TableHead>
                  <TableHead>{lang === "bn" ? "ওপেন সিগনাল" : "Open signals"}</TableHead>
                  <TableHead>{lang === "bn" ? "সাবমিশন" : "Submissions"}</TableHead>
                  <TableHead>{lang === "bn" ? "রিভিউ কিউ" : "Review queue"}</TableHead>
                  <TableHead>{lang === "bn" ? "মোমেন্টাম" : "Momentum"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pathActivity.map((item) => (
                  <TableRow key={item.pathId}>
                    <TableCell className="min-w-[220px]">
                      <div className="font-bold text-foreground">{lang === "bn" ? item.titleBn || item.titleEn : item.titleEn || item.titleBn}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{item.pathId}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {lang === "bn" ? `${item.uniqueSubmitters} জন সক্রিয় সাবমিটার` : `${item.uniqueSubmitters} active submitters`}
                      </div>
                    </TableCell>
                    <TableCell className="font-bold">{item.pathOpenSignals}</TableCell>
                    <TableCell className="font-bold">{item.submissions}</TableCell>
                    <TableCell className="font-bold">{item.reviewQueue}</TableCell>
                    <TableCell className="min-w-[220px]">
                      <div className="mb-2 flex items-center justify-between text-xs font-bold text-muted-foreground">
                        <span>{item.momentum}</span>
                        <span>{Math.round((item.momentum / maxMomentum) * 100)}%</span>
                      </div>
                      <Progress value={Math.round((item.momentum / maxMomentum) * 100)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="px-6 py-16 text-center text-sm font-semibold text-muted-foreground">
              {lang === "bn"
                ? "সাম্প্রতিক path open, submission, বা review data এলে এই momentum table এখানে স্বয়ংক্রিয়ভাবে দেখাবে।"
                : "This momentum table will populate automatically once recent path opens, submissions, or reviews are available."}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOperationsOverview;
