import { forwardRef } from 'react'
import type { HTMLAttributes, MouseEvent, ReactNode } from 'react'
import { IconClose } from '../../icons'
import { cx } from '../../utils/cx'

export type TagColor = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
export type TagSize = 'sm' | 'md'
export type TagVariant = 'soft' | 'solid' | 'outline'

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  /** 颜色语义，默认 neutral */
  color?: TagColor
  /** 尺寸，默认 md */
  size?: TagSize
  /** 外观，默认 soft */
  variant?: TagVariant
  /** 是否显示关闭按钮 */
  closable?: boolean
  /** 关闭按钮回调（closable 时有效） */
  onClose?: () => void
  /** 前置图标 */
  icon?: ReactNode
}

/**
 * 标签 —— 6 种语义色 × soft / solid / outline 三种外观。
 */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  {
    color = 'neutral',
    size = 'md',
    variant = 'soft',
    closable = false,
    onClose,
    icon,
    className,
    children,
    ...rest
  },
  ref,
) {
  const handleClose = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    onClose?.()
  }

  return (
    <span
      ref={ref}
      className={cx(
        'aelux-tag',
        `aelux-tag--${color}`,
        `aelux-tag--${variant}`,
        `aelux-tag--${size}`,
        className,
      )}
      {...rest}
    >
      {icon ? <span className="aelux-tag__icon">{icon}</span> : null}
      {children === undefined || children === null ? null : (
        <span className="aelux-tag__label">{children}</span>
      )}
      {closable ? (
        <button
          type="button"
          className="aelux-tag__close"
          aria-label="移除标签"
          onClick={handleClose}
        >
          <IconClose size={size === 'sm' ? 10 : 12} />
        </button>
      ) : null}
    </span>
  )
})

Tag.displayName = 'Tag'
