import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Phone, ExternalLink, ShieldCheck, Loader2, CheckCircle2, Search, Zap } from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { APPLICATION_LINK, LINKS } from "@/data/cofounder";
import { normalizeLocalizedTree } from "@/lib/localized-copy";

const COPY = normalizeLocalizedTree({
  en: {
    title: "Spot Reserved",
    desc: "We found a potential match for you in Batch 3. Complete step 1 to lock it in.",
    security: "Secure registration via Google Forms",
    step1Title: "Submit Registration",
    step1Desc: "Fill the official application form.",
    step1Cta: "Open Form",
    step2Title: "Keep support ready",
    step2Desc: "Use WhatsApp for onboarding follow-up.",
    step2Cta: "Open WhatsApp",
    analyzing: "Analyzing ecosystem fit...",
    checking: "Checking Batch 3 availability...",
    securing: "Securing your spot...",
    expiresIn: "Spot expires in"
  },
  bn: {
    title: "আপনার স্পট রিজার্ভ করা হয়েছে!",
    desc: "ব্যাচ ৩-এ আপনার জন্য একটি সম্ভাব্য ম্যাচ পাওয়া গেছে। এটি কনফার্ম করতে স্টেপ ১ পূরণ করুন।",
    security: "Google Forms-এর মাধ্যমে নিরাপদ রেজিস্ট্রেশন",
    step1Title: "রেজিস্ট্রেশন জমা দিন",
    step1Desc: "অফিশিয়াল অ্যাপ্লিকেশন ফর্মটি পূরণ করুন।",
    step1Cta: "ফর্ম খুলুন",
    step2Title: "সাপোর্ট প্রস্তুত রাখুন",
    step2Desc: "Onboarding follow-up-এর জন্য WhatsApp ব্যবহার করুন।",
    step2Cta: "WhatsApp খুলুন",
    analyzing: "ইকোসিস্টেম ফিট অ্যানালাইজ করা হচ্ছে...",
    checking: "ব্যাচ ৩ এর স্লট চেক করা হচ্ছে...",
    securing: "আপনার স্পট সিকিউর করা হচ্ছে...",
    expiresIn: "স্পটটির মেয়াদ শেষ হবে"
  }
});

export default function ApplyModal({ children, lang }) {
  const [open, setOpen] = useState(false);
  const [analyzingStep, setAnalyzingStep] = useState(0); // 0: closed, 1: analyzing, 2: checking, 3: securing, 4: done
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  
  const t = COPY[lang] || COPY.en;

  useEffect(() => {
    let timer;
    if (open) {
      setAnalyzingStep(1);
      
      const t1 = setTimeout(() => setAnalyzingStep(2), 1200);
      const t2 = setTimeout(() => setAnalyzingStep(3), 2400);
      const t3 = setTimeout(() => {
        setAnalyzingStep(4);
        triggerConfetti();
      }, 3500);

      // Start countdown timer when modal opens
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearInterval(timer);
      };
    } else {
      setAnalyzingStep(0);
      setTimeLeft(300);
    }
  }, [open]);

  const triggerConfetti = () => {
    const end = Date.now() + 1.5 * 1000; 
    const colors = ["#2563eb", "#059669", "#0891b2"]; 

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        {children}
      </Dialog.Trigger>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-40%" }}
                animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-40%" }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="fixed left-[50%] top-[50%] z-50 w-full max-w-xl p-4 focus:outline-none"
              >
                <div className="relative overflow-hidden rounded-[1.4rem] border border-border/50 bg-card/95 shadow-2xl backdrop-blur-xl">
                  <div className="h-2 w-full bg-gradient-to-r from-primary via-blue-500 to-coop" />
                  
                  <div className="p-5 sm:p-7 min-h-[350px] flex flex-col justify-center relative">
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-muted/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground z-10"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </Dialog.Close>

                    {/* The Labor Illusion Sequences */}
                    {analyzingStep > 0 && analyzingStep < 4 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center text-center py-12"
                      >
                        <Loader2 className="h-12 w-12 animate-spin text-primary mb-6" />
                        <h3 className="text-xl font-bold mb-2">
                          {analyzingStep === 1 && t.analyzing}
                          {analyzingStep === 2 && t.checking}
                          {analyzingStep === 3 && t.securing}
                        </h3>
                        <div className="w-full max-w-xs h-2 bg-muted rounded-full overflow-hidden mt-4">
                          <motion.div 
                            className="h-full bg-primary"
                            initial={{ width: "0%" }}
                            animate={{ width: analyzingStep === 1 ? "33%" : analyzingStep === 2 ? "66%" : "95%" }}
                            transition={{ duration: 0.8 }}
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Actual Content (Endowed Progress + Urgency) */}
                    {analyzingStep === 4 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <div className="mb-6 max-w-md">
                          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-3">
                            <Zap className="h-3.5 w-3.5" />
                            Step 1 of 3 Complete
                          </div>
                          
                          <Dialog.Title className="text-2xl font-black tracking-tight sm:text-3xl text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                            <CheckCircle2 className="h-7 w-7" />
                            {t.title}
                          </Dialog.Title>
                          <Dialog.Description className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
                            {t.desc}
                          </Dialog.Description>
                          
                          <div className="mt-5 flex flex-wrap gap-2">
                            <div className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-600 dark:text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse">
                              <div className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                              </div>
                              {t.expiresIn}: {formatTime(timeLeft)}
                            </div>
                            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                              <ShieldCheck className="h-3.5 w-3.5" />
                              {t.security}
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="grid gap-4 rounded-[1rem] border border-border/60 bg-muted/30 p-4 transition-colors hover:bg-muted/50 shadow-inner">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-black">{t.step1Title}</h4>
                              <p className="mt-1 text-xs leading-5 text-muted-foreground">{t.step1Desc}</p>
                            </div>
                            <Button size="sm" className="min-h-10 justify-between rounded-xl hover:scale-[1.02] transition-transform" asChild>
                              <a href={APPLICATION_LINK} target="_blank" rel="noreferrer">
                                {t.step1Cta} <ExternalLink className="ml-1.5 h-3 w-3" />
                              </a>
                            </Button>
                          </div>

                          <div className="grid gap-4 rounded-[1rem] border border-border/60 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                              <Phone className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-black">{t.step2Title}</h4>
                              <p className="mt-1 text-xs leading-5 text-muted-foreground">{t.step2Desc}</p>
                            </div>
                            <Button size="sm" variant="outline" className="min-h-10 justify-between rounded-xl border-emerald-500/20 text-emerald-700 dark:text-emerald-300" asChild>
                              <a href={LINKS.whatsappLink} target="_blank" rel="noreferrer">
                                {t.step2Cta} <ExternalLink className="ml-1.5 h-3 w-3" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
