<!--
SYNC IMPACT REPORT
==================
Version change: 1.0.0 → 1.0.0 (RE-AFFIRMATION - no changes)
Bump rationale: 用户通过 /speckit.constitution 重新确认宪法内容，无实质变更
Modified principles: (none)
Added sections: (none)
Removed sections: (none)
Templates requiring updates:
  - .specify/templates/spec-template.md — ✅ 无需改动（占位符模板已对齐）
  - .specify/templates/plan-template.md — ✅ 无需改动（Constitution Check 段已引用本文件）
  - .specify/templates/tasks-template.md — ✅ 无需改动（占位符模板已对齐）
  - .specify/templates/constitution-template.md — ✅ 无需改动
  - .specify/templates/checklist-template.md — ✅ 无需改动
Deferred items: (none)
-->

# Mindflow Constitution

## Core Principles

### I. 静态优先与 SSG 边界

所有面向公众的内容必须经由 `pnpm build` 产出的 `out/` 静态文件对外提供；运行时不依赖数据库即可访问 `about/ writings/ prompts/ help/` 的内容。

- Next.js App Router 仍用于 SSG 构建与本地预览（`pnpm dev` / `pnpm start`），但**生产路径必须可静态托管**（Nginx 直接服务 `out/`，与 README 一致）。
- 任何对页面渲染路径的改动 MUST 保持 `next build` 静态导出的能力；引入必须运行时的数据获取时，仅限管理员/登录态相关路由（`app/admin/**`、`app/api/**`、`app/login/**`），**不得**把运行时数据获取塞进公开页。
- `out/` 目录 MUST NOT 进入版本控制；`.gitignore` 已默认忽略，构建产物仅用于部署。

### II. 内容源契约（content/ + frontmatter）

`content/` 下的 Markdown 是唯一权威内容源；`lib/docs.ts` 是其访问入口。

- 每篇 `.md` 文件的 frontmatter MUST 至少包含 `title / date / status / platform / tags` 五个字段（README 已强制）。`status` 的合法值集合为 `draft | planned | drafting | review | ready | published | reviewed`，任何迁移至新值需在本宪法中同步登记。
- 文件夹名 MUST 保持英文；中文显示名通过同级 `_meta.json` 的 `title` 字段提供，`order` 控制同级排序。
- 文件命名 MUST 遵循 `YYYY-MM-DD-关键词.md`；不在文件名里出现版本号或中文。
- 任何对 frontmatter 的修改 MUST 经由 `lib/docs.ts` 或其衍生工具（解析用 `gray-matter`）；禁止在业务代码里直接字符串拼接 frontmatter。

### III. 数据库与 Prisma 7

运行时数据（登录态、todos、私密文档、未来的发布历史等） MUST 经由 Prisma 7 持久化到 SQLite（`prisma/dev.db`）。

- 新增数据模型 MUST 先在 `prisma/schema.prisma` 中定义并生成 migration（`prisma migrate dev`）后才能在代码中使用。
- 客户端 MUST 走 `prisma.config.ts` + `generated/prisma`（由 `prisma generate` 产物）；禁止运行时拉新表结构。
- 所有时间字段使用 UTC；前端展示层做时区转换（项目当前为单作者单时区，不引入时区字段）。
- 严禁在 SQLite 中存放真实凭据原文（token、密码明文、手机号、邮箱明文等）；登录密码 MUST 走 `bcryptjs` 哈希（`User.passwordHash`）。

### IV. 私密区隔离（build-time 排除）

`content/private/` 目录的内容 MUST 在 SSG 时被完全排除（`lib/docs.ts:50` 的"私密区跳过"逻辑是唯一权威）。

- 公开页（`app/docs/**`、`app/page.tsx` 公开部分） MUST 不读取 `content/private/**`；管理员页面读取时 MUST 校验登录态。
- 任何新增的"私密"类目录 MUST 复用 `lib/docs.ts` 的目录白名单/`PRIVATE_DIR` 逻辑，**禁止**在业务代码里另写一份过滤。
- SSG 构建产物 MUST NOT 包含 `content/private/**` 的任何标题、路径或正文片段（即便没有正文，路径也不应出现）。

### V. 部署链路（pnpm build → pnpm deploy → pm2）

部署 MUST 严格走 `pnpm build` 产出 `out/`，再由 `pnpm deploy`（`pm2 restart mindflow`）接管；任何"直接编辑 `out/`"或"绕过 `pnpm build`"的路径都是非法的。

- 部署前 `git status` MUST 干净（由宪法加严；README 仅约定手工部署顺序，**本宪法将"干净工作区"提为强制门禁**，以避免把半成品 out 推到线上）。
- `pnpm deploy` 只重启进程；它 MUST NOT 触发 `next build`，构建与部署是两个独立动作。
- 任何对部署的临时绕过（如手动 `scp`、直接改 `out/`） MUST 事后回到正路并清理 `out/` 残留。

### VI. 安全与凭据卫生

- 第三方平台 token（公众号、掘金、知乎等） MUST 仅在服务端路由（`app/api/**`）使用，且**只放在**服务端环境变量 / 配置中心（`.env.local`、PM2 环境注入等），**严禁**在客户端组件、Markdown frontmatter、客户端 `lib/` 中以任何形式出现。
- 严禁把 `.env`、`.env.local`、`generated/`、`dev.db`、`out/`、`.next/` 提交到版本控制；`.gitignore` 必须保持正确。
- 任何在内容/前端的输入（搜索框、登录表单、文章正文） MUST 不被反射回 HTML 不转义的位置（项目已用 `react-markdown` + `rehype-highlight`，新增渲染面要复用同一套）。
- 管理员/作者身份认证 MUST 复用 `app/api/auth` + `User` 表；新增受保护路由 MUST 走相同中间件，禁止另起一套。

### VII. 频道划分与命名

频道划分固定为 6 类，不增不减；`order` 用于显示顺序，新增频道必须在文档中给出放置位置（默认 `help` 置末，`order=99`）。

| 频道        | 回答的问题             | 公开性               |
| ----------- | ---------------------- | -------------------- |
| `about/`    | 我是谁                 | 公开                 |
| `writings/` | 我在想什么、我写了什么 | 公开                 |
| `projects/` | 我在做什么             | 私密优先（isPublic） |
| `prompts/`  | 我怎么和 AI 协作       | 公开                 |
| `help/`     | 这个站怎么用           | 公开                 |
| `private/`  | 完全私密的内部资料     | 构建排除             |

- API 路由、URL 路径、文件夹名 MUST 保持英文；中文显示 MUST 经由 `_meta.json` 的 `title` 字段。
- 任何新增分类 MUST 先在 README 的"目录结构"与"频道划分原则"段落同步登记后，才能落到 `content/`。

### VIII. Frontmatter 原子写与字段保序

对 Markdown 文件的写操作（发布回填、属性更新等） MUST 满足：

- 写操作 MUST 是原子的（先写临时文件 + `rename`），**禁止**直接 `fs.writeFile` 覆盖源文件。
- 反序列化（`gray-matter`）后再序列化时 MUST 保持**原有字段顺序**与**原有 YAML 风格**（4 空格缩进、ISO 日期）；新增字段追加在末尾。
- 写操作 MUST 幂等：相同的源内容 + 相同的更新操作产生相同的字节级输出（便于 git diff 审查）。

## 技术栈（Stack）

- **框架**: Next.js 16（App Router，`pnpm dev --turbopack` / `pnpm build`）
- **样式**: Tailwind CSS 4 + shadcn/ui（`@base-ui/react` 运行时）
- **内容**: Markdown + `gray-matter` 解析
- **数据库**: SQLite（`prisma/dev.db`）via Prisma 7
- **鉴权**: 自建 `app/api/auth` + `bcryptjs`（`User.passwordHash`）
- **部署**: 静态导出（`out/`）+ Nginx；进程管理 `pm2`（`pm2.json`）
- **包管理**: `pnpm@8.15.9`（`packageManager` 已锁定）
- **运行时**: Node 22+（`.nvm/v22.22.2`）

## 频道与命名（Channels & Naming）

- 频道固定 6 类，新增 MUST 走宪法 amendment 流程
- 一级目录显示中文 MUST 走 `_meta.json#title`；不允许在目录名里出现中文
- frontmatter 必填：`title / date / status / platform / tags`（README §"Frontmatter 规范"）
- 文件命名：`YYYY-MM-DD-关键词.md`

## 开发工作流（Workflow）

1. **计划先行**：所有 ≥ 1 天的功能 MUST 走 spec 流程（`/speckit.specify` → `/speckit.plan` → `/speckit.tasks` → `/speckit.implement`），生成物落在 `specs/###-feature/`。
2. **干净工作区发布**：任何对 `out/` 有影响的发布类操作前，MUST `git status` 干净；不干净则先 commit/stash。
3. **构建与部署解耦**：`pnpm build` 与 `pnpm deploy` 是两个动作；前者产出 `out/`，后者调 `pm2 restart mindflow`，**禁止**合并。
4. **本地验证**：变更后 MUST 至少通过 `pnpm lint` 与 `pnpm typecheck`；涉及内容渲染的变更 SHOULD 跑一次 `pnpm build` 验证 SSG 成功。
5. **依赖变更**：新增运行时依赖 MUST 同时更新 `package.json` 与 `pnpm-lock.yaml`；不要手工编辑 lockfile。
6. **数据迁移**：schema 变更 MUST 提交 `prisma/migrations/` 下的 migration 文件；不要在生产库手工改表。

## 治理（Governance）

- **优先级**：本宪法 > 现有 README 表述。当两者冲突时，以宪法为准并在下次文档同步中修订 README。
- **修订流程**：任何原则的增删改 MUST 在 PR 描述中给出 (a) 旧条款摘录、(b) 新条款摘录、(c) 影响到的代码/文件路径清单、(d) 迁移计划（如有）。
- **版本策略**：遵循 SemVer。MAJOR = 不可兼容的治理/原则重定义；MINOR = 新原则或重要条款扩展；PATCH = 措辞澄清/拼写/非语义精修。
- **合规检查**：`/speckit.plan` 阶段的 Constitution Check 段 MUST 引用本文件并显式核对每条原则；任何"违反 + 豁免"项 MUST 落在 `plan.md` 的 Complexity Tracking 表中。
- **复盘节奏**：每完成一个 feature 走 `/speckit.analyze` 复盘 spec/plan/tasks 的一致性；发现结构性问题反哺宪法修订。
- **运行时引导**：开发者指南落在 `AGENTS.md`（由 plan 阶段更新"当前 plan 引用"段），宪法为最高层。

**Version**: 1.0.0 | **Ratified**: 2026-06-09 | **Last Amended**: 2026-06-09