# ROI/UVA/UV1000 项目基线文档

## 1. 背景与目标

### 1.1 背景
- 需求来源：`/Users/rob.li/Downloads/UVA  & UV1000计算器工具需求简述.pdf`（11 页）。
- 业务核心：为产品经理提供从用户价值洞察到方案测算的统一工具能力。
- 当前产品重心：UVA 测算链路已经落地，UV1000 与 ROI 联动尚未闭环。

### 1.2 目标
- 建立一份可持续维护的“现状基线 + 演进路线”文档，支撑产品与研发协同。
- 在不改动现有业务代码的前提下，统一需求、现状、差距、接口草案和阶段验收标准。

### 1.3 本文档使用范围
- 读者：产品、研发、测试、项目管理。
- 时间跨度：近期 3 个月。
- 本轮交付：文档落地，不实施业务代码变更。

## 2. 需求全景拆解（按能力域）

### 2.1 UVA 前端需求
- 方案分享：将测算结果分享给组织内其他成员。
- 结果页返回：从结果页回到项目选择/入口页。
- 结果页一页化：支持一页完整呈现，且支持多方案展示。
- 交互优化：参考测试反馈持续改进。

### 2.2 UVA 后台需求
- 数据管理：上传未计算底层数据，系统自动计算。
- 版本管理：支持历史版本记录与可视化。
- 维度范围：UV、UV*PETS 权重、UVL2 与 PETS L1 相关性。
- 数据查询：Admin 可查询全员保存记录。
- 数据导出：支持下载。
- Changelog：记录更新时间、更新人、版本、更新理由。
- 权限管理：Admin 可管理人员权限。

### 2.3 UV1000 前端需求
- 方案保存、方案分享。
- 前后对比展示：同时展示“配置前/配置后”的产品力得分与权重（权重默认不可改）。
- 区分可编辑与不可编辑层级：部分域从 L3 开始编辑，部分域从 L2 开始编辑（如智能座舱）。
- 自动计算变化值，结果清晰直观。
- 与 ROI 联动：ROI 选定车型和维度后，UV1000 仅展示相关数据并支持层级折叠展开。
- 与 ROI 联动：UV1000 结果自动回填 ROI。

### 2.4 UV1000 后台需求
- 数据管理与版本记录（与 ROI 共通）。
- 权限管理（与 ROI 共通）。
- Admin 查询与导出全员保存记录。

### 2.5 工具联动需求
- UVA <-> ROI 双向进入与互联接口。
- UV1000 <-> ROI 双向数据流（筛选输入、结果回填）。

## 3. 现状基线（As-Is）

### 3.1 当前已落地能力（代码可追溯）

| 能力 | 当前状态 | 证据 |
| --- | --- | --- |
| 登录/注册/鉴权 | 已实现 | `backend/src/routes/auth.js`、`backend/src/middleware/auth.js`、`frontend/src/pages/Login.tsx` |
| 项目管理（增删改查） | 已实现 | `backend/src/routes/projects.js`、`frontend/src/pages/Dashboard.tsx` |
| UVA 计算接口 | 已实现 | `backend/src/routes/uva.js` (`POST /api/uva/calculate`) |
| UVA 保存与读取 | 已实现 | `backend/src/routes/uva.js` (`POST /api/uva/save`, `GET /api/uva/project/:projectId`) |
| 多车型测算切换 | 已实现 | `frontend/src/pages/ProjectDetail.tsx` |
| 草稿自动保存 | 已实现 | `frontend/src/pages/ProjectDetail.tsx`（定时触发 `persistVehicle(..., true)`） |
| UVA 基础数据读取 | 已实现 | `backend/src/routes/data.js`、`frontend/src/services/data.ts` |
| UVA 矩阵离线导入脚本 | 已实现 | `backend/scripts/parse_uva_excel.py` |

### 3.2 当前未闭环能力

| 能力 | 当前状态 | 说明 |
| --- | --- | --- |
| 方案分享（UVA） | 未实现 | 无分享链接/权限控制/分享页接口。 |
| Admin 权限模型 | 未实现 | 当前 `User` 无 `role` 字段，接口未做 admin/成员分级。 |
| Admin 查询与导出 | 未实现 | 无 `/api/admin/analyses`、无导出能力。 |
| 数据版本与 Changelog | 未实现 | 仅业务记录有 `createdAt/updatedAt`，未建立版本实体与变更日志模型。 |
| UV1000 计算器 | 未实现 | 前后端均无 `uv1000` 路由与页面。 |
| ROI 双向联动 | 未实现 | 无 integration 接口，无跨工具上下文传递协议。 |

### 3.3 架构与数据存储现状
- 后端以 JSON 文件存储为主：`backend/data/db/users.json`、`backend/data/db/projects.json`、`backend/data/db/uva_analyses.json`。
- 运行时数据访问统一由 `backend/src/database/db.js` 管理。
- 代码中存在 SQLite 初始化脚本 `backend/src/database/init.js`，但不在当前主运行链路中。

## 4. 差距清单（Gap List）

### 4.1 P0（第 1 月优先）
- G1：建立角色能力边界（`member`/`admin`）并完成鉴权规则。
- G2：补齐 UVA 分享最小闭环（创建分享、读取分享、查看权限）。
- G3：补齐 Admin 查询与导出基础能力（先覆盖 UVA 已保存记录）。
- G4：建立数据版本 + Changelog 基础模型（先覆盖 UVA 数据更新链路）。
- G5：补齐结果页返回入口与一页化结果展示规范（UVA）。

### 4.2 P1（第 2 月优先）
- G6：交付 UV1000 MVP 计算链路（计算、保存、读取、结果展示）。
- G7：实现 UV1000 可编辑层级规则（L2/L3 可配）与前后对比展示。
- G8：补齐 UV1000 分享能力与 Admin 查询覆盖。

### 4.3 P2（第 3 月优先）
- G9：打通 ROI -> UV1000 的筛选输入。
- G10：打通 UV1000 -> ROI 的结果回填。
- G11：打通 UVA <-> ROI 深链接与上下文透传。
- G12：统一 UVA/UV1000 管理后台与审计报表。

### 4.4 依赖关系
- D1：G1 是 G3/G4/G8/G12 的前置依赖。
- D2：G4 是 G3/G12 的数据可追溯前提。
- D3：G6 是 G9/G10 的功能前提。
- D4：G2 与 G1 需并行设计权限模型，避免二次重构。

### 4.5 范围边界标注（本期/后续/不做）

| 能力项 | 边界标注 | 说明 |
| --- | --- | --- |
| UVA 分享最小闭环 | 本期 | 纳入第 1 月，先做组织内登录可见。 |
| Admin 查询与导出（UVA） | 本期 | 纳入第 1 月。 |
| UV1000 MVP（计算+保存+展示） | 本期 | 纳入第 2 月。 |
| ROI 与 UV1000 回填联动 | 本期 | 纳入第 3 月。 |
| 数据库迁移（替换文件存储） | 后续 | 3 个月内仅作为技术选项评估。 |
| 匿名公开分享链接 | 不做 | 本期不开放匿名访问。 |

## 5. VNext 公共 API / 接口 / 类型草案

> 说明：以下为文档草案，当前代码未实现。

### 5.1 角色与用户模型变更

### User 类型草案

```ts
type UserRole = 'member' | 'admin';

interface User {
  id: string;
  username: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}
```

### 鉴权约束
- `member`：项目内的创建、编辑、查看、分享（受组织策略约束）。
- `admin`：增加数据管理、查询导出、版本管理、权限管理能力。

### 5.2 UVA 分享接口草案

#### `POST /api/uva/share`
- 用途：创建或更新一个可分享快照。
- 权限：登录用户（仅可分享自己有权限的项目）。
- 请求体：

```json
{
  "projectId": "string",
  "vehicle": "string",
  "analysisId": "string",
  "expiresAt": "2026-12-31T23:59:59.000Z"
}
```

- 响应体：

```json
{
  "shareId": "string",
  "shareUrl": "https://host/share/string",
  "createdAt": "string"
}
```

#### `GET /api/uva/share/:shareId`
- 用途：读取分享快照（只读）。
- 权限：登录用户且在组织可见范围内。
- 响应体：

```json
{
  "shareId": "string",
  "project": { "id": "string", "name": "string" },
  "vehicle": "string",
  "analysis": {},
  "owner": { "id": "string", "displayName": "string" },
  "createdAt": "string"
}
```

### 5.3 Admin 查询与导出接口草案

#### `GET /api/admin/analyses`
- 用途：分页查询保存记录（UVA/UV1000）。
- 权限：`admin`。
- 请求参数：`toolType`（`UVA` | `UV1000`）、`projectId`、`userId`、`vehicle`、`startAt`、`endAt`、`page`、`pageSize`。
- 响应体：

```json
{
  "items": [],
  "pagination": { "page": 1, "pageSize": 20, "total": 120 }
}
```

#### `GET /api/admin/analyses/export`
- 用途：按过滤条件导出记录。
- 权限：`admin`。
- 请求参数：同查询接口。
- 响应体：文件流（CSV/XLSX），附带导出任务元数据。

### 5.4 数据版本与变更记录接口草案

#### `POST /api/admin/data-versions`
- 用途：提交一版新数据并触发版本登记。
- 权限：`admin`。
- 请求体：

```json
{
  "toolType": "UVA",
  "source": "excel_upload",
  "summary": "更新 2026Q1 UV 与权重",
  "reason": "补齐新车型",
  "payloadRef": "storage://..."
}
```

- 响应体：

```json
{
  "versionId": "string",
  "toolType": "UVA",
  "createdBy": "string",
  "createdAt": "string"
}
```

#### `GET /api/admin/changelog`
- 用途：按时间倒序查询变更记录。
- 权限：`admin`。
- 响应体：

```json
{
  "items": [
    {
      "id": "string",
      "versionId": "string",
      "toolType": "UVA",
      "updatedBy": "string",
      "reason": "string",
      "createdAt": "string"
    }
  ]
}
```

### 5.5 UV1000 接口草案

#### `POST /api/uv1000/calculate`
- 用途：执行 UV1000 前后配置差异计算。
- 权限：登录用户。
- 请求体：

```json
{
  "projectId": "string",
  "vehicle": "string",
  "baselineConfig": {},
  "targetConfig": {},
  "editableScope": ["L2", "L3"]
}
```

- 响应体：

```json
{
  "vehicle": "string",
  "beforeScore": 0,
  "afterScore": 0,
  "deltaUv1000": 0,
  "breakdown": []
}
```

#### `POST /api/uv1000/save`
- 用途：保存 UV1000 方案（支持草稿）。
- 权限：登录用户。
- 请求体：计算请求体 + `result` + `isDraft`。
- 响应体：保存后的分析记录。

#### `GET /api/uv1000/project/:projectId`
- 用途：读取项目下 UV1000 历史方案。
- 权限：项目成员。
- 响应体：列表（按更新时间倒序）。

### 5.6 联动接口草案

#### `POST /api/integration/roi-to-uv1000`
- 用途：ROI 侧传入车型/维度上下文，获取 UV1000 初始化上下文。
- 权限：登录用户。

#### `POST /api/integration/uv1000-to-roi`
- 用途：将 UV1000 输出回填到 ROI 输入区。
- 权限：登录用户。

### 5.7 分析记录类型变更草案

```ts
type ToolType = 'UVA' | 'UV1000';

interface AnalysisRecordBase {
  id: string;
  toolType: ToolType;
  projectId: string;
  vehicle: string;
  userId: string;
  versionId?: string;
  sharedFrom?: string;
  isDraft: boolean;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}
```

## 6. 3 个月演进路线图

### 6.1 第 1 月：基础补齐（UVA 治理闭环）

#### 目标
- 建立权限、分享、查询导出、版本与变更记录的最小可用能力。

#### 交付项
- 角色模型与鉴权策略落地设计。
- UVA 分享接口与只读页面交互设计。
- Admin 查询/导出接口设计与字段口径。
- 数据版本与 Changelog 的实体模型设计。
- UVA 结果页返回与一页化展示规范。

#### 阶段验收
- 业务方可追溯“谁在何时基于哪个版本做了什么测算”。
- 管理员可按过滤条件查询并导出记录。
- 普通用户可分享并查看可授权范围内的结果。

### 6.2 第 2 月：UV1000 MVP

#### 目标
- 建立 UV1000 的端到端最小闭环。

#### 交付项
- UV1000 计算接口、保存接口、项目读取接口。
- UV1000 页面：前后对比、可编辑层级约束、变化值展示。
- UV1000 分享能力接入统一分享模型。
- Admin 查询支持 `toolType=UV1000`。

#### 阶段验收
- 单项目单车型可完成 UV1000 从输入到保存的全流程。
- 前后配置差值可追溯到维度明细。
- UV1000 记录可被管理后台检索和导出。

### 6.3 第 3 月：联动与统一管理

#### 目标
- 打通 ROI 与 UVA/UV1000 之间的上下文与结果流。

#### 交付项
- ROI -> UV1000 上下文接口。
- UV1000 -> ROI 回填接口。
- UVA <-> ROI 深链接能力。
- 统一后台视图（UVA + UV1000）、统一审计口径。

#### 阶段验收
- 从 ROI 发起的测算可在 UV1000 中自动带入上下文。
- UV1000 结果可自动回流 ROI，不依赖人工二次录入。
- 管理员可在统一后台查看跨工具记录与变更历史。

## 7. 风险与缓解

| 风险 | 描述 | 缓解策略 |
| --- | --- | --- |
| 数据口径不一致 | UVA、UV1000、ROI 使用不同维度命名或版本。 | 引入 `versionId` 与统一字典，接口强制携带版本信息。 |
| 权限边界模糊 | 分享、管理、导出可能越权。 | 统一 RBAC，接口层强制校验项目归属与角色。 |
| 历史记录兼容风险 | 现有 JSON 记录字段不完整。 | 增加迁移脚本与向后兼容读取逻辑。 |
| 性能与可扩展性 | 记录增大后查询/导出效率下降。 | 增量分页、导出异步任务、必要时逐步迁移持久层。 |
| 审计不可追踪 | 无版本、无更新人字段导致责任不可追溯。 | 强制写入 `updatedBy`、`versionId`、`changelog`。 |

## 8. 测试与验收场景

### 8.1 文档层验收
- C1 需求覆盖：PDF 中每条功能诉求在覆盖矩阵至少出现一次。
- C2 代码一致：文档中“已实现能力”均能映射到现有代码路径与接口。
- C3 边界清晰：每项能力标记为本期/后续/不做之一。
- C4 路线可执行：每个月均有明确交付与可验证结果。
- C5 接口完整：每个 VNext 接口包含用途、请求体、响应体、权限说明。
- C6 读者可用：产品可读价值与范围，研发可读接口与数据边界。

### 8.2 实施后测试建议（供下一阶段执行）
- T1 API 合同测试：新增接口请求校验、鉴权、错误码一致性。
- T2 权限测试：member/admin 越权访问阻断。
- T3 回归测试：现有 UVA 保存与计算流程不回退。
- T4 E2E 场景：创建项目 -> 测算 -> 保存 -> 分享 -> 后台查询导出。
- T5 数据测试：版本切换前后记录可追溯且可回放。

## 9. 附录

### 9.1 PDF 需求覆盖矩阵

| PDF 条目 | 需求摘要 | 当前能力 | 目标能力 | 里程碑 |
| --- | --- | --- | --- | --- |
| UVA 1.2-1 | 分享 | 未实现 | `POST/GET /api/uva/share` + 分享页 | M1 |
| UVA 1.2-2 | 结果页返回 | 部分实现 | 明确返回路径与状态恢复 | M1 |
| UVA 1.2-4 | 一页完整展示（含多方案） | 部分实现 | 统一一页化模板与多方案视图 | M1 |
| UVA 1.3-1 | 数据管理与版本显示 | 未实现 | 数据版本实体 + 管理入口 | M1 |
| UVA 1.3-1a | 上传底层数据自动计算 | 部分实现 | 后台上传处理 + 自动重算流水线 | M1-M2 |
| UVA 1.3-1b | UV/权重/相关性维度管理 | 未实现 | 维度级版本化与校验 | M1-M2 |
| UVA 1.3-2 | Admin 查询保存记录 | 未实现 | `GET /api/admin/analyses` | M1 |
| UVA 1.3-2b | 数据下载 | 未实现 | `GET /api/admin/analyses/export` | M1 |
| UVA 1.3-3 | Changelog | 未实现 | `GET /api/admin/changelog` | M1 |
| UVA 1.3-4 | 权限管理 | 未实现 | `User.role` + RBAC | M1 |
| UVA 1.4-1 | 与 ROI 双向进入 | 未实现 | 深链接 + 上下文协议 | M3 |
| UV1000 2.2-1 | 保存 | 未实现 | `POST /api/uv1000/save` | M2 |
| UV1000 2.2-2 | 分享 | 未实现 | 复用分享模型 | M2 |
| UV1000 2.2-3a | 前后配置对比与权重展示 | 未实现 | UV1000 结果页对比组件 | M2 |
| UV1000 2.2-3b | 可编辑/不可编辑层级 | 未实现 | L2/L3 可编辑策略引擎 | M2 |
| UV1000 2.2-4a | ROI 选择后按层展示 | 未实现 | `roi-to-uv1000` 上下文接口 | M3 |
| UV1000 2.2-4b | 结果自动录入 ROI | 未实现 | `uv1000-to-roi` 回填接口 | M3 |
| UV1000 2.3-a | 数据管理与版本（与 ROI 共通） | 未实现 | 统一版本中心 | M3 |
| UV1000 2.3-b | 权限与 ROI 共通 | 未实现 | 统一 RBAC | M3 |
| UV1000 2.3-c | Admin 查询与下载 | 未实现 | 统一 admin 检索导出 | M3 |

### 9.2 术语表
- ROI：投资回报测算工具与业务流程容器。
- UVA：用户价值排序工具（PETS/UV 视角）。
- UV1000：配置变化对产品竞争力影响的计算工具。
- PETS：体验维度体系。
- KANO：需求属性分类。
- Changelog：数据版本变更记录。

### 9.3 开放问题（不阻塞文档发布）
- O1：分享可见范围是否仅限组织内成员，是否支持匿名临时链接。
- O2：导出格式优先级（CSV、XLSX、两者都要）。
- O3：UV1000 “配置前”基线来源是否固定为最新版本数据。
- O4：ROI 侧回填字段是否允许人工覆盖与再次提交。
- O5：后端持久层是否在 3 个月内升级到数据库（当前以文件存储为基线）。

## 10. 实施步骤（供下一阶段直接执行）

- S1：建立两份文档骨架并固化章节结构。
- S2：按 PDF 提炼需求条目并形成覆盖矩阵。
- S3：基于现有代码补齐 As-Is 能力与证据映射。
- S4：输出 Gap List（P0/P1/P2）并标注依赖关系。
- S5：落地 3 个月路线图与每月验收标准。
- S6：输出 VNext API 与类型草案并统一术语。
- S7：做一致性复核，确保 README 与 foundation 文档无冲突。

## 11. 假设与默认值
- A1：文档语言为中文。
- A2：目标读者为“产品 + 研发协同”。
- A3：规划周期固定为近期 3 个月。
- A4：本轮仅交付文档，不修改业务代码。
- A5：后端以文件存储为当前事实基线，数据库迁移仅作后续选项。
