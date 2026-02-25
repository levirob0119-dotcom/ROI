# ROI UI 重构方案 v2

## 1. 参考与提炼（B 端 SaaS）

本轮重构参考了以下主流设计系统和组件库的公开规范：

- shadcn/ui Blocks: [https://ui.shadcn.com/blocks](https://ui.shadcn.com/blocks)
- Atlassian Design System（Elevation / Layout / Tokens）: [https://atlassian.design](https://atlassian.design)
- Shopify Polaris（Information hierarchy / Data-heavy UI patterns）: [https://polaris.shopify.com](https://polaris.shopify.com)
- Ant Design（Data Entry / Data Display / Enterprise patterns）: [https://ant.design/docs/spec/introduce](https://ant.design/docs/spec/introduce)
- IBM Carbon（Layered UI / Productive density）: [https://carbondesignsystem.com](https://carbondesignsystem.com)

提炼的共性：

1. 线框不是主角，层级由“底色 + 间距 + 字重 + 局部强调”建立。
2. 视觉密度高时，卡片不靠粗边框分组，靠表面层（surface）和分段标题。
3. 主色只用于关键动作和当前态，不用于大面积背景填充。
4. 阴影用于“层级关系”而不是“装饰”；同屏最多 2-3 个深度级别。

## 2. 四个维度的系统规则

### 2.1 线框（Border）

- 取消“全局边框兜底”，只在分隔线和输入壳层用细线。
- 组件默认使用 `surface-inset` / `surface-panel`，避免每层都 `border`。
- 表格行分隔采用 `surface-divider-bottom`，替代显性网格框。

### 2.2 排版（Typography）

- 新增 `ui-display / ui-h1 / ui-h2 / ui-label`，建立标题-区块-标签三段式层级。
- 页面标题和区块标题增大字重差，弱化辅助文案存在感。
- 标签（Label）统一为低噪音小号字重，减少“每行都在喊”的问题。

### 2.3 底色（Surface）

- 建立三级表面语义：`surface-panel`（主容器）、`surface-panel-soft`（次容器）、`surface-inset`（输入与内嵌区）。
- 状态色仅用于小面积：图标容器、徽标、分数值，不覆盖整块内容区。
- 页面画布改为 `canvas` 渐变，减少“白板拼白卡”的割裂感。

### 2.4 阴影（Shadow）

- 统一三档阴影：`sm / md / lg`，按层级使用，不混杂多套 shadow token。
- 交互态（active/focus）用轻阴影 + ring，替代粗描边。
- 对话框、主卡片允许较深阴影；表单控件仅使用 inset 轮廓。

## 3. 本轮落地范围

- 基础组件：Button / Badge / Card / Input / Select / Textarea / Checkbox / RadioGroup / Toggle / Slider / Table / Dialog / Label。
- 模式组件：PageHeader / InlineStatusBar / VehicleTabs / ScoreSummary / ResultHierarchyTree / ProjectCard。
- 高频业务：ProjectDetail、VehicleResultPanel、PetsEntryCard、AddPetsDialog、AppShell、Login、Dashboard、WorkflowSettings。
- 设计系统展示页与 tokens 已同步更新，作为后续新组件验收基线。

## 4. 下一阶段（可继续）

1. 将 playground 实验页全部迁移到 v2 语义类，避免线上与演示风格分裂。
2. 补齐“密度模式（紧凑/默认）”和“深色模式”token 映射。
3. 增加组件视觉回归快照（desktop/mobile）作为 PR 准入检查。
