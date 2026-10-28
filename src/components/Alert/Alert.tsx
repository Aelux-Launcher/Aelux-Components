import { forwardRef, useState } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'
import { IconClose, IconError, IconInfo, IconSuccess, IconWarning } from '../../icons'
import type { IconProps } from '../../icons'
import { cx } from '../../utils/cx'

export type AlertType = 'info' | 'success' | 'warning' | 'error'

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 类型，默认 info */
  type?: AlertType
  /** 标题 */
  title?: ReactNode
  /** 描述内容 */
  description?: ReactNode
  /** 是否显示图标，默认 true */
  showIcon?: boolean
  /** 是否可关闭 */
  closable?: boolean
  /** 关闭回调 */
  onClose?: () => void
  children?: ReactNode
}

const ALERT_ICONS: Record<AlertType, (props: IconProps) => ReactNode> = {
  info: IconInfo,
  success: IconSuccess,
  warning: IconWarning,
  error: IconError,
}

/**
 * 提示条 —— 4 种语义类型、软色调背景、左侧图标与可选关闭按钮。
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    type = 'info',
    title,
    description,
    showIcon = true,
    closable = false,
    onClose,
    className,
    children,
    ...rest
  },
  ref,
) {
  const [dismissed, setDismissed] = useState(false)
  const IconComponent = ALERT_ICONS[type]

  if (dismissed) return null

  const handleClose = () => {
    setDismissed(true)
    onClose?.()
  }

  return (
    <div
      ref={ref}
      role="alert"
      className={cx('aelux-alert', `aelux-alert--${type}`, className)}
      {...rest}
    >
      {showIcon ? (
        <span className="aelux-alert__icon" aria-hidden="true">
          <IconComponent size={16} />
        </span>
      ) : null}
      <div className="aelux-alert__content">
        {title != null ? <div className="aelux-alert__title">{title}</div> : null}
        {description != null ? <div className="aelux-alert__description">{description}</div> : null}
        {children}
      </div>
      {closable ? (
        <button
          type="button"
          className="aelux-alert__close"
          aria-label="关闭提示"
          onClick={handleClose}
        >
          <IconClose size={14} />
        </button>
      ) : null}
    </div>
  )
})

Alert.displayName = 'Alert'
