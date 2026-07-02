import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { CONTENT, LINKS } from "@/data/cofounder";
import Section from "@/components/landing/Section";
import { fadeUp } from "@/components/landing/motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  User, ShieldCheck, Cpu, Target, Landmark, 
  TrendingUp, Users, Grid, Table, Search, Sparkles, Crown, Award
} from "lucide-react";
import { normalizeLocalizedTree } from "@/lib/localized-copy";

const LEADERSHIP_COPY = normalizeLocalizedTree({
  en: {
    founderHubLead:
      "leads the cooperative vision. The main domain introduces the leadership structure, while the founder's canonical profile hub, project directory, and labs live on the verified portfolio subdomain.",
    searchPlaceholder: "Search by name, role or department...",
    allTab: "All Members",
    gridView: "Grid View",
    tableView: "Table View",
    totalMembers: "Total Members",
    boardCount: "Governing Board",
    execCount: "C-Suite Executives",
    headCount: "Department Heads",
    noResults: "No team members found matching your search.",
    metaText: "Official Team Structure & Roster of EquiSaaS BD - Bangladesh's First Open Tech Cooperative. Verified roles and structure."
  },
  bn: {
    founderHubLead:
      "cooperative vision-টি নেতৃত্ব দিচ্ছেন। Main domain-এ leadership structure তুলে ধরা হয়েছে, আর ফাউন্ডারের canonical profile hub, project directory, ও labs verified portfolio subdomain-এ রাখা হয়েছে।",
    searchPlaceholder: "নাম, পদবী বা বিভাগ দিয়ে খুঁজুন...",
    allTab: "সকল সদস্য",
    gridView: "গ্রিড ভিউ",
    tableView: "টেবিল ভিউ",
    totalMembers: "মোট সদস্য",
    boardCount: "গভর্নিং বোর্ড",
    execCount: "এক্সিকিউটিভ লিডারশিপ",
    headCount: "বিভাগীয় প্রধান",
    noResults: "আপনার অনুসন্ধান অনুযায়ী কোনো সদস্য পাওয়া যায়নি।",
    metaText: "ইকুইসায়েস বিডি-এর অফিশিয়াল টিম স্ট্রাকচার ও রোস্টার। বাংলাদেশের প্রথম ওপেন টেক কো-অপারেটিভের সকল সদস্য ও তাদের পদবী।"
  },
});

const TiltBadgeCard = ({ children, className }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mX = e.clientX - rect.left;
    const mY = e.clientY - rect.top;
    
    mouseX.set(mX);
    mouseY.set(mY);
    x.set(mX / width - 0.5);
    y.set(mY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    mouseX.set(-1000); // move spotlight off-screen
    mouseY.set(-1000);
  };

  const background = useTransform(
    [mouseX, mouseY],
    ([cx, cy]) => `radial-gradient(400px circle at ${cx}px ${cy}px, rgba(255,255,255,0.06), transparent 40%)`
  );

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, perspective: 1000 }}
      className={className}
    >
      {/* We apply the spotlight to a child so it stays on top of the card's background */}
      <motion.div 
        className="absolute inset-0 z-10 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-screen"
        style={{ background }}
      />
      {children}
    </motion.div>
  );
};

export default function Leadership({ lang }) {
  const t = CONTENT[lang].leadership;
  const copy = LEADERSHIP_COPY[lang];

  // Component States
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  // Dynamic SEO JSON-LD injection
  useEffect(() => {
    const existingScript = document.getElementById("equisaas-leadership-schema");
    if (existingScript) existingScript.remove();

    const schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "EquiSaaS BD",
      "url": "https://equisaas-bd.com",
      "logo": "https://equisaas-bd.com/logo.png",
      "description": "Bangladesh's first open tech cooperative SaaS ecosystem.",
      "founder": {
        "@type": "Person",
        "name": "Kholipha Ahmmad Al-Amin",
        "jobTitle": "Founder & CEO"
      },
      "numberOfEmployees": t.roster.length,
      "employee": t.roster.map(m => ({
        "@type": "Person",
        "name": m.nameEn,
        "jobTitle": m.designationEn,
        "worksFor": {
          "@type": "Organization",
          "name": "EquiSaaS BD"
        }
      }))
    };

    const script = document.createElement("script");
    script.id = "equisaas-leadership-schema";
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById("equisaas-leadership-schema");
      if (scriptToRemove) scriptToRemove.remove();
    };
  }, [t.roster]);

  // Tab configurations
  const tabOptions = useMemo(() => [
    { id: "all", label: copy.allTab },
    { id: "Board of Directors", label: t.layers.board },
    { id: "Executive Leadership", label: t.layers.executive },
    { id: "Department Heads", label: t.layers.heads }
  ], [t.layers, copy.allTab]);

  // Get dynamic icons based on role or designation
  const getIcon = (role) => {
    const r = role.toLowerCase();
    if (r.includes("chairman") || r.includes("managing director")) return Crown;
    if (r.includes("ceo") || r.includes("chief executive")) return Crown;
    if (r.includes("coo") || r.includes("operations")) return Landmark;
    if (r.includes("cto") || r.includes("technology") || r.includes("frontend") || r.includes("backend") || r.includes("devops")) return Cpu;
    if (r.includes("cpo") || r.includes("product")) return Target;
    if (r.includes("hr")) return Users;
    if (r.includes("cfo") || r.includes("finance") || r.includes("financial")) return ShieldCheck;
    if (r.includes("growth") || r.includes("marketing") || r.includes("cgo") || r.includes("cmo") || r.includes("pr") || r.includes("communications")) return TrendingUp;
    return User;
  };

  // Get dynamic gradient colors based on department/layer
  const getGradient = (layer) => {
    if (layer === "Board of Directors") return "from-blue-500 via-indigo-500 to-violet-600";
    if (layer === "Executive Leadership") return "from-amber-500 via-orange-500 to-rose-600";
    return "from-emerald-400 via-teal-500 to-cyan-600";
  };

  // Roster filtering logic
  const filteredRoster = useMemo(() => {
    return t.roster.filter(m => {
      const matchesTab = activeTab === "all" || m.layerEn === activeTab;
      
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesTab;

      const matchesSearch = 
        m.name.toLowerCase().includes(q) ||
        m.designation.toLowerCase().includes(q) ||
        m.department.toLowerCase().includes(q) ||
        m.layer.toLowerCase().includes(q) ||
        m.nameEn.toLowerCase().includes(q) ||
        m.designationEn.toLowerCase().includes(q) ||
        m.departmentEn.toLowerCase().includes(q) ||
        m.layerEn.toLowerCase().includes(q);

      return matchesTab && matchesSearch;
    });
  }, [t.roster, activeTab, searchQuery]);

  // Statistics summaries
  const stats = useMemo(() => {
    const total = t.roster.length;
    const board = t.roster.filter(m => m.layerEn === "Board of Directors").length;
    const exec = t.roster.filter(m => m.layerEn === "Executive Leadership").length;
    const heads = t.roster.filter(m => m.layerEn === "Department Heads").length;
    return { total, board, exec, heads };
  }, [t.roster]);

  return (
    <Section id="leadership" className="py-12 md:py-16 lg:py-24 relative bg-muted/20 overflow-hidden">
      {/* Decorative ambient spots */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 space-y-16 relative z-10">
        
        {/* Header Block */}
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <motion.div variants={fadeUp} className="inline-flex">
            <Badge variant="soft" className="px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs uppercase tracking-widest font-black flex items-center gap-2">
              <Sparkles className="h-3 w-3 animate-pulse" />
              EquiSaaS BD Core Team
            </Badge>
          </motion.div>
          
          <motion.h2 variants={fadeUp} className="text-3xl md:text-6xl font-black tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-primary/80">
            {t.title}
          </motion.h2>
          
          <motion.p variants={fadeUp} className="mx-auto max-w-3xl text-base leading-8 text-muted-foreground font-medium">
            <a
              href={LINKS.founderPortfolio}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-primary hover:text-primary/80 transition-colors underline decoration-primary/30 underline-offset-4"
            >
              {lang === "bn" ? "খলিফা আহম্মেদ আল-আমিন" : "Kholipha Ahmmad Al-Amin"}
            </a>{" "}
            {copy.founderHubLead}
          </motion.p>
        </div>

        {/* Dynamic Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {[
            { label: copy.totalMembers, val: stats.total, color: "from-primary/20 to-indigo-500/10" },
            { label: copy.boardCount, val: stats.board, color: "from-blue-500/20 to-indigo-500/10" },
            { label: copy.execCount, val: stats.exec, color: "from-amber-500/20 to-orange-500/10" },
            { label: copy.headCount, val: stats.heads, color: "from-emerald-500/20 to-teal-500/10" }
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className={`glass-premium p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover-lift transition-all duration-300 bg-gradient-to-br ${item.color}`}
            >
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{item.label}</span>
              <span className="text-3xl font-black mt-2 text-foreground tracking-tight">{item.val}</span>
            </motion.div>
          ))}
        </div>

        {/* Dashboard Controls (Tabs + Search + View Toggle) */}
        <div className="glass-premium p-4 rounded-3xl border border-white/5 bg-white/5 dark:bg-black/20 backdrop-blur-xl space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between max-w-6xl mx-auto">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            {tabOptions.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-[1.03]"
                    : "text-muted-foreground hover:bg-white/5 dark:hover:bg-white/5 hover:text-foreground"
                }`}
              >
                {tab.id === "Board of Directors" && <Crown className="h-4 w-4" />}
                {tab.id === "Executive Leadership" && <Award className="h-4 w-4" />}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3 lg:w-auto w-full">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={copy.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl text-sm bg-black/10 dark:bg-white/5 border border-white/5 hover:border-white/10 focus:border-primary/50 focus:outline-none transition-all duration-300 text-foreground"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-black/10 dark:bg-white/5 p-1 rounded-2xl border border-white/5 self-stretch sm:self-auto">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label={copy.gridView}
                className={`px-3 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 text-xs font-black ${
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Grid className="h-4 w-4" />
                <span className="hidden sm:inline">{copy.gridView}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                aria-label={copy.tableView}
                className={`px-3 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 text-xs font-black ${
                  viewMode === "table"
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Table className="h-4 w-4" />
                <span className="hidden sm:inline">{copy.tableView}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Directory View Area */}
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {filteredRoster.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-20 glass-premium rounded-3xl border border-white/5"
              >
                <Users className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                <p className="text-muted-foreground font-semibold">{copy.noResults}</p>
              </motion.div>
            ) : viewMode === "grid" ? (
              // Supremely Stylish Grid Directory View
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredRoster.map((m, idx) => {
                  const Icon = getIcon(m.designationEn);
                  const gradient = getGradient(m.layerEn);
                  
                  // Initials generator
                  const initials = m.nameEn
                    .split(" ")
                    .filter(n => n.length > 0 && n !== "MD." && n !== "M" && n !== "J" && n !== "A." && n !== "K.")
                    .slice(0, 2)
                    .map(n => n[0])
                    .join("")
                    .toUpperCase() || "EQ";

                  return (
                    <motion.div
                      key={m.sl}
                      id={`leader-${m.sl}`}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.4) }}
                      itemScope
                      itemType="https://schema.org/Person"
                    >
                      <TiltBadgeCard className="group relative w-full h-full">
                        <Card className="glass-premium border border-white/5 overflow-hidden transition-all duration-500 bg-white/5 dark:bg-black/15 flex flex-col justify-between h-[230px] rounded-2xl shadow-xl">
                          {/* Decorative dynamic top bar */}
                          <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${gradient}`} />
                          
                          <CardHeader className="p-6 pb-2 space-y-4">
                            <div className="flex items-center justify-between">
                              {/* Initials Avatar with dynamic department gradient */}
                              <div className={`h-11 w-11 rounded-2xl bg-gradient-to-br ${gradient} p-[1px] shadow-lg shadow-black/10`}>
                                <div className="h-full w-full bg-black/60 backdrop-blur-md rounded-[15px] flex items-center justify-center">
                                  <span className={`text-xs font-black bg-clip-text text-transparent bg-gradient-to-br ${gradient}`}>
                                    {initials}
                                  </span>
                                </div>
                              </div>

                              {/* Department pill */}
                              <Badge variant="outline" className="px-2.5 py-0.5 rounded-full border-white/10 bg-white/5 text-muted-foreground text-[10px] uppercase font-bold tracking-wider max-w-[170px] truncate">
                                {m.department}
                              </Badge>
                            </div>

                            <div className="space-y-1">
                              <CardTitle className="text-lg font-black text-foreground group-hover:text-primary transition-colors flex items-center gap-2" itemProp="name">
                                {m.name}
                                {m.remarksEn.includes("Chairman") && <Crown className="h-4 w-4 text-amber-500 inline fill-amber-500/20" />}
                              </CardTitle>
                              <CardDescription className="text-muted-foreground text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                <Icon className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                                <span className="truncate" itemProp="jobTitle">{m.designation}</span>
                              </CardDescription>
                            </div>
                          </CardHeader>

                          {/* Card bottom bar */}
                          <div className="px-6 py-4 bg-black/15 dark:bg-black/35 border-t border-white/5 flex items-center justify-between text-[11px] font-semibold text-muted-foreground relative z-20">
                            <span className="flex items-center gap-1 shrink-0">
                              <User className="h-3 w-3 text-muted-foreground/60" />
                              {m.gender}
                            </span>
                            
                            {/* Remarks with star */}
                            <span className="flex items-center gap-1 max-w-[150px] truncate text-primary/95 font-bold">
                              <Sparkles className="h-3 w-3 text-primary/70 shrink-0" />
                              {m.remarks}
                            </span>
                          </div>
                        </Card>
                      </TiltBadgeCard>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              // Detailed Corporate Roster Table View (Responsive)
              <motion.div
                key="table"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="overflow-x-auto glass-premium rounded-3xl border border-white/5 shadow-2xl bg-white/5 dark:bg-black/15 backdrop-blur-xl"
              >
                <table className="min-w-full divide-y divide-white/5">
                  <thead>
                    <tr className="bg-black/25">
                      <th className="px-6 py-4 text-left text-xs font-black text-muted-foreground uppercase tracking-widest w-16">{t.headers?.sl || "SL"}</th>
                      <th className="px-6 py-4 text-left text-xs font-black text-muted-foreground uppercase tracking-widest">{t.headers?.layer || "Layer"}</th>
                      <th className="px-6 py-4 text-left text-xs font-black text-muted-foreground uppercase tracking-widest">{t.headers?.department || "Dept"}</th>
                      <th className="px-6 py-4 text-left text-xs font-black text-muted-foreground uppercase tracking-widest">{t.headers?.designation || "Role"}</th>
                      <th className="px-6 py-4 text-left text-xs font-black text-muted-foreground uppercase tracking-widest">{t.headers?.name || "Name"}</th>
                      <th className="px-6 py-4 text-left text-xs font-black text-muted-foreground uppercase tracking-widest w-24">{t.headers?.gender || "Gender"}</th>
                      <th className="px-6 py-4 text-left text-xs font-black text-muted-foreground uppercase tracking-widest">{t.headers?.remarks || "Remarks"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredRoster.map((m, idx) => {
                      const gradient = getGradient(m.layerEn);
                      return (
                        <tr
                          key={m.sl}
                          className="hover:bg-white/[0.03] transition-colors duration-200"
                          itemScope
                          itemType="https://schema.org/Person"
                        >
                          <td className="px-6 py-4 text-sm font-black text-muted-foreground">{m.sl}</td>
                          <td className="px-6 py-4 text-sm whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5">
                              <span className={`h-2 w-2 rounded-full bg-gradient-to-r ${gradient} animate-pulse`} />
                              <span className="font-bold text-foreground">{m.layer}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{m.department}</td>
                          <td className="px-6 py-4 text-sm font-bold text-foreground" itemProp="jobTitle">{m.designation}</td>
                          <td className="px-6 py-4 text-sm font-black text-primary" itemProp="name">{m.name}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{m.gender}</td>
                          <td className="px-6 py-4 text-sm font-bold text-foreground">
                            {m.remarksEn && m.remarksEn.includes("Chairman") ? (
                              <Badge variant="soft" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-xs font-black rounded-lg">
                                {m.remarks}
                              </Badge>
                            ) : m.remarksEn && (m.remarksEn.includes("Executive") || m.remarksEn.includes("Oversight")) ? (
                              <Badge variant="soft" className="bg-primary/10 text-primary border-primary/20 text-xs font-black rounded-lg">
                                {m.remarks}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">{m.remarks}</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </Section>
  );
}
