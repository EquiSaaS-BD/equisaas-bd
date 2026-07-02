import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Code, Palette, Briefcase, RefreshCcw } from "lucide-react";

import Section from "@/components/landing/Section";
import { fadeUp } from "@/components/landing/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { normalizeLocalizedTree } from "@/lib/localized-copy";

const COPY = normalizeLocalizedTree({
  en: {
    badge: "Find Your Path",
    title: "Not sure which department fits you?",
    desc: "Answer 2 simple questions to find your perfect learning path.",
    startBtn: "Start Quick Quiz",
    restartBtn: "Start Over",
    questions: {
      q1: {
        text: "What do you naturally prefer working with?",
        options: [
          { id: "logic", label: "Logic, Code, and Data", icon: Code },
          { id: "visual", label: "Visuals, Design, and Humans", icon: Palette },
          { id: "strategy", label: "Organization and Strategy", icon: Briefcase }
        ]
      },
      q2_logic: {
        text: "Which of these sounds more exciting?",
        options: [
          { id: "Frontend", label: "Building the visible UI and web apps", deptUrl: "#departments" },
          { id: "Backend", label: "Managing databases and server logic", deptUrl: "#departments" },
          { id: "DevOps", label: "Handling servers, deployment, and cloud", deptUrl: "#departments" }
        ]
      },
      q2_visual: {
        text: "Which of these sounds more exciting?",
        options: [
          { id: "UI/UX", label: "Designing screens and user experiences", deptUrl: "#departments" },
          { id: "Marketing", label: "Writing copy and running campaigns", deptUrl: "#departments" },
          { id: "CRM & HR", label: "Managing teams and customer relations", deptUrl: "#departments" }
        ]
      },
      q2_strategy: {
        text: "Which of these sounds more exciting?",
        options: [
          { id: "Product Management", label: "Leading projects and managing timelines", deptUrl: "#departments" },
          { id: "Business Analyst", label: "Analyzing business needs and data", deptUrl: "#departments" },
          { id: "QA", label: "Testing software and assuring quality", deptUrl: "#departments" }
        ]
      }
    },
    resultTitle: "Your Recommended Department:",
    resultDesc: "Based on your preferences, this is the best path for you to start learning.",
    gotoDeptBtn: "Explore This Department"
  },
  bn: {
    badge: "আপনার পথ খুঁজে নিন",
    title: "কোন ডিপার্টমেন্ট আপনার জন্য সঠিক?",
    desc: "মাত্র ২টি সাধারণ প্রশ্নের উত্তর দিয়ে আপনার জন্য পারফেক্ট লার্নিং পাথ খুঁজে নিন।",
    startBtn: "কুইজ শুরু করুন",
    restartBtn: "আবার শুরু করুন",
    questions: {
      q1: {
        text: "আপনি স্বাভাবিকভাবে কোন বিষয়গুলো নিয়ে কাজ করতে পছন্দ করেন?",
        options: [
          { id: "logic", label: "লজিক, কোডিং এবং ডেটা", icon: Code },
          { id: "visual", label: "ভিজ্যুয়াল ডিজাইন এবং মানুষের সাইকোলজি", icon: Palette },
          { id: "strategy", label: "অর্গানাইজেশন এবং প্রজেক্ট ম্যানেজমেন্ট", icon: Briefcase }
        ]
      },
      q2_logic: {
        text: "এর মধ্যে কোনটি আপনার বেশি রোমাঞ্চকর মনে হয়?",
        options: [
          { id: "Frontend", label: "ওয়েবসাইটের ইউজার ইন্টারফেস তৈরি করা", deptUrl: "#departments" },
          { id: "Backend", label: "সার্ভার এবং ডেটাবেস নিয়ে কাজ করা", deptUrl: "#departments" },
          { id: "DevOps", label: "সার্ভার ডেপ্লয়মেন্ট এবং ক্লাউড ম্যানেজমেন্ট", deptUrl: "#departments" }
        ]
      },
      q2_visual: {
        text: "এর মধ্যে কোনটি আপনার বেশি রোমাঞ্চকর মনে হয়?",
        options: [
          { id: "UI/UX", label: "অ্যাপ বা ওয়েবসাইটের ডিজাইন তৈরি করা", deptUrl: "#departments" },
          { id: "Marketing", label: "ব্র্যান্ডিং এবং মার্কেটিং ক্যাম্পেইন চালানো", deptUrl: "#departments" },
          { id: "CRM & HR", label: "টিম এবং কাস্টমার রিলেশন ম্যানেজ করা", deptUrl: "#departments" }
        ]
      },
      q2_strategy: {
        text: "এর মধ্যে কোনটি আপনার বেশি রোমাঞ্চকর মনে হয়?",
        options: [
          { id: "Product Management", label: "প্রজেক্ট লিড দেওয়া এবং টাইমলাইন ম্যানেজ করা", deptUrl: "#departments" },
          { id: "Business Analyst", label: "বিজনেস ডেটা অ্যানালাইসিস করা", deptUrl: "#departments" },
          { id: "QA", label: "সফটওয়্যার টেস্ট করে বাগ (Bug) বের করা", deptUrl: "#departments" }
        ]
      }
    },
    resultTitle: "আপনার জন্য সাজেস্টেড ডিপার্টমেন্ট:",
    resultDesc: "আপনার উত্তরের ওপর ভিত্তি করে এই ডিপার্টমেন্টটি আপনার জন্য সবচেয়ে ভালো হবে।",
    gotoDeptBtn: "এই ডিপার্টমেন্টটি সম্পর্কে জানুন"
  }
});

export default function DepartmentQuiz({ lang }) {
  const t = COPY[lang];
  const [step, setStep] = useState(0); // 0: Start, 1: Q1, 2: Q2, 3: Result
  const [q1Answer, setQ1Answer] = useState(null);
  const [result, setResult] = useState(null);

  const handleStart = () => setStep(1);

  const handleQ1Select = (id) => {
    setQ1Answer(id);
    setStep(2);
  };

  const handleQ2Select = (dept) => {
    setResult(dept);
    setStep(3);
  };

  const handleRestart = () => {
    setStep(0);
    setQ1Answer(null);
    setResult(null);
  };

  let currentQuestion = null;
  if (step === 1) currentQuestion = t.questions.q1;
  if (step === 2) currentQuestion = t.questions[`q2_${q1Answer}`];

  return (
    <Section id="department-quiz" className="relative overflow-hidden bg-background py-12 md:py-16 lg:py-24">
      <div className="container relative mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center space-y-8">
          
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <Badge variant="soft" className="rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-xs font-semibold">
                  <Sparkles className="mr-1 h-3 w-3 inline-block" /> {t.badge}
                </Badge>
                <h2 className="text-3xl font-black tracking-tight md:text-3xl sm:text-4xl lg:text-5xl">{t.title}</h2>
                <p className="text-lg text-muted-foreground">{t.desc}</p>
                <Button onClick={handleStart} className="rounded-full px-8 h-14 text-lg">
                  {t.startBtn} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            )}

            {(step === 1 || step === 2) && currentQuestion && (
              <motion.div
                key={`q${step}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="rounded-[2rem] border-border/50 bg-card/85 shadow-xl backdrop-blur-xl">
                  <CardHeader className="p-8 pb-4">
                    <CardDescription className="font-bold text-primary mb-2 uppercase tracking-widest text-xs">
                      Question {step} of 2
                    </CardDescription>
                    <CardTitle className="text-2xl font-black">{currentQuestion.text}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 space-y-3">
                    {currentQuestion.options.map((opt) => {
                      const Icon = opt.icon;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => step === 1 ? handleQ1Select(opt.id) : handleQ2Select(opt)}
                          className="w-full flex items-center gap-4 rounded-2xl border border-border/60 bg-muted/30 p-4 text-left transition-all hover:bg-primary/5 hover:border-primary/30"
                        >
                          {Icon && (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                              <Icon className="h-5 w-5" />
                            </div>
                          )}
                          <span className="font-semibold text-foreground/90">{opt.label}</span>
                        </button>
                      );
                    })}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 3 && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="rounded-[2rem] border-primary/20 bg-primary/5 shadow-2xl overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-600" />
                  <CardHeader className="p-8 pb-4">
                    <CardDescription className="font-bold text-primary mb-2 uppercase tracking-widest text-xs">
                      {t.resultTitle}
                    </CardDescription>
                    <CardTitle className="text-4xl font-black text-primary">{result.id}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 space-y-6">
                    <p className="text-base text-muted-foreground">{t.resultDesc}</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button asChild className="rounded-xl h-12 px-6">
                        <a href={result.deptUrl}>
                          {t.gotoDeptBtn} <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                      <Button variant="outline" onClick={handleRestart} className="rounded-xl h-12 px-6">
                        <RefreshCcw className="mr-2 h-4 w-4" /> {t.restartBtn}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </Section>
  );
}
