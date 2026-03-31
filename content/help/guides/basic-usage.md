---
title: 基础用法
description: MindFlow 的基本使用方法
order: 1
---

# 基础用法

## Markdown 语法

MindFlow 支持标准 Markdown 语法以及 GitHub Flavored Markdown (GFM) 扩展。

### 文本格式

- **粗体文本** 使用 `**文本**`
- *斜体文本* 使用 `*文本*`
- ~~删除线~~ 使用 `~~文本~~`
- `行内代码` 使用反引号

### 列表

无序列表：

- 项目一
- 项目二
  - 子项目 A
  - 子项目 B
- 项目三

有序列表：

1. 第一步
2. 第二步
3. 第三步

### 任务列表

- [x] 创建项目
- [x] 安装依赖
- [ ] 编写文档
- [ ] 发布上线

### 代码块

JavaScript 示例：

```javascript
function greet(name) {
  return `Hello, ${name}!`
}

const message = greet('MindFlow')
console.log(message)
```

TypeScript 示例：

```typescript
interface User {
  name: string
  email: string
  role: 'admin' | 'user'
}

function getDisplayName(user: User): string {
  return `${user.name} (${user.role})`
}
```

Python 示例：

```python
def fibonacci(n: int) -> list[int]:
    """生成斐波那契数列"""
    if n <= 0:
        return []
    
    sequence = [0, 1]
    while len(sequence) < n:
        sequence.append(sequence[-1] + sequence[-2])
    
    return sequence[:n]

print(fibonacci(10))
```

### 表格

| 功能 | 状态 | 优先级 |
|------|:----:|-------:|
| Markdown 渲染 | ✅ 完成 | 高 |
| 文件树导航 | ✅ 完成 | 高 |
| 代码高亮 | ✅ 完成 | 中 |
| 全文搜索 | 🚧 开发中 | 中 |
| 版本历史 | 📋 计划中 | 低 |

### 引用

> 知识就是力量。
> — 弗朗西斯·培根

### 链接和图片

[访问 GitHub](https://github.com)

### 分隔线

---

以上就是 MindFlow 支持的基本 Markdown 语法。
