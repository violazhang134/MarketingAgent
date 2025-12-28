"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Video, FileText, Zap, Download, Copy, Check, 
  ArrowLeft, Clock, ChevronRight
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { useCampaignStore } from "@/lib/stores/campaign-store";

// ========================================
// 类型定义
// ========================================
type TabType = 'scripts' | 'copy' | 'hooks';

// ========================================
// 组件
// ========================================
export default function StudioPage() {
  const router = useRouter();
  const { 
    productName, generatedAssets, generateAssetsWorkflow 
  } = useCampaignStore();
  
  const [activeTab, setActiveTab] = useState<TabType>('scripts');
  const [selectedScript, setSelectedScript] = useState<number>(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // 生成素材 (如果由于某种原因丢失了)
  useEffect(() => {
    if (productName && !generatedAssets) {
      generateAssetsWorkflow();
    }
  }, [productName, generatedAssets, generateAssetsWorkflow]);

  // 如果没有产品信息，返回连接页
  if (!productName) {
    router.push('/create/connect');
    return null;
  }

  // 复制到剪贴板
  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const tabs = [
    { id: 'scripts' as TabType, label: '视频脚本', icon: <Video className="w-4 h-4" />, count: generatedAssets?.scripts.length || 0 },
    { id: 'copy' as TabType, label: '投放文案', icon: <FileText className="w-4 h-4" />, count: generatedAssets?.copyVariants.length || 0 },
    { id: 'hooks' as TabType, label: 'Hooks', icon: <Zap className="w-4 h-4" />, count: generatedAssets?.hooks.length || 0 },
  ];

  const currentScript = generatedAssets?.scripts[selectedScript];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => router.push('/create/strategy')}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回策略
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold">素材工作室</h1>
            <p className="text-sm text-white/50">{productName} · 已生成 {(generatedAssets?.scripts.length || 0) + (generatedAssets?.copyVariants.length || 0) + (generatedAssets?.hooks.length || 0)} 个素材</p>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Download className="w-4 h-4" />
            导出全部
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-white/10 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-t-lg text-sm flex items-center gap-2 transition-all ${
                activeTab === tab.id 
                  ? 'bg-white/10 text-white border-b-2 border-indigo-500' 
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              {tab.icon}
              {tab.label}
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* ====== 视频脚本 Tab ====== */}
        {activeTab === 'scripts' && generatedAssets && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 脚本列表 */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white/60">脚本列表</h3>
              {generatedAssets.scripts.map((script, i) => (
                <motion.div
                  key={script.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedScript(i)}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    selectedScript === i 
                      ? 'bg-indigo-500/20 border-2 border-indigo-500' 
                      : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{script.title}</span>
                    <ChevronRight className="w-4 h-4 text-white/30" />
                  </div>
                  <div className="flex gap-2 text-xs text-white/40">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{script.duration}</span>
                    <span className="capitalize">{script.platform}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 脚本详情 */}
            <div className="lg:col-span-2">
              {currentScript && (
                <GlassCard className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold">{currentScript.title}</h3>
                      <div className="flex gap-3 text-sm text-white/50 mt-1">
                        <span>{currentScript.duration}</span>
                        <span className="capitalize">{currentScript.platform}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleCopy(JSON.stringify(currentScript, null, 2), -1)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {copiedIndex === -1 ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-white/50" />}
                    </button>
                  </div>

                  {/* Hook */}
                  <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
                    <div className="text-xs text-indigo-300 mb-1">开头 Hook</div>
                    <div className="font-medium">{currentScript.hook}</div>
                  </div>

                  {/* 分镜 */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-white/60">分镜脚本</h4>
                    {currentScript.scenes.map((scene, i) => (
                      <div key={i} className="p-4 rounded-xl bg-white/5 space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-1 rounded bg-black/30 text-xs font-mono">{scene.timestamp}</span>
                          <span className="text-sm font-medium">{scene.text}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs text-white/50">
                          <div>
                            <span className="text-white/30">画面：</span>
                            {scene.visual}
                          </div>
                          <div>
                            <span className="text-white/30">音频：</span>
                            {scene.audio}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                    <div className="text-xs text-emerald-300 mb-1">结尾 CTA</div>
                    <div className="font-medium">{currentScript.cta}</div>
                  </div>
                </GlassCard>
              )}
            </div>
          </div>
        )}

        {/* ====== 文案 Tab ====== */}
        {activeTab === 'copy' && generatedAssets && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedAssets.copyVariants.map((copy, i) => (
              <GlassCard key={i} className="p-4 flex items-start justify-between gap-3">
                <p className="text-sm leading-relaxed">{copy}</p>
                <button 
                  onClick={() => handleCopy(copy, i)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors shrink-0"
                >
                  {copiedIndex === i ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white/50" />}
                </button>
              </GlassCard>
            ))}
          </div>
        )}

        {/* ====== Hooks Tab ====== */}
        {activeTab === 'hooks' && generatedAssets && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {generatedAssets.hooks.map((hook, i) => (
              <GlassCard key={i} className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-sm font-bold text-indigo-400">
                    {i + 1}
                  </div>
                  <span className="text-sm">{hook}</span>
                </div>
                <button 
                  onClick={() => handleCopy(hook, i + 100)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors shrink-0"
                >
                  {copiedIndex === i + 100 ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white/50" />}
                </button>
              </GlassCard>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
