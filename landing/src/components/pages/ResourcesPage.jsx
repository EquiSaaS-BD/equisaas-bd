import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, BookOpen, Cpu, Store } from "lucide-react";
import { normalizeLocalizedTree } from "@/lib/localized-copy";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/landing/Header/Header";
import Footer from "@/components/landing/Footer";
import AmbientBackdrop from "@/components/landing/AmbientBackdrop";
import Chatbot from "@/components/chatbot/Chatbot";
import { fadeUp } from "@/components/landing/motion";

const COPY = normalizeLocalizedTree({
  en: {
    heroTitle: "Resources & Insights",
    heroSubtitle: "Free knowledge base for Bangladesh SMEs, students, and tech enthusiasts. Learn how software transforms local businesses.",
    allArticles: "All Articles",
    readMore: "Read Full Guide",
    minRead: "min read"
  },
  bn: {
    heroTitle: "রিসোর্স ও ইনসাইটস",
    heroSubtitle: "বাংলাদেশের SME, শিক্ষার্থী এবং প্রযুক্তিপ্রেমীদের জন্য বিনামূল্যে জ্ঞানভান্ডার। সফটওয়্যার কীভাবে আপনার ব্যবসা পরিবর্তন করতে পারে তা জানুন।",
    allArticles: "সকল আর্টিকেল",
    readMore: "পুরো গাইড পড়ুন",
    minRead: "মিনিট পাঠ"
  }
});

const ARTICLES = [
  {
    slug: "erp-software-bangladesh-sme",
    icon: Cpu,
    category: { en: "ERP & POS", bn: "ERP ও POS" },
    date: "June 2025",
    readTime: 7,
    title: {
      en: "Best ERP Software for Bangladesh SMEs: A 2025 Guide",
      bn: "বাংলাদেশের SME-দের জন্য সেরা ERP সফটওয়্যার: ২০২৫ গাইড"
    },
    excerpt: {
      en: "Running a retail shop, pharmacy, or distribution business in Bangladesh without software means manual errors, stock losses, and missed growth opportunities. This guide covers what ERP means for local SMEs and how EquiPulse AI solves the core problems.",
      bn: "বাংলাদেশে সফটওয়্যার ছাড়া রিটেইল, ফার্মেসি বা পাইকারি ব্যবসা চালানো মানে ম্যানুয়াল ভুল, স্টক লস এবং প্রবৃদ্ধির সুযোগ হারানো। এই গাইডে স্থানীয় SME-দের জন্য ERP-এর অর্থ এবং EquiPulse AI কীভাবে মূল সমস্যা সমাধান করে তা আলোচনা করা হয়েছে।"
    },
    tags: ["ERP", "POS", "SME", "Bangladesh"],
    href: "/bd-erp-pos/"
  },
  {
    slug: "sweat-equity-tech-startup-bangladesh",
    icon: BookOpen,
    category: { en: "Startup & Equity", bn: "স্টার্টআপ ও ইকুইটি" },
    date: "May 2025",
    readTime: 5,
    title: {
      en: "How Sweat Equity Works in Tech Startups: The EquiSaaS Model",
      bn: "টেক স্টার্টআপে Sweat Equity কীভাবে কাজ করে: EquiSaaS মডেল"
    },
    excerpt: {
      en: "Sweat equity means earning real corporate ownership through your skills and time instead of cash investment. EquiSaaS BD is the first cooperative in Bangladesh to formalize this model for young engineers and designers.",
      bn: "Sweat equity মানে নগদ বিনিয়োগের বদলে আপনার দক্ষতা ও সময়ের মাধ্যমে প্রকৃত কর্পোরেট মালিকানা অর্জন করা। EquiSaaS BD বাংলাদেশে প্রথম কো-অপারেটিভ যা তরুণ ইঞ্জিনিয়ার ও ডিজাইনারদের জন্য এই মডেল আনুষ্ঠানিক করেছে।"
    },
    tags: ["Sweat Equity", "Open Coop", "Career"],
    href: "/open-tech-cooperative-bangladesh/"
  },
  {
    slug: "pharmacy-management-software-bangladesh",
    icon: Store,
    category: { en: "Pharmacy & Retail", bn: "ফার্মেসি ও রিটেইল" },
    date: "April 2025",
    readTime: 6,
    title: {
      en: "Why Your Pharmacy Needs Management Software in Bangladesh",
      bn: "বাংলাদেশে আপনার ফার্মেসিতে ম্যানেজমেন্ট সফটওয়্যার কেন দরকার"
    },
    excerpt: {
      en: "Pharmacy owners in Bangladesh face daily challenges: expired medicine tracking, supplier payments, and prescription records. EquiPulse AI POS handles all of this offline - no internet required.",
      bn: "বাংলাদেশের ফার্মেসি মালিকরা প্রতিদিন চ্যালেঞ্জের মুখোমুখি হন: মেয়াদোত্তীর্ণ ওষুধের ট্র্যাকিং, সরবরাহকারীর পেমেন্ট এবং প্রেসক্রিপশন রেকর্ড। EquiPulse AI POS সবকিছু অফলাইনে পরিচালনা করে, ইন্টারনেট ছাড়াই।"
    },
    tags: ["Pharmacy", "POS", "Offline Software"],
    href: "/bd-erp-pos/"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
};

export default function ResourcesPage({ lang, setLang, theme, setTheme }) {
  const t = COPY[lang] || COPY.en;

  return (
    <div className="min-h-screen bg-background text-foreground tracking-tight flex flex-col">
      <AmbientBackdrop />
      <Header lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />

      <main className="flex-1 relative z-10">
        {/* Hero */}
        <section className="relative py-32 md:py-40 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/8 via-background to-background" />
          <div className="container relative mx-auto px-6 max-w-4xl text-center">
            <motion.div
              variants={fadeUp}
              custom={0}
              initial="hidden"
              animate="visible"
            >
              <Badge variant="soft" className="mb-6 rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-xs font-semibold">
                {t.allArticles}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gradient-brand mb-6">
                {t.heroTitle}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                {t.heroSubtitle}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="pb-24">
          <div className="container mx-auto px-6 max-w-6xl">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {ARTICLES.map((article) => {
                const Icon = article.icon;
                return (
                  <motion.div key={article.slug} variants={cardVariants}>
                    <Card className="h-full glass-card-hover overflow-hidden rounded-3xl border border-border/50 bg-card/60 shadow-lg backdrop-blur-xl flex flex-col">
                      <CardContent className="flex flex-col flex-1 p-6 sm:p-8">
                        {/* Top meta */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="text-xs font-bold text-primary/70 uppercase tracking-wider border border-primary/20 bg-primary/5 px-2.5 py-1 rounded-full">
                            {article.category[lang] || article.category.en}
                          </span>
                        </div>

                        {/* Title & excerpt */}
                        <div className="flex-1 space-y-3">
                          <h2 className="text-xl font-black tracking-tight text-foreground leading-tight">
                            {article.title[lang] || article.title.en}
                          </h2>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {article.excerpt[lang] || article.excerpt.en}
                          </p>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {article.tags.map(tag => (
                            <span key={tag} className="text-xs px-2 py-0.5 rounded-md bg-muted/50 text-muted-foreground font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="mt-6 pt-5 border-t border-border/50 flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {article.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {article.readTime} {t.minRead}
                            </span>
                          </div>
                          <Button asChild variant="ghost" size="sm" className="group text-primary hover:text-primary rounded-xl font-bold">
                            <a href={article.href}>
                              {t.readMore}
                              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      </main>

      <Footer lang={lang} />
      <Chatbot lang={lang} theme={theme} />
    </div>
  );
}
