"use client";

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface ByteCharacterProps {
  state: string;
  className?: string;
  isFlipped?: boolean;
  variant?: 'orange' | 'blue' | 'purple' | 'green' | 'pink'; 
  label?: string;
  idleVariant?: number; // 0-4: 不同的 Idle 微动作
}

export function ByteCharacter({ 
  state, 
  className, 
  isFlipped = false, 
  variant = 'orange', 
  label,
  idleVariant = 0 
}: ByteCharacterProps) {
  const tailPath = "M0,0 C10,10 20,-10 30,0";

  // 颜色映射
  const colors = {
    orange: { from: 'from-orange-400', to: 'to-amber-500', ear: 'bg-orange-400', jet: 'bg-orange-300' },
    blue: { from: 'from-blue-400', to: 'to-indigo-500', ear: 'bg-blue-400', jet: 'bg-blue-300' },
    purple: { from: 'from-purple-400', to: 'to-fuchsia-500', ear: 'bg-purple-400', jet: 'bg-purple-300' },
    green: { from: 'from-emerald-400', to: 'to-teal-500', ear: 'bg-emerald-400', jet: 'bg-emerald-300' },
    pink: { from: 'from-rose-400', to: 'to-pink-500', ear: 'bg-rose-400', jet: 'bg-rose-300' },
  }[variant];

  // ========================================
  // Idle 微动作库 (P0: 个体差异化)
  // ========================================
  const idleAnimations = useMemo(() => [
    // 0: 标准呼吸
    { y: [0, 5, 0], transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" } },
    // 1: 活泼弹跳
    { y: [0, -8, 0], scale: [1, 1.05, 1], transition: { duration: 1.5, repeat: Infinity, ease: "easeOut" } },
    // 2: 缓慢摇摆
    { rotate: [-3, 3, -3], y: [0, 3, 0], transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" } },
    // 3: 神经质抖动
    { x: [-1, 1, -1], y: [0, 2, 0], transition: { duration: 0.8, repeat: Infinity, ease: "linear" } },
    // 4: 左右张望
    { rotate: [-5, 5, -5], transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } },
  ], []);

  const containerVariants: Record<string, object> = {
    idle: idleAnimations[idleVariant] || idleAnimations[0],
    move: { x: [0, 2, 0], y: [0, -2, 0], rotate: 5, transition: { duration: 0.3, repeat: Infinity } },
    working: { x: [-5, 5], y: [0, -3, 0], transition: { duration: 0.4, repeat: Infinity } }, 
    poked: { scale: 1.2, rotate: [0, -10, 10, 0], transition: { duration: 0.3 } },
    success: { rotate: 360, y: [0, -30, 0], transition: { duration: 0.6, ease: "backInOut" } },
  };

  return (
    <div className={`relative w-24 h-24 flex items-center justify-center ${className || ''} group`}>
      
      {/* 名字标签 */}
      {label && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[9px] text-white/60 font-medium px-2 py-0.5 rounded-full bg-black/40 backdrop-blur whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
          {label}
        </div>
      )}

      {/* 喷气粒子 (仅 Move/Working 状态) */}
      {(state === 'move' || state === 'working') && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-0">
           {[...Array(3)].map((_, i) => (
             <motion.div
               key={i}
	               className={`w-2 h-2 ${colors.jet} rounded-full`}
               animate={{ y: [0, 10], opacity: [1, 0], scale: [1, 0] }}
               transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
             />
           ))}
        </div>
      )}

      {/* 主体容器 */}
      <motion.div
        className="relative z-10"
        variants={containerVariants}
        animate={state}
        style={{ scaleX: isFlipped ? -1 : 1 }}
      >
        {/* 尾巴 (SVG) */}
        <div className="absolute -right-4 top-2 w-8 h-8">
           <svg viewBox="-5 -10 40 20" className="stroke-gray-600 stroke-2 fill-none drop-shadow-sm">
             <motion.path 
               d={tailPath}
               animate={{ d: [
                 "M0,0 C10,10 20,-10 30,0", 
                 "M0,0 C10,-10 20,10 30,0"
               ] }}
               transition={{ duration: 1, repeat: Infinity, repeatType: "mirror" }}
             />
           </svg>
           <motion.div 
             className="absolute right-0 top-1/2 w-2 h-3 bg-gray-700 rounded-sm"
             animate={{ y: [-2, 2] }}
             transition={{ duration: 1, repeat: Infinity, repeatType: "mirror" }}
           />
        </div>

        {/* 身体 */}
        <div className={`relative w-12 h-10 bg-gradient-to-br ${colors.from} ${colors.to} rounded-2xl shadow-md border-2 border-white/20`}>
           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-5 bg-white rounded-t-xl opacity-90" />
           <div className="absolute -left-2 top-2 w-3 h-6 bg-gray-700 rounded-md shadow-sm" />
           <div className="absolute -right-2 top-2 w-3 h-6 bg-gray-700 rounded-md shadow-sm" />
        </div>

        {/* 头部 */}
        <motion.div 
          className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-10 bg-white rounded-2xl border-2 border-orange-100 shadow-sm overflow-visible"
          animate={state === 'move' ? { rotate: [0, 5, 0] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
           <div className={`absolute -top-3 left-0 w-4 h-4 ${colors.ear} rounded-tl-lg clip-ear`} />
           <div className={`absolute -top-3 right-0 w-4 h-4 ${colors.ear} rounded-tr-lg clip-ear`} />

           <div className="absolute top-3 left-1/2 -translate-x-1/2 w-full flex justify-center gap-3">
             <div className="w-1.5 h-2 bg-slate-800 rounded-full" />
             <div className="w-1.5 h-2 bg-slate-800 rounded-full" />
           </div>
           
           <div className="absolute top-6 left-1/2 -translate-x-1/2 w-2 h-1 bg-pink-300 rounded-full" />
           
           {state === 'working' && (
             <motion.div 
               className="absolute -bottom-1 left-2 w-6 h-4 bg-blue-100 border border-blue-300 rounded"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1, y: [0, -2, 0] }}
               transition={{ duration: 0.2, repeat: Infinity }}
             >
               <div className="w-full h-1 bg-blue-300/50 mt-1" />
             </motion.div>
           )}
        </motion.div>

      </motion.div>
    </div>
  );
}
