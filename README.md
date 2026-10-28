# Aelux Components

Aelux Launcher 通用 UI 组件库 —— 纯 React、无业务逻辑，与 Aelux Launcher 共享同一套冰蓝设计语言，供启动器、Aelux WebSite 及外部项目复用。

- **技术栈**：React 19 + TypeScript 5.9，Vite 8 库模式构建
- **产物**：仅 ESM（`dist/aelux-components.js`）+ 完整类型声明（`dist/index.d.ts`）
- **不打包 React**：`react` / `react-dom` 为 `peerDependencies`，由使用方提供
- **零运行时依赖**：图标为内置内联 SVG，样式为一份可直接引入的 CSS
- **25 个组件**：覆盖表单、反馈、展示与布局
- **中性表面 + 冰蓝强调**：表面、文字、描边使用中性灰阶，品牌色只用于主按钮、选中态与焦点环；不使用渐变、光晕等装饰效果
- **亮 / 暗双主题**：全部视觉由 `--aelux-*` 设计变量驱动，`data-theme` 一键切换

## 快速开始

```bash
pnpm add aelux-components
```

```tsx
import { Button, Card, Input } from 'aelux-components'
import 'aelux-components/style.css'

export function Demo() {
  return (
    <Card title="欢迎使用 Aelux">
      <Input placeholder="搜索组件…" allowClear />
      <Button variant="primary">开始使用</Button>
    </Card>
  )
}
```

> 使用方需要自行安装 `react` / `react-dom`（`^18.2.0 || ^19.0.0`）。
> 若项目已有全局样式，组件类名统一使用 `aelux-` 前缀、变量统一使用 `--aelux-` 前缀，不会与启动器现有的 `.btn` / `.card` / `.input` 冲突。

## 主题与设计变量

主题约定与 AeluxWebSite 保持一致：写在 `<html>` 上的 `data-theme` 属性。

```ts
// 切换主题
document.documentElement.setAttribute('data-theme', 'dark')

// 持久化（AeluxWebSite / Aelux-Components 展示站使用同一个 key）
localStorage.setItem('aelux-theme', 'dark')
```

- `data-theme="light"` / `data-theme="dark"`：显式主题
- 未声明 `data-theme` 时：自动跟随系统 `prefers-color-scheme`

所有颜色、圆角、阴影、字号都可直接覆盖，无需改组件源码：

```css
:root {
  --aelux-primary-500: #6366f1;
  --aelux-primary: var(--aelux-primary-500);
  --aelux-radius-md: 10px;
}
```

### 变量速查

| 分类 | 变量 | 说明 |
| --- | --- | --- |
| 主色 | `--aelux-primary-50` … `--aelux-primary-900` | 冰蓝 10 阶，500 为基准 |
| 语义主色 | `--aelux-primary`、`-hover`、`-active`、`-soft`、`-text` | 组件实际消费的变量 |
| 功能色 | `--aelux-success` / `warning` / `danger` / `info` | 各含 `-hover`、`-soft`、`-soft-border`、`-text` 派生 |
| 表面 | `--aelux-bg-page`、`--aelux-surface`、`-subtle`、`-hover`、`-inverse` | 中性灰阶，亮暗主题自动切换 |
| 文字 | `--aelux-text`、`-secondary`、`-tertiary`、`-inverse`、`-disabled` | |
| 描边 | `--aelux-border`、`-strong`、`-focus`、`-danger` | |
| 焦点 | `--aelux-focus-ring` | 键盘焦点外发光 |
| 字号 | `--aelux-font-size-xs`(11) / `sm`(12) / `md`(13) / `lg`(15) / `xl`(18) / `2xl`(22) | |
| 圆角 | `--aelux-radius-xs`(4) / `sm`(6) / `md`(8) / `lg`(12) / `xl`(16) / `full` | |
| 控件高度 | `--aelux-control-sm`(28) / `md`(34) / `lg`(40) | |
| 阴影 | `--aelux-shadow-sm` / `md` / `lg` | |
| 字体 | `--aelux-font-sans` / `--aelux-font-mono` | |

## 组件总览

### 基础

| 组件 | 说明 |
| --- | --- |
| `Button` | `variant`: primary / secondary / ghost / danger / success / warning；`size`: sm / md / lg；`block`、`loading`、`leftIcon`、`rightIcon` |
| `IconButton` | 仅图标按钮，`icon`、`label`（无障碍标签）、`size`、`variant`、`loading` |

### 表单

| 组件 | 说明 |
| --- | --- |
| `Input` | `size`、`status`（error / warning / success）、`prefix` / `suffix`、`allowClear`、`block` |
| `Textarea` | 同上，另支持 `autoSize`、`showCount` |
| `Select` | `options`、`value` / `defaultValue`、`onValueChange`、`placeholder`、`block` |
| `Checkbox` | `label`、`description`、`indeterminate`、`size` |
| `Radio` / `RadioGroup` | 单个 `Radio` 或 `options` + `direction` + `gap` 的 `RadioGroup` |
| `Switch` | `checked` / `defaultChecked`、`onChange`、`size`、`label`、`description` |
| `Slider` | `value` / `defaultValue`、`min` / `max` / `step`、`onChange` |
| `FormItem` | `label`、`htmlFor`、`required`、`hint`、`error`、`inline` |

### 反馈

| 组件 | 说明 |
| --- | --- |
| `Alert` | `type`（info / success / warning / error）、`title`、`description`、`closable`、`onClose` |
| `toast` | 命令式 API：`toast('消息')`、`toast.success()`、`toast.error()`、`toast.warning()`、`toast.info()`、`toast.loading()`、`toast.dismiss(id)`、`toast.clear()` |
| `Spinner` | `size`、`label` |
| `Progress` | `value` / `max`、`size`、`variant`、`showLabel`、`indeterminate` |
| `Skeleton` | `width` / `height` / `circle` / `lines` / `animated` / `loading`（`loading` 为 true 时渲染骨架，否则渲染 children） |
| `Empty` | `title`、`description`、`icon`、`action`、`size` |

### 浮层

| 组件 | 说明 |
| --- | --- |
| `Modal` | `open`、`onClose`、`title`、`footer`、`width`、`size`、`closeOnOverlay`、`closeOnEsc`、`showClose`、`centered` |
| `Tooltip` | `content`、`placement`、`delay`、`disabled` |

### 展示

| 组件 | 说明 |
| --- | --- |
| `Card` | `variant`、`padding`、`hoverable` |
| `Tag` | `color`、`variant`、`closable`、`icon` |
| `Badge` | `count`、`max`、`dot`、`status`、`showZero` |
| `Avatar` | `src` / `alt` / `name`（无图时显示首字）、`size`、`shape`、`icon`、`status` |
| `Tabs` | `items`（`key` / `label` / `icon` / `disabled` / `content`），支持键盘方向键 |
| `Divider` | `orientation`、`variant`、`children`、`align` |
| `Space` | `direction`、`size`、`align`、`wrap`、`block` |

### 图标

```tsx
import { Icon, IconCheck, IconSearch } from 'aelux-components'

<IconCheck size={16} />
<IconSearch />
<Icon size={18}>…自定义 SVG…</Icon>
```

34 个内置线性图标（`IconCheck`、`IconClose`、`IconSearch`、`IconSettings`、`IconFolder`、`IconDownload`、`IconCopy`、`IconTrash`、`IconUser`、`IconSun`、`IconMoon` 等），全部内联 SVG，颜色跟随 `currentColor`。

## 本地开发

```bash
pnpm install
pnpm dev            # 启动组件展示站 http://localhost:5173
pnpm typecheck      # tsc 类型检查（库 + 配置文件）
pnpm build          # 构建组件库，输出 dist/
pnpm build:showcase # 构建静态展示站，输出 showcase-dist/
pnpm preview        # 预览静态展示站
```

要求 Node.js `>= 20.19.0`（Vite 8 的要求），包管理器推荐 pnpm。

## 构建产物

```
dist/
├── aelux-components.js    # ESM 入口（react / react-dom 已 external，不打包）
├── aelux-components.js.map
├── aelux-components.css   # 全部组件样式（由 src/styles/index.css 聚合）
├── index.d.ts             # 类型入口
├── components/…/*.d.ts    # 各组件类型声明
├── icons/…/*.d.ts
└── utils/…/*.d.ts
```

使用方：

```ts
import { Button } from 'aelux-components'        // → dist/aelux-components.js + dist/index.d.ts
import 'aelux-components/style.css'              // → dist/aelux-components.css
```

## 目录结构

```
Aelux-Components/
├── index.html                    # 展示站入口（开发 / showcase 构建）
├── demo/                         # 组件展示站（不随库发布）
│   ├── App.tsx                   # 侧边栏 + 顶栏 + 页面路由
│   ├── main.tsx
│   ├── styles.css                # 展示站样式
│   ├── components/ShowcaseBlock.tsx
│   └── sections/                 # 每个展示页一个文件
├── src/
│   ├── index.ts                  # 公共 API 入口（唯一对外出口）
│   ├── components/               # 每个组件一个目录：X.tsx + style.css + index.ts
│   ├── icons/                    # Icon 基座 + 30 个内置图标
│   ├── styles/
│   │   ├── tokens.css            # 设计变量（亮 / 暗）
│   │   ├── base.css              # 基础重置、动画、可访问性
│   │   └── index.css             # 样式聚合入口（→ dist/aelux-components.css）
│   └── utils/                    # cx、composeRefs
├── vite.config.ts
├── tsconfig.json / tsconfig.build.json / tsconfig.node.json
└── package.json
```

## 约定

- 所有组件类名 `aelux-` 前缀、BEM 风格（`aelux-btn--primary`），设计变量 `--aelux-` 前缀
- 组件通过 `forwardRef` 转发 ref，原生 DOM 属性直接透传（`…rest`）
- 受控 / 非受控两种用法都支持；样式只消费语义变量，暗色主题自动生效
- 组件 TSX 不 import CSS，样式统一由 `src/styles/index.css` 聚合

## 与 Aelux 生态

```
Aelux-Tauri            # 现有启动器（Tauri 2，纯 TS/HTML），设计语言来源
Aelux-Components      ← 本仓库：通用 React 组件库
├── Aelux-Launcher-App   # Tauri 2 桌面外壳（消费 aelux-components / aelux-launcher-lib）
├── Aelux-Launcher-Lib   # 启动器业务逻辑
└── AeluxWebSite         # 官网（同一套 data-theme / aelux-theme 主题约定）
```

## License

MIT
