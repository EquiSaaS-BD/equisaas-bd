import React, { useMemo, useState } from "react";
import { Activity, BarChart3, Clock3, MapPinned, ShieldCheck, Users } from "lucide-react";
import { DEPARTMENTS, PATHS } from "@/data/structure.mjs";
import { formatDistrictLabel } from "@/data/bangladesh-districts.js";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getRoleLabel, getScopeCoverageLabel } from "@/lib/governance";

const ACTIVE_TASK_STATUSES = new Set(["draft", "open", "in-progress"]);
const FINISHED_TASK_STATUSES = new Set(["approved", "closed"]);

const toMillis = (value) => {
  if (!value) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value?.seconds === "number") return value.seconds * 1000;
  return 0;
};

const averageRounded = (total = 0, count = 0) => (count ? Math.round(total / count) : 0);

const aggregateSubdepartmentSlices = (rows = []) => {
  const map = new Map();

  rows.forEach((row) => {
    const subdepartmentId = String(row?.subdepartmentId || "");
    if (!subdepartmentId) return;
    if (!map.has(subdepartmentId)) {
      map.set(subdepartmentId, {
        subdepartmentId,
        departmentId: row?.departmentId || "",
        departmentTitleEn: row?.departmentTitleEn || "",
        departmentTitleBn: row?.departmentTitleBn || "",
        subdepartmentTitleEn: row?.subdepartmentTitleEn || subdepartmentId,
        subdepartmentTitleBn: row?.subdepartmentTitleBn || subdepartmentId,
        memberCount: 0,
        activeMemberCount: 0,
        taskOpenCount: 0,
        taskSubmittedCount: 0,
        taskApprovedCount: 0,
        submissionPendingCount: 0,
        lessonCompletionWeighted: 0,
        moduleCompletionWeighted: 0,
      });
    }

    const bucket = map.get(subdepartmentId);
    const memberCount = Number(row?.memberCount || 0);
    bucket.memberCount += memberCount;
    bucket.activeMemberCount += Number(row?.activeMemberCount || 0);
    bucket.taskOpenCount += Number(row?.taskOpenCount || 0);
    bucket.taskSubmittedCount += Number(row?.taskSubmittedCount || 0);
    bucket.taskApprovedCount += Number(row?.taskApprovedCount || 0);
    bucket.submissionPendingCount += Number(row?.submissionPendingCount || 0);
    bucket.lessonCompletionWeighted += Number(row?.avgLessonCompletionRate || 0) * memberCount;
    bucket.moduleCompletionWeighted += Number(row?.avgModuleCompletionRate || 0) * memberCount;
  });

  return Array.from(map.values())
    .map((bucket) => ({
      ...bucket,
      avgLessonCompletionRate: averageRounded(bucket.lessonCompletionWeighted, bucket.memberCount),
      avgModuleCompletionRate: averageRounded(bucket.moduleCompletionWeighted, bucket.memberCount),
    }))
    .sort((left, right) => {
      if (right.memberCount !== left.memberCount) return right.memberCount - left.memberCount;
      return right.avgLessonCompletionRate - left.avgLessonCompletionRate;
    });
};

const aggregateDistrictSlices = (rows = []) => {
  const map = new Map();

  rows.forEach((row) => {
    const districtId = String(row?.districtId || "");
    if (!districtId) return;
    if (!map.has(districtId)) {
      map.set(districtId, {
        districtId,
        districtTitleEn: row?.districtTitleEn || districtId,
        districtTitleBn: row?.districtTitleBn || districtId,
        memberCount: 0,
        activeMemberCount: 0,
        approvedTaskCount: 0,
        needsRevisionTaskCount: 0,
        totalCompletionWeighted: 0,
      });
    }

    const bucket = map.get(districtId);
    const memberCount = Number(row?.memberCount || 0);
    bucket.memberCount += memberCount;
    bucket.activeMemberCount += Number(row?.activeMemberCount || 0);
    bucket.approvedTaskCount += Number(row?.approvedTaskCount || 0);
    bucket.needsRevisionTaskCount += Number(row?.needsRevisionTaskCount || 0);
    bucket.totalCompletionWeighted += Number(row?.avgCompletionRate || 0) * memberCount;
  });

  return Array.from(map.values())
    .map((bucket) => ({
      ...bucket,
      avgCompletionRate: averageRounded(bucket.totalCompletionWeighted, bucket.memberCount),
    }))
    .sort((left, right) => {
      if (right.memberCount !== left.memberCount) return right.memberCount - left.memberCount;
      return right.avgCompletionRate - left.avgCompletionRate;
    });
};

const getLastSevenDhakaDays = () => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const days = [];
  const today = new Date();

  for (let offset = 6; offset >= 0; offset -= 1) {
    const current = new Date(today);
    current.setDate(today.getDate() - offset);
    days.push({
      key: formatter.format(current),
      label: current.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    });
  }

  return days;
};

const getDhakaDayKey = (value) => {
  const millis = toMillis(value);
  if (!millis) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(millis));
};

const getSubdepartmentMeta = (subdepartmentId = "") => {
  for (const department of DEPARTMENTS) {
    const subdepartment = (department.subdepartments || []).find((item) => item.id === subdepartmentId);
    if (subdepartment) {
      return {
        ...subdepartment,
        departmentId: department.id,
        departmentTitleEn: department.titleEn,
        departmentTitleBn: department.titleBn,
      };
    }
  }
  return null;
};

const getPathMeta = (pathId = "") => PATHS.find((item) => item.id === pathId) || null;

const getPathModuleCount = (pathId = "") => {
  const pathMeta = getPathMeta(pathId);
  return (pathMeta?.modules || []).length || 0;
};

const isRecentlyActive = (value, threshold) => {
  const millis = toMillis(value);
  return millis > 0 && millis >= threshold;
};

const getPathLabel = (pathId, lang) => {
  const pathMeta = getPathMeta(pathId);
  if (!pathMeta) return pathId || "--";
  return lang === "bn" ? pathMeta.titleBn || pathMeta.titleEn : pathMeta.titleEn || pathMeta.titleBn;
};

export default function GovernanceReportsPanel(props) {
  const {
    departmentTasks = [],
    formatDateTime,
    lang = "en",
    managementScopes = [],
    reportingSnapshots,
    reviewableTaskQueue = [],
    taskSubmissions = [],
  } = props;
  const [view, setView] = useState("department");

  const derived = useMemo(() => {
    const memberRows = reportingSnapshots?.members || [];
    const departmentRows = reportingSnapshots?.departments || [];
    const pathRows = reportingSnapshots?.paths || [];
    const materializedSubdepartmentRows = reportingSnapshots?.subdepartments || [];
    const materializedDistrictRows = reportingSnapshots?.districts || [];
    const now = Date.now();
    const activeThreshold = now - 1000 * 60 * 60 * 24 * 30;
    const subdepartmentMap = new Map();
    const districtMap = new Map();
    const trendMap = new Map(
      getLastSevenDhakaDays().map((day) => [
        day.key,
        {
          key: day.key,
          label: day.label,
          created: 0,
          submitted: 0,
          approved: 0,
        },
      ]),
    );

    memberRows.forEach((member) => {
      const subdepartmentId = String(member?.subdepartmentId || "");
      if (subdepartmentId) {
        if (!subdepartmentMap.has(subdepartmentId)) {
          const meta = getSubdepartmentMeta(subdepartmentId);
          subdepartmentMap.set(subdepartmentId, {
            subdepartmentId,
            departmentId: meta?.departmentId || member?.departmentId || "",
            departmentTitleEn: meta?.departmentTitleEn || "",
            departmentTitleBn: meta?.departmentTitleBn || "",
            subdepartmentTitleEn: meta?.titleEn || subdepartmentId,
            subdepartmentTitleBn: meta?.titleBn || subdepartmentId,
            memberCount: 0,
            activeMemberCount: 0,
            taskOpenCount: 0,
            taskSubmittedCount: 0,
            taskApprovedCount: 0,
            submissionPendingCount: 0,
            lessonCompletionTotal: 0,
            moduleCompletionTotal: 0,
          });
        }

        const bucket = subdepartmentMap.get(subdepartmentId);
        bucket.memberCount += 1;
        if (isRecentlyActive(member?.latestActivityAt, activeThreshold)) bucket.activeMemberCount += 1;
        bucket.lessonCompletionTotal += Number(member?.completionRate || 0);
        const totalModules = getPathModuleCount(member?.pathId);
        bucket.moduleCompletionTotal += totalModules ? (Number(member?.completedModules || 0) / totalModules) * 100 : 0;
      }

      const districtId = String(member?.districtId || "");
      if (districtId) {
        if (!districtMap.has(districtId)) {
          districtMap.set(districtId, {
            districtId,
            districtTitleEn: formatDistrictLabel(districtId, "en") || districtId,
            districtTitleBn: formatDistrictLabel(districtId, "bn") || districtId,
            memberCount: 0,
            activeMemberCount: 0,
            approvedTaskCount: 0,
            needsRevisionTaskCount: 0,
            totalCompletionRate: 0,
          });
        }
        const bucket = districtMap.get(districtId);
        bucket.memberCount += 1;
        if (isRecentlyActive(member?.latestActivityAt, activeThreshold)) bucket.activeMemberCount += 1;
        bucket.approvedTaskCount += Number(member?.approvedTaskCount || 0);
        bucket.needsRevisionTaskCount += Number(member?.needsRevisionTaskCount || 0);
        bucket.totalCompletionRate += Number(member?.completionRate || 0);
      }
    });

    departmentTasks.forEach((task) => {
      const dayKey = getDhakaDayKey(task?.createdAt);
      if (trendMap.has(dayKey)) trendMap.get(dayKey).created += 1;

      const bucket = subdepartmentMap.get(String(task?.subdepartmentId || ""));
      if (bucket && ACTIVE_TASK_STATUSES.has(task?.status)) {
        bucket.taskOpenCount += 1;
      }
    });

    taskSubmissions.forEach((submission) => {
      const submittedKey = getDhakaDayKey(submission?.submittedAt || submission?.createdAt);
      if (trendMap.has(submittedKey)) trendMap.get(submittedKey).submitted += 1;
      if (submission?.status === "approved") {
        const approvedKey = getDhakaDayKey(submission?.reviewedAt || submission?.updatedAt);
        if (trendMap.has(approvedKey)) trendMap.get(approvedKey).approved += 1;
      }

      const bucket = subdepartmentMap.get(String(submission?.subdepartmentId || ""));
      if (!bucket) return;
      if (submission?.status === "submitted") bucket.taskSubmittedCount += 1;
      if (submission?.status === "approved") bucket.taskApprovedCount += 1;
    });

    reviewableTaskQueue.forEach((item) => {
      const bucket = subdepartmentMap.get(String(item?.subdepartmentId || ""));
      if (bucket && item?.state && item.state !== "approved") {
        bucket.submissionPendingCount += 1;
      }
    });

    const fallbackSubdepartmentRows = Array.from(subdepartmentMap.values())
      .map((bucket) => ({
        ...bucket,
        avgLessonCompletionRate: averageRounded(bucket.lessonCompletionTotal, bucket.memberCount),
        avgModuleCompletionRate: averageRounded(bucket.moduleCompletionTotal, bucket.memberCount),
      }))
      .sort((left, right) => {
        if (right.memberCount !== left.memberCount) return right.memberCount - left.memberCount;
        return right.avgLessonCompletionRate - left.avgLessonCompletionRate;
      });

    const fallbackDistrictRows = Array.from(districtMap.values())
      .map((bucket) => ({
        ...bucket,
        avgCompletionRate: averageRounded(bucket.totalCompletionRate, bucket.memberCount),
      }))
      .sort((left, right) => {
        if (right.memberCount !== left.memberCount) return right.memberCount - left.memberCount;
        return right.avgCompletionRate - left.avgCompletionRate;
      });

    const subdepartmentRows = materializedSubdepartmentRows.length
      ? aggregateSubdepartmentSlices(materializedSubdepartmentRows)
      : fallbackSubdepartmentRows;

    const districtRows = materializedDistrictRows.length
      ? aggregateDistrictSlices(materializedDistrictRows)
      : fallbackDistrictRows;

    const memberLeaderboard = [...memberRows]
      .map((member) => ({
        ...member,
        contributionScore:
          Number(member?.approvedTaskCount || 0) * 5 +
          Number(member?.submittedTaskCount || 0) * 2 +
          Number(member?.completionRate || 0),
      }))
      .sort((left, right) => {
        if (right.contributionScore !== left.contributionScore) return right.contributionScore - left.contributionScore;
        return toMillis(right?.latestActivityAt) - toMillis(left?.latestActivityAt);
      });

    const overdueTasks = departmentTasks
      .filter((task) => {
        const dueAt = toMillis(task?.dueAt);
        return dueAt > 0 && dueAt < now && !FINISHED_TASK_STATUSES.has(task?.status);
      })
      .map((task) => ({
        ...task,
        overdueDays: Math.max(1, Math.floor((now - toMillis(task?.dueAt)) / (1000 * 60 * 60 * 24))),
      }))
      .sort((left, right) => toMillis(left?.dueAt) - toMillis(right?.dueAt));

    const reviewBottlenecks = reviewableTaskQueue
      .filter((item) => item?.state && item.state !== "approved")
      .map((item) => ({
        ...item,
        ageDays: Math.max(0, Math.floor((now - Math.max(toMillis(item?.updatedAt), toMillis(item?.createdAt))) / (1000 * 60 * 60 * 24))),
      }))
      .sort((left, right) => right.ageDays - left.ageDays || toMillis(right?.updatedAt) - toMillis(left?.updatedAt));

    const activeScopes = managementScopes
      .filter((item) => item?.status !== "revoked")
      .sort((left, right) => toMillis(right?.updatedAt || right?.createdAt) - toMillis(left?.updatedAt || left?.createdAt));

    const taskStatusSummary = departmentTasks.reduce(
      (acc, task) => {
        const status = String(task?.status || "draft");
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      { draft: 0, open: 0, "in-progress": 0, submitted: 0, "needs-revision": 0, approved: 0, closed: 0 },
    );

    return {
      activeScopes,
      departmentRows,
      districtRows,
      memberLeaderboard,
      overdueTasks,
      pathRows,
      reviewBottlenecks,
      subdepartmentRows,
      taskStatusSummary,
      trends: Array.from(trendMap.values()),
    };
  }, [departmentTasks, managementScopes, reportingSnapshots, reviewableTaskQueue, taskSubmissions]);

  const maxTrendValue = Math.max(
    1,
    ...derived.trends.flatMap((item) => [item.created, item.submitted, item.approved]),
  );

  const overviewCards = [
    {
      id: "open",
      label: lang === "bn" ? "ওপেন টাস্ক" : "Open tasks",
      value: derived.taskStatusSummary.open + derived.taskStatusSummary["in-progress"] + derived.taskStatusSummary.draft,
      hint: lang === "bn" ? "স্কোপড ডেলিভারি ওয়ার্ক" : "scoped delivery work",
      icon: Activity,
    },
    {
      id: "pending",
      label: lang === "bn" ? "রিভিউ অপেক্ষায়" : "Pending review",
      value: reviewableTaskQueue.filter((item) => item?.state && item.state !== "approved").length,
      hint: lang === "bn" ? "ম্যানেজার/অ্যাডমিন কিউ" : "manager/admin queue",
      icon: ShieldCheck,
    },
    {
      id: "overdue",
      label: lang === "bn" ? "ওভারডিউ" : "Overdue",
      value: derived.overdueTasks.length,
      hint: lang === "bn" ? "ডেডলাইন পেরিয়েছে" : "past due date",
      icon: Clock3,
    },
    {
      id: "districts",
      label: lang === "bn" ? "অ্যাকটিভ জেলা" : "Active districts",
      value: derived.districtRows.filter((item) => item.memberCount > 0).length,
      hint: lang === "bn" ? "৬৪ জেলার উপস্থিতি" : "presence across districts",
      icon: MapPinned,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map((card) => (
          <Card key={card.id} className="border-none bg-background/60 shadow-premium">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">{card.label}</div>
                <div className="mt-3 text-3xl font-black">{card.value}</div>
                <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{card.hint}</div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/10 bg-primary/10">
                <card.icon className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr,0.7fr]">
        <Card className="border-none bg-background/60 shadow-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              {lang === "bn" ? "টাস্ক ট্রেন্ড" : "Task Trends"}
            </CardTitle>
            <CardDescription>
              {lang === "bn"
                ? "গত ৭ দিনে task create, submission, আর approval এর গতি।"
                : "The last 7 days of task creation, submissions, and approvals."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-3">
              {derived.trends.map((item) => (
                <div key={item.key} className="rounded-2xl border border-muted-foreground/10 bg-background/80 p-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">{item.label}</div>
                  <div className="mt-3 grid gap-3">
                    {[
                      { key: "created", labelEn: "Created", labelBn: "নতুন", value: item.created, tone: "bg-sky-500" },
                      { key: "submitted", labelEn: "Submitted", labelBn: "জমা", value: item.submitted, tone: "bg-amber-500" },
                      { key: "approved", labelEn: "Approved", labelBn: "অনুমোদিত", value: item.approved, tone: "bg-emerald-500" },
                    ].map((metric) => (
                      <div key={metric.key}>
                        <div className="mb-1 flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                          <span>{lang === "bn" ? metric.labelBn : metric.labelEn}</span>
                          <span>{metric.value}</span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-muted/50">
                          <div
                            className={`h-full rounded-full ${metric.tone}`}
                            style={{ width: `${Math.max(metric.value ? 10 : 0, Math.round((metric.value / maxTrendValue) * 100))}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-background/60 shadow-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {lang === "bn" ? "ম্যানেজমেন্ট কভারেজ" : "Management Coverage"}
            </CardTitle>
            <CardDescription>
              {lang === "bn"
                ? "কে কোন scope সামলাচ্ছেন তা দ্রুত দেখুন।"
                : "See which managers are covering which scopes."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {derived.activeScopes.length ? (
              derived.activeScopes.slice(0, 8).map((item) => (
                <div key={item.scopeId} className="rounded-2xl border border-muted-foreground/10 bg-background/80 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold">{item.managerName || item.managerUid}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {getRoleLabel(item.role, lang)} · {getScopeCoverageLabel(item, lang)}
                      </div>
                    </div>
                    <Badge variant="outline" className="border-primary/20 bg-primary/5 text-[10px] font-black uppercase tracking-[0.18em] text-primary">
                      {item.scopeType}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-muted-foreground/20 px-6 py-12 text-center text-sm font-semibold text-muted-foreground">
                {lang === "bn" ? "এখনও কোনো সক্রিয় স্কোপ নেই।" : "No active scopes yet."}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs value={view} onValueChange={setView} className="space-y-6">
        <TabsList className="h-auto flex-wrap rounded-2xl border border-muted-foreground/10 bg-muted/30 p-1.5">
          <TabsTrigger value="department" className="rounded-xl px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.18em]">
            {lang === "bn" ? "ডিপার্টমেন্ট" : "Department"}
          </TabsTrigger>
          <TabsTrigger value="subdepartment" className="rounded-xl px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.18em]">
            {lang === "bn" ? "সাবডিপার্টমেন্ট" : "Subdepartment"}
          </TabsTrigger>
          <TabsTrigger value="path" className="rounded-xl px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.18em]">
            {lang === "bn" ? "পাথ" : "Path"}
          </TabsTrigger>
          <TabsTrigger value="member" className="rounded-xl px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.18em]">
            {lang === "bn" ? "মেম্বার" : "Member"}
          </TabsTrigger>
          <TabsTrigger value="district" className="rounded-xl px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.18em]">
            {lang === "bn" ? "জেলা" : "District"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="department">
          <Card className="border-none bg-background/60 shadow-premium">
            <CardHeader>
              <CardTitle>{lang === "bn" ? "ডিপার্টমেন্ট হেলথ" : "Department Health"}</CardTitle>
              <CardDescription>{lang === "bn" ? "কমপ্লিশন, pending review, আর member activity একসাথে।" : "Completion, pending review, and member activity in one view."}</CardDescription>
            </CardHeader>
            <CardContent className="rounded-2xl border border-muted-foreground/10 bg-background/80 p-0">
              <Table>
                <TableHeader><TableRow><TableHead>{lang === "bn" ? "ডিপার্টমেন্ট" : "Department"}</TableHead><TableHead>{lang === "bn" ? "মেম্বার" : "Members"}</TableHead><TableHead>{lang === "bn" ? "কমপ্লিশন" : "Completion"}</TableHead><TableHead>{lang === "bn" ? "পেন্ডিং" : "Pending"}</TableHead><TableHead>{lang === "bn" ? "অনুমোদিত" : "Approved"}</TableHead></TableRow></TableHeader>
                <TableBody>
                  {derived.departmentRows.map((item) => (
                    <TableRow key={item.departmentId}>
                      <TableCell><div className="font-semibold">{lang === "bn" ? item.departmentTitleBn : item.departmentTitleEn}</div><div className="mt-1 text-xs text-muted-foreground">{item.activeMemberCount} {lang === "bn" ? "সক্রিয়" : "active"}</div></TableCell>
                      <TableCell className="font-black">{item.memberCount}</TableCell>
                      <TableCell className="min-w-[220px]"><div className="mb-2 flex items-center justify-between text-xs font-semibold text-muted-foreground"><span>{item.avgLessonCompletionRate || 0}%</span><span>{item.avgModuleCompletionRate || 0}%</span></div><Progress value={item.avgLessonCompletionRate || 0} className="h-2.5" /></TableCell>
                      <TableCell className="font-black text-amber-600">{item.submissionPendingCount || 0}</TableCell>
                      <TableCell className="font-black text-emerald-600">{item.taskApprovedCount || 0}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subdepartment">
          <Card className="border-none bg-background/60 shadow-premium">
            <CardHeader>
              <CardTitle>{lang === "bn" ? "সাবডিপার্টমেন্ট রিপোর্ট" : "Subdepartment Report"}</CardTitle>
              <CardDescription>{lang === "bn" ? "ডিপার্টমেন্টের ভেতরের execution pockets দেখুন।" : "See execution pockets inside each department."}</CardDescription>
            </CardHeader>
            <CardContent className="rounded-2xl border border-muted-foreground/10 bg-background/80 p-0">
              <Table>
                <TableHeader><TableRow><TableHead>{lang === "bn" ? "সাবডিপার্টমেন্ট" : "Subdepartment"}</TableHead><TableHead>{lang === "bn" ? "মেম্বার" : "Members"}</TableHead><TableHead>{lang === "bn" ? "ওপেন টাস্ক" : "Open Tasks"}</TableHead><TableHead>{lang === "bn" ? "রিভিউ" : "Review"}</TableHead><TableHead>{lang === "bn" ? "কমপ্লিশন" : "Completion"}</TableHead></TableRow></TableHeader>
                <TableBody>
                  {derived.subdepartmentRows.length ? derived.subdepartmentRows.map((item) => (
                    <TableRow key={item.subdepartmentId}>
                      <TableCell><div className="font-semibold">{lang === "bn" ? item.subdepartmentTitleBn : item.subdepartmentTitleEn}</div><div className="mt-1 text-xs text-muted-foreground">{lang === "bn" ? item.departmentTitleBn : item.departmentTitleEn}</div></TableCell>
                      <TableCell className="font-black">{item.memberCount}</TableCell>
                      <TableCell className="font-black text-primary">{item.taskOpenCount}</TableCell>
                      <TableCell className="font-black text-amber-600">{item.submissionPendingCount}</TableCell>
                      <TableCell><div className="mb-2 text-xs font-semibold text-muted-foreground">{item.avgLessonCompletionRate || 0}%</div><Progress value={item.avgLessonCompletionRate || 0} className="h-2.5" /></TableCell>
                    </TableRow>
                  )) : <TableRow><TableCell colSpan={5} className="py-12 text-center text-sm font-semibold text-muted-foreground">{lang === "bn" ? "সাবডিপার্টমেন্ট snapshot এখনো তৈরি হয়নি।" : "No subdepartment snapshots yet."}</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="path">
          <Card className="border-none bg-background/60 shadow-premium">
            <CardHeader>
              <CardTitle>{lang === "bn" ? "পাথ পারফরম্যান্স" : "Path Performance"}</CardTitle>
              <CardDescription>{lang === "bn" ? "শিখন কমপ্লিশন, task load, আর blockers একসাথে।" : "Learning completion, task load, and blockers together."}</CardDescription>
            </CardHeader>
            <CardContent className="rounded-2xl border border-muted-foreground/10 bg-background/80 p-0">
              <Table>
                <TableHeader><TableRow><TableHead>{lang === "bn" ? "পাথ" : "Path"}</TableHead><TableHead>{lang === "bn" ? "মেম্বার" : "Members"}</TableHead><TableHead>{lang === "bn" ? "কমপ্লিশন" : "Completion"}</TableHead><TableHead>{lang === "bn" ? "টাস্ক" : "Tasks"}</TableHead><TableHead>{lang === "bn" ? "ব্লকার" : "Blocked"}</TableHead></TableRow></TableHeader>
                <TableBody>
                  {derived.pathRows.map((item) => (
                    <TableRow key={item.pathId}>
                      <TableCell><div className="font-semibold">{getPathLabel(item.pathId, lang)}</div><div className="mt-1 text-xs text-muted-foreground">{item.pathId}</div></TableCell>
                      <TableCell className="font-black">{item.memberCount || 0}</TableCell>
                      <TableCell><div className="mb-2 text-xs font-semibold text-muted-foreground">{item.lessonCompletionRate || 0}%</div><Progress value={item.lessonCompletionRate || 0} className="h-2.5" /></TableCell>
                      <TableCell className="font-black">{item.assignedTaskCount || 0}</TableCell>
                      <TableCell className="font-black text-amber-600">{item.blockedTaskCount || 0}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="member">
          <Card className="border-none bg-background/60 shadow-premium">
            <CardHeader>
              <CardTitle>{lang === "bn" ? "মেম্বার কন্ট্রিবিউশন বোর্ড" : "Member Contribution Board"}</CardTitle>
              <CardDescription>{lang === "bn" ? "completion + approved work + recent activity দিয়ে র‍্যাংক।" : "Ranked by completion, approved work, and recent activity."}</CardDescription>
            </CardHeader>
            <CardContent className="rounded-2xl border border-muted-foreground/10 bg-background/80 p-0">
              <Table>
                <TableHeader><TableRow><TableHead>{lang === "bn" ? "মেম্বার" : "Member"}</TableHead><TableHead>{lang === "bn" ? "পাথ" : "Path"}</TableHead><TableHead>{lang === "bn" ? "কমপ্লিশন" : "Completion"}</TableHead><TableHead>{lang === "bn" ? "অনুমোদিত" : "Approved"}</TableHead><TableHead>{lang === "bn" ? "সর্বশেষ অ্যাক্টিভিটি" : "Latest Activity"}</TableHead></TableRow></TableHeader>
                <TableBody>
                  {derived.memberLeaderboard.length ? derived.memberLeaderboard.slice(0, 12).map((item) => (
                    <TableRow key={item.uid}>
                      <TableCell><div className="font-semibold">{item.displayName || item.uid}</div><div className="mt-1 text-xs text-muted-foreground">{item.districtId || "--"}</div></TableCell>
                      <TableCell>{getPathLabel(item.pathId, lang)}</TableCell>
                      <TableCell className="font-black text-primary">{item.completionRate || 0}%</TableCell>
                      <TableCell className="font-black text-emerald-600">{item.approvedTaskCount || 0}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{item.latestActivityAt ? formatDateTime(item.latestActivityAt) : "--"}</TableCell>
                    </TableRow>
                  )) : <TableRow><TableCell colSpan={5} className="py-12 text-center text-sm font-semibold text-muted-foreground">{lang === "bn" ? "মেম্বার রিপোর্ট এখনো নেই।" : "No member reporting data yet."}</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="district">
          <Card className="border-none bg-background/60 shadow-premium">
            <CardHeader>
              <CardTitle>{lang === "bn" ? "জেলা ভিত্তিক ভিজিবিলিটি" : "District Visibility"}</CardTitle>
              <CardDescription>{lang === "bn" ? "৬৪ জেলার সদস্য উপস্থিতি ও execution signals।" : "Member presence and execution signals across districts."}</CardDescription>
            </CardHeader>
            <CardContent className="rounded-2xl border border-muted-foreground/10 bg-background/80 p-0">
              <Table>
                <TableHeader><TableRow><TableHead>{lang === "bn" ? "জেলা" : "District"}</TableHead><TableHead>{lang === "bn" ? "মেম্বার" : "Members"}</TableHead><TableHead>{lang === "bn" ? "সক্রিয়" : "Active"}</TableHead><TableHead>{lang === "bn" ? "কমপ্লিশন" : "Completion"}</TableHead><TableHead>{lang === "bn" ? "রিভিশন" : "Revision"}</TableHead></TableRow></TableHeader>
                <TableBody>
                  {derived.districtRows.length ? derived.districtRows.map((item) => (
                    <TableRow key={item.districtId}>
                      <TableCell className="font-semibold">{lang === "bn" ? item.districtTitleBn : item.districtTitleEn}</TableCell>
                      <TableCell className="font-black">{item.memberCount}</TableCell>
                      <TableCell className="font-black text-primary">{item.activeMemberCount}</TableCell>
                      <TableCell className="font-black">{item.avgCompletionRate || 0}%</TableCell>
                      <TableCell className="font-black text-amber-600">{item.needsRevisionTaskCount || 0}</TableCell>
                    </TableRow>
                  )) : <TableRow><TableCell colSpan={5} className="py-12 text-center text-sm font-semibold text-muted-foreground">{lang === "bn" ? "জেলা ডেটা এখনো নেই।" : "No district data yet."}</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-6 xl:grid-cols-[1fr,1fr]">
        <Card className="border-none bg-background/60 shadow-premium">
          <CardHeader>
            <CardTitle>{lang === "bn" ? "ওভারডিউ টাস্ক" : "Overdue Tasks"}</CardTitle>
            <CardDescription>{lang === "bn" ? "যেগুলো deadline পার করেছে কিন্তু এখনো closed হয়নি।" : "Tasks that have passed their due date and are still open."}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {derived.overdueTasks.length ? derived.overdueTasks.slice(0, 8).map((item) => (
              <div key={item.taskId} className="rounded-2xl border border-muted-foreground/10 bg-background/80 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div><div className="font-semibold">{lang === "bn" ? item.titleBn || item.titleEn : item.titleEn || item.titleBn}</div><div className="mt-1 text-xs text-muted-foreground">{getPathLabel(item.pathId, lang)}</div></div>
                  <Badge variant="warning" className="border-none text-[10px] font-black uppercase tracking-[0.18em]">{lang === "bn" ? `${item.overdueDays} দিন` : `${item.overdueDays}d`}</Badge>
                </div>
                <div className="mt-3 text-xs text-muted-foreground">{item.dueAt ? formatDateTime(item.dueAt) : "--"}</div>
              </div>
            )) : <div className="rounded-2xl border border-dashed border-muted-foreground/20 px-6 py-12 text-center text-sm font-semibold text-muted-foreground">{lang === "bn" ? "এখন কোনো overdue task নেই।" : "No overdue tasks right now."}</div>}
          </CardContent>
        </Card>

        <Card className="border-none bg-background/60 shadow-premium">
          <CardHeader>
            <CardTitle>{lang === "bn" ? "রিভিউ বটলনেক" : "Review Bottlenecks"}</CardTitle>
            <CardDescription>{lang === "bn" ? "যেগুলো review queue-তে বেশি দিন আটকে আছে।" : "The items spending the longest time in the review queue."}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {derived.reviewBottlenecks.length ? derived.reviewBottlenecks.slice(0, 8).map((item) => (
              <div key={item.queueId} className="rounded-2xl border border-muted-foreground/10 bg-background/80 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div><div className="font-semibold">{item.memberName || item.uid}</div><div className="mt-1 text-xs text-muted-foreground">{getPathLabel(item.pathId, lang)}</div></div>
                  <Badge variant="outline" className="border-primary/20 bg-primary/5 text-[10px] font-black uppercase tracking-[0.18em] text-primary">{item.state}</Badge>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground"><span>{item.latestFeedbackSnippet || (lang === "bn" ? "ফিডব্যাক অপেক্ষায়" : "Waiting for feedback")}</span><span>{lang === "bn" ? `${item.ageDays} দিন` : `${item.ageDays}d`}</span></div>
              </div>
            )) : <div className="rounded-2xl border border-dashed border-muted-foreground/20 px-6 py-12 text-center text-sm font-semibold text-muted-foreground">{lang === "bn" ? "রিভিউ কিউ পরিষ্কার আছে।" : "The review queue is currently clear."}</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
