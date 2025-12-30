"use client";

import { motion } from "framer-motion";
import { 
  TrendingUp, TrendingDown, MessageSquare, Lightbulb, 
  Target, Sparkles, ThumbsUp, ThumbsDown, Minus
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { CommentAnalysis, InsightsReport } from "@/lib/engines/comment-analyzer";

// ========================================
// Props 类型
// ========================================
interface InsightsReporterProps {
  analysis: CommentAnalysis;
  report: InsightsReport;
  competitorName: string;
}

// ========================================
// 组件
// ========================================
export function InsightsReporter({ analysis, report, competitorName }: InsightsReporterProps) {
  return (
    <div className="space-y-6">
      {/* 摘要卡片 */}
      <GlassCard className="p-5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-indigo-400 mt-0.5" />
          <div className="space-y-2">
            <h3 className="font-semibold text-indigo-200">AI 分析摘要</h3>
            <p className="text-sm text-white/70 leading-relaxed">{report.summary}</p>
          </div>
        </div>
      </GlassCard>

      {/* 情感分布 */}
      <GlassCard className="p-6 space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-white/60" />
          {competitorName} 用户评论情感分布
        </h3>
        <div className="flex gap-4">
          {/* 正面 */}
          <div className="flex-1 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <ThumbsUp className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">正面</span>
            </div>
            <div className="text-3xl font-bold text-green-400">{analysis.sentiment.positive}%</div>
          </div>
          {/* 负面 */}
          <div className="flex-1 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <div className="flex items-center gap-2 mb-2">
              <ThumbsDown className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-400">负面</span>
            </div>
            <div className="text-3xl font-bold text-red-400">{analysis.sentiment.negative}%</div>
          </div>
          {/* 中性 */}
          <div className="flex-1 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Minus className="w-4 h-4 text-white/50" />
              <span className="text-sm text-white/50">中性</span>
            </div>
            <div className="text-3xl font-bold text-white/50">{analysis.sentiment.neutral}%</div>
          </div>
        </div>
        {/* 进度条 */}
        <div className="h-3 bg-white/10 rounded-full overflow-hidden flex">
          <div className="bg-green-500 h-full" style={{ width: `${analysis.sentiment.positive}%` }} />
          <div className="bg-red-500 h-full" style={{ width: `${analysis.sentiment.negative}%` }} />
          <div className="bg-white/30 h-full" style={{ width: `${analysis.sentiment.neutral}%` }} />
        </div>
      </GlassCard>

      {/* 痛点 & 兴奋点 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 用户痛点 */}
        <GlassCard className="p-6 space-y-4">
          <h3 className="font-semibold flex items-center gap-2 text-red-300">
            <TrendingDown className="w-5 h-5" />
            用户痛点 Top 5
          </h3>
          <div className="space-y-3">
            {analysis.painPoints.slice(0, 5).map((point, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{point.topic}</span>
                  <span className="text-xs text-red-400">{point.frequency} 次提及</span>
                </div>
                <p className="text-xs text-white/50 italic">&quot;{point.quotes[0]}&quot;</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* 用户兴奋点 */}
        <GlassCard className="p-6 space-y-4">
          <h3 className="font-semibold flex items-center gap-2 text-green-300">
            <TrendingUp className="w-5 h-5" />
            用户兴奋点 Top 5
          </h3>
          <div className="space-y-3">
            {analysis.delightPoints.slice(0, 5).map((point, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-3 rounded-lg bg-green-500/10 border border-green-500/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{point.topic}</span>
                  <span className="text-xs text-green-400">{point.frequency} 次提及</span>
                </div>
                <p className="text-xs text-white/50 italic">&quot;{point.quotes[0]}&quot;</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* 策略建议 */}
      <GlassCard className="p-6 space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          策略建议
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {report.strategySuggestions.map((suggestion, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm font-bold shrink-0">
                {i + 1}
              </span>
              <p className="text-sm text-white/80">{suggestion}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* 差异化机会 */}
      <GlassCard className="p-6 space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-400" />
          差异化机会
        </h3>
        <div className="space-y-3">
          {report.differentiationOpportunities.map((opp, i) => (
            <div key={i} className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
              <p className="text-sm text-white/80">{opp}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
