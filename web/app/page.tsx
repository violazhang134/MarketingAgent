"use client";

import { useState, useCallback } from "react";
import { InfiniteCanvas } from "@/components/canvas/infinite-canvas";
import { MarkieSidebar } from "@/components/ui/markie-sidebar";
import { NodeDetailModal } from "@/components/canvas/node-detail-modal";
import { useCanvasStore } from "@/lib/stores/canvas-store";

// ========================================
// 首页 - 无限画布入口
// 职责: 整合画布主区域 + Markie 边栏 + 节点详情弹窗
// ========================================

export default function Home() {
  const [detailNodeId, setDetailNodeId] = useState<string | null>(null);
  const { nodes, viewMode } = useCanvasStore();

  // 处理节点点击：选中并打开详情弹窗
  const handleNodeClick = useCallback((nodeId: string) => {
    // 详细模式下不需要弹窗，因为内容已直接展示
    if (viewMode === 'detailed') return;

    const node = nodes.find((n) => n.id === nodeId);
    if (node?.expandable) {
      setDetailNodeId(nodeId);
    }
  }, [nodes, viewMode]);

  // 关闭详情弹窗
  const handleCloseDetail = useCallback(() => {
    setDetailNodeId(null);
  }, []);

  // 处理画布背景点击
  const handleCanvasClick = useCallback(() => {
    setDetailNodeId(null);
  }, []);

  return (
    <main className="h-screen bg-[#050505] text-white flex overflow-hidden">
      {/* 画布主区域 */}
      <div className="flex-1 relative">
        <InfiniteCanvas
          onNodeClick={handleNodeClick}
          onCanvasClick={handleCanvasClick}
        />
        
        {/* 左上角品牌标识 */}
        <div className="absolute top-4 left-4 flex items-center gap-3 z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">Marketing Agent</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] text-white/40 uppercase tracking-widest">Canvas Mode</span>
            </div>
          </div>
        </div>

        {/* 快捷提示 */}
        <div className="absolute bottom-4 left-4 px-3 py-2 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 text-[11px] text-white/40 z-10">
          <span className="text-white/60">Tip:</span> 在右侧输入竞品名，开始调研之旅 →
        </div>
      </div>

      {/* Markie 边栏 */}
      <MarkieSidebar />

      {/* 节点详情弹窗 */}
      {detailNodeId && (
        <NodeDetailModal 
          nodeId={detailNodeId} 
          onClose={handleCloseDetail}
        />
      )}
    </main>
  );
}
