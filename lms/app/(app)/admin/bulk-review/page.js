"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ExternalLink, Filter, Save, XCircle } from "lucide-react";
import { toast } from "sonner";
import { WorkspaceBreadcrumbs } from "@/components/layout/workspace-breadcrumbs";
import { WorkspacePageHeader } from "@/components/layout/workspace-page-header";
import { WorkspaceNextAction } from "@/components/layout/workspace-next-action";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DEPARTMENT_OPTIONS,
  canBrowseAllDepartments,
  getDepartmentTitle,
  resolveScopedDepartmentId,
  sanitizeAssignedResourceText,
} from "@/lib/catalog";
import { formatDateTime } from "@/lib/date";
import { statusLabel, statusVariant } from "@/lib/display";
import { fetchDepartmentSubmissions, fetchRecentSubmissions, finalizeSubmissionReview } from "@/lib/firestore/lms";

const isCustomSubmission = (submission) =>
  submission?.taskSource === "custom" || String(submission?.taskId || "").startsWith("custom_");

export default function BulkReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authState = useAuth();
  const { copy } = useLocale();
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(searchParams.get("departmentId") || "");
  const [scopeMode, setScopeMode] = useState(searchParams.get("departmentId") ? "department" : "all");
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState(null);
  
  // State for rapid review inputs
  const [rapidComments, setRapidComments] = useState({});
  const [rapidPoints, setRapidPoints] = useState({});

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
    if (!authState.canAwardPoints) {
      setLoading(false);
      if (!authState.loading && !authState.canAwardPoints) {
        router.replace("/dashboard");
      }
      return;
    }
    setLoading(true);
    const nextSubmissions = canBrowseAnyDepartment && scopeMode === "all"
      ? await fetchRecentSubmissions(100)
      : await fetchDepartmentSubmissions(activeDepartmentId);
      
    // Only show pending submissions for rapid bulk review
    const pendingOnly = nextSubmissions.filter((item) => item.status === "pending" || item.status === "revision_requested");
    setSubmissions(pendingOnly);
    
    // Initialize state
    const initialComments = {};
    const initialPoints = {};
    pendingOnly.forEach(sub => {
      initialComments[sub.id] = sub.reviewComment || "Approved for sweat equity points.";
      initialPoints[sub.id] = String(sub.recommendedPoints || sub.awardedPoints || 10);
    });
    setRapidComments(initialComments);
    setRapidPoints(initialPoints);
    
    setLoading(false);
  }, [activeDepartmentId, authState.canAwardPoints, authState.loading, canBrowseAnyDepartment, router, scopeMode]);

  useEffect(() => {
    loadQueue().catch(() => {
      setSubmissions([]);
      setLoading(false);
    });
  }, [loadQueue]);

  const handleRapidAction = async (submissionId, actionType) => {
    const submission = submissions.find(s => s.id === submissionId);
    if (!submission) return;

    setWorkingId(submissionId);
    
    try {
      const awardedPoints = Number(rapidPoints[submissionId] || 0);
      const reviewComment = rapidComments[submissionId] || "";

      await finalizeSubmissionReview({
        actor: { uid: authState.user?.uid, role: authState.role, canAwardPoints: authState.canAwardPoints },
        submissionId: submission.id,
        status: actionType, // "approved" or "rejected"
        reviewComment,
        awardedPoints: actionType === "approved" ? awardedPoints : 0,
      });

      toast.success(
        actionType === "approved" 
          ? copy("Submission instantly approved.", "সাবমিশন সাথে সাথে অনুমোদিত হয়েছে।")
          : copy("Submission instantly rejected.", "সাবমিশন সাথে সাথে বাতিল হয়েছে।")
      );
      
      // Remove from list
      setSubmissions(current => current.filter(s => s.id !== submissionId));
    } catch (error) {
      toast.error(error.message || copy("Action failed.", "অ্যাকশন ব্যর্থ হয়েছে।"));
    } finally {
      setWorkingId(null);
    }
  };

  const reviewTrail = [
    { href: "/dashboard", en: "Dashboard", bn: "ড্যাশবোর্ড" },
    { href: "/review", en: "Review Queue", bn: "রিভিউ কিউ" },
    { href: null, en: "Rapid Bulk Review", bn: "র‍্যাপিড রিভিউ" },
  ];

  if (!authState.canAwardPoints) {
    return (
      <div className="space-y-4">
        <WorkspaceBreadcrumbs items={reviewTrail} />
        <Card className="bg-card/80 backdrop-blur-xl border shadow-xl rounded-[2rem]">
          <CardHeader>
            <CardTitle>{copy("Finalizer access required", "অ্যাক্সেস প্রয়োজন")}</CardTitle>
            <CardDescription>
              {copy("Rapid bulk review is restricted to Directors and Super Admins who can award points directly.", "র‍্যাপিড রিভিউ শুধু ডিরেক্টর এবং সুপার অ্যাডমিনদের জন্য।")}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="workspace-stack">
      <WorkspaceBreadcrumbs items={reviewTrail} />
      
      <WorkspacePageHeader
        badge={copy("Rapid Mode", "র‍্যাপিড মোড")}
        title={copy("Streamlined Review Dashboard", "স্ট্রিমলাইনড রিভিউ ড্যাশবোর্ড")}
        description={copy(
          "Quickly review and approve pending tasks without confirmation dialogs. Use with caution.",
          "কোনো confirmation dialog ছাড়াই দ্রুত রিভিউ করুন। সাবধানে ব্যবহার করুন।"
        )}
        stats={[
          { label: copy("Pending tasks", "পেন্ডিং টাস্ক"), value: submissions.length, note: copy("Waiting for rapid decision.", "সিদ্ধান্তের অপেক্ষায়।") },
        ]}
        actions={(
          <div className="workspace-pane p-4">
            <div className="workspace-filter-grid">
              {canBrowseAnyDepartment ? (
                <div className="space-y-2">
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
            </div>
          </div>
        )}
      />

      {loading ? (
        <div className="space-y-4" data-reveal="up">
          <Skeleton className="h-24 w-full rounded-[1.5rem]" />
          <Skeleton className="h-24 w-full rounded-[1.5rem]" />
          <Skeleton className="h-24 w-full rounded-[1.5rem]" />
        </div>
      ) : submissions.length ? (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <motion.div
              key={submission.id}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(event, info) => {
                if (workingId) return;
                if (info.offset.x > 80) handleRapidAction(submission.id, "approved");
                else if (info.offset.x < -80) handleRapidAction(submission.id, "rejected");
              }}
              className="touch-pan-y"
            >
              <Card className="relative overflow-hidden rounded-[1.5rem] border bg-gradient-to-br from-background to-muted/20 shadow-sm transition-all hover:shadow-md cursor-grab active:cursor-grabbing">
                <div className="grid gap-0 md:grid-cols-[minmax(0,1.2fr)_0.8fr]">
                <CardHeader className="p-4 md:p-5 md:border-r border-border/40">
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base leading-tight">
                          {isCustomSubmission(submission)
                            ? (submission.resourceTitle || submission.taskTitle || submission.taskId)
                            : sanitizeAssignedResourceText(submission.resourceTitle || submission.taskTitle || submission.taskId)}
                        </CardTitle>
                        <Badge variant={statusVariant(submission.status)} className="scale-90 origin-top-right">
                          {statusLabel(submission.status)}
                        </Badge>
                      </div>
                      <CardDescription className="mt-1 text-xs">
                        <span className="font-semibold text-primary">{submission.userDisplayName || submission.userId}</span> • {getDepartmentTitle(submission.departmentId)} • {formatDateTime(submission.submittedAt)}
                      </CardDescription>
                      
                      <div className="mt-3 rounded-xl border bg-muted/20 p-3">
                        <p className="text-xs leading-5 text-muted-foreground line-clamp-2" title={submission.submittedText}>
                          {submission.submittedText || "No written explanation provided."}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {submission.taskReferenceUrl && (
                            <a className="inline-flex items-center gap-1.5 rounded-md bg-background px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary border shadow-sm" href={submission.taskReferenceUrl} target="_blank" rel="noreferrer">
                              <ExternalLink className="h-3 w-3" />
                              Task Brief
                            </a>
                          )}
                          {(submission.submissionLinks || []).map((item, index) => (
                            <a key={index} className="inline-flex items-center gap-1.5 rounded-md bg-background px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary border shadow-sm" href={item.url} target="_blank" rel="noreferrer">
                              <ExternalLink className="h-3 w-3" />
                              {item.type}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <div className="p-4 md:p-5 flex flex-col justify-between bg-muted/5">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-1 space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Points</label>
                      <Input 
                        type="number" 
                        className="h-8 text-sm font-semibold" 
                        value={rapidPoints[submission.id] || ""} 
                        onChange={(e) => setRapidPoints(p => ({...p, [submission.id]: e.target.value}))}
                      />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Comment</label>
                      <Input 
                        className="h-8 text-sm" 
                        value={rapidComments[submission.id] || ""} 
                        onChange={(e) => setRapidComments(p => ({...p, [submission.id]: e.target.value}))}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Button 
                      size="sm" 
                      variant="default" 
                      className="h-9 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                      disabled={workingId === submission.id}
                      onClick={() => handleRapidAction(submission.id, "approved")}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      className="h-9 gap-1.5"
                      disabled={workingId === submission.id}
                      onClick={() => handleRapidAction(submission.id, "rejected")}
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="rounded-[1.75rem] border border-border/50 bg-background/85" data-reveal="up">
          <CardContent className="space-y-4 p-6">
            <p className="text-sm text-muted-foreground">{copy("No pending submissions require rapid review.", "কোনো পেন্ডিং সাবমিশন র‍্যাপিড রিভিউয়ের জন্য নেই।")}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
