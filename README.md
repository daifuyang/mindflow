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

#### 创建新分类（如需新增分类）

```bash
# 1. 在 content/media-planning/articles/ 下创建英文文件夹
mkdir content/media-planning/articles/新分类

# 2. 创建 _meta.json 设置中文显示名
echo '{"title": "新分类中文名", "order": 6}' > content/media-planning/articles/新分类/_meta.json
```

#### 创建新文章

```bash
# 在已有分类目录下创建 .md 文件
# 文件命名格式：YYYY-MM-DD-关键词.md
touch content/media-planning/articles/ai-reflections/2026-04-19-第一性原理.md
```

文章 frontmatter：

```yaml
---
title: 文章标题
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
├── media-planning/           # 自媒体规划
│   ├── _meta.json           # 配置 title 和 order
│   ├── content-index.md     # 文章索引
│   ├── task-norms.md        # 任务规范
│   └── articles/            # 文章正文（英文文件夹，中文显示名）
│       ├── ai-dev/          # AI 辅助开发
│       ├── open-source-cms/ # 开源 CMS 实战
│       ├── fullstack-tutorials/ # 全栈技术教程
│       ├── indie-dev-log/   # 独立开发者日志
│       └── ai-reflections/   # AI随想
└── about/                    # 个人介绍
```

## 命名规范

> **核心原则**：文件夹英文，通过 `_meta.json` 的 `title` 字段控制中文显示

| 类型       | 规范                    | 示例                                       |
| ---------- | ----------------------- | ------------------------------------------ |
| 文件夹名称 | 英文                    | `articles`、`ai-dev`、`ai-reflections`     |
| 显示名称   | `_meta.json` 的 `title` | `AI 辅助开发`、`AI随想`                    |
| API 路由   | 英文                    | `/api/articles`                            |
| URL 路径   | 英文                    | `/docs/media-planning/articles/ai-dev/...` |
| 文件命名   | `YYYY-MM-DD-关键词.md`  | `2026-04-01-opencode-web.md`               |

## 分类定义

| 目录                  | 中文名称       | 说明                |
| --------------------- | -------------- | ------------------- |
| `ai-dev`              | AI 辅助开发    | AI 编程工具使用体验 |
| `open-source-cms`     | 开源 CMS 实战  | CMS 搭建教程        |
| `fullstack-tutorials` | 全栈技术教程   | 技术教程            |
| `indie-dev-log`       | 独立开发者日志 | 开发者心路历程      |
| `ai-reflections`      | AI随想         | AI时代下的深度思考  |

## Frontmatter 规范

每篇文章必须包含：

```yaml
---
title: 文章标题
date: YYYY-MM-DD
status: draft | planned | drafting | review | ready | published | reviewed
platform:
  - 掘金
  - 微信公众号
tags:
  - 标签
order: 序号
cover:
  wechat: /assets/images/covers/{slug}/cover-wechat.jpg
  zhihu: /assets/images/covers/{slug}/cover-zhihu.jpg
  juejin: /assets/images/covers/{slug}/cover-juejin.jpg
---
```

## 素材与封面规范

### 目录结构

```
public/assets/images/covers/{article-slug}/
├── cover-original.jpg      # 原始大图 (1920×1080)
├── cover-wechat.jpg      # 微信头条 1080×460 (2.35:1)
├── cover-wechat-secondary.jpg  # 微信次条 200×200 (1:1)
├── cover-zhihu.jpg       # 知乎 690×280 (2.46:1)
└── cover-juejin.jpg     # 掘金 1080×608 (3:2)
```

### 封面尺寸对照表

> 注意：MMX-CLI 只支持标准比例 `21:9` `16:9` `3:2` `4:3` `1:1` `2:3` `3:4` `9:16`，生成后需在发布时裁切到目标尺寸。

| 平台     | 发布尺寸 | 生成比例 | 输出文件名                   |
| -------- | -------- | -------- | ---------------------------- |
| 微信头条 | 1080×460 | 21:9     | `cover-wechat.jpg`           |
| 微信次条 | 200×200  | 1:1      | `cover-wechat-secondary.jpg` |
| 知乎     | 690×280  | 3:2      | `cover-zhihu.jpg`            |
| 掘金     | 1080×608 | 3:2      | `cover-juejin.jpg`           |

### 封面风格

使用 **赛博朋克像素风**（Cyberpunk Pixel Art Style），通过 MiniMax MMX-CLI 生成：

```bash
# 安装 MMX-CLI
npm install -g mmx-cli
mmx auth login --api-key <your-api-key>

# 生成封面
mmx image generate \
  --prompt "Cyberpunk pixel art style cover for article about {topic}, featuring glowing neon colors, retro game aesthetics, digital grid background, futuristic tech elements, vibrant magenta and cyan hues, 16-bit era inspired, sharp pixels, atmospheric lighting effects" \
  --aspect-ratio 2.35:1 \
  --out public/assets/images/covers/{slug}/cover-wechat.jpg
```

### 已有封面清单

| 文章 Slug                                 | 目录                                                                   |
| ----------------------------------------- | ---------------------------------------------------------------------- |
| `2026-04-03-weixin-claw-low-cost-lobster` | `public/assets/images/covers/2026-04-03-weixin-claw-low-cost-lobster/` |
| `first-principles`                        | `public/assets/images/covers/first-principles/`                        |
| `2026-04-02-opencode-mobile-publishing`   | `public/assets/images/covers/2026-04-02-opencode-mobile-publishing/`   |
| `2026-04-01-opencode-web-vs-openclaw`     | `public/assets/images/covers/2026-04-01-opencode-web-vs-openclaw/`     |
| `aic-intro`                               | `public/assets/images/covers/aic-intro/`                               |

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
