"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const CertificatePageClient = dynamic(
  () => import("@/components/pages/certificate-page-client"),
  {
    ssr: false,
    loading: () => <CertificateViewerFallback />,
  },
);

function CertificateViewerFallback() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-24 w-full md:col-span-2" />
        <Skeleton className="h-24 w-full" />
      </div>
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="space-y-2 pb-4">
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-11 w-full" />
      </div>
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="space-y-2 pb-4">
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-72 w-full" />
      </div>
    </div>
  );
}

export default function CertificateViewerDynamic() {
  return <CertificatePageClient />;
}
