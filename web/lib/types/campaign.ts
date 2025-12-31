export type CampaignPhase =
  | 'idle'
  | 'input'
  | 'running'
  | 'review'
  | 'complete'
  | 'chatting'
  | 'analyzing'
  | 'error';  // P0 修复: 添加错误状态以支持异步工作流异常处理

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
  duration: '15s' | '30s' | '60s';
  platform: 'tiktok' | 'meta' | 'youtube';
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

