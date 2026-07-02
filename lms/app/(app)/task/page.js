"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, FileCheck2, Link2, Zap, ShieldCheck, Info } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { DepartmentActivationPanel } from "@/components/layout/department-activation-panel";
import { WorkspaceBreadcrumbs } from "@/components/layout/workspace-breadcrumbs";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyStateCard } from "@/components/ui/empty-state-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { DirectTaskPanel } from "@/components/task/direct-task-panel";
import {
  DEPARTMENT_OPTIONS,
  canBrowseAllDepartments,
  getDepartmentTitle,
  getSubmissionTypeLabel,
  resolveScopedDepartmentId,
  sanitizeAssignedResourceText,
} from "@/lib/catalog";
import { formatDate } from "@/lib/date";
import { buildSubmissionId, fetchOpenTasks, fetchSubmission, fetchTask, submitTaskSubmission } from "@/lib/firestore/lms";
import { statusLabel, statusVariant } from "@/lib/display";
import { cn } from "@/lib/utils";

export default function TaskPage() {
  const searchParams = useSearchParams();
  const { user, profile, role } = useAuth();
  const { copy } = useLocale();
  const canBrowseAnyDepartment = canBrowseAllDepartments(role);
  const initialDepartmentId = searchParams.get("departmentId") || "";
  const initialTaskId = searchParams.get("taskId") || "";
  const initialSubmissionId = searchParams.get("submissionId") || "";
  const initialMode = searchParams.get("mode") === "custom" ? "custom" : "assigned";

  const [taskMode, setTaskMode] = useState(initialMode);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(initialDepartmentId);
  const [pendingDepartmentId, setPendingDepartmentId] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState(initialTaskId);
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [submittedText, setSubmittedText] = useState("");
  const [submissionType, setSubmissionType] = useState("certificate");
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [message, setMessage] = useState("");
  const [aiAssessment, setAiAssessment] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiProcessingState, setAiProcessingState] = useState("");
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingTask, setLoadingTask] = useState(true);
  const [savingSubmit, setSavingSubmit] = useState(false);
  const [submitProcessingState, setSubmitProcessingState] = useState("");

  const activeDepartmentId = resolveScopedDepartmentId({
    role,
    profileDepartmentId: profile?.departmentId || pendingDepartmentId,
    preferredDepartmentId: selectedDepartmentId,
  });

  const activeTask = useMemo(
    () => tasks.find((item) => item.id === selectedTaskId) || task,
    [selectedTaskId, task, tasks],
  );

  useEffect(() => {
    if (!selectedDepartmentId && canBrowseAnyDepartment) {
      setSelectedDepartmentId(initialDepartmentId || DEPARTMENT_OPTIONS[0]?.id || "");
    }
  }, [canBrowseAnyDepartment, initialDepartmentId, selectedDepartmentId]);

  useEffect(() => {
    let active = true;

    const loadTasks = async () => {
      if (!activeDepartmentId) {
        if (active) setLoadingTasks(false);
        return;
      }

      setLoadingTasks(true);
      const nextTasks = await fetchOpenTasks(activeDepartmentId, 50);
      if (!active) return;
      setTasks(nextTasks);
      setSelectedTaskId((current) => {
        if (current && nextTasks.some((item) => item.id === current)) return current;
        return initialTaskId && nextTasks.some((item) => item.id === initialTaskId) ? initialTaskId : nextTasks[0]?.id || "";
      });
      setLoadingTasks(false);
    };

    loadTasks().catch(() => {
      if (!active) return;
      setTasks([]);
      setSelectedTaskId("");
      setLoadingTasks(false);
    });

    return () => {
      active = false;
    };
  }, [activeDepartmentId, initialTaskId]);

  useEffect(() => {
    let active = true;

    const loadTask = async () => {
      if (!selectedTaskId || !user?.uid) {
        if (active) setLoadingTask(false);
        return;
      }

      setLoadingTask(true);
      setSubmission(null);
      setSubmittedText("");
      setSubmissionUrl("");
      setMessage("");

      // 1. Try to restore from localStorage first (draft recovery)
      const draftKey = `draft_task_${selectedTaskId}_${user.uid}`;
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        try {
          const { text, url, type } = JSON.parse(savedDraft);
          setSubmittedText(text || "");
          setSubmissionUrl(url || "");
          setSubmissionType(type || "certificate");
        } catch {
          // Ignore malformed drafts
        }
      }

      const taskDoc = tasks.find((item) => item.id === selectedTaskId) || await fetchTask(selectedTaskId);
      if (!active) return;
      setTask(taskDoc);
      
      // If no draft was found, set default type from task
      if (!savedDraft) {
        setSubmissionType(taskDoc?.allowedSubmissionTypes?.[0] || "certificate");
      }

      const submissionDoc = await fetchSubmission(buildSubmissionId(selectedTaskId, user.uid));
      if (!active) return;
      
      if (submissionDoc) {
        // If a real submission exists, it overrides the local draft
        setSubmission(submissionDoc);
        setSubmittedText(submissionDoc?.submittedText || "");
        setSubmissionType(submissionDoc?.submissionLinks?.[0]?.type || taskDoc?.allowedSubmissionTypes?.[0] || "certificate");
        setSubmissionUrl(submissionDoc?.submissionLinks?.[0]?.url || "");
        // Clean up draft as we have a server record
        localStorage.removeItem(draftKey);
      }
      
      setLoadingTask(false);
    };

    loadTask().catch(() => {
      if (!active) return;
      setTask(null);
      setSubmission(null);
      setLoadingTask(false);
    });

    return () => {
      active = false;
    };
  }, [selectedTaskId, tasks, user?.uid]);

  // Auto-save draft to localStorage
  useEffect(() => {
    if (!selectedTaskId || !user?.uid || submission?.status === "approved" || submission?.status === "rejected") return;

    const draftKey = `draft_task_${selectedTaskId}_${user.uid}`;
    const timeout = setTimeout(() => {
      if (submittedText || submissionUrl) {
        localStorage.setItem(draftKey, JSON.stringify({
          text: submittedText,
          url: submissionUrl,
          type: submissionType,
          updatedAt: Date.now()
        }));
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [selectedTaskId, user?.uid, submittedText, submissionUrl, submissionType, submission?.status]);

  useEffect(() => {
    let active = true;

    const restoreSubmissionContext = async () => {
      if (!initialSubmissionId || !user?.uid) return;

      const submissionDoc = await fetchSubmission(initialSubmissionId);
      if (!active || !submissionDoc || submissionDoc.userId !== user.uid) return;

      const customTask = submissionDoc.taskSource === "custom" || String(submissionDoc.taskId || "").startsWith("custom_");
      if (customTask) {
        setTaskMode("custom");
        return;
      }

      setTaskMode("assigned");
      setSelectedTaskId(submissionDoc.taskId || initialTaskId);
      setSubmission(submissionDoc);
      setSubmittedText(submissionDoc.submittedText || "");
      setSubmissionType(submissionDoc.submissionLinks?.[0]?.type || "certificate");
      setSubmissionUrl(submissionDoc.submissionLinks?.[0]?.url || "");
    };

    restoreSubmissionContext().catch(() => undefined);

    return () => {
      active = false;
    };
  }, [initialSubmissionId, initialTaskId, user?.uid]);

  const canSubmitToTask =
    Boolean(user?.uid) &&
    Boolean(activeDepartmentId) &&
    Boolean(activeTask?.departmentId) &&
    activeDepartmentId === activeTask.departmentId;
  const isResubmission = submission?.status === "revision_requested" || Boolean(submission?.id);
  const isLockedSubmission = submission?.status === "approved" || submission?.status === "rejected";
  const availableSubmissionTypes =
    Array.isArray(activeTask?.allowedSubmissionTypes) && activeTask.allowedSubmissionTypes.length
      ? activeTask.allowedSubmissionTypes
      : ["certificate", "screenshot", "public_profile", "github", "link"];
  const effectiveSubmissionType = availableSubmissionTypes.includes(submissionType)
    ? submissionType
    : availableSubmissionTypes[0] || "link";
  const canSaveSubmission = canSubmitToTask && !isLockedSubmission && Boolean(submissionUrl.trim());
  const taskOpenResourceUrl = activeTask?.preferredResourceUrl || activeTask?.resourceUrl || "";
  const hasOriginalTaskResourceLink =
    Boolean(taskOpenResourceUrl && activeTask?.originalResourceUrl && activeTask.originalResourceUrl !== taskOpenResourceUrl);

  const reviewerGuide = useMemo(
    () => [
      copy("Open the lesson resource first and finish the actual work.", "আগে lesson resource খুলে বাস্তব কাজটি শেষ করুন।"),
      copy("Paste one working proof link that a reviewer can open immediately.", "একটি working proof link দিন, যা reviewer সঙ্গে সঙ্গে খুলতে পারে।"),
      copy("Use the note box to mention your visible name and anything the reviewer should notice.", "Note box-এ আপনার visible name এবং reviewer-এর দেখার মতো বিষয় লিখুন।"),
    ],
    [copy],
  );

  const taskTrail = [
    { href: "/dashboard", en: "Dashboard", bn: "ড্যাশবোর্ড" },
    { href: "/task", en: "Tasks", bn: "টাস্ক" },
    {
      href: null,
      en:
        taskMode === "custom"
          ? "Direct task submit"
          : activeTask?.title
            ? sanitizeAssignedResourceText(activeTask.title)
            : "Assigned tasks",
      bn:
        taskMode === "custom"
          ? "Direct task submit"
          : activeTask?.title
            ? sanitizeAssignedResourceText(activeTask.title)
            : "Assigned task",
    },
  ];

  if (!activeDepartmentId) {
    return (
      <div className="workspace-stack">
        <WorkspaceBreadcrumbs items={taskTrail} />
        <DepartmentActivationPanel
          user={user}
          profile={profile}
          copy={copy}
          title={copy("Open your task workspace", "আপনার task workspace খুলুন")}
          description={copy(
            "Choose your department here and assigned tasks plus direct submission flow will become usable from this page.",
            "এখানেই department বেছে নিন, আর assigned task ও direct submission flow এই page থেকেই usable হয়ে যাবে।",
          )}
          onSaved={(nextDepartmentId) => {
            setPendingDepartmentId(nextDepartmentId);
            setSelectedDepartmentId(nextDepartmentId);
          }}
        />
      </div>
    );
  }

  const [readabilityScore, setReadabilityScore] = useState(0);

  // Edge computing: Readability/Detail heuristic
  useEffect(() => {
    if (!submittedText.trim()) {
      setReadabilityScore(0);
      return;
    }
    const words = submittedText.trim().split(/\s+/).length;
    const chars = submittedText.length;
    // 40+ words = 100%. Less words = lower score.
    const score = Math.min(100, Math.floor((words / 40) * 100));
    setReadabilityScore(score);
  }, [submittedText]);

  return (
    <div className="workspace-stack">
      <WorkspaceBreadcrumbs items={taskTrail} />
      
      <div className="group workspace-hero relative overflow-hidden rounded-[2.5rem] border bg-gradient-to-br from-primary/10 via-background to-background p-1 shadow-2xl backdrop-blur-xl" data-reveal="up">
        <div className="relative flex flex-col items-center justify-between gap-6 rounded-[2.4rem] bg-background/40 p-6 md:flex-row md:items-center xl:p-8">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/80">
                {copy("Strategic Next Step", "পরবর্তী পদক্ষেপ")}
              </span>
            </div>
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground/90 md:text-base">
              {taskMode === "custom"
                ? copy(
                    "For direct submissions, keep one clear task brief, one visible proof link, and one short reviewer note so approvers can verify your work quickly.",
                    "Direct submission-এর ক্ষেত্রে একটি clear task brief, একটি visible proof link, আর একটি ছোট reviewer note রাখুন, যাতে approver দ্রুত যাচাই করতে পারে।"
                  )
                : activeTask
                  ? copy(
                      "Open the verified learning resource first, complete the task there, then submit one reviewer-ready proof link from this page.",
                      "আগে verified learning resource খুলুন, কাজ সেখানে শেষ করুন, তারপর এই page থেকে reviewer-ready একটি proof link submit করুন।"
                    )
                  : copy(
                      "Choose one assigned task first, then use the right panel to open the resource and submit proof.",
                      "আগে একটি assigned task বেছে নিন, তারপর ডান পাশের panel থেকে resource খুলে proof submit করুন।"
                    )}
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:w-auto">
            {taskMode === "assigned" && taskOpenResourceUrl ? (
              <Button size="lg" className="rounded-2xl shadow-lg transition-all hover:-translate-y-1 hover:shadow-primary/20" asChild>
                <a href={taskOpenResourceUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  {copy("Open resource", "Resource খুলুন")}
                </a>
              </Button>
            ) : null}
            <Button variant="outline" size="lg" className="rounded-2xl bg-background/50 backdrop-blur-sm" asChild>
              <Link href="/manual">{copy("Open manual", "ম্যানুয়াল খুলুন")}</Link>
            </Button>
          </div>
        </div>
      </div>

      <Card className="bg-card/80 backdrop-blur-xl border shadow-xl rounded-[2rem]" data-reveal="up">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <Badge variant="subtle" className="rounded-full px-4 py-1.5 text-sm">
                {copy("Task workspace", "টাস্ক ওয়ার্কস্পেস")}
              </Badge>
              <CardTitle className="mt-4 text-3xl">{getDepartmentTitle(activeDepartmentId)}</CardTitle>
              <CardDescription className="mt-2 max-w-4xl text-base leading-7">
                {copy(
                  "Use Assigned tasks for LMS lessons and Direct task submit for mentor, community, or self-initiated work.",
                  "LMS lesson-এর জন্য Assigned task ব্যবহার করুন, আর mentor, community, বা self-initiated কাজের জন্য Direct task submit ব্যবহার করুন.",
                )}
              </CardDescription>
            </div>
            {canBrowseAnyDepartment ? (
              <div className="w-full max-w-xs space-y-2">
                <Label htmlFor="task-department-header">{copy("Department scope", "ডিপার্টমেন্ট scope")}</Label>
                <Select value={activeDepartmentId} onValueChange={setSelectedDepartmentId}>
                  <SelectTrigger id="task-department-header"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DEPARTMENT_OPTIONS.map((item) => (
                      <SelectItem key={item.id} value={item.id}>{item.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
          </div>
        </CardHeader>
      </Card>

      <Tabs value={taskMode} onValueChange={setTaskMode} className="space-y-0" data-reveal="up">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="assigned">{copy("Assigned tasks", "Assigned task")}</TabsTrigger>
          <TabsTrigger value="custom">{copy("Direct task submit", "Direct task submit")}</TabsTrigger>
        </TabsList>

        <TabsContent value="assigned">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <Card className="bg-card/80 backdrop-blur-xl border shadow-xl rounded-[2rem]" data-reveal="up">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <CardTitle className="text-3xl">{copy("Assigned LMS tasks", "Assigned LMS task")}</CardTitle>
              <CardDescription className="mt-2 text-base leading-7">
                {copy(
                  "Choose any open LMS task from the list, review the brief, and submit one visible proof link.",
                  "তালিকা থেকে যেকোনো open LMS task বেছে নিন, brief দেখে নিন, তারপর একটি visible proof link submit করুন।",
                )}
              </CardDescription>
            </div>
          </div>

          <div className="space-y-3">
            {loadingTasks ? (
              <div className="space-y-3" aria-busy="true" aria-label={copy("Loading task list", "টাস্ক তালিকা লোড হচ্ছে")}>
                <Skeleton className="h-24 w-full rounded-[2rem]" />
                <Skeleton className="h-24 w-full rounded-[2rem]" />
              </div>
            ) : null}
            {!loadingTasks && !tasks.length ? (
              <EmptyStateCard
                icon={FileCheck2}
                title={copy("No open tasks right now", "এই মুহূর্তে কোনো open task নেই")}
                description={copy(
                  "You can still submit mentor, community, or self-initiated work from the Direct task tab.",
                  "Direct task tab থেকে mentor, community, বা self-initiated কাজ submit করতে পারবেন।",
                )}
              />
            ) : null}
            {tasks.map((item) => (
              <button
                key={item.id}
                className={`group relative w-full rounded-[2rem] border p-5 text-left transition-all duration-300 ${
                  selectedTaskId === item.id 
                    ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary/20" 
                    : "bg-background/80 hover:border-primary/40 hover:bg-muted/30 hover:shadow-sm"
                }`}
                type="button"
                onClick={() => {
                  setTask(item);
                  setSubmission(null);
                  setSubmittedText("");
                  setSubmissionUrl("");
                  setSubmissionType(item.allowedSubmissionTypes?.[0] || "certificate");
                  setMessage("");
                  setSelectedTaskId(item.id);
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className={`font-semibold transition-colors ${selectedTaskId === item.id ? "text-primary" : "text-foreground group-hover:text-primary"}`}>{item.title}</h3>
                  <div className={`flex items-center gap-2 ${selectedTaskId === item.id ? "scale-105 transition-transform" : ""}`}>
                    <Badge variant={statusVariant(item.status)} className={item.status === "assigned" ? "animate-pulse ring-1 ring-primary/30 shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]" : ""}>
                      {statusLabel(item.status)}
                    </Badge>
                  </div>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground line-clamp-2">
                  {item.resourceTitle ? sanitizeAssignedResourceText(item.resourceTitle) : item.instructions}
                </p>
                <div className="mt-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
                  <span className={cn(
                    "flex items-center gap-1.5 transition-colors",
                    item.deadlineAt && (new Date(item.deadlineAt) - new Date()) / 86400000 > 0 && (new Date(item.deadlineAt) - new Date()) / 86400000 <= 3 ? "text-amber-500" : ""
                  )}>
                    <div className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      !item.deadlineAt ? "bg-primary/80" :
                      (new Date(item.deadlineAt) - new Date()) / 86400000 <= 0 ? "bg-red-500" :
                      (new Date(item.deadlineAt) - new Date()) / 86400000 <= 3 ? "bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]" : "bg-primary/80"
                    )} />
                    {item.deadlineAt && (new Date(item.deadlineAt) - new Date()) / 86400000 <= 3 && (new Date(item.deadlineAt) - new Date()) / 86400000 > 0 
                      ? copy("Urgent: Due ", "জরুরী: বাকি ") + formatDate(item.deadlineAt)
                      : "Due " + formatDate(item.deadlineAt)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </CardHeader>
      </Card>

      <Card className="bg-card/80 backdrop-blur-xl border shadow-xl rounded-[2rem]" data-reveal="up">
        <CardHeader>
          <CardTitle>{activeTask?.title || copy("Task details", "টাস্ক ডিটেইলস")}</CardTitle>
          <CardDescription>
            {activeTask
              ? copy("Finish the lesson resource first, then submit visible proof from this page.", "আগে lesson resource শেষ করুন, তারপর এই page থেকে visible proof submit করুন।")
              : copy("Pick a task from the left to continue.", "চালিয়ে যেতে বাম দিক থেকে একটি task বেছে নিন।")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {loadingTask ? (
            <div
              className="space-y-4"
              aria-busy="true"
              aria-label={copy("Loading task details", "টাস্কের বিস্তারিত লোড হচ্ছে")}
            >
              <Skeleton className="h-5 w-2/3 max-w-md" />
              <div className="grid gap-4 md:grid-cols-3">
                <Skeleton className="h-20 rounded-3xl" />
                <Skeleton className="h-20 rounded-3xl" />
                <Skeleton className="h-20 rounded-3xl" />
              </div>
              <Skeleton className="min-h-[100px] w-full rounded-3xl" />
            </div>
          ) : null}

          {!loadingTask && activeTask ? (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border bg-background/80 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{copy("Status", "স্ট্যাটাস")}</p>
                  <div className="mt-2"><Badge variant={statusVariant(activeTask.status)}>{statusLabel(activeTask.status)}</Badge></div>
                </div>
                <div className="rounded-3xl border bg-background/80 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{copy("Deadline", "ডেডলাইন")}</p>
                  <p className="mt-2 font-semibold">{formatDate(activeTask.deadlineAt)}</p>
                </div>
                <div className="rounded-3xl border bg-background/80 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{copy("Max points", "সর্বোচ্চ পয়েন্ট")}</p>
                  <p className="mt-2 font-semibold">{activeTask.maxPoints || 0}</p>
                </div>
              </div>

              {taskOpenResourceUrl ? (
                <div className="rounded-3xl border bg-background/80 p-5 gap-3 hover:bg-muted/30 transition-colors">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{copy("Learning resource", "লার্নিং resource")}</p>
                  <h3 className="mt-2 font-semibold">
                    {activeTask.resourceTitle
                      ? sanitizeAssignedResourceText(activeTask.resourceTitle)
                      : copy("External lesson resource", "External lesson resource")}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {activeTask.accessNote ||
                      copy(
                        "Open the verified provider link in a fresh tab before you submit proof here.",
                        "এখানে proof submit করার আগে verified provider link fresh tab-এ খুলুন।",
                      )}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button asChild>
                      <a href={taskOpenResourceUrl} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-4 w-4" />
                        {copy("Open verified resource", "Verified resource খুলুন")}
                      </a>
                    </Button>
                    {hasOriginalTaskResourceLink ? (
                      <Button variant="outline" asChild>
                        <a href={activeTask.originalResourceUrl} target="_blank" rel="noreferrer">
                          <Link2 className="h-4 w-4" />
                          {copy("Open original link", "Original link খুলুন")}
                        </a>
                      </Button>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {(activeTask.proofChecklist || []).length ? (
                <div className="rounded-3xl border bg-background/80 p-5 hover:bg-muted/30 transition-colors">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{copy("Proof checklist", "প্রুফ checklist")}</p>
                  <div className="mt-3 grid gap-3">
                    {activeTask.proofChecklist.map((item) => (
                      <div key={item} className="rounded-2xl border bg-background p-3 text-sm text-muted-foreground">{item}</div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="rounded-3xl border bg-background/80 p-5 hover:bg-muted/30 transition-colors">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{copy("How reviewers check this", "Reviewer কীভাবে এটা চেক করবে")}</p>
                <div className="mt-3 space-y-3">
                  {reviewerGuide.map((item) => (
                    <div key={item} className="rounded-2xl border bg-background p-3 text-sm text-muted-foreground">{item}</div>
                  ))}
                </div>
              </div>

              {canSubmitToTask ? (
                <div className="space-y-4 rounded-[1.75rem] border bg-background/80 p-5">
                  <div>
                    <h3 className="text-lg font-semibold">{isResubmission ? copy("Update your submission", "আপনার submission update করুন") : copy("Submit your proof", "আপনার proof submit করুন")}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {copy(
                        "Certificate link, screenshot link, public profile, GitHub repo, or another accepted proof link can be used.",
                        "Certificate link, screenshot link, public profile, GitHub repo, অথবা accepted proof link ব্যবহার করা যাবে।",
                      )}
                    </p>
                    {isLockedSubmission ? (
                      <p className="mt-2 text-sm font-medium text-primary">
                        {copy(
                          "This submission is finalized. You can read the review result below, but you cannot edit it anymore.",
                          "এই submission finalize হয়ে গেছে। নিচে review result দেখতে পারবেন, কিন্তু আর edit করতে পারবেন না।",
                        )}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="submissionType">{copy("Proof type", "প্রুফ type")}</Label>
                    <Select value={submissionType} onValueChange={setSubmissionType}>
                      <SelectTrigger id="submissionType"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {availableSubmissionTypes.map((item) => (
                          <SelectItem key={item} value={item}>{getSubmissionTypeLabel(item)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="submissionUrl">{copy("Primary proof URL", "Primary proof URL")}</Label>
                    <Input id="submissionUrl" type="url" value={submissionUrl} onChange={(event) => setSubmissionUrl(event.target.value)} placeholder="https://..." disabled={isLockedSubmission} className="rounded-xl border-border/50 bg-background/50" />
                  </div>

                  <div className="space-y-2 relative">
                    <div className="flex justify-between items-end">
                      <Label htmlFor="submittedText">{copy("Notes for reviewer", "Reviewer-এর জন্য নোট")}</Label>
                      {submittedText.trim() && (
                        <span className={cn(
                          "text-[10px] font-bold uppercase tracking-widest",
                          readabilityScore > 80 ? "text-emerald-500" : readabilityScore > 40 ? "text-amber-500" : "text-red-400"
                        )}>
                          {copy("Detail Score: ", "বিস্তারিত স্কোর: ")} {readabilityScore}%
                        </span>
                      )}
                    </div>
                    <Textarea
                      id="submittedText"
                      value={submittedText}
                      onChange={(event) => setSubmittedText(event.target.value)}
                      placeholder={copy("Mention your visible name and anything the reviewer should notice.", "আপনার visible name এবং reviewer-এর দেখার মতো বিষয় লিখুন।")}
                      disabled={isLockedSubmission}
                      className="min-h-[100px] rounded-xl border-border/50 bg-background/50"
                    />
                  </div>

                  <div className="pt-2">
                    {!isLockedSubmission && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        disabled={aiLoading || !submissionUrl}
                        className="w-full rounded-xl gap-2 h-10 border-primary/20 hover:bg-primary/5"
                        onClick={async () => {
                          setAiLoading(true);
                          setAiAssessment(null);
                          
                          // Labor Illusion Psychology
                          const statesEn = ["Initializing AI...", "Reading submission...", "Analyzing vocabulary...", "Checking structure...", "Calculating depth..."];
                          const statesBn = ["AI শুরু হচ্ছে...", "সাবমিশন পড়া হচ্ছে...", "শব্দভাণ্ডার বিশ্লেষণ হচ্ছে...", "কাঠামো যাচাই হচ্ছে...", "গভীরতা মাপা হচ্ছে..."];
                          let step = 0;
                          setAiProcessingState(copy(statesEn[0], statesBn[0]));
                          const interval = setInterval(() => {
                            step = (step + 1) % statesEn.length;
                            setAiProcessingState(copy(statesEn[step], statesBn[step]));
                          }, 600);

                          try {
                            const res = await fetch("/api/ai/validate-proof", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                submissionUrl,
                                taskInstructions: activeTask?.instructions,
                                proofChecklist: activeTask?.proofChecklist
                              })
                            });
                            // Force artificial delay for perceived value
                            await new Promise(r => setTimeout(r, 1500));
                            const data = await res.json();
                            setAiAssessment(data);
                          } catch (err) {
                            console.error(err);
                          } finally {
                            clearInterval(interval);
                            setAiLoading(false);
                          }
                        }}
                      >
                        <Zap className={cn("h-4 w-4 text-primary", aiLoading && "animate-pulse")} />
                        {aiLoading ? aiProcessingState : copy("Run AI Pre-check", "AI প্রি-চেক রান করুন")}
                      </Button>
                    )}

                    {aiAssessment && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "mt-4 p-4 rounded-2xl border flex gap-3",
                          aiAssessment.status === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700" :
                          aiAssessment.status === "warning" ? "bg-amber-500/10 border-amber-500/20 text-amber-700" :
                          "bg-red-500/10 border-red-500/20 text-red-700"
                        )}
                      >
                        <div className="shrink-0 mt-0.5">
                           {aiAssessment.status === "success" ? <ShieldCheck className="h-5 w-5" /> : <Info className="h-5 w-5" />}
                        </div>
                        <div className="space-y-1">
                           <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{copy("AI Assessment", "AI মূল্যায়ন")}</p>
                           <p className="text-sm font-bold leading-relaxed">{copy(aiAssessment.messageEn, aiAssessment.messageBn)}</p>
                           <p className="text-[10px] font-medium opacity-60 italic">{copy(`Confidence: ${aiAssessment.confidence}%`, `বিশ্বাসযোগ্যতা: ${aiAssessment.confidence}%`)}</p>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <Button
                    className="w-full rounded-2xl transition-all duration-500 shadow-xl"
                    disabled={!canSaveSubmission || savingSubmit}
                    onClick={async () => {
                      setMessage("");
                      setSavingSubmit(true);
                      
                      // Labor Illusion Psychology for Submission
                      const statesEn = ["Encrypting payload...", "Verifying identity...", "Securing ledger entry...", "Finalizing proof..."];
                      const statesBn = ["পে-লোড এনক্রিপ্ট হচ্ছে...", "পরিচয় যাচাই হচ্ছে...", "লেজার এন্ট্রি সুরক্ষিত হচ্ছে...", "প্রুফ চূড়ান্ত হচ্ছে..."];
                      let step = 0;
                      setSubmitProcessingState(copy(statesEn[0], statesBn[0]));
                      const interval = setInterval(() => {
                        step = (step + 1) % statesEn.length;
                        setSubmitProcessingState(copy(statesEn[step], statesBn[step]));
                      }, 800);

                      try {
                        // Artificial perceived value delay
                        await new Promise(r => setTimeout(r, 1500));
                        const submissionId = await submitTaskSubmission({
                          task: activeTask,
                          user,
                          submittedText,
                          submissionType: effectiveSubmissionType,
                          submissionUrl,
                          displayName: profile?.displayName,
                        });
                        try {
                          const nextSubmission = await fetchSubmission(submissionId);
                          if (nextSubmission) {
                            setSubmission(nextSubmission);
                          }
                        } catch {
                          setSubmission((current) => current || {
                            id: submissionId,
                            status: "pending",
                            reviewComment: "",
                            recommendedPoints: 0,
                            awardedPoints: 0,
                          });
                        }
                        toast.success(copy("Submission saved successfully.", "সাবমিশন সফলভাবে সংরক্ষণ হয়েছে।"));
                      } catch (error) {
                        const text = error.message || copy("Failed to save submission.", "সাবমিশন সংরক্ষণ করা যায়নি।");
                        setMessage(text);
                        toast.error(text);
                      } finally {
                        clearInterval(interval);
                        setSavingSubmit(false);
                      }
                    }}
                  >
                    {savingSubmit 
                      ? <span className="flex items-center gap-2"><Zap className="h-4 w-4 animate-pulse" /> {submitProcessingState}</span> 
                      : isResubmission ? copy("Save resubmission", "Resubmission save করুন") : copy("Submit proof", "Proof submit করুন")}
                  </Button>

                  {!submissionUrl.trim() && !isLockedSubmission ? (
                    <p className="text-sm text-muted-foreground">{copy("Add a valid proof URL before submitting.", "Submit করার আগে একটি valid proof URL দিন।")}</p>
                  ) : null}
                  {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}

                  {submission ? (
                    <div className="rounded-3xl border bg-background p-5 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="font-semibold">{copy("Current status", "বর্তমান স্ট্যাটাস")}</h4>
                        <Badge variant={statusVariant(submission.status)}>{statusLabel(submission.status)}</Badge>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{submission.reviewComment || copy("No review comment yet.", "এখনও কোনো review comment নেই।")}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        {copy("Recommended points", "Recommended points")} <span className="font-bold text-primary">{submission.recommendedPoints || 0}</span> / {copy("Awarded points", "Awarded points")} <span className="font-bold text-primary">{submission.awardedPoints || 0}</span>
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="rounded-3xl border bg-background/80 p-5 text-sm leading-6 text-muted-foreground">
                  {copy(
                    `Proof submission is available only from a member account assigned to ${getDepartmentTitle(activeTask.departmentId)}.`,
                    `${getDepartmentTitle(activeTask.departmentId)}-এ assigned member account থেকেই proof submission করা যাবে।`,
                  )}
                </div>
              )}
            </>
          ) : null}

          {!loadingTask && !activeTask ? <p className="text-sm text-muted-foreground">{copy("Pick a task from the left to continue.", "চালিয়ে যেতে বাম দিক থেকে একটি task বেছে নিন।")}</p> : null}
        </CardContent>
      </Card>
          </div>
        </TabsContent>

        <TabsContent value="custom">
          <DirectTaskPanel
            activeDepartmentId={activeDepartmentId}
            user={user}
            profile={profile}
            copy={copy}
            initialSubmissionId={taskMode === "custom" ? initialSubmissionId : ""}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
