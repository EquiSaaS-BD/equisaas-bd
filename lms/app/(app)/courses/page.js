"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpenCheck, MousePointerClick, Medal } from "lucide-react";
import { DepartmentActivationPanel } from "@/components/layout/department-activation-panel";
import { WorkspaceBreadcrumbs } from "@/components/layout/workspace-breadcrumbs";
import { WorkspacePageHeader } from "@/components/layout/workspace-page-header";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyStateCard } from "@/components/ui/empty-state-card";
import {
  DEPARTMENT_OPTIONS,
  canBrowseAllDepartments,
  getCredentialTypeLabel,
  getCoursePreviewDescription,
  getDepartmentTitle,
  resolveScopedDepartmentId,
  sanitizeAssignedResourceText,
} from "@/lib/catalog";
import { fetchCourseLessons, fetchDepartmentCourses } from "@/lib/firestore/lms";
import { statusLabel, statusVariant } from "@/lib/display";

export default function CoursesPage() {
  const searchParams = useSearchParams();
  const { user, profile, role } = useAuth();
  const { copy } = useLocale();
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(searchParams.get("departmentId") || "");
  const [pendingDepartmentId, setPendingDepartmentId] = useState("");
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [lessons, setLessons] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [lessonsError, setLessonsError] = useState("");
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
    let active = true;

    const load = async () => {
      if (!activeDepartmentId) {
        if (!active) return;
        setLoadingCourses(false);
        return;
      }

      setLoadingCourses(true);
      const items = await fetchDepartmentCourses(activeDepartmentId);
      if (!active) return;
      setCourses(items);
      setSelectedCourseId((current) => {
        if (current && items.some((item) => item.id === current)) {
          return current;
        }
        return items[0]?.id || "";
      });
      setLoadingCourses(false);
    };

    load().catch(() => {
      if (!active) return;
      setCourses([]);
      setSelectedCourseId("");
      setLoadingCourses(false);
    });

    return () => {
      active = false;
    };
  }, [activeDepartmentId]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!selectedCourseId) {
        if (!active) return;
        setLessons([]);
        setLoadingLessons(false);
        setLessonsError("");
        return;
      }

      setLoadingLessons(true);
      setLessonsError("");
      const nextLessons = await fetchCourseLessons(selectedCourseId, activeDepartmentId);
      if (!active) return;
      setLessons(nextLessons);
      setLoadingLessons(false);
    };

    load().catch(() => {
      if (!active) return;
      setLessons([]);
      setLoadingLessons(false);
      setLessonsError(
        copy(
          "Lessons could not be loaded right now. Please refresh once and try again.",
          "এখন lesson load করা যায়নি। একবার refresh করে আবার চেষ্টা করুন।",
        ),
      );
    });

    return () => {
      active = false;
    };
  }, [activeDepartmentId, copy, selectedCourseId]);

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === selectedCourseId) || null,
    [courses, selectedCourseId],
  );

  const coursesTrail = [
    { href: "/dashboard", en: "Dashboard", bn: "ড্যাশবোর্ড" },
    { href: null, en: "Courses", bn: "কোর্স" },
  ];

  if (!activeDepartmentId) {
    return (
      <div className="workspace-stack">
        <WorkspaceBreadcrumbs items={coursesTrail} />
        <DepartmentActivationPanel
          user={user}
          profile={profile}
          copy={copy}
          title={copy("Open your course path", "আপনার course path খুলুন")}
          description={copy(
            "Choose your department from here and the correct published course list will load immediately.",
            "এখান থেকেই department বেছে নিন, আর সঠিক published course list সঙ্গে সঙ্গে লোড হবে।",
          )}
          onSaved={(nextDepartmentId) => {
            setPendingDepartmentId(nextDepartmentId);
            setSelectedDepartmentId(nextDepartmentId);
          }}
        />
      </div>
    );
  }

  return (
    <div className="workspace-stack">
      <div className="col-span-full">
        <WorkspaceBreadcrumbs items={coursesTrail} />
      </div>
      <WorkspacePageHeader
        badge={copy("Courses", "কোর্স")}
        title={getDepartmentTitle(activeDepartmentId)}
        description={copy(
          "Browse the published courses for this department and inspect the exact lesson sequence before you start.",
          "এই department-এর published course দেখুন এবং শুরু করার আগে exact lesson sequence inspect করুন।",
        )}
        stats={[
          {
            label: copy("Published courses", "পাবলিশড কোর্স"),
            value: loadingCourses ? "..." : courses.length,
            note: copy("Active learning paths in scope.", "এই scope-এর active learning path।"),
          },
          {
            label: copy("Visible lessons", "দৃশ্যমান লেসন"),
            value: loadingLessons ? "..." : lessons.length,
            note: copy("Lessons inside the selected course.", "নির্বাচিত course-এর ভেতরের lesson।"),
          },
        ]}
        actions={canBrowseAnyDepartment ? (
          <div className="workspace-pane p-4">
            <div className="space-y-2">
              <Label htmlFor="course-department">{copy("Department scope", "ডিপার্টমেন্ট স্কোপ")}</Label>
              <Select value={activeDepartmentId} onValueChange={setSelectedDepartmentId}>
                <SelectTrigger id="course-department">
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
      />

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <Card className="bg-card/80 backdrop-blur-xl border shadow-xl rounded-[2rem]" data-reveal="up">
        <CardHeader className="space-y-4">
          <div>
            <CardTitle>{copy("Course directory", "কোর্স ডিরেক্টরি")}</CardTitle>
            <CardDescription>{copy("Select one course to inspect its lesson map and open the exact learning sequence.", "একটি course বেছে নিন, lesson map দেখুন, এবং exact learning sequence খুলুন।")}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {loadingCourses ? (
            <div className="space-y-3" aria-busy="true" aria-label={copy("Loading courses", "কোর্স লোড হচ্ছে")}>
              <Skeleton className="h-24 w-full rounded-3xl" />
              <Skeleton className="h-24 w-full rounded-3xl" />
              <Skeleton className="h-24 w-full rounded-3xl" />
            </div>
          ) : courses.length ? (
            courses.map((course) => (
              <button
                key={course.id}
                className={`group relative w-full rounded-[2rem] border p-6 text-left transition-all duration-300 ${
                  selectedCourseId === course.id 
                    ? "border-primary bg-primary/5 shadow-[0_8px_30px_rgb(var(--primary-rgb),0.1)] ring-1 ring-primary/20" 
                    : "bg-background/80 hover-lift hover:border-primary/40 hover:bg-muted/30 hover:shadow-lg"
                }`}
                type="button"
                onClick={() => setSelectedCourseId(course.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold tracking-tight">{course.title}</h3>
                      {course.catalogSource === "legacy_preserved" ? (
                        <Badge variant="secondary" className="bg-muted text-[10px] uppercase tracking-wider">{copy("Legacy", "পুরোনো")}</Badge>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground line-clamp-2">{getCoursePreviewDescription(course)}</p>
                  </div>
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition-colors ${
                    selectedCourseId === course.id ? "bg-primary text-white border-primary" : "bg-muted/50 text-muted-foreground group-hover:border-primary/30 group-hover:text-primary"
                  }`}>
                    <span className="text-sm font-bold">{course.lessonCount || 0}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
                  <span className="flex items-center gap-1.5">
                    <div className="h-1 w-1 rounded-full bg-primary" />
                    {course.lessonCount || 0} {copy("Lessons", "লেসন")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <div className="h-1 w-1 rounded-full bg-primary" />
                    {course.estimatedHours || 0}H
                  </span>
                </div>
              </button>
            ))
          ) : (
            <EmptyStateCard
              icon={BookOpenCheck}
              title={copy("No courses published for this department", "এই department-এর জন্য কোনো course publish হয়নি")}
              description={copy(
                "Once a course is published, it will appear here with the exact lesson sequence and proof tasks.",
                "Course publish হলে exact lesson sequence ও proof task সহ এখানে দেখা যাবে।",
              )}
              action={
                <Button variant="outline" asChild>
                  <Link href="/department">{copy("Choose another department", "অন্য department বেছে নিন")}</Link>
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>

      <Card className="bg-card/80 backdrop-blur-xl border shadow-xl rounded-[2rem]" data-reveal="up">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>{selectedCourse?.title || copy("Course lessons", "কোর্স লেসন")}</CardTitle>
            <CardDescription>
              {copy("Each lesson opens a verified external resource and linked proof task.", "প্রতিটি lesson একটি verified external resource এবং linked proof task খুলে দেয়।")}
            </CardDescription>
            {selectedCourseId && lessons.length > 0 && !loadingLessons ? (
              <div className="mt-6 overflow-hidden rounded-[2rem] border bg-background/50 p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold tracking-tight text-foreground md:text-base">
                      {copy("Goal Progress Active", "লক্ষ্যের খুব কাছাকাছি")}
                    </h4>
                    <p className="mt-1 text-xs text-muted-foreground md:text-sm">
                      {copy(
                        `You are 1 step away from your first milestone. Start the first of ${lessons.length} lessons now!`,
                        `আপনার প্রথম মাইলফলক থেকে মাত্র ১ ধাপ দূরে আছেন! ${lessons.length} টি লেসনের প্রথমটি এখনই শুরু করুন।`
                      )}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Medal className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[15%] rounded-full bg-primary transition-all duration-1000 ease-out" />
                </div>
              </div>
            ) : null}
          </div>
          {selectedCourseId ? (
            <Button variant="outline" asChild>
              <Link href={`/lesson?departmentId=${activeDepartmentId}&courseId=${selectedCourseId}`}>
                {copy("Open lesson browser", "লেসন ব্রাউজার খুলুন")}
              </Link>
            </Button>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-3">
          {loadingLessons ? (
            <div className="space-y-3" aria-busy="true" aria-label={copy("Loading lessons", "লেসন লোড হচ্ছে")}>
              <Skeleton className="h-28 w-full rounded-3xl" />
              <Skeleton className="h-28 w-full rounded-3xl" />
            </div>
          ) : lessonsError ? (
            <p className="text-sm text-destructive">{lessonsError}</p>
          ) : lessons.length ? (
            lessons.map((lesson) => (
              <div key={lesson.id} className="workspace-pane hover-lift p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold">{sanitizeAssignedResourceText(lesson.title)}</h3>
                  <Badge variant={statusVariant(lesson.status)}>{statusLabel(lesson.status)}</Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{sanitizeAssignedResourceText(lesson.summary)}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {lesson.providerName ? <Badge variant="outline">{lesson.providerName}</Badge> : null}
                  {lesson.credentialType ? (
                    <Badge variant="outline">{getCredentialTypeLabel(lesson.credentialType)}</Badge>
                  ) : null}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/lesson?departmentId=${activeDepartmentId}&lessonId=${lesson.id}&courseId=${lesson.courseId}`}>
                      {copy("Open lesson", "লেসন খুলুন")}
                    </Link>
                  </Button>
                  {lesson.taskId ? (
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/task?departmentId=${activeDepartmentId}&taskId=${lesson.taskId}`}>
                        {copy("Open proof task", "প্রুফ টাস্ক খুলুন")}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  ) : null}
                </div>
              </div>
            ))
          ) : (
            <EmptyStateCard
              icon={MousePointerClick}
              title={
                selectedCourseId
                  ? copy("No lessons published yet", "এখনো কোনো lesson publish হয়নি")
                  : copy("Select a course to load lessons", "লেসন লোড করতে একটি course বেছে নিন")
              }
              description={
                selectedCourseId
                  ? copy("The course exists, but its lesson map is not ready for learners yet.", "Course আছে, কিন্তু learner-দের জন্য lesson map এখনও ready নয়।")
                  : copy("Pick a course from the directory and the lesson browser will open here.", "Directory থেকে একটি course বেছে নিলে lesson browser এখানে খুলবে।")
              }
            />
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
