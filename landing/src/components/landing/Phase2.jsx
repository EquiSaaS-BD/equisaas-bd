import React from "react";
import { motion } from "framer-motion";

import { CONTENT, phase2Tabs } from "@/data/cofounder";
import Section from "@/components/landing/Section";
import { fadeUp } from "@/components/landing/motion";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Phase2({ lang }) {
  const t = CONTENT[lang].phase2;

  return (
    <Section id="phase2" className="py-12 md:py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-coop/15 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
      </div>

      <div className="container mx-auto px-6 space-y-14 relative">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <motion.div variants={fadeUp} custom={0}>
            <Badge variant="soft" className="text-xs font-semibold py-1 px-4 rounded-full border border-primary/20 bg-primary/5">
              ✦ {t.badge}
            </Badge>
          </motion.div>
          <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            {t.title}
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-muted-foreground text-lg leading-relaxed">
            {t.desc}
          </motion.p>
        </div>

        <Tabs defaultValue={phase2Tabs[0]?.id} className="max-w-6xl mx-auto">
          <TabsList className="grid grid-cols-3 w-full rounded-2xl bg-muted/40 p-1">
            {phase2Tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="rounded-xl">
                {lang === "bn" ? tab.labelBn : tab.labelEn}
              </TabsTrigger>
            ))}
          </TabsList>

          {phase2Tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tab.items.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.div key={idx} variants={fadeUp} custom={idx}>
                      <Card className="h-full bg-background/60 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-2xl border-0 overflow-hidden group hover:-translate-y-1 transition-transform duration-500">
                        <CardHeader>
                          <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary via-[#1e40af] to-coop border border-white/20 shadow-lg flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-500">
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="space-y-1">
                              <CardTitle className="text-xl font-black">{lang === "bn" ? item.titleBn : item.titleEn}</CardTitle>
                              <CardDescription className="text-muted-foreground leading-relaxed">{lang === "bn" ? item.descBn : item.descEn}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Section>
  );
}

