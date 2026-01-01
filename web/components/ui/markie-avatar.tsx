"use client";

import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';

export type MarkieState = 'idle' | 'listening' | 'channeling' | 'mischief' | 'magic';

interface MarkieAvatarProps {
  state: MarkieState;
  size?: number;
}

// ===========================================
// 像素画颜色定义 (High-Res Capybara / 精细版卡皮巴拉)
// ===========================================
const COLORS: Record<string, string> = {
  ' ': 'transparent',
  'B': '#3E2723',  // 深褐色 (轮廓/阴影)
  'b': '#795548',  // 棕色 (主体/暗部)
  'L': '#A1887F',  // 浅棕 (亮部/脸部)
  'H': '#D7CCC8',  // 高光 (头顶/鼻梁)
  'P': '#FF8A80',  // 鲜艳腮红
  'W': '#FFFFFF',  // 纯白 (眼白/高光/牙齿)
  'K': '#212121',  // 黑色 (眼睛/五官)
  'N': '#4E342E',  // 深鼻孔
  'R': '#D32F2F',  // 红帽 (主体)
  'r': '#B71C1C',  // 红帽 (阴影)
  'G': '#C8E6C9',  // 绿色 (装饰/困惑脸)
  'Y': '#FFD54F',  // 黄色 (星星/魔法)
};

// ===========================================
// 20x20 像素网格 - 精细化表情
// ===========================================
const GRIDS: Record<MarkieState, string[]> = {
  // idle: 呆萌微笑 (鼻涕泡?)
  idle: [
    '      rrRRRRRR      ', // 帽子
    '    rrRRRRRRRRRR    ',
    '   rRRRRRRRRRRRRR   ',
    '   WWWWrrRRRRRRRR   ', // 帽檐
    '  BWWWWbbBBBBBBBB   ', // 头顶轮廓
    ' BbbbbbbbbbbbbbbbB  ',
    ' BbbLLLLLLLLLLbbbB  ',
    'BbLLLLLLLLLLLLLbbbB ',
    'BbLLLLLLLLLLLLLbbbB ',
    'BbLL  LLLLLL  LLbbB ', // 眼睛位置
    'BbLLKKLLLLLLKKLLbbB ', // 闭眼 (睡着?)
    'BbLLLLLLLLLLLLLLbbB ',
    'BbPPLLLLLLLLLLPPbbB ', // 腮红
    'BbLLLL  NN  LLLLbbB ', // 鼻子
    ' BbbLL  WW  LLbbbB  ', // 鼻涕泡/牙齿
    ' BbbLLLLLLLLLLbbbB  ',
    '  BbbbbbbbbbbbbbB   ',
    '   BBBBBBBBBBBBBB   ',
    '                    ',
    '                    ',
  ],
  // listening: 警觉 (O_O)
  listening: [
    '      rrRRRRRR      ',
    '    rrRRRRRRRRRR    ',
    '   rRRRRRRRRRRRRR   ',
    '   WWWWrrRRRRRRRR   ',
    '  BWWWWbbBBBBBBBB   ',
    ' BbbbbbbbbbbbbbbbB  ',
    ' BbbLLLLLLLLLLbbbB  ',
    'BbLLWWWWLLWWWWLLbbB ', // 大白眼底
    'BbLLWWWWLLWWWWLLbbB ',
    'BbLLWKKWLLWKKWLLbbB ', // 大黑眼珠
    'BbLLWKKWLLWKKWLLbbB ',
    'BbLLLLLLLLLLLLLLbbB ',
    'BbPPLLLLLLLLLLPPbbB ',
    'BbLLLL  NN  LLLLbbB ',
    ' BbbLL K  K LLbbbB  ', // 只有鼻子
    ' BbbLLLLLLLLLLbbbB  ',
    '  BbbbbbbbbbbbbbB   ',
    '   BBBBBBBBBBBBBB   ',
    '                    ',
    '                    ',
  ],
  // channeling: 思考/下载 (Loading...)
  channeling: [
    '      rrRRRRRR      ',
    '    rrRRRRRRRRRR    ',
    '   rRRRRRRRRRRRRR   ',
    '   WWWWrrRRRRRRRR   ',
    '  BWWWWbbBBBBBBBB   ',
    ' BbbbbbbbbbbbbbbbB  ',
    ' BbbLLLLLLLLLLbbbB  ',
    'BbLLKKKKLLWWWWLLbbB ', // 左眼闭
    'BbLLKKKKLLWWWWLLbbB ',
    'BbLLLLLLLLWKKWLLbbB ', // 右眼开 (单眼wink)
    'BbLLLLLLLLWKKWLLbbB ',
    'BbLLLLLLLLLLLLLLbbB ',
    'BbPPLLLLLLLLLLPPbbB ',
    'BbLLLL  NN  LLLLbbB ',
    ' BbbLL KKKK LLbbbB  ', // 歪嘴
    ' BbbLLLLLLLLLLbbbB  ',
    '  BbbbbbbbbbbbbbB   ',
    '   BBBBBBBBBBBBBB   ',
    '                    ',
    '                    ',
  ],
  // magic: 狂喜 (星星眼)
  magic: [
    '      rrRRRRRR      ',
    '   YrrRRRRRRRRRR    ',
    '  YYYrRRRRRRRRRRR   ', // 帽子发光
    '  YWWWWrrRRRRRRRR   ',
    '  BWWWWbbBBBBBBBB   ',
    ' BbbbbbbbbbbbbbbbB  ',
    ' BbbLLLLLLLLLLbbbB  ',
    'BbLLYYYYLLYYYYLLbbB ', // 星星眼 - 上
    'BbYYYYYYLYYYYYYLbbB ', // 星星眼 - 中
    'BbLLYYYYLLYYYYLLbbB ', // 星星眼 - 下
    'BbLL  LLLLLL  LLbbB ',
    'BbLLLLLLLLLLLLLLbbB ',
    'BbPPLLLLLLLLLLPPbbB ',
    'BbLLLL  NN  LLLLbbB ',
    ' BbbLL QQQQ LLbbbB  ', // 张大嘴 (Q用红色代替深色口)
    ' BbbLL QQQQ LLbbbB  ',
    '  BbbbbbbbbbbbbbB   ',
    '   BBBBBBBBBBBBBB   ',
    '                    ',
    '                    ',
  ],
  // mischief: 晕/困惑 (X_X)
  mischief: [
    '      rrRRRRRR      ',
    '    rrRRRRRRRRRR    ',
    '   rRRRRRRRRRRRRR   ',
    '   WWWWrrRRRRRRRR   ',
    '  BWWWWbbBBBBBBBB   ',
    ' BbbbbbbbbbbbbbbbB  ',
    ' BbbLLLLLLLLLLbbbB  ',
    'BbLLK  KLLK  KLLbbB ', // X眼
    'BbLL KK LL KK LLbbB ',
    'BbLL KK LL KK LLbbB ',
    'BbLLK  KLLK  KLLbbB ',
    'BbLLLLLLLLLLLLLLbbB ',
    'BbGGLLLLLLLLLLGGbbB ', // 脸色发青的腮红
    'BbLLLL  NN  LLLLbbB ',
    ' BbbLL ~~~~ LLbbbB  ', // 波浪嘴
    ' BbbLLLLLLLLLLbbbB  ',
    '  BbbbbbbbbbbbbbB   ',
    '   BBBBBBBBBBBBBB   ',
    '                    ',
    '                    ',
  ],
};

// ===========================================
// Box-Shadow 生成器
// ===========================================
function generateBoxShadow(grid: string[], pixelSize: number): string {
  const shadows: string[] = [];
  
  grid.forEach((row, y) => {
    [...row].forEach((char, x) => {
      let color = COLORS[char];
      
      // 特殊字符替换
      if (char === 'Q') color = '#3E2723'; // 大嘴深色
      if (char === '~') color = '#3E2723'; // 波浪嘴
      
      if (color && color !== 'transparent') {
        shadows.push(`${x * pixelSize}px ${y * pixelSize}px 0 ${color}`);
      }
    });
  });
  
  return shadows.join(', ');
}

// ===========================================
// 组件
// ===========================================
export function MarkieAvatar({ state, size = 64 }: MarkieAvatarProps) {
  // 增加分辨率到 20x20
  const pixelSize = size / 20;
  
  const [animTiming] = useState(() => ({
    breathDuration: 2.5 + Math.random(),
  }));

  const boxShadow = useMemo(() => {
    return generateBoxShadow(GRIDS[state], pixelSize);
  }, [state, pixelSize]);

  // 容器动画
  const containerVariants = {
    idle: { 
      y: [0, -3, 0], 
      transition: { duration: animTiming.breathDuration, repeat: Infinity, ease: "easeInOut" as const } 
    },
    listening: { 
      scale: [1, 1.1, 1], 
      rotate: [0, -5, 5, 0],
      transition: { duration: 2, repeat: Infinity } 
    },
    channeling: { 
      rotate: [0, 360], 
      scale: [0.9, 1],
      transition: { rotate: { duration: 3, repeat: Infinity, ease: "linear" as const }, scale: { duration: 1, repeat: Infinity } } 
    },
    magic: { 
      y: [0, -8, 0], 
      scale: [1, 1.2, 1], 
      filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)'],
      transition: { duration: 0.6, repeat: Infinity } 
    },
    mischief: { 
      x: [-2, 2, -2, 2, 0], 
      rotate: [-5, 5, -5, 5, 0], 
      transition: { duration: 0.5, repeat: Infinity } 
    },
  };

  // 光晕颜色
  const glowColor = {
    idle: 'rgba(121, 85, 72, 0.3)',      // 棕色 (低调)
    listening: 'rgba(121, 85, 72, 0.6)', // 棕色 (专注)
    channeling: 'rgba(33, 150, 243, 0.6)', // 蓝色 (数据流)
    magic: 'rgba(255, 235, 59, 0.7)',      // 金色 (魔法)
    mischief: 'rgba(244, 67, 54, 0.5)',    // 红色 (错误)
  }[state];

  return (
    <div 
      className="relative flex items-center justify-center"
      style={{ width: size + 4, height: size + 4 }}
    >
      {/* 动态光晕 */}
      <motion.div
        className="absolute inset-0 rounded-full blur-xl"
        style={{ background: glowColor }}
        animate={
          state === 'magic' ? { opacity: [0.4, 0.8, 0.4], scale: [1, 1.2, 1] } :
          state === 'channeling' ? { opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.1, 0.9] } :
          { opacity: 0.4, scale: 1 }
        }
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* 像素画容器 */}
      <motion.div
        className="relative"
        style={{ width: size, height: size }}
        variants={containerVariants}
        animate={state}
      >
        <div
          style={{
            width: pixelSize,
            height: pixelSize,
            boxShadow: boxShadow,
            imageRendering: 'pixelated',
          }}
        />
      </motion.div>
    </div>
  );
}
