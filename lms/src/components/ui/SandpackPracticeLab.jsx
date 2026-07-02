import React, { useMemo, useState } from "react";
import { Sandpack, SandpackPreview, SandpackProvider } from "@codesandbox/sandpack-react";
import { Code2, EyeOff, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const buildOptions = (files, activeFile) => ({
  activeFile,
  showNavigator: Object.keys(files || {}).length > 1,
  showTabs: true,
  editorHeight: 430,
  editorWidthPercentage: 55,
  wrapContent: true,
});

const SandpackPracticeLab = ({ sandpack = {}, files, activeFile, lang = "en" }) => {
  const [showCode, setShowCode] = useState(!sandpack?.hideCode);
  const isInteractive = sandpack?.experienceType === "interactive";
  const options = useMemo(() => buildOptions(files, activeFile), [activeFile, files]);

  if (!isInteractive) {
    return <Sandpack template={sandpack.template || "react"} theme="dark" files={files} options={options} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Badge variant="outline" className="w-fit border-emerald-500/20 bg-emerald-500/10 text-emerald-600">
            <Sparkles className="mr-1.5 h-3 w-3" />
            {lang === "bn" ? "নো-কোড প্র্যাকটিস মোড" : "No-code practice mode"}
          </Badge>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
            {lang === "bn"
              ? "এই ল্যাবটি preview-first রাখা হয়েছে, যাতে coding background ছাড়া learner-রাও ধারণাটি স্বচ্ছন্দে অনুশীলন করতে পারে। চাইলে editor খুলে ভেতরের logic-ও দেখা যাবে।"
              : "This lab opens in a preview-first mode so learners can practice the concept comfortably without needing a coding background first. You can still open the editor to inspect the underlying logic if you want."}
          </p>
        </div>
        <Button type="button" variant="outline" className="rounded-xl font-bold" onClick={() => setShowCode((current) => !current)}>
          {showCode ? <EyeOff className="mr-2 h-4 w-4" /> : <Code2 className="mr-2 h-4 w-4" />}
          {showCode ? (lang === "bn" ? "কোড লুকান" : "Hide code") : (lang === "bn" ? "কোড দেখুন" : "View code")}
        </Button>
      </div>

      {showCode ? (
        <Sandpack template={sandpack.template || "react"} theme="dark" files={files} options={options} />
      ) : (
        <SandpackProvider template={sandpack.template || "react"} theme="dark" files={files} options={{ activeFile }}>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-xl">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-slate-900 px-4 py-3">
              <span className="text-xs font-black uppercase tracking-[0.24em] text-slate-300">
                {lang === "bn" ? "প্রিভিউ মোড" : "Preview mode"}
              </span>
              <span className="text-xs text-slate-400">{lang === "bn" ? "ইন্টারঅ্যাকটিভ সিমুলেশন" : "Interactive simulation"}</span>
            </div>
            <SandpackPreview style={{ height: 430 }} showOpenInCodeSandbox={false} showRefreshButton />
          </div>
        </SandpackProvider>
      )}
    </div>
  );
};

export default SandpackPracticeLab;
