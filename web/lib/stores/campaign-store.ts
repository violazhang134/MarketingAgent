import { create } from 'zustand';
import { 
  analyzeCompetitor, 
  AnalysisResult 
} from '../engines/analysis-engine';
import { 
  analyzeComments, 
  generateInsightsReport, 
  CommentAnalysis 
} from '../engines/comment-analyzer';
import { 
  generateCreativeAssets, 
  generateExperimentPack 
} from '../engines/creative-engine';
import { useCanvasStore } from './canvas-store';

import type {
  AgentStep,
  CampaignPhase,
  CreativeStrategy,
  ExperimentConfig,
  ExperimentPack,
  GeneratedAssets,
  Message,
  PlaybookEntry,
  ProductProfile,
} from '../types/campaign';

export type {
  AgentStep,
  CampaignPhase,
  CreativeStrategy,
  ExperimentConfig,
  ExperimentPack,
  GeneratedAssets,
  Message,
  PlaybookEntry,
  ProductProfile,
} from '../types/campaign';

// ========================================
// Campaign State
// ========================================

interface CampaignState {
  // Metadata
  phase: CampaignPhase;
  currentStepIndex: number;
  steps: AgentStep[];
  messages: Message[];
  
  // Input Data
  competitorName: string;
  productName: string;
  productDesc: string;
  
  // Analysis Results
  adAnalysis: AnalysisResult | null;
  commentAnalysis: CommentAnalysis | null;
  strategySummary: string;
  
  // Creative Config & Assets
  strategy: CreativeStrategy;
  experimentConfig: ExperimentConfig;
  generatedAssets: GeneratedAssets | null;
  experimentPack: ExperimentPack | null;
  researchCanvasNodeId: string | null;
  
  // Playbook & Optimization
  playbook: PlaybookEntry[];
  currentExperimentResult: {
    winnerId: string;
    lift: string;
    variable: string;
    status: 'running' | 'completed';
  } | null;
  isOptimized: boolean;

  // Actions
  setPhase: (phase: CampaignPhase) => void;
  updateInput: (data: Partial<{ competitorName: string; productName: string; productDesc: string }>) => void;
  setStrategy: (strategy: Partial<CreativeStrategy>) => void;
  setExperimentConfig: (config: Partial<ExperimentConfig>) => void;
  setGeneratedAssets: (assets: GeneratedAssets, experimentPack?: ExperimentPack) => void;
  addMessage: (msg: Omit<Message, 'id'>) => void;
  
  // The "Magic" Workflow Action
  runAgentWorkflow: () => Promise<void>;
  generateAssetsWorkflow: () => Promise<void>;
  
  // Playbook Actions
  settleExperiment: (winnerId: string, lift: string) => void;
  applyWinningPattern: (entry: PlaybookEntry) => void;
  
  reset: () => void;
}

// ========================================
// Default Constants
// ========================================

const INITIAL_STEPS: AgentStep[] = [
  { id: 'ads', label: '采集广告数据', status: 'pending' },
  { id: 'trends', label: '分析趋势内容', status: 'pending' },
  { id: 'comments', label: '解析用户评论', status: 'pending' },
  { id: 'strategy', label: '生成差异化策略', status: 'pending' },
  { id: 'creative', label: '创建广告素材', status: 'pending' },
];

// ========================================
// Store Implementation
// ========================================

export const useCampaignStore = create<CampaignState>((set, get) => ({
  phase: 'idle',
  currentStepIndex: 0,
  steps: INITIAL_STEPS,
  messages: [],
  
  competitorName: '',
  productName: '',
  productDesc: '',
  
  adAnalysis: null,
  commentAnalysis: null,
  strategySummary: '',
  
  strategy: {
    hookStyle: 'challenge',
    visualTone: 'bright',
    ctaIntensity: 'medium',
    targetAudience: 'casual',
  },
  experimentConfig: { variable: 'cover', variants: ['A', 'B'] },
  generatedAssets: null,
  experimentPack: null,
  researchCanvasNodeId: null,
  
  playbook: [],
  currentExperimentResult: null,
  isOptimized: false,

  setPhase: (phase) => set({ phase }),
  
  updateInput: (data) => set((state) => ({ ...state, ...data })),
  
  setStrategy: (strategy) => set((state) => ({ 
    strategy: { ...state.strategy, ...strategy } 
  })),

  setExperimentConfig: (config) => set((state) => ({
    experimentConfig: { ...state.experimentConfig, ...config }
  })),

  setGeneratedAssets: (assets, experimentPack) => set({ generatedAssets: assets, experimentPack }),

  addMessage: (msg) => set((state) => ({ 
    messages: [...state.messages, { ...msg, id: Math.random().toString(36).substring(7) }] 
  })),

  runAgentWorkflow: async () => {
    const { competitorName, productName } = get();
    if (!competitorName || !productName) return;

    const canvasStore = useCanvasStore.getState();
    
    // 重置画布，开始新流程
    canvasStore.resetCanvas();

    set({ 
      phase: 'running', 
      currentStepIndex: 0, 
      steps: INITIAL_STEPS,
    });

    // P0 修复: 追踪当前处理的节点ID，以便出错时标记
    let currentNodeId: string | null = null;

    try {

    const updateStep = (id: string, updates: Partial<AgentStep>) => {
      set(state => ({
        steps: state.steps.map(s => s.id === id ? { ...s, ...updates } : s)
      }));
    };

    // Step 1: 采集广告数据
    // ========================================
    updateStep('ads', { status: 'running' });
    
    const adsNode = canvasStore.addWorkflowNode(
      'agent_step',
      '采集广告数据',
      `正在扫描 ${competitorName} 的投放策略...`,
      undefined,
      { competitorName, productName }
    );
    currentNodeId = adsNode.id;  // P0: 追踪当前节点

    await new Promise(r => setTimeout(r, 2800)); // 1.2s -> 2.8s
    const adRes = analyzeCompetitor(competitorName);
    
    updateStep('ads', { status: 'done', message: `发现 ${Math.floor(Math.random() * 50 + 20)} 条活跃广告` });
    canvasStore.updateNodeStatus(adsNode.id, 'done');
    canvasStore.updateNode(adsNode.id, {
      summary: `已采集 ${competitorName} 的广告数据\n发现主策略: ${adRes.strategy}`,
    });
    
    set({ adAnalysis: adRes, currentStepIndex: 1 });

    // ========================================
    // Step 2: 分析趋势内容 + 生成分析节点
    // ========================================
    updateStep('trends', { status: 'running' });
    
    const analysisNode = canvasStore.addWorkflowNode(
      'analysis',
      `竞品策略: ${adRes.strategy}`,
      '正在分析投放趋势...',
      adsNode.id,
      { competitorName, analysisData: adRes }
    );
    currentNodeId = analysisNode.id;

    await new Promise(r => setTimeout(r, 3200)); // 1.0s -> 3.2s
    
    updateStep('trends', { status: 'done', message: `YouTube ${Math.floor(Math.random() * 20 + 5)} 条热门视频` });
    canvasStore.updateNodeStatus(analysisNode.id, 'done');
    canvasStore.updateNode(analysisNode.id, {
      summary: [
        `Hook 强度: ${Math.round(adRes.hookIntensity * 100)}%`,
        `留存重点: ${Math.round(adRes.retentionFocus * 100)}%`,
        `变现倾向: ${Math.round(adRes.monetization * 100)}%`,
        '',
        `Top 创意: ${adRes.topCreatives[0]?.concept || 'N/A'}`,
      ].join('\n'),
    });
    
    set({ currentStepIndex: 2 });

    // ========================================
    // Step 3: 解析用户评论
    // ========================================
    updateStep('comments', { status: 'running' });
    
    const commentsNode = canvasStore.addWorkflowNode(
      'agent_step',
      '解析用户评论',
      '正在分析用户反馈...',
      analysisNode.id,
      { competitorName }
    );
    currentNodeId = commentsNode.id;

    await new Promise(r => setTimeout(r, 2600)); // 1.5s -> 2.6s
    const commentRes = analyzeComments(competitorName);
    const insightsReport = generateInsightsReport(commentRes, competitorName, productName);
    
    updateStep('comments', { status: 'done', message: `分析了 ${commentRes.painPoints.reduce((a, b) => a + b.frequency, 0)} 条评论` });
    canvasStore.updateNodeStatus(commentsNode.id, 'done');
    canvasStore.updateNode(commentsNode.id, {
      summary: [
        `痛点 TOP1: ${commentRes.painPoints[0]?.topic || 'N/A'}`,
        `满意点: ${commentRes.delightPoints[0]?.topic || 'N/A'}`,
        `情感分布: 正向 ${commentRes.sentiment.positive}% / 负向 ${commentRes.sentiment.negative}%`,
      ].join('\n'),
    });
    
    set({ commentAnalysis: commentRes, currentStepIndex: 3 });

    // ========================================
    // Step 4: 生成洞察报告节点
    // ========================================
    const insightNode = canvasStore.addWorkflowNode(
      'insight',
      '用户洞察报告',
      '正在整合分析结论...',
      commentsNode.id,
      { competitorName, productName, insightsData: insightsReport }
    );
    currentNodeId = insightNode.id;

    await new Promise(r => setTimeout(r, 800));
    canvasStore.updateNodeStatus(insightNode.id, 'done');
    canvasStore.updateNode(insightNode.id, {
      summary: insightsReport.summary,
      expandable: true,
      detailComponent: 'InsightsReporter',
    });

    // ========================================
    // Step 5: 生成差异化策略
    // ========================================
    updateStep('strategy', { status: 'running' });
    
    const strategyNode = canvasStore.addWorkflowNode(
      'creative',
      '差异化策略',
      '正在生成定位策略...',
      insightNode.id,
      { competitorName, productName }
    );
    currentNodeId = strategyNode.id;

    await new Promise(r => setTimeout(r, 1200));
    const summary = insightsReport.strategySuggestions[0] || "使用差异化定位策略";
    
    updateStep('strategy', { status: 'done', message: '差异化策略已生成' });
    canvasStore.updateNodeStatus(strategyNode.id, 'done');
    canvasStore.updateNode(strategyNode.id, {
      title: `策略: ${summary.slice(0, 20)}...`,
      summary: [
        `目标产品: ${productName}`,
        '',
        `策略建议:`,
        ...insightsReport.strategySuggestions.slice(0, 3).map(s => `• ${s}`),
      ].join('\n'),
      expandable: true,
      detailComponent: 'CompetitorReportView',
    });
    
    set({ 
      strategySummary: summary, 
      currentStepIndex: 4, 
      phase: 'review',
      researchCanvasNodeId: strategyNode.id,
    });

    // 自动平移到最后生成的节点
    canvasStore.panTo(strategyNode.id);

    } catch (error) {
      // P0 修复: 捕获工作流异常，标记当前节点为错误状态
      console.error('[runAgentWorkflow] Error:', error);
      if (currentNodeId) {
        canvasStore.updateNodeStatus(currentNodeId, 'error');
      }
      set({ phase: 'error' });
    }
  },

  generateAssetsWorkflow: async () => {
    const { adAnalysis, commentAnalysis, productName, productDesc, competitorName, experimentConfig, strategy, researchCanvasNodeId } = get();
    if (!adAnalysis || !commentAnalysis) return;

    const canvasStore = useCanvasStore.getState();

    set({ phase: 'running' });

    const updateStep = (id: string, updates: Partial<AgentStep>) => {
      set(state => ({
        steps: state.steps.map(s => s.id === id ? { ...s, ...updates } : s)
      }));
    };

    // 找到策略节点作为父节点
    const parentNodeId = researchCanvasNodeId || undefined;

    // P0 修复: 追踪当前处理的节点ID
    let currentNodeId: string | null = null;

    try {

    // ========================================
    // Step 1: 生成创意素材
    // ========================================
    updateStep('creative', { status: 'running' });

    const product = {
      name: productName,
      icon: '🎮',
      screenshots: [],
      description: productDesc || `${productName} 是一款受 ${competitorName} 启发的有趣游戏`,
      category: 'Casual',
    };

    const assets = generateCreativeAssets(product, strategy);
    const expPack = generateExperimentPack(product, experimentConfig);

    // 生成深度对标数据 (Mock)
    const tacticalData = {
      summary: `基于对 ${competitorName} 的深度解构，我们发现其在"长线留存"机制上存在疲态。${productName} 将通过"差异化叙事"与"高频爽感"切入，通过下列战术动作实现弯道超车。`,
      swot: {
        strengths: ['独特的叙事结合玩法', '更符合 Gen-Z 审美的视觉风格', '创新的社交裂变机制'],
        weaknesses: ['初期用户基数薄弱', '买量模型尚未验证', '内容消耗速度快'],
        opportunities: [`${competitorName} 用户群体的审美疲劳`, '短视频平台的内容红利', '新兴市场的玩法空缺'],
        threats: ['头部竞品的防御性更新', 'UA 成本的持续上涨', '同质化产品的快速跟进']
      },
      comparison: [
        { dimension: '核心循环', competitor: '传统数值堆砌', us: '情感驱动+随机性', advantage: true },
        { dimension: '美术风格', competitor: '通用卡通风格', us: '高辨识度潮酷风', advantage: true },
        { dimension: '变现深度', competitor: '混合变现(重广)', us: '内购为主+非强制广告', advantage: true },
        { dimension: '社区生态', competitor: '官方单向输出', us: 'UGC共创生态', advantage: false },
      ],
      roadmap: [
        { stage: 'Phase 1: 破局', action: '精准素材测试与种子用户沉淀', expectedOutcome: '验证 CTR > 3%, 找准核心受众' },
        { stage: 'Phase 2: 突围', action: '差异化卖点规模化投放', expectedOutcome: 'ROAS > 1.2, 建立品牌认知' },
        { stage: 'Phase 3: 统治', action: '全渠道覆盖与 IP 化运营', expectedOutcome: '占据细分品类 Top 3' },
      ]
    };

    // ========================================
    // Step 1.5: 生成深度对标与计划节点 (Tactical Plan)
    // ========================================
    const tacticalPlanNode = canvasStore.addWorkflowNode(
      'analysis', // 使用分析类型
      '⚔️ 深度对标与战术计划 (Tactical Plan)',
      '正在进行深度竞品交叉分析...',
      parentNodeId,
      { 
        competitorName, 
        productName,
        planData: tacticalData
      }
    );
    currentNodeId = tacticalPlanNode.id;

    // 模拟分析耗时
    await new Promise(r => setTimeout(r, 1500));
    canvasStore.updateNodeStatus(tacticalPlanNode.id, 'done');
    canvasStore.updateNode(tacticalPlanNode.id, {
      summary: '• SWOT 战略态势分析 done\n• 4维竞品交叉对标 done\n• 3阶段执行与增长路线图 done',
      expandable: true,
      detailComponent: 'TacticalPlanView',
    });

    // ========================================
    // Step 2: 生成创意素材包 (Creative Assets Pack)
    // ========================================
    const creativePackNode = canvasStore.addWorkflowNode(
      'creative',
      '✨ 创意素材包 (Creative Assets)',
      '正在生成创意素材...',
      tacticalPlanNode.id, // 连接到对标节点
      { 
        competitorName, 
        productName,
        scripts: assets.scripts,
        copyVariants: assets.copyVariants,
        hooks: assets.hooks
      }
    );
    currentNodeId = creativePackNode.id;

    await new Promise(r => setTimeout(r, 1000));
    canvasStore.updateNodeStatus(creativePackNode.id, 'done');
    canvasStore.updateNode(creativePackNode.id, {
      summary: `• 视频脚本 x${assets.scripts.length} (时长/分镜/CTA)\n• 广告文案 x${assets.copyVariants.length}\n• Hook 素材 x${assets.hooks.length}`,
      expandable: true,
      detailComponent: 'CreativePackView',
    });

    updateStep('creative', { status: 'done', message: '素材生成完成' });
    updateStep('experiment', { status: 'running' });

    // ========================================
    // Step 3: 生成投放实验配置节点 (Experiment & Launch)
    // ========================================
    const experimentPackNode = canvasStore.addWorkflowNode(
      'experiment',
      '🚀 投放实验配置 (Experiment Setup)',
      '正在配置 A/B 测试...',
      creativePackNode.id,
      { 
        competitorName,
        productName,
        experimentPack: expPack
      }
    );
    currentNodeId = experimentPackNode.id;

    await new Promise(r => setTimeout(r, 800));
    canvasStore.updateNodeStatus(experimentPackNode.id, 'done');
    canvasStore.updateNode(experimentPackNode.id, {
      summary: `🎯 实验变量: ${expPack.variable}\n📊 流量分配: Auto (${expPack.allocations.join('/')})\n🔗 包含 2 组追踪链接`,
      expandable: true,
      detailComponent: 'ExperimentPackView',
    });

    updateStep('experiment', { status: 'done', message: '实验配置完成' });
    
    set({ 
      generatedAssets: assets, 
      experimentPack: expPack,
      phase: 'complete'
    });

    // 自动居中
    canvasStore.panTo(experimentPackNode.id);

    } catch (error) {
      // P0 修复: 捕获工作流异常，标记当前节点为错误状态
      console.error('[generateAssetsWorkflow] Error:', error);
      if (currentNodeId) {
        canvasStore.updateNodeStatus(currentNodeId, 'error');
      }
      set({ phase: 'error' });
    }
  },

  settleExperiment: (winnerId, lift) => set((state) => {
    if (!state.experimentPack) return state;
    
    const winnerArm = state.experimentPack.arms.find(a => a.id === winnerId);
    const variable = state.experimentPack.variable as 'cover' | 'incentive' | 'entry';
    
    const newEntry: PlaybookEntry = {
      id: Math.random().toString(36).substring(0, 9),
      variable,
      winnerValue: winnerArm?.name || 'Unknown',
      lift,
      date: new Date().toLocaleDateString(),
      appliedCount: 0
    };

    return {
      playbook: [newEntry, ...state.playbook],
      currentExperimentResult: {
        winnerId,
        lift,
        variable,
        status: 'completed'
      }
    };
  }),

  applyWinningPattern: (entry) => set((state) => {
    const updatedStrategy = { ...state.strategy };
    
    if (entry.variable === 'cover') {
      updatedStrategy.hookStyle = 'suspense';
    }

    return {
      strategy: updatedStrategy,
      isOptimized: true,
      playbook: state.playbook.map(p => 
        p.id === entry.id ? { ...p, appliedCount: p.appliedCount + 1 } : p
      )
    };
  }),

  reset: () => set({
    phase: 'idle',
    currentStepIndex: 0,
    steps: INITIAL_STEPS,
    messages: [],
    competitorName: '',
    productName: '',
    productDesc: '',
    adAnalysis: null,
    commentAnalysis: null,
    strategySummary: '',
    strategy: {
      hookStyle: 'challenge',
      visualTone: 'bright',
      ctaIntensity: 'medium',
      targetAudience: 'casual',
    },
    generatedAssets: null,
    experimentPack: null,
    currentExperimentResult: null,
    isOptimized: false,
    researchCanvasNodeId: null
  }),
}));
