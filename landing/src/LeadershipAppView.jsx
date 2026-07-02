import React from "react";
import { motion } from "framer-motion";
import { AnimatedBlock } from "@/components/ui/animated-block";
import Leadership from "@/components/landing/Leadership";

export default function LeadershipAppView({ lang }) {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen pb-16">
      
      {/* 🚀 STUNNING ANIMATED HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden flex items-center justify-center min-h-[50vh]">
        {/* Animated Background Orbs for Premium Vibe (No laggy 3D) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
              rotate: [0, 90, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.5, 0.2],
              y: [0, -50, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[150px]"
          />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/10 backdrop-blur-md mb-8"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-primary">
              {lang === "bn" ? "অফিসিয়াল স্ট্রাকচার" : "Official Structure"}
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter max-w-5xl mx-auto leading-[1.1]"
          >
            <span className="text-foreground">
              {lang === "bn" ? "আমাদের " : "Our "}
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-500 to-purple-500">
              {lang === "bn" ? "নেতৃত্ব ও কাঠামো" : "Leadership & Structure"}
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto mt-6"
          >
            {lang === "bn"
              ? "যাঁদের মেধা ও দিকনির্দেশনায় এগিয়ে যাচ্ছে বাংলাদেশের প্রথম ওপেন টেক কো-অপারেটিভ। আমাদের ভিশন: একসাথে গড়ি সব, একসাথে মালিকানা।"
              : "The visionary minds guiding Bangladesh's first open tech cooperative. Together we build, together we own."}
          </motion.p>
        </div>
      </section>
      
      {/* Leadership Directory Section */}
      <AnimatedBlock direction="up" distance={32} delay={0.3}>
        <Leadership lang={lang} />
      </AnimatedBlock>
    </main>
  );
}
