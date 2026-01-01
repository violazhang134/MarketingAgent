"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Check, Sparkles, RefreshCw, Package
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { getStyleById } from "@/lib/data/style-templates";
import { getGenreById, getAllScreens, UIScreen } from "@/lib/data/genre-templates";

// ========================================
// Phase 2: 批量生成页面
// 职责: 显示生成进度，逐个生成所有界面
// ========================================

// ========================================
// 组件: 界面生成卡片
// ========================================
function ScreenCard({ 
  screen, 
  status, 
  gradient,
  imageUrl,
  index
}: { 
  screen: UIScreen;
  status: 'pending' | 'generating' | 'done';
  gradient: string;
  imageUrl: string | null;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="relative"
    >
      <div className={cn(
        "aspect-[9/16] rounded-xl overflow-hidden border transition-all",
        status === 'done' ? "border-green-500/50" : "border-white/10"
      )}>
        {status === 'pending' && (
          <div className="w-full h-full bg-white/5 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white/10" />
          </div>
        )}
        {status === 'generating' && (
          <div className="w-full h-full bg-indigo-500/10 flex items-center justify-center">
            <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" />
          </div>
        )}
        {status === 'done' && (
          <div className="relative w-full h-full">
            {imageUrl ? (
              <img src={imageUrl} alt={screen.name} className="w-full h-full object-cover" />
            ) : (
              <div className={cn("w-full h-full bg-gradient-to-br", gradient)} />
            )}
            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          </div>
        )}
      </div>
      <div className="mt-2 text-center">
        <div className="text-xs text-white/60">{screen.name}</div>
        <div className={cn(
          "text-[10px] mt-0.5",
          status === 'done' ? "text-green-400" : 
          status === 'generating' ? "text-indigo-400" : 
          "text-white/30"
        )}>
          {status === 'done' ? '已完成' : 
           status === 'generating' ? '生成中...' : 
           '等待中'}
        </div>
      </div>
    </motion.div>
  );
}

// ========================================
// 内部内容组件
// ========================================
function GenerateContent() {
  const searchParams = useSearchParams();
  const styleId = searchParams.get('style');
  const genreId = searchParams.get('genre');
  
  const style = styleId ? getStyleById(styleId) : null;
  const genre = genreId ? getGenreById(genreId) : null;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  // 用 useMemo 初始化界面列表（避免 useEffect 中同步 setState）
  const initialScreens = useMemo(() => {
    if (!genre || !style) return [];
    return getAllScreens(genre.id).map(screen => ({
      screen,
      status: 'pending' as const,
      gradient: style.coverGradient,
      imageUrl: null,
    }));
  }, [genre, style]);

  const [screens, setScreens] = useState<{ screen: UIScreen; status: 'pending' | 'generating' | 'done'; gradient: string; imageUrl: string | null }[]>(initialScreens);

  // 真实 API 逐个生成
  useEffect(() => {
    if (screens.length === 0 || currentIndex >= screens.length || !style) return;

    // 开始生成当前界面
    setScreens(prev => prev.map((s, i) => 
      i === currentIndex ? { ...s, status: 'generating' } : s
    ));

    // 构建完整提示词
    const currentScreen = screens[currentIndex].screen;
    const fullPrompt = currentScreen.promptTemplate.replace('{style}', style.basePrompt);

    // 调用真实 API
    const generateImage = async () => {
      try {
        const response = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: fullPrompt,
            negativePrompt: style.negativePrompt,
            size: '2K',
          }),
        });
        
        const data = await response.json();
        
        if (data.success && data.images?.[0]) {
          setScreens(prev => prev.map((s, i) => 
            i === currentIndex ? { ...s, status: 'done', imageUrl: data.images[0] } : s
          ));
        } else {
          // 生成失败，使用渐变色作为占位
          console.error('[Generate] Failed:', data.error);
          setScreens(prev => prev.map((s, i) => 
            i === currentIndex ? { ...s, status: 'done' } : s
          ));
        }
      } catch (error) {
        console.error('[Generate] Error:', error);
        setScreens(prev => prev.map((s, i) => 
          i === currentIndex ? { ...s, status: 'done' } : s
        ));
      }
      
      if (currentIndex + 1 >= screens.length) {
        setIsComplete(true);
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    };

    generateImage();
  }, [currentIndex, screens.length, style]);

  if (!style || !genre) {
    return (
      <main className="min-h-screen bg-obsidian text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40">参数错误</p>
          <Link href="/studio/kit" className="text-indigo-400 mt-4 inline-block">返回向导</Link>
        </div>
      </main>
    );
  }

  const completedCount = screens.filter(s => s.status === 'done').length;
  const progress = screens.length > 0 ? (completedCount / screens.length) * 100 : 0;

  return (
    <main className="min-h-screen bg-obsidian text-white p-6 pb-28">
      {/* 头部 */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/studio/kit"
          className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold">批量生成中</h1>
          <p className="text-white/40 text-sm">
            {style.name} × {genre.name}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{completedCount}/{screens.length}</div>
          <div className="text-xs text-white/40">界面已完成</div>
        </div>
      </div>

      {/* 进度条 */}
      <div className="mb-8">
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
          />
        </div>
      </div>

      {/* 界面网格 */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {screens.map((item, index) => (
          <ScreenCard
            key={item.screen.id}
            screen={item.screen}
            status={item.status}
            gradient={item.gradient}
            imageUrl={item.imageUrl}
            index={index}
          />
        ))}
      </div>

      {/* 完成操作区 */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-4"
        >
          <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            重新生成
          </button>
          <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:opacity-90 flex items-center gap-2">
            <Package className="w-4 h-4" />
            打包下载全部
          </button>
        </motion.div>
      )}
    </main>
  );
}

// ========================================
// 主页面 (包裹 Suspense)
// ========================================
export default function GeneratePage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-obsidian text-white p-6 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
      </main>
    }>
      <GenerateContent />
    </Suspense>
  );
}
