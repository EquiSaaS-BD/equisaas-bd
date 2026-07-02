import {
  FOUNDER_PORTFOLIO_MANIFEST,
  FOUNDER_PROFILE_HUB,
  FOUNDER_SELECTED_LABS,
  FOUNDER_SELECTED_PROJECTS,
  FOUNDER_SOCIAL_SAME_AS,
} from "@/data/founder-portfolio-manifest";

export const LINKS = {
  githubOrg: "https://github.com/orgs/EquiSaaS-BD/",
  registrationForm: "https://forms.gle/tk1ps3Uonr2zqPku7",
  form: "https://forms.gle/tk1ps3Uonr2zqPku7",
  youtube: "https://www.youtube.com/@equisaas",
  orientationVideo: "https://www.youtube.com/watch?v=PoGoPVgrmUo",
  orientationPage: "/orientation-2026/",
  founderPage: "/founder/",
  founderPortfolio: FOUNDER_PROFILE_HUB,
  founderProjects: FOUNDER_PORTFOLIO_MANIFEST.site.projectsDirectory,
  founderLabs: FOUNDER_PORTFOLIO_MANIFEST.site.labsDirectory,
  founderLinksDirectory: FOUNDER_PORTFOLIO_MANIFEST.site.linksDirectory,
  founderPortfolioManifestJson: FOUNDER_PORTFOLIO_MANIFEST.site.linkManifestJson,
  founderPortfolioManifestText: FOUNDER_PORTFOLIO_MANIFEST.site.linkManifestText,
  founderPortfolioSitemap: FOUNDER_PORTFOLIO_MANIFEST.site.sitemap,
  founderPortfolioRobots: FOUNDER_PORTFOLIO_MANIFEST.site.robots,
  founderResumePdf: FOUNDER_PORTFOLIO_MANIFEST.documents[0],
  founderResumeHtml: FOUNDER_PORTFOLIO_MANIFEST.documents[1],
  founderResumeText: FOUNDER_PORTFOLIO_MANIFEST.documents[2],
  founderVCard: FOUNDER_PORTFOLIO_MANIFEST.documents[3],
  founderImageLicensing: FOUNDER_PORTFOLIO_MANIFEST.documents[4],
  founderSelectedProjects: FOUNDER_SELECTED_PROJECTS,
  founderSelectedLabs: FOUNDER_SELECTED_LABS,
  founderSameAs: FOUNDER_SOCIAL_SAME_AS,
  openTechCooperativePage: "/open-tech-cooperative-bangladesh/",
  website: "https://equisaas-bd.com/",
  websiteFallback: "https://equisaas-bd.web.app/",
  lms: "https://equisaas-bd.com/lms/",
  ceoEmail: "ceo@equisaas-bd.com",
  supportEmail: "support@equisaas-bd.com",
  hrEmail: "hr@equisaas-bd.com",
  fbPage: "https://www.facebook.com/EquiSaaSBD",
  linkedin: "https://www.linkedin.com/company/equisaas-bd/",
  fbGroup: "https://www.facebook.com/groups/1253385930100939/",
  whatsapp: "+8801570212260",
  whatsappLink: "https://wa.me/8801570212260",
  bdErpPosPage: "/bd-erp-pos/",
  bdErpPosManual: "/bd-erp-pos/manual/",
  bdErpPosDownload: "https://updates.equisaas-bd.com/erp-pos/stable/BdErpPos-win-Setup.exe",
  bdErpPosLegacyDownload:
    "https://updates.equisaas-bd.com/erp-pos/stable/BdErpPos-win-Setup.exe",
  bdErpPosRequestDemo:
    "https://wa.me/8801570212260?text=Hello%20EquiSaaS%20BD%2C%20I%20want%20a%20demo%20of%20BD%20ERP%20POS.",   
  bdErpPosContact:
    "mailto:support@equisaas-bd.com?subject=BD%20ERP%20POS%20Inquiry",
  bdErpPosUpdateFeed: "https://updates.equisaas-bd.com/erp-pos/stable",
  bdErpPosUpdateReleases: "https://updates.equisaas-bd.com/erp-pos/stable/RELEASES",
  bdErpPosUpdateManifest:
    "https://updates.equisaas-bd.com/erp-pos/stable/releases.win.json",
  bdErpPosUpdateAssets:
    "https://updates.equisaas-bd.com/erp-pos/stable/assets.win.json",
  googleBusinessProfile: "https://share.google/thqMKnWXp67tnmDMT",
  hq: "734, AMIR PALACE, Hazrat Ali Road, West Nakhalpara, Tejgaon, Dhaka 1215",
  hqMap: "https://maps.app.goo.gl/og6pQYJpRknXkyC89",
};

// Keeping this backward compatible for any other file using it
export const APPLICATION_LINK = LINKS.registrationForm;


