"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, ExternalLink, FileCheck2, FileSignature, ShieldCheck } from "lucide-react";
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
  fetchDepartmentCertificates,
  fetchCertificateById,
  fetchCertificateTemplates,
  saveCertificate,
  updateCertificateStatus,
} from "@/lib/firestore/lms";
import { DEPARTMENT_IDEAL_CERTIFICATE_SUMMARIES } from "@/lib/catalog";
import { buildCertificateVerificationUrl } from "@/lib/urls";

const emptyMessage = { type: "", text: "" };
const CERTIFICATE_STATUS_OPTIONS = [
  { value: "draft", en: "Draft", bn: "ড্রাফট" },
  { value: "active", en: "Active", bn: "সক্রিয়" },
  { value: "revoked", en: "Revoked", bn: "বাতিল" },
];
const DEFAULT_SIGNER_NAME = "Sandipta Karmakar Barno";
const DEFAULT_SIGNER_TITLE = "Director of HR & Operations";

const getTodayDateKey = () => new Date().toISOString().slice(0, 10);

const buildDefaultForm = (departmentId) => ({
  recipientLookupId: "",
  templateId: "",
  recipientName: "",
  certificateTitle: "Certificate of Completion",
  subjectTitle: "",
  achievementSummary: DEPARTMENT_IDEAL_CERTIFICATE_SUMMARIES[departmentId] || "",
  courseId: "",
  completionDateKey: getTodayDateKey(),
  issueDateKey: getTodayDateKey(),
  signerName: DEFAULT_SIGNER_NAME,
  signerTitle: DEFAULT_SIGNER_TITLE,
  status: "draft",
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
  departmentId,
});

const buildFormFromCertificate = (certificate) => ({
  recipientLookupId: "",
  templateId: certificate.templateId || "",
  recipientName: certificate.recipientName || "",
  certificateTitle: certificate.certificateTitle || "Certificate of Completion",
  subjectTitle: certificate.subjectTitle || "",
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
  departmentId: certificate.departmentId || "",
});

const buildFormWithTemplate = (template, currentForm, departmentId) => ({
  ...currentForm,
  templateId: template?.id || "",
  certificateTitle: template?.certificateTitle || currentForm.certificateTitle || "Certificate of Completion",
  subjectTitle: currentForm.subjectTitle || template?.subjectTitle || "",
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
  departmentId,
});

export function CertificateManagementPanel({ activeDepartmentId, courses, users, actor, departmentTitle }) {
  const { copy, locale } = useLocale();
  const [certificates, setCertificates] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(emptyMessage);
  const [editingCertificateId, setEditingCertificateId] = useState("");
  const [statusChangingId, setStatusChangingId] = useState("");
  const [form, setForm] = useState(buildDefaultForm(activeDepartmentId));

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === form.courseId) || null,
    [courses, form.courseId],
  );
  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === form.templateId) || null,
    [form.templateId, templates],
  );
  const verificationUrl = editingCertificateId
    ? buildCertificateVerificationUrl(editingCertificateId)
    : buildCertificateVerificationUrl("");
  const readinessChecks = useMemo(
    () => [
      { key: "recipient", ready: Boolean(form.recipientName.trim()), label: copy("Recipient is set", "প্রাপক সেট আছে") },
      { key: "subject", ready: Boolean(form.subjectTitle.trim()), label: copy("Subject is clear", "বিষয় পরিষ্কার আছে") },
      { key: "summary", ready: Boolean(form.achievementSummary.trim()), label: copy("Summary is written", "Summary লেখা আছে") },
      { key: "status", ready: Boolean(form.status), label: copy("Status is chosen", "Status বেছে নেওয়া হয়েছে") },
    ],
    [copy, form.achievementSummary, form.recipientName, form.status, form.subjectTitle],
  );
  const readyCount = readinessChecks.filter((item) => item.ready).length;

  const loadCertificates = async (nextEditingId = editingCertificateId) => {
    if (!activeDepartmentId) {
      setCertificates([]);
      setLoading(false);
      return [];
    }

    setLoading(true);
    try {
      const items = await fetchDepartmentCertificates(activeDepartmentId, 40);
      setCertificates(items);

      if (nextEditingId) {
        const selected = items.find((item) => item.id === nextEditingId);
        if (selected) {
          setForm(buildFormFromCertificate(selected));
          setEditingCertificateId(selected.id);
        }
      }

      return items;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificateTemplates()
      .then(setTemplates)
      .catch(() => setTemplates([]));
  }, []);

  useEffect(() => {
    setForm(buildDefaultForm(activeDepartmentId));
    setEditingCertificateId("");
    setMessage(emptyMessage);
  }, [activeDepartmentId]);

  useEffect(() => {
    if (!activeDepartmentId) {
      setCertificates([]);
      setLoading(false);
      return;
    }

    loadCertificates("").catch(() => {
      setCertificates([]);
      setLoading(false);
      setMessage({
        type: "error",
        text: copy(
          "Could not load certificates for this department right now.",
          "এই ডিপার্টমেন্টের সার্টিফিকেট এখন লোড করা যাচ্ছে না।",
        ),
      });
    });
  }, [activeDepartmentId]);

  useEffect(() => {
    if (form.courseId && !courses.some((course) => course.id === form.courseId)) {
      setForm((current) => ({ ...current, courseId: "" }));
    }
  }, [courses, form.courseId]);

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

    setForm((current) => buildFormWithTemplate(nextTemplate, current, activeDepartmentId));
    setMessage({
      type: "success",
      text: copy(
        "Template settings applied to this certificate draft.",
        "এই সার্টিফিকেট draft-এ template settings প্রয়োগ হয়েছে।",
      ),
    });
  };

  const handleCourseChange = (value) => {
    if (value === "none") {
      setForm((current) => ({ ...current, courseId: "" }));
      return;
    }

    const nextCourse = courses.find((course) => course.id === value);
    setForm((current) => ({
      ...current,
      courseId: value,
      subjectTitle: current.subjectTitle || nextCourse?.title || "",
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
      text: copy("Certificate loaded for editing.", "সার্টিফিকেটটি এডিট করার জন্য লোড হয়েছে।"),
    });
  };

  const handleReset = () => {
    setEditingCertificateId("");
    setForm(buildDefaultForm(activeDepartmentId));
    setMessage(emptyMessage);
  };

  const handleSave = async () => {
    if (!activeDepartmentId) return;

    setSaving(true);
    setMessage(emptyMessage);
    try {
      const certificateId = await saveCertificate({
        actor,
        certificateId: editingCertificateId,
        payload: {
          ...form,
          departmentId: activeDepartmentId,
          courseTitle: selectedCourse?.title || "",
        },
      });

      const savedCertificate = await fetchCertificateById(certificateId);
      setEditingCertificateId(certificateId);
      setForm(
        savedCertificate ? buildFormFromCertificate(savedCertificate) : { ...form, departmentId: activeDepartmentId },
      );
      await loadCertificates(certificateId);
      setMessage({
        type: "success",
        text: editingCertificateId
          ? copy(
              "Certificate updated successfully. The verification page is ready.",
              "সার্টিফিকেট সফলভাবে আপডেট হয়েছে। ভেরিফিকেশন পেজ এখন প্রস্তুত।",
            )
          : copy(
              "Certificate generated successfully. You can now share the verification link.",
              "সার্টিফিকেট সফলভাবে জেনারেট হয়েছে। এখন ভেরিফিকেশন লিংক শেয়ার করা যাবে।",
            ),
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.message || copy("Could not save this certificate.", "এই সার্টিফিকেট সেভ করা যায়নি।"),
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
        text: copy("Certificate status updated successfully.", "সার্টিফিকেটের স্ট্যাটাস সফলভাবে আপডেট হয়েছে।"),
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.message || copy("Could not update certificate status.", "সার্টিফিকেটের স্ট্যাটাস আপডেট করা যায়নি।"),
      });
    } finally {
      setStatusChangingId("");
    }
  };

  return (
    <div className="space-y-6">
      <WorkspaceFilterBar
        eyebrow={copy("Certificate publishing flow", "সার্টিফিকেট পাবলিশিং ফ্লো")}
        title={editingCertificateId ? copy("Editing an existing certificate", "একটি বিদ্যমান সার্টিফিকেট এডিট করা হচ্ছে") : copy("Prepare a new certificate record", "নতুন সার্টিফিকেট রেকর্ড প্রস্তুত করুন")}
        description={copy(
          "Keep one clean verification record per certificate. Draft is private, while active and revoked remain verifiable through the same permanent link.",
          "প্রতিটি certificate-এর জন্য একটি clean verification record রাখুন। Draft private থাকে, আর active ও revoked একই permanent link দিয়ে verifiable থাকে।",
        )}
      >
        <div className="grid gap-3 md:grid-cols-4">
          <div className="workspace-pane p-4">
            <p className="workspace-tile-title">{copy("Department scope", "ডিপার্টমেন্ট scope")}</p>
            <p className="workspace-tile-value">{departmentTitle}</p>
          </div>
          <div className="workspace-pane p-4">
            <p className="workspace-tile-title">{copy("Templates", "টেমপ্লেট")}</p>
            <p className="workspace-tile-value">{templates.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">{copy("Reusable presets ready", "Reusable preset ready")}</p>
          </div>
          <div className="workspace-pane p-4">
            <p className="workspace-tile-title">{copy("Issued here", "এখানে ইস্যুকৃত")}</p>
            <p className="workspace-tile-value">{certificates.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">{copy("Department certificate records", "Department certificate record")}</p>
          </div>
          <div className="workspace-pane p-4">
            <p className="workspace-tile-title">{copy("Draft readiness", "Draft readiness")}</p>
            <p className="workspace-tile-value">{readyCount}/{readinessChecks.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">{copy("Core fields completed", "Core field completed")}</p>
          </div>
        </div>
      </WorkspaceFilterBar>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="rounded-[1.75rem] border border-border/50 bg-background/85">
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>{copy("Generate verifiable certificates", "ভেরিফায়েবল সার্টিফিকেট জেনারেট করুন")}</CardTitle>
                <CardDescription className="mt-2 max-w-3xl text-base leading-7">
                  {copy(
                    "Super Admin can issue, edit, activate, or revoke certificates for any department subject from one place.",
                    "Super Admin এখান থেকে যেকোনো ডিপার্টমেন্টের যেকোনো বিষয়ের সার্টিফিকেট issue, edit, activate বা revoke করতে পারবেন।",
                  )}
                </CardDescription>
              </div>
              <Badge variant="subtle" className="w-fit rounded-full px-4 py-1.5 text-sm">
                <ShieldCheck className="mr-2 h-4 w-4" />
                {copy("Super Admin only", "শুধু Super Admin")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="certificate-template">{copy("Template preset", "টেমপ্লেট প্রিসেট")}</Label>
                <Select value={form.templateId || "none"} onValueChange={handleTemplateChange}>
                  <SelectTrigger id="certificate-template">
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
                <p className="text-xs leading-6 text-muted-foreground">
                  {selectedTemplate
                    ? copy(
                        `Using ${selectedTemplate.templateName}. Theme, labels, signer defaults, and preset text will flow into the certificate viewer and share image.`,
                        `${selectedTemplate.templateName} ব্যবহার হচ্ছে। Theme, label, signer default, এবং preset text certificate viewer ও share image-এও যাবে।`,
                      )
                    : copy(
                        "Select a reusable template if you want the visual theme, signer defaults, and preset labels to apply automatically.",
                        "Visual theme, signer default, এবং preset label স্বয়ংক্রিয়ভাবে বসাতে চাইলে একটি reusable template বেছে নিন।",
                      )}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="certificate-recipient-lookup">{copy("Pick from department roster", "ডিপার্টমেন্ট roster থেকে বেছে নিন")}</Label>
                <Select value={form.recipientLookupId || "none"} onValueChange={handleRecipientChange}>
                  <SelectTrigger id="certificate-recipient-lookup">
                    <SelectValue placeholder={copy("Choose a member", "একজন সদস্য বেছে নিন")} />
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

              <div className="space-y-2">
                <Label htmlFor="certificate-recipient-name">{copy("Recipient name", "প্রাপকের নাম")}</Label>
                <Input
                  id="certificate-recipient-name"
                  value={form.recipientName}
                  onChange={(event) => setForm((current) => ({ ...current, recipientName: event.target.value }))}
                  placeholder={copy("Enter the learner name", "শিক্ষার্থীর নাম লিখুন")}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="certificate-course">{copy("Related course", "সম্পর্কিত কোর্স")}</Label>
                <Select value={form.courseId || "none"} onValueChange={handleCourseChange}>
                  <SelectTrigger id="certificate-course">
                    <SelectValue placeholder={copy("Select a course", "একটি কোর্স বেছে নিন")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{copy("No linked course", "কোনো linked course নয়")}</SelectItem>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="certificate-subject">{copy("Subject or topic", "বিষয় বা টপিক")}</Label>
                <Input
                  id="certificate-subject"
                  value={form.subjectTitle}
                  onChange={(event) => setForm((current) => ({ ...current, subjectTitle: event.target.value }))}
                  placeholder={copy("Example: Frontend Foundations", "যেমন: Frontend Foundations")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="certificate-title">{copy("Certificate title", "সার্টিফিকেটের শিরোনাম")}</Label>
              <Input
                id="certificate-title"
                value={form.certificateTitle}
                onChange={(event) => setForm((current) => ({ ...current, certificateTitle: event.target.value }))}
                placeholder={copy("Certificate of Completion", "Certificate of Completion")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="certificate-summary">{copy("Achievement summary", "সংক্ষিপ্ত achievement summary")}</Label>
              <Textarea
                id="certificate-summary"
                className="min-h-28"
                value={form.achievementSummary}
                onChange={(event) => setForm((current) => ({ ...current, achievementSummary: event.target.value }))}
                placeholder={copy(
                  "Describe what the learner completed or demonstrated.",
                  "শিক্ষার্থী কী সম্পন্ন করেছে বা কী দক্ষতা দেখিয়েছে তা লিখুন।",
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
                <Label htmlFor="certificate-status">{copy("Verification status", "ভেরিফিকেশন স্ট্যাটাস")}</Label>
                <Select value={form.status} onValueChange={(value) => setForm((current) => ({ ...current, status: value }))}>
                  <SelectTrigger id="certificate-status">
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
                <Label htmlFor="certificate-signer-name">{copy("Authority name (optional)", "অথরিটি নাম (ঐচ্ছিক)")}</Label>
                <Input
                  id="certificate-signer-name"
                  value={form.signerName}
                  onChange={(event) => setForm((current) => ({ ...current, signerName: event.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="certificate-signer-title">{copy("Authority title (optional)", "অথরিটি পদবি (ঐচ্ছিক)")}</Label>
                <Input
                  id="certificate-signer-title"
                  value={form.signerTitle}
                  onChange={(event) => setForm((current) => ({ ...current, signerTitle: event.target.value }))}
                />
              </div>
            </div>

            <p className="text-xs leading-6 text-muted-foreground">
              {copy(
                "The visible signature block uses the HR Director signature and seal by default. Template theme and label settings also stay attached to the saved certificate record.",
                "দৃশ্যমান signature block-এ default হিসেবে HR Director-এর signature ও seal ব্যবহার হবে। Template theme এবং label settings-ও saved certificate record-এর সাথে যুক্ত থাকবে।",
              )}
            </p>

            <div className="flex flex-wrap gap-3">
              <Button className="min-w-[12rem]" disabled={saving} onClick={handleSave}>
                <FileSignature className="h-4 w-4" />
                {saving
                  ? copy("Saving certificate...", "সার্টিফিকেট সেভ হচ্ছে...")
                  : editingCertificateId
                    ? copy("Save changes", "পরিবর্তন সংরক্ষণ করুন")
                    : copy("Generate certificate", "সার্টিফিকেট জেনারেট করুন")}
              </Button>
              <Button variant="outline" disabled={saving} onClick={handleReset}>
                {copy("Start a new certificate", "নতুন সার্টিফিকেট শুরু করুন")}
              </Button>
              {editingCertificateId ? (
                <>
                  <Button variant="outline" onClick={() => handleCopyLink(editingCertificateId)}>
                    <Copy className="h-4 w-4" />
                    {copy("Copy verification link", "ভেরিফিকেশন লিংক কপি করুন")}
                  </Button>
                  <Button variant="ghost" asChild>
                    <a href={buildCertificateVerificationUrl(editingCertificateId)} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      {copy("Open verification page", "ভেরিফিকেশন পেজ খুলুন")}
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

        <Card className="rounded-[1.75rem] border border-border/50 bg-background/85 xl:sticky xl:top-24">
          <CardHeader>
            <CardTitle>{copy("Certificate preview context", "সার্টিফিকেট preview context")}</CardTitle>
            <CardDescription>
              {copy(
                "Draft stays private. Active and revoked certificates remain publicly verifiable through the same link.",
                "Draft private থাকে। Active এবং revoked certificate একই link দিয়ে publicly verify করা যায়।",
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {readinessChecks.map((item) => (
                <div key={item.key} className={`rounded-2xl border px-4 py-3 ${item.ready ? "border-primary/20 bg-primary/5" : "border-border/60 bg-background/80"}`}>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {item.ready ? copy("Ready", "Ready") : copy("Pending", "Pending")}
                  </p>
                  <p className="mt-2 text-sm font-medium">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="rounded-[1.75rem] border border-primary/20 bg-primary/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {copy("Department scope", "ডিপার্টমেন্ট scope")}
              </p>
              <p className="mt-2 text-xl font-semibold">{departmentTitle}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {copy(
                  "Change the department workspace above if you want to issue certificates for another team.",
                  "অন্য টিমের জন্য certificate issue করতে চাইলে উপরের department workspace বদলান।",
                )}
              </p>
            </div>

            <div className="rounded-[1.75rem] border bg-background/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {copy("Current recipient", "বর্তমান প্রাপক")}
              </p>
              <p className="mt-2 text-2xl font-semibold">{form.recipientName || copy("Not selected yet", "এখনও বেছে নেওয়া হয়নি")}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {form.subjectTitle || copy("Add a subject or course title to complete the certificate preview.", "Preview সম্পূর্ণ করতে একটি subject বা course title দিন।")}
              </p>
            </div>

            <div className="rounded-[1.75rem] border bg-background/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {copy("Verification page", "ভেরিফিকেশন পেজ")}
              </p>
              <p className="mt-2 break-all text-sm font-medium">{verificationUrl}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {editingCertificateId
                  ? copy(
                      "This link is already live. Share it after you confirm the status and certificate content.",
                      "এই link এখন live। Status এবং certificate content নিশ্চিত করার পর share করুন।",
                    )
                  : copy(
                      "The verification link becomes share-ready right after the first save.",
                      "প্রথম save-এর পরই verification link share-ready হয়ে যাবে।",
                    )}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border bg-background/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  {copy("Completion date", "সমাপ্তির তারিখ")}
                </p>
                <p className="mt-2 text-sm font-medium">
                  {formatDateKey(form.completionDateKey, locale === "bn" ? "bn-BD" : "en-BD")}
                </p>
              </div>
              <div className="rounded-2xl border bg-background/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  {copy("Issue date", "ইস্যু তারিখ")}
                </p>
                <p className="mt-2 text-sm font-medium">
                  {formatDateKey(form.issueDateKey, locale === "bn" ? "bn-BD" : "en-BD")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[1.75rem] border border-border/50 bg-background/85">
        <CardHeader>
          <CardTitle>{copy("Issued certificates in this department", "এই ডিপার্টমেন্টের ইস্যুকৃত সার্টিফিকেট")}</CardTitle>
          <CardDescription>
            {copy(
              "Each certificate keeps one permanent verification link. Use edit for content changes and status actions for visibility control.",
              "প্রতিটি certificate-এর একটি permanent verification link থাকে। content change-এর জন্য edit, আর visibility control-এর জন্য status action ব্যবহার করুন।",
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="space-y-3" aria-busy="true" aria-label={copy("Loading certificates", "সার্টিফিকেট লোড হচ্ছে")}>
              <Skeleton className="h-16 w-full rounded-2xl" />
              <Skeleton className="h-16 w-full rounded-2xl" />
              <Skeleton className="h-16 w-full rounded-2xl" />
            </div>
          ) : null}

          {!loading && !certificates.length ? (
            <EmptyStateCard
              icon={FileCheck2}
              title={copy("No certificates issued here yet", "এখনও এই ডিপার্টমেন্টে কোনো সার্টিফিকেট ইস্যু হয়নি")}
              description={copy(
                "Generate the first certificate from the form above. It will appear here with a live verification link.",
                "উপরের form থেকে প্রথম certificate জেনারেট করুন। সেটি এখানে live verification link-সহ দেখা যাবে।",
              )}
            />
          ) : null}

          {!loading && certificates.length ? (
            <div className="overflow-x-auto rounded-[1.75rem] border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{copy("Recipient", "প্রাপক")}</TableHead>
                    <TableHead>{copy("Subject", "বিষয়")}</TableHead>
                    <TableHead>{copy("Status", "স্ট্যাটাস")}</TableHead>
                    <TableHead>{copy("Issued", "ইস্যু")}</TableHead>
                    <TableHead>{copy("Certificate number", "সার্টিফিকেট নম্বর")}</TableHead>
                    <TableHead>{copy("Actions", "অ্যাকশন")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {certificates.map((certificate) => (
                    <TableRow key={certificate.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{certificate.recipientName}</p>
                          <p className="text-xs text-muted-foreground">{certificate.departmentTitle}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{certificate.subjectTitle}</p>
                          <p className="text-xs text-muted-foreground">{certificate.courseTitle || copy("Custom subject", "কাস্টম বিষয়")}</p>
                        </div>
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
