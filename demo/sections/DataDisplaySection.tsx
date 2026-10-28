import { useState } from 'react'
import {
  Avatar,
  Badge,
  Button,
  Card,
  DescriptionList,
  IconBell,
  IconCheck,
  IconDownload,
  IconFolder,
  IconGrid,
  IconPlay,
  IconRefresh,
  IconSettings,
  IconUser,
  IconWarning,
  ListBox,
  ListItem,
  Select,
  SettingRow,
  SettingSection,
  Statistic,
  Switch,
  Table,
  Tag,
  TaskList,
  Timeline,
} from 'aelux-components'
import type {
  DescriptionItem,
  ListBoxOption,
  TableColumn,
  TagColor,
  TaskItem,
  TimelineItem,
} from 'aelux-components'
import { ShowcaseBlock } from '../components/ShowcaseBlock'
import type { SectionProps } from './types'

const DEMO_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%2356c4ef'/%3E%3Cstop offset='1' stop-color='%231878b3'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='64' height='64' fill='url(%23g)'/%3E%3Ccircle cx='32' cy='24' r='11' fill='%23eaf9ff'/%3E%3Cpath d='M11 62c2-13 10-20 21-20s19 7 21 20z' fill='%23eaf9ff'/%3E%3C/svg%3E"

const TAG_COLORS: TagColor[] = ['primary', 'success', 'warning', 'danger', 'info', 'neutral']
const TAG_VARIANTS = ['soft', 'solid', 'outline'] as const

interface DemoTag {
  key: string
  label: string
  color: TagColor
}

const DEFAULT_TAGS: DemoTag[] = [
  { key: 'react', label: 'React 19', color: 'primary' },
  { key: 'vite', label: 'Vite 8', color: 'info' },
  { key: 'electron', label: 'Electron', color: 'success' },
  { key: 'preview', label: '预览版', color: 'warning' },
]

type InstanceStatus = 'running' | 'updating' | 'stopped'

interface LauncherInstance {
  key: string
  name: string
  version: string
  loader: string
  memory: string
  status: InstanceStatus
}

const INSTANCES: LauncherInstance[] = [
  {
    key: 'frost',
    name: '冰原生存',
    version: '1.21.4',
    loader: 'Fabric 0.16.9',
    memory: '4 GB',
    status: 'running',
  },
  {
    key: 'skyblock',
    name: '空岛挑战',
    version: '1.21.1',
    loader: 'NeoForge 21.1.0',
    memory: '6 GB',
    status: 'updating',
  },
  {
    key: 'create',
    name: '机械工坊',
    version: '1.20.6',
    loader: 'Forge 50.0.9',
    memory: '8 GB',
    status: 'stopped',
  },
  {
    key: 'vanilla',
    name: '原版纯净',
    version: '1.21.4',
    loader: 'Vanilla',
    memory: '2 GB',
    status: 'stopped',
  },
  {
    key: 'lab',
    name: '整合包实验室',
    version: '1.19.2',
    loader: 'Fabric 0.15.7',
    memory: '10 GB',
    status: 'stopped',
  },
]

const STATUS_META: Record<InstanceStatus, { label: string; color: TagColor }> = {
  running: { label: '运行中', color: 'success' },
  updating: { label: '更新中', color: 'info' },
  stopped: { label: '已停止', color: 'neutral' },
}

const toInstanceOption = (instance: LauncherInstance): ListBoxOption => ({
  key: instance.key,
  label: instance.name,
  description: `${instance.version} · ${instance.loader}`,
  icon: <Avatar name={instance.name} size="sm" shape="rounded" />,
  badge: (
    <Tag size="sm" variant="soft" color={STATUS_META[instance.status].color}>
      {STATUS_META[instance.status].label}
    </Tag>
  ),
})

interface GameVersion {
  id: string
  version: string
  channel: '正式版' | '预览版'
  size: string
  released: string
  latest?: boolean
}

const VERSIONS: GameVersion[] = [
  {
    id: '1.21.4',
    version: '1.21.4',
    channel: '正式版',
    size: '642 MB',
    released: '2026-09-18',
    latest: true,
  },
  { id: '1.21.4-rc1', version: '1.21.4-rc1', channel: '预览版', size: '638 MB', released: '2026-09-08' },
  { id: '1.20.6', version: '1.20.6', channel: '正式版', size: '611 MB', released: '2026-06-13' },
  { id: '1.20.1', version: '1.20.1', channel: '正式版', size: '607 MB', released: '2026-05-02' },
  { id: '1.19.4', version: '1.19.4', channel: '正式版', size: '590 MB', released: '2025-12-21' },
]

const VERSION_COLUMNS: TableColumn<GameVersion>[] = [
  {
    key: 'version',
    title: '版本',
    width: 176,
    render: (row) => (
      <span className="demo-row" style={{ flexWrap: 'nowrap', gap: 6 }}>
        <span style={{ fontWeight: 500 }}>{row.version}</span>
        {row.latest ? (
          <Tag size="sm" color="primary" variant="soft">
            最新
          </Tag>
        ) : null}
      </span>
    ),
  },
  {
    key: 'channel',
    title: '通道',
    width: 96,
    render: (row) => (
      <Tag size="sm" variant="soft" color={row.channel === '正式版' ? 'success' : 'warning'}>
        {row.channel}
      </Tag>
    ),
  },
  { key: 'size', title: '大小', width: 96, align: 'right' },
  { key: 'released', title: '发布时间', width: 124 },
  {
    key: 'action',
    title: '操作',
    width: 96,
    align: 'right',
    render: (row) => (
      <Button
        size="sm"
        variant="ghost"
        leftIcon={<IconDownload size={14} />}
        aria-label={`安装 ${row.version}`}
        onClick={(event) => event.stopPropagation()}
      >
        安装
      </Button>
    ),
  },
]

const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'fabric',
    title: 'Fabric Loader 0.16.9',
    description: '正在下载 fabric-loader-0.16.9.jar',
    status: 'running',
    progress: 62,
    speed: '2.4 MB/s',
    size: '38 / 61 MB',
  },
  {
    id: 'assets',
    title: '游戏资源索引 1.21.4',
    description: '正在校验资源完整性…',
    status: 'running',
    size: '642 MB',
  },
  {
    id: 'mods',
    title: '模组资源包 · 27 个文件',
    description: '等待前面的任务完成',
    status: 'pending',
    size: '412 MB',
  },
  {
    id: 'java',
    title: 'Java 21 运行时',
    description: '下载已暂停，可稍后继续',
    status: 'paused',
    progress: 35,
    speed: '0 B/s',
    size: '56 / 160 MB',
  },
  {
    id: 'shaders',
    title: '光影整合包',
    description: '连接超时，检查网络后可重试',
    status: 'error',
    size: '218 MB',
  },
  {
    id: 'instance',
    title: '实例「冰原生存」初始化',
    status: 'done',
    size: '642 MB',
  },
]

const VERSION_HISTORY: TimelineItem[] = [
  {
    key: '1.21.4',
    title: '发布 1.21.4 正式版',
    description: '同步资源索引，适配 Fabric 0.16.9 与 NeoForge 21.1.0。',
    time: '2026-09-18',
    status: 'success',
    icon: <IconCheck size={13} />,
  },
  {
    key: '1.21.4-rc1',
    title: '1.21.4 预览通道开放',
    description: '内测通道开放 3 天，共收集到 42 条反馈。',
    time: '2026-09-08',
  },
  {
    key: 'forge-args',
    title: '修复 Forge 启动参数',
    description: '部分 1.20.6 实例启动时缺少 JVM 参数的问题已修复。',
    time: '2026-07-02',
    status: 'warning',
    icon: <IconWarning size={13} />,
  },
  {
    key: 'rollback',
    title: '回滚 1.20.6 自动更新',
    description: '资源索引校验失败，已回滚到稳定版本。',
    time: '2026-06-14',
    status: 'danger',
    icon: <IconRefresh size={13} />,
  },
  {
    key: 'beta',
    title: 'Aelux Launcher 开启公测',
    description: '首个公开测试版本，支持 1.19 至 1.21 的实例管理。',
    time: '2025-12-01',
  },
]

export function DataDisplaySection(_props: SectionProps) {
  const [tags, setTags] = useState<DemoTag[]>(DEFAULT_TAGS)
  const [activeInstanceKey, setActiveInstanceKey] = useState<string>('frost')
  const [batchKeys, setBatchKeys] = useState<string[]>(['frost', 'vanilla'])
  const [selectedVersions, setSelectedVersions] = useState<string[]>(['1.21.4'])
  const [clickedVersion, setClickedVersion] = useState<string>('1.21.4')
  const [autoUpdate, setAutoUpdate] = useState(true)
  const [cacheCleared, setCacheCleared] = useState(false)
  const [statsLoading, setStatsLoading] = useState(false)
  const [listItemKey, setListItemKey] = useState<string>('frost')
  const [listItemAction, setListItemAction] = useState<string>('尚未操作')
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS)

  const activeInstance = INSTANCES.find((item) => item.key === activeInstanceKey) ?? INSTANCES[0]
  const batchInstances = INSTANCES.filter((item) => batchKeys.includes(item.key))

  const removeTag = (key: string) => {
    setTags((prev) => prev.filter((tag) => tag.key !== key))
  }

  const reloadStats = () => {
    if (statsLoading) return
    setStatsLoading(true)
    window.setTimeout(() => setStatsLoading(false), 1400)
  }

  const cancelTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const retryTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task): TaskItem =>
        task.id === id
          ? { ...task, status: 'running', progress: 0, speed: '0 B/s', description: '正在重新连接…' }
          : task,
      ),
    )
  }

  const clearDoneTasks = () => {
    setTasks((prev) => prev.filter((task) => task.status !== 'done'))
  }

  const detailItems: DescriptionItem[] = [
    { key: 'name', label: '实例名称', value: activeInstance.name },
    { key: 'version', label: '游戏版本', value: activeInstance.version },
    { key: 'loader', label: '模组加载器', value: activeInstance.loader },
    { key: 'memory', label: '内存分配', value: activeInstance.memory },
    {
      key: 'status',
      label: '运行状态',
      value: (
        <Tag size="sm" variant="soft" color={STATUS_META[activeInstance.status].color}>
          {STATUS_META[activeInstance.status].label}
        </Tag>
      ),
    },
    { key: 'lastPlayed', label: '最近启动', value: '今天 10:24' },
    {
      key: 'path',
      label: '安装目录',
      value: `D:\\Aelux\\instances\\${activeInstance.key}`,
      span: 2,
    },
  ]

  return (
    <>
      <ShowcaseBlock
        anchor="Card"
        title="卡片：三种变体"
        description="default 为 surface 背景 + 1px 边框；flat 使用浅色填充弱化层级；outline 只保留描边。hoverable 悬浮仅加深描边。"
        code={`<Card hoverable>
  <Card.Header>
    <Card.Title>默认卡片</Card.Title>
    <Card.Description>描述文字</Card.Description>
  </Card.Header>
  <Card.Content>正文内容</Card.Content>
</Card>`}
        column
      >
        <div className="demo-grid">
          <Card hoverable>
            <Card.Header>
              <Card.Title>默认卡片</Card.Title>
              <Card.Description>surface 背景 + 边框</Card.Description>
            </Card.Header>
            <Card.Content>适合实例摘要、版本信息等常规内容区块。</Card.Content>
          </Card>
          <Card variant="flat" hoverable>
            <Card.Header>
              <Card.Title>flat 卡片</Card.Title>
              <Card.Description>浅色填充，弱化层级</Card.Description>
            </Card.Header>
            <Card.Content>适合侧栏摘要、设置分组等不需要边框强调的场景。</Card.Content>
          </Card>
          <Card variant="outline" hoverable>
            <Card.Header>
              <Card.Title>outline 卡片</Card.Title>
              <Card.Description>仅描边，保持页面轻盈</Card.Description>
            </Card.Header>
            <Card.Content>可嵌套在白底卡片中，划分内部子区块。</Card.Content>
          </Card>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="卡片：页头 / 内容 / 页脚"
        description="页头放标题与描述，内容区承载主体信息，页脚用于次要信息与操作按钮。"
        code={`<Card>
  <Card.Header>
    <Card.Title>冰原生存</Card.Title>
    <Card.Description>1.21.4 · Fabric 0.16.9</Card.Description>
  </Card.Header>
  <Card.Content>...</Card.Content>
  <Card.Footer>...</Card.Footer>
</Card>`}
        column
      >
        <Card style={{ width: '100%', maxWidth: 520 }}>
          <Card.Header>
            <div className="demo-row" style={{ justifyContent: 'space-between', width: '100%' }}>
              <div>
                <Card.Title>冰原生存</Card.Title>
                <Card.Description>1.21.4 · Fabric 0.16.9</Card.Description>
              </div>
              <Avatar name="冰原生存" status="online" />
            </div>
          </Card.Header>
          <Card.Content>
            <div className="demo-row">
              <Tag color="success" icon={<IconCheck size={12} />}>
                运行中
              </Tag>
              <Tag color="info" variant="soft">
                4 GB 内存
              </Tag>
              <Tag color="neutral" variant="outline">
                最后启动 2 小时前
              </Tag>
            </div>
          </Card.Content>
          <Card.Footer>
            <div className="demo-row" style={{ justifyContent: 'space-between', width: '100%' }}>
              <span className="demo-label">版本已是最新</span>
              <Button size="sm" variant="secondary" leftIcon={<IconPlay size={14} />}>
                启动
              </Button>
            </div>
          </Card.Footer>
        </Card>
      </ShowcaseBlock>

      <ShowcaseBlock
        anchor="Tag"
        title="标签：颜色 × 外观"
        description="6 种语义色与 soft / solid / outline 三种外观自由组合，全部使用设计变量，深色主题下自动适配。"
        code={`<Tag color="primary" variant="soft">primary</Tag>
<Tag color="success" variant="solid">success</Tag>
<Tag color="danger" variant="outline">danger</Tag>`}
        column
      >
        <div className="demo-stack">
          {TAG_VARIANTS.map((variant) => (
            <div className="demo-row" key={variant}>
              <span className="demo-label" style={{ width: 58 }}>
                {variant}
              </span>
              {TAG_COLORS.map((color) => (
                <Tag key={color} color={color} variant={variant}>
                  {color}
                </Tag>
              ))}
            </div>
          ))}
        </div>
        <div className="demo-row">
          <Tag size="sm">size sm</Tag>
          <Tag size="md">size md</Tag>
          <Tag color="success" icon={<IconCheck size={12} />}>
            已通过
          </Tag>
          <Tag color="warning" icon={<IconWarning size={12} />}>
            待确认
          </Tag>
        </div>
        <div className="demo-row">
          {tags.map((tag) => (
            <Tag key={tag.key} color={tag.color} closable onClose={() => removeTag(tag.key)}>
              {tag.label}
            </Tag>
          ))}
          {tags.length < DEFAULT_TAGS.length ? (
            <Button size="sm" variant="ghost" onClick={() => setTags(DEFAULT_TAGS)}>
              还原标签
            </Button>
          ) : (
            <span className="demo-label">点击标签上的 × 可移除</span>
          )}
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        anchor="Badge"
        title="徽标：数字、上限与状态点"
        description="count 超过 max（默认 99）显示 99+；dot 只显示小圆点；有 children 时角标定位在右上角，无 children 时独立显示。"
        code={`<Badge count={5}>
  <Avatar name="张三" />
</Badge>
<Badge count={120} />
<Badge dot status="success" />`}
        column
      >
        <div className="demo-row">
          <Badge count={3}>
            <Avatar name="张三" />
          </Badge>
          <Badge count={128}>
            <Avatar name="李雷" status="online" />
          </Badge>
          <Badge dot status="success">
            <Avatar src={DEMO_AVATAR} alt="示例头像" shape="rounded" />
          </Badge>
          <Badge count={12} status="danger">
            <Avatar icon={<IconBell size={16} />} shape="rounded" size="lg" />
          </Badge>
          <Badge count={7} status="warning">
            <Avatar name="苏" size="lg" />
          </Badge>
          <Badge dot status="info">
            <Avatar icon={<IconUser size={16} />} shape="square" size="lg" />
          </Badge>
        </div>
        <div className="demo-row">
          <span className="demo-label">独立显示：</span>
          <Badge count={5} />
          <Badge count={128} />
          <Badge count={0} showZero />
          <Badge count={0} />
          <Badge dot status="success" />
          <Badge dot status="warning" />
          <Badge dot status="danger" />
          <Badge status="info" />
          <Badge status="primary" />
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        anchor="Avatar"
        title="头像：图片、文字、图标与状态"
        description="src 加载失败时自动降级为文字占位；name 中文取首字、英文取首字母；icon 优先级高于 name；status 显示在线状态点。"
        code={`<Avatar src="/avatar.png" alt="头像" />
<Avatar name="张三" />
<Avatar name="Aelux" status="online" />
<Avatar icon={<IconUser />} shape="rounded" />`}
        column
      >
        <div className="demo-row">
          <Avatar src={DEMO_AVATAR} alt="示例头像" size="lg" />
          <Avatar name="张三" size="lg" />
          <Avatar name="Aelux" size="lg" status="online" />
          <Avatar icon={<IconUser size={18} />} size="lg" shape="rounded" status="busy" />
          <Avatar src="https://example.invalid/avatar.png" name="加载失败" size="lg" status="offline" />
        </div>
        <div className="demo-row">
          <Avatar name="A" size="sm" />
          <Avatar name="B" />
          <Avatar name="C" size="lg" />
          <Avatar name="D" size={48} />
          <Avatar name="圆角" shape="rounded" />
          <Avatar icon={<IconUser size={16} />} shape="square" />
          <Avatar name="在线" status="online" />
          <Avatar name="忙碌" status="busy" />
          <Avatar name="离开" status="away" />
          <Avatar name="离线" status="offline" />
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        anchor="ListItem"
        title="列表项：启动器实例列表"
        description="一行承载图标、标题、副标题、状态标记与右侧操作；selected 用主色浅底 + 左侧竖条标记，disabled 自动降级并禁用点击。"
        code={`<ListItem
  icon={<Avatar name="冰原生存" shape="rounded" />}
  title="冰原生存"
  description="1.21.4 · Fabric 0.16.9"
  meta={<Tag size="sm" color="success">运行中</Tag>}
  trailing={<Button size="sm">启动</Button>}
  selected
  onClick={() => openInstance('frost')}
/>`}
        column
      >
        <div className="demo-stack" style={{ maxWidth: 620 }}>
          {INSTANCES.map((instance) => (
            <ListItem
              key={instance.key}
              icon={<Avatar name={instance.name} size="md" shape="rounded" />}
              title={instance.name}
              description={`${instance.version} · ${instance.loader} · ${instance.memory} 内存`}
              meta={
                <Tag size="sm" variant="soft" color={STATUS_META[instance.status].color}>
                  {STATUS_META[instance.status].label}
                </Tag>
              }
              selected={listItemKey === instance.key}
              onClick={() => {
                setListItemKey(instance.key)
                setListItemAction(`打开实例「${instance.name}」`)
              }}
              trailing={
                <Button
                  size="sm"
                  variant={listItemKey === instance.key ? 'secondary' : 'ghost'}
                  leftIcon={<IconPlay size={13} />}
                  onClick={(event) => {
                    event.stopPropagation()
                    setListItemAction(`启动实例「${instance.name}」`)
                  }}
                >
                  启动
                </Button>
              }
            />
          ))}
          <p className="demo-label">最近操作：{listItemAction}</p>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="列表项：禁用、标记与超长省略"
        description="disabled 时整行不可点击；meta 放版本号或状态；标题与副标题过长时自动省略，行高保持一致。"
        column
      >
        <div className="demo-stack" style={{ maxWidth: 520 }}>
          <ListItem
            icon={<Avatar name="空岛挑战" shape="rounded" />}
            title="空岛挑战"
            description="正在更新，暂时无法启动"
            meta={
              <Tag size="sm" variant="soft" color="warning">
                维护中
              </Tag>
            }
            disabled
          />
          <ListItem
            title="这是一个很长很长的整合包实例名称，用来验证标题在末尾自动省略而不会撑破行"
            description="1.19.2 · Fabric 0.15.7 · 10 GB 内存 · 最近启动 3 天前"
            meta={<span>1.19.2</span>}
            selected
          />
          <ListItem
            icon={<Avatar icon={<IconUser size={14} />} shape="square" />}
            title="多账号切换"
            description="当前账号：TXX · 上次同步 10 分钟前"
            trailing={
              <Button size="sm" variant="secondary">
                切换
              </Button>
            }
            onClick={() => setListItemAction('打开账号切换')}
          />
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        anchor="ListBox"
        title="可选列表：单选与多选"
        description="role=listbox 语义，方向键循环移动并跳过禁用项，Home / End 跳转，Space / Enter 选择；受控 value 或非受控 defaultValue 均可。"
        code={`<ListBox
  ariaLabel="选择启动实例"
  options={options}
  value={activeKey}
  onValueChange={(value) => setActiveKey(value as string)}
  height={252}
/>
<ListBox
  multiple
  value={keys}
  onValueChange={(value) => setKeys(value as string[])}
/>`}
        column
      >
        <div className="demo-grid">
          <Card padding="sm">
            <Card.Header>
              <Card.Title>选择实例（单选）</Card.Title>
              <Card.Description>↑ ↓ 移动，Space / Enter 选择</Card.Description>
            </Card.Header>
            <Card.Content>
              <ListBox
                ariaLabel="选择启动实例"
                options={INSTANCES.map(toInstanceOption)}
                value={activeInstanceKey}
                onValueChange={(value) => {
                  if (typeof value === 'string') setActiveInstanceKey(value)
                }}
                height={252}
              />
            </Card.Content>
          </Card>
          <Card padding="sm">
            <Card.Header>
              <Card.Title>批量操作（多选）</Card.Title>
              <Card.Description>aria-multiselectable=true，可多选</Card.Description>
            </Card.Header>
            <Card.Content>
              <ListBox
                multiple
                ariaLabel="批量选择实例"
                options={INSTANCES.map(toInstanceOption)}
                value={batchKeys}
                onValueChange={(value) => {
                  setBatchKeys(Array.isArray(value) ? value : value ? [value] : [])
                }}
                height={252}
              />
            </Card.Content>
          </Card>
        </div>
        <p className="demo-label">
          当前实例：{activeInstance.name} · 批量已选 {batchInstances.length} 个（
          {batchInstances.map((item) => item.name).join('、') || '尚未选择'}）
        </p>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="可选列表：空态、禁用项与 sm 尺寸"
        description="emptyText 自定义空态文案；disabled 项自动跳过键盘焦点；size=sm 用于紧凑侧栏。"
        column
      >
        <div className="demo-grid">
          <div className="demo-surface">
            <span className="demo-label">空态</span>
            <ListBox ariaLabel="空列表" options={[]} emptyText="暂无可用实例" height={132} />
          </div>
          <div className="demo-surface">
            <span className="demo-label">禁用项 · size sm</span>
            <ListBox
              ariaLabel="含禁用项的列表"
              size="sm"
              defaultValue="frost"
              height={172}
              options={[
                {
                  key: 'frost',
                  label: '冰原生存',
                  description: '1.21.4 · Fabric 0.16.9',
                  badge: (
                    <Tag size="sm" variant="soft" color="success">
                      运行中
                    </Tag>
                  ),
                },
                {
                  key: 'skyblock',
                  label: '空岛挑战',
                  description: '正在更新，暂不可操作',
                  disabled: true,
                },
                {
                  key: 'create',
                  label: '机械工坊',
                  description: '1.20.6 · Forge 50.0.9',
                  badge: (
                    <Tag size="sm" variant="soft" color="neutral">
                      已停止
                    </Tag>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        anchor="TaskList"
        title="任务队列：下载任务"
        description="进行中 / 等待中 / 已暂停 / 已完成 / 失败混合展示；行内进度条、速度与大小，失败可重试、进行中可取消，底部出现「清除已完成」。"
        code={`<TaskList
  title="下载队列"
  items={tasks}
  onCancel={(id) => cancel(id)}
  onRetry={(id) => retry(id)}
  onClearDone={clearDone}
  maxHeight={300}
/>`}
        column
      >
        <div className="demo-stack" style={{ maxWidth: 640 }}>
          <TaskList
            ariaLabel="下载任务队列"
            title="下载队列"
            items={tasks}
            onCancel={cancelTask}
            onRetry={retryTask}
            onClearDone={clearDoneTasks}
            maxHeight={300}
          />
          <div className="demo-row">
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<IconRefresh size={14} />}
              onClick={() => setTasks(INITIAL_TASKS)}
            >
              重置任务队列
            </Button>
            <span className="demo-label">
              进行中 {tasks.filter((task) => task.status === 'running').length} 个 · 已完成{' '}
              {tasks.filter((task) => task.status === 'done').length} 个
            </span>
          </div>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="任务队列：空态与单任务"
        description="items 为空时显示 emptyText；不传 title 时不渲染头部，可直接嵌入面板或卡片。"
        column
      >
        <div className="demo-grid">
          <div className="demo-surface">
            <span className="demo-label">空队列</span>
            <TaskList ariaLabel="空任务队列" items={[]} emptyText="当前没有下载任务" />
          </div>
          <div className="demo-surface">
            <span className="demo-label">仅下载完成</span>
            <TaskList
              ariaLabel="已完成任务"
              items={[{ id: 'java-21', title: 'Java 21 运行时', status: 'done', size: '160 MB' }]}
            />
          </div>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        anchor="Table"
        title="数据表格：版本列表"
        description="泛型列定义，支持行选择（表头 Checkbox 全选 / 半选）、行点击、striped、maxHeight 内滚动与 stickyHeader 吸顶表头。"
        code={`const columns: TableColumn<GameVersion>[] = [...]
<Table
  columns={columns}
  data={versions}
  rowKey="id"
  selectable
  selectedKeys={selected}
  onSelectionChange={setSelected}
  onRowClick={(row) => setClicked(row.version)}
  striped
  maxHeight={300}
  stickyHeader
/>`}
        column
      >
        <div className="demo-stack">
          <Table
            ariaLabel="游戏版本列表"
            columns={VERSION_COLUMNS}
            data={VERSIONS}
            rowKey="id"
            selectable
            selectedKeys={selectedVersions}
            onSelectionChange={setSelectedVersions}
            onRowClick={(row) => setClickedVersion(row.version)}
            striped
            maxHeight={300}
            stickyHeader
          />
          <p className="demo-label">
            已选 {selectedVersions.length} 个版本 · 最近点击：{clickedVersion}
          </p>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="数据表格：加载中与空数据"
        description="loading 使用 Skeleton 占位行；data 为空时在整行内展示 emptyText。"
        column
      >
        <div className="demo-stack">
          <Table
            ariaLabel="加载中的版本列表"
            columns={VERSION_COLUMNS}
            data={[]}
            rowKey="id"
            loading
          />
          <Table
            ariaLabel="空的版本列表"
            columns={VERSION_COLUMNS}
            data={[]}
            rowKey="id"
            emptyText="没有匹配的版本，试试切换通道"
          />
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        anchor="DescriptionList"
        title="键值对：实例详情"
        description="columns 控制 1 / 2 / 3 列，span 可跨列；bordered 用 1px 网格线组织键值对，行高紧凑。"
        code={`<DescriptionList
  ariaLabel="实例详情"
  columns={2}
  bordered
  items={[
    { label: '实例名称', value: '冰原生存' },
    { label: '游戏版本', value: '1.21.4' },
    { label: '安装目录', value: 'D:\\\\Aelux\\\\instances\\\\frost', span: 2 },
  ]}
/>`}
        column
      >
        <Card style={{ width: '100%' }}>
          <Card.Header>
            <Card.Title>{activeInstance.name}</Card.Title>
            <Card.Description>详情随上方 ListBox 的单选结果联动更新</Card.Description>
          </Card.Header>
          <Card.Content>
            <DescriptionList ariaLabel="实例详情" items={detailItems} columns={2} bordered />
          </Card.Content>
        </Card>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="键值对：纵向排列与三列"
        description="layout=vertical 时标签在上、数值在下；columns=3 适合网络、存档等短字段。"
        column
      >
        <DescriptionList
          ariaLabel="实例运行信息"
          layout="vertical"
          columns={3}
          items={[
            { key: 'id', label: '实例 ID', value: activeInstance.key },
            { key: 'memory', label: '内存分配', value: activeInstance.memory },
            { key: 'loader', label: '加载器', value: activeInstance.loader },
            { key: 'lastPlayed', label: '最近启动', value: '今天 10:24' },
            { key: 'total', label: '累计时长', value: '126 小时' },
            {
              key: 'sync',
              label: '云同步',
              value: (
                <Tag size="sm" color="success" variant="soft">
                  已开启
                </Tag>
              ),
            },
          ]}
        />
      </ShowcaseBlock>

      <ShowcaseBlock
        anchor="Statistic"
        title="统计数值：趋势与格式化"
        description="数字 value 自动千分位格式化，precision 控制小数位；trend 配合 trendText 显示涨跌箭头与颜色；hint 作为补充说明。"
        code={`<Statistic
  title="本周游戏时长"
  value={18.5}
  precision={1}
  suffix="小时"
  trend="up"
  trendText="+12.4%"
  hint="较上周"
  icon={<IconPlay />}
  size="lg"
/>`}
        column
      >
        <div className="demo-grid">
          <Card padding="sm">
            <Statistic
              title="本周游戏时长"
              value={18.5}
              precision={1}
              suffix="小时"
              trend="up"
              trendText="+12.4%"
              hint="较上周"
              icon={<IconPlay size={15} />}
              size="lg"
            />
          </Card>
          <Card padding="sm">
            <Statistic
              title="平均内存占用"
              value={68.2}
              precision={1}
              suffix="%"
              trend="down"
              trendText="-3.1%"
              hint="较上周"
              icon={<IconGrid size={15} />}
              size="lg"
            />
          </Card>
          <Card padding="sm">
            <Statistic
              title="实例总数"
              value={12}
              suffix="个"
              trend="neutral"
              trendText="持平"
              hint="其中 3 个正在运行"
              icon={<IconFolder size={15} />}
              size="lg"
            />
          </Card>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="统计数值：尺寸、前后缀与加载态"
        description="size 支持 sm / md / lg；prefix / suffix 放单位或货币符号；loading 时数值区域使用 Skeleton 占位。"
        column
      >
        <div className="demo-row">
          <Statistic size="sm" title="本周时长" value={1290} suffix="分钟" trend="up" trendText="+6%" />
          <Statistic size="md" title="累计启动" value={186} suffix="次" trend="neutral" trendText="持平" />
          <Statistic
            size="lg"
            title="月度支出"
            prefix="¥"
            value={1289.5}
            precision={2}
            suffix="元"
            trend="down"
            trendText="-2.5%"
          />
          <Statistic
            size="md"
            title="实时帧率"
            value={144}
            suffix="FPS"
            trend="up"
            trendText="稳定"
            loading={statsLoading}
          />
        </div>
        <Button
          size="sm"
          variant="secondary"
          leftIcon={<IconRefresh size={14} />}
          onClick={reloadStats}
        >
          切换帧率加载态
        </Button>
      </ShowcaseBlock>

      <ShowcaseBlock
        anchor="Timeline"
        title="时间线：版本历史"
        description="节点支持 default / success / warning / danger 四种语义色与自定义图标；timeRight 将时间放到标题右侧，默认显示在标题下方。"
        code={`<Timeline
  ariaLabel="版本历史"
  timeRight
  items={[
    { key: '1.21.4', title: '发布 1.21.4 正式版', time: '2026-09-18', status: 'success', icon: <IconCheck /> },
    { key: 'fix', title: '修复 Forge 启动参数', time: '2026-07-02', status: 'warning' },
  ]}
/>`}
        column
      >
        <Card style={{ width: '100%', maxWidth: 620 }}>
          <Card.Header>
            <Card.Title>版本历史</Card.Title>
            <Card.Description>时间显示在右侧，最近一次更新在最上方</Card.Description>
          </Card.Header>
          <Card.Content>
            <Timeline ariaLabel="启动器版本历史" items={VERSION_HISTORY} timeRight />
          </Card.Content>
        </Card>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="时间线：默认时间与事件记录"
        description="time 默认出现在标题下方；status 让节点颜色表达结果，icon 可替换为任意图标。"
        column
      >
        <div className="demo-grid">
          <div className="demo-surface">
            <span className="demo-label">时间在标题下</span>
            <Timeline
              ariaLabel="实例事件"
              items={[
                {
                  key: 'start',
                  title: '实例启动',
                  description: '冰原生存 · 1.21.4',
                  time: '今天 10:24',
                  status: 'success',
                },
                {
                  key: 'update',
                  title: '自动检查更新',
                  description: '发现 26 个模组可更新',
                  time: '今天 10:25',
                },
                {
                  key: 'exit',
                  title: '实例退出',
                  description: '游戏正常退出，未生成崩溃报告',
                  time: '今天 12:08',
                },
              ]}
            />
          </div>
          <div className="demo-surface">
            <span className="demo-label">自定义图标</span>
            <Timeline
              ariaLabel="安装事件"
              timeRight
              items={[
                {
                  key: 'download',
                  title: '下载安装包',
                  time: '14:02',
                  status: 'success',
                  icon: <IconDownload size={13} />,
                },
                {
                  key: 'verify',
                  title: '校验资源索引',
                  time: '14:04',
                  icon: <IconRefresh size={13} />,
                },
                {
                  key: 'fail',
                  title: '写入磁盘失败',
                  time: '14:05',
                  status: 'danger',
                  icon: <IconWarning size={13} />,
                },
              ]}
            />
          </div>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        anchor="SettingSection"
        title="设置分组：启动器设置页"
        description="SettingSection 组合标题、说明、行列表与页脚；SettingRow 左侧标签 / 说明，右侧放任意控件，行间 1px 分隔。status 提供 warning / danger 强调。"
        code={`<SettingSection
  title="启动与更新"
  description="控制启动器行为"
  icon={<IconSettings />}
  footer="修改会立即保存"
>
  <SettingRow label="启动时自动更新" htmlFor="auto-update">
    <Switch id="auto-update" checked={autoUpdate} onChange={setAutoUpdate} />
  </SettingRow>
  <SettingRow label="默认游戏目录">
    <Select options={dirs} size="sm" />
  </SettingRow>
</SettingSection>`}
        column
      >
        <div style={{ width: '100%', maxWidth: 640 }}>
          <SettingSection
            title="启动与更新"
            description="控制 Aelux Launcher 的启动行为和版本检查"
            icon={<IconSettings size={15} />}
            footer="修改会立即保存到本地配置文件。"
          >
            <SettingRow
              label="启动时自动更新"
              description="启动前检查并安装最新版本"
              htmlFor="aelux-demo-auto-update"
              icon={<IconRefresh size={14} />}
            >
              <Switch
                id="aelux-demo-auto-update"
                checked={autoUpdate}
                onChange={setAutoUpdate}
              />
            </SettingRow>
            <SettingRow
              label="默认游戏目录"
              description="新实例将安装到该目录"
              htmlFor="aelux-demo-dir"
            >
              <Select
                id="aelux-demo-dir"
                size="sm"
                defaultValue="D:/Aelux/instances"
                options={[
                  { label: 'D:/Aelux/instances', value: 'D:/Aelux/instances' },
                  { label: 'C:/Users/TXX/AppData/Aelux', value: 'C:/Users/TXX/AppData/Aelux' },
                ]}
              />
            </SettingRow>
            <SettingRow label="界面语言" description="重启后生效" htmlFor="aelux-demo-lang">
              <Select
                id="aelux-demo-lang"
                size="sm"
                defaultValue="zh-CN"
                options={[
                  { label: '简体中文', value: 'zh-CN' },
                  { label: 'English', value: 'en-US' },
                ]}
              />
            </SettingRow>
            <SettingRow
              label="崩溃报告待上传"
              description="上次会话异常退出，可手动上传诊断信息"
              status="warning"
            >
              <Button size="sm" variant="secondary" leftIcon={<IconWarning size={14} />}>
                立即上传
              </Button>
            </SettingRow>
            <SettingRow
              label="清除下载缓存"
              description="已下载的版本包将被删除，不影响实例"
              status="default"
            >
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setCacheCleared(true)}
                disabled={cacheCleared}
              >
                {cacheCleared ? '已清理' : '清理缓存'}
              </Button>
            </SettingRow>
            <SettingRow
              label="删除全部实例"
              description="该操作不可撤销，请提前备份存档"
              status="danger"
            >
              <Button size="sm" variant="danger" leftIcon={<IconWarning size={14} />}>
                删除
              </Button>
            </SettingRow>
            <SettingRow
              label="开发者模式"
              description="显示调试面板与日志输出"
              htmlFor="aelux-demo-dev"
              disabled
            >
              <Switch id="aelux-demo-dev" disabled />
            </SettingRow>
          </SettingSection>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="设置分组：plain 无边框"
        description="variant=plain 去掉外框，用于页面内直接铺开的设置区块；行分隔线保持 1px。"
        column
      >
        <div style={{ width: '100%', maxWidth: 560 }}>
          <SettingSection
            variant="plain"
            title="隐私与数据"
            description="统计信息仅保存在本地，上传前会先征求同意"
          >
            <SettingRow label="匿名使用统计" description="帮助改进启动器体验">
              <Switch defaultChecked size="sm" />
            </SettingRow>
            <SettingRow label="自动发送崩溃报告" description="仅包含堆栈与版本信息">
              <Switch defaultChecked size="sm" />
            </SettingRow>
          </SettingSection>
        </div>
      </ShowcaseBlock>
    </>
  )
}
