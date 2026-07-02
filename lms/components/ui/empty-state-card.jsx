"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyStateCard({
  icon: Icon = Sparkles,
  title,
  description,
  action = null,
  className,
}) {
  return (
    <div className={cn("workspace-empty-state premium-panel text-center", className)} role="status" aria-live="polite">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
        <Icon className="h-5 w-5" />
      </div>
      {title ? <p className="mt-4 text-lg font-semibold tracking-tight">{title}</p> : null}
      {description ? <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p> : null}
      {action ? <div className="mt-5 flex flex-wrap justify-center gap-2">{action}</div> : null}
    </div>
  );
}
