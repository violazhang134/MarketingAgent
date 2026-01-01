// ========================================
// 风格模板数据
// 职责: 定义 8 种视觉风格的完整提示词 DNA
// ========================================

export interface StyleTemplate {
  id: string;
  name: string;
  nameEn: string;
  category: '2D' | '3D' | '像素' | '艺术';
  
  // 核心 DNA
  basePrompt: string;
  negativePrompt: string;
  keywords: string[];
  colorPalette: string[];
  
  // 预览
  coverGradient: string;
}

export const STYLE_TEMPLATES: StyleTemplate[] = [
  {
    id: 'cute-q',
    name: 'Q版可爱',
    nameEn: 'Cute Q-Style',
    category: '2D',
    basePrompt: 'Q版可爱卡通风格游戏UI界面，圆润造型设计，高饱和度明亮色彩，软萌可爱元素，大头身Q版比例，柔和渐变阴影，糖果色配色方案，圆角矩形按钮，可爱图标设计，清晰易读的卡通字体，欢快活泼的整体氛围，精致的UI细节，高品质游戏美术',
    negativePrompt: '写实风格，暗色调，恐怖元素，血腥暴力，复杂繁琐细节，锐利边角，低饱和度，成人向内容，粗糙线条，模糊不清',
    keywords: ['圆润', '高饱和', '软萌', '大头身'],
    colorPalette: ['#FF6B9D', '#FFB347', '#87CEEB', '#98FB98'],
    coverGradient: 'from-pink-400 via-rose-300 to-orange-300',
  },
  {
    id: 'pixel-retro',
    name: '像素复古',
    nameEn: 'Pixel Retro',
    category: '像素',
    basePrompt: '复古像素艺术风格游戏UI界面，经典8-bit游戏机画风，清晰锐利的像素边缘，有限色板调色，怀旧游戏厅氛围，像素化图标和按钮，复古电子游戏字体，CRT扫描线效果可选，Game Boy/FC/SFC经典配色，精确的像素级细节，高对比度色块',
    negativePrompt: '模糊渐变，平滑过渡，写实风格，3D渲染，高分辨率照片，现代扁平设计，过多颜色，抗锯齿效果',
    keywords: ['8-bit', '怀旧', '像素边缘', '有限色板'],
    colorPalette: ['#0F380F', '#306230', '#8BAC0F', '#9BBC0F'],
    coverGradient: 'from-emerald-600 via-green-500 to-lime-400',
  },
  {
    id: 'flat-modern',
    name: '扁平现代',
    nameEn: 'Flat Modern',
    category: '2D',
    basePrompt: '现代扁平化设计游戏UI界面，简洁几何形状，无阴影纯色块，清晰的视觉层次，Material Design风格，明快的品牌配色，简约图标设计，无衬线现代字体，大量留白空间，响应式布局感，专业商务质感，高端简约美学',
    negativePrompt: '渐变阴影，复杂纹理，3D立体效果，写实插画，装饰性花纹，过度设计，拟物化元素，复古风格',
    keywords: ['简洁', '无阴影', '几何', '明快'],
    colorPalette: ['#3498DB', '#E74C3C', '#2ECC71', '#F39C12'],
    coverGradient: 'from-blue-500 via-cyan-400 to-teal-400',
  },
  {
    id: 'cartoon-2d',
    name: '卡通描边',
    nameEn: 'Cartoon 2D',
    category: '2D',
    basePrompt: '活泼卡通描边风格游戏UI界面，粗黑色描边轮廓，明快鲜艳的填充色，夸张有趣的造型，动画片质感，手绘卡通效果，弹性变形元素，漫画风格气泡和特效，有趣的表情图标，活力四射的整体氛围，Disney/Cartoon Network风格',
    negativePrompt: '写实渲染，无描边设计，暗色调，恐怖元素，过于精细的细节，照片级真实感，严肃商务风格',
    keywords: ['描边', '明快', '夸张', '活泼'],
    colorPalette: ['#FF4757', '#2ED573', '#1E90FF', '#FFA502'],
    coverGradient: 'from-red-500 via-orange-400 to-yellow-400',
  },
  {
    id: '3d-casual',
    name: '3D 休闲',
    nameEn: '3D Casual',
    category: '3D',
    basePrompt: '3D休闲游戏风格UI界面，柔和的环境光照，圆润的3D建模，Blender/C4D渲染质感，糖果色光泽材质，可爱的3D图标，柔和的投影效果，塑料玩具般的质感，Supercell游戏风格，温馨舒适的整体氛围，高品质3D游戏美术',
    negativePrompt: '写实照片级渲染，硬边锐角，暗色调，恐怖元素，金属工业质感，过于复杂的场景，低多边形粗糙感',
    keywords: ['柔和光影', '圆角', '休闲', '明亮'],
    colorPalette: ['#A29BFE', '#FD79A8', '#FFEAA7', '#81ECEC'],
    coverGradient: 'from-purple-400 via-pink-400 to-rose-300',
  },
  {
    id: 'cyberpunk',
    name: '赛博朋克',
    nameEn: 'Cyberpunk',
    category: '艺术',
    basePrompt: '赛博朋克科幻风格游戏UI界面，霓虹灯光效果，深色背景基调，高对比度配色，未来科技感设计，全息投影元素，故障艺术效果，电路板纹理，Blade Runner/Cyberpunk 2077风格，发光边缘，科技感字体，HUD界面设计',
    negativePrompt: '自然田园风景，复古怀旧，暖色温馨，可爱卡通，低对比度，模糊柔和，传统古典风格',
    keywords: ['霓虹', '深色', '未来感', '高对比'],
    colorPalette: ['#00F5FF', '#FF00FF', '#0D0D0D', '#FF6B6B'],
    coverGradient: 'from-cyan-500 via-purple-600 to-pink-500',
  },
  {
    id: 'watercolor',
    name: '水彩手绘',
    nameEn: 'Watercolor',
    category: '艺术',
    basePrompt: '水彩手绘艺术风格游戏UI界面，柔和的颜料晕染效果，水彩纸张纹理质感，自然的笔触痕迹，淡雅柔和的色彩，透明叠加的水彩效果，手工艺术感，温暖治愈的氛围，绘本插画风格，诗意浪漫的整体感觉，高品质艺术美术',
    negativePrompt: '3D渲染，像素风格，硬边锐角，高饱和霓虹色，数码冷感，工业科技风，照片级写实',
    keywords: ['晕染', '纸张质感', '手绘', '淡雅'],
    colorPalette: ['#DDA0DD', '#87CEEB', '#F0E68C', '#98FB98'],
    coverGradient: 'from-purple-300 via-sky-300 to-amber-200',
  },
  {
    id: 'minimalist',
    name: '极简主义',
    nameEn: 'Minimalist',
    category: '2D',
    basePrompt: '极简主义设计游戏UI界面，大量留白空间，单色或双色配色方案，几何抽象图形，高级感设计，精确的视觉比例，无多余装饰，呼吸感排版，高端品牌质感，瑞士设计风格，精致的细节处理，less is more设计哲学',
    negativePrompt: '复杂繁琐纹理，多色彩搭配，装饰性元素，过度设计，可爱卡通，渐变效果，3D立体，信息过载',
    keywords: ['留白', '单色', '几何', '高级'],
    colorPalette: ['#1A1A2E', '#FFFFFF', '#E94560', '#16213E'],
    coverGradient: 'from-slate-800 via-gray-700 to-slate-900',
  },
];

// ========================================
// 辅助函数
// ========================================
export function getStyleById(id: string): StyleTemplate | undefined {
  return STYLE_TEMPLATES.find(s => s.id === id);
}

export function getStylesByCategory(category: StyleTemplate['category']): StyleTemplate[] {
  return STYLE_TEMPLATES.filter(s => s.category === category);
}

/**
 * 生成完整提示词
 * @param style 风格模板
 * @param screenPrompt 界面提示词模板
 */
export function generateFullPrompt(style: StyleTemplate, screenPrompt: string): string {
  // 替换 {style} 占位符
  const withStyle = screenPrompt.replace('{style}', style.basePrompt);
  return withStyle;
}

/**
 * 获取负面提示词
 */
export function getNegativePrompt(style: StyleTemplate): string {
  return style.negativePrompt;
}
