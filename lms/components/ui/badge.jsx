import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-border/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/90 text-primary-foreground shadow-lg shadow-primary/10 backdrop-blur-md",
        secondary: "border-secondary/20 bg-secondary/10 text-secondary backdrop-blur-md",
        outline: "border-border/60 bg-background/40 text-foreground backdrop-blur-md",
        success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 backdrop-blur-md",
        warning: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300 backdrop-blur-md",
        danger: "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300 backdrop-blur-md",
        subtle: "border-primary/15 bg-primary/8 text-primary backdrop-blur-md",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
