"use client";

import { ArrowRight } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * @param {{
 *   title?: string;
 *   description: string;
 *   children?: React.ReactNode;
 *   className?: string;
 * }} props
 */
export function WorkspaceNextAction({ title, description, children, className }) {
  const { copy } = useLocale();

  return (
    <Card className={cn("bg-card/80 backdrop-blur-xl border shadow-xl rounded-[1.75rem]", className)}>
      <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <Badge variant="subtle" className="rounded-full px-4 py-1.5 text-sm">
            <ArrowRight className="h-4 w-4" />
            {title || copy("Next action", "পরের কাজ")}
          </Badge>
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">{description}</p>
        </div>
        {children ? <div className="flex flex-wrap gap-3">{children}</div> : null}
      </CardContent>
    </Card>
  );
}
