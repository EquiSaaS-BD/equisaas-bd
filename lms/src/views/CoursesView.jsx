import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import { useLms } from "../lms-context";
import { ArrowLeft, CheckCircle2, ChevronDown, ChevronUp, Filter, Search } from "lucide-react";
import { loadInteractiveLesson } from "../data/interactive-courses";

const InteractiveLessonView = lazy(() => import("../components/ui/InteractiveLessonView.jsx"));

const CoursesView = () => {
  const {
    clearCourseLaunchRequest,
    courseLaunchRequest,
    LEVEL_OPTIONS,
    expandedModules,
    filter,
    filteredModules,
    filteredPaths,
    formatMonth,
    getLessonTitle,
    getLessonType,
    getLevelLabel,
    getLocalized,
    getModuleSummary,
    getModuleTitle,
    getOutcomes,
    getPathDesc,
    getPathTitle,
    getPrereq,
    getSubmissionStatus,
    handleDeptSelect,
    handlePathSelect,
    handleSubdeptSelect,
    isAdmin,
    isAssignmentItem,
    lang,
    monthlyActivities,
    openSubmissionModal,
    pathTab,
    progress,
    renderLessonLinks,
    search,
    selectedDept,
    selectedPath,
    selectedSubdept,
    setFilter,
    setPathTab,
    setSearch,
    setShowAuth,
    setShowTrackModal,
    submissionMap,
    text,
    toggleLesson,
    toggleModule,
    user,
    visibleDepartments,
    visibleSubdepartments,
  } = useLms();

  const [activeLesson, setActiveLesson] = useState(null);
  const [loadingLessonId, setLoadingLessonId] = useState("");
  const [lessonError, setLessonError] = useState("");
  const handledCourseLaunchTokenRef = useRef("");
  const pathContentRef = useRef(null);

  const hasTrack = Boolean(selectedDept && selectedSubdept);
  const hasPath = Boolean(selectedPath);

  const buildFallbackLesson = (moduleItem, lesson) => {
    const resources = [
      lesson.videoUrl
        ? {
            labelBn: "ভিডিও খুলুন",
            labelEn: "Open Video",
            url: lesson.videoUrl,
          }
        : null,
      lesson.resourceUrl
        ? {
            labelBn: "রিসোর্স খুলুন",
            labelEn: "Open Resource",
            url: lesson.resourceUrl,
          }
        : null,
    ].filter(Boolean);

    return {
      id: lesson.id,
      titleBn: lesson.titleBn,
      titleEn: lesson.titleEn,
      duration: lesson.duration,
      typeBn: lesson.typeBn,
      typeEn: lesson.typeEn,
      contentBn: `# ${lesson.titleBn || lesson.titleEn}\n\n**মডিউল:** ${getModuleTitle(moduleItem)}\n\n**ধরন:** ${lesson.typeBn || lesson.typeEn || "লেসন"}\n\n**সময়:** ${lesson.duration || "Self-paced"}\n\nএই লেসনের ভিডিও বা রিসোর্স নিচে দেওয়া আছে। খুলে দেখুন, তারপর শেষ হলে complete হিসেবে চিহ্নিত করুন।`,
      contentEn: `# ${lesson.titleEn || lesson.titleBn}\n\n**Module:** ${getModuleTitle(moduleItem)}\n\n**Type:** ${lesson.typeEn || lesson.typeBn || "Lesson"}\n\n**Duration:** ${lesson.duration || "Self-paced"}\n\nThis lesson uses the linked video or resource below. Open it, study it, and then mark the lesson complete when you are done.`,
      resources,
    };
  };

  useEffect(() => {
    setActiveLesson(null);
    setLoadingLessonId("");
    setLessonError("");
  }, [selectedPath?.id]);

  const focusPathContent = () => {
    if (typeof window === "undefined") return;
    window.requestAnimationFrame(() => {
      pathContentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const openLesson = async (moduleItem, lesson) => {
    if (!selectedPath?.id) return;
    setLessonError("");
    setLoadingLessonId(lesson.id);

    try {
      const interactiveLesson = await loadInteractiveLesson(selectedPath.id, moduleItem.id, lesson.id);
      setActiveLesson(
        interactiveLesson
          ? {
              ...interactiveLesson,
              id: lesson.id,
              titleBn: lesson.titleBn,
              titleEn: lesson.titleEn,
              duration: lesson.duration,
              typeBn: lesson.typeBn,
              typeEn: lesson.typeEn,
            }
          : buildFallbackLesson(moduleItem, lesson),
      );
    } catch (error) {
      console.error("Interactive lesson load failed:", error);
      setLessonError(lang === "bn" ? "লেসন লোড করা যায়নি।" : "Could not load this lesson.");
    } finally {
      setLoadingLessonId("");
    }
  };

  const getPrimaryLessonTarget = () => {
    if (!selectedPath?.id) return null;
    const completedLessons = progress[selectedPath.id] || [];

    for (const moduleItem of selectedPath.modules || []) {
      const lessons = moduleItem.lessons || [];
      const nextIncompleteLesson = lessons.find((lesson) => !completedLessons.includes(lesson.id));

      if (nextIncompleteLesson) {
        return { moduleItem, lesson: nextIncompleteLesson };
      }

      if (lessons[0]) {
        return { moduleItem, lesson: lessons[0] };
      }
    }

    return null;
  };

  const handleStartLearning = async () => {
    if (!selectedPath?.id) return;

    setPathTab("content");
    setSearch("");
    setFilter("all");

    const target = getPrimaryLessonTarget();
    if (!target) {
      focusPathContent();
      return;
    }

    if (!expandedModules.includes(target.moduleItem.id)) {
      toggleModule(target.moduleItem.id);
    }

    focusPathContent();
    await openLesson(target.moduleItem, target.lesson);
  };

  const handlePreviewPath = () => {
    if (!selectedPath?.id) return;

    setPathTab("content");
    setSearch("");
    setFilter("all");

    const firstModule = selectedPath.modules?.[0];
    if (firstModule && !expandedModules.includes(firstModule.id)) {
      toggleModule(firstModule.id);
    }

    focusPathContent();
  };

  useEffect(() => {
    if (!courseLaunchRequest?.token) return;
    if (handledCourseLaunchTokenRef.current === courseLaunchRequest.token) return;
    if (!selectedPath?.id || courseLaunchRequest.pathId !== selectedPath.id) return;

    handledCourseLaunchTokenRef.current = courseLaunchRequest.token;

    const runLaunch = async () => {
      if (courseLaunchRequest.mode === "preview-path") {
        handlePreviewPath();
      } else {
        await handleStartLearning();
      }
      clearCourseLaunchRequest?.();
    };

    runLaunch();
  }, [clearCourseLaunchRequest, courseLaunchRequest, selectedPath?.id]);

  const renderDepartmentList = () => (
    <div className="space-y-2">
      {visibleDepartments.map((department) => (
        <button
          key={department.id}
          onClick={() => handleDeptSelect(department.id)}
          className={
            "w-full rounded-2xl border px-3 py-2 text-left transition " +
            (selectedDept?.id === department.id
              ? "border-brand-blue bg-brand-blue/10 text-brand-blue"
              : "border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900")
          }
        >
          <div className="text-sm font-semibold">{getLocalized(department, "title")}</div>
          <div className="text-xs text-slate-500">{getLocalized(department, "desc")}</div>
        </button>
      ))}
    </div>
  );

  const renderSubdepartmentList = () => (
    <div className="space-y-2">
      {visibleSubdepartments.map((subdepartment) => (
        <button
          key={subdepartment.id}
          onClick={() => handleSubdeptSelect(subdepartment.id)}
          className={
            "w-full rounded-2xl border px-3 py-2 text-left transition " +
            (selectedSubdept?.id === subdepartment.id
              ? "border-brand-blue bg-brand-blue/10 text-brand-blue"
              : "border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900")
          }
        >
          <div className="text-sm font-semibold">{getLocalized(subdepartment, "title")}</div>
          <div className="text-xs text-slate-500">{getLocalized(subdepartment, "desc")}</div>
        </button>
      ))}
    </div>
  );

  const renderPathList = () => (
    <div className="space-y-2">
      {filteredPaths.length ? (
        filteredPaths.map((pathItem) => (
          <button
            key={pathItem.id}
            onClick={() => handlePathSelect(pathItem.id)}
            className={
              "w-full rounded-2xl border px-3 py-2 text-left transition " +
              (selectedPath?.id === pathItem.id
                ? "border-brand-blue bg-brand-blue/10 text-brand-blue"
                : "border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900")
            }
          >
            <div className="text-sm font-semibold">{getPathTitle(pathItem)}</div>
            <div className="text-xs text-slate-500">
              {getLevelLabel(pathItem.level)} · {pathItem.duration}
            </div>
          </button>
        ))
      ) : (
        <div className="text-xs text-slate-500">{text.labels.noModules}</div>
      )}
    </div>
  );

  return (
    <section className="surface">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px,1fr]">
        <aside className="space-y-6">
          <div className="panel space-y-3">
            <div className="kicker">{text.labels.yourTrack}</div>
            {hasTrack ? (
              <>
                <div className="text-sm font-semibold">{getLocalized(selectedDept, "title")}</div>
                <div className="text-xs text-slate-500">{getLocalized(selectedSubdept, "title")}</div>
              </>
            ) : (
              <p className="text-sm text-slate-600">{text.labels.chooseTrackDesc}</p>
            )}
            {user && !isAdmin && (
              <button
                onClick={() => setShowTrackModal(true)}
                className="text-xs font-semibold text-brand-blue hover:underline"
              >
                {text.actions.chooseTrack}
              </button>
            )}
          </div>

          <details className="panel lg:hidden" open>
            <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold">
              <span>{text.labels.departments}</span>
              <span className="text-xs text-slate-500">{text.labels.chooseTrackTitle}</span>
            </summary>
            <div className="mt-4 space-y-4">
              <div>
                <div className="kicker">{text.labels.departments}</div>
                <div className="mt-3">{renderDepartmentList()}</div>
              </div>
              <div>
                <div className="kicker">{text.labels.subdepartments}</div>
                <div className="mt-3">{renderSubdepartmentList()}</div>
              </div>
              <div>
                <div className="kicker">{text.labels.paths}</div>
                <div className="mt-3">{renderPathList()}</div>
              </div>
            </div>
          </details>

          <div className="hidden space-y-6 lg:block">
            <div>
              <div className="kicker">{text.labels.departments}</div>
              <div className="mt-3">{renderDepartmentList()}</div>
            </div>
            <div>
              <div className="kicker">{text.labels.subdepartments}</div>
              <div className="mt-3">{renderSubdepartmentList()}</div>
            </div>
            <div>
              <div className="kicker">{text.labels.paths}</div>
              <div className="mt-3">{renderPathList()}</div>
            </div>
          </div>
        </aside>

        <div ref={pathContentRef} className="space-y-6">
          {!hasPath && (
            <div className="panel">
              <div className="kicker">{lang === "bn" ? "লেকচার কোথায় পাবেন" : "How To Find Lectures"}</div>
              <h2 className="section-title mt-2">
                {lang === "bn" ? "ডিপার্টমেন্ট, পাথ, তারপর লেকচার" : "Pick a track, then open any lecture"}
              </h2>
              <p className="section-subtitle mt-2">
                {lang === "bn"
                  ? "১) ডিপার্টমেন্ট বাছুন ২) সাব-ডিপার্টমেন্ট বাছুন ৩) একটি পাথ খুলুন ৪) মডিউল expand করে লেসনে ক্লিক করুন। সব লেকচার Courses & Lectures সেকশনের ভেতরেই আছে।"
                  : "1) Choose a department 2) choose a sub-department 3) open a path 4) expand a module and click any lesson. All lectures live inside Courses & Lectures."}
              </p>
            </div>
          )}

          {hasPath && activeLesson ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500">
              <div className="panel sticky top-4 z-10 flex items-center justify-between border border-slate-200 bg-white/90 shadow-sm backdrop-blur-md">
                <button
                  onClick={() => setActiveLesson(null)}
                  className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-brand-blue/10 hover:text-brand-blue"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {lang === "bn" ? "কোর্সে ফিরে যান" : "Back to Course"}
                </button>
                <div className="hidden text-xl font-black text-slate-900 md:block">
                  {lang === "bn" ? activeLesson.titleBn : activeLesson.titleEn}
                </div>
                <button
                  onClick={() => {
                    toggleLesson(selectedPath.id, activeLesson.id);
                    if (!progress[selectedPath.id]?.includes(activeLesson.id)) {
                      setTimeout(() => setActiveLesson(null), 500);
                    }
                  }}
                  className={
                    "flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-black transition-all " +
                    (progress[selectedPath.id]?.includes(activeLesson.id)
                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                      : "bg-slate-200 text-slate-700 hover:bg-slate-300")
                  }
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {progress[selectedPath.id]?.includes(activeLesson.id)
                    ? lang === "bn"
                      ? "সম্পন্ন হয়েছে"
                      : "Completed"
                    : lang === "bn"
                      ? "চিহ্নিত করুন"
                      : "Mark Complete"}
                </button>
              </div>

              <div className="panel rounded-3xl border border-white/50 bg-white/70 p-6 shadow-xl backdrop-blur-xl md:p-10">
                <Suspense
                  fallback={
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm font-semibold text-slate-600">
                      {lang === "bn" ? "লেকচার লোড হচ্ছে..." : "Loading lesson..."}
                    </div>
                  }
                >
                  <InteractiveLessonView
                    lang={lang}
                    content={lang === "bn" ? activeLesson.contentBn : activeLesson.contentEn}
                    sandpack={activeLesson.sandpack}
                    practice={activeLesson.practice}
                    resources={activeLesson.resources || []}
                  />
                </Suspense>
              </div>
            </div>
          ) : hasPath && (
            <>
              <div className="panel border-brand-blue/15 bg-gradient-to-r from-brand-blue/5 via-white to-emerald-50/80">
                <div className="kicker">{lang === "bn" ? "লেকচার গাইড" : "Lecture Guide"}</div>
                <h3 className="mt-2 text-xl font-black text-slate-900">
                  {lang === "bn" ? "প্রতিটি মডিউলের ভেতরেই লেকচার আছে" : "Every lecture lives inside a module"}
                </h3>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
                  {lang === "bn"
                    ? "নিচের মডিউল খুলুন, তারপর যে কোনো লেসন কার্ডে ক্লিক করুন। ইন্টারঅ্যাকটিভ লেসন হলে সঙ্গে সঙ্গে lecture view খুলবে।"
                    : "Open a module below, then click any lesson card. Interactive lessons open the lecture view immediately."}
                </p>
              </div>

              <div className="panel border-emerald-100 bg-gradient-to-br from-white via-white to-emerald-50/70">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <div className="kicker">{text.labels.path}</div>
                    <h2 className="mt-2 text-2xl font-bold text-slate-900">{getPathTitle(selectedPath)}</h2>
                    <p className="mt-2 max-w-2xl text-sm text-slate-600">{getPathDesc(selectedPath)}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="chip">{getLevelLabel(selectedPath.level)}</span>
                      <span className="chip">{selectedPath.lang}</span>
                      <span className="chip">{text.labels.duration}: {selectedPath.duration}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button className="btn btn-green" onClick={handleStartLearning}>
                      {text.actions.startLearning}
                    </button>
                    <button className="btn btn-secondary" onClick={handlePreviewPath}>
                      {text.actions.preview}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setPathTab("content")}
                    className={"chip " + (pathTab === "content" ? "chip-active" : "")}
                  >
                    {text.labels.contentTab}
                  </button>
                  <button
                    onClick={() => setPathTab("about")}
                    className={"chip " + (pathTab === "about" ? "chip-active" : "")}
                  >
                    {text.labels.aboutTab}
                  </button>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-2">
                    <Search className="h-4 w-4" />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder={text.labels.searchModule}
                      className="bg-transparent text-sm outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-2">
                    <Filter className="h-4 w-4" />
                    <select
                      value={filter}
                      onChange={(event) => setFilter(event.target.value)}
                      className="bg-transparent text-sm outline-none"
                    >
                      <option value="all">{lang === "bn" ? "সব" : "All"}</option>
                      {LEVEL_OPTIONS.map((option) => (
                        <option key={option.id} value={option.id}>
                          {lang === "bn" ? option.labelBn : option.labelEn}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {lessonError && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                  {lessonError}
                </div>
              )}

              {pathTab === "about" ? (
                <div className="panel space-y-4">
                  <div>
                    <div className="kicker">{text.labels.overview}</div>
                    <p className="mt-2 text-sm text-slate-600">{getPathDesc(selectedPath)}</p>
                  </div>
                  <div>
                    <div className="kicker">{text.labels.prerequisites}</div>
                    <p className="mt-2 text-sm text-slate-600">{getPrereq(selectedPath)}</p>
                  </div>
                  <div>
                    <div className="kicker">{text.labels.outcomes}</div>
                    <div className="mt-2 space-y-2">
                      {getOutcomes(selectedPath).map((outcome, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm text-slate-700">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 text-brand-green" />
                          <span>{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-4">
                    {filteredModules.length ? (
                      filteredModules.map((moduleItem) => (
                        <div key={moduleItem.id} className="relative pl-6">
                          <span className="absolute left-0 top-5 h-2.5 w-2.5 rounded-full bg-brand-blue ring-4 ring-brand-blue/15" />
                          <div className="panel transition hover:shadow-md">
                            <button
                              onClick={() => toggleModule(moduleItem.id)}
                              className="flex w-full items-start justify-between gap-4 text-left"
                            >
                              <div>
                                <div className="kicker">{text.labels.modules}</div>
                                <div className="mt-1 text-lg font-semibold text-slate-900">{getModuleTitle(moduleItem)}</div>
                                <div className="mt-1 text-sm text-slate-600">{getModuleSummary(moduleItem)}</div>
                              </div>
                              <div className="text-right text-xs text-slate-600">
                                <div>{moduleItem.duration}</div>
                                <div>{moduleItem.lessons.length} {text.labels.lessonsLabel}</div>
                                {expandedModules.includes(moduleItem.id) ? (
                                  <ChevronUp className="ml-auto mt-2 h-4 w-4" />
                                ) : (
                                  <ChevronDown className="ml-auto mt-2 h-4 w-4" />
                                )}
                              </div>
                            </button>

                            {expandedModules.includes(moduleItem.id) && (
                              <div className="mt-4 space-y-2">
                                {moduleItem.lessons.map((lesson, index) => {
                                  const isCompleted = progress[selectedPath.id]?.includes(lesson.id);
                                  const isLoading = loadingLessonId === lesson.id;

                                  return (
                                    <div
                                      key={lesson.id}
                                      onClick={() => openLesson(moduleItem, lesson)}
                                      className={
                                        "w-full cursor-pointer rounded-2xl border px-5 py-4 transition-all hover:shadow-md " +
                                        (activeLesson?.id === lesson.id
                                          ? "border-brand-blue bg-brand-blue/5"
                                          : "border-slate-200 bg-white hover:border-brand-blue/30")
                                      }
                                    >
                                      <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-start gap-3">
                                          <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-slate-50 text-xs font-black text-slate-700">
                                            {index + 1}
                                          </div>
                                          <div className="flex-1 text-left">
                                            <div className="text-[15px] font-bold leading-tight text-slate-900">
                                              {getLessonTitle(lesson)}
                                            </div>
                                            <div className="mt-1 text-xs font-medium text-slate-500">
                                              {getLessonType(lesson)} · {lesson.duration}
                                            </div>
                                            <div className="mt-2 text-xs font-semibold text-brand-blue/80">
                                              {lang === "bn" ? "ট্যাপ করে পুরো লেকচার খুলুন" : "Tap to open the full lecture"}
                                            </div>
                                            {renderLessonLinks(lesson, { stopPropagation: true })}
                                            {isLoading && (
                                              <div className="mt-2 text-xs font-semibold text-brand-blue">
                                                {lang === "bn" ? "লেসন প্রস্তুত হচ্ছে..." : "Preparing lesson..."}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        <button
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            toggleLesson(selectedPath.id, lesson.id);
                                          }}
                                          title={isCompleted ? "Mark incomplete" : "Mark complete"}
                                          className="shrink-0 rounded-full p-2 transition-all hover:scale-110 hover:bg-slate-100/50 active:scale-95"
                                        >
                                          <CheckCircle2
                                            className={
                                              "h-6 w-6 transition-colors " +
                                              (isCompleted
                                                ? "text-emerald-500 drop-shadow-sm"
                                                : "text-slate-200 hover:text-emerald-500/50")
                                            }
                                          />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-slate-600">{text.labels.noModules}</div>
                    )}
                  </div>

                  {monthlyActivities.length > 0 && (
                    <div className="panel">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold">{text.labels.monthlyActivities}</h3>
                        <span className="text-xs text-slate-600">{monthlyActivities.length}</span>
                      </div>
                      <div className="mt-3 space-y-3">
                        {monthlyActivities.map((activity) => (
                          <div key={activity.id} className="panel-muted">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-semibold">{formatMonth(activity.month)}</div>
                              <div className="text-xs text-slate-600">{getLocalized(activity, "title")}</div>
                            </div>
                            <div className="mt-2 space-y-2">
                              {(activity.items || []).map((item) => {
                                const submission = submissionMap[item.id];
                                const assignment = isAssignmentItem(item);
                                return (
                                  <div
                                    key={item.id}
                                    className="flex flex-col gap-2 text-xs md:flex-row md:items-center md:justify-between"
                                  >
                                    <div className="flex items-center gap-2 text-slate-700">
                                      <span>{getLocalized(item, "title")}</span>
                                      <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5">
                                        {getLessonType(item)}
                                      </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                      {item.url && (
                                        <a href={item.url} target="_blank" rel="noreferrer" className="text-brand-blue">
                                          {text.labels.openLink}
                                        </a>
                                      )}
                                      {assignment && submission?.link && (
                                        <a
                                          href={submission.link}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="text-brand-blue"
                                        >
                                          {text.actions.viewSubmission}
                                        </a>
                                      )}
                                      {assignment && submission && (
                                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
                                          {getSubmissionStatus(submission.status)}
                                        </span>
                                      )}
                                      {assignment && user && (
                                        <button
                                          onClick={() => openSubmissionModal(activity, item)}
                                          className="rounded-full border border-slate-200 px-2 py-1 text-xs"
                                        >
                                          {submission ? text.actions.resubmit : text.actions.submitAssignment}
                                        </button>
                                      )}
                                      {assignment && !user && (
                                        <button
                                          onClick={() => setShowAuth(true)}
                                          className="rounded-full border border-slate-200 px-2 py-1 text-xs"
                                        >
                                          {text.actions.signIn}
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default CoursesView;

