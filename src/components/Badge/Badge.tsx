import { forwardRef } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../utils/cx'

export type BadgeStatus = 'primary' | 'success' | 'warning' | 'danger' | 'info'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** 数字内容；超过 max 时显示 99+ 形式 */
  count?: number
  /** 显示上限，默认 99 */
  max?: number
  /** 仅显示小圆点，不显示数字 */
  dot?: boolean
  /** 状态点颜色语义，默认 primary */
  status?: BadgeStatus
  /** count 为 0 时是否仍然显示 */
  showZero?: boolean
  /** 包裹内容；存在时角标绝对定位在右上角，否则独立显示 */
  children?: ReactNode
}

const STATUS_LABEL: Record<BadgeStatus, string> = {
  primary: '状态：主要',
  success: '状态：成功',
  warning: '状态：警告',
  danger: '状态：危险',
  info: '状态：信息',
}

/**
 * 徽标 —— 支持数字、上限、小圆点、状态色以及包裹子元素时的右上角定位。
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    count,
    max = 99,
    dot = false,
    status = 'primary',
    showZero = false,
    className,
    children,
    ...rest
  },
  ref,
) {
  const attached = children !== undefined && children !== null
  const hasCount = typeof count === 'number'
  const visibleCount = hasCount && (showZero || count > 0)
  const showCount = visibleCount && !dot
  const showDot = dot || (!attached && !hasCount)
  const displayCount = hasCount && count > max ? `${max}+` : String(count ?? '')

  return (
    <span
      ref={ref}
      className={cx(
        'aelux-badge',
        `aelux-badge--${status}`,
        attached && 'aelux-badge--attached',
        className,
      )}
      {...rest}
    >
      {attached ? <span className="aelux-badge__content">{children}</span> : null}
      {showCount ? (
        <span className="aelux-badge__count" role="img" aria-label={`${count} 条未读`}>
          {displayCount}
        </span>
      ) : null}
      {showDot ? (
        <span className="aelux-badge__dot" role="img" aria-label={STATUS_LABEL[status]} />
      ) : null}
    </span>
  )
})

Badge.displayName = 'Badge'
