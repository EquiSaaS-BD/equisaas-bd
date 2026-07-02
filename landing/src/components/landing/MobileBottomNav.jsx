import React, { useState } from "react";
import { BookOpenCheck, FileText, MessageCircle, Menu, X, Layers3, BriefcaseBusiness, MapPinned, ScanLine, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ApplyModal from "./ApplyModal";
import { LINKS } from "@/data/cofounder";

export default function MobileBottomNav({ lang }) {
  const [isOpen, setIsOpen] = useState(false);

  const t = {
    en: {
      apply: "Apply",
      lms: "LMS",
      whatsapp: "WhatsApp",
      menu: "Menu",
      nav: "Mobile action bar",
      applyFull: "Apply to join EquiSaaS BD",
      lmsFull: "Open the LMS",
      whatsappFull: "Open WhatsApp support",
      services: "Professional Services",
      departments: "Departments",
      workflow: "Proof Workflow",
      sme: "SME SaaS Roadmap",
      districts: "64 District Network",
    },
    bn: {
      apply: "আবেদন",
      lms: "LMS",
      whatsapp: "WhatsApp",
      menu: "মেনু",
      nav: "মোবাইল অ্যাকশন বার",
      applyFull: "EquiSaaS BD-তে আবেদন করুন",
      lmsFull: "LMS খুলুন",
      whatsappFull: "WhatsApp support খুলুন",
      services: "প্রফেশনাল সার্ভিসসমূহ",
      departments: "৯টি ডিপার্টমেন্ট",
      workflow: "প্রুফ ওয়ার্কফ্লো",
      sme: "SME SaaS রোডম্যাপ",
      districts: "৬৪ জেলার নেটওয়ার্ক",
    },
  }[lang];

  const actionClass =
    "flex h-[56px] min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-muted-foreground transition-all hover:text-primary active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

  return (
    <>
      {/* Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[40] bg-background/80 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Drawer Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 bottom-0 left-0 z-[99999] w-[80vw] max-w-[340px] flex flex-col border-r border-border bg-background p-6 shadow-2xl md:hidden"
          >
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-xl font-black tracking-tight text-foreground">EquiSaaS BD</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-all hover:bg-foreground hover:text-background"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex flex-col gap-3 flex-1 overflow-y-auto pb-32 mt-2">
              <a href="/services/" onClick={(e) => setTimeout(() => setIsOpen(false), 300)} className="flex items-center gap-4 rounded-2xl bg-primary/10 px-5 py-4 text-primary transition-all hover:bg-primary/20 active:scale-95">
                <Briefcase size={20} className="shrink-0" />
                <span className="text-[15px] font-bold tracking-tight">{t.services}</span>
              </a>
              <a href="/departments/" onClick={(e) => setTimeout(() => setIsOpen(false), 300)} className="flex items-center gap-4 rounded-2xl px-5 py-4 text-muted-foreground transition-all hover:bg-muted/80 hover:text-foreground active:scale-95">
                <Layers3 size={20} className="shrink-0" />
                <span className="text-[15px] font-bold tracking-tight">{t.departments}</span>
              </a>
              <a href="/proof-of-work/" onClick={(e) => setTimeout(() => setIsOpen(false), 300)} className="flex items-center gap-4 rounded-2xl px-5 py-4 text-muted-foreground transition-all hover:bg-muted/80 hover:text-foreground active:scale-95">
                <ScanLine size={20} className="shrink-0" />
                <span className="text-[15px] font-bold tracking-tight">{t.workflow}</span>
              </a>
              <a href="/sme-software-bangladesh/" onClick={(e) => setTimeout(() => setIsOpen(false), 300)} className="flex items-center gap-4 rounded-2xl px-5 py-4 text-muted-foreground transition-all hover:bg-muted/80 hover:text-foreground active:scale-95">
                <BriefcaseBusiness size={20} className="shrink-0" />
                <span className="text-[15px] font-bold tracking-tight">{t.sme}</span>
              </a>
              <a href="/founder/" onClick={(e) => setTimeout(() => setIsOpen(false), 300)} className="flex items-center gap-4 rounded-2xl px-5 py-4 text-muted-foreground transition-all hover:bg-muted/80 hover:text-foreground active:scale-95">
                <MapPinned size={20} className="shrink-0" />
                <span className="text-[15px] font-bold tracking-tight">{t.districts}</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Nav Bar */}
      <div
        className="fixed left-1/2 z-50 w-[calc(100%-1.5rem)] max-w-[430px] -translate-x-1/2 md:hidden"
        style={{ bottom: "max(1rem, calc(env(safe-area-inset-bottom) + 0.75rem))" }}
      >
        <nav
          aria-label={t.nav}
          className="grid grid-cols-4 items-center gap-1 rounded-[1.5rem] border border-border/40 bg-background/90 p-2 shadow-2xl backdrop-blur-xl"
        >
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
            className={`${actionClass} ${isOpen ? "text-primary bg-primary/10" : ""}`}
          >
            <Menu size={20} strokeWidth={2.5} />
            <span className="text-[12px] font-bold tracking-wide mt-0.5">{t.menu}</span>
          </button>

          <a href="/lms/login" aria-label={t.lmsFull} className={actionClass}>
            <BookOpenCheck size={20} strokeWidth={2.5} />
            <span className="text-[12px] font-bold tracking-wide mt-0.5">{t.lms}</span>
          </a>

          <a href={LINKS.whatsappLink} target="_blank" rel="noreferrer" aria-label={t.whatsappFull} className={actionClass}>
            <MessageCircle size={20} strokeWidth={2.5} />
            <span className="text-[12px] font-bold tracking-wide mt-0.5">{t.whatsapp}</span>
          </a>

          <ApplyModal lang={lang}>
            <motion.button
              type="button"
              aria-label={t.applyFull}
              whileTap={{ scale: 0.95 }}
              className="flex h-[56px] min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-[1.1rem] bg-primary px-1 text-primary-foreground shadow-lg shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <FileText size={20} strokeWidth={2.5} />
              <span className="text-[12px] font-bold tracking-wide mt-0.5">{t.apply}</span>
            </motion.button>
          </ApplyModal>
        </nav>
      </div>
    </>
  );
}
