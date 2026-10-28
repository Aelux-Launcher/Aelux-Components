import { forwardRef, useId, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { IconCheck } from '../../icons'
import { cx } from '../../utils/cx'

export interface ListBoxOption {
  key: string
  label: ReactNode
  description?: ReactNode
  icon?: ReactNode
  badge?: ReactNode
  disabled?: boolean
}

export interface ListBoxProps {
  options: ListBoxOption[]
  value?: string | string[]
  defaultValue?: string | string[]
  onValueChange?: (value: string | string[]) => void
  multiple?: boolean
  size?: 'sm' | 'md'
  height?: number | string
  emptyText?: ReactNode
  disabled?: boolean
  ariaLabel?: string
  className?: string
}

const toKeyArray = (value: string | string[] | undefined): string[] => {
  if (value == null) return []
  return Array.isArray(value) ? value : [value]
}

const toMaxHeight = (height: number | string): string =>
  typeof height === 'number' ? `${height}px` : height

/**
 * 可选列表 —— 单选 / 多选、受控 / 非受控，支持方向键、Home / End、Space / Enter。
 */
export const ListBox = forwardRef<HTMLDivElement, ListBoxProps>(function ListBox(
  {
    options,
    value,
    defaultValue,
    onValueChange,
    multiple = false,
    size = 'md',
    height,
    emptyText = '暂无选项',
    disabled = false,
    ariaLabel,
    className,
  },
  ref,
) {
  const baseId = useId()
  const isControlled = value !== undefined
  const [uncontrolledKeys, setUncontrolledKeys] = useState<string[]>(() => toKeyArray(defaultValue))
  const selectedKeys = isControlled ? toKeyArray(value) : uncontrolledKeys
  const selectedSet = useMemo(() => new Set(selectedKeys), [selectedKeys])

  const optionRefs = useRef<Array<HTMLDivElement | null>>([])
  const [activeIndex, setActiveIndex] = useState<number>(-1)

  const enabledIndexes = useMemo(() => {
    const indexes: number[] = []
    options.forEach((option, index) => {
      if (!option.disabled) indexes.push(index)
    })
    return indexes
  }, [options])

  const firstEnabledIndex = enabledIndexes.length > 0 ? enabledIndexes[0] : -1
  const lastEnabledIndex = enabledIndexes.length > 0 ? enabledIndexes[enabledIndexes.length - 1] : -1
  const selectedIndex = options.findIndex(
    (option) => !option.disabled && selectedSet.has(option.key),
  )
  const tabbableIndex =
    activeIndex >= 0 && activeIndex < options.length && !options[activeIndex]?.disabled
      ? activeIndex
      : selectedIndex >= 0
        ? selectedIndex
        : firstEnabledIndex

  const focusOption = (index: number) => {
    if (index < 0) return
    setActiveIndex(index)
    const node = optionRefs.current[index]
    node?.focus()
    node?.scrollIntoView({ block: 'nearest' })
  }

  const step = (from: number, delta: 1 | -1): number => {
    if (enabledIndexes.length === 0) return -1
    const total = options.length
    let index = from
    for (let count = 0; count < total; count += 1) {
      index = (index + delta + total) % total
      if (!options[index]?.disabled) return index
    }
    return from
  }

  const commit = (keys: string[]) => {
    if (!isControlled) setUncontrolledKeys(keys)
    onValueChange?.(multiple ? keys : (keys[0] ?? ''))
  }

  const selectOption = (index: number) => {
    const option = options[index]
    if (!option || option.disabled || disabled) return
    if (multiple) {
      commit(
        selectedSet.has(option.key)
          ? selectedKeys.filter((key) => key !== option.key)
          : [...selectedKeys, option.key],
      )
      return
    }
    if (selectedSet.has(option.key)) return
    commit([option.key])
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled || options.length === 0) return
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        focusOption(step(tabbableIndex, 1))
        break
      case 'ArrowUp':
        event.preventDefault()
        focusOption(step(tabbableIndex, -1))
        break
      case 'Home':
        event.preventDefault()
        focusOption(firstEnabledIndex)
        break
      case 'End':
        event.preventDefault()
        focusOption(lastEnabledIndex)
        break
      case ' ':
      case 'Enter':
        event.preventDefault()
        if (tabbableIndex >= 0) selectOption(tabbableIndex)
        break
      default:
        break
    }
  }

  return (
    <div
      ref={ref}
      role="listbox"
      aria-label={ariaLabel}
      aria-multiselectable={multiple ? true : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={-1}
      className={cx(
        'aelux-listbox',
        `aelux-listbox--${size}`,
        disabled && 'aelux-listbox--disabled',
        className,
      )}
      style={height != null ? { maxHeight: toMaxHeight(height) } : undefined}
      onKeyDown={handleKeyDown}
    >
      {options.length === 0 ? (
        <div className="aelux-listbox__empty" role="presentation">
          {emptyText}
        </div>
      ) : (
        options.map((option, index) => {
          const isSelected = selectedSet.has(option.key)
          const isDisabled = disabled || option.disabled === true
          return (
            <div
              key={option.key}
              ref={(node) => {
                optionRefs.current[index] = node
              }}
              id={`${baseId}-option-${index}`}
              role="option"
              aria-selected={isSelected}
              aria-disabled={isDisabled || undefined}
              tabIndex={isDisabled ? -1 : index === tabbableIndex ? 0 : -1}
              className={cx(
                'aelux-listbox__option',
                `aelux-listbox__option--${size}`,
                isSelected && 'aelux-listbox__option--selected',
                isDisabled && 'aelux-listbox__option--disabled',
              )}
              onClick={() => {
                setActiveIndex(index)
                selectOption(index)
              }}
            >
              {option.icon != null ? (
                <span className="aelux-listbox__icon" aria-hidden="true">
                  {option.icon}
                </span>
              ) : null}
              <span className="aelux-listbox__content">
                <span className="aelux-listbox__label">{option.label}</span>
                {option.description != null ? (
                  <span className="aelux-listbox__description">{option.description}</span>
                ) : null}
              </span>
              {option.badge != null ? (
                <span className="aelux-listbox__badge">{option.badge}</span>
              ) : null}
              {isSelected ? (
                <span className="aelux-listbox__check" aria-hidden="true">
                  <IconCheck size={size === 'sm' ? 12 : 14} />
                </span>
              ) : null}
            </div>
          )
        })
      )}
    </div>
  )
})

ListBox.displayName = 'ListBox'
