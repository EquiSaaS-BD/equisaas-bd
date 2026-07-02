import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Search, BookOpen, Layers, Users, Megaphone, Sparkles, Filter } from "lucide-react";
import { RESOURCE_ITEMS_V2, RESOURCE_SUMMARY_V2, TRACK_META } from "../data/resources-v2";
import { useLms } from "../lms-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DEPT_VISUALS = {
  engineering: { icon: Layers, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  design: { icon: BookOpen, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
  product: { icon: Users, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
  marketing: { icon: Megaphone, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" }
};

const ResourceCard = ({ resource, lang }) => {
  const trackMeta = TRACK_META[resource.dept]?.tracks?.[resource.track];
  const topicLabel = lang === "bn" ? resource.topicBn : resource.topicEn;
  const trackLabel = lang === "bn" ? trackMeta?.bn : trackMeta?.en;

  return (
    <motion.div variants={{ initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } }} className="group h-full">
      <a href={resource.url} target="_blank" rel="noopener noreferrer" className="block h-full">
        <Card className="h-full border-none bg-card hover:bg-accent/5 transition-all duration-300 shadow-sm border border-transparent hover:border-primary/20 group cursor-pointer flex flex-col">
          <CardHeader className="p-5 pb-3 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <CardTitle className="text-lg font-bold tracking-tight group-hover:text-primary transition-colors">{resource.title}</CardTitle>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0 mt-1 transition-colors" />
            </div>

            {resource.author && (
              <CardDescription className="text-xs font-semibold uppercase tracking-wider text-muted-foreground -mt-1">{resource.author}</CardDescription>
            )}

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-[10px] font-bold px-2 py-0 rounded-lg bg-muted text-muted-foreground border-muted">
                {trackLabel}
              </Badge>
              <Badge variant="outline" className="text-[10px] font-bold px-2 py-0 rounded-lg bg-primary/10 text-primary border-primary/20">
                {lang === "bn" ? `মাস ${resource.month}` : `Month ${resource.month}`}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-5 pt-0 flex-1 flex flex-col gap-4">
            <p className="text-xs leading-relaxed text-foreground/80 font-medium line-clamp-2">{topicLabel}</p>
            {resource.description && <p className="text-xs leading-relaxed text-muted-foreground font-medium line-clamp-3">{resource.description}</p>}

            <div className="flex flex-wrap gap-2 mt-auto">
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] font-bold px-2 py-0 rounded-lg",
                  resource.lang === "bn" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-primary/10 text-primary border-primary/20"
                )}
              >
                {resource.lang === "bn" ? "বাংলা" : "English"}
              </Badge>
              <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0 rounded-lg bg-muted text-muted-foreground">
                {resource.type}
              </Badge>
              {resource.free && (
                <Badge className="text-[10px] font-bold px-2 py-0 rounded-lg bg-brand-green text-slate-900 border-none">Free</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </a>
    </motion.div>
  );
};

const ResourcesView = () => {
  const { lang } = useLms();
  const [activeDept, setActiveDept] = useState("all");
  const [activeTrack, setActiveTrack] = useState("all");
  const [activeLang, setActiveLang] = useState("all");
  const [search, setSearch] = useState("");

  const deptKeys = ["all", ...Object.keys(TRACK_META)];

  const trackOptions = useMemo(() => {
    if (activeDept === "all") {
      return [{ key: "all", en: "All Tracks", bn: "সব ট্র্যাক" }];
    }

    const tracks = TRACK_META[activeDept]?.tracks || {};
    return [
      { key: "all", en: "All Tracks", bn: "সব ট্র্যাক" },
      ...Object.entries(tracks).map(([key, value]) => ({ key, ...value }))
    ];
  }, [activeDept]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return RESOURCE_ITEMS_V2.filter(resource => {
      const matchDept = activeDept === "all" || resource.dept === activeDept;
      const matchTrack = activeTrack === "all" || resource.track === activeTrack;
      const matchLang = activeLang === "all" || resource.lang === activeLang;
      const matchSearch =
        !query ||
        resource.title?.toLowerCase().includes(query) ||
        resource.author?.toLowerCase().includes(query) ||
        resource.description?.toLowerCase().includes(query) ||
        resource.topicEn?.toLowerCase().includes(query) ||
        resource.topicBn?.toLowerCase().includes(query);

      return matchDept && matchTrack && matchLang && matchSearch;
    });
  }, [activeDept, activeTrack, activeLang, search]);

  const topicCount = useMemo(() => {
    return new Set(filtered.map(item => item.topicId)).size;
  }, [filtered]);

  const containerVariants = {
    animate: { transition: { staggerChildren: 0.03 } }
  };

  return (
    <section className="space-y-10 animate-in fade-in duration-700">
      <div className="relative overflow-hidden p-8 rounded-3xl bg-muted/30 border border-muted-foreground/5 shadow-inner">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
        <div className="relative space-y-3">
          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1 rounded-full border-none">
            <Sparkles className="w-3 h-3 mr-2" />
            {lang === "bn" ? "টপিকভিত্তিক ফ্রি রিসোর্স" : "Topic-based Free Resources"}
          </Badge>

          <h2 className="text-3xl md:text-5xl font-black tracking-tight mt-4">{lang === "bn" ? "রিসোর্স লাইব্রেরি" : "Resource Library"}</h2>
          <p className="text-muted-foreground text-lg max-w-3xl font-medium leading-relaxed">
            {lang === "bn"
              ? "প্রতিটি ডিপার্টমেন্ট, সাব-ডিপার্টমেন্ট এবং টপিকের জন্য কিউরেটেড রিসোর্স। বাংলা ও ইংরেজি দুই ভাষাতেই সাজানো।"
              : "Curated resources for every department, sub-department, and roadmap topic in both Bangla and English."}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <Card className="bg-background border-none shadow-sm">
              <CardContent className="p-3">
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{lang === "bn" ? "মোট টপিক" : "Total Topics"}</div>
                <div className="text-xl font-black">{RESOURCE_SUMMARY_V2.totalTopics}</div>
              </CardContent>
            </Card>
            <Card className="bg-background border-none shadow-sm">
              <CardContent className="p-3">
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{lang === "bn" ? "কভারড টপিক" : "Covered Topics"}</div>
                <div className="text-xl font-black">{RESOURCE_SUMMARY_V2.coveredTopics}</div>
              </CardContent>
            </Card>
            <Card className="bg-background border-none shadow-sm">
              <CardContent className="p-3">
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{lang === "bn" ? "ফিল্টার ফলাফল" : "Filtered Topics"}</div>
                <div className="text-xl font-black">{topicCount}</div>
              </CardContent>
            </Card>
            <Card className="bg-background border-none shadow-sm">
              <CardContent className="p-3">
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{lang === "bn" ? "রিসোর্স কার্ড" : "Resource Cards"}</div>
                <div className="text-xl font-black">{filtered.length}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="relative max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
          <Input
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder={lang === "bn" ? "টপিক, রিসোর্স বা লেখক খুঁজুন…" : "Search by topic, resource, or author…"}
            className="pl-12 h-12 bg-background border-muted shadow-sm focus-visible:ring-primary/20 rounded-xl font-medium"
          />
        </div>

        <Card className="border-none bg-muted/20 shadow-none">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
              <Filter className="w-3.5 h-3.5" />
              {lang === "bn" ? "ফিল্টার" : "Filters"}
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                {deptKeys.map(deptKey => {
                  if (deptKey === "all") {
                    return (
                      <Button
                        key="all"
                        variant={activeDept === "all" ? "secondary" : "ghost"}
                        onClick={() => {
                          setActiveDept("all");
                          setActiveTrack("all");
                        }}
                        className={cn(
                          "rounded-xl font-bold h-9 px-4 transition-all",
                          activeDept === "all" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground"
                        )}
                      >
                        {lang === "bn" ? "সব ডিপার্টমেন্ট" : "All Departments"}
                      </Button>
                    );
                  }

                  const meta = TRACK_META[deptKey];
                  const iconData = DEPT_VISUALS[deptKey];
                  const Icon = iconData.icon;

                  return (
                    <Button
                      key={deptKey}
                      variant={activeDept === deptKey ? "secondary" : "ghost"}
                      onClick={() => {
                        setActiveDept(deptKey);
                        setActiveTrack("all");
                      }}
                      className={cn(
                        "rounded-xl font-bold h-9 px-4 transition-all gap-2",
                        activeDept === deptKey ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {lang === "bn" ? meta.bn : meta.en}
                    </Button>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-2">
                {trackOptions.map(track => (
                  <Button
                    key={track.key}
                    variant={activeTrack === track.key ? "secondary" : "outline"}
                    onClick={() => setActiveTrack(track.key)}
                    className={cn(
                      "rounded-xl font-bold h-9 px-4 transition-all",
                      activeTrack === track.key ? "bg-primary/20 text-primary border-primary/20" : "text-muted-foreground"
                    )}
                  >
                    {lang === "bn" ? track.bn : track.en}
                  </Button>
                ))}
              </div>

              <div className="flex gap-2 sm:ml-auto">
                {["all", "en", "bn"].map(language => (
                  <Button
                    key={language}
                    variant={activeLang === language ? "secondary" : "outline"}
                    onClick={() => setActiveLang(language)}
                    className={cn(
                      "rounded-xl font-bold h-9 px-4 transition-all",
                      activeLang === language ? "bg-primary/20 text-primary border-primary/20" : "text-muted-foreground"
                    )}
                  >
                    {language === "all" ? (lang === "bn" ? "সব ভাষা" : "All Languages") : language === "bn" ? "বাংলা" : "English"}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-sm text-slate-500 font-medium">{filtered.length} {lang === "bn" ? "টি রিসোর্স পাওয়া গেছে" : "resources found"}</div>

      <AnimatePresence mode="wait">
        <motion.div key={`${activeDept}-${activeTrack}-${activeLang}-${search}`} variants={containerVariants} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length ? (
            filtered.map(resource => <ResourceCard key={`${resource.topicId}-${resource.url}`} resource={resource} lang={lang} />)
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full text-center py-16 text-slate-500 text-sm">
              {lang === "bn" ? "কোনো রিসোর্স পাওয়া যায়নি। ফিল্টার পরিবর্তন করে আবার দেখুন।" : "No resources found. Try changing filters."}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default ResourcesView;
