import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { IconWarning } from '../../icons'
import { Button } from '../Button'
import { Modal } from '../Modal'
import { cx } from '../../utils/cx'

export interface DialogProps {
  /** 是否打开 */
  open: boolean
  /** 关闭回调 */
  onClose: () => void
  /** 标题 */
  title?: ReactNode
  /** 描述文案（显示在正文顶部） */
  description?: ReactNode
  /** 追加正文内容（例如一个输入框） */
  children?: ReactNode
  /** 自定义图标；tone="danger" 时默认显示警告图标 */
  icon?: ReactNode
  /** 语义风格，默认 default */
  tone?: 'default' | 'danger'
  /** 确认按钮文案，默认「确定」 */
  confirmText?: string
  /** 取消按钮文案，默认「取消」 */
  cancelText?: string
  /** 确认回调；返回 Promise 时确认按钮自动进入 loading 并防止重复触发 */
  onConfirm?: () => void | Promise<void>
  /** 外部控制的确认按钮 loading */
  confirmLoading?: boolean
  /** 隐藏取消按钮（只有一个操作的提示框） */
  hideCancel?: boolean
  /** 预设尺寸，默认 sm */
  size?: 'sm' | 'md' | 'lg'
  /** 点击遮罩关闭，默认 false（确认框默认防误触） */
  closeOnOverlay?: boolean
  /** 按 Esc 关闭，默认 true */
  closeOnEsc?: boolean
  /** 垂直居中，默认 true */
  centered?: boolean
  /** 显示右上角关闭按钮，默认 false */
  showClose?: boolean
  /** 关闭后销毁内容 */
  destroyOnClose?: boolean
  className?: string
}

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'then' in value &&
    typeof value.then === 'function'
  )
}

/**
 * 确认对话框 —— 基于 Modal 组合，支持 danger 语义、异步确认与 loading 防重复。
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  icon,
  tone = 'default',
  confirmText = '确定',
  cancelText = '取消',
  onConfirm,
  confirmLoading = false,
  hideCancel = false,
  size = 'sm',
  closeOnOverlay = false,
  closeOnEsc = true,
  centered = true,
  showClose = false,
  destroyOnClose = false,
  className,
}: DialogProps) {
  const [pending, setPending] = useState(false)
  const busy = confirmLoading || pending

  // 关闭后重置内部 loading，避免异步确认超时后再次打开仍卡在 loading
  useEffect(() => {
    if (!open) setPending(false)
  }, [open])

  const handleConfirm = () => {
    if (busy) return
    if (!onConfirm) {
      onClose()
      return
    }
    const result = onConfirm()
    if (!isPromiseLike(result)) return
    setPending(true)
    result.then(
      () => setPending(false),
      () => setPending(false),
    )
  }

  const resolvedIcon = icon ?? (tone === 'danger' ? <IconWarning size={18} /> : null)
  const heading =
    title == null && resolvedIcon == null ? undefined : (
      <span className="aelux-dialog__heading">
        {resolvedIcon != null ? (
          <span className="aelux-dialog__icon" aria-hidden="true">
            {resolvedIcon}
          </span>
        ) : null}
        {title != null ? <span className="aelux-dialog__title">{title}</span> : null}
      </span>
    )

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={heading}
      size={size}
      closeOnOverlay={closeOnOverlay}
      closeOnEsc={closeOnEsc}
      centered={centered}
      showClose={showClose}
      destroyOnClose={destroyOnClose}
      className={cx('aelux-dialog', `aelux-dialog--${tone}`, className)}
      footer={
        <>
          {hideCancel ? null : (
            <Button variant="secondary" onClick={onClose} disabled={busy}>
              {cancelText}
            </Button>
          )}
          <Button
            variant={tone === 'danger' ? 'danger' : 'primary'}
            loading={busy}
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      {description != null || children != null ? (
        <div className="aelux-dialog__content">
          {description != null ? <p className="aelux-dialog__description">{description}</p> : null}
          {children}
        </div>
      ) : null}
    </Modal>
  )
}
