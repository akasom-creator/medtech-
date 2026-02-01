"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Role = 'patient' | 'doctor' | 'admin' | 'super_admin' | null;

export interface UserData {
  name?: string;
  email?: string;
  specialization?: string;
  emergencyContact?: string;
  profilePicture?: string;
  isVerified?: boolean;
  licenseUrl?: string;
}

interface AuthContextType {
  role: Role;
  userData: UserData | null;
  isAuthenticated: boolean;
  isLocked: boolean;
  login: (role: Role, data?: UserData) => void;
  updateUser: (data: UserData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [sessionID] = useState(() => Math.random().toString(36).substring(7));

  // Persistence and Security for demo purposes
  useEffect(() => {
    const savedRole = localStorage.getItem('medtech_role');
    const savedData = localStorage.getItem('medtech_user_data');
    const activeSession = localStorage.getItem('medtech_session');

    if (savedRole) {
      setRole(savedRole as Role);
      setIsAuthenticated(true);
      
      // Super Admin Single Session Check
      if (savedRole === 'super_admin' && activeSession && activeSession !== sessionID) {
        setIsLocked(true);
      }
    }
    if (savedData) {
      setUserData(JSON.parse(savedData));
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'medtech_session' && e.newValue !== sessionID && role === 'super_admin') {
        setIsLocked(true);
      }
      if (e.key === 'medtech_role' && !e.newValue) {
        logout();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [role, sessionID]);

  const login = (newRole: Role, data?: UserData) => {
    setRole(newRole);
    setIsAuthenticated(true);
    setIsLocked(false);
    
    if (newRole === 'super_admin') {
      localStorage.setItem('medtech_session', sessionID);
    }

    if (data) {
      setUserData(data);
      localStorage.setItem('medtech_user_data', JSON.stringify(data));
    }
    if (newRole) localStorage.setItem('medtech_role', newRole);
  };

  const updateUser = (data: UserData) => {
    const updatedData = { ...userData, ...data };
    setUserData(updatedData);
    localStorage.setItem('medtech_user_data', JSON.stringify(updatedData));
  };

  const logout = () => {
    setRole(null);
    setUserData(null);
    setIsAuthenticated(false);
    setIsLocked(false);
    localStorage.removeItem('medtech_role');
    localStorage.removeItem('medtech_user_data');
    localStorage.removeItem('medtech_session');
  };

  return (
    <AuthContext.Provider value={{ role, userData, isAuthenticated, isLocked, login, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
