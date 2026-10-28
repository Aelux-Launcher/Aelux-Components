import { forwardRef } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** 宽度 */
  width?: number | string
  /** 高度 */
  height?: number | string
  /** 圆形占位 */
  circle?: boolean
  /** 段落行数（>1 时渲染多行） */
  lines?: number
  /** 收起光泽动画 */
  animated?: boolean
  /** loading 为 true（或未提供）时显示骨架 */
  loading?: boolean
  /** 加载完成后展示的内容 */
  children?: ReactNode
}

function toCssSize(value: number | string | undefined): string | undefined {
  if (value == null) return undefined
  return typeof value === 'number' ? `${value}px` : value
}

/**
 * 骨架屏 —— 支持文本块 / 圆形头像 / 多行段落，loading 结束后渲染真实内容。
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  {
    width,
    height,
    circle = false,
    lines = 1,
    animated = true,
    loading,
    children,
    className,
    ...rest
  },
  ref,
) {
  if (loading === false) {
    return <>{children}</>
  }

  const rootClassName = cx(
    'aelux-skeleton',
    animated && 'aelux-skeleton--animated',
    circle && 'aelux-skeleton--circle',
    lines > 1 && 'aelux-skeleton--lines',
    className,
  )

  if (lines > 1) {
    const lineHeight = toCssSize(height)
    return (
      <div
        ref={ref}
        className={rootClassName}
        style={width == null ? undefined : { width: toCssSize(width) }}
        aria-hidden="true"
        {...rest}
      >
        {Array.from({ length: lines }, (_, index) => (
          <div key={index} className="aelux-skeleton__line" style={{ height: lineHeight }} />
        ))}
      </div>
    )
  }

  return (
    <div ref={ref} className={rootClassName} aria-hidden="true" {...rest}>
      <div
        className={cx('aelux-skeleton__block', circle && 'aelux-skeleton__block--circle')}
        style={
          circle
            ? { width: toCssSize(width), height: toCssSize(height ?? width) }
            : { width: toCssSize(width), height: toCssSize(height) }
        }
      />
    </div>
  )
})

Skeleton.displayName = 'Skeleton'
