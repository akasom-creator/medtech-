"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Info, AlertTriangle, CheckCircle2, MessageSquare } from "lucide-react";
import { useState, useEffect, createContext, useContext } from "react";

type NotificationType = "info" | "success" | "warning" | "emergency";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  smsSent?: boolean;
}

interface NotificationContextType {
  notify: (type: NotificationType, title: string, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifications must be used within a NotificationProvider");
  return context;
};

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = (type: NotificationType, title: string, message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    // Simulate SMS fallback for emergency or high priority warnings
    const smsSent = type === "emergency" || type === "warning";
    setNotifications((prev) => [...prev, { id, type, title, message, smsSent }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 6000);
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4 pointer-events-none">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              className="pointer-events-auto"
            >
              <div className={`
                w-80 glass p-5 rounded-[2rem] border shadow-2xl flex items-start gap-4
                ${n.type === 'emergency' ? 'border-destructive/40 bg-destructive/5' : 'border-primary/20'}
              `}>
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                  ${n.type === 'emergency' ? 'bg-destructive text-white animate-pulse' : 
                    n.type === 'success' ? 'bg-emerald-500 text-white' : 
                    n.type === 'warning' ? 'bg-amber-500 text-white' : 
                    'bg-primary text-white'}
                `}>
                  {n.type === 'emergency' ? <AlertTriangle className="w-5 h-5" /> : 
                   n.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : 
                   n.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> : 
                   <Bell className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm">{n.title}</div>
                  <div className="text-xs text-foreground/60 leading-relaxed mt-1">{n.message}</div>
                  {n.smsSent && (
                    <div className="flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded-full bg-emerald-500/10 w-fit">
                      <MessageSquare className="w-3 h-3 text-emerald-500" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">SMS Distributed</span>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => setNotifications(prev => prev.filter(item => item.id !== n.id))}
                  className="p-1 rounded-lg hover:bg-foreground/5 opacity-40 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}
