"use client";

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { CanvasEdge } from '@/lib/stores/canvas-store';

// ========================================
// 画布连线组件
// 职责: 在节点之间绘制贝塞尔曲线连线
// ========================================

interface CanvasEdgeLineProps {
  edge: CanvasEdge;
  fromPosition: { x: number; y: number };
  toPosition: { x: number; y: number };
}

// 节点尺寸常量（与 canvas-node 保持一致）
const NODE_WIDTH = 280;
const NODE_HEIGHT = 100;

export function CanvasEdgeLine({ edge, fromPosition, toPosition }: CanvasEdgeLineProps) {
  // 计算连线路径
  const pathData = useMemo(() => {
    // 起点：源节点右侧中心
    const startX = fromPosition.x + NODE_WIDTH;
    const startY = fromPosition.y + NODE_HEIGHT / 2;
    
    // 终点：目标节点左侧中心
    const endX = toPosition.x;
    const endY = toPosition.y + NODE_HEIGHT / 2;
    
    // 贝塞尔曲线控制点
    const dx = endX - startX;
    const controlOffset = Math.min(Math.abs(dx) / 2, 100);
    
    const controlX1 = startX + controlOffset;
    const controlY1 = startY;
    const controlX2 = endX - controlOffset;
    const controlY2 = endY;

    return `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`;
  }, [fromPosition, toPosition]);

  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 发光底层 */}
      <motion.path
        d={pathData}
        fill="none"
        stroke="rgba(99, 102, 241, 0.3)"
        strokeWidth="4"
        strokeLinecap="round"
        filter="url(#glow)"
      />
      
      {/* 主线条 */}
      <motion.path
        d={pathData}
        fill="none"
        stroke="rgba(99, 102, 241, 0.6)"
        strokeWidth="2"
        strokeLinecap="round"
        markerEnd="url(#arrowhead)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />

      {/* 流动动画（仅在 animated 时显示） */}
      {edge.animated && (
        <motion.circle
          r="3"
          fill="rgba(129, 140, 248, 0.8)"
          filter="url(#glow)"
        >
          <animateMotion
            dur="2s"
            repeatCount="indefinite"
            path={pathData}
          />
        </motion.circle>
      )}

      {/* 标签（如果有） */}
      {edge.label && (
        <motion.text
          x={(fromPosition.x + NODE_WIDTH + toPosition.x) / 2}
          y={(fromPosition.y + toPosition.y + NODE_HEIGHT) / 2 - 10}
          fill="rgba(255, 255, 255, 0.4)"
          fontSize="10"
          textAnchor="middle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {edge.label}
        </motion.text>
      )}
    </motion.g>
  );
}
