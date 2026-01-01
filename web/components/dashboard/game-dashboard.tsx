"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Activity, 
  Users, 
  DollarSign, 
  Server, 
  BarChart3, 
  Trophy,
  TrendingUp,
  Clock
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { LiveTelemetry } from "@/components/dashboard/live-telemetry";
import { LiveTrends } from "@/components/dashboard/live-trends";
import { useCanvasStore } from "@/lib/stores/canvas-store";

// 模拟数据接口
interface MetricData {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: React.ElementType;
  color: string;
}

export function GameDashboard() {
  const router = useRouter();
  const { canvases, setActiveCanvas } = useCanvasStore(); // 获取历史会话

  const [activeUsers, setActiveUsers] = useState(12450);
  const [revenue, setRevenue] = useState(84320);
  const [serverLoad, setServerLoad] = useState(42);

  // 模拟数据跳动
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => prev + Math.floor(Math.random() * 10 - 3));
      setRevenue(prev => prev + Math.floor(Math.random() * 50));
      setServerLoad(prev => Math.max(0, Math.min(100, prev + Math.floor(Math.random() * 5 - 2))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const metrics: MetricData[] = [
    {
      label: "在线玩家",
      value: activeUsers.toLocaleString(),
      trend: "+12% vs 上小时",
      trendUp: true,
      icon: Users,
      color: "text-blue-400"
    },
    {
      label: "实时收入",
      value: `$${revenue.toLocaleString()}`,
      trend: "+5.4% 今日",
      trendUp: true,
      icon: DollarSign,
      color: "text-emerald-400"
    },
    {
      label: "服务器负载",
      value: `${serverLoad}%`,
      trend: "稳定",
      trendUp: true,
      icon: Server,
      color: serverLoad > 80 ? "text-red-400" : "text-indigo-400"
    }
  ];

  const handleResumeSession = (canvasId: string) => {
    setActiveCanvas(canvasId);
    router.push('/canvas');
  };

  return (
    <div className="w-full h-full p-6 overflow-y-auto pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* 页面头部 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              运营控制中心
            </h1>
            <p className="text-white/40 text-sm">实时游戏运营数据监控</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            系统在线
          </div>
        </div>

        {/* 实时趋势区域 */}
        <LiveTrends />

        {/* Top Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <GlassCard key={index} className="p-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <metric.icon className="w-16 h-16" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 text-white/50 text-sm">
                  <metric.icon className={`w-4 h-4 ${metric.color}`} />
                  {metric.label}
                </div>
                <div className="text-3xl font-bold font-mono tracking-tight text-white mb-1">
                  {metric.value}
                </div>
                <div className={`text-xs ${metric.trendUp ? 'text-emerald-400' : 'text-red-400'} flex items-center gap-1`}>
                  {metric.trendUp ? <TrendingUp className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
                  {metric.trend}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 左侧列: 渠道流量分布图 */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard className="p-6 border-indigo-500/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-lg font-medium text-white/90">渠道流量分布</h3>
                </div>
                <span className="text-xs text-white/40">过去 24 小时</span>
              </div>
              
              {/* 竖形图 */}
              <div className="flex items-end justify-between gap-3 h-[280px] px-2">
                {[
                  { channel: "抖音", value: 85, color: "from-pink-500 to-rose-500" },
                  { channel: "TikTok", value: 72, color: "from-cyan-500 to-blue-500" },
                  { channel: "微信", value: 65, color: "from-green-500 to-emerald-500" },
                  { channel: "B站", value: 58, color: "from-pink-400 to-blue-400" },
                  { channel: "小红书", value: 45, color: "from-red-500 to-orange-500" },
                  { channel: "Meta", value: 38, color: "from-blue-500 to-indigo-500" },
                  { channel: "Google", value: 32, color: "from-amber-500 to-yellow-500" },
                  { channel: "Apple", value: 28, color: "from-gray-400 to-gray-500" },
                ].map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    {/* 数值标签 */}
                    <div className="text-xs font-mono text-white/60 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.value}K
                    </div>
                    {/* 柱子 */}
                    <div 
                      className={`w-full rounded-t-lg bg-gradient-to-t ${item.color} transition-all duration-500 hover:opacity-80 relative`}
                      style={{ height: `${item.value * 2.5}px` }}
                    >
                      {/* 光晕效果 */}
                      <div className="absolute inset-0 bg-white/10 rounded-t-lg" />
                    </div>
                    {/* 渠道名 */}
                    <span className="text-[10px] text-white/50 text-center leading-tight">{item.channel}</span>
                  </div>
                ))}
              </div>
              
              {/* 图例 */}
              <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <div className="w-3 h-3 rounded bg-gradient-to-r from-pink-500 to-rose-500" />
                  <span>国内渠道</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <div className="w-3 h-3 rounded bg-gradient-to-r from-blue-500 to-indigo-500" />
                  <span>海外渠道</span>
                </div>
              </div>
            </GlassCard>

            {/* 运营卡片 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <GlassCard className="p-4 bg-orange-500/5 border-orange-500/20">
                 <div className="flex items-center gap-3 mb-3">
                   <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
                     <Trophy className="w-5 h-5" />
                   </div>
                   <div>
                     <div className="text-sm font-bold text-orange-200">当前活动</div>
                     <div className="text-xs text-orange-200/50">新年塑金活动</div>
                   </div>
                 </div>
                 <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full w-[70%] bg-orange-500" />
                 </div>
                 <div className="mt-2 flex justify-between text-[10px] text-white/30">
                   <span>第 24/60 天</span>
                   <span>剩余 36 天</span>
                 </div>
               </GlassCard>

               <GlassCard className="p-4 bg-blue-500/5 border-blue-500/20">
                 <div className="flex items-center gap-3 mb-3">
                   <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                     <Clock className="w-5 h-5" />
                   </div>
                   <div>
                     <div className="text-sm font-bold text-blue-200">下一场活动</div>
                     <div className="text-xs text-blue-200/50">周末特别任务</div>
                   </div>
                 </div>
                 <div className="text-2xl font-mono text-blue-400">04:22:18</div>
                 <div className="text-[10px] text-white/30 mt-1">倒计时</div>
               </GlassCard>
            </div>
          </div>

          {/* 右侧列: 遮测数据 & 状态 */}
          <div className="space-y-6">
            
            {/* 历史任务 */}
            <GlassCard className="p-4 border-white/10 relative overflow-hidden">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">历史任务</h3>
                 <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                   {canvases.length} 条记录
                 </span>
               </div>
               
               <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                 {[...canvases].reverse().map((canvas) => (
                   <div 
                     key={canvas.id}
                     onClick={() => handleResumeSession(canvas.id)}
                     className="group flex flex-col gap-1 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-indigo-400/30 transition-all cursor-pointer relative"
                   >
                     {/* 状态点 */}
                     <div className={`absolute top-3 right-3 w-1.5 h-1.5 rounded-full ${
                       canvas.status === 'running' ? 'bg-emerald-400 animate-pulse' : 
                       canvas.status === 'completed' ? 'bg-blue-400' : 'bg-white/20'
                     }`} />

                     <div className="text-sm font-medium text-white/90 truncate pr-4">
                       {canvas.title}
                     </div>
                     <div className="flex items-center justify-between text-[10px] text-white/40">
                       <span className="font-mono">
                         {canvas.updatedAt.slice(0, 10)}
                       </span>
                       <span className="group-hover:text-indigo-300 transition-colors">
                         {canvas.stats?.nodeCount || 0} 个节点
                       </span>
                     </div>
                     
                     {/* 悄悄的 */}
                     <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px] rounded-lg">
                       <span className="text-xs font-bold text-white tracking-widest flex items-center gap-1">
                         继续 →
                       </span>
                     </div>
                   </div>
                 ))}
                 
                 {canvases.length === 0 && (
                   <div className="text-center py-8 text-white/20 text-xs italic">
                     暂无历史记录
                   </div>
                 )}
               </div>
            </GlassCard>

            <LiveTelemetry />
            
            <GlassCard className="p-4 border-white/10">
               <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">系统状态</h3>
               <div className="space-y-4">
                 {[
                   { label: "认证服务", status: "正常", color: "bg-emerald-500" },
                   { label: "匹配系统", status: "高负载", color: "bg-amber-500" },
                   { label: "数据库", status: "正常", color: "bg-emerald-500" },
                   { label: "CDN", status: "正常", color: "bg-emerald-500" },
                 ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between text-xs">
                     <span className="text-white/60">{item.label}</span>
                     <div className="flex items-center gap-2">
                       <span className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                       <span className="text-white/90">{item.status}</span>
                     </div>
                   </div>
                 ))}
               </div>
            </GlassCard>

             <GlassCard className="p-4 border-white/10">
               <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">7日留存率</h3>
               <div className="flex items-end gap-1 h-32">
                 {[40, 45, 42, 48, 52, 50, 55, 58, 60].map((h, i) => (
                   <div key={i} className="flex-1 bg-indigo-500/20 hover:bg-indigo-500/40 transition-colors rounded-t-sm relative group">
                     <div className="absolute bottom-0 w-full bg-indigo-500/50" style={{ height: `${h}%` }} />
                     {/* 提示 */}
                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                       {h}%
                     </div>
                   </div>
                 ))}
               </div>
             </GlassCard>
          </div>

        </div>
      </div>
    </div>
  );
}
