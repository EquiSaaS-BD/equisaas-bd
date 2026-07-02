"use client";

import { Toaster } from "sonner";
import { useTheme } from "@/components/providers/theme-provider";

export function AppToaster() {
  const { theme } = useTheme();
  return (
    <Toaster
      theme={theme}
      richColors
      closeButton
      position="top-center"
      toastOptions={{
        classNames: {
          toast: "rounded-xl border border-border bg-background text-foreground shadow-lg",
        },
      }}
    />
  );
}
