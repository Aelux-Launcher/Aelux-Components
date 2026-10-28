import { useState } from 'react'
import { Button, Input, Modal, toast, Tooltip } from 'aelux-components'
import { ShowcaseBlock } from '../components/ShowcaseBlock'
import type { SectionProps } from './types'

const SIZE_LABELS: Record<'sm' | 'md' | 'lg', string> = {
  sm: '小尺寸（360px）',
  md: '中尺寸（420px）',
  lg: '大尺寸（640px）',
}

/**
 * 浮层类组件演示：Modal / Tooltip
 */
export function OverlaySection(_props: SectionProps) {
  const [basicOpen, setBasicOpen] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [sizeModal, setSizeModal] = useState<'sm' | 'md' | 'lg' | null>(null)
  const [destroyOpen, setDestroyOpen] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')

  const submitForm = () => {
    const name = projectName.trim()
    setFormOpen(false)
    setProjectName('')
    setProjectDescription('')
    toast.success('项目已创建', {
      description: name === '' ? '未填写名称，已按默认名称创建。' : `项目名称：${name}`,
    })
  }

  return (
    <>
      <ShowcaseBlock
        title="Modal 模态框"
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

        <Modal
          open={basicOpen}
          onClose={() => setBasicOpen(false)}
          title="基础弹窗"
          width={460}
        >
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
            <div className="demo-label">
              提交后弹窗关闭，并通过 toast 反馈结果（onClose 闭环）。
            </div>
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
              destroyOnClose 打开时，关闭后弹窗内容会卸载；再次打开时内部状态与 DOM
              均为全新实例。
            </div>
            <Input placeholder="每次打开都是全新的输入框" />
            <div className="demo-label">适合包含表单、需要重置状态的弹窗。</div>
          </div>
        </Modal>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Tooltip 文字提示"
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

        <div className="demo-label">
          焦点触发用于键盘无障碍：Tab 到按钮即可显示提示，失焦后隐藏。
        </div>
      </ShowcaseBlock>
    </>
  )
}
