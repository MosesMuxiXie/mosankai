# Mosankai

## 中文

Mosankai 是一个个人网站，包含以下两个主要部分：

- **Find a Time**：帮助多人分享空闲时间并找到合适的共同时间。
- **博客**：用于发布和阅读文章、想法与近况。

网站地址：[https://mosankai.com](https://mosankai.com)

## English

Mosankai is a personal website with two main sections:

- **Find a Time**: A tool that helps groups share their availability and find a suitable time for everyone.
- **Blog**: A place to publish and read articles, ideas, and updates.

Website: [https://mosankai.com](https://mosankai.com)

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
