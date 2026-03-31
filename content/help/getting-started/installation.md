---
title: 安装指南
description: 如何安装和配置 MindFlow
order: 2
---

# 安装指南

## 环境要求

- Node.js 18+
- pnpm 8+

## 安装步骤

### 1. 克隆项目

```bash
git clone https://github.com/your-org/mindflow.git
cd mindflow
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 启动开发服务器

```bash
pnpm dev
```

访问 [http://localhost:3000/docs](http://localhost:3000/docs) 即可查看知识库。

## 添加内容

在 `content/` 目录下创建 `.md` 文件：

```markdown
---
title: 我的第一篇文档
order: 1
---

# Hello World

这是我的第一篇知识库文档。
```

## 目录结构

```
mindflow/
├── app/            # Next.js 页面
├── components/     # React 组件
├── content/        # Markdown 内容 ← 在这里添加文档
├── lib/            # 工具函数
└── public/         # 静态资源
```

## 常见问题

### 文件不显示？

确保文件扩展名为 `.md`，并且 frontmatter 格式正确。

### 排序不对？

在 frontmatter 中设置 `order` 字段来控制显示顺序：

```yaml
---
title: 文档标题
order: 1  # 数字越小越靠前
---
```
