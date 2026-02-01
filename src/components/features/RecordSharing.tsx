"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Share2, 
  Key, 
  Lock, 
  Clock, 
  Eye,
  CheckCircle2,
  Copy
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function RecordSharing() {
  const [sharing, setSharing] = useState(false);
  const [shared, setShared] = useState(false);

  const startSharing = () => {
    setSharing(true);
    setTimeout(() => {
      setSharing(false);
      setShared(true);
    }, 2000);
  };

  return (
    <div className="glass p-8 rounded-[3rem] border border-primary/10 overflow-hidden relative">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Secure Record Share
        </h2>
        <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
          Encrypted
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!shared ? (
          <motion.div 
            key="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <p className="text-sm text-foreground/50 leading-relaxed">
              Generate a secure, single-use access key to share your medical history with a specialist. You control exactly how long the access lasts.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-secondary/50 border border-transparent hover:border-primary/20 transition-all cursor-pointer group">
                <Clock className="w-5 h-5 text-primary mb-2" />
                <div className="font-bold text-xs uppercase tracking-widest mb-1">Duration</div>
                <div className="text-lg font-black italic">24 Hours</div>
              </div>
              <div className="p-4 rounded-2xl bg-secondary/50 border border-transparent hover:border-primary/20 transition-all cursor-pointer group">
                <Eye className="w-5 h-5 text-primary mb-2" />
                <div className="font-bold text-xs uppercase tracking-widest mb-1">Access</div>
                <div className="text-lg font-black italic">View Only</div>
              </div>
            </div>

            <button 
              onClick={startSharing}
              disabled={sharing}
              className="w-full py-4 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              {sharing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Encrypting...
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  Generate Secure Key
                </>
              )}
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="shared"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 text-center py-4"
          >
            <div className="w-16 h-16 rounded-2xl premium-gradient flex items-center justify-center mx-auto text-white shadow-lg shadow-primary/30">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Access Key Generated</h3>
              <p className="text-xs text-foreground/40 font-medium">Valid until Jan 7, 2026 • 10:30 AM</p>
            </div>
            
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-dashed border-primary/20 flex items-center justify-between gap-4">
              <code className="text-primary font-black tracking-[0.3em] pl-2 uppercase">XT9-PQ2-K1L</code>
              <button className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all">
                <Copy className="w-4 h-4" />
              </button>
            </div>

            <button 
              onClick={() => setShared(false)}
              className="text-[10px] font-black uppercase tracking-widest text-foreground/30 hover:text-primary transition-colors"
            >
              Revoke Access Early
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Security Badge */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-12 h-12 rounded-full glass border border-primary/20 flex items-center justify-center animate-pulse">
          <Key className="w-6 h-6 text-primary" />
        </div>
      </div>
    </div>
  );
}
