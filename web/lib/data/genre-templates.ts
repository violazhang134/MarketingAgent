// ========================================
// 品类模板数据
// 职责: 定义 5 种小游戏品类的完整 UI 界面提示词
// ========================================

export interface UIScreen {
  id: string;
  name: string;
  description: string;
  aspectRatio: '16:9' | '9:16' | '1:1';
  promptTemplate: string;
  isCore: boolean;
}

export interface GenreTemplate {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  description: string;
  screens: UIScreen[];
}

// ========================================
// 通用界面 (所有品类共享)
// ========================================
export const COMMON_SCREENS: UIScreen[] = [
  {
    id: 'main-menu',
    name: '主菜单',
    description: 'Logo + 开始游戏、设置、退出按钮',
    aspectRatio: '9:16',
    promptTemplate: '手机游戏主菜单界面设计，{style}，顶部居中显示精美游戏Logo，中央区域排列开始游戏、继续游戏、设置、退出按钮，按钮设计精致有层次感，背景有装饰性元素但不喧宾夺主，整体布局清晰大方，专业游戏UI设计，高品质美术资源',
    isCore: false,
  },
  {
    id: 'settings',
    name: '设置界面',
    description: '音量、音效、语言等选项',
    aspectRatio: '9:16',
    promptTemplate: '手机游戏设置界面设计，{style}，顶部设置标题，音乐音量滑块控件，音效音量滑块控件，震动开关按钮，语言选择下拉菜单，通知设置开关，底部返回按钮，整洁有序的列表布局，清晰的图标标识，专业游戏UI设计',
    isCore: false,
  },
  {
    id: 'loading',
    name: '加载界面',
    description: '加载进度条 + 提示文字',
    aspectRatio: '9:16',
    promptTemplate: '手机游戏加载界面设计，{style}，中央区域游戏Logo或角色形象，底部横向加载进度条，进度百分比数字显示，加载中的趣味提示文字，可选的装饰性动画元素位置，整体视觉吸引力强，专业游戏UI设计',
    isCore: false,
  },
  {
    id: 'character-select',
    name: '角色选择',
    description: '角色卡片展示 + 选择确认',
    aspectRatio: '9:16',
    promptTemplate: '手机游戏角色选择界面设计，{style}，顶部选择你的角色标题，中央区域可滑动的角色卡片展示，每个角色卡片包含角色形象和名称，当前选中角色高亮边框效果，角色属性数值展示区域，底部确认选择按钮，解锁条件提示，专业游戏UI设计',
    isCore: false,
  },
  {
    id: 'shop',
    name: '商店界面',
    description: '商品卡片 + 货币显示 + 购买按钮',
    aspectRatio: '9:16',
    promptTemplate: '手机游戏商店界面设计，{style}，顶部商店标题和货币余额显示区（金币钻石图标），分类标签栏（道具/皮肤/礼包），商品卡片网格布局，每个卡片显示商品图片价格和购买按钮，特惠商品高亮标记，底部导航返回按钮，专业游戏UI设计',
    isCore: false,
  },
  {
    id: 'result',
    name: '结算界面',
    description: '分数展示 + 奖励 + 继续按钮',
    aspectRatio: '9:16',
    promptTemplate: '手机游戏关卡结算界面设计，{style}，顶部关卡完成/失败标题，中央大字体分数数字展示，三星评价系统图标，获得奖励列表（金币经验道具），新纪录标记（可选），底部重玩按钮和返回主菜单按钮，分享按钮，专业游戏UI设计',
    isCore: false,
  },
];

// ========================================
// 品类模板定义
// ========================================
export const GENRE_TEMPLATES: GenreTemplate[] = [
  {
    id: 'match3',
    name: '三消游戏',
    nameEn: 'Match-3',
    icon: 'Grid3X3',
    description: '糖果、宝石等消除类游戏',
    screens: [
      {
        id: 'match3-board',
        name: '游戏棋盘',
        description: '消除元素网格 + 分数 + 步数',
        aspectRatio: '9:16',
        promptTemplate: '三消游戏核心玩法界面设计，{style}，顶部区域显示当前关卡数、目标图标和剩余步数，中央8x8消除元素网格棋盘，每个消除元素设计精美（宝石/糖果/水果），棋盘背景有装饰边框，底部显示特殊道具技能按钮栏，当前分数显示，暂停按钮，专业三消游戏UI设计',
        isCore: true,
      },
      {
        id: 'match3-powerups',
        name: '道具界面',
        description: '特殊道具展示和使用',
        aspectRatio: '9:16',
        promptTemplate: '三消游戏道具选择界面设计，{style}，展示各种特殊道具图标（锤子/炸弹/彩虹糖/换位道具），每个道具卡片显示图标名称和剩余数量，道具效果说明文字，购买更多道具入口按钮，道具使用确认弹窗预留，底部返回游戏按钮，专业游戏UI设计',
        isCore: true,
      },
      {
        id: 'match3-level-select',
        name: '关卡选择',
        description: '关卡地图 + 进度',
        aspectRatio: '9:16',
        promptTemplate: '三消游戏关卡选择地图界面设计，{style}，可滚动的章节地图背景，关卡节点按路径排列，已通关关卡显示星级评价，当前关卡高亮发光效果，未解锁关卡显示锁定图标，BOSS关卡特殊标记，章节主题装饰元素，顶部显示总星数和进度，专业游戏UI设计',
        isCore: false,
      },
      ...COMMON_SCREENS,
    ],
  },
  {
    id: 'runner',
    name: '跑酷游戏',
    nameEn: 'Endless Runner',
    icon: 'Zap',
    description: '无尽跑酷、躲避障碍类游戏',
    screens: [
      {
        id: 'runner-hud',
        name: '跑道 HUD',
        description: '分数、距离、金币实时显示',
        aspectRatio: '9:16',
        promptTemplate: '跑酷游戏核心玩法HUD界面设计，{style}，顶部左侧当前分数数字显示，顶部右侧收集金币数量显示（金币图标+数字），跑动距离米数显示，暂停按钮图标，技能槽或能量条，倍数奖励显示区域，磁铁/护盾等buff状态图标区，整体UI透明度适中不遮挡游戏画面，专业游戏HUD设计',
        isCore: true,
      },
      {
        id: 'runner-revive',
        name: '复活界面',
        description: '复活选项 + 倒计时',
        aspectRatio: '9:16',
        promptTemplate: '跑酷游戏死亡复活界面设计，{style}，中央显示Game Over或复活提示，本次跑动距离和得分展示，复活倒计时圆环动画（5秒），观看广告免费复活按钮（附带视频图标），使用钻石复活按钮和价格，放弃本次直接结算按钮，最高纪录对比显示，专业游戏UI设计',
        isCore: true,
      },
      {
        id: 'runner-character',
        name: '角色选择',
        description: '跑酷角色展示',
        aspectRatio: '9:16',
        promptTemplate: '跑酷游戏角色选择界面设计，{style}，中央3D角色展示区可左右滑动切换，角色名称显示，角色属性数值（速度/磁力/倍数），角色解锁条件或价格，已拥有标记，角色碎片收集进度条，底部选择确认按钮和返回按钮，皮肤切换标签页，专业游戏UI设计',
        isCore: false,
      },
      ...COMMON_SCREENS.filter(s => s.id !== 'character-select'),
    ],
  },
  {
    id: 'tower-defense',
    name: '塔防游戏',
    nameEn: 'Tower Defense',
    icon: 'Castle',
    description: '建造防御塔、抵御敌人',
    screens: [
      {
        id: 'td-battlefield',
        name: '战场 HUD',
        description: '地图 + 敌人路径 + 资源',
        aspectRatio: '16:9',
        promptTemplate: '塔防游戏战场HUD界面设计（横屏），{style}，俯视角战场地图背景，清晰可见的敌人行进路径，可放置防御塔的位置标记，顶部显示当前波数/总波数，基地生命值血条，金币资源数量，右侧或底部防御塔快捷建造按钮栏，暂停和倍速按钮，专业塔防游戏UI设计',
        isCore: true,
      },
      {
        id: 'td-build-menu',
        name: '建造菜单',
        description: '可建造的塔类型',
        aspectRatio: '16:9',
        promptTemplate: '塔防游戏建造选择菜单设计（横屏），{style}，圆形或扇形展开的塔选择菜单，每种塔显示图标和建造金币花费，塔类型包括箭塔/炮塔/魔法塔/减速塔/AOE塔，未解锁塔灰色锁定状态，选中塔高亮效果和攻击范围预览提示，取消建造按钮，专业游戏UI设计',
        isCore: true,
      },
      {
        id: 'td-upgrade',
        name: '升级界面',
        description: '塔升级选项',
        aspectRatio: '9:16',
        promptTemplate: '塔防游戏防御塔升级界面设计，{style}，选中塔的3D或2D形象展示，当前属性面板（攻击力/攻速/范围），升级按钮和所需金币，升级后属性提升预览（绿色箭头数字），升级路径分支选择（如有），出售塔按钮和返还金币数，关闭按钮，专业游戏UI设计',
        isCore: false,
      },
      ...COMMON_SCREENS,
    ],
  },
  {
    id: 'puzzle',
    name: '休闲解谜',
    nameEn: 'Casual Puzzle',
    icon: 'Puzzle',
    description: '益智解谜、烧脑游戏',
    screens: [
      {
        id: 'puzzle-area',
        name: '谜题区',
        description: '核心解谜区域',
        aspectRatio: '9:16',
        promptTemplate: '休闲解谜游戏核心玩法界面设计，{style}，顶部当前关卡数和步数/时间限制显示，中央主要谜题交互区域（留白设计便于放置具体谜题），操作提示区域，底部功能按钮栏（撤销/重置/提示），暂停和设置按钮，干净简洁的整体布局突出谜题本身，专业解谜游戏UI设计',
        isCore: true,
      },
      {
        id: 'puzzle-hints',
        name: '提示系统',
        description: '提示和帮助系统',
        aspectRatio: '9:16',
        promptTemplate: '休闲解谜游戏提示系统界面设计，{style}，提示灯泡图标动画，当前可用提示次数显示，使用提示按钮，获取更多提示方式（观看广告/购买），提示等级选择（小提示/大提示/答案），提示内容展示区域，关闭按钮，专业游戏UI设计',
        isCore: true,
      },
      {
        id: 'puzzle-levels',
        name: '关卡选择',
        description: '章节和关卡',
        aspectRatio: '9:16',
        promptTemplate: '休闲解谜游戏关卡选择界面设计，{style}，章节主题标题和图标，关卡网格布局排列，每个关卡格显示关卡号，已通关关卡显示星级评价和完成标记，当前可玩关卡高亮，锁定关卡灰色显示，总进度统计，章节切换箭头，专业游戏UI设计',
        isCore: false,
      },
      ...COMMON_SCREENS,
    ],
  },
  {
    id: 'merge',
    name: '合成游戏',
    nameEn: 'Merge Game',
    icon: 'Combine',
    description: '物品合成、升级进化类',
    screens: [
      {
        id: 'merge-board',
        name: '合成区',
        description: '物品放置和合成区域',
        aspectRatio: '9:16',
        promptTemplate: '合成游戏核心玩法界面设计，{style}，中央网格式物品放置区（5x7或类似），每个格子可放置可合成物品，相同物品拖拽合成提示箭头和光效，物品生成器位置，顶部金币和能量资源显示，订单快捷入口按钮，底部垃圾桶删除区，商店入口，专业合成游戏UI设计',
        isCore: true,
      },
      {
        id: 'merge-inventory',
        name: '图鉴收集',
        description: '已拥有物品展示',
        aspectRatio: '9:16',
        promptTemplate: '合成游戏物品图鉴界面设计，{style}，分类标签栏（全部/植物/动物/建筑等），网格展示所有可收集物品，已获得物品彩色显示，未获得物品灰色剪影，收集进度百分比和奖励，物品等级链展示（低级→高级演进），点击物品查看详情，专业游戏UI设计',
        isCore: true,
      },
      {
        id: 'merge-orders',
        name: '订单界面',
        description: '任务订单和奖励',
        aspectRatio: '9:16',
        promptTemplate: '合成游戏订单任务界面设计，{style}，订单列表或卡片布局，每个订单显示所需物品图标和数量，订单奖励展示（金币/钻石/经验），订单倒计时（如有），交付按钮，接取新订单入口，VIP订单特殊标记，完成订单动画反馈区域，专业游戏UI设计',
        isCore: false,
      },
      ...COMMON_SCREENS,
    ],
  },
];

// ========================================
// 辅助函数
// ========================================
export function getGenreById(id: string): GenreTemplate | undefined {
  return GENRE_TEMPLATES.find(g => g.id === id);
}

export function getCoreScreens(genreId: string): UIScreen[] {
  const genre = getGenreById(genreId);
  return genre?.screens.filter(s => s.isCore) ?? [];
}

export function getAllScreens(genreId: string): UIScreen[] {
  const genre = getGenreById(genreId);
  return genre?.screens ?? [];
}

/**
 * 获取去重后的所有界面（合并核心+通用，去除重复id）
 */
export function getUniqueScreens(genreId: string): UIScreen[] {
  const genre = getGenreById(genreId);
  if (!genre) return [];
  
  const seen = new Set<string>();
  return genre.screens.filter(s => {
    if (seen.has(s.id)) return false;
    seen.add(s.id);
    return true;
  });
}
