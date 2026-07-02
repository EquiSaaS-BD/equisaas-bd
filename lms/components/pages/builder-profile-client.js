"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, Calendar, Gem, GitBranch as Github, Globe, Link as LinkIcon, MapPin, ShieldCheck, Trophy } from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { useLocale } from "@/components/providers/locale-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchPublicProfile, fetchUserCertificates } from "@/lib/firestore/lms";
import { formatDateKey } from "@/lib/date";
import { cn } from "@/lib/utils";

export function BuilderProfileClient({ uid }) {
  const [profile, setProfile] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { copy } = useLocale();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prof, certs] = await Promise.all([
          fetchPublicProfile(uid),
          // We don't have email here, so we might need to adjust fetchUserCertificates 
          // or just rely on the public profile's own record of certs if we add it there.
          // For now, let's assume certificates can be fetched by UID or linked in profile.
          [] 
        ]);
        setProfile(prof);
        setCertificates(certs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [uid]);

  if (loading) {
    return (
      <PublicShell>
        <div className="max-w-4xl mx-auto space-y-8">
          <Skeleton className="h-48 w-full rounded-[3rem]" />
          <div className="grid gap-6 md:grid-cols-3">
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
        </div>
      </PublicShell>
    );
  }

  if (!profile) {
    return (
      <PublicShell>
        <div className="text-center py-20">
          <h1 className="text-2xl font-black">{copy("Profile not found", "প্রোফাইল পাওয়া যায়নি")}</h1>
        </div>
      </PublicShell>
    );
  }

  return (
    <PublicShell>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Profile Header */}
        <Card className="glass-elite border-primary/20 rounded-[3rem] overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary/20 via-secondary/10 to-primary/5" />
          <CardHeader className="relative -mt-12 px-8 pb-8">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
              <div className="h-24 w-24 rounded-[2rem] border-4 border-background bg-muted flex items-center justify-center text-3xl font-black shadow-xl shrink-0">
                {profile.displayName?.charAt(0)}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <h1 className="text-3xl font-black tracking-tight">{profile.displayName}</h1>
                  <BadgeCheck className="h-6 w-6 text-primary" />
                </div>
                <p className="text-muted-foreground font-medium">{profile.bio || copy("EquiSaaS BD Co-builder", "EquiSaaS BD কো-বিল্ডার")}</p>
              </div>
              <div className="flex gap-3 justify-center md:justify-end">
                {profile.socialLinks?.github && (
                  <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="p-3 rounded-2xl bg-muted hover:bg-primary/10 hover:text-primary transition-all">
                    <Github className="h-5 w-5" />
                  </a>
                )}
                {profile.socialLinks?.website && (
                  <a href={profile.socialLinks.website} target="_blank" rel="noreferrer" className="p-3 rounded-2xl bg-muted hover:bg-primary/10 hover:text-primary transition-all">
                    <Globe className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="glass-premium rounded-[2rem] p-6 text-center">
            <Trophy className="h-6 w-6 mx-auto mb-2 text-gold" />
            <p className="text-2xl font-black">{profile.totalPoints || 0}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sweat Equity Units</p>
          </Card>
          <Card className="glass-premium rounded-[2rem] p-6 text-center">
            <ShieldCheck className="h-6 w-6 mx-auto mb-2 text-emerald-500" />
            <p className="text-2xl font-black">{certificates.length}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Verified Certs</p>
          </Card>
          <Card className="glass-premium rounded-[2rem] p-6 text-center">
            <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-black">{profile.joinedAt ? new Date(profile.joinedAt.seconds * 1000).getFullYear() : "2026"}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Member Since</p>
          </Card>
        </div>

        {/* Contributions & Proof */}
        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          <div className="space-y-6">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <Gem className="h-6 w-6 text-primary" />
              {copy("Featured Contributions", "সেরা কাজগুলো")}
            </h2>
            
            {profile.featuredWorkIds?.length ? (
              <div className="grid gap-4">
                {/* Mocked work items for now */}
                <div className="glass-premium p-6 rounded-[2rem] border-primary/5 hover:border-primary/20 transition-all group">
                   <h3 className="font-bold text-lg group-hover:text-primary transition-colors">Retail Engine UI Module</h3>
                   <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Contributed to the core POS interface components using Tailwind and Radix UI.</p>
                   <div className="mt-4 flex items-center gap-2 text-xs font-bold text-primary">
                     <LinkIcon className="h-3.5 w-3.5" />
                     <span>View Proof Record</span>
                   </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center border-2 border-dashed rounded-[3rem] opacity-40">
                <p className="font-bold text-muted-foreground">{copy("No featured work listed yet.", "এখনো কোনো কাজ পিন করা হয়নি।")}</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
             <h2 className="text-xl font-black tracking-tight">{copy("Verified Credentials", "ভেরিফাইড ক্রেডেনশিয়াল")}</h2>
             {certificates.length ? (
               <div className="space-y-3">
                 {certificates.map(cert => (
                   <div key={cert.id} className="p-4 rounded-2xl border bg-card/50 flex items-center gap-4">
                     <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                       <ShieldCheck className="h-5 w-5" />
                     </div>
                     <div>
                       <p className="font-bold text-sm">{cert.certificateTitle}</p>
                       <p className="text-[10px] text-muted-foreground">{formatDateKey(cert.issueDateKey)}</p>
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
               <p className="text-sm text-muted-foreground italic">{copy("No public certificates found.", "কোনো পাবলিক সার্টিফিকেট পাওয়া যায়নি।")}</p>
             )}
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
