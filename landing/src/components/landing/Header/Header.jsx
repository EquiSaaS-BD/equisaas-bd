import React, { useEffect, useState } from "react";
import { Globe, Menu, Moon, Sun, X, ArrowRight, Home, LayoutGrid, User, Briefcase, BookOpen, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { normalizeLocalizedTree } from "@/lib/localized-copy";
import { LINKS } from "@/data/cofounder";
import { EquiSaaSLogo } from "@/components/core/EquiSaaSLogo";
import { MagneticButton } from "@/components/core/MagneticButton";
import ApplyModal from "../ApplyModal";
import styles from "./Header.module.scss";

const NAV_COPY = normalizeLocalizedTree({
  en: {
    home: "Home",
    founder: "Founder",
    departments: "Departments",
    roadmap: "Roadmap",
    training: "Training",
    faq: "FAQ",
    lms: "Open LMS",
    join: "Join Now",
    language: "Language",
    theme: "Theme",
    menu: "Menu",
    close: "Close",
    light: "Light",
    dark: "Dark",
    settings: "Settings",
    primaryNav: "Primary navigation",
    menuDialog: "Landing page navigation menu",
    quickActions: "Quick Actions",
    preferences: "Preferences",
  },
  bn: {
    home: "হোম",
    founder: "ফাউন্ডার",
    departments: "ডিপার্টমেন্ট",
    roadmap: "রোডম্যাপ",
    training: "ট্রেনিং",
    faq: "FAQ",
    lms: "LMS প্রবেশ",
    join: "জয়েন করুন",
    language: "ভাষা",
    theme: "থিম",
    menu: "মেনু",
    close: "বন্ধ",
    light: "দিন",
    dark: "রাত",
    settings: "সেটিংস",
    primaryNav: "প্রধান নেভিগেশন",
    menuDialog: "ল্যান্ডিং পেজ নেভিগেশন মেনু",
    quickActions: "দ্রুত কাজ",
    preferences: "পছন্দসমূহ",
  },
});

const PRIMARY_LINKS = normalizeLocalizedTree({
  en: [
    { href: "/services/", label: "Services", icon: LayoutGrid },
    { href: "/departments/", label: "Departments", icon: LayoutGrid },
    { href: "/partners/", label: "Partners", icon: Users },
    { href: "/projects/", label: "Projects", icon: Briefcase },
    { href: "/sme-software-bangladesh/", label: "SME", icon: Globe },
    { href: "/resources/", label: "Resources", icon: BookOpen },
    { href: LINKS.founderPage, label: "Founder", icon: User },
  ],
  bn: [
    { href: "/services/", label: "সার্ভিস", icon: LayoutGrid },
    { href: "/departments/", label: "ডিপার্টমেন্ট", icon: LayoutGrid },
    { href: "/partners/", label: "পার্টনার্স", icon: Users },
    { href: "/projects/", label: "প্রজেক্টসমূহ", icon: Briefcase },
    { href: "/sme-software-bangladesh/", label: "SME", icon: Globe },
    { href: "/resources/", label: "রিসোর্স", icon: BookOpen },
    { href: LINKS.founderPage, label: "ফাউন্ডার", icon: User },
  ],
});

export default function Header({ lang, setLang, theme, setTheme }) {
  const t = NAV_COPY[lang];
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = "landing-editorial-menu";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  const toggleLanguage = () => setLang(lang === "en" ? "bn" : "en");

  const handleLinkClick = (e, href) => {
    const isLanding = typeof window !== "undefined" && window.location.pathname === "/";
    const isHash = href.startsWith("/#");

    if (isLanding && isHash) {
      const id = href.replace("/#", "");
      const element = document.getElementById(id);
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", href);
      }
    }
    // If not on landing and clicked a hash link, let the default behavior happen (full page reload to /#id)
    setTimeout(() => setMenuOpen(false), 300);
  };

  return (
    <>
      {/* Desktop Navigation (Floating Glass) */}
      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}>
        <div className="container">
          <div className={styles.headerInner}>
            <a href="/#home" onClick={(e) => handleLinkClick(e, "/#home")} className={styles.logo}>
              <EquiSaaSLogo lang={lang} />
            </a>

            <nav className={styles.desktopNav} aria-label={t.primaryNav}>
              <ul className={styles.navList}>
                {PRIMARY_LINKS[lang].map((item) => (
                  <li key={item.href}>
                    <a 
                      href={item.href} 
                      className={styles.navLink}
                      onClick={(e) => handleLinkClick(e, item.href)}
                    >
                      {item.icon && <item.icon size={16} />}
                      <span>{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className={styles.desktopActions}>
              <div className={styles.mobileActions}>
                <button type="button" className={styles.iconBtn} onClick={toggleLanguage} aria-label={t.language}>
                  <span className="font-black text-[10px]">{lang === "bn" ? "EN" : "BN"}</span>
                </button>
                <button type="button" className={styles.iconBtn} onClick={toggleTheme} aria-label={t.theme}>
                  {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                </button>
              </div>

              <button
                type="button"
                className={styles.tabletMenuBtn}
                onClick={() => setMenuOpen(true)}
                aria-label={t.menu}
                aria-expanded={menuOpen}
                aria-controls={menuId}
              >
                <Menu size={24} />
              </button>

              <div className={styles.laptopActions}>
                <button type="button" className={styles.controlBtn} onClick={toggleLanguage} aria-label={t.language}>
                  <Globe size={18} className="text-primary" />
                  <span className="font-black uppercase tracking-widest">{lang === "bn" ? "EN" : "বাংলা"}</span>
                </button>
                <button type="button" className={styles.iconBtn} onClick={toggleTheme} aria-label={t.theme}>
                  {theme === "dark" ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-blue-600" />}
                </button>
                <a href="/lms/login" className={styles.btnSecondary}>{t.lms}</a>
                <ApplyModal lang={lang}>
                  <MagneticButton className={styles.btnPrimary}>
                    {t.join}
                    <ArrowRight size={16} />
                  </MagneticButton>
                </ApplyModal>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Elite V3 Creative Overlay - Now slides from the left */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-[99998] bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              id={menuId}
              role="dialog"
              aria-modal="true"
              aria-label={t.menuDialog}
              className={`${styles.editorialMenu} bg-background/95 backdrop-blur-3xl shadow-2xl border-r border-border/30`}
              initial={{ opacity: 0, x: "-100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "-100%" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
            <div className={styles.editorialBg}>
              <div className={styles.editorialMesh} />
              <div className={styles.editorialGrid} />
            </div>

            <div className={styles.editorialHeader}>
              <EquiSaaSLogo lang={lang} className="opacity-70 scale-90 origin-left" />
              <button type="button" className={styles.editorialClose} onClick={() => setMenuOpen(false)} aria-label={t.close}>
                <X size={32} />
              </button>
            </div>

            <div className={styles.editorialContent}>
              <div className={styles.editorialNav} role="navigation" aria-label={t.primaryNav}>
                {PRIMARY_LINKS[lang].map((item, i) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    className={styles.editorialLink}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                  >
                    <span className={styles.linkIndex}>0{i + 1}</span>
                    <div className={styles.linkMain}>
                      {item.icon && <item.icon className={styles.linkIcon} size={22} />}
                      <span className={styles.linkText}>{item.label}</span>
                    </div>
                    <ArrowRight className={styles.linkArrow} size={20} />
                  </motion.a>
                ))}
              </div>

              <div className={styles.editorialFooter}>
                <div className={styles.footerCol}>
                  <p className={styles.footerLabel}>{t.quickActions}</p>
                  <div className={styles.footerButtons}>
                    <a href="/lms/login" className={styles.btnEditorialSecondary}>{t.lms}</a>
                    <ApplyModal lang={lang}>
                      <button type="button" className={styles.btnEditorialPrimary}>{t.join}</button>
                    </ApplyModal>
                  </div>
                </div>
                
                <div className={styles.footerCol}>
                  <p className={styles.footerLabel}>{t.preferences}</p>
                  <div className={styles.toggleGroup}>
                    <div className={styles.pillToggle} role="group" aria-label={t.language}>
                      <button type="button" className={`${styles.pillItem} ${lang === "en" ? styles.pillActive : ""}`} aria-pressed={lang === "en"} onClick={() => setLang("en")}>English</button>
                      <button type="button" className={`${styles.pillItem} ${lang === "bn" ? styles.pillActive : ""}`} aria-pressed={lang === "bn"} onClick={() => setLang("bn")}>বাংলা</button>
                    </div>
                    <div className={styles.pillToggle} role="group" aria-label={t.theme}>
                      <button type="button" className={`${styles.pillItem} ${theme === "light" ? styles.pillActive : ""}`} aria-pressed={theme === "light"} aria-label={t.light} onClick={() => setTheme("light")}><Sun size={18} /></button>
                      <button type="button" className={`${styles.pillItem} ${theme === "dark" ? styles.pillActive : ""}`} aria-pressed={theme === "dark"} aria-label={t.dark} onClick={() => setTheme("dark")}><Moon size={18} /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
