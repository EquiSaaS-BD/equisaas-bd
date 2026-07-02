import React, { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLms } from "../lms-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatDistrictLabel } from "@/data/bangladesh-districts.js";
import CooperativeMemberCard from "../components/ui/CooperativeMemberCard";
import CertificateGenerator from "../components/ui/CertificateGenerator";
import MemberTaskCenter from "../components/ui/MemberTaskCenter";
import { 
  GitPullRequest, 
  DollarSign, 
  Vote, 
  Map as MapIcon, 
  Users, 
  Languages,
  GraduationCap,
  Shield,
  ShieldCheck, 
  CheckSquare,
  Award,
  Rocket,
  ClipboardCheck, 
  Zap,
  Activity, 
  Download,
  Plus,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  UserCheck
} from "lucide-react";

const CoopHubView = () => {
  const {
    addContribution,
    addCredential,
    addMentorRequest,
    addPathway,
    addPayout,
    addProposal,
    addQualityGate,
    addRoadmapItem,
    addSquad,
    addTranslation,
    addTrustSignal,
    approveContribution,
    assignMentor,
    assignmentFilter,
    attestationDrafts,
    auditEntries,
    check,
    contributions,
    coopTab,
    coopTabs,
    e,
    enrollPathway,
    exportPayoutsCSV,
    exportTrustCSV,
    filteredSubmissions,
    formatDateTime,
    formatMonth,
    formatNumber,
    getSubmissionStatus,
    idx,
    isAdmin,
    item,
    lang,
    maxScore,
    mentorRequests,
    pathways,
    payoutSummary,
    payouts,
    peerReviewQueue,
    percent,
    prev,
    proposal,
    proposalVotes,
    proposals,
    qualityGates,
    requestSquadJoin,
    reviewQueueItems,
    reviewNotes,
    reviewSubmission,
    roadmapItems,
    roadmapVotes,
    reviewQueueMap,
    score,
    setAssignmentFilter,
    setAttestationDrafts,
    setCoopTab,
    setReviewNotes,
    setView,
    squads,
    submitPeerAttestation,
    status,
    tab,
    text,
    toggleGateItem,
    translations,
    trustSignals,
    trustSummary,
    updateTranslationStatus,
    user,
    userRole,
    visibleCredentials,
    voteProposal,
    voteRoadmap
  } = useLms();

  const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.2, ease: "easeOut" }
  };

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.05 } }
  };

  const queueStateMeta = {
    "pending-peer": {
      label: lang === "bn" ? "পিয়ার রিভিউ অপেক্ষায়" : "Waiting for peers",
      className: "bg-slate-500/10 text-slate-600"
    },
    "peer-reviewing": {
      label: lang === "bn" ? "পিয়ার রিভিউ চলছে" : "Peer review in progress",
      className: "bg-sky-500/10 text-sky-600"
    },
    "ready-for-admin": {
      label: lang === "bn" ? "অ্যাডমিন রিভিউ প্রস্তুত" : "Ready for admin",
      className: "bg-emerald-500/10 text-emerald-600"
    },
    "peer-rework": {
      label: lang === "bn" ? "পিয়ার রিওয়ার্ক দরকার" : "Peer rework suggested",
      className: "bg-amber-500/10 text-amber-600"
    },
    approved: {
      label: lang === "bn" ? "অনুমোদিত" : "Approved",
      className: "bg-emerald-500/10 text-emerald-600"
    },
    rejected: {
      label: lang === "bn" ? "রিভিশন দরকার" : "Needs revision",
      className: "bg-rose-500/10 text-rose-600"
    }
  };

  const visibleReviewQueue = isAdmin ? reviewQueueItems : peerReviewQueue;
  const formatDistrict = (districtId) => formatDistrictLabel(districtId, lang) || districtId || (lang === "bn" ? "জেলা নির্ধারিত নয়" : "District not set");
  const getQueueMeta = (state) => queueStateMeta[state] || queueStateMeta["pending-peer"];
  const canSeeOperationsTabs = isAdmin || ["squad-lead", "department-manager", "core-management", "admin", "super-admin"].includes(userRole || "");
  const visibleCoopTabs = useMemo(() => {
    const memberTabIds = new Set(["ledger", "payouts", "governance", "pathways", "squads", "mentorship", "credentials", "roadmap", "trust"]);
    return coopTabs.filter((tab) => canSeeOperationsTabs || memberTabIds.has(tab.id));
  }, [canSeeOperationsTabs, coopTabs]);

  useEffect(() => {
    if (visibleCoopTabs.some((tab) => tab.id === coopTab)) return;
    setCoopTab(visibleCoopTabs[0]?.id || "ledger");
  }, [coopTab, setCoopTab, visibleCoopTabs]);

  return (
    <section className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-muted/30 p-8 rounded-3xl border border-muted-foreground/5 shadow-inner">
        <div>
          <h2 className="text-3xl font-black tracking-tight">{text.coop.title}</h2>
          <p className="text-muted-foreground font-medium mt-1">{text.coop.subtitle}</p>
        </div>
        {isAdmin && (
          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-none px-4 py-1 rounded-full font-black uppercase tracking-widest text-[10px]">
            Admin Access
          </Badge>
        )}
      </div>

      <Card className="border-none bg-primary/5 shadow-none">
        <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
              {lang === "bn" ? "এই পেজের কাজ" : "What This Page Is For"}
            </div>
            <p className="mt-2 text-sm font-medium leading-relaxed text-foreground/80">
              {lang === "bn" ? "এখানে task, submission, review, contribution, trust, আর governance flow থাকে। Announcement আর squad handoff-এর জন্য Community Feed ব্যবহার করুন।" : "Use this page for tasks, submissions, review, contribution, trust, and governance flow. Use Community Feed for announcements and squad handoffs."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => setCoopTab("governance")} className="rounded-xl font-bold">
              {lang === "bn" ? "টাস্ক সেন্টার" : "Task Center"}
            </Button>
            <Button variant="ghost" onClick={() => setView?.("community")} className="rounded-xl font-bold">
              {lang === "bn" ? "কমিউনিটি ফিড" : "Community Feed"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={coopTab} onValueChange={setCoopTab} className="w-full space-y-8">
        <div className="bg-muted/30 p-1.5 rounded-2xl w-full overflow-x-auto no-scrollbar">
          <TabsList className="bg-transparent h-auto p-0 flex flex-wrap gap-1">
            {visibleCoopTabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="rounded-xl px-5 py-2.5 text-sm font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
              >
                {text.coop.tabs[tab.key]}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {!user && (
          <motion.div {...fadeIn} className="bg-primary/5 text-primary/80 p-4 rounded-2xl text-sm font-black text-center border border-primary/10">
            {text.labels.coopSignIn}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <TabsContent value="ledger" className="outline-none">
            <motion.div key="ledger" {...fadeIn} className="space-y-6">
              <Card className="border-none shadow-premium bg-background/50 backdrop-blur-sm overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitPullRequest className="w-5 h-5 text-primary" />
                    {text.labels.submitContribution}
                  </CardTitle>
                  <CardDescription>Log your contributions to the cooperative ecosystem.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={addContribution} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">{text.labels.title}</label>
                      <Input name="title" placeholder="Fix: Dashboard layout" required className="bg-muted/50 border-none focus-visible:ring-primary/20" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">{text.labels.type}</label>
                      <Select name="type" defaultValue="PR">
                        <SelectTrigger className="bg-muted/50 border-none focus-visible:ring-primary/20">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PR">PR / Code</SelectItem>
                          <SelectItem value="Design">UI/UX Design</SelectItem>
                          <SelectItem value="Content">Content / Translation</SelectItem>
                          <SelectItem value="Support">Support / Community</SelectItem>
                          <SelectItem value="Research">BA / Research</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">{text.labels.points}</label>
                      <Input name="points" type="number" placeholder="50" className="bg-muted/50 border-none focus-visible:ring-primary/20" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">{text.labels.hours}</label>
                      <Input name="hours" type="number" placeholder="4" className="bg-muted/50 border-none focus-visible:ring-primary/20" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">{text.labels.link}</label>
                      <Input name="link" placeholder="GitHub PR or Figma link" className="bg-muted/50 border-none focus-visible:ring-primary/20" />
                    </div>
                    {isAdmin && (
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Admin Status</label>
                        <Select name="status" defaultValue="pending">
                          <SelectTrigger className="bg-muted/50 border-none focus-visible:ring-primary/20 text-emerald-500 font-bold">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <Button type="submit" className="md:col-span-2 w-full h-12 text-sm font-black transition-all active:scale-[0.98]">
                      <Plus className="w-4 h-4 mr-2" />
                      {text.actions.submit}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="border-none shadow-premium bg-background/50 backdrop-blur-sm overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    {lang === "bn" ? "কন্ট্রিবিউশন লেজার" : "Contribution Ledger"}
                  </CardTitle>
                  <CardDescription>
                    {lang === "bn" ? "কে কী কাজ করলেন, কত পয়েন্ট পেলেন, আর কখন লগ হলো তার স্বচ্ছ রেকর্ড।" : "A transparent record of who shipped what, how many points were recorded, and when it was logged."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {contributions.length ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{lang === "bn" ? "কাজ" : "Work"}</TableHead>
                          <TableHead>{lang === "bn" ? "মেম্বার" : "Member"}</TableHead>
                          <TableHead>{lang === "bn" ? "প্রমাণ" : "Proof"}</TableHead>
                          <TableHead>{lang === "bn" ? "পয়েন্ট" : "Points"}</TableHead>
                          <TableHead>{lang === "bn" ? "স্ট্যাটাস" : "Status"}</TableHead>
                          <TableHead>{lang === "bn" ? "লগ সময়" : "Logged At"}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contributions.map((item) => (
                          <TableRow key={`ledger-${item.id}`}>
                            <TableCell className="min-w-[220px]">
                              <div className="font-bold text-sm text-foreground">{item.title}</div>
                              <div className="mt-1 text-xs text-muted-foreground">{item.type || (lang === "bn" ? "কন্ট্রিবিউশন" : "Contribution")}</div>
                            </TableCell>
                            <TableCell className="text-xs font-semibold text-foreground/80">
                              {item.displayName || item.actorName || item.createdBy || item.uid || (lang === "bn" ? "কো-অপ মেম্বার" : "Co-op Member")}
                            </TableCell>
                            <TableCell>
                              {item.link ? (
                                <Button variant="ghost" size="sm" asChild className="h-8 px-2 font-bold">
                                  <a href={item.link} target="_blank" rel="noreferrer">
                                    {lang === "bn" ? "দেখুন" : "Open"}
                                  </a>
                                </Button>
                              ) : (
                                <span className="text-xs text-muted-foreground">{lang === "bn" ? "লোকাল/ইন-অ্যাপ" : "Local / in-app"}</span>
                              )}
                            </TableCell>
                            <TableCell className="font-black text-primary">{formatNumber(item.points || 0)}</TableCell>
                            <TableCell>
                              <Badge
                                variant={item.status === "approved" ? "success" : "warning"}
                                className={cn(
                                  "border-none text-[10px] font-black uppercase tracking-widest",
                                  item.status === "approved" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                                )}
                              >
                                {item.status || "pending"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {item.createdAt ? formatDateTime(item.createdAt) : "--"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="px-6 py-14 text-center text-sm font-semibold text-muted-foreground">
                      {text.labels.empty}
                    </div>
                  )}
                </CardContent>
              </Card>

              <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Recent Activity
                  </h3>
                  <Badge variant="outline" className="font-bold">{contributions.length} total</Badge>
                </div>
                {contributions.map((item) => (
                  <motion.div variants={fadeIn} key={item.id}>
                    <Card className="hover:border-primary/20 transition-all border-muted/20 bg-card/40 backdrop-blur-sm group">
                      <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="font-bold text-base leading-tight group-hover:text-primary transition-colors">{item.title}</div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="secondary" className="text-[10px] h-5 rounded-md px-1.5 font-bold">{item.type}</Badge>
                            <span className="text-xs font-medium text-muted-foreground">
                              {item.points || 0} pts · {item.hours || 0}h
                            </span>
                            <Badge variant={item.status === "approved" ? "success" : "warning"} className={cn(
                              "text-[10px] h-5 rounded-md px-1.5 font-bold border-none",
                              item.status === "approved" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                            )}>
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {item.link && (
                            <Button variant="ghost" size="sm" asChild className="h-9 font-bold">
                              <a href={item.link} target="_blank" rel="noreferrer">
                                View Proof
                                <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
                              </a>
                            </Button>
                          )}
                          {isAdmin && item.status !== "approved" && (
                            <Button 
                              size="sm" 
                              onClick={() => approveContribution(item.id)}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-9 shadow-emerald-500/20 shadow-lg"
                            >
                              Approve
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
                {!contributions.length && (
                  <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-muted/50">
                    <p className="text-muted-foreground font-bold">{text.labels.empty}</p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value="payouts" className="outline-none">
            <motion.div key="payouts" {...fadeIn} className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold">{text.coop.tabs.payouts}</h3>
                  <p className="text-sm text-muted-foreground">Transparency in shared success and revenue distribution.</p>
                </div>
                <Button variant="outline" size="sm" onClick={exportPayoutsCSV} className="font-bold h-10 px-4 rounded-xl">
                  <Download className="w-4 h-4 mr-2" />
                  {text.actions.exportCsv}
                </Button>
              </div>

              {isAdmin && (
                <Card className="border-none shadow-premium bg-background/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Record Monthly Payout</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={addPayout} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Month</label>
                        <Input name="month" type="month" required className="bg-muted/50 border-none h-11" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Revenue</label>
                        <Input name="revenue" type="number" required placeholder="0" className="bg-muted/50 border-none h-11" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Costs</label>
                        <Input name="costs" type="number" required placeholder="0" className="bg-muted/50 border-none h-11" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Members</label>
                        <Input name="members" type="number" required placeholder="0" className="bg-muted/50 border-none h-11" />
                      </div>
                      <Button type="submit" className="md:col-span-2 lg:col-span-4 h-12 font-black transition-all hover:shadow-lg">
                        Execute Payout Distribution
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-none bg-primary/5 shadow-none overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="p-2 bg-primary/10 rounded-lg"><TrendingUp className="w-4 h-4 text-primary" /></div>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] uppercase font-black tracking-tighter">Growth</Badge>
                    </div>
                    <div className="mt-4">
                      <div className="text-2xl font-black">{formatNumber(payoutSummary.revenue)}</div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{text.labels.revenue}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none bg-rose-500/5 shadow-none overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="p-2 bg-rose-500/10 rounded-lg"><CreditCard className="w-4 h-4 text-rose-500" /></div>
                      <Badge variant="secondary" className="bg-rose-500/10 text-rose-500 border-none text-[10px] uppercase font-black tracking-tighter">Operating</Badge>
                    </div>
                    <div className="mt-4">
                      <div className="text-2xl font-black">{formatNumber(payoutSummary.costs)}</div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{text.labels.costs}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none bg-emerald-500/5 shadow-none overflow-hidden border-emerald-500/10 border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="p-2 bg-emerald-500/10 rounded-lg"><DollarSign className="w-4 h-4 text-emerald-500" /></div>
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-none text-[10px] uppercase font-black tracking-tighter">Profit</Badge>
                    </div>
                    <div className="mt-4">
                      <div className="text-2xl font-black text-emerald-500">{formatNumber(payoutSummary.net)}</div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{text.labels.netLabel}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none bg-indigo-500/5 shadow-none overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="p-2 bg-indigo-500/10 rounded-lg"><UserCheck className="w-4 h-4 text-indigo-500" /></div>
                      <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-500 border-none text-[10px] uppercase font-black tracking-tighter">Avg Share</Badge>
                    </div>
                    <div className="mt-4">
                      <div className="text-2xl font-black text-indigo-500">{formatNumber(payoutSummary.avgShare)}</div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Per Member</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
                {payouts.map((item) => (
                  <motion.div variants={fadeIn} key={item.id}>
                    <Card className="border-muted/20 hover:border-primary/20 transition-all bg-card/40 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-muted/50 flex flex-col items-center justify-center font-black leading-tight border border-muted-foreground/5 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                              <span className="text-[10px] uppercase">{item.month?.split('-')[0]}</span>
                              <span className="text-base">{item.month?.split('-')[1]}</span>
                            </div>
                            <div>
                                <div className="font-black text-lg">{item.month || ""}</div>
                                <div className="text-xs font-bold text-muted-foreground">Active Members: {formatNumber(item.members || 0)}</div>
                            </div>
                          </div>
                          <Badge className="h-10 px-6 rounded-xl bg-primary text-white font-black text-sm shadow-lg shadow-primary/20">
                            Share {formatNumber(item.share || 0)}
                          </Badge>
                        </div>
                        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-muted/30 p-4 rounded-2xl border border-muted-foreground/5">
                            <div className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Revenue</div>
                            <div className="text-sm font-bold mt-1">{formatNumber(item.revenue || 0)}</div>
                          </div>
                          <div className="bg-muted/30 p-4 rounded-2xl border border-muted-foreground/5">
                            <div className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Costs</div>
                            <div className="text-sm font-bold mt-1">{formatNumber(item.costs || 0)}</div>
                          </div>
                          <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/10">
                            <div className="text-[10px] uppercase font-black text-emerald-500 tracking-widest">Net Profit</div>
                            <div className="text-sm font-bold mt-1 text-emerald-500">{formatNumber(item.net || 0)}</div>
                          </div>
                          <div className="bg-primary/10 p-4 rounded-2xl border border-primary/10">
                            <div className="text-[10px] uppercase font-black text-primary tracking-widest">Your Share</div>
                            <div className="text-sm font-bold mt-1 text-primary">{formatNumber(item.share || 0)}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
                {!payouts.length && (
                  <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-muted/50">
                    <p className="text-muted-foreground font-bold">{text.labels.empty}</p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value="governance" className="outline-none">
            <motion.div key="governance" {...fadeIn} className="space-y-8">
              <MemberTaskCenter active={coopTab === "governance"} formatDateTime={formatDateTime} />

              <Card className="border-none shadow-premium bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Vote className="w-5 h-5 text-primary" />
                    Propose Change
                  </CardTitle>
                  <CardDescription>Initiate a new proposal for cooperative voting.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={addProposal} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">{text.labels.title}</label>
                      <Input name="title" required className="bg-muted/50 border-none h-11" placeholder="e.g. New Learning Path for AI" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">{text.labels.type}</label>
                      <Input name="type" className="bg-muted/50 border-none h-11" placeholder="e.g. Strategy, Technical, Social" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">{text.labels.summary}</label>
                      <Textarea name="summary" required className="bg-muted/50 border-none min-h-[100px]" placeholder="Explain the details and impact of this proposal..." />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">{text.labels.deadline}</label>
                      <Input name="deadline" type="date" className="bg-muted/50 border-none h-11" />
                    </div>
                    <Button type="submit" className="md:col-span-2 h-12 font-black">
                      Launch Governance Vote
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground px-2 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Active Proposals
                </h3>
                {proposals.map((proposal) => (
                  <Card key={proposal.id} className="border-muted/20 bg-card/40 backdrop-blur-sm overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-xl">{proposal.title}</h4>
                            <Badge variant="outline" className="font-bold border-muted-foreground/30 text-muted-foreground">{proposal.type}</Badge>
                          </div>
                          <div className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-widest">
                            Ends: {proposal.deadline}
                          </div>
                          <p className="text-sm leading-relaxed text-muted-foreground font-medium max-w-3xl">
                            {proposal.summary}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex flex-col gap-2 flex-1">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1">
                            <span className="text-emerald-500">Agree ({proposalVotes[proposal.id]?.yes || 0})</span>
                            <span className="text-rose-500">Disagree ({proposalVotes[proposal.id]?.no || 0})</span>
                          </div>
                          <div className="h-3 w-full bg-muted/50 rounded-full overflow-hidden flex">
                            <div 
                              className="h-full bg-emerald-500 transition-all duration-500" 
                              style={{ width: `${(proposalVotes[proposal.id]?.yes || 0) / ((proposalVotes[proposal.id]?.yes || 0) + (proposalVotes[proposal.id]?.no || 0) || 1) * 100}%` }}
                            />
                            <div 
                              className="h-full bg-rose-500 transition-all duration-500" 
                              style={{ width: `${(proposalVotes[proposal.id]?.no || 0) / ((proposalVotes[proposal.id]?.yes || 0) + (proposalVotes[proposal.id]?.no || 0) || 1) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" onClick={() => voteProposal(proposal.id, "yes")} className="h-10 px-6 rounded-xl border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 font-black">
                            {text.actions.voteYes}
                          </Button>
                          <Button variant="outline" onClick={() => voteProposal(proposal.id, "no")} className="h-10 px-6 rounded-xl border-rose-500/20 text-rose-500 hover:bg-rose-500/10 font-black">
                            {text.actions.voteNo}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {!proposals.length && (
                  <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-muted/50">
                    <p className="text-muted-foreground font-bold">{text.labels.empty}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="pathways" className="outline-none">
            <motion.div key="pathways" {...fadeIn} className="space-y-8">
              {isAdmin && (
                <Card className="border-none shadow-premium bg-background/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapIcon className="w-5 h-5 text-primary" />
                      Create New Pathway
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={addPathway} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input name="title" placeholder={text.labels.title} required className="bg-muted/50 border-none h-11" />
                      <Input name="level" placeholder={text.labels.levelLabel} className="bg-muted/50 border-none h-11" />
                      <Textarea name="summary" placeholder={text.labels.summary} required className="md:col-span-2 bg-muted/50 border-none" />
                      <Input name="link" placeholder={text.labels.link} className="md:col-span-2 bg-muted/50 border-none h-11" />
                      <Button type="submit" className="md:col-span-2 h-12 font-black">
                        Deploy Learning Pathway
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pathways.map((item) => (
                  <Card key={item.id} className="border-muted/20 hover:border-primary/20 transition-all bg-card/40 backdrop-blur-sm overflow-hidden group">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase tracking-widest">{item.level}</Badge>
                        <MapIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <CardTitle className="text-xl font-black mt-2">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm font-medium text-muted-foreground leading-relaxed line-clamp-3">
                        {item.summary}
                      </p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="outline" className="w-full font-black h-10 rounded-xl group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all" onClick={() => enrollPathway(item.id)}>
                        {text.actions.enroll}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
                {!pathways.length && (
                  <div className="md:col-span-2 text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-muted/50">
                    <p className="text-muted-foreground font-bold">{text.labels.empty}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="squads" className="outline-none">
            <motion.div key="squads" {...fadeIn} className="space-y-8">
              {isAdmin && (
                <Card className="border-none shadow-premium bg-background/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Form New Squad
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={addSquad} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input name="title" placeholder={text.labels.title} required className="bg-muted/50 border-none h-11 md:col-span-2" />
                      <Textarea name="summary" placeholder={text.labels.summary} required className="md:col-span-2 bg-muted/50 border-none" />
                      <Button type="submit" className="md:col-span-2 h-12 font-black">
                        Mobilize Squad
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Newly Integrated CooperativeMemberCards */}
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-primary" /> Top Cooperative Contributors</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <CooperativeMemberCard name="Rafiqul Islam" role="Frontend Engineer" department="Software Engineering" contributionPoints={1250} />
                  <CooperativeMemberCard name="Nusrat Jahan" role="Product Manager" department="Product & Business" contributionPoints={2100} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {squads.map((item) => (
                  <Card key={item.id} className="border-muted/20 hover:border-primary/20 transition-all bg-card/40 backdrop-blur-sm overflow-hidden group">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                         <CardTitle className="text-xl font-black">{item.title}</CardTitle>
                         <Users className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                        {item.summary}
                      </p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="outline" className="w-full font-black h-10 rounded-xl group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all" onClick={() => requestSquadJoin(item.id)}>
                        {text.actions.requestJoin}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
                {!squads.length && (
                  <div className="md:col-span-2 text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-muted/50">
                    <p className="text-muted-foreground font-bold">{text.labels.empty}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="translations" className="outline-none">
            <motion.div key="translations" {...fadeIn} className="space-y-8">
              <Card className="border-none shadow-premium bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Languages className="w-5 h-5 text-primary" />
                    Submit Translation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={addTranslation} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input name="title" placeholder={text.labels.title} required className="bg-muted/50 border-none h-11" />
                    <Input name="link" placeholder={text.labels.link} className="bg-muted/50 border-none h-11" />
                    <Input name="sourceLang" placeholder={text.labels.sourceLang} className="bg-muted/50 border-none h-11" />
                    <Input name="targetLang" placeholder={text.labels.targetLang} className="bg-muted/50 border-none h-11" />
                    <Button type="submit" className="md:col-span-2 h-12 font-black">
                      Log Translation Work
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {translations.map((item) => (
                  <Card key={item.id} className="border-muted/20 bg-card/40 backdrop-blur-sm group">
                    <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="font-black text-lg">{item.title}</div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest">{item.sourceLang} → {item.targetLang}</Badge>
                          <Badge className={cn(
                            "text-[10px] font-bold border-none",
                            item.status === "done" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                          )}>{item.status}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.link && (
                          <Button variant="ghost" size="sm" asChild className="font-bold">
                            <a href={item.link} target="_blank" rel="noreferrer">
                              View Link
                              <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
                            </a>
                          </Button>
                        )}
                        {isAdmin && (
                          <div className="flex items-center gap-1">
                            <Button size="sm" variant="outline" className="font-bold h-9" onClick={() => updateTranslationStatus(item.id, "in-review")}>Review</Button>
                            <Button size="sm" className="font-bold h-9 bg-emerald-500 hover:bg-emerald-600" onClick={() => updateTranslationStatus(item.id, "done")}>Finalize</Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {!translations.length && (
                  <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-muted/50">
                    <p className="text-muted-foreground font-bold">{text.labels.empty}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="mentorship" className="outline-none">
            <motion.div key="mentorship" {...fadeIn} className="space-y-8">
              <Card className="border-none shadow-premium bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    Request Mentorship
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={addMentorRequest} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input name="focus" placeholder="Focus Area (e.g. React, UI/UX)" className="bg-muted/50 border-none h-11" required />
                    <Select name="urgency" defaultValue="medium">
                      <SelectTrigger className="bg-muted/50 border-none h-11">
                        <SelectValue placeholder="Urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - General Guidance</SelectItem>
                        <SelectItem value="medium">Medium - Project Blocker</SelectItem>
                        <SelectItem value="high">High - Urgent Issue</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea name="notes" placeholder="What do you need help with?" required className="md:col-span-2 bg-muted/50 border-none min-h-[100px]" />
                    <Button type="submit" className="md:col-span-2 h-12 font-black">
                      Dispatch Mentor Request
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mentorRequests.map((item) => (
                  <Card key={item.id} className="border-muted/20 bg-card/40 backdrop-blur-sm overflow-hidden group">
                    <CardHeader className="pb-2">
                       <div className="flex items-center justify-between">
                          <Badge className={cn(
                            "text-[10px] uppercase font-black tracking-widest border-none",
                            item.status === "assigned" ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary"
                          )}>{item.status}</Badge>
                          <GraduationCap className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                       </div>
                       <CardTitle className="text-lg font-black mt-2">{item.focus}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm font-medium text-muted-foreground leading-relaxed">{item.notes}</p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      {isAdmin && item.status !== "assigned" && (
                        <Button className="w-full font-black h-10 rounded-xl" onClick={() => assignMentor(item.id)}>
                          Assign Mentor
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
                {!mentorRequests.length && (
                  <div className="md:col-span-2 text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-muted/50">
                    <p className="text-muted-foreground font-bold">{text.labels.empty}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="quality" className="outline-none">
            <motion.div key="quality" {...fadeIn} className="space-y-8">
              {isAdmin && (
                <Card className="border-none shadow-premium bg-background/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckSquare className="w-5 h-5 text-primary" />
                        New Quality Gate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={addQualityGate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input name="title" placeholder="Project or Module Title" required className="bg-muted/50 border-none h-11" />
                      <Input name="checklist" placeholder="Item 1, Item 2, Item 3" required className="bg-muted/50 border-none h-11" />
                      <Button type="submit" className="md:col-span-2 h-12 font-black">
                        Publish Quality Standards
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {qualityGates.map((item) => (
                  <Card key={item.id} className="border-muted/20 bg-card/40 backdrop-blur-sm overflow-hidden group">
                    <CardHeader className="pb-2">
                       <CardTitle className="text-lg font-black flex items-center justify-between">
                         {item.title}
                         <Badge variant="outline" className="text-[10px] font-bold">
                           {item.checklist?.filter(c => c.done).length || 0}/{item.checklist?.length || 0}
                         </Badge>
                       </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {(item.checklist || []).map((check, idx) => (
                        <div key={idx} className="flex items-center space-x-3 bg-muted/30 p-3 rounded-xl border border-muted-foreground/5 transition-colors hover:bg-muted/50">
                          <input
                            type="checkbox"
                            checked={!!check.done}
                            onChange={() => toggleGateItem(item.id, idx)}
                            disabled={!isAdmin}
                            className="w-4 h-4 rounded border-muted bg-background text-primary focus:ring-primary/20 accent-primary"
                          />
                          <span className={cn(
                            "text-sm font-bold transition-all",
                            check.done ? "line-through text-muted-foreground italic" : "text-foreground"
                          )}>
                            {check.label}
                          </span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
                {!qualityGates.length && (
                  <div className="md:col-span-2 text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-muted/50">
                    <p className="text-muted-foreground font-bold">{text.labels.empty}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="assignments" className="outline-none">
            <motion.div key="assignments" {...fadeIn} className="space-y-8">
              <div className="bg-muted/30 p-1.5 rounded-2xl inline-flex gap-1">
                {["all", "pending", "approved", "rejected"].map((status) => (
                  <Button
                    key={status}
                    variant={assignmentFilter === status ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setAssignmentFilter(status)}
                    className={cn(
                      "rounded-xl h-9 px-4 text-[10px] font-black uppercase tracking-widest",
                      assignmentFilter === status ? "shadow-lg shadow-primary/20" : "text-muted-foreground"
                    )}
                  >
                    {status === "all" ? text.labels.assignmentSubmissions : getSubmissionStatus(status)}
                  </Button>
                ))}
              </div>

              <Card className="border-none shadow-premium bg-background/50 backdrop-blur-sm overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-primary" />
                    {isAdmin
                      ? (lang === "bn" ? "রিভিউ কিউ" : "Review Queue")
                      : (lang === "bn" ? "পিয়ার অ্যাটেস্টেশন কিউ" : "Peer Attestation Queue")}
                  </CardTitle>
                  <CardDescription>
                    {isAdmin
                      ? (lang === "bn" ? "সদস্যদের জমা দেওয়া কাজ, পিয়ার সিগনাল এবং অ্যাডমিন সিদ্ধান্ত এক জায়গায় দেখুন।" : "See member submissions, peer signals, and admin decisions in one serverless queue.")
                      : (lang === "bn" ? "নিজের বাইরে থাকা সাবমিশনগুলো দেখে রেডি বা রিওয়ার্ক অ্যাটেস্ট করুন।" : "Review other members' submissions and attest whether they are ready or need rework.")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {visibleReviewQueue.length ? (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      {visibleReviewQueue.map((queueItem) => {
                        const queueMeta = getQueueMeta(queueItem?.peerStatus);
                        const summary = queueItem?.attestationSummary || {};
                        const preview = queueItem?.attestationPreview || [];
                        return (
                          <Card key={`queue-${queueItem?.submissionId || queueItem?.id}`} className="border-muted/20 bg-card/40 backdrop-blur-sm shadow-none">
                            <CardContent className="p-5 space-y-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1 min-w-0">
                                  <div className="font-black leading-tight text-lg">
                                    {lang === "bn" ? queueItem?.itemTitleBn || queueItem?.itemTitleEn : queueItem?.itemTitleEn || queueItem?.itemTitleBn}
                                  </div>
                                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    {formatMonth(queueItem?.month)} · {lang === "bn" ? queueItem?.pathTitleBn || queueItem?.pathTitleEn : queueItem?.pathTitleEn || queueItem?.pathTitleBn}
                                  </div>
                                </div>
                                <Badge className={cn("text-[10px] font-black border-none h-6 px-2.5", queueMeta.className)}>
                                  {queueMeta.label}
                                </Badge>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted-foreground">
                                <span>{queueItem?.userName || "Member"}</span>
                                <span>•</span>
                                <span>{formatDistrict(queueItem?.districtId)}</span>
                              </div>

                              {queueItem?.notes && (
                                <p className="text-sm font-medium text-muted-foreground bg-muted/20 p-4 rounded-2xl border border-muted-foreground/5 leading-relaxed">
                                  {queueItem.notes}
                                </p>
                              )}

                              <div className="grid grid-cols-3 gap-3">
                                <div className="rounded-2xl border border-muted-foreground/10 bg-muted/20 p-3">
                                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{lang === "bn" ? "মোট" : "Total"}</div>
                                  <div className="mt-1 text-lg font-black">{summary.total || 0}</div>
                                </div>
                                <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-3">
                                  <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{lang === "bn" ? "রেডি" : "Ready"}</div>
                                  <div className="mt-1 text-lg font-black text-emerald-600">{summary.readyCount || 0}</div>
                                </div>
                                <div className="rounded-2xl border border-amber-500/10 bg-amber-500/5 p-3">
                                  <div className="text-[10px] font-black uppercase tracking-widest text-amber-600">{lang === "bn" ? "রিওয়ার্ক" : "Rework"}</div>
                                  <div className="mt-1 text-lg font-black text-amber-600">{summary.needsWorkCount || 0}</div>
                                </div>
                              </div>

                              {!!preview.length && (
                                <div className="space-y-2">
                                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    {lang === "bn" ? "সাম্প্রতিক অ্যাটেস্টেশন" : "Recent Attestations"}
                                  </div>
                                  <div className="space-y-2">
                                    {preview.slice(0, 2).map((entry, idx) => (
                                      <div key={`${queueItem?.submissionId || queueItem?.id}-${entry?.uid || idx}`} className="rounded-2xl border border-muted-foreground/10 bg-background/70 p-3">
                                        <div className="flex items-center justify-between gap-3 text-xs">
                                          <span className="font-black">{entry?.userName || "Member"}</span>
                                          <Badge className={cn(
                                            "text-[10px] font-black border-none h-5 px-2",
                                            entry?.verdict === "ready" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                                          )}>
                                            {entry?.verdict === "ready"
                                              ? (lang === "bn" ? "রেডি" : "Ready")
                                              : (lang === "bn" ? "রিওয়ার্ক" : "Needs work")}
                                          </Badge>
                                        </div>
                                        {entry?.note && (
                                          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{entry.note}</p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {!!queueItem?.reviewNote && (
                                <div className="rounded-2xl border border-primary/10 bg-primary/5 p-3 text-sm text-primary/90">
                                  <span className="font-black">{lang === "bn" ? "অ্যাডমিন নোট:" : "Admin note:"}</span> {queueItem.reviewNote}
                                </div>
                              )}

                              <div className="space-y-3">
                                {queueItem?.link && (
                                  <Button variant="outline" asChild className="w-full font-black h-11 rounded-xl">
                                    <a href={queueItem.link} target="_blank" rel="noreferrer">
                                      {text.labels.openLink}
                                      <ArrowUpRight className="w-4 h-4 ml-2" />
                                    </a>
                                  </Button>
                                )}
                                {!isAdmin && queueItem?.status === "pending" && (
                                  <>
                                    <Textarea
                                      value={attestationDrafts[queueItem?.submissionId || queueItem?.id] || ""}
                                      onChange={(event) => setAttestationDrafts((prev) => ({ ...prev, [queueItem?.submissionId || queueItem?.id]: event.target.value }))}
                                      placeholder={lang === "bn" ? "কেন রেডি বা রিওয়ার্ক দরকার, ছোট নোট লিখুন" : "Add a short note explaining why it is ready or needs rework"}
                                      className="min-h-[96px] bg-muted/50 border-none"
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                      <Button type="button" className="font-black h-11 rounded-xl bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20" onClick={() => submitPeerAttestation(queueItem?.submissionId || queueItem?.id, "ready")}>
                                        {lang === "bn" ? "রেডি" : "Ready"}
                                      </Button>
                                      <Button type="button" variant="outline" className="font-black h-11 rounded-xl border-amber-500/20 text-amber-600 hover:bg-amber-500/10" onClick={() => submitPeerAttestation(queueItem?.submissionId || queueItem?.id, "needs-work")}>
                                        {lang === "bn" ? "রিওয়ার্ক" : "Needs Work"}
                                      </Button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-muted/20 rounded-3xl border-2 border-dashed border-muted/50">
                      <p className="text-muted-foreground font-bold">
                        {isAdmin
                          ? (lang === "bn" ? "এখনও কোনো কিউ আইটেম নেই।" : "No review-queue items yet.")
                          : (lang === "bn" ? "এখন আপনার জন্য কোনো পিয়ার-রিভিউ কাজ নেই।" : "There are no peer-review tasks for you right now.")}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="space-y-4">
                {filteredSubmissions.map((item) => {
                  const queueInfo = reviewQueueMap[item.id];
                  const queueMeta = getQueueMeta(queueInfo?.peerStatus);
                  const summary = queueInfo?.attestationSummary || {};
                  const preview = queueInfo?.attestationPreview || [];
                  return (
                    <Card key={item.id} className="border-muted/20 bg-card/40 backdrop-blur-sm overflow-hidden group">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                          <div className="flex-1 space-y-4">
                            <div className="flex flex-col gap-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="font-black text-xl leading-tight">
                                  {lang === "bn" ? item.itemTitleBn || item.itemTitleEn : item.itemTitleEn || item.itemTitleBn}
                                </h4>
                                <Badge className={cn(
                                  "text-[10px] font-bold border-none h-5 px-2",
                                  item.status === "approved" ? "bg-emerald-500/10 text-emerald-500" : item.status === "rejected" ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500"
                                )}>
                                  {getSubmissionStatus(item.status)}
                                </Badge>
                                {queueInfo && (
                                  <Badge className={cn("text-[10px] font-black border-none h-5 px-2", queueMeta.className)}>
                                    {queueMeta.label}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                {formatMonth(item.month)} · {lang === "bn" ? item.pathTitleBn || item.pathTitleEn : item.pathTitleEn || item.pathTitleBn}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary border border-primary/20">
                                {item.userName?.charAt(0) || "U"}
                              </div>
                              <div className="text-sm font-black tracking-tight">{item.userName}</div>
                              <div className="text-xs font-semibold text-muted-foreground">{formatDistrict(item?.districtId)}</div>
                              {queueInfo && (
                                <div className="text-xs font-semibold text-muted-foreground">
                                  {lang === "bn"
                                    ? `রেডি ${summary.readyCount || 0} · রিওয়ার্ক ${summary.needsWorkCount || 0} · মোট ${summary.total || 0}`
                                    : `Ready ${summary.readyCount || 0} · Rework ${summary.needsWorkCount || 0} · Total ${summary.total || 0}`}
                                </div>
                              )}
                            </div>

                            {item.notes && (
                              <p className="text-sm font-medium text-muted-foreground bg-muted/20 p-4 rounded-2xl border border-muted-foreground/5 leading-relaxed">
                                {item.notes}
                              </p>
                            )}

                            {!!preview.length && (
                              <div className="space-y-2">
                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                  {lang === "bn" ? "পিয়ার ফিডব্যাক" : "Peer Feedback"}
                                </div>
                                <div className="space-y-2">
                                  {preview.slice(0, 2).map((entry, idx) => (
                                    <div key={`${item.id}-${entry?.uid || idx}`} className="rounded-2xl border border-muted-foreground/10 bg-background/70 p-3">
                                      <div className="flex items-center justify-between gap-3 text-xs">
                                        <span className="font-black">{entry?.userName || "Member"}</span>
                                        <Badge className={cn(
                                          "text-[10px] font-black border-none h-5 px-2",
                                          entry?.verdict === "ready" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                                        )}>
                                          {entry?.verdict === "ready"
                                            ? (lang === "bn" ? "রেডি" : "Ready")
                                            : (lang === "bn" ? "রিওয়ার্ক" : "Needs work")}
                                        </Badge>
                                      </div>
                                      {entry?.note && (
                                        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{entry.note}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {isAdmin && (
                              <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Review Feedback</label>
                                <Input
                                  value={reviewNotes[item.id] || ""}
                                  onChange={e => setReviewNotes(prev => ({ ...prev, [item.id]: e.target.value }))}
                                  placeholder="Add feedback for the student..."
                                  className="bg-muted/50 border-none h-11"
                                />
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-2 min-w-[140px]">
                            {item.link && (
                              <Button variant="outline" asChild className="w-full font-black h-11 rounded-xl group-hover:bg-primary/5">
                                <a href={item.link} target="_blank" rel="noreferrer">
                                  {text.labels.openLink}
                                  <ArrowUpRight className="w-4 h-4 ml-2" />
                                </a>
                              </Button>
                            )}
                            {isAdmin && (
                              <>
                                <Button
                                  className="w-full font-black h-11 rounded-xl bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20"
                                  onClick={() => reviewSubmission(item.id, "approved")}
                                >
                                  {text.actions.approve}
                                </Button>
                                <Button
                                  variant="outline"
                                  className="w-full font-black h-11 rounded-xl border-rose-500/20 text-rose-500 hover:bg-rose-500/10"
                                  onClick={() => reviewSubmission(item.id, "rejected")}
                                >
                                  {text.actions.review}
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                {!filteredSubmissions.length && (
                  <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-muted/50">
                    <p className="text-muted-foreground font-bold">{text.labels.empty}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </TabsContent>
          <TabsContent value="credentials" className="outline-none">
            <motion.div key="credentials" {...fadeIn} className="space-y-8">
              {isAdmin && (
                <Card className="border-none shadow-premium bg-background/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-primary" />
                        Issue Credentials
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={addCredential} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input name="uid" placeholder="Member UID" required className="bg-muted/50 border-none h-11" />
                      <Input name="title" placeholder="Credential Title (e.g. Lead Designer)" required className="bg-muted/50 border-none h-11" />
                      <Input name="badge" placeholder="Badge URL or Name" className="bg-muted/50 border-none h-11" />
                      <Input name="level" placeholder="Level/Rank" className="bg-muted/50 border-none h-11" />
                      <Input name="link" placeholder="Verification Link" className="md:col-span-2 bg-muted/50 border-none h-11" />
                      <Button type="submit" className="md:col-span-2 h-12 font-black">
                        Issue Official Certificate
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleCredentials.map((item) => (
                  <Card key={item.id} className="border-muted/20 hover:border-primary/20 transition-all bg-card/40 backdrop-blur-sm group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-12 -mt-12 transition-all group-hover:bg-primary/10" />
                    <CardHeader className="text-center pb-2">
                       <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-4 border border-primary/20 group-hover:scale-110 transition-transform">
                         {item.badge ? <img src={item.badge} alt="" className="w-10 h-10 object-contain" /> : <Award className="w-8 h-8 text-primary" />}
                       </div>
                       <CardTitle className="text-lg font-black">{item.title}</CardTitle>
                       <Badge variant="secondary" className="mt-2 font-bold bg-muted/50 border-none uppercase tracking-widest text-[10px]">{item.level}</Badge>
                    </CardHeader>
                    <CardContent className="text-center pt-0 space-y-4">
                      {item.link && (
                        <Button variant="ghost" size="sm" asChild className="font-bold text-muted-foreground hover:text-primary">
                          <a href={item.link} target="_blank" rel="noreferrer">
                            Verify Identity
                            <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                          </a>
                        </Button>
                      )}
                      <CertificateGenerator
                        compact
                        recipientName={user?.displayName || user?.email || item.uid || "EquiSaaS Member"}
                        achievementTitle={item.title}
                        achievementType={lang === "bn" ? "মেজর ট্র্যাক বা মডিউল কমপ্লিশন" : "major track or module completion"}
                        level={item.level || "Certified Contributor"}
                        issuedAt={item.issuedAt}
                        credentialId={item.id}
                        lang={lang}
                      />
                    </CardContent>
                  </Card>
                ))}
                {!visibleCredentials.length && (
                  <div className="md:col-span-3 text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-muted/50">
                    <p className="text-muted-foreground font-bold">{text.labels.empty}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="roadmap" className="outline-none">
            <motion.div key="roadmap" {...fadeIn} className="space-y-8">
              {isAdmin && (
                <Card className="border-none shadow-premium bg-background/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Rocket className="w-5 h-5 text-primary" />
                        Add Roadmap Item
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={addRoadmapItem} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input name="title" placeholder="Feature or Goal" required className="bg-muted/50 border-none h-11" />
                      <Select name="status" defaultValue="planned">
                        <SelectTrigger className="bg-muted/50 border-none h-11">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planned">Planned</SelectItem>
                          <SelectItem value="in-development">In Development</SelectItem>
                          <SelectItem value="testing">Testing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                        </SelectContent>
                      </Select>
                      <Textarea name="summary" placeholder="Explain the value and details..." required className="md:col-span-2 bg-muted/50 border-none min-h-[100px]" />
                      <Input name="eta" placeholder="Estimated Completion (e.g. Q3 2026)" className="md:col-span-2 bg-muted/50 border-none h-11" />
                      <Button type="submit" className="md:col-span-2 h-12 font-black">
                        Publish Strategic Goal
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-6">
                {roadmapItems.map((item) => (
                  <Card key={item.id} className="border-muted/20 bg-card/40 backdrop-blur-sm overflow-hidden group">
                    <CardContent className="p-6">
                       <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                          <div className="flex-1 space-y-4">
                             <div className="space-y-1">
                               <div className="flex items-center gap-3">
                                 <h4 className="font-black text-xl">{item.title}</h4>
                                 <Badge className={cn(
                                   "text-[10px] font-bold border-none uppercase tracking-widest px-2 h-5",
                                   item.status === "shipped" ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary"
                                 )}>{item.status}</Badge>
                               </div>
                               <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">ETA: {item.eta}</div>
                             </div>
                             <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                               {item.summary}
                             </p>
                          </div>
                          <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-2xl min-w-[100px] border border-muted-foreground/5 shadow-inner">
                             <div className="text-2xl font-black text-primary">{roadmapVotes[item.id] || 0}</div>
                             <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Upvotes</div>
                             <Button size="sm" variant="ghost" onClick={() => voteRoadmap(item.id)} className="h-8 mt-3 w-full font-bold hover:bg-primary/10 hover:text-primary transition-all">
                               <Plus className="w-3 h-3 mr-1" />
                               Upvote
                             </Button>
                          </div>
                       </div>
                    </CardContent>
                  </Card>
                ))}
                {!roadmapItems.length && (
                  <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-muted/50">
                    <p className="text-muted-foreground font-bold">{text.labels.empty}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="trust" className="outline-none">
            <motion.div key="trust" {...fadeIn} className="space-y-8">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold">{text.coop.tabs.trust}</h3>
                  <p className="text-sm text-muted-foreground font-medium">Immutable signals of contribution and value created within the ecosystem.</p>
                </div>
                <Button variant="outline" size="sm" onClick={exportTrustCSV} className="font-bold h-10 px-4 rounded-xl">
                  <Download className="w-4 h-4 mr-2" />
                  {text.actions.exportCsv}
                </Button>
              </div>

              {isAdmin && (
                <Card className="border-none shadow-premium bg-background/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Record Trust Signal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={addTrustSignal} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Member UID</label>
                        <Input name="uid" required className="bg-muted/50 border-none h-11" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Signal Type</label>
                        <Input name="signal" required className="bg-muted/50 border-none h-11" placeholder="e.g. Master Contributor" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Trust Score</label>
                        <Input name="score" type="number" required className="bg-muted/50 border-none h-11" />
                      </div>
                      <div className="flex items-end">
                        <Button type="submit" className="w-full h-11 font-black">
                          Commit Signal
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card className="border-none bg-primary/5 shadow-none group">
                   <CardContent className="p-6">
                      <Shield className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                      <div className="text-3xl font-black">{formatNumber(trustSummary.total)}</div>
                      <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Total Signals Verified</div>
                   </CardContent>
                 </Card>
                 <Card className="border-none bg-indigo-500/5 shadow-none group">
                   <CardContent className="p-6">
                      <Activity className="w-8 h-8 text-indigo-500 mb-4 group-hover:scale-110 transition-transform" />
                      <div className="text-3xl font-black">{formatNumber(trustSummary.avgScore)}</div>
                      <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Average Trust Level</div>
                   </CardContent>
                 </Card>
                 <Card className="border-none bg-emerald-500/5 shadow-none group border border-emerald-500/10">
                   <CardContent className="p-6">
                      <Zap className="w-8 h-8 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
                      <div className="text-3xl font-black text-emerald-500">{formatNumber(trustSummary.totalScore)}</div>
                      <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Network Value Created</div>
                   </CardContent>
                 </Card>
              </div>

               <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground px-2 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Ledger of Trust
                </h3>
                {trustSignals.map((item) => {
                  const score = Number(item.score || 0);
                  const maxScore = trustSummary.maxScore || 1;
                  const percent = Math.min(100, Math.round((score / maxScore) * 100));
                  return (
                    <Card key={item.id} className="border-muted/20 bg-card/40 backdrop-blur-sm overflow-hidden group">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="space-y-1">
                            <div className="font-black text-lg group-hover:text-primary transition-colors">{item.signal}</div>
                            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">ID: {item.uid}</div>
                          </div>
                          <Badge className="h-9 px-4 rounded-xl bg-primary/10 text-primary border-none font-black">
                            Score {formatNumber(score)}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                           <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                                style={{ width: `${percent}%` }}
                              />
                           </div>
                           <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground/60">
                              <span>Low Confidence</span>
                              <span>High Authority</span>
                           </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="audit" className="outline-none">
            <motion.div key="audit" {...fadeIn} className="space-y-6">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-xl font-black tracking-tight">{text.labels.auditTrail}</h3>
                  <Badge variant="outline" className="font-bold border-muted-foreground/20">{auditEntries.length} entries recorded</Badge>
               </div>
               
               <div className="space-y-4">
                {auditEntries.map((item) => (
                  <Card key={item.id} className="border-muted/20 bg-card/40 backdrop-blur-sm overflow-hidden group">
                    <CardContent className="p-5 flex items-start gap-4">
                       <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center border border-muted-foreground/5 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                         <Activity className="w-5 h-5" />
                       </div>
                       <div className="flex-1 space-y-3">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                             <div>
                                <div className="font-black text-base">{item.action}</div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                                  {item.actorName || "Global Process"} · {formatDateTime(item.createdAt)}
                                </p>
                             </div>
                             <Badge variant="secondary" className="bg-muted text-muted-foreground border-none font-black text-[10px] uppercase h-6 rounded-md">
                               {item.action?.split(":")[0] || "System"}
                             </Badge>
                          </div>
                          
                          {item.meta && (
                             <pre className="text-[10px] leading-relaxed font-mono bg-background/50 border border-muted-foreground/10 p-4 rounded-xl overflow-x-auto text-muted-foreground shadow-inner">
                                {JSON.stringify(item.meta, null, 2)}
                             </pre>
                          )}
                       </div>
                    </CardContent>
                  </Card>
                ))}
                {!auditEntries.length && (
                  <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-muted/50 font-bold text-muted-foreground">
                    Immutable ledger is empty.
                  </div>
                )}
               </div>
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </section>
  );
};

export default CoopHubView;




