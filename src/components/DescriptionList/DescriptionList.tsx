import { forwardRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface DescriptionItem {
  key?: string
  label: ReactNode
  value: ReactNode
  span?: 1 | 2 | 3
}

export interface DescriptionListProps {
  items: DescriptionItem[]
  columns?: 1 | 2 | 3
  layout?: 'horizontal' | 'vertical'
  bordered?: boolean
  size?: 'sm' | 'md'
  ariaLabel?: string
  className?: string
}

const getSpanStyle = (span: DescriptionItem['span'], columns: number): CSSProperties | undefined => {
  const effectiveSpan = Math.min(span ?? 1, columns)
  return effectiveSpan > 1 ? { gridColumn: `span ${effectiveSpan}` } : undefined
}

/**
 * 键值对列表 —— CSS Grid 多列布局，支持横向 / 纵向、带边框与跨列。
 */
export const DescriptionList = forwardRef<HTMLDListElement, DescriptionListProps>(
  function DescriptionList(
    {
      items,
      columns = 2,
      layout = 'horizontal',
      bordered = false,
      size = 'md',
      ariaLabel,
      className,
    },
    ref,
  ) {
    return (
      <dl
        ref={ref}
        aria-label={ariaLabel}
        className={cx(
          'aelux-description-list',
          `aelux-description-list--columns-${columns}`,
          `aelux-description-list--${layout}`,
          `aelux-description-list--${size}`,
          bordered && 'aelux-description-list--bordered',
          className,
        )}
      >
        {items.map((item, index) => (
          <div
            key={item.key ?? index}
            className="aelux-description-list__item"
            style={getSpanStyle(item.span, columns)}
          >
            <dt className="aelux-description-list__label">{item.label}</dt>
            <dd className="aelux-description-list__value">{item.value}</dd>
          </div>
        ))}
      </dl>
    )
  },
)

DescriptionList.displayName = 'DescriptionList'
