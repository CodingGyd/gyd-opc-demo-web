# CLAUDE.md — gyd-opc-web-template

## 项目概述
OnePlatform 网页前端模板，基于 Vue 3 + Vite + Pinia + TypeScript。

## 技术栈
- Vue 3 + Composition API
- Vite 6
- Pinia 状态管理
- Vue Router 4
- TypeScript

## 目录结构
- `src/pages/` — 页面（LoginPage登录, HomePage首页）
- `src/components/` — 公共组件（AppNavbar/AppLoading/AppEmpty/AppError/FileUpload/AiChat）
- `src/composables/` — 组合函数（useAuth鉴权, useWebSocket长连接）
- `src/api/` — API封装（request/auth/upload/ai/analytics/websocket）
- `src/stores/` — Pinia状态管理（user）
- `src/layouts/` — 布局（DefaultLayout）
- `src/router/` — 路由配置

## 对接后端
- auth-service: 登录注册、用户管理
- storage-service: 文件上传
- ai-service: AI对话（SSE流式）
- analytics-service: 事件埋点上报

## 开发规范
- 所有请求通过 src/api/request.ts 发起，自动携带 token 和 productKey
- 使用 Composition API + setup 语法
- 组件命名采用 PascalCase

## 发版规范
- commit message 必须用中文描述
- 使用 `/release` 命令管理发版
