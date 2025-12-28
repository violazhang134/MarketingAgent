// ========================================
// Comment Analyzer Engine
// 职责: 分析竞品评论，提取用户痛点和兴奋点
// ========================================

// ========================================
// 类型定义
// ========================================
export interface CommentAnalysis {
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
  };
  
  painPoints: {
    topic: string;
    frequency: number;
    quotes: string[];
  }[];
  
  delightPoints: {
    topic: string;
    frequency: number;
    quotes: string[];
  }[];
  
  competitorMentions: {
    name: string;
    sentiment: 'better' | 'worse' | 'similar';
    context: string;
  }[];
  
  featureRequests: string[];
}

export interface InsightsReport {
  summary: string;
  keyFindings: string[];
  strategySuggestions: string[];
  differentiationOpportunities: string[];
}

// ========================================
// Mock 评论数据
// ========================================
const MOCK_COMMENTS = {
  positive: [
    "画面太精美了，玩起来很舒服",
    "解压神器，下班后放松必备",
    "音效很棒，消除的时候超满足",
    "这游戏让我停不下来",
    "比其他同类游戏好玩多了",
    "关卡设计很有创意",
    "免费玩也很爽，不强制氪金",
  ],
  negative: [
    "广告太多了，体验很差",
    "后面关卡太难了，卡了好久",
    "需要付费才能继续，有点坑",
    "加载速度太慢了",
    "道具太贵了，买不起",
    "玩一会就没命了，要等好久",
    "强制看广告才能复活",
  ],
  neutral: [
    "还行吧，打发时间用",
    "和其他消消乐差不多",
    "偶尔玩玩还可以",
  ],
};

// ========================================
// 分析函数
// ========================================
export function analyzeComments(_competitorName: string): CommentAnalysis {
  // Mock: 返回模拟分析结果
  return {
    sentiment: {
      positive: 62,
      negative: 28,
      neutral: 10,
    },
    painPoints: [
      { 
        topic: "广告太多", 
        frequency: 234, 
        quotes: ["广告太多了，体验很差", "强制看广告才能复活", "每过一关都有广告"]
      },
      { 
        topic: "关卡太难", 
        frequency: 189, 
        quotes: ["后面关卡太难了，卡了好久", "怎么都过不了第50关", "难度曲线太陡"]
      },
      { 
        topic: "需要付费", 
        frequency: 156, 
        quotes: ["需要付费才能继续", "道具太贵了", "不充钱玩不下去"]
      },
      { 
        topic: "加载慢", 
        frequency: 98, 
        quotes: ["加载速度太慢了", "打开要等好久", "经常卡住"]
      },
      { 
        topic: "命数限制", 
        frequency: 87, 
        quotes: ["玩一会就没命了", "要等好久才能继续", "命用完太快"]
      },
    ],
    delightPoints: [
      { 
        topic: "画面精美", 
        frequency: 312, 
        quotes: ["画面太精美了", "色彩搭配很舒服", "视觉效果满分"]
      },
      { 
        topic: "解压放松", 
        frequency: 287, 
        quotes: ["解压神器", "下班后放松必备", "玩起来很舒服"]
      },
      { 
        topic: "音效满足", 
        frequency: 198, 
        quotes: ["音效很棒", "消除的时候超满足", "声音很治愈"]
      },
      { 
        topic: "上瘾好玩", 
        frequency: 176, 
        quotes: ["停不下来", "一玩就是几个小时", "太上头了"]
      },
      { 
        topic: "关卡创意", 
        frequency: 134, 
        quotes: ["关卡设计很有创意", "每关都有新惊喜", "玩法很丰富"]
      },
    ],
    competitorMentions: [
      { name: "Candy Crush", sentiment: "similar", context: "和 Candy Crush 很像，但画面更好" },
      { name: "开心消消乐", sentiment: "better", context: "比开心消消乐好玩多了" },
      { name: "Royal Match", sentiment: "worse", context: "感觉没有 Royal Match 精致" },
    ],
    featureRequests: [
      "希望可以跳过广告",
      "增加更多关卡",
      "希望有无限命模式",
      "加入好友对战功能",
      "希望道具便宜点",
    ],
  };
}

// ========================================
// 洞察报告生成
// ========================================
export function generateInsightsReport(
  analysis: CommentAnalysis,
  competitorName: string,
  _myProductName: string
): InsightsReport {
  const topPain = analysis.painPoints[0]?.topic || "未知";
  const topDelight = analysis.delightPoints[0]?.topic || "未知";
  
  return {
    summary: `基于 ${competitorName} 的 ${analysis.painPoints.reduce((a, b) => a + b.frequency, 0)} 条用户评论分析，发现核心痛点是"${topPain}"，而用户最认可的是"${topDelight}"体验。`,
    
    keyFindings: [
      `${analysis.sentiment.positive}% 的评论为正面，用户整体满意度较高`,
      `"${topPain}"是最大痛点，被提及 ${analysis.painPoints[0]?.frequency} 次`,
      `"${topDelight}"是最大亮点，被提及 ${analysis.delightPoints[0]?.frequency} 次`,
      `用户对广告的抱怨占负面评论的 ${Math.round(analysis.painPoints[0]?.frequency / analysis.painPoints.reduce((a, b) => a + b.frequency, 0) * 100)}%`,
    ],
    
    strategySuggestions: [
      `在广告中强调"无广告干扰"作为差异化卖点`,
      `使用"${topDelight}"作为核心 Hook 方向`,
      `避免在前期设置过高难度，保持"解压"体验`,
      `考虑提供"无限命"模式作为付费点`,
    ],
    
    differentiationOpportunities: [
      `广告策略：竞品广告过多，可主打"清爽无打扰"体验`,
      `难度曲线：竞品后期太难，可设计更平滑的难度递增`,
      `付费模式：竞品付费压力大，可尝试更友好的变现方式`,
      `社交功能：用户有好友对战需求，但竞品未满足`,
    ],
  };
}
