# Contributing Guide

感谢你愿意为 `baby-dietary` 做贡献！

## 开发流程

1. Fork 本仓库并创建分支：

```bash
git checkout -b feat/your-feature
```

2. 安装依赖并启动开发：

```bash
pnpm install
pnpm dev
```

3. 完成修改后进行构建检查：

```bash
pnpm build
```

4. 提交代码并发起 Pull Request。

## 提交建议

- 提交粒度尽量小、语义清晰
- 变更 UI 时请附截图（移动端优先）
- 若调整数据解析逻辑，请同步更新说明文档

## 代码风格

- 保持现有 Vue 3 + TS 风格
- 命名清晰，避免过度抽象
- 优先移动端体验，再适配桌面端

## PR 说明建议

PR 描述中建议包含：

- 改动背景
- 主要变更点
- 验证方式
- 可能影响范围
