"use client";

import { forwardRef } from "react";
import { CertificateQrCode } from "@/components/certificates/certificate-qr-code";
import { formatDateKey } from "@/lib/date";
import { cn } from "@/lib/utils";

const CERTIFICATE_ASSET_VERSION = "20260407b";
const EQUISAAS_LOGO_URL = `/logo.svg?v=${CERTIFICATE_ASSET_VERSION}`;
const GLC_LOGO_URL = `/glc-logo.png?v=${CERTIFICATE_ASSET_VERSION}`;
// We use a fallback font since Playfair Display might not be loaded
const CERTIFICATE_SERIF = "\"Georgia\", \"Times New Roman\", serif";
const CERTIFICATE_SANS = "\"Inter\", \"Segoe UI\", sans-serif";

export const GlcSpokenEnglishTemplate = forwardRef(function GlcSpokenEnglishTemplate(
  { certificate, className = "", exportMode = false },
  ref,
) {
  if (!certificate) return null;

  const issueDate = formatDateKey(certificate.issueDateKey, "en-BD");
  
  // Create a unique serial ID from the certificate number or timestamp
  const uniqueStudentNumber = certificate.certificateNumber || "0001";
  const verificationSerialId = `GLC-EQS-2026-${uniqueStudentNumber}`;

  const themeVars = {
    bgOuter: "bg-[#f4f7f6]", // Soft, premium gray/blue tint
    bgInner: "bg-white",
    borderOuter: "border-slate-300",
    borderInner: "border-emerald-600/20",
    textMain: "text-slate-900",
    textMuted: "text-slate-600",
    textAccent: "text-emerald-800",
    accentGradient: "bg-[linear-gradient(90deg,#047857,#10b981,#047857)]",
  };

  return (
    <article
      ref={ref}
      className={cn(
        "certificate-sheet relative border shadow-[0_28px_90px_rgba(15,23,42,0.16)]",
        themeVars.bgOuter,
        themeVars.textMain,
        themeVars.borderOuter,
        !exportMode && "certificate-sheet-interactive",
        exportMode
          ? "w-[1600px] min-h-[1131px] rounded-none"
          : "mx-auto w-full max-w-[1400px] rounded-[2rem] print:mx-0 print:max-w-none print:rounded-none print:shadow-none",
        className,
      )}
      style={{ fontFamily: CERTIFICATE_SANS }}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className={cn("absolute inset-[14px] bg-white shadow-sm")} />
        <div className={cn("absolute inset-[26px] border-[2px]", themeVars.borderInner)} />
        <div className={cn("absolute inset-x-0 top-0 h-4", themeVars.accentGradient)} />
        
        {/* Subtle decorative background element */}
        <div className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 opacity-[0.03] mix-blend-multiply">
          <svg viewBox="0 0 100 100" className="h-full w-full" fill="currentColor">
            <path d="M50 0L61 39L100 50L61 61L50 100L39 61L0 50L39 39L50 0Z" />
          </svg>
        </div>
      </div>

      <div className={cn("relative flex h-full flex-col z-10", exportMode ? "px-24 py-20" : "px-8 py-8 sm:px-12 sm:py-12 print:px-[15mm] print:py-[15mm]")}>
        
        {/* HEADER ZONE */}
        <header className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="flex flex-col items-center justify-center gap-3 mb-2">
            <img src={GLC_LOGO_URL} alt="Ghasful Learning Center" className={cn("object-contain", exportMode ? "h-24" : "h-16 sm:h-20")} />
            <h2 className={cn("font-bold tracking-[0.2em] uppercase mt-2", themeVars.textAccent, exportMode ? "text-3xl" : "text-xl sm:text-2xl")}>
              GHASFUL LEARNING CENTER
            </h2>
          </div>
          <div className={cn("flex items-center justify-center gap-3 text-sm tracking-widest uppercase font-semibold", themeVars.textMuted)}>
            <span>In Collaboration With</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            <img src={EQUISAAS_LOGO_URL} alt="EquiSaaS BD" className={cn("object-contain", exportMode ? "h-12" : "h-8 sm:h-10")} />
            <p className={cn("text-[10px] sm:text-xs font-medium tracking-wider uppercase mt-2", themeVars.textMuted)}>
              (Bangladesh's First Open Tech Co-operative)
            </p>
          </div>
        </header>

        {/* BODY ZONE */}
        <section className={cn("flex flex-1 flex-col justify-center text-center items-center", exportMode ? "mt-16 mb-16" : "mt-10 mb-10")}>
          <div className="space-y-6 max-w-5xl w-full">
            <p className={cn("font-medium uppercase tracking-[0.4em]", themeVars.textAccent, exportMode ? "text-xl" : "text-sm sm:text-base")}>
              Certificate of Completion
            </p>
            
            <div className={cn("space-y-2 mt-8", exportMode ? "mt-12" : "mt-8")}>
              <p className={cn("font-medium", themeVars.textMuted, exportMode ? "text-2xl" : "text-lg sm:text-xl")}>
                This is to officially certify that
              </p>
              
              <h1 
                className={cn("border-b border-emerald-600/30 pb-4 pt-2 w-full max-w-4xl mx-auto font-bold", themeVars.textAccent, exportMode ? "text-[4.5rem] leading-none" : "text-[clamp(2.5rem,6vw,4rem)] leading-[1.1]")}
                style={{ fontFamily: CERTIFICATE_SERIF }}
              >
                {certificate.recipientName}
              </h1>
              
              <p className={cn("pt-4 mx-auto max-w-3xl font-medium leading-relaxed", themeVars.textMuted, exportMode ? "text-xl" : "text-base sm:text-lg")}>
                has successfully met all the academic, practical, and interactive training requirements to earn the credential
              </p>
            </div>

            <div className={cn("bg-emerald-50/50 rounded-2xl border border-emerald-100 p-6 mx-auto w-full max-w-4xl", exportMode ? "mt-12 p-8" : "mt-8")}>
              <h2 className={cn("font-bold uppercase tracking-wider", themeVars.textAccent, exportMode ? "text-3xl" : "text-xl sm:text-2xl")}>
                Professional Communication & Spoken English Certification
              </h2>
            </div>

            <div className={cn("mx-auto max-w-4xl leading-relaxed", themeVars.textMuted, exportMode ? "text-lg mt-10" : "text-sm sm:text-base mt-6")}>
              <p>
                This certificate validates that the recipient has actively participated in live interactive speaking drills, mastered core structural grammar formulas, and demonstrated competency in real-time professional communication, public speaking confidence, and active workplace interaction.
              </p>
            </div>
          </div>
        </section>

        {/* LOGISTICS & SIGNATURES ZONE */}
        <footer className={cn("flex flex-col mt-auto", exportMode ? "gap-16" : "gap-10")}>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
            {/* Logistics Block */}
            <div className={cn("space-y-3 text-left w-full sm:w-1/3", exportMode ? "text-base" : "text-xs sm:text-sm")}>
              <div className="space-y-1">
                <p className={cn("font-bold uppercase tracking-wider text-[10px] sm:text-xs", themeVars.textAccent)}>Program Duration</p>
                <p className="font-semibold text-slate-800">1 Month (Intensive Live Sessions & Practical Drills)</p>
              </div>
              <div className="space-y-1">
                <p className={cn("font-bold uppercase tracking-wider text-[10px] sm:text-xs", themeVars.textAccent)}>Date of Issuance</p>
                <p className="font-semibold text-slate-800">{issueDate}</p>
              </div>
              <div className="space-y-1">
                <p className={cn("font-bold uppercase tracking-wider text-[10px] sm:text-xs", themeVars.textAccent)}>Verification Serial ID</p>
                <p className="font-mono font-bold text-slate-800">{verificationSerialId}</p>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex justify-center w-full sm:w-1/3">
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-emerald-100">
                <CertificateQrCode
                  value={certificate.verificationUrl}
                  label={`QR code for certificate ${certificate.certificateNumber}`}
                  size={exportMode ? 140 : 100}
                />
              </div>
            </div>

            {/* Signatures Block */}
            <div className="flex flex-col justify-end w-full sm:w-1/3 gap-8">
              
              <div className="text-right">
                <div className="h-12 mb-2 flex justify-end items-end">
                  {/* Space for Digital Signature 1 */}
                  <p className="font-['Brush_Script_MT',cursive,serif] text-3xl text-slate-800 opacity-80">Mehedi Hasan</p>
                </div>
                <div className="border-t border-slate-300 pt-2">
                  <p className="font-bold text-slate-800 text-sm">Mehedi Hasan</p>
                  <p className={cn("text-xs mt-0.5", themeVars.textMuted)}>Lead Instructor & Founder</p>
                  <p className={cn("text-xs font-semibold mt-0.5", themeVars.textAccent)}>Ghasful Learning Center</p>
                </div>
              </div>

              <div className="text-right">
                <div className="h-12 mb-2 flex justify-end items-end">
                  {/* Space for Digital Signature 2 */}
                  <img src="/lms/md-chairman-signature.png" alt="Signature" className="h-full object-contain opacity-90" />
                </div>
                <div className="border-t border-slate-300 pt-2">
                  <p className="font-bold text-slate-800 text-sm">K. A. Al-Amin</p>
                  <p className={cn("text-xs mt-0.5", themeVars.textMuted)}>Managing Director & Chairman</p>
                  <p className={cn("text-xs font-semibold mt-0.5", themeVars.textAccent)}>EquiSaaS BD Co-operative</p>
                </div>
              </div>

            </div>
          </div>
          
          {/* Verification Footer */}
          <div className={cn("text-center border-t border-emerald-100 pt-6", exportMode ? "text-sm" : "text-[10px] sm:text-xs", themeVars.textMuted)}>
            <p>Verify the authenticity of this document online at: <span className="font-medium text-emerald-700">{certificate.verificationUrl}</span></p>
          </div>

        </footer>
      </div>
    </article>
  );
});
