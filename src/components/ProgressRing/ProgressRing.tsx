import type { ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface ProgressRingProps {
  /** 当前值 */
  value?: number
  /** 最大值，默认 100 */
  max?: number
  /** 直径 px，默认 64 */
  size?: number
  /** 圆环线宽，默认随尺寸推导 */
  thickness?: number
  /** 圆环中央显示百分比 */
  showValue?: boolean
  /** 圆环下方说明文字 */
  label?: ReactNode
  /** 不确定进度（旋转动画） */
  indeterminate?: boolean
  /** 语义色调，默认 primary */
  tone?: 'primary' | 'success' | 'warning' | 'danger'
  /** 无可见文字时提供给读屏的名称 */
  ariaLabel?: string
  className?: string
}

/**
 * 圆环进度 —— 纯 SVG stroke-dasharray 实现，支持确定 / 不确定两种状态。
 */
export function ProgressRing({
  value = 0,
  max = 100,
  size = 64,
  thickness,
  showValue = false,
  label,
  indeterminate = false,
  tone = 'primary',
  ariaLabel = '进度',
  className,
}: ProgressRingProps) {
  const strokeWidth = Math.min(
    Math.max(2, thickness ?? Math.round(size / 10)),
    Math.max(2, Math.round(size / 2)),
  )
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const safeMax = max > 0 ? max : 100
  const clamped = Math.min(safeMax, Math.max(0, value))
  const ratio = clamped / safeMax
  const dashOffset = indeterminate ? 0 : circumference * (1 - ratio)
  const valueFontSize = Math.max(11, Math.round(size * 0.2))

  return (
    <div className={cx('aelux-progress-ring-root', className)}>
      <div
        className={cx('aelux-progress-ring', `aelux-progress-ring--${tone}`, indeterminate && 'is-indeterminate')}
        style={{ width: size, height: size }}
        role="progressbar"
        aria-label={ariaLabel}
        aria-valuemin={indeterminate ? undefined : 0}
        aria-valuemax={indeterminate ? undefined : safeMax}
        aria-valuenow={indeterminate ? undefined : Math.round(clamped)}
        aria-valuetext={indeterminate ? undefined : `${Math.round(ratio * 100)}%`}
        aria-busy={indeterminate || undefined}
      >
        <svg
          className="aelux-progress-ring__svg"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-hidden="true"
        >
          <circle
            className="aelux-progress-ring__track"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
          />
          <circle
            className="aelux-progress-ring__indicator"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={
              indeterminate ? `${circumference * 0.25} ${circumference}` : `${circumference}`
            }
            strokeDashoffset={dashOffset}
          />
        </svg>
        {showValue && !indeterminate ? (
          <span className="aelux-progress-ring__value" style={{ fontSize: valueFontSize }} aria-hidden="true">
            {Math.round(ratio * 100)}%
          </span>
        ) : null}
      </div>
      {label != null ? <span className="aelux-progress-ring__label">{label}</span> : null}
    </div>
  )
}
