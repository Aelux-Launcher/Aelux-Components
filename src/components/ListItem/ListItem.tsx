import { forwardRef } from 'react'
import type { KeyboardEvent, MouseEventHandler, ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface ListItemProps {
  icon?: ReactNode
  title: ReactNode
  description?: ReactNode
  /** 标题右侧的小标记（例如版本号、状态） */
  meta?: ReactNode
  /** 右侧操作区 */
  trailing?: ReactNode
  selected?: boolean
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLDivElement>
  className?: string
  id?: string
}

/**
 * 列表项 —— 启动器实例列表的通用行：图标 + 标题 / 副标题 + 小标记 + 右侧操作。
 * 可点击时渲染为 role=button，支持 Enter / Space 触发。
 */
export const ListItem = forwardRef<HTMLDivElement, ListItemProps>(function ListItem(
  {
    icon,
    title,
    description,
    meta,
    trailing,
    selected = false,
    disabled = false,
    onClick,
    className,
    id,
  },
  ref,
) {
  const interactive = onClick != null && !disabled

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) return
    // 只响应行自身的按键，避免右侧操作按钮的 Enter 触发两次
    if (event.target !== event.currentTarget) return
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    event.currentTarget.click()
  }

  return (
    <div
      ref={ref}
      id={id}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-current={selected ? 'true' : undefined}
      aria-disabled={disabled || undefined}
      onClick={interactive ? onClick : undefined}
      onKeyDown={interactive ? handleKeyDown : undefined}
      className={cx(
        'aelux-list-item',
        interactive && 'aelux-list-item--clickable',
        selected && 'aelux-list-item--selected',
        disabled && 'aelux-list-item--disabled',
        className,
      )}
    >
      {icon != null ? (
        <span className="aelux-list-item__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className="aelux-list-item__main">
        <span className="aelux-list-item__title-row">
          <span className="aelux-list-item__title">{title}</span>
          {meta != null ? <span className="aelux-list-item__meta">{meta}</span> : null}
        </span>
        {description != null ? (
          <span className="aelux-list-item__description">{description}</span>
        ) : null}
      </span>
      {trailing != null ? <span className="aelux-list-item__trailing">{trailing}</span> : null}
    </div>
  )
})

ListItem.displayName = 'ListItem'
