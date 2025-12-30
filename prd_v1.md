# MiniGame Marketing Agent PRD v2.0

> **Product Boundary Definition (The Constitution)**
>
> **We ONLY do 4 things:**
>
> 1.  **Distribution-ready Pack**: Auto-generate launchable assets & sharing structures.
> 2.  **Experiment Runner**: One-click A/B test creation (Explicit Variables).
> 3.  **Data Loop**: Standardized telemetry, attribution, and feedback loop.
> 4.  **Next Best Action**: Data-driven, actionable recommendations (Action, not words).
>
> **Strict Prohibitions (The Anti-Scope):**
> ❌ No Ad Placement/Buying (代投放)
> ❌ No Operations Management (代运营)
> ❌ No ROI Guarantees (承诺 ROI)
> ❌ No Manual Custom Strategy (为单个客户手工定制)
> ❌ No Channel BD (替客户做渠道 BD)

---

## 1. 核心目标：Agent 辅助发行 (AI-Publisher)

**目标**：让不懂增长的开发者在 **30 分钟内** 完成首次发布，并在 **24-72 小时内** 获得明确的“下一步动作”。
**核心承诺**：不是“提供工具让你配置”，而是“我替你跑一轮”。

---

## 2. 目标用户 (Persona)

### Persona A：普通创作者 (The Creator)

- **特征**：有 H5 游戏/作品，不懂投放，不懂数据。
- **痛点**：不知道发什么文案、什么视频结构、怎么看数据。
- **需求**：只关心“有没有人玩”、“要不要继续”。

### Persona B：小团队增长执行 (The Growth Exec)

- **特征**：懂一点增长，但时间稀缺，没空手动配实验。
- **痛点**：手动创建 A/B 测试繁琐，复盘耗时。
- **需求**：快速产出多版本素材，每日决策“砍什么/加什么”。

---

## 3. 四大核心支柱 (The 4 Pillars)

### Pillar 1: Distribution-ready Pack (发布包生成)

**核心价值**：一键生成“可直接发布”的资产，而非“半成品”。

- **输入**：游戏链接/录屏 + 目标 (开玩/留存) + 风格。
- **输出内容 (The Launch Pack)**：
  - **封面/Thumbnails**：基于高转化模板生成的封面图。
  - **标题/Titles**：3-5 条高点击标题 (不同钩子)。
  - **15s 脚本/Scripts**：结构化分镜 (Hook -> Conflict -> Reward -> CTA)。
  - **CTA 文案**：强导向的行动呼吁。
  - **落地页文案/Landing Copy**：首屏承诺 + 预加载提示。
  - **分享激励文案/Sharing Copy**：社交裂变话术。
- **原则**：Template-driven (模板化)，不追求“创意天才”，追求“结构化漏斗”。

### Pillar 2: Experiment Runner (实验运行器)

**核心价值**：强制标准化的 A/B 测试，系统自动配置对照组。

- **机制**：用户必须选择实验变量，Agent 自动生成 _Experiment Pack_。
- **支持变量**：
  - **封面 A/B**：测试 CTR。
  - **激励结构 A/B**：(e.g., 无激励 vs 首局红包)。
  - **入口形式 A/B**：(e.g., 直接开玩 vs 挑战邀请)。
- **自动化**：
  - 自动生成 Tracking IDs。
  - 自动配置流量分配 (Routing)。
  - 自动设定“胜负判定规则” (e.g., N=100 或 24h)。

### Pillar 3: Telemetry & Attribution (数据回环)

**核心价值**：掌控“数据语言”，统一埋点与归因。

- **第一方归因 (First-party Attribution)**：
  - `click_id` / `trace_id` 全链路透传。
  - Smart Link Router：处理流量分发与归因标记。
- **统一遥测 (Telemetry)**：
  - `landing_view` (落地页曝光)
  - `game_start` (开始游戏)
  - `first_interaction` (首次互动 - 关键真指标)
  - `qualified_start` (有效开玩，e.g., >10s)
  - `share_click` (分享点击)
  - `return_visit` (回访)
- **原则**：用户不需要懂 GA/Mixpanel，Agent 内置标准事件定义。

### Pillar 4: Next Best Action (下一步最佳动作)

**核心价值**：基于数据给出“动作”，拒绝“空话”。

- **机制**：Expert System (规则引擎) + Pattern Matching。
- **输出示例**：
  - _场景：高点击 / 低开玩_ -> **Action**: "切换为 '快速加载' 落地页模板"。
  - _场景：高开玩 / 低留存_ -> **Action**: "尝试 '明日登录奖励' 激励配置"。
  - _场景：CTR 低_ -> **Action**: "更换 '悬念类' 封面模板"。
- **Next Loop**：点击 Action 直接生成新一轮的 Pack。

---

## 4. Agent 工作流 (The Workflow)

**循环：Observe → Decide → Act → Learn**

1.  **Observe (观察)**：采集端到端的 Telemetry 数据。
2.  **Decide (决策)**：基于 Pillar 4 (Next Best Action) 判定当前实验状态。
3.  **Act (行动)**：
    - 若实验中：继续跑量 / 自动关停劣质组。
    - 若实验结束：调用 Pillar 1 (Generator) 生成下一轮 Launch Pack。
4.  **Learn (学习)**：将胜出的 Pattern (e.g., "悬念开头在 US 地区有效") 写入 Data Loop 只是库，优化下一次生成。

---

## 5. MVP 功能里程碑 (Roadmap)

### Phase 1: The Foundation (Week 1-2)

- **Pillar 3**: Smart Link Router + SDK (数据底座)。
- **Pillar 1**: 基础 Launch Pack 生成 (文本/脚本 + 链接)。
- **Agent**: 简单的对话式 Onboarding。

### Phase 2: The Logic (Week 3-4)

- **Pillar 2**: 2x2 基础实验支持 (A/B Test Router)。
- **Pillar 4**: 基础规则引擎 (Rule-based Recommendations)。
- **UI**: 简单的 Decision Feed (Winner/Next Action)。

### Phase 3: The Loop (Week 5-8)

- **Data Loop**: 实验结果写回生成参数。
- **Automation**: 点击 "Next Action" 自动触发新一轮生成。
- **History**: 策略卡片 (Playbook) 沉淀。

---

## 6. 关键指标 (Success Metrics)

- **North Star**: **Qualified Start Rate** (有效开玩率)。
- **TTFV (Time to First Value)**: 用户从注册到拿到第一个 Launch Pack ≤ 30 分钟。
- **Autopilot Adoption**: ≥ 60% 的实验由 Agent 自动配置。
- **Actionability**: ≥ 80% 的 Next Best Action 被用户采纳执行。
