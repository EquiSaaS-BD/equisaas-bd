import React, { useEffect, useState } from "react";
import { Globe, Menu, Moon, Sun, X } from "lucide-react";

import { LINKS } from "@/data/cofounder";
import ApplyModal from "@/components/landing/ApplyModal";
import { Button } from "@/components/ui/button";
import { EquiSaaSLogo } from "@/components/core/EquiSaaSLogo";
import { cn } from "@/lib/utils";

const NAV_COPY = {
  en: {
    founder: "Founder's Message",
    departments: "Departments",
    roadmap: "Roadmap",
    training: "Training",
    faq: "FAQ",
    lms: "Enter LMS",
    apply: "Apply Now",
    quick: "Quick navigation",
    more: "More links",
    language: "Switch language",
    theme: "Switch theme",
    menu: "Open menu",
    close: "Close menu",
    light: "Day",
    dark: "Night",
    bangla: "বাংলা",
  },
  bn: {
    founder: "ফাউন্ডারের বার্তা",
    departments: "ডিপার্টমেন্ট",
    roadmap: "রোডম্যাপ",
    training: "ট্রেনিং",
    faq: "FAQ",
    lms: "LMS এ প্রবেশ",
    apply: "এখনই আবেদন করুন",
    quick: "দ্রুত নেভিগেশন",
    more: "আরও লিংক",
    language: "ভাষা বদলান",
    theme: "থিম বদলান",
    menu: "মেনু খুলুন",
    close: "মেনু বন্ধ করুন",
    light: "দিন",
    dark: "রাত",
    bangla: "বাংলা",
  },
};

const PRIMARY_LINKS = {
  en: [
    { href: LINKS.founderPage, label: "Founder's Message" },
    { href: "/#departments", label: "Departments" },
    { href: "/roadmap/", label: "Roadmap" },
    { href: "/software-training-bangladesh/", label: "Training" },
    { href: "/#faq", label: "FAQ" },
  ],
  bn: [
    { href: LINKS.founderPage, label: "ফাউন্ডারের বার্তা" },
    { href: "/#departments", label: "ডিপার্টমেন্ট" },
    { href: "/roadmap/", label: "রোডম্যাপ" },
    { href: "/software-training-bangladesh/", label: "ট্রেনিং" },
    { href: "/#faq", label: "FAQ" },
  ],
};

const SECONDARY_LINKS = {
  en: [
    { href: LINKS.openTechCooperativePage, label: "Open Tech Coop" },
    { href: LINKS.orientationPage, label: "Orientation 2026" },
    { href: LINKS.githubOrg, label: "GitHub Organization", external: true },
  ],
  bn: [
    { href: LINKS.openTechCooperativePage, label: "ওপেন টেক কো-অপারেটিভ" },
    { href: LINKS.orientationPage, label: "অরিয়েন্টেশন ২০২৬" },
    { href: LINKS.githubOrg, label: "GitHub Organization", external: true },
  ],
};

export default function LandingNav({ lang, setLang, theme, setTheme }) {
  const t = NAV_COPY[lang] || NAV_COPY.en;
  const primaryLinks = PRIMARY_LINKS[lang] || PRIMARY_LINKS.en;
  const secondaryLinks = SECONDARY_LINKS[lang] || SECONDARY_LINKS.en;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const onResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/70 bg-background/88 shadow-[0_18px_48px_-34px_rgba(15,23,42,0.35)] backdrop-blur-xl"
          : "bg-background/30 backdrop-blur-sm",
      )}
    >
      <nav className="container mx-auto flex min-h-[68px] items-center justify-between gap-3 px-4 py-2.5 sm:px-6 xl:min-h-[72px]">
        <a href="/#home" className="flex items-center gap-2 group">
          <EquiSaaSLogo lang={lang} />
        </a>

        <div className="glass-premium hover-glow hidden items-center gap-1 rounded-full border border-border/70 bg-background/78 p-1.5 shadow-[0_14px_36px_-24px_rgba(15,23,42,0.28)] backdrop-blur-xl xl:flex">
          {primaryLinks.map((item) => (
            <Button key={item.href} asChild variant="ghost" className="rounded-full px-3.5 py-2 text-sm font-semibold text-muted-foreground">
              <a href={item.href}>{item.label}</a>
            </Button>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setLang((locale) => (locale === "en" ? "bn" : "en"))}
            aria-label={t.language}
            className="rounded-full border-border/70 bg-background/80"
          >
            <Globe className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme((nextTheme) => (nextTheme === "light" ? "dark" : "light"))}
            aria-label={t.theme}
            className="rounded-full border-border/70 bg-background/80"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <ApplyModal lang={lang}>
            <Button size="default" className="rounded-full px-3.5 py-2 text-sm" onClick={closeMenu}>
              {t.apply}
            </Button>
          </ApplyModal>

          <Button size="default" asChild variant="outline" className="rounded-full border-primary/25 bg-background/80 px-3.5 py-2 text-sm text-primary">
            <a href="/lms/login" onClick={closeMenu}>
              {t.lms}
            </a>
          </Button>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="rounded-full border-border/70 bg-background/85 md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? t.close : t.menu}
          aria-expanded={menuOpen}
          aria-controls="landing-mobile-menu"
        >
          {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </nav>

      {menuOpen ? (
        <div
          id="landing-mobile-menu"
          className="mesh-premium border-t border-border/70 bg-background/95 px-4 pb-5 pt-4 shadow-[0_20px_48px_-28px_rgba(15,23,42,0.4)] backdrop-blur-xl md:hidden max-h-[calc(100svh-68px)] overflow-y-auto"
        >
          <div className="container mx-auto space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="min-h-11 rounded-2xl border-border/70 bg-background/80"
                onClick={() => setLang((locale) => (locale === "en" ? "bn" : "en"))}
              >
                <Globe className="h-4 w-4" />
                {lang === "bn" ? "English" : t.bangla}
              </Button>
              <Button
                variant="outline"
                className="min-h-11 rounded-2xl border-border/70 bg-background/80"
                onClick={() => setTheme((nextTheme) => (nextTheme === "light" ? "dark" : "light"))}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {theme === "dark" ? t.light : t.dark}
              </Button>
            </div>

            <div className="space-y-3 rounded-[1.75rem] border border-border/70 bg-card/90 p-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">{t.quick}</p>
              <div className="grid gap-3">
                {primaryLinks.map((item) => (
                  <Button key={item.href} asChild variant="secondary" className="justify-start rounded-2xl bg-muted/50 px-4 py-3 text-left text-sm font-semibold">
                    <a href={item.href} onClick={closeMenu}>
                      {item.label}
                    </a>
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3 rounded-[1.75rem] border border-border/70 bg-card/90 p-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">{t.more}</p>
              <div className="grid gap-3">
                {secondaryLinks.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noreferrer" : undefined}
                    onClick={closeMenu}
                    className="rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <ApplyModal lang={lang}>
                <Button className="min-h-11 rounded-2xl" onClick={closeMenu}>
                  {t.apply}
                </Button>
              </ApplyModal>
              <Button asChild variant="outline" className="min-h-11 rounded-2xl border-primary/25 text-primary">
                <a href="/lms/login" onClick={closeMenu}>
                  {t.lms}
                </a>
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
