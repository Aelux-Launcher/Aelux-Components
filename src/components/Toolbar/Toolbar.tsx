import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface ToolbarProps {
  /** 中间主内容区 */
  children?: ReactNode
  /** 左侧起始槽位 */
  start?: ReactNode
  /** 右侧结束槽位 */
  end?: ReactNode
  /** 外观，默认 plain */
  variant?: 'plain' | 'bordered'
  /** 尺寸，默认 md */
  size?: 'sm' | 'md'
  /** 吸附在滚动容器顶部 */
  sticky?: boolean
  /** 工具栏的 aria-label */
  ariaLabel?: string
  className?: string
}

/**
 * 工具栏 —— start / children / end 三个槽位，支持 plain / bordered 外观、sm / md 尺寸与
 * sticky 吸顶。遵循 ARIA toolbar 模式（role="toolbar" + aria-orientation）。
 */
export const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(function Toolbar(
  { children, start, end, variant = 'plain', size = 'md', sticky = false, ariaLabel, className },
  ref,
) {
  return (
    <div
      ref={ref}
      role="toolbar"
      aria-orientation="horizontal"
      aria-label={ariaLabel}
      className={cx(
        'aelux-toolbar',
        `aelux-toolbar--${variant}`,
        `aelux-toolbar--${size}`,
        sticky && 'aelux-toolbar--sticky',
        className,
      )}
    >
      {start !== undefined ? <div className="aelux-toolbar__slot aelux-toolbar__slot--start">{start}</div> : null}
      <div className="aelux-toolbar__content">{children}</div>
      {end !== undefined ? <div className="aelux-toolbar__slot aelux-toolbar__slot--end">{end}</div> : null}
    </div>
  )
})

Toolbar.displayName = 'Toolbar'
