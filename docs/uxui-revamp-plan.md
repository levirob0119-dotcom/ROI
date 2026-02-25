# ROI 组件库梳理与 UX/UI 升级规划（shadcn/ui Blocks 对齐）

## 1. 目标

- 以 `shadcn/ui Blocks` 作为视觉与结构基准，统一全站 UX/UI 语言。
- 保留现有业务逻辑与路由，不做大规模重写，采用“组件先行 + 页面分批迁移”。
- 优先改造高频组件和关键业务页面，最快解决“表单丑、勾选丑、样式冗余”的核心问题。

## 2. 当前组件库盘点

### 2.1 基础组件清单（`frontend/src/components/ui`）
- `button`
- `badge`
- `card`
- `dialog`
- `confirm-dialog`
- `input`
- `label`
- `select`
- `textarea`
- `checkbox`
- `toggle`
- `radio-group`
- `slider`
- `table`
- `toast`
- `use-toast`

### 2.2 使用频次（按 import 统计）
1. `button`（20）
2. `badge`（14）
3. `card`（8）
4. `dialog`（6）
5. `input`（5）
6. `toggle` / `label`（各 4）
7. `select` / `textarea` / `checkbox` / `slider`（各 3）
8. `table` / `radio-group`（各 2）

结论：先优化 `button + form controls + dialog + card` 是正确路径。

## 3. 当前 UX/UI 主要问题

- 视觉语言不统一：同一页面同时出现 token 样式、局部覆盖样式、一次性特效类。
- 表单控件历史包袱重：输入框/单选/勾选/开关在不同页面存在“二次皮肤”，导致观感不一致。
- 页面容器层次杂乱：`card / section / status bar` 的边框、阴影、间距不在同一体系。
- 组件可复用与页面块复用脱节：`ui` 有基础组件，但缺少与 Blocks 同级别的页面级模块（Auth、Sidebar、Settings、Table Workbench）。

## 4. 目标设计系统（To-Be）

## 4.1 视觉原则
- 干净、克制、信息密度友好（B 端优先）。
- 弱化装饰性阴影和动效，强化状态可读性（focus/error/disabled/selected）。
- 所有状态色仅通过语义 token 表达，不允许页面级硬编码“炫光”样式。

## 4.2 架构分层
- `components/ui/*`：原子组件（与 shadcn 风格对齐）。
- `components/patterns/*`：业务无关页面块（FilterBar、DataTableToolbar、DetailPanel、FormSection）。
- `pages/*`：业务组合层，仅拼装，不定义视觉规范。

## 5. 与 shadcn Blocks 的映射计划

### 5.1 页面级映射（优先）
- `Login` 页 -> 对齐 `login-*` blocks。
- `AppShell`（顶栏 + 侧栏 + 内容区）-> 对齐 `sidebar-*` + `dashboard-*` blocks。
- `Dashboard`（项目列表）-> 对齐 dashboard cards/grid blocks。
- `WorkflowSettings` -> 对齐 settings + table blocks。
- `ProjectDetail`（核心工作台）-> 对齐 dashboard + form section + data table 组合范式。

### 5.2 组件级映射（并行）
- 表单控件：`input/select/textarea/checkbox/radio/switch` 全量对齐 shadcn 组件行为与状态样式。
- 反馈控件：`dialog/alert-dialog/toast/badge` 对齐 shadcn 语义层。
- 数据展示：`table` 补齐 toolbar/filter/sort/pagination 模式能力（先结构，后功能增强）。

## 6. 分阶段实施（建议 4 周）

## Phase 0：规范冻结（2-3 天）
- 冻结 UX 基线：色彩、间距、圆角、边框、阴影、状态。
- 输出“禁止项”：页面内不允许新增长阴影、ring 特效、独立颜色常量。
- 补齐设计示例页：`/design-system` 成为唯一视觉验收入口。

交付：`Design baseline checklist` + 组件状态截图基线。

## Phase 1：高频组件清理（第 1 周）
- 按频次完成基础组件统一：
  - `button`, `badge`, `card`, `dialog`, `input`, `label`
  - `checkbox`, `select`, `textarea`, `toggle`, `radio-group`, `slider`
- 清除页面里的“二次皮肤 className”覆盖，回收为通用 variant。

交付：高频组件视觉统一，历史样式覆盖减少 60% 以上。

## Phase 2：关键页面块迁移（第 2-3 周）
- `Login` -> `login block` 风格。
- `AppShell` -> `sidebar/dashboard block` 风格。
- `Dashboard` -> card grid block 风格。
- `WorkflowSettings` -> settings + table block 风格。
- `ProjectForm/AddPetsDialog` -> 标准 form section + field group。

交付：关键业务路径（登录 -> 项目 -> 工作台）视觉一致。

## Phase 3：工作台体验升级（第 4 周）
- `ProjectDetail` 页面块化：
  - 操作区（toolbar）
  - 配置区（form panels）
  - 结果区（summary + table/panel）
- `table` 增加标准化模式组件：空态、加载态、错误态、筛选栏占位。
- 构建 UX 验收脚本（关键页面截图比对）。

交付：核心工作台达到“可演示、可扩展、可复用”。

## 7. 里程碑验收标准

- 视觉一致性：关键页面截图对比通过率 >= 95%。
- 控件一致性：同一控件在不同页面状态一致（focus/disabled/error）。
- 样式冗余：页面级强覆盖 class 减少 >= 70%。
- 体验反馈：核心流程（登录、建项目、编辑配置）交互路径可读性提升。

## 8. 风险与控制

- 风险：边改边运行导致页面存在混合风格。
  - 控制：以页面为单位切换，完成一个页面再切下一个。
- 风险：业务逻辑回归。
  - 控制：每个阶段执行 `lint + vitest`，关键路径补 e2e。
- 风险：组件 API 频繁变更导致调用层震荡。
  - 控制：优先保留旧 API，新增 variant，不做破坏式改动。

## 9. 执行顺序（下一步）

1. 冻结基线与组件禁止项（Phase 0）。
2. 完成高频组件最后一轮统一（Phase 1 收尾）。
3. 进入页面块迁移，顺序：`Login -> AppShell -> Dashboard -> WorkflowSettings -> ProjectDetail`。

---

## 参考

- shadcn Blocks: https://ui.shadcn.com/blocks
- Blocks 文档: https://ui.shadcn.com/docs/blocks
- 2026-02 更新（Radix/Base UI 双支持）: https://ui.shadcn.com/docs/changelog/2026-02-blocks
