import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { IconLoader } from '../../icons'
import { cx } from '../../utils/cx'

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** 无障碍标签（必填，用于 aria-label） */
  label: string
  /** 图标内容 */
  icon: ReactNode
  /** 尺寸，默认 md */
  size?: 'sm' | 'md' | 'lg'
  /** 外观变体，默认 secondary */
  variant?: 'primary' | 'secondary' | 'ghost'
  /** 加载中 */
  loading?: boolean
}

/**
 * 图标按钮 —— 只含图标的方形按钮，必须提供 label 作为无障碍名称。
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  {
    label,
    icon,
    size = 'md',
    variant = 'secondary',
    loading = false,
    disabled,
    className,
    type = 'button',
    ...rest
  },
  ref,
) {
  const spinnerSize = size === 'lg' ? 20 : size === 'sm' ? 14 : 16

  return (
    <button
      ref={ref}
      type={type}
      className={cx(
        'aelux-icon-btn',
        `aelux-icon-btn--${variant}`,
        `aelux-icon-btn--${size}`,
        loading && 'aelux-icon-btn--loading',
        className,
      )}
      aria-label={label}
      aria-busy={loading || undefined}
      aria-disabled={disabled || loading || undefined}
      disabled={disabled || loading}
      {...rest}
    >
      <span className="aelux-icon-btn__icon">
        {loading ? <IconLoader size={spinnerSize} className="aelux-spin" /> : icon}
      </span>
    </button>
  )
})

IconButton.displayName = 'IconButton'
