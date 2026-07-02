export const MAIN_SITE_URL = "https://equisaas-bd.com/";
export const LMS_SITE_URL = "https://equisaas-bd.com/lms/";
export const REGISTRATION_FORM_URL = "https://forms.gle/tk1ps3Uonr2zqPku7";
export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@equisaas";
export const FACEBOOK_PAGE_URL = "https://www.facebook.com/EquiSaaSBD";
export const FACEBOOK_GROUP_URL = "https://www.facebook.com/groups/1253385930100939/";
export const LINKEDIN_COMPANY_URL = "https://www.linkedin.com/company/equisaas-bd/";
export const GOOGLE_BUSINESS_PROFILE_URL = "https://share.google/thqMKnWXp67tnmDMT";
export const HQ_MAP_URL = "https://maps.app.goo.gl/og6pQYJpRknXkyC89";
export const SUPPORT_EMAIL = "support@equisaas-bd.com";
export const CEO_EMAIL = "ceo@equisaas-bd.com";
export const HR_EMAIL = "hr@equisaas-bd.com";
export const WHATSAPP_NUMBER = "+8801570212260";
export const WHATSAPP_URL = "https://wa.me/8801570212260";
export const HQ_ADDRESS = "734, AMIR PALACE, Hazrat Ali Road, West Nakhalpara, Tejgaon, Dhaka 1215";

export const PUBLIC_COMMUNITY_LINKS = {
  registrationForm: REGISTRATION_FORM_URL,
  youtube: YOUTUBE_CHANNEL_URL,
  facebookPage: FACEBOOK_PAGE_URL,
  facebookGroup: FACEBOOK_GROUP_URL,
  linkedin: LINKEDIN_COMPANY_URL,
  googleBusinessProfile: GOOGLE_BUSINESS_PROFILE_URL,
  map: HQ_MAP_URL,
  supportEmail: SUPPORT_EMAIL,
  ceoEmail: CEO_EMAIL,
  hrEmail: HR_EMAIL,
  whatsappNumber: WHATSAPP_NUMBER,
  whatsappUrl: WHATSAPP_URL,
  hqAddress: HQ_ADDRESS,
};

export const buildCertificateVerificationUrl = (certificateId) =>
  certificateId ? `${LMS_SITE_URL}certificate?id=${encodeURIComponent(String(certificateId).trim())}` : `${LMS_SITE_URL}certificate`;
