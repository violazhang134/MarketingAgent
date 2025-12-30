"use client";

import React, { useEffect, useRef } from 'react';

export interface SpriteConfig {
  imageUrl: string;
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  row: number; // 0-indexed row in sprite sheet
  fps?: number;
  scale?: number;
}

interface SpriteAnimatorProps {
  config: SpriteConfig;
  className?: string;
  fallback?: React.ReactNode; // 当没有图片或加载失败时显示的内容
}

export function SpriteAnimator({ config, className, fallback }: SpriteAnimatorProps) {
  const { imageUrl, frameWidth, frameHeight, frameCount, row, fps = 8, scale = 1 } = config;
  
  // 计算 CSS 变量
  const style = {
    '--frame-width': `${frameWidth}px`,
    '--frame-height': `${frameHeight}px`,
    '--frame-count': frameCount,
    '--duration': `${frameCount / fps}s`,
    '--bg-image': `url(${imageUrl})`,
    '--row-offset': `-${row * frameHeight}px`,
    '--scale': scale,
  } as React.CSSProperties;

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{
        width: frameWidth * scale,
        height: frameHeight * scale,
      }}
    >
      {/* 序列帧层 */}
      <div 
        className="absolute top-0 left-0 w-full h-full bg-no-repeat rendering-pixelated"
        style={{
          width: frameWidth,
          height: frameHeight,
          backgroundImage: `var(--bg-image)`,
          backgroundPositionY: `var(--row-offset)`,
          transform: `scale(var(--scale))`,
          transformOrigin: 'top left',
          animation: `sprite-play var(--duration) steps(var(--frame-count)) infinite`,
        }}
      />
      
      {/* Fallback (如果图片未加载或为了调试) */}
      {!imageUrl && fallback && (
        <div className="absolute inset-0 flex items-center justify-center">
          {fallback}
        </div>
      )}

      <style jsx>{`
        @keyframes sprite-play {
          from { background-position-x: 0px; }
          to { background-position-x: -${frameWidth * frameCount}px; }
        }
        .rendering-pixelated {
          image-rendering: pixelated; /* 保持像素清晰 */
        }
      `}</style>
    </div>
  );
}
