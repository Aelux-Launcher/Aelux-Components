import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import { IconCheck, IconClose, IconError, IconLoader, IconPlay, IconRefresh } from '../../icons'
import { Button } from '../Button'
import { IconButton } from '../IconButton'
import { Progress } from '../Progress'
import { Tag } from '../Tag'
import type { TagColor } from '../Tag'
import { cx } from '../../utils/cx'

export type TaskStatus = 'pending' | 'running' | 'paused' | 'done' | 'error'

export interface TaskItem {
  id: string
  title: ReactNode
  description?: ReactNode
  status: TaskStatus
  /** 0 ~ 100，undefined 表示不确定进度 */
  progress?: number
  speed?: string
  size?: string
  icon?: ReactNode
}

export interface TaskListProps {
  items: TaskItem[]
  onCancel?: (id: string) => void
  onRetry?: (id: string) => void
  onClearDone?: () => void
  emptyText?: ReactNode
  title?: ReactNode
  maxHeight?: number | string
  ariaLabel?: string
  className?: string
}

type ProgressVariant = 'primary' | 'success' | 'warning' | 'danger'

interface StatusMeta {
  label: string
  color: TagColor
  icon: ReactNode
  progressVariant: ProgressVariant
}

const STATUS_META: Record<TaskStatus, StatusMeta> = {
  pending: {
    label: '等待中',
    color: 'neutral',
    icon: <IconLoader size={15} />,
    progressVariant: 'primary',
  },
  running: {
    label: '进行中',
    color: 'info',
    icon: <IconLoader size={15} className="aelux-spin" />,
    progressVariant: 'primary',
  },
  paused: {
    label: '已暂停',
    color: 'warning',
    icon: <IconPlay size={15} />,
    progressVariant: 'warning',
  },
  done: {
    label: '已完成',
    color: 'success',
    icon: <IconCheck size={15} />,
    progressVariant: 'success',
  },
  error: {
    label: '失败',
    color: 'danger',
    icon: <IconError size={15} />,
    progressVariant: 'danger',
  },
}

const toCssSize = (value: number | string): string =>
  typeof value === 'number' ? `${value}px` : value

/**
 * 任务队列 —— 下载 / 安装任务的紧凑列表，行内含状态徽标、进度条与取消 / 重试操作。
 */
export const TaskList = forwardRef<HTMLDivElement, TaskListProps>(function TaskList(
  {
    items,
    onCancel,
    onRetry,
    onClearDone,
    emptyText = '暂无任务',
    title,
    maxHeight,
    ariaLabel,
    className,
  },
  ref,
) {
  const doneCount = items.filter((item) => item.status === 'done').length
  const showFooter = doneCount > 0 && onClearDone != null

  return (
    <div
      ref={ref}
      role="group"
      aria-label={ariaLabel}
      className={cx('aelux-task-list', className)}
    >
      {title != null ? (
        <div className="aelux-task-list__header">
          <span className="aelux-task-list__title">{title}</span>
          <span className="aelux-task-list__count">{items.length} 项</span>
        </div>
      ) : null}
      {items.length === 0 ? (
        <div className="aelux-task-list__empty">{emptyText}</div>
      ) : (
        <ul
          className="aelux-task-list__body"
          style={maxHeight != null ? { maxHeight: toCssSize(maxHeight) } : undefined}
        >
          {items.map((item) => {
            const meta = STATUS_META[item.status]
            const progressValue = Math.min(100, Math.max(0, item.progress ?? 0))
            const showProgress =
              item.status === 'running' || (item.status === 'paused' && item.progress != null)
            const cancellable =
              item.status === 'pending' || item.status === 'running' || item.status === 'paused'

            return (
              <li
                key={item.id}
                className={cx('aelux-task-list__item', `aelux-task-list__item--${item.status}`)}
              >
                <span className="aelux-task-list__icon" aria-hidden="true">
                  {item.icon ?? meta.icon}
                </span>
                <div className="aelux-task-list__main">
                  <div className="aelux-task-list__row">
                    <span className="aelux-task-list__item-title">{item.title}</span>
                    <Tag size="sm" variant="soft" color={meta.color}>
                      {meta.label}
                    </Tag>
                    <span className="aelux-task-list__actions">
                      {item.status === 'error' && onRetry != null ? (
                        <IconButton
                          size="sm"
                          variant="ghost"
                          label={`重试任务 ${item.id}`}
                          icon={<IconRefresh size={14} />}
                          onClick={() => onRetry(item.id)}
                        />
                      ) : null}
                      {cancellable && onCancel != null ? (
                        <IconButton
                          size="sm"
                          variant="ghost"
                          label={`取消任务 ${item.id}`}
                          icon={<IconClose size={14} />}
                          onClick={() => onCancel(item.id)}
                        />
                      ) : null}
                    </span>
                  </div>
                  {item.description != null ? (
                    <div className="aelux-task-list__description">{item.description}</div>
                  ) : null}
                  {showProgress ? (
                    <div className="aelux-task-list__progress">
                      <Progress
                        className="aelux-task-list__bar"
                        size="sm"
                        variant={meta.progressVariant}
                        value={progressValue}
                        indeterminate={item.progress == null}
                        aria-label={typeof item.title === 'string' ? `${item.title} 进度` : '任务进度'}
                      />
                      {item.progress != null ? (
                        <span className="aelux-task-list__percent">
                          {Math.round(progressValue)}%
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                  {item.speed != null || item.size != null ? (
                    <div className="aelux-task-list__meta">
                      {item.speed != null ? <span>{item.speed}</span> : null}
                      {item.speed != null && item.size != null ? (
                        <span aria-hidden="true">·</span>
                      ) : null}
                      {item.size != null ? <span>{item.size}</span> : null}
                    </div>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ul>
      )}
      {showFooter ? (
        <div className="aelux-task-list__footer">
          <Button size="sm" variant="ghost" onClick={onClearDone}>
            清除已完成（{doneCount}）
          </Button>
        </div>
      ) : null}
    </div>
  )
})

TaskList.displayName = 'TaskList'
