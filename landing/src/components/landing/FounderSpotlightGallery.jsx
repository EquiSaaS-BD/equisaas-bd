import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Images, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { fetchFounderSpotlightGalleryItems } from "@/lib/founder-spotlight-gallery";
import { normalizeLocalizedTree } from "@/lib/localized-copy";

const COPY = normalizeLocalizedTree({
  en: {
    badge: "EquiSaaS BD",
    title: "Founder spotlight",
    subtitle: "Selected moments from the founder, team, and community journey.",
    placeholderTitle: "Gallery updates will appear here",
    placeholderBody: "Founder, workshop, and community images will appear here after upload.",
    emptyPill: "No image yet",
    loading: "Loading gallery",
    countSuffix: "visuals",
    rotateHint: "Tap to rotate",
    premiumHint: "EquiSaaS BD",
  },
  bn: {
    badge: "EquiSaaS BD",
    title: "Founder spotlight",
    subtitle: "ফাউন্ডার, টিম, এবং কমিউনিটির নির্বাচিত মুহূর্তগুলো এখানে দেখুন।",
    placeholderTitle: "গ্যালারি আপডেট এখানে দেখা যাবে",
    placeholderBody: "ফাউন্ডার, ওয়ার্কশপ, এবং কমিউনিটির ছবি upload হওয়ার পর এখানে দেখা যাবে।",
    emptyPill: "এখনও কোনো ছবি নেই",
    loading: "গ্যালারি লোড হচ্ছে",
    countSuffix: "টি ভিজ্যুয়াল",
    rotateHint: "ট্যাপ করলে বদলাবে",
    premiumHint: "EquiSaaS BD",
  },
});

const ACCENT_STYLES = {
  teal: {
    glow: "from-primary/25 via-primary/5 to-transparent",
    badge: "border-primary/20 bg-primary/10 text-primary",
  },
  blue: {
    glow: "from-blue-500/25 via-blue-500/5 to-transparent",
    badge: "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-300",
  },
  gold: {
    glow: "from-amber-500/25 via-amber-500/5 to-transparent",
    badge: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-300",
  },
};

const resolveLocalizedText = (item, lang, primaryKey, secondaryKey) => {
  if (lang === "bn") {
    return item?.[secondaryKey] || item?.[primaryKey] || "";
  }
  return item?.[primaryKey] || item?.[secondaryKey] || "";
};

const sortGalleryItems = (items) =>
  [...items].sort((left, right) => {
    if (Boolean(left.featured) !== Boolean(right.featured)) {
      return left.featured ? -1 : 1;
    }
    return Number(left.sortOrder || 0) - Number(right.sortOrder || 0);
  });

function GallerySkeleton({ lang }) {
  const t = COPY[lang];

  return (
    <div className="space-y-4" aria-busy="true" aria-label={t.loading}>
      <div className="flex items-center justify-between gap-3">
        <div className="h-8 w-44 rounded-full bg-muted/60" />
        <div className="h-8 w-24 rounded-full bg-muted/60" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="aspect-[1.2/1] rounded-[1.75rem] bg-muted/60" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <div className="aspect-[1.2/0.78] rounded-[1.5rem] bg-muted/55" />
          <div className="aspect-[1.2/0.78] rounded-[1.5rem] bg-muted/55" />
        </div>
      </div>
    </div>
  );
}

export default function FounderSpotlightGallery({ lang }) {
  const t = COPY[lang];
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchFounderSpotlightGalleryItems(8)
      .then((nextItems) => {
        if (!mounted) return;
        setItems(sortGalleryItems(nextItems.filter((item) => item.imageDataUrl)));
        setActiveIndex(0);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setItems([]);
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const activeItem = items[activeIndex] || null;
  const remainingItems = useMemo(
    () => items.filter((_, index) => index !== activeIndex).slice(0, 4),
    [activeIndex, items],
  );
  const hasSecondaryGallery = remainingItems.length > 0;

  if (loading) {
    return <GallerySkeleton lang={lang} />;
  }

  if (!activeItem) {
    return (
      <div className="relative overflow-hidden rounded-[1.75rem] border border-border/60 bg-background/70 p-6 shadow-lg backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-coop/10" />
        <div className="relative space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-primary">
            <Images className="h-4 w-4" />
            {t.badge}
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-background/85 text-primary shadow-sm">
            <Camera className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black tracking-tight">{t.placeholderTitle}</h3>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">{t.placeholderBody}</p>
          </div>
          <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
            {t.emptyPill}
          </Badge>
        </div>
      </div>
    );
  }

  const accent = ACCENT_STYLES[activeItem.accent] || ACCENT_STYLES.teal;
  const activeTitle = resolveLocalizedText(activeItem, lang, "title", "titleBn");
  const activeNotice = resolveLocalizedText(activeItem, lang, "notice", "noticeBn");
  const activeAltText = resolveLocalizedText(activeItem, lang, "altText", "altTextBn") || activeTitle || "Founder spotlight image";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-primary">
            <Images className="h-4 w-4" />
            {t.badge}
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tight">{t.title}</h3>
            <p className="text-sm leading-6 text-muted-foreground">{t.subtitle}</p>
          </div>
        </div>
        <Badge variant="outline" className="w-fit rounded-full px-3 py-1 text-xs font-semibold">
          {items.length} {t.countSuffix}
        </Badge>
      </div>

      <div className={`grid gap-4 ${hasSecondaryGallery ? "lg:grid-cols-[1.08fr_0.92fr]" : ""}`}>
        <AnimatePresence mode="wait">
          <motion.button
            key={activeItem.id}
            type="button"
            onClick={() => setActiveIndex((current) => (current + 1) % items.length)}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className={`group relative block w-full overflow-hidden rounded-[1.9rem] border border-border/60 bg-background/70 text-left shadow-xl backdrop-blur-xl ${
              hasSecondaryGallery ? "" : "min-h-[22rem] sm:min-h-[26rem] lg:min-h-[34rem]"
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${accent.glow}`} />
            <img
              src={activeItem.imageDataUrl}
              alt={activeAltText}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/18 to-transparent" />
            <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-3">
              <Badge className={`rounded-full border ${accent.badge} px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] shadow-sm`}>
                {activeTitle || t.badge}
              </Badge>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/90 backdrop-blur-xl">
                <Sparkles className="h-3.5 w-3.5" />
                {items.length > 1 ? t.rotateHint : t.premiumHint}
              </div>
            </div>
            <div className="absolute inset-x-4 bottom-4 rounded-[1.5rem] border border-white/15 bg-white/12 p-4 text-white shadow-2xl backdrop-blur-2xl">
              <p className="text-lg font-black tracking-tight">{activeTitle}</p>
              {activeNotice ? (
                <p className="mt-2 text-sm leading-6 text-white/85">{activeNotice}</p>
              ) : null}
            </div>
          </motion.button>
        </AnimatePresence>

        {hasSecondaryGallery ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {remainingItems.map((item, index) => {
              const title = resolveLocalizedText(item, lang, "title", "titleBn");
              const notice = resolveLocalizedText(item, lang, "notice", "noticeBn");
              const altText = resolveLocalizedText(item, lang, "altText", "altTextBn") || title || "Founder spotlight gallery thumbnail";
              const style = ACCENT_STYLES[item.accent] || ACCENT_STYLES.teal;
              const targetIndex = items.findIndex((current) => current.id === item.id);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveIndex(targetIndex)}
                  className="group relative overflow-hidden rounded-[1.55rem] border border-border/60 bg-background/70 text-left shadow-lg transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${style.glow}`} />
                  <div className="absolute inset-0 bg-black/15" />
                  <img
                    src={item.imageDataUrl}
                    alt={altText}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-x-3 bottom-3 rounded-[1.2rem] border border-white/15 bg-white/12 p-3 text-white backdrop-blur-xl">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black tracking-tight">{title || t.badge}</p>
                        {notice ? <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/80">{notice}</p> : null}
                      </div>
                      <Badge className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-bold text-white shadow-none">
                        {index + 2}
                      </Badge>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
