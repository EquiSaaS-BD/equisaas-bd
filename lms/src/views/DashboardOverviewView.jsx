import React from "react";
import { Download, ExternalLink, Link2, Megaphone, MessageSquare, PlayCircle, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BadgeShelf from "../components/ui/BadgeShelf";
import CertificateGenerator from "../components/ui/CertificateGenerator";
import LeaderboardView from "../components/ui/LeaderboardView";

const DashboardOverviewView = ({
  db,
  lang,
  text,
  user,
  selectedPath,
  selectedSubdept,
  getPathTitle,
  getPathDesc,
  getLevelLabel,
  getLocalized,
  currentPathModuleCount,
  currentPathLessonCount,
  currentPathCompletedCount,
  currentPathRemainingCount,
  nextLessonTarget,
  getLessonTitle,
  getModuleTitle,
  dashboardPathCards,
  onOpenQuickStart,
  onOpenCurrentPath,
  onOpenRoadmap,
  onOpenCoopTaskCenter,
  onOpenCommunity,
  onOpenPath,
  publicProfilePath,
  copyPublicProfileLink,
  downloadEquityLedger,
  copyTrackInviteLink,
  publicProfileStats,
  memberRank,
  formatNumber,
  earnedBadgeIds,
  latestAnnouncement,
  hasUnreadAnnouncements,
  formatDateTime,
  onOpenAnnouncement,
  onNotify,
}) => {
  const workflowCards = [
    {
      titleBn: "১) Foundation 0",
      titleEn: "1) Foundation 0",
      descBn: "Quick Start-এ common base আর LMS flow বুঝুন।",
      descEn: "Use Quick Start to learn the common base and the LMS flow.",
      actionBn: "গাইড খুলুন",
      actionEn: "Open guide",
      onClick: onOpenQuickStart,
    },
    {
      titleBn: "২) লেকচার পড়ুন",
      titleEn: "2) Study lectures",
      descBn: "Courses tab থেকে আপনার path-এর full lecture আর lab খুলুন।",
      descEn: "Open full lectures and labs for your path from the Courses tab.",
      actionBn: "লেকচার খুলুন",
      actionEn: "Open lectures",
      onClick: onOpenCurrentPath,
    },
    {
      titleBn: "৩) রোডম্যাপ ধরুন",
      titleEn: "3) Follow roadmap",
      descBn: "Month-wise plan দেখে weekly target নিন।",
      descEn: "Use the roadmap to turn monthly goals into weekly targets.",
      actionBn: "রোডম্যাপ",
      actionEn: "Roadmap",
      onClick: onOpenRoadmap,
    },
    {
      titleBn: "৪) সাবমিট ও রিভিউ",
      titleEn: "4) Submit and review",
      descBn: "Co-op Hub-এ task, submission, আর review flow চালান।",
      descEn: "Use Co-op Hub for tasks, submissions, and review flow.",
      actionBn: "টাস্ক সেন্টার",
      actionEn: "Task center",
      onClick: onOpenCoopTaskCenter,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-none bg-muted/40 shadow-none">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-[10px] font-black uppercase tracking-[0.22em]">
              {lang === "bn" ? "বর্তমান ট্র্যাক" : "Current Track"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-base font-black leading-tight text-foreground">
              {selectedPath ? getPathTitle(selectedPath) : (lang === "bn" ? "ট্র্যাক নির্বাচন করুন" : "Choose a track")}
            </div>
            <div className="mt-2 text-xs font-medium text-muted-foreground">
              {selectedSubdept ? getLocalized(selectedSubdept, "title") : (lang === "bn" ? "সাব-ডিপার্টমেন্ট এখনও সেট হয়নি" : "Sub-department is not set yet")}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-muted/40 shadow-none">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-[10px] font-black uppercase tracking-[0.22em]">
              {lang === "bn" ? "মডিউল" : "Modules"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-3xl font-black">{currentPathModuleCount}</div>
            <div className="mt-2 text-xs font-medium text-muted-foreground">
              {lang === "bn" ? "এই পাথের মোট মডিউল" : "Total modules in this path"}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-muted/40 shadow-none">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-[10px] font-black uppercase tracking-[0.22em]">
              {lang === "bn" ? "লেসন অগ্রগতি" : "Lesson Progress"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-3xl font-black">{currentPathCompletedCount}/{currentPathLessonCount || 0}</div>
            {/* Psychology-Driven UX: Goal Gradient Effect (Artificial Advance) */}
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary/50">
              <div 
                className="h-full bg-primary transition-all duration-1000 ease-out relative" 
                style={{ width: `${currentPathLessonCount > 0 ? Math.max(10, (currentPathCompletedCount / currentPathLessonCount) * 100) : 0}%` }}
              >
                {/* Visual marker for the "gifted" progress */}
                {currentPathCompletedCount === 0 && <div className="absolute inset-y-0 right-0 w-2 bg-white/30 animate-pulse" />}
              </div>
            </div>
            {/* Psychology-Driven UX: Zeigarnik Effect (Highlight Unfinished) */}
            <div className="mt-2 flex items-center justify-between text-xs font-bold">
              <span className="text-rose-500 animate-pulse">{lang === "bn" ? `${currentPathRemainingCount}টি টাস্ক অসম্পূর্ণ!` : `${currentPathRemainingCount} tasks unfinished!`}</span>
              <span className="text-[10px] uppercase tracking-wider text-primary">{lang === "bn" ? "এখুনি শেষ করুন" : "Finish now"}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-muted/40 shadow-none">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-[10px] font-black uppercase tracking-[0.22em]">
              {lang === "bn" ? "পরের লেসন" : "Next Lesson"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-base font-black leading-tight text-foreground">
              {nextLessonTarget ? getLessonTitle(nextLessonTarget.lesson) : (lang === "bn" ? "সব লেসন শেষ" : "All lessons completed")}
            </div>
            <div className="mt-2 text-xs font-medium text-muted-foreground">
              {nextLessonTarget ? getModuleTitle(nextLessonTarget.moduleItem) : (lang === "bn" ? "নতুন পাথ প্রিভিউ করতে পারেন" : "Preview another path next")}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none bg-muted/30 shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-black">{lang === "bn" ? "কাজের ধারাবাহিকতা" : "Connected Workflow"}</CardTitle>
          <CardDescription className="text-sm font-medium">
            {lang === "bn" ? "LMS-এর প্রতিটি tab-এর আলাদা কাজ আছে। এই flow ধরে চললে system-টা পরিষ্কার থাকে।" : "Each tab has a specific job. Following this flow keeps the LMS easy to understand."}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 xl:grid-cols-4">
          {workflowCards.map((item) => (
            <Card key={item.titleEn} className="border-none bg-background/80 shadow-sm">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-black">{lang === "bn" ? item.titleBn : item.titleEn}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4 pt-0">
                <p className="text-xs font-medium leading-relaxed text-foreground/80">{lang === "bn" ? item.descBn : item.descEn}</p>
                <Button size="sm" variant="outline" onClick={item.onClick} className="rounded-xl font-bold">
                  {lang === "bn" ? item.actionBn : item.actionEn}
                </Button>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {user && (
        <Card className="border-none bg-gradient-to-br from-primary/5 via-background to-brand-green/5 shadow-none">
          <CardContent className="space-y-5 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-brand-green text-2xl font-black text-white shadow-md">
                {(user.displayName || user.email || "U")[0].toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-lg font-black">{user.displayName || user.email}</div>
                <div className="mb-3 text-xs font-semibold text-muted-foreground">
                  {lang === "bn" ? "কো-অপারেটিভ মেম্বার" : "Co-operative Member"}
                  {selectedPath?.deptId && ` · ${selectedPath.deptId}`}
                </div>
                <BadgeShelf earnedIds={earnedBadgeIds} lang={lang} size="sm" />
              </div>
              <div className="grid grid-cols-2 gap-2 sm:min-w-[240px]">
                <div className="rounded-2xl border border-primary/10 bg-background/80 px-3 py-2">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{lang === "bn" ? "র‍্যাঙ্ক" : "Rank"}</div>
                  <div className="mt-1 text-sm font-black text-foreground">{memberRank}</div>
                </div>
                <div className="rounded-2xl border border-primary/10 bg-background/80 px-3 py-2">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{lang === "bn" ? "পয়েন্ট" : "Points"}</div>
                  <div className="mt-1 text-sm font-black text-foreground">{formatNumber(publicProfileStats.coopPoints)}</div>
                </div>
                <div className="rounded-2xl border border-primary/10 bg-background/80 px-3 py-2">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{lang === "bn" ? "ট্রাস্ট" : "Trust"}</div>
                  <div className="mt-1 text-sm font-black text-foreground">{formatNumber(publicProfileStats.trustScore)}</div>
                </div>
                <div className="rounded-2xl border border-primary/10 bg-background/80 px-3 py-2">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{lang === "bn" ? "সার্টিফিকেট" : "Certificates"}</div>
                  <div className="mt-1 text-sm font-black text-foreground">{formatNumber(publicProfileStats.certificateCount)}</div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="sm" variant="outline" asChild className="rounded-xl font-bold">
                <a href={publicProfilePath} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  {lang === "bn" ? "Public Profile" : "Public Profile"}
                </a>
              </Button>
              <Button size="sm" variant="ghost" onClick={copyPublicProfileLink} className="rounded-xl font-bold">
                {lang === "bn" ? "শেয়ার লিংক কপি" : "Copy Share Link"}
              </Button>
              <Button size="sm" variant="outline" onClick={downloadEquityLedger} className="gap-2 rounded-xl font-bold">
                <Download className="h-4 w-4" />
                {text.actions.exportEquityLedger}
              </Button>
              <Button size="sm" variant="outline" onClick={copyTrackInviteLink} className="gap-2 rounded-xl font-bold">
                <Link2 className="h-4 w-4" />
                {text.actions.copyTrackInviteLink}
              </Button>
            </div>
            {publicProfileStats.latestCredential && (
              <CertificateGenerator
                compact
                recipientName={user.displayName || user.email || "EquiSaaS Member"}
                achievementTitle={publicProfileStats.latestCredential.title}
                achievementType={lang === "bn" ? "মডিউল বা ট্র্যাক কমপ্লিশন" : "major track or module completion"}
                level={publicProfileStats.latestCredential.level || memberRank}
                issuedAt={publicProfileStats.latestCredential.issuedAt}
                credentialId={publicProfileStats.latestCredential.id}
                lang={lang}
                onNotify={onNotify}
              />
            )}
          </CardContent>
        </Card>
      )}

      {latestAnnouncement?.title && (
        <Card className="border-none bg-gradient-to-r from-primary/5 via-background to-brand-green/5 shadow-none">
          <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-primary/70">
                <Megaphone className="h-3.5 w-3.5" />
                {lang === "bn" ? "সর্বশেষ ঘোষণা" : "Latest Announcement"}
                {hasUnreadAnnouncements && (
                  <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[9px] text-rose-600">
                    {lang === "bn" ? "নতুন" : "New"}
                  </span>
                )}
              </div>
              <div className="mt-2 truncate text-lg font-black text-foreground">{latestAnnouncement.title}</div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {latestAnnouncement.desc || (lang === "bn" ? "নতুন আপডেট দেখতে কমিউনিটি ফিড খুলুন।" : "Open the community feed to read the full update.")}
              </p>
              {latestAnnouncement.timestamp > 0 && (
                <div className="mt-3 text-xs font-semibold text-muted-foreground">
                  {formatDateTime(latestAnnouncement.timestamp)}
                </div>
              )}
            </div>
            <Button size="sm" onClick={onOpenAnnouncement} className="rounded-xl font-bold">
              {lang === "bn" ? "ঘোষণা দেখুন" : "View Update"}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-none bg-muted/40 shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <PlayCircle className="h-5 w-5 text-primary" /> {lang === "bn" ? "বর্তমান পাথ ও পরের ধাপ" : "Current Path and Next Steps"}
            </CardTitle>
            <CardDescription className="text-sm font-medium">
              {lang === "bn" ? "Random path নয়, আগে আপনার current track-টা পরিষ্কার রাখুন। চাইলে পাশের related track preview করুন।" : "Start from your current track first, then preview nearby tracks without losing context."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboardPathCards.map((path) => {
              const isCurrentPath = path.id === selectedPath?.id;
              const isRelatedPath = !isCurrentPath && path.subdeptId === selectedPath?.subdeptId;
              return (
                <div key={path.id} className="flex items-center justify-between gap-4 rounded-xl border bg-background p-3 shadow-sm transition-colors hover:border-primary/40">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-sm font-bold tracking-tight">{getPathTitle(path)}</div>
                      <Badge variant="outline" className="rounded-full text-[10px] font-black uppercase tracking-[0.18em]">
                        {isCurrentPath
                          ? (lang === "bn" ? "বর্তমান" : "Current")
                          : isRelatedPath
                            ? (lang === "bn" ? "রিলেটেড" : "Related")
                            : (lang === "bn" ? "অন্যান্য" : "Other")}
                      </Badge>
                    </div>
                    <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {getLevelLabel(path.level)} · {path.lang}
                    </div>
                    <div className="mt-2 text-xs font-medium text-muted-foreground">{getPathDesc(path)}</div>
                  </div>
                  <Button
                    variant={isCurrentPath ? "default" : "outline"}
                    size="sm"
                    className="rounded-xl font-bold"
                    onClick={() => onOpenPath(path.id, isCurrentPath ? "open-first-lesson" : "preview-path")}
                  >
                    {isCurrentPath ? (lang === "bn" ? "চালিয়ে যান" : "Continue") : (lang === "bn" ? "প্রিভিউ" : "Preview")}
                  </Button>
                </div>
              );
            })}

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl border border-primary/10 bg-gradient-to-br from-primary/5 to-white p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                  <MessageSquare className="h-5 w-5 text-brand-green" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold">{lang === "bn" ? "কমিউনিটি ওয়ার্কস্পেস" : "Community Workspace"}</div>
                  <div className="text-[11px] font-medium text-muted-foreground">{lang === "bn" ? "আপডেট, channel, আর squad handoff-এর জন্য।" : "For updates, channels, and squad handoffs."}</div>
                </div>
                <Button onClick={onOpenCommunity} size="sm" variant="outline" className="rounded-xl font-bold">
                  {lang === "bn" ? "ওপেন" : "Open"}
                </Button>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-primary/10 bg-gradient-to-br from-brand-green/5 to-white p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold">{lang === "bn" ? "কো-অপ টাস্ক সেন্টার" : "Co-op Task Center"}</div>
                  <div className="text-[11px] font-medium text-muted-foreground">{lang === "bn" ? "task, submission, review, আর contribution flow-এর জন্য।" : "For tasks, submissions, review, and contribution flow."}</div>
                </div>
                <Button onClick={onOpenCoopTaskCenter} size="sm" variant="outline" className="rounded-xl font-bold">
                  {lang === "bn" ? "ওপেন" : "Open"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <LeaderboardView db={db} lang={lang} />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverviewView;
