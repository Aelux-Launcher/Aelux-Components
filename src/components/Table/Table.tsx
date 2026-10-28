import { isValidElement, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { Checkbox } from '../Checkbox'
import { Skeleton } from '../Skeleton'
import { cx } from '../../utils/cx'

export interface TableColumn<T> {
  key: string
  title: ReactNode
  width?: number | string
  align?: 'left' | 'center' | 'right'
  render?: (row: T, index: number) => ReactNode
}

export interface TableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  rowKey: keyof T | ((row: T) => string)
  selectable?: boolean
  selectedKeys?: string[]
  onSelectionChange?: (keys: string[]) => void
  onRowClick?: (row: T, index: number) => void
  size?: 'sm' | 'md'
  striped?: boolean
  loading?: boolean
  emptyText?: ReactNode
  maxHeight?: number | string
  stickyHeader?: boolean
  className?: string
  ariaLabel?: string
}

const toCssSize = (size: number | string): string =>
  typeof size === 'number' ? `${size}px` : size

const renderCellValue = (value: unknown): ReactNode => {
  if (value == null) return null
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint') {
    return String(value)
  }
  if (typeof value === 'boolean') return value ? '是' : '否'
  if (typeof value === 'object' && isValidElement(value)) return value
  if (Array.isArray(value)) return value.map((item) => String(item)).join('、')
  return null
}

/**
 * 数据表格 —— 泛型列定义，支持行选择、行点击、加载态、空态与吸顶表头。
 */
export function Table<T>({
  columns,
  data,
  rowKey,
  selectable = false,
  selectedKeys,
  onSelectionChange,
  onRowClick,
  size = 'md',
  striped = false,
  loading = false,
  emptyText = '暂无数据',
  maxHeight,
  stickyHeader = false,
  className,
  ariaLabel,
}: TableProps<T>) {
  const [uncontrolledKeys, setUncontrolledKeys] = useState<string[]>([])
  const currentKeys = selectedKeys ?? uncontrolledKeys
  const selectedSet = new Set(currentKeys)

  const getRowKey = (row: T): string =>
    typeof rowKey === 'function' ? rowKey(row) : String(row[rowKey])

  const rowKeys = data.map((row) => getRowKey(row))
  const allSelected = rowKeys.length > 0 && rowKeys.every((key) => selectedSet.has(key))
  const someSelected = !allSelected && rowKeys.some((key) => selectedSet.has(key))

  const updateSelection = (keys: string[]) => {
    setUncontrolledKeys(keys)
    onSelectionChange?.(keys)
  }

  const toggleAll = () => {
    updateSelection(allSelected ? [] : rowKeys)
  }

  const toggleRow = (key: string) => {
    updateSelection(
      selectedSet.has(key) ? currentKeys.filter((item) => item !== key) : [...currentKeys, key],
    )
  }

  const handleRowKeyDown = (row: T, index: number) => (event: KeyboardEvent<HTMLTableRowElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    onRowClick?.(row, index)
  }

  const columnCount = columns.length + (selectable ? 1 : 0)

  return (
    <div
      className={cx('aelux-table-wrapper', className)}
      style={maxHeight != null ? { maxHeight: toCssSize(maxHeight) } : undefined}
    >
      <table
        className={cx(
          'aelux-table',
          `aelux-table--${size}`,
          striped && 'aelux-table--striped',
          stickyHeader && 'aelux-table--sticky',
          loading && 'aelux-table--loading',
        )}
        aria-label={ariaLabel}
        aria-busy={loading || undefined}
      >
        <thead>
          <tr className="aelux-table__head-row">
            {selectable ? (
              <th scope="col" className="aelux-table__cell aelux-table__cell--select">
                <Checkbox
                  size={size}
                  checked={allSelected}
                  indeterminate={someSelected}
                  disabled={rowKeys.length === 0}
                  aria-label={allSelected ? '取消全选' : '全选'}
                  onChange={toggleAll}
                />
              </th>
            ) : null}
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cx(
                  'aelux-table__cell',
                  column.align && `aelux-table__cell--${column.align}`,
                )}
                style={column.width != null ? { width: toCssSize(column.width) } : undefined}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 3 }, (_, rowIndex) => (
              <tr key={`skeleton-${rowIndex}`} className="aelux-table__row aelux-table__row--skeleton">
                {selectable ? (
                  <td className="aelux-table__cell aelux-table__cell--select">
                    <Skeleton width={14} height={14} />
                  </td>
                ) : null}
                {columns.map((column, columnIndex) => (
                  <td key={column.key} className="aelux-table__cell">
                    <Skeleton height={12} width={columnIndex === 0 ? '62%' : '38%'} />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr className="aelux-table__row">
              <td className="aelux-table__cell aelux-table__cell--empty" colSpan={columnCount}>
                <div className="aelux-table__empty">{emptyText}</div>
              </td>
            </tr>
          ) : (
            data.map((row, index) => {
              const key = rowKeys[index]
              const isSelected = selectedSet.has(key)
              return (
                <tr
                  key={key}
                  className={cx(
                    'aelux-table__row',
                    onRowClick && 'aelux-table__row--clickable',
                    isSelected && 'aelux-table__row--selected',
                  )}
                  tabIndex={onRowClick ? 0 : undefined}
                  onClick={onRowClick ? () => onRowClick(row, index) : undefined}
                  onKeyDown={onRowClick ? handleRowKeyDown(row, index) : undefined}
                >
                  {selectable ? (
                    <td
                      className="aelux-table__cell aelux-table__cell--select"
                      onClick={(event) => event.stopPropagation()}
                      onKeyDown={(event) => event.stopPropagation()}
                    >
                      <Checkbox
                        size={size}
                        checked={isSelected}
                        aria-label={`选择第 ${index + 1} 行`}
                        onChange={() => toggleRow(key)}
                      />
                    </td>
                  ) : null}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cx(
                        'aelux-table__cell',
                        column.align && `aelux-table__cell--${column.align}`,
                      )}
                    >
                      {column.render
                        ? column.render(row, index)
                        : renderCellValue((row as Record<string, unknown>)[column.key])}
                    </td>
                  ))}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
