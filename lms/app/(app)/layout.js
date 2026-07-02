import { AuthShell } from "@/components/layout/auth-shell";
import { LmsAnthem } from "@/components/layout/lms-anthem";
import { InteractiveTour } from "@/components/onboarding/interactive-tour";

export const metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function ProtectedLayout({ children }) {
  return (
    <>
      <LmsAnthem />
      <AuthShell>
        <InteractiveTour />
        {children}
      </AuthShell>
    </>
  );
}
