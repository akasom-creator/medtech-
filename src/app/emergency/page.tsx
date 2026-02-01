"use client";

import { useState } from "react";
import { useNotifications } from "@/components/layout/NotificationProvider";
import { motion } from "framer-motion";
import { Share2, MapPin, Phone, AlertTriangle, ArrowRight, Ambulance, ShieldAlert, HeartPulse, Stethoscope, AlertCircle, PhoneCall, Activity, Clock, Heart, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

export default function EmergencyPage() {
  const { notify } = useNotifications();
  const [activeSOS, setActiveSOS] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isDispatching, setIsDispatching] = useState(false);

  const triggerEmergency = () => {
    setIsDispatching(true);
    // Capture Location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setLocation(loc);
          broadcastEmergency(loc);
        },
        () => {
          // Fallback location (Lagos, Nigeria for demo)
          const loc = { lat: 6.5244, lng: 3.3792 };
          setLocation(loc);
          broadcastEmergency(loc);
        }
      );
    }

    notify("emergency", "SOS BROADCASTED", "Your precise location and vitals have been sent to the Emergency Response Center.");
  };

  const broadcastEmergency = (loc: {lat: number, lng: number}) => {
    const emergencyEvent = {
      id: Math.random().toString(36).substr(2, 9),
      patientName: "Alex", // Mock current user
      location: loc,
      vitals: { hr: 102, o2: 98 },
      status: "pending",
      timestamp: new Date().toISOString()
    };
    
    // In a real app, this would be a Supabase broadcast
    // For this demo, we'll use localStorage to bridge the dashboards
    const existing = JSON.parse(localStorage.getItem("active_emergencies") || "[]");
    localStorage.setItem("active_emergencies", JSON.stringify([emergencyEvent, ...existing]));
    
    // Trigger storage event for other tabs
    window.dispatchEvent(new Event('storage'));
    
    setTimeout(() => {
        setActiveSOS(true);
    }, 1500);
  };

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-destructive/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Alert */}
        <header className="relative overflow-hidden rounded-[3rem] bg-destructive p-8 md:p-16 text-white text-center space-y-6 shadow-2xl shadow-destructive/30">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <ShieldAlert className="w-full h-full" />
          </div>
          <div className="relative z-10 inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest animate-pulse">
            <AlertCircle className="w-4 h-4" />
            <span>Emergency Mode Active</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic">
            Urgent Care Needed?
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto font-medium">
            Stay calm. We are connecting you to professional help immediately. 
            Follow the steps below or use the one-touch call button.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <button 
              onClick={triggerEmergency}
              disabled={isDispatching}
              className={cn(
                "w-full sm:w-auto px-12 py-6 rounded-2xl font-black text-2xl transition-all flex items-center justify-center gap-4 shadow-xl",
                isDispatching ? "bg-white/50 text-destructive cursor-not-allowed" : "bg-white text-destructive hover:scale-105"
              )}
            >
              <PhoneCall className={cn("w-8 h-8", isDispatching && "animate-spin")} />
              {isDispatching ? "GETTING LOCATION..." : "CALL AMBULANCE"}
            </button>
            <Link 
              href="/consultation"
              className="w-full sm:w-auto px-12 py-6 rounded-2xl bg-destructive-foreground/20 backdrop-blur-md border border-white/20 text-white font-black text-2x hover:bg-white/10 transition-all text-center"
            >
              CHAT WITH ON-CALL DOCTOR
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Status Tracker */}
          <div className="lg:col-span-2 space-y-8">
            <section className="glass p-8 rounded-[2.5rem] border-2 border-destructive/20 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                <Activity className="w-32 h-32 text-destructive" />
              </div>
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <Clock className="w-6 h-6 text-destructive" />
                Wait Times & Triage
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "On-Call OB/GYN", time: "2 Mins", status: "Available", color: "text-emerald-500" },
                  { label: "Emergency Room", time: "15 Mins", status: "High Volume", color: "text-amber-500" },
                  { label: "Ambulance Response", time: "8 Mins", status: "Near You", color: "text-emerald-500" },
                  { label: "Pediatric Triage", time: "5 Mins", status: "Available", color: "text-emerald-500" },
                ].map((item) => (
                  <div key={item.label} className="p-6 rounded-3xl bg-destructive/5 border border-destructive/10 flex justify-between items-center group hover:bg-destructive/10 transition-all cursor-pointer">
                    <div>
                      <div className="font-bold">{item.label}</div>
                      <div className={cn("text-xs font-bold uppercase tracking-widest mt-1", item.color)}>{item.status}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-destructive">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass p-8 rounded-[2.5rem] border border-primary/10">
                <Heart className="w-10 h-10 text-destructive mb-4" />
                <h3 className="text-xl font-bold mb-2">My Vitals</h3>
                <p className="text-sm text-foreground/50 mb-6">Last synced 1 min ago</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 rounded-2xl bg-secondary/50">
                    <span className="font-medium text-sm">Heart Rate</span>
                    <span className="font-black text-destructive">102 BPM</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-2xl bg-secondary/50">
                    <span className="font-medium text-sm">Oxygen</span>
                    <span className="font-black text-primary">98%</span>
                  </div>
                </div>
              </div>
              <div className="glass p-8 rounded-[2.5rem] border border-primary/10">
                <MapPin className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Nearby Facilities</h3>
                <p className="text-sm text-foreground/50 mb-6">Showing top 3 closest</p>
                <div className="space-y-3">
                  {["General Hospital (1.2km)", "Unity Health Center (2.5km)", "City Maternity Clinic (3.1km)"].map((clinic) => (
                    <div key={clinic} className="flex items-center justify-between group cursor-pointer">
                      <span className="text-sm font-medium group-hover:text-primary transition-colors">{clinic}</span>
                      <ChevronRight className="w-4 h-4 text-foreground/30 group-hover:text-primary" />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Guidelines Sidebar */}
          <section className="space-y-8">
            <div className="glass p-8 rounded-[2.5rem] border border-destructive/20 bg-destructive/5">
              <div className="w-16 h-16 rounded-2xl premium-gradient flex items-center justify-center text-white mb-6">
                <Stethoscope className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-6">Triage Checklist</h2>
              <div className="space-y-6">
                {[
                  "Are you experiencing heavy bleeding?",
                  "Is there sudden severe abdominal pain?",
                  "Is your vision blurred or dizzy?",
                  "Have you felt decreased baby movement?"
                ].map((q, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full border-2 border-destructive shrink-0 flex items-center justify-center text-[10px] font-black text-destructive mt-1">
                      {idx + 1}
                    </div>
                    <p className="text-sm font-medium leading-relaxed">{q}</p>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => notify("warning", "Symptom Logged", "Your triage responses have been shared with your medical team.")}
                className="w-full mt-10 py-4 rounded-2xl bg-destructive text-white font-bold hover:shadow-lg transition-all"
              >
                SUBMIT SYMPTOMS
              </button>
            </div>

            <div className="glass p-8 rounded-[2.5rem] border border-primary/10">
              <h3 className="font-bold mb-4">Emergency Contacts</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-secondary/50 flex items-center justify-between">
                  <div className="font-bold text-sm">John Doe (Husband)</div>
                  <button onClick={() => notify("info", "SMS Sent", "Emergency contact John Doe has been notified.")}>
                    <PhoneCall className="w-4 h-4 text-primary" />
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50 flex items-center justify-between">
                  <div className="font-bold text-sm">Dr. Sarah Johnson</div>
                  <button onClick={() => notify("info", "SOS Alert sent to Doctor", "Dr. Johnson is reviewing your case.")}>
                    <PhoneCall className="w-4 h-4 text-primary" />
                  </button>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
