"use client";

import { motion } from "framer-motion";
import { BookOpen, TrendingUp, Zap, ArrowLeft, History } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { useCampaignStore, PlaybookEntry } from "@/lib/stores/campaign-store";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PlaybookPage() {
  const { playbook, applyWinningPattern, setPhase } = useCampaignStore();
  const router = useRouter();

  const handleApply = (entry: PlaybookEntry) => {
    applyWinningPattern(entry);
    setPhase('input');
    router.push('/agent');
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 max-w-4xl mx-auto space-y-12 pb-32">
      {/* Header */}
      <header className="space-y-4">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Agent
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
            <BookOpen className="text-indigo-400 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Strategy Playbook</h1>
            <p className="text-white/40">已验证的优胜模式与资产沉淀</p>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 border-indigo-500/20 bg-indigo-500/5">
          <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Total Insights</div>
          <div className="text-3xl font-bold">{playbook.length}</div>
        </GlassCard>
        <GlassCard className="p-6 border-green-500/20 bg-green-500/5">
          <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Avg. Lift</div>
          <div className="text-3xl font-bold text-green-400">+18.5%</div>
        </GlassCard>
        <GlassCard className="p-6 border-purple-500/20 bg-purple-500/5">
          <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Optimizations Run</div>
          <div className="text-3xl font-bold text-purple-400">
            {playbook.reduce((acc, curr) => acc + curr.appliedCount, 0)}
          </div>
        </GlassCard>
      </div>

      {/* Playbook List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <History className="w-5 h-5 text-white/40" />
            Verified Patterns
          </h2>
        </div>

        {playbook.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {playbook.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <GlassCard className="p-6 flex items-center justify-between hover:border-white/20 transition-all group">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-white/40">
                      {entry.variable === 'cover' ? <Zap className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-400 uppercase tracking-tighter">
                          {entry.variable}
                        </span>
                        <span className="text-xs text-white/40">{entry.date}</span>
                      </div>
                      <h3 className="font-semibold text-lg">{entry.winnerValue} 胜出</h3>
                      <p className="text-sm text-white/60">提升了广告点击率 (CTR) 约 {entry.lift}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                      <div className="text-xs text-white/40 mb-1">Applied</div>
                      <div className="text-sm font-mono">{entry.appliedCount} times</div>
                    </div>
                    <button
                      onClick={() => handleApply(entry)}
                      className="px-4 py-2 bg-indigo-500 text-white text-sm font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2"
                    >
                      Apply Now
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-3xl">
            <BookOpen className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/30">策略库目前为空，快去 Agent Mode 开启实验吧！</p>
          </div>
        )}
      </div>
    </div>
  );
}
