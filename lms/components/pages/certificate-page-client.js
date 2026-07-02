"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useRouter } from "next/navigation";
import { toBlob, toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import confetti from "canvas-confetti";
import {
  Copy,
  Download,
  ExternalLink,
  FileDown,
  Globe2,
  Mail,
  MessageCircle,
  Search,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Users,
} from "lucide-react";
import { CertificateDocument } from "@/components/certificates/certificate-document";
import { ContributionLetterTemplate } from "@/components/certificates/contribution-letter-template";
import { PublicShell } from "@/components/layout/public-shell";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { AnimatedBlock } from "@/components/ui/animated-block";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchCertificateById } from "@/lib/firestore/lms";
import { buildCertificateVerificationUrl } from "@/lib/urls";
import { sanitizeFilename, triggerDownload } from "@/lib/download-helper";
import { cn } from "@/lib/utils";

const normalizeLookupValue = (value) => {
  const rawValue = String(value || "").trim();
  if (!rawValue) return "";

  try {
    const parsedUrl = new URL(rawValue);
    return String(parsedUrl.searchParams.get("id") || "").trim();
  } catch {
    const match = rawValue.match(/[?&]id=([^&#]+)/i);
    if (match?.[1]) {
      return decodeURIComponent(match[1]).trim();
    }
    return rawValue;
  }
};

const waitForCertificateAssets = async (node) => {
  if (!node) return;

  if (typeof document !== "undefined" && document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // Ignore font readiness issues and continue with the capture.
    }
  }

  const images = Array.from(node.querySelectorAll("img"));
  await Promise.all(
    images.map((image) => {
      if (image.complete) return Promise.resolve();

      return new Promise((resolve) => {
        image.addEventListener("load", resolve, { once: true });
        image.addEventListener("error", resolve, { once: true });
      });
    }),
  );

  await new Promise((resolve) => window.requestAnimationFrame(() => resolve()));
};

const openSharePopup = (url) => {
  if (!url) return;
  window.open(url, "_blank", "noopener,noreferrer");
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const dataUrlToBlob = (dataUrl) => {
  const parts = dataUrl.split(";base64,");
  const contentType = parts[0].split(":")[1];
  const byteCharacters = atob(parts[1]);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};

const triggerFileDownload = (blob, filename) => {
  triggerDownload(blob, filename);
};

const buildCertificateFilename = (certificate, extension) => {
  const base = `certificate-${certificate?.recipientName || "recipient"}-${certificate?.certificateTitle || "record"}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
  return sanitizeFilename(`${base || "certificate-record"}.${extension}`);
};

const getLookupIdFromLocation = () => {
  if (typeof window === "undefined") return "";
  return normalizeLookupValue(new URLSearchParams(window.location.search).get("id"));
};

export default function CertificatePageClient() {
  const authState = useAuth();
  const { copy } = useLocale();
  const router = useRouter();
  const [activeLookupId, setActiveLookupId] = useState(getLookupIdFromLocation);
  const [lookupValue, setLookupValue] = useState(getLookupIdFromLocation);
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [renderExportDocument, setRenderExportDocument] = useState(false);
  const [renderLetterExport, setRenderLetterExport] = useState(false);
  const [message, setMessage] = useState("");
  const certificateRef = useRef(null);
  const exportCertificateRef = useRef(null);
  const letterRef = useRef(null);

  const resolvedCertificateId = certificate?.id || activeLookupId;
  const certificateUrl = resolvedCertificateId ? buildCertificateVerificationUrl(resolvedCertificateId) : "";
  const shareTitle = certificate
    ? `${certificate.certificateTitle} | EquiSaaS BD Certificate`
    : "EquiSaaS BD Certificate Verification";
  const shareText = certificate
    ? `Verify this EquiSaaS BD certificate for ${certificate.recipientName} online.`
    : "Verify this EquiSaaS BD certificate online.";
  const linkedInCredentialDetails = certificateUrl
    ? [
        `Name: ${certificate?.certificateTitle || "EquiSaaS BD Certificate"}`,
        "Issuing Organization: EquiSaaS BD",
        `Issue Date: ${certificate?.issueDateLabel || certificate?.issueDateKey || "-"}`,
        "Expiration Date: No expiration",
        `Credential ID: ${certificate?.certificateNumber || resolvedCertificateId || "-"}`,
        `Credential URL: ${certificateUrl}`,
      ].join("\n")
    : "";
  const facebookShareUrl = certificateUrl
    ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(certificateUrl)}`
    : "";
  const linkedInShareUrl = certificateUrl
    ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certificateUrl)}`
    : "";
  const whatsappShareUrl = certificateUrl
    ? `https://wa.me/?text=${encodeURIComponent(`${shareText} ${certificateUrl}`)}`
    : "";
  const emailShareUrl = certificateUrl
    ? `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareText}\n\n${certificateUrl}`)}`
    : "";
  const shareButtonClassName = "group justify-start rounded-2xl border-primary/15 bg-background/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:bg-background hover:shadow-lg active:scale-[0.98]";
  const quickShareButtonClassName = "group justify-start rounded-2xl border-primary/20 bg-background/90 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-background hover:shadow-lg active:scale-[0.98]";
  const infoTileClassName = "interactive-tile rounded-2xl border bg-background px-4 py-3";

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const nextId = normalizeLookupValue(params.get("id"));
      setActiveLookupId(nextId);
      setLookupValue((current) => {
        if (document.activeElement instanceof HTMLInputElement && document.activeElement.value === current) {
          return current;
        }
        return nextId;
      });
    };

    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);

    return () => {
      window.removeEventListener("popstate", syncFromUrl);
    };
  }, []);

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!activeLookupId) {
        if (active) {
          setCertificate(null);
          setLoading(false);
          setMessage("");
        }
        return;
      }

      setLoading(true);
      setMessage("");
      try {
        const nextCertificate = await fetchCertificateById(activeLookupId);
        if (!active) return;

        if (!nextCertificate) {
          setCertificate(null);
          setMessage(
            copy(
              "We could not verify a public certificate with this link. Check the link or contact EquiSaaS BD support.",
              "এই লিংক দিয়ে কোনো public certificate verify করা যায়নি। লিংকটি আবার দেখুন অথবা EquiSaaS BD support-এর সাথে যোগাযোগ করুন।",
            ),
          );
          return;
        }

        setCertificate(nextCertificate);

        if (nextCertificate?.status === "active") {
          const duration = 3 * 1000;
          const animationEnd = Date.now() + duration;
          const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

          const randomInRange = (min, max) => Math.random() * (max - min) + min;

          const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
              return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({
              ...defaults,
              particleCount,
              origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            });
            confetti({
              ...defaults,
              particleCount,
              origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            });
          }, 250);
        }
      } catch {
        if (!active) return;
        setCertificate(null);
        setMessage(
          copy(
            "Something went wrong while checking this certificate. Please try again.",
            "সার্টিফিকেটটি যাচাই করতে গিয়ে একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।",
          ),
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [activeLookupId, copy]);

  const handleLookup = () => {
    const nextId = normalizeLookupValue(lookupValue);
    if (!nextId) {
      setMessage(copy("Enter a certificate link or certificate ID first.", "Enter a certificate link or certificate ID first."));
      return;
    }

    setActiveLookupId(nextId);
    router.replace(`/certificate-view?id=${encodeURIComponent(nextId)}`);
  };

  const handleCopyLink = async () => {
    if (!certificateUrl) return;

    try {
      await navigator.clipboard.writeText(certificateUrl);
      setMessage(copy("Verification link copied successfully.", "Verification link copied successfully."));
    } catch {
      setMessage(copy("Could not copy the verification link.", "Could not copy the verification link."));
    }
  };

  const handleCopyLinkedInDetails = async () => {
    if (!linkedInCredentialDetails) return;

    try {
      await navigator.clipboard.writeText(linkedInCredentialDetails);
      setMessage(copy("LinkedIn-ready credential details copied successfully.", "LinkedIn-ready credential details copied successfully."));
    } catch {
      setMessage(copy("Could not copy the LinkedIn credential details.", "Could not copy the LinkedIn credential details."));
    }
  };

  const handleNativeShare = async () => {
    if (!certificateUrl || !navigator.share) {
      setMessage(copy("Native sharing is not available in this browser.", "Native sharing is not available in this browser."));
      return;
    }

    try {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: certificateUrl,
      });
    } catch (error) {
      if (error?.name !== "AbortError") {
        setMessage(copy("Could not open the share sheet right now.", "Could not open the share sheet right now."));
      }
    }
  };

  const handleShareToLinkedIn = () => {
    if (!linkedInShareUrl) {
      setMessage(copy("Certificate link is not ready to share yet.", "Certificate link is not ready to share yet."));
      return;
    }
    openSharePopup(linkedInShareUrl);
  };

  const handleShareToFacebook = () => {
    if (!facebookShareUrl) {
      setMessage(copy("Certificate link is not ready to share yet.", "Certificate link is not ready to share yet."));
      return;
    }
    openSharePopup(facebookShareUrl);
  };

  const handleShareToWhatsApp = () => {
    if (!whatsappShareUrl) {
      setMessage(copy("Certificate link is not ready to share yet.", "Certificate link is not ready to share yet."));
      return;
    }
    openSharePopup(whatsappShareUrl);
  };

  const handleShareByEmail = () => {
    if (!emailShareUrl) {
      setMessage(copy("Certificate link is not ready to share yet.", "Certificate link is not ready to share yet."));
      return;
    }
    window.location.href = emailShareUrl;
  };

  const withExportDocument = async (callback) => {
    let mountedForExport = false;

    if (!exportCertificateRef.current) {
      mountedForExport = true;
      flushSync(() => {
        setRenderExportDocument(true);
      });
      await new Promise((resolve) => window.requestAnimationFrame(() => resolve()));
      await new Promise((resolve) => window.requestAnimationFrame(() => resolve()));
    }

    const node = exportCertificateRef.current || certificateRef.current;
    if (!node) {
      if (mountedForExport) {
        flushSync(() => {
          setRenderExportDocument(false);
        });
      }
      throw new Error("Certificate is not ready yet.");
    }

    try {
      return await callback(node);
    } finally {
      if (mountedForExport) {
        flushSync(() => {
          setRenderExportDocument(false);
        });
      }
    }
  };

  const buildCertificatePng = async () => {
    return withExportDocument(async (node) => {
      await waitForCertificateAssets(node);
      // Extra paint buffer for high-res export visibility
      await delay(150);

      const width = Math.ceil(Math.max(node.scrollWidth, node.clientWidth, node.getBoundingClientRect().width));
      const height = Math.ceil(Math.max(node.scrollHeight, node.clientHeight, node.getBoundingClientRect().height));

      return toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#fbf7ee",
        width,
        height,
        style: {
          width: `${width}px`,
          height: `${height}px`,
          transform: "none",
        },
      });
    });
  };

  const buildCertificateImageBlob = async () => {
    return withExportDocument(async (node) => {
      await waitForCertificateAssets(node);
      await delay(150);

      const width = Math.ceil(Math.max(node.scrollWidth, node.clientWidth, node.getBoundingClientRect().width));
      const height = Math.ceil(Math.max(node.scrollHeight, node.clientHeight, node.getBoundingClientRect().height));

      const blob = await toBlob(node, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#fbf7ee",
        width,
        height,
        style: {
          width: `${width}px`,
          height: `${height}px`,
          transform: "none",
        },
      });

      if (blob) {
        return blob;
      }

      const dataUrl = await buildCertificatePng();
      return dataUrlToBlob(dataUrl);
    });
  };

  const buildCertificatePdf = async ({ autoPrint = false } = {}) => {
    const dataUrl = await buildCertificatePng();
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imageProps = pdf.getImageProperties(dataUrl);
    const imageRatio = imageProps.width / imageProps.height;
    const maxWidth = pageWidth - 12;
    const maxHeight = pageHeight - 12;

    let renderWidth = maxWidth;
    let renderHeight = renderWidth / imageRatio;

    if (renderHeight > maxHeight) {
      renderHeight = maxHeight;
      renderWidth = renderHeight * imageRatio;
    }

    const x = (pageWidth - renderWidth) / 2;
    const y = (pageHeight - renderHeight) / 2;

    pdf.addImage(dataUrl, "PNG", x, y, renderWidth, renderHeight, undefined, "FAST");

    if (autoPrint) {
      pdf.autoPrint();
    }

    return pdf;
  };

  const handleDownloadImage = async () => {
    if (!certificate?.id) return;

    setDownloading(true);
    try {
      const blob = await buildCertificateImageBlob();
      const filename = buildCertificateFilename(certificate, "png");
      triggerFileDownload(blob, filename);
      setMessage(copy("Certificate PNG downloaded successfully.", "সার্টিফিকেট PNG সফলভাবে ডাউনলোড হয়েছে।"));
    } catch {
      setMessage(copy("Could not download the certificate image. Please try again.", "সার্টিফিকেট ডাউনলোড করা যায়নি। আবার চেষ্টা করুন।"));
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!certificate?.id) return;

    setDownloading(true);
    try {
      const pdf = await buildCertificatePdf();
      const blob = pdf.output("blob");
      const filename = buildCertificateFilename(certificate, "pdf");
      triggerFileDownload(blob, filename);
      setMessage(copy("Certificate PDF downloaded successfully.", "সার্টিফিকেট PDF সফলভাবে ডাউনলোড হয়েছে।"));
    } catch {
      setMessage(copy("Could not create the PDF right now. Please try again.", "PDF তৈরি করা যায়নি। আবার চেষ্টা করুন।"));
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadLetterPdf = async () => {
    if (!certificate?.id) return;

    setDownloading(true);
    try {
      const dataUrl = await withExportDocument(async (node) => {
        // Switch context to letter node
        setRenderLetterExport(true);
        await new Promise((resolve) => window.requestAnimationFrame(() => resolve()));
        await waitForCertificateAssets(letterRef.current);
        await delay(150);

        const width = letterRef.current.clientWidth;
        const height = letterRef.current.clientHeight;

        const png = await toPng(letterRef.current, {
          cacheBust: true,
          pixelRatio: 2,
          backgroundColor: "#ffffff",
          width,
          height,
        });
        setRenderLetterExport(false);
        return png;
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(dataUrl, "PNG", 0, 0, pageWidth, pageHeight, undefined, "FAST");

      const blob = pdf.output("blob");
      const filename = sanitizeFilename(`contribution-letter-${certificate.recipientName}.pdf`);
      triggerFileDownload(blob, filename);
      setMessage(copy("Letter PDF downloaded successfully.", "Letter PDF সফলভাবে ডাউনলোড হয়েছে।"));
    } catch (err) {
      console.error(err);
      setMessage(copy("Could not create the letter PDF.", "Letter PDF তৈরি করা যায়নি।"));
    } finally {
      setDownloading(false);
    }
  };

  const handleOpenPrintReadyPdf = async () => {
    if (!certificate?.id) return;

    setDownloading(true);
    try {
      const pdf = await buildCertificatePdf({ autoPrint: true });
      const blobUrl = pdf.output("bloburl");
      window.open(blobUrl, "_blank", "noopener,noreferrer");
      setMessage(copy("A print-ready PDF has been opened in a new tab.", "A print-ready PDF has been opened in a new tab."));
    } catch {
      setMessage(copy("Could not prepare the print-ready PDF. Please try again.", "Could not prepare the print-ready PDF. Please try again."));
    } finally {
      setDownloading(false);
    }
  };

  const statusNotice = certificate?.status === "active"
    ? {
        title: copy("Certificate verified", "Certificate verified"),
        body: copy(
          "This credential is active on the official EquiSaaS BD verification page.",
          "এই credential টি official EquiSaaS BD verification page-এ সক্রিয় অবস্থায় আছে।",
        ),
        icon: ShieldCheck,
        variant: "default",
      }
    : certificate?.status === "revoked"
      ? {
          title: copy("Certificate revoked", "Certificate revoked"),
          body: copy(
            "This certificate record still exists for verification history, but it is no longer valid.",
            "এই certificate record verification history-এর জন্য আছে, কিন্তু এটি আর valid নয়।",
          ),
          icon: ShieldAlert,
          variant: "destructive",
        }
      : certificate
        ? {
            title: copy("Draft preview", "Draft preview"),
            body: copy(
              "This certificate is visible because a privileged account is signed in. Public visitors cannot verify drafts.",
              "একটি privileged account signed in থাকার কারণে এই certificate দেখা যাচ্ছে। Public visitor draft verify করতে পারে না।",
            ),
            icon: Search,
            variant: "default",
          }
        : null;

  const StatusIcon = statusNotice?.icon || Search;

  return (
    <PublicShell showAuthActions={!authState.isAuthenticated} printMinimal>
      <div className="certificate-page space-y-6">
        <AnimatedBlock direction="up" delay={0.03} className="print:hidden">
          <Card className="workspace-hero hover-glow rounded-[2rem] border-0 shadow-xl">
            <CardHeader className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Badge variant="subtle" className="rounded-full px-4 py-1.5 text-sm">
                    {copy("Certificate Verification", "Certificate Verification")}
                  </Badge>
                  <CardTitle className="mt-4 text-3xl">
                    {copy("Verify an EquiSaaS BD certificate online", "Verify an EquiSaaS BD certificate online")}
                  </CardTitle>
                  <CardDescription className="mt-2 max-w-3xl text-base leading-7">
                    {copy(
                      "Paste the verification link or certificate ID to confirm whether the certificate is active, revoked, or still in draft.",
                      "সার্টিফিকেট active, revoked, নাকি draft আছে তা নিশ্চিত করতে verification link বা certificate ID দিন।",
                    )}
                  </CardDescription>
                </div>
                {certificateUrl ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" className="rounded-2xl transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]" onClick={handleCopyLink}>
                        <Copy className="h-4 w-4" />
                        {copy("Copy link", "Copy link")}
                      </Button>
                      <Button variant="outline" className="rounded-2xl transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]" onClick={handleDownloadImage} disabled={downloading || !certificate?.id}>
                        <Download className="h-4 w-4" />
                        {downloading ? copy("Preparing PNG...", "Preparing PNG...") : copy("Download PNG", "Download PNG")}
                      </Button>
                      <Button variant="outline" className="rounded-2xl transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]" onClick={handleDownloadPdf} disabled={downloading || !certificate?.id}>
                        <FileDown className="h-4 w-4" />
                        {copy("Download PDF", "Download PDF")}
                      </Button>
                      <Button variant="outline" className="rounded-2xl transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]" onClick={handleOpenPrintReadyPdf} disabled={downloading || !certificate?.id}>
                        <ExternalLink className="h-4 w-4" />
                        {copy("Open print-ready PDF", "Open print-ready PDF")}
                      </Button>
                      <Button variant="outline" className="rounded-2xl border-primary text-primary transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]" onClick={handleDownloadLetterPdf} disabled={downloading || !certificate?.id}>
                        <FileDown className="h-4 w-4" />
                        {copy("Download Contribution Letter", "Contribution Letter ডাউনলোড")}
                      </Button>
                      <Button variant="ghost" className="rounded-2xl transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]" asChild>
                        <a href={certificateUrl} target="_blank" rel="noreferrer">
                          <ExternalLink className="h-4 w-4" />
                          {copy("Open exact link", "Open exact link")}
                        </a>
                      </Button>
                    </div>

                    <div className="rounded-[1.5rem] border border-primary/15 bg-primary/[0.05] p-4">
                      <div className="mb-3 flex flex-col gap-1">
                        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">
                          {copy("Share tools", "Share tools")}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {copy(
                            "LinkedIn, Facebook, WhatsApp, email, and copy-ready LinkedIn details are available here.",
                            "LinkedIn, Facebook, WhatsApp, email, and copy-ready LinkedIn details are available here.",
                          )}
                        </p>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                        <Button variant="outline" className={quickShareButtonClassName} onClick={handleShareToLinkedIn}>
                          <Globe2 className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                          {copy("Share on LinkedIn", "Share on LinkedIn")}
                        </Button>
                        <Button variant="outline" className={quickShareButtonClassName} onClick={handleShareToFacebook}>
                          <Users className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                          {copy("Share on Facebook", "Share on Facebook")}
                        </Button>
                        <Button variant="outline" className={quickShareButtonClassName} onClick={handleShareToWhatsApp}>
                          <MessageCircle className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                          {copy("Share on WhatsApp", "Share on WhatsApp")}
                        </Button>
                        <Button variant="outline" className={quickShareButtonClassName} onClick={handleShareByEmail}>
                          <Mail className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                          {copy("Share by email", "Share by email")}
                        </Button>
                        <Button variant="outline" className={quickShareButtonClassName} onClick={handleNativeShare}>
                          <Share2 className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                          {copy("Open share sheet", "Open share sheet")}
                        </Button>
                        <Button variant="outline" className={quickShareButtonClassName} onClick={handleCopyLinkedInDetails}>
                          <Copy className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                          {copy("Copy LinkedIn details", "Copy LinkedIn details")}
                        </Button>
                        <Button variant="outline" className={cn(quickShareButtonClassName, "border-primary/40 text-primary")} onClick={handleDownloadLetterPdf} disabled={downloading}>
                          <FileDown className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                          {copy("Download Contribution Letter", "Contribution Letter")}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
                <Input
                  value={lookupValue}
                  onChange={(event) => setLookupValue(event.target.value)}
                  placeholder={copy("Paste certificate link or certificate ID", "Paste certificate link or certificate ID")}
                />
                <Button className="min-w-[12rem] rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]" onClick={handleLookup}>
                  <Search className="h-4 w-4" />
                  {copy("Verify now", "Verify now")}
                </Button>
              </div>

              {message ? (
                <Alert variant={!certificate && !loading ? "destructive" : "default"}>
                  <AlertTitle>{copy("Verification update", "Verification update")}</AlertTitle>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              ) : null}

              {statusNotice ? (
                <Alert variant={statusNotice.variant}>
                  <StatusIcon className="h-4 w-4" />
                  <AlertTitle>{statusNotice.title}</AlertTitle>
                  <AlertDescription>{statusNotice.body}</AlertDescription>
                </Alert>
              ) : null}
            </CardContent>
          </Card>
        </AnimatedBlock>

        {loading ? (
          <AnimatedBlock direction="up" delay={0.08} className="print:hidden">
            <Card className="rounded-[2rem] border shadow-xl" data-reveal="up">
              <CardContent className="space-y-4 p-6" aria-busy="true" aria-label={copy("Loading certificate", "Loading certificate")}>
                <Skeleton className="h-8 w-52 rounded-xl" />
                <Skeleton className="h-[24rem] w-full rounded-[2rem]" />
              </CardContent>
            </Card>
          </AnimatedBlock>
        ) : null}

        {!loading && certificate ? (
          <>
            <AnimatedBlock direction="up" delay={0.08}>
              <div className="certificate-stage-frame print:contents">
                <section className="certificate-stage pb-2">
                  <CertificateDocument ref={certificateRef} certificate={certificate} />
                </section>
              </div>
            </AnimatedBlock>
          </>
        ) : null}

        {!loading && certificateUrl ? (
          <>
            <AnimatedBlock direction="up" delay={0.14} className="print:hidden">
              <Card className="rounded-[2rem] border shadow-xl">
                <CardHeader className="space-y-3">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <Badge variant="subtle" className="rounded-full px-4 py-1.5 text-sm">
                        {copy("Share and LinkedIn tools", "Share and LinkedIn tools")}
                      </Badge>
                      <CardTitle className="mt-4 text-2xl">
                        {copy("Share this certificate and add it to professional profiles", "Share this certificate and add it to professional profiles")}
                      </CardTitle>
                      <CardDescription className="mt-2 max-w-3xl text-base leading-7">
                        {copy(
                          "Use the official verification link for LinkedIn, Facebook, WhatsApp, email, or other professional sharing. LinkedIn autofill is not guaranteed, so we also provide copy-ready credential details.",
                          "Use the official verification link for LinkedIn, Facebook, WhatsApp, email, or other professional sharing. LinkedIn autofill is not guaranteed, so we also provide copy-ready credential details.",
                        )}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    <Button variant="outline" className={shareButtonClassName} onClick={handleShareToLinkedIn}>
                      <Globe2 className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                      {copy("Share on LinkedIn", "Share on LinkedIn")}
                    </Button>
                    <Button variant="outline" className={shareButtonClassName} onClick={handleShareToFacebook}>
                      <Users className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                      {copy("Share on Facebook", "Share on Facebook")}
                    </Button>
                    <Button variant="outline" className={shareButtonClassName} onClick={handleShareToWhatsApp}>
                      <MessageCircle className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                      {copy("Share on WhatsApp", "Share on WhatsApp")}
                    </Button>
                    <Button variant="outline" className={shareButtonClassName} onClick={handleShareByEmail}>
                      <Mail className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                      {copy("Share by email", "Share by email")}
                    </Button>
                    <Button variant="outline" className={shareButtonClassName} onClick={handleNativeShare}>
                      <Share2 className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                      {copy("Open share sheet", "Open share sheet")}
                    </Button>
                    <Button variant="outline" className={shareButtonClassName} onClick={handleCopyLinkedInDetails}>
                      <Copy className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                      {copy("Copy LinkedIn details", "Copy LinkedIn details")}
                    </Button>
                  </div>

                  <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
                    <Card className="rounded-[1.5rem] border bg-muted/20 shadow-none">
                      <CardHeader className="space-y-2">
                        <CardTitle className="text-lg">
                          {copy("Official verification link", "Official verification link")}
                        </CardTitle>
                        <CardDescription>
                          {copy("Use this URL in LinkedIn Licenses & Certifications, professional profiles, and public shares.", "Use this URL in LinkedIn Licenses & Certifications, professional profiles, and public shares.")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="interactive-tile rounded-2xl border border-dashed border-primary/25 bg-primary/5 px-4 py-3">
                          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">
                            {copy("Sharing this exact URL:", "Sharing this exact URL:")}
                          </div>
                          <div className="mt-2 break-all text-sm font-medium text-foreground">
                            {certificateUrl}
                          </div>
                        </div>
                        <div className={infoTileClassName}>
                          <div className="text-sm break-all">{certificateUrl}</div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" className="rounded-2xl transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]" onClick={handleCopyLink}>
                            <Copy className="h-4 w-4" />
                            {copy("Copy link", "Copy link")}
                          </Button>
                          <Button variant="ghost" className="rounded-2xl transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]" asChild>
                            <a href={certificateUrl} target="_blank" rel="noreferrer">
                              <ExternalLink className="h-4 w-4" />
                              {copy("Open link", "Open link")}
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-[1.5rem] border bg-muted/20 shadow-none">
                      <CardHeader className="space-y-2">
                        <CardTitle className="text-lg">
                          {copy("LinkedIn-ready fields", "LinkedIn-ready fields")}
                        </CardTitle>
                        <CardDescription>
                          {copy("Paste these values into LinkedIn Licenses & Certifications if LinkedIn does not autofill everything.", "Paste these values into LinkedIn Licenses & Certifications if LinkedIn does not autofill everything.")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className={infoTileClassName}>
                            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                              {copy("Certificate name", "Certificate name")}
                            </div>
                            <div className="mt-2 font-medium leading-6">{certificate?.certificateTitle || "EquiSaaS BD Certificate"}</div>
                          </div>
                          <div className={infoTileClassName}>
                            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                              {copy("Issuing organization", "Issuing organization")}
                            </div>
                            <div className="mt-2 font-medium leading-6">EquiSaaS BD</div>
                          </div>
                          <div className={infoTileClassName}>
                            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                              {copy("Issue date", "Issue date")}
                            </div>
                            <div className="mt-2 font-medium leading-6">{certificate?.issueDateLabel || certificate?.issueDateKey || "-"}</div>
                          </div>
                          <div className={infoTileClassName}>
                            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                              {copy("Credential ID", "Credential ID")}
                            </div>
                            <div className="mt-2 break-all font-medium leading-6">{certificate?.certificateNumber || resolvedCertificateId || "-"}</div>
                          </div>
                        </div>
                        <div className={infoTileClassName}>
                          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                            {copy("Credential URL", "Credential URL")}
                          </div>
                          <div className="mt-2 break-all font-medium leading-6">{certificateUrl}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </AnimatedBlock>
            {renderExportDocument ? (
              <div className="pointer-events-none fixed left-[-10000px] top-0 z-[-1] opacity-100" aria-hidden="true">
                <CertificateDocument ref={exportCertificateRef} certificate={certificate} exportMode />
              </div>
            ) : null}
            {renderLetterExport ? (
              <div className="pointer-events-none fixed left-[-10000px] top-0 z-[-1] opacity-100" aria-hidden="true">
                <ContributionLetterTemplate ref={letterRef} certificate={certificate} />
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </PublicShell>
  );
}
