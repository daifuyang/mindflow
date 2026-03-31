---
title: 高级功能
description: MindFlow 的高级功能介绍
order: 2
---

# 高级功能

## 文件夹组织

MindFlow 使用文件系统作为内容组织方式。你可以通过创建嵌套文件夹来构建知识体系：

```
content/
├── 前端开发/
│   ├── React/
│   │   ├── hooks.md
│   │   └── patterns.md
│   └── CSS/
│       ├── flexbox.md
│       └── grid.md
├── 后端开发/
│   ├── Node.js/
│   └── 数据库/
└── 运维部署/
    ├── Docker/
    └── CI-CD/
```

## Frontmatter 配置

每个 Markdown 文件支持以下 frontmatter 字段：

```yaml
---
title: 文档标题        # 显示在侧边栏和页面顶部
description: 文档描述  # 可选，用于 SEO 和预览
order: 1              # 排序权重，数字越小越靠前
---
```

### 排序规则

1. 有 `order` 字段的文件按数字升序排列
2. 没有 `order` 字段的文件按文件名字母排序
3. 文件夹同样遵循此规则

## 代码高亮

支持的语言包括但不限于：

- JavaScript / TypeScript
- Python
- Go
- Rust
- Java
- C / C++
- Shell / Bash
- JSON / YAML
- HTML / CSS
- SQL

### 示例：Go 代码

```go
package main

import "fmt"

func main() {
    messages := []string{"Hello", "MindFlow"}
    for _, msg := range messages {
        fmt.Println(msg)
    }
}
```

### 示例：Rust 代码

```rust
fn main() {
    let numbers: Vec<i32> = (1..=10).collect();
    let sum: i32 = numbers.iter().sum();
    println!("Sum of 1 to 10: {}", sum);
}
```

## 暗色模式

MindFlow 完全支持暗色模式：

- 按 `D` 键快速切换
- 跟随系统主题自动切换
- 代码高亮自动适配当前主题

## 响应式设计

MindFlow 针对不同设备进行了优化：

- **桌面端**: 左侧固定侧边栏 + 右侧内容区
- **平板**: 侧边栏可折叠
- **手机**: 汉堡菜单触发抽屉式侧边栏，内容区全屏展示
