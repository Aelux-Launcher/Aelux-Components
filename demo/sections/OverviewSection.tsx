import { useState } from 'react'
import {
  Button,
  IconCheck,
  IconChevronRight,
  IconCode,
  IconCopy,
  IconGrid,
  IconMoon,
  IconPackage,
  IconPlay,
  IconStar,
  IconSun,
} from 'aelux-components'
import type { SectionProps } from './types'

const INSTALL_CMD = 'pnpm add aelux-components'

const QUICK_START = `import { Button, Input, Card } from 'aelux-components'
import 'aelux-components/style.css'

export function Demo() {
  return (
    <Card title="快速开始">
      <Input placeholder="搜索组件…" />
      <Button variant="primary">开始使用</Button>
    </Card>
  )
}`

const STATS = [
  { value: '66', label: '开箱即用组件' },
  { value: 'ESM', label: '仅现代模块产物' },
  { value: '0', label: '运行时依赖' },
  { value: 'd.ts', label: '完整类型声明' },
]

const FEATURES = [
  {
    icon: IconSun,
    title: '冰蓝双主题',
    desc: '全部视觉由 --aelux-* token 驱动，data-theme 一键切换亮 / 暗主题，并跟随系统偏好。',
  },
  {
    icon: IconCode,
    title: '类型完整',
    desc: '所有组件导出 .d.ts，forwardRef 正确转发 ref，原生 DOM 属性完整透传，无需 any 断言。',
  },
  {
    icon: IconPackage,
    title: '零运行时依赖',
    desc: 'React / React DOM 作为 peerDependencies 不进入产物，图标内置内联 SVG，包体保持轻量。',
  },
  {
    icon: IconGrid,
    title: '可组合可覆盖',
    desc: '统一 aelux- BEM 类名与 --aelux- 变量，外部样式的覆盖成本低，也便于与启动器现有样式共存。',
  },
]

const COMPONENT_INDEX = [
  { section: 'basic', label: '基础', comps: ['Button', 'IconButton', 'ButtonGroup', 'SplitButton', 'Kbd'] },
  {
    section: 'form',
    label: '输入与选择',
    comps: [
      'Input',
      'Textarea',
      'SearchInput',
      'InputNumber',
      'Select',
      'Combobox',
      'FilePicker',
      'DropZone',
      'FormItem',
    ],
  },
  {
    section: 'choice',
    label: '开关与滑块',
    comps: [
      'Checkbox',
      'Radio',
      'Switch',
      'InheritSwitch',
      'ToggleCard',
      'Chips',
      'Slider',
      'SegmentedControl',
      'Stepper',
    ],
  },
  {
    section: 'feedback',
    label: '反馈',
    comps: ['Alert', 'Toast', 'Spinner', 'Progress', 'ProgressRing', 'Skeleton', 'Empty'],
  },
  {
    section: 'overlay',
    label: '浮层',
    comps: [
      'Modal',
      'Dialog',
      'Drawer',
      'Popover',
      'Tooltip',
      'DropdownMenu',
      'PromptDialog',
      'ProgressDialog',
      'ContextMenu',
    ],
  },
  {
    section: 'data-display',
    label: '数据展示',
    comps: [
      'Card',
      'Tag',
      'Badge',
      'Avatar',
      'ListBox',
      'Table',
      'DescriptionList',
      'Statistic',
      'TaskList',
      'Timeline',
      'SettingSection',
    ],
  },
  {
    section: 'layout',
    label: '导航与布局',
    comps: [
      'Tabs',
      'SidebarNav',
      'TitleBar',
      'Toolbar',
      'PageShell',
      'SplitLayout',
      'Wizard',
      'Breadcrumb',
      'Accordion',
      'Pagination',
      'Hint',
      'StatusBar',
      'Divider',
      'Space',
    ],
  },
  { section: 'patterns', label: '启动器组合', comps: ['Window', 'Settings', 'Tasks'] },
  { section: 'theme', label: '设计', comps: ['Design Tokens', 'Dark Mode'] },
]

export function OverviewSection({ onNavigate }: SectionProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_CMD)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      // 非安全上下文下剪贴板不可用时静默失败
    }
  }

  return (
    <div className="demo-overview">
      <section className="demo-hero">
        <span className="demo-hero__badge">
          <IconStar size={12} />
          Aelux Launcher · 通用 UI 组件库
        </span>
        <h1>
          为 Aelux 生态打造的
          <br />
          冰蓝主题 <em>React 组件库</em>
        </h1>
        <p className="demo-hero__desc">
          一套与 Aelux Launcher 启动器同源的设计系统：React 19 + TypeScript，ESM + d.ts 双产物，
          零运行时依赖，66 个组件覆盖基础、表单、反馈、浮层、数据展示与窗口布局，并附启动器组合示例。
        </p>

        <div className="demo-hero__actions">
          <Button variant="primary" size="md" rightIcon={<IconChevronRight size={14} />} onClick={() => onNavigate?.('basic')}>
            浏览组件
          </Button>
          <Button variant="secondary" size="md" leftIcon={<IconPlay size={13} />} onClick={() => onNavigate?.('theme')}>
            查看设计变量
          </Button>
          <span className="demo-install">
            <span className="demo-install__prompt">$</span>
            <span>{INSTALL_CMD}</span>
            <button type="button" onClick={handleCopy} title="复制安装命令" aria-label="复制安装命令">
              {copied ? <IconCheck size={12} /> : <IconCopy size={12} />}
            </button>
          </span>
        </div>

        <div className="demo-stats">
          {STATS.map((stat) => (
            <div className="demo-stat" key={stat.label}>
              <div className="demo-stat__value">{stat.value}</div>
              <div className="demo-stat__label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="demo-block">
        <header className="demo-block__head">
          <div className="demo-block__heading">
            <h3 className="demo-block__title">快速开始</h3>
            <p className="demo-block__desc">
              组件库只依赖 React 运行时；样式以单个 <code className="demo-code-inline">style.css</code> 提供，按需引入即可。
            </p>
          </div>
        </header>
        <pre className="demo-block__code">
          <code>{QUICK_START}</code>
        </pre>
      </section>

      <section className="demo-block">
        <header className="demo-block__head">
          <div className="demo-block__heading">
            <h3 className="demo-block__title">设计原则</h3>
            <p className="demo-block__desc">与 Aelux Launcher 保持一致的视觉语言，同时面向外部项目复用。</p>
          </div>
        </header>
        <div className="demo-block__preview" style={{ padding: 16 }}>
          <div className="demo-feature-grid" style={{ width: '100%' }}>
            {FEATURES.map((feature) => {
              const FeatureIcon = feature.icon
              return (
                <article className="demo-feature" key={feature.title}>
                  <span className="demo-feature__icon">
                    <FeatureIcon size={15} />
                  </span>
                  <h4>{feature.title}</h4>
                  <p>{feature.desc}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="demo-block">
        <header className="demo-block__head">
          <div className="demo-block__heading">
            <h3 className="demo-block__title">组件总览</h3>
            <p className="demo-block__desc">点击任意组件即可跳转到对应示例页。</p>
          </div>
        </header>
        <div className="demo-block__preview demo-block__preview--column">
          {COMPONENT_INDEX.map((group) => (
            <div key={group.section} style={{ width: '100%' }}>
              <p className="demo-label" style={{ margin: '0 0 8px' }}>
                {group.label}
              </p>
              <div className="demo-index">
                {group.comps.map((comp) => (
                  <button
                    type="button"
                    className="demo-index__item"
                    key={comp}
                    onClick={() => onNavigate?.(group.section, comp)}
                  >
                    <span className="demo-index__dot" />
                    <span>{comp}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="demo-block">
        <header className="demo-block__head">
          <div className="demo-block__heading">
            <h3 className="demo-block__title">与启动器协同</h3>
            <p className="demo-block__desc">
              同一份设计 token 也服务 Aelux Launcher 的桌面外壳，后续 Aelux-Launcher-App 直接消费
              <code className="demo-code-inline">aelux-components</code> 即可。
            </p>
          </div>
        </header>
        <div className="demo-block__preview">
          <Button variant="secondary" leftIcon={<IconMoon size={14} />} onClick={() => onNavigate?.('theme')}>
            亮 / 暗主题约定
          </Button>
          <Button variant="ghost" leftIcon={<IconGrid size={14} />} onClick={() => onNavigate?.('layout')}>
            布局与间距
          </Button>
        </div>
      </section>
    </div>
  )
}
