import { forwardRef, useEffect, useId, useMemo, useRef, useState } from 'react'
import type {
  ChangeEvent,
  FocusEvent as ReactFocusEvent,
  KeyboardEvent as ReactKeyboardEvent,
  ReactNode,
} from 'react'
import { IconCheck, IconChevronDown, IconClose } from '../../icons'
import { cx } from '../../utils/cx'
import { composeRefs } from '../../utils/composeRefs'

export interface MultiSelectOption {
  value: string
  label: ReactNode
  description?: ReactNode
  disabled?: boolean
}

export interface MultiSelectProps {
  options: MultiSelectOption[]
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  placeholder?: string
  searchable?: boolean
  /** 输入框内最多展示的已选数量，默认 2 */
  maxDisplay?: number
  emptyText?: ReactNode
  disabled?: boolean
  block?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
  ariaLabel?: string
  /** 控件 id（便于与 FormItem 的 htmlFor 关联） */
  id?: string
}

interface SelectedChip {
  value: string
  label: ReactNode
  text: string
  disabled: boolean
}

function optionText(option: MultiSelectOption): string | null {
  if (typeof option.label === 'string') return option.label
  if (typeof option.label === 'number') return String(option.label)
  return null
}

function chipText(label: ReactNode, fallback: string): string {
  if (typeof label === 'string') return label
  if (typeof label === 'number') return String(label)
  return fallback
}

/**
 * 多选下拉 —— 点开浮层勾选，已选项以 Chip 展示（超出 maxDisplay 折叠为 +N）。
 * 支持输入过滤（searchable）、↑↓/Enter/Space/Escape/Home/End 键盘操作、Backspace 删除最近一项。
 */
export const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(function MultiSelect(
  {
    options,
    value,
    defaultValue,
    onValueChange,
    placeholder,
    searchable = true,
    maxDisplay = 2,
    emptyText,
    disabled = false,
    block = false,
    size = 'md',
    className,
    ariaLabel,
    id,
  },
  ref,
) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const setRef = useMemo(() => composeRefs(wrapperRef, ref), [ref])
  const fieldRef = useRef<HTMLInputElement | null>(null)
  const optionRefs = useRef<Array<HTMLLIElement | null>>([])
  const listId = useId()

  const isControlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = useState<string[]>(() => defaultValue ?? [])
  const currentValue = isControlled ? (value ?? []) : uncontrolledValue

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)

  const filtered = useMemo(() => {
    if (!searchable) return options
    const keyword = query.trim().toLowerCase()
    if (keyword === '') return options
    return options.filter((option) => {
      const text = optionText(option)
      return (
        option.value.toLowerCase().includes(keyword) || (text != null && text.toLowerCase().includes(keyword))
      )
    })
  }, [options, query, searchable])

  const selectedChips = useMemo<SelectedChip[]>(
    () =>
      currentValue.map((selectedValue) => {
        const option = options.find((item) => item.value === selectedValue)
        return {
          value: selectedValue,
          label: option?.label ?? selectedValue,
          text: chipText(option?.label, selectedValue),
          disabled: option?.disabled ?? false,
        }
      }),
    [options, currentValue],
  )

  const displayLimit = Math.max(0, Math.floor(maxDisplay))
  const visibleChips = selectedChips.slice(0, displayLimit)
  const hiddenCount = selectedChips.length - visibleChips.length

  const optionId = (index: number) => `${listId}-option-${index}`
  const iconSize = size === 'lg' ? 16 : size === 'sm' ? 12 : 14
  const checkSize = size === 'sm' ? 9 : 11

  useEffect(() => {
    if (!open) return
    setActiveIndex(() => {
      const selectedIndex = filtered.findIndex(
        (option) => currentValue.includes(option.value) && !option.disabled,
      )
      if (selectedIndex >= 0) return selectedIndex
      return filtered.findIndex((option) => !option.disabled)
    })
  }, [open, filtered, currentValue])

  useEffect(() => {
    if (!open || activeIndex < 0) return
    optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' })
  }, [open, activeIndex])

  useEffect(() => {
    if (!open) return
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target
      if (target instanceof Node && wrapperRef.current?.contains(target)) return
      setOpen(false)
      setQuery('')
      setActiveIndex(-1)
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [open])

  const focusField = () => fieldRef.current?.focus()

  const openList = () => {
    if (disabled) return
    setOpen(true)
  }

  const closeList = () => {
    setOpen(false)
    setQuery('')
    setActiveIndex(-1)
  }

  const commitValue = (next: string[]) => {
    if (!isControlled) setUncontrolledValue(next)
    onValueChange?.(next)
  }

  const toggleOption = (option: MultiSelectOption) => {
    if (disabled || option.disabled) return
    const selected = currentValue.includes(option.value)
    const next = selected
      ? currentValue.filter((item) => item !== option.value)
      : [...currentValue, option.value]
    commitValue(next)
    if (searchable) setQuery('')
  }

  const removeValue = (target: string) => {
    if (disabled) return
    commitValue(currentValue.filter((item) => item !== target))
    focusField()
  }

  const removeLastSelected = () => {
    const removable = [...selectedChips].reverse().find((chip) => !chip.disabled)
    if (removable) removeValue(removable.value)
  }

  const moveActive = (direction: 1 | -1) => {
    if (filtered.length === 0) return
    let index = activeIndex
    for (let count = 0; count < filtered.length; count += 1) {
      index = (index + direction + filtered.length) % filtered.length
      if (!filtered[index].disabled) {
        setActiveIndex(index)
        return
      }
    }
  }

  const moveEdge = (edge: 'first' | 'last') => {
    if (filtered.length === 0) return
    const indexes = filtered.map((_, index) => index)
    const ordered = edge === 'first' ? indexes : indexes.reverse()
    const target = ordered.find((index) => !filtered[index].disabled)
    if (target != null) setActiveIndex(target)
  }

  const toggleActive = () => {
    const activeOption = activeIndex >= 0 ? filtered[activeIndex] : undefined
    const target = activeOption?.disabled ? undefined : activeOption
    const option = target ?? filtered.find((item) => !item.disabled)
    if (option) toggleOption(option)
  }

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (open) moveActive(1)
      else openList()
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (open) moveActive(-1)
      else openList()
    } else if (event.key === 'Home' && open) {
      event.preventDefault()
      moveEdge('first')
    } else if (event.key === 'End' && open) {
      event.preventDefault()
      moveEdge('last')
    } else if (event.key === 'Enter') {
      event.preventDefault()
      if (open) toggleActive()
      else openList()
    } else if (event.key === ' ') {
      if (!open) {
        event.preventDefault()
        openList()
      } else if (!searchable) {
        event.preventDefault()
        toggleActive()
      }
    } else if (event.key === 'Escape') {
      if (open) {
        event.preventDefault()
        closeList()
        focusField()
      }
    } else if (event.key === 'Backspace') {
      if ((!searchable || query === '') && currentValue.length > 0) {
        event.preventDefault()
        removeLastSelected()
      }
    } else if (event.key === 'Tab') {
      closeList()
    }
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!searchable) return
    setQuery(event.currentTarget.value)
    if (!open) setOpen(true)
  }

  const handleWrapperBlur = (event: ReactFocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget
    if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) return
    closeList()
  }

  return (
    <div
      ref={setRef}
      className={cx(
        'aelux-multiselect',
        `aelux-multiselect--${size}`,
        open && 'aelux-multiselect--open',
        disabled && 'aelux-multiselect--disabled',
        block && 'aelux-multiselect--block',
        className,
      )}
      onBlur={handleWrapperBlur}
    >
      <div
        className="aelux-multiselect__control"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            event.preventDefault()
            focusField()
          }
        }}
      >
        <div
          className="aelux-multiselect__chips"
          onMouseDown={(event) => {
            if (event.target instanceof HTMLInputElement) return
            if (event.target instanceof Element && event.target.closest('.aelux-multiselect__chip-remove') != null) {
              return
            }
            event.preventDefault()
            focusField()
          }}
        >
          {visibleChips.map((chip) => (
            <span
              key={chip.value}
              className={cx(
                'aelux-multiselect__chip',
                chip.disabled && 'aelux-multiselect__chip--disabled',
              )}
            >
              <span className="aelux-multiselect__chip-label">{chip.label}</span>
              {!disabled && !chip.disabled ? (
                <button
                  type="button"
                  tabIndex={-1}
                  className="aelux-multiselect__chip-remove"
                  aria-label={`移除 ${chip.text}`}
                  onMouseDown={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                  }}
                  onClick={(event) => {
                    event.stopPropagation()
                    removeValue(chip.value)
                  }}
                >
                  <IconClose size={size === 'sm' ? 8 : 10} />
                </button>
              ) : null}
            </span>
          ))}
          {hiddenCount > 0 ? (
            <span className="aelux-multiselect__count" aria-label={`另有 ${hiddenCount} 项已选`}>
              +{hiddenCount}
            </span>
          ) : null}
          <input
            ref={fieldRef}
            id={id}
            type="text"
            role="combobox"
            autoComplete="off"
            readOnly={!searchable}
            className="aelux-multiselect__field"
            value={searchable ? query : ''}
            placeholder={currentValue.length === 0 ? (placeholder ?? '请选择') : ''}
            disabled={disabled}
            aria-label={ariaLabel ?? '选择选项'}
            aria-expanded={open}
            aria-controls={open ? listId : undefined}
            aria-activedescendant={open && activeIndex >= 0 ? optionId(activeIndex) : undefined}
            aria-autocomplete={searchable ? 'list' : 'none'}
            aria-haspopup="listbox"
            onFocus={openList}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        <span className="aelux-multiselect__actions">
          <button
            type="button"
            tabIndex={-1}
            className="aelux-multiselect__toggle"
            aria-label={open ? '收起选项' : '展开选项'}
            disabled={disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              if (open) closeList()
              else openList()
              focusField()
            }}
          >
            <IconChevronDown size={iconSize} />
          </button>
        </span>
      </div>
      {open ? (
        <ul
          className="aelux-multiselect__list"
          role="listbox"
          id={listId}
          aria-label={ariaLabel ?? '选项列表'}
          aria-multiselectable="true"
        >
          {filtered.length === 0 ? (
            <li className="aelux-multiselect__status" role="presentation">
              {emptyText ?? '无匹配选项'}
            </li>
          ) : (
            filtered.map((option, index) => {
              const selected = currentValue.includes(option.value)
              return (
                <li
                  key={option.value}
                  id={optionId(index)}
                  ref={(element) => {
                    optionRefs.current[index] = element
                  }}
                  role="option"
                  aria-selected={selected}
                  aria-disabled={option.disabled || undefined}
                  className={cx(
                    'aelux-multiselect__option',
                    index === activeIndex && 'aelux-multiselect__option--active',
                    selected && 'aelux-multiselect__option--selected',
                    option.disabled && 'aelux-multiselect__option--disabled',
                  )}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => {
                    if (!option.disabled) setActiveIndex(index)
                  }}
                  onClick={() => toggleOption(option)}
                >
                  <span className="aelux-multiselect__option-box" aria-hidden="true">
                    {selected ? <IconCheck size={checkSize} /> : null}
                  </span>
                  <span className="aelux-multiselect__option-text">
                    <span className="aelux-multiselect__option-label">{option.label}</span>
                    {option.description != null ? (
                      <span className="aelux-multiselect__option-desc">{option.description}</span>
                    ) : null}
                  </span>
                </li>
              )
            })
          )}
        </ul>
      ) : null}
    </div>
  )
})

MultiSelect.displayName = 'MultiSelect'
