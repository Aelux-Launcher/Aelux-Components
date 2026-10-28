import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { IconLoader } from '../../icons'
import type { IconProps } from '../../icons'
import { cx } from '../../utils/cx'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'warning'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** 外观变体，默认 primary */
  variant?: ButtonVariant
  /** 尺寸，默认 md */
  size?: ButtonSize
  /** 撑满父容器宽度 */
  block?: boolean
  /** 加载中：显示转圈并禁止点击 */
  loading?: boolean
  /** 左侧图标 */
  leftIcon?: ReactNode
  /** 右侧图标 */
  rightIcon?: ReactNode
  /** 按钮文案 / 内容 */
  children?: ReactNode
}

/**
 * 按钮 —— 支持 6 种变体、3 种尺寸、加载态与图标。
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    block = false,
    loading = false,
    leftIcon,
    rightIcon,
    disabled,
    className,
    children,
    type = 'button',
    ...rest
  },
  ref,
) {
  const spinnerSize: IconProps['size'] = size === 'lg' ? 16 : size === 'sm' ? 12 : 14

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx(
        'aelux-btn',
        `aelux-btn--${variant}`,
        `aelux-btn--${size}`,
        block && 'aelux-btn--block',
        loading && 'aelux-btn--loading',
        className,
      )}
      {...rest}
    >
      {loading ? (
        <span className="aelux-btn__icon">
          <IconLoader size={spinnerSize} className="aelux-spin" />
        </span>
      ) : leftIcon ? (
        <span className="aelux-btn__icon">{leftIcon}</span>
      ) : null}
      {children == null ? null : <span className="aelux-btn__label">{children}</span>}
      {rightIcon && !loading ? <span className="aelux-btn__icon">{rightIcon}</span> : null}
    </button>
  )
})

Button.displayName = 'Button'
