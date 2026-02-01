"use client";

import { useState, useEffect } from "react";
import { Bell, ShieldCheck, X, Settings } from "lucide-react";
import { useNotifications } from "@/components/layout/NotificationProvider";
import { motion, AnimatePresence } from "framer-motion";

export default function PushPermissionManager() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [showBanner, setShowBanner] = useState(false);
  const { notify } = useNotifications();

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
      if (Notification.permission === "default") {
        setTimeout(() => setShowBanner(true), 3000);
      }
    }
  }, []);

  const requestPermission = async () => {
    if (!("Notification" in window)) return;
    
    const result = await Notification.requestPermission();
    setPermission(result);
    setShowBanner(false);

    if (result === "granted") {
      notify("success", "Notifications Enabled", "You'll now receive updates for appointments and emergencies.");
    } else {
      notify("warning", "Notifications Blocked", "Please enable notifications in your browser settings for critical alerts.");
    }
  };

  if (!showBanner || permission === "granted") return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-lg"
      >
        <div className="premium-gradient p-6 rounded-[2.5rem] text-white shadow-2xl flex items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Bell className="w-24 h-24" />
          </div>
          
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          
          <div className="flex-1 space-y-1 relative z-10">
            <h3 className="font-black uppercase italic tracking-wider">Stay Protected</h3>
            <p className="text-xs font-medium opacity-80 leading-relaxed">
              Enable push notifications to receive critical health alerts and appointment reminders directly on your device.
            </p>
          </div>

          <div className="flex flex-col gap-2 relative z-10">
            <button 
              onClick={requestPermission}
              className="px-6 py-2 rounded-xl bg-white text-primary text-xs font-black uppercase hover:scale-105 transition-transform"
            >
              ENABLE
            </button>
            <button 
              onClick={() => setShowBanner(false)}
              className="px-6 py-2 rounded-xl bg-white/10 text-white text-[10px] font-bold uppercase hover:bg-white/20 transition-colors"
            >
              LATER
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
