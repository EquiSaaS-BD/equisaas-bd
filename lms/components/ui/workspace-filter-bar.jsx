"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function WorkspaceFilterBar({
  eyebrow,
  title,
  description,
  actions = null,
  children = null,
  className,
  contentClassName,
  badgeVariant = "subtle",
}) {
  return (
    <section className={cn("workspace-filter-bar premium-panel hover-glow", className)} data-reveal="up">
      <div className="workspace-filter-bar__header">
        <div className="workspace-filter-bar__copy">
          {eyebrow ? (
            <Badge variant={badgeVariant} className="w-fit rounded-full px-4 py-1.5 text-sm">
              {eyebrow}
            </Badge>
          ) : null}
          {title ? <h2 className="workspace-section-title">{title}</h2> : null}
          {description ? <p className="workspace-section-description">{description}</p> : null}
        </div>
        {actions ? <div className="workspace-filter-bar__actions">{actions}</div> : null}
      </div>
      {children ? <div className={cn("workspace-filter-bar__content", contentClassName)}>{children}</div> : null}
    </section>
  );
}
