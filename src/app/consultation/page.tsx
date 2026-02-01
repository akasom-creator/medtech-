"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  MessageSquare, 
  Video, 
  Phone, 
  MoreVertical, 
  Send, 
  Circle, 
  User,
  ChevronLeft,
  Stethoscope,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

const doctors = [
  { id: 1, name: "Dr. Sarah Johnson", specialty: "Obstetrician", status: "online", avatar: "SJ" },
  { id: 2, name: "Dr. Michael Chen", specialty: "Pediatrician", status: "online", avatar: "MC" },
  { id: 3, name: "Dr. Elena Gomez", specialty: "General Practitioner", status: "offline", avatar: "EG" },
  { id: 4, name: "Dr. David Smith", specialty: "Cardiologist", status: "online", avatar: "DS" },
];

const mockMessages = [
  { id: 1, sender: "doctor", text: "Hello! How can I help you today?", time: "10:00 AM" },
  { id: 2, sender: "patient", text: "Hi Doctor, I've been feeling some mild cramps lately.", time: "10:02 AM" },
  { id: 3, sender: "doctor", text: "I see. Are they accompanied by any other symptoms like spotting or fever?", time: "10:05 AM" },
];

import { useAuth } from "@/context/AuthContext";

export default function Consultation() {
  const { role, userData } = useAuth();
  const [selectedDoctor, setSelectedDoctor] = useState(doctors[0]);
  const [message, setMessage] = useState("");
  const [chatOpen, setChatOpen] = useState(false);

  if (role === 'doctor') {
    if (!userData?.isVerified) {
      return (
        <ProtectedRoute allowedRoles={['doctor']}>
          <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mb-8">
              <ShieldCheck className="w-12 h-12 text-primary/40" />
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Verification <span className="text-gradient">Required</span>.</h1>
            <p className="text-foreground/60 max-w-md font-medium text-lg mb-8">
              Your medical credentials are currently being reviewed. Consultation tools will be unlocked once a Super Admin confirms your license.
            </p>
            <div className="glass p-6 rounded-3xl border border-primary/10 bg-secondary/20 flex items-center gap-4">
               <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
               <span className="text-xs font-black uppercase tracking-widest opacity-60">Status: Pending Review</span>
            </div>
          </div>
        </ProtectedRoute>
      );
    }

    return (
      <ProtectedRoute allowedRoles={['doctor']}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <header className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Consultation Requests</h1>
            <p className="text-foreground/60">Incoming patient requests and appointments.</p>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {[1, 2, 3].map(i => (
               <div key={i} className="glass p-6 rounded-3xl border border-primary/10">
                 <div className="flex items-center gap-4 mb-4">
                   <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center font-bold text-primary">P{i}</div>
                   <div>
                     <div className="font-bold">Patient #{i}294</div>
                     <div className="text-xs text-foreground/50">Waiting 5 mins</div>
                   </div>
                 </div>
                 <button className="w-full py-3 bg-primary text-white rounded-xl font-bold">Accept Request</button>
               </div>
             ))}
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
    <div className="max-w-7xl mx-auto h-[calc(100vh-100px)] flex flex-col px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex-1 flex gap-6 overflow-hidden">
        
        {/* Sidebar: Doctors List */}
        <div className={cn(
          "w-full md:w-80 flex flex-col glass rounded-[2rem] border border-primary/10 overflow-hidden shrink-0",
          chatOpen ? "hidden md:flex" : "flex"
        )}>
          <div className="p-6 border-b border-primary/10 space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-primary" />
              Doctors online
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
              <input 
                type="text" 
                placeholder="Search doctors..."
                className="w-full bg-secondary/50 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {doctors.map((doc) => (
              <button
                key={doc.id}
                onClick={() => {
                  setSelectedDoctor(doc);
                  setChatOpen(true);
                }}
                className={cn(
                  "w-full p-4 rounded-2xl flex items-center gap-4 transition-all text-left group",
                  selectedDoctor.id === doc.id ? "bg-primary text-white" : "hover:bg-primary/5"
                )}
              >
                <div className="relative">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center font-bold",
                    selectedDoctor.id === doc.id ? "bg-white/20" : "bg-primary/10 text-primary"
                  )}>
                    {doc.avatar}
                  </div>
                  {doc.status === "online" && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold truncate">{doc.name}</div>
                  <div className={cn(
                    "text-xs truncate",
                    selectedDoctor.id === doc.id ? "text-white/70" : "text-foreground/50"
                  )}>
                    {doc.specialty}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={cn(
          "flex-1 flex flex-col glass rounded-[2rem] border border-primary/10 overflow-hidden",
          !chatOpen ? "hidden md:flex" : "flex"
        )}>
          {/* Chat Header */}
          <div className="p-4 md:p-6 border-b border-primary/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setChatOpen(false)}
                className="md:hidden p-2 rounded-xl border border-primary/10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="relative">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {selectedDoctor.avatar}
                </div>
                {selectedDoctor.status === "online" && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                )}
              </div>
              <div className="min-w-0">
                <div className="font-bold truncate">{selectedDoctor.name}</div>
                <div className="text-xs text-foreground/50 truncate uppercase tracking-wider font-semibold">
                  {selectedDoctor.specialty}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <a 
                href={`https://meet.jit.si/MedTech-Room-${selectedDoctor.name.replace(/\.[^\w\s]/g, '').replace(/\s+/g, '-')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 md:p-3 rounded-xl hover:bg-primary/5 transition-all text-primary"
              >
                <Video className="w-5 h-5 md:w-6 md:h-6" />
              </a>
              <button className="p-2 md:p-3 rounded-xl hover:bg-primary/5 transition-all text-primary">
                <Phone className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <button className="p-2 md:p-3 rounded-xl hover:bg-primary/5 transition-all">
                <MoreVertical className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="text-center">
              <span className="px-3 py-1 rounded-full bg-secondary/50 text-[10px] uppercase font-bold text-foreground/40">
                Today
              </span>
            </div>
            {mockMessages.map((msg) => (
              <div key={msg.id} className={cn(
                "flex flex-col max-w-[80%]",
                msg.sender === "patient" ? "ml-auto items-end" : "mr-auto items-start"
              )}>
                <div className={cn(
                  "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                  msg.sender === "patient" 
                    ? "bg-primary text-white rounded-tr-none" 
                    : "bg-secondary text-foreground rounded-tl-none"
                )}>
                  {msg.text}
                </div>
                <span className="text-[10px] text-foreground/40 mt-1 uppercase font-semibold">
                  {msg.time}
                </span>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 md:p-6 border-t border-primary/10">
            <div className="flex items-center gap-4 bg-secondary/50 rounded-2xl p-2 pl-4">
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your symptoms or message..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2"
                onKeyPress={(e) => e.key === 'Enter' && setMessage("")}
              />
              <button 
                onClick={() => setMessage("")}
                className="p-3 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
