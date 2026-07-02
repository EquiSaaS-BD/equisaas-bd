"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { WorkspaceBreadcrumbs } from "@/components/layout/workspace-breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AppError({ error, reset }) {
  useEffect(() => {
    console.error("LMS route error boundary caught an error", error);
  }, [error]);

  return (
    <div className="space-y-6">
      <WorkspaceBreadcrumbs items={[{ href: "/dashboard", en: "Dashboard", bn: "ড্যাশবোর্ড" }, { href: null, en: "Error", bn: "ত্রুটি" }]} />
      <Card className="bg-card/80 backdrop-blur-xl border shadow-xl rounded-[2rem]">
        <CardHeader className="space-y-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/12 text-amber-600">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <CardTitle>Something interrupted this LMS page</CardTitle>
            <CardDescription className="text-base leading-7">
              এই পেজটি লোড হওয়ার সময় একটি runtime সমস্যা ধরা পড়েছে। আমরা blank page না দেখিয়ে আপনাকে recovery option দিচ্ছি।
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Try the page again first. If the problem started right after a deploy, use the site update/refresh flow once and reopen this section.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={() => reset()}>
              <RefreshCw className="h-4 w-4" />
              Try again
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/department">Open department again</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
