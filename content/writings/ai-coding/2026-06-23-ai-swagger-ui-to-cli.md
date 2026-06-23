---
title: "AI 时代，建议你认真写 Swagger：从接口文档到 AI 可调用 CLI"
date: 2026-06-23
status: published
platform:
  - 掘金
  - 微信公众号
tags:
  - AI辅助开发
  - Swagger
  - OpenAPI
  - CLI
  - MCP
  - Agent
order: 8
---

# AI 时代，建议你认真写 Swagger：从接口文档到 AI 可调用 CLI

> **富阳说：做 1000 个 AI 工具，让每个人享受 AI 便利。**

很多团队写 Swagger UI，只是为了“有个接口文档”。

这在过去没问题。Swagger 的主要读者是前端、后端、测试和新同事。大家打开页面，看一下接口地址、请求参数和返回结构，然后开始联调。

但到了 AI 时代，Swagger / OpenAPI 的价值变了。

它不只是接口文档，而是你的系统能力说明书。

只要 Swagger 写得足够规范，AI 就可以基于它快速生成：

| 生成物 | 价值 |
|---|---|
| CLI | 让 AI 和人都能通过命令行稳定调用系统能力 |
| SDK | 给业务代码、脚本和自动化流程复用 |
| MCP Tool | 让 Agent 通过标准工具协议访问内部系统 |
| 测试用例 | 根据请求参数、响应结构和错误码生成接口测试 |
| 自动化脚本 | 把多个 API 编排成业务流程 |

我现在越来越建议：如果你负责一个系统、一个平台、一个内部服务，请认真写好 Swagger。

因为未来很多系统接入 AI 的第一步，可能不是做一个炫酷聊天框，而是先把 API 变成 AI 能稳定调用的工具。

```text
Swagger / OpenAPI -> SDK -> CLI -> MCP Tool -> AI Agent
```

这条链路会越来越重要。

## 为什么 Swagger 对 AI 这么重要

AI 要调用一个系统，最怕的不是接口多，而是接口信息不清楚。

如果接口信息只存在于代码里、飞书文档里、历史聊天记录里，AI 很难稳定使用。

它不知道：

| 问题 | 影响 |
|---|---|
| 有哪些接口 | 不知道系统能做什么 |
| 参数怎么传 | 容易生成错误请求 |
| 哪些字段必填 | 调用失败率高 |
| 枚举值有哪些 | 经常传错状态、类型、模式 |
| 返回结构是什么 | 不知道下一步该取哪个字段 |
| 错误码怎么处理 | 无法自动重试或给出明确提示 |
| 鉴权方式是什么 | 调用链路无法闭环 |

但如果这些信息都在 OpenAPI 里，AI 就能把它当成一张系统地图。

过去我们讲 API First，更多是为了工程协作。

现在我觉得要升级成：**AI Callable First**。

也就是一个接口从设计开始，就要考虑它能不能被 AI 理解、调用和组合。

## 不要只写“能看”的 Swagger，要写“能生成工具”的 Swagger

很多 Swagger 页面看起来很完整，但真拿去生成 CLI 或 MCP Tool 时会发现问题很多。

比如：

```yaml
summary: 查询列表
description: 查询列表
operationId: getList
```

这对人来说勉强能猜，对 AI 来说信息太少。

如果你希望 Swagger 能进一步生成 CLI，至少要做好下面几件事。

## 1. operationId 要稳定，而且像命令名

`operationId` 是生成 SDK 方法名和 CLI 命令名的关键。

不推荐：

```yaml
operationId: getList
```

推荐：

```yaml
operationId: listProjectTasks
```

这样可以自然生成：

```bash
mindflow project task list
```

或者：

```bash
mindflow list-project-tasks
```

命名建议：

| 动作 | 推荐前缀 |
|---|---|
| 查询列表 | `list` |
| 查询详情 | `get` |
| 创建 | `create` |
| 更新 | `update` |
| 删除 | `delete` |
| 执行动作 | `run` / `execute` / `trigger` |
| 状态流转 | `approve` / `reject` / `close` / `archive` |

一个好的 `operationId`，应该直接能变成命令。

## 2. summary 写给人看，description 写给 AI 看

不推荐：

```yaml
summary: 更新
description: 更新
```

推荐：

```yaml
summary: 更新任务状态
description: 将指定任务更新为目标状态。常用于看板拖拽、任务流转和自动化工作流。只能更新当前用户有权限访问的任务。
```

CLI 的帮助信息可以直接复用这些内容：

```bash
mindflow task update-status --help
```

输出类似：

```text
更新任务状态

将指定任务更新为目标状态。常用于看板拖拽、任务流转和自动化工作流。
只能更新当前用户有权限访问的任务。
```

这对人有用，对 AI 也有用。

AI 在选择工具时，非常依赖这些自然语言描述。

## 3. 参数必须有类型、枚举和业务说明

不推荐：

```yaml
status:
  type: string
  description: 状态
```

推荐：

```yaml
status:
  type: string
  enum:
    - TODO
    - DOING
    - DONE
  description: 任务状态。TODO 表示待处理，DOING 表示进行中，DONE 表示已完成。为空时返回全部状态。
```

这样 CLI 可以自动生成参数校验：

```bash
mindflow task list --project-id p_001 --status TODO
```

如果传错：

```bash
mindflow task list --project-id p_001 --status FINISHED
```

CLI 可以直接提示：

```text
Invalid value: FINISHED. Expected one of TODO, DOING, DONE.
```

这比让 AI 直接猜字段值稳定得多。

## 4. 返回值必须有 schema 和 example

AI 很依赖返回结构。

如果没有响应结构，它不知道下一步该取哪个字段。

推荐写法：

```yaml
responses:
  "200":
    description: 查询成功
    content:
      application/json:
        schema:
          $ref: "#/components/schemas/TaskListResponse"
        example:
          items:
            - id: "task_001"
              title: "完成接口文档"
              status: "DOING"
          total: 1
```

这样 AI 才知道：

```text
任务 ID 在 items[].id
任务标题在 items[].title
任务状态在 items[].status
```

如果你希望 AI 编排多个接口，返回结构尤其重要。

## 写好了 Swagger，怎么支持 CLI

大体分两类。

| 场景 | 推荐方式 |
|---|---|
| 简单项目、内部工具、接口较少 | 直接让 AI 根据 OpenAPI 生成 CLI |
| 复杂系统、长期维护、接口很多 | 用通用方案生成 SDK，再工程化封装 CLI |

## 简单项目：直接让 AI 生成 CLI

如果你的接口数量不多，比如几十个以内，可以直接把 `openapi.yaml` 交给 AI，让它生成一个 CLI。

常见技术栈：

| 技术栈 | 适合场景 |
|---|---|
| Node.js + commander | 简单、轻量、上手快 |
| Node.js + oclif | 复杂 CLI、多级命令、插件化 |
| Python + typer | Python 脚本和内部自动化 |
| Python + click | Python 生态成熟选择 |
| Go + cobra | 单文件分发、运维工具、云原生工具 |

你可以这样要求 AI：

```text
请根据 openapi.yaml 生成一个 Node.js CLI。

要求：
1. 使用 commander。
2. 每个 operationId 生成一个命令。
3. path 参数转成必填 option。
4. query 参数转成 option。
5. requestBody 支持从 JSON 文件读取，也支持命令行参数。
6. 支持 --base-url。
7. 支持 --token，自动加 Authorization: Bearer。
8. 响应默认格式化输出 JSON。
9. 支持 --output json|table。
10. 生成 README 和使用示例。
```

最终你可能得到这样的命令：

```bash
mindflow task list --project-id p_001 --status TODO
mindflow task get --task-id t_001
mindflow task update-status --task-id t_001 --status DONE
```

这种方式适合快速验证。

优点是快，半小时到一小时就能跑起来。

缺点也明显：接口一多，命令组织、鉴权、分页、错误处理、版本升级都会变复杂。

所以简单项目可以直接 AI 生成，复杂项目建议工程化。

## 复杂项目：OpenAPI -> SDK -> CLI

复杂项目我更推荐这条路线：

```text
OpenAPI -> 生成 SDK -> 基于 SDK 封装 CLI -> 发布 npm / pip / brew / docker
```

原因很简单：SDK 是稳定调用层，CLI 是人机交互层。

直接从 OpenAPI 生成 CLI 当然可以，但长期维护时，你会希望把请求封装、鉴权、重试、分页、错误处理沉到 SDK 里。

CLI 只负责：

| CLI 负责 | SDK 负责 |
|---|---|
| 命令组织 | HTTP 请求 |
| 参数解析 | 鉴权 |
| 输出格式 | 重试 |
| 交互提示 | 分页 |
| 帮助文档 | 错误映射 |

这个边界更清晰。

## 推荐方案 1：OpenAPI Generator

地址：

```text
https://openapi-generator.tech/
```

OpenAPI Generator 是最成熟的开源方案之一，可以从 OpenAPI 2.0 / 3.x 生成客户端 SDK、服务端 Stub、文档和配置。

它适合先生成 SDK：

```bash
openapi-generator-cli generate \
  -i openapi.yaml \
  -g typescript-axios \
  -o ./generated/sdk
```

然后你再基于生成的 SDK 封装 CLI。

推荐组合：

```text
OpenAPI Generator + TypeScript SDK + oclif / commander
```

适合：

| 场景 | 说明 |
|---|---|
| 自建内部平台 | 不想依赖商业服务 |
| 多语言 SDK | OpenAPI Generator 支持语言非常多 |
| 团队有工程能力 | 可以维护模板和生成流程 |
| API 变化频繁 | 可以放进 CI 自动重新生成 |

它的优点是开源、成熟、可控。

缺点是它不是专门为“生成好用 CLI”设计的，通常还需要你自己补命令层。

## 推荐方案 2：oclif

地址：

```text
https://oclif.io/
```

`oclif` 是 Node.js / TypeScript 生态里很成熟的 CLI 框架，Heroku CLI、Salesforce CLI 都在用它。

它适合做复杂 CLI：

| 能力 | 价值 |
|---|---|
| 多级子命令 | `app task list`、`app project create` 这类结构很好组织 |
| 插件机制 | 适合大型平台扩展 |
| 自动帮助文档 | CLI 自解释能力更强 |
| 命令测试 | 适合长期维护 |
| npm 发布 | 前端和 Node.js 团队使用方便 |

推荐结构：

```text
openapi.yaml
  -> 生成 TypeScript SDK
  -> oclif 命令调用 SDK
  -> 发布 CLI
```

最终命令可以设计成：

```bash
mindflow task list
mindflow task create
mindflow task update-status
mindflow project list
mindflow workflow run
```

如果你要做企业级 CLI，`oclif` 是一个很稳的选择。

## 推荐方案 3：Fern

地址：

```text
https://buildwithfern.com/
```

Fern 的定位很明确：从一份 API 定义生成 Docs、SDK 和 CLI。

它更像一套开发者体验平台：

```text
OpenAPI / Fern Definition -> Docs + SDKs + CLI
```

适合：

| 场景 | 说明 |
|---|---|
| 对外开放平台 | 文档、SDK、CLI 都要有一致体验 |
| 不想自研模板 | 生成质量和维护成本更可控 |
| API 是产品能力 | CLI 和 SDK 是开发者体验的一部分 |
| 希望面向 AI 优化 | Fern 也强调 `llms.txt`、MCP、AI 搜索等能力 |

如果你的 API 是要给外部开发者用的，而不是只给内部脚本用，Fern 值得评估。

## 推荐方案 4：Stainless

地址：

```text
https://www.stainless.com/
```

Stainless 主要强调从 OpenAPI 生成高质量 SDK、文档和 MCP Server。

它不一定是“生成 CLI”的首选，但如果你的目标是让 AI Agent 调用 API，它很值得关注。

它的路线更接近：

```text
OpenAPI -> SDK + Docs + MCP
```

适合：

| 场景 | 说明 |
|---|---|
| 对外 API 平台 | SDK 质量很重要 |
| 面向 Agent 集成 | MCP Server 是关键产物 |
| 需要更好开发者体验 | 文档和 SDK 保持同步 |

如果你最终目标不是人手动敲 CLI，而是 AI Agent 通过 MCP 调用，那 Stainless 这类方案会更贴近终局。

## 推荐方案 5：Speakeasy

地址：

```text
https://www.speakeasy.com/
```

Speakeasy 现在更偏 AI Control Plane、MCP、安全治理和 Agent 接入控制。

如果你的重点是“内部 API 给 AI 安全调用”，它的方向值得看。

适合：

| 场景 | 说明 |
|---|---|
| 企业内部 AI 工具治理 | 管控哪些 Agent 能调用哪些工具 |
| MCP Server 管理 | 让内部 API 以 MCP 方式暴露 |
| 权限和审计 | 避免 AI 工具越权或泄露数据 |
| 安全合规 | 需要统一策略、日志和访问控制 |

如果你只是想生成一个简单 CLI，它可能偏重。

如果你要做企业级 AI API 接入层，它值得评估。

## 一个通用 CLI 生成器应该怎么设计

如果你要自研通用方案，可以按这个思路做。

输入：

```text
openapi.yaml
```

解析这些信息：

| OpenAPI 字段 | CLI 用途 |
|---|---|
| `paths` | 生成命令入口 |
| `operationId` | 生成命令名 |
| `tags` | 生成命令分组 |
| `parameters` | 生成 options |
| `requestBody` | 生成 `--data`、`--file` 或字段参数 |
| `responses` | 生成输出处理和文档 |
| `securitySchemes` | 生成鉴权配置 |

命令生成规则可以这样定：

| OpenAPI | CLI |
|---|---|
| `tags: [task]` | `mindflow task` |
| `operationId: listTasks` | `mindflow task list` |
| path 参数 | 必填 option |
| query 参数 | 可选 option |
| requestBody | `--data` 或 `--file` |
| response schema | 输出格式化 |

例如 OpenAPI：

```yaml
paths:
  /projects/{projectId}/tasks:
    get:
      tags:
        - task
      operationId: listTasks
      summary: 查询任务列表
```

生成 CLI：

```bash
mindflow task list --project-id p_001
```

再增强一点：

```bash
mindflow task list --project-id p_001 --status TODO --output table
mindflow task list --project-id p_001 --status TODO --output json
```

## CLI 必须内置这些能力

如果 CLI 是给 AI 调用的，不要只做“能请求接口”。

建议至少内置：

| 能力 | 作用 |
|---|---|
| `--base-url` | 支持不同环境 |
| `--token` | 支持临时鉴权 |
| `login` / `logout` | 支持本地凭据管理 |
| `whoami` | 检查当前身份 |
| `--output json\|table\|yaml` | 兼顾 AI 解析和人类阅读 |
| `--debug` | 排查请求问题 |
| `--timeout` | 避免 Agent 卡死 |
| 自动分页 | 列表接口更好用 |
| 错误码格式化 | AI 可以根据错误自动修正 |
| 日志脱敏 | 防止 token、手机号、密钥泄露 |

尤其是输出格式。

给 AI 用，默认推荐 JSON：

```bash
mindflow task list --project-id p_001 --output json
```

给人用，可以输出 table：

```bash
mindflow task list --project-id p_001 --output table
```

## 为什么 CLI 比直接让 AI 调 HTTP 更好

很多人会问：AI 不是可以直接调 API 吗？为什么还要 CLI？

因为 CLI 是 API 和 AI 之间一个很好的安全边界。

直接调 HTTP，AI 需要关心：

| 直接 HTTP 的问题 | CLI 的处理方式 |
|---|---|
| URL 怎么拼 | CLI 内部处理 |
| Header 怎么写 | CLI 自动注入 |
| Token 放哪 | CLI 统一读取配置 |
| Body 怎么构造 | CLI 做参数校验 |
| 返回怎么解析 | CLI 统一输出 JSON |
| 错误怎么处理 | CLI 格式化错误信息 |
| 危险接口怎么限制 | CLI 做命令级权限收敛 |

用了 CLI，AI 只需要：

```bash
mindflow task list --status TODO
```

这比让 AI 自己构造 HTTP 请求稳定得多。

更重要的是，CLI 可以收敛能力。

你不一定要把所有 API 都暴露给 AI，可以只暴露经过设计的命令：

```text
允许：mindflow task list
允许：mindflow task update-status
禁止：mindflow user delete
禁止：mindflow billing refund
```

这比把整个 API 文档直接丢给 Agent 更安全。

## 我推荐的落地路线

如果你是小团队或内部系统，推荐：

```text
Swagger -> AI 生成 CLI -> 人工 Review -> 内部使用
```

如果你是中型系统或多接口平台，推荐：

```text
Swagger -> OpenAPI Generator 生成 SDK -> oclif 封装 CLI
```

如果你是对外开放平台，推荐：

```text
OpenAPI -> Fern / Stainless -> Docs + SDK + CLI / MCP
```

如果你是企业内部 AI 平台，推荐重点关注：

```text
OpenAPI -> CLI / MCP -> 权限控制 -> 审计 -> Agent 调用
```

可以评估 Speakeasy 这类偏治理和安全的方案。

## 最后总结

AI 时代，Swagger 不只是接口文档。

它是系统能力的结构化入口。

写好 Swagger，本质上是在做一件事：让你的系统能力可以被人理解，也可以被 AI 调用。

简单系统，可以直接让 AI 根据 Swagger 生成 CLI。

复杂系统，建议走：

```text
Swagger / OpenAPI -> SDK -> CLI -> MCP -> Agent
```

可选方案大致是：

| 方案 | 推荐用途 |
|---|---|
| OpenAPI Generator | 开源生成 SDK，自建 CLI 的基础 |
| oclif | 构建复杂 Node.js / TypeScript CLI |
| Fern | 从 API 定义生成 Docs、SDK、CLI |
| Stainless | 生成高质量 SDK、Docs、MCP |
| Speakeasy | 企业级 MCP、Agent 安全治理和访问控制 |

我现在会建议团队做 API 时多加一条标准：

```text
这个接口不仅要人能看懂，还要 AI 能调用。
```

而第一步，就是把 Swagger 写好。
