import React, { useRef } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  BriefcaseBusiness,
  CircleDot,
  FileCheck2,
  GraduationCap,
  Handshake,
  Layers3,
  MapPinned,
  Network,
  ScanLine,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { normalizeLocalizedTree } from "@/lib/localized-copy";
import { LINKS } from "@/data/cofounder";
import ApplyModal from "@/components/landing/ApplyModal";

import { MagneticButton } from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";
import styles from "./Hero.module.scss";
import { ScarcityBadge } from "@/components/landing/ScarcityBadge";

const HERO_COPY = normalizeLocalizedTree({
  en: {
    eyebrow: "A Grassroots Technology Revolution Across 64 Districts",
    title: "Stop Trading Hours for Nothing.\nBuild Real Products.\nEarn True Ownership.",
    intro:
      "We are breaking the traditional unpaid internship culture. At EquiSaaS BD, we learn together for free, build production-ready software, and share corporate ownership. Your hard work directly translates into Sweat Equity. Start at your own pace: 2, 4, or 8 hours a day. Show your work, change your life.",
    primary: "Start at Your Pace",
    secondary: "Enter LMS",
    community: "See Daily Commitment",
    signal: "Together We Build, Together We Own.",
    liveProof: "Proof before points",
    ownership: "Sweat equity path",
    network: "64 district builder network",
    metrics: [
      { value: "9", label: "Free Learning Departments", icon: Layers3 },
      { value: "64", label: "District Network", icon: MapPinned },
      { value: "70%", label: "Creator Profit Share", icon: UsersRound },
      { value: "100%", label: "Free Forever", icon: ShieldCheck },
    ],
    flow: [
      { title: "Choose", body: "Start with one focused department.", icon: CircleDot },
      { title: "Prove", body: "Submit task evidence for review.", icon: FileCheck2 },
      { title: "Own", body: "Build a transparent contribution record.", icon: BadgeCheck },
    ],
    pathsLabel: "Choose your starting path",
    paths: [
      {
        title: "I want to learn",
        body: "Explore our free departments and start learning on our LMS.",
        cta: "Explore training",
        href: "/#departments",
        icon: GraduationCap,
      },
      {
        title: "I want to contribute",
        body: "See how your code and design turn into certified sweat equity.",
        cta: "See workflow",
        href: "/#proof-of-work",
        icon: Handshake,
      },
      {
        title: "I am a business owner",
        body: "Discover how our offline-first tools like EquiPulse AI can run your store.",
        cta: "SME solutions",
        href: "/sme-software-bangladesh/",
        icon: BriefcaseBusiness,
      },
    ],
    quickLinks: [
      { label: "Departments", href: "/#departments", icon: Layers3 },
      { label: "Proof workflow", href: "/#proof-of-work", icon: ScanLine },
      { label: "SME SaaS", href: "/sme-software-bangladesh/", icon: Network },
    ],
  },
  bn: {
    eyebrow: "৬৪ জেলাজুড়ে মেধা মূল্যায়নের এক নতুন যুগের সূচনা",
    title: "আনপেইড ইন্টার্নশিপের দিন শেষ,\nসরাসরি গড়ুন কোম্পানির অংশীদারিত্ব!",
    intro:
      "আমরা গতানুগতিক শোষণমূলক ফ্রি খাটিয়ে নেওয়ার নিয়ম ভাঙতে এসেছি। EquiSaaS BD হলো দেশের প্রথম ওপেন টেক কো-অপারেটিভ। এখানে সম্পূর্ণ ফ্রিতে ৯টি ডিপার্টমেন্টে হাতে-কলমে কাজ শিখবেন, লাইভ সফটওয়্যার তৈরিতে অংশ নেবেন এবং আপনার প্রতিটা পরিশ্রমের ঘণ্টার বিনিময়ে সরাসরি কোম্পানির অংশীদারিত্ব (Sweat Equity) লাভ করবেন। ডিগ্রির বাঁধন ছেড়ে আপনার কাজের প্রমাণ দিন এবং নিজের ভাগ্যের মালিক নিজে হোন।",
    primary: "আপনার গতিতে শুরু করুন",
    secondary: "LMS এ প্রবেশ",
    community: "দৈনিক commitment দেখুন",
    signal: "Together We Build, Together We Own.",
    liveProof: "Points-এর আগে proof",
    ownership: "Sweat equity path",
    network: "৬৪ জেলার builder network",
    metrics: [
      { value: "৯", label: "ফ্রি লার্নিং ডিপার্টমেন্ট", icon: Layers3 },
      { value: "৬৪", label: "জেলাজুড়ে নেটওয়ার্ক", icon: MapPinned },
      { value: "৭০%", label: "ক্রিয়েটর লভ্যাংশ", icon: UsersRound },
      { value: "১০০%", label: "আজীবন ফ্রি সুবিধা", icon: ShieldCheck },
    ],
    flow: [
      { title: "Choose", body: "একটি focused department দিয়ে শুরু করুন।", icon: CircleDot },
      { title: "Prove", body: "Review-এর জন্য task evidence জমা দিন।", icon: FileCheck2 },
      { title: "Own", body: "Transparent contribution record তৈরি করুন।", icon: BadgeCheck },
    ],
    pathsLabel: "আপনার starting path বেছে নিন",
    paths: [
      {
        title: "আমি শিখতে চাই",
        body: "আমাদের ফ্রি ডিপার্টমেন্টগুলো দেখুন এবং সরাসরি LMS-এ শেখা শুরু করুন।",
        cta: "Training দেখুন",
        href: "/#departments",
        icon: GraduationCap,
      },
      {
        title: "আমি অবদান রাখতে চাই",
        body: "আপনার কোড বা ডিজাইন কীভাবে অংশীদারিত্বে রূপান্তরিত হয় তা জানুন।",
        cta: "Workflow দেখুন",
        href: "/#proof-of-work",
        icon: Handshake,
      },
      {
        title: "আমি একজন ব্যবসায়ী",
        body: "আমাদের অফলাইন-ফার্স্ট EquiPulse AI কীভাবে আপনার দোকান চালাবে তা জানুন।",
        cta: "SME সফটওয়্যার",
        href: "/sme-software-bangladesh/",
        icon: BriefcaseBusiness,
      },
    ],
    quickLinks: [
      { label: "Departments", href: "/#departments", icon: Layers3 },
      { label: "Proof workflow", href: "/#proof-of-work", icon: ScanLine },
      { label: "SME SaaS", href: "/sme-software-bangladesh/", icon: Network },
    ],
  },
});

const revealContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
};

const revealItem = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 22 } },
};

const floatIn = {
  hidden: { opacity: 0, scale: 0.96, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 18 } },
};

export default function Hero({ lang }) {
  const heroRef = useRef(null);
  const t = HERO_COPY[lang];
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 78]);
  const founderY = useTransform(scrollYProgress, [0, 1], [0, -34]);
  const orbitY = useTransform(scrollYProgress, [0, 1], [0, -52]);
  const localeClass = lang === "bn" ? styles.localeBn : styles.localeEn;

  const updateSpotlight = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    event.currentTarget.style.setProperty("--hero-x", `${x}%`);
    event.currentTarget.style.setProperty("--hero-y", `${y}%`);
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className={`${styles.hero} ${localeClass}`}
      onPointerMove={updateSpotlight}
    >

      
      <motion.img
        aria-hidden="true"
        className={styles.heroBackdrop}
        src={lang === "bn" ? "/og-image-bn.svg" : "/og-image.svg"}
        alt=""
        style={{ y: imageY }}
        width="1200"
        height="630"
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
      <div className={styles.colorWash} />
      <div className={styles.spotlight} aria-hidden="true" />
      <motion.div className={styles.orbitLayer} aria-hidden="true" style={{ y: orbitY }}>
        <span className={styles.orbitOne} />
        <span className={styles.orbitTwo} />
        <span className={styles.orbitThree} />
        <span className={styles.orbitPulse} />
      </motion.div>

      {/* NEW Premium SVG-Based 3D Ecosystem Node Grid (Zero Lag) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center opacity-40">
        <svg viewBox="0 0 1000 1000" className="w-[120%] h-[120%] lg:w-[80%] lg:h-[80%] drop-shadow-2xl animate-[spin_120s_linear_infinite]" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="secondaryGrad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="15" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <g strokeWidth="2" opacity="0.6">
            <path d="M 500,200 L 700,350 L 700,650 L 500,800 L 300,650 L 300,350 Z" stroke="url(#primaryGrad)" fill="none" filter="url(#glow)"/>
            <path d="M 500,100 L 850,300 L 850,700 L 500,900 L 150,700 L 150,300 Z" stroke="url(#secondaryGrad)" strokeDasharray="10, 15" fill="none"/>
            <path d="M 500,200 L 500,800 M 300,350 L 700,650 M 700,350 L 300,650" stroke="url(#primaryGrad)" strokeWidth="1"/>
            <circle cx="500" cy="500" r="180" stroke="url(#primaryGrad)" strokeDasharray="5, 10" fill="none" />
            <circle cx="500" cy="200" r="12" fill="url(#primaryGrad)" filter="url(#glow)"/>
            <circle cx="700" cy="350" r="15" fill="url(#secondaryGrad)" filter="url(#glow)"/>
            <circle cx="700" cy="650" r="10" fill="url(#primaryGrad)" filter="url(#glow)"/>
            <circle cx="500" cy="800" r="18" fill="url(#secondaryGrad)" filter="url(#glow)"/>
            <circle cx="300" cy="650" r="10" fill="url(#primaryGrad)" filter="url(#glow)"/>
            <circle cx="300" cy="350" r="15" fill="url(#secondaryGrad)" filter="url(#glow)"/>
            <circle cx="500" cy="500" r="30" fill="var(--color-primary)" opacity="0.3" filter="url(#glow)"/>
          </g>
        </svg>
      </div>

      <div className="container relative z-10">
        <motion.div
          className={styles.heroStage}
          variants={revealContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={revealItem} className={styles.eyebrowLine}>
            <Badge variant="brand" className={styles.heroBadge}>
              <Sparkles size={14} />
              {t.eyebrow}
            </Badge>
            <span className={styles.signalPill}>
              <ShieldCheck size={15} />
              {t.liveProof}
            </span>
          </motion.div>

          <motion.h1 variants={revealItem} className={`${styles.heroTitle} text-gradient-brand`}>
            {t.title}
          </motion.h1>

          <motion.p variants={revealItem} className={styles.heroIntro}>
            {t.intro}
          </motion.p>

          <motion.div variants={revealItem} className={styles.actionDock}>
            <div className="flex flex-col gap-3 items-center sm:items-start">
              <MagneticButton>
                <ApplyModal lang={lang}>
                  <Button type="button" size="xl" variant="brand" className={cn(styles.primaryButton, "shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)] animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]")}>
                    {t.primary}
                    <ArrowRight size={18} />
                  </Button>
                </ApplyModal>
              </MagneticButton>
              <ScarcityBadge lang={lang} />
            </div>

            <MagneticButton>
              <Button asChild size="xl" variant="outline" className={styles.secondaryButton}>
                <a href="/lms/login">
                  <BookOpenCheck size={18} />
                  {t.secondary}
                </a>
              </Button>
            </MagneticButton>

            <Button asChild size="xl" variant="ghost" className={styles.communityButton}>
              <a href={LINKS.fbGroup} target="_blank" rel="noreferrer">
                <UsersRound size={18} />
                {t.community}
              </a>
            </Button>
          </motion.div>

          <motion.div variants={floatIn} className={`${styles.personaRouter} hidden lg:flex`} aria-label={t.pathsLabel}>
            {t.paths.map((path) => {
              const Icon = path.icon;
              return (
                <a key={path.title} href={path.href} className={styles.personaPath}>
                  <span className={styles.personaIcon}>
                    <Icon size={18} />
                  </span>
                  <strong>{path.title}</strong>
                  <p>{path.body}</p>
                  <em>
                    {path.cta}
                    <ArrowRight size={13} />
                  </em>
                </a>
              );
            })}
          </motion.div>

          <motion.div variants={floatIn} className={`${styles.storyRail} hidden lg:flex`} aria-label={t.signal}>
            {t.flow.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className={styles.storyStep}>
                  <span>
                    <Icon size={17} />
                  </span>
                  <strong>{step.title}</strong>
                  <p>{step.body}</p>
                </div>
              );
            })}
          </motion.div>

          <motion.div variants={floatIn} className={`${styles.metricHorizon} hidden lg:flex`}>
            {t.metrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.label} className={styles.metricItem}>
                  <Icon size={18} />
                  <span>{metric.value}</span>
                  <p>{metric.label}</p>
                </div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>

      <motion.nav
        className={`${styles.quickNav} hidden lg:flex`}
        aria-label={lang === "bn" ? "হিরো দ্রুত নেভিগেশন" : "Hero quick navigation"}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.45 }}
      >
        {t.quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <a key={link.href} href={link.href}>
              <Icon size={16} />
              <span>{link.label}</span>
            </a>
          );
        })}
      </motion.nav>

      <motion.div
        className={styles.desktopSignature}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <UsersRound size={18} />
        <span>{t.network}</span>
      </motion.div>
    </section>
  );
}
