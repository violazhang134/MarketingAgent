# UI Design & Sensory Guide

本文件定义了 Marketing Agent 的视觉美学与感官交互规范。

## 视觉风格：Obsidian Glassmorphism

我们采用深色调（Obsidian）配合毛玻璃（Glassmorphism）效果，旨在营造精密、现代且专业的 AI 助手感。

### 核心组件

- **GlassCard**: 系统的原子容器。
  - `className="glass-card"`: 提供背景模糊与微妙边框。
  - `hover:border-indigo-500/30`: 增强交互时的深度感。
- **AgentInput**: 系统的交互中心。
  - 极简设计，支持文本输入与多选快速回复。
- **LiveTelemetry**: 系统的生命脉搏。
  - 动态流式布局，实时反馈系统运行状态。

## 感官交互：Sentient Feedback

我们认为 AI 产品不应是冰冷的，而应具备“呼吸感”和“反馈感”。

### 音效语义 (`useSensory`)

- **Tap**: 880Hz 短正弦波，用于普通按钮点击，轻盈清脆。
- **Ping**: 扫频音速，用于系统发现新信息或状态更新。
- **Milestone**: 和弦音，用于流程完成或重要成就达成。

### 动画原则

- **Stagger**: 列表加载必须使用交错动画，引导视线流动。
- **Pulse**: 异步运行状态采用微妙的 `pulse-slow` 动画，示意系统正在“思考”。

---

> “简化是最高形式的复杂。”
