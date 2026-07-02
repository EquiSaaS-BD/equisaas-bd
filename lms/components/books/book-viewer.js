"use client";

import React, { useState, useEffect } from "react";
import { FlipbookReader } from "./flipbook-reader";
import { useLocale } from "@/components/providers/locale-provider";
import { Button } from "@/components/ui/button";
import { X, Share2, Info, Maximize2, Minimize2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function BookViewer({ pdfUrl, title, author, category, departmentId, coverImage }) {
  const { copy } = useLocale();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleClose = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    router.back();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: title,
        text: `Read this strategic guide: ${title}`,
        url: window.location.href,
      });
    } catch (err) {
      // Sharing not supported or cancelled by user

    }
  };

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col overflow-hidden text-zinc-100">
      {/* Immersive Dark Header */}
      {!isFullscreen && (
        <header className="h-16 flex items-center justify-between px-6 bg-zinc-950/40 backdrop-blur-3xl border-b border-white/5 relative z-10 transition-all">
          <div className="flex items-center space-x-4">
            <div className="flex flex-col">
              <h1 className="text-sm font-black tracking-widest text-white/90 uppercase">{title}</h1>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-primary/80 font-black">{category}</span>
                <span className="text-[10px] text-white/10">&bull;</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">{author}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="rounded-full text-white/60 hover:text-white hover:bg-white/5">
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowInfo(!showInfo)} className="rounded-full text-white/60 hover:text-white hover:bg-white/5">
              <Info className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleShare} className="rounded-full text-white/60 hover:text-white hover:bg-white/5">
              <Share2 className="h-4 w-4" />
            </Button>
            <div className="w-[1px] h-6 bg-white/10 mx-2" />
            <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-full text-white/60 hover:text-white hover:bg-white/5 font-black">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </header>
      )}

      {/* Main Reading Stage */}
      <main className="flex-1 relative bg-black">
        <div className="absolute inset-0 overflow-hidden">
          <FlipbookReader 
            pdfUrl={pdfUrl} 
            title={title} 
            author={author} 
            coverImage={coverImage}
          />
        </div>

        {/* Dynamic Fullscreen button for when header is hidden */}
        {isFullscreen && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleFullscreen} 
            className="absolute top-4 right-4 z-[200] rounded-full bg-black/40 text-white/60 backdrop-blur-md hover:text-white"
          >
            <Minimize2 className="h-5 w-5" />
          </Button>
        )}
      </main>

      {/* Info Overlay */}
      <AnimatePresence>
        {showInfo && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-20 right-6 w-80 z-[200] p-8 bg-zinc-900/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-primary">{copy("Bibliographic Data", "গ্রন্থপঞ্জী তথ্য")}</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowInfo(false)} className="h-6 w-6 rounded-full text-white/40">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <p className="text-xs text-white/70 leading-relaxed font-medium">
                  {copy(
                    "This strategic manual is part of the core curriculum for the Business Analyst Department. Distributing this material outside EquiSaaS members is restricted.",
                    "এই স্ট্র্যাটেজিক ম্যানুয়ালটি বিজনেস অ্যানালিস্ট বিভাগের কোর কারিকুলামের অংশ। ইকুইসাস মেম্বারদের বাইরে এটি বিতরণ করা নিষিদ্ধ।"
                  )}
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[8px] uppercase tracking-widest text-white/30 mb-1">Status</p>
                    <p className="text-[10px] font-black text-primary">Confidential</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[8px] uppercase tracking-widest text-white/30 mb-1">Access</p>
                    <p className="text-[10px] font-black text-primary">Verified</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Atmospheric Background FX */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_center,rgba(24,24,27,1)_0%,rgba(9,9,11,1)_100%)]" />
    </div>
  );
}
