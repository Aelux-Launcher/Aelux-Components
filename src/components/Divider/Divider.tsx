import { forwardRef } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../utils/cx'

export type DividerOrientation = 'horizontal' | 'vertical'
export type DividerVariant = 'solid' | 'dashed'
export type DividerAlign = 'left' | 'center' | 'right'

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  /** 方向，默认 horizontal */
  orientation?: DividerOrientation
  /** 线条样式，默认 solid */
  variant?: DividerVariant
  /** 水平分割线中间标题 */
  children?: ReactNode
  /** 标题位置，默认 center（仅水平且带标题时生效） */
  align?: DividerAlign
}

/**
 * 分割线 —— 水平 / 垂直、实线 / 虚线，支持水平分割线中间标题与对齐方式。
 */
export const Divider = forwardRef<HTMLDivElement, DividerProps>(function Divider(
  {
    orientation = 'horizontal',
    variant = 'solid',
    align = 'center',
    className,
    children,
    ...rest
  },
  ref,
) {
  const isVertical = orientation === 'vertical'
  const hasText = !isVertical && children !== undefined && children !== null && children !== false

  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation={isVertical ? 'vertical' : 'horizontal'}
      className={cx(
        'aelux-divider',
        isVertical ? 'aelux-divider--vertical' : 'aelux-divider--horizontal',
        `aelux-divider--${variant}`,
        hasText && `aelux-divider--${align}`,
        className,
      )}
      {...rest}
    >
      {isVertical ? null : hasText ? (
        <>
          <span className="aelux-divider__line" />
          <span className="aelux-divider__text">{children}</span>
          <span className="aelux-divider__line" />
        </>
      ) : (
        <span className="aelux-divider__line" />
      )}
    </div>
  )
})

Divider.displayName = 'Divider'
