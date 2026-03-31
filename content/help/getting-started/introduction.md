---
title: 介绍
description: 了解 MindFlow 知识库
order: 1
---

# 欢迎使用 MindFlow

MindFlow 是一个现代化的知识库管理工具，帮助你高效地组织和分享知识。

## 主要特性

- **Markdown 支持** — 使用熟悉的 Markdown 语法编写文档
- **文件夹管理** — 通过文件夹结构组织你的知识
- **代码高亮** — 支持多种编程语言的语法高亮
- **暗色模式** — 内置明暗主题切换
- **移动端适配** — 在任何设备上都能流畅浏览

## 快速开始

将你的 `.md` 文件放入 `content/` 目录即可开始使用：

```
content/
├── getting-started/
│   ├── introduction.md
│   └── installation.md
└── guides/
    ├── basic-usage.md
    └── advanced-features.md
```

每个 Markdown 文件支持 frontmatter 元数据：

```yaml
---
title: 文档标题
description: 文档描述
order: 1
---
```

## 技术栈

| 技术 | 用途 |
|------|------|
| Next.js | 全栈 React 框架 |
| Tailwind CSS | 原子化 CSS |
| react-markdown | Markdown 渲染 |
| highlight.js | 代码语法高亮 |

> 💡 **提示**: 按 `D` 键可以快速切换暗色模式。
