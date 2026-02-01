"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bell, Droplets, Pill, Plus, Volume2, X, Clock, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

type Reminder = {
  id: number;
  type: "medication" | "hydration";
  title: string;
  time: string;
  taken: boolean;
};

export default function SmartReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: 1, type: "medication", title: "Prenatal Vitamin", time: "08:00 AM", taken: true },
    { id: 2, type: "hydration", title: "Glass of Water", time: "10:30 AM", taken: false },
    { id: 3, type: "medication", title: "Folic Acid", time: "12:00 PM", taken: false },
    { id: 4, type: "hydration", title: "Glass of Water", time: "02:00 PM", taken: false },
  ]);

  const toggleTaken = (id: number) => {
    setReminders(prev => prev.map(r => 
      r.id === id ? { ...r, taken: !r.taken } : r
    ));
  };

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="glass p-8 rounded-[2.5rem] border border-primary/10 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center text-white">
            <Bell className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold">Smart Reminders</h2>
        </div>
        <button className="p-2 rounded-xl bg-secondary/50 hover:bg-primary/10 transition-colors">
          <Plus className="w-5 h-5 text-primary" />
        </button>
      </div>

      <div className="space-y-3">
        {reminders.map((reminder) => (
          <motion.div
            key={reminder.id}
            layout
            className={cn(
              "p-4 rounded-[1.5rem] border transition-all flex items-center gap-4 group",
              reminder.taken 
                ? "bg-emerald-500/5 border-emerald-500/20 opacity-60" 
                : "bg-white dark:bg-slate-900 border-primary/5 hover:border-primary/20"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
              reminder.type === "medication" ? "bg-blue-500/10 text-blue-500" : "bg-cyan-500/10 text-cyan-500"
            )}>
              {reminder.type === "medication" ? <Pill className="w-5 h-5" /> : <Droplets className="w-5 h-5" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm truncate">{reminder.title}</div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/30">
                <Clock className="w-3 h-3" />
                {reminder.time}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!reminder.taken && (
                <button 
                  onClick={() => speak(`Time to take your ${reminder.title}`)}
                  className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors opacity-0 group-hover:opacity-100"
                  title="Voice Alert"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              )}
              <button 
                onClick={() => toggleTaken(reminder.id)}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                  reminder.taken 
                    ? "bg-emerald-500 text-white" 
                    : "border-2 border-primary/20 hover:border-primary text-transparent"
                )}
              >
                <CheckCircle2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="pt-4 border-t border-primary/5">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-foreground/40">
          <span>Daily Progress</span>
          <span>{reminders.filter(r => r.taken).length}/{reminders.length} Done</span>
        </div>
        <div className="h-1.5 w-full bg-secondary rounded-full mt-2 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(reminders.filter(r => r.taken).length / reminders.length) * 100}%` }}
            className="h-full premium-gradient"
          />
        </div>
      </div>
    </div>
  );
}
