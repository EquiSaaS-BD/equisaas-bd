import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function EquiSaaSLogo({ className, lang = "en" }) {
  return (
    <div className={cn("flex items-center gap-3 select-none group", className)}>
      {/* Abstract Animated Geometric Mark */}
      <div className="relative flex h-8 w-8 items-center justify-center shrink-0">
        {/* Core hexagon rotating */}
        <motion.svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full text-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity }}
        >
          <path
            d="M50 5 L93.3 25 L93.3 75 L50 95 L6.7 75 L6.7 25 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinejoin="round"
            className="opacity-20"
          />
        </motion.svg>
        
        {/* Inner dynamic shapes */}
        <motion.svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full text-primary"
          initial={{ rotate: -90, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 1, type: "spring" }}
        >
          <path
            d="M50 20 L80 70 L20 70 Z"
            fill="currentColor"
            className="opacity-80 group-hover:opacity-100 transition-opacity"
          />
          <circle cx="50" cy="40" r="8" fill="white" className="dark:fill-black" />
        </motion.svg>

        {/* Floating orbital point */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, ease: "linear", repeat: Infinity }}
          className="absolute inset-0"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
        </motion.div>
      </div>

      {/* Pure CSS Typography */}
      <div className="flex flex-col">
        <span className="text-xl font-black leading-none tracking-tighter text-foreground">
          EquiSaaS<span className="text-primary">BD</span>
        </span>
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground leading-tight mt-0.5">
          {lang === "bn" ? "ওপেন টেক কো-অপারেটিভ" : "Open Tech Co-op"}
        </span>
      </div>
    </div>
  );
}
