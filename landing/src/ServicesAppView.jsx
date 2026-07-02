import React, { useEffect, useState, useMemo } from "react";
import { MotionConfig, motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BriefcaseBusiness, CheckCircle2, ChevronRight, Code2, Cpu, Globe, Layout, MapPinned, Megaphone, MonitorPlay, PenTool, PieChart, ShieldCheck, Smartphone, Target, Search, MessageCircle, X, Layers, Sparkles, Loader2 } from "lucide-react";

import "@/styles/globals.scss";
import AmbientBackdrop from "@/components/landing/AmbientBackdrop";
import Header from "@/components/landing/Header/Header";
import Footer from "@/components/landing/Footer";
import MobileBottomNav from "@/components/landing/MobileBottomNav";
import Chatbot from "@/components/chatbot/Chatbot";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LINKS } from "@/data/cofounder";

// The 750+ services catalog is lazy-loaded on mount to keep the initial
// route chunk small. The JSON lives in its own Rollup chunk and is fetched
// after the page shell paints.
function useServicesCatalog() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    let alive = true;
    import("@/data/servicesCatalog.json")
      .then((mod) => {
        if (alive) setData(mod.default);
      })
      .catch((err) => {
        if (alive) setError(err);
      });
    return () => {
      alive = false;
    };
  }, []);
  return { data, error };
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

const getIconForSub = (sub) => {
  if (sub.includes("Frontend")) return Layout;
  if (sub.includes("Backend")) return Code2;
  if (sub.includes("DevOps") || sub.includes("QA")) return Cpu;
  if (sub.includes("UI/UX")) return Target;
  if (sub.includes("Graphic")) return PenTool;
  if (sub.includes("Video")) return MonitorPlay;
  if (sub.includes("Marketing")) return Megaphone;
  if (sub.includes("Product") || sub.includes("Analysis")) return PieChart;
  if (sub.includes("Support") || sub.includes("Documentation")) return ShieldCheck;
  return BriefcaseBusiness;
};

const toBnNum = (numStr) => {
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(numStr).replace(/[0-9]/g, w => bnDigits[w]);
};

export default function ServicesAppView() {
  const { data: SERVICES_DATA, error: catalogError } = useServicesCatalog();
  const [lang, setLang] = useLang();
  const [theme, setTheme] = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const dept = params.get("department");
      if (dept) return dept;
    }
    return "All";
  });
  const [visibleCount, setVisibleCount] = useState(30);

  const CATEGORIES = useMemo(() => {
    if (!SERVICES_DATA) return ["All"];
    return ["All", ...Array.from(new Set(SERVICES_DATA.map(s => s.subDepartment)))];
  }, [SERVICES_DATA]);

  const catTranslation = {
    "All": "সব",
    "Frontend Department": "ফ্রন্টএন্ড ডিপার্টমেন্ট",
    "Backend Department": "ব্যাকএন্ড ডিপার্টমেন্ট",
    "DevOps & QA Department": "ডেভওপস ও কিউএ",
    "UI/UX Design": "ইউআই/ইউএক্স ডিজাইন",
    "Graphic Design": "গ্রাফিক ডিজাইন",
    "Video Editing": "ভিডিও এডিটিং",
    "Digital Marketing": "ডিজিটাল মার্কেটিং",
    "Product Analysis & Management": "প্রোডাক্ট ম্যানেজমেন্ট",
    "Customer Support & Technical Documentation": "কাস্টমার সাপোর্ট ও ডকুমেন্টস"
  };

  const getCatName = (cat) => {
    if (lang === "bn") return catTranslation[cat] || cat;
    return cat;
  };

  const copy = {
    en: {
      badge: "EquiSaaS BD Agency",
      title: "World-Class Tech Services",
      desc: "Explore our massive catalog of specialized IT, engineering, design, and marketing services tailored for scale and performance.",
      negotiable: "* All prices are baseline standards and highly negotiable based on project scale.",
      bdPrice: "Bangladesh Standard",
      globalPrice: "Global Standard",
      hireBtn: "Discuss via WhatsApp",
      searchPlaceholder: "Search any service (e.g., SEO, React, Data Entry)...",
      noResults: "No services found matching your search.",
      clearSearch: "Clear Search",
      loadMore: "Load More Services",
      stats: {
        services: "Total Services",
        deps: "Departments",
        tiers: "Pricing Tiers"
      }
    },
    bn: {
      badge: "EquiSaaS BD এজেন্সি",
      title: "ওয়ার্ল্ড-ক্লাস টেক সার্ভিস",
      desc: "স্কেল এবং পারফরম্যান্সের জন্য তৈরি আমাদের বিশেষায়িত আইটি, ইঞ্জিনিয়ারিং, ডিজাইন এবং মার্কেটিং সার্ভিসের বিশাল ক্যাটালগ অন্বেষণ করুন।",
      negotiable: "* উল্লেখিত সকল প্রাইসিং বেসলাইন স্ট্যান্ডার্ড এবং প্রজেক্টের আকার অনুযায়ী আলোচনা সাপেক্ষে পরিবর্তনশীল।",
      bdPrice: "বাংলাদেশি স্ট্যান্ডার্ড",
      globalPrice: "গ্লোবাল স্ট্যান্ডার্ড",
      hireBtn: "হোয়াটসঅ্যাপে কথা বলুন",
      searchPlaceholder: "যেকোনো সার্ভিস খুঁজুন (যেমন: SEO, React, Data Entry)...",
      noResults: "আপনার সার্চ অনুযায়ী কোনো সার্ভিস পাওয়া যায়নি।",
      clearSearch: "সার্চ ক্লিয়ার করুন",
      loadMore: "আরও সার্ভিস দেখুন",
      stats: {
        services: "মোট সার্ভিসেস",
        deps: "ডিপার্টমেন্টস",
        tiers: "প্রাইসিং টিয়ার"
      }
    }
  }[lang];

  // Dynamically calculate the exact service counts
  const departmentCounts = useMemo(() => {
    if (!SERVICES_DATA) return { "All": 0 };
    const counts = { "All": SERVICES_DATA.length };
    SERVICES_DATA.forEach(s => {
      counts[s.subDepartment] = (counts[s.subDepartment] || 0) + 1;
    });
    return counts;
  }, [SERVICES_DATA]);

  // Filter services based on search query and category
  const filteredServices = useMemo(() => {
    if (!SERVICES_DATA) return [];
    let filtered = SERVICES_DATA;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(s => s.subDepartment === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((service) => {
        return (
          service.title.toLowerCase().includes(query) ||
          service.subDepartment.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query) ||
          service.tags.some(tag => tag.toLowerCase().includes(query)) ||
          (service.features && service.features.some(f => f.toLowerCase().includes(query)))
        );
      });
    }

    return filtered;
  }, [searchQuery, selectedCategory, SERVICES_DATA]);

  const visibleServices = filteredServices.slice(0, visibleCount);

  // Reset pagination when filter changes
  useEffect(() => {
    setVisibleCount(30);
  }, [searchQuery, selectedCategory]);

  // Show a quick loading skeleton while the 750+ service catalog is being
  // streamed in. The page shell, header, footer, and search bar paint first.
  if (!SERVICES_DATA) {
    return (
      <MotionConfig reducedMotion="user">
        <div className="min-h-screen bg-background text-foreground tracking-tight flex flex-col">
          <AmbientBackdrop />
          <Header lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />
          <main className="relative pt-32 pb-24 overflow-hidden flex-1">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="max-w-4xl mx-auto text-center space-y-6 mb-16">
                <div className="inline-flex items-center gap-3 rounded-full border border-primary/30 bg-primary/10 px-5 py-2 text-xs font-bold uppercase tracking-widest text-primary">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {lang === "bn" ? "ক্যাটালগ লোড হচ্ছে" : "Loading catalog"}
                </div>
                <div className="h-12 w-3/4 mx-auto rounded-2xl bg-muted/40 animate-pulse" />
                <div className="h-6 w-1/2 mx-auto rounded-xl bg-muted/30 animate-pulse" />
              </div>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="rounded-[2rem] border border-border/50 bg-card/60 p-6 sm:p-8 shadow-xl h-72 animate-pulse" />
                ))}
              </div>
              {catalogError && (
                <p className="text-center mt-12 text-sm text-destructive font-bold">
                  {lang === "bn"
                    ? "ক্যাটালগ লোড করা যায়নি। পেজটি রিফ্রেশ করুন।"
                    : "Could not load the catalog. Please refresh the page."}
                </p>
              )}
            </div>
          </main>
          <Footer lang={lang} />
          <MobileBottomNav lang={lang} />
        </div>
      </MotionConfig>
    );
  }

  const generateWhatsAppUrl = (serviceTitle) => {
    const message = encodeURIComponent(`Hello EquiSaaS BD, I am interested in your service: *${serviceTitle}*. Can we discuss the details and pricing?`);
    return `${LINKS.whatsappLink}?text=${message}`;
  };

  const formatPrice = (price) => {
    const formatted = new Intl.NumberFormat('en-IN').format(price);
    return lang === 'bn' ? toBnNum(formatted) : formatted;
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-background text-foreground tracking-tight flex flex-col">
        <AmbientBackdrop />
        <Header lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />

        <main className="relative pt-32 pb-24 overflow-hidden flex-1">
          {/* Decorative Top Blur Mesh */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-primary/10 blur-[120px] rounded-[100%] pointer-events-none" />

          {/* Hero Section */}
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-6 mb-16 relative">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Badge variant="soft" className="rounded-full border border-primary/30 bg-primary/10 px-5 py-2 text-xs font-bold uppercase tracking-widest text-primary shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.3)]">
                  <Sparkles className="mr-2 h-4 w-4 inline" />
                  {copy.badge}
                </Badge>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]">
                {copy.title}
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg sm:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-medium">
                {copy.desc}
              </motion.p>

              {/* Stats Bar */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ delay: 0.3 }}
                className="flex flex-wrap justify-center items-center gap-6 sm:gap-12 mt-10 p-6 rounded-3xl bg-card/40 backdrop-blur-md border border-border/50 shadow-xl"
              >
                <div className="flex flex-col items-center">
                  <span className="text-4xl sm:text-5xl font-black text-primary drop-shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.5)]">{lang === "bn" ? toBnNum(departmentCounts["All"]) : departmentCounts["All"]}</span>
                  <span className="text-[10px] sm:text-xs mt-2 uppercase tracking-widest text-muted-foreground font-bold">{copy.stats.services}</span>
                </div>
                <div className="w-px h-16 bg-border/50 hidden sm:block" />
                <div className="flex flex-col items-center">
                  <span className="text-4xl sm:text-5xl font-black text-foreground">{lang === "bn" ? "৯" : "9"}</span>
                  <span className="text-[10px] sm:text-xs mt-2 uppercase tracking-widest text-muted-foreground font-bold">{copy.stats.deps}</span>
                </div>
                <div className="w-px h-16 bg-border/50 hidden sm:block" />
                <div className="flex flex-col items-center">
                  <span className="text-4xl sm:text-5xl font-black text-foreground">{lang === "bn" ? "৩" : "3"}</span>
                  <span className="text-[10px] sm:text-xs mt-2 uppercase tracking-widest text-muted-foreground font-bold">{copy.stats.tiers}</span>
                </div>
              </motion.div>
            </div>

            {/* Premium Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.4 }}
              className="max-w-3xl mx-auto mb-12 relative z-20"
            >
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Search size={26} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={copy.searchPlaceholder}
                  className="w-full pl-16 pr-14 py-5 bg-card/80 backdrop-blur-2xl border-2 border-border/50 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.1)] group-focus-within:shadow-[0_8px_30px_rgba(var(--color-primary-rgb),0.2)] focus:outline-none focus:border-primary text-lg font-medium transition-all"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={24} />
                  </button>
                )}
              </div>
            </motion.div>

            {/* Wrap Filter Strip (Replaces horizontal scroll to fix overflow) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.5 }}
              className="max-w-6xl mx-auto mb-16"
            >
              <div className="flex flex-wrap justify-center items-center gap-3 px-2">
                {CATEGORIES.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] sm:text-sm font-bold transition-all duration-300 border backdrop-blur-md ${
                      selectedCategory === cat 
                        ? "bg-primary text-primary-foreground border-primary shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.4)] scale-[1.02]" 
                        : "bg-card/60 text-muted-foreground border-border/60 hover:bg-card hover:text-foreground hover:border-primary/50 hover:scale-[1.02]"
                    }`}
                  >
                    {getCatName(cat)}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      selectedCategory === cat 
                        ? "bg-primary-foreground/20 text-primary-foreground" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {lang === "bn" ? toBnNum(departmentCounts[cat] || 0) : departmentCounts[cat] || 0}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 min-h-[400px]">
              <AnimatePresence mode="popLayout">
                {visibleServices.length > 0 ? (
                  visibleServices.map((service, idx) => {
                    const Icon = getIconForSub(service.subDepartment);
                    return (
                      <motion.div
                        layout
                        key={service.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="group relative flex flex-col rounded-[2rem] border border-border/50 bg-card/60 p-6 sm:p-8 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] overflow-hidden"
                      >
                        {/* Subtle Premium Gradient Top Border */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary/40 via-primary to-accent/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Decorative Background Icon Glow */}
                        <div className="absolute -top-10 -right-10 text-primary/5 transition-transform duration-500 group-hover:scale-150 group-hover:rotate-12 pointer-events-none">
                          <Icon size={180} strokeWidth={1} />
                        </div>

                        <div className="mb-6 flex items-start gap-5 relative z-10">
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-primary/10 to-primary/5 text-primary transition-transform duration-300 group-hover:scale-110 shadow-inner">
                            <Icon size={32} strokeWidth={2} />
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary/80 block mb-1.5">{getCatName(service.subDepartment)}</span>
                            <h3 className="text-xl sm:text-2xl font-bold leading-[1.15] text-foreground">{lang === "bn" && service.titleBn ? service.titleBn : service.title}</h3>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground leading-relaxed mb-4 flex-1 text-sm font-medium relative z-10">
                          {lang === "bn" && service.descriptionBn ? service.descriptionBn : service.description}
                        </p>
                        
                        {(lang === "bn" && service.featuresBn ? service.featuresBn : service.features)?.length > 0 && (
                          <div className="mb-6 relative z-10 space-y-2">
                            {(lang === "bn" && service.featuresBn ? service.featuresBn : service.features).map((feature, i) => (
                              <div key={i} className="flex items-start gap-2 text-sm text-foreground/80 font-medium">
                                <CheckCircle2 size={16} className="text-[#25D366] mt-0.5 shrink-0" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2 mb-8 relative z-10">
                          {service.tags.map((tag, i) => (
                            <Badge key={i} variant="secondary" className="bg-primary/5 text-primary/90 border-primary/20 rounded-lg px-2.5 py-1 text-xs font-semibold hover:bg-primary/10 transition-colors">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="mt-auto space-y-5 relative z-10">
                          <div className="space-y-3 rounded-2xl bg-muted/30 p-5 border border-border/50 backdrop-blur-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <MapPinned size={14}/> {copy.bdPrice}
                              </span>
                              <span className="text-lg font-black text-foreground">৳{formatPrice(service.priceBDT)}+</span>
                            </div>
                            <div className="h-px w-full bg-border/50" />
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                <Globe size={14}/> {copy.globalPrice}
                              </span>
                              <span className="text-lg font-black text-primary">${formatPrice(service.priceUSD)}+</span>
                            </div>
                          </div>

                          <Button asChild className="relative w-full rounded-xl h-14 bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold text-base shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:shadow-[0_0_30px_rgba(37,211,102,0.5)] transition-all duration-300 active:scale-95 group overflow-hidden">
                            <a href={generateWhatsAppUrl(service.title)} target="_blank" rel="noreferrer">
                              {/* Shiny sweep animation overlay */}
                              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[sweep_1.5s_ease-in-out_infinite]" />
                              <MessageCircle className="mr-2 h-6 w-6" />
                              {copy.hireBtn}
                            </a>
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="col-span-full flex flex-col items-center justify-center py-24 text-center rounded-[3rem] border-2 border-dashed border-border/60 bg-card/30"
                  >
                    <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
                      <Search size={40} className="text-muted-foreground/50" />
                    </div>
                    <h3 className="text-2xl font-black text-foreground mb-3">{copy.noResults}</h3>
                    <p className="text-muted-foreground mb-8 max-w-md">
                      {lang === "bn" 
                        ? "অন্য কোনো কিওয়ার্ড দিয়ে সার্চ করার চেষ্টা করুন অথবা ডিপার্টমেন্ট ফিল্টারটি পরিবর্তন করুন।"
                        : "Try searching for a different keyword or removing the department filter."}
                    </p>
                    <Button size="lg" className="rounded-full px-8" onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}>{copy.clearSearch}</Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Load More Button */}
            {filteredServices.length > visibleCount && (
              <div className="mt-16 flex justify-center">
                <Button 
                  onClick={() => setVisibleCount(prev => prev + 30)} 
                  variant="outline" 
                  size="lg"
                  className="rounded-full h-14 px-10 text-base font-bold border-2 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-lg transition-all duration-300 hover:scale-105"
                >
                  {copy.loadMore} ({lang === "bn" ? toBnNum(filteredServices.length - visibleCount) : filteredServices.length - visibleCount})
                </Button>
              </div>
            )}

            {/* CTA & Notice */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              className="mt-20 text-center"
            >
              <div className="inline-block rounded-2xl bg-card/50 backdrop-blur-md border border-border/50 p-6 max-w-2xl mx-auto shadow-lg">
                <p className="text-sm font-bold text-muted-foreground leading-relaxed">
                  {copy.negotiable}
                </p>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer lang={lang} />
        <MobileBottomNav lang={lang} />
        <Chatbot lang={lang} theme={theme} />
        <style dangerouslySetInnerHTML={{__html:`
          @keyframes sweep {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}} />
      </div>
    </MotionConfig>
  );
}
