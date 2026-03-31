---
title: 技术偏好
order: 2
---

# 技术偏好与规范

本文档记录了我的技术选型偏好和开发规范，帮助 AI 在辅助开发时做出更贴合我的决策。

## 框架与库选型

| 场景 | 首选方案 |
|------|---------|
| 全栈 Web 应用 | Next.js (App Router) + shadcn/ui |
| UI 组件库 | shadcn/ui（最新版）/ Ant Design |
| ORM | Prisma |
| 数据库 | PostgreSQL（首选）/ MySQL |
| 后端 API（Node.js） | Fastify |
| 后端 API（Go） | Gin |
| 移动端/小程序 | Taro（React） |
| 低代码 | lowcode-engine + 自研物料 |
| 表单方案 | Formily |
| 富文本编辑器 | Lexical |

## 包管理与工程化

- **单仓（monorepo 内部）**: bun
- **多仓（独立项目）**: pnpm
- **Node.js 版本**: 22（通过 nvm 管理）
- **代码风格**: Prettier + ESLint
- **CSS 方案**: Tailwind CSS v4
- **TypeScript**: 严格模式，优先使用

## 部署与运维

- **服务器**: 阿里云 ECS
- **Serverless**: 阿里云 FC 函数计算
- **容器化**: Docker
- **CI/CD**: easy-deploy（自研）/ GitHub Actions
- **域名**: daifuyang.com, zerocmf.com, yugongsoft.com

## 代码风格偏好

- 函数式编程风格为主
- 中文注释（面向中文用户的项目）
- 组件命名: PascalCase
- 文件命名: kebab-case
- 偏好简洁实用，不过度设计
- 开源项目使用 MIT 协议

## 决策偏好

- 新项目优先选 **Next.js + shadcn/ui + Prisma** 组合
- 偏向「**简单实用**」而非过度架构
- 数据库优先 **PostgreSQL**，兼容 MySQL
- 遇到选择时倾向**社区活跃度高、文档完善**的方案
- 中文优先（面向国内用户的产品）
