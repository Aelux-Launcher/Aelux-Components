import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface BreadcrumbItem {
  key?: string
  label: ReactNode
  onClick?: () => void
  href?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  separator?: ReactNode
  ariaLabel?: string
  className?: string
}

/**
 * 面包屑 —— nav + ol 语义结构；最后一项 aria-current="page"，其余项可点击或跳转。
 */
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { items, separator = '/', ariaLabel, className },
  ref,
) {
  return (
    <nav ref={ref} className={cx('aelux-breadcrumb', className)} aria-label={ariaLabel ?? '面包屑'}>
      <ol className="aelux-breadcrumb__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          let content: ReactNode
          if (isLast) {
            content = (
              <span className="aelux-breadcrumb__current" aria-current="page">
                {item.label}
              </span>
            )
          } else if (item.href) {
            content = (
              <a className="aelux-breadcrumb__link" href={item.href} onClick={item.onClick}>
                {item.label}
              </a>
            )
          } else if (item.onClick) {
            content = (
              <button type="button" className="aelux-breadcrumb__link" onClick={item.onClick}>
                {item.label}
              </button>
            )
          } else {
            content = <span className="aelux-breadcrumb__text">{item.label}</span>
          }
          return (
            <li key={item.key ?? index} className="aelux-breadcrumb__item">
              {content}
              {!isLast ? (
                <span className="aelux-breadcrumb__separator" aria-hidden="true">
                  {separator}
                </span>
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
})

Breadcrumb.displayName = 'Breadcrumb'
