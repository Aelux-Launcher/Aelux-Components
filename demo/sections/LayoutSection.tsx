import { useState } from 'react'
import {
  Avatar,
  Divider,
  IconBell,
  IconGrid,
  IconSettings,
  Space,
  Tabs,
  Tag,
} from 'aelux-components'
import type { TabItem } from 'aelux-components'
import { ShowcaseBlock } from '../components/ShowcaseBlock'
import type { SectionProps } from './types'

function tabPanel(title: string, description: string) {
  return (
    <div className="demo-surface">
      <span className="demo-label">{title}</span>
      <p style={{ margin: '6px 0 0' }}>{description}</p>
    </div>
  )
}

const LINE_ITEMS: TabItem[] = [
  {
    key: 'overview',
    label: '总览',
    icon: <IconGrid size={14} />,
    content: tabPanel('总览', 'Tabs 自动生成 role="tablist" / role="tab" / role="tabpanel" 与 aria-selected。'),
  },
  {
    key: 'activity',
    label: '活动',
    icon: <IconBell size={14} />,
    content: tabPanel('活动', '← → 切换标签并移动焦点，Home / End 跳到首尾，禁用项会被自动跳过。'),
  },
  {
    key: 'settings',
    label: '设置',
    icon: <IconSettings size={14} />,
    content: tabPanel('设置', '内容区仅渲染当前面板，其余面板保留 DOM 但处于 hidden 状态。'),
  },
  {
    key: 'locked',
    label: '即将开放',
    disabled: true,
    content: tabPanel('即将开放', '禁用项不可选中，也不会进入键盘焦点顺序。'),
  },
]

const PILL_ITEMS: TabItem[] = [
  { key: 'day', label: '今日', content: tabPanel('今日', 'pill 外观采用分段控件样式，适合工具栏级别的切换。') },
  { key: 'week', label: '本周', content: tabPanel('本周', '受控模式下由 value + onChange 决定当前项。') },
  { key: 'month', label: '本月', content: tabPanel('本月', 'size 支持 sm / md，可与其他控件对齐。') },
  { key: 'custom', label: '自定义', content: tabPanel('自定义', 'block 会让所有标签等宽铺满容器。') },
]

const SPACE_TAGS = [
  { key: 'design', label: '设计', color: 'primary' },
  { key: 'frontend', label: '前端', color: 'info' },
  { key: 'desktop', label: '桌面端', color: 'success' },
] as const

const WRAP_LABELS = [
  'React 19',
  'TypeScript 5.9',
  'Vite 8',
  'Electron',
  'CSS 变量',
  'ESM + d.ts',
  '零依赖',
  'A11y',
  '深色主题',
  'Tree-shaking',
]

function spaceChips() {
  return SPACE_TAGS.map((tag) => (
    <Tag key={tag.key} color={tag.color} size="sm">
      {tag.label}
    </Tag>
  ))
}

export function LayoutSection(_props: SectionProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [pillTab, setPillTab] = useState('week')
  const [pillSmTab, setPillSmTab] = useState('day')

  return (
    <>
      <ShowcaseBlock
        title="标签页：line 外观与受控切换"
        description="value + onChange 受控切换；支持图标与禁用项。键盘 ← → 切换并移动焦点，Home / End 跳转首尾。"
        code={`const [active, setActive] = useState('overview')

<Tabs
  value={active}
  onChange={setActive}
  items={[
    { key: 'overview', label: '总览', icon: <IconGrid size={14} /> },
    { key: 'settings', label: '设置', icon: <IconSettings size={14} /> },
    { key: 'locked', label: '即将开放', disabled: true },
  ]}
/>`}
        column
      >
        <Tabs value={activeTab} onChange={setActiveTab} items={LINE_ITEMS} />
        <span className="demo-label">当前激活项：{activeTab}</span>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="标签页：pill 外观与尺寸"
        description="variant='pill' 使用分段控件外观；size 支持 sm / md，便于与输入框、按钮对齐。"
        code={`<Tabs variant="pill" value={tab} onChange={setTab} items={items} />
<Tabs variant="pill" size="sm" value={tab} onChange={setTab} items={items} />`}
        column
      >
        <Tabs variant="pill" value={pillTab} onChange={setPillTab} items={PILL_ITEMS} />
        <Tabs variant="pill" size="sm" value={pillSmTab} onChange={setPillSmTab} items={PILL_ITEMS} />
        <span className="demo-label">
          md 当前项：{pillTab} · sm 当前项：{pillSmTab}
        </span>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="标签页：非受控与 block 等宽"
        description="defaultValue 提供非受控初始项；block 让标签等宽铺满容器。"
        code={`<Tabs block defaultValue="week" items={items} />`}
        column
      >
        <Tabs block defaultValue="week" items={PILL_ITEMS} />
      </ShowcaseBlock>

      <ShowcaseBlock
        title="分割线：水平与虚线"
        description="默认水平实线；variant='dashed' 使用虚线；组件自带上下 16px 间距。"
        code={`<Divider />
<Divider variant="dashed" />`}
        column
      >
        <div className="demo-stack">
          <span className="demo-label">上方内容 · 基础分割线</span>
          <Divider />
          <span className="demo-label">下方内容 · 虚线分割线</span>
          <Divider variant="dashed" />
          <span className="demo-label">分割线之后的段落</span>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="分割线：带标题与对齐"
        description="children 作为水平分割线标题；align 支持 left / center / right。"
        code={`<Divider>默认居中</Divider>
<Divider align="left">左侧对齐</Divider>
<Divider align="right">右侧对齐</Divider>`}
        column
      >
        <Divider>默认居中</Divider>
        <Divider align="left">左侧对齐</Divider>
        <Divider align="right">右侧对齐</Divider>
        <Divider variant="dashed" align="left">
          虚线 + 左侧对齐
        </Divider>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="分割线：垂直分隔"
        description="orientation='vertical'，需要父容器提供高度；常用于行内信息或工具栏分隔。"
        code={`<div style={{ display: 'flex', height: 44 }}>
  <span>列表</span>
  <Divider orientation="vertical" />
  <span>详情</span>
</div>`}
      >
        <div className="demo-row" style={{ height: 44 }}>
          <span className="demo-label">列表</span>
          <Divider orientation="vertical" />
          <span className="demo-label">详情</span>
          <Divider orientation="vertical" variant="dashed" />
          <span className="demo-label">设置</span>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="间距：方向与尺寸"
        description="基于 flex gap 实现，不给子元素添加 margin；size 支持 sm(6) / md(12) / lg(20) 或数字像素；direction 支持 horizontal / vertical。"
        code={`<Space size="sm">{chips}</Space>
<Space size="lg">{chips}</Space>
<Space direction="vertical" size="md">{chips}</Space>`}
        column
      >
        <div className="demo-stack">
          <Space size="sm">{spaceChips()}</Space>
          <Space size="md">{spaceChips()}</Space>
          <Space size="lg">{spaceChips()}</Space>
          <Space size={4}>{spaceChips()}</Space>
          <Space direction="vertical" size="sm">
            {spaceChips()}
          </Space>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="间距：交叉轴对齐"
        description="align 控制交叉轴对齐：start / center / end / stretch；用不同尺寸的头像对比更直观。"
        code={`<Space align="start" size="sm">
  <Avatar size="sm" name="A" />
  <Avatar size="lg" name="B" />
</Space>`}
        column
      >
        <div className="demo-row">
          {(['start', 'center', 'end', 'stretch'] as const).map((align) => (
            <div className="demo-surface" key={align} style={{ width: 168, height: 132 }}>
              <div className="demo-stack">
                <span className="demo-label">align={align}</span>
                <Space align={align} size="sm">
                  <Avatar name="A" size="sm" />
                  <Avatar name="B" size="lg" />
                </Space>
              </div>
            </div>
          ))}
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="间距：换行与撑满"
        description="wrap 在容器空间不足时自动换行；block 让 Space 占满整行。"
        code={`<div style={{ width: 280 }}>
  <Space wrap size="sm">{chips}</Space>
</div>
<Space block size="md">{chips}</Space>`}
        column
      >
        <div className="demo-surface" style={{ width: 288 }}>
          <Space wrap size="sm">
            {WRAP_LABELS.map((label) => (
              <Tag key={label} size="sm" color="neutral" variant="outline">
                {label}
              </Tag>
            ))}
          </Space>
        </div>
        <Space block size="md">
          <Tag color="primary" variant="soft">
            block
          </Tag>
          <Tag color="info" variant="soft">
            占满整行
          </Tag>
          <span className="demo-label">Space 撑满容器宽度，子元素保持自身宽度。</span>
        </Space>
      </ShowcaseBlock>
    </>
  )
}
