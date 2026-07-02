"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Slider = React.forwardRef(({ className, value, onValueChange, min = 0, max = 100, step = 1, ...props }, ref) => {
  const handleChange = (e) => {
    const val = parseFloat(e.target.value);
    onValueChange?.([val]);
  };

  const val = Array.isArray(value) ? value[0] : value || 0;
  const percentage = ((val - min) / (max - min)) * 100;

  return (
    <div className={cn("relative flex w-full touch-none select-none items-center py-2", className)}>
      <div className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/10">
        <div 
          className="absolute h-full bg-primary transition-all" 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={val}
        onChange={handleChange}
        className="absolute inset-0 w-full h-1.5 opacity-0 cursor-grab active:cursor-grabbing"
        ref={ref}
        {...props}
      />
      <div 
        className="pointer-events-none absolute h-4 w-4 rounded-full border border-primary/50 bg-background shadow-lg transition-all"
        style={{ left: `calc(${percentage}% - 8px)` }}
      />
    </div>
  );
});
Slider.displayName = "Slider";

export { Slider };
