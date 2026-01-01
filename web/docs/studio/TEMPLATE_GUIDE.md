# UI 套件模板编辑指南

> 本文档指导如何添加、修改和使用风格模板与品类模板。

---

## 文件位置

| 文件                          | 用途                     |
| ----------------------------- | ------------------------ |
| `lib/data/style-templates.ts` | 风格模板（视觉风格 DNA） |
| `lib/data/genre-templates.ts` | 品类模板（游戏类型界面） |

---

## 🎨 添加新风格模板

打开 `lib/data/style-templates.ts`，在 `STYLE_TEMPLATES` 数组中添加：

```typescript
{
  id: 'my-new-style',        // 唯一标识，小写+连字符
  name: '我的新风格',         // 中文名称
  nameEn: 'My New Style',    // 英文名称
  category: '2D',            // 分类: '2D' | '3D' | '像素' | '艺术'

  // 核心提示词 (最重要!)
  basePrompt: '描述风格的核心视觉特征，如：明亮色彩、圆润造型、柔和阴影',
  negativePrompt: '要排除的元素，如：暗色、恐怖、写实',

  // 风格关键词 (用于标签显示)
  keywords: ['关键词1', '关键词2', '关键词3'],

  // 色板 (用于预览)
  colorPalette: ['#FF6B9D', '#FFB347', '#87CEEB', '#98FB98'],

  // 渐变色 (Mock 预览用)
  coverGradient: 'from-pink-400 via-rose-300 to-orange-300',
}
```

### 提示词编写技巧

| 字段             | 建议                           |
| ---------------- | ------------------------------ |
| `basePrompt`     | 描述整体视觉风格，避免具体内容 |
| `negativePrompt` | 列出与风格冲突的元素           |
| `keywords`       | 3-4 个核心词，用于 UI 展示     |

---

## 🎮 添加新品类模板

打开 `lib/data/genre-templates.ts`，在 `GENRE_TEMPLATES` 数组中添加：

```typescript
{
  id: 'my-new-genre',
  name: '我的新品类',
  nameEn: 'My New Genre',
  icon: 'Gamepad2',           // Lucide 图标名称
  description: '简短的品类描述',
  screens: [
    // 核心玩法界面 (isCore: true)
    {
      id: 'my-core-screen',
      name: '核心界面1',
      description: '界面功能描述',
      aspectRatio: '9:16',     // '16:9' | '9:16' | '1:1'
      promptTemplate: '界面描述，{style} 是风格占位符',
      isCore: true,            // 核心界面在 Phase 1 预览
    },
    // 通用界面可直接复用
    ...COMMON_SCREENS,
  ],
}
```

### 界面提示词模板

```
游戏[界面类型]，{style}，包含[元素1]、[元素2]，[布局描述]
```

**示例：**

```
三消游戏主界面，{style}，8x8消除元素网格，顶部分数和步数显示，底部道具栏
```

---

## 📋 复用通用界面

`COMMON_SCREENS` 包含 6 个通用界面，可直接引用：

- `main-menu` - 主菜单
- `settings` - 设置
- `loading` - 加载
- `character-select` - 角色选择
- `shop` - 商店
- `result` - 结算

**用法：**

```typescript
screens: [
  { ...你的核心界面 },
  ...COMMON_SCREENS, // 全部引用
  ...COMMON_SCREENS.filter((s) => s.id !== "shop"), // 排除部分
];
```

---

## ✅ 验证更改

1. 保存文件后刷新页面
2. 访问 `/studio/kit` 检查新风格/品类是否显示
3. 运行 `npm run build` 确保无类型错误

---

## 常见问题

| 问题         | 解决方案                          |
| ------------ | --------------------------------- |
| 新风格不显示 | 检查 `id` 是否唯一                |
| 类型报错     | 检查 `category` 是否为指定值      |
| 图标不显示   | 确认图标名在 `GENRE_ICONS` 映射中 |
