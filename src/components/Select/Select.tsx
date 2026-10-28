import { forwardRef, useState } from 'react'
import type { ChangeEvent, ReactNode, SelectHTMLAttributes } from 'react'
import { IconChevronDown } from '../../icons'
import { cx } from '../../utils/cx'

export interface SelectOption {
  label: ReactNode
  value: string
  disabled?: boolean
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children' | 'size' | 'value' | 'defaultValue' | 'onChange'> {
  /** 选项列表 */
  options: SelectOption[]
  /** 尺寸，默认 md */
  size?: 'sm' | 'md' | 'lg'
  /** 校验状态 */
  status?: 'default' | 'error'
  /** 受控值 */
  value?: string
  /** 非受控默认值 */
  defaultValue?: string
  /** 占位文案（value 为空时显示） */
  placeholder?: string
  /** 值变化回调 */
  onValueChange?: (value: string) => void
  /** 撑满父容器宽度 */
  block?: boolean
}

/**
 * 下拉选择 —— 保留原生 select 的可访问性，仅替换外观并叠加自定义箭头。
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    options,
    size = 'md',
    status = 'default',
    value,
    defaultValue,
    placeholder,
    onValueChange,
    block = false,
    className,
    disabled,
    ...rest
  },
  ref,
) {
  const isControlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = useState<string>(() => defaultValue ?? '')
  const currentValue = isControlled ? (value ?? '') : uncontrolledValue
  const showPlaceholder = currentValue === '' && placeholder != null
  const arrowSize = size === 'lg' ? 16 : size === 'sm' ? 12 : 14

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const next = event.currentTarget.value
    if (!isControlled) setUncontrolledValue(next)
    onValueChange?.(next)
  }

  return (
    <div
      className={cx(
        'aelux-select',
        `aelux-select--${size}`,
        status !== 'default' && `aelux-select--${status}`,
        showPlaceholder && 'aelux-select--placeholder',
        disabled && 'aelux-select--disabled',
        block && 'aelux-select--block',
        className,
      )}
    >
      <select
        ref={ref}
        className="aelux-select__native"
        value={isControlled ? value : undefined}
        defaultValue={isControlled ? undefined : defaultValue}
        disabled={disabled}
        aria-invalid={status === 'error' || undefined}
        onChange={handleChange}
        {...rest}
      >
        {placeholder != null ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="aelux-select__arrow" aria-hidden="true">
        <IconChevronDown size={arrowSize} />
      </span>
    </div>
  )
})

Select.displayName = 'Select'
