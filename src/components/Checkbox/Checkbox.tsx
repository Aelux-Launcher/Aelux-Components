import { forwardRef, useEffect, useMemo, useRef } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { IconCheck, IconMinus } from '../../icons'
import { cx } from '../../utils/cx'
import { composeRefs } from '../../utils/composeRefs'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** 标签内容 */
  label?: ReactNode
  /** 辅助说明 */
  description?: ReactNode
  /** 半选态 */
  indeterminate?: boolean
  /** 尺寸，默认 md */
  size?: 'sm' | 'md'
  /** 展示变体，默认 default；card 为卡片式两行说明复选框 */
  variant?: 'default' | 'card'
}

/**
 * 复选框 —— 原生 input + 自定义勾选框，支持半选态与说明文字。
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, indeterminate = false, size = 'md', variant = 'default', className, disabled, checked, defaultChecked, ...rest },
  ref,
) {
  const innerRef = useRef<HTMLInputElement | null>(null)
  const setRef = useMemo(() => composeRefs(innerRef, ref), [ref])

  useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = indeterminate
  }, [indeterminate])

  const iconSize = size === 'sm' ? 10 : 12

  return (
    <label
      className={cx(
        'aelux-checkbox',
        `aelux-checkbox--${size}`,
        variant === 'card' && 'aelux-checkbox--card',
        indeterminate && 'aelux-checkbox--indeterminate',
        disabled && 'aelux-checkbox--disabled',
        className,
      )}
    >
      <input
        ref={setRef}
        type="checkbox"
        className="aelux-checkbox__input"
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        aria-checked={indeterminate ? 'mixed' : undefined}
        {...rest}
      />
      <span className="aelux-checkbox__box" aria-hidden="true">
        <span className="aelux-checkbox__icon aelux-checkbox__icon--check">
          <IconCheck size={iconSize} />
        </span>
        <span className="aelux-checkbox__icon aelux-checkbox__icon--dash">
          <IconMinus size={iconSize} />
        </span>
      </span>
      {label != null || description != null ? (
        <span className="aelux-checkbox__content">
          {label != null ? <span className="aelux-checkbox__label">{label}</span> : null}
          {description != null ? <span className="aelux-checkbox__desc">{description}</span> : null}
        </span>
      ) : null}
    </label>
  )
})

Checkbox.displayName = 'Checkbox'
