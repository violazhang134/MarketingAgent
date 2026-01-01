# 核心组件文档 🧩

> 本文档介绍 Marketing Agent 的核心 React 组件，帮助开发者快速理解组件职责和使用方式。

---

## 组件架构概览

```
components/
├── canvas/           # 无限画布组件族
│   ├── infinite-canvas.tsx    # 画布容器
│   ├── canvas-node.tsx        # 节点卡片
│   ├── canvas-edge.tsx        # 连接线
│   ├── canvas-markie.tsx      # Minion 动画层
│   └── node-content-renderer.tsx  # 节点内容渲染
├── ui/               # 原子 UI 组件
│   ├── glass-card.tsx         # 毛玻璃卡片
│   ├── agent-input.tsx        # AI 输入框
│   ├── command-palette.tsx    # 命令面板 (Cmd+K)
│   ├── markie-sidebar.tsx     # 侧边栏
│   └── ...
└── report/           # 报告组件
    └── ...
```

---

## Canvas 组件族

### `<InfiniteCanvas />`

无限画布的核心容器，负责视口控制、节点渲染和交互处理。

```tsx
import { InfiniteCanvas } from "@/components/canvas/infinite-canvas";

<InfiniteCanvas
  onNodeClick={(nodeId) => handleNodeClick(nodeId)}
  onCanvasClick={() => handleCanvasClick()}
/>;
```

**Props:**

| 属性            | 类型                       | 说明               |
| --------------- | -------------------------- | ------------------ |
| `onNodeClick`   | `(nodeId: string) => void` | 节点点击回调       |
| `onCanvasClick` | `() => void`               | 画布空白区点击回调 |

**特性：**

- ✅ 鼠标拖拽平移画布
- ✅ 滚轮缩放 (0.3x ~ 2x)
- ✅ 双模式切换（简略/详细）
- ✅ 一键整理布局
- ✅ 适配居中所有节点
- ✅ Minion 动画层

---

### `<CanvasNode />`

画布上的节点卡片，根据 `viewMode` 渲染不同样式。

```tsx
import { CanvasNode } from "@/components/canvas/canvas-node";

<CanvasNode
  node={node}
  isSelected={selectedNodeId === node.id}
  viewMode="simplified"
  onClick={() => setSelectedNode(node.id)}
/>;
```

**Props:**

| 属性         | 类型                         | 说明         |
| ------------ | ---------------------------- | ------------ |
| `node`       | `CanvasNode`                 | 节点数据对象 |
| `isSelected` | `boolean`                    | 是否选中状态 |
| `viewMode`   | `'simplified' \| 'detailed'` | 视图模式     |
| `onClick`    | `() => void`                 | 点击回调     |

**节点类型样式：**

- `analysis` - 蓝色分析图标
- `insight` - 紫色洞察图标
- `creative` - 黄色创意图标
- `experiment` - 绿色实验图标
- `agent_step` - 灰色步骤图标

---

### `<CanvasEdge />`

节点之间的连接线，使用 SVG 贝塞尔曲线绘制。

```tsx
import { CanvasEdge } from "@/components/canvas/canvas-edge";

<CanvasEdge
  edge={edge}
  fromNode={fromNode}
  toNode={toNode}
  viewMode="simplified"
/>;
```

**Props:**

| 属性       | 类型             | 说明                       |
| ---------- | ---------------- | -------------------------- |
| `edge`     | `CanvasEdge`     | 边数据对象                 |
| `fromNode` | `CanvasNode`     | 起始节点                   |
| `toNode`   | `CanvasNode`     | 目标节点                   |
| `viewMode` | `CanvasViewMode` | 视图模式（影响连接点位置） |

---

### `<CanvasMarkie />`

Minion 动画层，渲染 Byte、Bit、Glitch 三只小队成员。

```tsx
import { CanvasMarkie } from "@/components/canvas/canvas-markie";

<CanvasMarkie nodes={nodes} viewport={viewport} />;
```

**Props:**

| 属性       | 类型           | 说明             |
| ---------- | -------------- | ---------------- |
| `nodes`    | `CanvasNode[]` | 当前画布节点列表 |
| `viewport` | `Viewport`     | 当前视口状态     |

**行为模式：**

- 🏃 **Dispatch**: 任务开始时从角落跑向节点
- 🔨 **Working**: 在 `running` 节点周围"施工"
- 🎉 **Celebration**: 任务完成时击掌庆祝
- 💤 **Idle**: 空闲时在角落摸鱼

---

### `<NodeContentRenderer />`

节点内容渲染器，根据节点类型渲染对应的详情内容。

```tsx
import { NodeContentRenderer } from "@/components/canvas/node-content-renderer";

<NodeContentRenderer node={node} />;
```

用于 `viewMode="detailed"` 时在节点卡片内渲染完整内容，同时被弹窗复用。

---

## UI 原子组件

### `<GlassCard />`

毛玻璃风格卡片容器，是系统的基础 UI 原子。

```tsx
import { GlassCard } from "@/components/ui/glass-card";

<GlassCard className="p-4">
  <h3>标题</h3>
  <p>内容...</p>
</GlassCard>;
```

**Props:**

| 属性        | 类型                      | 说明       |
| ----------- | ------------------------- | ---------- |
| `className` | `string`                  | 额外样式类 |
| `children`  | `ReactNode`               | 子内容     |
| `variant`   | `'default' \| 'elevated'` | 卡片层级   |

---

### `<AgentInput />`

AI 对话输入框，支持文本输入和快速回复按钮。

```tsx
import { AgentInput } from "@/components/ui/agent-input";

<AgentInput
  value={input}
  onChange={setInput}
  onSubmit={handleSubmit}
  placeholder="告诉 Markie 你想分析的竞品..."
  quickReplies={["分析 Subway Surfers", "生成创意素材"]}
  onQuickReply={handleQuickReply}
/>;
```

**Props:**

| 属性           | 类型                      | 说明             |
| -------------- | ------------------------- | ---------------- |
| `value`        | `string`                  | 输入值           |
| `onChange`     | `(value: string) => void` | 值变更回调       |
| `onSubmit`     | `() => void`              | 提交回调         |
| `placeholder`  | `string`                  | 占位文本         |
| `quickReplies` | `string[]`                | 快速回复选项     |
| `onQuickReply` | `(reply: string) => void` | 快速回复点击回调 |

---

### `<CommandPalette />`

全局命令面板，通过 `Cmd+K` 唤起。

```tsx
// 已在 layout.tsx 中全局挂载，无需手动使用
```

**内置命令：**

- `启动分析` - 开始 Agent 工作流
- `生成素材` - 生成创意素材包
- `重置画布` - 清空当前画布
- `切换视图` - 简略/详细模式切换

---

### `<MarkieSidebar />`

右侧 Markie 对话侧边栏，负责与用户交互。

```tsx
import { MarkieSidebar } from "@/components/ui/markie-sidebar";

<MarkieSidebar />;
```

**功能：**

- 💬 对话消息展示
- 📝 工作流进度条
- 🎯 快速操作按钮
- 🔧 设置面板（Minion 开关等）

---

### `<DecisionCard />`

决策卡片，用于展示 Next Best Action 建议。

```tsx
import { DecisionCard } from "@/components/ui/decision-card";

<DecisionCard
  title="优化素材 B"
  description="巴西地区 CTR 提升 23%"
  action={<button>应用</button>}
/>;
```

---

## 样式规范

### CSS 变量（`globals.css`）

```css
:root {
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.1);
  --accent-primary: #6366f1; /* Indigo */
  --accent-success: #22c55e; /* Green */
  --accent-warning: #f59e0b; /* Amber */
}
```

### 动画类

| 类名            | 效果                 |
| --------------- | -------------------- |
| `.pulse-slow`   | 缓慢脉冲（加载状态） |
| `.glass-card`   | 毛玻璃效果           |
| `.stagger-item` | 交错入场动画         |

---

## 最佳实践

1. **优先使用 GlassCard**：所有卡片容器应使用 `<GlassCard />`，保持视觉一致性。

2. **节点类型扩展**：新增节点类型时，需同步更新：

   - `canvas-store.ts` 的 `CanvasNodeType` 类型
   - `canvas-node.tsx` 的图标映射
   - `node-content-renderer.tsx` 的内容渲染

3. **动画性能**：使用 Framer Motion 的 `layoutId` 实现布局动画，避免强制 reflow。

---

> "组件是乐高积木，系统是完整的城堡。"
