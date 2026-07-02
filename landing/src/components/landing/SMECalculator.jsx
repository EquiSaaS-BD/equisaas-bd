import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, Clock, Users, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { normalizeLocalizedTree } from "@/lib/localized-copy";
import { fadeUp } from "@/components/landing/motion";
import { cn } from "@/lib/utils";

const COPY = normalizeLocalizedTree({
  en: {
    badge: "Interactive Tool",
    title: "Calculate Your ROI",
    subtitle: "See how much time and money EquiPulse AI can save your business every month.",
    inputHours: "Manual Work Hours/Day",
    inputStaff: "Number of Staff",
    inputCost: "Avg. Hourly Wage (BDT)",
    resultsTitle: "Estimated Monthly Savings",
    timeSaved: "Time Saved",
    moneySaved: "Money Saved",
    hours: "hours",
    bdt: "৳",
    cta: "Start Saving Today",
    note: "Based on average SME adoption metrics reducing manual effort by 65%."
  },
  bn: {
    badge: "ইন্টারেক্টিভ টুল",
    title: "আপনার ROI হিসাব করুন",
    subtitle: "EquiPulse AI প্রতি মাসে আপনার ব্যবসার কত সময় ও অর্থ সাশ্রয় করতে পারে তা দেখুন।",
    inputHours: "দৈনিক ম্যানুয়াল কাজের সময় (ঘণ্টা)",
    inputStaff: "কর্মীর সংখ্যা",
    inputCost: "ঘণ্টাপ্রতি গড় মজুরি (টাকা)",
    resultsTitle: "আনুমানিক মাসিক সাশ্রয়",
    timeSaved: "সময় সাশ্রয়",
    moneySaved: "অর্থ সাশ্রয়",
    hours: "ঘণ্টা",
    bdt: "৳",
    cta: "আজই সাশ্রয় শুরু করুন",
    note: "ম্যানুয়াল কাজ ৬৫% কমানোর গড় SME মেট্রিক্সের ওপর ভিত্তি করে।"
  }
});

export default function SMECalculator({ lang }) {
  const t = COPY[lang] || COPY.en;
  
  const [hours, setHours] = useState(4);
  const [staff, setStaff] = useState(3);
  const [wage, setWage] = useState(150);

  // Math: 26 working days in a month. 65% efficiency gain.
  const totalMonthlyHours = hours * staff * 26;
  const savedHours = Math.round(totalMonthlyHours * 0.65);
  const savedMoney = savedHours * wage;

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
      
      <div className="container relative z-10 mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-xs font-semibold text-primary uppercase tracking-wider mb-6">
              {t.badge}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4 text-gradient-brand">
              {t.title}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t.subtitle}
            </p>
          </motion.div>
        </div>

        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Card className="glass-card-hover overflow-hidden rounded-[2.5rem] border border-border/50 shadow-2xl backdrop-blur-xl bg-card/60">
              <CardContent className="p-0 grid lg:grid-cols-2">
                {/* Input Section */}
                <div className="p-8 md:p-12 space-y-8 border-b lg:border-b-0 lg:border-r border-border/50 bg-muted/20">
                  <div className="flex items-center gap-3 text-primary mb-2">
                    <Calculator className="h-6 w-6" />
                    <h3 className="text-xl font-bold">Business Metrics</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <label className="text-sm font-semibold text-foreground">{t.inputHours}</label>
                        <span className="text-sm font-bold text-primary">{hours}</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" max="12" step="1" 
                        value={hours} 
                        onChange={(e) => setHours(Number(e.target.value))}
                        className="w-full accent-primary"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <label className="text-sm font-semibold text-foreground">{t.inputStaff}</label>
                        <span className="text-sm font-bold text-primary">{staff}</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" max="20" step="1" 
                        value={staff} 
                        onChange={(e) => setStaff(Number(e.target.value))}
                        className="w-full accent-primary"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <label className="text-sm font-semibold text-foreground">{t.inputCost}</label>
                        <span className="text-sm font-bold text-primary">{t.bdt}{wage}</span>
                      </div>
                      <input 
                        type="range" 
                        min="50" max="1000" step="50" 
                        value={wage} 
                        onChange={(e) => setWage(Number(e.target.value))}
                        className="w-full accent-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Output Section */}
                <div className="p-8 md:p-12 flex flex-col justify-center relative overflow-hidden bg-gradient-to-br from-primary/5 to-coop/5">
                  <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <TrendingUp className="w-48 h-48" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-8">{t.resultsTitle}</h3>
                  
                  <div className="space-y-8 relative z-10">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm font-semibold">
                        <Clock className="w-4 h-4 text-primary" />
                        {t.timeSaved}
                      </div>
                      <div className="text-4xl font-black text-foreground">
                        {savedHours} <span className="text-xl text-muted-foreground">{t.hours}/mo</span>
                      </div>
                      <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden mt-3">
                        <motion.div 
                          className="bg-primary h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((savedHours / 500) * 100, 100)}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm font-semibold">
                        <Users className="w-4 h-4 text-coop" />
                        {t.moneySaved}
                      </div>
                      <div className="text-5xl font-black text-coop">
                        {t.bdt}{savedMoney.toLocaleString()} <span className="text-xl text-muted-foreground">/mo</span>
                      </div>
                      <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden mt-3">
                        <motion.div 
                          className="bg-coop h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((savedMoney / 100000) * 100, 100)}%` }}
                          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        />
                      </div>
                    </div>

                    <div className="pt-6 border-t border-border/50">
                      <p className="text-xs text-muted-foreground mb-6">
                        * {t.note}
                      </p>
                      <Button className="w-full btn-glow rounded-xl h-14 text-lg font-bold" asChild>
                        <a href="/sme-software-bangladesh/">
                          {t.cta}
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
