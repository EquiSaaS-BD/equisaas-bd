import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Clock, Info, ExternalLink } from "lucide-react";

import Section from "@/components/landing/Section";
import { fadeUp } from "@/components/landing/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { normalizeLocalizedTree } from "@/lib/localized-copy";
import { cn } from "@/lib/utils";

const COPY = normalizeLocalizedTree({
  en: {
    badge: "Verified Sweat Equity Model",
    title: "Degrees are dead. Proof is everything.",
    desc: "We do not believe in fake certificates or empty promises. Every contribution you make is recorded in our LMS with an unbreakable proof URL. Your code, your design, your strategy: that is your real degree.",
    notice: "Our LMS is actively onboarding the first wave of co-builders. These cards show how verified proof directly translates into sweat equity shares.",
    approved: "Approved",
    pending: "Under Review",
    proofLabel: "Proof submitted",
    viewLms: "Enlist and Submit Proof",
    items: [
      {
        id: "1",
        dept: "Frontend Engineering",
        ref: "FE-T-001",
        task: "Responsive Navigation Component",
        proofType: "GitHub Repository Link",
        status: "approved",
      },
      {
        id: "2",
        dept: "UI/UX Design",
        ref: "UIUX-T-002",
        task: "SME Payroll Dashboard Wireframe",
        proofType: "Figma Prototype Link",
        status: "approved",
      },
      {
        id: "3",
        dept: "Backend Engineering",
        ref: "BE-T-001",
        task: "Firebase Query Optimization Exercise",
        proofType: "GitHub Repository Link",
        status: "approved",
      },
      {
        id: "4",
        dept: "Digital Marketing",
        ref: "MKT-T-001",
        task: "Facebook Campaign Reach Analysis",
        proofType: "Google Docs Report Link",
        status: "pending",
      },
      {
        id: "5",
        dept: "DevOps & QA",
        ref: "DEVOPS-T-001",
        task: "CI/CD Pipeline Setup Exercise",
        proofType: "GitHub Actions Workflow Link",
        status: "approved",
      },
      {
        id: "6",
        dept: "Business Analysis & Agile",
        ref: "BA-T-001",
        task: "User Story Mapping for HR Module",
        proofType: "Miro Board Link",
        status: "approved",
      },
    ],
  },
  bn: {
    badge: "যাচাইকৃত সোয়েট ইকুইটি মডেল",
    title: "ডিগ্রির কোনো মূল্য নেই, প্রুফ-ই সবকিছু!",
    desc: "আমরা ভুয়া সার্টিফিকেট বা মিথ্যে প্রতিশ্রুতিতে বিশ্বাস করি না। আপনার প্রতিটি কন্ট্রিবিউশন একটি নির্দিষ্ট proof URL সহ আমাদের LMS-এ সংরক্ষিত থাকে। আপনার কোড, আপনার ডিজাইন, আপনার স্ট্র্যাটেজি: এটাই আপনার আসল পরিচয়।",
    notice: "আমাদের LMS-এ প্রথম ব্যাচের কো-বিল্ডারদের অনবোর্ডিং চলছে। এই কার্ডগুলো দেখাচ্ছে কীভাবে আপনার কাজের প্রমাণ (Verified Proof) সরাসরি কোম্পানির মালিকানার শেয়ারে (Sweat Equity) রূপান্তরিত হয়।",
    approved: "অনুমোদিত",
    pending: "পর্যালোচনাধীন",
    proofLabel: "প্রুফ জমা দেওয়া হয়েছে",
    viewLms: "যুদ্ধে যোগ দিন ও প্রুফ দিন",
    items: [
      {
        id: "1",
        dept: "ফ্রন্টএন্ড ইঞ্জিনিয়ারিং",
        ref: "FE-T-001",
        task: "Responsive Navigation Component",
        proofType: "GitHub Repository Link",
        status: "approved",
      },
      {
        id: "2",
        dept: "UI/UX ডিজাইন",
        ref: "UIUX-T-002",
        task: "SME Payroll Dashboard Wireframe",
        proofType: "Figma Prototype Link",
        status: "approved",
      },
      {
        id: "3",
        dept: "ব্যাকএন্ড ইঞ্জিনিয়ারিং",
        ref: "BE-T-001",
        task: "Firebase Query Optimization Exercise",
        proofType: "GitHub Repository Link",
        status: "approved",
      },
      {
        id: "4",
        dept: "ডিজিটাল মার্কেটিং",
        ref: "MKT-T-001",
        task: "Facebook Campaign Reach Analysis",
        proofType: "Google Docs Report Link",
        status: "pending",
      },
      {
        id: "5",
        dept: "DevOps & QA",
        ref: "DEVOPS-T-001",
        task: "CI/CD Pipeline Setup Exercise",
        proofType: "GitHub Actions Workflow Link",
        status: "approved",
      },
      {
        id: "6",
        dept: "Business Analysis & Agile",
        ref: "BA-T-001",
        task: "User Story Mapping for HR Module",
        proofType: "Miro Board Link",
        status: "approved",
      },
    ],
  },
});



export default function ProofOfWork({ lang, standalone = false }) {
  const t = COPY[lang];

  return (
    <Section id="proof-of-work" className={`relative overflow-hidden ${standalone ? "pt-4 pb-12 md:pb-24" : "bg-muted/30 py-12 md:py-16 lg:py-24"}`}>
      


      <div className="container relative mx-auto space-y-12 px-4 sm:px-6">
        {/* Header */}
        <div className="mx-auto max-w-4xl space-y-5 text-center">
          <motion.div variants={fadeUp} custom={0}>
            <Badge variant="soft" className="rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-xs font-semibold backdrop-blur-md">
              <ShieldCheck className="mr-1 h-3 w-3 inline-block" /> {t.badge}
            </Badge>
          </motion.div>
          <motion.h2 variants={fadeUp} custom={1} className="text-3xl font-black tracking-tight md:text-4xl sm:text-5xl lg:text-6xl text-gradient-brand">
            {t.title}
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="mx-auto max-w-3xl text-lg md:text-xl leading-relaxed text-muted-foreground font-medium">
            {t.desc}
          </motion.p>
        </div>

        {/* Honest notice */}
        <motion.div variants={fadeUp} custom={3} className="mx-auto max-w-2xl">
          <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-xl px-5 py-4 shadow-lg shadow-primary/5">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-sm leading-6 text-muted-foreground font-medium">{t.notice}</p>
          </div>
        </motion.div>

        {/* Mobile/Tablet Grid View */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:hidden px-2 relative z-10">
          {t.items.slice(0, 4).map((item) => {
            const isApproved = item.status === "approved";
            return (
              <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }} key={item.id}>
                <Card className="overflow-hidden h-full rounded-[2rem] border border-border/50 bg-card/90 shadow-xl backdrop-blur-xl hover:border-primary/30 transition-colors">
                  <CardHeader className="p-6 pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">
                        {item.ref}
                      </span>
                      <span className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-[10px] font-bold shadow-inner ${isApproved
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                        }`}>
                        {isApproved
                          ? <CheckCircle2 className="h-3.5 w-3.5" />
                          : <Clock className="h-3.5 w-3.5" />}
                        {isApproved ? t.approved : t.pending}
                      </span>
                    </div>
                    <CardTitle className="text-lg font-black leading-snug">{item.task}</CardTitle>
                    <CardDescription className="text-sm font-bold text-primary mt-2">{item.dept}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 mt-auto">
                    <div className="rounded-xl border border-border/50 bg-muted/40 px-4 py-3 shadow-inner">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">
                        {t.proofLabel}
                      </p>
                      <p className="text-sm font-semibold text-foreground/80 break-words">{item.proofType}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Desktop Infinite Carousel */}
        <div className="hidden lg:flex relative w-full overflow-hidden py-10" style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
          <motion.div
            className="flex w-max gap-8"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 40, repeat: Infinity }}
          >
            {[...t.items, ...t.items].map((item, index) => {
              const isApproved = item.status === "approved";
              return (
                <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }} key={`${item.id}-${index}`} className="w-[380px] shrink-0 h-full">
                    <Card className="h-full flex flex-col overflow-hidden rounded-[2rem] border border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl hover:border-primary/30 transition-colors">
                      <CardHeader className="p-6 pb-4">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">
                            {item.ref}
                          </span>
                          <span className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-[10px] font-bold shadow-inner ${isApproved
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                            }`}>
                            {isApproved
                              ? <CheckCircle2 className="h-3.5 w-3.5" />
                              : <Clock className="h-3.5 w-3.5" />}
                            {isApproved ? t.approved : t.pending}
                          </span>
                        </div>
                        <CardTitle className="text-xl font-black leading-snug">{item.task}</CardTitle>
                        <CardDescription className="text-sm font-bold text-primary mt-2">{item.dept}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 pt-0 mt-auto flex-1 flex flex-col justify-end">
                        <div className="rounded-xl border border-border/50 bg-muted/40 px-4 py-3 shadow-inner">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">
                            {t.proofLabel}
                          </p>
                          <p className="text-sm font-semibold text-foreground/80 break-words">{item.proofType}</p>
                        </div>
                      </CardContent>
                    </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div variants={fadeUp} custom={4} className="flex justify-center pt-8">
          <Button asChild className="rounded-2xl px-10 h-16 text-lg font-bold shadow-xl shadow-primary/20 bg-gradient-to-r from-primary to-[#1e40af] hover:scale-105 transition-transform border border-white/10">
            <a href="/lms/register">
              {t.viewLms} <ExternalLink className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </motion.div>
      </div>
    </Section>
  );
}
