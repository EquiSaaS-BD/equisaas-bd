import { useEffect, useState } from "react";

import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

const STORAGE_KEY = "equisaas-build-version";
const POLL_INTERVAL_MS = 60000;
const COPY = {
  bn: {
    title: "নতুন আপডেট প্রস্তুত",
    body: "এই ট্যাবে পুরোনো cached version চলছে। refresh করলে নতুন version load হবে।",
    action: "এখনই আপডেট করুন",
    working: "আপডেট হচ্ছে...",
  },
  en: {
    title: "A new version is ready",
    body: "This tab is still using an older cached version. Refresh to load the latest release.",
    action: "Update now",
    working: "Updating...",
  },
};

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
  const response = await fetch(`/version.json?ts=${Date.now()}`, {
    cache: "no-store",
    headers: { "cache-control": "no-cache" },
  });

  if (!response.ok) {
    throw new Error("Could not fetch version");
  }

  const payload = await response.json();
  return String(payload?.version || "").trim();
}

function buildRefreshUrl() {
  const url = new URL(window.location.href);
  url.searchParams.set("__refresh", Date.now().toString());
  return url.toString();
}

export default function LandingUpdateAvailableBanner({ lang = "en" }) {
  const [nextVersion, setNextVersion] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const copy = COPY[lang] || COPY.en;

  useEffect(() => {
    let active = true;

    const checkVersion = async () => {
      try {
        const fetchedVersion = await fetchVersion();
        if (!active || !fetchedVersion) return;

        const currentVersion = window.localStorage.getItem(STORAGE_KEY);
        if (!currentVersion) {
          window.localStorage.setItem(STORAGE_KEY, fetchedVersion);
          return;
        }

        if (currentVersion !== fetchedVersion) {
          setNextVersion(fetchedVersion);
        } else {
          // If storage already matches current fetched version, someone else already updated.
          setNextVersion("");
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
        if (nextVersion && e.newValue === nextVersion) {
          setNextVersion("");
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
  }, [nextVersion]);

  const handleRefresh = async () => {
    if (!nextVersion || refreshing) return;

    setRefreshing(true);
    try {
      // Prevent hanging if service worker unregistration or cache deletion gets stuck
      await Promise.race([
        clearOriginCaches(),
        new Promise((resolve) => setTimeout(resolve, 1500))
      ]);
      window.localStorage.setItem(STORAGE_KEY, nextVersion);
    } catch (error) {
      console.error("Cache clear error:", error);
    } finally {
      const refreshUrl = buildRefreshUrl();
      window.location.assign(refreshUrl);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  if (!nextVersion) return null;

  return (
    <div className="fixed inset-x-4 bottom-[104px] sm:bottom-4 z-[200] mx-auto max-w-2xl rounded-[1.5rem] border border-primary/20 bg-background/96 p-4 shadow-[0_24px_64px_-28px_rgba(15,23,42,0.45)] backdrop-blur-xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">{copy.title}</p>
          <p className="text-sm text-muted-foreground">{copy.body}</p>
        </div>
        <Button onClick={handleRefresh} className="shrink-0">
          <RefreshCw className="h-4 w-4" />
          {refreshing ? copy.working : copy.action}
        </Button>
      </div>
    </div>
  );
}
