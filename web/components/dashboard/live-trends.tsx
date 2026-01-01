"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Gamepad2, 
  Palette, 

  Search,
  Activity,
  Flame,
  Pause,
  Play
} from "lucide-react";

// ========================================
// 类型定义
// ========================================

interface SearchItem {
  id: string;
  term: string;
  timeAgo: string;
}

interface TelemetryItem {
  id: string;
  event: string;
  channel: string;
  channelIcon: string;
  metric?: string;
  timeAgo: string;
}

interface HotGameItem {
  id: string;
  name: string;
  icon: string;
  timeAgo: string;
}

// ========================================
// 模拟数据池
// ========================================

const SEARCH_TERMS = [
  "像素冒险", "消消乐攻略", "roguelike推荐", 
  "休闲解压游戏", "二次元RPG", "塔防策略",
  "开罗游戏", "独立游戏推荐", "steam移植",
  "合成大西瓜", "跳一跳技巧", "弹珠台",
  "模拟经营", "放置类游戏", "益智解谜",
  "动作冒险", "卡牌对战", "音乐节奏"
];

// 渠道数据
const CHANNELS = [
  { name: "TikTok", icon: "📱" },
  { name: "抖音", icon: "🎵" },
  { name: "微信小程序", icon: "💬" },
  { name: "Meta Ads", icon: "📘" },
  { name: "Google Ads", icon: "🔍" },
  { name: "Apple Search", icon: "🍎" },
  { name: "B站", icon: "📺" },
  { name: "小红书", icon: "📕" },
];

// 埋点事件类型 (来自 PRD Pillar 3)
const TELEMETRY_EVENTS = [
  { event: "landing_view", label: "落地页曝光", color: "text-blue-400" },
  { event: "game_start", label: "开始游戏", color: "text-emerald-400" },
  { event: "first_interaction", label: "首次互动", color: "text-amber-400" },
  { event: "qualified_start", label: "有效开玩", color: "text-green-400" },
  { event: "share_click", label: "分享点击", color: "text-pink-400" },
  { event: "return_visit", label: "回访", color: "text-purple-400" },
];

const HOT_GAMES = [
  { name: "像素大师", icon: "🎨" },
  { name: "无尽城堡", icon: "🏰" },
  { name: "星际探险", icon: "🚀" },
  { name: "魔法森林", icon: "🌲" },
  { name: "弹弹乐园", icon: "🎾" },
  { name: "合成工厂", icon: "🏭" },
  { name: "解谜高手", icon: "🧩" },
  { name: "塔防大师", icon: "🗼" },
  { name: "模拟农场", icon: "🌾" },
  { name: "音乐节拍", icon: "🎵" },
  { name: "赛车狂飙", icon: "🏎️" },
  { name: "卡牌对决", icon: "🃏" },
];

// ========================================
// 工具函数
// ========================================

const randomPick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const generateId = () => Math.random().toString(36).substring(2, 9);

// ========================================
// 顶部统计栏组件
// ========================================

function HeroStats({ 
  revenue, 
  revenueIncrement 
}: { 
  revenue: number; 
  revenueIncrement: number;
}) {
  const stats = [
    { 
      label: "活跃玩家", 
      value: "12.8M+", 
      icon: Users,
      gradient: "from-blue-500 to-cyan-500"
    },
    { 
      label: "创作者", 
      value: "167.2K+", 
      icon: Palette,
      gradient: "from-purple-500 to-pink-500"
    },
    { 
      label: "游戏数", 
      value: "179.5K+", 
      icon: Gamepad2,
      gradient: "from-amber-500 to-orange-500"
    },
  ];

  return (
    <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-indigo-900/40 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
      {/* 标题 */}
      <h2 className="text-xl font-bold text-white mb-2">
        游戏营销实时数据中心
      </h2>
      
      {/* 统计指标 */}
      <div className="flex flex-wrap items-center gap-6 text-sm text-white/60 mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-2">
            <stat.icon className="w-4 h-4" />
            <span>{stat.value}</span>
            <span className="text-white/40">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* 实时广告分成 */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold font-mono text-white">
          US${revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <span className="text-white/50">实时广告分成</span>
        <AnimatePresence mode="wait">
          {revenueIncrement > 0 && (
            <motion.span
              key={revenueIncrement}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-emerald-400 font-mono text-sm"
            >
              +US${revenueIncrement.toFixed(2)}
            </motion.span>
          )}
        </AnimatePresence>
        <span className="text-white/30 text-xs">30s</span>
      </div>
    </div>
  );
}

// ========================================
// 数据流列组件
// ========================================

function StreamColumn<T extends { id: string }>({
  title,
  icon: Icon,
  items,
  renderItem,
  isPaused,
  onTogglePause,
  iconColor = "text-white/50"
}: {
  title: string;
  icon: React.ElementType;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  isPaused: boolean;
  onTogglePause: () => void;
  iconColor?: string;
}) {
  return (
    <div className="flex-1 min-w-[280px]">
      {/* 列头 */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${iconColor}`} />
          <span className="text-sm font-medium text-white/70">{title}</span>
        </div>
        <button 
          onClick={onTogglePause}
          className="p-1 rounded hover:bg-white/10 transition-colors"
        >
          {isPaused ? (
            <Play className="w-3.5 h-3.5 text-white/40" />
          ) : (
            <Pause className="w-3.5 h-3.5 text-white/40" />
          )}
        </button>
      </div>

      {/* 数据流 */}
      <div className="space-y-2 h-[320px] overflow-hidden">
        <AnimatePresence initial={false}>
          {items.slice(0, 8).map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderItem(item)}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ========================================
// 主组件
// ========================================

export function LiveTrends() {
  // 实时收入状态
  const [revenue, setRevenue] = useState(0);
  const [revenueIncrement, setRevenueIncrement] = useState(0);
  
  // 三列数据
  const [searches, setSearches] = useState<SearchItem[]>([]);
  const [telemetry, setTelemetry] = useState<TelemetryItem[]>([]);
  const [hotGames, setHotGames] = useState<HotGameItem[]>([]);
  
  // 暂停状态
  const [pausedColumns, setPausedColumns] = useState({
    search: false,
    telemetry: false,
    hotGame: false
  });



  // 添加新搜索
  const addSearch = useCallback(() => {
    if (pausedColumns.search) return;
    const newItem: SearchItem = {
      id: generateId(),
      term: randomPick(SEARCH_TERMS),
      timeAgo: "现在"
    };
    setSearches(prev => [newItem, ...prev].slice(0, 10));
  }, [pausedColumns.search]);

  // 添加渠道埋点
  const addTelemetry = useCallback(() => {
    if (pausedColumns.telemetry) return;
    const channel = randomPick(CHANNELS);
    const eventType = randomPick(TELEMETRY_EVENTS);
    const newItem: TelemetryItem = {
      id: generateId(),
      event: eventType.label,
      channel: channel.name,
      channelIcon: channel.icon,
      metric: eventType.event === 'qualified_start' ? `>${Math.floor(10 + Math.random() * 20)}s` : undefined,
      timeAgo: "刚刚"
    };
    setTelemetry(prev => [newItem, ...prev].slice(0, 10));
  }, [pausedColumns.telemetry]);

  // 添加热门游戏
  const addHotGame = useCallback(() => {
    if (pausedColumns.hotGame) return;
    const game = randomPick(HOT_GAMES);
    const newItem: HotGameItem = {
      id: generateId(),
      name: game.name,
      icon: game.icon,
      timeAgo: "刚刚"
    };
    setHotGames(prev => [newItem, ...prev].slice(0, 10));
  }, [pausedColumns.hotGame]);

  // 定时更新数据
  useEffect(() => {
    // 搜索词更新间隔：3-6秒
    const searchInterval = setInterval(addSearch, 3000 + Math.random() * 3000);
    
    // 渠道埋点更新间隔：4-8秒
    const telemetryInterval = setInterval(addTelemetry, 4000 + Math.random() * 4000);
    
    // 热门游戏更新间隔：8-15秒
    const hotGameInterval = setInterval(addHotGame, 8000 + Math.random() * 7000);

    // 广告分成持续小额增长：每 1-2 秒增加 $0.01-$0.08
    const revenueInterval = setInterval(() => {
      const amount = 0.01 + Math.random() * 0.07;
      setRevenueIncrement(amount);
      setRevenue(prev => prev + amount);
      setTimeout(() => setRevenueIncrement(0), 800);
    }, 1000 + Math.random() * 1000);

    // 初始化一些数据
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        addSearch();
        addTelemetry();
        addHotGame();
      }, i * 200);
    }

    return () => {
      clearInterval(searchInterval);
      clearInterval(telemetryInterval);
      clearInterval(hotGameInterval);
      clearInterval(revenueInterval);
    };
  }, [addSearch, addTelemetry, addHotGame]);

  // 切换暂停状态
  const togglePause = (column: 'search' | 'telemetry' | 'hotGame') => {
    setPausedColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  return (
    <div className="space-y-6">
      {/* 顶部统计栏 */}
      <HeroStats revenue={revenue} revenueIncrement={revenueIncrement} />

      {/* 三列实时数据流 */}
      <div className="flex gap-4 flex-wrap lg:flex-nowrap">
        {/* 热门搜索 */}
        <StreamColumn
          title="热门搜索"
          icon={Search}
          iconColor="text-blue-400"
          items={searches}
          isPaused={pausedColumns.search}
          onTogglePause={() => togglePause('search')}
          renderItem={(item) => (
            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <span className="text-sm text-white/80">{item.term}</span>
              <span className="text-xs text-white/30">{item.timeAgo}</span>
            </div>
          )}
        />

        {/* 渠道埋点 */}
        <StreamColumn
          title="渠道埋点"
          icon={Activity}
          iconColor="text-cyan-400"
          items={telemetry}
          isPaused={pausedColumns.telemetry}
          onTogglePause={() => togglePause('telemetry')}
          renderItem={(item) => (
            <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              {/* 渠道图标 */}
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-lg shrink-0">
                {item.channelIcon}
              </div>
              {/* 事件信息 */}
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white/80 truncate">{item.event}</div>
                <div className="text-xs text-white/40 truncate">from {item.channel}</div>
              </div>
              {/* 指标和时间 */}
              <div className="text-right shrink-0">
                {item.metric && (
                  <div className="text-xs font-mono text-emerald-400">{item.metric}</div>
                )}
                <div className="text-xs text-white/30">{item.timeAgo}</div>
              </div>
            </div>
          )}
        />

        {/* 热门游戏 */}
        <StreamColumn
          title="热门游戏"
          icon={Flame}
          iconColor="text-orange-400"
          items={hotGames}
          isPaused={pausedColumns.hotGame}
          onTogglePause={() => togglePause('hotGame')}
          renderItem={(item) => (
            <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              {/* 图标 */}
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xl shrink-0">
                {item.icon}
              </div>
              {/* 名称 */}
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white/80 truncate">{item.name}</div>
              </div>
              {/* 时间 */}
              <div className="text-xs text-white/30 shrink-0">{item.timeAgo}</div>
            </div>
          )}
        />
      </div>
    </div>
  );
}
