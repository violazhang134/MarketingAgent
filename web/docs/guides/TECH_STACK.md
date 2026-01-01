# 技术栈说明 🛠️

> 本文档列出 Marketing Agent 使用的核心技术栈及选型理由。

---

## 核心框架

| 技术           | 版本   | 用途     | 选型理由                                     |
| -------------- | ------ | -------- | -------------------------------------------- |
| **Next.js**    | 16.1.1 | 全栈框架 | App Router + Server Components，SSR/SSG 支持 |
| **React**      | 19.2.3 | UI 库    | 最新 Concurrent 特性，自动批量更新           |
| **TypeScript** | 5.x    | 类型系统 | 强类型保障，LLM 友好                         |

---

## 状态管理

| 技术        | 版本  | 用途         |
| ----------- | ----- | ------------ |
| **Zustand** | 5.0.9 | 全局状态管理 |

**为什么选 Zustand？**

- 极简 API，无 Provider 包裹
- 支持 `persist` 持久化
- 支持在 Store 外部通过 `getState()` 读取状态
- 与 React 19 兼容良好

---

## 样式方案

| 技术             | 版本 | 用途                   |
| ---------------- | ---- | ---------------------- |
| **Tailwind CSS** | 4.x  | 原子化 CSS             |
| **Vanilla CSS**  | -    | 自定义动画、毛玻璃效果 |

**设计风格：Obsidian Glassmorphism**

- 深色调背景 + 毛玻璃效果
- 高对比度强调色（Indigo、Green、Amber）

---

## 动画库

| 技术              | 版本 | 用途       |
| ----------------- | ---- | ---------- |
| **Framer Motion** | 12.x | 动画与手势 |

**使用场景：**

- 节点入场动画（交错效果）
- Minion 角色移动动画
- 侧边栏展开/收起
- 页面切换过渡

---

## 图标库

| 技术             | 版本    | 用途     |
| ---------------- | ------- | -------- |
| **Lucide React** | 0.562.0 | SVG 图标 |

**常用图标：**

- `Brain` - AI/分析
- `Sparkles` - 创意/特效
- `FlaskRound` - 实验
- `Target` - 目标/策略

---

## AI 集成

| 技术           | 版本   | 用途        |
| -------------- | ------ | ----------- |
| **OpenAI SDK** | 6.15.0 | AI 能力调用 |

**使用方式：**

- Server Actions 中调用
- `.env.local` 配置 API Key

---

## 数据可视化

| 技术         | 版本  | 用途     |
| ------------ | ----- | -------- |
| **Recharts** | 3.6.0 | 图表组件 |

**使用场景：**

- 竞品分析雷达图
- 实验数据对比图
- 转化漏斗图

---

## 开发工具链

| 工具                   | 版本   | 用途             |
| ---------------------- | ------ | ---------------- |
| **ESLint**             | 9.x    | 代码规范检查     |
| **eslint-config-next** | 16.1.1 | Next.js 专用规则 |
| **PostCSS**            | -      | CSS 处理         |

---

## 依赖完整清单

```json
{
  "dependencies": {
    "clsx": "^2.1.1",
    "framer-motion": "^12.23.26",
    "lucide-react": "^0.562.0",
    "next": "16.1.1",
    "openai": "^6.15.0",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "recharts": "^3.6.0",
    "tailwind-merge": "^3.4.0",
    "zustand": "^5.0.9"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "babel-plugin-react-compiler": "1.0.0",
    "eslint": "^9",
    "eslint-config-next": "16.1.1",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

---

## 环境要求

| 依赖    | 最低版本 | 推荐版本 |
| ------- | -------- | -------- |
| Node.js | 18.x     | 20.x+    |
| npm     | 8.x      | 最新     |

---

> "选择成熟的技术栈，把创新留给产品本身。"
