import React, { useMemo, useState } from "react";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import Slider from "@mui/material/Slider";
import Switch from "@mui/material/Switch";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  BriefcaseBusiness,
  ClipboardCheck,
  FileCheck2,
  FileText,
  GraduationCap,
  Layers3,
  MessageCircle,
  Network,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import ApplyModal from "@/components/landing/ApplyModal";
import Section from "@/components/landing/Section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LINKS } from "@/data/cofounder";
import { normalizeLocalizedTree } from "@/lib/localized-copy";
import { cn } from "@/lib/utils";

const COPY = normalizeLocalizedTree({
  en: {
    badge: "Guided Landing Experience",
    title: "Pick a path and see the official next move before you click.",
    desc:
      "This console keeps the landing page practical: learner, contributor, and SME visitors each get a route grounded in the real LMS, registration, proof, review, and support flow.",
    plannerTitle: "First-week pace planner",
    plannerDesc: "Planning aid only. It does not create LMS status, points, certificates, or approval.",
    hoursLabel: "Weekly focused time",
    hoursSuffix: "hrs/week",
    depthLabel: "Suggested first-week depth",
    detailsLabel: "Show route checkpoints",
    routeLabel: "Official route",
    actionsLabel: "Official actions",
    signalsLabel: "Trust signals",
    chips: ["ApplyModal onboarding", "BN/EN ready", "Proof before points"],
    paces: [
      { max: 3, label: "Quiet starter", progress: 38, note: "Read orientation, choose one department, and avoid switching tracks too early." },
      { max: 6, label: "Steady learner", progress: 58, note: "Complete one lesson rhythm, then prepare one clean proof link." },
      { max: 10, label: "Proof rhythm", progress: 76, note: "Pair learning with reviewed task evidence and keep your records traceable." },
      { max: 16, label: "Builder cadence", progress: 90, note: "Use LMS tasks, mentor/community briefs, and review comments as one contribution loop." },
    ],
    personas: [
      {
        value: "learner",
        label: "Learner",
        title: "Start with one department, then learn inside the LMS.",
        body:
          "Best for students, freshers, and self-learners who need a clear path before joining the contribution workflow.",
        route: "Departments -> LMS login -> lessons -> tasks -> proof submission",
        icon: GraduationCap,
        accent: "sky",
        signals: ["One department first", "Courses and lessons", "Task proof"],
        steps: [
          { title: "Choose the department", body: "Use the live department explorer before you commit to a track.", href: "/#departments", cta: "Open departments", icon: Layers3 },
          { title: "Enter the LMS", body: "Continue through login, courses, lessons, and task pages.", href: "/lms/login", cta: "Open LMS", icon: BookOpenCheck },
          { title: "Prepare proof", body: "Use public, reviewable evidence before points or records are expected.", href: "/#proof-of-work", cta: "See proof flow", icon: FileCheck2 },
        ],
        actions: [
          { kind: "link", href: "/#departments", label: "Find department", icon: Layers3 },
          { kind: "link", href: "/lms/login", label: "Open LMS", icon: BookOpenCheck },
        ],
      },
      {
        value: "contributor",
        label: "Contributor",
        title: "Register cleanly, then move into proof-based contribution.",
        body:
          "Best for builders who want to join the cooperative workflow while keeping review, records, and future ownership alignment traceable.",
        route: "ApplyModal -> registration form -> Community Group -> LMS task proof -> review",
        icon: UsersRound,
        accent: "emerald",
        signals: ["ApplyModal first", "Community Group follow-up", "Role-based review"],
        steps: [
          { title: "Use official onboarding", body: "Open the clean ApplyModal and submit the registration form from there.", cta: "Apply Now", icon: FileText, modal: true },
          { title: "Join Community Group", body: "Join our Facebook Community Group for onboarding follow-up after registration.", href: LINKS.fbGroup, cta: "Open Community Group", external: true, icon: MessageCircle },
          { title: "Submit reviewable work", body: "Proof comes before points, and approval needs a visible review trail.", href: "/#proof-of-work", cta: "Review workflow", icon: ClipboardCheck },
        ],
        actions: [
          { kind: "modal", label: "Apply Now", icon: FileText },
          { kind: "link", href: LINKS.fbGroup, label: "Community Group", icon: MessageCircle, external: true },
        ],
      },
      {
        value: "sme",
        label: "SME",
        title: "Review the Bangladesh-first software direction before requesting help.",
        body:
          "Best for business owners and partners looking at HR, POS, and pharmacy workflow software for Bangladesh SMEs.",
        route: "SME roadmap -> product direction -> support conversation -> future launch updates",
        icon: BriefcaseBusiness,
        accent: "amber",
        signals: ["SME roadmap", "Founder direction", "Support channel"],
        steps: [
          { title: "Read the software roadmap", body: "Start with the public SME software page and current BD ERP POS direction.", href: "/sme-software-bangladesh/", cta: "Open SME roadmap", icon: BriefcaseBusiness },
          { title: "Understand the founder signal", body: "The founder page explains why the cooperative exists and how the work is framed.", href: LINKS.founderPage, cta: "Founder page", icon: BadgeCheck },
          { title: "Contact support", body: "Use WhatsApp for practical questions instead of guessing product availability.", href: LINKS.whatsappLink, cta: "WhatsApp support", external: true, icon: MessageCircle },
        ],
        actions: [
          { kind: "link", href: "/sme-software-bangladesh/", label: "SME roadmap", icon: BriefcaseBusiness },
          { kind: "link", href: LINKS.whatsappLink, label: "WhatsApp", icon: MessageCircle, external: true },
        ],
      },
    ],
  },
  bn: {
    badge: "Guided Landing Experience",
    title: "আপনার path বেছে নিন, তারপর official next move দেখুন।",
    desc:
      "এই console landing page-কে practical রাখে: learner, contributor, আর SME visitor সবাই real LMS, registration, proof, review, আর support flow অনুযায়ী route পায়।",
    plannerTitle: "প্রথম সপ্তাহের pace planner",
    plannerDesc: "এটি শুধু planning aid। এটি LMS status, points, certificate, বা approval তৈরি করে না।",
    hoursLabel: "সাপ্তাহিক focused time",
    hoursSuffix: "ঘণ্টা/সপ্তাহ",
    depthLabel: "প্রথম সপ্তাহের suggested depth",
    detailsLabel: "Route checkpoints দেখান",
    routeLabel: "Official route",
    actionsLabel: "Official actions",
    signalsLabel: "Trust signals",
    chips: ["ApplyModal onboarding", "BN/EN ready", "Proof before points"],
    paces: [
      { max: 3, label: "Quiet starter", progress: 38, note: "Orientation পড়ুন, একটি department বেছে নিন, আর শুরুতেই track বদলাতে যাবেন না।" },
      { max: 6, label: "Steady learner", progress: 58, note: "একটি lesson rhythm complete করুন, তারপর একটি clean proof link প্রস্তুত করুন।" },
      { max: 10, label: "Proof rhythm", progress: 76, note: "Learning-এর সাথে reviewed task evidence যুক্ত করুন এবং record traceable রাখুন।" },
      { max: 16, label: "Builder cadence", progress: 90, note: "LMS task, mentor/community brief, আর review comment একই contribution loop হিসেবে ব্যবহার করুন।" },
    ],
    personas: [
      {
        value: "learner",
        label: "Learner",
        title: "একটি department দিয়ে শুরু করুন, তারপর LMS-এ শিখুন।",
        body:
          "Student, fresher, বা self-learner যারা contribution workflow-তে যাওয়ার আগে clear path চান তাদের জন্য।",
        route: "Departments -> LMS login -> lessons -> tasks -> proof submission",
        icon: GraduationCap,
        accent: "sky",
        signals: ["One department first", "Courses and lessons", "Task proof"],
        steps: [
          { title: "Department বেছে নিন", body: "Track commit করার আগে live department explorer ব্যবহার করুন।", href: "/#departments", cta: "Departments খুলুন", icon: Layers3 },
          { title: "LMS-এ প্রবেশ করুন", body: "Login, courses, lessons, আর task pages দিয়ে এগিয়ে যান।", href: "/lms/login", cta: "LMS খুলুন", icon: BookOpenCheck },
          { title: "Proof প্রস্তুত করুন", body: "Points বা records আশা করার আগে public, reviewable evidence ব্যবহার করুন।", href: "/#proof-of-work", cta: "Proof flow দেখুন", icon: FileCheck2 },
        ],
        actions: [
          { kind: "link", href: "/#departments", label: "Department খুঁজুন", icon: Layers3 },
          { kind: "link", href: "/lms/login", label: "LMS খুলুন", icon: BookOpenCheck },
        ],
      },
      {
        value: "contributor",
        label: "Contributor",
        title: "Clean registration করুন, তারপর proof-based contribution-এ যান।",
        body:
          "যারা cooperative workflow-তে join করে review, records, আর future ownership alignment traceable রাখতে চান তাদের জন্য।",
        route: "ApplyModal -> registration form -> Community Group -> LMS task proof -> review",
        icon: UsersRound,
        accent: "emerald",
        signals: ["ApplyModal first", "Community Group follow-up", "Role-based review"],
        steps: [
          { title: "Official onboarding ব্যবহার করুন", body: "Clean ApplyModal খুলে সেখান থেকে registration form submit করুন।", cta: "Apply Now", icon: FileText, modal: true },
          { title: "কমিউনিটি গ্রুপে যোগ দিন", body: "Registration-এর পরে onboarding follow-up-এর জন্য আমাদের Facebook Community Group-এ join করুন।", href: LINKS.fbGroup, cta: "কমিউনিটি গ্রুপ খুলুন", external: true, icon: MessageCircle },
          { title: "Reviewable কাজ submit করুন", body: "Proof comes before points, আর approval-এর visible review trail দরকার।", href: "/#proof-of-work", cta: "Review workflow", icon: ClipboardCheck },
        ],
        actions: [
          { kind: "modal", label: "Apply Now", icon: FileText },
          { kind: "link", href: LINKS.fbGroup, label: "Community Group", icon: MessageCircle, external: true },
        ],
      },
      {
        value: "sme",
        label: "SME",
        title: "Help request করার আগে Bangladesh-first software direction দেখুন।",
        body:
          "Bangladesh SME-এর HR, POS, এবং pharmacy workflow software নিয়ে ভাবছেন এমন business owner ও partner-দের জন্য।",
        route: "SME roadmap -> product direction -> support conversation -> future launch updates",
        icon: BriefcaseBusiness,
        accent: "amber",
        signals: ["SME roadmap", "Founder direction", "Support channel"],
        steps: [
          { title: "Software roadmap পড়ুন", body: "Public SME software page এবং current BD ERP POS direction দিয়ে শুরু করুন।", href: "/sme-software-bangladesh/", cta: "SME roadmap", icon: BriefcaseBusiness },
          { title: "Founder signal বুঝুন", body: "Founder page ব্যাখ্যা করে cooperative কেন আছে এবং কাজের framing কী।", href: LINKS.founderPage, cta: "Founder page", icon: BadgeCheck },
          { title: "Support-এ কথা বলুন", body: "Product availability guess না করে practical question-এর জন্য WhatsApp ব্যবহার করুন।", href: LINKS.whatsappLink, cta: "WhatsApp support", external: true, icon: MessageCircle },
        ],
        actions: [
          { kind: "link", href: "/sme-software-bangladesh/", label: "SME roadmap", icon: BriefcaseBusiness },
          { kind: "link", href: LINKS.whatsappLink, label: "WhatsApp", icon: MessageCircle, external: true },
        ],
      },
    ],
  },
});

const ACCENT_CLASSES = {
  sky: {
    text: "text-sky-600 dark:text-sky-300",
    bg: "bg-sky-500/10",
    border: "border-sky-500/25",
    rail: "from-sky-500 to-blue-600",
  },
  emerald: {
    text: "text-emerald-600 dark:text-emerald-300",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/25",
    rail: "from-emerald-500 to-teal-600",
  },
  amber: {
    text: "text-amber-600 dark:text-amber-300",
    bg: "bg-amber-500/10",
    border: "border-amber-500/25",
    rail: "from-amber-500 to-orange-600",
  },
};

const muiChipSx = {
  borderRadius: "999px",
  borderColor: "hsl(var(--border))",
  color: "hsl(var(--foreground))",
  backgroundColor: "hsl(var(--background) / 0.72)",
  fontFamily: "var(--font-sans)",
  fontWeight: 800,
  letterSpacing: 0,
  "& .MuiChip-icon": {
    color: "hsl(var(--primary))",
  },
};

const muiSliderSx = {
  color: "hsl(var(--primary))",
  height: 8,
  "& .MuiSlider-rail": {
    opacity: 0.18,
  },
  "& .MuiSlider-track": {
    border: 0,
    background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))",
  },
  "& .MuiSlider-thumb": {
    width: 22,
    height: 22,
    backgroundColor: "hsl(var(--background))",
    border: "3px solid hsl(var(--primary))",
    boxShadow: "0 10px 30px rgba(15, 118, 110, 0.28)",
  },
  "& .MuiSlider-valueLabel": {
    borderRadius: "0.75rem",
    backgroundColor: "hsl(var(--foreground))",
    color: "hsl(var(--background))",
    fontFamily: "var(--font-sans)",
    fontWeight: 800,
  },
};

const muiSwitchSx = {
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "hsl(var(--primary))",
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "hsl(var(--primary))",
    opacity: 0.35,
  },
};

function ActionButton({ action, lang }) {
  const Icon = action.icon;

  if (action.kind === "modal") {
    return (
      <ApplyModal lang={lang}>
        <Button type="button" className="min-h-12 justify-between rounded-2xl">
          <span className="inline-flex items-center gap-2">
            <Icon className="h-4 w-4" />
            {action.label}
          </span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </ApplyModal>
    );
  }

  return (
    <Button asChild variant="outline" className="min-h-12 justify-between rounded-2xl border-primary/20">
      <a href={action.href} target={action.external ? "_blank" : undefined} rel={action.external ? "noreferrer" : undefined}>
        <span className="inline-flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {action.label}
        </span>
        <ArrowRight className="h-4 w-4" />
      </a>
    </Button>
  );
}

function StepLink({ step, index, accent, lang }) {
  const Icon = step.icon;
  const content = (
    <div className="group grid min-h-[8.75rem] gap-3 rounded-[1.35rem] border border-border/60 bg-background/78 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:bg-background hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl", accent.bg, accent.text)}>
          <Icon className="h-5 w-5" />
        </span>
        <span className="rounded-full border border-border/60 bg-muted/60 px-2.5 py-1 text-[10px] font-black text-muted-foreground">
          0{index + 1}
        </span>
      </div>
      <div>
        <h4 className="text-base font-black leading-snug">{step.title}</h4>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.body}</p>
      </div>
      <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-black text-primary">
        {step.cta}
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </span>
    </div>
  );

  if (step.modal) {
    return (
      <ApplyModal lang={lang}>
        <button type="button" className="w-full text-left">
          {content}
        </button>
      </ApplyModal>
    );
  }

  return (
    <a href={step.href} target={step.external ? "_blank" : undefined} rel={step.external ? "noreferrer" : undefined}>
      {content}
    </a>
  );
}

export default function LandingExperienceConsole({ lang }) {
  const t = COPY[lang] || COPY.en;
  const [activePersona, setActivePersona] = useState("learner");
  const [weeklyHours, setWeeklyHours] = useState(6);
  const [showDetails, setShowDetails] = useState(true);

  const active = useMemo(
    () => t.personas.find((persona) => persona.value === activePersona) || t.personas[0],
    [activePersona, t.personas],
  );
  const accent = ACCENT_CLASSES[active.accent] || ACCENT_CLASSES.emerald;
  const pace = t.paces.find((tier) => weeklyHours <= tier.max) || t.paces[t.paces.length - 1];

  return (
    <Section id="landing-experience" className="relative overflow-hidden bg-muted/20 py-20 sm:py-12 md:py-16 lg:py-24">
      <div className="container relative mx-auto px-4 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
          <div className="space-y-6 lg:sticky lg:top-28">
            <div className="space-y-5">
              <Badge variant="soft" className="rounded-full border border-primary/20 bg-primary/5 px-4 py-1">
                {t.badge}
              </Badge>
              <div className="space-y-4">
                <h2 className="max-w-3xl text-3xl font-black tracking-tight sm:text-4xl lg:text-3xl sm:text-4xl lg:text-5xl">
                  {t.title}
                </h2>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                  {t.desc}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {t.chips.map((chip) => (
                <Chip
                  key={chip}
                  icon={<ShieldCheck size={15} />}
                  label={chip}
                  variant="outlined"
                  sx={muiChipSx}
                />
              ))}
            </div>

            <div className="rounded-[1.75rem] border border-border/60 bg-card/86 p-5 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.55)] backdrop-blur-xl sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-xl font-black">{t.plannerTitle}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{t.plannerDesc}</p>
                </div>
                <div className="shrink-0 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-black text-primary">
                  {weeklyHours} {t.hoursSuffix}
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-sm font-bold text-muted-foreground">{t.hoursLabel}</span>
                    <span className="text-sm font-black text-foreground">{pace.label}</span>
                  </div>
                  <Slider
                    aria-label={t.hoursLabel}
                    min={2}
                    max={16}
                    step={1}
                    value={weeklyHours}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value} ${t.hoursSuffix}`}
                    onChange={(_, value) => setWeeklyHours(Array.isArray(value) ? value[0] : value)}
                    sx={muiSliderSx}
                  />
                </div>

                <div aria-live="polite">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-sm font-bold text-muted-foreground">{t.depthLabel}</span>
                    <span className="text-sm font-black text-primary">{pace.progress}%</span>
                  </div>
                  <LinearProgress
                    variant="determinate"
                    value={pace.progress}
                    sx={{
                      height: 10,
                      borderRadius: 999,
                      backgroundColor: "hsl(var(--muted))",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 999,
                        background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))",
                      },
                    }}
                  />
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{pace.note}</p>
                </div>

                <label className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/72 px-4 py-3">
                  <span className="text-sm font-bold">{t.detailsLabel}</span>
                  <span className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-muted"
                        onClick={() => setShowDetails(!showDetails)}
                        role="switch"
                        aria-checked={showDetails}>
                    <span className={cn("pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out", showDetails ? "translate-x-5" : "translate-x-0")} />
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="min-w-0">
            <Tabs value={activePersona} onValueChange={setActivePersona}>
              <TabsList className="grid w-full grid-cols-3 gap-1.5 rounded-[1.45rem] bg-background/78 p-1.5">
                {t.personas.map((persona) => {
                  const Icon = persona.icon;
                  return (
                    <TabsTrigger key={persona.value} value={persona.value} className="gap-2 px-2 sm:px-4">
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{persona.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
            <AnimatePresence mode="wait">
              <motion.div
                key={active.value}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="mt-5 overflow-hidden rounded-[2rem] border border-border/60 bg-card/88 shadow-[0_30px_90px_-52px_rgba(15,23,42,0.6)] backdrop-blur-xl"
              >
                  <div className={cn("h-1.5 w-full bg-gradient-to-r", accent.rail)} />
                  <div className="grid gap-6 p-5 sm:p-6 xl:grid-cols-[0.88fr_1.12fr] xl:p-7">
                    <div className="space-y-5">
                      <div className="flex items-center gap-3">
                        <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl", accent.bg, accent.text)}>
                          {React.createElement(active.icon, { className: "h-6 w-6" })}
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                            {active.label}
                          </p>
                          <p className={cn("text-sm font-black", accent.text)}>{t.routeLabel}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-2xl font-black leading-tight sm:text-3xl">{active.title}</h3>
                        <p className="text-base leading-7 text-muted-foreground">{active.body}</p>
                      </div>

                      <div className={cn("rounded-[1.25rem] border bg-background/78 p-4", accent.border)}>
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">
                          {t.routeLabel}
                        </p>
                        <p className="mt-2 text-sm font-bold leading-6">{active.route}</p>
                      </div>

                      <div className="space-y-3">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">
                          {t.actionsLabel}
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                          {active.actions.map((action) => (
                            <ActionButton key={action.label} action={action} lang={lang} />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {active.signals.map((signal) => (
                          <Chip
                            key={signal}
                            icon={<Network size={15} />}
                            label={signal}
                            variant="outlined"
                            sx={muiChipSx}
                          />
                        ))}
                      </div>

                      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
                        {active.steps.map((step, index) => (
                          <StepLink key={step.title} step={step} index={index} accent={accent} lang={lang} />
                        ))}
                      </div>

                      <AnimatePresence initial={false}>
                        {showDetails && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.24 }}
                            className="overflow-hidden"
                          >
                            <div className="rounded-[1.25rem] border border-border/60 bg-muted/45 p-4">
                              <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">
                                {t.signalsLabel}
                              </p>
                              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                                {active.signals.map((signal) => (
                                  <div key={signal} className="rounded-2xl bg-background/74 px-3 py-2 text-sm font-bold">
                                    {signal}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Section>
  );
}
