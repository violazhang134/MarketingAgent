"use client";

import { useState } from "react";
import { 
  Library, Lightbulb, MessageSquare, ExternalLink, Zap, TrendingUp,
  Video, Globe, Target, Sparkles
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { CreativeBreakdown } from "@/components/report/creative-breakdown";
import { InsightsReporter } from "@/components/report/insights-reporter";
import { MOCK_ADS, MOCK_HOOKS, MOCK_CTAS, MOCK_TRENDS } from "@/lib/mock-data";
import { analyzeVideo, VideoAnalysisResult } from "@/lib/analysis-engine";
import { analyzeComments, generateInsightsReport } from "@/lib/comment-analyzer";

// ========================================
// 类型定义
// ========================================
type TabType = 'library' | 'insights' | 'hooks' | 'ctas' | 'trends' | 'comments' | 'landing';
type Platform = 'meta' | 'tiktok' | 'google' | 'all';

interface CompetitorReportViewProps {
  gameName: string;
  onGenerateClone?: () => void;
  showGenerateButton?: boolean;
}

export function CompetitorReportView({ 
  gameName, 
  onGenerateClone,
  showGenerateButton = true
}: CompetitorReportViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('library');
  const [activePlatform, setActivePlatform] = useState<Platform>('all');
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const [videoData, setVideoData] = useState<VideoAnalysisResult | null>(null);
  const [selectedHook, setSelectedHook] = useState<number | null>(null);

  const handleCreativeClick = () => {
    const analysis = analyzeVideo('mock-video-id');
    setVideoData(analysis);
    setBreakdownOpen(true);
  };

  // 平台筛选
  const filteredAds = activePlatform === 'all' 
    ? MOCK_ADS 
    : MOCK_ADS.filter(ad => ad.platform === activePlatform);

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'library', label: 'Ad Library', icon: <Library className="w-4 h-4" /> },
    { id: 'insights', label: 'AI Insights', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'hooks', label: 'Hooks', icon: <Zap className="w-4 h-4" /> },
    { id: 'ctas', label: 'CTAs', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'trends', label: 'Trends', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'comments', label: 'Comments', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'landing', label: 'Traffic', icon: <ExternalLink className="w-4 h-4" /> },
  ];

  const platforms: { id: Platform; label: string; color: string }[] = [
    { id: 'all', label: 'All', color: 'bg-white/10' },
    { id: 'meta', label: 'Meta', color: 'bg-blue-500/20' },
    { id: 'tiktok', label: 'TikTok', color: 'bg-pink-500/20' },
    { id: 'google', label: 'Google', color: 'bg-yellow-500/20' },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Sidebar Navigation - Sticky for Desktop */}
      <aside className="w-full lg:w-64 shrink-0 space-y-6 lg:sticky lg:top-8">
        <header className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
              {gameName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white truncate max-w-[160px]">{gameName}</h1>
              <div className="flex gap-2 text-[10px] text-white/40 mt-0.5">
                <span>~1,842 ads</span>
              </div>
            </div>
          </div>
        </header>

        {/* Tab 导航 - Sidebar Style */}
        <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 lg:flex-none px-4 py-3 rounded-xl text-sm flex items-center gap-3 transition-all whitespace-nowrap lg:whitespace-normal border ${
                activeTab === tab.id 
                  ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 font-medium' 
                  : 'text-white/40 hover:text-white/80 hover:bg-white/5 border-transparent'
              }`}
            >
              <div className={activeTab === tab.id ? 'text-indigo-400' : 'text-white/30'}>
                {tab.icon}
              </div>
              {tab.label}
            </button>
          ))}
        </nav>

        {showGenerateButton && onGenerateClone && (
          <GlassCard className="p-4 border-indigo-500/20 bg-indigo-500/5 mt-8 hidden lg:block">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Growth Loop</span>
            </div>
            <p className="text-xs text-white/50 mb-4 leading-relaxed">
              分析完成。准备好基于这些洞察生成优化后的广告素材了吗？
            </p>
            <button 
              onClick={onGenerateClone}
              className="w-full py-3 bg-indigo-500 text-white text-xs font-bold rounded-xl hover:bg-indigo-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              一键生成克隆素材
            </button>
          </GlassCard>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 w-full min-w-0 space-y-6">
        {/* ====== AD LIBRARY TAB ====== */}
        {activeTab === 'library' && (
           <div className="space-y-6">
              {/* Insights Summary */}
              <GlassCard className="p-5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20">
                 <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/20">
                       <Lightbulb className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="space-y-2">
                       <h3 className="font-semibold text-amber-200">Insights Summary</h3>
                       <p className="text-sm text-white/70 leading-relaxed">
                          {gameName}&apos;s recent ads cleverly emphasize <strong>playful engagement</strong> and <strong>gamification</strong>. 
                          They primarily use short-form video with &quot;failure&quot; hooks to drive curiosity. 
                          Top performing creatives focus on the first 3 seconds with high-contrast visuals.
                       </p>
                    </div>
                 </div>
              </GlassCard>

              {/* 平台筛选器 */}
              <div className="flex items-center gap-4">
                 <div className="flex gap-2">
                    {platforms.map(p => (
                       <button
                          key={p.id}
                          onClick={() => setActivePlatform(p.id)}
                          className={`px-4 py-2 rounded-full text-sm transition-all ${
                             activePlatform === p.id 
                               ? `${p.color} text-white border border-white/20` 
                               : 'bg-white/5 text-white/50 hover:bg-white/10'
                          }`}
                       >
                          {p.label}
                       </button>
                    ))}
                 </div>
                 <div className="ml-auto text-xs text-white/40 hidden md:block">
                    Showing {filteredAds.length} of {MOCK_ADS.length} ads
                 </div>
              </div>

              {/* 广告卡片网格 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {filteredAds.map((ad) => (
                    <GlassCard 
                       key={ad.id} 
                       className="p-4 space-y-3 cursor-pointer hover:scale-[1.02] transition-all"
                       onClick={handleCreativeClick}
                    >
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-xs font-bold text-white">
                                {gameName.charAt(0)}
                             </div>
                             <span className="text-sm font-medium text-white">{gameName}</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                             ad.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/40'
                          }`}>
                             {ad.status}
                          </span>
                       </div>
                       <p className="text-sm text-white/80 line-clamp-2">{ad.copy}</p>
                       <div className="aspect-video bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-lg flex items-center justify-center">
                          <Video className="w-8 h-8 text-white/20" />
                       </div>
                       <div className="flex items-center justify-between text-xs text-white/40">
                          <span className="capitalize">{ad.platform}</span>
                          <span>{ad.impressions} impressions</span>
                       </div>
                    </GlassCard>
                 ))}
              </div>
           </div>
        )}

        {/* ====== HOOKS TAB ====== */}
        {activeTab === 'hooks' && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Hooks 列表 */}
              <div className="lg:col-span-2 space-y-2">
                 <div className="grid grid-cols-[1fr_80px_40px] gap-4 text-xs text-white/40 px-4 py-2 border-b border-white/10">
                    <span>Hooks</span>
                    <span className="text-right">Ads</span>
                    <span></span>
                 </div>
                 {MOCK_HOOKS.map((hook, i) => (
                    <div 
                       key={i}
                       onClick={() => setSelectedHook(i)}
                       className={`grid grid-cols-[1fr_80px_40px] gap-4 items-center px-4 py-3 rounded-lg cursor-pointer transition-all ${
                          selectedHook === i ? 'bg-indigo-500/20 border border-indigo-500/30' : 'hover:bg-white/5'
                       }`}
                    >
                       <span className="text-sm text-white/90">{hook.text}</span>
                       <span className="text-sm text-white/60 text-right">{hook.ads}</span>
                       <button className="p-1 hover:bg-white/10 rounded">
                          <ExternalLink className="w-4 h-4 text-white/40" />
                       </button>
                    </div>
                 ))}
              </div>

              {/* Hooks Insight 面板 */}
              <GlassCard className="p-5 space-y-4 h-fit sticky top-4">
                 <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-400" />
                    <h3 className="font-semibold text-white">Hooks Insights</h3>
                 </div>
                 {selectedHook !== null ? (
                    <div className="space-y-3">
                       <p className="text-sm text-indigo-300 font-medium">&quot;{MOCK_HOOKS[selectedHook].text}&quot;</p>
                       <p className="text-sm text-white/60 leading-relaxed">
                          {MOCK_HOOKS[selectedHook].insight}
                       </p>
                    </div>
                 ) : (
                    <p className="text-sm text-white/40">点击左侧 Hook 查看 AI 分析洞察</p>
                 )}
              </GlassCard>
           </div>
        )}

        {/* ====== CTAs TAB ====== */}
        {activeTab === 'ctas' && (
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {MOCK_CTAS.map((cta, i) => (
                 <GlassCard key={i} className="p-4 text-center space-y-2">
                    <div className="text-2xl font-bold text-indigo-400">{cta.uses}</div>
                    <div className="text-sm text-white/80">&quot;{cta.text}&quot;</div>
                    <div className="text-xs text-white/40">ads using this CTA</div>
                 </GlassCard>
              ))}
           </div>
        )}

        {/* ====== AI INSIGHTS TAB ====== */}
        {activeTab === 'insights' && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Strategy Radar */}
              <GlassCard className="p-6 space-y-4">
                 <h3 className="font-semibold text-white/80">Strategy Fingerprint</h3>
                 <div className="aspect-square rounded-full bg-white/5 border border-white/10 relative flex items-center justify-center">
                    <div className="absolute inset-4 border border-white/5 rounded-full" />
                    <div className="absolute inset-12 border border-white/5 rounded-full" />
                    <div className="w-3/4 h-3/4 bg-indigo-500/20 absolute" style={{ clipPath: 'polygon(50% 0%, 100% 30%, 80% 100%, 20% 90%, 0% 30%)' }} />
                    <span className="absolute top-2 text-[10px] text-white/40">Hook</span>
                    <span className="absolute bottom-6 right-8 text-[10px] text-white/40">Retention</span>
                    <span className="absolute bottom-6 left-8 text-[10px] text-white/40">Monetization</span>
                 </div>
              </GlassCard>

              {/* Key Metrics */}
              <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                 {[
                    { label: 'Avg Hook Duration', value: '2.3s', trend: '+12%' },
                    { label: 'Top Platform', value: 'TikTok', trend: '68% share' },
                    { label: 'Active Campaigns', value: '24', trend: '+3 this week' },
                    { label: 'Est. Monthly Spend', value: '$45K', trend: 'High confidence' },
                 ].map((metric, i) => (
                    <GlassCard key={i} className="p-5 space-y-2">
                       <div className="text-xs text-white/40">{metric.label}</div>
                       <div className="text-2xl font-bold text-white">{metric.value}</div>
                       <div className="text-xs text-green-400 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {metric.trend}
                       </div>
                    </GlassCard>
                 ))}
              </div>
           </div>
        )}

        {/* ====== TRENDS TAB ====== */}
        {activeTab === 'trends' && (
           <div className="space-y-6">
              <div className="flex gap-4">
                 <GlassCard className="flex-1 p-6 space-y-4 border-red-500/20 bg-red-500/5">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center text-xl">📺</div>
                       <div>
                          <h3 className="font-bold text-lg text-white">YouTube</h3>
                          <p className="text-xs text-white/40">热门视频 & 内容趋势</p>
                       </div>
                    </div>
                 </GlassCard>
                 <GlassCard className="flex-1 p-6 space-y-4 border-pink-500/20 bg-pink-500/5">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-xl">🎵</div>
                       <div>
                          <h3 className="font-bold text-lg text-white">TikTok</h3>
                          <p className="text-xs text-white/40">爆款视频 & 热门音乐</p>
                       </div>
                    </div>
                 </GlassCard>
              </div>

              <GlassCard className="p-6 space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center text-sm">📺</div>
                    <h3 className="font-semibold text-white">YouTube 热门视频</h3>
                 </div>
                 <div className="space-y-3">
                    {MOCK_TRENDS.youtube.trending.map((video, i) => (
                       <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                          <div className="w-24 h-14 rounded-lg bg-black/40 flex items-center justify-center">
                             <Video className="w-6 h-6 text-white/20" />
                          </div>
                          <div className="flex-1 min-w-0">
                             <h4 className="font-medium text-sm truncate text-white">{video.title}</h4>
                             <div className="flex gap-3 text-xs text-white/40 mt-1">
                                <span>{video.channel}</span>
                                <span>{video.views} views</span>
                                <span>{video.date}</span>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </GlassCard>
           </div>
        )}

        {/* ====== COMMENTS TAB ====== */}
        {activeTab === 'comments' && (
           <InsightsReporter 
              analysis={analyzeComments(gameName || "Competitor")}
              report={generateInsightsReport(
                 analyzeComments(gameName || "Competitor"), 
                 gameName || "Competitor", 
                 "My Product (You)"
              )}
              competitorName={gameName || "Competitor"}
           />
        )}

        {/* ====== LANDING PAGES TAB ====== */}
        {activeTab === 'landing' && (
           <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                 {[
                    { label: 'Total Visits', value: '2.4M', change: '+12.3%', color: 'text-green-400' },
                    { label: 'Avg. Duration', value: '4:32', change: '+8.1%', color: 'text-green-400' },
                    { label: 'Bounce Rate', value: '42.1%', change: '-3.2%', color: 'text-green-400' },
                    { label: 'Pages/Visit', value: '3.8', change: '+5.7%', color: 'text-green-400' },
                 ].map((stat, i) => (
                    <GlassCard key={i} className="p-4">
                       <div className="text-xs text-white/40">{stat.label}</div>
                       <div className="text-2xl font-bold mt-1 text-white">{stat.value}</div>
                       <div className={`text-xs ${stat.color} flex items-center gap-1 mt-1`}>
                          <TrendingUp className="w-3 h-3" />
                          {stat.change}
                       </div>
                    </GlassCard>
                 ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <GlassCard className="p-6 space-y-4">
                    <h3 className="font-semibold text-white/80 flex items-center gap-2">
                       <Globe className="w-5 h-5 text-indigo-400" />
                       Traffic Sources
                    </h3>
                    <div className="space-y-3">
                       {[
                          { source: 'Direct', percent: 35, color: 'bg-indigo-500' },
                          { source: 'Search', percent: 28, color: 'bg-green-500' },
                          { source: 'Social', percent: 22, color: 'bg-pink-500' },
                          { source: 'Referral', percent: 10, color: 'bg-amber-500' },
                          { source: 'Email', percent: 5, color: 'bg-cyan-500' },
                       ].map((src, i) => (
                          <div key={i} className="space-y-1">
                             <div className="flex justify-between text-sm">
                                <span className="text-white/80">{src.source}</span>
                                <span className="text-white/60">{src.percent}%</span>
                             </div>
                             <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className={`h-full ${src.color} rounded-full transition-all`} style={{ width: `${src.percent}%` }} />
                             </div>
                          </div>
                       ))}
                    </div>
                 </GlassCard>

                 <GlassCard className="p-6 space-y-4">
                    <h3 className="font-semibold text-white/80 flex items-center gap-2">
                       <ExternalLink className="w-5 h-5 text-amber-400" />
                       Top Referring Sites
                    </h3>
                    <div className="space-y-2">
                       {[
                          { site: 'facebook.com', visits: '234K', share: '18.2%' },
                          { site: 'youtube.com', visits: '189K', share: '14.7%' },
                          { site: 'tiktok.com', visits: '156K', share: '12.1%' },
                          { site: 'twitter.com', visits: '98K', share: '7.6%' },
                          { site: 'reddit.com', visits: '67K', share: '5.2%' },
                       ].map((ref, i) => (
                          <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-xs font-bold text-white">
                                   {ref.site.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm text-white/80">{ref.site}</span>
                             </div>
                             <div className="text-right">
                                <div className="text-sm font-medium text-white">{ref.visits}</div>
                                <div className="text-xs text-white/40">{ref.share}</div>
                             </div>
                          </div>
                       ))}
                    </div>
                 </GlassCard>
              </div>
           </div>
        )}

        {/* Action Bar (Mobile only fallback) */}
        {showGenerateButton && onGenerateClone && (
          <div className="lg:hidden mt-12 pb-24">
            <GlassCard className="p-6 border-indigo-500/30 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 flex flex-col items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full">
                  <Target className="w-6 h-6 text-indigo-400" />
                  <div>
                    <h3 className="font-bold text-white">Ready to clone strategy?</h3>
                    <p className="text-xs text-white/60">Generate AI-powered ads now</p>
                  </div>
              </div>
              <button 
                  onClick={onGenerateClone}
                  className="w-full py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate Cloned Ads
              </button>
            </GlassCard>
          </div>
        )}
      </div>

      {/* Creative Breakdown Modal */}
      {videoData && (
        <CreativeBreakdown 
          isOpen={breakdownOpen} 
          onClose={() => setBreakdownOpen(false)} 
          data={videoData} 
        />
      )}
    </div>
  );
}
