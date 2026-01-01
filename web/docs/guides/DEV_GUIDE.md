# Developer Experience: The Integration Protocol

本指南专为 LLM 及负责后续迭代的开发者编写，确保系统生命力的延续。

## 开发规范

### 1. Store 扩展协议

增加新功能时，优先考虑将其逻辑下沉至 `CampaignStore`。

- **State**: 使用语义化的标识符。
- **Actions**: 必须是异步友好的，且通过 `trigger()` 调用感知反馈。

### 2. 引擎集成原则

- **无状态**: 所有的计算逻辑必须放在 `lib/engines/`。
- **可测试**: 每个引擎函数应当能够独立于 React 环境运行。

### 3. 组件演进法则

- **Pure Views**: 下层组件严禁持有业务状态。
- **Slots**: 复杂的 UI 组合优先使用 `children` 或 `Slots` 模式，提高复用率。

## LLM 协作须知

当你（另一名 AI）接手本项目时，请注意：

- **Context Preservation**: 优先阅读 `ARCHITECTURE.md` 与 `FEATURES.md`。
- **Aesthetic Integrity**: 任何新增 UI 必须符合 `GlassCard` 规范，严禁使用原生原生样式或简陋组件。
- **Documentation Sync**: 任何架构级别的修改必须同步更新本目录下的文档。

---

> “架构即认知，文档即记忆。”
