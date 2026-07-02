"use client";

import Link from "next/link";
import { MAIN_SITE_URL } from "@/lib/urls";
import { useLocale } from "@/components/providers/locale-provider";
import { cn } from "@/lib/utils";

const ASSET_VERSION = "20260404e";

/**
 * @param {{ className?: string; compact?: boolean; showAlternate?: boolean; href?: string }} props
 * href defaults to MAIN_SITE_URL : clicking the logo takes the user to the main landing page.
 * Pass href={null} to render without a link (purely decorative).
 */
export function BrandLockup({ className, compact = false, showAlternate = false, href = MAIN_SITE_URL }) {
  const { locale, copy } = useLocale();

  const primaryLogo = locale === "bn" ? `/logo-bn.svg?v=${ASSET_VERSION}` : `/logo.svg?v=${ASSET_VERSION}`;
  const alternateLogo = locale === "bn" ? `/logo.svg?v=${ASSET_VERSION}` : `/logo-bn.svg?v=${ASSET_VERSION}`;
  const alternateMarkLabel = locale === "bn" ? "English logo" : "বাংলা logo";
  const alternateMarkAlt = locale === "bn" ? "English EquiSaaS BD logo" : "বাংলা EquiSaaS BD logo";

  const inner = (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.35rem] border bg-background/90 shadow-sm transition-transform hover:scale-105 active:scale-95">
        <img
          src={`/favicon.svg?v=${ASSET_VERSION}`}
          alt="EquiSaaS BD"
          className="h-9 w-9 object-contain"
          width="36"
          height="36"
        />
      </div>

      <div className="min-w-0 space-y-2">
        <img
          src={primaryLogo}
          alt={copy("EquiSaaS BD", "ইকুইসাস বিডি")}
          className={cn(
            "h-10 w-auto max-w-[220px] object-contain object-left",
            compact && "h-7 max-w-[140px] sm:h-8 sm:max-w-[180px]",
          )}
          width="220"
          height="40"
        />
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border bg-background/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            LMS
          </span>
          <span className="text-xs text-muted-foreground">
            {copy(
              "Learning, review, and official records",
              "লার্নিং, রিভিউ এবং অফিসিয়াল রেকর্ড",
            )}
          </span>
        </div>
      </div>

      {showAlternate ? (
        <div className="ml-auto hidden rounded-2xl border bg-background/75 px-3 py-2 lg:block">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {alternateMarkLabel}
          </p>
          <img
            src={alternateLogo}
            alt={alternateMarkAlt}
            className="h-6 w-auto max-w-[132px] object-contain object-left opacity-80"
            width="132"
            height="24"
          />
        </div>
      ) : null}
    </div>
  );

  if (!href) return inner;

  if (href.startsWith("http")) {
    return (
      <a href={href} aria-label={copy("Go to home", "হোমে যান")}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} aria-label={copy("Go to home", "হোমে যান")}>
      {inner}
    </Link>
  );
}
