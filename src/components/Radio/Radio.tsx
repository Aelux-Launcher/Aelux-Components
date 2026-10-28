import { forwardRef } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** 标签内容 */
  label?: ReactNode
  /** 辅助说明 */
  description?: ReactNode
  /** 尺寸，默认 md */
  size?: 'sm' | 'md'
}

/**
 * 单选框 —— 原生 radio + 自定义圆形标记，同名同组时自动获得方向键支持。
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, description, size = 'md', className, disabled, ...rest },
  ref,
) {
  return (
    <label
      className={cx(
        'aelux-radio',
        `aelux-radio--${size}`,
        disabled && 'aelux-radio--disabled',
        className,
      )}
    >
      <input
        ref={ref}
        type="radio"
        className="aelux-radio__input"
        disabled={disabled}
        {...rest}
      />
      <span className="aelux-radio__box" aria-hidden="true">
        <span className="aelux-radio__dot" />
      </span>
      {label != null || description != null ? (
        <span className="aelux-radio__content">
          {label != null ? <span className="aelux-radio__label">{label}</span> : null}
          {description != null ? <span className="aelux-radio__desc">{description}</span> : null}
        </span>
      ) : null}
    </label>
  )
})

Radio.displayName = 'Radio'
