import React, { Suspense, lazy } from "react";
import { getPublicProfileRoute } from "@/lib/publicProfile";

const AppShell = lazy(() => import("./AppShell.jsx"));
const PublicProfileView = lazy(() => import("./views/PublicProfileView.jsx"));

const RouteFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
    <div className="rounded-3xl border border-white/10 bg-white/10 px-6 py-5 text-sm font-semibold shadow-2xl backdrop-blur-xl">
      Loading EquiSaaS BD...
    </div>
  </div>
);

const App = () => {
  const publicRoute =
    typeof window !== "undefined" ? getPublicProfileRoute(window.location.pathname) : null;

  return (
    <Suspense fallback={<RouteFallback />}>
      {publicRoute ? <PublicProfileView userId={publicRoute.userId} /> : <AppShell />}
    </Suspense>
  );
};

export default App;
