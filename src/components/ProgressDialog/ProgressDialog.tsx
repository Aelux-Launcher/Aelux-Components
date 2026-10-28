import { useEffect, useId, useState } from 'react'
import type { ReactNode } from 'react'
import { IconChevronDown } from '../../icons'
import { cx } from '../../utils/cx'
import { Button } from '../Button'
import { Modal } from '../Modal'
import { Progress } from '../Progress'

export interface ProgressDialogStat {
  label: string
  value: string
}

export interface ProgressDialogProps {
  open: boolean
  onClose: () => void
  title: ReactNode
  description?: ReactNode
  /** 0 ~ 100 */
  progress?: number
  indeterminate?: boolean
  statusText?: ReactNode
  stats?: ProgressDialogStat[]
  /** 可展开的详情 / 日志 */
  details?: ReactNode
  cancellable?: boolean
  onCancel?: () => void
  closeText?: string
  size?: 'sm' | 'md' | 'lg'
  /** 点击遮罩关闭，默认 false */
  closeOnOverlay?: boolean
  /** 按 Esc 关闭，默认 false（任务执行中避免误关） */
  closeOnEsc?: boolean
  /** 显示右上角关闭按钮，默认 false */
  showClose?: boolean
  /** 关闭后是否销毁内容 */
  destroyOnClose?: boolean
  className?: string
}

/**
 * 任务进度对话框 —— 基于 Modal 组合的任务执行浮层：
 * 进度条 + 状态行 + 统计信息，「详情」默认收起可展开日志，
 * 未完成且 cancellable 时显示取消，完成后显示关闭。
 */
export function ProgressDialog({
  open,
  onClose,
  title,
  description,
  progress,
  indeterminate,
  statusText,
  stats,
  details,
  cancellable = true,
  onCancel,
  closeText = '关闭',
  size = 'md',
  closeOnOverlay = false,
  closeOnEsc = false,
  showClose = false,
  destroyOnClose = false,
  className,
}: ProgressDialogProps) {
  const [expanded, setExpanded] = useState(false)
  const detailsId = useId()
  const rawProgress = Math.min(100, Math.max(0, progress ?? 0))
  const isIndeterminate = indeterminate ?? progress === undefined
  const completed = !isIndeterminate && rawProgress >= 100
  const percentText = `${Math.round(rawProgress)}%`

  useEffect(() => {
    if (!open) setExpanded(false)
  }, [open])

  const defaultStatus = completed ? '已完成' : isIndeterminate ? '正在处理…' : '处理中…'

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size={size}
      centered
      className={cx('aelux-progress-dialog', className)}
      closeOnOverlay={closeOnOverlay}
      closeOnEsc={closeOnEsc}
      showClose={showClose}
      destroyOnClose={destroyOnClose}
      footer={
        <div className="aelux-progress-dialog__footer">
          {details != null ? (
            <Button
              variant="ghost"
              size="sm"
              aria-expanded={expanded}
              aria-controls={detailsId}
              onClick={() => setExpanded((value) => !value)}
              rightIcon={
                <span
                  className={cx(
                    'aelux-progress-dialog__chevron',
                    expanded && 'aelux-progress-dialog__chevron--open',
                  )}
                >
                  <IconChevronDown size={14} />
                </span>
              }
            >
              {expanded ? '收起详情' : '详情'}
            </Button>
          ) : (
            <span />
          )}
          {completed ? (
            <Button variant="primary" onClick={onClose}>
              {closeText}
            </Button>
          ) : cancellable ? (
            <Button variant="secondary" onClick={() => (onCancel ?? onClose)()}>
              取消
            </Button>
          ) : null}
        </div>
      }
    >
      <div className="aelux-progress-dialog__body">
        {description != null ? (
          <p className="aelux-progress-dialog__description">{description}</p>
        ) : null}

        <Progress
          value={rawProgress}
          indeterminate={isIndeterminate}
          variant={completed ? 'success' : 'primary'}
        />

        <div className="aelux-progress-dialog__status" role="status" aria-live="polite">
          <span className="aelux-progress-dialog__status-text">{statusText ?? defaultStatus}</span>
          {isIndeterminate ? null : (
            <span className="aelux-progress-dialog__percent">{percentText}</span>
          )}
        </div>

        {stats && stats.length > 0 ? (
          <dl className="aelux-progress-dialog__stats">
            {stats.map((stat, index) => (
              <div className="aelux-progress-dialog__stat" key={`${stat.label}-${index}`}>
                <dt className="aelux-progress-dialog__stat-label">{stat.label}</dt>
                <dd className="aelux-progress-dialog__stat-value">{stat.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {details != null ? (
          <div className="aelux-progress-dialog__details" id={detailsId} hidden={!expanded}>
            {details}
          </div>
        ) : null}
      </div>
    </Modal>
  )
}
