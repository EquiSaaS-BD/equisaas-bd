import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-border/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/90 text-primary-foreground shadow-lg shadow-primary/10 backdrop-blur-md hover:bg-primary/95",
        secondary: "border-secondary/20 bg-secondary/10 text-secondary backdrop-blur-md hover:bg-secondary/15",
        destructive: "border-rose-500/20 bg-rose-500/10 text-rose-700 backdrop-blur-md hover:bg-rose-500/15 dark:text-rose-300",
        outline: "border-border/60 bg-background/40 text-foreground backdrop-blur-md",
        coop: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 backdrop-blur-md hover:bg-emerald-500/15 dark:text-emerald-300",
        brand: "border-cyan-500/20 bg-cyan-500/10 text-cyan-700 backdrop-blur-md hover:bg-cyan-500/15 dark:text-cyan-300",
        soft: "border-primary/15 bg-primary/8 text-primary backdrop-blur-md hover:bg-primary/12",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
