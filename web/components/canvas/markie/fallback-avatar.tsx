"use client";

import { motion } from 'framer-motion';

interface FallbackAvatarProps {
  type: 'markie' | 'byte';
  state: string;
}

export function FallbackAvatar({ type, state }: FallbackAvatarProps) {
  const isMarkie = type === 'markie';
  
  // 颜色映射
  const mainColor = isMarkie ? 'bg-indigo-500' : 'bg-orange-500';
  const subColor = isMarkie ? 'bg-cyan-400' : 'bg-white';
  
  // 状态动画映射
  const animateProps = {
    idle: { y: [0, -5, 0], transition: { duration: 2, repeat: Infinity, ease: "easeInOut" } },
    working: { scale: [1, 1.1, 1], rotate: [0, -5, 5, 0], transition: { duration: 0.5, repeat: Infinity } },
    move: { x: [0, 2, -2, 0], skewX: [0, 10, -10, 0], transition: { duration: 0.5, repeat: Infinity } },
    poked: { scale: [1, 0.8, 1.2, 1], rotate: [0, 180, 360], transition: { duration: 0.4 } },
    success: { y: [0, -10, 0], rotateY: [0, 360], transition: { duration: 1 } },
  }[state] || {};

  return (
    <motion.div 
      className="relative w-16 h-16 flex items-center justify-center"
      animate={animateProps as any}
    >
      {/* 身体 */}
      <div className={`w-10 h-10 ${mainColor} rounded-xl shadow-lg relative`}>
        {/* 脸部/屏幕 */}
        <div className={`absolute top-1 left-1 right-1 h-5 ${subColor} opacity-90 rounded-t-lg flex items-center justify-center overflow-hidden`}>
           {/* 表情 */}
           <div className="flex gap-1">
             <div className="w-1 h-1 bg-black rounded-full animate-blink" />
             <div className="w-1 h-1 bg-black rounded-full animate-blink delay-75" />
           </div>
        </div>
        
        {/* 装饰细节 */}
        {isMarkie ? (
          <>
            {/* 翅膀 */}
            <div className="absolute -left-3 top-2 w-3 h-6 bg-cyan-400/50 rounded-l-full blur-[1px]" />
            <div className="absolute -right-3 top-2 w-3 h-6 bg-cyan-400/50 rounded-r-full blur-[1px]" />
          </>
        ) : (
          <>
            {/* 耳朵 */}
            <div className="absolute -top-2 left-1 w-3 h-3 bg-orange-500 clip-triangle" />
            <div className="absolute -top-2 right-1 w-3 h-3 bg-orange-500 clip-triangle" />
            {/* 尾巴插头 */}
            <div className="absolute -bottom-2 -right-2 w-4 h-1 bg-gray-600 rotate-45" />
          </>
        )}
      </div>
    </motion.div>
  );
}
