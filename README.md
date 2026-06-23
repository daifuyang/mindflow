# 富阳说

AI 工具、自动化运维与独立开发实践内容站，基于 Next.js + Markdown 构建。

> **富阳说：做 1000 个 AI 工具，让每个人享受 AI 便利。**

## 技术栈

- **框架**: Next.js 16 (App Router)
- **样式**: Tailwind CSS 4 + shadcn/ui
- **内容**: Markdown + gray-matter 解析
- **部署**: GitHub Actions + 阿里云 ECS + PM2 + Nginx

## 站点身份

| 项目       | 当前值                                                                                                  |
| ---------- | ------------------------------------------------------------------------------------------------------- |
| 对外品牌   | 富阳说                                                                                                  |
| 主域名     | https://shuo.daifuyang.com                                                                              |
| SEO 标题   | 富阳说：AI 工具、自动化运维与独立开发实践                                                               |
| SEO 描述   | 富阳说记录 AI 工具、自动化运维、独立开发、开源 CMS 与提示词工程实践，帮助开发者和中小企业享受 AI 便利。 |
| 品牌标识   | `/brand/logo.svg`                                                                                       |
| 内部服务名 | `shuo-web-prod`                                                                                         |

站点对外统一使用“富阳说”和 `shuo.daifuyang.com`；代码仓库可保留 `mindflow` 历史名称，运行时服务统一使用 `shuo-web-prod`。

## 内容创作工作流

### 核心工具

1. **OpenCode** - AI 写作助手，部署在公网服务器，通过 Skills 记住写作规范
2. **Markdown** - 跨平台内容载体，Git 版本管理
3. **微信公众号助手** - 手机发布

### 快速开始

#### 创建新分类（如需新增分类）

```bash
# 1. 在目标频道下创建英文文件夹
mkdir content/writings/新分类

# 2. 创建 _meta.json 设置中文显示名
echo '{"title": "新分类中文名", "order": 7}' > content/writings/新分类/_meta.json
```

#### 创建新文章

```bash
# 在已有分类目录下创建 .md 文件
# 文件命名格式：YYYY-MM-DD-关键词.md
touch content/writings/first-principles/2026-06-09-示例文章.md
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

每篇文章创建/发布后，更新 `content/writings/_archive/content-index.md`（或新建自己的索引页）。

#### 构建与部署

```bash
# 本地构建验证
pnpm build
```

访问 https://shuo.daifuyang.com 查看效果。

线上部署通过 GitHub Actions 工作流 `.github/workflows/deploy.yml` 完成：

1. GitHub Runner 执行依赖安装、Prisma Client 生成、类型检查和生产构建。
2. 通过 SSH/rsync 同步源码到阿里云 ECS。
3. 在服务器本地使用 `npm install` 安装依赖、生成 Prisma Client、构建 Next.js 应用。
4. 使用 PM2 重启 `shuo-web-prod` 进程，并检查 `127.0.0.1:18301` 健康状态。

需要在 GitHub 仓库配置以下 Secrets：

| Secret               | 说明                                                                  |
| -------------------- | --------------------------------------------------------------------- |
| `ALIYUN_HOST`        | 阿里云 ECS 公网 IP，例如 `139.196.89.64`                              |
| `ALIYUN_USER`        | SSH 登录用户，例如 `dfy`                                              |
| `ALIYUN_SSH_KEY`     | 私钥内容，需具备登录服务器权限                                        |
| `ALIYUN_PORT`        | SSH 端口，可选，默认 `22`                                             |
| `ALIYUN_DEPLOY_PATH` | 部署目录，可选，默认 `/home/dfy/workspace/projects/websites/mindflow` |

服务器侧需要提前准备：

```bash
# Node.js 22、corepack、pm2
corepack enable
npm install -g pm2

# 首次启动可由 workflow 自动创建；如需手动启动：
PORT=18301 HOSTNAME=127.0.0.1 npm start
```

Nginx 将 `shuo.daifuyang.com` 反向代理到 `127.0.0.1:18301`，证书使用 `aic` 签发并上传的 `shuo-daifuyang-com-2026`。

### 运行时命名约定

| 名称                 | 用途                    | 推荐                            |
| -------------------- | ----------------------- | ------------------------------- |
| `shuo.daifuyang.com` | 对外域名和 SEO/GEO 主体 | 固定使用                        |
| `富阳说`             | 对外品牌名              | 固定使用                        |
| `mindflow`           | 代码仓库历史名          | 可保留，不作为运行时服务名      |
| `shuo-web-prod`      | PM2 运行时服务名        | 新规范：`{app}-{role}-{env}`    |
| `127.0.0.1:18301`    | Next.js 内部监听地址    | 仅本机监听，由 Nginx 暴露 HTTPS |

端口分配遵循 `docs/ops/server-port-standard.md`。`3000-3999` 属于框架默认端口区，不作为长期生产端口使用；线上 Web 应用使用 `18000-18999`，当前富阳说分配 `18301`。

## 目录结构

> 4 频道 + 1 私密区。所有一级目录由 `_meta.json` 控制中文显示和 order。

```
content/
├── about/           # 频道 1：关于我（我是谁、目标、技术审美、增长策略）
├── writings/        # 频道 2：思考与文章
│   ├── first-principles/   # 第一性原理
│   ├── revelations/        # 启示录（商业/电影/人间的长期启发）
│   ├── ai-dev/             # AI 辅助开发
│   ├── open-source-cms/    # 开源 CMS 实战
│   ├── fullstack-tutorials/# 全栈技术教程
│   ├── indie-dev-log/      # 独立开发者日志
│   └── _archive/           # 旧索引/规范的归档快照
├── projects/        # 频道 3：我在做的事（私密，靠 isPublic 控制）
│   ├── commercial/         # 商业项目
│   └── personal/           # 个人项目
├── prompts/         # 频道 4：提示词库（与 AI 协作的工程基线）
│   ├── fullstack/          # 全栈开发
│   └── _reserved/          # 预留分类
├── help/            # 频道 5：站点使用（order=99 放最后）
│   ├── getting-started/    # 快速开始
│   └── guides/             # 使用指南
└── private/         # 私密区（构建时自动跳过，仅登录态可见）
```

### 频道划分原则（第一性原理）

| 频道        | 回答的问题             | 公开性                    |
| ----------- | ---------------------- | ------------------------- |
| `about/`    | 我是谁                 | 公开                      |
| `writings/` | 我在想什么、我写了什么 | 公开                      |
| `projects/` | 我在做什么             | 私密优先（isPublic 控制） |
| `prompts/`  | 我怎么和 AI 协作       | 公开                      |
| `help/`     | 这个站怎么用           | 公开                      |
| `private/`  | 完全私密的内部资料     | 构建排除                  |

## 命名规范

> **核心原则**：文件夹英文，通过 `_meta.json` 的 `title` 字段控制中文显示

| 类型       | 规范                    | 示例                                   |
| ---------- | ----------------------- | -------------------------------------- |
| 文件夹名称 | 英文                    | `articles`、`ai-dev`、`ai-reflections` |
| 显示名称   | `_meta.json` 的 `title` | `AI 辅助开发`、`AI随想`                |
| API 路由   | 英文                    | `/api/articles`                        |
| URL 路径   | 英文                    | `/docs/writings/ai-dev/...`            |
| 文件命名   | `YYYY-MM-DD-关键词.md`  | `2026-04-01-opencode-web.md`           |

## writings/ 分类定义

| 目录                  | 中文名称       | 说明                     |
| --------------------- | -------------- | ------------------------ |
| `first-principles`    | 第一性原理     | 长篇深度思考             |
| `revelations`         | 启示录         | 商业/电影/人间的长期启发 |
| `ai-dev`              | AI 辅助开发    | AI 编程工具使用体验      |
| `open-source-cms`     | 开源 CMS 实战  | CMS 搭建教程             |
| `fullstack-tutorials` | 全栈技术教程   | 技术教程                 |
| `indie-dev-log`       | 独立开发者日志 | 开发者心路历程           |

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
