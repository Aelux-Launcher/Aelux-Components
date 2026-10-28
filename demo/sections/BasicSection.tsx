import { Fragment, useState } from 'react'
import {
  Button,
  ButtonGroup,
  IconButton,
  IconCheck,
  IconChevronRight,
  IconClose,
  IconCopy,
  IconDownload,
  IconEdit,
  IconMore,
  IconPlay,
  IconPlus,
  IconRefresh,
  IconSearch,
  IconSettings,
  IconStar,
  IconTrash,
  Kbd,
  SplitButton,
} from 'aelux-components'
import type { ButtonSize, ButtonVariant, SplitButtonItem } from 'aelux-components'
import { ShowcaseBlock } from '../components/ShowcaseBlock'
import type { SectionProps } from './types'

const VARIANTS: { value: ButtonVariant; label: string }[] = [
  { value: 'primary', label: '主要' },
  { value: 'secondary', label: '次要' },
  { value: 'ghost', label: '幽灵' },
  { value: 'danger', label: '危险' },
  { value: 'success', label: '成功' },
  { value: 'warning', label: '警告' },
]

const SIZES: ButtonSize[] = ['sm', 'md', 'lg']

interface ShortcutSpec {
  keys: string[]
  label: string
}

const SHORTCUTS: ShortcutSpec[] = [
  { keys: ['Ctrl', 'K'], label: '快速搜索' },
  { keys: ['Ctrl', ','], label: '打开设置' },
  { keys: ['Ctrl', 'Shift', 'P'], label: '命令面板' },
  { keys: ['Ctrl', 'N'], label: '新建实例' },
  { keys: ['Ctrl', 'Shift', 'L'], label: '切换主题' },
  { keys: ['Ctrl', 'Shift', 'Esc'], label: '强制停止正在运行的实例' },
]

function Shortcut({ keys, label }: ShortcutSpec) {
  return (
    <div className="demo-row" style={{ justifyContent: 'space-between', width: '100%' }}>
      <span className="demo-label">{label}</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        {keys.map((key, index) => (
          <Fragment key={`${key}-${index}`}>
            {index > 0 ? (
              <span className="demo-label" aria-hidden="true">
                +
              </span>
            ) : null}
            <Kbd>{key}</Kbd>
          </Fragment>
        ))}
      </span>
    </div>
  )
}

export function BasicSection(_props: SectionProps) {
  const [lastAction, setLastAction] = useState('尚未点击按钮')
  const [saving, setSaving] = useState(false)
  const [menuAction, setMenuAction] = useState('尚未使用快捷菜单')

  const splitItems: SplitButtonItem[] = [
    { key: 'new', label: '新建实例', icon: <IconPlus size={14} />, onSelect: () => setMenuAction('从菜单选择了：新建实例') },
    {
      key: 'duplicate',
      label: '复制当前实例',
      icon: <IconCopy size={14} />,
      onSelect: () => setMenuAction('从菜单选择了：复制当前实例'),
    },
    {
      key: 'settings',
      label: '实例设置',
      icon: <IconSettings size={14} />,
      onSelect: () => setMenuAction('从菜单选择了：实例设置'),
    },
    { key: 'logs', label: '查看运行日志', icon: <IconChevronRight size={14} />, onSelect: () => setMenuAction('从菜单选择了：查看运行日志') },
    { key: 'delete', label: '删除实例', icon: <IconTrash size={14} />, disabled: true },
  ]

  const handleVariantClick = (variant: string, size: ButtonSize) => {
    setLastAction(`点击了 ${variant} 变体 · ${size} 尺寸`)
  }

  const handleSave = () => {
    setSaving(true)
    setLastAction('保存中：按钮进入 loading 且不可重复点击')
    window.setTimeout(() => {
      setSaving(false)
      setLastAction('保存完成')
    }, 1500)
  }

  return (
    <>
      <ShowcaseBlock
        anchor="Button"
        title="按钮：6 种变体 × 3 种尺寸"
        description="所有变体共用同一套尺寸、图标与状态能力；primary 用于页面主操作，secondary 用于并列的次要操作，ghost 用于低强调的辅助动作，danger / success / warning 承载语义。"
        code={`<Button variant="primary" size="md">主要</Button>
<Button variant="secondary" size="sm">次要</Button>
<Button variant="ghost" size="lg">幽灵</Button>
<Button variant="danger">危险</Button>`}
        column
      >
        <div className="demo-stack" style={{ width: '100%' }}>
          {SIZES.map((size) => (
            <div className="demo-row" key={size}>
              <span className="demo-label" style={{ width: 30 }}>
                {size}
              </span>
              {VARIANTS.map((variant) => (
                <Button
                  key={variant.value}
                  variant={variant.value}
                  size={size}
                  onClick={() => handleVariantClick(variant.label, size)}
                >
                  {variant.label}
                </Button>
              ))}
            </div>
          ))}
        </div>
        <p className="demo-label">最近操作：{lastAction}</p>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="按钮：加载中与禁用"
        description="loading 时自动禁用并显示转圈，避免重复提交；disabled 保留布局但降低强调。"
        column
      >
        <div className="demo-row">
          <Button
            loading={saving}
            leftIcon={<IconCheck size={14} />}
            onClick={handleSave}
          >
            {saving ? '保存中' : '保存设置'}
          </Button>
          <Button variant="secondary" loading>
            加载中
          </Button>
          <Button variant="secondary" disabled>
            禁用状态
          </Button>
          <Button variant="ghost" disabled leftIcon={<IconRefresh size={14} />}>
            无法刷新
          </Button>
          <Button variant="danger" disabled>
            无法删除
          </Button>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="按钮：图标与 block"
        description="leftIcon / rightIcon 承载操作暗示；block 撑满父容器，用于启动器底部的整宽主操作。"
        column
      >
        <div className="demo-row">
          <Button leftIcon={<IconPlus size={14} />}>新建实例</Button>
          <Button variant="secondary" leftIcon={<IconRefresh size={14} />}>
            检查更新
          </Button>
          <Button variant="ghost" rightIcon={<IconChevronRight size={14} />}>
            查看全部版本
          </Button>
          <Button variant="danger" leftIcon={<IconTrash size={14} />}>
            删除实例
          </Button>
          <Button variant="success" leftIcon={<IconPlay size={14} />}>
            开始游戏
          </Button>
        </div>
        <div className="demo-stack" style={{ width: '100%', maxWidth: 320 }}>
          <Button block leftIcon={<IconPlay size={14} />}>
            开始游戏
          </Button>
          <Button block variant="secondary" leftIcon={<IconRefresh size={14} />}>
            检查更新
          </Button>
          <Button block variant="ghost">
            查看运行日志
          </Button>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        anchor="IconButton"
        title="图标按钮：3 种变体 × 3 种尺寸"
        description="只含图标的方形按钮，label 为必填项，会渲染为 aria-label；用于工具栏、卡片操作区等空间有限的位置。"
        code={`<IconButton label="启动" icon={<IconPlay />} variant="primary" />
<IconButton label="设置" icon={<IconSettings />} size="lg" />
<IconButton label="更多" icon={<IconMore />} variant="ghost" />`}
        column
      >
        <div className="demo-stack" style={{ width: '100%' }}>
          {SIZES.map((size) => (
            <div className="demo-row" key={size}>
              <span className="demo-label" style={{ width: 30 }}>
                {size}
              </span>
              <IconButton
                label={`启动（${size}）`}
                size={size}
                variant="primary"
                icon={<IconPlay size={size === 'lg' ? 18 : size === 'sm' ? 14 : 16} />}
                onClick={() => setLastAction(`点击了图标按钮：启动 · ${size}`)}
              />
              <IconButton
                label={`设置（${size}）`}
                size={size}
                variant="secondary"
                icon={<IconSettings size={size === 'lg' ? 18 : size === 'sm' ? 14 : 16} />}
                onClick={() => setLastAction(`点击了图标按钮：设置 · ${size}`)}
              />
              <IconButton
                label={`更多（${size}）`}
                size={size}
                variant="ghost"
                icon={<IconMore size={size === 'lg' ? 18 : size === 'sm' ? 14 : 16} />}
                onClick={() => setLastAction(`点击了图标按钮：更多 · ${size}`)}
              />
            </div>
          ))}
        </div>
        <p className="demo-label">最近操作：{lastAction}</p>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="图标按钮：常用操作、加载与禁用"
        description="常见工具栏动作；loading 与 disabled 时保留占位，避免工具栏抖动。"
        column
      >
        <div className="demo-row">
          <IconButton label="搜索" icon={<IconSearch size={16} />} />
          <IconButton label="刷新" icon={<IconRefresh size={16} />} />
          <IconButton label="收藏" icon={<IconStar size={16} />} />
          <IconButton label="复制" icon={<IconCopy size={16} />} />
          <IconButton label="编辑" icon={<IconEdit size={16} />} />
          <IconButton label="下载" icon={<IconDownload size={16} />} />
          <IconButton label="添加" icon={<IconPlus size={16} />} variant="primary" />
          <IconButton label="删除" icon={<IconTrash size={16} />} variant="ghost" />
          <IconButton label="关闭" icon={<IconClose size={16} />} variant="ghost" />
          <IconButton label="加载中" icon={<IconRefresh size={16} />} loading />
          <IconButton label="禁用" icon={<IconSearch size={16} />} disabled />
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        anchor="Kbd"
        title="键盘按键：快捷键组合"
        description="等宽字体 + 1px 底部阴影的实体键帽；组合键之间用 + 分隔，尺寸支持 sm / md。"
        code={`<span style={{ display: 'inline-flex', gap: 4 }}>
  <Kbd>Ctrl</Kbd>
  <span>+</span>
  <Kbd>K</Kbd>
</span>`}
        column
      >
        <div className="demo-surface" style={{ width: '100%', maxWidth: 480 }}>
          <div className="demo-stack">
            {SHORTCUTS.map((shortcut) => (
              <Shortcut key={shortcut.label} {...shortcut} />
            ))}
          </div>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="键盘按键：尺寸与单键"
        description="sm 适合表格、工具栏等紧凑环境；md 适合快捷键说明面板。方向键与游戏操作键可直接作为单键展示。"
        column
      >
        <div className="demo-row">
          <span className="demo-label">尺寸：</span>
          <Kbd size="sm">Esc</Kbd>
          <Kbd size="sm">Enter</Kbd>
          <Kbd>Esc</Kbd>
          <Kbd>Enter</Kbd>
          <Kbd>Space</Kbd>
        </div>
        <div className="demo-row">
          <span className="demo-label">方向键：</span>
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
          <Kbd>←</Kbd>
          <Kbd>→</Kbd>
          <Kbd>Home</Kbd>
          <Kbd>End</Kbd>
        </div>
        <div className="demo-row">
          <span className="demo-label">游戏内移动：</span>
          <Kbd>W</Kbd>
          <Kbd>A</Kbd>
          <Kbd>S</Kbd>
          <Kbd>D</Kbd>
          <span className="demo-label">跳跃：</span>
          <Kbd>Space</Kbd>
        </div>
      </ShowcaseBlock>
      <ShowcaseBlock
        anchor="ButtonGroup"
        title="按钮组：贴合、尺寸与排列"
        description="attached 默认把相邻按钮贴合成一组：只保留首尾圆角、共用一条边；关闭贴合会留出间距，另支持纵向排列、block 整宽与整体尺寸。"
        code={`<ButtonGroup ariaLabel="实例操作">
  <Button variant="secondary" leftIcon={<IconPlay />}>启动</Button>
  <Button variant="secondary" leftIcon={<IconRefresh />}>重启</Button>
  <Button variant="secondary" leftIcon={<IconTrash />}>删除</Button>
</ButtonGroup>`}
        column
      >
        <div className="demo-stack" style={{ width: '100%' }}>
          <div className="demo-row">
            <span className="demo-label" style={{ width: 64 }}>
              贴合
            </span>
            <ButtonGroup ariaLabel="实例操作">
              <Button variant="secondary" leftIcon={<IconPlay size={14} />}>
                启动
              </Button>
              <Button variant="secondary" leftIcon={<IconRefresh size={14} />}>
                重启
              </Button>
              <Button variant="secondary" leftIcon={<IconTrash size={14} />}>
                删除
              </Button>
            </ButtonGroup>
            <ButtonGroup ariaLabel="视图切换">
              <Button variant="secondary">列表</Button>
              <Button variant="secondary">网格</Button>
              <Button variant="secondary">详情</Button>
            </ButtonGroup>
          </div>
          <div className="demo-row">
            <span className="demo-label" style={{ width: 64 }}>
              尺寸
            </span>
            <ButtonGroup size="sm" ariaLabel="小尺寸按钮组">
              <Button variant="secondary">sm</Button>
              <Button variant="secondary">28px</Button>
              <Button variant="secondary">贴合</Button>
            </ButtonGroup>
            <ButtonGroup size="lg" ariaLabel="大尺寸按钮组">
              <Button variant="secondary">lg</Button>
              <Button variant="secondary">40px</Button>
              <Button variant="secondary">贴合</Button>
            </ButtonGroup>
          </div>
          <div className="demo-row">
            <span className="demo-label" style={{ width: 64 }}>
              留间距
            </span>
            <ButtonGroup attached={false} ariaLabel="留间距按钮组">
              <Button variant="secondary">编辑</Button>
              <Button variant="secondary">复制</Button>
              <Button variant="secondary">删除</Button>
            </ButtonGroup>
            <ButtonGroup attached={false} ariaLabel="禁用的按钮组">
              <Button variant="secondary" disabled>
                禁用
              </Button>
              <Button variant="secondary" disabled>
                按钮
              </Button>
            </ButtonGroup>
          </div>
          <div className="demo-row" style={{ alignItems: 'flex-start' }}>
            <span className="demo-label" style={{ width: 64 }}>
              纵向
            </span>
            <ButtonGroup vertical ariaLabel="纵向按钮组">
              <Button variant="secondary" leftIcon={<IconEdit size={14} />}>
                重命名
              </Button>
              <Button variant="secondary" leftIcon={<IconCopy size={14} />}>
                复制实例
              </Button>
              <Button variant="secondary" leftIcon={<IconTrash size={14} />}>
                删除实例
              </Button>
            </ButtonGroup>
          </div>
          <div style={{ maxWidth: 380, width: '100%' }}>
            <ButtonGroup block ariaLabel="整宽按钮组">
              <Button block leftIcon={<IconPlay size={14} />}>
                开始游戏
              </Button>
              <Button block variant="secondary" leftIcon={<IconSettings size={14} />}>
                实例设置
              </Button>
              <Button block variant="ghost" leftIcon={<IconChevronRight size={14} />}>
                打开目录
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        anchor="SplitButton"
        title="分裂按钮：主操作 + 快捷菜单"
        description="左侧主按钮执行默认动作，右侧箭头展开快捷菜单；菜单通过 portal + fixed 定位，支持 ↑↓ / Home / End / Enter / Escape 完整键盘操作。"
        code={`<SplitButton
  items={[{ key: 'new', label: '新建实例', onSelect: create }, ...]}
  onClick={launch}
  menuLabel="更多启动方式"
>
  开始游戏
</SplitButton>`}
        column
      >
        <div className="demo-row">
          <SplitButton
            items={splitItems}
            onClick={() => setMenuAction('点击了主按钮：开始游戏')}
            menuLabel="更多启动方式"
          >
            开始游戏
          </SplitButton>
          <SplitButton
            variant="secondary"
            items={splitItems}
            onClick={() => setMenuAction('点击了主按钮：新建实例')}
            menuLabel="更多实例操作"
          >
            新建实例
          </SplitButton>
          <SplitButton
            size="sm"
            items={splitItems}
            placement="bottom-end"
            onClick={() => setMenuAction('点击了主按钮：快速启动')}
            menuLabel="更多快速启动方式"
          >
            快速启动
          </SplitButton>
          <SplitButton
            size="lg"
            items={splitItems}
            onClick={() => setMenuAction('点击了主按钮：保存设置')}
            menuLabel="更多保存方式"
          >
            保存设置
          </SplitButton>
        </div>
        <div className="demo-row">
          <SplitButton items={splitItems} loading menuLabel="更多启动方式">
            保存中
          </SplitButton>
          <SplitButton items={splitItems} disabled menuLabel="更多启动方式">
            不可用
          </SplitButton>
          <SplitButton items={splitItems} variant="secondary" onClick={() => setMenuAction('点击了主按钮：导入整合包')}>
            导入整合包
          </SplitButton>
        </div>
        <p className="demo-label">最近操作：{menuAction}</p>
      </ShowcaseBlock>
    </>
  )
}
