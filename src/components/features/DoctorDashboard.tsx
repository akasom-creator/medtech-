"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  Calendar, 
  Clock, 
  MessageSquare, 
  Settings, 
  Search, 
  Bell, 
  ChevronRight,
  Activity,
  Heart,
  Video,
  Network
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import PeerConsultation from "./PeerConsultation";
import ClinicalDecisionSupport from "./ClinicalDecisionSupport";
import VoiceInteraction from "./VoiceInteraction";

const patientQueue = [
  { id: 1, name: "Maria Garcia", time: "10:30 AM", type: "Video Call", urgency: "Moderate" },
  { id: 2, name: "Jessica Smith", time: "11:15 AM", type: "In-Clinic", urgency: "Low" },
  { id: 3, name: "Emily Brown", time: "12:00 PM", type: "Video Call", urgency: "High" },
];

export default function DoctorDashboard() {
  const [view, setView] = useState<"main" | "peer">("main");

  if (view === "peer") {
    return (
      <div className="space-y-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => setView("main")}
            className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mt-4 group"
          >
            <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
        </div>
        <PeerConsultation />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">Doctor <span className="text-gradient">Panel</span>.</h1>
          <p className="text-foreground/50">You have 8 appointments scheduled for today.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-xl glass border border-primary/20 flex items-center gap-2 text-sm font-bold">
            <Settings className="w-4 h-4" />
            Duty Status
          </button>
          <div className="relative">
             <button className="p-2 px-3 rounded-xl bg-primary text-white flex items-center gap-2 text-sm font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Stats Grid */}
        <div className="lg:col-span-1 space-y-4">
           {[
            { label: "Today's Patients", value: "8", icon: Users, color: "text-blue-500" },
            { label: "Consultation Hrs", value: "5.5", icon: Clock, color: "text-emerald-500" },
            { label: "Critical Alerts", value: "2", icon: Bell, color: "text-red-500" },
            { label: "Pending Reviews", value: "12", icon: Settings, color: "text-amber-500" },
          ].map((stat) => (
            <div key={stat.label} className="glass p-6 rounded-[2.5rem] border border-primary/5 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">{stat.label}</div>
                <div className="text-2xl font-black">{stat.value}</div>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color} opacity-20`} />
            </div>
          ))}
        </div>

        {/* Patient Queue & AI Tools */}
        <div className="lg:col-span-2 space-y-8">
          <ClinicalDecisionSupport patients={patientQueue} />
          
          <div className="glass p-8 rounded-[2.5rem] border border-primary/10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Appointment Queue
              </h2>
              <div className="text-xs font-bold text-primary">Jan 5, 2026</div>
            </div>
            
            <div className="space-y-4">
              {patientQueue.map((patient) => (
                <div key={patient.id} className="relative p-6 rounded-3xl bg-secondary/30 border border-transparent hover:border-primary/20 transition-all flex items-center gap-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {patient.name.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold truncate">{patient.name}</div>
                    <div className="flex gap-3 mt-1">
                      <span className="text-[10px] font-black uppercase text-foreground/40">{patient.time}</span>
                      <span className="text-[10px] font-black uppercase text-primary">{patient.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {patient.type === "Video Call" && (
                      <a 
                        href={`https://meet.jit.si/MedTech-Room-Dr-Current`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 hover:scale-110 transition-transform flex items-center gap-2 text-[10px] font-black uppercase"
                      >
                        <Video className="w-4 h-4" />
                        Join Call
                      </a>
                    )}
                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      patient.urgency === 'High' ? 'bg-red-500/10 text-red-500' : 
                      patient.urgency === 'Moderate' ? 'bg-amber-500/10 text-amber-500' : 
                      'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      {patient.urgency}
                    </div>
                    <ChevronRight className="w-5 h-5 text-foreground/20 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <VoiceInteraction context="doctor" />
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-8 rounded-[2.5rem] border border-primary/10">
            <h2 className="text-xl font-bold mb-8">Recent Chats</h2>
            <div className="space-y-6">
              {[
                { name: "Sarah Miller", msg: "Thank you doctor!", time: "2m ago" },
                { name: "John Wick", msg: "The symptoms are better.", time: "15m ago" },
                { name: "Anna Jones", msg: "Can we reschedule?", time: "1h ago" },
              ].map((chat) => (
                <div key={chat.name} className="flex gap-4 items-start group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-secondary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <div className="text-sm font-bold truncate">{chat.name}</div>
                      <div className="text-[9px] uppercase font-black text-foreground/30">{chat.time}</div>
                    </div>
                    <p className="text-xs text-foreground/50 truncate">{chat.msg}</p>
                  </div>
                </div>
              ))}
              <Link href="/consultation" className="block text-center pt-4 text-xs font-black text-primary hover:underline">
                OPEN MESSENGER
              </Link>
            </div>
          </div>

          <div className="glass p-8 rounded-[2.5rem] border border-primary/10">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Network className="w-5 h-5 text-primary" />
              Peer Network
            </h2>
            <p className="text-xs text-foreground/50 mb-4">Connect with 12 available specialists.</p>
            <button 
              onClick={() => setView("peer")}
              className="w-full py-3 rounded-xl bg-primary/10 text-primary font-bold text-[10px] uppercase tracking-widest hover:bg-primary/20 transition-all font-black"
            >
              GO TO EXPERT NETWORK
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
