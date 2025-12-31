import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ========================================
// 节点类型定义
// ========================================
export type CanvasNodeType = 
  | 'text' 
  | 'chart' 
  | 'reference' 
  | 'media'
  | 'agent_step'     // Agent 工作步骤
  | 'analysis'       // 竞品分析结果
  | 'creative'       // 创意素材
  | 'experiment'     // 实验配置
  | 'insight';       // 洞察报告

// 节点执行状态
export type NodeStatus = 'pending' | 'running' | 'done' | 'error';

// ========================================
// 视图模式
// ========================================
export type CanvasViewMode = 'simplified' | 'detailed';

// ========================================
// 数据结构
// ========================================
export interface CanvasMeta {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface CanvasNode {
  id: string;
  canvasId: string;
  type: CanvasNodeType;
  x: number;
  y: number;
  title: string;
  summary: string;
  status?: NodeStatus;           // 节点执行状态
  animationDelay?: number;       // 入场动画延迟 (ms)
  expandable?: boolean;          // 是否可展开详情
  detailComponent?: string;      // 详情组件名
  meta?: {
    competitorName?: string;
    productName?: string;
    runType?: 'agent' | 'markie';
    createdAt?: string;
    // 扩展数据存储
    analysisData?: unknown;
    insightsData?: unknown;
    creativeData?: unknown;
    experimentData?: unknown;
    trackingData?: unknown;
    scripts?: unknown;
    copyVariants?: unknown;
    hooks?: unknown;
    experimentPack?: unknown;
    [key: string]: unknown;
  };
}

export interface CanvasEdge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  label?: string;
  animated?: boolean;  // 是否显示流动动画
}

export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

// ========================================
// 布局常量
// ========================================
const NODE_WIDTH_SIMPLIFIED = 280;
const NODE_WIDTH_DETAILED = 600;
const NODE_HEIGHT_SIMPLIFIED = 120;
const NODE_HEIGHT_DETAILED = 400;  // 估算值，实际由内容撑开
const NODE_GAP_X = 60;
const NODE_GAP_Y = 40;
const INITIAL_X = 100;
const INITIAL_Y = 100;

// 详细模式下的布局尺寸估算（用于碰撞检测）
const LAYOUT_SIZES: Record<string, { width: number; height: number }> = {
  // 详细模式内容高度不可控，因此预估一个较大的值以确保不会重叠
  analysis: { width: 800, height: 1200 },
  insight: { width: 800, height: 1200 },
  creative: { width: 800, height: 1000 },
  experiment: { width: 800, height: 800 },
  default: { width: 600, height: 500 },
};

const getLayoutSize = (type: string, mode: CanvasViewMode) => {
  if (mode === 'simplified') {
    return { width: NODE_WIDTH_SIMPLIFIED, height: NODE_HEIGHT_SIMPLIFIED };
  }
  return LAYOUT_SIZES[type] || LAYOUT_SIZES.default;
};

// ========================================
// Store Interface
// ========================================
interface CanvasState {
  canvases: CanvasMeta[];
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  activeCanvasId: string | null;
  selectedNodeId: string | null;
  viewport: Viewport;
  viewMode: CanvasViewMode;  // 视图模式

  // 基础操作
  setActiveCanvas: (id: string) => void;
  addNode: (input: Omit<CanvasNode, 'id'>) => CanvasNode;
  addEdge: (input: Omit<CanvasEdge, 'id'>) => CanvasEdge;
  updateNodePosition: (id: string, x: number, y: number) => void;
  updateNode: (id: string, data: Partial<CanvasNode>) => void;
  updateNodeStatus: (id: string, status: NodeStatus) => void;
  deleteNode: (id: string) => void;
  setSelectedNode: (id: string | null) => void;
  resetCanvas: () => void;

  // Viewport 控制
  setViewport: (viewport: Partial<Viewport>) => void;
  panTo: (nodeId: string) => void;
  resetViewport: () => void;
  fitToNodes: (containerWidth: number, containerHeight: number) => void;  // 一键居中所有节点

  // 自动布局
  getNextNodePosition: (parentNodeId?: string) => { x: number; y: number };

  // 视图模式控制
  setViewMode: (mode: CanvasViewMode) => void;
  autoLayout: () => void;  // 一键整理节点位置
  
  // 工作流辅助
  addWorkflowNode: (
    type: CanvasNodeType,
    title: string,
    summary: string,
    parentNodeId?: string,
    meta?: CanvasNode['meta']
  ) => CanvasNode;
}

const defaultCanvasId = 'canvas_default';
const DEFAULT_VIEWPORT: Viewport = { x: 0, y: 0, zoom: 1 };

export const useCanvasStore = create<CanvasState>()(
  persist(
    (set, get) => ({
      canvases: [
        {
          id: defaultCanvasId,
          title: '默认调研画布',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      nodes: [],
      edges: [],
      activeCanvasId: defaultCanvasId,
      selectedNodeId: null,
      viewport: DEFAULT_VIEWPORT,
      viewMode: 'simplified',  // 默认简略版

      // ========================================
      // 基础操作
      // ========================================
      setActiveCanvas: (id) => set({ activeCanvasId: id }),

      addNode: (input) => {
        const state = get();
        const id = Math.random().toString(36).slice(2);
        const node: CanvasNode = {
          id,
          ...input,
        };

        set({
          nodes: [...state.nodes, node],
          canvases: state.canvases.map((c) =>
            c.id === node.canvasId
              ? { ...c, updatedAt: new Date().toISOString() }
              : c
          ),
        });

        return node;
      },

      addEdge: (input) => {
        const state = get();
        const id = Math.random().toString(36).slice(2);
        const edge: CanvasEdge = { id, ...input };

        set({ edges: [...state.edges, edge] });

        return edge;
      },

      updateNodePosition: (id, x, y) => {
        const state = get();
        set({
          nodes: state.nodes.map((n) =>
            n.id === id ? { ...n, x, y } : n
          ),
        });
      },

      updateNode: (id, data) => {
        const state = get();
        set({
          nodes: state.nodes.map((n) =>
            n.id === id ? { ...n, ...data } : n
          ),
        });
      },

      updateNodeStatus: (id, status) => {
        const state = get();
        set({
          nodes: state.nodes.map((n) =>
            n.id === id ? { ...n, status } : n
          ),
        });
      },

      deleteNode: (id) => {
        const state = get();
        set({
          nodes: state.nodes.filter((n) => n.id !== id),
          edges: state.edges.filter(
            (e) => e.fromNodeId !== id && e.toNodeId !== id
          ),
          selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
        });
      },

      setSelectedNode: (id) => {
        set({ selectedNodeId: id });
      },

      resetCanvas: () =>
        set({
          canvases: [
            {
              id: defaultCanvasId,
              title: '默认调研画布',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          nodes: [],
          edges: [],
          activeCanvasId: defaultCanvasId,
          selectedNodeId: null,
          viewport: DEFAULT_VIEWPORT,
        }),

      // ========================================
      // Viewport 控制
      // ========================================
      setViewport: (viewport) => {
        const state = get();
        set({ viewport: { ...state.viewport, ...viewport } });
      },

      panTo: (nodeId) => {
        const state = get();
        const node = state.nodes.find((n) => n.id === nodeId);
        if (node) {
          // 动态计算容器中心
          let containerW = 1200;
          let containerH = 800;
          
          if (typeof window !== 'undefined') {
            // 减去侧边栏宽度 (估算 400px)，确保节点在画布可视区域居中
            containerW = window.innerWidth - 450; 
            containerH = window.innerHeight;
          }

          const size = getLayoutSize(node.type, state.viewMode);
          const zoom = state.viewport.zoom;
          
          // 计算节点中心在 Local 坐标系的位置
          const nodeCenterX = node.x + size.width / 2;
          const nodeCenterY = node.y + size.height / 2;
          
          // 公式: ViewportX = ContainerCenter - NodeCenter * Zoom
          // 解释: 视口偏移量 + 节点在视口的渲染位置 = 容器中心
          set({
            viewport: {
              ...state.viewport,
              x: containerW / 2 - nodeCenterX * zoom,
              y: containerH / 2 - nodeCenterY * zoom,
            },
          });
        }
      },

      resetViewport: () => {
        set({ viewport: DEFAULT_VIEWPORT });
      },

      fitToNodes: (containerWidth, containerHeight) => {
        const state = get();
        const canvasId = state.activeCanvasId;
        const canvasNodes = state.nodes.filter((n) => n.canvasId === canvasId);

        if (canvasNodes.length === 0) {
          // 没有节点，重置视口
          set({ viewport: DEFAULT_VIEWPORT });
          return;
        }

        // 计算所有节点的边界框
        const minX = Math.min(...canvasNodes.map((n) => n.x));
        const minY = Math.min(...canvasNodes.map((n) => n.y));
        const nodeWidth = state.viewMode === 'detailed' ? NODE_WIDTH_DETAILED : NODE_WIDTH_SIMPLIFIED;
        const nodeHeight = state.viewMode === 'detailed' ? NODE_HEIGHT_DETAILED : NODE_HEIGHT_SIMPLIFIED;
        const maxX = Math.max(...canvasNodes.map((n) => n.x + nodeWidth));
        const maxY = Math.max(...canvasNodes.map((n) => n.y + nodeHeight));

        // 节点区域尺寸
        const nodesWidth = maxX - minX;
        const nodesHeight = maxY - minY;

        // 计算合适的缩放比例（留 10% 边距）
        const padding = 0.1;
        const availableWidth = containerWidth * (1 - padding * 2);
        const availableHeight = containerHeight * (1 - padding * 2);

        const scaleX = availableWidth / nodesWidth;
        const scaleY = availableHeight / nodesHeight;
        const zoom = Math.min(scaleX, scaleY, 1.5); // 最大 150%

        // 计算居中偏移
        const scaledNodesWidth = nodesWidth * zoom;
        const scaledNodesHeight = nodesHeight * zoom;
        const x = (containerWidth - scaledNodesWidth) / 2 - minX * zoom;
        const y = (containerHeight - scaledNodesHeight) / 2 - minY * zoom;

        set({
          viewport: { x, y, zoom },
        });
      },

      // ========================================
      // 自动布局
      // ========================================
      getNextNodePosition: (parentNodeId) => {
        const state = get();
        const canvasId = state.activeCanvasId;
        const canvasNodes = state.nodes.filter((n) => n.canvasId === canvasId);

        if (canvasNodes.length === 0) {
          return { x: INITIAL_X, y: INITIAL_Y };
        }

        if (parentNodeId) {
          // 有父节点：放在父节点右侧
          const parent = canvasNodes.find((n) => n.id === parentNodeId);
          const nodeWidth = state.viewMode === 'detailed' ? NODE_WIDTH_DETAILED : NODE_WIDTH_SIMPLIFIED;
          const nodeHeight = state.viewMode === 'detailed' ? NODE_HEIGHT_DETAILED : NODE_HEIGHT_SIMPLIFIED;
          if (parent) {
            // 检查右侧是否已有节点
            const siblings = canvasNodes.filter(
              (n) => n.y >= parent.y - nodeHeight && n.y <= parent.y + nodeHeight
            );
            const maxX = Math.max(...siblings.map((n) => n.x));
            return {
              x: maxX + nodeWidth + NODE_GAP_X,
              y: parent.y,
            };
          }
        }

        // 无父节点：瀑布流布局，放在最后一个节点下方
        const lastNode = canvasNodes[canvasNodes.length - 1];
        
        // 检查是否需要换行（超过3个节点一行）
        const nodesInLastRow = canvasNodes.filter(
          (n) => n.y === lastNode.y
        );
        
        if (nodesInLastRow.length >= 3) {
          // 换行
          const nodeHeight = state.viewMode === 'detailed' ? NODE_HEIGHT_DETAILED : NODE_HEIGHT_SIMPLIFIED;
          return {
            x: INITIAL_X,
            y: lastNode.y + nodeHeight + NODE_GAP_Y,
          };
        } else {
          // 同行右侧
          const nodeWidth = state.viewMode === 'detailed' ? NODE_WIDTH_DETAILED : NODE_WIDTH_SIMPLIFIED;
          return {
            x: lastNode.x + nodeWidth + NODE_GAP_X,
            y: lastNode.y,
          };
        }
      },

      // ========================================
      // 视图模式控制
      // ========================================
      setViewMode: (mode) => {
        set({ viewMode: mode });
      },

      autoLayout: () => {
        const state = get();
        const canvasId = state.activeCanvasId;
        const canvasNodes = state.nodes.filter((n) => n.canvasId === canvasId);
        if (canvasNodes.length === 0) return;

        // 复制节点位置用于计算
        const positions = canvasNodes.map(n => ({
          id: n.id,
          x: n.x,
          y: n.y,
          ...getLayoutSize(n.type, state.viewMode)
        }));

        // ========================================
        // 迭代碰撞解算 (Iterative Collision Resolution)
        // 设计: 推开重叠的节点，保留相对位置
        // ========================================
        
        // 动态迭代次数：节点多时减少迭代，防止 UI 卡顿
        // N=50 → 150轮, N=100 → 75轮, N=200 → 38轮
        const nodeCount = positions.length;
        const ITERATIONS = Math.max(30, Math.round(150 * Math.min(1, 50 / nodeCount)));
        const PADDING = 80;
        
        // 边界防护： dx/dy 过小时设置最小值防止除零或无限循环
        const MIN_DELTA = 0.1;

        for (let i = 0; i < ITERATIONS; i++) {
          let hasOverlap = false;

          for (let a = 0; a < positions.length; a++) {
            for (let b = a + 1; b < positions.length; b++) {
              const nodeA = positions[a];
              const nodeB = positions[b];

              // 计算中心点
              const centerA = { x: nodeA.x + nodeA.width / 2, y: nodeA.y + nodeA.height / 2 };
              const centerB = { x: nodeB.x + nodeB.width / 2, y: nodeB.y + nodeB.height / 2 };

              // 计算差异（防护极小值）
              let dx = centerB.x - centerA.x;
              let dy = centerB.y - centerA.y;
              if (Math.abs(dx) < MIN_DELTA) dx = MIN_DELTA * (dx >= 0 ? 1 : -1);
              if (Math.abs(dy) < MIN_DELTA) dy = MIN_DELTA * (dy >= 0 ? 1 : -1);
              
              // 最小分离距离
              const minDistX = (nodeA.width + nodeB.width) / 2 + PADDING;
              const minDistY = (nodeA.height + nodeB.height) / 2 + PADDING;

              if (Math.abs(dx) < minDistX && Math.abs(dy) < minDistY) {
                hasOverlap = true;

                // 计算重叠深度
                const overlapX = minDistX - Math.abs(dx);
                const overlapY = minDistY - Math.abs(dy);

                // 按重叠较小的轴分离
                if (overlapX < overlapY) {
                  const sign = dx > 0 ? 1 : -1;
                  const adjust = (overlapX / 2) * sign;
                  nodeA.x -= adjust;
                  nodeB.x += adjust;
                } else {
                  const sign = dy > 0 ? 1 : -1;
                  const adjust = (overlapY / 2) * sign;
                  nodeA.y -= adjust;
                  nodeB.y += adjust;
                }
              }
            }
          }

          if (!hasOverlap) break;
        }

        // 更新 Store
        const updatedNodes = state.nodes.map((n) => {
          const newPos = positions.find((p) => p.id === n.id);
          if (newPos) {
            return { ...n, x: newPos.x, y: newPos.y };
          }
          return n;
        });

        set({ nodes: updatedNodes });
      },

      // ========================================
      // 工作流辅助
      // ========================================
      addWorkflowNode: (type, title, summary, parentNodeId, meta) => {
        const state = get();
        const canvasId = state.activeCanvasId || defaultCanvasId;
        const position = state.getNextNodePosition(parentNodeId);
        const nodeCount = state.nodes.filter((n) => n.canvasId === canvasId).length;

        const node = state.addNode({
          canvasId,
          type,
          title,
          summary,
          x: position.x,
          y: position.y,
          status: 'running',
          animationDelay: nodeCount * 150,  // 交错动画
          expandable: true,
          meta: {
            ...meta,
            createdAt: new Date().toISOString(),
          },
        });

        // 自动连接到父节点
        if (parentNodeId) {
          state.addEdge({
            fromNodeId: parentNodeId,
            toNodeId: node.id,
            animated: true,
          });
        }

        return node;
      },
    }),
    {
      name: 'marketing-agent-canvas-storage',
      // P1 修复: 限制持久化的节点/边数量，防止 localStorage 超限
      partialize: (state) => {
        // 最多保留最近的 200 个节点和 300 条边
        const MAX_NODES = 200;
        const MAX_EDGES = 300;
        
        const limitedNodes = state.nodes.length > MAX_NODES 
          ? state.nodes.slice(-MAX_NODES) // 保留最新的节点
          : state.nodes;
          
        const limitedNodeIds = new Set(limitedNodes.map(n => n.id));
        const limitedEdges = state.edges
          .filter(e => limitedNodeIds.has(e.fromNodeId) && limitedNodeIds.has(e.toNodeId))
          .slice(-MAX_EDGES);
        
        return {
          canvases: state.canvases,
          nodes: limitedNodes,
          edges: limitedEdges,
          activeCanvasId: state.activeCanvasId,
          viewMode: state.viewMode,
        };
      },
      // P1 修复: 自定义 storage 处理 QuotaExceededError
      storage: {
        getItem: (name) => {
          try {
            const value = localStorage.getItem(name);
            return value ? JSON.parse(value) : null;
          } catch {
            console.warn('[canvas-store] Failed to read from localStorage');
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, JSON.stringify(value));
          } catch (error) {
            // QuotaExceededError 处理：清空旧数据重试
            if (error instanceof DOMException && error.name === 'QuotaExceededError') {
              console.warn('[canvas-store] localStorage quota exceeded, clearing old data');
              localStorage.removeItem(name);
              try {
                localStorage.setItem(name, JSON.stringify(value));
              } catch {
                console.error('[canvas-store] Failed to save even after clearing');
              }
            }
          }
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);

