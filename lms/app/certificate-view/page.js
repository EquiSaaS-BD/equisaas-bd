import CertificateViewerDynamic from "@/components/pages/certificate-viewer-dynamic";

export const metadata = {
  title: "Certificate Viewer",
  description:
    "Interactive EquiSaaS BD certificate viewer for download, printing, sharing, and verification support.",
  alternates: {
    canonical: "/lms/certificate",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "EquiSaaS BD Certificate Viewer",
    description:
      "Open the interactive EquiSaaS BD certificate viewer to download, print, and confirm certificate records.",
    url: "https://equisaas-bd.com/lms/certificate",
  },
  twitter: {
    title: "EquiSaaS BD Certificate Viewer",
    description:
      "Interactive certificate viewer for EquiSaaS BD credentials.",
  },
};

export default function CertificateViewerPage() {
  return <CertificateViewerDynamic />;
}
