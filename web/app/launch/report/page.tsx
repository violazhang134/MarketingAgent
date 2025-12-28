"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Search
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { AgentInput } from "@/components/ui/agent-input";
import { ScanningLog } from "@/components/ui/scanning-log";
import { useCampaignStore } from "@/lib/stores/campaign-store";
import { CompetitorReportView } from "@/components/report/competitor-report-view";

// ========================================
// 组件
// ========================================
export default function CompetitorReportPage() {
  const router = useRouter();
  const { 
    phase, competitorName, 
    updateInput, setPhase, generateAssetsWorkflow 
  } = useCampaignStore();

  // 事件处理
  const handleScan = (value: string) => {
    updateInput({ competitorName: value });
    setPhase('analyzing');
  };

  const handleGenerateClone = async () => {
    await generateAssetsWorkflow();
    router.push('/launch/pack');
  };



  return (
    <>
      <div className="min-h-screen p-4 flex flex-col items-center justify-center relative overflow-hidden">
        
        {/* Background Matrix Effect */}
        {phase === 'analyzing' && (
           <div className="absolute inset-0 z-0 opacity-10 pointer-events-none font-mono text-[10px] leading-3 text-green-500 break-all overflow-hidden">
              0101010101010001010101001010101010111101010101010100101
           </div>
        )}

        {/* ====== INPUT STAGE ====== */}
        <AnimatePresence>
          {phase === 'input' || phase === 'idle' ? (
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9 }}
               className="w-full max-w-lg space-y-8 text-center relative z-10"
             >
                <div className="space-y-4">
                   <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 mx-auto flex items-center justify-center shadow-2xl shadow-indigo-500/20">
                      <Search className="text-white w-8 h-8" />
                   </div>
                   <h1 className="text-3xl font-bold">Research Competitor</h1>
                   <p className="text-white/40">Enter any game/app name. We&apos;ll reverse-engineer their ad strategy.</p>
                </div>
                <AgentInput onSubmit={handleScan} placeholder="e.g. Duolingo, Royal Match..." />
             </motion.div>
          ) : null}
        </AnimatePresence>

        {/* ====== ANALYZING STAGE ====== */}
        <AnimatePresence>
          {phase === 'analyzing' && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-md relative z-10">
                <GlassCard className="p-8 space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full border-2 border-indigo-500/50 border-t-indigo-400 animate-spin" />
                      <div>
                         <div className="font-bold text-lg">Scanning Ad Networks</div>
                         <div className="text-xs text-white/40 font-mono">Target: {competitorName}</div>
                      </div>
                   </div>
                   <ScanningLog onComplete={() => setPhase('review')} />
                </GlassCard>
             </motion.div>
          )}
        </AnimatePresence>

        {/* ====== RESULT STAGE ====== */}
        {(phase === 'review' || phase === 'complete') && (
           <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-7xl z-10 space-y-6 pb-20"
           >
              <header className="flex justify-end mb-4">
                 <button onClick={() => setPhase('input')} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm text-white/60 transition-colors">
                    New Scan
                 </button>
              </header>

              <CompetitorReportView 
                gameName={competitorName} 
                onGenerateClone={handleGenerateClone}
                showGenerateButton={true}
              />
           </motion.div>
        )}

      </div>
    </>
  );
}
