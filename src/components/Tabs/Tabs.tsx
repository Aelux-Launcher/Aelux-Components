import { forwardRef, useId, useState } from 'react'
import type { HTMLAttributes, KeyboardEvent, ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface TabItem {
  key: string
  label: ReactNode
  icon?: ReactNode
  disabled?: boolean
  content?: ReactNode
}

export type TabsVariant = 'line' | 'pill'
export type TabsSize = 'sm' | 'md'

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** 标签页数据 */
  items: TabItem[]
  /** 受控当前项 key */
  value?: string
  /** 非受控默认项 key */
  defaultValue?: string
  /** 切换回调 */
  onChange?: (key: string) => void
  /** 外观，默认 line */
  variant?: TabsVariant
  /** 尺寸，默认 md */
  size?: TabsSize
  /** 标签是否等宽铺满 */
  block?: boolean
}

function firstEnabledKey(items: TabItem[]): string | undefined {
  return items.find((item) => !item.disabled)?.key
}

function findEnabledIndex(items: TabItem[], start: number, step: 1 | -1): number {
  const total = items.length
  for (let offset = 1; offset <= total; offset += 1) {
    const index = (start + step * offset + total * total) % total
    const candidate = items[index]
    if (candidate && !candidate.disabled) return index
  }
  return start
}

/**
 * 标签页 —— 支持 line / pill 外观、受控与非受控切换、禁用项、图标与 block 等宽布局。
 * 遵循 ARIA tablist / tab / tabpanel 模式：← → 切换并移动焦点，Home / End 跳转首尾。
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  {
    items,
    value,
    defaultValue,
    onChange,
    variant = 'line',
    size = 'md',
    block = false,
    className,
    ...rest
  },
  ref,
) {
  const baseId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const [innerValue, setInnerValue] = useState<string | undefined>(defaultValue)

  const isControlled = value !== undefined
  const requested = isControlled ? value : innerValue
  const requestedItem = requested === undefined ? undefined : items.find((item) => item.key === requested)
  const activeKey = requestedItem && !requestedItem.disabled ? requestedItem.key : firstEnabledKey(items)

  const selectTab = (key: string) => {
    if (!isControlled) setInnerValue(key)
    onChange?.(key)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | undefined
    if (event.key === 'ArrowRight') {
      nextIndex = findEnabledIndex(items, index, 1)
    } else if (event.key === 'ArrowLeft') {
      nextIndex = findEnabledIndex(items, index, -1)
    } else if (event.key === 'Home') {
      nextIndex = items.findIndex((item) => !item.disabled)
    } else if (event.key === 'End') {
      for (let cursor = items.length - 1; cursor >= 0; cursor -= 1) {
        if (!items[cursor].disabled) {
          nextIndex = cursor
          break
        }
      }
    }

    if (nextIndex === undefined || nextIndex < 0) return
    const nextItem = items[nextIndex]
    if (!nextItem || nextItem.disabled) return

    event.preventDefault()
    const buttons = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
    buttons?.[nextIndex]?.focus()
    selectTab(nextItem.key)
  }

  const showPanels = items.some((item) => item.content !== undefined)

  return (
    <div
      ref={ref}
      className={cx(
        'aelux-tabs',
        `aelux-tabs--${variant}`,
        `aelux-tabs--${size}`,
        block && 'aelux-tabs--block',
        className,
      )}
      {...rest}
    >
      <div className="aelux-tabs__nav" role="tablist" aria-orientation="horizontal">
        {items.map((item, index) => {
          const active = item.key === activeKey
          const tabId = `${baseId}-tab-${item.key}`
          const panelId = `${baseId}-panel-${item.key}`
          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              id={tabId}
              aria-selected={active}
              aria-controls={showPanels ? panelId : undefined}
              disabled={item.disabled}
              tabIndex={active ? 0 : -1}
              className={cx(
                'aelux-tabs__tab',
                active && 'aelux-tabs__tab--active',
                item.disabled && 'aelux-tabs__tab--disabled',
              )}
              onClick={() => {
                if (!item.disabled) selectTab(item.key)
              }}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {item.icon ? <span className="aelux-tabs__tab-icon">{item.icon}</span> : null}
              <span className="aelux-tabs__tab-label">{item.label}</span>
            </button>
          )
        })}
      </div>
      {showPanels
        ? items.map((item) => {
            const active = item.key === activeKey
            const tabId = `${baseId}-tab-${item.key}`
            const panelId = `${baseId}-panel-${item.key}`
            return (
              <div
                key={item.key}
                role="tabpanel"
                id={panelId}
                aria-labelledby={tabId}
                className="aelux-tabs__panel"
                hidden={!active}
                tabIndex={active ? 0 : -1}
              >
                {item.content}
              </div>
            )
          })
        : null}
    </div>
  )
})

Tabs.displayName = 'Tabs'
