import React, { useEffect, useMemo } from "react";
import { Activity, Database, Layout, Layers, RefreshCw, Settings, Shield, Terminal, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLms } from "../lms-context";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AdminStats from "./admin/AdminStats";
import AdminOperationsOverview from "./admin/AdminOperationsOverview";
import AuditMonitor from "./admin/AuditMonitor";
import CurriculumWizard from "./admin/CurriculumWizard";
import GovernanceConsole from "./admin/GovernanceConsole";

const MEMBER_AUDIT_ACTIONS = new Set(["assignment.attestation", "learning.path-open", "session.login"]);

const AdminView = () => {
  const {
    addCourse,
    addLesson,
    adminCourseId,
    adminLessons,
    adminTab,
    assignmentSubmissions,
    auditEntries,
    contributions,
    courses,
    formatDateTime,
    getCourseTitle,
    getLessonTitle,
    hasManagementAccess,
    isAdmin,
    lang,
    moveLesson,
    reviewQueueItems,
    roadmapItems,
    setAdminCourseId,
    setAdminTab,
    text,
    toggleCoursePublish,
    trustSignals,
  } = useLms();

  useEffect(() => {
    if (!hasManagementAccess) return;
    if (!isAdmin && adminTab !== "governance") {
      setAdminTab("governance");
    }
  }, [adminTab, hasManagementAccess, isAdmin, setAdminTab]);

  const stats = useMemo(() => {
    const totalLessons = courses.reduce((acc, course) => acc + (Number(course.lessons) || 0), 0);
    const avgTrust = trustSignals.length
      ? Math.round(trustSignals.reduce((sum, item) => sum + Number(item.score || 0), 0) / trustSignals.length)
      : 0;
    return {
      totalCourses: courses.length,
      totalLessons,
      totalContributions: contributions.length,
      avgTrustScore: `${avgTrust}%`,
    };
  }, [contributions.length, courses, trustSignals]);

  const adminAuditEntries = useMemo(
    () => auditEntries.filter((entry) => entry?.action && !MEMBER_AUDIT_ACTIONS.has(entry.action)),
    [auditEntries],
  );

  if (!hasManagementAccess) {
    return (
      <div className="flex flex-col items-center justify-center py-40 animate-in fade-in duration-1000">
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-rose-500/20 bg-rose-500/10">
          <Shield className="h-12 w-12 text-rose-500" />
        </div>
        <h2 className="mb-2 text-2xl font-black uppercase tracking-tight text-foreground">
          {lang === "bn" ? "অ্যাক্সেস সীমাবদ্ধ" : "Access Restricted"}
        </h2>
        <p className="max-w-sm text-center text-muted-foreground font-medium">
          {lang === "bn"
            ? "এই সেকশনটি শুধুমাত্র অ্যাডমিন, কোর ম্যানেজমেন্ট, ডিপার্টমেন্ট ম্যানেজার এবং স্কোয়াড লিডদের জন্য।"
            : "This section is reserved for admins, core management, department managers, and squad leads."}
        </p>
      </div>
    );
  }

  const queueCount = reviewQueueItems.length;
  const topBadge = isAdmin ? (lang === "bn" ? "গ্লোবাল কন্ট্রোল" : "Global Control") : lang === "bn" ? "স্কোপড অপারেশন" : "Scoped Operations";

  return (
    <section className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-32">
      <div className="relative group">
        <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-primary/20 via-transparent to-primary/20 blur-xl opacity-50 transition duration-1000 group-hover:opacity-100" />
        <div className="relative flex flex-col gap-6 rounded-[2rem] border border-muted-foreground/10 bg-background/40 p-8 shadow-premium backdrop-blur-2xl md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
              <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-lg animate-pulse" />
              <Settings className="relative z-10 h-8 w-8 text-primary" />
              <Zap className="absolute -right-1 -top-1 h-5 w-5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <div className="mb-1 flex items-center gap-3">
                <Badge variant="outline" className="border-primary/20 bg-primary/5 px-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                  {topBadge}
                </Badge>
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {lang === "bn" ? "লাইভ" : "Live"}
                </div>
              </div>
              <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">
                {lang === "bn" ? "কমান্ড সেন্টার" : "Command Center"}
              </h2>
              <p className="mt-2 text-sm font-medium uppercase tracking-wider text-muted-foreground opacity-80">
                {lang === "bn" ? "গভর্ন্যান্স, রিপোর্টিং ও অপারেশন" : "Governance, reporting, and operations"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="group h-12 rounded-2xl border-muted-foreground/10 px-6 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-muted/50" onClick={() => setAdminTab("governance")}>
              <RefreshCw className="mr-2 h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-180" />
              {lang === "bn" ? "গভর্ন্যান্স" : "Governance"}
            </Button>
            {isAdmin ? (
              <Button className="h-12 rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95" onClick={() => setAdminTab("roadmap")}>
                <Database className="mr-2 h-3.5 w-3.5" />
                {lang === "bn" ? "সিস্টেম লগ" : "System Log"}
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {isAdmin ? <AdminStats stats={stats} lang={lang} /> : null}

      <Tabs value={adminTab} onValueChange={setAdminTab} className="w-full space-y-8">
        <div className="flex flex-col gap-6 border-b border-muted-foreground/5 pb-2 md:flex-row md:items-center md:justify-between">
          <TabsList className="h-auto rounded-2xl border border-muted-foreground/5 bg-muted/30 p-1.5 backdrop-blur-sm">
            <TabsTrigger value="governance" className="min-w-[140px] rounded-xl px-6 py-2.5 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-premium transition-all">
              <Shield className="mr-2 h-3.5 w-3.5" />
              {lang === "bn" ? "গভর্ন্যান্স" : "Governance"}
            </TabsTrigger>
            {isAdmin ? (
              <TabsTrigger value="course" className="min-w-[140px] rounded-xl px-6 py-2.5 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-premium transition-all">
                <Layout className="mr-2 h-3.5 w-3.5" />
                {lang === "bn" ? "কারিকুলাম" : "Curriculum"}
              </TabsTrigger>
            ) : null}
            {isAdmin ? (
              <TabsTrigger value="lesson" className="min-w-[140px] rounded-xl px-6 py-2.5 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-premium transition-all">
                <Layers className="mr-2 h-3.5 w-3.5" />
                {lang === "bn" ? "অপারেশন" : "Operations"}
              </TabsTrigger>
            ) : null}
            {isAdmin ? (
              <TabsTrigger value="roadmap" className="min-w-[140px] rounded-xl px-6 py-2.5 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-premium transition-all">
                <Terminal className="mr-2 h-3.5 w-3.5" />
                {lang === "bn" ? "অডিট" : "Audit"}
              </TabsTrigger>
            ) : null}
          </TabsList>

          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
            <span className="flex items-center gap-1.5"><RefreshCw className="h-3 w-3" /> {lang === "bn" ? "লাইভ সিঙ্ক" : "Live Sync"}</span>
            <span className="flex items-center gap-1.5"><Activity className="h-3 w-3" /> {lang === "bn" ? `কিউ ${queueCount}` : `Queue ${queueCount}`}</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <TabsContent value="governance" className="outline-none">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <GovernanceConsole active={adminTab === "governance"} formatDateTime={formatDateTime} />
            </motion.div>
          </TabsContent>

          {isAdmin ? (
            <TabsContent value="course" className="outline-none">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                <CurriculumWizard
                  courses={courses}
                  adminCourseId={adminCourseId}
                  setAdminCourseId={setAdminCourseId}
                  addCourse={addCourse}
                  addLesson={addLesson}
                  adminLessons={adminLessons}
                  moveLesson={moveLesson}
                  toggleCoursePublish={toggleCoursePublish}
                  getCourseTitle={getCourseTitle}
                  getLessonTitle={getLessonTitle}
                  text={text}
                  lang={lang}
                />
              </motion.div>
            </TabsContent>
          ) : null}

          {isAdmin ? (
            <TabsContent value="lesson" className="outline-none">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                <AdminOperationsOverview
                  assignmentSubmissions={assignmentSubmissions}
                  auditEntries={auditEntries}
                  contributions={contributions}
                  lang={lang}
                  reviewQueueItems={reviewQueueItems}
                  roadmapItems={roadmapItems}
                  trustSignals={trustSignals}
                />
              </motion.div>
            </TabsContent>
          ) : null}

          {isAdmin ? (
            <TabsContent value="roadmap" className="outline-none">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                <AuditMonitor entries={adminAuditEntries} lang={lang} formatDateTime={formatDateTime} />
              </motion.div>
            </TabsContent>
          ) : null}
        </AnimatePresence>
      </Tabs>
    </section>
  );
};

export default AdminView;
