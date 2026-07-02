"use client";

import { forwardRef } from "react";
import { CalendarDays, FileCheck2, ShieldAlert, ShieldCheck } from "lucide-react";
import { CertificateQrCode } from "@/components/certificates/certificate-qr-code";
import { Badge } from "@/components/ui/badge";
import { formatDateKey, formatDateTime } from "@/lib/date";
import { statusVariant } from "@/lib/display";
import { useLocale } from "@/components/providers/locale-provider";
import { cn } from "@/lib/utils";

const CERTIFICATE_ASSET_VERSION = "20260407b";
const ENGLISH_LOGO_URL = `/logo.svg?v=${CERTIFICATE_ASSET_VERSION}`;
const FAVICON_URL = `/favicon.png?v=${CERTIFICATE_ASSET_VERSION}`;
const HR_SIGNATURE_URL = `/hr-signature.png?v=${CERTIFICATE_ASSET_VERSION}`;
const HR_SEAL_URL = `/hr-seal.png?v=${CERTIFICATE_ASSET_VERSION}`;
const OFFICIAL_SEAL_URL = `/official-seal.png?v=${CERTIFICATE_ASSET_VERSION}`;
const CERTIFICATE_SERIF = "\"Georgia\", \"Times New Roman\", serif";
const HR_SIGNATORY_NAME = "Sandipta Karmakar Barno";
const HR_SIGNATORY_TITLE = "Director of HR & Operations";
const HR_SIGNATORY_ORGANIZATION = "EquiSaaS BD";
const MD_SIGNATURE_URL = `/md-chairman-signature.png?v=${CERTIFICATE_ASSET_VERSION}`;
const MD_SEAL_URL = `/md-chairman-seal.png?v=${CERTIFICATE_ASSET_VERSION}`;
const MD_SIGNATORY_NAME = "Kholipha Ahmmad Al-Amin";
const MD_SIGNATORY_TITLE = "Managing Director & Chairman";
const MD_SIGNATORY_ORGANIZATION = "EquiSaaS BD";
const LEGACY_FOUNDER_NAME = "Kholipha Ahmmad Al-Amin";
const LEGACY_FOUNDER_TITLE = "Founder & CEO, EquiSaaS BD";

export const StandardEquisaasTemplate = forwardRef(function StandardEquisaasTemplate(
  { certificate, className = "", exportMode = false },
  ref,
) {
  const { copy } = useLocale();
  if (!certificate) return null;

  const issueDate = formatDateKey(certificate.issueDateKey, "en-BD");
  const completionDate = formatDateKey(certificate.completionDateKey, "en-BD");
  const statusText = certificate.status === "active"
    ? "Verified"
    : certificate.status === "revoked"
      ? "Revoked"
      : "Draft";
  const StatusIcon = certificate.status === "active" ? ShieldCheck : certificate.status === "revoked" ? ShieldAlert : FileCheck2;
  const rawAuthorityName = String(certificate.signerName || "").trim();
  const rawAuthorityTitle = String(certificate.signerTitle || "").trim();
  const issuerOrganization = certificate.issuerOrganization || "EquiSaaS BD";
  const isLegacyFounderAuthority =
    rawAuthorityName === LEGACY_FOUNDER_NAME &&
    rawAuthorityTitle === LEGACY_FOUNDER_TITLE;
  const isHrAuthority =
    rawAuthorityName === HR_SIGNATORY_NAME &&
    rawAuthorityTitle === HR_SIGNATORY_TITLE;
  const authorityNote = rawAuthorityName && !isLegacyFounderAuthority && !isHrAuthority
    ? [rawAuthorityName, rawAuthorityTitle, issuerOrganization].filter(Boolean).join(" • ")
    : "";
  
  const themeStyle = certificate.themeStyle || "classic";
  const labelOverrides = certificate.labelOverrides || {};
  const lblDept = labelOverrides.department || "Department";
  const lblIssue = labelOverrides.issueDate || "Issue Date";

  const isDark = themeStyle === "dark";
  const isMinimal = themeStyle === "minimalist";

  const customColors = certificate.customColors || {};

  const themeVars = {
    bgInner: customColors.cardBg || (isDark ? "rgba(15,23,42,0.95)" : isMinimal ? "rgba(255,255,255,1)" : "rgba(250,245,234,1)"),
    borderOuter: customColors.borderOuter ? "" : (isDark ? "border-slate-800" : isMinimal ? "border-slate-200" : "border-[#d9cfb8]"),
    borderInner: customColors.borderOuter ? "" : (isDark ? "border-slate-700/50" : isMinimal ? "border-slate-100" : "border-[#eee3cd]"),
    bgTheme: customColors.bgTheme ? "" : (isDark ? "bg-slate-950" : "bg-[#fbf7ee]"),
    textMain: customColors.textMain ? "" : (isDark ? "text-slate-100" : isMinimal ? "text-slate-800" : "text-slate-900"),
    textMuted: customColors.textMain ? "" : (isDark ? "text-slate-400" : "text-slate-500"),
    textPrimary: customColors.textPrimary ? "" : (isDark ? "text-sky-400" : isMinimal ? "text-slate-600" : "text-[#0f4c81]"),
    cardBg: customColors.cardBg ? "" : (isDark ? "bg-slate-900" : "bg-white/90"),
    cardBorder: customColors.borderOuter ? "" : (isDark ? "border-slate-800" : isMinimal ? "border-slate-200" : "border-[#d9cfb8]"),
    fieldBg: customColors.cardBg ? "" : (isDark ? "bg-slate-800/50" : "bg-[#fcfaf5]"),
    fieldBorder: customColors.borderOuter ? "" : (isDark ? "border-slate-700" : "border-[#eadfcb]"),
    topBar: isDark ? "bg-[linear-gradient(90deg,#38bdf8,#0ea5e9,#38bdf8)]" : isMinimal ? "bg-transparent" : "bg-[linear-gradient(90deg,#0f4c81,#2f77a8,#0f4c81)]",
  };

  const dynamicStyles = {
    wrapper: {
      backgroundColor: customColors.bgTheme || undefined,
      color: customColors.textMain || undefined,
      borderColor: customColors.borderOuter || undefined,
    },
    borderOuter: { borderColor: customColors.borderOuter || undefined },
    textMuted: { color: customColors.textMain || undefined, opacity: customColors.textMain ? 0.75 : undefined },
    textPrimary: { color: customColors.textPrimary || undefined },
    card: { backgroundColor: customColors.cardBg || undefined, borderColor: customColors.borderOuter || undefined },
  };

  return (
    <article
      ref={ref}
      className={cn(
        "certificate-sheet relative border shadow-[0_28px_90px_rgba(15,23,42,0.16)]",
        themeVars.bgTheme,
        themeVars.textMain,
        themeVars.borderOuter,
        !exportMode && "certificate-sheet-interactive",
        exportMode
          ? "w-[1600px] min-h-[1131px] rounded-none"
          : "mx-auto w-full max-w-[1400px] rounded-[2rem] print:mx-0 print:max-w-none print:rounded-none print:shadow-none",
        className,
      )}
      style={dynamicStyles.wrapper}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0" style={{ background: `linear-gradient(145deg, transparent, ${themeVars.bgInner} 42%, transparent)` }} />
        <div className={cn("absolute inset-[14px] border", themeVars.borderOuter)} style={dynamicStyles.borderOuter} />
        <div className={cn("absolute inset-[26px] border", themeVars.borderInner)} style={dynamicStyles.borderOuter} />
        <div className={cn("absolute inset-x-0 top-0 h-4", themeVars.topBar)} />
        <div className="absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 opacity-[0.06] mix-blend-multiply">
          <img
            src={OFFICIAL_SEAL_URL}
            alt=""
            className="h-full w-full object-contain"
            width="352"
            height="352"
          />
        </div>
      </div>

      <div className={cn("relative flex h-full flex-col", exportMode ? "px-16 py-12" : "px-5 py-5 sm:px-8 sm:py-8 print:px-[11mm] print:py-[10mm]")}>
        <header className={cn("gap-5", exportMode ? "flex items-start justify-between" : "flex flex-col items-start justify-between lg:flex-row")}>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <img src={FAVICON_URL} alt="EquiSaaS BD" width={32} height={32} className="h-8 w-8 object-contain" />
              <Badge variant={statusVariant(certificate.status)} className="w-fit rounded-full px-4 py-1.5 text-sm shadow-sm">
                <StatusIcon className="mr-2 h-4 w-4" />
                {statusText}
              </Badge>
            </div>
            <p className={cn("max-w-[24rem] text-sm leading-7", themeVars.textMuted)} style={dynamicStyles.textMuted}>
              Issued by EquiSaaS BD as an official online-verifiable completion record.
            </p>
          </div>

          <div className={cn("grid gap-3", exportMode ? "text-right" : "w-full max-w-[22rem] text-left lg:w-auto lg:text-right")}>
            <div className={cn("rounded-[1.3rem] border px-4 py-3 shadow-sm", themeVars.cardBg, themeVars.cardBorder)} style={dynamicStyles.card}>
              <p className={cn("text-[11px] font-semibold uppercase tracking-[0.22em]", themeVars.textPrimary)} style={dynamicStyles.textPrimary}>Certificate Number</p>
              <p className="mt-1 text-sm font-semibold">{certificate.certificateNumber}</p>
            </div>
            <div className={cn("rounded-[1.3rem] border px-4 py-3 shadow-sm", themeVars.cardBg, themeVars.cardBorder)} style={dynamicStyles.card}>
              <p className={cn("text-[11px] font-semibold uppercase tracking-[0.22em]", themeVars.textPrimary)} style={dynamicStyles.textPrimary}>Verification Code</p>
              <p className="mt-1 text-sm font-semibold">{certificate.verificationCode}</p>
            </div>
          </div>
        </header>

        <section className={cn("flex flex-1 flex-col justify-between", exportMode ? "pt-6" : "pt-5 sm:pt-6")}>
          <div className={cn("text-center", exportMode ? "space-y-7" : "space-y-5 sm:space-y-6")}>
            <div className="flex justify-center">
              <img
                src={ENGLISH_LOGO_URL}
                alt="EquiSaaS BD logo"
                className={cn("object-contain", exportMode ? "h-16 w-auto" : "h-14 w-auto")}
                width="320"
                height="56"
              />
            </div>

            <div className="space-y-4">
              <p className={cn("text-sm font-semibold uppercase tracking-[0.42em]", themeVars.textPrimary)} style={dynamicStyles.textPrimary}>Official Certificate Record</p>
              <h1
                className={cn("mx-auto max-w-5xl", themeVars.textMain, exportMode ? "text-[3.25rem] leading-[1.08]" : "text-[clamp(2rem,4.2vw,3rem)] leading-[1.1]")}
                style={{ fontFamily: CERTIFICATE_SERIF, ...dynamicStyles.wrapper }}
              >
                {certificate.certificateTitle}
              </h1>
            </div>

            <div className="space-y-3">
              <p className={cn("text-sm font-semibold uppercase tracking-[0.34em]", themeVars.textMuted)} style={dynamicStyles.textMuted}>This certifies that</p>
              <p
                className={cn("mx-auto max-w-4xl border-b pb-4", themeVars.borderOuter, themeVars.textMain, exportMode ? "text-[4.15rem] leading-none" : "text-[clamp(2.5rem,6vw,3.85rem)] leading-[0.98]")}
                style={{ fontFamily: CERTIFICATE_SERIF, ...dynamicStyles.wrapper }}
              >
                {certificate.recipientName}
              </p>
            </div>

            <div className="space-y-4">
              <p className={cn("mx-auto max-w-4xl", themeVars.textMuted, exportMode ? "text-lg leading-8" : "text-base leading-7 sm:text-lg sm:leading-8")} style={dynamicStyles.textMuted}>
                has successfully completed the verified EquiSaaS BD learning and delivery requirement listed below.
              </p>
              <div
                className={cn(
                  "mx-auto max-w-4xl rounded-[1.6rem] border shadow-sm",
                  themeVars.cardBg,
                  themeVars.cardBorder,
                  !exportMode && "interactive-tile",
                  exportMode ? "px-7 py-6" : "px-5 py-5 sm:px-7 sm:py-6",
                )}
                style={dynamicStyles.card}
              >
                <p className={cn("text-xs font-semibold uppercase tracking-[0.34em]", themeVars.textPrimary)} style={dynamicStyles.textPrimary}>Recognized Subject</p>
                <p
                  className={cn("mt-3 leading-tight", themeVars.textMain, exportMode ? "text-[2.2rem]" : "text-[clamp(1.7rem,3.6vw,2.2rem)]")}
                  style={{ fontFamily: CERTIFICATE_SERIF, color: dynamicStyles.wrapper.color }}
                >
                  {certificate.subjectTitle}
                </p>
                {certificate.achievementSummary ? (
                  <p className={cn("mx-auto mt-3 max-w-3xl text-sm leading-7", themeVars.textMuted)} style={dynamicStyles.textMuted}>
                    {certificate.achievementSummary}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className={cn("mt-6 gap-5", exportMode ? "grid grid-cols-[1.15fr_0.85fr_0.95fr]" : "grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr_0.95fr]")}>
            <section
              className={cn(
                "rounded-[1.7rem] border p-5 shadow-sm",
                themeVars.cardBg,
                themeVars.cardBorder,
                !exportMode && "interactive-tile",
              )}
              style={dynamicStyles.card}
            >
              <h2 className={cn("text-lg font-semibold", themeVars.textMain)}>Credential Details</h2>
              <p className={cn("mt-1 text-sm", themeVars.textMuted)} style={dynamicStyles.textMuted}>Official completion and course reference record.</p>

              <dl className={cn("mt-4 grid gap-3", exportMode ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2")}>
                <div className={cn("rounded-2xl border p-4", themeVars.fieldBg, themeVars.fieldBorder)} style={dynamicStyles.card}>
                  <dt className={cn("text-[11px] font-semibold uppercase tracking-[0.22em]", themeVars.textPrimary)} style={dynamicStyles.textPrimary}>{lblDept}</dt>
                  <dd className={cn("mt-2 text-sm font-semibold", themeVars.textMain)}>{certificate.departmentTitle}</dd>
                </div>
                <div className={cn("rounded-2xl border p-4", themeVars.fieldBg, themeVars.fieldBorder)} style={dynamicStyles.card}>
                  <dt className={cn("text-[11px] font-semibold uppercase tracking-[0.22em]", themeVars.textPrimary)} style={dynamicStyles.textPrimary}>Course Reference</dt>
                  <dd className={cn("mt-2 text-sm font-semibold", themeVars.textMain)}>{certificate.courseTitle || "Custom subject"}</dd>
                </div>
                <div className={cn("rounded-2xl border p-4", themeVars.fieldBg, themeVars.fieldBorder)} style={dynamicStyles.card}>
                  <dt className={cn("text-[11px] font-semibold uppercase tracking-[0.22em]", themeVars.textPrimary)} style={dynamicStyles.textPrimary}>Completion Date</dt>
                  <dd className={cn("mt-2 text-sm font-semibold", themeVars.textMain)}>{completionDate}</dd>
                </div>
                <div className={cn("rounded-2xl border p-4", themeVars.fieldBg, themeVars.fieldBorder)} style={dynamicStyles.card}>
                  <dt className={cn("text-[11px] font-semibold uppercase tracking-[0.22em]", themeVars.textPrimary)} style={dynamicStyles.textPrimary}>{lblIssue}</dt>
                  <dd className={cn("mt-2 text-sm font-semibold", themeVars.textMain)}>{issueDate}</dd>
                </div>
              </dl>

              <div className={cn("mt-4 rounded-2xl border p-4", themeVars.fieldBg, themeVars.fieldBorder)} style={dynamicStyles.card}>
                <div className={cn("flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em]", themeVars.textPrimary)} style={dynamicStyles.textPrimary}>
                  <CalendarDays className="h-4 w-4" />
                  Authenticity Statement
                </div>
                <p className={cn("mt-3 text-sm leading-7", themeVars.textMuted)} style={dynamicStyles.textMuted}>
                  This certificate remains valid only when the certificate number, verification code, QR code, and public verification URL resolve to the same official EquiSaaS BD record.
                </p>
              </div>
            </section>

            <section
              className={cn(
                "rounded-[1.7rem] border p-5 shadow-sm",
                themeVars.cardBg,
                themeVars.cardBorder,
                !exportMode && "interactive-tile",
              )}
              style={dynamicStyles.card}
            >
              <h2 className={cn("text-lg font-semibold", themeVars.textMain)}>Digital Verification</h2>
              <p className={cn("mt-1 text-sm", themeVars.textMuted)} style={dynamicStyles.textMuted}>Scan or open the official verification URL to validate this certificate online.</p>

              <div className="mt-5 flex flex-col items-center gap-4 text-center">
                <CertificateQrCode
                  value={certificate.verificationUrl}
                  label={`QR code for certificate ${certificate.certificateNumber}`}
                  size={exportMode ? 180 : 156}
                  className="rounded-2xl border-[#d9cfb8] p-2"
                />

                <div className={cn("w-full rounded-2xl border px-4 py-3 text-left", themeVars.fieldBg, themeVars.fieldBorder)} style={dynamicStyles.card}>
                  <p className={cn("text-[11px] font-semibold uppercase tracking-[0.22em]", themeVars.textPrimary)} style={dynamicStyles.textPrimary}>Verification URL</p>
                  <p className={cn("mt-2 break-all text-sm font-medium", themeVars.textMain)}>{certificate.verificationUrl}</p>
                  {certificate.updatedAt ? (
                    <p className={cn("mt-3 text-xs", themeVars.textMuted)} style={dynamicStyles.textMuted}>Last updated: {formatDateTime(certificate.updatedAt)}</p>
                  ) : null}
                </div>
              </div>
            </section>

            <section
              className={cn(
                "rounded-[1.7rem] border p-5 shadow-sm",
                themeVars.cardBg,
                themeVars.cardBorder,
                !exportMode && "interactive-tile",
              )}
              style={dynamicStyles.card}
            >
              <h2 className={cn("text-lg font-semibold", themeVars.textMain)}>Authorized Signatories</h2>
              <p className={cn("mt-1 text-sm", themeVars.textMuted)} style={dynamicStyles.textMuted}>Verified under the authority of EquiSaaS BD.</p>

              <div className={cn("mt-5 grid gap-4", exportMode ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2")}>
                {/* HR Signatory */}
                <div className={cn("rounded-[1.5rem] border px-4 py-6 flex flex-col items-center justify-center gap-5", themeVars.fieldBg, themeVars.fieldBorder)} style={dynamicStyles.card}>
                  <img
                    src={HR_SEAL_URL}
                    alt=""
                    className="h-auto w-[6rem] object-contain mix-blend-multiply opacity-95"
                    width="96"
                    height="96"
                  />
                  <img
                    src={HR_SIGNATURE_URL}
                    alt=""
                    className="h-auto w-[14rem] object-contain mix-blend-multiply"
                    width="224"
                    height="96"
                  />
                </div>

                {/* MD & Chairman Signatory */}
                <div className={cn("rounded-[1.5rem] border px-4 py-6 flex flex-col items-center justify-center gap-5", themeVars.fieldBg, themeVars.fieldBorder)} style={dynamicStyles.card}>
                  <img
                    src={MD_SEAL_URL}
                    alt=""
                    className="h-auto w-[6rem] object-contain mix-blend-multiply opacity-95"
                    width="96"
                    height="96"
                  />
                  <img
                    src={MD_SIGNATURE_URL}
                    alt=""
                    className="h-auto w-[14rem] object-contain mix-blend-multiply"
                    width="224"
                    height="96"
                  />
                </div>
              </div>

              {authorityNote ? (
                <div className={cn("mt-4 rounded-2xl border px-3 py-3 text-center", themeVars.fieldBg, themeVars.fieldBorder)} style={dynamicStyles.card}>
                  <p className={cn("text-[11px] font-semibold uppercase tracking-[0.22em]", themeVars.textPrimary)} style={dynamicStyles.textPrimary}>
                    Certificate Authority
                  </p>
                  <p className={cn("mt-2 text-sm leading-6", themeVars.textMuted)} style={dynamicStyles.textMuted}>
                    {authorityNote}
                  </p>
                </div>
              ) : null}
            </section>
          </div>
        </section>

        <footer className={cn("mt-5 border-t pt-4 text-sm", themeVars.borderOuter, themeVars.textMuted, exportMode ? "flex items-end justify-between" : "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between")} style={{...dynamicStyles.borderOuter, ...dynamicStyles.textMuted}}>
          <div>
            <p className={cn("font-semibold", themeVars.textMain)}>{copy("Official record issued by", "ইস্যুকারী:")} {issuerOrganization}</p>
            <p>Together We Build, Together We Own</p>
          </div>
          <div className="max-w-[28rem] text-right">
            <p className={cn("font-semibold", themeVars.textMain)}>Verification URL</p>
            <p className="break-all">{certificate.verificationUrl}</p>
          </div>
        </footer>
      </div>
    </article>
  );
});
