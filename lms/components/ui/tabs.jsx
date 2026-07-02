"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
import { useUISound } from "@/hooks/use-ui-sound";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn("inline-flex w-full flex-wrap items-stretch justify-center gap-1.5 rounded-[1.35rem] border border-border/60 bg-muted/70 p-1.5 text-muted-foreground", className)}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef(({ className, onMouseEnter, onClick, ...props }, ref) => {
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
    <TabsPrimitive.Trigger
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      className={cn(
        "inline-flex min-h-10 flex-1 items-center justify-center rounded-[1rem] border border-transparent px-3.5 py-2 text-center text-sm font-medium leading-snug whitespace-normal break-words transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-border/60 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-slate-950/10",
        className,
      )}
      {...props}
    />
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn("mt-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
