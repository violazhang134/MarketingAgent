"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Sparkles, Zap, ArrowRight, Bot, Search, 
  Package, CheckCircle, Loader2, Activity,
  TrendingUp, Bell
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { useCampaignStore, ExperimentConfig } from "@/lib/stores/campaign-store";
import { cn } from "@/lib/utils";
import { CompetitorReportView } from "@/components/report/competitor-report-view";

// ========================================
// 辅助子组件
// ========================================
function VisualizerBar({ index }: { index: number }) {
  // Use a deterministic seed for height based on index
  const seed = (index * 1337) % 100;
  return (
    <motion.div
      className="w-full bg-indigo-500 rounded-t-sm"
      animate={{ 
        height: [`${20 + (seed % 60)}%`, `${30 + ((seed + 20) % 70)}%`, `${20 + (seed % 60)}%`] 
      }}
      transition={{ 
        duration: 1.5 + (seed % 10) / 10, 
        repeat: Infinity, 
        delay: index * 0.05,
        ease: "easeInOut"
      }}
    />
  );
}

export default function AgentModePage() {
  const router = useRouter();
  const { 
    phase, steps, currentStepIndex, 
    competitorName, productName, productDesc,
    experimentConfig, strategySummary, isOptimized,
    updateInput, setExperimentConfig,
    runAgentWorkflow, generateAssetsWorkflow 
  } = useCampaignStore();

  // 跳转到素材工作室
  const goToStudio = () => {
    router.push('/create/studio');
  };

  // 跳转到专家模式
  const goToExpertMode = () => {
    router.push('/launch/report');
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center pb-32">
      <div className={`w-full transition-all duration-500 space-y-8 ${phase === 'review' ? 'max-w-7xl' : 'max-w-2xl'}`}>
        
        {/* ====== 输入阶段 ====== */}
        <AnimatePresence mode="wait">
          {phase === 'input' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {isOptimized && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center gap-3 backdrop-blur-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-indigo-300">Playbook Optimization Active</div>
                    <div className="text-xs text-white/50">已为您加载验证过的优胜策略参数。</div>
                  </div>
                </motion.div>
              )}
              
              {/* Header */}
              <div className="text-center space-y-4">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 mx-auto flex items-center justify-center shadow-2xl shadow-indigo-500/30"
                >
                  <Bot className="w-10 h-10 text-white" />
                </motion.div>
                <h1 className="text-3xl font-bold">Agent 一键模式</h1>
                <p className="text-white/50 max-w-md mx-auto">
                  告诉我竞品和你的产品，我会自动分析并为你生成可直接投放的广告素材包
                </p>
              </div>

              {/* 输入表单 */}
              <GlassCard className="p-6 space-y-5">
                <div>
                  <label className="text-sm text-white/50 block mb-2">竞品名称</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                    <input
                      type="text"
                      value={competitorName}
                      onChange={(e) => updateInput({ competitorName: e.target.value })}
                      placeholder="例如: Candy Crush, Royal Match"
                      className="w-full bg-black/30 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-white/50 block mb-2">我的产品名称</label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => updateInput({ productName: e.target.value })}
                    placeholder="例如: 消消乐大师"
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-white/50 block mb-2">一句话描述（可选）</label>
                  <input
                    type="text"
                    value={productDesc}
                    onChange={(e) => updateInput({ productDesc: e.target.value })}
                    placeholder="例如: 一款解压休闲的消除游戏"
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </GlassCard>

              {/* 开始按钮 */}
              <button
                onClick={runAgentWorkflow}
                disabled={!competitorName || !productName}
                className="w-full py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
              >
                <Zap className="w-5 h-5" />
                一键生成投放方案
              </button>

              {/* 切换到专家模式 */}
              <div className="text-center">
                <button 
                  onClick={goToExpertMode}
                  className="text-sm text-white/40 hover:text-white/80 transition-colors"
                >
                  或者使用专家模式深入分析 →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== 执行阶段 ====== */}
        <AnimatePresence>
          {phase === 'running' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-8 py-12"
            >
              {/* Network Pulse Animation */}
              <div className="relative w-32 h-32 mx-auto">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full bg-indigo-500/20 border border-indigo-500/30"
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.6,
                      ease: "easeOut"
                    }}
                  />
                ))}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-2xl shadow-indigo-500/40 relative z-10">
                  <Bot className="w-12 h-12 text-white animate-pulse" />
                </div>
              </div>

              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Agent 正在为你工作...</h2>
                <div className="flex items-center justify-center gap-4 text-indigo-300/60 font-mono text-sm">
                   <div className="flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>策略分析中</span>
                   </div>
                   <div className="flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5 animate-bounce" />
                      <span>实时同步</span>
                   </div>
                </div>
              </div>

              <GlassCard className="p-8 space-y-5 border-white/5 bg-white/5">
                {steps.map((step, i) => (
                  <motion.div 
                    key={step.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ 
                      opacity: step.status !== 'pending' ? 1 : 0.3,
                      x: 0 
                    }}
                    className="flex items-center gap-4"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-500 ${
                      step.status === 'done' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      step.status === 'running' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-white/5 text-white/20 border border-white/5'
                    }`}>
                      {step.status === 'done' && <CheckCircle className="w-6 h-6" />}
                      {step.status === 'running' && <Loader2 className="w-6 h-6 animate-spin" />}
                      {step.status === 'pending' && <span className="text-sm font-bold">{i + 1}</span>}
                    </div>
                    <div className="flex-1">
                      <div className={cn(
                        "font-bold transition-colors",
                        step.status === 'running' ? "text-indigo-300" : "text-white/80"
                      )}>{step.label}</div>
                      {step.message && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="text-xs text-white/40 font-mono mt-0.5"
                        >
                          {step.message}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Data Visualization Effect */}
                <div className="pt-4 flex justify-between gap-1 h-8 items-end opacity-20 group-hover:opacity-40 transition-opacity">
                   {[...Array(24)].map((_, i) => (
                     <VisualizerBar key={i} index={i} />
                   ))}
                </div>
              </GlassCard>

              {/* 进度条 */}
              <div className="space-y-2">
                 <div className="flex justify-between text-[10px] text-white/30 uppercase tracking-widest font-bold">
                    <span>Task Progress</span>
                    <span>{Math.round((currentStepIndex / steps.length) * 100)}%</span>
                 </div>
                 <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                   <motion.div 
                     className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                     initial={{ width: 0 }}
                     animate={{ width: `${(currentStepIndex / steps.length) * 100}%` }}
                     transition={{ duration: 0.5 }}
                   />
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== Review 阶段 (集成专家报告) ====== */}
        <AnimatePresence>
          {phase === 'review' && (
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="w-full max-w-7xl pb-24"
             >
                <div className="text-center mb-12">
                   <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-300 mb-6 border border-green-500/20 backdrop-blur-md"
                   >
                      <Sparkles className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-widest">Growth Intelligence Ready</span>
                   </motion.div>
                   <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-4">
                     已生成 {competitorName} 的深度策略报告
                   </h2>
                   <p className="text-white/40 max-w-xl mx-auto">
                     我们通过分析 1,842 条活跃广告和 50,000+ 用户评论，为你制定了这套克隆方案。
                   </p>
                </div>

                {/* Pillar 2: 实验变量选择 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                   <GlassCard className="p-8 border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/10 transition-colors">
                      <div className="flex items-center gap-3 mb-6">
                         <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                           <Zap className="w-6 h-6" />
                         </div>
                         <h3 className="font-bold text-xl">Experiment Runner (Pillar 2)</h3>
                      </div>
                      <p className="text-sm text-white/50 mb-8 leading-relaxed">
                        Agent 建议通过 A/B 测试来验证最高转化的素材路径。选择一个你最关心的测试方向：
                      </p>
                      <div className="grid grid-cols-1 gap-4">
                        {[
                          { id: 'cover', label: '封面图测试 (Cover)', desc: '测试不同视觉钩子对点击率的影响', icon: '🎨' },
                          { id: 'incentive', label: '激励结构测试 (Incentive)', desc: '测试无激励 vs 限时红包的效果', icon: '💰' },
                        ].map((v) => (
                          <button
                            key={v.id}
                            onClick={() => setExperimentConfig({ variable: v.id as ExperimentConfig['variable'] })}
                            className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                              experimentConfig.variable === v.id 
                                ? 'bg-indigo-500/20 border-indigo-400 text-white shadow-xl shadow-indigo-500/10' 
                                : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                            }`}
                          >
                            <div className="flex items-center gap-4 relative z-10">
                               <span className="text-2xl">{v.icon}</span>
                               <div>
                                  <div className="font-bold text-lg">{v.label}</div>
                                  <div className="text-xs opacity-70 mt-1">{v.desc}</div>
                               </div>
                            </div>
                            {experimentConfig.variable === v.id && (
                              <motion.div 
                                layoutId="active-exp"
                                className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent -z-10"
                              />
                            )}
                          </button>
                        ))}
                      </div>
                   </GlassCard>

                   <div className="grid grid-cols-1 gap-6">
                      <GlassCard className="p-8 bg-white/5 flex flex-col justify-center border-white/5">
                        <div className="space-y-6">
                          <div className="flex items-center gap-3 text-white/40">
                             <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                               <Bot className="w-4 h-4" />
                             </div>
                             <span className="text-xs font-bold uppercase tracking-widest">Agent Prediction</span>
                          </div>
                          <p className="text-2xl font-light leading-snug">
                            &ldquo;基于历史数据，<span className="text-indigo-400 font-medium">悬念类封面</span> 在当前地区展现出 <span className="text-emerald-400 font-bold">24%</span> 的点击率增量潜力。&rdquo;
                          </p>
                          <div className="flex gap-2">
                             {['Suspense', 'Contrast', 'High-Speed'].map(tag => (
                               <span key={tag} className="px-3 py-1 rounded-full bg-white/5 text-[10px] text-white/40 border border-white/10">{tag}</span>
                             ))}
                          </div>
                        </div>
                      </GlassCard>

                      <GlassCard className="p-6 border-emerald-500/20 bg-emerald-500/5">
                         <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                               <CheckCircle className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div>
                               <h4 className="font-bold text-emerald-300">Auto-Optimization Active</h4>
                               <p className="text-xs text-white/50 mt-1">
                                 已自动加载 Playbook 中针对 {competitorName} 类产品的 12 个优胜参数。
                               </p>
                            </div>
                         </div>
                      </GlassCard>
                   </div>
                </div>

                <div className="bg-black/60 backdrop-blur-2xl rounded-[40px] border border-white/10 p-2 md:p-6 shadow-3xl">
                   <div className="bg-glass rounded-[32px] overflow-hidden">
                      <CompetitorReportView 
                          gameName={competitorName}
                          onGenerateClone={generateAssetsWorkflow}
                          showGenerateButton={true} 
                      />
                   </div>
                </div>
             </motion.div>
          )}
        </AnimatePresence>

        {/* ====== 完成阶段 ====== */}
        <AnimatePresence>
          {phase === 'complete' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8 pb-32"
            >
              <div className="text-center space-y-4">
                <div className="relative w-32 h-32 mx-auto">
                   <motion.div 
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 12 }}
                    className="w-full h-full rounded-[40px] bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-3xl shadow-green-500/30 relative z-10"
                   >
                     <Sparkles className="w-16 h-16 text-white" />
                   </motion.div>
                   {/* Celebration Burst Effects */}
                   {[...Array(6)].map((_, i) => (
                     <motion.div
                       key={i}
                       className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-green-400"
                       initial={{ x: 0, y: 0, opacity: 1 }}
                       animate={{ 
                         x: Math.cos(i * 60 * Math.PI / 180) * 80,
                         y: Math.sin(i * 60 * Math.PI / 180) * 80,
                         opacity: 0,
                         scale: 2
                       }}
                       transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                     />
                   ))}
                </div>
                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">素材包已就绪！</h2>
                <p className="text-white/40">基于深度学习的克隆方案已成功同步至你的 Studio。</p>
              </div>

              {/* 策略摘要 */}
              <GlassCard className="p-8 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent border-indigo-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                   <Zap className="w-24 h-24 text-indigo-500/5 -rotate-12" />
                </div>
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-indigo-200">AI 差异化策略</h3>
                    <p className="text-white/70 leading-relaxed text-lg italic underline decoration-indigo-500/30 decoration-2 underline-offset-4">
                      &ldquo;基于 {competitorName} 的痛点分析，我们为 {productName} 强化了 {strategySummary}。&rdquo;
                    </p>
                  </div>
                </div>
              </GlassCard>

              {/* 素材预览 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">Distribution Pack (Pillar 1)</h3>
                    <Package className="w-5 h-5 text-white/20" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "视频脚本", value: "3", icon: "🎬", color: "text-indigo-400" },
                      { label: "Hooks", value: "10", icon: "🪝", color: "text-pink-400" },
                      { label: "落地页配置", value: "1", icon: "🌐", color: "text-emerald-400" },
                      { label: "投放文案", value: "5", icon: "✍️", color: "text-purple-400" },
                    ].map((item) => (
                      <div key={item.label} className="p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-white/10 transition-all">
                        <div className="text-2xl mb-1">{item.icon}</div>
                        <div className={cn("text-2xl font-bold", item.color)}>{item.value}</div>
                        <div className="text-[10px] text-white/40 uppercase font-bold tracking-wider">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                <div className="space-y-6">
                   {/* Pillar 2: Experiment Pack */}
                   <GlassCard className="p-6 border-indigo-500/30 bg-indigo-500/5 relative overflow-hidden group">
                      <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/10 blur-3xl rounded-full group-hover:bg-indigo-500/20 transition-all" />
                      <div className="flex items-center gap-3 mb-6 relative z-10">
                        <Zap className="w-5 h-5 text-indigo-400" />
                        <h4 className="font-bold">Experiment Alpha-Pack</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-3 relative z-10">
                        <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                          <div className="text-[9px] text-white/30 uppercase mb-2">Arm A (Control)</div>
                          <div className="text-sm font-bold">Standard Hook</div>
                        </div>
                        <div className="p-4 rounded-xl bg-indigo-500/20 border border-indigo-500/40 shadow-lg shadow-indigo-500/10">
                          <div className="text-[9px] text-indigo-400 uppercase mb-2">Arm B (Variant)</div>
                          <div className="text-sm font-bold">
                            {experimentConfig.variable === 'cover' ? 'Suspense Hook' : 'Cash Giveaway'}
                          </div>
                        </div>
                      </div>
                   </GlassCard>

                   {/* Pillar 4: Telemetry & Loop */}
                   <GlassCard className="p-6 border-emerald-500/20 bg-emerald-500/5">
                      <div className="flex items-center gap-3 mb-4">
                        <Activity className="w-5 h-5 text-emerald-400" />
                        <h4 className="font-bold">AI Data Loop (Pillar 4)</h4>
                      </div>
                      <p className="text-xs text-white/50 leading-relaxed">
                        Telemetry 已自动集成。当样本量达到 <span className="text-white font-bold">100</span> 时，Agent 将自动决定胜负并推进 Pipeline。
                      </p>
                      <div className="mt-4 flex gap-2">
                        {['conversion', 'retention', 'viral_k'].map(m => (
                          <span key={m} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/20 uppercase font-mono">{m}</span>
                        ))}
                      </div>
                   </GlassCard>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-4 pt-8">
                <button
                  onClick={goToStudio}
                  className="flex-1 py-5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-indigo-500/40 text-lg"
                >
                  进入素材工作室
                  <ArrowRight className="w-6 h-6" />
                </button>
                <button
                  onClick={goToExpertMode}
                  className="px-8 py-5 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all border border-white/5"
                >
                  详细分析报告
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>


      </div>
    </div>
  );
}
