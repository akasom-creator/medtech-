import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/layout/PageTransition";
import { NotificationProvider } from "@/components/layout/NotificationProvider";
import { AuthProvider } from "@/context/AuthContext";
import PushPermissionManager from "@/components/features/PushPermissionManager";
import AICompanion from "@/components/features/AICompanion";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MedTech | Maternal Health & Hospital Solution",
  description: "A comprehensive platform for maternal health tracking, appointment booking, and real-time medical consultation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background`}
      >
        <AuthProvider>
          <NotificationProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <PushPermissionManager />
              <main className="flex-1 pt-24 flex flex-col">
                <PageTransition>
                  {children}
                </PageTransition>
                <Footer />
              </main>
              <AICompanion />
            </div>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
