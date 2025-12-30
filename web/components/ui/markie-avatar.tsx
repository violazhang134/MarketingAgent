"use client";

import { motion } from 'framer-motion';
import { useMemo } from 'react';

export type MarkieState = 'idle' | 'listening' | 'channeling' | 'mischief' | 'magic';

interface MarkieAvatarProps {
  state: MarkieState;
  size?: number;
}

export function MarkieAvatar({ state, size = 40 }: MarkieAvatarProps) {
  // Orb 核心渐变
  const gradientClass = {
    idle: 'bg-gradient-to-br from-indigo-500 to-purple-600',
    listening: 'bg-gradient-to-br from-indigo-400 to-purple-500', 
    channeling: 'bg-gradient-to-br from-cyan-500 to-blue-600',
    magic: 'bg-gradient-to-br from-violet-500 to-amber-400',
    mischief: 'bg-gradient-to-br from-rose-500 to-orange-500',
  }[state];

  // 光晕颜色
  const glowColor = {
    idle: 'rgba(99, 102, 241, 0.5)',
    listening: 'rgba(168, 85, 247, 0.6)',
    channeling: 'rgba(6, 182, 212, 0.8)',
    magic: 'rgba(251, 191, 36, 0.8)',
    mischief: 'rgba(244, 63, 94, 0.6)',
  }[state];

  // 表情生成 (SVG Paths)
  const facePath = useMemo(() => {
    switch (state) {
      case 'listening': // (•_•) 专注
        return (
          <>
            <circle cx="12" cy="14" r="2" fill="white" fillOpacity="0.9" />
            <circle cx="20" cy="14" r="2" fill="white" fillOpacity="0.9" />
            <path d="M14 20h4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.8" />
          </>
        );
      case 'channeling': // (O_O) 睁大眼
        return (
          <>
            <circle cx="11" cy="14" r="3" stroke="white" strokeWidth="1.5" fill="none" />
            <circle cx="21" cy="14" r="3" stroke="white" strokeWidth="1.5" fill="none" />
            <path d="M14 22h4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            {/* 数据流特效 */}
            <motion.path 
              d="M8 8l16 16M24 8l-16 16" 
              stroke="white" 
              strokeWidth="0.5" 
              strokeOpacity="0.3"
              animate={{ pathLength: [0, 1, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </>
        );
      case 'magic': // (^o^) 开心
        return (
          <>
            <path d="M10 14q2 -3 4 0" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M18 14q2 -3 4 0" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="16" cy="20" r="2" fill="white" />
          </>
        );
      case 'mischief': // (>_<) 晕
        return (
          <>
             <path d="M10 12l4 4M10 16l4 -4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
             <path d="M18 12l4 4M18 16l4 -4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
             <path d="M14 22c1 -1 3 -1 4 0" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </>
        );
      case 'idle':
      default: // (^_^) 微笑
        return (
          <>
            <path d="M10 15q2 -2 4 0" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <path d="M18 15q2 -2 4 0" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            {/* 眨眼动画覆盖层 */}
            <motion.rect 
              x="8" y="12" width="16" height="6" fill="url(#eyelids)" 
              initial={{ height: 0 }}
              animate={{ height: [0, 0, 6, 0, 0] }}
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.95, 0.98, 1] }}
            />
             <path d="M14 20q1 1 2 1t2 -1" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          </>
        );
    }
  }, [state]);

  // 容器动画
  const containerVariants = {
    idle: { scale: [1, 1.05, 1], transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } },
    listening: { scale: [1, 1.1, 1], transition: { duration: 2, repeat: Infinity } },
    channeling: { rotate: 360, scale: [1, 0.9, 1.1, 1], transition: { rotate: { duration: 3, repeat: Infinity, ease: "linear" }, scale: { duration: 1, repeat: Infinity } } },
    magic: { y: [0, -5, 0], scale: [1, 1.2, 1], transition: { duration: 0.5 } },
    mischief: { rotate: [0, -10, 10, -10, 10, 0], transition: { duration: 0.5 } },
  };

  return (
    <div className="relative flex items-center justify-center p-1">
      {/* 光晕 (Glow) */}
      <motion.div
        className="absolute inset-0 rounded-full blur-md"
        style={{ background: glowColor }}
        animate={
          state === 'channeling' ? { opacity: [0.5, 1, 0.5], scale: [1, 1.5, 1] } :
          state === 'magic' ? { opacity: [0, 0.8, 0], scale: [1, 2, 1.5] } :
          { opacity: 0.6, scale: 1 }
        }
        transition={{ duration: state === 'channeling' ? 0.5 : 2, repeat: Infinity }}
      />

      {/* 实体 Orb */}
      <motion.div
        className={`relative rounded-full shadow-inner flex items-center justify-center overflow-hidden border border-white/20 ${gradientClass}`}
        style={{ width: size, height: size }}
        variants={containerVariants}
        animate={state}
      >
        {/* 高光反射 */}
        <div className="absolute top-1 left-2 w-1/3 h-1/4 bg-white/30 rounded-full blur-[1px]" />
        
        {/* 表情 SVG */}
        <svg viewBox="0 0 32 32" className="w-[80%] h-[80%] drop-shadow-sm z-10">
          <defs>
             <linearGradient id="eyelids" x1="0" y1="0" x2="0" y2="1">
               <stop offset="0%" stopColor="inherit" /> {/* 继承 Orb 背景 */}
             </linearGradient>
          </defs>
          {facePath}
        </svg>

        {/* 魔法粒子 (仅 Magic/Channeling) */}
        {(state === 'magic' || state === 'channeling') && (
           <motion.div 
             className="absolute inset-0 bg-white/20"
             animate={{ opacity: [0, 0.5, 0] }}
             transition={{ duration: 0.2, repeat: Infinity }}
           />
        )}
      </motion.div>
    </div>
  );
}

