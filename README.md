# ROI/UVA/UV1000 项目基线

ROI 工具当前处于 **UVA 测算主流程可用** 阶段，目标在近期演进为 **UVA + UV1000 + ROI 联动平台**。

## 当前状态（As-Is）

### 已实现能力（基于代码事实）
- 用户登录、注册与鉴权（JWT）。
- 项目管理（创建、编辑、删除、查看）。
- UVA 测算（按车型、PETS/UV 选择、Kano/使用率/渗透率）。
- 手动保存与草稿自动保存。
- 多车型切换与结果对比展示（同一项目内）。

### 未闭环能力（基于需求 PDF）
- 测算方案分享（组织内共享）。
- 管理后台的数据管理、版本管理与 Changelog。
- Admin 查询与导出全员保存记录。
- UV1000 计算器（完整前后端链路）。
- ROI 与 UVA/UV1000 双向联动接口与流程。

## 技术栈与分层

- 前端：React 19 + TypeScript + Vite + Vitest + Playwright。
- 后端：Node.js + Express + JWT + JSON 文件存储。
- 数据（静态）：`backend/data/`。
- 数据（运行态）：`backend/data/db/`（`users.json`、`projects.json`、`uva_analyses.json`）。

## 目录结构

```text
ROI/
├── frontend/                 # React 前端
├── backend/                  # Express 后端
│   ├── src/routes/           # API 路由（auth/projects/uva/data）
│   ├── src/database/db.js    # 文件存储访问层
│   └── scripts/parse_uva_excel.py
├── UVA模型数据底表.xlsx
├── UV.xlsx
└── docs/project-foundation.md
```

## 快速启动

### 1) 启动后端

```bash
cd /Users/rob.li/Documents/ROI/backend
npm install
npm run dev
```

环境变量（可选）：
- `PORT`：默认 `3001`。
- `JWT_SECRET`：默认 `default-secret`（仅本地开发建议使用）。

### 2) 启动前端

```bash
cd /Users/rob.li/Documents/ROI/frontend
npm install
npm run dev
```

环境变量（可选）：
- `VITE_API_URL`：默认 `/api`。

## 文档导航

- 项目详细基线文档：`docs/project-foundation.md`
- 包含：需求全景拆解、现状差距（含代码映射）、3 个月路线图、VNext API/类型草案、PDF 需求覆盖矩阵。

## 近期路线图（3 个月快照）

- 第 1 月：补齐基础能力（分享、后台最小可用、版本与变更记录基础）。
- 第 2 月：交付 UV1000 MVP（计算、保存、展示、基础分享）。
- 第 3 月：打通 ROI 联动与统一管理后台（权限、导出、审计、稳定性）。

详细拆解见 `docs/project-foundation.md`。
