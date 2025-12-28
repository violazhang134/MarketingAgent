// ========================================
// 竞品分析引擎 - Analysis Engine
// 职责: 模拟 AI 逆向工程竞品的增长策略
// ========================================

// Mock data generator for "Competitor Analysis"
export interface AnalysisResult {
  strategy: string;
  hookIntensity: number;
  retentionFocus: number;
  monetization: number;
  topCreatives: { concept: string; winRate: string; description: string }[];
  clonedScripts: { title: string; scenes: { time: string; action: string; audio: string }[] }[];
}

export function analyzeCompetitor(gameName: string): AnalysisResult {
  // Deterministic-ish simulation based on name length or random
  return {
    strategy: "Satisfying Failures",
    hookIntensity: 0.85,
    retentionFocus: 0.6,
    monetization: 0.9,
    topCreatives: [
      {
         concept: "Fail to Solve",
         winRate: "8.4%",
         description: "Uses a 'frustration trigger' in the first 3s. User fails a simple puzzle due to bad timing."
      },
      {
         concept: "ASMR Cleanup",
         winRate: "6.2%",
         description: "High-contrast visual satisfaction. No music, just raw sound effects."
      }
    ],
    clonedScripts: [
        {
            title: `Cloned Strategy: ${gameName} Fail Variant`,
            scenes: [
                { time: "0:00-0:03", action: "Split screen. Top: Someone failing level 1. Bottom: 'My Mom vs My Dad'", audio: "Upbeat fail sound" },
                { time: "0:03-0:08", action: "Gameplay showing 'Almost Win' but failing at the last second.", audio: "Voiceover: 'Why is this so hard?'" },
                { time: "0:08-0:15", action: "CTA Card with 'Can you do better?' text overlay.", audio: "Music swell + Download sound" }
            ]
        },
        {
            title: "Direct Response: Hook Copy",
            scenes: [
                { time: "N/A", action: "Ad Copy Variant A", audio: `Stop playing boring games! ${gameName} is the hardest puzzle of 2024.` },
                { time: "N/A", action: "Ad Copy Variant B", audio: "I bet you can't pass level 5." }
      ]
    }
    ]
  };
}

export interface VideoAnalysisResult {
    frames: { time: string; label: string; description: string; sentiment: 'positive' | 'negative' | 'neutral' }[];
    hookScore: number;
    retentionScore: number;
}

export function analyzeVideo(_videoId: string): VideoAnalysisResult {
    return {
        hookScore: 9.2,
        retentionScore: 8.5,
        frames: [
            { time: "0:01", label: "Visual Hook", description: "High contrast 'Red vs Blue' fail state", sentiment: "negative" },
            { time: "0:03", label: "Frustration Trigger", description: "Character dies at 99% progress", sentiment: "negative" },
            { time: "0:05", label: "Pacing Change", description: "Sudden acceleration in gameplay speed", sentiment: "neutral" },
            { time: "0:08", label: "Reward Tease", description: "Chests opening animation starts but cuts off", sentiment: "positive" },
            { time: "0:12", label: "Call to Action", description: "Text overlay 'Only 1% can pass'", sentiment: "neutral" }
        ]
    };
}
