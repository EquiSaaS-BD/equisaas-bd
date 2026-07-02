import React, { useEffect, useState } from "react";
import { Command } from "cmdk";
import * as Dialog from "@radix-ui/react-dialog";
import { Search, Moon, Sun, ArrowRight, Book, Users, Star } from "lucide-react";
import { APPLICATION_LINK } from "@/data/cofounder";

export default function CommandPalette({ lang, theme, setTheme }) {
  const [open, setOpen] = useState(false);

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command) => {
    setOpen(false);
    command();
  };

  const t = lang === "bn" ? {
    placeholder: "কী খুঁজছেন? (যেমন: এপ্লাই)",
    actions: "অ্যাকশনস",
    pages: "পেজসমূহ",
    theme: "থিম টগল",
    apply: "রেজিস্ট্রেশন করুন",
    masterplan: "আমাদের মাস্টারপ্ল্যান",
    departments: "ডিপার্টমেন্ট এক্সপ্লোর করুন",
    dark: "ডার্ক মোড চালু করুন",
    light: "লাইট মোড চালু করুন",
  } : {
    placeholder: "Type a command or search...",
    actions: "Actions",
    pages: "Pages",
    theme: "Theme",
    apply: "Apply Now",
    masterplan: "Our Masterplan",
    departments: "Explore Departments",
    dark: "Switch to Dark Mode",
    light: "Switch to Light Mode",
  };

  if (!open) return null;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="fixed left-1/2 top-1/4 z-[100] w-full max-w-xl -translate-x-1/2 rounded-2xl border border-border/50 bg-card/95 shadow-2xl backdrop-blur-xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <Command className="w-full flex flex-col overflow-hidden text-foreground">
              {/* Psychological UX: Endowed Progress Effect */}
              <div className="bg-primary/10 px-4 py-2 border-b border-primary/20 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Star className="h-4 w-4 text-primary fill-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider">{lang === "bn" ? "প্রো-মোড চালু!" : "Pro Mode Active!"}</p>
                  <p className="text-[10px] text-muted-foreground font-medium">{lang === "bn" ? "আপনি লুকানো কমান্ড প্যালেট খুঁজে পেয়েছেন। (১/৩ সিক্রেট)" : "You found the hidden command palette. (1/3 Secrets)"}</p>
                </div>
              </div>
            <div className="flex items-center border-b border-border/50 px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
              <Command.Input
                placeholder={t.placeholder}
                className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                autoFocus
              />
            </div>
            
            <Command.List className="max-h-[300px] overflow-y-auto p-2">
              <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                No results found.
              </Command.Empty>

              <Command.Group heading={t.actions} className="px-2 text-xs font-semibold text-muted-foreground py-2">
                <Command.Item
                  onSelect={() => runCommand(() => window.open(APPLICATION_LINK, "_blank"))}
                  className="flex cursor-pointer items-center rounded-md px-2 py-2 text-sm aria-selected:bg-primary/20 aria-selected:text-primary transition-colors"
                >
                  <Star className="mr-2 h-4 w-4" />
                  {t.apply}
                </Command.Item>
              </Command.Group>

              <Command.Group heading={t.pages} className="px-2 text-xs font-semibold text-muted-foreground py-2">
                <Command.Item
                  onSelect={() => runCommand(() => document.getElementById("masterplan")?.scrollIntoView({ behavior: "smooth" }))}
                  className="flex cursor-pointer items-center rounded-md px-2 py-2 text-sm aria-selected:bg-muted transition-colors"
                >
                  <Book className="mr-2 h-4 w-4" />
                  {t.masterplan}
                </Command.Item>
                <Command.Item
                  onSelect={() => runCommand(() => document.getElementById("departments")?.scrollIntoView({ behavior: "smooth" }))}
                  className="flex cursor-pointer items-center rounded-md px-2 py-2 text-sm aria-selected:bg-muted transition-colors"
                >
                  <Users className="mr-2 h-4 w-4" />
                  {t.departments}
                </Command.Item>
              </Command.Group>

              <Command.Group heading={t.theme} className="px-2 text-xs font-semibold text-muted-foreground py-2">
                <Command.Item
                  onSelect={() => runCommand(() => setTheme(theme === "dark" ? "light" : "dark"))}
                  className="flex cursor-pointer items-center rounded-md px-2 py-2 text-sm aria-selected:bg-muted transition-colors"
                >
                  {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                  {theme === "dark" ? t.light : t.dark}
                </Command.Item>
              </Command.Group>
            </Command.List>
          </Command>
        </div>
      </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
