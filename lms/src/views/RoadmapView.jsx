import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ROADMAPS_V2 } from "../data/roadmaps-v2";
import { TRACK_META } from "../data/resources-v2";
import { BOOK_CONTENT_V1, BOOK_SUMMARY_V1 } from "../data/books-v1";
import { CheckCircle2, Circle, Award, Map, Sparkles, BookOpen, ExternalLink, Workflow, LineChart, BarChart3 } from "lucide-react";
import { useLms } from "../lms-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const assetBase = import.meta.env.BASE_URL || "/";

const DEPT_CONFIG = Object.entries(TRACK_META).map(([key, meta]) => ({
  key,
  en: meta.en,
  bn: meta.bn,
  tracks: Object.entries(meta.tracks).map(([trackKey, trackMeta]) => ({
    key: trackKey,
    en: trackMeta.en,
    bn: trackMeta.bn
  }))
}));

const MonthCard = ({ month, data, lang }) => {
  return (
    <AccordionItem value={`month-${month}`} className="border-none mb-4 group">
      <Card className="border-none bg-muted/30 shadow-none hover:bg-muted/50 transition-all duration-300">
        <AccordionTrigger className="hover:no-underline px-6 py-4">
          <div className="flex items-center gap-4 text-left">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-lg font-black shadow-lg shadow-primary/20">
              {month}
            </div>
            <div>
              <CardTitle className="text-base font-black tracking-tight">{lang === "bn" ? `মাস ${month}` : `Month ${month}`}</CardTitle>
              <CardDescription className="text-xs font-bold text-primary/80 uppercase tracking-widest mt-0.5">{data.deliverables}</CardDescription>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-6 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-2 duration-300">
            <div className="space-y-4">
              <div className="text-[10px] uppercase font-black tracking-widest text-muted-foreground flex items-center gap-2">
                <Circle className="w-3 h-3 text-primary" />
                {lang === "bn" ? "টপিকস" : "Topics"}
              </div>
              <ul className="space-y-2.5">
                {(lang === "bn" ? data.topicsBn : data.topicsEn).map((topic, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs font-medium text-foreground/80 leading-relaxed">
                    <div className="w-1 h-1 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                    {topic}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="text-[10px] uppercase font-black tracking-widest text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-brand-green" />
                {lang === "bn" ? "অ্যাসাইনমেন্ট" : "Assignments"}
              </div>
              <ul className="space-y-2.5">
                {(lang === "bn" ? data.assignmentsBn : data.assignmentsEn).map((assignment, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs font-medium text-foreground/80 leading-relaxed">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-green flex-shrink-0 transition-transform group-hover:scale-110" />
                    {assignment}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="text-[10px] uppercase font-black tracking-widest text-muted-foreground flex items-center gap-2">
                <Award className="w-3 h-3 text-amber-500" />
                {lang === "bn" ? "ডেলিভারেবল" : "Deliverable"}
              </div>
              <Card className="bg-background border-none shadow-sm p-4 border-l-4 border-l-amber-500">
                <div className="flex items-start gap-3">
                  <Award className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="text-xs font-black text-foreground/90 uppercase leading-normal">{data.deliverables}</span>
                </div>
              </Card>
            </div>
          </div>
        </AccordionContent>
      </Card>
    </AccordionItem>
  );
};

const WeeklyGraph = ({ weeks }) => {
  const width = 360;
  const height = 180;
  const padding = 28;
  const totals = weeks.map(week => week.studyHours + week.practiceHours);
  const maxValue = Math.max(...totals, 1);

  const points = totals.map((value, index) => {
    const x = padding + (index * (width - padding * 2)) / Math.max(totals.length - 1, 1);
    const y = height - padding - (value / maxValue) * (height - padding * 2);
    return { x, y, value, week: index + 1 };
  });

  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44">
      <defs>
        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width={width} height={height} fill="transparent" />
      <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#334155" strokeWidth="1.5" />
      <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#334155" strokeWidth="1.5" />
      <path d={path} fill="none" stroke="url(#lineGradient)" strokeWidth="3" strokeLinecap="round" />
      {points.map(point => (
        <g key={point.week}>
          <circle cx={point.x} cy={point.y} r="4.5" fill="#3b82f6" />
          <text x={point.x} y={point.y - 10} textAnchor="middle" fontSize="10" fill="#94a3b8">{point.value}h</text>
          <text x={point.x} y={height - 10} textAnchor="middle" fontSize="10" fill="#94a3b8">W{point.week}</text>
        </g>
      ))}
    </svg>
  );
};

const ResourceMixChart = ({ mix }) => {
  const width = 360;
  const height = 180;
  const padding = 26;
  const maxCount = Math.max(...mix.map(item => item.count), 1);
  const barWidth = 46;
  const gap = 22;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44">
      <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#334155" strokeWidth="1.5" />
      {mix.map((item, index) => {
        const x = padding + 20 + index * (barWidth + gap);
        const barHeight = (item.count / maxCount) * (height - padding * 2.2);
        const y = height - padding - barHeight;
        const colors = ["#3b82f6", "#1e40af", "#10b981", "#059669"];

        return (
          <g key={`${item.type}-${index}`}>
            <rect x={x} y={y} width={barWidth} height={barHeight} rx="8" fill={colors[index % colors.length]} opacity="0.9" />
            <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" fontSize="10" fill="#94a3b8">{item.count}</text>
            <text x={x + barWidth / 2} y={height - 10} textAnchor="middle" fontSize="9" fill="#94a3b8">{item.type.slice(0, 6)}</text>
          </g>
        );
      })}
    </svg>
  );
};

const FlowDiagram = ({ steps }) => {
  const width = 760;
  const height = 180;
  const boxWidth = 150;
  const boxHeight = 56;
  const startX = 20;
  const y = 62;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44">
      <defs>
        <linearGradient id="boxGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>
      {steps.map((step, index) => {
        const x = startX + index * 184;
        const centerY = y + boxHeight / 2;

        return (
          <g key={`${step}-${index}`}>
            <rect x={x} y={y} width={boxWidth} height={boxHeight} rx="14" fill="url(#boxGradient)" stroke="#3b82f6" strokeWidth="1.4" />
            <text x={x + boxWidth / 2} y={centerY + 4} textAnchor="middle" fontSize="11" fill="#f8fafc" fontWeight="700">
              {step}
            </text>
            {index < steps.length - 1 && (
              <>
                <line x1={x + boxWidth + 8} y1={centerY} x2={x + 174} y2={centerY} stroke="#3b82f6" strokeWidth="2" />
                <polygon points={`${x + 174},${centerY} ${x + 166},${centerY - 5} ${x + 166},${centerY + 5}`} fill="#3b82f6" />
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
};

const ChapterBookCard = ({ chapter, lang }) => {
  return (
    <AccordionItem value={chapter.chapterId} className="border-none">
      <Card className="border-none bg-muted/30 shadow-none">
        <AccordionTrigger className="hover:no-underline px-6 py-4">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-black">M{chapter.month}</div>
            <div>
              <CardTitle className="text-lg font-black tracking-tight">{lang === "bn" ? chapter.titleBn : chapter.titleEn}</CardTitle>
              <CardDescription className="text-xs font-bold uppercase tracking-widest mt-1">{chapter.deliverables}</CardDescription>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-8 pt-2 space-y-6">
          <Card className="overflow-hidden border-none bg-background/60">
            <div className="w-full h-44 relative bg-primary/5 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:20px_20px] opacity-30"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 rounded-full blur-[40px]"></div>
              <h3 className="text-3xl font-black text-foreground/40 z-10 tracking-widest uppercase">
                {lang === "bn" ? `মাস ${chapter.month}` : `Month ${chapter.month}`}
              </h3>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-none bg-background/80">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-black">বাংলা গাইড</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3 text-xs text-foreground/85 leading-relaxed">
                <p>{chapter.introBn}</p>
                <ul className="space-y-2">
                  {chapter.howToReadBn.map(step => (
                    <li key={step} className="flex gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-green mt-0.5 shrink-0" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-none bg-background/80">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-black">English Guide</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3 text-xs text-foreground/85 leading-relaxed">
                <p>{chapter.introEn}</p>
                <ul className="space-y-2">
                  {chapter.howToReadEn.map(step => (
                    <li key={step} className="flex gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none bg-background/80">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-black">{lang === "bn" ? "স্টাডি কনটেন্ট" : "Study Content"}</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {lang === "bn"
                  ? "প্রতিটি টপিক সহজ ভাষায় ব্যাখ্যা, কেন লাগবে, আর দ্রুত প্র্যাকটিস স্টেপ সহ।"
                  : "Each topic explained in simple language with why it matters and quick practice steps."}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              {chapter.topicNotes.map(note => (
                <Card key={note.titleEn} className="border border-border/50 bg-muted/20 shadow-sm">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-black text-primary">{lang === "bn" ? note.titleBn : note.titleEn}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-2 text-xs text-foreground/85 leading-relaxed">
                    <p>{lang === "bn" ? note.overviewBn : note.overviewEn}</p>
                    <p className="text-muted-foreground">{lang === "bn" ? note.whyBn : note.whyEn}</p>
                    <ul className="space-y-1">
                      {(lang === "bn" ? note.stepsBn : note.stepsEn).map(step => (
                        <li key={step} className="flex gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-green mt-0.5 shrink-0" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="rounded-lg bg-background/60 border border-border/40 p-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{lang === "bn" ? "উদাহরণ" : "Example"}</span>
                      <p className="text-xs mt-1">{lang === "bn" ? note.exampleBn : note.exampleEn}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-none bg-background/80">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xs uppercase tracking-widest font-black flex items-center gap-2">
                  <LineChart className="w-3.5 h-3.5 text-primary" />
                  {lang === "bn" ? "সাপ্তাহিক স্টাডি গ্রাফ" : "Weekly Study Graph"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <WeeklyGraph weeks={chapter.weeks} />
              </CardContent>
            </Card>

            <Card className="border-none bg-background/80">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xs uppercase tracking-widest font-black flex items-center gap-2">
                  <BarChart3 className="w-3.5 h-3.5 text-brand-green" />
                  {lang === "bn" ? "রিসোর্স টাইপ চার্ট" : "Resource Type Chart"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <ResourceMixChart mix={chapter.resourceMix} />
              </CardContent>
            </Card>
          </div>

          <Card className="border-none bg-background/80">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs uppercase tracking-widest font-black flex items-center gap-2">
                <Workflow className="w-3.5 h-3.5 text-primary" />
                {lang === "bn" ? "স্টেপ বাই স্টেপ ডায়াগ্রাম" : "Step-by-step Diagram"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <FlowDiagram steps={lang === "bn" ? chapter.flow.bn : chapter.flow.en} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-none bg-background/80">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-black">{lang === "bn" ? "সহজ টার্মস" : "Easy Terms"}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2">
                {(lang === "bn" ? chapter.termsBn : chapter.termsEn).map(item => (
                  <div key={item.term} className="rounded-xl border border-border/60 p-3">
                    <div className="text-xs font-black text-primary">{item.term}</div>
                    <div className="text-xs text-muted-foreground mt-1">{item.meaning}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-none bg-background/80">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-black">{lang === "bn" ? "পড়া শেষের কাজ" : "After-reading Tasks"}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2">
                {(lang === "bn" ? chapter.assignmentsBn : chapter.assignmentsEn).map(task => (
                  <div key={task} className="flex gap-2 text-xs leading-relaxed">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-green mt-0.5 shrink-0" />
                    <span>{task}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="border-none bg-background/80">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-black flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-primary" />
                {lang === "bn" ? "রিসোর্স লিংক (গবেষণাভিত্তিক)" : "Research-based Resource Links"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-3">
              {chapter.resources.map(resource => (
                <a
                  key={`${chapter.chapterId}-${resource.url}`}
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-border/60 p-3 hover:border-primary/40 hover:bg-primary/5 transition-colors"
                >
                  <div className="text-xs font-black text-foreground leading-relaxed">{resource.title}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">{resource.author}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-[10px] font-bold bg-muted/40">{resource.type}</Badge>
                    <Badge variant="outline" className={cn("text-[10px] font-bold", resource.lang === "bn" ? "text-emerald-600 border-emerald-500/30" : "text-primary border-primary/30")}>
                      {resource.lang === "bn" ? "বাংলা" : "English"}
                    </Badge>
                  </div>
                </a>
              ))}
            </CardContent>
          </Card>
        </AccordionContent>
      </Card>
    </AccordionItem>
  );
};

const RoadmapView = () => {
  const { lang } = useLms();
  const assetBase = import.meta.env.BASE_URL || "/";
  const [activeDept, setActiveDept] = useState("engineering");
  const [activeTrack, setActiveTrack] = useState("frontend");

  const currentDept = useMemo(() => DEPT_CONFIG.find(dept => dept.key === activeDept), [activeDept]);
  const currentTrack = currentDept?.tracks.find(track => track.key === activeTrack);
  const months = ROADMAPS_V2[activeDept]?.[activeTrack] ?? [];
  const chapters = BOOK_CONTENT_V1[activeDept]?.[activeTrack] ?? [];

  const handleDeptChange = deptKey => {
    setActiveDept(deptKey);
    const dept = DEPT_CONFIG.find(item => item.key === deptKey);
    setActiveTrack(dept?.tracks?.[0]?.key || "");
  };

  return (
    <section className="space-y-10 animate-in fade-in duration-700">
      <div className="relative overflow-hidden p-8 rounded-3xl bg-muted/30 border border-muted-foreground/5 shadow-inner">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
        <div className="relative space-y-2">
          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1 rounded-full border-none">
            <Map className="w-3 h-3 mr-2" />
            {lang === "bn" ? "৬ মাসের লার্নিং পাথ" : "6-Month Learning Path"}
          </Badge>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mt-4">{lang === "bn" ? "রোডম্যাপ + স্টাডি বুক" : "Roadmap + Study Book"}</h2>
          <p className="text-muted-foreground text-lg max-w-3xl font-medium leading-relaxed">
            {lang === "bn"
              ? "প্রতিটি ট্র্যাকের জন্য মাসভিত্তিক রোডম্যাপ এবং ১ম-৬ষ্ঠ মাসের বই-স্টাইল গাইড (বাংলা+English) চার্ট, ডায়াগ্রাম, ইমেজ এবং রিসোর্স লিংকসহ।"
              : "Month-wise roadmap and book-style guides for month 1-6 (Bangla + English) with charts, diagrams, images, and resource links."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="text-[10px] uppercase font-black tracking-widest text-muted-foreground italic">
            {lang === "bn" ? "ডিপার্টমেন্ট নির্বাচন করুন" : "Select Department"}
          </div>
          <div className="flex flex-wrap gap-2">
            {DEPT_CONFIG.map(dept => (
              <Button
                key={dept.key}
                variant={activeDept === dept.key ? "secondary" : "ghost"}
                onClick={() => handleDeptChange(dept.key)}
                className={cn(
                  "rounded-xl font-bold transition-all px-4 h-10",
                  activeDept === dept.key ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground"
                )}
              >
                {lang === "bn" ? dept.bn : dept.en}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-[10px] uppercase font-black tracking-widest text-muted-foreground italic">
            {lang === "bn" ? "সাব-ডিপার্টমেন্ট নির্বাচন করুন" : "Select Sub-department"}
          </div>
          <div className="flex flex-wrap gap-2">
            {(currentDept?.tracks || []).map(track => (
              <Button
                key={track.key}
                variant={activeTrack === track.key ? "secondary" : "ghost"}
                onClick={() => setActiveTrack(track.key)}
                className={cn(
                  "rounded-xl font-bold transition-all px-4 h-10",
                  activeTrack === track.key ? "bg-primary/20 text-primary border-primary/20" : "text-muted-foreground"
                )}
              >
                {lang === "bn" ? track.bn : track.en}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <Card className="border-none bg-muted/20 shadow-none p-8 rounded-3xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-xl font-black">{lang === "bn" ? "পাথ প্রগ্রেস" : "Path Progress"}</div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                {lang === "bn" ? currentDept?.bn : currentDept?.en} · {lang === "bn" ? currentTrack?.bn : currentTrack?.en}
              </div>
            </div>
            <Badge variant="outline" className="bg-background font-black text-primary px-4 py-1.5 rounded-xl border-2">
              {lang === "bn" ? "১০০% কভারেজ" : "100% Coverage"}
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">
              <span>{lang === "bn" ? "শুরু" : "Onboarding"}</span>
              <span>{lang === "bn" ? "৬ মাস" : "Execution Ready"}</span>
            </div>
            <div className="relative pt-2 pb-6">
              <Progress value={100} className="h-3 rounded-full bg-muted border-none overflow-hidden" />
              <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full flex justify-between px-0">
                {[1, 2, 3, 4, 5, 6].map(month => (
                  <div key={month} className="group relative">
                    <div className="w-8 h-8 rounded-xl bg-background border-2 border-primary/20 flex items-center justify-center text-[10px] font-black text-primary shadow-sm transition-all group-hover:scale-110 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                      {month}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="border-none bg-gradient-to-br from-primary/10 via-background to-brand-green/10 shadow-none">
        <CardHeader>
          <CardTitle className="text-xl font-black flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            {lang === "bn" ? "১ম-৬ষ্ঠ মাস স্টাডি বুক" : "Month 1-6 Study Book"}
          </CardTitle>
          <CardDescription className="text-sm font-medium">
            {lang === "bn"
              ? `মোট ${BOOK_SUMMARY_V1.totalTracks}টি ট্র্যাকের ${BOOK_SUMMARY_V1.totalChapters}টি বই-চ্যাপ্টার প্রস্তুত। নিচে বর্তমান ট্র্যাকের ১ম থেকে ৬ষ্ঠ মাসের চ্যাপ্টার দেখুন।`
              : `${BOOK_SUMMARY_V1.totalTracks} tracks and ${BOOK_SUMMARY_V1.totalChapters} book chapters prepared. Explore month 1 to month 6 chapters for the selected track below.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Accordion type="multiple" defaultValue={chapters.map(chapter => chapter.chapterId)} className="space-y-4">
            {chapters.map(chapter => (
              <ChapterBookCard key={chapter.chapterId} chapter={chapter} lang={lang} />
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        <motion.div key={`${activeDept}-${activeTrack}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease: "easeOut" }}>
          {months.length ? (
            <Accordion type="single" collapsible defaultValue="month-1" className="w-full">
              {months.map(monthData => (
                <MonthCard key={`${activeDept}-${activeTrack}-${monthData.month}`} month={monthData.month} data={monthData} lang={lang} />
              ))}
            </Accordion>
          ) : (
            <Card className="border-none bg-muted/30 shadow-none text-center py-20 rounded-3xl">
              <CardContent>
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-muted rounded-2xl">
                    <Sparkles className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-bold">{lang === "bn" ? "রোডম্যাপ প্রস্তুত হচ্ছে" : "Roadmap is being prepared"}</CardTitle>
                    <CardDescription>{lang === "bn" ? "এই ট্র্যাকের কনটেন্ট শীঘ্রই আপডেট হবে।" : "Content for this track will be updated soon."}</CardDescription>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default RoadmapView;


