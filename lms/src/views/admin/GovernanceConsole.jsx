import React, { useMemo, useState } from "react";
import { CheckCircle2, RefreshCw } from "lucide-react";
import { DEPARTMENTS, PATHS } from "@/data/structure.mjs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import useGovernanceData from "@/hooks/useGovernanceData";
import { getPrimaryRole, getRoleLabel, getScopeCoverageLabel } from "@/lib/governance";
import { useLms } from "@/lms-context";
import GovernanceReportsPanel from "./GovernanceReportsPanel";

const EMPTY_SCOPE = { managerUid: "", role: "department-manager", scopeType: "department", departmentId: "", subdepartmentId: "", pathId: "", squadIds: "" };
const EMPTY_ROLE = { uid: "", role: "member" };
const EMPTY_TASK = { titleEn: "", titleBn: "", descriptionEn: "", descriptionBn: "", departmentId: "", subdepartmentId: "", pathId: "", squadId: "", assigneeScope: "path", assigneeIds: "", priority: "medium", status: "open", expectedSubmissionType: "mixed", instructionsChecklist: "", tags: "", dueAt: "" };

const splitList = (value = "") => Array.from(new Set(String(value).split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean)));
const toMillis = (value) => (typeof value?.toMillis === "function" ? value.toMillis() : typeof value?.seconds === "number" ? value.seconds * 1000 : value ? Date.parse(value) || 0 : 0);
const toDateInput = (value) => {
  const millis = toMillis(value);
  if (!millis) return "";
  const date = new Date(millis);
  return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`;
};

export default function GovernanceConsole({ active = false, formatDateTime }) {
  const { claimsAdmin, hasManagementAccess, lang, profile, user } = useLms();
  const governance = useGovernanceData({ user, profile, claimsAdmin, lang, active });
  const {
    assignManagementScope,
    canApproveTasks,
    canCreateTasks,
    canManage,
    canReviewTasks,
    createDepartmentTask,
    currentUser,
    departmentTasks,
    fetchTaskActivity,
    loadGovernanceData,
    loading,
    managementScopes,
    myTaskSubmissions,
    notice,
    refreshReportingSnapshots,
    reportingSnapshots,
    reviewTaskSubmission,
    reviewableTaskQueue,
    revokeManagementScope,
    roleLabel,
    setUserRole,
    taskSubmissionMap,
    taskSubmissions,
    updateDepartmentTask,
    users,
  } = governance;

  const [tab, setTab] = useState("reports");
  const [scopeForm, setScopeForm] = useState(EMPTY_SCOPE);
  const [roleForm, setRoleForm] = useState(EMPTY_ROLE);
  const [taskForm, setTaskForm] = useState(EMPTY_TASK);
  const [editingTaskId, setEditingTaskId] = useState("");
  const [reviewId, setReviewId] = useState("");
  const [reviewActivity, setReviewActivity] = useState([]);
  const [reviewDraft, setReviewDraft] = useState({ reviewFeedbackEn: "", reviewFeedbackBn: "" });

  const canAssignSuperAdmin = useMemo(() => getPrimaryRole(currentUser, claimsAdmin) === "super-admin", [claimsAdmin, currentUser]);
  const subdepartmentOptions = useMemo(() => {
    const deptId = scopeForm.departmentId || taskForm.departmentId || currentUser.departmentId;
    return DEPARTMENTS.find((item) => item.id === deptId)?.subdepartments || [];
  }, [currentUser.departmentId, scopeForm.departmentId, taskForm.departmentId]);
  const pathOptions = useMemo(() => {
    const deptId = taskForm.departmentId || scopeForm.departmentId || currentUser.departmentId;
    const subId = taskForm.subdepartmentId || scopeForm.subdepartmentId || currentUser.subdepartmentId;
    return PATHS.filter((path) => (subId ? path.subdeptId === subId : deptId ? path.deptId === deptId : true));
  }, [currentUser.departmentId, currentUser.subdepartmentId, scopeForm.departmentId, scopeForm.subdepartmentId, taskForm.departmentId, taskForm.subdepartmentId]);
  const summary = useMemo(() => {
    const platform = reportingSnapshots.platform;
    return [
      { id: "members", label: lang === "bn" ? "মেম্বার" : "Members", value: platform?.totalMembers ?? reportingSnapshots.members.length },
      { id: "active", label: lang === "bn" ? "সক্রিয়" : "Active", value: platform?.activeLearners30d ?? reportingSnapshots.members.filter((item) => Number(item.completionRate || 0) > 0).length },
      { id: "tasks", label: lang === "bn" ? "টাস্ক" : "Tasks", value: platform?.totalTasksOpen ?? departmentTasks.length },
      { id: "queue", label: lang === "bn" ? "রিভিউ" : "Review", value: platform?.totalSubmissionsPendingReview ?? reviewableTaskQueue.length },
    ];
  }, [departmentTasks.length, lang, reportingSnapshots, reviewableTaskQueue.length]);

  if (!hasManagementAccess) {
    return <Card className="border-none bg-background/60 shadow-premium"><CardHeader><CardTitle>{lang === "bn" ? "ম্যানেজমেন্ট অ্যাক্সেস প্রয়োজন" : "Management access required"}</CardTitle><CardDescription>{lang === "bn" ? "এই কনসোলটি ম্যানেজমেন্ট রোলের জন্য সংরক্ষিত।" : "This console is reserved for management roles."}</CardDescription></CardHeader></Card>;
  }

  const selectedReview = reviewId ? taskSubmissionMap[reviewId] : null;

  const submitScope = async (event) => {
    event.preventDefault();
    const result = await assignManagementScope({ managerUid: scopeForm.managerUid, role: scopeForm.role, scopeType: scopeForm.scopeType, departmentId: scopeForm.departmentId || null, subdepartmentId: scopeForm.subdepartmentId || null, pathIds: scopeForm.pathId ? [scopeForm.pathId] : [], squadIds: splitList(scopeForm.squadIds) });
    if (result) setScopeForm(EMPTY_SCOPE);
  };

  const submitRole = async (event) => {
    event.preventDefault();
    const result = await setUserRole(roleForm);
    if (result) setRoleForm(EMPTY_ROLE);
  };

  const submitTask = async (event) => {
    event.preventDefault();
    const payload = {
      ...taskForm,
      departmentId: taskForm.departmentId || currentUser.departmentId || null,
      subdepartmentId: taskForm.subdepartmentId || currentUser.subdepartmentId || null,
      pathId: taskForm.pathId || currentUser.pathId || null,
      squadId: taskForm.squadId || currentUser.squadId || null,
      assigneeIds: splitList(taskForm.assigneeIds),
      instructionsChecklist: splitList(taskForm.instructionsChecklist),
      tags: splitList(taskForm.tags),
      dueAt: taskForm.dueAt ? new Date(`${taskForm.dueAt}T23:59:59`) : null,
    };
    const result = editingTaskId ? await updateDepartmentTask(editingTaskId, payload) : await createDepartmentTask(payload);
    if (result) {
      setEditingTaskId("");
      setTaskForm(EMPTY_TASK);
    }
  };

  const openReview = async (submissionId) => {
    setReviewId(submissionId);
    setReviewActivity(await fetchTaskActivity(submissionId));
    setReviewDraft({ reviewFeedbackEn: taskSubmissionMap[submissionId]?.reviewFeedbackEn || "", reviewFeedbackBn: taskSubmissionMap[submissionId]?.reviewFeedbackBn || "" });
  };

  const sendReview = async (status) => {
    const result = await reviewTaskSubmission({ submissionId: reviewId, status, reviewFeedbackEn: reviewDraft.reviewFeedbackEn, reviewFeedbackBn: reviewDraft.reviewFeedbackBn });
    if (result) {
      setReviewId("");
      setReviewActivity([]);
      setReviewDraft({ reviewFeedbackEn: "", reviewFeedbackBn: "" });
    }
  };

  const beginEditTask = (item) => {
    setEditingTaskId(item.taskId);
    setTaskForm({
      titleEn: item.titleEn || "",
      titleBn: item.titleBn || "",
      descriptionEn: item.descriptionEn || "",
      descriptionBn: item.descriptionBn || "",
      departmentId: item.departmentId || "",
      subdepartmentId: item.subdepartmentId || "",
      pathId: item.pathId || "",
      squadId: item.squadId || "",
      assigneeScope: item.assigneeScope || "path",
      assigneeIds: (item.assigneeIds || []).join(", "),
      priority: item.priority || "medium",
      status: item.status || "open",
      expectedSubmissionType: item.expectedSubmissionType || "mixed",
      instructionsChecklist: (item.instructionsChecklist || []).join("\n"),
      tags: (item.tags || []).join(", "),
      dueAt: toDateInput(item.dueAt),
    });
    setTab("tasks");
  };

  return (
    <div className="space-y-6">
      <Card className="border-none bg-background/60 shadow-premium">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div><CardTitle>{lang === "bn" ? "গভর্ন্যান্স কনসোল" : "Governance Console"}</CardTitle><CardDescription>{lang === "bn" ? "রিপোর্টিং, স্কোপ, টাস্ক, আর review এক জায়গায়।" : "Reporting, scopes, tasks, and review workflows in one place."}</CardDescription></div>
          <div className="flex flex-wrap gap-3"><Badge variant="soft" className="border-none text-[10px] font-black uppercase tracking-[0.18em]">{roleLabel}</Badge><Button variant="outline" className="rounded-2xl" onClick={() => loadGovernanceData({ force: true })} disabled={loading}><RefreshCw className="mr-2 h-4 w-4" />{lang === "bn" ? "রিফ্রেশ" : "Refresh"}</Button></div>
        </CardHeader>
        {notice ? <CardContent className="pt-0"><div className="rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary">{notice}</div></CardContent> : null}
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => <Card key={item.id} className="border-none bg-background/60 shadow-premium"><CardContent className="p-6"><div className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">{item.label}</div><div className="mt-3 text-3xl font-black">{item.value}</div></CardContent></Card>)}
      </div>

      <Tabs value={tab} onValueChange={setTab} className="space-y-6">
        <TabsList className="h-auto flex-wrap rounded-2xl border border-muted-foreground/10 bg-muted/30 p-1.5">
          <TabsTrigger value="reports" className="rounded-xl px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.18em]">{lang === "bn" ? "রিপোর্ট" : "Reports"}</TabsTrigger>
          <TabsTrigger value="tasks" className="rounded-xl px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.18em]">{lang === "bn" ? "টাস্ক" : "Tasks"}</TabsTrigger>
          {canManage ? <TabsTrigger value="scopes" className="rounded-xl px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.18em]">{lang === "bn" ? "স্কোপ" : "Scopes"}</TabsTrigger> : null}
        </TabsList>

        <TabsContent value="reports" className="space-y-6">
          <Card className="border-none bg-background/60 shadow-premium"><CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><CardTitle>{lang === "bn" ? "রিপোর্টিং ও স্ন্যাপশট" : "Reporting and snapshots"}</CardTitle><CardDescription>{lang === "bn" ? "Spark-safe snapshot থেকে department, subdepartment, path, member, আর district visibility." : "Spark-safe reporting from denormalized snapshots across departments, subdepartments, paths, members, and districts."}</CardDescription></div>{canManage ? <Button className="rounded-2xl" onClick={refreshReportingSnapshots} disabled={loading}><RefreshCw className="mr-2 h-4 w-4" />{lang === "bn" ? "স্ন্যাপশট রিফ্রেশ" : "Refresh snapshots"}</Button> : null}</CardHeader></Card>
          <GovernanceReportsPanel lang={lang} formatDateTime={formatDateTime} departmentTasks={departmentTasks} managementScopes={managementScopes} reportingSnapshots={reportingSnapshots} reviewableTaskQueue={reviewableTaskQueue} taskSubmissions={taskSubmissions} />
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          {canCreateTasks ? <Card className="border-none bg-background/60 shadow-premium"><CardHeader><CardTitle>{editingTaskId ? (lang === "bn" ? "টাস্ক এডিট" : "Edit task") : lang === "bn" ? "নতুন টাস্ক" : "New task"}</CardTitle><CardDescription>{lang === "bn" ? "স্কোপের মধ্যে bilingual task assign করুন।" : "Create a bilingual task inside your assigned scope."}</CardDescription></CardHeader><CardContent><form onSubmit={submitTask} className="grid gap-4 md:grid-cols-2"><Input value={taskForm.titleEn} onChange={(event) => setTaskForm((prev) => ({ ...prev, titleEn: event.target.value }))} placeholder="Title (English)" className="h-11 bg-muted/40" required /><Input value={taskForm.titleBn} onChange={(event) => setTaskForm((prev) => ({ ...prev, titleBn: event.target.value }))} placeholder="শিরোনাম (বাংলা)" className="h-11 bg-muted/40" required /><Textarea value={taskForm.descriptionEn} onChange={(event) => setTaskForm((prev) => ({ ...prev, descriptionEn: event.target.value }))} placeholder="Description (English)" className="min-h-[120px] bg-muted/40 md:col-span-2" required /><Textarea value={taskForm.descriptionBn} onChange={(event) => setTaskForm((prev) => ({ ...prev, descriptionBn: event.target.value }))} placeholder="বর্ণনা (বাংলা)" className="min-h-[120px] bg-muted/40 md:col-span-2" required /><Select value={taskForm.departmentId || "none"} onValueChange={(value) => setTaskForm((prev) => ({ ...prev, departmentId: value === "none" ? "" : value, subdepartmentId: "", pathId: "" }))}><SelectTrigger className="h-11 bg-muted/40"><SelectValue placeholder={lang === "bn" ? "ডিপার্টমেন্ট" : "Department"} /></SelectTrigger><SelectContent><SelectItem value="none">{lang === "bn" ? "নিজের স্কোপ" : "Use my scope"}</SelectItem>{DEPARTMENTS.map((item) => <SelectItem key={item.id} value={item.id}>{lang === "bn" ? item.titleBn : item.titleEn}</SelectItem>)}</SelectContent></Select><Select value={taskForm.subdepartmentId || "none"} onValueChange={(value) => setTaskForm((prev) => ({ ...prev, subdepartmentId: value === "none" ? "" : value, pathId: "" }))}><SelectTrigger className="h-11 bg-muted/40"><SelectValue placeholder={lang === "bn" ? "সাবডিপার্টমেন্ট" : "Subdepartment"} /></SelectTrigger><SelectContent><SelectItem value="none">{lang === "bn" ? "ঐচ্ছিক" : "Optional"}</SelectItem>{subdepartmentOptions.map((item) => <SelectItem key={item.id} value={item.id}>{lang === "bn" ? item.titleBn : item.titleEn}</SelectItem>)}</SelectContent></Select><Select value={taskForm.pathId || "none"} onValueChange={(value) => setTaskForm((prev) => ({ ...prev, pathId: value === "none" ? "" : value }))}><SelectTrigger className="h-11 bg-muted/40"><SelectValue placeholder={lang === "bn" ? "পাথ" : "Path"} /></SelectTrigger><SelectContent><SelectItem value="none">{lang === "bn" ? "ঐচ্ছিক" : "Optional"}</SelectItem>{pathOptions.map((item) => <SelectItem key={item.id} value={item.id}>{lang === "bn" ? item.titleBn : item.titleEn}</SelectItem>)}</SelectContent></Select><Input value={taskForm.squadId} onChange={(event) => setTaskForm((prev) => ({ ...prev, squadId: event.target.value }))} placeholder={lang === "bn" ? "স্কোয়াড আইডি" : "Squad ID"} className="h-11 bg-muted/40" /><Select value={taskForm.assigneeScope} onValueChange={(value) => setTaskForm((prev) => ({ ...prev, assigneeScope: value }))}><SelectTrigger className="h-11 bg-muted/40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="department">{lang === "bn" ? "ডিপার্টমেন্ট" : "Department"}</SelectItem><SelectItem value="subdepartment">{lang === "bn" ? "সাবডিপার্টমেন্ট" : "Subdepartment"}</SelectItem><SelectItem value="path">{lang === "bn" ? "পাথ" : "Path"}</SelectItem><SelectItem value="squad">{lang === "bn" ? "স্কোয়াড" : "Squad"}</SelectItem><SelectItem value="member-list">{lang === "bn" ? "সদস্য তালিকা" : "Member list"}</SelectItem></SelectContent></Select><Input value={taskForm.assigneeIds} onChange={(event) => setTaskForm((prev) => ({ ...prev, assigneeIds: event.target.value }))} placeholder={lang === "bn" ? "UID, UID" : "UID, UID"} className="h-11 bg-muted/40" /><Select value={taskForm.priority} onValueChange={(value) => setTaskForm((prev) => ({ ...prev, priority: value }))}><SelectTrigger className="h-11 bg-muted/40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="low">{lang === "bn" ? "লো" : "Low"}</SelectItem><SelectItem value="medium">{lang === "bn" ? "মিডিয়াম" : "Medium"}</SelectItem><SelectItem value="high">{lang === "bn" ? "হাই" : "High"}</SelectItem><SelectItem value="urgent">{lang === "bn" ? "আর্জেন্ট" : "Urgent"}</SelectItem></SelectContent></Select><Select value={taskForm.expectedSubmissionType} onValueChange={(value) => setTaskForm((prev) => ({ ...prev, expectedSubmissionType: value }))}><SelectTrigger className="h-11 bg-muted/40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="text">{lang === "bn" ? "টেক্সট" : "Text"}</SelectItem><SelectItem value="link">{lang === "bn" ? "লিংক" : "Link"}</SelectItem><SelectItem value="file-link">{lang === "bn" ? "ফাইল লিংক" : "File link"}</SelectItem><SelectItem value="mixed">{lang === "bn" ? "মিক্সড" : "Mixed"}</SelectItem></SelectContent></Select><Select value={taskForm.status} onValueChange={(value) => setTaskForm((prev) => ({ ...prev, status: value }))}><SelectTrigger className="h-11 bg-muted/40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">{lang === "bn" ? "ড্রাফট" : "Draft"}</SelectItem><SelectItem value="open">{lang === "bn" ? "ওপেন" : "Open"}</SelectItem><SelectItem value="in-progress">{lang === "bn" ? "ইন-প্রগ্রেস" : "In progress"}</SelectItem></SelectContent></Select><Input type="date" value={taskForm.dueAt} onChange={(event) => setTaskForm((prev) => ({ ...prev, dueAt: event.target.value }))} className="h-11 bg-muted/40" /><Textarea value={taskForm.instructionsChecklist} onChange={(event) => setTaskForm((prev) => ({ ...prev, instructionsChecklist: event.target.value }))} placeholder={lang === "bn" ? "লাইন ধরে চেকলিস্ট" : "Checklist, one per line"} className="min-h-[100px] bg-muted/40" /><Textarea value={taskForm.tags} onChange={(event) => setTaskForm((prev) => ({ ...prev, tags: event.target.value }))} placeholder="tag, tag" className="min-h-[100px] bg-muted/40" /><div className="md:col-span-2 flex flex-wrap gap-3"><Button type="submit" className="rounded-2xl">{editingTaskId ? (lang === "bn" ? "টাস্ক আপডেট" : "Update task") : lang === "bn" ? "টাস্ক তৈরি" : "Create task"}</Button>{editingTaskId ? <Button type="button" variant="outline" className="rounded-2xl" onClick={() => { setEditingTaskId(""); setTaskForm(EMPTY_TASK); }}>{lang === "bn" ? "ক্যানসেল" : "Cancel"}</Button> : null}</div></form></CardContent></Card> : null}

          <Card className="border-none bg-background/60 shadow-premium"><CardHeader><CardTitle>{lang === "bn" ? "টাস্ক ও রিভিউ কিউ" : "Tasks and review queue"}</CardTitle><CardDescription>{lang === "bn" ? "আপনার scope-এর task, submission, আর review activity." : "Task, submission, and review activity for your scope."}</CardDescription></CardHeader><CardContent className="space-y-6"><div className="rounded-2xl border border-muted-foreground/10 bg-background/80 p-0"><Table><TableHeader><TableRow><TableHead>{lang === "bn" ? "টাস্ক" : "Task"}</TableHead><TableHead>{lang === "bn" ? "কভারেজ" : "Coverage"}</TableHead><TableHead>{lang === "bn" ? "প্রায়োরিটি" : "Priority"}</TableHead><TableHead>{lang === "bn" ? "স্ট্যাটাস" : "Status"}</TableHead><TableHead>{lang === "bn" ? "ডেডলাইন" : "Due"}</TableHead><TableHead>{lang === "bn" ? "অ্যাকশন" : "Action"}</TableHead></TableRow></TableHeader><TableBody>{departmentTasks.length ? departmentTasks.map((item) => <TableRow key={item.taskId}><TableCell><div className="font-semibold">{lang === "bn" ? item.titleBn || item.titleEn : item.titleEn || item.titleBn}</div><div className="mt-1 text-xs text-muted-foreground">{item.assigneeCount || 0} {lang === "bn" ? "অ্যাসাইনি" : "assignees"}</div></TableCell><TableCell className="text-xs text-muted-foreground">{item.pathId || item.subdepartmentId || item.departmentId || item.squadId || "--"}</TableCell><TableCell><Badge variant="outline" className="border-primary/20 bg-primary/5 text-[10px] font-black uppercase tracking-[0.18em] text-primary">{item.priority || "medium"}</Badge></TableCell><TableCell><Badge variant={item.status === "approved" ? "success" : item.status === "needs-revision" ? "warning" : "soft"} className="border-none text-[10px] font-black uppercase tracking-[0.18em]">{item.status}</Badge></TableCell><TableCell className="text-xs text-muted-foreground">{item.dueAt ? formatDateTime(item.dueAt) : "--"}</TableCell><TableCell>{canCreateTasks ? <Button variant="ghost" size="sm" className="font-bold" onClick={() => beginEditTask(item)}>{lang === "bn" ? "এডিট" : "Edit"}</Button> : null}</TableCell></TableRow>) : <TableRow><TableCell colSpan={6} className="py-12 text-center text-sm font-semibold text-muted-foreground">{lang === "bn" ? "কোনো টাস্ক নেই।" : "No tasks yet."}</TableCell></TableRow>}</TableBody></Table></div>
            <div className="rounded-2xl border border-muted-foreground/10 bg-background/80 p-0"><Table><TableHeader><TableRow><TableHead>{lang === "bn" ? "সদস্য" : "Member"}</TableHead><TableHead>{lang === "bn" ? "টাস্ক" : "Task"}</TableHead><TableHead>{lang === "bn" ? "স্টেট" : "State"}</TableHead><TableHead>{lang === "bn" ? "আপডেট" : "Updated"}</TableHead><TableHead>{lang === "bn" ? "অ্যাকশন" : "Action"}</TableHead></TableRow></TableHeader><TableBody>{reviewableTaskQueue.length ? reviewableTaskQueue.map((item) => <TableRow key={item.queueId}><TableCell className="font-semibold">{item.memberName || item.uid}</TableCell><TableCell>{item.taskId || "--"}</TableCell><TableCell><Badge variant={item.state === "approved" ? "success" : "warning"} className="border-none text-[10px] font-black uppercase tracking-[0.18em]">{item.state}</Badge></TableCell><TableCell className="text-xs text-muted-foreground">{item.updatedAt ? formatDateTime(item.updatedAt) : "--"}</TableCell><TableCell><Button variant="ghost" size="sm" className="font-bold" onClick={() => openReview(item.sourceSubmissionId)}>{lang === "bn" ? "ওপেন" : "Open"}</Button></TableCell></TableRow>) : <TableRow><TableCell colSpan={5} className="py-12 text-center text-sm font-semibold text-muted-foreground">{lang === "bn" ? "রিভিউ কিউ খালি।" : "Review queue is clear."}</TableCell></TableRow>}</TableBody></Table></div>
            {selectedReview ? <div className="grid gap-4 lg:grid-cols-[1fr,0.95fr]"><div className="rounded-2xl border border-muted-foreground/10 bg-muted/20 p-4"><div className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">{lang === "bn" ? "সাবমিশন" : "Submission"}</div><p className="mt-3 whitespace-pre-wrap text-sm leading-7">{selectedReview.submissionText || "--"}</p>{selectedReview.submissionNotes ? <div className="mt-4 rounded-2xl border border-muted-foreground/10 bg-background/80 p-3 text-sm text-muted-foreground">{selectedReview.submissionNotes}</div> : null}<div className="mt-4 text-sm text-muted-foreground">{selectedReview.submissionLink || "--"}</div><div className="mt-4 space-y-2">{reviewActivity.map((activity) => <div key={activity.activityId} className="rounded-2xl border border-muted-foreground/10 bg-background/80 p-3"><div className="flex items-center justify-between gap-3"><Badge variant="outline" className="border-primary/20 bg-primary/5 text-[10px] font-black uppercase tracking-[0.18em] text-primary">{activity.type}</Badge><span className="text-xs text-muted-foreground">{formatDateTime(activity.createdAt)}</span></div><div className="mt-2 text-sm font-semibold">{lang === "bn" ? activity.messageBn || activity.messageEn : activity.messageEn || activity.messageBn}</div></div>)}</div></div><div className="space-y-4"><Textarea value={reviewDraft.reviewFeedbackEn} onChange={(event) => setReviewDraft((prev) => ({ ...prev, reviewFeedbackEn: event.target.value }))} placeholder="Review feedback in English" className="min-h-[140px] bg-muted/30" /><Textarea value={reviewDraft.reviewFeedbackBn} onChange={(event) => setReviewDraft((prev) => ({ ...prev, reviewFeedbackBn: event.target.value }))} placeholder="রিভিউ ফিডব্যাক বাংলায়" className="min-h-[140px] bg-muted/30" /><div className="flex flex-wrap gap-3"><Button variant="outline" className="rounded-2xl" onClick={() => sendReview("needs-revision")} disabled={!canReviewTasks}>{lang === "bn" ? "রিভিশন" : "Request revision"}</Button><Button className="rounded-2xl" onClick={() => sendReview("approved")} disabled={!canApproveTasks}><CheckCircle2 className="mr-2 h-4 w-4" />{lang === "bn" ? "অনুমোদন" : "Approve"}</Button></div></div></div> : null}
            {myTaskSubmissions.length ? <div className="rounded-2xl border border-muted-foreground/10 bg-background/80 p-4"><div className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">{lang === "bn" ? "আমার সাম্প্রতিক সাবমিশন" : "My recent submissions"}</div><div className="grid gap-3 md:grid-cols-2">{myTaskSubmissions.slice(0, 4).map((item) => <div key={item.submissionId} className="rounded-2xl border border-muted-foreground/10 bg-muted/20 p-4"><div className="flex items-center justify-between gap-3"><div className="font-semibold">{item.taskId}</div><Badge variant={item.status === "approved" ? "success" : item.status === "needs-revision" ? "warning" : "soft"} className="border-none text-[10px] font-black uppercase tracking-[0.18em]">{item.status}</Badge></div><div className="mt-2 text-xs text-muted-foreground">{item.updatedAt ? formatDateTime(item.updatedAt) : "--"}</div></div>)}</div></div> : null}
          </CardContent></Card>
        </TabsContent>

        {canManage ? <TabsContent value="scopes" className="space-y-6"><div className="grid gap-6 xl:grid-cols-2"><Card className="border-none bg-background/60 shadow-premium"><CardHeader><CardTitle>{lang === "bn" ? "স্কোপ অ্যাসাইন" : "Assign scope"}</CardTitle><CardDescription>{lang === "bn" ? "ম্যানেজার, পাথ, ডিপার্টমেন্ট বা স্কোয়াড অ্যাসাইন করুন।" : "Assign managers to departments, paths, or squads."}</CardDescription></CardHeader><CardContent><form onSubmit={submitScope} className="space-y-4"><Select value={scopeForm.managerUid || "none"} onValueChange={(value) => setScopeForm((prev) => ({ ...prev, managerUid: value === "none" ? "" : value }))}><SelectTrigger className="h-11 bg-muted/40"><SelectValue placeholder={lang === "bn" ? "সদস্য নির্বাচন করুন" : "Select member"} /></SelectTrigger><SelectContent><SelectItem value="none">{lang === "bn" ? "সদস্য" : "Member"}</SelectItem>{users.map((item) => <SelectItem key={item.uid || item.id} value={item.uid || item.id}>{item.displayName || item.email || item.uid}</SelectItem>)}</SelectContent></Select><div className="grid gap-4 md:grid-cols-2"><Select value={scopeForm.role} onValueChange={(value) => setScopeForm((prev) => ({ ...prev, role: value }))}><SelectTrigger className="h-11 bg-muted/40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="core-management">{getRoleLabel("core-management", lang)}</SelectItem><SelectItem value="department-manager">{getRoleLabel("department-manager", lang)}</SelectItem><SelectItem value="squad-lead">{getRoleLabel("squad-lead", lang)}</SelectItem></SelectContent></Select><Select value={scopeForm.scopeType} onValueChange={(value) => setScopeForm((prev) => ({ ...prev, scopeType: value }))}><SelectTrigger className="h-11 bg-muted/40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="global">{lang === "bn" ? "গ্লোবাল" : "Global"}</SelectItem><SelectItem value="department">{lang === "bn" ? "ডিপার্টমেন্ট" : "Department"}</SelectItem><SelectItem value="subdepartment">{lang === "bn" ? "সাবডিপার্টমেন্ট" : "Subdepartment"}</SelectItem><SelectItem value="path">{lang === "bn" ? "পাথ" : "Path"}</SelectItem><SelectItem value="squad">{lang === "bn" ? "স্কোয়াড" : "Squad"}</SelectItem></SelectContent></Select></div><div className="grid gap-4 md:grid-cols-2"><Select value={scopeForm.departmentId || "none"} onValueChange={(value) => setScopeForm((prev) => ({ ...prev, departmentId: value === "none" ? "" : value, subdepartmentId: "", pathId: "" }))}><SelectTrigger className="h-11 bg-muted/40"><SelectValue placeholder={lang === "bn" ? "ডিপার্টমেন্ট" : "Department"} /></SelectTrigger><SelectContent><SelectItem value="none">{lang === "bn" ? "ঐচ্ছিক" : "Optional"}</SelectItem>{DEPARTMENTS.map((item) => <SelectItem key={item.id} value={item.id}>{lang === "bn" ? item.titleBn : item.titleEn}</SelectItem>)}</SelectContent></Select><Select value={scopeForm.subdepartmentId || "none"} onValueChange={(value) => setScopeForm((prev) => ({ ...prev, subdepartmentId: value === "none" ? "" : value, pathId: "" }))}><SelectTrigger className="h-11 bg-muted/40"><SelectValue placeholder={lang === "bn" ? "সাবডিপার্টমেন্ট" : "Subdepartment"} /></SelectTrigger><SelectContent><SelectItem value="none">{lang === "bn" ? "ঐচ্ছিক" : "Optional"}</SelectItem>{subdepartmentOptions.map((item) => <SelectItem key={item.id} value={item.id}>{lang === "bn" ? item.titleBn : item.titleEn}</SelectItem>)}</SelectContent></Select></div><Select value={scopeForm.pathId || "none"} onValueChange={(value) => setScopeForm((prev) => ({ ...prev, pathId: value === "none" ? "" : value }))}><SelectTrigger className="h-11 bg-muted/40"><SelectValue placeholder={lang === "bn" ? "পাথ" : "Path"} /></SelectTrigger><SelectContent><SelectItem value="none">{lang === "bn" ? "ঐচ্ছিক" : "Optional"}</SelectItem>{pathOptions.map((item) => <SelectItem key={item.id} value={item.id}>{lang === "bn" ? item.titleBn : item.titleEn}</SelectItem>)}</SelectContent></Select><Input value={scopeForm.squadIds} onChange={(event) => setScopeForm((prev) => ({ ...prev, squadIds: event.target.value }))} placeholder="squad-id, squad-id" className="h-11 bg-muted/40" /><Button type="submit" className="w-full rounded-2xl">{lang === "bn" ? "স্কোপ অ্যাসাইন" : "Assign scope"}</Button></form></CardContent></Card><Card className="border-none bg-background/60 shadow-premium"><CardHeader><CardTitle>{lang === "bn" ? "রোল ও কভারেজ" : "Role and coverage"}</CardTitle><CardDescription>{lang === "bn" ? "রোল আপডেট ও সক্রিয় স্কোপগুলো দেখুন।" : "Update roles and inspect active scope coverage."}</CardDescription></CardHeader><CardContent className="space-y-4"><form onSubmit={submitRole} className="grid gap-4 md:grid-cols-[1.2fr,0.8fr,auto]"><Select value={roleForm.uid || "none"} onValueChange={(value) => setRoleForm((prev) => ({ ...prev, uid: value === "none" ? "" : value }))}><SelectTrigger className="h-11 bg-muted/40"><SelectValue placeholder={lang === "bn" ? "রোল আপডেট" : "Update role"} /></SelectTrigger><SelectContent><SelectItem value="none">{lang === "bn" ? "সদস্য" : "Member"}</SelectItem>{users.map((item) => <SelectItem key={item.uid || item.id} value={item.uid || item.id}>{item.displayName || item.email || item.uid}</SelectItem>)}</SelectContent></Select><Select value={roleForm.role} onValueChange={(value) => setRoleForm((prev) => ({ ...prev, role: value }))}><SelectTrigger className="h-11 bg-muted/40"><SelectValue /></SelectTrigger><SelectContent>{canAssignSuperAdmin ? <SelectItem value="super-admin">{getRoleLabel("super-admin", lang)}</SelectItem> : null}<SelectItem value="member">{getRoleLabel("member", lang)}</SelectItem><SelectItem value="squad-lead">{getRoleLabel("squad-lead", lang)}</SelectItem><SelectItem value="department-manager">{getRoleLabel("department-manager", lang)}</SelectItem><SelectItem value="core-management">{getRoleLabel("core-management", lang)}</SelectItem><SelectItem value="admin">{getRoleLabel("admin", lang)}</SelectItem></SelectContent></Select><Button type="submit" className="rounded-2xl">{lang === "bn" ? "আপডেট" : "Update"}</Button></form><div className="space-y-3">{managementScopes.length ? managementScopes.map((item) => <div key={item.scopeId} className="rounded-2xl border border-muted-foreground/10 bg-background/80 p-4"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><div className="font-semibold">{item.managerName || item.managerUid}</div><div className="mt-1 text-xs text-muted-foreground">{getRoleLabel(item.role, lang)} · {getScopeCoverageLabel(item, lang)}</div></div><div className="flex items-center gap-3"><Badge variant={item.status === "active" ? "success" : "warning"} className="border-none text-[10px] font-black uppercase tracking-[0.18em]">{item.status}</Badge><Button variant="outline" size="sm" className="rounded-xl font-bold" onClick={() => revokeManagementScope(item)}>{lang === "bn" ? "রিভোক" : "Revoke"}</Button></div></div></div>) : <div className="rounded-2xl border border-dashed border-muted-foreground/20 px-6 py-12 text-center text-sm font-semibold text-muted-foreground">{lang === "bn" ? "কোনো স্কোপ নেই।" : "No scopes yet."}</div>}</div></CardContent></Card></div></TabsContent> : null}
      </Tabs>
    </div>
  );
}
