"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Zap, Eye, Target, Users, ArrowRight, ArrowLeft, 
  Sparkles, RefreshCw 
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { useCampaignStore } from "@/lib/stores/campaign-store";

// ========================================
// 策略选项配置
// ========================================
const STRATEGY_OPTIONS = {
  hookStyle: {
    label: "Hook 风格",
    description: "视频开头的吸引策略",
    icon: <Zap className="w-5 h-5" />,
    options: [
      { id: 'challenge', label: '挑战型', desc: '激发用户竞争心理', emoji: '🎯' },
      { id: 'suspense', label: '悬念型', desc: '制造好奇心驱动', emoji: '🤔' },
      { id: 'satisfaction', label: '满足型', desc: '展示解压爽感', emoji: '😌' },
      { id: 'contrast', label: '对比型', desc: '反差效果吸引眼球', emoji: '⚡' },
    ],
  },
  visualTone: {
    label: "视觉基调",
    description: "整体画面风格",
    icon: <Eye className="w-5 h-5" />,
    options: [
      { id: 'bright', label: '明亮', desc: '活泼、积极', emoji: '☀️' },
      { id: 'dark', label: '暗黑', desc: '酷炫、神秘', emoji: '🌙' },
      { id: 'colorful', label: '彩色', desc: '丰富、热闹', emoji: '🌈' },
      { id: 'minimal', label: '极简', desc: '干净、专注', emoji: '⬜' },
    ],
  },
  ctaIntensity: {
    label: "CTA 强度",
    description: "行动号召的激进程度",
    icon: <Target className="w-5 h-5" />,
    options: [
      { id: 'soft', label: '软性', desc: '温和引导', emoji: '🌸' },
      { id: 'medium', label: '中性', desc: '标准号召', emoji: '📢' },
      { id: 'strong', label: '强力', desc: '强烈驱动', emoji: '🔥' },
    ],
  },
  targetAudience: {
    label: "目标人群",
    description: "内容风格的受众定位",
    icon: <Users className="w-5 h-5" />,
    options: [
      { id: 'casual', label: '休闲玩家', desc: '轻度、碎片时间', emoji: '😊' },
      { id: 'hardcore', label: '硬核玩家', desc: '深度、策略型', emoji: '💪' },
      { id: 'all', label: '全年龄', desc: '老少皆宜', emoji: '👨‍👩‍👧‍👦' },
    ],
  },
};

// ========================================
// 组件
// ========================================
export default function StrategyPage() {
  const router = useRouter();
  const { productName, adAnalysis, strategy, setStrategy, generateAssetsWorkflow } = useCampaignStore();
  
  const [isGenerating, setIsGenerating] = useState(false);

  // 如果没有产品信息，返回连接页
  if (!productName) {
    router.push('/create/connect');
    return null;
  }

  const handleGenerate = async () => {
    setIsGenerating(true);
    await generateAssetsWorkflow();
    router.push('/create/studio');
  };

  return (
    <div className="min-h-screen p-6 flex flex-col">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => router.push('/create/connect')}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold">策略配置</h1>
            <p className="text-sm text-white/50">为 {productName} 定制创意策略</p>
          </div>
          <div className="w-16" /> {/* Spacer */}
        </div>

        {/* 竞品策略提示 */}
        {adAnalysis && (
          <GlassCard className="p-4 border-amber-500/30 bg-amber-500/10">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-sm font-medium">AI 推荐策略</div>
                <div className="text-xs text-white/50">
                  基于竞品的 &quot;{adAnalysis.strategy}&quot; 策略
                </div>
              </div>
              <button 
                onClick={() => setStrategy({ hookStyle: 'challenge', ctaIntensity: 'strong' })}
                className="ml-auto px-3 py-1 text-xs bg-amber-500/20 text-amber-300 rounded-full hover:bg-amber-500/30 transition-colors"
              >
                应用推荐
              </button>
            </div>
          </GlassCard>
        )}

        {/* 策略配置网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Object.entries(STRATEGY_OPTIONS) as [keyof typeof STRATEGY_OPTIONS, typeof STRATEGY_OPTIONS.hookStyle][]).map(([key, config]) => (
            <GlassCard key={key} className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                  {config.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{config.label}</h3>
                  <p className="text-xs text-white/40">{config.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {config.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setStrategy({ [key]: option.id })}
                    className={`p-3 rounded-xl text-left transition-all ${
                      strategy[key as keyof typeof strategy] === option.id
                        ? 'bg-indigo-500/20 border-2 border-indigo-500'
                        : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{option.emoji}</span>
                      <span className="text-sm font-medium">{option.label}</span>
                    </div>
                    <p className="text-xs text-white/40">{option.desc}</p>
                  </button>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>

        {/* 预览当前策略 */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">当前策略组合</h3>
            <button 
              onClick={() => setStrategy({ 
                hookStyle: 'challenge', 
                visualTone: 'bright', 
                ctaIntensity: 'medium', 
                targetAudience: 'casual' 
              })}
              className="flex items-center gap-1 text-xs text-white/50 hover:text-white"
            >
              <RefreshCw className="w-3 h-3" />
              重置
            </button>
          </div>
          <div className="flex gap-3 flex-wrap">
            {Object.entries(strategy).map(([key, value]) => {
              const config = STRATEGY_OPTIONS[key as keyof typeof STRATEGY_OPTIONS];
              const option = config.options.find(o => o.id === value);
              return (
                <div key={key} className="px-3 py-2 rounded-lg bg-white/5 flex items-center gap-2">
                  <span>{option?.emoji}</span>
                  <span className="text-sm">{option?.label}</span>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* 生成按钮 */}
        <motion.button
          onClick={handleGenerate}
          disabled={isGenerating}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              正在生成素材...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              生成广告素材
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </motion.button>

      </div>
    </div>
  );
}
