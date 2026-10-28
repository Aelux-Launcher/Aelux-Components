import { forwardRef, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, InputHTMLAttributes, KeyboardEvent as ReactKeyboardEvent } from 'react'
import { IconClose, IconLoader, IconSearch } from '../../icons'
import { cx } from '../../utils/cx'
import { composeRefs } from '../../utils/composeRefs'

export interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'defaultValue' | 'onChange'> {
  /** 受控值 */
  value?: string
  /** 非受控默认值 */
  defaultValue?: string
  /** 值变化回调（每次输入都会触发） */
  onValueChange?: (value: string) => void
  /** 按下回车触发搜索 */
  onSearch?: (value: string) => void
  /** 尺寸，默认 md */
  size?: 'sm' | 'md' | 'lg'
  /** 撑满父容器宽度 */
  block?: boolean
  /** 显示清除按钮 */
  allowClear?: boolean
  /** 右侧快捷键提示（组件自行渲染 kbd 外观，例如 "Ctrl K"） */
  shortcut?: string
  /** 加载中：左侧图标转为转圈 */
  loading?: boolean
  /** 外层容器附加类名 */
  wrapperClassName?: string
  /** 点击清除回调 */
  onClear?: () => void
}

/**
 * 搜索框 —— 左侧搜索图标、右侧快捷键提示 / 清除按钮，回车触发 onSearch。
 * 受控与非受控两种用法均支持，键盘 Escape 可在可清除时清空。
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  {
    value,
    defaultValue,
    onValueChange,
    onSearch,
    size = 'md',
    block = false,
    allowClear = false,
    shortcut,
    loading = false,
    wrapperClassName,
    onClear,
    disabled,
    readOnly,
    className,
    onKeyDown,
    'aria-label': ariaLabel,
    ...rest
  },
  ref,
) {
  const innerRef = useRef<HTMLInputElement | null>(null)
  const setRef = useMemo(() => composeRefs(innerRef, ref), [ref])

  const isControlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = useState<string>(() => defaultValue ?? '')
  const currentValue = isControlled ? (value ?? '') : uncontrolledValue

  const iconSize = size === 'lg' ? 16 : size === 'sm' ? 12 : 14
  const showClear = allowClear && currentValue.length > 0 && !disabled && !readOnly

  const update = (next: string) => {
    if (!isControlled) setUncontrolledValue(next)
    onValueChange?.(next)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    update(event.currentTarget.value)
  }

  const handleClear = () => {
    update('')
    onClear?.()
    innerRef.current?.focus()
  }

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    if (event.key === 'Enter') {
      onSearch?.(event.currentTarget.value)
    } else if (event.key === 'Escape' && showClear) {
      event.preventDefault()
      handleClear()
    }
  }

  return (
    <div
      className={cx(
        'aelux-search-input',
        `aelux-search-input--${size}`,
        block && 'aelux-search-input--block',
        disabled && 'aelux-search-input--disabled',
        loading && 'aelux-search-input--loading',
        wrapperClassName,
      )}
    >
      <span className="aelux-search-input__icon" aria-hidden="true">
        {loading ? <IconLoader size={iconSize} className="aelux-spin" /> : <IconSearch size={iconSize} />}
      </span>
      <input
        ref={setRef}
        type="search"
        className={cx('aelux-search-input__field', className)}
        value={currentValue}
        disabled={disabled}
        readOnly={readOnly}
        aria-label={ariaLabel ?? '搜索'}
        aria-busy={loading || undefined}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        {...rest}
      />
      {showClear ? (
        <button
          type="button"
          tabIndex={-1}
          className="aelux-search-input__clear"
          aria-label="清空搜索"
          onMouseDown={(event) => event.preventDefault()}
          onClick={handleClear}
        >
          <IconClose size={12} />
        </button>
      ) : shortcut != null && shortcut.length > 0 && !loading ? (
        <kbd className="aelux-search-input__kbd">{shortcut}</kbd>
      ) : null}
    </div>
  )
})

SearchInput.displayName = 'SearchInput'
