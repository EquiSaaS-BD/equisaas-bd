import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "shimmer-premium rounded-xl bg-muted/40 border border-border/5",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
