"use client";

import Link from "next/link";
import { Heart, Menu, X, Bell, User } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const navigation = [
  { name: "Home", href: "/" },
];

const patientNav = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Appointments", href: "/appointments" },
  { name: "Maternal Tracker", href: "/maternal-tracker" },
  { name: "Resources", href: "/resources" },
  { name: "Consultation", href: "/consultation" },
  { name: "Community", href: "/community" },
];

const doctorNav = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Appointments", href: "/appointments" },
  { name: "Patients", href: "/community" }, // Reusing community for now as patient list mockup
  { name: "Consultations", href: "/consultation" },
  { name: "Resources", href: "/resources" },
];

const adminNav = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "User Management", href: "/community" }, // Mock for admin
  { name: "System Logs", href: "/resources" }, // Mock for admin
];

const superAdminNav = [
  { name: "Control Center", href: "/dashboard" },
  { name: "Audit Logs", href: "/resources" },
  { name: "User Governance", href: "/community" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout, role, userData } = useAuth();
  
  const getNavItems = () => {
    switch(role) {
      case 'doctor': return doctorNav;
      case 'admin': return adminNav;
      case 'super_admin': return superAdminNav;
      default: return patientNav;
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-teal-600">
                MedTech
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
            {/* Protected Links for Desktop */}
            {isAuthenticated && navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}

            <button className="p-2 text-foreground/70 hover:text-primary transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </button>

            {isAuthenticated ? (
               <div className="flex items-center gap-6">
                 <Link 
                   href="/profile"
                   className="flex items-center gap-3 group"
                 >
                   <div className="hidden lg:block text-right">
                     <div className="text-[10px] font-black uppercase tracking-widest text-primary">{role}</div>
                     <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{userData?.name || "User"}</div>
                   </div>
                   <div className="w-10 h-10 rounded-xl overflow-hidden bg-primary/10 border border-primary/20 group-hover:scale-105 transition-transform shadow-lg shadow-primary/5">
                     {userData?.profilePicture ? (
                       <img src={userData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center">
                         <User className="w-5 h-5 text-primary/40" />
                       </div>
                     )}
                   </div>
                 </Link>
                 <button
                  onClick={logout}
                  className="px-5 py-2 rounded-full glass border border-primary/20 text-foreground text-sm font-semibold hover:bg-destructive hover:border-destructive hover:text-white transition-all active:scale-95"
                >
                  Sign Out
                </button>
               </div>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground/70 hover:text-primary"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-primary/10 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 transition-all"
                >
                  {item.name}
                </Link>
              ))}
              {isAuthenticated && navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 transition-all"
                >
                  {item.name}
                </Link>
              ))}
              
              {isAuthenticated ? (
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2 text-base font-semibold text-destructive"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-semibold text-primary"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
