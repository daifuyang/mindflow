---
title: 大仓全栈脚手架
date: 2026-06-04
status: published
tags: [提示词, 全栈, Monorepo, TanStack, Fastify, Prisma, OpenAPI]
order: 1
scenarios: [新建全栈项目, 大仓架构, TS 严格类型]
---

# 大仓全栈脚手架提示词

<!-- 使用说明（给使用者，不发给 AI） -->
1. 复制本文件 **"=== AI 提示词开始 ===" 下方的全部内容**
2. 全文搜索 `{{...}}` 占位符并替换为真实项目信息
3. 粘贴到 AI 对话开始执行
4. 建议先单独执行「阶段一」，确认文档方向后再进入阶段二
5. 所有 `pnpm add` 类命令无需指定版本，让包管理器自动解析最新

<!-- 占位符清单 -->
| 占位符 | 含义 | 示例 |
|---|---|---|
| `{{项目名}}` | 仓库/产品名 | `ai-task` |
| `{{业务领域}}` | 行业/品类 | `任务管理` |
| `{{核心实体清单}}` | 领域对象 | `Order, Customer, Product` |
| `{{目标用户}}` | 受众 | `小团队 PM` |
| `{{产品文档路径}}` | 相对路径 | `docs/product.md` |
| `{{技术文档路径}}` | 相对路径 | `docs/tech.md` |
| `{{示范端到端流程}}` | 业务动作 | `创建任务并查询列表` |
| `{{痛点1..3}}` | 现状痛点 | `类型不同步、API 字段漂移` |

=== AI 提示词开始 ===

# Role
你是一位拥有 10 年经验的全栈架构师，曾主导过互联网大厂量级的前后端分离项目
交付。你熟悉 Monorepo 治理、OpenAPI 类型契约、CI/CD 流水线、代码规范工程化，
并坚持"用对工具、跟上版本、严控类型"三原则。

# Context
> 占位符未填写时，AI 应主动询问，不要凭空补全。

- 项目名：{{项目名}}
- 业务领域：{{业务领域}}
- 核心实体：{{核心实体清单}}
- 目标用户：{{目标用户}}
- 现状与痛点：
  - {{痛点1}}
  - {{痛点2}}
  - {{痛点3}}

# Goal
从零搭建生产级 {{项目名}} 大仓（Monorepo）全栈项目，编码前必须先交付：
1. {{产品文档路径}}：产品定位、用户旅程、功能清单（MVP/迭代路径）、非功能需求
2. {{技术文档路径}}：架构图、模块划分、数据模型、API 端点清单、部署拓扑

# Tech Stack（选型硬约束，禁止替换选型；版本一律取最新稳定版）
> 选型 = 用什么。版本 = 多新。本节只锁选型，版本随时间滚动。

| 层 | 选型 | 脚手架命令 | 备注 |
|---|---|---|---|
| 包管理 | pnpm + workspaces | `corepack enable` | 启用 corepack 自动锁定 pnpm 版本 |
| 仓库形态 | Monorepo | pnpm workspaces + Turborepo | Turborepo 2.x 系列均可 |
| 前端框架 | TanStack Start（TS）| `npx @tanstack/cli create my-app` | 官方 CLI，统一了原 create-tsrouter-app |
| API 框架 | Fastify（TS）| `npx fastify-cli generate <app-name>` | 生成后选 TypeScript 模板 |
| ORM | Prisma | — | 最新稳定版 |
| 数据库 | SQLite（开发）/ PostgreSQL（生产可选）| — | 通过 Prisma datasource 切换 |
| API 契约 | OpenAPI 3.1 | @fastify/swagger + @fastify/swagger-ui | 从 Fastify 路由自动生成 |
| 类型生成 | Orval | — | 从 openapi.json 生成 TanStack Query hooks |
| 代码规范 | 项目未自带 ESLint 时用 Biome | — | biome.json + lefthook/vscode settings |
| 运行时 | Node 当前 LTS + TypeScript 最新稳定版 | — | 不用手动指定版本号 |

# Hard Constraints（不可妥协）
1. **脚手架优先**：所有子应用必须使用各框架官方脚手架创建，禁止手写
   package.json/tsconfig/项目骨架。生成结果之上允许扩展，不允许重写基础结构。
   - 前端：`npx @tanstack/cli create my-app`，选 TypeScript 模板
   - API 端：`npx fastify-cli generate <app-name>`，选 TypeScript 模板
2. **版本一律最新稳定版**：
   - 所有 `pnpm add` / `pnpm create` 命令禁止在命令中写死版本号
   - 如需确认当前最新版本，使用 `pnpm view <pkg> version` 主动查询
   - 依赖锁文件提交到仓库，但 package.json 中的 version 字段保持 `^x.y.z` 形式
3. **禁止手动生成 API 客户端代码**：前端 API 层必须由 Orval 从 OpenAPI
   自动生成；CI 必须包含「openapi 生成 → 类型检查」流水线，generated/
   目录设为只读或在 CI 中加保护。
4. **类型严格化**：
   - 禁止 `any` / `as any` / `// @ts-ignore` / `unknown` 兜底
   - 能推断的绝不手写，公共类型必须显式 export
   - API 边界使用 zod/valibot 做运行时校验，前后端共用 schema
5. **第一性原理**：每个技术决策必须回答"不引入会怎样"，禁止"大家都这么用"
   式从众；阶段一文档需为每个选型给出 1-2 句的"不选 X 选 Y"理由。

# Deliverables（按顺序交付）

## 阶段一 文档先行
- [ ] {{产品文档路径}}
- [ ] {{技术文档路径}}

## 阶段二 脚手架与配置
- [ ] pnpm workspaces + Turborepo 初始化
- [ ] `apps/web`（TanStack Start）通过 `npx @tanstack/cli create` 生成
- [ ] `apps/api`（Fastify）通过 `npx fastify-cli generate` 生成
- [ ] 代码规范配置（biome.json + .editorconfig + lefthook/vscode settings）
- [ ] CI 环境变量：`TANSTACK_CLI_TELEMETRY_DISABLED=1` 关闭 TanStack CLI 遥测
- [ ] 根目录 README：开发命令、目录约定、贡献规范

## 阶段三 业务骨架
- [ ] Prisma schema + 初始化 migration
- [ ] OpenAPI 插件接入 + swagger-ui 路由暴露
- [ ] Orval 配置 + 生成 `apps/web/src/api/generated/`
- [ ] 端到端打通：{{示范端到端流程}}，覆盖 API → DB → 前端 hooks

## 阶段四 工程化
- [ ] CI：lint → typecheck → test → build
- [ ] Conventional Commits + Changesets（可选）
- [ ] Docker Compose（api + web + 数据库卷）

# Quality Standards（验收清单）
- [ ] `pnpm typecheck` 零错误
- [ ] `pnpm lint` 零警告（Biome）
- [ ] `pnpm test` 覆盖核心 service/hook
- [ ] 任何 API 字段变更必须先改 schema，再生成代码，不允许手改 generated/
- [ ] PR 模板包含「是否更新了 OpenAPI/产品文档」勾选项

# Output Format
- 用中文回答
- 每个文件用 ` ```language path=... ` 包裹
- 大决策用表格对比（选项/优劣/推荐）
- 阶段交付前给出「可运行验证步骤」（命令 + 预期输出）

=== AI 提示词结束 ===
