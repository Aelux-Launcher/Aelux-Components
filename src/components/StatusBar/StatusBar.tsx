import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface StatusBarProps {
  /** 左侧状态区 */
  left?: ReactNode
  /** 中间进度 / 任务区 */
  children?: ReactNode
  /** 右侧信息区 */
  right?: ReactNode
  tone?: 'default' | 'info' | 'success' | 'warning'
  className?: string
}

/**
 * 状态栏 —— 启动器窗口底部的 32px 状态条：左侧状态、中间任务 / 进度、右侧信息。
 */
export const StatusBar = forwardRef<HTMLDivElement, StatusBarProps>(function StatusBar(
  { left, children, right, tone = 'default', className },
  ref,
) {
  return (
    <div ref={ref} className={cx('aelux-status-bar', `aelux-status-bar--${tone}`, className)}>
      {left != null ? <div className="aelux-status-bar__left">{left}</div> : null}
      {children != null ? <div className="aelux-status-bar__center">{children}</div> : null}
      {right != null ? <div className="aelux-status-bar__right">{right}</div> : null}
    </div>
  )
})

StatusBar.displayName = 'StatusBar'
