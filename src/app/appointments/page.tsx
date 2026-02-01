"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, Clock, User, ChevronRight, CheckCircle2, Video, MapPin, Calculator } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Calendar from "@/components/features/Calendar";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { format } from "date-fns";

const doctors = [
  { id: 1, name: "Dr. Sarah Johnson", specialty: "Obstetrician", rating: 4.9, reviews: 120 },
  { id: 2, name: "Dr. Michael Chen", specialty: "Pediatrician", rating: 4.8, reviews: 95 },
  { id: 3, name: "Dr. Elena Gomez", specialty: "General Practitioner", rating: 4.7, reviews: 80 },
];

const timeSlots = ["09:00 AM", "10:30 AM", "01:00 PM", "02:30 PM", "04:00 PM"];

export default function AppointmentsPage() {
  const [selectedDoctor, setSelectedDoctor] = useState(doctors[0]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(timeSlots[0]);
  const [booked, setBooked] = useState(false);

  const handleBook = () => {
    setBooked(true);
    setTimeout(() => setBooked(false), 5000);
  };

  return (
    <ProtectedRoute>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-12 space-y-4">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight">
          Book an <span className="text-gradient">Appointment</span>
        </h1>
        <p className="text-foreground/60 text-lg">
          Connect with specialists via remote consultation or in-person visits.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Step 1: Select Doctor */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full premium-gradient flex items-center justify-center text-white text-xs font-bold">1</div>
            <h2 className="text-xl font-bold">Select Specialist</h2>
          </div>
          <div className="space-y-3">
            {doctors.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedDoctor(doc)}
                className={cn(
                  "w-full glass p-5 rounded-[2rem] border transition-all text-left flex items-center gap-4 group",
                  selectedDoctor.id === doc.id ? "border-primary bg-primary/5 ring-4 ring-primary/5" : "border-primary/5 hover:border-primary/20"
                )}
              >
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center font-bold text-primary group-hover:scale-110 transition-transform">
                  {doc.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="font-bold">{doc.name}</div>
                  <div className="text-xs text-foreground/50">{doc.specialty}</div>
                </div>
                {selectedDoctor.id === doc.id && (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Select Date & Time */}
        <div className="space-y-6">
           <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full premium-gradient flex items-center justify-center text-white text-xs font-bold">2</div>
            <h2 className="text-xl font-bold">Date & Time</h2>
          </div>
          <div className="glass p-8 rounded-[2.5rem] border border-primary/5 space-y-8">
            <Calendar 
              selectedDate={selectedDate} 
              onDateSelect={setSelectedDate} 
            />

            <div className="pt-8 border-t border-primary/5 space-y-4">
               <h3 className="font-bold flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-primary" />
                Available Slots for {format(selectedDate, "MMM d")}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={cn(
                      "px-4 py-3 rounded-2xl text-sm font-bold transition-all border",
                      selectedSlot === slot 
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                        : "bg-secondary/50 border-transparent hover:bg-primary/5 hover:border-primary/20"
                    )}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-primary/5 space-y-4">
               <div className="flex items-center gap-2 text-xs font-bold text-foreground/40 uppercase tracking-widest">
                <MapPin className="w-3 h-3" />
                Consultation Type
              </div>
              <div className="grid grid-cols-2 gap-3">
                 <button className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-primary bg-primary/5">
                    <Video className="w-5 h-5 text-primary" />
                    <span className="text-xs font-bold">Remote</span>
                 </button>
                 <button className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-transparent bg-secondary/50 opacity-50">
                    <User className="w-5 h-5" />
                    <span className="text-xs font-bold">In-Clinic</span>
                 </button>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Summary & Confirm */}
        <div className="space-y-6">
           <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full premium-gradient flex items-center justify-center text-white text-xs font-bold">3</div>
            <h2 className="text-xl font-bold">Confirm Booking</h2>
          </div>
          <div className="premium-gradient p-8 rounded-[2.5rem] text-white space-y-8 shadow-2xl shadow-primary/20">
            <div className="space-y-2">
              <div className="text-xs font-black uppercase tracking-widest opacity-60">Consultation with</div>
              <div className="text-2xl font-black">{selectedDoctor.name}</div>
              <div className="text-sm font-bold opacity-80">{selectedDoctor.specialty}</div>
            </div>
            
            <div className="space-y-4 pt-6 border-t border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase opacity-60">Date</div>
                  <div className="font-bold text-sm">{format(selectedDate, "EEEE, MMM d")}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase opacity-60">Time</div>
                  <div className="font-bold text-sm">{selectedSlot}</div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleBook}
              disabled={booked}
              className={cn(
                "w-full py-5 rounded-3xl font-black text-xl transition-all",
                booked 
                  ? "bg-emerald-500 text-white" 
                  : "bg-white text-primary hover:bg-white/95 hover:scale-[1.02]"
              )}
            >
              {booked ? "BOOKED!" : "CONFIRM BOOKING"}
            </button>
          </div>

          <AnimatePresence>
            {booked && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm font-bold flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5" />
                Booking confirmed! Check your email for details.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
