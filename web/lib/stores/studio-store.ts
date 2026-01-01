// ========================================
// Studio Store
// 职责: 用户自定义风格 + 生成任务状态管理
// ========================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ========================================
// 类型定义
// ========================================

/** 用户自定义风格 */
export interface UserStyle {
  id: string;
  name: string;
  basePrompt: string;
  negativePrompt: string;
  previewGradient: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

/** 图生图配置 */
export interface Img2ImgConfig {
  referenceImage: string | null;  // base64 或 URL
  referenceStrength: number;      // 0-100
  styleId: string | null;         // 应用的风格
  additionalPrompt: string;       // 附加描述
}

/** 生成任务 */
export interface GenerationJob {
  id: string;
  type: 'text2img' | 'img2img' | 'kit';
  status: 'pending' | 'generating' | 'done' | 'error';
  prompt: string;
  negativePrompt: string;
  result?: string;
  createdAt: string;
}

/** Store 状态 */
interface StudioState {
  // 用户自定义风格
  userStyles: UserStyle[];
  
  // 图生图配置
  img2imgConfig: Img2ImgConfig;
  
  // 生成历史
  generationHistory: GenerationJob[];
  
  // Actions
  addUserStyle: (style: Omit<UserStyle, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateUserStyle: (id: string, updates: Partial<UserStyle>) => void;
  deleteUserStyle: (id: string) => void;
  
  setImg2ImgConfig: (config: Partial<Img2ImgConfig>) => void;
  resetImg2ImgConfig: () => void;
  
  addGenerationJob: (job: Omit<GenerationJob, 'id' | 'createdAt'>) => string;
  updateGenerationJob: (id: string, updates: Partial<GenerationJob>) => void;
  clearHistory: () => void;
}

// ========================================
// 默认值
// ========================================

const DEFAULT_IMG2IMG_CONFIG: Img2ImgConfig = {
  referenceImage: null,
  referenceStrength: 70,
  styleId: null,
  additionalPrompt: '',
};

// ========================================
// 预设渐变色（用于预览）
// ========================================
const PREVIEW_GRADIENTS = [
  'from-rose-500 via-pink-500 to-fuchsia-500',
  'from-violet-500 via-purple-500 to-indigo-500',
  'from-cyan-500 via-teal-500 to-emerald-500',
  'from-amber-500 via-orange-500 to-red-500',
  'from-lime-500 via-green-500 to-teal-500',
];

function getRandomGradient(): string {
  return PREVIEW_GRADIENTS[Math.floor(Math.random() * PREVIEW_GRADIENTS.length)];
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ========================================
// Store 实现
// ========================================

export const useStudioStore = create<StudioState>()(
  persist(
    (set, get) => ({
      // 初始状态
      userStyles: [],
      img2imgConfig: DEFAULT_IMG2IMG_CONFIG,
      generationHistory: [],

      // 用户风格管理
      addUserStyle: (style) => {
        const newStyle: UserStyle = {
          ...style,
          id: generateId(),
          previewGradient: style.previewGradient || getRandomGradient(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          userStyles: [newStyle, ...state.userStyles],
        }));
      },

      updateUserStyle: (id, updates) => {
        set((state) => ({
          userStyles: state.userStyles.map((s) =>
            s.id === id
              ? { ...s, ...updates, updatedAt: new Date().toISOString() }
              : s
          ),
        }));
      },

      deleteUserStyle: (id) => {
        set((state) => ({
          userStyles: state.userStyles.filter((s) => s.id !== id),
        }));
      },

      // 图生图配置
      setImg2ImgConfig: (config) => {
        set((state) => ({
          img2imgConfig: { ...state.img2imgConfig, ...config },
        }));
      },

      resetImg2ImgConfig: () => {
        set({ img2imgConfig: DEFAULT_IMG2IMG_CONFIG });
      },

      // 生成历史
      addGenerationJob: (job) => {
        const id = generateId();
        const newJob: GenerationJob = {
          ...job,
          id,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          generationHistory: [newJob, ...state.generationHistory].slice(0, 50), // 保留最近 50 条
        }));
        return id;
      },

      updateGenerationJob: (id, updates) => {
        set((state) => ({
          generationHistory: state.generationHistory.map((j) =>
            j.id === id ? { ...j, ...updates } : j
          ),
        }));
      },

      clearHistory: () => {
        set({ generationHistory: [] });
      },
    }),
    {
      name: 'studio-storage',
      version: 1,
      migrate: (persisted: unknown, version: number) => {
        // 版本迁移逻辑
        const state = persisted as Record<string, unknown>;
        
        if (version === 0) {
          // v0 -> v1: 确保所有字段存在
          return {
            userStyles: Array.isArray(state.userStyles) ? state.userStyles : [],
            generationHistory: Array.isArray(state.generationHistory) ? state.generationHistory : [],
          };
        }
        
        return state;
      },
      partialize: (state) => ({
        userStyles: state.userStyles,
        generationHistory: state.generationHistory,
      }),
    }
  )
);

// ========================================
// 辅助 Hooks
// ========================================

/** 获取用户风格（包含系统预设） */
export function useAllStyles() {
  const userStyles = useStudioStore((s) => s.userStyles);
  return { userStyles };
}

/** 检查风格名称是否重复 */
export function checkStyleNameExists(name: string): boolean {
  const { userStyles } = useStudioStore.getState();
  return userStyles.some((s) => s.name === name);
}
