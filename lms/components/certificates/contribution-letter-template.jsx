"use client";

import { forwardRef } from "react";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";

const HR_SIGNATURE_URL = `/hr-signature.png`;
const HR_SEAL_URL = `/hr-seal.png`;
const MD_SIGNATURE_URL = `/md-chairman-signature.png`;
const MD_SEAL_URL = `/md-chairman-seal.png`;
const OFFICIAL_SEAL_URL = `/official-seal.png`;
const LOGO_URL = `/logo.png`;

export const ContributionLetterTemplate = forwardRef(function ContributionLetterTemplate({ certificate }, ref) {
  if (!certificate) return null;

  const today = formatDate(new Date());

  return (
    <article
      ref={ref}
      className="bg-white text-slate-900 font-serif p-[20mm] w-[210mm] min-h-[297mm] shadow-2xl mx-auto border relative overflow-hidden"
      style={{ boxSizing: "border-box" }}
    >
      {/* Watermark Seal */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <img src={OFFICIAL_SEAL_URL} alt="" className="w-[150mm] h-[150mm] opacity-[0.03] object-contain" />
      </div>

      {/* Letterhead */}
      <header className="flex justify-between items-start border-b-2 border-primary/20 pb-8 relative z-10">
        <div className="space-y-4">
          <img src={LOGO_URL} alt="EquiSaaS BD" className="h-14 w-auto" />
          <div className="text-[10px] leading-relaxed text-slate-500 uppercase tracking-widest font-sans font-bold">
            <p>EquiSaaS BD Open Tech Cooperative</p>
            <p>734, AMIR PALACE, West Nakhalpara</p>
            <p>Tejgaon, Dhaka 1215, Bangladesh</p>
          </div>
        </div>
        <div className="text-right space-y-1">
          <p className="text-xs font-sans font-black text-primary">OFFICIAL RECORD</p>
          <p className="text-[10px] font-sans text-slate-400">{certificate.certificateNumber}</p>
        </div>
      </header>

      {/* Content */}
      <main className="mt-16 space-y-10 leading-relaxed text-base relative z-10">
        <p className="text-right font-sans font-medium text-slate-500">{today}</p>
        
        <div className="space-y-6">
          <div>
          <div className="border-b-2 border-slate-900 pb-2 inline-block">
            <h1 className="text-2xl font-black font-sans uppercase tracking-tight whitespace-nowrap">Letter of Contribution</h1>
          </div>
          </div>
          <p className="font-bold">TO WHOM IT MAY CONCERN,</p>
        </div>

        <div className="space-y-6">
          <p>
            This letter serves as formal recognition of the professional contributions made by 
            <span className="font-bold text-slate-900"> {certificate.recipientName}</span> to the 
            EquiSaaS BD Open Tech Cooperative.
          </p>

          <p>
            Through our proof-based learning and delivery system, the aforementioned individual has successfully 
            demonstrated expertise in <span className="font-bold">{certificate.subjectTitle}</span> within the 
            <span className="font-bold"> {certificate.departmentTitle}</span> department.
          </p>

          <p>
            As a co-builder in our ecosystem, their work has been verified by technical mentors and recorded 
            in the cooperative's immutable contribution ledger. This record represents real-world technical 
            output and professional growth aligned with global software engineering standards.
          </p>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3 font-sans">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Verified Subject</p>
             <p className="text-lg font-black text-primary leading-tight">{certificate.certificateTitle}</p>
             <p className="text-sm text-slate-500 italic">Record ID: {certificate.id}</p>
          </div>
        </div>

        <p className="pt-4">
          We remain committed to the "Together We Build, Together We Own" philosophy and are proud to include 
          {certificate.recipientName} in our roster of verified co-builders.
        </p>
      </main>

      {/* Signatories */}
      <footer className="mt-20 grid grid-cols-2 gap-12 font-sans pt-12 border-t border-slate-100 relative z-10">

        <div className="space-y-6 flex flex-col items-center text-center">
          <div className="relative h-20 w-48 flex items-center justify-center">
             <img src={HR_SEAL_URL} alt="" className="absolute h-16 w-16 opacity-80 mix-blend-multiply" />
             <img src={HR_SIGNATURE_URL} alt="" className="relative h-full w-auto mix-blend-multiply" />
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm font-black uppercase min-h-[2.5rem] flex items-end">Sandipta Karmakar Barno</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Director (HR & Operations)</p>
          </div>
        </div>

        <div className="space-y-6 flex flex-col items-center text-center">
          <div className="relative h-20 w-48 flex items-center justify-center">
             <img src={MD_SEAL_URL} alt="" className="absolute h-16 w-16 opacity-80 mix-blend-multiply" />
             <img src={MD_SIGNATURE_URL} alt="" className="relative h-full w-auto mix-blend-multiply" />
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm font-black uppercase min-h-[2.5rem] flex items-end">Kholipha Ahmmad Al-Amin</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Managing Director & Chairman</p>
          </div>
        </div>
      </footer>
    </article>
  );
});
