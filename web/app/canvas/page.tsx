"use client";

import { ResearchCanvas } from '@/components/canvas/research-canvas';

export default function CanvasPage() {
  return (
    <div className="min-h-screen px-4 py-6 md:px-8 md:py-10 pb-28">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Research Canvas</h1>
          <p className="text-sm text-white/50 max-w-2xl">
            这里是调研过程的可视化空间。Markie 会把竞品分析、评论洞察和创意策略种成一个个节点，方便你复盘和继续创作。
          </p>
        </div>

        <ResearchCanvas />
      </div>
    </div>
  );
}

