"use client";

import { motion } from "framer-motion";
import { 
  BookOpen, Sparkles, Zap, Target, Search, 
  BarChart3, Layers, Repeat, ShieldCheck, ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";

const PILLARS = [
  {
    title: "Pillar 1: Distribution Pack",
    desc: "全渠道自动适配的素材分发包。不仅是脚本，还包括落地页、裂变文案和社媒适配内容。",
    icon: <Layers className="w-6 h-6 text-indigo-400" />,
    color: "from-indigo-500/20 to-purple-500/20",
  },
  {
    title: "Pillar 2: Experiment Runner",
    desc: "内置 A/B 测试逻辑。Agent 会自动生成带有变量的素材，并配置对照实验以寻找最佳点击路径。",
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    color: "from-yellow-500/20 to-amber-500/20",
  },
  {
    title: "Pillar 3: Telemetry Loop",
    desc: "实时归因与监控。通过智能链接追踪每一个转化的来源，并将数据实时反馈给分析引擎。",
    icon: <BarChart3 className="w-6 h-6 text-emerald-400" />,
    color: "from-emerald-500/20 to-cyan-500/20",
  },
  {
    title: "Pillar 4: Next Best Action",
    desc: "决策自动化。当数据达到置信度，Agent 会自动决定关停或扩量，并提示你下一轮的优化方向。",
    icon: <Repeat className="w-6 h-6 text-pink-400" />,
    color: "from-pink-500/20 to-rose-500/20",
  },
];

export default function DocsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-obsidian text-white p-6 md:p-12 pb-32">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-30 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-indigo-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto space-y-16 relative">
        {/* Header */}
        <div className="space-y-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group mb-8"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            返回
          </button>
          
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <BookOpen className="w-6 h-6 text-white" />
             </div>
             <h1 className="text-4xl md:text-5xl font-black">增长作战手册</h1>
          </div>
          <p className="text-xl text-white/40 font-light max-w-2xl leading-relaxed">
            欢迎来到 Marketing Agent 核心系统。在这里，我们通过四个核心支柱（The 4 Pillars）将复杂的营销流程变得简单、科学且自动化。
          </p>
        </div>

        {/* The 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {PILLARS.map((pillar, i) => (
             <motion.div
               key={pillar.title}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
             >
               <GlassCard className={`p-8 h-full border-white/5 bg-gradient-to-br ${pillar.color}`}>
                 <div className="flex flex-col gap-6">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                       {pillar.icon}
                    </div>
                    <div className="space-y-3">
                       <h3 className="text-xl font-bold">{pillar.title}</h3>
                       <p className="text-white/60 text-sm leading-relaxed">{pillar.desc}</p>
                    </div>
                 </div>
               </GlassCard>
             </motion.div>
           ))}
        </div>

        {/* Call to Action Section */}
        <section className="space-y-8">
           <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
              <h2 className="text-2xl font-bold">为什么选择 Agent 驱动？</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "零配置启动", text: "无需复杂的跟踪代码设置", icon: <Target className="w-4 h-4" /> },
                { title: "实时竞争情报", text: "24/7 监控对手的变化", icon: <Search className="w-4 h-4" /> },
                { title: "科学 A/B 分流", text: "自动排除统计噪音", icon: <Sparkles className="w-4 h-4" /> },
              ].map((item) => (
                <div key={item.title} className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                   <div className="text-indigo-400 mb-2">{item.icon}</div>
                   <h4 className="font-bold text-sm">{item.title}</h4>
                   <p className="text-xs text-white/40 leading-relaxed">{item.text}</p>
                </div>
              ))}
           </div>
        </section>

        {/* Interactive Guide Note */}
        <GlassCard className="p-8 bg-indigo-500 border-indigo-400 shadow-2xl shadow-indigo-500/40 text-center">
            <h3 className="text-2xl font-black mb-4">准备好体验魔法了吗？</h3>
            <p className="opacity-80 mb-8 max-w-md mx-auto italic">
              &ldquo;将优秀的营销创意从 1 个月缩短到 5 分钟。&rdquo;
            </p>
            <button 
              onClick={() => router.push('/agent')}
              className="px-8 py-4 bg-white text-indigo-600 font-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              立即开启 Agent 模式
            </button>
        </GlassCard>
      </div>
    </div>
  );
}
