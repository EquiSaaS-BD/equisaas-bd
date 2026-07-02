import React, { useMemo, useState } from "react";
import { ClipboardCheck, Clock3, ExternalLink, ListChecks, MessageSquare, Send, Tags } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import useGovernanceData from "@/hooks/useGovernanceData";
import { useLms } from "@/lms-context";

export default function MemberTaskCenter({ active = false, formatDateTime }) {
  const { claimsAdmin, lang, profile, user } = useLms();
  const { currentUser, departmentTasks, fetchTaskActivity, myTaskSubmissions, notice, submitTaskSubmission, taskSummary } = useGovernanceData({
    user,
    profile,
    claimsAdmin,
    lang,
    active,
  });
  const [taskId, setTaskId] = useState("");
  const [draft, setDraft] = useState({ submissionText: "", submissionLink: "", submissionNotes: "" });
  const [activityLog, setActivityLog] = useState([]);

  const assignedTasks = useMemo(
    () => departmentTasks.filter((item) => ["open", "in-progress", "needs-revision", "submitted", "approved"].includes(item.status || "open")),
    [departmentTasks],
  );

  const activeTask = assignedTasks.find((item) => item.taskId === taskId) || null;
  const activeSubmission = myTaskSubmissions.find((item) => item.taskId === taskId) || null;
  const completionValue = assignedTasks.length ? Math.round((myTaskSubmissions.filter((item) => item.status === "approved").length / assignedTasks.length) * 100) : 0;

  const openTask = async (task) => {
    const previous = myTaskSubmissions.find((item) => item.taskId === task.taskId) || null;
    setTaskId(task.taskId);
    setDraft({
      submissionText: previous?.submissionText || "",
      submissionLink: previous?.submissionLink || "",
      submissionNotes: previous?.submissionNotes || "",
    });
    setActivityLog(previous ? await fetchTaskActivity(previous.submissionId) : []);
  };

  const submitCurrentTask = async () => {
    if (!activeTask) return;
    const result = await submitTaskSubmission({ task: activeTask, ...draft });
    if (result) {
      setTaskId("");
      setDraft({ submissionText: "", submissionLink: "", submissionNotes: "" });
      setActivityLog([]);
    }
  };

  const hasDraftContent = Boolean(draft.submissionText.trim() || draft.submissionLink.trim() || draft.submissionNotes.trim());

  if (!user) {
    return (
      <Card className="border-none bg-background/60 shadow-premium backdrop-blur-sm">
        <CardHeader>
          <CardTitle>{lang === "bn" ? "টাস্ক সেন্টার" : "Task Center"}</CardTitle>
          <CardDescription>{lang === "bn" ? "সাইন ইন করলে আপনার অ্যাসাইন করা টাস্কগুলো দেখা যাবে।" : "Sign in to see the tasks assigned to you."}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-none bg-background/60 shadow-premium backdrop-blur-sm">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-primary" />
              {lang === "bn" ? "মেম্বার টাস্ক সেন্টার" : "Member Task Center"}
            </CardTitle>
            <CardDescription>
              {lang === "bn"
                ? "আপনার স্কোপে আসা কাজগুলো দেখুন, সাবমিট করুন, আর ফিডব্যাক অনুযায়ী রিসাবমিট করুন।"
                : "See the work assigned to your scope, submit updates, and resubmit after feedback."}
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="soft" className="border-none text-[10px] font-black uppercase tracking-[0.18em]">
              {currentUser.pathId || currentUser.departmentId || (lang === "bn" ? "মেম্বার" : "Member")}
            </Badge>
            <Badge variant="outline" className="border-primary/20 bg-primary/5 text-[10px] font-black uppercase tracking-[0.18em] text-primary">
              {lang === "bn" ? `${completionValue}% সম্পন্ন` : `${completionValue}% complete`}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {notice ? <div className="rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary">{notice}</div> : null}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-muted-foreground/10 bg-background/80 p-4"><div className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">{lang === "bn" ? "অ্যাসাইনড" : "Assigned"}</div><div className="mt-2 text-2xl font-black">{assignedTasks.length}</div></div>
            <div className="rounded-2xl border border-muted-foreground/10 bg-background/80 p-4"><div className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">{lang === "bn" ? "সাবমিটেড" : "Submitted"}</div><div className="mt-2 text-2xl font-black">{taskSummary.submitted || 0}</div></div>
            <div className="rounded-2xl border border-muted-foreground/10 bg-background/80 p-4"><div className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">{lang === "bn" ? "রিভিশন" : "Needs revision"}</div><div className="mt-2 text-2xl font-black">{taskSummary.needsRevision || 0}</div></div>
            <div className="rounded-2xl border border-muted-foreground/10 bg-background/80 p-4"><div className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">{lang === "bn" ? "অনুমোদিত" : "Approved"}</div><div className="mt-2 text-2xl font-black">{taskSummary.approved || 0}</div></div>
          </div>
          <Progress value={completionValue} className="h-2.5" />
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1.05fr,0.95fr]">
        <Card className="border-none bg-background/60 shadow-premium backdrop-blur-sm">
          <CardHeader>
            <CardTitle>{lang === "bn" ? "আপনার টাস্ক" : "Your tasks"}</CardTitle>
            <CardDescription>{lang === "bn" ? "টাস্ক খুলে সাবমিশন তৈরি করুন।" : "Open a task to prepare a submission."}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {assignedTasks.length ? (
              assignedTasks.map((task) => {
                const existing = myTaskSubmissions.find((item) => item.taskId === task.taskId);
                return (
                  <div key={task.taskId} className="rounded-2xl border border-muted-foreground/10 bg-background/80 p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="font-semibold">{lang === "bn" ? task.titleBn || task.titleEn : task.titleEn || task.titleBn}</div>
                        <div className="mt-2 text-sm leading-6 text-muted-foreground">{lang === "bn" ? task.descriptionBn || task.descriptionEn : task.descriptionEn || task.descriptionBn}</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Badge variant="outline" className="border-primary/20 bg-primary/5 text-[10px] font-black uppercase tracking-[0.18em] text-primary">{task.expectedSubmissionType || "mixed"}</Badge>
                          <Badge variant={existing?.status === "approved" ? "success" : existing?.status === "needs-revision" ? "warning" : "soft"} className="border-none text-[10px] font-black uppercase tracking-[0.18em]">{existing?.status || task.status || "open"}</Badge>
                          <Badge variant="outline" className="border-muted-foreground/20 bg-muted/40 text-[10px] font-black uppercase tracking-[0.18em]">{task.priority || "medium"}</Badge>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                          <div className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{task.dueAt ? formatDateTime(task.dueAt) : (lang === "bn" ? "ডেডলাইন নেই" : "No due date")}</div>
                          <div className="inline-flex items-center gap-1.5"><ListChecks className="h-3.5 w-3.5" />{(task.instructionsChecklist || []).length} {lang === "bn" ? "চেকপয়েন্ট" : "checkpoints"}</div>
                          <div className="inline-flex items-center gap-1.5"><Tags className="h-3.5 w-3.5" />{(task.tags || []).length} {lang === "bn" ? "ট্যাগ" : "tags"}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-start gap-2">
                        <Button className="rounded-2xl" onClick={() => openTask(task)}>{existing ? (lang === "bn" ? "আপডেট করুন" : "Update submission") : lang === "bn" ? "সাবমিট করুন" : "Submit"}</Button>
                        <div className="text-xs text-muted-foreground">{task.pathId || task.subdepartmentId || task.departmentId || "--"}</div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-muted-foreground/20 px-6 py-16 text-center text-sm font-semibold text-muted-foreground">
                {lang === "bn" ? "এখনও কোনো টাস্ক অ্যাসাইন করা হয়নি।" : "No tasks have been assigned yet."}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none bg-background/60 shadow-premium backdrop-blur-sm">
          <CardHeader>
            <CardTitle>{lang === "bn" ? "সাম্প্রতিক সাবমিশন" : "Recent submissions"}</CardTitle>
            <CardDescription>{lang === "bn" ? "আপনার জমাগুলোর স্ট্যাটাস ট্র্যাক করুন।" : "Track the status of your submitted work."}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {myTaskSubmissions.length ? (
              myTaskSubmissions.map((item) => (
                <div key={item.submissionId} className="rounded-2xl border border-muted-foreground/10 bg-background/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold">{item.taskId}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{formatDateTime(item.updatedAt || item.submittedAt)}</div>
                    </div>
                    <Badge variant={item.status === "approved" ? "success" : item.status === "needs-revision" ? "warning" : "soft"} className="border-none text-[10px] font-black uppercase tracking-[0.18em]">
                      {item.status}
                    </Badge>
                  </div>
                  {item.submissionLink ? <a href={item.submissionLink} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center text-sm font-semibold text-primary hover:underline">{lang === "bn" ? "লিংক খুলুন" : "Open link"}<ExternalLink className="ml-1 h-3.5 w-3.5" /></a> : null}
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-muted-foreground/20 px-6 py-16 text-center text-sm font-semibold text-muted-foreground">
                {lang === "bn" ? "এখনও কোনো সাবমিশন নেই।" : "No submissions yet."}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={Boolean(taskId)} onOpenChange={(open) => { if (!open) { setTaskId(""); setActivityLog([]); } }}>
        <DialogContent className="rounded-3xl border-none shadow-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{lang === "bn" ? activeTask?.titleBn || activeTask?.titleEn : activeTask?.titleEn || activeTask?.titleBn}</DialogTitle>
            <DialogDescription>{lang === "bn" ? "টেক্সট, লিংক, নোট বা মিশ্র সাবমিশন জমা দিন।" : "Submit text, links, notes, or a mixed delivery update."}</DialogDescription>
          </DialogHeader>

          {activeTask ? (
            <div className="grid gap-4">
              <div className="rounded-2xl border border-muted-foreground/10 bg-muted/20 p-4 text-sm leading-7 text-foreground/90">
                {lang === "bn" ? activeTask.descriptionBn || activeTask.descriptionEn : activeTask.descriptionEn || activeTask.descriptionBn}
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-muted-foreground/10 bg-background/80 p-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">{lang === "bn" ? "সাবমিশন টাইপ" : "Submission type"}</div>
                  <div className="mt-2 font-semibold">{activeTask.expectedSubmissionType || "mixed"}</div>
                </div>
                <div className="rounded-2xl border border-muted-foreground/10 bg-background/80 p-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">{lang === "bn" ? "ডেডলাইন" : "Due date"}</div>
                  <div className="mt-2 font-semibold">{activeTask.dueAt ? formatDateTime(activeTask.dueAt) : (lang === "bn" ? "কোনো ডেডলাইন নেই" : "No due date")}</div>
                </div>
                <div className="rounded-2xl border border-muted-foreground/10 bg-background/80 p-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">{lang === "bn" ? "বর্তমান স্ট্যাটাস" : "Current status"}</div>
                  <div className="mt-2 font-semibold">{activeSubmission?.status || activeTask.status || "open"}</div>
                </div>
              </div>
              {(activeTask.instructionsChecklist || []).length ? (
                <div className="rounded-2xl border border-muted-foreground/10 bg-background/80 p-4">
                  <div className="mb-3 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground"><ListChecks className="h-4 w-4" />{lang === "bn" ? "চেকলিস্ট" : "Checklist"}</div>
                  <div className="grid gap-2">{(activeTask.instructionsChecklist || []).map((item) => <div key={item} className="rounded-2xl border border-muted-foreground/10 bg-muted/20 px-4 py-3 text-sm">{item}</div>)}</div>
                </div>
              ) : null}
              <Textarea value={draft.submissionText} onChange={(event) => setDraft((prev) => ({ ...prev, submissionText: event.target.value }))} placeholder={lang === "bn" ? "আপনি কী করেছেন তা লিখুন" : "Explain what you completed"} className="min-h-[160px] bg-muted/30" />
              <Input value={draft.submissionLink} onChange={(event) => setDraft((prev) => ({ ...prev, submissionLink: event.target.value }))} placeholder={lang === "bn" ? "লাইভ লিংক / ডক / ফাইল লিংক" : "Live link / doc / file link"} className="h-11 bg-muted/30" />
              <Textarea value={draft.submissionNotes} onChange={(event) => setDraft((prev) => ({ ...prev, submissionNotes: event.target.value }))} placeholder={lang === "bn" ? "অতিরিক্ত নোট" : "Additional notes"} className="min-h-[120px] bg-muted/30" />
              {activeSubmission?.reviewFeedbackEn || activeSubmission?.reviewFeedbackBn ? (
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-700">{lang === "bn" ? "সর্বশেষ ফিডব্যাক" : "Latest feedback"}</div>
                  <div className="mt-3 text-sm leading-7 text-foreground/90">{lang === "bn" ? activeSubmission.reviewFeedbackBn || activeSubmission.reviewFeedbackEn : activeSubmission.reviewFeedbackEn || activeSubmission.reviewFeedbackBn}</div>
                </div>
              ) : null}
              {activityLog.length ? (
                <div className="rounded-2xl border border-muted-foreground/10 bg-background/80 p-4">
                  <div className="mb-3 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground"><MessageSquare className="h-4 w-4" />{lang === "bn" ? "অ্যাক্টিভিটি হিস্ট্রি" : "Activity history"}</div>
                  <div className="space-y-2">{activityLog.map((entry) => <div key={entry.activityId} className="rounded-2xl border border-muted-foreground/10 bg-muted/20 p-3"><div className="flex items-center justify-between gap-3"><Badge variant="outline" className="border-primary/20 bg-primary/5 text-[10px] font-black uppercase tracking-[0.18em] text-primary">{entry.type}</Badge><span className="text-xs text-muted-foreground">{formatDateTime(entry.createdAt)}</span></div><div className="mt-2 text-sm leading-6">{lang === "bn" ? entry.messageBn || entry.messageEn : entry.messageEn || entry.messageBn}</div></div>)}</div>
                </div>
              ) : null}
            </div>
          ) : null}

          <DialogFooter className="gap-3">
            <Button variant="outline" className="rounded-2xl" onClick={() => { setTaskId(""); setActivityLog([]); }}>{lang === "bn" ? "বন্ধ" : "Close"}</Button>
            <Button className="rounded-2xl" onClick={submitCurrentTask} disabled={!hasDraftContent}>
              <Send className="mr-2 h-4 w-4" />
              {activeSubmission ? (lang === "bn" ? "রিসাবমিট" : "Resubmit") : lang === "bn" ? "সাবমিট" : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
