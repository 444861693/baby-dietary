# baby-dietary

一个移动端优先的宝宝辅食指南 Web 项目，基于 `Vue 3 + TypeScript + Vite` 开发，支持按月龄查看 6~12 月龄宝宝每日喂养安排、重点提醒与关键词搜索。

在线地址：`https://www.ruiqiio.cn/baby-dietary/`

## 功能特性

- 按月龄（6~12 月龄）快速切换
- 每日喂养计划展示（移动端卡片 / 桌面端表格）
- 关键词搜索（食材/菜名）
- 本月喂养重点与通用规则
- 移动端底部悬浮快捷操作（月龄 / 搜索 / 回到顶部）

## 技术栈

- Vue 3
- TypeScript
- Vite
- pnpm

## 快速开始

### 环境要求

- Node.js `>=18`
- pnpm `>=9`

### 安装依赖

```bash
pnpm install
```

### 启动开发

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 本地预览构建结果

```bash
pnpm preview
```

## 数据来源与结构

本项目当前数据来自仓库内的文本文件：

- `src/data/data.txt`

解析与数据转换逻辑位于：

- `src/data/feedingPlan.ts`

核心类型定义位于：

- `src/types.ts`

## 项目结构

```text
.
├── src/
│   ├── data/
│   │   ├── data.txt
│   │   └── feedingPlan.ts
│   ├── App.vue
│   ├── main.ts
│   ├── style.css
│   └── types.ts
├── index.html
├── package.json
└── vite.config.ts
```

## 部署说明

本项目是纯前端静态站点，可部署到 Nginx、Vercel、Netlify、GitHub Pages 等平台。

构建产物目录：

- `dist/`

若部署到子路径（例如 `/baby-dietary/`），请在 `vite.config.ts` 中配置：

```ts
export default defineConfig({
  base: '/baby-dietary/'
})
```

## 微信小程序 web-view 使用

若通过 `web-view` 打开本项目，需在小程序后台配置业务域名，例如：

- `www.ruiqiio.cn`

> 注意：填写域名，不包含 `https://` 和路径。

## 参与贡献

欢迎提交 Issue 和 PR。提交前请先阅读：

- `CONTRIBUTING.md`

## 安全问题

如果你发现潜在安全问题，请阅读：

- `SECURITY.md`

## 版本记录

- `CHANGELOG.md`

## 免责声明

本项目仅用于家庭喂养信息参考，不替代专业医疗建议。若出现过敏、喂养困难、体重增长异常等情况，请及时咨询儿科医生。

## License

本项目采用 `MIT` 协议开源，详见：

- `LICENSE`
