import { forwardRef, useId, useState } from 'react'
import type { ReactNode } from 'react'
import { IconChevronDown } from '../../icons'
import { cx } from '../../utils/cx'

export interface AccordionItem {
  key: string
  title: ReactNode
  description?: ReactNode
  icon?: ReactNode
  content: ReactNode
  disabled?: boolean
}

export interface AccordionProps {
  /** 折叠面板数据 */
  items: AccordionItem[]
  /** 受控展开项 key 列表 */
  value?: string[]
  /** 非受控默认展开项 key 列表 */
  defaultValue?: string[]
  /** 展开项变化回调 */
  onValueChange?: (value: string[]) => void
  /** 是否允许同时展开多项，默认 false */
  multiple?: boolean
  /** 外观，默认 bordered */
  variant?: 'bordered' | 'plain'
  /** 尺寸，默认 md */
  size?: 'sm' | 'md'
  className?: string
}

/**
 * 折叠面板 —— 受控 / 非受控展开、单选或多项展开、禁用项、图标与描述。
 * 触发器使用 aria-expanded / aria-controls，内容区是带 aria-labelledby 的 region，
 * 收起时通过 aria-hidden + inert 移出可访问性与焦点顺序，并用 grid-template-rows 做高度动画。
 */
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  { items, value, defaultValue, onValueChange, multiple = false, variant = 'bordered', size = 'md', className },
  ref,
) {
  const baseId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const [innerValue, setInnerValue] = useState<string[]>(() => defaultValue ?? [])
  const isControlled = value !== undefined
  const current = isControlled ? value : innerValue

  const toggle = (item: AccordionItem) => {
    if (item.disabled) return
    const open = current.includes(item.key)
    let next: string[]
    if (multiple) {
      next = open ? current.filter((key) => key !== item.key) : [...current, item.key]
    } else {
      next = open ? [] : [item.key]
    }
    if (!isControlled) setInnerValue(next)
    onValueChange?.(next)
  }

  return (
    <div
      ref={ref}
      className={cx('aelux-accordion', `aelux-accordion--${variant}`, `aelux-accordion--${size}`, className)}
    >
      {items.map((item) => {
        const open = current.includes(item.key)
        const triggerId = `${baseId}-trigger-${item.key}`
        const panelId = `${baseId}-panel-${item.key}`
        return (
          <div
            key={item.key}
            className={cx(
              'aelux-accordion__item',
              open && 'aelux-accordion__item--open',
              item.disabled && 'aelux-accordion__item--disabled',
            )}
          >
            <h3 className="aelux-accordion__heading">
              <button
                type="button"
                id={triggerId}
                className="aelux-accordion__trigger"
                aria-expanded={open}
                aria-controls={panelId}
                disabled={item.disabled}
                onClick={() => toggle(item)}
              >
                {item.icon !== undefined ? <span className="aelux-accordion__icon">{item.icon}</span> : null}
                <span className="aelux-accordion__heading-text">
                  <span className="aelux-accordion__title">{item.title}</span>
                  {item.description !== undefined ? (
                    <span className="aelux-accordion__description">{item.description}</span>
                  ) : null}
                </span>
                <span className="aelux-accordion__chevron" aria-hidden="true">
                  <IconChevronDown size={14} />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              aria-hidden={!open}
              inert={!open}
              className={cx('aelux-accordion__panel', open && 'aelux-accordion__panel--open')}
            >
              <div className="aelux-accordion__panel-inner">
                <div className="aelux-accordion__content">{item.content}</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
})

Accordion.displayName = 'Accordion'
