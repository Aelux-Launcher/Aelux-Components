import {
  IconBell,
  IconCheck,
  IconCode,
  IconCopy,
  IconDownload,
  IconEdit,
  IconEye,
  IconFolder,
  IconGrid,
  IconLayout,
  IconMoon,
  IconPackage,
  IconPlay,
  IconRefresh,
  IconSearch,
  IconSettings,
  IconStar,
  IconSun,
  IconTrash,
  IconUser,
} from 'aelux-components'
import type { SectionProps } from './types'
import { ShowcaseBlock } from '../components/ShowcaseBlock'

const PALETTE = [
  { level: '50', hex: '#e8f7ff' },
  { level: '100', hex: '#cff0ff' },
  { level: '200', hex: '#a6e4ff' },
  { level: '300', hex: '#70d1f8' },
  { level: '400', hex: '#42b8ec' },
  { level: '500', hex: '#28a4e0' },
  { level: '600', hex: '#1887c7' },
  { level: '700', hex: '#106ca3' },
  { level: '800', hex: '#0e5784' },
  { level: '900', hex: '#0c486d' },
]

const FUNCTIONAL = [
  { name: '成功 success', token: '--aelux-success', hex: '#22c55e' },
  { name: '警告 warning', token: '--aelux-warning', hex: '#f59e0b' },
  { name: '危险 danger', token: '--aelux-danger', hex: '#ef4444' },
  { name: '信息 info', token: '--aelux-info', hex: '#38bdf8' },
]

const FONT_SCALE = [
  { name: '--aelux-font-size-xs', px: 11, usage: '辅助标签 / 计数' },
  { name: '--aelux-font-size-sm', px: 12, usage: '次要说明' },
  { name: '--aelux-font-size-md', px: 13, usage: '正文 / 控件' },
  { name: '--aelux-font-size-lg', px: 15, usage: '卡片标题' },
  { name: '--aelux-font-size-xl', px: 18, usage: '区块标题' },
  { name: '--aelux-font-size-2xl', px: 22, usage: '页面标题' },
]

const RADII = [
  { token: '--aelux-radius-xs', value: '4px' },
  { token: '--aelux-radius-sm', value: '6px' },
  { token: '--aelux-radius-md', value: '8px' },
  { token: '--aelux-radius-lg', value: '12px' },
  { token: '--aelux-radius-xl', value: '16px' },
  { token: '--aelux-radius-full', value: '999px' },
]

const SEMANTIC_TOKENS = [
  { token: '--aelux-bg-page', usage: '页面背景', color: true },
  { token: '--aelux-surface', usage: '卡片 / 容器表面', color: true },
  { token: '--aelux-surface-subtle', usage: '次级表面 / 代码块', color: true },
  { token: '--aelux-surface-hover', usage: '悬停态表面', color: true },
  { token: '--aelux-text', usage: '主文字', color: true },
  { token: '--aelux-text-secondary', usage: '次要文字', color: true },
  { token: '--aelux-text-tertiary', usage: '辅助文字', color: true },
  { token: '--aelux-border', usage: '常规描边', color: true },
  { token: '--aelux-border-focus', usage: '聚焦描边', color: true },
  { token: '--aelux-primary', usage: '品牌主色（基准 500）', color: true },
  { token: '--aelux-primary-soft', usage: '主色浅底（选中 / 徽标）', color: true },
  { token: '--aelux-focus-ring', usage: '键盘焦点外发光' },
  { token: '--aelux-control-md', usage: '标准控件高度 34px' },
  { token: '--aelux-font-sans', usage: '界面字体栈' },
  { token: '--aelux-font-mono', usage: '等宽字体栈' },
]

const THEME_USAGE = `// 1. 约定：主题写在 <html data-theme="light | dark"> 上
document.documentElement.setAttribute('data-theme', 'dark')

// 2. 持久化（与 AeluxWebSite 相同的 key）
localStorage.setItem('aelux-theme', 'dark')

// 3. 未显式指定时，自动跟随系统偏好
//    @media (prefers-color-scheme: dark) 内的 token 生效`

const ICON_USAGE = `import { Icon, IconCheck, IconSearch } from 'aelux-components'

<IconCheck size={16} />
<IconSearch size={14} />        // 常用图标已内置
<Icon size={18}>...</Icon>      // 也可以传入自定义 SVG 子节点`

const CUSTOMIZE_CODE = `/* 只需覆盖任意 --aelux-* 变量即可换肤 */
:root {
  --aelux-primary-500: #6366f1;
  --aelux-primary: var(--aelux-primary-500);
  --aelux-radius-md: 10px;
}`

export function ThemeSection({ theme }: SectionProps) {
  return (
    <div>
      <ShowcaseBlock
        title="品牌主色"
        description="冰蓝主色 10 阶，--aelux-primary-500 为基准色，组件全部引用语义变量而非具体阶数。"
        column
      >
        <div className="demo-swatches">
          {PALETTE.map((item) => (
            <div className="demo-swatch" key={item.level}>
              <div className="demo-swatch__color" style={{ background: item.hex }} />
              <div className="demo-swatch__meta">
                <div className="demo-swatch__name">primary-{item.level}</div>
                <div className="demo-swatch__hex">{item.hex}</div>
              </div>
            </div>
          ))}
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="功能色"
        description="成功、警告、危险、信息四种状态色，含 hover / soft / soft-border / text 派生变量。"
      >
        {FUNCTIONAL.map((item) => (
          <div
            className="demo-swatch"
            key={item.token}
            style={{ width: 150 }}
          >
            <div className="demo-swatch__color" style={{ background: item.hex }} />
            <div className="demo-swatch__meta">
              <div className="demo-swatch__name">{item.name}</div>
              <div className="demo-swatch__hex">{item.token}</div>
            </div>
          </div>
        ))}
      </ShowcaseBlock>

      <ShowcaseBlock
        title="语义变量"
        description="组件只消费语义变量，因此在暗色主题下无需改写组件样式。"
        column
        code={CUSTOMIZE_CODE}
      >
        <table className="demo-token-table">
          <thead>
            <tr>
              <th style={{ width: 260 }}>变量</th>
              <th>用途</th>
            </tr>
          </thead>
          <tbody>
            {SEMANTIC_TOKENS.map((item) => (
              <tr key={item.token}>
                <td>
                  {'color' in item && item.color ? (
                    <span
                      aria-hidden="true"
                      style={{
                        display: 'inline-block',
                        width: 13,
                        height: 13,
                        marginRight: 8,
                        borderRadius: 4,
                        verticalAlign: '-2px',
                        border: '1px solid var(--aelux-border)',
                        background: `var(${item.token})`,
                      }}
                    />
                  ) : null}
                  <code>{item.token}</code>
                </td>
                <td>{item.usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="字号阶梯"
        description="正文 13px、标题 15 / 18 / 22px，与 Aelux Launcher 现有界面保持一致。"
        column
      >
        <div style={{ width: '100%' }}>
          {FONT_SCALE.map((item) => (
            <div className="demo-type-row" key={item.name}>
              <span>{item.px}px</span>
              <span style={{ fontSize: item.px }}>Aelux 冰蓝组件库 · 中文示例 Aa</span>
              <span style={{ marginLeft: 'auto', color: 'var(--aelux-text-tertiary)', fontSize: 11.5 }}>
                {item.usage}
              </span>
            </div>
          ))}
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="圆角与阴影"
        description="控件与卡片以 8px 圆角为基准；阴影仅用于浮层与悬停强调，保持桌面端克制。"
        column
      >
        <div className="demo-radius-demo">
          {RADII.map((item) => (
            <span key={item.token} style={{ borderRadius: `var(${item.token})`, width: 92, height: 54, display: 'grid' }}>
              {item.value}
            </span>
          ))}
        </div>
        <div className="demo-shadow-row">
          <div className="demo-shadow-card" style={{ boxShadow: 'var(--aelux-shadow-sm)' }}>
            shadow-sm
          </div>
          <div className="demo-shadow-card" style={{ boxShadow: 'var(--aelux-shadow-md)' }}>
            shadow-md
          </div>
          <div className="demo-shadow-card" style={{ boxShadow: 'var(--aelux-shadow-lg)' }}>
            shadow-lg
          </div>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="亮暗主题约定"
        description={`当前主题：${theme === 'light' ? '浅色 light' : '深色 dark'}。右上角可实时切换；组件样式全部由 token 派生，无需重复编写暗色规则。`}
        code={THEME_USAGE}
      >
        <div className="demo-row" style={{ width: '100%' }}>
          <span className="demo-chip demo-chip--accent">
            <IconSun size={13} /> data-theme="light"
          </span>
          <span className="demo-chip">
            <IconMoon size={13} /> data-theme="dark"
          </span>
          <span className="demo-chip">localStorage: aelux-theme</span>
          <span className="demo-chip">prefers-color-scheme 自动跟随</span>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="内置图标"
        description="34 个常用线性图标，全部内联 SVG，不引入第三方图标库；颜色跟随 currentColor，尺寸默认 16。"
        column
        code={ICON_USAGE}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {[
            { icon: IconCheck, name: 'Check' },
            { icon: IconSearch, name: 'Search' },
            { icon: IconSettings, name: 'Settings' },
            { icon: IconFolder, name: 'Folder' },
            { icon: IconDownload, name: 'Download' },
            { icon: IconCopy, name: 'Copy' },
            { icon: IconTrash, name: 'Trash' },
            { icon: IconPlay, name: 'Play' },
            { icon: IconRefresh, name: 'Refresh' },
            { icon: IconStar, name: 'Star' },
            { icon: IconEdit, name: 'Edit' },
            { icon: IconEye, name: 'Eye' },
            { icon: IconUser, name: 'User' },
            { icon: IconBell, name: 'Bell' },
            { icon: IconGrid, name: 'Grid' },
            { icon: IconLayout, name: 'Layout' },
            { icon: IconCode, name: 'Code' },
            { icon: IconPackage, name: 'Package' },
          ].map((item) => {
            const ItemIcon = item.icon
            return (
              <div
                key={item.name}
                className="demo-surface"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  width: 78,
                  padding: '12px 8px',
                  color: 'var(--aelux-text-secondary)',
                }}
              >
                <ItemIcon size={16} />
                <span style={{ fontSize: 10.5 }}>{item.name}</span>
              </div>
            )
          })}
        </div>
      </ShowcaseBlock>
    </div>
  )
}
