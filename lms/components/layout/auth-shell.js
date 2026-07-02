"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppMenuBar } from "@/components/ui/app-menu-bar";
import { MobileBottomBar } from "@/components/layout/mobile-bottom-bar";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { canBrowseAllDepartments, getDepartmentTitle, getParentTitle, roleLabel, roleLabels } from "@/lib/catalog";
import { getCurrentWorkspaceItem, getVisibleWorkspaceNavSections } from "@/lib/workspace-navigation-clean";

export function AuthShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const authState = useAuth();
  const { copy } = useLocale();
  const [mobileMenuTrigger, setMobileMenuTrigger] = useState(0);

  useEffect(() => {
    if (!authState.loading && !authState.user) {
      router.replace("/login");
    }
  }, [authState.loading, authState.user, router]);

  if (authState.loading) {
    return (
      <div className="mesh-premium flex min-h-screen items-center justify-center p-6">
        <Card className="w-full max-w-xl overflow-hidden rounded-[2rem] border border-border/60 bg-card/85 shadow-[0_28px_70px_-36px_rgba(15,23,42,0.5)] backdrop-blur-xl">
          <CardContent className="space-y-3 p-10 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              {copy("EquiSaaS BD LMS", "ইকুইসাস বিডি এলএমএস")}
            </p>
            <h1 className="text-2xl font-semibold">{copy("Opening your workspace", "আপনার ওয়ার্কস্পেস খোলা হচ্ছে")}</h1>
            <p className="text-sm text-muted-foreground">
              {copy(
                "Checking your role, department scope, and access rights.",
                "আপনার রোল, ডিপার্টমেন্ট স্কোপ, এবং অ্যাক্সেস অনুমতি যাচাই করা হচ্ছে।",
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!authState.user) {
    return (
      <div className="mesh-premium flex min-h-screen items-center justify-center p-6">
        <Card className="w-full max-w-md overflow-hidden rounded-[2rem] border border-border/60 bg-card/85 shadow-[0_24px_60px_-34px_rgba(15,23,42,0.45)] backdrop-blur-xl">
          <CardContent className="space-y-4 p-8 text-center">
            <h1 className="text-2xl font-semibold">{copy("Redirecting to login", "লগইনে নেওয়া হচ্ছে")}</h1>
            <p className="text-sm text-muted-foreground">
              {copy("You need an authenticated LMS account to continue.", "এগিয়ে যেতে আপনার একটি logged-in LMS account দরকার।")}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const visibleNavSections = getVisibleWorkspaceNavSections({
    canManage: authState.canManage,
    canReview: authState.canReview,
  });
  const currentItem = getCurrentWorkspaceItem(pathname, visibleNavSections);
  const profileTone = canBrowseAllDepartments(authState)
    ? copy("Global operations", "গ্লোবাল অপারেশনস")
    : getDepartmentTitle(authState.profile?.departmentId);

  return (
    <TooltipProvider delayDuration={400}>
      <div className="mesh-premium min-h-screen">
        <a href="#lms-main" className="skip-link-lms">
          {copy("Skip to workspace content", "মূল কাজের অংশে যান")}
        </a>

        <div className="mx-auto flex min-h-screen w-full max-w-[1720px] flex-col gap-4 px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-5 xl:px-7">
          <AppMenuBar
            className="sticky top-3 z-50 sm:top-4 lg:top-5"
            sections={visibleNavSections}
            pathname={pathname}
            role={authState.role}
            roleLabel={roleLabel(authState)}
            roleBadges={roleLabels(authState)}
            canManage={authState.canManage}
            canReview={authState.canReview}
            currentItem={currentItem}
            profile={authState.profile}
            email={authState.user.email}
            profileTone={profileTone}
            departmentTitle={getDepartmentTitle(authState.profile?.departmentId)}
            parentTitle={getParentTitle(authState.profile?.parentDepartmentId)}
            totalPoints={authState.profile?.totalPoints || 0}
            onLogout={() => authState.logout()}
            mobileMenuTrigger={mobileMenuTrigger}
          />

          <main
            id="lms-main"
            className="flex-1 space-y-4 pb-32 lg:pb-6"
            tabIndex={-1}
          >
            {children}
          </main>
        </div>

        {/* Mobile bottom tab bar */}
        <MobileBottomBar
          canReview={authState.canReview}
          canManage={authState.canManage}
          onMenuOpen={() => setMobileMenuTrigger((n) => n + 1)}
        />
      </div>
    </TooltipProvider>
  );
}
