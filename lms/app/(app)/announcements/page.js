"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { WorkspacePageHeader } from "@/components/layout/workspace-page-header";
import { useLocale } from "@/components/providers/locale-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEPARTMENT_OPTIONS, canBrowseAllDepartments, getDepartmentTitle, resolveScopedDepartmentId } from "@/lib/catalog";
import { formatDateTime } from "@/lib/date";
import { fetchAllAnnouncements, fetchDepartmentAnnouncements } from "@/lib/firestore/lms";

export default function AnnouncementsPage() {
  const searchParams = useSearchParams();
  const { profile, role } = useAuth();
  const { copy } = useLocale();
  const canBrowseAnyDepartment = canBrowseAllDepartments(role);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(searchParams.get("departmentId") || "all");
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const scopedDepartmentId = resolveScopedDepartmentId({
    role,
    profileDepartmentId: profile?.departmentId,
    preferredDepartmentId: selectedDepartmentId === "all" ? "" : selectedDepartmentId,
  });

  useEffect(() => {
    if (canBrowseAnyDepartment && !selectedDepartmentId) {
      setSelectedDepartmentId("all");
    }
  }, [canBrowseAnyDepartment, selectedDepartmentId]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      let nextAnnouncements = [];
      if (canBrowseAnyDepartment) {
        nextAnnouncements = selectedDepartmentId === "all"
          ? await fetchAllAnnouncements(20)
          : await fetchDepartmentAnnouncements(selectedDepartmentId || scopedDepartmentId);
      } else if (scopedDepartmentId) {
        nextAnnouncements = await fetchDepartmentAnnouncements(scopedDepartmentId);
      }
      if (!mounted) return;
      setAnnouncements(nextAnnouncements);
      setLoading(false);
    };

    load().catch(() => {
      if (!mounted) return;
      setAnnouncements([]);
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [canBrowseAnyDepartment, scopedDepartmentId, selectedDepartmentId]);

  const headingText = canBrowseAnyDepartment
    ? selectedDepartmentId === "all"
      ? copy("Showing announcements across the full LMS.", "পুরো LMS-এর সব announcement দেখানো হচ্ছে।")
      : copy(`Showing global and ${getDepartmentTitle(selectedDepartmentId)} announcements.`, `Global এবং ${getDepartmentTitle(selectedDepartmentId)} announcement দেখানো হচ্ছে।`)
    : copy(`Showing global and ${getDepartmentTitle(scopedDepartmentId)} announcements.`, `Global এবং ${getDepartmentTitle(scopedDepartmentId)} announcement দেখানো হচ্ছে।`);

  return (
    <div className="workspace-stack">
      <WorkspacePageHeader
        badge={copy("Announcements", "ঘোষণা")}
        title={copy("Keep every department aligned", "সব ডিপার্টমেন্টকে সমন্বিত রাখুন")}
        description={headingText}
        stats={[
          {
            label: copy("Visible updates", "দৃশ্যমান আপডেট"),
            value: loading ? "..." : announcements.length,
            note: copy("Current announcement feed in scope.", "বর্তমান scope-এর announcement feed।"),
          },
          {
            label: copy("Scope", "স্কোপ"),
            value: canBrowseAnyDepartment && selectedDepartmentId === "all"
              ? copy("Global", "গ্লোবাল")
              : getDepartmentTitle(canBrowseAnyDepartment ? selectedDepartmentId : scopedDepartmentId),
            note: copy("Global and department-aware filtering.", "Global এবং department-aware filtering।"),
          },
        ]}
        actions={canBrowseAnyDepartment ? (
          <div className="workspace-pane p-4">
            <div className="space-y-2">
              <Label htmlFor="announcement-scope">{copy("Department filter", "ডিপার্টমেন্ট ফিল্টার")}</Label>
              <Select value={selectedDepartmentId} onValueChange={setSelectedDepartmentId}>
                <SelectTrigger id="announcement-scope"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{copy("All departments", "সব ডিপার্টমেন্ট")}</SelectItem>
                  {DEPARTMENT_OPTIONS.map((item) => <SelectItem key={item.id} value={item.id}>{item.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : null}
      />

      <Card className="rounded-[2rem]" data-reveal="up">
        <CardHeader className="space-y-2">
          <CardTitle>{copy("Announcement board", "ঘোষণা বোর্ড")}</CardTitle>
          <CardDescription>{copy("Read system-wide notices, department updates, and time-sensitive callouts from one queue.", "একটি queue থেকেই system-wide notice, department update, এবং time-sensitive callout পড়ুন।")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <p className="workspace-empty-state text-sm">{copy("Loading announcements...", "ঘোষণা লোড হচ্ছে...")}</p>
          ) : announcements.length ? (
            announcements.map((item) => (
              <div key={item.id} className="workspace-pane hover-lift p-5" data-reveal="up">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold">{item.title}</h3>
                  <Badge variant="subtle">{item.scope}</Badge>
                </div>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.body}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">{(item.priority || "normal")} / {formatDateTime(item.createdAt)}</p>
              </div>
            ))
          ) : (
            <p className="workspace-empty-state text-sm">{copy("No announcements published yet.", "এখনো কোনো announcement publish হয়নি।")}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
