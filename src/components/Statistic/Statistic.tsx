import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import { IconChevronDown, IconChevronUp, IconMinus } from '../../icons'
import { Skeleton } from '../Skeleton'
import { cx } from '../../utils/cx'

export interface StatisticProps {
  title?: ReactNode
  value: ReactNode
  prefix?: ReactNode
  suffix?: ReactNode
  precision?: number
  icon?: ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendText?: ReactNode
  hint?: ReactNode
  loading?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const TREND_ICONS: Record<'up' | 'down' | 'neutral', ReactNode> = {
  up: <IconChevronUp size={12} />,
  down: <IconChevronDown size={12} />,
  neutral: <IconMinus size={12} />,
}

const formatValue = (value: ReactNode, precision: number | undefined): ReactNode => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return value
  const digits = precision == null ? 0 : Math.max(0, Math.trunc(precision))
  return value.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

/**
 * 统计数值 —— 数字千分位与小数位格式化、趋势、图标与加载态。
 */
export const Statistic = forwardRef<HTMLDivElement, StatisticProps>(function Statistic(
  {
    title,
    value,
    prefix,
    suffix,
    precision,
    icon,
    trend,
    trendText,
    hint,
    loading = false,
    size = 'md',
    className,
  },
  ref,
) {
  const skeletonHeight = size === 'lg' ? 28 : size === 'sm' ? 16 : 22
  const hasFooter = trend != null || trendText != null || hint != null

  return (
    <div
      ref={ref}
      className={cx('aelux-statistic', `aelux-statistic--${size}`, className)}
      aria-busy={loading || undefined}
    >
      {title != null || icon != null ? (
        <div className="aelux-statistic__head">
          {icon != null ? (
            <span className="aelux-statistic__icon" aria-hidden="true">
              {icon}
            </span>
          ) : null}
          {title != null ? <span className="aelux-statistic__title">{title}</span> : null}
        </div>
      ) : null}

      {loading ? (
        <div className="aelux-statistic__skeleton">
          <Skeleton height={skeletonHeight} width="58%" />
        </div>
      ) : (
        <div className="aelux-statistic__value">
          {prefix != null ? <span className="aelux-statistic__prefix">{prefix}</span> : null}
          <span className="aelux-statistic__number">{formatValue(value, precision)}</span>
          {suffix != null ? <span className="aelux-statistic__suffix">{suffix}</span> : null}
        </div>
      )}

      {!loading && hasFooter ? (
        <div className="aelux-statistic__foot">
          {trend != null || trendText != null ? (
            <span
              className={cx(
                'aelux-statistic__trend',
                trend != null && `aelux-statistic__trend--${trend}`,
              )}
            >
              {trend != null ? (
                <span className="aelux-statistic__trend-icon" aria-hidden="true">
                  {TREND_ICONS[trend]}
                </span>
              ) : null}
              {trendText != null ? <span>{trendText}</span> : null}
            </span>
          ) : null}
          {hint != null ? <span className="aelux-statistic__hint">{hint}</span> : null}
        </div>
      ) : null}
    </div>
  )
})

Statistic.displayName = 'Statistic'
