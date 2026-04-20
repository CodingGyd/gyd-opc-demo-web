# 配置说明

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| VITE_API_BASE_URL | 后端API地址 | http://localhost:8000 |
| VITE_PRODUCT_KEY | 产品标识 | 空 |

## src/api/request.ts

HTTP 请求封装，基于 axios：
- 自动携带 Authorization 和 X-Product-Key 请求头
- 401 自动跳转登录页
- 统一错误处理

## 路由守卫

`src/router/index.ts` 中配置了全局前置守卫：
- 未登录访问需要鉴权的页面 → 跳转 /login
- 已登录访问登录页 → 跳转 /

## Pinia Store

`src/stores/user.ts`：
- token / userInfo 状态管理
- 登录/登出/获取用户信息 actions
