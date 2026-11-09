# 让 /game 根据用户输入真实生成游戏

## 用户能看到什么
- 在首页 / 构建页提交游戏需求后进入 /game，工作区显示"正在生成"进度，而不是固定的星光收集示例。
- AI 根据需求依次生成：
  1. **设计文档**（概述、玩法、美术、验收标准）→ Design 视图
  2. **美术资产图片**（概念图、角色、场景、道具、界面，约 4–5 张）→ Assets 视图与左侧缩略图
  3. **可运行游戏代码**（单个 HTML5 游戏，会使用生成的图片）→ Code 视图可查看/下载，Game 视图直接试玩
- 左侧 Chat 输入修改需求（如"加快敌人速度""换成夜晚场景"），AI 基于当前代码真实改出新版本，Game 自动刷新。
- 每个游戏自动保存，免登录：地址变为 `/game?id=...`，刷新或分享链接都能打开同一个游戏并继续修改；项目页列表也能看到这些游戏。
- 出错（积分不足、频率限制等）时显示明确提示，不再假装成功。原"示例工作区"字样移除。

## 说明
- 生成会消耗工作区 AI 积分；每张图片额外消耗积分，整体约需 1–2 分钟。
- 免登录意味着任何拿到链接的人都能查看并修改该游戏。

## 技术细节
- 启用 Lovable Cloud：表 `games`（id, title, prompt, design jsonb, code text, status, error, created_at, updated_at）、`game_assets`（game_id, kind, name, url）、`game_messages`（game_id, role, content）；anon 读写策略 + GRANT；公开存储桶 `game-assets` 存图片。
- 服务端函数（`src/lib/games.functions.ts`）：`createGame`、`getGame`、`listGames`、`generateDesign`、`generateAsset`（逐张调用，前端逐张触发并显示进度）、`generateCode`、`reviseGame`。
- 文本/代码用 AI 网关 Responses + `openai/gpt-6-astra` 流式调用（服务端读取完整结果），设计用严格 JSON schema；代码要求输出自包含 HTML（Canvas/原生 JS，无外链脚本），资产以存储 URL 注入。图片用 `openai/gpt-image-2.5-sunburst` 生成后上传存储。
- Game 视图用 `iframe sandbox="allow-scripts"` + `srcdoc` 运行生成代码，与主站隔离。
- `/game` 校验 search 增加 `id`；无 id 有 prompt 时创建游戏并 replace 到 `?id=`；用 TanStack Query 轮询状态。
- 402/429/403 按网关错误语义显示并停止；不自动重试付费请求。
- 更新 AGENTS.md 规则（游戏工作区改为 Cloud 持久化 + AI 生成）与 `mem://features/game-workspace.md`；为"无 id 时创建、状态流转"写小测试。
