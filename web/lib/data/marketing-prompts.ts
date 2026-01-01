// ========================================
// Marketing 专用 Prompt 模板
// 侧重: 实机美宣、高品质宣传图
// ========================================

/**
 * 游戏美宣素材 Prompt 模板
 * 风格关键词: 实机演示, 高品质渲染, 动态构图
 */
export const MARKETING_PROMPT_TEMPLATES = {
  // 1. 游戏封面图 (1:1 正方形)
  gameCover: {
    basePrompt: (gameName: string, style: string) => `
      ${gameName} 游戏封面设计，${style}风格，
      核心玩法实机画面截图，高品质3D渲染，
      醒目的游戏Logo位置，充满张力的动态构图，
      细节丰富，光影效果极佳，甚至可以看到UI界面元素，
      App Store/Google Play 推荐位品质，
      8k分辨率
    `,
    negativePrompt: '文字模糊，水印，低质量，变形，简单的矢量图，纯色背景，因为是实机截图所以不要虽然是插画但不要太假',
    sizes: ['1:1'],
  },

  // 2. 社交分享卡片 (1:1 正方形，侧重信息传达)
  socialCard: {
    basePrompt: (gameName: string, hook: string) => `
      ${gameName} 社交媒体宣传图，正方形构图，
      画面中心展示游戏最精彩的瞬间（Highlight Moment），
      视觉焦点强调「${hook}」这一核心卖点，
      带有"NEW"或"HOT"的视觉暗示，
      高饱和度色彩，吸引点击，像一条爆款短视频的封面
    `,
    negativePrompt: '杂乱，低对比度，暗淡，构图松散',
    sizes: ['1:1'],
  },

  // 3. 应用商店横幅 (16:9 横图)
  appStoreBanner: {
    basePrompt: (gameName: string, features: string[]) => `
      ${gameName} 游戏横幅广告 (Banner)，16:9 宽屏构图，
      展示宏大的游戏场景或激烈的对战画面，
      体现 ${features.join('、')} 等核心特色，
      右侧预留文字区域，左侧为高精度游戏角色或场景，
      专业游戏推广素材，高转化率视觉设计，电影级光影
    `,
    negativePrompt: '过于花哨，信息过载，文字遮挡主体',
    sizes: ['16:9'],
  },

  // 4. 短视频封面 (9:16 竖图)
  videoCover: {
    basePrompt: (gameName: string, hookStyle: string) => `
      ${gameName} 抖音/TikTok 风格短视频封面，9:16 竖版全屏，
      ${hookStyle}风格的视觉冲击力，
      看起来像是手机录屏的实机演示，但画质经过增强，
      顶部或中部可能有醒目的特效文字占位（但不生成具体文字），
      高对比度，色彩鲜艳，第一眼就能抓住用户注意力
    `,
    negativePrompt: '横版构图，黑边，模糊，无聊的UI',
    sizes: ['9:16'],
  },

  // 5. 实机玩法截图 (16:9 横图)
  gameplayScreenshot: {
    basePrompt: (gameName: string, style?: string) => {
      // 随机酷炫玩法风格
      const coolStyles = [
        "史诗级Boss战，满屏华丽特效，粒子爆炸",
        "高难度的极限跑酷操作瞬间，动态模糊",
        "多人同屏PVP激战，技能乱飞，各色光效交织",
        "超精细的家园建造全景，光影温馨，细节满满",
        "爽快的割草战斗体验，成群结队的敌人被击飞"
      ];
      const selectedStyle = style || coolStyles[Math.floor(Math.random() * coolStyles.length)];
      
      return `
        ${gameName} 游戏实机截图，9：16 竖屏，
        展示核心玩法：${selectedStyle}，
        真实的游戏UI界面布局（血条、技能图标、小地图），
        画面清晰锐利，色彩饱满，看起来非常好玩，
        沉浸感极强，像是 病毒营销的宣传截图
      `;
    },
    negativePrompt: '低分辨率，模糊，UI错位，穿模，简单的矢量图',
    sizes: ['9:16'],
  },

  // 6. 主角设定图 (1:1) - 作为 Reference
  characterSheet: {
    basePrompt: (gameName: string, style: string) => `
      ${gameName} 游戏主角设定图，${style}，
      角色三视图（正面、侧面、背面），
      极高质量的角色设计，细节丰富，
      纯色背景，用于作为角色一致性参考，
      大师级原画，8k分辨率
    `,
    negativePrompt: '模糊，多余的背景，复杂的场景，低质量',
    sizes: ['1:1'],
  },
};
