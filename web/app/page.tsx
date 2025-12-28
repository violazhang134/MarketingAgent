"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, Rocket, Sparkles, Search, 
  TrendingUp, Activity, Bell, ArrowRight, Plug, Users
} from "lucide-react";
import { AgentInput } from "@/components/ui/agent-input";
import { GlassCard } from "@/components/ui/glass-card";
import { TypewriterText } from "@/components/ui/typewriter";
import { OnboardingGuide } from "@/components/ui/onboarding-guide";
import { useAppStore } from "@/lib/stores/app-store";
import { useCampaignStore } from "@/lib/stores/campaign-store";
import { cn } from "@/lib/utils";
import { useSensory } from "@/lib/hooks/use-sensory";
import { LiveTelemetry } from "@/components/dashboard/live-telemetry";

const QUESTIONS = [
  { id: 'goal', text: "First, what's your main goal for this campaign?", options: ["Maximum Plays", "User Retention", "Viral Share"] },
  { id: 'region', text: "Target region and language?", options: ["US (English)", "BR (Portuguese)", "ID (Bahasa)"] },
  { id: 'genre', text: "In one sentence, what is your game genre?", options: ["Hypercasual Runner", "Puzzle", "Interactive Story"] },
];

const DAILY_INSIGHTS = [
  { 
    id: 1, 
    title: "Trending Hook", 
    desc: "US Casual market: 'ASMR' hooks are up 40% in CTR this week.", 
    icon: TrendingUp, 
    color: "from-indigo-500 to-purple-500" 
  },
  { 
    id: 2, 
    title: "System Update", 
    desc: "Brazil TikTok trending music library has been updated.", 
    icon: Rocket, 
    color: "from-cyan-500 to-blue-500" 
  },
  { 
    id: 3, 
    title: "New Ad Pattern", 
    desc: "Found new winning 'Split Screen' pattern in Puzzle genre.", 
    icon: Sparkles, 
    color: "from-amber-500 to-orange-500" 
  },
];

export default function Home() {
  const router = useRouter();
  const { userName } = useAppStore();
  const { 
    phase: step, messages, setPhase: setStep, addMessage 
  } = useCampaignStore();
  
  const { trigger } = useSensory();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleInput = async (value: string) => {
    trigger('tap');
    if (step === 'idle') {
      setStep('chatting');
      addMessage({ role: 'user', content: value });
      
      setTimeout(() => {
        addMessage({ role: 'agent', content: "Got it. Let's build your launch strategy. I need to know a few details first." });
        setTimeout(() => {
           addMessage({ role: 'agent', content: QUESTIONS[0].text, options: QUESTIONS[0].options });
        }, 1000);
      }, 800);
    } else {
       if (value === "Analyze Competitor") {
          router.push('/launch/report');
          return;
       }

      addMessage({ role: 'user', content: value });
      const nextQIndex = Math.floor(messages.length / 2); 
      if (nextQIndex < QUESTIONS.length) {
         setTimeout(() => {
            const q = QUESTIONS[nextQIndex];
            addMessage({ role: 'agent', content: q.text, options: q.options });
         }, 1000);
      } else {
         setTimeout(() => {
             addMessage({ role: 'agent', content: "Perfect. I'm generating your Publish Pack now..." });
             setStep('analyzing');
             trigger('milestone');
             setTimeout(() => {
                router.push('/launch/pack');
             }, 2000);
         }, 1000);
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white p-4 md:p-8 pb-32 relative overflow-hidden">
      <OnboardingGuide />
      
      {/* Background Ambient */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -top-[20%] left-[20%] w-[60vw] h-[60vw] bg-indigo-600/20 blur-[120px] rounded-full"
          />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Marketing Agent</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-medium">Ready to Scale</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                trigger('milestone');
                router.push('/create/connect');
              }}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-all flex items-center gap-2"
            >
              <Plug className="w-4 h-4 text-indigo-400" />
              Connect Product
            </button>
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-white/60" />
            </div>
          </div>
        </header>

        {/* Conditional Layout: Idle Dashboard vs Chatting Mode */}
        <AnimatePresence mode="wait">
          {step === 'idle' ? (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              className="space-y-12"
            >
              {/* Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <GlassCard className="lg:col-span-2 p-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] -mr-32 -mt-32 group-hover:bg-indigo-500/20 transition-colors duration-700" />
                  <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-2">Welcome back, {userName}</h2>
                    <p className="text-white/50 mb-8 max-w-md">Your autonomous growth agent has been busy. Here is what we found while you were away.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                          <Activity className="w-5 h-5 text-indigo-400" />
                          <span className="text-sm font-medium">Auto-Scanning</span>
                        </div>
                        <div className="text-2xl font-bold">12 Active Tests</div>
                        <div className="text-xs text-green-400 mt-1 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          +14.2% Overall Lift
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                          <Bell className="w-5 h-5 text-purple-400" />
                          <span className="text-sm font-medium">Next Action</span>
                        </div>
183→                        <div className="text-2xl font-bold">New Winner!</div>
184→                        <div className="text-xs text-white/40 mt-1">Found in &quot;Match-3 / Viral&quot;</div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
                <LiveTelemetry />
              </div>

              {/* Main Content: Daily Brief & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <h3 className="font-bold text-lg">Daily Growth Brief</h3>
                  </div>
                  <div className="space-y-4">
                    {DAILY_INSIGHTS.map((insight) => (
                      <GlassCard 
                        key={insight.id} 
                        className="p-4 border-white/5 hover:border-indigo-500/20 transition-all cursor-pointer group"
                        onClick={() => {
                          trigger('tap');
                          router.push('/feed');
                        }}
                      >
                        <div className="flex gap-4">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${insight.color} flex items-center justify-center shrink-0`}>
                            <insight.icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-bold mb-1 group-hover:text-indigo-400 transition-colors">{insight.title}</div>
                            <p className="text-xs text-white/40 leading-relaxed">{insight.desc}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-white/20 ml-auto self-center group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <GlassCard 
                      onClick={() => router.push('/agent')}
                      className="p-6 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-500/30 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                          <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">🤖 一键模式</h3>
                          <p className="text-sm text-white/50">输入竞品名，自动生成方案</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-[10px] text-indigo-300 font-mono uppercase tracking-widest">Recommended</span>
                        <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </GlassCard>
                    <GlassCard 
                      onClick={() => router.push('/launch/report')}
                      className="p-6 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border-emerald-500/30 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                          <Search className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">📊 专家模式</h3>
                          <p className="text-sm text-white/50">深度分析竞品广告与评论</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-[10px] text-emerald-300 font-mono uppercase tracking-widest">Data-driven</span>
                        <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </GlassCard>
                  </div>
                  
                  {/* Chat Initiator */}
                  <div className="pt-8">
                    <AgentInput onSubmit={handleInput} placeholder="Tell me about your game or ask a growth question..." />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="chatting"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-4xl mx-auto flex flex-col min-h-[70vh]"
            >
              <div className="flex-1 space-y-6 mb-8">
                {messages.map((msg) => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("flex gap-4", msg.role === 'user' ? "justify-end" : "justify-start")}
                  >
                    {msg.role === 'agent' && (
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                      </div>
                    )}
                    <GlassCard className={cn(
                      "p-4 max-w-[80%] rounded-2xl",
                      msg.role === 'user' ? "bg-indigo-600/80 border-indigo-500/50" : "bg-white/5"
                    )}>
                      <TypewriterText text={msg.content} speed={10} cursor={false} />
                      {msg.options && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {msg.options.map(opt => (
                            <button 
                              key={opt}
                              onClick={() => handleInput(opt)}
                              className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs transition-colors"
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </GlassCard>
                  </motion.div>
                ))}
                <div ref={bottomRef} />
              </div>
              <div className="sticky bottom-0 pb-8 bg-gradient-to-t from-[#050505] to-transparent pt-12">
                <AgentInput onSubmit={handleInput} placeholder="Type your answer..." />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
