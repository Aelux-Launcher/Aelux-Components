import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface SettingRowProps {
  label: ReactNode
  description?: ReactNode
  icon?: ReactNode
  children?: ReactNode
  status?: 'default' | 'warning' | 'danger'
  disabled?: boolean
  htmlFor?: string
  className?: string
}

export interface SettingSectionProps {
  title?: ReactNode
  description?: ReactNode
  icon?: ReactNode
  children: ReactNode
  footer?: ReactNode
  variant?: 'bordered' | 'plain'
  className?: string
}

/**
 * 设置分组 —— 标题 / 说明 / 行列表 / 页脚，bordered 与 plain 两种容器样式。
 */
export const SettingSection = forwardRef<HTMLElement, SettingSectionProps>(
  function SettingSection(
    { title, description, icon, children, footer, variant = 'bordered', className },
    ref,
  ) {
    const hasHeader = title != null || description != null || icon != null
    return (
      <section
        ref={ref}
        className={cx('aelux-setting', `aelux-setting--${variant}`, className)}
      >
        {hasHeader ? (
          <header className="aelux-setting__header">
            {icon != null ? (
              <span className="aelux-setting__icon" aria-hidden="true">
                {icon}
              </span>
            ) : null}
            <div className="aelux-setting__heading">
              {title != null ? <h3 className="aelux-setting__title">{title}</h3> : null}
              {description != null ? (
                <p className="aelux-setting__description">{description}</p>
              ) : null}
            </div>
          </header>
        ) : null}
        <div className="aelux-setting__body">{children}</div>
        {footer != null ? <div className="aelux-setting__footer">{footer}</div> : null}
      </section>
    )
  },
)

SettingSection.displayName = 'SettingSection'

/**
 * 设置行 —— 左侧标签 / 说明，右侧控件；行间 1px 分隔。
 */
export const SettingRow = forwardRef<HTMLDivElement, SettingRowProps>(function SettingRow(
  { label, description, icon, children, status = 'default', disabled = false, htmlFor, className },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx(
        'aelux-setting__row',
        `aelux-setting__row--${status}`,
        disabled && 'aelux-setting__row--disabled',
        children != null && 'aelux-setting__row--with-control',
        className,
      )}
      aria-disabled={disabled || undefined}
    >
      <div className="aelux-setting__row-main">
        {icon != null ? (
          <span className="aelux-setting__row-icon" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <div className="aelux-setting__row-text">
          {htmlFor != null ? (
            <label className="aelux-setting__label" htmlFor={htmlFor}>
              {label}
            </label>
          ) : (
            <span className="aelux-setting__label">{label}</span>
          )}
          {description != null ? (
            <span className="aelux-setting__row-description">{description}</span>
          ) : null}
        </div>
      </div>
      {children != null ? <div className="aelux-setting__control">{children}</div> : null}
    </div>
  )
})

SettingRow.displayName = 'SettingRow'
