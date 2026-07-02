import React, { useMemo, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Compass,
  Layers3,
  Route,
  SlidersHorizontal,
  Sparkles,
  Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const iconByKind = {
  architecture: Layers3,
  board: Compass,
  calculator: BarChart3,
  checklist: ClipboardList,
  flow: Route,
  matrix: Target,
  planner: Sparkles,
  tokens: SlidersHorizontal,
};

const tokenPreviewClasses = {
  bold: "border-brand-blue/30 bg-brand-blue text-white shadow-xl shadow-brand-blue/20",
  balanced: "border-emerald-400/30 bg-emerald-50 text-emerald-950",
  compact: "border-amber-400/30 bg-amber-50 text-amber-950",
};

const getLocalizedValue = (item, key, lang) => {
  if (!item) return "";
  const primary = lang === "bn" ? item[`${key}Bn`] : item[`${key}En`];
  const fallback = lang === "bn" ? item[`${key}En`] : item[`${key}Bn`];
  return primary || fallback || item[key] || "";
};

const getNumberFormatter = (lang) => new Intl.NumberFormat(lang === "bn" ? "bn-BD" : "en-US");

const PracticeLabView = ({ practice, lang = "en" }) => {
  const formatter = useMemo(() => getNumberFormatter(lang), [lang]);
  const [checked, setChecked] = useState({});
  const [selectedEntryId, setSelectedEntryId] = useState(practice?.entries?.[0]?.id || practice?.options?.[0]?.id || "");
  const [activeSectionId, setActiveSectionId] = useState(practice?.sections?.[0]?.id || "section-1");
  const [metrics, setMetrics] = useState(() => ({
    baseline: Number(practice?.metrics?.baseline || 100),
    current: Number(practice?.metrics?.current || 135),
    target: Number(practice?.metrics?.target || 160),
  }));

  if (!practice) return null;

  const Icon = iconByKind[practice.kind] || Sparkles;
  const prompt = getLocalizedValue(practice, "prompt", lang);
  const summary = getLocalizedValue(practice, "summary", lang);
  const checklistItems = practice.items || [];
  const completedCount = checklistItems.filter((item) => checked[item.id]).length;
  const selectedEntry =
    practice.entries?.find((entry) => entry.id === selectedEntryId) ||
    practice.options?.find((entry) => entry.id === selectedEntryId) ||
    practice.entries?.[0] ||
    practice.options?.[0] ||
    null;
  const calculatorProgress = metrics.target > 0 ? Math.max(0, Math.min(100, Math.round((metrics.current / metrics.target) * 100))) : 0;
  const calculatorDelta = metrics.current - metrics.baseline;

  const updateMetric = (key, delta) => {
    setMetrics((current) => ({
      ...current,
      [key]: Math.max(0, current[key] + delta),
    }));
  };

  if (practice.kind === "checklist") {
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Badge variant="success" className="w-fit">
              <Icon className="mr-1.5 h-3 w-3" />
              {lang === "bn" ? "রিভিউ-রেডি প্র্যাকটিস" : "Review-ready practice"}
            </Badge>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-700">{prompt}</p>
          </div>
          <div className="min-w-40 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-sm">
            <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
              {lang === "bn" ? "প্রগ্রেস" : "Progress"}
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900">
              {formatter.format(completedCount)}/{formatter.format(checklistItems.length)}
            </div>
          </div>
        </div>

        <Progress value={checklistItems.length ? (completedCount / checklistItems.length) * 100 : 0} className="h-3 bg-slate-100" />

        <div className="grid gap-3 md:grid-cols-2">
          {checklistItems.map((item) => {
            const checkedState = Boolean(checked[item.id]);
            return (
              <Card key={item.id} className={checkedState ? "border-emerald-200 bg-emerald-50/80" : "border-slate-200 bg-white"}>
                <CardContent className="flex items-start justify-between gap-4 p-5">
                  <div className="space-y-2">
                    <div className="text-base font-black text-slate-900">{getLocalizedValue(item, "label", lang)}</div>
                    <p className="text-sm leading-relaxed text-slate-600">{getLocalizedValue(item, "detail", lang)}</p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant={checkedState ? "coop" : "outline"}
                    className="rounded-xl"
                    onClick={() => setChecked((current) => ({ ...current, [item.id]: !current[item.id] }))}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {checkedState ? (lang === "bn" ? "হয়েছে" : "Done") : (lang === "bn" ? "চিহ্ন দিন" : "Mark")}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border-slate-200 bg-slate-50/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-black text-slate-900">{lang === "bn" ? "রিভিউ ইনসাইট" : "Review Insight"}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-slate-600">{summary}</CardContent>
        </Card>
      </div>
    );
  }

  if (practice.kind === "calculator") {
    const unitLabel = getLocalizedValue(practice.metrics, "unit", lang);
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Badge variant="warning" className="w-fit">
              <Icon className="mr-1.5 h-3 w-3" />
              {lang === "bn" ? "সিগনাল সিমুলেটর" : "Signal simulator"}
            </Badge>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-700">{prompt}</p>
          </div>
          <div className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-sm">
            <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
              {lang === "bn" ? "টার্গেট প্রগ্রেস" : "Target progress"}
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900">{formatter.format(calculatorProgress)}%</div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { key: "baseline", labelEn: "Baseline", labelBn: "বেসলাইন" },
            { key: "current", labelEn: "Current", labelBn: "কারেন্ট" },
            { key: "target", labelEn: "Target", labelBn: "টার্গেট" },
          ].map((metric) => (
            <Card key={metric.key} className="border-slate-200 bg-white">
              <CardHeader className="pb-3">
                <CardDescription className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                  {lang === "bn" ? metric.labelBn : metric.labelEn}
                </CardDescription>
                <CardTitle className="text-2xl font-black text-slate-900">
                  {formatter.format(metrics[metric.key])}
                  {unitLabel ? <span className="ml-2 text-sm font-semibold text-slate-500">{unitLabel}</span> : null}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button type="button" variant="outline" size="sm" className="rounded-xl" onClick={() => updateMetric(metric.key, -5)}>
                  -5
                </Button>
                <Button type="button" variant="brand" size="sm" className="rounded-xl" onClick={() => updateMetric(metric.key, 5)}>
                  +5
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-slate-200 bg-slate-50/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-black text-slate-900">{lang === "bn" ? "সিগনাল রিডআউট" : "Signal Readout"}</CardTitle>
            <CardDescription>{summary}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={calculatorProgress} className="h-3 bg-slate-200" />
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-white/70 bg-white/80 px-4 py-4">
                <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                  {lang === "bn" ? "বেসলাইন থেকে পরিবর্তন" : "Change from baseline"}
                </div>
                <div className="mt-2 text-xl font-black text-slate-900">{formatter.format(calculatorDelta)}</div>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/80 px-4 py-4">
                <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                  {lang === "bn" ? "এখন কী করবেন" : "Recommended next move"}
                </div>
                <div className="mt-2 text-sm leading-relaxed text-slate-700">{prompt}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (practice.kind === "matrix" || practice.kind === "planner") {
    const isPlanner = practice.kind === "planner";
    return (
      <div className="grid gap-4 lg:grid-cols-[1.1fr,1fr]">
        <div className="space-y-3">
          <Badge variant={isPlanner ? "brand" : "soft"} className="w-fit">
            <Icon className="mr-1.5 h-3 w-3" />
            {isPlanner ? (lang === "bn" ? "ডিসিশন সিমুলেশন" : "Decision simulation") : (lang === "bn" ? "ম্যাপিং সিমুলেশন" : "Mapping simulation")}
          </Badge>
          <p className="text-sm leading-relaxed text-slate-700">{prompt}</p>
          <div className="grid gap-3">
            {(practice.options || practice.entries || []).map((entry) => {
              const selected = entry.id === selectedEntry?.id;
              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setSelectedEntryId(entry.id)}
                  className={
                    "rounded-2xl border p-4 text-left transition " +
                    (selected ? "border-brand-blue bg-brand-blue/5 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300")
                  }
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-base font-black text-slate-900">{getLocalizedValue(entry, "label", lang)}</div>
                    {"scoreEn" in entry || "scoreBn" in entry ? (
                      <Badge variant={selected ? "brand" : "outline"}>{getLocalizedValue(entry, "score", lang)}</Badge>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{getLocalizedValue(entry, "detail", lang)}</p>
                </button>
              );
            })}
          </div>
        </div>

        <Card className="border-slate-200 bg-slate-50/80">
          <CardHeader>
            <CardDescription className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
              {lang === "bn" ? "সিলেক্টেড ফোকাস" : "Selected focus"}
            </CardDescription>
            <CardTitle className="text-2xl font-black text-slate-900">{getLocalizedValue(selectedEntry, "label", lang)}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed text-slate-700">{getLocalizedValue(selectedEntry, "detail", lang)}</p>

            {isPlanner ? (
              <div className="space-y-4">
                {[
                  { key: "impact", labelEn: "Impact", labelBn: "ইমপ্যাক্ট" },
                  { key: "speed", labelEn: "Speed", labelBn: "স্পিড" },
                  { key: "risk", labelEn: "Risk control", labelBn: "রিস্ক কন্ট্রোল" },
                ].map((metric) => (
                  <div key={metric.key} className="space-y-2">
                    <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                      <span>{lang === "bn" ? metric.labelBn : metric.labelEn}</span>
                      <span>{formatter.format(Number(selectedEntry?.[metric.key] || 0))}%</span>
                    </div>
                    <Progress value={Number(selectedEntry?.[metric.key] || 0)} className="h-3 bg-slate-200" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-white/70 bg-white px-4 py-4">
                  <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                    {lang === "bn" ? "ইনফ্লুয়েন্স" : "Influence"}
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">{getLocalizedValue(selectedEntry, "score", lang)}</div>
                </div>
                <div className="rounded-2xl border border-white/70 bg-white px-4 py-4">
                  <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                    {lang === "bn" ? "সেরা অ্যাকশন" : "Best action"}
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">{getLocalizedValue(selectedEntry, "action", lang)}</div>
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-white/70 bg-white px-4 py-4 text-sm leading-relaxed text-slate-700">{summary}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sections = practice.sections || [];
  const selectedSection = sections.find((section) => section.id === activeSectionId) || sections[0] || null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Badge variant="outline" className="w-fit border-brand-blue/20 bg-brand-blue/5 text-brand-blue">
            <Icon className="mr-1.5 h-3 w-3" />
            {lang === "bn" ? "ইন্টারঅ্যাকটিভ এক্সপ্লোরার" : "Interactive explorer"}
          </Badge>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-700">{prompt}</p>
        </div>
        <div className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-sm">
          <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
            {lang === "bn" ? "ফোকাস" : "Focus"}
          </div>
          <div className="mt-2 text-base font-black text-slate-900">{getLocalizedValue(selectedSection, "label", lang)}</div>
        </div>
      </div>

      <Tabs value={activeSectionId} onValueChange={setActiveSectionId} className="space-y-4">
        <TabsList className="h-auto flex-wrap justify-start gap-2 rounded-2xl bg-slate-100/80 p-2">
          {sections.map((section) => (
            <TabsTrigger key={section.id} value={section.id} className="rounded-xl px-4 py-2">
              {getLocalizedValue(section, "label", lang)}
            </TabsTrigger>
          ))}
        </TabsList>

        {sections.map((section) => {
          const previewTone = tokenPreviewClasses[section.id] || tokenPreviewClasses.balanced;
          return (
            <TabsContent key={section.id} value={section.id} className="mt-0">
              <div className="grid gap-4 lg:grid-cols-[1.2fr,0.9fr]">
                <Card className="border-slate-200 bg-white">
                  <CardHeader>
                    <CardDescription className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                      {lang === "bn" ? "ওয়ার্কিং ভিউ" : "Working view"}
                    </CardDescription>
                    <CardTitle className="text-2xl font-black text-slate-900">{getLocalizedValue(section, "label", lang)}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm leading-relaxed text-slate-700">{getLocalizedValue(section, "detail", lang)}</p>
                    {(section.items || []).length > 0 && (
                      <div className="grid gap-3">
                        {(section.items || []).map((item) => (
                          <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                            <div className="text-sm font-black text-slate-900">{getLocalizedValue(item, "label", lang)}</div>
                            <p className="mt-1 text-sm leading-relaxed text-slate-600">{getLocalizedValue(item, "detail", lang)}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-slate-200 bg-slate-50/80">
                  <CardHeader>
                    <CardDescription className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                      {lang === "bn" ? "প্র্যাকটিস ইনসাইট" : "Practice insight"}
                    </CardDescription>
                    <CardTitle className="text-lg font-black text-slate-900">{summary}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {practice.kind === "tokens" ? (
                      <div className={`rounded-[28px] border p-5 shadow-sm transition ${previewTone}`}>
                        <div className="text-xs font-black uppercase tracking-[0.24em] opacity-70">
                          {lang === "bn" ? "প্রিভিউ" : "Preview"}
                        </div>
                        <div className="mt-3 text-xl font-black">
                          {lang === "bn" ? "ডিজাইন স্টুডিও কার্ড" : "Design studio card"}
                        </div>
                        <p className="mt-2 text-sm leading-relaxed opacity-90">
                          {lang === "bn"
                            ? "spacing, emphasis, আর readability-এর balance visualভাবে compare করুন।"
                            : "Compare spacing, emphasis, and readability visually before making a system decision."}
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-white/70 bg-white px-4 py-4 text-sm leading-relaxed text-slate-700">
                        {getLocalizedValue(section, "prompt", lang) || prompt}
                      </div>
                    )}
                    <div className="rounded-2xl border border-white/70 bg-white px-4 py-4 text-sm leading-relaxed text-slate-700">
                      {lang === "bn" ? "রিভিউ প্রশ্ন:" : "Review prompt:"} {getLocalizedValue(section, "review", lang) || summary}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default PracticeLabView;
