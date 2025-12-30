import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ========================================
// App Store
// 职责: 管理全局 UI 状态、用户偏好、引导状态
// ========================================

interface AppState {
  userName: string;
  hasSeenOnboarding: boolean;
  isSidebarOpen: boolean;
  minionsEnabled: boolean; // Minion 小队开关
  
  // Actions
  setUserName: (name: string) => void;
  completeOnboarding: () => void;
  toggleSidebar: () => void;
  toggleMinions: () => void;
  reset: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      userName: 'Marketer',
      hasSeenOnboarding: false,
      isSidebarOpen: true,
      minionsEnabled: true, // 默认开启

      setUserName: (userName) => set({ userName }),
      completeOnboarding: () => set({ hasSeenOnboarding: true }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      toggleMinions: () => set((state) => ({ minionsEnabled: !state.minionsEnabled })),
      reset: () => set({ 
        userName: 'Marketer', 
        hasSeenOnboarding: false, 
        isSidebarOpen: true,
        minionsEnabled: true,
      }),
    }),
    {
      name: 'marketing-agent-app-storage',
      partialize: (state) => ({ 
        hasSeenOnboarding: state.hasSeenOnboarding, 
        userName: state.userName,
        minionsEnabled: state.minionsEnabled,
      }),
    }
  )
);

