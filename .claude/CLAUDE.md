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
- `Dockerfile` — Docker 镜像构建，产出 nginx 容器
- `nginx.conf` — nginx 配置，代理 `/api/` 到 gateway 并注入 `X-Product-Key` 请求头
- `vite.config.ts` — Vite 开发配置，dev proxy 注入 `X-Product-Key` 请求头

## productKey 注入机制
- **productKey 不在前端代码中**，前端 API 层（src/api/request.ts）不携带 productKey
- 开发环境：Vite dev proxy（vite.config.ts）在转发请求时自动注入 `X-Product-Key: demo-web` 请求头
- 生产环境：nginx（nginx.conf）在代理 `/api/` 到 gateway 时自动注入 `X-Product-Key: demo-web` 请求头
- 后端服务从 `X-Product-Key` 请求头读取 productKey，而非请求体

## 配置
- 端口：3002
- productKey：`demo-web`

## 对接后端
- demo-service: 所有接口通过 demo-service 聚合（登录注册、文件上传、AI对话、埋点上报等）
- 架构链路：demo-web → gateway → demo-service → 基础能力服务
- 禁止前端直接调用 auth-service、storage-service 等内部微服务

## 开发规范
- 所有请求通过 src/api/request.ts 发起，自动携带 token（productKey 由代理层注入，前端不处理）
- 使用 Composition API + setup 语法
- 组件命名采用 PascalCase

## 发版规范
- commit message 必须用中文描述
- 使用 `/release` 命令管理发版
