import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  ExternalLink,
  MapPinned,
  Sparkles,
  X,
  Activity,
  Network,
  Database,
  Cpu
} from "lucide-react";

import { APPLICATION_LINK, departments } from "@/data/cofounder";
import { buildApplicationLink } from "@/lib/application-link";
import { normalizeLocalizedTree } from "@/lib/localized-copy";
import { cn } from "@/lib/utils";
import DistrictMapWidget from "@/components/landing/DistrictMapWidget";
import DepartmentFitGuide from "@/components/landing/DepartmentFitGuide";
import { formatDistrictLabel } from "@/data/bangladeshDistricts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const COPY = normalizeLocalizedTree({
  en: {
    badge: "Nine Active Learning Departments",
    title: "Pick the exact department you will learn, build, and contribute through",
    desc: "Explore the 9 dedicated departments built to train, mentor, and prepare you for a solid SaaS career. Each department focuses on real-world practical skills and is 100% free forever.",
    stripTitle: "Practical SaaS Learning",
    stripBody: "9 departments, 4 parent groups, structured curriculums, and proof-based contribution tracking from day one.",
    metricDepartments: "Departments",
    metricGroups: "Groups",
    metricModel: "Model",
    metricModelValue: "One learner, one department",
    parentLabel: "Parent group",
    deepLinkReady: "Registration Route Active",
    districtReady: "Department + district preference",
    deepLinkDesc: "We will apply your preferred department to your official registration application.",
    chooseDistrict: "Choose your district for the 64-district builder network.",
    roadmapTitle: "Department focus",
    resourcesTitle: "Starter resources",
    resourcesBody: "Recommended learning resources for this department.",
    deptGridLabel: "All 9 departments : tap to explore",
    openLms: "Register for this department",
    apply: "Apply now",
    browseMap: "See full learning map",
    change: "Change department",
    roadmapCta: "Core Focus",
    districtEmpty: "No district selected yet",
    districtPrefix: "Selected district",
    notice: "Your preferred department will be recorded on your application.",
    clickHint: "Click any card to see details",
    computingProfile: "Analyzing Learner Profile...",
    allocatingMentors: "Allocating Mentorship Resources...",
    generatingRoadmap: "Generating Custom 90-Day Roadmap...",
    ready: "System Ready. Initializing Dashboard...",
    yourRoadmap: "Your 90-Day Masterplan",
    yourResources: "Initial Loadout",
    missionReady: "Mission Ready: Allocating Seat",
  },
  bn: {
    badge: "লাইভ ৯টি লার্নিং ডিপার্টমেন্ট",
    title: "যে ডিপার্টমেন্টে আপনি শিখবেন, build করবেন, আর contribute করবেন সেটি সরাসরি বেছে নিন",
    desc: "৯টি ডেডিকেটেড ডিপার্টমেন্ট থেকে আপনার পছন্দেরটি বেছে নিন। প্রতিটি ডিপার্টমেন্ট আপনাকে রিয়েল-ওয়ার্ল্ড কাজের জন্য প্রস্তুত করবে এবং সম্পূর্ণ ফ্রিতে আজীবন শেখার সুবিধা দেবে।",
    stripTitle: "প্র্যাকটিক্যাল SaaS লার্নিং",
    stripBody: "৯টি department, ৪টি parent group, স্ট্রাকচার্ড কারিকুলাম, আর day one থেকেই proof-based contribution।",
    metricDepartments: "Departments",
    metricGroups: "Groups",
    metricModel: "Model",
    metricModelValue: "প্রতি learner, একটি department",
    parentLabel: "Parent group",
    deepLinkReady: "রেজিস্ট্রেশন রুট অ্যাক্টিভ",
    districtReady: "Department + জেলা preference",
    deepLinkDesc: "আমরা আপনার preferred department-টি অফিশিয়াল রেজিস্ট্রেশন ফর্মে যুক্ত করব।",
    chooseDistrict: "৬৪ জেলার builder network-এর জন্য আপনার জেলা বেছে নিন।",
    roadmapTitle: "Department focus",
    resourcesTitle: "শুরুর resources",
    resourcesBody: "এই department-এ শেখা শুরু করার জন্য recommended learning resource।",
    deptGridLabel: "সব ৯টি department : ট্যাপ করে দেখুন",
    openLms: "এই ডিপার্টমেন্টে যুক্ত হোন",
    apply: "এখনই আবেদন করুন",
    browseMap: "পূর্ণ লার্নিং ম্যাপ দেখুন",
    change: "Department বদলান",
    roadmapCta: "মূল ফোকাস",
    districtEmpty: "এখনো কোনো জেলা বাছাই হয়নি",
    districtPrefix: "নির্বাচিত জেলা",
    notice: "আপনার পছন্দের ডিপার্টমেন্টটি আপনার অ্যাপ্লিকেশনে রেকর্ড করা হবে।",
    clickHint: "যেকোনো card ক্লিক করে বিস্তারিত দেখুন",
    computingProfile: "প্রোফাইল অ্যানালাইজ করা হচ্ছে...",
    allocatingMentors: "মেন্টরশিপ রিসোর্স অ্যালোকেট করা হচ্ছে...",
    generatingRoadmap: "আপনার ৯০ দিনের কাস্টম রোডম্যাপ তৈরি করা হচ্ছে...",
    ready: "সিস্টেম রেডি। ড্যাশবোর্ড লোড হচ্ছে...",
    yourRoadmap: "আপনার ৯০ দিনের মাস্টারপ্ল্যান",
    yourResources: "ইনিশিয়াল লোডআউট",
    missionReady: "মিশন রেডি: সিট অ্যালোকেশন",
  },
});

const DEPT_STYLES = {
  blue: {
    panel: "from-sky-500/25 via-blue-500/10 to-transparent",
    iconBg: "bg-sky-500/15",
    iconText: "text-sky-600 dark:text-sky-300",
    badge: "bg-sky-500/15 text-sky-700 dark:text-sky-200",
    border: "border-sky-500/30",
    glow: "shadow-sky-500/25",
    activeBorder: "border-sky-500/70 ring-4 ring-sky-500/20",
    hoverBorder: "hover:border-sky-500/50 hover:shadow-sky-500/20",
    progressBar: "bg-gradient-to-r from-sky-400 to-blue-600 text-white",
  },
  emerald: {
    panel: "from-emerald-500/25 via-teal-500/10 to-transparent",
    iconBg: "bg-emerald-500/15",
    iconText: "text-emerald-600 dark:text-emerald-300",
    badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-200",
    border: "border-emerald-500/30",
    glow: "shadow-emerald-500/25",
    activeBorder: "border-emerald-500/70 ring-4 ring-emerald-500/20",
    hoverBorder: "hover:border-emerald-500/50 hover:shadow-emerald-500/20",
    progressBar: "bg-gradient-to-r from-emerald-400 to-teal-600 text-white",
  },
  amber: {
    panel: "from-amber-500/25 via-orange-500/10 to-transparent",
    iconBg: "bg-amber-500/15",
    iconText: "text-amber-600 dark:text-amber-300",
    badge: "bg-amber-500/15 text-amber-700 dark:text-amber-200",
    border: "border-amber-500/30",
    glow: "shadow-amber-500/25",
    activeBorder: "border-amber-500/70 ring-4 ring-amber-500/20",
    hoverBorder: "hover:border-amber-500/50 hover:shadow-amber-500/20",
    progressBar: "bg-gradient-to-r from-amber-400 to-orange-600 text-white",
  },
  purple: {
    panel: "from-fuchsia-500/25 via-violet-500/10 to-transparent",
    iconBg: "bg-fuchsia-500/15",
    iconText: "text-fuchsia-600 dark:text-fuchsia-300",
    badge: "bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-200",
    border: "border-fuchsia-500/30",
    glow: "shadow-fuchsia-500/25",
    activeBorder: "border-fuchsia-500/70 ring-4 ring-fuchsia-500/20",
    hoverBorder: "hover:border-fuchsia-500/50 hover:shadow-fuchsia-500/20",
    progressBar: "bg-gradient-to-r from-fuchsia-400 to-violet-600 text-white",
  },
};

function ComputingOverlay({ lang, onComplete, colorClass }) {
  const t = COPY[lang];
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Disable body scroll
    document.body.style.overflow = "hidden";
    const t1 = setTimeout(() => setStep(1), 700);
    const t2 = setTimeout(() => setStep(2), 1400);
    const t3 = setTimeout(() => setStep(3), 2100);
    const t4 = setTimeout(() => onComplete(), 2600);
    return () => { 
      document.body.style.overflow = "";
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); 
    };
  }, [onComplete]);

  const messages = [t.computingProfile, t.allocatingMentors, t.generatingRoadmap, t.ready];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-2xl"
    >
      <div className="flex flex-col items-center gap-10">
        <div className="relative flex h-40 w-40 items-center justify-center">
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className={cn("absolute inset-0 rounded-full border-b-4 border-l-4 border-t-transparent border-r-transparent", colorClass)} 
          />
          <Cpu className={cn("h-12 w-12 animate-pulse", colorClass)} />
        </div>
        <div className="h-8 overflow-hidden text-center">
          <AnimatePresence mode="wait">
            <motion.p 
              key={step}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className={cn("font-mono text-sm tracking-widest md:text-base uppercase font-bold", colorClass)}
            >
              {messages[step]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function MissionBriefingOverlay({ department, selectedDistrictId, setSelectedDistrictId, lang, onClose }) {
  const t = COPY[lang];
  const style = DEPT_STYLES[department.color] || DEPT_STYLES.blue;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const selectedDistrictLabel = formatDistrictLabel(selectedDistrictId, lang);
  const selectedDepartmentApplyLink = buildApplicationLink({
      departmentId: department.id,
      departmentTitle: lang === "bn" ? department.titleBn : department.titleEn,
  });

  const openPreferredTrack = () => {
    if (typeof window === "undefined") return;
    window.open(selectedDepartmentApplyLink, "_blank", "noopener,noreferrer");
  };

  const focusLearningMap = () => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent("equisaas:focus-learning-map", { detail: { departmentId: department.id } })
    );
    onClose();
    setTimeout(() => {
        document.getElementById("department-learning-map")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex flex-col bg-background/95 backdrop-blur-3xl overflow-y-auto"
    >
      {/* Top Header */}
      <div className={cn("sticky top-0 z-10 border-b bg-background/80 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-sm", style.border)}>
        <div className="flex items-center gap-4">
           <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl shadow-inner", style.iconBg)}>
              <department.icon className={cn("h-6 w-6", style.iconText)} />
           </div>
           <div>
              <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground">{lang === "bn" ? department.parentTitleBn : department.parentTitleEn}</p>
              <h2 className="text-lg md:text-xl font-black tracking-tight leading-none">{lang === "bn" ? department.titleBn : department.titleEn}</h2>
           </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full bg-muted/50 hover:bg-muted shrink-0 h-10 w-10">
           <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 container mx-auto max-w-7xl p-4 md:p-8 space-y-8 md:space-y-12">
          {/* Main Hero of Briefing */}
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 md:gap-12">
             <div className="space-y-6 self-center">
                <Badge variant="outline" className={cn("rounded-full px-4 py-1.5 font-mono uppercase tracking-widest", style.border, style.iconText)}>
                   System Status: Online
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                   Welcome to the <br/>
                   <span className={cn("bg-clip-text text-transparent", style.progressBar)}>
                      {lang === "bn" ? department.titleBn : department.titleEn}
                   </span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                   {lang === "bn" ? department.descBn : department.descEn}
                </p>
             </div>

             {/* Action Card */}
             <div>
               <div className={cn("rounded-3xl border bg-card/60 p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl h-full flex flex-col justify-center", style.border)}>
                 <div className={cn("absolute inset-0 bg-gradient-to-br opacity-20", style.panel)} />
                 <div className="relative z-10 space-y-6">
                    <div className="space-y-3">
                       <p className={cn("text-xs font-black uppercase tracking-[0.22em]", style.iconText)}>
                         {selectedDistrictId ? t.districtReady : t.missionReady}
                       </p>
                       <p className="text-xl md:text-2xl font-bold">
                         {selectedDistrictId ? `${t.districtPrefix}: ${selectedDistrictLabel}` : t.districtEmpty}
                       </p>
                       <p className="text-sm text-muted-foreground">{t.deepLinkDesc}</p>
                    </div>
                    <div className="space-y-3 pt-4">
                       <Button className={cn("w-full h-14 rounded-2xl text-base shadow-lg transition-transform active:scale-95 font-bold", style.progressBar)} onClick={openPreferredTrack}>
                         {t.openLms}
                         <ArrowRight className="ml-2 h-5 w-5" />
                       </Button>
                       <Button variant="outline" className="w-full h-14 rounded-2xl border-border/50 text-base font-semibold" onClick={focusLearningMap}>
                         {t.browseMap}
                       </Button>
                    </div>
                 </div>
               </div>
             </div>
          </div>

          {/* Grid for District, Roadmap, Resources */}
          <div className="grid xl:grid-cols-[1fr_1.5fr_1fr] gap-6 md:gap-8 pb-12">
             {/* District */}
             <div className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                   <MapPinned className="h-5 w-5 text-muted-foreground" />
                   <h3 className="text-xl font-bold">{t.chooseDistrict}</h3>
                </div>
                <div className="rounded-[2rem] border border-border/50 bg-card/40 p-2 shadow-sm">
                   <DistrictMapWidget lang={lang} value={selectedDistrictId} onChange={setSelectedDistrictId} />
                </div>
             </div>

             {/* Roadmap */}
             <div className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                   <Network className="h-5 w-5 text-muted-foreground" />
                   <h3 className="text-xl font-bold">{t.yourRoadmap}</h3>
                </div>
                <div className="space-y-4">
                   {department.roadmap.map((phase, index) => {
                       const items = lang === "bn" ? phase.itemsBn : phase.itemsEn;
                       return (
                         <div key={index} className={cn("rounded-3xl border bg-card/60 p-6 shadow-sm transition-all hover:bg-card/80", style.border)}>
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                               <Badge variant="secondary" className={cn("rounded-xl px-4 py-1.5 font-black uppercase tracking-widest", style.badge)}>
                                  {lang === "bn" ? phase.phaseBn : phase.phaseEn}
                               </Badge>
                               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                  {t.roadmapCta}
                               </span>
                            </div>
                            <ul className="space-y-4">
                              {items.map((item, itemIndex) => (
                                 <li key={itemIndex} className="flex gap-4 text-sm leading-relaxed text-muted-foreground items-start">
                                    <CheckCircle2 className={cn("mt-0.5 h-5 w-5 shrink-0", style.iconText)} />
                                    <span className="font-medium text-foreground/80">{item}</span>
                                 </li>
                              ))}
                            </ul>
                         </div>
                       );
                   })}
                </div>
             </div>

             {/* Resources */}
             <div className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                   <Database className="h-5 w-5 text-muted-foreground" />
                   <h3 className="text-xl font-bold">{t.yourResources}</h3>
                </div>
                <div className="space-y-3">
                   {department.resources.map((resource) => (
                     <a
                       key={resource.url}
                       href={resource.url}
                       target="_blank"
                       rel="noreferrer"
                       className="group flex flex-col gap-3 rounded-3xl border border-border/50 bg-card/60 p-5 transition-all hover:bg-card hover:scale-[1.02] hover:shadow-xl shadow-sm"
                     >
                       <div className="flex justify-between items-start">
                          <p className="font-bold leading-tight group-hover:text-primary transition-colors text-base">{resource.name}</p>
                          <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                       </div>
                       <Badge variant="outline" className="w-fit rounded-full text-[10px] uppercase tracking-widest border-border/60">
                         {resource.type}
                       </Badge>
                     </a>
                   ))}
                </div>
             </div>
          </div>
      </div>
    </motion.div>
  );
}

function TiltCard({ department, index, style, onFocus, lang }) {
  const Icon = department.icon;
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rotateX = useTransform(y, [0, 1], [8, -8]);
  const rotateY = useTransform(x, [0, 1], [-8, 8]);

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    x.set(0.5);
    y.set(0.5);
  }

  return (
    <motion.button
      id={`dept-${department.id}`}
      type="button"
      onClick={() => onFocus(department.id)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "group relative overflow-hidden text-left rounded-[2rem] border bg-card/80 p-6 md:p-8 shadow-sm transition-all duration-300",
        cn("border-border/50 hover:shadow-2xl hover:-translate-y-1", style.hoverBorder),
      )}
    >
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500",
        style.panel,
        "group-hover:opacity-100"
      )} />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-3">
            <div className={cn("flex h-14 w-14 items-center justify-center rounded-[1.25rem] transition-colors duration-300 shadow-sm", style.iconBg, "group-hover:bg-background")}>
              <Icon className={cn("h-6 w-6", style.iconText)} />
            </div>
            <Badge className={cn("rounded-full border-0 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest", style.badge)}>
              {lang === "bn" ? department.parentTitleBn : department.parentTitleEn}
            </Badge>
          </div>
          <div className="space-y-2 flex-grow">
            <h3 className="text-xl md:text-2xl font-black tracking-tight leading-tight">
              {lang === "bn" ? department.titleBn : department.titleEn}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3 font-medium">
              {lang === "bn" ? department.descBn : department.descEn}
            </p>
          </div>
          {/* Psychology-Driven UX: Urgency / Scarcity */}
          <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              {lang === "bn" ? "ভর্তি চলছে" : "Intake Open"}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {lang === "bn" ? `${(index * 3 + 2) % 12 + 1}টি স্লট বাকি` : `${(index * 3 + 2) % 12 + 1} spots left`}
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

export default function DepartmentsExplorer({ lang, standalone = false }) {
  const t = COPY[lang];
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [computationState, setComputationState] = useState("idle");

  const selectedDepartment = useMemo(
    () => (selectedDepartmentId ? departments.find((d) => d.id === selectedDepartmentId) || null : null),
    [selectedDepartmentId]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const preferredDepartmentId = window.sessionStorage.getItem("preferredDeptId");
    if (preferredDepartmentId && departments.some((d) => d.id === preferredDepartmentId)) {
      focusDepartment(preferredDepartmentId);
      window.sessionStorage.removeItem("preferredDeptId");
    }
  }, []);

  const focusDepartment = (departmentId) => {
    setSelectedDepartmentId(departmentId);
    setComputationState("computing");
  };

  const handleComputationComplete = () => {
    setComputationState("ready");
  };

  const handleClose = () => {
    setSelectedDepartmentId(null);
    setComputationState("idle");
  };

  return (
    <section id="departments" className={`relative overflow-hidden ${standalone ? "pt-4 pb-12 md:pb-24" : "py-12 md:py-16 lg:py-24"}`}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute bottom-10 right-0 h-96 w-96 rounded-full bg-coop/10 blur-[120px]" />
      </div>

      <div className="container relative mx-auto space-y-16 px-4 sm:px-6">
        {/* Supreme Hero Section */}
        <div className="mx-auto max-w-5xl space-y-8 text-center pt-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
            <Badge variant="soft" className="rounded-full border border-primary/20 bg-primary/10 px-5 py-2 text-sm font-black tracking-widest uppercase shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)] backdrop-blur-md">
              <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
              {t.badge}
            </Badge>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl font-black tracking-tight md:text-5xl lg:text-7xl leading-tight">
            {t.title}
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg md:text-xl leading-relaxed text-muted-foreground max-w-3xl mx-auto">
            {t.desc}
          </motion.p>
        </div>

        {/* Premium Stats Strip */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
          <Card className="overflow-hidden rounded-[2.5rem] border border-border/50 bg-card/85 shadow-2xl backdrop-blur-xl relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-coop/5" />
            <CardContent className="grid gap-8 p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10 relative z-10">
              <div className="space-y-4 self-center">
                <div className="flex items-center gap-3 text-primary">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                     <Activity className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-black uppercase tracking-[0.22em]">{t.stripTitle}</p>
                </div>
                <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">{t.stripBody}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3 h-full">
                {[
                  { label: t.metricDepartments, value: "9" },
                  { label: t.metricGroups, value: "4" },
                  { label: t.metricModel, value: t.metricModelValue, small: true },
                ].map(({ label, value, small }) => (
                  <div key={label} className="flex flex-col justify-center rounded-[1.5rem] border border-border/60 bg-background/60 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-primary/30 hover:bg-background hover:scale-105">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">{label}</p>
                    <p className={cn("font-black leading-tight", small ? "text-sm" : "text-4xl")}>{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Fit Guide */}
        <div>
          <DepartmentFitGuide lang={lang} onSelectDepartment={focusDepartment} />
        </div>

        {/* Department Grid */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-border/50 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm md:text-base font-black uppercase tracking-[0.2em] text-foreground">{t.deptGridLabel}</p>
                <p className="text-xs text-muted-foreground font-medium">{t.clickHint}</p>
              </div>
            </div>
          </div>

          <div className="hidden md:grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {departments.map((department, index) => {
              const style = DEPT_STYLES[department.color] || DEPT_STYLES.blue;
              return (
                <TiltCard
                  key={department.id}
                  department={department}
                  index={index}
                  style={style}
                  onFocus={focusDepartment}
                  lang={lang}
                />
              );
            })}
          </div>

          {/* Mobile Vertical Stack (Replaced Carousel for better UX) */}
          <div className="grid gap-4 md:hidden">
            {departments.map((department, index) => {
              const Icon = department.icon;
              const style = DEPT_STYLES[department.color] || DEPT_STYLES.blue;

              return (
                <motion.button
                  id={`dept-${department.id}`}
                  key={department.id}
                  type="button"
                  onClick={() => focusDepartment(department.id)}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={cn(
                    "group relative w-full overflow-hidden text-left rounded-[2rem] border bg-card/80 p-6 shadow-sm transition-all duration-300",
                    "border-border/50", style.hoverBorder
                  )}
                >
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br transition-opacity duration-300 rounded-[2rem]",
                    style.panel,
                    "opacity-0 group-hover:opacity-100"
                  )} />

                  <div className="relative">
                    <div className="flex items-center gap-4">
                      <div className={cn("flex shrink-0 h-14 w-14 items-center justify-center rounded-2xl", style.iconBg)}>
                        <Icon className={cn("h-6 w-6", style.iconText)} />
                      </div>
                      <div className="space-y-1">
                        <Badge className={cn("rounded-full border-0 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.18em]", style.badge)}>
                          {lang === "bn" ? department.parentTitleBn : department.parentTitleEn}
                        </Badge>
                        <h3 className="text-xl font-black tracking-tight leading-tight">
                          {lang === "bn" ? department.titleBn : department.titleEn}
                        </h3>
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Global Overlays */}
        <AnimatePresence>
          {computationState === "computing" && selectedDepartment && (
            <ComputingOverlay 
               key="computing-overlay"
               lang={lang} 
               onComplete={handleComputationComplete} 
               colorClass={DEPT_STYLES[selectedDepartment.color]?.iconText}
            />
          )}
          {computationState === "ready" && selectedDepartment && (
            <MissionBriefingOverlay
               key="mission-briefing"
               department={selectedDepartment}
               selectedDistrictId={selectedDistrictId}
               setSelectedDistrictId={setSelectedDistrictId}
               lang={lang}
               onClose={handleClose}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
