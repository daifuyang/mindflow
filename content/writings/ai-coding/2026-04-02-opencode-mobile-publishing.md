---
title: "手机发文的秘密：OpenCode + Markdown + 微信公众号助手，随时随地发布技术文章"
date: 2026-04-02
status: published
url: "https://mp.weixin.qq.com/s/pfJ7bIMa4okXMNv_ObGc1Q"
platform:
  - 掘金
  - 微信公众号
tags:
  - AI辅助开发
  - OpenCode
  - 技术自媒体
  - 工作流
  - 微信公众号
order: 2
---

# 手机发文的秘密：OpenCode + Markdown + 微信公众号助手，随时随地发布技术文章

> **富阳说：做 1000 个 AI 工具，让每个人享受 AI 便利。**

作为一个技术自媒体作者，我最大的痛点不是写不出内容，而是「写文章太依赖电脑」。

传统的流程是这样的：打开电脑 → 打开编辑器 → 写 Markdown → 复制到公众号后台 → 排版 → 预览 → 发布。整个过程至少要在电脑前坐一个小时，而且中间不能中断。

后来我摸索出了一套全新的工作流：**OpenCode + Markdown + 微信公众号助手**，让我可以在手机上完成从写作到发布的全流程。今天分享一下这套工作流，希望能帮到同样做技术自媒体的朋友。

## 我的痛点

做技术自媒体的人应该都有同感：

- 灵感来了，但身边没有电脑，记不住
- 文章写到一半要出门，回来重新进入状态很难
- 公众号后台排版麻烦，每次都要折腾格式
- 想利用碎片时间写文章，但手机上的编辑体验太差

这些问题叠加起来，导致发文频率一直上不去。我给自己定的目标是每周 2 篇，但实际经常一周都写不出一篇。

## 新工作流的三个核心组件

### 1. OpenCode：AI 写作助手

OpenCode 是我目前最顺手的 AI 编程工具。它不只是写代码，写文章同样好用。

我把它部署在公网服务器上，配合免费模型使用，成本为 0。关键是它的 **Skills 系统**——我创建了一个写作规范 Skill，里面记录了：

- 我的写作风格（口语化、接地气、少用专业术语）
- 文章结构模板（开头引入 → 痛点分析 → 方案介绍 → 实操步骤 → 总结）
- 常用格式规范（代码块、引用、表格的使用方式）
- 我的个人签名和固定开头结尾

每次跟 AI 对话，它自动加载这些信息，不需要我重复说明。

### 2. Markdown + MindFlow：跨平台内容载体

所有文章都用 Markdown 格式编写，存在 Git 仓库里。好处很明显：

- **纯文本**，任何设备都能编辑
- **版本管理**，git 记录每次修改
- **格式统一**，不需要在不同平台间调整排版
- **AI 友好**，OpenCode 直接读写 .md 文件

为了让这些 Markdown 内容不仅能被 AI 读取，还能作为一个可浏览的知识库网站，我用 Next.js 搭建了一个开源项目：**MindFlow**（[github.com/daifuyang/mindflow](https://github.com/daifuyang/mindflow)）。

MindFlow 的核心思路很简单：**文件系统即数据库**。内容以 `.md` 文件存放，Next.js 在构建时自动扫描目录、解析 frontmatter、生成静态网站。不需要数据库，不需要后端 API，部署就是把静态文件复制到服务器。

我的文章仓库结构是这样的：

```
content/
├── media-planning/
│   ├── content-index.md      # 文章索引
│   ├── task-norms.md         # 写作规范
│   └── articles/
│       └── ai-dev/
│           └── 2026-04-01-opencode-web-vs-openclaw.md
└── about/
    └── daifuyang.md           # 个人介绍
```

在线演示：[shuo.daifuyang.com](https://shuo.daifuyang.com)

### 3. 微信公众号助手：手机发布

微信公众号助手是官方出的 App，支持从手机直接发布文章。配合前面的 Markdown 工作流，流程变成：

1. 在 OpenCode 里跟 AI 对话生成文章
2. 文章自动保存为 .md 文件到仓库
3. 复制 Markdown 内容到微信公众号助手
4. 预览、发布

整个过程可以在手机上完成。

## 实际工作流程

### 场景一：灵感来了

走路的时候突然想到一个好选题，掏出手机：

1. 打开 OpenCode Web（浏览器访问我的服务器）
2. 跟 AI 说：「我想写一篇关于 XXX 的文章，帮我列个大纲」
3. AI 输出大纲，我提修改意见
4. 确认大纲后，AI 直接写入 .md 文件

5 分钟搞定选题和大纲，灵感不会跑掉。

### 场景二：碎片时间写作

等地铁、午休的时候：

1. 打开 OpenCode Web
2. 告诉 AI：「继续写昨天那篇文章的第二部分」
3. AI 读取已有的 .md 文件，保持风格一致
4. 逐段生成，我实时调整

不需要打开电脑，碎片时间就能推进进度。

### 场景三：发布文章

文章写完后：

1. OpenCode 里让 AI 做最后检查：「检查格式、错别字、链接」
2. 复制 Markdown 内容
3. 打开微信公众号助手，粘贴
4. 预览确认，点击发布

全程手机操作，不需要碰电脑。

## 这套工作流的优势

**1. 零成本**

OpenCode 接入免费模型，写作成本 0 元。微信公众号助手免费。Markdown 编辑器免费。整套工作流不需要花一分钱。

**2. 随时随地**

只要有手机和网络，就能写作和发布。不再受限于电脑和固定场所。

**3. AI 懂你的风格**

通过 Skills 系统，AI 记住了你的写作习惯。不是每次从零开始教 AI 怎么写，而是 AI 已经知道你的风格，直接输出可用内容。

**4. 内容资产化**

所有文章存在 Git 仓库里，有完整的版本历史。哪天想回顾、修改、或者迁移到其他平台，直接取用。

**5. 效率提升明显**

以前写一篇文章：打开电脑 → 想选题 → 查资料 → 写大纲 → 写正文 → 排版 → 发布，至少 2-3 小时。

现在：手机上跟 AI 对话生成初稿（30 分钟）→ 碎片时间润色（30 分钟）→ 手机发布（5 分钟），总时间大幅缩短，而且大部分时间可以在移动中完成。

## 具体怎么搭建

> 如果你还没接触过 OpenCode，建议先看看我的第一篇文章：
> [AI 编程实战：OpenCode Web 零成本开发工作流，对比 OpenClaw](https://mp.weixin.qq.com/s/HKKTHCLWbHWYigxn43yysQ)
> 里面有完整的部署教程和 Skills 系统介绍。

### 第一步：部署 OpenCode

```bash
# 安装 Node.js（推荐 v20+）
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# 安装 OpenCode
npm install -g opencode

# 启动 Web 服务
opencode web --port 3000 --host 0.0.0.0
```

部署到公网服务器后，手机浏览器就能访问。建议用 PM2 管理进程，保证服务持续运行：

```bash
npm install -g pm2
pm2 start "opencode web --port 3000 --host 0.0.0.0" --name opencode-web
pm2 save
pm2 startup
```

### 第二步：配置 Nginx 反向代理 + SSL

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$host$request_uri;
}
```

### 第三步：配置写作 Skill

在 `~/.config/opencode/skills/` 下创建写作规范文件：

```markdown
# Skill: writing-standards

## 写作风格

- 口语化表达，像跟朋友聊天
- 多用短句，少用长句
- 技术概念用生活化比喻解释

## 文章结构

1. 开头：用痛点或故事引入
2. 正文：分步骤讲解，每步配代码或截图
3. 结尾：总结 + 行动建议

## 固定元素

- 开头引用：「富阳说：做 1000 个 AI 工具，让每个人享受 AI 便利。」
```

配置一次，永久生效。AI 每次对话自动加载，不需要重复说明。

### 第四步：建立文章仓库

```bash
mkdir -p content/media-planning/articles
cd content && git init
```

每篇文章一个 .md 文件，用日期和关键词命名，例如 `2026-04-02-opencode-mobile-publishing.md`。

### 第五步：安装微信公众号助手

在手机应用商店搜索「公众号」，下载官方微信 App。登录后就能在手机上管理文章。

### 完整流程演示

```
手机浏览器 → OpenCode Web → 跟 AI 对话生成文章 → 复制 Markdown
→ 微信公众号助手 → 粘贴 → 预览 → 发布
```

全程 5 分钟，不需要碰电脑。

## 适合谁用

- **技术自媒体作者** — 提高发文频率，利用碎片时间
- **独立开发者** — 记录开发日志，分享技术心得
- **任何想写东西的人** — 降低写作门槛，随时随地开始

---

## 总结

这套工作流的核心思路是：**把写作从「坐在电脑前的仪式」变成「随时随地可以做的事」**。

AI 负责生成内容和保持风格一致，Markdown 负责跨平台兼容，微信公众号助手负责移动端发布。三者配合，让技术写作变得像发朋友圈一样简单。

当然，AI 生成的内容需要人工审核和调整，不能完全依赖。但作为辅助工具，它确实能大幅提升效率。

---

**互动时间：**

- 你平时写文章最大的痛点是什么？欢迎在评论区聊聊
- 如果这套工作流对你有帮助，**点个赞**让更多人看到
- **关注「富阳说」**，后续会分享更多 AI 辅助开发的实战经验
- 想看我演示完整流程？留言告诉我，下期出视频教程
