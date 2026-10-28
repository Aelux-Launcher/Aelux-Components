import { forwardRef } from 'react'
import type { SVGAttributes } from 'react'
import { cx } from '../utils/cx'

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, 'width' | 'height'> {
  /** 图标尺寸（像素），默认 16 */
  size?: number | string
}

/**
 * 图标基础组件：24x24 描边图标，颜色跟随 currentColor。
 * 一般不需要直接使用，请使用内置图标（如 IconCheck）或传入自定义 svg。
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon({ size = 16, className, children, ...rest }, ref) {
  return (
    <svg
      ref={ref}
      className={cx('aelux-icon', className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  )
})

Icon.displayName = 'Icon'
