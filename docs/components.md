# 组件说明

## AppNavbar — 导航栏

通用顶部导航栏。

Props：
- `title` String — 标题文本

## AppLoading — 加载中

加载状态组件。

Props：
- `text` String — 提示文字（默认"加载中..."）

## AppEmpty — 空状态

空数据提示组件。

Props：
- `text` String — 提示文字（默认"暂无数据"）

## AppError — 错误提示

错误提示组件。

Props：
- `text` String — 错误描述（默认"加载失败"）

Events：
- `retry` — 重试按钮点击

## FileUpload — 文件上传

文件上传组件，对接 storage-service 签名直传。

Props：
- `accept` String — 接受的文件类型
- `maxSize` Number — 最大文件大小（字节）

Events：
- `success` — 上传成功，返回文件信息
- `error` — 上传失败

## AiChat — AI对话

AI 流式对话组件，对接 ai-service SSE 接口。

Props：
- `model` String — 模型标识（可选）
