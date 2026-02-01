"use client";

import { motion } from "framer-motion";
import { Share2, Heart, MessageCircle, MoreHorizontal, User, Send, ThumbsUp, ImageIcon, Smile, Users, MessageSquare, Shield, Search, TrendingUp, Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

const circles = [
  { id: 1, name: "Trimester 1 Support", members: 124, active: true, week: "1-13" },
  { id: 2, name: "Nutrition & Diets", members: 89, active: false, week: "All" },
  { id: 3, name: "Third Trimester Prep", members: 210, active: true, week: "28-40" },
  { id: 4, name: "Post-natal Care", members: 56, active: false, week: "Post" },
];

import { useAuth } from "@/context/AuthContext";

export default function CommunityPage() {
  const { role } = useAuth();
  const [activeCircle, setActiveCircle] = useState(circles[0]);

  // Doctor View: Patient List
  if (role === 'doctor') {
    return (
      <ProtectedRoute>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <header className="mb-12">
            <h1 className="text-4xl font-bold mb-4">My Patients</h1>
            <p className="text-foreground/60">Manage your patient list and active consultations.</p>
          </header>
          <div className="glass p-8 rounded-[2rem] border border-primary/10 text-center py-24">
             <User className="w-16 h-16 text-primary mx-auto mb-4" />
             <h3 className="text-xl font-bold mb-2">Patient List Module</h3>
             <p className="text-foreground/50">Patient records and history will appear here.</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Admin View: User Management
  if (role === 'admin') {
     return (
      <ProtectedRoute>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <header className="mb-12">
            <h1 className="text-4xl font-bold mb-4">User Management</h1>
            <p className="text-foreground/60">Administer user accounts and permissions.</p>
          </header>
          <div className="glass p-8 rounded-[2rem] border border-primary/10 text-center py-24">
             <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
             <h3 className="text-xl font-bold mb-2">User Registry</h3>
             <p className="text-foreground/50">Full system user list and CRUD operations.</p>
          </div>
        </div>
      </ProtectedRoute>
    ); 
  }

  // Default: Patient View

  return (
    <ProtectedRoute>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-12 space-y-4">
        <h1 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter">
          Community <span className="text-gradient">Circles</span>.
        </h1>
        <p className="text-foreground/50 text-lg max-w-2xl">
          Join peer-to-peer support groups tailored to your pregnancy stage. 
          Share experiences and grow together.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar: Explore Circles */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="glass p-6 rounded-[2rem] border border-primary/10">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
              <input 
                type="text" 
                placeholder="Find a circle..."
                className="w-full bg-secondary/50 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
            <div className="space-y-3">
              {circles.map((circle) => (
                <button
                  key={circle.id}
                  onClick={() => setActiveCircle(circle)}
                  className={cn(
                    "w-full p-4 rounded-2xl flex items-center justify-between transition-all group",
                    activeCircle.id === circle.id ? "bg-primary text-white" : "hover:bg-primary/5"
                  )}
                >
                  <div className="text-left">
                    <div className="font-bold text-sm">{circle.name}</div>
                    <div className={cn("text-[10px] font-bold uppercase tracking-widest", activeCircle.id === circle.id ? "text-white/60" : "text-foreground/30")}>
                      {circle.members} Members
                    </div>
                  </div>
                  {circle.active && (
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
          <button className="w-full py-4 rounded-2xl border-2 border-dashed border-primary/20 text-primary/60 font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary/40 transition-all">
            <Plus className="w-4 h-4" />
            Create Circle
          </button>
        </aside>

        {/* Chat Area Mockup */}
        <div className="lg:col-span-3 glass rounded-[3rem] border border-primary/10 overflow-hidden flex flex-col h-[700px]">
          <div className="p-8 border-b border-primary/10 flex items-center justify-between bg-primary/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl premium-gradient flex items-center justify-center text-white shadow-lg">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{activeCircle.name}</h2>
                <div className="text-[10px] font-black uppercase tracking-widest text-primary">Week {activeCircle.week} Group</div>
              </div>
            </div>
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-secondary flex items-center justify-center text-[10px] font-bold">
                  U{i}
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-white bg-primary text-white flex items-center justify-center text-[10px] font-bold">
                +42
              </div>
            </div>
          </div>

          <div className="flex-1 p-8 overflow-y-auto space-y-8 bg-dot-pattern">
             <div className="text-center">
              <span className="px-4 py-1 rounded-full bg-secondary/50 text-[10px] font-black uppercase tracking-widest text-foreground/40">
                Peer Discussion
              </span>
            </div>
            
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold shrink-0">JS</div>
              <div className="space-y-1 max-w-lg">
                <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Jane Smith • 10:45 AM</div>
                <div className="p-4 rounded-2xl rounded-tl-none bg-secondary text-sm leading-relaxed">
                  Has anyone experienced morning sickness well into the second trimester? I'm at Week 14 and it's still quite intense.
                </div>
              </div>
            </div>

            <div className="flex gap-4 flex-row-reverse">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold shrink-0">ME</div>
              <div className="space-y-1 max-w-lg items-end flex flex-col">
                <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Me • 11:02 AM</div>
                <div className="p-4 rounded-2xl rounded-tr-none bg-primary text-white text-sm leading-relaxed shadow-lg shadow-primary/20">
                  I'm at Week 12 and it's starting to fade for me. My doctor recommended ginger tea in the mornings, it really helped!
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold shrink-0">LG</div>
              <div className="space-y-1 max-w-lg">
                <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Linda Green • 11:05 AM</div>
                <div className="p-4 rounded-2xl rounded-tl-none bg-secondary text-sm leading-relaxed">
                  Definitely try small, frequent meals. It varies for everyone, but ginger is a great suggestion! 🍵
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 border-t border-primary/10">
            <div className="flex gap-4 p-2 pl-6 bg-secondary/50 rounded-2xl items-center">
              <input 
                type="text" 
                placeholder="Share your experience..." 
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3"
              />
              <button className="px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                SEND
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
