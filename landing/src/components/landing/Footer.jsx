import React from "react";
import {
  BookOpen,
  Globe,
  MessageCircle,
  Phone,
  MapPin,
  Users,
  Mail,
  Video,
} from "lucide-react";

import { LINKS, APPLICATION_LINK } from "@/data/cofounder";
import { withBrandAssetVersion } from "@/lib/brand-assets";
import { normalizeLocalizedTree } from "@/lib/localized-copy";
import { PARTNERS_DATA } from "@/data/partners";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const FOOTER_COPY = {
  en: {
    brandBody: "Bangladesh's first open tech cooperative, connecting learning, proof-based contribution, and SME SaaS direction in one platform.",
    discover: "Discover",
    connect: "Connect",
    hq: "Headquarters",
    training: "Software Training Bangladesh",
    founder: "Founder's Message",
    founderHub: "Founder Portfolio Hub",
    founderProjects: "Founder Projects",
    founderLabs: "Founder Labs",
    bdErpPos: "BD ERP POS",
    openTech: "Bangladesh's First Open Tech Cooperative",
    sme: "SME Software Bangladesh",
    projects: "Ecosystem Projects",
    lms: "LMS Platform",
    orientation: "EquiSaaS BD Orientation 2026",
    presentation: "Presentation",
    website: "Website",
    facebook: "Facebook Page",
    github: "GitHub Organization",
    linkedin: "LinkedIn Company Page",
    group: "Community Group",
    youtube: "YouTube: @equisaas",
    whatsapp: "WhatsApp",
    hrLabel: "HR Office",
    hrCaption: "HR verification, onboarding, and workshop certificate support",
    supportLabel: "Support Email",
    supportCaption: "Help, onboarding, and community support",
    ceoLabel: "CEO Office",
    ceoCaption: "Leadership and partnership contact",
    businessProfile: "Google Business Profile",
    maps: "Open in Google Maps",
    rights: "All rights reserved.",
    apply: "Apply",
    lmsEntry: "Enter LMS",
    privacy: "Privacy Policy",
    license: "License Terms",
    resources: "Resources & Insights",
  },
  bn: {
    brandBody: "বাংলাদেশের প্রথম ওপেন টেক কো-অপারেটিভ, যেখানে learning, proof-based contribution, আর SME SaaS direction একই প্ল্যাটফর্মে যুক্ত।",
    discover: "ডিসকভার",
    connect: "কানেক্ট",
    hq: "হেডকোয়ার্টার",
    training: "সফটওয়্যার ট্রেনিং বাংলাদেশ",
    founder: "ফাউন্ডারের বার্তা",
    founderHub: "ফাউন্ডার পোর্টফোলিও হাব",
    founderProjects: "ফাউন্ডারের প্রজেক্টসমূহ",
    founderLabs: "ফাউন্ডার ল্যাবস",
    bdErpPos: "BD ERP POS",
    openTech: "ওপেন টেক কো-অপারেটিভ বাংলাদেশ",
    sme: "SME সফটওয়্যার বাংলাদেশ",
    projects: "ইকোসিস্টেম প্রজেক্টসমূহ",
    lms: "LMS প্ল্যাটফর্ম",
    orientation: "EquiSaaS BD Orientation 2026",
    presentation: "প্রেজেন্টেশন",
    website: "ওয়েবসাইট",
    facebook: "ফেসবুক পেজ",
    github: "GitHub Organization",
    linkedin: "লিংকডইন কোম্পানি পেজ",
    group: "কমিউনিটি গ্রুপ",
    youtube: "ইউটিউব: @equisaas",
    whatsapp: "হোয়াটসঅ্যাপ",
    hrLabel: "HR অফিস",
    hrCaption: "HR verification, onboarding, এবং workshop certificate support",
    supportLabel: "সাপোর্ট ইমেইল",
    supportCaption: "সহায়তা, অনবোর্ডিং, এবং কমিউনিটি সাপোর্ট",
    ceoLabel: "CEO অফিস",
    ceoCaption: "নেতৃত্ব এবং পার্টনারশিপ যোগাযোগ",
    businessProfile: "Google Business Profile",
    maps: "Google Maps-এ দেখুন",
    rights: "সর্বস্বত্ব সংরক্ষিত।",
    apply: "আবেদন",
    lmsEntry: "LMS এ প্রবেশ",
    privacy: "প্রাইভেসি পলিসি",
    license: "লাইসেন্স শর্তাবলী",
    resources: "রিসোর্স ও ইনসাইটস",
  },
};

const LOCALIZED_FOOTER_COPY = normalizeLocalizedTree(FOOTER_COPY);

export default function Footer({ lang }) {
  const t = LOCALIZED_FOOTER_COPY[lang];

  return (
    <footer className="relative overflow-hidden border-t bg-muted/30 pb-12 pt-20">
      <div className="absolute left-1/2 top-0 h-px w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="container mx-auto space-y-12 px-4 sm:px-6">
        <Card className="hover-glow overflow-hidden rounded-[2rem] border border-border/50 bg-card/85 shadow-xl backdrop-blur-xl">
          <CardContent className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8">
            <div className="space-y-2 text-center lg:text-left">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">EquiSaaS BD</p>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground">{t.brandBody}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Button className="rounded-2xl" asChild>
                <a href={APPLICATION_LINK} target="_blank" rel="noreferrer">
                  {t.apply}
                </a>
              </Button>
              <Button variant="outline" className="rounded-2xl border-primary/20" asChild>
                <a href="/lms/login">{t.lmsEntry}</a>
              </Button>
              <Button variant="ghost" className="rounded-2xl" asChild>
                <a href={LINKS.whatsappLink} target="_blank" rel="noreferrer">
                  {t.whatsapp}
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 text-center md:grid-cols-2 md:text-left lg:grid-cols-4">
          <Card className="hover-lift hover-glow rounded-[1.75rem] border border-border/50 bg-card/80 shadow-lg backdrop-blur-xl">
            <CardContent className="flex h-full flex-col items-center space-y-6 p-6 md:items-start">
            <img
              src={withBrandAssetVersion(lang === "bn" ? "/logo-bn.svg" : "/logo.svg")}
              alt="EquiSaaS BD logo"
              className="h-12 w-auto"
              width="240"
              height="48"
              loading="lazy"
              decoding="async"
            />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{t.brandBody}</p>
            
            <div className="pt-4 mt-auto border-t border-border w-full flex flex-col items-center md:items-start gap-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">In Partnership With</span>
              <div className="flex flex-row flex-wrap items-center gap-4">
                {PARTNERS_DATA.map((partner, idx) => (
                  <a key={idx} href={partner.website} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105" title={partner.name}>
                    <img
                      src={withBrandAssetVersion(partner.logo)}
                      alt={`${partner.name} logo`}
                      className="h-10 w-20 opacity-80 hover:opacity-100 transition-opacity drop-shadow-sm rounded-md object-contain bg-white/5 p-1"
                      loading="lazy"
                    />
                  </a>
                ))}
              </div>
            </div>
            </CardContent>
          </Card>

          <Card className="hover-lift hover-glow rounded-[1.75rem] border border-border/50 bg-card/80 shadow-lg backdrop-blur-xl">
            <CardContent className="space-y-6 p-6">
            <h3 className="text-lg font-black uppercase tracking-tight">{t.discover}</h3>
            <div className="flex flex-col items-center gap-4 md:items-start">
              <a href="/software-training-bangladesh/" className="group flex items-center gap-3 font-semibold text-muted-foreground transition-all hover:-translate-y-0.5 hover:text-primary">
                <BookOpen className="h-5 w-5" />
                {t.training}
              </a>
              <a href={LINKS.founderPage} className="group flex items-center gap-3 font-semibold text-muted-foreground transition-all hover:-translate-y-0.5 hover:text-primary">
                <Users className="h-5 w-5" />
                {t.founder}
              </a>
              <a href={LINKS.founderPortfolio} target="_blank" rel="noreferrer" className="group flex items-center gap-3 font-semibold text-muted-foreground transition-all hover:-translate-y-0.5 hover:text-primary">
                <Users className="h-5 w-5" />
                {t.founderHub}
              </a>
              <a href={LINKS.founderProjects} target="_blank" rel="noreferrer" className="group flex items-center gap-3 font-semibold text-muted-foreground transition-all hover:-translate-y-0.5 hover:text-primary">
                <BookOpen className="h-5 w-5" />
                {t.founderProjects}
              </a>
              <a href={LINKS.founderLabs} target="_blank" rel="noreferrer" className="group flex items-center gap-3 font-semibold text-muted-foreground transition-all hover:-translate-y-0.5 hover:text-primary">
                <BookOpen className="h-5 w-5" />
                {t.founderLabs}
              </a>
              <a href={LINKS.bdErpPosPage} className="group flex items-center gap-3 font-semibold text-muted-foreground transition-all hover:-translate-y-0.5 hover:text-primary">
                <Globe className="h-5 w-5" />
                {t.bdErpPos}
              </a>
              <a href={LINKS.openTechCooperativePage} className="group flex items-center gap-3 font-semibold text-muted-foreground transition-all hover:-translate-y-0.5 hover:text-primary">
                <Globe className="h-5 w-5" />
                {t.openTech}
              </a>
              <a href="/sme-software-bangladesh/" className="group flex items-center gap-3 font-semibold text-muted-foreground transition-all hover:-translate-y-0.5 hover:text-primary">
                <Globe className="h-5 w-5" />
                {t.sme}
              </a>
              <a href="/projects/" className="group flex items-center gap-3 font-semibold text-muted-foreground transition-all hover:-translate-y-0.5 hover:text-primary">
                <Globe className="h-5 w-5" />
                {t.projects}
              </a>
              <a href="/lms/login" className="group flex items-center gap-3 font-semibold text-muted-foreground transition-all hover:-translate-y-0.5 hover:text-primary">
                <BookOpen className="h-5 w-5" />
                {t.lms}
              </a>
              <a href="/roadmap/" className="group flex items-center gap-3 font-semibold text-muted-foreground transition-all hover:-translate-y-0.5 hover:text-primary">
                <Globe className="h-5 w-5" />
                Execution Roadmap
              </a>
              <a href="/partners/" className="group flex items-center gap-3 font-semibold text-muted-foreground transition-all hover:-translate-y-0.5 hover:text-primary">
                <Globe className="h-5 w-5" />
                {lang === "en" ? "Ecosystem Partners" : "ইকোসিস্টেম পার্টনার্স"}
              </a>
              <a href="/resources/" className="group flex items-center gap-3 font-semibold text-muted-foreground transition-all hover:-translate-y-0.5 hover:text-primary">
                <BookOpen className="h-5 w-5" />
                {t.resources}
              </a>
              <a href={LINKS.orientationPage} className="group flex items-center gap-3 font-semibold text-muted-foreground transition-all hover:-translate-y-0.5 hover:text-primary">
                <Video className="h-5 w-5" />
                {t.orientation}
              </a>
            </div>
            </CardContent>
          </Card>

          <Card className="hover-lift hover-glow rounded-[1.75rem] border border-border/50 bg-card/80 shadow-lg backdrop-blur-xl">
            <CardContent className="space-y-6 p-6">
            <h3 className="text-lg font-black uppercase tracking-tight">{t.connect}</h3>
            <div className="flex flex-col items-center gap-4 md:items-start">
              <a href={LINKS.fbPage} target="_blank" rel="noreferrer" className="flex items-center gap-3 font-semibold text-muted-foreground transition-all hover:-translate-y-0.5 hover:text-primary">
                <MessageCircle className="h-5 w-5" />
                {t.facebook}
              </a>
              <a href={LINKS.githubOrg} target="_blank" rel="noreferrer" className="flex items-center gap-3 font-semibold text-muted-foreground transition-all hover:-translate-y-0.5 hover:text-primary">
                <BookOpen className="h-5 w-5" />
                {t.github}
              </a>
              <a href={LINKS.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 font-semibold text-muted-foreground transition-all hover:-translate-y-0.5 hover:text-primary">
                <Globe className="h-5 w-5" />
                {t.linkedin}
              </a>
              <a href={LINKS.fbGroup} target="_blank" rel="noreferrer" className="flex items-center gap-3 font-semibold text-muted-foreground transition-all hover:-translate-y-0.5 hover:text-primary">
                <Users className="h-5 w-5" />
                {t.group}
              </a>
              <a href={LINKS.youtube} target="_blank" rel="noreferrer" className="flex items-center gap-3 font-semibold text-muted-foreground transition-all hover:-translate-y-0.5 hover:text-primary">
                <Video className="h-5 w-5" />
                {t.youtube}
              </a>
              <a href={LINKS.whatsappLink} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 text-sm font-semibold text-muted-foreground transition-all hover:-translate-y-0.5 hover:text-primary md:items-start">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4" />
                  {t.whatsapp}
                </div>
                <span className="md:pl-7">{LINKS.whatsapp}</span>
              </a>
              <a href={`mailto:${LINKS.hrEmail}`} className="flex items-start gap-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary">
                <Mail className="mt-0.5 h-5 w-5 shrink-0" />
                <span>
                  <span className="block text-foreground">{t.hrLabel}</span>
                  <span className="block break-all">{LINKS.hrEmail}</span>
                  <span className="block text-xs text-muted-foreground/80">{t.hrCaption}</span>
                </span>
              </a>
              <a href={`mailto:${LINKS.supportEmail}`} className="flex items-start gap-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary">
                <Mail className="mt-0.5 h-5 w-5 shrink-0" />
                <span>
                  <span className="block text-foreground">{t.supportLabel}</span>
                  <span className="block">{LINKS.supportEmail}</span>
                  <span className="block text-xs text-muted-foreground/80">{t.supportCaption}</span>
                </span>
              </a>
              <a href={`mailto:${LINKS.ceoEmail}`} className="flex items-start gap-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary">
                <Mail className="mt-0.5 h-5 w-5 shrink-0" />
                <span>
                  <span className="block text-foreground">{t.ceoLabel}</span>
                  <span className="block break-all">{LINKS.ceoEmail}</span>
                  <span className="block text-xs text-muted-foreground/80">{t.ceoCaption}</span>
                </span>
              </a>
            </div>
            </CardContent>
          </Card>

          <Card className="hover-lift hover-glow rounded-[1.75rem] border border-border/50 bg-card/80 shadow-lg backdrop-blur-xl">
            <CardContent className="space-y-6 p-6">
            <h3 className="text-lg font-black uppercase tracking-tight">{t.hq}</h3>
            <div className="flex flex-col items-center gap-4 md:items-start">
              <a href={LINKS.hqMap} target="_blank" rel="noreferrer" className="flex items-start gap-3 text-left text-sm font-semibold text-muted-foreground transition-colors hover:text-primary">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0" />
                <span className="max-w-[220px]">{LINKS.hq}</span>
              </a>
              <div className="grid w-full gap-2 sm:grid-cols-2">
                <a href={LINKS.googleBusinessProfile} target="_blank" rel="noreferrer" className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3 text-center text-sm font-bold text-muted-foreground transition-colors hover:text-primary">
                  {t.businessProfile}
                </a>
                <a href={LINKS.hqMap} target="_blank" rel="noreferrer" className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3 text-center text-sm font-bold text-muted-foreground transition-colors hover:text-primary">
                  {t.maps}
                </a>
              </div>
              <div className="my-2 h-px w-full bg-border/50" />
              <div className="flex gap-4">
                <a href="/presentation.html" target="_blank" rel="noreferrer" className="text-sm font-bold text-muted-foreground transition-colors hover:text-primary">
                  {t.presentation}
                </a>
                <a href={LINKS.website} className="text-sm font-bold text-muted-foreground transition-colors hover:text-primary">
                  {t.website}
                </a>
              </div>
            </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 text-center text-sm text-muted-foreground/70 sm:flex-row">
          <div>&copy; {new Date().getFullYear()} EquiSaaS BD. {t.rights}</div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a href={LINKS.founderPage} className="font-bold transition-colors hover:text-primary">{t.founder}</a>
            <a href={LINKS.founderPortfolio} target="_blank" rel="noreferrer" className="font-bold transition-colors hover:text-primary">{t.founderHub}</a>
            <a href="/lms/login" className="font-bold transition-colors hover:text-primary">{t.lmsEntry}</a>
            <a href={APPLICATION_LINK} target="_blank" rel="noreferrer" className="font-bold transition-colors hover:text-primary">{t.apply}</a>
            <a href="/privacy-policy/" className="font-bold transition-colors hover:text-primary">{t.privacy}</a>
            <a href="/license-terms/" className="font-bold transition-colors hover:text-primary">{t.license}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
