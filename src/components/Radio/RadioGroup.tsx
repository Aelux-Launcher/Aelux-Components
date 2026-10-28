import { forwardRef, useId, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { cx } from '../../utils/cx'
import { Radio } from './Radio'

export interface RadioOption {
  label: ReactNode
  value: string
  disabled?: boolean
  description?: ReactNode
}

export interface RadioGroupProps {
  /** 表单名 */
  name?: string
  /** 受控值 */
  value?: string
  /** 非受控默认值 */
  defaultValue?: string
  /** 选项列表 */
  options: RadioOption[]
  /** 值变化回调 */
  onChange?: (value: string) => void
  /** 排列方向，默认 horizontal */
  direction?: 'horizontal' | 'vertical'
  /** 间距 */
  gap?: number | string
  /** 禁用整组 */
  disabled?: boolean
  className?: string
  /** 无障碍分组名称（radiogroup 的 aria-label） */
  ariaLabel?: string
}

/**
 * 单选组 —— 统一管理 name / 受控值 / 禁用，选项渲染为 Radio。
 */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  {
    name,
    value,
    defaultValue,
    options,
    onChange,
    direction = 'horizontal',
    gap,
    disabled = false,
    className,
    ariaLabel,
  },
  ref,
) {
  const autoName = useId()
  const groupName = name ?? autoName

  const isControlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = useState<string>(() => defaultValue ?? '')
  const currentValue = isControlled ? value : uncontrolledValue

  const style: CSSProperties | undefined =
    gap == null ? undefined : { gap: typeof gap === 'number' ? `${gap}px` : gap }

  const handleChange = (next: string) => {
    if (!isControlled) setUncontrolledValue(next)
    onChange?.(next)
  }

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      className={cx(
        'aelux-radio-group',
        `aelux-radio-group--${direction}`,
        disabled && 'aelux-radio-group--disabled',
        className,
      )}
      style={style}
    >
      {options.map((option) => (
        <Radio
          key={option.value}
          name={groupName}
          value={option.value}
          label={option.label}
          description={option.description}
          disabled={disabled || option.disabled}
          checked={currentValue === option.value}
          onChange={() => handleChange(option.value)}
        />
      ))}
    </div>
  )
})

RadioGroup.displayName = 'RadioGroup'
