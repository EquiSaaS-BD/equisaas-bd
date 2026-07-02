import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase-client";

const cleanText = (value) => String(value || "").trim();

export async function fetchFounderSpotlightGalleryItems(limitCount = 8) {
  const snap = await getDocs(
    query(
      collection(db, "founderSpotlightGalleryItems"),
      orderBy("sortOrder", "asc"),
      limit(Math.max(1, Number(limitCount) || 8)),
    ),
  );

  return snap.docs.map((docSnap) => {
    const data = docSnap.data() || {};
    return {
      id: docSnap.id,
      title: cleanText(data.title),
      titleBn: cleanText(data.titleBn),
      notice: cleanText(data.notice),
      noticeBn: cleanText(data.noticeBn),
      altText: cleanText(data.altText),
      altTextBn: cleanText(data.altTextBn),
      imageDataUrl: cleanText(data.imageDataUrl),
      accent: cleanText(data.accent) || "teal",
      featured: Boolean(data.featured),
      sortOrder: Number(data.sortOrder || 0),
      createdAt: data.createdAt || null,
      updatedAt: data.updatedAt || null,
    };
  });
}
