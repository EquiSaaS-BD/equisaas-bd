"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, CheckCircle2, Medal, ShieldCheck, Trophy, Users } from "lucide-react";
import { WeeklyDepartmentLeaderboard } from "@/components/leaderboards/weekly-department-leaderboard";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyStateCard } from "@/components/ui/empty-state-card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { WorkspaceFilterBar } from "@/components/ui/workspace-filter-bar";
import { DEPARTMENT_OPTIONS, canBrowseAllDepartments, getDepartmentTitle, roleLabels } from "@/lib/catalog";
import { formatDateTime } from "@/lib/date";
import { cn } from "@/lib/utils";
import {
  fetchDepartmentMonthlyLeaderboard,
  fetchDepartmentOverallLeaderboard,
  fetchDepartmentWeeklyLeaderboard,
  fetchManageableUsers,
  fetchUserLedger,
} from "@/lib/firestore/lms";

function StatCard({ title, value, description, icon: Icon, tint = "primary" }) {
  const tintMap = {
    primary: "bg-primary/10 text-primary",
    gold: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  };
  const iconBg = tintMap[tint] || tintMap.primary;

  return (
    <div className={`group relative overflow-hidden rounded-3xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
      tint === "gold" ? "border-amber-200/60 dark:border-amber-800/30" : "border-border/60"
    } bg-card`}>
      {tint === "gold" ? <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" /> : null}
      <div className="mb-3 flex items-center gap-3">
        {Icon ? <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${iconBg}`}><Icon className="h-5 w-5" /></div> : null}
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{title}</p>
      </div>
      <p className="text-3xl font-bold tracking-tight tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

const sortUsersByPoints = (items) =>
  [...items].sort((left, right) => {
    const pointsDelta = Number(right.totalPoints || 0) - Number(left.totalPoints || 0);
    if (pointsDelta !== 0) return pointsDelta;
    return String(left.displayName || left.email || "").localeCompare(String(right.displayName || right.email || ""));
  });

function RoleBadgeGroup({ member, dense = false }) {
  const labels = roleLabels(member);

  return (
    <div className={cn("mt-2 flex flex-wrap gap-1.5", dense && "mt-0 gap-1")}>
      {labels.map((label) => (
        <Badge
          key={label}
          variant="secondary"
          className={cn(
            "rounded-full border border-primary/10 bg-primary/8 text-primary shadow-none",
            dense ? "px-2 py-0 text-[11px]" : "px-2.5 py-0.5 text-xs",
          )}
        >
          {label}
        </Badge>
      ))}
    </div>
  );
}

export default function PointsPage() {
  const { user, profile, role, roles } = useAuth();
  const { copy } = useLocale();
  const [entries, setEntries] = useState([]);
  const [departmentId, setDepartmentId] = useState(profile?.departmentId || "");
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState(null);
  const [monthlyLeaderboard, setMonthlyLeaderboard] = useState(null);
  const [overallLeaderboard, setOverallLeaderboard] = useState(null);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [allUsersLoading, setAllUsersLoading] = useState(true);
  const canBrowseAnyDepartment = canBrowseAllDepartments(roles);
  const isSuperAdmin = roles.includes("super_admin");
  const leaderboardDepartmentId = canBrowseAnyDepartment
    ? (departmentId || profile?.departmentId || "")
    : (profile?.departmentId || "");

  useEffect(() => {
    if (!user?.uid) return;
    fetchUserLedger(user.uid).then(setEntries).catch(() => setEntries([]));
  }, [user?.uid]);

  useEffect(() => {
    setDepartmentId(profile?.departmentId || (canBrowseAnyDepartment ? (DEPARTMENT_OPTIONS[0]?.id || "") : ""));
  }, [canBrowseAnyDepartment, profile?.departmentId]);

  useEffect(() => {
    let active = true;

    const loadLeaderboards = async () => {
      if (!user?.uid || !leaderboardDepartmentId) {
        if (active) {
          setWeeklyLeaderboard(null);
          setMonthlyLeaderboard(null);
          setOverallLeaderboard(null);
          setLeaderboardLoading(false);
        }
        return;
      }

      setLeaderboardLoading(true);
      try {
        const [nextWeekly, nextMonthly, nextOverall] = await Promise.all([
          fetchDepartmentWeeklyLeaderboard({ departmentId: leaderboardDepartmentId, limitCount: 10 }),
          fetchDepartmentMonthlyLeaderboard({ departmentId: leaderboardDepartmentId, limitCount: 10 }),
          fetchDepartmentOverallLeaderboard({ departmentId: leaderboardDepartmentId, limitCount: 10 }),
        ]);
        if (!active) return;
        setWeeklyLeaderboard(nextWeekly);
        setMonthlyLeaderboard(nextMonthly);
        setOverallLeaderboard(nextOverall);
      } catch {
        if (!active) return;
        setWeeklyLeaderboard(null);
        setMonthlyLeaderboard(null);
        setOverallLeaderboard(null);
      } finally {
        if (active) {
          setLeaderboardLoading(false);
        }
      }
    };

    loadLeaderboards();

    return () => {
      active = false;
    };
  }, [leaderboardDepartmentId, user?.uid]);

  useEffect(() => {
    let active = true;

    const loadAllUsers = async () => {
      if (!isSuperAdmin) {
        if (active) {
          setAllUsers([]);
          setAllUsersLoading(false);
        }
        return;
      }

      setAllUsersLoading(true);
      try {
        const nextUsers = await fetchManageableUsers({
          departmentId: DEPARTMENT_OPTIONS[0]?.id || "frontend",
          actorRole: "super_admin",
        });
        if (!active) return;
        setAllUsers(sortUsersByPoints(nextUsers));
      } catch {
        if (!active) return;
        setAllUsers([]);
      } finally {
        if (active) {
          setAllUsersLoading(false);
        }
      }
    };

    loadAllUsers();

    return () => {
      active = false;
    };
  }, [isSuperAdmin]);

  const taskCredits = useMemo(
    () => entries.filter((entry) => entry.sourceType === "task_submission" && entry.direction !== "debit").length,
    [entries],
  );
  const attendanceCredits = useMemo(
    () => entries.filter((entry) => entry.sourceType === "attendance" && entry.direction !== "debit").length,
    [entries],
  );
  const topMember = allUsers[0] || null;
  const topThreeMembers = allUsers.slice(0, 3);
  const selectedDepartmentTitle = getDepartmentTitle(leaderboardDepartmentId);
  const boardHighlights = useMemo(
    () => [
      {
        key: "weekly",
        title: copy("Weekly leader", "সাপ্তাহিক লিডার"),
        entry: weeklyLeaderboard?.entries?.[0] || null,
        score: Number(weeklyLeaderboard?.entries?.[0]?.weeklyPoints ?? weeklyLeaderboard?.entries?.[0]?.score ?? 0),
      },
      {
        key: "monthly",
        title: copy("Monthly leader", "মাসিক লিডার"),
        entry: monthlyLeaderboard?.entries?.[0] || null,
        score: Number(monthlyLeaderboard?.entries?.[0]?.monthlyPoints ?? monthlyLeaderboard?.entries?.[0]?.score ?? 0),
      },
      {
        key: "overall",
        title: copy("Overall leader", "সার্বিক লিডার"),
        entry: overallLeaderboard?.entries?.[0] || null,
        score: Number(overallLeaderboard?.entries?.[0]?.overallPoints ?? overallLeaderboard?.entries?.[0]?.score ?? 0),
      },
    ],
    [copy, monthlyLeaderboard, overallLeaderboard, weeklyLeaderboard],
  );

  return (
    <div className="workspace-stack">
      <Card className="workspace-hero rounded-[2rem] border bg-card/80 shadow-xl backdrop-blur-xl" data-reveal="up">
        <CardHeader>
          <CardTitle className="text-3xl">{copy("Trusted points ledger", "বিশ্বস্ত পয়েন্ট লেজার")}</CardTitle>
          <CardDescription className="mt-2 max-w-4xl text-base leading-7">
            {copy(
              "Your visible total comes from approved ledger-backed records only. Nothing is counted from the frontend alone.",
              "আপনার দৃশ্যমান মোট শুধু approved ledger-backed record থেকেই আসে। শুধুমাত্র frontend থেকে কোনো কিছু গণনা হয় না।",
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 relative">
          {profile?.totalPoints > 0 && (
            <div className="absolute -top-6 right-6 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white text-[10px] uppercase tracking-[0.2em] px-4 py-1.5 rounded-full font-bold shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-bounce z-10">
              {copy("Top 20% Performer", "টপ ২০% পারফর্মার")}
            </div>
          )}
          <StatCard
            title={copy("Total points", "মোট পয়েন্ট")}
            value={profile?.totalPoints || 0}
            description={copy("Stored on your user profile for low-cost reads.", "কম খরচে read-এর জন্য আপনার user profile-এ রাখা হয়।")}
            icon={Trophy}
            tint="gold"
          />
          <StatCard
            title={copy("Ledger entries", "লেজার এন্ট্রি")}
            value={entries.length}
            description={copy("Every credit or adjustment stays traceable.", "প্রতিটি credit বা adjustment traceable থাকে।")}
            icon={Medal}
            tint="primary"
          />
          <StatCard
            title={copy("Task credits", "টাস্ক ক্রেডিট")}
            value={taskCredits}
            description={copy("Approved task submissions only.", "শুধু approved task submission।")}
            icon={CheckCircle2}
            tint="success"
          />
          <StatCard
            title={copy("Attendance credits", "অ্যাটেনডেন্স ক্রেডিট")}
            value={attendanceCredits}
            description={copy("Verified attendance events only.", "শুধু verified attendance event।")}
            icon={CalendarCheck}
            tint="blue"
          />
        </CardContent>
      </Card>

      <WorkspaceFilterBar
        eyebrow={copy("Leaderboard scope", "লিডারবোর্ড স্কোপ")}
        title={selectedDepartmentTitle}
        description={copy(
          `Everything below is scoped to ${selectedDepartmentTitle}. Weekly, monthly, and overall boards stay separate so momentum is visible at every time horizon.`,
          `${selectedDepartmentTitle} scope-এর জন্য নিচের সবকিছু দেখানো হচ্ছে। Weekly, monthly, আর overall board আলাদা রাখা হয়েছে যাতে প্রতিটি time horizon-এ momentum দেখা যায়।`,
        )}
        actions={
          canBrowseAnyDepartment ? (
            <div className="workspace-data-grid min-w-[15rem]">
              <Label htmlFor="points-leaderboard-department" className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {copy("Department", "ডিপার্টমেন্ট")}
              </Label>
              <Select value={departmentId} onValueChange={setDepartmentId}>
                <SelectTrigger id="points-leaderboard-department">
                  <SelectValue placeholder={copy("Select a department", "একটি ডিপার্টমেন্ট নির্বাচন করুন")} />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENT_OPTIONS.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null
        }
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {boardHighlights.map((item) => (
            <div key={item.key} className={cn(
              "workspace-pane hover-lift p-4 relative overflow-hidden group",
              item.key === "overall" && item.entry ? "border-amber-300/60 dark:border-amber-700/60 shadow-[0_0_25px_rgba(251,191,36,0.15)]" : ""
            )}>
              {item.key === "overall" && item.entry && (
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-transparent opacity-50 animate-pulse pointer-events-none" />
              )}
              <p className="workspace-tile-title relative z-10">{item.title}</p>
              <p className="mt-2 line-clamp-2 text-base font-semibold relative z-10">
                {item.entry?.displayName || copy("No approved record yet", "এখনও কোনো approved record নেই")}
              </p>
              <p className="workspace-tile-value relative z-10">{item.score}</p>
              <p className="mt-1 text-xs text-muted-foreground relative z-10">
                {item.entry
                  ? copy(`Rank #${item.entry.rank || 1}`, `র‌্যাঙ্ক #${item.entry.rank || 1}`)
                  : copy("Waiting for the first approved credit.", "প্রথম approved credit-এর অপেক্ষায় আছে।")}
              </p>
            </div>
          ))}
        </div>
      </WorkspaceFilterBar>

      <div className="space-y-6">
        <WeeklyDepartmentLeaderboard
          departmentId={leaderboardDepartmentId}
          leaderboard={weeklyLeaderboard}
          loading={leaderboardLoading}
          viewerUserId={user?.uid || ""}
        />
        <WeeklyDepartmentLeaderboard
          departmentId={leaderboardDepartmentId}
          leaderboard={monthlyLeaderboard}
          loading={leaderboardLoading}
          viewerUserId={user?.uid || ""}
        />
        <WeeklyDepartmentLeaderboard
          departmentId={leaderboardDepartmentId}
          leaderboard={overallLeaderboard}
          loading={leaderboardLoading}
          viewerUserId={user?.uid || ""}
        />
      </div>

      {isSuperAdmin ? (
        <Card className="rounded-[1.75rem] border border-border/50 bg-background/85" data-reveal="up">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="subtle" className="rounded-full px-4 py-1.5 text-sm">
                {copy("Super admin view", "সুপার অ্যাডমিন ভিউ")}
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
                {copy("All departments", "সব ডিপার্টমেন্ট")}
              </Badge>
            </div>
            <CardTitle className="mt-2 text-2xl">{copy("Cross-department points visibility", "ক্রস-ডিপার্টমেন্ট পয়েন্ট দৃশ্যমানতা")}</CardTitle>
            <CardDescription>
              {copy(
                "This view lets the highest access role see every logged-in member's running points total and the strongest performers across the full LMS.",
                "এই view-এ highest access role পুরো LMS জুড়ে সব logged-in member-এর running points total এবং সেরা performer-দের দেখতে পায়।",
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <StatCard
                title={copy("Tracked members", "ট্র্যাক করা মেম্বার")}
                value={allUsersLoading ? "..." : allUsers.length}
                description={copy("Every member with a user profile inside the LMS.", "LMS-এর ভেতরে user profile থাকা সব member।")}
                icon={Users}
                tint="primary"
              />
              <StatCard
                title={copy("Top performer", "শীর্ষ পারফর্মার")}
                value={topMember ? Number(topMember.totalPoints || 0) : 0}
                description={topMember ? `${topMember.displayName || topMember.email}` : copy("No member data yet.", "এখনও কোনো member data নেই।")}
                icon={Trophy}
                tint="gold"
              />
              <StatCard
                title={copy("Visibility mode", "ভিজিবিলিটি মোড")}
                value={copy("All departments", "সব ডিপার্টমেন্ট")}
                description={copy("Use this to compare total points across the whole organization.", "পুরো organization জুড়ে total points তুলনা করতে এটি ব্যবহার করুন।")}
                icon={ShieldCheck}
                tint="blue"
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {allUsersLoading
                ? [0, 1, 2].map((item) => <Skeleton key={item} className="h-48 rounded-[1.5rem]" />)
                : topThreeMembers.length ? topThreeMembers.map((member, index) => (
                    <div key={member.id} className={cn(
                      "workspace-pane hover-lift rounded-[1.5rem] p-5",
                      index === 0 ? "border-amber-300/60 dark:border-amber-700/40" : "border-border/60",
                    )}>
                      <div className="flex items-center justify-between gap-3">
                        <Badge variant={index === 0 ? "success" : index === 1 ? "secondary" : "warning"}>{`#${index + 1}`}</Badge>
                        <Badge variant="outline">{getDepartmentTitle(member.departmentId)}</Badge>
                      </div>
                      <p className="mt-4 line-clamp-2 text-lg font-semibold">{member.displayName || member.email}</p>
                      <RoleBadgeGroup member={member} />
                      <p className="mt-6 text-4xl font-bold tabular-nums text-primary">{Number(member.totalPoints || 0)}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">{copy("overall points", "সার্বিক পয়েন্ট")}</p>
                    </div>
                  )) : (
                    <div className="lg:col-span-3">
                      <EmptyStateCard
                        icon={ShieldCheck}
                        title={copy("No cross-department totals yet", "এখনও কোনো cross-department total নেই")}
                        description={copy(
                          "As soon as members receive approved points, the strongest performers across the full LMS will appear here.",
                          "মেম্বাররা approved point পেতে শুরু করলে পুরো LMS-এর strongest performer-রা এখানে দেখা যাবে।",
                        )}
                      />
                    </div>
                  )}
            </div>

            <div className="rounded-[1.5rem] border border-border/60 bg-background/80">
              <div className="border-b border-border/60 px-5 py-4">
                <p className="text-lg font-semibold">{copy("All member totals", "সব মেম্বারের মোট পয়েন্ট")}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {copy(
                    "Sorted from highest to lowest total points across every department.",
                    "সব department জুড়ে total points highest থেকে lowest ক্রমে সাজানো।",
                  )}
                </p>
              </div>
              {/* Mobile card list */}
              <div className="divide-y divide-border/60 md:hidden">
                {allUsersLoading ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">{copy("Loading...", "লোড হচ্ছে...")}</div>
                ) : allUsers.length ? (
                  allUsers.map((member, index) => (
                    <div key={member.id} className={`flex items-center gap-3 px-4 py-3 ${index < 3 ? "bg-primary/5" : ""}`}>
                      <Badge variant={index === 0 ? "success" : index === 1 ? "secondary" : index === 2 ? "warning" : "outline"} className="w-10 shrink-0 justify-center">#{index + 1}</Badge>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{member.displayName || member.email}</p>
                        <p className="truncate text-xs text-muted-foreground">{getDepartmentTitle(member.departmentId)}</p>
                      </div>
                      <p className="shrink-0 text-sm font-bold tabular-nums text-primary">{Number(member.totalPoints || 0)}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">{copy("No member totals available yet.", "এখনও কোনো member total পাওয়া যায়নি।")}</div>
                )}
              </div>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                    <TableHead>{copy("Rank", "র‌্যাঙ্ক")}</TableHead>
                    <TableHead>{copy("Member", "সদস্য")}</TableHead>
                    <TableHead>{copy("Department", "ডিপার্টমেন্ট")}</TableHead>
                    <TableHead>{copy("Roles", "রোলসমূহ")}</TableHead>
                    <TableHead>{copy("Total points", "মোট পয়েন্ট")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allUsersLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                          {copy("Loading member totals...", "মেম্বারের মোট পয়েন্ট লোড হচ্ছে...")}
                        </TableCell>
                      </TableRow>
                    ) : allUsers.length ? (
                      allUsers.map((member, index) => (
                        <TableRow key={member.id} className={index < 3 ? "bg-primary/5" : ""}>
                          <TableCell>
                            <Badge variant={index === 0 ? "success" : index === 1 ? "secondary" : index === 2 ? "warning" : "outline"}>
                              #{index + 1}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{member.displayName || member.email}</p>
                              <p className="text-xs text-muted-foreground">{member.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>{getDepartmentTitle(member.departmentId)}</TableCell>
                          <TableCell><RoleBadgeGroup member={member} dense /></TableCell>
                          <TableCell className="font-semibold tabular-nums">{Number(member.totalPoints || 0)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                          {copy("No member totals available yet.", "এখনও কোনো member total পাওয়া যায়নি।")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card className="rounded-[1.75rem] border border-border/50 bg-background/85 transition-colors hover:bg-muted/50" data-reveal="up">
        <CardHeader>
          <CardTitle>{copy("Points history", "পয়েন্ট ইতিহাস")}</CardTitle>
          <CardDescription>
            {copy(
              "Each row shows why points were credited or adjusted and who approved them.",
              "প্রতিটি row-এ points কেন credit বা adjustment হয়েছে এবং কে approve করেছে তা দেখা যায়।",
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {entries.length ? (
            <>
              <div className="space-y-3 md:hidden">
                {entries.map((entry) => (
                  <div key={entry.id} className="rounded-3xl border bg-background/80 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                          {copy("Points", "পয়েন্ট")}
                        </p>
                        <p className="mt-1 text-2xl font-semibold">
                          {entry.direction === "debit" ? `-${entry.points}` : entry.points}
                        </p>
                      </div>
                      <Badge variant="outline">{entry.approvedBy || copy("System", "সিস্টেম")}</Badge>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{copy("Source", "উৎস")}</p>
                        <p className="mt-1 font-medium">{entry.sourceType}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{copy("Note", "নোট")}</p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">{entry.note || copy("No note", "কোনো নোট নেই")}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{copy("Recorded", "রেকর্ড করা হয়েছে")}</p>
                        <p className="mt-1 text-sm">{formatDateTime(entry.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{copy("Points", "পয়েন্ট")}</TableHead>
                      <TableHead>{copy("Source", "উৎস")}</TableHead>
                      <TableHead>{copy("Approved by", "অনুমোদনকারী")}</TableHead>
                      <TableHead>{copy("Recorded", "রেকর্ড করা হয়েছে")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-semibold">{entry.direction === "debit" ? `-${entry.points}` : entry.points}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{entry.sourceType}</p>
                            <p className="text-xs text-muted-foreground">{entry.note || copy("No note", "কোনো নোট নেই")}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{entry.approvedBy || copy("System", "সিস্টেম")}</Badge>
                        </TableCell>
                        <TableCell>{formatDateTime(entry.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : (
            <EmptyStateCard
              icon={Medal}
              title={copy("No ledger entries yet", "এখনও কোনো লেজার এন্ট্রি নেই")}
              description={copy(
                "Approved task reviews, attendance credits, and any governed point adjustments will appear here automatically.",
                "Approved task review, attendance credit, এবং governed point adjustment হলে সেগুলো এখানে স্বয়ংক্রিয়ভাবে দেখা যাবে।",
              )}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
