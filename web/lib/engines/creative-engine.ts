// ========================================
// 素材生成引擎
// 职责: 基于产品信息和策略配置生成广告素材
// ========================================

import { ProductProfile, VideoScript, GeneratedAssets, CreativeStrategy, ExperimentConfig, ExperimentPack, ExperimentArm } from './creative-store';

// ========================================
// Hook 模板库
// ========================================
const HOOK_TEMPLATES = {
  challenge: [
    "我打赌你过不了第三关",
    "只有 1% 的人能通关",
    "这个游戏让我玩到凌晨三点",
    "警告：这游戏会让你上瘾",
    "你能比我玩得更好吗？",
  ],
  suspense: [
    "你不会相信接下来发生了什么...",
    "等等，这个结局太意外了",
    "我第一次玩就震惊了",
    "千万别在第五关放弃",
    "最后 10 秒才是关键",
  ],
  satisfaction: [
    "这个音效太解压了",
    "看了一个小时停不下来",
    "完美通关的感觉太爽了",
    "每一关都有新惊喜",
    "这才是真正的休闲游戏",
  ],
  contrast: [
    "我妈 vs 我爸玩这个游戏",
    "第一次 vs 第一百次",
    "新手 vs 高手的区别",
    "我以为很简单，结果...",
    "期望 vs 现实",
  ],
};

const CTA_TEMPLATES = {
  soft: ["试试看", "免费下载", "点击体验"],
  medium: ["立即下载", "马上开玩", "现在就玩"],
  strong: ["立即下载，挑战自己！", "不服来战！", "下载证明你能行！"],
};

// ========================================
// 视频脚本生成
// ========================================
export function generateVideoScripts(
  product: ProductProfile,
  strategy: CreativeStrategy,
  competitorStrategy?: string
): VideoScript[] {
  const hooks = HOOK_TEMPLATES[strategy.hookStyle];
  const ctas = CTA_TEMPLATES[strategy.ctaIntensity];
  
  const scripts: VideoScript[] = [
    {
      id: '1',
      title: `${product.name} - 挑战版 15s`,
      duration: "15s",
      platform: "tiktok",
      hook: hooks[0].replace('这个游戏', product.name),
      cta: ctas[0],
      scenes: [
        { timestamp: "0:00-0:03", visual: `${product.name} 游戏画面，玩家即将失败`, audio: "紧张的背景音乐", text: hooks[0] },
        { timestamp: "0:03-0:08", visual: "快速剪辑：失败 → 重试 → 差一点成功", audio: "节奏加快", text: "就差一点！" },
        { timestamp: "0:08-0:12", visual: "终于通关，满屏特效", audio: "胜利音效", text: "终于过了！" },
        { timestamp: "0:12-0:15", visual: `${product.name} Logo + 下载按钮`, audio: "Voiceover: ${ctas[0]}", text: ctas[0] },
      ],
    },
    {
      id: '2',
      title: `${product.name} - 对比版 30s`,
      duration: "30s",
      platform: "tiktok",
      hook: "我妈 vs 我爸玩这个游戏",
      cta: ctas[1],
      scenes: [
        { timestamp: "0:00-0:03", visual: "分屏：左边'我妈'标签，右边'我爸'标签", audio: "欢快BGM开始", text: "我妈 vs 我爸" },
        { timestamp: "0:03-0:10", visual: "'我妈'轻松通过第一关", audio: "继续BGM", text: "我妈：轻松~" },
        { timestamp: "0:10-0:20", visual: "'我爸'在同一关卡反复失败", audio: "搞笑失败音效", text: "我爸：？？？" },
        { timestamp: "0:20-0:27", visual: "'我妈'已经通关，'我爸'还在挣扎", audio: "BGM高潮", text: "结果出来了..." },
        { timestamp: "0:27-0:30", visual: `${product.name} Logo`, audio: "Voiceover: 你能比我爸强吗？", text: ctas[1] },
      ],
    },
    {
      id: '3',
      title: `${product.name} - 解压版 15s`,
      duration: "15s",
      platform: "meta",
      hook: hooks[2],
      cta: ctas[2],
      scenes: [
        { timestamp: "0:00-0:03", visual: "ASMR 风格：游戏中最满足的画面", audio: "纯游戏音效，无BGM", text: "" },
        { timestamp: "0:03-0:10", visual: "连续展示 3 个解压瞬间", audio: "放大游戏音效", text: "太解压了..." },
        { timestamp: "0:10-0:15", visual: `下载引导 + ${product.name} 图标`, audio: "轻柔结束", text: ctas[2] },
      ],
    },
  ];
  
  return scripts;
}

// ========================================
// 文案变体生成
// ========================================
export function generateCopyVariants(
  product: ProductProfile,
  strategy: CreativeStrategy
): string[] {
  const hooks = HOOK_TEMPLATES[strategy.hookStyle];
  
  return [
    `${hooks[0]} 🎮 ${product.name} 免费下载`,
    `玩了 ${product.name} 后我：🤯 停不下来了`,
    `${product.name} - ${product.category} 游戏新王者 👑`,
    `朋友推荐的 ${product.name}，果然上头 🔥`,
    `${hooks[1]} #${product.name} #游戏推荐`,
  ];
}

// ========================================
// Hooks 集生成
// ========================================
export function generateHooks(
  product: ProductProfile,
  strategy: CreativeStrategy
): string[] {
  const baseHooks = HOOK_TEMPLATES[strategy.hookStyle];
  
  return [
    ...baseHooks.map(h => h.replace('这个游戏', product.name)),
    `${product.name} 让我废寝忘食`,
    `不敢相信 ${product.name} 是免费的`,
    `${product.name} 治好了我的无聊`,
    `玩 ${product.name} 的快乐你想象不到`,
    `${product.name} 真的太好玩了`,
  ];
}

// ========================================
// 落地页文案生成
// ========================================
export function generateLandingCopy(
  product: ProductProfile,
  strategy: CreativeStrategy
): { headline: string; subhead: string; cta: string; benefits: string[] } {
  return {
    headline: `准备好体验 ${product.name} 了吗？`,
    subhead: "超过 10000+ 玩家已经上瘾，现在就加入他们！",
    cta: "立即开始挑战",
    benefits: [
      "30秒上手，停不下来",
      "解压神作，放松首选",
      "随时随地，即点即玩"
    ]
  };
}

// ========================================
// 分享激励文案生成
// ========================================
export function generateSharingCopy(
  product: ProductProfile,
  strategy: CreativeStrategy
): { title: string; desc: string } {
  return {
    title: `我正在玩 ${product.name}，快来帮我加个油！`,
    desc: "点击链接领取新手大礼包，和我一起挑战高分！"
  };
}

// ========================================
// 完整素材包生成
// ========================================
export function generateCreativeAssets(
  product: ProductProfile,
  strategy: CreativeStrategy,
  competitorInsight?: { strategy: string }
): GeneratedAssets {
  return {
    scripts: generateVideoScripts(product, strategy, competitorInsight?.strategy),
    copyVariants: generateCopyVariants(product, strategy),
    hooks: generateHooks(product, strategy),
    landingCopy: generateLandingCopy(product, strategy),
    sharingCopy: generateSharingCopy(product, strategy),
  };
}

// ========================================
// 实验包生成 (Pillar 2)
// ========================================
export function generateExperimentPack(
  product: ProductProfile,
  config: ExperimentConfig
): ExperimentPack {
  
  // 模拟 Arm 生成
  const arms: [ExperimentArm, ExperimentArm] = [
    {
      id: 'control_group',
      name: '对照组 (Control)',
      config: { coverStyle: 'default', incentiveType: 'none' },
      trackingLink: `https://lnk.bio/${product.name.toLowerCase()}/control?utm_campaign=exp_01_a`
    },
    {
      id: 'variant_group',
      name: '测试组 (Variant)',
      config: { 
        coverStyle: config.variable === 'cover' ? 'suspense' : 'default',
        incentiveType: config.variable === 'incentive' ? 'red_packet' : 'none'
      },
      trackingLink: `https://lnk.bio/${product.name.toLowerCase()}/variant?utm_campaign=exp_01_b`
    }
  ];

  return {
    experimentId: `EXP_${new Date().getTime().toString().slice(-6)}`,
    variable: config.variable,
    arms: arms,
    allocations: [50, 50]
  };
}
