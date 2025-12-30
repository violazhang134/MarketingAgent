"use client";

import { useCallback } from 'react';
import { type CanvasNode } from '@/lib/stores/canvas-store';
import { useCampaignStore } from '@/lib/stores/campaign-store';
import { CompetitorReportView } from '@/components/report/competitor-report-view';
import { InsightsReporter } from '@/components/report/insights-reporter';
import { CreativePackDetail } from './details/creative-pack-detail';
import { ExperimentPackDetail } from './details/experiment-pack-detail';
import { TacticalPlanDetail } from './details/tactical-plan-detail';
import {
  isTacticalPlanData,
  isExperimentPackData,
  isCreativePackData,
  isInsightsData,
} from '@/lib/types/canvas-meta-types';

// ========================================
// 节点内容渲染器
// 职责: 根据 node.detailComponent 渲染对应的详情内容
// 用途: 被 NodeDetailModal 和 DetailedCanvasNode 复用
// ========================================

interface NodeContentRendererProps {
  node: CanvasNode;
  compact?: boolean;  // 紧凑模式（画布内嵌时使用）
}

export function NodeContentRenderer({ node, compact = false }: NodeContentRendererProps) {
  const { competitorName, generateAssetsWorkflow } = useCampaignStore();
  
  const detailComponent = node.detailComponent;
  const meta = node.meta || {};

  // 处理生成素材操作
  const handleGenerate = useCallback(() => {
    generateAssetsWorkflow();
  }, [generateAssetsWorkflow]);

  // ========================================
  // 根据 detailComponent 路由到对应组件
  // ========================================
  switch (detailComponent) {
    // ----------------------------------------
    // 竞品报告
    // ----------------------------------------
    case 'CompetitorReportView':
      return (
        <CompetitorReportView
          gameName={meta.competitorName || competitorName || '示例竞品'}
          onGenerateClone={handleGenerate}
          showGenerateButton={!compact}
        />
      );

    // ----------------------------------------
    // 洞察报告
    // ----------------------------------------
    case 'InsightsReporter': {
      const insightsData = meta.insightsData;
      
      // 类型守卫：确保数据结构有效
      if (isInsightsData(insightsData)) {
        return (
          <InsightsReporter
            analysis={insightsData.analysis}
            report={insightsData.report}
            competitorName={meta.competitorName || competitorName || '示例竞品'}
          />
        );
      }
      
      return (
        <div className="p-8 text-center text-white/40">
          <p>洞察数据尚未生成</p>
          <p className="text-xs mt-2">请先运行完整的调研流程</p>
        </div>
      );
    }

    // ----------------------------------------
    // 策略计划
    // ----------------------------------------
    case 'TacticalPlanView': {
      const planData = meta.planData;
      
      if (isTacticalPlanData(planData)) {
        return <TacticalPlanDetail data={planData} />;
      }
      
      return (
        <div className="p-8 text-center text-white/40">
          <p>策略数据异常</p>
        </div>
      );
    }

    // ----------------------------------------
    // 创意素材包
    // ----------------------------------------
    case 'CreativePackView': {
      const packData = {
        scripts: meta.scripts,
        copyVariants: meta.copyVariants,
        hooks: meta.hooks,
      };
      
      if (isCreativePackData(packData)) {
        return <CreativePackDetail data={packData} />;
      }
      
      return (
        <div className="p-8 text-center text-white/40">
          <p>素材数据异常</p>
        </div>
      );
    }
    
    // ----------------------------------------
    // 实验配置
    // ----------------------------------------
    case 'ExperimentPackView': {
      const expData = meta.experimentPack;
      
      if (isExperimentPackData(expData)) {
        return <ExperimentPackDetail data={expData} />;
      }
      
      return (
        <div className="p-8 text-center text-white/40">
          <p>实验配置数据异常</p>
        </div>
      );
    }

    // ----------------------------------------
    // 默认：展示节点摘要
    // ----------------------------------------
    default:
      return (
        <div className={compact ? "p-4 space-y-4" : "p-6 space-y-6"}>
          {/* 摘要 */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-sm font-medium text-white/60 mb-2">摘要</div>
            <div className="text-sm text-white whitespace-pre-wrap leading-relaxed">
              {node.summary}
            </div>
          </div>

          {/* 元数据 */}
          {meta && Object.keys(meta).length > 0 && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-sm font-medium text-white/60 mb-3">元数据</div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {meta.competitorName && (
                  <div>
                    <span className="text-white/40">竞品：</span>
                    <span className="text-white">{meta.competitorName}</span>
                  </div>
                )}
                {meta.productName && (
                  <div>
                    <span className="text-white/40">产品：</span>
                    <span className="text-white">{meta.productName}</span>
                  </div>
                )}
                {meta.createdAt && (
                  <div>
                    <span className="text-white/40">创建时间：</span>
                    <span className="text-white">
                      {new Date(meta.createdAt).toLocaleString('zh-CN')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 操作按钮（非紧凑模式） */}
          {!compact && node.type === 'creative' && (
            <button
              onClick={handleGenerate}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium hover:opacity-90 transition-opacity"
            >
              🚀 生成创意素材
            </button>
          )}
        </div>
      );
  }
}
