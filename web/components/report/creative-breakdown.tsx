"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, BarChart2, Zap, Clock } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { VideoAnalysisResult } from "@/lib/analysis-engine";

interface CreativeBreakdownProps {
  isOpen: boolean;
  onClose: () => void;
  data: VideoAnalysisResult;
}

export function CreativeBreakdown({ isOpen, onClose, data }: CreativeBreakdownProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Slide Over Panel */}
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-black/90 border-l border-white/10 z-50 p-6 overflow-y-auto shadow-2xl"
          >
             <header className="flex items-center justify-between mb-8">
                <div>
                   <h2 className="text-xl font-bold flex items-center gap-2">
                      <BarChart2 className="w-5 h-5 text-indigo-400" />
                      Creative Breakdown
                   </h2>
                   <p className="text-xs text-white/40">Frame-by-frame Retention Analysis</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                   <X className="w-5 h-5 text-white/60" />
                </button>
             </header>

             <div className="space-y-8">
                {/* Score Cards */}
                <div className="grid grid-cols-2 gap-4">
                   <GlassCard className="p-4 bg-indigo-500/10">
                      <div className="text-xs text-indigo-300 uppercase mb-1">Hook Score</div>
                      <div className="text-3xl font-bold text-white">{data.hookScore} <span className="text-sm font-normal text-white/40">/10</span></div>
                   </GlassCard>
                   <GlassCard className="p-4 bg-cyan-500/10">
                      <div className="text-xs text-cyan-300 uppercase mb-1">Retention</div>
                      <div className="text-3xl font-bold text-white">{data.retentionScore} <span className="text-sm font-normal text-white/40">/10</span></div>
                   </GlassCard>
                </div>

                {/* Timeline Analysis */}
                <div className="space-y-4">
                   <h3 className="font-semibold text-white/80">Timeline Analysis</h3>
                   <div className="relative border-l-2 border-white/10 ml-3 space-y-6 pb-4">
                      {data.frames.map((frame, i) => (
                         <div key={i} className="relative pl-8 group cursor-default">
                            {/* Dot */}
                            <div className={cn(
                               "absolute -left-[5px] top-1 w-3 h-3 rounded-full border-2 border-black transition-transform group-hover:scale-125",
                               frame.sentiment === 'positive' ? "bg-green-500" : 
                               frame.sentiment === 'negative' ? "bg-red-500" : "bg-white/40"
                            )} />
                            
                            {/* Content */}
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                               <div className="flex items-center gap-2 mb-2">
                                  <div className="px-2 py-0.5 rounded bg-black/40 text-[10px] font-mono text-white/60 flex items-center gap-1">
                                     <Clock className="w-3 h-3" /> {frame.time}
                                  </div>
                                  <span className="text-sm font-bold text-white/90">{frame.label}</span>
                               </div>
                               <p className="text-xs text-white/50 leading-relaxed">{frame.description}</p>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>

                {/* AI Insight */}
                <GlassCard className="p-5 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border-indigo-500/30">
                   <div className="flex gap-3">
                      <Zap className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                      <div className="space-y-2">
                         <h4 className="font-bold text-sm text-indigo-200">Key Takeaway</h4>
                         <p className="text-xs text-white/70 leading-relaxed">
                            The &quot;Negative Hook&quot; strategy (showing failure) drives 40% higher initial engagement than gameplay showcases. The sudden pacing change at 0:05 prevents the 3-second drop-off.
                         </p>
                      </div>
                   </div>
                </GlassCard>

             </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Helper utility (assuming cn is available or inline it)
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
