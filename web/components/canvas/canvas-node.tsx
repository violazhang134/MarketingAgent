"use client";

import { motion } from 'framer-motion';
import { 
  Zap, 
  BarChart3, 
  Sparkles, 
  FlaskConical, 
  Lightbulb,
  FileText,
  Image,
  Link2,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { useCanvasStore, type CanvasNode, type CanvasNodeType, type NodeStatus } from '@/lib/stores/canvas-store';
import { NodeContentRenderer } from './node-content-renderer';

// ========================================
// 画布节点卡片组件
// 职责: 根据 viewMode 渲染简略版或详细版卡片
// ========================================

interface CanvasNodeCardProps {
  node: CanvasNode;
  isSelected: boolean;
  onSelect: () => void;
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
  text: { icon: FileText, gradient: 'from-slate-500 to-slate-600', label: 'TEXT' },
  chart: { icon: BarChart3, gradient: 'from-blue-500 to-indigo-500', label: 'CHART' },
  reference: { icon: Link2, gradient: 'from-violet-500 to-purple-500', label: 'REFERENCE' },
  media: { icon: Image, gradient: 'from-pink-500 to-rose-500', label: 'MEDIA' },
};

// 状态图标
const STATUS_ICON: Record<NodeStatus, React.ReactNode> = {
  pending: <Clock className="w-3.5 h-3.5 text-white/40" />,
  running: <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin" />,
  done: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
  error: <XCircle className="w-3.5 h-3.5 text-red-400" />,
};

// 节点尺寸常量
const NODE_WIDTH_SIMPLIFIED = 280;
// NODE_WIDTH_DETAILED 已被 DETAILED_SIZE_CONFIG 替代
const NODE_MIN_HEIGHT_SIMPLIFIED = 100;
const NODE_MIN_HEIGHT_DETAILED = 300;

// 详细模式下的尺寸配置
const DETAILED_SIZE_CONFIG: Record<string, { width: number; maxHeight?: string }> = {
  // 富内容节点：更宽，无高度限制（或很高）
  analysis: { width: 800 },
  insight: { width: 800 },
  creative: { width: 800 },
  experiment: { width: 800 },
  // 默认：标准宽度，限制高度
  default: { width: 600, maxHeight: 'max-h-[400px]' },
};

export function CanvasNodeCard({ node, isSelected, onSelect }: CanvasNodeCardProps) {
  const viewMode = useCanvasStore((s) => s.viewMode);
  
  const config = NODE_TYPE_CONFIG[node.type] || NODE_TYPE_CONFIG.text;
  const Icon = config.icon;
  const status = node.status || 'done';
  
  // 根据模式选择尺寸
  const isDetailed = viewMode === 'detailed';
  
  // 详细模式下的动态尺寸
  const detailedConfig = DETAILED_SIZE_CONFIG[node.type] || DETAILED_SIZE_CONFIG.default;
  
  const nodeWidth = isDetailed ? detailedConfig.width : NODE_WIDTH_SIMPLIFIED;
  const nodeMinHeight = isDetailed ? NODE_MIN_HEIGHT_DETAILED : NODE_MIN_HEIGHT_SIMPLIFIED;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
        delay: (node.animationDelay || 0) / 1000,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className="absolute cursor-pointer group"
      style={{
        left: node.x,
        top: node.y,
        width: nodeWidth,
        minHeight: nodeMinHeight,
      }}
    >
      {/* 外发光效果 */}
      {isSelected && (
        <div 
          className={`absolute -inset-1 rounded-2xl bg-gradient-to-r ${config.gradient} opacity-30 blur-lg`}
        />
      )}
      
      {/* 运行中的脉冲效果 */}
      {status === 'running' && (
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className={`absolute -inset-1 rounded-2xl bg-gradient-to-r ${config.gradient} blur-md`}
        />
      )}

      {/* 卡片主体 */}
      <div
        className={`
          relative rounded-2xl border backdrop-blur-xl h-full
          transition-all duration-200
          ${isSelected 
            ? 'border-indigo-400/50 bg-black/60 shadow-xl' 
            : 'border-white/10 bg-black/40 hover:border-white/20 hover:bg-black/50'
          }
        `}
      >
        {/* 顶部渐变条 */}
        <div 
          className={`h-1 rounded-t-2xl bg-gradient-to-r ${config.gradient}`}
        />

        {/* 头部：类型标签 + 状态 */}
        <div className="p-4 pb-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
                <Icon className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[10px] font-medium tracking-widest text-white/40 uppercase">
                {config.label}
              </span>
            </div>
            {STATUS_ICON[status]}
          </div>

          {/* 标题 */}
          <h3 className="text-sm font-semibold text-white mb-1.5 line-clamp-2">
            {node.title}
          </h3>
        </div>

        {/* ========================================
            内容区域：模式分支
        ======================================== */}
        {isDetailed ? (
          // 详细版：渲染完整内容（非紧凑模式，显示操作按钮）
          <div className={`${detailedConfig.maxHeight || ''} overflow-y-auto border-t border-white/5`}>
            <NodeContentRenderer node={node} compact={false} />
          </div>
        ) : (
          // 简略版：仅摘要
          <div className="px-4 pb-4">
            <p className="text-xs text-white/50 line-clamp-3 leading-relaxed">
              {node.summary}
            </p>

            {/* 可展开提示 */}
            {node.expandable && (
              <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-white/30">
                  点击查看详情
                </span>
                <div className={`
                  w-5 h-5 rounded-full bg-gradient-to-r ${config.gradient} 
                  flex items-center justify-center opacity-0 group-hover:opacity-100
                  transition-opacity duration-200
                `}>
                  <span className="text-white text-xs">→</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
