"use client";

import Link from "next/link";
import { BookOpen, Sparkles, ArrowRight, ExternalLink, Library } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/components/providers/locale-provider";
import { motion } from "framer-motion";

export function BABookCard() {
  const { copy } = useLocale();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "circOut" }}
    >
      <Card className="group relative overflow-hidden bg-zinc-950 text-white border-white/5 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] rounded-[3rem] transition-all hover:border-primary/40" data-reveal="up">
        {/* Dynamic Background FX */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--primary-rgb),0.05),transparent_50%)]" />
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-[100px] group-hover:bg-primary/20 transition-all duration-700" />
        
        <div className="absolute bottom-10 right-10 pointer-events-none opacity-5 group-hover:opacity-10 transition-opacity">
          <Library className="h-48 w-48 -rotate-12" />
        </div>
        
        <div className="relative z-10 p-8 md:p-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-xl space-y-6">
              <div className="flex items-center gap-3">
                <Badge className="bg-primary/20 text-primary border-primary/30 rounded-full px-4 py-1 font-black text-[10px] tracking-widest uppercase">
                  <Sparkles className="h-3 w-3 mr-2" />
                  {copy("Strategic Asset", "স্ট্র্যাটেজিক অ্যাসেট")}
                </Badge>
                <div className="h-1 w-1 rounded-full bg-white/20" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold">
                   {copy("Verified Library", "ভেরিফাইড লাইব্রেরি")}
                </span>
              </div>
              
              <div className="space-y-4">
                <CardTitle className="text-3xl md:text-5xl font-black tracking-tight leading-none bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                  {copy("Business Analysis Handbook", "বিজনেস অ্যানালাইসিস হ্যান্ডবুক")}
                </CardTitle>
                <CardDescription className="text-lg text-white/50 leading-relaxed font-medium">
                  {copy(
                    "Dive into the definitive guide for B2B SaaS startups and open-tech cooperatives. Master the strategic solutions used by EquiSaaS analysts.",
                    "B2B SaaS স্টার্টআপ এবং ওপেন-টেক কোঅপারেটিভের জন্য চূড়ান্ত গাইড। ইকুইসাস অ্যানালিস্টদের ব্যবহৃত স্ট্র্যাটেজিক সমাধানগুলো আয়ত্ত করুন।"
                  )}
                </CardDescription>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1">{copy("Volume", "ভলিউম")}</span>
                  <span className="text-sm font-black text-white/80">262 Pages</span>
                </div>
                <div className="w-[1px] h-8 bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1">{copy("Format", "ফরম্যাট")}</span>
                  <span className="text-sm font-black text-white/80 uppercase tracking-tighter italic">Immersive Flipbook</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-4 min-w-[240px]">
              <Button size="xl" className="h-16 rounded-[2rem] text-lg font-black tracking-tight group/btn shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.5)]" asChild>
                <Link href="/department/ba-book">
                  <BookOpen className="h-5 w-5 mr-2" />
                  {copy("Open Flipbook", "ফ্লিপবুক খুলুন")}
                  <ArrowRight className="h-5 w-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" className="h-16 rounded-[2rem] border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-all font-bold" asChild>
                <a href="/lms/assets/books/ba-handbook.pdf" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-5 w-5 mr-2" />
                  {copy("Legacy View", "লিগ্যাসি ভিউ")}
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom shine FX */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
      </Card>
    </motion.div>
  );
}
