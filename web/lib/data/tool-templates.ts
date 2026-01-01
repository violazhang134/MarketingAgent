// ========================================
// 工具提示词模板
// 职责: 为每个创作工具定义专业提示词 DNA
// ========================================

// ========================================
// 类型定义
// ========================================
export interface ToolPromptTemplate {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  category: '灵感创意' | '局部编辑' | '图像处理';
  
  // 提示词 DNA
  basePrompt: string;           // 核心提示词模板，{input} 为用户输入占位
  negativePrompt: string;       // 负面提示词
  styleEnhancers: Record<string, string>;  // 风格增强映射
  
  // 配置
  inputs: ('prompt' | 'image' | 'mask')[];
  options?: ToolOption[];
}

export interface ToolOption {
  id: string;
  label: string;
  type: 'select' | 'slider';
  options?: string[];
  min?: number;
  max?: number;
  default: string | number;
}

// ========================================
// 工具模板数据
// ========================================
export const TOOL_TEMPLATES: ToolPromptTemplate[] = [
  // ==================== 灵感创意 ====================
  {
    id: 'text2img',
    name: '一键成稿',
    nameEn: 'Text to Image',
    description: '文生图、图生图工作流',
    category: '灵感创意',
    basePrompt: '{input}，游戏美术素材，高品质渲染，专业游戏UI/角色/道具设计',
    negativePrompt: '低质量，模糊，变形，水印，文字，丑陋',
    styleEnhancers: {
      'Q版': 'Q版可爱卡通风格，圆润造型设计，高饱和度明亮色彩，软萌可爱元素，大头身Q版比例，柔和渐变阴影',
      '二次元': '日系二次元动漫风格，精致立绘，清晰线条描边，赛璐璐上色，动漫角色设计，日本动画质感',
      '3D渲染': '3D卡通渲染风格，Blender/C4D质感，柔和环境光照，塑料玩具般的光泽材质，Supercell游戏风格',
      '像素风': '复古像素艺术风格，8-bit游戏机画风，清晰锐利的像素边缘，有限色板调色，GameBoy/FC经典配色',
      '写实': '写实照片级渲染，逼真材质纹理，专业摄影光线，真实世界参考，高清晰度',
    },
    inputs: ['prompt'],
    options: [
      { id: 'style', label: '风格', type: 'select', options: ['Q版', '二次元', '3D渲染', '像素风', '写实'], default: 'Q版' },
      { id: 'ratio', label: '比例', type: 'select', options: ['1:1', '16:9', '9:16', '4:3'], default: '1:1' },
      { id: 'count', label: '生成数量', type: 'select', options: ['1', '2', '4'], default: '1' },
    ],
  },
  {
    id: 'variation',
    name: '相似图裂变',
    nameEn: 'Image Variation',
    description: '参考生成多种风格相似图',
    category: '灵感创意',
    basePrompt: '基于参考图生成风格变体，保持构图和主体特征，变化艺术风格和色彩表现，游戏美术素材',
    negativePrompt: '完全不同的内容，变形扭曲，低质量',
    styleEnhancers: {
      '轻微': '保持原图95%特征，微调色彩和细节',
      '中等': '保持原图构图，调整风格和色调',
      '强烈': '保持主体，大幅改变艺术风格',
    },
    inputs: ['image'],
    options: [
      { id: 'count', label: '生成数量', type: 'select', options: ['1', '4', '6', '9'], default: '4' },
      { id: 'strength', label: '变化强度', type: 'slider', min: 0, max: 100, default: 50 },
    ],
  },
  {
    id: 'pixel',
    name: '像素图转换',
    nameEn: 'Pixel Art',
    description: '一键转换精准像素图',
    category: '灵感创意',
    basePrompt: '将图片转换为精准像素艺术风格，{size}分辨率，{palette}色板，清晰的像素边缘，复古游戏机画风，8-bit/16-bit风格',
    negativePrompt: '模糊，渐变过渡，高分辨率细节，抗锯齿',
    styleEnhancers: {
      'GameBoy': '4色绿色调，经典GameBoy配色',
      'NES': '54色调色板，红白机经典配色',
      'SNES': '256色调色板，超任丰富色彩',
      '自动': '自动优化色板',
    },
    inputs: ['image'],
    options: [
      { id: 'size', label: '像素尺寸', type: 'select', options: ['16x16', '32x32', '64x64', '128x128'], default: '32x32' },
      { id: 'palette', label: '色板', type: 'select', options: ['自动', 'GameBoy', 'NES', 'SNES'], default: '自动' },
    ],
  },

  // ==================== 局部编辑、成稿提质 ====================
  {
    id: 'detail',
    name: '丰富细节',
    nameEn: 'Enhance Detail',
    description: '高效提升画面细节精度',
    category: '局部编辑',
    basePrompt: '增强图片细节和纹理，提升画面精细度{strength}%，保持原有风格和构图，添加更多微观细节',
    negativePrompt: '模糊，丢失原有特征，过度处理',
    styleEnhancers: {},
    inputs: ['image'],
    options: [
      { id: 'strength', label: '细节强度', type: 'slider', min: 0, max: 100, default: 70 },
    ],
  },
  {
    id: 'refine',
    name: '局部细化',
    nameEn: 'Local Refine',
    description: '指定画面区域进一步细化',
    category: '局部编辑',
    basePrompt: '对选中区域进行精细优化，提升细节质量，保持与周围区域风格统一',
    negativePrompt: '与周围区域不协调，过度处理，边缘明显',
    styleEnhancers: {},
    inputs: ['image', 'mask'],
  },
  {
    id: 'erase',
    name: '智能擦除',
    nameEn: 'Smart Erase',
    description: '去除画面瑕疵或不需要的元素',
    category: '局部编辑',
    basePrompt: '智能移除选中区域的内容，用周围环境自然填充，无缝融合',
    negativePrompt: '明显修复痕迹，不自然过渡，内容残留',
    styleEnhancers: {},
    inputs: ['image', 'mask'],
  },
  {
    id: 'replace',
    name: '局部替换',
    nameEn: 'Local Replace',
    description: '精准替换指定区域内容',
    category: '局部编辑',
    basePrompt: '将选中区域替换为：{input}，保持与周围画面风格和光线一致，自然融合',
    negativePrompt: '风格不统一，光线不协调，边缘生硬',
    styleEnhancers: {},
    inputs: ['image', 'mask', 'prompt'],
  },

  // ==================== 图像处理 ====================
  {
    id: 'cutout',
    name: '一键抠图',
    nameEn: 'Background Remove',
    description: '保持主体完好，一键移除背景',
    category: '图像处理',
    basePrompt: '智能识别并提取图片主体，精准移除背景，保持边缘清晰自然，输出透明背景PNG',
    negativePrompt: '主体残缺，边缘毛糙，背景残留',
    styleEnhancers: {},
    inputs: ['image'],
  },
  {
    id: 'lineart',
    name: '线稿提取',
    nameEn: 'Line Art Extract',
    description: '快速生成高质量线稿',
    category: '图像处理',
    basePrompt: '从图片中提取清晰线稿，线条粗细{thickness}px，纯黑线条白色背景，适合二次创作',
    negativePrompt: '线条模糊，噪点，灰度残留',
    styleEnhancers: {},
    inputs: ['image'],
    options: [
      { id: 'thickness', label: '线条粗细', type: 'slider', min: 1, max: 10, default: 3 },
    ],
  },
  {
    id: 'upscale',
    name: '超清放大',
    nameEn: 'Super Resolution',
    description: '一键提升画质细节，呈现超清效果',
    category: '图像处理',
    basePrompt: '无损放大图片至{scale}倍分辨率，智能补充细节，保持原有风格清晰度，去除噪点和压缩痕迹',
    negativePrompt: '模糊，失真，人工痕迹明显',
    styleEnhancers: {},
    inputs: ['image'],
    options: [
      { id: 'scale', label: '放大倍数', type: 'select', options: ['2x', '4x', '8x'], default: '4x' },
    ],
  },
  {
    id: 'outpaint',
    name: '智能扩图',
    nameEn: 'Outpainting',
    description: '清选择所需要扩展的图片与尺寸',
    category: '图像处理',
    basePrompt: '向{direction}方向扩展画布至{size}倍，AI智能补全扩展区域，保持风格和内容连贯',
    negativePrompt: '扩展区域与原图不协调，明显拼接痕迹，风格突变',
    styleEnhancers: {},
    inputs: ['image'],
    options: [
      { id: 'direction', label: '扩展方向', type: 'select', options: ['上', '下', '左', '右', '全方向'], default: '全方向' },
      { id: 'size', label: '扩展比例', type: 'select', options: ['1.5x', '2x', '3x'], default: '2x' },
    ],
  },
];

// ========================================
// 辅助函数
// ========================================

/** 获取工具模板 */
export function getToolById(id: string): ToolPromptTemplate | undefined {
  return TOOL_TEMPLATES.find(t => t.id === id);
}

/** 按分类获取工具 */
export function getToolsByCategory(category: ToolPromptTemplate['category']): ToolPromptTemplate[] {
  return TOOL_TEMPLATES.filter(t => t.category === category);
}

/** 
 * 构建完整提示词
 * @param tool 工具模板
 * @param userInput 用户输入
 * @param options 用户选择的选项
 */
export function buildPrompt(
  tool: ToolPromptTemplate, 
  userInput: string, 
  options: Record<string, string | number>
): { prompt: string; negativePrompt: string } {
  let prompt = tool.basePrompt;
  
  // 替换用户输入
  prompt = prompt.replace('{input}', userInput);
  
  // 替换选项占位符
  for (const [key, value] of Object.entries(options)) {
    prompt = prompt.replace(`{${key}}`, String(value));
    
    // 如果有风格增强
    if (key === 'style' && tool.styleEnhancers[String(value)]) {
      prompt += `，${tool.styleEnhancers[String(value)]}`;
    }
  }
  
  return {
    prompt,
    negativePrompt: tool.negativePrompt,
  };
}

/** 获取所有分类 */
export function getCategories(): ToolPromptTemplate['category'][] {
  return ['灵感创意', '局部编辑', '图像处理'];
}
