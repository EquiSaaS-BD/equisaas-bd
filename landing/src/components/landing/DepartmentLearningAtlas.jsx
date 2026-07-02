import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  BookOpenCheck,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Info,
  Layers3,
  ListChecks,
  Map,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

import { buildApplicationLink } from "@/lib/application-link";
import { normalizeLocalizedTree } from "@/lib/localized-copy";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import departmentsData from "@/data/departments.json";

const COPY = normalizeLocalizedTree({
  en: {
    badge: "Complete Department Learning Map",
    title: "Use this as the full curriculum reference for all 9 departments",
    desc: "Search by topic, inspect the module order, and review how each track moves toward real company contribution.",
    sectionNote:
      "Search by department, module, or topic. Click a department tab to inspect the full roadmap from foundations to contribution-ready work.",
    statDepartments: "Departments",
    statModules: "Modules",
    statLessons: "Lesson topics",
    statMode: "Mode",
    statModeValue: "Self-study + LMS proof flow",
    searchPlaceholder: "Search departments, modules, or topics...",
    summaryLabel: "Full learning reference",
    modulesCount: "Modules",
    lessonsCount: "Topics",
    openMap: "Open full map",
    focusLabel: "What you will learn",
    prerequisiteTitle: "Prerequisites",
    outcomesTitle: "Core outcomes",
    modulesTitle: "Complete curriculum modules",
    openLms: "Open LMS learning flow",
    apply: "Apply Now",
    noResults: "No department matched this search.",
    expandModules: "Expand lessons",
    collapseModules: "Collapse lessons",
    techStackTitle: "Tech Stack & Specialized Skills",
    curriculumTitle: "Learning Syllabus",
  },
  bn: {
    badge: "সম্পূর্ণ ডিপার্টমেন্ট লার্নিং ম্যাপ",
    title: "৯টি ডিপার্টমেন্টের পূর্ণ কারিকুলাম রেফারেন্স এক জায়গায় দেখুন",
    desc: "Search box ব্যবহার করে ডিপার্টমেন্ট, মডিউল, বা টপিক খুঁজুন।",
    sectionNote:
      "Department tab ক্লিক করুন। Foundation থেকে contribution-ready work পর্যন্ত পূর্ণ roadmap দেখুন।",
    statDepartments: "ডিপার্টমেন্ট",
    statModules: "মডিউল",
    statLessons: "লেসন টপিক",
    statMode: "মডেল",
    statModeValue: "Self-study + LMS proof flow",
    searchPlaceholder: "ডিপার্টমেন্ট, মডিউল, বা টপিক খুঁজুন...",
    summaryLabel: "পূর্ণ লার্নিং রেফারেন্স",
    modulesCount: "মডিউল",
    lessonsCount: "টপিক",
    openMap: "পুরো ম্যাপ খুলুন",
    focusLabel: "যা যা শিখতে হবে",
    prerequisiteTitle: "শুরু করার আগে যা জানা ভালো",
    outcomesTitle: "মূল অর্জন",
    modulesTitle: "সম্পূর্ণ শেখার মডিউল",
    openLms: "LMS learning flow খুলুন",
    apply: "এখনই আবেদন করুন",
    noResults: "এই খোঁজে কোনো ডিপার্টমেন্ট মেলেনি।",
    expandModules: "লেসন দেখুন",
    collapseModules: "লেসন বন্ধ করুন",
    techStackTitle: "টেক স্ট্যাক এবং বিশেষ দক্ষতা",
    curriculumTitle: "লার্নিং সিলেবাস",
  },
});

const ROADMAPS = normalizeLocalizedTree(departmentsData);

const DEPT_TAB_COLORS = [
  "from-sky-500/80 to-blue-500/80",
  "from-emerald-500/80 to-teal-500/80",
  "from-amber-500/80 to-orange-500/80",
  "from-fuchsia-500/80 to-violet-500/80",
  "from-rose-500/80 to-pink-500/80",
  "from-indigo-500/80 to-blue-600/80",
  "from-lime-500/80 to-green-500/80",
  "from-orange-500/80 to-red-500/80",
  "from-cyan-500/80 to-sky-500/80",
];

function getDepartmentStats(department) {
  const modulesCount = department.modules.length;
  const lessonsCount = department.modules.reduce((total, module) => total + module.lessons.length, 0);
  return { modulesCount, lessonsCount };
}

function buildSearchIndex(department) {
  return [
    department.titleEn,
    department.titleBn,
    department.descEn,
    department.descBn,
    department.prereqEn,
    department.prereqBn,
    ...(department.outcomesEn || []),
    ...(department.outcomesBn || []),
    ...department.modules.flatMap((module) => [
      module.titleEn,
      module.titleBn,
      module.summaryEn,
      module.summaryBn,
      ...module.lessons.flatMap((lesson) => [lesson.titleEn, lesson.titleBn]),
    ]),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function ModuleCard({ module, lang, deptId, moduleIndex, t }) {
  const [expanded, setExpanded] = useState(moduleIndex === 0);

  return (
    <Card className="rounded-[1.25rem] border-border/60 bg-background/50 shadow-none">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left"
      >
        <CardHeader className="space-y-2 p-4 pb-3">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-sm font-bold">
              {moduleIndex + 1}. {lang === "bn" ? module.titleBn : module.titleEn}
            </CardTitle>
            <div className="flex shrink-0 items-center gap-2">
              {module.duration ? <Badge variant="secondary" className="text-xs">{module.duration}</Badge> : null}
              <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", expanded && "rotate-180")} />
            </div>
          </div>
          <CardDescription className="text-xs leading-5">
            {lang === "bn" ? module.summaryBn : module.summaryEn}
          </CardDescription>
        </CardHeader>
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <CardContent className="p-4 pt-0">
              <ul className="space-y-2">
                {module.lessons.map((lesson) => (
                  <li
                    key={`${deptId}-${module.titleEn}-${lesson.titleEn}`}
                    className="flex items-center justify-between gap-3 rounded-xl bg-muted/30 px-3 py-2 text-xs"
                  >
                    <span className="flex items-center gap-2 font-medium text-foreground/80">
                      <BookOpen className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      {lang === "bn" ? lesson.titleBn : lesson.titleEn}
                    </span>
                    {lesson.duration ? (
                      <span className="shrink-0 rounded border border-border/40 bg-background px-2 py-0.5 text-[10px] text-muted-foreground shadow-sm">
                        {lesson.duration}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export default function DepartmentLearningAtlas({ lang = "en" }) {
  const t = COPY[lang];
  const [searchTerm, setSearchTerm] = useState("");
  const [activeDeptId, setActiveDeptId] = useState(null);

  const departments = useMemo(
    () =>
      ROADMAPS.map((department) => ({
        ...department,
        ...getDepartmentStats(department),
        searchIndex: buildSearchIndex(department),
      })),
    []
  );

  const totals = useMemo(
    () =>
      departments.reduce(
        (summary, department) => ({
          departments: summary.departments + 1,
          modules: summary.modules + department.modulesCount,
          lessons: summary.lessons + department.lessonsCount,
        }),
        { departments: 0, modules: 0, lessons: 0 }
      ),
    [departments]
  );

  const filteredDepartments = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return departments;
    return departments.filter((department) => department.searchIndex.includes(term));
  }, [departments, searchTerm]);

  // Set first department as active when filter changes or on mount
  useEffect(() => {
    if (filteredDepartments.length > 0) {
      const ids = filteredDepartments.map((d) => d.subdeptId);
      if (!activeDeptId || !ids.includes(activeDeptId)) {
        setActiveDeptId(ids[0]);
      }
    } else {
      setActiveDeptId(null);
    }
  }, [filteredDepartments]);

  // Handle cross-section focus event
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const handleFocusRequest = (event) => {
      const requestedDepartmentId = event?.detail?.departmentId;
      if (!requestedDepartmentId) return;
      setSearchTerm("");
      setActiveDeptId(requestedDepartmentId);
    };
    window.addEventListener("equisaas:focus-learning-map", handleFocusRequest);
    return () => window.removeEventListener("equisaas:focus-learning-map", handleFocusRequest);
  }, []);

  const activeDept = filteredDepartments.find((d) => d.subdeptId === activeDeptId) || null;

  return (
    <section id="department-learning-map" className="relative overflow-hidden bg-background py-12 md:py-16 lg:py-24">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[30rem] w-[30rem] rounded-full bg-emerald-500/5 blur-[100px]" />
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-14 max-w-4xl space-y-5 text-center"
        >
          <Badge variant="outline" className="rounded-full border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-primary">
            {t.badge}
          </Badge>
          <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-3xl sm:text-4xl lg:text-5xl">{t.title}</h2>
          <p className="mx-auto max-w-3xl text-lg leading-8 text-muted-foreground">{t.desc}</p>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="mb-8"
        >
          <Card className="rounded-[2rem] border border-border/50 bg-card/85 shadow-xl backdrop-blur-xl">
            <CardContent className="grid gap-6 p-6 lg:grid-cols-[1.15fr_0.85fr] lg:p-8">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-primary">
                  <Sparkles className="h-4 w-4" />
                  {t.summaryLabel}
                </div>
                <p className="max-w-3xl text-base leading-7 text-muted-foreground">{t.sectionNote}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: t.statDepartments, value: totals.departments },
                  { label: t.statModules, value: totals.modules },
                  { label: t.statLessons, value: totals.lessons },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-3xl border bg-background/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{label}</p>
                    <p className="mt-2 text-3xl font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.12 }}
          className="relative mx-auto mb-8 max-w-2xl"
        >
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t.searchPlaceholder}
            className="h-12 rounded-2xl border-border/60 bg-card pl-11 shadow-sm"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </motion.div>

        {/* Content */}
        {filteredDepartments.length > 0 ? (
          <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[320px_1fr]">
            {/* Tab sidebar */}
            <div className="space-y-4">
              <p className="hidden text-xs font-black uppercase tracking-[0.2em] text-muted-foreground lg:block">
                {t.statDepartments}
              </p>
              <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar lg:flex-col lg:overflow-visible lg:pb-0 lg:space-y-2">
                {filteredDepartments.map((department, index) => {
                  const isActive = department.subdeptId === activeDeptId;
                  const colorClass = DEPT_TAB_COLORS[index % DEPT_TAB_COLORS.length];
                  return (
                    <motion.button
                      key={department.subdeptId}
                      type="button"
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 }}
                      onClick={() => setActiveDeptId(department.subdeptId)}
                      className={cn(
                        "group shrink-0 rounded-[1.25rem] border p-4 text-left transition-all duration-200 lg:shrink",
                        isActive
                          ? "border-primary/40 bg-primary/8 shadow-md"
                          : "border-border/50 bg-card/60 hover:border-primary/25 hover:bg-primary/5",
                        "w-[240px] lg:w-full"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          {isActive && (
                            <motion.div
                              layoutId="active-dept-bar"
                              className={cn("mb-2 h-1 w-8 rounded-full bg-gradient-to-r", colorClass)}
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}
                          <p className={cn("text-sm font-bold leading-tight", isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")}>
                            {lang === "bn" ? department.titleBn : department.titleEn}
                          </p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            <span className="text-[10px] text-muted-foreground">
                              {department.modulesCount} {t.modulesCount}
                            </span>
                          </div>
                        </div>
                        <Badge variant="secondary" className="shrink-0 text-[10px]">
                          {department.deptId?.toUpperCase()}
                        </Badge>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Department detail panel */}
            <AnimatePresence mode="wait">
              {activeDept && (
                <motion.div
                  key={activeDept.subdeptId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-8"
                >
                  {/* Dept main header card */}
                  <Card className="rounded-[2.5rem] border border-border/50 bg-card/85 shadow-xl backdrop-blur-xl">
                    <CardHeader className="space-y-6 p-6 lg:p-10">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="rounded-full border-0 bg-primary/10 px-4 text-xs font-bold text-primary">
                          {activeDept.deptId?.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="rounded-full bg-background/50 px-3 text-[11px] font-medium text-muted-foreground">
                          <Layers3 className="mr-1.5 h-3.5 w-3.5" />
                          {activeDept.modulesCount} {t.modulesCount}
                        </Badge>
                        <Badge variant="outline" className="rounded-full bg-background/50 px-3 text-[11px] font-medium text-muted-foreground">
                          <ListChecks className="mr-1.5 h-3.5 w-3.5" />
                          {activeDept.lessonsCount} {t.lessonsCount}
                        </Badge>
                        {activeDept.duration && (
                          <Badge variant="outline" className="rounded-full bg-background/50 px-3 text-[11px] font-medium text-muted-foreground">
                            <Clock3 className="mr-1.5 h-3.5 w-3.5" />
                            {activeDept.duration}
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-4">
                        <CardTitle className="text-3xl font-black tracking-tight sm:text-4xl lg:text-3xl sm:text-4xl lg:text-5xl">
                          {lang === "bn" ? activeDept.titleBn : activeDept.titleEn}
                        </CardTitle>
                        <CardDescription className="text-lg leading-relaxed lg:text-xl">
                          {lang === "bn" ? activeDept.descBn : activeDept.descEn}
                        </CardDescription>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-10 p-6 pt-0 lg:p-10 lg:pt-0">
                      {/* Tech Stack - Overhauled with Wrap */}
                      <div className="space-y-5 rounded-[2rem] border border-primary/10 bg-primary/5 p-6 lg:p-8">
                        <div className="space-y-3">
                          <h4 className="flex items-center gap-2.5 text-sm font-black uppercase tracking-[0.2em] text-primary">
                            <ShieldCheck className="h-5 w-5" />
                            {t.techStackTitle}
                          </h4>
                          <p className="text-base leading-relaxed text-muted-foreground/90">
                            {lang === "bn" ? activeDept.techStackDescBn : activeDept.techStackDescEn}
                          </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {activeDept.skills?.map((skill) => (
                            <div
                              key={skill}
                              className="inline-flex items-center rounded-xl border border-primary/15 bg-background px-3.5 py-2 text-xs font-bold text-foreground/80 shadow-sm transition-all hover:border-primary/40 hover:bg-primary/5"
                            >
                              <Zap className="mr-2 h-3.5 w-3.5 text-primary" />
                              {skill}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-6 sm:grid-cols-2">
                        {/* Prerequisites */}
                        <div className="space-y-4 rounded-[2rem] border border-border/50 bg-background/60 p-6 lg:p-8">
                          <h4 className="flex items-center gap-2.5 text-sm font-black uppercase tracking-[0.15em] text-muted-foreground">
                            <BookOpenCheck className="h-5 w-5 text-primary" />
                            {t.prerequisiteTitle}
                          </h4>
                          <p className="text-base leading-relaxed text-muted-foreground">
                            {lang === "bn" ? activeDept.prereqBn : activeDept.prereqEn}
                          </p>
                        </div>

                        {/* Outcomes */}
                        <div className="space-y-4 rounded-[2rem] border border-primary/10 bg-primary/[0.02] p-6 lg:p-8">
                          <h4 className="flex items-center gap-2.5 text-sm font-black uppercase tracking-[0.15em] text-primary">
                            <Target className="h-5 w-5" />
                            {t.outcomesTitle}
                          </h4>
                          <ul className="grid gap-3">
                            {(lang === "bn" ? activeDept.outcomesBn : activeDept.outcomesEn)?.map((outcome) => (
                              <li key={outcome} className="flex items-start gap-3 text-sm text-muted-foreground">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                <span>{outcome}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Main CTA Block */}
                      <div className="flex flex-col gap-4 rounded-[2rem] border border-border/50 bg-muted/30 p-4 sm:flex-row sm:p-2">
                        <Button asChild className="h-14 rounded-[1.5rem] px-8 text-base font-bold flex-1 shadow-lg shadow-primary/20">
                          <a
                            href={buildApplicationLink({
                              departmentId: activeDept.subdeptId,
                              departmentTitle: lang === "bn" ? activeDept.titleBn : activeDept.titleEn,
                            })}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Sparkles className="mr-2 h-5 w-5" />
                            {t.apply}
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </a>
                        </Button>
                        <Button asChild variant="outline" className="h-14 rounded-[1.5rem] px-8 text-base font-bold flex-1 border-primary/20 bg-background/50 hover:bg-primary/5">
                          <a href="/lms/login">
                            <Info className="mr-2 h-5 w-5 text-primary" />
                            {t.openLms}
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Syllabus/Modules */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-primary/10 p-2.5">
                        <Map className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="text-xl font-black tracking-tight">
                        {t.curriculumTitle}
                      </h4>
                    </div>
                    <div className="grid gap-4 xl:grid-cols-2">
                      {activeDept.modules.map((module, moduleIndex) => (
                        <ModuleCard
                          key={`${activeDept.subdeptId}-${module.titleEn}`}
                          module={module}
                          lang={lang}
                          deptId={activeDept.subdeptId}
                          moduleIndex={moduleIndex}
                          t={t}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center text-muted-foreground"
          >
            {t.noResults}
          </motion.div>
        )}
      </div>
    </section>
  );
}
