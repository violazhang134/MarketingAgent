# AI 助手直连营销功能接口实现方案

> 目标：让 AI 助手像「运营同事」一样，能够**安全、可控、可观测**地直接调用营销功能接口，驱动完整的发行工作流。

---

## 1. 接口分析阶段

本项目当前的「营销能力」主要以 **本地引擎函数** 的形式存在，后续会演进为可远程调用的 HTTP API。这里先把**现有函数级接口**视作「功能接口」，为后续 HTTP 抽象做铺垫。

### 1.1 功能接口清单（现有）

#### 1.1.1 竞品与创意分析相关

- `analyzeCompetitor(gameName: string): AnalysisResult`  
  - 位置：[analysis-engine.ts](file:///Users/violazhang/Downloads/MarketingAgent/web/lib/engines/analysis-engine.ts)
  - 职责：模拟竞品广告策略与创意表现分析
  - 输入：
    - `gameName`: 竞品名称
  - 输出 `AnalysisResult`：
    - `strategy: string` — 竞品主策略标签
    - `hookIntensity: number`
    - `retentionFocus: number`
    - `monetization: number`
    - `topCreatives: { concept; winRate; description }[]`
    - `clonedScripts: { title; scenes[] }[]`
  - 权限要求：无（本地 mock）

- `analyzeVideo(videoId: string): VideoAnalysisResult`  
  - 位置：[analysis-engine.ts](file:///Users/violazhang/Downloads/MarketingAgent/web/lib/engines/analysis-engine.ts)
  - 职责：对视频分帧分析 Hook 与留存（mock）
  - 输入：`videoId: string`
  - 输出：`VideoAnalysisResult`

#### 1.1.2 评论与洞察相关

- `analyzeComments(competitorName: string): CommentAnalysis`  
  - 位置：[comment-analyzer.ts](file:///Users/violazhang/Downloads/MarketingAgent/web/lib/engines/comment-analyzer.ts)
  - 职责：分析竞品评论情绪、痛点、亮点
  - 输出字段：
    - `sentiment`（正/负/中）
    - `painPoints[]`
    - `delightPoints[]`
    - `competitorMentions[]`
    - `featureRequests[]`

- `generateInsightsReport(analysis: CommentAnalysis, competitorName: string, myProductName: string): InsightsReport`  
  - 职责：将评论分析转化为可执行的「策略洞察」
  - 输出字段：
    - `summary`
    - `keyFindings[]`
    - `strategySuggestions[]`
    - `differentiationOpportunities[]`

#### 1.1.3 创意资产与实验包相关

- `generateCreativeAssets(product: ProductProfile, strategy: CreativeStrategy, competitorInsight?: { strategy: string }): GeneratedAssets`  
  - 位置：[creative-engine.ts](file:///Users/violazhang/Downloads/MarketingAgent/web/lib/engines/creative-engine.ts)
  - 输出：
    - `scripts: VideoScript[]`
    - `copyVariants: string[]`
    - `hooks: string[]`
    - `landingCopy`
    - `sharingCopy`

- `generateExperimentPack(product: ProductProfile, config: ExperimentConfig): ExperimentPack`  
  - 职责：生成 A/B 实验配置（对照组 + 测试组 + trackingLink）

#### 1.1.4 Agent 编排入口

- `runResearchFlow(config: ResearchFlowConfig): Promise<ResearchFlowResult>`  
  - 位置：[ai-assistant.ts](file:///Users/violazhang/Downloads/MarketingAgent/web/lib/ai-assistant.ts)
  - 内部串联：
    - `analyzeCompetitor`
    - `analyzeComments`
    - `generateInsightsReport`
    - `generateCreativeAssets`
    - `generateExperimentPack`
  - 输出一个完整的营销决策包：`ResearchFlowResult`

- `sendMessage(sessionId: string, message: string, context?: Record<string, unknown>): Promise<AssistantReply>`  
  - 当前为 mock，自由聊天尚未真正接入 LLM

### 1.2 目标 HTTP API 设计草案（预留给后端 / BFF）

在保持现有函数接口不变的前提下，规划一组面向 AI / 前端的 HTTP API：

- `POST /api/marketing/research-flow`
  - Body：`ResearchFlowConfig`
  - Response：`ResearchFlowResult`

- `POST /api/marketing/competitor-analysis`
  - Body：`{ competitorName: string }`
  - Response：`AnalysisResult`

- `POST /api/marketing/comments-analysis`
  - Body：`{ competitorName: string }`
  - Response：`CommentAnalysis`

- `POST /api/marketing/creative-assets`
  - Body：`{ product: ProductProfile; strategy: CreativeStrategy; competitorStrategy?: string }`
  - Response：`GeneratedAssets`

- `POST /api/marketing/experiment-pack`
  - Body：`{ product: ProductProfile; config: ExperimentConfig }`
  - Response：`ExperimentPack`

> 说明：实际落地时可以先在 Next.js 的 `app/api/marketing/*` 下实现，复用现有引擎函数作为「领域层」，只做一层薄薄的 HTTP 包装。

### 1.3 认证与权限（预设计）

- 与 OpenRouter 的 LLM 调用走 **服务端**，只暴露内部 API，不向浏览器暴露 key。
- 对外暴露的任何营销接口必须具备：
  - `apiKey` / `Bearer token` 校验
  - 调用方身份标记（trace / session / userId）
  - 速率限制（基于 IP + 用户 + 会话）

### 1.4 错误与异常机制（预设计）

- 统一错误响应结构：
  - `code: string`（业务错误码）
  - `message: string`
  - `details?: object`
- 分类：
  - `4xx`：参数/权限问题
  - `5xx`：内部引擎/下游服务异常
- AI 侧需要可机器解析的信息：
  - 可重试错误：如超时、限流
  - 不可重试错误：参数缺失、权限受限

---

## 2. 三层调用架构设计（参考 Claude Code 思路）

目标：在 AI 调用链路中引入 **「工具调用」+「业务编排」+「底层接口」** 的清晰分层，使得：
- AI 只「理解工具说明」，对底层接口细节无感；
- 接口变更时，只改抽象层；业务意图与编排逻辑保持稳定；
- 方便引入审计、限流和安全策略。

整体分为三层：

1. **接口抽象层（API Abstraction Layer）**
2. **业务逻辑层（Business Orchestration Layer）**
3. **执行引擎层（Execution Engine for Tools）**

### 2.1 接口抽象层

**目标**：为营销功能提供统一、可观测、可重试的调用封装，对上层屏蔽 HTTP / SDK 细节。

**建议目录**：

- `web/lib/clients/marketing-api-client.ts`

**核心职责**：

- 暴露「领域方法」而非「HTTP 细节」：
  - `runResearchFlow(config): Promise<ResearchFlowResult>`
  - `getCompetitorAnalysis(name): Promise<AnalysisResult>`
  - `getCommentAnalysis(name): Promise<CommentAnalysis>`
  - `generateCreativeAssets(input): Promise<GeneratedAssets>`
  - `generateExperimentPack(input): Promise<ExperimentPack>`
- 内部处理：
  - HTTP 请求构造（URL、Method、Headers）
  - 认证信息注入（token / apiKey）
  - 超时与重试逻辑
  - 错误码解析与标准化
  - 监控埋点（调用耗时、成功率、错误分布）

> 这层在本地运行时可以直接调用现有引擎函数，生产环境时切换到真实 HTTP / 微服务调用，实现「同一接口，多种实现」。

### 2.2 业务逻辑层

**目标**：把「AI 的自然语言意图」转换成「一个或多个营销接口调用」，并组合结果给到 AI。

**建议目录**：

- `web/lib/ai-tools/marketing-tools.ts`

**核心设计**：

- 定义可被 LLM 使用的「工具函数描述」（tool schema）：

  - `tool_run_research_flow`
    - 参数：`competitorName`, `productName`, `productDesc?`
    - 行为：调用 `marketingApi.runResearchFlow`，返回 `ResearchFlowResult` 的压缩版（只保留对话需要的字段）

  - `tool_create_experiment_pack`
    - 参数：`product`, `variable`, `variants`
    - 行为：调用 `marketingApi.generateExperimentPack`

  - `tool_generate_creatives`
    - 参数：`product`, `creativeStrategy`
    - 行为：调用 `marketingApi.generateCreativeAssets`

  - `tool_get_comment_insights`
    - 参数：`competitorName`
    - 行为：调用评论分析 + 洞察报告

- 业务规则在这一层实现，例如：
  - AI 想要「调整实验变量」，触发：
    - 读取当前 `ExperimentConfig`
    - 调营销接口生成新的 `ExperimentPack`
    - 同步更新 `campaign-store` 与 `canvas-store`

### 2.3 执行引擎层

**目标**：对接 OpenRouter / ClaudeCode 风格的「工具调用协议」，负责：

- 接收 LLM 的工具调用请求（tool call）
- 解析工具名与参数
- 调用业务逻辑层函数
- 将结果重新包装成「模型可理解」的 JSON 文本回复

**建议位置**：

- 在现有 [ai-assistant.ts](file:///Users/violazhang/Downloads/MarketingAgent/web/lib/ai-assistant.ts) 基础上扩展：
  - 增加 `dispatchToolCall(toolName, args)` 函数
  - 为每个工具维护：
    - 权限要求（例如：是否允许创建真实实验）
    - 幂等性策略
    - 审计日志开关

**基本调用流程**（理想状态）：

1. 前端 Sidebar / Agent 页面把用户自然语言发送到后端 `POST /api/assistant/chat`
2. 后端通过 OpenRouter 调用 LLM，附带工具列表（tool schema）
3. 模型返回：
   - 普通自然语言回答，或
   - `tool_call` 请求（例如 `tool_run_research_flow`）
4. 执行引擎：
   - 验证权限 → 调用业务逻辑层 → 调接口抽象层
   - 获取结果，将其序列化为简洁 JSON 文本返回给模型作为后续对话上下文
5. LLM 基于工具结果生成最终回复，前端展示，并更新画布/仪表盘。

---

## 3. 技术实现文档设计要点

> 本节定义文档内容结构，实际文档就以本文件为基础，后续可拆分为多份更细的文档。

### 3.1 系统架构与数据流

建议在后续补充一张（或多张）架构图（可用 Mermaid）：

- 视图：
  - 用户 → Web 前端（Agent 页面 / Sidebar）→ `assistant` API
  - `assistant` API → OpenRouter（LLM）→ 工具调用 → 营销接口（本地引擎或远程服务）
  - 执行结果 → Zustand Store（`campaign-store` / `canvas-store`）→ UI 更新

### 3.2 接口调用权限与安全

- API 层面：
  - 基于 token 的鉴权方案（例如 JWT / API Key）
  - 针对「破坏性操作」增加额外保护（如「真正投放实验」与「仅生成草稿」区分）
- AI 层面：
  - 为工具定义「安全策略」：
    - 需要显式用户确认的操作（比如「关停某个实验」）
    - 只读工具（数据查询）

### 3.3 错误处理与重试机制

- 抽象层内置：
  - 限定重试次数（例如最多重试 2 次）
  - 指定可重试错误（网络超时、502 等）
  - 使用指数退避（Exponential Backoff）
- 执行引擎：
  - 将不可恢复错误转化为对 AI 友好的 JSON：
    - `{ "error": true, "code": "PERMISSION_DENIED", "message": "..." }`
  - AI 可以根据错误类型选择：
    - 提示用户补充信息
    - 改调用参数

### 3.4 性能与安全防护

- 性能：
  - 为高频接口增加简单缓存（如同一竞品分析短时间内重复调用）
  - 支持批量调用（例如一次获取多个实验的结果）
  - 监控接口耗时，异常升高时报警
- 安全：
  - 请求入参做严格校验（避免 Prompt 注入式攻击绕过业务规则）
  - 输出过滤，避免敏感信息通过 AI 回复泄露

### 3.5 与 AI 助手的集成方式

- AI 视角：
  - 通过工具描述（schema）了解：
    - 工具名、用途说明
    - 参数字段及约束
    - 返回字段含义
- 前端集成：
  - Sidebar / Agent 页面在调用 `sendMessage` 时可指定：
    - 本轮对话允许使用哪些工具
    - 是否只允许「模拟模式」（不落真实实验）

---

## 4. 开发与测试分阶段计划（本文件核心产出）

### 4.1 阶段一：核心接口对接 & 基础调用

**目标**：打通最小可用链路，让 AI 能通过一个工具调用完成「竞品调研 → 实验包生成」。

- 交付内容：
  - `marketing-api-client` 初版，实现本地引擎调用抽象
  - `tool_run_research_flow` 及其在执行引擎中的调度逻辑
  - `POST /api/assistant/mock-tools` 或类似入口，模拟 OpenRouter 工具调用
- 测试重点：
  - 正常输入下的完整链路结果正确性
  - 错误输入时的错误信息是否对 AI 友好
  - 性能：单次 end-to-end 延迟可接受（例如 < 1.5s）

### 4.2 阶段二：复杂业务场景串联

**目标**：支持多步工具调用与业务状态更新，让 AI 可以「看数据 → 改配置 → 再生成新一轮实验包」。

- 交付内容：
  - 工具扩展：`tool_generate_creatives`、`tool_create_experiment_pack`、`tool_get_comment_insights`
  - 在 `campaign-store` / `canvas-store` 中集成工具结果更新逻辑
  - 引入简单的「会话上下文」模型（携带 campaignId / canvasId）
- 测试重点：
  - 串联调用的幂等性（重复调用不会破坏状态）
  - 多步调用中的错误恢复（某一步失败时，AI 如何继续对话）

### 4.3 阶段三：全链路测试与性能优化

**目标**：在接入真实 OpenRouter 配置后，验证真实 LLM 调用下的稳定性与体验。

- 交付内容：
  - 引入真实 OpenRouter 配置与 key（仅服务端保存）
  - 接入真实的工具调用协议（function calling / tools）
  - 基本监控：
    - 请求量、错误率、P95 延迟
    - 各工具的调用分布
- 测试重点：
  - 高并发下的稳定性（针对小规模压力测试）
  - AI 在错误场景下的对话体验（不会「卡死在工具调用」）

### 4.4 阶段四：上线部署与监控方案

**目标**：将 AI 工具调用能力安全地暴露给真实用户，并具备基础可观察性。

- 交付内容：
  - 部署方案：
    - 环境区分（dev / staging / prod）
    - 环境级别的 OpenRouter key 管理
  - 监控 & 报警：
    - 接口错误率超阈值报警
    - 工具调用异常（如连续失败）报警
  - 回滚预案：
    - 可以一键关闭 AI 工具调用能力（回退为纯静态版助手）
- 测试重点：
  - 部署前后的对比验证
  - 回滚流程演练

---

## 5. 后续接入 OpenRouter 时的对接点

在你提供 OpenRouter 配置后，可以按照以下顺序落地：

1. 在服务端新增 `assistant` API（例如 `app/api/assistant/chat/route.ts`）
2. 在该 API 内：
   - 从请求中读取用户输入与上下文
   - 调用 OpenRouter LLM，附带工具 schema
   - 将工具调用请求转发给本文件中定义的执行引擎流程
3. 前端的 Sidebar / Agent 页面仅依赖 `sendMessage` 或新的 `assistant` API，无需感知底层接口细节。

这样就可以在不大幅重构现有代码的情况下，让 AI 助手真正「动手」操作你的营销引擎，而不仅仅是给出建议。

