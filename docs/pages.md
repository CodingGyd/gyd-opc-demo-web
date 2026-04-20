# 页面说明

## LoginPage — 登录页

路径：`src/pages/LoginPage.vue`

功能：
- 手机号 + 验证码登录
- 登录成功后自动跳转首页
- Token 存储到 localStorage

## HomePage — 首页

路径：`src/pages/HomePage.vue`

空骨架页面，接入方根据业务需求自行扩展。

## 新增页面

1. 在 `src/pages/` 下创建 `.vue` 文件
2. 在 `src/router/index.ts` 中注册路由
3. 需要鉴权的页面放在 `meta: { requiresAuth: true }` 路由下
