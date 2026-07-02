import React, { useEffect, useState } from "react";
import { MotionConfig, motion } from "framer-motion";
import { ArrowUpRight, Code, Database, LayoutTemplate, Megaphone, Server, Target, GraduationCap, Clock, X, AlertCircle } from "lucide-react";

import AmbientBackdrop from "@/components/landing/AmbientBackdrop";
import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header/Header";
import CommandPalette from "@/components/landing/CommandPalette";
import Chatbot from "@/components/chatbot/Chatbot";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatedBlock } from "@/components/ui/animated-block";

const projectsList = [
  {
    id: "elite-sales-co-pilot",
    titleEn: "Elite Sales Co-Pilot",
    titleBn: "এলিট সেলস কো-পাইলট",
    domain: "elite-sales-co-pilot.equisaas-bd.com",
    url: "https://elite-sales-co-pilot.equisaas-bd.com/",
    categoryEn: "SaaS",
    categoryBn: "স্যাস",
    icon: Target,
    descEn: "AI-Powered Field Officer Tracking & Route Management System to optimize routes, monitor check-ins, and use AI for dynamic routing.",
    descBn: "এআই চালিত ফিল্ড অফিসার ট্র্যাকিং এবং রুট ম্যানেজমেন্ট সিস্টেম যা রুট অপ্টিমাইজ, চেক-ইন মনিটরিং এবং সেলস এফিসিয়েন্সি বাড়াতে সাহায্য করে।",
    tags: ["AI", "Next.js", "SaaS"],
    color: "from-blue-500 to-indigo-700"
  },
  {
    id: "bd-erp-pos-web",
    titleEn: "BD ERP POS (Web)",
    titleBn: "বিডি ইআরপি পস (ওয়েব)",
    domain: "bd-erp-pos.equisaas-bd.com",
    url: "https://bd-erp-pos.equisaas-bd.com/",
    categoryEn: "Cloud ERP",
    categoryBn: "ক্লাউড ইআরপি",
    icon: Database,
    descEn: "Cloud-based ERP and POS solution for retail businesses to manage inventory, sales, and reporting from anywhere.",
    descBn: "যেকোনো জায়গা থেকে ব্যবসার ইনভেন্টরি, সেলস এবং রিপোর্টিং ম্যানেজ করার জন্য ক্লাউড-বেসড ইআরপি ও পস সলিউশন।",
    tags: ["Cloud", "React", "POS"],
    color: "from-sky-500 to-blue-700"
  },
  {
    id: "bd-erp-pos-software",
    titleEn: "BD ERP POS (Software)",
    titleBn: "বিডি ইআরপি পস (সফটওয়্যার)",
    domain: "equisaas-bd.com/bd-erp-pos/",
    url: "https://equisaas-bd.com/bd-erp-pos/",
    categoryEn: "Desktop POS",
    categoryBn: "ডেস্কটপ পস",
    icon: Database,
    descEn: "The Ultimate Offline Retail Engine. Built specifically for Bangladesh's retail reality without complicated cloud dependency. Features: Windows setup, Offline Activation, Thermal Printing, and Bilingual Workflow. No internet required for daily operations.",
    descBn: "বাংলাদেশের রিটেইল শপগুলোর জন্য তৈরি আলটিমেট অফলাইন ডেস্কটপ পস (POS)। কোনো ক্লাউড ডিপেন্ডেন্সি ছাড়াই ইনভেন্টরি, বিলিং এবং থার্মাল প্রিন্টিং সুবিধা। ইন্টারনেট ছাড়াই দৈনিক অপারেশন সম্ভব।",
    tags: ["Desktop", "Offline", "Windows"],
    color: "from-blue-600 to-indigo-800"
  },
  {
    id: "agrolink-bd",
    titleEn: "AgroLink BD",
    titleBn: "এগ্রোলিংক বিডি",
    domain: "agrolink-bd.equisaas-bd.com",
    active: false,
    categoryEn: "SaaS",
    categoryBn: "স্যাস",
    icon: Target,
    descEn: "Buy fresh produce direct from Bangladeshi farmers, get live market prices, and access farmer tools.",
    descBn: "বাংলাদেশের কৃষকদের কাছ থেকে সরাসরি সতেজ কৃষিপণ্য কিনুন, লাইভ বাজারদর জানুন এবং ফার্মার টুলস ব্যবহার করুন।",
    tags: ["React", "Firebase", "Supply Chain"],
    color: "from-green-500 to-emerald-700"
  },
  {
    id: "design",
    titleEn: "EquiSaaS Design Studio",
    titleBn: "ইকুইস্যাস ডিজাইন স্টুডিও",
    domain: "design.equisaas-bd.com",
    active: false,
    categoryEn: "Design",
    categoryBn: "ডিজাইন",
    icon: LayoutTemplate,
    descEn: "A Complete Roadmap and Resource Architecture for UI/UX and Graphic Design in 2026.",
    descBn: "২০২৬ সালের জন্য ইউআই/ইউএক্স এবং গ্রাফিক ডিজাইনের একটি পূর্ণাঙ্গ রোডম্যাপ এবং রিসোর্স আর্কিটেকচার।",
    tags: ["UI/UX", "Figma", "Branding"],
    color: "from-fuchsia-500 to-pink-700"
  },
  {
    id: "fullstack",
    titleEn: "Fullstack Solutions Hub",
    titleBn: "ফুলস্ট্যাক সলিউশনস হাব",
    domain: "fullstack.equisaas-bd.com",
    active: false,
    categoryEn: "Engineering",
    categoryBn: "ইঞ্জিনিয়ারিং",
    icon: Server,
    descEn: "A rigorous methodological roadmap for the next generation of software engineering, bridging the gap between interface and infrastructure.",
    descBn: "সফটওয়্যার ইঞ্জিনিয়ারিংয়ের ভবিষ্যৎ প্রজন্মের জন্য একটি সুস্পষ্ট এবং মেথডোলজিক্যাল রোডম্যাপ।",
    tags: ["Next.js", "Node.js", "Architecture"],
    color: "from-violet-500 to-purple-700"
  },
  {
    id: "graduation-gate",
    titleEn: "Graduation Gate",
    titleBn: "গ্র্যাজুয়েশন গেট",
    domain: "graduation-gate.equisaas-bd.com",
    active: false,
    categoryEn: "Education",
    categoryBn: "এডুকেশন",
    icon: GraduationCap,
    descEn: "Get help with implementation, thesis writing, slides, and viva preparation for your final year project.",
    descBn: "আপনার ফাইনাল ইয়ার প্রজেক্টের ইমপ্লিমেন্টেশন, থিসিস লেখা, স্লাইড এবং ভাইভা প্রস্তুতির জন্য সহায়তা পান।",
    tags: ["React", "Community Platform"],
    color: "from-amber-500 to-orange-700"
  },
  {
    id: "marketing",
    titleEn: "Marketing Intelligence",
    titleBn: "মার্কেটিং ইন্টেলিজেন্স",
    domain: "marketing.equisaas-bd.com",
    active: false,
    categoryEn: "Marketing",
    categoryBn: "মার্কেটিং",
    icon: Megaphone,
    descEn: "An exhaustive, step-by-step learning roadmap and resource architecture for global and localized marketing.",
    descBn: "গ্লোবাল এবং লোকাল মার্কেটিংয়ের জন্য একটি বিশদ, ধাপে ধাপে সাজানো লার্নিং রোডম্যাপ এবং রিসোর্স আর্কিটেকচার।",
    tags: ["Marketing", "Analytics", "SEO"],
    color: "from-rose-500 to-red-700"
  },
  {
    id: "olioresto",
    titleEn: "Olio The Cafe & Resto",
    titleBn: "ওলিও দ্যা ক্যাফে এন্ড রেস্টো",
    domain: "olioresto.equisaas-bd.com",
    active: false,
    categoryEn: "SaaS",
    categoryBn: "স্যাস",
    icon: Code,
    descEn: "Restaurant management system combining a customer-facing website with a Firebase-backed POS and reservation admin suite.",
    descBn: "কাস্টমার ফেসিং ওয়েবসাইট, ফায়ারবেস-ভিত্তিক পস (POS) এবং রিজার্ভেশন অ্যাডমিন প্যানেল সমৃদ্ধ রেস্টুরেন্ট ম্যানেজমেন্ট সিস্টেম।",
    tags: ["React", "TypeScript", "POS"],
    color: "from-teal-500 to-cyan-700"
  },
  {
    id: "smepulse",
    titleEn: "EquiPulse AI",
    titleBn: "ইকুইপালস এআই",
    domain: "smepulse.equisaas-bd.com",
    url: "https://smepulse.equisaas-bd.com/",
    categoryEn: "SaaS",
    categoryBn: "স্যাস",
    icon: Database,
    descEn: "An offline-first commerce and retail intelligence platform. Integrates local DuckDB WASM analytics, multimodal Bangla receipt OCR, and Ollama local AI fallback.",
    descBn: "ক্ষুদ্র ও মাঝারি ব্যবসায়ীদের জন্য অফলাইন-ফার্স্ট এআই কমার্স প্ল্যাটফর্ম। এতে রয়েছে লোকাল DuckDB WASM অ্যানালিটিক্স, বাংলা মেমো স্ক্যান (OCR) ও হিসাব মিলকরণ এবং অফলাইন Ollama এআই ফলব্যাক সুবিধা।",
    tags: ["AI", "ERP", "POS"],
    color: "from-sky-500 to-blue-700"
  },
  {
    id: "impact-growth-playbook",
    titleEn: "Impact Growth Playbook",
    titleBn: "ইমপ্যাক্ট গ্রোথ প্লেবুক",
    domain: "impact-growth-playbook.web.app",
    categoryEn: "Strategy",
    categoryBn: "স্ট্র্যাটেজি",
    icon: LayoutTemplate,
    descEn: "A comprehensive digital playbook and strategic framework designed to accelerate business growth and operational scaling.",
    descBn: "বিজনেস গ্রোথ এবং অপারেশনাল স্কেলিং ত্বরান্বিত করার জন্য একটি কম্প্রিহেনসিভ ডিজিটাল প্লেবুক এবং স্ট্র্যাটেজিক ফ্রেমওয়ার্ক।",
    tags: ["Strategy", "Playbook", "Firebase"],
    color: "from-violet-500 to-purple-700"
  },
  {
    id: "cheesel",
    titleEn: "Cheesel",
    titleBn: "চিজল",
    domain: "cheesel.equisaas-bd.com",
    active: false,
    categoryEn: "Brand",
    categoryBn: "ব্র্যান্ড",
    icon: LayoutTemplate,
    descEn: "Modern digital presence and brand experience designed for Cheesel, emphasizing high-end aesthetics and user engagement.",
    descBn: "চিজল ব্র্যান্ডের জন্য হাই-এন্ড এস্থেটিকস এবং ইউজার এনগেজমেন্টকে প্রাধান্য দিয়ে তৈরি মডার্ন ডিজিটাল প্রেজেন্স।",
    tags: ["Branding", "UI/UX", "Web"],
    color: "from-rose-500 to-red-700"
  },
  {
    id: "akaba-international",
    titleEn: "Akaba International",
    titleBn: "আকাবা ইন্টারন্যাশনাল",
    domain: "akaba-international.equisaas-bd.com",
    active: false,
    categoryEn: "Corporate",
    categoryBn: "কর্পোরেট",
    icon: Server,
    descEn: "A powerful corporate digital platform built for Akaba International to support global reach, credibility, and enterprise operations.",
    descBn: "আকাবা ইন্টারন্যাশনালের গ্লোবাল রিচ, ক্রেডিবিলিটি এবং এন্টারপ্রাইজ অপারেশনের জন্য তৈরি একটি শক্তিশালী কর্পোরেট ডিজিটাল প্ল্যাটফর্ম।",
    tags: ["Corporate", "Enterprise", "Web"],
    color: "from-emerald-500 to-green-700"
  }
];

function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("theme") || "light";
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  return [theme, setTheme];
}

function useLang() {
  const [lang, setLang] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("lang");
      if (stored === "bn" || stored === "en") return stored;
    }
    return "bn";
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dataset.locale = lang;
    localStorage.setItem("lang", lang);
  }, [lang]);

  return [lang, setLang];
}

export default function ProjectsAppView() {
  const [lang, setLang] = useLang();
  const [theme, setTheme] = useTheme();
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider delayDuration={400}>
        <div className="min-h-screen bg-background text-foreground tracking-tight relative overflow-hidden selection:bg-primary/20 selection:text-primary">
          <AmbientBackdrop />
          <Header lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />

          <main className="container mx-auto px-6 pt-32 pb-24 relative z-10" id="main-content">
            <AnimatedBlock direction="down" distance={40}>
              <div className="max-w-3xl mb-16 space-y-6">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                  EquiSaaS BD Ecosystem
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                  {lang === "bn" ? "আমাদের সফটওয়্যার এবং প্রজেক্টসমূহ" : "Our Software & Projects Ecosystem"}
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {lang === "bn" 
                    ? "বাংলাদেশে SME সফটওয়্যার থেকে শুরু করে ডিজাইন, মার্কেটিং এবং ডেটা এনালিটিক্স পর্যন্ত আমাদের সকল সাব-প্রজেক্ট। Together We Build, Together We Own." 
                    : "From Bangladesh-first SME software to design, marketing, and data analytics. Explore our active sub-projects and platforms."}
                </p>
              </div>
            </AnimatedBlock>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {projectsList.map((project, i) => (
                <AnimatedBlock key={project.id} direction="up" distance={30} delay={i * 0.1}>
                  <a 
                    href={project.active !== false ? (project.url ? project.url : `https://${project.domain}`) : "#"}
                    onClick={(e) => {
                      if (project.active === false) {
                        e.preventDefault();
                        setSelectedProject(project);
                      }
                    }}
                    target={project.active !== false ? "_blank" : undefined}
                    rel={project.active !== false ? "noopener noreferrer" : undefined}
                    className="group relative flex flex-col h-full bg-card/60 backdrop-blur-md border border-border/60 hover:border-primary/40 rounded-3xl p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-hidden cursor-pointer"
                  >
                    <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${project.color} opacity-80`} />
                    
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-muted/50 rounded-2xl group-hover:bg-primary/10 transition-colors">
                        <project.icon className="w-8 h-8 text-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                        {lang === "bn" ? project.categoryBn : project.categoryEn}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black tracking-tight mb-3 group-hover:text-primary transition-colors">
                      {lang === "bn" ? project.titleBn : project.titleEn}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed mb-8 flex-grow">
                      {lang === "bn" ? project.descBn : project.descEn}
                    </p>

                    <div className="mt-auto">
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tags.map(tag => (
                          <span key={tag} className="text-xs font-semibold bg-background/80 border border-border/50 px-2.5 py-1 rounded-md text-foreground/80">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center text-sm font-bold text-primary group-hover:translate-x-1 transition-transform">
                        {project.active !== false ? (
                          <>
                            {lang === "bn" ? "লাইভ সাইট দেখুন" : "Visit Live Site"}
                            <ArrowUpRight className="ml-1 w-4 h-4" />
                          </>
                        ) : (
                          <>
                            {lang === "bn" ? "বিস্তারিত জানুন" : "View Details"}
                            <AlertCircle className="ml-1 w-4 h-4" />
                          </>
                        )}
                      </div>
                    </div>
                  </a>
                </AnimatedBlock>
              ))}
            </div>
          </main>

          <Footer lang={lang} />
          <CommandPalette lang={lang} theme={theme} setTheme={setTheme} />
          <Chatbot lang={lang} theme={theme} />

          {/* Coming Soon Modal for Unreleased Projects */}
          {selectedProject && (
            <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-6">
              <div 
                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                onClick={() => setSelectedProject(null)}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative w-full max-w-lg bg-card border border-border/50 rounded-3xl p-8 shadow-2xl overflow-hidden"
              >
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${selectedProject.color}`} />
                
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="mb-6 inline-flex p-4 rounded-2xl bg-primary/10 text-primary">
                  <Clock size={32} />
                </div>
                
                <h3 className="text-3xl font-black mb-3 text-foreground tracking-tight">
                  {lang === "bn" ? "ডেভেলপমেন্ট চলছে" : "Under Development"}
                </h3>
                
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  {lang === "bn" 
                    ? `আমাদের ইঞ্জিনিয়ারিং দল বর্তমানে '${selectedProject.titleBn}' প্ল্যাটফর্মটির ওপর কাজ করছে। খুব শিগগিরই এটি উন্মুক্ত করা হবে।` 
                    : `Our engineering team is actively working on the '${selectedProject.titleEn}' platform. It will be launched very soon.`}
                </p>
                
                <div className="p-4 rounded-2xl bg-muted/50 border border-border/50 mb-8 flex items-center gap-4">
                  <div className="flex-1">
                    <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      {lang === "bn" ? "প্রজেক্ট ডোমেইন" : "Project Domain"}
                    </span>
                    <span className="font-mono text-sm text-foreground">
                      {selectedProject.domain}
                    </span>
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background border border-border/50">
                    <selectedProject.icon size={18} className="text-muted-foreground" />
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedProject(null)}
                  className="w-full py-4 rounded-xl bg-foreground text-background font-bold text-lg hover:bg-foreground/90 transition-colors"
                >
                  {lang === "bn" ? "বুঝেছি" : "Got it"}
                </button>
              </motion.div>
            </div>
          )}
        </div>
      </TooltipProvider>
    </MotionConfig>
  );
}
