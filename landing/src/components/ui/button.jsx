import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useUISound } from "@/hooks/use-ui-sound";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl border border-border/70 text-center text-sm font-semibold leading-snug whitespace-normal break-words ring-offset-background transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none active:scale-[0.985]",
  {
    variants: {
      variant: {
        default: "border-transparent bg-gradient-to-br from-primary via-primary to-secondary text-primary-foreground shadow-lg shadow-primary/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow-lg shadow-destructive/20 hover:-translate-y-0.5 hover:bg-destructive/92",
        outline: "bg-background/82 text-foreground shadow-sm shadow-slate-950/5 backdrop-blur-sm hover:-translate-y-0.5 hover:border-primary/25 hover:bg-accent/70 hover:shadow-md",
        secondary: "border-secondary/20 bg-secondary/10 text-secondary shadow-sm shadow-secondary/10 hover:-translate-y-0.5 hover:bg-secondary/15",
        ghost: "border-transparent bg-transparent text-foreground shadow-none hover:bg-accent/70 hover:text-accent-foreground",
        link: "border-transparent bg-transparent px-0 text-primary shadow-none hover:text-primary/85 hover:underline",
        coop: "border-transparent bg-gradient-to-br from-coop via-coop to-primary text-coop-foreground shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/25",
        brand: "border-transparent bg-gradient-to-br from-brand via-primary to-secondary text-brand-foreground shadow-lg shadow-cyan-500/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-500/25",
      },
      size: {
        default: "min-h-10 px-4 py-2.5",
        sm: "min-h-9 rounded-lg px-3 py-2 text-xs",
        lg: "min-h-11 rounded-2xl px-6 py-3 text-base",
        xl: "min-h-14 rounded-[1.35rem] px-8 py-3 text-lg font-semibold",
        icon: "h-10 w-10 rounded-xl p-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, onClick, onMouseEnter, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  const { playHover, playClick } = useUISound();

  const handleMouseEnter = (e) => {
    playHover();
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleClick = (e) => {
    playClick();
    if (onClick) onClick(e);
  };

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
