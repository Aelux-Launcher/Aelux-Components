import { useState } from 'react'
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  DescriptionList,
  Dialog,
  Divider,
  DropdownMenu,
  IconButton,
  IconCheck,
  IconDownload,
  IconEdit,
  IconExternal,
  IconFolder,
  IconMore,
  IconPackage,
  IconPlay,
  IconRefresh,
  IconSettings,
  IconStar,
  IconTrash,
  IconUser,
  Kbd,
  ListBox,
  Progress,
  ProgressRing,
  SearchInput,
  Select,
  SettingRow,
  SettingSection,
  SidebarNav,
  Slider,
  Space,
  Statistic,
  Switch,
  Tabs,
  Tag,
  TitleBar,
  Toolbar,
  Tooltip,
} from 'aelux-components'
import { ShowcaseBlock } from '../components/ShowcaseBlock'
import type { SectionProps } from './types'

/* ------------------------------------------------------------------ 数据 */

const INSTANCES = [
  {
    key: 'fabric-1.21.4',
    label: '1.21.4 · Fabric',
    description: '最近游玩 2 小时前',
    icon: <IconPackage size={16} />,
    badge: (
      <Tag color="success" variant="soft" size="sm">
        就绪
      </Tag>
    ),
  },
  {
    key: 'forge-1.20.1',
    label: '1.20.1 · Forge',
    description: '最近游玩 3 天前',
    icon: <IconPackage size={16} />,
    badge: (
      <Tag variant="soft" size="sm">
        就绪
      </Tag>
    ),
  },
  {
    key: 'snapshot-25w41a',
    label: '25w41a · 快照',
    description: '缺少资源索引',
    icon: <IconPackage size={16} />,
    badge: (
      <Tag color="warning" variant="soft" size="sm">
        需修复
      </Tag>
    ),
  },
  {
    key: 'quilt-1.20.4',
    label: '1.20.4 · Quilt',
    description: '最近游玩 1 个月前',
    icon: <IconPackage size={16} />,
  },
]

const NAV_GROUPS = [
  {
    key: 'play',
    label: '游玩',
    items: [
      { key: 'home', label: '主页', icon: <IconStar size={15} /> },
      { key: 'instances', label: '实例', icon: <IconPackage size={15} />, badge: '4' },
      { key: 'versions', label: '版本', icon: <IconFolder size={15} /> },
    ],
  },
  {
    key: 'download',
    label: '下载',
    items: [
      { key: 'mods', label: '模组', icon: <IconDownload size={15} />, badge: 128 },
      { key: 'modpacks', label: '整合包', icon: <IconFolder size={15} /> },
      { key: 'resourcepacks', label: '资源包', icon: <IconStar size={15} /> },
    ],
  },
  {
    key: 'other',
    label: '其他',
    items: [
      { key: 'accounts', label: '账户', icon: <IconUser size={15} /> },
      { key: 'settings', label: '设置', icon: <IconSettings size={15} /> },
    ],
  },
]

const DETAIL_ITEMS = [
  { label: '游戏版本', value: '1.21.4' },
  { label: '加载器', value: <Tag size="sm">Fabric 0.16.9</Tag> },
  { label: 'Java', value: 'Temurin 21.0.4' },
  { label: '内存', value: '4096 MB', span: 2 as const },
  { label: '最后启动', value: '今天 09:41', span: 2 as const },
]

const MENU_ITEMS = [
  { key: 'launch', label: '启动游戏', icon: <IconPlay size={14} />, shortcut: 'Enter' },
  { key: 'edit', label: '编辑实例', icon: <IconEdit size={14} /> },
  { key: 'folder', label: '打开文件夹', icon: <IconExternal size={14} /> },
  { key: 'sep', type: 'separator' as const },
  { key: 'delete', label: '删除实例', icon: <IconTrash size={14} />, danger: true },
]

/* ------------------------------------------------------------------ 页面 */

export function PatternsSection(_props: SectionProps) {
  const [instance, setInstance] = useState('fabric-1.21.4')
  const [nav, setNav] = useState('instances')
  const [detailTab, setDetailTab] = useState('overview')
  const [memory, setMemory] = useState(4096)
  const [autoUpdate, setAutoUpdate] = useState(true)
  const [downloadDialog, setDownloadDialog] = useState(false)

  return (
    <div className="demo-overview">
      <ShowcaseBlock
        anchor="Window"
        title="启动器主窗口"
        description="TitleBar + SidebarNav + Toolbar + ListBox + Tabs 拼成启动器的两栏主界面：左侧实例列表、右侧详情，底部常驻下载进度。"
        code={`<TitleBar title="Aelux Launcher" subtitle="1.21.4 · Fabric" dragRegion icon={<Logo />} />

<div className="window-body">
  <SidebarNav groups={groups} value={nav} onValueChange={setNav} header={<AccountCard />} />

  <main>
    <Toolbar start={<Button variant="primary" leftIcon={<IconPlay />}>启动游戏</Button>}
             end={<SearchInput placeholder="搜索实例" shortcut="⌘K" />} />

    <ListBox options={instances} value={active} onValueChange={setActive} />
    <Card>…实例详情、KeyValue、Tabs…</Card>
  </main>
</div>

<Progress value={64} label="下载 Fabric API 64%" />`}
      >
        <div
          style={{
            width: '100%',
            border: '1px solid var(--aelux-border)',
            borderRadius: 10,
            overflow: 'hidden',
            background: 'var(--aelux-surface)',
            boxShadow: 'var(--aelux-shadow-sm)',
          }}
        >
          <TitleBar
            title="Aelux Launcher"
            subtitle="1.21.4 · Fabric"
            icon={
              <img
                src="/aelux-logo.png"
                alt=""
                style={{ width: 18, height: 18, borderRadius: 4, display: 'block' }}
              />
            }
            dragRegion
          />

          <div style={{ display: 'grid', gridTemplateColumns: '196px minmax(0, 1fr)', minHeight: 372 }}>
            <div
              style={{
                borderRight: '1px solid var(--aelux-border)',
                background: 'var(--aelux-surface-subtle)',
                minWidth: 0,
              }}
            >
              <SidebarNav
                groups={NAV_GROUPS}
                value={nav}
                onValueChange={setNav}
                width="100%"
                header={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 2px' }}>
                    <Avatar name="Re0" size="sm" />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--aelux-text)' }}>Re0XIAOPA</div>
                      <div style={{ fontSize: 11, color: 'var(--aelux-text-secondary)' }}>正版账户</div>
                    </div>
                  </div>
                }
                footer={
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 11,
                      color: 'var(--aelux-text-secondary)',
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 999,
                        background: 'var(--aelux-success)',
                        display: 'inline-block',
                      }}
                    />
                    网络正常 · 12 ms
                  </div>
                }
              />
            </div>

            <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
              <Toolbar
                variant="bordered"
                size="sm"
                start={
                  <Button variant="primary" size="sm" leftIcon={<IconPlay size={13} />}>
                    启动游戏
                  </Button>
                }
                end={
                  <Space size={6}>
                    <IconButton label="刷新列表" size="sm" icon={<IconRefresh size={14} />} />
                    <DropdownMenu
                      trigger={<IconButton label="更多操作" size="sm" icon={<IconMore size={14} />} />}
                      items={MENU_ITEMS}
                    />
                  </Space>
                }
              >
                <div style={{ width: 200 }}>
                  <SearchInput placeholder="搜索实例" shortcut="⌘K" size="sm" block />
                </div>
              </Toolbar>

              <div
                style={{
                  padding: 12,
                  display: 'grid',
                  gridTemplateColumns: '232px minmax(0, 1fr)',
                  gap: 12,
                  alignItems: 'start',
                  flex: 1,
                }}
              >
                <ListBox options={INSTANCES} value={instance} onValueChange={(v) => setInstance(String(v))} size="sm" height={280} />

                <Card padding="md">
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        display: 'grid',
                        placeItems: 'center',
                        background: 'var(--aelux-primary-soft)',
                        color: 'var(--aelux-primary-text)',
                        flexShrink: 0,
                      }}
                    >
                      <IconPackage size={20} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <strong style={{ fontSize: 14 }}>1.21.4 · Fabric</strong>
                        <Tag size="sm" color="success" variant="soft">
                          就绪
                        </Tag>
                        <Badge count={12} max={99} />
                      </div>
                      <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--aelux-text-secondary)' }}>
                        上次启动：今天 09:41 · 已安装 41 个模组
                      </p>
                    </div>
                    <Space size={6}>
                      <Tooltip content="打开实例文件夹">
                        <IconButton label="打开实例文件夹" size="sm" variant="ghost" icon={<IconFolder size={14} />} />
                      </Tooltip>
                      <Button size="sm" variant="secondary">
                        实例设置
                      </Button>
                    </Space>
                  </div>

                  <Divider />

                  <Tabs
                    size="sm"
                    variant="line"
                    value={detailTab}
                    onChange={setDetailTab}
                    items={[
                      {
                        key: 'overview',
                        label: '概览',
                        content: (
                          <DescriptionList items={DETAIL_ITEMS} columns={2} layout="horizontal" size="sm" />
                        ),
                      },
                      {
                        key: 'mods',
                        label: '模组',
                        content: <p style={{ margin: 0, fontSize: 12 }}>41 个模组已启用，2 个待更新。</p>,
                      },
                      {
                        key: 'saves',
                        label: '存档',
                        content: <p style={{ margin: 0, fontSize: 12 }}>6 个存档，最近修改「创造服」。</p>,
                      },
                      {
                        key: 'logs',
                        label: '日志',
                        content: <p style={{ margin: 0, fontSize: 12, fontFamily: 'var(--aelux-font-mono)' }}>latest.log · 今天 09:41</p>,
                      },
                    ]}
                  />
                </Card>
              </div>

              <div
                style={{
                  borderTop: '1px solid var(--aelux-border)',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  background: 'var(--aelux-surface-subtle)',
                }}
              >
                <span style={{ fontSize: 11, color: 'var(--aelux-text-secondary)', flexShrink: 0 }}>
                  下载队列
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Progress value={64} size="sm" showLabel={false} />
                </div>
                <span style={{ fontSize: 11, color: 'var(--aelux-text-secondary)', flexShrink: 0 }}>
                  Fabric API 64% · 1.2 MB/s
                </span>
              </div>
            </div>
          </div>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        anchor="Settings"
        title="设置页"
        description="SettingSection + SettingRow 组合出启动器设置：每行「标签 + 说明 + 控件」，分组卡片共用一套分隔线。"
        code={`<SettingSection title="游戏" description="只影响当前实例">
  <SettingRow label="分配内存" description="大型整合包建议 4096 MB 以上">
    <Slider value={memory} min={1024} max={16384} step={512} onChange={setMemory} showValue />
  </SettingRow>
  <SettingRow label="检查更新" description="启动时自动检查启动器与游戏版本">
    <Switch checked={autoUpdate} onChange={setAutoUpdate} />
  </SettingRow>
</SettingSection>`}
      >
        <div style={{ width: '100%', display: 'grid', gap: 16 }}>
          <SettingSection title="游戏" description="这些设置只影响当前实例，可在实例设置中单独覆盖。">
            <SettingRow label="分配内存" description="大型整合包建议 4096 MB 以上；滑块以 512 MB 为步进。">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 240 }}>
                <Slider
                  value={memory}
                  min={1024}
                  max={8192}
                  step={512}
                  onChange={setMemory}
                  showValue
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: 12, color: 'var(--aelux-text-secondary)', width: 72, textAlign: 'right' }}>
                  {memory} MB
                </span>
              </div>
            </SettingRow>
            <SettingRow label="Java 运行时" description="未检测到系统 Java 时可使用启动器内置运行时。">
              <Select
                defaultValue="temurin-21"
                size="sm"
                options={[
                  { value: 'temurin-21', label: 'Temurin 21.0.4' },
                  { value: 'temurin-17', label: 'Temurin 17.0.12' },
                  { value: 'auto', label: '自动选择' },
                ]}
              />
            </SettingRow>
            <SettingRow label="启动前检查更新" description="启动时自动检查启动器与游戏版本。">
              <Switch checked={autoUpdate} onChange={setAutoUpdate} />
            </SettingRow>
          </SettingSection>

          <SettingSection title="下载" description="下载源与并发数会影响安装速度。">
            <SettingRow label="下载源" description="自动测速并选择最快的镜像。">
              <Select
                defaultValue="auto"
                size="sm"
                options={[
                  { value: 'auto', label: '自动（推荐）' },
                  { value: 'official', label: 'Mojang 官方' },
                  { value: 'mirror', label: 'BMCLAPI 镜像' },
                ]}
              />
            </SettingRow>
            <SettingRow
              label="并发下载数"
              description="网络不稳定时建议降低并发数"
              status="warning"
            >
              <Space size={6} align="center">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setDownloadDialog(true)}
                  leftIcon={<IconDownload size={13} />}
                >
                  测试下载
                </Button>
                <Kbd>Ctrl</Kbd>
                <Kbd>Shift</Kbd>
                <Kbd>D</Kbd>
              </Space>
            </SettingRow>
          </SettingSection>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        anchor="Tasks"
        title="任务队列与状态"
        description="下载 / 安装任务用 Progress、ProgressRing 与 Alert 表达状态，可组合成底部任务栏或独立任务面板。"
        code={`<ProgressRing value={72} label="安装 1.21.4" />

<Progress value={38} tone="warning" label="下载 mods/…jar" />
<Progress indeterminate label="正在校验文件…" />

<Alert type="info" title="还有 2 个模组待更新" description="在模组页点击「全部更新」即可。" />`}
      >
        <div style={{ display: 'grid', gap: 16, width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            <ProgressRing value={72} size={72} label="安装 1.21.4" />
            <ProgressRing value={38} tone="warning" size={72} label="下载模组" />
            <ProgressRing indeterminate size={72} label="校验中" />
            <div style={{ display: 'grid', gap: 10, flex: 1, minWidth: 260 }}>
              <div style={{ display: 'grid', gap: 4 }}>
                <span style={{ fontSize: 12, color: 'var(--aelux-text-secondary)' }}>
                  下载 mods/sodium-fabric-0.6.13.jar
                </span>
                <Progress value={38} showLabel />
              </div>
              <div style={{ display: 'grid', gap: 4 }}>
                <span style={{ fontSize: 12, color: 'var(--aelux-text-secondary)' }}>解压资源索引</span>
                <Progress value={92} variant="success" showLabel />
              </div>
              <div style={{ display: 'grid', gap: 4 }}>
                <span style={{ fontSize: 12, color: 'var(--aelux-text-secondary)' }}>正在校验文件…</span>
                <Progress indeterminate />
              </div>
            </div>
          </div>

          <Divider />

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'stretch' }}>
            <Statistic title="本次会话下载" value="412" suffix="MB" icon={<IconDownload size={14} />} hint="共 6 个文件" />
            <Statistic title="平均速度" value="3.4" suffix="MB/s" trend="up" trendText="+12%" />
            <Statistic title="完成任务" value="12" suffix="项" icon={<IconCheck size={14} />} trend="neutral" trendText="0 失败" />
          </div>

          <Alert
            type="info"
            title="还有 2 个模组待更新"
            description="在模组页点击「全部更新」即可，更新不会影响现有存档。"
          />
        </div>
      </ShowcaseBlock>

      <Dialog
        open={downloadDialog}
        onClose={() => setDownloadDialog(false)}
        title="测试下载源"
        description="将向当前下载源请求一个 1 MB 的测试文件，用于估算下载速度。"
        confirmText="开始测试"
        onConfirm={() => setDownloadDialog(false)}
      />
    </div>
  )
}
