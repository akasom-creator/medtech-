"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart,
  Bell,
  CheckCircle,
  Database,
  FileText,
  Globe,
  Lock,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  Users,
  XCircle,
  MapPin,
  Ambulance,
  Phone,
  UserPlus,
  ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [stats, setStats] = useState({
    users: 14205,
    health: 99.9,
    requests: 24,
    concurrent: 12503
  });
  const [isHighLoad, setIsHighLoad] = useState(false);
  const [emergencies, setEmergencies] = useState<any[]>([]);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', region: 'Lagos' });
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [doctorsToVerify, setDoctorsToVerify] = useState([
    { id: '1', name: 'Dr. Sarah Miller', email: 'sarah.miller@medtech.com', licenseUrl: 'license-doc-001.pdf', specialization: 'OB/GYN', status: 'pending' },
    { id: '2', name: 'Dr. James Wilson', email: 'james.wilson@health.gov', licenseUrl: 'license-doc-002.pdf', specialization: 'Pediatrician', status: 'pending' },
    { id: '3', name: 'Dr. Amaka Okafor', email: 'amaka.o@medical.ng', licenseUrl: 'license-doc-003.pdf', specialization: 'Cardiologist', status: 'pending' }
  ]);

  const handleVerifyDoctor = (id: string, approve: boolean) => {
    setDoctorsToVerify(prev => prev.map(doc => 
        doc.id === id ? { ...doc, status: approve ? 'verified' : 'rejected' } : doc
    ));
    
    if (approve) {
        // In a real app, this would update the global user state/db
        // For the demo, we update the demo doctor's state in localStorage
        const drSarah = JSON.parse(localStorage.getItem('user_sarah_miller') || '{}');
        localStorage.setItem('user_sarah_miller', JSON.stringify({ ...drSarah, isVerified: true }));
        
        // Also update the current active user if it happens to be the doctor (for cross-tab)
        const currentUser = JSON.parse(localStorage.getItem('medtech_user') || '{}');
        if (currentUser.email === 'sarah.miller@medtech.com') {
            localStorage.setItem('medtech_user', JSON.stringify({ ...currentUser, isVerified: true }));
        }
        
        console.log(`Doctor ${id} verified`);
    }
  };

  // Simulating live data updates
  useEffect(() => {
    const loadEmergencies = () => {
      const data = JSON.parse(localStorage.getItem("active_emergencies") || "[]");
      setEmergencies(data);
    };

    loadEmergencies();
    window.addEventListener('storage', loadEmergencies);
    return () => window.removeEventListener('storage', loadEmergencies);
  }, []);
  // Simulating live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev: any) => ({
        users: prev.users + Math.floor(Math.random() * 3) - 1,
        health: isHighLoad 
          ? Math.max(85, Math.min(95, prev.health + (Math.random() * 0.5) - 0.25)) 
          : Math.max(98, Math.min(100, prev.health + (Math.random() * 0.2) - 0.1)),
        requests: Math.max(0, prev.requests + Math.floor(Math.random() * 2) - 1),
        concurrent: isHighLoad
          ? Math.max(5000000, Math.min(20000000, prev.concurrent + Math.floor(Math.random() * 1000000) - 500000))
          : Math.max(10000, prev.concurrent + Math.floor(Math.random() * 100) - 50)
      }));
    }, isHighLoad ? 1000 : 3000);
    return () => clearInterval(interval);
  }, [isHighLoad]);

  return (
    <div className={cn("space-y-8 transition-all duration-500", emergencyMode ? "grayscale-[0.5] contrast-125" : "")}>
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground flex items-center gap-3">
            <Shield className="w-10 h-10 text-primary" />
            Super Admin <span className="text-gradient">Control</span>
          </h1>
          <p className="text-foreground/60 text-lg mt-2 font-medium max-w-2xl">
            System Governance, Security Oversight & Global Configuration.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsHighLoad(!isHighLoad)}
            className={cn(
              "px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg",
              isHighLoad 
                ? "bg-amber-500 text-white animate-pulse shadow-amber-500/40" 
                : "bg-secondary text-primary hover:bg-primary/10"
            )}
          >
            <Activity className="w-5 h-5" />
            {isHighLoad ? "SIMULATING 20M" : "Simulate 20M Scale"}
          </button>
          <button 
            onClick={() => setEmergencyMode(!emergencyMode)}
            className={cn(
              "px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg",
              emergencyMode 
                ? "bg-destructive text-white animate-pulse shadow-destructive/40" 
                : "bg-secondary text-destructive hover:bg-destructive/10"
            )}
          >
            <AlertTriangle className="w-5 h-5" />
            {emergencyMode ? "DEACTIVATE EMERGENCY" : "Emergency Mode"}
          </button>
          <button 
            onClick={() => setActiveTab("audit")}
            className="px-6 py-3 rounded-xl bg-primary text-white font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            <FileText className="w-5 h-5" />
            Audit Logs
          </button>
        </div>
      </header>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Users", value: stats.users.toLocaleString(), change: "+12%", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Concurrent Now", value: stats.concurrent.toLocaleString(), change: "Live", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "System Health", value: stats.health.toFixed(1) + "%", change: "Stable", icon: ShieldCheck, color: "text-teal-500", bg: "bg-teal-500/10" },
          { label: "Security Alerts", value: emergencyMode ? "CRITICAL" : "0", change: "Secure", icon: Lock, color: emergencyMode ? "text-destructive" : "text-primary", bg: emergencyMode ? "bg-destructive/10" : "bg-primary/10" },
        ].map((stat) => (
          <div key={stat.label} className="glass p-6 rounded-[2rem] border border-primary/10 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-foreground/70 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-3xl font-black mt-1">{stat.value}</h3>
              <span className={cn("text-xs font-bold px-2 py-1 rounded-full mt-2 inline-block", stat.bg, stat.color)}>
                {stat.change}
              </span>
            </div>
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg)}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Tabs */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="lg:w-64 shrink-0 space-y-2">
            {[
              { id: "overview", label: "Overview", icon: BarChart },
              { id: "emergencies", label: "Global Emergency Monitor", icon: Bell },
              { id: "users", label: "User Governance", icon: Users },
              { id: "verification", label: "Verification", icon: CheckCircle },
              { id: "audit", label: "Audit Logs", icon: FileText },
              { id: "config", label: "System Config", icon: Settings },
              { id: "broadcast", label: "Broadcast", icon: Bell },
              { id: "security", label: "Security & Risk", icon: Lock },
              { id: "scaling", label: "Scaling", icon: BarChart },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full p-4 rounded-xl flex items-center gap-3 font-bold transition-all text-left",
                  activeTab === tab.id 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "hover:bg-primary/5 text-foreground/60"
                )}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
        </aside>

        {/* Tab Content */}
        <div className="flex-1 glass p-8 rounded-[2.5rem] border border-primary/10 min-h-[500px]">
          {activeTab === "overview" && (
            <div className="space-y-8">
                <section>
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Activity className="w-6 h-6 text-primary" />
                        Live System Metrics
                    </h3>
                    {/* Custom Animated Chart */}
                    <div className="h-64 rounded-3xl bg-secondary/30 p-6 flex items-end justify-between gap-2 border border-primary/5 relative overflow-hidden">
                        {[...Array(24)].map((_, i) => {
                             const height = Math.floor(Math.random() * (80 - 20) + 20);
                             return (
                                <motion.div
                                    key={i}
                                    initial={{ height: "0%" }}
                                    animate={{ height: `${height}%` }}
                                    transition={{ 
                                        duration: 0.5, 
                                        delay: i * 0.05,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        repeatDelay: Math.random() * 2
                                    }}
                                    className="w-full bg-primary/20 rounded-t-sm hover:bg-primary/40 transition-colors relative group"
                                >
                                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {height}% Load
                                    </div>
                                </motion.div>
                             )
                        })}
                        {/* Fake grid lines */}
                        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between py-6 px-6 opacity-10">
                            {[1,2,3,4].map(i => <div key={i} className="w-full h-px bg-foreground" />)}
                        </div>
                    </div>
                </section>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-secondary/20 border border-primary/5">
                        <h4 className="font-bold mb-4">Recent Activity</h4>
                         <div className="space-y-4">
                            {[
                                { text: "Admin User #442 suspended by SuperAdmin", time: "2m ago", type: "alert" },
                                { text: "New Doctor Verification Request: Dr. Alemu", time: "15m ago", type: "info" },
                                { text: "System Backup Completed Successfully", time: "1h ago", type: "success" }
                            ].map((log, i) => (
                                <div key={i} className="flex gap-3 text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                    <div>
                                        <div className="font-medium text-foreground/80">{log.text}</div>
                                        <div className="text-xs text-foreground/40">{log.time}</div>
                                    </div>
                                </div>
                            ))}
                         </div>
                    </div>
                    <div className="p-6 rounded-3xl bg-secondary/20 border border-primary/5">
                        <h4 className="font-bold mb-4">Regional Status</h4>
                        <div className="space-y-3">
                            {[
                                { region: "North America (East)", status: "Operational", lat: "24ms" },
                                { region: "Europe (Central)", status: "Operational", lat: "45ms" },
                                { region: "Asia Pacific", status: "High Load", lat: "120ms" }
                            ].map((r, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/50 border border-primary/5">
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-primary" />
                                        <span className="font-bold text-sm">{r.region}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs font-bold">
                                        <span className={cn(r.status === "High Load" ? "text-amber-500" : "text-emerald-500")}>{r.status}</span>
                                        <span className="opacity-50">{r.lat}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
          )}

          {activeTab === "audit" && (
            <div className="space-y-6">
                <header className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-black italic uppercase tracking-tighter italic">System <span className="text-gradient">Audit Logs</span>.</h1>
                        <p className="text-foreground/60">Comprehensive trace of application activity, security events, and system changes.</p>
                    </div>
                </header>
                <div className="glass p-8 rounded-[2rem] border border-primary/10">
                    <div className="font-mono text-sm space-y-3">
                        {[
                            { level: "INFO", msg: "Server started at port 3000", time: "10:00:01 AM", color: "bg-secondary/50 rounded-xl" },
                            { level: "WARN", msg: "High memory usage detected (88%)", time: "10:45:22 AM", color: "bg-amber-500/10 text-amber-600 rounded-xl" },
                            { level: "INFO", msg: "DB Connection established - Cluster: Region-WA-1", time: "11:02:15 AM", color: "bg-secondary/50 rounded-xl" },
                            { level: "SECURITY", msg: "New SuperAdmin Login: Admin_Root@0.1", time: "11:15:40 AM", color: "bg-primary/10 text-primary font-bold rounded-xl" },
                            { level: "INFO", msg: "Automatic cache flush successful", time: "11:30:00 AM", color: "bg-secondary/50 rounded-xl" },
                            { level: "SECURITY", msg: "Emergency Mode Toggled: OFF", time: "11:45:12 AM", color: "bg-emerald-500/10 text-emerald-600 rounded-xl" },
                            { level: "WARN", msg: "API Rate limit approach: User_Client_992", time: "12:05:33 PM", color: "bg-amber-500/10 text-amber-600 rounded-xl" },
                        ].map((log, i) => (
                            <div key={i} className={cn("p-4 flex flex-col md:flex-row justify-between gap-2", log.color)}>
                                <div className="flex items-center gap-3">
                                    <span className="font-black tracking-widest text-[10px] w-16">[{log.level}]</span>
                                    <span className="opacity-80 font-medium">{log.msg}</span>
                                </div>
                                <span className="opacity-40 text-[10px] font-black">{log.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          )}

          {activeTab === "emergencies" && (
            <div className="space-y-8">
                <header className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-black italic uppercase tracking-tighter italic text-destructive">Global <span className="text-gradient">Emergency Monitor</span>.</h1>
                        <p className="text-foreground/60">Real-time oversight of critical maternal health incidents and responder deployment.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="glass p-8 rounded-[3rem] border border-destructive/20 bg-destructive/5 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Activity className="w-5 h-5 text-destructive" />
                                Incident Density Map
                            </h3>
                            <span className="text-[10px] font-black uppercase tracking-widest bg-white/50 px-3 py-1 rounded-full border border-primary/10">Live Satellite View</span>
                        </div>
                        
                        {/* Simulated Map */}
                        <div className="aspect-video bg-secondary/50 rounded-3xl relative border border-primary/10 overflow-hidden flex items-center justify-center group">
                            <MapPin className="w-32 h-32 text-primary opacity-5" />
                            {emergencies.map((e, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute"
                                    style={{ 
                                        top: `${20 + (i * 15)}%`, 
                                        left: `${30 + (i * 20)}%` 
                                    }}
                                >
                                    <div className="relative">
                                        <div className="w-4 h-4 bg-destructive rounded-full" />
                                        <div className="absolute inset-0 bg-destructive rounded-full animate-ping opacity-75" />
                                        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] font-black px-2 py-1 rounded whitespace-nowrap uppercase tracking-tighter">
                                            {e.patientName} - {e.status}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="glass p-8 rounded-[3rem] border border-primary/10">
                            <h3 className="text-lg font-black uppercase tracking-tighter mb-4">Response Performance</h3>
                            <div className="space-y-4">
                                {[
                                    { label: "Avg. Dispatch Time", val: "42s", trend: "-12%" },
                                    { label: "Ambulance Utilization", val: "65%", trend: "Optimal" },
                                    { label: "Patient Outcome Rate", val: "99.8%", trend: "Target Met" }
                                ].map((s, i) => (
                                    <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-secondary/30">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">{s.label}</span>
                                        <div className="text-right">
                                            <div className="font-black">{s.val}</div>
                                            <div className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">{s.trend}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="premium-gradient p-8 rounded-[3rem] text-white space-y-4">
                             <div className="flex items-center gap-3">
                                <Ambulance className="w-8 h-8 opacity-50" />
                                <h3 className="text-xl font-black uppercase tracking-tighter">Emergency Protocol</h3>
                             </div>
                             <p className="text-sm font-medium opacity-80">
                                Current alert level is <span className="font-black underline">ELEVATED</span>. Multiple maternal transfers detected in West Region.
                             </p>
                             <button className="w-full py-4 rounded-2xl bg-white text-destructive font-black uppercase tracking-tighter text-sm">
                                View Full Incident Log
                             </button>
                        </div>
                    </div>
                </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter">Admin <span className="text-gradient">Provisioning</span>.</h3>
                        <p className="text-foreground/50 text-sm font-medium">Exclusive console for system administrator onboarding.</p>
                    </div>
                    {!isAddingAdmin && (
                        <button 
                            onClick={() => setIsAddingAdmin(true)}
                            className="px-6 py-3 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-tighter hover:shadow-xl hover:shadow-primary/20 transition-all flex items-center gap-2"
                        >
                            <UserPlus className="w-5 h-5" /> Provision New Admin
                        </button>
                    )}
                </div>

                <AnimatePresence>
                    {isAddingAdmin && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="glass p-8 rounded-[3rem] border border-primary/20 bg-primary/5 overflow-hidden"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 px-2">Full Name</label>
                                    <input 
                                        type="text" 
                                        value={newAdmin.name}
                                        onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                                        className="w-full bg-white/50 border border-primary/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                                        placeholder="e.g. Victor Okafor"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 px-2">Work Email</label>
                                    <input 
                                        type="email" 
                                        value={newAdmin.email}
                                        onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                                        className="w-full bg-white/50 border border-primary/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                                        placeholder="victor@medtech.gov"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 px-2">Assigned Region</label>
                                    <select 
                                        value={newAdmin.region}
                                        onChange={(e) => setNewAdmin({...newAdmin, region: e.target.value})}
                                        className="w-full bg-white/50 border border-primary/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20 font-bold appearance-none cursor-pointer"
                                    >
                                        <option>Lagos</option>
                                        <option>Abuja</option>
                                        <option>Kano</option>
                                        <option>Rivers</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-4 mt-8">
                                <button 
                                    className="px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-tighter text-sm flex items-center gap-2 hover:shadow-xl hover:shadow-primary/30 transition-all"
                                    onClick={() => {
                                        setIsAddingAdmin(false);
                                        setNewAdmin({ name: '', email: '', region: 'Lagos' });
                                    }}
                                >
                                    Confirm Account Provisioning
                                </button>
                                <button 
                                    onClick={() => setIsAddingAdmin(false)}
                                    className="px-8 py-4 glass border border-primary/10 rounded-2xl font-black uppercase tracking-tighter text-sm opacity-50 hover:opacity-100"
                                >
                                    Abort
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="overflow-hidden rounded-[2.5rem] border border-primary/10">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-secondary/50 font-black text-foreground/30 uppercase text-[10px] tracking-widest">
                            <tr>
                                <th className="p-6">Administrator Name</th>
                                <th className="p-6">Role & Scope</th>
                                <th className="p-6">Access Status</th>
                                <th className="p-6 text-right">Protocol</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/5 bg-white/50">
                            {[
                                { name: "Sarah Connor", role: "Regional Admin", status: "Active" },
                                { name: "John Smith", role: "Audit Admin", status: "Active" },
                                { name: "David Miller", role: "Support Admin", status: "Suspended" }
                            ].map((user, i) => (
                                <tr key={i} className="group hover:bg-primary/5 transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary text-[10px]">
                                                {user.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <span className="font-black italic uppercase tracking-tighter">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className="text-[10px] font-bold uppercase opacity-60 tracking-wider bg-secondary/30 px-3 py-1 rounded-full">{user.role}</span>
                                    </td>
                                    <td className="p-6">
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                            user.status === "Active" ? "bg-emerald-500/10 text-emerald-600" : "bg-destructive/10 text-destructive"
                                        )}>
                                            <div className={cn("w-1.5 h-1.5 rounded-full", user.status === "Active" ? "bg-emerald-500" : "bg-destructive")} />
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline opacity-40 group-hover:opacity-100 transition-opacity">Override Permissions</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          )}

          {activeTab === "verification" && (
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter">Medical <span className="text-gradient">Verification</span>.</h3>
                        <p className="text-foreground/50 text-sm font-medium">Review credentials and grant practice licenses.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {doctorsToVerify.filter(d => d.status === 'pending').length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-secondary/10 rounded-[3rem] border border-dashed border-primary/20">
                            <CheckCircle className="w-12 h-12 text-primary/20 mb-4" />
                            <p className="text-sm font-bold opacity-40 uppercase tracking-widest">All credentials cleared</p>
                        </div>
                    ) : (
                        doctorsToVerify.filter(d => d.status === 'pending').map((doc) => (
                            <motion.div 
                                key={doc.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass p-8 rounded-[3rem] border border-primary/10 bg-white/50 group hover:border-primary/30 transition-all"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center font-black text-primary text-xl">
                                            {doc.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black italic uppercase tracking-tighter">{doc.name}</h4>
                                            <p className="text-xs font-bold text-primary mb-1">{doc.specialization}</p>
                                            <p className="text-[10px] text-foreground/40 font-black uppercase tracking-widest">{doc.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex-1 max-w-md">
                                        <div className="p-4 bg-secondary/30 rounded-2xl border border-primary/5 flex items-center justify-between group-hover:bg-primary/5 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                    <FileText className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Medical License</p>
                                                    <p className="text-sm font-bold truncate">{doc.licenseUrl}</p>
                                                </div>
                                            </div>
                                            <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Preview</button>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => handleVerifyDoctor(doc.id, true)}
                                            className="px-6 py-3 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:shadow-xl hover:shadow-emerald-500/20 transition-all flex items-center gap-2"
                                        >
                                            <CheckCircle className="w-4 h-4" /> Approve
                                        </button>
                                        <button 
                                            onClick={() => handleVerifyDoctor(doc.id, false)}
                                            className="px-6 py-3 bg-destructive/10 text-destructive rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-destructive/20 transition-all flex items-center gap-2"
                                        >
                                            <XCircle className="w-4 h-4" /> Reject
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {doctorsToVerify.filter(d => d.status !== 'pending').length > 0 && (
                    <div className="pt-8 border-t border-primary/5">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-6">Recent Actions</h4>
                        <div className="space-y-4">
                            {doctorsToVerify.filter(d => d.status !== 'pending').map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between p-4 bg-secondary/10 rounded-2xl opacity-60">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("w-2 h-2 rounded-full", doc.status === 'verified' ? "bg-emerald-500" : "bg-destructive")} />
                                        <span className="text-sm font-bold uppercase tracking-tight">{doc.name}</span>
                                    </div>
                                    <span className={cn("text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full", doc.status === 'verified' ? "bg-emerald-500/10 text-emerald-600" : "bg-destructive/10 text-destructive")}>
                                        {doc.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
          )}

          {activeTab === "config" && (
            <div className="space-y-6">
                <h3 className="text-xl font-bold mb-6">Global Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section className="glass p-8 rounded-[3rem] border border-primary/10">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Users className="w-6 h-6 text-primary" />
                            Admin Management (3 Active)
                        </h3>
                        <div className="space-y-4">
                            {[
                                { name: "System Admin Alpha", email: "alpha@medtech.com", status: "Online" },
                                { name: "Audit Admin Beta", email: "beta@medtech.com", status: "Away" },
                                { name: "Support Admin Gamma", email: "gamma@medtech.com", status: "Online" }
                            ].map((admin) => (
                                <div key={admin.email} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                                            {admin.name[0]}
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">{admin.name}</div>
                                            <div className="text-[10px] text-foreground/40 uppercase tracking-wider">{admin.email}</div>
                                        </div>
                                    </div>
                                    <div className={cn("text-[10px] font-bold uppercase", admin.status === 'Online' ? 'text-emerald-500' : 'text-amber-500')}>
                                        {admin.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section className="glass p-8 rounded-[3rem] border border-primary/10">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                             <Database className="w-6 h-6 text-primary" />
                             Latest Activity
                        </h3>
                        <div className="space-y-4">
                            {[
                                { user: "Admin Alpha", action: "Approved 12 Doctors", time: "2 min ago" },
                                { user: "System", action: "Auto-backup successful", time: "1 hour ago" },
                                { user: "Admin Gamma", action: "Flagged Risk #402", time: "3 hours ago" },
                            ].map((log, i) => (
                                <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-primary/5 last:border-0">
                                    <div>
                                        <span className="font-bold">{log.user}</span>
                                        <span className="text-foreground/50 ml-2">{log.action}</span>
                                    </div>
                                    <div className="text-[10px] text-foreground/30 font-bold uppercase whitespace-nowrap">{log.time}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <div className="p-6 rounded-3xl border-2 border-primary/10 space-y-6">
                        <h4 className="font-bold flex items-center gap-2">
                            <Database className="w-5 h-5 text-primary" />
                            Feature Toggles
                        </h4>
                        {[
                            { label: "AI Triage System", desc: "Enable automated urgency classification", active: true },
                            { label: "Video Consultations", desc: "Allow P2P video calls via Jitsi", active: true },
                            { label: "Community Circles", desc: "Public patient support groups", active: false }
                        ].map((toggle, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-sm">{toggle.label}</div>
                                    <div className="text-xs text-foreground/50">{toggle.desc}</div>
                                </div>
                                <div className={cn(
                                    "w-12 h-6 rounded-full p-1 transition-colors cursor-pointer",
                                    toggle.active ? "bg-primary" : "bg-slate-200 dark:bg-slate-800"
                                )}>
                                    <div className={cn(
                                        "w-4 h-4 rounded-full bg-white shadow-sm transition-transform",
                                        toggle.active ? "translate-x-6" : ""
                                    )} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 rounded-3xl border-2 border-destructive/10 bg-destructive/5 space-y-6">
                         <h4 className="font-bold flex items-center gap-2 text-destructive">
                            <AlertTriangle className="w-5 h-5" />
                            Risk Controls
                        </h4>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold uppercase text-destructive/70 block mb-2">Max Login Attempts</label>
                                <select className="w-full bg-white rounded-xl border border-destructive/20 p-2 text-sm font-bold">
                                    <option>3 Attempts (Strict)</option>
                                    <option>5 Attempts (Standard)</option>
                                    <option>10 Attempts (Lax)</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase text-destructive/70 block mb-2">Session Timeout</label>
                                <select className="w-full bg-white rounded-xl border border-destructive/20 p-2 text-sm font-bold">
                                    <option>15 Minutes</option>
                                    <option>30 Minutes</option>
                                    <option>1 Hour</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          )}
          {activeTab === "broadcast" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="glass p-8 rounded-[3rem] border border-primary/10">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4 text-destructive">Global <span className="text-gradient">Broadcast</span>.</h3>
                <p className="text-foreground/50 mb-8">Send an instantaneous emergency alert to all 20,000,000+ connected devices across the network.</p>
                
                <div className="space-y-6 max-w-2xl">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest opacity-50">Broadcast Message</label>
                    <textarea 
                      placeholder="Enter medical alert or emergency instruction..."
                      className="w-full h-32 bg-secondary/30 border border-primary/10 rounded-2xl p-4 font-medium focus:ring-2 focus:ring-destructive/20 outline-none transition-all"
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-1 p-4 rounded-xl bg-destructive/5 border border-destructive/10 flex items-center gap-3">
                        <AlertTriangle className="w-6 h-6 text-destructive" />
                        <div className="text-xs leading-tight font-medium">
                            <span className="text-destructive font-bold block">CAUTION:</span>
                            This will override all active screens and trigger high-priority push notifications globally.
                        </div>
                    </div>
                  </div>

                  <button className="w-full py-4 rounded-2xl bg-destructive text-white font-black uppercase tracking-tighter flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-destructive/40 transition-all active:scale-95">
                    <Bell className="w-5 h-5" />
                    INITIATE GLOBAL BROADCAST
                  </button>
                </div>
              </div>

              <div className="glass p-8 rounded-[3rem] border border-primary/10">
                <h4 className="font-bold mb-4">Propagation Stats</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Push Nodes", val: "10/10 Online" },
                        { label: "Est. Latency", val: "140ms" },
                        { label: "Avg Delivery", val: "0.8s" },
                        { label: "Ack Rate", val: "99.8%" }
                    ].map((s, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-secondary/20 border border-primary/5">
                            <div className="text-[10px] font-black uppercase tracking-wider opacity-70 mb-1">{s.label}</div>
                            <div className="font-bold">{s.val}</div>
                        </div>
                    ))}
                </div>
              </div>
            </motion.div>
          )}
          {activeTab === "scaling" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="glass p-8 rounded-[3rem] border border-primary/10">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4">Scale Ready <span className="text-gradient">Infrastructure</span>.</h3>
                <p className="text-foreground/70 mb-8">This application is architected for mass concurrency (20M+ users). Here is your current deployment status.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { id: 1, label: "Edge Propagation", status: "Global", value: "92 Nodes", icon: Globe, color: "text-blue-500" },
                    { id: 2, label: "Database Scaling", status: "Sharded", value: "4 Clusters", icon: Database, color: "text-emerald-500" },
                    { id: 3, label: "Load Balancers", status: "Active", value: "12 Instances", icon: Activity, color: "text-amber-500" }
                  ].map((item) => (
                    <div key={item.id} className="p-6 rounded-[2rem] bg-secondary/20 border border-primary/5">
                      <item.icon className={cn("w-8 h-8 mb-4", item.color)} />
                      <div className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">{item.label}</div>
                      <div className="text-2xl font-black">{item.value}</div>
                      <div className="text-[10px] uppercase font-bold text-emerald-500 mt-2">{item.status}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-6 rounded-[2rem] bg-primary/5 border border-primary/10">
                  <h4 className="font-bold flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-primary" />
                    Performance Strategy
                  </h4>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    Currently utilizing <strong>Next.js Incremental Static Regeneration (ISR)</strong> and <strong>Vercel Edge Functions</strong>. 
                    Database orchestration is handled via <strong>Prisma Accelerate</strong> for sub-10ms query times at the edge. 
                    For 20M concurrent users, ensure the <strong>Redis Cache Layer</strong> is set to Cluster Mode.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
