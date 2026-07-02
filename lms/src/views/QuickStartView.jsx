import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import FoundationZeroPanel from "../components/ui/FoundationZeroPanel.jsx";

const QuickStartView = ({
  lang,
  text,
  applicationLink,
  onOpenRoadmap,
  onOpenResources,
  onOpenCourses,
  rolePlaybooks,
  activeRole,
  manualRoleId,
  setManualRoleId,
}) => {
  const startSteps = [
    {
      titleBn: "১) ফর্ম পূরণ করুন",
      titleEn: "1) Fill the form",
      descBn: "প্রথমে আবেদন ফর্ম পূরণ করুন, তাহলে টিম দ্রুত আপনার সাথে কানেক্ট করতে পারবে।",
      descEn: "Start by submitting the application form so the team can contact you quickly.",
    },
    {
      titleBn: "২) ট্র্যাক বেছে নিন",
      titleEn: "2) Choose your track",
      descBn: "ড্যাশবোর্ড থেকে আপনার ডিপার্টমেন্ট ও সাব-ডিপার্টমেন্ট ঠিক করুন।",
      descEn: "From the dashboard, pick your department and sub-department path.",
    },
    {
      titleBn: "৩) মাসিক টপিক পড়ুন",
      titleEn: "3) Follow monthly topics",
      descBn: "রোডম্যাপ ট্যাব থেকে মাসভিত্তিক টপিক দেখে সপ্তাহে ছোট ছোট টার্গেট নিন।",
      descEn: "Use the roadmap tab and set small weekly targets from monthly topics.",
    },
    {
      titleBn: "৪) অ্যাসাইনমেন্ট জমা দিন",
      titleEn: "4) Submit assignments",
      descBn: "শেখার পর অ্যাসাইনমেন্ট সাবমিট করুন। রিভিউ পেলে সংশোধন করে আবার জমা দিন।",
      descEn: "Submit your assignment after learning. If reviewed, improve and resubmit.",
    },
  ];

  const tabPurposeCards = [
    {
      titleBn: "শুরু গাইড",
      titleEn: "Quick Start",
      descBn: "Foundation 0, onboarding, আর LMS flow বোঝার জায়গা।",
      descEn: "For Foundation 0, onboarding, and understanding the LMS flow.",
    },
    {
      titleBn: "কোর্স ও লেকচার",
      titleEn: "Courses & Lectures",
      descBn: "Full lecture, lab, module, আর path content এখানেই।",
      descEn: "This is where the full lectures, labs, modules, and path content live.",
    },
    {
      titleBn: "স্টাডি রোডম্যাপ",
      titleEn: "Study Roadmap",
      descBn: "Month-wise plan, weekly target, আর delivery rhythm-এর জন্য।",
      descEn: "For month-wise planning, weekly targets, and delivery rhythm.",
    },
    {
      titleBn: "রিসোর্স লাইব্রেরি",
      titleEn: "Resource Library",
      descBn: "Supplementary guide, tool, আর reference link-এর জন্য।",
      descEn: "For supplementary guides, tools, and reference links.",
    },
    {
      titleBn: "কমিউনিটি ফিড",
      titleEn: "Community Feed",
      descBn: "Squad update, channel, আর handoff stream-এর জন্য।",
      descEn: "For squad updates, channels, and handoff streams.",
    },
    {
      titleBn: "কো-অপ হাব",
      titleEn: "Co-op Hub",
      descBn: "Task, submission, review, contribution, আর governance-এর জন্য।",
      descEn: "For tasks, submissions, review, contributions, and governance.",
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-none bg-gradient-to-br from-primary/10 via-background to-brand-green/10 shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-black">{lang === "bn" ? "কোথা থেকে শুরু করবেন" : "Start Here"}</CardTitle>
          <CardDescription className="mt-1 text-sm font-medium">
            {lang === "bn"
              ? "এই page-এ LMS-এর connected flow, Foundation 0, আর কোন tab কোন কাজের জন্য তা সহজভাবে দেওয়া আছে।"
              : "This page explains the connected LMS flow, Foundation 0, and what each tab is responsible for."}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {startSteps.map((item) => (
            <Card key={item.titleEn} className="border-none bg-background/80 shadow-sm">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-black">{lang === "bn" ? item.titleBn : item.titleEn}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-xs font-medium leading-relaxed text-foreground/80">
                {lang === "bn" ? item.descBn : item.descEn}
              </CardContent>
            </Card>
          ))}
        </CardContent>
        <CardContent className="flex flex-wrap gap-3 pt-0">
          <Button size="sm" variant="coop" asChild>
            <a href={applicationLink} target="_blank" rel="noreferrer">{lang === "bn" ? "আবেদন ফর্ম" : "Application Form"}</a>
          </Button>
          <Button size="sm" variant="outline" onClick={onOpenRoadmap}>{lang === "bn" ? "রোডম্যাপ দেখুন" : "View Roadmap"}</Button>
          <Button size="sm" variant="outline" onClick={onOpenResources}>{lang === "bn" ? "রিসোর্স দেখুন" : "View Resources"}</Button>
        </CardContent>
      </Card>

      <Card className="border-none bg-muted/30 shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-black">{lang === "bn" ? "কোন ট্যাব কোন কাজের জন্য" : "What Each Tab Is For"}</CardTitle>
          <CardDescription className="mt-1 text-sm font-medium">
            {lang === "bn" ? "একই জিনিস তিন জায়গায় না খুঁজে সঠিক tab-এ যান। এতে LMS অনেক সহজ লাগে।" : "Use the right tab for the right job instead of hunting in three places."}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tabPurposeCards.map((item) => (
            <Card key={item.titleEn} className="border-none bg-background/80 shadow-sm">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-black">{lang === "bn" ? item.titleBn : item.titleEn}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-xs font-medium leading-relaxed text-foreground/80">
                {lang === "bn" ? item.descBn : item.descEn}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <FoundationZeroPanel lang={lang} onOpenCourses={onOpenCourses} onOpenRoadmap={onOpenRoadmap} />

      <Card className="border-none bg-muted/30 shadow-none">
        <CardHeader className="flex flex-col gap-4 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-2xl font-black">{lang === "bn" ? "ঐচ্ছিক রোল প্লেবুক" : "Optional Role Playbook"}</CardTitle>
            <CardDescription className="mt-1 text-sm font-medium">
              {lang === "bn" ? "LMS flow বোঝার পরে role-specific expectation দেখুন।" : "Review role-specific expectations after you understand the LMS flow."}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4">
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              {text.labels.roleSelect}
            </div>
            <div className="grid gap-2">
              {rolePlaybooks.map((role) => (
                <Button
                  key={role.id}
                  variant={manualRoleId === role.id ? "secondary" : "ghost"}
                  onClick={() => setManualRoleId(role.id)}
                  className={cn(
                    "h-auto justify-start rounded-xl border px-4 py-3 transition-all",
                    manualRoleId === role.id ? "border-primary/20 bg-primary/10 text-primary shadow-sm" : "border-transparent text-muted-foreground hover:bg-muted"
                  )}
                >
                  <div className="text-left">
                    <div className="text-sm font-bold tracking-tight">{lang === "bn" ? role.titleBn : role.titleEn}</div>
                    <div className="text-[10px] font-medium text-muted-foreground opacity-80">
                      {lang === "bn" ? role.summaryBn : role.summaryEn}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-6 lg:col-span-2">
            <Card className="border-none bg-background shadow-sm">
              <CardHeader className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-widest text-primary">
                      {lang === "bn" ? "ঐচ্ছিক প্লেবুক" : "Optional Playbook"}
                    </div>
                    <CardTitle className="text-xl font-black">{lang === "bn" ? activeRole.titleBn : activeRole.titleEn}</CardTitle>
                  </div>
                  <Badge variant="outline" className="rounded-full bg-muted px-3 py-0.5 font-bold">
                    {activeRole.id}
                  </Badge>
                </div>
                <CardDescription className="mt-2 text-sm font-medium leading-relaxed text-foreground/80">
                  {lang === "bn" ? activeRole.summaryBn : activeRole.summaryEn}
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                { title: text.labels.steps, list: lang === "bn" ? activeRole.stepsBn : activeRole.stepsEn },
                { title: text.labels.weeklyRhythm, list: lang === "bn" ? activeRole.rhythmBn : activeRole.rhythmEn },
                { title: text.labels.deliverables, list: lang === "bn" ? activeRole.deliverablesBn : activeRole.deliverablesEn },
              ].map((section) => (
                <Card key={section.title} className="border-none bg-background shadow-sm">
                  <CardHeader className="p-4">
                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 px-4 pb-4 pt-0">
                    {section.list.map((step, index) => (
                      <div key={`${section.title}-${index}`} className="flex gap-2 text-xs font-medium leading-relaxed text-foreground/80">
                        <span className="shrink-0 font-black text-primary">{index + 1}.</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-none bg-background shadow-sm">
              <CardHeader className="p-4">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{text.labels.tools}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2 px-4 pb-4 pt-0">
                {(activeRole.tools || []).map((tool) => (
                  <Badge key={tool} variant="secondary" className="rounded-lg bg-muted/50 px-2 text-[10px] font-bold hover:bg-muted">
                    {tool}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickStartView;
