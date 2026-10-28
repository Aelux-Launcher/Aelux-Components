import { cloneElement, forwardRef, isValidElement, useEffect, useId, useRef, useState } from 'react'
import type { ReactElement, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { IconBell, IconClose } from '../../icons'
import { cx } from '../../utils/cx'

export interface NotificationItem {
  id: string
  title: ReactNode
  description?: ReactNode
  time?: ReactNode
  icon?: ReactNode
  unread?: boolean
  action?: ReactNode
}

export interface NotificationPanelProps {
  items: NotificationItem[]
  title?: ReactNode
  open: boolean
  onClose: () => void
  /**
   * 触发按钮。组件渲染它并负责定位与未读角标；点击切换由组件处理
   * （关闭时调用 onOpen，展开时调用 onClose），open 始终受控。
   */
  trigger?: ReactNode
  /** 点击触发按钮且面板关闭时调用 */
  onOpen?: () => void
  onReadAll?: () => void
  onItemClick?: (item: NotificationItem) => void
  emptyText?: ReactNode
  footer?: ReactNode
  width?: number
  className?: string
  ariaLabel?: string
}

interface PanelPosition {
  top: number
  left: number
}

const VIEWPORT_MARGIN = 12
const TRIGGER_GAP = 8

/**
 * 通知面板 —— 受控浮层：trigger 触发按钮 + portal 浮层（fixed 定位、视口翻转/夹取），
 * 未读角标与未读计数、「全部已读」、空态、footer；点击外部或 Esc 关闭并回焦触发按钮。
 */
export const NotificationPanel = forwardRef<HTMLDivElement, NotificationPanelProps>(function NotificationPanel(
  {
    items,
    title,
    open,
    onClose,
    trigger,
    onOpen,
    onReadAll,
    onItemClick,
    emptyText,
    footer,
    width = 360,
    className,
    ariaLabel,
  },
  ref,
) {
  const panelId = useId()
  const wrapperRef = useRef<HTMLSpanElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const [position, setPosition] = useState<PanelPosition | null>(null)

  const unreadCount = items.filter((item) => item.unread === true).length

  const focusTrigger = () => {
    const element = wrapperRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    element?.focus()
  }

  useEffect(() => {
    if (!open) {
      setPosition(null)
      return
    }
    const update = () => {
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const triggerRect = wrapperRef.current?.getBoundingClientRect()
      const panelWidth = panelRef.current?.offsetWidth ?? width
      const panelHeight = panelRef.current?.offsetHeight ?? 360
      const maxLeft = Math.max(VIEWPORT_MARGIN, viewportWidth - panelWidth - VIEWPORT_MARGIN)
      if (!triggerRect) {
        setPosition({ top: 56, left: maxLeft })
        return
      }
      const left = Math.min(Math.max(VIEWPORT_MARGIN, triggerRect.right - panelWidth), maxLeft)
      let top = triggerRect.bottom + TRIGGER_GAP
      if (top + panelHeight > viewportHeight - VIEWPORT_MARGIN) {
        top = Math.max(VIEWPORT_MARGIN, triggerRect.top - panelHeight - TRIGGER_GAP)
      }
      setPosition({ top, left })
    }
    update()
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [open, width])

  useEffect(() => {
    if (!open) return
    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (panelRef.current?.contains(target)) return
      if (wrapperRef.current?.contains(target)) return
      onClose()
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      onClose()
      focusTrigger()
    }
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('keydown', handleKeyDown, true)
    const frame = window.requestAnimationFrame(() => panelRef.current?.focus({ preventScroll: true }))
    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keydown', handleKeyDown, true)
      window.cancelAnimationFrame(frame)
    }
  }, [open, onClose])

  const triggerElement = isValidElement(trigger)
    ? cloneElement(trigger as unknown as ReactElement<Record<string, unknown>>, {
        'aria-haspopup': 'dialog',
        'aria-expanded': open,
        'aria-controls': open ? panelId : undefined,
      })
    : trigger

  const setPanelRef = (node: HTMLDivElement | null) => {
    panelRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref !== null && ref !== undefined) ref.current = node
  }

  return (
    <>
      {trigger !== undefined ? (
        <span
          ref={wrapperRef}
          className={cx('aelux-notification-panel__trigger', className)}
          onClick={() => {
            if (open) onClose()
            else onOpen?.()
          }}
        >
          {triggerElement}
          {unreadCount > 0 ? (
            <span className="aelux-notification-panel__badge" aria-hidden="true">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          ) : null}
        </span>
      ) : null}
      {open && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={setPanelRef}
              id={panelId}
              role="dialog"
              aria-label={ariaLabel ?? '通知面板'}
              tabIndex={-1}
              className="aelux-notification-panel"
              style={{
                width,
                top: position?.top ?? 0,
                left: position?.left ?? 0,
                visibility: position === null ? 'hidden' : undefined,
              }}
            >
              <div className="aelux-notification-panel__header">
                <div className="aelux-notification-panel__heading">
                  <span className="aelux-notification-panel__title">{title ?? '通知'}</span>
                  {unreadCount > 0 ? (
                    <span className="aelux-notification-panel__count">{unreadCount} 条未读</span>
                  ) : null}
                </div>
                <div className="aelux-notification-panel__header-actions">
                  {onReadAll !== undefined && unreadCount > 0 ? (
                    <button type="button" className="aelux-notification-panel__read-all" onClick={onReadAll}>
                      全部已读
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="aelux-notification-panel__close"
                    aria-label="关闭通知"
                    onClick={() => {
                      onClose()
                      focusTrigger()
                    }}
                  >
                    <IconClose size={14} />
                  </button>
                </div>
              </div>
              {items.length === 0 ? (
                <div className="aelux-notification-panel__empty">
                  <IconBell size={22} />
                  <p className="aelux-notification-panel__empty-text">{emptyText ?? '暂无通知'}</p>
                </div>
              ) : (
                <ul className="aelux-notification-panel__list">
                  {items.map((item) => {
                    const unread = item.unread === true
                    const content = (
                      <>
                        {item.icon !== undefined ? (
                          <span className="aelux-notification-panel__item-icon" aria-hidden="true">
                            {item.icon}
                          </span>
                        ) : null}
                        <span className="aelux-notification-panel__item-body">
                          <span className="aelux-notification-panel__item-head">
                            <span className="aelux-notification-panel__item-title">
                              {item.title}
                              {unread ? (
                                <span className="aelux-notification-panel__item-dot" aria-hidden="true" />
                              ) : null}
                            </span>
                            {item.time !== undefined ? (
                              <span className="aelux-notification-panel__item-time">{item.time}</span>
                            ) : null}
                          </span>
                          {item.description !== undefined ? (
                            <span className="aelux-notification-panel__item-desc">{item.description}</span>
                          ) : null}
                        </span>
                      </>
                    )
                    return (
                      <li
                        key={item.id}
                        className={cx(
                          'aelux-notification-panel__item',
                          unread && 'aelux-notification-panel__item--unread',
                        )}
                      >
                        {onItemClick !== undefined ? (
                          <button
                            type="button"
                            className="aelux-notification-panel__item-main"
                            onClick={() => onItemClick(item)}
                          >
                            {content}
                          </button>
                        ) : (
                          <div className="aelux-notification-panel__item-main">{content}</div>
                        )}
                        {item.action !== undefined ? (
                          <span className="aelux-notification-panel__item-action">{item.action}</span>
                        ) : null}
                      </li>
                    )
                  })}
                </ul>
              )}
              {footer !== undefined ? <div className="aelux-notification-panel__footer">{footer}</div> : null}
            </div>,
            document.body,
          )
        : null}
    </>
  )
})

NotificationPanel.displayName = 'NotificationPanel'
