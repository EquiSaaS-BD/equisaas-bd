import LoginPageClient from "@/components/pages/login-page-client";

export const metadata = {
  title: "Login",
  description:
    "Log in to the EquiSaaS BD LMS to continue department learning, submit proof, and access your workspace.",
  alternates: {
    canonical: "/lms/login",
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

export default function LoginPage() {
  return <LoginPageClient />;
}
