"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BookOpenCheck,
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { BrandLockup } from "@/components/layout/brand-lockup";
import { LanguageSwitch } from "@/components/layout/language-switch";
import { SiteCacheRefresh } from "@/components/layout/site-cache-refresh";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useLocale } from "@/components/providers/locale-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MAIN_SITE_URL, PUBLIC_COMMUNITY_LINKS } from "@/lib/urls";
import { cn } from "@/lib/utils";

export function PublicShell({ children, showAuthActions = true, printMinimal = false }) {
  const { copy } = useLocale();

  return (
    <div className="mesh-premium min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-[1480px] flex-col px-4 py-4 sm:px-6">
        <Card className={cn("rounded-[2rem] border border-border/60 bg-card/85 shadow-[0_24px_64px_-36px_rgba(15,23,42,0.46)] backdrop-blur-xl", printMinimal && "print:hidden")} data-reveal="down">
          <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <BrandLockup />

            <div className="flex flex-wrap items-center gap-2">
              <ThemeToggle />
              <LanguageSwitch />
              <SiteCacheRefresh compact />
              <Button variant="ghost" size="sm" asChild className="transition-all active:scale-95">
                <a href={MAIN_SITE_URL}>
                  <ArrowLeft className="h-4 w-4" />
                  {copy("Main site", "মূল সাইট")}
                </a>
              </Button>
              {showAuthActions ? (
                <>
                  <Button variant="ghost" size="sm" asChild className="transition-all active:scale-95">
                    <Link href="/login">{copy("Log in", "লগ ইন")}</Link>
                  </Button>
                  <Button size="sm" asChild className="shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-95">
                    <Link href="/register">{copy("Create account", "অ্যাকাউন্ট তৈরি করুন")}</Link>
                  </Button>
                </>
              ) : null}
            </div>
          </CardContent>
        </Card>

        {!printMinimal ? (
          <div className="mt-4 rounded-[1.25rem] border border-primary/15 bg-primary/5 p-3 shadow-sm backdrop-blur-xl" data-reveal="fade">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-black">{copy("Need help getting in?", "ঢুকতে সাহায্য লাগছে?")}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {copy(
                      "Use WhatsApp or email if login, registration, or certificate verification gets confusing.",
                      "Login, registration, বা certificate verification confusing লাগলে WhatsApp বা email ব্যবহার করুন।",
                    )}
                  </p>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-3 md:min-w-[31rem]">
                <Button variant="outline" size="sm" className="justify-between rounded-2xl bg-background/70" asChild>
                  <a href={PUBLIC_COMMUNITY_LINKS.whatsappUrl} target="_blank" rel="noreferrer">
                    {copy("WhatsApp", "WhatsApp")}
                    <MessageCircle className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="justify-between rounded-2xl bg-background/70" asChild>
                  <a href={`mailto:${PUBLIC_COMMUNITY_LINKS.supportEmail}`}>
                    {copy("Email support", "সাপোর্ট ইমেইল")}
                    <Mail className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="ghost" size="sm" className="justify-between rounded-2xl" asChild>
                  <a href={PUBLIC_COMMUNITY_LINKS.registrationForm} target="_blank" rel="noreferrer">
                    {copy("Form", "ফর্ম")}
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        <main className={cn("flex-1 py-6 sm:py-7", printMinimal && "print:py-0")} id="main-content">
          {children}
        </main>

        <Card className={cn("rounded-[2rem] border border-border/60 bg-card/85 shadow-[0_24px_64px_-36px_rgba(15,23,42,0.46)] backdrop-blur-xl", printMinimal && "print:hidden")} data-reveal="up">
          <CardContent className="grid gap-4 p-5 md:grid-cols-3">
            {[
              [
                BookOpenCheck,
                copy("9 departments, role-based learning", "৯টি ডিপার্টমেন্ট, রোলভিত্তিক লার্নিং"),
                copy(
                  "Members enter one clear learning path instead of browsing a messy system.",
                  "মেম্বাররা এলোমেলোভাবে ঘোরার বদলে একটি পরিষ্কার লার্নিং পাথে প্রবেশ করে।",
                ),
              ],
              [
                ShieldCheck,
                copy("Proof before points", "পয়েন্টের আগে প্রমাণ"),
                copy(
                  "Tasks, review, and ledger records stay traceable and approval-based.",
                  "টাস্ক, রিভিউ, এবং লেজার রেকর্ড সবসময় ট্রেসযোগ্য ও অনুমোদনভিত্তিক থাকে।",
                ),
              ],
              [
                Globe2,
                copy("Language and comfort controls", "ভাষা ও আরামদায়ক নিয়ন্ত্রণ"),
                copy(
                  "Switch language and day or night theme at any time without changing your workflow.",
                  "ওয়ার্কফ্লো না বদলিয়েই যেকোনো সময় ভাষা এবং দিন বা রাতের থিম বদলাতে পারবেন।",
                ),
              ],
            ].map(([Icon, title, body]) => (
              <div key={title} className="workspace-pane interactive-tile hover-glow hover-lift rounded-3xl p-4">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <p className="font-semibold">{title}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className={cn("mt-4 rounded-[2rem] border border-border/60 bg-card/85 shadow-[0_24px_64px_-36px_rgba(15,23,42,0.46)] backdrop-blur-xl", printMinimal && "print:hidden")} data-reveal="up">
          <CardContent className="space-y-4 p-5">
            <div className="space-y-1">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
                {copy("Community and support routes", "কমিউনিটি ও সাপোর্ট রুট")}
              </p>
              <p className="text-sm leading-6 text-muted-foreground">
                {copy(
                  "Use the official registration form, WhatsApp support, direct email, and public channels from one place.",
                  "অফিশিয়াল registration form, WhatsApp support, direct email, আর public channel-গুলো এক জায়গা থেকে ব্যবহার করুন।",
                )}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Button variant="outline" className="justify-between rounded-2xl" asChild>
                <a href={PUBLIC_COMMUNITY_LINKS.registrationForm} target="_blank" rel="noreferrer">
                  {copy("Registration form", "রেজিস্ট্রেশন ফর্ম")}
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </a>
              </Button>
              <Button variant="outline" className="justify-between rounded-2xl" asChild>
                <a href={PUBLIC_COMMUNITY_LINKS.whatsappUrl} target="_blank" rel="noreferrer">
                  {copy("WhatsApp support", "WhatsApp সাপোর্ট")}
                  <MessageCircle className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" className="justify-between rounded-2xl" asChild>
                <a href={`mailto:${PUBLIC_COMMUNITY_LINKS.hrEmail}`}>
                  {copy("HR help", "HR সহায়তা")}
                  <Mail className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" className="justify-between rounded-2xl" asChild>
                <a href={PUBLIC_COMMUNITY_LINKS.linkedin} target="_blank" rel="noreferrer">
                  {copy("LinkedIn", "LinkedIn")}
                  <Globe2 className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" className="justify-between rounded-2xl" asChild>
                <a href={PUBLIC_COMMUNITY_LINKS.facebookGroup} target="_blank" rel="noreferrer">
                  {copy("Community group", "কমিউনিটি গ্রুপ")}
                  <Users className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" className="justify-between rounded-2xl" asChild>
                <a href={PUBLIC_COMMUNITY_LINKS.youtube} target="_blank" rel="noreferrer">
                  {copy("YouTube updates", "YouTube আপডেট")}
                  <Globe2 className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" className="justify-between rounded-2xl" asChild>
                <a href={PUBLIC_COMMUNITY_LINKS.googleBusinessProfile} target="_blank" rel="noreferrer">
                  {copy("Google Business", "Google Business")}
                  <MapPin className="h-4 w-4" />
                </a>
              </Button>
            </div>

            <div className="workspace-pane interactive-tile flex flex-col gap-2 rounded-3xl p-4 text-sm text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{PUBLIC_COMMUNITY_LINKS.hqAddress}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <a className="font-semibold text-primary transition hover:opacity-80" href={PUBLIC_COMMUNITY_LINKS.map} target="_blank" rel="noreferrer">
                  {copy("Open map", "ম্যাপ খুলুন")}
                </a>
                <a className="font-semibold text-primary transition hover:opacity-80" href={`mailto:${PUBLIC_COMMUNITY_LINKS.supportEmail}`}>
                  {copy("Support email", "সাপোর্ট ইমেইল")}
                </a>
                <a className="font-semibold text-primary transition hover:opacity-80" href={PUBLIC_COMMUNITY_LINKS.facebookPage} target="_blank" rel="noreferrer">
                  {copy("Facebook page", "ফেসবুক পেজ")}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className={cn("pb-4 pt-4 text-center text-sm text-muted-foreground", printMinimal && "print:hidden")}>
          <div className="premium-panel inline-flex items-center gap-2 rounded-full px-4 py-2" data-reveal="fade">
            <Sparkles className="h-4 w-4" />
            {copy("Built for real community work, not just course browsing.", "শুধু কোর্স ব্রাউজিংয়ের জন্য নয়, বাস্তব কমিউনিটি ওয়ার্কের জন্য তৈরি।")}
          </div>
        </div>
      </div>
    </div>
  );
}
