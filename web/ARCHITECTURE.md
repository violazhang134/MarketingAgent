# Marketing Agent 前端架构文档

> 架构即认知，文档即记忆，变更即进化。

## 🏛️ 目录结构 (Structure)

```
web/
├── app/                          # Next.js App Router 页面层
│   ├── agent/                    # Agent 一键模式: 自动化编排 (Observe -> Act)
│   ├── create/                   # 素材创作流程: 创意工厂 (Studio / Strategy)
│   ├── feed/                     # 决策流: 数据驱动的 Next Best Action
│   ├── launch/                   # Launch 流程: 专家报告 & 发布包生成
│   └── page.tsx                  # 首页: 中央控制塔 (Command Center)
│
├── components/                   # UI 组件层
│   ├── canvas/                   # 无限画布模块
│   │   ├── infinite-canvas.tsx   # 画布容器: 平移/缩放/模式切换
│   │   ├── canvas-node.tsx       # 节点卡片: 根据 viewMode 渲染简略/详细版
│   │   ├── node-content-renderer.tsx  # 节点内容渲染器: 复用于弹窗/画布详情
│   │   └── node-detail-modal.tsx # 节点详情弹窗: 点击展开详情
│   ├── report/                   # 业务报告: 深度可视化 (Viewer / Analyzer)
│   └── ui/                       # 核心 UI: 毛玻璃风格组件库 (Atomic UI)
│
└── lib/                          # 核心逻辑与状态层
    ├── engines/                  # 业务计算引擎 (Pure Engines)
    │   ├── analysis-engine.ts    # 现象捕捉: 竞品/视频分析逻辑
    │   ├── creative-engine.ts    # 本质转化: 素材生成的 prompt 与算法
    │   └── mock-data.ts          # 数据模拟器
    ├── stores/                   # 跨组件状态管理 (Zustand)
    │   ├── app-store.ts          # 环境状态: UI 偏好、导航、用户画像
    │   ├── campaign-store.ts     # 业务全生命周期: 单一真相源
    │   └── canvas-store.ts       # 画布状态: 节点/边/视图模式/自动布局
    ├── types/                    # 类型契约层
    │   └── canvas-meta-types.ts  # 节点 Meta 数据类型 + 类型守卫
    ├── hooks/                    # 复用交互 Hooks
    │   └── use-sensory.ts        # 感知反馈: 音效与视觉脉冲
    └── utils.ts                  # 无状态工具集
```

## 🧠 核心设计哲学 (Philosophy)

### 1. 单一真相源 (Single Source of Truth)

- 全局业务逻辑仅存在于 `CampaignStore`。
- 排除局部组件维护复杂流程状态，确保数据如河流般单向流动。

### 2. 纯净引擎 (Pure Engines)

- `lib/engines/` 严禁引用 Store 或引发 Side Effect。
- 引擎负责"将输入转化为深度洞察"，它是系统的智力（Intelligence）源泉。

### 3. 极速感知 (Sentient UX)

- **视觉 (Visual)**: 基于 `GlassCard` 的层级系统，强调内容优于装饰。
- **触觉 (Sensory)**: 通过 `useSensory` 提供极简音效反馈，让数字操作具备实体反馈。
- **效率 (Velocity)**: `CommandPalette` (Cmd+K) 提供全键盘驱动的极速交互。

## 🌊 核心工作流 (Workflows)

### 自动化 Agent 模式

1.  **Input**: 用户输入目标。
2.  **Engine**: 调用 `analysis-engine` 捕捉竞品本质。
3.  **Store**: `runAgentWorkflow` 驱动多步编排。
4.  **Sensory**: 关键节点通过音效触发感知反馈。
5.  **Output**: 生成 `LaunchPack` 并渲染至页面。

## 🐾 Minion Mode 交互系统

### 核心概念

将抽象的 AI 工作流转化为具有"生命感"的角色动画，让用户对 Agent 执行过程产生情感连接。

### 架构组件

```
components/canvas/
├── canvas-markie.tsx         # Minion 控制器: 任务分配/动画编排/碰撞检测
└── markie/
    └── pixel-character.tsx   # 像素角色: CSS Box-Shadow 像素画引擎
```

### 角色小队 (The Squad)

| ID  | 名称     | 变体   | 性格描述                   |
| --- | -------- | ------ | -------------------------- |
| 1   | Byte     | orange | 快乐的橘猫，喜欢饼干       |
| 2   | Bit      | blue   | 活泼的蓝兔，爱玩耍         |
| 3   | Kilobyte | green  | 稳重的绿青蛙，节奏慢但可靠 |
| 4   | Meg      | pink   | 甜美的粉熊，喜欢糖果       |
| 5   | Giga     | purple | 神秘的紫猫，闪闪发光       |
| 6   | Tera     | black  | 沉默的黑猫，话少但办事靠谱 |

### 核心特性

1.  **任务派遣动画**: 节点 `running` 时，Minion 高速弹射至节点位置。
2.  **状态响应**: `success` → "Shiny!✨"，`error` → "Bug!! 😱"。
3.  **有机动画**: 呼吸/颠簸节奏随机化，空闲时缓慢漫游。
4.  **互动反馈**: 点击触发性格化对白，碰撞时说 "Bump!"。

## 📝 代码与协作规范

- **文件规模**: 每文件 ≤ 800 行。
- **函数职责**: 一个函数只做一件事。超过 20 行必须考虑拆分。
- **哨兵原则**: 优先通过结构化设计消除特殊分支 (if/else)。

## 📜 变更日志 (Log)

| 日期       | 变更内容        | 决策原因                                 |
| :--------- | :-------------- | :--------------------------------------- |
| 2024-12-26 | 统一 Store      | 解决状态管理碎片化，确立单一真相源       |
| 2024-12-26 | 感知反馈系统    | 提升 AI 产品的"生命感"与操作确认度       |
| 2024-12-26 | 引擎与存储分离  | 物理隔离"算法"与"状态"，提升可测试性     |
| 2024-12-27 | 指令中心集成    | 优化存量用户与专家用户的高频操作流       |
| 2024-12-30 | 画布双模式      | 新增简略/详细视图模式，支持一键整理布局  |
| 2024-12-30 | 类型体系强化    | 消除 any，类型守卫防白屏，动态节流防卡顿 |
| 2024-12-31 | **Minion Mode** | 像素角色小队，任务派遣动画，情境响应气泡 |
| 2024-12-31 | 任务分配优化    | 移除节点类型限制，支持所有 running 节点  |
| 2024-12-31 | Super Dash 动画 | 极速弹射替代瞬移，增强执行感             |
