import { forwardRef, useEffect, useId, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, FocusEvent as ReactFocusEvent, KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'
import { IconCheck, IconChevronDown, IconClose, IconLoader } from '../../icons'
import { cx } from '../../utils/cx'
import { composeRefs } from '../../utils/composeRefs'

export interface ComboboxOption {
  value: string
  label: string
  description?: ReactNode
  icon?: ReactNode
  disabled?: boolean
}

export interface ComboboxProps {
  /** 选项列表 */
  options: ComboboxOption[]
  /** 受控值 */
  value?: string
  /** 非受控默认值 */
  defaultValue?: string
  /** 选中值变化回调；清空时回调空字符串 */
  onValueChange?: (value: string) => void
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  status?: 'default' | 'error' | 'warning' | 'success'
  disabled?: boolean
  block?: boolean
  /** 显示清除按钮 */
  allowClear?: boolean
  /** 加载中 */
  loading?: boolean
  /** 无匹配项时的提示，默认「无匹配选项」 */
  emptyText?: ReactNode
  name?: string
  id?: string
  className?: string
  /** 无可见标签时的无障碍名称 */
  ariaLabel?: string
}

/**
 * 可搜索下拉选择 —— 输入过滤选项、↑↓/Enter/Escape 键盘操作、选中打勾。
 * 下拉列表用 wrapper 内 absolute 定位，受控 / 非受控均支持。
 */
export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
  {
    options,
    value,
    defaultValue,
    onValueChange,
    placeholder,
    size = 'md',
    status = 'default',
    disabled = false,
    block = false,
    allowClear = false,
    loading = false,
    emptyText,
    name,
    id,
    className,
    ariaLabel,
  },
  ref,
) {
  const innerRef = useRef<HTMLInputElement | null>(null)
  const setRef = useMemo(() => composeRefs(innerRef, ref), [ref])
  const listId = useId()

  const isControlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = useState<string>(() => defaultValue ?? '')
  const currentValue = isControlled ? (value ?? '') : uncontrolledValue
  const selected = useMemo(() => options.find((option) => option.value === currentValue) ?? null, [options, currentValue])

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState<string | null>(null)
  const [activeIndex, setActiveIndex] = useState(-1)

  const filtered = useMemo(() => {
    if (query == null) return options
    const keyword = query.trim().toLowerCase()
    if (keyword === '') return options
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(keyword) || option.value.toLowerCase().includes(keyword),
    )
  }, [options, query])

  const displayValue = query ?? selected?.label ?? ''
  const showClear = allowClear && currentValue.length > 0 && !disabled
  const optionId = (index: number) => `${listId}-option-${index}`
  const iconSize = size === 'lg' ? 16 : size === 'sm' ? 12 : 14

  useEffect(() => {
    setQuery(null)
  }, [currentValue])

  useEffect(() => {
    if (!open) return
    setActiveIndex(() => {
      const selectedIndex = filtered.findIndex((option) => option.value === currentValue && !option.disabled)
      if (selectedIndex >= 0) return selectedIndex
      return filtered.findIndex((option) => !option.disabled)
    })
  }, [open, filtered, currentValue])

  const closeList = () => {
    setOpen(false)
    setQuery(null)
    setActiveIndex(-1)
  }

  const openList = () => {
    if (disabled) return
    setOpen(true)
  }

  const selectOption = (option: ComboboxOption) => {
    if (option.disabled) return
    if (!isControlled) setUncontrolledValue(option.value)
    onValueChange?.(option.value)
    setOpen(false)
    setQuery(null)
    setActiveIndex(-1)
    innerRef.current?.focus()
  }

  const clearValue = () => {
    if (!isControlled) setUncontrolledValue('')
    onValueChange?.('')
    setOpen(false)
    setQuery(null)
    setActiveIndex(-1)
    innerRef.current?.focus()
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
    const indexes = edge === 'first' ? filtered.map((_, index) => index) : filtered.map((_, index) => index).reverse()
    const target = indexes.find((index) => !filtered[index].disabled)
    if (target != null) setActiveIndex(target)
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value)
    if (!open) setOpen(true)
  }

  const handleInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
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
    } else if (event.key === 'Enter' && open) {
      event.preventDefault()
      const activeOption = activeIndex >= 0 ? filtered[activeIndex] : undefined
      const target = activeOption?.disabled ? undefined : activeOption
      const fallback = filtered.find((option) => !option.disabled)
      const option = target ?? fallback
      if (option) selectOption(option)
    } else if (event.key === 'Escape' && open) {
      event.preventDefault()
      closeList()
    } else if (event.key === 'Tab') {
      closeList()
    }
  }

  const handleWrapperBlur = (event: ReactFocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget
    if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) return
    closeList()
  }

  return (
    <div
      className={cx(
        'aelux-combobox',
        `aelux-combobox--${size}`,
        status !== 'default' && `aelux-combobox--${status}`,
        open && 'aelux-combobox--open',
        disabled && 'aelux-combobox--disabled',
        block && 'aelux-combobox--block',
        className,
      )}
      onBlur={handleWrapperBlur}
    >
      <div className="aelux-combobox__control">
        <input
          ref={setRef}
          id={id}
          type="text"
          role="combobox"
          autoComplete="off"
          className="aelux-combobox__field"
          value={displayValue}
          placeholder={placeholder}
          disabled={disabled}
          aria-label={ariaLabel ?? placeholder ?? '选择选项'}
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-activedescendant={open && activeIndex >= 0 ? optionId(activeIndex) : undefined}
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-busy={loading || undefined}
          aria-invalid={status === 'error' || undefined}
          onFocus={openList}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
        />
        <span className="aelux-combobox__actions">
          {loading ? (
            <span className="aelux-combobox__spinner" aria-hidden="true">
              <IconLoader size={iconSize} className="aelux-spin" />
            </span>
          ) : null}
          {showClear ? (
            <button
              type="button"
              tabIndex={-1}
              className="aelux-combobox__clear"
              aria-label="清空选择"
              onMouseDown={(event) => event.preventDefault()}
              onClick={clearValue}
            >
              <IconClose size={12} />
            </button>
          ) : null}
          {loading ? null : (
            <button
              type="button"
              tabIndex={-1}
              className="aelux-combobox__toggle"
              aria-label={open ? '收起选项' : '展开选项'}
              disabled={disabled}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                if (open) {
                  closeList()
                } else {
                  openList()
                  innerRef.current?.focus()
                }
              }}
            >
              <IconChevronDown size={iconSize} />
            </button>
          )}
        </span>
      </div>
      {name != null ? <input type="hidden" name={name} value={currentValue} /> : null}
      {open ? (
        <ul className="aelux-combobox__list" role="listbox" id={listId} aria-label={ariaLabel ?? placeholder ?? '选项列表'}>
          {loading ? (
            <li className="aelux-combobox__status" role="presentation">
              <IconLoader size={14} className="aelux-spin" />
              <span>加载中…</span>
            </li>
          ) : filtered.length === 0 ? (
            <li className="aelux-combobox__status" role="presentation">
              {emptyText ?? '无匹配选项'}
            </li>
          ) : (
            filtered.map((option, index) => (
              <li
                key={option.value}
                id={optionId(index)}
                role="option"
                aria-selected={option.value === currentValue}
                aria-disabled={option.disabled || undefined}
                className={cx(
                  'aelux-combobox__option',
                  index === activeIndex && 'aelux-combobox__option--active',
                  option.value === currentValue && 'aelux-combobox__option--selected',
                  option.disabled && 'aelux-combobox__option--disabled',
                )}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => {
                  if (!option.disabled) setActiveIndex(index)
                }}
                onClick={() => selectOption(option)}
              >
                {option.icon != null ? (
                  <span className="aelux-combobox__option-icon" aria-hidden="true">
                    {option.icon}
                  </span>
                ) : null}
                <span className="aelux-combobox__option-text">
                  <span className="aelux-combobox__option-label">{option.label}</span>
                  {option.description != null ? (
                    <span className="aelux-combobox__option-desc">{option.description}</span>
                  ) : null}
                </span>
                {option.value === currentValue ? (
                  <span className="aelux-combobox__option-check" aria-hidden="true">
                    <IconCheck size={12} />
                  </span>
                ) : null}
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  )
})

Combobox.displayName = 'Combobox'
