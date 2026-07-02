"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Save, Sparkles, Trash2 } from "lucide-react";

import { useLocale } from "@/components/providers/locale-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteFounderSpotlightGalleryItem,
  fetchFounderSpotlightGalleryItems,
  saveFounderSpotlightGalleryItem,
} from "@/lib/firestore/site-gallery";

const INITIAL_FORM = {
  itemId: "",
  title: "",
  titleBn: "",
  notice: "",
  noticeBn: "",
  altText: "",
  altTextBn: "",
  accent: "teal",
  featured: false,
  sortOrder: "0",
  imageDataUrl: "",
};

const MAX_ITEMS = 8;

import imageCompression from "browser-image-compression";

const toDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to read the selected image."));
    reader.readAsDataURL(file);
  });

async function optimizeImageToDataUrl(file) {
  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1400,
    useWebWorker: true,
    fileType: "image/webp",
    initialQuality: 0.85
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return await toDataUrl(compressedFile);
  } catch (error) {
    throw new Error("Image optimization failed: " + error.message);
  }
}

const mapItemToForm = (item) => ({
  itemId: item?.id || "",
  title: item?.title || "",
  titleBn: item?.titleBn || "",
  notice: item?.notice || "",
  noticeBn: item?.noticeBn || "",
  altText: item?.altText || "",
  altTextBn: item?.altTextBn || "",
  accent: item?.accent || "teal",
  featured: Boolean(item?.featured),
  sortOrder: String(item?.sortOrder ?? 0),
  imageDataUrl: item?.imageDataUrl || "",
});

export function FounderGalleryPanel({ actor }) {
  const { copy } = useLocale();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [form, setForm] = useState(INITIAL_FORM);
  const [selectedFileName, setSelectedFileName] = useState("");

  const hasCapacity = items.length < MAX_ITEMS || Boolean(form.itemId);
  const currentPreview = form.imageDataUrl || "";
  const sortedItems = useMemo(
    () => [...items].sort((left, right) => {
      if (Boolean(left.featured) !== Boolean(right.featured)) {
        return left.featured ? -1 : 1;
      }
      return Number(left.sortOrder || 0) - Number(right.sortOrder || 0);
    }),
    [items],
  );

  const loadItems = async () => {
    const nextItems = await fetchFounderSpotlightGalleryItems(MAX_ITEMS);
    setItems(nextItems);
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    loadItems()
      .then(() => {
        if (!mounted) return;
        setLoading(false);
      })
      .catch((error) => {
        if (!mounted) return;
        setMessage({ type: "error", text: error.message || copy("Gallery could not be loaded.", "গ্যালারি লোড করা যায়নি।") });
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [copy]);

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setSelectedFileName("");
  };

  const handleEdit = (item) => {
    setForm(mapItemToForm(item));
    setSelectedFileName("");
  };

  const handleImageSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setMessage({ type: "", text: "" });
    setSaving(true);
    try {
      const optimizedDataUrl = await optimizeImageToDataUrl(file);
      setForm((current) => ({ ...current, imageDataUrl: optimizedDataUrl }));
      setSelectedFileName(file.name);
      setMessage({
        type: "success",
        text: copy("Image optimized and ready to save.", "ছবিটি optimize করা হয়েছে, এখন save করতে পারবেন।"),
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || copy("Image could not be prepared.", "ছবিটি প্রস্তুত করা যায়নি।"),
      });
    } finally {
      setSaving(false);
      event.target.value = "";
    }
  };

  const handleSave = async () => {
    if (!hasCapacity) {
      setMessage({
        type: "error",
        text: copy("Remove one item first. This gallery is limited to eight premium visuals.", "আগে একটি item remove করুন। এই gallery সর্বোচ্চ আটটি premium visual রাখবে।"),
      });
      return;
    }

    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const savedItem = await saveFounderSpotlightGalleryItem({
        actor,
        itemId: form.itemId,
        values: form,
      });
      await loadItems();
      setForm(mapItemToForm(savedItem));
      setSelectedFileName("");
      setMessage({
        type: "success",
        text: form.itemId
          ? copy("Gallery item updated successfully.", "গ্যালারি item সফলভাবে আপডেট হয়েছে।")
          : copy("Gallery item published successfully.", "গ্যালারি item সফলভাবে publish হয়েছে।"),
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || copy("Gallery item could not be saved.", "গ্যালারি item save করা যায়নি।"),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (itemId) => {
    if (!itemId) return;
    if (typeof window !== "undefined" && !window.confirm(copy("Remove this gallery visual from the homepage?", "এই gallery visual homepage থেকে remove করতে চান?"))) {
      return;
    }

    setRemovingId(itemId);
    setMessage({ type: "", text: "" });
    try {
      await deleteFounderSpotlightGalleryItem({ actor, itemId });
      await loadItems();
      if (form.itemId === itemId) {
        resetForm();
      }
      setMessage({
        type: "success",
        text: copy("Gallery item removed successfully.", "গ্যালারি item সফলভাবে remove হয়েছে।"),
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || copy("Gallery item could not be removed.", "গ্যালারি item remove করা যায়নি।"),
      });
    } finally {
      setRemovingId("");
    }
  };

  const handleReorder = async (itemId, direction) => {
    const currentIndex = sortedItems.findIndex((item) => item.id === itemId);
    const targetIndex = currentIndex + direction;
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= sortedItems.length) return;

    const reordered = [...sortedItems];
    const [moving] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, moving);

    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      for (let index = 0; index < reordered.length; index += 1) {
        const item = reordered[index];
        await saveFounderSpotlightGalleryItem({
          actor,
          itemId: item.id,
          values: {
            ...item,
            sortOrder: index,
          },
        });
      }
      await loadItems();
      setMessage({
        type: "success",
        text: copy("Gallery order updated successfully.", "গ্যালারি order সফলভাবে আপডেট হয়েছে।"),
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || copy("Gallery order could not be updated.", "গ্যালারি order আপডেট করা যায়নি।"),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
      <Card className="rounded-[1.75rem] border border-border/50 bg-background/85">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="subtle" className="rounded-full px-4 py-1.5 text-sm">
              {copy("Founder spotlight gallery", "Founder spotlight gallery")}
            </Badge>
            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
              {items.length}/{MAX_ITEMS}
            </Badge>
            {form.featured ? (
              <Badge variant="outline" className="rounded-full border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
                {copy("Featured", "Featured")}
              </Badge>
            ) : null}
          </div>
          <CardTitle>{copy("Control the premium gallery area from here", "এই জায়গা থেকে premium gallery area control করুন")}</CardTitle>
          <CardDescription>
            {copy(
              "Upload visuals, add short notices, and decide the display order that appears in the founder spotlight section on the public homepage.",
              "Visual upload করুন, short notice দিন, আর public homepage-এর founder spotlight section-এ কোন order-এ দেখাবে তা ঠিক করুন।",
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message.text ? (
            <Alert variant={message.type === "error" ? "destructive" : "default"}>
              <AlertTitle>{message.type === "error" ? copy("Action failed", "অ্যাকশন ব্যর্থ") : copy("Saved", "সংরক্ষিত")}</AlertTitle>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="gallery-title-en">{copy("Title (English)", "Title (English)")}</Label>
              <Input
                id="gallery-title-en"
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                placeholder={copy("Workshop update", "Workshop update")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gallery-title-bn">{copy("Title (বাংলা)", "Title (বাংলা)")}</Label>
              <Input
                id="gallery-title-bn"
                value={form.titleBn}
                onChange={(event) => setForm((current) => ({ ...current, titleBn: event.target.value }))}
                placeholder={copy("Workshop update", "ওয়ার্কশপ আপডেট")}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="gallery-notice-en">{copy("Notice (English)", "Notice (English)")}</Label>
              <Textarea
                id="gallery-notice-en"
                className="min-h-[110px]"
                value={form.notice}
                onChange={(event) => setForm((current) => ({ ...current, notice: event.target.value }))}
                placeholder={copy("Add a short update that should appear over the image.", "ছবির উপর দেখানোর জন্য short update লিখুন।")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gallery-notice-bn">{copy("Notice (বাংলা)", "Notice (বাংলা)")}</Label>
              <Textarea
                id="gallery-notice-bn"
                className="min-h-[110px]"
                value={form.noticeBn}
                onChange={(event) => setForm((current) => ({ ...current, noticeBn: event.target.value }))}
                placeholder={copy("Add the Bangla version of the notice.", "নোটিসের বাংলা ভার্সন লিখুন।")}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="gallery-alt-en">{copy("Image alt text (English)", "Image alt text (English)")}</Label>
              <Input
                id="gallery-alt-en"
                value={form.altText}
                onChange={(event) => setForm((current) => ({ ...current, altText: event.target.value }))}
                placeholder={copy("Founder with contributors after workshop", "Founder with contributors after workshop")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gallery-alt-bn">{copy("Image alt text (বাংলা)", "Image alt text (বাংলা)")}</Label>
              <Input
                id="gallery-alt-bn"
                value={form.altTextBn}
                onChange={(event) => setForm((current) => ({ ...current, altTextBn: event.target.value }))}
                placeholder={copy("Founder with contributors after workshop", "ওয়ার্কশপের পর ফাউন্ডার ও কন্ট্রিবিউটর")}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[0.6fr_0.4fr]">
            <div className="space-y-2">
              <Label htmlFor="gallery-image-upload">{copy("Image upload", "ছবি আপলোড")}</Label>
              <Input id="gallery-image-upload" type="file" accept="image/*" onChange={handleImageSelect} />
              <p className="text-xs leading-5 text-muted-foreground">
                {copy(
                  "The image will be optimized automatically before it is stored in Firebase. Use landscape or square visuals for the best premium result.",
                  "Firebase-এ save করার আগে ছবিটি স্বয়ংক্রিয়ভাবে optimize হবে। Landscape বা square visual দিলে premium result সবচেয়ে ভালো হবে।",
                )}
              </p>
              {selectedFileName ? (
                <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
                  {selectedFileName}
                </Badge>
              ) : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
              <div className="space-y-3 rounded-[1.25rem] border border-border/60 bg-background/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{copy("Spotlight priority", "Spotlight priority")}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {copy(
                        "Mark one image as featured if it should lead the founder spotlight first.",
                        "কোনো একটি image-কে featured করলে founder spotlight-এ সেটি আগে দেখানো হবে।",
                      )}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant={form.featured ? "default" : "outline"}
                    className="rounded-full"
                    onClick={() => setForm((current) => ({ ...current, featured: !current.featured }))}
                  >
                    {form.featured ? copy("Featured", "Featured") : copy("Mark featured", "Featured করুন")}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{copy("Accent style", "Accent style")}</Label>
                <Select value={form.accent} onValueChange={(value) => setForm((current) => ({ ...current, accent: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teal">{copy("Teal glass", "Teal glass")}</SelectItem>
                    <SelectItem value="blue">{copy("Blue ambient", "Blue ambient")}</SelectItem>
                    <SelectItem value="gold">{copy("Gold premium", "Gold premium")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gallery-sort-order">{copy("Sort order", "Sort order")}</Label>
                <Input
                  id="gallery-sort-order"
                  type="number"
                  min="0"
                  value={form.sortOrder}
                  onChange={(event) => setForm((current) => ({ ...current, sortOrder: event.target.value }))}
                />
              </div>
            </div>
          </div>

          {currentPreview ? (
            <div className="overflow-hidden rounded-[1.5rem] border border-border/60 bg-card/70 p-3">
              <div className="relative overflow-hidden rounded-[1.25rem]">
                <img
                  src={currentPreview}
                  alt={form.altText || form.title || "Founder gallery preview"}
                  className="h-[240px] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent" />
                <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-3">
                  <Badge className="rounded-full border border-white/15 bg-white/12 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-xl shadow-none">
                    {form.featured ? copy("Featured visual", "Featured visual") : copy("Homepage visual", "Homepage visual")}
                  </Badge>
                  <Badge variant="outline" className="rounded-full border-white/20 bg-white/10 px-3 py-1 text-[11px] text-white">
                    {form.accent}
                  </Badge>
                </div>
                <div className="absolute inset-x-4 bottom-4 rounded-[1.2rem] border border-white/15 bg-white/12 p-4 text-white backdrop-blur-xl">
                  <p className="text-base font-black tracking-tight">{form.title || copy("Preview title", "Preview title")}</p>
                  {(form.notice || form.noticeBn) ? (
                    <p className="mt-2 text-sm leading-6 text-white/85">{form.notice || form.noticeBn}</p>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSave} disabled={saving || !form.imageDataUrl || !form.title}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {form.itemId ? copy("Update gallery item", "গ্যালারি item আপডেট করুন") : copy("Publish gallery item", "গ্যালারি item publish করুন")}
            </Button>
            <Button variant="outline" onClick={resetForm} disabled={saving}>
              {copy("Reset form", "ফর্ম রিসেট করুন")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[1.75rem] border border-border/50 bg-background/85">
        <CardHeader>
          <CardTitle>{copy("Current homepage gallery items", "বর্তমান homepage gallery item")}</CardTitle>
          <CardDescription>
            {copy(
              "Click any item to edit it, move it up or down to reorder, or remove it from the founder spotlight instantly.",
              "যেকোনো item edit করতে ক্লিক করুন, up/down দিয়ে reorder করুন, অথবা founder spotlight থেকে remove করুন।",
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="space-y-3" aria-busy="true">
              <Skeleton className="h-28 w-full rounded-3xl" />
              <Skeleton className="h-28 w-full rounded-3xl" />
              <Skeleton className="h-28 w-full rounded-3xl" />
            </div>
          ) : null}

          {!loading && !sortedItems.length ? (
            <Alert>
              <Sparkles className="h-4 w-4" />
              <AlertTitle>{copy("No gallery items yet", "এখনও কোনো gallery item নেই")}</AlertTitle>
              <AlertDescription>
                {copy(
                  "Upload the first founder, workshop, or community visual here. Approved visuals will appear on the public homepage gallery.",
                  "এখানে প্রথম founder, workshop, বা community visual upload করুন। Approved visual public homepage gallery-তে দেখা যাবে।",
                )}
              </AlertDescription>
            </Alert>
          ) : null}

          {!loading
            ? sortedItems.map((item, index) => (
                <div key={item.id} className="overflow-hidden rounded-[1.5rem] border border-border/60 bg-card/70">
                  <div className="grid gap-0 sm:grid-cols-[140px_minmax(0,1fr)]">
                    <div className="h-full min-h-[140px] overflow-hidden">
                      <img src={item.imageDataUrl} alt={item.title || "Founder gallery item"} className="h-full w-full object-cover" />
                    </div>
                    <div className="space-y-4 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="subtle" className="rounded-full px-3 py-1 text-xs">
                              #{index + 1}
                            </Badge>
                            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
                              {item.accent}
                            </Badge>
                            {item.featured ? (
                              <Badge variant="outline" className="rounded-full border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
                                {copy("Featured", "Featured")}
                              </Badge>
                            ) : null}
                          </div>
                          <p className="mt-3 text-lg font-black tracking-tight">{item.title}</p>
                          {item.titleBn ? <p className="mt-1 text-sm font-medium text-muted-foreground">{item.titleBn}</p> : null}
                          {item.notice || item.noticeBn ? (
                            <p className="mt-3 text-sm leading-6 text-muted-foreground">
                              {item.notice || item.noticeBn}
                            </p>
                          ) : null}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="icon" disabled={saving || index === 0} onClick={() => handleReorder(item.id, -1)}>
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" disabled={saving || index === sortedItems.length - 1} onClick={() => handleReorder(item.id, 1)}>
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" onClick={() => handleEdit(item)} disabled={saving}>
                            <ImagePlus className="h-4 w-4" />
                            {copy("Edit", "এডিট")}
                          </Button>
                          <Button variant="destructive" onClick={() => handleRemove(item.id)} disabled={removingId === item.id}>
                            {removingId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            {copy("Remove", "রিমুভ")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : null}
        </CardContent>
      </Card>
    </div>
  );
}
