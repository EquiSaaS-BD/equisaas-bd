import React, { Suspense, lazy } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {
  AlertTriangle,
  BookOpenText,
  ClipboardList,
  FileText,
  GraduationCap,
  HelpCircle,
  Lightbulb,
  ListChecks,
  Rocket,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";

const Sandpack = lazy(() => import("@codesandbox/sandpack-react").then((mod) => ({ default: mod.Sandpack })));
const SandpackPracticeLab = lazy(() => import("./SandpackPracticeLab.jsx"));
const PracticeLabView = lazy(() => import("./PracticeLabView.jsx"));

const normalizeSandpackFiles = (files = {}) => {
  return Object.fromEntries(
    Object.entries(files).map(([path, file]) => {
      if (typeof file === "string") {
        return [path, file];
      }

      return [path, file?.code || ""];
    }),
  );
};

const sandpackFallback = (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-600">
    Loading practice lab...
  </div>
);

const LESSON_SECTION_META = [
  {
    patterns: [/^what you will learn$/i, /^এই লেসনে আপনি শিখবেন$/i],
    icon: GraduationCap,
    classes: "border-sky-200/80 bg-gradient-to-br from-sky-50 via-white to-cyan-50",
  },
  {
    patterns: [/^what it is$/i, /^এটি আসলে কী$/i, /^key concepts$/i, /^মূল ধারণা$/i],
    icon: HelpCircle,
    classes: "border-brand-blue/20 bg-gradient-to-br from-brand-blue/5 via-white to-sky-50/80",
  },
  {
    patterns: [/^why it matters$/i, /^কেন গুরুত্বপূর্ণ$/i],
    icon: Lightbulb,
    classes: "border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-white to-lime-50/70",
  },
  {
    patterns: [/^think of it like this$/i, /^সহজভাবে ভাবুন$/i],
    icon: HelpCircle,
    classes: "border-violet-200/80 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50/70",
  },
  {
    patterns: [/step by step/i, /ধাপে ধাপে/i],
    icon: ListChecks,
    classes: "border-amber-200/80 bg-gradient-to-br from-amber-50 via-white to-orange-50/70",
  },
  {
    patterns: [/^when to use it$/i, /^কখন ব্যবহার করবেন$/i],
    icon: Rocket,
    classes: "border-indigo-200/80 bg-gradient-to-br from-indigo-50 via-white to-sky-50/70",
  },
  {
    patterns: [/^real example$/i, /^বাস্তব উদাহরণ$/i],
    icon: BookOpenText,
    classes: "border-cyan-200/80 bg-gradient-to-br from-cyan-50 via-white to-sky-50/70",
  },
  {
    patterns: [/^common mistakes$/i, /^সাধারণ ভুল$/i],
    icon: AlertTriangle,
    classes: "border-rose-200/80 bg-gradient-to-br from-rose-50 via-white to-orange-50/60",
  },
  {
    patterns: [/^how to apply it$/i, /^কীভাবে নিজের কাজে ব্যবহার করবেন$/i],
    icon: Rocket,
    classes: "border-teal-200/80 bg-gradient-to-br from-teal-50 via-white to-emerald-50/60",
  },
  {
    patterns: [/^assignment challenge$/i, /^অ্যাসাইনমেন্ট$/i],
    icon: ClipboardList,
    classes: "border-brand-blue/20 bg-gradient-to-br from-brand-blue/5 via-white to-cyan-50/80",
  },
  {
    patterns: [/^quick self-check$/i, /^নিজেকে যাচাই করুন$/i],
    icon: GraduationCap,
    classes: "border-pink-200/80 bg-gradient-to-br from-pink-50 via-white to-rose-50/70",
  },
  {
    patterns: [/^summary$/i, /^সারসংক্ষেপ$/i],
    icon: FileText,
    classes: "border-slate-200/90 bg-gradient-to-br from-slate-50 via-white to-slate-100/70",
  },
];

const lessonBodyProseClassName =
  "prose prose-slate max-w-none prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900 prose-h1:text-4xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-[1.02rem] prose-p:leading-relaxed prose-p:text-slate-700 prose-a:font-bold prose-a:text-brand-blue prose-a:no-underline hover:prose-a:underline prose-strong:font-black prose-strong:text-slate-900 prose-li:text-slate-700 marker:text-brand-blue prose-blockquote:rounded-r-xl prose-blockquote:border-l-brand-blue prose-blockquote:bg-brand-blue/5 prose-blockquote:px-4 prose-blockquote:py-1 prose-blockquote:not-italic prose-blockquote:text-slate-700";

const parseLessonMarkdown = (content = "") => {
  const lines = String(content || "").split(/\r?\n/);
  let title = "";
  const introLines = [];
  const sections = [];
  let activeSection = null;

  const pushActiveSection = () => {
    if (!activeSection) return;
    const body = activeSection.bodyLines.join("\n").trim();
    if (body) {
      sections.push({
        id: `lesson-section-${sections.length + 1}`,
        heading: activeSection.heading,
        body,
      });
    }
    activeSection = null;
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!title && /^#{1,2}\s+/.test(trimmed)) {
      title = trimmed.replace(/^#{1,2}\s+/, "").trim();
      return;
    }

    if (/^###\s+/.test(trimmed)) {
      pushActiveSection();
      activeSection = {
        heading: trimmed.replace(/^###\s+/, "").trim(),
        bodyLines: [],
      };
      return;
    }

    if (activeSection) {
      activeSection.bodyLines.push(line);
    } else {
      introLines.push(line);
    }
  });

  pushActiveSection();

  return {
    title,
    intro: introLines.join("\n").trim(),
    sections,
  };
};

const getLessonSectionMeta = (heading = "") =>
  LESSON_SECTION_META.find((item) => item.patterns.some((pattern) => pattern.test(heading))) || {
    icon: BookOpenText,
    classes: "border-slate-200 bg-gradient-to-br from-white via-slate-50/60 to-white",
  };

const getPracticeCopy = (lab, lang) => {
  const isInteractive = lab?.experienceType === "interactive" || Boolean(lab?.kind);

  if (lang === "bn") {
    return {
      title: lab?.titleBn || lab?.labTitleBn || (isInteractive ? "ইন্টারঅ্যাকটিভ প্র্যাকটিস এক্সারসাইজ" : "লাইভ কোড এক্সপেরিমেন্ট"),
      description:
        lab?.introBn ||
        lab?.labIntroBn ||
        (isInteractive
          ? "preview-first workspace-এ concept অনুশীলন করুন। চাইলে editor খুলে simulation-এর logic-ও দেখতে পারবেন।"
          : "নিচের কোডটি পরিবর্তন করে ধারণাগুলো হাতে-কলমে অনুশীলন করুন।"),
    };
  }

  return {
    title: lab?.titleEn || lab?.labTitleEn || (isInteractive ? "Interactive Practice Exercise" : "Live Code Experiment"),
    description:
      lab?.introEn ||
      lab?.labIntroEn ||
      (isInteractive
        ? "Practice the concept in a preview-first workspace, and open the editor only if you want to inspect the simulation logic."
        : "Edit the code below to practice the lesson concepts hands-on."),
  };
};

const InteractiveLessonView = ({ content, sandpack, practice, resources = [], lang = "en" }) => {
  const structuredFiles = sandpack?.files ? normalizeSandpackFiles(sandpack.files) : null;
  const firstFile = structuredFiles ? Object.keys(structuredFiles)[0] : "/App.js";
  const practiceCopy = getPracticeCopy(practice || sandpack, lang);
  const lessonLayout = parseLessonMarkdown(content);

  const components = {
    code({ inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const isLive = className?.includes("live");

      if (!inline && match && isLive) {
        return (
          <div className="my-8 overflow-hidden rounded-2xl border border-slate-200/60 shadow-2xl">
            <div className="flex items-center gap-2 border-b border-white/10 bg-slate-900 px-4 py-2">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-amber-500" />
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
              </div>
              <span className="ml-2 font-mono text-xs text-slate-400">Interactive Sandbox</span>
            </div>
            <Suspense fallback={sandpackFallback}>
              <Sandpack
                template="react"
                theme="dark"
                files={{
                  "/App.js": String(children).replace(/\n$/, ""),
                }}
                options={{
                  showNavigator: true,
                  showTabs: true,
                  editorHeight: 430,
                  editorWidthPercentage: 55,
                  wrapContent: true,
                }}
              />
            </Suspense>
          </div>
        );
      }

      return !inline && match ? (
        <pre className="my-6 overflow-x-auto rounded-2xl border border-white/5 bg-[#0d1117] p-5 font-mono text-sm leading-relaxed text-slate-50 shadow-inner">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      ) : (
        <code className="mx-0.5 rounded-md bg-brand-blue/10 px-1.5 py-0.5 font-mono text-[0.85em] font-bold text-brand-blue" {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {lessonLayout.sections.length > 0 ? (
        <div className="space-y-6">
          <Card className="overflow-hidden border-brand-blue/15 bg-gradient-to-br from-white via-brand-blue/5 to-emerald-50/70 shadow-xl">
            <CardHeader className="pb-4">
              <div className="text-xs font-black uppercase tracking-[0.24em] text-brand-blue/80">
                {lang === "bn" ? "লার্নিং গাইড" : "Learning Guide"}
              </div>
              <CardTitle className="mt-2 text-2xl font-black text-slate-900">
                {lessonLayout.title || (lang === "bn" ? "আজকের লেকচার" : "Today's Lecture")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {lessonLayout.intro ? (
                <div className={lessonBodyProseClassName}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={components}>
                    {lessonLayout.intro}
                  </ReactMarkdown>
                </div>
              ) : null}

              <div>
                <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                  {lang === "bn" ? "এই লেকচারে কী কী আছে" : "What This Lecture Covers"}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {lessonLayout.sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-brand-blue/30 hover:text-brand-blue"
                    >
                      {section.heading}
                    </a>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-5">
            {lessonLayout.sections.map((section) => {
              const meta = getLessonSectionMeta(section.heading);
              const Icon = meta.icon;

              return (
                <Card
                  key={section.id}
                  id={section.id}
                  className={`scroll-mt-28 overflow-hidden shadow-lg ${meta.classes}`}
                >
                  <CardHeader className="border-b border-black/5 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 text-brand-blue shadow-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-xl font-black text-slate-900">{section.heading}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className={lessonBodyProseClassName}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={components}>
                        {section.body}
                      </ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        <div className={lessonBodyProseClassName}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={components}>
            {content}
          </ReactMarkdown>
        </div>
      )}

      {(structuredFiles || practice?.kind) && (
        <section className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
            <div className="text-xs font-black uppercase tracking-[0.24em] text-brand-blue/80">
              {lang === "bn" ? "প্র্যাকটিস ল্যাব" : "Practice Lab"}
            </div>
            <h3 className="mt-2 text-xl font-black text-slate-900">{practiceCopy.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{practiceCopy.description}</p>
          </div>
          <div className="p-6">
            <Suspense fallback={sandpackFallback}>
              {practice?.kind ? (
                <PracticeLabView key={`${practice.kind}-${practice.titleEn || practice.titleBn || "practice"}`} practice={practice} lang={lang} />
              ) : (
                <SandpackPracticeLab
                  key={`${sandpack?.template || "sandpack"}-${firstFile}`}
                  sandpack={sandpack}
                  files={structuredFiles}
                  activeFile={firstFile}
                  lang={lang}
                />
              )}
            </Suspense>
          </div>
        </section>
      )}

      {resources.length > 0 && (
        <section className="mt-10">
          <div className="text-xs font-black uppercase tracking-[0.24em] text-brand-blue/80">
            {lang === "bn" ? "রিসোর্স" : "Resources"}
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {resources.map((resource) => (
              <a
                key={resource.url}
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-blue/40 hover:shadow-md"
              >
                <div className="text-sm font-black text-slate-900 group-hover:text-brand-blue">
                  {lang === "bn" ? resource.labelBn : resource.labelEn}
                </div>
                <div className="mt-2 text-xs leading-relaxed text-slate-500">{resource.url}</div>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default InteractiveLessonView;
