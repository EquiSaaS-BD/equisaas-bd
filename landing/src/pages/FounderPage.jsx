import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  Mail,
  MapPin,
  MessageCircle,
  PlayCircle,
  Phone,
  Quote,
  Users,
  ArrowRight,
  Globe2,
  Briefcase,
  Star,
  BadgeCheck,
  Trophy,
} from "lucide-react";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { APPLICATION_LINK, LINKS } from "@/data/cofounder";
import { FOUNDER_MESSAGE, FOUNDER_PROFILE } from "@/data/founder-message";
import { withBrandAssetVersion } from "@/lib/brand-assets";
import Header from "@/components/landing/Header/Header";
import Footer from "@/components/landing/Footer";
import Chatbot from "@/components/chatbot/Chatbot";

const STAT_LABELS = {
  en: [
    { icon: Users, label: "64 district builder vision" },
    { icon: Building2, label: "9 active learning departments" },
    { icon: PlayCircle, label: "LMS, contribution, and product paths" },
  ],
  bn: [
    { icon: Users, label: "৬৪ জেলা জুড়ে নির্মাতা নেটওয়ার্কের পরিকল্পনা" },
    { icon: Building2, label: "৯টি সক্রিয় শেখার ডিপার্টমেন্ট" },
    { icon: PlayCircle, label: "LMS, অবদান, ও পণ্য পর্যায়ের পথ" },
  ],
};

export default function FounderPage({ lang, setLang, theme, setTheme }) {
  const [activeLang, setActiveLang] = useState(lang || "bn");
  const content = FOUNDER_MESSAGE[activeLang];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <Header lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />

      <main className="relative pt-32 pb-24 overflow-hidden">
        {/* Ambient background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-[10%] top-[5%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
          <div className="absolute right-[5%] top-[20%] h-[600px] w-[600px] rounded-full bg-gold/5 blur-[120px]" />
        </div>

        <div className="container mx-auto px-6">
          {/* Editorial Hero */}
          <section className="mb-20 text-center space-y-8" data-reveal="down">
            <Badge variant="outline" className="rounded-full px-5 py-1.5 border-primary/20 text-primary bg-primary/5 text-sm font-black uppercase tracking-widest">
              {activeLang === "bn" ? "ফাউন্ডারের বার্তা" : "Founder's Perspective"}
            </Badge>
            <h1 className="mx-auto max-w-5xl text-5xl font-black tracking-tight sm:text-7xl lg:text-8xl text-editorial leading-[1.05]">
              {activeLang === "bn" ? "একসাথে গড়ি, একসাথে মালিক হই।" : "Together We Build, Together We Own."}
            </h1>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-muted-foreground font-medium">
              {content.intro}
            </p>
          </section>

          {/* Bento Grid Layout */}
          <div className="grid gap-6 lg:grid-cols-12">
            
            {/* Founder Profile - Bento Large (Col 1-4) */}
            <div className="lg:col-span-4 space-y-6">
              <Card className="glass-premium rounded-[2.5rem] border border-border/70 overflow-hidden shadow-elite" data-reveal="left">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={withBrandAssetVersion(FOUNDER_PROFILE.imagePath)}
                    alt={FOUNDER_PROFILE.name}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                </div>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tight flex items-center gap-2">
                      {FOUNDER_PROFILE.name}
                      <BadgeCheck className="h-7 w-7 text-emerald-500 fill-emerald-500/10" />
                    </h2>
                    <p className="text-lg font-bold text-muted-foreground">{FOUNDER_PROFILE.banglaName}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="soft" className="rounded-full px-3 py-1 font-bold">
                      {activeLang === "bn" ? FOUNDER_PROFILE.roleBn : FOUNDER_PROFILE.role}
                    </Badge>
                    <Badge variant="outline" className="rounded-full px-3 py-1 border-border/60 text-muted-foreground">
                      <MapPin className="mr-1.5 h-3.5 w-3.5" />
                      {FOUNDER_PROFILE.location}
                    </Badge>
                  </div>

                  <div className="pt-4 grid gap-3">
                    <Button className="h-14 rounded-2xl font-black shadow-lg shadow-primary/20 transition-all active:scale-95" asChild>
                      <a href={LINKS.founderPortfolio} target="_blank" rel="noreferrer">
                        View Portfolio Hub <ArrowUpRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                    <div className="grid grid-cols-2 gap-3">
                       <Button variant="outline" className="h-12 rounded-xl border-border/70 bg-background/50 hover:bg-background" asChild>
                         <a href={LINKS.founderProjects} target="_blank">Projects</a>
                       </Button>
                       <Button variant="outline" className="h-12 rounded-xl border-border/70 bg-background/50 hover:bg-background" asChild>
                         <a href={LINKS.founderLabs} target="_blank">Public Labs</a>
                       </Button>
                    </div>
                  </div>

                  {/* Psychological UX: Parasocial Interaction */}
                  <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm leading-6">
                    <p className="font-bold text-primary tracking-wide mb-1 flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      {activeLang === "bn" ? "ডিরেক্ট নোট" : "Direct Note"}
                    </p>
                    <p className="text-muted-foreground font-medium">
                      {activeLang === "bn" 
                        ? "আমি ব্যক্তিগতভাবে আমাদের প্রতিটি নতুন মেম্বারের জার্নি ফলো করি। আপনি যদি নিজেই প্রুফ তৈরি করেন, তবে আমার এবং আমার টিমের সরাসরি সাপোর্ট পাবেন।" 
                        : "I personally follow the journey of every new member. If you build proof yourself, you will get direct support from me and my team."}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Stats / Quick Info */}
              <Card className="glass-premium rounded-[2.5rem] border border-border/70 p-8 space-y-6 shadow-elite" data-reveal="up">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary">{activeLang === "bn" ? "সংক্ষিপ্ত তথ্য" : "Quick Stats"}</h3>
                <div className="space-y-4">
                  {STAT_LABELS[activeLang].map((stat, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <stat.icon size={18} />
                      </div>
                      <span className="text-sm font-bold text-muted-foreground leading-tight">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Founder Message - Bento Main (Col 5-12) */}
            <div className="lg:col-span-8 space-y-6">
              <Card className="glass-premium rounded-[3rem] border border-border/70 p-8 sm:p-14 shadow-elite relative overflow-hidden" data-reveal="right">
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                  <Quote size={300} className="rotate-12" />
                </div>
                
                <div className="relative z-10 space-y-12">
                  <div className="flex flex-wrap items-center justify-between gap-6">
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-primary uppercase tracking-[0.4em] mb-2">{activeLang === "bn" ? "অফিশিয়াল স্টেটমেন্ট" : "Official Statement"}</p>
                      <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.1]">{content.title}</h2>
                    </div>
                    
                    <div className="flex bg-muted/50 p-1.5 rounded-2xl border border-border/40 backdrop-blur-md">
                      <button 
                        className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${activeLang === "en" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
                        onClick={() => setActiveLang("en")}
                      >
                        EN
                      </button>
                      <button 
                        className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${activeLang === "bn" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
                        onClick={() => setActiveLang("bn")}
                      >
                        বাংলা
                      </button>
                    </div>
                  </div>

                  <div className="prose prose-xl dark:prose-invert max-w-none">
                    <div className="p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] bg-primary/[0.03] border border-primary/10 shadow-inner">
                      <p className="text-lg sm:text-2xl leading-[1.7] font-medium text-foreground/90 italic">
                        "{content.message}"
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 pt-6 border-t border-border/60">
                    <div className="space-y-1">
                      <p className="text-xl font-black tracking-tight">{content.signoff}</p>
                      <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{FOUNDER_PROFILE.name}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      <Button variant="outline" className="w-full sm:w-auto rounded-full border-border/70" asChild>
                         <a href={`mailto:${LINKS.ceoEmail}`}><Mail className="mr-2 h-4 w-4" /> Contact CEO Office</a>
                      </Button>
                      <Button variant="outline" className="w-full sm:w-auto rounded-full border-border/70" asChild>
                         <a href={LINKS.whatsappLink} target="_blank" rel="noreferrer"><MessageCircle className="mr-2 h-4 w-4" /> WhatsApp Support</a>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* National Achievements Card */}
              <Card className="glass-premium rounded-[2.5rem] border border-border/70 p-8 sm:p-10 shadow-elite" data-reveal="up">
                <div className="flex h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-8">
                  <Trophy size={28} />
                </div>
                <h3 className="text-3xl font-black tracking-tight mb-6">
                  {activeLang === "bn" ? "জাতীয় অর্জন ও স্বীকৃতি" : "National Achievements & Recognition"}
                </h3>
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-3">
                    <span className="text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full">
                      {activeLang === "bn" ? "ইনফিনিটি এআই বিল্ডফেস্ট ২০২৬" : "Infinity AI BuildFest 2026"}
                    </span>
                    <h4 className="font-bold text-lg leading-snug">
                      {activeLang === "bn" ? "ন্যাশনাল ফাইনালিস্ট (ই-কমার্স ট্র্যাক)" : "National Finalist (E-Commerce Track)"}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {activeLang === "bn" 
                        ? "সারা দেশের ৩,৩৬০ জন প্রতিযোগী এবং ৬১২টি টিমের মধ্যে আমাদের ফ্ল্যাগশিপ প্রজেক্ট EquiPulse AI নিয়ে জাতীয় ফাইনালিস্ট হিসেবে ব্র্যাক ইউনিভার্সিটিতে কোয়ালিফাই করেছেন।" 
                        : "Qualified as an official national finalist at BRAC University out of 3,360 contestants and 612 teams with our flagship commerce engine, EquiPulse AI."}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <span className="text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full">
                      {activeLang === "bn" ? "জিরো অলিম্পিয়াড গ্র্যান্ড ফাইনাল (সিজন ২)" : "Zero Olympiad Grand Finals (Season 2)"}
                    </span>
                    <h4 className="font-bold text-lg leading-snug">
                      {activeLang === "bn" ? "জাতীয় চ্যাম্পিয়ন (SDG অ্যাচিভার) - SDG ১৫" : "National Champion (SDG Achiever) - SDG 15"}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {activeLang === "bn" 
                        ? "রাউন্ড ১-এ ৯,৩৩২ জন প্রতিযোগী থেকে রাউন্ড ২-তে ৩,৪০৭ জনে সংকুচিত হওয়া পুল থেকে ১৩ জুন, ২০২৬-এ অনুষ্ঠিত গ্র্যান্ড ফাইনালে Atish Dipankar University of Science & Technology-এর হয়ে SDG ACHIEVER (CHAMPION) হিসেবে জাতীয় চ্যাম্পিয়নশিপ অর্জন করেছেন। TESOL Bangladesh-সহ লার্নিং পার্টনারদের সহায়তায় রিলেভেন্স, ক্রিয়েটিভিটি, কমিউনিকেশন, টেকনিক্যাল কোয়ালিটি ও পরিবেশগত প্রভাব মূল্যায়ন করা হয়।" 
                        : "Out of 9,332 Round 1 contestants narrowed to 3,407 in Round 2, he claimed the SDG ACHIEVER (CHAMPION) title at the Grand Finale on June 13, 2026, representing Atish Dipankar University of Science & Technology. Evaluation by TESOL Bangladesh and learning partners covered relevance, creativity, communication, technical quality, and environmental impact."}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Commitments & Call to Action Bento Items */}
              <div className="grid gap-6 sm:grid-cols-2">
                <Card className="glass-premium rounded-[2.5rem] border border-border/70 p-10 shadow-elite" data-reveal="up">
                  <div className="h-14 w-14 rounded-2xl bg-gold/10 flex items-center justify-center text-gold mb-8">
                    <Star size={28} />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight mb-4">{content.panelTitle}</h3>
                  <div className="space-y-4">
                    {content.facts.slice(0, 3).map((fact, i) => (
                      <div key={i} className="flex gap-4 group">
                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                        <p className="text-sm leading-relaxed text-muted-foreground font-medium group-hover:text-foreground transition-colors">{fact}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="glass-premium rounded-[2.5rem] border border-border/70 p-10 shadow-elite flex flex-col justify-between group overflow-hidden relative">
                  <div className="absolute -bottom-10 -right-10 opacity-[0.05] group-hover:scale-110 transition-transform duration-500">
                    <Globe2 size={240} />
                  </div>
                  <div className="space-y-6 relative z-10">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <Briefcase size={28} />
                    </div>
                    <h3 className="text-2xl font-black tracking-tight">{activeLang === "bn" ? "নতুন দিগন্ত" : "Join the Build"}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground font-medium">
                      {activeLang === "bn" ? "আমাদের কো-বিল্ডার নেটওয়ার্কে যোগ দিন এবং বাংলাদেশের প্রথম ওপেন টেক কো-অপারেটিভের অংশ হোন।" : "Join our co-builder network and be part of Bangladesh's first open tech cooperative."}
                    </p>
                  </div>
                  <div className="pt-10 relative z-10">
                    <Button className="w-full h-14 rounded-2xl font-black text-lg bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-95" asChild>
                      <a href={APPLICATION_LINK} target="_blank">
                        {activeLang === "bn" ? "আবেদন করুন" : "Apply Now"} <ArrowRight className="ml-2 h-5 w-5" />
                      </a>
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer lang={lang} />
      <Chatbot lang={lang} theme={theme} />
    </div>
  );
}
