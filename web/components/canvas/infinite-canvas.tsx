"use client";

import { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize2, Focus, LayoutGrid, List, Layers, Cat } from 'lucide-react';
import { useCanvasStore } from '@/lib/stores/canvas-store';
import { useAppStore } from '@/lib/stores/app-store';
import { CanvasNodeCard } from './canvas-node';
import { CanvasEdgeLine } from './canvas-edge';
import { CanvasMarkie } from './canvas-markie';

// ========================================
// 无限画布组件
// 职责: 提供可缩放平移的画布，渲染节点和连线
// ========================================

// Minions 开关按钮 (独立组件，避免刷新整个画布)
function MinionToggle() {
  const { minionsEnabled, toggleMinions } = useAppStore();
  
  return (
    <button
      onClick={toggleMinions}
      className={`w-8 h-8 rounded-xl backdrop-blur-sm border flex items-center justify-center transition-colors ${
        minionsEnabled 
          ? 'bg-amber-500/30 border-amber-400/50 text-amber-300' 
          : 'bg-black/40 border-white/10 text-white/40 hover:text-white hover:bg-white/10'
      }`}
      aria-label={minionsEnabled ? '关闭小队' : '召唤小队'}
      title={minionsEnabled ? '🐱 小队活跃中 (点击关闭)' : '召唤 Minion 小队'}
    >
      <Cat className="w-4 h-4" />
    </button>
  );
}

interface InfiniteCanvasProps {
  onNodeClick?: (nodeId: string) => void;
  onCanvasClick?: () => void;
}

export function InfiniteCanvas({ 
  onNodeClick, 
  onCanvasClick 
}: InfiniteCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 拖拽状态
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [viewportStart, setViewportStart] = useState({ x: 0, y: 0 });
  
  const { 
    nodes, 
    edges, 
    activeCanvasId,
    selectedNodeId,
    viewport,
    viewMode,
    setSelectedNode,
    setViewport,
    resetViewport,
    fitToNodes,
    setViewMode,
    autoLayout,
  } = useCanvasStore();

  // 过滤当前画布的节点和边
  const canvasNodes = useMemo(
    () => nodes.filter((n) => n.canvasId === activeCanvasId),
    [nodes, activeCanvasId]
  );

  const canvasEdges = useMemo(
    () => edges.filter((e) => {
      const fromNode = nodes.find((n) => n.id === e.fromNodeId);
      const toNode = nodes.find((n) => n.id === e.toNodeId);
      return fromNode?.canvasId === activeCanvasId && toNode?.canvasId === activeCanvasId;
    }),
    [edges, nodes, activeCanvasId]
  );

  // 处理节点点击
  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNode(nodeId);
    onNodeClick?.(nodeId);
  }, [setSelectedNode, onNodeClick]);

  // ========================================
  // 拖拽平移
  // ========================================
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // 只响应左键，且不在节点上
    if (e.button !== 0) return;
    
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setViewportStart({ x: viewport.x, y: viewport.y });
  }, [viewport.x, viewport.y]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    setViewport({
      x: viewportStart.x + dx,
      y: viewportStart.y + dy,
    });
  }, [isDragging, dragStart, viewportStart, setViewport]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 全局鼠标抬起监听（处理拖出画布的情况）
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  // 处理画布背景点击
  const handleCanvasClick = useCallback(() => {
    // 如果是拖拽结束，不触发点击
    if (isDragging) return;
    
    setSelectedNode(null);
    onCanvasClick?.();
  }, [isDragging, setSelectedNode, onCanvasClick]);

  // ========================================
  // 滚轮缩放（以鼠标位置为中心）
  // ========================================
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    // 鼠标相对于画布容器的位置
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // 计算缩放
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.25, Math.min(3, viewport.zoom * zoomFactor));
    
    // 以鼠标位置为中心缩放
    const zoomRatio = newZoom / viewport.zoom;
    const newX = mouseX - (mouseX - viewport.x) * zoomRatio;
    const newY = mouseY - (mouseY - viewport.y) * zoomRatio;
    
    setViewport({ 
      x: newX, 
      y: newY, 
      zoom: newZoom 
    });
  }, [viewport, setViewport]);

  // 获取节点位置（用于连线计算）
  const getNodePosition = useCallback((nodeId: string) => {
    const node = canvasNodes.find((n) => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };
    return { x: node.x, y: node.y };
  }, [canvasNodes]);

  // ========================================
  // 缩放控制按钮
  // ========================================
  const handleZoomIn = useCallback(() => {
    const newZoom = Math.min(3, viewport.zoom * 1.2);
    setViewport({ zoom: newZoom });
  }, [viewport.zoom, setViewport]);

  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(0.25, viewport.zoom * 0.8);
    setViewport({ zoom: newZoom });
  }, [viewport.zoom, setViewport]);

  const handleResetView = useCallback(() => {
    resetViewport();
  }, [resetViewport]);

  const handleFitToNodes = useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      fitToNodes(rect.width, rect.height);
    }
  }, [fitToNodes]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleCanvasClick}
      onWheel={handleWheel}
    >
      {/* 网格背景 */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: `${40 * viewport.zoom}px ${40 * viewport.zoom}px`,
          backgroundPosition: `${viewport.x}px ${viewport.y}px`,
        }}
      />

      {/* 画布内容层 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
          transformOrigin: '0 0',
        }}
      >
        {/* 连线层 */}
        <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
          <defs>
            {/* 箭头标记 */}
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="rgba(99, 102, 241, 0.6)"
              />
            </marker>
            {/* 发光滤镜 */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <AnimatePresence>
            {canvasEdges.map((edge) => (
              <CanvasEdgeLine
                key={edge.id}
                edge={edge}
                fromPosition={getNodePosition(edge.fromNodeId)}
                toPosition={getNodePosition(edge.toNodeId)}
              />
            ))}
          </AnimatePresence>
        </svg>

        {/* 节点层 */}
        <div className="pointer-events-auto">
          <AnimatePresence>
            {canvasNodes.map((node) => (
              <CanvasNodeCard
                key={node.id}
                node={node}
                isSelected={selectedNodeId === node.id}
                onSelect={() => handleNodeClick(node.id)}
              />
            ))}
          </AnimatePresence>
          
          {/* AI 精灵 (必须在 pointer-events-auto 容器内才能响应点击) */}
          <CanvasMarkie />
        </div>
      </div>

      {/* 空状态提示 */}
      {canvasNodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md px-8"
          >
            <div className="text-6xl mb-4">🌱</div>
            <div className="text-white/60 text-lg mb-2">
              画布是空的
            </div>
            <div className="text-white/40 text-sm leading-relaxed">
              在右侧 Markie 边栏输入竞品和产品信息，点击「一键竞品调研」，
              我会在这里种下调研节点。
            </div>
          </motion.div>
        </div>
      )}

      {/* 控制面板 */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10">
        {/* 视图模式切换 */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10">
          <button
            onClick={() => setViewMode('simplified')}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
              viewMode === 'simplified' 
                ? 'bg-indigo-500/30 text-indigo-300' 
                : 'hover:bg-white/10 text-white/60 hover:text-white'
            }`}
            aria-label="简略版"
            title="简略版"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('detailed')}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
              viewMode === 'detailed' 
                ? 'bg-indigo-500/30 text-indigo-300' 
                : 'hover:bg-white/10 text-white/60 hover:text-white'
            }`}
            aria-label="详细版"
            title="详细版"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>

        {/* 一键整理 */}
        <button
          onClick={autoLayout}
          className="w-8 h-8 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="一键整理"
          title="一键整理"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>

        {/* Minions 开关 */}
        <MinionToggle />

        {/* 缩放控制 */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10">
          <button
            onClick={handleZoomOut}
            className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            aria-label="缩小"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="px-2 text-[11px] text-white/50 font-mono min-w-[40px] text-center">
            {Math.round(viewport.zoom * 100)}%
          </div>
          <button
            onClick={handleZoomIn}
            className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            aria-label="放大"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={handleFitToNodes}
          className="w-8 h-8 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="居中所有节点"
          title="居中所有节点"
        >
          <Focus className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetView}
          className="w-8 h-8 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="重置视图"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* 操作提示 */}
      <div className="absolute bottom-4 left-4 px-3 py-2 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 text-[10px] text-white/40 z-10">
        <span className="text-white/60">拖拽</span> 平移 · <span className="text-white/60">滚轮</span> 缩放 · <span className="text-white/60">点击节点</span> 查看详情
      </div>
    </div>
  );
}

