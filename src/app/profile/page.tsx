"use client";

import { useState, useRef } from "react";
import { useAuth, UserData } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { 
  User, 
  Camera, 
  Mail, 
  Stethoscope, 
  Heart, 
  ShieldCheck, 
  Save, 
  ArrowLeft,
  Loader2,
  FileText,
  Upload,
  XCircle,
  CheckCircle
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { useNotifications } from "@/components/layout/NotificationProvider";

export default function ProfilePage() {
  const { role, userData, updateUser } = useAuth();
  const { notify } = useNotifications();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const licenseInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UserData>(userData || {});
  const [imagePreview, setImagePreview] = useState<string | null>(userData?.profilePicture || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData(prev => ({ ...prev, profilePicture: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLicenseUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mocking upload
      setFormData(prev => ({ 
        ...prev, 
        licenseUrl: "mock-license-url",
        isVerified: false 
      }));
      notify("info", "License Uploaded", "Our verification team will review your document shortly.");
    }
  };

  const handleSave = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    updateUser(formData);
    setLoading(false);
    setIsEditing(false);
    notify("success", "Profile Updated", "Your changes have been saved successfully.");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-secondary/5 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="flex items-center justify-between">
            <Link 
              href="/dashboard"
              className="flex items-center gap-2 text-foreground/50 hover:text-primary transition-colors font-bold uppercase tracking-widest text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">My <span className="text-gradient">Profile</span>.</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Sidebar: Profile Photo */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:col-span-1 space-y-6"
            >
              <div className="glass p-8 rounded-[3rem] border border-primary/10 flex flex-col items-center text-center space-y-4">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-3xl overflow-hidden bg-primary/10 border-2 border-primary/20 shadow-xl group-hover:scale-105 transition-transform">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-12 h-12 text-primary/40" />
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 p-3 bg-primary text-white rounded-2xl shadow-lg hover:scale-110 transition-all active:scale-95"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden" 
                    accept="image/*"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tighter uppercase">{userData?.name || "User Name"}</h2>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mt-2">
                    <ShieldCheck className="w-3 h-3" />
                    {role}
                  </div>
                </div>
              </div>

              <div className="glass p-6 rounded-[2.5rem] border border-primary/10">
                <h3 className="text-xs font-black uppercase tracking-widest opacity-40 mb-4">Security Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">Verified identity</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">Session token</span>
                    <span className="text-[10px] font-mono opacity-40">Active</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main: Details Form */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="md:col-span-2 space-y-8"
            >
              <div className="glass p-8 md:p-12 rounded-[3.5rem] border border-primary/10 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black uppercase tracking-tighter">Personal Information</h3>
                  {!isEditing && (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="text-xs font-black uppercase tracking-widest text-primary hover:underline"
                    >
                      Edit Details
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 px-2">Display Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                      <input 
                        type="text" 
                        value={formData.name || ""}
                        disabled={!isEditing}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-secondary/20 border border-primary/5 rounded-2xl px-12 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold disabled:opacity-70"
                      />
                    </div>
                  </div>

                  {/* Specialization (for Doctors) */}
                  {role === 'doctor' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 px-2">Medical Specialization</label>
                      <div className="relative">
                        <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                        <input 
                          type="text" 
                          value={formData.specialization || ""}
                          disabled={!isEditing}
                          onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                          className="w-full bg-secondary/20 border border-primary/5 rounded-2xl px-12 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold disabled:opacity-70"
                          placeholder="e.g. OB/GYN, Pediatrician"
                        />
                      </div>
                    </div>
                  )}

                  {/* Medical License (for Doctors) */}
                  {role === 'doctor' && (
                    <div className="space-y-4 pt-4">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 px-2">Medical License</label>
                        {formData.isVerified ? (
                          <span className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Verified
                          </span>
                        ) : (
                          <span className="text-[10px] font-black uppercase text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full flex items-center gap-1">
                            Pending Verification
                          </span>
                        )}
                      </div>
                      
                      <div className="glass p-6 rounded-3xl border border-primary/10 bg-secondary/10 relative group overflow-hidden">
                        {formData.licenseUrl ? (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-3 bg-primary/10 rounded-xl">
                                <FileText className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <div className="text-sm font-bold uppercase tracking-tight">license_document.pdf</div>
                                <div className="text-[10px] opacity-40 uppercase font-black">MIME: application/pdf</div>
                              </div>
                            </div>
                            <button 
                              onClick={() => isEditing && setFormData({ ...formData, licenseUrl: undefined, isVerified: false })}
                              disabled={!isEditing}
                              className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors disabled:opacity-0"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => isEditing && licenseInputRef.current?.click()}
                            disabled={!isEditing}
                            className="w-full py-8 border-2 border-dashed border-primary/20 rounded-2xl flex flex-col items-center gap-3 hover:border-primary/40 transition-all group-hover:bg-primary/5 disabled:opacity-50"
                          >
                            <Upload className="w-8 h-8 text-primary/40 group-hover:text-primary transition-colors" />
                            <div className="text-xs font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100 italic">Upload Medical License</div>
                          </button>
                        )}
                        <input 
                          type="file" 
                          ref={licenseInputRef}
                          onChange={handleLicenseUpload}
                          className="hidden" 
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                      </div>
                    </div>
                  )}

                  {/* Emergency Contact (for Patients) */}
                  {role === 'patient' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 px-2">Emergency Contact</label>
                      <div className="relative">
                        <Heart className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                        <input 
                          type="text" 
                          value={formData.emergencyContact || ""}
                          disabled={!isEditing}
                          onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                          className="w-full bg-secondary/20 border border-primary/5 rounded-2xl px-12 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold disabled:opacity-70"
                          placeholder="Name & Contact number"
                        />
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 px-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                      <input 
                        type="email" 
                        value={userData?.email || "user@medtech.com"}
                        disabled
                        className="w-full bg-secondary/10 border border-primary/5 rounded-2xl px-12 py-4 outline-none opacity-50 font-bold"
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-4 pt-4">
                    <button 
                      onClick={handleSave}
                      disabled={loading}
                      className="flex-1 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-tighter flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                      {loading ? "SAVING..." : "SAVE CHANGES"}
                    </button>
                    <button 
                      onClick={() => { setIsEditing(false); setFormData(userData || {}); }}
                      className="px-8 py-4 glass border border-primary/10 rounded-2xl font-black uppercase tracking-tighter opacity-50 hover:opacity-100 transition-opacity"
                    >
                      CANCEL
                    </button>
                  </div>
                )}
              </div>

              <div className="p-8 bg-primary/10 rounded-[3.5rem] border border-primary/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-24 h-24 text-primary" />
                </div>
                <h4 className="font-bold text-primary mb-2">Platform Governance</h4>
                <p className="text-sm text-foreground/60 leading-relaxed font-medium">
                  Your profile data is encrypted at rest and only accessible to verified medical personnel. 
                  View our privacy policy to learn more about how we handle your health records.
                </p>
              </div>

            </motion.div>

          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
