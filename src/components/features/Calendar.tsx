"use client";

import { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, eachDayOfInterval } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export default function Calendar({ selectedDate, onDateSelect }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const rows: Date[][] = [];
  let daysInWeek: Date[] = [];

  days.forEach((day, i) => {
    daysInWeek.push(day);
    if ((i + 1) % 7 === 0) {
      rows.push(daysInWeek);
      daysInWeek = [];
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex flex-col">
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Schedule</span>
           <h2 className="text-xl font-black uppercase italic tracking-tighter">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
        </div>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 rounded-xl glass hover:bg-primary/5 transition-colors border border-primary/5">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={nextMonth} className="p-2 rounded-xl glass hover:bg-primary/5 transition-colors border border-primary/5">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center text-[10px] font-black uppercase tracking-widest text-foreground/30 py-2">
            {d}
          </div>
        ))}
        {days.map((day, idx) => {
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());

          return (
            <button
              key={idx}
              onClick={() => onDateSelect(day)}
              className={cn(
                "relative h-14 rounded-2xl flex flex-col items-center justify-center transition-all group",
                !isCurrentMonth && "opacity-20 pointer-events-none",
                isSelected 
                  ? "bg-primary text-white shadow-xl shadow-primary/30" 
                  : "hover:bg-primary/5"
              )}
            >
              <span className={cn("text-sm font-bold", isSelected ? "scale-110" : "")}>
                {format(day, "d")}
              </span>
              {isToday && !isSelected && (
                <div className="absolute bottom-2 w-1 h-1 rounded-full bg-primary" />
              )}
              {isSelected && (
                <motion.div 
                  layoutId="activeDay"
                  className="absolute inset-0 border-2 border-primary rounded-2xl pointer-events-none"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 pt-4 border-t border-primary/5">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-primary" /> Today
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-xl border border-primary/20 bg-primary/5" /> Selected
        </div>
      </div>
    </div>
  );
}
