"use client";

import { useState, useEffect } from "react";
import { Sparkles, HelpCircle, X, Lightbulb, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/components/providers/locale-provider";
import Link from "next/link";

export function AiGuideModal({ departmentId, role, currentStage }) {
  const { copy } = useLocale();
  const [open, setOpen] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const getTips = () => {
    switch (departmentId) {
      case "frontend":
        return [
          {
            title: copy("Master React Hooks", "React Hooks আয়ত্ত করুন"),
            content: copy("Start with useState and useEffect. They are the building blocks of most components.", "useState এবং useEffect দিয়ে শুরু করুন। এগুলো অধিকাংশ কম্পোনেন্টের মূল ভিত্তি।")
          },
          {
            title: copy("Tailwind Mastery", "Tailwind-এ দক্ষতা"),
            content: copy("Use the official documentation while styling. It helps you learn utility classes faster.", "স্টাইলিং করার সময় অফিশিয়াল ডকুমেন্টেশন ব্যবহার করুন। এটি আপনাকে ইউটিলিটি ক্লাস দ্রুত শিখতে সাহায্য করবে।")
          }
        ];
      case "backend":
        return [
          {
            title: copy("SQL vs NoSQL", "SQL বনাম NoSQL"),
            content: copy("Understand when to use relational databases versus document stores like Firestore.", "কখন রিলেশনাল ডাটাবেজ আর কখন ফায়ারস্টোরের মতো ডকুমেন্ট স্টোর ব্যবহার করবেন তা বুঝুন।")
          },
          {
            title: copy("API Security", "API নিরাপত্তা"),
            content: copy("Always validate input data on the server side to prevent security leaks.", "সিকিউরিটি লিক এড়াতে সবসময় সার্ভার সাইডে ইনপুট ডাটা ভ্যালিডেট করুন।")
          }
        ];
      default:
        return [
          {
            title: copy("Stay Consistent", "ধারাবাহিকতা বজায় রাখুন"),
            content: copy("Submit at least one task weekly to maintain your progress streak.", "আপনার প্রগ্রেস স্ট্রিক বজায় রাখতে সপ্তাহে অন্তত একটি টাস্ক জমা দিন।")
          },
          {
            title: copy("Ask for help early", "আগেভাগে সাহায্য নিন"),
            content: copy("Use WhatsApp support or email when you need mentor guidance faster.", "মেন্টর গাইডেন্স দ্রুত দরকার হলে WhatsApp support বা email ব্যবহার করুন।")
          }
        ];
    }
  };

  const tips = getTips();

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setOpen(true)}
        className="glass-premium hover-glow group h-9 rounded-xl border-primary/20 bg-background/50 px-3 transition-all active:scale-95"
      >
        <Sparkles className="mr-2 h-4 w-4 animate-pulse text-primary" />
        <span className="text-xs font-black uppercase tracking-widest">
          {copy("AI Guide", "AI গাইড")}
        </span>
      </Button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-card p-0 shadow-2xl border border-border/50"
            >
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-primary" />
              
              <div className="max-h-[80vh] overflow-y-auto p-8">
                <button 
                  onClick={() => setOpen(false)}
                  className="absolute top-6 right-6 p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="mb-6">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <h2 className="text-2xl font-black tracking-tight mb-2">
                    {copy("EquiSaaS BD Learning Guide", "ইকুইসাস বিডি লার্নিং গাইড")}
                  </h2>
                  <p className="text-base text-muted-foreground/80">
                    {copy("Context-aware tips to help you move faster in your department.", "আপনার ডিপার্টমেন্টে দ্রুত এগিয়ে যেতে সাহায্য করার জন্য কন্টেক্সট-অ্যাওয়ার টিপস।")}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[1.75rem] border border-primary/10 bg-primary/5 p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <Badge variant="subtle" className="text-[10px] font-bold uppercase tracking-widest">{departmentId || "General"}</Badge>
                      <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest">{role || "Member"}</Badge>
                    </div>
                    <h4 className="font-bold">{copy("Your Current Roadmap", "আপনার বর্তমান রোডম্যাপ")}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {copy("You are currently at the learning stage. Focus on completing your active lessons.", "আপনি বর্তমানে লার্নিং পর্যায়ে আছেন। আপনার একটিভ লেসনগুলো শেষ করার দিকে মনোযোগ দিন।")}
                    </p>
                  </div>

                  <div className="grid gap-3">
                    {tips.map((tip, i) => (
                      <div key={i} className="group flex items-start gap-4 rounded-[1.5rem] border bg-background/50 p-4 transition-all hover:bg-background">
                        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary transition-transform group-hover:scale-110">
                          <Lightbulb className="h-4 w-4" />
                        </div>
                        <div>
                          <h5 className="font-bold text-sm tracking-tight">{tip.title}</h5>
                          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground/90 italic">
                            {tip.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-border/40">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">{copy("Resources & Help", "রিসোর্স ও সাহায্য")}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="ghost" size="sm" className="justify-start h-10 rounded-xl text-xs" asChild>
                        <a href="https://wa.me/8801570212260" target="_blank" rel="noopener noreferrer">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          WhatsApp
                        </a>
                      </Button>
                      <Button variant="ghost" size="sm" className="justify-start h-10 rounded-xl text-xs" asChild>
                        <Link href="/manual">
                          <HelpCircle className="mr-2 h-4 w-4" />
                          {copy("LMS Manual", "ম্যানুয়াল")}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted/30 border-t border-border/40 flex items-center justify-between">
                <p className="text-[10px] font-bold text-muted-foreground/60 tracking-widest uppercase italic">Powered by EquiSaaS AI</p>
                <Button variant="ghost" size="sm" onClick={() => setOpen(false)} className="rounded-xl h-8 text-[10px] font-bold uppercase tracking-widest">
                  {copy("Got it", "বুঝেছি")}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
