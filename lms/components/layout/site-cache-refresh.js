"use client";

import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

async function clearOriginCaches() {
  if (typeof window === "undefined") return;

  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.allSettled(registrations.map((registration) => registration.unregister()));
  }

  if ("caches" in window) {
    const cacheKeys = await window.caches.keys();
    await Promise.allSettled(cacheKeys.map((key) => window.caches.delete(key)));
  }
}

function buildRefreshUrl() {
  const url = new URL(window.location.href);
  url.searchParams.set("__refresh", Date.now().toString());
  return url.toString();
}

export function SiteCacheRefresh({ compact = false }) {
  const { copy } = useLocale();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);

    try {
      await clearOriginCaches();
    } finally {
      window.location.replace(buildRefreshUrl());
    }
  };

  if (compact) {
    return (
      <Button variant="outline" type="button" onClick={handleRefresh} disabled={refreshing}>
        <RotateCcw className="h-4 w-4" />
        {refreshing
          ? copy("Refreshing...", "রিফ্রেশ হচ্ছে...")
          : copy("Clear site cache", "সাইট ক্যাশ ক্লিয়ার")}
      </Button>
    );
  }

  return (
    <Alert className="border-primary/25 bg-primary/5">
      <RotateCcw className="h-4 w-4" />
      <AlertTitle>{copy("Refresh after updates", "আপডেটের পর রিফ্রেশ করুন")}</AlertTitle>
      <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span>
          {copy(
            "Use this button first if the LMS was updated. It clears this site’s cached files and reloads the latest version.",
            "LMS আপডেট হলে আগে এই বাটন ব্যবহার করুন। এটা শুধু এই সাইটের cached file clear করে নতুন version reload করবে।",
          )}
        </span>
        <Button variant="outline" type="button" onClick={handleRefresh} disabled={refreshing}>
          <RotateCcw className="h-4 w-4" />
          {refreshing
            ? copy("Refreshing...", "রিফ্রেশ হচ্ছে...")
            : copy("Clear site cache", "সাইট ক্যাশ ক্লিয়ার")}
        </Button>
      </AlertDescription>
    </Alert>
  );
}
