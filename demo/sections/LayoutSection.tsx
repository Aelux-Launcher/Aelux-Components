import { useState } from 'react'
import {
  Accordion,
  Avatar,
  Button,
  Divider,
  IconBell,
  IconDownload,
  IconFolder,
  IconGrid,
  IconInfo,
  IconLayout,
  IconPackage,
  IconPlus,
  IconRefresh,
  IconSearch,
  IconSettings,
  IconStar,
  IconUser,
  IconButton,
  Pagination,
  SidebarNav,
  Space,
  Tabs,
  Tag,
  TitleBar,
  Toolbar,
} from 'aelux-components'
import type { AccordionItem, SidebarNavGroup, TabItem } from 'aelux-components'
import { ShowcaseBlock } from '../components/ShowcaseBlock'
import type { SectionProps } from './types'

/* ---------- Tabs ---------- */

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

/* ---------- SidebarNav ---------- */

const SIDEBAR_GROUPS: SidebarNavGroup[] = [
  {
    key: 'workspace',
    label: '工作区',
    items: [
      { key: 'overview', label: '总览', icon: <IconGrid size={15} /> },
      { key: 'projects', label: '项目', icon: <IconFolder size={15} />, badge: '8' },
      { key: 'packages', label: '依赖包', icon: <IconPackage size={15} /> },
    ],
  },
  {
    key: 'account',
    label: '账户',
    items: [
      { key: 'team', label: '团队成员', icon: <IconUser size={15} /> },
      { key: 'settings', label: '设置', icon: <IconSettings size={15} /> },
      { key: 'upgrade', label: '升级到 Pro', icon: <IconStar size={15} />, badge: '新', disabled: true },
    ],
  },
]

const SIDEBAR_DETAILS: Record<string, string> = {
  overview: '总览：展示最近构建、告警与依赖健康度。↑ ↓ 在可见导航项之间移动并选中。',
  projects: '项目：当前工作区共 8 个启用项目，选中项联动右侧内容区。',
  packages: '依赖包：集中查看版本、许可证与升级建议。',
  team: '团队成员：邀请协作者并分配角色权限。',
  settings: '设置：主题、快捷键与工作区偏好。',
  upgrade: '升级到 Pro：该导航项处于 disabled 状态，键盘导航会跳过它。',
}

/* ---------- TitleBar ---------- */

const TITLE_BAR_CODE = `const [maximized, setMaximized] = useState(false)

<TitleBar
  icon={<IconLayout size={16} />}
  title="Auri Launcher"
  subtitle="v2.4.0 · 工作区：Aelux"
  maximized={maximized}
  dragRegion
  onMinimize={() => console.log('最小化')}
  onMaximize={() => setMaximized((v) => !v)}
  onClose={() => console.log('关闭')}
/>`

/* ---------- Toolbar ---------- */

const TOOLBAR_CODE = `<Toolbar
  ariaLabel="文档工具栏"
  variant="bordered"
  start={<span>工作区 / 文档</span>}
  end={<IconButton label="刷新" icon={<IconRefresh size={15} />} variant="ghost" size="sm" />}
>
  <Button size="sm" variant="primary" leftIcon={<IconPlus size={14} />}>新建</Button>
</Toolbar>`

/* ---------- Accordion ---------- */

const ACCORDION_ITEMS: AccordionItem[] = [
  {
    key: 'tokens',
    title: '设计 Token',
    description: '颜色 / 字号 / 间距 / 圆角',
    icon: <IconGrid size={16} />,
    content: (
      <Space size="sm" wrap>
        <Tag size="sm" color="primary" variant="soft">
          --aelux-primary
        </Tag>
        <Tag size="sm" color="info" variant="soft">
          --aelux-surface
        </Tag>
        <Tag size="sm" color="neutral" variant="outline">
          --aelux-radius-md
        </Tag>
        <Tag size="sm" color="neutral" variant="outline">
          --aelux-control-md
        </Tag>
      </Space>
    ),
  },
  {
    key: 'a11y',
    title: '可访问性',
    description: 'aria-expanded / aria-hidden / inert',
    icon: <IconInfo size={16} />,
    content: (
      <p style={{ margin: 0 }}>
        触发器使用 aria-expanded 与 aria-controls 关联面板；收起时面板 aria-hidden 且 inert，键盘与读屏器都不会进入。
      </p>
    ),
  },
  {
    key: 'motion',
    title: '动效',
    description: 'grid-template-rows 0fr → 1fr',
    icon: <IconRefresh size={16} />,
    content: <p style={{ margin: 0 }}>高度动画不依赖固定 max-height，内容变化时也能平滑展开，并自动遵循 prefers-reduced-motion。</p>,
  },
  {
    key: 'legacy',
    title: '历史版本',
    description: '暂不可用',
    icon: <IconPackage size={16} />,
    disabled: true,
    content: <p style={{ margin: 0 }}>禁用项无法展开，也不会响应键盘。</p>,
  },
]

const FAQ_ITEMS: AccordionItem[] = [
  {
    key: 'controlled',
    title: '受控与非受控',
    content: <p style={{ margin: 0 }}>传入 value 即为受控；使用 defaultValue 时组件内部维护展开状态。</p>,
  },
  {
    key: 'multiple',
    title: '多项展开',
    content: <p style={{ margin: 0 }}>multiple 允许多个面板同时展开；默认单选，再次点击已展开项会收起。</p>,
  },
  {
    key: 'disabled',
    title: '禁用项',
    content: <p style={{ margin: 0 }}>disabled 项降低对比度并阻止交互。</p>,
    disabled: true,
  },
]

/* ---------- Pagination ---------- */

const PAGED_ITEMS = Array.from({ length: 23 }, (_, index) => `变更记录 #${String(index + 1).padStart(2, '0')}`)

/* ---------- Space ---------- */

const SPACE_TAGS = [
  { key: 'design', label: '设计', color: 'primary' },
  { key: 'frontend', label: '前端', color: 'info' },
  { key: 'desktop', label: '桌面端', color: 'success' },
] as const

const WRAP_LABELS = ['React 19', 'TypeScript 5.9', 'Vite 8', 'Electron', 'CSS 变量', 'ESM + d.ts', '零依赖', 'A11y', '深色主题', 'Tree-shaking']

function spaceChips() {
  return SPACE_TAGS.map((tag) => (
    <Tag key={tag.key} color={tag.color} size="sm">
      {tag.label}
    </Tag>
  ))
}

export function LayoutSection(props: SectionProps) {
  /* Tabs */
  const [activeTab, setActiveTab] = useState('overview')
  const [pillTab, setPillTab] = useState('week')
  const [pillSmTab, setPillSmTab] = useState('day')

  /* SidebarNav */
  const [sidebarKey, setSidebarKey] = useState('projects')
  const [collapsed, setCollapsed] = useState(false)

  /* TitleBar */
  const [maximized, setMaximized] = useState(false)
  const [lastAction, setLastAction] = useState('尚未点击窗口按钮')

  /* Pagination */
  const [page, setPage] = useState(1)
  const [pageSm, setPageSm] = useState(3)
  const [paginationDisabled, setPaginationDisabled] = useState(false)

  /* Accordion */
  const [openKeys, setOpenKeys] = useState<string[]>(['tokens', 'a11y'])

  const pageSize = 8
  const pagedRows = PAGED_ITEMS.slice((page - 1) * pageSize, page * pageSize)

  return (
    <>
      <ShowcaseBlock
        title="Tabs：line 外观与受控切换"
        description="value + onChange 受控切换；支持图标与禁用项。键盘 ← → 切换并移动焦点，Home / End 跳转首尾。"
        anchor="Tabs"
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
        title="Tabs：pill 外观与尺寸"
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
        title="Tabs：非受控与 block 等宽"
        description="defaultValue 提供非受控初始项；block 让标签等宽铺满容器。"
        code={`<Tabs block defaultValue="week" items={items} />`}
        column
      >
        <Tabs block defaultValue="week" items={PILL_ITEMS} />
      </ShowcaseBlock>

      <ShowcaseBlock
        title="SidebarNav：受控选中与内容联动"
        description="value + onValueChange 受控；↑ ↓ 在可见项之间移动并选中，Home / End 跳转首尾，禁用项自动跳过。header / footer 插槽可放品牌与折叠按钮。"
        anchor="SidebarNav"
        code={`const [active, setActive] = useState('projects')

<SidebarNav
  groups={groups}
  value={active}
  onValueChange={setActive}
  header={<strong>Aelux</strong>}
  footer={<IconButton label="折叠" icon={<IconChevronLeft size={15} />} />}
/>`}
        column
      >
        <div style={{ display: 'flex', width: '100%', border: '1px solid var(--aelux-border)', borderRadius: 'var(--aelux-radius-md)', overflow: 'hidden', minHeight: 286 }}>
          <SidebarNav
            groups={SIDEBAR_GROUPS}
            value={sidebarKey}
            onValueChange={setSidebarKey}
            collapsed={collapsed}
            header={
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                <IconLayout size={16} />
                {!collapsed && 'Aelux 工作区'}
              </span>
            }
            footer={
              <IconButton
                label={collapsed ? '展开侧边栏' : '收起侧边栏'}
                icon={<IconLayout size={15} />}
                variant="ghost"
                size="sm"
                onClick={() => setCollapsed((value) => !value)}
              />
            }
          />
          <div style={{ flex: 1, minWidth: 0, padding: 16, background: 'var(--aelux-surface)' }}>
            <span className="demo-label">当前导航：{sidebarKey}</span>
            <p style={{ margin: '8px 0 0' }}>{SIDEBAR_DETAILS[sidebarKey] ?? '选择一个导航项查看内容。'}</p>
            <div style={{ marginTop: 12 }}>
              <Button size="sm" variant="secondary" onClick={() => setCollapsed((value) => !value)}>
                {collapsed ? '展开侧边栏' : '折叠为 56px 图标栏'}
              </Button>
            </div>
          </div>
        </div>
        <span className="demo-label">collapsed 时宽度 56px，仅保留图标，文字通过 sr-only 保留可访问名。</span>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="TitleBar：窗口标题栏与拖拽区域"
        description={`36px 高，左侧图标 + 标题 + 副标题，中间 children。dragRegion 时容器带 data-tauri-drag-region，按钮区域不参与拖动；maximized 切换还原图标。当前主题：${props.theme === 'dark' ? '深色' : '浅色'}。`}
        anchor="TitleBar"
        code={TITLE_BAR_CODE}
        column
      >
        <div style={{ width: '100%', border: '1px solid var(--aelux-border)', borderRadius: 'var(--aelux-radius-md)', overflow: 'hidden' }}>
          <TitleBar
            icon={<IconLayout size={16} />}
            title="Auri Launcher"
            subtitle="v2.4.0 · 工作区：Aelux"
            maximized={maximized}
            dragRegion
            onMinimize={() => setLastAction('点击了最小化')}
            onMaximize={() => {
              setMaximized((value) => !value)
              setLastAction(maximized ? '点击了还原' : '点击了最大化')
            }}
            onClose={() => setLastAction('点击了关闭')}
          >
            <Tag size="sm" color="info" variant="soft">
              {maximized ? '已最大化' : '窗口模式'}
            </Tag>
          </TitleBar>
          <div style={{ padding: '14px 16px', background: 'var(--aelux-surface-subtle)' }}>
            <span className="demo-label">窗口回调：{lastAction}</span>
          </div>
        </div>
        <div style={{ width: '100%', border: '1px solid var(--aelux-border)', borderRadius: 'var(--aelux-radius-md)', overflow: 'hidden' }}>
          <TitleBar
            icon={<IconLayout size={16} />}
            title="无窗口按钮"
            subtitle="showControls={false}"
            showControls={false}
            dragRegion
          >
            <span className="demo-label">只保留中间插槽</span>
          </TitleBar>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Toolbar：三槽位与变体"
        description="start / children / end 三个槽位；variant 支持 plain / bordered，size 支持 sm / md，sticky 时吸顶并带下边框。"
        anchor="Toolbar"
        code={TOOLBAR_CODE}
        column
      >
        <Toolbar
          ariaLabel="文档工具栏"
          variant="bordered"
          start={<span className="demo-label">工作区 / 文档</span>}
          end={
            <>
              <IconButton label="搜索" icon={<IconSearch size={15} />} variant="ghost" size="sm" />
              <IconButton label="刷新" icon={<IconRefresh size={15} />} variant="ghost" size="sm" />
              <IconButton label="下载" icon={<IconDownload size={15} />} variant="ghost" size="sm" />
            </>
          }
        >
          <Button size="sm" variant="primary" leftIcon={<IconPlus size={14} />}>
            新建
          </Button>
          <Button size="sm" variant="secondary">
            导入
          </Button>
        </Toolbar>

        <Toolbar ariaLabel="紧凑工具栏" size="sm" start={<Tag size="sm">sm</Tag>} end={<span className="demo-label">end 槽位</span>}>
          <span className="demo-label">size=&quot;sm&quot; 的紧凑按钮行</span>
        </Toolbar>

        <div
          style={{
            width: '100%',
            height: 168,
            overflow: 'auto',
            border: '1px solid var(--aelux-border)',
            borderRadius: 'var(--aelux-radius-md)',
          }}
        >
          <Toolbar ariaLabel="吸顶工具栏" variant="bordered" sticky start={<span className="demo-label">sticky</span>}>
            <span className="demo-label">向下滚动时工具栏保持吸顶</span>
          </Toolbar>
          <div style={{ padding: 16, display: 'grid', gap: 10 }}>
            {Array.from({ length: 8 }, (_, index) => (
              <span key={index} className="demo-label">
                滚动内容第 {index + 1} 行
              </span>
            ))}
          </div>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Accordion：多项展开与受控"
        description="multiple 允许同时展开多项；value + onValueChange 受控，defaultValue 非受控。按钮带 aria-expanded，面板收起时 aria-hidden + inert。"
        anchor="Accordion"
        code={`const [open, setOpen] = useState<string[]>(['tokens'])

<Accordion
  multiple
  items={items}
  value={open}
  onValueChange={setOpen}
/>`}
        column
      >
        <Accordion multiple items={ACCORDION_ITEMS} value={openKeys} onValueChange={setOpenKeys} />
        <span className="demo-label">已展开：{openKeys.length > 0 ? openKeys.join('、') : '无'}</span>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Accordion：plain 外观与尺寸"
        description="variant='plain' 去掉外框，仅保留分隔线；size='sm' 更紧凑；单选模式下再次点击已展开项会收起。"
        code={`<Accordion variant="plain" size="sm" items={items} />

<Accordion items={items} defaultValue={['controlled']} />`}
        column
      >
        <Accordion variant="plain" size="sm" items={FAQ_ITEMS} />
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Pagination：真实分页与总数"
        description={`page / pageSize / total + onPageChange 受控；siblingCount 默认 1，自动计算省略号；当前页 aria-current="page"。共 ${PAGED_ITEMS.length} 条数据、每页 ${pageSize} 条，下面是真实切页的数据。`}
        anchor="Pagination"
        code={`const [page, setPage] = useState(1)

<Pagination
  page={page}
  pageSize={8}
  total={23}
  showTotal
  onPageChange={setPage}
/>`}
        column
      >
        <div className="demo-surface" style={{ width: '100%' }}>
          <div style={{ display: 'grid', gap: 6 }}>
            {pagedRows.map((row) => (
              <div key={row} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontSize: 'var(--aelux-font-size-sm)' }}>{row}</span>
                <Tag size="sm" color="neutral" variant="outline">
                  已合并
                </Tag>
              </div>
            ))}
          </div>
        </div>
        <Pagination page={page} pageSize={pageSize} total={PAGED_ITEMS.length} showTotal onPageChange={setPage} />
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Pagination：兄弟页码、尺寸与禁用"
        description="siblingCount 控制当前页两侧的兄弟页码数量；size 支持 sm / md；disabled 禁用全部分页操作。"
        code={`<Pagination page={page} pageSize={6} total={120} siblingCount={2} onPageChange={setPage} />
<Pagination page={page} pageSize={6} total={120} size="sm" disabled />`}
        column
      >
        <Pagination page={pageSm} pageSize={6} total={120} siblingCount={2} onPageChange={setPageSm} />
        <div className="demo-row">
          <Pagination page={pageSm} pageSize={6} total={120} size="sm" disabled={paginationDisabled} onPageChange={setPageSm} />
          <Button size="sm" variant="secondary" onClick={() => setPaginationDisabled((value) => !value)}>
            {paginationDisabled ? '恢复可用' : '禁用分页'}
          </Button>
        </div>
        <span className="demo-label">当前页：{pageSm}</span>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="分割线：水平与虚线"
        description="默认水平实线；variant='dashed' 使用虚线；组件自带上下 16px 间距。"
        anchor="Divider"
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
        anchor="Space"
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
