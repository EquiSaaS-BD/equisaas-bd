import HomePageClient from "@/components/pages/home-page-client";

export const metadata = {
  title: "Bangladesh LMS | EquiSaaS BD",
  description:
    "Explore the EquiSaaS BD LMS for department-based learning, proof submission, role-based review, and trusted contribution records in Bangladesh.",
  alternates: {
    canonical: "/lms",
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
    title: "EquiSaaS BD LMS | Bangladesh Learning Workspace",
    description:
      "Join one department, study guided lessons, submit proof, and keep trusted contribution records through the EquiSaaS BD LMS.",
    url: "https://equisaas-bd.com/lms",
  },
  twitter: {
    title: "EquiSaaS BD LMS | Bangladesh Learning Workspace",
    description:
      "Department-based learning, proof submission, review workflow, and trusted contribution records in one LMS.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://equisaas-bd.com/lms#webpage",
      url: "https://equisaas-bd.com/lms",
      name: "EquiSaaS BD LMS",
      description:
        "Department-based learning management system for EquiSaaS BD members in Bangladesh.",
      isPartOf: {
        "@id": "https://equisaas-bd.com/#website",
      },
      about: {
        "@id": "https://equisaas-bd.com/#organization",
      },
      inLanguage: ["en", "bn-BD"],
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://equisaas-bd.com/lms#breadcrumb",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "EquiSaaS BD",
          item: "https://equisaas-bd.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "LMS",
          item: "https://equisaas-bd.com/lms",
        },
      ],
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomePageClient />
    </>
  );
}
