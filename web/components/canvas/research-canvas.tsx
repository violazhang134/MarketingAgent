"use client";

import { useMemo, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useCanvasStore } from '@/lib/stores/canvas-store';
import { useCampaignStore } from '@/lib/stores/campaign-store';
import { NodeContentRenderer } from './node-content-renderer';

export function ResearchCanvas() {
  const { 
    canvases, 
    activeCanvasId, 
    nodes, 
    selectedNodeId, 
    setSelectedNode,
    deleteNode,
  } = useCanvasStore();

  const { competitorName, generateAssetsWorkflow } = useCampaignStore();

  const [previewNodeId, setPreviewNodeId] = useState<string | null>(null);

  const activeCanvas = useMemo(
    () => canvases.find((c) => c.id === activeCanvasId) ?? canvases[0],
    [canvases, activeCanvasId]
  );

  const canvasNodes = useMemo(
    () => nodes.filter((n) => n.canvasId === activeCanvas?.id),
    [nodes, activeCanvas]
  );

  const previewNode = useMemo(
    () => canvasNodes.find((n) => n.id === previewNodeId) ?? null,
    [canvasNodes, previewNodeId]
  );

  return (
    <div className="relative flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-white/40">Research Canvas</div>
          <div className="text-lg font-semibold">{activeCanvas?.title}</div>
        </div>
        <div className="text-[11px] text-white/30">
          共 {canvasNodes.length} 个节点
        </div>
      </div>

      <div className="flex-1 rounded-3xl border border-white/10 bg-black/40 p-4 overflow-auto">
        {canvasNodes.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-white/40 text-center max-w-xs mx-auto">
            还没有任何调研节点。可以在右侧 Markie 边栏点击「一键竞品调研」，我会自动在这里种下第一批节点。
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {canvasNodes.map((node) => (
              <div
                key={node.id}
                onClick={() => {
                  setSelectedNode(node.id);
                  setPreviewNodeId(node.id);
                }}
                className={
                  node.id === selectedNodeId
                    ? "group relative rounded-2xl border border-indigo-400 bg-indigo-500/10 p-4 flex flex-col gap-2"
                    : "group relative rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col gap-2"
                }
              >
                {node.id === selectedNodeId && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNode(node.id);
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-black/80 border border-white/20 flex items-center justify-center text-white/40 hover:text-red-300 hover:border-red-400 hover:bg-red-950/80 transition-colors text-[11px]"
                    aria-label="删除节点"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
                <div className="text-[11px] uppercase tracking-widest text-white/30">
                  {node.type === 'text' && 'TEXT NODE'}
                  {node.type === 'chart' && 'CHART NODE'}
                  {node.type === 'reference' && 'REFERENCE'}
                  {node.type === 'media' && 'MEDIA'}
                </div>
                <div className="text-sm font-semibold">{node.title}</div>
                <div className="text-xs text-white/60 leading-relaxed whitespace-pre-wrap">
                  {node.summary}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {previewNode && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-6xl h-[80vh] mx-4 rounded-3xl bg-black border border-white/10 shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div>
                <div className="text-[11px] text-white/40">调研节点预览 · {activeCanvas?.title}</div>
                <div className="text-sm font-semibold text-white mt-0.5">
                  {previewNode.title}
                </div>
              </div>
              <button
                onClick={() => setPreviewNodeId(null)}
                className="w-7 h-7 rounded-full bg-white/5 border border-white/15 text-white/60 hover:bg-white/15 hover:text-white transition-colors text-xs"
                aria-label="关闭预览"
              >
                ×
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto p-4 custom-scrollbar">
              <NodeContentRenderer node={previewNode} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
