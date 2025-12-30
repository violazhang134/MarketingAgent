"use client";

import { motion } from 'framer-motion';
import { Copy, FlaskConical } from 'lucide-react';

interface ExperimentArm {
  id: string;
  name: string;
  config: Record<string, string | undefined>;
  trackingLink: string;
}

interface ExperimentData {
  experimentId: string;
  variable: string;
  arms: ExperimentArm[];
  allocations: [number, number];
}

interface ExperimentPackDetailProps {
  data: ExperimentData;
}

export function ExperimentPackDetail({ data }: ExperimentPackDetailProps) {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // 简单的反馈，或者后续接入统一的 toast
    console.log('Copied:', text); 
  };

  return (
    <div className="p-6 space-y-8 h-full overflow-y-auto">
      {/* 顶部概览 */}
      <div className="relative p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <FlaskConical className="w-32 h-32 rotate-12" />
        </div>
        
        <div className="relative">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">A/B Experiment</div>
          <h2 className="text-2xl font-bold text-white mb-6 font-mono">{data.experimentId}</h2>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-white/40 text-xs mb-1">测试变量</div>
              <div className="text-white font-medium">{data.variable}</div>
            </div>
            <div>
              <div className="text-white/40 text-xs mb-1">流量分配</div>
              <div className="text-white font-medium">Auto-Optimize ({data.allocations.join('/')})</div>
            </div>
          </div>
        </div>
      </div>

      {/* 实验分组对比 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.arms.map((arm, i) => {
          const isControl = i === 0;
          return (
            <motion.div
              key={arm.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`
                relative p-5 rounded-2xl border flex flex-col
                ${isControl 
                  ? 'bg-blue-500/5 border-blue-500/20' 
                  : 'bg-purple-500/5 border-purple-500/20'
                }
              `}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${isControl ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'}`}>
                  {isControl ? 'Control Group' : 'Variant Group'}
                </div>
                <div className="text-xs text-white/40">{arm.name}</div>
              </div>

              {/* 配置详情 */}
              <div className="flex-1 space-y-2 mb-6">
                {Object.entries(arm.config).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-xs border-b border-white/5 pb-1 last:border-0">
                    <span className="text-white/50">{key}</span>
                    <span className="text-white/90 font-medium truncate ml-2 max-w-[120px]">{value}</span>
                  </div>
                ))}
              </div>

              {/* 追踪链接 */}
              <div className="mt-auto">
                <div className="text-[10px] text-white/30 uppercase tracking-widest mb-2">Tracking Link</div>
                <div 
                  onClick={() => handleCopy(arm.trackingLink)}
                  className="group flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-white/10 hover:border-white/30 cursor-pointer transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-emerald-400 truncate font-mono">{arm.trackingLink}</div>
                  </div>
                  <Copy className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
