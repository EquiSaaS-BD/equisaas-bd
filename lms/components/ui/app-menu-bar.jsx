"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import {
  ArrowRight,
  Award,
  BookOpenCheck,
  ChevronDown,
  ExternalLink,
  FileBadge2,
  Globe2,
  LogOut,
  Medal,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  Video,
  Workflow,
  X,
} from "lucide-react";
import { BrandLockup } from "@/components/layout/brand-lockup";
import { LanguageSwitch } from "@/components/layout/language-switch";
import { SiteCacheRefresh } from "@/components/layout/site-cache-refresh";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useLocale } from "@/components/providers/locale-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { MAIN_SITE_URL } from "@/lib/urls";
import { cn } from "@/lib/utils";

function getLocalizedText(copy, value) {
  if (Array.isArray(value)) return copy(value[0], value[1]);
  return value;
}

function initialsFromProfile(profile, email) {
  const source = profile?.displayName || profile?.fullName || email || "E";
  return source
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase() || "")
    .join("");
}

function buildPrimaryAction({ canReview, canManage, pathname, copy }) {
  if (canReview && pathname !== "/review") {
    return { href: "/review", label: copy("Open review queue", "রিভিউ কিউ খুলুন"), icon: ShieldCheck };
  }
  if (canManage && pathname !== "/manage") {
    return { href: "/manage", label: copy("Open core governance", "কোর গভর্ন্যান্স খুলুন"), icon: Workflow };
  }
  if (pathname !== "/task") {
    return { href: "/task", label: copy("Continue tasks", "টাস্কে ফিরে যান"), icon: ArrowRight };
  }
  return { href: "/manual", label: copy("Check the manual", "ম্যানুয়াল দেখুন"), icon: BookOpenCheck };
}

function buildUtilityItems({ copy, isSuperAdmin }) {
  return [
    {
      href: "/manual",
      icon: BookOpenCheck,
      label: copy("Manual", "ম্যানুয়াল"),
      desc: copy("Role guide and operating rules", "রোল গাইড এবং অপারেটিং রুল"),
      internal: true,
    },
    {
      href: "/certificate-view",
      icon: FileBadge2,
      label: copy("Verify certificate", "সার্টিফিকেট ভেরিফাই"),
      desc: copy("Open the public certificate verification screen", "পাবলিক certificate verification screen খুলুন"),
      internal: true,
    },
    ...(isSuperAdmin
      ? [
        {
          href: "/manage?tab=certificates",
          icon: Award,
          label: copy("Issue certificates", "সার্টিফিকেট ইস্যু"),
          desc: copy("Go straight to the certificate control center", "সরাসরি certificate control center-এ যান"),
          internal: true,
        },
        {
          href: "/manage?tab=workshop-certificates",
          icon: Video,
          label: copy("Workshop certificates", "ওয়ার্কশপ সার্টিফিকেট"),
          desc: copy("Issue certificates for online workshops and events", "অনলাইন workshop এবং event-এর certificate issue করুন"),
          internal: true,
        },
      ]
      : []),
    {
      href: "https://kholipha-ahmmad-al-amin.equisaas-bd.com/",
      icon: ExternalLink,
      label: copy("Founder's Message", "ফাউন্ডারের বার্তা"),
      desc: copy("Visit the founder's official portfolio and message site", "ফাউন্ডারের অফিসিয়াল পোর্টফোলিও এবং বার্তা সাইট দেখুন"),
      internal: false,
    },
    {
      href: MAIN_SITE_URL,
      icon: ExternalLink,
      label: copy("Main website", "মূল ওয়েবসাইট"),
      desc: copy("Return to the public EquiSaaS BD site", "পাবলিক EquiSaaS BD site-এ ফিরে যান"),
      internal: false,
    },
  ];
}

function getSearchValues(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") return [value];
  return [];
}

export function AppMenuBar({
  sections,
  pathname,
  role,
  roleLabel,
  roleBadges = [],
  canManage,
  canReview,
  currentItem,
  profile,
  email,
  profileTone,
  departmentTitle,
  parentTitle,
  totalPoints,
  onLogout,
  mobileMenuTrigger,
  className,
}) {
  const router = useRouter();
  const { copy } = useLocale();
  const isSuperAdmin = role === "super_admin";
  const primaryAction = buildPrimaryAction({ canReview, canManage, pathname, copy });
  const utilityItems = buildUtilityItems({ copy, isSuperAdmin });
  const flatItems = sections.flatMap((s) => s.items);
  const PrimaryActionIcon = primaryAction.icon;
  const currentSectionKey = sections.find((s) => s.items.some((i) => i.href === pathname))?.key || sections[0]?.key || "";

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navQuery, setNavQuery] = useState("");

  // Open mobile menu when bottom bar "More" is tapped
  useEffect(() => {
    if (mobileMenuTrigger > 0) setMobileMenuOpen(true);
  }, [mobileMenuTrigger]);

  const searchableItems = useMemo(() => {
    const navItems = sections.flatMap((section) =>
      section.items.map((item) => ({
        key: item.href,
        href: item.href,
        label: item.label,
        desc: item.desc,
        internal: true,
        icon: item.icon,
        sectionTitle: section.title,
        searchText: [...getSearchValues(section.title), ...getSearchValues(item.label), ...getSearchValues(item.desc)].join(" ").toLowerCase(),
      })),
    );
    const extraItems = utilityItems.map((item) => ({
      key: `utility:${item.href}`,
      href: item.href,
      label: item.label,
      desc: item.desc,
      internal: item.internal,
      icon: item.icon,
      sectionTitle: copy("Account and tools", "অ্যাকাউন্ট এবং টুল"),
      searchText: [item.label, item.desc].join(" ").toLowerCase(),
    }));
    const deduped = new Map();
    [...navItems, ...extraItems].forEach((item) => {
      if (!deduped.has(item.key)) deduped.set(item.key, item);
    });
    return [...deduped.values()];
  }, [copy, sections, utilityItems]);

  const normalizedQuery = navQuery.trim().toLowerCase();
  const quickFinderResults = useMemo(() => {
    if (!normalizedQuery) {
      return [];
    }
    return searchableItems.filter((item) => item.searchText.includes(normalizedQuery)).slice(0, 8);
  }, [normalizedQuery, searchableItems]);

  const goTo = (href) => (event) => {
    event.preventDefault();
    router.push(href);
  };

  const openExternal = (href) => (event) => {
    event.preventDefault();
    window.location.assign(href);
  };

  useEffect(() => {
    setMobileMenuOpen(false);
    setNavQuery("");
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className={cn("relative z-50", className)}>
        <div className="premium-panel flex items-center justify-between rounded-full border border-border/40 bg-background/70 p-1.5 shadow-2xl backdrop-blur-2xl sm:p-2 sm:px-4 sm:py-2.5">

          {/* Left: Brand & Desktop Menubar */}
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
            <BrandLockup compact />

            <div className="hidden lg:block">
              <Menubar className="border-none bg-transparent shadow-none">
                {sections.map((section) => {
                  const SectionIcon = section.icon;
                  const sectionActive = section.items.some((item) => item.href === pathname);
                  return (
                    <MenubarMenu key={section.key}>
                      <MenubarTrigger className={cn(
                        "flex items-center gap-2 rounded-xl text-sm font-semibold transition-all hover:bg-accent focus:bg-accent data-[state=open]:bg-accent",
                        sectionActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
                      )}>
                        <SectionIcon className="h-4 w-4" />
                        <span className="truncate max-w-[120px]">{getLocalizedText(copy, section.title)}</span>
                      </MenubarTrigger>
                      <MenubarContent align="start" className="w-[220px] rounded-2xl p-2">
                        {section.items.map((item) => {
                          const ItemIcon = item.icon;
                          const active = pathname === item.href;
                          return (
                            <MenubarItem
                              key={item.href}
                              onSelect={() => router.push(item.href)}
                              className={cn(
                                "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
                                active ? "bg-primary/10 text-primary font-bold" : "focus:bg-accent",
                              )}
                            >
                              <div className={cn("shrink-0 rounded-lg p-1.5", active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                                <ItemIcon className="h-4 w-4" />
                              </div>
                              <span className="truncate">{getLocalizedText(copy, item.label)}</span>
                            </MenubarItem>
                          );
                        })}
                      </MenubarContent>
                    </MenubarMenu>
                  );
                })}

                <MenubarMenu>
                  <MenubarTrigger className={cn(
                    "flex items-center gap-2 rounded-xl text-sm font-semibold transition-all hover:bg-accent focus:bg-accent data-[state=open]:bg-accent",
                    pathname === "/certificate-view" ? "bg-primary/10 text-primary" : "text-muted-foreground"
                  )}>
                    <FileBadge2 className="h-4 w-4" />
                    <span>{copy("Certs", "সার্টিফিকেট")}</span>
                  </MenubarTrigger>
                  <MenubarContent align="start" className="w-[220px] rounded-2xl p-2">
                    <MenubarItem onSelect={() => router.push("/certificate-view")} className="flex items-center gap-3 rounded-xl px-3 py-2.5">
                      <div className="shrink-0 rounded-lg bg-muted p-1.5 text-muted-foreground"><ShieldCheck className="h-4 w-4" /></div>
                      <span>{copy("Verify certificate", "সার্টিফিকেট ভেরিফাই")}</span>
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </div>
          </div>

          {/* Right: Search, Tools, Profile */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">

            {/* Search Bar (Hidden on Mobile) */}
            <div className="hidden relative md:flex w-56 lg:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={navQuery}
                onChange={(e) => setNavQuery(e.target.value)}
                className="h-9 w-full rounded-full bg-background/50 pl-9 text-sm border-border/50 focus-visible:ring-primary/30"
                placeholder={copy("Search workspace...", "ওয়ার্কস্পেস খুঁজুন...")}
              />
              {navQuery && (
                <button
                  type="button"
                  onClick={() => setNavQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Utility Tools (Desktop) */}
            <div className="hidden items-center gap-1 xl:flex">
              <ThemeToggle />
              <LanguageSwitch />
            </div>

            {/* Profile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full border border-border/40 bg-background/50 p-1 pr-3 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Avatar className="h-7 w-7 border border-border/60">
                    <AvatarImage src={profile?.photoURL || ""} alt={profile?.displayName || email} />
                    <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                      {initialsFromProfile(profile, email)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-[100px] truncate text-sm font-medium sm:block">
                    {profile?.displayName || profile?.fullName || email}
                  </span>
                  <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[240px] rounded-2xl p-2">
                <div className="px-3 py-3">
                  <p className="truncate font-semibold">{profile?.displayName || profile?.fullName || email}</p>
                  <p className="truncate text-xs text-muted-foreground">{email}</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <Medal className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-primary">{totalPoints || 0}</span>
                    <span className="text-xs text-muted-foreground">{copy("approved points", "অনুমোদিত পয়েন্ট")}</span>
                  </div>
                </div>
                <DropdownMenuSeparator />

                <DropdownMenuLabel>{copy("Account and tools", "অ্যাকাউন্ট ও টুল")}</DropdownMenuLabel>
                {utilityItems.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <DropdownMenuItem
                      key={item.href}
                      onSelect={item.internal ? () => router.push(item.href) : () => window.location.assign(item.href)}
                      className="rounded-xl px-3 py-2.5"
                    >
                      <ItemIcon className="mr-2 h-4 w-4 text-primary" />
                      {getLocalizedText(copy, item.label)}
                    </DropdownMenuItem>
                  );
                })}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onSelect={onLogout}
                  className="rounded-xl px-3 py-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {copy("Log out", "লগ আউট")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </div>

        {/* ── QUICK FINDER RESULTS (Absolute Dropdown) ── */}
        {quickFinderResults.length > 0 && (
          <div className="absolute inset-x-0 top-full mt-2 grid gap-2 rounded-[1.5rem] border border-border/60 bg-card/95 p-3 shadow-xl backdrop-blur-xl sm:grid-cols-2 xl:grid-cols-3">
            {quickFinderResults.map((item) => {
              const ItemIcon = item.icon;
              const handler = item.internal ? () => router.push(item.href) : () => window.location.assign(item.href);
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={handler}
                  className="hover-glow flex items-center gap-3 rounded-2xl bg-background/50 px-3 py-3 text-left transition-colors hover:bg-accent"
                >
                  <div className="shrink-0 rounded-xl bg-primary/10 p-2 text-primary">
                    <ItemIcon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{getLocalizedText(copy, item.label)}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{getLocalizedText(copy, item.sectionTitle)}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {mobileMenuOpen ? (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Sheet panel : slides up from bottom, hugging safe area */}
          <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden">
            <div className="mx-auto max-w-lg rounded-t-[2rem] border border-border/60 bg-background/97 shadow-[0_-24px_64px_-20px_rgba(15,23,42,0.45)] backdrop-blur-2xl">

              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="h-1 w-10 rounded-full bg-border/70" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
                  {copy("Navigate", "নেভিগেট করুন")}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label={copy("Close menu", "মেনু বন্ধ করুন")}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Search */}
              <div className="relative mx-4 mb-3">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={navQuery}
                  onChange={(e) => setNavQuery(e.target.value)}
                  className="h-10 rounded-2xl bg-muted/40 pl-10 text-sm border-border/40"
                  placeholder={copy("Search…", "খুঁজুন…")}
                />
                {navQuery && (
                  <button
                    type="button"
                    onClick={() => setNavQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Nav items : compact scrollable list, max ~60% vh */}
              <div className="max-h-[60vh] overflow-y-auto px-3 pb-6">
                {navQuery && quickFinderResults.length > 0 ? (
                  <div className="space-y-1">
                    <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {copy("Results", "রেজাল্ট")}
                    </p>
                    {quickFinderResults.map((item) => {
                      const ItemIcon = item.icon;
                      const handler = item.internal
                        ? () => router.push(item.href)
                        : () => window.location.assign(item.href);
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={handler}
                          className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-accent"
                        >
                          <div className="shrink-0 rounded-xl bg-primary/10 p-1.5 text-primary">
                            <ItemIcon className="h-3.5 w-3.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">{getLocalizedText(copy, item.label)}</p>
                            <p className="truncate text-[10px] text-muted-foreground">{getLocalizedText(copy, item.sectionTitle)}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : navQuery ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    {copy("Nothing matched.", "কিছু মেলেনি।")}
                  </p>
                ) : (
                  sections.map((section) => {
                    const SectionIcon = section.icon;
                    return (
                      <div key={section.key} className="mb-3">
                        {/* Section label */}
                        <div className="flex items-center gap-1.5 px-2 pb-1 pt-2">
                          <SectionIcon className="h-3 w-3 text-primary shrink-0" />
                          <p className="text-[10px] font-bold uppercase tracking-widest text-primary truncate">
                            {getLocalizedText(copy, section.title)}
                          </p>
                        </div>
                        {/* Items : compact rows */}
                        <div className="space-y-0.5">
                          {section.items.map((item) => {
                            const ItemIcon = item.icon;
                            const active = pathname === item.href;
                            return (
                              <button
                                key={item.href}
                                type="button"
                                onClick={() => router.push(item.href)}
                                className={cn(
                                  "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-medium transition-colors",
                                  active
                                    ? "bg-primary/10 text-primary"
                                    : "text-foreground hover:bg-accent hover:text-foreground",
                                )}
                              >
                                <div className={cn("shrink-0 rounded-lg p-1.5 transition-colors", active ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground")}>
                                  <ItemIcon className="h-3.5 w-3.5" />
                                </div>
                                <span className="min-w-0 flex-1 truncate">{getLocalizedText(copy, item.label)}</span>
                                {active && <Sparkles className="h-3 w-3 shrink-0 text-primary" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
