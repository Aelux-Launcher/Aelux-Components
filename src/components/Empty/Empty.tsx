import { forwardRef } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface EmptyProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 标题，默认「暂无数据」 */
  title?: ReactNode
  /** 描述 */
  description?: ReactNode
  /** 自定义插画 / 图标 */
  icon?: ReactNode
  /** 操作按钮 */
  action?: ReactNode
  /** 尺寸，默认 md */
  size?: 'sm' | 'md'
}

/** 空状态内置插画：轻量内联 SVG，颜色全部走 tokens。 */
function EmptyIllustration() {
  return (
    <svg
      className="aelux-empty__illustration"
      width="120"
      height="96"
      viewBox="0 0 120 96"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <ellipse className="aelux-empty__shadow" cx="60" cy="85" rx="32" ry="6" />
      <rect className="aelux-empty__card" x="26" y="17" width="68" height="57" rx="10" />
      <path className="aelux-empty__line" d="M42 36h36M42 46h24M42 58h14" />
      <circle className="aelux-empty__dot" cx="89" cy="25" r="4" />
      <path className="aelux-empty__spark" d="M20 28v9M15.5 32.5h9" />
    </svg>
  )
}

/**
 * 空状态 —— 内置轻量插画，支持自定义图标、描述与操作区。
 */
export const Empty = forwardRef<HTMLDivElement, EmptyProps>(function Empty(
  { title = '暂无数据', description, icon, action, size = 'md', className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx('aelux-empty', `aelux-empty--${size}`, className)}
      {...rest}
    >
      <div className="aelux-empty__art">{icon ?? <EmptyIllustration />}</div>
      {title != null ? <div className="aelux-empty__title">{title}</div> : null}
      {description != null ? <div className="aelux-empty__description">{description}</div> : null}
      {action != null ? <div className="aelux-empty__action">{action}</div> : null}
    </div>
  )
})

Empty.displayName = 'Empty'
