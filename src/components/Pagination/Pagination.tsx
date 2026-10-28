import { forwardRef } from 'react'
import { IconChevronLeft, IconChevronRight } from '../../icons'
import { cx } from '../../utils/cx'

export interface PaginationProps {
  /** 当前页码（从 1 开始） */
  page: number
  /** 每页条数，默认 10 */
  pageSize?: number
  /** 数据总条数 */
  total: number
  /** 页码变化回调 */
  onPageChange: (page: number) => void
  /** 当前页两侧显示的兄弟页码数，默认 1 */
  siblingCount?: number
  /** 是否显示「第 x-y 条，共 n 条」 */
  showTotal?: boolean
  /** 尺寸，默认 md */
  size?: 'sm' | 'md'
  /** 禁用全部分页操作 */
  disabled?: boolean
  /** 分页导航的 aria-label，默认「分页」 */
  ariaLabel?: string
  className?: string
}

type PageToken = number | 'ellipsis-start' | 'ellipsis-end'

function buildPageTokens(current: number, pageCount: number, siblingCount: number): PageToken[] {
  const slots = siblingCount * 2 + 5
  if (slots >= pageCount) {
    return Array.from({ length: pageCount }, (_, index) => index + 1)
  }
  const start = Math.max(2, current - siblingCount)
  const end = Math.min(pageCount - 1, current + siblingCount)

  const tokens: PageToken[] = [1]
  if (start > 2) tokens.push('ellipsis-start')
  for (let index = start; index <= end; index += 1) tokens.push(index)
  if (end < pageCount - 1) tokens.push('ellipsis-end')
  tokens.push(pageCount)
  return tokens
}

/**
 * 分页 —— 受控页码，按 siblingCount 计算页码与省略号，支持上一页 / 下一页、
 * 总条数展示、尺寸与整体禁用。当前页标记 aria-current="page"。
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    page,
    pageSize = 10,
    total,
    onPageChange,
    siblingCount = 1,
    showTotal = false,
    size = 'md',
    disabled = false,
    ariaLabel,
    className,
  },
  ref,
) {
  const pageCount = Math.max(1, Math.ceil(Math.max(total, 0) / Math.max(pageSize, 1)))
  const current = Math.min(Math.max(page, 1), pageCount)
  const tokens = buildPageTokens(current, pageCount, Math.max(siblingCount, 0))

  const from = total === 0 ? 0 : (current - 1) * pageSize + 1
  const to = Math.min(current * pageSize, total)

  const goTo = (next: number) => {
    if (disabled) return
    if (next < 1 || next > pageCount || next === current) return
    onPageChange(next)
  }

  const navButtonClass = cx('aelux-pagination__nav', `aelux-pagination__nav--${size}`)
  const pageButtonClass = cx('aelux-pagination__page', `aelux-pagination__page--${size}`)

  return (
    <nav ref={ref} aria-label={ariaLabel ?? '分页'} className={cx('aelux-pagination', `aelux-pagination--${size}`, className)}>
      {showTotal ? (
        <span className="aelux-pagination__total" aria-live="polite">
          {total === 0 ? '共 0 条' : `第 ${from}-${to} 条，共 ${total} 条`}
        </span>
      ) : null}
      <div className="aelux-pagination__buttons">
        <button
          type="button"
          className={navButtonClass}
          disabled={disabled || current <= 1}
          aria-label="上一页"
          onClick={() => goTo(current - 1)}
        >
          <IconChevronLeft size={14} />
          <span className="aelux-pagination__nav-text">上一页</span>
        </button>
        {tokens.map((token) =>
          typeof token === 'number' ? (
            <button
              key={token}
              type="button"
              className={cx(pageButtonClass, token === current && 'aelux-pagination__page--active')}
              aria-label={`第 ${token} 页`}
              aria-current={token === current ? 'page' : undefined}
              disabled={disabled}
              onClick={() => goTo(token)}
            >
              {token}
            </button>
          ) : (
            <span key={token} className="aelux-pagination__ellipsis" aria-hidden="true">
              …
            </span>
          ),
        )}
        <button
          type="button"
          className={navButtonClass}
          disabled={disabled || current >= pageCount}
          aria-label="下一页"
          onClick={() => goTo(current + 1)}
        >
          <span className="aelux-pagination__nav-text">下一页</span>
          <IconChevronRight size={14} />
        </button>
      </div>
    </nav>
  )
})

Pagination.displayName = 'Pagination'
