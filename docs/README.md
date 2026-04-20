# gyd-opc-web-template

OnePlatform 网页前端模板，基于 Vue 3 + Vite + Pinia + TypeScript。

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build
```

## 配置

复制 `.env.example` 为 `.env`，修改后端地址：

```
VITE_API_BASE_URL=http://localhost:8000
VITE_PRODUCT_KEY=your_product_key
```

## 目录结构

```
├── src/
│   ├── api/            # API封装（request/auth/upload/ai/analytics/websocket）
│   ├── components/     # 公共组件（Navbar/Loading/Empty/Error/FileUpload/AiChat）
│   ├── composables/    # 组合函数（useAuth/useWebSocket）
│   ├── layouts/        # 布局（DefaultLayout）
│   ├── pages/          # 页面（LoginPage/HomePage）
│   ├── router/         # 路由配置
│   ├── stores/         # Pinia状态管理
│   └── styles/         # 全局样式
├── public/             # 静态资源
└── docs/               # 文档
```

## 文档

- [页面说明](pages.md)
- [组件说明](components.md)
- [配置说明](config.md)
- [变更日志](changelog.md)
