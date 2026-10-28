import { forwardRef, useState } from 'react'
import type { ReactNode } from 'react'
import { SearchInput } from '../SearchInput'
import { cx } from '../../utils/cx'

export interface FilterOption {
  value: string
  label: ReactNode
  icon?: ReactNode
  count?: number
}

export interface FilterBarProps {
  filters: FilterOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  /** 右侧操作区（排序、视图切换等） */
  actions?: ReactNode
  sticky?: boolean
  className?: string
  ariaLabel?: string
}

/**
 * 过滤栏 —— 一行工具条：左侧 pill 过滤组（选中态主色浅底 + 计数），
 * 可选内嵌 SearchInput，右侧 actions 插槽；支持换行与 sticky 吸顶（半透明背景 + 模糊）。
 * 过滤项为单选按钮组，选中项带 aria-pressed；搜索框受控/非受控均可。
 */
export const FilterBar = forwardRef<HTMLDivElement, FilterBarProps>(function FilterBar(
  {
    filters,
    value,
    defaultValue,
    onValueChange,
    searchValue,
    onSearchChange,
    searchPlaceholder,
    actions,
    sticky = false,
    className,
    ariaLabel,
  },
  ref,
) {
  const isControlled = value !== undefined
  const [innerValue, setInnerValue] = useState<string>(() => defaultValue ?? filters[0]?.value ?? '')
  const currentValue = isControlled ? (value ?? '') : innerValue

  const searchControlled = searchValue !== undefined
  const [innerSearch, setInnerSearch] = useState('')
  const showSearch = searchControlled || onSearchChange !== undefined
  const currentSearch = searchControlled ? (searchValue ?? '') : innerSearch

  const updateFilter = (next: string) => {
    if (!isControlled) setInnerValue(next)
    onValueChange?.(next)
  }

  const updateSearch = (next: string) => {
    if (!searchControlled) setInnerSearch(next)
    onSearchChange?.(next)
  }

  return (
    <div
      ref={ref}
      role="toolbar"
      aria-orientation="horizontal"
      aria-label={ariaLabel ?? '过滤栏'}
      className={cx('aelux-filter-bar', sticky && 'aelux-filter-bar--sticky', className)}
    >
      <div className="aelux-filter-bar__filters" role="group" aria-label="筛选条件">
        {filters.map((filter) => {
          const active = filter.value === currentValue
          return (
            <button
              key={filter.value}
              type="button"
              className={cx('aelux-filter-bar__filter', active && 'aelux-filter-bar__filter--active')}
              aria-pressed={active}
              onClick={() => updateFilter(filter.value)}
            >
              {filter.icon !== undefined ? (
                <span className="aelux-filter-bar__filter-icon" aria-hidden="true">
                  {filter.icon}
                </span>
              ) : null}
              <span className="aelux-filter-bar__filter-label">{filter.label}</span>
              {filter.count !== undefined ? (
                <span className="aelux-filter-bar__filter-count" aria-hidden="true">
                  {filter.count}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>
      {showSearch ? (
        <div className="aelux-filter-bar__search">
          <SearchInput
            size="sm"
            block
            allowClear
            value={currentSearch}
            onValueChange={updateSearch}
            placeholder={searchPlaceholder ?? '搜索…'}
            aria-label={searchPlaceholder ?? '搜索'}
          />
        </div>
      ) : null}
      {actions !== undefined ? <div className="aelux-filter-bar__actions">{actions}</div> : null}
    </div>
  )
})

FilterBar.displayName = 'FilterBar'
