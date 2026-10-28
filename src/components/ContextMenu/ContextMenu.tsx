import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { IconCheck } from '../../icons'
import { cx } from '../../utils/cx'

export interface ContextMenuSeparator {
  type: 'separator'
  key?: string
}

export interface ContextMenuLabel {
  type: 'label'
  label: ReactNode
  key?: string
}

export interface ContextMenuItem {
  type?: 'item'
  key: string
  label: ReactNode
  icon?: ReactNode
  shortcut?: string
  disabled?: boolean
  danger?: boolean
  checked?: boolean
  onSelect?: () => void
}

export type ContextMenuEntry = ContextMenuItem | ContextMenuSeparator | ContextMenuLabel

export interface ContextMenuProps {
  items: ContextMenuEntry[]
  children: ReactNode
  disabled?: boolean
  /** 自动修正到视口内，默认 true */
  collision?: boolean
  /** 任意菜单项被选中时回调（在 item.onSelect 之后触发） */
  onSelect?: (key: string) => void
  /** 菜单的无障碍名称，默认「上下文菜单」 */
  ariaLabel?: string
  /** 附加到触发区域外层容器的类名 */
  className?: string
}

const MENU_MARGIN = 8

function isSeparator(entry: ContextMenuEntry): entry is ContextMenuSeparator {
  return entry.type === 'separator'
}

function isLabel(entry: ContextMenuEntry): entry is ContextMenuLabel {
  return entry.type === 'label'
}

function getMenuItems(container: HTMLElement | null): HTMLButtonElement[] {
  if (!container) return []
  return Array.from(
    container.querySelectorAll<HTMLButtonElement>('[role="menuitem"], [role="menuitemcheckbox"]'),
  )
}

/**
 * 右键上下文菜单 —— 在触发区域监听 contextmenu，按鼠标坐标 fixed 定位，
 * 超出视口时自动翻转；点击外部 / Esc / 滚动关闭，支持键盘移动与 roving focus。
 */
export function ContextMenu({
  items,
  children,
  disabled = false,
  collision = true,
  onSelect,
  ariaLabel = '上下文菜单',
  className,
}: ContextMenuProps) {
  const [anchor, setAnchor] = useState<{ x: number; y: number } | null>(null)
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null)
  const triggerRef = useRef<HTMLDivElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const openAt = (x: number, y: number) => {
    if (disabled || typeof document === 'undefined') return
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    setAnchor({ x, y })
    setPosition(null)
  }

  const close = (restoreFocus = false) => {
    setAnchor(null)
    setPosition(null)
    const target = previousFocusRef.current
    previousFocusRef.current = null
    if (restoreFocus && target && target.isConnected) target.focus()
  }

  // 面板挂载后先量尺寸，再按需翻转 / 贴边修正（layout effect 保证绘制前完成）
  useLayoutEffect(() => {
    if (!anchor) return
    const menu = menuRef.current
    if (!menu) return

    const rect = menu.getBoundingClientRect()
    let left = anchor.x
    let top = anchor.y

    if (collision) {
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      if (left + rect.width > viewportWidth - MENU_MARGIN) {
        left = Math.max(MENU_MARGIN, anchor.x - rect.width)
      }
      if (top + rect.height > viewportHeight - MENU_MARGIN) {
        top = Math.max(MENU_MARGIN, anchor.y - rect.height)
      }
    }

    setPosition((current) =>
      current && current.left === left && current.top === top ? current : { left, top },
    )
  }, [anchor, collision])

  // 打开后聚焦第一个可用项
  useEffect(() => {
    if (!anchor) return
    const frame = window.requestAnimationFrame(() => {
      const first = getMenuItems(menuRef.current).find((item) => !item.disabled)
      first?.focus()
    })
    return () => window.cancelAnimationFrame(frame)
  }, [anchor])

  // 点击外部 / Esc / 滚动 / 缩放关闭
  useEffect(() => {
    if (!anchor) return

    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (menuRef.current?.contains(target) || triggerRef.current?.contains(target)) return
      close()
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      close(true)
    }
    const handleViewportChange = (event: Event) => {
      const target = event.target
      if (target instanceof Node && menuRef.current?.contains(target)) return
      close()
    }

    document.addEventListener('mousedown', handleMouseDown, true)
    document.addEventListener('keydown', handleKeyDown, true)
    window.addEventListener('scroll', handleViewportChange, true)
    window.addEventListener('resize', handleViewportChange)
    return () => {
      document.removeEventListener('mousedown', handleMouseDown, true)
      document.removeEventListener('keydown', handleKeyDown, true)
      window.removeEventListener('scroll', handleViewportChange, true)
      window.removeEventListener('resize', handleViewportChange)
    }
  }, [anchor])

  const handleMenuKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      close(true)
      return
    }
    if (event.key === 'Tab') {
      event.preventDefault()
      close()
      return
    }

    const visibleItems = getMenuItems(menuRef.current).filter((item) => !item.disabled)
    if (visibleItems.length === 0) return

    const active = document.activeElement
    const index = visibleItems.findIndex((item) => item === active)

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      const next = index < 0 ? visibleItems[0] : visibleItems[(index + 1) % visibleItems.length]
      next?.focus()
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      const next = index <= 0 ? visibleItems[visibleItems.length - 1] : visibleItems[index - 1]
      next?.focus()
      return
    }
    if (event.key === 'Home') {
      event.preventDefault()
      visibleItems[0]?.focus()
      return
    }
    if (event.key === 'End') {
      event.preventDefault()
      visibleItems[visibleItems.length - 1]?.focus()
    }
  }

  const handleItemSelect = (item: ContextMenuItem) => {
    if (item.disabled) return
    item.onSelect?.()
    onSelect?.(item.key)
    close(true)
  }

  return (
    <>
      <div
        ref={triggerRef}
        className={cx('aelux-context-menu__trigger', className)}
        onContextMenu={(event) => {
          if (disabled) return
          event.preventDefault()
          openAt(event.clientX, event.clientY)
        }}
        onMouseDown={() => {
          if (anchor) close()
        }}
        onKeyDown={(event) => {
          if (disabled) return
          const isMenuKey = event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')
          if (!isMenuKey) return
          event.preventDefault()
          const rect = triggerRef.current?.getBoundingClientRect()
          openAt(rect ? rect.left : 0, rect ? rect.bottom : 0)
        }}
      >
        {children}
      </div>

      {anchor && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={menuRef}
              role="menu"
              aria-label={ariaLabel}
              className="aelux-context-menu__menu"
              style={{
                left: position?.left ?? anchor.x,
                top: position?.top ?? anchor.y,
                visibility: position ? 'visible' : 'hidden',
              }}
              onKeyDown={handleMenuKeyDown}
              onContextMenu={(event) => event.preventDefault()}
            >
              {items.map((entry, index) => {
                const entryKey = entry.key ?? `${entry.type ?? 'item'}-${index}`

                if (isSeparator(entry)) {
                  return (
                    <div
                      key={entryKey}
                      role="separator"
                      className="aelux-context-menu__separator"
                    />
                  )
                }

                if (isLabel(entry)) {
                  return (
                    <div
                      key={entryKey}
                      role="presentation"
                      className="aelux-context-menu__group-label"
                    >
                      {entry.label}
                    </div>
                  )
                }

                const checkable = entry.checked !== undefined
                return (
                  <button
                    key={entryKey}
                    type="button"
                    role={checkable ? 'menuitemcheckbox' : 'menuitem'}
                    tabIndex={-1}
                    aria-checked={checkable ? entry.checked : undefined}
                    disabled={entry.disabled}
                    className={cx(
                      'aelux-context-menu__item',
                      entry.danger && 'aelux-context-menu__item--danger',
                      entry.checked && 'aelux-context-menu__item--checked',
                      entry.disabled && 'aelux-context-menu__item--disabled',
                    )}
                    onClick={() => handleItemSelect(entry)}
                  >
                    <span className="aelux-context-menu__indicator">
                      {entry.checked ? <IconCheck size={14} /> : entry.icon}
                    </span>
                    <span className="aelux-context-menu__label">{entry.label}</span>
                    {entry.shortcut ? (
                      <span className="aelux-context-menu__shortcut">{entry.shortcut}</span>
                    ) : null}
                  </button>
                )
              })}
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
