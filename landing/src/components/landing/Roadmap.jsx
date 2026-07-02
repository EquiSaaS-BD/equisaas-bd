import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { CONTENT } from "@/data/cofounder/content";
import Section from "@/components/landing/Section";
import { fadeUp } from "@/components/landing/motion";
import { Badge } from "@/components/ui/badge";
import { Circle, CheckCircle2, Activity, MapPin } from "lucide-react";

export default function Roadmap({ lang }) {
  const t = CONTENT[lang].roadmap;
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <Section id="roadmap" className="relative overflow-hidden bg-background py-16 md:py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />

      <div className="container relative mx-auto space-y-20 px-6">
        
        {/* Header with Labor Illusion */}
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <motion.div variants={fadeUp} className="flex justify-center">
            <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary backdrop-blur-md">
              <Activity className="h-4 w-4 animate-pulse" />
              <span>{lang === "bn" ? "লাইভ ইকোসিস্টেম ট্র্যাকার" : "Live Ecosystem Tracker"}</span>
            </div>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-4xl font-black tracking-tight md:text-5xl lg:text-6xl">
            {t.title}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-muted-foreground">
            {lang === "bn" 
              ? "৬৪ জেলার কো-ফাউন্ডারদের নিয়ে আমাদের মিশন কীভাবে এগিয়ে যাচ্ছে, তার রিয়েল-টাইম ওভারভিউ।"
              : "Real-time overview of how our 64-district co-founder mission is advancing."}
          </motion.p>
        </div>

        {/* Timeline */}
        <div ref={containerRef} className="relative mx-auto max-w-5xl">
          
          {/* Animated Scroll Track */}
          <div className="absolute bottom-0 left-8 md:left-12 top-0 w-1 -translate-x-1/2 rounded-full bg-primary/10 z-0">
            <motion.div 
              className="absolute left-0 top-0 w-full origin-top rounded-full bg-gradient-to-b from-primary to-coop shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
              style={{ scaleY, height: "100%" }}
            />
          </div>

          <div className="relative space-y-12">
            {t.phases.map((phase, index) => {
              // Phase logic based on new narrative
              const isCompleted = index === 1; // Phase 2 (MVP)
              const isInProgress = index === 0 || index === 2; // Phase 1 & 3
              
              return (
                <motion.div
                  key={phase.id}
                  variants={fadeUp}
                  custom={index}
                  className={`flex flex-col relative pl-16 md:pl-24`}
                >
                  {/* Content Box */}
                  <div className={`w-full relative z-10 max-w-4xl`}>
                    <div 
                      className={`glass-premium group relative rounded-[2rem] p-8 shadow-2xl transition-all duration-500 backdrop-blur-xl border
                      ${isCompleted ? "border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/50 hover:shadow-emerald-500/10" : ""}
                      ${isInProgress ? "border-primary/50 bg-primary/5 shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)] hover:shadow-[0_0_40px_rgba(var(--primary-rgb),0.2)]" : ""}
                      ${!isCompleted && !isInProgress ? "border-border/50 bg-card/60 hover:border-border/80" : ""}`}
                    >
                      <div className="space-y-5">
                        <div className={`flex items-center gap-3 justify-start`}>
                          <span className={`rounded-xl px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] shadow-sm
                            ${isCompleted ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" : ""}
                            ${isInProgress ? "bg-primary/20 text-primary" : ""}
                            ${!isCompleted && !isInProgress ? "bg-muted text-muted-foreground" : ""}
                          `}>
                            {phase.id}
                          </span>
                          {isCompleted && (
                            <Badge variant="outline" className="border-emerald-500 text-emerald-600 dark:text-emerald-400 gap-1.5 py-1 px-3">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              {lang === "bn" ? "সম্পন্ন" : "Completed"}
                            </Badge>
                          )}
                          {isInProgress && (
                            <Badge variant="outline" className="border-primary text-primary gap-1.5 animate-pulse py-1 px-3 shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]">
                              <Activity className="h-3.5 w-3.5" />
                              {lang === "bn" ? "চলমান" : "In Progress"}
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black tracking-tight">{phase.title}</h3>
                        <p className="leading-relaxed text-muted-foreground text-base md:text-lg">{phase.desc}</p>
                        
                        {/* Social Proof / Details */}
                        {index === 0 && (
                          <div className={`mt-6 flex items-center gap-2 text-sm font-bold text-primary justify-start`}>
                            <MapPin className="h-4 w-4" />
                            {lang === "bn" ? "৬৪ জেলা কভারড" : "64 Districts Covered"}
                          </div>
                        )}
                        {index === 0 && (
                          <div className={`mt-3 flex items-center gap-3 text-sm font-bold text-emerald-600 dark:text-emerald-400 justify-start`}>
                            <div className="flex -space-x-2 shadow-sm">
                              {[1,2,3].map(i => (
                                <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-muted/50 backdrop-blur-sm" />
                              ))}
                            </div>
                            <span>{lang === "bn" ? "১০০+ অ্যাক্টিভ মেম্বার" : "100+ Active Members"}</span>
                          </div>
                        )}
                        {index === 3 && (
                          <div className={`mt-6 flex items-center gap-2 text-sm font-bold text-muted-foreground justify-start`}>
                            <span>{lang === "bn" ? "শুধুমাত্র যোগ্য সদস্যদের জন্য" : "For eligible members only"}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Center Node */}
                  <div className="absolute left-8 md:left-12 top-10 -translate-x-1/2 z-20 flex flex-col items-center">
                    <div className={`flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full border-[4px] bg-background shadow-xl transition-all duration-500
                      ${isCompleted ? "border-emerald-500 text-emerald-500 shadow-emerald-500/30" : ""}
                      ${isInProgress ? "border-primary text-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]" : ""}
                      ${!isCompleted && !isInProgress ? "border-muted text-muted-foreground" : ""}
                    `}>
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6" />
                      ) : isInProgress ? (
                        <div className="relative flex h-5 w-5 md:h-6 md:w-6 items-center justify-center">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex h-3 w-3 md:h-4 md:w-4 rounded-full bg-primary shadow-sm"></span>
                        </div>
                      ) : (
                        <Circle className="h-5 w-5 md:h-6 md:w-6 opacity-50" />
                      )}
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}
