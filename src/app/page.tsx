"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, MessageSquare, Shield, Activity, BookOpen, Bell, CheckCircle2, Star, Quote, Heart, Users, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const features = [
  {
    name: "Appointment Booking",
    description: "Schedule consultations with top specialists from the comfort of your home.",
    icon: Calendar,
    color: "bg-blue-500",
    href: "/appointments"
  },
  {
    name: "Maternal Tracker",
    description: "Monitor your pregnancy journey with personalized tips and health tracking.",
    icon: Activity,
    color: "bg-emerald-500",
    href: "/maternal-tracker"
  },
  {
    name: "Real-time Consultation",
    description: "Chat with online doctors instantly and share symptoms securely.",
    icon: MessageSquare,
    color: "bg-purple-500",
    href: "/consultation"
  },
  {
    name: "Resource Library",
    description: "Access a wealth of verified medical articles and wellness guides.",
    icon: BookOpen,
    color: "bg-amber-500",
    href: "/resources"
  }
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-primary/5 to-transparent -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2 space-y-8 text-center lg:text-left"
            >
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                <Shield className="w-4 h-4" />
                <span>Next-Gen Maternal Healthcare</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight">
                Your Health Journey, <br />
                <span className="text-gradient">Elevated & Informed.</span>
              </h1>
              
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto lg:mx-0">
                A premium hospital solution designed for modern maternal care. 
                Experience seamless communication, expert tracking, and instant support 
                for every stage of your journey.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link 
                  href="/maternal-tracker" 
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-primary text-white font-bold text-lg hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center space-x-2Premium Hero section with animations."
                >
                  <span>Start Journey</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="/consultation" 
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl glass border border-primary/20 text-foreground font-bold text-lg hover:bg-primary/5 transition-all text-center"
                >
                  Consult a Doctor
                </Link>
              </div>

              <div className="flex items-center justify-center lg:justify-start space-x-8 pt-8 opacity-60">
                <div className="text-center">
                  <div className="text-2xl font-bold">10k+</div>
                  <div className="text-xs uppercase tracking-wider">Patients</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-xs uppercase tracking-wider">Doctors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-xs uppercase tracking-wider">Support</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-16 lg:mt-0 lg:w-1/2 relative"
            >
              <div className="relative z-10 w-full aspect-square max-w-[500px] mx-auto overflow-hidden rounded-[3rem] shadow-2xl shadow-primary/20 border-8 border-white/50 dark:border-white/10">
                <Image 
                  src="/hero.png" 
                  alt="Maternal Health" 
                  fill 
                  className="object-cover"
                />
              </div>
              {/* Floating Cards */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-5 md:right-0 glass p-4 rounded-2xl shadow-xl z-20 border border-primary/20"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <div className="text-xs text-foreground/50">Heart Rate</div>
                    <div className="font-bold">110 BPM</div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-10 -left-5 md:left-0 glass p-4 rounded-2xl shadow-xl z-20 border border-primary/20"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-xs text-foreground/50">Next Checkup</div>
                    <div className="font-bold">Tomorrow, 10:00 AM</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Emergency Section CTA */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/emergency" className="block group">
            <div className="relative overflow-hidden rounded-[2rem] bg-destructive p-8 md:p-12 text-white shadow-2xl shadow-destructive/20 group-hover:scale-[1.01] transition-all">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <Bell className="w-32 h-32" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-5xl font-black">EMERGENCY DASHBOARD</h2>
                  <p className="text-white/80 text-lg max-w-xl">
                    Immediate access to on-call doctors and emergency triage. 
                    If you are experiencing critical symptoms, click here now.
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="px-6 py-3 rounded-xl bg-white text-destructive font-black text-lg group-hover:px-8 transition-all">
                    GET HELP NOW
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-secondary/30 relative">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-background to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">
              Comprehensive <span className="text-gradient">Care</span>.
            </h2>
            <p className="text-foreground/60 max-w-2xl mx-auto font-medium">
              Everything you need to manage your healthcare journey in one elegant platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Link 
                  href={feature.href}
                  className="block group h-full glass p-8 rounded-[2rem] border border-primary/5 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all"
                >
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg", feature.color)}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.name}</h3>
                  <p className="text-foreground/60 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners / Trust Section */}
      <section className="py-16 border-y border-primary/5 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 mb-10">Trusted by leading medical institutions worldwide</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
             {["Mayo Clinic", "Cleveland Clinic", "Johns Hopkins", "Mount Sinai", "Mass General", "Stanford Health"].map((partner) => (
               <div key={partner} className="text-center font-black text-xl italic tracking-tighter">{partner}</div>
             ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">
              The <span className="text-gradient">MedTech</span> Way.
            </h2>
            <p className="text-foreground/50 max-w-xl mx-auto font-medium">Simple, secure, and expert-led healthcare in three easy steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                step: "01", 
                title: "Personalised Onboarding", 
                desc: "Describe your health profile and sync your current maternal progress.",
                icon: Users
              },
              { 
                step: "02", 
                title: "Expert Triage & Tracking", 
                desc: "Use AI-backed tools for immediate insight or connect with live specialists.",
                icon: Heart
              },
              { 
                step: "03", 
                title: "Data-Driven Wellness", 
                desc: "Access tailored insights and community circles to ensure a safe journey.",
                icon: Globe
              }
            ].map((item, idx) => (
              <motion.div 
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                className="relative p-10 rounded-[3rem] glass border border-primary/10 space-y-6"
              >
                <div className="absolute -top-6 -right-6 text-8xl font-black text-primary/5 italic select-none">{item.step}</div>
                <div className="w-16 h-16 rounded-2xl premium-gradient flex items-center justify-center text-white shadow-xl shadow-primary/20">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold">{item.title}</h3>
                <p className="text-foreground/50 text-sm leading-relaxed">{item.desc}</p>
                <div className="flex items-center gap-2 text-primary font-bold text-xs">
                  LEARN MORE <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-primary/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:gap-20">
            <div className="lg:w-1/3 space-y-6 mb-16 lg:mb-0">
              <div className="w-16 h-1 bg-primary rounded-full" />
              <h2 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter leading-none">
                Mothers <span className="text-gradient">Trust</span> Us.
              </h2>
              <p className="text-foreground/50 text-lg">
                Joining a community of over 10,000 thriving mothers and healthy babies.
              </p>
              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-3">
                  {["SO", "EK", "MJ", "AB"].map((initials, i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white dark:border-slate-900 bg-secondary flex items-center justify-center font-bold text-xs text-primary shadow-sm">
                      {initials}
                    </div>
                  ))}
                </div>
                <div className="text-sm font-bold">4.9/5 Rating</div>
              </div>
            </div>

            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { name: "Sarah O.", role: "3rd Trimester", text: "MedTech has completely changed how I manage my appointments. The AI triage is a lifesaver for late-night worries." },
                { name: "Emily K.", role: "New Mother", text: "The community circles provided the support I couldn't find anywhere else. I never felt alone in my journey." }
              ].map((t, i) => (
                <div key={i} className="glass p-8 rounded-[2.5rem] border border-primary/10 relative">
                  <Quote className="absolute top-8 right-8 w-12 h-12 text-primary/5" />
                  <div className="flex gap-1 mb-6">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-lg font-medium italic mb-8">"{t.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl premium-gradient" />
                    <div>
                      <div className="font-bold">{t.name}</div>
                      <div className="text-xs text-foreground/40 font-bold uppercase tracking-widest">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-40 relative overflow-hidden">
        <div className="absolute inset-0 premium-gradient opacity-[0.03] -z-10" />
        <div className="max-w-5xl mx-auto px-4 text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9]">
              Ready to <span className="text-gradient">Prioritize</span> <br /> Your Health?
            </h2>
            <p className="text-xl text-foreground/60 max-w-2xl mx-auto leading-relaxed">
              Join thousands of mothers experiencing a new standard of personalized, 
              AI-enhanced medical care. Secure your future today.
            </p>
          </motion.div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/maternal-tracker" 
              className="w-full sm:w-auto px-12 py-5 rounded-2xl bg-primary text-white font-black text-xl hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-tighter"
            >
              Get Started Now
              <ArrowRight className="w-6 h-6" />
            </Link>
            <Link 
              href="/resources" 
              className="w-full sm:w-auto px-12 py-5 rounded-2xl glass border border-primary/20 text-foreground font-black text-xl hover:bg-primary/5 hover:scale-105 active:scale-95 transition-all text-center uppercase tracking-tighter"
            >
              Learn More
            </Link>
          </div>
          
          <div className="flex items-center justify-center gap-8 pt-12 grayscale opacity-50">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
              <CheckCircle2 className="w-4 h-4 text-primary" /> SECURE DATA
            </div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
              <CheckCircle2 className="w-4 h-4 text-primary" /> EXPERT VERIFIED
            </div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
              <CheckCircle2 className="w-4 h-4 text-primary" /> 24/7 SUPPORT
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
