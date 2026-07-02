"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FileCheck2 } from "lucide-react";
import { WorkspaceBreadcrumbs } from "@/components/layout/workspace-breadcrumbs";
import { WorkspacePageHeader } from "@/components/layout/workspace-page-header";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyStateCard } from "@/components/ui/empty-state-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/lib/date";
import { statusLabel, statusVariant } from "@/lib/display";
import { fetchUserSubmissions } from "@/lib/firestore/lms";
import { sanitizeAssignedResourceText } from "@/lib/catalog";

const isCustomSubmission = (submission) =>
  submission?.taskSource === "custom" || String(submission?.taskId || "").startsWith("custom_");

export default function SubmissionsPage() {
  const { user } = useAuth();
  const { copy } = useLocale();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(Boolean(user?.uid));

  const submissionsTrail = [
    { href: "/dashboard", en: "Dashboard", bn: "ড্যাশবোর্ড" },
    { href: null, en: "Submissions", bn: "সাবমিশন" },
  ];

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchUserSubmissions(user.uid)
      .then(setSubmissions)
      .catch(() => setSubmissions([]))
      .finally(() => setLoading(false));
  }, [user?.uid]);

  const pendingCount = useMemo(() => submissions.filter((item) => item.status === "pending").length, [submissions]);
  const approvedCount = useMemo(() => submissions.filter((item) => item.status === "approved").length, [submissions]);
  const revisionCount = useMemo(() => submissions.filter((item) => item.status === "revision_requested").length, [submissions]);

  return (
    <div className="workspace-stack">
      <WorkspaceBreadcrumbs items={submissionsTrail} />
      <WorkspacePageHeader
        badge={copy("Submissions", "সাবমিশন")}
        title={copy("See every proof trail in one place", "সব proof trail এক জায়গায় দেখুন")}
        description={copy(
          "Track every proof submission, see the current review state, and follow approved points with full visibility.",
          "প্রতিটি proof submission ট্র্যাক করুন, বর্তমান review state দেখুন, এবং approved point পুরো visibility-সহ অনুসরণ করুন।",
        )}
        stats={[
          { label: copy("Total", "মোট"), value: submissions.length, note: copy("All submission records.", "সব submission record।") },
          { label: copy("Pending", "পেন্ডিং"), value: pendingCount, note: copy("Waiting for a decision.", "সিদ্ধান্তের অপেক্ষায়।") },
          { label: copy("Approved", "অনুমোদিত"), value: approvedCount, note: copy("Finalized successfully.", "সফলভাবে finalise হয়েছে।") },
          { label: copy("Revision", "রিভিশন"), value: revisionCount, note: copy("Needs another submission pass.", "আরেকবার submission দিতে হবে।") },
        ]}
        actions={(
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" asChild>
              <Link href="/task">{copy("Open task browser", "টাস্ক ব্রাউজার খুলুন")}</Link>
            </Button>
            <Button asChild>
              <Link href="/manual">{copy("Open manual", "ম্যানুয়াল খুলুন")}</Link>
            </Button>
          </div>
        )}
      />

      <Card className="rounded-[1.75rem] border border-border/50 bg-background/85 hover:bg-muted/50 transition-colors" data-reveal="up">
        <CardHeader>
          <CardTitle>{copy("Submission history", "সাবমিশন হিস্ট্রি")}</CardTitle>
          <CardDescription>{copy("Open the related task page anytime to update proof or review instructions.", "যেকোনো সময় related task page খুলে proof update বা instruction review করতে পারবেন।")}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3" aria-busy="true" aria-label={copy("Loading submissions", "সাবমিশন লোড হচ্ছে")}>
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ) : submissions.length ? (
            <div className="overflow-x-auto">
              <Table className="min-w-[800px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>{copy("Task", "টাস্ক")}</TableHead>
                    <TableHead>{copy("Status", "স্ট্যাটাস")}</TableHead>
                    <TableHead>{copy("Updated", "আপডেট")}</TableHead>
                    <TableHead>{copy("Points", "পয়েন্ট")}</TableHead>
                    <TableHead>{copy("Action", "অ্যাকশন")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium whitespace-normal">
                            {isCustomSubmission(submission)
                              ? (submission.resourceTitle || submission.taskTitle || submission.taskId)
                              : sanitizeAssignedResourceText(submission.resourceTitle || submission.taskTitle || submission.taskId)}
                          </p>
                          <p className="text-xs text-muted-foreground whitespace-normal line-clamp-2">
                            {isCustomSubmission(submission)
                              ? copy("Direct task submission", "Direct task submission")
                              : copy("Assigned LMS task", "Assigned LMS task")}
                            {" · "}
                            {submission.reviewComment || copy("No review comment yet.", "এখনো কোনো review comment নেই।")}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(submission.status)} className="whitespace-nowrap">{statusLabel(submission.status)}</Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{formatDateTime(submission.updatedAt || submission.submittedAt)}</TableCell>
                      <TableCell className="whitespace-nowrap">{submission.awardedPoints || 0}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" asChild className="whitespace-nowrap">
                          <Link href={isCustomSubmission(submission) ? `/task?mode=custom&submissionId=${submission.id}` : `/task?mode=assigned&submissionId=${submission.id}&taskId=${submission.taskId}`}>
                            {copy("Open", "খুলুন")}
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyStateCard
              icon={FileCheck2}
              title={copy("No submission records yet", "এখনো কোনো submission record নেই")}
              description={copy(
                "Your proof history will appear here after you submit an assigned or direct task.",
                "Assigned বা direct task submit করার পর আপনার proof history এখানে দেখা যাবে।",
              )}
              action={
                <Button asChild>
                  <Link href="/task">{copy("Start with a task", "একটি টাস্ক দিয়ে শুরু করুন")}</Link>
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
