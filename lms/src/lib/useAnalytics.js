/**
 * useAnalytics.js
 * Thin wrapper around Firebase Analytics.
 * Provides auto-safe calls that silently no-op when Analytics
 * is unavailable (e.g., ad-blockers, unsupported browsers).
 */
import { useEffect } from "react";
import { getAnalytics, logEvent, isSupported } from "firebase/analytics";

let _analytics = null;

/**
 * Call once after firebase/app is initialized to wire up Analytics.
 * @param {import("firebase/app").FirebaseApp} app
 */
export function initAnalytics(app) {
  isSupported().then((ok) => {
    if (ok && app) _analytics = getAnalytics(app);
  });
}

/**
 * Log a Firebase Analytics event safely.
 * @param {string} eventName
 * @param {object} params
 */
export function trackEvent(eventName, params = {}) {
  try {
    if (_analytics) logEvent(_analytics, eventName, params);
  } catch (e) {
    // silently ignore ;  never break the app
  }
}

/**
 * React hook ;  tracks a "page_view" event whenever `viewName` changes.
 * Maps internal view IDs to human-readable Analytics screen names.
 * @param {string} viewName ;  current view id, e.g. "dashboard"
 */
export function usePageView(viewName) {
  const SCREEN_NAMES = {
    dashboard:  "Dashboard",
    courses:    "Courses & Lectures",
    manual:     "Getting Started Guide",
    roadmap:    "Study Roadmap",
    resources:  "Resource Library",
    community:  "Squad Workspace",
    coop:       "Co-op Hub",
    admin:      "Admin Panel",
  };

  useEffect(() => {
    const screenName = SCREEN_NAMES[viewName] || viewName;
    trackEvent("page_view", {
      page_title:    screenName,
      page_location: window.location.href,
      view_name:     viewName,
    });
  }, [viewName]);
}
