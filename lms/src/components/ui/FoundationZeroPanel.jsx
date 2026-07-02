import React, { Suspense, lazy, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FOUNDATION_ZERO_DEFAULT_MODULE_ID, FOUNDATION_ZERO_MODULES } from "@/data/foundation-zero";

const InteractiveLessonView = lazy(() => import("./InteractiveLessonView.jsx"));

const loadingFallback = (
  <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm font-medium text-slate-600">
    Loading foundation lesson...
  </div>
);

const FoundationZeroPanel = ({ lang = "bn", onOpenCourses, onOpenRoadmap }) => {
  const [activeModuleId, setActiveModuleId] = useState(FOUNDATION_ZERO_DEFAULT_MODULE_ID);
  const [activeLessonIds, setActiveLessonIds] = useState(() =>
    Object.fromEntries(FOUNDATION_ZERO_MODULES.map((moduleItem) => [moduleItem.id, moduleItem.lessons[0]?.titleEn || ""])),
  );

  const activeModule = useMemo(
    () => FOUNDATION_ZERO_MODULES.find((moduleItem) => moduleItem.id === activeModuleId) || FOUNDATION_ZERO_MODULES[0],
    [activeModuleId],
  );

  const activeLesson = useMemo(() => {
    const selectedTitle = activeLessonIds[activeModule.id];
    return activeModule.lessons.find((item) => item.titleEn === selectedTitle) || activeModule.lessons[0];
  }, [activeLessonIds, activeModule]);

  return (
    <div className="space-y-6">
      <Card className="border-none bg-gradient-to-br from-sky-50 via-white to-emerald-50 shadow-none">
        <CardHeader className="pb-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="soft" className="w-fit bg-brand-blue/10 text-brand-blue">
              {lang === "bn" ? "শেয়ার্ড বুটক্যাম্প" : "Shared Bootcamp"}
            </Badge>
            <Badge variant="outline" className="w-fit">
              {lang === "bn" ? "৪টি মডিউল" : "4 modules"}
            </Badge>
          </div>
          <CardTitle className="text-2xl font-black">
            {lang === "bn" ? "Foundation 0: সবার জন্য কমন বেস" : "Foundation 0: Common Base for Everyone"}
          </CardTitle>
          <CardDescription className="text-sm font-medium leading-relaxed">
            {lang === "bn"
              ? "চারটি core department-এ যাওয়ার আগে এই shared layer নতুন learner-কে web, SaaS, Git, LMS workflow, submission, আর review culture-এর ভিত্তি দেয়।"
              : "Before moving into the four core departments, this shared layer gives every learner the base for web, SaaS, Git, LMS workflow, submission, and review culture."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button size="sm" variant="coop" onClick={onOpenCourses}>
            {lang === "bn" ? "ডিপার্টমেন্ট ট্র্যাক দেখুন" : "Open Department Tracks"}
          </Button>
          <Button size="sm" variant="outline" onClick={onOpenRoadmap}>
            {lang === "bn" ? "স্টাডি রোডম্যাপ দেখুন" : "Open Study Roadmap"}
          </Button>
        </CardContent>
      </Card>

      <Tabs value={activeModuleId} onValueChange={setActiveModuleId} className="space-y-5">
        <TabsList className="grid h-auto w-full grid-cols-1 gap-2 rounded-3xl bg-transparent p-0 md:grid-cols-2">
          {FOUNDATION_ZERO_MODULES.map((moduleItem) => (
            <TabsTrigger
              key={moduleItem.id}
              value={moduleItem.id}
              className="h-auto rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left data-[state=active]:border-brand-blue/30 data-[state=active]:bg-brand-blue/5"
            >
              <div className="w-full text-left">
                <div className="text-sm font-black text-slate-900">
                  {lang === "bn" ? moduleItem.titleBn : moduleItem.titleEn}
                </div>
                <div className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
                  {lang === "bn" ? moduleItem.summaryBn : moduleItem.summaryEn}
                </div>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {FOUNDATION_ZERO_MODULES.map((moduleItem) => {
          const currentLessonTitle = activeLessonIds[moduleItem.id];
          const currentLesson = moduleItem.lessons.find((item) => item.titleEn === currentLessonTitle) || moduleItem.lessons[0];

          return (
            <TabsContent key={moduleItem.id} value={moduleItem.id} className="space-y-5">
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-black text-slate-900">
                    {lang === "bn" ? moduleItem.titleBn : moduleItem.titleEn}
                  </CardTitle>
                  <CardDescription className="text-sm font-medium leading-relaxed">
                    {lang === "bn" ? moduleItem.summaryBn : moduleItem.summaryEn}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                    {lang === "bn" ? "লেকচার" : "Lectures"}
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {moduleItem.lessons.map((lessonItem) => {
                      const active = currentLesson.titleEn === lessonItem.titleEn;
                      return (
                        <button
                          key={lessonItem.titleEn}
                          type="button"
                          onClick={() =>
                            setActiveLessonIds((current) => ({
                              ...current,
                              [moduleItem.id]: lessonItem.titleEn,
                            }))
                          }
                          className={
                            "rounded-2xl border px-4 py-4 text-left transition " +
                            (active
                              ? "border-brand-blue/30 bg-brand-blue/5 text-brand-blue shadow-sm"
                              : "border-slate-200 bg-slate-50/60 text-slate-700 hover:border-slate-300 hover:bg-white")
                          }
                        >
                          <div className="text-sm font-black">{lang === "bn" ? lessonItem.titleBn : lessonItem.titleEn}</div>
                          <div className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
                            {lang === "bn" ? "Assignment + review logic included" : "Assignment + review logic included"}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Suspense fallback={loadingFallback}>
                <InteractiveLessonView
                  content={lang === "bn" ? currentLesson.contentBn : currentLesson.contentEn}
                  practice={currentLesson.practice}
                  resources={currentLesson.resources}
                  lang={lang}
                />
              </Suspense>

              <Card className="border-slate-200 bg-slate-50/80 shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-black text-slate-900">
                    {lang === "bn" ? "সাবমিশন ও ইভ্যালুয়েশন রুল" : "Submission and Evaluation Rule"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-white/70 bg-white/80 p-4">
                    <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                      {lang === "bn" ? "সাবমিট" : "Submit"}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700">
                      {lang === "bn"
                        ? "Artifact, ছোট ব্যাখ্যা, আর reviewer কোথায় focus করবে - এই তিনটি জিনিস একসাথে দিন।"
                        : "Submit the artifact, a short explanation, and where the reviewer should focus first."}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/70 bg-white/80 p-4">
                    <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                      {lang === "bn" ? "রিভিউ" : "Review"}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700">
                      {lang === "bn"
                        ? "Peer বা manager feedback-এ clarity, correctness, আর discipline দেখা হবে।"
                        : "Peer or manager review checks clarity, correctness, and discipline."}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/70 bg-white/80 p-4">
                    <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                      {lang === "bn" ? "রিভিশন" : "Revision"}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700">
                      {lang === "bn"
                        ? "Revision failure না; এটি next version-এর improvement plan।"
                        : "Revision is not failure; it is the improvement plan for the next version."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default FoundationZeroPanel;
