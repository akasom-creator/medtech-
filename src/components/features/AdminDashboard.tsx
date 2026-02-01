"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  BarChart3, 
  Users, 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  TrendingUp,
  Settings,
  Database,
  Search,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Map,
  Globe,
  Bell,
  Clock,
  MapPin,
  Ambulance,
  Phone,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

const growthData = [35, 45, 30, 60, 40, 50, 45, 70, 60, 90, 85, 95];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [emergencies, setEmergencies] = useState<any[]>([]);

  useEffect(() => {
    const loadEmergencies = () => {
      const data = JSON.parse(localStorage.getItem("active_emergencies") || "[]");
      setEmergencies(data);
    };

    loadEmergencies();
    window.addEventListener('storage', loadEmergencies);
    return () => window.removeEventListener('storage', loadEmergencies);
  }, []);

  const handleDispatch = (id: string) => {
    const updated = emergencies.map(e => e.id === id ? { ...e, status: 'dispatched' } : e);
    setEmergencies(updated);
    localStorage.setItem("active_emergencies", JSON.stringify(updated));
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">System <span className="text-gradient">Console</span>.</h1>
          <p className="text-foreground/50">Core platform metrics and security monitoring.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex bg-secondary/30 p-1 rounded-xl border border-primary/5">
            <button 
              onClick={() => setActiveTab("overview")}
              className={cn(
                "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === "overview" ? "bg-primary text-white shadow-lg" : "text-foreground/40 hover:text-foreground"
              )}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab("emergency")}
              className={cn(
                "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                activeTab === "emergency" ? "bg-destructive text-white shadow-lg shadow-destructive/20" : "text-foreground/40 hover:text-foreground"
              )}
            >
              {emergencies.filter(e => e.status === 'pending').length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-destructive animate-ping" />
              )}
              Emergency Queue
            </button>
          </div>
          <button className="px-4 py-2 rounded-xl glass border border-primary/20 flex items-center gap-2 text-sm font-bold">
            <Settings className="w-4 h-4" />
            Config
          </button>
        </div>
      </header>

      {activeTab === "overview" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Patients", value: "1,280", trend: "+12.5%", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Active Consuls", value: "452", trend: "+8.2%", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Critical Alerts", value: "2", trend: "-4.1%", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" },
          { label: "Uptime", value: "99.9%", trend: "Stable", icon: ShieldCheck, color: "text-teal-500", bg: "bg-teal-500/10" },
        ].map((stat) => (
          <div key={stat.label} className="glass p-6 rounded-[2.5rem] border border-primary/5 hover:border-primary/20 transition-all group">
            <div className="flex justify-between items-start mb-4">
               <div className={cn("p-3 rounded-2xl", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full",
                stat.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 
                stat.trend.startsWith('-') ? 'bg-red-500/10 text-red-500' : 'bg-teal-500/10 text-teal-500'
              )}>
                {stat.trend.startsWith('+') && <ArrowUpRight className="w-3 h-3" />}
                {stat.trend.startsWith('-') && <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-foreground/60 mb-1">{stat.label}</div>
            <div className="text-3xl font-black group-hover:scale-105 transition-transform origin-left">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Performance Chart */}
        <div className="lg:col-span-2 glass p-8 rounded-[3rem] border border-primary/10 relative overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Growth Analytics
              </h2>
              <p className="text-[10px] font-bold text-foreground/60 uppercase tracking-[0.2em] mt-1">Monthly Patient Onboarding</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase">Month</button>
              <button className="px-3 py-1 rounded-lg hover:bg-secondary text-foreground/40 text-[10px] font-black uppercase">Year</button>
            </div>
          </div>

          <div className="flex-1 min-h-[220px] relative mt-4">
            {/* SVG Chart Layer */}
            <svg className="w-full h-full" overflow="visible">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Grid Lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line 
                  key={i} 
                  x1="0" y1={`${i * 25}%`} x2="100%" y2={`${i * 25}%`} 
                  stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" 
                />
              ))}

              {/* Data Path */}
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                d={`M ${growthData.map((d, i) => `${(i / (growthData.length - 1)) * 100}%,${100 - d}%`).join(' L ')}`}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="vector-path"
                style={{ vectorEffect: 'non-scaling-stroke' }}
              />

              {/* Gradient Fill */}
              <motion.path
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                d={`M 0,100 L ${growthData.map((d, i) => `${(i / (growthData.length - 1)) * 100}%,${100 - d}%`).join(' L ')} L 100,100 Z`}
                fill="url(#chartGradient)"
              />

              {/* Data Points */}
              {growthData.map((d, i) => (
                <motion.circle
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 + (i * 0.05) }}
                  cx={`${(i / (growthData.length - 1)) * 100}%`}
                  cy={`${100 - d}%`}
                  r="4"
                  fill="white"
                  stroke="var(--primary)"
                  strokeWidth="2"
                  className="cursor-pointer hover:r-6 transition-all"
                />
              ))}
            </svg>
          </div>

          <div className="flex justify-between items-center mt-6 px-2">
            {['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov', 'Dec'].map((m) => (
              <span key={m} className="text-[10px] font-black text-foreground/60 uppercase tracking-widest">{m}</span>
            ))}
          </div>
        </div>

        {/* System Health Quick View */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-8 rounded-[3rem] border border-primary/10 flex-1">
            <h2 className="text-xl font-bold mb-6">Service Health</h2>
            <div className="space-y-4">
              {[
                { label: "Supabase DB", status: "Online", load: 24 },
                { label: "Gemini AI API", status: "Healthy", load: 12 },
                { label: "Storage Engine", status: "Nominal", load: 68 },
              ].map((service) => (
                <div key={service.label} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-wider">
                    <span className="text-foreground/40">{service.label}</span>
                    <span className="text-emerald-500">{service.status}</span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${service.load}%` }}
                      className={cn(
                        "h-full rounded-full",
                        service.load > 80 ? "bg-red-500" : service.load > 50 ? "bg-amber-500" : "bg-emerald-500"
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="premium-gradient p-8 rounded-[3rem] text-white shadow-xl shadow-primary/20 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-black uppercase opacity-60 tracking-widest mb-1">Server Load</div>
              <div className="text-4xl font-black">24%</div>
            </div>
            <BarChart3 className="w-12 h-12 opacity-20" />
          </div>

          <div className="glass p-8 rounded-[3rem] border border-primary/10 flex-1">
            <h2 className="text-xl font-bold mb-6">Case Distribution</h2>
            <div className="flex items-center gap-8">
              <div className="relative w-32 h-32">
                 <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--primary)" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset="62.8" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgb(59 130 246)" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset="188.4" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgb(239 68 68)" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset="226.08" />
                 </svg>
                 <div className="absolute inset-0 flex items-center justify-center font-black text-xs text-foreground/40">75% RH</div>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Maternal", color: "bg-primary" },
                  { label: "Pediatric", color: "bg-blue-500" },
                  { label: "Emergency", color: "bg-red-500" }
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", item.color)} />
                    <span className="text-[10px] font-black uppercase tracking-wider text-foreground/50">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Regional Insights */}
        <div className="glass p-8 rounded-[3rem] border border-primary/10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Map className="w-5 h-5 text-primary" />
              Regional Case Density
            </h2>
            <select className="bg-secondary/50 border-none rounded-lg text-[10px] font-black uppercase px-3 py-1">
              <option>West Africa</option>
              <option>East Africa</option>
            </select>
          </div>
          <div className="space-y-6">
            {[
              { region: "Lagos, NG", cases: 840, load: 92, color: "bg-primary" },
              { region: "Nairobi, KE", cases: 520, load: 45, color: "bg-blue-500" },
              { region: "Accra, GH", cases: 310, load: 68, color: "bg-emerald-500" },
            ].map((r) => (
              <div key={r.region} className="space-y-2">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="font-bold text-sm">{r.region}</div>
                    <div className="text-[10px] font-black text-foreground/30 uppercase">{r.cases} Active Cases</div>
                  </div>
                  <div className="text-right text-[10px] font-black uppercase">{r.load}% Capacity</div>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${r.load}%` }}
                    className={cn("h-full rounded-full", r.color)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Throughput */}
        <div className="glass p-8 rounded-[3rem] border border-primary/10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              API Throughput
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-4 h-48 items-end">
            {[20, 40, 30, 60, 80, 50, 90, 40, 100, 70, 85, 95].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                className="w-full bg-primary/20 rounded-t-lg relative group"
              >
                <div className="absolute inset-0 bg-primary opacity-20 group-hover:opacity-100 transition-opacity rounded-t-lg" />
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-black uppercase text-foreground/30">
            <span>Peak</span>
            <span>Real-time requests/sec</span>
          </div>
        </div>
      </div>
        </motion.div>
      )}

      {activeTab === "emergency" && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Emergency List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Bell className="w-5 h-5 text-destructive" />
                            Live Emergency Queue
                        </h2>
                        <span className="bg-destructive/10 text-destructive text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full animate-pulse">
                            {emergencies.filter(e => e.status === 'pending').length} Action Required
                        </span>
                    </div>

                    <div className="space-y-4">
                        {emergencies.length === 0 ? (
                            <div className="glass p-12 rounded-[2.5rem] border border-primary/5 text-center space-y-4">
                                <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto opacity-20" />
                                <p className="text-foreground/40 font-bold uppercase tracking-widest text-sm">No active emergencies. System clear.</p>
                            </div>
                        ) : (
                            emergencies.map((e) => (
                                <div key={e.id} className={cn(
                                    "glass p-8 rounded-[2.5rem] border-2 transition-all relative overflow-hidden",
                                    e.status === 'pending' ? 'border-destructive/30 bg-destructive/5' : 'border-primary/5 opacity-60'
                                )}>
                                    <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-2xl bg-destructive text-white flex items-center justify-center">
                                                    <AlertTriangle className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <div className="text-2xl font-black tracking-tighter uppercase">{e.patientName}</div>
                                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/40">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(e.timestamp).toLocaleTimeString()}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 rounded-2xl bg-white/50 border border-primary/5">
                                                    <div className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Heart Rate</div>
                                                    <div className="text-xl font-black text-destructive">{e.vitals.hr} BPM</div>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-white/50 border border-primary/5">
                                                    <div className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Oxygen Sat.</div>
                                                    <div className="text-xl font-black text-primary">{e.vitals.o2}%</div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 bg-secondary/50 p-3 rounded-xl border border-primary/5">
                                                <MapPin className="w-4 h-4 text-primary" />
                                                <span className="text-xs font-bold font-mono">COORD: {e.location.lat.toFixed(4)}, {e.location.lng.toFixed(4)}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-between items-end gap-4">
                                            <div className={cn(
                                                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                                e.status === 'pending' ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                            )}>
                                                {e.status}
                                            </div>

                                            {e.status === 'pending' ? (
                                                <button 
                                                    onClick={() => handleDispatch(e.id)}
                                                    className="px-8 py-4 rounded-2xl bg-destructive text-white font-black uppercase tracking-tighter flex items-center gap-2 hover:shadow-xl hover:shadow-destructive/30 transition-all hover:scale-105"
                                                >
                                                    <Ambulance className="w-5 h-5" />
                                                    Dispatch Ambulance
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-2 text-emerald-500 font-bold">
                                                    <CheckCircle2 className="w-5 h-5" />
                                                    Responder En Route
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Response Center Info */}
                <div className="space-y-6">
                    <div className="glass p-8 rounded-[2.5rem] border border-primary/10 bg-primary/5">
                        <h3 className="text-lg font-black uppercase tracking-tighter mb-4">Response Console</h3>
                        <p className="text-xs text-foreground/50 leading-relaxed mb-6">
                            Coordinate medical dispatch and track precise locations. All emergencies are logged for post-incident review.
                        </p>
                        <div className="space-y-3">
                            {[
                                { label: "Avail. Ambulances", val: "4", color: "text-emerald-500" },
                                { label: "On-Call OB/GYN", val: "2", color: "text-emerald-500" },
                                { label: "Avg. Dispatch Time", val: "45s", color: "text-primary" }
                            ].map((i) => (
                                <div key={i.label} className="flex justify-between items-center p-4 rounded-xl bg-white/50">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">{i.label}</span>
                                    <span className={cn("font-black", i.color)}>{i.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass p-8 rounded-[2.5rem] border border-primary/10">
                        <h3 className="text-lg font-black uppercase tracking-tighter mb-4">Dispatcher Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full py-4 rounded-xl border border-primary/20 text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 transition-all text-left px-6 flex items-center justify-between">
                                Broadcast Major Alert
                                <ArrowUpRight className="w-3 h-3" />
                            </button>
                            <button className="w-full py-4 rounded-xl border border-primary/20 text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 transition-all text-left px-6 flex items-center justify-between">
                                View Regional Density
                                <Map className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
      )}
    </div>
  );
}
