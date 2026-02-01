"use client";

import { motion } from "framer-motion";
import { Activity, Apple, Baby, Calendar, Heart, Info, Plus, Wind, Share2, FileText, ChevronRight, TrendingUp, AlertCircle, Printer } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

const timelineWeeks = [
  { week: 4, title: "Laying the Foundation", info: "The neural tube is forming." },
  { week: 8, title: "Major Organs Developing", info: "Heart is beating regularly." },
  { week: 12, title: "First Trimester Complete", info: "Baby is moving their limbs." },
  { week: 20, title: "Halfway There", info: "You can feel the first kicks." },
  { week: 28, title: "Third Trimester Begins", info: "Baby's eyes can open and close." },
  { week: 36, title: "Getting Ready", info: "Baby is dropping into position." },
];

export default function MaternalTracker() {
  const [currentWeek, setCurrentWeek] = useState(12);

  return (
    <ProtectedRoute>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-12 space-y-4">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight">
          Maternal <span className="text-gradient">Health Tracker</span>
        </h1>
        <p className="text-foreground/60 text-lg">
          Track your progress, monitor vitals, and receive personalized care tips.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Progress & Timeline */}
        <div className="lg:col-span-2 space-y-8">
          <section className="glass p-8 rounded-[2.5rem] border border-primary/10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">Pregnancy Progress</h2>
                <p className="text-sm text-foreground/50">Week {currentWeek} of 40</p>
              </div>
              <div className="w-16 h-16 premium-gradient rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg border-4 border-white/20">
                {Math.round((currentWeek / 40) * 100)}%
              </div>
            </div>

            {/* Visual Timeline */}
            <div className="relative pt-10 pb-20">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-primary/10 -translate-y-1/2" />
              <div 
                className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 transition-all duration-1000" 
                style={{ width: `${(currentWeek / 40) * 100}%` }}
              />
              
              <div className="relative flex justify-between items-center h-4">
                {[0, 10, 20, 30, 40].map((w) => (
                  <button
                    key={w}
                    onClick={() => setCurrentWeek(w)}
                    className={cn(
                      "w-4 h-4 rounded-full border-2 transition-all duration-300 relative group",
                      currentWeek >= w ? "bg-primary border-primary scale-125" : "bg-white border-primary/20"
                    )}
                  >
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold whitespace-nowrap">
                      Week {w}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10">
                <div className="text-primary font-bold mb-1">Due Date</div>
                <div className="text-lg font-black">Sept 24, 2026</div>
              </div>
              <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10">
                <div className="text-primary font-bold mb-1">Days to Go</div>
                <div className="text-lg font-black">182 Days</div>
              </div>
              <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10">
                <div className="text-primary font-bold mb-1">Baby Size</div>
                <div className="text-lg font-black italic">Lemon 🍋</div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-2xl font-bold px-2">Milestone Timeline</h3>
            <div className="space-y-4">
              {timelineWeeks.map((item, idx) => (
                <motion.div
                  key={item.week}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={cn(
                    "glass p-6 rounded-3xl border transition-all flex items-center gap-6",
                    currentWeek >= item.week ? "border-primary/30" : "border-primary/5 grayscale opacity-50"
                  )}
                >
                  <div className="w-12 h-12 rounded-2xl premium-gradient flex items-center justify-center text-white shrink-0">
                    <Baby className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                       <span className="text-xs font-bold text-primary uppercase">Week {item.week}</span>
                       <h4 className="font-bold">{item.title}</h4>
                    </div>
                    <p className="text-sm text-foreground/60">{item.info}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Vitals & Quick Tips */}
        <div className="space-y-8">
          <section className="glass p-8 rounded-[2.5rem] border border-primary/10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold">Daily Vitals</h2>
              <button className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all">
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {[
                { label: "Blood Pressure", value: "120/80", unit: "mmHg", icon: Heart, color: "text-red-500" },
                { label: "Weight", value: "68.5", unit: "kg", icon: Activity, color: "text-blue-500" },
                { label: "Mood", value: "Happy", unit: "", icon: Activity, color: "text-amber-500" },
              ].map((vital) => (
                <div key={vital.label} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <vital.icon className={cn("w-5 h-5", vital.color)} />
                    <span className="font-medium">{vital.label}</span>
                  </div>
                  <div className="font-bold">
                    {vital.value} <span className="text-xs font-normal opacity-50">{vital.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="premium-gradient p-8 rounded-[2.5rem] text-white shadow-xl shadow-primary/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Wind className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold">Quick Tips</h2>
            </div>
            <div className="space-y-4">
              <p className="text-sm leading-relaxed opacity-90">
                "Stay hydrated! Aim for 8-10 glasses of water daily to maintain amniotic fluid levels."
              </p>
              <div className="pt-4 border-t border-white/20 flex gap-4">
                <Apple className="w-5 h-5 opacity-50" />
                <Info className="w-5 h-5 opacity-50" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
