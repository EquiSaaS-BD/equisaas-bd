import React from "react";
import { getBadgeObjects } from "@/lib/badgeEngine";
import { cn } from "@/lib/utils";

/**
 * BadgeShelf ;  renders a horizontal strip of earned badge pills.
 * Used in the Dashboard profile card and CoopHubView user card.
 *
 * @param {{ earnedIds: string[], lang?: "en"|"bn", size?: "sm"|"md" }} props
 */
const BadgeShelf = ({ earnedIds = [], lang = "en", size = "md" }) => {
  const badges = getBadgeObjects(earnedIds);

  if (!badges.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => (
        <div
          key={badge.id}
          title={lang === "bn" ? badge.descBn : badge.descEn}
          className={cn(
            "group relative inline-flex items-center gap-1.5 rounded-full font-bold",
            "bg-gradient-to-r text-white shadow-sm transition-transform hover:scale-105 cursor-default",
            badge.color,
            size === "sm"
              ? "text-[10px] px-2.5 py-1"
              : "text-xs px-3 py-1.5"
          )}
        >
          <span>{badge.emoji}</span>
          <span>{lang === "bn" ? badge.titleBn : badge.titleEn}</span>

          {/* Tooltip */}
          <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[180px] rounded-xl bg-popover text-popover-foreground text-[10px] font-semibold px-3 py-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 border">
            {lang === "bn" ? badge.descBn : badge.descEn}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BadgeShelf;
