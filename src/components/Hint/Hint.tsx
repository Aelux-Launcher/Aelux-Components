import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import { IconError, IconInfo, IconSuccess, IconWarning } from '../../icons'
import { cx } from '../../utils/cx'

export type HintTone = 'default' | 'info' | 'success' | 'warning' | 'danger'

export interface HintProps {
  children: ReactNode
  tone?: HintTone
  icon?: ReactNode | false
  size?: 'sm' | 'md'
  className?: string
}

function defaultIcon(tone: HintTone, size: 'sm' | 'md'): ReactNode {
  const iconSize = size === 'sm' ? 14 : 15
  switch (tone) {
    case 'info':
      return <IconInfo size={iconSize} />
    case 'success':
      return <IconSuccess size={iconSize} />
    case 'warning':
      return <IconWarning size={iconSize} />
    case 'danger':
      return <IconError size={iconSize} />
    case 'default':
    default:
      return <IconInfo size={iconSize} />
  }
}

/**
 * 行内提示 —— 软色调背景 + 左侧图标的轻量说明条，适合表单辅助说明与状态反馈。
 * icon 传 false 可隐藏图标；不传时按 tone 使用默认图标。
 */
export const Hint = forwardRef<HTMLDivElement, HintProps>(function Hint(
  { children, tone = 'default', icon, size = 'md', className },
  ref,
) {
  const resolvedIcon = icon === false || icon === null ? null : (icon ?? defaultIcon(tone, size))

  return (
    <div ref={ref} className={cx('aelux-hint', `aelux-hint--${tone}`, `aelux-hint--${size}`, className)}>
      {resolvedIcon != null ? (
        <span className="aelux-hint__icon" aria-hidden="true">
          {resolvedIcon}
        </span>
      ) : null}
      <div className="aelux-hint__content">{children}</div>
    </div>
  )
})

Hint.displayName = 'Hint'
