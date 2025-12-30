"use client";

import { useState, useEffect } from "react";
import { 
  Activity, 
  Users, 
  DollarSign, 
  Server, 
  Globe, 
  Trophy,
  TrendingUp,
  Clock
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { LiveTelemetry } from "@/components/dashboard/live-telemetry";

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
      label: "Live Players",
      value: activeUsers.toLocaleString(),
      trend: "+12% vs last hr",
      trendUp: true,
      icon: Users,
      color: "text-blue-400"
    },
    {
      label: "Real-time Revenue",
      value: `$${revenue.toLocaleString()}`,
      trend: "+5.4% today",
      trendUp: true,
      icon: DollarSign,
      color: "text-emerald-400"
    },
    {
      label: "Server Load",
      value: `${serverLoad}%`,
      trend: "Stable",
      trendUp: true,
      icon: Server,
      color: serverLoad > 80 ? "text-red-400" : "text-indigo-400"
    }
  ];

  return (
    <div className="w-full h-full p-6 overflow-y-auto pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              Command Center
            </h1>
            <p className="text-white/40 text-sm">Real-time Game Operations Monitor</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            SYSTEM ONLINE
          </div>
        </div>

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
          
          {/* Left Column: World Map & Regions (Placeholder for now) */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard className="p-6 h-[400px] flex flex-col items-center justify-center relative overflow-hidden border-indigo-500/20">
              <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/demo/image/upload/v1688629559/docs/world-map-dots.png')] bg-contain bg-center bg-no-repeat opacity-20 hover:opacity-30 transition-opacity duration-1000" />
              <div className="relative z-10 text-center">
                <Globe className="w-12 h-12 text-indigo-400 mb-4 mx-auto opacity-50" />
                <h3 className="text-lg font-medium text-white/80">Global Traffic Map</h3>
                <p className="text-white/40 text-sm max-w-sm mx-auto mt-2">
                  Visualizing active user sessions across 14 regions. 
                  <br />
                  <span className="text-indigo-400/60 text-xs">Primary node: Tokyo (JP-East-1)</span>
                </p>
              </div>
              
              {/* Animated pulses on map */}
              <div className="absolute top-1/3 left-1/4 w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              <div className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-indigo-500 animate-ping delay-300" />
              <div className="absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full bg-purple-500 animate-ping delay-700" />
            </GlassCard>

            {/* Recent Milestones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <GlassCard className="p-4 bg-orange-500/5 border-orange-500/20">
                 <div className="flex items-center gap-3 mb-3">
                   <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
                     <Trophy className="w-5 h-5" />
                   </div>
                   <div>
                     <div className="text-sm font-bold text-orange-200">Current Season</div>
                     <div className="text-xs text-orange-200/50">Season 4: Cyber Dawn</div>
                   </div>
                 </div>
                 <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full w-[70%] bg-orange-500" />
                 </div>
                 <div className="mt-2 flex justify-between text-[10px] text-white/30">
                   <span>Day 24/60</span>
                   <span>Ends in 36d</span>
                 </div>
               </GlassCard>

               <GlassCard className="p-4 bg-blue-500/5 border-blue-500/20">
                 <div className="flex items-center gap-3 mb-3">
                   <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                     <Clock className="w-5 h-5" />
                   </div>
                   <div>
                     <div className="text-sm font-bold text-blue-200">Next Event</div>
                     <div className="text-xs text-blue-200/50">Weekend Raid Boss</div>
                   </div>
                 </div>
                 <div className="text-2xl font-mono text-blue-400">04:22:18</div>
                 <div className="text-[10px] text-white/30 mt-1">Countdown to start</div>
               </GlassCard>
            </div>
          </div>

          {/* Right Column: Telemetry & Status */}
          <div className="space-y-6">
            <LiveTelemetry />
            
            <GlassCard className="p-4 border-white/10">
               <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">System Health</h3>
               <div className="space-y-4">
                 {[
                   { label: "Auth Service", status: "Operational", color: "bg-emerald-500" },
                   { label: "Matchmaking", status: "High Load", color: "bg-amber-500" },
                   { label: "Database", status: "Operational", color: "bg-emerald-500" },
                   { label: "CDN", status: "Operational", color: "bg-emerald-500" },
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
               <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">Retention (D7)</h3>
               <div className="flex items-end gap-1 h-32">
                 {[40, 45, 42, 48, 52, 50, 55, 58, 60].map((h, i) => (
                   <div key={i} className="flex-1 bg-indigo-500/20 hover:bg-indigo-500/40 transition-colors rounded-t-sm relative group">
                     <div className="absolute bottom-0 w-full bg-indigo-500/50" style={{ height: `${h}%` }} />
                     {/* Tooltip */}
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
