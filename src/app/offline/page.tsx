"use client";

import { WifiOff, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-12 rounded-[3.5rem] border border-primary/20 max-w-lg w-full space-y-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-12 opacity-5">
          <WifiOff className="w-48 h-48 text-primary" />
        </div>

        <div className="w-20 h-20 rounded-[2rem] premium-gradient flex items-center justify-center text-white mx-auto shadow-2xl shadow-primary/30">
          <WifiOff className="w-10 h-10" />
        </div>

        <div className="space-y-3 relative z-10">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">You're Offline</h1>
          <p className="text-foreground/50 text-sm font-medium leading-relaxed">
            MedTech is built to work offline, but some real-time features like AI Triage and Consultation require a connection. 
            Your cached medical records are still available.
          </p>
        </div>

        <div className="flex flex-col gap-3 relative z-10">
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-4 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/20"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Connection
          </button>
          <Link 
            href="/"
            className="w-full py-4 rounded-2xl glass border border-primary/10 text-foreground/60 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-primary/5 transition-all"
          >
            <Home className="w-4 h-4" />
            Back Home
          </Link>
        </div>

        <div className="pt-4 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20">
          MedTech Offline Engine v1.0
        </div>
      </motion.div>
    </div>
  );
}
