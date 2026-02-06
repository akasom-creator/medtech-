"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Loader2, Sparkles, Play, Info, AlertTriangle, HeartPulse, ShieldAlert, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function VoiceInteraction({ context = "patient" }: { context?: 'patient' | 'doctor' }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [escalating, setEscalating] = useState(false);
  const [escalated, setEscalated] = useState(false);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      chunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => chunks.current.push(e.data);
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' });
        setAudioBlob(blob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setResult(null);
      setEscalated(false);
    } catch (err) {
      console.error("Mic access denied:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const analyzeVoice = async () => {
    if (!audioBlob) return;
    setAnalyzing(true);

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(audioBlob);
      });
      const base64 = await base64Promise;

      const response = await fetch('/api/voice-reasoning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio: base64 })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Voice analysis failed:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  const triggerEscalation = async () => {
    if (!result) return;
    setEscalating(true);
    try {
        await fetch('/api/clinical-escalation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                patientName: "Presentation User",
                severity: result.safetyFlag || "high",
                reason: result.clinicalSummary,
                transcription: result.transcription
            })
        });
        setEscalated(true);
    } catch (error) {
        console.error("Escalation failed:", error);
    } finally {
        setEscalating(false);
    }
  };

  return (
    <div className="glass p-8 rounded-[2.5rem] border border-primary/10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center text-white">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{context === 'doctor' ? 'Clinical Dictation' : 'Voice Symptom Record'}</h2>
            <p className="text-[10px] text-foreground/40 font-black uppercase tracking-widest mt-0.5">Gemini 3 Multimodal Innovation</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <AnimatePresence>
            {isRecording && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 0.2 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute inset-0 bg-red-500 rounded-full"
              />
            )}
          </AnimatePresence>
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center border-4 shadow-xl transition-all relative z-10",
              isRecording 
                ? "bg-red-500 border-red-200 text-white animate-pulse" 
                : "bg-primary border-primary/20 text-white hover:scale-105"
            )}
          >
            {isRecording ? <Square className="w-8 h-8 fill-current" /> : <Mic className="w-8 h-8" />}
          </button>
        </div>

        <p className="text-sm font-bold opacity-60">
          {isRecording ? "Listening... Tap to stop" : audioBlob ? "Recording captured. Ready to analyze." : "Tap the mic to start recording"}
        </p>

        {audioBlob && !isRecording && !result && (
          <button
            onClick={analyzeVoice}
            disabled={analyzing}
            className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-500/20 disabled:opacity-50"
          >
            {analyzing ? (
              <><Loader2 className="w-6 h-6 animate-spin" /> GEMINI IS REASONING OVER AUDIO...</>
            ) : (
              <><Sparkles className="w-6 h-6" /> ANALYZE VOICE WITH GEMINI 3</>
            )}
          </button>
        )}
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-6"
          >
            {result.demoMode && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-6 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">Aura Resilience Active</p>
                  <p className="text-xs text-amber-500/80 leading-relaxed font-medium">To maintain presentation continuity during peak usage, Aura is providing a high-fidelity clinical simulation.</p>
                </div>
              </div>
            )}

            {result.error && !result.demoMode && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 mb-6 flex items-start gap-3">
                <Info className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">AI Engine Notice</p>
                  <p className="text-xs text-red-500/80 leading-relaxed font-medium">{result.error}</p>
                </div>
              </div>
            )}

            {/* SAFETY ESCALATION BLOCK */}
            {(result.safetyFlag === 'critical' || result.safetyFlag === 'moderate') && (
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={cn(
                        "p-6 rounded-[2rem] border-2 mb-6 shadow-2xl overflow-hidden relative",
                        result.safetyFlag === 'critical' 
                            ? "bg-red-500/10 border-red-500/30 shadow-red-500/10" 
                            : "bg-amber-500/10 border-amber-500/30 shadow-amber-500/10"
                    )}
                >
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                        <ShieldAlert className="w-24 h-24" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className={cn(
                                "p-2 rounded-lg",
                                result.safetyFlag === 'critical' ? "bg-red-500 text-white" : "bg-amber-500 text-white"
                            )}>
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-black uppercase tracking-tighter">
                                {result.safetyFlag === 'critical' ? 'High Urgency Alert' : 'Wellness Precaution'}
                            </h3>
                        </div>
                        <p className="text-sm font-medium mb-6 opacity-80 leading-relaxed">
                            Aura has detected signals that may require clinical attention. We recommend notifying our on-call specialist.
                        </p>
                        
                        <button 
                            disabled={escalating || escalated}
                            onClick={triggerEscalation}
                            className={cn(
                                "w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                                escalated 
                                    ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30"
                                    : result.safetyFlag === 'critical'
                                        ? "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/20"
                                        : "bg-amber-600 text-white hover:bg-amber-700 shadow-lg shadow-amber-500/20"
                            )}
                        >
                            {escalating ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Alerting Specialists...</>
                            ) : escalated ? (
                                <><CheckCircle2 className="w-4 h-4" /> Specialist Notified</>
                            ) : (
                                <><ShieldAlert className="w-4 h-4" /> Notify Clinical Team Now</>
                            )}
                        </button>
                    </div>
                </motion.div>
            )}

            {result.auraResponse && (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-6 rounded-[2rem] bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-12 h-12" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Aura is speaking</p>
                  </div>
                  <p className="text-lg font-medium leading-relaxed italic">"{result.auraResponse}"</p>
                </div>
              </motion.div>
            )}

            {/* ACTION PLAN CARDS */}
            {result.actionPlan && result.actionPlan.length > 0 && (
                <div className="grid grid-cols-1 gap-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-4">Immediate Action Plan</p>
                    <div className="flex flex-col gap-2">
                        {result.actionPlan.map((step: string, idx: number) => (
                            <motion.div 
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                key={idx}
                                className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/20 border border-primary/5 hover:border-primary/20 transition-all group"
                            >
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary group-hover:scale-110 transition-transform">
                                    {idx + 1}
                                </div>
                                <p className="text-sm font-bold opacity-80">{step}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
               <p className="text-[10px] font-black uppercase text-indigo-500 tracking-widest mb-2 flex items-center gap-2">
                 <Play className="w-3 h-3" /> Transcription
               </p>
               <p className="text-sm italic opacity-70">
                 {result.transcription ? `"${result.transcription}"` : "No clear speech detected. Please try again."}
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                 <p className="text-[10px] font-black uppercase text-emerald-500 tracking-widest mb-2 flex items-center gap-2">
                    <HeartPulse className="w-3 h-3" /> Clinical Summary
                 </p>
                 <p className="text-xs font-bold leading-relaxed">{result.clinicalSummary}</p>
               </div>
               <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                 <p className="text-[10px] font-black uppercase text-amber-500 tracking-widest mb-2 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" /> Aura Reasoning
                 </p>
                 <p className="text-[10px] leading-relaxed opacity-60">{result.reasoning}</p>
               </div>
            </div>

            <div className="p-4 rounded-2xl bg-secondary/30 border border-primary/5">
               <p className="text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2 font-black">
                 <Info className="w-3 h-3" /> Clinical Entities Detected
               </p>
                <div className="flex flex-wrap gap-2">
                  {result.entities?.symptoms?.map((s: string) => (
                    <span key={s} className="px-2 py-1 bg-red-500/10 text-red-500 text-[9px] font-black rounded-md uppercase border border-red-500/10">{s}</span>
                  )) || <span className="text-[9px] opacity-40 uppercase font-bold italic">No symptoms detected</span>}
                  {result.entities?.meds?.map((m: string) => (
                    <span key={m} className="px-2 py-1 bg-blue-500/10 text-blue-500 text-[9px] font-black rounded-md uppercase border border-blue-500/10">{m}</span>
                  ))}
                </div>
            </div>

            <button 
              onClick={() => { setAudioBlob(null); setResult(null); setEscalated(false); }}
              className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-foreground/30 hover:text-foreground transition-colors"
            >
              Discard and re-record
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
