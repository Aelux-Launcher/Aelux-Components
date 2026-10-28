import { forwardRef, useCallback, useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { IconChevronDown } from '../../icons'
import { composeRefs } from '../../utils/composeRefs'
import { cx } from '../../utils/cx'
import { Button } from '../Button'

export interface SplitButtonItem {
  key: string
  label: ReactNode
  icon?: ReactNode
  disabled?: boolean
  onSelect?: () => void
}

export interface SplitButtonProps {
  /** 主按钮内容 */
  children: ReactNode
  /** 主按钮点击 */
  onClick?: () => void
  /** 下拉菜单项 */
  items: SplitButtonItem[]
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  placement?: 'bottom-start' | 'bottom-end'
  /** 箭头按钮的无障碍名称，默认「更多操作」 */
  menuLabel?: string
  /** 附加类名 */
  className?: string
}

const MENU_GAP = 4

interface MenuPosition {
  left: number
  top: number
}

/**
 * 分裂按钮 —— 主操作 + 箭头展开的快捷菜单（portal + fixed 定位，完整键盘导航）。
 */
export const SplitButton = forwardRef<HTMLDivElement, SplitButtonProps>(function SplitButton(
  {
    children,
    onClick,
    items,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    placement = 'bottom-start',
    menuLabel,
    className,
  },
  ref,
) {
  const menuId = useId()
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const toggleRef = useRef<HTMLButtonElement | null>(null)
  const itemRefs = useRef(new Map<string, HTMLButtonElement>())
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<MenuPosition | null>(null)

  const menuDisabled = disabled || loading || items.length === 0
  const menuName = menuLabel ?? '更多操作'

  const updatePosition = useCallback(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const rect = wrapper.getBoundingClientRect()
    setPosition({
      left: placement === 'bottom-end' ? rect.right : rect.left,
      top: rect.bottom + MENU_GAP,
    })
  }, [placement])

  // 展开时定位，滚动 / 窗口尺寸变化时跟随
  useEffect(() => {
    if (!open) {
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
  }, [open, updatePosition])

  // 打开后把焦点交给第一个可用菜单项
  useEffect(() => {
    if (!open) return
    const frame = window.requestAnimationFrame(() => {
      const first = Array.from(itemRefs.current.values()).find((node) => !node.disabled)
      first?.focus()
    })
    return () => window.cancelAnimationFrame(frame)
  }, [open])

  // 点击外部关闭
  useEffect(() => {
    if (!open) return
    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (panelRef.current?.contains(target)) return
      if (wrapperRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [open])

  const closeMenu = (restoreFocus: boolean) => {
    setOpen(false)
    if (restoreFocus) toggleRef.current?.focus()
  }

  const handleToggle = () => {
    if (menuDisabled) return
    if (open) {
      setOpen(false)
      return
    }
    updatePosition()
    setOpen(true)
  }

  const handleSelect = (item: SplitButtonItem) => {
    if (item.disabled) return
    setOpen(false)
    item.onSelect?.()
    toggleRef.current?.focus()
  }

  const handlePanelKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      closeMenu(true)
      return
    }
    if (event.key === 'Tab') {
      closeMenu(false)
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
      const nextIndex =
        currentIndex < 0 ? focusable.length - 1 : (currentIndex - 1 + focusable.length) % focusable.length
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

  return (
    <>
      <div ref={composeRefs(wrapperRef, ref)} className={cx('aelux-split-button', className)}>
        <Button
          className="aelux-split-button__main"
          variant={variant}
          size={size}
          loading={loading}
          disabled={disabled}
          onClick={onClick}
        >
          {children}
        </Button>
        <Button
          ref={toggleRef}
          className="aelux-split-button__toggle"
          variant={variant}
          size={size}
          disabled={menuDisabled}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={open ? menuId : undefined}
          aria-label={menuName}
          onClick={handleToggle}
          onKeyDown={(event) => {
            if (menuDisabled) return
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault()
              if (!open) {
                updatePosition()
                setOpen(true)
              }
              return
            }
            if (event.key === 'Escape' && open) {
              event.preventDefault()
              setOpen(false)
            }
          }}
        >
          <IconChevronDown size={size === 'lg' ? 16 : size === 'sm' ? 12 : 14} />
        </Button>
      </div>
      {open && position !== null && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={panelRef}
              id={menuId}
              role="menu"
              aria-label={menuName}
              className={cx('aelux-split-button__menu', `aelux-split-button__menu--${placement}`)}
              style={{ left: position.left, top: position.top }}
              onKeyDown={handlePanelKeyDown}
            >
              {items.map((item) => (
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
                  className="aelux-split-button__item"
                  onClick={() => handleSelect(item)}
                >
                  {item.icon == null ? null : (
                    <span className="aelux-split-button__item-icon" aria-hidden="true">
                      {item.icon}
                    </span>
                  )}
                  <span className="aelux-split-button__item-label">{item.label}</span>
                </button>
              ))}
            </div>,
            document.body,
          )
        : null}
    </>
  )
})

SplitButton.displayName = 'SplitButton'
