"use client";

import { useEffect, useState } from "react";
import { CopyPlus, Palette, Trash2 } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { fetchCertificateTemplates, saveCertificateTemplate, deleteCertificateTemplate } from "@/lib/firestore/lms";

const THEME_OPTIONS = [
  { value: "classic", en: "Classic Brand (Default)", bn: "ক্লাসিক ব্র্যান্ড (ডিফল্ট)" },
  { value: "dark", en: "Modern Dark", bn: "মডার্ন ডার্ক" },
  { value: "minimalist", en: "Minimalist Light", bn: "মিনিমালিস্ট লাইট" },
];

const emptyMessage = { type: "", text: "" };

const buildDefaultForm = () => ({
  templateName: "",
  certificateTitle: "Certificate of Completion",
  subjectTitle: "",
  achievementSummary: "",
  signerName: "Sandipta Karmakar Barno",
  signerTitle: "Director of HR & Operations",
  themeStyle: "classic",
  labelOverrides: {
    department: "",
    issueDate: "",
  },
  customColors: {
    bgTheme: "",
    cardBg: "",
    textMain: "",
    textPrimary: "",
    borderOuter: "",
  },
});

export function CertificateTemplateBuilder({ actor }) {
  const { copy } = useLocale();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(emptyMessage);
  const [form, setForm] = useState(buildDefaultForm());
  const [editingId, setEditingId] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchCertificateTemplates();
      setTemplates(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      templateName: item.templateName || "",
      certificateTitle: item.certificateTitle || "",
      subjectTitle: item.subjectTitle || "",
      achievementSummary: item.achievementSummary || "",
      signerName: item.signerName || "",
      signerTitle: item.signerTitle || "",
      themeStyle: item.themeStyle || "classic",
      labelOverrides: {
        department: item.labelOverrides?.department || "",
        issueDate: item.labelOverrides?.issueDate || "",
      },
      customColors: {
        bgTheme: item.customColors?.bgTheme || "",
        cardBg: item.customColors?.cardBg || "",
        textMain: item.customColors?.textMain || "",
        textPrimary: item.customColors?.textPrimary || "",
        borderOuter: item.customColors?.borderOuter || "",
      },
    });
    setMessage(emptyMessage);
  };

  const handleReset = () => {
    setEditingId("");
    setForm(buildDefaultForm());
    setMessage(emptyMessage);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(emptyMessage);
    try {
      await saveCertificateTemplate({ actor, templateId: editingId, payload: form });
      await loadData();
      setMessage({ type: "success", text: copy("Template saved successfully.", "টেমপ্লেট সফলভাবে সংরক্ষণ করা হয়েছে।") });
      if (!editingId) handleReset();
    } catch (error) {
      setMessage({ type: "error", text: error.message || copy("Could not save.", "সংরক্ষণ করা যায়নি।") });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(copy("Delete this template permanently?", "এই টেমপ্লেটটি স্থায়ীভাবে মুছে ফেলতে চান?"))) return;
    try {
      await deleteCertificateTemplate({ actor, templateId: id });
      await loadData();
      if (editingId === id) handleReset();
      setMessage({ type: "success", text: copy("Template deleted.", "টেমপ্লেট মুছে ফেলা হয়েছে।") });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <Card className="rounded-[1.75rem] border border-border/50 bg-background/85">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <CardTitle>{copy("Design template", "ডিজাইন টেমপ্লেট")}</CardTitle>
          </div>
          <CardDescription>
            {copy("Create reusable certification rules (visual styles, predefined text, and labels).", "Reusable certification rule তৈরি করুন, যেখানে visual style, predefined text, এবং label preset রাখা যাবে।")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{copy("Template Reference Name", "টেমপ্লেট রেফারেন্স নাম")}</Label>
            <Input value={form.templateName} onChange={(e) => setForm((s) => ({ ...s, templateName: e.target.value }))} placeholder="e.g. Hackathon Excellence" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{copy("Visual Theme", "ভিজ্যুয়াল থিম")}</Label>
              <Select value={form.themeStyle} onValueChange={(value) => setForm((s) => ({ ...s, themeStyle: value }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {THEME_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{copy(opt.en, opt.bn)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{copy("Main Certificate Title", "মূল সার্টিফিকেট শিরোনাম")}</Label>
              <Input value={form.certificateTitle} onChange={(e) => setForm((s) => ({ ...s, certificateTitle: e.target.value }))} />
            </div>
          </div>

          <div className="space-y-4 rounded-xl border bg-muted/20 p-4">
            <h4 className="text-sm font-semibold">{copy("Custom Brand Colors (Overrides Theme)", "কাস্টম ব্র্যান্ড কালার (থিমকে ওভাররাইড করবে)")}</h4>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">{copy("Main Background", "মূল ব্যাকগ্রাউন্ড")}</Label>
                <div className="flex gap-2">
                  <Input type="color" className="h-9 w-12 p-1" value={form.customColors.bgTheme || "#ffffff"} onChange={(e) => setForm((s) => ({ ...s, customColors: { ...s.customColors, bgTheme: e.target.value } }))} />
                  <Input value={form.customColors.bgTheme} onChange={(e) => setForm((s) => ({ ...s, customColors: { ...s.customColors, bgTheme: e.target.value } }))} placeholder="#HEX" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">{copy("Inner Card Background", "ইনার কার্ড ব্যাকগ্রাউন্ড")}</Label>
                <div className="flex gap-2">
                  <Input type="color" className="h-9 w-12 p-1" value={form.customColors.cardBg || "#ffffff"} onChange={(e) => setForm((s) => ({ ...s, customColors: { ...s.customColors, cardBg: e.target.value } }))} />
                  <Input value={form.customColors.cardBg} onChange={(e) => setForm((s) => ({ ...s, customColors: { ...s.customColors, cardBg: e.target.value } }))} placeholder="#HEX" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">{copy("Outer Border Color", "বাইরের বর্ডার রং")}</Label>
                <div className="flex gap-2">
                  <Input type="color" className="h-9 w-12 p-1" value={form.customColors.borderOuter || "#e2e8f0"} onChange={(e) => setForm((s) => ({ ...s, customColors: { ...s.customColors, borderOuter: e.target.value } }))} />
                  <Input value={form.customColors.borderOuter} onChange={(e) => setForm((s) => ({ ...s, customColors: { ...s.customColors, borderOuter: e.target.value } }))} placeholder="#HEX" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">{copy("Main Font Color", "মূল ফন্ট রং")}</Label>
                <div className="flex gap-2">
                  <Input type="color" className="h-9 w-12 p-1" value={form.customColors.textMain || "#000000"} onChange={(e) => setForm((s) => ({ ...s, customColors: { ...s.customColors, textMain: e.target.value } }))} />
                  <Input value={form.customColors.textMain} onChange={(e) => setForm((s) => ({ ...s, customColors: { ...s.customColors, textMain: e.target.value } }))} placeholder="#HEX" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">{copy("Accent Font Color", "অ্যাকসেন্ট ফন্ট রং")}</Label>
                <div className="flex gap-2">
                  <Input type="color" className="h-9 w-12 p-1" value={form.customColors.textPrimary || "#0f4c81"} onChange={(e) => setForm((s) => ({ ...s, customColors: { ...s.customColors, textPrimary: e.target.value } }))} />
                  <Input value={form.customColors.textPrimary} onChange={(e) => setForm((s) => ({ ...s, customColors: { ...s.customColors, textPrimary: e.target.value } }))} placeholder="#HEX" />
                </div>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground">{copy("Leave empty to use default standard values of the selected Visual Theme. Overrides HTML Hex values locally and inside the public verification link.", "ফাঁকা রাখলে নির্বাচিত visual theme-এর default মান ব্যবহার হবে। Hex color দিলে তা local preview এবং public verification link-এও প্রয়োগ হবে।")}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{copy("Override 'Department' Label", "'Department' label ওভাররাইড")}</Label>
              <Input value={form.labelOverrides.department} onChange={(e) => setForm((s) => ({ ...s, labelOverrides: { ...s.labelOverrides, department: e.target.value } }))} placeholder="e.g. TRACK or TEAM" />
            </div>
            <div className="space-y-2">
              <Label>{copy("Override 'Subject' Default", "'Subject' ডিফল্ট ওভাররাইড")}</Label>
              <Input value={form.subjectTitle} onChange={(e) => setForm((s) => ({ ...s, subjectTitle: e.target.value }))} placeholder="e.g. Web Security Module" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{copy("Achievement Summary Preset", "Achievement summary preset")}</Label>
            <Textarea className="min-h-24" value={form.achievementSummary} onChange={(e) => setForm((s) => ({ ...s, achievementSummary: e.target.value }))} />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button disabled={saving} onClick={handleSave}>
              <CopyPlus className="mr-2 h-4 w-4" />
              {editingId ? copy("Update Template", "টেমপ্লেট আপডেট করুন") : copy("Create Template", "টেমপ্লেট তৈরি করুন")}
            </Button>
            {editingId && <Button variant="outline" onClick={handleReset}>{copy("Cancel", "বাতিল")}</Button>}
          </div>

          {message.text && (
            <Alert variant={message.type === "error" ? "destructive" : "default"}>
              <AlertTitle>{message.type === "error" ? copy("Error", "ত্রুটি") : copy("Success", "সফল")}</AlertTitle>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-[1.75rem] border border-border/50 bg-background/85">
        <CardHeader>
          <CardTitle>{copy("Available Templates", "উপলভ্য টেমপ্লেট")}</CardTitle>
          <CardDescription>
            {copy("Select a template when issuing certificates in the management panel to automatically apply these settings.", "Management panel থেকে certificate issue করার সময় একটি template বেছে নিলে এই settings স্বয়ংক্রিয়ভাবে প্রয়োগ হবে।")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {templates.length === 0 && !loading ? (
              <p className="text-sm text-muted-foreground">{copy("No templates found.", "কোনো টেমপ্লেট পাওয়া যায়নি।")}</p>
            ) : (
              templates.map((tpl) => (
                <div key={tpl.id} className="rounded-2xl border bg-background/80 p-4 flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-semibold">{tpl.templateName}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{tpl.certificateTitle} ⬢ {tpl.themeStyle}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(tpl)}>{copy("Edit", "এডিট")}</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(tpl.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

