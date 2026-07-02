import { useEffect, useRef, useState } from "react";

const LAST_LOGIN_KEY = "eq_last_login_at";

const getLoginKey = (uid) => `${LAST_LOGIN_KEY}:${uid}`;

export default function useAnnouncementState({ user, latestAnnouncement }) {
  const [hasUnreadAnnouncements, setHasUnreadAnnouncements] = useState(false);
  /** Previous session open time (ms); updated synchronously before unread compare to avoid a stale first paint. */
  const loginBaselineRef = useRef(0);

  useEffect(() => {
    if (!user?.uid) {
      loginBaselineRef.current = 0;
      setHasUnreadAnnouncements(false);
      return;
    }

    const loginKey = getLoginKey(user.uid);
    const previousLogin = Number(localStorage.getItem(loginKey) || 0);
    loginBaselineRef.current = previousLogin;
    localStorage.setItem(loginKey, String(Date.now()));
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid || !latestAnnouncement?.timestamp) {
      setHasUnreadAnnouncements(false);
      return;
    }

    setHasUnreadAnnouncements(latestAnnouncement.timestamp > loginBaselineRef.current);
  }, [latestAnnouncement?.timestamp, user?.uid]);

  return {
    hasUnreadAnnouncements,
    markAnnouncementsSeen: () => setHasUnreadAnnouncements(false),
  };
}
