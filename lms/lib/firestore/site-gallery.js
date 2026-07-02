"use client";

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";

const GALLERY_COLLECTION = "founderSpotlightGalleryItems";
const GALLERY_ACCENTS = new Set(["teal", "blue", "gold"]);

const cleanText = (value) => String(value || "").trim();

const requireText = (value, message) => {
  const nextValue = cleanText(value);
  if (!nextValue) {
    throw new Error(message);
  }
  return nextValue;
};

const getActorId = (actor) => actor?.uid || actor?.user?.uid || "";
const getActorRole = (actor) => actor?.role || actor?.user?.role || "";

const assertSuperAdminActor = (actor, message = "Only the highest access role can do this action.") => {
  const actorId = getActorId(actor);
  const actorRole = getActorRole(actor);
  if (!actorId || actorRole !== "super_admin") {
    throw new Error(message);
  }
  return { actorId, actorRole };
};

const sanitizeSortOrder = (value, fallback = 0) => {
  const nextValue = Number(value);
  if (!Number.isFinite(nextValue)) return fallback;
  return Math.max(0, Math.round(nextValue));
};

const sanitizeAccent = (value) => {
  const nextValue = cleanText(value).toLowerCase();
  return GALLERY_ACCENTS.has(nextValue) ? nextValue : "teal";
};

const sanitizeDataUrl = (value) => {
  const nextValue = cleanText(value);
  if (!nextValue.startsWith("data:image/")) {
    throw new Error("Upload a valid image before saving.");
  }
  if (nextValue.length > 450_000) {
    throw new Error("Image is still too large after optimization. Please use a smaller image.");
  }
  return nextValue;
};

const mapGalleryDoc = (docSnap) => {
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
    accent: sanitizeAccent(data.accent),
    featured: Boolean(data.featured),
    sortOrder: sanitizeSortOrder(data.sortOrder),
    createdAt: data.createdAt || null,
    updatedAt: data.updatedAt || null,
  };
};

const buildAuditLogPayload = ({
  actorId,
  actorRole,
  action,
  entityId,
  label,
  summary,
}) => ({
  actorId,
  actorRole,
  action,
  entityType: "founder_spotlight_gallery",
  entityId,
  departmentId: "public_site",
  label: cleanText(label),
  summary: cleanText(summary),
  restoreEntryId: "",
  counts: {},
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});

export const getFounderSpotlightGalleryItemRef = (itemId = "") =>
  itemId ? doc(db, GALLERY_COLLECTION, itemId) : doc(collection(db, GALLERY_COLLECTION));

export async function fetchFounderSpotlightGalleryItems(limitCount = 8) {
  const galleryQuery = query(
    collection(db, GALLERY_COLLECTION),
    orderBy("sortOrder", "asc"),
    limit(Math.max(1, Number(limitCount) || 8)),
  );
  const snap = await getDocs(galleryQuery);
  return snap.docs.map(mapGalleryDoc);
}

export async function saveFounderSpotlightGalleryItem({ actor, itemId = "", values }) {
  const { actorId, actorRole } = assertSuperAdminActor(actor);
  const title = requireText(values?.title, "Enter an English gallery title.");
  const titleBn = cleanText(values?.titleBn);
  const altText = cleanText(values?.altText) || title;
  const altTextBn = cleanText(values?.altTextBn) || titleBn || title;
  const imageDataUrl = sanitizeDataUrl(values?.imageDataUrl);
  const payload = {
    title,
    titleBn,
    notice: cleanText(values?.notice),
    noticeBn: cleanText(values?.noticeBn),
    altText,
    altTextBn,
    imageDataUrl,
    accent: sanitizeAccent(values?.accent),
    featured: Boolean(values?.featured),
    sortOrder: sanitizeSortOrder(values?.sortOrder),
    updatedAt: serverTimestamp(),
    updatedBy: actorId,
  };

  const targetRef = getFounderSpotlightGalleryItemRef(itemId);
  const existingSnap = itemId ? await getDoc(targetRef) : null;
  const isNew = !existingSnap || !existingSnap.exists();
  const batch = writeBatch(db);

  batch.set(
    targetRef,
    isNew
      ? {
          ...payload,
          createdAt: serverTimestamp(),
          createdBy: actorId,
        }
      : payload,
    { merge: true },
  );

  batch.set(
    doc(collection(db, "adminAuditLogs")),
    buildAuditLogPayload({
      actorId,
      actorRole,
      action: isNew ? "gallery_item_created" : "gallery_item_updated",
      entityId: targetRef.id,
      label: title,
      summary: isNew
        ? "Founder spotlight gallery item created from the super admin panel."
        : "Founder spotlight gallery item updated from the super admin panel.",
    }),
  );

  await batch.commit();
  const savedSnap = await getDoc(targetRef);
  return mapGalleryDoc(savedSnap);
}

export async function deleteFounderSpotlightGalleryItem({ actor, itemId }) {
  const { actorId, actorRole } = assertSuperAdminActor(actor);
  const nextItemId = requireText(itemId, "Choose a gallery item first.");
  const targetRef = getFounderSpotlightGalleryItemRef(nextItemId);
  const existingSnap = await getDoc(targetRef);

  if (!existingSnap.exists()) {
    throw new Error("This gallery item no longer exists.");
  }

  const existingItem = mapGalleryDoc(existingSnap);
  const batch = writeBatch(db);
  batch.delete(targetRef);
  batch.set(
    doc(collection(db, "adminAuditLogs")),
    buildAuditLogPayload({
      actorId,
      actorRole,
      action: "gallery_item_deleted",
      entityId: nextItemId,
      label: existingItem.title,
      summary: "Founder spotlight gallery item removed from the super admin panel.",
    }),
  );
  await batch.commit();
}
