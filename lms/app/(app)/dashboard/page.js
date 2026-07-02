"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpenCheck, CheckCircle2, Medal, Sparkles, Sun, Sunset, Moon, Megaphone, FileCheck2 } from "lucide-react";
import { WeeklyDepartmentLeaderboard } from "@/components/leaderboards/weekly-department-leaderboard";
import { WorkspaceBreadcrumbs } from "@/components/layout/workspace-breadcrumbs";
import { AnimatedBlock, AnimatedScale } from "@/components/ui/animated-block";
import { EquityProgressRing } from "@/components/ui/equity-progress-ring";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyStateCard } from "@/components/ui/empty-state-card";
import {
  DEPARTMENT_OPTIONS,
  canBrowseAllDepartments,
  getCoursePreviewDescription,
  getDepartmentTitle,
  getParentTitle,
  sanitizeAssignedResourceText,
} from "@/lib/catalog";
import { formatDate, formatDateTime } from "@/lib/date";
import { statusLabel, statusVariant } from "@/lib/display";
import {
  fetchAllAnnouncements,
  fetchAnnouncements,
  fetchDepartmentCourses,
  fetchDepartments,
  fetchDepartmentWeeklyLeaderboard,
  fetchOpenTasks,
  fetchRecentSubmissions,
  fetchUserCertificates,
  fetchUserLedger,
  fetchUserSubmissions,
  saveDepartmentSelection,
} from "@/lib/firestore/lms";
import { getRoleGuide } from "@/lib/role-guides-clean";
import { AiGuideModal } from "@/components/layout/ai-guide-modal";

function StatCard({ title, value, description, icon: Icon, tint = "primary" }) {
  const tintMap = {
    primary: "bg-primary/10 text-primary",
    gold: "bg-gold-subtle text-amber-700 dark:bg-gold-subtle dark:text-amber-300",
    blue: "bg-secondary/15 text-secondary dark:text-secondary",
    success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  };
  const iconBg = tintMap[tint] || tintMap.primary;
  return (
    <Card className="glass-premium hover-lift group rounded-[1.75rem] border-0 shadow-xl transition-all duration-300">
      <CardContent className="flex items-center gap-4 p-5">
        {Icon ? (
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${iconBg}`}>
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground/80">{title}</p>
          <p className="mt-1 text-2xl font-black tabular-nums tracking-tighter sm:text-3xl">{value}</p>
          {description ? <p className="mt-0.5 text-xs text-muted-foreground/70 italic">{description}</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}

function GreetingBanner({ name }) {
  const { copy } = useLocale();
  const hour = new Date().getHours();
  let greeting, Icon;
  if (hour < 12) { greeting = copy("Good morning", "শুভ সকাল"); Icon = Sun; }
  else if (hour < 17) { greeting = copy("Good afternoon", "শুভ অপরাহ্ন"); Icon = Sunset; }
  else { greeting = copy("Good evening", "শুভ সন্ধ্যা"); Icon = Moon; }
  const firstName = name?.split(" ")?.[0] || "";
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="glass-premium mesh-premium hover-glow relative flex items-center gap-4 overflow-hidden rounded-[2rem] border-0 px-6 py-5 shadow-2xl"
    >
      <motion.div 
        animate={{ x: ["-100%", "200%"] }} 
        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        className="absolute top-0 inset-x-0 h-px w-1/2 bg-gradient-to-r from-transparent via-primary/50 to-transparent" 
      />
      <motion.div 
        whileHover={{ rotate: 15, scale: 1.1 }}
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"
      >
        <Icon className="h-7 w-7" />
      </motion.div>
      <div className="min-w-0">
        <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground">
          {greeting}{firstName ? `, ${firstName}` : ""}!
        </h1>
        <p className="text-sm font-medium text-muted-foreground/80">{copy("Welcome back to your workspace.", "আপনার workspace-এ স্বাগতম।")}</p>
      </div>
    </motion.div>
  );
}

function DashboardAction({ title, description, href, label, variant = "outline" }) {
  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="glass-premium hover-glow group relative overflow-hidden rounded-[2rem] border border-transparent hover:border-primary/20 bg-card/40 p-6 shadow-xl"
    >
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary/40 group-hover:bg-primary transition-all duration-300" />
      <div className="pl-2 relative z-10">
        <h3 className="text-lg font-black tracking-tight">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground/90">{description}</p>
        <Button className="mt-5 w-full transition-all active:scale-95 sm:w-auto rounded-xl shadow-lg group-hover:border-primary/50 group-hover:bg-primary/5" variant={variant} asChild>
          <Link href={href}>
            {label}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}

function ReadinessChecklistItem({ done, title, description, href, label }) {
  return (
    <div className={`interactive-tile rounded-[1.5rem] border p-4 transition-all duration-200 ${done ? "border-primary/30 bg-primary/5 dark:bg-primary/10" : "border-border/60 bg-card hover:bg-muted/40"
      }`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold shadow-sm ${done ? "bg-primary text-primary-foreground shadow-glow" : "bg-muted text-muted-foreground"
          }`}>
          {done ? "✓" : "•"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">{title}</h3>
            <Badge variant={done ? "success" : "outline"}>{done ? "Ready" : "Next"}</Badge>
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
          <Button className="mt-3 h-9 rounded-xl" variant="outline" size="sm" asChild>
            <Link href={href}>
              {label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const authState = useAuth();
  const { copy } = useLocale();
  const { user, profile, role, canManage, canReview } = authState;
  const roleGuide = getRoleGuide(role);
  const canBrowseAnyDepartment = canBrowseAllDepartments(role);

  const [departments, setDepartments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departmentId, setDepartmentId] = useState(profile?.departmentId || "");
  const [leaderboardDepartmentFilter, setLeaderboardDepartmentFilter] = useState(profile?.departmentId || "");
  const [saveMessage, setSaveMessage] = useState("");
  const [departmentSaving, setDepartmentSaving] = useState(false);
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const leaderboardDepartmentId = canBrowseAnyDepartment
    ? (leaderboardDepartmentFilter || profile?.departmentId || "")
    : (profile?.departmentId || "");

  useEffect(() => {
    setDepartmentId(profile?.departmentId || "");
  }, [profile?.departmentId]);

  useEffect(() => {
    if (!canBrowseAnyDepartment) {
      setLeaderboardDepartmentFilter(profile?.departmentId || "");
      return;
    }

    setLeaderboardDepartmentFilter((current) => current || profile?.departmentId || DEPARTMENT_OPTIONS[0]?.id || "");
  }, [canBrowseAnyDepartment, profile?.departmentId]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!user?.uid) {
        if (active) setLoading(false);
        return;
      }

      if (!profile?.departmentId && canBrowseAnyDepartment) {
        const [nextDepartments, nextAnnouncements, nextSubmissions] = await Promise.all([
          fetchDepartments(),
          fetchAllAnnouncements(6),
          fetchRecentSubmissions(8),
        ]);
        if (!active) return;
        setDepartments(nextDepartments);
        if (!departmentId) {
          setDepartmentId(nextDepartments[0]?.id || DEPARTMENT_OPTIONS[0]?.id || "");
        }
        setAnnouncements(nextAnnouncements);
        setSubmissions(nextSubmissions);
        setTasks([]);
        setCourses([]);
        setLedger([]);
        setLoading(false);
        return;
      }

      if (!profile?.departmentId) {
        if (active) setLoading(false);
        return;
      }

      const [nextAnnouncements, nextTasks, nextCourses, nextSubmissions, nextLedger, nextCertificates] = await Promise.all([
        fetchAnnouncements(["global", `department:${profile.departmentId}`], 4),
        fetchOpenTasks(profile.departmentId, 4),
        fetchDepartmentCourses(profile.departmentId).then((items) => items.slice(0, 3)),
        fetchUserSubmissions(user.uid).then((items) => items.slice(0, 4)),
        fetchUserLedger(user.uid, 5),
        fetchUserCertificates(user.email).then((items) => items.slice(0, 3)),
      ]);

      if (!active) return;
      setAnnouncements(nextAnnouncements);
      setTasks(nextTasks);
      setCourses(nextCourses);
      setSubmissions(nextSubmissions);
      setLedger(nextLedger);
      setCertificates(nextCertificates);
      setLoading(false);
    };

    load().catch(() => {
      if (active) setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [canBrowseAnyDepartment, profile?.departmentId, user?.uid]);

  useEffect(() => {
    let active = true;

    const loadLeaderboard = async () => {
      if (!user?.uid || !leaderboardDepartmentId) {
        if (active) {
          setWeeklyLeaderboard(null);
          setLeaderboardLoading(false);
        }
        return;
      }

      setLeaderboardLoading(true);
      try {
        const nextLeaderboard = await fetchDepartmentWeeklyLeaderboard({
          departmentId: leaderboardDepartmentId,
          limitCount: canBrowseAnyDepartment ? 6 : 5,
        });
        if (!active) return;
        setWeeklyLeaderboard(nextLeaderboard);
      } catch {
        if (!active) return;
        setWeeklyLeaderboard(null);
      } finally {
        if (active) {
          setLeaderboardLoading(false);
        }
      }
    };

    loadLeaderboard();

    return () => {
      active = false;
    };
  }, [canBrowseAnyDepartment, leaderboardDepartmentId, user?.uid]);

  const dashboardTrail = [{ href: null, en: "Dashboard", bn: "ড্যাশবোর্ড" }];

  const stats = useMemo(
    () => [
      {
        title: copy("Official points", "অফিশিয়াল পয়েন্ট"),
        value: profile?.totalPoints || 0,
        description: copy("Approved contributions only", "শুধু approved contribution"),
        icon: Medal,
        tint: "gold",
      },
      {
        title: copy("Completed tasks", "সম্পন্ন টাস্ক"),
        value: profile?.completedTaskCount || 0,
        description: copy("Approved completions", "Approved completion সংখ্যা"),
        icon: CheckCircle2,
        tint: "success",
      },
    ],
    [copy, profile?.completedTaskCount, profile?.totalPoints],
  );

  const readinessChecklist = useMemo(() => {
    if (canBrowseAnyDepartment) {
      return [
        {
          key: "departments",
          done: departments.length > 0,
          title: copy("Department visibility ready", "ডিপার্টমেন্ট ভিজিবিলিটি রেডি"),
          description: copy(
            "Keep one place open where you can inspect any department before stepping into review or management.",
            "review বা management-এ যাওয়ার আগে এক জায়গা থেকে সব department inspect করতে পারবেন কিনা তা নিশ্চিত রাখুন।",
          ),
          href: "/department",
          label: copy("Open departments", "ডিপার্টমেন্ট খুলুন"),
        },
        {
          key: "review",
          done: canReview,
          title: copy("Review path ready", "রিভিউ পাথ রেডি"),
          description: copy(
            "Use the review queue to catch blockers early and keep work moving across departments.",
            "review queue ব্যবহার করে blocker আগে ধরুন এবং department জুড়ে কাজ এগিয়ে নিন।",
          ),
          href: "/review",
          label: copy("Open review queue", "রিভিউ কিউ খুলুন"),
        },
        {
          key: "manage",
          done: canManage,
          title: copy("Management path ready", "ম্যানেজমেন্ট পাথ রেডি"),
          description: copy(
            "Roles, attendance, announcements, curriculum, and certificates should stay coordinated from one control center.",
            "role, attendance, announcement, curriculum, আর certificate যেন এক control center থেকে coordinated থাকে।",
          ),
          href: "/manage",
          label: copy("Open management", "ম্যানেজমেন্ট খুলুন"),
        },
        {
          key: "activity",
          done: submissions.length > 0 || announcements.length > 0,
          title: copy("Operational activity visible", "অপারেশনাল activity visible"),
          description: copy(
            "Recent submissions and announcements should stay visible so you can intervene before work stalls.",
            "সাম্প্রতিক submission আর announcement visible রাখুন, যাতে কাজ আটকে যাওয়ার আগেই intervene করা যায়।",
          ),
          href: "/announcements",
          label: copy("Open updates", "আপডেট খুলুন"),
        },
      ];
    }

    return [
      {
        key: "department",
        done: Boolean(profile?.departmentId),
        title: copy("Department mapped", "ডিপার্টমেন্ট ম্যাপড"),
        description: copy(
          "One clear department keeps your lessons, tasks, mentors, and announcements aligned.",
          "একটি পরিষ্কার department থাকলে lesson, task, mentor, আর announcement aligned থাকে।",
        ),
        href: "/department",
        label: copy("Check department", "ডিপার্টমেন্ট দেখুন"),
      },
      {
        key: "courses",
        done: courses.length > 0,
        title: copy("Learning path visible", "লার্নিং পাথ visible"),
        description: copy(
          "Your published course path should be visible before you start submitting proof.",
          "proof submit করার আগে আপনার published course path visible থাকা উচিত।",
        ),
        href: "/courses",
        label: copy("Open courses", "কোর্স খুলুন"),
      },
      {
        key: "proof",
        done: tasks.length > 0 || submissions.length > 0,
        title: copy("Proof workflow started", "প্রুফ workflow শুরু"),
        description: copy(
          "Open tasks, submit visible proof, and keep revision or approval records flowing.",
          "task খুলুন, visible proof submit করুন, আর revision বা approval record চালু রাখুন।",
        ),
        href: "/task",
        label: copy("Open tasks", "টাস্ক খুলুন"),
      },
      {
        key: "records",
        done: Number(profile?.totalPoints || 0) > 0 || ledger.length > 0,
        title: copy("Official record started", "অফিশিয়াল রেকর্ড শুরু"),
        description: copy(
          "Approved ledger-backed points confirm that your contribution is now part of the official record.",
          "approved ledger-backed point দেখায় যে আপনার contribution এখন official record-এর অংশ।",
        ),
        href: "/points",
        label: copy("Open points", "পয়েন্ট খুলুন"),
      },
    ];
  }, [
    announcements.length,
    canBrowseAnyDepartment,
    canManage,
    canReview,
    copy,
    courses.length,
    departments.length,
    ledger.length,
    profile?.departmentId,
    profile?.totalPoints,
    submissions.length,
    tasks.length,
  ]);

  const handleDepartmentSave = async () => {
    setSaveMessage("");
    setDepartmentSaving(true);
    try {
      await saveDepartmentSelection(user, departmentId);
      setSaveMessage(
        profile?.departmentId
          ? copy(
            "Department updated successfully. Your LMS scope will refresh automatically.",
            "ডিপার্টমেন্ট সফলভাবে আপডেট হয়েছে। আপনার LMS scope এখন নিজে থেকে refresh হবে।",
          )
          : copy("Department saved successfully.", "ডিপার্টমেন্ট সফলভাবে সংরক্ষণ করা হয়েছে।"),
      );
    } catch (error) {
      setSaveMessage(
        error?.message ||
        (profile?.departmentId
          ? copy("Could not update the department.", "ডিপার্টমেন্ট আপডেট করা যায়নি।")
          : copy("Could not save department.", "ডিপার্টমেন্ট সংরক্ষণ করা যায়নি.")),
      );
    } finally {
      setDepartmentSaving(false);
    }
  };

  if (!profile?.departmentId && !canBrowseAnyDepartment) {
    return (
      <div className="space-y-6">
        <WorkspaceBreadcrumbs items={dashboardTrail} />
        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <Card className="bg-card/80 backdrop-blur-xl border shadow-xl rounded-[2rem]">
            <CardHeader>
              <CardTitle>{copy("Choose your department", "আপনার ডিপার্টমেন্ট বেছে নিন")}</CardTitle>
              <CardDescription className="text-base leading-7">
                {copy(
                  "One department opens your exact course, lessons, proof tasks, mentors, and announcements.",
                  "একটি ডিপার্টমেন্ট বেছে নিলেই আপনার সঠিক course, lesson, proof task, mentor, আর announcement খুলে যাবে।",
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="department-select">{copy("Department", "ডিপার্টমেন্ট")}</Label>
                <Select value={departmentId} onValueChange={setDepartmentId}>
                  <SelectTrigger id="department-select">
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
              <Button
                className="w-full"
                disabled={!departmentId || departmentSaving}
                onClick={handleDepartmentSave}
              >
                {departmentSaving
                  ? copy("Saving department...", "ডিপার্টমেন্ট সংরক্ষণ হচ্ছে...")
                  : copy("Save department", "ডিপার্টমেন্ট সংরক্ষণ করুন")}
              </Button>
              {saveMessage ? <p className="text-sm text-muted-foreground">{saveMessage}</p> : null}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-card/80 backdrop-blur-xl border shadow-xl rounded-[2rem]">
              <CardHeader>
                <Badge variant="subtle" className="w-fit rounded-full px-4 py-1.5 text-sm">
                  {copy("What happens next", "এরপর কী হবে")}
                </Badge>
                <CardTitle className="text-3xl">{copy("A clean member workflow", "একটি পরিষ্কার member workflow")}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <DashboardAction title={copy("Open your course", "কোর্স খুলুন")} description={copy("Your department course becomes visible immediately.", "ডিপার্টমেন্ট course সঙ্গে সঙ্গেই visible হবে।")} href="/courses" label={copy("See courses", "কোর্স দেখুন")} />
                <DashboardAction title={copy("Finish lessons", "লেসন শেষ করুন")} description={copy("Each lesson points to one real learning resource only.", "প্রতিটি lesson শুধু একটি real learning resource-এর দিকে যাবে।")} href="/lesson" label={copy("Open lessons", "লেসন খুলুন")} />
                <DashboardAction title={copy("Submit proof", "প্রুফ জমা দিন")} description={copy("After each lesson, submit your visible proof from the task page.", "প্রতিটি lesson-এর পর task page থেকে visible proof জমা দিন।")} href="/task" label={copy("Open tasks", "টাস্ক খুলুন")} />
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-xl border shadow-xl rounded-[2rem]">
              <CardHeader>
                <CardTitle>{copy("Your first three steps", "আপনার প্রথম তিনটি ধাপ")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {roleGuide.steps.map((step, index) => (
                  <div key={step.en} className="flex items-start gap-3 rounded-2xl border bg-background/80 p-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {index + 1}
                    </div>
                    <p className="pt-1 text-sm leading-6 text-muted-foreground">{copy(step.en, step.bn)}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!profile?.departmentId && canBrowseAnyDepartment) {
    const totalMembers = departments.reduce((sum, item) => sum + Number(item.memberCount || 0), 0);

    return (
      <div className="space-y-6">
        <WorkspaceBreadcrumbs items={dashboardTrail} />
        <Card className="bg-card/80 backdrop-blur-xl border shadow-xl rounded-[2rem]">
          <CardHeader>
            <Badge variant="subtle" className="w-fit rounded-full px-4 py-1.5 text-sm">
              {copy("Global command center", "গ্লোবাল কমান্ড সেন্টার")}
            </Badge>
            <CardTitle className="text-3xl">{copy("Run the platform clearly", "প্ল্যাটফর্ম পরিষ্কারভাবে চালান")}</CardTitle>
            <CardDescription className="text-base leading-7">{copy(roleGuide.today.en, roleGuide.today.bn)}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-4">
            <StatCard title={copy("Departments", "ডিপার্টমেন্ট")} value={departments.length} description={copy("Active departments.", "সক্রিয় ডিপার্টমেন্টের সংখ্যা।")} />
            <StatCard title={copy("Mapped members", "ম্যাপড মেম্বার")} value={totalMembers} description={copy("Users currently mapped into departments.", "বর্তমানে ডিপার্টমেন্টে ম্যাপ করা ইউজার।")} />
            <StatCard title={copy("Recent submissions", "সাম্প্রতিক সাবমিশন")} value={submissions.length} description={copy("Fresh work across the LMS.", "পুরো LMS-এর সাম্প্রতিক কাজ।")} />
            <StatCard title={copy("Announcements", "ঘোষণা")} value={announcements.length} description={copy("Latest system-wide updates.", "সর্বশেষ সিস্টেমজুড়ে আপডেট।")} />
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <Card className="bg-card/80 backdrop-blur-xl border shadow-xl rounded-[2rem]">
            <CardHeader>
              <CardTitle>{copy("How to use your role", "আপনার role কীভাবে ব্যবহার করবেন")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {roleGuide.steps.map((step, index) => (
                <div key={step.en} className="flex items-start gap-3 rounded-2xl border bg-background/80 p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">{index + 1}</div>
                  <p className="pt-1 text-sm leading-6 text-muted-foreground">{copy(step.en, step.bn)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <div className="grid gap-4">
            <DashboardAction title={copy("Inspect departments", "ডিপার্টমেন্ট দেখুন")} description={copy("Browse any department overview from one place.", "এক জায়গা থেকে যেকোনো department overview দেখুন।")} href="/department" label={copy("Open department view", "ডিপার্টমেন্ট view খুলুন")} />
            <DashboardAction title={copy("Review work", "কাজ রিভিউ করুন")} description={copy("Catch blockers early from the review queue.", "Review queue থেকে blocker আগে ধরুন।")} href="/review" label={copy("Open review queue", "রিভিউ কিউ খুলুন")} />
            <DashboardAction title={copy("Manage access", "অ্যাক্সেস ম্যানেজ করুন")} description={copy("Update roles, departments, attendance, and announcements.", "রোল, ডিপার্টমেন্ট, অ্যাটেনডেন্স, আর ঘোষণা আপডেট করুন।")} href="/manage" label={copy("Open management", "ম্যানেজমেন্ট খুলুন")} />
            <Card className="rounded-[1.75rem] border border-border/50 bg-background/85">
              <CardContent className="space-y-2 p-5">
                <Label htmlFor="global-leaderboard-department">{copy("Leaderboard department", "লিডারবোর্ড ডিপার্টমেন্ট")}</Label>
                <Select value={leaderboardDepartmentId} onValueChange={setLeaderboardDepartmentFilter}>
                  <SelectTrigger id="global-leaderboard-department">
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
              </CardContent>
            </Card>
            <WeeklyDepartmentLeaderboard
              departmentId={leaderboardDepartmentId}
              leaderboard={weeklyLeaderboard}
              loading={leaderboardLoading}
              viewerUserId={user?.uid || ""}
              compact
              showBrowseLink
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <WorkspaceBreadcrumbs items={dashboardTrail} />
      <GreetingBanner name={profile?.displayName || profile?.fullName} />
      {/* Department switcher : compact inline row */}
      <div className="workspace-pane glass-premium hover-glow flex flex-wrap items-center gap-3 rounded-[1.75rem] px-5 py-3 shadow-sm">
        <p className="shrink-0 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {copy("Department", "ডিপার্টমেন্ট")}
        </p>
        <div className="min-w-[180px] flex-1">
          <Select value={departmentId} onValueChange={setDepartmentId}>
            <SelectTrigger id="department-switcher" className="h-8 rounded-xl border text-sm">
              <SelectValue placeholder={copy("Select", "বেছুন")} />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENT_OPTIONS.map((item) => (
                <SelectItem key={item.id} value={item.id}>{item.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          size="sm"
          disabled={!departmentId || departmentId === (profile?.departmentId || "") || departmentSaving}
          onClick={handleDepartmentSave}
        >
          {departmentSaving ? copy("Saving...", "সেভ হচ্ছে...") : copy("Update", "আপডেট")}
        </Button>
        {saveMessage ? <p className="w-full text-xs text-muted-foreground">{saveMessage}</p> : null}
      </div>

      {/* Hero: continue working : compact */}
      <AnimatedBlock delay={0.1}>
        <Card className="glass-premium hover-glow bg-card/80 border-0 shadow-2xl rounded-[2rem] overflow-hidden">
          <CardContent className="p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 space-y-1.5">
                <Badge variant="subtle" className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest bg-primary/10 text-primary">
                  {copy("Your next step", "আপনার পরের ধাপ")}
                </Badge>
                <h2 className="text-xl font-black sm:text-2xl tracking-tight">
                  {copy(`Continue in ${getDepartmentTitle(profile?.departmentId)}`, `${getDepartmentTitle(profile?.departmentId)}-এ কাজ চালিয়ে যান`)}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground/80 italic">{copy(roleGuide.today.en, roleGuide.today.bn)}</p>
              </div>
              <div className="flex flex-wrap gap-2 sm:shrink-0">
                <Button asChild size="sm" className="rounded-xl shadow-md">
                  <Link href="/courses"><BookOpenCheck className="h-3.5 w-3.5" />{copy("Courses", "কোর্স")}</Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="rounded-xl border-primary/20"><Link href="/task">{copy("Tasks", "টাস্ক")}</Link></Button>
                {canReview ? <Button variant="outline" size="sm" asChild className="rounded-xl border-primary/20"><Link href="/review">{copy("Review", "রিভিউ")}</Link></Button> : null}
                {canManage ? <Button variant="outline" size="sm" asChild className="rounded-xl border-primary/20"><Link href="/manage">{copy("Manage", "ম্যানেজ")}</Link></Button> : null}
                <AiGuideModal departmentId={profile?.departmentId} role={role} currentStage={profile?.currentStage} />
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedBlock>

      <AnimatedBlock delay={0.12} className="mt-4">
        <EquityProgressRing 
          points={profile?.totalPoints || 0} 
          nextMilestone={500} 
          title={copy("Sweat Equity", "সুইট ইকুইটি")}
          subtitle={copy("Next payout milestone", "পরবর্তী পেআউট মাইলফলক")}
        />
      </AnimatedBlock>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {stats.map((item, index) => (
          <AnimatedScale key={item.title} delay={0.15 + index * 0.06}>
            <StatCard title={item.title} value={item.value} description={item.description} icon={item.icon} tint={item.tint} />
          </AnimatedScale>
        ))}
      </div>


      <AnimatedBlock direction="up" delay={0.16}>
        <Card className="bg-card/80 backdrop-blur-xl border shadow-xl rounded-[2rem]">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Badge variant="subtle" className="w-fit rounded-full px-4 py-1.5 text-sm">
                {copy("Readiness checklist", "রেডিনেস চেকলিস্ট")}
              </Badge>
              <CardTitle className="mt-3">{copy("Make sure your workflow is actually ready", "নিশ্চিত করুন আপনার workflow আসলেই প্রস্তুত")}</CardTitle>
              <CardDescription className="max-w-3xl text-base leading-7">
                {copy(
                  "This checklist turns role guidance into concrete checks, so you can spot what is ready and what still needs action.",
                  "এই checklist role guidance-কে concrete check-এ পরিণত করে, যাতে আপনি বুঝতে পারেন কোন অংশ ready আর কোন অংশে এখনো action দরকার।",
                )}
              </CardDescription>
            </div>
            <Button variant="outline" className="rounded-2xl transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]" asChild>
              <Link href="/manual">{copy("Open full manual", "পুরো ম্যানুয়াল খুলুন")}</Link>
            </Button>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
            {readinessChecklist.map((item) => (
              <ReadinessChecklistItem
                key={item.key}
                done={item.done}
                title={item.title}
                description={item.description}
                href={item.href}
                label={item.label}
              />
            ))}
          </CardContent>
        </Card>
      </AnimatedBlock>

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <AnimatedBlock direction="up" delay={0.2}>
          <Card className="bg-card/80 backdrop-blur-xl border shadow-xl rounded-[2rem]">
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle>{copy("Open tasks", "চলমান টাস্ক")}</CardTitle>
                <CardDescription>{copy("Incomplete loops drain focus. Close these tasks to secure your equity.", "অসম্পূর্ণ কাজ মনোযোগ নষ্ট করে। দ্রুত এই টাস্কগুলো শেষ করে আপনার ইকুইটি নিশ্চিত করুন।")}</CardDescription>
                {!loading && tasks.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-primary">{copy(`${tasks.length} pending`, `${tasks.length}টি টাস্ক বাকি`)}</span>
                      <span className="text-muted-foreground">{copy("Finish to clear the loop", "লুপ ক্লিয়ার করতে শেষ করুন")}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      {/* Zeigarnik Effect progress bar logic (visual only for psychology) */}
                      <div className="h-full bg-primary transition-all duration-1000 w-[15%]" />
                    </div>
                  </div>
                ) : null}
              </div>
              <Button variant="outline" asChild><Link href="/task">{copy("Task browser", "টাস্ক ব্রাউজার")}</Link></Button>
            </CardHeader>
            <CardContent className="grid gap-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center space-y-4 py-8" aria-busy="true">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                  <p className="animate-pulse text-sm font-semibold tracking-wide text-primary">
                    {copy("Verifying credentials and processing AI insights...", "ক্রেডেনশিয়াল যাচাই এবং এআই ইনসাইট প্রসেস করা হচ্ছে...")}
                  </p>
                </div>
              ) : null}
              {!loading && !tasks.length ? (
                <EmptyStateCard
                  icon={FileCheck2}
                  title={copy("No open tasks right now", "এই মুহূর্তে কোনো open task নেই")}
                  description={copy("When new tasks are assigned to you, they will appear here.", "নতুন কোনো task আসলে তা এখানে দেখা যাবে।")}
                />
              ) : null}
              {tasks.map((task, idx) => (
                <AnimatedBlock key={task.id} direction="up" delay={0.2 + idx * 0.05}>
                  <div className="glass-premium hover-lift hover-glow rounded-3xl border-0 p-5 shadow-lg">
                    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="font-bold tracking-tight flex items-center gap-2">
                        {task.title}
                        <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                      </h3>
                      <Badge variant={statusVariant(task.status)} className="rounded-lg">{statusLabel(task.status)}</Badge>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground/80">
                      {task.resourceTitle ? sanitizeAssignedResourceText(task.resourceTitle) : task.instructions}
                    </p>
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 animate-pulse">
                          Due {formatDate(task.deadlineAt)}
                        </p>
                        <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-rose-600">
                          {copy("Urgent", "জরুরী")}
                        </span>
                      </div>
                      <Button variant="outline" size="sm" asChild className="rounded-xl border-primary/20">
                        <Link href={`/task?taskId=${task.id}`}>{copy("Open", "খুলুন")}</Link>
                      </Button>
                    </div>
                  </div>
                </AnimatedBlock>
              ))}
            </CardContent>
          </Card>
        </AnimatedBlock>

        <AnimatedBlock direction="up" delay={0.24}>
          <Card className="bg-card/80 backdrop-blur-xl border shadow-xl rounded-[2rem]">
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle>{copy("Latest announcements", "সর্বশেষ ঘোষণা")}</CardTitle>
                <CardDescription>{copy("Read these before you continue your work.", "কাজ চালানোর আগে এগুলো দেখে নিন।")}</CardDescription>
              </div>
              <Button variant="ghost" asChild>
                <Link href="/announcements">{copy("Open board", "বোর্ড খুলুন")}</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {announcements.length ? announcements.map((item) => (
                <div key={item.id} className="interactive-tile rounded-3xl border bg-background/80 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="font-medium">{item.title}</h3>
                    <Badge variant="subtle">{item.scope}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">{formatDateTime(item.createdAt)}</p>
                </div>
              )) : (
                <EmptyStateCard
                  icon={Megaphone}
                  title={copy("No announcements yet", "এখনও কোনো ঘোষণা নেই")}
                  description={copy("System updates and department news will appear here.", "সিস্টেম আপডেট এবং ডিপার্টমেন্টের খবর এখানে দেখা যাবে।")}
                />
              )}
            </CardContent>
          </Card>

          {certificates.length > 0 && (
            <Card className="mt-4 bg-card/80 backdrop-blur-xl border shadow-xl rounded-[2rem] overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg">{copy("My Certificates", "আমার সার্টিফিকেট")}</CardTitle>
                  <CardDescription className="text-xs">{copy("Your verified completions", "আপনার ভেরিফাইড কোর্স সম্পন্ন হওয়া।")}</CardDescription>
                </div>
                <Sparkles className="h-5 w-5 text-amber-500" />
              </CardHeader>
              <CardContent className="space-y-3 p-4">
                {certificates.map((cert) => (
                  <div key={cert.id} className="glass-premium hover-lift border-0 rounded-[1.25rem] p-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-xs truncate">{cert.certificateTitle}</p>
                      <p className="text-[10px] text-muted-foreground italic">{formatDate(cert.issuedAt)}</p>
                    </div>
                    <Button size="xs" variant="outline" className="h-7 rounded-lg text-[10px] px-2 border-primary/20" asChild>
                      <Link href={`/certificate?id=${cert.id}`}>{copy("Share", "শেয়ার")}</Link>
                    </Button>
                  </div>
                ))}
                <Button size="sm" variant="ghost" className="w-full text-xs rounded-xl" asChild>
                  <Link href="/certificate">{copy("View All", "সব দেখুন")}</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="mt-4 bg-card/80 backdrop-blur-xl border shadow-xl rounded-[2rem] overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{copy("Recent Points", "সাম্প্রতিক পয়েন্ট")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-4">
              {ledger.length > 0 ? ledger.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-2 rounded-xl bg-background/40 border border-border/50">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold truncate">{entry.note || copy("Point Awarded", "পয়েন্ট বরাদ্দ")}</p>
                    <p className="text-[10px] text-muted-foreground italic">{formatDate(entry.createdAt)}</p>
                  </div>
                  <div className={`shrink-0 font-black text-xs ${entry.direction === "debit" ? "text-red-500" : "text-emerald-500"}`}>
                    {entry.direction === "debit" ? "-" : "+"}{entry.points}
                  </div>
                </div>
              )) : <p className="text-xs text-center text-muted-foreground py-4">{copy("No point activity yet.", "এখনো কোনো পয়েন্ট অ্যাক্টিভিটি নেই।")}</p>}
              <Button size="sm" variant="ghost" className="w-full text-xs rounded-xl" asChild>
                <Link href="/points">{copy("Points History", "পয়েন্ট ইতিহাস")}</Link>
              </Button>
            </CardContent>
          </Card>
        </AnimatedBlock>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <AnimatedBlock direction="up" delay={0.28}>
          <Card className="bg-card/80 backdrop-blur-xl border shadow-xl rounded-[2rem]">
            <CardHeader>
              <CardTitle>{copy("Published courses", "পাবলিশড কোর্স")}</CardTitle>
              <CardDescription>{copy("These are your active learning paths.", "এগুলোই আপনার active learning path।")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {courses.length ? courses.map((course, idx) => (
                <AnimatedBlock key={course.id} direction="up" delay={0.3 + idx * 0.05}>
                  <div className="glass-premium hover-lift hover-glow rounded-3xl border-0 p-4 shadow-lg">
                    <h3 className="font-bold tracking-tight">{course.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground/80 italic">{getCoursePreviewDescription(course)}</p>
                    <p className="mt-3 text-[10px] font-black uppercase tracking-[0.18em] text-primary/70">{course.lessonCount || 0} lessons / {course.estimatedHours || 0} hours</p>
                  </div>
                </AnimatedBlock>
              )) : <p className="text-sm text-muted-foreground">{copy("No published courses yet.", "এখনও কোনো published course নেই।")}</p>}
            </CardContent>
          </Card>
        </AnimatedBlock>

        <div className="space-y-4">
          {canBrowseAnyDepartment ? (
            <Card className="workspace-pane glass-premium hover-glow rounded-[1.75rem] border border-border/50 bg-background/85">
              <CardContent className="space-y-2 p-5">
                <Label htmlFor="member-leaderboard-department">
                  {copy("Leaderboard department", "লিডারবোর্ড ডিপার্টমেন্ট")}
                </Label>
                <Select value={leaderboardDepartmentId} onValueChange={setLeaderboardDepartmentFilter}>
                  <SelectTrigger id="member-leaderboard-department">
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
              </CardContent>
            </Card>
          ) : null}

          <WeeklyDepartmentLeaderboard
            departmentId={leaderboardDepartmentId}
            leaderboard={weeklyLeaderboard}
            loading={leaderboardLoading}
            viewerUserId={user?.uid || ""}
            compact
            showBrowseLink
          />
        </div>

        <AnimatedBlock direction="up" delay={0.32}>
          <Card className="bg-card/80 backdrop-blur-xl border shadow-xl rounded-[2rem]">
            <CardHeader>
              <CardTitle>{copy("My latest activity", "আমার সর্বশেষ কাজ")}</CardTitle>
              <CardDescription>{copy("Recent submissions and approved ledger updates appear here.", "সাম্প্রতিক submission আর approved ledger update এখানে দেখা যাবে।")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {submissions.map((submission) => (
                <div key={submission.id} className="interactive-tile rounded-3xl border bg-background/80 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="font-medium">
                      {submission.taskSource === "custom" || String(submission.taskId || "").startsWith("custom_")
                        ? (submission.resourceTitle || submission.taskTitle || submission.taskId)
                        : sanitizeAssignedResourceText(submission.resourceTitle || submission.taskTitle || submission.taskId)}
                    </h3>
                    <Badge variant={statusVariant(submission.status)}>{statusLabel(submission.status)}</Badge>
                  </div>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">{formatDateTime(submission.updatedAt || submission.submittedAt)}</p>
                </div>
              ))}
              {ledger.map((entry) => (
                <div key={entry.id} className="interactive-tile rounded-3xl border bg-background/80 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="font-medium">{entry.points} {copy("points", "পয়েন্ট")}</h3>
                    <Badge variant="success">{copy("Approved", "অনুমোদিত")}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{entry.note}</p>
                </div>
              ))}
              {!submissions.length && !ledger.length ? <p className="text-sm text-muted-foreground">{copy("No activity records yet.", "এখনও কোনো activity record নেই।")}</p> : null}
            </CardContent>
          </Card>
        </AnimatedBlock>
      </div>
    </div>
  );
}
