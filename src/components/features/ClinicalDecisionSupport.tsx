"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Loader2, AlertTriangle, Lightbulb, ChevronRight, Stethoscope } from "lucide-react";

type Analysis = {
  priorityPatient: {
    name: string;
    reasoning: string;
    suggestedAction: string;
  };
  generalInsights: Array<{
    title: string;
    detail: string;
    source: string;
  }>;
  riskScores: Record<string, number>;
};

export default function ClinicalDecisionSupport({ patients }: { patients: any[] }) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  const performAnalysis = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/clinical-reasoning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patients })
      });
      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error("Clinical analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass p-8 rounded-[2.5rem] border border-primary/10 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center text-white">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Clinical Reasoner</h2>
            <p className="text-[10px] text-foreground/40 font-black uppercase tracking-widest mt-0.5">Gemini 3 Scientific Analyzer</p>
          </div>
        </div>
        {!analysis && !loading && (
          <button 
            onClick={performAnalysis}
            className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:shadow-lg transition-all"
          >
            Run Queue Analysis
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-12 flex flex-col items-center justify-center gap-4 text-primary/40"
          >
            <Loader2 className="w-10 h-10 animate-spin" />
            <p className="text-sm font-bold uppercase tracking-widest">Reasoning over research protocols...</p>
          </motion.div>
        ) : analysis ? (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Priority Patient */}
            <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/20 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <AlertTriangle className="w-16 h-16 text-red-500" />
               </div>
               <div className="relative z-10">
                 <div className="flex items-center gap-2 text-red-500 mb-2">
                   <AlertTriangle className="w-4 h-4" />
                   <span className="text-[10px] font-black uppercase tracking-widest">High Priority Protocol</span>
                 </div>
                 <h3 className="text-lg font-bold">Critical Case: {analysis.priorityPatient.name}</h3>
                 <p className="text-sm text-foreground/70 mt-2 leading-relaxed italic border-l-2 border-red-500/30 pl-4 py-1">
                   "{analysis.priorityPatient.reasoning}"
                 </p>
                 <div className="mt-4 flex items-center justify-between bg-red-500 text-white px-4 py-3 rounded-2xl">
                   <div className="flex items-center gap-2">
                     <Stethoscope className="w-4 h-4" />
                     <span className="text-xs font-bold">Recommended action: {analysis.priorityPatient.suggestedAction}</span>
                   </div>
                   <ChevronRight className="w-4 h-4" />
                 </div>
               </div>
            </div>

            {/* General Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.generalInsights?.map((insight, i) => (
                <div key={i} className="p-4 rounded-2xl bg-secondary/30 border border-primary/5">
                  <div className="flex items-center gap-2 text-indigo-500 mb-2">
                    <Lightbulb className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Clinical Research</span>
                  </div>
                  <h4 className="font-bold text-sm">{insight.title}</h4>
                  <p className="text-xs text-foreground/50 mt-1 leading-relaxed">{insight.detail}</p>
                  <div className="mt-2 text-[9px] font-black text-indigo-500/60 uppercase">SOURCE: {insight.source}</div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setAnalysis(null)}
              className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-foreground/30 hover:text-foreground transition-colors"
            >
              Reset Analysis
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="empty"
            className="bg-primary/5 rounded-3xl p-8 border border-dashed border-primary/20 text-center"
          >
            <p className="text-sm text-foreground/40 italic">Select "Run Queue Analysis" to use Gemini 3's scientific reasoning to prioritize your patient queue and uncover clinical insights.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
