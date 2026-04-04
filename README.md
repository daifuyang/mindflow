# Mindflow

个人知识库与内容管理平台，基于 Next.js + Markdown 构建。

> **富阳说：做 1000 个 AI 工具，让每个人享受 AI 便利。**

## 技术栈

- **框架**: Next.js 16 (App Router)
- **样式**: Tailwind CSS 4 + shadcn/ui
- **内容**: Markdown + gray-matter 解析
- **部署**: 静态导出 (SSG) + Nginx

## 内容创作工作流

### 核心工具

1. **OpenCode** - AI 写作助手，部署在公网服务器，通过 Skills 记住写作规范
2. **Markdown** - 跨平台内容载体，Git 版本管理
3. **微信公众号助手** - 手机发布

### 快速开始

#### 创建新文章

```bash
# 在 content/media-planning/articles/ 下创建 .md 文件
# 命名格式：YYYY-MM-DD-关键词.md
```

文章必须包含 frontmatter：

```yaml
---
title: "文章标题"
date: YYYY-MM-DD
status: draft
platform:
  - 掘金
  - 微信公众号
tags:
  - 标签
order: 序号
---
```

#### 更新索引

每篇文章创建/发布后，更新 `content/media-planning/content-index.md`。

#### 构建与部署

```bash
# 构建静态文件
pnpm build

# 部署到线上
cp -r out/* /usr/local/workspace/www/mindflow.zerocmf.com/
```

访问 https://mindflow.zerocmf.com 查看效果。

## 目录结构

```
content/
├── media-planning/
│   ├── content-index.md      # 文章索引
│   ├── task-norms.md         # 写作规范
│   └── articles/             # 文章正文
└── about/                    # 个人介绍与项目
```

## 开发

```bash
pnpm dev        # 本地开发
pnpm build      # 构建生产版本
pnpm start      # 启动生产服务器
```

## Skills

本项目使用 OpenCode Skills 系统，以下 skill 已配置：

- **content-creation** - 内容创作安全规范（脱敏规则）
- **content-deploy** - 内容创作与部署完整工作流
