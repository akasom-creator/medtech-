"use client";

import { motion } from "framer-motion";
import { 
  Heart, 
  Mail, 
  MapPin, 
  Phone, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative bg-[#030816] border-t border-white/5 pt-24 pb-12 w-full mt-auto text-white/90">
      {/* Subtle Background Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-20">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="flex items-center space-x-3 group w-fit">
              <div className="w-12 h-12 rounded-2xl premium-gradient flex items-center justify-center text-white shadow-xl shadow-primary/20 group-hover:rotate-12 transition-all duration-500">
                <Heart className="w-7 h-7" />
              </div>
              <span className="text-3xl font-black italic uppercase tracking-tighter text-white">
                Med<span className="text-primary">Tech</span>
              </span>
            </Link>
            <p className="text-white/40 text-base leading-relaxed max-w-sm">
              Empowering mothers and specialists with 
              <span className="text-primary font-bold transition-colors hover:text-primary/80"> Gemini 3 </span> 
              intelligence and real-time medical accessibility across Nigeria.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <motion.a 
                  key={i} 
                  href="#" 
                  whileHover={{ y: -5, scale: 1.1, backgroundColor: 'rgba(255,255,255,0.05)' }}
                  className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all shadow-sm"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Services</h3>
            <ul className="space-y-4">
              {[
                { label: "Maternal Tracker", href: "/maternal-tracker" },
                { label: "AI Consultation", href: "/consultation" },
                { label: "Health Insights", href: "/dashboard" },
                { label: "Emergency SOS", href: "/emergency" }
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-primary hover:pl-2 transition-all duration-300 flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Support</h3>
            <ul className="space-y-4">
              {[
                { label: "Contact Us", icon: MapPin },
                { label: "Direct Line", icon: Phone },
                { label: "Help Center", icon: Mail }
              ].map((item) => (
                <li key={item.label}>
                  <Link href="#" className="text-sm text-white/60 hover:text-primary flex items-center gap-3 transition-colors">
                    <item.icon className="w-4 h-4 opacity-30" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Card */}
          <div className="lg:col-span-4">
            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                <Mail className="w-16 h-16 text-primary" />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 bg-primary/20 rounded-lg text-[10px] font-black text-primary uppercase tracking-widest">
                    Newsletter
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-bold text-white/30 uppercase">AI Optimized</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white">Stay Healthy</h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  Join 2,000+ mothers getting Gemini-powered weekly wellness tips.
                </p>
                <div className="relative pt-2">
                  <input 
                    type="email" 
                    placeholder="name@email.com"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-white"
                  />
                  <button className="absolute right-2 bottom-2 w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-primary/20">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
              &copy; {new Date().getFullYear()} MedTech Maternal Systems
            </p>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[9px] font-black uppercase text-primary/60 tracking-widest">Built for Gemini 3 Hackathon</span>
            </div>
          </div>
          <div className="flex space-x-8">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <Link key={item} href="#" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-primary transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
