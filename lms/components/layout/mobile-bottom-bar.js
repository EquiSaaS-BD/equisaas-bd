"use client";

import { usePathname, useRouter } from "next/navigation";
import { BookOpenCheck, Compass, Gem, Menu, Workflow, ShieldCheck } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { cn } from "@/lib/utils";

function buildDockItems({ copy, canReview, canManage }) {
  const base = [
    { href: "/dashboard", icon: Compass, label: copy("Home", "হোম") },
    { href: "/courses", icon: BookOpenCheck, label: copy("Courses", "কোর্স") },
    { href: "/task", icon: Workflow, label: copy("Tasks", "টাস্ক") },
    { href: "/equity", icon: Gem, label: copy("My Share", "শেয়ার") },
  ];

  if (canReview) {
    return [...base, { href: "/review", icon: ShieldCheck, label: copy("Review", "রিভিউ") }];
  }
  if (canManage) {
    return [...base, { href: "/manage", icon: Workflow, label: copy("Stewardship", "স্টিউয়ার্ড") }];
  }
  return [...base, { href: "/manual", icon: BookOpenCheck, label: copy("Manual", "ম্যানুয়াল") }];
}

export function MobileBottomBar({ canReview, canManage, onMenuOpen }) {
  const pathname = usePathname();
  const router = useRouter();
  const { copy } = useLocale();
  const dockItems = buildDockItems({ copy, canReview, canManage });

  return (
    <nav
      className="fixed bottom-4 inset-x-3 z-40 lg:hidden pointer-events-none"
      aria-label={copy("Mobile navigation", "মোবাইল নেভিগেশন")}
    >
      <div className="mx-auto flex w-full max-w-sm items-center justify-between rounded-full border border-border/50 bg-background/80 px-2 py-2 shadow-2xl backdrop-blur-2xl pointer-events-auto">
        {dockItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <button
              key={item.href}
              type="button"
              onClick={() => router.push(item.href)}
              className={cn(
                "group relative flex flex-col items-center justify-center gap-1 rounded-full p-1.5 transition-all duration-300 ease-out active:scale-90 sm:p-2",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={active ? "page" : undefined}
            >
              {active && (
                <span className="absolute inset-0 rounded-full bg-primary/10 transition-all duration-300" />
              )}
              <Icon className={cn("relative z-10 h-5 w-5 transition-transform duration-300", active && "scale-110")} />
              <span className="relative z-10 text-[9px] font-semibold leading-none tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}

        {/* More button */}
        <button
          type="button"
          onClick={onMenuOpen}
          className="group relative flex flex-col items-center justify-center gap-1 rounded-full p-1.5 text-muted-foreground transition-all duration-300 ease-out hover:text-foreground active:scale-90 sm:p-2"
          aria-label={copy("More options", "আরো বিকল্প")}
        >
          <Menu className="relative z-10 h-5 w-5 transition-transform duration-300 group-active:scale-110" />
          <span className="relative z-10 text-[9px] font-semibold leading-none tracking-tight">
            {copy("More", "আরো")}
          </span>
        </button>
      </div>
    </nav>
  );
}
