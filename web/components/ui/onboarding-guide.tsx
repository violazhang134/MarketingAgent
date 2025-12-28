"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ChevronRight, Zap, Search, Target, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { GlassCard } from "./glass-card";

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const STEPS: OnboardingStep[] = [
  {
    title: "欢迎来到 Marketing Agent",
    description: "我是你的 AI 增长伙伴。我可以帮你自动化分析竞品、生成素材并运行实验。",
    icon: <Sparkles className="w-6 h-6 text-indigo-400" />,
  },
  {
    title: "🤖 一键模式 (Agent)",
    description: "只需输入竞品名称，我就会自动完成所有研究并为你生成一套完整的素材包。",
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
  },
  {
    title: "📊 专家模式 (Expert)",
    description: "如果你需要更深度的洞察，可以进入专家模式查看详细的广告库、用户评论分析和趋势报告。",
    icon: <Search className="w-6 h-6 text-emerald-400" />,
  },
  {
    title: "🚀 开始你的增长之旅",
    description: "在下方输入你的游戏创意，或者直接点击下方的快捷操作开始吧！",
    icon: <Target className="w-6 h-6 text-pink-400" />,
  },
];

export function OnboardingGuide() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding_v1");
    if (!hasSeenOnboarding) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("hasSeenOnboarding_v1", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-md relative"
          >
            <GlassCard className="p-8 space-y-6 border-indigo-500/30 shadow-2xl shadow-indigo-500/20">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/40" />
              </button>

              <div className="flex flex-col items-center text-center space-y-4">
                <motion.div
                  key={currentStep}
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-2"
                >
                  {STEPS[currentStep].icon}
                </motion.div>

                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                  {STEPS[currentStep].title}
                </h2>
                <p className="text-white/60 leading-relaxed">
                  {STEPS[currentStep].description}
                </p>
              </div>

              {/* Progress Dots */}
              <div className="flex justify-center gap-2">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === currentStep ? "w-8 bg-indigo-500" : "w-1.5 bg-white/20"
                    }`}
                  />
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleNext}
                  className="w-full py-4 bg-indigo-500 text-white font-black rounded-xl hover:bg-indigo-400 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-indigo-500/20"
                >
                  {currentStep === STEPS.length - 1 ? "立即开始" : "下一步"}
                  {currentStep !== STEPS.length - 1 && (
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  )}
                </button>
                
                {currentStep === STEPS.length - 1 && (
                  <button
                    onClick={() => {
                       handleClose();
                       router.push('/docs');
                    }}
                    className="w-full py-3 bg-white/5 text-indigo-300 font-bold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    阅读增长手册
                  </button>
                )}
              </div>
            </GlassCard>
            
            {/* Background Glow */}
            <div className="absolute -inset-4 bg-indigo-500/10 blur-3xl -z-10 rounded-full animate-pulse" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
