"use client";

import { motion } from 'framer-motion';
import { Target, Swords, Map, TrendingUp } from 'lucide-react';

interface ComparisonPoint {
  dimension: string;
  competitor: string;
  us: string;
  advantage: boolean;
}

interface ActionItem {
  stage: string;
  action: string;
  expectedOutcome: string;
}

interface TacticalPlanData {
  summary: string;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  comparison: ComparisonPoint[];
  roadmap: ActionItem[];
}

interface TacticalPlanDetailProps {
  data: TacticalPlanData;
}

export function TacticalPlanDetail({ data }: TacticalPlanDetailProps) {
  return (
    <div className="p-6 space-y-8 h-full overflow-y-auto">
      {/* 头部摘要 */}
      <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
        <h3 className="flex items-center gap-2 text-indigo-300 font-semibold mb-2">
          <Target className="w-4 h-4" />
          战略核心
        </h3>
        <p className="text-sm text-indigo-100/90 leading-relaxed">
          {data.summary}
        </p>
      </div>

      {/* 竞品交叉对比 (Cross Analysis) */}
      <div>
        <h3 className="flex items-center gap-2 text-white font-semibold mb-4 text-sm uppercase tracking-wider">
          <Swords className="w-4 h-4 text-amber-500" />
          深度对标分析
        </h3>
        <div className="space-y-3">
          {data.comparison.map((point, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="text-right">
                <div className="text-[10px] text-white/40 mb-1">竞品表现</div>
                <div className="text-sm text-white/70">{point.competitor}</div>
              </div>
              
              <div className="px-3 py-1 rounded-full bg-white/10 text-[10px] text-white/50 font-medium whitespace-nowrap">
                {point.dimension}
              </div>

              <div className="text-left relative">
                <div className="text-[10px] text-white/40 mb-1">我方策略</div>
                <div className={`text-sm ${point.advantage ? 'text-emerald-400 font-medium' : 'text-white/90'}`}>
                  {point.us}
                </div>
                {point.advantage && (
                  <div className="absolute -right-2 -top-2 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* SWOT 矩阵 */}
      <div>
        <h3 className="flex items-center gap-2 text-white font-semibold mb-4 text-sm uppercase tracking-wider">
          <TrendingUp className="w-4 h-4 text-blue-500" />
          SWOT 态势
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/10">
            <div className="text-xs text-emerald-400 font-bold mb-2">优势 (Strengths)</div>
            <ul className="list-disc list-inside space-y-1">
              {data.swot.strengths.map((s, i) => <li key={i} className="text-xs text-emerald-100/70">{s}</li>)}
            </ul>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/10">
            <div className="text-xs text-rose-400 font-bold mb-2">劣势 (Weaknesses)</div>
            <ul className="list-disc list-inside space-y-1">
              {data.swot.weaknesses.map((s, i) => <li key={i} className="text-xs text-rose-100/70">{s}</li>)}
            </ul>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/10">
            <div className="text-xs text-blue-400 font-bold mb-2">机会 (Opportunities)</div>
            <ul className="list-disc list-inside space-y-1">
              {data.swot.opportunities.map((s, i) => <li key={i} className="text-xs text-blue-100/70">{s}</li>)}
            </ul>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/10">
            <div className="text-xs text-amber-400 font-bold mb-2">威胁 (Threats)</div>
            <ul className="list-disc list-inside space-y-1">
              {data.swot.threats.map((s, i) => <li key={i} className="text-xs text-amber-100/70">{s}</li>)}
            </ul>
          </div>
        </div>
      </div>

      {/* 执行路线图 */}
      <div>
        <h3 className="flex items-center gap-2 text-white font-semibold mb-4 text-sm uppercase tracking-wider">
          <Map className="w-4 h-4 text-purple-500" />
          执行计划
        </h3>
        <div className="relative border-l border-white/10 ml-3 space-y-6">
          {data.roadmap.map((item, i) => (
            <div key={i} className="relative pl-6">
              <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-purple-500 border-2 border-slate-900" />
              <div className="text-xs text-purple-400 font-mono mb-1">{item.stage}</div>
              <div className="text-sm text-white font-medium mb-1">{item.action}</div>
              <div className="text-xs text-white/50">预期成果: {item.expectedOutcome}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
