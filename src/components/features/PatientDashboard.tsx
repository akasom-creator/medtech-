"use client";

import { motion } from "framer-motion";
import { 
  FileText, 
  Upload, 
  Calendar, 
  History, 
  ArrowRight, 
  Activity, 
  Plus, 
  Search,
  BrainCircuit,
  Bell
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { analyzeSymptoms, getMaternalInsights } from "@/lib/ai";
import RecordUpload from "./RecordUpload";
import SmartReminders from "./SmartReminders";
import RecordSharing from "./RecordSharing";
import HealthInsights from "./HealthInsights";
import VoiceInteraction from "./VoiceInteraction";

export default function PatientDashboard() {
  const [triageInput, setTriageInput] = useState("");
  const [aiResponse, setAiResponse] = useState({ text: "", suggestions: [] as string[] });
  const [loadingAi, setLoadingAi] = useState(false);
  const [insight, setInsight] = useState("");
  const [loadingInsight, setLoadingInsight] = useState(false);

  const handleTriage = async () => {
    setLoadingAi(true);
    const res = await analyzeSymptoms(triageInput);
    setAiResponse(res);
    setLoadingAi(false);
  };

  const fetchInsight = async () => {
    setLoadingInsight(true);
    const res = await getMaternalInsights(24, { bp: "110/70", weight: "65kg" });
    setInsight(res);
    setLoadingInsight(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">Welcome back, <span className="text-gradient">Alex</span>.</h1>
          <p className="text-foreground/50">Your health overview stays updated in real-time.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-xl glass border border-primary/20 flex items-center gap-2 text-sm font-bold">
            <Upload className="w-4 h-4 text-primary" />
            Upload Records
          </button>
          <Link href="/emergency" className="px-4 py-2 rounded-xl bg-destructive text-white flex items-center gap-2 text-sm font-bold">
            <Bell className="w-4 h-4" />
            SOS
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* AI Triage Section */}
          <section className="glass p-8 rounded-[2.5rem] border border-primary/10 relative overflow-hidden bg-primary/5">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <BrainCircuit className="w-32 h-32 text-primary" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center text-white">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold">AI Assistant Triage</h2>
              </div>
              <p className="text-sm text-foreground/60 max-w-xl">
                Feeling unwell? Describe your symptoms, and our AI will provide guidance using Google Gemini models.
              </p>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={triageInput}
                  onChange={(e) => setTriageInput(e.target.value)}
                  placeholder="e.g. Mild headache and dizziness for 2 hours..."
                  className="flex-1 bg-white dark:bg-black/40 border-none rounded-2xl px-6 py-4 text-sm shadow-inner outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground dark:text-white placeholder:text-foreground/40 dark:placeholder:text-white/40"
                />
                <button 
                  onClick={handleTriage}
                  disabled={loadingAi || !triageInput}
                  className="px-6 py-4 rounded-2xl bg-primary text-white font-bold hover:shadow-lg transition-all shrink-0 disabled:opacity-50"
                >
                  {loadingAi ? "Analyzing..." : "Analyze"}
                </button>
              </div>
              {aiResponse.text && (
                <div className="space-y-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-2xl bg-white dark:bg-black/60 border border-primary/10 text-sm leading-relaxed dark:text-white/90"
                  >
                    <p className="whitespace-pre-wrap">{aiResponse.text}</p>
                  </motion.div>

                  {aiResponse.suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      <h3 className="text-sm font-bold uppercase tracking-widest text-primary/60 px-2">Recommended Reading</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {aiResponse.suggestions.map((tag) => (
                          <Link 
                            key={tag}
                            href={`/resources?search=${tag}`}
                            className="p-4 rounded-2xl bg-primary/5 border border-primary/10 hover:border-primary/30 transition-all flex items-center justify-between group"
                          >
                            <span className="text-sm font-bold">{tag} Essentials</span>
                            <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Medical History */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                Medical Records
              </h2>
              <button className="text-primary text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "Blood Test Report", type: "PDF", date: "Jan 12, 2026", size: "2.4MB" },
                { name: "Ultrasound Scan", type: "Image", date: "Dec 28, 2025", size: "12.1MB" },
                { name: "Maternal Health Summary", type: "PDF", date: "Dec 15, 2025", size: "1.1MB" },
              ].map((record) => (
                <div key={record.name} className="glass p-5 rounded-3xl border border-primary/5 flex items-center gap-4 group cursor-pointer hover:border-primary/20 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{record.name}</div>
                    <div className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">{record.date} • {record.size}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <RecordUpload />
          <VoiceInteraction context="patient" />
          <RecordSharing />
        </div>

        {/* Sidebar: Upcoming & Vitals */}
        <div className="space-y-8">
           <HealthInsights />

           <section className="glass p-8 rounded-[2.5rem] border border-primary/10">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming
            </h2>
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-primary shadow-xl shadow-primary/20 text-white space-y-3">
                <div className="text-[10px] font-black uppercase opacity-60">Next Checkup</div>
                <div className="text-lg font-black leading-tight">Maternal Consultation with Dr. Sarah Johnson</div>
                <div className="flex items-center gap-2 text-xs font-bold pt-2 border-t border-white/10">
                  <span>Tomorrow, 10:30 AM</span>
                </div>
              </div>
            </div>
          </section>

          <SmartReminders />

          <section className="glass p-8 rounded-[2.5rem] border border-primary/10">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" />
              Recent Vitals
            </h2>
            <div className="space-y-4">
              {[
                { label: "Heart Rate", value: "82 BPM", trend: "Normal" },
                { label: "Blood Pressure", value: "110/70", trend: "Normal" },
                { label: "Blood Sugar", value: "98 mg/dL", trend: "Great" },
              ].map((vital) => (
                <div key={vital.label} className="flex justify-between items-center p-4 rounded-2xl bg-secondary/30">
                  <div className="text-sm font-medium">{vital.label}</div>
                  <div className="text-right">
                    <div className="font-bold">{vital.value}</div>
                    <div className="text-[10px] text-emerald-500 font-bold tracking-widest uppercase">{vital.trend}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <Link 
          href="/emergency" 
          className="w-16 h-16 rounded-full bg-destructive text-white flex items-center justify-center shadow-2xl shadow-destructive/40"
        >
          <Bell className="w-8 h-8 rotate-12" />
        </Link>
      </div>
    </div>
  );
}
