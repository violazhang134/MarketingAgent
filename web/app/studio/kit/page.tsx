"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, ArrowRight, Check, Sparkles, RefreshCw,
  Grid3X3, Zap, Castle, Puzzle, Combine
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { STYLE_TEMPLATES, StyleTemplate } from "@/lib/data/style-templates";
import { GENRE_TEMPLATES, GenreTemplate, getCoreScreens } from "@/lib/data/genre-templates";

// ========================================
// 小游戏 UI 套件生成向导
// Phase 1: 选择风格 + 品类 → 生成核心界面预览
// ========================================

// 品类图标映射
const GENRE_ICONS: Record<string, React.ElementType> = {
  'match3': Grid3X3,
  'runner': Zap,
  'tower-defense': Castle,
  'puzzle': Puzzle,
  'merge': Combine,
};

// ========================================
// 组件: 风格选择卡片
// ========================================
function StyleCard({ 
  style, 
  selected, 
  onSelect 
}: { 
  style: StyleTemplate;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={cn(
        "relative rounded-xl overflow-hidden cursor-pointer transition-all border-2",
        selected ? "border-indigo-500 ring-2 ring-indigo-500/30" : "border-white/10 hover:border-white/30"
      )}
    >
      {/* 渐变预览 */}
      <div className={cn("h-24 bg-gradient-to-br", style.coverGradient)} />
      
      {/* 信息区 */}
      <div className="p-3 bg-white/5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white">{style.name}</span>
          <span className="text-[10px] text-white/40 bg-white/10 px-2 py-0.5 rounded">
            {style.category}
          </span>
        </div>
        <div className="flex gap-1 mt-2">
          {style.keywords.slice(0, 3).map((k) => (
            <span key={k} className="text-[9px] text-white/30">{k}</span>
          ))}
        </div>
      </div>

      {/* 选中标记 */}
      {selected && (
        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
    </motion.div>
  );
}

// ========================================
// 组件: 品类选择卡片
// ========================================
function GenreCard({ 
  genre, 
  selected, 
  onSelect 
}: { 
  genre: GenreTemplate;
  selected: boolean;
  onSelect: () => void;
}) {
  const Icon = GENRE_ICONS[genre.id] || Puzzle;
  const coreScreens = getCoreScreens(genre.id);
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={cn(
        "relative rounded-xl p-4 cursor-pointer transition-all border-2",
        selected 
          ? "border-indigo-500 bg-indigo-500/10" 
          : "border-white/10 bg-white/5 hover:border-white/30"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          selected ? "bg-indigo-500" : "bg-white/10"
        )}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="font-medium text-white">{genre.name}</div>
          <div className="text-xs text-white/40 mt-0.5">{genre.description}</div>
          <div className="text-[10px] text-white/30 mt-2">
            核心界面: {coreScreens.map(s => s.name).join('、')}
          </div>
        </div>
      </div>

      {selected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
    </motion.div>
  );
}

// ========================================
// 组件: 核心界面预览
// ========================================
function CorePreview({ 
  style, 
  genre, 
  isGenerating,
  results,
  onRegenerate 
}: { 
  style: StyleTemplate;
  genre: GenreTemplate;
  isGenerating: boolean;
  results: string[];
  onRegenerate: () => void;
}) {
  const coreScreens = getCoreScreens(genre.id);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm text-white/60">核心玩法界面预览</h3>
        {results.length > 0 && (
          <button 
            onClick={onRegenerate}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            重新生成
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {coreScreens.map((screen, i) => (
          <div key={screen.id} className="space-y-2">
            <div className={cn(
              "aspect-[9/16] rounded-xl overflow-hidden border border-white/10",
              isGenerating && "animate-pulse"
            )}>
              {isGenerating ? (
                <div className="w-full h-full bg-white/5 flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 text-white/20 animate-spin" />
                </div>
              ) : results[i] ? (
                results[i].startsWith('http') ? (
                  <img src={results[i]} alt={screen.name} className="w-full h-full object-cover" />
                ) : (
                  <div className={cn("w-full h-full bg-gradient-to-br", results[i])} />
                )
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white/10" />
                </div>
              )}
            </div>
            <div className="text-center">
              <div className="text-xs text-white/60">{screen.name}</div>
              <div className="text-[10px] text-white/30">{screen.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ========================================
// 主页面
// ========================================
export default function KitWizardPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewResults, setPreviewResults] = useState<string[]>([]);

  const style = STYLE_TEMPLATES.find(s => s.id === selectedStyle);
  const genre = GENRE_TEMPLATES.find(g => g.id === selectedGenre);

  // 真实 API 生成核心界面预览
  const handleGeneratePreview = async () => {
    if (!style || !genre) return;
    
    setIsGenerating(true);
    setPreviewResults([]);
    
    const coreScreens = getCoreScreens(genre.id);
    const results: string[] = [];
    
    for (const screen of coreScreens) {
      const fullPrompt = screen.promptTemplate.replace('{style}', style.basePrompt);
      
      try {
        const response = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: fullPrompt,
            negativePrompt: style.negativePrompt,
            size: '2K',
          }),
        });
        
        const data = await response.json();
        
        if (data.success && data.images?.[0]) {
          results.push(data.images[0]);
        } else {
          results.push(style.coverGradient); // fallback
        }
      } catch {
        results.push(style.coverGradient); // fallback
      }
      
      setPreviewResults([...results]);
    }
    
    setIsGenerating(false);
    setStep(3);
  };

  // 确认并进入批量生成
  const handleConfirmStyle = () => {
    // TODO: 跳转到 Phase 2 批量生成页面
    window.location.href = `/studio/kit/generate?style=${selectedStyle}&genre=${selectedGenre}`;
  };

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
          <h1 className="text-xl font-bold">UI 套件生成向导</h1>
          <p className="text-white/40 text-sm">选择风格和品类，一键生成完整游戏界面</p>
        </div>
      </div>

      {/* 步骤指示器 */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
              step >= s ? "bg-indigo-500 text-white" : "bg-white/10 text-white/40"
            )}>
              {s}
            </div>
            <span className={cn(
              "text-sm",
              step >= s ? "text-white" : "text-white/40"
            )}>
              {s === 1 ? '选择风格' : s === 2 ? '选择品类' : '确认预览'}
            </span>
            {s < 3 && <div className="w-8 h-0.5 bg-white/10" />}
          </div>
        ))}
      </div>

      {/* Step 1: 选择风格 */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <h2 className="text-lg font-semibold mb-4">选择视觉风格</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {STYLE_TEMPLATES.map((s) => (
                <StyleCard
                  key={s.id}
                  style={s}
                  selected={selectedStyle === s.id}
                  onSelect={() => setSelectedStyle(s.id)}
                />
              ))}
            </div>
            
            <div className="flex justify-end mt-8">
              <button
                onClick={() => setStep(2)}
                disabled={!selectedStyle}
                className={cn(
                  "px-6 py-3 rounded-xl font-medium flex items-center gap-2",
                  selectedStyle
                    ? "bg-indigo-500 text-white hover:bg-indigo-600"
                    : "bg-white/10 text-white/40 cursor-not-allowed"
                )}
              >
                下一步 <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: 选择品类 */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <h2 className="text-lg font-semibold mb-4">选择游戏品类</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {GENRE_TEMPLATES.map((g) => (
                <GenreCard
                  key={g.id}
                  genre={g}
                  selected={selectedGenre === g.id}
                  onSelect={() => setSelectedGenre(g.id)}
                />
              ))}
            </div>
            
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10"
              >
                上一步
              </button>
              <button
                onClick={handleGeneratePreview}
                disabled={!selectedGenre || isGenerating}
                className={cn(
                  "px-6 py-3 rounded-xl font-medium flex items-center gap-2",
                  selectedGenre && !isGenerating
                    ? "bg-indigo-500 text-white hover:bg-indigo-600"
                    : "bg-white/10 text-white/40 cursor-not-allowed"
                )}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    生成预览中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    生成核心界面预览
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: 确认预览 */}
        {step === 3 && style && genre && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 左侧: 选择摘要 */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-4">已选择配置</h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className={cn("w-12 h-12 rounded-lg bg-gradient-to-br", style.coverGradient)} />
                      <div>
                        <div className="text-sm font-medium">{style.name}</div>
                        <div className="text-xs text-white/40">{style.keywords.join('、')}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                      {(() => {
                        const Icon = GENRE_ICONS[genre.id] || Puzzle;
                        return <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-indigo-400" />
                        </div>;
                      })()}
                      <div>
                        <div className="text-sm font-medium">{genre.name}</div>
                        <div className="text-xs text-white/40">{genre.description}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <div className="text-sm text-indigo-200">确认后将生成</div>
                  <div className="text-2xl font-bold text-white mt-1">
                    {genre.screens.length} 张界面
                  </div>
                  <div className="text-xs text-indigo-300/60 mt-1">
                    包含核心玩法界面 + 通用界面
                  </div>
                </div>
              </div>

              {/* 右侧: 预览 */}
              <CorePreview
                style={style}
                genre={genre}
                isGenerating={isGenerating}
                results={previewResults}
                onRegenerate={handleGeneratePreview}
              />
            </div>
            
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10"
              >
                返回调整
              </button>
              <button
                onClick={handleConfirmStyle}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:opacity-90 flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                确认风格，开始批量生成
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
