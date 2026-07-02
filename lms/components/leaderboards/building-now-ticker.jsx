"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Flame, Zap } from "lucide-react";
import { db } from "@/lib/firebase/client";
import { useLocale } from "@/components/providers/locale-provider";
import { cn } from "@/lib/utils";

export function BuildingNowTicker() {
  const [events, setEvents] = useState([]);
  const { copy } = useLocale();

  useEffect(() => {
    const q = query(
      collection(db, "feeds"),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const nextEvents = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(nextEvents);
    });

    return () => unsubscribe();
  }, []);

  if (events.length === 0) return null;

  return (
    <div className="glass-premium rounded-full px-4 py-2 border-primary/20 flex items-center gap-3 overflow-hidden max-w-xl shadow-glow">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
        <Activity className="h-3.5 w-3.5 animate-pulse" />
      </div>
      
      <div className="flex-1 relative h-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={events[0]?.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">
              {copy("BUILDING NOW:", "এখন তৈরি হচ্ছে:")}
            </span>
            <span className="text-xs font-bold truncate">
              {events[0]?.userDisplayName}
            </span>
            <span className="text-xs text-muted-foreground italic">
              {events[0]?.message}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex -space-x-2">
        {events.slice(0, 3).map((ev, i) => (
          <div 
            key={ev.id} 
            className="h-5 w-5 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[8px] font-black overflow-hidden"
            style={{ zIndex: 3 - i }}
          >
            {ev.userDisplayName?.charAt(0)}
          </div>
        ))}
      </div>
    </div>
  );
}
