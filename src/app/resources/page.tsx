"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen, Clock, ChevronRight, Filter, Play, FileText, Bookmark } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

const categories = ["All", "Nutrition", "Pre-natal", "Post-natal", "Mental Health", "Newborn Care"];

const articles = [
  {
    id: 1,
    title: "Essential Nutrients During Pregnancy",
    category: "Nutrition",
    readTime: "5 min read",
    description: "Learn about the vitamins and minerals that are crucial for your baby's development, including Folic Acid, Iron, and Vitamin D.",
    type: "Article"
  },
  {
    id: 2,
    title: "Preparing for Your Journey: Trimester 1",
    category: "Pre-natal",
    readTime: "8 min read",
    description: "What to expect during the first 12 weeks of your pregnancy. Tips on dealing with morning sickness and choosing your midwife.",
    type: "Guide"
  },
  {
    id: 3,
    title: "Mental Wellness for New Mothers",
    category: "Mental Health",
    readTime: "12 min read",
    description: "Coping with post-natal changes, understanding 'Baby Blues', and knowing when to seek professional help for postpartum depression.",
    type: "Article"
  },
  {
    id: 4,
    title: "Breastfeeding Basics for Beginners",
    category: "Newborn Care",
    readTime: "15 min video",
    description: "A comprehensive video guide on latching techniques, feeding schedules, and how to tell if your baby is getting enough milk.",
    type: "Video"
  },
  {
    id: 5,
    title: "Exercise Safely While Expecting",
    category: "Pre-natal",
    readTime: "6 min read",
    description: "Low-impact routines like prenatal yoga and swimming that keep you fit without stressing your body or the baby.",
    type: "Article"
  },
  {
    id: 6,
    title: "Balanced Diet: Month by Month",
    category: "Nutrition",
    readTime: "10 min read",
    description: "Adjusting your caloric intake and focusing on quality over quantity as your baby grows throughout the three trimesters.",
    type: "Guide"
  },
  {
    id: 7,
    title: "Sleep Hygiene for Better Rest",
    category: "Mental Health",
    readTime: "4 min read",
    description: "Strategies for finding comfortable sleeping positions and dealing with insomnia during the later stages of pregnancy.",
    type: "Article"
  },
  {
    id: 8,
    title: "Your Postpartum Recovery Plan",
    category: "Post-natal",
    readTime: "20 min guide",
    description: "Everything you need for the first 6 weeks at home: physical healing, emotional support, and newborn bonding.",
    type: "Guide"
  }
];

import { useAuth } from "@/context/AuthContext";

export default function ResourcesPage() {
  const { role } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  if (role === 'admin' || role === 'super_admin') {
    return (
      <ProtectedRoute>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <header className="mb-12">
            <h1 className="text-4xl font-bold mb-4">System Logs</h1>
            <p className="text-foreground/60">Monitor application activity and error reports.</p>
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
      </ProtectedRoute>
    );
  }

  const filteredArticles = articles.filter(art => {
    const matchesCategory = selectedCategory === "All" || art.category === selectedCategory;
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <ProtectedRoute>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-16 text-center space-y-6">
        <h1 className="text-4xl md:text-7xl font-black tracking-tight uppercase">
          Resource <span className="text-gradient">Library</span>
        </h1>
        <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
          Expert-verified articles, guides, and videos to support your maternal health journey.
        </p>
        
        <div className="relative max-w-2xl mx-auto pt-4">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-primary flex items-center justify-center pointer-events-none">
            <Search className="w-6 h-6" />
          </div>
          <input 
            type="text" 
            placeholder="Search for topics, symptoms, or guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-16 glass border border-primary/10 rounded-[2rem] pl-16 pr-8 text-lg focus:ring-4 focus:ring-primary/10 transition-all outline-none"
          />
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar: Filters */}
        <aside className="lg:w-64 space-y-8 shrink-0">
          <div>
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4 text-primary" />
              Categories
            </h3>
            <div className="flex flex-wrap lg:flex-col gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-semibold transition-all text-left",
                    selectedCategory === cat 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "bg-secondary text-foreground/60 hover:bg-primary/5"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="glass p-6 rounded-3xl border border-primary/5">
            <h3 className="font-bold mb-4">Trending Now</h3>
            <div className="space-y-4">
              {["First trimester checklist", "Healthy sleep positions"].map((tag) => (
                <div key={tag} className="text-sm font-medium text-primary hover:underline cursor-pointer flex items-center gap-2">
                  <Bookmark className="w-3 h-3" />
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Library Grid */}
        <section className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredArticles.map((article, idx) => (
                <motion.div
                  key={article.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="group flex flex-col glass p-6 rounded-[2.5rem] border border-primary/5 hover:border-primary/20 hover:shadow-2xl transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                      {article.category}
                    </span>
                    <div className="flex items-center gap-2 text-foreground/40 text-xs font-medium">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      {article.type === "Video" ? (
                        <Play className="w-4 h-4 text-primary" />
                      ) : (
                        <FileText className="w-4 h-4 text-primary" />
                      )}
                      <span className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em]">{article.type}</span>
                    </div>
                    <h2 className="text-xl font-bold group-hover:text-primary transition-colors leading-tight">
                      {article.title}
                    </h2>
                    <p className="text-sm text-foreground/60 leading-relaxed font-medium">
                      {article.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-6 border-t border-primary/5 flex items-center justify-between">
                    <span className="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read Full Article
                      <ChevronRight className="w-4 h-4" />
                    </span>
                    <button className="p-2 rounded-lg bg-secondary/50 hover:bg-primary/10 transition-colors">
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {filteredArticles.length === 0 && (
            <div className="text-center py-24 glass rounded-[3rem] border border-primary/5">
              <BookOpen className="w-16 h-16 text-foreground/10 mx-auto mb-6" />
              <h3 className="text-xl font-bold">No articles found</h3>
              <p className="text-foreground/50">Try adjusting your search or category filters.</p>
            </div>
          )}
        </section>
      </div>
    </div>
    </ProtectedRoute>
  );
}
