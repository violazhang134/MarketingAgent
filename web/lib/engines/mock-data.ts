// ========================================
// Mock 数据集合
// 职责: 集中管理所有模拟数据，便于后期替换为真实 API
// ========================================

// ========================================
// 广告库数据
// ========================================
export const MOCK_ADS = [
  { id: 1, status: 'Active' as const, copy: "Stop scrolling. Start learning a language for FREE!", platform: 'meta' as const, impressions: '12.3K' },
  { id: 2, status: 'Active' as const, copy: "Duolingo - 5 mins a day is all you need!", platform: 'tiktok' as const, impressions: '8.7K' },
  { id: 3, status: 'Paused' as const, copy: "Join 500M learners worldwide 🌍", platform: 'meta' as const, impressions: '4.2K' },
  { id: 4, status: 'Active' as const, copy: "The app that makes learning addictive", platform: 'google' as const, impressions: '15.1K' },
];

// ========================================
// Hooks 数据
// ========================================
export const MOCK_HOOKS = [
  { text: "Stop scrolling.", ads: 12, insight: "直接命令式短语，制造紧迫感，常用于抓取即时注意力。" },
  { text: "Learn a language for free with fun lessons!", ads: 10, insight: "结合'免费'奖励与'趣味'承诺，激发用户好奇心。" },
  { text: "I bet you can't pass level 5.", ads: 8, insight: "挑战式 Hook，利用用户的竞争心理驱动点击。" },
  { text: "Only 1% of people can solve this.", ads: 6, insight: "稀缺性+挑战，让用户想证明自己属于那 1%。" },
  { text: "Why is this so hard?!", ads: 5, insight: "挫败感共鸣，吸引用户想知道答案。" },
];

// ========================================
// CTA 数据
// ========================================
export const MOCK_CTAS = [
  { text: "Download Now", uses: 24 },
  { text: "Try it Free", uses: 18 },
  { text: "Start Learning", uses: 12 },
  { text: "Play Now", uses: 9 },
];

// ========================================
// YouTube & TikTok 趋势数据
// ========================================
export const MOCK_TRENDS = {
  youtube: {
    trending: [
      { title: "I played this game for 100 hours...", views: "2.3M", channel: "@GamingPro", date: "3 days ago" },
      { title: "This puzzle game broke my brain", views: "1.8M", channel: "@CasualGamer", date: "1 week ago" },
      { title: "ASMR Gaming - Most Satisfying Moments", views: "956K", channel: "@ASMRGaming", date: "5 days ago" },
    ],
    hashtags: ["#gaming", "#mobilegame", "#puzzle", "#satisfying", "#challenge"],
    contentTypes: [
      { type: "Gameplay", percent: 42 },
      { type: "Review", percent: 28 },
      { type: "Tutorial", percent: 18 },
      { type: "ASMR", percent: 12 },
    ],
  },
  tiktok: {
    trending: [
      { title: "POV: 你玩这个游戏的第一天 vs 第100天", views: "5.2M", creator: "@游戏达人", likes: "234K" },
      { title: "这个游戏让我通宵了三天", views: "3.8M", creator: "@小游戏推荐", likes: "189K" },
      { title: "只有1%的人能过关", views: "2.1M", creator: "@挑战王", likes: "156K" },
    ],
    sounds: [
      { name: "Oh No - Kreepa", uses: "1.2M" },
      { name: "Monkeys Spinning", uses: "890K" },
      { name: "Aesthetic Gaming BGM", uses: "567K" },
    ],
    hashtags: ["#游戏", "#小游戏", "#挑战", "#上头", "#fyp", "#viral"],
  },
};

// ========================================
// 流量分析数据
// ========================================
export const MOCK_TRAFFIC = {
  overview: [
    { label: 'Total Visits', value: '2.4M', change: '+12.3%' },
    { label: 'Avg. Duration', value: '4:32', change: '+8.1%' },
    { label: 'Bounce Rate', value: '42.1%', change: '-3.2%' },
    { label: 'Pages/Visit', value: '3.8', change: '+5.7%' },
  ],
  sources: [
    { source: 'Direct', percent: 35, color: 'bg-indigo-500' },
    { source: 'Search', percent: 28, color: 'bg-green-500' },
    { source: 'Social', percent: 22, color: 'bg-pink-500' },
    { source: 'Referral', percent: 10, color: 'bg-amber-500' },
    { source: 'Email', percent: 5, color: 'bg-cyan-500' },
  ],
  referringSites: [
    { site: 'facebook.com', visits: '234K', share: '18.2%' },
    { site: 'youtube.com', visits: '189K', share: '14.7%' },
    { site: 'tiktok.com', visits: '156K', share: '12.1%' },
    { site: 'twitter.com', visits: '98K', share: '7.6%' },
    { site: 'reddit.com', visits: '67K', share: '5.2%' },
  ],
  socialMedia: [
    { platform: 'Facebook', share: 32, icon: '📘' },
    { platform: 'YouTube', share: 28, icon: '📺' },
    { platform: 'TikTok', share: 24, icon: '🎵' },
    { platform: 'Twitter', share: 10, icon: '🐦' },
    { platform: 'Instagram', share: 6, icon: '📷' },
  ],
  backlinks: [
    { label: 'Total Backlinks', value: '1.2M', icon: '🔗' },
    { label: 'Referring Domains', value: '8.4K', icon: '🌐' },
    { label: 'Domain Authority', value: '78', icon: '📊' },
    { label: 'Dofollow Links', value: '892K', icon: '✅' },
  ],
};

// ========================================
// 类型导出
// ========================================
export type AdItem = typeof MOCK_ADS[number];
export type HookItem = typeof MOCK_HOOKS[number];
export type CTAItem = typeof MOCK_CTAS[number];
