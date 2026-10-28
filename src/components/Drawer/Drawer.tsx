import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'
import { IconClose } from '../../icons'
import { cx } from '../../utils/cx'

export interface DrawerProps {
  /** 是否打开 */
  open: boolean
  /** 关闭回调 */
  onClose: () => void
  /** 标题 */
  title?: ReactNode
  /** 描述文案 */
  description?: ReactNode
  /** 底部操作区；不传则不渲染 */
  footer?: ReactNode
  /** 抽屉内容 */
  children?: ReactNode
  /** 弹出方向，默认 right */
  placement?: 'right' | 'left'
  /** 宽度，默认 360 */
  width?: number | string
  /** 点击遮罩关闭，默认 true */
  closeOnOverlay?: boolean
  /** 按 Esc 关闭，默认 true */
  closeOnEsc?: boolean
  /** 显示右上角关闭按钮，默认 true */
  showClose?: boolean
  /** 关闭后销毁内容（默认 false，保留内容状态） */
  destroyOnClose?: boolean
  className?: string
}

const EXIT_DURATION_MS = 280
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => element.offsetParent !== null || element === document.activeElement,
  )
}

function toCssSize(value: number | string): string {
  return typeof value === 'number' ? `${value}px` : value
}

/**
 * 抽屉 —— createPortal 到 body，支持左右方向、遮罩 / Esc 关闭、滚动锁与进出场动画。
 */
export function Drawer({
  open,
  onClose,
  title,
  description,
  footer,
  children,
  placement = 'right',
  width = 360,
  closeOnOverlay = true,
  closeOnEsc = true,
  showClose = true,
  destroyOnClose = false,
  className,
}: DrawerProps) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement | null>(null)
  const [present, setPresent] = useState(open)
  const [active, setActive] = useState(false)

  const onCloseRef = useRef(onClose)
  const closeOnOverlayRef = useRef(closeOnOverlay)
  const closeOnEscRef = useRef(closeOnEsc)
  const destroyOnCloseRef = useRef(destroyOnClose)
  onCloseRef.current = onClose
  closeOnOverlayRef.current = closeOnOverlay
  closeOnEscRef.current = closeOnEsc
  destroyOnCloseRef.current = destroyOnClose

  // 进出场：打开先挂载再切到 open 态；关闭先播放退出动画，按需延迟卸载
  useEffect(() => {
    if (open) {
      setPresent(true)
      const frame = window.requestAnimationFrame(() => setActive(true))
      return () => window.cancelAnimationFrame(frame)
    }
    setActive(false)
    if (!destroyOnCloseRef.current) return
    const timer = window.setTimeout(() => setPresent(false), EXIT_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [open])

  // 滚动锁 + Esc + Tab 焦点圈定 + 焦点归还
  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const body = document.body
    const previousOverflow = body.style.overflow
    const previousPaddingRight = body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (!closeOnEscRef.current) return
        event.stopPropagation()
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab') return
      const panel = panelRef.current
      if (!panel) return
      const focusable = getFocusable(panel)
      if (focusable.length === 0) {
        event.preventDefault()
        panel.focus()
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const current = document.activeElement
      const inside = current instanceof Node && panel.contains(current)
      if (event.shiftKey) {
        if (!inside || current === first) {
          event.preventDefault()
          last.focus()
        }
      } else if (!inside || current === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      body.style.overflow = previousOverflow
      body.style.paddingRight = previousPaddingRight
      if (previouslyFocused?.isConnected) previouslyFocused.focus()
    }
  }, [open])

  // 进入动画结束（inert 解除）后把焦点交给面板内第一个可聚焦元素
  useEffect(() => {
    if (!active) return
    const panel = panelRef.current
    if (!panel) return
    const focusable = getFocusable(panel)
    ;(focusable[0] ?? panel).focus()
  }, [active])

  if (!present || typeof document === 'undefined') return null

  return createPortal(
    <div className="aelux-drawer-root" data-state={active ? 'open' : 'closed'}>
      <div
        className="aelux-drawer__overlay"
        aria-hidden="true"
        onClick={() => {
          if (closeOnOverlayRef.current) onCloseRef.current()
        }}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title != null ? titleId : undefined}
        inert={!active}
        tabIndex={-1}
        className={cx('aelux-drawer', `aelux-drawer--${placement}`, className)}
        style={{ width: toCssSize(width) }}
      >
        {title != null || description != null || showClose ? (
          <header className="aelux-drawer__header">
            <div className="aelux-drawer__heading">
              {title != null ? (
                <h2 className="aelux-drawer__title" id={titleId}>
                  {title}
                </h2>
              ) : null}
              {description != null ? <p className="aelux-drawer__description">{description}</p> : null}
            </div>
            {showClose ? (
              <button
                type="button"
                className="aelux-drawer__close"
                aria-label="关闭"
                onClick={() => onCloseRef.current()}
              >
                <IconClose size={16} />
              </button>
            ) : null}
          </header>
        ) : null}
        <div className="aelux-drawer__body">{children}</div>
        {footer != null ? <div className="aelux-drawer__footer">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  )
}
