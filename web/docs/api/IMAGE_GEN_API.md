# 图片生成 API 文档

> 本文档描述 MarketingAgent 项目的图片生成 API，基于 302.ai Seedream 服务。

---

## 目录

1. [概述](#概述)
2. [API 端点](#api-端点)
3. [工具模板系统](#工具模板系统)
4. [使用示例](#使用示例)
5. [错误处理](#错误处理)

---

## 概述

项目使用 **302.ai Seedream** 作为图片生成后端，通过 Next.js API Route 代理请求。

### 架构图

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  前端页面       │────▶│ /api/generate-   │────▶│ 302.ai Seedream │
│  (React)        │     │ image/route.ts   │     │ API             │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

### 环境变量

| 变量名           | 说明            | 示例                         |
| ---------------- | --------------- | ---------------------------- |
| `API_302_KEY`    | 302.ai API 密钥 | `sk-xxx...`                  |
| `SEEDREAM_MODEL` | 模型版本 (可选) | `doubao-seedream-4-5-251128` |

---

## API 端点

### POST `/api/generate-image`

生成图片的统一入口，支持文生图和图生图。

#### 请求参数

| 参数             | 类型      | 必填 | 说明                                          |
| ---------------- | --------- | ---- | --------------------------------------------- |
| `prompt`         | `string`  | ✅   | 生成提示词                                    |
| `negativePrompt` | `string`  | ❌   | 负面提示词（排除元素）                        |
| `size`           | `string`  | ❌   | 尺寸: `1K`, `2K`, `4K`, `1:1`, `16:9`, `9:16` |
| `toolId`         | `string`  | ❌   | 工具 ID（用于增强提示词）                     |
| `referenceImage` | `string`  | ❌   | 参考图片 (base64)                             |
| `strength`       | `number`  | ❌   | 参考强度 (0-1)                                |
| `watermark`      | `boolean` | ❌   | 是否添加水印                                  |

#### 响应格式

```json
{
  "success": true,
  "images": ["https://xxx.com/generated-image.png"],
  "model": "doubao-seedream-4-5-251128",
  "usage": {
    "prompt_tokens": 50,
    "total_tokens": 50
  },
  "toolId": "text2img"
}
```

#### 错误响应

```json
{
  "success": false,
  "error": "错误信息"
}
```

---

## 工具模板系统

### 文件位置

```
lib/data/tool-templates.ts
```

### 模板结构

```typescript
interface ToolPromptTemplate {
  id: string; // 工具 ID
  name: string; // 中文名称
  nameEn: string; // 英文名称
  description: string; // 功能描述
  category: "灵感创意" | "局部编辑" | "图像处理";

  basePrompt: string; // 基础提示词模板
  negativePrompt: string; // 负面提示词
  styleEnhancers: Record<string, string>; // 风格增强器

  inputs: ("prompt" | "image" | "mask")[];
  options?: ToolOption[];
}
```

### 支持的工具

| ID          | 名称       | 分类     | 输入类型            |
| ----------- | ---------- | -------- | ------------------- |
| `text2img`  | 一键成稿   | 灵感创意 | prompt              |
| `variation` | 相似图裂变 | 灵感创意 | image               |
| `pixel`     | 像素图转换 | 灵感创意 | image               |
| `detail`    | 丰富细节   | 局部编辑 | image               |
| `refine`    | 局部细化   | 局部编辑 | image, mask         |
| `erase`     | 智能擦除   | 局部编辑 | image, mask         |
| `replace`   | 局部替换   | 局部编辑 | image, mask, prompt |
| `cutout`    | 一键抠图   | 图像处理 | image               |
| `lineart`   | 线稿提取   | 图像处理 | image               |
| `upscale`   | 超清放大   | 图像处理 | image               |
| `outpaint`  | 智能扩图   | 图像处理 | image               |

### 辅助函数

```typescript
// 获取工具模板
import { getToolById, buildPrompt } from "@/lib/data/tool-templates";

const tool = getToolById("text2img");

// 构建完整提示词
const { prompt, negativePrompt } = buildPrompt(tool, userInput, {
  style: "Q版",
  count: "4",
});
```

---

## 使用示例

### 1. 文生图

```typescript
const response = await fetch("/api/generate-image", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    prompt: "可爱的橘猫游戏角色，Q版风格",
    negativePrompt: "写实风格，暗色调",
    size: "2K",
  }),
});

const data = await response.json();
if (data.success) {
  console.log("生成的图片:", data.images[0]);
}
```

### 2. 图生图（使用工具模板）

```typescript
import { getToolById, buildPrompt } from "@/lib/data/tool-templates";

const tool = getToolById("variation");
const { prompt, negativePrompt } = buildPrompt(tool, "", { strength: 50 });

const response = await fetch("/api/generate-image", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    prompt,
    negativePrompt,
    toolId: "variation",
    referenceImage: "data:image/png;base64,...",
    strength: 0.5,
    size: "2K",
  }),
});
```

### 3. 批量生成 (UI Kit)

```typescript
const screens = ["主菜单", "设置界面", "商店"];

for (const screen of screens) {
  const response = await fetch("/api/generate-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: `游戏${screen}界面设计，Q版可爱风格`,
      size: "2K",
    }),
  });

  const data = await response.json();
  // 处理每张生成的图片
}
```

---

## 错误处理

### 常见错误码

| HTTP 状态码 | 错误类型   | 说明                  |
| ----------- | ---------- | --------------------- |
| 400         | 参数错误   | 缺少必填参数          |
| 500         | 服务器错误 | API Key 未配置        |
| 502         | 上游错误   | Seedream API 返回错误 |

### 前端错误处理示例

```typescript
try {
  const response = await fetch('/api/generate-image', { ... });
  const data = await response.json();

  if (!data.success) {
    console.error('生成失败:', data.error);
    // 显示错误提示 UI
    return;
  }

  // 使用生成的图片
  setImageUrl(data.images[0]);
} catch (error) {
  console.error('网络错误:', error);
  // 使用兜底 UI
}
```

---

## 相关文件

| 文件                              | 职责            |
| --------------------------------- | --------------- |
| `app/api/generate-image/route.ts` | API 路由实现    |
| `lib/data/tool-templates.ts`      | 工具提示词模板  |
| `lib/data/style-templates.ts`     | 风格模板数据    |
| `lib/data/genre-templates.ts`     | 品类界面模板    |
| `lib/api/image-gen.ts`            | 客户端 API 封装 |

---

## 更新日志

| 日期       | 版本 | 变更                        |
| ---------- | ---- | --------------------------- |
| 2026-01-01 | 1.0  | 初始版本，接入 Seedream API |
| 2026-01-01 | 1.1  | 添加 11 个工具模板支持      |
