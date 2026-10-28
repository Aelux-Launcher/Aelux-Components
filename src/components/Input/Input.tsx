import { forwardRef, useMemo, useRef, useState } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { IconClose } from '../../icons'
import { cx } from '../../utils/cx'
import { composeRefs } from '../../utils/composeRefs'

export type InputSize = 'sm' | 'md' | 'lg'
export type InputStatus = 'default' | 'error' | 'warning' | 'success'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  /** 尺寸，默认 md */
  size?: InputSize
  /** 校验状态 */
  status?: InputStatus
  /** 前缀内容（图标 / 文字） */
  prefix?: ReactNode
  /** 后缀内容（图标 / 单位） */
  suffix?: ReactNode
  /** 有值时显示清除按钮 */
  allowClear?: boolean
  /** 清除回调（非受控模式下组件会自行清空输入框） */
  onClear?: () => void
  /** 撑满父容器宽度 */
  block?: boolean
  /** 外层容器附加类名 */
  wrapperClassName?: string
}

/**
 * 输入框 —— 支持前后缀、清除、校验状态与三种尺寸。
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    size = 'md',
    status = 'default',
    prefix,
    suffix,
    allowClear = false,
    onClear,
    block = false,
    wrapperClassName,
    className,
    value,
    defaultValue,
    onChange,
    disabled,
    readOnly,
    ...rest
  },
  ref,
) {
  const innerRef = useRef<HTMLInputElement | null>(null)
  const setRef = useMemo(() => composeRefs(innerRef, ref), [ref])

  const isControlled = value !== undefined
  const [uncontrolledFilled, setUncontrolledFilled] = useState<boolean>(
    () => defaultValue != null && String(defaultValue).length > 0,
  )
  const hasValue = isControlled ? String(value ?? '').length > 0 : uncontrolledFilled
  const showClear = allowClear && hasValue && !disabled && !readOnly

  const handleClear = () => {
    const el = innerRef.current
    if (el) {
      if (!isControlled) {
        el.value = ''
        setUncontrolledFilled(false)
      }
      el.focus()
    }
    onClear?.()
  }

  return (
    <div
      className={cx(
        'aelux-input',
        `aelux-input--${size}`,
        status !== 'default' && `aelux-input--${status}`,
        disabled && 'aelux-input--disabled',
        block && 'aelux-input--block',
        wrapperClassName,
      )}
    >
      {prefix ? <span className="aelux-input__prefix">{prefix}</span> : null}
      <input
        ref={setRef}
        className={cx('aelux-input__field', className)}
        value={value}
        defaultValue={defaultValue}
        onChange={(event) => {
          if (!isControlled) setUncontrolledFilled(event.currentTarget.value.length > 0)
          onChange?.(event)
        }}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={status === 'error' || undefined}
        {...rest}
      />
      {suffix ? <span className="aelux-input__suffix">{suffix}</span> : null}
      {showClear ? (
        <button
          type="button"
          tabIndex={-1}
          className="aelux-input__clear"
          aria-label="清空输入"
          onMouseDown={(event) => event.preventDefault()}
          onClick={handleClear}
        >
          <IconClose size={12} />
        </button>
      ) : null}
    </div>
  )
})

Input.displayName = 'Input'
