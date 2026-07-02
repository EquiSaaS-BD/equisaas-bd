"use client";

import { useState } from "react";
import { Bot, MessageSquare, Send, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocale } from "@/components/providers/locale-provider";
import { cn } from "@/lib/utils";

export function AiLessonAssistant({ lessonContext }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const { copy } = useLocale();

  const handleSend = async () => {
    if (!query.trim() || loading) return;

    const userMsg = { role: "user", text: query };
    setEvents(curr => [...curr, userMsg]);
    setQuery("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          context: lessonContext
        })
      });
      const data = await res.json();
      setEvents(curr => [...curr, { role: "ai", text: data.reply }]);
    } catch (err) {
      setEvents(curr => [...curr, { role: "ai", text: "Sorry, I am having trouble connecting right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-[350px] sm:w-[400px]"
          >
            <Card className="glass-elite border-primary/20 shadow-2xl rounded-[2rem] overflow-hidden">
              <CardHeader className="bg-primary/5 pb-4 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center text-white shadow-glow">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-black tracking-tight">{copy("Bilingual Tutor", "বাইলিঙ্গুয়াল টিউটর")}</CardTitle>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-1">
                       <Sparkles className="h-2 w-2 text-primary" />
                       Powered by Gemini
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[350px] p-6">
                  <div className="space-y-4">
                    <div className="bg-muted/40 p-3 rounded-2xl text-xs leading-relaxed border border-border/50 italic">
                      {copy("I can help you understand this lesson. Ask me anything in Bangla or English!", "আমি আপনাকে এই লেসনটি বুঝতে সাহায্য করতে পারি। বাংলা বা ইংরেজিতে কিছু জিজ্ঞেস করুন!")}
                    </div>
                    {messages.map((m, i) => (
                      <div key={i} className={cn(
                        "flex flex-col gap-1 max-w-[85%]",
                        m.role === "user" ? "ml-auto items-end" : "items-start"
                      )}>
                        <div className={cn(
                          "p-3 rounded-2xl text-xs leading-relaxed font-medium",
                          m.role === "user" ? "bg-primary text-white" : "bg-muted border"
                        )}>
                          {m.text}
                        </div>
                      </div>
                    ))}
                    {loading && (
                       <div className="flex items-center gap-2 text-muted-foreground italic text-[10px]">
                         <Sparkles className="h-3 w-3 animate-spin" />
                         <span>{copy("Thinking...", "চিন্তা করছি...")}</span>
                       </div>
                    )}
                  </div>
                </ScrollArea>
                <div className="p-4 border-t bg-background/50 flex gap-2">
                  <Input 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder={copy("Ask a question...", "প্রশ্ন করুন...")}
                    className="h-10 rounded-xl border-border/50 text-xs"
                  />
                  <Button size="icon" className="h-10 w-10 rounded-xl shadow-glow" onClick={handleSend} disabled={loading}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button 
        size="lg" 
        className={cn(
          "rounded-full h-14 w-14 shadow-2xl transition-all duration-500",
          isOpen ? "bg-red-500 hover:bg-red-600 rotate-90" : "bg-primary hover:scale-110"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </Button>
    </div>
  );
}
