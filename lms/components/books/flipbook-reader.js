"use client";

import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import HTMLFlipBook from "react-pageflip";
import * as pdfjs from "pdfjs-dist";
import { Loader2, ChevronLeft, ChevronRight, Maximize2, Minimize2, Info, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = "/lms/pdf.worker.min.mjs";

// Memoized Page Component to prevent unnecessary blinks during re-renders
const Page = React.memo(React.forwardRef((props, ref) => {
  return (
    <div className="page" ref={ref} data-density="hard">
      <div className="page-content bg-white relative w-full h-full overflow-hidden shadow-inner flex items-center justify-center">
        {props.src ? (
          <img 
            src={props.src} 
            alt={`Page ${props.number}`} 
            className="w-full h-full object-contain md:object-cover select-none pointer-events-none" 
          />
        ) : (
          <div className="flex flex-col items-center space-y-3 opacity-20">
             <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
             <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500">Processing page {props.number}</span>
          </div>
        )}
        <div className="absolute bottom-4 right-4 text-[10px] text-muted-foreground/30 font-mono select-none z-10">
          {props.number}
        </div>
      </div>
    </div>
  );
}));

Page.displayName = "Page";

// Memoized Cover Component
const CoverPage = React.memo(React.forwardRef((props, ref) => {
  return (
    <div className="page page-cover" ref={ref} data-density="hard">
      <div className="page-content w-full h-full relative flex flex-col items-center justify-center p-12 text-white border-r-8 border-black shadow-[inset_-10px_0_20px_rgba(0,0,0,0.5)] overflow-hidden">
        {props.bgImage && (
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${props.bgImage})` }}
          />
        )}
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-zinc-950/90 via-zinc-900/80 to-black/95" />
        
        <div className="relative z-20 flex flex-col items-center text-center space-y-8 select-none">
          {props.children}
        </div>
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/10 z-30" />
      </div>
    </div>
  );
}));

CoverPage.displayName = "CoverPage";

export function FlipbookReader({ pdfUrl, title, author, onPageChange, coverImage }) {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [renderedCount, setRenderedCount] = useState(0);
  const bookRef = useRef(null);
  const pdfRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [usePortrait, setUsePortrait] = useState(false);
  const isRenderingRef = useRef(false);

  // Responsive logic
  useEffect(() => {
    const handleResize = () => setUsePortrait(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // PDF Initialization
  useEffect(() => {
    const initPdf = async () => {
      try {
        setLoading(true);
        const loadingTask = pdfjs.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        pdfRef.current = pdf;
        setTotalPages(pdf.numPages);
        
        const firstPage = await pdf.getPage(1);
        const viewport = firstPage.getViewport({ scale: 1.5 });
        setDimensions({ width: viewport.width, height: viewport.height });

        setPages(new Array(pdf.numPages).fill(null).map((_, i) => ({ id: i, src: null })));
        
        // Priority: first 5
        await renderPagesInWindow(0, 5);
        setLoading(false);
      } catch (err) {
        console.error("PDF Init Error:", err);
        setError("Reader initialization failed.");
        setLoading(false);
      }
    };
    initPdf();
  }, [pdfUrl]);

  const renderPagesInWindow = async (start, end) => {
    if (!pdfRef.current) return;
    const currentPdf = pdfRef.current;
    const actualStart = Math.max(0, start);
    const actualEnd = Math.min(currentPdf.numPages - 1, end);

    for (let i = actualStart; i <= actualEnd; i++) {
        if (pages[i]?.src) continue; 

        try {
            const page = await currentPdf.getPage(i + 1);
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            const viewport = page.getViewport({ scale: 1.5 });
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({ canvasContext: context, viewport }).promise;
            const dataUrl = canvas.toDataURL("image/webp", 0.75); // Slightly lower quality for better RAM perf
            
            setPages(prev => {
                const updated = [...prev];
                if (updated[i]) updated[i] = { ...updated[i], src: dataUrl };
                return updated;
            });
            setRenderedCount(prev => prev + 1);
        } catch (e) {
            console.warn(`Render failed for page ${i + 1}`, e);
        }
    }
  };

  // Background Rendering Loop
  useEffect(() => {
    if (loading || !pdfRef.current || isRenderingRef.current) return;

    const runBackgroundRender = async () => {
        isRenderingRef.current = true;
        const windowStart = Math.max(0, currentPage - 2);
        const windowEnd = Math.min(totalPages - 1, currentPage + 5);
        await renderPagesInWindow(windowStart, windowEnd);

        const nextTarget = pages.findIndex(p => p.src === null);
        if (nextTarget !== -1) {
            await renderPagesInWindow(nextTarget, nextTarget + 5); // Larger chunks for efficiency
        }
        isRenderingRef.current = false;
    };

    const timer = setTimeout(runBackgroundRender, 1000); // Throttled to 1s to reduce re-render frequency
    return () => clearTimeout(timer);
  }, [loading, currentPage, renderedCount, totalPages]);

  const onFlip = useCallback((e) => {
    setCurrentPage(e.data);
    if (onPageChange) onPageChange(e.data);
  }, [onPageChange]);

  const flipPrev = () => bookRef.current?.pageFlip()?.flipPrev();
  const flipNext = () => bookRef.current?.pageFlip()?.flipNext();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") flipPrev();
      if (e.key === "ArrowRight") flipNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Memoized Book Content to stabilize the Flipbook component
  const memoizedPages = useMemo(() => {
    return pages.map((page, index) => (
      index === 0 ? (
        <CoverPage key={index} number={index + 1} bgImage={coverImage}>
          <div className="flex flex-col items-center text-center space-y-8 select-none">
            <div className="w-16 h-1 bg-white/20 rounded-full mb-4" />
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter leading-[0.9] uppercase bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
              {title}
            </h1>
            <div className="h-px w-16 bg-primary" />
            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-white/50">
              {author}
            </p>
            <div className="pt-12">
               <Button variant="outline" className="h-14 px-10 rounded-full bg-white/5 border-white/10 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all font-black text-xs tracking-widest uppercase" onClick={flipNext}>
                  Begin Reading
               </Button>
            </div>
          </div>
        </CoverPage>
      ) : (
        <Page key={index} number={index + 1} src={page?.src} />
      )
    ));
  }, [pages, title, author, coverImage]);

  if (loading && totalPages === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <div className="text-center">
            <p className="text-white font-black tracking-widest uppercase text-sm">Synchronizing Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4 text-white">
        <p className="text-secondary font-black tracking-widest">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline" className="rounded-full">Retry</Button>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center w-full h-full max-w-[100vw] overflow-hidden select-none bg-zinc-950">
      <div className="flex-1 w-full flex items-center justify-center p-4 md:p-12">
        <div className="relative w-full h-full max-w-6xl max-h-[82vh] flex items-center justify-center group">
          <HTMLFlipBook
            width={dimensions.width || 450}
            height={dimensions.height || 600}
            size="stretch"
            minWidth={315}
            maxWidth={1000}
            minHeight={420}
            maxHeight={1400}
            drawShadow={true}
            flippingTime={800}
            usePortrait={usePortrait}
            startPage={0}
            showCover={true}
            mobileScrollSupport={true}
            className="book-canvas shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] pb-1"
            onFlip={onFlip}
            ref={bookRef}
          >
            {memoizedPages}
          </HTMLFlipBook>

          {/* Side navigation */}
          <div className="hidden lg:block absolute inset-y-0 left-[-80px] w-20 flex items-center justify-center">
             <Button variant="ghost" size="icon" onClick={flipPrev} disabled={currentPage === 0} className="h-14 w-14 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 border border-white/5 transition-all">
                <ChevronLeft className="h-6 w-6" />
             </Button>
          </div>
          <div className="hidden lg:block absolute inset-y-0 right-[-80px] w-20 flex items-center justify-center">
             <Button variant="ghost" size="icon" onClick={flipNext} disabled={currentPage === totalPages - 1} className="h-14 w-14 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 border border-white/5 transition-all">
                <ChevronRight className="h-6 w-6" />
             </Button>
          </div>
        </div>
      </div>

      {/* Progress UI */}
      <div className="h-24 w-full flex flex-col items-center justify-center space-y-3 bg-zinc-950/95 backdrop-blur-3xl border-t border-white/5 py-4 z-50">
        <div className="flex items-center space-x-12">
          <Button variant="ghost" size="icon" onClick={flipPrev} disabled={currentPage === 0} className="text-white/40 hover:text-white transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-1 mb-1">
                <span className="text-secondary font-black text-xs tracking-widest">{currentPage + 1}</span>
                <span className="text-white/20 text-[10px]">/</span>
                <span className="text-white/40 text-[10px] font-bold">{totalPages}</span>
            </div>
            {renderedCount < totalPages && (
                <div className="flex items-center space-x-2">
                    <Sparkles className="h-2 w-2 text-primary animate-pulse" />
                    <span className="text-[7px] font-black uppercase tracking-[0.2em] text-white/20">Rendering... {Math.round((renderedCount/totalPages)*100)}%</span>
                </div>
            )}
          </div>

          <Button variant="ghost" size="icon" onClick={flipNext} disabled={currentPage === totalPages - 1} className="text-white/40 hover:text-white transition-colors">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <style jsx global>{`
        .book-canvas {
          background-color: transparent !important;
        }
        .page {
          background-color: #ffffff;
        }
      `}</style>
    </div>
  );
}
