import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, TextareaHTMLAttributes } from 'react'
import { cx } from '../../utils/cx'
import { composeRefs } from '../../utils/composeRefs'

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'children'> {
  /** 尺寸，默认 md */
  size?: 'sm' | 'md' | 'lg'
  /** 校验状态 */
  status?: 'default' | 'error' | 'warning'
  /** 撑满父容器宽度 */
  block?: boolean
  /** 显示字数统计（配合 maxLength） */
  showCount?: boolean
  /** 自动随内容撑高 */
  autoSize?: boolean
}

/**
 * 多行输入 —— 支持尺寸、校验状态、字数统计与自动撑高。
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    size = 'md',
    status = 'default',
    block = false,
    showCount = false,
    autoSize = false,
    className,
    value,
    defaultValue,
    maxLength,
    onChange,
    disabled,
    ...rest
  },
  ref,
) {
  const innerRef = useRef<HTMLTextAreaElement | null>(null)
  const setRef = useMemo(() => composeRefs(innerRef, ref), [ref])

  const isControlled = value !== undefined
  const [uncontrolledLength, setUncontrolledLength] = useState<number>(() =>
    defaultValue == null ? 0 : String(defaultValue).length,
  )
  const length = isControlled ? String(value ?? '').length : uncontrolledLength

  useEffect(() => {
    if (!autoSize) return
    const el = innerRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [autoSize, value, defaultValue])

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (!isControlled) setUncontrolledLength(event.currentTarget.value.length)
    if (autoSize) {
      const el = event.currentTarget
      el.style.height = 'auto'
      el.style.height = `${el.scrollHeight}px`
    }
    onChange?.(event)
  }

  return (
    <div
      className={cx(
        'aelux-textarea',
        `aelux-textarea--${size}`,
        status !== 'default' && `aelux-textarea--${status}`,
        disabled && 'aelux-textarea--disabled',
        block && 'aelux-textarea--block',
        autoSize && 'aelux-textarea--autosize',
      )}
    >
      <textarea
        ref={setRef}
        className={cx('aelux-textarea__field', className)}
        value={value}
        defaultValue={defaultValue}
        maxLength={maxLength}
        onChange={handleChange}
        disabled={disabled}
        aria-invalid={status === 'error' || undefined}
        {...rest}
      />
      {showCount ? (
        <div className="aelux-textarea__count">
          {length}
          {maxLength == null ? '' : ` / ${maxLength}`}
        </div>
      ) : null}
    </div>
  )
})

Textarea.displayName = 'Textarea'
