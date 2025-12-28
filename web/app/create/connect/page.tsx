"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Link2, Upload, Globe, ArrowRight, FileText, CheckCircle 
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { useCampaignStore } from "@/lib/stores/campaign-store";

// ========================================
// 类型定义
// ========================================
type InputMethod = 'url' | 'manual';

// ========================================
// 组件
// ========================================
export default function ProductConnectPage() {
  const router = useRouter();
  const { adAnalysis, updateInput, setPhase } = useCampaignStore();
  
  const [method, setMethod] = useState<InputMethod>('manual');
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // 手动输入表单
  const [form, setForm] = useState({
    name: "",
    category: "Casual",
    description: "",
    icon: "",
  });

  // 模拟 URL 解析
  const handleUrlParse = async () => {
    if (!url) return;
    setIsLoading(true);
    
    // Mock: 模拟解析延迟
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock: 从 URL 提取信息
    const mockInfo = {
      name: url.includes('duolingo') ? 'Duolingo' : 'My Awesome Game',
      icon: '🎮',
      description: '从链接自动提取的游戏描述',
      category: 'Education',
    };
    
    setForm({
      name: mockInfo.name,
      category: mockInfo.category,
      description: mockInfo.description,
      icon: mockInfo.icon,
    });
    
    setIsLoading(false);
  };

  // 提交产品信息
  const handleSubmit = () => {
    updateInput({
      productName: form.name,
      productDesc: form.description,
    });
    
    setPhase('input'); // Reset to input for strategy phase if needed, but here we just go to strategy page
    router.push('/create/strategy');
  };

  const isFormValid = form.name && form.category && form.description;

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 mx-auto flex items-center justify-center shadow-2xl"
          >
            <Link2 className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold">连接你的产品</h1>
          <p className="text-white/50">
            输入产品信息，AI 将基于竞品洞察为你生成定制广告素材
          </p>
        </div>

        {/* 竞品洞察卡片 (如果有) */}
        {adAnalysis && (
          <GlassCard className="p-4 border-indigo-500/30 bg-indigo-500/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/20">
                <Globe className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <div className="text-sm font-medium">已加载竞品洞察</div>
                <div className="text-xs text-white/50">
                  {adAnalysis.strategy}
                </div>
              </div>
              <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
            </div>
          </GlassCard>
        )}

        {/* 输入方式切换 */}
        <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
          {[
            { id: 'manual' as InputMethod, label: '手动输入', icon: <FileText className="w-4 h-4" /> },
            { id: 'url' as InputMethod, label: '链接解析', icon: <Link2 className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMethod(tab.id)}
              className={`flex-1 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                method === tab.id 
                  ? 'bg-white/10 text-white' 
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* URL 输入 */}
        <AnimatePresence mode="wait">
          {method === 'url' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <GlassCard className="p-4">
                <label className="text-xs text-white/50 block mb-2">App Store / Google Play / 网页链接</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://apps.apple.com/..."
                    className="flex-1 bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={handleUrlParse}
                    disabled={!url || isLoading}
                    className="px-6 py-3 bg-indigo-500 text-white rounded-lg font-medium disabled:opacity-50 hover:bg-indigo-600 transition-colors"
                  >
                    {isLoading ? '解析中...' : '解析'}
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 手动输入表单 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <GlassCard className="p-6 space-y-5">
            {/* 游戏名称 */}
            <div>
              <label className="text-xs text-white/50 block mb-2">游戏名称 *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="例如: 消消乐大师"
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* 游戏类型 */}
            <div>
              <label className="text-xs text-white/50 block mb-2">游戏类型 *</label>
              <div className="grid grid-cols-4 gap-2">
                {['Casual', 'Puzzle', 'Runner', 'Strategy'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setForm({ ...form, category: cat })}
                    className={`py-2 rounded-lg text-sm transition-all ${
                      form.category === cat 
                        ? 'bg-indigo-500 text-white' 
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 游戏描述 */}
            <div>
              <label className="text-xs text-white/50 block mb-2">核心玩法描述 *</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="用一两句话描述你的游戏核心玩法..."
                rows={3}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            {/* 素材上传提示 */}
            <div className="border border-dashed border-white/20 rounded-xl p-6 text-center">
              <Upload className="w-8 h-8 text-white/30 mx-auto mb-2" />
              <div className="text-sm text-white/50">上传游戏截图/录屏（可选）</div>
              <div className="text-xs text-white/30 mt-1">支持 PNG, JPG, MP4</div>
            </div>
          </GlassCard>

          {/* 提交按钮 */}
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
          >
            下一步：策略配置
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>

      </div>
    </div>
  );
}
