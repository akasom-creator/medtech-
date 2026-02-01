"use client";

import { motion } from "framer-motion";
import { 
  Heart, 
  User, 
  Stethoscope, 
  ShieldCheck, 
  ArrowRight,
  Mail,
  Lock,
  Github,
  ShieldAlert,
  Clock
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'patient' | 'doctor' | 'admin' | 'super_admin'>('patient');
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  
  const { login, isLocked } = useAuth();
  const router = useRouter();
  const [cooldown, setCooldown] = useState(300);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLocked && cooldown > 0) {
      timer = setInterval(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLocked, cooldown]);

  const handleDemoLogin = (role: 'patient' | 'doctor' | 'admin' | 'super_admin') => {
    const demoData = {
      name: role === 'patient' ? "Alex Johnson" : 
            role === 'doctor' ? "Dr. Sarah Miller" : 
            role === 'admin' ? "System Admin" : "Global Controller",
      specialization: role === 'doctor' ? "Obstetrician & Gynecologist" : undefined,
      emergencyContact: role === 'patient' ? "John Johnson (+234 802 000 0000)" : undefined,
      profilePicture: role === 'doctor' ? "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200" : undefined,
      isVerified: role === 'doctor' // Auto-verify demo doctor
    };
    login(role, demoData);
    router.push("/dashboard");
  };

  const handleRegister = () => {
    login(role, { 
      name, 
      specialization: role === 'doctor' ? specialization : undefined,
      emergencyContact: role === 'patient' ? emergencyContact : undefined,
      isVerified: false
    });
    router.push("/dashboard");
  };

  if (isLocked) {
    return (
      <div className="min-h-screen bg-destructive/5 flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full glass p-12 rounded-[3.5rem] border-2 border-destructive/20 text-center space-y-8"
        >
          <div className="w-24 h-24 bg-destructive/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-12 h-12 text-destructive" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black uppercase tracking-tighter text-destructive leading-none">System Lockdown</h1>
            <p className="text-foreground/60 font-medium text-sm">Multiple sessions detected for Super Admin accounts. Protocol <span className="font-bold text-destructive">SIGMA</span> initiated.</p>
          </div>
          
          <div className="p-8 bg-destructive/5 rounded-[2.5rem] border border-destructive/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-destructive/10">
               <motion.div 
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 300, ease: "linear" }}
                  className="h-full bg-destructive"
               />
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-destructive/50 mb-2">Cooldown Remaining</div>
            <div className="text-5xl font-mono font-black text-destructive tracking-tighter">
              {Math.floor(cooldown / 60)}:{String(cooldown % 60).padStart(2, '0')}
            </div>
          </div>

          <div className="flex items-center gap-2 p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10 text-amber-600">
             <Clock className="w-4 h-4 shrink-0" />
             <p className="text-[10px] font-black uppercase tracking-[0.1em] text-left leading-relaxed">
               System resets automatically after cooldown. Manual overrides disabled.
             </p>
          </div>
          
          {cooldown === 0 && (
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-tighter hover:shadow-xl transition-all shadow-lg shadow-primary/20 active:scale-95"
            >
              Reset Terminal
            </button>
          )}

          <p className="text-[10px] font-black uppercase tracking-widest opacity-30">
            IP: 192.168.1.XXX // ACCESS: DENIED
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-12 pb-24 px-4 bg-secondary/10 flex items-center justify-center">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Auth Form */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass p-8 md:p-12 rounded-[3rem] border border-primary/10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Heart className="w-32 h-32 text-primary" />
          </div>

          <div className="relative z-10 space-y-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-black italic uppercase tracking-tighter italic">
                {isLogin ? "Welcome Back" : "Create Account"}.
              </h1>
              <p className="text-foreground/50 font-medium">
                {isLogin ? "The next-gen maternal health portal awaits." : "Join the future of maternal care today."}
              </p>
            </div>

            <div className="space-y-4">
              {!isLogin && (
                <div className="flex bg-secondary/30 p-1 rounded-xl border border-primary/5 mb-6">
                  {(['patient', 'doctor'] as const).map((r) => (
                    <button 
                      key={r}
                      onClick={() => setRole(r)}
                      className={cn(
                        "flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                        role === r ? "bg-primary text-white shadow-lg" : "text-foreground/40 hover:text-foreground"
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/30" />
                <input 
                  type="email" 
                  placeholder="Email Address"
                  className="w-full bg-white/50 dark:bg-slate-900/50 border border-primary/10 rounded-2xl px-12 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/30" />
                <input 
                  type="password" 
                  placeholder="Password"
                  className="w-full bg-white/50 dark:bg-slate-900/50 border border-primary/10 rounded-2xl px-12 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
              </div>
              {!isLogin && (
                <>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/30" />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full bg-white/50 dark:bg-slate-900/50 border border-primary/10 rounded-2xl px-12 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    />
                  </div>
                  {role === 'doctor' && (
                    <div className="relative">
                      <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/30" />
                      <input 
                        type="text" 
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        placeholder="Specialization (e.g. OB/GYN)"
                        className="w-full bg-white/50 dark:bg-slate-900/50 border border-primary/10 rounded-2xl px-12 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      />
                    </div>
                  )}
                  {role === 'patient' && (
                    <div className="relative">
                      <Heart className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/30" />
                      <input 
                        type="text" 
                        value={emergencyContact}
                        onChange={(e) => setEmergencyContact(e.target.value)}
                        placeholder="Emergency Contact (Name & Phone)"
                        className="w-full bg-white/50 dark:bg-slate-900/50 border border-primary/10 rounded-2xl px-12 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            <button 
              onClick={isLogin ? () => handleDemoLogin('patient') : handleRegister}
              className="w-full py-5 rounded-2xl bg-primary text-white font-black text-xl hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-3 active:scale-95 uppercase tracking-tighter"
            >
              {isLogin ? "Sign In" : "Register"}
              <ArrowRight className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4 py-2">
              <div className="h-px flex-1 bg-foreground/10" />
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Or Social</span>
              <div className="h-px flex-1 bg-foreground/10" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-4 rounded-2xl glass border border-primary/10 hover:bg-primary/5 transition-all font-bold text-sm">
                <Github className="w-5 h-5" /> GitHub
              </button>
              <button className="flex items-center justify-center gap-2 py-4 rounded-2xl glass border border-primary/10 hover:bg-primary/5 transition-all font-bold text-sm text-[#4285F4]">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-2.12 5.4-7.84 5.4-4.93 0-8.96-4.08-8.96-9.1s4.03-9.1 8.96-9.1c2.81 0 4.69 1.18 5.76 2.18L21 1.25c-2.18-2.03-5.22-3.25-9-3.25C5.06-2 0 2.94 0 9s5.06 11 11 11c6.26 0 10.42-4.41 10.42-10.63 0-.74-.08-1.3-.2-1.89l-.22-1.56h-8.52z"/></svg> 
                Google
              </button>
            </div>

            <p className="text-center text-sm font-medium">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-bold hover:underline"
              >
                {isLogin ? "Sign Up Free" : "Sign In"}
              </button>
            </p>
          </div>
        </motion.div>

        {/* Right Side: Demo Access Gate (THE REQUESTED FEATURE) */}
        <div className="space-y-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4 text-center lg:text-left"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-sm font-black border border-emerald-500/20 uppercase tracking-widest">
              <span>Demo Mode Active</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter">
              Bypass <span className="text-gradient">Backend</span>.
            </h2>
            <p className="text-foreground/50 text-lg max-w-lg lg:ml-0 mx-auto">
              Skip the signup process and explore the MedTech ecosystem as different user roles instantly.
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              { 
                role: 'patient', 
                title: 'Patient View', 
                desc: 'Track pregnancy, book appointments, and use AI triage.', 
                icon: Heart, 
                color: 'bg-primary' 
              },
              { 
                role: 'doctor', 
                title: 'Doctor View', 
                desc: 'Manage queues, perform consultations, and collaborate.', 
                icon: Stethoscope, 
                color: 'bg-emerald-500' 
              },
              { 
                role: 'admin', 
                title: 'Admin View', 
                desc: 'Monitor system health, regional data, and analytics.', 
                icon: ShieldCheck, 
                color: 'bg-indigo-500' 
              },
              { 
                role: 'super_admin', 
                title: 'Super Admin', 
                desc: 'Global control, security overrides, and compliance.', 
                icon: Lock, 
                color: 'bg-rose-600' 
              }
            ].map((demo, idx) => (
              <motion.button
                key={demo.role}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (idx * 0.1) }}
                onClick={() => handleDemoLogin(demo.role as any)}
                className="w-full flex items-center gap-6 p-6 rounded-[2rem] glass border border-primary/5 hover:border-primary/20 hover:bg-primary/5 transition-all group text-left shadow-lg"
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg", demo.color)}>
                  <demo.icon className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <div className="font-black italic uppercase tracking-tighter text-lg">{demo.title}</div>
                  <div className="text-xs text-foreground/50 font-medium">{demo.desc}</div>
                </div>
                <ArrowRight className="w-5 h-5 text-foreground/20 group-hover:text-primary transition-colors" />
              </motion.button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
