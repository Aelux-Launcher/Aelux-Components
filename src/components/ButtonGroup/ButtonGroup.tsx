import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface ButtonGroupProps {
  children: ReactNode
  /** 相邻按钮贴合成一组，默认 true */
  attached?: boolean
  vertical?: boolean
  block?: boolean
  size?: 'sm' | 'md' | 'lg'
  ariaLabel?: string
  /** 附加类名 */
  className?: string
}

/**
 * 按钮组 —— 把一组按钮排成一行（或一列），可贴合共用边框。
 */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  { children, attached = true, vertical = false, block = false, size = 'md', ariaLabel, className },
  ref,
) {
  return (
    <div
      ref={ref}
      role="group"
      aria-label={ariaLabel}
      className={cx(
        'aelux-button-group',
        attached && 'aelux-button-group--attached',
        vertical && 'aelux-button-group--vertical',
        block && 'aelux-button-group--block',
        size !== 'md' && `aelux-button-group--${size}`,
        className,
      )}
    >
      {children}
    </div>
  )
})

ButtonGroup.displayName = 'ButtonGroup'
