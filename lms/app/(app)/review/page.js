"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ExternalLink, Filter, ShieldCheck, ThumbsDown, ThumbsUp } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { toast } from "sonner";
import { WorkspaceBreadcrumbs } from "@/components/layout/workspace-breadcrumbs";
import { WorkspacePageHeader } from "@/components/layout/workspace-page-header";
import { WorkspaceNextAction } from "@/components/layout/workspace-next-action";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyStateCard } from "@/components/ui/empty-state-card";
import { Textarea } from "@/components/ui/textarea";
import {
  DEPARTMENT_OPTIONS,
  canBrowseAllDepartments,
  getDepartmentTitle,
  resolveScopedDepartmentId,
  sanitizeAssignedResourceText,
} from "@/lib/catalog";
import { formatDateTime } from "@/lib/date";
import { statusLabel, statusVariant } from "@/lib/display";
import { fetchDepartmentSubmissions, fetchRecentSubmissions, finalizeSubmissionReview, submitMentorRecommendation } from "@/lib/firestore/lms";

const reviewStatuses = ["pending", "revision_requested", "approved", "rejected", "all"];
const isCustomSubmission = (submission) =>
  submission?.taskSource === "custom" || String(submission?.taskId || "").startsWith("custom_");

function ReviewItem({ submission, actor, onRefresh }) {
  const { copy } = useLocale();
  const [comment, setComment] = useState(submission.reviewComment || "");
  const [recommendation, setRecommendation] = useState(
    submission.recommendation || (submission.status === "rejected" ? "rejected" : submission.status || "approve"),
  );
  const [points, setPoints] = useState(String(submission.recommendedPoints || submission.awardedPoints || 0));
  const [message, setMessage] = useState("");
  const [finalizeKind, setFinalizeKind] = useState(null);
  const [finalizeWorking, setFinalizeWorking] = useState(false);

  const submissionLinks = submission.submissionLinks || [];
  const isFinalized = submission.status === "approved" || submission.status === "rejected";
  const recommendationLocked = isFinalized;
  const normalizedPoints = Number(points || 0);
  const approveDisabled = recommendationLocked || !Number.isFinite(normalizedPoints) || normalizedPoints <= 0;
  const visibleTitle = isCustomSubmission(submission)
    ? (submission.resourceTitle || submission.taskTitle || submission.taskId)
    : sanitizeAssignedResourceText(submission.resourceTitle || submission.taskTitle || submission.taskId);
  const refreshQueue = async () => {
    try {
      await onRefresh();
    } catch {
      // Keep the success state even if the background refresh fails once.
    }
  };

  const finalizeDialog = useMemo(() => {
    if (finalizeKind === "approve") {
      return {
        title: copy("Approve this submission?", "এই সাবমিশন অনুমোদন করবেন?"),
        description: copy(
          `This will award ${normalizedPoints} points and lock the decision in the ledger.`,
          `এতে ${normalizedPoints} পয়েন্ট দেওয়া হবে এবং সিদ্ধান্ত ledger-এ লক হবে।`,
        ),
        confirmLabel: copy("Approve", "অনুমোদন করুন"),
        destructive: false,
      };
    }
    if (finalizeKind === "revision") {
      return {
        title: copy("Request a revision?", "রিভিশন চাইবেন?"),
        description: copy(
          "The learner can resubmit after you send this decision. Add a clear comment so they know what to fix.",
          "সিদ্ধান্ত পাঠানোর পর শিক্ষার্থী আবার submit করতে পারবেন। কী ঠিক করতে হবে তা comment-এ স্পষ্ট লিখুন।",
        ),
        confirmLabel: copy("Send revision request", "রিভিশন রিকোয়েস্ট পাঠান"),
        destructive: false,
      };
    }
    if (finalizeKind === "reject") {
      return {
        title: copy("Reject this submission?", "এই সাবমিশন বাতিল করবেন?"),
        description: copy(
          "Rejection is permanent for this cycle. The learner should see a respectful reason in your comment.",
          "এই চক্রে rejection স্থায়ী। শিক্ষার্থী আপনার comment-এ সম্মানজনক কারণ দেখতে পাবেন।",
        ),
        confirmLabel: copy("Reject submission", "সাবমিশন বাতিল করুন"),
        destructive: true,
      };
    }
    return null;
  }, [copy, finalizeKind, normalizedPoints]);

  const runFinalAction = async () => {
    if (!finalizeKind) return;
    setFinalizeWorking(true);
    setMessage("");
    try {
      if (finalizeKind === "approve") {
        await finalizeSubmissionReview({
          actor,
          submissionId: submission.id,
          status: "approved",
          reviewComment: comment,
          awardedPoints: normalizedPoints,
        });
        toast.success(copy("Submission approved.", "সাবমিশন অনুমোদিত হয়েছে।"));
      } else if (finalizeKind === "revision") {
        await finalizeSubmissionReview({
          actor,
          submissionId: submission.id,
          status: "revision_requested",
          reviewComment: comment,
          awardedPoints: 0,
        });
        toast.success(copy("Revision requested.", "রিভিশন রিকোয়েস্ট পাঠানো হয়েছে।"));
      } else if (finalizeKind === "reject") {
        await finalizeSubmissionReview({
          actor,
          submissionId: submission.id,
          status: "rejected",
          reviewComment: comment,
          awardedPoints: 0,
        });
        toast.success(copy("Submission rejected.", "সাবমিশন বাতিল হয়েছে।"));
      }
      setFinalizeKind(null);
      await refreshQueue();
    } catch (error) {
      toast.error(error.message || copy("Review action failed.", "রিভিউ অ্যাকশন ব্যর্থ হয়েছে।"));
    } finally {
      setFinalizeWorking(false);
    }
  };

  const controls = useAnimation();

  const handleDragEnd = async (event, info) => {
    const swipeThreshold = 80;
    if (info.offset.x > swipeThreshold) {
      if (!approveDisabled && actor.canAwardPoints) {
        setFinalizeKind("approve");
      } else {
        toast.error(copy("Cannot approve: check points", "পয়েন্ট চেক করুন"));
      }
    } else if (info.offset.x < -swipeThreshold) {
      setFinalizeKind("revision");
    }
    controls.start({ x: 0, transition: { type: "spring", bounce: 0.5 } });
  };

  return (
    <motion.div
      drag={!recommendationLocked ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      animate={controls}
      className="relative touch-pan-y"
    >
      <Card className="relative overflow-hidden rounded-[2rem] border bg-gradient-to-br from-background to-muted/20 shadow-sm transition-all hover:shadow-md cursor-grab active:cursor-grabbing">
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <CardTitle className="text-xl break-words">{visibleTitle}</CardTitle>
            <CardDescription className="mt-2 text-sm leading-6">
              {(submission.userDisplayName || submission.userId)} / {getDepartmentTitle(submission.departmentId)} / {formatDateTime(submission.submittedAt)}
            </CardDescription>
            <div className="mt-3">
              <Badge variant="outline">
                {isCustomSubmission(submission) ? copy("Direct task", "Direct task") : copy("Assigned task", "Assigned task")}
              </Badge>
            </div>
          </div>
          <Badge variant={statusVariant(submission.status)} className="w-fit">{statusLabel(submission.status)}</Badge>
        </div>
        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4 rounded-3xl border bg-background/70 p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{copy("Submission notes", "সাবমিশন নোটস")}</p>
            <p className="text-sm leading-7 text-muted-foreground">{submission.submittedText || copy("No written explanation provided.", "কোনো লিখিত ব্যাখ্যা দেওয়া হয়নি।")}</p>
            {submission.taskReferenceUrl ? (
              <a className="flex items-center gap-2 break-all text-sm font-medium text-primary" href={submission.taskReferenceUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" />
                {copy("Open task brief / reference", "Task brief / reference খুলুন")}
              </a>
            ) : null}
            {submissionLinks.length ? (
              <div className="space-y-2">
                {submissionLinks.map((item, index) => (
                  <a key={`${item.url}-${index}`} className="flex items-center gap-2 break-all text-sm font-medium text-primary" href={item.url} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    {item.type}: {item.url}
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <div className="space-y-5 rounded-3xl border bg-background/70 p-4 sm:p-5">
            <div className="space-y-2">
              <Label htmlFor={`recommend-${submission.id}`}>{copy("Recommendation", "রেকমেন্ডেশন")}</Label>
              <Select disabled={recommendationLocked} value={recommendation} onValueChange={setRecommendation}>
                <SelectTrigger id={`recommend-${submission.id}`}><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="approve">approve</SelectItem>
                  <SelectItem value="revision_requested">revision_requested</SelectItem>
                  <SelectItem value="rejected">rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`points-${submission.id}`}>{copy("Points", "পয়েন্ট")}</Label>
              <Input
                id={`points-${submission.id}`}
                type="number"
                min="0"
                value={points}
                onChange={(event) => setPoints(event.target.value)}
                disabled={recommendationLocked}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`comment-${submission.id}`}>{copy("Review comment", "রিভিউ কমেন্ট")}</Label>
              <Textarea
                id={`comment-${submission.id}`}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                className="min-h-28"
                disabled={recommendationLocked}
              />
            </div>
            {recommendationLocked ? (
              <p className="text-sm text-muted-foreground">
                {copy(
                  "This submission is already finalized. It is now read-only for every reviewer.",
                  "এই submission finalise হয়ে গেছে। Mentor সিদ্ধান্ত দেখতে পারবেন, কিন্তু পরের পরিবর্তন শুধু approver-রাই করতে পারবেন।",
                )}
              </p>
            ) : null}
            {!recommendationLocked && actor.canAwardPoints && approveDisabled ? (
              <p className="text-sm text-muted-foreground">
                {copy(
                  "Add approved points before final approval so the submission record and points ledger stay in sync.",
                  "চূড়ান্ত অনুমোদনের আগে approved points দিন, যাতে submission record এবং points ledger sync থাকে।",
                )}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-2 pt-1">
              <Button
                disabled={recommendationLocked}
                variant="outline"
                onClick={async () => {
                  setMessage("");
                  try {
                    await submitMentorRecommendation({ actor, submissionId: submission.id, recommendation, comment, recommendedPoints: points });
                    toast.success(copy("Recommendation saved.", "রেকমেন্ডেশন সংরক্ষিত হয়েছে।"));
                    await refreshQueue();
                  } catch (error) {
                    const text = error.message || copy("Could not save recommendation.", "রেকমেন্ডেশন সংরক্ষণ করা যায়নি।");
                    setMessage(text);
                    toast.error(text);
                  }
                }}
              >
                {copy("Save recommendation", "রেকমেন্ডেশন সংরক্ষণ করুন")}
              </Button>
              {actor.canAwardPoints ? (
                <>
                  <Button disabled={approveDisabled} type="button" onClick={() => setFinalizeKind("approve")}>
                    {copy("Approve", "অনুমোদন করুন")}
                  </Button>
                  <Button disabled={recommendationLocked} variant="secondary" type="button" onClick={() => setFinalizeKind("revision")}>
                    {copy("Request revision", "রিভিশন চান")}
                  </Button>
                  <Button disabled={recommendationLocked} variant="destructive" type="button" onClick={() => setFinalizeKind("reject")}>
                    {copy("Reject", "বাতিল করুন")}
                  </Button>
                </>
              ) : null}
            </div>
            {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
          </div>
        </div>
      </CardHeader>
    </Card>

    <AlertDialog open={Boolean(finalizeKind)} onOpenChange={(open) => !open && setFinalizeKind(null)}>
      <AlertDialogContent>
        {finalizeDialog ? (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>{finalizeDialog.title}</AlertDialogTitle>
              <AlertDialogDescription>{finalizeDialog.description}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setFinalizeKind(null)} disabled={finalizeWorking}>
                {copy("Cancel", "বাতিল")}
              </AlertDialogCancel>
              <Button
                type="button"
                variant={finalizeDialog.destructive ? "destructive" : "default"}
                disabled={finalizeWorking}
                onClick={() => runFinalAction()}
              >
                {finalizeWorking ? copy("Working...", "কাজ চলছে...") : finalizeDialog.confirmLabel}
              </Button>
            </AlertDialogFooter>
          </>
        ) : null}
      </AlertDialogContent>
    </AlertDialog>
    </motion.div>
  );
}

export default function ReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authState = useAuth();
  const { copy } = useLocale();
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(searchParams.get("departmentId") || "");
  const [scopeMode, setScopeMode] = useState(searchParams.get("departmentId") ? "department" : "all");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const canBrowseAnyDepartment = canBrowseAllDepartments(authState.role);

  const activeDepartmentId = resolveScopedDepartmentId({
    role: authState.role,
    profileDepartmentId: authState.profile?.departmentId,
    preferredDepartmentId: selectedDepartmentId,
  });

  useEffect(() => {
    if (!selectedDepartmentId && canBrowseAnyDepartment) {
      setSelectedDepartmentId(searchParams.get("departmentId") || DEPARTMENT_OPTIONS[0]?.id || "");
    }
  }, [canBrowseAnyDepartment, searchParams, selectedDepartmentId]);

  const loadQueue = useCallback(async () => {
    if (!authState.canReview) {
      setLoading(false);
      if (!authState.loading && !authState.canReview) {
        router.replace("/dashboard");
      }
      return;
    }
    setLoading(true);
    const nextSubmissions = canBrowseAnyDepartment && scopeMode === "all"
      ? await fetchRecentSubmissions(50)
      : await fetchDepartmentSubmissions(activeDepartmentId);
    setSubmissions(nextSubmissions);
    setLoading(false);
  }, [activeDepartmentId, authState.canReview, authState.loading, canBrowseAnyDepartment, router, scopeMode]);

  useEffect(() => {
    loadQueue().catch(() => {
      setSubmissions([]);
      setLoading(false);
    });
  }, [loadQueue]);

  const visibleSubmissions = useMemo(() => {
    if (statusFilter === "all") return submissions;
    return submissions.filter((item) => item.status === statusFilter);
  }, [statusFilter, submissions]);

  const pendingCount = submissions.filter((item) => item.status === "pending").length;
  const approvedCount = submissions.filter((item) => item.status === "approved").length;

  const reviewTrail = [
    { href: "/dashboard", en: "Dashboard", bn: "ড্যাশবোর্ড" },
    { href: null, en: "Review", bn: "রিভিউ" },
  ];

  if (!authState.canReview) {
    return (
      <div className="space-y-4">
        <WorkspaceBreadcrumbs items={reviewTrail} />
        <Card className="bg-card/80 backdrop-blur-xl border shadow-xl rounded-[2rem]">
          <CardHeader>
            <CardTitle>{copy("Review access required", "রিভিউ এক্সেস প্রয়োজন")}</CardTitle>
            <CardDescription>
              {copy("Review tools are available to mentors and above.", "রিভিউ টুলস শুধু মেন্টর এবং তার উপরের দায়িত্বপ্রাপ্তদের জন্য খোলা।")}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="workspace-stack">
      <WorkspaceBreadcrumbs items={reviewTrail} />
      <WorkspaceNextAction
        description={copy(
          "Start with pending submissions, check the proof link and learner note, then leave one clear comment before recommending or finalizing a decision.",
          "Pending submission দিয়ে শুরু করুন, proof link আর learner note দেখে নিন, তারপর recommend বা finalize করার আগে একটি clear comment দিন।",
        )}
      >
        <Button
          variant={statusFilter === "pending" ? "default" : "outline"}
          type="button"
          onClick={() => setStatusFilter("pending")}
        >
          {copy("Show pending only", "শুধু pending দেখান")}
        </Button>
        {authState.canAwardPoints && (
          <Button variant="outline" className="border-emerald-500 text-emerald-600 hover:bg-emerald-50" asChild>
            <Link href="/admin/bulk-review">{copy("Rapid bulk review", "র‍্যাপিড রিভিউ")}</Link>
          </Button>
        )}
        <Button variant="outline" asChild>
          <Link href="/manual">{copy("Open role manual", "রোল ম্যানুয়াল খুলুন")}</Link>
        </Button>
      </WorkspaceNextAction>
      <WorkspacePageHeader
        badge={copy("Review Queue", "রিভিউ কিউ")}
        title={copy("Review work clearly and consistently", "রিভিউ কাজ পরিষ্কার ও ধারাবাহিকভাবে করুন")}
        description={copy(
          "Mentors recommend, while department heads, directors, and super admins can finalize points-backed decisions.",
          "Mentor-রা recommend করে, আর department head, director, এবং super admin-রা points-backed decision finalize করে।",
        )}
        stats={[
          { label: copy("Visible items", "দৃশ্যমান আইটেম"), value: visibleSubmissions.length, note: copy("Current filtered review workload.", "বর্তমান ফিল্টার করা review workload।") },
          { label: copy("Pending", "পেন্ডিং"), value: pendingCount, note: copy("Submissions waiting for a decision.", "সিদ্ধান্তের অপেক্ষায় থাকা submission।") },
          { label: copy("Approved", "অনুমোদিত"), value: approvedCount, note: copy("Items already finalized successfully.", "যে আইটেমগুলো সফলভাবে finalise হয়েছে।") },
        ]}
        actions={(
          <div className="workspace-pane p-4">
            <div className="workspace-filter-grid">
              {canBrowseAnyDepartment ? (
                <div className="space-y-2">
                  <Label htmlFor="scope-mode">{copy("Scope", "স্কোপ")}</Label>
                  <Select value={scopeMode} onValueChange={setScopeMode}>
                    <SelectTrigger id="scope-mode"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{copy("All departments", "সব ডিপার্টমেন্ট")}</SelectItem>
                      <SelectItem value="department">{copy("Single department", "একটি ডিপার্টমেন্ট")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : null}
              {(canBrowseAnyDepartment && scopeMode === "department") || !canBrowseAnyDepartment ? (
                <div className="space-y-2">
                  <Label htmlFor="review-department">{copy("Department", "ডিপার্টমেন্ট")}</Label>
                  <Select value={activeDepartmentId} onValueChange={setSelectedDepartmentId}>
                    <SelectTrigger id="review-department"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(canBrowseAnyDepartment ? DEPARTMENT_OPTIONS : DEPARTMENT_OPTIONS.filter((item) => item.id === activeDepartmentId)).map((item) => (
                        <SelectItem key={item.id} value={item.id}>{item.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}
              <div className="space-y-2">
                <Label htmlFor="status-filter">{copy("Status filter", "স্ট্যাটাস ফিল্টার")}</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status-filter"><SelectValue /></SelectTrigger>
                  <SelectContent>{reviewStatuses.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      >
        <Alert>
          <Filter className="h-4 w-4" />
          <AlertTitle>{copy("Review discipline", "রিভিউ ডিসিপ্লিন")}</AlertTitle>
          <AlertDescription>
            {copy(
              "Use comments to explain decisions. Approved points should match visible proof, learner identity, and completion evidence.",
              "মন্তব্যে সিদ্ধান্তের কারণ লিখুন। Approved points অবশ্যই visible proof, learner identity, এবং completion evidence-এর সাথে মিলতে হবে।",
            )}
          </AlertDescription>
        </Alert>
      </WorkspacePageHeader>

      {loading ? (
        <Card className="rounded-[1.75rem] border border-border/50 bg-background/85" data-reveal="up">
          <CardContent
            className="space-y-4 p-6"
            aria-busy="true"
            aria-label={copy("Loading review queue", "রিভিউ কিউ লোড হচ্ছে")}
          >
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-36 w-full rounded-[1.5rem]" />
            <Skeleton className="h-36 w-full rounded-[1.5rem]" />
            <p className="text-xs text-muted-foreground">{copy("Loading review queue...", "রিভিউ কিউ লোড হচ্ছে...")}</p>
          </CardContent>
        </Card>
      ) : visibleSubmissions.length ? (
        <div className="space-y-6">
          {visibleSubmissions.map((submission) => (
            <ReviewItem
              key={submission.id}
              submission={submission}
              actor={{ uid: authState.user?.uid, role: authState.role, canAwardPoints: authState.canAwardPoints }}
              onRefresh={loadQueue}
            />
          ))}
        </div>
      ) : (
        <EmptyStateCard
          icon={ShieldCheck}
          title={copy("Review queue is clear", "Review queue এখন clear")}
          description={copy(
            "No submissions match this scope. When learners submit proof, their work will appear here for traceable review.",
            "এই scope-এ কোনো submission নেই। Learner proof submit করলে traceable review-এর জন্য এখানে দেখাবে।",
          )}
          action={
            <Button variant="outline" asChild>
              <Link href="/manual">{copy("Open role manual", "রোল ম্যানুয়াল খুলুন")}</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
