import { forwardRef, useId } from 'react'
import type { ReactNode } from 'react'
import { IconCheck, IconMinus } from '../../icons'
import { cx } from '../../utils/cx'

export type InheritSwitchValue = 'inherit' | 'on' | 'off'

export interface InheritSwitchProps {
  /** 三态当前值 */
  value: InheritSwitchValue
  onChange: (value: InheritSwitchValue) => void
  /** 左侧标签 */
  label: ReactNode
  /** 标签下的一行说明 */
  description?: ReactNode
  /** “跟随全局”时的显示文案，默认“跟随全局” */
  inheritLabel?: string
  /** 全局开关状态，inherit 时展示为“(全局开启/关闭)” */
  globalValue?: 'on' | 'off'
  size?: 'sm' | 'md'
  disabled?: boolean
  id?: string
}

/** 三态循环顺序：跟随全局 -> 开启 -> 关闭 -> 跟随全局 */
const NEXT_VALUE: Record<InheritSwitchValue, InheritSwitchValue> = {
  inherit: 'on',
  on: 'off',
  off: 'inherit',
}

const VALUE_TEXT: Record<InheritSwitchValue, string> = {
  inherit: '跟随全局',
  on: '开启',
  off: '关闭',
}

/**
 * 三态继承开关 —— PCL2 / HMCL 风格的「跟随全局 / 开启 / 关闭」设置项。
 * 点击开关在三种状态间循环，inherit 时以 aria-checked="mixed" 暴露混合态。
 */
export const InheritSwitch = forwardRef<HTMLButtonElement, InheritSwitchProps>(
  function InheritSwitch(
    {
      value,
      onChange,
      label,
      description,
      inheritLabel = '跟随全局',
      globalValue,
      size = 'md',
      disabled = false,
      id,
    },
    ref,
  ) {
    const autoId = useId()
    const labelId = `${id ?? autoId}-label`

    const ariaChecked: boolean | 'mixed' = value === 'inherit' ? 'mixed' : value === 'on'
    const stateText = value === 'inherit' ? inheritLabel : VALUE_TEXT[value]
    const globalHint =
      value === 'inherit' && globalValue != null
        ? globalValue === 'on'
          ? '（全局开启）'
          : '（全局关闭）'
        : null
    const iconSize = size === 'sm' ? 8 : 9

    return (
      <div
        id={id}
        className={cx(
          'aelux-inherit-switch',
          `aelux-inherit-switch--${size}`,
          disabled && 'aelux-inherit-switch--disabled',
        )}
      >
        <div className="aelux-inherit-switch__content">
          <span id={labelId} className="aelux-inherit-switch__label">
            {label}
          </span>
          {description != null ? (
            <span className="aelux-inherit-switch__desc">{description}</span>
          ) : null}
        </div>

        <div className="aelux-inherit-switch__control">
          <button
            ref={ref}
            type="button"
            role="switch"
            aria-checked={ariaChecked}
            aria-labelledby={labelId}
            aria-disabled={disabled || undefined}
            disabled={disabled}
            className={cx(
              'aelux-inherit-switch__track',
              `aelux-inherit-switch__track--${value}`,
            )}
            onClick={() => onChange(NEXT_VALUE[value])}
          >
            <span className="aelux-inherit-switch__thumb" aria-hidden="true">
              {value === 'on' ? <IconCheck size={iconSize} /> : null}
              {value === 'inherit' ? <IconMinus size={iconSize} /> : null}
            </span>
          </button>

          <span className="aelux-inherit-switch__state">
            {stateText}
            {globalHint != null ? (
              <span className="aelux-inherit-switch__global">{globalHint}</span>
            ) : null}
          </span>
        </div>
      </div>
    )
  },
)

InheritSwitch.displayName = 'InheritSwitch'
