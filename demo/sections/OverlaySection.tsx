import { useState } from 'react'
import {
  Button,
  Dialog,
  Drawer,
  DropdownMenu,
  IconChevronDown,
  IconCopy,
  IconDownload,
  IconEdit,
  IconExternal,
  IconFolder,
  IconInfo,
  IconMore,
  IconPlus,
  IconSettings,
  IconTrash,
  IconUser,
  Input,
  Modal,
  Popover,
  toast,
  Tooltip,
} from 'aelux-components'
import { ShowcaseBlock } from '../components/ShowcaseBlock'
import type { SectionProps } from './types'

const SIZE_LABELS: Record<'sm' | 'md' | 'lg', string> = {
  sm: '小尺寸（360px）',
  md: '中尺寸（460px）',
  lg: '大尺寸（640px）',
}

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms))

/**
 * 浮层类组件演示：Modal / Dialog / Drawer / Popover / Tooltip / DropdownMenu
 */
export function OverlaySection(_props: SectionProps) {
  const [basicOpen, setBasicOpen] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [sizeModal, setSizeModal] = useState<'sm' | 'md' | 'lg' | null>(null)
  const [destroyOpen, setDestroyOpen] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [dangerOpen, setDangerOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)

  const [drawerRightOpen, setDrawerRightOpen] = useState(false)
  const [drawerLeftOpen, setDrawerLeftOpen] = useState(false)
  const [drawerDestroyOpen, setDrawerDestroyOpen] = useState(false)
  const [detailName, setDetailName] = useState('Aelux Launcher')

  const [popoverOpen, setPopoverOpen] = useState(false)

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [compact, setCompact] = useState(false)

  const submitForm = () => {
    const name = projectName.trim()
    setFormOpen(false)
    setProjectName('')
    setProjectDescription('')
    toast.success('项目已创建', {
      description: name === '' ? '未填写名称，已按默认名称创建。' : `项目名称：${name}`,
    })
  }

  const saveDrawer = () => {
    setDrawerRightOpen(false)
    toast.success('项目详情已保存', { description: `项目名称：${detailName}` })
  }

  return (
    <>
      <ShowcaseBlock
        title="Modal 模态框"
        anchor="Modal"
        description="createPortal 渲染到 body；Esc / 点击遮罩关闭、body 滚动锁定、Tab 焦点圈定，关闭后焦点归还原触发元素。"
        code={`<Modal open={open} onClose={() => setOpen(false)} title="基础弹窗">…</Modal>`}
        column
      >
        <div className="demo-row">
          <Button onClick={() => setBasicOpen(true)}>基础弹窗</Button>
          <Button variant="secondary" onClick={() => setFormOpen(true)}>
            带页脚的表单弹窗
          </Button>
          <Button variant="secondary" onClick={() => setSizeModal('md')}>
            尺寸对比（sm / md / lg）
          </Button>
          <Button variant="ghost" onClick={() => setDestroyOpen(true)}>
            destroyOnClose 示例
          </Button>
        </div>
        <div className="demo-label">
          默认底部为「取消 / 确定」；关闭按钮、Esc、点击遮罩均走同一个 onClose 闭环。
        </div>

        <Modal open={basicOpen} onClose={() => setBasicOpen(false)} title="基础弹窗" width={460}>
          <div className="demo-stack">
            <div>这是一个基础模态框，适合承载确认、说明等轻量内容。</div>
            <div className="demo-label">
              按 Esc 或点击遮罩可关闭；打开时页面滚动被锁定，焦点被圈定在弹窗内。
            </div>
          </div>
        </Modal>

        <Modal
          open={formOpen}
          onClose={() => setFormOpen(false)}
          title="新建项目"
          width={520}
          footer={
            <>
              <Button variant="secondary" onClick={() => setFormOpen(false)}>
                取消
              </Button>
              <Button variant="primary" onClick={submitForm}>
                提交
              </Button>
            </>
          }
        >
          <div className="demo-stack">
            <div className="demo-label">项目名称</div>
            <Input
              placeholder="例如：Aelux Launcher"
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
            />
            <div className="demo-label">项目描述</div>
            <Input
              placeholder="用一句话描述项目目标"
              value={projectDescription}
              onChange={(event) => setProjectDescription(event.target.value)}
            />
            <div className="demo-label">提交后弹窗关闭，并通过 toast 反馈结果（onClose 闭环）。</div>
          </div>
        </Modal>

        <Modal
          open={sizeModal !== null}
          onClose={() => setSizeModal(null)}
          title={sizeModal === null ? '尺寸对比' : SIZE_LABELS[sizeModal]}
          size={sizeModal ?? 'md'}
          footer={null}
        >
          <div className="demo-stack">
            <div>
              当前弹窗尺寸为 {sizeModal === null ? 'md' : sizeModal}，也可通过 width
              属性传入任意像素值或 CSS 宽度。
            </div>
            <div className="demo-row">
              <Button size="sm" variant="secondary" onClick={() => setSizeModal('sm')}>
                sm
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setSizeModal('md')}>
                md
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setSizeModal('lg')}>
                lg
              </Button>
            </div>
          </div>
        </Modal>

        <Modal
          open={destroyOpen}
          onClose={() => setDestroyOpen(false)}
          title="destroyOnClose"
          destroyOnClose
          footer={null}
          width={440}
        >
          <div className="demo-stack">
            <div>
              destroyOnClose 打开时，关闭后弹窗内容会卸载；再次打开时内部状态与 DOM 均为全新实例。
            </div>
            <Input placeholder="每次打开都是全新的输入框" />
            <div className="demo-label">适合包含表单、需要重置状态的弹窗。</div>
          </div>
        </Modal>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Dialog 确认对话框"
        anchor="Dialog"
        description="基于 Modal 组合的确认框：danger 语义、异步 onConfirm 自动 loading 防重复、单操作提示框。"
        code={`<Dialog open={open} onClose={close} title="保存设置" onConfirm={() => save()} />`}
        column
      >
        <div className="demo-row">
          <Button onClick={() => setConfirmOpen(true)}>确认（异步 loading）</Button>
          <Button variant="danger" onClick={() => setDangerOpen(true)}>
            危险操作删除
          </Button>
          <Button variant="secondary" onClick={() => setInfoOpen(true)}>
            单操作提示
          </Button>
        </div>

        <Dialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          title="保存设置"
          description="将当前启动器的外观与行为设置写入本地配置，立即生效。"
          onConfirm={() =>
            wait(900).then(() => {
              setConfirmOpen(false)
              toast.success('设置已保存')
            })
          }
        >
          <div className="demo-label">确认按钮在 onConfirm 返回 Promise 期间显示 loading，重复点击会被忽略。</div>
        </Dialog>

        <Dialog
          open={dangerOpen}
          onClose={() => setDangerOpen(false)}
          tone="danger"
          title="删除项目"
          description="删除后项目内的组件与配置将无法恢复，确定继续吗？"
          confirmText="删除"
          onConfirm={() =>
            wait(700).then(() => {
              setDangerOpen(false)
              toast.success('项目已删除')
            })
          }
        >
          <div className="demo-label">tone=&quot;danger&quot; 会使用警告图标与 danger 变体的确认按钮。</div>
        </Dialog>

        <Dialog
          open={infoOpen}
          onClose={() => setInfoOpen(false)}
          title="使用提示"
          description="Tab 可在按钮间移动焦点，Esc 关闭对话框，关闭后焦点回到触发按钮。"
          icon={<IconInfo size={18} />}
          confirmText="知道了"
          hideCancel
          showClose
        />
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Drawer 抽屉"
        anchor="Drawer"
        description="createPortal 到 body，左右两侧滑入；遮罩 / Esc 关闭、滚动锁与焦点圈定齐全，关闭播放退出动画。"
        code={`<Drawer open={open} onClose={close} title="项目详情" placement="right" width={420}>…</Drawer>`}
        column
      >
        <div className="demo-row">
          <Button onClick={() => setDrawerRightOpen(true)}>右侧抽屉（带页脚）</Button>
          <Button variant="secondary" onClick={() => setDrawerLeftOpen(true)}>
            左侧抽屉（320px）
          </Button>
          <Button variant="ghost" onClick={() => setDrawerDestroyOpen(true)}>
            destroyOnClose
          </Button>
        </div>

        <Drawer
          open={drawerRightOpen}
          onClose={() => setDrawerRightOpen(false)}
          title="项目详情"
          description="查看并编辑当前启动器中的项目信息。"
          width={420}
          footer={
            <>
              <Button variant="secondary" onClick={() => setDrawerRightOpen(false)}>
                取消
              </Button>
              <Button variant="primary" onClick={saveDrawer}>
                保存
              </Button>
            </>
          }
        >
          <div className="demo-stack">
            <div className="demo-label">项目名称</div>
            <Input value={detailName} onChange={(event) => setDetailName(event.target.value)} />
            <div className="demo-label">项目成员</div>
            <div className="demo-row">
              <IconUser size={16} />
              <span>Aelux 前端工程师</span>
            </div>
            <div className="demo-label">项目设置</div>
            <div className="demo-row">
              <IconSettings size={16} />
              <span>打开时自动同步远程配置</span>
            </div>
            <div className="demo-label">
              点击遮罩或按 Esc 关闭，抽屉先播放退出动画再卸载；打开期间页面滚动被锁定。
            </div>
          </div>
        </Drawer>

        <Drawer
          open={drawerLeftOpen}
          onClose={() => setDrawerLeftOpen(false)}
          title="组件库索引"
          placement="left"
          width={320}
        >
          <div className="demo-stack">
            <div className="demo-label">浮层与反馈</div>
            <span>Modal · Dialog · Drawer · Popover · Tooltip · DropdownMenu</span>
            <div className="demo-label">表单与选择</div>
            <span>Input · Select · Combobox · Switch · Slider</span>
            <div className="demo-label">展示与布局</div>
            <span>Card · Table · Tabs · SidebarNav · Pagination</span>
          </div>
        </Drawer>

        <Drawer
          open={drawerDestroyOpen}
          onClose={() => setDrawerDestroyOpen(false)}
          title="destroyOnClose"
          description="关闭后抽屉内容卸载，再次打开时内部状态重置。"
          width={360}
          destroyOnClose
        >
          <div className="demo-stack">
            <div className="demo-label">项目备注</div>
            <Input placeholder="每次打开都是全新的输入框" />
            <div className="demo-label">适合包含表单、需要重置状态的抽屉。</div>
          </div>
        </Drawer>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Popover 富内容气泡"
        anchor="Popover"
        description="portal + fixed 定位，支持 click / hover / focus 触发与受控开关，点击外部或 Esc 关闭。"
        code={`<Popover content={<div>富内容</div>} trigger="click"><Button>打开</Button></Popover>`}
        column
      >
        <div className="demo-label">点击触发，内容可放按钮与说明</div>
        <div className="demo-row">
          <Popover
            trigger="click"
            placement="bottom"
            content={
              <div className="demo-stack">
                <strong>项目操作</strong>
                <span className="demo-label">发布前请先在本地运行一次 pnpm typecheck。</span>
                <div className="demo-row">
                  <Button size="sm" variant="secondary" onClick={() => toast.info('打开项目详情')}>
                    查看详情
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => toast.error('已取消发布')}>
                    取消发布
                  </Button>
                </div>
              </div>
            }
          >
            <Button variant="secondary">项目操作</Button>
          </Popover>

          <Popover
            trigger="hover"
            content="悬停 60ms 后出现，离开后 120ms 收起，可移入气泡继续操作。"
          >
            <Button variant="ghost">悬停触发</Button>
          </Popover>

          <Popover trigger="focus" content="Tab 聚焦触发，失焦后自动关闭。">
            <Button variant="ghost">聚焦触发</Button>
          </Popover>

          <Popover content="禁用状态不会弹出" disabled>
            <Button variant="ghost" disabled>
              已禁用
            </Button>
          </Popover>
        </div>

        <div className="demo-label">4 个方向</div>
        <div className="demo-row">
          <Popover trigger="click" placement="top" content="上方气泡">
            <Button size="sm" variant="secondary">
              上
            </Button>
          </Popover>
          <Popover trigger="click" placement="bottom" content="下方气泡">
            <Button size="sm" variant="secondary">
              下
            </Button>
          </Popover>
          <Popover trigger="click" placement="left" content="左侧气泡">
            <Button size="sm" variant="secondary">
              左
            </Button>
          </Popover>
          <Popover trigger="click" placement="right" content="右侧气泡">
            <Button size="sm" variant="secondary">
              右
            </Button>
          </Popover>
        </div>

        <div className="demo-label">受控 open / onOpenChange</div>
        <div className="demo-row">
          <Popover
            trigger="click"
            open={popoverOpen}
            onOpenChange={setPopoverOpen}
            content={
              <div className="demo-stack">
                <span className="demo-label">展开状态由外部 state 控制。</span>
                <Button size="sm" variant="secondary" onClick={() => setPopoverOpen(false)}>
                  关闭气泡
                </Button>
              </div>
            }
          >
            <Button variant={popoverOpen ? 'primary' : 'secondary'}>
              {popoverOpen ? '收起受控气泡' : '打开受控气泡'}
            </Button>
          </Popover>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Tooltip 文字提示"
        anchor="Tooltip"
        description="portal + fixed 定位，基于 getBoundingClientRect 计算位置；hover / focus 触发，自动同步 aria-describedby。"
        code={`<Tooltip content="提示文案" placement="top"><Button>悬停我</Button></Tooltip>`}
        column
      >
        <div className="demo-label">4 个方向（鼠标悬停或 Tab 聚焦触发）</div>
        <div className="demo-row">
          <Tooltip content="上方提示" placement="top">
            <Button variant="secondary" size="sm">
              上
            </Button>
          </Tooltip>
          <Tooltip content="下方提示" placement="bottom">
            <Button variant="secondary" size="sm">
              下
            </Button>
          </Tooltip>
          <Tooltip content="左侧提示" placement="left">
            <Button variant="secondary" size="sm">
              左
            </Button>
          </Tooltip>
          <Tooltip content="右侧提示" placement="right">
            <Button variant="secondary" size="sm">
              右
            </Button>
          </Tooltip>
        </div>

        <div className="demo-label">延迟与禁用</div>
        <div className="demo-row">
          <Tooltip content="默认延迟 120ms 后出现">
            <Button variant="ghost" size="sm">
              默认延迟
            </Button>
          </Tooltip>
          <Tooltip content="延迟 600ms 后出现" delay={600}>
            <Button variant="ghost" size="sm">
              延迟 600ms
            </Button>
          </Tooltip>
          <Tooltip content="禁用状态下不会显示" disabled>
            <Button variant="ghost" size="sm">
              已禁用
            </Button>
          </Tooltip>
        </div>

        <div className="demo-label">焦点触发用于键盘无障碍：Tab 到按钮即可显示提示，失焦后隐藏。</div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="DropdownMenu 下拉菜单"
        anchor="DropdownMenu"
        description="portal 定位 + roving focus：↑↓ / Home / End / Enter / Esc 全键盘可用，支持图标、快捷键、复选项与危险项。"
        code={`<DropdownMenu trigger={<Button>项目操作</Button>} items={items} onSelect={handleSelect} />`}
        column
      >
        <div className="demo-row">
          <DropdownMenu
            trigger={
              <Button variant="secondary" leftIcon={<IconMore size={14} />} rightIcon={<IconChevronDown size={14} />}>
                项目操作
              </Button>
            }
            items={[
              { type: 'label', key: 'group-project', label: '项目' },
              { key: 'new', label: '新建项目', icon: <IconPlus size={14} />, shortcut: 'Ctrl+N' },
              { key: 'open', label: '打开项目', icon: <IconFolder size={14} /> },
              { key: 'import', label: '导入组件包', icon: <IconDownload size={14} /> },
              { key: 'copy', label: '复制链接', icon: <IconCopy size={14} />, shortcut: 'Ctrl+C' },
              {
                key: 'external',
                label: '在浏览器中打开',
                icon: <IconExternal size={14} />,
                shortcut: 'Ctrl+Enter',
              },
              { type: 'separator', key: 'sep-1' },
              { key: 'settings', label: '项目设置', icon: <IconSettings size={14} /> },
              { key: 'edit', label: '重命名', icon: <IconEdit size={14} />, shortcut: 'F2' },
              { type: 'separator', key: 'sep-2' },
              { key: 'delete', label: '删除项目', icon: <IconTrash size={14} />, danger: true },
            ]}
            onSelect={(key) => toast.info(`已选择菜单项：${key}`)}
          />

          <DropdownMenu
            trigger={<Button variant="ghost">视图（复选）</Button>}
            placement="bottom-end"
            items={[
              { type: 'label', key: 'group-view', label: '显示方式' },
              {
                key: 'grid',
                label: '网格视图',
                checked: viewMode === 'grid',
              },
              {
                key: 'list',
                label: '列表视图',
                checked: viewMode === 'list',
              },
              { type: 'separator', key: 'sep-view' },
              { key: 'compact', label: '紧凑模式', checked: compact },
            ]}
            onSelect={(key) => {
              if (key === 'grid' || key === 'list') setViewMode(key)
              if (key === 'compact') setCompact((value) => !value)
              toast.info(`已更新视图设置：${key}`)
            }}
          />

          <DropdownMenu
            trigger={<Button variant="ghost">禁用状态</Button>}
            disabled
            items={[{ key: 'unavailable', label: '不可用操作' }]}
          />
        </div>

        <div className="demo-label">
          键盘：Enter / Space 展开并聚焦第一项，↑↓ 循环移动，Home / End 跳到首尾，Esc 关闭并把焦点归还触发按钮。
        </div>
      </ShowcaseBlock>
    </>
  )
}
