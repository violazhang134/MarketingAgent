"use client";

import { Download, Copy } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { useCampaignStore } from "@/lib/stores/campaign-store";

interface Scene {
  time?: string;
  timestamp?: string;
  action?: string;
  text?: string;
  audio?: string;
  visual?: string;
}

const SCRIPTS = [
  {
    title: "Hook Variation A: The 'Impossible' Challenge",
    scenes: [
      { time: "0-3s", action: "Show character failing repeatedly at level 1", audio: "Voiceover: 'They said this game was easy...'" },
      { time: "3-8s", action: "Sudden high-skill gameplay moment", audio: "Upbeat electronic music kicks in" },
      { time: "8-12s", action: "CTA Overlay: 'Can you beat level 1?'", audio: "Sound effect: Ding!" }
    ]
  },
  {
    title: "Hook Variation B: Satisfying Cleanup",
    scenes: [
      { time: "0-3s", action: "Perfectly clearing a messy area", audio: "ASMR cleaning sounds" },
      { time: "3-8s", action: "Show the progression bar filling up", audio: "Rising synth chord" },
      { time: "8-12s", action: "CTA: 'Try it yourself'", audio: "Soft woosh" }
    ]
  }
];

export default function PublishPackPage() {
  const { adAnalysis, competitorName, generatedAssets } = useCampaignStore();
  
  // Use generated assets if available, otherwise mock default
  const scriptsToRender = generatedAssets?.scripts || SCRIPTS;
  const subtitle = adAnalysis 
      ? `Strategy Cloned from "${competitorName}" • High Confidence`
      : 'Generated based on "Runner / Casual" • Target: US';

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto space-y-8">
       <header className="space-y-2">
          <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest">Ready to Launch</div>
          <h1 className="text-3xl font-bold text-white">Your Publish Pack</h1>
          <p className="text-white/60">{subtitle}</p>
       </header>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Scripts & Assets */}
          <div className="space-y-6">
             <h2 className="text-lg font-semibold text-white/80 flex items-center gap-2">
                Generated Content <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs">{scriptsToRender.length} Variants</span>
             </h2>
             
             {scriptsToRender.map((script, i) => (
                <GlassCard key={i} className="p-6 space-y-4 bg-white/5">
                   <div className="flex items-center justify-between">
                      <h3 className="font-medium text-indigo-300">{script.title}</h3>
                      <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                         <Copy className="w-4 h-4 text-white/40" />
                      </button>
                   </div>
                   <div className="space-y-3">
                       {script.scenes.map((scene: Scene, idx: number) => {
                          const time = scene.time || scene.timestamp;
                          const action = scene.action || scene.text;
                          const audio = scene.audio || scene.visual;
                          return (
                            <div key={idx} className="flex gap-4 text-sm p-2 rounded hover:bg-white/5 transition-colors">
                               <span className="font-mono text-white/30 w-12 shrink-0">{time}</span>
                               <div className="space-y-1">
                                  <p className="text-white/80">{action}</p>
                                  <p className="text-white/40 italic text-xs">{audio}</p>
                               </div>
                            </div>
                          );
                       })}
                    </div>
                </GlassCard>
             ))}
          </div>

          {/* Right Column: Strategy Matrix & Actions */}
          <div className="space-y-6">
             <h2 className="text-lg font-semibold text-white/80">Experiment Matrix</h2>
             <GlassCard className="p-6 bg-indigo-900/10 border-indigo-500/20">
                <div className="grid grid-cols-2 gap-4 text-center">
                   <div className="p-4 rounded bg-indigo-500/10 border border-indigo-500/20">
                      <div className="text-xs text-white/40 uppercase mb-1">Group A</div>
                      <div className="font-semibold text-indigo-300">Hook A + Easy</div>
                   </div>
                   <div className="p-4 rounded bg-white/5 border border-white/10 opacity-50">
                      <div className="text-xs text-white/40 uppercase mb-1">Group B</div>
                      <div className="font-medium">Hook A + Hard</div>
                   </div>
                   <div className="p-4 rounded bg-white/5 border border-white/10 opacity-50">
                      <div className="text-xs text-white/40 uppercase mb-1">Group C</div>
                      <div className="font-medium">Hook B + Easy</div>
                   </div>
                   <div className="p-4 rounded bg-white/5 border border-white/10 opacity-50">
                      <div className="text-xs text-white/40 uppercase mb-1">Group D</div>
                      <div className="font-medium">Hook B + Hard</div>
                   </div>
                </div>
                <div className="mt-6 text-xs text-white/40 text-center">
                   Automatic 2x2 Multivariate Test configured
                </div>
             </GlassCard>

             <GlassCard className="p-8 flex flex-col items-center text-center gap-4 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border-indigo-500/30">
                <Download className="w-8 h-8 text-indigo-400 mb-2" />
                <div>
                   <h3 className="text-lg font-bold text-white">Download All Assets</h3>
                   <p className="text-sm text-white/60">Scripts, copy, and tracking links (.zip)</p>
                </div>
                <button className="mt-2 w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-colors shadow-lg shadow-white/10">
                   Download Package
                </button>
             </GlassCard>
          </div>
       </div>
    </div>
  );
}
