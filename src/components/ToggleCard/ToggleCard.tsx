import { forwardRef, useState } from 'react'
import type { ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface ToggleCardProps {
  /** 标题 */
  label: ReactNode
  /** 说明文字 */
  description?: ReactNode
  /** 左侧图标 */
  icon?: ReactNode
  /** 受控选中态 */
  checked?: boolean
  /** 非受控默认选中态 */
  defaultChecked?: boolean
  /** 选中态变化回调 */
  onChange?: (checked: boolean) => void
  /** 禁用整卡 */
  disabled?: boolean
  /** 尺寸，默认 md */
  size?: 'sm' | 'md'
  id?: string
  /** 额外类名 */
  className?: string
}

/**
 * 整卡开关 —— Modrinth SettingsToggleCard 风格：整块卡片可点击切换，
 * 右侧以开关视觉同步选中态，role=switch 暴露给辅助技术。
 */
export const ToggleCard = forwardRef<HTMLButtonElement, ToggleCardProps>(function ToggleCard(
  {
    label,
    description,
    icon,
    checked,
    defaultChecked,
    onChange,
    disabled = false,
    size = 'md',
    id,
    className,
  },
  ref,
) {
  const isControlled = checked !== undefined
  const [uncontrolledChecked, setUncontrolledChecked] = useState(() => defaultChecked ?? false)
  const currentChecked = isControlled ? checked : uncontrolledChecked

  const handleClick = () => {
    if (disabled) return
    const next = !currentChecked
    if (!isControlled) setUncontrolledChecked(next)
    onChange?.(next)
  }

  return (
    <button
      ref={ref}
      id={id}
      type="button"
      role="switch"
      aria-checked={currentChecked}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      className={cx(
        'aelux-toggle-card',
        `aelux-toggle-card--${size}`,
        currentChecked && 'aelux-toggle-card--checked',
        disabled && 'aelux-toggle-card--disabled',
        className,
      )}
      onClick={handleClick}
    >
      {icon != null ? (
        <span className="aelux-toggle-card__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}

      <span className="aelux-toggle-card__content">
        <span className="aelux-toggle-card__label">{label}</span>
        {description != null ? (
          <span className="aelux-toggle-card__desc">{description}</span>
        ) : null}
      </span>

      <span className="aelux-toggle-card__switch" aria-hidden="true">
        <span className="aelux-toggle-card__thumb" />
      </span>
    </button>
  )
})

ToggleCard.displayName = 'ToggleCard'
