"use client";

import { useEffect, useState } from "react";
import { Check, Mail, ExternalLink, GraduationCap, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyStateCard } from "@/components/ui/empty-state-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLocale } from "@/components/providers/locale-provider";
import { formatDate } from "@/lib/date";
import {
  fetchGlcApplications,
  updateGlcApplicationStatus,
  saveCertificate,
  deleteCertificateRecord,
} from "@/lib/firestore/lms";
import { buildCertificateVerificationUrl } from "@/lib/urls";

const getTodayDateKey = () => new Date().toISOString().slice(0, 10);
const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

export function GlcCertificatePanel({ activeDepartmentId, actor, enabled = true }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState("");
  const [message, setMessage] = useState(null);
  const { copy, locale } = useLocale();

  useEffect(() => {
    if (enabled && activeDepartmentId) {
      loadApplications();
    }
  }, [enabled, activeDepartmentId]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const list = await fetchGlcApplications();
      setApplications(list);
    } catch (error) {
      console.error("Error loading applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApproval = async (app) => {
    if (processingId) return;
    setProcessingId(app.id);

    try {
      if (app.status === "approved" && app.certificateId) {
        // Revoke
        await deleteCertificateRecord({ certificateId: app.certificateId, actor });
        await updateGlcApplicationStatus(app.id, { status: "pending", certificateId: null });
        
        setApplications((current) =>
          current.map((item) => (item.id === app.id ? { ...item, status: "pending", certificateId: null } : item)),
        );
        setMessage({ type: "success", text: "The applicant's certificate has been removed." });
      } else {
        // Approve
        const today = getTodayDateKey();
        const glcCourseId = `glc:${today}:${slugify(app.glcTitle)}`;

        const payload = {
          certificateKind: "GLC",
          departmentId: activeDepartmentId,
          recipientLookupId: "",
          recipientName: app.fullName,
          recipientEmail: app.email,
          courseId: glcCourseId,
          courseTitle: "GLC Intensive Live Sessions",
          subjectTitle: "Professional Communication & Spoken English Certification",
          certificateTitle: "Certificate of Completion",
          achievementSummary: "This certificate validates that the recipient has actively participated in live interactive speaking drills, mastered core structural grammar formulas, and demonstrated competency in real-time professional communication, public speaking confidence, and active workplace interaction.",
          glcId: glcCourseId,
          glcTitle: app.glcTitle,
          glcDateKey: today,
          completionDateKey: today,
          issueDateKey: today,
          signerName: "Mehedi Hasan",
          signerTitle: "Lead Instructor & Founder",
          status: "active",
          themeStyle: "glc-spoken-english",
          labelOverrides: { department: "", issueDate: "" },
          customColors: { bgTheme: "", cardBg: "", textMain: "", textPrimary: "", borderOuter: "" },
        };

        const certificateId = await saveCertificate({
          actor,
          certificateId: "",
          payload,
        });

        await updateGlcApplicationStatus(app.id, { status: "approved", certificateId });

        setApplications((current) =>
          current.map((item) => (item.id === app.id ? { ...item, status: "approved", certificateId } : item)),
        );
        setMessage({ type: "success", text: "The certificate is now active." });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Something went wrong." });
    } finally {
      setProcessingId("");
    }
  };

  const buildMailtoLink = (app) => {
    if (!app.certificateId) return "#";
    const certUrl = buildCertificateVerificationUrl(app.certificateId);
    // Standard JS environment uses encodeURIComponent
    const subject = encodeURIComponent(`Your GLC Certificate - ${app.glcTitle}`);
    const body = encodeURIComponent(`Dear ${app.fullName},\n\nCongratulations on successfully completing the ${app.glcTitle}!\n\nYour official certificate of completion is now available. You can view, verify, and download it at the following link:\n\n${certUrl}\n\nBest regards,\nEquiSaaS BD Learning Team`);
    return `mailto:${app.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-[1.75rem] border border-border/50 bg-background/85">
        <CardHeader>
          <CardTitle>{copy("GLC Certificate Applicants", 'GLC _ݨݮݨ  ؅Y _ ؅" __ݨ')}</CardTitle>
          <CardDescription>
            {copy(
              "Review public applications, assign certificates, and send official emails.",
              'Application _   ?", certificate  ݨ"   ?", __ official email   _" "'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <Alert variant={message.type === "error" ? "destructive" : "default"}>
              <AlertTitle>{message.type === "error" ? "Error" : "Success"}</AlertTitle>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="space-y-3" aria-busy="true">
              <Skeleton className="h-16 w-full rounded-2xl" />
              <Skeleton className="h-16 w-full rounded-2xl" />
              <Skeleton className="h-16 w-full rounded-2xl" />
            </div>
          ) : null}

          {!loading && !applications.length ? (
            <EmptyStateCard
              icon={GraduationCap}
              title={copy("No applications yet", '?-" _ ؅" " ؅')}
              description={copy(
                "When users apply via the public GLC portal, they will appear here.",
                'Public GLC portal ݝ ؅ _ _ ؅" __ "_r ?-_"  ؅-__ __" "'
              )}
            />
          ) : null}

          {!loading && applications.length ? (
            <div className="overflow-x-auto rounded-[1.75rem] border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Date Applied</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Certificate</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>
                        <p className="font-medium">{app.fullName}</p>
                        <p className="text-xs text-muted-foreground">{app.glcTitle}</p>
                      </TableCell>
                      <TableCell>{app.email}</TableCell>
                      <TableCell>{formatDate(app.createdAt)}</TableCell>
                      <TableCell>
                        <Badge variant={app.status === "approved" ? "success" : "secondary"}>
                          {app.status === "approved" ? "Approved" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant={app.status === "approved" ? "default" : "outline"}
                          size="sm"
                          disabled={processingId === app.id}
                          onClick={() => handleToggleApproval(app)}
                        >
                          {app.status === "approved" ? "Approved" : "Approve"}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {app.status === "approved" && app.certificateId ? (
                            <>
                              <Button size="sm" variant="outline" asChild>
                                <a href={buildMailtoLink(app)}>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Send Mail
                                </a>
                              </Button>
                              <Button size="sm" variant="ghost" asChild>
                                <a href={buildCertificateVerificationUrl(app.certificateId)} target="_blank" rel="noreferrer">
                                  <ExternalLink className="h-4 w-4" />
                                  Open
                                </a>
                              </Button>
                            </>
                          ) : (
                            <span className="text-xs text-muted-foreground">Approve to send</span>
                          )}
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
