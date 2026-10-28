import { forwardRef } from 'react'
import type { CSSProperties, HTMLAttributes } from 'react'
import { cx } from '../../utils/cx'

export type SpaceDirection = 'horizontal' | 'vertical'
export type SpaceSize = 'sm' | 'md' | 'lg' | number
export type SpaceAlign = 'start' | 'center' | 'end' | 'stretch'

export interface SpaceProps extends HTMLAttributes<HTMLDivElement> {
  /** 排列方向，默认 horizontal */
  direction?: SpaceDirection
  /** 间距，默认 md（sm 6 / md 12 / lg 20），也可传像素数值 */
  size?: SpaceSize
  /** 交叉轴对齐，默认 center */
  align?: SpaceAlign
  /** 是否换行（仅水平方向有效） */
  wrap?: boolean
  /** 是否占满整行 */
  block?: boolean
}

/**
 * 间距 —— 基于 flex gap 实现，不给子元素添加 margin。
 */
export const Space = forwardRef<HTMLDivElement, SpaceProps>(function Space(
  {
    direction = 'horizontal',
    size = 'md',
    align = 'center',
    wrap = false,
    block = false,
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const numericSize = typeof size === 'number' ? size : undefined
  const mergedStyle: CSSProperties | undefined =
    numericSize === undefined ? style : { gap: numericSize, ...style }

  return (
    <div
      ref={ref}
      className={cx(
        'aelux-space',
        `aelux-space--${direction}`,
        numericSize === undefined && `aelux-space--${size}`,
        `aelux-space--align-${align}`,
        wrap && 'aelux-space--wrap',
        block && 'aelux-space--block',
        className,
      )}
      style={mergedStyle}
      {...rest}
    >
      {children}
    </div>
  )
})

Space.displayName = 'Space'
