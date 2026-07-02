import React, { useRef } from "react";
import { ArrowUpRight, Mail, MapPin, Quote, ShieldCheck, Sparkles, Target, Users, Code, Award, Music } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

import Section from "@/components/landing/Section";
import { fadeUp } from "@/components/landing/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FounderSpotlightGallery from "@/components/landing/FounderSpotlightGallery";
import { LINKS } from "@/data/cofounder";
import { FOUNDER_MESSAGE, FOUNDER_PROFILE } from "@/data/founder-message";
import { withBrandAssetVersion } from "@/lib/brand-assets";
import { normalizeLocalizedTree } from "@/lib/localized-copy";

const SAFE_HIGHLIGHTS = normalizeLocalizedTree({
  en: ["64 districts", "9 departments", "Sweat Equity"],
  bn: ["৬৪ জেলা", "৯টি ডিপার্টমেন্ট", "Sweat Equity"],
});

const SPOTLIGHT_COPY = normalizeLocalizedTree({
  en: {
    badge: "Founder Spotlight",
    title: "Founder-led clarity for fair learning, real contribution, and shared ownership.",
    intro:
      "EquiSaaS BD was founded by Kholipha Ahmmad Al-Amin to replace unpaid internship culture with a structured path: learn, submit proof, contribute to real work, and grow into ownership.",
    quoteLabel: "A short note from the founder",
    quotePoints: [
      { text: "No unpaid internships; only real, valued contribution.", icon: "Target" },
      { text: "Free practical learning across 9 tech departments.", icon: "Users" },
      { text: "Building production-ready B2B SaaS for Bangladesh.", icon: "Code" },
      { text: "Earn sweat equity and true ownership in every project.", icon: "Award" }
    ],
    pillarsTitle: "What the founder is prioritizing first",
    founderPageCta: "Read the full founder page",
    portfolioCta: "Visit founder portfolio",
    portfolioProjectsCta: "Browse founder projects",
    portfolioLabsCta: "Explore public labs",
    selectedWorkTitle: "Selected founder work",
    projectBadge: "Portfolio project",
    openProfile: "Open profile",
    emailCta: "Email CEO Office",
    location: "Dhaka, serving builders across Bangladesh",
    role: "Founder & CEO, EquiSaaS BD",
  },
  bn: {
    badge: "ফাউন্ডার স্পটলাইট",
    title: "ন্যায্য শেখা, বাস্তব কন্ট্রিবিউশন, আর শেয়ারড মালিকানার জন্য একটি founder-led direction.",
    intro:
      "Kholipha Ahmmad Al-Amin EquiSaaS BD প্রতিষ্ঠা করেছেন এই লক্ষ্য নিয়ে, যেন unpaid internship culture-এর বদলে মানুষ একটি পরিষ্কার path পায়: শিখবে, proof দেবে, বাস্তব কাজে contribute করবে, আর ধীরে ধীরে ownership-এর দিকে এগোবে।",
    quoteLabel: "ফাউন্ডারের সংক্ষিপ্ত বার্তা",
    quotePoints: [
      { text: "কোনো আনপেইড ইন্টার্নশিপ নয়; শুধু বাস্তব এবং মূল্যায়িত কাজ।", icon: "Target" },
      { text: "৯টি টেক ডিপার্টমেন্টে সম্পূর্ণ ফ্রি প্র্যাকটিক্যাল লার্নিং।", icon: "Users" },
      { text: "বাংলাদেশের জন্য প্রোডাকশন-রেডি B2B SaaS তৈরি।", icon: "Code" },
      { text: "প্রতিটি প্রজেক্টে সোয়েট ইকুইটি এবং প্রকৃত মালিকানা অর্জন।", icon: "Award" }
    ],
    pillarsTitle: "ফাউন্ডার এখন যেগুলোকে প্রথম অগ্রাধিকার দিচ্ছেন",
    founderPageCta: "ফাউন্ডারের পুরো পেজ পড়ুন",
    portfolioCta: "ফাউন্ডারের পোর্টফোলিও দেখুন",
    portfolioProjectsCta: "ফাউন্ডারের project directory দেখুন",
    portfolioLabsCta: "Public labs দেখুন",
    selectedWorkTitle: "ফাউন্ডারের নির্বাচিত কাজ",
    projectBadge: "পোর্টফোলিও প্রজেক্ট",
    openProfile: "প্রোফাইল খুলুন",
    emailCta: "CEO Office-এ ইমেইল করুন",
    location: "ঢাকা থেকে শুরু, লক্ষ্য সারা বাংলাদেশের builders",
    role: "ফাউন্ডার ও সিইও, EquiSaaS BD",
  },
});

export default function FounderMessage({ lang }) {
  const t = SPOTLIGHT_COPY[lang];
  const content = FOUNDER_MESSAGE[lang];

  const iconMap = {
    Target: Target,
    Users: Users,
    Code: Code,
    Award: Award
  };

  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1]);

  return (
    <Section id="founder-home" className="relative overflow-hidden bg-muted/20 py-20 sm:py-12 md:py-16 lg:py-24">
      <div ref={sectionRef} className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-8 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-coop/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto space-y-10 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl space-y-5 text-center">
          <motion.div variants={fadeUp} custom={0}>
            <Badge variant="soft" className="rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-xs font-semibold">
              {t.badge}
            </Badge>
          </motion.div>
          <motion.h2 variants={fadeUp} custom={1} className="text-3xl font-black tracking-tight md:text-3xl sm:text-4xl lg:text-5xl">
            {t.title}
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="mx-auto max-w-3xl text-lg leading-8 text-muted-foreground">
            {t.intro}
          </motion.p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <motion.div variants={fadeUp} custom={2.2}>
            <Card className="overflow-hidden rounded-[2rem] border-border/70 bg-background/90 shadow-2xl shadow-slate-950/10 backdrop-blur-xl" itemScope itemType="https://schema.org/Person">
              <div className="relative aspect-[4/4.4] overflow-hidden border-b border-border/60">
                <motion.img
                  style={{ y: imgY, scale: imgScale }}
                  src={withBrandAssetVersion(FOUNDER_PROFILE.imagePath)}
                  alt={lang === "bn" ? FOUNDER_PROFILE.imageAltBn : FOUNDER_PROFILE.imageAlt}
                  className="absolute inset-0 h-[120%] w-[120%] -left-[10%] -top-[10%] object-cover object-top origin-top"
                  width="2560"
                  height="2560"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />
                <div className="absolute inset-x-5 bottom-5 flex flex-wrap gap-2">
                  <Badge className="border-0 bg-background/90 px-3 py-1 text-foreground shadow-sm">
                    {t.role}
                  </Badge>
                </div>
              </div>

              <CardHeader className="space-y-4 pb-4">
                <div className="space-y-2">
                  <CardTitle className="text-3xl font-black tracking-tight" itemProp="name">{FOUNDER_PROFILE.name}</CardTitle>
                  <p lang="bn-BD" className="text-base font-semibold text-muted-foreground">
                    {FOUNDER_PROFILE.banglaName}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="rounded-full border-primary/25 px-3 py-1 text-primary" itemProp="jobTitle">
                    {t.role}
                  </Badge>
                  <Badge variant="outline" className="rounded-full border-border/80 px-3 py-1 text-muted-foreground">
                    <MapPin className="mr-1 h-3.5 w-3.5" />
                    {t.location}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="flex flex-wrap gap-2">
                  {SAFE_HIGHLIGHTS[lang].map((item) => (
                    <Badge key={item} variant="secondary" className="rounded-full px-3 py-1 text-sm font-semibold">
                      {item}
                    </Badge>
                  ))}
                </div>

                <div className="grid gap-3">
                  <Button asChild size="lg" className="rounded-2xl">
                    <a href={LINKS.founderPage}>
                      {t.founderPageCta}
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="rounded-2xl border-border/70">
                    <a href={LINKS.founderPortfolio} target="_blank" rel="noreferrer">
                      {t.portfolioCta}
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </Button>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Button asChild size="lg" variant="outline" className="rounded-2xl border-border/70">
                      <a href={LINKS.founderProjects} target="_blank" rel="noreferrer">
                        {t.portfolioProjectsCta}
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="rounded-2xl border-border/70">
                      <a href={LINKS.founderLabs} target="_blank" rel="noreferrer">
                        {t.portfolioLabsCta}
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                  <Button asChild size="lg" variant="outline" className="rounded-2xl border-primary/25 text-primary">
                    <a href={`mailto:${LINKS.ceoEmail}`}>
                      <Mail className="h-4 w-4" />
                      {t.emailCta}
                    </a>
                  </Button>

                  <div className="mt-4 rounded-2xl bg-muted/30 p-4 border border-border/50">
                    <p className="text-xs font-semibold text-muted-foreground mb-3 tracking-widest uppercase flex items-center gap-2"><Music className="w-3 h-3" /> {lang === 'bn' ? 'EquiSaaS BD অ্যান্থেম' : 'EquiSaaS BD Anthem'}</p>
                    <audio controls className="w-full h-9 rounded-md outline-none" controlsList="nodownload">
                      <source src="/equisaas-anthem.mp3" type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeUp} custom={2.5}>
            <Card className="rounded-[2rem] border-border/70 bg-background/90 shadow-2xl shadow-slate-950/10 backdrop-blur-xl">
              <CardHeader className="space-y-5 pb-6">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-primary">
                  <Quote className="h-4 w-4" />
                  {t.quoteLabel}
                </div>
                <div className="rounded-[1.75rem] border border-primary/15 bg-primary/5 p-6">
                  <div className="grid gap-4">
                    {t.quotePoints.map((point, idx) => {
                      const Icon = iconMap[point.icon];
                      return (
                        <motion.div 
                          key={idx} 
                          className="flex items-start gap-4"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: "-50px" }}
                          transition={{ duration: 0.5, delay: idx * 0.1 }}
                        >
                          <motion.div 
                            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.2)]"
                            animate={{ y: [-3, 3, -3] }}
                            transition={{ repeat: Infinity, duration: 3 + idx * 0.5, ease: "easeInOut" }}
                          >
                            <Icon className="h-4 w-4" />
                          </motion.div>
                          <p className="text-lg font-medium text-foreground/90 sm:text-xl leading-relaxed">
                            {point.text}
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-muted/30 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-muted-foreground">
                    <Sparkles className="h-4 w-4 text-primary" />
                    {t.pillarsTitle}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {content.facts.map((fact) => (
                      <div
                        key={fact}
                        className="flex items-start gap-3 rounded-[1.5rem] border border-border/60 bg-muted/20 px-4 py-4"
                      >
                        <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <ShieldCheck className="h-4 w-4" />
                        </span>
                        <p className="text-sm leading-7 text-muted-foreground">{fact}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

                <FounderSpotlightGallery lang={lang} />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
