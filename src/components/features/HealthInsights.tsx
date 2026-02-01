"use client";

import { motion } from "framer-motion";
import { Sparkles, TrendingUp, ShieldCheck, Zap } from "lucide-react";

export default function HealthInsights() {
  const insights = [
    {
      title: "Recovery Trend",
      description: "Based on your last 3 vitals, your recovery is 15% faster than average.",
      icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
      color: "bg-emerald-500/10"
    },
    {
      title: "Gemini Reasoning",
      description: "Analysis suggest optimizing iron intake could improve morning energy levels.",
      icon: <Sparkles className="w-5 h-5 text-indigo-500" />,
      color: "bg-indigo-500/10"
    },
    {
      title: "Predictive Alert",
      description: "Next checkup recommended in 5 days for optimal monitoring.",
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      color: "bg-amber-500/10"
    }
  ];

  return (
    <div className="glass p-6 rounded-[2rem] border border-primary/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl premium-gradient flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold tracking-tight">Health Intel</h2>
        </div>
        <div className="px-2 py-0.5 bg-primary/5 rounded-full flex items-center gap-1.5 border border-primary/10">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[8px] font-black uppercase tracking-widest text-primary">Gemini 3</span>
        </div>
      </div>

      <div className="space-y-3">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30 border border-primary/5 hover:border-primary/20 transition-all"
          >
            <div className={`p-2 rounded-lg ${insight.color} shrink-0`}>
              {insight.icon}
            </div>
            <div>
              <h4 className="font-bold text-[11px] mb-0.5">{insight.title}</h4>
              <p className="text-[10px] text-foreground/60 leading-tight">{insight.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform">
           <Sparkles className="w-8 h-8 text-indigo-500" />
        </div>
        <p className="text-[9px] font-black uppercase tracking-widest text-indigo-500 mb-1.5 flex items-center gap-2">
          <Sparkles className="w-2.5 h-2.5" /> Aura Summary
        </p>
        <p className="text-[10px] italic text-indigo-500/80 leading-snug relative z-10">
          "Positive trend! I recommend slightly higher electrolyte intake based on local water quality data. Gemini 3 has verified this protocol."
        </p>
      </div>
    </div>
  );
}
