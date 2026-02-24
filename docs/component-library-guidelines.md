# 组件库使用准则（生产链路）

适用范围：`frontend/src/pages` 与其生产依赖组件（不含 `playground`、`components/legacy`）。

## 强制规则
- 禁止在生产页面直接使用 `window.confirm`；必须使用 `@/components/ui/confirm-dialog`。
- 禁止手写 modal 遮罩与容器；必须使用 `@/components/ui/dialog`。
- 禁止在生产页面手写 `table/select/textarea` 控件；必须使用 `@/components/ui/table`、`@/components/ui/select`、`@/components/ui/textarea`。
- 所有交互按钮优先使用 `@/components/ui/button`，仅在结构型容器（非交互）允许自定义 `div`。

## 代码组织
- `@/components/ui/*`：基础组件，保持通用、可复用、低业务耦合。
- `@/components/patterns/*`：业务模式组件，组合基础组件实现业务语义。
- `@/components/legacy/*`：历史归档，不允许在生产路由引用。

## 质量门槛
- 提交前必须通过 `npm run lint`。
- 受影响组件需补充最小单测（行为与可访问性语义）。
