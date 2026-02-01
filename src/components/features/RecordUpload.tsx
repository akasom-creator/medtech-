"use client";

import { useState } from "react";
import { Upload, X, File, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function RecordUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    
    // Simulate Supabase Storage upload
    // const { data, error } = await supabase.storage.from('records').upload(`user_id/${file.name}`, file)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setUploading(false);
    setDone(true);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    setAnalysis(null);

    try {
      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      const base64 = await base64Promise;

      const response = await fetch('/api/analyze-record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, mimeType: file.type })
      });

      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="glass p-8 rounded-[2.5rem] border border-primary/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center text-white">
          <Upload className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold">Secure Upload</h2>
      </div>

      <div 
        className={cn(
          "relative border-2 border-dashed rounded-[2rem] p-12 text-center transition-all",
          file ? "border-primary bg-primary/5" : "border-primary/20 hover:border-primary/40"
        )}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
        }}
      >
        <input 
          type="file" 
          className="absolute inset-0 opacity-0 cursor-pointer" 
          onChange={(e) => e.target.files && setFile(e.target.files[0])}
        />
        
        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8 text-primary/40" />
              </div>
              <div>
                <p className="font-bold">Click to upload or drag and drop</p>
                <p className="text-xs text-foreground/40 mt-1 uppercase font-bold tracking-widest">PDF, JPG, or PNG (Max. 20MB)</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="selected"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-4"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <File className="w-8 h-8" />
              </div>
              <div>
                <p className="font-bold truncate max-w-[200px] mx-auto">{file.name}</p>
                <button 
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="text-[10px] text-destructive font-black uppercase tracking-widest flex items-center gap-1 mx-auto mt-2 hover:underline"
                >
                  <X className="w-3 h-3" /> Remove File
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button 
        onClick={handleUpload}
        disabled={!file || uploading || done}
        className={cn(
          "w-full mt-6 py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3",
          done ? "bg-emerald-500 text-white" : "bg-primary text-white hover:shadow-xl hover:shadow-primary/20 disabled:opacity-50"
        )}
      >
        {uploading ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> UPLOADING...</>
        ) : done ? (
          <><CheckCircle2 className="w-5 h-5" /> READY IN RECORDS</>
        ) : (
          "UPLOAD TO RECORDS"
        )}
      </button>

      <AnimatePresence>
        {done && !analysis && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={handleAnalyze}
            disabled={analyzing}
            className="w-full mt-4 py-4 rounded-2xl font-black text-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-500/20"
          >
            {analyzing ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> GEMINI IS ANALYZING...</>
            ) : (
              <><Sparkles className="w-5 h-5" /> SCAN WITH GEMINI 3</>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 p-6 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/20 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-500">
                <Sparkles className="w-5 h-5" />
                <span className="font-black uppercase tracking-widest text-sm">AI Analysis Report</span>
              </div>
              <span className="text-[10px] px-2 py-1 bg-indigo-500/10 rounded-full font-bold text-indigo-500 uppercase">
                Confidence: {analysis.confidence || 0}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/50 dark:bg-black/20 p-3 rounded-2xl">
                <p className="text-[10px] uppercase font-black opacity-40 mb-1">Document Type</p>
                <p className="font-bold text-sm">{analysis.type}</p>
              </div>
              <div className="bg-white/50 dark:bg-black/20 p-3 rounded-2xl text-right">
                <p className="text-[10px] uppercase font-black opacity-40 mb-1">Status</p>
                <p className="font-bold text-sm text-emerald-500 uppercase">Processed</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] uppercase font-black opacity-40">Summary</p>
              <p className="text-sm leading-relaxed italic">"{analysis.summary}"</p>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] uppercase font-black opacity-40">Key Findings</p>
              <ul className="grid grid-cols-1 gap-1">
                {analysis.keyPoints?.map((p: string, i: number) => (
                  <li key={i} className="text-xs flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={() => { setAnalysis(null); setDone(false); setFile(null); }}
              className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-foreground transition-colors"
            >
              Close and Upload Another
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
