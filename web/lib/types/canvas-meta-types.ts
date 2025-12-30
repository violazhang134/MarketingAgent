// ========================================
// Canvas Node Meta 类型定义
// 职责: 为所有节点详情组件提供类型契约
// 设计: 消除 any，建立编译时安全保障
// ========================================

// ----------------------------------------
// Tactical Plan (策略计划)
// ----------------------------------------
export interface ComparisonPoint {
  dimension: string;
  competitor: string;
  us: string;
  advantage: boolean;
}

export interface ActionItem {
  stage: string;
  action: string;
  expectedOutcome: string;
}

export interface TacticalPlanData {
  summary: string;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  comparison: ComparisonPoint[];
  roadmap: ActionItem[];
}

// ----------------------------------------
// Experiment Pack (实验配置)
// ----------------------------------------
export interface ExperimentArm {
  id: string;
  name: string;
  config: Record<string, string | undefined>;
  trackingLink: string;
}

export interface ExperimentPackData {
  experimentId: string;
  variable: string;
  arms: ExperimentArm[];
  allocations: [number, number];
}

// ----------------------------------------
// Creative Pack (创意素材包)
// ----------------------------------------
export interface ScriptScene {
  timestamp: string;
  visual: string;
  audio: string;
  text: string;
}

export interface Script {
  id: string;
  title: string;
  duration: string;
  platform: string;
  hook: string;
  cta: string;
  scenes: ScriptScene[];
}

export interface CreativePackData {
  scripts: Script[];
  copyVariants: string[];
  hooks: string[];
}

// ----------------------------------------
// Insights (洞察报告)
// 直接复用 comment-analyzer 的类型，确保一致性
// ----------------------------------------
export type { CommentAnalysis, InsightsReport } from '@/lib/engines/comment-analyzer';

// 用于 meta 存储的包装类型
export interface InsightsData {
  analysis: import('@/lib/engines/comment-analyzer').CommentAnalysis;
  report: import('@/lib/engines/comment-analyzer').InsightsReport;
}

// ----------------------------------------
// Type Guards (类型守卫)
// 职责: 运行时验证数据结构，防止白屏
// ----------------------------------------
export function isTacticalPlanData(data: unknown): data is TacticalPlanData {
  if (typeof data !== 'object' || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.summary === 'string' &&
    typeof d.swot === 'object' && d.swot !== null &&
    Array.isArray(d.comparison) &&
    Array.isArray(d.roadmap)
  );
}

export function isExperimentPackData(data: unknown): data is ExperimentPackData {
  if (typeof data !== 'object' || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.experimentId === 'string' &&
    typeof d.variable === 'string' &&
    Array.isArray(d.arms)
  );
}

export function isCreativePackData(data: unknown): data is CreativePackData {
  if (typeof data !== 'object' || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    Array.isArray(d.scripts) &&
    Array.isArray(d.copyVariants) &&
    Array.isArray(d.hooks)
  );
}

export function isInsightsData(data: unknown): data is InsightsData {
  if (typeof data !== 'object' || data === null) return false;
  const d = data as Record<string, unknown>;
  // 验证必需字段
  const analysis = d.analysis as Record<string, unknown> | undefined;
  const report = d.report as Record<string, unknown> | undefined;
  return (
    typeof analysis === 'object' && analysis !== null &&
    'sentiment' in analysis &&
    'painPoints' in analysis &&
    typeof report === 'object' && report !== null &&
    'summary' in report &&
    'strategySuggestions' in report
  );
}
