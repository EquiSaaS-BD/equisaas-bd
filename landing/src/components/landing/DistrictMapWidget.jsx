import React from "react";
import { MapPinned, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DISTRICT_MAP_DIVISIONS, getDistrictNode } from "@/data/bangladeshDistricts";

export default function DistrictMapWidget({ lang = "en", value = "", onChange, className }) {
  const selectedDistrict = getDistrictNode(value);

  return (
    <Card className={cn("bg-background/60 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-2xl border-0 overflow-hidden", className)}>
      <CardHeader className="space-y-2">
        <CardTitle className="text-xl font-black flex items-center gap-2">
          <MapPinned className="h-5 w-5 text-primary" />
          {lang === "bn" ? "আপনার জেলা বেছে নিন" : "Pick Your District"}
        </CardTitle>
        <CardDescription className="text-muted-foreground leading-relaxed">
          {lang === "bn"
            ? "৬৪ জেলার যেকোনো একটি বেছে নিন। এই জেলা LMS-এ path deep link, social proof, এবং future district pods-এর জন্য ব্যবহার হবে।"
            : "Choose any of the 64 districts. We use it for LMS deep links, social proof, and future district pods."}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
        <div className="relative overflow-hidden rounded-[28px] border border-border/50 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_38%),linear-gradient(160deg,rgba(255,255,255,0.95),rgba(244,247,255,0.92))] p-4 shadow-inner shadow-primary/5 min-h-[520px]">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-[20%] top-[10%] h-36 w-36 rounded-full bg-sky-500/10 blur-3xl" />
            <div className="absolute left-[54%] top-[32%] h-44 w-44 rounded-full bg-violet-500/10 blur-3xl" />
            <div className="absolute left-[68%] top-[58%] h-44 w-44 rounded-full bg-emerald-500/10 blur-3xl" />
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full opacity-40">
              <path d="M24 13 C 38 18, 45 28, 50 38" fill="none" stroke="currentColor" strokeWidth="0.6" className="text-slate-300" />
              <path d="M22 35 C 32 42, 38 50, 49 60" fill="none" stroke="currentColor" strokeWidth="0.6" className="text-slate-300" />
              <path d="M50 39 C 58 28, 66 22, 75 20" fill="none" stroke="currentColor" strokeWidth="0.6" className="text-slate-300" />
              <path d="M50 39 C 60 47, 66 55, 73 64" fill="none" stroke="currentColor" strokeWidth="0.6" className="text-slate-300" />
              <path d="M48 60 C 42 68, 44 74, 48 82" fill="none" stroke="currentColor" strokeWidth="0.6" className="text-slate-300" />
            </svg>
          </div>

          <div className="relative aspect-[5/6] w-full max-w-[560px] mx-auto">
            {DISTRICT_MAP_DIVISIONS.map((division) => {
              const xs = division.districts.map((district) => district.x);
              const ys = division.districts.map((district) => district.y);
              const centerX = xs.reduce((sum, item) => sum + item, 0) / xs.length;
              const centerY = ys.reduce((sum, item) => sum + item, 0) / ys.length;
              return (
                <React.Fragment key={division.id}>
                  <div
                    className={cn("absolute h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl", division.colors.halo)}
                    style={{ left: `${centerX}%`, top: `${centerY}%` }}
                  />
                  <div
                    className={cn("absolute -translate-x-1/2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] shadow-sm bg-background/90 backdrop-blur", division.colors.badge)}
                    style={{ left: `${centerX}%`, top: `${Math.max(centerY - 11, 6)}%` }}
                  >
                    {lang === "bn" ? division.nameBn : division.nameEn}
                  </div>
                  {division.districts.map((district) => {
                    const active = district.id === value;
                    return (
                      <button
                        key={district.id}
                        type="button"
                        onClick={() => onChange?.(district.id)}
                        aria-pressed={active}
                        aria-label={lang === "bn" ? district.nameBn : district.nameEn}
                        title={lang === "bn" ? district.nameBn : district.nameEn}
                        className={cn(
                          "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-primary/20",
                          active ? "h-5 w-5 scale-125 bg-primary ring-4 ring-primary/15" : `h-4 w-4 hover:scale-125 ${division.colors.node}`
                        )}
                        style={{ left: `${district.x}%`, top: `${district.y}%` }}
                      >
                        <span className="sr-only">{lang === "bn" ? district.nameBn : district.nameEn}</span>
                      </button>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-border/60 bg-background/70 p-5">
            <div className="text-[10px] font-black uppercase tracking-[0.24em] text-muted-foreground">
              {lang === "bn" ? "নির্বাচিত জেলা" : "Selected District"}
            </div>
            {selectedDistrict ? (
              <div className="mt-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xl font-black leading-tight">{lang === "bn" ? selectedDistrict.nameBn : selectedDistrict.nameEn}</div>
                  <div className="text-sm text-muted-foreground">{lang === "bn" ? "LMS deep link-এ যুক্ত হবে" : "Will be added to the LMS deep link"}</div>
                </div>
                <Button type="button" variant="outline" size="icon" className="rounded-full" onClick={() => onChange?.("") }>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {lang === "bn" ? "ম্যাপ বা তালিকা থেকে একটি জেলা বেছে নিন।" : "Choose a district from the map or the list."}
              </p>
            )}
          </div>

          <div className="max-h-[520px] space-y-3 overflow-y-auto pr-1">
            {DISTRICT_MAP_DIVISIONS.map((division) => (
              <div key={division.id} className="rounded-3xl border border-border/60 bg-background/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-black tracking-tight">{lang === "bn" ? division.nameBn : division.nameEn}</div>
                  <Badge className={cn("border font-black", division.colors.badge)}>{division.districts.length}</Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {division.districts.map((district) => {
                    const active = district.id === value;
                    return (
                      <button
                        key={district.id}
                        type="button"
                        onClick={() => onChange?.(district.id)}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-xs font-bold transition-all",
                          active ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-background border-border/70 text-foreground hover:bg-muted/40"
                        )}
                      >
                        {lang === "bn" ? district.nameBn : district.nameEn}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
