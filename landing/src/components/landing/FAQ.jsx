import React, { useEffect } from "react";

import { ArrowRight, HelpCircle, Mail, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

import { APPLICATION_LINK, CONTENT, LINKS } from "@/data/cofounder";
import Section from "@/components/landing/Section";
import { fadeUp } from "@/components/landing/motion";
import { normalizeLocalizedTree } from "@/lib/localized-copy";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const FAQ_COPY = normalizeLocalizedTree({
  en: {
    badge: "FAQ",
    intro:
      "These are the most common questions from learners, contributors, and people exploring the cooperative for the first time. If you still need help, the application and community channels are one click away.",
    supportLabel: "Support paths",
    supportTitle: "Still need clarity before you join?",
    supportBody:
      "Use the guided application form, open WhatsApp support, or send a support email. We want the first step to feel clear, not overwhelming.",
    apply: "Apply now",
    whatsapp: "WhatsApp support",
    support: "Email support",
  },
  bn: {
    badge: "FAQ",
    intro:
      "Learner, contributor, আর first-time visitor-দের সবচেয়ে common প্রশ্নগুলো এখানে রাখা হয়েছে। এরপরও যদি clarity দরকার হয়, application form আর community channel এক click দূরেই আছে।",
    supportLabel: "সাপোর্ট পথ",
    supportTitle: "যোগ দেওয়ার আগে এখনো কি কিছু পরিষ্কার করা দরকার?",
    supportBody:
      "Guided application form ব্যবহার করুন, WhatsApp support খুলুন, অথবা support email-এ লিখুন। আমরা চাই প্রথম step-টা confusing না হয়ে clear লাগুক।",
    apply: "এখনই আবেদন করুন",
    whatsapp: "WhatsApp support",
    support: "সাপোর্টে ইমেইল করুন",
  },
});

const EXTRA_ITEMS = normalizeLocalizedTree({
  en: [
    {
      q: "Who founded EquiSaaS BD?",
      a: "EquiSaaS BD was founded by Kholipha Ahmmad Al-Amin, who leads the platform as Founder and CEO with a mission centered on fair learning, sweat equity, and Bangladesh-first SaaS building.",
    },
    {
      q: "How many departments are active inside the EquiSaaS BD LMS?",
      a: "The EquiSaaS BD LMS currently runs through 9 active departments, and each learner works inside one department path at a time.",
    },
  ],
  bn: [
    {
      q: "EquiSaaS BD কে প্রতিষ্ঠা করেছেন?",
      a: "EquiSaaS BD প্রতিষ্ঠা করেছেন Kholipha Ahmmad Al-Amin, যিনি Founder and CEO হিসেবে fair learning, sweat equity, আর Bangladesh-first SaaS mission নিয়ে platform-টি পরিচালনা করছেন।",
    },
    {
      q: "EquiSaaS BD LMS-এ এখন কয়টি department active আছে?",
      a: "EquiSaaS BD LMS এখন ৯টি active department-এর মাধ্যমে চলে, এবং প্রতিটি learner এক সময়ে একটি department path-এর ভেতরে কাজ করে।",
    },
  ],
});

export default function FAQ({ lang }) {
  const faqData = CONTENT[lang]?.faq || CONTENT.en.faq; // lang guard
  const t = faqData;
  const local = FAQ_COPY[lang] || FAQ_COPY.en;
  const items = [...t.items, ...(EXTRA_ITEMS[lang] || EXTRA_ITEMS.en)];

  // Schema.org FAQPage JSON-LD for Google Answer Box + AI crawlers
  useEffect(() => {
    const id = "faq-schema-ld";
    if (document.getElementById(id)) return;
    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    });
    document.head.appendChild(script);
    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, [lang]); // re-inject on lang switch

  return (
    <Section id="faq" className="relative overflow-hidden bg-muted/30 py-12 md:py-16 lg:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-12 top-12 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-coop/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto space-y-12 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl space-y-5 text-center">
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <Badge variant="soft" className="px-4 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold">
              {local.badge}
            </Badge>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-3xl font-black tracking-tight md:text-3xl sm:text-4xl lg:text-5xl"
          >
            {t.title}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="mx-auto max-w-3xl text-lg leading-8 text-muted-foreground"
          >
            {local.intro}
          </motion.p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <motion.div variants={fadeUp} custom={2.4}>
            <Card className="glass-premium rounded-[2rem] shadow-2xl border-0 overflow-hidden">
              <CardContent className="p-4 sm:p-5 lg:p-6">
                <Accordion type="single" collapsible className="space-y-4">
                  {items.map((item, index) => (
                    <AccordionItem
                      key={item.q}
                      value={`item-${index}`}
                      className="glass-premium hover-lift overflow-hidden rounded-[1.75rem] border-0 px-5 py-2 shadow-lg"
                    >
                      <AccordionTrigger className="gap-4 text-left text-base font-black leading-7 hover:no-underline sm:text-lg">
                        <span className="inline-flex items-start gap-3">
                          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <HelpCircle className="h-4 w-4" />
                          </span>
                          <span>{item.q}</span>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-4 pt-2 text-sm leading-7 text-muted-foreground sm:text-base">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeUp} custom={2.8}>
            <Card className="glass-premium hover-glow overflow-hidden rounded-[2.5rem] shadow-2xl border-0">
              <CardHeader className="space-y-4 p-6 lg:p-8">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-primary">
                  <MessageCircle className="h-4 w-4" />
                  {local.supportLabel}
                </div>
                <div className="space-y-3">
                  <CardTitle className="text-2xl font-black tracking-tight md:text-3xl">{local.supportTitle}</CardTitle>
                  <CardDescription className="text-base leading-7 text-muted-foreground">{local.supportBody}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-6 pt-0 lg:p-8 lg:pt-0">
                <div className="grid gap-3">
                  <Button className="min-h-12 rounded-2xl justify-between" asChild>
                    <a href={APPLICATION_LINK} target="_blank" rel="noreferrer">
                      {local.apply}
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" className="min-h-12 rounded-2xl justify-between border-primary/20" asChild>
                    <a href={LINKS.whatsappLink} target="_blank" rel="noreferrer">
                      {local.whatsapp}
                      <MessageCircle className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="ghost" className="min-h-12 rounded-2xl justify-between" asChild>
                    <a href={`mailto:${LINKS.supportEmail}`}>
                      {local.support}
                      <Mail className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
