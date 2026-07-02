import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Clock, User, Zap, Terminal, Activity, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const AuditMonitor = ({ entries, lang, formatDateTime, onClear }) => {
  return (
    <Card className="border-none shadow-premium bg-background/50 backdrop-blur-sm overflow-hidden min-h-[500px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between border-b border-muted-foreground/5 bg-primary/5 p-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Terminal className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-black uppercase tracking-tight">System Live Monitor</CardTitle>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-70">
              Audit Trails & Operational Logs
            </p>
          </div>
        </div>
{onClear ? (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClear}
            className="h-9 px-4 rounded-xl border-rose-500/10 text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/20 font-black uppercase text-[10px] tracking-widest"
          >
            <Trash2 className="w-3.5 h-3.5 mr-2" />
            Clear Logs
          </Button>
        ) : null}
      </CardHeader>
      
      <CardContent className="p-0 flex-1 overflow-y-auto">
        <div className="divide-y divide-muted-foreground/5">
          <AnimatePresence initial={false}>
            {entries.map((entry, idx) => (
              <motion.div
                key={entry.id || idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-4 hover:bg-primary/5 transition-all group relative border-l-4 border-l-transparent hover:border-l-primary"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="mt-1">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shadow-inner">
                        <Activity className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary border-none">
                          {entry.action}
                        </Badge>
                        <span className="text-xs font-black text-foreground/80">{entry.actorName}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                        {JSON.stringify(entry.meta)}
                      </div>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider">
                         <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {formatDateTime(entry.createdAt)}</span>
                         <span className="flex items-center gap-1.5"><User className="w-3 h-3" /> UID: {entry.actorUid?.slice(0, 8)}...</span>
                      </div>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Zap className="w-4 h-4 text-primary animate-pulse" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {!entries.length && (
            <div className="flex flex-col items-center justify-center py-20 opacity-30 text-center px-10">
              <Terminal className="w-12 h-12 mb-4" />
              <p className="text-sm font-black uppercase tracking-widest leading-relaxed">
                Log Pipeline Idle.<br />Waiting for administrative activities.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditMonitor;
