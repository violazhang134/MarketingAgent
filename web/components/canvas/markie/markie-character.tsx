"use client";

import { motion } from 'framer-motion';
import { useMemo, useState, useEffect } from 'react';

interface MarkieCharacterProps {
  state: string; // 'idle' | 'working' | 'move' | 'poked' | 'success' | 'channeling' | 'analyzing'
  className?: string;
}

export function MarkieCharacter({ state, className }: MarkieCharacterProps) {
  // 翅膀 SVG 路径
  const wingPath = "M0,50 Q20,0 50,10 Q80,20 100,50 Q80,100 50,90 Q20,80 0,50 Z";

  // 眼球追踪
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      // 限制眼球移动范围 (-3px 到 3px)
      const x = Math.max(-3, Math.min(3, (e.clientX / window.innerWidth - 0.5) * 10));
      const y = Math.max(-2, Math.min(2, (e.clientY / window.innerHeight - 0.5) * 8));
      setEyePos({ x, y });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  // 状态动画变体
  const bodyVariants = {
    idle: { y: [0, -8, 0], rotate: 0, transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const } },
    move: { y: 0, rotate: 15, x: [0, 5, 0], transition: { duration: 0.5, repeat: Infinity } },
    working: { y: [0, -2, 0], rotate: 0, transition: { duration: 0.2, repeat: Infinity } },
    analyzing: { y: [0, -4, 0], transition: { duration: 2, repeat: Infinity } }, // 沉稳悬浮
    channeling: { y: [0, -10, 0], scale: 1.1, filter: "brightness(1.2)", transition: { duration: 0.5, repeat: Infinity } }, // 能量爆发
    poked: { scale: [1, 0.9, 1.1, 1], rotate: [0, -10, 10, 0], transition: { duration: 0.4 } },
    success: { y: [0, -20, 0], rotateY: 360, transition: { duration: 0.8 } },
  };

  const wingLeftVariants = {
    idle: { rotate: [10, -5, 10], opacity: 0.7, transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const } },
    analyzing: { rotate: [10, 15, 10], opacity: 0.8, transition: { duration: 3, repeat: Infinity } },
    channeling: { rotate: [10, 30, 10], opacity: 1, filter: "drop-shadow(0 0 5px cyan)", transition: { duration: 0.2, repeat: Infinity } },
    move: { rotate: [10, 20, 10], opacity: 0.9, transition: { duration: 0.2, repeat: Infinity } },
    working: { rotate: [10, 0, 10], opacity: 0.8, transition: { duration: 1, repeat: Infinity } },
  };

  const wingRightVariants = {
    idle: { rotate: [-10, 5, -10], opacity: 0.7, transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const } },
    analyzing: { rotate: [-10, -15, -10], opacity: 0.8, transition: { duration: 3, repeat: Infinity } },
    channeling: { rotate: [-10, -30, -10], opacity: 1, filter: "drop-shadow(0 0 5px cyan)", transition: { duration: 0.2, repeat: Infinity } },
    move: { rotate: [-10, -20, -10], opacity: 0.9, transition: { duration: 0.2, repeat: Infinity } },
    working: { rotate: [-10, 0, -10], opacity: 0.8, transition: { duration: 1, repeat: Infinity } },
  };

  return (
    <div className={`relative w-32 h-32 flex items-center justify-center ${className}`}>
      {/* ====================
          背后光环 (Aura)
         ==================== */}
      <motion.div 
        className="absolute w-24 h-24 rounded-full bg-indigo-500/20 blur-xl"
        animate={{ 
          scale: state === 'channeling' ? [1, 1.5, 1] : [1, 1.2, 1], 
          opacity: state === 'working' ? 0.6 : (state === 'channeling' ? 0.8 : 0.3),
          backgroundColor: state === 'analyzing' ? 'rgba(6, 182, 212, 0.3)' : 'rgba(99, 102, 241, 0.2)'
        }}
        transition={{ duration: state === 'channeling' ? 0.5 : 2, repeat: Infinity }}
      />

      {/* ====================
          左翅膀 (Left Wing)
         ==================== */}
      <motion.div
        className="absolute left-1/2 top-1/2 -ml-12 -mt-8 w-12 h-20 origin-right brightness-125"
        variants={wingLeftVariants}
        animate={state as any}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full fill-cyan-400/40 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">
          <path d={wingPath} transform="scale(-1, 1) translate(-100, 0)" />
        </svg>
      </motion.div>

      {/* ====================
          右翅膀 (Right Wing)
         ==================== */}
      <motion.div
        className="absolute left-1/2 top-1/2 ml-0 -mt-8 w-12 h-20 origin-left brightness-125"
        variants={wingRightVariants}
        animate={state as any}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full fill-cyan-400/40 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">
          <path d={wingPath} />
        </svg>
      </motion.div>

      {/* ====================
          身体主体 (Body Group)
         ==================== */}
      <motion.div
        className="relative z-10 w-12 h-16"
        variants={bodyVariants}
        animate={state as any}
      >
        {/* 头发/头部光晕 */}
        <div className={`absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full blur-[2px] opacity-80 ${
          state === 'analyzing' ? 'bg-gradient-to-t from-cyan-500 to-emerald-400' : 'bg-gradient-to-t from-indigo-500 to-cyan-400'
        }`} />
        
        {/* 脸部 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-inner overflow-hidden">
          {/* 眼睛组件 */}
          <div className="absolute top-4 left-0 w-full flex justify-center gap-2">
            <BlinkingEye delay={0} state={state} offset={eyePos} />
            <BlinkingEye delay={0.1} state={state} offset={eyePos} />
          </div>
          
          {/* Analyzing 状态下的数据流眼镜特效 */}
          {state === 'analyzing' && (
            <motion.div 
              className="absolute top-3 left-0 w-full h-4 bg-emerald-500/20 flex items-center justify-center overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
               <div className="text-[6px] text-emerald-600 font-mono leading-none whitespace-nowrap animate-slide-left">
                 1010101011001
               </div>
            </motion.div>
          )}

          {/* 嘴巴 (Working 时变化) */}
          <div className="absolute top-7 left-1/2 -translate-x-1/2">
            {state === 'working' || state === 'channeling' ? (
              <div className="w-2 h-1 bg-pink-400 rounded-full animate-pulse" />
            ) : (
              <div className="w-2 h-0.5 bg-pink-300 rounded-full" />
            )}
          </div>
        </div>

        {/* 身体/制服 */}
        <div className="absolute top-9 left-1/2 -translate-x-1/2 w-8 h-10 bg-gradient-to-b from-indigo-600 to-indigo-800 rounded-2xl shadow-lg flex items-center justify-center">
          {/* 核心能量块 */}
          <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-pulse ${
            state === 'channeling' ? 'bg-white' : 'bg-cyan-400'
          }`} />
        </div>

        {/* ====================
            工作状态特效：全息键盘/圆环
           ==================== */}
        {(state === 'working' || state === 'channeling') && (
          <motion.div 
            className="absolute top-12 left-1/2 -translate-x-1/2 w-20 h-20"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, rotateX: 60 }}
          >
             {/* 模拟全息圆环 */}
             <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-full animate-[spin_3s_linear_infinite]" />
             <div className="absolute inset-2 border border-indigo-400/30 rounded-full animate-[spin_2s_linear_infinite_reverse]" />
          </motion.div>
        )}
        
        {/* Analyzing 特效：扫描光 */}
        {state === 'analyzing' && (
          <motion.div 
             className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-2 bg-emerald-400/30 blur-md"
             animate={{ top: [0, 60, 0], opacity: [0, 1, 0] }}
             transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        )}

        {/* Poked 特效 */}
        {state === 'poked' && (
           <motion.div 
             className="absolute -top-4 right-0 text-lg font-bold text-red-500"
             initial={{ scale: 0, opacity: 0 }}
             animate={{ scale: 1.5, opacity: 1, y: -20 }}
             exit={{ opacity: 0 }}
           >
             ?!
           </motion.div>
        )}
      </motion.div>
    </div>
  );
}

// 子组件：眨眼的眼睛
function BlinkingEye({ delay, state, offset }: { delay: number, state: string, offset: {x:number, y:number} }) {
  // 保持随机数稳定，避免 hydration mismatch
  const randomDelay = useMemo(() => Math.random() * 2 + 1, []);

  // Poked 状态变成 XX 眼
  if (state === 'poked') {
     return <div className="text-[8px] font-bold text-indigo-900 select-none">&gt;&lt;</div>;
  }
  
  // Analyzing 状态变成数据眼
  if (state === 'analyzing') {
    return <div className="w-2 h-2 text-[6px] text-emerald-600 font-mono leading-none animate-pulse">01</div>;
  }

  // Channeling 状态发光
  const isGlowing = state === 'channeling';

  return (
    <motion.div
      className={`w-2 h-2.5 rounded-full relative overflow-hidden ${isGlowing ? 'bg-cyan-300 shadow-[0_0_5px_cyan]' : 'bg-indigo-900'}`}
      // 眨眼动画
      animate={{ scaleY: [1, 1, 0.1, 1, 1, 1] }}
      transition={{
        duration: 4,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: randomDelay,
        delay: delay
      }}
    >
       {/* 瞳孔跟随鼠标 */}
       {!isGlowing && (
         <motion.div 
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            animate={{ x: offset.x, y: offset.y }}
            initial={{ top: 1, right: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
         />
       )}
    </motion.div>
  );
}
