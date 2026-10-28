import { useState } from 'react'
import {
  Avatar,
  Badge,
  Card,
  IconBell,
  IconCheck,
  IconUser,
  IconWarning,
  Tag,
} from 'aelux-components'
import type { TagColor } from 'aelux-components'
import { ShowcaseBlock } from '../components/ShowcaseBlock'
import type { SectionProps } from './types'

const TAG_COLORS: TagColor[] = ['primary', 'success', 'warning', 'danger', 'info', 'neutral']
const TAG_VARIANTS = ['soft', 'solid', 'outline'] as const

const DEMO_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%2356c4ef'/%3E%3Cstop offset='1' stop-color='%231878b3'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='64' height='64' fill='url(%23g)'/%3E%3Ccircle cx='32' cy='24' r='11' fill='%23eaf9ff'/%3E%3Cpath d='M11 62c2-13 10-20 21-20s19 7 21 20z' fill='%23eaf9ff'/%3E%3C/svg%3E"

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

export function DataDisplaySection(_props: SectionProps) {
  const [tags, setTags] = useState<DemoTag[]>(DEFAULT_TAGS)

  const removeTag = (key: string) => {
    setTags((prev) => prev.filter((tag) => tag.key !== key))
  }

  return (
    <>
      <ShowcaseBlock
        title="卡片外观"
        description="default 为 surface 背景 + 1px 边框 + shadow-sm；flat 使用浅色填充；outline 仅保留描边。开启 hoverable 后悬浮会轻微抬升到 shadow-md。"
        code={`<Card hoverable>
  <Card.Header>
    <Card.Title>默认卡片</Card.Title>
    <Card.Description>描述文字</Card.Description>
  </Card.Header>
  <Card.Content>正文内容</Card.Content>
</Card>`}
      >
        <div className="demo-grid">
          <Card hoverable>
            <Card.Header>
              <Card.Title>默认卡片</Card.Title>
              <Card.Description>surface 背景 + 边框 + 阴影</Card.Description>
            </Card.Header>
            <Card.Content>用页头、正文与页脚组合出列表项、详情区块或设置分组。</Card.Content>
          </Card>
          <Card variant="flat" hoverable>
            <Card.Header>
              <Card.Title>flat 卡片</Card.Title>
              <Card.Description>浅色填充，弱化层级</Card.Description>
            </Card.Header>
            <Card.Content>适合侧栏摘要、分组容器等不需要边框强调的场景。</Card.Content>
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
        title="内边距与页头页脚"
        description="padding 支持 none / sm / md / lg，默认 md（20px）；页头与页脚由 Card.Header / Card.Footer 组合，页脚常用作次要信息区。"
        code={`<Card padding="lg">
  <Card.Header>...</Card.Header>
  <Card.Content>...</Card.Content>
  <Card.Footer>...</Card.Footer>
</Card>`}
        column
      >
        <div className="demo-grid">
          <Card padding="sm">
            <Card.Title>padding sm</Card.Title>
            <Card.Description>内边距 12px，适合紧凑列表。</Card.Description>
          </Card>
          <Card padding="md">
            <Card.Title>padding md</Card.Title>
            <Card.Description>内边距 20px，默认值。</Card.Description>
          </Card>
          <Card padding="lg">
            <Card.Title>padding lg</Card.Title>
            <Card.Description>内边距 24px，适合详情页。</Card.Description>
          </Card>
          <Card padding="none">
            <div className="demo-surface">
              <Card.Title>padding none</Card.Title>
              <Card.Description>内容自行控制内边距，可做通栏图或列表。</Card.Description>
            </div>
          </Card>
        </div>

        <Card>
          <Card.Header>
            <Card.Title>Aelux Launcher</Card.Title>
            <Card.Description>冰蓝主题 · 3 个组件更新可用</Card.Description>
          </Card.Header>
          <Card.Content>
            <div className="demo-row">
              <Tag color="success" icon={<IconCheck size={12} />}>
                已是最新
              </Tag>
              <Tag color="info" variant="soft">
                v0.1.0
              </Tag>
            </div>
            <p style={{ margin: '10px 0 0' }}>
              页头与页脚由 Card.Header / Card.Footer 组合，正文区域使用 Card.Content。
            </p>
          </Card.Content>
          <Card.Footer>
            <span className="demo-label">最后检查：今天 09:24</span>
          </Card.Footer>
        </Card>
      </ShowcaseBlock>

      <ShowcaseBlock
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
      </ShowcaseBlock>

      <ShowcaseBlock
        title="标签：尺寸、图标与可关闭"
        description="size 支持 sm / md；icon 可放任意图标节点；closable + onClose 提供可移除标签 —— 点击下方标签的 × 试试。"
        code={`<Tag color="success" icon={<IconCheck size={12} />}>已通过</Tag>
<Tag color="danger" closable onClose={handleClose}>可移除</Tag>`}
        column
      >
        <div className="demo-row">
          <Tag size="sm">size sm</Tag>
          <Tag size="md">size md</Tag>
          <Tag color="success" icon={<IconCheck size={12} />}>
            已通过
          </Tag>
          <Tag color="warning" icon={<IconWarning size={12} />}>
            待确认
          </Tag>
          <Tag color="danger" variant="outline" icon={<IconWarning size={12} />}>
            风险
          </Tag>
        </div>
        <div className="demo-row">
          {tags.map((tag) => (
            <Tag key={tag.key} color={tag.color} closable onClose={() => removeTag(tag.key)}>
              {tag.label}
            </Tag>
          ))}
          {tags.length < DEFAULT_TAGS.length ? (
            <button
              type="button"
              className="demo-chip"
              style={{ cursor: 'pointer', fontFamily: 'inherit' }}
              onClick={() => setTags(DEFAULT_TAGS)}
            >
              还原标签
            </button>
          ) : (
            <span className="demo-label">点击标签上的 × 可移除</span>
          )}
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="徽标：数字、上限与状态点"
        description="count 超过 max（默认 99）时显示 99+；dot 只显示小圆点；status 控制颜色；有 children 时角标定位在右上角，无 children 时独立显示。"
        code={`<Badge count={5}>
  <Avatar name="张三" />
</Badge>
<Badge count={120} />
<Badge dot status="success" />`}
        column
      >
        <div className="demo-row">
          <Badge count={5}>
            <Avatar name="张三" />
          </Badge>
          <Badge count={120}>
            <Avatar name="李雷" status="online" />
          </Badge>
          <Badge dot status="success">
            <Avatar name="Aelux" shape="rounded" />
          </Badge>
          <Badge count={7} status="danger">
            <Avatar icon={<IconBell size={16} />} shape="rounded" size="lg" />
          </Badge>
          <Badge count={3} status="warning">
            <Avatar name="苏" size="lg" />
          </Badge>
          <Badge dot status="info">
            <Avatar icon={<IconUser size={16} />} shape="square" size="lg" />
          </Badge>
        </div>
        <div className="demo-row">
          <span className="demo-label">独立显示：</span>
          <Badge count={5} />
          <Badge count={120} />
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
        title="头像：图片、文字与图标"
        description="src 加载失败时自动降级为占位；name 中文取首字、英文取首字母；icon 优先级高于 name。"
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
          <Avatar icon={<IconUser size={18} />} size="lg" shape="rounded" />
          <Avatar src="https://example.invalid/avatar.png" name="加载失败" size="lg" status="offline" />
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="头像：尺寸与形状"
        description="size 支持 sm / md / lg 或自定义像素数值；shape 支持 circle / rounded / square。"
        code={`<Avatar size="sm" name="A" />
<Avatar size={48} name="D" />
<Avatar shape="square" name="E" />`}
        column
      >
        <div className="demo-row">
          <Avatar name="A" size="sm" />
          <Avatar name="B" />
          <Avatar name="C" size="lg" />
          <Avatar name="D" size={48} />
          <Avatar name="E" size={56} />
        </div>
        <div className="demo-row">
          <Avatar src={DEMO_AVATAR} alt="" size="lg" shape="circle" />
          <Avatar src={DEMO_AVATAR} alt="" size="lg" shape="rounded" />
          <Avatar src={DEMO_AVATAR} alt="" size="lg" shape="square" />
          <Avatar name="圆角" shape="rounded" />
          <Avatar icon={<IconUser size={16} />} shape="square" />
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="头像：在线状态"
        description="status 支持 online / busy / away / offline，状态点与图片或占位独立渲染。"
        code={`<Avatar name="在线" status="online" />
<Avatar name="忙碌" status="busy" />
<Avatar name="离开" status="away" />
<Avatar name="离线" status="offline" />`}
      >
        <Avatar name="在线" status="online" />
        <Avatar name="忙碌" status="busy" />
        <Avatar name="离开" status="away" />
        <Avatar name="离线" status="offline" />
        <Avatar src={DEMO_AVATAR} alt="在线头像" size="lg" status="online" />
      </ShowcaseBlock>
    </>
  )
}
