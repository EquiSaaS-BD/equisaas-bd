import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ChevronLeft, Compass, RefreshCcw, Sparkles, Trophy } from "lucide-react";

import { departments } from "@/data/cofounder";
import { buildApplicationLink } from "@/lib/application-link";
import { normalizeLocalizedTree } from "@/lib/localized-copy";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const FIT_COPY = {
  en: {
    badge: "Department Fit Guide",
    title: "Find your perfect department",
    desc: "Answer 4 quick questions to get your personalized department recommendation.",
    note: "This is a guided recommendation. You can always switch departments later.",
    completeHint: "Pick one option to continue.",
    reset: "Start over",
    useResult: "Explore this department",
    applyNow: "Apply with this recommendation",
    basedOn: "Why this fits you",
    bestFit: "Your Best Fit",
    backupFits: "Also worth exploring",
    noResult: "Your recommendation will appear here after completing all steps.",
    stepLabel: "Step",
    resultHint: "We'll highlight this department in the explorer below.",
    unsureTitle: "I'm still unsure",
    unsureBody:
      "That's okay. We'll keep your strongest fit, add backup departments, and open the application with that shortlist so the team can guide you after onboarding.",
    unsureApply: "Apply as undecided but guided",
    unsureSelect: "Show the top option",
    stepOf: "of",
    next: "Next →",
    back: "← Back",
    complete: "See My Result",
    cards: {
      level: {
        title: "What's your starting level?",
        options: [
          { label: "Beginner", value: "beginner", meta: "I want a clean path from scratch.", emoji: "🌱" },
          { label: "Some experience", value: "some", meta: "I know basics and want structured growth.", emoji: "🌿" },
          { label: "Advanced", value: "advanced", meta: "I'm ready for deeper or faster delivery work.", emoji: "🚀" },
        ],
      },
      firstTask: {
        title: "Which week-one task excites you most?",
        options: [
          { label: "Turn a design into a web page", value: "frontend", emoji: "🖥️" },
          { label: "Build APIs and backend logic", value: "backend", emoji: "⚙️" },
          { label: "Set up testing and deployment", value: "devopsqa", emoji: "🔧" },
          { label: "Design user flows and wireframes", value: "uiux", emoji: "🎨" },
          { label: "Create brand assets and visuals", value: "design", emoji: "✏️" },
          { label: "Break requirements into tasks", value: "baagile", emoji: "📋" },
          { label: "Prioritize roadmap and product decisions", value: "pm", emoji: "🗺️" },
          { label: "Plan campaigns and growth experiments", value: "marketing", emoji: "📣" },
          { label: "Support onboarding and user retention", value: "crmcs", emoji: "🤝" },
        ],
      },
      roleInterest: {
        title: "Which role sounds most like you?",
        options: [
          { label: "Hands-on builder", value: "builder", meta: "I want to make and ship visible work.", emoji: "🔨" },
          { label: "Systems thinker", value: "systems", meta: "I enjoy technical depth and correctness.", emoji: "🧠" },
          { label: "Design shaper", value: "design", meta: "I care about usability, flows, and visuals.", emoji: "🎭" },
          { label: "Planner and coordinator", value: "planner", meta: "I like structure and delivery clarity.", emoji: "📊" },
          { label: "Growth operator", value: "growth", meta: "I want to attract, guide, and retain people.", emoji: "📈" },
        ],
      },
      timeAvailability: {
        title: "How much time can you give daily?",
        options: [
          { label: "2 to 3 hours", value: "2 to 3 hours", meta: "Steady but lighter daily commitment.", emoji: "⏰" },
          { label: "4 to 6 hours", value: "4 to 6 hours", meta: "Strong part-time commitment.", emoji: "⏱️" },
          { label: "Full time", value: "Full time", meta: "I can move fast with deeper ownership.", emoji: "🕐" },
        ],
      },
    },
  },
  bn: {
    badge: "ডিপার্টমেন্ট ফিট গাইড",
    title: "আপনার পারফেক্ট ডিপার্টমেন্ট খুঁজুন",
    desc: "৪টি প্রশ্নের উত্তর দিয়ে আপনার ব্যক্তিগত ডিপার্টমেন্ট সুপারিশ পান।",
    note: "এটি একটি guided recommendation। পরে department পরিবর্তনের সুযোগ থাকবে।",
    completeHint: "চালিয়ে যেতে একটি option বেছে নিন।",
    reset: "আবার শুরু করুন",
    useResult: "এই ডিপার্টমেন্ট দেখুন",
    applyNow: "এই recommendation দিয়ে আবেদন করুন",
    basedOn: "কেন এই fit এসেছে",
    bestFit: "আপনার Best Fit",
    backupFits: "এগুলোও দেখুন",
    noResult: "সব ধাপ শেষ করলে এখানে recommendation আসবে।",
    stepLabel: "ধাপ",
    resultHint: "নিচের explorer-এ এই department highlight হবে।",
    unsureTitle: "এখনো নিশ্চিত নই",
    unsureBody: "সমস্যা নেই। strongest fit রেখে backup department-গুলো যুক্ত করব।",
    unsureApply: "Undecided হিসেবে আবেদন করুন",
    unsureSelect: "Top option দেখান",
    stepOf: "এর মধ্যে",
    next: "পরবর্তী →",
    back: "← আগে",
    complete: "আমার ফলাফল দেখুন",
    cards: {
      level: {
        title: "আপনার starting level কোনটা?",
        options: [
          { label: "Beginner", value: "beginner", meta: "একদম শুরু থেকে পরিষ্কার পথ চাই।", emoji: "🌱" },
          { label: "Some experience", value: "some", meta: "basic জানি, structured growth চাই।", emoji: "🌿" },
          { label: "Advanced", value: "advanced", meta: "deep বা fast delivery-র জন্য প্রস্তুত।", emoji: "🚀" },
        ],
      },
      firstTask: {
        title: "প্রথম সপ্তাহে কোন কাজটি করতে সবচেয়ে আগ্রহী?",
        options: [
          { label: "Design থেকে web page বানানো", value: "frontend", emoji: "🖥️" },
          { label: "API আর backend logic তৈরি করা", value: "backend", emoji: "⚙️" },
          { label: "Testing আর deployment setup", value: "devopsqa", emoji: "🔧" },
          { label: "User flow আর wireframe design", value: "uiux", emoji: "🎨" },
          { label: "Brand asset আর visual creative", value: "design", emoji: "✏️" },
          { label: "Requirement ভেঙে task বানানো", value: "baagile", emoji: "📋" },
          { label: "Roadmap আর product decision", value: "pm", emoji: "🗺️" },
          { label: "Campaign আর growth experiment", value: "marketing", emoji: "📣" },
          { label: "Onboarding আর user retention", value: "crmcs", emoji: "🤝" },
        ],
      },
      roleInterest: {
        title: "কোন role আপনার সাথে মেলে?",
        options: [
          { label: "Hands-on builder", value: "builder", meta: "visible কাজ বানাতে ও ship করতে চাই।", emoji: "🔨" },
          { label: "Systems thinker", value: "systems", meta: "technical depth পছন্দ করি।", emoji: "🧠" },
          { label: "Design shaper", value: "design", meta: "usability আর visual quality-তে আগ্রহী।", emoji: "🎭" },
          { label: "Planner", value: "planner", meta: "structure আর delivery clarity পছন্দ করি।", emoji: "📊" },
          { label: "Growth operator", value: "growth", meta: "মানুষ আনা, guide করা পছন্দ করি।", emoji: "📈" },
        ],
      },
      timeAvailability: {
        title: "প্রতিদিন কত সময় দিতে পারবেন?",
        options: [
          { label: "২-৩ ঘণ্টা", value: "2 to 3 hours", meta: "হালকা কিন্তু steady commitment.", emoji: "⏰" },
          { label: "৪-৬ ঘণ্টা", value: "4 to 6 hours", meta: "Strong part-time commitment.", emoji: "⏱️" },
          { label: "Full time", value: "Full time", meta: "দ্রুত এগিয়ে deeper ownership নিতে চাই।", emoji: "🕐" },
        ],
      },
    },
  },
};

const LOCALIZED_FIT_COPY = normalizeLocalizedTree(FIT_COPY);

const QUESTION_CONFIG = [
  {
    id: "level",
    weights: [
      { uiux: 3, design: 3, marketing: 2, crmcs: 2, baagile: 2, frontend: 1 },
      { frontend: 2, backend: 2, uiux: 2, design: 2, marketing: 2, baagile: 1, pm: 1 },
      { backend: 3, devopsqa: 3, frontend: 2, pm: 2, baagile: 1 },
    ],
  },
  {
    id: "firstTask",
    weights: [
      { frontend: 5, uiux: 2, design: 1 },
      { backend: 5, devopsqa: 2, baagile: 1 },
      { devopsqa: 5, backend: 2 },
      { uiux: 5, design: 2, pm: 1 },
      { design: 5, marketing: 2, uiux: 1 },
      { baagile: 5, pm: 2, crmcs: 1 },
      { pm: 5, baagile: 2, marketing: 1 },
      { marketing: 5, crmcs: 2, design: 1 },
      { crmcs: 5, marketing: 2, baagile: 1 },
    ],
  },
  {
    id: "roleInterest",
    weights: [
      { frontend: 3, backend: 2, design: 1 },
      { backend: 3, devopsqa: 3, frontend: 1 },
      { uiux: 3, design: 3, marketing: 1 },
      { baagile: 3, pm: 3, crmcs: 1 },
      { marketing: 3, crmcs: 3, pm: 1 },
    ],
  },
  {
    id: "timeAvailability",
    weights: [
      { design: 2, uiux: 2, marketing: 2, baagile: 1, crmcs: 1 },
      { frontend: 2, uiux: 2, marketing: 2, baagile: 1, pm: 1, crmcs: 1 },
      { backend: 2, devopsqa: 2, pm: 2, frontend: 1, crmcs: 1 },
    ],
  },
];

const UNSURE_FALLBACKS = {
  beginner: ["uiux", "design", "marketing"],
  some: ["frontend", "uiux", "baagile"],
  advanced: ["backend", "devopsqa", "pm"],
  default: ["frontend", "uiux", "marketing"],
};

function rankDepartments(answers) {
  const scores = Object.fromEntries(departments.map((d) => [d.id, 0]));
  for (const question of QUESTION_CONFIG) {
    const choiceIndex = answers[question.id];
    if (choiceIndex == null) continue;
    const weights = question.weights[choiceIndex] || {};
    for (const [deptId, score] of Object.entries(weights)) {
      scores[deptId] = (scores[deptId] || 0) + score;
    }
  }
  return departments
    .map((d) => ({ ...d, score: scores[d.id] || 0 }))
    .sort((a, b) => b.score - a.score || a.titleEn.localeCompare(b.titleEn));
}

function getAnswerMeta(copy, questionId, optionIndex) {
  if (optionIndex == null) return "";
  return copy.cards[questionId].options[optionIndex]?.label || "";
}

const DEPT_COLORS = {
  blue: "from-sky-500/20 to-blue-500/10 border-sky-500/30 text-sky-600 dark:text-sky-300",
  emerald: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-300",
  amber: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-600 dark:text-amber-300",
  purple: "from-fuchsia-500/20 to-violet-500/10 border-fuchsia-500/30 text-fuchsia-600 dark:text-fuchsia-300",
};

const slideVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
};

export default function DepartmentFitGuide({ lang, onSelectDepartment }) {
  const t = LOCALIZED_FIT_COPY[lang];
  const [answers, setAnswers] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [showUnsurePath, setShowUnsurePath] = useState(false);

  const totalSteps = QUESTION_CONFIG.length;
  const currentQuestion = QUESTION_CONFIG[currentStep];
  const currentAnswer = answers[currentQuestion?.id];
  const hasAnswer = currentAnswer != null;

  const rankedDepartments = useMemo(() => rankDepartments(answers), [answers]);
  const primaryDepartment = showResult ? rankedDepartments[0] : null;
  const backupDepartments = showResult ? rankedDepartments.slice(1, 3) : [];

  const levelIndex = answers.level;
  const levelValue = levelIndex != null ? t.cards.level.options[levelIndex]?.value : "";
  const timeIndex = answers.timeAvailability;
  const timeValue = timeIndex != null ? t.cards.timeAvailability.options[timeIndex]?.value : "";
  const roleLabel = getAnswerMeta(t, "roleInterest", answers.roleInterest);
  const firstTaskLabel = getAnswerMeta(t, "firstTask", answers.firstTask);
  const levelLabel = getAnswerMeta(t, "level", levelIndex);
  const timeLabel = getAnswerMeta(t, "timeAvailability", timeIndex);

  const selectedReasons = QUESTION_CONFIG.map((question) => {
    const optionIndex = answers[question.id];
    if (optionIndex == null) return null;
    return t.cards[question.id].options[optionIndex]?.label || null;
  }).filter(Boolean);

  const unsureDepartments = useMemo(() => {
    const fallbackIds = levelValue ? UNSURE_FALLBACKS[levelValue] || UNSURE_FALLBACKS.default : UNSURE_FALLBACKS.default;
    return fallbackIds.map((id) => departments.find((d) => d.id === id)).filter(Boolean);
  }, [levelValue]);

  const recommendedApplyLink = primaryDepartment
    ? buildApplicationLink({
        departmentId: primaryDepartment.id,
        departmentTitle: lang === "bn" ? primaryDepartment.titleBn : primaryDepartment.titleEn,
        level: levelValue,
        levelLabel,
        timeAvailability: timeValue,
        timeLabel,
        roleLabel,
        firstTaskLabel,
        backups: backupDepartments.map((d) => (lang === "bn" ? d.titleBn : d.titleEn)),
      })
    : null;

  const handleSelect = (optionIndex) => {
    setAnswers((cur) => ({ ...cur, [currentQuestion.id]: optionIndex }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((s) => s - 1);
      setShowResult(false);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStep(0);
    setDirection(1);
    setShowResult(false);
    setShowUnsurePath(false);
  };

  const progressPct = ((currentStep + (showResult ? 1 : 0)) / totalSteps) * 100;
  const deptColor = primaryDepartment ? DEPT_COLORS[primaryDepartment.color] || DEPT_COLORS.blue : "";

  if (showResult && primaryDepartment) {
    return (
      <Card className="overflow-hidden rounded-[2rem] border border-border/50 bg-card/85 shadow-xl backdrop-blur-xl">
        <div className="h-1.5 w-full bg-muted">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-coop"
            initial={{ width: "75%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <CardHeader className="space-y-4 p-6 lg:p-8">
          <div className="flex items-center justify-between">
            <Badge variant="soft" className="rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-xs font-semibold">
              {t.badge}
            </Badge>
            <Button type="button" variant="ghost" size="sm" className="rounded-full text-xs" onClick={handleReset}>
              <RefreshCcw className="mr-1.5 h-3.5 w-3.5" />
              {t.reset}
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"
            >
              <Trophy className="h-6 w-6" />
            </motion.div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">{t.bestFit}</p>
              <CardTitle className="text-2xl font-black tracking-tight">
                {lang === "bn" ? primaryDepartment.titleBn : primaryDepartment.titleEn}
              </CardTitle>
            </div>
          </div>
          <CardDescription className="text-base leading-7 text-muted-foreground">
            {lang === "bn" ? primaryDepartment.descBn : primaryDepartment.descEn}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 p-6 pt-0 lg:p-8 lg:pt-0">
          {selectedReasons.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">{t.basedOn}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {selectedReasons.map((reason) => (
                  <div key={reason} className="flex gap-3 rounded-[1.25rem] border border-border/50 bg-background/80 px-4 py-3 text-sm leading-6">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-coop" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {backupDepartments.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-3">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">{t.backupFits}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {backupDepartments.map((dept) => (
                  <div key={dept.id} className="rounded-[1.25rem] border border-border/50 bg-background/80 px-4 py-3 text-sm">
                    <p className="font-semibold">{lang === "bn" ? dept.titleBn : dept.titleEn}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{lang === "bn" ? dept.descBn : dept.descEn}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid gap-3 sm:grid-cols-2"
          >
            <Button type="button" className="rounded-2xl" onClick={() => onSelectDepartment(primaryDepartment.id)}>
              {t.useResult}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button type="button" variant="outline" asChild className="rounded-2xl border-primary/20">
              <a href={recommendedApplyLink} target="_blank" rel="noreferrer">
                {t.applyNow}
              </a>
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="rounded-2xl sm:col-span-2"
              onClick={() => setShowUnsurePath((cur) => !cur)}
            >
              <Compass className="h-4 w-4" />
              {t.unsureTitle}
            </Button>
          </motion.div>

          <AnimatePresence>
            {showUnsurePath && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="space-y-4 rounded-[1.5rem] border border-border/50 bg-background/80 p-5">
                  <p className="text-sm leading-6 text-muted-foreground">{t.unsureBody}</p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {unsureDepartments.map((dept) => (
                      <div key={dept.id} className="rounded-[1.25rem] border border-border/50 bg-card/70 p-3 text-sm">
                        <p className="font-semibold">{lang === "bn" ? dept.titleBn : dept.titleEn}</p>
                      </div>
                    ))}
                  </div>
                  <Button type="button" className="w-full rounded-2xl" onClick={() => onSelectDepartment(primaryDepartment.id)}>
                    {t.unsureSelect}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    );
  }

  // ── Stepper View ──
  const currentOpts = t.cards[currentQuestion.id].options;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <Card className="overflow-hidden rounded-[2rem] border border-border/50 bg-card/85 shadow-xl backdrop-blur-xl">
      {/* Progress bar */}
      <div className="h-1.5 w-full bg-muted">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-coop"
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      <CardHeader className="space-y-4 p-6 lg:p-8">
        <div className="flex items-center justify-between">
          <Badge variant="soft" className="rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-xs font-semibold">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            {t.badge}
          </Badge>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-muted-foreground">
              {t.stepLabel} {currentStep + 1} {t.stepOf} {totalSteps}
            </span>
            <Button type="button" variant="ghost" size="sm" className="rounded-full text-xs" onClick={handleReset}>
              <RefreshCcw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Step dots */}
        <div className="flex gap-2">
          {QUESTION_CONFIG.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i < currentStep
                  ? "w-6 bg-primary"
                  : i === currentStep
                    ? "w-10 bg-primary"
                    : "w-2 bg-muted-foreground/30"
              )}
            />
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-0 lg:p-8 lg:pt-0">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5"
          >
            <h3 className="text-xl font-black leading-snug tracking-tight md:text-2xl">
              {t.cards[currentQuestion.id].title}
            </h3>

            <div className={cn("grid gap-3", currentOpts.length > 4 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2")}>
              {currentOpts.map((option, optionIndex) => {
                const active = currentAnswer === optionIndex;
                return (
                  <motion.button
                    key={`${currentQuestion.id}-${optionIndex}`}
                    type="button"
                    onClick={() => handleSelect(optionIndex)}
                    whileHover={{ scale: active ? 1 : 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      "group relative rounded-[1.25rem] border p-4 text-left text-sm leading-6 transition-all duration-200",
                      active
                        ? "border-primary bg-primary/8 shadow-md ring-2 ring-primary/30"
                        : "border-border/60 bg-card/60 hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl select-none">{option.emoji}</span>
                      <div>
                        <span className="block font-bold text-foreground">{option.label}</span>
                        {option.meta && (
                          <span className="mt-1 block text-xs leading-5 text-muted-foreground">{option.meta}</span>
                        )}
                      </div>
                    </div>
                    <AnimatePresence>
                      {active && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute right-3 top-3"
                        >
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-2xl"
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                {t.back}
              </Button>
              <AnimatePresence>
                {hasAnswer && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                    <Button type="button" className="rounded-2xl px-6" onClick={handleNext}>
                      {isLastStep ? t.complete : t.next}
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
              {!hasAnswer && (
                <p className="text-sm text-muted-foreground">{t.completeHint}</p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
