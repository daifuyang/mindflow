---
title: "AI 编程实战：OpenCode Web 零成本开发工作流，对比 OpenClaw(AI龙虾)"
date: 2026-04-01
status: draft
platform:
  - 掘金
  - 微信公众号
tags:
  - AI辅助开发
  - OpenCode
  - OpenCode Web
  - OpenClaw
  - AI龙虾
  - 免费AI
order: 1
---

# AI 编程实战：OpenCode Web 零成本开发工作流，对比 OpenClaw(AI龙虾)

> **富阳说：做 1000 个 AI 工具，让每个人享受 AI 便利。**

作为一个全栈开发者，我一直在寻找能提升效率的 AI 编程工具。市面上工具很多，但真正能让我长期留下来的，必须满足两个条件：

第一，能力强 — 能理解项目上下文，不只是聊天。
第二，成本低 — 按 token 计费的工具，写一篇文章花 7-10 块，长期用不起。

后来我发现了 OpenCode Web，接入免费模型后成本直接降到 0，而且部署到公网服务器后，打开浏览器就能用。今天从实际体验出发，聊聊这两款工具的差异，以及我为什么把 OpenCode Web 作为主力。

## OpenCode Web 是什么

OpenCode Web 是 OpenCode 的浏览器版本。部署到自己的公网服务器后，打开网址就能用，不需要在本地安装任何软件。它集成了：

- **文件管理器** — 左侧文件树，支持创建、编辑、删除文件
- **终端面板** — 内置终端，可以执行 npm、git、curl 等命令
- **AI 对话** — 用自然语言描述需求，AI 直接操作项目文件
- **Skills 系统** — 自定义 Skill 文件，让 AI 记住你的项目规范、常用命令

### 为什么我选择 OpenCode Web

**1. 公网部署，随时随地用**

在公司电脑、家里电脑、甚至 iPad 上，打开浏览器就是完整开发环境。不需要配置本地环境，切换设备无缝继续。

**2. Skills 让 AI 真正懂你**

这是 OpenCode Web 最核心的竞争力。我给服务器配置了几个 Skill：

```
skills/
├── aliyun-credentials.md    # 阿里云凭证、服务器信息
├── nginx-standards.md       # Nginx 配置规范
├── server-credentials.md    # 数据库连接信息
└── tts-service.md           # 服务运维命令
```

有了这些 Skill，我跟 AI 说「部署站点」，它能自动完成拉代码、构建、配置 Nginx、申请 SSL 证书全流程。全程我只说了一句话。

**3. 免费模型，零成本**

接入免费模型，不限制调用次数。写文章、改代码、跑命令，成本都是 0。

## OpenClaw(AI龙虾) 的体验

OpenClaw（社区昵称「AI龙虾」）是 2026 年最火的开源 AI 智能体框架，GitHub 上超过 27 万 Star。它的核心理念是让每个人拥有自己的私人 AI 助手，号称「越用越好用」。

我也跟风体验了一段时间，说实话能力确实不错，但有两个问题让我最终放弃了它：

**1. 配置太麻烦**

从安装、配置大模型、设置技能，每一步都需要折腾。官方推荐接入 Kimi 等付费模型，免费方案配置起来更复杂。换一台电脑又要重新走一遍流程。

**2. 太费 token**

这是最致命的问题。实测写一篇 3000 字的技术文章，从大纲到成稿，多轮对话下来消耗 50,000-80,000 token，费用 7-10 元/篇。每周写 2 篇就是月成本 60-80 元。

号称「越用越好用」，但每次对话都在烧钱，用的越多花的越多，这个体验很矛盾。

## OpenCode Web 怎么部署

部署过程很简单，一台公网服务器 + 几分钟就能搞定：

### 1. 准备服务器

一台能访问公网的 Linux 服务器即可。

### 2. 安装 Node.js 和 OpenCode

```bash
# 安装 Node.js（推荐 v20+）
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# 安装 OpenCode
npm install -g opencode
```

### 3. 配置模型（可选）

OpenCode 默认接入的就是免费模型，开箱即用，不需要额外配置。

如果你想切换模型，可以在配置文件中指定。推荐以下两个免费模型：

- **MiniMax M2.5** — 中文理解能力强，适合技术写作
- **Qwen 3.6 Plus Free** — 代码生成质量高，适合开发场景

```json
{
  "provider": "your-provider",
  "model": "your-model"
}
```

### 4. 启动 Web 服务

直接运行即可：

```bash
opencode web
```

默认监听 `localhost:3000`。如果需要指定端口和监听地址：

```bash
opencode web --port 3000 --host 0.0.0.0
```

推荐使用 PM2 管理进程，保证服务持续运行：

```bash
# 安装 PM2
npm install -g pm2

# 启动并命名进程
pm2 start "opencode web --port 3000 --host 0.0.0.0" --name opencode-web

# 设置开机自启
pm2 save
pm2 startup
```

### 5. 配置 Nginx 反向代理 + SSL

```nginx
server {
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
    
    listen 443 ssl;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
}
```

### 6. 配置 Skills（可选但强烈推荐）

在 `~/.config/opencode/skills/` 下创建 Skill 文件，让 AI 记住你的项目规范和常用信息。

Skill 文件使用 Markdown 格式，例如：

```markdown
# Skill: aliyun-credentials

## 阿里云凭证
- AccessKey ID: your-access-key-id
- AccessKey Secret: your-access-key-secret

## 服务器信息
- 公网 IP: YOUR_SERVER_IP
- 域名: example.com

## 常用操作
- DNS 管理: aliyun alidns
- OSS 管理: aliyun oss
```

配置一次，永久生效。AI 每次对话自动加载相关 Skill，不需要重复提供上下文。

完成后，浏览器打开 `https://your-domain.com` 即可使用。

## OpenCode Web 实战：从零部署一个站点

### 第一步：拉取项目
```bash
git clone https://github.com/username/my-project.git
```

### 第二步：安装依赖并构建
```bash
cd my-project && pnpm install && pnpm build
```

### 第三步：修改配置为 SSG 模式
告诉 AI：「这个项目要导出静态文件」，AI 自动修改 `next.config.mjs` 添加 `output: 'export'`，并处理动态路由。

### 第四步：配置 Nginx
告诉 AI：「配置 Nginx，域名 mysite.example.com」，AI 读取 Skill 生成规范配置。

### 第五步：DNS + SSL
告诉 AI：「添加 DNS 记录并申请证书」，AI 调用 CLI 完成。

从 0 到站点上线，5 步完成，耗时约 10 分钟。AI 费用：0 元。

## OpenCode Web 内容创作工作流

写技术文章的完整流程：

1. **选题讨论** — 跟 AI 聊方向，确定切入点
2. **生成大纲** — 基于方向输出结构化大纲
3. **逐段写作** — 按大纲逐段生成，实时修改
4. **代码示例** — AI 直接生成可运行的代码
5. **排版检查** — 自动检查 Markdown 格式

全程 0 成本。

## 适合谁用

**推荐 OpenCode Web：**
- 独立开发者 / 全栈开发者
- 做技术自媒体，需要高频使用 AI
- 需要跨设备随时访问
- 不想为 AI 工具持续付费

**OpenClaw(AI龙虾) 也不错：**
- 喜欢折腾配置，享受自定义的乐趣
- 公司报销 AI 费用
- 需要私人 AI 助手的完整智能体能力

## 总结

| 场景 | 推荐工具 |
|------|---------|
| 全栈项目开发 | OpenCode Web |
| 技术文章写作 | OpenCode Web |
| 服务器运维 | OpenCode Web + Skills |
| 私人 AI 助手 | OpenClaw(AI龙虾) |
| 零预算个人项目 | OpenCode Web |

OpenCode Web 对我来说已经不只是编程工具，而是一个懂我技术栈、知道我的服务器配置、能帮我干活的全能助手。部署到公网后，随时随地打开浏览器就能用。而且免费。

---

*本文由 OpenCode Web 辅助完成，使用免费模型，成本 0 元。*
*文中所有操作均为真实记录，非模拟演示。*
