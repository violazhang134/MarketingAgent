"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, FileText, Anchor } from 'lucide-react';

interface Script {
  id: string;
  title: string;
  duration: string;
  platform: string;
  hook: string;
  cta: string;
  scenes: Array<{ timestamp: string; visual: string; audio: string; text: string }>;
}

interface CreativePackDetailProps {
  data: {
    scripts: Script[];
    copyVariants: string[];
    hooks: string[];
  };
}

type TabType = 'scripts' | 'copy' | 'hooks';

export function CreativePackDetail({ data }: CreativePackDetailProps) {
  const [activeTab, setActiveTab] = useState<TabType>('scripts');

  const tabs = [
    { id: 'scripts' as const, label: '视频脚本', icon: Video, count: data.scripts.length },
    { id: 'copy' as const, label: '文案变体', icon: FileText, count: data.copyVariants.length },
    { id: 'hooks' as const, label: 'Hooks', icon: Anchor, count: data.hooks.length },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Tabs Header */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-white/10 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${isActive 
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' 
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className={`
                ml-1 px-1.5 py-0.5 rounded-full text-[10px]
                ${isActive ? 'bg-black/20 text-white/80' : 'bg-white/10 text-white/40'}
              `}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'scripts' && (
            <motion.div
              key="scripts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {data.scripts.map((script) => (
                <div key={script.id} className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                       🎬 {script.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-medium border border-indigo-500/20">
                        {script.duration}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-medium uppercase border border-purple-500/20">
                        {script.platform}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <div className="text-[10px] text-amber-500/60 uppercase tracking-widest mb-1">Visual Hook</div>
                      <div className="text-sm text-amber-100">{script.hook}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <div className="text-[10px] text-emerald-500/60 uppercase tracking-widest mb-1">Call to Action</div>
                      <div className="text-sm text-emerald-100">{script.cta}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-xs font-medium text-white/40 uppercase tracking-widest pl-1">Storyline</div>
                    <div className="space-y-2">
                      {script.scenes.map((scene, j) => (
                        <div key={j} className="flex gap-4 p-3 rounded-xl bg-black/20 hover:bg-black/40 transition-colors">
                          <span className="text-indigo-400 font-mono text-xs shrink-0 w-16 pt-0.5">{scene.timestamp}</span>
                          <div className="space-y-1">
                            <div className="text-sm text-white/90">{scene.visual}</div>
                            {scene.audio && <div className="text-xs text-white/50">🔊 {scene.audio}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'copy' && (
            <motion.div
              key="copy"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {data.copyVariants.map((variant, i) => (
                <div 
                  key={i} 
                  className="p-5 rounded-xl bg-white/5 border border-white/10 text-white/90 leading-relaxed hover:border-amber-500/30 transition-colors group"
                >
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 text-sm font-serif italic shrink-0 group-hover:bg-amber-500/20 group-hover:text-amber-400 transition-colors">
                      {i + 1}
                    </div>
                    <div>{variant}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'hooks' && (
            <motion.div
              key="hooks"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {data.hooks.map((hook, i) => (
                <div 
                  key={i} 
                  className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 hover:border-amber-500/40 transition-colors"
                >
                  <div className="text-2xl mb-2 opacity-20">🪝</div>
                  <div className="text-sm text-white/90 font-medium">{hook}</div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
