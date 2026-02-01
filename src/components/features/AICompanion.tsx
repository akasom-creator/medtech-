"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Bot, User, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

type Message = {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  thought?: string;
  timestamp: Date;
};

const initialMessages: Message[] = [
  {
    id: '1',
    sender: 'ai',
    text: "Hello! I'm Aura, your critical health assistant. How can I help you today?",
    timestamp: new Date()
  }
];

export default function AICompanion() {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showReasoning, setShowReasoning] = useState(true);
  const [language, setLanguage] = useState("English");
  const [isLangOpen, setIsLangOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // Don't show if not logged in (optional decision, but safer for context)
  if (!isAuthenticated) return null;

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // AI Response Logic
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          history: messages.map(m => ({ sender: m.sender, text: m.text })),
          language: language
        }),
      });

      const data = await response.json();
      
      // Parse reasoning if present
      let finalResponse = data.response || "I couldn't generate a response. Please try again.";
      let thoughtProcess = "";
      
      const thoughtMatch = typeof finalResponse === 'string' ? finalResponse.match(/<thought>([\s\S]*?)<\/thought>/) : null;
      if (thoughtMatch) {
        thoughtProcess = thoughtMatch[1].trim();
        finalResponse = finalResponse.replace(/<thought>[\s\S]*?<\/thought>/, "").trim();
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: finalResponse,
        thought: thoughtProcess,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "I'm having connection issues. Please check your internet or try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-[90vw] md:w-96 h-[500px] glass rounded-[2rem] border border-primary/20 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-primary/5 border-b border-primary/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center text-white shadow-lg">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Aura AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] uppercase font-bold text-foreground/50 tracking-wider">Online</span>
                    <div className="relative ml-2">
                       <button 
                        onClick={() => setIsLangOpen(!isLangOpen)}
                        className="text-[10px] bg-secondary/80 px-2 py-0.5 rounded-md font-black hover:bg-secondary transition-colors uppercase tracking-widest flex items-center gap-1"
                       >
                         {language} <ChevronDown className={cn("w-3 h-3 transition-transform", isLangOpen && "rotate-180")} />
                       </button>
                       <AnimatePresence>
                         {isLangOpen && (
                           <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 5 }}
                            className="absolute top-full left-0 mt-2 bg-white dark:bg-slate-900 border border-primary/10 rounded-lg shadow-xl z-[60] py-1 w-24 overflow-hidden"
                           >
                             {["English", "Yoruba", "Hausa", "Igbo"].map((lang) => (
                               <button
                                key={lang}
                                onClick={() => { setLanguage(lang); setIsLangOpen(false); }}
                                className={cn(
                                  "w-full text-left px-3 py-1.5 text-[10px] font-bold hover:bg-primary/5 transition-colors",
                                  language === lang && "text-primary"
                                )}
                               >
                                 {lang}
                               </button>
                             ))}
                           </motion.div>
                         )}
                       </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowReasoning(!showReasoning)}
                className={cn(
                  "p-2 rounded-full transition-all flex items-center gap-1.5",
                  showReasoning ? "bg-primary/20 text-primary" : "text-foreground/40 hover:bg-secondary"
                )}
                title="Toggle Reasoning Mode"
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Reasoning</span>
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/30"
            >
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={cn(
                    "flex gap-3 max-w-[85%]",
                    msg.sender === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white shadow-sm mt-1",
                    msg.sender === 'user' ? "bg-primary" : "bg-gradient-to-br from-indigo-500 to-purple-600"
                  )}>
                    {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    {msg.sender === 'ai' && msg.thought && showReasoning && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 text-[11px] text-indigo-400 font-mono italic"
                      >
                        <div className="flex items-center gap-2 mb-1 opacity-60">
                          <Sparkles className="w-3 h-3" />
                          <span className="uppercase tracking-widest font-black">Internal Reasoning</span>
                        </div>
                        {msg.thought}
                      </motion.div>
                    )}
                    <div className={cn(
                      "p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                      msg.sender === 'user' 
                        ? "bg-primary text-white rounded-tr-none" 
                        : "bg-slate-900 dark:bg-black/60 text-white rounded-tl-none border border-primary/20 shadow-md"
                    )}>
                      {msg.text}
                      <div className={cn(
                        "text-[10px] mt-1 font-medium opacity-50",
                        "text-white"
                      )}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 mr-auto">
                   <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm">
                     <Bot className="w-4 h-4" />
                   </div>
                   <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-primary/5 flex items-center gap-1">
                     <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                     <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                     <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                   </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-primary/10">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-secondary/50 dark:bg-black/40 border-none focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 text-sm transition-all text-foreground dark:text-white placeholder:text-foreground/40 dark:placeholder:text-white/40"
                />
                <button 
                  type="submit"
                  disabled={!input.trim()}
                  className="p-3 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        layout
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
            "w-14 h-14 rounded-full premium-gradient shadow-xl shadow-primary/30 flex items-center justify-center text-white transition-all z-50 hover:ring-4 hover:ring-primary/20",
            isOpen ? "rotate-90 hidden" : "rotate-0"
        )}
      >
        <Sparkles className="w-7 h-7" />
      </motion.button>
    </div>
  );
}
