"use client";

import { useState, useEffect } from "react";
import PatientDashboard from "../../components/features/PatientDashboard";
import DoctorDashboard from "../../components/features/DoctorDashboard";
import AdminDashboard from "../../components/features/AdminDashboard";
import SuperAdminDashboard from "@/components/features/SuperAdminDashboard";
import PeerConsultation from "../../components/features/PeerConsultation";
import { Loader2 } from "lucide-react";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

// Role is managed globally in AuthContext

export default function DashboardPage() {
  const { role, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, router]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 pt-4 pb-12">
      {role === "patient" && (
        <ProtectedRoute allowedRoles={['patient']}>
          <PatientDashboard />
        </ProtectedRoute>
      )}
      {role === "doctor" && (
        <ProtectedRoute allowedRoles={['doctor']}>
          <DoctorDashboard />
        </ProtectedRoute>
      )}
      {role === "admin" && (
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      )}
      {role === "super_admin" && (
        <ProtectedRoute allowedRoles={['super_admin']}>
          <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <SuperAdminDashboard />
          </div>
        </ProtectedRoute>
      )}
    </div>
  );
}
