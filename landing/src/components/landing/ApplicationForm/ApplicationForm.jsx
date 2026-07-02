import React from "react";
import { motion } from "framer-motion";
import {
  Building2,
  CheckCircle2,
  ExternalLink,
  FileText,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Users,
  Video,
} from "lucide-react";
import Section from "@/components/landing/Section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fadeUp } from "@/components/landing/motion";
import { APPLICATION_LINK, LINKS } from "@/data/cofounder";

export default function ApplicationForm({ lang }) {
  const content = {
    en: {
      badge: "Official Onboarding",
      title: "Join the Open Tech Movement",
      desc: "Use the official new member registration form first, then keep WhatsApp and email ready so the team can guide your next steps clearly.",
      securityNotice: "Your registration is handled securely via Google Forms.",
      formTitle: "Step 1: Submit the new member registration form",
      formBody: "Open the official Google Form in a new tab, complete the required details carefully, then return here for the next onboarding step.",
      formCta: "Open registration form",
      onboardingTitle: "Step 2: Keep WhatsApp support ready",
      onboardingBody: "After the form, use WhatsApp or email for onboarding updates, department guidance, and support follow-up.",
      onboardingCta: "Open WhatsApp support",
      supportTitle: "Need human help before or after you submit?",
      supportBody: "Use WhatsApp or email for onboarding, HR verification, workshop certificate, or general support questions.",
      communityTitle: "Stay connected and keep the updates flowing",
      communityBody: "Use our public channels, official website, GitHub organization, and local business presence to keep track of announcements, codebase activity, and follow-up after you submit the form.",
      whatsappCta: "WhatsApp support",
      supportMailCta: "Support email",
      hrMailCta: "HR email",
      ceoMailCta: "CEO email",
      facebookCta: "Facebook page",
      groupCta: "Community group",
      githubCta: "GitHub organization",
      websiteCta: "Official website",
      linkedinCta: "LinkedIn page",
      youtubeCta: "YouTube channel",
      businessProfileCta: "Google Business Profile",
      mapCta: "HQ location map",
      checklist: [
        "Fill the official form with your real contact details.",
        "Keep WhatsApp or email active after submission.",
        "Keep WhatsApp or email active for follow-up.",
      ],
    },
    bn: {
      badge: "অফিশিয়াল অনবোর্ডিং",
      title: "ওপেন টেক মুভমেন্টে যোগ দিন",
      desc: "প্রথমে official new member registration form পূরণ করুন, তারপর WhatsApp ও email active রাখুন যাতে team আপনাকে clear next step দিতে পারে।",
      securityNotice: "আপনার registration Google Forms-এর মাধ্যমে নিরাপদে সংরক্ষিত হবে।",
      formTitle: "ধাপ ১: New member registration form জমা দিন",
      formBody: "Official Google Form নতুন ট্যাবে খুলে প্রয়োজনীয় তথ্য সঠিকভাবে পূরণ করুন, তারপর পরের onboarding step-এর জন্য এখানে ফিরে আসুন।",
      formCta: "রেজিস্ট্রেশন ফর্ম খুলুন",
      onboardingTitle: "ধাপ ২: WhatsApp support প্রস্তুত রাখুন",
      onboardingBody: "Form submit করার পর onboarding update, department guidance, এবং support follow-up-এর জন্য WhatsApp বা email ব্যবহার করুন।",
      onboardingCta: "WhatsApp support খুলুন",
      supportTitle: "Submit করার আগে বা পরে human help লাগবে?",
      supportBody: "Onboarding, HR verification, workshop certificate, অথবা general support-এর জন্য WhatsApp বা email ব্যবহার করুন।",
      communityTitle: "Connected থাকুন, update মিস করবেন না",
      communityBody: "Form submit করার পর announcement, community discussion, codebase activity, আর follow-up track করার জন্য public channel, official website, GitHub organization, এবং local business presence ব্যবহার করুন।",
      whatsappCta: "WhatsApp সাপোর্ট",
      supportMailCta: "Support ইমেইল",
      hrMailCta: "HR ইমেইল",
      ceoMailCta: "CEO ইমেইল",
      facebookCta: "ফেসবুক পেজ",
      groupCta: "কমিউনিটি গ্রুপ",
      githubCta: "GitHub organization",
      websiteCta: "অফিশিয়াল ওয়েবসাইট",
      linkedinCta: "LinkedIn পেজ",
      youtubeCta: "YouTube চ্যানেল",
      businessProfileCta: "Google Business Profile",
      mapCta: "HQ লোকেশন ম্যাপ",
      checklist: [
        "Official form-এ আপনার real contact details দিন।",
        "Submit করার পর WhatsApp বা email active রাখুন।",
        "Follow-up-এর জন্য WhatsApp বা email active রাখুন।",
      ],
    }
  };

  const t = content[lang] || content.en;

  return (
    <Section id="apply" className="relative overflow-hidden py-12 md:py-16 lg:py-24 bg-slate-50/50 dark:bg-slate-900/10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-coop/5 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-4xl space-y-6 text-center mb-12">
          <motion.div variants={fadeUp} custom={0}>
            <Badge variant="soft" className="rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-xs font-semibold">
              {t.badge}
            </Badge>
          </motion.div>

          <motion.h2 
            variants={fadeUp} 
            custom={1}
            className="text-3xl font-black tracking-tight md:text-3xl sm:text-4xl lg:text-5xl lg:text-6xl"
          >
            {t.title}
          </motion.h2>

          <motion.p 
            variants={fadeUp} 
            custom={2}
            className="mx-auto max-w-2xl text-lg leading-8 text-muted-foreground"
          >
            {t.desc}
          </motion.p>

          <motion.div 
            variants={fadeUp} 
            custom={3}
            className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground/80"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            {t.securityNotice}
          </motion.div>
        </div>

        <motion.div variants={fadeUp} custom={4} className="mx-auto max-w-5xl">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <Card className="glass-premium hover-glow overflow-hidden rounded-[2.5rem] border-0 shadow-2xl">
              <div className="h-2 w-full bg-gradient-to-r from-primary via-blue-500 to-coop" />
              <CardContent className="space-y-6 p-6 lg:p-8">
                <div className="space-y-3">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight">{t.formTitle}</h3>
                  <p className="text-base leading-7 text-muted-foreground">{t.formBody}</p>
                </div>

                <div className="grid gap-3">
                  {t.checklist.map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-[1.4rem] border border-border/60 bg-background/75 px-4 py-4">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                      <p className="text-sm leading-7 text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </div>

                <Button className="min-h-12 rounded-2xl" asChild>
                  <a href={APPLICATION_LINK} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    {t.formCta}
                  </a>
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="glass-premium hover-glow overflow-hidden rounded-[2.25rem] border-0 shadow-xl">
                <CardContent className="space-y-4 p-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-black tracking-tight">{t.onboardingTitle}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">{t.onboardingBody}</p>
                  <Button variant="outline" className="min-h-12 w-full rounded-2xl border-emerald-500/25 text-emerald-700 dark:text-emerald-300" asChild>
                    <a href={LINKS.whatsappLink} target="_blank" rel="noreferrer">
                      {t.onboardingCta}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-premium hover-glow overflow-hidden rounded-[2.25rem] border-0 shadow-xl">
                <CardContent className="space-y-4 p-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                    <Phone className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-black tracking-tight">{t.supportTitle}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">{t.supportBody}</p>
                  <div className="grid gap-3">
                    <Button variant="outline" className="min-h-11 rounded-2xl justify-between" asChild>
                      <a href={LINKS.whatsappLink} target="_blank" rel="noreferrer">
                        {t.whatsappCta}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="outline" className="min-h-11 rounded-2xl justify-between" asChild>
                      <a href={`mailto:${LINKS.supportEmail}`}>
                        {t.supportMailCta}
                        <Mail className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="ghost" className="min-h-11 rounded-2xl justify-between" asChild>
                      <a href={`mailto:${LINKS.hrEmail}`}>
                        {t.hrMailCta}
                        <Mail className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="ghost" className="min-h-11 rounded-2xl justify-between" asChild>
                      <a href={`mailto:${LINKS.ceoEmail}`}>
                        {t.ceoMailCta}
                        <Mail className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-premium hover-glow overflow-hidden rounded-[2.25rem] border-0 shadow-xl">
                <CardContent className="space-y-4 p-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-black tracking-tight">{t.communityTitle}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">{t.communityBody}</p>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    <Button variant="outline" className="min-h-11 rounded-2xl justify-between" asChild>
                      <a href={LINKS.fbPage} target="_blank" rel="noreferrer">
                        {t.facebookCta}
                        <MessageCircle className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="outline" className="min-h-11 rounded-2xl justify-between" asChild>
                      <a href={LINKS.fbGroup} target="_blank" rel="noreferrer">
                        {t.groupCta}
                        <Users className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="outline" className="min-h-11 rounded-2xl justify-between" asChild>
                      <a href={LINKS.githubOrg} target="_blank" rel="noreferrer">
                        {t.githubCta}
                        <Globe className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="outline" className="min-h-11 rounded-2xl justify-between" asChild>
                      <a href={LINKS.linkedin} target="_blank" rel="noreferrer">
                        {t.linkedinCta}
                        <Building2 className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="outline" className="min-h-11 rounded-2xl justify-between" asChild>
                      <a href={LINKS.website} target="_blank" rel="noreferrer">
                        {t.websiteCta}
                        <Globe className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="outline" className="min-h-11 rounded-2xl justify-between" asChild>
                      <a href={LINKS.googleBusinessProfile} target="_blank" rel="noreferrer">
                        {t.businessProfileCta}
                        <Building2 className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="outline" className="min-h-11 rounded-2xl justify-between" asChild>
                      <a href={LINKS.hqMap} target="_blank" rel="noreferrer">
                        {t.mapCta}
                        <MapPin className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="ghost" className="min-h-11 rounded-2xl justify-between xl:col-span-3 sm:col-span-2" asChild>
                      <a href={LINKS.youtube} target="_blank" rel="noreferrer">
                        {t.youtubeCta}
                      <Video className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
