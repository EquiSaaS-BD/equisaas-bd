import React, { useMemo, useState } from "react";
import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { triggerDownload } from "../../../lib/download-helper";

const CERTIFICATE_WIDTH = 1600;
const CERTIFICATE_HEIGHT = 1131;

function escapeMarkup(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function toDate(value) {
  if (!value) return new Date();
  if (value?.seconds) return new Date(value.seconds * 1000);
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function formatIssuedAt(value, lang) {
  return toDate(value).toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function wrapText(text = "", maxLength = 26) {
  const words = String(text).trim().split(/\s+/).filter(Boolean);
  if (!words.length) return ["Achievement Earned"];

  const lines = [];
  let current = "";

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxLength) {
      current = next;
      return;
    }
    if (current) lines.push(current);
    current = word;
  });

  if (current) lines.push(current);
  return lines.slice(0, 3);
}

function buildCertificateSvg(data) {
  const titleLines = wrapText(data.achievementTitle, 24);
  const titleStartY = 600 - (titleLines.length - 1) * 34;

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${CERTIFICATE_WIDTH}" height="${CERTIFICATE_HEIGHT}" viewBox="0 0 ${CERTIFICATE_WIDTH} ${CERTIFICATE_HEIGHT}" role="img" aria-label="EquiSaaS BD Completion Certificate">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#eff6ff" />
      <stop offset="55%" stop-color="#f8fafc" />
      <stop offset="100%" stop-color="#ecfdf5" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563eb" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
    <linearGradient id="soft" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#dbeafe" stop-opacity="0.95" />
      <stop offset="100%" stop-color="#dcfce7" stop-opacity="0.65" />
    </linearGradient>
    <filter id="blur">
      <feGaussianBlur stdDeviation="36" />
    </filter>
  </defs>

  <rect width="${CERTIFICATE_WIDTH}" height="${CERTIFICATE_HEIGHT}" fill="url(#bg)" />
  <circle cx="1400" cy="120" r="220" fill="#93c5fd" opacity="0.28" filter="url(#blur)" />
  <circle cx="220" cy="1040" r="240" fill="#6ee7b7" opacity="0.24" filter="url(#blur)" />
  <rect x="44" y="44" width="1512" height="1043" rx="42" fill="rgba(255,255,255,0.82)" stroke="rgba(148,163,184,0.28)" stroke-width="3" />
  <rect x="72" y="72" width="1456" height="987" rx="34" fill="url(#soft)" stroke="rgba(255,255,255,0.8)" stroke-width="2" />

  <rect x="146" y="148" width="1308" height="835" rx="28" fill="rgba(255,255,255,0.72)" stroke="rgba(148,163,184,0.18)" stroke-width="1.5" />

  <text x="800" y="210" text-anchor="middle" font-size="30" font-family="'Segoe UI', Arial, sans-serif" fill="#2563eb" letter-spacing="8">EQUISAAS BD</text>
  <text x="800" y="280" text-anchor="middle" font-size="78" font-weight="700" font-family="Georgia, 'Times New Roman', serif" fill="#0f172a">Completion Certificate</text>
  <text x="800" y="348" text-anchor="middle" font-size="24" font-family="'Segoe UI', Arial, sans-serif" fill="#475569">Proof of Equity and Production-Ready Contribution</text>

  <text x="800" y="430" text-anchor="middle" font-size="26" font-family="'Segoe UI', Arial, sans-serif" fill="#64748b">This certifies that</text>
  <text x="800" y="516" text-anchor="middle" font-size="68" font-weight="700" font-family="Georgia, 'Times New Roman', serif" fill="#111827">${escapeMarkup(data.recipientName)}</text>

  ${titleLines
    .map(
      (line, index) => `
  <text x="800" y="${titleStartY + index * 68}" text-anchor="middle" font-size="50" font-weight="700" font-family="'Segoe UI', Arial, sans-serif" fill="#0f172a">${escapeMarkup(
        line
      )}</text>`
    )
    .join("")}

  <text x="800" y="736" text-anchor="middle" font-size="22" font-family="'Segoe UI', Arial, sans-serif" fill="#475569">${escapeMarkup(data.subtitle)}</text>

  <rect x="220" y="814" width="1160" height="120" rx="24" fill="rgba(255,255,255,0.84)" stroke="rgba(37,99,235,0.12)" stroke-width="2" />
  <text x="300" y="864" font-size="18" font-family="'Segoe UI', Arial, sans-serif" fill="#64748b" letter-spacing="3">ISSUED</text>
  <text x="300" y="906" font-size="28" font-weight="700" font-family="'Segoe UI', Arial, sans-serif" fill="#0f172a">${escapeMarkup(data.issuedAtLabel)}</text>

  <text x="760" y="864" font-size="18" font-family="'Segoe UI', Arial, sans-serif" fill="#64748b" letter-spacing="3">LEVEL</text>
  <text x="760" y="906" font-size="28" font-weight="700" font-family="'Segoe UI', Arial, sans-serif" fill="#0f172a">${escapeMarkup(data.level)}</text>

  <text x="1160" y="864" font-size="18" font-family="'Segoe UI', Arial, sans-serif" fill="#64748b" letter-spacing="3">CERTIFICATE ID</text>
  <text x="1160" y="906" font-size="24" font-weight="700" font-family="'Segoe UI', Arial, sans-serif" fill="#0f172a">${escapeMarkup(data.credentialId)}</text>

  <path d="M300 996 C380 946 430 946 512 996" stroke="url(#accent)" stroke-width="5" fill="none" stroke-linecap="round" />
  <text x="300" y="1036" font-size="20" font-family="'Segoe UI', Arial, sans-serif" fill="#475569">Program Steward</text>
  <text x="300" y="1066" font-size="18" font-family="'Segoe UI', Arial, sans-serif" fill="#64748b">EquiSaaS BD</text>

  <circle cx="1290" cy="1004" r="74" fill="url(#accent)" opacity="0.12" />
  <circle cx="1290" cy="1004" r="60" fill="none" stroke="url(#accent)" stroke-width="5" />
  <text x="1290" y="992" text-anchor="middle" font-size="18" font-family="'Segoe UI', Arial, sans-serif" fill="#2563eb" letter-spacing="3">VERIFIED</text>
  <text x="1290" y="1024" text-anchor="middle" font-size="26" font-weight="700" font-family="'Segoe UI', Arial, sans-serif" fill="#0f172a">EQUITY</text>
  <text x="1290" y="1056" text-anchor="middle" font-size="18" font-family="'Segoe UI', Arial, sans-serif" fill="#059669">READY</text>
</svg>`;
}

function buildPrintDocument(data) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeMarkup(data.recipientName)} - EquiSaaS BD Certificate</title>
  <style>
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: linear-gradient(135deg, #eff6ff, #f8fafc 60%, #ecfdf5);
      font-family: "Segoe UI", Arial, sans-serif;
      color: #0f172a;
    }
    .sheet {
      width: 1120px;
      max-width: calc(100vw - 48px);
      padding: 32px;
    }
    .card {
      position: relative;
      overflow: hidden;
      border-radius: 32px;
      padding: 56px;
      background: rgba(255,255,255,0.78);
      border: 1px solid rgba(148,163,184,0.28);
      box-shadow: 0 24px 80px rgba(15,23,42,0.12);
    }
    .card::before,
    .card::after {
      content: "";
      position: absolute;
      border-radius: 999px;
      filter: blur(36px);
      opacity: 0.45;
      z-index: 0;
    }
    .card::before {
      width: 220px;
      height: 220px;
      right: -48px;
      top: -48px;
      background: #93c5fd;
    }
    .card::after {
      width: 240px;
      height: 240px;
      left: -80px;
      bottom: -96px;
      background: #86efac;
    }
    .content {
      position: relative;
      z-index: 1;
      border-radius: 24px;
      padding: 40px;
      background: rgba(255,255,255,0.74);
      border: 1px solid rgba(255,255,255,0.9);
    }
    .eyebrow {
      text-align: center;
      letter-spacing: 0.45em;
      color: #2563eb;
      font-size: 15px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .title {
      margin: 28px 0 12px;
      font-size: 58px;
      line-height: 1.04;
      text-align: center;
      font-family: Georgia, "Times New Roman", serif;
    }
    .lede,
    .meta-label,
    .meta-copy {
      text-align: center;
    }
    .lede {
      margin: 0;
      color: #475569;
      font-size: 20px;
    }
    .recipient {
      margin: 44px 0 18px;
      font-size: 58px;
      line-height: 1.1;
      text-align: center;
      font-family: Georgia, "Times New Roman", serif;
    }
    .achievement {
      margin: 0;
      text-align: center;
      font-size: 38px;
      line-height: 1.25;
      font-weight: 700;
    }
    .subtitle {
      margin: 18px 0 0;
      text-align: center;
      color: #475569;
      font-size: 18px;
    }
    .meta-grid {
      margin-top: 40px;
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
    }
    .meta-card {
      border-radius: 20px;
      padding: 20px 22px;
      background: rgba(255,255,255,0.84);
      border: 1px solid rgba(37,99,235,0.12);
    }
    .meta-label {
      margin: 0 0 10px;
      color: #64748b;
      font-size: 12px;
      letter-spacing: 0.28em;
      font-weight: 700;
      text-transform: uppercase;
    }
    .meta-copy {
      margin: 0;
      color: #0f172a;
      font-size: 22px;
      font-weight: 700;
    }
    .footer {
      margin-top: 54px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 24px;
    }
    .signature-line {
      width: 220px;
      height: 3px;
      border-radius: 999px;
      background: linear-gradient(135deg, #2563eb, #059669);
      margin-bottom: 14px;
    }
    .signature-copy {
      color: #475569;
      font-size: 16px;
    }
    .seal {
      width: 120px;
      height: 120px;
      border-radius: 999px;
      display: grid;
      place-items: center;
      border: 4px solid rgba(37,99,235,0.72);
      color: #2563eb;
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      text-align: center;
      letter-spacing: 0.16em;
      background: rgba(255,255,255,0.7);
    }
    @page {
      size: A4 landscape;
      margin: 0;
    }
    @media print {
      body {
        background: white;
      }
      .sheet {
        max-width: none;
        width: auto;
        padding: 24px;
      }
      .card {
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="card">
      <div class="content">
        <div class="eyebrow">EquiSaaS BD</div>
        <h1 class="title">Completion Certificate</h1>
        <p class="lede">Proof of Equity and production-ready contribution</p>
        <h2 class="recipient">${escapeMarkup(data.recipientName)}</h2>
        <p class="achievement">${escapeMarkup(data.achievementTitle)}</p>
        <p class="subtitle">${escapeMarkup(data.subtitle)}</p>
        <div class="meta-grid">
          <div class="meta-card">
            <p class="meta-label">Issued</p>
            <p class="meta-copy">${escapeMarkup(data.issuedAtLabel)}</p>
          </div>
          <div class="meta-card">
            <p class="meta-label">Level</p>
            <p class="meta-copy">${escapeMarkup(data.level)}</p>
          </div>
          <div class="meta-card">
            <p class="meta-label">Certificate ID</p>
            <p class="meta-copy">${escapeMarkup(data.credentialId)}</p>
          </div>
        </div>
        <div class="footer">
          <div>
            <div class="signature-line"></div>
            <div class="signature-copy">Program Steward<br />EquiSaaS BD</div>
          </div>
          <div class="seal">Verified<br />Equity</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

async function svgToPng(svgMarkup, fileName) {
  const svgBlob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);

  try {
    const image = await new Promise((resolve, reject) => {
      const nextImage = new Image();
      nextImage.onload = () => resolve(nextImage);
      nextImage.onerror = reject;
      nextImage.src = svgUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = CERTIFICATE_WIDTH * 1.5;
    canvas.height = CERTIFICATE_HEIGHT * 1.5;
    const context = canvas.getContext("2d");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png", 1));
    if (!blob) throw new Error("PNG export failed.");

    triggerDownload(blob, fileName);
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

const CertificateGenerator = ({
  recipientName,
  achievementTitle,
  achievementType = "Major track completion",
  level = "Certified Contributor",
  issuedAt,
  credentialId,
  lang = "en",
  compact = false,
  className,
  onNotify,
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const certificateData = useMemo(() => {
    const safeRecipient = recipientName || "EquiSaaS Member";
    const safeTitle = achievementTitle || "Achievement Earned";
    return {
      recipientName: safeRecipient,
      achievementTitle: safeTitle,
      subtitle:
        lang === "bn"
          ? `${achievementType} সফলভাবে সম্পন্ন করে EquiSaaS BD-তে অবদান রেখেছেন।`
          : `Successfully completed ${achievementType.toLowerCase()} and shipped meaningful work inside EquiSaaS BD.`,
      issuedAtLabel: formatIssuedAt(issuedAt, lang),
      level,
      credentialId:
        credentialId ||
        `EQ-${safeRecipient.replace(/[^A-Za-z0-9]/g, "").slice(0, 6).toUpperCase()}-${toDate(issuedAt)
          .getTime()
          .toString()
          .slice(-6)}`,
    };
  }, [achievementTitle, achievementType, credentialId, issuedAt, lang, level, recipientName]);

  const notify = (message) => {
    if (typeof onNotify === "function") onNotify(message);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "noopener,noreferrer,width=1280,height=900");
    if (!printWindow) {
      notify(lang === "bn" ? "প্রিন্ট উইন্ডো খুলতে পারিনি।" : "Could not open the print window.");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(buildPrintDocument(certificateData));
    printWindow.document.close();
    printWindow.focus();

    window.setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const handlePngDownload = async () => {
    setIsExporting(true);
    try {
      const svgMarkup = buildCertificateSvg(certificateData);
      const fileBase = `certificate-${certificateData.recipientName}-${certificateData.achievementTitle}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "equisaas-bd-certificate";

      await svgToPng(svgMarkup, `${fileBase}.png`);
      notify(lang === "bn" ? "সার্টিফিকেট PNG ডাউনলোড হয়েছে।" : "Certificate PNG downloaded.");
    } catch (error) {
      console.error(error);
      notify(lang === "bn" ? "PNG এক্সপোর্ট ব্যর্থ হয়েছে।" : "PNG export failed.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      className={cn(
        compact
          ? "space-y-3"
          : "rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl",
        className
      )}
    >
      {!compact && (
        <div className="overflow-hidden rounded-[28px] border border-white/80 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.16),_transparent_34%),linear-gradient(135deg,_rgba(255,255,255,0.92),_rgba(255,255,255,0.72))] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/70">EquiSaaS BD</div>
          <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-900">
            {lang === "bn" ? "Completion Certificate" : "Completion Certificate"}
          </h3>
          <p className="mt-2 text-sm text-slate-600">{certificateData.subtitle}</p>
          <div className="mt-6 space-y-2">
            <div className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">
              {lang === "bn" ? "প্রাপ্ত সদস্য" : "Awarded To"}
            </div>
            <div className="text-3xl font-black tracking-tight text-slate-950">{certificateData.recipientName}</div>
            <div className="text-base font-semibold text-slate-700">{certificateData.achievementTitle}</div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" className="rounded-xl font-bold" onClick={handlePrint}>
          <Printer className="h-4 w-4" />
          {lang === "bn" ? "PDF Save করুন" : "Save PDF"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="rounded-xl font-bold"
          onClick={handlePngDownload}
          disabled={isExporting}
        >
          <Download className="h-4 w-4" />
          {isExporting
            ? lang === "bn"
              ? "এক্সপোর্ট হচ্ছে..."
              : "Exporting..."
            : lang === "bn"
            ? "PNG Download"
            : "Download PNG"}
        </Button>
      </div>
    </div>
  );
};

export default CertificateGenerator;
