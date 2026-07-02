"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle({ compact = false }) {
  const { theme, setTheme } = useTheme();
  const { copy } = useLocale();

  return (
    <div
      role="group"
      aria-label={copy("Theme selection", "থিম নির্বাচন")}
      className={cn(
        "inline-flex items-center gap-1 rounded-2xl border bg-background/80 p-1 shadow-sm",
        compact && "rounded-xl",
      )}
    >
      <div className="hidden items-center gap-2 px-2 text-xs font-semibold text-muted-foreground sm:flex">
        <SunMedium className="h-3.5 w-3.5" />
        {copy("Theme", "থিম")}
      </div>

      <Button
        variant={theme === "light" ? "default" : "ghost"}
        size="sm"
        type="button"
        className="rounded-xl"
        onClick={() => setTheme("light")}
        aria-pressed={theme === "light"}
      >
        <SunMedium className="h-4 w-4" />
        {copy("Day", "দিন")}
      </Button>

      <Button
        variant={theme === "dark" ? "default" : "ghost"}
        size="sm"
        type="button"
        className="rounded-xl"
        onClick={() => setTheme("dark")}
        aria-pressed={theme === "dark"}
      >
        <MoonStar className="h-4 w-4" />
        {copy("Night", "রাত")}
      </Button>
    </div>
  );
}
