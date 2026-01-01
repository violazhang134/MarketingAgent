"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, History, Wand2, ChevronRight, X, Zap,
  ImagePlus, Grid3X3, Eraser, Replace, Scissors, 
  PenLine, ZoomIn, Expand, Palette, Layers, Box,
  Blend, Upload, Plus, Package
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ========================================
// 游戏生图工作室 - 完整版
// 职责: 模型广场 + 创作工具 + 历史记录
// ========================================

// ========================================
// 类型定义
// ========================================
interface StyleModel {
  id: string;
  name: string;
  cover: string;
  tags: string[];
  hot?: boolean;
}

interface GenerationRecord {
  id: string;
  prompt: string;
  imageUrl: string;
  model: string;
  createdAt: string;
}

interface ArtTool {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: 'generate' | 'edit' | 'enhance';
  hot?: boolean;
  beta?: boolean;
}

// ========================================
// 工具模板数据
// ========================================
const ART_TOOLS: ArtTool[] = [
  // 灵感创意生成
  { id: 'text2img', name: '一键成稿', description: '文生图、图生图工作流', icon: Zap, category: 'generate', hot: true },
  { id: 'variation', name: '相似图裂变', description: '参考生成多种风格相似图', icon: Grid3X3, category: 'generate' },
  { id: 'pixel', name: '像素图转换', description: '一键转换精准像素图', icon: Box, category: 'generate', beta: true },
  
  // 局部编辑
  { id: 'detail', name: '丰富细节', description: '高效提升细节精度', icon: Layers, category: 'edit' },
  { id: 'refine', name: '局部细化', description: '指定画面区域进一步细化', icon: Palette, category: 'edit' },
  { id: 'erase', name: '智能擦除', description: '去除画面瑕疵或不需要的元素', icon: Eraser, category: 'edit' },
  { id: 'replace', name: '局部替换', description: '精准替换指定区域内容', icon: Replace, category: 'edit' },
  
  // 图像处理
  { id: 'cutout', name: '一键抠图', description: '保持主体完好，一键移除背景', icon: Scissors, category: 'enhance' },
  { id: 'lineart', name: '线稿提取', description: '快速生成高质量线稿', icon: PenLine, category: 'enhance' },
  { id: 'upscale', name: '超清放大', description: '一键提升画质细节，呈现超清效果', icon: ZoomIn, category: 'enhance' },
  { id: 'outpaint', name: '智能扩图', description: '清选择所需要扩展的图片与尺寸', icon: Expand, category: 'enhance' },
];

const TOOL_CATEGORIES = [
  { id: 'generate', name: '灵感创意生成', color: 'from-purple-500 to-indigo-500' },
  { id: 'edit', name: '局部编辑、成稿提质', color: 'from-emerald-500 to-teal-500' },
  { id: 'enhance', name: '图像处理', color: 'from-orange-500 to-pink-500' },
];

// ========================================
// Mock 数据
// ========================================
const STYLE_TAGS = [
  "全部", "Q版", "二次元", "3D渲染", "像素风", "赛博朋克", 
  "水墨风", "扁平插画", "写实", "厚涂"
];

const MOCK_MODELS: StyleModel[] = [
  { id: "1", name: "Q版卡通角色", cover: "/placeholder-1.jpg", tags: ["Q版"], hot: true },
  { id: "2", name: "二次元立绘", cover: "/placeholder-2.jpg", tags: ["二次元"], hot: true },
  { id: "3", name: "3D游戏道具", cover: "/placeholder-3.jpg", tags: ["3D渲染"] },
  { id: "4", name: "像素风场景", cover: "/placeholder-4.jpg", tags: ["像素风"] },
  { id: "5", name: "赛博朋克UI", cover: "/placeholder-5.jpg", tags: ["赛博朋克"] },
  { id: "6", name: "水墨山水", cover: "/placeholder-6.jpg", tags: ["水墨风"] },
  { id: "7", name: "扁平图标", cover: "/placeholder-7.jpg", tags: ["扁平插画"] },
  { id: "8", name: "写实角色", cover: "/placeholder-8.jpg", tags: ["写实"] },
];

const MOCK_HISTORY: GenerationRecord[] = [
  { id: "h1", prompt: "可爱的橘猫角色", imageUrl: "/placeholder-1.jpg", model: "Q版卡通", createdAt: "2024-12-31 10:00" },
  { id: "h2", prompt: "赛博朋克城市", imageUrl: "/placeholder-2.jpg", model: "赛博朋克", createdAt: "2024-12-30 15:30" },
];

// ========================================
// 组件: 风格标签栏
// ========================================
function StyleFilter({ selected, onSelect }: { selected: string; onSelect: (tag: string) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {STYLE_TAGS.map((tag) => (
        <button
          key={tag}
          onClick={() => onSelect(tag)}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all",
            selected === tag
              ? "bg-indigo-500 text-white"
              : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
          )}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}

// ========================================
// 组件: 模型卡片
// ========================================
function ModelCard({ model, onClick }: { model: StyleModel; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative rounded-2xl overflow-hidden cursor-pointer bg-white/5 backdrop-blur-sm border border-white/10"
    >
      <div className="aspect-square bg-gradient-to-br from-indigo-900/50 to-purple-900/50 flex items-center justify-center">
        <Sparkles className="w-12 h-12 text-white/20" />
      </div>
      
      <div className="p-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white truncate">{model.name}</span>
          {model.hot && (
            <span className="px-1.5 py-0.5 text-[10px] bg-gradient-to-r from-orange-500 to-pink-500 rounded text-white">
              热门
            </span>
          )}
        </div>
        <div className="flex gap-1 mt-1.5">
          {model.tags.map((tag) => (
            <span key={tag} className="text-[10px] text-white/40 bg-white/5 px-1.5 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div className="px-4 py-2 bg-indigo-500 rounded-full text-sm font-medium text-white flex items-center gap-1">
          开始创作 <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
}

// ========================================
// 组件: 工具卡片
// ========================================
function ToolCard({ tool, onClick }: { tool: ArtTool; onClick: () => void }) {
  const Icon = tool.icon;
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative rounded-xl overflow-hidden cursor-pointer bg-white/5 backdrop-blur-sm border border-white/10 p-4 hover:bg-white/10 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-indigo-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white">{tool.name}</span>
            {tool.hot && (
              <span className="px-1.5 py-0.5 text-[9px] bg-gradient-to-r from-orange-500 to-pink-500 rounded text-white">
                热门
              </span>
            )}
            {tool.beta && (
              <span className="px-1.5 py-0.5 text-[9px] bg-indigo-500/50 rounded text-indigo-200">
                Beta
              </span>
            )}
          </div>
          <p className="text-[11px] text-white/40 mt-1 line-clamp-2">{tool.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ========================================
// 组件: 创作工具弹窗
// ========================================
function ToolModal({ isOpen, onClose, onSelectTool }: { 
  isOpen: boolean; 
  onClose: () => void;
  onSelectTool: (toolId: string) => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-3xl max-h-[80vh] overflow-y-auto bg-obsidian/95 backdrop-blur-xl border border-white/10 rounded-2xl z-50 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ImagePlus className="w-6 h-6 text-indigo-400" />
                创作工具
              </h2>
              <button onClick={onClose} className="text-white/40 hover:text-white p-2">
                <X className="w-5 h-5" />
              </button>
            </div>

            {TOOL_CATEGORIES.map((category) => (
              <div key={category.id} className="mb-6">
                <h3 className="text-xs text-white/40 uppercase tracking-wider mb-3">{category.name}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ART_TOOLS.filter((t) => t.category === category.id).map((tool) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      onClick={() => {
                        onSelectTool(tool.id);
                        onClose();
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ========================================
// 组件: 历史记录侧边栏
// ========================================
function HistorySidebar({ isOpen, onClose, records }: { 
  isOpen: boolean; 
  onClose: () => void; 
  records: GenerationRecord[];
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-80 bg-obsidian/95 backdrop-blur-xl border-l border-white/10 z-50 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-400" />
                生成历史
              </h2>
              <button onClick={onClose} className="text-white/40 hover:text-white">✕</button>
            </div>

            <div className="space-y-4">
              {records.length === 0 ? (
                <p className="text-white/40 text-sm text-center py-8">暂无生成记录</p>
              ) : (
                records.map((record) => (
                  <div key={record.id} className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <div className="aspect-video bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-lg mb-2 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-white/20" />
                    </div>
                    <p className="text-sm text-white truncate">{record.prompt}</p>
                    <p className="text-[10px] text-white/40 mt-1">{record.model} · {record.createdAt}</p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ========================================
// 主页面
// ========================================
export default function StudioPage() {
  const [selectedTag, setSelectedTag] = useState("全部");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [toolModalOpen, setToolModalOpen] = useState(false);

  const filteredModels = selectedTag === "全部"
    ? MOCK_MODELS
    : MOCK_MODELS.filter((m) => m.tags.includes(selectedTag));

  const handleSelectTool = (toolId: string) => {
    // 导航到工具工作区
    window.location.href = `/studio/${toolId}`;
  };

  return (
    <main className="min-h-screen bg-obsidian text-white p-6 pb-28">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-indigo-400" />
            游戏生图工作室
          </h1>
          <p className="text-white/40 text-sm mt-1">选择风格模型，一键生成游戏素材</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setToolModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:opacity-90 transition-all flex items-center gap-2"
          >
            <ImagePlus className="w-4 h-4" />
            创作工具
          </button>
          <button
            onClick={() => setHistoryOpen(true)}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <History className="w-4 h-4" />
            历史记录
          </button>
        </div>
      </div>

      {/* 高级功能快捷入口 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Link
          href="/studio/kit"
          className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 hover:border-indigo-500/50 transition-all group"
        >
          <Package className="w-6 h-6 text-indigo-400 mb-2" />
          <div className="text-sm font-medium text-white">UI 套件生成</div>
          <div className="text-[10px] text-white/40">一键生成全套游戏界面</div>
        </Link>
        
        <Link
          href="/studio/custom"
          className="p-4 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/30 hover:border-pink-500/50 transition-all group"
        >
          <Plus className="w-6 h-6 text-pink-400 mb-2" />
          <div className="text-sm font-medium text-white">我的风格库</div>
          <div className="text-[10px] text-white/40">创建专属视觉风格</div>
        </Link>
        
        <Link
          href="/studio/img2img"
          className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 hover:border-emerald-500/50 transition-all group"
        >
          <Upload className="w-6 h-6 text-emerald-400 mb-2" />
          <div className="text-sm font-medium text-white">图生图</div>
          <div className="text-[10px] text-white/40">上传参考图快速转换</div>
        </Link>
        
        <Link
          href="/studio/fusion"
          className="p-4 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 hover:border-violet-500/50 transition-all group"
        >
          <Blend className="w-6 h-6 text-violet-400 mb-2" />
          <div className="text-sm font-medium text-white">风格融合</div>
          <div className="text-[10px] text-white/40">混合多风格创造独特效果</div>
        </Link>
      </div>

      {/* 风格筛选 */}
      <StyleFilter selected={selectedTag} onSelect={setSelectedTag} />

      {/* 模型网格 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-6">
        {filteredModels.map((model) => (
          <ModelCard
            key={model.id}
            model={model}
            onClick={() => {
              // 导航到一键成稿工具，并携带模型 ID
              window.location.href = `/studio/text2img?model=${model.id}`;
            }}
          />
        ))}
      </div>

      {/* 空状态 */}
      {filteredModels.length === 0 && (
        <div className="text-center py-20 text-white/40">
          <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>该分类下暂无模型</p>
        </div>
      )}

      {/* 创作工具弹窗 */}
      <ToolModal
        isOpen={toolModalOpen}
        onClose={() => setToolModalOpen(false)}
        onSelectTool={handleSelectTool}
      />

      {/* 历史记录侧边栏 */}
      <HistorySidebar
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        records={MOCK_HISTORY}
      />
    </main>
  );
}
