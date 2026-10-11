# Mosankai

## 中文

Mosankai 是一个个人网站，包含以下四个主要部分：

- **Find a Time**：帮助多人分享空闲时间并找到合适的共同时间。
- **博客**：用于发布和阅读文章、想法与近况。
- **作品馆**：在 `/gallery` 浏览模组、工具与网站、研究及叙事实验。
- **复习资料**：在 [Study Guides](https://mosankai.com/studyguides) 按统计学、神经科学和英语文学浏览交互复习页面、思维导图及原始课件、试卷与阅读文本。

网站地址：[https://mosankai.com](https://mosankai.com)

## English

Mosankai is a personal website with four main sections:

- **Find a Time**: A tool that helps groups share their availability and find a suitable time for everyone.
- **Blog**: A place to publish and read articles, ideas, and updates.
- **Gallery**: Browse mods, tools, research and narrative experiments at `/gallery`.
- **Study Guides**: [A subject archive](https://mosankai.com/studyguides) of interactive reviews, knowledge maps, slides, exam papers and reading materials for statistics, neuroscience and English literature.

Website: [https://mosankai.com](https://mosankai.com)

## Gallery

作品馆位于 `/gallery`，详情页位于 `/gallery/{slug}`。首版清单 `data/works.seed.json` 收录九个公开 GitHub 项目；精选、分类搜索和详情支持中英文。项目文案依据公开仓库说明整理，封面为独立生成的概念插画，不是项目实际截图。

在 `/admin/dashboard?panel=works-panel` 管理作品：新增、编辑、上传封面、预览、排序、精选、隐藏及重新公开。新作品默认隐藏，已有作品地址保持不变；作品不需要 GitHub 仓库。保存采用版本校验，发生冲突时保留表单，重新读取前先复制需要保留的修改。

公开 `GET /api/works` 仅返回公开作品；管理员 `GET /api/works?admin=1` 返回完整清单及 `revision`；同源、已认证的 `PUT /api/works` 接收 `{ revision, works }`，过期版本返回 409。通过 `/api/site-settings?section=works` 分发，未增加 Vercel 函数。作品字段包含唯一 `slug`、`title`、`category`（minecraft/tools/research/story）、`visible`、`featured`、`tags`、双语 `summary` 与 `details`（problem/approach/outcome）、`cover`、可选资源 `links`（source/docs/demo/download/read）；数组顺序决定展示顺序。

线上沿用现有 Redis，独立键为 `site:works:v1`；本地使用 `WORKS_DATA_FILE` 或 `works-data.json`。只有存储不存在时才读取初始清单；空清单也是有效保存，不会被种子覆盖。生产环境未配置 Redis 或存储损坏时明确报错，不退回易失存储。访客浏览不调用 GitHub API。

雨景与封面使用内置 imagegen 生成，无文字；WebP 图片位于 `public/gallery/assets/`。生成提示分别为冷灰蓝雨窗城市与少量暖光、普通冰与含水阶梯、方块地形及线框转换、无人物的雨城叙事场景。页面不包含情绪标语或设计说明。

全部 9 个初始作品均有独立封面；补齐的 6 张分别呈现身份验证通道、附魔模板、传播网络、日程交集、计时器及个人网站工作台。生成方式与完整提示见 [封面素材记录](docs/gallery-cover-prompts.md)。

运行 `node --test test/works.test.js test/gallery.test.js` 和 `npm test` 验证作品数据、并发版本保存、权限、来源校验、隐藏作品、资源路由与现有功能。沿用现有 Vercel Git 部署；函数配置包含初始作品清单。

## Study Guides

资料目录由 `public/studyguides/catalog.json` 管理，当前收录 6 份交互成品与 25 份原始资料。学科地址为 `/studyguides/statistics`、`/studyguides/neuroscience`、`/studyguides/english`；目录支持中英文、标题与范围搜索，原页面保留原有语言和交互。PDF 支持阅读与下载，PPT/PPTX/DOCX 提供原文件下载。教材和小说原文件是全文，卡片单独注明复习所使用的章节范围。

新增资料时，将文件放入对应学科的 `guides/` 或 `sources/` 目录，在清单中增加唯一 `id`、`subject`、`kind`、中英文 `title`/`scope`、`format`、原始 `filename`、URL 编码后的 `href` 和 `bytes`；原始资料还须记录 SHA-256 `sha256`。交互页面加上 `data-studyguide-return` 返回链接。运行 `node --test test/studyguides.test.js` 检查条目、文件、原始哈希、访问路由和下载，再运行 `npm test`。

全部原始资料约 146 MiB，采用现有 Vercel Git 集成部署，不通过受源码上传体积限制的 Hobby CLI 上传流程；没有增加服务端函数。历史思维导图的一份临时来源 PDF 已缺失，目录如实注明，现有第 2 章课件仍可下载。

## Findatime MCP

Findatime 提供公开的 **Streamable HTTP** MCP 接口。部署本版本后，在支持远程 MCP 的客户端中添加地址 `https://mosankai.com/api/mcp`，认证选择“无”。本地运行 `npm ci`、`npm start` 后可连接 `http://localhost:3000/api/mcp`。直接在浏览器中打开该地址会返回 405，这是正常行为；接口通过 POST 接收 MCP 请求，不提供旧版 SSE GET 入口。

服务使用官方 `@modelcontextprotocol/sdk` 1.30.0、Zod 4 和 CommonJS；每次请求独立处理，以 JSON 返回结果，无会话 ID。接口只提供以下三个工具：

| 工具 | 参数 | 返回内容 |
| --- | --- | --- |
| `findatime_create_meeting` | `title`、`name`、`duration`、`timezone`、`slots` | `id`、绝对分享地址 `url`、私密 `creatorToken` |
| `findatime_get_meeting` | `id`，从分享地址 `/findatime/uuid/{id}` 获取 | 标题、时区、时长、候选时间 ID/UTC 时间/票数/姓名、无法参加名单及参与者人数 |
| `findatime_submit_availability` | `id`、`name`、`availability` 或 `unavailable: true`、可选 `participantToken` | 更新后的 `meeting`、私密 `participantToken` |

### 时间与身份

- `duration` 单位为分钟，范围 30–480，按 30 分钟递增。`timezone` 必填，使用 IANA 时区（如 `Asia/Shanghai`）。
- `slots` 为 1–10 个候选开始时间，必须包含秒及 `Z` 或 UTC 偏移，秒和毫秒为零，例如 `2026-10-01T10:00:00+08:00`。存储时转换为 UTC、去重并排序；网页原有时间兼容规则保留。
- 创建者默认勾选全部候选时间。提交前先读取约会，用返回的 `t1`、`t2` 等时间 ID 填写 `availability`；提交会替换自己的原选择。`unavailable: true` 会清空选择，表示无法参加。
- 第一次参与不传令牌；后续更新须保存并传回自己的 `participantToken`，创建者使用 `creatorToken` 作为 `participantToken`。令牌是修改凭据，只应保存在可信客户端中，不放入分享链接。MCP 拒绝格式错误的令牌（必须为 16–64 位字母、数字、下划线或连字符），避免误将错误凭据作为首次参与；网页 API 原有处理保持不变。
- 姓名不能恢复身份。未携带令牌会新增参与者，即使姓名相同；丢失令牌不能通过查询约会取回。沿用网页规则：格式合法但未知的令牌会建立新参与者，不会覆盖同名的人。
- 创建和无令牌提交在响应不确定时不要自动重试，以免重复创建约会或参与者。公开查询不会返回令牌。此接口不提供全站列表、管理员操作或评论工具。

### 调用示例

完成 MCP 初始化后，调用 `tools/call`：

```json
{
  "name": "findatime_create_meeting",
  "arguments": {
    "title": "项目讨论",
    "name": "小明",
    "duration": 60,
    "timezone": "Asia/Shanghai",
    "slots": ["2026-10-01T10:00:00+08:00", "2026-10-01T14:30:00+08:00"]
  }
}
```

然后以返回的 `id` 调用 `findatime_get_meeting`，再调用 `findatime_submit_availability`，传入 `id`、`name` 和 `availability: ["t1"]`。更新时同时传入自己的令牌。工具成功返回 `structuredContent` 和文本说明；业务错误返回 `isError: true`，检查错误内容后修正参数再调用。

### 配置与部署

| 环境变量 | 用途 |
| --- | --- |
| `FINDATIME_MCP_PUBLIC_URL` | 固定站点 origin，默认 `https://mosankai.com`；只接受 HTTP(S) 且不含路径、查询、片段或凭据。分享地址不取自请求 Host。 |
| `FINDATIME_MCP_ALLOWED_ORIGINS` | 逗号分隔的额外浏览器来源，例如 `https://client.example`；精确匹配，不支持通配符。 |

固定站点 origin 自动获准。非生产且非 Vercel 的本地开发环境额外允许 localhost、127.0.0.1 和 IPv6 loopback 的 HTTP(S) origin（任意端口）。无 Origin 的服务端 MCP 客户端可以连接；未知 Origin 和 `null` origin 返回 403。Origin 校验用于限制浏览器来源，并非用户认证。

Vercel 将 `/api/mcp` rewrite 到 `/api/findatime?operation=mcp`，复用现有函数并在 REST 分支之前分发给 MCP handler；函数总数保持为 12，避免新增独立函数超过部署额度。无需单独运行进程。生产环境必须继续配置现有 Upstash/KV Redis 变量以持久化数据；本地使用 `FINDATIME_DATA_FILE`。不需要迁移既有约会。可运行 `npx vercel build --prod` 检查已关联项目的本地构建；该命令不发布网站。

### 验证

运行 `npm test`。MCP 集成测试使用官方客户端启动本地服务，数据写入临时文件，并禁用 `.env.local` 和真实 Redis 连接。覆盖创建、查询、参与及更新、无法参加、网页互通、输入错误、Origin/CORS、协议错误、私密令牌和存储失败。

## Study Center · 学习中心

第二阶段已将 /studyguides 升级为日漫风格学习中心：米白与靛蓝、黄昏三格分镜、少量网点和墨线。分镜及三张学科插画为独立 WebP；标题、按钮和列表使用真实网页元素。学科入口、目录搜索、中英文、原始阅读与下载保留。

新增《仿生人》第 10–12 章资料：/studyguides/english/guides/androids-chapters-10-12.html，保留最新动态流程图、24 道选择题、12 道简答题与答案模板。旧英语资料仍标明前九章。网站副本的学习记录需要站内脚本，本地原始离线成品保持完整。

- 继续学习列出最近五份资料。四份题库保存答案及位置；继续链接使用 studyResume=1，错题重练使用 studyQuestion=稳定题号。刷新保留当前学习位置，包括测试模式；两份思维导图保存页面或锚点，原始文件只记录打开入口。
- 全部 31 个条目均可收藏；题库选择题在检查或提交后才记录结果。新的草稿不计成绩，上次错题保留至重练答对。书面题保持自评，可手动加入待复习。
- 待复习合并自动错题和手动项目；完成只移出清单，不将错题判为答对。再次判错会重新加入。没有间隔复习算法或跨学科总分。
- 记录仅保存在当前浏览器同源的 mosankai:study:v1:<materialId> 键，无账号或服务端同步。读取旧神经科学及新版英语的同源旧键，迁移后保留原键；file://、其他域名或其他浏览器的记录不能自动读取。
- 导出包含学习状态的版本化 JSON；导入先预览新增、覆盖与跳过数量，点击恢复后按资料合并，较新优先、同时间保留本机。未知资料跳过，损坏文件不写入。存储受限时本次记录留在内存，可导出备份；清除浏览器数据会删除本机记录。

新增或修改题库后运行 node scripts/build-study-index.js，从真实题库重建 learning-index.json（199 道题的身份与校验数据），同时重算目录文件大小。原始资料 SHA-256 保持独立校验。四份复习页面通过薄适配器接入，未改动原评分规则。

验证：npm test、node test/androids-self-check.mjs。真实浏览器检查可运行 node scripts/check-study-browser.cjs，需将 MOSANKAI_PLAYWRIGHT 指向机器上已有的 Playwright 模块（本机可使用 Codex bundled runtime），并启动本地 3137 端口；STUDY_BASE_URL 可覆盖地址，STUDY_SCREENSHOT_DIR 可保存截图。此检查使用已安装的 Microsoft Edge，不新增项目依赖。

沿用 Vercel Git 部署；此阶段未新增服务端接口或函数。

独立插画的生成方式、文件及提示词见 [素材记录](docs/study-center-artwork.md)。

资料页也有直接“导出备份”按钮，可在存储受限时保存当前页面的内存记录，离开页面前请先导出。记录恢复完成前，原页面控件暂不可编辑，避免慢加载覆盖输入。独立审查回归检查为 node scripts/check-study-review.cjs，使用同一 Playwright 环境配置。
