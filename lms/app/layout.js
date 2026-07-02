import "./globals.css";
import Script from "next/script";
import { Inter, Noto_Sans_Bengali } from "next/font/google";
import { AuthProvider } from "@/components/providers/auth-provider";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { GlobalInteractivity } from "@/components/layout/global-interactivity";
import { AppToaster } from "@/components/ui/app-toaster";
import { UpdateAvailableBanner } from "@/components/layout/update-available-banner";
import { ClarityTracker } from "@/components/providers/clarity-tracker";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali", "latin"],
  variable: "--font-bangla",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://equisaas-bd.com"),
  title: {
    default: "EquiSaaS BD LMS | Bangladesh Learning Workspace",
    template: "%s | EquiSaaS BD LMS",
  },
  description:
    "EquiSaaS, publicly branded as EquiSaaS BD, runs a Bangladesh-ready LMS for department learning, proof submission, sweat equity contribution, and real SaaS work.",
  keywords: [
    "EquiSaaS",
    "EquiSaaS BD",
    "Kholipha Ahmmad Al-Amin",
    "খলিফা আহম্মেদ আল-আমিন",
    "LMS Bangladesh",
    "Sweat Equity",
    "Bangladesh SaaS",
    "Bangladesh software company",
    "Open Tech Cooperative",
    "Software training Bangladesh",
    "Community learning Bangladesh",
  ],
  authors: [{ name: "Kholipha Ahmmad Al-Amin" }, { name: "খলিফা আহম্মেদ আল-আমিন" }],
  publisher: "EquiSaaS BD",
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
  icons: {
    icon: [
      { url: "/favicon.svg?v=20260405", type: "image/svg+xml" },
      { url: "/favicon.png?v=20260405", type: "image/png" },
    ],
    apple: "/favicon.png?v=20260405",
  },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    url: "https://equisaas-bd.com/lms",
    siteName: "EquiSaaS BD",
    title: "EquiSaaS BD LMS | Bangladesh Learning Workspace",
    description:
      "Join one department, study guided lessons, submit proof, and track approved contribution records in the EquiSaaS BD LMS.",
    images: [
      {
        url: "https://equisaas-bd.com/og-image-bn.png?v=20260405",
        width: 1200,
        height: 630,
        alt: "EquiSaaS BD LMS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EquiSaaS BD LMS | Bangladesh Learning Workspace",
    description:
      "Department-based learning, proof submission, role-based review, and trusted contribution records in one LMS.",
    images: ["https://equisaas-bd.com/og-image-bn.png?v=20260405"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body className={`${inter.variable} ${notoSansBengali.variable} font-sans`}>
        <Script id="theme-init" strategy="beforeInteractive">
          {`try {
            const primaryThemeKey = 'equisaas-lms-theme';
            const globalThemeKey = 'theme';
            const storedTheme = window.localStorage.getItem(primaryThemeKey) || window.localStorage.getItem(globalThemeKey);
            const theme = storedTheme === 'light' || storedTheme === 'dark'
              ? storedTheme
              : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            document.documentElement.classList.toggle('dark', theme === 'dark');
            document.documentElement.dataset.theme = theme;
            window.localStorage.setItem(primaryThemeKey, theme);
            window.localStorage.setItem(globalThemeKey, theme);

            const primaryLocaleKey = 'equisaas-lms-locale';
            const globalLocaleKey = 'lang';
            const storedLocale = window.localStorage.getItem(primaryLocaleKey) || window.localStorage.getItem(globalLocaleKey);
            const locale = storedLocale === 'en' ? 'en' : 'bn';
            document.documentElement.lang = locale;
            document.documentElement.dataset.locale = locale;
            window.localStorage.setItem(primaryLocaleKey, locale);
            window.localStorage.setItem(globalLocaleKey, locale);
          } catch (error) {
            document.documentElement.classList.remove('dark');
            document.documentElement.dataset.theme = 'light';
            document.documentElement.lang = 'bn';
            document.documentElement.dataset.locale = 'bn';
          }`}
        </Script>

        <LocaleProvider>
          <ThemeProvider>
            <AuthProvider>
              <ClarityTracker />
              <GlobalInteractivity />
              {children}
              <AppToaster />
              <UpdateAvailableBanner />
            </AuthProvider>
          </ThemeProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
