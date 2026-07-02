import { useEffect, useRef, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";

const announcementCacheKey = (uid) =>
  uid ? `eq_dashboard_latest_announcement:${uid}` : "eq_dashboard_latest_announcement";

const parseAnnouncement = (raw) => {
  if (!raw) return null;
  return {
    id: raw.id || "",
    title: raw.title || "",
    desc: raw.desc || raw.content || "",
    timestamp: Number(raw.timestamp || 0),
  };
};

const fromAnnouncementDoc = (docSnap) => {
  if (!docSnap) return null;
  const data = docSnap.data() || {};
  return parseAnnouncement({
    id: docSnap.id,
    title: data.title,
    desc: data.desc || data.content,
    timestamp: data.createdAt?.seconds ? data.createdAt.seconds * 1000 : 0,
  });
};

export default function useDashboardData({ db, user, view, fallbackAnnouncement = null }) {
  const [latestAnnouncement, setLatestAnnouncement] = useState(parseAnnouncement(fallbackAnnouncement));
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    hasFetchedRef.current = false;
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) {
      setLatestAnnouncement(parseAnnouncement(fallbackAnnouncement));
      return;
    }

    const cached = sessionStorage.getItem(announcementCacheKey(user.uid));
    if (!cached) {
      setLatestAnnouncement(parseAnnouncement(fallbackAnnouncement));
      return;
    }

    try {
      setLatestAnnouncement(parseAnnouncement(JSON.parse(cached)));
    } catch (error) {
      console.error("Dashboard announcement cache parse failed:", error);
      setLatestAnnouncement(parseAnnouncement(fallbackAnnouncement));
    }
  }, [fallbackAnnouncement, user?.uid]);

  useEffect(() => {
    if (!db || !user?.uid || view !== "dashboard" || hasFetchedRef.current) return;

    hasFetchedRef.current = true;
    getDocs(query(collection(db, "announcements"), orderBy("createdAt", "desc"), limit(1)))
      .then((snap) => {
        const latest = fromAnnouncementDoc(snap.docs[0]);
        if (!latest) return;
        setLatestAnnouncement(latest);
        sessionStorage.setItem(announcementCacheKey(user.uid), JSON.stringify(latest));
      })
      .catch((error) => {
        console.error("Dashboard announcement bootstrap failed:", error);
        hasFetchedRef.current = false;
      });
  }, [db, user?.uid, view]);

  return { latestAnnouncement };
}
