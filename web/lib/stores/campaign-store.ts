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

// ========================================
// Campaign Store Types
// ========================================

export type CampaignPhase = 'idle' | 'input' | 'running' | 'review' | 'complete' | 'chatting' | 'analyzing';

export interface Message {
  id: string;
  role: 'agent' | 'user';
  content: string;
  options?: string[];
}

export interface CreativeStrategy {
  hookStyle: 'challenge' | 'suspense' | 'satisfaction' | 'contrast';
  visualTone: 'bright' | 'dark' | 'colorful' | 'minimal';
  ctaIntensity: 'soft' | 'medium' | 'strong';
  targetAudience: 'casual' | 'hardcore' | 'all';
}


export interface AgentStep {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'done';
  message?: string;
}

export interface ProductProfile {
  name: string;
  icon: string;
  screenshots: string[];
  description: string;
  category: string;
}

export interface VideoScript {
  id: string;
  title: string;
  duration: "15s" | "30s" | "60s";
  platform: "tiktok" | "meta" | "youtube";
  scenes: {
    timestamp: string;
    visual: string;
    audio: string;
    text: string;
  }[];
  hook: string;
  cta: string;
}

export interface GeneratedAssets {
  scripts: VideoScript[];
  copyVariants: string[];
  hooks: string[];
  landingCopy: { headline: string; subhead: string; cta: string; benefits: string[] };
  sharingCopy: { title: string; desc: string };
}

export interface ExperimentConfig {
  variable: 'cover' | 'incentive' | 'entry';
  variants: ['A', 'B'];
}

export interface ExperimentArm {
  id: string;
  name: string;
  config: {
    coverStyle?: string;
    incentiveType?: string;
    entryText?: string;
  };
  trackingLink: string;
}

export interface ExperimentPack {
  experimentId: string;
  variable: string;
  arms: [ExperimentArm, ExperimentArm];
  allocations: [50, 50];
}

export interface PlaybookEntry {
  id: string;
  variable: 'cover' | 'incentive' | 'entry';
  winnerValue: string;
  lift: string;
  date: string;
  appliedCount: number;
}

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

    set({ phase: 'running', currentStepIndex: 0, steps: INITIAL_STEPS });

    const updateStep = (id: string, updates: Partial<AgentStep>) => {
      set(state => ({
        steps: state.steps.map(s => s.id === id ? { ...s, ...updates } : s)
      }));
    };

    // Step 1: Ads
    updateStep('ads', { status: 'running' });
    await new Promise(r => setTimeout(r, 1200));
    const adRes = analyzeCompetitor(competitorName);
    updateStep('ads', { status: 'done', message: `发现 ${Math.floor(Math.random() * 50 + 20)} 条活跃广告` });
    set({ adAnalysis: adRes, currentStepIndex: 1 });

    // Step 2: Trends
    updateStep('trends', { status: 'running' });
    await new Promise(r => setTimeout(r, 1000));
    updateStep('trends', { status: 'done', message: `YouTube ${Math.floor(Math.random() * 20 + 5)} 条热门视频` });
    set({ currentStepIndex: 2 });

    // Step 3: Comments
    updateStep('comments', { status: 'running' });
    await new Promise(r => setTimeout(r, 1500));
    const commentRes = analyzeComments(competitorName);
    const insightsReport = generateInsightsReport(commentRes, competitorName, productName);
    updateStep('comments', { status: 'done', message: `分析了 ${commentRes.painPoints.reduce((a, b) => a + b.frequency, 0)} 条评论` });
    set({ commentAnalysis: commentRes, currentStepIndex: 3 });

    // Step 4: Strategy
    updateStep('strategy', { status: 'running' });
    await new Promise(r => setTimeout(r, 1200));
    const summary = insightsReport.strategySuggestions[0] || "使用差异化定位策略";
    updateStep('strategy', { status: 'done', message: '差异化策略已生成' });
    set({ strategySummary: summary, currentStepIndex: 4, phase: 'review' });
  },

  generateAssetsWorkflow: async () => {
    const { adAnalysis, commentAnalysis, productName, productDesc, competitorName, experimentConfig, strategy } = get();
    if (!adAnalysis || !commentAnalysis) return;

    set({ phase: 'running' });

    const updateStep = (id: string, updates: Partial<AgentStep>) => {
      set(state => ({
        steps: state.steps.map(s => s.id === id ? { ...s, ...updates } : s)
      }));
    };

    updateStep('creative', { status: 'running' });
    await new Promise(r => setTimeout(r, 1500));

    const product = {
      name: productName,
      icon: '🎮',
      screenshots: [],
      description: productDesc || `${productName} 是一款受 ${competitorName} 启发的有趣游戏`,
      category: 'Casual',
    };

    const assets = generateCreativeAssets(product, strategy);

    const expPack = generateExperimentPack(product, experimentConfig);

    updateStep('creative', { status: 'done', message: `生成 ${assets.scripts.length} 个脚本，${assets.hooks.length} 条 Hooks` });
    
    set({ 
      generatedAssets: assets, 
      experimentPack: expPack,
      phase: 'complete'
    });
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
    isOptimized: false
  }),
}));
