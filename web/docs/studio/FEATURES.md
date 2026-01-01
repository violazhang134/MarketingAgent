# Features & Capabilities: The 4 Pillars

本文件深入探讨 Marketing Agent 的核心功能实现细节，旨在为 LLM 和开发者提供功能的逻辑蓝图。

## Pillar 1: Distribution-ready Pack (发布包生成)

### 核心能力

一键将竞品洞察转化为可发布的数字资产。

- **素材生成算法**:
  - `CreativeEngine` 基于 `AdAnalysis` 提取视觉锚点。
  - 生成 3-5 组高 CTR 标题与分镜脚本。
- **模板驱动**:
  - 导出内容严格遵循 `Hook -> Conflict -> Reward -> CTA` 结构。
- **数据流**:
  - `analysis-engine` (竞品本质) -> `creative-engine` (创意转化) -> `LaunchPackPage` (渲染与导出)。

## Pillar 2: Experiment Runner (实验运行器)

### 核心能力

强制标准化的 A/B 测试配置，消除增长实验的盲目性。

- **变量控制**:
  - 支持 `Thumbnail A/B`, `Heading A/B`, `Reward Logic A/B`。
- **路由机制**:
  - 自动为每个实验组分配唯一的 `ExperimentID`。
  - 通过 `Data Loop` 实时监控性能表现。

## Pillar 3: Telemetry & Attribution (遥测与归因)

### 核心能力

屏蔽底层埋点复杂度，提供“增长语义”的数据采集。

- **内置事件流**:
  - `QUALIFIED_START`: 有效开玩（过滤误触）。
  - `WINNING_SIGNAL`: 判定实验组胜出的关键信号。
- **实时看板**:
  - `LiveTelemetry` 组件通过 WebSocket (或 Mock Stream) 实时同步线上流量动态。

## Pillar 4: Next Best Action (下一步动作)

### 核心能力

将繁杂的数据报表转化为确定性的行动指令。

- **决策 Feed**:
  - `DecisionCard` 自动展示“观察结果”与“建议动作”。
- **自动化闭环**:
  - 点击卡片动作（如“优化素材 B”）将自动填充上下文并唤起 Agent 模式，进入下一轮迭代。

---

> “好代码解决真实问题，不对抗假想敌。”
