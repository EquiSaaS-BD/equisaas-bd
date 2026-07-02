import React, { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Map, Target, Clock, Zap, CheckCircle2, ChevronRight, Search } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import departmentsData from "@/data/departments.json";

function fadeUp(delay) {
  return {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay } },
  };
}

export default function DepartmentRoadmaps({ lang = "en" }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDepts = departmentsData.filter((dept) => {
    const term = searchTerm.toLowerCase();
    const titleObj = lang === "bn" ? dept.titleBn : dept.titleEn;
    const descObj = lang === "bn" ? dept.descBn : dept.descEn;
    return titleObj?.toLowerCase().includes(term) || descObj?.toLowerCase().includes(term);
  });

  return (
    <section id="roadmap" className="relative py-12 md:py-16 lg:py-24 overflow-hidden bg-background">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-emerald-500/5 blur-[100px] rounded-full mix-blend-multiply" />
      </div>

      <div className="container px-6 mx-auto relative z-10 max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp(0)}
          className="text-center space-y-4 mb-14"
        >
          <Badge variant="outline" className="px-4 py-1.5 rounded-full border-primary/20 bg-primary/5 text-primary text-sm font-semibold tracking-wide uppercase">
            {lang === "bn" ? "এ-টু-জেড লার্নিং ম্যাপ" : "A-Z Learning Maps"}
          </Badge>
          <h2 className="text-3xl sm:text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
            {lang === "bn" ? "৯টি ডিপার্টমেন্টের পূর্ণাঙ্গ রোডম্যাপ" : "Roadmaps for all 9 Departments"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {lang === "bn"
              ? "যেকোনো একটি ডিপার্টমেন্ট বেছে নিন এবং শূন্য থেকে প্রফেশনাল হওয়া পর্যন্ত যা যা শিখতে হবে তার পূর্ণাঙ্গ তালিকা দেখে নিন।"
              : "Choose your focus. See exactly what you will learn, build, and master from beginner to advanced level in the EquiSaaS ecosystem."}
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp(0.1)}
          className="mb-8 max-w-md mx-auto relative"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={lang === "bn" ? "ডিপার্টমেন্ট বা স্কিল খুঁজুন..." : "Search departments or skills..."}
              className="pl-10 h-12 rounded-2xl bg-card border-border/60 focus:ring-primary shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>

        <div className="grid gap-6">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {filteredDepts.map((dept, index) => (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp(0.1 + index * 0.05)}
                key={dept.subdeptId}
              >
                <AccordionItem
                  value={dept.subdeptId}
                  className="rounded-[2rem] border border-border/60 bg-card/50 overflow-hidden shadow-sm data-[state=open]:shadow-md transition-all data-[state=open]:border-primary/30"
                >
                  <AccordionTrigger className="px-6 sm:px-8 py-6 hover:no-underline group">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-left w-full pr-4">
                      <div className="flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-0 rounded-full px-3 text-xs">
                            {dept.deptId.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="rounded-full text-xs text-muted-foreground">
                            {dept.level}
                          </Badge>
                          {dept.duration && (
                            <Badge variant="outline" className="rounded-full text-xs text-muted-foreground flex items-center gap-1 border-transparent bg-muted/40">
                              <Clock className="w-3 h-3" /> {dept.duration}
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">
                          {lang === "bn" ? dept.titleBn : dept.titleEn}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {lang === "bn" ? dept.descBn : dept.descEn}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 sm:px-8 pb-8 pt-2">
                    <div className="space-y-8">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="bg-muted/30 rounded-2xl p-5 border border-border/40">
                          <h4 className="flex items-center gap-2 font-bold mb-3">
                            <Target className="w-4 h-4 text-primary" />
                            {lang === "bn" ? "পূর্বশর্ত (Prerequisites)" : "Prerequisites"}
                          </h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {lang === "bn" ? dept.prereqBn : dept.prereqEn}
                          </p>
                        </div>
                        <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10">
                          <h4 className="flex items-center gap-2 font-bold mb-3 text-primary">
                            <Zap className="w-4 h-4" />
                            {lang === "bn" ? "মূল অর্জন (Outcomes)" : "Core Outcomes"}
                          </h4>
                          <ul className="space-y-2">
                            {(lang === "bn" ? dept.outcomesBn : dept.outcomesEn).map((outcome, i) => (
                              <li key={i} className="flex gap-2 items-start text-sm text-muted-foreground">
                                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                <span>{outcome}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-bold flex items-center gap-2 text-lg">
                          <Map className="w-5 h-5 text-primary" />
                          {lang === "bn" ? "সংশ্লিষ্ট মডিউলসমূহ" : "Curriculum Modules"}
                        </h4>
                        <div className="grid gap-4 lg:grid-cols-2">
                          {dept.modules.map((module, mIdx) => (
                            <Card key={mIdx} className="shadow-none bg-background/50 border-border/60">
                              <CardHeader className="p-5 pb-3">
                                <div className="flex justify-between items-start">
                                  <CardTitle className="text-base font-bold">
                                    {mIdx + 1}. {lang === "bn" ? module.titleBn : module.titleEn}
                                  </CardTitle>
                                  {module.duration && <Badge variant="secondary" className="text-xs shrink-0">{module.duration}</Badge>}
                                </div>
                                <CardDescription className="line-clamp-2">
                                  {lang === "bn" ? module.summaryBn : module.summaryEn}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="p-5 pt-0">
                                <ul className="space-y-[10px]">
                                  {module.lessons.map((lesson, lIdx) => (
                                    <li key={lIdx} className="flex justify-between items-center text-sm px-3 py-2 rounded-lg bg-muted/30">
                                      <span className="flex items-center gap-2 font-medium text-foreground/80">
                                        <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                                        {lang === "bn" ? lesson.titleBn : lesson.titleEn}
                                      </span>
                                      {lesson.duration && <span className="text-xs text-muted-foreground bg-background px-2 py-0.5 rounded shadow-sm border border-border/40">{lesson.duration}</span>}
                                    </li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
            
            {filteredDepts.length === 0 && (
               <div className="text-center py-12 text-muted-foreground">
                 {lang === "bn" ? "কোনো ডিপার্টমেন্ট পাওয়া যায়নি।" : "No departments found for your search."}
               </div>
            )}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
