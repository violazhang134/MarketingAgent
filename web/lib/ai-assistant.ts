import { analyzeCompetitor, AnalysisResult } from './engines/analysis-engine';
import { analyzeComments, generateInsightsReport, CommentAnalysis, InsightsReport } from './engines/comment-analyzer';
import { generateCreativeAssets, generateExperimentPack } from './engines/creative-engine';
import type {
  CreativeStrategy,
  GeneratedAssets,
  ProductProfile,
  ExperimentConfig,
  ExperimentPack,
} from './types/campaign';

export type AssistantRole = 'user' | 'assistant' | 'system';

export interface AssistantMessage {
  id: string;
  role: AssistantRole;
  content: string;
  createdAt: string;
}

export interface AssistantReply {
  messages: AssistantMessage[];
}

export interface ResearchFlowConfig {
  competitorName: string;
  productName: string;
  productDesc?: string;
}

export interface ResearchFlowResult {
  summary: string;
  analysis: AnalysisResult;
  comments: CommentAnalysis;
  insights: InsightsReport;
  creativeAssets: GeneratedAssets;
  experimentPack: ExperimentPack;
}

export async function sendMessage(
  _sessionId: string,
  _message: string,
  _context?: Record<string, unknown>
): Promise<AssistantReply> {
  const reply: AssistantMessage = {
    id: Math.random().toString(36).slice(2),
    role: 'assistant',
    content:
      '这个咒语有点超纲了。我现在还在练习自由聊天的法术，建议先试试下方的「一键竞品调研」，看我如何把数据种成森林。',
    createdAt: new Date().toISOString(),
  };

  await new Promise((resolve) => setTimeout(resolve, 600));

  return { messages: [reply] };
}

export async function runResearchFlow(
  config: ResearchFlowConfig
): Promise<ResearchFlowResult> {
  const analysis = analyzeCompetitor(config.competitorName);
  const comments = analyzeComments(config.competitorName);
  const insights = generateInsightsReport(
    comments,
    config.competitorName,
    config.productName
  );

  const summary = insights.summary;

  const product: ProductProfile = {
    name: config.productName,
    icon: '🎮',
    screenshots: [],
    description:
      config.productDesc ||
      `${config.productName} 是一款受 ${config.competitorName} 启发的有趣游戏`,
    category: 'Casual',
  };

  const strategy: CreativeStrategy = {
    hookStyle: 'challenge',
    visualTone: 'bright',
    ctaIntensity: 'medium',
    targetAudience: 'casual',
  };

  const creativeAssets = generateCreativeAssets(product, strategy, {
    strategy: analysis.strategy,
  });

  const experimentConfig: ExperimentConfig = {
    variable: 'cover',
    variants: ['A', 'B'],
  };

  const experimentPack = generateExperimentPack(product, experimentConfig);

  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    summary,
    analysis,
    comments,
    insights,
    creativeAssets,
    experimentPack,
  };
}
