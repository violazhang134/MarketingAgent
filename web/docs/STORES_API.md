# 状态管理 API 文档 📦

> 本文档详细介绍 Marketing Agent 的 Zustand 状态管理系统，适合开发者和 LLM 阅读。

---

## 概述

Marketing Agent 使用 **Zustand** 进行状态管理，分为三个职责明确的 Store：

| Store              | 文件路径                       | 职责                           |
| ------------------ | ------------------------------ | ------------------------------ |
| `useAppStore`      | `lib/stores/app-store.ts`      | 全局 UI 状态、用户偏好         |
| `useCampaignStore` | `lib/stores/campaign-store.ts` | 营销活动生命周期、工作流编排   |
| `useCanvasStore`   | `lib/stores/canvas-store.ts`   | 无限画布状态、节点/边/视图控制 |

---

## useAppStore（全局应用状态）

### 导入方式

```typescript
import { useAppStore } from "@/lib/stores/app-store";
```

### State 结构

```typescript
interface AppState {
  userName: string; // 用户名
  hasSeenOnboarding: boolean; // 是否完成引导
  isSidebarOpen: boolean; // 侧边栏开关
  minionsEnabled: boolean; // Minion 小队开关
}
```

### Actions

| 方法                   | 参数     | 说明                 |
| ---------------------- | -------- | -------------------- |
| `setUserName(name)`    | `string` | 设置用户名           |
| `completeOnboarding()` | -        | 标记引导完成         |
| `toggleSidebar()`      | -        | 切换侧边栏状态       |
| `toggleMinions()`      | -        | 切换 Minion 小队开关 |
| `reset()`              | -        | 重置所有状态到默认值 |

### 使用示例

```tsx
function Header() {
  const { userName, toggleSidebar, minionsEnabled, toggleMinions } =
    useAppStore();

  return (
    <header>
      <span>欢迎, {userName}</span>
      <button onClick={toggleSidebar}>切换侧边栏</button>
      <button onClick={toggleMinions}>
        Minions: {minionsEnabled ? "开启" : "关闭"}
      </button>
    </header>
  );
}
```

---

## useCampaignStore（营销活动状态）

### 导入方式

```typescript
import { useCampaignStore } from "@/lib/stores/campaign-store";
```

### State 结构

```typescript
interface CampaignState {
  // 流程阶段
  phase: "idle" | "running" | "review" | "complete";
  currentStepIndex: number;
  steps: AgentStep[];
  messages: Message[];

  // 输入数据
  competitorName: string;
  productName: string;
  productDesc: string;

  // 分析结果
  adAnalysis: AnalysisResult | null;
  commentAnalysis: CommentAnalysis | null;
  strategySummary: string;

  // 创意配置
  strategy: CreativeStrategy;
  experimentConfig: ExperimentConfig;
  generatedAssets: GeneratedAssets | null;
  experimentPack: ExperimentPack | null;

  // Playbook
  playbook: PlaybookEntry[];
  currentExperimentResult: ExperimentResult | null;
  isOptimized: boolean;
}
```

### 核心 Actions

| 方法                               | 参数                                              | 说明                                 |
| ---------------------------------- | ------------------------------------------------- | ------------------------------------ |
| `updateInput(data)`                | `{ competitorName?, productName?, productDesc? }` | 更新输入数据                         |
| `setStrategy(strategy)`            | `Partial<CreativeStrategy>`                       | 更新创意策略                         |
| `runAgentWorkflow()`               | -                                                 | 🌟 **核心**：启动 Agent 自动化工作流 |
| `generateAssetsWorkflow()`         | -                                                 | 生成创意素材包                       |
| `settleExperiment(winnerId, lift)` | `string, string`                                  | 结算实验，记录胜出组                 |
| `applyWinningPattern(entry)`       | `PlaybookEntry`                                   | 应用已验证的优胜策略                 |
| `reset()`                          | -                                                 | 重置所有状态                         |

### 工作流说明

`runAgentWorkflow()` 是整个系统的核心方法，执行以下步骤：

```
1. 采集广告数据 (ads)
   ↓
2. 分析趋势内容 (trends)
   ↓
3. 解析用户评论 (comments)
   ↓
4. 生成洞察报告 (insight)
   ↓
5. 生成差异化策略 (strategy)
```

每个步骤都会：

- 更新 `steps` 状态（pending → running → done）
- 在画布上创建对应节点
- 自动连接节点形成工作流图

### 使用示例

```tsx
function AgentPage() {
  const { phase, steps, competitorName, updateInput, runAgentWorkflow } =
    useCampaignStore();

  const handleStart = async () => {
    if (!competitorName) {
      updateInput({ competitorName: "Subway Surfers" });
    }
    await runAgentWorkflow();
  };

  return (
    <div>
      <p>当前阶段: {phase}</p>
      {steps.map((step) => (
        <div key={step.id}>
          {step.label}: {step.status}
        </div>
      ))}
      <button onClick={handleStart}>启动分析</button>
    </div>
  );
}
```

---

## useCanvasStore（无限画布状态）

### 导入方式

```typescript
import { useCanvasStore } from "@/lib/stores/canvas-store";
```

### 核心类型

```typescript
// 节点类型
type CanvasNodeType =
  | "text"
  | "chart"
  | "reference"
  | "media"
  | "agent_step" // Agent 工作步骤
  | "analysis" // 竞品分析
  | "creative" // 创意素材
  | "experiment" // 实验配置
  | "insight"; // 洞察报告

// 节点状态
type NodeStatus = "pending" | "running" | "done" | "error";

// 视图模式
type CanvasViewMode = "simplified" | "detailed";
```

### State 结构

```typescript
interface CanvasState {
  canvases: CanvasMeta[]; // 画布元数据列表
  nodes: CanvasNode[]; // 所有节点
  edges: CanvasEdge[]; // 所有连接线
  activeCanvasId: string | null; // 当前活动画布
  selectedNodeId: string | null; // 当前选中节点
  viewport: Viewport; // 视口（平移/缩放）
  viewMode: CanvasViewMode; // 简略/详细模式
}
```

### Actions

#### 节点操作

| 方法                           | 参数                          | 说明                       |
| ------------------------------ | ----------------------------- | -------------------------- |
| `addNode(input)`               | `Omit<CanvasNode, 'id'>`      | 添加节点，返回创建的节点   |
| `updateNode(id, data)`         | `string, Partial<CanvasNode>` | 更新节点数据               |
| `updateNodePosition(id, x, y)` | `string, number, number`      | 更新节点位置               |
| `updateNodeStatus(id, status)` | `string, NodeStatus`          | 更新节点执行状态           |
| `deleteNode(id)`               | `string`                      | 删除节点（自动删除关联边） |
| `setSelectedNode(id)`          | `string \| null`              | 设置选中节点               |

#### 边（连接线）操作

| 方法             | 参数                                          | 说明       |
| ---------------- | --------------------------------------------- | ---------- |
| `addEdge(input)` | `{ fromNodeId, toNodeId, label?, animated? }` | 添加连接线 |

#### 视口控制

| 方法                    | 参数                | 说明                   |
| ----------------------- | ------------------- | ---------------------- |
| `setViewport(viewport)` | `Partial<Viewport>` | 设置视口（x, y, zoom） |
| `panTo(nodeId)`         | `string`            | 平移视口使指定节点居中 |
| `resetViewport()`       | -                   | 重置视口到原点         |
| `fitToNodes(w, h)`      | `number, number`    | 自动缩放以显示所有节点 |

#### 视图模式

| 方法                | 参数                         | 说明                             |
| ------------------- | ---------------------------- | -------------------------------- |
| `setViewMode(mode)` | `'simplified' \| 'detailed'` | 切换简略/详细模式                |
| `autoLayout()`      | -                            | 一键整理节点位置（碰撞检测算法） |

#### 工作流辅助（高级）

| 方法                                                      | 说明                                 |
| --------------------------------------------------------- | ------------------------------------ |
| `addWorkflowNode(type, title, summary, parentId?, meta?)` | 添加工作流节点，自动定位并连接父节点 |
| `getNextNodePosition(parentId?)`                          | 计算下一个节点的最优位置             |

### 使用示例

```tsx
function CanvasToolbar() {
  const { viewMode, setViewMode, autoLayout, resetCanvas } = useCanvasStore();

  return (
    <div className="toolbar">
      <button
        onClick={() =>
          setViewMode(viewMode === "simplified" ? "detailed" : "simplified")
        }
      >
        切换视图: {viewMode === "simplified" ? "简略" : "详细"}
      </button>
      <button onClick={autoLayout}>一键整理</button>
      <button onClick={resetCanvas}>清空画布</button>
    </div>
  );
}
```

---

## 跨 Store 协作模式

### Campaign Store 调用 Canvas Store

`useCampaignStore.runAgentWorkflow()` 内部会调用 `useCanvasStore` 的方法：

```typescript
// campaign-store.ts 内部
const canvasStore = useCanvasStore.getState();
canvasStore.resetCanvas();          // 清空画布
canvasStore.addWorkflowNode(...);   // 创建节点
canvasStore.updateNodeStatus(...);  // 更新状态
canvasStore.panTo(nodeId);          // 平移视口
```

### 最佳实践

1. **不要在组件中直接调用多个 Store 的方法来编排流程**，应将编排逻辑封装在一个 Store 的 Action 中。
2. **使用选择器优化渲染**：

   ```typescript
   // ✅ 推荐：只订阅需要的字段
   const phase = useCampaignStore((state) => state.phase);

   // ❌ 避免：订阅整个 Store
   const store = useCampaignStore();
   ```

3. **在 Store 外部访问状态**（如工具函数中）：
   ```typescript
   const currentPhase = useCampaignStore.getState().phase;
   ```

---

> "单一真相源，单向数据流，最小化耦合。"
