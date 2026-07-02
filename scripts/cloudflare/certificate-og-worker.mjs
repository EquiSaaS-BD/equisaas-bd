/**
 * EquiSaaS BD - Certificate OG Page Worker with Satori
 *
 * Uses Satori to render high-fidelity text paths over the original native SVG background.
 */

import satori, { init as initSatori } from "satori";
import initYoga from "yoga-wasm-web/asm";
import { Resvg, initWasm } from "@resvg/resvg-wasm";

const MAIN_SITE_URL = "https://equisaas-bd.com/";
const LMS_URL = "https://equisaas-bd.com/lms";
const LMS_CERTIFICATE_VIEWER_URL = `${LMS_URL}/certificate-view`;

const DEPARTMENT_TITLES = {
  frontend: "Frontend Engineering",
  backend: "Backend Engineering",
  devopsqa: "DevOps & QA",
  uiux: "UI/UX Design",
  design: "Graphic Design",
  baagile: "Business Analysis & Agile",
  pm: "Product Management",
  marketing: "Digital Marketing",
  crmcs: "CRM & Customer Success",
};

const HR_SIGNATORY_NAME = "Sandipta Karmakar Barno";
const HR_SIGNATORY_TITLE = "Director of HR & Operations";

const CERTIFICATE_WIDTH = 1600;
const CERTIFICATE_HEIGHT = 1131;

import resvgWasm from "@resvg/resvg-wasm/index_bg.wasm";

let wasmInitialized = false;

async function initResvgWasm() {
  if (wasmInitialized) return;
  try {
    await initWasm(resvgWasm);
    // Note: Satori init uses Yoga wasm which is initialized dynamically if needed
    wasmInitialized = true;
  } catch (error) {
    console.error("WASM init error:", error);
  }
}

/** Social and AI bot user-agent patterns. */
const BOT_PATTERN = new RegExp(
  [
    "facebookexternalhit",
    "facebot",
    "meta-externalagent",
    "meta-externalfetcher",
    "facebookcatalog",
    "linkedinbot",
    "twitterbot",
    "slackbot",
    "discordbot",
    "whatsapp",
    "telegrambot",
    "skypeuripreview",
    "pinterest",
    "googlebot",
    "bingbot",
    "google-inspectiontool",
    "chatgpt-user",
    "gptbot",
    "oai-searchbot",
    "perplexitybot",
    "claudebot",
    "claude-searchbot",
  ].join("|"),
  "i",
);

function isSocialBot(userAgent = "") {
  return BOT_PATTERN.test(String(userAgent || ""));
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDateKey(value) {
  const raw = String(value || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return "";
  const [year, month, day] = raw.split("-").map(Number);
  const d = new Date(Date.UTC(year, month - 1, day, 6, 0, 0));
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(d);
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

function getGlcBackgroundSvg() {
  return `
  <svg width="${CERTIFICATE_WIDTH}" height="${CERTIFICATE_HEIGHT}" viewBox="0 0 ${CERTIFICATE_WIDTH} ${CERTIFICATE_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="glcBar" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#047857" />
        <stop offset="50%" stop-color="#10b981" />
        <stop offset="100%" stop-color="#047857" />
      </linearGradient>
    </defs>
    <rect width="${CERTIFICATE_WIDTH}" height="${CERTIFICATE_HEIGHT}" fill="#f4f7f6" />
    <rect x="14" y="14" width="1572" height="1103" rx="0" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
    <rect x="26" y="26" width="1548" height="1079" rx="0" fill="none" stroke="rgba(5, 150, 105, 0.2)" stroke-width="2" />
    <rect x="0" y="0" width="${CERTIFICATE_WIDTH}" height="16" fill="url(#glcBar)" />
    <!-- Star Watermark -->
    <path d="M 800 325 L 852.8 512.2 L 1040 565 L 852.8 617.8 L 800 805 L 747.2 617.8 L 560 565 L 747.2 512.2 Z" fill="#047857" opacity="0.03" />
  </svg>`;
}

function getStandardBackgroundSvg(theme, customColors = {}) {
  let bgGradient = "";
  let officialSealOpacity = 0.06;
  const mainSiteUrl = "https://equisaas-bd.com/";
  
  if (customColors.bgTheme) {
    bgGradient = `
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${customColors.bgTheme}" />
        <stop offset="100%" stop-color="${customColors.bgTheme}" />
      </linearGradient>
    `;
  } else if (theme === "dark") {
    bgGradient = `
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#020617" />
      </linearGradient>
    `;
    officialSealOpacity = 0.12;
  } else if (theme === "minimalist") {
    bgGradient = `
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="100%" stop-color="#f8fafc" />
      </linearGradient>
    `;
    officialSealOpacity = 0.03;
  } else { // classic
    bgGradient = `
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#eff6ff" />
        <stop offset="55%" stop-color="#f8fafc" />
        <stop offset="100%" stop-color="#fbf7ee" />
      </linearGradient>
    `;
    officialSealOpacity = 0.06;
  }

  const borderOuterColor = customColors.borderOuter || (theme === "dark" ? "#1e293b" : theme === "minimalist" ? "#e2e8f0" : "#d9cfb8");
  const borderInnerColor = customColors.borderOuter ? `${customColors.borderOuter}33` : (theme === "dark" ? "#334155" : theme === "minimalist" ? "#f1f5f9" : "#eee3cd");

  const topBarFill = theme === "dark" ? "url(#darkBar)" : theme === "minimalist" ? "none" : "url(#classicBar)";

  return `
  <svg width="${CERTIFICATE_WIDTH}" height="${CERTIFICATE_HEIGHT}" viewBox="0 0 ${CERTIFICATE_WIDTH} ${CERTIFICATE_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      ${bgGradient}
      <linearGradient id="classicBar" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f4c81" />
        <stop offset="100%" stop-color="#2f77a8" />
      </linearGradient>
      <linearGradient id="darkBar" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#38bdf8" />
        <stop offset="100%" stop-color="#0ea5e9" />
      </linearGradient>
    </defs>
    <rect width="${CERTIFICATE_WIDTH}" height="${CERTIFICATE_HEIGHT}" fill="url(#bg)" />
    <!-- Borders -->
    <rect x="14" y="14" width="1572" height="1103" rx="0" fill="none" stroke="${borderOuterColor}" stroke-width="1.5" />
    <rect x="26" y="26" width="1548" height="1079" rx="0" fill="none" stroke="${borderInnerColor}" stroke-width="1.5" />
    <!-- Top accent bar -->
    <rect x="0" y="0" width="${CERTIFICATE_WIDTH}" height="16" fill="${topBarFill}" />
    <!-- Watermark Seal -->
    <image href="${mainSiteUrl}official-seal.png" x="624" y="389" width="352" height="352" opacity="${officialSealOpacity}" />
  </svg>`;
}

function getBackgroundSvg(themeStyle, customColors) {
  if (themeStyle === "glc-spoken-english") {
    return getGlcBackgroundSvg();
  }
  return getStandardBackgroundSvg(themeStyle, customColors);
}

// Global font cache
let robotoFont = null;
let robotoBoldFont = null;
let georgiaFont = null;
let caveatFont = null;
let yogaWasm = null;

async function loadFonts() {
  if (robotoFont && robotoBoldFont && georgiaFont && caveatFont && yogaWasm) return;

  const fontPromises = [
    fetch("https://cdn.jsdelivr.net/npm/@fontsource/roboto/files/roboto-all-400-normal.woff").then((res) => res.arrayBuffer()),
    fetch("https://cdn.jsdelivr.net/npm/@fontsource/roboto/files/roboto-all-700-normal.woff").then((res) => res.arrayBuffer()),
    fetch("https://cdn.jsdelivr.net/npm/@fontsource/merriweather/files/merriweather-latin-700-normal.woff").then((res) => res.arrayBuffer()),
    fetch("https://cdn.jsdelivr.net/npm/@fontsource/caveat/files/caveat-latin-400-normal.woff").then((res) => res.arrayBuffer()),
  ];

  if (!yogaWasm) {
    // Dynamically import the wasm if missing
    yogaWasm = await import("yoga-wasm-web/dist/yoga.wasm").then(m => m.default);
  }

  const [roboto, robotoBold, georgia, caveat] = await Promise.all(fontPromises);
  robotoFont = roboto;
  robotoBoldFont = robotoBold;
  georgiaFont = georgia;
  caveatFont = caveat;
  
  const yoga = await initYoga(yogaWasm);
  initSatori(yoga);
}

async function buildCertificateSvgWithSatori(data, frameWidth, frameHeight) {
  const themeStyle = data.themeStyle || "classic";
  const customColors = data.customColors || {};
  const isDark = themeStyle === "dark";
  const isMinimal = themeStyle === "minimalist";

  const themeVars = {
    bgInner: customColors.cardBg || (isDark ? "rgba(15,23,42,0.95)" : isMinimal ? "rgba(255,255,255,1)" : "rgba(250,245,234,1)"),
    bgTheme: customColors.bgTheme || (isDark ? "#020617" : isMinimal ? "#ffffff" : "#fbf7ee"),
    textMain: customColors.textMain || (isDark ? "#f8fafc" : isMinimal ? "#1e293b" : "#0f172a"),
    textMuted: customColors.textMain ? `${customColors.textMain}cc` : (isDark ? "#94a3b8" : "#64748b"),
    textPrimary: customColors.textPrimary || (isDark ? "#38bdf8" : isMinimal ? "#475569" : "#0f4c81"),
    cardBg: customColors.cardBg || (isDark ? "#0f172a" : "#ffffff"),
    cardBorder: customColors.borderOuter || (isDark ? "#1e293b" : isMinimal ? "#e2e8f0" : "#d9cfb8"),
    fieldBg: customColors.cardBg || (isDark ? "#1e293b" : "#fcfaf5"),
    fieldBorder: customColors.borderOuter || (isDark ? "#334155" : "#eadfcb"),
  };

  const bgSvg = getBackgroundSvg(themeStyle, customColors);
  const bgBase64 = typeof btoa === "function" ? btoa(bgSvg) : Buffer.from(bgSvg).toString("base64");
  const bgUrl = `data:image/svg+xml;base64,${bgBase64}`;

  const recipientName = data.recipientName || "Learner";
  const completionDate = formatDateKey(data.completionDateKey) || "Not Set";
  const issuedAtLabel = formatDateKey(data.issueDateKey) || "Not Issued";
  
  const rawAuthorityName = String(data.signerName || "").trim();
  const rawAuthorityTitle = String(data.signerTitle || "").trim();
  const issuerOrganization = data.issuerOrganization || "EquiSaaS BD";
  const isLegacyFounderAuthority =
    rawAuthorityName === "Kholipha Ahmmad Al-Amin" &&
    rawAuthorityTitle === "Founder & CEO, EquiSaaS BD";
  const isHrAuthority =
    rawAuthorityName === "Sandipta Karmakar Barno" &&
    rawAuthorityTitle === "Director of HR & Operations";
  const authorityNote = rawAuthorityName && !isLegacyFounderAuthority && !isHrAuthority
    ? [rawAuthorityName, rawAuthorityTitle, issuerOrganization].filter(Boolean).join(" • ")
    : "";

  // Fit 1600x1131 into frameWidth x frameHeight with padding
  const padding = 60;
  const targetWidth = frameWidth - padding * 2;
  const targetHeight = frameHeight - padding * 2;
  const scale = Math.min(targetWidth / CERTIFICATE_WIDTH, targetHeight / CERTIFICATE_HEIGHT);

  // Standard Template VDOM
  const standardVdom = {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: "80px 80px 60px 80px",
        boxSizing: "border-box",
        justifyContent: "space-between",
        color: themeVars.textMain,
        fontFamily: "Roboto",
      },
      children: [
        // Header
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              width: "100%",
            },
            children: [
              // Left side
              {
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "column", gap: "12px" },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: { display: "flex", flexDirection: "row", alignItems: "center", gap: "16px" },
                        children: [
                          {
                            type: "img",
                            props: {
                              src: `${MAIN_SITE_URL}favicon.png`,
                              style: { width: "32px", height: "32px", objectFit: "contain" }
                            }
                          },
                          // Status Badge
                          {
                            type: "div",
                            props: {
                              style: {
                                display: "flex",
                                alignItems: "center",
                                padding: "6px 16px",
                                borderRadius: "9999px",
                                fontSize: "14px",
                                fontWeight: 700,
                                backgroundColor: data.status === "active" ? "#dcfce7" : data.status === "revoked" ? "#fee2e2" : "#f1f5f9",
                                color: data.status === "active" ? "#166534" : data.status === "revoked" ? "#991b1b" : "#475569",
                              },
                              children: data.status === "active" ? "Verified" : data.status === "revoked" ? "Revoked" : "Draft"
                            }
                          }
                        ]
                      }
                    },
                    {
                      type: "div",
                      props: {
                        style: { fontSize: "14px", color: themeVars.textMuted, maxWidth: "400px", lineHeight: 1.5 },
                        children: "Issued by EquiSaaS BD as an official online-verifiable completion record."
                      }
                    }
                  ]
                }
              },
              // Right side (Cert number & verification code)
              {
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-end" },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          flexDirection: "column",
                          padding: "12px 24px",
                          borderRadius: "20px",
                          border: `1px solid ${themeVars.cardBorder}`,
                          backgroundColor: themeVars.cardBg,
                          width: "240px",
                        },
                        children: [
                          { type: "div", props: { style: { fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2.4px", color: themeVars.textPrimary }, children: "Certificate Number" } },
                          { type: "div", props: { style: { fontSize: "14px", fontWeight: 700, marginTop: "4px" }, children: data.certificateNumber || "PENDING" } }
                        ]
                      }
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          flexDirection: "column",
                          padding: "12px 24px",
                          borderRadius: "20px",
                          border: `1px solid ${themeVars.cardBorder}`,
                          backgroundColor: themeVars.cardBg,
                          width: "240px",
                        },
                        children: [
                          { type: "div", props: { style: { fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2.4px", color: themeVars.textPrimary }, children: "Verification Code" } },
                          { type: "div", props: { style: { fontSize: "14px", fontWeight: 700, marginTop: "4px" }, children: data.verificationCode || "PENDING" } }
                        ]
                      }
                    }
                  ]
                }
              }
            ]
          }
        },

        // Body Content
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              marginTop: "24px",
              gap: "20px"
            },
            children: [
              {
                type: "img",
                props: {
                  src: `${MAIN_SITE_URL}logo.svg`,
                  style: { height: "64px", objectFit: "contain" }
                }
              },
              {
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: { fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "4.8px", color: themeVars.textPrimary },
                        children: "Official Certificate Record"
                      }
                    },
                    {
                      type: "div",
                      props: {
                        style: { fontSize: "44px", fontFamily: "Georgia", fontWeight: 700, color: themeVars.textMain, textAlign: "center" },
                        children: data.certificateTitle || "Certificate of Completion"
                      }
                    }
                  ]
                }
              },
              {
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: { fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "3.4px", color: themeVars.textMuted },
                        children: "This certifies that"
                      }
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: "56px",
                          fontFamily: "Georgia",
                          fontWeight: 700,
                          color: themeVars.textMain,
                          borderBottom: `2px solid ${themeVars.cardBorder}`,
                          paddingBottom: "16px",
                          minWidth: "600px",
                          textAlign: "center"
                        },
                        children: recipientName
                      }
                    }
                  ]
                }
              },
              {
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", width: "100%" },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: { fontSize: "16px", color: themeVars.textMuted, textAlign: "center" },
                        children: "has successfully completed the verified EquiSaaS BD learning and delivery requirement listed below."
                      }
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          padding: "20px 40px",
                          borderRadius: "24px",
                          border: `1px solid ${themeVars.cardBorder}`,
                          backgroundColor: themeVars.cardBg,
                          width: "800px",
                          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)"
                        },
                        children: [
                          { type: "div", props: { style: { fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "3.4px", color: themeVars.textPrimary }, children: "Recognized Subject" } },
                          { type: "div", props: { style: { fontSize: "28px", fontFamily: "Georgia", fontWeight: 700, marginTop: "8px", textAlign: "center" }, children: data.subjectTitle || "Course Study" } },
                          data.achievementSummary ? {
                            type: "div",
                            props: {
                              style: { fontSize: "14px", color: themeVars.textMuted, marginTop: "12px", textAlign: "center", lineHeight: 1.6, maxWidth: "700px" },
                              children: data.achievementSummary
                            }
                          } : null
                        ].filter(Boolean)
                      }
                    }
                  ]
                }
              }
            ]
          }
        },

        // Bottom Details & Verification & Signatures (3 cols row)
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              marginTop: "32px",
              gap: "24px"
            },
            children: [
              // Col 1: Credential Details
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    padding: "24px",
                    borderRadius: "28px",
                    border: `1px solid ${themeVars.cardBorder}`,
                    backgroundColor: themeVars.cardBg,
                    flex: 1.15,
                  },
                  children: [
                    { type: "div", props: { style: { fontSize: "18px", fontWeight: 700 }, children: "Credential Details" } },
                    { type: "div", props: { style: { fontSize: "14px", color: themeVars.textMuted, marginTop: "4px" }, children: "Official completion and course reference record." } },
                    
                    // Grid details
                    {
                      type: "div",
                      props: {
                        style: { display: "flex", flexDirection: "column", gap: "12px", marginTop: "20px" },
                        children: [
                          {
                            type: "div",
                            props: {
                              style: { display: "flex", flexDirection: "row", gap: "12px" },
                              children: [
                                {
                                  type: "div",
                                  props: {
                                    style: { display: "flex", flexDirection: "column", flex: 1, padding: "12px", borderRadius: "16px", border: `1px solid ${themeVars.fieldBorder}`, backgroundColor: themeVars.fieldBg },
                                    children: [
                                      { type: "div", props: { style: { fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2.2px", color: themeVars.textPrimary }, children: data.labelOverrides?.department || "Department" } },
                                      { type: "div", props: { style: { fontSize: "13px", fontWeight: 700, marginTop: "4px" }, children: data.departmentTitle || "General" } }
                                    ]
                                  }
                                },
                                {
                                  type: "div",
                                  props: {
                                    style: { display: "flex", flexDirection: "column", flex: 1, padding: "12px", borderRadius: "16px", border: `1px solid ${themeVars.fieldBorder}`, backgroundColor: themeVars.fieldBg },
                                    children: [
                                      { type: "div", props: { style: { fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2.2px", color: themeVars.textPrimary }, children: "Course Reference" } },
                                      { type: "div", props: { style: { fontSize: "13px", fontWeight: 700, marginTop: "4px" }, children: data.courseTitle || "Custom subject" } }
                                    ]
                                  }
                                }
                              ]
                            }
                          },
                          {
                            type: "div",
                            props: {
                              style: { display: "flex", flexDirection: "row", gap: "12px" },
                              children: [
                                {
                                  type: "div",
                                  props: {
                                    style: { display: "flex", flexDirection: "column", flex: 1, padding: "12px", borderRadius: "16px", border: `1px solid ${themeVars.fieldBorder}`, backgroundColor: themeVars.fieldBg },
                                    children: [
                                      { type: "div", props: { style: { fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2.2px", color: themeVars.textPrimary }, children: "Completion Date" } },
                                      { type: "div", props: { style: { fontSize: "13px", fontWeight: 700, marginTop: "4px" }, children: completionDate } }
                                    ]
                                  }
                                },
                                {
                                  type: "div",
                                  props: {
                                    style: { display: "flex", flexDirection: "column", flex: 1, padding: "12px", borderRadius: "16px", border: `1px solid ${themeVars.fieldBorder}`, backgroundColor: themeVars.fieldBg },
                                    children: [
                                      { type: "div", props: { style: { fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2.2px", color: themeVars.textPrimary }, children: data.labelOverrides?.issueDate || "Issue Date" } },
                                      { type: "div", props: { style: { fontSize: "13px", fontWeight: 700, marginTop: "4px" }, children: issuedAtLabel } }
                                    ]
                                  }
                                }
                              ]
                            }
                          }
                        ]
                      }
                    },
                    
                    // Authenticity
                    {
                      type: "div",
                      props: {
                        style: { display: "flex", flexDirection: "column", padding: "16px", borderRadius: "16px", border: `1px solid ${themeVars.fieldBorder}`, backgroundColor: themeVars.fieldBg, marginTop: "16px" },
                        children: [
                          { type: "div", props: { style: { fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2.2px", color: themeVars.textPrimary }, children: "Authenticity Statement" } },
                          { type: "div", props: { style: { fontSize: "12px", color: themeVars.textMuted, marginTop: "8px", lineHeight: 1.5 }, children: "This certificate remains valid only when the certificate number, verification code, QR code, and public verification URL resolve to the same official EquiSaaS BD record." } }
                        ]
                      }
                    }
                  ]
                }
              },

              // Col 2: Digital Verification
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    padding: "24px",
                    borderRadius: "28px",
                    border: `1px solid ${themeVars.cardBorder}`,
                    backgroundColor: themeVars.cardBg,
                    flex: 0.85,
                    alignItems: "center"
                  },
                  children: [
                    { type: "div", props: { style: { fontSize: "18px", fontWeight: 700, width: "100%" }, children: "Digital Verification" } },
                    { type: "div", props: { style: { fontSize: "14px", color: themeVars.textMuted, marginTop: "4px", width: "100%" }, children: "Scan or open the official verification URL to validate this certificate online." } },
                    
                    {
                      type: "img",
                      props: {
                        src: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&color=10334f&data=${encodeURIComponent(data.verificationUrl || "")}`,
                        style: { width: "180px", height: "180px", marginTop: "20px", borderRadius: "16px", border: "1px solid #d9cfb8", padding: "8px", backgroundColor: "#ffffff" }
                      }
                    },

                    {
                      type: "div",
                      props: {
                        style: { display: "flex", flexDirection: "column", padding: "12px 16px", borderRadius: "16px", border: `1px solid ${themeVars.fieldBorder}`, backgroundColor: themeVars.fieldBg, marginTop: "20px", width: "100%", boxSizing: "border-box" },
                        children: [
                          { type: "div", props: { style: { fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2.2px", color: themeVars.textPrimary }, children: "Verification URL" } },
                          { type: "div", props: { style: { fontSize: "12px", fontWeight: 500, marginTop: "8px", wordBreak: "break-all", color: themeVars.textMain }, children: data.verificationUrl || "" } }
                        ]
                      }
                    }
                  ]
                }
              },

              // Col 3: Authorized Signatories
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    padding: "24px",
                    borderRadius: "28px",
                    border: `1px solid ${themeVars.cardBorder}`,
                    backgroundColor: themeVars.cardBg,
                    flex: 0.95,
                  },
                  children: [
                    { type: "div", props: { style: { fontSize: "18px", fontWeight: 700 }, children: "Authorized Signatories" } },
                    { type: "div", props: { style: { fontSize: "14px", color: themeVars.textMuted, marginTop: "4px" }, children: "Verified under the authority of EquiSaaS BD." } },

                    {
                      type: "div",
                      props: {
                        style: { display: "flex", flexDirection: "row", gap: "16px", marginTop: "20px" },
                        children: [
                          // Signatory 1
                          {
                            type: "div",
                            props: {
                              style: {
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                flex: 1,
                                padding: "24px 16px",
                                borderRadius: "24px",
                                border: `1px solid ${themeVars.fieldBorder}`,
                                backgroundColor: themeVars.fieldBg,
                                position: "relative",
                                height: "160px"
                              },
                              children: [
                                {
                                  type: "img",
                                  props: {
                                    src: `${MAIN_SITE_URL}hr-seal.png`,
                                    style: { width: "80px", height: "80px", objectFit: "contain", opacity: 0.9, position: "absolute" }
                                  }
                                },
                                {
                                  type: "img",
                                  props: {
                                    src: `${MAIN_SITE_URL}hr-signature.png`,
                                    style: { width: "160px", height: "80px", objectFit: "contain", position: "absolute" }
                                  }
                                }
                              ]
                            }
                          },
                          // Signatory 2
                          {
                            type: "div",
                            props: {
                              style: {
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                flex: 1,
                                padding: "24px 16px",
                                borderRadius: "24px",
                                border: `1px solid ${themeVars.fieldBorder}`,
                                backgroundColor: themeVars.fieldBg,
                                position: "relative",
                                height: "160px"
                              },
                              children: [
                                {
                                  type: "img",
                                  props: {
                                    src: `${MAIN_SITE_URL}md-chairman-seal.png`,
                                    style: { width: "80px", height: "80px", objectFit: "contain", opacity: 0.9, position: "absolute" }
                                  }
                                },
                                {
                                  type: "img",
                                  props: {
                                    src: `${MAIN_SITE_URL}md-chairman-signature.png`,
                                    style: { width: "160px", height: "80px", objectFit: "contain", position: "absolute" }
                                  }
                                }
                              ]
                            }
                          }
                        ]
                      }
                    },
                    
                    // Custom authority note if any
                    authorityNote ? {
                      type: "div",
                      props: {
                        style: { display: "flex", flexDirection: "column", padding: "12px", borderRadius: "16px", border: `1px solid ${themeVars.fieldBorder}`, backgroundColor: themeVars.fieldBg, marginTop: "16px", alignItems: "center" },
                        children: [
                          { type: "div", props: { style: { fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2.2px", color: themeVars.textPrimary }, children: "Certificate Authority" } },
                          { type: "div", props: { style: { fontSize: "12px", color: themeVars.textMuted, marginTop: "4px", textAlign: "center" }, children: authorityNote } }
                        ]
                      }
                    } : null
                  ].filter(Boolean)
                }
              }
            ]
          }
        },

        // Footer
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
              width: "100%",
              borderTop: `1px solid ${themeVars.cardBorder}`,
              paddingTop: "16px",
              fontSize: "14px",
              color: themeVars.textMuted,
              marginTop: "24px"
            },
            children: [
              {
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "column" },
                  children: [
                    { type: "div", props: { style: { fontWeight: 700, color: themeVars.textMain }, children: `Official record issued by ${issuerOrganization}` } },
                    { type: "div", props: { style: { marginTop: "4px" }, children: "Together We Build, Together We Own" } }
                  ]
                }
              },
              {
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "column", alignItems: "flex-end" },
                  children: [
                    { type: "div", props: { style: { fontWeight: 700, color: themeVars.textMain }, children: "Verification URL" } },
                    { type: "div", props: { style: { marginTop: "4px" }, children: data.verificationUrl || "" } }
                  ]
                }
              }
            ]
          }
        }
      ]
    }
  };

  // GLC Template VDOM
  const glcVdom = {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: "80px 96px 60px 96px",
        boxSizing: "border-box",
        justifyContent: "space-between",
        color: "#0f172a",
        fontFamily: "Roboto",
      },
      children: [
        // Header
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              gap: "16px"
            },
            children: [
              {
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" },
                  children: [
                    {
                      type: "img",
                      props: {
                        src: `${MAIN_SITE_URL}glc-logo.png`,
                        style: { height: "96px", objectFit: "contain" }
                      }
                    },
                    {
                      type: "div",
                      props: {
                        style: { fontSize: "28px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "6px", color: "#065f46", marginTop: "8px" },
                        children: "GHASFUL LEARNING CENTER"
                      }
                    }
                  ]
                }
              },
              {
                type: "div",
                props: {
                  style: { fontSize: "14px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "3px", color: "#475569" },
                  children: "In Collaboration With"
                }
              },
              {
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" },
                  children: [
                    {
                      type: "img",
                      props: {
                        src: `${MAIN_SITE_URL}logo.svg`,
                        style: { height: "40px", objectFit: "contain" }
                      }
                    },
                    {
                      type: "div",
                      props: {
                        style: { fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "1.2px", color: "#475569", marginTop: "4px" },
                        children: "(Bangladesh's First Open Tech Co-operative)"
                      }
                    }
                  ]
                }
              }
            ]
          }
        },

        // Body Content
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              marginTop: "32px",
              gap: "24px"
            },
            children: [
              {
                type: "div",
                props: {
                  style: { fontSize: "18px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "6.4px", color: "#065f46" },
                  children: "Certificate of Completion"
                }
              },
              {
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: { fontSize: "22px", fontWeight: 500, color: "#475569" },
                        children: "This is to officially certify that"
                      }
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: "68px",
                          fontFamily: "Georgia",
                          fontWeight: 700,
                          color: "#065f46",
                          borderBottom: "1px solid rgba(5, 150, 105, 0.3)",
                          paddingBottom: "16px",
                          minWidth: "700px",
                          textAlign: "center"
                        },
                        children: recipientName
                      }
                    },
                    {
                      type: "div",
                      props: {
                        style: { fontSize: "18px", fontWeight: 500, color: "#475569", marginTop: "16px", textAlign: "center", maxWidth: "800px" },
                        children: "has successfully met all the academic, practical, and interactive training requirements to earn the credential"
                      }
                    }
                  ]
                }
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "24px 48px",
                    borderRadius: "24px",
                    border: "1px solid #d1fae5",
                    backgroundColor: "#f0fdf4",
                    width: "800px",
                  },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: { fontSize: "26px", fontWeight: 700, textTransform: "uppercase", color: "#065f46", textAlign: "center", letterSpacing: "2px" },
                        children: "Professional Communication & Spoken English Certification"
                      }
                    }
                  ]
                }
              },
              {
                type: "div",
                props: {
                  style: { fontSize: "16px", color: "#475569", textAlign: "center", maxWidth: "900px", lineHeight: 1.6 },
                  children: "This certificate validates that the recipient has actively participated in live interactive speaking drills, mastered core structural grammar formulas, and demonstrated competency in real-time professional communication, public speaking confidence, and active workplace interaction."
                }
              }
            ]
          }
        },

        // Bottom logistics, QR, Signatures
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              marginTop: "48px",
              gap: "48px"
            },
            children: [
              // Col 1: Logistics
              {
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "column", gap: "16px", flex: 1, justifyContent: "center" },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: { display: "flex", flexDirection: "column", gap: "4px" },
                        children: [
                          { type: "div", props: { style: { fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: "#065f46" }, children: "Program Duration" } },
                          { type: "div", props: { style: { fontSize: "14px", fontWeight: 600, color: "#1e293b" }, children: "1 Month (Intensive Live Sessions & Practical Drills)" } }
                        ]
                      }
                    },
                    {
                      type: "div",
                      props: {
                        style: { display: "flex", flexDirection: "column", gap: "4px" },
                        children: [
                          { type: "div", props: { style: { fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: "#065f46" }, children: "Date of Issuance" } },
                          { type: "div", props: { style: { fontSize: "14px", fontWeight: 600, color: "#1e293b" }, children: issuedAtLabel } }
                        ]
                      }
                    },
                    {
                      type: "div",
                      props: {
                        style: { display: "flex", flexDirection: "column", gap: "4px" },
                        children: [
                          { type: "div", props: { style: { fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: "#065f46" }, children: "Verification Serial ID" } },
                          { type: "div", props: { style: { fontSize: "14px", fontWeight: 700, fontFamily: "monospace", color: "#1e293b" }, children: `GLC-EQS-2026-${data.certificateNumber || "0001"}` } }
                        ]
                      }
                    }
                  ]
                }
              },

              // Col 2: QR Code
              {
                type: "div",
                props: {
                  style: { display: "flex", flex: 1, justifyContent: "center", alignItems: "center" },
                  children: [
                    {
                      type: "img",
                      props: {
                        src: `https://api.qrserver.com/v1/create-qr-code/?size=140x140&color=047857&data=${encodeURIComponent(data.verificationUrl || "")}`,
                        style: { width: "140px", height: "140px", borderRadius: "16px", border: "1px solid #d1fae5", padding: "12px", backgroundColor: "#ffffff" }
                      }
                    }
                  ]
                }
              },

              // Col 3: Signatures (Mehedi Hasan, MD)
              {
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "column", gap: "28px", flex: 1, alignItems: "flex-end" },
                  children: [
                    // Signature 1
                    {
                      type: "div",
                      props: {
                        style: { display: "flex", flexDirection: "column", alignItems: "flex-end", width: "100%", maxWidth: "260px" },
                        children: [
                          {
                            type: "div",
                            props: {
                              style: { height: "48px", display: "flex", alignItems: "flex-end", paddingBottom: "4px" },
                              children: [
                                {
                                  type: "div",
                                  props: {
                                    style: { fontFamily: "Caveat", fontSize: "36px", color: "#1e293b", opacity: 0.8 },
                                    children: "Mehedi Hasan"
                                  }
                                }
                              ]
                            }
                          },
                          {
                            type: "div",
                            props: {
                              style: {
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-end",
                                borderTop: "1px solid #cbd5e1",
                                paddingTop: "8px",
                                width: "100%",
                              },
                              children: [
                                { type: "div", props: { style: { fontSize: "14px", fontWeight: 700, color: "#1e293b" }, children: "Mehedi Hasan" } },
                                { type: "div", props: { style: { fontSize: "12px", color: "#475569", marginTop: "2px" }, children: "Lead Instructor & Founder" } },
                                { type: "div", props: { style: { fontSize: "12px", fontWeight: 600, color: "#065f46", marginTop: "2px" }, children: "Ghasful Learning Center" } }
                              ]
                            }
                          }
                        ]
                      }
                    },
                    // Signature 2
                    {
                      type: "div",
                      props: {
                        style: { display: "flex", flexDirection: "column", alignItems: "flex-end", width: "100%", maxWidth: "260px" },
                        children: [
                          {
                            type: "div",
                            props: {
                              style: { height: "48px", display: "flex", alignItems: "flex-end" },
                              children: [
                                {
                                  type: "img",
                                  props: {
                                    src: `${MAIN_SITE_URL}md-chairman-signature.png`,
                                    style: { height: "44px", objectFit: "contain", opacity: 0.9 }
                                  }
                                }
                              ]
                            }
                          },
                          {
                            type: "div",
                            props: {
                              style: {
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-end",
                                borderTop: "1px solid #cbd5e1",
                                paddingTop: "8px",
                                width: "100%",
                              },
                              children: [
                                { type: "div", props: { style: { fontSize: "14px", fontWeight: 700, color: "#1e293b" }, children: "K. A. Al-Amin" } },
                                { type: "div", props: { style: { fontSize: "12px", color: "#475569", marginTop: "2px" }, children: "Managing Director & Chairman" } },
                                { type: "div", props: { style: { fontSize: "12px", fontWeight: 600, color: "#065f46", marginTop: "2px" }, children: "EquiSaaS BD Co-operative" } }
                              ]
                            }
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            ]
          }
        },

        // Footer note
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              justifyContent: "center",
              width: "100%",
              borderTop: "1px solid #e2e8f0",
              paddingTop: "24px",
              fontSize: "13px",
              color: "#475569",
              marginTop: "24px"
            },
            children: [
              {
                type: "span",
                props: {
                  children: [
                    "Verify the authenticity of this document online at: ",
                    {
                      type: "span",
                      props: { style: { fontWeight: 500, color: "#047857" }, children: data.verificationUrl || "" }
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
    }
  };

  const innerVdom = themeStyle === "glc-spoken-english" ? glcVdom : standardVdom;

  // React-like Satori object tree
  const vdom = {
    type: "div",
    props: {
      style: {
        display: "flex",
        width: `${frameWidth}px`,
        height: `${frameHeight}px`,
        backgroundColor: "#0f172a", // Frame background
        alignItems: "center",
        justifyContent: "center",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              ...innerVdom.props.style,
              display: "flex",
              width: `${CERTIFICATE_WIDTH}px`,
              height: `${CERTIFICATE_HEIGHT}px`,
              backgroundImage: `url(${bgUrl})`,
              transform: `scale(${scale})`,
              position: "relative",
            },
            children: innerVdom.props.children
          }
        }
      ]
    }
  };

  const svgOutput = await satori(vdom, {
    width: frameWidth,
    height: frameHeight,
    fonts: [
      { name: "Roboto", data: robotoFont, weight: 400, style: "normal" },
      { name: "Roboto", data: robotoBoldFont, weight: 700, style: "normal" },
      { name: "Georgia", data: georgiaFont, weight: 700, style: "normal" },
      { name: "Caveat", data: caveatFont, weight: 400, style: "normal" },
    ],
  });

  return svgOutput;
}

/**
 * Fetch a single Firestore document via the public REST API.
 */
async function fetchCertificate(projectId, apiKey, certificateId) {
  const url =
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/certificates/${encodeURIComponent(certificateId)}?key=${apiKey}`;

  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });

  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Firestore REST error: ${response.status}`);

  const body = await response.json();
  if (!body.fields) return null;

  // Deserialize Firestore value map to plain object
  const fields = body.fields;
  const out = {};
  for (const [key, val] of Object.entries(fields)) {
    if ("stringValue" in val) out[key] = val.stringValue;
    else if ("booleanValue" in val) out[key] = val.booleanValue;
    else if ("integerValue" in val) out[key] = Number(val.integerValue);
    else if ("doubleValue" in val) out[key] = Number(val.doubleValue);
    else if ("timestampValue" in val) out[key] = val.timestampValue;
    else if ("nullValue" in val) out[key] = null;
    else if ("mapValue" in val) out[key] = val.mapValue; // keep raw if nested
  }
  out.credentialId = certificateId;
  return out;
}

function buildOgHtml(certificateId, cert) {
  const viewerUrl = `${LMS_CERTIFICATE_VIEWER_URL}?id=${encodeURIComponent(certificateId)}`;
  const imageUrl = `${LMS_URL}/certificate-image?id=${encodeURIComponent(certificateId)}&v=3`;
  const canonicalUrl = `${LMS_URL}/certificate?id=${encodeURIComponent(certificateId)}`;

  if (!cert) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Verify EquiSaaS BD Certificate</title>
  <meta name="description" content="Verify EquiSaaS BD certificates online using the official verification link.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
  <meta property="og:title" content="Verify EquiSaaS BD Certificate">
  <meta property="og:description" content="Verify EquiSaaS BD certificates online using the official verification link.">
  <meta property="og:image" content="${escapeHtml(MAIN_SITE_URL)}og-image.png?v=20260405">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="EquiSaaS BD">
  <meta property="fb:app_id" content="880468303867681">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Verify EquiSaaS BD Certificate">
  <meta name="twitter:description" content="Verify EquiSaaS BD certificates online using the official verification link.">
  <meta name="twitter:image" content="${escapeHtml(MAIN_SITE_URL)}og-image.png?v=20260405">
</head>
<body style="font-family:sans-serif;padding:40px;text-align:center;color:#1e293b;">
  <h1>Certificate verification</h1>
  <p>This certificate link could not be validated from the public certificate registry.</p>
  <hr style="margin:40px 0;border:0;border-top:1px solid #e2e8f0;">
  <p><a href="${escapeHtml(viewerUrl)}">Open verification page &rarr;</a></p>
</body>
</html>`;
  }

  const recipientName = String(cert.recipientName || "EquiSaaS BD learner").trim();
  const certificateTitle = String(cert.certificateTitle || "EquiSaaS BD Certificate").trim();
  const subjectTitle = String(cert.subjectTitle || "Verified learning record").trim();
  const departmentTitle = String(
    cert.departmentTitle ||
    DEPARTMENT_TITLES[String(cert.departmentId || "").trim()] ||
    "EquiSaaS BD Department",
  ).trim();
  const signerName = HR_SIGNATORY_NAME;
  const signerTitle = HR_SIGNATORY_TITLE;
  const issueDate = formatDateKey(cert.issueDateKey);
  const issuedLine = issueDate ? ` on ${issueDate}` : "";

  const title = `${recipientName} | ${certificateTitle} | EquiSaaS BD`;
  const description =
    `${recipientName} earned this official EquiSaaS BD certificate for ${subjectTitle}. ` +
    "Part of Bangladesh's first open tech cooperative where we build and own together (70-10-20 profit sharing). " +
    "Verify this official record online.";
  const mainHeading = certificateTitle;
  const bodyCopy =
    `${recipientName} completed the recognized subject ${subjectTitle} ` +
    `under ${departmentTitle}${issuedLine}. Open the official verification page to confirm the live record.`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${escapeHtml(imageUrl)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="EquiSaaS BD">
  <meta property="fb:app_id" content="880468303867681">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${escapeHtml(imageUrl)}">
</head>
<body style="font-family:sans-serif;padding:40px;text-align:center;color:#1e293b;">
  <h1>${escapeHtml(mainHeading)}</h1>
  <p>${escapeHtml(bodyCopy)}</p>
  <hr style="margin:40px 0;border:0;border-top:1px solid #e2e8f0;">
  <p>Verifying official record for <strong>${escapeHtml(recipientName)}</strong>
     &middot; Signed by ${escapeHtml(signerName)}, ${escapeHtml(signerTitle)}</p>
  <p><a href="${escapeHtml(viewerUrl)}">Confirm live record &rarr;</a></p>
</body>
</html>`;
}

async function generateCertificateImage(cert, userAgent) {
  await initResvgWasm();
  await loadFonts();

  // Determine framing dimensions based on User-Agent
  let frameWidth = 1200;
  let frameHeight = 630; // Default Facebook/Twitter
  const ua = (userAgent || "").toLowerCase();

  if (ua.includes("whatsapp")) {
    frameWidth = 1200;
    frameHeight = 1200;
  } else if (ua.includes("linkedin")) {
    frameWidth = 1200;
    frameHeight = 627;
  }

  const satoriSvg = await buildCertificateSvgWithSatori(cert, frameWidth, frameHeight);

  const resvg = new Resvg(satoriSvg, {
    fitTo: { mode: "width", value: frameWidth },
    font: { loadSystemFonts: false }
  });

  return resvg.render().asPng();
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle Image Generation Route
    if (url.pathname === "/lms/certificate-image") {
      const certificateId = url.searchParams.get("id")?.trim() || "";
      if (!certificateId) {
        return new Response("Missing certificate ID.", { status: 400 });
      }

      const projectId = env.FIREBASE_PROJECT_ID || "equisaas-bd";
      const apiKey = env.FIREBASE_API_KEY || "";
      const userAgent = request.headers.get("user-agent") || "";

      let cert = null;
      if (apiKey) {
        cert = await fetchCertificate(projectId, apiKey, certificateId);
      }
      
      const data = cert || {
        recipientName: "EquiSaaS BD Member",
        achievementTitle: "Professional Achievement",
        credentialId: certificateId || "PREVIEW-ID",
        subtitle: "Verified Platform Contribution",
        level: "Professional",
      };

      try {
        const pngBuffer = await generateCertificateImage(data, userAgent);
        return new Response(pngBuffer, {
          status: 200,
          headers: {
            "Content-Type": "image/png",
            "Cache-Control": cert
              ? "public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400"
              : "no-cache, no-store, must-revalidate",
          },
        });
      } catch (e) {
        console.error("Error generating OG image", e);
        return new Response("Error generating image: " + e.message, { status: 500 });
      }
    }

    // Handle the certificate OG HTML route
    if (url.pathname !== "/lms/certificate") {
      return fetch(request);
    }

    const certificateId = url.searchParams.get("id")?.trim() || "";
    if (!certificateId) {
      return new Response("Missing certificate ID.", { status: 400 });
    }

    const projectId = env.FIREBASE_PROJECT_ID || "equisaas-bd";
    const apiKey = env.FIREBASE_API_KEY || "";
    const userAgent = request.headers.get("user-agent") || "";
    const isBot = isSocialBot(userAgent);

    if (!isBot) {
      const redirect = `${LMS_CERTIFICATE_VIEWER_URL}?id=${encodeURIComponent(certificateId)}`;
      return Response.redirect(redirect, 302);
    }

    try {
      const cert = apiKey ? await fetchCertificate(projectId, apiKey, certificateId) : null;
      const html = buildOgHtml(certificateId, cert);
      return new Response(html, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": cert
            ? "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400"
            : "no-cache, no-store, must-revalidate",
          "X-Certificate-Worker": "og-page",
        },
      });
    } catch (error) {
      console.error("Certificate OG Worker fetch error:", error);
      const html = buildOgHtml(certificateId, null);
      return new Response(html, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
    }
  },
};
