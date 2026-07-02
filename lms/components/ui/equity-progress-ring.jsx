"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

export function EquityProgressRing({ points = 0, nextMilestone = 500, title = "Sweat Equity", subtitle = "Next payout milestone", onConfetti }) {
  const [mounted, setMounted] = useState(false);
  const [prevPoints, setPrevPoints] = useState(points);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Trigger confetti if points crossed a new milestone boundary or simply increased substantially
    if (mounted && points > prevPoints) {
      if (Math.floor(points / nextMilestone) > Math.floor(prevPoints / nextMilestone)) {
        // Milestone reached!
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#eab308', '#f59e0b', '#10b981', '#3b82f6'] // Gold, Amber, Emerald, Blue
        });
        if (onConfetti) onConfetti();
      }
      setPrevPoints(points);
    }
  }, [points, prevPoints, nextMilestone, mounted, onConfetti]);

  const safePoints = Math.max(0, points);
  const safeMilestone = Math.max(1, nextMilestone);
  
  // Cap at 100% for the ring display, but calculate cycles
  const currentCyclePoints = safePoints % safeMilestone;
  const percentage = safePoints === 0 ? 0 : (safePoints >= safeMilestone && currentCyclePoints === 0) ? 100 : (currentCyclePoints / safeMilestone) * 100;
  
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = mounted ? circumference - (percentage / 100) * circumference : circumference;

  return (
    <div className="relative flex flex-col items-center justify-center p-6 glass-premium rounded-[2rem] shadow-xl overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      
      {/* Background glow behind the ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
      
      <div className="relative flex items-center justify-center w-40 h-40">
        <svg className="w-full h-full transform -rotate-90 drop-shadow-md" viewBox="0 0 140 140">
          {/* Background Ring */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            className="stroke-muted/40"
            strokeWidth="10"
            fill="none"
          />
          {/* Progress Ring */}
          <motion.circle
            cx="70"
            cy="70"
            r={radius}
            className="stroke-primary"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut", type: "spring", bounce: 0.2 }}
            style={{ strokeDasharray: circumference }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-1.5"
          >
            <Award className="w-5 h-5 text-gold-subtle" />
            <span className="text-3xl font-black tabular-nums tracking-tighter text-foreground">
              {mounted ? safePoints : 0}
            </span>
          </motion.div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
            / {safeMilestone}
          </span>
        </div>
      </div>

      <div className="mt-5 text-center relative z-10">
        <h3 className="text-lg font-black tracking-tight text-foreground flex items-center justify-center gap-2">
          {title}
          {percentage === 100 && <Sparkles className="w-4 h-4 text-gold-subtle animate-pulse" />}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground/90 font-medium">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
