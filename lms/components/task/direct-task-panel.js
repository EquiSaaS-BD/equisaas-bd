"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyStateCard } from "@/components/ui/empty-state-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getSubmissionTypeLabel } from "@/lib/catalog";
import { statusLabel, statusVariant } from "@/lib/display";
import { fetchSubmission, fetchUserSubmissions, submitFlexibleTaskSubmission } from "@/lib/firestore/lms";

const DEFAULT_SUBMISSION_TYPES = ["certificate", "screenshot", "public_profile", "github", "link"];
const CUSTOM_TASK_ORIGIN_OPTIONS = [
  { id: "mentor_discord", en: "Mentor or community brief", bn: "মেন্টর বা কমিউনিটি brief" },
  { id: "mentor_direct", en: "Mentor direct brief", bn: "মেন্টর সরাসরি brief দিয়েছেন" },
  { id: "self_initiated", en: "Self-initiated work", bn: "নিজে থেকে করা কাজ" },
  { id: "other", en: "Other source", bn: "অন্য উৎস" },
];

const isCustomSubmission = (submission) =>
  submission?.taskSource === "custom" || String(submission?.taskId || "").startsWith("custom_");

function StatusSummary({ copy, submission }) {
  if (!submission) return null;

  return (
    <div className="rounded-3xl border bg-background p-4">
      <div className="flex items-center justify-between gap-3">
        <h4 className="font-semibold">{copy("Current status", "বর্তমান স্ট্যাটাস")}</h4>
        <Badge variant={statusVariant(submission.status)}>{statusLabel(submission.status)}</Badge>
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {submission.reviewComment || copy("No review comment yet.", "এখনও কোনো review comment নেই।")}
      </p>
      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {copy("Recommended points", "Recommended points")} {submission.recommendedPoints || 0} /{" "}
        {copy("Awarded points", "Awarded points")} {submission.awardedPoints || 0}
      </p>
    </div>
  );
}

export function DirectTaskPanel({ activeDepartmentId, user, profile, copy, initialSubmissionId = "" }) {
  const [customSubmissions, setCustomSubmissions] = useState([]);
  const formRef = useRef(null);
  const [submissionId, setSubmissionId] = useState(initialSubmissionId);
  const [submission, setSubmission] = useState(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskOrigin, setTaskOrigin] = useState("mentor_discord");
  const [taskReferenceUrl, setTaskReferenceUrl] = useState("");
  const [submittedText, setSubmittedText] = useState("");
  const [submissionType, setSubmissionType] = useState("link");
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [message, setMessage] = useState(null);

  const hydrateSubmission = (submissionDoc) => {
    setSubmissionId(submissionDoc?.id || "");
    setSubmission(submissionDoc || null);
    setTaskTitle(submissionDoc?.taskTitle || "");
    setTaskOrigin(submissionDoc?.taskOrigin || "mentor_discord");
    setTaskReferenceUrl(submissionDoc?.taskReferenceUrl || "");
    setSubmittedText(submissionDoc?.submittedText || "");
    setSubmissionType(submissionDoc?.submissionLinks?.[0]?.type || "link");
    setSubmissionUrl(submissionDoc?.submissionLinks?.[0]?.url || "");
  };

  const resetComposer = () => {
    setSubmissionId("");
    setSubmission(null);
    setTaskTitle("");
    setTaskOrigin("mentor_discord");
    setTaskReferenceUrl("");
    setSubmittedText("");
    setSubmissionType("link");
    setSubmissionUrl("");
    setMessage(null);
  };

  const refreshCustomSubmissions = async () => {
    if (!user?.uid) {
      setCustomSubmissions([]);
      return;
    }

    const nextSubmissions = await fetchUserSubmissions(user.uid);
    setCustomSubmissions(nextSubmissions.filter(isCustomSubmission));
  };

  useEffect(() => {
    refreshCustomSubmissions().catch(() => setCustomSubmissions([]));
  }, [user?.uid]);

  useEffect(() => {
    let active = true;

    const loadInitialSubmission = async () => {
      if (!initialSubmissionId || !user?.uid) return;
      const submissionDoc = await fetchSubmission(initialSubmissionId);
      if (!active || !submissionDoc || submissionDoc.userId !== user.uid || !isCustomSubmission(submissionDoc)) return;
      hydrateSubmission(submissionDoc);
    };

    loadInitialSubmission().catch(() => undefined);

    return () => {
      active = false;
    };
  }, [initialSubmissionId, user?.uid]);

  const customLocked = submission?.status === "approved" || submission?.status === "rejected";
  const canSaveCustomSubmission =
    Boolean(activeDepartmentId) &&
    Boolean(taskTitle.trim()) &&
    Boolean(submissionUrl.trim()) &&
    !customLocked;

  const originLabel = useMemo(
    () => {
      const labels = Object.fromEntries(CUSTOM_TASK_ORIGIN_OPTIONS.map((item) => [item.id, copy(item.en, item.bn)]));
      labels["mentor_discord"] = copy("Mentor or community brief", "মেন্টর বা কমিউনিটি brief");
      return labels;
    },
    [copy],
  );

  return (
    <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
      <Card className="glass-premium rounded-[2rem] hover-glow relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full -z-10 pointer-events-none" />
        <CardHeader>
          <CardTitle>{copy("Direct tasks from mentor or community brief", "মেন্টর বা কমিউনিটি brief থেকে পাওয়া ডাইরেক্ট টাস্ক")}</CardTitle>
          <CardDescription>
            {copy(
              "Use this when the task came from a mentor brief, community instruction, or a voluntary contribution outside the LMS list.",
              "Mentor brief, community instruction, বা LMS তালিকার বাইরে voluntary contribution হলে এই section ব্যবহার করুন।",
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-3xl border bg-background/80 p-4 text-sm leading-6 text-muted-foreground">
            {copy(
              "Any link-based work is valid here as long as the reviewer can open the proof and understand the task context immediately.",
              "Reviewer যেন সঙ্গে সঙ্গে proof খুলতে পারে এবং task context বুঝতে পারে, এমন যেকোনো link-based কাজ এখানে জমা দেওয়া যাবে।",
            )}
          </div>

          <Button variant="outline" onClick={resetComposer}>
            {copy("Start a new direct submission", "নতুন ডাইরেক্ট সাবমিশন শুরু করুন")}
          </Button>

          {customSubmissions.length ? (
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {copy("Recent direct submissions", "সাম্প্রতিক ডাইরেক্ট সাবমিশন")}
              </p>
              {customSubmissions.slice(0, 8).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setMessage(null);
                    hydrateSubmission(item);
                    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                  }}
                  className={`group relative w-full rounded-[1.5rem] border p-5 text-left interactive-tile ${
                    submissionId === item.id 
                      ? "border-primary bg-primary/10 shadow-[0_0_30px_-5px_hsla(172,67%,37%,0.25)] ring-1 ring-primary/40" 
                      : "glass-premium hover:border-primary/50 hover:shadow-lg"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className={`font-semibold transition-colors ${submissionId === item.id ? "text-primary" : "text-foreground group-hover:text-primary"}`}>{item.taskTitle || item.resourceTitle || item.taskId}</h3>
                    <div className={`flex items-center gap-2 ${submissionId === item.id ? "scale-105 transition-transform" : ""}`}>
                      <Badge variant={statusVariant(item.status)}>{statusLabel(item.status)}</Badge>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {originLabel[item.taskOrigin] || originLabel.self_initiated}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <EmptyStateCard
              title={copy("No direct submissions yet", "এখনও কোনো direct submission নেই")}
              description={copy(
                "Use the form beside this panel when a mentor, community brief, or self-initiated contribution needs proof.",
                "Mentor, community brief, বা self-initiated contribution proof দরকার হলে পাশের form ব্যবহার করুন।",
              )}
            />
          )}
        </CardContent>
      </Card>

      <Card ref={formRef} className="glass-premium rounded-[2rem] hover-glow relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 blur-3xl rounded-full -z-10 pointer-events-none" />
        <CardHeader>
          <CardTitle>
            {submissionId
              ? copy("Update your direct submission", "আপনার ডাইরেক্ট সাবমিশন আপডেট করুন")
              : copy("Direct task submission form", "ডাইরেক্ট টাস্ক সাবমিশন ফর্ম")}
          </CardTitle>
          <CardDescription>
            {copy(
              "Write a clear task title, add the brief or reference link if you have one, and then submit the proof link the reviewer should open.",
              "একটি পরিষ্কার task title লিখুন, brief বা reference link থাকলে দিন, তারপর reviewer যে proof link খুলবে সেটা submit করুন।",
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {customLocked ? (
            <div className="rounded-3xl border bg-background/80 p-4 text-sm text-muted-foreground">
              {copy(
                "This direct task submission is finalized. You can read the result below, but you can no longer edit it.",
                "এই direct task submission finalise হয়ে গেছে। নিচে result দেখতে পারবেন, কিন্তু আর edit করতে পারবেন না।",
              )}
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="custom-task-title">{copy("Task title", "টাস্কের নাম")}</Label>
            <Input
              id="custom-task-title"
              value={taskTitle}
              onChange={(event) => setTaskTitle(event.target.value)}
              placeholder={copy(
                "Example: Landing page improvement task from mentor",
                "যেমন: Mentor দেওয়া landing page improvement task",
              )}
              disabled={customLocked}
            />
            <p className="text-xs text-muted-foreground">
              {copy(
                "If the mentor only sent a link, write a short title that explains the work.",
                "Mentor যদি শুধু link পাঠিয়ে থাকেন, কাজটা বোঝায় এমন ছোট একটি title লিখুন।",
              )}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="custom-task-origin">{copy("Task source", "টাস্ক কোথা থেকে এসেছে")}</Label>
              <Select value={taskOrigin} onValueChange={setTaskOrigin}>
                <SelectTrigger id="custom-task-origin">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CUSTOM_TASK_ORIGIN_OPTIONS.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {copy(item.en, item.bn)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-submission-type">{copy("Proof type", "প্রুফের ধরন")}</Label>
              <Select value={submissionType} onValueChange={setSubmissionType}>
                <SelectTrigger id="custom-submission-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_SUBMISSION_TYPES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {getSubmissionTypeLabel(item)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-reference-url">{copy("Task brief / reference link", "Task brief / reference link")}</Label>
            <Input
              id="custom-reference-url"
              type="url"
              value={taskReferenceUrl}
              onChange={(event) => setTaskReferenceUrl(event.target.value)}
              placeholder="https://..."
              disabled={customLocked}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-proof-url">{copy("Proof link", "প্রুফ link")}</Label>
            <Input
              id="custom-proof-url"
              type="url"
              value={submissionUrl}
              onChange={(event) => setSubmissionUrl(event.target.value)}
              placeholder="https://..."
              disabled={customLocked}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-notes">{copy("Notes for reviewer", "Reviewer-এর জন্য note")}</Label>
            <Textarea
              id="custom-notes"
              value={submittedText}
              onChange={(event) => setSubmittedText(event.target.value)}
              placeholder={copy(
                "Mention your visible name, what was asked, and what the reviewer should verify.",
                "আপনার visible name, কী task দেওয়া হয়েছিল, আর reviewer কী verify করবে তা লিখুন।",
              )}
              disabled={customLocked}
            />
          </div>

          <Button
            className="w-full"
            disabled={!canSaveCustomSubmission}
            onClick={async () => {
              setMessage(null);

              try {
                const nextSubmissionId = await submitFlexibleTaskSubmission({
                  submissionId,
                  departmentId: activeDepartmentId,
                  user,
                  taskTitle,
                  taskReferenceUrl,
                  taskOrigin,
                  submittedText,
                  submissionUrl,
                  submissionType,
                  displayName: profile?.displayName,
                });

                try {
                  const nextSubmission = await fetchSubmission(nextSubmissionId);
                  if (nextSubmission) {
                    hydrateSubmission(nextSubmission);
                  }
                } catch {
                  setSubmission((current) => current || {
                    id: nextSubmissionId,
                    status: "pending",
                    reviewComment: "",
                    recommendedPoints: 0,
                    awardedPoints: 0,
                  });
                  setSubmissionId(nextSubmissionId);
                }

                try {
                  await refreshCustomSubmissions();
                } catch {
                  // Do not fail the success state if a follow-up refresh is delayed.
                }

                toast.success(
                  copy(
                    "Direct task submission saved. Reviewers can see it in the queue.",
                    "ডাইরেক্ট টাস্ক সাবমিশন জমা হয়েছে। রিভিউয়াররা এটা কিউতে দেখতে পারবেন।",
                  ),
                );
                setMessage(null);
              } catch (error) {
                const text = error.message || copy("Direct task submission failed.", "ডাইরেক্ট টাস্ক সাবমিশন করা যায়নি।");
                setMessage({ type: "error", text });
                toast.error(text);
              }
            }}
          >
            {submissionId
              ? copy("Save direct task submission", "ডাইরেক্ট টাস্ক সাবমিশন সেভ করুন")
              : copy("Submit direct task", "ডাইরেক্ট টাস্ক সাবমিট করুন")}
          </Button>

          {!submissionUrl.trim() && !customLocked ? (
            <p className="text-sm text-muted-foreground">
              {copy("Add a valid proof link before submitting.", "সাবমিট করার আগে একটি valid proof link দিন।")}
            </p>
          ) : null}

          {message ? (
            <Alert variant={message.type === "error" ? "destructive" : "default"}>
              <AlertTitle>
                {message.type === "error"
                  ? copy("Submission blocked", "সাবমিশন আটকে গেছে")
                  : copy("Submission received", "সাবমিশন গ্রহণ করা হয়েছে")}
              </AlertTitle>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          ) : null}

          <StatusSummary copy={copy} submission={submission} />
        </CardContent>
      </Card>
    </div>
  );
}
