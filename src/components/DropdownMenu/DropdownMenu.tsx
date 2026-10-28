import { cloneElement, useCallback, useEffect, useId, useRef, useState } from 'react'
import type {
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  ReactElement,
  ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { IconCheck } from '../../icons'
import { cx } from '../../utils/cx'

export interface DropdownMenuItem {
  key: string
  label: ReactNode
  icon?: ReactNode
  shortcut?: string
  disabled?: boolean
  danger?: boolean
  checked?: boolean
  type?: 'item'
}

export interface DropdownMenuSeparator {
  key: string
  type: 'separator'
}

export interface DropdownMenuLabel {
  key: string
  type: 'label'
  label: ReactNode
}

export type DropdownItem = DropdownMenuItem | DropdownMenuSeparator | DropdownMenuLabel

export type DropdownMenuPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'

export interface DropdownMenuProps {
  /** 触发元素（单个 React 元素，建议使用 Button） */
  trigger: ReactElement
  /** 菜单项：普通项 / 分隔线 / 分组标题 */
  items: DropdownItem[]
  /** 选中回调 */
  onSelect?: (key: string) => void
  /** 弹出位置，默认 bottom-start */
  placement?: DropdownMenuPlacement
  /** 菜单宽度；不传时与触发元素同宽 */
  width?: number
  /** 禁用 */
  disabled?: boolean
  /** 受控展开状态 */
  open?: boolean
  /** 展开状态变化回调 */
  onOpenChange?: (open: boolean) => void
  /** 触发容器附加 class */
  className?: string
}

interface DropdownTriggerProps {
  id?: string
  onClick?: (event: ReactMouseEvent<HTMLElement>) => void
  onKeyDown?: (event: ReactKeyboardEvent<HTMLElement>) => void
  'aria-haspopup'?: 'menu'
  'aria-expanded'?: boolean
  'aria-controls'?: string
  'aria-disabled'?: boolean
}

interface DropdownPosition {
  left: number
  top: number
  triggerWidth: number
}

const MENU_GAP = 4

function isSeparator(item: DropdownItem): item is DropdownMenuSeparator {
  return item.type === 'separator'
}

function isLabel(item: DropdownItem): item is DropdownMenuLabel {
  return item.type === 'label'
}

/**
 * 下拉菜单 —— portal + fixed 定位，完整键盘导航（↑↓ / Home / End / Enter / Esc）与 roving focus。
 */
export function DropdownMenu({
  trigger,
  items,
  onSelect,
  placement = 'bottom-start',
  width,
  disabled = false,
  open,
  onOpenChange,
  className,
}: DropdownMenuProps) {
  const menuId = useId()
  const wrapperRef = useRef<HTMLSpanElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef(new Map<string, HTMLButtonElement>())
  const [innerOpen, setInnerOpen] = useState(false)
  const [position, setPosition] = useState<DropdownPosition | null>(null)

  const controlled = open !== undefined
  const actualOpen = controlled ? open : innerOpen

  const onOpenChangeRef = useRef(onOpenChange)
  const actualOpenRef = useRef(actualOpen)
  const controlledRef = useRef(controlled)
  onOpenChangeRef.current = onOpenChange
  actualOpenRef.current = actualOpen
  controlledRef.current = controlled

  const setOpen = useCallback((next: boolean) => {
    if (actualOpenRef.current === next) return
    if (!controlledRef.current) setInnerOpen(next)
    onOpenChangeRef.current?.(next)
  }, [])

  const getTriggerElement = (): HTMLElement | null => {
    const child = wrapperRef.current?.firstElementChild
    return child instanceof HTMLElement ? child : null
  }

  const focusTrigger = () => {
    const element = getTriggerElement()
    if (element) element.focus()
  }

  const updatePosition = useCallback(() => {
    const element = wrapperRef.current?.firstElementChild
    if (!(element instanceof HTMLElement)) return
    const rect = element.getBoundingClientRect()
    const isTop = placement === 'top-start' || placement === 'top-end'
    const isEnd = placement === 'bottom-end' || placement === 'top-end'
    setPosition({
      left: isEnd ? rect.right : rect.left,
      top: isTop ? rect.top - MENU_GAP : rect.bottom + MENU_GAP,
      triggerWidth: rect.width,
    })
  }, [placement])

  // 展开时定位，滚动 / 窗口尺寸变化时跟随
  useEffect(() => {
    if (!actualOpen) {
      setPosition(null)
      return
    }
    updatePosition()
    const handleChange = () => updatePosition()
    window.addEventListener('scroll', handleChange, true)
    window.addEventListener('resize', handleChange)
    return () => {
      window.removeEventListener('scroll', handleChange, true)
      window.removeEventListener('resize', handleChange)
    }
  }, [actualOpen, updatePosition])

  // 打开后把焦点交给第一个可用菜单项（菜单标准交互）
  useEffect(() => {
    if (!actualOpen) return
    const frame = window.requestAnimationFrame(() => {
      const first = Array.from(itemRefs.current.values()).find((node) => !node.disabled)
      first?.focus()
    })
    return () => window.cancelAnimationFrame(frame)
  }, [actualOpen])

  // 点击外部关闭
  useEffect(() => {
    if (!actualOpen) return
    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (panelRef.current?.contains(target)) return
      if (wrapperRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [actualOpen, setOpen])

  const closeAndRestoreFocus = () => {
    setOpen(false)
    focusTrigger()
  }

  const handleSelect = (item: DropdownMenuItem) => {
    if (item.disabled) return
    onSelect?.(item.key)
    closeAndRestoreFocus()
  }

  const handlePanelKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      closeAndRestoreFocus()
      return
    }
    if (event.key === 'Tab') {
      event.preventDefault()
      closeAndRestoreFocus()
      return
    }
    const focusable = Array.from(itemRefs.current.values()).filter((node) => !node.disabled)
    if (focusable.length === 0) return
    const currentIndex = focusable.findIndex((node) => node === document.activeElement)
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % focusable.length
      focusable[nextIndex]?.focus()
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      const nextIndex = currentIndex < 0 ? focusable.length - 1 : (currentIndex - 1 + focusable.length) % focusable.length
      focusable[nextIndex]?.focus()
      return
    }
    if (event.key === 'Home') {
      event.preventDefault()
      focusable[0]?.focus()
      return
    }
    if (event.key === 'End') {
      event.preventDefault()
      focusable[focusable.length - 1]?.focus()
    }
  }

  const child = trigger as ReactElement<DropdownTriggerProps>
  const childProps = child.props
  const triggerId = childProps.id ?? `${menuId}-trigger`

  const triggerElement = cloneElement(child, {
    id: triggerId,
    'aria-haspopup': 'menu',
    'aria-expanded': disabled ? undefined : actualOpen,
    'aria-controls': actualOpen ? menuId : undefined,
    'aria-disabled': disabled || undefined,
    onClick: (event: ReactMouseEvent<HTMLElement>) => {
      childProps.onClick?.(event)
      if (disabled) return
      updatePosition()
      setOpen(!actualOpenRef.current)
    },
    onKeyDown: (event: ReactKeyboardEvent<HTMLElement>) => {
      childProps.onKeyDown?.(event)
      if (disabled) return
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        updatePosition()
        setOpen(true)
        return
      }
      if (event.key === 'Escape' && actualOpenRef.current) {
        event.preventDefault()
        setOpen(false)
        return
      }
      // 原生按钮的 Enter / Space 会触发 click；非按钮触发元素在此手动展开
      if ((event.key === 'Enter' || event.key === ' ') && event.currentTarget.tagName !== 'BUTTON') {
        event.preventDefault()
        updatePosition()
        setOpen(!actualOpenRef.current)
      }
    },
  })

  return (
    <>
      <span ref={wrapperRef} className={cx('aelux-dropdown', className)}>
        {triggerElement}
      </span>
      {actualOpen && position !== null && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={panelRef}
              id={menuId}
              role="menu"
              aria-labelledby={triggerId}
              className={cx('aelux-dropdown-menu', `aelux-dropdown-menu--${placement}`)}
              style={{
                left: position.left,
                top: position.top,
                width: width == null ? undefined : width,
                minWidth: width == null ? position.triggerWidth : undefined,
              }}
              onKeyDown={handlePanelKeyDown}
            >
              {items.map((item) => {
                if (isSeparator(item)) {
                  return <div key={item.key} role="separator" className="aelux-dropdown-menu__separator" />
                }
                if (isLabel(item)) {
                  return (
                    <div key={item.key} role="presentation" className="aelux-dropdown-menu__group">
                      {item.label}
                    </div>
                  )
                }
                return (
                  <button
                    key={item.key}
                    ref={(node) => {
                      if (node) itemRefs.current.set(item.key, node)
                      else itemRefs.current.delete(item.key)
                    }}
                    type="button"
                    role="menuitem"
                    tabIndex={-1}
                    disabled={item.disabled}
                    aria-disabled={item.disabled || undefined}
                    className={cx(
                      'aelux-dropdown-menu__item',
                      item.danger && 'aelux-dropdown-menu__item--danger',
                      item.checked && 'is-checked',
                    )}
                    onClick={() => handleSelect(item)}
                  >
                    <span className="aelux-dropdown-menu__indicator" aria-hidden="true">
                      {item.checked ? <IconCheck size={14} /> : (item.icon ?? null)}
                    </span>
                    <span className="aelux-dropdown-menu__text">{item.label}</span>
                    {item.shortcut ? (
                      <span className="aelux-dropdown-menu__shortcut">{item.shortcut}</span>
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
