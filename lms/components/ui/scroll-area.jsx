"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function ScrollArea({ className, children, ...props }) {
  return (
    <div
      className={cn("relative overflow-auto scrollbar-thin scrollbar-thumb-primary/20", className)}
      {...props}
    >
      {children}
    </div>
  );
}
