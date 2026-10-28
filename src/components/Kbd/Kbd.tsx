import { forwardRef } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface KbdProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  children: ReactNode
  size?: 'sm' | 'md'
}

/**
 * 键盘按键 —— 等宽字体、底部 1px 阴影的实体键帽。
 */
export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd(
  { size = 'md', className, children, ...rest },
  ref,
) {
  return (
    <kbd ref={ref} className={cx('aelux-kbd', `aelux-kbd--${size}`, className)} {...rest}>
      {children}
    </kbd>
  )
})

Kbd.displayName = 'Kbd'
