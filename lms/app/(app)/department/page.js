"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpenCheck, Megaphone } from "lucide-react";
import { DepartmentActivationPanel } from "@/components/layout/department-activation-panel";
import { WorkspacePageHeader } from "@/components/layout/workspace-page-header";
import { BABookCard } from "@/components/books/ba-book-card";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyStateCard } from "@/components/ui/empty-state-card";
import {
  DEPARTMENT_OPTIONS,
  DEPARTMENT_SEO,
  canBrowseAllDepartments,
  getCoursePreviewDescription,
  getDepartmentMeta,
  getDepartmentTitle,
  getParentTitle,
  resolveScopedDepartmentId,
  sanitizeAssignedResourceText,
} from "@/lib/catalog";
import { fetchDepartmentAnnouncements, fetchDepartmentCourses, fetchDepartmentDetail, fetchDepartments } from "@/lib/firestore/lms";
import { DEPARTMENTS } from "@/src/data/structure.mjs";
import { cn } from "@/lib/utils";

const DEPT_ID_MAPPING = {
  frontend: "frontend",
  backend: "backend",
  devopsqa: "devops",
  uiux: "ux",
  design: "graphic",
  baagile: "ba",
  pm: "pm",
  marketing: "growth",
  crmcs: "success",
};

export default function DepartmentPage() {
  const searchParams = useSearchParams();
  const { user, profile, role } = useAuth();
  const { copy } = useLocale();
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(searchParams.get("departmentId") || "");
  const [pendingDepartmentId, setPendingDepartmentId] = useState("");
  const [department, setDepartment] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const canBrowseAnyDepartment = canBrowseAllDepartments(role);

  const activeDepartmentId = resolveScopedDepartmentId({
    role,
    profileDepartmentId: profile?.departmentId || pendingDepartmentId,
    preferredDepartmentId: selectedDepartmentId,
  });

  useEffect(() => {
    if (!selectedDepartmentId && canBrowseAnyDepartment) {
      setSelectedDepartmentId(searchParams.get("departmentId") || DEPARTMENT_OPTIONS[0]?.id || "");
    }
  }, [canBrowseAnyDepartment, searchParams, selectedDepartmentId]);

  useEffect(() => {
    if (activeDepartmentId) {
      const seo = DEPARTMENT_SEO[activeDepartmentId];
      if (seo) {
        document.title = window.localStorage.getItem("lang") === "bn" ? seo.titleBn : seo.titleEn;
        const descMeta = document.querySelector('meta[name="description"]');
        if (descMeta) {
          descMeta.content = window.localStorage.getItem("lang") === "bn" ? seo.descBn : seo.descEn;
        }
      }
    }
  }, [activeDepartmentId]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!activeDepartmentId) {
        if (!active) return;
        setLoading(false);
        return;
      }

      setLoading(true);
      setMessage("");

      const tasks = [
        fetchDepartmentDetail(activeDepartmentId),
        fetchDepartmentCourses(activeDepartmentId),
        fetchDepartmentAnnouncements(activeDepartmentId),
      ];

      if (canBrowseAnyDepartment) {
        tasks.push(fetchDepartments());
      }

      const [departmentResult, courseResult, announcementResult, directoryResult] = await Promise.allSettled(tasks);
      if (!active) return;

      const fallbackDepartment = getDepartmentMeta(activeDepartmentId);
      const departmentDoc =
        departmentResult.status === "fulfilled" && departmentResult.value
          ? departmentResult.value
          : fallbackDepartment
            ? {
                id: fallbackDepartment.id,
                name: fallbackDepartment.title,
                parentDepartmentId: fallbackDepartment.parentDepartmentId,
                memberCount: 0,
                courseCount: 0,
                headUserId: "",
                mentorIds: [],
              }
            : null;

      setDepartment(departmentDoc);
      setCourses(courseResult.status === "fulfilled" ? courseResult.value : []);
      setAnnouncements(announcementResult.status === "fulfilled" ? announcementResult.value : []);
      setDepartments(directoryResult?.status === "fulfilled" ? directoryResult.value : []);

      if (departmentResult.status === "rejected" || courseResult.status === "rejected" || announcementResult.status === "rejected") {
        setMessage(copy("Some department data could not be loaded right now.", "কিছু department data এই মুহূর্তে লোড করা যায়নি।"));
      }

      setLoading(false);
    };

    load().catch(() => {
      if (!active) return;
      setMessage(copy("Department overview is temporarily unavailable.", "Department overview সাময়িকভাবে unavailable।"));
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [activeDepartmentId, canBrowseAnyDepartment, copy]);

  const parentTitle = useMemo(() => {
    const parentId = department?.parentDepartmentId || getDepartmentMeta(activeDepartmentId)?.parentDepartmentId;
    return getParentTitle(parentId);
  }, [activeDepartmentId, department?.parentDepartmentId]);

  if (!activeDepartmentId) {
    return (
      <DepartmentActivationPanel
        user={user}
        profile={profile}
        copy={copy}
        title={copy("Open your department workspace", "আপনার department workspace খুলুন")}
        description={copy(
          "The department page should not be a dead end. Choose your department here and this workspace will open immediately.",
          "Department page যেন dead end না হয়। এখানেই department বেছে নিন, আর এই workspace সঙ্গে সঙ্গে খুলে যাবে।",
        )}
        onSaved={(nextDepartmentId) => {
          setPendingDepartmentId(nextDepartmentId);
          setSelectedDepartmentId(nextDepartmentId);
        }}
      />
    );
  }

  return (
    <div className="workspace-stack">
      <WorkspacePageHeader
        badge={copy("Department workspace", "ডিপার্টমেন্ট ওয়ার্কস্পেস")}
        title={getDepartmentTitle(activeDepartmentId)}
        description={copy(
          `Parent group: ${parentTitle}. This page tracks the curriculum, staffing summary, and announcement board for the selected department.`,
          `Parent group: ${parentTitle}। এই page-এ নির্বাচিত department-এর curriculum, staffing summary, এবং announcement board দেখা যায়।`,
        )}
        stats={[
          {
            label: copy("Members", "মেম্বার"),
            value: loading ? "..." : department?.memberCount || 0,
            note: copy("Mapped to this department right now.", "এই department-এ বর্তমানে mapped আছে।"),
          },
          {
            label: copy("Courses", "কোর্স"),
            value: loading ? "..." : department?.courseCount || courses.length || 0,
            note: copy("Visible curriculum items in scope.", "বর্তমান scope-এর visible curriculum item।"),
          },
          {
            label: copy("Mentors", "মেন্টর"),
            value: loading ? "..." : department?.mentorIds?.length || 0,
            note: copy("Assigned reviewers and learning support.", "Assigned reviewer এবং learning support।"),
          },
        ]}
        actions={canBrowseAnyDepartment ? (
          <div className="workspace-pane p-4">
            <div className="space-y-2">
              <Label htmlFor="department-scope">{copy("Department scope", "ডিপার্টমেন্ট স্কোপ")}</Label>
              <Select value={activeDepartmentId} onValueChange={setSelectedDepartmentId}>
                <SelectTrigger id="department-scope">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENT_OPTIONS.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : null}
      >
        {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
        {!loading && !department ? (
          <p className="workspace-empty-state text-sm">{copy("This department does not have a live overview yet.", "এই department-এর live overview এখনও নেই।")}</p>
        ) : null}
      </WorkspacePageHeader>

      {canBrowseAnyDepartment && departments.length ? (
        <Card className="bg-card/80 backdrop-blur-xl border shadow-xl rounded-[2rem]" data-reveal="up">
          <CardHeader>
            <CardTitle>{copy("All departments", "সব ডিপার্টমেন্ট")}</CardTitle>
            <CardDescription>
              {copy("Use this directory to jump across the platform.", "প্ল্যাটফর্মে দ্রুত যেতে এই directory ব্যবহার করুন।")}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {departments.map((item) => (
              <div key={item.id} className="workspace-pane hover-lift p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold">{item.name || getDepartmentTitle(item.id)}</h3>
                  <Badge variant="outline">{item.memberCount || 0}</Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {sanitizeAssignedResourceText(item.description || "Department workspace")}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedDepartmentId(item.id)}>
                    {copy("View", "দেখুন")}
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/courses?departmentId=${item.id}`}>
                      {copy("Courses", "কোর্স")}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {activeDepartmentId === "baagile" && (
        <div className="mb-6" data-reveal="up">
          <BABookCard />
        </div>
      )}

      {(() => {
        const mappedId = DEPT_ID_MAPPING[activeDepartmentId];
        const deptData = DEPARTMENTS.flatMap((d) => d.subdepartments).find((sd) => sd.id === mappedId);
        if (!deptData || !deptData.skills) return null;

        return (
          <Card className="bg-card/80 backdrop-blur-xl border shadow-xl rounded-[2rem] mb-6" data-reveal="up">
            <CardHeader>
              <CardTitle>{copy("Curriculum & Tech Stack", "কারিকুলাম এবং টেক স্ট্যাক")}</CardTitle>
              <CardDescription>
                {copy(
                  "Core technologies and specialized skills required for this department.",
                  "এই ডিপার্টমেন্টের জন্য প্রয়োজনীয় মূল প্রযুক্তি এবং বিশেষ দক্ষতা।",
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {deptData.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="rounded-full bg-primary/5 border-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })()}

      <Card className="glass-elite border-primary/20 shadow-2xl rounded-[3rem] mb-10 overflow-hidden" data-reveal="up">
        <CardHeader className="text-center pb-8 pt-10">
          <Badge className="w-fit mx-auto mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
            {copy("Interactive Learning Path", "ইন্টারঅ্যাক্টিভ লার্নিং পাথ")}
          </Badge>
          <CardTitle className="text-3xl font-black tracking-tight">{copy("Skill Tree Roadmap", "স্কিল ট্রি রোডম্যাপ")}</CardTitle>
          <CardDescription className="max-w-2xl mx-auto mt-3 text-base">
            {copy(
              "Navigate your professional growth journey. Each node represents a critical milestone in your craft.",
              "আপনার পেশাগত উন্নতির পথ। প্রতিটি নোড আপনার কাজের একটি গুরুত্বপূর্ণ মাইলস্টোন।"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-12 pt-4">
          <div className="relative flex flex-col items-center gap-12">
            {/* Connection Line */}
            <div className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-primary/40 via-secondary/30 to-primary/5 rounded-full left-1/2 -translate-x-1/2" />
            
            {courses.length ? courses.map((course, idx) => (
              <div 
                key={course.id} 
                className={cn(
                  "relative z-10 flex w-full max-w-4xl items-center gap-8",
                  idx % 2 === 0 ? "flex-row" : "flex-row-reverse"
                )}
              >
                {/* Node Label Card */}
                <div className={cn(
                  "w-1/2 p-1",
                  idx % 2 === 0 ? "text-right" : "text-left"
                )}>
                  <div className="glass-premium hover-lift p-5 rounded-[2rem] border-primary/10 group">
                    <h3 className="text-lg font-black group-hover:text-primary transition-colors">{course.title}</h3>
                    <p className="mt-2 text-xs line-clamp-2 text-muted-foreground leading-relaxed">{getCoursePreviewDescription(course)}</p>
                    <div className={cn(
                      "mt-4 flex flex-wrap gap-2",
                      idx % 2 === 0 ? "justify-end" : "justify-start"
                    )}>
                      <Badge variant="outline" className="bg-background/50 text-[9px] uppercase tracking-widest font-bold">
                        {course.lessonCount || 0} Lessons
                      </Badge>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] font-bold group-hover:bg-primary/10" asChild>
                        <Link href={`/lesson?courseId=${course.id}`}>
                          {copy("Start", "শুরু")} <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* The Central Node Circle */}
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-background bg-primary shadow-glow text-primary-foreground font-black text-xl">
                  {idx + 1}
                  {/* Branching decoration */}
                  <div className={cn(
                    "absolute top-1/2 h-1 w-8 bg-primary/20 -z-10",
                    idx % 2 === 0 ? "right-full" : "left-full"
                  )} />
                </div>

                {/* Empty space for the other side */}
                <div className="w-1/2" />
              </div>
            )) : (
              <EmptyStateCard
                icon={BookOpenCheck}
                className="max-w-md"
                title={copy("Map is being drafted", "ম্যাপ তৈরি হচ্ছে")}
                description={copy("The curriculum for this path is under review.", "এই পাথের কারিকুলাম রিভিউ করা হচ্ছে।")}
              />
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="bg-card/80 backdrop-blur-xl border shadow-xl rounded-[2rem]" data-reveal="up">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>{copy("Published curriculum", "পাবলিশড কারিকুলাম")}</CardTitle>
              <CardDescription>{copy("Courses currently active in this department.", "এই department-এর active courses।")}</CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link href={`/courses?departmentId=${activeDepartmentId}`}>{copy("Open courses", "কোর্স খুলুন")}</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {courses.length ? (
              courses.map((course) => (
                <div key={course.id} className="workspace-pane hover-lift p-4">
                  <h3 className="font-semibold">{course.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{getCoursePreviewDescription(course)}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {course.lessonCount || 0} lessons / {course.estimatedHours || 0} hours
                  </p>
                </div>
              ))
            ) : (
              <EmptyStateCard
                icon={BookOpenCheck}
                title={copy("No courses published yet", "এখনও কোনো course publish হয়নি")}
                description={copy(
                  "This department is ready, but the curriculum has not been published yet. Check back soon or contact support if you need guidance.",
                  "এই department প্রস্তুত, কিন্তু curriculum এখনও publish হয়নি। পরে আবার দেখুন অথবা guidance লাগলে support-এ যোগাযোগ করুন।",
                )}
                action={
                  <Button variant="outline" asChild>
                    <Link href="/manual">{copy("Open LMS manual", "LMS manual খুলুন")}</Link>
                  </Button>
                }
              />
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-xl border shadow-xl rounded-[2rem]" data-reveal="up">
          <CardHeader>
            <CardTitle>{copy("Announcement board", "ঘোষণা বোর্ড")}</CardTitle>
            <CardDescription>
              {copy("Global and department-scoped updates for this workspace.", "এই workspace-এর global এবং department-scoped updates।")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {announcements.length ? (
              announcements.map((item) => (
                <div key={item.id} className="workspace-pane hover-lift p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold">{item.title}</h3>
                    <Badge variant="subtle">{item.scope}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
                </div>
              ))
            ) : (
              <EmptyStateCard
                icon={Megaphone}
                title={copy("No department announcements yet", "এখনও কোনো department announcement নেই")}
                description={copy(
                  "Important notices will appear here once the team publishes department-specific updates.",
                  "Team department-specific update publish করলে গুরুত্বপূর্ণ notice এখানে দেখাবে।",
                )}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
