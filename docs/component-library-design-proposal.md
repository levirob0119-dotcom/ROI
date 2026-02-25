# ROI 前端组件库深度分析与优化设计方案（B 端）

## 1. 目标与约束

### 1.1 目标
- 建立一套可持续演进的 B 端组件体系：高一致性、高可用性、高信息密度。
- 在不推翻现有代码的前提下，升级关键基础能力（可访问性、复杂表格、表单编排、主题 token 统一）。
- 为 UVA/UV1000/ROI 联动场景提供可复用页面模式与交互规范。

### 1.2 约束
- 现有技术栈：React 19 + TypeScript + Tailwind + 自研 `components/ui`。
- 当前已落地的分层是可用的（`ui`、`patterns`、`legacy`），优先“增量重构”而不是“重写”。

---

## 2. 现状深度分析（基于仓库代码）

### 2.1 已有基础
- 已有组件库骨架：`frontend/src/components/ui` 当前含 19 个基础组件。
- 页面复用已开始形成：生产链路中 `ui` 组件引用约 73 处。
- 已有设计系统展示页：`/design-system` 已包含 token、状态、模式、readiness 矩阵。
- 有基础质量门槛：lint + 局部组件单测 + 设计系统 e2e。

### 2.2 关键问题（影响业务效率和设计一致性）

1) 可访问性与交互完整性不足（优先级 P0）
- `Dialog` 为自实现，缺少焦点陷阱、标题/描述关联、焦点回退等完整语义能力。
- `Toast` 缺少 `aria-live` 等可读屏语义，通知堆叠/优先级策略不足。
- `RadioGroup`、`Toggle` 仍以“样式驱动”为主，Form 语义编排能力不足。

2) B 端核心数据能力薄弱（优先级 P0）
- `Table` 目前仅是样式封装，不具备排序、筛选、列固定、列宽调整、虚拟滚动、批量选择等 B 端关键能力。
- `Select` 基于原生 `select`，缺少搜索、远程加载、多选、分组选项、键盘增强等中后台常见需求。

3) 设计 token 存在多源定义（优先级 P1）
- 颜色/排版在 `tailwind.config.js`、`styles/index.css`、`designTokens.ts` 均有定义，存在漂移风险。
- 当前 token 更偏展示，不是工程单一事实源（single source of truth）。

4) 组件规格与验证链路不完整（优先级 P1）
- 有 showpage，但缺 Storybook 文档化、可视化回归、a11y 自动扫描的全链路。
- readiness 标记为 `ready` 的组件，和“复杂业务能力 ready”还存在差距。

---

## 3. B 端优秀设计参考要点（抽象为可执行原则）

结合 Ant Design、MUI、Semi、Radix、shadcn 等官方实践，可沉淀以下原则：

- 信息架构优先：先定义导航层级与任务路径，再定义视觉。
- 数据密度可调：同一页面支持标准密度/紧凑密度，兼顾可读性与效率。
- 表格即工作台：表格要支持筛选、排序、批量操作、列配置、行内操作、详情联动。
- 表单可编排：字段规则、校验、禁用态、只读态、联动态必须统一。
- 反馈分层：Toast（轻提示）/Inline Alert（局部）/Dialog（阻断）语义分离。
- 无障碍默认开启：键盘导航、焦点可见、屏幕阅读器语义作为默认质量门槛。

---

## 4. 开源组件选型方案（推荐）

## 4.1 推荐路线：保留 Tailwind 体系，升级为“Headless + 样式系统”

### 核心选型（推荐）
- 基础无障碍原语：`Radix UI Primitives`
- 组件模板与风格基线：`shadcn/ui`
- 复杂表格引擎：`TanStack Table`
- 大数据量滚动：`TanStack Virtual`
- 表单状态与校验：`react-hook-form` + `zod`
- 通知系统：`sonner`（或保留现有 toast 并补齐 a11y/队列能力）

### 为什么推荐这条路线
- 与现有 Tailwind + 组件源码内置模式兼容，迁移成本低。
- 保留品牌风格和定制能力，不被整包 UI 库样式强绑定。
- 对 B 端复杂场景（表格/筛选/权限态）扩展更灵活。

## 4.2 备选路线：整包企业组件库
- 可选：`Ant Design + ProComponents`。
- 适用：若团队更看重“开箱即用的中后台全家桶”，愿意接受样式与交互范式的强约束。

---

## 5. 目标组件架构（升级后）

- `foundation/`：design tokens（色彩、排版、间距、阴影、动效、语义层级）
- `ui/`：纯基础组件（Button/Input/Dialog/TablePrimitive...）
- `patterns/`：B 端通用模式（FilterBar、DataTablePro、PageHeader、BatchActionBar、DetailDrawer）
- `modules/`：业务模块组件（UVA/UV1000/ROI）

关键原则：`patterns` 不持有业务数据，只表达交互结构；业务逻辑放在页面容器层。

---

## 6. B 端页面模板方案（建议直接沉淀）

### 6.1 标准列表页模板（最常用）
- 顶部：页面标题 + 主操作按钮 + 次级操作。
- 筛选区：查询、状态筛选、时间筛选、更多筛选折叠。
- 主体区：`DataTablePro`（支持列配置、排序、筛选、批量操作）。
- 右侧：`DetailDrawer`（查看详情与快捷编辑）。
- 底部：分页、总数、批量操作反馈。

### 6.2 表单页模板
- 左侧：主表单（分组卡片 + 错误摘要 + 必填规则）。
- 右侧：实时预览/影响分析/保存状态。
- 底部固定操作栏：保存草稿、提交、重置。

### 6.3 结果分析页模板
- 顶部 KPI 区（卡片化）
- 中部趋势与分布（图表）
- 下部明细表与导出
- 侧边栏用于指标定义说明与版本信息

---

## 7. 设计 Token 工程化方案

### 7.1 单一事实源
建立 `frontend/src/foundation/tokens/`：
- `tokens.ts`：唯一 token 源。
- 构建脚本输出：
  - `tokens.css`（CSS Variables）
  - `tokens.tailwind.ts`（Tailwind extend）
  - `tokens.docs.json`（展示/文档）

### 7.2 语义化命名
- 不直接使用 `blue-500`，统一改为 `--color-primary`、`--color-surface-raised`、`--color-text-secondary`。
- 状态 token：`--state-success`、`--state-warning`、`--state-error`。

### 7.3 主题策略
- 先做 Light（主）+ Dark（辅助）双主题。
- 第二阶段加入“高对比度主题”（面向数据密集与低亮环境）。

---

## 8. 组件改造优先级与里程碑

### Phase 0（1-2 周，必须）
- 用 Radix 重构 `Dialog`、`Select`（至少补齐可访问性）。
- 升级 `Toast`：`aria-live`、多条队列、去重、关闭策略。
- 新增 `FormField` 基础封装：label/help/error/required 统一。

交付物：
- 无障碍基线通过（键盘流、焦点管理、基础读屏语义）。
- 现有页面无行为回归。

### Phase 1（2-4 周，核心收益）
- 落地 `DataTablePro`：排序、筛选、分页、列配置、批量操作。
- 引入虚拟滚动能力（>500 行时自动启用）。
- 落地 `FilterBar` 与 `BatchActionBar` 模式组件。

交付物：
- 至少 2 个业务页面切到 `DataTablePro`。
- 页面操作效率与一致性显著提升。

### Phase 2（4-8 周，体系化）
- Token 单一源改造 + 自动化生成。
- Storybook + 可视化回归（Chromatic 或 Playwright screenshot baseline）。
- 设计评审机制：组件 RFC + 变更日志。

交付物：
- 组件库进入“可持续迭代”状态。
- 新页面搭建时间明显缩短。

---

## 9. 质量与验收指标（建议纳入 CI）

- 可访问性：`axe` 无严重级别问题。
- 视觉一致性：关键组件截图 diff 通过率 >= 95%。
- 复用率：新页面基础 UI 复用率 >= 85%。
- 复杂页面性能：1000 行表格滚动保持流畅（虚拟化启用后）。
- 研发效率：列表页从 0 到可用模板时间 < 0.5 天。

---

## 10. 本项目建议的最终决策

推荐采用：
- **技术路线**：`Radix + shadcn + TanStack Table/Virtual + RHF + Zod`
- **实施策略**：增量迁移（先改最痛组件：Dialog/Select/Table/Toast）
- **组织策略**：组件 RFC + token 单源 + 自动化质量门禁

这条路径能在保持现有代码资产的同时，最快建立 B 端组件库的长期竞争力。

---

## 附录：参考资料（官方）

- Ant Design 设计规范（导航、数据展示等）：https://ant.design/docs/spec/navigation/
- Ant Design Table 能力说明：https://ant.design/components/table/
- MUI Data Grid 能力说明：https://mui.com/x/react-data-grid/
- Semi Design 组件文档：https://semi.design/zh-CN/show/table
- Radix UI 无障碍说明：https://www.radix-ui.com/primitives/docs/overview/accessibility
- shadcn/ui 数据表指南：https://ui.shadcn.com/docs/components/data-table
- TanStack Table 文档：https://tanstack.com/table/latest

