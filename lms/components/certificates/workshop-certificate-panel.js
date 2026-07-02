"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Copy, ExternalLink, FileBadge2, FileSignature, ShieldCheck, UsersRound, Video } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyStateCard } from "@/components/ui/empty-state-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { WorkspaceFilterBar } from "@/components/ui/workspace-filter-bar";
import { DatePicker } from "@/components/ui/date-picker";
import { formatDate, formatDateKey } from "@/lib/date";
import { statusLabel, statusVariant } from "@/lib/display";
import {
  fetchCertificateById,
  fetchCertificateTemplates,
  fetchDepartmentCertificates,
  saveCertificate,
  updateCertificateStatus,
} from "@/lib/firestore/lms";
import { buildCertificateVerificationUrl } from "@/lib/urls";

const emptyMessage = { type: "", text: "" };
const DEFAULT_SIGNER_NAME = "Sandipta Karmakar Barno";
const DEFAULT_SIGNER_TITLE = "Director of HR & Operations";
const CERTIFICATE_STATUS_OPTIONS = [
  { value: "draft", en: "Draft", bn: "ড্রাফট" },
  { value: "active", en: "Active", bn: "সক্রিয়" },
  { value: "revoked", en: "Revoked", bn: "বাতিল" },
];

const getTodayDateKey = () => new Date().toISOString().slice(0, 10);
const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
const buildWorkshopCourseId = (title, dateKey) => `workshop:${dateKey || getTodayDateKey()}:${slugify(title) || "online-workshop"}`;
const isWorkshopCertificate = (certificate) =>
  certificate?.certificateKind === "workshop" || String(certificate?.courseId || "").startsWith("workshop:");

const buildDefaultForm = (departmentId) => {
  const today = getTodayDateKey();
  return {
    certificateKind: "workshop",
    recipientLookupId: "",
    templateId: "",
    workshopId: "",
    workshopTitle: "",
    workshopDateKey: today,
    recipientName: "",
    certificateTitle: "Workshop Certificate of Completion",
    subjectTitle: "",
    achievementSummary: "For successfully completing the online workshop and meeting the EquiSaaS BD participation and learning requirements.",
    courseId: "",
    completionDateKey: today,
    issueDateKey: today,
    signerName: DEFAULT_SIGNER_NAME,
    signerTitle: DEFAULT_SIGNER_TITLE,
    status: "draft",
    themeStyle: "classic",
    labelOverrides: { department: "", issueDate: "" },
    customColors: { bgTheme: "", cardBg: "", textMain: "", textPrimary: "", borderOuter: "" },
    departmentId,
  };
};

const buildFormFromCertificate = (certificate) => ({
  ...buildDefaultForm(certificate.departmentId || ""),
  certificateKind: "workshop",
  recipientLookupId: "",
  templateId: certificate.templateId || "",
  workshopId: certificate.workshopId || certificate.courseId || "",
  workshopTitle: certificate.workshopTitle || certificate.subjectTitle || "",
  workshopDateKey: certificate.workshopDateKey || certificate.completionDateKey || getTodayDateKey(),
  recipientName: certificate.recipientName || "",
  certificateTitle: certificate.certificateTitle || "Workshop Certificate of Completion",
  subjectTitle: certificate.subjectTitle || certificate.workshopTitle || "",
  achievementSummary: certificate.achievementSummary || "",
  courseId: certificate.courseId || "",
  completionDateKey: certificate.completionDateKey || getTodayDateKey(),
  issueDateKey: certificate.issueDateKey || getTodayDateKey(),
  signerName: certificate.signerName || DEFAULT_SIGNER_NAME,
  signerTitle: certificate.signerTitle || DEFAULT_SIGNER_TITLE,
  status: certificate.status || "draft",
  themeStyle: certificate.themeStyle || "classic",
  labelOverrides: {
    department: certificate.labelOverrides?.department || "",
    issueDate: certificate.labelOverrides?.issueDate || "",
  },
  customColors: {
    bgTheme: certificate.customColors?.bgTheme || "",
    cardBg: certificate.customColors?.cardBg || "",
    textMain: certificate.customColors?.textMain || "",
    textPrimary: certificate.customColors?.textPrimary || "",
    borderOuter: certificate.customColors?.borderOuter || "",
  },
});

const applyTemplateToForm = (template, currentForm) => ({
  ...currentForm,
  templateId: template?.id || "",
  certificateTitle: template?.certificateTitle || currentForm.certificateTitle || "Workshop Certificate of Completion",
  achievementSummary: template?.achievementSummary || currentForm.achievementSummary,
  signerName: template?.signerName || DEFAULT_SIGNER_NAME,
  signerTitle: template?.signerTitle || DEFAULT_SIGNER_TITLE,
  themeStyle: template?.themeStyle || "classic",
  labelOverrides: {
    department: template?.labelOverrides?.department || "",
    issueDate: template?.labelOverrides?.issueDate || "",
  },
  customColors: {
    bgTheme: template?.customColors?.bgTheme || "",
    cardBg: template?.customColors?.cardBg || "",
    textMain: template?.customColors?.textMain || "",
    textPrimary: template?.customColors?.textPrimary || "",
    borderOuter: template?.customColors?.borderOuter || "",
  },
});

export function WorkshopCertificatePanel({ activeDepartmentId, users, actor, departmentTitle, enabled = true }) {
  const { copy, locale } = useLocale();
  const [certificates, setCertificates] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(emptyMessage);
  const [editingCertificateId, setEditingCertificateId] = useState("");
  const [statusChangingId, setStatusChangingId] = useState("");
  const [form, setForm] = useState(buildDefaultForm(activeDepartmentId));

  const workshopCertificates = useMemo(() => certificates.filter(isWorkshopCertificate), [certificates]);
  const workshopGroups = useMemo(() => {
    const map = new Map();
    workshopCertificates.forEach((certificate) => {
      const key = certificate.workshopId || certificate.courseId || certificate.workshopTitle || certificate.subjectTitle || "workshop";
      const current = map.get(key) || {
        key,
        title: certificate.workshopTitle || certificate.subjectTitle || copy("Untitled workshop", "নামহীন ওয়ার্কশপ"),
        dateKey: certificate.workshopDateKey || certificate.completionDateKey || "",
        total: 0,
        active: 0,
        draft: 0,
        revoked: 0,
      };
      current.total += 1;
      current[certificate.status] = Number(current[certificate.status] || 0) + 1;
      map.set(key, current);
    });
    return [...map.values()].sort((left, right) => String(right.dateKey).localeCompare(String(left.dateKey)));
  }, [copy, workshopCertificates]);
  const readinessChecks = useMemo(
    () => [
      { key: "title", ready: Boolean(form.workshopTitle.trim() || form.subjectTitle.trim()), label: copy("Workshop title is set", "ওয়ার্কশপের শিরোনাম সেট আছে") },
      { key: "recipient", ready: Boolean(form.recipientName.trim()), label: copy("Participant is set", "Participant সেট আছে") },
      { key: "summary", ready: Boolean(form.achievementSummary.trim()), label: copy("Summary is written", "Summary লেখা আছে") },
      { key: "date", ready: Boolean(form.workshopDateKey), label: copy("Workshop date is set", "ওয়ার্কশপের তারিখ সেট আছে") },
    ],
    [copy, form.achievementSummary, form.recipientName, form.subjectTitle, form.workshopDateKey, form.workshopTitle],
  );
  const readyCount = readinessChecks.filter((item) => item.ready).length;

  const loadCertificates = async (nextEditingId = editingCertificateId) => {
    if (!enabled || !activeDepartmentId) {
      setCertificates([]);
      setLoading(false);
      return [];
    }

    setLoading(true);
    try {
      const items = await fetchDepartmentCertificates(activeDepartmentId, 80);
      setCertificates(items);
      if (nextEditingId) {
        const selected = items.find((item) => item.id === nextEditingId);
        if (selected) {
          setEditingCertificateId(selected.id);
          setForm(buildFormFromCertificate(selected));
        }
      }
      return items;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled) return;
    fetchCertificateTemplates()
      .then(setTemplates)
      .catch(() => setTemplates([]));
  }, [enabled]);

  useEffect(() => {
    setForm(buildDefaultForm(activeDepartmentId));
    setEditingCertificateId("");
    setMessage(emptyMessage);
  }, [activeDepartmentId]);

  useEffect(() => {
    if (!enabled) return;
    loadCertificates("").catch(() => {
      setCertificates([]);
      setLoading(false);
      setMessage({
        type: "error",
        text: copy(
          "Could not load workshop certificates for this department right now.",
          "এই ডিপার্টমেন্টের ওয়ার্কশপ সার্টিফিকেট এখন লোড করা যাচ্ছে না।",
        ),
      });
    });
  }, [activeDepartmentId, enabled]);

  const handleRecipientChange = (value) => {
    if (value === "none") {
      setForm((current) => ({ ...current, recipientLookupId: "" }));
      return;
    }

    const nextUser = users.find((item) => item.id === value);
    const nextName = nextUser?.displayName || nextUser?.fullName || nextUser?.email || "";
    setForm((current) => ({
      ...current,
      recipientLookupId: value,
      recipientName: nextName || current.recipientName,
    }));
  };

  const handleTemplateChange = (value) => {
    if (value === "none") {
      setForm((current) => ({ ...current, templateId: "" }));
      return;
    }
    const nextTemplate = templates.find((item) => item.id === value);
    if (!nextTemplate) return;
    setForm((current) => applyTemplateToForm(nextTemplate, current));
    setMessage({
      type: "success",
      text: copy(
        "Template settings applied to this workshop certificate draft.",
        "এই ওয়ার্কশপ সার্টিফিকেট draft-এ template settings প্রয়োগ হয়েছে।",
      ),
    });
  };

  const handleWorkshopTitleChange = (value) => {
    setForm((current) => ({
      ...current,
      workshopTitle: value,
      subjectTitle: current.subjectTitle && current.subjectTitle !== current.workshopTitle ? current.subjectTitle : value,
    }));
  };

  const handleCopyLink = async (certificateId) => {
    const nextUrl = buildCertificateVerificationUrl(certificateId);
    try {
      await navigator.clipboard.writeText(nextUrl);
      setMessage({
        type: "success",
        text: copy("Verification link copied successfully.", "ভেরিফিকেশন লিংক সফলভাবে কপি হয়েছে।"),
      });
    } catch {
      setMessage({
        type: "error",
        text: copy("Could not copy the verification link.", "ভেরিফিকেশন লিংক কপি করা যায়নি।"),
      });
    }
  };

  const handleEdit = (certificate) => {
    setEditingCertificateId(certificate.id);
    setForm(buildFormFromCertificate(certificate));
    setMessage({
      type: "success",
      text: copy("Workshop certificate loaded for editing.", "ওয়ার্কশপ সার্টিফিকেটটি এডিট করার জন্য লোড হয়েছে।"),
    });
  };

  const handleReset = () => {
    setEditingCertificateId("");
    setForm(buildDefaultForm(activeDepartmentId));
    setMessage(emptyMessage);
  };

  const handleSave = async () => {
    if (!activeDepartmentId) return;
    const workshopCourseId =
      form.courseId || form.workshopId || buildWorkshopCourseId(form.workshopTitle || form.subjectTitle, form.workshopDateKey);

    setSaving(true);
    setMessage(emptyMessage);
    try {
      const certificateId = await saveCertificate({
        actor,
        certificateId: editingCertificateId,
        payload: {
          ...form,
          certificateKind: "workshop",
          departmentId: activeDepartmentId,
          workshopId: form.workshopId || workshopCourseId,
          workshopTitle: form.workshopTitle || form.subjectTitle,
          workshopDateKey: form.workshopDateKey || form.completionDateKey,
          subjectTitle: form.subjectTitle || form.workshopTitle,
          courseId: workshopCourseId,
          courseTitle: "Online Workshop",
        },
      });

      const savedCertificate = await fetchCertificateById(certificateId);
      setEditingCertificateId(certificateId);
      setForm(savedCertificate ? buildFormFromCertificate(savedCertificate) : { ...form, departmentId: activeDepartmentId });
      await loadCertificates(certificateId);
      setMessage({
        type: "success",
        text: editingCertificateId
          ? copy("Workshop certificate updated successfully.", "ওয়ার্কশপ সার্টিফিকেট সফলভাবে আপডেট হয়েছে।")
          : copy(
              "Workshop certificate generated successfully with a permanent verification link.",
              "স্থায়ী ভেরিফিকেশন লিংকসহ ওয়ার্কশপ সার্টিফিকেট সফলভাবে জেনারেট হয়েছে।",
            ),
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.message || copy("Could not save this workshop certificate.", "এই ওয়ার্কশপ সার্টিফিকেট সেভ করা যায়নি।"),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (certificateId, nextStatus) => {
    setStatusChangingId(certificateId);
    setMessage(emptyMessage);
    try {
      await updateCertificateStatus({ actor, certificateId, status: nextStatus });
      await loadCertificates(editingCertificateId || certificateId);
      setMessage({
        type: "success",
        text: copy("Workshop certificate status updated.", "ওয়ার্কশপ সার্টিফিকেটের স্ট্যাটাস আপডেট হয়েছে।"),
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.message || copy("Could not update status.", "স্ট্যাটাস আপডেট করা যায়নি।"),
      });
    } finally {
      setStatusChangingId("");
    }
  };

  return (
    <div className="space-y-6">
      <WorkspaceFilterBar
        eyebrow={copy("Workshop certificate flow", "ওয়ার্কশপ সার্টিফিকেট ফ্লো")}
        title={editingCertificateId ? copy("Editing a workshop certificate", "একটি ওয়ার্কশপ সার্টিফিকেট এডিট করা হচ্ছে") : copy("Prepare a workshop credential", "ওয়ার্কশপ credential প্রস্তুত করুন")}
        description={copy(
          "Use this flow for online workshops, webinars, bootcamps, masterclasses, and special sessions that need their own public verification record.",
          "Online workshop, webinar, bootcamp, masterclass, এবং special session-এর জন্য এই flow ব্যবহার করুন যেখানে নিজস্ব public verification record দরকার।",
        )}
      >
        <div className="grid gap-3 md:grid-cols-4">
          <div className="workspace-pane p-4">
            <p className="workspace-tile-title">{copy("Department scope", "ডিপার্টমেন্ট scope")}</p>
            <p className="workspace-tile-value">{departmentTitle}</p>
          </div>
          <div className="workspace-pane p-4">
            <p className="workspace-tile-title">{copy("Workshop segments", "ওয়ার্কশপ সেগমেন্ট")}</p>
            <p className="workspace-tile-value">{workshopGroups.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">{copy("Unique title/date groups", "Unique title/date group")}</p>
          </div>
          <div className="workspace-pane p-4">
            <p className="workspace-tile-title">{copy("Issued here", "এখানে ইস্যুকৃত")}</p>
            <p className="workspace-tile-value">{workshopCertificates.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">{copy("Workshop certificate records", "Workshop certificate record")}</p>
          </div>
          <div className="workspace-pane p-4">
            <p className="workspace-tile-title">{copy("Draft readiness", "Draft readiness")}</p>
            <p className="workspace-tile-value">{readyCount}/{readinessChecks.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">{copy("Core fields completed", "Core field completed")}</p>
          </div>
        </div>
      </WorkspaceFilterBar>

      <Card className="overflow-hidden rounded-[1.75rem] border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-sky-500/10">
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <Badge variant="subtle" className="mb-3 w-fit rounded-full px-4 py-1.5 text-sm">
                <Video className="mr-2 h-4 w-4" />
                {copy("Workshop certificate desk", "ওয়ার্কশপ সার্টিফিকেট ডেস্ক")}
              </Badge>
              <CardTitle className="text-2xl">
                {copy("Issue certificates for every online workshop", "প্রতিটি অনলাইন ওয়ার্কশপের সার্টিফিকেট ইস্যু করুন")}
              </CardTitle>
              <CardDescription className="mt-2 max-w-3xl text-base leading-7">
                {copy(
                  "Keep workshop certificates separate from course certificates while using the same official verification, QR, sharing, and download system.",
                  "Course certificate থেকে workshop certificate আলাদা রাখুন, কিন্তু একই official verification, QR, share, এবং download system ব্যবহার করুন।",
                )}
              </CardDescription>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[28rem]">
              <div className="rounded-2xl border border-background/80 bg-background/80 p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{copy("Workshops", "ওয়ার্কশপ")}</p>
                <p className="mt-2 text-2xl font-bold">{workshopGroups.length}</p>
              </div>
              <div className="rounded-2xl border border-background/80 bg-background/80 p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{copy("Certificates", "সার্টিফিকেট")}</p>
                <p className="mt-2 text-2xl font-bold">{workshopCertificates.length}</p>
              </div>
              <div className="rounded-2xl border border-background/80 bg-background/80 p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{copy("Active", "সক্রিয়")}</p>
                <p className="mt-2 text-2xl font-bold">{workshopCertificates.filter((item) => item.status === "active").length}</p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="rounded-[1.75rem] border border-border/50 bg-background/85">
          <CardHeader>
            <CardTitle>{copy("Workshop certificate form", "ওয়ার্কশপ সার্টিফিকেট ফর্ম")}</CardTitle>
            <CardDescription>
              {copy(
                "Create one certificate per participant, grouped under the workshop title and date.",
                "Workshop title এবং date-এর অধীনে participant অনুযায়ী সার্টিফিকেট তৈরি করুন।",
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="workshop-title">{copy("Workshop title", "ওয়ার্কশপের শিরোনাম")}</Label>
                <Input
                  id="workshop-title"
                  value={form.workshopTitle}
                  onChange={(event) => handleWorkshopTitleChange(event.target.value)}
                  placeholder={copy("Example: Back-End Engineering Masterclass", "যেমন: Back-End Engineering Masterclass")}
                />
              </div>
              <div>
                <DatePicker
                  label={copy("Workshop date", "ওয়ার্কশপের তারিখ")}
                  value={form.workshopDateKey}
                  onChange={(val) =>
                    setForm((current) => ({
                      ...current,
                      workshopDateKey: val?.iso || "",
                      completionDateKey: val?.iso || current.completionDateKey,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="workshop-template">{copy("Template preset", "টেমপ্লেট প্রিসেট")}</Label>
                <Select value={form.templateId || "none"} onValueChange={handleTemplateChange}>
                  <SelectTrigger id="workshop-template">
                    <SelectValue placeholder={copy("Select a template", "একটি টেমপ্লেট নির্বাচন করুন")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{copy("No template preset", "কোনো টেমপ্লেট প্রিসেট নয়")}</SelectItem>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.templateName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="workshop-recipient-lookup">{copy("Pick participant from roster", "Roster থেকে participant বেছে নিন")}</Label>
                <Select value={form.recipientLookupId || "none"} onValueChange={handleRecipientChange}>
                  <SelectTrigger id="workshop-recipient-lookup">
                    <SelectValue placeholder={copy("Choose a participant", "একজন participant বেছে নিন")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{copy("Manual entry only", "শুধু ম্যানুয়াল এন্ট্রি")}</SelectItem>
                    {users.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.displayName || item.fullName || item.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="workshop-recipient-name">{copy("Participant name", "Participant-এর নাম")}</Label>
                <Input
                  id="workshop-recipient-name"
                  value={form.recipientName}
                  onChange={(event) => setForm((current) => ({ ...current, recipientName: event.target.value }))}
                  placeholder={copy("Enter participant name", "Participant-এর নাম লিখুন")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workshop-subject">{copy("Certificate subject", "সার্টিফিকেটের বিষয়")}</Label>
                <Input
                  id="workshop-subject"
                  value={form.subjectTitle}
                  onChange={(event) => setForm((current) => ({ ...current, subjectTitle: event.target.value }))}
                  placeholder={copy("Usually same as workshop title", "সাধারণত workshop title-এর মতোই")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="workshop-certificate-title">{copy("Certificate title", "সার্টিফিকেটের শিরোনাম")}</Label>
              <Input
                id="workshop-certificate-title"
                value={form.certificateTitle}
                onChange={(event) => setForm((current) => ({ ...current, certificateTitle: event.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workshop-summary">{copy("Workshop achievement summary", "ওয়ার্কশপ achievement summary")}</Label>
              <Textarea
                id="workshop-summary"
                className="min-h-28"
                value={form.achievementSummary}
                onChange={(event) => setForm((current) => ({ ...current, achievementSummary: event.target.value }))}
                placeholder={copy(
                  "Write the completion criteria or learning outcome for this workshop.",
                  "এই workshop-এর completion criteria বা learning outcome লিখুন।",
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <DatePicker
                  label={copy("Completion date", "সমাপ্তির তারিখ")}
                  value={form.completionDateKey}
                  onChange={(val) => setForm((current) => ({ ...current, completionDateKey: val?.iso || "" }))}
                />
              </div>
              <div>
                <DatePicker
                  label={copy("Issue date", "ইস্যু তারিখ")}
                  value={form.issueDateKey}
                  onChange={(val) => setForm((current) => ({ ...current, issueDateKey: val?.iso || "" }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workshop-status">{copy("Verification status", "ভেরিফিকেশন স্ট্যাটাস")}</Label>
                <Select value={form.status} onValueChange={(value) => setForm((current) => ({ ...current, status: value }))}>
                  <SelectTrigger id="workshop-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CERTIFICATE_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {copy(option.en, option.bn)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="workshop-signer-name">{copy("Authority name", "অথরিটি নাম")}</Label>
                <Input
                  id="workshop-signer-name"
                  value={form.signerName}
                  onChange={(event) => setForm((current) => ({ ...current, signerName: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workshop-signer-title">{copy("Authority title", "অথরিটি পদবি")}</Label>
                <Input
                  id="workshop-signer-title"
                  value={form.signerTitle}
                  onChange={(event) => setForm((current) => ({ ...current, signerTitle: event.target.value }))}
                />
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-primary/15 bg-primary/5 p-4 text-sm leading-6 text-muted-foreground">
              <ShieldCheck className="mr-2 inline h-4 w-4 text-primary" />
              {copy(
                "Workshop certificates use the same HR Director signature, seal, QR, verification link, OG preview, PNG/PDF download, and social sharing pipeline as the main certificate system.",
                "Workshop certificate-ও main certificate system-এর একই HR Director signature, seal, QR, verification link, OG preview, PNG/PDF download, এবং social sharing pipeline ব্যবহার করে।",
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button className="min-w-[12rem]" disabled={saving} onClick={handleSave}>
                <FileSignature className="h-4 w-4" />
                {saving
                  ? copy("Saving workshop certificate...", "ওয়ার্কশপ সার্টিফিকেট সেভ হচ্ছে...")
                  : editingCertificateId
                    ? copy("Save workshop changes", "ওয়ার্কশপ পরিবর্তন সংরক্ষণ করুন")
                    : copy("Generate workshop certificate", "ওয়ার্কশপ সার্টিফিকেট জেনারেট করুন")}
              </Button>
              <Button variant="outline" disabled={saving} onClick={handleReset}>
                {copy("New workshop certificate", "নতুন ওয়ার্কশপ সার্টিফিকেট")}
              </Button>
              {editingCertificateId ? (
                <>
                  <Button variant="outline" onClick={() => handleCopyLink(editingCertificateId)}>
                    <Copy className="h-4 w-4" />
                    {copy("Copy link", "লিংক কপি করুন")}
                  </Button>
                  <Button variant="ghost" asChild>
                    <a href={buildCertificateVerificationUrl(editingCertificateId)} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      {copy("Open verification", "ভেরিফিকেশন খুলুন")}
                    </a>
                  </Button>
                </>
              ) : null}
            </div>

            {message.text ? (
              <Alert variant={message.type === "error" ? "destructive" : "default"}>
                <AlertTitle>{message.type === "error" ? copy("Action failed", "অ্যাকশন ব্যর্থ") : copy("Saved", "সংরক্ষিত")}</AlertTitle>
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            ) : null}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-[1.75rem] border border-border/50 bg-background/85 xl:sticky xl:top-24">
            <CardHeader>
              <CardTitle>{copy("Workshop scope", "ওয়ার্কশপ scope")}</CardTitle>
              <CardDescription>
                {copy(
                  "The active department controls roster, reporting, and certificate numbering.",
                  "Active department roster, reporting, এবং certificate numbering নিয়ন্ত্রণ করে।",
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-[1.5rem] border bg-background/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{copy("Department", "ডিপার্টমেন্ট")}</p>
                <p className="mt-2 text-2xl font-semibold">{departmentTitle}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border bg-background/80 p-4">
                  <UsersRound className="h-5 w-5 text-primary" />
                  <p className="mt-2 text-sm font-semibold">{copy("Department roster", "ডিপার্টমেন্ট roster")}</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
                <div className="rounded-2xl border bg-background/80 p-4">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  <p className="mt-2 text-sm font-semibold">{copy("Current date", "বর্তমান তারিখ")}</p>
                  <p className="text-sm font-medium">{formatDateKey(form.workshopDateKey, locale === "bn" ? "bn-BD" : "en-BD")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[1.75rem] border border-border/50 bg-background/85">
            <CardHeader>
              <CardTitle>{copy("Workshop segments", "ওয়ার্কশপ সেগমেন্ট")}</CardTitle>
              <CardDescription>
                {copy(
                  "Each title/date group stays visible as a separate workshop segment.",
                  "প্রতিটি title/date group আলাদা workshop segment হিসেবে দেখা যাবে।",
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <>
                  <Skeleton className="h-20 rounded-2xl" />
                  <Skeleton className="h-20 rounded-2xl" />
                </>
              ) : null}
              {!loading && !workshopGroups.length ? (
                <EmptyStateCard
                  icon={FileBadge2}
                  title={copy("No workshop segment yet", "এখনও কোনো workshop segment নেই")}
                  description={copy(
                    "Generate the first workshop certificate to create a segment.",
                    "প্রথম workshop certificate জেনারেট করলে segment তৈরি হবে।",
                  )}
                />
              ) : null}
              {!loading &&
                workshopGroups.map((group) => (
                  <div key={group.key} className="rounded-[1.25rem] border bg-background/80 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-semibold">{group.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {group.dateKey ? formatDateKey(group.dateKey, locale === "bn" ? "bn-BD" : "en-BD") : copy("Date not set", "তারিখ দেওয়া হয়নি")}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant="secondary">{copy("Total", "মোট")} {group.total}</Badge>
                        <Badge variant="success">{copy("Active", "সক্রিয়")} {group.active || 0}</Badge>
                        <Badge variant="outline">{copy("Draft", "ড্রাফট")} {group.draft || 0}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="rounded-[1.75rem] border border-border/50 bg-background/85">
        <CardHeader>
          <CardTitle>{copy("Issued workshop certificates", "ইস্যুকৃত ওয়ার্কশপ সার্টিফিকেট")}</CardTitle>
          <CardDescription>
            {copy(
              "Edit, activate, revoke, copy, or open each workshop certificate from one table.",
              "এক টেবিল থেকে workshop certificate edit, activate, revoke, copy, বা open করুন।",
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="space-y-3" aria-busy="true">
              <Skeleton className="h-16 w-full rounded-2xl" />
              <Skeleton className="h-16 w-full rounded-2xl" />
              <Skeleton className="h-16 w-full rounded-2xl" />
            </div>
          ) : null}

          {!loading && !workshopCertificates.length ? (
            <EmptyStateCard
              icon={Video}
              title={copy("No workshop certificates issued yet", "এখনও কোনো workshop certificate ইস্যু হয়নি")}
              description={copy(
                "Use the form above for online workshops, webinars, masterclasses, bootcamps, or special training events.",
                "Online workshop, webinar, masterclass, bootcamp, বা special training event-এর জন্য উপরের form ব্যবহার করুন।",
              )}
            />
          ) : null}

          {!loading && workshopCertificates.length ? (
            <div className="overflow-x-auto rounded-[1.75rem] border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{copy("Workshop", "ওয়ার্কশপ")}</TableHead>
                    <TableHead>{copy("Participant", "Participant")}</TableHead>
                    <TableHead>{copy("Status", "স্ট্যাটাস")}</TableHead>
                    <TableHead>{copy("Issued", "ইস্যু")}</TableHead>
                    <TableHead>{copy("Certificate number", "সার্টিফিকেট নম্বর")}</TableHead>
                    <TableHead>{copy("Actions", "অ্যাকশন")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workshopCertificates.map((certificate) => (
                    <TableRow key={certificate.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{certificate.workshopTitle || certificate.subjectTitle}</p>
                          <p className="text-xs text-muted-foreground">
                            {certificate.workshopDateKey
                              ? formatDateKey(certificate.workshopDateKey, locale === "bn" ? "bn-BD" : "en-BD")
                              : certificate.courseTitle || copy("Online workshop", "অনলাইন ওয়ার্কশপ")}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{certificate.recipientName}</p>
                        <p className="text-xs text-muted-foreground">{certificate.departmentTitle}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(certificate.status)}>{statusLabel(certificate.status)}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(certificate.issuedAt)}</TableCell>
                      <TableCell className="text-xs font-medium">{certificate.certificateNumber}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(certificate)}>
                            {copy("Edit", "এডিট")}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleCopyLink(certificate.id)}>
                            <Copy className="h-4 w-4" />
                            {copy("Link", "লিংক")}
                          </Button>
                          <Button size="sm" variant="ghost" asChild>
                            <a href={buildCertificateVerificationUrl(certificate.id)} target="_blank" rel="noreferrer">
                              <ExternalLink className="h-4 w-4" />
                              {copy("Open", "খুলুন")}
                            </a>
                          </Button>
                          {certificate.status !== "active" ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={statusChangingId === certificate.id}
                              onClick={() => handleStatusChange(certificate.id, "active")}
                            >
                              {copy("Set active", "সক্রিয় করুন")}
                            </Button>
                          ) : null}
                          {certificate.status !== "draft" ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={statusChangingId === certificate.id}
                              onClick={() => handleStatusChange(certificate.id, "draft")}
                            >
                              {copy("Set draft", "ড্রাফট করুন")}
                            </Button>
                          ) : null}
                          {certificate.status !== "revoked" ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={statusChangingId === certificate.id}
                              onClick={() => handleStatusChange(certificate.id, "revoked")}
                            >
                              {copy("Revoke", "বাতিল করুন")}
                            </Button>
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
