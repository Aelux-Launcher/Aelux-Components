import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import { cx } from '../../utils/cx'

export type TimelineStatus = 'default' | 'success' | 'warning' | 'danger'

export interface TimelineItem {
  key: string
  title: ReactNode
  description?: ReactNode
  time?: ReactNode
  status?: TimelineStatus
  icon?: ReactNode
}

export interface TimelineProps {
  items: TimelineItem[]
  /** 时间显示在右侧，默认 false（显示在标题下） */
  timeRight?: boolean
  ariaLabel?: string
  className?: string
}

/**
 * 时间线 —— 版本历史 / 事件记录，节点支持语义色与自定义图标，时间可放在右侧。
 */
export const Timeline = forwardRef<HTMLOListElement, TimelineProps>(function Timeline(
  { items, timeRight = false, ariaLabel, className },
  ref,
) {
  return (
    <ol ref={ref} aria-label={ariaLabel} className={cx('aelux-timeline', className)}>
      {items.map((item) => (
        <li
          key={item.key}
          className={cx('aelux-timeline__item', `aelux-timeline__item--${item.status ?? 'default'}`)}
        >
          <span className="aelux-timeline__rail" aria-hidden="true">
            <span
              className={cx(
                'aelux-timeline__marker',
                item.icon != null && 'aelux-timeline__marker--icon',
              )}
            >
              {item.icon ?? null}
            </span>
          </span>
          <div className="aelux-timeline__content">
            <div className="aelux-timeline__head">
              <span className="aelux-timeline__title">{item.title}</span>
              {timeRight && item.time != null ? (
                <span className="aelux-timeline__time">{item.time}</span>
              ) : null}
            </div>
            {item.description != null ? (
              <p className="aelux-timeline__description">{item.description}</p>
            ) : null}
            {!timeRight && item.time != null ? (
              <div className="aelux-timeline__time">{item.time}</div>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  )
})

Timeline.displayName = 'Timeline'
