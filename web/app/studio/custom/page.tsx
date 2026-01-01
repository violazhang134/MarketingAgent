"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Plus, Save, Trash2, Sparkles, RefreshCw, Edit3, X
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useStudioStore, UserStyle } from "@/lib/stores/studio-store";

// ========================================
// 自定义风格编辑器
// 职责: 创建/编辑/管理用户自定义风格
// ========================================

// ========================================
// 组件: 风格卡片
// ========================================
function StyleCard({ 
  style, 
  onEdit, 
  onDelete 
}: { 
  style: UserStyle;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative rounded-xl overflow-hidden border border-white/10 bg-white/5"
    >
      <div className={cn("h-24 bg-gradient-to-br", style.previewGradient)} />
      <div className="p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white">{style.name}</span>
          <div className="flex gap-1">
            <button 
              onClick={onEdit}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-white/40" />
            </button>
            <button 
              onClick={onDelete}
              className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400/60" />
            </button>
          </div>
        </div>
        <p className="text-[10px] text-white/30 mt-1 line-clamp-2">{style.basePrompt}</p>
        <div className="flex gap-1 mt-2">
          {style.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[9px] text-white/40 bg-white/5 px-1.5 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ========================================
// 组件: 编辑器弹窗
// ========================================
function EditorModal({ 
  isOpen, 
  onClose, 
  editingStyle,
  onSave 
}: { 
  isOpen: boolean;
  onClose: () => void;
  editingStyle: UserStyle | null;
  onSave: (data: Omit<UserStyle, 'id' | 'createdAt' | 'updatedAt'>) => void;
}) {
  const [name, setName] = useState(editingStyle?.name || '');
  const [basePrompt, setBasePrompt] = useState(editingStyle?.basePrompt || '');
  const [negativePrompt, setNegativePrompt] = useState(editingStyle?.negativePrompt || '');
  const [tags, setTags] = useState(editingStyle?.tags.join(', ') || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!name.trim() || !basePrompt.trim()) return;
    
    onSave({
      name: name.trim(),
      basePrompt: basePrompt.trim(),
      negativePrompt: negativePrompt.trim(),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      previewGradient: editingStyle?.previewGradient || '',
    });
    onClose();
  };

  // 真实 API 测试生成
  const handleTestGenerate = async () => {
    setIsGenerating(true);
    setPreviewImage(null);
    
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: basePrompt + '，游戏UI界面设计示例',
          negativePrompt: negativePrompt,
          size: '2K',
        }),
      });
      
      const data = await response.json();
      
      if (data.success && data.images?.[0]) {
        setPreviewImage(data.images[0]);
      }
    } catch (error) {
      console.error('[CustomStyle] Test generate error:', error);
    }
    
    setIsGenerating(false);
  };

  return (
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
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl max-h-[85vh] overflow-y-auto bg-obsidian/95 backdrop-blur-xl border border-white/10 rounded-2xl z-50 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {editingStyle ? '编辑风格' : '创建新风格'}
          </h2>
          <button onClick={onClose} className="text-white/40 hover:text-white p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5">
          {/* 风格名称 */}
          <div>
            <label className="text-sm text-white/60 mb-2 block">风格名称</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：萌系二次元"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 outline-none focus:border-indigo-500/50"
            />
          </div>

          {/* 正向提示词 */}
          <div>
            <label className="text-sm text-white/60 mb-2 block">正向提示词 (核心视觉描述)</label>
            <textarea
              value={basePrompt}
              onChange={(e) => setBasePrompt(e.target.value)}
              placeholder="描述你想要的视觉风格，例如：可爱卡通风格，圆润造型，高饱和度色彩，柔和阴影..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 outline-none focus:border-indigo-500/50 resize-none"
            />
          </div>

          {/* 负向提示词 */}
          <div>
            <label className="text-sm text-white/60 mb-2 block">负向提示词 (排除元素)</label>
            <textarea
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="描述要排除的元素，例如：写实风格，暗色调，恐怖元素..."
              rows={2}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 outline-none focus:border-indigo-500/50 resize-none"
            />
          </div>

          {/* 标签 */}
          <div>
            <label className="text-sm text-white/60 mb-2 block">标签 (逗号分隔)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="例如：可爱, 卡通, 2D"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 outline-none focus:border-indigo-500/50"
            />
          </div>

          {/* 测试生成 */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-white/80">测试生成</div>
                <div className="text-[10px] text-white/40">生成一张预览图验证效果</div>
              </div>
              <button
                onClick={handleTestGenerate}
                disabled={!basePrompt.trim() || isGenerating}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm flex items-center gap-2",
                  basePrompt.trim() && !isGenerating
                    ? "bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30"
                    : "bg-white/5 text-white/30 cursor-not-allowed"
                )}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    测试
                  </>
                )}
              </button>
            </div>
            
            {/* 预览图片 */}
            {previewImage && (
              <div className="mt-4">
                <img src={previewImage} alt="Preview" className="w-full rounded-lg" />
              </div>
            )}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || !basePrompt.trim()}
            className={cn(
              "px-5 py-2.5 rounded-xl font-medium flex items-center gap-2",
              name.trim() && basePrompt.trim()
                ? "bg-indigo-500 text-white hover:bg-indigo-600"
                : "bg-white/10 text-white/40 cursor-not-allowed"
            )}
          >
            <Save className="w-4 h-4" />
            保存风格
          </button>
        </div>
      </motion.div>
    </>
  );
}

// ========================================
// 主页面
// ========================================
export default function CustomStylePage() {
  const { userStyles, addUserStyle, updateUserStyle, deleteUserStyle } = useStudioStore();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingStyle, setEditingStyle] = useState<UserStyle | null>(null);

  const handleCreate = () => {
    setEditingStyle(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (style: UserStyle) => {
    setEditingStyle(style);
    setIsEditorOpen(true);
  };

  const handleSave = (data: Omit<UserStyle, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingStyle) {
      updateUserStyle(editingStyle.id, data);
    } else {
      addUserStyle(data);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个风格吗？')) {
      deleteUserStyle(id);
    }
  };

  return (
    <main className="min-h-screen bg-obsidian text-white p-6 pb-28">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link 
            href="/studio"
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">我的风格库</h1>
            <p className="text-white/40 text-sm">创建和管理自定义视觉风格</p>
          </div>
        </div>
        
        <button
          onClick={handleCreate}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:opacity-90 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          新建风格
        </button>
      </div>

      {/* 风格网格 */}
      {userStyles.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {userStyles.map((style) => (
            <StyleCard
              key={style.id}
              style={style}
              onEdit={() => handleEdit(style)}
              onDelete={() => handleDelete(style.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-white/10" />
          <p className="text-white/40">还没有自定义风格</p>
          <p className="text-white/20 text-sm mt-1">点击"新建风格"开始创建</p>
        </div>
      )}

      {/* 编辑器弹窗 */}
      <EditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        editingStyle={editingStyle}
        onSave={handleSave}
      />
    </main>
  );
}
