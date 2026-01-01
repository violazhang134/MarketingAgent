"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, RefreshCw, Download, Blend, Percent
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { STYLE_TEMPLATES, StyleTemplate } from "@/lib/data/style-templates";
import { useStudioStore } from "@/lib/stores/studio-store";

// ========================================
// 风格融合实验室
// 职责: 混合多种风格创造独特效果
// ========================================

// ========================================
// 组件: 风格选择卡
// ========================================
function StylePickCard({ 
  style, 
  selected, 
  onSelect 
}: { 
  style: StyleTemplate;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "relative rounded-xl overflow-hidden border-2 transition-all text-left",
        selected 
          ? "border-indigo-500 ring-2 ring-indigo-500/30" 
          : "border-white/10 hover:border-white/30"
      )}
    >
      <div className={cn("h-16 bg-gradient-to-br", style.coverGradient)} />
      <div className="p-2 bg-white/5">
        <div className="text-xs font-medium text-white">{style.name}</div>
        <div className="text-[9px] text-white/40">{style.keywords.slice(0, 2).join(' · ')}</div>
      </div>
    </button>
  );
}

// ========================================
// 组件: 权重滑块
// ========================================
function WeightControl({ 
  primaryWeight, 
  onChange 
}: { 
  primaryWeight: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-indigo-400">主风格 {primaryWeight}%</span>
        <span className="text-purple-400">副风格 {100 - primaryWeight}%</span>
      </div>
      <input
        type="range"
        min={10}
        max={90}
        value={primaryWeight}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-indigo-500"
      />
    </div>
  );
}

// ========================================
// 组件: 融合预览
// ========================================
function FusionPreview({ 
  primary, 
  secondary, 
  weight,
  isGenerating,
  result
}: { 
  primary: StyleTemplate | null;
  secondary: StyleTemplate | null;
  weight: number;
  isGenerating: boolean;
  result: string | null;
}) {
  if (isGenerating) {
    return (
      <div className="aspect-square bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Blend className="w-12 h-12 text-purple-400" />
        </motion.div>
        <p className="text-white/40 text-sm mt-4">融合魔法正在施展...</p>
      </div>
    );
  }

  if (result) {
    // result 是图片 URL
    return (
      <div className="aspect-square rounded-2xl overflow-hidden border border-white/10">
        <img src={result} alt="Fusion result" className="w-full h-full object-cover" />
      </div>
    );
  }

  if (!primary || !secondary) {
    return (
      <div className="aspect-square bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center">
        <Blend className="w-16 h-16 text-white/10 mb-4" />
        <p className="text-white/30 text-sm">选择两种风格后查看融合预览</p>
      </div>
    );
  }

  // 显示融合预览提示
  return (
    <div className="aspect-square bg-white/5 rounded-2xl border border-white/10 p-6 flex flex-col">
      <div className="text-sm text-white/60 mb-4">融合预览</div>
      
      {/* 双色条 */}
      <div className="flex-1 flex rounded-xl overflow-hidden">
        <div 
          className={cn("bg-gradient-to-br", primary.coverGradient)}
          style={{ width: `${weight}%` }}
        />
        <div 
          className={cn("bg-gradient-to-br", secondary.coverGradient)}
          style={{ width: `${100 - weight}%` }}
        />
      </div>

      <div className="mt-4 text-center">
        <div className="text-xs text-white/40">
          {primary.name} ({weight}%) + {secondary.name} ({100 - weight}%)
        </div>
      </div>
    </div>
  );
}

// ========================================
// 主页面
// ========================================
export default function FusionPage() {
  const userStyles = useStudioStore((s) => s.userStyles);
  const [primaryId, setPrimaryId] = useState<string | null>(null);
  const [secondaryId, setSecondaryId] = useState<string | null>(null);
  const [weight, setWeight] = useState(60);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  // 合并系统风格和用户风格
  const allStyles: StyleTemplate[] = [
    ...STYLE_TEMPLATES,
    ...userStyles.map(us => ({
      id: us.id,
      name: us.name,
      nameEn: us.name,
      category: '2D' as const,
      basePrompt: us.basePrompt,
      negativePrompt: us.negativePrompt,
      keywords: us.tags,
      colorPalette: [],
      coverGradient: us.previewGradient,
    }))
  ];

  const primary = allStyles.find(s => s.id === primaryId) || null;
  const secondary = allStyles.find(s => s.id === secondaryId) || null;

  // 真实 API 融合生成
  const handleGenerate = async () => {
    if (!primary || !secondary) return;
    
    setIsGenerating(true);
    setResult(null);

    // 构建融合提示词
    const fusionPrompt = `游戏UI界面设计，融合两种风格：${weight}%的${primary.name}（${primary.basePrompt}）和${100 - weight}%的${secondary.name}（${secondary.basePrompt}）`;

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fusionPrompt,
          size: '2K',
        }),
      });
      
      const data = await response.json();
      
      if (data.success && data.images?.[0]) {
        setResult(data.images[0]);
      }
    } catch (error) {
      console.error('[Fusion] Generate error:', error);
    }
    
    setIsGenerating(false);
  };

  const canGenerate = primary && secondary && primaryId !== secondaryId;

  return (
    <main className="min-h-screen bg-obsidian text-white p-6 pb-28">
      {/* 头部 */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/studio"
          className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Blend className="w-5 h-5 text-purple-400" />
            风格融合实验室
          </h1>
          <p className="text-white/40 text-sm">混合多种风格，创造独特效果</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 左侧: 选择区 */}
        <div className="space-y-6">
          {/* 主风格 */}
          <div>
            <label className="text-sm text-indigo-400 mb-3 block flex items-center gap-2">
              <Percent className="w-4 h-4" />
              主风格 (权重 {weight}%)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {allStyles.map((style) => (
                <StylePickCard
                  key={`primary-${style.id}`}
                  style={style}
                  selected={primaryId === style.id}
                  onSelect={() => setPrimaryId(style.id)}
                />
              ))}
            </div>
          </div>

          {/* 副风格 */}
          <div>
            <label className="text-sm text-purple-400 mb-3 block flex items-center gap-2">
              <Percent className="w-4 h-4" />
              副风格 (权重 {100 - weight}%)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {allStyles.filter(s => s.id !== primaryId).map((style) => (
                <StylePickCard
                  key={`secondary-${style.id}`}
                  style={style}
                  selected={secondaryId === style.id}
                  onSelect={() => setSecondaryId(style.id)}
                />
              ))}
            </div>
          </div>

          {/* 权重控制 */}
          {primary && secondary && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <WeightControl primaryWeight={weight} onChange={setWeight} />
            </div>
          )}

          {/* 生成按钮 */}
          <button
            onClick={handleGenerate}
            disabled={!canGenerate || isGenerating}
            className={cn(
              "w-full py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all",
              canGenerate && !isGenerating
                ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90"
                : "bg-white/10 text-white/40 cursor-not-allowed"
            )}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                融合中...
              </>
            ) : (
              <>
                <Blend className="w-5 h-5" />
                生成融合效果
              </>
            )}
          </button>
        </div>

        {/* 右侧: 预览 */}
        <div>
          <label className="text-sm text-white/60 mb-3 block">融合效果</label>
          
          <FusionPreview
            primary={primary}
            secondary={secondary}
            weight={weight}
            isGenerating={isGenerating}
            result={result}
          />

          {result && (
            <button className="w-full mt-4 py-3 rounded-xl bg-purple-500 text-white font-medium hover:bg-purple-600 transition-colors flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              下载融合结果
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
