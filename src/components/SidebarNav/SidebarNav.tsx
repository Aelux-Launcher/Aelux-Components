import { forwardRef, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface SidebarNavItem {
  key: string
  label: ReactNode
  icon?: ReactNode
  badge?: ReactNode
  disabled?: boolean
}

export interface SidebarNavGroup {
  key: string
  label?: ReactNode
  items: SidebarNavItem[]
}

export interface SidebarNavProps {
  /** 导航分组 */
  groups: SidebarNavGroup[]
  /** 受控当前项 key */
  value?: string
  /** 非受控默认项 key */
  defaultValue?: string
  /** 选中项变化回调 */
  onValueChange?: (key: string) => void
  /** 顶部插槽 */
  header?: ReactNode
  /** 底部插槽 */
  footer?: ReactNode
  /** 折叠为仅图标模式（宽度 56px） */
  collapsed?: boolean
  /** 展开时宽度，默认 240 */
  width?: number | string
  /** 导航区域的 aria-label，默认「侧边导航」 */
  ariaLabel?: string
  className?: string
}

function flattenItems(groups: SidebarNavGroup[]): SidebarNavItem[] {
  return groups.reduce<SidebarNavItem[]>((all, group) => all.concat(group.items), [])
}

function firstEnabledIndex(items: SidebarNavItem[]): number {
  return items.findIndex((item) => !item.disabled)
}

function lastEnabledIndex(items: SidebarNavItem[]): number {
  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (!items[index].disabled) return index
  }
  return -1
}

function findEnabledIndex(items: SidebarNavItem[], start: number, step: 1 | -1): number {
  const total = items.length
  for (let offset = 1; offset <= total; offset += 1) {
    const index = (start + step * offset + total * total) % total
    const candidate = items[index]
    if (candidate && !candidate.disabled) return index
  }
  return start
}

/**
 * 侧边导航 —— 紧凑的 GitHub 式侧栏，支持分组、图标 / 徽标 / 禁用项、受控与非受控选中、
 * 折叠图标模式以及 header / footer 插槽。↑ ↓ 在可见项间移动，Home / End 跳转首尾。
 */
export const SidebarNav = forwardRef<HTMLElement, SidebarNavProps>(function SidebarNav(
  {
    groups,
    value,
    defaultValue,
    onValueChange,
    header,
    footer,
    collapsed = false,
    width = 240,
    ariaLabel = '侧边导航',
    className,
  },
  ref,
) {
  const [innerValue, setInnerValue] = useState<string | undefined>(defaultValue)
  const isControlled = value !== undefined
  const requested = isControlled ? value : innerValue

  const items = flattenItems(groups)
  const requestedItem = requested === undefined ? undefined : items.find((item) => item.key === requested)
  const activeKey = requestedItem && !requestedItem.disabled ? requestedItem.key : undefined

  const navRef = useRef<HTMLElement>(null)
  const itemRefs = useRef(new Map<string, HTMLButtonElement>())
  const itemIndexByKey = new Map<string, number>()
  items.forEach((item, index) => {
    itemIndexByKey.set(item.key, index)
  })

  // 选中项变化时只在导航容器内部滚动，避免带动整个页面滚动。
  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const fallbackIndex = firstEnabledIndex(items)
    const targetKey = activeKey ?? (fallbackIndex >= 0 ? items[fallbackIndex].key : undefined)
    if (targetKey === undefined) return
    const node = itemRefs.current.get(targetKey)
    if (!node) return
    const navRect = nav.getBoundingClientRect()
    const nodeRect = node.getBoundingClientRect()
    if (nodeRect.top < navRect.top) {
      nav.scrollTop -= navRect.top - nodeRect.top
    } else if (nodeRect.bottom > navRect.bottom) {
      nav.scrollTop += nodeRect.bottom - navRect.bottom
    }
    // groups / items 变化时同样需要校正滚动位置。
  }, [activeKey, collapsed, groups])

  const select = (key: string) => {
    if (!isControlled) setInnerValue(key)
    onValueChange?.(key)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | undefined
    if (event.key === 'ArrowDown') {
      nextIndex = findEnabledIndex(items, index, 1)
    } else if (event.key === 'ArrowUp') {
      nextIndex = findEnabledIndex(items, index, -1)
    } else if (event.key === 'Home') {
      nextIndex = firstEnabledIndex(items)
    } else if (event.key === 'End') {
      nextIndex = lastEnabledIndex(items)
    }

    if (nextIndex === undefined || nextIndex < 0) return
    const nextItem = items[nextIndex]
    if (!nextItem || nextItem.disabled) return

    event.preventDefault()
    itemRefs.current.get(nextItem.key)?.focus()
    select(nextItem.key)
  }

  const tabStopKey = activeKey ?? (firstEnabledIndex(items) >= 0 ? items[firstEnabledIndex(items)].key : undefined)

  return (
    <aside
      ref={ref}
      className={cx('aelux-sidebar', collapsed && 'aelux-sidebar--collapsed', className)}
      style={{ width: collapsed ? 56 : width }}
    >
      {header !== undefined ? <div className="aelux-sidebar__header">{header}</div> : null}
      <nav ref={navRef} className="aelux-sidebar__nav" aria-label={ariaLabel}>
        {groups.map((group) => (
          <div key={group.key} className="aelux-sidebar__group">
            {group.label !== undefined && !collapsed ? (
              <div className="aelux-sidebar__group-label">{group.label}</div>
            ) : null}
            <div className="aelux-sidebar__items">
              {group.items.map((item) => {
                const active = item.key === activeKey
                const index = itemIndexByKey.get(item.key) ?? 0
                return (
                  <button
                    key={item.key}
                    type="button"
                    className={cx(
                      'aelux-sidebar__item',
                      active && 'aelux-sidebar__item--active',
                      item.disabled && 'aelux-sidebar__item--disabled',
                    )}
                    aria-current={active ? 'page' : undefined}
                    disabled={item.disabled}
                    tabIndex={item.key === tabStopKey ? 0 : -1}
                    title={collapsed && typeof item.label === 'string' ? item.label : undefined}
                    ref={(node) => {
                      if (node) itemRefs.current.set(item.key, node)
                      else itemRefs.current.delete(item.key)
                    }}
                    onClick={() => {
                      if (!item.disabled) select(item.key)
                    }}
                    onKeyDown={(event) => handleKeyDown(event, index)}
                  >
                    {item.icon !== undefined ? (
                      <span className="aelux-sidebar__item-icon">{item.icon}</span>
                    ) : null}
                    <span className="aelux-sidebar__item-label">{item.label}</span>
                    {item.badge !== undefined ? (
                      <span className="aelux-sidebar__item-badge">{item.badge}</span>
                    ) : null}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
      {footer !== undefined ? <div className="aelux-sidebar__footer">{footer}</div> : null}
    </aside>
  )
})

SidebarNav.displayName = 'SidebarNav'
