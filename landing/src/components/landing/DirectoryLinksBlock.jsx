import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Grid, Users } from "lucide-react";
import Section from "@/components/landing/Section";
import { fadeUp } from "@/components/landing/motion";
import { AnimatedBlock } from "@/components/ui/animated-block";

export default function DirectoryLinksBlock({ lang }) {
  return (
    <Section className="py-12 md:py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Departments Link */}
          <AnimatedBlock direction="left" delay={0.1}>
            <a href="/departments/" className="group block">
              <div className="glass-premium p-8 rounded-[2rem] border border-white/5 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 h-full bg-white/5 dark:bg-black/20 flex flex-col items-start justify-between min-h-[220px]">
                <div className="bg-primary/10 p-4 rounded-2xl text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Grid className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">
                    {lang === "bn" ? "৯টি স্পেশালাইজড ডিপার্টমেন্ট" : "9 Specialized Departments"}
                  </h3>
                  <p className="text-muted-foreground font-medium flex items-center gap-2">
                    {lang === "bn" ? "বিস্তারিত জানুন" : "Explore Departments"}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </p>
                </div>
              </div>
            </a>
          </AnimatedBlock>

          {/* Leadership Link */}
          <AnimatedBlock direction="right" delay={0.2}>
            <a href="/leadership/" className="group block">
              <div className="glass-premium p-8 rounded-[2rem] border border-white/5 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 h-full bg-white/5 dark:bg-black/20 flex flex-col items-start justify-between min-h-[220px]">
                <div className="bg-indigo-500/10 p-4 rounded-2xl text-indigo-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-foreground group-hover:text-indigo-400 transition-colors">
                    {lang === "bn" ? "নেতৃত্ব ও কাঠামো" : "Leadership & Structure"}
                  </h3>
                  <p className="text-muted-foreground font-medium flex items-center gap-2">
                    {lang === "bn" ? "বিস্তারিত জানুন" : "Meet The Team"}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </p>
                </div>
              </div>
            </a>
          </AnimatedBlock>
        </div>
      </div>
    </Section>
  );
}
