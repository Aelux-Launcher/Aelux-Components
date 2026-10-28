import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'
import { cx } from '../../utils/cx'

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** 当前值 */
  value?: number
  /** 最大值，默认 100 */
  max?: number
  /** 尺寸，默认 md */
  size?: 'sm' | 'md'
  /** 颜色，默认 primary */
  variant?: 'primary' | 'success' | 'warning' | 'danger'
  /** 是否显示百分比文案 */
  showLabel?: boolean
  /** 不确定进度（滚动动画） */
  indeterminate?: boolean
}

/**
 * 进度条 —— 支持确定 / 不确定进度、4 种语义颜色与百分比文案。
 */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  {
    value,
    max = 100,
    size = 'md',
    variant = 'primary',
    showLabel = false,
    indeterminate = false,
    className,
    ...rest
  },
  ref,
) {
  const safeMax = max > 0 ? max : 100
  const clamped = Math.min(safeMax, Math.max(0, value ?? 0))
  const percent = Math.round((clamped / safeMax) * 1000) / 10
  const percentText = `${Math.round(percent)}%`

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-label="进度"
      className={cx(
        'aelux-progress',
        `aelux-progress--${size}`,
        `aelux-progress--${variant}`,
        indeterminate && 'aelux-progress--indeterminate',
        className,
      )}
      {...rest}
      {...(indeterminate
        ? {}
        : { 'aria-valuenow': Math.round(clamped * 100) / 100, 'aria-valuetext': percentText })}
    >
      <div className="aelux-progress__track">
        <div
          className="aelux-progress__bar"
          style={indeterminate ? undefined : { width: `${percent}%` }}
        />
      </div>
      {showLabel ? <span className="aelux-progress__label">{percentText}</span> : null}
    </div>
  )
})

Progress.displayName = 'Progress'
