# 知识库 Markdown 查看器 — 实施计划

## 概要

为 MindFlow 项目增加一个知识库功能，支持：
- 从 `/content/` 目录读取 Markdown 文件并渲染展示
- 左侧文件树导航，显示文件夹和文件的层级结构
- 移动端友好的响应式布局（侧边栏自动折叠为抽屉）
- 代码高亮、GFM（GitHub Flavored Markdown）等丰富的 Markdown 渲染能力

## 当前状态分析

- **技术栈**: Next.js 16 (App Router, RSC), React 19, Tailwind CSS v4, shadcn/ui (base-nova), lucide-react, next-themes
- **现状**: 项目处于初始状态，仅有一个首页和 Button 组件
- **优势**: 已配置好暗色模式、shadcn/ui 组件系统、sidebar CSS 变量

## 新增依赖

| 包名 | 用途 |
|------|------|
| `react-markdown` | React Markdown 渲染组件 |
| `remark-gfm` | GFM 支持（表格、任务列表、删除线等） |
| `rehype-highlight` | 代码块语法高亮 |
| `highlight.js` | 高亮主题样式 |
| `gray-matter` | 解析 Markdown frontmatter（标题、描述等元数据） |

## 目录结构规划

```
mindflow/
├── content/                          # Markdown 内容目录
│   ├── getting-started/
│   │   ├── introduction.md
│   │   └── installation.md
│   └── guides/
│       ├── basic-usage.md
│       └── advanced-features.md
├── lib/
│   └── docs.ts                       # 服务端文件读取工具函数
├── app/
│   ├── page.tsx                      # 首页（更新：添加导航链接）
│   └── docs/
│       ├── layout.tsx                # 知识库布局（侧边栏 + 内容区）
│       ├── page.tsx                  # 知识库首页（重定向到第一篇文档）
│       └── [...slug]/
│           └── page.tsx              # 文档内容页
└── components/
    └── knowledge-base/
        ├── file-tree.tsx             # 文件树组件（客户端交互）
        ├── markdown-renderer.tsx     # Markdown 渲染组件
        └── mobile-sidebar.tsx        # 移动端侧边栏抽屉
```

## 详细变更说明

### 1. 安装依赖

```bash
pnpm add react-markdown remark-gfm rehype-highlight highlight.js gray-matter
pnpm add -D @types/hast
```

### 2. `/content/` — 示例 Markdown 文件

创建示例内容供演示使用，包含 frontmatter 元数据：

```yaml
---
title: 介绍
description: 了解 MindFlow 知识库
order: 1
---
```

每个文件夹和文件都会在侧边栏中显示。`order` 字段用于控制排序。

### 3. `/lib/docs.ts` — 服务端工具函数

**职责：**
- `getDocTree()`: 递归扫描 `/content/` 目录，返回文件树结构（包含文件夹和文件，读取 frontmatter 获取标题和排序）
- `getDocContent(slug: string[])`: 根据 slug 路径读取对应的 `.md` 文件，返回 frontmatter + 原始 markdown 内容
- `getFirstDocSlug()`: 获取第一篇文档的 slug（用于首页重定向）

**数据结构：**
```typescript
type TreeNode = {
  name: string
  slug: string
  type: "file" | "folder"
  title?: string
  order?: number
  children?: TreeNode[]
}
```

### 4. `/app/docs/layout.tsx` — 知识库布局

**布局设计：**
- 桌面端：固定左侧侧边栏（260px）+ 右侧内容区
- 移动端：顶部导航栏（含汉堡菜单按钮）+ 全宽内容区
- 侧边栏顶部显示项目名称 "MindFlow"
- 侧边栏内容为文件树

**实现方式：**
- 布局组件为 Server Component，服务端调用 `getDocTree()` 获取文件树数据
- 将文件树数据传给客户端 FileTree 和 MobileSidebar 组件

### 5. `/app/docs/[...slug]/page.tsx` — 文档内容页

**职责：**
- Server Component，从 slug 参数读取 Markdown 文件内容
- 传递内容给 MarkdownRenderer 客户端组件
- 显示文档标题、面包屑导航
- 如果文件不存在，显示 404

### 6. `/app/docs/page.tsx` — 知识库首页

- 重定向到第一篇文档，或显示欢迎页面

### 7. `/components/knowledge-base/file-tree.tsx` — 文件树组件

**功能：**
- 递归渲染文件树，文件夹可折叠/展开
- 当前选中文件高亮
- 使用 lucide-react 图标：`Folder` / `FolderOpen` / `FileText` / `ChevronRight`
- 点击文件导航到对应的 slug
- 支持通过 URL 自动展开对应的文件夹

### 8. `/components/knowledge-base/markdown-renderer.tsx` — Markdown 渲染组件

**功能：**
- 使用 `react-markdown` + `remark-gfm` + `rehype-highlight`
- 自定义样式：标题、段落、列表、表格、代码块、引用、链接等
- 使用 Tailwind 的 `prose` 风格排版（手动实现，不依赖 @tailwindcss/typography）
- 代码块带复制按钮（可选）
- 引入 highlight.js 的主题 CSS

### 9. `/components/knowledge-base/mobile-sidebar.tsx` — 移动端侧边栏

**功能：**
- 汉堡菜单按钮触发
- 从左侧滑出的抽屉（overlay + slide）
- 包含与桌面端相同的文件树
- 点击文件后自动关闭抽屉

### 10. 更新 `/app/page.tsx` — 首页

- 添加一个导航按钮/链接到 `/docs`

## 响应式设计方案

| 断点 | 行为 |
|------|------|
| `< md (768px)` | 侧边栏隐藏，通过汉堡按钮打开抽屉；内容区全宽，padding 减小 |
| `≥ md (768px)` | 固定左侧侧边栏（260px），内容区自适应填充 |

## 暗色模式

- 完全兼容已有的 next-themes 暗色模式
- Markdown 渲染样式和代码高亮主题均适配 dark/light
- highlight.js 使用 `github` / `github-dark` 主题，通过 CSS class 切换

## 假设与决策

1. **Markdown 文件存储在本地 `/content/` 目录**（不使用远程 CMS 或数据库）
2. **使用 Next.js RSC 直接读取文件**，不需要单独的 API Routes
3. **文件排序**通过 frontmatter 的 `order` 字段控制，无 `order` 的按文件名字母排序
4. **侧边栏在 md 断点切换**为移动端抽屉模式
5. **示例内容使用中文**以匹配项目语境

## 验证步骤

1. `pnpm dev` 启动开发服务器
2. 访问 `/docs` 页面，确认重定向到第一篇文档
3. 确认文件树正确显示文件夹和文件
4. 点击不同文件，确认内容正确渲染
5. 缩小浏览器窗口到移动端尺寸，确认侧边栏变为抽屉模式
6. 按 `d` 切换暗色模式，确认所有样式正确适配
7. `pnpm typecheck` 确认无类型错误
8. `pnpm build` 确认构建成功
