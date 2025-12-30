"use client";

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Zap, BarChart3, Sparkles, FlaskConical, Lightbulb } from 'lucide-react';
import { useCanvasStore, type CanvasNodeType } from '@/lib/stores/canvas-store';
import { NodeContentRenderer } from './node-content-renderer';

// ========================================
// 节点详情弹窗
// 职责: 点击节点后展示详细内容，委托 NodeContentRenderer 渲染
// ========================================

interface NodeDetailModalProps {
  nodeId: string;
  onClose: () => void;
}

// 节点类型配置
const NODE_TYPE_CONFIG: Record<CanvasNodeType, {
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  label: string;
}> = {
  agent_step: { icon: Zap, gradient: 'from-indigo-500 to-purple-500', label: 'AGENT STEP' },
  analysis: { icon: BarChart3, gradient: 'from-cyan-500 to-blue-500', label: 'ANALYSIS' },
  creative: { icon: Sparkles, gradient: 'from-amber-500 to-orange-500', label: 'CREATIVE' },
  experiment: { icon: FlaskConical, gradient: 'from-emerald-500 to-teal-500', label: 'EXPERIMENT' },
  insight: { icon: Lightbulb, gradient: 'from-rose-500 to-pink-500', label: 'INSIGHT' },
  text: { icon: Zap, gradient: 'from-slate-500 to-slate-600', label: 'TEXT' },
  chart: { icon: BarChart3, gradient: 'from-blue-500 to-indigo-500', label: 'CHART' },
  reference: { icon: ExternalLink, gradient: 'from-violet-500 to-purple-500', label: 'REFERENCE' },
  media: { icon: Sparkles, gradient: 'from-pink-500 to-rose-500', label: 'MEDIA' },
};

export function NodeDetailModal({ nodeId, onClose }: NodeDetailModalProps) {
  const { nodes } = useCanvasStore();

  const node = useMemo(
    () => nodes.find((n) => n.id === nodeId) || null,
    [nodes, nodeId]
  );

  if (!node) return null;

  const config = NODE_TYPE_CONFIG[node.type] || NODE_TYPE_CONFIG.text;
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full max-w-4xl max-h-[85vh] mx-4 rounded-3xl bg-slate-950 border border-white/10 shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 头部 */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest mb-0.5">
                  {config.label}
                </div>
                <h2 className="text-lg font-semibold text-white">{node.title}</h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="关闭"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 内容区域 - 委托渲染 */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <NodeContentRenderer node={node} compact={false} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
