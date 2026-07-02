"use client";

import { Languages } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const options = [
  { id: "en", label: "EN" },
  { id: "bn", label: "\u09ac\u09be\u0982\u09b2\u09be" },
];

export function LanguageSwitch({ compact = false }) {
  const { locale, setLocale, copy } = useLocale();

  return (
    <div
      role="group"
      aria-label={copy("Language selection", "ভাষা নির্বাচন")}
      className={cn(
        "inline-flex items-center gap-1 rounded-2xl border bg-background/80 p-1 shadow-sm",
        compact && "rounded-xl",
      )}
    >
      <div className="hidden items-center gap-2 px-2 text-xs font-semibold text-muted-foreground sm:flex">
        <Languages className="h-3.5 w-3.5" />
        {copy("Language", "\u09ad\u09be\u09b7\u09be")}
      </div>

      {options.map((option) => (
        <Button
          key={option.id}
          variant={locale === option.id ? "default" : "ghost"}
          size="sm"
          type="button"
          className="rounded-xl"
          onClick={() => setLocale(option.id)}
          aria-pressed={locale === option.id}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
