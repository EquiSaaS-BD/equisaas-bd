import RegisterPageClient from "@/components/pages/register-page-client";

export const metadata = {
  title: "Register",
  description:
    "Create your EquiSaaS BD LMS account to join one department, start guided learning, and submit proof-based work.",
  alternates: {
    canonical: "/lms/register",
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
};

export default function RegisterPage() {
  return <RegisterPageClient />;
}
