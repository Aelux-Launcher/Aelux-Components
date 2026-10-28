import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'
import { cx } from '../../utils/cx'

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /** 尺寸，默认 md */
  size?: 'sm' | 'md' | 'lg'
  /** 无障碍说明，默认「加载中」 */
  label?: string
}

/**
 * 加载指示器 —— CSS 转圈，自带 role="status" 与屏幕阅读器文案。
 */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = 'md', label = '加载中', className, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      role="status"
      aria-live="polite"
      className={cx('aelux-spinner', `aelux-spinner--${size}`, className)}
      {...rest}
    >
      <span className="aelux-spinner__circle" aria-hidden="true" />
      <span className="aelux-sr-only">{label}</span>
    </span>
  )
})

Spinner.displayName = 'Spinner'
