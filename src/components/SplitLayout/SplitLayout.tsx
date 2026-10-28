import { forwardRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface SplitLayoutProps {
  left: ReactNode
  right: ReactNode
  /** 左栏宽度，默认 240 */
  leftWidth?: number | string
  rightWidth?: number | string
  /** 左右分栏比例（flex），与宽度二选一 */
  ratio?: [number, number]
  divider?: boolean
  leftLabel?: string
  rightLabel?: string
  className?: string
  height?: number | string
}

const toSize = (value: number | string) => (typeof value === 'number' ? `${value}px` : value)

/**
 * 两栏布局 —— 左栏固定宽度（或按 ratio 分栏），右栏自适应并独立滚动。
 * leftLabel / rightLabel 会作为两栏 region 的无障碍名称。
 */
export const SplitLayout = forwardRef<HTMLDivElement, SplitLayoutProps>(function SplitLayout(
  {
    left,
    right,
    leftWidth = 240,
    rightWidth,
    ratio,
    divider = false,
    leftLabel,
    rightLabel,
    className,
    height,
  },
  ref,
) {
  const rootStyle: CSSProperties | undefined = height === undefined ? undefined : { height: toSize(height) }
  const leftStyle: CSSProperties = ratio
    ? { flex: `${ratio[0]} 1 0` }
    : { flex: '0 0 auto', width: toSize(leftWidth) }
  const rightStyle: CSSProperties = ratio
    ? { flex: `${ratio[1]} 1 0` }
    : rightWidth === undefined
      ? { flex: '1 1 0' }
      : { flex: '0 0 auto', width: toSize(rightWidth) }

  return (
    <div ref={ref} className={cx('aelux-split', className)} style={rootStyle}>
      <div
        className="aelux-split__pane aelux-split__pane--left"
        style={leftStyle}
        role={leftLabel ? 'region' : undefined}
        aria-label={leftLabel}
      >
        {left}
      </div>
      {divider ? <span className="aelux-split__divider" aria-hidden="true" /> : null}
      <div
        className="aelux-split__pane aelux-split__pane--right"
        style={rightStyle}
        role={rightLabel ? 'region' : undefined}
        aria-label={rightLabel}
      >
        {right}
      </div>
    </div>
  )
})

SplitLayout.displayName = 'SplitLayout'
