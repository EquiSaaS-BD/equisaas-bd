import React, { useEffect, useState } from "react";
import { Globe, Menu, Moon, Sun, X } from "lucide-react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { APPLICATION_LINK, LINKS } from "@/data/cofounder";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { EquiSaaSLogo } from "@/components/core/EquiSaaSLogo";
import { normalizeLocalizedTree } from "@/lib/localized-copy";

const NAV_COPY = normalizeLocalizedTree({
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
    light: "Light",
    dark: "Dark",
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
    more: "আরও দেখুন",
    language: "ভাষা বদলান",
    theme: "থিম বদলান",
    menu: "মেনু খুলুন",
    close: "মেনু বন্ধ করুন",
    light: "দিন",
    dark: "রাত",
  },
});

const PRIMARY_LINKS = normalizeLocalizedTree({
  en: [
    { href: LINKS.founderPage, label: "Founder's Message" },
    { href: "#departments", label: "Departments" },
    { href: "/roadmap/", label: "Roadmap" },
    { href: "/software-training-bangladesh", label: "Training" },
    { href: "#faq", label: "FAQ" },
  ],
  bn: [
    { href: LINKS.founderPage, label: "ফাউন্ডারের বার্তা" },
    { href: "#departments", label: "ডিপার্টমেন্ট" },
    { href: "/roadmap/", label: "রোডম্যাপ" },
    { href: "/software-training-bangladesh", label: "ট্রেনিং" },
    { href: "#faq", label: "FAQ" },
  ],
});

const SECONDARY_LINKS = normalizeLocalizedTree({
  en: [
    { href: LINKS.openTechCooperativePage, label: "Open Tech Coop" },
    { href: LINKS.orientationPage, label: "Orientation 2026" },
    { href: LINKS.linkedin, label: "LinkedIn" },
  ],
  bn: [
    { href: LINKS.openTechCooperativePage, label: "ওপেন টেক কো-অপারেটিভ" },
    { href: LINKS.orientationPage, label: "অরিয়েন্টেশন ২০২৬" },
    { href: LINKS.linkedin, label: "লিংকডইন" },
  ],
});

export default function Nav({ lang, setLang, theme, setTheme }) {
  const t = NAV_COPY[lang];
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progressX = useSpring(scrollYProgress, { stiffness: 140, damping: 25, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "border-b border-border/70 bg-background/88 shadow-[0_18px_48px_-34px_rgba(15,23,42,0.35)] backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <nav className="container mx-auto flex min-h-[68px] items-center justify-between gap-3 px-4 py-2.5 sm:px-6 xl:min-h-[72px] 2xl:min-h-[76px]">
        <Link to="/" onClick={closeMenu} className="flex min-w-0 items-center gap-3 group">
          <EquiSaaSLogo lang={lang} />
        </Link>

        <div className="hidden xl:flex items-center gap-1 rounded-full border border-border/70 bg-background/78 p-1.5 shadow-[0_14px_36px_-24px_rgba(15,23,42,0.28)] backdrop-blur-xl">
          {PRIMARY_LINKS[lang].map((item) => (
            <Button key={item.href} asChild variant="ghost" className="rounded-full px-3.5 py-2 text-sm font-semibold text-muted-foreground 2xl:px-4">
              <a href={item.href}>{item.label}</a>
            </Button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setLang((locale) => (locale === "en" ? "bn" : "en"))}
                aria-label={t.language}
                className="rounded-full border-border/70 bg-background/80"
              >
                <Globe className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{t.language}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme((nextTheme) => (nextTheme === "light" ? "dark" : "light"))}
                aria-label={t.theme}
                className="rounded-full border-border/70 bg-background/80"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{t.theme}</TooltipContent>
          </Tooltip>

          <Button size="default" asChild className="rounded-full px-3.5 py-2 text-sm 2xl:px-4">
            <a href="#apply" onClick={closeMenu}>
              {t.apply}
            </a>
          </Button>

          <Button size="default" asChild variant="outline" className="rounded-full border-primary/25 bg-background/80 px-3.5 py-2 text-sm text-primary 2xl:px-4">
            <a href="/lms/login" onClick={closeMenu}>
              {t.lms}
            </a>
          </Button>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="md:hidden rounded-full border-border/70 bg-background/85"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? t.close : t.menu}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </nav>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border-t border-border/70 bg-background/95 px-4 pb-5 pt-4 shadow-[0_20px_48px_-28px_rgba(15,23,42,0.4)] backdrop-blur-xl md:hidden"
          >
            <div className="container mx-auto space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="min-h-11 rounded-2xl border-border/70 bg-background/80" onClick={() => setLang((locale) => (locale === "en" ? "bn" : "en"))}>
                  <Globe className="h-4 w-4" />
                  {lang === "bn" ? "English" : "বাংলা"}
                </Button>
                <Button variant="outline" className="min-h-11 rounded-2xl border-border/70 bg-background/80" onClick={() => setTheme((nextTheme) => (nextTheme === "light" ? "dark" : "light"))}>
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {theme === "dark" ? t.light : t.dark}
                </Button>
              </div>

              <div className="space-y-3 rounded-[1.75rem] border border-border/70 bg-card/90 p-4 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">{t.quick}</p>
                <div className="grid gap-3">
                  {PRIMARY_LINKS[lang].map((item) => (
                    <Button key={item.href} asChild variant="secondary" className="justify-start rounded-2xl bg-muted/50 px-4 py-3 text-left text-sm font-semibold">
                      <a href={item.href} onClick={closeMenu}>{item.label}</a>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 rounded-[1.75rem] border border-border/70 bg-card/90 p-4 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">{t.more}</p>
                <div className="grid gap-3">
                  {SECONDARY_LINKS[lang].map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      className="rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Button asChild className="min-h-11 rounded-2xl">
                  <a href="#apply" onClick={closeMenu}>
                    {t.apply}
                  </a>
                </Button>
                <Button asChild variant="outline" className="min-h-11 rounded-2xl border-primary/25 text-primary">
                  <a href="/lms/login" onClick={closeMenu}>
                    {t.lms}
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div className="h-[2px] origin-left bg-gradient-to-r from-primary via-cyan-500 to-coop" style={{ scaleX: progressX }} />
    </header>
  );
}
