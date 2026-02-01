"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  MessageSquare, 
  Video, 
  ShieldCheck, 
  Search,
  ChevronRight,
  Stethoscope,
  Network
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const specialists = [
  { id: 1, name: "Dr. Elena Gomez", specialty: "Neonatologist", status: "online", hospital: "City General" },
  { id: 2, name: "Dr. David Smith", specialty: "Cardiologist", status: "online", hospital: "Unity Health" },
  { id: 3, name: "Dr. Sarah Johnson", specialty: "OB/GYN", status: "offline", hospital: "Mother's Hope" },
];

export default function PeerConsultation() {
  const [selectedPeer, setSelectedPeer] = useState(specialists[0]);

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-120px)] flex flex-col px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex-1 flex gap-6 overflow-hidden">
        
        {/* Peer Directory */}
        <div className="w-80 flex flex-col glass rounded-[2.5rem] border border-primary/10 overflow-hidden shrink-0">
          <div className="p-6 border-b border-primary/10">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <Network className="w-5 h-5 text-primary" />
              Expert Network
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
              <input 
                type="text" 
                placeholder="Search specialists..."
                className="w-full bg-secondary/50 border-none rounded-xl pl-10 pr-4 py-2 text-sm"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {specialists.map((peer) => (
              <button
                key={peer.id}
                onClick={() => setSelectedPeer(peer)}
                className={cn(
                  "w-full p-4 rounded-2xl flex items-center gap-4 transition-all text-left",
                  selectedPeer.id === peer.id ? "bg-primary text-white shadow-lg" : "hover:bg-primary/5"
                )}
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold">
                  {peer.name.split(' ').map(n=>n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">{peer.name}</div>
                  <div className={cn("text-[10px] uppercase font-bold truncate", selectedPeer.id === peer.id ? "text-white/70" : "text-foreground/40")}>
                    {peer.specialty}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Collaboration Area */}
        <div className="flex-1 flex flex-col glass rounded-[2.5rem] border border-primary/10 overflow-hidden relative">
          <header className="p-6 border-b border-primary/10 flex items-center justify-between bg-primary/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl premium-gradient flex items-center justify-center text-white">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold">{selectedPeer.name}</h3>
                <p className="text-xs text-foreground/50">{selectedPeer.specialty} • {selectedPeer.hospital}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <a 
                href={`https://meet.jit.si/MedTech-Peer-${selectedPeer.name.replace(/\s+/g, '-')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl glass border border-primary/20 text-primary hover:bg-primary/10 transition-all"
              >
                <Video className="w-5 h-5" />
              </a>
              <button className="p-3 rounded-xl glass border border-primary/20 text-primary hover:bg-primary/10 transition-all">
                <ShieldCheck className="w-5 h-5" />
              </button>
            </div>
          </header>

          <div className="flex-1 flex items-center justify-center p-12 text-center">
            <div className="max-w-md space-y-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <MessageSquare className="w-10 h-10 text-primary" />
              </div>
              <h4 className="text-2xl font-bold italic uppercase tracking-tighter">Secure <span className="text-gradient">Collaboration</span>.</h4>
              <p className="text-sm text-foreground/50 leading-relaxed">
                Connect with specialists for expert second opinions. This channel is encrypted and compliant with medical data standards.
              </p>
              <button className="px-8 py-3 rounded-xl bg-primary text-white font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                INITIATE CASE REVIEW
              </button>
            </div>
          </div>

          {/* Footer Warning */}
          <div className="p-4 bg-secondary/30 text-center border-t border-primary/5">
            <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 flex items-center justify-center gap-2">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              Encrypted Peer Channel Active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
