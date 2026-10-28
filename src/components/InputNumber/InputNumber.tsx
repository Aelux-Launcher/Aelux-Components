import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'
import { IconMinus, IconPlus } from '../../icons'
import { cx } from '../../utils/cx'
import { composeRefs } from '../../utils/composeRefs'

export interface InputNumberProps {
  /** 受控值；null 表示空值 */
  value?: number | null
  /** 非受控默认值 */
  defaultValue?: number | null
  /** 数值变化回调；空值回调 null */
  onValueChange?: (value: number | null) => void
  min?: number
  max?: number
  /** 每次步进的增量，默认 1 */
  step?: number
  /** 小数位数；提供时按该精度取整与展示 */
  precision?: number
  size?: 'sm' | 'md' | 'lg'
  status?: 'default' | 'error' | 'warning' | 'success'
  disabled?: boolean
  block?: boolean
  /** 是否展示 - / + 步进按钮，默认 true */
  controls?: boolean
  prefix?: ReactNode
  suffix?: ReactNode
  placeholder?: string
  name?: string
  id?: string
  className?: string
  /** 无可见标签时的无障碍名称 */
  ariaLabel?: string
}

function roundTo(value: number, precision?: number): number {
  if (precision == null) return Math.round(value * 1e10) / 1e10
  const factor = 10 ** precision
  return Math.round(value * factor) / factor
}

function clampValue(value: number, min?: number, max?: number): number {
  let next = value
  if (min != null && next < min) next = min
  if (max != null && next > max) next = max
  return next
}

function parseNumeric(text: string): number | null {
  const trimmed = text.trim()
  if (trimmed === '') return null
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : null
}

function formatNumeric(value: number | null, precision?: number): string {
  if (value == null) return ''
  if (precision != null) return value.toFixed(precision)
  return String(roundTo(value))
}

/**
 * 数字输入框 —— 支持 min/max/step/precision、键盘 ↑↓ 步进、- / + 按钮与空值（null）语义。
 */
export const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumber(
  {
    value,
    defaultValue,
    onValueChange,
    min,
    max,
    step = 1,
    precision,
    size = 'md',
    status = 'default',
    disabled = false,
    block = false,
    controls = true,
    prefix,
    suffix,
    placeholder,
    name,
    id,
    className,
    ariaLabel,
  },
  ref,
) {
  const innerRef = useRef<HTMLInputElement | null>(null)
  const setRef = useMemo(() => composeRefs(innerRef, ref), [ref])
  const focusedRef = useRef(false)

  const isControlled = value !== undefined
  const [draft, setDraft] = useState<string>(() =>
    formatNumeric((isControlled ? value : defaultValue) ?? null, precision),
  )

  useEffect(() => {
    if (!isControlled || focusedRef.current) return
    setDraft((prev) => {
      const parsedPrev = parseNumeric(prev)
      if (value == null) return prev.trim() === '' ? prev : ''
      if (parsedPrev != null && roundTo(parsedPrev) === roundTo(value)) return prev
      return formatNumeric(value, precision)
    })
  }, [isControlled, value, precision])

  const parsedDraft = parseNumeric(draft)
  const current = parsedDraft == null ? null : clampValue(roundTo(parsedDraft, precision), min, max)
  const atMin = current != null && min != null && current <= min
  const atMax = current != null && max != null && current >= max

  const commit = (next: number | null) => {
    const normalized = next == null ? null : clampValue(roundTo(next, precision), min, max)
    setDraft(formatNumeric(normalized, precision))
    onValueChange?.(normalized)
  }

  const stepBy = (direction: 1 | -1) => {
    if (disabled) return
    const base = parseNumeric(draft)
    const next = base == null ? (min ?? 0) : base + direction * step
    commit(next)
    innerRef.current?.focus()
  }

  const normalize = () => {
    const parsedValue = parseNumeric(draft)
    if (parsedValue == null) {
      if (draft !== '') {
        setDraft('')
        onValueChange?.(null)
      }
      return
    }
    const normalized = clampValue(roundTo(parsedValue, precision), min, max)
    const formatted = formatNumeric(normalized, precision)
    if (formatted !== draft) setDraft(formatted)
    if (normalized !== parsedValue) onValueChange?.(normalized)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.currentTarget.value
    setDraft(next)
    if (next.trim() === '') {
      onValueChange?.(null)
      return
    }
    const parsedValue = parseNumeric(next)
    if (parsedValue == null) return
    onValueChange?.(clampValue(roundTo(parsedValue, precision), min, max))
  }

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      stepBy(1)
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      stepBy(-1)
    } else if (event.key === 'Enter') {
      normalize()
    }
  }

  const iconSize = size === 'lg' ? 14 : size === 'sm' ? 10 : 12

  return (
    <div
      className={cx(
        'aelux-input-number',
        `aelux-input-number--${size}`,
        status !== 'default' && `aelux-input-number--${status}`,
        disabled && 'aelux-input-number--disabled',
        block && 'aelux-input-number--block',
        className,
      )}
    >
      {prefix != null ? <span className="aelux-input-number__affix">{prefix}</span> : null}
      {controls ? (
        <button
          type="button"
          tabIndex={-1}
          className="aelux-input-number__control"
          aria-label="减少"
          disabled={disabled || atMin}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => stepBy(-1)}
        >
          <IconMinus size={iconSize} />
        </button>
      ) : null}
      <input
        ref={setRef}
        type="text"
        inputMode="decimal"
        role="spinbutton"
        autoComplete="off"
        className="aelux-input-number__field"
        value={draft}
        disabled={disabled}
        placeholder={placeholder}
        name={name}
        id={id}
        aria-label={ariaLabel ?? placeholder}
        aria-valuenow={current ?? undefined}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-invalid={status === 'error' || undefined}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          focusedRef.current = true
        }}
        onBlur={() => {
          focusedRef.current = false
          normalize()
        }}
      />
      {controls ? (
        <button
          type="button"
          tabIndex={-1}
          className="aelux-input-number__control"
          aria-label="增加"
          disabled={disabled || atMax}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => stepBy(1)}
        >
          <IconPlus size={iconSize} />
        </button>
      ) : null}
      {suffix != null ? <span className="aelux-input-number__affix">{suffix}</span> : null}
    </div>
  )
})

InputNumber.displayName = 'InputNumber'
