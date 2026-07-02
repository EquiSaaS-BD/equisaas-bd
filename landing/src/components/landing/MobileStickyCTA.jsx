import React from "react";
import { ArrowRight, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import ApplyModal from "./ApplyModal";

export default function MobileStickyCTA({ lang }) {
  const ctaText = lang === "bn" ? "এখনই যোগ দিন" : "Join Now";
  const scarcityText = lang === "bn" ? "এই সপ্তাহে মাত্র ৫টি স্পট বাকি" : "Only 5 spots left this week";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/80 p-4 pb-6 backdrop-blur-xl border-t border-border/50 sm:hidden flex flex-col items-center shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
      
      {/* Scarcity Badge (Fitts's Law + Urgency) */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-3 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-full text-[11px] font-bold flex items-center gap-1.5 shadow-sm"
      >
        <Flame size={12} className="animate-pulse text-amber-500" />
        {scarcityText}
      </motion.div>

      <ApplyModal lang={lang}>
        <Button className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg bg-gradient-to-r from-primary to-blue-600 border border-primary/20 relative overflow-hidden group">
          {/* Subconscious Pulsing Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
          
          <span className="relative z-10 flex items-center">
            {ctaText} <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </span>
        </Button>
      </ApplyModal>
    </div>
  );
}
