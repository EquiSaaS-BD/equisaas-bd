"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArchiveRestore, RotateCcw, ShieldAlert, Trash2, UserMinus } from "lucide-react";
import { CertificateManagementPanel } from "@/components/certificates/certificate-management-panel";
import { CertificateTemplateBuilder } from "@/components/certificates/certificate-template-builder";
import { GlcCertificatePanel } from "@/components/certificates/glc-certificate-panel";
import { WorkshopCertificatePanel } from "@/components/certificates/workshop-certificate-panel";
import { WorkspaceBreadcrumbs } from "@/components/layout/workspace-breadcrumbs";
import { FounderGalleryPanel } from "@/components/pages/founder-gallery-panel";
import { PeopleManagementPanel } from "@/components/pages/people-management-panel";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AnimatedBlock } from "@/components/ui/animated-block";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyStateCard } from "@/components/ui/empty-state-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { WorkspaceFilterBar } from "@/components/ui/workspace-filter-bar";
import { DatePicker } from "@/components/ui/date-picker";
import {
  DEPARTMENT_OPTIONS,
  ROLE_OPTIONS,
  canBrowseAllDepartments,
  getDepartmentTitle,
  resolveScopedDepartmentId,
} from "@/lib/catalog";
import { formatDateTime } from "@/lib/date";
import {
  createAnnouncement,
  createCourse,
  createLesson,
  createTask,
  deleteAnnouncementRecord,
  deleteCertificateRecord,
  deleteCourseWithChildren,
  deleteLessonWithChildren,
  deleteTaskRecord,
  fetchAdminAuditLogs,
  fetchDepartmentAnnouncements,
  fetchDepartmentCertificates,
  fetchDepartmentCourses,
  fetchDepartmentLessons,
  fetchDepartmentTasks,
  fetchManageableUsers,
  fetchRestoreBinEntries,
  recordAttendanceAndCredit,
  removeManagedUser,
  restoreFromRestoreBin,
} from "@/lib/firestore/lms";

const emptyMessage = { type: "", text: "" };
const getAssignableRoles = (role) => role === "super_admin" ? ROLE_OPTIONS : role === "director" ? ["department_head", "mentor", "member"] : role === "department_head" ? ["mentor", "member"] : ["member"];
const buildAccessForm = (role, departmentId = "") => ({
  targetUserId: "",
  roles: [getAssignableRoles(role)[0] || "member"],
  status: "active",
  departmentId,
});
const MANAGEMENT_TAB_META = {
  curriculum: {
    en: "Create learning paths, lessons, and proof tasks without leaving this workspace.",
    bn: "এই ওয়ার্কস্পেস থেকেই learning path, lesson, এবং proof task তৈরি করুন।",
  },
  announcements: {
    en: "Publish only the updates that should remain visible and traceable for the team.",
    bn: "শুধু সেসব update প্রকাশ করুন যেগুলো টিমের জন্য visible এবং traceable থাকা দরকার।",
  },
  attendance: {
    en: "Record real events carefully so attendance credits stay trustworthy.",
    bn: "Attendance credit বিশ্বস্ত রাখতে বাস্তব event-গুলো সতর্কভাবে record করুন।",
  },
  people: {
    en: "Keep co-builder access, roles, departments, and points aligned with the real operating scope.",
    bn: "বাস্তব operating scope অনুযায়ী co-builder access, role, department, এবং points aligned রাখুন।",
  },
  certificates: {
    en: "Issue trusted certificate records with one permanent public verification link each.",
    bn: "প্রতিটি trusted certificate record-এর জন্য একটি permanent public verification link রাখুন।",
  },
  "workshop-certificates": {
    en: "Manage workshop-specific certificate batches, segments, and verification records from one flow.",
    bn: "একই flow থেকে ওয়ার্কশপ নির্দিষ্ট certificate batch, segment, এবং verification record পরিচালনা করুন।",
  },
  "glc-certificates": {
    en: "Issue dedicated GLC Spoken English certificates with preset formatting instantly.",
    bn: "প্রিসেট ফরম্যাটিং সহ ডেডিকেটেড GLC স্পোকেন ইংলিশ সার্টিফিকেট অবিলম্বে ইস্যু করুন।",
  },
  gallery: {
    en: "Control the founder spotlight visuals that shape the public face of the platform.",
    bn: "প্ল্যাটফর্মের public face গড়ে তোলা founder spotlight visual-গুলো নিয়ন্ত্রণ করুন।",
  },
  templates: {
    en: "Create reusable visual and signing presets so certificate publishing stays consistent.",
    bn: "Certificate publishing consistent রাখতে reusable visual এবং signing preset তৈরি করুন।",
  },
  restore: {
    en: "Recover archived records when a destructive action needs to be reversed safely.",
    bn: "Destructive action নিরাপদে reverse করতে হলে archived record restore করুন।",
  },
  audit: {
    en: "Inspect governance history before you trust a critical change.",
    bn: "কোনো critical change বিশ্বাস করার আগে governance history দেখুন।",
  },
  admin: {
    en: "Use destructive custodian actions only after a deliberate scope and impact check.",
    bn: "Scope এবং impact যাচাই করার পরেই destructive custodian action ব্যবহার করুন।",
  },
};

function StatCard({ title, value, description }) {
  return (
    <div className="interactive-tile rounded-3xl border bg-background/80 p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{title}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}

function ItemList({ items, emptyText, renderItem }) {
  if (!items.length) {
    return <EmptyStateCard title={emptyText} />;
  }
  return <div className="space-y-3">{items.map(renderItem)}</div>;
}

export function ManagementConsole() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authState = useAuth();
  const { copy } = useLocale();
  const canBrowseAnyDepartment = canBrowseAllDepartments(authState.role);
  const isSuperAdmin = authState.role === "super_admin";
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(searchParams.get("departmentId") || "");
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [users, setUsers] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [restoreEntries, setRestoreEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(emptyMessage);
  const [restoringEntryId, setRestoringEntryId] = useState("");
  const [courseForm, setCourseForm] = useState({ title: "", description: "", estimatedHours: "6" });
  const [lessonForm, setLessonForm] = useState({ courseId: "", title: "", summary: "", externalUrl: "", providerName: "" });
  const [taskForm, setTaskForm] = useState({ courseId: "", title: "Submit proof of completion", resourceTitle: "", resourceUrl: "", instructions: "Submit proof with a certificate link, screenshot, public profile, or GitHub repo.", deadlineAt: "", maxPoints: "50" });
  const [announcementForm, setAnnouncementForm] = useState({ scope: "department", title: "", body: "" });
  const [attendanceForm, setAttendanceForm] = useState({ userId: "", eventType: "workshop", eventTitle: "", points: "5" });
  const [accessForm, setAccessForm] = useState(buildAccessForm(authState.role));
  const [adminForm, setAdminForm] = useState({ userId: "", courseId: "", lessonId: "", taskId: "", announcementId: "", certificateId: "" });

  const activeDepartmentId = resolveScopedDepartmentId({ role: authState.role, profileDepartmentId: authState.profile?.departmentId, preferredDepartmentId: selectedDepartmentId });
  const assignableRoles = useMemo(() => getAssignableRoles(authState.role), [authState.role]);
  const actor = { uid: authState.user?.uid, role: authState.role };
  const rosterUsers = useMemo(() => users.filter((item) => item.departmentId === activeDepartmentId), [users, activeDepartmentId]);
  const departmentOptions = canBrowseAnyDepartment ? DEPARTMENT_OPTIONS : DEPARTMENT_OPTIONS.filter((item) => item.id === activeDepartmentId);
  const tabsClassName = "hidden h-auto w-full flex-wrap gap-1.5 rounded-3xl border border-border/50 bg-background/85 p-2 shadow-sm backdrop-blur-xl sm:flex";
  const tabContentClassName = "space-y-6 focus-visible:outline-none data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-2";
  const defaultTab = isSuperAdmin && ["certificates", "workshop-certificates", "gallery", "admin", "templates", "audit", "restore"].includes(searchParams.get("tab")) ? searchParams.get("tab") : "curriculum";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const breadcrumbs = [{ href: "/dashboard", en: "Dashboard", bn: "ড্যাশবোর্ড" }, { href: null, en: "Core Governance", bn: "কোর গভর্ন্যান্স" }];

  const availableTabs = useMemo(
    () => [
      { value: "curriculum", label: copy("Curriculum", "কারিকুলাম") },
      { value: "announcements", label: copy("Announcements", "ঘোষণা") },
      { value: "attendance", label: copy("Attendance", "উপস্থিতি") },
      { value: "people", label: copy("People", "সদস্য") },
      ...(isSuperAdmin ? [{ value: "certificates", label: copy("Certificates", "সার্টিফিকেট") }] : []),
      ...(isSuperAdmin ? [{ value: "workshop-certificates", label: copy("Workshop certs", "ওয়ার্কশপ সার্টিফিকেট") }] : []),
      ...(isSuperAdmin ? [{ value: "glc-certificates", label: copy("GLC certs", "GLC সার্টিফিকেট") }] : []),
      ...(isSuperAdmin ? [{ value: "gallery", label: copy("Founder gallery", "Founder gallery") }] : []),
      ...(isSuperAdmin ? [{ value: "templates", label: copy("Templates", "টেমপ্লেট") }] : []),
      ...(isSuperAdmin ? [{ value: "restore", label: copy("Restore bin", "রিস্টোর বিন") }] : []),
      ...(isSuperAdmin ? [{ value: "audit", label: copy("Audit log", "অডিট লগ") }] : []),
      ...(isSuperAdmin ? [{ value: "admin", label: copy("Custodian controls", "কাস্টডিয়ান কন্ট্রোল") }] : []),
    ],
    [copy, isSuperAdmin],
  );
  const availableRestoreEntries = useMemo(
    () => restoreEntries.filter((item) => item.status !== "restored"),
    [restoreEntries],
  );
  const activeTabSummary = useMemo(
    () => MANAGEMENT_TAB_META[activeTab] || MANAGEMENT_TAB_META.curriculum,
    [activeTab],
  );
  const activeTabLabel = useMemo(
    () => availableTabs.find((tab) => tab.value === activeTab)?.label || availableTabs[0]?.label || copy("Management", "ম্যানেজমেন্ট"),
    [activeTab, availableTabs, copy],
  );

  const runAction = async (handler, successText) => {
    setMessage(emptyMessage);
    try {
      await handler();
      setMessage({ type: "success", text: successText });
    } catch (error) {
      setMessage({ type: "error", text: error.message || copy("Operation failed.", "অপারেশন সম্পন্ন হয়নি।") });
    }
  };

  const confirmAndRun = async (confirmText, handler, successText) => {
    if (typeof window !== "undefined" && !window.confirm(confirmText)) return;
    await runAction(handler, successText);
  };

  const handleRestoreEntry = async (entryId) => {
    if (!entryId) return;
    setRestoringEntryId(entryId);
    try {
      await runAction(
        async () => {
          await restoreFromRestoreBin({ entryId, actor });
          await loadWorkspace();
        },
        copy("Archived record restored successfully.", "আর্কাইভ করা রেকর্ড সফলভাবে রিস্টোর করা হয়েছে।"),
      );
    } finally {
      setRestoringEntryId("");
    }
  };

  const loadWorkspace = async () => {
    const base = [
      fetchDepartmentCourses(activeDepartmentId),
      fetchDepartmentLessons(activeDepartmentId),
      fetchDepartmentTasks(activeDepartmentId),
      fetchDepartmentAnnouncements(activeDepartmentId),
      fetchManageableUsers({ departmentId: activeDepartmentId, actorRole: authState.role }),
    ];
    const extra = isSuperAdmin
      ? [
          fetchDepartmentCertificates(activeDepartmentId, 40),
          fetchAdminAuditLogs(24),
          fetchRestoreBinEntries(24),
        ]
      : [];
    const [
      nextCourses,
      nextLessons,
      nextTasks,
      nextAnnouncements,
      nextUsers,
      nextCertificates = [],
      nextAuditLogs = [],
      nextRestoreEntries = [],
    ] = await Promise.all([...base, ...extra]);
    setCourses(nextCourses);
    setLessons(nextLessons);
    setTasks(nextTasks);
    setAnnouncements(nextAnnouncements);
    setUsers(nextUsers);
    setCertificates(nextCertificates);
    setAuditLogs(nextAuditLogs);
    setRestoreEntries(nextRestoreEntries);
  };

  useEffect(() => {
    if (!selectedDepartmentId && canBrowseAnyDepartment) {
      setSelectedDepartmentId(searchParams.get("departmentId") || DEPARTMENT_OPTIONS[0]?.id || "");
    }
  }, [canBrowseAnyDepartment, searchParams, selectedDepartmentId]);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    if (!accessForm.departmentId && activeDepartmentId) {
      setAccessForm((current) => ({ ...current, departmentId: activeDepartmentId }));
    }
  }, [accessForm.departmentId, activeDepartmentId]);

  useEffect(() => {
    setAccessForm((current) => {
      const safeRoles = (Array.isArray(current.roles) ? current.roles : []).filter((roleId) => assignableRoles.includes(roleId));
      const nextRoles = safeRoles.length ? safeRoles : [assignableRoles[0] || "member"];
      if (JSON.stringify(nextRoles) === JSON.stringify(current.roles || [])) {
        return current;
      }

      return {
        ...current,
        roles: nextRoles,
      };
    });
  }, [assignableRoles]);

  useEffect(() => {
    if (!lessonForm.courseId && courses[0]?.id) setLessonForm((current) => ({ ...current, courseId: courses[0].id }));
    if (!taskForm.courseId && courses[0]?.id) setTaskForm((current) => ({ ...current, courseId: courses[0].id }));
  }, [courses, lessonForm.courseId, taskForm.courseId]);

  useEffect(() => {
    setAdminForm({ userId: "", courseId: "", lessonId: "", taskId: "", announcementId: "", certificateId: "" });
  }, [activeDepartmentId]);

  useEffect(() => {
    if (!activeDepartmentId || !authState.canManage) {
      setLoading(false);
      if (!authState.loading && !authState.canManage) {
        router.replace("/dashboard");
      }
      return;
    }
    let mounted = true;
    setLoading(true);
    loadWorkspace().then(() => mounted && setLoading(false)).catch(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [activeDepartmentId, authState.canManage, authState.role, authState.loading, isSuperAdmin, router]);

  if (!authState.canManage) {
    return (
      <div className="space-y-4">
        <WorkspaceBreadcrumbs items={breadcrumbs} />
        <EmptyStateCard
          title={copy("Core governance access required", "কোর গভর্ন্যান্স এক্সেস প্রয়োজন")}
          description={copy(
            "Governance tools are available only to department stewards, governance stewards, and ecosystem custodians.",
            "Governance tool শুধু department steward, governance steward, এবং ecosystem custodian-দের জন্য খোলা।",
          )}
        />
      </div>
    );
  }

  if (!activeDepartmentId) {
    return (
      <div className="space-y-4">
        <WorkspaceBreadcrumbs items={breadcrumbs} />
        <EmptyStateCard
          title={copy("Choose a department workspace", "একটি ডিপার্টমেন্ট ওয়ার্কস্পেস বেছে নিন")}
          description={copy(
            "Select a department first so you can steward content, co-builders, announcements, and attendance.",
            "কনটেন্ট, co-builder, announcement, এবং attendance steward করতে আগে একটি department নির্বাচন করুন।",
          )}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WorkspaceBreadcrumbs items={breadcrumbs} />
      <AnimatedBlock direction="up" delay={0.03}>
        <Card className="workspace-hero hover-glow rounded-[2rem] border-0 bg-card/80 shadow-xl backdrop-blur-xl">
          <CardHeader className="space-y-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <Badge variant="subtle" className="rounded-full px-4 py-1.5 text-sm">{copy("Core Governance Panel", "কোর গভর্ন্যান্স প্যানেল")}</Badge>
                <CardTitle className="mt-4 text-3xl">{copy("Everything needed to steward one department", "একটি ডিপার্টমেন্ট steward করতে যা যা দরকার")}</CardTitle>
                <CardDescription className="mt-2 max-w-4xl text-base leading-7">{copy("Create curriculum, publish updates, record verified attendance, and keep co-builder access clean from one place.", "এক জায়গা থেকে curriculum তৈরি করুন, update প্রকাশ করুন, attendance record করুন, এবং co-builder access পরিষ্কার রাখুন।")}</CardDescription>
                <div className="mt-4 workspace-chip-row">
                  <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">{copy("Scoped governance", "Scoped governance")}</Badge>
                  <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">{copy("Traceable approvals", "Traceable approvals")}</Badge>
                  <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">{copy("Department-first control", "Department-first control")}</Badge>
                </div>
              </div>
              <div className="w-full max-w-full space-y-2 sm:max-w-xs">
                <Label htmlFor="department-scope">{copy("Department workspace", "ডিপার্টমেন্ট ওয়ার্কস্পেস")}</Label>
                <Select value={activeDepartmentId} onValueChange={(value) => { setSelectedDepartmentId(value); setAccessForm((current) => ({ ...current, departmentId: value })); }}>
                  <SelectTrigger id="department-scope" className="rounded-2xl border-primary/10 bg-background/85 shadow-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>{departmentOptions.map((item) => <SelectItem key={item.id} value={item.id}>{item.title}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
              <StatCard title={copy("Department", "ডিপার্টমেন্ট")} value={getDepartmentTitle(activeDepartmentId)} description={copy("Current operating scope.", "বর্তমান অপারেটিং স্কোপ।")} />
              <StatCard title={copy("Co-builders", "কো-বিল্ডার")} value={rosterUsers.length} description={copy("Co-builders currently assigned to this department workspace.", "এই ডিপার্টমেন্ট ওয়ার্কস্পেসে বর্তমানে assigned co-builder।")} />
              <StatCard title={copy("Courses", "কোর্স")} value={courses.length} description={copy("Published learning paths in this workspace.", "এই ওয়ার্কস্পেসের published learning path।")} />
              <StatCard title={copy("Certificates", "সার্টিফিকেট")} value={isSuperAdmin ? certificates.length : "Locked"} description={copy("Visible only to the highest access role.", "শুধু highest access role-এর জন্য visible।")} />
            </div>
            {message.text ? <Alert variant={message.type === "error" ? "destructive" : "default"}><AlertTitle>{message.type === "error" ? copy("Action failed", "অ্যাকশন ব্যর্থ") : copy("Saved", "সংরক্ষিত")}</AlertTitle><AlertDescription>{message.text}</AlertDescription></Alert> : null}
            {isSuperAdmin ? <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]"><Alert className="interactive-tile border-primary/10 bg-background/80"><ArchiveRestore className="h-4 w-4" /><AlertTitle>{copy("Governance protections are now active", "গভর্ন্যান্স সুরক্ষা এখন সক্রিয়")}</AlertTitle><AlertDescription>{copy("Every destructive action now writes a super-admin audit log and a restore-bin snapshot before the live record is changed.", "এখন প্রতিটি destructive action live record বদলানোর আগে super admin audit log এবং restore bin snapshot তৈরি করে।")}</AlertDescription></Alert><div className="grid gap-4 sm:grid-cols-2"><StatCard title={copy("Restore bin", "রিস্টোর বিন")} value={availableRestoreEntries.length} description={copy("Archived items that can still be restored.", "যেসব আর্কাইভ করা আইটেম এখনো রিস্টোর করা যাবে।")} /><StatCard title={copy("Audit events", "অডিট ইভেন্ট")} value={auditLogs.length} description={copy("Recent super-admin governance actions.", "সাম্প্রতিক super admin governance action।")} /></div></div> : null}
          </CardHeader>
        </Card>
      </AnimatedBlock>

      {loading ? <AnimatedBlock direction="up" delay={0.08}><Card className="rounded-[1.75rem] border border-border/50 bg-background/85"><CardContent className="space-y-4 p-6" aria-busy="true" aria-label={copy("Loading management workspace", "ম্যানেজমেন্ট ওয়ার্কস্পেস লোড হচ্ছে")}><Skeleton className="h-6 w-56" /><Skeleton className="h-32 w-full rounded-2xl" /><Skeleton className="h-32 w-full rounded-2xl" /></CardContent></Card></AnimatedBlock> : null}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <WorkspaceFilterBar
          eyebrow={copy("Section navigator", "সেকশন নেভিগেটর")}
          title={activeTabLabel}
          description={copy(activeTabSummary.en, activeTabSummary.bn)}
          actions={
            <div className="workspace-data-grid min-w-[15rem]">
              <Label htmlFor="management-tab-select" className="text-xs uppercase tracking-[0.18em] text-muted-foreground sm:hidden">
                {copy("Quick switch", "Quick switch")}
              </Label>
              <div className="sm:hidden">
                <Select value={activeTab} onValueChange={setActiveTab}>
                  <SelectTrigger id="management-tab-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTabs.map((tab) => <SelectItem key={tab.value} value={tab.value}>{tab.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="workspace-chip-row">
                <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">{getDepartmentTitle(activeDepartmentId)}</Badge>
                <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">{copy(`${availableTabs.length} sections`, `${availableTabs.length}টি সেকশন`)}</Badge>
              </div>
            </div>
          }
        >
          <div className="hidden sm:block">
            <TabsList className={tabsClassName}>
              {availableTabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="rounded-2xl px-4 py-2.5 transition-all duration-300 hover:-translate-y-0.5 data-[state=active]:shadow-lg data-[state=active]:shadow-primary/10">
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </WorkspaceFilterBar>

        <TabsContent value="curriculum" className={tabContentClassName}>
          <div className="grid gap-6 xl:grid-cols-3">
            <Card className="rounded-[1.75rem] border border-border/50 bg-background/85"><CardHeader><CardTitle>{copy("Create course", "কোর্স তৈরি করুন")}</CardTitle></CardHeader><CardContent className="space-y-4"><Input value={courseForm.title} onChange={(e) => setCourseForm((s) => ({ ...s, title: e.target.value }))} placeholder={copy("Course title", "কোর্স শিরোনাম")} /><Textarea value={courseForm.description} onChange={(e) => setCourseForm((s) => ({ ...s, description: e.target.value }))} placeholder={copy("Description", "বর্ণনা")} /><Input type="number" min="0" value={courseForm.estimatedHours} onChange={(e) => setCourseForm((s) => ({ ...s, estimatedHours: e.target.value }))} placeholder={copy("Estimated hours", "আনুমানিক সময়")} /><Button className="w-full" onClick={() => runAction(async () => { await createCourse({ actor, payload: { ...courseForm, departmentId: activeDepartmentId, order: courses.length + 1, status: "published" } }); setCourseForm({ title: "", description: "", estimatedHours: "6" }); await loadWorkspace(); }, copy("Course created successfully.", "কোর্স সফলভাবে তৈরি হয়েছে।"))}>{copy("Create course", "কোর্স তৈরি করুন")}</Button></CardContent></Card>
            <Card className="rounded-[1.75rem] border border-border/50 bg-background/85"><CardHeader><CardTitle>{copy("Create lesson", "লেসন তৈরি করুন")}</CardTitle></CardHeader><CardContent className="space-y-4"><Select value={lessonForm.courseId || "none"} onValueChange={(value) => setLessonForm((s) => ({ ...s, courseId: value === "none" ? "" : value }))}><SelectTrigger><SelectValue placeholder={copy("Select course", "কোর্স নির্বাচন করুন")} /></SelectTrigger><SelectContent><SelectItem value="none">{copy("Select course", "কোর্স নির্বাচন করুন")}</SelectItem>{courses.map((course) => <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>)}</SelectContent></Select><Input value={lessonForm.title} onChange={(e) => setLessonForm((s) => ({ ...s, title: e.target.value }))} placeholder={copy("Lesson title", "লেসনের শিরোনাম")} /><Textarea value={lessonForm.summary} onChange={(e) => setLessonForm((s) => ({ ...s, summary: e.target.value }))} placeholder={copy("Summary", "সারাংশ")} /><Input type="url" value={lessonForm.externalUrl} onChange={(e) => setLessonForm((s) => ({ ...s, externalUrl: e.target.value }))} placeholder="https://..." /><Input value={lessonForm.providerName} onChange={(e) => setLessonForm((s) => ({ ...s, providerName: e.target.value }))} placeholder={copy("Provider name", "প্রোভাইডারের নাম")} /><Button className="w-full" onClick={() => runAction(async () => { await createLesson({ actor, payload: { ...lessonForm, departmentId: activeDepartmentId, estimatedHours: 3, credentialType: "verifiable_artifact", contentType: "external_resource", order: lessons.length + 1, status: "published" } }); setLessonForm((s) => ({ ...s, title: "", summary: "", externalUrl: "", providerName: "" })); await loadWorkspace(); }, copy("Lesson created successfully.", "লেসন সফলভাবে তৈরি হয়েছে।"))}>{copy("Create lesson", "লেসন তৈরি করুন")}</Button></CardContent></Card>
            <Card className="rounded-[1.75rem] border border-border/50 bg-background/85"><CardHeader><CardTitle>{copy("Create proof task", "প্রুফ টাস্ক তৈরি করুন")}</CardTitle></CardHeader><CardContent className="space-y-4"><Select value={taskForm.courseId || "none"} onValueChange={(value) => setTaskForm((s) => ({ ...s, courseId: value === "none" ? "" : value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">{copy("No course link", "কোর্স লিংক নেই")}</SelectItem>{courses.map((course) => <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>)}</SelectContent></Select><Input value={taskForm.title} onChange={(e) => setTaskForm((s) => ({ ...s, title: e.target.value }))} placeholder={copy("Task title", "টাস্ক শিরোনাম")} /><Input value={taskForm.resourceTitle} onChange={(e) => setTaskForm((s) => ({ ...s, resourceTitle: e.target.value }))} placeholder={copy("Resource title", "রিসোর্স শিরোনাম")} /><Input type="url" value={taskForm.resourceUrl} onChange={(e) => setTaskForm((s) => ({ ...s, resourceUrl: e.target.value }))} placeholder="https://..." /><Textarea value={taskForm.instructions} onChange={(e) => setTaskForm((s) => ({ ...s, instructions: e.target.value }))} placeholder={copy("Instructions", "নির্দেশনা")} /><div className="grid gap-4 md:grid-cols-2"><DatePicker label={copy("Deadline", "ডেডলাইন")} value={taskForm.deadlineAt} onChange={(val) => setTaskForm((s) => ({ ...s, deadlineAt: val?.iso || "" }))} /><Input type="number" min="0" value={taskForm.maxPoints} onChange={(e) => setTaskForm((s) => ({ ...s, maxPoints: e.target.value }))} placeholder={copy("Max points", "সর্বোচ্চ পয়েন্ট")} /></div><Button className="w-full" onClick={() => runAction(async () => { await createTask({ actor, payload: { ...taskForm, departmentId: activeDepartmentId, status: "open", allowedSubmissionTypes: ["certificate", "screenshot", "public_profile", "github", "link"], proofChecklist: ["Link works", "Matches user name", "Completion visible"] } }); setTaskForm({ courseId: taskForm.courseId, title: "", resourceTitle: "", resourceUrl: "", instructions: "", deadlineAt: "", maxPoints: "50" }); await loadWorkspace(); }, copy("Task created successfully.", "টাস্ক সফলভাবে তৈরি হয়েছে।"))}>{copy("Create task", "টাস্ক তৈরি করুন")}</Button></CardContent></Card>
          </div>
          <Card className="rounded-[1.75rem] border border-border/50 bg-background/85"><CardHeader><CardTitle>{copy("Published courses", "পাবলিশড কোর্স")}</CardTitle></CardHeader><CardContent><ItemList items={courses} emptyText={copy("No courses created yet.", "এখনও কোনো কোর্স তৈরি হয়নি।")} renderItem={(course) => <div key={course.id} className="rounded-3xl border bg-background/80 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-medium">{course.title}</p><p className="mt-2 text-sm text-muted-foreground">{course.lessonCount || 0} {copy("lessons", "লেসন")} / {course.estimatedHours || 0} {copy("hours", "ঘণ্টা")}</p></div>{isSuperAdmin ? <Button variant="destructive" size="sm" onClick={() => confirmAndRun(copy("Remove this course and all linked lessons and tasks?", "এই course এবং এর সাথে যুক্ত সব lesson ও task মুছে ফেলতে চান?"), async () => { await deleteCourseWithChildren({ courseId: course.id, actor }); await loadWorkspace(); }, copy("Course removed successfully.", "কোর্স সফলভাবে সরানো হয়েছে।"))}><Trash2 className="h-4 w-4" />{copy("Remove", "সরান")}</Button> : null}</div></div>} /></CardContent></Card>
        </TabsContent>

        <TabsContent value="announcements" className={tabContentClassName}>
          <Card className="rounded-[1.75rem] border border-border/50 bg-background/85">
            <CardHeader><CardTitle>{copy("Publish announcement", "ঘোষণা প্রকাশ করুন")}</CardTitle><CardDescription>{copy("Use this for official updates only.", "এটি শুধু official update-এর জন্য ব্যবহার করুন।")}</CardDescription></CardHeader>
            <CardContent className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-4"><Select value={announcementForm.scope} onValueChange={(value) => setAnnouncementForm((s) => ({ ...s, scope: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="department">{copy("Department", "ডিপার্টমেন্ট")}</SelectItem>{(isSuperAdmin || authState.role === "director") ? <SelectItem value="global">{copy("Global", "গ্লোবাল")}</SelectItem> : null}</SelectContent></Select><Input value={announcementForm.title} onChange={(e) => setAnnouncementForm((s) => ({ ...s, title: e.target.value }))} placeholder={copy("Announcement title", "ঘোষণার শিরোনাম")} /><Textarea className="min-h-40" value={announcementForm.body} onChange={(e) => setAnnouncementForm((s) => ({ ...s, body: e.target.value }))} placeholder={copy("What changed, what to do, and by when", "কি বদলেছে, কী করতে হবে, এবং কখনের মধ্যে করতে হবে")} /><Button className="w-full" onClick={() => runAction(async () => { await createAnnouncement({ actor, payload: { ...announcementForm, departmentId: activeDepartmentId } }); setAnnouncementForm((s) => ({ ...s, title: "", body: "" })); await loadWorkspace(); }, copy("Announcement published successfully.", "ঘোষণা সফলভাবে প্রকাশ হয়েছে।"))}>{copy("Publish announcement", "ঘোষণা প্রকাশ করুন")}</Button></div>
              <ItemList items={announcements} emptyText={copy("No announcements yet.", "এখনও কোনো ঘোষণা নেই।")} renderItem={(item) => <div key={item.id} className="rounded-3xl border bg-background/80 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-medium">{item.title}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p></div>{isSuperAdmin ? <Button variant="destructive" size="sm" onClick={() => confirmAndRun(copy("Remove this announcement?", "এই ঘোষণা মুছে ফেলতে চান?"), async () => { await deleteAnnouncementRecord({ announcementId: item.id, actor }); await loadWorkspace(); }, copy("Announcement removed successfully.", "ঘোষণা সফলভাবে সরানো হয়েছে।"))}><Trash2 className="h-4 w-4" />{copy("Remove", "সরান")}</Button> : null}</div></div>} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className={tabContentClassName}><Card className="rounded-[1.75rem] border border-border/50 bg-background/85"><CardHeader><CardTitle>{copy("Record attendance", "অ্যাটেনডেন্স রেকর্ড করুন")}</CardTitle><CardDescription>{copy("Only approved roles can create attendance points.", "শুধু approved role attendance points তৈরি করতে পারবে।")}</CardDescription></CardHeader><CardContent className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]"><div className="space-y-4"><Select value={attendanceForm.userId || "none"} onValueChange={(value) => setAttendanceForm((s) => ({ ...s, userId: value === "none" ? "" : value }))}><SelectTrigger><SelectValue placeholder={copy("Select member", "মেম্বার নির্বাচন করুন")} /></SelectTrigger><SelectContent><SelectItem value="none">{copy("Select member", "মেম্বার নির্বাচন করুন")}</SelectItem>{rosterUsers.map((item) => <SelectItem key={item.id} value={item.id}>{item.displayName || item.email}</SelectItem>)}</SelectContent></Select><div className="grid gap-4 md:grid-cols-2"><Input value={attendanceForm.eventType} onChange={(e) => setAttendanceForm((s) => ({ ...s, eventType: e.target.value }))} placeholder={copy("Event type", "ইভেন্ট টাইপ")} /><Input type="number" min="0" value={attendanceForm.points} onChange={(e) => setAttendanceForm((s) => ({ ...s, points: e.target.value }))} placeholder={copy("Points", "পয়েন্ট")} /></div><Input value={attendanceForm.eventTitle} onChange={(e) => setAttendanceForm((s) => ({ ...s, eventTitle: e.target.value }))} placeholder={copy("Event title", "ইভেন্ট শিরোনাম")} /><Button className="w-full" disabled={!authState.canAwardPoints} onClick={() => runAction(async () => { await recordAttendanceAndCredit({ actor, targetUserId: attendanceForm.userId, departmentId: activeDepartmentId, eventType: attendanceForm.eventType, eventTitle: attendanceForm.eventTitle, points: attendanceForm.points }); setAttendanceForm({ userId: "", eventType: "workshop", eventTitle: "", points: "5" }); await loadWorkspace(); }, copy("Attendance recorded successfully.", "অ্যাটেনডেন্স সফলভাবে রেকর্ড হয়েছে।"))}>{copy("Record attendance", "অ্যাটেনডেন্স রেকর্ড করুন")}</Button></div><div className="space-y-4"><Alert className="interactive-tile"><AlertTitle>{copy("Integrity rule", "ইন্টেগ্রিটি রুল")}</AlertTitle><AlertDescription>{copy("You cannot award points to yourself. Attendance credit always writes a matching ledger entry.", "নিজেকে points দেওয়া যাবে না। Attendance credit সবসময় matching ledger entry লিখবে।")}</AlertDescription></Alert><StatCard title={copy("Your permission", "আপনার অনুমতি")} value={authState.canAwardPoints ? copy("Can award points", "পয়েন্ট দিতে পারবেন") : copy("Review only", "শুধু রিভিউ")} description={copy("Heads, directors, and super admins can finalize credit.", "Head, director, ও super admin-রা credit finalize করতে পারে।")} /></div></CardContent></Card></TabsContent>


        <TabsContent value="people" className={tabContentClassName}>
          <PeopleManagementPanel
            actor={actor}
            activeDepartmentId={activeDepartmentId}
            users={users}
            rosterUsers={rosterUsers}
            isSuperAdmin={isSuperAdmin}
            assignableRoles={assignableRoles}
            accessForm={accessForm}
            setAccessForm={setAccessForm}
            departmentOptions={departmentOptions}
            onWorkspaceReload={loadWorkspace}
            runAction={runAction}
            confirmAndRun={confirmAndRun}
          />
        </TabsContent>
        {isSuperAdmin ? <TabsContent value="certificates" className={tabContentClassName}><CertificateManagementPanel activeDepartmentId={activeDepartmentId} courses={courses} users={users} actor={actor} departmentTitle={getDepartmentTitle(activeDepartmentId)} /></TabsContent> : null}

        {isSuperAdmin ? (
          <TabsContent value="workshop-certificates" className={tabContentClassName}>
            <WorkshopCertificatePanel
              activeDepartmentId={activeDepartmentId}
              users={users}
              actor={actor}
              departmentTitle={getDepartmentTitle(activeDepartmentId)}
              enabled={activeTab === "workshop-certificates"}
            />
          </TabsContent>
        ) : null}

          {isSuperAdmin ? (
            <TabsContent value="glc-certificates" className={tabContentClassName}>
              <GlcCertificatePanel
                activeDepartmentId={activeDepartmentId}
                users={users}
                actor={actor}
                departmentTitle={getDepartmentTitle(activeDepartmentId)}
                enabled={activeTab === "glc-certificates"}
              />
            </TabsContent>
          ) : null}

        {isSuperAdmin ? (
          <TabsContent value="gallery" className={tabContentClassName}>
            <FounderGalleryPanel actor={actor} />
          </TabsContent>
        ) : null}

        {isSuperAdmin ? <TabsContent value="templates" className={tabContentClassName}><CertificateTemplateBuilder actor={actor} /></TabsContent> : null}

        {isSuperAdmin ? (
          <TabsContent value="restore" className={tabContentClassName}>
            <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
              <Card className="rounded-[1.75rem] border border-border/50 bg-background/85">
                <CardHeader>
                  <CardTitle>{copy("Restore bin", "Restore bin")}</CardTitle>
                  <CardDescription>
                    {copy(
                      "Every destructive super-admin action now creates an archived snapshot before live data changes.",
                      "Every destructive super-admin action now creates an archived snapshot before live data changes.",
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ItemList
                    items={availableRestoreEntries}
                    emptyText={copy(
                      "No archived records are waiting for restore.",
                      "No archived records are waiting for restore.",
                    )}
                    renderItem={(entry) => (
                      <div key={entry.id} className="interactive-tile rounded-3xl border bg-background/80 p-4">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="subtle" className="rounded-full px-3 py-1 text-xs">
                                {entry.entityType || copy("Record", "Record")}
                              </Badge>
                              <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
                                {entry.action || copy("Archived", "Archived")}
                              </Badge>
                            </div>
                            <p className="text-lg font-semibold">{entry.label || entry.entityId}</p>
                            <p className="text-sm leading-6 text-muted-foreground">
                              {entry.summary || copy("Archived before removal.", "Archived before removal.")}
                            </p>
                            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                              <span>{copy("Department:", "Department:")} {entry.departmentId || copy("Not scoped", "Not scoped")}</span>
                              <span>{copy("Archived:", "Archived:")} {formatDateTime(entry.createdAt)}</span>
                              <span>{copy("Actor:", "Actor:")} {entry.actorRole || "super_admin"}</span>
                            </div>
                          </div>
                          <Button
                            className="min-w-[11rem]"
                            disabled={restoringEntryId === entry.id}
                            onClick={() => handleRestoreEntry(entry.id)}
                          >
                            <RotateCcw className="h-4 w-4" />
                            {restoringEntryId === entry.id
                              ? copy("Restoring...", "Restoring...")
                              : copy("Restore record", "Restore record")}
                          </Button>
                        </div>
                      </div>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="rounded-[1.75rem] border border-border/50 bg-background/85">
                <CardHeader>
                  <CardTitle>{copy("How restore works", "How restore works")}</CardTitle>
                  <CardDescription>
                    {copy(
                      "This keeps governance safe without leaving the Firebase free-tier mindset.",
                      "This keeps governance safe without leaving the Firebase free-tier mindset.",
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    copy(
                      "Member removals keep the previous access state so the roster assignment can be restored.",
                      "Member removals keep the previous access state so the roster assignment can be restored.",
                    ),
                    copy(
                      "Course and lesson deletions also archive linked children, so one restore action can recover the bundle.",
                      "Course and lesson deletions also archive linked children, so one restore action can recover the bundle.",
                    ),
                    copy(
                      "Restore actions also write a fresh audit log so governance history stays complete.",
                      "Restore actions also write a fresh audit log so governance history stays complete.",
                    ),
                  ].map((item) => (
                    <div key={item} className="interactive-tile rounded-2xl border bg-background/80 px-4 py-4 text-sm leading-6 text-muted-foreground">
                      {item}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ) : null}

        {isSuperAdmin ? (
          <TabsContent value="audit" className={tabContentClassName}>
            <Card className="rounded-[1.75rem] border border-border/50 bg-background/85">
              <CardHeader>
                <CardTitle>{copy("Super admin audit log", "Super admin audit log")}</CardTitle>
                <CardDescription>
                  {copy(
                    "Recent governance actions across certificate, people, and resource administration.",
                    "Recent governance actions across certificate, people, and resource administration.",
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ItemList
                  items={auditLogs}
                  emptyText={copy("No audit events found yet.", "No audit events found yet.")}
                  renderItem={(entry) => (
                    <div key={entry.id} className="interactive-tile rounded-3xl border bg-background/80 p-4">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="subtle" className="rounded-full px-3 py-1 text-xs">
                              {entry.action || copy("Action", "Action")}
                            </Badge>
                            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
                              {entry.entityType || copy("Record", "Record")}
                            </Badge>
                          </div>
                          <p className="text-lg font-semibold">{entry.label || entry.entityId}</p>
                          <p className="text-sm leading-6 text-muted-foreground">
                            {entry.summary || copy("Governance action recorded.", "Governance action recorded.")}
                          </p>
                        </div>
                        <div className="space-y-1 text-right text-xs text-muted-foreground">
                          <p>{formatDateTime(entry.createdAt)}</p>
                          <p>{copy("Actor role:", "Actor role:")} {entry.actorRole || "super_admin"}</p>
                          <p>{copy("Department:", "Department:")} {entry.departmentId || copy("Global", "Global")}</p>
                        </div>
                      </div>
                    </div>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        ) : null}

        {isSuperAdmin ? <TabsContent value="admin" className={tabContentClassName}><div className="space-y-6"><Alert className="interactive-tile"><ShieldAlert className="h-4 w-4" /><AlertTitle>{copy("Highest access safeguards", "সর্বোচ্চ অ্যাকসেস সেফগার্ড")}</AlertTitle><AlertDescription>{copy("These tools are intentionally destructive. Use them only after checking the department scope and confirming the impact.", "এই টুলগুলো ইচ্ছাকৃতভাবে destructive। Department scope যাচাই করে impact নিশ্চিত হওয়ার পরই ব্যবহার করুন।")}</AlertDescription></Alert><div className="grid gap-6 xl:grid-cols-2"><Card className="rounded-[1.75rem] border border-border/50 bg-background/85"><CardHeader><CardTitle>{copy("Member lifecycle", "মেম্বার লাইফসাইকেল")}</CardTitle></CardHeader><CardContent className="space-y-4"><Select value={adminForm.userId || "none"} onValueChange={(value) => setAdminForm((current) => ({ ...current, userId: value === "none" ? "" : value }))}><SelectTrigger><SelectValue placeholder={copy("Choose a member", "একজন মেম্বার বেছে নিন")} /></SelectTrigger><SelectContent><SelectItem value="none">{copy("Choose a member", "একজন মেম্বার বেছে নিন")}</SelectItem>{users.map((item) => <SelectItem key={item.id} value={item.id}>{item.displayName || item.email}</SelectItem>)}</SelectContent></Select><Button variant="destructive" className="w-full transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]" disabled={!adminForm.userId} onClick={() => confirmAndRun(copy("Remove this member from the active roster and clear the department assignment?", "এই member-কে active roster থেকে সরিয়ে department assignment clear করতে চান?"), async () => { await removeManagedUser({ targetUserId: adminForm.userId, actor }); setAdminForm((current) => ({ ...current, userId: "" })); await loadWorkspace(); }, copy("Member removed from the active roster.", "মেম্বারকে active roster থেকে সরানো হয়েছে।"))}><UserMinus className="h-4 w-4" />{copy("Remove from active roster", "active roster থেকে সরান")}</Button></CardContent></Card><Card className="rounded-[1.75rem] border border-border/50 bg-background/85"><CardHeader><CardTitle>{copy("Resource removal", "রিসোর্স রিমুভাল")}</CardTitle></CardHeader><CardContent className="space-y-4"><Select value={adminForm.courseId || "none"} onValueChange={(value) => setAdminForm((current) => ({ ...current, courseId: value === "none" ? "" : value }))}><SelectTrigger><SelectValue placeholder={copy("Select a course", "একটি কোর্স বেছে নিন")} /></SelectTrigger><SelectContent><SelectItem value="none">{copy("Select a course", "একটি কোর্স বেছে নিন")}</SelectItem>{courses.map((item) => <SelectItem key={item.id} value={item.id}>{item.title}</SelectItem>)}</SelectContent></Select><Button variant="destructive" className="w-full transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]" disabled={!adminForm.courseId} onClick={() => confirmAndRun(copy("Remove this course and all linked lessons and tasks?", "এই course এবং এর সাথে যুক্ত সব lesson ও task মুছে ফেলতে চান?"), async () => { await deleteCourseWithChildren({ courseId: adminForm.courseId, actor }); setAdminForm((current) => ({ ...current, courseId: "" })); await loadWorkspace(); }, copy("Course removed successfully.", "কোর্স সফলভাবে সরানো হয়েছে।"))}><Trash2 className="h-4 w-4" />{copy("Remove course", "কোর্স সরান")}</Button><Select value={adminForm.lessonId || "none"} onValueChange={(value) => setAdminForm((current) => ({ ...current, lessonId: value === "none" ? "" : value }))}><SelectTrigger><SelectValue placeholder={copy("Select a lesson", "একটি লেসন বেছে নিন")} /></SelectTrigger><SelectContent><SelectItem value="none">{copy("Select a lesson", "একটি লেসন বেছে নিন")}</SelectItem>{lessons.map((item) => <SelectItem key={item.id} value={item.id}>{item.title}</SelectItem>)}</SelectContent></Select><Button variant="destructive" className="w-full transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]" disabled={!adminForm.lessonId} onClick={() => confirmAndRun(copy("Remove this lesson and its linked tasks?", "এই lesson এবং এর linked task মুছে ফেলতে চান?"), async () => { await deleteLessonWithChildren({ lessonId: adminForm.lessonId, actor }); setAdminForm((current) => ({ ...current, lessonId: "" })); await loadWorkspace(); }, copy("Lesson removed successfully.", "লেসন সফলভাবে সরানো হয়েছে।"))}><Trash2 className="h-4 w-4" />{copy("Remove lesson", "লেসন সরান")}</Button><Select value={adminForm.taskId || "none"} onValueChange={(value) => setAdminForm((current) => ({ ...current, taskId: value === "none" ? "" : value }))}><SelectTrigger><SelectValue placeholder={copy("Select a task", "একটি টাস্ক বেছে নিন")} /></SelectTrigger><SelectContent><SelectItem value="none">{copy("Select a task", "একটি টাস্ক বেছে নিন")}</SelectItem>{tasks.map((item) => <SelectItem key={item.id} value={item.id}>{item.title}</SelectItem>)}</SelectContent></Select><Button variant="destructive" className="w-full transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]" disabled={!adminForm.taskId} onClick={() => confirmAndRun(copy("Remove this task?", "এই task মুছে ফেলতে চান?"), async () => { await deleteTaskRecord({ taskId: adminForm.taskId, actor }); setAdminForm((current) => ({ ...current, taskId: "" })); await loadWorkspace(); }, copy("Task removed successfully.", "টাস্ক সফলভাবে সরানো হয়েছে।"))}><Trash2 className="h-4 w-4" />{copy("Remove task", "টাস্ক সরান")}</Button><Select value={adminForm.announcementId || "none"} onValueChange={(value) => setAdminForm((current) => ({ ...current, announcementId: value === "none" ? "" : value }))}><SelectTrigger><SelectValue placeholder={copy("Select an announcement", "একটি ঘোষণা বেছে নিন")} /></SelectTrigger><SelectContent><SelectItem value="none">{copy("Select an announcement", "একটি ঘোষণা বেছে নিন")}</SelectItem>{announcements.map((item) => <SelectItem key={item.id} value={item.id}>{item.title}</SelectItem>)}</SelectContent></Select><Button variant="destructive" className="w-full transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]" disabled={!adminForm.announcementId} onClick={() => confirmAndRun(copy("Remove this announcement?", "এই ঘোষণা মুছে ফেলতে চান?"), async () => { await deleteAnnouncementRecord({ announcementId: adminForm.announcementId, actor }); setAdminForm((current) => ({ ...current, announcementId: "" })); await loadWorkspace(); }, copy("Announcement removed successfully.", "ঘোষণা সফলভাবে সরানো হয়েছে।"))}><Trash2 className="h-4 w-4" />{copy("Remove announcement", "ঘোষণা সরান")}</Button><Select value={adminForm.certificateId || "none"} onValueChange={(value) => setAdminForm((current) => ({ ...current, certificateId: value === "none" ? "" : value }))}><SelectTrigger><SelectValue placeholder={copy("Select a certificate", "একটি সার্টিফিকেট বেছে নিন")} /></SelectTrigger><SelectContent><SelectItem value="none">{copy("Select a certificate", "একটি সার্টিফিকেট বেছে নিন")}</SelectItem>{certificates.map((item) => <SelectItem key={item.id} value={item.id}>{`${item.recipientName} - ${item.certificateTitle}`}</SelectItem>)}</SelectContent></Select><Button variant="destructive" className="w-full transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]" disabled={!adminForm.certificateId} onClick={() => confirmAndRun(copy("Remove this certificate record permanently?", "এই certificate record স্থায়ীভাবে মুছে ফেলতে চান?"), async () => { await deleteCertificateRecord({ certificateId: adminForm.certificateId, actor }); setAdminForm((current) => ({ ...current, certificateId: "" })); await loadWorkspace(); }, copy("Certificate record removed successfully.", "সার্টিফিকেট রেকর্ড সফলভাবে সরানো হয়েছে।"))}><Trash2 className="h-4 w-4" />{copy("Remove certificate record", "সার্টিফিকেট রেকর্ড সরান")}</Button></CardContent></Card></div></div></TabsContent> : null}
      </Tabs>
    </div>
  );
}
