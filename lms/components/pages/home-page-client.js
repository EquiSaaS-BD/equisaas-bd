"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Briefcase, ClipboardCheck, Globe2, Languages, ShieldCheck, Users2 } from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { BuildingNowTicker } from "@/components/leaderboards/building-now-ticker";
import { useLocale } from "@/components/providers/locale-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MAIN_SITE_URL } from "@/lib/urls";

const pillars = [
  {
    icon: BookOpen,
    en: "Department learning paths",
    bn: "ডিপার্টমেন্টভিত্তিক লার্নিং পাথ",
    enBody: "Every co-builder gets a structured Week 1 foundations course with real external resources.",
    bnBody: "প্রতিটি co-builder বাস্তব এক্সটার্নাল রিসোর্সসহ সাজানো Week 1 foundations course পায়।",
  },
  {
    icon: ClipboardCheck,
    en: "Proof-based task system",
    bn: "প্রুফভিত্তিক টাস্ক সিস্টেম",
    enBody: "Each lesson connects to a proof task so completion, review, and Sweat Equity Units stay traceable.",
    bnBody: "প্রতিটি লেসনের সঙ্গে একটি প্রুফ টাস্ক যুক্ত থাকে, যাতে completion, review এবং Sweat Equity Unit সবই traceable থাকে।",
  },
  {
    icon: Briefcase,
    en: "Mentorship and governance",
    bn: "মেন্টরশিপ ও গভর্ন্যান্স",
    enBody: "Mentors, department stewards, governance stewards, and ecosystem custodians work in scoped queues and core governance screens.",
    bnBody: "Mentor, department steward, governance steward এবং ecosystem custodian scoped queue ও core governance screen থেকে কাজ করেন।",
  },
];

const roleCards = [
  ["Co-builder", "কো-বিল্ডার"],
  ["Mentor", "মেন্টর"],
  ["Department Steward", "ডিপার্টমেন্ট স্টিউয়ার্ড"],
  ["Governance Steward", "গভর্ন্যান্স স্টিউয়ার্ড"],
  ["Ecosystem Custodian", "ইকোসিস্টেম কাস্টডিয়ান"],
];

export default function HomePage() {
  const { copy } = useLocale();

  return (
    <PublicShell>
      <div className="space-y-12 sm:space-y-20">
        {/* Editorial Hero */}
        <section className="text-center space-y-8 py-10 sm:py-20" data-reveal="down">
          <Badge variant="outline" className="rounded-full px-5 py-1.5 border-primary/20 text-primary bg-primary/5 text-sm font-bold uppercase tracking-widest">
            {copy("The Ecosystem Workspace", "ইকোসিস্টেম ওয়ার্কস্পেস")}
          </Badge>
          <h1 className="mx-auto max-w-5xl text-5xl font-black tracking-tight sm:text-7xl lg:text-8xl text-editorial leading-[1.1]">
            {copy(
              "Build Real SaaS. Together.",
              "বাস্তব SaaS গড়ুন। একসাথে।"
            )}
          </h1>
          <p className="mx-auto max-w-3xl text-lg sm:text-xl leading-relaxed text-muted-foreground font-medium">
            {copy(
              "Enter the EquiSaaS BD workspace for structured learning, task submission, and traceable contribution records.",
              "সাজানো লার্নিং, টাস্ক সাবমিশন এবং ট্রেসযোগ্য কন্ট্রিবিউশন রেকর্ডের জন্য EquiSaaS BD ওয়ার্কস্পেসে প্রবেশ করুন।"
            )}
          </p>
          <div className="flex justify-center pt-2">
            <BuildingNowTicker />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button className="h-16 px-10 rounded-2xl text-lg font-black shadow-2xl shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95" asChild>
              <Link href="/login">
                {copy("Enter Workspace", "ওয়ার্কস্পেসে প্রবেশ")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" className="h-16 px-10 rounded-2xl text-lg font-bold border-border/70 bg-background/50 backdrop-blur-xl hover:bg-background transition-all active:scale-95" asChild>
              <Link href="/register">{copy("Start Learning", "শেখা শুরু করুন")}</Link>
            </Button>
          </div>
        </section>

        {/* Bento Grid */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-reveal="up">
          {/* Main Bento Item: Learning Path */}
          <Card className="sm:col-span-2 glass-premium rounded-[2.5rem] border border-border/70 p-8 sm:p-12 overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <BookOpen className="h-7 w-7" />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-black tracking-tight">{copy("Structured Learning Path", "সাজানো লার্নিং পাথ")}</h2>
                <p className="text-lg leading-relaxed text-muted-foreground max-w-xl">
                  {copy(
                    "Every co-builder follows a curated path designed for real-world production. From foundations to advanced architecture.",
                    "প্রতিটি কো-বিল্ডার একটি বাস্তবসম্মত প্রোডাকশন-রেডি লার্নিং পাথ অনুসরণ করে। বেসিক থেকে অ্যাডভান্সড আর্কিটেকচার পর্যন্ত।"
                  )}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 pt-4">
                {["Engineering", "UI/UX", "Product", "Operations"].map(tag => (
                  <span key={tag} className="px-4 py-2 rounded-xl bg-background/50 border border-border/60 text-sm font-bold">{tag}</span>
                ))}
              </div>
            </div>
            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
              <BookOpen className="h-64 w-64 rotate-12" />
            </div>
          </Card>

          {/* Bento Item: Stats */}
          <Card className="glass-premium rounded-[2.5rem] border border-border/70 p-8 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-primary">{copy("Community Stats", "কমিউনিটি স্ট্যাট")}</span>
              <h3 className="text-xl font-bold">{copy("Growing fast", "দ্রুত বাড়ছে")}</h3>
            </div>
            <div className="py-8 space-y-6">
              <div>
                <p className="text-5xl font-black tracking-tighter">9</p>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1">{copy("Departments", "ডিপার্টমেন্ট")}</p>
              </div>
              <div className="h-px bg-border/60" />
              <div>
                <p className="text-5xl font-black tracking-tighter">64</p>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1">{copy("Districts", "জেলা")}</p>
              </div>
            </div>
          </Card>

          {/* Bento Item: Proof system */}
          <Card className="glass-premium rounded-[2.5rem] border border-border/70 p-8 group">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                <ClipboardCheck className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-black tracking-tight">{copy("Proof System", "প্রুফ সিস্টেম")}</h3>
              <p className="text-sm leading-7 text-muted-foreground">
                {copy(
                  "No generic completion. Every lesson requires proof of work, reviewed by mentors to ensure real skill growth.",
                  "কোনো জেনেরিক সার্টিফিকেট নয়। প্রতিটি লেসনের জন্য কাজের প্রমাণ প্রয়োজন, যা মেন্টররা রিভিউ করেন।"
                )}
              </p>
            </div>
          </Card>

          {/* Bento Item: Ownership */}
          <Card className="glass-premium rounded-[2.5rem] border border-border/70 p-8 sm:col-span-2 group relative overflow-hidden">
            <div className="relative z-10 flex flex-col sm:flex-row gap-8 items-start sm:items-center h-full">
              <div className="h-16 w-16 rounded-2xl bg-gold/10 flex items-center justify-center text-gold shrink-0">
                <Briefcase className="h-8 w-8" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black tracking-tight">{copy("Sweat Equity & Ownership", "সোয়েট ইক্যুইটি ও মালিকানা")}</h3>
                <p className="text-base leading-7 text-muted-foreground max-w-lg">
                  {copy(
                    "Your contributions translate directly into ownership units. Build real software, earn real equity in the cooperative.",
                    "আপনার অবদান সরাসরি মালিকানার ইউনিটে রূপান্তরিত হয়। বাস্তব সফটওয়্যার গড়ুন, কো-অপারেটিভের মালিকানা অর্জন করুন।"
                  )}
                </p>
              </div>
              <div className="mt-auto sm:mt-0 sm:ml-auto">
                <Button variant="outline" className="rounded-xl border-gold/30 text-gold hover:bg-gold/10" asChild>
                  <Link href="/register">Join Now</Link>
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Call to action footer area */}
        <section className="text-center py-12" data-reveal="up">
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.3em] mb-6">
            {copy("Ready to start?", "আপনি কি তৈরি?")}
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a className="text-primary font-black hover:underline underline-offset-8 transition-all" href={MAIN_SITE_URL}>
              {copy("Main Site", "মূল সাইট")}
            </a>
            <a className="text-primary font-black hover:underline underline-offset-8 transition-all" href="/founder/">
              {copy("Founder's Message", "ফাউন্ডারের বার্তা")}
            </a>
            <a className="text-primary font-black hover:underline underline-offset-8 transition-all" href="https://wa.me/8801570212260">
              WhatsApp Support
            </a>
          </div>
        </section>
      </div>
    </PublicShell>
  );
}
