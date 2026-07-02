import React, { useEffect, useMemo, useState } from "react";
import { addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp, startAfter } from "firebase/firestore";
import { Layers3, Loader2, Megaphone, MessageSquare, Network, PenSquare, RefreshCw } from "lucide-react";
import { useLms } from "../lms-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { db as firebaseDb } from "@/lib/firebaseClient";

const ANNOUNCEMENTS_CACHE_KEY = "eq_announcements";

const readAnnouncementsCache = () => {
  try {
    const raw = sessionStorage.getItem(ANNOUNCEMENTS_CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const formatAnnouncementDate = (value, lang) => {
  const timestamp = value?.seconds ? value.seconds * 1000 : value;
  if (!timestamp) return lang === "bn" ? "এইমাত্র" : "Just now";
  return new Date(timestamp).toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const SquadWorkspaceView = () => {
  const {
    DEPARTMENTS,
    getLocalized,
    handleDeptSelect,
    handleSubdeptSelect,
    isAdmin,
    isConfigured,
    lang,
    selectedDept,
    selectedSubdept,
    setView,
    text,
    user,
    userRole,
  } = useLms();
  const db = isConfigured ? firebaseDb : null;
  const canPublish = isAdmin || userRole === "squad-lead";

  const [announcements, setAnnouncements] = useState(readAnnouncementsCache);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishNotice, setPublishNotice] = useState("");
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMoreAnnouncements, setHasMoreAnnouncements] = useState(false);

  const fetchAnnouncements = async (loadMore = false) => {
    if (!db || (loadMore && !lastDoc)) return;
    setLoading(true);
    try {
      const qConstraints = [orderBy("createdAt", "desc"), limit(20)];
      if (loadMore && lastDoc) qConstraints.push(startAfter(lastDoc));
      const nextQuery = query(collection(db, "announcements"), ...qConstraints);
      const snap = await getDocs(nextQuery);
      const newItems = snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
      const lastVisible = snap.docs[snap.docs.length - 1] || null;
      setLastDoc(lastVisible);
      setHasMoreAnnouncements(snap.size === 20 && Boolean(lastVisible));
      setAnnouncements((prev) => {
        const next = loadMore ? [...prev, ...newItems] : newItems;
        sessionStorage.setItem(ANNOUNCEMENTS_CACHE_KEY, JSON.stringify(next));
        return next;
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (db && announcements.length === 0) fetchAnnouncements();
  }, [announcements.length, db]);

  const departmentChannels = useMemo(
    () =>
      DEPARTMENTS.map((dept) => ({
        id: dept.id,
        tag: `#${dept.id}`,
        title: getLocalized(dept, "title"),
        description:
          lang === "bn"
            ? `${dept.subdepartments?.length || 0}টি সাব-ডিপার্টমেন্ট`
            : `${dept.subdepartments?.length || 0} sub-departments`,
      })),
    [DEPARTMENTS, getLocalized, lang],
  );

  const subdepartmentChannels = useMemo(
    () =>
      DEPARTMENTS.flatMap((dept) =>
        (dept.subdepartments || []).map((sub) => ({
          id: `${dept.id}:${sub.id}`,
          deptId: dept.id,
          subId: sub.id,
          tag: `#${sub.id}`,
          title: getLocalized(sub, "title"),
          description: getLocalized(dept, "title"),
        })),
      ),
    [DEPARTMENTS, getLocalized],
  );

  const openDepartment = (deptId) => {
    handleDeptSelect(deptId);
    setView?.("courses");
  };

  const openSubdepartment = (deptId, subdeptId) => {
    handleDeptSelect(deptId);
    handleSubdeptSelect(subdeptId);
    setView?.("courses");
  };

  const publishAnnouncement = async (event) => {
    event.preventDefault();
    if (!canPublish || !user) return;

    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") || "").trim();
    const content = String(form.get("content") || "").trim();
    if (!title || !content) return;

    setPublishing(true);
    setPublishNotice("");
    try {
      const entry = {
        title,
        content,
        desc: content,
        deptId: selectedDept?.id || "",
        subdeptId: selectedSubdept?.id || "",
        createdBy: user.uid,
        createdByName: user.displayName || user.email || "EquiSaaS Member",
        createdAt: db ? serverTimestamp() : new Date().toISOString(),
      };
      if (!db) {
        const localEntry = { id: `local-${Date.now()}`, ...entry, createdAt: new Date().toISOString() };
        setAnnouncements((prev) => {
          const next = [localEntry, ...prev];
          sessionStorage.setItem(ANNOUNCEMENTS_CACHE_KEY, JSON.stringify(next));
          return next;
        });
      } else {
        await addDoc(collection(db, "announcements"), entry);
        await fetchAnnouncements(false);
      }
      event.currentTarget.reset();
      setPublishNotice(lang === "bn" ? "আপডেট প্রকাশ হয়েছে।" : "Update published.");
    } catch (error) {
      console.error(error);
      setPublishNotice(lang === "bn" ? "আপডেট প্রকাশ করা যায়নি।" : "Could not publish the update.");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-3xl border border-muted-foreground/10 bg-background/60 p-8 shadow-premium backdrop-blur-xl">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-primary">
            <MessageSquare className="h-3.5 w-3.5" />
            {lang === "bn" ? "কো-অপ স্কোয়াড" : "Co-op Squad"}
          </div>
          <h2 className="text-3xl font-black tracking-tight">{lang === "bn" ? "স্কোয়াড ওয়ার্কস্পেস" : "Squad Workspace"}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {lang === "bn" ? "দলভিত্তিক আপডেট, চ্যানেল, আর learning handoff এক জায়গায়।" : "Team updates, channels, and learning handoffs in one place."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {canPublish && (
            <Badge variant="secondary" className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-emerald-600">
              {lang === "bn" ? "লিড পাবলিশ অ্যাক্সেস" : "Lead publish access"}
            </Badge>
          )}
          <Button variant="outline" onClick={() => fetchAnnouncements(false)} disabled={loading} className="h-11 rounded-xl gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            {lang === "bn" ? "রিফ্রেশ" : "Refresh"}
          </Button>
        </div>
      </div>

      <Card className="border-none bg-primary/5 shadow-none">
        <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
              {lang === "bn" ? "এই পেজের কাজ" : "What This Page Is For"}
            </div>
            <p className="mt-2 text-sm font-medium leading-relaxed text-foreground/80">
              {lang === "bn" ? "এখানে squad update, channel, announcement, আর handoff থাকে। Task, submission, review, আর contribution-এর জন্য Co-op Hub ব্যবহার করুন।" : "Use this page for squad updates, channels, announcements, and handoffs. Use Co-op Hub for tasks, submissions, review, and contribution flow."}
            </p>
          </div>
          <Button variant="outline" onClick={() => setView?.("coop")} className="rounded-xl font-bold">
            {lang === "bn" ? "কো-অপ হাব খুলুন" : "Open Co-op Hub"}
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="announcements" className="space-y-6">
        <TabsList className="h-auto rounded-2xl border border-muted-foreground/10 bg-muted/30 p-1.5">
          <TabsTrigger value="announcements" className="rounded-xl px-5 py-2.5 text-sm font-bold data-[state=active]:bg-background">
            {lang === "bn" ? "আপডেট" : "Updates"}
          </TabsTrigger>
          <TabsTrigger value="channels" className="rounded-xl px-5 py-2.5 text-sm font-bold data-[state=active]:bg-background">
            {lang === "bn" ? "চ্যানেল" : "Channels"}
          </TabsTrigger>
          {canPublish && (
            <TabsTrigger value="publish" className="rounded-xl px-5 py-2.5 text-sm font-bold data-[state=active]:bg-background">
              {lang === "bn" ? "আপডেট দিন" : "Publish"}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="announcements" className="outline-none">
          <Card className="border-none bg-background/60 shadow-premium backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-black">
                <Megaphone className="h-5 w-5 text-orange-500" />
                {text.labels.communityUpdates}
              </CardTitle>
              <CardDescription>
                {lang === "bn" ? "কমিউনিটি, squad, আর delivery আপডেটের latest stream।" : "The latest stream of community, squad, and delivery updates."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {announcements.length ? (
                <>
                  {announcements.map((item) => (
                    <Card key={item.id} className="border border-muted/20 bg-card/50 shadow-none">
                      <CardHeader className="space-y-3 p-5">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div>
                            <CardTitle className="text-base font-black leading-tight">{item.title}</CardTitle>
                            <CardDescription className="mt-1 text-sm leading-relaxed text-foreground/80">
                              {item.desc || item.content}
                            </CardDescription>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            {item.deptId && (
                              <Badge variant="outline" className="rounded-full text-[10px] font-black uppercase tracking-widest">
                                {item.deptId}
                              </Badge>
                            )}
                            <span className="text-[11px] font-semibold text-muted-foreground">
                              {formatAnnouncementDate(item.createdAt, lang)}
                            </span>
                          </div>
                        </div>
                        {item.createdByName && (
                          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            {lang === "bn" ? "প্রকাশ করেছেন" : "Published by"} · {item.createdByName}
                          </div>
                        )}
                      </CardHeader>
                    </Card>
                  ))}

                  {hasMoreAnnouncements && (
                    <Button variant="ghost" onClick={() => fetchAnnouncements(true)} disabled={loading} className="w-full text-sm font-bold">
                      {lang === "bn" ? "আরও লোড করুন" : "Load more"}
                    </Button>
                  )}
                </>
              ) : (
                <div className="rounded-3xl border-2 border-dashed border-muted/40 px-6 py-16 text-center text-muted-foreground">
                  <Megaphone className="mx-auto mb-3 h-12 w-12 opacity-25" />
                  <p className="text-sm font-semibold">{text.labels.empty}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="outline-none">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="border-none bg-background/60 shadow-premium backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-black">
                  <Layers3 className="h-5 w-5 text-primary" />
                  {lang === "bn" ? "ডিপার্টমেন্ট চ্যানেল" : "Department Channels"}
                </CardTitle>
                <CardDescription>
                  {lang === "bn" ? "প্রতিটি ডিপার্টমেন্ট থেকে সরাসরি roadmap-এ যান।" : "Jump straight into the roadmap for any department."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {departmentChannels.map((channel) => {
                  const active = selectedDept?.id === channel.id;
                  return (
                    <button
                      key={channel.id}
                      type="button"
                      onClick={() => openDepartment(channel.id)}
                      className={[
                        "w-full rounded-2xl border px-4 py-4 text-left transition-colors",
                        active ? "border-primary/30 bg-primary/10" : "border-muted/30 bg-card/40 hover:bg-muted/40",
                      ].join(" ")}
                    >
                      <div className={active ? "font-black text-primary" : "font-black text-foreground"}>{channel.tag}</div>
                      <div className="mt-1 text-sm text-foreground/85">{channel.title}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{channel.description}</div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="border-none bg-background/60 shadow-premium backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-black">
                  <Network className="h-5 w-5 text-primary" />
                  {lang === "bn" ? "সাব-ডিপার্টমেন্ট চ্যানেল" : "Sub-department Channels"}
                </CardTitle>
                <CardDescription>
                  {lang === "bn" ? "specialized path-এ দ্রুত যান এবং team context বজায় রাখুন।" : "Move into specialized paths while keeping team context visible."}
                </CardDescription>
              </CardHeader>
              <CardContent className="max-h-[520px] space-y-3 overflow-y-auto pr-1">
                {subdepartmentChannels.map((channel) => {
                  const active = selectedDept?.id === channel.deptId && selectedSubdept?.id === channel.subId;
                  return (
                    <button
                      key={channel.id}
                      type="button"
                      onClick={() => openSubdepartment(channel.deptId, channel.subId)}
                      className={[
                        "w-full rounded-2xl border px-4 py-4 text-left transition-colors",
                        active ? "border-primary/30 bg-primary/10" : "border-muted/30 bg-card/40 hover:bg-muted/40",
                      ].join(" ")}
                    >
                      <div className={active ? "font-black text-primary" : "font-black text-foreground"}>{channel.tag}</div>
                      <div className="mt-1 text-sm text-foreground/85">{channel.title}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{channel.description}</div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {canPublish && (
          <TabsContent value="publish" className="outline-none">
            <Card className="border-none bg-background/60 shadow-premium backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-black">
                  <PenSquare className="h-5 w-5 text-primary" />
                  {lang === "bn" ? "স্কোয়াড আপডেট প্রকাশ করুন" : "Publish Squad Update"}
                </CardTitle>
                <CardDescription>
                  {lang === "bn" ? "অ্যাডমিন বা squad lead হিসেবে team update, handoff, বা জরুরি note প্রকাশ করুন।" : "As an admin or squad lead, publish a team update, handoff, or urgent note."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={publishAnnouncement} className="space-y-4">
                  <Input name="title" required placeholder={lang === "bn" ? "যেমন: Frontend squad weekly sync" : "For example: Frontend squad weekly sync"} className="h-11 rounded-xl" />
                  <Textarea name="content" required placeholder={lang === "bn" ? "আজকের update, blocker, handoff, বা call to action লিখুন..." : "Write the update, blocker, handoff, or call to action..."} className="min-h-[160px] rounded-2xl" />
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs font-semibold text-muted-foreground">
                      {lang === "bn"
                        ? `বর্তমান context: ${selectedDept ? getLocalized(selectedDept, "title") : "General"}${selectedSubdept ? ` / ${getLocalized(selectedSubdept, "title")}` : ""}`
                        : `Current context: ${selectedDept ? getLocalized(selectedDept, "title") : "General"}${selectedSubdept ? ` / ${getLocalized(selectedSubdept, "title")}` : ""}`}
                    </div>
                    <Button type="submit" disabled={publishing} className="h-11 rounded-xl gap-2 font-black">
                      {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <PenSquare className="h-4 w-4" />}
                      {lang === "bn" ? "প্রকাশ করুন" : "Publish update"}
                    </Button>
                  </div>
                  {publishNotice && <div className="text-sm font-semibold text-muted-foreground">{publishNotice}</div>}
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </section>
  );
};

export default SquadWorkspaceView;
