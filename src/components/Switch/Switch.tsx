import { forwardRef, useState } from 'react'
import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'type' | 'value'> {
  /** 受控值 */
  checked?: boolean
  /** 非受控默认值 */
  defaultChecked?: boolean
  /** 值变化回调 */
  onChange?: (checked: boolean) => void
  /** 尺寸，默认 md */
  size?: 'sm' | 'md'
  /** 标签内容 */
  label?: ReactNode
  /** 辅助说明 */
  description?: ReactNode
}

/**
 * 开关 —— 基于原生 button（role="switch"），Space / Enter 均可切换。
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    checked,
    defaultChecked = false,
    onChange,
    size = 'md',
    label,
    description,
    disabled,
    className,
    onClick,
    ...rest
  },
  ref,
) {
  const isControlled = checked !== undefined
  const [uncontrolledChecked, setUncontrolledChecked] = useState<boolean>(defaultChecked)
  const currentChecked = isControlled ? checked : uncontrolledChecked

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (event.defaultPrevented || disabled) return
    const next = !currentChecked
    if (!isControlled) setUncontrolledChecked(next)
    onChange?.(next)
  }

  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={currentChecked}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      className={cx(
        'aelux-switch',
        `aelux-switch--${size}`,
        currentChecked && 'aelux-switch--checked',
        disabled && 'aelux-switch--disabled',
        className,
      )}
      onClick={handleClick}
      {...rest}
    >
      <span className="aelux-switch__track" aria-hidden="true">
        <span className="aelux-switch__thumb" />
      </span>
      {label != null || description != null ? (
        <span className="aelux-switch__content">
          {label != null ? <span className="aelux-switch__label">{label}</span> : null}
          {description != null ? <span className="aelux-switch__desc">{description}</span> : null}
        </span>
      ) : null}
    </button>
  )
})

Switch.displayName = 'Switch'
