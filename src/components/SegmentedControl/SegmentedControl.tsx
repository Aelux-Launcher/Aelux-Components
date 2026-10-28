import { forwardRef, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface SegmentedOption {
  value: string
  label: ReactNode
  icon?: ReactNode
  disabled?: boolean
}

export interface SegmentedControlProps {
  /** 分段选项 */
  options: SegmentedOption[]
  /** 受控值 */
  value?: string
  /** 非受控默认值 */
  defaultValue?: string
  /** 选中值变化回调 */
  onValueChange?: (value: string) => void
  size?: 'sm' | 'md'
  /** 撑满父容器宽度 */
  block?: boolean
  disabled?: boolean
  /** 分段组无障碍名称 */
  ariaLabel?: string
  className?: string
}

/**
 * 分段控制 —— role=radiogroup + role=radio，支持 ←→/↑↓/Home/End 键盘切换。
 */
export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(function SegmentedControl(
  { options, value, defaultValue, onValueChange, size = 'md', block = false, disabled = false, ariaLabel, className },
  ref,
) {
  const isControlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = useState<string>(() => defaultValue ?? '')
  const current = isControlled ? (value ?? '') : uncontrolledValue
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([])

  const selectedIndex = options.findIndex((option) => option.value === current)
  const tabbableIndex = (() => {
    if (disabled) return -1
    if (selectedIndex >= 0 && !options[selectedIndex].disabled) return selectedIndex
    return options.findIndex((option) => !option.disabled)
  })()

  const select = (next: string) => {
    if (!isControlled) setUncontrolledValue(next)
    onValueChange?.(next)
  }

  const findEnabled = (from: number, direction: 1 | -1): number => {
    for (let count = 1; count <= options.length; count += 1) {
      const index = (((from + direction * count) % options.length) + options.length) % options.length
      if (!options[index].disabled) return index
    }
    return -1
  }

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (disabled) return
    const key = event.key
    const isArrow =
      key === 'ArrowRight' || key === 'ArrowLeft' || key === 'ArrowDown' || key === 'ArrowUp'
    if (!isArrow && key !== 'Home' && key !== 'End') return
    event.preventDefault()

    const focusedIndex = itemRefs.current.findIndex((item) => item === document.activeElement)
    const baseIndex = focusedIndex >= 0 ? focusedIndex : selectedIndex >= 0 ? selectedIndex : 0

    let nextIndex = -1
    if (key === 'Home') {
      nextIndex = options.findIndex((option) => !option.disabled)
    } else if (key === 'End') {
      nextIndex = options.reduce((result, option, index) => (option.disabled ? result : index), -1)
    } else {
      nextIndex = findEnabled(baseIndex, key === 'ArrowRight' || key === 'ArrowDown' ? 1 : -1)
    }
    if (nextIndex < 0) return

    itemRefs.current[nextIndex]?.focus()
    const nextOption = options[nextIndex]
    if (nextOption && !nextOption.disabled) select(nextOption.value)
  }

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={ariaLabel ?? '分段选择'}
      aria-disabled={disabled || undefined}
      className={cx(
        'aelux-segmented',
        `aelux-segmented--${size}`,
        block && 'aelux-segmented--block',
        disabled && 'aelux-segmented--disabled',
        className,
      )}
      onKeyDown={handleKeyDown}
    >
      {options.map((option, index) => {
        const checked = option.value === current
        return (
          <button
            key={option.value}
            ref={(element) => {
              itemRefs.current[index] = element
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            disabled={disabled || option.disabled}
            tabIndex={index === tabbableIndex ? 0 : -1}
            className={cx('aelux-segmented__item', checked && 'aelux-segmented__item--checked')}
            onClick={() => {
              if (!disabled && !option.disabled && !checked) select(option.value)
            }}
          >
            {option.icon != null ? (
              <span className="aelux-segmented__icon" aria-hidden="true">
                {option.icon}
              </span>
            ) : null}
            <span className="aelux-segmented__label">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
})

SegmentedControl.displayName = 'SegmentedControl'
