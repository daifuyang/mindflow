---
title: "打造自己的低成本龙虾 claw：微信 AI 助手，用自然语言管任务、盯数据"
date: 2026-04-03
status: published
platform:
  - 掘金
  - 微信公众号
tags:
  - AI辅助开发
  - weixin-claw
  - OpenCode
  - 微信机器人
  - 定时任务
  - 自动化
order: 3
---

# 打造自己的低成本龙虾 claw：微信 AI 助手，用自然语言管任务、盯数据

> **富阳说：做 1000 个 AI 工具，让每个人享受 AI 便利。**

## 背景：微信官方 ClawBot

2026 年 3 月 22 日，腾讯正式推出**微信 ClawBot** 插件，让用户在微信聊天界面直接与 AI 智能体交互。这是腾讯首次将 OpenClaw 官方 AI 代理嵌入微信，12 亿用户迎来了 AI 入口。

微信 ClawBot 需要：
- 微信客户端 **8.0.70 及以上版本**
- 在「我」→「设置」→「插件管理」中启用
- 配合 OpenClaw 客户端实现任务执行

我的 weixin-claw 项目正是基于微信官方 API 实现的同类工具，区别在于：
- 完全自部署，不依赖 OpenClaw 桌面端
- 配合 opencode 实现更强的 AI 能力
- 支持定时任务、历史记忆等扩展功能

---

在前两篇文章里，我分享了 OpenCode Web 的零成本开发工作流，以及手机发文的移动工作流。今天带来第三篇：一个能把 AI 能力装进微信的工具 — weixin-claw。

它的核心思路很简单：**让微信成为你和 AI 之间的对话窗口**。你在微信里说一句话，AI 帮你执行任务、盯数据、创建定时提醒，结果直接推回微信。

## 为什么需要这个工具

做独立开发和自媒体，我经常遇到这些场景：

- 后台数据异常了，希望第一时间知道
- 想每天早上 9 点自动收集热点新闻，推送到微信
- 在外面不方便开电脑，想用手机让 AI 帮我查点东西
- 有些重复性的检查任务，希望能定时自动执行
- 需要在不同项目目录间切换，让 AI 处理不同项目

市面上有很多 AI 助手工具，但要么配置复杂，要么按 token 收费，用多了心疼。weixin-claw 解决的就是这个问题：**用免费模型 + 微信作为交互界面，打造零成本的私人 AI 助手**。

## weixin-claw 是什么

weixin-claw 是我自己写的微信 clawbot 对话工具，核心功能有四个：

**1. AI 代理模式**

微信收到消息 → 交给 opencode 处理 → 自动回复结果。每个用户独立维护会话上下文，支持多轮对话。

**2. 自然语言定时任务**

在微信里说一句「帮我每天早上 9 点收集热点」，系统自动解析意图、创建 cron 定时任务，到点自动执行并把结果推回微信。

**3. 历史记忆**

会话归档 + 按需加载，跨会话保持用户偏好。AI 可以根据对话历史理解你的偏好。

**4. 消息通知媒介**

支持 CLI 和编程式调用，一行代码发微信通知。适合 crontab、脚本监控等场景。

## 技术架构

整个项目用 TypeScript 编写，运行在 Node.js 22+ 上：

```
weixin-claw/
├── src/
│   ├── cli/               # 统一 CLI 入口 (agent/send/poll/task)
│   ├── client/           # 微信 API 客户端
│   │   ├── api.ts        #   HTTP 请求封装
│   │   ├── auth.ts       #   扫码登录 + 凭证持久化
│   │   ├── types.ts      #   协议类型定义
│   │   └── index.ts      #   WeixinClient 类
│   ├── opencode/         # opencode web HTTP 集成
│   │   ├── client.ts     #   HTTP 请求封装
│   │   ├── runner.ts     #   统一调用接口 + 重试机制
│   │   ├── parser.ts     #   ACTION 标签解析
│   │   └── index.ts      #   统一导出
│   ├── poller/           # 消息轮询（EventEmitter）
│   ├── notifier/         # notify(text) 一行发通知
│   ├── session/          # 会话管理 + 记忆归档/加载
│   ├── scheduler/        # croner 定时任务调度
│   └── utils/            # md2wx、paths 等工具
├── opencode.json         # agent 角色配置
├── ecosystem.config.cjs  # PM2 部署配置
└── .opencode/skills/    # AI 能力定义
    ├── weixin-assistant  # 意图路由 + 指令表
    ├── weixin-format     # 微信排版规范
    ├── task-scheduler    # 定时任务 ACTION
    ├── memory-manager    # 记忆管理 ACTION
    └── project-navigator # 目录切换 ACTION
```

依赖只有三个：`croner`（定时调度）、`qrcode-terminal`（终端二维码）、`marked`（Markdown 处理）。没有数据库，所有数据用 JSON 文件持久化。

## 快速上手

### 1. 安装

```bash
git clone https://github.com/daifuyang/weixin-claw.git
cd weixin-claw
pnpm install
```

需要 Node.js >= 22（内置 fetch 支持）。

### 2. 启动 opencode 服务

```bash
# 终端 1
opencode web --port 4096
```

### 3. 启动 agent

```bash
# 终端 2
pnpm wx agent
```

首次运行会显示二维码，用微信扫码登录。凭证自动保存到 `~/.weixin-claw/credentials.json`，后续无需重复扫码。

### 4. PM2 部署（生产环境）

```bash
# 构建
pnpm build

# 首次登录
pnpm wx login

# 启动服务
pnpm pm2:start
```

两个进程会自动启动：opencode web + weixin-claw agent。

## 核心功能详解

### AI 代理模式

启动 agent 后，微信消息会自动路由到 opencode 处理：

```bash
pnpm wx agent
```

**特性：**

- 每个用户独立会话上下文，互不干扰
- 处理期间显示"正在输入..."状态
- 回复超过 4000 字自动分条发送（微信单条消息限制）
- 支持加载历史会话记忆，实现跨天对话
- **LLM 限流自动重试**（新增）：检测到阿里云限流会自动重试 2 次

**微信内可用指令：**

| 指令                   | 说明                            |
| ---------------------- | ------------------------------- |
| `/新会话` 或 `/new`    | 归档当前对话并创建新会话        |
| `/新会话 路径`         | 归档 + 切换到指定目录开始新会话 |
| `/任务` 或 `/tasks`    | 查看定时任务列表                |
| `/记忆` 或 `/memory`   | 查看历史记忆列表                |
| `/记忆 N`              | 加载第 N 条历史记忆到当前会话   |
| `/会话` 或 `/sessions` | 查看所有会话记录                |
| `/cd 路径`             | 切换 AI 工作目录                |
| `/pwd`                 | 查看当前工作目录                |

除指令外，也可用自然语言：

- "5分钟后提醒我开会" → 创建一次性提醒
- "帮我每天早上9点收集热点" → 创建定时任务
- "取消任务" → AI 列出任务让你选择
- "加载之前的对话" → AI 匹配并加载历史记忆
- "切换到XX目录" → 切换工作目录

### 自然语言定时任务

这是我最喜欢的功能。在微信里说一句人话，系统自动创建定时任务：

```
微信发: "帮我每天早上9点收集热点新闻"
→ 系统解析: cron="0 9 * * *", prompt="收集今日热点新闻"
→ 回复: "✅ 定时任务已创建！ #1 每天09:00 收集今日热点新闻"
```

**支持的意图关键词：**

`每天` `每日` `每周` `每月` `每小时` `每隔` `定时` `定期` `提醒我` `帮我盯` `帮我监控` `帮我关注`

**任务管理：**

```
/tasks          → 查看所有定时任务
取消任务 #1      → 取消指定任务
```

定时任务持久化到 `schedules.json`，agent 重启后自动加载恢复。

### 历史记忆

每次用 `/new` 或 `/新会话` 结束对话时，AI 会自动生成会话总结，保存为历史记忆。下次对话时可以加载：

```
微信: /记忆          → 查看记忆列表
微信: /记忆 1       → 加载第 1 条记忆到当前会话
```

AI 也会根据对话上下文，智能判断是否需要加载相关记忆。

### 消息通知

一行代码发微信通知，适合各种自动化场景：

```bash
# CLI 方式
pnpm wx send --text "部署完成！"
pnpm wx send --to "other@im.wechat" --text "消息内容"

# Crontab 集成
0 * * * * cd /path/to/weixin-claw && pnpm wx send --text "$(opencode run '检查今日热点')"
```

编程式调用：

```typescript
import { notify } from "./src/notifier/index.js"

await notify("后台数据异常！请立即检查")
await notify("指定目标", { to: "other@im.wechat" })
```

### 工作目录切换

这是重构后新增的功能，可以在不同项目间切换，让 AI 处理不同的项目：

```
微信: /cd /root/workspace/mindflow
→ 回复: 📂 工作目录已切换到: /root/workspace/mindflow

微信: 帮我看一下最新一篇的文章
→ AI 会在 mindflow 目录下查找文章
```

## 实际使用场景

### 场景一：盯数据

我有一个后台服务，需要定期检查状态。用 weixin-claw 创建定时任务：

```
微信: "帮我每小时检查一次服务器状态"
```

到点后，AI 自动执行检查命令，把结果推送到微信。如果一切正常，一条简短的「✅ 服务器正常」；如果有异常，详细报告问题。

### 场景二：每日热点收集

```
微信: "每天早上8点收集今天的科技热点"
```

系统创建 cron 任务 `0 8 * * *`，每天早上 8 点自动执行，结果推送到微信。我起床就能看到今日热点摘要。

### 场景三：远程执行命令

在外面不方便开电脑，但需要查点东西：

```
微信: "帮我查一下今天 git 提交了几次"
```

AI 收到消息，执行 `git log --since=today --oneline | wc -l`，把结果回复到微信。

### 场景四：提醒功能

```
微信: "30分钟后提醒我开会"
```

系统创建一次性提醒，30 分钟后推送提醒消息到微信。

### 场景五：多项目管理

```
微信: /new /root/workspace/mindflow
微信: 帮我看看这个项目最近更新了什么
```

可以在不同项目目录间切换，AI 自动使用对应项目的上下文。

## 与 OpenCode Web 的配合

weixin-claw 不是要替代 OpenCode Web，而是互补：

- **OpenCode Web**：主动开发场景，需要文件管理、终端操作、项目级上下文
- **weixin-claw**：被动响应场景，快速查询、定时监控、移动中交互、多项目切换

两个工具共用同一个 opencode 后端和免费模型，成本都是 0。

我的日常工作流：

1. 项目开发 → OpenCode Web（浏览器，完整开发环境）
2. 快速查询/监控 → weixin-claw（微信，随时随地）
3. 写作发文 → OpenCode Web + 微信公众号助手（前两篇文章已介绍）

## 适合谁用

**推荐 weixin-claw：**

- 做技术自媒体，需要定时收集素材
- 独立开发者，需要监控服务状态
- 想用微信作为 AI 交互界面，不想装额外 App
- 需要低成本/零成本的自动化方案
- 需要在多个项目间切换使用 AI

**可能不适合：**

- 需要复杂 GUI 交互的场景
- 需要处理图片、语音等多媒体消息
- 企业级多用户协作需求

## 总结

weixin-claw 的核心理念是：**用最简单的方式，让 AI 能力触手可及**。

不需要复杂配置，不需要付费模型，不需要额外 App。一个微信、一台服务器、几分钟部署，就能拥有一个能听懂人话、能定时干活、能主动通知的 AI 助手。

配合前两篇文章介绍的 OpenCode Web 和移动发文工作流，就形成了一套完整的零成本 AI 工作流：

| 场景               | 工具                  | 成本 |
| ------------------ | --------------------- | ---- |
| 项目开发           | OpenCode Web          | 0 元 |
| 技术写作           | OpenCode Web + Skills | 0 元 |
| 移动发文           | 微信公众号助手        | 0 元 |
| 监控/查询/定时任务 | weixin-claw           | 0 元 |

全套工具，零成本，随时随地可用。

## 联系我

- 微信：扫码关注公众号「富阳说」
- GitHub：https://github.com/daifuyang
- 博客：https://mindflow.zerocmf.com

如果本文对你有帮助，点个赞让更多人看到。有问题欢迎评论区聊聊。

---

_weixin-claw 开源地址：[github.com/daifuyang/weixin-claw](https://github.com/daifuyang/weixin-claw)_
