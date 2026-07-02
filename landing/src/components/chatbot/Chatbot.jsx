import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CHATBOT_KNOWLEDGE, DEFAULT_RESPONSES } from "@/data/chatbot-knowledge";
import { expandQuery } from "@/data/banglish-dictionary";
import { GuidedTourManager, startGuidedTour } from "@/components/ui/guided-tour";

const TOUR_METADATA = {
  "ceo": { title: "CEO & Founder", path: "/leadership/", selector: "#leader-1" },
  "director_nayeem": { title: "Tech & Product Director", path: "/leadership/", selector: "#leader-2" },
  "director_barno": { title: "HR & Operations Director", path: "/leadership/", selector: "#leader-3" },
  "director_hurayra": { title: "Finance Director", path: "/leadership/", selector: "#leader-4" },
  "director_rifat": { title: "Community Director", path: "/leadership/", selector: "#leader-5" },
  "coo": { title: "COO", path: "/leadership/", selector: "#leader-6" },
  "cto": { title: "CTO", path: "/leadership/", selector: "#leader-7" },
  "cpo": { title: "CPO", path: "/leadership/", selector: "#leader-8" },
  "cfo": { title: "CFO", path: "/leadership/", selector: "#leader-9" },
  "cmo": { title: "CMO", path: "/leadership/", selector: "#leader-10" },
  "cgo": { title: "CGO", path: "/leadership/", selector: "#leader-11" },
  "cco": { title: "CCO", path: "/leadership/", selector: "#leader-12" },
  "head_polok": { title: "Head of Frontend", path: "/leadership/", selector: "#leader-13", desc: "Leads React & Next.js ecosystem" },
  "head_ohidur": { title: "Head of Backend", path: "/leadership/", selector: "#leader-14", desc: "Leads Node.js & Firebase ecosystem" },
  "head_parvez": { title: "Head of DevOps", path: "/leadership/", selector: "#leader-15" },
  "head_masuma": { title: "Head of UI/UX", path: "/leadership/", selector: "#leader-16" },
  "head_abid": { title: "Head of Graphics", path: "/leadership/", selector: "#leader-17" },
  "head_sadiqul": { title: "Head of Product", path: "/leadership/", selector: "#leader-18" },
  "head_mushfiqur": { title: "Head of BA", path: "/leadership/", selector: "#leader-19" },
  "head_sajid": { title: "Head of Marketing", path: "/leadership/", selector: "#leader-20" },
  "head_shihab": { title: "Head of CRM", path: "/leadership/", selector: "#leader-21" },
  "head_jawad": { title: "Head of PR", path: "/leadership/", selector: "#leader-22" },
  "department_heads": { title: "Department Heads", path: "/leadership/", selector: "#leader-13", desc: "10 heads leading 9 core departments" },
  "leadership_structure": { title: "Leadership Structure", path: "/leadership/", selector: "#leadership", desc: "The official roster of EquiSaaS BD" },
  "tech_stack": { title: "Frontend Department", path: "/departments/", selector: "#dept-frontend", desc: "We use React, Next.js, Firebase, Tailwind." },
};

const QUICK_ACTIONS = [
  { en: "What is EquiSaaS BD?", bn: "ইকুই স্যাস বিডি কি?" },
  { en: "How do I join?", bn: "কিভাবে জয়েন করব?" },
  { en: "What are the departments?", bn: "ডিপার্টমেন্টগুলো কি কি?" },
  { en: "Who is the founder?", bn: "ফাউন্ডার কে?" }
];

export default function Chatbot({ lang = "bn", theme = "light" }) {
  const [isOpen, setIsOpen] = useState(() => {
    // Ensure window check for SSR if needed, but this is a client component
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("equisaas_chat_is_open") === "true";
    }
    return false;
  });
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const scrollRef = useRef(null);

  const t = {
    title: lang === "bn" ? "ইকুই স্যাস এআই" : "EquiSaaS AI",
    placeholder: lang === "bn" ? "কিছু জিজ্ঞেস করুন..." : "Ask me anything...",
    welcome: lang === "bn" ? "হ্যালো! আমি ইকুই স্যাস এআই। আমি আপনাকে কিভাবে সাহায্য করতে পারি?" : "Hello! I am EquiSaaS AI. How can I help you today?"
  };
  const chatPanelId = "equisaas-chatbot-panel";
  const chatLabels = {
    close: lang === "bn" ? "চ্যাট বন্ধ করুন" : "Close chat",
    input: lang === "bn" ? "চ্যাট মেসেজ লিখুন" : "Type your chat message",
    send: lang === "bn" ? "মেসেজ পাঠান" : "Send message",
    toggle: isOpen
      ? lang === "bn" ? "চ্যাট বন্ধ করুন" : "Close chat"
      : lang === "bn" ? "চ্যাট খুলুন" : "Open chat",
  };

  // 1. Session Persistence
  useEffect(() => {
    const saved = sessionStorage.getItem(`equisaas_chat_${lang}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      } catch (e) {}
    }
    
    setMessages([{
      id: "welcome",
      role: "assistant",
      content: t.welcome,
      timestamp: new Date()
    }]);
    setHasUnread(true);
  }, [lang]);


  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem(`equisaas_chat_${lang}`, JSON.stringify(messages));
    }
  }, [messages, lang]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("equisaas_chat_is_open", isOpen.toString());
    }
    if (isOpen) {
      setHasUnread(false);
    }
  }, [isOpen]);

  const [lastUsedIndices, setLastUsedIndices] = useState({});

  // 2. Clickable Links Parser
  const renderMessageText = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline font-bold inline-flex items-center gap-0.5 break-all"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const getResponseFromIntent = (intent, uiLang) => {
    if (!intent || !intent.responses || intent.responses.length === 0) return null;
    
    const intentId = intent.id;
    const responses = intent.responses;
    const lastIndex = lastUsedIndices[intentId];
    
    let nextIndex;
    if (responses.length > 1) {
      do {
        nextIndex = Math.floor(Math.random() * responses.length);
      } while (nextIndex === lastIndex);
    } else {
      nextIndex = 0;
    }
    
    setLastUsedIndices(prev => ({ ...prev, [intentId]: nextIndex }));
    return responses[nextIndex];
  };

  const findResponse = (query) => {
    const uiLang = lang === "bn" ? "bn" : "en";
    
    // Expand query with Banglish dictionary (fallback to basic lowercase if undefined)
    const expandedQuery = typeof expandQuery === "function" ? expandQuery(query) : query.toLowerCase().trim();
    const normalizedQuery = expandedQuery;
    const rawQuery = query.toLowerCase().trim();

    let matchedIntents = new Set();

    // 1. Precise name patterns matching for all 22 active members
    const memberPatterns = [
      { id: "ceo", terms: ["kholipha", "al-amin", "খলিফা", "আল-আমিন", "আহম্মেদ", "ahmmad", "founder", "ফাউন্ডার", "ceo"] },
      { id: "director_nayeem", terms: ["jannatul nayeem", "জান্নাতুল নাঈম", "nayeem", "নাঈম"] },
      { id: "director_barno", terms: ["sandipta", "barno", "বর্ন", "সন্দীপ্ত", "কর্মকার", "karmakar"] },
      { id: "director_hurayra", terms: ["hurayra", "হুরায়রা", "আবু হুরায়রা", "abu hurayra"] },
      { id: "director_rifat", terms: ["rifat khan", "রিফাত khan", "রিফাত", "rifat", "মোঃ রিফাত"] },
      { id: "coo", terms: ["sin-amin", "সিন-আমিন", "sin amin", "সিন আমিন", "মো: সিন-আমিন", "md. sin-amin"] },
      { id: "cto", terms: ["rafin", "রাফিন", "ইফাত", "ifat", "ahmed rafin", "আহমেদ রাফিন"] },
      { id: "head_shihab", terms: ["shihab", "শিহাব", "মেহেদী হাসান শিহাব", "mehedi hasan shihab"] },
      { id: "cpo", terms: ["mehedi hasan", "মেহেদী হাসান", "mehedi", "মেহেদী", "হাসান", "hasan"] },
      { id: "cfo", terms: ["shuvo", "শুভ", "নাজমুল", "nazmul", "hossain shuvo", "হোসেন শুভ"] },
      { id: "cmo", terms: ["kajal", "কাজল", "সানজিদা", "sanzida", "rahman kajal", "রহমান কাজল"] },
      { id: "cgo", terms: ["bakar siddique", "সিদ্দিক", "siddique", "bakar", "বকর", "abu bakar siddique", "আবু বকর"] },
      { id: "cco", terms: ["fatema", "ফাতেমা", "আক্তার", "akter", "fatema akter", "ফাতেমা আক্তার"] },
      { id: "head_polok", terms: ["polok", "পলক", "m j polok", "এম জে পলক"] },
      { id: "head_ohidur", terms: ["ohidur", "ওহিদুর", "ohidur rahman", "ওহিদুর রহমান"] },
      { id: "head_parvez", terms: ["parvez", "পারভেজ", "parvez mahmud", "পারভেজ মাহমুদ"] },
      { id: "head_masuma", terms: ["masuma", "মাসুমা", "jannatul fardaus masuma", "জান্নাতুল ফেরদৌস মাসুমা"] },
      { id: "head_abid", terms: ["abid", "আবিদ", "tanbirul", "তানবিরুল"] },
      { id: "head_sadiqul", terms: ["sadiqul", "সাদিকুল", "sadiqul islam", "সাদিকুল ইসলাম"] },
      { id: "head_mushfiqur", terms: ["mushfiqur", "মুশফিকুর", "mushfiqur rahman", "মুশফিকুর রহমান"] },
      { id: "head_sajid", terms: ["sajid", "সাজিদ", "omar faruq sajid", "ওমর ফারুক সাজিদ"] },
      { id: "head_jawad", terms: ["jawad", "জাওয়াদ", "jawad hossain", "জাওয়াদ হোসেন"] }
    ];

    for (const pattern of memberPatterns) {
      for (const term of pattern.terms) {
        // Use rawQuery to avoid matching expanded synonyms incorrectly for names
        if (rawQuery.includes(term.toLowerCase())) {
          matchedIntents.add(pattern.id);
          break; // move to next pattern to avoid duplicates
        }
      }
    }

    // 2. Global Intent Matching (Scores across all languages)
    const allLangs = Object.keys(CHATBOT_KNOWLEDGE);
    let intentScores = {};

    for (const l of allLangs) {
      const kb = CHATBOT_KNOWLEDGE[l] || [];
      for (const item of kb) {
        let currentScore = 0;
        for (const kw of item.keywords) {
          const lowerKw = kw.toLowerCase();
          const wordRegex = new RegExp(`\\b${lowerKw.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}\\b`, 'i');
          
          if (wordRegex.test(normalizedQuery)) {
            currentScore += (lowerKw.length * 10);
          } else if (lowerKw.length > 3 && normalizedQuery.includes(lowerKw)) {
            currentScore += lowerKw.length;
          }
        }
        if (currentScore > 0) {
          intentScores[item.id] = (intentScores[item.id] || 0) + currentScore;
        }
      }
    }

    // Capture highly relevant intents (score > 8) up to a max of 3 to combine
    const sortedIntents = Object.entries(intentScores)
      .sort((a, b) => b[1] - a[1])
      .filter(([id, score]) => score > 8)
      .slice(0, 3)
      .map(([id]) => id);

    sortedIntents.forEach(id => matchedIntents.add(id));

    // 3. Response Generation & Combination
    if (matchedIntents.size > 0) {
      const knowledgeBase = CHATBOT_KNOWLEDGE[uiLang] || [];
      const responses = Array.from(matchedIntents).map(id => {
        const item = knowledgeBase.find(kbItem => kbItem.id === id);
        return item ? getResponseFromIntent(item, uiLang) : null;
      }).filter(Boolean);

      const uniqueResponses = [...new Set(responses)];
      
      // Calculate active tour steps
      const tourSteps = [];
      Array.from(matchedIntents).forEach(id => {
        if (TOUR_METADATA[id]) {
          tourSteps.push(TOUR_METADATA[id]);
        }
      });
      let text = "";
      if (uniqueResponses.length === 1) {
        text = uniqueResponses[0];
      } else if (uniqueResponses.length > 1) {
        // Combine them using the UI language conjunction!
        const conjunction = uiLang === "bn" ? "\n\nএবং, " : "\n\nAlso, ";
        text = uniqueResponses.join(conjunction);
      }
      return { text, tourSteps };
    }

    // 4. Default Fallback
    const defaults = DEFAULT_RESPONSES[uiLang] || [];
    const lastDefaultIndex = lastUsedIndices["default"];
    let nextDefaultIndex;
    if (defaults.length > 1) {
      do {
        nextDefaultIndex = Math.floor(Math.random() * defaults.length);
      } while (nextDefaultIndex === lastDefaultIndex);
    } else {
      nextDefaultIndex = 0;
    }
    setLastUsedIndices(prev => ({ ...prev, "default": nextDefaultIndex }));
    return { text: defaults[nextDefaultIndex], tourSteps: [] };
  };

  const handleSend = (text = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const responseData = findResponse(text);
    const response = responseData.text;
    const tourSteps = responseData.tourSteps;
    
    const wordCount = response?.split(' ').length || 1;
    const typingDelay = Math.min(800 + (wordCount * 40), 3000);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date()
      }]);
      setIsLoading(false);
      if (!isOpen) setHasUnread(true);
      
      if (tourSteps && tourSteps.length > 0) {
        setTimeout(() => {
          startGuidedTour(tourSteps);
        }, 3500);
      }
    }, typingDelay);
  };

  return (
    <>
    <div className={cn(
      "fixed z-[10000] flex flex-col items-end pointer-events-none transition-all duration-300",
      "bottom-[110px] sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8"
    )}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={chatPanelId}
            initial={{ opacity: 0, y: 30, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 30, scale: 0.9, filter: "blur(10px)" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="mb-4 w-[92vw] xs:w-[360px] sm:w-[380px] md:w-[420px] max-h-[70vh] sm:max-h-[600px] flex flex-col pointer-events-auto"
          >
            <Card className={cn(
              "shadow-[0_40px_80px_-16px_rgba(0,0,0,0.4)] glass-premium overflow-hidden flex flex-col rounded-[2rem] border-2",
              theme === "dark" ? "bg-zinc-950/90 border-primary/30" : "bg-white/90 border-primary/20"
            )}>
              <CardHeader className="p-4 bg-gradient-to-r from-primary via-blue-600 to-primary text-primary-foreground flex flex-row items-center justify-between space-y-0 relative overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />
                <CardTitle className="text-lg font-black flex items-center gap-3 relative z-10">
                  <div className="bg-white/20 backdrop-blur-md p-1.5 rounded-xl shadow-inner border border-white/30">
                    <Sparkles className="h-4 w-4 fill-white animate-pulse" />
                  </div>
                  <div className="flex flex-col">
                    <span className="leading-none tracking-tight">{t.title}</span>
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-70 mt-0.5 flex items-center gap-1">
                      <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
                      Online
                    </span>
                  </div>
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsOpen(false)}
                  aria-label={chatLabels.close}
                  className="text-primary-foreground hover:bg-white/20 rounded-xl h-8 w-8 relative z-10 transition-transform hover:rotate-90 shrink-0"
                >
                  <X className="h-5 w-5" />
                </Button>
              </CardHeader>
              
              <CardContent className={cn(
                "p-0 flex-1 overflow-hidden flex flex-col backdrop-blur-xl",
                theme === "dark" ? "bg-zinc-950/50" : "bg-zinc-50/50"
              )}>
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
                >
                  {messages.map((msg) => (
                    <motion.div 
                      initial={{ opacity: 0, x: msg.role === "user" ? 10 : -10, y: 5 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      key={msg.id} 
                      className={cn(
                        "flex gap-2.5 max-w-[90%]",
                        msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                      )}
                    >
                      <div className={cn(
                        "h-8 w-8 rounded-xl flex items-center justify-center shrink-0 shadow-md border-2",
                        msg.role === "assistant" 
                          ? "bg-gradient-to-br from-primary to-blue-700 text-white border-white/20" 
                          : theme === "dark" ? "bg-zinc-800 text-zinc-400 border-zinc-700" : "bg-white text-zinc-600 border-zinc-200"
                      )}>
                        {msg.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                      </div>
                      <div className={cn(
                        "p-3.5 rounded-[1.25rem] text-sm leading-relaxed whitespace-pre-wrap font-medium shadow-sm",
                        msg.role === "assistant" 
                          ? cn(
                              "rounded-tl-none",
                              theme === "dark" ? "bg-zinc-900 border border-primary/10 text-zinc-100" : "bg-white border border-primary/5 text-zinc-900"
                            )
                          : "bg-primary text-primary-foreground shadow-blue-500/20 rounded-tr-none"
                      )}>
                        {/* 3. Render Clickable Links */}
                        {renderMessageText(msg.content)}
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-2.5 max-w-[85%]">
                      <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center animate-pulse border-2 border-primary/20">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className={cn(
                        "p-3.5 rounded-[1.25rem] rounded-tl-none text-sm border flex items-center gap-2.5 shadow-sm",
                        theme === "dark" ? "bg-zinc-900 border-primary/10" : "bg-white border-primary/5"
                      )}>
                        {/* 4. Authentic Bouncing Dots Typing Indicator */}
                        <div className="flex space-x-1.5 items-center h-4 px-1">
                          <motion.div className="w-1.5 h-1.5 bg-primary/60 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                          <motion.div className="w-1.5 h-1.5 bg-primary/60 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                          <motion.div className="w-1.5 h-1.5 bg-primary/60 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {messages.length < 3 && (
                  <div className="px-4 pb-4 flex flex-wrap gap-1.5 shrink-0">
                    {QUICK_ACTIONS.map((action, i) => (
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i }}
                        key={i}
                        onClick={() => handleSend(action[lang])}
                        className={cn(
                          "text-[11px] border py-1.5 px-3 rounded-xl transition-all shadow-sm hover:shadow-md font-bold active:scale-95",
                          theme === "dark" 
                            ? "bg-zinc-800 border-primary/20 text-zinc-300 hover:text-primary hover:border-primary/50" 
                            : "bg-white border-primary/10 text-zinc-600 hover:text-primary hover:border-primary/30"
                        )}
                      >
                        {action[lang]}
                      </motion.button>
                    ))}
                  </div>
                )}
              </CardContent>

              <CardFooter className={cn(
                "p-4 border-t backdrop-blur-md shrink-0",
                theme === "dark" ? "bg-zinc-900/50 border-primary/10" : "bg-white/50 border-primary/5"
              )}>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex w-full items-center gap-2.5"
                >
                  <div className="relative flex-1">
                    <Input 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={t.placeholder}
                      aria-label={chatLabels.input}
                      className={cn(
                        "h-10 w-full rounded-xl transition-all pr-9 text-sm font-medium",
                        theme === "dark" 
                          ? "bg-zinc-800/50 border-zinc-700 text-zinc-100 focus-visible:ring-primary/30" 
                          : "bg-zinc-100/50 border-zinc-200 text-zinc-900 focus-visible:ring-primary/20"
                      )}
                      disabled={isLoading}
                    />
                    <Zap className={cn(
                      "absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 transition-colors",
                      input.trim() ? "text-amber-500 fill-amber-500" : "text-muted-foreground/30"
                    )} />
                  </div>
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={!input.trim() || isLoading}
                    aria-label={chatLabels.send}
                    className="h-10 w-10 rounded-xl shrink-0 shadow-lg shadow-primary/20 transition-transform active:scale-90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative group pointer-events-auto">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.2, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
          className="absolute inset-0 bg-primary rounded-2xl blur-xl"
        />
        <motion.button
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={chatLabels.toggle}
          aria-expanded={isOpen}
          aria-controls={chatPanelId}
          className={cn(
            "h-14 sm:h-16 w-14 sm:w-16 rounded-2xl flex items-center justify-center shadow-[0_12px_40px_rgba(var(--primary),0.5)] transition-all duration-500 border-2 relative overflow-hidden group",
            isOpen 
              ? theme === "dark" ? "bg-zinc-900 text-white rotate-90 border-zinc-700" : "bg-zinc-950 text-white rotate-90 border-zinc-800"
              : "bg-gradient-to-br from-primary via-blue-600 to-primary text-primary-foreground border-white/20"
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          {isOpen ? (
            <X className="h-7 sm:h-8 w-7 sm:w-8" />
          ) : (
            <div className="relative">
              <MessageSquare className="h-7 sm:h-8 w-7 sm:w-8 drop-shadow-xl" />
              {/* 5. Unread Notification Badge */}
              <AnimatePresence>
                {hasUnread && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-red-500 border-2 border-primary shadow-lg text-[9px] sm:text-[10px] font-bold text-white z-50"
                  >
                    1
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.button>
      </div>
    </div>
    <GuidedTourManager lang={lang} theme={theme} />
    </>
  );
}
