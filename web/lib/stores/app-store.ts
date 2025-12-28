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
  
  // Actions
  setUserName: (name: string) => void;
  completeOnboarding: () => void;
  toggleSidebar: () => void;
  reset: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      userName: 'Marketer',
      hasSeenOnboarding: false,
      isSidebarOpen: true,

      setUserName: (userName) => set({ userName }),
      completeOnboarding: () => set({ hasSeenOnboarding: true }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      reset: () => set({ 
        userName: 'Marketer', 
        hasSeenOnboarding: false, 
        isSidebarOpen: true 
      }),
    }),
    {
      name: 'marketing-agent-app-storage',
      partialize: (state) => ({ hasSeenOnboarding: state.hasSeenOnboarding, userName: state.userName }),
    }
  )
);
