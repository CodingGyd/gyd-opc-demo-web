# CLAUDE.md — gyd-opc-demo-web

## 项目概述
OnePlatform 网站产品接入示例前端（gyd-opc-demo-web），基于 Vue 3 + Vite + Pinia + TypeScript。
作为平台标准接入案例，展示前端产品如何对接 OnePlatform 基础能力服务。

## 技术栈
- Vue 3 + Composition API
- Vite 6
- Pinia 状态管理
- Vue Router 4
- TypeScript

## 目录结构
- `src/pages/` — 页面（LoginPage登录, HomePage首页）
- `src/components/` — 公共组件（AppNavbar/AppLoading/AppEmpty/AppError/FileUpload/AiChat, NoteList笔记列表）
- `src/composables/` — 组合函数（useAuth鉴权, useWebSocket长连接）
- `src/api/` — API封装（request/auth/upload/ai/analytics/websocket, note笔记接口）
- `src/stores/` — Pinia状态管理（user）
- `src/layouts/` — 布局（DefaultLayout）
- `src/router/` — 路由配置

## 关键文件
- `vite.config.ts` — Vite 开发配置，dev proxy 将 `/api` 转发到 demo-service（需设置 `VITE_API_BASE_URL`，默认值 8000 为老网关死端口）
- `Dockerfile` / `nginx.conf` — Docker + Gateway 部署时期遗留（指向已下线的 `gateway:8000`），当前发版不使用；前端实际部署在 180 Nginx（静态目录 html/demo-web，见 16 号 §2.8）

## productKey 机制
- 常规 API（src/api/request.ts）不携带 productKey，只带 Authorization 和 X-Request-Id
- demo-service 接收 `X-Product-Key` 请求头，缺省时默认 `demo-web`（AuthProxyController defaultValue），转发 basic-service 时携带
- AI 流式接口（src/api/ai.ts，fetch 实现）单独读取 `VITE_PRODUCT_KEY` 环境变量并在请求头携带

## 配置
- 端口：3001（vite.config.ts）
- productKey：`demo-web`

## 对接后端
- demo-service: 所有接口通过 demo-service 聚合（登录注册、文件上传、AI对话、埋点上报等）
- 架构链路：demo-web → demo-service（8010，RestTemplate）→ basic-service（8020）；生产环境经 180 Nginx `/api/` 反代到 91:8010，无网关
- 基础能力（认证/存储/AI/埋点）由 basic-service 统一提供，前端一律通过 demo-service 聚合访问，不直连 basic-service

## 开发规范
- 所有请求通过 src/api/request.ts 发起，自动携带 token（productKey 由 demo-service 侧兜底注入，前端不处理）
- 使用 Composition API + setup 语法
- 组件命名采用 PascalCase

## 发版规范
- commit message 必须用中文描述
- 使用 `/release` 命令管理发版
