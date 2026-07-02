"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Medal, Trophy, Users } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDepartmentTitle } from "@/lib/catalog";
import { formatDate, formatDateTime } from "@/lib/date";
import { cn } from "@/lib/utils";

const rankLabels = {
  1: { badge: "Top 1", tone: "success", avatarRing: "ring-2 ring-gold", iconClass: "text-gold dark:text-gold" },
  2: { badge: "Top 2", tone: "secondary", avatarRing: "ring-2 ring-slate-400", iconClass: "text-slate-500 dark:text-slate-300" },
  3: { badge: "Top 3", tone: "warning", avatarRing: "ring-2 ring-amber-500", iconClass: "text-amber-600 dark:text-amber-400" },
};

const getInitials = (value) =>
  String(value || "")
    .split(" ")
    .map((item) => item.trim()[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase() || "EQ";

const getEntryScore = (entry, scoreField) => Number(entry?.score ?? entry?.[scoreField] ?? 0);

const getPeriodMeta = ({ periodType, leaderboard, departmentTitle, copy }) => {
  if (periodType === "monthly") {
    const monthDate = leaderboard?.monthStartsAt?.toDate ? leaderboard.monthStartsAt.toDate() : leaderboard?.monthStartsAt;
    const monthLabel = monthDate
      ? new Date(monthDate).toLocaleDateString(undefined, { month: "long", year: "numeric" })
      : copy("This month", "এই মাস");

    return {
      scoreField: "monthlyPoints",
      title: copy("Monthly learners leaderboard", "মাসিক শিক্ষার্থী লিডারবোর্ড"),
      scoreLabel: copy("Monthly points", "মাসিক পয়েন্ট"),
      description: copy(
        `Approved learner records inside ${departmentTitle} are ranked here for ${monthLabel}.`,
        `${departmentTitle}-এর approved learner record ${monthLabel} অনুযায়ী এখানে র‌্যাঙ্ক করা হয়।`,
      ),
      emptyMessage: copy(
        "No approved learner credits have landed for this department yet this month.",
        "এই মাসে এখনো এই ডিপার্টমেন্টে কোনো approved learner credit যোগ হয়নি।",
      ),
    };
  }

  if (periodType === "overall") {
    return {
      scoreField: "overallPoints",
      title: copy("Overall learners leaderboard", "সার্বিক শিক্ষার্থী লিডারবোর্ড"),
      scoreLabel: copy("Overall points", "সার্বিক পয়েন্ট"),
      description: copy(
        `All approved learner records inside ${departmentTitle} are accumulated here from day one.`,
        `${departmentTitle}-এর approved learner record শুরু থেকেই এখানে জমা হয়।`,
      ),
      emptyMessage: copy(
        "No approved learner credits have landed for this department yet.",
        "এখনো এই ডিপার্টমেন্টে কোনো approved learner credit যোগ হয়নি।",
      ),
    };
  }

  const weekStartsAt = leaderboard?.weekStartsAt || null;
  const weekLabel = weekStartsAt ? formatDate(weekStartsAt) : copy("This week", "এই সপ্তাহ");

  return {
    scoreField: "weeklyPoints",
    title: copy("Weekly learners leaderboard", "সাপ্তাহিক শিক্ষার্থী লিডারবোর্ড"),
    scoreLabel: copy("Weekly points", "সাপ্তাহিক পয়েন্ট"),
    description: copy(
      `Approved learner records inside ${departmentTitle} are ranked here from ${weekLabel}.`,
      `${departmentTitle}-এর approved learner record ${weekLabel} থেকে এখানে র‌্যাঙ্ক করা হয়।`,
    ),
    emptyMessage: copy(
      "No approved learner credits have landed for this department yet this week.",
      "এই সপ্তাহে এখনো এই ডিপার্টমেন্টে কোনো approved learner credit যোগ হয়নি।",
    ),
  };
};

// Memoized: only re-renders when entries data or viewer identity changes
const TopThreePlot = memo(function TopThreePlot({ entries, scoreField, scoreLabel, viewerUserId = "" }) {
  const { copy } = useLocale();
  const topThree = [...entries].slice(0, 3);
  if (!topThree.length) return null;

  const podiumOrder = [topThree[1], topThree[0], topThree[2]].filter(Boolean);
  const maxScore = Math.max(...topThree.map((entry) => getEntryScore(entry, scoreField)), 1);

  return (
    <div className="premium-panel rounded-[1.75rem] border border-border/60 bg-gradient-to-br from-primary/8 via-background to-background p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            {copy("Top 3 focus", "টপ ৩ ফোকাস")}
          </p>
          <p className="mt-2 text-lg font-semibold">
            {copy("This board's top performers", "এই বোর্ডের সেরা পারফর্মার")}
          </p>
        </div>
        <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
          {scoreLabel}
        </Badge>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3 md:items-end">
        {podiumOrder.map((entry) => {
          const score = getEntryScore(entry, scoreField);
          const height = 84 + Math.round((score / maxScore) * 96);
          const isViewer = viewerUserId && entry.userId === viewerUserId;
          const rankTone = rankLabels[entry.rank]?.tone || "outline";

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: entry.rank * 0.15, type: "spring", stiffness: 100 }}
              className={cn(
                "workspace-pane rounded-[1.5rem] p-4 text-center shadow-sm hover-glow",
                entry.rank === 1 ? "md:-translate-y-4 md:shadow-lg md:shadow-primary/10" : "",
                isViewer ? "border-primary/40 bg-primary/5" : "",
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <Badge variant={rankTone}>{`#${entry.rank}`}</Badge>
                {isViewer ? <Badge variant="outline">{copy("You", "আপনি")}</Badge> : null}
              </div>
              <div className="mt-4 flex justify-center">
                <Avatar className="h-14 w-14 border border-border/60">
                  <AvatarImage src={entry.photoURL || ""} alt={entry.displayName || "Learner"} />
                  <AvatarFallback>{getInitials(entry.displayName)}</AvatarFallback>
                </Avatar>
              </div>
              <p className="mt-3 line-clamp-2 text-sm font-semibold">
                {entry.displayName || copy("EquiSaaS member", "ইকুইসাস সদস্য")}
              </p>
              <div className="mt-4 flex items-end justify-center rounded-[1.25rem] bg-muted/40 px-4 pb-3 pt-5">
                <motion.div
                  initial={{ height: 40, opacity: 0 }}
                  animate={{ height: height, opacity: 1 }}
                  transition={{ delay: 0.3 + entry.rank * 0.1, type: "spring", bounce: 0.4 }}
                  className={cn(
                    "flex w-full max-w-[7rem] items-end justify-center rounded-t-[1rem] bg-gradient-to-t px-3 pb-3 pt-4 text-center text-white",
                    entry.rank === 1 ? "from-primary to-primary/80" : entry.rank === 2 ? "from-slate-500 to-slate-400" : "from-amber-500 to-amber-400",
                  )}
                >
                  <div>
                    <Medal className="mx-auto h-5 w-5" />
                    <p className="mt-2 text-2xl font-bold leading-none">{score}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/80">{copy("points", "পয়েন্ট")}</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

// Memoized: skips re-render unless the specific entry row data changes
const LeaderboardMobileCard = memo(function LeaderboardMobileCard({ departmentTitle, entry, isViewer, scoreField, scoreLabel }) {
  const { copy } = useLocale();
  const rank = entry.rank;
  const rankStyle = rankLabels[rank];
  // Memoize initials : string split/map/join on every render is wasteful for a list
  const initials = useMemo(() => getInitials(entry.displayName), [entry.displayName]);
  const avatarRing = rankStyle?.avatarRing || "";

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.05 }}
      className={cn(
        "rounded-3xl border bg-background/85 p-4 hover-glow",
        isViewer ? "border-primary/40 bg-primary/5" : "",
        rank === 1 ? "border-amber-300/60 dark:border-amber-600/40 bg-gradient-to-br from-gold-subtle/40 to-background dark:from-gold-subtle/10" : "",
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 font-bold text-primary",
          rankStyle?.iconClass,
          rank <= 3 ? "bg-transparent" : "",
        )}>
          {rank <= 3 ? <Medal className="h-5 w-5" /> : `#${rank}`}
        </div>
        <Avatar className={cn("h-11 w-11 shrink-0 border border-border/60", avatarRing)}>
          <AvatarImage src={entry.photoURL || ""} alt={entry.displayName || "Learner"} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="line-clamp-2 font-semibold">
              {entry.displayName || copy("EquiSaaS member", "ইকুইসাস সদস্য")}
            </p>
            {isViewer ? <Badge variant="outline">{copy("You", "আপনি")}</Badge> : null}
          </div>
          <p className="text-xs text-muted-foreground">{departmentTitle}</p>
        </div>
        {rankStyle ? <Badge variant={rankStyle.tone}>{`#${rank}`}</Badge> : <Badge variant="outline">{`#${rank}`}</Badge>}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-muted/40 px-3 py-2">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{scoreLabel}</p>
          <p className="mt-1 text-lg font-semibold">{getEntryScore(entry, scoreField)}</p>
        </div>
        <div className="rounded-2xl bg-muted/40 px-3 py-2">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {copy("Approved credits", "অনুমোদিত ক্রেডিট")}
          </p>
          <p className="mt-1 text-lg font-semibold">{entry.approvedCredits || 0}</p>
        </div>
        <div className="rounded-2xl bg-muted/40 px-3 py-2">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {copy("Last credit", "সর্বশেষ ক্রেডিট")}
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">{formatDateTime(entry.lastAwardedAt)}</p>
        </div>
      </div>
    </motion.div>
  );
});

export function WeeklyDepartmentLeaderboard({
  departmentId,
  leaderboard,
  loading = false,
  viewerUserId = "",
  compact = false,
  showBrowseLink = false,
}) {
  const { copy } = useLocale();
  const entries = Array.isArray(leaderboard?.entries) ? leaderboard.entries : [];
  const visibleEntries = compact ? entries.slice(0, 5) : entries;
  const participantCount = Number(leaderboard?.participantCount || 0);
  const departmentTitle = getDepartmentTitle(departmentId);
  const periodType = leaderboard?.periodType || "weekly";
  const meta = getPeriodMeta({ periodType, leaderboard, departmentTitle, copy });

  return (
    <Card
      id={compact ? undefined : "department-leaderboard"}
      className="rounded-[2rem] border bg-card/80 shadow-xl backdrop-blur-xl"
    >
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="subtle" className="w-fit rounded-full px-4 py-1.5 text-sm">
              {copy("Department leaderboard", "ডিপার্টমেন্ট লিডারবোর্ড")}
            </Badge>
            <Badge variant="outline" className="rounded-full">
              {departmentTitle}
            </Badge>
          </div>
          <CardTitle className="flex flex-wrap items-center gap-2 text-2xl">
            <Trophy className="h-5 w-5 text-primary" />
            {meta.title}
          </CardTitle>
          <CardDescription className="max-w-3xl text-sm leading-6">
            {meta.description}
          </CardDescription>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-2">
            <Users className="h-4 w-4" />
            {participantCount} {copy("active learners", "সক্রিয় শিক্ষার্থী")}
          </span>
          {showBrowseLink ? (
            <Button variant="outline" size="sm" asChild>
              <Link href="/points#department-leaderboard">
                {copy("Open full board", "পূর্ণ বোর্ড খুলুন")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-3" aria-busy="true" aria-label={copy("Loading leaderboard", "লিডারবোর্ড লোড হচ্ছে")}>
            <Skeleton className="h-20 w-full rounded-3xl" />
            <Skeleton className="h-20 w-full rounded-3xl" />
            <Skeleton className="h-20 w-full rounded-3xl" />
          </div>
        ) : null}

        {!loading && !visibleEntries.length ? (
          <div className="workspace-empty-state rounded-3xl p-5">
            <p className="text-sm leading-6 text-muted-foreground">{meta.emptyMessage}</p>
          </div>
        ) : null}

        {!loading && !compact && entries.length ? (
          <TopThreePlot entries={entries} scoreField={meta.scoreField} scoreLabel={meta.scoreLabel} viewerUserId={viewerUserId} />
        ) : null}

        {!loading && visibleEntries.length && compact ? (
          <div className="space-y-3">
            {visibleEntries.map((entry) => {
              const isViewer = viewerUserId && entry.userId === viewerUserId;
              const rankStyle = rankLabels[entry.rank];
              const rankTone = rankStyle?.tone || "outline";
              const avatarRing = rankStyle?.avatarRing || "";
              const isFirst = entry.rank === 1;

              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: entry.rank * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  className={cn(
                    "flex flex-col gap-4 rounded-3xl border p-4 transition-all duration-200 sm:flex-row sm:items-center cursor-default",
                    isViewer ? "border-primary/40 bg-primary/5" : "border-border/60 bg-background/85 hover:bg-muted/40",
                    isFirst && !isViewer ? "border-amber-300/50 dark:border-amber-600/30 bg-gradient-to-r from-gold-subtle/30 to-transparent dark:from-gold-subtle/8" : "",
                  )}
                >
                  <div className="flex min-w-0 items-center gap-3 sm:flex-1">
                    <div className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-bold",
                      rankStyle?.iconClass ? `bg-transparent ${rankStyle.iconClass}` : "bg-primary/10 text-primary",
                    )}>
                      {entry.rank <= 3 ? <Medal className="h-5 w-5" /> : `#${entry.rank}`}
                    </div>
                    <Avatar className={cn("h-11 w-11 shrink-0 border border-border/60", avatarRing)}>
                      <AvatarImage src={entry.photoURL || ""} alt={entry.displayName || "Learner"} />
                      <AvatarFallback>{getInitials(entry.displayName)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="line-clamp-2 font-semibold sm:truncate">
                          {entry.displayName || copy("EquiSaaS member", "ইকুইসাস সদস্য")}
                        </p>
                        {isViewer ? <Badge variant="outline">{copy("You", "আপনি")}</Badge> : null}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {entry.approvedCredits || 0} {copy("approved credits", "অনুমোদিত ক্রেডিট")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-2xl bg-muted/40 px-3 py-2 sm:min-w-[8rem] sm:flex-col sm:items-end sm:rounded-none sm:bg-transparent sm:px-0 sm:py-0">
                    <Badge variant={rankTone}>{`#${entry.rank}`}</Badge>
                    <div className="text-right">
                      <p className="text-lg font-bold tabular-nums">{getEntryScore(entry, meta.scoreField)}</p>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{copy("points", "পয়েন্ট")}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : null}

        {!loading && visibleEntries.length && !compact ? (
          <>
            <div className="space-y-3 md:hidden">
              {visibleEntries.map((entry) => (
                <LeaderboardMobileCard
                  key={entry.id}
                  departmentTitle={departmentTitle}
                  entry={entry}
                  isViewer={Boolean(viewerUserId && entry.userId === viewerUserId)}
                  scoreField={meta.scoreField}
                  scoreLabel={meta.scoreLabel}
                />
              ))}
            </div>

            <div className="hidden w-full overflow-x-auto pb-2 md:block">
              <Table className="min-w-[600px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>{copy("Rank", "র‍্যাঙ্ক")}</TableHead>
                    <TableHead>{copy("Learner", "শিক্ষার্থী")}</TableHead>
                    <TableHead>{meta.scoreLabel}</TableHead>
                    <TableHead>{copy("Approved credits", "অনুমোদিত ক্রেডিট")}</TableHead>
                    <TableHead>{copy("Last credit", "সর্বশেষ ক্রেডিট")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleEntries.map((entry) => {
                    const isViewer = viewerUserId && entry.userId === viewerUserId;
                    const rankTone = rankLabels[entry.rank]?.tone || "outline";

                    return (
                      <TableRow key={entry.id} className={cn(isViewer ? "bg-primary/5" : "", "transition-colors hover:bg-muted/50")}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant={rankTone}>{`#${entry.rank}`}</Badge>
                            {isViewer ? <Badge variant="outline">{copy("You", "আপনি")}</Badge> : null}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border border-border/60">
                              <AvatarImage src={entry.photoURL || ""} alt={entry.displayName || "Learner"} />
                              <AvatarFallback>{getInitials(entry.displayName)}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="truncate font-semibold">
                                {entry.displayName || copy("EquiSaaS member", "ইকুইসাস সদস্য")}
                              </p>
                              <p className="text-xs text-muted-foreground">{departmentTitle}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">{getEntryScore(entry, meta.scoreField)}</TableCell>
                        <TableCell>{entry.approvedCredits || 0}</TableCell>
                        <TableCell>{formatDateTime(entry.lastAwardedAt)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
