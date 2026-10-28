import { forwardRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { IconClose } from '../../icons'
import { cx } from '../../utils/cx'

export interface ChipItem {
  value: string
  label: ReactNode
  icon?: ReactNode
  disabled?: boolean
}

export interface ChipsProps {
  /** 可选项 */
  items: ChipItem[]
  /** 受控选中值 */
  value?: string[]
  /** 非受控默认选中值 */
  defaultValue?: string[]
  /** 选中值变化回调 */
  onChange?: (value: string[]) => void
  /** 是否多选，默认 true；单选时再次点击已选项会取消选择 */
  multiple?: boolean
  /** 是否显示移除按钮 */
  closable?: boolean
  /** 移除回调（closable 时生效） */
  onRemove?: (value: string) => void
  /** 尺寸，默认 md */
  size?: 'sm' | 'md'
  /** 占满整行 */
  block?: boolean
  /** 禁用整组 */
  disabled?: boolean
  /** 分组无障碍名称 */
  ariaLabel?: string
}

/**
 * 可选可移除标签组 —— 多选时选项为 checkbox，单选时为 radio；
 * Enter / Space 切换选中，Backspace 移除最近选中的可移除项。
 */
export const Chips = forwardRef<HTMLDivElement, ChipsProps>(function Chips(
  {
    items,
    value,
    defaultValue,
    onChange,
    multiple = true,
    closable = false,
    onRemove,
    size = 'md',
    block = false,
    disabled = false,
    ariaLabel = '标签选择',
  },
  ref,
) {
  const isControlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = useState<string[]>(() => defaultValue ?? [])
  const currentValue = isControlled ? value : uncontrolledValue

  const isSelected = (chipValue: string) => currentValue.includes(chipValue)

  const commit = (next: string[]) => {
    if (!isControlled) setUncontrolledValue(next)
    onChange?.(next)
  }

  const toggle = (item: ChipItem) => {
    if (disabled || item.disabled) return

    if (multiple) {
      commit(
        isSelected(item.value)
          ? currentValue.filter((entry) => entry !== item.value)
          : [...currentValue, item.value],
      )
      return
    }

    // 单选：再次点击已选项取消选择
    commit(isSelected(item.value) ? [] : [item.value])
  }

  const remove = (item: ChipItem) => {
    if (disabled || item.disabled) return
    if (isSelected(item.value)) {
      commit(currentValue.filter((entry) => entry !== item.value))
    }
    onRemove?.(item.value)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Backspace' || disabled || !closable) return

    // 优先删除最近选中的可移除项，否则删除最后一个可移除项
    const selected = items.filter((item) => !item.disabled && isSelected(item.value))
    const candidates = selected.length > 0 ? selected : items.filter((item) => !item.disabled)
    const target = candidates[candidates.length - 1]
    if (target == null) return

    event.preventDefault()
    remove(target)
  }

  return (
    <div
      ref={ref}
      role="group"
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      className={cx(
        'aelux-chips',
        `aelux-chips--${size}`,
        block && 'aelux-chips--block',
        disabled && 'aelux-chips--disabled',
        multiple ? 'aelux-chips--multiple' : 'aelux-chips--single',
      )}
      onKeyDown={handleKeyDown}
    >
      {items.map((item) => {
        const selected = isSelected(item.value)
        const itemDisabled = disabled || item.disabled
        const labelText = typeof item.label === 'string' ? item.label : item.value

        return (
          <span
            key={item.value}
            className={cx(
              'aelux-chips__chip',
              selected && 'aelux-chips__chip--selected',
              itemDisabled && 'aelux-chips__chip--disabled',
            )}
          >
            <button
              type="button"
              role={multiple ? 'checkbox' : 'radio'}
              aria-checked={selected}
              disabled={itemDisabled}
              className="aelux-chips__toggle"
              onClick={() => toggle(item)}
            >
              {item.icon != null ? (
                <span className="aelux-chips__icon" aria-hidden="true">
                  {item.icon}
                </span>
              ) : null}
              <span className="aelux-chips__label">{item.label}</span>
            </button>

            {closable ? (
              <button
                type="button"
                className="aelux-chips__remove"
                aria-label={`移除 ${labelText}`}
                disabled={itemDisabled}
                onClick={() => remove(item)}
              >
                <IconClose size={size === 'sm' ? 10 : 11} />
              </button>
            ) : null}
          </span>
        )
      })}
    </div>
  )
})

Chips.displayName = 'Chips'
