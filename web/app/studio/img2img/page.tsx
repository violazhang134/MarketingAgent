"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Upload, Sparkles, RefreshCw, Download, X, Image as ImageIcon,
  Sliders, Palette
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useStudioStore } from "@/lib/stores/studio-store";
import { STYLE_TEMPLATES } from "@/lib/data/style-templates";

// ========================================
// 图生图模式
// 职责: 上传参考图 + 风格迁移
// ========================================

// ========================================
// 组件: 图片上传区
// ========================================
function ImageUploader({ 
  image, 
  onUpload, 
  onClear 
}: { 
  image: string | null;
  onUpload: (dataUrl: string) => void;
  onClear: () => void;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          onUpload(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [onUpload]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          onUpload(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (image) {
    return (
      <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10">
        <img src={image} alt="Reference" className="w-full h-full object-cover" />
        <button 
          onClick={onClear}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "relative aspect-square border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all",
        isDragging 
          ? "border-indigo-500 bg-indigo-500/10" 
          : "border-white/20 hover:border-white/40 hover:bg-white/5"
      )}
    >
      <Upload className="w-12 h-12 mb-4 text-white/30" />
      <p className="text-white/60 text-sm">拖拽参考图到此处</p>
      <p className="text-white/30 text-xs mt-1">或点击上传</p>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
    </div>
  );
}

// ========================================
// 组件: 风格选择器
// ========================================
function StyleSelector({ 
  selectedId, 
  onSelect 
}: { 
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const userStyles = useStudioStore((s) => s.userStyles);
  const allStyles = [...STYLE_TEMPLATES, ...userStyles.map(us => ({
    ...us,
    category: '自定义' as const,
    nameEn: us.name,
    keywords: us.tags,
    colorPalette: [],
    coverGradient: us.previewGradient,
  }))];

  return (
    <div className="space-y-3">
      <label className="text-sm text-white/60 flex items-center gap-2">
        <Palette className="w-4 h-4" />
        选择风格
      </label>
      <div className="grid grid-cols-4 gap-2">
        {allStyles.map((style) => (
          <button
            key={style.id}
            onClick={() => onSelect(style.id)}
            className={cn(
              "relative rounded-lg overflow-hidden border-2 transition-all",
              selectedId === style.id 
                ? "border-indigo-500 ring-2 ring-indigo-500/30" 
                : "border-white/10 hover:border-white/30"
            )}
          >
            <div className={cn("h-12 bg-gradient-to-br", style.coverGradient)} />
            <div className="p-1.5 bg-white/5">
              <span className="text-[10px] text-white/60 block truncate">{style.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ========================================
// 组件: 参考强度滑块
// ========================================
function StrengthSlider({ 
  value, 
  onChange 
}: { 
  value: number;
  onChange: (v: number) => void;
}) {
  const presets = [
    { label: '轻微', value: 30, desc: '保留风格，参考构图' },
    { label: '中等', value: 50, desc: '平衡参考与风格' },
    { label: '强', value: 70, desc: '保留结构，换风格' },
    { label: '极强', value: 90, desc: '几乎复现原图' },
  ];

  return (
    <div className="space-y-3">
      <label className="text-sm text-white/60 flex items-center gap-2">
        <Sliders className="w-4 h-4" />
        参考强度
        <span className="ml-auto text-indigo-400">{value}%</span>
      </label>
      
      <input
        type="range"
        min={10}
        max={95}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-indigo-500"
      />

      <div className="flex gap-2">
        {presets.map((p) => (
          <button
            key={p.value}
            onClick={() => onChange(p.value)}
            className={cn(
              "flex-1 py-2 rounded-lg text-center transition-all",
              Math.abs(value - p.value) < 10
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10"
            )}
          >
            <div className="text-xs font-medium">{p.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ========================================
// 组件: 结果预览
// ========================================
function ResultPreview({ 
  isGenerating, 
  result 
}: { 
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
          <RefreshCw className="w-12 h-12 text-indigo-400" />
        </motion.div>
        <p className="text-white/40 text-sm mt-4">AI 正在转换风格...</p>
      </div>
    );
  }

  if (result) {
    // result 是图片 URL
    return (
      <div className="aspect-square rounded-2xl overflow-hidden border border-white/10">
        <img src={result} alt="Generated" className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className="aspect-square bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center">
      <ImageIcon className="w-16 h-16 text-white/10 mb-4" />
      <p className="text-white/30 text-sm">生成结果将显示在这里</p>
    </div>
  );
}

// ========================================
// 主页面
// ========================================
export default function Img2ImgPage() {
  const { img2imgConfig, setImg2ImgConfig } = useStudioStore();
  const [additionalPrompt, setAdditionalPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!img2imgConfig.referenceImage || !img2imgConfig.styleId) return;
    
    setIsGenerating(true);
    setResult(null);

    const style = STYLE_TEMPLATES.find(s => s.id === img2imgConfig.styleId);
    if (!style) {
      setIsGenerating(false);
      return;
    }

    // 构建提示词（包含风格和附加描述）
    const prompt = `${style.basePrompt}${additionalPrompt ? `，${additionalPrompt}` : ''}`;

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          negativePrompt: style.negativePrompt,
          size: '2K',
        }),
      });
      
      const data = await response.json();
      
      if (data.success && data.images?.[0]) {
        setResult(data.images[0]);
      } else {
        console.error('[Img2Img] Failed:', data.error);
        // 失败时使用渐变色占位
        setResult(null);
      }
    } catch (error) {
      console.error('[Img2Img] Error:', error);
    }
    
    setIsGenerating(false);
  };

  const canGenerate = img2imgConfig.referenceImage && img2imgConfig.styleId;

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
          <h1 className="text-xl font-bold">图生图</h1>
          <p className="text-white/40 text-sm">上传参考图，快速迁移风格</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 左侧: 输入区 */}
        <div className="space-y-6">
          {/* 上传参考图 */}
          <div>
            <label className="text-sm text-white/60 mb-3 flex items-center gap-2">
              <Upload className="w-4 h-4" />
              参考图片
            </label>
            <ImageUploader
              image={img2imgConfig.referenceImage}
              onUpload={(dataUrl) => setImg2ImgConfig({ referenceImage: dataUrl })}
              onClear={() => setImg2ImgConfig({ referenceImage: null })}
            />
          </div>

          {/* 选择风格 */}
          <StyleSelector
            selectedId={img2imgConfig.styleId}
            onSelect={(id) => setImg2ImgConfig({ styleId: id })}
          />

          {/* 参考强度 */}
          <StrengthSlider
            value={img2imgConfig.referenceStrength}
            onChange={(v) => setImg2ImgConfig({ referenceStrength: v })}
          />

          {/* 附加描述 */}
          <div>
            <label className="text-sm text-white/60 mb-2 block">附加描述 (可选)</label>
            <textarea
              value={additionalPrompt}
              onChange={(e) => setAdditionalPrompt(e.target.value)}
              placeholder="补充描述，例如：增加更多细节、调整色调..."
              rows={2}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 outline-none focus:border-indigo-500/50 resize-none text-sm"
            />
          </div>

          {/* 生成按钮 */}
          <button
            onClick={handleGenerate}
            disabled={!canGenerate || isGenerating}
            className={cn(
              "w-full py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all",
              canGenerate && !isGenerating
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90"
                : "bg-white/10 text-white/40 cursor-not-allowed"
            )}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                开始生成
              </>
            )}
          </button>
        </div>

        {/* 右侧: 结果预览 */}
        <div>
          <label className="text-sm text-white/60 mb-3 block flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            生成结果
          </label>
          
          <ResultPreview isGenerating={isGenerating} result={result} />

          {result && (
            <button className="w-full mt-4 py-3 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              下载结果
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
