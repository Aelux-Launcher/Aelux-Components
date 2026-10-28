import { forwardRef, useId, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { cx } from '../../utils/cx'
import { Radio } from './Radio'

export interface RadioOption {
  label: ReactNode
  value: string
  disabled?: boolean
  description?: ReactNode
  /** 卡片变体左上角图标 */
  icon?: ReactNode
  /** 卡片变体标题右侧徽标 */
  badge?: ReactNode
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
  /** 展示变体，默认 default；card 为卡片式单选 */
  variant?: 'default' | 'card'
  /** 卡片变体的列数（仅 variant=card 生效） */
  columns?: number
}

/**
 * 单选组 —— 统一管理 name / 受控值 / 禁用，选项渲染为 Radio。
 * variant="card" 时渲染卡片式单选（图标 + 标题 + 说明 + 徽标），支持 columns 多列网格。
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
    variant = 'default',
    columns,
  },
  ref,
) {
  const autoName = useId()
  const groupName = name ?? autoName

  const isControlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = useState<string>(() => defaultValue ?? '')
  const currentValue = isControlled ? value : uncontrolledValue

  const isCard = variant === 'card'
  const cardColumns = isCard && columns != null && columns > 0 ? Math.floor(columns) : undefined

  let style: CSSProperties | undefined
  if (gap != null) {
    style = { gap: typeof gap === 'number' ? `${gap}px` : gap }
  }
  if (cardColumns != null) {
    style = { ...style, gridTemplateColumns: `repeat(${cardColumns}, minmax(0, 1fr))` }
  }

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
        !isCard && `aelux-radio-group--${direction}`,
        isCard && 'aelux-radio-group--card',
        !isCard && disabled && 'aelux-radio-group--disabled',
        className,
      )}
      style={style}
    >
      {isCard
        ? options.map((option) => {
            const optionDisabled = disabled || option.disabled
            const selected = currentValue === option.value

            return (
              <label
                key={option.value}
                className={cx(
                  'aelux-radio-card',
                  selected && 'aelux-radio-card--checked',
                  optionDisabled && 'aelux-radio-card--disabled',
                )}
              >
                <input
                  type="radio"
                  name={groupName}
                  value={option.value}
                  checked={selected}
                  disabled={optionDisabled}
                  className="aelux-radio-card__input"
                  onChange={() => handleChange(option.value)}
                />
                <span className="aelux-radio-card__inner">
                  {option.icon != null ? (
                    <span className="aelux-radio-card__icon" aria-hidden="true">
                      {option.icon}
                    </span>
                  ) : null}
                  <span className="aelux-radio-card__body">
                    <span className="aelux-radio-card__head">
                      <span className="aelux-radio-card__label">{option.label}</span>
                      {option.badge != null ? (
                        <span className="aelux-radio-card__badge">{option.badge}</span>
                      ) : null}
                    </span>
                    {option.description != null ? (
                      <span className="aelux-radio-card__desc">{option.description}</span>
                    ) : null}
                  </span>
                  <span className="aelux-radio-card__indicator" aria-hidden="true">
                    <span className="aelux-radio-card__dot" />
                  </span>
                </span>
              </label>
            )
          })
        : options.map((option) => (
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
