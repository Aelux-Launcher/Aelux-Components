import { forwardRef, useEffect, useId, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'
import { IconClose } from '../../icons'
import { Button } from '../Button'
import { composeRefs } from '../../utils/composeRefs'
import { cx } from '../../utils/cx'

export interface ModalProps {
  /** 是否打开 */
  open: boolean
  /** 关闭回调 */
  onClose: () => void
  /** 标题 */
  title?: ReactNode
  /** 内容 */
  children?: ReactNode
  /** 底部操作区（传 null 隐藏默认底部） */
  footer?: ReactNode
  /** 宽度，默认 420 */
  width?: number | string
  /** 预设尺寸 */
  size?: 'sm' | 'md' | 'lg'
  /** 点击遮罩关闭，默认 true */
  closeOnOverlay?: boolean
  /** 按 Esc 关闭，默认 true */
  closeOnEsc?: boolean
  /** 显示右上角关闭按钮，默认 true */
  showClose?: boolean
  /** 垂直居中，默认 true */
  centered?: boolean
  /** 关闭后是否销毁内容 */
  destroyOnClose?: boolean
  className?: string
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function getFocusable(container: HTMLElement): HTMLElement[] {
  const nodes = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  return Array.from(nodes).filter(
    (node) => node.getAttribute('aria-hidden') !== 'true' && node.offsetParent !== null,
  )
}

function toCssSize(value: number | string): string {
  return typeof value === 'number' ? `${value}px` : value
}

/**
 * 模态框 —— createPortal 渲染到 body，带遮罩模糊、Esc / 点遮罩关闭、
 * body 滚动锁定、焦点圈定与关闭后焦点归还。
 */
export const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal(
  {
    open,
    onClose,
    title,
    children,
    footer,
    width,
    size = 'md',
    closeOnOverlay = true,
    closeOnEsc = true,
    showClose = true,
    centered = true,
    destroyOnClose = false,
    className,
  },
  ref,
) {
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const setDialogRef = useMemo(() => composeRefs(dialogRef, ref), [ref])
  const titleId = useId()
  const [hasOpened, setHasOpened] = useState(open)

  const onCloseRef = useRef(onClose)
  const closeOnEscRef = useRef(closeOnEsc)
  const closeOnOverlayRef = useRef(closeOnOverlay)
  useEffect(() => {
    onCloseRef.current = onClose
    closeOnEscRef.current = closeOnEsc
    closeOnOverlayRef.current = closeOnOverlay
  })

  useEffect(() => {
    if (open) setHasOpened(true)
  }, [open])

  useEffect(() => {
    if (!open) return

    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    const body = document.body
    const previousOverflow = body.style.overflow
    const previousPaddingRight = body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (!closeOnEscRef.current) return
        event.stopPropagation()
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab') return
      const dialog = dialogRef.current
      if (!dialog) return
      const focusable = getFocusable(dialog)
      if (focusable.length === 0) {
        event.preventDefault()
        dialog.focus()
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement
      const activeInside = active instanceof Node && dialog.contains(active)
      if (event.shiftKey) {
        if (!activeInside || active === first) {
          event.preventDefault()
          last.focus()
        }
      } else if (!activeInside || active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    const frame = window.requestAnimationFrame(() => {
      const dialog = dialogRef.current
      if (!dialog) return
      const focusable = getFocusable(dialog)
      ;(focusable[0] ?? dialog).focus()
    })

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      window.cancelAnimationFrame(frame)
      body.style.overflow = previousOverflow
      body.style.paddingRight = previousPaddingRight
      if (previouslyFocused?.isConnected) previouslyFocused.focus()
    }
  }, [open])

  if (!open && (destroyOnClose || !hasOpened)) return null
  if (typeof document === 'undefined') return null

  const defaultFooter = (
    <>
      <Button variant="secondary" onClick={() => onCloseRef.current()}>
        取消
      </Button>
      <Button variant="primary" onClick={() => onCloseRef.current()}>
        确定
      </Button>
    </>
  )

  return createPortal(
    <div
      className={cx(
        'aelux-modal-root',
        centered ? 'aelux-modal-root--centered' : 'aelux-modal-root--top',
        !open && 'aelux-modal-root--hidden',
      )}
    >
      <div
        className="aelux-modal__overlay"
        onClick={() => {
          if (closeOnOverlayRef.current) onCloseRef.current()
        }}
      />
      <div
        ref={setDialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title != null ? titleId : undefined}
        tabIndex={-1}
        className={cx('aelux-modal', `aelux-modal--${size}`, className)}
        style={width == null ? undefined : { width: toCssSize(width) }}
      >
        {title != null || showClose ? (
          <div className="aelux-modal__header">
            {title != null ? (
              <h2 className="aelux-modal__title" id={titleId}>
                {title}
              </h2>
            ) : (
              <span />
            )}
            {showClose ? (
              <button
                type="button"
                className="aelux-modal__close"
                aria-label="关闭弹窗"
                onClick={() => onCloseRef.current()}
              >
                <IconClose size={16} />
              </button>
            ) : null}
          </div>
        ) : null}
        <div className="aelux-modal__body">{children}</div>
        {footer !== null ? (
          <div className="aelux-modal__footer">{footer === undefined ? defaultFooter : footer}</div>
        ) : null}
      </div>
    </div>,
    document.body,
  )
})

Modal.displayName = 'Modal'
