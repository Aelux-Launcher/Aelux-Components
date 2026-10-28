import { useState } from 'react'
import {
  Button,
  IconButton,
  IconCheck,
  IconChevronRight,
  IconDownload,
  IconMore,
  IconPlay,
  IconPlus,
  IconRefresh,
  IconSearch,
  IconSettings,
  IconStar,
  IconTrash,
} from 'aelux-components'
import type { ButtonSize, ButtonVariant } from 'aelux-components'
import type { SectionProps } from './types'
import { ShowcaseBlock } from '../components/ShowcaseBlock'

const VARIANTS: ReadonlyArray<{ value: ButtonVariant; label: string }> = [
  { value: 'primary', label: '主要按钮' },
  { value: 'secondary', label: '次要按钮' },
  { value: 'ghost', label: '幽灵按钮' },
  { value: 'danger', label: '危险操作' },
  { value: 'success', label: '成功状态' },
  { value: 'warning', label: '警告状态' },
]

const SIZES: ReadonlyArray<{ value: ButtonSize; label: string }> = [
  { value: 'sm', label: 'sm · 28px' },
  { value: 'md', label: 'md · 34px' },
  { value: 'lg', label: 'lg · 40px' },
]

const ICON_VARIANTS: ReadonlyArray<{ value: 'primary' | 'secondary' | 'ghost'; label: string }> = [
  { value: 'primary', label: '主要' },
  { value: 'secondary', label: '次要' },
  { value: 'ghost', label: '幽灵' },
]

const VARIANT_CODE = `<Button variant="primary">主要按钮</Button>
<Button variant="secondary">次要按钮</Button>
<Button variant="ghost">幽灵按钮</Button>
<Button variant="danger">危险操作</Button>`

const ICON_BUTTON_CODE = `<IconButton label="刷新" icon={<IconRefresh size={16} />} title="刷新" />
<IconButton label="更多" variant="ghost" icon={<IconMore size={16} />} />`

/** 基础组件示例页：Button 与 IconButton。 */
export function BasicSection(_props: SectionProps) {
  const [loading, setLoading] = useState(false)
  const [lastAction, setLastAction] = useState('（尚未点击）')

  const runLoading = () => {
    if (loading) return
    setLoading(true)
    window.setTimeout(() => setLoading(false), 1800)
  }

  return (
    <>
      <ShowcaseBlock
        title="按钮变体"
        description="六种变体覆盖主操作、次操作、弱化操作与语义化状态；hover 仅加深底色，focus-visible 使用统一焦点环。"
        code={VARIANT_CODE}
        column
      >
        <div className="demo-row">
          {VARIANTS.map((variant) => (
            <Button
              key={variant.value}
              variant={variant.value}
              onClick={() => setLastAction(variant.label)}
            >
              {variant.label}
            </Button>
          ))}
        </div>
        <p className="demo-label">最近点击：{lastAction}</p>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="按钮尺寸"
        description="sm / md / lg 分别对应 28 / 34 / 40px 控件高度，与 Input、Select 等表单控件保持同一网格。"
        column
      >
        <div className="demo-row">
          {SIZES.map((size) => (
            <Button key={size.value} variant="secondary" size={size.value}>
              {size.label}
            </Button>
          ))}
        </div>
        <div className="demo-row">
          {SIZES.map((size) => (
            <Button key={size.value} variant="primary" size={size.value}>
              主要 · {size.value}
            </Button>
          ))}
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="加载、禁用与图标"
        description="loading 时按钮自动 aria-busy 并阻止重复点击；leftIcon / rightIcon 可组合图标，block 让按钮铺满容器。"
        column
      >
        <div className="demo-row">
          <Button loading={loading}>{loading ? '保存中…' : '保存设置'}</Button>
          <Button variant="secondary" leftIcon={<IconPlus size={14} />}>
            新建
          </Button>
          <Button variant="secondary" rightIcon={<IconChevronRight size={14} />}>
            下一步
          </Button>
          <Button variant="ghost" leftIcon={<IconDownload size={14} />}>
            下载
          </Button>
          <Button disabled>不可用</Button>
        </div>
        <div className="demo-row">
          <Button
            variant="secondary"
            leftIcon={<IconRefresh size={14} />}
            loading={loading}
            onClick={runLoading}
          >
            模拟加载 1.8s
          </Button>
          <Button variant="success" leftIcon={<IconCheck size={14} />}>
            已完成
          </Button>
        </div>
        <Button block>block 按钮铺满整行</Button>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="图标按钮变体"
        description="IconButton 的 label 为必填项并映射到 aria-label；同样支持三种变体，适合工具栏与紧凑操作区。"
        code={ICON_BUTTON_CODE}
      >
        {ICON_VARIANTS.map((variant) => (
          <IconButton
            key={variant.value}
            label={`${variant.label}图标按钮`}
            variant={variant.value}
            icon={<IconPlus size={16} />}
            title={`${variant.label}图标按钮`}
            onClick={() => setLastAction(`IconButton · ${variant.label}`)}
          />
        ))}
        <IconButton
          label="收藏"
          icon={<IconStar size={16} />}
          title="收藏"
          onClick={() => setLastAction('IconButton · 收藏')}
        />
        <IconButton
          label="更多操作"
          variant="ghost"
          icon={<IconMore size={16} />}
          title="更多操作"
          onClick={() => setLastAction('IconButton · 更多操作')}
        />
      </ShowcaseBlock>

      <ShowcaseBlock
        title="图标按钮尺寸"
        description="正方形尺寸与图标同步缩放：sm 28px、md 34px、lg 40px。"
      >
        <IconButton label="搜索（小）" size="sm" icon={<IconSearch size={14} />} title="搜索" />
        <IconButton label="设置（中）" size="md" icon={<IconSettings size={16} />} title="设置" />
        <IconButton label="下载（大）" size="lg" icon={<IconDownload size={20} />} title="下载" />
        <IconButton label="删除" variant="primary" icon={<IconTrash size={16} />} title="删除" />
        <IconButton label="确认" variant="ghost" icon={<IconCheck size={16} />} title="确认" />
      </ShowcaseBlock>

      <ShowcaseBlock
        title="图标按钮状态"
        description="loading 状态会禁用重复点击，并在 spin 动画中保留原尺寸；禁用态降不透明度。"
      >
        <IconButton
          label="刷新"
          icon={<IconRefresh size={16} />}
          loading={loading}
          onClick={runLoading}
          title="点击刷新（加载中）"
        />
        <IconButton
          label="播放"
          variant="primary"
          icon={<IconPlay size={16} />}
          disabled
          title="不可用"
        />
        <IconButton label="同步" variant="ghost" icon={<IconRefresh size={16} />} loading />
      </ShowcaseBlock>
    </>
  )
}
