# 引擎模块 API 文档 ⚙️

> 本文档介绍 Marketing Agent 的业务计算引擎（无状态纯函数），适合开发者和 LLM 阅读。

---

## 设计原则

所有 Engine 函数遵循「**纯净引擎**」原则：

- ✅ **无状态**：不依赖也不修改任何全局状态
- ✅ **无副作用**：不发起网络请求、不写入文件
- ✅ **可测试**：可在 Node.js 环境独立运行
- ✅ **确定性**：相同输入必得相同输出（或可控的模拟随机）

---

## analysis-engine.ts（竞品分析引擎）

### analyzeCompetitor

分析竞品的增长策略。

```typescript
import {
  analyzeCompetitor,
  AnalysisResult,
} from "@/lib/engines/analysis-engine";

const result: AnalysisResult = analyzeCompetitor("Subway Surfers");
```

**参数：**
| 名称 | 类型 | 说明 |
|------|------|------|
| `gameName` | `string` | 竞品游戏名称 |

**返回值：** `AnalysisResult`

```typescript
interface AnalysisResult {
  strategy: string; // 主策略名称（如 "Satisfying Failures"）
  hookIntensity: number; // Hook 强度 (0-1)
  retentionFocus: number; // 留存关注度 (0-1)
  monetization: number; // 变现倾向 (0-1)
  topCreatives: {
    // 高胜率创意
    concept: string;
    winRate: string;
    description: string;
  }[];
  clonedScripts: {
    // 可复用脚本模板
    title: string;
    scenes: { time: string; action: string; audio: string }[];
  }[];
}
```

---

### analyzeVideo

分析广告视频的帧结构和节奏。

```typescript
import {
  analyzeVideo,
  VideoAnalysisResult,
} from "@/lib/engines/analysis-engine";

const result: VideoAnalysisResult = analyzeVideo("video_123");
```

**返回值：** `VideoAnalysisResult`

```typescript
interface VideoAnalysisResult {
  hookScore: number; // Hook 评分 (0-10)
  retentionScore: number; // 留存评分 (0-10)
  frames: {
    time: string;
    label: string;
    description: string;
    sentiment: "positive" | "negative" | "neutral";
  }[];
}
```

---

## creative-engine.ts（素材生成引擎）

### generateCreativeAssets

生成完整的创意素材包。

```typescript
import {
  generateCreativeAssets,
  GeneratedAssets,
} from "@/lib/engines/creative-engine";

const assets: GeneratedAssets = generateCreativeAssets(product, strategy);
```

**参数：**
| 名称 | 类型 | 说明 |
|------|------|------|
| `product` | `ProductProfile` | 产品信息 |
| `strategy` | `CreativeStrategy` | 创意策略配置 |
| `competitorInsight` | `{ strategy: string }` (可选) | 竞品洞察 |

**返回值：** `GeneratedAssets`

```typescript
interface GeneratedAssets {
  scripts: VideoScript[]; // 视频脚本列表
  copyVariants: string[]; // 文案变体
  hooks: string[]; // Hook 素材
  landingCopy: {
    // 落地页文案
    headline: string;
    subhead: string;
    cta: string;
    benefits: string[];
  };
  sharingCopy: {
    // 分享激励文案
    title: string;
    desc: string;
  };
}
```

---

### generateVideoScripts

生成视频脚本（被 `generateCreativeAssets` 内部调用）。

```typescript
import { generateVideoScripts } from "@/lib/engines/creative-engine";

const scripts = generateVideoScripts(product, strategy);
```

**视频脚本结构：**

```typescript
interface VideoScript {
  id: string;
  title: string; // 脚本标题
  duration: string; // 时长（如 "15s"）
  platform: string; // 目标平台（tiktok/meta）
  hook: string; // 开头 Hook
  cta: string; // 结尾 CTA
  scenes: {
    timestamp: string; // 时间戳
    visual: string; // 画面描述
    audio: string; // 音频/旁白
    text: string; // 字幕文案
  }[];
}
```

---

### generateExperimentPack

生成 A/B 实验配置包。

```typescript
import {
  generateExperimentPack,
  ExperimentPack,
} from "@/lib/engines/creative-engine";

const pack: ExperimentPack = generateExperimentPack(product, experimentConfig);
```

**参数：**
| 名称 | 类型 | 说明 |
|------|------|------|
| `product` | `ProductProfile` | 产品信息 |
| `config` | `ExperimentConfig` | 实验配置 |

**返回值：** `ExperimentPack`

```typescript
interface ExperimentPack {
  experimentId: string; // 实验 ID
  variable: "cover" | "incentive" | "entry"; // 实验变量
  arms: [ExperimentArm, ExperimentArm]; // 对照组和测试组
  allocations: [number, number]; // 流量分配比例
}
```

---

## comment-analyzer.ts（评论分析引擎）

### analyzeComments

分析竞品用户评论，提取痛点和满意点。

```typescript
import {
  analyzeComments,
  CommentAnalysis,
} from "@/lib/engines/comment-analyzer";

const result: CommentAnalysis = analyzeComments("Subway Surfers");
```

**返回值：** `CommentAnalysis`

```typescript
interface CommentAnalysis {
  sentiment: {
    positive: number; // 正向占比 (%)
    negative: number; // 负向占比 (%)
    neutral: number; // 中性占比 (%)
  };
  painPoints: { topic: string; frequency: number; quotes: string[] }[];
  delightPoints: { topic: string; frequency: number; quotes: string[] }[];
}
```

---

### generateInsightsReport

基于评论分析生成洞察报告。

```typescript
import {
  generateInsightsReport,
  InsightsReport,
} from "@/lib/engines/comment-analyzer";

const report: InsightsReport = generateInsightsReport(
  commentAnalysis,
  competitor,
  product
);
```

**返回值：** `InsightsReport`

```typescript
interface InsightsReport {
  summary: string; // 洞察摘要
  strategySuggestions: string[]; // 策略建议列表
  keyOpportunities: string[]; // 关键机会点
}
```

---

## 类型定义

### ProductProfile

```typescript
interface ProductProfile {
  name: string; // 产品名称
  icon: string; // 图标 emoji
  screenshots: string[]; // 截图 URL
  description: string; // 产品描述
  category: string; // 类别（如 'Casual'）
}
```

### CreativeStrategy

```typescript
interface CreativeStrategy {
  hookStyle: "challenge" | "suspense" | "satisfaction" | "contrast";
  visualTone: "bright" | "dark" | "pastel";
  ctaIntensity: "soft" | "medium" | "strong";
  targetAudience: "casual" | "hardcore" | "everyone";
}
```

### ExperimentConfig

```typescript
interface ExperimentConfig {
  variable: "cover" | "incentive" | "entry"; // 实验变量
  variants: string[]; // 变体名称
}
```

---

## 使用场景

### 在 Store Action 中调用

```typescript
// campaign-store.ts
import { analyzeCompetitor } from "@/lib/engines/analysis-engine";
import { generateCreativeAssets } from "@/lib/engines/creative-engine";

const runAgentWorkflow = async () => {
  const analysis = analyzeCompetitor(competitorName);
  set({ adAnalysis: analysis });

  // ... 后续步骤

  const assets = generateCreativeAssets(product, strategy);
  set({ generatedAssets: assets });
};
```

---

> "引擎是系统的智力源泉，保持它的纯净。"
