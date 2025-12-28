"use client";

import { motion } from "framer-motion";
import { Sparkles, Trophy, Settings } from "lucide-react";
import { DecisionCard } from "@/components/ui/decision-card";
import { useCampaignStore, PlaybookEntry } from "@/lib/stores/campaign-store";
import { useRouter } from "next/navigation";

export default function FeedPage() {
  const { experimentPack, settleExperiment, playbook, applyWinningPattern, setPhase } = useCampaignStore();
  const router = useRouter();

  // 模拟实验数据 (如果没有真实生成的实验)
  const activeExperiment = experimentPack ? {
    id: experimentPack.experimentId,
    type: 'winner' as const,
    title: `Experiment: ${experimentPack.variable}`,
    description: "AI 分析发现，'Variant' 组在 'Qualified Start' 指标上表现优于 'Control' 组。",
    metric: "+24% Lift",
    arms: experimentPack.arms
  } : null;

  const handleSettle = (winnerId: string, lift: string) => {
    settleExperiment(winnerId, lift);
  };

  const handleOptimize = (entry: PlaybookEntry) => {
    applyWinningPattern(entry);
    setPhase('input'); // Or go back to agent input
    router.push('/agent');
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-2xl mx-auto space-y-8 pb-32">
      <header className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
              <Sparkles className="text-indigo-400 w-4 h-4" />
           </div>
           <h1 className="text-xl font-bold tracking-tight text-white">Daily Decisions</h1>
        </div>
        <div className="text-xs font-mono text-white/40">
          {activeExperiment || playbook.length > 0 ? `${1 + playbook.length} Updates Today` : "No Updates Today"}
        </div>
      </header>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
        className="space-y-6"
      >
        {/* Active Experiment Settlement (Pillar 4 Action) */}
        {activeExperiment && (
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-green-400">
              <Trophy className="w-3 h-3" />
              PENDING SETTLEMENT
            </div>
            <DecisionCard 
              type="winner"
              title={activeExperiment.title}
              description={activeExperiment.description}
              metric={activeExperiment.metric}
              onAction={() => handleSettle(activeExperiment.arms[1].id, activeExperiment.metric)}
            />
            <div className="mt-3 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-between">
              <span className="text-xs text-green-200/70">判定 &apos;Variant&apos; 为优胜组并将其存入策略库？</span>
              <button 
                onClick={() => handleSettle(activeExperiment.arms[1].id, activeExperiment.metric)}
                className="px-3 py-1.5 bg-green-500 text-black text-xs font-bold rounded-lg hover:bg-green-400 transition-colors"
              >
                Accept &amp; Settle
              </button>
            </div>
          </motion.div>
        )}

        {/* Playbook / Automation Entries */}
        {playbook.map((entry) => (
          <motion.div 
            key={entry.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <DecisionCard 
              type="action"
              title={`Next Action: Optimize ${entry.variable}`}
              description={`基于胜出经验 (${entry.winnerValue})，我已为您准备好新一轮优化方案。`}
              onAction={() => handleOptimize(entry)}
            />
          </motion.div>
        ))}

        {!activeExperiment && playbook.length === 0 && (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/5 mx-auto flex items-center justify-center">
              <Settings className="w-8 h-8 text-white/20 animate-spin-slow" />
            </div>
            <p className="text-white/40">系统正在监控实验数据，暂无最新决策...</p>
          </div>
        )}
        
        {/* End of feed marker */}
        <div className="flex justify-center py-8">
           <div className="h-1 w-12 bg-white/10 rounded-full" />
        </div>
      </motion.div>
    </div>
  );
}
