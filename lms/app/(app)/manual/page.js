"use client";

import { useEffect, useMemo, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkspaceFilterBar } from "@/components/ui/workspace-filter-bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { normalizeLocalizedTree } from "@/lib/localized-copy";
import { ROLE_GUIDES, getRoleGuide } from "@/lib/role-guides-clean";
import {
  ROLE_OPTIONS,
  canAwardPoints,
  canBrowseAllDepartments,
  canManage,
  canReview,
  getRoleList,
  roleLabel,
} from "@/lib/catalog";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  FileCheck2,
  ShieldCheck,
  Sparkles,
  UserCircle2,
  Workflow,
} from "lucide-react";

const platformFlow = normalizeLocalizedTree([
  {
    en: "Sign in and let the LMS load your profile and role.",
    bn: "সাইন ইন করুন এবং LMS-কে আপনার প্রোফাইল ও রোল লোড করতে দিন।",
  },
  {
    en: "Members work inside one department path at a time. Global roles can inspect multiple departments.",
    bn: "মেম্বাররা এক সময়ে একটি ডিপার্টমেন্ট পথেই কাজ করে। Global role-রা একাধিক department inspect করতে পারে।",
  },
  {
    en: "Courses contain lessons, and lessons point to one verified learning resource.",
    bn: "কোর্সের ভেতরে লেসন থাকে, এবং প্রতিটি লেসন একটি verified learning resource-এর দিকে নিয়ে যায়।",
  },
  {
    en: "Each lesson connects to a proof task. Points count only after review is finalized.",
    bn: "প্রতিটি লেসনের সাথে একটি proof task যুক্ত থাকে। Review final না হওয়া পর্যন্ত points গণনা হয় না।",
  },
  {
    en: "Mentors recommend. Department heads, directors, and super admins finalize decisions inside their scope.",
    bn: "মেন্টররা recommendation দেয়। Department head, director, এবং super admin নিজেদের scope-এর মধ্যে final decision নেয়।",
  },
  {
    en: "Certificates are issued only from trusted completion records and are publicly verifiable.",
    bn: "Certificate শুধু trusted completion record থেকে issue হয় এবং public verification link দিয়ে যাচাই করা যায়।",
  },
]);

const operatingRules = normalizeLocalizedTree([
  {
    en: "One member, one working department at a time.",
    bn: "একজন মেম্বার এক সময়ে একটি working department-এ কাজ করবে।",
  },
  {
    en: "Proof comes before points. No proof, no official credit.",
    bn: "প্রুফ আগে, points পরে। প্রুফ না থাকলে official credit নেই।",
  },
  {
    en: "Mentors recommend, but cannot finalize points.",
    bn: "মেন্টররা recommendation দিতে পারে, কিন্তু points finalize করতে পারে না।",
  },
  {
    en: "Attendance should be recorded only for events that actually happened.",
    bn: "Attendance শুধু বাস্তবে হওয়া event-এর জন্যই record করা যাবে।",
  },
  {
    en: "Certificates should be issued only by super admins from verified completion records.",
    bn: "Certificate শুধু super admin verified completion record থেকে issue করবে।",
  },
  {
    en: "Every approved point should be backed by a trusted ledger record.",
    bn: "প্রতিটি approved point-এর পেছনে trusted ledger record থাকতে হবে।",
  },
]);

const pageGuide = normalizeLocalizedTree([
  {
    title: { en: "Dashboard", bn: "ড্যাশবোর্ড" },
    body: {
      en: "Your main operating page. It shows next action, role guidance, active tasks, announcements, and your current scope.",
      bn: "এটাই আপনার main operating page। এখানে next action, role guidance, active task, announcement, এবং current scope দেখা যায়।",
    },
  },
  {
    title: { en: "Department", bn: "ডিপার্টমেন্ট" },
    body: {
      en: "Shows department overview, staffing, published courses, and department-specific context.",
      bn: "এখানে department overview, staffing, published course, এবং department-specific context দেখা যায়।",
    },
  },
  {
    title: { en: "Courses and Lessons", bn: "কোর্স ও লেসন" },
    body: {
      en: "Courses define the path. Lessons define the exact resource and the linked proof task.",
      bn: "Courses পথ নির্ধারণ করে। Lessons নির্দিষ্ট resource এবং linked proof task দেখায়।",
    },
  },
  {
    title: { en: "Tasks and Submissions", bn: "টাস্ক ও সাবমিশন" },
    body: {
      en: "Tasks explain what proof to submit. Submissions show status, reviewer comments, revision requests, and approved outcomes.",
      bn: "Task বলে কী ধরনের proof জমা দিতে হবে। Submission-এ status, reviewer comment, revision request, এবং approved result দেখা যায়।",
    },
  },
  {
    title: { en: "Review", bn: "রিভিউ" },
    body: {
      en: "Mentors and approvers use this page to inspect proof and move decisions forward.",
      bn: "Mentor এবং approver-রা এই page ব্যবহার করে proof যাচাই করে এবং decision এগিয়ে নেয়।",
    },
  },
  {
    title: { en: "Management", bn: "ম্যানেজমেন্ট" },
    body: {
      en: "Heads, directors, and super admins use this page for curriculum, announcements, attendance, user access, and certificates.",
      bn: "Head, director, এবং super admin এই page ব্যবহার করে curriculum, announcement, attendance, user access, এবং certificate manage করে।",
    },
  },
  {
    title: { en: "Points and Certificates", bn: "পয়েন্ট ও সার্টিফিকেট" },
    body: {
      en: "Points show approved credits only. Certificates should be treated as public, verifiable completion records.",
      bn: "Points page-এ শুধু approved credit দেখা যায়। Certificate-কে public, verifiable completion record হিসেবে ধরতে হবে।",
    },
  },
]);

function PermissionCard({ title, value, description }) {
  return (
    <div className="rounded-3xl border bg-background/80 p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{title}</p>
      <p className="mt-2 text-lg font-semibold">{value}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}

export default function ManualPage() {
  const { copy } = useLocale();
  const authState = useAuth();
  const userRoleIds = getRoleList(authState);
  const isSuperAdmin = userRoleIds.includes("super_admin");
  const visibleRoleIds = isSuperAdmin ? ROLE_OPTIONS : userRoleIds;
  const currentRole = visibleRoleIds.includes(authState?.role) ? authState.role : visibleRoleIds[0] || "member";
  const userGuide = getRoleGuide(currentRole);
  const [selectedRoleId, setSelectedRoleId] = useState(currentRole);

  useEffect(() => {
    if (!visibleRoleIds.includes(selectedRoleId)) {
      setSelectedRoleId(currentRole);
    }
  }, [currentRole, selectedRoleId, visibleRoleIds]);

  const visibleRoleTitles = useMemo(
    () =>
      visibleRoleIds
        .map((roleId) => {
          const guide = getRoleGuide(roleId);
          return copy(guide.title.en, guide.title.bn);
        })
        .join(" • "),
    [copy, visibleRoleIds],
  );

  const permissionMatrix = visibleRoleIds.map((roleId) => {
    const guide = getRoleGuide(roleId);
    return {
      id: roleId,
      title: guide.title,
      label: roleLabel(roleId),
      summary: guide.summary,
      authority: guide.authority,
      scope: canBrowseAllDepartments(roleId)
        ? {
            en: "Can inspect all departments",
            bn: "সব ডিপার্টমেন্ট inspect করতে পারে",
          }
        : {
            en: "Works inside one department scope",
            bn: "একটি ডিপার্টমেন্ট scope-এর মধ্যে কাজ করে",
          },
      review: canReview(roleId)
        ? { en: "Can review", bn: "রিভিউ করতে পারে" }
        : { en: "Cannot review", bn: "রিভিউ করতে পারে না" },
      manage: canManage(roleId)
        ? { en: "Can manage", bn: "ম্যানেজ করতে পারে" }
        : { en: "Cannot manage", bn: "ম্যানেজ করতে পারে না" },
      points: canAwardPoints(roleId)
        ? { en: "Can finalize points", bn: "পয়েন্ট finalize করতে পারে" }
        : { en: "Cannot finalize points", bn: "পয়েন্ট finalize করতে পারে না" },
      certificate: roleId === "super_admin"
        ? { en: "Can issue certificates", bn: "সার্টিফিকেট issue করতে পারে" }
        : { en: "Cannot issue certificates", bn: "সার্টিফিকেট issue করতে পারে না" },
    };
  });

  const quickRoleTabs = visibleRoleIds.map((roleId) => {
    const guide = getRoleGuide(roleId);
    return {
      id: roleId,
      title: guide.title,
      summary: guide.summary,
      authority: guide.authority,
      today: guide.today,
      screens: guide.primaryTools,
      avoid: guide.avoid[0],
      steps: guide.steps,
    };
  });

  return (
    <div className="workspace-stack">
      <Card className="workspace-hero rounded-[2rem] border bg-primary/5 shadow-xl backdrop-blur-xl" data-reveal="up">
        <CardHeader className="space-y-4">
          <Badge variant="subtle" className="w-fit rounded-full px-4 py-1.5 text-sm bg-primary text-primary-foreground">
            {copy("LMS Operations Manual", "LMS অপারেশনস ম্যানুয়াল")}
          </Badge>
          <CardTitle className="flex items-center gap-3 text-3xl">
            <UserCircle2 className="h-8 w-8 text-primary" />
            {copy(`Role: ${userGuide.title.en}`, `রোল: ${userGuide.title.bn}`)}
          </CardTitle>
          <CardDescription className="max-w-4xl text-base leading-7 font-medium text-foreground/90">
            {copy(userGuide.summary.en, userGuide.summary.bn)}
          </CardDescription>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
              {copy("Visible manuals", "দৃশ্যমান ম্যানুয়াল")} {visibleRoleIds.length}
            </Badge>
            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
              {visibleRoleTitles}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-3xl border border-primary/20 bg-background/85 p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              {copy("Today's Focus", "আজকের ফোকাস")}
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              {copy(userGuide.today.en, userGuide.today.bn)}
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <PermissionCard
              title={copy("Authority", "অথরিটি")}
              value={copy(userGuide.authority.en, userGuide.authority.bn)}
              description={copy("Use only the permissions that belong to your role.", "শুধু আপনার রোলের মধ্যে থাকা permission-ই ব্যবহার করুন।")}
            />
            <PermissionCard
              title={copy("Primary tools", "মূল টুল")}
              value={copy(userGuide.primaryTools[0].en, userGuide.primaryTools[0].bn)}
              description={copy(
                `${userGuide.primaryTools[1].en} and ${userGuide.primaryTools[2].en} are your other core surfaces.`,
                `${userGuide.primaryTools[1].bn} এবং ${userGuide.primaryTools[2].bn} আপনার অন্য core surface।`,
              )}
            />
            <PermissionCard
              title={copy("Avoid", "এড়িয়ে চলুন")}
              value={copy(userGuide.avoid[0].en, userGuide.avoid[0].bn)}
              description={copy("These mistakes create confusion, weak records, or invalid approvals.", "এই ভুলগুলো confusion, weak record, বা invalid approval তৈরি করে।")}
            />
          </div>
        </CardContent>
      </Card>

      <WorkspaceFilterBar
        eyebrow={copy("Manual visibility", "ম্যানুয়াল দৃশ্যমানতা")}
        title={copy("Why you are seeing these guides", "কেন আপনি এই গাইডগুলো দেখছেন")}
        description={
          isSuperAdmin
            ? copy(
                "Super admins can inspect every role guide so onboarding, governance checks, and cross-role coordination stay clear.",
                "Super admin সব role guide inspect করতে পারে, যাতে onboarding, governance check, এবং cross-role coordination পরিষ্কার থাকে।",
              )
            : copy(
                "Only the manuals that match your assigned roles stay visible here. If one account carries two roles, both guides remain available together.",
                "এখানে শুধু আপনার assigned role-এর manual-ই visible থাকে। একটি account-এ দুইটি role থাকলে দুইটির guide-ই একসাথে available থাকবে।",
              )
        }
        actions={
          quickRoleTabs.length > 1 ? (
            <div className="workspace-data-grid min-w-[15rem] sm:hidden">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {copy("Visible role guide", "দৃশ্যমান রোল গাইড")}
              </p>
              <Tabs value={selectedRoleId} onValueChange={setSelectedRoleId}>
                <TabsList className="h-auto flex-wrap justify-start gap-1.5 rounded-3xl border border-border/50 bg-background/85 p-2 shadow-sm">
                  {quickRoleTabs.map((item) => (
                    <TabsTrigger key={item.id} value={item.id} className="rounded-2xl px-4 py-2.5">
                      {copy(item.title.en, item.title.bn)}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          ) : null
        }
      >
        <div className="workspace-chip-row">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
            {copy(`${visibleRoleIds.length} visible role guides`, `${visibleRoleIds.length}টি visible role guide`)}
          </Badge>
          <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
            {copy(userGuide.authority.en, userGuide.authority.bn)}
          </Badge>
        </div>
      </WorkspaceFilterBar>

      <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <Card className="rounded-[2rem] border bg-card/80 shadow-xl backdrop-blur-xl xl:col-span-2" data-reveal="up">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-muted-foreground" />
              <CardTitle>{copy("Quick Role Explorer", "দ্রুত রোল এক্সপ্লোরার")}</CardTitle>
            </div>
            <CardDescription>
              {isSuperAdmin
                ? copy(
                    "As the highest access role, you can inspect every role guide from one place.",
                    "সুপার অ্যাডমিন হিসেবে আপনি এক জায়গা থেকে সব রোলের গাইড দেখতে পারবেন।",
                  )
                : copy(
                    "Only your assigned role manuals appear here. If one account has two roles, both guides stay visible together.",
                    "এখানে শুধু আপনার অ্যাসাইন করা রোলগুলোর ম্যানুয়ালই দেখা যাবে। একটি অ্যাকাউন্টে দুইটি রোল থাকলে দুইটির গাইডই একসাথে দেখা যাবে।",
                  )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedRoleId} onValueChange={setSelectedRoleId} className="space-y-6">
              {quickRoleTabs.length > 1 ? (
                <TabsList className="hidden justify-start sm:flex">
                  {quickRoleTabs.map((item) => (
                    <TabsTrigger key={item.id} value={item.id} className="min-w-[140px]">
                      {copy(item.title.en, item.title.bn)}
                    </TabsTrigger>
                  ))}
                </TabsList>
              ) : null}

              {quickRoleTabs.map((item) => (
                <TabsContent key={item.id} value={item.id} className="mt-0">
                  <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-4 rounded-[1.75rem] border bg-background/85 p-5 shadow-sm">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                          {copy("Role snapshot", "রোল স্ন্যাপশট")}
                        </p>
                        <h3 className="mt-3 text-xl font-semibold">{copy(item.title.en, item.title.bn)}</h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {copy(item.summary.en, item.summary.bn)}
                        </p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <PermissionCard
                          title={copy("Authority", "অথরিটি")}
                          value={copy(item.authority.en, item.authority.bn)}
                          description={copy(
                            "This is the highest safe boundary for this role.",
                            "এই রোলের জন্য এটাই সবচেয়ে নিরাপদ ক্ষমতার সীমা।",
                          )}
                        />
                        <PermissionCard
                          title={copy("Today's move", "আজকের কাজ")}
                          value={copy(item.steps[0].en, item.steps[0].bn)}
                          description={copy(item.today.en, item.today.bn)}
                        />
                      </div>
                    </div>

                    <div className="space-y-4 rounded-[1.75rem] border bg-background/85 p-5 shadow-sm">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                          {copy("Use these screens", "এই স্ক্রিনগুলো ব্যবহার করুন")}
                        </p>
                        <div className="mt-4 space-y-3">
                          {item.screens.map((screen) => (
                            <div key={screen.en} className="flex items-start gap-3 rounded-2xl border bg-background p-3">
                              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                              <p className="text-sm leading-6 text-muted-foreground">{copy(screen.en, screen.bn)}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-300">
                          {copy("Most common mistake", "সবচেয়ে সাধারণ ভুল")}
                        </p>
                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                          {copy(item.avoid.en, item.avoid.bn)}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border bg-card/80 shadow-xl backdrop-blur-xl" data-reveal="up">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Workflow className="h-5 w-5 text-muted-foreground" />
              <CardTitle>{copy("Platform Flow", "প্ল্যাটফর্ম ফ্লো")}</CardTitle>
            </div>
            <CardDescription>{copy("This is the normal operating path for the LMS.", "এটাই LMS-এর স্বাভাবিক operating path।")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {platformFlow.map((step, index) => (
              <div key={step.en} className="flex items-start gap-4 rounded-3xl border bg-background/80 p-5 shadow-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {index + 1}
                </div>
                <p className="pt-1 text-sm leading-6 text-muted-foreground">{copy(step.en, step.bn)}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border bg-card/80 shadow-xl backdrop-blur-xl" data-reveal="up">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-muted-foreground" />
              <CardTitle>{copy("Operating Rules", "অপারেটিং রুলস")}</CardTitle>
            </div>
            <CardDescription>{copy("These rules keep the LMS fair, traceable, and trustworthy.", "এই rule-গুলো LMS-কে fair, traceable, এবং trustworthy রাখে।")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {operatingRules.map((item) => (
              <div key={item.en} className="flex items-start gap-3 rounded-3xl border bg-background/80 p-4 shadow-sm">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm leading-6 text-muted-foreground">{copy(item.en, item.bn)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[2rem] border bg-card/80 shadow-xl backdrop-blur-xl" data-reveal="up">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-muted-foreground" />
            <CardTitle>{copy("What Each Page Is For", "কোন পেজ কী কাজের জন্য")}</CardTitle>
          </div>
          <CardDescription>{copy("Use this section whenever someone asks where a task should happen.", "কোন কাজ কোন page-এ হবে বুঝতে এই section ব্যবহার করুন।")}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {pageGuide.map((item) => (
            <div key={item.title.en} className="rounded-3xl border bg-background/80 p-5 shadow-sm">
              <h3 className="font-semibold">{copy(item.title.en, item.title.bn)}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy(item.body.en, item.body.bn)}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border bg-card/80 shadow-xl backdrop-blur-xl" data-reveal="up">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileCheck2 className="h-5 w-5 text-muted-foreground" />
            <CardTitle>{copy("Role Permission Matrix", "রোল পারমিশন ম্যাট্রিক্স")}</CardTitle>
          </div>
          <CardDescription>{copy("This matrix is aligned with the current role-based logic of the LMS.", "এই matrix LMS-এর বর্তমান role-based logic-এর সাথে aligned রাখা হয়েছে।")}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {permissionMatrix.map((item) => (
            <div key={item.id} className="rounded-3xl border bg-background/85 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold">{copy(item.title.en, item.title.bn)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
                </div>
                <Badge variant="outline" className="rounded-full px-3 py-1">
                  {copy(item.scope.en, item.scope.bn)}
                </Badge>
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{copy(item.summary.en, item.summary.bn)}</p>
              <div className="mt-4 grid gap-3">
                <PermissionCard
                  title={copy("Review", "রিভিউ")}
                  value={copy(item.review.en, item.review.bn)}
                  description={copy("Review access follows the role model, not informal requests.", "Review access role model অনুযায়ী চলে, informal request অনুযায়ী নয়।")}
                />
                <PermissionCard
                  title={copy("Management", "ম্যানেজমেন্ট")}
                  value={copy(item.manage.en, item.manage.bn)}
                  description={copy("Management includes content, access, attendance, and department operations.", "Management-এর মধ্যে content, access, attendance, এবং department operations পড়ে।")}
                />
                <PermissionCard
                  title={copy("Points and certificates", "পয়েন্ট ও সার্টিফিকেট")}
                  value={copy(item.points.en, item.points.bn)}
                  description={copy(item.certificate.en, item.certificate.bn)}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border bg-card/80 shadow-xl backdrop-blur-xl" data-reveal="up">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-muted-foreground" />
            <CardTitle>{copy("Detailed Role Guides", "বিস্তারিত রোল গাইড")}</CardTitle>
          </div>
          <CardDescription>
            {isSuperAdmin
              ? copy("Use these for onboarding, clarification, and cross-role governance.", "onboarding, clarification, এবং cross-role governance-এর জন্য এই অংশ ব্যবহার করুন।")
              : copy("Use these for onboarding, clarification, and your own scoped operating discipline.", "onboarding, clarification, এবং নিজের scoped operating discipline-এর জন্য এই অংশ ব্যবহার করুন।")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="space-y-3">
            {visibleRoleIds.map((roleId) => {
              const guide = ROLE_GUIDES[roleId];

              return (
                <AccordionItem key={roleId} value={roleId} className="rounded-3xl border px-5 data-[state=open]:bg-muted/30">
                  <AccordionTrigger className="py-4 hover:no-underline">
                    <div className="text-left">
                      <p className="font-semibold">{copy(guide.title.en, guide.title.bn)}</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{copy(guide.summary.en, guide.summary.bn)}</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5">
                    <div className="space-y-6 pt-2">
                      <div className="rounded-3xl border border-primary/15 bg-background/80 p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                          {copy("Authority", "অথরিটি")}
                        </p>
                        <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy(guide.authority.en, guide.authority.bn)}</p>
                      </div>

                      <div className="grid gap-4 lg:grid-cols-3">
                        <div className="rounded-3xl border bg-background/80 p-5">
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                            {copy("Main responsibilities", "মূল দায়িত্ব")}
                          </p>
                          <div className="mt-4 space-y-3">
                            {guide.responsibilities.map((item) => (
                              <div key={item.en} className="flex items-start gap-3">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                <p className="text-sm leading-6 text-muted-foreground">{copy(item.en, item.bn)}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-3xl border bg-background/80 p-5">
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                            {copy("Primary screens", "মূল স্ক্রিন")}
                          </p>
                          <div className="mt-4 space-y-3">
                            {guide.primaryTools.map((item) => (
                              <div key={item.en} className="flex items-start gap-3">
                                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                <p className="text-sm leading-6 text-muted-foreground">{copy(item.en, item.bn)}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-3xl border bg-background/80 p-5">
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                            {copy("Avoid these mistakes", "এই ভুলগুলো এড়িয়ে চলুন")}
                          </p>
                          <div className="mt-4 space-y-3">
                            {guide.avoid.map((item) => (
                              <div key={item.en} className="flex items-start gap-3">
                                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                <p className="text-sm leading-6 text-muted-foreground">{copy(item.en, item.bn)}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="rounded-3xl border bg-background/80 p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                          {copy("Three-step operating routine", "তিন ধাপের কাজের রুটিন")}
                        </p>
                        <div className="mt-4 grid gap-4 lg:grid-cols-3">
                          {guide.steps.map((step, index) => (
                            <div key={step.en} className="rounded-2xl border bg-background p-4">
                              <div className="flex items-center gap-2 text-primary">
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-sm font-bold">
                                  {index + 1}
                                </span>
                                <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                                  {copy(`Action ${index + 1}`, `অ্যাকশন ${index + 1}`)}
                                </span>
                              </div>
                              <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy(step.en, step.bn)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>

      {/* Psychological UX: Consistency Principle & Commitment */}
      <Card className="rounded-[2rem] border-primary/20 bg-gradient-to-br from-emerald-500/5 via-emerald-500/10 to-transparent shadow-xl backdrop-blur-xl mt-8" data-reveal="up">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center sm:p-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h2 className="mt-6 text-2xl font-black">{copy("Commit to the Cooperative Rules", "কোঅপারেটিভের নিয়ম মেনে চলার প্রতিশ্রুতি")}</h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
            {copy(
              "By explicitly acknowledging these rules, you strengthen your psychological commitment to upholding them. Let's build a transparent ecosystem together.",
              "মনস্তাত্ত্বিকভাবে, এই নিয়মগুলো স্পষ্টভাবে স্বীকার করলে আপনার মেনে চলার প্রতিশ্রুতি আরও দৃঢ় হয়। চলুন একসাথে একটি স্বচ্ছ ইকোসিস্টেম গড়ি।"
            )}
          </p>
          <Button 
            className="mt-8 hover-lift rounded-full px-8 py-6 text-base font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
            onClick={(e) => {
              const el = e.currentTarget;
              el.innerText = copy("Acknowledged & Committed", "স্বীকৃত ও প্রতিশ্রুতিবদ্ধ");
              el.disabled = true;
              el.classList.add("bg-emerald-600", "text-white");
              el.classList.remove("shadow-[0_0_20px_rgba(16,185,129,0.3)]");
            }}
          >
            {copy("I Acknowledge & Commit", "আমি স্বীকার ও প্রতিশ্রুতি দিচ্ছি")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
