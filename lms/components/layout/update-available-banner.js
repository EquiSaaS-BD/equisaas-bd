"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "equisaas-build-version";
const POLL_INTERVAL_MS = 60000;

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

async function fetchVersion() {
  const versionPath = window.location.pathname.startsWith("/lms") ? "/lms/version.json" : "/version.json";
  const response = await fetch(`${versionPath}?ts=${Date.now()}`, {
    cache: "no-store",
    headers: { "cache-control": "no-cache" },
  });

  if (!response.ok) {
    throw new Error("Could not fetch version");
  }

  const payload = await response.json();
  return {
    version: String(payload?.version || "").trim(),
    builtAt: String(payload?.builtAt || "").trim(),
  };
}

function buildRefreshUrl() {
  const url = new URL(window.location.href);
  url.searchParams.set("__refresh", Date.now().toString());
  return url.toString();
}

export function UpdateAvailableBanner() {
  const { copy } = useLocale();
  const [nextRelease, setNextRelease] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let active = true;

    const checkVersion = async () => {
      try {
        const fetchedRelease = await fetchVersion();
        if (!active || !fetchedRelease?.version) return;

        const currentVersion = window.localStorage.getItem(STORAGE_KEY);
        if (!currentVersion) {
          window.localStorage.setItem(STORAGE_KEY, fetchedRelease.version);
          return;
        }

        if (currentVersion !== fetchedRelease.version) {
          setNextRelease(fetchedRelease);
        } else {
          // If storage already matches current fetched version, someone else already updated.
          setNextRelease(null);
        }
      } catch {
        // Silent on version check failure.
      }
    };

    // Cross-tab synchronization via local storage event
    const handleStorageChange = (e) => {
      if (!active) return;
      if (e.key === STORAGE_KEY && e.newValue) {
        // If another tab updated the current version to match what we thought was 'next',
        // we can hide our own banner.
        if (nextRelease?.version && e.newValue === nextRelease.version) {
          setNextRelease(null);
        }
      }
    };

    checkVersion();
    const timer = window.setInterval(checkVersion, POLL_INTERVAL_MS);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [nextRelease]);

  const handleRefresh = async () => {
    if (!nextRelease?.version || refreshing) return;

    setRefreshing(true);
    try {
      // Prevent hanging if service worker unregistration or cache deletion gets stuck
      await Promise.race([
        clearOriginCaches(),
        new Promise((resolve) => setTimeout(resolve, 1500))
      ]);
      window.localStorage.setItem(STORAGE_KEY, nextRelease.version);
    } catch (error) {
      console.error("Cache clear error:", error);
    } finally {
      const refreshUrl = buildRefreshUrl();
      window.location.assign(refreshUrl);
      setTimeout(() => {
        window.location.reload(true);
      }, 500);
    }
  };

  if (!nextRelease?.version) return null;

  const currentVersion = typeof window !== "undefined"
    ? window.localStorage.getItem(STORAGE_KEY) || copy("Current build", "বর্তমান বিল্ড")
    : copy("Current build", "বর্তমান বিল্ড");

  return (
    <div className="fixed inset-x-4 bottom-4 z-[140] mx-auto max-w-2xl rounded-[1.5rem] border border-primary/20 bg-background/96 p-4 shadow-[0_24px_64px_-28px_rgba(15,23,42,0.45)] backdrop-blur-xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">
            {copy("A new LMS version is ready", "নতুন LMS version প্রস্তুত")}
          </p>
          <p className="text-sm text-muted-foreground">
            {copy(
              "This tab is still running older cached files. Refresh now to load the latest release.",
              "এই ট্যাবে এখনো পুরনো cached file চলছে। এখন refresh করলে latest release load হবে।",
            )}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="rounded-full border border-border/70 bg-background/80 px-3 py-1 text-[11px] font-semibold text-muted-foreground">
              {copy("Current", "বর্তমান")}: {currentVersion}
            </span>
            <span className="rounded-full border border-primary/25 bg-primary/5 px-3 py-1 text-[11px] font-semibold text-primary">
              {copy("Ready", "রেডি")}: {nextRelease.version}
            </span>
          </div>
        </div>
        <Button onClick={handleRefresh} className="shrink-0">
          <RefreshCw className="h-4 w-4" />
          {refreshing ? copy("Updating...", "আপডেট হচ্ছে...") : copy("Update now", "এখনই আপডেট করুন")}
        </Button>
      </div>
    </div>
  );
}
