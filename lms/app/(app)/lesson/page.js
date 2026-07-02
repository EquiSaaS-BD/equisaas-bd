"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Copy, ExternalLink, Link2 } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { DepartmentActivationPanel } from "@/components/layout/department-activation-panel";
import { WorkspaceBreadcrumbs } from "@/components/layout/workspace-breadcrumbs";
import { WorkspaceNextAction } from "@/components/layout/workspace-next-action";
import { AiLessonAssistant } from "@/components/task/ai-lesson-assistant";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/firebase/client";
import {
  DEPARTMENT_OPTIONS,
  canBrowseAllDepartments,
  getCredentialTypeLabel,
  getDepartmentTitle,
  resolveScopedDepartmentId,
  sanitizeAssignedResourceText,
} from "@/lib/catalog";
import { fetchCourseLessons, fetchDepartmentCourses, fetchLesson, fetchTask, saveLessonProgress } from "@/lib/firestore/lms";
import { CATALOG_LESSON_LOOKUP } from "@/lib/resource-catalog";

export default function LessonPage() {
  const searchParams = useSearchParams();
  const { user, profile, role } = useAuth();
  const { copy } = useLocale();
  const initialDepartmentId = searchParams.get("departmentId") || "";
  const initialCourseId = searchParams.get("courseId") || "";
  const initialLessonId = searchParams.get("lessonId") || "";

  const [selectedDepartmentId, setSelectedDepartmentId] = useState(initialDepartmentId);
  const [pendingDepartmentId, setPendingDepartmentId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId);
  const [selectedLessonId, setSelectedLessonId] = useState(initialLessonId);
  const [courses, setCourses] = useState([]);
  const [courseLessons, setCourseLessons] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [task, setTask] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState(null);
  const [courseLessonsError, setCourseLessonsError] = useState("");
  const [progressSaving, setProgressSaving] = useState(false);

  const canBrowseAnyDepartment = canBrowseAllDepartments(role);
  const activeDepartmentId = resolveScopedDepartmentId({
    role,
    profileDepartmentId: profile?.departmentId || pendingDepartmentId,
    preferredDepartmentId: selectedDepartmentId,
  });

  useEffect(() => {
    if (!selectedDepartmentId && canBrowseAnyDepartment) {
      setSelectedDepartmentId(initialDepartmentId || DEPARTMENT_OPTIONS[0]?.id || "");
    }
  }, [canBrowseAnyDepartment, initialDepartmentId, selectedDepartmentId]);

  useEffect(() => {
    let active = true;

    const loadCourses = async () => {
      if (!activeDepartmentId) return;
      const nextCourses = await fetchDepartmentCourses(activeDepartmentId);
      if (!active) return;

      setCourses(nextCourses);
      setSelectedCourseId((current) => {
        if (current && nextCourses.some((item) => item.id === current)) return current;
        return initialCourseId && nextCourses.some((item) => item.id === initialCourseId)
          ? initialCourseId
          : nextCourses[0]?.id || "";
      });
    };

    loadCourses().catch(() => {
      if (!active) return;
      setCourses([]);
      setSelectedCourseId("");
    });

    return () => {
      active = false;
    };
  }, [activeDepartmentId, initialCourseId]);

  useEffect(() => {
    let active = true;

    const loadLessons = async () => {
      if (!selectedCourseId) {
        if (!active) return;
        setCourseLessons([]);
        setSelectedLessonId("");
        setCourseLessonsError("");
        return;
      }
      setCourseLessonsError("");
      const nextLessons = await fetchCourseLessons(selectedCourseId, activeDepartmentId);
      if (!active) return;

      setCourseLessons(nextLessons);
      setSelectedLessonId((current) => {
        if (current && nextLessons.some((item) => item.id === current)) return current;
        return initialLessonId && nextLessons.some((item) => item.id === initialLessonId)
          ? initialLessonId
          : nextLessons[0]?.id || "";
      });
    };

    loadLessons().catch(() => {
      if (!active) return;
      setCourseLessons([]);
      setSelectedLessonId("");
      setCourseLessonsError(
        copy(
          "Lessons could not be loaded right now. Please refresh once and try again.",
          "এখন lesson load করা যায়নি। একবার refresh করে আবার চেষ্টা করুন।",
        ),
      );
    });

    return () => {
      active = false;
    };
  }, [activeDepartmentId, copy, initialLessonId, selectedCourseId]);

  useEffect(() => {
    let active = true;

    const loadLesson = async () => {
      if (!selectedLessonId) {
        if (active) setLoading(false);
        return;
      }

      setLoading(true);
      const lessonDoc = await fetchLesson(selectedLessonId);
      if (!active) return;

      setLesson(lessonDoc);
      setTask(lessonDoc?.taskId ? await fetchTask(lessonDoc.taskId) : null);
      setLoading(false);
    };

    loadLesson().catch(() => {
      if (!active) return;
      setLesson(null);
      setTask(null);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [selectedLessonId]);

  useEffect(() => {
    if (!user?.uid || !selectedCourseId || !selectedLessonId) return;

    getDoc(doc(db, "users", user.uid, "progress", selectedCourseId))
      .then((snap) => {
        if (!snap.exists()) {
          setCompleted(false);
          return;
        }
        setCompleted((snap.data().completedLessonIds || []).includes(selectedLessonId));
      })
      .catch(() => setCompleted(false));
  }, [selectedCourseId, selectedLessonId, user?.uid]);

  const selectedCourse = useMemo(
    () => courses.find((item) => item.id === selectedCourseId) || null,
    [courses, selectedCourseId],
  );

  const catalogLesson = selectedLessonId ? CATALOG_LESSON_LOOKUP[selectedLessonId] || null : null;
  const activeLesson = useMemo(() => {
    if (!lesson && !catalogLesson) return null;
    return {
      ...catalogLesson,
      ...lesson,
      preferredUrl: lesson?.preferredUrl || catalogLesson?.preferredUrl || "",
      originalExternalUrl: lesson?.originalExternalUrl || catalogLesson?.externalUrl || "",
      accessNote: lesson?.accessNote || catalogLesson?.accessNote || "",
    };
  }, [catalogLesson, lesson]);

  const openUrl = activeLesson?.preferredUrl || activeLesson?.externalUrl || "";
  const originalUrl = activeLesson?.originalExternalUrl || "";
  const hasAlternateOriginalUrl = Boolean(openUrl && originalUrl && openUrl !== originalUrl);

  const handleOpenResource = (url, successText) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
    setActionMessage({
      type: "success",
      text: successText,
    });
  };

  const handleCopyLink = async () => {
    if (!openUrl) return;
    try {
      await navigator.clipboard.writeText(openUrl);
      setActionMessage({
        type: "success",
        text: copy(
          "The verified resource link has been copied. You can paste it into a fresh tab if the provider blocks direct opening.",
          "Verified resource link copy হয়েছে। Provider direct opening block করলে fresh tab-এ paste করতে পারবেন।",
        ),
      });
    } catch {
      setActionMessage({
        type: "error",
        text: copy("Copying the resource link failed on this device.", "এই ডিভাইসে resource link copy করা যায়নি।"),
      });
    }
  };

  const lessonTrail = [
    { href: "/dashboard", en: "Dashboard", bn: "ড্যাশবোর্ড" },
    { href: "/courses", en: "Courses", bn: "কোর্স" },
    selectedCourse
      ? { href: `/courses?departmentId=${activeDepartmentId}&courseId=${selectedCourse.id}`, en: selectedCourse.title, bn: selectedCourse.title }
      : { href: "/lesson", en: "Lessons", bn: "লেসন" },
    {
      href: null,
      en: activeLesson?.title ? sanitizeAssignedResourceText(activeLesson.title) : "Lessons",
      bn: activeLesson?.title ? sanitizeAssignedResourceText(activeLesson.title) : "লেসন",
    },
  ];

  if (!activeDepartmentId) {
    return (
      <div className="workspace-stack">
        <WorkspaceBreadcrumbs items={lessonTrail} />
        <DepartmentActivationPanel
          user={user}
          profile={profile}
          copy={copy}
          title={copy("Open your lesson browser", "আপনার lesson browser খুলুন")}
          description={copy(
            "Choose your department here and this lesson page will immediately load the correct course and lesson flow.",
            "এখানেই department বেছে নিন, আর এই lesson page সঠিক course ও lesson flow সঙ্গে সঙ্গে লোড করবে।",
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
    <div className="grid gap-6 lg:grid-cols-[0.96fr_1.04fr]">
      <div className="col-span-full">
        <WorkspaceBreadcrumbs items={lessonTrail} />
      </div>
      <div className="col-span-full">
        <div className="group workspace-hero relative overflow-hidden rounded-[2.5rem] border bg-gradient-to-br from-primary/10 via-background to-background p-1 shadow-2xl backdrop-blur-xl" data-reveal="up">
          <div className="relative flex flex-col items-center justify-between gap-6 rounded-[2.4rem] bg-background/40 p-6 md:flex-row md:items-center xl:p-8">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/80">
                  {copy("Strategic Next Step", "পরবর্তী পদক্ষেপ")}
                </span>
              </div>
              <p className="max-w-3xl text-sm leading-7 text-muted-foreground/90 md:text-base">
                {activeLesson
                  ? copy(
                      "Open the verified resource, complete the work, then return here to mark progress.",
                      "রিসোর্সটি খুলুন, কাজ শেষ করুন, তারপর প্রগ্রেস মার্ক করতে এখানে ফিরুন।"
                    )
                  : copy(
                      "Choose a lesson from the left to open verified links and specific proof tasks.",
                      "verified লিঙ্ক এবং প্রুফ টাস্ক খুলতে বাম থেকে একটি লেসন বেছে নিন।"
                    )}
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:w-auto">
              {openUrl && (
                <Button
                  size="lg"
                  className="rounded-2xl shadow-lg transition-all hover:-translate-y-1 hover:shadow-primary/20"
                  onClick={() =>
                    handleOpenResource(
                      openUrl,
                      copy(
                        "The verified lesson resource has been opened in a new tab.",
                        "Verified lesson resource নতুন tab-এ খোলা হয়েছে।"
                      )
                    )
                  }
                >
                  <ExternalLink className="h-4 w-4" />
                  {copy("Open resource", "রিসোর্স খুলুন")}
                </Button>
              )}
              {task ? (
                <Button variant="outline" size="lg" className="rounded-2xl bg-background/50 backdrop-blur-sm" asChild>
                  <Link href={`/task?departmentId=${activeDepartmentId}&taskId=${task.id}`}>
                    {copy("Go to proof task", "প্রুফ টাস্ক-এ যান")}
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" size="lg" className="rounded-2xl bg-background/50 backdrop-blur-sm" asChild>
                  <Link href="/manual">{copy("Open manual", "ম্যানুয়াল খুলুন")}</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Card className="bg-card/80 backdrop-blur-xl border shadow-xl rounded-[2rem]" data-reveal="up">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Badge variant="subtle" className="rounded-full px-4 py-1.5 text-sm">
                {copy("Lesson workspace", "লেসন ওয়ার্কস্পেস")}
              </Badge>
              <CardTitle className="mt-4 text-3xl">{getDepartmentTitle(activeDepartmentId)}</CardTitle>
              <CardDescription className="mt-2 max-w-3xl text-base leading-7">
                {copy(
                  "Pick a course, choose a lesson, and then open the verified external resource from the right side.",
                  "একটি course বেছে নিন, তারপর lesson select করুন, আর ডান পাশ থেকে verified external resource খুলুন।",
                )}
              </CardDescription>
            </div>

            {canBrowseAnyDepartment ? (
              <div className="w-full max-w-xs space-y-2">
                <Label htmlFor="lesson-department">{copy("Department scope", "ডিপার্টমেন্ট scope")}</Label>
                <Select value={activeDepartmentId} onValueChange={setSelectedDepartmentId}>
                  <SelectTrigger id="lesson-department">
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
            ) : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="lesson-course">{copy("Course", "কোর্স")}</Label>
              <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                <SelectTrigger id="lesson-course">
                  <SelectValue placeholder={copy("Select a course", "একটি course বেছে নিন")} />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lesson-item">{copy("Lesson", "লেসন")}</Label>
              <Select value={selectedLessonId} onValueChange={setSelectedLessonId}>
                <SelectTrigger id="lesson-item">
                  <SelectValue placeholder={copy("Select a lesson", "একটি lesson বেছে নিন")} />
                </SelectTrigger>
                <SelectContent>
                  {courseLessons.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {sanitizeAssignedResourceText(item.title)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-3">
            {courseLessonsError ? (
              <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                {courseLessonsError}
              </div>
            ) : null}
            {courseLessons.map((item) => (
              <button
                key={item.id}
                className={`group relative w-full rounded-[2rem] border p-5 text-left transition-all duration-300 ${
                  selectedLessonId === item.id 
                    ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary/20" 
                    : "bg-background/80 hover:border-primary/40 hover:bg-muted/30"
                }`}
                type="button"
                onClick={() => {
                  setSelectedLessonId(item.id);
                  setActionMessage(null);
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className={`font-semibold transition-colors ${selectedLessonId === item.id ? "text-primary" : "text-foreground group-hover:text-primary"}`}>
                    {sanitizeAssignedResourceText(item.title)}
                  </h3>
                  <div className={`h-2 w-2 rounded-full transition-all ${selectedLessonId === item.id ? "bg-primary scale-125" : "bg-muted group-hover:bg-primary/50"}`} />
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground line-clamp-2">{sanitizeAssignedResourceText(item.summary)}</p>
              </button>
            ))}
          </div>
        </CardHeader>
      </Card>

      <Card className="bg-card/80 backdrop-blur-xl border shadow-xl rounded-[2rem]" data-reveal="up">
        <CardHeader>
          <CardTitle>{activeLesson?.title ? sanitizeAssignedResourceText(activeLesson.title) : copy("Lesson details", "লেসন ডিটেইলস")}</CardTitle>
          <CardDescription>
            {activeLesson
              ? copy(
                  "Open the resource in a fresh tab, complete the work there, then come back here to mark progress or go to the proof task.",
                  "Resource fresh tab-এ খুলুন, কাজটি সেখানে complete করুন, তারপর progress mark করতে বা proof task-এ যেতে আবার এখানে ফিরুন।",
                )
              : copy("Choose a lesson from the left to continue.", "চালিয়ে যেতে বাম দিক থেকে একটি lesson বেছে নিন।")}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {loading ? (
            <div
              className="space-y-4"
              aria-busy="true"
              aria-label={copy("Loading lesson details", "লেসনের বিস্তারিত লোড হচ্ছে")}
            >
              <Skeleton className="h-5 w-2/3 max-w-md" />
              <Skeleton className="h-5 w-1/2 max-w-sm" />
              <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-24 rounded-3xl" />
                <Skeleton className="h-24 rounded-3xl" />
              </div>
              <Skeleton className="min-h-[120px] w-full rounded-3xl" />
            </div>
          ) : activeLesson ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border bg-background/80 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{copy("Course", "কোর্স")}</p>
                  <p className="mt-2 font-semibold">{selectedCourse?.title || activeLesson.courseId || "-"}</p>
                </div>
                <div className="rounded-3xl border bg-background/80 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{copy("Provider", "প্রোভাইডার")}</p>
                  <p className="mt-2 font-semibold">{activeLesson.providerName || copy("External resource", "External resource")}</p>
                </div>
                <div className="rounded-3xl border bg-background/80 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{copy("Estimated hours", "আনুমানিক সময়")}</p>
                  <p className="mt-2 font-semibold">{activeLesson.estimatedHours || 0}</p>
                </div>
                <div className="rounded-3xl border bg-background/80 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{copy("Credential type", "ক্রেডেনশিয়াল টাইপ")}</p>
                  <p className="mt-2 font-semibold">{getCredentialTypeLabel(activeLesson.credentialType)}</p>
                </div>
              </div>

              <div className="rounded-3xl border bg-background/80 p-5">
                <p className="text-sm leading-7 text-muted-foreground">
                  {sanitizeAssignedResourceText(activeLesson.readingContent || activeLesson.summary)}
                </p>
              </div>

              <div className="rounded-3xl border bg-background/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{copy("Access note", "Access note")}</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {activeLesson.accessNote ||
                    copy(
                      "This resource opens on the provider site. Some providers may ask you to log in before showing progress or certificates.",
                      "এই resource provider site-এ খুলবে। কিছু provider progress বা certificate দেখানোর আগে login চাইতে পারে।",
                    )}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {openUrl ? (
                  <Button
                    onClick={() =>
                      handleOpenResource(
                        openUrl,
                        copy(
                          "The verified lesson resource has been opened in a new tab.",
                          "Verified lesson resource নতুন tab-এ খোলা হয়েছে।",
                        ),
                      )
                    }
                  >
                    <ExternalLink className="h-4 w-4" />
                    {copy("Open verified resource", "Verified resource খুলুন")}
                  </Button>
                ) : null}

                {hasAlternateOriginalUrl ? (
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleOpenResource(
                        originalUrl,
                        copy("The original provider link has been opened in a new tab.", "Original provider link নতুন tab-এ খোলা হয়েছে।"),
                      )
                    }
                  >
                    <Link2 className="h-4 w-4" />
                    {copy("Open original link", "Original link খুলুন")}
                  </Button>
                ) : null}

                {openUrl ? (
                  <Button variant="outline" onClick={handleCopyLink}>
                    <Copy className="h-4 w-4" />
                    {copy("Copy resource link", "Resource link copy করুন")}
                  </Button>
                ) : null}

                {task ? (
                  <Button variant="outline" asChild>
                    <Link href={`/task?departmentId=${activeDepartmentId}&taskId=${task.id}`}>
                      {copy("Open proof task", "Proof task খুলুন")}
                    </Link>
                  </Button>
                ) : null}
              </div>

              {profile?.departmentId ? (
                <div className="rounded-3xl border bg-background/80 p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-semibold">{copy("Progress marker", "Progress marker")}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {copy(
                          "Use this after you have genuinely completed the resource so your course progress stays accurate.",
                          "Resource সত্যি complete করার পরই এটা ব্যবহার করুন, যাতে course progress ঠিক থাকে।",
                        )}
                      </p>
                    </div>
                    <Button
                      variant={completed ? "secondary" : "outline"}
                      disabled={progressSaving}
                      onClick={async () => {
                        const next = !completed;
                        setCompleted(next);
                        setProgressSaving(true);
                        try {
                          await saveLessonProgress({
                            uid: user.uid,
                            courseId: selectedCourseId,
                            lessonId: selectedLessonId,
                            completed: next,
                          });
                          setActionMessage({
                            type: "success",
                            text: next
                              ? copy("Lesson marked complete.", "Lesson complete হিসেবে mark করা হয়েছে।")
                              : copy("Lesson marked incomplete.", "Lesson incomplete হিসেবে mark করা হয়েছে।"),
                          });
                        } catch (error) {
                          setCompleted(!next);
                          setActionMessage({
                            type: "error",
                            text:
                              error?.message ||
                              copy(
                                "Progress could not be updated right now. Please try again.",
                                "এখন progress update করা যায়নি। আবার চেষ্টা করুন।",
                              ),
                          });
                        } finally {
                          setProgressSaving(false);
                        }
                      }}
                    >
                      {progressSaving
                        ? copy("Saving progress...", "Progress সংরক্ষণ হচ্ছে...")
                        : completed
                          ? copy("Mark incomplete", "Incomplete করুন")
                          : copy("Mark complete", "Complete করুন")}
                    </Button>
                  </div>
                </div>
              ) : null}

              {actionMessage ? (
                <Alert variant={actionMessage.type === "error" ? "destructive" : "default"}>
                  <AlertTitle>
                    {actionMessage.type === "error"
                      ? copy("Action blocked", "Action আটকে গেছে")
                      : copy("Action confirmed", "Action সম্পন্ন হয়েছে")}
                  </AlertTitle>
                  <AlertDescription>{actionMessage.text}</AlertDescription>
                </Alert>
              ) : null}

              {completed ? <Badge variant="success">{copy("Marked complete", "Complete হিসেবে mark করা হয়েছে")}</Badge> : null}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              {copy("Select a lesson from the left to see the resource, access note, and task link.", "Resource, access note, আর task link দেখতে বাম দিক থেকে একটি lesson বেছে নিন।")}
            </p>
          )}
        </CardContent>
      </Card>

      {lesson && (
        <AiLessonAssistant 
          lessonContext={`Lesson: ${lesson.title}. Course: ${courses.find(c => c.id === selectedCourseId)?.title}.`} 
        />
      )}
    </div>
  );
}
