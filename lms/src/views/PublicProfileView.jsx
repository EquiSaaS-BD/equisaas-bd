import React, { useEffect, useMemo, useState } from "react";
import { getDoc } from "firebase/firestore";
import {
  ArrowLeft,
  Award,
  Copy,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BadgeShelf from "@/components/ui/BadgeShelf";
import { db, isConfigured } from "@/lib/firebaseClient";
import {
  getMemberRank,
  getPublicProfileDocRef,
  getPublicProfilePath,
} from "@/lib/publicProfile";
import { formatDistrictLabel } from "@/data/bangladesh-districts.js";

const demoProfile = {
  displayName: "EquiSaaS Builder",
  departmentId: "engineering",
  subdepartmentId: "frontend",
  pathTitleEn: "Frontend Engineer Path",
  squadTitleEn: "Frontend Engineer Path Squad",
  squadTitleBn: "ফ্রন্টএন্ড ইঞ্জিনিয়ার পাথ স্কোয়াড",
  coopPoints: 680,
  trustScore: 42,
  certificateCount: 2,
  badges: ["first_login", "track_selected", "first_contribution", "translator"],
  featuredCredentialTitle: "Frontend Sprint Excellence",
  featuredCredentialLevel: "Gold",
};

const metricCards = (profile, lang, formatter) => [
  {
    id: "rank",
    label: lang === "bn" ? "র‍্যাঙ্ক" : "Rank",
    value: getMemberRank(profile?.coopPoints, profile?.trustScore, lang),
    icon: Trophy,
  },
  {
    id: "points",
    label: lang === "bn" ? "কো-অপ পয়েন্ট" : "Co-op Points",
    value: formatter.format(Number(profile?.coopPoints || 0)),
    icon: Sparkles,
  },
  {
    id: "trust",
    label: lang === "bn" ? "ট্রাস্ট স্কোর" : "Trust Score",
    value: formatter.format(Number(profile?.trustScore || 0)),
    icon: ShieldCheck,
  },
  {
    id: "certificates",
    label: lang === "bn" ? "সার্টিফিকেট" : "Certificates",
    value: formatter.format(Number(profile?.certificateCount || 0)),
    icon: Award,
  },
];

const upsertMetaTag = (selector, attributes) => {
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement("meta");
    document.head.appendChild(tag);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    tag.setAttribute(key, value);
  });
};

const upsertLinkTag = (selector, attributes) => {
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement("link");
    document.head.appendChild(tag);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    tag.setAttribute(key, value);
  });
};
const PublicProfileView = ({ userId }) => {
  const [lang, setLang] = useState("en");
  const [profile, setProfile] = useState(isConfigured ? null : demoProfile);
  const [loading, setLoading] = useState(Boolean(isConfigured));
  const [error, setError] = useState("");

  const publicUrl = useMemo(() => getPublicProfilePath(userId, true), [userId]);
  const rank = useMemo(() => getMemberRank(profile?.coopPoints, profile?.trustScore, lang), [lang, profile]);
  const formatter = useMemo(() => new Intl.NumberFormat(lang === "bn" ? "bn-BD" : "en-US"), [lang]);

  useEffect(() => {
    const title = profile?.displayName
      ? `${profile.displayName} | EquiSaaS BD Public Profile`
      : "EquiSaaS BD Public Profile";
    const pathLabel = lang === "bn" ? profile?.pathTitleBn || profile?.pathTitleEn : profile?.pathTitleEn || profile?.pathTitleBn;
    const description = profile?.displayName
      ? `${profile.displayName} · ${rank}${pathLabel ? ` · ${pathLabel}` : ""} · EquiSaaS BD Proof of Equity`
      : "EquiSaaS BD Proof of Equity public profile.";

    document.title = title;
    upsertMetaTag('meta[name="description"]', { name: "description", content: description });
    upsertMetaTag('meta[property="og:type"]', { property: "og:type", content: "profile" });
    upsertMetaTag('meta[property="og:title"]', { property: "og:title", content: title });
    upsertMetaTag('meta[property="og:description"]', { property: "og:description", content: description });
    upsertMetaTag('meta[property="og:url"]', { property: "og:url", content: publicUrl });
    upsertMetaTag('meta[property="og:image"]', { property: "og:image", content: "https://equisaas-bd.web.app/og-image.png" });
    upsertMetaTag('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    upsertMetaTag('meta[name="twitter:title"]', { name: "twitter:title", content: title });
    upsertMetaTag('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    upsertMetaTag('meta[name="twitter:image"]', { name: "twitter:image", content: "https://equisaas-bd.web.app/og-image.png" });
    upsertLinkTag('link[rel="canonical"]', { rel: "canonical", href: publicUrl });
  }, [lang, profile?.displayName, profile?.pathTitleBn, profile?.pathTitleEn, publicUrl, rank]);

  useEffect(() => {
    if (!isConfigured) return;
    let active = true;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const snap = await getDoc(getPublicProfileDocRef(db, userId));
        if (!active) return;
        if (!snap.exists()) {
          setProfile(null);
          setError(lang === "bn" ? "এই প্রোফাইলটি এখনো প্রকাশ করা হয়নি।" : "This profile is not public yet.");
          return;
        }
        setProfile(snap.data());
      } catch (nextError) {
        console.error(nextError);
        if (!active) return;
        setError(lang === "bn" ? "পাবলিক প্রোফাইল লোড করা যায়নি।" : "Could not load the public profile.");
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [userId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
    } catch (nextError) {
      console.error(nextError);
    }
  };

  const handleNativeShare = async () => {
    if (!navigator.share) {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`,
        "_blank",
        "noopener,noreferrer"
      );
      return;
    }

    try {
      await navigator.share({
        title: `${profile?.displayName || "EquiSaaS Member"} | EquiSaaS BD`,
        text: "See my public Proof of Equity profile on EquiSaaS BD.",
        url: publicUrl,
      });
    } catch (_) {}
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.24),_transparent_26%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.2),_transparent_28%),linear-gradient(160deg,_#0f172a,_#111827_52%,_#0b1220)] px-4 py-6 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="outline" size="sm" asChild className="rounded-full border-white/20 bg-white/10 text-white hover:bg-white/15 hover:text-white">
            <a href="/lms/">
              <ArrowLeft className="h-4 w-4" />
              {lang === "bn" ? "LMS-এ ফিরুন" : "Back to LMS"}
            </a>
          </Button>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLang(lang === "bn" ? "en" : "bn")}
              className="rounded-full border-white/20 bg-white/10 text-white hover:bg-white/15 hover:text-white"
            >
              {lang === "bn" ? "English" : "বাংলা"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="rounded-full border-white/20 bg-white/10 text-white hover:bg-white/15 hover:text-white"
            >
              <Copy className="h-4 w-4" />
              {lang === "bn" ? "লিংক কপি" : "Copy Link"}
            </Button>
            <Button size="sm" onClick={handleNativeShare} className="rounded-full bg-white text-slate-900 hover:bg-slate-100">
              <ExternalLink className="h-4 w-4" />
              {lang === "bn" ? "LinkedIn-এ শেয়ার" : "Share to LinkedIn"}
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/10 shadow-[0_32px_120px_rgba(15,23,42,0.42)] backdrop-blur-2xl">
          <div className="relative overflow-hidden border-b border-white/10 px-6 py-8 sm:px-10 sm:py-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(148,163,184,0.18),_transparent_28%),radial-gradient(circle_at_left,_rgba(59,130,246,0.18),_transparent_34%),linear-gradient(135deg,_rgba(255,255,255,0.18),_rgba(255,255,255,0.05))]" />
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <Avatar className="h-24 w-24 rounded-[28px] border border-white/20 bg-white/15 text-4xl font-black shadow-2xl shadow-slate-950/20">
                  <AvatarImage src={profile?.avatarUrl || ""} alt={profile?.displayName || "EquiSaaS Member"} className="rounded-[28px] object-cover" />
                  <AvatarFallback className="rounded-[28px] bg-white/10 text-4xl font-black text-white">
                    {(profile?.displayName || "E")[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-white/80">
                    <Sparkles className="h-3.5 w-3.5" />
                    {lang === "bn" ? "Proof of Equity" : "Proof of Equity"}
                  </div>
                  <div>
                    <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
                      {loading ? (lang === "bn" ? "প্রোফাইল লোড হচ্ছে..." : "Loading profile...") : profile?.displayName || "EquiSaaS Member"}
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
                      {lang === "bn"
                        ? "EquiSaaS BD-তে যাচাইকৃত কন্ট্রিবিউশন, ট্রাস্ট সিগনাল এবং আনলক করা ব্যাজের একটি read-only পাবলিক ভিউ।"
                        : "A read-only public view of verified contributions, trust signals, and earned badges inside EquiSaaS BD."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/12 bg-slate-950/20 px-5 py-4 shadow-inner">
                <div className="text-[10px] font-black uppercase tracking-[0.28em] text-white/55">
                  {lang === "bn" ? "বর্তমান স্ট্যাটাস" : "Current Status"}
                </div>
                <div className="mt-3 text-2xl font-black">{rank}</div>
                {(profile?.pathTitleEn || profile?.pathTitleBn) && (
                  <div className="mt-1 text-sm text-white/70">
                    {lang === "bn" ? profile.pathTitleBn || profile.pathTitleEn : profile.pathTitleEn || profile.pathTitleBn}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-6 px-6 py-6 sm:px-10 sm:py-10 lg:grid-cols-[1.7fr,1fr]">
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {metricCards(profile, lang, formatter).map((item) => (
                  <Card
                    key={item.id}
                    className="border-white/10 bg-white/10 text-white shadow-none backdrop-blur-xl"
                  >
                    <CardContent className="flex items-start justify-between p-5">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.24em] text-white/55">{item.label}</div>
                        <div className="mt-3 text-xl font-black leading-tight sm:text-2xl">{item.value}</div>
                      </div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-white/10">
                        <item.icon className="h-5 w-5 text-white/80" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="border-white/10 bg-white/10 text-white shadow-none backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-black">
                    {lang === "bn" ? "অর্জিত ব্যাজ" : "Earned Badges"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loading ? (
                    <div className="text-sm text-white/70">{lang === "bn" ? "ব্যাজ লোড হচ্ছে..." : "Loading badges..."}</div>
                  ) : profile?.badges?.length ? (
                    <BadgeShelf earnedIds={profile.badges} lang={lang} />
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/15 px-4 py-5 text-sm text-white/70">
                      {lang === "bn" ? "এখনো কোনো পাবলিক ব্যাজ নেই।" : "No public badges yet."}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-white/10 bg-slate-950/25 text-white shadow-none backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-black">
                    {lang === "bn" ? "ভেরিফায়েড হাইলাইট" : "Verified Highlights"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-white/75">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.24em] text-white/50">
                      {lang === "bn" ? "ডিপার্টমেন্ট" : "Department"}
                    </div>
                    <div className="mt-2 font-semibold text-white">
                      {[profile?.departmentId, profile?.subdepartmentId].filter(Boolean).join(" / ") || (lang === "bn" ? "সেট করা হয়নি" : "Not set")}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-sky-300/20 bg-sky-400/10 p-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.24em] text-sky-100/70">
                      {lang === "bn" ? "প্রাইমারি স্কোয়াড" : "Primary Squad"}
                    </div>
                    <div className="mt-2 font-semibold text-white">
                      {lang === "bn"
                        ? profile?.squadTitleBn || profile?.squadTitleEn || "ওপেন কো-অপ স্কোয়াড"
                        : profile?.squadTitleEn || profile?.squadTitleBn || "Open Co-op Squad"}
                    </div>
                  </div>

                  {profile?.districtId ? (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="text-[10px] font-black uppercase tracking-[0.24em] text-white/50">
                        {lang === "bn" ? "জেলা (বাংলাদেশ)" : "District (Bangladesh)"}
                      </div>
                      <div className="mt-2 font-semibold text-white">
                        {formatDistrictLabel(profile.districtId, lang) || profile.districtId}
                      </div>
                    </div>
                  ) : null}

                  {(profile?.featuredCredentialTitle || profile?.featuredCredentialLevel) && (
                    <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                      <div className="text-[10px] font-black uppercase tracking-[0.24em] text-emerald-100/70">
                        {lang === "bn" ? "সর্বশেষ সার্টিফিকেট" : "Latest Certificate"}
                      </div>
                      <div className="mt-2 text-base font-black text-white">{profile.featuredCredentialTitle}</div>
                      {profile.featuredCredentialLevel && (
                        <div className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100/75">
                          {profile.featuredCredentialLevel}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.24em] text-white/50">
                      {lang === "bn" ? "পাবলিক URL" : "Public URL"}
                    </div>
                    <a
                      href={publicUrl}
                      className="mt-2 block break-all font-semibold text-white underline decoration-white/20 underline-offset-4"
                    >
                      {publicUrl}
                    </a>
                  </div>
                </CardContent>
              </Card>

              {error && !loading && (
                <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-4 text-sm text-amber-50">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfileView;


