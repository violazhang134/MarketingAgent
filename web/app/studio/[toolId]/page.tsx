"use client";

import { useState, useCallback, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Upload, Sparkles, Download, RefreshCw, X, Check,
  Zap, Grid3X3, Box, Layers, Palette, Eraser, Replace,
  Scissors, PenLine, ZoomIn, Expand, Image as ImageIcon
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getToolById, buildPrompt } from "@/lib/data/tool-templates";

// ========================================
// 工具工作区页面 - 完整版
// 职责: 单个工具的完整操作界面 + Mock 生成
// ========================================

// ========================================
// 工具配置
// ========================================
const TOOL_CONFIG: Record<string, {
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  inputs: ('prompt' | 'image' | 'mask')[];
  options?: { id: string; label: string; type: 'select' | 'slider'; options?: string[]; min?: number; max?: number; default?: string | number }[];
}> = {
  text2img: {
    name: '一键成稿',
    description: '输入描述，AI 自动生成高质量游戏素材',
    icon: Zap,
    color: 'from-purple-500 to-indigo-500',
    inputs: ['prompt'],
    options: [
      { id: 'style', label: '风格', type: 'select', options: ['Q版', '二次元', '3D渲染', '像素风', '写实'], default: 'Q版' },
      { id: 'ratio', label: '比例', type: 'select', options: ['1:1', '16:9', '9:16', '4:3'], default: '1:1' },
      { id: 'count', label: '生成数量', type: 'select', options: ['1', '2', '4'], default: '4' },
    ]
  },
  variation: {
    name: '相似图裂变',
    description: '上传参考图，生成多种风格变体',
    icon: Grid3X3,
    color: 'from-pink-500 to-rose-500',
    inputs: ['image'],
    options: [
      { id: 'count', label: '生成数量', type: 'select', options: ['4', '6', '9'], default: '4' },
      { id: 'strength', label: '变化强度', type: 'slider', min: 0, max: 100, default: 50 },
    ]
  },
  pixel: {
    name: '像素图转换',
    description: '将图片转换为精准像素风格',
    icon: Box,
    color: 'from-emerald-500 to-teal-500',
    inputs: ['image'],
    options: [
      { id: 'size', label: '像素尺寸', type: 'select', options: ['16x16', '32x32', '64x64', '128x128'], default: '32x32' },
      { id: 'palette', label: '色板', type: 'select', options: ['自动', 'GameBoy', 'NES', 'SNES'], default: '自动' },
    ]
  },
  detail: {
    name: '丰富细节',
    description: '高效提升画面细节精度',
    icon: Layers,
    color: 'from-amber-500 to-orange-500',
    inputs: ['image'],
    options: [
      { id: 'strength', label: '细节强度', type: 'slider', min: 0, max: 100, default: 70 },
    ]
  },
  refine: {
    name: '局部细化',
    description: '涂抹选区，局部区域精细优化',
    icon: Palette,
    color: 'from-cyan-500 to-blue-500',
    inputs: ['image', 'mask'],
  },
  erase: {
    name: '智能擦除',
    description: '涂抹要删除的区域，AI 自动修复',
    icon: Eraser,
    color: 'from-red-500 to-pink-500',
    inputs: ['image', 'mask'],
  },
  replace: {
    name: '局部替换',
    description: '选择区域并描述替换内容',
    icon: Replace,
    color: 'from-violet-500 to-purple-500',
    inputs: ['image', 'mask', 'prompt'],
  },
  cutout: {
    name: '一键抠图',
    description: '智能识别主体，一键移除背景',
    icon: Scissors,
    color: 'from-lime-500 to-green-500',
    inputs: ['image'],
  },
  lineart: {
    name: '线稿提取',
    description: '从图片中提取清晰线稿',
    icon: PenLine,
    color: 'from-slate-500 to-gray-500',
    inputs: ['image'],
    options: [
      { id: 'thickness', label: '线条粗细', type: 'slider', min: 1, max: 10, default: 3 },
    ]
  },
  upscale: {
    name: '超清放大',
    description: '无损放大图片，提升分辨率',
    icon: ZoomIn,
    color: 'from-blue-500 to-indigo-500',
    inputs: ['image'],
    options: [
      { id: 'scale', label: '放大倍数', type: 'select', options: ['2x', '4x', '8x'], default: '4x' },
    ]
  },
  outpaint: {
    name: '智能扩图',
    description: '向外扩展画布，AI 自动补全',
    icon: Expand,
    color: 'from-fuchsia-500 to-pink-500',
    inputs: ['image'],
    options: [
      { id: 'direction', label: '扩展方向', type: 'select', options: ['上', '下', '左', '右', '全方向'], default: '全方向' },
      { id: 'size', label: '扩展比例', type: 'select', options: ['1.5x', '2x', '3x'], default: '2x' },
    ]
  },
};

// Mock 生成结果（渐变色块模拟）
const MOCK_GRADIENTS = [
  'from-purple-500 via-pink-500 to-red-500',
  'from-blue-500 via-cyan-500 to-teal-500',
  'from-amber-500 via-orange-500 to-red-500',
  'from-emerald-500 via-green-500 to-lime-500',
  'from-indigo-500 via-purple-500 to-pink-500',
  'from-rose-500 via-fuchsia-500 to-violet-500',
];

// ========================================
// 组件: 图片上传区域
// ========================================
function ImageUploader({ 
  onUpload, 
  preview 
}: { 
  onUpload: (file: File) => void;
  preview?: string;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) {
      onUpload(file);
    }
  }, [onUpload]);

  if (preview) {
    return (
      <div className="relative rounded-2xl overflow-hidden border border-white/10">
        <div className="aspect-square bg-gradient-to-br from-indigo-900/50 to-purple-900/50 flex items-center justify-center">
          <ImageIcon className="w-16 h-16 text-white/30" />
        </div>
        <button 
          onClick={() => onUpload(null as unknown as File)}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
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
        "relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer",
        isDragging 
          ? "border-indigo-500 bg-indigo-500/10" 
          : "border-white/20 hover:border-white/40 hover:bg-white/5"
      )}
    >
      <Upload className="w-12 h-12 mx-auto mb-4 text-white/30" />
      <p className="text-white/60 text-sm">拖拽图片到此处，或点击上传</p>
      <p className="text-white/30 text-xs mt-2">支持 JPG、PNG、WebP，最大 10MB</p>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
    </div>
  );
}

// ========================================
// 组件: 提示词输入
// ========================================
function PromptInput({ value, onChange, placeholder }: { 
  value: string; 
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const suggestions = ['可爱的橘猫角色', '赛博朋克风格城市', '像素风游戏道具', 'Q版武器装备'];
  
  return (
    <div className="space-y-3">
      <div className="bg-white/5 rounded-xl border border-white/10 p-4 focus-within:border-indigo-500/50 transition-colors">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "描述你想要的画面，例如：可爱的橘猫游戏角色，Q版风格，白色背景..."}
          className="w-full bg-transparent text-white placeholder:text-white/30 resize-none outline-none min-h-[100px] text-sm"
        />
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
          <span className="text-[10px] text-white/30">{value.length} 字符</span>
          <button 
            onClick={() => onChange('')}
            className="text-[10px] text-white/40 hover:text-white/60"
          >
            清空
          </button>
        </div>
      </div>
      
      {/* 快捷提示词 */}
      <div className="flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onChange(s)}
            className="px-3 py-1 rounded-full text-[11px] bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

// ========================================
// 组件: 选项控制
// ========================================
function OptionControl({ 
  option, 
  value, 
  onChange 
}: { 
  option: NonNullable<typeof TOOL_CONFIG[string]['options']>[number];
  value: string | number;
  onChange: (v: string | number) => void;
}) {
  return (
    <div className="flex items-center justify-between bg-white/5 rounded-xl p-3 border border-white/10">
      <span className="text-sm text-white/80">{option.label}</span>
      {option.type === 'select' && (
        <select 
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className="bg-white/10 rounded-lg px-3 py-1.5 text-sm text-white border-none outline-none cursor-pointer"
        >
          {option.options?.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      )}
      {option.type === 'slider' && (
        <div className="flex items-center gap-3">
          <input 
            type="range" 
            min={option.min} 
            max={option.max} 
            value={value as number}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-24 accent-indigo-500" 
          />
          <span className="text-sm text-white/60 w-8 text-right">{value}</span>
        </div>
      )}
    </div>
  );
}

// ========================================
// 组件: 结果卡片
// ========================================
function ResultCard({ 
  index, 
  gradient, 
  selected, 
  onSelect 
}: { 
  index: number;
  gradient: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      onClick={onSelect}
      className={cn(
        "relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all",
        selected ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-obsidian" : "hover:ring-1 hover:ring-white/30"
      )}
    >
      <div className={cn("w-full h-full bg-gradient-to-br", gradient)} />
      <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 text-[10px] text-white/60">
        <Sparkles className="w-3 h-3" />
        Mock
      </div>
      {selected && (
        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
    </motion.div>
  );
}

// ========================================
// 组件: 结果预览区
// ========================================
function ResultsArea({ 
  isGenerating, 
  results, 
  selectedIndex,
  onSelect 
}: { 
  isGenerating: boolean;
  results: string[];
  selectedIndex: number;
  onSelect: (i: number) => void;
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
        <p className="text-white/40 text-sm mt-4">AI 正在创作中...</p>
        <p className="text-white/20 text-xs mt-1">预计需要 3-5 秒</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="aspect-square bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center">
        <Sparkles className="w-16 h-16 text-white/10 mb-4" />
        <p className="text-white/30 text-sm">生成结果将显示在这里</p>
        <p className="text-white/20 text-xs mt-1">填写描述后点击"开始生成"</p>
      </div>
    );
  }

  // 多结果网格
  const gridCols = results.length === 1 ? 'grid-cols-1' : results.length <= 4 ? 'grid-cols-2' : 'grid-cols-3';
  
  return (
    <div className={cn("grid gap-3", gridCols)}>
      {results.map((gradient, i) => (
        <ResultCard
          key={i}
          index={i}
          gradient={gradient}
          selected={selectedIndex === i}
          onSelect={() => onSelect(i)}
        />
      ))}
    </div>
  );
}

// ========================================
// 主页面
// ========================================
export default function ToolWorkspace({ params }: { params: Promise<{ toolId: string }> }) {
  const { toolId } = use(params);
  const [prompt, setPrompt] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [selectedResult, setSelectedResult] = useState(0);
  const [options, setOptions] = useState<Record<string, string | number>>({});

  const config = TOOL_CONFIG[toolId];
  
  if (!config) {
    return (
      <main className="min-h-screen bg-obsidian text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40">工具不存在</p>
          <Link href="/studio" className="text-indigo-400 mt-4 inline-block">返回工作室</Link>
        </div>
      </main>
    );
  }

  const Icon = config.icon;

  // 真实 API 生成 - 使用工具模板，支持文生图和图生图
  const handleGenerate = async () => {
    setIsGenerating(true);
    setResults([]);
    
    const count = Number(options['count'] || 1);
    
    // 从模板库获取工具配置
    const toolTemplate = getToolById(toolId);
    
    // 构建提示词（使用模板系统）
    let fullPrompt: string;
    let negativePrompt = '';
    
    if (toolTemplate) {
      const built = buildPrompt(toolTemplate, prompt, options);
      fullPrompt = built.prompt;
      negativePrompt = built.negativePrompt;
    } else {
      // 回退到基础提示词
      fullPrompt = `${prompt}，游戏美术素材，高品质渲染`;
    }
    
    // 逐个生成（API 每次只返回一张）
    const generatedImages: string[] = [];
    
    for (let i = 0; i < count; i++) {
      try {
        // 构建请求体
        const requestBody: Record<string, unknown> = {
          prompt: fullPrompt,
          negativePrompt,
          size: '2K',
          toolId,
        };
        
        // 如果工具需要图片输入（图生图类工具）
        if (config.inputs.includes('image') && uploadedImage) {
          requestBody.referenceImage = uploadedImage;
          
          // 根据工具类型添加特定参数
          if (toolId === 'variation') {
            requestBody.strength = Number(options['strength'] || 50) / 100;
          } else if (toolId === 'pixel') {
            requestBody.pixelSize = options['size'] || '32x32';
            requestBody.palette = options['palette'] || '自动';
          } else if (toolId === 'detail') {
            requestBody.detailStrength = Number(options['strength'] || 70) / 100;
          } else if (toolId === 'upscale') {
            requestBody.scale = options['scale'] || '4x';
          } else if (toolId === 'outpaint') {
            requestBody.direction = options['direction'] || '全方向';
            requestBody.expandSize = options['size'] || '2x';
          } else if (toolId === 'lineart') {
            requestBody.thickness = options['thickness'] || 3;
          }
        }
        
        const response = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });
        
        const data = await response.json();
        
        if (data.success && data.images?.[0]) {
          generatedImages.push(data.images[0]);
          setResults([...generatedImages]);
        } else {
          // 失败时使用渐变占位
          console.error('[ToolWorkspace] API failed:', data.error);
          generatedImages.push(MOCK_GRADIENTS[i % MOCK_GRADIENTS.length]);
          setResults([...generatedImages]);
        }
      } catch (error) {
        console.error('[ToolWorkspace] Generate error:', error);
        generatedImages.push(MOCK_GRADIENTS[i % MOCK_GRADIENTS.length]);
        setResults([...generatedImages]);
      }
    }
    
    setSelectedResult(0);
    setIsGenerating(false);
  };

  // 获取选项值
  const getOptionValue = (id: string) => {
    if (options[id] !== undefined) return options[id];
    const opt = config.options?.find(o => o.id === id);
    return opt?.default ?? (opt?.type === 'slider' ? opt.min : opt?.options?.[0]);
  };

  // 判断是否可以生成
  const canGenerate = 
    (config.inputs.includes('prompt') ? prompt.trim().length > 0 : true) &&
    (config.inputs.includes('image') ? uploadedImage !== null : true);

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
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center", config.color)}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{config.name}</h1>
            <p className="text-white/40 text-sm">{config.description}</p>
          </div>
        </div>
      </div>

      {/* 工作区 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 左侧：输入区 */}
        <div className="space-y-6">
          {/* 图片上传 */}
          {config.inputs.includes('image') && (
            <div>
              <h3 className="text-sm text-white/60 mb-3 flex items-center gap-2">
                <Upload className="w-4 h-4" />
                上传图片
              </h3>
              <ImageUploader 
                onUpload={(file) => {
                  if (file) {
                    setUploadedImage(URL.createObjectURL(file));
                  } else {
                    setUploadedImage(null);
                  }
                }}
                preview={uploadedImage ?? undefined}
              />
            </div>
          )}

          {/* 提示词输入 */}
          {config.inputs.includes('prompt') && (
            <div>
              <h3 className="text-sm text-white/60 mb-3 flex items-center gap-2">
                <PenLine className="w-4 h-4" />
                描述
              </h3>
              <PromptInput value={prompt} onChange={setPrompt} />
            </div>
          )}

          {/* 选项 */}
          {config.options && config.options.length > 0 && (
            <div>
              <h3 className="text-sm text-white/60 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                生成选项
              </h3>
              <div className="space-y-3">
                {config.options.map((opt) => (
                  <OptionControl
                    key={opt.id}
                    option={opt}
                    value={getOptionValue(opt.id) as string | number}
                    onChange={(v) => setOptions(prev => ({ ...prev, [opt.id]: v }))}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 生成按钮 */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !canGenerate}
            className={cn(
              "w-full py-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all",
              isGenerating || !canGenerate
                ? "bg-white/10 cursor-not-allowed text-white/40" 
                : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90"
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

          {!canGenerate && !isGenerating && (
            <p className="text-center text-white/30 text-xs">
              {config.inputs.includes('prompt') && !prompt.trim() && '请输入描述'}
              {config.inputs.includes('image') && !uploadedImage && '请上传图片'}
            </p>
          )}
        </div>

        {/* 右侧：结果预览 */}
        <div>
          <h3 className="text-sm text-white/60 mb-3 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            生成结果
            {results.length > 0 && (
              <span className="text-white/30">· 点击选择</span>
            )}
          </h3>
          
          <ResultsArea
            isGenerating={isGenerating}
            results={results}
            selectedIndex={selectedResult}
            onSelect={setSelectedResult}
          />
          
          {/* 操作按钮 */}
          <AnimatePresence>
            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex gap-3 mt-4"
              >
                <button className="flex-1 py-3 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  下载选中
                </button>
                <button className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  重新生成
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
