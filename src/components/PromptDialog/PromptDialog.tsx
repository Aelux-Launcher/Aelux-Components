import { useEffect, useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Button } from '../Button'
import { Input } from '../Input'
import { Modal } from '../Modal'
import { cx } from '../../utils/cx'

export interface PromptDialogProps {
  open: boolean
  onClose: () => void
  title: ReactNode
  description?: ReactNode
  label?: ReactNode
  placeholder?: string
  defaultValue?: string
  confirmText?: string
  cancelText?: string
  /** 返回 false / 错误文案时阻止提交（返回字符串显示为输入框错误） */
  validate?: (value: string) => boolean | string | undefined
  onConfirm?: (value: string) => void | Promise<void>
  size?: 'sm' | 'md' | 'lg'
  /** 外部控制的确认按钮 loading（与内部异步状态合并） */
  confirmLoading?: boolean
  /** 点击遮罩关闭，默认 false */
  closeOnOverlay?: boolean
  /** 按 Esc 关闭，默认 true（提交中始终禁用） */
  closeOnEsc?: boolean
  /** 显示右上角关闭按钮，默认 false */
  showClose?: boolean
  /** 关闭后是否销毁内容 */
  destroyOnClose?: boolean
  className?: string
}

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'then' in value &&
    typeof (value as { then?: unknown }).then === 'function'
  )
}

/**
 * 输入对话框 —— 基于 Modal 组合的输入式确认浮层：
 * 打开时自动聚焦并全选输入框，validate 失败时阻止提交并展示输入框错误，
 * onConfirm 返回 Promise 期间确认按钮 loading 且忽略重复提交。
 */
export function PromptDialog({
  open,
  onClose,
  title,
  description,
  label,
  placeholder,
  defaultValue,
  confirmText = '确定',
  cancelText = '取消',
  validate,
  onConfirm,
  size = 'sm',
  confirmLoading = false,
  closeOnOverlay = false,
  closeOnEsc = true,
  showClose = false,
  destroyOnClose = false,
  className,
}: PromptDialogProps) {
  const [value, setValue] = useState(() => defaultValue ?? '')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const inputId = useId()
  const errorId = useId()
  const busy = pending || confirmLoading

  useEffect(() => {
    if (!open) {
      setPending(false)
      return
    }

    setValue(defaultValue ?? '')
    setError(null)
    setPending(false)

    // Modal 会在同一帧把焦点放到第一个可聚焦元素；此 rAF 随后把焦点交给输入框并全选。
    const frame = window.requestAnimationFrame(() => {
      const input = inputRef.current
      if (!input) return
      input.focus()
      input.select()
    })

    return () => window.cancelAnimationFrame(frame)
  }, [open, defaultValue])

  const focusInput = () => {
    inputRef.current?.focus()
  }

  const handleConfirm = () => {
    if (busy) return

    if (validate) {
      const result = validate(value)
      if (result === false) {
        setError('输入内容无效')
        focusInput()
        return
      }
      if (typeof result === 'string' && result.length > 0) {
        setError(result)
        focusInput()
        return
      }
    }

    setError(null)

    if (!onConfirm) {
      onClose()
      return
    }

    const result = onConfirm(value)
    if (isPromiseLike(result)) {
      setPending(true)
      const settle = () => setPending(false)
      result.then(settle, settle)
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        if (busy) return
        onClose()
      }}
      title={title}
      size={size}
      centered
      className={cx('aelux-prompt-dialog', className)}
      closeOnOverlay={closeOnOverlay && !busy}
      closeOnEsc={closeOnEsc && !busy}
      showClose={showClose}
      destroyOnClose={destroyOnClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={busy}>
            {cancelText}
          </Button>
          <Button variant="primary" onClick={handleConfirm} loading={busy}>
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="aelux-prompt-dialog__body">
        {description != null ? (
          <p className="aelux-prompt-dialog__description">{description}</p>
        ) : null}
        {label != null ? (
          <label className="aelux-prompt-dialog__label" htmlFor={inputId}>
            {label}
          </label>
        ) : null}
        <Input
          ref={inputRef}
          id={inputId}
          block
          autoComplete="off"
          className="aelux-prompt-dialog__input"
          value={value}
          placeholder={placeholder}
          status={error ? 'error' : 'default'}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => {
            setValue(event.target.value)
            if (error) setError(null)
          }}
          onKeyDown={(event) => {
            if (event.key !== 'Enter' || event.nativeEvent.isComposing) return
            event.preventDefault()
            handleConfirm()
          }}
        />
        {error ? (
          <p className="aelux-prompt-dialog__error" id={errorId} role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </Modal>
  )
}
