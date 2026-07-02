import React, { useRef, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Building2, 
  CreditCard, 
  Download, 
  Pill, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Printer,
  BookOpen,
  LayoutDashboard,
  MessageCircle,
  Brain
} from "lucide-react";

import Section from "@/components/landing/Section";
import { fadeUp } from "@/components/landing/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LINKS } from "@/data/cofounder";
import { normalizeLocalizedTree } from "@/lib/localized-copy";
import { cn } from "@/lib/utils";

const SMENetworkVisual = lazy(() => import("@/components/landing/SMENetworkVisual"));

const COPY = {
  en: {
    badge: "SaaS Products For Bangladesh SMEs",
    title: "Localized SaaS products in development for Bangladesh businesses",
    desc: "EquiSaaS BD builds practical B2B SaaS for Bangladesh SMEs with local onboarding realities, offline capabilities, and community-tested product thinking.",
    cta: "Explore SME Software Directory",
    featuredBadge: "Flagship Live Product",
    featuredTitle: "EquiPulse AI: The Offline-First Retail Intelligence Platform",
    featuredSubtitle: "Tailored specifically for micro-SMEs and local merchants in internet-resilient emerging markets.",
    featuredBody: "EquiPulse AI is a type-safe, production-grade retail engine that brings real-time sales analytics, multimodal Bangla receipt OCR with automated reconciliation, and AI-powered product swipe cards directly to your store. It operates completely offline when connectivity fails, ensuring zero-interruption business operations.",
    featuredPoints: [
      { title: "Offline AI Fallback", desc: "Local Ollama keeps AI active without internet.", icon: Brain },
      { title: "Multimodal Bangla OCR", desc: "Auto-scan and math reconciliation for Bengali receipts.", icon: Globe },
      { title: "Real-Time Local Analytics", desc: "High-performance DuckDB WASM inside your browser.", icon: LayoutDashboard },
      { title: "Secure Local Storage", desc: "Private and secure IndexedDB local database layer.", icon: ShieldCheck }
    ],
    featuredPrimary: "Explore Live Platform",
    featuredSecondary: "WhatsApp for Demo",
    featuredThird: "SME Solutions Overview",
    offlineNote: "Runs completely locally in your browser. No internet required for core operations.",
    stableBadge: "Live",
    versionBadge: "v1.0.0 - Production Ready",
    items: [
      {
        icon: Building2,
        title: "HR and payroll software",
        body: "Designed for Bangladesh teams that need staff records, attendance, payroll workflows, and manager-level visibility without enterprise overhead.",
      },
      {
        icon: CreditCard,
        title: "POS software for retail and small business",
        body: "Focused on practical checkout, stock updates, operator controls, and reporting that local businesses can understand and adopt quickly.",
      },
      {
        icon: Pill,
        title: "Pharmacy inventory software",
        body: "Prepared for medicine stock visibility, purchase tracking, and day-to-day inventory discipline for pharmacy operations in Bangladesh.",
      },
    ],
  },
  bn: {
    badge: "বাংলাদেশি SME-র জন্য SaaS পণ্য",
    title: "বাংলাদেশি ব্যবসার জন্য লোকাল SaaS প্রজেক্ট",
    desc: "EquiSaaS BD বাংলাদেশি ক্ষুদ্র ও মাঝারি ব্যবসায়ের বাস্তব চিত্র এবং অফলাইন চ্যালেঞ্জ মাথায় রেখে প্র্যাকটিক্যাল B2B SaaS গড়ে তুলছে।",
    cta: "SME সফটওয়্যার ডিরেক্টরি দেখুন",
    featuredBadge: "ফ্ল্যাগশিপ লাইভ প্রোডাক্ট",
    featuredTitle: "EquiPulse AI: অফলাইন-ফার্স্ট রিটেইল ইন্টেলিজেন্স ইঞ্জিন",
    featuredSubtitle: "বাংলাদেশের লোকাল মার্চেন্ট ও রিটেইল শপের বাস্তব চ্যালেঞ্জ দূর করতে তৈরি।",
    featuredBody: "EquiPulse AI হলো একটি প্রফেশনাল টাইপ-সেফ রিটেইল ইঞ্জিন যা আপনার ব্যবসার সেলস অ্যানালিটিক্স, বাংলা রিসিট স্ক্যান ও গাণিতিক হিসাব মিলকরণ এবং এআই সোয়াইপ ডিসিশন কার্ডকে এক সুতোয় গাঁথে। এটি ইন্টারনেটের অনুপস্থিতিতেও লোকাল সার্ভারে সম্পূর্ণ কার্যকর থাকে এবং আপনার কোনো ডেটা বাইরে পাঠায় না।",
    featuredPoints: [
      { title: "অফলাইন এআই ফলব্যাক", desc: "ইন্টারনেট না থাকলেও লোকাল Ollama দিয়ে এআই সার্ভিস সচল থাকে।", icon: Brain },
      { title: "বাংলা ও মাল্টিমোডাল OCR", desc: "হাতে লেখা বা প্রিন্ট করা বাংলা মেমো স্ক্যান ও হিসাব মিলকরণ।", icon: Globe },
      { title: "রিয়েল-টাইম লোকাল অ্যানালিটিক্স", desc: "DuckDB WASM দিয়ে ব্রাউজারেই সেকেন্ডের মধ্যে শক্তিশালী বিজনেস রিপোর্ট।", icon: LayoutDashboard },
      { title: "নিরাপদ লোকাল স্টোরেজ", desc: "IndexedDB-এর মাধ্যমে সম্পূর্ণ ব্যক্তিগত ও নিরাপদ লোকাল ব্যাকআপ।", icon: ShieldCheck }
    ],
    featuredPrimary: "সরাসরি প্ল্যাটফর্মে প্রবেশ",
    featuredSecondary: "হোয়াটসঅ্যাপে ডেমো দেখুন",
    featuredThird: "SME সফটওয়্যার সমূহ",
    offlineNote: "আপনার ব্রাউজারেই সম্পূর্ণ অফলাইনে কাজ করে। কোনো অতিরিক্ত সেটআপের ঝামেলা নেই।",
    stableBadge: "লাইভ",
    versionBadge: "v1.0.0 - প্রোডাকশন রেডি",
    items: [
      {
        icon: Building2,
        title: "HR এবং payroll software",
        body: "বাংলাদেশি টিমের জন্য staff record, attendance, payroll workflow, এবং manager-level visibility সহজভাবে পরিচালনার দিকে ফোকাস করা হচ্ছে।",
      },
      {
        icon: CreditCard,
        title: "Retail ও small business POS software",
        body: "প্র্যাকটিক্যাল checkout, stock update, operator control, এবং সহজ রিপোর্টিং-এর জন্য এই product direction তৈরি করা হচ্ছে।",
      },
      {
        icon: Pill,
        title: "Pharmacy inventory software",
        body: "Medicine stock visibility, purchase tracking, এবং দৈনন্দিন inventory discipline বজায় রাখার জন্য local pharmacy workflow মাথায় রাখা হচ্ছে।",
      },
    ],
  },
};

const LOCALIZED_COPY = normalizeLocalizedTree(COPY);

export default function SMESolutions({ lang }) {
  const t = LOCALIZED_COPY[lang];

  return (
    <Section id="sme-solutions" className="py-12 md:py-16 lg:py-24 bg-muted/30 relative overflow-hidden">
      {/* Background Ambient */}
      <div className="absolute top-0 right-0 w-1/2 h-full -z-10 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full animate-pulse" />
      </div>

      <div className="container relative mx-auto px-6 space-y-12">
        <div className="max-w-4xl space-y-5">
          <motion.div variants={fadeUp} custom={0}>
            <Badge variant="soft" className="rounded-full border border-coop/20 bg-coop/5 px-4 py-1 text-coop">
              {t.badge}
            </Badge>
          </motion.div>
          <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-gradient-brand">
            {t.title}
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="max-w-3xl text-lg leading-8 text-muted-foreground">
            {t.desc}
          </motion.p>
        </div>

        {/* Featured BD ERP POS Hero Section */}
        <motion.div variants={fadeUp} custom={3}>
          <Card className="overflow-hidden rounded-[2.5rem] border border-primary/20 bg-gradient-to-br from-card via-card/95 to-primary/5 shadow-2xl shadow-slate-950/10 backdrop-blur-xl relative group">
            
            <div className="absolute top-6 right-6 flex gap-2">
               <Badge className="bg-emerald-500 text-white border-0 rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-wider">
                  {t.stableBadge}
               </Badge>
               <Badge variant="outline" className="border-primary/30 text-primary rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-wider bg-primary/5 backdrop-blur-sm">
                  {t.versionBadge}
               </Badge>
            </div>

            <CardContent className="grid gap-12 p-6 lg:grid-cols-[1fr_auto] lg:p-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <Badge variant="soft" className="w-fit rounded-full border border-primary/20 px-4 py-1 text-primary font-bold uppercase tracking-widest text-[10px]">
                    {t.featuredBadge}
                  </Badge>
                  <div className="space-y-3">
                    <h3 className="text-3xl md:text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-tight">{t.featuredTitle}</h3>
                    <p className="text-xl font-semibold text-primary/80">{t.featuredSubtitle}</p>
                    <p className="max-w-2xl text-base leading-8 text-muted-foreground">{t.featuredBody}</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {t.featuredPoints.map((point, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 rounded-2xl border border-border/50 bg-background/50 p-4 shadow-sm group-hover:bg-background/80 transition-colors"
                    >
                      <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <point.icon className="h-5 w-5" />
                      </span>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-foreground">{point.title}</p>
                        <p className="text-xs text-muted-foreground leading-normal">{point.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 items-center">
                  <Button asChild size="lg" className="rounded-2xl px-8 h-14 text-sm font-bold shadow-xl shadow-primary/20">
                    <a href="https://smepulse.equisaas-bd.com/" target="_blank" rel="noreferrer">
                      <Globe className="h-5 w-5 mr-2" />
                      {t.featuredPrimary}
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="rounded-2xl border-primary/20 px-8 h-14 text-sm font-bold backdrop-blur-sm">
                    <a href={LINKS.whatsappLink} target="_blank" rel="noreferrer">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      {t.featuredSecondary}
                    </a>
                  </Button>
                  <Button asChild variant="ghost" size="lg" className="rounded-2xl px-6 h-14 text-sm font-semibold hover:bg-primary/5">
                    <a href="/sme-software-bangladesh/">
                      {t.featuredThird}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </div>
                
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground/80">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  {t.offlineNote}
                </div>
              </div>

              {/* Visual Element: Glass Window Mockup */}
              <div className="hidden xl:block w-[400px] h-[300px] relative">
                <div className="absolute inset-0 rounded-[2rem] border border-white/10 bg-slate-950/40 backdrop-blur-3xl shadow-2xl overflow-hidden flex flex-col">
                  <div className="h-8 border-b border-white/5 bg-white/5 flex items-center px-4 justify-between">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-red-500/50" />
                      <div className="w-2 h-2 rounded-full bg-amber-500/50" />
                      <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                    </div>
                    <div className="text-[8px] text-white/30 font-mono tracking-widest uppercase">Stable v0.0.21</div>
                  </div>
                  <div className="flex-1 p-4 space-y-4">
                    <div className="flex gap-2">
                       <div className="h-16 w-16 rounded-xl bg-primary/20 animate-pulse" />
                       <div className="flex-1 space-y-2">
                          <div className="h-3 w-1/2 bg-white/10 rounded-full" />
                          <div className="h-2 w-full bg-white/5 rounded-full" />
                          <div className="h-2 w-3/4 bg-white/5 rounded-full" />
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                       <div className="h-20 rounded-xl bg-white/5 border border-white/10 p-3 space-y-2">
                          <div className="h-1.5 w-8 bg-white/20 rounded-full" />
                          <div className="h-3 w-12 bg-white/40 rounded-full" />
                       </div>
                       <div className="h-20 rounded-xl bg-white/5 border border-white/10 p-3 space-y-2">
                          <div className="h-1.5 w-8 bg-white/20 rounded-full" />
                          <div className="h-3 w-12 bg-emerald-500/40 rounded-full" />
                       </div>
                    </div>
                  </div>
                </div>
                {/* Floating Elements */}
                <div className="absolute -bottom-4 -left-4 p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                      <LayoutDashboard className="w-4 h-4" />
                   </div>
                   <div className="text-[10px] font-bold text-white">Live Updates</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Other Products Grid - Bento Style */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {t.items.map((item, index) => {
            const Icon = item.icon;
            // Bento logic: first item spans 2 columns on tablet/desktop if total items odd
            const isLarge = index === 0;
            return (
              <motion.div 
                key={item.title} 
                variants={fadeUp} 
                custom={index + 4}
                className={cn(
                  isLarge ? "md:col-span-2 lg:col-span-1" : "col-span-1"
                )}
              >
                  <Card className="bg-card/80 backdrop-blur-xl border shadow-xl h-full rounded-[2.5rem] border-border/50 group hover:border-primary/20 transition-all duration-300 flex flex-col">
                    <CardHeader className="space-y-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-coop/10 text-coop group-hover:scale-110 transition-transform">
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-2xl font-black leading-tight">{item.title}</CardTitle>
                      <CardDescription className="text-base leading-7 text-muted-foreground">{item.body}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 mt-auto">
                      <div className="flex h-48 w-full items-center justify-center rounded-xl bg-muted/10 border border-border/40 overflow-hidden relative group/card">
                         <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent z-0" />
                         <Icon className="h-16 w-16 text-primary/10 absolute z-0 transition-transform duration-500 group-hover/card:scale-110 group-hover/card:opacity-0" />
                         
                         <div className="absolute inset-0 z-10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700">
                           <Suspense fallback={null}>
                             <SMENetworkVisual index={index} />
                           </Suspense>
                         </div>
                      </div>
                    </CardContent>
                  </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div variants={fadeUp} custom={8} className="flex justify-center pt-8">
          <Button asChild className="bg-gradient-to-br from-primary via-[#1e40af] to-coop border border-white/20 shadow-lg border-0 rounded-2xl px-10 h-16 text-lg font-bold">
            <a href="/sme-software-bangladesh/">
              {t.cta}
              <ArrowRight className="h-5 w-5 ml-2" />
            </a>
          </Button>
        </motion.div>
      </div>
    </Section>
  );
}

