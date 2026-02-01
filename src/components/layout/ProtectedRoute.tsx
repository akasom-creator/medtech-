"use client";

import { useAuth, Role } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode, 
  allowedRoles?: Role[] 
}) {
  const { isAuthenticated, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (allowedRoles && role && !allowedRoles.includes(role)) {
      // Redirect to their intended dashboard if they try to access unauthorized pages
      router.push("/dashboard");
    }
  }, [isAuthenticated, role, allowedRoles, router]);

  if (!isAuthenticated || (allowedRoles && role && !allowedRoles.includes(role))) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
